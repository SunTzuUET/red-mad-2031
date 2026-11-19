// vista_viva.js — VIVA (CONTRATO_UI Revisión 12, dueño VIVA): "la red es la interfaz".
//  · Lienzo (canvas) a pantalla completa con partículas de tráfico por los enlaces (densidad ∝ log Gbit/s, color = mezcla de
//    servicios del enlace, velocidad fija), nodos que se llenan (ocupación) y respiran (carga), enlaces que engordan y cambian de color.
//  · Zoom semántico con transición: MADRID (zonas como burbujas, área ∝ demanda) → RED (anillo, metro, DC, IX) → ZONA (sitios por tecnología).
//  · Caja de herramientas (arrastrar sobre un elemento, o elegir y pulsar, o tecla sobre el elemento enfocado): cortar, degradar,
//    evento de demanda, +λ, satélite, reparar → eventos reales del caso LAB (NOC.operador.anadir); en REF pasa a LAB con aviso.
//  · Menú radial al pulsar, tarjeta flotante al pasar (nombre + medidor + curva 24 h), transición de 400 ms entre resultados,
//    reloj grande día/noche abajo (NOC.reloj).
//  · Capa SVG accesible encima del lienzo: cada elemento es enfocable con Tab, con role/aria-label ("Enlace X, 85 %, MAJ").
//  · API para PREGUNTAS: NOC.viva = {enfocar, resaltar, camara, posicion, nivel, alMover, aplicar, elemento}.
// Sin dependencias. Solo lee RED, EMPL y NOC.resultado; no toca el motor.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista || !NOC.RED) return;
  var RED = NOC.RED, IDX = NOC.idx || { nodos: {}, enlaces: {}, zonas: {} };
  var SVGNS = "http://www.w3.org/2000/svg";
  var ID = "viva";
  var CLASES = (window.Motor && window.Motor.CLASES_SERVICIO) || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];

  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es) || ""; }
  function fmt(x, d) { return NOC.fmt ? NOC.fmt(x, d) : (+x).toFixed(d || 0); }
  var esc = NOC.esc || function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function suave(p) { p = clamp(p, 0, 1); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function ahora() { return (window.performance || Date).now(); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); m = ((m % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function nombre(id) { return NOC.nombreCorto ? NOC.nombreCorto(id) : NOC.nombre ? NOC.nombre(id) : id; }
  function S(tag, at, padre) {
    var n = document.createElementNS(SVGNS, tag);
    if (at) Object.keys(at).forEach(function (k) { if (at[k] != null) n.setAttribute(k, at[k]); });
    if (padre) padre.appendChild(n);
    return n;
  }
  var mmRed = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function menosMov() { return !!(mmRed && mmRed.matches) || document.body.classList.contains("menos-mov"); }

  // ---------------------------------------------------------------- textos (≤ 3 palabras en pantalla)
  var TX = {
    titulo: { es: "Red viva", en: "Live network" },
    madrid: { es: "Madrid", en: "Madrid" }, red: { es: "Red", en: "Network" },
    cortar: { es: "Cortar", en: "Cut" }, degradar: { es: "Degradar", en: "Degrade" }, evento: { es: "Partido", en: "Match" },
    lambda: { es: "+λ", en: "+λ" }, satelite: { es: "Satélite", en: "Satellite" }, reparar: { es: "Reparar", en: "Repair" },
    ficha: { es: "Ficha", en: "Details" }, acercar: { es: "Acercar", en: "Zoom in" },
    herramientas: { es: "Herramientas", en: "Tools" }, leyenda: { es: "Leyenda", en: "Legend" },
    ahoraLab: { es: "Ahora en LAB", en: "Now in LAB" }, noAplica: { es: "No aplica aquí", en: "Not applicable" },
    enlace: { es: "Enlace", en: "Link" }, nodo: { es: "Nodo", en: "Node" }, zona: { es: "Zona", en: "Zone" }, sitio: { es: "Sitio", en: "Site" },
    caido: { es: "caído", en: "down" }, sinCap: { es: "sin capacidad dada", en: "no capacity given" },
    reloj: { es: "Hora de la simulación", en: "Simulation time" }, play: { es: "Reproducir / pausa", en: "Play / pause" },
    calculando: { es: "calculando…", en: "computing…" }, hc: { es: "HC", en: "BH" },
    mas: { es: "Acercar", en: "Zoom in" }, menos: { es: "Alejar", en: "Zoom out" }, encajar: { es: "Encajar", en: "Fit" },
    teclas: { es: "Intro: menú · X cortar · D degradar · E partido · L más λ · S satélite · R reparar · Z acercar · Esc salir",
      en: "Enter: menu · X cut · D degrade · E match · L add λ · S satellite · R repair · Z zoom in · Esc back" },
    ayuda: {
      es: "Puntos que fluyen = tráfico: más puntos, más Gbit/s (escala logarítmica); color = servicio. Grosor del enlace = carga. " +
        "Color y forma = ocupación: verde ● < 60 %, amarillo ▲ 60–85 %, naranja ◆ 85–100 %, rojo ■ > 100 %, gris ✕ caído. " +
        "Relleno del nodo = ocupación (gris = carga relativa, sin capacidad dada). Burbuja de zona: área ∝ demanda. " +
        "Arrastra una herramienta sobre un elemento (o elígela y pulsa el elemento). Rueda: zoom; arrastrar: mover.",
      en: "Flowing dots = traffic: more dots, more Gbit/s (log scale); colour = service. Link width = load. " +
        "Colour and shape = occupancy: green ● < 60 %, yellow ▲ 60–85 %, orange ◆ 85–100 %, red ■ > 100 %, grey ✕ down. " +
        "Node fill = occupancy (grey = relative load, no capacity given). Zone bubble: area ∝ demand. " +
        "Drag a tool onto an element (or pick it and click the element). Wheel: zoom; drag: pan." }
  };
  var NOMSV = {
    movil: { es: "Móvil", en: "Mobile" }, ftth: { es: "FTTH", en: "FTTH" }, voz: { es: "Voz", en: "Voice" }, urllc: { es: "URLLC", en: "URLLC" },
    iot: { es: "IoT", en: "IoT" }, empresa: { es: "Empresa", en: "Business" }, evento: { es: "Evento", en: "Event" }, ntn: { es: "NTN", en: "NTN" } };
  var TECS = ["n78", "n28", "n258", "ftth", "v2x", "iot", "l2vpn", "ntn"];
  var TEC_TOK = { n78: "band-n78", n28: "band-n28", n258: "band-n258", ftth: "sv-ftth", v2x: "sv-urllc", iot: "sv-iot", l2vpn: "sv-empresa", ntn: "sv-ntn" };
  var SEVTXT = { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT", unk: "DOWN", nd: "—" };

  // ---------------------------------------------------------------- iconos propios (24×24, trazo currentColor)
  var ICO = {
    cortar: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.8 20 18M8.5 16.2 20 6"/>',
    degradar: '<path d="M12 3v12M6.5 10 12 15.5 17.5 10M4 20.5h16"/><path d="M4 20.5h7" stroke-width="3"/>',
    evento: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.5 4.4H9.7L8.2 10.3z"/><path d="M12 7.5V3.2M15.8 10.3l4.2-1.2M14.3 14.7l2.6 3.6M9.7 14.7l-2.6 3.6M8.2 10.3 4 9.1"/>',
    lambda: '<path d="M4 21 11 5M8 12l6 9"/><path d="M18 3v8M14 7h8"/>',
    satelite: '<path d="M10 10l4 4M7.5 12.5l4 4 5-5-4-4z"/><path d="M5 10 2 7l3-3 3 3zM19 14l3 3-3 3-3-3z"/><path d="M4 16a4 4 0 0 0 4 4M4 12.5a7.5 7.5 0 0 0 7.5 7.5"/>',
    reparar: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 3.5v4.5h4.5"/>',
    ficha: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    acercar: '<circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6M10 7v6M7 10h6"/>',
    mas: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>',
    encajar: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    luna: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>', pausa: '<path d="M7 4.5v15M17 4.5v15" stroke-width="3"/>'
  };
  function ico(k, tam) {
    return '<svg class="vv-ico" viewBox="0 0 24 24" width="' + (tam || 22) + '" height="' + (tam || 22) + '" aria-hidden="true" focusable="false">' + (ICO[k] || "") + '</svg>';
  }

  // ---------------------------------------------------------------- herramientas
  // ok(ent): a qué se puede aplicar. tipo = tipo de evento del motor (Revisión 7).
  var HERR = [
    { k: "cortar", tecla: "x", tipo: "fallo", ok: function (e) { return e.k === "nodo" || e.k === "enlace"; } },
    { k: "degradar", tecla: "d", tipo: "degradar", params: function () { return { factor: 0.5 }; }, ok: function (e) { return e.k === "enlace" || e.k === "nodo"; } },
    { k: "evento", tecla: "e", tipo: "evento_demanda", fijo: "E-EVENTO", params: function (tm) { return { hasta_min: Math.min(1439, tm + 120) }; }, ok: function () { return true; } },
    { k: "lambda", tecla: "l", tipo: "anadir_lambda", params: function () { return { n: 1 }; }, ok: function (e) { return e.k === "enlace" && e.ref.tipo !== "sat"; } },
    { k: "satelite", tecla: "s", tipo: "activar_ntn", ok: function () { return true; } },
    { k: "reparar", tecla: "r", tipo: "reparacion", ok: function (e) { return e.k === "nodo" || e.k === "enlace"; } }
  ];
  var HK = {}; HERR.forEach(function (h) { HK[h.k] = h; });

  // ---------------------------------------------------------------- topología y disposiciones
  var LAT0 = 40.45, LON0 = -3.65, KG = 1000, COSL = Math.cos(LAT0 * Math.PI / 180);
  function geo(c) { return c && esNum(c[0]) && esNum(c[1]) ? [(c[1] - LON0) * COSL * KG, (LAT0 - c[0]) * KG] : null; }
  var NIVELES = ["madrid", "red", "zona"];
  var ENT = {}, LISTA_N = [], LISTA_E = [], ZONA_DE_AGG = {}, AGG_DE_ZONA = {}, MET_DE = {}, BACKHAUL = {}, SITIOS = {};
  var RR = 170, DIR_ROT = {};

  function construirModelo() {
    var nodos = RED.nodos || [], enl = RED.enlaces || [];
    (RED.zonas || []).forEach(function (z) { if (z.agg) { ZONA_DE_AGG[z.agg] = z; AGG_DE_ZONA[z.id] = z.agg; } });
    // metro de cada AGG / sitio / edge (vecino metro)
    enl.forEach(function (e) {
      var na = IDX.nodos[e.a], nb = IDX.nodos[e.b];
      if (!na || !nb) return;
      if (nb.tipo === "metro" && na.tipo !== "metro" && !MET_DE[na.id]) MET_DE[na.id] = nb.id;
      if (na.tipo === "metro" && nb.tipo !== "metro" && !MET_DE[nb.id]) MET_DE[nb.id] = na.id;
      if (e.tipo === "backhaul") BACKHAUL[na.tipo === "agg" ? na.id : nb.id] = e.id;
    });
    // ángulo de cada metro en el esquema: Norte arriba, Este derecha, Sur abajo, Centro izquierda
    var metros = nodos.filter(function (n) { return n.tipo === "metro"; });
    var ANG_AREA = { NORTE: -90, ESTE: 0, SUR: 90, CENTRO: 180 }, ang = {};
    metros.forEach(function (m, i) { ang[m.id] = (ANG_AREA[m.area] != null ? ANG_AREA[m.area] : -90 + 360 * i / metros.length) * Math.PI / 180; });
    var pr = {};
    function dir(a) { return [Math.cos(a), Math.sin(a)]; }
    metros.forEach(function (m) { var d = dir(ang[m.id]); pr[m.id] = [RR * d[0], RR * d[1]]; });
    // abanico exterior de cada metro: AGG (lejos) y sitios (cerca), ordenados por rumbo geográfico
    metros.forEach(function (m) {
      var g0 = geo(m.coord), a = ang[m.id];
      var hijos = nodos.filter(function (n) { return (n.tipo === "agg" || n.tipo === "site") && MET_DE[n.id] === m.id; });
      hijos.forEach(function (n) {
        var g = geo(n.coord), rumbo = g && g0 ? Math.atan2(g[1] - g0[1], g[0] - g0[0]) : a;
        var dif = Math.atan2(Math.sin(rumbo - a), Math.cos(rumbo - a));
        n._rumbo = Math.abs(g && g0 && (Math.abs(g[0] - g0[0]) + Math.abs(g[1] - g0[1])) < 1e-6 ? 0 : 1) ? dif : 0;
      });
      hijos.sort(function (p, q) { return p._rumbo - q._rumbo || (p.id < q.id ? -1 : 1); });
      var n = hijos.length, paso = Math.min(24, 165 / Math.max(1, n)) * Math.PI / 180;
      var nAgg = 0;
      hijos.forEach(function (h, i) {
        var aa = a + (i - (n - 1) / 2) * paso, d = h.tipo === "agg" ? 190 + (nAgg++ % 2) * 38 : 110, v = dir(aa);
        pr[h.id] = [pr[m.id][0] + d * v[0], pr[m.id][1] + d * v[1]];
        DIR_ROT[h.id] = v;
      });
    });
    // edge: hacia dentro del anillo junto a su metro; DC: media de sus metros a media distancia; IX: centro; con satélite: fuera
    var vecinos = {};
    enl.forEach(function (e) { (vecinos[e.a] = vecinos[e.a] || []).push({ o: e.b, e: e }); (vecinos[e.b] = vecinos[e.b] || []).push({ o: e.a, e: e }); });
    nodos.forEach(function (n) {
      if (n.tipo === "edge") {
        var m = MET_DE[n.id], a = m ? ang[m] : 0, v = dir(a + 0.42);
        pr[n.id] = [RR * 0.66 * v[0], RR * 0.66 * v[1]];
      } else if (n.tipo === "core") {
        var sx = 0, sy = 0, k = 0;
        (vecinos[n.id] || []).forEach(function (x) { if (ang[x.o] != null) { sx += Math.cos(ang[x.o]); sy += Math.sin(ang[x.o]); k++; } });
        var aa = k ? Math.atan2(sy, sx) : 0;
        pr[n.id] = [RR * 0.5 * Math.cos(aa), RR * 0.5 * Math.sin(aa)];
        DIR_ROT[n.id] = [Math.cos(aa) >= 0 ? 1 : -1, 0];
      }
    });
    var ixc = nodos.filter(function (n) { return n.tipo === "ix" && !(vecinos[n.id] || []).some(function (x) { return x.e.tipo === "sat"; }); });
    ixc.forEach(function (n, i) { pr[n.id] = [0, (i - (ixc.length - 1) / 2) * 44]; });
    nodos.forEach(function (n) {
      if (pr[n.id]) return;
      if ((vecinos[n.id] || []).some(function (x) { return x.e.tipo === "sat"; })) { pr[n.id] = [RR * 1.62, RR * 1.62]; return; }
      pr[n.id] = [0, RR * 0.2];
    });
    // entidades
    nodos.forEach(function (n) {
      var g = geo(n.coord) || [0, 0];
      var ent = { id: n.id, k: "nodo", tipo: n.tipo, ref: n, p: { madrid: g, red: pr[n.id], zona: g },
        lv: { madrid: n.tipo === "metro" || n.tipo === "agg", red: true }, zona: ZONA_DE_AGG[n.id] || null };
      // ancla al aparecer/desaparecer en el nivel MADRID: su metro (o el centro)
      ent.ancla = MET_DE[n.id] || null;
      if (!ent.ancla && n.tipo === "core") { var vm = (vecinos[n.id] || []).filter(function (x) { return ang[x.o] != null; })[0]; ent.ancla = vm ? vm.o : null; }
      ENT[n.id] = ent; LISTA_N.push(ent);
    });
    enl.forEach(function (e) {
      if (!ENT[e.a] || !ENT[e.b]) return;
      var ent = { id: e.id, k: "enlace", tipo: e.tipo, ref: e, a: e.a, b: e.b,
        lv: { madrid: e.tipo === "wdm" || e.tipo === "backhaul", red: true }, c: {} };
      if (e.tipo === "wdm" && ang[e.a] != null && ang[e.b] != null) {
        var a1 = ang[e.a], a2 = ang[e.b], am = Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2));
        var dd = Math.abs(Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1)));
        var rc = RR / Math.max(0.3, Math.cos(dd / 2));
        ent.c.red = [rc * Math.cos(am), rc * Math.sin(am)];
      }
      if (e.tipo === "sat") {
        // satélite: curva hacia fuera para que no tape el anillo
        var pa = pr[e.a], pb = pr[e.b], mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2, nx = -(pb[1] - pa[1]), ny = pb[0] - pa[0], l = Math.hypot(nx, ny) || 1;
        ent.c.red = [mx + nx / l * 40, my + ny / l * 40];
      }
      ENT[e.id] = ent; LISTA_E.push(ent);
    });
    // sitios de acceso (EMPL) por zona, para el nivel ZONA
    var E = window.EMPL;
    if (E && Array.isArray(E.sitios)) E.sitios.forEach(function (s) {
      if (!s.zona || !IDX.zonas[s.zona]) return;
      var g = geo(s.coord); if (!g) return;
      (SITIOS[s.zona] = SITIOS[s.zona] || []).push({ id: s.id, tec: s.tec, p: g, k: "sitio", zona: s.zona, s: [0, 0] });
    });
  }
  function zonaDeId(id) { if (IDX.zonas[id]) return id; var z = ZONA_DE_AGG[id]; return z ? z.id : null; }
  // ¿está la entidad en el nivel (y zona)?
  function enNivel(ent, nv, zona) {
    if (!ent) return false;
    if (nv !== "zona") return !!ent.lv[nv];
    var agg = AGG_DE_ZONA[zona];
    if (!agg) return false;
    if (ent.k === "nodo") return ent.id === agg || ent.id === MET_DE[agg];
    return ent.id === BACKHAUL[agg];
  }
  function posNivel(ent, nv) { return ent.p[nv === "zona" ? "zona" : nv]; }

  // ---------------------------------------------------------------- valores (con transición de 400 ms)
  var VAL = {}, PREV = {}, T_VAL = 0, DUR_VAL = 400, MAXREL = {}, SITV = {}, HALO = {}, RESUMEN = "";
  function mezcla(ps) {
    var tot = 0, m = [];
    if (ps) CLASES.forEach(function (c) { var p = ps[c]; if (!p) return; var g = (p.ab || 0) + (p.ba || 0); if (g > 1e-6) { m.push([c, g]); tot += g; } });
    m.sort(function (a, b) { return b[1] - a[1]; });
    return tot > 0 ? m.map(function (x) { return [x[0], x[1] / tot]; }) : [];
  }
  function objetivo() {
    var r = NOC.resultado, v = {};
    if (!r) return v;
    LISTA_E.forEach(function (ent) {
      var x = (r.enlaces || {})[ent.id] || {};
      var ab = x.carga_ab || 0, ba = x.carga_ba || 0;
      v[ent.id] = { ab: ab, ba: ba, G: Math.max(ab, ba, x.carga_gbps || 0), o: NOC.ocupacion ? NOC.ocupacion(x) : null, down: !!x.caido, mix: mezcla(x.por_servicio) };
    });
    MAXREL = {};
    LISTA_N.forEach(function (ent) {
      var x = (r.nodos || {})[ent.id] || {};
      v[ent.id] = { G: x.carga_gbps || 0, o: NOC.ocupacion ? NOC.ocupacion(x) : null, down: !!x.caido };
      MAXREL[ent.tipo] = Math.max(MAXREL[ent.tipo] || 0, x.carga_gbps || 0);
      var z = ent.zona && r.zonas ? r.zonas[ent.zona.id] : null;
      if (z) { v[ent.id].dl = z.dl_gbps || 0; v[ent.id].pct = z.pct; }
    });
    SITV = {};
    var A = r.acceso && r.acceso.sitios;
    if (A) Object.keys(A).forEach(function (k) { var s = A[k]; SITV[k] = { G: (s.dl_mbps || 0) / 1000, u: s.util_pct, off: !!s.apagado }; });
    return v;
  }
  function nuevoResultado() {
    var nuevo = objetivo(), tm = ahora(), est = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    var jugando = est && est.play;
    // valor de partida = lo que se ve ahora (si había una transición a medias, desde su punto actual)
    var prev = {};
    Object.keys(nuevo).forEach(function (id) { prev[id] = VAL[id] ? valor(id) : nuevo[id]; });
    if (!jugando && Object.keys(VAL).length) {
      LISTA_E.forEach(function (ent) {
        var a = prev[ent.id], b = nuevo[ent.id];
        if (!a || !b || b.down) return;
        if (b.G > a.G * 1.15 && b.G - a.G > 1) HALO[ent.id] = { t0: tm, sube: true };
        else if (b.G < a.G * 0.85 && a.G - b.G > 1) HALO[ent.id] = { t0: tm, sube: false };
      });
    }
    PREV = prev; VAL = nuevo; T_VAL = menosMov() || !Object.keys(prev).length ? -1e9 : tm;
    cacheFrame = -1;
    resumenAria();
    clearTimeout(tAria); tAria = setTimeout(function () { if (montado && activa) refrescarAria(); }, DUR_VAL + 60);
    pedirFrame();
  }
  var cacheV = {}, cacheFrame = -1, frameN = 0, tAria = 0;
  function valor(id) {
    if (cacheFrame === frameN && cacheV[id]) return cacheV[id];
    if (cacheFrame !== frameN) { cacheV = {}; cacheFrame = frameN; }
    var b = VAL[id]; if (!b) return null;
    var p = suave((ahora() - T_VAL) / DUR_VAL), a = PREV[id];
    if (!a || p >= 1) return (cacheV[id] = b);
    var o = (a.o == null || b.o == null) ? b.o : lerp(a.o, b.o, p);
    var v = { ab: lerp(a.ab || 0, b.ab || 0, p), ba: lerp(a.ba || 0, b.ba || 0, p), G: lerp(a.G || 0, b.G || 0, p), o: o,
      down: p > 0.5 ? b.down : a.down, mix: b.mix, dl: lerp(a.dl || 0, b.dl || 0, p), pct: b.pct };
    return (cacheV[id] = v);
  }
  function transValores() { return ahora() - T_VAL < DUR_VAL; }
  function sev(v) {
    if (!v) return "nd";
    if (v.down) return "unk";
    if (v.o == null) return "nd";
    return v.o > 1.0001 ? "crit" : v.o >= 0.85 ? "maj" : v.o >= 0.6 ? "min" : "ok";
  }
  function sevZona(ent) {
    var v = valor(ent.id), bh = BACKHAUL[ent.id] ? valor(BACKHAUL[ent.id]) : null, s = sev(bh);
    if (v && esNum(v.pct) && v.pct < 99.5) { var sp = v.pct >= 95 ? "min" : v.pct >= 80 ? "maj" : "crit"; if (RANGO[sp] > RANGO[s]) s = sp; }
    if (v && v.down) s = "unk";
    return s;
  }
  var RANGO = { nd: 0, ok: 1, min: 2, maj: 3, crit: 4, unk: 5 };

  // ---------------------------------------------------------------- estado de la vista
  var el = null, cv = null, ctx = null, ov = null, gOv = null, capa = null, montado = false, activa = false;
  var VW = 800, VH = 600, DPR = 1, C = {}, FUENTE = "sans-serif";
  var est = (function () { var g = {}; try { g = JSON.parse(leer("noc.viva") || "{}") || {}; } catch (e) { g = {}; } return g; })();
  var NIV = NIVELES.indexOf(est.nivel) >= 0 ? est.nivel : "red", ZONA = IDX.zonas[est.zona] ? est.zona : "Z-MADRID";
  if (NIV === "zona" && !AGG_DE_ZONA_ok(ZONA)) NIV = "red";
  function AGG_DE_ZONA_ok(z) { var zz = IDX.zonas[z]; return !!(zz && zz.agg); }
  var cam = { x: 0, y: 0, k: 1 }, camAnim = null, TR = null, RES = null, hover = null, foco = null, armada = null, leyendaAbierta = est.ley !== false;
  var oyentes = [], verPos = 0, verPosAvisada = -1, raf = 0;

  function guardarEst() { guardar("noc.viva", JSON.stringify({ nivel: NIV, zona: ZONA, ley: leyendaAbierta })); }
  function leerTokens() {
    var cs = getComputedStyle(document.documentElement);
    ["bg0", "bg1", "bg2", "line", "line2", "line3", "tx1", "tx2", "tx3", "tx4", "ok", "min", "maj", "crit", "wrn", "unk", "steel"].forEach(function (k) {
      C[k] = cs.getPropertyValue("--" + k).trim() || C[k] || "#888";
    });
    CLASES.forEach(function (c) { C["sv-" + c] = cs.getPropertyValue("--sv-" + c).trim() || "#888"; });
    ["band-n28", "band-n78", "band-n258"].forEach(function (k) { C[k] = cs.getPropertyValue("--" + k).trim() || "#888"; });
    FUENTE = getComputedStyle(document.body).fontFamily || "sans-serif";
  }
  function colorSev(s) { return s === "nd" ? C.tx3 : s === "unk" ? C.unk : C[s] || C.tx3; }

  // ---------------------------------------------------------------- cámara
  function area() { return { l: 76, t: 50, r: VW - 18, b: VH - 104 }; }
  function aPant(p, c) { var A = area(); return [(p[0] - c.x) * c.k + (A.l + A.r) / 2, (p[1] - c.y) * c.k + (A.t + A.b) / 2]; }
  function aMundo(s, c) { var A = area(); return [(s[0] - (A.l + A.r) / 2) / c.k + c.x, (s[1] - (A.t + A.b) / 2) / c.k + c.y]; }
  function caja(nv, zona) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    function add(p, m) { if (!p) return; m = m || 0; x0 = Math.min(x0, p[0] - m); y0 = Math.min(y0, p[1] - m); x1 = Math.max(x1, p[0] + m); y1 = Math.max(y1, p[1] + m); }
    LISTA_N.forEach(function (e) {
      if (!enNivel(e, nv, zona)) return;
      var m = nv === "madrid" && e.tipo === "agg" ? radioBurbujaMundo(e) : nv === "red" ? 26 : 2;
      add(posNivel(e, nv), m);
    });
    if (nv === "zona") (SITIOS[zona] || []).forEach(function (s) { add(s.p, 1); });
    if (!isFinite(x0)) return { x0: -100, y0: -100, x1: 100, y1: 100 };
    var w = x1 - x0, h = y1 - y0, minimo = nv === "zona" ? 24 : 60;
    if (w < minimo) { x0 -= (minimo - w) / 2; x1 += (minimo - w) / 2; }
    if (h < minimo) { y0 -= (minimo - h) / 2; y1 += (minimo - h) / 2; }
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
  }
  function encajarCaja(b, margen) {
    var A = area(), w = Math.max(40, A.r - A.l - 2 * (margen || 24)), h = Math.max(40, A.b - A.t - 2 * (margen || 24));
    var k = Math.min(w / Math.max(1e-6, b.x1 - b.x0), h / Math.max(1e-6, b.y1 - b.y0));
    return { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2, k: k };
  }
  function camEncaje(nv, zona) { return encajarCaja(caja(nv, zona), nv === "zona" ? 30 : 20); }
  var kEncaje = 1;
  function moverCam(dest, dur) {
    dur = menosMov() || !activa || document.hidden ? 0 : dur == null ? 450 : dur;
    if (!dur) { cam = { x: dest.x, y: dest.y, k: dest.k }; camAnim = null; verPos++; pedirFrame(); return Promise.resolve(); }
    return new Promise(function (ok) { camAnim = { de: { x: cam.x, y: cam.y, k: cam.k }, a: dest, t0: ahora(), dur: dur, fin: ok }; pedirFrame(); });
  }
  function pasoCam(tm) {
    if (!camAnim) return;
    var p = suave((tm - camAnim.t0) / camAnim.dur), a = camAnim.de, b = camAnim.a;
    cam = { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), k: Math.exp(lerp(Math.log(a.k), Math.log(b.k), p)) };
    verPos++;
    if (p >= 1) { var f = camAnim.fin; camAnim = null; if (f) f(); }
  }

  // ---------------------------------------------------------------- niveles (zoom semántico con transición)
  function irNivel(nv, zona, opc) {
    opc = opc || {};
    if (nv === "zona") { zona = zona || ZONA; if (!AGG_DE_ZONA_ok(zona)) return Promise.resolve(); }
    var destCam = opc.cam || camEncaje(nv, nv === "zona" ? zona : null);
    var mismo = nv === NIV && (nv !== "zona" || zona === ZONA);
    cerrarRadial(); ocultarTarjeta();
    if (mismo) { kEncaje = camEncaje(nv, ZONA).k; return moverCam(destCam, opc.dur); }
    var de = { nv: NIV, zona: ZONA, cam: { x: cam.x, y: cam.y, k: cam.k } };
    NIV = nv; if (nv === "zona") ZONA = zona;
    kEncaje = camEncaje(nv, ZONA).k;
    cam = { x: destCam.x, y: destCam.y, k: destCam.k }; camAnim = null;
    guardarEst();
    construirOverlay();
    pintarMigas(); pintarLeyenda();
    anunciar(t({ es: "Nivel ", en: "Level " }) + etiquetaNivel());
    verPos++;
    if (menosMov() || !montado || !activa || document.hidden) { TR = null; pedirFrame(); return Promise.resolve(); }
    return new Promise(function (ok) { TR = { de: de, t0: ahora(), dur: opc.dur || 650, fin: ok }; pedirFrame(); });
  }
  function etiquetaNivel() { return NIV === "zona" ? (IDX.zonas[ZONA] || {}).nombre || ZONA : t(TX[NIV]); }
  function subirNivel() {
    if (NIV === "zona") return irNivel("red");
    if (NIV === "red") return irNivel("madrid");
    return Promise.resolve();
  }

  // posición en pantalla de una entidad en un estado {nv, zona, cam}; null si no está y no tiene ancla
  function pantallaEn(ent, nv, zona, c) {
    if (enNivel(ent, nv, zona)) return { s: aPant(posNivel(ent, nv), c), a: 1 };
    var anc = null;
    if (nv === "madrid") { anc = ent.ancla && ENT[ent.ancla] ? ENT[ent.ancla].p.madrid : [0, -20]; }
    else if (nv === "zona") { var agg = AGG_DE_ZONA[zona]; anc = agg ? ENT[agg].p.zona : null; if (ent.id === agg) anc = ENT[agg].p.zona; }
    else anc = posNivel(ent, nv);
    if (!anc) return null;
    return { s: aPant(anc, c), a: 0 };
  }
  // ---------------------------------------------------------------- cálculo de pantalla por fotograma
  function calcularPantalla(tm) {
    var p = 1, de = null;
    if (TR) { p = suave((tm - TR.t0) / TR.dur); de = TR.de; if (p >= 1) { var f = TR.fin; TR = null; de = null; p = 1; if (f) setTimeout(f, 0); } verPos++; }
    LISTA_N.forEach(function (ent) {
      var b = pantallaEn(ent, NIV, ZONA, cam);
      if (!de) { ent.s = b.s; ent.al = b.a; ent.r = radio(ent, NIV, cam); return; }
      var a = pantallaEn(ent, de.nv, de.zona, de.cam) || b;
      ent.s = [lerp(a.s[0], b.s[0], p), lerp(a.s[1], b.s[1], p)];
      ent.al = lerp(a.a, b.a, p);
      ent.r = lerp(radio(ent, de.nv, de.cam), radio(ent, NIV, cam), p);
    });
    LISTA_E.forEach(function (ent) {
      var A = ENT[ent.a], B = ENT[ent.b];
      ent.s1 = A.s; ent.s2 = B.s;
      var enB = enNivel(ent, NIV, ZONA) ? 1 : 0, enA = de ? (enNivel(ent, de.nv, de.zona) ? 1 : 0) : enB;
      ent.al = lerp(enA, enB, p) * Math.min(1, Math.max(A.al, 0.001) * 1) ;
      ent.al = Math.min(ent.al, Math.max(A.al, B.al));
      var cB = ent.c[NIV] ? aPant(ent.c[NIV], cam) : null, cA = de && ent.c[de.nv] ? aPant(ent.c[de.nv], de.cam) : null;
      var mid = [(A.s[0] + B.s[0]) / 2, (A.s[1] + B.s[1]) / 2];
      if (!de) ent.sc = cB || mid;
      else {
        var ca = cA || null, cb = cB || null;
        if (!ca && !cb) ent.sc = mid;
        else { ca = ca || mid; cb = cb || mid; ent.sc = [lerp(ca[0], cb[0], p), lerp(ca[1], cb[1], p)]; }
      }
    });
    // sitios del nivel ZONA (aparecen desde su AGG)
    var lista = [];
    if (NIV === "zona") lista.push([ZONA, 1]);
    if (de && de.nv === "zona" && (NIV !== "zona" || de.zona !== ZONA)) lista.push([de.zona, 0]);
    SIT_VIS = [];
    lista.forEach(function (x) {
      var z = x[0], dentro = x[1], agg = ENT[AGG_DE_ZONA[z]];
      if (!agg) return;
      var c = dentro ? cam : de.cam;
      var pp = de ? (dentro ? p : 1 - p) : 1;
      (SITIOS[z] || []).forEach(function (s) {
        var fin = aPant(s.p, c);
        s.s = [lerp(agg.s[0], fin[0], pp), lerp(agg.s[1], fin[1], pp)];
        s.al = pp;
        SIT_VIS.push(s);
      });
    });
  }
  var SIT_VIS = [];
  function factorZoom(c) { return clamp(Math.sqrt(c.k / Math.max(1e-6, kEncaje)), 0.8, 1.9); }
  function radioBurbujaMundo(ent) {
    var v = VAL[ent.id] ? valor(ent.id) : null, dl = v && esNum(v.dl) ? v.dl : 20;
    return 3 + 1.55 * Math.sqrt(Math.max(0, dl));
  }
  function radio(ent, nv, c) {
    if (nv === "madrid") return ent.tipo === "agg" ? Math.max(6, radioBurbujaMundo(ent) * c.k) : 10;
    if (nv === "zona") return 15;
    var base = { metro: 16, core: 14, edge: 11, ix: 11, agg: 10, site: 8 }[ent.tipo] || 9;
    return base * (c === cam ? factorZoom(c) : 1);
  }

  // ---------------------------------------------------------------- dibujo
  function bez(e, u) {
    var a = e.s1, b = e.s2, c = e.sc, v = 1 - u;
    return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
  }
  function largo(e) { return Math.hypot(e.sc[0] - e.s1[0], e.sc[1] - e.s1[1]) + Math.hypot(e.s2[0] - e.sc[0], e.s2[1] - e.sc[1]); }
  function grosor(G) { return clamp(1.3 + 1.7 * Math.log10(1 + Math.max(0, G)), 1.3, 7.5); }
  function resaltado(id) { return !RES || RES[id]; }
  function camino(tipo, x, y, r) {
    ctx.beginPath();
    switch (tipo) {
      case "core": ctx.rect(x - r, y - r, 2 * r, 2 * r); break;                                   // DC = cuadrado
      case "edge": ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.2, y); ctx.lineTo(x, y + r * 1.2); ctx.lineTo(x - r * 1.2, y); ctx.closePath(); break;  // rombo
      case "metro": for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; ctx[i ? "lineTo" : "moveTo"](x + r * 1.1 * Math.cos(a), y + r * 1.1 * Math.sin(a)); } ctx.closePath(); break;  // hexágono
      case "site": ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.1, y + r * 0.8); ctx.lineTo(x - r * 1.1, y + r * 0.8); ctx.closePath(); break;  // triángulo
      case "ix": for (var j = 0; j < 10; j++) { var b = -Math.PI / 2 + j * Math.PI / 5, rr = j % 2 ? r * 0.55 : r * 1.25; ctx[j ? "lineTo" : "moveTo"](x + rr * Math.cos(b), y + rr * Math.sin(b)); } ctx.closePath(); break;  // estrella
      default: ctx.arc(x, y, r, 0, 2 * Math.PI);                                                   // agregación = círculo
    }
  }
  // glifo de estado (forma además de color): min ▲, maj ◆, crit ■, caído ✕
  function glifo(s, x, y, tam) {
    if (s === "ok" || s === "nd") return;
    var r = tam / 2;
    ctx.save();
    ctx.lineWidth = 2; ctx.strokeStyle = C.bg0; ctx.fillStyle = colorSev(s);
    ctx.beginPath();
    if (s === "min") { ctx.moveTo(x, y - r * 1.1); ctx.lineTo(x + r, y + r * 0.8); ctx.lineTo(x - r, y + r * 0.8); ctx.closePath(); }
    else if (s === "maj") { ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.15, y); ctx.lineTo(x, y + r * 1.15); ctx.lineTo(x - r * 1.15, y); ctx.closePath(); }
    else if (s === "crit") ctx.rect(x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8);
    if (s !== "unk") { ctx.stroke(); ctx.fill(); }
    else {
      ctx.lineCap = "square";
      ctx.strokeStyle = C.bg0; ctx.lineWidth = 5;
      ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke();
      ctx.beginPath(); ctx.strokeStyle = C.tx1; ctx.lineWidth = 2;
      ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke();
    }
    ctx.restore();
  }
  var DORADO = 0.6180339887;
  function claseParticula(mix, i) {
    if (!mix || !mix.length) return null;
    var u = (i * DORADO) % 1, acc = 0;
    for (var k = 0; k < mix.length; k++) { acc += mix[k][1]; if (u <= acc) return mix[k][0]; }
    return mix[mix.length - 1][0];
  }
  function dibujar(tm) {
    frameN++;
    var mov = !menosMov(), seg = mov ? tm / 1000 : 0;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = C.bg0; ctx.fillRect(0, 0, VW, VH);
    // anillo de fondo (guía) en RED
    var cubos = {}, nCubos = 0;
    function punto(color, x, y, t2) { var b = cubos[color]; if (!b) { b = cubos[color] = []; nCubos++; } b.push(x, y, t2); }
    // --- enlaces
    LISTA_E.forEach(function (e) {
      if (e.al < 0.02) return;
      var v = valor(e.id) || { G: 0, ab: 0, ba: 0, o: null, down: false, mix: [] }, s = sev(v), dim = resaltado(e.id) ? 1 : 0.18;
      var w = v.down ? 1.5 : grosor(v.G);
      ctx.globalAlpha = e.al * dim;
      ctx.lineCap = "butt";
      var sel = (NOC.seleccion && NOC.seleccion.id === e.id) || (hover && hover.id === e.id) || (foco === e.id);
      if (sel) { ctx.beginPath(); ctx.moveTo(e.s1[0], e.s1[1]); ctx.quadraticCurveTo(e.sc[0], e.sc[1], e.s2[0], e.s2[1]); ctx.strokeStyle = C.tx1; ctx.lineWidth = w + 5; ctx.stroke(); }
      var h = HALO[e.id];
      if (h) {
        var ph = (tm - h.t0) / 1600;
        if (ph >= 1 || !mov) delete HALO[e.id];
        else { ctx.save(); ctx.globalAlpha = e.al * dim * (1 - ph) * 0.55; ctx.beginPath(); ctx.moveTo(e.s1[0], e.s1[1]); ctx.quadraticCurveTo(e.sc[0], e.sc[1], e.s2[0], e.s2[1]); ctx.strokeStyle = h.sube ? C.tx1 : C.tx3; ctx.lineWidth = w + 4 + 10 * ph; ctx.stroke(); ctx.restore(); }
      }
      ctx.beginPath(); ctx.moveTo(e.s1[0], e.s1[1]); ctx.quadraticCurveTo(e.sc[0], e.sc[1], e.s2[0], e.s2[1]);
      ctx.strokeStyle = s === "nd" ? C.line3 : colorSev(s);
      ctx.lineWidth = w;
      if (v.down) ctx.setLineDash([6, 5]); else if (e.tipo === "sat") ctx.setLineDash([2, 5]); else ctx.setLineDash([]);
      ctx.stroke(); ctx.setLineDash([]);
      // partículas: ida (a→b) y vuelta (b→a); densidad ∝ log2(1 + Gbit/s), velocidad fija
      if (!v.down && e.al > 0.3) {
        var L = largo(e);
        if (L > 8) [["ab", v.ab], ["ba", v.ba]].forEach(function (d) {
          var g = d[1]; if (!(g > 1e-3)) return;
          var dens = clamp(0.4 + 1.05 * Math.log2(1 + g), 0.4, 13), n = Math.min(90, Math.max(1, Math.round(dens * L / 100)));
          var vel = 52 / L, tam = w > 4 ? 3 : 2.4;
          for (var i = 0; i < n; i++) {
            var u = ((i + ((i * DORADO) % 1) * 0.55) / n + seg * vel) % 1;
            if (d[0] === "ba") u = 1 - u;
            var q = bez(e, u), c = claseParticula(v.mix, i);
            punto(c ? C["sv-" + c] : C.tx2, q[0], q[1], tam);
          }
        });
      }
      ctx.globalAlpha = 1;
    });
    // --- sitios (nivel ZONA): líneas tenues al AGG + partículas
    if (SIT_VIS.length) {
      var agg = ENT[AGG_DE_ZONA[ZONA]] || null;
      ctx.lineWidth = 1;
      SIT_VIS.forEach(function (s) {
        var a = ENT[AGG_DE_ZONA[s.zona]]; if (!a) return;
        ctx.globalAlpha = 0.14 * s.al; ctx.strokeStyle = C.line3;
        ctx.beginPath(); ctx.moveTo(s.s[0], s.s[1]); ctx.lineTo(a.s[0], a.s[1]); ctx.stroke();
        var sv = SITV[s.id];
        if (sv && sv.G > 1e-4 && !sv.off && s.al > 0.6) {
          var L = Math.hypot(a.s[0] - s.s[0], a.s[1] - s.s[1]); if (L < 6) return;
          var n = Math.min(3, Math.max(1, Math.round(Math.log2(1 + sv.G * 40))));
          for (var i = 0; i < n; i++) {
            var u = ((i + 0.37 * ((s.p[0] * 7.13) % 1 + 1)) / n + seg * 45 / L) % 1;
            punto(C[TEC_TOK[s.tec]] || C.tx2, lerp(s.s[0], a.s[0], u), lerp(s.s[1], a.s[1], u), 2);
          }
        }
      });
      ctx.globalAlpha = 1;
      void agg;
    }
    // vuelca las partículas por color (pocas llamadas a fillStyle)
    Object.keys(cubos).forEach(function (col) {
      var b = cubos[col]; ctx.fillStyle = col;
      for (var i = 0; i < b.length; i += 3) { var h2 = b[i + 2] / 2; ctx.fillRect(b[i] - h2, b[i + 1] - h2, b[i + 2], b[i + 2]); }
    });
    // --- sitios: marcas por tecnología
    if (SIT_VIS.length) {
      SIT_VIS.forEach(function (s) {
        if (s.al < 0.05) return;
        var sv = SITV[s.id], u = sv && esNum(sv.u) ? sv.u : null, alto = u != null && u >= 85;
        ctx.globalAlpha = s.al * (RES && !RES[s.id] ? 0.25 : 1);
        var r = alto ? 4.5 : 3.2;
        ctx.beginPath(); ctx.moveTo(s.s[0], s.s[1] - r); ctx.lineTo(s.s[0] + r, s.s[1] + r * 0.75); ctx.lineTo(s.s[0] - r, s.s[1] + r * 0.75); ctx.closePath();
        ctx.fillStyle = sv && sv.off ? C.unk : (C[TEC_TOK[s.tec]] || C.tx2); ctx.fill();
        if (alto || (hover && hover.id === s.id)) { ctx.lineWidth = 1.5; ctx.strokeStyle = hover && hover.id === s.id ? C.tx1 : colorSev(u > 100 ? "crit" : "maj"); ctx.stroke(); }
      });
      ctx.globalAlpha = 1;
    }
    // --- nodos
    var fz = factorZoom(cam);
    LISTA_N.forEach(function (n) {
      if (n.al < 0.02) return;
      var v = valor(n.id) || { G: 0, o: null, down: false }, x = n.s[0], y = n.s[1], r = n.r;
      var burbuja = n.tipo === "agg" && (NIV === "madrid" || (TR && TR.de.nv === "madrid"));
      var dim = resaltado(n.id) ? 1 : 0.2;
      ctx.globalAlpha = n.al * dim;
      var s = burbuja || (NIV === "zona" && n.tipo === "agg") ? sevZona(n) : sev(v);
      var frac, colFill;
      if (burbuja || (NIV === "zona" && n.tipo === "agg")) {
        var bh = BACKHAUL[n.id] ? valor(BACKHAUL[n.id]) : null;
        frac = bh && bh.o != null ? bh.o : 0; colFill = colorSev(s === "nd" ? "ok" : s);
      } else if (v.o != null) { frac = v.o; colFill = colorSev(s); }
      else { frac = MAXREL[n.tipo] > 0 ? v.G / MAXREL[n.tipo] : 0; colFill = C.tx3; }
      if (mov && !v.down && !burbuja) r *= 1 + 0.06 * Math.min(1, frac) * Math.sin(tm / 1000 * 2 * Math.PI * 0.45 + x * 0.01);
      var tipoForma = burbuja ? "agg" : n.tipo;
      // cuerpo
      camino(tipoForma, x, y, r);
      ctx.fillStyle = burbuja ? "rgba(255,255,255,0.04)" : C.bg1; ctx.fill();
      // líquido: se llena desde abajo con la ocupación
      if (!v.down && frac > 0) {
        ctx.save(); camino(tipoForma, x, y, r); ctx.clip();
        var hh = 2.5 * r * clamp(frac, 0, 1), top = y + 1.25 * r - hh;
        ctx.globalAlpha = n.al * dim * (burbuja ? 0.42 : 0.85);
        ctx.fillStyle = colFill; ctx.fillRect(x - 1.5 * r, top, 3 * r, hh + 1);
        if (mov && frac > 0.02 && frac < 1) {  // ola en la superficie
          ctx.beginPath(); ctx.moveTo(x - 1.5 * r, top);
          for (var k = 0; k <= 12; k++) { var xx = x - 1.5 * r + k * r / 4; ctx.lineTo(xx, top + Math.sin(tm / 380 + k * 0.9) * Math.min(2, r * 0.12)); }
          ctx.lineTo(x + 1.5 * r, top + 3); ctx.lineTo(x - 1.5 * r, top + 3); ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        ctx.globalAlpha = n.al * dim;
      }
      // contorno
      camino(tipoForma, x, y, r);
      var sel = (NOC.seleccion && NOC.seleccion.id === n.id) || (hover && hover.id === n.id) || foco === n.id;
      ctx.lineWidth = sel ? 3 : 1.6;
      ctx.strokeStyle = sel ? C.tx1 : v.down ? C.unk : s === "nd" ? C.tx2 : colorSev(s);
      if (v.down) ctx.setLineDash([4, 3]);
      ctx.stroke(); ctx.setLineDash([]);
      // glifo de estado
      if (v.down) glifo("unk", x, y, r * 1.1);
      else glifo(s, x + r * 0.95, y - r * 0.95, burbuja ? 12 : 10);
      // rótulo (≤ 3 palabras)
      var rot = rotulo(n, burbuja, fz);
      if (rot) {
        ctx.font = (n.tipo === "metro" || n.tipo === "core" || burbuja ? "600 12px " : "11px ") + FUENTE;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        var dentro = burbuja && r > 30, tx = x, ty = dentro ? y - 6 : y + r + 4, dr = DIR_ROT[n.id];
        if (dr && NIV === "red" && !TR && !burbuja) {   // rótulo hacia fuera (abanicos y DC), sin pisar a los vecinos
          tx = x + dr[0] * (r + 6); ty = y + dr[1] * (r + 6);
          ctx.textAlign = dr[0] > 0.35 ? "left" : dr[0] < -0.35 ? "right" : "center";
          ctx.textBaseline = dr[1] > 0.35 ? "top" : dr[1] < -0.35 ? "bottom" : "middle";
        }
        ctx.lineWidth = 3; ctx.strokeStyle = C.bg0; ctx.strokeText(rot, tx, ty);
        ctx.fillStyle = n.tipo === "agg" || n.tipo === "site" ? C.tx2 : C.tx1; ctx.fillText(rot, tx, ty);
      }
      ctx.globalAlpha = 1;
    });
    // glifos de estado de los enlaces (encima de todo)
    LISTA_E.forEach(function (e) {
      if (e.al < 0.5) return;
      var v = valor(e.id), s = sev(v);
      if (s === "ok" || s === "nd") return;
      var q = bez(e, 0.5);
      ctx.globalAlpha = e.al * (resaltado(e.id) ? 1 : 0.18);
      glifo(s, q[0], q[1], 11);
      ctx.globalAlpha = 1;
    });
    // ondas de herramienta
    ONDAS = ONDAS.filter(function (o) {
      var ph = (tm - o.t0) / 900; if (ph >= 1) return false;
      var p = posicionLocal(o.id); if (!p) return false;
      ctx.globalAlpha = 1 - ph; ctx.strokeStyle = C.tx1; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 12 + 50 * ph, 0, 2 * Math.PI); ctx.stroke(); ctx.globalAlpha = 1;
      return true;
    });
  }
  var ONDAS = [];
  function rotulo(n, burbuja, fz) {
    if (NIV === "madrid" && !TR) {
      if (n.tipo === "agg") return n.zona ? n.zona.nombre.replace(/ de (Jarama|Ardoz|Henares|la Humosa)$/, "") : "";
      return "";
    }
    if (NIV === "zona") return n.tipo === "agg" && n.zona ? n.zona.nombre : n.tipo === "metro" ? nombre(n.id) : "";
    if (n.tipo === "agg") return n.zona ? n.zona.nombre.replace(/ de (Jarama|Ardoz|Henares|la Humosa)$/, "") : nombre(n.id);
    if (n.tipo === "site") return fz > 1.25 || (hover && hover.id === n.id) || foco === n.id ? nombre(n.id) : "";
    if (n.tipo === "edge" || n.tipo === "ix") return fz > 1.05 || (hover && hover.id === n.id) || foco === n.id ? nombre(n.id) : "";
    return nombre(n.id);
  }

  // ---------------------------------------------------------------- bucle (60 fps; parado si la vista no se ve)
  var FPS = { n: 0, t0: 0, v: 0 };
  function animando() { return !menosMov(); }
  function pedirFrame() { if (!raf && activa && !document.hidden && montado) raf = requestAnimationFrame(cuadro); }
  function cuadro(tm) {
    raf = 0;
    if (!activa || document.hidden || !montado) return;
    tm = ahora();
    pasoCam(tm);
    calcularPantalla(tm);
    dibujar(tm);
    if (verPos !== verPosAvisada) { verPosAvisada = verPos; colocarOverlay(); avisarMover(); }
    pintarCursorReloj();
    FPS.n++; if (tm - FPS.t0 >= 1000) { FPS.v = Math.round(FPS.n * 1000 / (tm - FPS.t0)); FPS.n = 0; FPS.t0 = tm; }
    if (animando() || TR || camAnim || transValores() || ONDAS.length) raf = requestAnimationFrame(cuadro);
    else { FPS.v = 0; FPS.n = 0; }
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) pedirFrame(); });
  if (mmRed && mmRed.addEventListener) mmRed.addEventListener("change", function () { pedirFrame(); });

  // ---------------------------------------------------------------- capa accesible (SVG) y eventos de puntero
  var OV = {};   // id → <g>
  function ariaDe(id) {
    var ent = ENT[id];
    if (ent) {
      var burbuja = ent.tipo === "agg" && NIV !== "red";
      if (burbuja) {
        var v = valor(id) || {}, s = sevZona(ent);
        return t(TX.zona) + " " + (ent.zona ? ent.zona.nombre : nombre(id)) + ", " + (esNum(v.dl) ? fmt(v.dl, 0) + " Gbit/s" : "") +
          (esNum(v.pct) ? ", " + fmt(v.pct, 1) + " % " + t({ es: "servido", en: "served" }) : "") + ", " + SEVTXT[s];
      }
      var vv = valor(id) || {}, sv = sev(vv);
      return t(ent.k === "enlace" ? TX.enlace : TX.nodo) + " " + nombre(id) + ", " +
        (vv.down ? t(TX.caido) : vv.o != null ? fmt(vv.o * 100, 0) + " %" : fmt(vv.G || 0, vv.G >= 10 ? 0 : 1) + " Gbit/s") + ", " + SEVTXT[sv];
    }
    var st = sitioPorId(id);
    if (st) { var x = SITV[id] || {}; return t(TX.sitio) + " " + st.tec + ", " + (esNum(x.u) ? fmt(x.u, 0) + " %" : "—") + ", " + (esNum(x.u) ? SEVTXT[x.u > 100 ? "crit" : x.u >= 85 ? "maj" : x.u >= 60 ? "min" : "ok"] : ""); }
    return id;
  }
  function sitioPorId(id) { var l = SITIOS[ZONA] || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function construirOverlay() {
    if (!gOv) return;
    while (gOv.firstChild) gOv.removeChild(gOv.firstChild);
    OV = {};
    function nuevo(id, forma) {
      var g = S("g", { class: "vv-o", tabindex: 0, role: "button", "data-vv-id": id, "aria-describedby": "vv-teclas" }, gOv);
      var f = forma === "linea" ? S("path", { class: "vv-golpe", d: "M0 0" }, g) : S("circle", { class: "vv-golpe", r: 10 }, g);
      var r = forma === "linea" ? S("path", { class: "vv-anillo", d: "M0 0" }, g) : S("circle", { class: "vv-anillo", r: 12 }, g);
      g._f = f; g._r = r; g._linea = forma === "linea";
      OV[id] = g;
      return g;
    }
    // orden de tabulación: núcleo (metro, DC, IX, edge), anillo, zonas/AGG, sitios, resto de enlaces
    var orden = { metro: 0, core: 1, ix: 2, edge: 3, agg: 5, site: 6 };
    var nod = LISTA_N.filter(function (e) { return enNivel(e, NIV, ZONA); }).sort(function (a, b) { return (orden[a.tipo] - orden[b.tipo]) || (a.id < b.id ? -1 : 1); });
    var enl = LISTA_E.filter(function (e) { return enNivel(e, NIV, ZONA); }).sort(function (a, b) { return (a.tipo === "wdm" ? 0 : 1) - (b.tipo === "wdm" ? 0 : 1) || (a.id < b.id ? -1 : 1); });
    nod.filter(function (e) { return e.tipo !== "agg" && e.tipo !== "site"; }).forEach(function (e) { nuevo(e.id, "nodo"); });
    enl.filter(function (e) { return e.tipo === "wdm"; }).forEach(function (e) { nuevo(e.id, "linea"); });
    nod.filter(function (e) { return e.tipo === "agg" || e.tipo === "site"; }).forEach(function (e) { nuevo(e.id, "nodo"); });
    enl.filter(function (e) { return e.tipo !== "wdm"; }).forEach(function (e) { nuevo(e.id, "linea"); });
    if (NIV === "zona") {
      // los 12 sitios más cargados de la zona, enfocables (el resto: puntero)
      (SITIOS[ZONA] || []).slice().sort(function (a, b) { return ((SITV[b.id] || {}).u || 0) - ((SITV[a.id] || {}).u || 0); }).slice(0, 12).forEach(function (s) { nuevo(s.id, "nodo"); });
    }
    refrescarAria();
    verPos++;
  }
  function refrescarAria() { Object.keys(OV).forEach(function (id) { OV[id].setAttribute("aria-label", ariaDe(id)); }); }
  function colocarOverlay() {
    Object.keys(OV).forEach(function (id) {
      var g = OV[id], ent = ENT[id];
      if (g._linea) {
        if (!ent || ent.al < 0.5) { g.setAttribute("display", "none"); return; }
        g.removeAttribute("display");
        var d = "M" + ent.s1[0].toFixed(1) + " " + ent.s1[1].toFixed(1) + "Q" + ent.sc[0].toFixed(1) + " " + ent.sc[1].toFixed(1) + " " + ent.s2[0].toFixed(1) + " " + ent.s2[1].toFixed(1);
        g._f.setAttribute("d", d); g._r.setAttribute("d", d);
        return;
      }
      var p = ent ? { x: ent.s[0], y: ent.s[1], r: ent.r, al: ent.al } : null;
      if (!ent) { var s = sitioPorId(id); if (s) p = { x: s.s[0], y: s.s[1], r: 5, al: s.al }; }
      if (!p || p.al < 0.5) { g.setAttribute("display", "none"); return; }
      g.removeAttribute("display");
      var r = Math.max(10, p.r + 4);
      g._f.setAttribute("cx", p.x.toFixed(1)); g._f.setAttribute("cy", p.y.toFixed(1)); g._f.setAttribute("r", r.toFixed(1));
      g._r.setAttribute("cx", p.x.toFixed(1)); g._r.setAttribute("cy", p.y.toFixed(1)); g._r.setAttribute("r", (r + 3).toFixed(1));
    });
  }
  function entDeEvento(ev) {
    if (ev.clientX != null && ev.type && ev.type.indexOf("pointer") === 0 || ev.type === "dblclick") return idEnPunto(ev.clientX, ev.clientY);
    var g = ev.target && ev.target.closest ? ev.target.closest("[data-vv-id]") : null;
    return g ? g.getAttribute("data-vv-id") : null;
  }
  // bajo el puntero, un nodo gana a un enlace (el trazo de golpe de los enlaces es ancho)
  function idEnPunto(cx, cy) {
    var l = document.elementsFromPoint ? document.elementsFromPoint(cx, cy) : [document.elementFromPoint(cx, cy)], enl = null;
    for (var i = 0; i < l.length; i++) {
      var g = l[i] && l[i].closest ? l[i].closest("[data-vv-id]") : null;
      if (!g) { if (l[i] === cv) break; continue; }
      if (!g._linea) return g.getAttribute("data-vv-id");
      if (!enl) enl = g.getAttribute("data-vv-id");
    }
    return enl;
  }
  // sitio bajo el puntero (nivel ZONA, por proximidad en el lienzo)
  function sitioCerca(x, y) {
    var mejor = null, d2 = 64;
    SIT_VIS.forEach(function (s) { if (s.al < 0.5) return; var dx = s.s[0] - x, dy = s.s[1] - y, d = dx * dx + dy * dy; if (d < d2) { d2 = d; mejor = s; } });
    return mejor;
  }
  function info(id) {
    var ent = ENT[id];
    if (ent) return { id: id, k: ent.k, tipo: ent.tipo, ent: ent };
    var s = sitioPorId(id); if (s) return { id: id, k: "sitio", tipo: s.tec, sitio: s };
    if (IDX.zonas[id] && AGG_DE_ZONA[id]) return info(AGG_DE_ZONA[id]);
    return null;
  }

  // ---------------------------------------------------------------- tarjeta flotante (nombre + medidor + curva 24 h)
  var tarjeta = null, tarjetaId = null;
  function curva24(id) {
    var s = NOC.reloj && NOC.reloj.serie ? NOC.reloj.serie() : null;
    if (!s) return "";
    var ent = ENT[id], arr = null;
    if (ent && ent.tipo === "agg" && NIV !== "red" && BACKHAUL[id]) { id = BACKHAUL[id]; ent = ENT[id]; }
    if (!ent) return "";
    if (ent.k === "enlace" && s.enlaces[id]) arr = s.enlaces[id].ocup;
    else if (ent.k === "nodo" && s.nodos[id]) arr = s.nodos[id].ocup;
    if (!arr || !arr.length) return "";
    var n = arr.length, max = 100; for (var i = 0; i < n; i++) if (arr[i] > max) max = arr[i];
    max = Math.min(Math.max(max, 1), 250);
    var W = 200, H = 40, pts = [];
    for (var j = 0; j < n; j++) pts.push((j / Math.max(1, n - 1) * W).toFixed(1) + "," + (H - Math.min(arr[j], max) / max * H).toFixed(1));
    var y85 = H - 85 / max * H, y100 = H - 100 / max * H;
    var st = NOC.reloj.estado ? NOC.reloj.estado() : null, cx = st && esNum(st.t_min) ? st.t_min / 1440 * W : null;
    var smax = Math.max.apply(null, Array.prototype.slice.call(arr)), sv = smax > 100 ? "crit" : smax >= 85 ? "maj" : smax >= 60 ? "min" : "ok";
    return '<svg class="vv-curva" viewBox="0 0 ' + W + ' ' + (H + 12) + '" role="img" aria-label="' + esc(t({ es: "Ocupación en 24 h, máximo ", en: "Occupancy over 24 h, peak " }) + fmt(smax, 0) + ' %') + '">' +
      '<line x1="0" x2="' + W + '" y1="' + y85.toFixed(1) + '" y2="' + y85.toFixed(1) + '" class="u85"/>' +
      '<line x1="0" x2="' + W + '" y1="' + y100.toFixed(1) + '" y2="' + y100.toFixed(1) + '" class="u100"/>' +
      '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + colorSev(sv) + '" stroke-width="2"/>' +
      (cx != null ? '<line x1="' + cx.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y1="0" y2="' + H + '" class="cur"/>' : '') +
      '<text x="0" y="' + (H + 11) + '">00</text><text x="' + W / 2 + '" y="' + (H + 11) + '" text-anchor="middle">12</text><text x="' + W + '" y="' + (H + 11) + '" text-anchor="end">24 h</text></svg>';
  }
  function medidorHTML(valor_, opc) {
    if (NOC.medidor) return NOC.medidor(valor_, opc);
    return '<span class="mono">' + fmt(valor_ * 100, 0) + ' %</span>';
  }
  function htmlTarjeta(id) {
    var x = info(id); if (!x) return "";
    var tit = "", cuerpo = "";
    if (x.k === "sitio") {
      var sv = SITV[id] || {};
      tit = (x.sitio.tec || "").toUpperCase() + " · " + ((IDX.zonas[x.sitio.zona] || {}).nombre || "");
      cuerpo = esNum(sv.u) ? medidorHTML(sv.u / 100, { unidad: "%", etiqueta: t({ es: "Uso", en: "Use" }), ancho: 200 }) : '<span class="tx3">—</span>';
    } else {
      var ent = x.ent, burbuja = ent.tipo === "agg" && NIV !== "red", v = valor(id) || {};
      if (burbuja) {
        tit = ent.zona ? ent.zona.nombre : nombre(id);
        var bh = BACKHAUL[id] ? valor(BACKHAUL[id]) : null;
        cuerpo = (bh && bh.o != null ? medidorHTML(bh.o, { unidad: "%", etiqueta: t({ es: "Subida", en: "Uplink" }), ancho: 200 }) : "") +
          '<div class="vv-cifra"><b>' + (esNum(v.dl) ? fmt(v.dl, v.dl >= 100 ? 0 : 1) : "—") + '</b> Gbit/s</div>';
      } else {
        tit = nombre(id);
        if (v.down) cuerpo = NOC.textoEstado ? NOC.textoEstado("unk") : "DOWN";
        else if (v.o != null) cuerpo = medidorHTML(v.o, { unidad: "%", etiqueta: t({ es: "Ocupación", en: "Occupancy" }), ancho: 200 });
        else cuerpo = '<div class="vv-cifra"><b>' + fmt(v.G || 0, (v.G || 0) >= 10 ? 0 : 1) + '</b> Gbit/s</div>';
      }
      cuerpo += curva24(id);
    }
    return '<div class="vv-card-tit">' + esc(tit) + '<span class="vv-card-id solo-experto mono">' + esc(id) + '</span></div>' + cuerpo;
  }
  function mostrarTarjeta(id) {
    if (!tarjeta || radial) return;
    var p = posicionLocal(id); if (!p) { ocultarTarjeta(); return; }
    if (tarjetaId !== id) { tarjeta.innerHTML = htmlTarjeta(id); tarjetaId = id; }
    tarjeta.hidden = false;
    var w = tarjeta.offsetWidth, h = tarjeta.offsetHeight, x = p.x + (p.r || 10) + 14, y = p.y - h / 2;
    if (x + w > VW - 8) x = p.x - (p.r || 10) - 14 - w;
    y = clamp(y, 8, VH - h - 100);
    tarjeta.style.left = Math.round(x) + "px"; tarjeta.style.top = Math.round(y) + "px";
  }
  function ocultarTarjeta() { if (tarjeta) { tarjeta.hidden = true; tarjetaId = null; } }

  // ---------------------------------------------------------------- menú radial
  var radial = null, radialId = null;
  function accionesDe(id) {
    var x = info(id); if (!x) return [];
    var out = [];
    if (x.k === "sitio") return [["satelite", null], ["evento", null]];
    var ent = x.ent, v = valor(id) || {}, burbuja = ent.tipo === "agg" && NIV !== "red";
    if (burbuja || ent.tipo === "agg") out.push(["acercar", null]);
    out.push([v.down || caidoEnCaso(id) ? "reparar" : "cortar", null]);
    out.push(["degradar", null]);
    if (ent.k === "enlace" && ent.ref.tipo !== "sat") out.push(["lambda", null]);
    out.push(["satelite", null]);
    if (burbuja || ent.id === "SITE-METROPOLITANO" || ent.id === "AGG-MADRID") out.push(["evento", null]);
    out.push(["ficha", null]);
    return out.slice(0, 6);
  }
  function caidoEnCaso(id) { var c = NOC.caso; return !!(c && Array.isArray(c.fallos) && c.fallos.indexOf(id) >= 0 && NOC.modo === "lab"); }
  function abrirRadial(id) {
    cerrarRadial(); ocultarTarjeta();
    var p = posicionLocal(id); if (!p) return;
    var acc = accionesDe(id); if (!acc.length) return;
    radialId = id;
    radial = document.createElement("div");
    radial.className = "vv-radial";
    radial.setAttribute("role", "menu");
    radial.setAttribute("aria-label", nombre(id));
    var R0 = Math.max(54, (p.r || 10) + 34), n = acc.length;
    radial.innerHTML = '<div class="vv-radial-nom" style="top:' + (-R0 - 40) + 'px">' + esc(info(id).k === "sitio" ? id : nombre(id)) + '</div>' + acc.map(function (a, i) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / n, x = Math.cos(ang) * R0, y = Math.sin(ang) * R0;
      var etq = t(TX[a[0]]), h = HK[a[0]];
      return '<button type="button" role="menuitem" class="vv-rb" data-acc="' + a[0] + '" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px" aria-label="' + esc(etq + (h ? " (" + h.tecla.toUpperCase() + ")" : "")) + '" data-tip="' + esc(etq) + '">' + ico(a[0] === "ficha" ? "ficha" : a[0], 20) + '</button>';
    }).join("");
    radial.style.left = Math.round(p.x) + "px"; radial.style.top = Math.round(p.y) + "px";
    capa.appendChild(radial);
    var bs = radial.querySelectorAll(".vv-rb");
    if (bs[0]) bs[0].focus();
    radial.addEventListener("click", function (ev) {
      var b = ev.target.closest(".vv-rb"); if (!b) return;
      var a = b.getAttribute("data-acc"), idr = radialId;
      cerrarRadial(true);
      ejecutar(a, idr);
    });
    radial.addEventListener("keydown", function (ev) {
      var lista = Array.prototype.slice.call(radial.querySelectorAll(".vv-rb")), i = lista.indexOf(document.activeElement);
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") { ev.preventDefault(); lista[(i + 1) % lista.length].focus(); }
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") { ev.preventDefault(); lista[(i - 1 + lista.length) % lista.length].focus(); }
      else if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cerrarRadial(true); }
      else if (ev.key === "Tab") { ev.preventDefault(); lista[(i + (ev.shiftKey ? -1 : 1) + lista.length) % lista.length].focus(); }
    });
  }
  function cerrarRadial(volverFoco) {
    if (!radial) return;
    var id = radialId;
    radial.remove(); radial = null; radialId = null;
    if (volverFoco && id && OV[id]) OV[id].focus();
  }
  function ejecutar(a, id) {
    if (a === "ficha") { var x = info(id); if (x && x.ent) NOC.seleccionar(x.k === "enlace" ? "enlace" : "nodo", id); return; }
    if (a === "acercar") { var z = zonaDeId(id); if (z) irNivel("zona", z); else enfocar(id, "red"); return; }
    aplicar(a, id);
  }

  // ---------------------------------------------------------------- aplicar herramienta → evento real en LAB
  var pendienteIr = null, avisoLab = null;
  function instante() {
    var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    var tm = st && esNum(st.t_min) ? st.t_min : (NOC.caso && esNum(NOC.caso.hora) ? NOC.caso.hora * 60 : 0);
    return clamp(Math.round(tm), 0, 1439);
  }
  function aplicar(herr, id) {
    var h = HK[herr]; if (!h) return false;
    var x = id ? info(id) : null;
    var objetivoEnt = x && x.ent ? x.ent : x && x.k === "sitio" ? { k: "sitio", ref: {} } : null;
    if (!objetivoEnt || !h.ok(objetivoEnt)) { rechazo(id); anunciar(t(TX.noAplica)); return false; }
    var idEv = x.k === "sitio" ? null : id;
    if (h.k === "evento") idEv = h.fijo;
    if (h.k === "satelite") idEv = x.k === "sitio" ? x.sitio.zona : zonaDeId(id) || (x.ent && x.ent.ref.tipo === "sat" ? id : null);
    if (NOC.modo === "ref") { if (NOC.setModo) NOC.setModo("lab"); mostrarAvisoLab(); }
    var tm = instante(), params = h.params ? h.params(tm) : null;
    if (NOC.operador && NOC.operador.anadir) {
      pendienteIr = tm;
      NOC.operador.anadir({ t_min: tm, tipo: h.tipo, id: idEv || undefined, params: params || undefined });
    } else if (h.tipo === "fallo" || h.tipo === "reparacion") {
      if (NOC.alternarFallo) NOC.alternarFallo(id);
    } else { anunciar(t(TX.noAplica)); return false; }
    ONDAS.push({ id: id, t0: ahora() });
    pedirFrame();
    var txt = t(TX[h.k]) + " · " + (x.k === "sitio" ? id : nombre(id)) + " · " + hhmm(tm);
    anunciar(txt);
    if (NOC.mensaje) NOC.mensaje(txt);
    return true;
  }
  function rechazo(id) {
    if (!capa) return;
    var p = id ? posicionLocal(id) : null, d = document.createElement("div");
    d.className = "vv-no"; d.textContent = "✕";
    d.style.left = Math.round(p ? p.x : VW / 2) + "px"; d.style.top = Math.round(p ? p.y : VH / 2) + "px";
    capa.appendChild(d); setTimeout(function () { d.remove(); }, 700);
  }
  function mostrarAvisoLab() {
    if (!capa) return;
    if (avisoLab) avisoLab.remove();
    avisoLab = document.createElement("div");
    avisoLab.className = "vv-aviso-lab";
    avisoLab.setAttribute("role", "status");
    avisoLab.innerHTML = '<span class="vv-lab-ins">LAB</span><span>' + esc(t(TX.ahoraLab)) + '</span>';
    capa.appendChild(avisoLab);
    var a = avisoLab;
    setTimeout(function () { if (a === avisoLab) { a.classList.add("fuera"); setTimeout(function () { a.remove(); if (a === avisoLab) avisoLab = null; }, 400); } }, 2400);
  }
  if (NOC.reloj && NOC.reloj.alSerie) NOC.reloj.alSerie(function () {
    pintarReloj(true);
    if (pendienteIr == null) return;
    var tm = pendienteIr; pendienteIr = null;
    setTimeout(function () { if (NOC.reloj.ir) NOC.reloj.ir(tm); }, 0);
  });

  // ---------------------------------------------------------------- arrastrar herramientas
  var arrastre = null;
  function empezarArrastre(ev, k) {
    if (ev.button != null && ev.button !== 0) return;
    arrastre = { k: k, x0: ev.clientX, y0: ev.clientY, mov: false, fantasma: null, objetivo: null, boton: ev.currentTarget };
    ev.preventDefault();
    window.addEventListener("pointermove", moverArrastre);
    window.addEventListener("pointerup", soltarArrastre);
    window.addEventListener("pointercancel", cancelarArrastre);
  }
  function moverArrastre(ev) {
    if (!arrastre) return;
    if (!arrastre.mov && Math.hypot(ev.clientX - arrastre.x0, ev.clientY - arrastre.y0) > 5) {
      arrastre.mov = true;
      var f = document.createElement("div");
      f.className = "vv-fantasma"; f.innerHTML = ico(arrastre.k, 26);
      document.body.appendChild(f); arrastre.fantasma = f;
      el.classList.add("arrastrando");
      ocultarTarjeta(); cerrarRadial();
    }
    if (!arrastre.mov) return;
    arrastre.fantasma.style.left = ev.clientX + "px"; arrastre.fantasma.style.top = ev.clientY + "px";
    var bajo = document.elementFromPoint(ev.clientX, ev.clientY), id = idEnPunto(ev.clientX, ev.clientY);
    if (!id && bajo === cv) { var rc = cv.getBoundingClientRect(), s = sitioCerca(ev.clientX - rc.left, ev.clientY - rc.top); if (s) id = s.id; }
    arrastre.objetivo = id;
    var x = id ? info(id) : null, ok = !!(x && HK[arrastre.k].ok(x.ent || { k: "sitio", ref: {} }));
    arrastre.fantasma.classList.toggle("ok", !!id && ok);
    arrastre.fantasma.classList.toggle("mal", !!id && !ok);
    var nuevoHover = id ? { id: id } : null;
    if ((hover && hover.id) !== (nuevoHover && nuevoHover.id)) { hover = nuevoHover; pedirFrame(); }
  }
  function soltarArrastre(ev) {
    var a = arrastre; cancelarArrastre();
    if (!a) return;
    if (!a.mov) { armar(armada === a.k ? null : a.k); return; }
    if (a.objetivo) aplicar(a.k, a.objetivo);
    void ev;
  }
  function cancelarArrastre() {
    window.removeEventListener("pointermove", moverArrastre);
    window.removeEventListener("pointerup", soltarArrastre);
    window.removeEventListener("pointercancel", cancelarArrastre);
    if (arrastre && arrastre.fantasma) arrastre.fantasma.remove();
    arrastre = null;
    if (el) el.classList.remove("arrastrando");
    hover = null; pedirFrame();
  }
  function armar(k) {
    armada = k;
    if (!el) return;
    el.classList.toggle("armada", !!k);
    Array.prototype.forEach.call(el.querySelectorAll(".vv-herr [data-herr]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-herr") === k)); });
    if (k) anunciar(t(TX[k]) + ": " + t({ es: "elige un elemento", en: "pick an element" }));
  }

  // ---------------------------------------------------------------- reloj grande (día/noche) con NOC.reloj
  var relojEl = null, relojCursor = null, relojHora = null, relojT = -1, relojGen = -1;
  function franjasDiaNoche() {
    // noche 0–6 y 22–24, alba 6–8, día 8–19, ocaso 19–22 (sombreado por bloques, sin degradado)
    var B = [[0, 6, "noche"], [6, 8, "alba"], [8, 19, "dia"], [19, 22, "alba"], [22, 24, "noche"]];
    return B.map(function (b) { return '<rect x="' + b[0] * 60 + '" y="0" width="' + (b[1] - b[0]) * 60 + '" height="40" class="vv-' + b[2] + '"/>'; }).join("");
  }
  function pintarReloj(forzar) {
    if (!relojEl) return;
    var s = NOC.reloj && NOC.reloj.serie ? NOC.reloj.serie() : null, gen = s ? s.n + ":" + (s.pasos[0] && s.pasos[s.pasos.length - 1].resumen.ocup_max_pct) : "x";
    var evs = NOC.operador && NOC.operador.eventos ? NOC.operador.eventos() : [];
    var clave = gen + "|" + JSON.stringify(evs) + "|" + NOC.lang;
    if (!forzar && clave === relojGen) return;
    relojGen = clave;
    var curva = "";
    if (s && s.pasos.length) {
      var mx = 100; s.pasos.forEach(function (p) { if (p.resumen && p.resumen.ocup_max_pct > mx) mx = p.resumen.ocup_max_pct; });
      mx = Math.min(mx, 200);
      curva = '<polyline class="vv-rcurva" points="' + s.pasos.map(function (p) { return p.t_min.toFixed(0) + "," + (40 - Math.min(p.resumen.ocup_max_pct || 0, mx) / mx * 36).toFixed(1); }).join(" ") + '"/>' +
        '<line class="vv-r85" x1="0" x2="1440" y1="' + (40 - 85 / mx * 36).toFixed(1) + '" y2="' + (40 - 85 / mx * 36).toFixed(1) + '"/>';
    }
    var tipos = NOC.operador && NOC.operador.tipos || {};
    var marcas = evs.map(function (e) { var T = tipos[e.tipo] || {}; return '<rect class="vv-rev" x="' + (e.t_min - 4) + '" y="0" width="8" height="8" style="fill:' + (T.color || "var(--tx2)") + '"/>'; }).join("");
    var banda = relojEl.querySelector(".vv-rbanda");
    banda.innerHTML = '<svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">' + franjasDiaNoche() +
      [6, 12, 18].map(function (h) { return '<line class="vv-rtick" x1="' + h * 60 + '" x2="' + h * 60 + '" y1="30" y2="40"/>'; }).join("") + curva + marcas + '</svg>' +
      '<div class="vv-rcursor"></div><div class="vv-rhoras"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>';
    relojCursor = banda.querySelector(".vv-rcursor");
    relojT = -1;
    pintarCursorReloj();
  }
  function pintarCursorReloj() {
    if (!relojEl || !relojCursor) return;
    var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    var tm = st && esNum(st.t_min) ? st.t_min : instante();
    var clave = tm + "|" + (st && st.play) + "|" + (st && st.pelicula) + "|" + (NOC.reloj && NOC.reloj.serie && !!NOC.reloj.serie());
    if (clave === relojT) return;
    relojT = clave;
    relojCursor.style.left = (tm / 1440 * 100).toFixed(3) + "%";
    var h = tm / 60, dia = h >= 7 && h < 21;
    relojHora.innerHTML = ico(dia ? "sol" : "luna", 22) + '<span class="vv-rh">' + hhmm(tm) + '</span>' + (st && !st.pelicula && st.cargada ? '<span class="vv-rhc">' + esc(t(TX.hc)) + '</span>' : '');
    var pb = relojEl.querySelector(".vv-rplay");
    pb.innerHTML = ico(st && st.play ? "pausa" : "play", 22);
    pb.setAttribute("aria-pressed", String(!!(st && st.play)));
    var sl = relojEl.querySelector(".vv-rbanda");
    sl.setAttribute("aria-valuenow", String(Math.round(tm)));
    sl.setAttribute("aria-valuetext", hhmm(tm));
    relojEl.classList.toggle("sin-serie", !(NOC.reloj && NOC.reloj.serie && NOC.reloj.serie()));
  }
  function montarReloj() {
    relojEl = el.querySelector(".vv-reloj");
    relojEl.innerHTML = '<button type="button" class="vv-rplay" aria-label="' + esc(t(TX.play)) + '" data-tip="' + esc(t(TX.play)) + '"></button>' +
      '<div class="vv-rhora" aria-hidden="true"></div>' +
      '<div class="vv-rbanda" role="slider" tabindex="0" aria-label="' + esc(t(TX.reloj)) + '" aria-valuemin="0" aria-valuemax="1439"></div>' +
      '<span class="vv-rcalc">' + esc(t(TX.calculando)) + '</span>';
    relojHora = relojEl.querySelector(".vv-rhora");
    relojEl.querySelector(".vv-rplay").addEventListener("click", function () {
      if (!NOC.reloj) return;
      if (!NOC.reloj.serie || !NOC.reloj.serie()) { anunciar(t(TX.calculando)); return; }
      NOC.reloj.jugar(); relojT = -1; pedirFrame(); setTimeout(pintarCursorReloj, 30);
    });
    var banda = relojEl.querySelector(".vv-rbanda"), arr = false, pend = null, rq = 0;
    function irX(cx) {
      var r = banda.getBoundingClientRect(), tm = clamp((cx - r.left) / r.width, 0, 0.9999) * 1440;
      pend = tm;
      if (!rq) rq = requestAnimationFrame(function () { rq = 0; if (pend != null && NOC.reloj && NOC.reloj.ir) { if (NOC.reloj.estado().play) NOC.reloj.parar(); NOC.reloj.ir(pend); } pend = null; relojT = -1; pintarCursorReloj(); });
    }
    banda.addEventListener("pointerdown", function (ev) { arr = true; banda.setPointerCapture(ev.pointerId); irX(ev.clientX); });
    banda.addEventListener("pointermove", function (ev) { if (arr) irX(ev.clientX); });
    banda.addEventListener("pointerup", function () { arr = false; });
    banda.addEventListener("keydown", function (ev) {
      if (!NOC.reloj || !NOC.reloj.ir) return;
      var st = NOC.reloj.estado(), tm = esNum(st.t_min) ? st.t_min : instante(), paso = st.paso_min || 60, n = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowUp") n = tm + paso;
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") n = tm - paso;
      else if (ev.key === "PageUp") n = tm + 60; else if (ev.key === "PageDown") n = tm - 60;
      else if (ev.key === "Home") n = 0; else if (ev.key === "End") n = 1440 - paso;
      else if (ev.key === " " || ev.key === "Enter") { ev.preventDefault(); NOC.reloj.jugar(); relojT = -1; setTimeout(pintarCursorReloj, 30); return; }
      if (n == null) return;
      ev.preventDefault(); ev.stopPropagation();
      NOC.reloj.ir(((n % 1440) + 1440) % 1440); relojT = -1; pintarCursorReloj();
    });
    pintarReloj(true);
  }

  // ---------------------------------------------------------------- migas de nivel, zoom, leyenda
  function pintarMigas() {
    var m = el && el.querySelector(".vv-migas"); if (!m) return;
    var z = IDX.zonas[ZONA];
    var it = [["madrid", t(TX.madrid)], ["red", t(TX.red)]];
    if (NIV === "zona") it.push(["zona", z ? z.nombre : ZONA]);
    m.innerHTML = it.map(function (x, i) {
      return (i ? '<span class="vv-sep" aria-hidden="true">›</span>' : '') + '<button type="button" data-nivel-vv="' + x[0] + '"' + (x[0] === NIV ? ' aria-current="true"' : '') + '>' + esc(x[1]) + '</button>';
    }).join("") + '<span class="vv-zoom">' +
      '<button type="button" data-zoom-vv="mas" aria-label="' + esc(t(TX.mas)) + '" data-tip="' + esc(t(TX.mas)) + '">' + ico("mas", 16) + '</button>' +
      '<button type="button" data-zoom-vv="menos" aria-label="' + esc(t(TX.menos)) + '" data-tip="' + esc(t(TX.menos)) + '">' + ico("menos", 16) + '</button>' +
      '<button type="button" data-zoom-vv="encajar" aria-label="' + esc(t(TX.encajar)) + '" data-tip="' + esc(t(TX.encajar)) + '">' + ico("encajar", 16) + '</button></span>' +
      (NOC.info ? NOC.info(TX.ayuda) : "");
  }
  function pintarLeyenda() {
    var lg = el && el.querySelector(".vv-ley"); if (!lg) return;
    var filas;
    if (NIV === "zona") filas = TECS.filter(function (k) { return (SITIOS[ZONA] || []).some(function (s) { return s.tec === k; }); }).map(function (k) {
      return '<span class="vv-li"><i class="tri" style="--c:' + (C[TEC_TOK[k]] || C.tx2) + '"></i>' + esc(k.toUpperCase()) + '</span>';
    });
    else filas = CLASES.map(function (c) { return '<span class="vv-li"><i style="--c:' + C["sv-" + c] + '"></i>' + esc(t(NOMSV[c])) + '</span>'; });
    var est_ = [["ok", "●"], ["min", "▲"], ["maj", "◆"], ["crit", "■"], ["unk", "✕"]].map(function (x) {
      return '<span class="vv-li"><b class="vv-g" style="color:' + colorSev(x[0]) + '">' + x[1] + '</b>' + SEVTXT[x[0]] + '</span>';
    }).join("");
    lg.innerHTML = '<button type="button" class="vv-ley-b" aria-expanded="' + leyendaAbierta + '">' + esc(t(TX.leyenda)) + '</button>' +
      (leyendaAbierta ? '<div class="vv-ley-c"><div class="vv-ley-f">' + filas.join("") + '</div><div class="vv-ley-f">' + est_ + '</div></div>' : '');
  }

  // ---------------------------------------------------------------- aria-live y resumen
  var vivo = null;
  function anunciar(txt) { if (!vivo) return; vivo.textContent = ""; setTimeout(function () { vivo.textContent = txt; }, 30); }
  function resumenAria() {
    var r = NOC.resultado; if (!r || !r.resumen) return;
    var rs = r.resumen, id = rs.enlace_max;
    RESUMEN = t({ es: "Red al ", en: "Network at " }) + fmt((rs.max_ocupacion || 0) * 100, 1) + " %" + (id ? t({ es: " en ", en: " on " }) + nombre(id) : "") + "; " +
      fmt(rs.pct_servida != null ? rs.pct_servida : 100, 1) + " % " + t({ es: "servido", en: "served" });
    if (cv) cv.setAttribute("aria-label", t(TX.titulo) + ". " + RESUMEN);
    if (montado && activa) refrescarAria();
  }

  // ---------------------------------------------------------------- posiciones (para PREGUNTAS / anotaciones)
  function posicionLocal(id) {
    if (IDX.zonas[id] && AGG_DE_ZONA[id]) id = AGG_DE_ZONA[id];
    var ent = ENT[id];
    if (ent && ent.k === "nodo" && ent.s) return { x: ent.s[0], y: ent.s[1], r: ent.r, visible: ent.al > 0.5 };
    if (ent && ent.k === "enlace" && ent.s1) { var q = bez(ent, 0.5); return { x: q[0], y: q[1], r: 6, visible: ent.al > 0.5 }; }
    var s = sitioPorId(id); if (s && s.s) return { x: s.s[0], y: s.s[1], r: 4, visible: s.al > 0.5 };
    return null;
  }
  function avisarMover() { oyentes.slice().forEach(function (f) { try { f(); } catch (e) { console.error("viva: alMover", e); } }); if (tarjetaId && tarjeta && !tarjeta.hidden) mostrarTarjeta(tarjetaId); }

  // ---------------------------------------------------------------- API pública
  function asegurarActiva() {
    if (!(montado && activa) && NOC.activarVista) NOC.activarVista(ID);
    if (montado) { medir(); calcularPantalla(ahora()); }
  }
  function enfocar(id, nivel, opc) {
    opc = opc || {};
    asegurarActiva();
    var z = zonaDeId(id), ent = ENT[id] || (z ? ENT[AGG_DE_ZONA[z]] : null);
    if (!nivel) nivel = IDX.zonas[id] ? "zona" : ent && enNivel(ent, NIV, ZONA) ? NIV : "red";
    if (nivel === "zona" && !z && ent) { var met = ent.tipo === "agg" ? ent.id : null; z = met ? zonaDeId(met) : null; }
    if (nivel === "zona" && !z) nivel = "red";
    var c = camEncaje(nivel, z || ZONA);
    if (ent && nivel !== "zona") {
      if (ent.k === "enlace") {
        var a = posNivel(ENT[ent.a], nivel), b = posNivel(ENT[ent.b], nivel);
        if (enNivel(ent, nivel, z)) c = encajarCaja({ x0: Math.min(a[0], b[0]) - 60, y0: Math.min(a[1], b[1]) - 60, x1: Math.max(a[0], b[0]) + 60, y1: Math.max(a[1], b[1]) + 60 }, 40);
        c.k = Math.min(c.k, camEncaje(nivel).k * 2.5);
      } else if (enNivel(ent, nivel, z)) {
        var p = posNivel(ent, nivel), k0 = camEncaje(nivel).k;
        c = { x: p[0], y: p[1], k: k0 * (opc.zoom || (nivel === "madrid" ? 1.6 : 2)) };
      }
    }
    return irNivel(nivel, z || ZONA, { cam: c });
  }
  function resaltar(ids) {
    if (!ids || !ids.length) RES = null;
    else {
      RES = {};
      ids.forEach(function (id) {
        if (IDX.zonas[id] && AGG_DE_ZONA[id]) id = AGG_DE_ZONA[id];
        RES[id] = true;
        var e = ENT[id];
        if (e && e.k === "enlace") { RES[e.a] = true; RES[e.b] = true; }
      });
    }
    cacheFrame = -1; pedirFrame();
  }
  function camara(o, opc) {
    if (!o) return { nivel: NIV, zona: NIV === "zona" ? ZONA : null, x: cam.x, y: cam.y, k: cam.k, encaje: kEncaje };
    asegurarActiva();
    opc = opc || {};
    if (o.nivel && (o.nivel !== NIV || (o.nivel === "zona" && o.zona && o.zona !== ZONA))) return irNivel(o.nivel, o.zona, { dur: opc.dur });
    if (o.encajar) return moverCam(camEncaje(NIV, ZONA), opc.dur);
    if (Array.isArray(o.ids) && o.ids.length) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      o.ids.forEach(function (id) {
        if (IDX.zonas[id] && AGG_DE_ZONA[id]) id = AGG_DE_ZONA[id];
        var e = ENT[id], pts = [];
        if (e && e.k === "nodo" && enNivel(e, NIV, ZONA)) pts.push(posNivel(e, NIV));
        if (e && e.k === "enlace" && enNivel(e, NIV, ZONA)) { pts.push(posNivel(ENT[e.a], NIV)); pts.push(posNivel(ENT[e.b], NIV)); }
        var s = sitioPorId(id); if (s && NIV === "zona") pts.push(s.p);
        pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
      });
      if (!isFinite(x0)) return Promise.resolve();
      var m = (o.margen != null ? o.margen : 50) / Math.max(1e-6, cam.k);
      var c = encajarCaja({ x0: x0 - m, y0: y0 - m, x1: x1 + m, y1: y1 + m }, 30);
      c.k = Math.min(c.k, kEncaje * 4);
      return moverCam(c, opc.dur);
    }
    var dest = { x: esNum(o.x) ? o.x : cam.x, y: esNum(o.y) ? o.y : cam.y, k: esNum(o.k) ? o.k : esNum(o.zoom) ? kEncaje * o.zoom : cam.k };
    return moverCam(dest, opc.dur);
  }
  NOC.viva = {
    enfocar: enfocar,
    resaltar: resaltar,
    camara: camara,
    // coordenadas de ventana (clientX/Y, como getBoundingClientRect) del elemento: {x, y, r, visible} o null si no está en el nivel
    posicion: function (id) {
      if (!montado) return null;
      var p = posicionLocal(id); if (!p) return null;
      var rc = el.querySelector(".vv-lienzo").getBoundingClientRect();
      var dentro = p.x >= 0 && p.y >= 0 && p.x <= VW && p.y <= VH;
      return { x: rc.left + p.x, y: rc.top + p.y, r: p.r, visible: !!(p.visible && dentro && activa) };
    },
    nivel: function (n, zona) { if (n) { asegurarActiva(); return irNivel(n, zona); } return NIV; },
    alMover: function (fn) { if (typeof fn !== "function") return function () {}; oyentes.push(fn); return function () { var i = oyentes.indexOf(fn); if (i >= 0) oyentes.splice(i, 1); }; },
    aplicar: function (herr, id) { return aplicar(herr, id); },
    elemento: function (id) {
      var x = info(id); if (!x) return null;
      if (x.k === "sitio") { var s = SITV[id] || {}; return { id: id, k: "sitio", tec: x.sitio.tec, util_pct: s.u, gbps: s.G }; }
      var v = valor(x.ent.id) || {};
      return { id: x.ent.id, k: x.k, tipo: x.tipo, nombre: nombre(x.ent.id), gbps: v.G, ocupacion: v.o, caido: !!v.down, sev: sev(v), dl_gbps: v.dl, pct_servido: v.pct };
    },
    herramientas: function () { return HERR.map(function (h) { return { k: h.k, tecla: h.tecla, tipo: h.tipo }; }); },
    fps: function () { return FPS.v; }
  };

  // ---------------------------------------------------------------- montaje
  function medir() {
    var L = el.querySelector(".vv-lienzo"), w = L.clientWidth || 800, h = L.clientHeight || 600, d = window.devicePixelRatio || 1;
    if (w === VW && h === VH && d === DPR && cv.width) return false;
    var rel = { x: cam.x, y: cam.y, k: cam.k / Math.max(1e-6, kEncaje) };
    VW = w; VH = h; DPR = d;
    cv.width = Math.round(w * d); cv.height = Math.round(h * d);
    cv.style.width = w + "px"; cv.style.height = h + "px";
    ov.setAttribute("width", w); ov.setAttribute("height", h); ov.setAttribute("viewBox", "0 0 " + w + " " + h);
    kEncaje = camEncaje(NIV, ZONA).k;
    cam = { x: rel.x, y: rel.y, k: rel.k * kEncaje };
    verPos++;
    return true;
  }
  function montar(contenedor) {
    el = contenedor;
    leerTokens();
    el.innerHTML =
      '<div class="vv-lienzo">' +
      '<canvas class="vv-cv" role="img" aria-label="' + esc(t(TX.titulo)) + '"></canvas>' +
      '<svg class="vv-ov" aria-label="' + esc(t(TX.titulo)) + '" role="group"><g class="vv-ovg"></g></svg>' +
      '<div class="vv-capa"></div>' +
      '</div>' +
      '<div class="vv-herr" role="toolbar" aria-label="' + esc(t(TX.herramientas)) + '" aria-orientation="vertical">' + HERR.map(function (h) {
        return '<button type="button" data-herr="' + h.k + '" aria-pressed="false" aria-label="' + esc(t(TX[h.k]) + " (" + h.tecla.toUpperCase() + ")") + '" data-tip="' + esc(t(TX[h.k]) + " · " + h.tecla.toUpperCase()) + '">' + ico(h.k, 24) + '</button>';
      }).join("") + '</div>' +
      '<nav class="vv-migas" aria-label="' + esc(t({ es: "Nivel de zoom", en: "Zoom level" })) + '"></nav>' +
      '<div class="vv-ley"></div>' +
      '<div class="vv-reloj"></div>' +
      '<div class="vv-tarjeta" hidden role="tooltip" id="vv-tarjeta"></div>' +
      '<span id="vv-teclas" class="vv-oculto">' + esc(t(TX.teclas)) + '</span>' +
      '<div class="vv-oculto" aria-live="polite" role="status"></div>';
    cv = el.querySelector(".vv-cv"); ctx = cv.getContext("2d");
    ov = el.querySelector(".vv-ov"); gOv = el.querySelector(".vv-ovg"); capa = el.querySelector(".vv-capa");
    tarjeta = el.querySelector(".vv-tarjeta"); vivo = el.querySelector('[aria-live]');
    montado = true;
    medir();
    kEncaje = camEncaje(NIV, ZONA).k;
    cam = camEncaje(NIV, ZONA);
    if (!Object.keys(VAL).length && NOC.resultado) { VAL = objetivo(); PREV = {}; T_VAL = -1e9; }
    construirOverlay();
    pintarMigas(); pintarLeyenda(); montarReloj(); resumenAria();
    enganchar();
    if (window.ResizeObserver) { var tz = 0; new ResizeObserver(function () { clearTimeout(tz); tz = setTimeout(function () { if (medir()) pedirFrame(); }, 50); }).observe(el.querySelector(".vv-lienzo")); }
    if (window.MutationObserver) new MutationObserver(function () { leerTokens(); pintarLeyenda(); pedirFrame(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-tema"] });
    if (window.MutationObserver) new MutationObserver(function () { leerTokens(); pedirFrame(); }).observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme", "data-tema"] });
  }
  function enganchar() {
    var L = el.querySelector(".vv-lienzo");
    // puntero sobre elementos (capa SVG) y sitios (lienzo)
    L.addEventListener("pointermove", function (ev) {
      if (arrastre || pan) return;
      var id = entDeEvento(ev);
      if (!id && NIV === "zona") { var rc = L.getBoundingClientRect(), s = sitioCerca(ev.clientX - rc.left, ev.clientY - rc.top); if (s) id = s.id; }
      if ((hover && hover.id) !== id) { hover = id ? { id: id } : null; pedirFrame(); }
      L.classList.toggle("sobre", !!id);
      if (id) mostrarTarjeta(id); else ocultarTarjeta();
    });
    L.addEventListener("pointerleave", function () { hover = null; ocultarTarjeta(); pedirFrame(); });
    // pan con arrastre en el fondo; clic = acción
    var pan = null;
    L.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0 || ev.target.closest(".vv-radial")) return;
      pan = { x: ev.clientX, y: ev.clientY, cam: { x: cam.x, y: cam.y, k: cam.k }, mov: false, id: entDeEvento(ev) };
      if (!pan.id && NIV === "zona") { var rc = L.getBoundingClientRect(), s = sitioCerca(ev.clientX - rc.left, ev.clientY - rc.top); if (s) pan.id = s.id; }
    });
    window.addEventListener("pointermove", function (ev) {
      if (!pan) return;
      var dx = ev.clientX - pan.x, dy = ev.clientY - pan.y;
      if (!pan.mov && Math.hypot(dx, dy) > 4) { pan.mov = true; L.classList.add("moviendo"); cerrarRadial(); ocultarTarjeta(); }
      if (pan.mov) { cam = { x: pan.cam.x - dx / cam.k, y: pan.cam.y - dy / cam.k, k: cam.k }; camAnim = null; verPos++; pedirFrame(); }
    });
    window.addEventListener("pointerup", function () {
      var p = pan; pan = null; L.classList.remove("moviendo");
      if (!p || p.mov) return;
      if (!p.id) { cerrarRadial(); if (armada) armar(null); return; }
      if (armada) { aplicar(armada, p.id); return; }
      abrirRadial(p.id);
    });
    L.addEventListener("dblclick", function (ev) {
      var id = entDeEvento(ev), z = id ? zonaDeId(id) : null;
      if (z && NIV !== "zona") { ev.preventDefault(); cerrarRadial(); irNivel("zona", z); }
      else if (!id) { cerrarRadial(); subirNivel(); }
    });
    // rueda: zoom alrededor del puntero; zoom semántico al pasar umbrales
    var ultimoSalto = 0;
    L.addEventListener("wheel", function (ev) {
      ev.preventDefault();
      if (TR) return;
      var rc = L.getBoundingClientRect(), sp = [ev.clientX - rc.left, ev.clientY - rc.top];
      var f = Math.exp(-ev.deltaY * (ev.deltaMode === 1 ? 0.05 : 0.0015));
      zoomEn(sp, f, ultimoSalto, function () { ultimoSalto = ahora(); });
    }, { passive: false });
    // capa accesible: foco = tarjeta; teclas = herramientas
    gOv.addEventListener("focusin", function (ev) { var id = entDeEvento(ev); foco = id; if (id) mostrarTarjeta(id); pedirFrame(); });
    gOv.addEventListener("focusout", function () { foco = null; if (!hover) ocultarTarjeta(); pedirFrame(); });
    gOv.addEventListener("keydown", function (ev) {
      var id = entDeEvento(ev); if (!id) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var k = ev.key.toLowerCase();
      if (k === "enter" || k === " ") { ev.preventDefault(); if (armada) aplicar(armada, id); else abrirRadial(id); return; }
      if (k === "z") { ev.preventDefault(); ejecutar("acercar", id); return; }
      var h = HERR.filter(function (x) { return x.tecla === k; })[0];
      if (h) { ev.preventDefault(); ev.stopPropagation(); aplicar(h.k, id); }
    });
    // herramientas: arrastrar, o pulsar para armar
    var herr = el.querySelector(".vv-herr");
    Array.prototype.forEach.call(herr.querySelectorAll("[data-herr]"), function (b) {
      var k = b.getAttribute("data-herr");
      b.addEventListener("pointerdown", function (ev) { empezarArrastre(ev, k); });
      b.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); armar(armada === k ? null : k); }
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          ev.preventDefault();
          var l = Array.prototype.slice.call(herr.querySelectorAll("[data-herr]")), i = l.indexOf(b);
          l[(i + (ev.key === "ArrowDown" ? 1 : -1) + l.length) % l.length].focus();
        }
      });
      b.addEventListener("click", function (ev) { if (ev.detail === 0) return; });   // el clic de ratón lo gestiona pointerup
    });
    // migas, zoom y leyenda
    el.querySelector(".vv-migas").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-nivel-vv]");
      if (b) { irNivel(b.getAttribute("data-nivel-vv"), ZONA); return; }
      var z = ev.target.closest("[data-zoom-vv]"); if (!z) return;
      var a = z.getAttribute("data-zoom-vv"), A = area(), centro = [(A.l + A.r) / 2, (A.t + A.b) / 2];
      if (a === "encajar") moverCam(camEncaje(NIV, ZONA));
      else zoomEn(centro, a === "mas" ? 1.4 : 1 / 1.4, 0, function () {}, true);
    });
    el.querySelector(".vv-ley").addEventListener("click", function (ev) {
      if (!ev.target.closest(".vv-ley-b")) return;
      leyendaAbierta = !leyendaAbierta; guardarEst(); pintarLeyenda();
      var b = el.querySelector(".vv-ley-b"); if (b) b.focus();
    });
    // teclado de la vista: +/- zoom, 0 encajar, Esc cerrar/subir nivel
    el.addEventListener("keydown", function (ev) {
      if (ev.target.closest && ev.target.closest(".vv-rbanda, input, select, textarea")) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var A = area(), centro = [(A.l + A.r) / 2, (A.t + A.b) / 2];
      if (ev.key === "+" || ev.key === "=") { ev.preventDefault(); zoomEn(centro, 1.4, 0, function () {}, true); }
      else if (ev.key === "-" || ev.key === "_") { ev.preventDefault(); zoomEn(centro, 1 / 1.4, 0, function () {}, true); }
      else if (ev.key === "0") { ev.preventDefault(); moverCam(camEncaje(NIV, ZONA)); }
      else if (ev.key === "Escape") {
        if (radial) { cerrarRadial(true); ev.preventDefault(); }
        else if (armada) { armar(null); ev.preventDefault(); }
        else if (NIV !== "madrid") { ev.preventDefault(); subirNivel(); }
      }
    });
    // la ficha / la selección de otras vistas se ve aquí
  }
  // zoom con umbrales semánticos: por encima de 2,2× en MADRID → RED; por debajo de 0,65× en RED/ZONA → nivel superior;
  // en RED por encima de 3× sobre una zona → ZONA
  function zoomEn(sp, f, ultimo, marcar, conAnim) {
    var k = clamp(cam.k * f, kEncaje * 0.5, kEncaje * 8), w = aMundo(sp, cam);
    var reciente = ahora() - ultimo < 700;
    if (!reciente && f > 1 && NIV === "madrid" && k > kEncaje * 2.2) { marcar(); irNivel("red"); return; }
    if (!reciente && f > 1 && NIV === "red" && k > kEncaje * 3) {
      var z = aggCercano(w); if (z) { marcar(); irNivel("zona", z); return; }
    }
    if (!reciente && f < 1 && NIV !== "madrid" && k < kEncaje * 0.65) { marcar(); subirNivel(); return; }
    var nuevo = { k: k, x: w[0] - (sp[0] - (area().l + area().r) / 2) / k, y: w[1] - (sp[1] - (area().t + area().b) / 2) / k };
    if (conAnim) moverCam(nuevo, 220);
    else { cam = nuevo; camAnim = null; verPos++; pedirFrame(); }
  }
  function aggCercano(w) {
    var mejor = null, d = Infinity;
    LISTA_N.forEach(function (e) { if (e.tipo !== "agg" || !e.zona) return; var p = e.p.red, dd = Math.hypot(p[0] - w[0], p[1] - w[1]); if (dd < d) { d = dd; mejor = e.zona.id; } });
    return d < 60 ? mejor : null;
  }

  function acabarAnimaciones() {
    if (camAnim) { cam = { x: camAnim.a.x, y: camAnim.a.y, k: camAnim.a.k }; var f = camAnim.fin; camAnim = null; if (f) f(); }
    if (TR) { var g = TR.fin; TR = null; if (g) g(); }
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) acabarAnimaciones(); });

  // ---------------------------------------------------------------- registro
  construirModelo();
  NOC.registrarVista({
    id: ID, grupo: ["red", "simulacion"], titulo: TX.titulo,
    montar: montar,
    activar: function () { activa = true; leerTokens(); medir(); pintarReloj(true); refrescarAria(); pedirFrame(); },
    desactivar: function () { activa = false; if (raf) cancelAnimationFrame(raf); raf = 0; acabarAnimaciones(); cerrarRadial(); ocultarTarjeta(); cancelarArrastre(); }
  });
  NOC.on("resultado", function () { nuevoResultado(); if (montado) pintarReloj(); });
  NOC.on("seleccion", function () { pedirFrame(); });
  NOC.on("modo", function () { if (montado) pintarReloj(true); });
  NOC.on("lang", function () {
    if (!montado) return;
    var cont = el; montado = false; cont.innerHTML = "";
    montar(cont); if (activa) pedirFrame();
  });
  NOC.on("nivel", function () { if (montado) { tarjetaId = null; pintarMigas(); } });
  if (NOC.resultado) nuevoResultado();
})();
