// reloj.js — T1 (CONTRATO_UI Revisión 4, dueño RELOJ): reloj de 24 h y simulación en el tiempo.
//  · Barra "reloj" en la fila del caso (sustituye al control HORA): play/pausa, paso a paso (← →), velocidad ×60/×600/×3600,
//    paso 60/15/5 min, barra 00:00–24:00 con la curva de ocupación máxima de fondo y marca del pico.
//  · Pestaña TIEMPO del dock: DL por clase de servicio (apilado), % servido, ocupación máxima (bandas 60/85/100), nº de alarmas.
//  · Ficha de enlace/nodo: mini gráfica de 24 h con cursor.
//  · Mover el reloj pinta el resultado de ese paso (NOC.mostrarResultado) sin recalcular la serie; la serie se recalcula
//    solo al cambiar caso, fallos o paso.
// Serie: Motor.serieAsync (serie_worker.js; síncrono en file://). Cada paso mostrado se calcula entero con Motor.calcular.
(function () {
  "use strict";
  var NOC = window.NOC, Motor = window.Motor;
  if (!NOC || !NOC.RED || !Motor || typeof NOC.mostrarResultado !== "function") return;
  var RED = NOC.RED, t = NOC.t, fmt = NOC.fmt;
  var esc = NOC.esc || function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function copia(o) { return JSON.parse(JSON.stringify(o || {})); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function ahora() { return (window.performance || Date).now(); }

  var CLASES = Motor.CLASES_SERVICIO || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var NOMSV = {
    movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo", en: "FTTH fixed" }, voz: { es: "Voz", en: "Voice" },
    urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT", en: "IoT" }, empresa: { es: "Empresa", en: "Enterprise" },
    evento: { es: "Evento (MEC)", en: "Event (MEC)" }, ntn: { es: "Satélite NTN", en: "NTN satellite" }
  };
  function nomSv(c) { var i = NOC.infoServicio && NOC.infoServicio[c]; return t((i && i.n) || NOMSV[c] || { es: c }); }

  var TX = {
    hora: { es: "Hora", en: "Hour" }, hc: { es: "HC", en: "BH" },
    play: { es: "Reproducir / pausa", en: "Play / pause" }, atras: { es: "Paso atrás  (←)", en: "Step back  (←)" },
    adelante: { es: "Paso adelante  (→)", en: "Step forward  (→)" }, vel: { es: "Velocidad de reproducción", en: "Playback speed" },
    paso: { es: "Paso de la simulación", en: "Simulation step" },
    volverHC: { es: "Volver a la hora cargada (resultado de dimensionado)", en: "Back to the busy hour (dimensioning result)" },
    barra: { es: "Clic o arrastre: saltar a esa hora", en: "Click or drag: jump to that time" },
    calculando: { es: "calculando serie…", en: "computing series…" },
    noDisp: { es: "Película no disponible para este caso", en: "Time series not available for this case" },
    pico: { es: "pico", en: "peak" }, ocMax: { es: "Ocup. máx.", en: "Max. occ." }
  };

  // ---------- estado ----------
  var VELS = [60, 600, 3600], PASOS = [60, 15, 5];
  var S = {
    paso: PASOS.indexOf(Number(leer("noc.reloj.paso"))) >= 0 ? Number(leer("noc.reloj.paso")) : 15,
    vel: VELS.indexOf(Number(leer("noc.reloj.vel"))) >= 0 ? Number(leer("noc.reloj.vel")) : 600,
    t: null, i: -1, pelicula: false, play: false,
    serie: null, estado: "nada", error: "", clave: null, gen: 0, genPint: 0,
    base: null, baseOp: null, cargada: true, cacheP: {}, motorCache: {}, fuente: "", ms: 0
  };

  function defModelo(id) {
    var ms = (RED.modelos_trafico && RED.modelos_trafico.modelos) || [];
    for (var i = 0; i < ms.length; i++) if (ms[i].id === id) return ms[i];
    return null;
  }
  function cargadaCaso() {
    var id = NOC.modo === "ref" ? "BH" : (NOC.caso && NOC.caso.trafico) || "BH";
    var d = defModelo(id);
    return d ? !!d.hora_cargada : true;
  }
  function horaCargada() {
    var op = S.baseOp || {}, ev = op.escenario || (op.caso && op.caso.evento);
    var e = (RED.escenarios || []).filter(function (x) { return x.id === ev; })[0];
    return e && esNum(e.hora) ? e.hora : 21;
  }
  function sinHora(op) {
    var o = copia(op);
    delete o.hora;
    if (o.caso && o.caso.trafico && typeof o.caso.trafico === "object") delete o.caso.trafico.hora;
    return o;
  }
  function conHora(op, h) {
    var o = sinHora(op);
    if (o.caso && o.caso.trafico && typeof o.caso.trafico === "object") o.caso.trafico.hora = h;
    else o.hora = h;
    return o;
  }
  // Revisión 7 (operador.js): eventos del caso LAB que se pasan a Motor.serie
  function eventosSerie() { try { return NOC.operador && NOC.operador.eventosSerie ? NOC.operador.eventosSerie() : []; } catch (e) { return []; } }
  function claveCaso() { return JSON.stringify([NOC.modo, sinHora(S.baseOp), S.paso, NOC.paramsEditados || 0, eventosSerie()]); }

  var oyentesSerie = [];
  // ---------- serie (Motor.serieAsync → serie_worker.js; Motor.serie síncrono si no hay worker) ----------
  // Unidades del contrato: enlaces[id].ocup en %, carga en Gbit/s; hasta exclusivo (24/96/288 pasos).
  function normalizar(s) {
    s = s || {};
    s.pasos = s.pasos || []; s.enlaces = s.enlaces || {}; s.nodos = s.nodos || {};
    S.dt = s.paso_min || (s.pasos.length > 1 ? s.pasos[1].t_min - s.pasos[0].t_min : S.paso);
    // Alarmas como las cuenta app.js (pestaña ALARMAS): alertas del motor + enlaces entre 85 y 100 % (umbral de operación)
    var ids = Object.keys(s.enlaces);
    s.pasos.forEach(function (p, i) {
      var r = p.resumen || (p.resumen = {}), u = 0;
      ids.forEach(function (id) { var o = s.enlaces[id].ocup; if (o && o[i] >= 85 && o[i] <= 100.01) u++; });
      r.n_alarmas_noc = (r.n_alarmas || 0) + u;
    });
    return s;
  }
  function serieOk() { return !!(S.serie && S.serie.pasos.length); }
  function calcularSerie() {
    var gen = ++S.gen, op = sinHora(S.baseOp), opts = { paso_min: S.paso, desde: 0, hasta: 24, fallos: [], eventos: eventosSerie() }, t0 = ahora();
    S.estado = "calculando"; S.serie = null; S.error = ""; S.cacheP = {}; S.motorCache = {};
    pintarTodo();
    function fin(s) {
      if (gen !== S.gen) return;
      S.serie = normalizar(s);
      S.fuente = s.via || "";
      S.ms = Math.round(esNum(s.ms) ? s.ms : ahora() - t0);
      S.estado = serieOk() ? "ok" : "no";
      S.genPint++;
      oyentesSerie.forEach(function (f) { try { f(S.serie); } catch (e) { console.error("reloj: oyente de serie", e); } });
      if (!serieOk()) { parar(); if (S.cargada && S.pelicula) volverHC(); }
      else if (S.pelicula) irA(S.t == null ? 0 : S.t, true);
      pintarTodo();
    }
    function mal(e) {
      if (gen !== S.gen) return;
      console.error("Motor.serie", e);
      S.estado = "error"; S.error = String(e && e.message || e);
      parar(); pintarTodo();
    }
    if (typeof Motor.serieAsync === "function") {
      try { Motor.serieAsync(RED, op, opts).then(fin, mal); } catch (e) { mal(e); }
    } else if (typeof Motor.serie === "function") {
      setTimeout(function () { try { fin(Motor.serie(RED, op, opts)); } catch (e) { mal(e); } }, 15);
    } else {
      S.estado = "no"; S.error = "Motor.serie no disponible"; pintarTodo();
    }
  }

  // ---------- resultado de un paso ----------
  // El paso i se calcula entero con Motor.calcular a esa hora (fraccionaria), con los mismos ajustes que usa Motor.serie
  // (perfil_horario en casos de hora cargada, fallos del paso): rutas, demandas y alarmas exactas del paso, ≈2–5 ms.
  // Se guarda en caché por paso; la serie no se recalcula al mover el reloj.
  function resultadoPaso(i) {
    if (S.cacheP[i]) return S.cacheP[i];
    var p = S.serie.pasos[i], o = sinHora(S.baseOp);
    o.hora = p.t_min / 60;
    if (S.serie.hora_cargada) o.perfil_horario = true;
    if (Array.isArray(p.fallos)) o.fallos_exactos = p.fallos.slice();
    // Revisión 7: estado de eventos/acciones del paso (si el motor lo da) para que el paso pintado = paso de la serie
    if (p.opciones_paso && typeof p.opciones_paso === "object") Object.keys(p.opciones_paso).forEach(function (k) { o[k] = p.opciones_paso[k]; });
    if (typeof Motor.opcionesPaso === "function") { try { o = Motor.opcionesPaso(o, S.serie, i) || o; } catch (e) { console.error("Motor.opcionesPaso", e); } }
    o._cache = S.motorCache;
    var r = Motor.calcular(RED, o);
    r.paso_reloj = { t_min: p.t_min, i: i, paso_min: S.dt, etiqueta: p.etiqueta || hhmm(p.t_min) };
    var ks = Object.keys(S.cacheP);
    if (ks.length > 400) S.cacheP = {};
    S.cacheP[i] = r;
    return r;
  }
  function indice(tm) {
    var s = S.serie;
    if (!s || !s.pasos.length) return -1;
    var t0 = s.pasos[0].t_min, i = Math.round((tm - t0) / (S.dt || S.paso));
    return Math.max(0, Math.min(s.pasos.length - 1, i));
  }
  var rafPaso = 0, pendiente = -1;
  function mostrarPaso(i, inmediato) {
    pendiente = i;
    if (inmediato) { aplicarPaso(); return; }
    if (rafPaso) return;
    rafPaso = requestAnimationFrame(function () { rafPaso = 0; aplicarPaso(); });
  }
  function aplicarPaso() {
    var i = pendiente;
    if (!serieOk() || i < 0) return;
    var p = S.serie.pasos[i], h = Math.floor(p.t_min / 60) % 24;
    S.i = i; S.t = p.t_min;
    guardar("noc.reloj.t", String(S.t));
    var r;
    try { r = resultadoPaso(i); } catch (e) { console.error("reloj: cálculo del paso", e); return; }
    var op = S.cargada ? S.baseOp : conHora(S.baseOp, h);
    if (!S.cargada && NOC.caso && NOC.caso.hora !== h) { NOC.caso.hora = h; guardar("noc.caso", JSON.stringify(NOC.caso)); }
    NOC.mostrarResultado(r, op, { reloj: true, t_min: p.t_min, i: i });
    pintarCursores();
  }
  function irA(tm, inmediato) {
    if (!serieOk()) return;
    if (!S.pelicula) S.pelicula = true;
    var i = indice(((tm % 1440) + 1440) % 1440 === 0 && tm >= 1440 ? 0 : tm);
    mostrarPaso(i, inmediato);
    S.t = S.serie.pasos[i].t_min;
    pintarCursores();
    pintarReloj();
  }
  function avanzar(k) {
    if (!serieOk()) return;
    var n = S.serie.pasos.length, i0 = S.pelicula && S.i >= 0 ? S.i : indice(S.t == null ? 0 : S.t);
    var i = (((i0 + k) % n) + n) % n;
    if (!S.pelicula) S.pelicula = true;
    S.t = S.serie.pasos[i].t_min;
    mostrarPaso(i);
    pintarCursores(); pintarReloj();
  }
  function volverHC() {
    parar();
    S.pelicula = false; S.i = -1; S.t = horaCargada() * 60;
    if (S.base) NOC.mostrarResultado(S.base, S.baseOp, { reloj: true, hc: true });
    pintarTodo();
  }

  // ---------- reproducción ----------
  var rafPlay = 0, ultimo = 0, acum = 0;
  function tick(ts) {
    if (!S.play) { rafPlay = 0; return; }
    var dt = Math.min(0.5, Math.max(0, (ts - ultimo) / 1000));
    ultimo = ts;
    acum += dt * S.vel;
    var pasoS = (S.dt || S.paso) * 60;
    if (acum >= pasoS) {
      var k = Math.floor(acum / pasoS);
      acum -= k * pasoS;
      avanzar(k);
    } else pintarCursorFino();
    rafPlay = requestAnimationFrame(tick);
  }
  function jugar() {
    if (!serieOk()) return;
    if (S.play) { parar(); pintarReloj(); return; }
    if (!S.pelicula) irA(S.t == null ? 0 : S.t, true);
    S.play = true; acum = 0; ultimo = ahora();
    rafPlay = requestAnimationFrame(tick);
    pintarReloj();
  }
  function parar() { S.play = false; if (rafPlay) cancelAnimationFrame(rafPlay); rafPlay = 0; }

  // ---------- captura del caso (cada "resultado" que no viene del reloj) ----------
  function capturar() {
    var m = NOC.resultadoMeta;
    if (m && m.reloj) return;
    if (!NOC.resultado) return;
    S.base = NOC.resultado; S.baseOp = NOC.opciones || {};
    var eraCargada = S.cargada;
    S.cargada = cargadaCaso();
    var k = claveCaso();
    if (!S.cargada) {
      var h = NOC.resultado.resumen && esNum(NOC.resultado.resumen.hora) ? NOC.resultado.resumen.hora : (NOC.caso ? NOC.caso.hora : 0);
      S.pelicula = true;
      if (S.t == null || Math.floor(S.t / 60) % 24 !== h) S.t = h * 60;
    } else {
      if (!eraCargada || S.t == null) S.t = horaCargada() * 60;
      if (k !== S.clave) S.pelicula = false;   // nuevo caso de hora cargada: se abre en la hora cargada (resultado exacto)
    }
    if (k !== S.clave) { S.clave = k; parar(); calcularSerie(); return; }
    // mismo caso: si hay un paso intermedio en pantalla, se vuelve a poner encima
    if (serieOk() && S.pelicula && (S.cargada || S.t % 60 !== 0)) irA(S.t);
    else pintarTodo();
  }

  // ---------- SVG ----------
  var NS = "http://www.w3.org/2000/svg";
  function bandas(y, x0, x1, ymax, alto) {
    // bandas de ocupación 60/85/100 (fondo tenue) y umbrales en línea fina
    var h = "";
    [[60, 85, "min"], [85, 100, "maj"], [100, Math.max(100, ymax), "crit"]].forEach(function (b) {
      if (b[1] <= b[0]) return;
      var ya = y(Math.min(b[1], ymax)), yb = y(b[0]);
      if (yb <= ya) return;
      h += '<rect x="' + x0 + '" y="' + ya.toFixed(1) + '" width="' + (x1 - x0) + '" height="' + (yb - ya).toFixed(1) + '" fill="var(--' + b[2] + ')" opacity=".1"/>';
    });
    [60, 85, 100].forEach(function (v, k) {
      if (v > ymax) return;
      h += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="var(--' + ["min", "maj", "crit"][k] + ')" stroke-width="1" opacity=".55"/>';
    });
    return h;
  }
  function ruta(xs, ys) {
    var d = "";
    for (var i = 0; i < xs.length; i++) d += (i ? "L" : "M") + xs[i].toFixed(1) + " " + ys[i].toFixed(1);
    return d;
  }
  function ticksY(min, max, n) {
    var paso = (max - min) / (n || 3), mag = Math.pow(10, Math.floor(Math.log10(paso || 1))), m = paso / mag;
    paso = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * mag;
    var out = [];
    for (var v = Math.ceil(min / paso) * paso; v <= max + 1e-9; v += paso) out.push(v);
    return out;
  }
  function compacto(v) {
    var a = Math.abs(v);
    if (a >= 10000) return fmt(v / 1000, a >= 100000 ? 0 : 1) + "k";
    return fmt(v, a < 10 && v % 1 ? 1 : 0);
  }
  // Gráfica genérica 0–24 h. cfg: {w, h, ymin, ymax, capas(svg), lineas:[{vals,color,area}], apilado:[{vals,color}], unidad, ejeX}
  function grafica(cfg) {
    var w = Math.max(80, cfg.w), h = Math.max(40, cfg.h), ml = cfg.ml != null ? cfg.ml : 34, mr = 6, mt = 5, mb = cfg.ejeX === false ? 3 : 14;
    var x0 = ml, x1 = w - mr, y0 = h - mb, y1 = mt;
    var ymin = cfg.ymin, ymax = cfg.ymax;
    function X(tm) { return x0 + (tm / 1440) * (x1 - x0); }
    function Y(v) { return y0 - (v - ymin) / (ymax - ymin || 1) * (y0 - y1); }
    var g = '<svg class="rl-g" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" data-x0="' + x0 + '" data-x1="' + x1 + '" data-y0="' + y0 + '" data-y1="' + y1 + '" role="img" aria-label="' + esc(cfg.titulo || "") + '">';
    // rejilla y ejes
    ticksY(ymin, ymax, cfg.nticks || 3).forEach(function (v) {
      g += '<line class="rl-rej" x1="' + x0 + '" x2="' + x1 + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>';
      if (ml > 0) g += '<text class="rl-ty" x="' + (x0 - 4) + '" y="' + (Y(v) + 3).toFixed(1) + '">' + compacto(v) + '</text>';
    });
    if (cfg.capas) g += cfg.capas(X, Y, x0, x1);
    var tms = cfg.tms;
    (cfg.apilado || []).forEach(function (s) {
      var xs = tms.map(X), sup = s.hasta.map(Y), inf = s.desde.map(Y);
      var d = ruta(xs, sup) + "L" + xs.slice().reverse().map(function (x, k) { return x.toFixed(1) + " " + inf[inf.length - 1 - k].toFixed(1); }).join("L") + "Z";
      g += '<path d="' + d + '" fill="' + s.color + '" fill-opacity=".8" stroke="var(--bg0)" stroke-width="1" stroke-linejoin="round"/>';
    });
    (cfg.lineas || []).forEach(function (s) {
      var xs = tms.map(X), ys = s.vals.map(Y), d = ruta(xs, ys);
      if (s.escalon) {
        d = "";
        for (var i = 0; i < xs.length; i++) d += (i ? "H" + xs[i].toFixed(1) + "V" : "M" + xs[i].toFixed(1) + " ") + ys[i].toFixed(1);
        d += "H" + x1;
      }
      if (s.area) g += '<path d="' + d + "L" + (s.escalon ? x1 : xs[xs.length - 1]).toFixed(1) + " " + y0 + "L" + xs[0].toFixed(1) + " " + y0 + 'Z" fill="' + s.color + '" opacity=".1"/>';
      g += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="' + (s.ancho || 2) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    });
    if (cfg.ejeX !== false) {
      g += '<line class="rl-eje" x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '"/>';
      [0, 6, 12, 18, 24].forEach(function (hh) {
        var x = X(hh * 60);
        g += '<text class="rl-tx" x="' + x.toFixed(1) + '" y="' + (h - 2) + '" text-anchor="' + (hh === 0 ? "start" : hh === 24 ? "end" : "middle") + '">' + pad(hh) + '</text>';
      });
    }
    if (cfg.extra) g += cfg.extra(X, Y, x0, x1, y0, y1);
    g += '<line class="rl-hover" x1="0" x2="0" y1="' + y1 + '" y2="' + y0 + '" visibility="hidden"/>';
    g += '<line class="rl-cursor" x1="0" x2="0" y1="' + (y1 - 2) + '" y2="' + y0 + '"/>';
    g += '<rect class="rl-hit" x="' + x0 + '" y="0" width="' + (x1 - x0) + '" height="' + h + '" fill="transparent"/>';
    return g + '</svg>';
  }
  function colSv(c) { return "var(--sv-" + c + ")"; }
  function svDe(p, c) { var x = p.resumen.por_servicio && p.resumen.por_servicio[c]; return x == null ? 0 : esNum(x) ? x : (x.dl_gbps || x.gbps || 0); }

  // ---------- barra del reloj (fila del caso) ----------
  var ICO = {
    play: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2 10 6 3 10Z" fill="currentColor" stroke="none"/></svg>',
    pausa: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" stroke="none"/></svg>',
    atras: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2v8M10 2 4 6l6 4Z" fill="currentColor"/></svg>',
    adelante: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M10 2v8M2 2l6 4-6 4Z" fill="currentColor"/></svg>'
  };
  var elReloj = null;
  function montarBarra() {
    var tb = document.getElementById("tb");
    if (!tb) return;
    var hora = tb.querySelector(".caso .hora");
    if (hora) {
      var prev = hora.previousElementSibling;
      if (prev && prev.classList.contains("sep")) prev.remove();
      hora.remove();
    }
    var caso = tb.querySelector(".caso");
    if (!caso) return;
    elReloj = document.createElement("div");
    elReloj.className = "reloj"; elReloj.id = "reloj";
    elReloj.setAttribute("role", "group");
    elReloj.setAttribute("aria-label", t({ es: "Reloj de simulación", en: "Simulation clock" }));
    caso.parentNode.insertBefore(elReloj, caso.nextSibling);
    pintarReloj();
  }
  function optSel(lista, val, txt) { return lista.map(function (v) { return '<option value="' + v + '"' + (v === val ? " selected" : "") + '>' + txt(v) + '</option>'; }).join(""); }
  function pintarReloj() {
    if (!elReloj || !elReloj.isConnected) { elReloj = null; montarBarra(); if (!elReloj) return; }
    var ok = serieOk(), hc = S.cargada && !S.pelicula;
    var horaTxt = hc ? '<span class="hc">' + esc(t(TX.hc)) + '</span>' + hhmm(horaCargada() * 60) : hhmm(S.t == null ? 0 : S.t);
    var estado = S.estado === "calculando" ? '<span class="rl-est">' + esc(t(TX.calculando)) + '</span>' :
      S.estado === "error" ? '<span class="rl-est mal" title="' + esc(S.error) + '">ERROR</span>' : "";
    var aviso = S.serie && S.serie.aviso ? '<span class="rl-aviso" tabindex="0" title="' + esc(S.serie.aviso) + '">' + (ok ? "i" : "!") + '</span>' : "";
    elReloj.className = "reloj" + (ok ? "" : " sin-serie") + (S.play ? " jugando" : "") + (hc ? " en-hc" : "");
    elReloj.innerHTML =
      '<span class="rot">' + esc(t(TX.hora)) + '</span>' +
      '<button type="button" class="btn rl-b" data-rl="atras" title="' + esc(t(TX.atras)) + '" aria-label="' + esc(t(TX.atras)) + '"' + (ok ? "" : " disabled") + '>' + ICO.atras + '</button>' +
      '<button type="button" class="btn rl-b' + (S.play ? " prim" : "") + '" data-rl="play" title="' + esc(t(TX.play)) + '" aria-label="' + esc(t(TX.play)) + '" aria-pressed="' + S.play + '"' + (ok ? "" : " disabled") + '>' + (S.play ? ICO.pausa : ICO.play) + '</button>' +
      '<button type="button" class="btn rl-b" data-rl="adelante" title="' + esc(t(TX.adelante)) + '" aria-label="' + esc(t(TX.adelante)) + '"' + (ok ? "" : " disabled") + '>' + ICO.adelante + '</button>' +
      '<output class="rl-hora mono" aria-live="off">' + horaTxt + '</output>' +
      '<div class="rl-barra" data-rl-barra title="' + esc(ok ? t(TX.barra) : (S.serie && S.serie.aviso) || t(TX.noDisp)) + '">' + barraSVG() + '</div>' +
      '<select class="sel rl-sel" data-rl="vel" title="' + esc(t(TX.vel)) + '" aria-label="' + esc(t(TX.vel)) + '">' + optSel(VELS, S.vel, function (v) { return "×" + v; }) + '</select>' +
      '<select class="sel rl-sel" data-rl="paso" title="' + esc(t(TX.paso)) + '" aria-label="' + esc(t(TX.paso)) + '">' + optSel(PASOS, S.paso, function (v) { return v + " min"; }) + '</select>' +
      (S.cargada && S.pelicula ? '<button type="button" class="btn rl-b" data-rl="hc" title="' + esc(t(TX.volverHC)) + '">' + esc(t(TX.hc)) + '</button>' : '') +
      aviso + estado;
  }
  var BW = 220, BH = 22;
  function barraSVG() {
    var s = S.serie, g = '<svg class="rl-spark" width="' + BW + '" height="' + BH + '" viewBox="0 0 ' + BW + ' ' + BH + '" preserveAspectRatio="none" aria-hidden="true">';
    g += '<rect x="0" y="0" width="' + BW + '" height="' + BH + '" fill="var(--bg0)"/>';
    for (var hh = 0; hh <= 24; hh += 6) g += '<line class="rl-rej" x1="' + (hh / 24 * BW).toFixed(1) + '" x2="' + (hh / 24 * BW).toFixed(1) + '" y1="0" y2="' + BH + '"/>';
    if (serieOk()) {
      var vals = s.pasos.map(function (p) { return p.resumen.ocup_max_pct || 0; });
      var ymax = Math.max(110, Math.max.apply(null, vals) * 1.05);
      var Y = function (v) { return BH - 1 - v / ymax * (BH - 3); }, X = function (tm) { return tm / 1440 * BW; };
      [[60, "min"], [85, "maj"], [100, "crit"]].forEach(function (b) { g += '<line x1="0" x2="' + BW + '" y1="' + Y(b[0]).toFixed(1) + '" y2="' + Y(b[0]).toFixed(1) + '" stroke="var(--' + b[1] + ')" opacity=".45"/>'; });
      var xs = s.pasos.map(function (p) { return X(p.t_min); }), ys = vals.map(Y);
      g += '<path d="' + ruta(xs, ys) + "L" + xs[xs.length - 1].toFixed(1) + " " + BH + "L" + xs[0].toFixed(1) + " " + BH + 'Z" fill="var(--tx1)" opacity=".1"/>';
      g += '<path d="' + ruta(xs, ys) + '" fill="none" stroke="var(--tx2)" stroke-width="1.5" stroke-linejoin="round"/>';
      if (s.pico) {
        var px = X(s.pico.t_min);
        g += '<path class="rl-pico" d="M' + (px - 4).toFixed(1) + ' 0H' + (px + 4).toFixed(1) + 'L' + px.toFixed(1) + ' 5Z"><title>' + esc(t(TX.pico) + " " + hhmm(s.pico.t_min) + " · " + fmt(s.pico.ocup_max_pct, 1) + " % " + (s.pico.id || "")) + '</title></path>';
      }
    } else {
      g += '<text class="rl-tx" x="' + (BW / 2) + '" y="' + (BH / 2 + 3) + '" text-anchor="middle">' + esc(S.estado === "calculando" ? t(TX.calculando) : t(TX.noDisp)) + '</text>';
    }
    var tc = S.cargada && !S.pelicula ? horaCargada() * 60 : (S.t || 0);
    g += '<line class="rl-cursor' + (S.cargada && !S.pelicula ? " hc" : "") + '" x1="' + (tc / 1440 * BW).toFixed(1) + '" x2="' + (tc / 1440 * BW).toFixed(1) + '" y1="0" y2="' + BH + '"/>';
    return g + '</svg>';
  }

  // ---------- pestaña TIEMPO ----------
  var elTiempo = null;
  function cuerpoAlto() { var c = document.getElementById("dock-cuerpo"); return c ? c.clientHeight : 200; }
  function pintarTiempo(el) {
    elTiempo = el;
    var firma = S.genPint + "|" + NOC.lang + "|" + el.clientWidth + "|" + cuerpoAlto() + "|" + S.estado;
    if (el.getAttribute("data-firma") !== firma) {
      el.setAttribute("data-firma", firma);
      el.innerHTML = htmlTiempo(el.clientWidth || 900, cuerpoAlto());
    }
    pintarCursores();
  }
  function htmlTiempo(W, Halto) {
    var s = S.serie;
    var cab = '<div class="rl-cab"><span class="lbl">' + esc(t({ es: "Simulación en el tiempo", en: "Time simulation" })) + '</span>';
    if (S.estado === "calculando") return cab + '<span class="tx3">' + esc(t(TX.calculando)) + '</span></div>';
    if (!serieOk()) {
      return cab + '</div><div class="rl-vacio"><b>' + esc(t(TX.noDisp)) + '.</b> ' + esc(S.error || (s && s.aviso) || "") + '</div>';
    }
    cab += '<span class="rl-ley">' + CLASES.filter(function (c) { return s.pasos.some(function (p) { return svDe(p, c) > 1e-6; }); }).map(function (c) {
      return '<span class="rl-ley-i"><i style="background:' + colSv(c) + '"></i>' + esc(nomSv(c)) + '</span>';
    }).join("") + '</span>' +
      '<span class="rl-meta tx3">' + esc(S.serie.pasos.length + " " + t({ es: "pasos", en: "steps" }) + " · " + S.dt + " min · " +
        "Motor.serie" + (S.fuente ? " (" + (S.fuente === "worker" ? "worker" : t({ es: "síncrono", en: "sync" })) + ")" : "") + " · " + S.ms + " ms") +
      (s.aviso ? ' <span class="rl-aviso" tabindex="0" title="' + esc(s.aviso) + '">i</span>' : '') + '</span></div>';
    var h = Math.max(70, Halto - 48), gap = 10, wTot = Math.max(600, W - 16);
    var wDL = Math.floor((wTot - 3 * gap) * 0.34), wo = Math.floor((wTot - 3 * gap - wDL) / 3);
    var tms = s.pasos.map(function (p) { return p.t_min; });
    // 1. DL por clase (apilado)
    var acum = tms.map(function () { return 0; }), capas = [], presentes = CLASES.filter(function (c) { return s.pasos.some(function (p) { return svDe(p, c) > 1e-6; }); });
    presentes.forEach(function (c) {
      var desde = acum.slice();
      s.pasos.forEach(function (p, i) { acum[i] += svDe(p, c); });
      capas.push({ color: colSv(c), desde: desde, hasta: acum.slice() });
    });
    var dlMax = Math.max.apply(null, acum.concat(s.pasos.map(function (p) { return p.resumen.dl_total_gbps || 0; })));
    var tDL = ticksY(0, dlMax * 1.05, 3);
    var g1 = grafica({ w: wDL, h: h, ymin: 0, ymax: Math.max(dlMax * 1.05, tDL[tDL.length - 1] || 1), tms: tms, apilado: capas, titulo: "DL", ml: 40 });
    // 2. % servido
    var sv = s.pasos.map(function (p) { return p.resumen.servido_pct; }), svMin = Math.min.apply(null, sv);
    var g2 = grafica({ w: wo, h: h, ymin: Math.min(98, Math.floor(svMin - 1)), ymax: 100.5, tms: tms, lineas: [{ vals: sv, color: "var(--tx1)" }], titulo: "%" });
    // 3. ocupación máxima con bandas
    var oc = s.pasos.map(function (p) { return p.resumen.ocup_max_pct || 0; }), ocMax = Math.max(110, Math.max.apply(null, oc) * 1.05);
    var g3 = grafica({ w: wo, h: h, ymin: 0, ymax: ocMax, tms: tms, lineas: [{ vals: oc, color: "var(--tx1)" }], titulo: "%",
      capas: function (X, Y, x0, x1) { return bandas(Y, x0, x1, ocMax); },
      extra: function (X, Y) {
        if (!s.pico) return "";
        return '<circle cx="' + X(s.pico.t_min).toFixed(1) + '" cy="' + Y(s.pico.ocup_max_pct).toFixed(1) + '" r="4" fill="var(--tx1)" stroke="var(--bg0)" stroke-width="2"/>';
      } });
    // 4. alarmas
    var al = s.pasos.map(function (p) { return p.resumen.n_alarmas_noc || 0; }), alMax = Math.max(4, Math.max.apply(null, al) + 1);
    var g4 = grafica({ w: wo, h: h, ymin: 0, ymax: alMax, tms: tms, lineas: [{ vals: al, color: "var(--tx1)", escalon: true, area: true }], titulo: "n", nticks: 2 });
    function panel(id, tit, w, svg) {
      return '<div class="rl-p" data-g="' + id + '" style="width:' + w + 'px"><div class="rl-pt"><span class="lbl">' + esc(tit) + '</span><span class="rl-v mono" data-v="' + id + '"></span></div>' + svg + '</div>';
    }
    return cab + '<div class="rl-ps">' +
      panel("dl", t({ es: "DL total por servicio · Gbit/s", en: "Total DL by service · Gbit/s" }), wDL, g1) +
      panel("sv", t({ es: "Servido · %", en: "Served · %" }), wo, g2) +
      panel("oc", t({ es: "Ocup. máx. · %", en: "Max. occ. · %" }), wo, g3) +
      panel("al", t({ es: "Alarmas", en: "Alarms" }), wo, g4) +
      '</div><div class="rl-tip" hidden></div>';
  }
  function valoresPaso(i) {
    var p = S.serie.pasos[i], r = p.resumen;
    return {
      dl: fmt(r.dl_total_gbps, 0) + " Gbit/s", sv: fmt(r.servido_pct, 2) + " %",
      oc: fmt(r.ocup_max_pct, 1) + " %" + (r.ocup_max_id ? " · " + r.ocup_max_id : ""), al: fmt(r.n_alarmas_noc, 0)
    };
  }
  function tCursor() { return S.cargada && !S.pelicula ? horaCargada() * 60 : (S.t || 0); }
  function moverCursor(svg, tm) {
    var x0 = +svg.getAttribute("data-x0"), x1 = +svg.getAttribute("data-x1");
    var x = (x0 + (tm / 1440) * (x1 - x0)).toFixed(1), c = svg.querySelector(".rl-cursor");
    if (c) { c.setAttribute("x1", x); c.setAttribute("x2", x); c.classList.toggle("hc", S.cargada && !S.pelicula); }
  }
  function pintarCursores() {
    var tm = tCursor();
    Array.prototype.forEach.call(document.querySelectorAll(".rl-g"), function (g) { moverCursor(g, tm); });
    var sp = document.querySelector(".rl-spark .rl-cursor");
    if (sp) { var x = (tm / 1440 * BW).toFixed(1); sp.setAttribute("x1", x); sp.setAttribute("x2", x); }
    var out = elReloj && elReloj.querySelector(".rl-hora");
    if (out && !(S.cargada && !S.pelicula)) out.textContent = hhmm(tm);
    if (elTiempo && serieOk()) {
      var i = indice(tm), v = valoresPaso(i);
      Object.keys(v).forEach(function (k) { var e = elTiempo.querySelector('[data-v="' + k + '"]'); if (e) e.textContent = (S.cargada && !S.pelicula ? t(TX.hc) + " · " : hhmm(S.serie.pasos[i].t_min) + " · ") + v[k]; });
    }
  }
  function pintarCursorFino() { /* el cursor salta por pasos: no hay nada que interpolar entre pasos */ }
  function pintarTodo() {
    pintarReloj();
    S.genPint++;
    if (elTiempo && elTiempo.isConnected && NOC.dockTab && NOC.dockTab() === "tiempo") pintarTiempo(elTiempo);
    pintarMini();
  }

  // ---------- tooltip y arrastre en las gráficas ----------
  function tmDeEvento(svg, ev) {
    var r = svg.getBoundingClientRect(), x0 = +svg.getAttribute("data-x0"), x1 = +svg.getAttribute("data-x1");
    var sx = r.width / (+svg.getAttribute("width") || r.width);
    var x = (ev.clientX - r.left) / (sx || 1);
    return Math.max(0, Math.min(1440, (x - x0) / (x1 - x0) * 1440));
  }
  function tipHTML(i) {
    var p = S.serie.pasos[i], r = p.resumen;
    var filas = CLASES.filter(function (c) { return svDe(p, c) > 1e-6; }).map(function (c) {
      return '<tr><td><i style="background:' + colSv(c) + '"></i>' + esc(nomSv(c)) + '</td><td class="n">' + fmt(svDe(p, c), svDe(p, c) < 10 ? 1 : 0) + '</td></tr>';
    }).join("");
    return '<b class="mono">' + hhmm(p.t_min) + '</b><table>' + filas +
      '<tr class="tot"><td>' + esc(t({ es: "DL total", en: "Total DL" })) + '</td><td class="n">' + fmt(r.dl_total_gbps, 0) + ' Gbit/s</td></tr>' +
      '<tr><td>' + esc(t({ es: "Servido", en: "Served" })) + '</td><td class="n">' + fmt(r.servido_pct, 2) + ' %</td></tr>' +
      '<tr><td>' + esc(t(TX.ocMax)) + '</td><td class="n">' + NOC.insignia(NOC.sevOcupacion(r.ocup_max_pct / 100)) + ' ' + fmt(r.ocup_max_pct, 1) + ' %</td></tr>' +
      (r.ocup_max_id ? '<tr><td></td><td class="n mono tx2">' + esc(r.ocup_max_id) + '</td></tr>' : '') +
      '<tr><td>' + esc(t({ es: "Alarmas", en: "Alarms" })) + '</td><td class="n">' + fmt(r.n_alarmas_noc, 0) + '</td></tr></table>';
  }
  var arrastre = null;
  document.addEventListener("pointerdown", function (ev) {
    var svg = ev.target.closest && ev.target.closest(".rl-g, .rl-spark");
    if (!svg || !serieOk() || ev.button !== 0) return;
    ev.preventDefault();
    arrastre = svg;
    try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* nada */ }
    saltar(svg, ev);
  });
  document.addEventListener("pointermove", function (ev) {
    if (arrastre) { saltar(arrastre, ev); return; }
    var svg = ev.target.closest && ev.target.closest(".dock-pest-tiempo .rl-g");
    var tip = elTiempo && elTiempo.querySelector(".rl-tip");
    Array.prototype.forEach.call(document.querySelectorAll(".dock-pest-tiempo .rl-hover"), function (l) { l.setAttribute("visibility", svg ? "visible" : "hidden"); });
    if (!tip) return;
    if (!svg || !serieOk()) { tip.hidden = true; return; }
    var tm = tmDeEvento(svg, ev), i = indice(tm), tp = S.serie.pasos[i].t_min;
    Array.prototype.forEach.call(document.querySelectorAll(".dock-pest-tiempo .rl-g"), function (g) {
      var x0 = +g.getAttribute("data-x0"), x1 = +g.getAttribute("data-x1"), x = (x0 + tp / 1440 * (x1 - x0)).toFixed(1), l = g.querySelector(".rl-hover");
      if (l) { l.setAttribute("x1", x); l.setAttribute("x2", x); }
    });
    tip.innerHTML = tipHTML(i);
    tip.hidden = false;
    var cr = elTiempo.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var lx = ev.clientX - cr.left + 14; if (lx + tw > cr.width - 4) lx = ev.clientX - cr.left - tw - 14;
    var ly = Math.max(2, Math.min(cr.height - th - 2, ev.clientY - cr.top - th / 2));
    tip.style.left = lx + "px"; tip.style.top = ly + "px";
  });
  function soltar() { arrastre = null; }
  document.addEventListener("pointerup", soltar);
  document.addEventListener("pointercancel", soltar);
  function saltar(svg, ev) {
    var tm;
    if (svg.classList.contains("rl-spark")) { var r = svg.getBoundingClientRect(); tm = Math.max(0, Math.min(1440, (ev.clientX - r.left) / r.width * 1440)); }
    else tm = tmDeEvento(svg, ev);
    irA(tm);
  }

  // ---------- controles ----------
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("button[data-rl]");
    if (!b) return;
    var a = b.getAttribute("data-rl");
    if (a === "play") jugar();
    else if (a === "atras") avanzar(-1);
    else if (a === "adelante") avanzar(1);
    else if (a === "hc") volverHC();
  });
  document.addEventListener("change", function (ev) {
    var s = ev.target, a = s.getAttribute && s.getAttribute("data-rl");
    if (a === "vel") { S.vel = Number(s.value); guardar("noc.reloj.vel", String(S.vel)); }
    else if (a === "paso") {
      S.paso = Number(s.value); guardar("noc.reloj.paso", String(S.paso));
      S.clave = claveCaso(); parar(); pintarReloj(); calcularSerie();
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    var tag = (ev.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea" || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.target.closest && ev.target.closest(".leaflet-container")) return;
    if (!serieOk()) return;
    ev.preventDefault();
    avanzar(ev.key === "ArrowRight" ? 1 : -1);
  });

  // ---------- ficha: mini gráfica de 24 h ----------
  var abrirOrig = NOC.abrirFicha;
  NOC.abrirFicha = function () {
    var r = abrirOrig.apply(NOC, arguments);
    try { pintarMini(); } catch (e) { console.error("reloj ficha", e); }
    return r;
  };
  function pintarMini() {
    var cuerpo = document.getElementById("ficha-cuerpo"), sel = NOC.seleccion;
    if (!cuerpo) return;
    var viejo = cuerpo.querySelector(".rl-ficha");
    if (!sel || (sel.tipo !== "enlace" && sel.tipo !== "nodo") || !serieOk()) { if (viejo) viejo.remove(); return; }
    var s = S.serie, x = sel.tipo === "enlace" ? s.enlaces[sel.id] : s.nodos[sel.id];
    if (!x) { if (viejo) viejo.remove(); return; }
    var cap = sel.tipo === "enlace" ? ((NOC.idx.enlaces[sel.id] || {}).capacidad_gbps) : ((NOC.idx.nodos[sel.id] || {}).capacidad_gbps);
    var vals, unidad, conBandas;
    if (x.ocup && (sel.tipo === "enlace" || (esNum(cap) && cap > 0))) { vals = Array.prototype.slice.call(x.ocup); unidad = "%"; conBandas = true; }
    else if (x.carga) { vals = Array.prototype.slice.call(x.carga); unidad = "Gbit/s"; conBandas = false; }
    else { if (viejo) viejo.remove(); return; }
    var mx = Math.max.apply(null, vals), ymax = conBandas ? Math.max(110, mx * 1.05) : Math.max(1, mx * 1.1), imx = vals.indexOf(mx);
    var w = Math.max(200, (cuerpo.clientWidth || 340) - 24);
    var svg = grafica({ w: w, h: 74, ymin: 0, ymax: ymax, tms: s.pasos.map(function (p) { return p.t_min; }), lineas: [{ vals: vals, color: "var(--tx1)" }],
      capas: conBandas ? function (X, Y, x0, x1) { return bandas(Y, x0, x1, ymax); } : null, ml: 30, nticks: 2,
      titulo: sel.id + " 24 h",
      extra: function (X, Y) { return '<circle cx="' + X(s.pasos[imx].t_min).toFixed(1) + '" cy="' + Y(mx).toFixed(1) + '" r="4" fill="var(--tx1)" stroke="var(--bg1)" stroke-width="2"/>'; } });
    var tit = t({ es: "24 h · ", en: "24 h · " }) + (unidad === "%" ? t({ es: "ocupación", en: "occupancy" }) : t({ es: "carga", en: "load" }));
    var html = '<h3>' + esc(tit) + '</h3><div class="rl-mini">' + svg + '</div><div class="rl-mini-pie"><span class="tx3">' + esc(t(TX.pico)) + '</span> <span class="mono">' +
      hhmm(s.pasos[imx].t_min) + ' · ' + fmt(mx, unidad === "%" ? 1 : 1) + ' ' + unidad + '</span>' +
      (s.aviso ? ' <span class="rl-aviso" tabindex="0" title="' + esc(s.aviso) + '">i</span>' : '') + '</div>';
    var sec = viejo;
    if (!sec) {
      sec = document.createElement("div");
      sec.className = "ficha-sec rl-ficha dato-calc";
      sec.setAttribute("data-pl", "24h");
      var primera = cuerpo.querySelector(".ficha-sec");
      if (primera && primera.nextSibling) cuerpo.insertBefore(sec, primera.nextSibling); else cuerpo.appendChild(sec);
    }
    sec.innerHTML = html;
    sec.classList.toggle("plegada", NOC.plegado ? NOC.plegado("fs:" + "24h") : false);
    moverCursor(sec.querySelector(".rl-g"), tCursor());
  }

  // ---------- registro ----------
  NOC.registrarPestanaDock && NOC.registrarPestanaDock({
    id: "tiempo", titulo: { es: "Tiempo", en: "Time" },
    cnt: function () { return serieOk() ? S.dt + " min" : ""; },
    pintar: pintarTiempo
  });
  NOC.on("resultado", capturar);
  NOC.on("barra", function () { elReloj = null; montarBarra(); });
  NOC.on("lang", function () { S.genPint++; pintarTodo(); });
  NOC.on("modo", function () { parar(); });
  NOC.on("seleccion", function () { pintarMini(); });
  if (window.ResizeObserver) {
    var tRz = 0;
    new ResizeObserver(function () {
      clearTimeout(tRz);
      tRz = setTimeout(function () { if (elTiempo && elTiempo.isConnected && NOC.dockTab() === "tiempo") pintarTiempo(elTiempo); }, 80);
    }).observe(document.getElementById("dock-cuerpo") || document.body);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden && S.play) { parar(); pintarReloj(); } });

  // API para otros módulos (exportar.js)
  NOC.reloj = {
    serie: function () { return serieOk() ? S.serie : null; },
    estado: function () { return { t_min: S.t, i: S.i, pelicula: S.pelicula, play: S.play, paso_min: S.dt || S.paso, vel: S.vel, fuente: S.fuente, cargada: S.cargada, aviso: S.serie && S.serie.aviso }; },
    ir: function (tm) { irA(tm, true); }, jugar: jugar, parar: function () { parar(); pintarReloj(); }, volverHC: volverHC,
    // Revisión 7 (operador.js): recalcular la serie si cambian los eventos; aviso cuando hay serie nueva
    refrescar: function () { var k = claveCaso(); if (k !== S.clave && S.baseOp) { S.clave = k; calcularSerie(); } },
    alSerie: function (fn) { if (typeof fn === "function") oyentesSerie.push(fn); }
  };

  montarBarra();
  capturar();
})();
