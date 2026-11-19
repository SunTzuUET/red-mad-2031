// escenarios.js — diseñador de escenarios por pasos (CONTRATO_UI.md, Revisión 11, dueño ESCENARIOS).
//  1 Partida (tarjetas: caso actual, REF v7, plantillas de Motor.plantillasEventos, estudios guardados, vacío)
//  2 Cuándo (tráfico, día, año, hora; curva de 24 h de demanda de fondo)
//  3 Qué pasa (línea de tiempo 0–24 h: fallos, degradar, eventos de demanda; multiplicadores por zona/servicio)
//  4 Operador (acciones como bloques en la misma línea)
//  5 Resultado (KPI antes/después con medidores, 3 cambios mayores con Motor.comparar, película, estudio, compartir)
// Todo se escribe en NOC.caso: eventos con NOC.operador.reemplazar/anadir, modelo_usuario.factores con NOC.aplicarModelo,
// día/año/hora con NOC.aplicarCaso. No calcula nada por su cuenta: Motor.serieAsync / Motor.calcular / Motor.comparar.
// API: NOC.escenarios = {abrir(paso?), cerrar(), alternar(), estado()}. Cualquier [data-accion="disenar-escenario"] lo abre.
(function () {
  "use strict";
  var NOC = window.NOC, Motor = window.Motor;
  if (!NOC || !NOC.RED || !Motor) return;
  var RED = NOC.RED, IDX = NOC.idx || { nodos: {}, enlaces: {}, zonas: {} };

  // ---------------------------------------------------------------- utilidades
  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es) || ""; }
  function fmt(x, d) { return NOC.fmt ? NOC.fmt(x, d) : Number(x).toFixed(d); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function copia(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardarLS(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.max(0, Math.min(1440, Math.round(m || 0))); return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function deHHMM(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || "")); return m ? Math.max(0, Math.min(1440, Number(m[1]) * 60 + Number(m[2]))) : null; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  var uidN = 0;
  function nuevoUid() { return "ds" + Date.now().toString(36) + (uidN++).toString(36); }
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  // ---------------------------------------------------------------- iconos (NOC.icono de VISUAL con respaldo propio, rejilla 24)
  var LOC = {
    partida: '<path d="M6 21V3M6 4h11l-2.5 4L17 12H6"/>',
    cuando: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    quepasa: '<path d="M13 2 5 13.5h6L10 22l8-11.5h-6z"/>',
    operador: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
    resultado: '<path d="M5 20v-7M12 20V5M19 20v-10M3 21h18"/>',
    fallo: '<path d="M2 12h7M15 12h7M10.5 7l3 10"/>',
    degradar: '<path d="M3 6l6 6 4-4 8 8M21 10v6h-6"/>',
    reparacion: '<path d="M15 3.5a4.5 4.5 0 0 0-5.3 5.9L3 16.2 7.8 21l6.8-6.7A4.5 4.5 0 0 0 20.5 9l-3 3-3.5-3.5 3-3z"/>',
    demanda: '<circle cx="12" cy="7" r="3"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>',
    te: '<path d="M3 17h6c4 0 4-10 8-10h4M18 4l3 3-3 3M3 7h4"/>',
    ntn: '<path d="M8.5 8.5l7 7M6 11l5-5 2 2-5 5zM11 16l5-5 2 2-5 5zM4 20l3-3"/>',
    lambda: '<path d="M5 21 11.5 9M8 3l9 18"/><path d="M17 3v6M14 6h6"/>',
    prioridad: '<path d="M12 21V4M6 10l6-6 6 6M6 16h12"/>',
    apagar: '<path d="M12 3v8M7 6.5a7 7 0 1 0 10 0"/>',
    ref: '<rect x="5" y="11" width="14" height="9.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    plantilla: '<path d="M12 3 21 7.5 12 12 3 7.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
    estudio: '<path d="M3 6h7l2 2.5h9V20H3z"/>',
    vacio: '<rect x="4" y="4" width="16" height="16"/><path d="M12 8v8M8 12h8"/>',
    actual: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>',
    laborable: '<rect x="3" y="7.5" width="18" height="12"/><path d="M9 7.5V5h6v2.5M3 12.5h18"/>',
    fin_de_semana: '<path d="M3 18h18M6.5 14a5.5 5.5 0 0 1 11 0M12 4v3M5 8l2 2M19 8l-2 2"/>',
    agosto: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    partido: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5l4 3-1.5 4.5h-5L8 10.5zM12 3.5v4M16 10.5l4-1M14.5 15l2.5 3.5M9.5 15 7 18.5M8 10.5l-4-1"/>',
    pelicula: '<path d="M7 4.5 19 12 7 19.5z"/>',
    guardar: '<path d="M4 3h13l3 3v15H4zM7 3v5h9V3M7 21v-7h10v7"/>',
    compartir: '<path d="M10 14l4-4M9 17l-1.5 1.5a3.5 3.5 0 0 1-5-5L5 11a3.5 3.5 0 0 1 5 0M14 7l1.5-1.5a3.5 3.5 0 0 1 5 5L19 13a3.5 3.5 0 0 1-5 0"/>',
    mapa: '<path d="M12 21s7-6 7-11.5a7 7 0 0 0-14 0C5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    buscar: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
    aviso: '<path d="M12 3 22 20H2z"/><path d="M12 9.5v5M12 16.8v.6"/>',
    error: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>',
    ok: '<path d="M4 12.5 9.5 18 20 6.5"/>',
    borrar: '<path d="M4 6h16M9 6V3.5h6V6M6 6l1 15h10l1-15"/>',
    cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    izq: '<path d="M15 5l-7 7 7 7"/>', der: '<path d="M9 5l7 7-7 7"/>',
    hc: '<path d="M4 20V10M10 20V4M16 20v-8M3 21h18"/>',
    hora: '<path d="M3 17c3-9 6-9 9-4s6 5 9-4"/>',
    zona: '<path d="M3 6l6-2.5 6 2.5 6-2.5v15L15 21l-6-2.5L3 21z"/><path d="M9 3.5v15M15 6v15"/>',
    enlace: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7.2 12h9.6"/>',
    nodo: '<rect x="6" y="6" width="12" height="12"/>'
  };
  // claves propias -> claves de iconos.js (NOC.icono) cuando existen allí
  var A_VISUAL = { fallo: "fallo", cuando: "reloj", pelicula: "play", mapa: "mapa", buscar: "buscar", mas: "mas", cerrar: "cerrar", ref: "candado",
    ntn: "ntn", ok: "ok", aviso: "min", error: "crit", demanda: "evento", partido: "evento", enlace: "enlace", calendario: "calendario",
    movil: "embb", ftth: "ftth", voz: "voz", urllc: "urllc", iot: "iot", empresa: "l2vpn", evento: "evento", n258: "n258", n78: "n78", n28: "n28" };
  function ico(k, tam) {
    tam = tam || 16;
    if (NOC.icono && A_VISUAL[k]) { try { var r = NOC.icono(A_VISUAL[k], tam); if (r) return typeof r === "string" ? r : r.outerHTML; } catch (e) { /* respaldo */ } }
    var p = LOC[k] || LOC.nodo;
    return '<svg class="ds-ico" viewBox="0 0 24 24" width="' + tam + '" height="' + tam + '" aria-hidden="true" focusable="false">' + p + '</svg>';
  }
  function info(txt) {
    var s = t(txt);
    if (NOC.info) { try { var r = NOC.info(s); if (r) return typeof r === "string" ? r : r.outerHTML; } catch (e) { /* respaldo */ } }
    return '<span class="ds-info" tabindex="0" role="note" aria-label="' + esc(s) + '" title="' + esc(s) + '">i</span>';
  }

  // ---------------------------------------------------------------- nombres
  function nomNodo(id) { var n = IDX.nodos && IDX.nodos[id]; return n && n.nombre ? n.nombre : (NOC.nombre ? NOC.nombre(id) : id); }
  var CLASES = Motor.CLASES_SERVICIO || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var NOMSV = { movil: { es: "Móvil", en: "Mobile" }, ftth: { es: "FTTH", en: "FTTH" }, voz: { es: "Voz", en: "Voice" }, urllc: { es: "URLLC / V2X", en: "URLLC / V2X" },
    iot: { es: "IoT", en: "IoT" }, empresa: { es: "Empresa", en: "Enterprise" }, evento: { es: "Evento", en: "Event" }, ntn: { es: "Satélite", en: "Satellite" } };
  function nomClase(c) { var i = NOC.infoServicio && NOC.infoServicio[c]; return t((i && i.n) || NOMSV[c] || { es: c, en: c }); }
  function nomEsc(id) { var e = (RED.escenarios || []).filter(function (x) { return x.id === id; })[0]; return e ? (NOC.lang === "en" && e.nombre_en ? e.nombre_en : e.nombre) : id; }
  function corto(id) {
    if (!id) return "";
    if (/^clase:/.test(id)) return nomClase(id.slice(6));
    if (/^n(258|78|28)$/.test(id)) return id;
    if (NOC.nombreCorto) { try { var r = NOC.nombreCorto(id); if (r && r !== id) return r; } catch (e) { /* respaldo */ } }
    var l = IDX.enlaces && IDX.enlaces[id];
    if (l) return nomNodo(l.a) + " – " + nomNodo(l.b);
    if (IDX.nodos && IDX.nodos[id]) return nomNodo(id);
    if (IDX.zonas && IDX.zonas[id]) return IDX.zonas[id].nombre || id;
    if ((RED.escenarios || []).some(function (x) { return x.id === id; })) return nomEsc(id);
    return id;
  }

  // ---------------------------------------------------------------- tipos de bloque
  // carril: red (fallos/degradación), dem (demanda), op (acciones del operador). p = parámetro principal (deslizador).
  var TB = {
    fallo: { carril: "red", ico: "fallo", elem: "ne", color: "var(--crit)", n: { es: "Fallo", en: "Failure" } },
    degradar: { carril: "red", ico: "degradar", elem: "ne", color: "var(--maj)", n: { es: "Degradar", en: "Degrade" },
      p: { k: "factor", def: 0.5, min: 0.05, max: 1, step: 0.05, n: { es: "Capacidad que queda", en: "Capacity left" }, pct: true } },
    reparacion: { carril: "red", ico: "reparacion", elem: "ne", color: "var(--ok)", instante: true, n: { es: "Reparación", en: "Repair" } },
    evento_demanda: { carril: "dem", ico: "demanda", elem: "esc", color: "var(--sv-evento)", n: { es: "Evento de demanda", en: "Demand event" } },
    te_reencaminar: { carril: "op", ico: "te", elem: "e", color: "var(--wrn)", n: { es: "Desviar tráfico (TE)", en: "Reroute (TE)" },
      p: { k: "fraccion", def: 1, min: 0.1, max: 1, step: 0.1, n: { es: "Tráfico desviado", en: "Traffic moved" }, pct: true } },
    activar_ntn: { carril: "op", ico: "ntn", elem: "opt", color: "var(--sv-ntn)", n: { es: "Satélite NTN", en: "NTN satellite" } },
    anadir_lambda: { carril: "op", ico: "lambda", elem: "e", color: "var(--sv-empresa)", n: { es: "Añadir λ", en: "Add λ" },
      p: { k: "n", def: 1, min: 1, max: 14, step: 1, n: { es: "Módulos", en: "Modules" } } },
    priorizar_slice: { carril: "op", ico: "prioridad", elem: "clase", color: "var(--sv-urllc)", n: { es: "Priorizar servicio", en: "Prioritise service" },
      p: { k: "prioridad", def: 0, min: 0, max: 9, step: 1, n: { es: "Prioridad (0 = máxima)", en: "Priority (0 = top)" } } },
    apagar_capa: { carril: "op", ico: "apagar", elem: "tec", color: "var(--band-n258)", n: { es: "Apagar capa radio", en: "Switch off radio layer" } }
  };
  var CARRILES = [
    { id: "red", ico: "fallo", n: { es: "Red", en: "Network" }, paso: 3 },
    { id: "dem", ico: "demanda", n: { es: "Demanda", en: "Demand" }, paso: 3 },
    { id: "op", ico: "operador", n: { es: "Operador", en: "Operator" }, paso: 4 }
  ];
  var PALETA3 = ["fallo", "degradar", "evento_demanda"];
  var PALETA4 = ["te_reencaminar", "anadir_lambda", "activar_ntn", "priorizar_slice", "apagar_capa"];
  function soporta(tipo) { try { return NOC.operador && NOC.operador.soporta ? NOC.operador.soporta(tipo) : true; } catch (e) { return true; } }

  // ---------------------------------------------------------------- ejes del caso
  var MT = RED.modelos_trafico || {};
  var CR = MT.crecimiento || {};
  var ANIO_MIN = CR.anio_min || 2025, ANIO_MAX = CR.anio_max || 2031;
  var CASOS = null;
  try { CASOS = Motor.casos ? Motor.casos(RED) : null; } catch (e) { CASOS = null; }
  var TRAFICOS = (CASOS && CASOS.trafico) || [{ id: "BH", es: "Hora cargada coincidente", en: "Coincident busy hour", usa_hora: false }];
  function trafico(id) { return TRAFICOS.filter(function (x) { return x.id === id; })[0] || null; }
  function cargado(id) { var x = trafico(id); return x ? x.usa_hora === false : true; }
  var DIAS = Object.keys(MT.tipos_dia || {}).filter(function (k) { return k.charAt(0) !== "_"; });
  if (!DIAS.length) DIAS = ["laborable"];
  function nomDia(k) { var d = (MT.tipos_dia || {})[k] || {}; return NOC.lang === "en" ? (d.nombre_en || d.nombre_es || k) : (d.nombre_es || k); }
  var ESCENARIOS_DEM = ((CASOS && CASOS.evento) || []).filter(function (x) { return x.id && x.id !== "ninguno"; });
  var ZONAS = (RED.zonas || []).map(function (z) { return { id: z.id, nombre: z.nombre || z.id }; });
  var TECS = ["n258", "n78", "n28"];

  function existe(tipo, id) {
    var T = TB[tipo] || {};
    switch (T.elem) {
      case "ne": return !!(IDX.nodos[id] || IDX.enlaces[id]);
      case "e": return !!IDX.enlaces[id];
      case "esc": return (RED.escenarios || []).some(function (x) { return x.id === id; });
      case "clase": return /^clase:/.test(id) ? CLASES.indexOf(id.slice(6)) >= 0 : !!id;
      case "tec": return TECS.indexOf(id) >= 0;
      case "opt": return !id || !!(IDX.nodos[id] || (IDX.zonas && IDX.zonas[id]));
    }
    return true;
  }
  function necesitaId(tipo) { var e = (TB[tipo] || {}).elem; return e && e !== "opt"; }

  // ---------------------------------------------------------------- borrador (D) <-> NOC.caso
  // D = {trafico, dia, anio, hora, evento, fallosBase[], bloques[{uid, tipo, id, t, fin|null, params}], factores{clave: f}, muBase}
  var D = null;
  function finDe(e) { var p = e.params || {}; return esNum(p.hasta_min) ? p.hasta_min : esNum(p.duracion_min) ? e.t_min + p.duracion_min : null; }
  function aBloques(evs) {
    var l = (evs || []).map(function (e, i) { return { e: e, i: i }; }).sort(function (a, b) { return (a.e.t_min - b.e.t_min) || (a.i - b.i); });
    var usado = {}, out = [];
    l.forEach(function (x, k) {
      if (usado[k]) return;
      var e = x.e, fin = finDe(e), p = copia(e.params || {});
      delete p.hasta_min; delete p.duracion_min;
      if (e.tipo === "fallo" && fin == null) {
        for (var j = k + 1; j < l.length; j++) {
          var r = l[j].e;
          if (!usado[j] && r.tipo === "reparacion" && r.id === e.id && r.t_min >= e.t_min) { fin = r.t_min; usado[j] = true; break; }
        }
      }
      if (e.tipo === "reparacion") fin = e.t_min;
      out.push({ uid: e.uid || nuevoUid(), tipo: e.tipo, id: e.id || "", t: e.t_min, fin: fin, params: p });
    });
    return out;
  }
  function aEventos(bl) {
    var out = [];
    bl.forEach(function (b) {
      var p = copia(b.params || {});
      if (b.tipo === "fallo") {
        out.push(limpiar({ uid: b.uid, t_min: b.t, tipo: "fallo", id: b.id, params: p }));
        if (b.fin != null && b.fin < 1440) out.push({ uid: b.uid + "r", t_min: b.fin, tipo: "reparacion", id: b.id });
      } else if (b.tipo === "reparacion") {
        out.push({ uid: b.uid, t_min: b.t, tipo: "reparacion", id: b.id });
      } else {
        if (b.fin != null && b.fin < 1440) p.hasta_min = b.fin;
        out.push(limpiar({ uid: b.uid, t_min: b.t, tipo: b.tipo, id: b.id, params: p }));
      }
    });
    return out.sort(function (a, b) { return a.t_min - b.t_min; });
  }
  function limpiar(e) { if (!e.id) delete e.id; if (!e.params || !Object.keys(e.params).length) delete e.params; return e; }
  function sinUid(e) { var o = { t_min: e.t_min, tipo: e.tipo }; if (e.id) o.id = e.id; if (e.params && Object.keys(e.params).length) o.params = copia(e.params); return o; }
  function esClaveDis(k) { return ZONAS.some(function (z) { return z.id === k; }) || /^clase:/.test(k); }
  function desdeCaso() {
    var c = NOC.caso || {}, mu = c.modelo_usuario && typeof c.modelo_usuario === "object" ? copia(c.modelo_usuario) : null, F = {};
    Object.keys((mu && mu.factores) || {}).forEach(function (k) { if (esClaveDis(k)) F[k] = mu.factores[k]; });
    D = { trafico: c.trafico || "BH", dia: c.dia || "laborable", anio: Number(c.anio) || ANIO_MAX, hora: esNum(c.hora) ? c.hora : 21,
      evento: c.evento || "ninguno", fallosBase: (c.fallos || []).slice(), bloques: aBloques(c.eventos || []), factores: F, muBase: mu };
  }
  function muDe(conFactores) {
    var mu = copia(D.muBase) || {};
    var F = {};
    Object.keys(mu.factores || {}).forEach(function (k) { if (!esClaveDis(k)) F[k] = mu.factores[k]; });
    if (conFactores) Object.keys(D.factores).forEach(function (k) {
      if (esNum(D.factores[k]) && Math.abs(D.factores[k] - 1) > 1e-9) {
        F[k] = D.factores[k];
        mu.proc = mu.proc || {}; mu.proc[k] = { t: "usuario", f: "diseñador de escenarios" };
      }
    });
    if (Object.keys(F).length) mu.factores = F; else delete mu.factores;
    if (mu.proc) Object.keys(mu.proc).forEach(function (k) { if (esClaveDis(k) && !(mu.factores && k in mu.factores)) delete mu.proc[k]; });
    var vacio = !["perfiles", "factores", "crecimiento", "prioridades"].some(function (k) { return mu[k] && Object.keys(mu[k]).length; }) &&
      !(mu.ruido && mu.ruido.sigma > 0) && !(mu.movilidad && mu.movilidad.activa) && !esNum(mu.anio) && !(mu.eventos_demanda && mu.eventos_demanda.length);
    if (vacio) return null;
    if (!mu.id) mu.id = "disenador";
    if (!mu.nombre) mu.nombre = t({ es: "Escenario diseñado", en: "Designed scenario" });
    if (conFactores && Object.keys(D.factores).length) {
      var f = "diseñador de escenarios";
      if (!mu.fuente) mu.fuente = f; else if (String(mu.fuente).split(" + ").indexOf(f) < 0) mu.fuente += " + " + f;
    }
    return mu;
  }

  // Volcado al caso (con retardo: arrastrar no recalcula en cada píxel)
  var tV = 0;
  function programar() { clearTimeout(tV); tV = setTimeout(volcar, 450); }
  function volcar() {
    clearTimeout(tV); tV = 0;
    if (!D || NOC.modo !== "lab") return;
    var c = NOC.caso;
    // 1) eventos
    var evs = aEventos(D.bloques);
    var a = JSON.stringify(evs.map(sinUid)), b = JSON.stringify((c.eventos || []).slice().sort(function (x, y) { return x.t_min - y.t_min; }).map(sinUid));
    if (a !== b) {
      if (NOC.operador && NOC.operador.reemplazar) NOC.operador.reemplazar(evs);
      else { c.eventos = evs; guardarLS("noc.caso", JSON.stringify(c)); if (NOC.reloj && NOC.reloj.refrescar) NOC.reloj.refrescar(); }
    }
    // 2) día / año / hora / tráfico / evento base / fallos permanentes
    var cambia = c.trafico !== D.trafico || c.dia !== D.dia || Number(c.anio) !== D.anio || c.hora !== D.hora ||
      (c.evento || "ninguno") !== (D.evento || "ninguno") || JSON.stringify(c.fallos || []) !== JSON.stringify(D.fallosBase);
    // 3) multiplicadores (modelo_usuario.factores)
    var mu = muDe(true), muJ = JSON.stringify(mu), cJ = JSON.stringify(c.modelo_usuario || null);
    if (muJ !== cJ) {
      if (cambia) c.modelo_usuario = mu; else if (NOC.aplicarModelo) NOC.aplicarModelo(mu); else c.modelo_usuario = mu;
      if (NOC.editorModelo && NOC.editorModelo.recargar) NOC.editorModelo.recargar();
    }
    if (cambia && NOC.aplicarCaso) NOC.aplicarCaso({ trafico: D.trafico, dia: D.dia, anio: D.anio, hora: D.hora, evento: D.evento, fallos: D.fallosBase.slice() });
  }

  // ---------------------------------------------------------------- validación en vivo
  function solapan(a, b) { var fa = a.fin == null ? 1440 : a.fin, fb = b.fin == null ? 1440 : b.fin; return a.t < fb && b.t < fa; }
  function validar() {
    var L = [];
    function add(b, niv, clave, txt) { L.push({ uid: b ? b.uid : null, nivel: niv, clave: clave, txt: txt, id: b ? b.id : "" }); }
    D.bloques.forEach(function (b) {
      var T = TB[b.tipo] || {};
      if (!TB[b.tipo]) { add(b, "crit", "tipo", { es: "Tipo desconocido", en: "Unknown type" }); return; }
      if (b.t < 0 || b.t >= 1440 || (b.fin != null && (b.fin > 1440 || (!T.instante && b.fin <= b.t)))) add(b, "crit", "rango", { es: "Fuera de 0–24 h", en: "Outside 0–24 h" });
      if (necesitaId(b.tipo) && !b.id) add(b, "crit", "falta", { es: "Falta elemento", en: "Element missing" });
      else if (b.id && !existe(b.tipo, b.id)) add(b, "crit", "noexiste", { es: "No existe", en: "Does not exist" });
      if (!soporta(b.tipo)) add(b, "min", "motor", { es: "El motor no lo aplica", en: "Engine ignores it" });
      if (b.id && D.fallosBase.indexOf(b.id) >= 0 && T.carril !== "dem") add(b, "min", "base", { es: "Caído todo el día", en: "Down all day" });
    });
    for (var i = 0; i < D.bloques.length; i++) for (var j = i + 1; j < D.bloques.length; j++) {
      var a = D.bloques[i], b = D.bloques[j];
      if (!a.id || a.id !== b.id || !solapan(a, b)) continue;
      var ca = (TB[a.tipo] || {}).carril, cb = (TB[b.tipo] || {}).carril;
      if (a.tipo === b.tipo || (ca === "red" && cb === "red")) { add(a, "min", "solape", { es: "Solape", en: "Overlap" }); add(b, "min", "solape", { es: "Solape", en: "Overlap" }); }
      else if ((ca === "op" && a.tipo !== "te_reencaminar" && b.tipo === "fallo") || (cb === "op" && b.tipo !== "te_reencaminar" && a.tipo === "fallo")) {
        var acc = ca === "op" ? a : b;
        add(acc, "min", "caido", { es: "Sobre elemento caído", en: "On a failed element" });
      }
    }
    return L;
  }
  function problemasDe(uid, V) { return V.filter(function (x) { return x.uid === uid; }); }

  // ---------------------------------------------------------------- estado de la interfaz
  var UI = { abierto: false, paso: Number(leer("noc.disenador.paso")) || 1, sel: null, elegir: null, partida: null, res: null, resGen: 0, curva: {}, url: "" };
  if (UI.paso < 1 || UI.paso > 5) UI.paso = 1;
  var PASOS = [
    { n: 1, ico: "partida", t: { es: "Partida", en: "Start" } },
    { n: 2, ico: "cuando", t: { es: "Cuándo", en: "When" } },
    { n: 3, ico: "quepasa", t: { es: "Qué pasa", en: "What happens" } },
    { n: 4, ico: "operador", t: { es: "Operador", en: "Operator" } },
    { n: 5, ico: "resultado", t: { es: "Resultado", en: "Result" } }
  ];
  var raiz = null, fondo = null, tira = null;

  function montar() {
    if (raiz) return;
    fondo = document.createElement("div");
    fondo.className = "ds-fondo"; fondo.hidden = true;
    raiz = document.createElement("section");
    raiz.className = "ds"; raiz.id = "disenador"; raiz.hidden = true;
    raiz.setAttribute("role", "dialog"); raiz.setAttribute("aria-modal", "true");
    tira = document.createElement("div");
    tira.className = "ds-tira"; tira.hidden = true; tira.setAttribute("role", "status");
    document.body.appendChild(fondo); document.body.appendChild(raiz); document.body.appendChild(tira);
    raiz.addEventListener("click", alClic);
    raiz.addEventListener("input", alInput);
    raiz.addEventListener("change", alCambio);
    raiz.addEventListener("keydown", alTecla);
    raiz.addEventListener("pointerdown", alPuntero);
    raiz.addEventListener("pointermove", alHover);
    raiz.addEventListener("pointerleave", function () { var tp = $(".ds-tip", raiz); if (tp) tp.hidden = true; });
    tira.addEventListener("click", function (ev) { if (ev.target.closest("[data-ds=cancelar-elegir]")) terminarElegir(null); });
    fondo.addEventListener("click", function () { cerrar(); });
    window.addEventListener("resize", function () { if (UI.abierto) pintarCuerpo(); });
  }

  function abrir(paso) {
    montar();
    if (UI.elegir) terminarElegir(null);
    desdeCaso();
    if (esNum(paso)) UI.paso = clamp(paso, 1, 5);
    else if (NOC.modo === "ref") UI.paso = 1;
    UI.abierto = true; UI.sel = null; UI.res = null; UI.url = "";
    raiz.hidden = false; fondo.hidden = false;
    document.body.classList.add("ds-abierto");
    if (typeof NOC.cerrarCaso === "function") { try { NOC.cerrarCaso(); } catch (e) { /* nada */ } }
    pintar();
    setTimeout(function () { var b = $('.ds-pasos [aria-selected="true"]', raiz); if (b) b.focus(); }, 0);
  }
  function cerrar() {
    if (!raiz) return;
    volcar();
    if (UI.elegir) terminarElegir(null);
    UI.abierto = false; raiz.hidden = true; fondo.hidden = true;
    document.body.classList.remove("ds-abierto");
  }
  function irPaso(n) {
    UI.paso = clamp(n, 1, 5); guardarLS("noc.disenador.paso", String(UI.paso));
    if (UI.paso === 5) volcar();
    pintar();
    var b = $('.ds-pasos [data-paso="' + UI.paso + '"]', raiz); if (b) b.focus();
  }

  // ---------------------------------------------------------------- pintado
  function pintar() {
    if (!raiz || !UI.abierto) return;
    var ref = NOC.modo === "ref", V = validar(), nCrit = V.filter(function (x) { return x.nivel === "crit"; }).length;
    raiz.setAttribute("aria-label", t({ es: "Diseñar escenario", en: "Design scenario" }));
    var pasos = PASOS.map(function (p) {
      var cur = p.n === UI.paso, mark = "";
      if (p.n === 3 || p.n === 4) {
        var nb = D.bloques.filter(function (b) { var c = (TB[b.tipo] || {}).carril; return p.n === 3 ? c !== "op" : c === "op"; });
        var vp = V.filter(function (x) { return nb.some(function (b) { return b.uid === x.uid; }); });
        mark = (nb.length ? '<span class="ds-n">' + nb.length + '</span>' : '') +
          (vp.length ? '<span class="ds-pm sev-' + (vp.some(function (x) { return x.nivel === "crit"; }) ? "crit" : "min") + '">' + ico(vp.some(function (x) { return x.nivel === "crit"; }) ? "error" : "aviso", 14) + '</span>' : '');
      }
      return '<button type="button" role="tab" class="ds-paso' + (cur ? " cur" : "") + (p.n < UI.paso ? " hecho" : "") + '" data-paso="' + p.n + '" aria-selected="' + cur + '" aria-controls="ds-cuerpo" tabindex="' + (cur ? 0 : -1) + '">' +
        '<span class="ds-pn">' + p.n + '</span>' + ico(p.ico, 18) + '<span class="ds-pt">' + esc(t(p.t)) + '</span>' + mark + '</button>';
    }).join('<i class="ds-sep" aria-hidden="true"></i>');
    raiz.innerHTML =
      '<header class="ds-cab">' + ico("quepasa", 18) + '<h2>' + esc(t({ es: "Diseñar escenario", en: "Design scenario" })) + '</h2>' +
        '<b class="ds-modo ' + (ref ? "ref" : "lab") + '">' + (ref ? ico("ref", 12) + "REF" : "LAB") + '</b>' +
        '<span class="ds-resumen">' + resumenHTML() + '</span>' +
        '<button type="button" class="ds-x" data-ds="cerrar" aria-label="' + esc(t({ es: "Cerrar", en: "Close" })) + '" title="Esc">' + ico("cerrar", 16) + '</button></header>' +
      (ref ? '<div class="ds-ref" role="note">' + ico("ref", 18) + '<span>' + esc(t({ es: "Referencia v7: solo lectura", en: "v7 reference: read-only" })) + '</span>' +
        '<button type="button" class="btn prim ds-grande" data-ds="lab">' + esc(t({ es: "Pasar a LAB", en: "Switch to LAB" })) + '</button></div>' : '') +
      '<nav class="ds-pasos" role="tablist" aria-label="' + esc(t({ es: "Pasos", en: "Steps" })) + '">' + pasos + '</nav>' +
      '<div class="ds-cuerpo' + (ref && UI.paso > 1 ? " inerte" : "") + '" id="ds-cuerpo" role="tabpanel"></div>' +
      '<footer class="ds-pie">' +
        '<button type="button" class="btn ds-grande" data-ds="ant"' + (UI.paso === 1 ? " disabled" : "") + '>' + ico("izq", 14) + esc(t({ es: "Atrás", en: "Back" })) + '</button>' +
        '<div class="ds-val" aria-live="polite">' + valHTML(V) + '</div>' +
        (UI.paso < 5 ? '<button type="button" class="btn prim ds-grande" data-ds="sig">' + esc(t({ es: "Siguiente", en: "Next" })) + ico("der", 14) + '</button>'
          : '<button type="button" class="btn prim ds-grande" data-ds="pelicula"' + (ref || nCrit ? " disabled" : "") + '>' + ico("pelicula", 14) + esc(t({ es: "Ver película", en: "Play run" })) + '</button>') +
      '</footer><div class="ds-tip" hidden></div>';
    pintarCuerpo();
  }
  function resumenHTML() {
    var tr = trafico(D.trafico), h = [];
    h.push('<span>' + ico(D.dia in LOC ? D.dia : "calendario", 14) + esc(nomDia(D.dia)) + ' ' + D.anio + '</span>');
    h.push('<span class="mono">' + (cargado(D.trafico) ? "HC" : pad(D.hora) + ":00") + '</span>');
    var nr = D.bloques.filter(function (b) { return (TB[b.tipo] || {}).carril !== "op"; }).length, no = D.bloques.length - nr;
    h.push('<span>' + ico("quepasa", 14) + nr + '</span><span>' + ico("operador", 14) + no + '</span>');
    var nf = Object.keys(D.factores).filter(function (k) { return Math.abs(D.factores[k] - 1) > 1e-9; }).length;
    if (nf) h.push('<span>× ' + nf + '</span>');
    return h.join("") + (tr ? '<span class="solo-experto tx3">' + esc(tr.id) + '</span>' : '');
  }
  function valHTML(V) {
    if (!V.length) return '<span class="ds-ok">' + ico("ok", 16) + esc(t({ es: "Sin conflictos", en: "No conflicts" })) + '</span>';
    var por = {};
    V.forEach(function (x) { var k = x.nivel + "|" + x.clave; (por[k] = por[k] || { x: x, n: 0, uid: x.uid }).n++; });
    return Object.keys(por).map(function (k) {
      var o = por[k], cls = o.x.nivel === "crit" ? "crit" : "min";
      return '<button type="button" class="ds-vchip sev-' + cls + '" data-ds="ir-bloque" data-uid="' + esc(o.uid || "") + '" title="' + esc(t(o.x.txt) + (o.x.id ? " · " + corto(o.x.id) : "")) + '">' +
        ico(cls === "crit" ? "error" : "aviso", 14) + '<span>' + esc(t(o.x.txt)) + '</span>' + (o.n > 1 ? '<b>' + o.n + '</b>' : '') + '</button>';
    }).join("");
  }
  function pintarCuerpo() {
    var el = $("#ds-cuerpo", raiz);
    if (!el) return;
    var f = [null, pasoPartida, pasoCuando, pasoQuePasa, pasoOperador, pasoResultado][UI.paso];
    el.innerHTML = f();
    if (UI.paso === 2) dibujarCurva($(".ds-curva", el), true);
    if (UI.paso === 3 || UI.paso === 4) { dibujarCurva($(".ds-tl-fondo", el), false); }
    if (UI.paso === 5) calcularResultado();
  }

  // ---------------------------------------------------------------- paso 1: partida
  function partidas() {
    var l = [];
    var c = NOC.caso || {};
    l.push({ k: "actual", ico: "actual", n: { es: "Seguir con el caso actual", en: "Keep current case" }, evs: c.eventos || [], sub: (c.eventos || []).length + " " + t({ es: "eventos", en: "events" }) });
    l.push({ k: "ref", ico: "ref", n: { es: "Referencia v7", en: "v7 reference" }, evs: [], sub: t({ es: "hora cargada · partido · 2031", en: "busy hour · match · 2031" }) });
    var pl = [];
    try { pl = NOC.operador && NOC.operador.plantillas ? NOC.operador.plantillas() : (Motor.plantillasEventos ? Motor.plantillasEventos(RED) : []); } catch (e) { pl = []; }
    pl.forEach(function (p, i) {
      var n = p.nombre || (p.es ? { es: p.es, en: p.en || p.es } : p.id);
      l.push({ k: "pl:" + i, ico: "plantilla", n: typeof n === "string" ? { es: n, en: n } : n, evs: p.eventos || [], desc: p.desc || p.descripcion || null, pl: p });
    });
    var es = [];
    try { es = NOC.estudios && NOC.estudios.lista ? NOC.estudios.lista() : []; } catch (e) { es = []; }
    es.slice(0, 6).forEach(function (s, i) {
      l.push({ k: "es:" + i, ico: "estudio", n: { es: s.nombre || "—", en: s.nombre || "—" }, evs: (s.caso && s.caso.eventos) || [], sub: (s.fecha || "").replace("T", " ").slice(0, 16), est: s });
    });
    l.push({ k: "vacio", ico: "vacio", n: { es: "Vacío", en: "Blank" }, evs: [], sub: t({ es: "día laborable, hora a hora", en: "weekday, hour by hour" }) });
    return l;
  }
  function tiraEventos(evs) {
    var bl = aBloques(evs || []);
    if (!bl.length) return '<div class="ds-mini vacia" aria-hidden="true"></div>';
    return '<div class="ds-mini" aria-hidden="true">' + bl.map(function (b) {
      var T = TB[b.tipo] || {}, f = b.fin == null ? 1440 : b.fin, w = Math.max(0.8, (f - b.t) / 14.4);
      return '<i style="left:' + (b.t / 14.4).toFixed(2) + '%;width:' + w.toFixed(2) + '%;background:' + (T.color || "var(--tx3)") + '"></i>';
    }).join("") + '<span class="ds-mini-h">0</span><span class="ds-mini-h m">12</span><span class="ds-mini-h f">24</span></div>';
  }
  function pasoPartida() {
    var l = partidas();
    function grupo(tit, filtro) {
      var xs = l.filter(filtro);
      if (!xs.length) return "";
      return '<h3 class="ds-h3">' + esc(t(tit)) + '</h3><div class="ds-tarjetas">' + xs.map(function (x) {
        var cur = UI.partida === x.k;
        return '<button type="button" class="ds-tj' + (cur ? " cur" : "") + '" data-ds="partida" data-k="' + esc(x.k) + '" aria-pressed="' + cur + '"' + (x.desc ? ' title="' + esc(typeof x.desc === "string" ? x.desc : t(x.desc)) + '"' : '') + '>' +
          '<span class="ds-tj-ico">' + ico(x.ico, 26) + '</span><span class="ds-tj-n">' + esc(t(x.n)) + '</span>' +
          (x.sub ? '<span class="ds-tj-s">' + esc(x.sub) + '</span>' : '') + tiraEventos(x.evs) + '</button>';
      }).join("") + '</div>';
    }
    return '<div class="ds-p1">' +
      grupo({ es: "Base", en: "Base" }, function (x) { return x.k === "actual" || x.k === "ref" || x.k === "vacio"; }) +
      grupo({ es: "Plantillas", en: "Templates" }, function (x) { return /^pl:/.test(x.k); }) +
      grupo({ es: "Estudios guardados", en: "Saved studies" }, function (x) { return /^es:/.test(x.k); }) + '</div>';
  }
  function elegirPartida(k) {
    var x = partidas().filter(function (p) { return p.k === k; })[0];
    if (!x) return;
    if (k !== "actual" && NOC.modo === "ref") { NOC.setModo && NOC.setModo("lab"); }
    if (k === "actual") { desdeCaso(); }
    else if (k === "ref") {
      D.trafico = "BH"; D.dia = "laborable"; D.anio = 2031; D.evento = "E-EVENTO"; D.fallosBase = []; D.bloques = []; D.factores = {};
    } else if (k === "vacio") {
      D.trafico = trafico("NC") ? "NC" : D.trafico; D.dia = "laborable"; D.anio = ANIO_MAX; D.evento = "ninguno"; D.fallosBase = []; D.bloques = []; D.factores = {};
    } else if (x.pl) {
      if (cargado(D.trafico) && trafico("NC")) D.trafico = "NC";
      D.evento = "ninguno"; D.fallosBase = [];
      D.bloques = aBloques(copia(x.pl.eventos));
      var t0 = Math.min.apply(null, D.bloques.map(function (b) { return b.t; }));
      if (isFinite(t0)) D.hora = Math.floor(t0 / 60);
    } else if (x.est) {
      var c = x.est.caso || {};
      D.trafico = c.trafico || D.trafico; D.dia = c.dia || D.dia; D.anio = Number(c.anio) || D.anio; D.hora = esNum(c.hora) ? c.hora : D.hora;
      D.evento = c.evento || "ninguno"; D.fallosBase = (c.fallos || []).slice(); D.bloques = aBloques(copia(c.eventos || []));
      D.muBase = copia(c.modelo_usuario) || null; D.factores = {};
      Object.keys((D.muBase && D.muBase.factores) || {}).forEach(function (kk) { if (esClaveDis(kk)) D.factores[kk] = D.muBase.factores[kk]; });
    }
    UI.partida = k; UI.sel = null;
    volcar();
    pintar();
  }

  // ---------------------------------------------------------------- paso 2: cuándo
  function pasoCuando() {
    var ver = TRAFICOS.filter(function (x) { return x.id === "BH" || x.id === "NC" || x.id === D.trafico; });
    var exp = TRAFICOS.filter(function (x) { return ver.indexOf(x) < 0; });
    function trBtn(x, extra) {
      var cur = x.id === D.trafico, hc = x.usa_hora === false;
      return '<button type="button" class="ds-opc' + (cur ? " cur" : "") + (extra || "") + '" data-ds="trafico" data-v="' + esc(x.id) + '" aria-pressed="' + cur + '" title="' + esc(NOC.lang === "en" ? x.en : x.es) + '">' +
        ico(hc ? "hc" : "hora", 22) + '<span>' + esc(hc && x.id === "BH" ? t({ es: "Hora cargada v7", en: "v7 busy hour" }) : !hc && x.id === "NC" ? t({ es: "Hora a hora", en: "Hour by hour" }) : (NOC.lang === "en" ? x.en : x.es)) + '</span></button>';
    }
    var hc = cargado(D.trafico);
    return '<div class="ds-p2">' +
      '<div class="ds-fila"><span class="ds-rot">' + ico("hora", 16) + esc(t({ es: "Tráfico", en: "Traffic" })) + info({ es: "Hora cargada: la foto de dimensionado de la v7 (todas las demandas a la vez). Hora a hora: cada demanda sigue su perfil de 24 h (supuesto).", en: "Busy hour: the v7 dimensioning snapshot (all demands at once). Hour by hour: each demand follows its 24 h profile (assumption)." }) + '</span>' +
        '<div class="ds-opcs">' + ver.map(function (x) { return trBtn(x); }).join("") + exp.map(function (x) { return trBtn(x, " solo-experto"); }).join("") + '</div></div>' +
      '<div class="ds-fila"><span class="ds-rot">' + ico("calendario", 16) + esc(t({ es: "Día", en: "Day" })) + '</span><div class="ds-opcs">' +
        DIAS.map(function (k) { var cur = k === D.dia; return '<button type="button" class="ds-opc' + (cur ? " cur" : "") + '" data-ds="dia" data-v="' + esc(k) + '" aria-pressed="' + cur + '">' + ico(LOC[k] ? k : "calendario", 22) + '<span>' + esc(nomDia(k)) + '</span></button>'; }).join("") + '</div></div>' +
      '<div class="ds-dos">' +
        '<div class="ds-fila"><span class="ds-rot">' + esc(t({ es: "Año", en: "Year" })) + '</span><div class="ds-paso-num">' +
          '<button type="button" class="ds-btn-c" data-ds="anio" data-d="-1" aria-label="' + esc(t({ es: "Año anterior", en: "Previous year" })) + '"' + (D.anio <= ANIO_MIN ? " disabled" : "") + '>' + ico("menos", 18) + '</button>' +
          '<output class="ds-grande-num mono" aria-live="polite">' + D.anio + '</output>' +
          '<button type="button" class="ds-btn-c" data-ds="anio" data-d="1" aria-label="' + esc(t({ es: "Año siguiente", en: "Next year" })) + '"' + (D.anio >= ANIO_MAX ? " disabled" : "") + '>' + ico("mas", 18) + '</button></div>' +
          '<input type="range" class="ds-rango" data-ds-in="anio" min="' + ANIO_MIN + '" max="' + ANIO_MAX + '" step="1" value="' + D.anio + '" aria-label="' + esc(t({ es: "Año", en: "Year" })) + '"></div>' +
        '<div class="ds-fila"><span class="ds-rot">' + esc(t({ es: "Hora", en: "Hour" })) + (hc ? ' <span class="ds-chip">' + esc(t({ es: "hora cargada: sin hora", en: "busy hour: no hour" })) + '</span>' : '') + '</span><div class="ds-paso-num">' +
          '<button type="button" class="ds-btn-c" data-ds="hora" data-d="-1" aria-label="' + esc(t({ es: "Hora anterior", en: "Previous hour" })) + '"' + (hc ? " disabled" : "") + '>' + ico("menos", 18) + '</button>' +
          '<output class="ds-grande-num mono' + (hc ? " apagado" : "") + '">' + (hc ? "HC" : pad(D.hora) + ":00") + '</output>' +
          '<button type="button" class="ds-btn-c" data-ds="hora" data-d="1" aria-label="' + esc(t({ es: "Hora siguiente", en: "Next hour" })) + '"' + (hc ? " disabled" : "") + '>' + ico("mas", 18) + '</button></div>' +
          '<input type="range" class="ds-rango" data-ds-in="hora" min="0" max="23" step="1" value="' + D.hora + '"' + (hc ? " disabled" : "") + ' aria-label="' + esc(t({ es: "Hora", en: "Hour" })) + '"></div>' +
      '</div>' +
      '<figure class="ds-fig"><figcaption>' + esc(t({ es: "Demanda total en 24 h · Gbit/s", en: "Total demand over 24 h · Gbit/s" })) + info({ es: "Motor.serie del día, año y multiplicadores elegidos, sin fallos ni eventos. Clic en la curva = elegir la hora.", en: "Motor.serie for the chosen day, year and multipliers, without failures or events. Click the curve = pick the hour." }) + '</figcaption>' +
        '<div class="ds-curva" data-ds-curva="hora" role="img"></div></figure></div>';
  }

  // Curva de 24 h (Motor.serieAsync, paso 60 min, sin eventos), en caché por caso
  function opCurva() {
    var tr = { id: D.trafico, anio: D.anio, dia: D.dia };
    var o = { caso: { trafico: tr, evento: D.evento || "ninguno", fallo: [] } };
    var mu = muDe(true); if (mu) o.modelo_usuario = mu;
    return o;
  }
  function pedirCurva(cb) {
    var op = opCurva(), k = JSON.stringify(op);
    var c = UI.curva[k];
    if (c && c.datos) { cb(c.datos); return; }
    if (c) { c.cbs.push(cb); return; }
    c = UI.curva[k] = { cbs: [cb], datos: null };
    function fin(s) {
      var d = (s && s.pasos || []).map(function (p) { return { t: p.t_min, v: p.resumen ? p.resumen.dl_total_gbps : 0 }; });
      c.datos = d; c.cbs.forEach(function (f) { try { f(d); } catch (e) { console.error(e); } }); c.cbs = [];
    }
    function mal(e) { console.warn("diseñador: curva", e); fin(null); }
    var opts = { paso_min: 60, desde: 0, hasta: 24, eventos: [], acceso: false };
    try {
      if (Motor.serieAsync) Motor.serieAsync(RED, op, opts).then(fin, mal);
      else setTimeout(function () { try { fin(Motor.serie(RED, op, opts)); } catch (e) { mal(e); } }, 10);
    } catch (e) { mal(e); }
  }
  function dibujarCurva(el, conHora) {
    if (!el) return;
    el.innerHTML = '<span class="ds-cargando">' + esc(t({ es: "calculando…", en: "computing…" })) + '</span>';
    pedirCurva(function (d) {
      if (!el.isConnected) return;
      var W = Math.max(200, el.clientWidth || 600), H = Math.max(40, el.clientHeight || 140);
      if (!d || !d.length) { el.innerHTML = '<span class="ds-cargando">—</span>'; return; }
      var max = Math.max.apply(null, d.map(function (x) { return x.v; })) || 1, ymax = max * 1.12;
      var ML = conHora ? 44 : 0, MR = conHora ? 8 : 0, MT = conHora ? 10 : 2, MB = conHora ? 22 : 0;
      function X(tm) { return ML + tm / 1440 * (W - ML - MR); }
      function Y(v) { return MT + (1 - v / ymax) * (H - MT - MB); }
      var pts = d.map(function (x) { return [X(x.t + 30), Y(x.v)]; });
      pts.unshift([X(0), Y(d[0].v)]); pts.push([X(1440), Y(d[d.length - 1].v)]);
      var linea = "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L");
      var area = linea + "L" + X(1440).toFixed(1) + "," + (H - MB) + "L" + X(0).toFixed(1) + "," + (H - MB) + "Z";
      var s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">';
      if (conHora) {
        [0, 0.5, 1].forEach(function (f) {
          var v = max * f, y = Y(v);
          s += '<line class="ds-grid" x1="' + ML + '" x2="' + (W - MR) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>' +
            '<text class="ds-ax" x="' + (ML - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + fmt(v, 0) + '</text>';
        });
        for (var hh = 0; hh <= 24; hh += 3) s += '<text class="ds-ax" x="' + X(hh * 60).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + pad(hh) + '</text>';
      }
      s += '<path class="ds-area" d="' + area + '"/><path class="ds-linea" d="' + linea + '"/>';
      if (conHora && !cargado(D.trafico)) {
        var xh0 = X(D.hora * 60), xh1 = X(D.hora * 60 + 60);
        s += '<rect class="ds-hora-b" x="' + xh0.toFixed(1) + '" y="' + MT + '" width="' + (xh1 - xh0).toFixed(1) + '" height="' + (H - MT - MB) + '"/>';
        var dv = d.filter(function (x) { return x.t === D.hora * 60; })[0];
        if (dv) s += '<circle class="ds-punto" cx="' + ((xh0 + xh1) / 2).toFixed(1) + '" cy="' + Y(dv.v).toFixed(1) + '" r="4"/>' +
          '<text class="ds-etq" x="' + ((xh0 + xh1) / 2).toFixed(1) + '" y="' + Math.max(12, Y(dv.v) - 9).toFixed(1) + '" text-anchor="middle">' + fmt(dv.v, 0) + '</text>';
      }
      s += '</svg>';
      el.innerHTML = s;
      el._curva = { d: d, X: X, ML: ML, MR: MR, W: W, unidad: "Gbit/s" };
      if (conHora) el.setAttribute("aria-label", t({ es: "Demanda total por hora; máximo ", en: "Total demand per hour; peak " }) + fmt(max, 0) + " Gbit/s");
    });
  }

  // ---------------------------------------------------------------- pasos 3 y 4: línea de tiempo
  function filas(bl) {   // reparto en sub-filas para que no se tapen
    var rows = [];
    bl.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (b) {
      var f = b.fin == null ? 1440 : Math.max(b.fin, b.t + 20);
      for (var r = 0; r < rows.length; r++) if (rows[r] <= b.t) { rows[r] = f; b._r = r; return; }
      rows.push(f); b._r = rows.length - 1;
    });
    return Math.max(1, rows.length);
  }
  function lineaHTML(pasoN) {
    var V = validar();
    var eje = '<div class="ds-tl-eje" aria-hidden="true">';
    for (var hh = 0; hh <= 24; hh++) eje += '<i class="' + (hh % 3 === 0 ? "may" : "") + '" style="left:' + (hh / 24 * 100).toFixed(3) + '%"></i>' + (hh % 3 === 0 && hh < 24 ? '<span style="left:' + (hh / 24 * 100).toFixed(3) + '%">' + pad(hh) + '</span>' : '');
    eje += '</div>';
    var h = '<div class="ds-tl" data-paso-tl="' + pasoN + '">' +
      '<div class="ds-tl-cab"><span></span>' + eje + '</div>';
    CARRILES.forEach(function (c) {
      var activo = c.paso === pasoN;
      var bl = D.bloques.filter(function (b) { return (TB[b.tipo] || {}).carril === c.id; });
      var base = "";
      if (c.id === "red") base = D.fallosBase.map(function (id) {
        return '<div class="ds-fijo" style="--c:var(--crit)">' + ico("fallo", 14) + '<span>' + esc(corto(id)) + ' · ' + esc(t({ es: "todo el día", en: "all day" })) + '</span>' +
          (activo ? '<button type="button" class="ds-fijo-x" data-ds="quitar-base" data-id="' + esc(id) + '" aria-label="' + esc(t({ es: "Quitar fallo permanente ", en: "Remove permanent failure " }) + corto(id)) + '">' + ico("cerrar", 12) + '</button>' : '') + '</div>';
      }).join("");
      if (c.id === "dem" && D.evento && D.evento !== "ninguno") base = '<div class="ds-fijo" style="--c:var(--sv-evento)">' + ico("demanda", 14) + '<span>' + esc(corto(D.evento)) + ' · ' + esc(t({ es: "todo el día", en: "all day" })) + '</span>' +
        (activo ? '<button type="button" class="ds-fijo-x" data-ds="quitar-evento" aria-label="' + esc(t({ es: "Quitar evento de todo el día", en: "Remove all-day event" })) + '">' + ico("cerrar", 12) + '</button>' : '') + '</div>';
      var nf = filas(bl);
      h += '<div class="ds-carril' + (activo ? " activo" : " atenuado") + '" data-carril="' + c.id + '">' +
        '<div class="ds-carril-n">' + ico(c.ico, 16) + '<span>' + esc(t(c.n)) + '</span></div>' +
        '<div class="ds-pista" data-pista="' + c.id + '" style="--filas:' + nf + '">' + (base ? '<div class="ds-fijos">' + base + '</div>' : '') +
        '<div class="ds-bloques' + (base ? " con-fijos" : "") + '">' + bl.map(function (b) { return bloqueHTML(b, activo, problemasDe(b.uid, V)); }).join("") + '</div>' +
        (activo && !bl.length && !base ? '<span class="ds-vacio">' + esc(t(c.id === "op" ? { es: "Añade una acción con los botones de arriba", en: "Add an action with the buttons above" } : { es: "Añade un bloque con los botones de arriba", en: "Add a block with the buttons above" })) + '</span>' : '') +
        '</div></div>';
    });
    var hc = cargado(D.trafico) ? null : D.hora * 60;
    h += '<div class="ds-tl-fondo" aria-hidden="true"></div>' + (hc != null ? '<div class="ds-tl-hora" aria-hidden="true" style="--x:' + (hc / 1440).toFixed(4) + '"></div>' : '') + '</div>';
    return h;
  }
  function bloqueHTML(b, activo, prob) {
    var T = TB[b.tipo] || {}, f = b.fin == null ? 1440 : b.fin, ins = !!T.instante;
    var izq = b.t / 14.4, ancho = ins ? 0 : Math.max(0.5, (f - b.t) / 14.4);
    var sev = prob.some(function (x) { return x.nivel === "crit"; }) ? "crit" : prob.length ? "min" : "";
    var rango = hhmm(b.t) + (ins ? "" : "–" + (b.fin == null ? "24:00" : hhmm(f)));
    var nom = b.id ? corto(b.id) : (b.tipo === "activar_ntn" ? t({ es: "todos", en: "all" }) : "?");
    var pv = T.p && b.params && esNum(b.params[T.p.k]) ? b.params[T.p.k] : T.p ? T.p.def : null;
    var pTxt = T.p ? (T.p.pct ? fmt(pv * 100, 0) + " %" : (T.p.k === "n" ? "+" + pv : "P" + pv)) : "";
    var lbl = t(T.n || { es: b.tipo }) + " · " + nom + " · " + rango + (pTxt ? " · " + pTxt : "") + (prob.length ? " · " + prob.map(function (x) { return t(x.txt); }).join(", ") : "");
    var estrecho = !ins && (f - b.t) < 170, fuera = estrecho ? (b.t > 900 ? " et-izq" : " et-der") : "";
    return '<div class="ds-bl' + (ins ? " inst" : "") + (estrecho ? " estrecho" + fuera : "") + (b.fin == null && !ins ? " abierto" : "") + (UI.sel === b.uid ? " sel" : "") + (sev ? " v-" + sev : "") + '"' +
      ' style="--c:' + (T.color || "var(--tx3)") + ';left:' + izq.toFixed(3) + '%;' + (ins ? "" : "width:" + ancho.toFixed(3) + "%;") + '--r:' + (b._r || 0) + '"' +
      ' data-uid="' + esc(b.uid) + '" role="button" tabindex="' + (activo ? 0 : -1) + '" aria-pressed="' + (UI.sel === b.uid) + '" aria-label="' + esc(lbl) + '" title="' + esc(lbl) + '">' +
      (activo && !ins ? '<span class="ds-asa izq" data-asa="izq" aria-hidden="true"></span>' : '') +
      '<span class="ds-bl-ico">' + ico(T.ico || "nodo", 15) + '</span><span class="ds-bl-n">' + esc(nom) + '</span>' + (pTxt ? '<span class="ds-bl-p mono">' + esc(pTxt) + '</span>' : '') +
      (sev ? '<span class="ds-bl-v sev-' + sev + '">' + ico(sev === "crit" ? "error" : "aviso", 13) + '</span>' : '') +
      (activo && !ins ? '<span class="ds-asa der" data-asa="der" aria-hidden="true"></span>' : '') + '</div>';
  }
  function paletaHTML(tipos) {
    return '<div class="ds-paleta" role="toolbar" aria-label="' + esc(t({ es: "Añadir bloque", en: "Add block" })) + '">' + tipos.map(function (k) {
      var T = TB[k];
      return '<button type="button" class="ds-pal" data-ds="anadir" data-tipo="' + k + '" style="--c:' + T.color + '">' + '<span class="ds-pal-ico">' + ico(T.ico, 20) + '</span><span>' + esc(t(T.n)) + '</span>' + ico("mas", 14) + '</button>';
    }).join("") + '</div>';
  }
  function pasoQuePasa() {
    return '<div class="ds-p3">' + paletaHTML(PALETA3) + lineaHTML(3) + '<div class="ds-ins-zona">' + inspectorHTML(3) + '</div>' + factoresHTML() + '</div>';
  }
  function pasoOperador() {
    return '<div class="ds-p3">' + paletaHTML(PALETA4) + lineaHTML(4) + '<div class="ds-ins-zona">' + inspectorHTML(4) + '</div></div>';
  }
  function bloque(uid) { return D.bloques.filter(function (b) { return b.uid === uid; })[0] || null; }

  // Inspector del bloque seleccionado: elemento, inicio/fin, parámetro principal
  function inspectorHTML(pasoN) {
    var b = UI.sel ? bloque(UI.sel) : null;
    if (!b || ((TB[b.tipo] || {}).carril === "op") !== (pasoN === 4)) return '<div class="ds-ins vacio">' + ico("izq", 14) + '<span>' + esc(t({ es: "Elige un bloque para editarlo · flechas = mover · + / − = alargar · Supr = borrar", en: "Pick a block to edit it · arrows = move · + / − = lengthen · Del = delete" })) + '</span></div>';
    var T = TB[b.tipo], prob = problemasDe(b.uid, validar());
    var h = '<div class="ds-ins" style="--c:' + T.color + '"><div class="ds-ins-cab">' + ico(T.ico, 20) + '<b>' + esc(t(T.n)) + '</b>' +
      prob.map(function (x) { var c = x.nivel === "crit" ? "crit" : "min"; return '<span class="ds-vchip sev-' + c + '">' + ico(c === "crit" ? "error" : "aviso", 14) + esc(t(x.txt)) + '</span>'; }).join("") +
      '<span class="ds-esp"></span><button type="button" class="btn ds-grande" data-ds="borrar" data-uid="' + esc(b.uid) + '">' + ico("borrar", 14) + esc(t({ es: "Borrar", en: "Delete" })) + '</button></div>';
    h += '<div class="ds-ins-cuerpo"><div class="ds-ins-el">' + elementoHTML(b) + '</div><div class="ds-ins-t">' +
      '<label class="ds-campo"><span class="ds-rot">' + esc(t({ es: "Desde", en: "From" })) + '</span><input type="time" step="300" data-ds-in="t" value="' + hhmm(b.t) + '"></label>' +
      (T.instante ? '' : '<label class="ds-campo"><span class="ds-rot">' + esc(t({ es: "Hasta", en: "Until" })) + '</span><input type="time" step="300" data-ds-in="fin" value="' + (b.fin == null || b.fin >= 1440 ? "" : hhmm(b.fin)) + '" placeholder="24:00"></label>') +
      '</div>';
    if (T.p) {
      var v = b.params && esNum(b.params[T.p.k]) ? b.params[T.p.k] : T.p.def;
      h += '<label class="ds-campo ds-ins-p"><span class="ds-rot">' + esc(t(T.p.n)) + '</span><span class="ds-desl"><input type="range" class="ds-rango" data-ds-in="param" min="' + T.p.min + '" max="' + T.p.max + '" step="' + T.p.step + '" value="' + v + '">' +
        '<output class="mono">' + (T.p.pct ? fmt(v * 100, 0) + " %" : v) + '</output></span></label>';
    }
    h += '<details class="solo-experto ds-det"><summary>' + esc(t({ es: "Evento para el motor", en: "Engine event" })) + '</summary><code>' + esc(JSON.stringify(aEventos([b]).map(sinUid))) + '</code></details>';
    return h + '</div></div>';
  }
  function elementoHTML(b) {
    var T = TB[b.tipo];
    if (T.elem === "esc") return '<span class="ds-rot">' + esc(t({ es: "Evento", en: "Event" })) + '</span><div class="ds-chips">' + ESCENARIOS_DEM.map(function (x) {
      var cur = x.id === b.id; return '<button type="button" class="ds-chipb' + (cur ? " cur" : "") + '" data-ds="set-id" data-v="' + esc(x.id) + '" aria-pressed="' + cur + '" title="' + esc(NOC.lang === "en" ? x.en : x.es) + '">' + ico("demanda", 14) + esc(cortoEsc(x)) + '</button>';
    }).join("") + '</div>';
    if (T.elem === "clase") return '<span class="ds-rot">' + esc(t({ es: "Servicio", en: "Service" })) + '</span><div class="ds-chips">' + CLASES.map(function (c) {
      var k = "clase:" + c, cur = k === b.id; return '<button type="button" class="ds-chipb' + (cur ? " cur" : "") + '" data-ds="set-id" data-v="' + k + '" aria-pressed="' + cur + '"><i class="ds-sw" style="background:var(--sv-' + c + ')"></i>' + esc(nomClase(c)) + '</button>';
    }).join("") + '</div>';
    if (T.elem === "tec") return '<span class="ds-rot">' + esc(t({ es: "Capa", en: "Layer" })) + '</span><div class="ds-chips">' + TECS.map(function (k) {
      var cur = k === b.id; return '<button type="button" class="ds-chipb' + (cur ? " cur" : "") + '" data-ds="set-id" data-v="' + k + '" aria-pressed="' + cur + '">' + ico(k, 14) + k + '</button>';
    }).join("") + '</div>';
    var sinId = T.elem === "opt";
    return '<span class="ds-rot">' + esc(t(T.elem === "e" ? { es: "Enlace", en: "Link" } : sinId ? { es: "Dónde (vacío = todos)", en: "Where (empty = all)" } : { es: "Elemento", en: "Element" })) + '</span>' +
      '<div class="ds-el-act">' +
        '<span class="ds-el-cur' + (b.id ? "" : " vacio") + '">' + (b.id ? ico(IDX.enlaces[b.id] ? "enlace" : "nodo", 14) + '<b>' + esc(corto(b.id)) + '</b><span class="solo-experto tx3 mono">' + esc(b.id) + '</span>' : esc(sinId ? t({ es: "todos", en: "all" }) : "—")) + '</span>' +
        '<button type="button" class="btn ds-grande" data-ds="elegir-mapa">' + ico("mapa", 14) + esc(t({ es: "Elegir en el mapa", en: "Pick on map" })) + '</button>' +
        (sinId && b.id ? '<button type="button" class="btn ds-grande" data-ds="set-id" data-v="">' + esc(t({ es: "Todos", en: "All" })) + '</button>' : '') + '</div>' +
      '<div class="ds-buscar">' + ico("buscar", 14) + '<input type="search" data-ds-in="buscar" placeholder="' + esc(t({ es: "buscar por nombre…", en: "search by name…" })) + '" aria-label="' + esc(t({ es: "Buscar elemento", en: "Search element" })) + '" autocomplete="off" spellcheck="false"></div>' +
      '<div class="ds-res" role="listbox" aria-label="' + esc(t({ es: "Resultados", en: "Results" })) + '"></div>';
  }
  function cortoEsc(x) { var n = NOC.lang === "en" ? x.en : x.es; return n.length > 30 ? n.split(/[(:]/)[0].trim() : n; }
  var CAND = null;
  function candidatos(tipo) {
    var T = TB[tipo] || {};
    if (!CAND) {
      CAND = { n: [], e: [], z: [] };
      (RED.nodos || []).forEach(function (n) { CAND.n.push({ id: n.id, k: "nodo" }); });
      (RED.enlaces || []).forEach(function (l) { CAND.e.push({ id: l.id, k: "enlace" }); });
      ZONAS.forEach(function (z) { CAND.z.push({ id: z.id, k: "zona" }); });
      [CAND.n, CAND.e, CAND.z].forEach(function (L) { L.forEach(function (x) { x.nom = corto(x.id); x.q = (x.nom + " " + x.id).toLowerCase(); }); });
    }
    if (T.elem === "e") return CAND.e;
    if (T.elem === "opt") return CAND.z.concat(CAND.n);
    return CAND.e.concat(CAND.n);
  }
  function buscar(q, tipo) {
    q = String(q || "").toLowerCase().trim();
    if (!q) return [];
    var ps = q.split(/\s+/);
    return candidatos(tipo).filter(function (x) { return ps.every(function (p) { return x.q.indexOf(p) >= 0; }); }).slice(0, 8);
  }
  function pintarResultados(inp) {
    var b = bloque(UI.sel), box = inp.closest(".ds-ins-el").querySelector(".ds-res");
    if (!b || !box) return;
    var r = buscar(inp.value, b.tipo);
    box.innerHTML = r.map(function (x, i) {
      return '<button type="button" role="option" class="ds-opt" data-ds="set-id" data-v="' + esc(x.id) + '" aria-selected="' + (i === 0) + '">' + ico(x.k === "enlace" ? "enlace" : x.k === "zona" ? "zona" : "nodo", 14) + '<span>' + esc(x.nom) + '</span><span class="solo-experto tx3 mono">' + esc(x.id) + '</span></button>';
    }).join("") || (inp.value ? '<span class="ds-opt-nada">' + ico("aviso", 14) + esc(t({ es: "Nada con ese nombre", en: "Nothing by that name" })) + '</span>' : '');
  }

  // Multiplicadores de demanda (modelo_usuario.factores): deslizadores por servicio y por zona
  function factoresHTML() {
    function fila(k, etq, sw) {
      var v = esNum(D.factores[k]) ? D.factores[k] : 1, mod = Math.abs(v - 1) > 1e-9;
      return '<label class="ds-fac' + (mod ? " mod" : "") + '">' + sw + '<span class="ds-fac-n">' + esc(etq) + '</span>' +
        '<input type="range" class="ds-rango" data-ds-in="factor" data-k="' + esc(k) + '" min="0" max="3" step="0.05" value="' + v + '" aria-label="' + esc(etq + " ×") + '">' +
        '<output class="mono">× ' + fmt(v, 2) + '</output></label>';
    }
    var nmod = Object.keys(D.factores).filter(function (k) { return Math.abs(D.factores[k] - 1) > 1e-9; }).length;
    return '<details class="ds-facs"' + (nmod || leer("noc.disenador.fac") === "1" ? " open" : "") + '><summary>' + ico("demanda", 16) + '<span>' + esc(t({ es: "Multiplicar demanda", en: "Scale demand" })) + '</span>' +
      (nmod ? '<span class="ds-n">' + nmod + '</span>' : '') + info({ es: "Factores del modelo propio (modelo_usuario.factores): × 1 = como la v7. Se ven también en el panel MODELO.", en: "Own-model factors (modelo_usuario.factores): × 1 = as in v7. Also shown in the MODEL panel." }) +
      (nmod ? '<button type="button" class="btn" data-ds="factores-1">' + esc(t({ es: "Todo a × 1", en: "All to × 1" })) + '</button>' : '') + '</summary>' +
      '<div class="ds-facs-c"><div><h4 class="ds-h4">' + esc(t({ es: "Por servicio", en: "By service" })) + '</h4>' +
        CLASES.map(function (c) { return fila("clase:" + c, nomClase(c), '<i class="ds-sw" style="background:var(--sv-' + c + ')"></i>'); }).join("") + '</div>' +
      '<div><h4 class="ds-h4">' + esc(t({ es: "Por zona", en: "By zone" })) + '</h4>' + ZONAS.map(function (z) { return fila(z.id, z.nombre, ico("zona", 14)); }).join("") + '</div></div></details>';
  }

  // ---------------------------------------------------------------- edición de bloques
  function lab() {
    if (NOC.modo === "lab") return true;
    var r = $(".ds-ref", raiz); if (r) { r.classList.remove("pulso"); void r.offsetWidth; r.classList.add("pulso"); }
    return false;
  }
  function cambiado(sinVolcar) { if (!sinVolcar) programar(); pintar(); }
  function anadir(tipo) {
    if (!lab()) return;
    var T = TB[tipo], t0 = cargado(D.trafico) ? 20 * 60 : D.hora * 60;
    var mismos = D.bloques.filter(function (b) { return (TB[b.tipo] || {}).carril === T.carril; });
    if (mismos.length) t0 = Math.min(1380, Math.max.apply(null, mismos.map(function (b) { return b.t; })) + 30);
    var b = { uid: nuevoUid(), tipo: tipo, id: "", t: t0, fin: Math.min(1440, t0 + (tipo === "evento_demanda" ? 120 : 90)), params: {} };
    if (T.p) b.params[T.p.k] = T.p.def;
    if (T.elem === "esc") b.id = (ESCENARIOS_DEM[0] || {}).id || "";
    if (T.elem === "clase") b.id = "clase:urllc";
    if (T.elem === "tec") b.id = "n258";
    if (T.elem === "e" || T.elem === "ne") {   // sugerencia: el elemento seleccionado o el que falla en ese momento
      var s = NOC.seleccion;
      if (s && s.id && existe(tipo, s.id)) b.id = s.id;
      else if (T.carril === "op") { var f = D.bloques.filter(function (x) { return x.tipo === "fallo" && IDX.enlaces[x.id]; })[0]; if (f) { b.t = Math.min(1435, f.t + 10); b.fin = f.fin; } }
    }
    D.bloques.push(b); UI.sel = b.uid;
    cambiado();
    enfocarBloque(b.uid, !b.id && (T.elem === "e" || T.elem === "ne"));
  }
  function enfocarBloque(uid, aBuscar) {
    setTimeout(function () {
      var el = aBuscar ? $('[data-ds-in="buscar"]', raiz) : $('.ds-bl[data-uid="' + uid + '"]', raiz);
      if (el) el.focus();
    }, 0);
  }
  function mover(b, dt, modo) {
    var T = TB[b.tipo] || {}, dur = b.fin == null ? null : b.fin - b.t;
    if (modo === "izq") { b.t = clamp(b.t + dt, 0, (b.fin == null ? 1440 : b.fin) - 5); }
    else if (modo === "der") { var f = (b.fin == null ? 1440 : b.fin) + dt; b.fin = clamp(f, b.t + 5, 1440); if (b.fin >= 1440 && !T.instante) b.fin = null; }
    else {
      var lim = dur == null || T.instante ? 1435 : 1440 - dur;
      b.t = clamp(b.t + dt, 0, Math.max(0, lim));
      if (T.instante) b.fin = b.t; else if (dur != null) b.fin = b.t + dur;
    }
  }

  // ---------------------------------------------------------------- arrastre (puntero)
  var ARR = null;
  function alPuntero(ev) {
    var bl = ev.target.closest(".ds-bl");
    if (!bl || ev.button !== 0) return;
    var car = bl.closest(".ds-carril");
    if (!car || !car.classList.contains("activo")) return;
    var b = bloque(bl.getAttribute("data-uid"));
    if (!b) return;
    var asa = ev.target.getAttribute && ev.target.getAttribute("data-asa");
    var pista = bl.closest(".ds-pista");
    ARR = { b: b, el: bl, modo: asa || "mover", x0: ev.clientX, w: pista.getBoundingClientRect().width, t0: b.t, f0: b.fin, movido: false, id: ev.pointerId };
    try { bl.setPointerCapture(ev.pointerId); } catch (e) { /* nada */ }
    bl.addEventListener("pointermove", arrMover);
    bl.addEventListener("pointerup", arrFin);
    bl.addEventListener("pointercancel", arrFin);
    ev.preventDefault();
  }
  function arrMover(ev) {
    if (!ARR) return;
    var dx = ev.clientX - ARR.x0;
    if (!ARR.movido && Math.abs(dx) < 3) return;
    if (!lab()) return;
    ARR.movido = true;
    var dt = Math.round(dx / ARR.w * 1440 / 5) * 5;
    ARR.b.t = ARR.t0; ARR.b.fin = ARR.f0;
    mover(ARR.b, dt, ARR.modo);
    var T = TB[ARR.b.tipo] || {}, f = ARR.b.fin == null ? 1440 : ARR.b.fin;
    ARR.el.style.left = (ARR.b.t / 14.4).toFixed(3) + "%";
    if (!T.instante) ARR.el.style.width = Math.max(0.5, (f - ARR.b.t) / 14.4).toFixed(3) + "%";
    mostrarTip(ev.clientX, ARR.el.getBoundingClientRect().top - 6, hhmm(ARR.b.t) + (T.instante ? "" : " – " + (ARR.b.fin == null ? "24:00" : hhmm(f))));
  }
  function arrFin(ev) {
    if (!ARR) return;
    var a = ARR; ARR = null;
    a.el.removeEventListener("pointermove", arrMover); a.el.removeEventListener("pointerup", arrFin); a.el.removeEventListener("pointercancel", arrFin);
    var tp = $(".ds-tip", raiz); if (tp) tp.hidden = true;
    UI.sel = a.b.uid;
    if (a.movido) cambiado(); else pintar();
    enfocarBloque(a.b.uid);
  }
  function mostrarTip(x, y, txt) {
    var tp = $(".ds-tip", raiz);
    if (!tp) return;
    var r = raiz.getBoundingClientRect();
    tp.textContent = txt; tp.hidden = false;
    tp.style.left = clamp(x - r.left - tp.offsetWidth / 2, 4, r.width - tp.offsetWidth - 4) + "px";
    tp.style.top = Math.max(4, y - r.top - tp.offsetHeight) + "px";
  }
  function alHover(ev) {
    if (ARR) return;
    var c = ev.target.closest && ev.target.closest(".ds-curva, .ds-res-graf");
    var tp = $(".ds-tip", raiz);
    if (!c || !c._curva) { if (tp && !ev.target.closest(".ds-bl")) tp.hidden = true; return; }
    var k = c._curva, r = c.getBoundingClientRect(), x = ev.clientX - r.left;
    var tm = clamp((x - k.ML) / (k.W - k.ML - k.MR) * 1440, 0, 1439);
    var d = k.d, i = 0;
    for (var j = 0; j < d.length; j++) if (d[j].t <= tm) i = j;
    var p = d[i];
    if (!p) return;
    var txt = hhmm(p.t) + " · " + (k.fmt ? k.fmt(p) : fmt(p.v, 0) + " " + k.unidad);
    mostrarTip(ev.clientX, r.top + 14, txt);
  }

  // ---------------------------------------------------------------- teclado
  function alTecla(ev) {
    if (ev.key === "Escape") {
      ev.stopPropagation(); ev.preventDefault();
      if (UI.sel && ev.target.closest && ev.target.closest(".ds-bl")) { UI.sel = null; pintar(); return; }
      cerrar(); return;
    }
    var tab = ev.target.closest && ev.target.closest(".ds-paso");
    if (tab && (ev.key === "ArrowRight" || ev.key === "ArrowLeft")) { ev.preventDefault(); irPaso(UI.paso + (ev.key === "ArrowRight" ? 1 : -1)); return; }
    var bl = ev.target.closest && ev.target.closest(".ds-bl");
    if (bl) {
      var b = bloque(bl.getAttribute("data-uid"));
      if (!b) return;
      var paso = ev.shiftKey ? 60 : 15, hecho = true;
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") { if (!lab()) return; mover(b, ev.key === "ArrowRight" ? paso : -paso, ev.altKey ? "der" : "mover"); }
      else if (ev.key === "+" || ev.key === "=" || ev.key === "-") { if (!lab()) return; mover(b, ev.key === "-" ? -paso : paso, "der"); }
      else if (ev.key === "Delete" || ev.key === "Backspace") { if (!lab()) return; borrar(b.uid); ev.preventDefault(); return; }
      else if (ev.key === "Enter" || ev.key === " ") { UI.sel = b.uid; pintar(); setTimeout(function () { var i = $(".ds-ins input, .ds-ins button", raiz); if (i) i.focus(); }, 0); ev.preventDefault(); return; }
      else hecho = false;
      if (hecho) { ev.preventDefault(); UI.sel = b.uid; cambiado(); enfocarBloque(b.uid); }
      return;
    }
    if (ev.target.matches && ev.target.matches('[data-ds-in="buscar"]') && ev.key === "Enter") {
      ev.preventDefault();
      var o = $(".ds-res .ds-opt", raiz); if (o) o.click();
    }
    ev.stopPropagation();   // las teclas del diseñador no llegan a los atajos del shell (1–6, f, l…)
  }
  function borrar(uid) {
    D.bloques = D.bloques.filter(function (b) { return b.uid !== uid; });
    if (UI.sel === uid) UI.sel = null;
    cambiado();
    setTimeout(function () { var x = $(".ds-carril.activo .ds-bl", raiz) || $(".ds-paleta .ds-pal", raiz); if (x) x.focus(); }, 0);
  }

  // ---------------------------------------------------------------- clics, entradas
  function alClic(ev) {
    var b = ev.target.closest("[data-ds], [data-paso], .ds-bl");
    if (!b) return;
    if (b.classList.contains("ds-bl")) return;   // lo maneja el puntero
    if (b.hasAttribute("data-paso") && !b.hasAttribute("data-ds")) { irPaso(Number(b.getAttribute("data-paso"))); return; }
    var a = b.getAttribute("data-ds"), v = b.getAttribute("data-v");
    switch (a) {
      case "cerrar": cerrar(); break;
      case "lab": NOC.setModo && NOC.setModo("lab"); desdeCaso(); pintar(); break;
      case "ant": irPaso(UI.paso - 1); break;
      case "sig": irPaso(UI.paso + 1); break;
      case "partida": elegirPartida(b.getAttribute("data-k")); break;
      case "trafico": if (lab()) { D.trafico = v; cambiado(); } break;
      case "dia": if (lab()) { D.dia = v; cambiado(); } break;
      case "anio": if (lab()) { D.anio = clamp(D.anio + Number(b.getAttribute("data-d")), ANIO_MIN, ANIO_MAX); cambiado(); } break;
      case "hora": if (lab()) { D.hora = (D.hora + Number(b.getAttribute("data-d")) + 24) % 24; cambiado(); } break;
      case "anadir": anadir(b.getAttribute("data-tipo")); break;
      case "borrar": if (lab()) borrar(b.getAttribute("data-uid")); break;
      case "set-id": {
        var bl = bloque(UI.sel); if (!bl || !lab()) break;
        bl.id = v || ""; cambiado();
        break;
      }
      case "elegir-mapa": empezarElegir(); break;
      case "quitar-base": if (lab()) { D.fallosBase = D.fallosBase.filter(function (x) { return x !== b.getAttribute("data-id"); }); cambiado(); } break;
      case "quitar-evento": if (lab()) { D.evento = "ninguno"; cambiado(); } break;
      case "factores-1": ev.preventDefault(); if (lab()) { D.factores = {}; cambiado(); } break;
      case "ir-bloque": {
        var u = b.getAttribute("data-uid"), x = bloque(u); if (!x) break;
        UI.sel = u; irPaso((TB[x.tipo] || {}).carril === "op" ? 4 : 3); enfocarBloque(u);
        break;
      }
      case "pelicula": verPelicula(); break;
      case "guardar": guardarEstudio(); break;
      case "compartir": compartir(); break;
      case "instante": if (UI.res) { UI.res.i = Number(v); pintarResultadoDetalle(); } break;
      case "foco": if (UI.res) { UI.res.foco = v || null; pintarResultadoDetalle(); } break;
    }
  }
  // la curva no tiene data-ds: clic propio
  document.addEventListener("click", function (ev) {
    if (!UI.abierto || !raiz || !raiz.contains(ev.target)) return;
    var cu = ev.target.closest(".ds-curva"), rg = ev.target.closest(".ds-res-graf");
    if (cu && cu._curva && !cargado(D.trafico)) {
      if (!lab()) return;
      var r = cu.getBoundingClientRect(), k = cu._curva;
      D.hora = clamp(Math.floor((ev.clientX - r.left - k.ML) / (k.W - k.ML - k.MR) * 24), 0, 23); cambiado();
    } else if (rg && rg._curva && UI.res && UI.res.A) {
      var r2 = rg.getBoundingClientRect(), k2 = rg._curva, tm = (ev.clientX - r2.left - k2.ML) / (k2.W - k2.ML - k2.MR) * 1440;
      var s = UI.res.B, best = 0;
      for (var i = 0; i < s.pasos.length; i++) if (s.pasos[i].t_min <= tm) best = i;
      UI.res.i = best; pintarResultadoDetalle();
    }
  });
  function alInput(ev) {
    var s = ev.target, k = s.getAttribute && s.getAttribute("data-ds-in");
    if (!k) return;
    if (k === "buscar") { pintarResultados(s); return; }
    if (!lab()) return;
    if (k === "anio") { D.anio = Number(s.value); programar(); var o = s.parentNode.querySelector(".ds-grande-num"); if (o) o.textContent = D.anio; return; }
    if (k === "hora") { D.hora = Number(s.value); programar(); var o2 = s.parentNode.querySelector(".ds-grande-num"); if (o2) o2.textContent = pad(D.hora) + ":00"; return; }
    if (k === "factor") {
      var key = s.getAttribute("data-k"), v = Number(s.value);
      if (Math.abs(v - 1) < 1e-9) delete D.factores[key]; else D.factores[key] = v;
      var out = s.parentNode.querySelector("output"); if (out) out.textContent = "× " + fmt(v, 2);
      s.parentNode.classList.toggle("mod", Math.abs(v - 1) > 1e-9);
      programar();
      return;
    }
    var b = bloque(UI.sel);
    if (!b) return;
    if (k === "param") {
      var T = TB[b.tipo]; b.params = b.params || {}; b.params[T.p.k] = Number(s.value);
      var out2 = s.parentNode.querySelector("output"); if (out2) out2.textContent = T.p.pct ? fmt(b.params[T.p.k] * 100, 0) + " %" : b.params[T.p.k];
      var el = $('.ds-bl[data-uid="' + b.uid + '"] .ds-bl-p', raiz); if (el) el.textContent = T.p.pct ? fmt(b.params[T.p.k] * 100, 0) + " %" : (T.p.k === "n" ? "+" + b.params[T.p.k] : "P" + b.params[T.p.k]);
      programar();
    }
  }
  function alCambio(ev) {
    var s = ev.target, k = s.getAttribute && s.getAttribute("data-ds-in");
    if (!k) return;
    if (k === "anio" || k === "hora") { pintar(); return; }
    if (k === "factor") { pintar(); return; }
    var b = bloque(UI.sel);
    if (!b || !lab()) return;
    if (k === "t") { var m = deHHMM(s.value); if (m != null) { var dur = b.fin == null ? null : b.fin - b.t; b.t = Math.min(m, 1435); if (TB[b.tipo].instante) b.fin = b.t; else if (dur != null && b.fin <= b.t) b.fin = Math.min(1440, b.t + dur); } cambiado(); }
    else if (k === "fin") { var f = deHHMM(s.value); b.fin = s.value === "" || f == null || f >= 1440 ? null : f; cambiado(); }
    else if (k === "param") cambiado();
  }

  // ---------------------------------------------------------------- elegir en el mapa / unifilar
  function empezarElegir() {
    var b = bloque(UI.sel);
    if (!b || !lab()) return;
    UI.elegir = { uid: b.uid, esp: NOC.espacio };
    raiz.hidden = true; fondo.hidden = true;
    if (NOC.espacio !== "red" && NOC.espacio !== "simulacion" && NOC.setEspacio) NOC.setEspacio("red");
    if (NOC.activarVista && NOC.vistaActiva !== "mapa" && NOC.vistaActiva !== "unifilar") { try { NOC.activarVista("mapa"); } catch (e) { /* nada */ } }
    var T = TB[b.tipo];
    tira.innerHTML = ico("mapa", 18) + '<span>' + esc(t(T.elem === "e" ? { es: "Haz clic en un enlace del mapa o del unifilar", en: "Click a link on the map or single-line diagram" } : { es: "Haz clic en un nodo o enlace del mapa o del unifilar", en: "Click a node or link on the map or single-line diagram" })) + '</span>' +
      '<button type="button" class="btn ds-grande" data-ds="cancelar-elegir">' + esc(t({ es: "Cancelar", en: "Cancel" })) + '</button>';
    tira.hidden = false;
    var bt = tira.querySelector("button"); if (bt) bt.focus();
  }
  function terminarElegir(id) {
    var E = UI.elegir;
    UI.elegir = null;
    tira.hidden = true;
    if (!E) return;
    var b = bloque(E.uid);
    if (b && id && existe(b.tipo, id)) { b.id = id; UI.sel = b.uid; programar(); }
    if (E.esp && E.esp !== NOC.espacio && NOC.setEspacio && E.esp === "inicio") NOC.setEspacio(E.esp);
    if (UI.abierto) { raiz.hidden = false; fondo.hidden = false; pintar(); enfocarBloque(E.uid); }
  }
  NOC.on && NOC.on("seleccion", function (s) {
    if (!UI.elegir || !s || !s.id) return;
    var b = bloque(UI.elegir.uid);
    if (!b) { terminarElegir(null); return; }
    if (existe(b.tipo, s.id)) { setTimeout(function () { terminarElegir(s.id); if (NOC.cerrarFicha) NOC.cerrarFicha(); }, 0); }
    else if (NOC.mensaje) NOC.mensaje(t({ es: "Ese elemento no vale para este bloque", en: "That element does not fit this block" }));
  });
  document.addEventListener("keydown", function (ev) { if (UI.elegir && ev.key === "Escape") { ev.preventDefault(); terminarElegir(null); } }, true);

  // ---------------------------------------------------------------- paso 5: resultado
  function pasoResultado() {
    var ref = NOC.modo === "ref";
    return '<div class="ds-p5">' +
      '<div class="ds-kpis" id="ds-kpis"><span class="ds-cargando">' + esc(t({ es: "calculando antes y después…", en: "computing before and after…" })) + '</span></div>' +
      '<div class="ds-p5-dos"><figure class="ds-fig"><figcaption><span class="ds-graf-tit"></span>' +
        '<span class="ds-ley"><span><i class="ds-ley-a"></i>' + esc(t({ es: "sin escenario", en: "no scenario" })) + '</span><span><i class="ds-ley-b"></i>' + esc(t({ es: "con escenario", en: "with scenario" })) + '</span></span>' +
        info({ es: "Dos Motor.serie (15 min): sin y con los eventos y multiplicadores. La marca es el instante comparado; clic en la gráfica para cambiarlo.", en: "Two Motor.serie runs (15 min): without and with the events and multipliers. The mark is the compared instant; click the chart to change it." }) + '</figcaption>' +
        '<div class="ds-res-graf" role="img"></div></figure>' +
      '<div class="ds-top" id="ds-top"></div></div>' +
      '<div class="ds-acc">' +
        '<button type="button" class="btn prim ds-muy" data-ds="pelicula"' + (ref ? " disabled" : "") + '>' + ico("pelicula", 20) + esc(t({ es: "Ver película", en: "Play run" })) + '</button>' +
        '<label class="ds-campo ds-nom"><span class="ds-rot">' + esc(t({ es: "Nombre", en: "Name" })) + '</span><input type="text" data-ds-in="nombre" value="' + esc(UI.nombre || nombrePropuesto()) + '" maxlength="80"></label>' +
        '<button type="button" class="btn ds-muy" data-ds="guardar"' + (ref ? " disabled" : "") + '>' + ico("guardar", 20) + esc(t({ es: "Guardar como estudio", en: "Save as study" })) + '</button>' +
        '<button type="button" class="btn ds-muy" data-ds="compartir">' + ico("compartir", 20) + esc(t({ es: "Compartir", en: "Share" })) + '</button>' +
        '<input type="text" class="ds-url mono" readonly aria-label="URL" value="' + esc(UI.url) + '"' + (UI.url ? "" : " hidden") + '>' +
      '</div></div>';
  }
  function nombrePropuesto() {
    var p = D.bloques.slice(0, 3).map(function (b) {
      var n = b.id ? corto(b.id) : "";
      if (b.tipo === "evento_demanda") { var e = ESCENARIOS_DEM.filter(function (x) { return x.id === b.id; })[0]; n = e ? cortoEsc(e).split(/[(:]/)[0].trim() : n; }
      return t(TB[b.tipo] ? TB[b.tipo].n : { es: b.tipo }) + (n ? " " + n : "");
    });
    return (p.length ? p.join(" + ") : t({ es: "Escenario", en: "Scenario" })) + " · " + nomDia(D.dia) + " " + D.anio;
  }
  function opBase(conEsc) {
    var tr = { id: D.trafico, anio: D.anio, dia: D.dia };
    var o = { caso: { trafico: tr, evento: D.evento || "ninguno", fallo: D.fallosBase.slice() } };
    var mu = muDe(!!conEsc); if (mu) o.modelo_usuario = mu;
    return o;
  }
  function serieP(op, evs) {
    var opts = { paso_min: 15, desde: 0, hasta: 24, eventos: evs, fallos: [] };
    if (Motor.serieAsync) return Motor.serieAsync(RED, op, opts);
    return new Promise(function (ok, mal) { setTimeout(function () { try { ok(Motor.serie(RED, op, opts)); } catch (e) { mal(e); } }, 10); });
  }
  function calcularResultado() {
    var gen = ++UI.resGen;
    var evs = aEventos(D.bloques).map(sinUid), opA = opBase(false), opB = opBase(true);
    var clave = JSON.stringify([opA, opB, evs]);
    if (UI.res && UI.res.clave === clave && UI.res.A) { pintarResultadoDetalle(); return; }
    UI.res = { clave: clave, A: null, B: null, i: null, opA: opA, opB: opB };
    Promise.all([serieP(opA, []), serieP(opB, evs)]).then(function (r) {
      if (gen !== UI.resGen || !UI.res) return;
      UI.res.A = r[0]; UI.res.B = r[1];
      UI.res.i = peorInstante(r[0], r[1]);
      UI.res.foco = enlaceFoco(r[0], r[1]);
      pintarResultadoDetalle();
    }, function (e) {
      console.error("diseñador: serie", e);
      var k = $("#ds-kpis", raiz); if (k) k.innerHTML = '<span class="ds-vchip sev-crit">' + ico("error", 14) + esc(String(e && e.message || e)) + '</span>';
    });
  }
  // enlace que más cambia en el día (curvas por enlace de la serie); null = nada cambia y se pinta la ocupación máxima
  function enlaceFoco(A, B) {
    var best = null, bd = 0.5;
    Object.keys(B.enlaces || {}).forEach(function (id) {
      var a = A.enlaces && A.enlaces[id] && A.enlaces[id].ocup, b = B.enlaces[id].ocup;
      if (!a || !b) return;
      for (var i = 0; i < b.length; i++) { var d = Math.abs(b[i] - a[i]); if (d > bd) { bd = d; best = id; } }
    });
    return best;
  }
  function puntuacion(p) { var r = p.resumen || {}; return (100 - (r.servido_pct || 100)) * 20 + (r.ocup_max_pct || 0) + (r.n_alarmas || 0) * 3 + (r.demandas_afectadas || 0) * 2; }
  function peorInstante(A, B) {
    var best = 0, bd = -Infinity;
    for (var i = 0; i < B.pasos.length; i++) {
      var d = puntuacion(B.pasos[i]) - puntuacion(A.pasos[i] || B.pasos[i]);
      if (d > bd + 1e-9) { bd = d; best = i; }
    }
    if (bd <= 1e-9) {   // nada empeora: el paso con más carga del escenario
      bd = -Infinity;
      for (var j = 0; j < B.pasos.length; j++) { var s = puntuacion(B.pasos[j]); if (s > bd) { bd = s; best = j; } }
    }
    return best;
  }
  function resultadoPaso(op, s, i) {
    var o = copia(op);
    o.hora = s.pasos[i].t_min / 60;
    if (s.hora_cargada) o.perfil_horario = true;
    var pp = s.pasos[i];
    if (Array.isArray(pp.fallos)) o.fallos_exactos = pp.fallos.slice();
    if (pp.opciones_paso && typeof pp.opciones_paso === "object") Object.keys(pp.opciones_paso).forEach(function (k) { o[k] = pp.opciones_paso[k]; });
    if (Motor.opcionesPaso) o = Motor.opcionesPaso(o, s, i) || o;
    return Motor.calcular(RED, o);
  }
  function pintarResultadoDetalle() {
    var R = UI.res;
    if (!R || !R.A || !raiz) return;
    var i = R.i, cA, cB, c;
    try {
      cA = resultadoPaso(R.opA, R.A, i); cB = resultadoPaso(R.opB, R.B, i);
      c = Motor.comparar ? Motor.comparar(cA, cB) : null;
    } catch (e) { console.error("diseñador: comparar", e); return; }
    R.c = c; R.cB = cB;
    var tm = R.B.pasos[i].t_min;
    var k = c ? c.kpi : null, el = $("#ds-kpis", raiz);
    if (el && k) {
      el.innerHTML = '<div class="ds-k-cab">' + ico("cuando", 16) + '<b class="mono">' + hhmm(tm) + '</b><span class="tx3">' + esc(t({ es: "instante comparado", en: "compared instant" })) + '</span></div>' +
        tile(t({ es: "Demanda servida", en: "Served demand" }), k.pct_servida.a, k.pct_servida.b, { max: 100, unidad: "%", dec: 2, servida: true }) +
        tile(t({ es: "Ocupación máx.", en: "Max. occupancy" }), k.max_ocupacion.a * 100, k.max_ocupacion.b * 100, { max: Math.max(120, k.max_ocupacion.b * 100 + 5), unidad: "%", dec: 1, umbrales: [60, 85, 100] }) +
        tile(t({ es: "Demandas afectadas", en: "Affected demands" }), k.demandas_afectadas.a, k.demandas_afectadas.b, { max: Math.max(10, (cB.demandas || []).length), unidad: "", dec: 0, cuenta: true }) +
        tile(t({ es: "Alertas graves", en: "Major alerts" }), k.alertas_graves.a, k.alertas_graves.b, { max: Math.max(5, k.alertas_graves.b + 2), unidad: "", dec: 0, cuenta: true });
    }
    var top = $("#ds-top", raiz);
    if (top) top.innerHTML = topHTML(c);
    dibujarResGraf(tm);
  }
  function estadoK(v, o) {
    if (o.servida) return v >= 99.999 ? "ok" : v >= 99 ? "min" : v >= 95 ? "maj" : "crit";
    if (o.cuenta) return v <= 0 ? "ok" : v <= 2 ? "min" : v <= 10 ? "maj" : "crit";
    var u = o.umbrales || [60, 85, 100];
    return v < u[0] ? "ok" : v < u[1] ? "min" : v <= u[2] ? "maj" : "crit";
  }
  var SEVTXT = { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT" };
  function tile(rot, a, b, o) {
    var sev = estadoK(b, o), d = b - a, mejor = o.servida ? d > 0 : d < 0;
    var med = "";   // medidor propio: NOC.medidor no marca el valor "antes", que aquí es lo importante
    {
      var pa = clamp(a / o.max * 100, 0, 100), pb = clamp(b / o.max * 100, 0, 100);
      med = '<div class="ds-med" aria-hidden="true"><i class="ds-med-b sev-bg-' + sev + '" style="width:' + pb.toFixed(1) + '%"></i>' +
        (o.umbrales ? o.umbrales.map(function (u) { return '<i class="ds-med-u" style="left:' + clamp(u / o.max * 100, 0, 100).toFixed(1) + '%"></i>'; }).join("") : '') +
        '<i class="ds-med-a" style="left:' + pa.toFixed(1) + '%" title="' + esc(t({ es: "antes", en: "before" })) + '"></i></div>';
    }
    var dTxt = Math.abs(d) < Math.pow(10, -o.dec) / 2 ? "=" : (d > 0 ? "+" : "−") + fmt(Math.abs(d), o.dec);
    return '<div class="ds-k" role="group" aria-label="' + esc(rot + ": " + fmt(a, o.dec) + " → " + fmt(b, o.dec) + " " + o.unidad + " (" + SEVTXT[sev] + ")") + '">' +
      '<span class="ds-k-r">' + esc(rot) + '</span>' +
      '<span class="ds-k-v"><span class="tx3 mono">' + fmt(a, o.dec) + '</span>' + ico("der", 14) + '<b class="mono">' + fmt(b, o.dec) + '</b><small>' + esc(o.unidad) + '</small>' +
      '<span class="sev sev-' + sev + '">' + SEVTXT[sev] + '</span></span>' + med +
      '<span class="ds-k-d mono ' + (dTxt === "=" ? "tx3" : mejor ? "sev-ok" : "sev-crit") + '">' + esc(dTxt) + '</span></div>';
  }
  function topHTML(c) {
    if (!c || !c.top) return "";
    var L = [];
    (c.top.enlaces_ocupacion || []).forEach(function (x) { L.push({ tipo: "enlace", id: x.id, a: x.a * 100, b: x.b * 100, s: Math.abs(x.d) * 100, u: "%", dec: 1 }); });
    (c.top.demandas_servida || []).forEach(function (x) { var base = Math.max(Math.abs(x.a), Math.abs(x.b), 1e-9); L.push({ tipo: "demanda", id: x.id, a: x.a, b: x.b, s: Math.abs(x.b - x.a) / base * 100, u: "Gbit/s", dec: 2 }); });
    L.sort(function (p, q) { return q.s - p.s; });
    L = L.filter(function (x) { return x.s > 1e-6; }).slice(0, 3);
    var h = '<h3 class="ds-h3">' + ico("resultado", 16) + esc(t({ es: "Los 3 cambios más grandes", en: "The 3 biggest changes" })) + '</h3>';
    if (!L.length) return h + '<p class="ds-nada">' + ico("ok", 16) + esc(t({ es: "Nada cambia en este instante", en: "Nothing changes at this instant" })) + '</p>';
    var mx = Math.max.apply(null, L.map(function (x) { return Math.max(x.a, x.b); })) || 1;
    return h + '<ol class="ds-cambios">' + L.map(function (x) {
      var d = x.b - x.a, sube = d > 0, malo = x.tipo === "enlace" ? sube : !sube;
      var esEl = x.tipo === "enlace", caido = esEl && caidoEn(x.id);
      if (caido) malo = true;
      var foco = esEl && UI.res && UI.res.foco === x.id;
      return '<li><button type="button" class="ds-cambio' + (foco ? " cur" : "") + '" data-ds="' + (esEl ? "foco" : "") + '" data-v="' + esc(x.id) + '"' + (esEl ? ' aria-pressed="' + foco + '"' : " disabled") + ' title="' + esc(esEl ? t({ es: "Ver su curva de 24 h", en: "Show its 24 h curve" }) : x.id) + '">' +
        ico(esEl ? "enlace" : "demanda", 16) + '<span class="ds-c-n">' + esc(corto(x.id)) + '</span>' +
        '<span class="ds-c-bar" aria-hidden="true"><i class="a" style="width:' + clamp(x.a / mx * 100, 0, 100).toFixed(1) + '%"></i><i class="b ' + (malo ? "malo" : "bueno") + '" style="width:' + clamp(x.b / mx * 100, 0, 100).toFixed(1) + '%"></i></span>' +
        '<span class="ds-c-v mono">' + fmt(x.a, x.dec) + ' → <b>' + fmt(x.b, x.dec) + '</b> ' + esc(x.u) + '</span>' +
        '<span class="ds-c-d mono ' + (malo ? "sev-crit" : "sev-ok") + '">' + (caido ? '<span class="sev sev-crit">DOWN</span>' : (sube ? "▲" : "▼")) + '</span></button></li>';
    }).join("") + '</ol>';
  }
  function caidoEn(id) {
    var r = UI.res && UI.res.cB, l = r && r.enlaces;
    if (!l) return false;
    var e = Array.isArray(l) ? l.filter(function (x) { return x.id === id; })[0] : l[id];
    return !!(e && e.caido);
  }
  function dibujarResGraf(tmSel) {
    var el = $(".ds-res-graf", raiz), R = UI.res;
    if (!el || !R || !R.A) return;
    var W = Math.max(240, el.clientWidth || 600), H = Math.max(120, el.clientHeight || 180);
    var fa = R.foco && R.A.enlaces && R.A.enlaces[R.foco], fb = R.foco && R.B.enlaces && R.B.enlaces[R.foco];
    if (!fa || !fb) R.foco = null;
    var A = R.A.pasos.map(function (p, i) { return { t: p.t_min, v: R.foco ? fa.ocup[i] || 0 : p.resumen.ocup_max_pct || 0 }; });
    var B = R.B.pasos.map(function (p, i) { return { t: p.t_min, v: R.foco ? fb.ocup[i] || 0 : p.resumen.ocup_max_pct || 0 }; });
    var tit = $(".ds-graf-tit", raiz);
    if (tit) tit.innerHTML = R.foco ? ico("enlace", 14) + ' <b>' + esc(corto(R.foco)) + '</b> · ' + esc(t({ es: "ocupación en 24 h · %", en: "occupancy over 24 h · %" })) +
      (R.foco ? ' <button type="button" class="btn" data-ds="foco" data-v="">' + esc(t({ es: "ver máxima de la red", en: "network maximum" })) + '</button>' : '')
      : esc(t({ es: "Ocupación máxima de la red en 24 h · %", en: "Network max. occupancy over 24 h · %" }));
    var ymax = Math.max(110, Math.max.apply(null, B.map(function (x) { return x.v; }).concat(A.map(function (x) { return x.v; }))) * 1.08);
    var ML = 40, MR = 8, MT = 8, MB = 34, dt = R.B.paso_min || 15;
    function X(tm) { return ML + tm / 1440 * (W - ML - MR); }
    function Y(v) { return MT + (1 - v / ymax) * (H - MT - MB); }
    function camino(d) { return "M" + d.map(function (x) { return X(x.t + dt / 2).toFixed(1) + "," + Y(x.v).toFixed(1); }).join("L"); }
    var s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">';
    [0, 50, 100].forEach(function (v) { s += '<line class="ds-grid" x1="' + ML + '" x2="' + (W - MR) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><text class="ds-ax" x="' + (ML - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end">' + v + '</text>'; });
    s += '<line class="ds-umbral" x1="' + ML + '" x2="' + (W - MR) + '" y1="' + Y(85).toFixed(1) + '" y2="' + Y(85).toFixed(1) + '"/><text class="ds-ax ds-umb-t" x="' + (W - MR - 2) + '" y="' + (Y(85) - 3).toFixed(1) + '" text-anchor="end">85</text>';
    for (var hh = 0; hh <= 24; hh += 3) s += '<text class="ds-ax" x="' + X(hh * 60).toFixed(1) + '" y="' + (H - MB + 14) + '" text-anchor="middle">' + pad(hh) + '</text>';
    // bloques del escenario bajo el eje
    D.bloques.forEach(function (b) {
      var T = TB[b.tipo] || {}, f = b.fin == null ? 1440 : Math.max(b.fin, b.t + 5), y = H - 12 + ((T.carril === "op") ? 4 : 0);
      s += '<rect x="' + X(b.t).toFixed(1) + '" y="' + (y - 4) + '" width="' + Math.max(2, X(f) - X(b.t)).toFixed(1) + '" height="3" style="fill:' + T.color + '"/>';
    });
    s += '<path class="ds-l-a" d="' + camino(A) + '"/><path class="ds-l-b" d="' + camino(B) + '"/>';
    var xs = X(tmSel + dt / 2);
    s += '<line class="ds-sel-l" x1="' + xs.toFixed(1) + '" x2="' + xs.toFixed(1) + '" y1="' + MT + '" y2="' + (H - MB) + '"/>';
    var bi = B.filter(function (x) { return x.t === tmSel; })[0];
    if (bi) s += '<circle class="ds-punto" cx="' + xs.toFixed(1) + '" cy="' + Y(bi.v).toFixed(1) + '" r="4.5"/>';
    s += '</svg>';
    el.innerHTML = s;
    var Ai = {}; A.forEach(function (x) { Ai[x.t] = x.v; });
    el._curva = { d: B, X: X, ML: ML, MR: MR, W: W, unidad: "%", fmt: function (p) { return t({ es: "sin ", en: "without " }) + fmt(Ai[p.t] || 0, 1) + " % · " + t({ es: "con ", en: "with " }) + fmt(p.v, 1) + " %"; } };
    var mxA = Math.max.apply(null, A.map(function (x) { return x.v; })), mxB = Math.max.apply(null, B.map(function (x) { return x.v; }));
    el.setAttribute("aria-label", (R.foco ? corto(R.foco) + ": " : t({ es: "Ocupación máxima: ", en: "Max. occupancy: " })) + t({ es: "pico sin escenario ", en: "peak without scenario " }) + fmt(mxA, 1) + " %, " + t({ es: "con escenario ", en: "with scenario " }) + fmt(mxB, 1) + " %");
  }

  // ---------------------------------------------------------------- acciones finales
  var pendientePeli = null;
  if (NOC.reloj && NOC.reloj.alSerie) NOC.reloj.alSerie(function () {
    if (pendientePeli == null) return;
    var tm = pendientePeli; pendientePeli = null;
    setTimeout(function () { arrancarPeli(tm); }, 0);
  });
  function arrancarPeli(tm) {
    try { NOC.reloj.ir(tm); if (NOC.reloj.jugar) NOC.reloj.jugar(); } catch (e) { console.error("diseñador: película", e); }
  }
  function verPelicula() {
    if (!lab()) return;
    volcar();
    var t0 = D.bloques.length ? Math.min.apply(null, D.bloques.map(function (b) { return b.t; })) : (cargado(D.trafico) ? 18 * 60 : D.hora * 60);
    var tm = Math.max(0, Math.floor((t0 - 30) / 15) * 15);
    cerrar();
    if (NOC.setEspacio) NOC.setEspacio("simulacion");
    if (!NOC.reloj) return;
    if (NOC.reloj.refrescar) NOC.reloj.refrescar();
    if (NOC.reloj.serie && NOC.reloj.serie()) arrancarPeli(tm);
    else pendientePeli = tm;
  }
  function nombreActual() { var i = $('[data-ds-in="nombre"]', raiz); UI.nombre = i ? i.value.trim() : (UI.nombre || ""); return UI.nombre || nombrePropuesto(); }
  function guardarEstudio() {
    if (!lab() || !NOC.estudios) return;
    volcar();
    var n = nombreActual();
    if (NOC.estudios.guardarComo) NOC.estudios.guardarComo(n, "");
    else NOC.estudios.guardar();
    var b = $('[data-ds="guardar"]', raiz); if (b) { b.classList.add("hecho"); b.innerHTML = ico("ok", 20) + esc(t({ es: "Guardado", en: "Saved" })); }
  }
  function compartir() {
    if (!NOC.estudios || !NOC.estudios.enlace) return;
    volcar();
    var est = NOC.estudios.capturar ? NOC.estudios.capturar() : null;
    if (est) est.nombre = nombreActual();
    NOC.estudios.enlace(est).then(function (url) {
      UI.url = url;
      var i = $(".ds-url", raiz); if (i) { i.value = url; i.hidden = false; i.select(); }
      var ok = function () { var b = $('[data-ds="compartir"]', raiz); if (b) b.innerHTML = ico("ok", 20) + esc(t({ es: "URL copiada", en: "URL copied" })); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { /* queda en el campo */ });
    }, function (e) { console.error("diseñador: compartir", e); });
  }

  // ---------------------------------------------------------------- puntos de entrada
  // Cualquier botón [data-accion="disenar-escenario"] (pastilla de caso, INICIO, SIMULACIÓN, línea de eventos) abre el diseñador.
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-accion="disenar-escenario"]');
    if (!b) return;
    ev.preventDefault();
    var p = Number(b.getAttribute("data-paso"));
    abrir(p || undefined);
  });
  function botonDisenar(cls, conTexto) {
    return '<button type="button" class="btn ds-entrada ' + (cls || "") + '" data-accion="disenar-escenario" title="' + esc(t({ es: "Diseñar escenario", en: "Design scenario" })) + '" aria-label="' + esc(t({ es: "Diseñar escenario", en: "Design scenario" })) + '">' +
      ico("quepasa", 14) + (conTexto === false ? "" : '<span>' + esc(t({ es: "Diseñar escenario", en: "Design scenario" })) + '</span>') + '</button>';
  }
  function engancharBarra() {
    var tb = document.getElementById("tb");
    if (!tb) return;
    var cab = tb.querySelector("#caso-panel .cp-cab");
    if (cab && !cab.querySelector(".ds-entrada")) {
      var x = cab.querySelector(".cp-cerrar");
      var w = document.createElement("span"); w.innerHTML = botonDisenar("prim ds-entrada-cp");
      cab.insertBefore(w.firstChild, x || null);
    }
    var pas = tb.querySelector(".pastilla");
    if (pas && !pas.parentNode.querySelector(".ds-entrada-pas")) {
      var w2 = document.createElement("span"); w2.innerHTML = botonDisenar("ds-entrada-pas", true);
      pas.parentNode.insertBefore(w2.firstChild, pas.nextSibling);
    }
  }
  function engancharInicio() {
    var ini = document.querySelector(".inicio");
    if (!ini || ini.querySelector(".ds-entrada-ini")) return;
    var d = document.createElement("div");
    d.className = "ds-entrada-ini";
    d.innerHTML = '<button type="button" class="ds-ini-btn" data-accion="disenar-escenario">' + ico("quepasa", 28) +
      '<span><b>' + esc(t({ es: "Diseñar escenario", en: "Design scenario" })) + '</b><small>' + esc(t({ es: "Partida · cuándo · qué pasa · operador · resultado", en: "Start · when · what happens · operator · result" })) + '</small></span>' + ico("der", 18) + '</button>';
    var cab = ini.querySelector(".ini-cab");
    if (cab && cab.nextSibling) ini.insertBefore(d, cab.nextSibling); else ini.insertBefore(d, ini.firstChild);
  }
  var tEng = 0;
  function engancharTodo() { clearTimeout(tEng); tEng = setTimeout(function () { engancharBarra(); engancharInicio(); }, 30); }
  if (NOC.on) {
    NOC.on("barra", engancharTodo);
    NOC.on("vista", engancharTodo);
    NOC.on("espacio", engancharTodo);
    NOC.on("resultado", function () { engancharTodo(); });
    NOC.on("lang", function () {
      $$(".ds-entrada, .ds-entrada-ini").forEach(function (x) { x.remove(); });
      engancharTodo(); if (UI.abierto) pintar();
    });
    NOC.on("modo", function () { if (UI.abierto) { desdeCaso(); pintar(); } });
    if (NOC.alNivel) { try { NOC.alNivel(function () { if (UI.abierto) pintar(); }); } catch (e) { /* nada */ } }
  }
  if (window.MutationObserver) {
    var vistas = document.getElementById("vistas");
    if (vistas) new MutationObserver(function () { if (!document.querySelector(".inicio .ds-entrada-ini") && document.querySelector(".inicio")) engancharTodo(); }).observe(vistas, { childList: true, subtree: true });
  }
  engancharTodo();

  NOC.escenarios = {
    abrir: abrir, cerrar: cerrar, alternar: function () { if (UI.abierto) cerrar(); else abrir(); },
    estado: function () { return { abierto: UI.abierto, paso: UI.paso, borrador: copia(D && { trafico: D.trafico, dia: D.dia, anio: D.anio, hora: D.hora, evento: D.evento, fallosBase: D.fallosBase, bloques: D.bloques, factores: D.factores }), validacion: D ? validar() : [] }; },
    irPaso: irPaso, volcar: volcar,
    // para pruebas y para otros módulos: aBloques/aEventos son la traducción eventos <-> bloques
    aBloques: aBloques, aEventos: aEventos
  };
})();
