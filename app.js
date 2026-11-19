// app.js — shell NOC de RED-MAD 2031 (CONTRATO_UI.md). Crea window.NOC; las vistas (vista_*.js) se registran solas.
// Barra superior (modo REF/LAB, constructor de casos, hora, KPI, alarmas, búsqueda, idioma), carril de capas A–H,
// pestañas de vista, ficha derecha, dock inferior (ALARMAS · ENLACES · N-1) y barra de estado.
(function () {
  "use strict";

  var RED = window.RED, Motor = window.Motor;
  var raiz = document.getElementById("noc");

  // ---------- utilidades ----------
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(s, el) { return (el || document).querySelector(s); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  var oyentes = {};
  function emitir(ev, dato) {
    (oyentes[ev] || []).forEach(function (fn) { try { fn(dato); } catch (e) { console.error("NOC." + ev, e); } });
  }

  // ---------- API pública (contrato) ----------
  // Si algún script se cargó antes que app.js y dejó secciones de carril en cola (window.NOC._colaCarril o
  // window.NOC_COLA_CARRIL), se recogen aquí y se montan al construir el carril.
  var previo = window.NOC || {};
  var colaCarril = [].concat(previo._colaCarril || [], window.NOC_COLA_CARRIL || []);
  var NOC = window.NOC = {
    lang: leer("noc.lang") === "en" ? "en" : "es",
    modo: leer("noc.modo") === "lab" ? "lab" : "ref",
    RED: RED,
    resultado: null,
    opciones: null,
    referencia: null,            // extensión: resultado de la referencia v7 (E-TABLA8), para los Δ
    seleccion: null,             // extensión: {tipo, id}
    capas: { A: true, B: true, C: true, D: true, E: true, F: true, G: true, H: true },   // extensión
    t: function (o) {
      if (o == null) return "";
      if (typeof o === "string") return o;
      return o[NOC.lang] != null ? o[NOC.lang] : (o.es != null ? o.es : "");
    },
    fmt: function (x, dec) {
      if (!esNum(x)) return "—";
      dec = dec || 0;
      return Number(x).toLocaleString(NOC.lang === "es" ? "es-ES" : "en-GB",
        { minimumFractionDigits: dec, maximumFractionDigits: dec });
    },
    on: function (ev, fn) { (oyentes[ev] = oyentes[ev] || []).push(fn); }
  };
  // Revisión 11: lo que dejó ui_comun.js (cargado antes) pasa al NOC definitivo (nivel, icono, info, color, medidor…)
  Object.keys(previo).forEach(function (k) { if (!(k in NOC) && k !== "_colaCarril") NOC[k] = previo[k]; });
  var t = NOC.t, fmt = NOC.fmt;
  var ico = function (k, n, o) { return NOC.icono ? NOC.icono(k, n, o) : ""; };
  var info = function (x, o) { return NOC.info ? NOC.info(x, o) : ""; };
  var corto = function (id) { return NOC.nombreCorto ? NOC.nombreCorto(id) : id; };

  // ---------- plegables (Revisión 2 punto 2): localStorage["noc.plegado"] = {id: true si plegado} ----------
  // Ids del shell: "caso" (barra del caso), "carril" (true = carril estrecho de 40 px), "ficha", "dock",
  // "sec:<id>" (sección del carril), "fs:<título>" (sección .ficha-sec, por título en minúsculas).
  // Revisión 10: espacios de trabajo. El activo va en la URL (#e=red) y en localStorage["noc.espacio"].
  var ESP_IDS = ["inicio", "red", "simulacion", "analisis", "datos", "guia"];
  function espDeHash() { var m = /[#&]e=([a-z]+)/.exec(location.hash || ""); return m && ESP_IDS.indexOf(m[1]) >= 0 && m[1] !== "guia" ? m[1] : null; }
  var ESP = espDeHash() || leer("noc.espacio");
  if (ESP_IDS.indexOf(ESP) < 0 || ESP === "guia") ESP = "inicio";
  // El dock se pliega por espacio ("dock@<espacio>"): abierto por defecto solo en SIMULACIÓN.
  function claveP(id) { return id === "dock" ? "dock@" + ESP : id; }
  var PLEG_DEF = { carril: true };
  var plegados = {};
  try { plegados = JSON.parse(leer("noc.plegado") || "{}") || {}; } catch (e) { plegados = {}; }
  NOC.plegado = function (id) {
    var k = claveP(id);
    if (k in plegados) return !!plegados[k];
    if (k.indexOf("dock@") === 0) return k !== "dock@simulacion";
    return !!PLEG_DEF[k];
  };
  NOC.plegar = function (id, valor) {
    if (!id) return false;
    if (id === "dock") { var vd = typeof valor === "boolean" ? valor : !NOC.plegado("dock"); plegados[claveP("dock")] = vd; guardar("noc.plegado", JSON.stringify(plegados)); aplicarPlegado("dock"); emitir("plegado", { id: "dock", plegado: vd }); return vd; }
    var v = typeof valor === "boolean" ? valor : !NOC.plegado(id);
    plegados[id] = v;
    guardar("noc.plegado", JSON.stringify(plegados));
    aplicarPlegado(id);
    emitir("plegado", { id: id, plegado: v });
    return v;
  };
  // Elementos genéricos: [data-plegable="id"] recibe la clase .plegado; [data-plegar="id"] alterna (lo engancha el clic delegado)
  function aplicarPlegadoGenerico(id, base) {
    Array.prototype.forEach.call((base || document).querySelectorAll('[data-plegable="' + String(id).replace(/"/g, '\\"') + '"]'), function (el) {
      el.classList.toggle("plegado", NOC.plegado(id));
    });
    Array.prototype.forEach.call((base || document).querySelectorAll('[data-plegar="' + String(id).replace(/"/g, '\\"') + '"]'), function (b) {
      b.setAttribute("aria-expanded", String(!NOC.plegado(id)));
      var ind = b.querySelector(".ind");
      if (ind) ind.textContent = NOC.plegado(id) ? "▸" : "▾";
    });
  }
  var aplicarPlegado = function (id) { aplicarPlegadoGenerico(id); };   // el shell la amplía al montarse

  // ---------- carril por secciones (Revisión 2 punto 3) ----------
  // NOC.registrarSeccionCarril({id, titulo:{es,en}, orden, montar(el), inicial?, icono?}). Puede llamarse antes o
  // después de montar el shell: se guarda en cola y se monta en cuanto exista el carril. montar(el) se llama una vez.
  var SECCIONES = [], montarSeccion = null;
  NOC.registrarSeccionCarril = function (s) {
    if (!s || !s.id) return;
    if (SECCIONES.some(function (x) { return x.def.id === s.id; })) return;
    var reg = { def: s, el: null, montada: false };
    SECCIONES.push(reg);
    SECCIONES.sort(function (a, b) { return (a.def.orden || 0) - (b.def.orden || 0); });
    if (montarSeccion) montarSeccion(reg);
  };
  NOC.seccionesCarril = function () { return SECCIONES.map(function (x) { return x.def.id; }); };

  if (!raiz) return;
  if (!RED || !Motor) {
    raiz.innerHTML = '<div class="error-carga">' + (!RED ? "red.js" : "motor.js") + ' no se pudo cargar / could not be loaded.</div>';
    return;
  }

  // ---------- textos ----------
  var T = {
    ref: { es: "Referencia · Entrega 2 (v7)", en: "Reference · Deliverable 2 (v7)" },
    lab: { es: "Laboratorio", en: "Laboratory" },
    rotRef: { es: "según Entrega 2 (v7) · 2031 · solo lectura", en: "as per Deliverable 2 (v7) · 2031 · read-only" },
    rotLab: { es: "cifras con Δ frente a la referencia v7", en: "figures with Δ vs. the v7 reference" },
    rotRefCorto: { es: "según Entrega 2 (v7) · 2031", en: "as per Deliverable 2 (v7) · 2031" },
    rotLabCorto: { es: "Δ frente a v7", en: "Δ vs. v7" },
    trafico: { es: "Tráfico", en: "Traffic" }, evento: { es: "Evento", en: "Event" }, fallo: { es: "Fallo", en: "Fault" },
    dia: { es: "Día", en: "Day" }, anio: { es: "Año", en: "Year" }, hora: { es: "Hora", en: "Hour" },
    hc: { es: "HC", en: "BH" }, hcLargo: { es: "hora cargada (todas las zonas en su pico)", en: "busy hour (all zones at peak)" },
    ninguno: { es: "— ninguno —", en: "— none —" },
    anadirFallo: { es: "+ añadir fallo…", en: "+ add fault…" },
    quitar: { es: "Quitar", en: "Remove" }, limpiar: { es: "Limpiar", en: "Clear" },
    buscar: { es: "Buscar elemento  /", en: "Find element  /" },
    kDl: { es: "DL total", en: "Total DL" }, kServ: { es: "Servido", en: "Served" },
    kOc: { es: "Ocup. máx.", en: "Max. occ." }, kAfect: { es: "Dem. afect.", en: "Aff. dem." },
    capas: { es: "Capas", en: "Layers" },
    alarmas: { es: "Alarmas", en: "Alarms" }, enlaces: { es: "Enlaces", en: "Links" }, n1: { es: "N-1", en: "N-1" },
    plegar: { es: "Plegar", en: "Collapse" }, desplegar: { es: "Desplegar", en: "Expand" },
    demanda: { es: "Demanda", en: "Demand" },
    sinSel: { es: "Sin selección. Clic en un elemento del mapa o de una tabla.", en: "No selection. Click an element on the map or in a table." },
    casoAct: { es: "Caso activo", en: "Active case" },
    bloqueado: { es: "Bloqueado en REFERENCIA: pasa a LABORATORIO para cambiar el caso.", en: "Locked in REFERENCE: switch to LABORATORY to change the case." },
    ejecutar: { es: "Ejecutar barrido", en: "Run sweep" },
    pendMotor: { es: "Barrido N-1 pendiente del motor (Motor.barridoN1 aún no existe).", en: "N-1 sweep pending in the engine (Motor.barridoN1 not available yet)." },
    n1Desc: { es: "Tumba cada elemento uno a uno con el tráfico del caso y ordena de peor a mejor.", en: "Fails each element one by one with the case traffic and sorts worst to best." },
    ejecutando: { es: "Ejecutando…", en: "Running…" },
    servicio: { es: "En servicio", en: "In service" }, caido: { es: "Caído", en: "Down" },
    simFallo: { es: "Simular fallo (F)", en: "Simulate fault (F)" }, quitarFallo: { es: "Quitar fallo (F)", en: "Clear fault (F)" },
    datos: { es: "Datos", en: "Data" }, carga: { es: "Carga calculada", en: "Computed load" }, fuente: { es: "Fuente", en: "Source" },
    estado: { es: "Estado", en: "Status" }, adyacentes: { es: "Enlaces adyacentes", en: "Adjacent links" },
    noEsp: { es: "no especificado en v7", en: "not specified in v7" },
    motorOk: { es: "MOTOR OK", en: "ENGINE OK" }, motorMal: { es: "MOTOR ERROR", en: "ENGINE ERROR" },
    demandas: { es: "demandas", en: "demands" }, supuestos: { es: "supuestos", en: "assumptions" },
    casosMotor: { es: "casos: motor", en: "cases: engine" }, casosLocal: { es: "casos: local (modelos.js)", en: "cases: local (modelos.js)" },
    atajos: { es: "fallo · carril · ficha · dock · buscar", en: "fault · rail · details · dock · find" },
    caso: { es: "Caso", en: "Case" }, plegarCaso: { es: "Plegar / desplegar la barra del caso", en: "Collapse / expand the case bar" },
    carril: { es: "Carril", en: "Rail" }, ficha: { es: "Ficha", en: "Details" },
    plegarCarril: { es: "Ensanchar / estrechar el carril  ([ o L)", en: "Widen / narrow the rail  ([ or L)" },
    plegarFicha: { es: "Plegar / desplegar la ficha  (])", en: "Collapse / expand the details panel  (])" },
    plegarDock: { es: "Plegar / desplegar el panel inferior  (\\)", en: "Collapse / expand the bottom panel  (\\)" },
    paramsDem: { es: "parámetros de demanda editados", en: "edited demand parameters" },
    espacios: { es: "Espacios de trabajo", en: "Workspaces" },
    cambiarCaso: { es: "Cambiar caso", en: "Change case" },
    abrirCaso: { es: "Ver y cambiar el caso: tráfico, día, año, evento y fallos", en: "View and change the case: traffic, day, year, event and faults" }
  };
  // Revisión 10: espacios de trabajo (orden = atajos 1–6)
  var ESPACIOS = [
    { id: "inicio", n: { es: "Inicio", en: "Home" }, d: { es: "Portada: estado de la red, caso activo y avisos.", en: "Start page: network status, active case and warnings." } },
    { id: "red", n: { es: "Red", en: "Network" }, d: { es: "Cómo es la red de 2031 y cómo va cargada: mapa, planos, capas y el recorrido de un paquete.", en: "What the 2031 network looks like and how loaded it is: map, diagrams, layers and a packet's path." } },
    { id: "simulacion", n: { es: "Simulación", en: "Simulation" }, d: { es: "Película de 24 h: reloj, eventos (fallos, ampliaciones, partidos) y modelo de demanda propio.", en: "24 h run: clock, events (faults, upgrades, matches) and own demand model." } },
    { id: "analisis", n: { es: "Análisis", en: "Analysis" }, d: { es: "Estudios: N-1, planificación 2026–2035, SLA y disponibilidad, comparador A/B, casos y modo defensa.", en: "Studies: N-1, 2026–2035 planning, SLA and availability, A/B compare, cases and defence mode." } },
    { id: "datos", n: { es: "Datos", en: "Data" }, d: { es: "De dónde sale cada cifra: trazabilidad hasta la fuente, interconexión, demanda y exportación.", en: "Where each figure comes from: lineage to the source, interconnection, demand and export." } },
    { id: "guia", n: { es: "Guía", en: "Guide" }, href: "guia.html", d: { es: "Cómo se usa el simulador y qué significa cada pantalla.", en: "How to use the simulator and what each screen means." } }
  ];
  function espPorId(id) { return ESPACIOS.filter(function (e) { return e.id === id; })[0]; }
  function gruposDe(x) { var g = x && x.grupo; return Array.isArray(g) ? g : g ? [g] : ["red"]; }
  function enEspacio(x, e) { return gruposDe(x).indexOf(e || ESP) >= 0; }
  var CAPAS = [
    { id: "A", n: { es: "Acceso radio (sitios 5G)", en: "Radio access (5G sites)" } },
    { id: "B", n: { es: "Acceso fijo (zonas FTTH)", en: "Fixed access (FTTH zones)" } },
    { id: "C", n: { es: "Agregación / backhaul", en: "Aggregation / backhaul" } },
    { id: "D", n: { es: "Metro / transporte DWDM", en: "Metro / DWDM transport" } },
    { id: "E", n: { es: "Core (DC)", en: "Core (DC)" } },
    { id: "F", n: { es: "Edge / MEC", en: "Edge / MEC" } },
    { id: "G", n: { es: "Interconexión (IX, IMS, L2VPN, NTN)", en: "Interconnection (IX, IMS, L2VPN, NTN)" } },
    { id: "H", n: { es: "Transversal (sinc., OSS): sin elementos en mapa", en: "Cross-cutting (sync, OSS): nothing on map" } }
  ];
  var TIPO_NODO = {
    core: { es: "DC core", en: "Core DC" }, metro: { es: "Nodo metro", en: "Metro node" }, edge: { es: "Edge (UPF/MEC)", en: "Edge (UPF/MEC)" },
    agg: { es: "Agregación", en: "Aggregation" }, ix: { es: "Interconexión (IX)", en: "Interconnection (IX)" }, site: { es: "Sitio de servicio", en: "Service site" }
  };
  var TIPO_ENL = {
    wdm: { es: "Anillo DWDM", en: "DWDM ring" }, mpls: { es: "MPLS", en: "MPLS" }, backhaul: { es: "Backhaul", en: "Backhaul" },
    ix: { es: "Peering / IX", en: "Peering / IX" }, sat: { es: "Satélite (NTN)", en: "Satellite (NTN)" }, acceso: { es: "Acceso de sitio", en: "Site access" }
  };
  // Nombres EN de los escenarios usados como eventos en el modo local
  var EV_EN = {
    "E-NORMAL": "Busy hour without match", "E-EVENTO": "Match at the Metropolitano (50,000 active)",
    "E-EVENTO-ESTRES": "Stress: special services ×2.07", "E-PUNTA-A2": "A-2 motorway rush hour",
    "E-ALARMA-VALDEBEBAS": "Mass alarm in Valdebebas (9,500 alerts in 1 s)", "NTN-ACTIVO": "Emergency satellite (NTN) active"
  };
  NOC.textos = T; NOC.CAPAS = CAPAS; NOC.TIPO_NODO = TIPO_NODO; NOC.TIPO_ENL = TIPO_ENL; NOC.esc = esc;

  // ---------- índices ----------
  var IDX = { nodos: {}, enlaces: {}, zonas: {}, servicios: {}, escenarios: {} };
  (RED.nodos || []).forEach(function (n) { IDX.nodos[n.id] = n; });
  (RED.enlaces || []).forEach(function (e) { IDX.enlaces[e.id] = e; });
  (RED.zonas || []).forEach(function (z) { IDX.zonas[z.id] = z; });
  (RED.servicios || []).forEach(function (s) { IDX.servicios[s.id] = s; });
  (RED.escenarios || []).forEach(function (s) { IDX.escenarios[s.id] = s; });
  NOC.idx = IDX;
  function nombre(id) { var o = IDX.nodos[id] || IDX.zonas[id] || IDX.servicios[id]; return (o && o.nombre) || id; }
  NOC.nombre = nombre;

  // Capa A–H de cada elemento (PLAN_v2 §2.1)
  function esInterconexion(id) { return /L2VPN|NTN/.test(id || ""); }
  NOC.capaNodo = function (n) {
    if (!n) return null;
    switch (n.tipo) {
      case "site": return esInterconexion(n.id) ? "G" : "A";
      case "agg": return "C"; case "metro": return "D"; case "core": return "E"; case "edge": return "F"; case "ix": return "G";
    }
    return "D";
  };
  NOC.capaEnlace = function (e) {
    if (!e) return null;
    var ta = (IDX.nodos[e.a] || {}).tipo, tb = (IDX.nodos[e.b] || {}).tipo;
    if (e.tipo === "acceso") return esInterconexion(e.a + e.b) ? "G" : "A";
    if (e.tipo === "backhaul") return "C";
    if (e.tipo === "ix" || e.tipo === "sat") return "G";
    if (ta === "edge" || tb === "edge") return "F";
    return "D";   // anillo DWDM y acometidas metro–DC
  };
  NOC.capaVisible = function (c) { return !c || NOC.capas[c] !== false; };

  // Origen del dato: entrega2 (v7) / anterior / supuesto
  NOC.origenDe = function (o) {
    if (!o) return "sin";
    if (o.origen === "entrega2") return "entrega2";
    if (o.origen === "anterior") return "anterior";
    if (o.origen === "supuesto" || o.supuesto) return "supuesto";
    return o.fuente || o.fuente_e2 ? "anterior" : "sin";
  };
  NOC.marcaOrigen = function (o) {
    var g = NOC.origenDe(o);
    if (g === "entrega2") return '<span class="marca doc">E2 v7</span>';
    if (g === "anterior") return '<span class="marca ant">' + t({ es: "DOC. ANTERIOR", en: "EARLIER DOC." }) + '</span>';
    if (g === "supuesto") return '<span class="marca sup">' + t({ es: "SUPUESTO", en: "ASSUMPTION" }) + '</span>';
    return '<span class="marca ant">' + t(T.noEsp) + '</span>';
  };
  NOC.claseDato = function (o) { var g = NOC.origenDe(o); return g === "supuesto" ? "dato-sup" : g === "sin" ? "" : "dato-doc"; };

  // Ocupación ofrecida (el motor recorta la carga a la capacidad; la demanda ofrecida dice cuánto se pasa)
  NOC.ocupacion = function (r) {
    if (!r || !esNum(r.capacidad_gbps) || r.capacidad_gbps <= 0) return null;
    var of = esNum(r.demanda_gbps) ? r.demanda_gbps / r.capacidad_gbps : 0;
    return Math.max(r.ocupacion || 0, of);
  };
  NOC.sevOcupacion = function (o, caido) {
    if (caido) return "unk";
    if (o == null) return "unk";
    return o > 1.0001 ? "crit" : o >= 0.85 ? "maj" : o >= 0.6 ? "min" : "ok";
  };
  var SEV_TXT = { crit: "CRIT", maj: "MAJ", min: "MIN", wrn: "WRN", ok: "OK", unk: "DOWN" };
  NOC.insignia = function (sev, txt) { return '<span class="sev sev-' + sev + '">' + (txt || SEV_TXT[sev]) + '</span>'; };

  // ---------- estado del caso (LAB) ----------
  var MT = RED.modelos_trafico || {};
  var CR = MT.crecimiento || {};
  var ANIO_MIN = CR.anio_min || 2025, ANIO_MAX = CR.anio_max || 2031;
  var caso = { trafico: "BH", dia: "laborable", anio: ANIO_MAX, hora: 21, evento: typeof Motor.casos === "function" ? "E-EVENTO" : "", fallos: [], eventos: [], modelo_usuario: null };   // eventos: Revisión 7 (operador.js); modelo_usuario: Revisión 8 (editor_modelo.js)
  try { var g0 = JSON.parse(leer("noc.caso") || "null"); if (g0) Object.keys(caso).forEach(function (k) { if (g0[k] != null) caso[k] = g0[k]; }); } catch (e) { /* nada */ }
  try { var c0 = JSON.parse(leer("noc.capas") || "null"); if (c0) Object.keys(NOC.capas).forEach(function (k) { if (typeof c0[k] === "boolean") NOC.capas[k] = c0[k]; }); } catch (e) { /* nada */ }
  NOC.caso = caso;
  function guardarCaso() { guardar("noc.caso", JSON.stringify(caso)); }

  // Ejes del constructor: Motor.casos(RED) si existe; si no, se construyen desde modelos.js y red.js
  function nomItem(x) {
    if (!x) return "";
    if (x.nombre && typeof x.nombre === "object") return t(x.nombre);
    if (x.nombre_es || x.nombre_en) return NOC.lang === "en" ? (x.nombre_en || x.nombre_es) : x.nombre_es;
    return x.nombre || x.titulo || x.id;
  }
  function ejesLocales() {
    var trafico = ((MT.modelos || []).slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); })).map(function (m) {
      return { id: m.id, nombre: { es: m.nombre_es, en: m.nombre_en || m.nombre_es }, origen: m.origen, cargada: !!m.hora_cargada };
    });
    var ev = [{ id: "", nombre: T.ninguno }];
    ["E-NORMAL", "E-EVENTO", "E-EVENTO-ESTRES", "E-PUNTA-A2", "E-ALARMA-VALDEBEBAS"].forEach(function (id) {
      var e = IDX.escenarios[id];
      if (e) ev.push({ id: id, nombre: { es: e.nombre, en: EV_EN[id] || e.nombre }, factores: e.factores || {}, origen: "documento" });
    });
    var ntn = IDX.escenarios["E-INCIDENTE-NTN"];
    if (ntn) ev.push({ id: "NTN-ACTIVO", nombre: { es: "Satélite de emergencia (NTN) activo", en: EV_EN["NTN-ACTIVO"] }, factores: { "S-NTN-EMERGENCIA": 1 } });
    var grupos = [
      { n: { es: "Corte de fibra · anillo", en: "Fibre cut · ring" }, f: function (e) { return e.tipo === "wdm"; }, k: "e" },
      { n: { es: "Acometidas a DC", en: "DC uplinks" }, f: function (e) { return e.tipo === "mpls" && /CORE/.test(e.id); }, k: "e" },
      { n: { es: "Caída de DC", en: "DC outage" }, f: function (n) { return n.tipo === "core"; }, k: "n" },
      { n: { es: "Caída de nodo metro", en: "Metro node outage" }, f: function (n) { return n.tipo === "metro"; }, k: "n" },
      { n: { es: "Caída de edge", en: "Edge outage" }, f: function (n) { return n.tipo === "edge"; }, k: "n" },
      { n: { es: "Interconexión", en: "Interconnection" }, f: function (n) { return n.tipo === "ix"; }, k: "n" },
      { n: { es: "Backhaul de agregación", en: "Aggregation backhaul" }, f: function (e) { return e.tipo === "backhaul"; }, k: "e" },
      { n: { es: "Acceso de sitios", en: "Site access" }, f: function (e) { return e.tipo === "acceso"; }, k: "e" }
    ];
    var fallo = [];
    grupos.forEach(function (g) {
      ((g.k === "e" ? RED.enlaces : RED.nodos) || []).filter(g.f).forEach(function (x) {
        fallo.push({ id: x.id, grupo: g.n, nombre: x.nombre ? x.id + " · " + x.nombre : x.id });
      });
    });
    return { fuente: "local", trafico: trafico, evento: ev, fallo: fallo };
  }
  // Motor.casos(RED) -> {trafico:[{id,es,en,origen,hora_cargada,usa_hora}], evento:[{id,es,en,hora}],
  //   fallo:[{id,es,en,elementos:[{id,clase,nombre}]}], dias, predefinidos, rutas}
  function ejes() {
    if (typeof Motor.casos === "function") {
      try {
        var c = Motor.casos(RED);
        if (c) {
          var L = ejesLocales();
          var tr = (c.trafico || []).map(function (x) {
            return { id: x.id, nombre: { es: x.es || x.id, en: x.en || x.es || x.id }, origen: x.origen, fuente: x.fuente,
              cargada: x.usa_hora === false || (x.usa_hora == null && !!x.hora_cargada) };
          });
          var ev = (c.evento || []).map(function (x) {
            var en = x.en && x.en !== x.es ? x.en : (EV_EN[x.id] || x.en || x.es);
            return { id: x.id, nombre: { es: x.es || x.id, en: en || x.id }, hora: x.hora };
          });
          var fa = [];
          (c.fallo || []).forEach(function (g) {
            (g.elementos || []).forEach(function (el) {
              fa.push({ id: el.id, clase: el.clase, grupo: { es: g.es || g.id, en: g.en || g.es || g.id }, nombre: el.id + (el.nombre ? " · " + el.nombre : "") });
            });
          });
          return { fuente: "motor", trafico: tr.length ? tr : L.trafico, evento: ev.length ? ev : L.evento,
            fallo: fa.length ? fa : L.fallo, crudo: c };
        }
      } catch (e) { console.warn("Motor.casos falló; se usan los ejes locales", e); }
    }
    return ejesLocales();
  }
  var EJES = ejes();
  function itemPorId(lista, id) { for (var i = 0; i < (lista || []).length; i++) if ((lista[i].id || "") === (id || "")) return lista[i]; return null; }
  function traficoCargado() {
    var it = itemPorId(EJES.trafico, caso.trafico);
    if (it && typeof it.cargada === "boolean") return it.cargada;
    var m = (MT.modelos || []).filter(function (x) { return x.id === caso.trafico; })[0];
    return m ? !!m.hora_cargada : true;
  }

  // Parámetros de demanda editados en demanda.html (solo LAB)
  function aplicarParamsDemanda() {
    RED.demanda = null;
    NOC.paramsEditados = 0;
    if (NOC.modo !== "lab" || !window.ModeloDemanda) return;
    try {
      var g = JSON.parse(leer("dem.params") || "{}"), ks = Object.keys(g);
      if (!ks.length) return;
      var P = window.ModeloDemanda.copia(window.ModeloDemanda.PARAMETROS_DEFECTO);
      ks.forEach(function (k) { if (k in P) P[k] = g[k]; });
      RED.demanda = { parametros: P };
      NOC.paramsEditados = ks.length;
    } catch (e) { /* sin parámetros */ }
  }

  // Referencia v7 (matriz A11): hora cargada coincidente con el estadio activo. Sin Motor.casos, E-TABLA8 (equivalente).
  var HAY_CASOS = typeof Motor.casos === "function";
  var OPC_REF = HAY_CASOS ? { caso: { trafico: "BH", evento: "E-EVENTO" } } : { escenario: "E-TABLA8" };
  var EV_REF = HAY_CASOS ? "E-EVENTO" : "";
  // Revisión 8 (editor_modelo.js): el modelo de demanda del usuario (solo LAB) va en las opciones de calcular y de la serie
  function opcionesCaso() {
    var op = opcionesCasoBase();
    if (NOC.modo === "lab" && caso.modelo_usuario && typeof caso.modelo_usuario === "object") op.modelo_usuario = copia(caso.modelo_usuario);
    return op;
  }
  NOC.aplicarModelo = function (mu) {
    caso.modelo_usuario = mu && typeof mu === "object" ? mu : null;
    guardarCaso();
    if (NOC.modo === "lab") { pintarBarra(); aplicarCaso(); }
    return NOC.resultado;
  };
  NOC.opcionesCaso = function () { return opcionesCaso(); };
  function opcionesCasoBase() {
    if (NOC.modo === "ref") return copia(OPC_REF);
    var ev = itemPorId(EJES.evento, caso.evento), cargado = traficoCargado();
    if (EJES.fuente === "motor") {
      var tr = { id: caso.trafico, anio: caso.anio, dia: caso.dia };
      if (!cargado) tr.hora = caso.hora;
      return { caso: { trafico: tr, evento: caso.evento || "ninguno", fallo: caso.fallos.slice() } };
    }
    // Modo local. Modelos de hora cargada: sobre el escenario de dimensionado E-TABLA8 (como la v7).
    // Modelos horarios (NC, PEND): sin escenario, para que manden la hora y el tipo de día.
    var op = { modelo: { id: caso.trafico, anio: caso.anio, dia: caso.dia }, fallos: caso.fallos.slice() };
    if (cargado) op.escenario = "E-TABLA8"; else op.hora = caso.hora;
    if (ev && ev.factores && Object.keys(ev.factores).length) op.factores = copia(ev.factores);
    return op;
  }

  // ---------- cálculo ----------
  var motorOK = true, motorMs = 0, motorErr = "";
  function calcular(op) {
    var t0 = (window.performance || Date).now();
    try {
      NOC.resultado = Motor.calcular(RED, op);
      NOC.opciones = op;
      motorOK = true; motorErr = "";
    } catch (e) {
      motorOK = false; motorErr = String(e && e.message || e);
      console.error("Motor.calcular", e, op);
    }
    motorMs = Math.round((window.performance || Date).now() - t0);
    construirAlarmas();
    pintarKPI(); pintarDock(); pintarEstado(); pintarContador();
    refrescarFicha();
    emitir("resultado", NOC.resultado);
  }
  function aplicarCaso() { calcular(opcionesCaso()); }
  // Revisión 4 (reloj.js): pinta un resultado ya calculado (un paso de la serie de 24 h) sin llamar al motor.
  // meta.reloj = true marca el evento "resultado" para que el reloj no lo tome como cambio de caso.
  NOC.mostrarResultado = function (r, op, meta) {
    if (!r) return;
    NOC.resultado = r;
    if (op) NOC.opciones = op;
    NOC.resultadoMeta = meta || null;
    motorOK = true; motorErr = "";
    construirAlarmas();
    pintarKPI(); pintarDock(); pintarEstado(); pintarContador();
    refrescarFicha();
    emitir("resultado", NOC.resultado);
    NOC.resultadoMeta = null;
  };
  NOC.recalcular = function (parcial) {
    if (NOC.modo === "ref") {
      if (parcial && Object.keys(parcial).length) mensaje(t(T.bloqueado));
      calcular(opcionesCaso());
      return;
    }
    var o = copia(NOC.opciones || opcionesCaso());
    Object.keys(parcial || {}).forEach(function (k) { o[k] = parcial[k]; });
    calcular(o);
  };

  // ---------- alarmas ----------
  var ALARMAS = [];
  var RANGO = { crit: 0, maj: 1, min: 2, wrn: 3, ok: 4, unk: 5 };
  function sevAlerta(a) {
    var x = a.texto || "";
    if (a.nivel === "grave") return "crit";
    if (a.nivel === "aviso") return /recortan/.test(x) ? "maj" : "min";
    if (/sin incidencias|no afecta/.test(x)) return "ok";
    return "wrn";
  }
  function elementoAlerta(x) {
    var m = x.match(/\b(L-[A-Z0-9-]+)/);
    if (m && IDX.enlaces[m[1]]) return m[1];
    var mejor = null;
    (RED.nodos || []).forEach(function (n) {
      if (n.nombre && x.indexOf(n.nombre) >= 0 && (!mejor || n.nombre.length > IDX.nodos[mejor].nombre.length)) mejor = n.id;
      else if (x.indexOf(n.id) >= 0 && !mejor) mejor = n.id;
    });
    return mejor;
  }
  // Las alertas del motor vienen en castellano: traducción por patrones conocidos
  function trAlerta(x) {
    if (NOC.lang === "es") return x;
    function dem(n, s, p) { return n + " " + (n === "1" ? s : p); }
    function quien(q) { return q.replace(/^prioridades/, "priorities").replace(/^prioridad/, "priority"); }
    function elem(s) { return s.replace(/^Enlace /, "Link ").replace(/^Nodo /, "Node "); }
    var m;
    if ((m = x.match(/^(.+) al (\S+) %: se recortan (\S+) Gbit\/s de (.+)$/))) return elem(m[1]) + " at " + m[2] + " %: " + m[3] + " Gbit/s of " + quien(m[4]) + " trimmed";
    if ((m = x.match(/^(.+) caído: (\d+) demandas? migran? a (.+) \((.+)\)$/))) return elem(m[1]) + " down: " + dem(m[2], "demand migrates", "demands migrate") + " to " + m[3] + " (" + m[4] + ")";
    if ((m = x.match(/^(.+) caído: (\d+) demandas? reencaminadas? \((.+)\)$/))) return elem(m[1]) + " down: " + dem(m[2], "demand rerouted", "demands rerouted") + " (" + m[3] + ")";
    if ((m = x.match(/^(.+) caído: no afecta a ninguna demanda$/))) return elem(m[1]) + " down: no demand affected";
    if ((m = x.match(/^(\d+) demandas? sin ruta \((\S+) Gbit\/s perdidos\): (.+)$/))) return dem(m[1], "demand", "demands") + " without route (" + m[2] + " Gbit/s lost): " + m[3];
    if ((m = x.match(/^(\d+) demandas? superan? su latencia máxima \(p\. ej\. (.+)\)$/))) return dem(m[1], "demand exceeds", "demands exceed") + " max. latency (e.g. " + m[2] + ")";
    if ((m = x.match(/^Red sin incidencias: (\S+) % de la demanda servida$/))) return "No incidents: " + m[1] + " % of demand served";
    return x;
  }
  function construirAlarmas() {
    ALARMAS = [];
    var r = NOC.resultado;
    if (!r) {
      ALARMAS.push({ sev: "crit", elem: null, texto: t({ es: "Error del motor: ", en: "Engine error: " }) + motorErr, fuente: "motor" });
      return;
    }
    var conAlarma = {};
    (r.resumen.alertas || []).forEach(function (a) {
      var el = elementoAlerta(a.texto || "");
      if (el) conAlarma[el] = true;
      ALARMAS.push({ sev: sevAlerta(a), elem: el, texto: trAlerta(a.texto || ""), fuente: "motor" });
    });
    // Umbral de operación: enlaces entre 85 y 100 % sin recorte (v7 admite 0,90 en el pico P2)
    Object.keys(r.enlaces || {}).forEach(function (id) {
      var e = r.enlaces[id], o = NOC.ocupacion(e);
      if (e.caido || o == null || o < 0.85 || o > 1.0001 || conAlarma[id]) return;
      ALARMAS.push({ sev: "maj", elem: id, fuente: "umbral",
        texto: t({ es: "Enlace " + id + " al " + fmt(o * 100, 1) + " % (umbral de operación 85 %)",
          en: "Link " + id + " at " + fmt(o * 100, 1) + " % (operating threshold 85 %)" }) });
    });
    ALARMAS.sort(function (a, b) { return RANGO[a.sev] - RANGO[b.sev]; });
  }
  function cuentaSev() {
    var c = { crit: 0, maj: 0, min: 0, wrn: 0 };
    ALARMAS.forEach(function (a) { if (a.sev in c) c[a.sev]++; });
    return c;
  }
  NOC.alarmas = function () { return ALARMAS.slice(); };

  // ---------- esqueleto ----------
  var ICO = {
    candado: '<svg class="ico candado" viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>',
    lupa: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><circle cx="5" cy="5" r="3.2"/><path d="M7.5 7.5 10.5 10.5"/></svg>',
    play: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2 10 6 3 10Z" fill="currentColor" stroke="none"/></svg>',
    pausa: '<svg class="ico" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" stroke="none"/></svg>'
  };
  raiz.innerHTML =
    '<header class="tb" id="tb"></header>' +
    '<nav class="rail" id="rail" aria-label="Carril"><button type="button" class="rail-cab" id="rail-cab" data-plegar="carril"></button><div class="rail-secs" id="rail-secs"></div></nav>' +
    '<main class="centro"><div class="tabs" id="tabs" role="tablist"></div><div class="vistas" id="vistas"></div></main>' +
    '<aside class="ficha" id="ficha"><button type="button" class="ficha-tira" id="ficha-tira" data-plegar="ficha"></button><div class="ficha-cab" id="ficha-cab"></div><div class="ficha-cuerpo" id="ficha-cuerpo"></div></aside>' +
    '<section class="dock" id="dock"><div class="dock-cab" id="dock-cab"></div><div class="dock-cuerpo" id="dock-cuerpo"></div></section>' +
    '<footer class="sb" id="sb"></footer>' +
    '<datalist id="noc-lista"></datalist>';

  // ---------- barra superior ----------
  function opt(v, txt, sel, extra) { return '<option value="' + esc(v) + '"' + (sel ? " selected" : "") + (extra || "") + '>' + esc(txt) + '</option>'; }
  function selectEje(eje, lista, valor, conGrupos) {
    var h = "";
    if (conGrupos) {
      var grupo = null;
      h += opt("", t(T.anadirFallo), true);
      lista.forEach(function (x) {
        var g = x.grupo ? t(x.grupo) : "";
        if (g !== grupo) { if (grupo !== null) h += '</optgroup>'; h += '<optgroup label="' + esc(g) + '">'; grupo = g; }
        var ya = caso.fallos.indexOf(x.id) >= 0;
        h += opt(x.id, (ya ? "× " : "") + nomItem(x), false);
      });
      if (grupo !== null) h += '</optgroup>';
    } else {
      lista.forEach(function (x) { h += opt(x.id || "", nomItem(x) + (x.origen === "supuesto" ? " (" + t({ es: "supuesto", en: "assumption" }) + ")" : ""), (x.id || "") === (valor || "")); });
      // Evento puesto desde la vista de casos que no está en la lista (p. ej. un escenario como E-INCIDENTE-NTN)
      if (valor && !itemPorId(lista, valor)) {
        var esc0 = (RED.escenarios || []).filter(function (s) { return s.id === valor; })[0];
        h += opt(valor, esc0 && esc0.nombre ? esc0.nombre : valor, true);
      }
    }
    return '<select class="sel" data-eje="' + eje + '" aria-label="' + esc(t(T[eje] || { es: eje })) + '">' + h + '</select>';
  }
  function pintarBarra() {
    var ref = NOC.modo === "ref", dis = ref ? " disabled" : "";
    var dias = MT.tipos_dia || {}, hDia = "";
    Object.keys(dias).filter(function (k) { return k[0] !== "_"; }).forEach(function (k) {
      hDia += opt(k, NOC.lang === "en" ? (dias[k].nombre_en || dias[k].nombre_es) : dias[k].nombre_es, k === caso.dia);
    });
    var hAnio = "";
    for (var a = ANIO_MIN; a <= ANIO_MAX; a++) hAnio += opt(a, a, ref ? a === 2031 : a === Number(caso.anio));
    var cargado = ref || traficoCargado();
    var chips = ref ? "" : caso.fallos.map(function (id) {
      return '<span class="chip fallo" title="' + esc(nombre(id)) + '">' + esc(id) + '<button type="button" data-accion="quitar-fallo" data-id="' + esc(id) + '" aria-label="' + esc(t(T.quitar)) + '">×</button></span>';
    }).join("");
    var trafRef = ref ? '<select class="sel" disabled>' + opt("BH", nomItem(itemPorId(EJES.trafico, "BH")) || "BH", true) + '</select>' : selectEje("trafico", EJES.trafico, caso.trafico);
    var evRef = ref ? '<select class="sel" disabled>' + opt(EV_REF, itemPorId(EJES.evento, EV_REF) ? nomItem(itemPorId(EJES.evento, EV_REF)) : t(T.ninguno), true) + '</select>' : selectEje("evento", EJES.evento, caso.evento);
    var faRef = ref ? '<select class="sel" disabled>' + opt("", t(T.ninguno), true) + '</select>' : selectEje("fallo", EJES.fallo, null, true);

    var nav = ESPACIOS.map(function (e, i) {
      var cur = e.id === ESP;
      return (e.href ? '<a class="esp-b ext" href="' + e.href + '"' : '<button type="button" class="esp-b" data-espacio="' + e.id + '"' + (cur ? ' aria-current="page"' : '')) +
        ' title="' + esc(t(e.d)) + ' (' + (i + 1) + ')">' + ico(e.id, 16) + '<kbd class="solo-experto">' + (i + 1) + '</kbd><span>' + esc(t(e.n)) + '</span>' + (e.href ? '</a>' : '</button>');
    }).join("");
    $("#tb").innerHTML =
      '<div class="tb-f tb-top">' +
        '<button class="btn solo-estrecho" type="button" data-accion="rail-movil">' + esc(t(T.capas)) + '</button>' +
        '<span class="marca-red" title="RED-MAD 2031 · NOC · 5G + FTTH">RED-MAD 2031<small>NOC · 5G + FTTH</small></span>' +
        '<div class="modo" role="group" aria-label="Modo">' +
          '<button type="button" data-modo="ref" aria-pressed="' + ref + '" title="' + esc(t(T.ref) + " · " + t(T.rotRef)) + '">' + ICO.candado.replace("candado", "") + '<span class="largo">' + esc(t(T.ref)) + '</span><span class="corto">REF · v7</span></button>' +
          '<button type="button" data-modo="lab" aria-pressed="' + !ref + '" title="' + esc(t(T.lab) + " · " + t(T.rotLab)) + '"><span class="largo">' + esc(t(T.lab)) + '</span><span class="corto">LAB</span></button>' +
        '</div>' +
        '<nav class="espacios" aria-label="' + esc(t(T.espacios)) + '">' + nav + '</nav>' +
        '<span class="esp"></span>' +
        '<span class="buscar">' + ICO.lupa + '<input type="search" id="buscar" list="noc-lista" placeholder="' + esc(t(T.buscar)) + '" aria-label="' + esc(t(T.buscar)) + '"></span>' +
        '<button type="button" class="btn" data-accion="exportar" aria-pressed="false" title="' + esc(t({ es: "Exportar tablas CSV (.zip) o informe PDF", en: "Export CSV tables (.zip) or PDF report" })) + '">' + esc(t({ es: "Exportar", en: "Export" })) + '</button>' +
        (NOC.interruptorNivel ? NOC.interruptorNivel() : '') +
        '<div class="seg" role="group" aria-label="Idioma / Language"><button type="button" data-lang="es" aria-pressed="' + (NOC.lang === "es") + '">ES</button><button type="button" data-lang="en" aria-pressed="' + (NOC.lang === "en") + '">EN</button></div>' +
      '</div>' +
      '<div class="tb-f tb-kpi">' +
        '<div class="pastilla' + (casoAbierto ? " abierta" : "") + '">' +
          '<button type="button" class="pas-btn" data-accion="caso-panel" aria-expanded="' + casoAbierto + '" aria-controls="caso-panel" title="' + esc(t(T.abrirCaso)) + '">' +
            '<span class="rot">' + esc(t(T.caso)) + '</span><b class="pas-modo">' + (ref ? ICO.candado : "") + (ref ? "REF" : "LAB") + '</b>' +
            '<span class="caso-resumen">' + esc(resumenCaso()) + '</span><span class="pas-hora mono" id="pas-hora"></span><span class="ind">' + (casoAbierto ? "▴" : "▾") + '</span>' +
          '</button>' +
        '</div>' +
        '<div class="kpis" id="kpis"></div>' +
        '<button type="button" class="cnt-alarmas" id="cnt-alarmas" data-accion="ver-alarmas" title="' + esc(t(T.alarmas)) + '"></button>' +
      '<div class="caso-panel" id="caso-panel"' + (casoAbierto ? "" : " hidden") + ' role="group" aria-label="' + esc(t(T.casoAct)) + '">' +
        '<div class="cp-cab"><span class="lbl">' + esc(t(T.casoAct)) + '</span>' +
        '<span class="rotulo-modo" title="' + esc(t(ref ? T.rotRef : T.rotLab)) + '"><b>' + (ref ? ICO.candado : "") + (ref ? "REF" : "LAB") + '</b> ' + esc(t(ref ? T.rotRef : T.rotLab)) +
          (!ref && NOC.paramsEditados ? ' · <a href="demanda.html">' + NOC.paramsEditados + " " + esc(t(T.paramsDem)) + '</a>' : '') + '</span>' +
        '<button type="button" class="btn cp-cerrar" data-accion="caso-panel" aria-label="×" title="Esc">×</button></div>' +
        (ref ? '<p class="nota cp-nota">' + esc(t(T.bloqueado)) + ' <button type="button" class="btn" data-modo="lab">' + esc(t({ es: "Pasar a LABORATORIO", en: "Switch to LABORATORY" })) + '</button></p>' : '') +
        '<div class="caso">' +
          '<span class="eje"><span class="rot">' + esc(t(T.trafico)) + '</span>' + trafRef + '</span>' +
          '<select class="sel sel-dia" data-eje="dia"' + dis + ' title="' + esc(t(T.dia)) + '" aria-label="' + esc(t(T.dia)) + '">' + hDia + '</select>' +
          '<select class="sel sel-anio" data-eje="anio"' + dis + ' title="' + esc(t(T.anio)) + '" aria-label="' + esc(t(T.anio)) + '">' + hAnio + '</select>' +
          '<span class="sep"></span>' +
          '<span class="eje"><span class="rot">' + esc(t(T.evento)) + '</span>' + evRef + '</span>' +
          '<span class="sep"></span>' +
          '<span class="eje"><span class="rot">' + esc(t(T.fallo)) + '</span>' + faRef + '</span>' +
          '<span class="fallos-act">' + chips + (chips ? '<button class="btn" type="button" data-accion="limpiar-fallos">' + esc(t(T.limpiar)) + '</button>' : '') + '</span>' +
          '<span class="sep"></span>' +
          '<span class="hora" title="' + esc(cargado ? t(T.hcLargo) : t(T.hora)) + '"><span class="rot">' + esc(t(T.hora)) + '</span>' +
            '<button class="btn" type="button" data-accion="play" aria-label="Play"' + (cargado ? " disabled" : "") + '>' + (timerHora ? ICO.pausa : ICO.play) + '</button>' +
            '<input type="range" min="0" max="23" step="1" id="rng-hora" value="' + (cargado ? 21 : caso.hora) + '"' + (cargado ? " disabled" : "") + '>' +
            '<output class="mono" id="out-hora">' + (cargado ? t(T.hc) + " " : "") + String(cargado ? 21 : caso.hora).padStart(2, "0") + ':00</output></span>' +
        '</div>' +
        '<p class="nota tx3 cp-pie solo-experto">' + esc(t({ es: "La hora y la película de 24 h se manejan en SIMULACIÓN (reloj y eventos).", en: "The hour and the 24 h run are handled in SIMULATION (clock and events)." })) + '</p>' +
      '</div></div>' +
      '<div class="tb-f tb-sim" id="tb-sim"></div>';
    document.body.classList.toggle("m-ref", ref);
    document.body.classList.toggle("m-lab", !ref);
    pintarKPI(); pintarContador();
    emitir("barra", $("#tb"));   // Revisión 4: reloj.js sustituye aquí el control HORA
    colocarExtras();
  }
  // Revisión 10: lo que otros módulos meten en la barra (reloj.js tras .caso, editor_modelo.js antes de .caso-resumen)
  // se recoloca en la fila de SIMULACIÓN. Un MutationObserver lo repite si lo vuelven a montar.
  var casoAbierto = false;
  function colocarExtras() {
    var tb = $("#tb"), sim = $("#tb-sim");
    if (!tb || !sim) return;
    var rl = tb.querySelector("#reloj"), em = tb.querySelector(".em-btn");
    if (rl && rl.parentNode !== sim) sim.insertBefore(rl, sim.firstChild);
    if (em && em.parentNode !== sim) sim.appendChild(em);
    var op = tb.querySelector(".op-fila");
    if (op && op.previousElementSibling !== sim) tb.appendChild(op);
  }
  if (window.MutationObserver) {
    new MutationObserver(function () { colocarExtras(); }).observe($("#tb"), { childList: true, subtree: true });
  }
  function alternarCasoPanel(v) {
    casoAbierto = typeof v === "boolean" ? v : !casoAbierto;
    var p = $("#caso-panel"), b = $(".pas-btn");
    if (p) p.hidden = !casoAbierto;
    if (b) { b.setAttribute("aria-expanded", String(casoAbierto)); var i = b.querySelector(".ind"); if (i) i.textContent = casoAbierto ? "▴" : "▾"; b.parentNode.classList.toggle("abierta", casoAbierto); }
  }
  NOC.abrirCaso = function () { alternarCasoPanel(true); };
  // Una línea con el caso para cuando la barra del caso está plegada
  function resumenCaso() {
    var ref = NOC.modo === "ref";
    var tr = itemPorId(EJES.trafico, ref ? "BH" : caso.trafico), ev = itemPorId(EJES.evento, ref ? EV_REF : caso.evento);
    var cargado = ref || traficoCargado();
    var p = [tr ? nomItem(tr) : caso.trafico];
    if (!ref) p.push((((MT.tipos_dia || {})[caso.dia] || {})[NOC.lang === "en" ? "nombre_en" : "nombre_es"] || caso.dia) + " " + caso.anio);
    else p.push("2031");
    p.push(cargado ? t(T.hc) : String(caso.hora).padStart(2, "0") + ":00");
    p.push(ev && ev.id && ev.id !== "ninguno" ? nomItem(ev) : t(T.evento) + ": " + t(T.ninguno));
    var nf = ref ? 0 : caso.fallos.length;
    p.push(nf ? nf + " " + t({ es: nf === 1 ? "fallo" : "fallos", en: nf === 1 ? "fault" : "faults" }) + " (" + caso.fallos.join(", ") + ")" : t({ es: "sin fallos", en: "no faults" }));
    return p.join(" · ");
  }
  function pintarContador() {
    var el = $("#cnt-alarmas");
    if (!el) return;
    var c = cuentaSev();
    var nz = ["crit", "maj", "min", "wrn"].filter(function (s) { return c[s] > 0; });
    el.innerHTML = '<span class="rot">' + esc(t(T.alarmas)) + '</span>' + (nz.length ? nz.map(function (s) { return NOC.insignia(s, SEV_TXT[s] + " " + c[s]); }).join("") : NOC.insignia("ok", "OK"));
    el.title = ["crit", "maj", "min", "wrn"].map(function (s) { return SEV_TXT[s] + " " + c[s]; }).join(" · ");
  }

  function delta(v, r, dec, peorSiSube, unidad) {
    if (!esNum(v) || !esNum(r)) return "";
    var d = v - r;
    if (Math.abs(d) < Math.pow(10, -(dec || 0)) / 2) return '<span class="d">Δ 0</span>';
    var cls = peorSiSube == null ? "" : ((d > 0) === peorSiSube ? " peor" : " mejor");
    return '<span class="d' + cls + '">Δ ' + (d > 0 ? "+" : "−") + fmt(Math.abs(d), dec) + (unidad || "") + '</span>';
  }
  function ocMax(r) {
    var mx = null, id = null, sat = 0;
    if (!r) return { o: null, id: null, sat: 0 };
    Object.keys(r.enlaces || {}).forEach(function (k) {
      var e = r.enlaces[k], o = NOC.ocupacion(e);
      if (e.caido || o == null) return;
      if (o > 1.0001) sat++;
      if (mx == null || o > mx) { mx = o; id = k; }
    });
    return { o: mx, id: id, sat: sat };
  }
  NOC.ocupacionMaxima = ocMax;
  function pintarKPI() {
    var ph = $("#pas-hora");
    if (ph) { var pr = NOC.resultado && NOC.resultado.paso_reloj; ph.textContent = pr ? "▶ " + pr.etiqueta : ""; ph.hidden = !pr; }
    if (ESP === "inicio" && elInicio) pintarInicio();
    var el = $("#kpis");
    if (!el) return;
    var r = NOC.resultado, R0 = NOC.referencia;
    if (!r) { el.innerHTML = '<div class="kpi"><span class="rot">' + esc(t(T.motorMal)) + '</span></div>'; return; }
    var s = r.resumen, s0 = R0 ? R0.resumen : null, m = ocMax(r), m0 = ocMax(R0);
    var ref = NOC.modo === "ref";
    function k(rot, v, d, tit, cls) {
      return '<div class="kpi' + (cls ? " " + cls : "") + '"' + (tit ? ' title="' + esc(tit) + '"' : '') + '><span class="rot">' + rot + '</span><span class="v">' + v + '</span>' + (ref ? "" : d) + '</div>';
    }
    el.innerHTML =
      k(esc(t(T.kDl)), fmt(s.dl_total_gbps, 0) + ' <small>Gbit/s</small>', s0 ? delta(s.dl_total_gbps, s0.dl_total_gbps, 0, null) : "") +
      k(esc(t(T.kServ)), fmt(s.pct_servida, 2) + ' <small>%</small>', s0 ? delta(s.pct_servida, s0.pct_servida, 2, false, " pp") : "") +
      k(esc(t(T.kOc)) + ' <span class="mono kpi-id solo-experto">' + esc(m.id || "") + '</span><span class="kpi-id solo-simple">' + esc(corto(m.id || "")) + '</span>',
        (m.o == null ? "—" : (NOC.icono ? '<span class="sev-' + NOC.sevOcupacion(m.o) + '">' + ico(NOC.sevOcupacion(m.o), 16) + '</span> ' : '') + '<span class="sev-' + NOC.sevOcupacion(m.o) + '">' + fmt(m.o * 100, 1) + '</span>') + ' <small>%</small>',
        s0 && m0.o != null && m.o != null ? delta(m.o * 100, m0.o * 100, 1, true, " pp") : "", m.id ? m.id + " · " + corto(m.id) + " · " + (NOC.sevOcupacion(m.o) || "").toUpperCase() : "") +
      k(esc(t(T.kAfect)), fmt(s.demandas_afectadas, 0) + ' <small>/ ' + fmt((r.demandas || []).length, 0) + '</small>', s0 ? delta(s.demandas_afectadas, s0.demandas_afectadas, 0, true) : "", "", "solo-experto") +
      k(esc(t({ es: "Enl. > 100 %", en: "Links > 100 %" })), '<span class="' + (m.sat ? "sev-crit" : "") + '">' + fmt(m.sat, 0) + '</span>', s0 ? delta(m.sat, m0.sat, 0, true) : "", "", m.sat ? "" : "solo-experto");
  }

  // ---------- carril de capas ----------
  function cuentaCapa(c) {
    var n = 0;
    (RED.nodos || []).forEach(function (x) { if (NOC.capaNodo(x) === c) n++; });
    (RED.enlaces || []).forEach(function (x) { if (NOC.capaEnlace(x) === c) n++; });
    if (c === "B") n += (RED.zonas || []).length;
    return n;
  }
  // Carril: 40 px (iniciales) o ≈220 px (secciones con título). Cada sección: cabecera .lbl plegable + cuerpo propio.
  var elCapas = null;
  function pintarCapas() {
    if (!elCapas) return;
    elCapas.innerHTML = CAPAS.map(function (c) {
      return '<button type="button" class="capa" data-capa="' + c.id + '" aria-pressed="' + (NOC.capas[c.id] !== false) + '" title="' + c.id + ' · ' + esc(t(c.n)) + '">' +
        c.id + '<span class="nom"><span>' + esc(t(c.n)) + '</span><small>' + cuentaCapa(c.id) + '</small></span></button>';
    }).join("");
  }
  function inicialSeccion(s) { return s.inicial || String(t(s.titulo) || s.id).toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ0-9]/g, "").slice(0, 3); }
  function cabSeccion(reg) {
    var s = reg.def, pl = NOC.plegado("sec:" + s.id);
    return '<span class="ind">' + (pl ? "▸" : "▾") + '</span>' + (s.icono ? '<span class="ico-sec">' + s.icono + '</span>' : '') +
      '<span class="ini">' + esc(inicialSeccion(s)) + '</span><span class="tit">' + esc(t(s.titulo)) + '</span>';
  }
  montarSeccion = function (reg) {
    var cont = $("#rail-secs");
    if (!cont || reg.el) return;
    var s = reg.def, sec = document.createElement("section");
    sec.className = "rsec" + (s.id === "capas" ? " compacta" : "");
    sec.setAttribute("data-sec", s.id);
    sec.innerHTML = '<button type="button" class="rsec-cab lbl" data-plegar="sec:' + esc(s.id) + '" title="' + esc(t(s.titulo)) + '"></button><div class="rsec-cuerpo"></div>';
    reg.el = sec;
    // posición según "orden"
    var sig = null, i = SECCIONES.indexOf(reg);
    for (var k = i + 1; k < SECCIONES.length && !sig; k++) if (SECCIONES[k].el && SECCIONES[k].el.parentNode === cont) sig = SECCIONES[k].el;
    cont.insertBefore(sec, sig);
    sec.querySelector(".rsec-cab").innerHTML = cabSeccion(reg);
    sec.classList.toggle("plegada", NOC.plegado("sec:" + s.id));
    if (!reg.montada) {
      reg.montada = true;
      try { s.montar && s.montar(sec.querySelector(".rsec-cuerpo")); } catch (e) { console.error("montar sección de carril " + s.id, e); }
    }
  };
  function pintarRail() {
    var abierto = !NOC.plegado("carril");
    raiz.classList.toggle("rail-abierto", abierto);
    var cab = $("#rail-cab");
    cab.title = t(T.plegarCarril);
    cab.setAttribute("aria-expanded", String(abierto));
    cab.innerHTML = '<span class="tit">' + esc(t(T.carril)) + '</span><span>' + (abierto ? "«" : "»") + '</span>';
    SECCIONES.forEach(function (reg) {
      if (!reg.el) return;
      reg.el.querySelector(".rsec-cab").innerHTML = cabSeccion(reg);
      reg.el.querySelector(".rsec-cab").title = t(reg.def.titulo);
      reg.el.classList.toggle("plegada", NOC.plegado("sec:" + reg.def.id));
    });
    pintarCapas();
  }
  var tCarril = null;
  function avisarAncho() {
    emitir("carril", { abierto: !NOC.plegado("carril"), ancho: NOC.plegado("carril") ? 40 : 220 });
    clearTimeout(tCarril);
    tCarril = setTimeout(function () {
      if (NOC.mapa && NOC.mapa.invalidateSize) { try { NOC.mapa.invalidateSize(); } catch (e) { /* nada */ } }
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }
  function pintarFichaPlegado() {
    var pl = NOC.plegado("ficha");
    raiz.classList.toggle("ficha-plegada", pl);
    var tira = $("#ficha-tira");
    var h2 = $("#ficha-cab h2");
    tira.title = t(T.plegarFicha);
    tira.innerHTML = '<span>◂</span><span class="vert">' + esc(t(T.ficha)) + (h2 ? " · " + esc(h2.textContent) : "") + '</span>';
  }
  function botonPlegarFicha() { return '<button type="button" class="ficha-pleg" data-plegar="ficha" title="' + esc(t(T.plegarFicha)) + '" aria-label="' + esc(t(T.plegarFicha)) + '">▸</button>'; }
  // Secciones de ficha (.ficha-sec): estado por título, recordado
  function claveFs(sec) {
    var h = sec.querySelector(":scope > h3, :scope > .ficha-sec-cab");
    return "fs:" + (sec.getAttribute("data-pl") || (h ? h.textContent : "")).trim().toLowerCase();
  }
  function aplicarFichaSecs(base) {
    Array.prototype.forEach.call((base || document).querySelectorAll(".ficha-sec"), function (s) {
      if (s.querySelector(":scope > h3, :scope > .ficha-sec-cab")) s.classList.toggle("plegada", NOC.plegado(claveFs(s)));
    });
  }
  NOC.aplicarPlegados = function (base) { aplicarFichaSecs(base); Object.keys(plegados).forEach(function (id) { aplicarPlegadoGenerico(id, base); }); };
  aplicarPlegado = function (id) {
    if (id === "carril") { pintarRail(); avisarAncho(); }
    else if (id === "ficha") { pintarFichaPlegado(); avisarAncho(); }
    else if (id === "dock") { dock.plegado = NOC.plegado("dock"); pintarDock(); emitir("dock", dock); }
    else if (id === "caso") pintarBarra();
    else if (id.indexOf("sec:") === 0) pintarRail();
    else if (id.indexOf("fs:") === 0) aplicarFichaSecs();
    aplicarPlegadoGenerico(id);
  };
  NOC.registrarSeccionCarril({
    id: "capas", titulo: { es: "Capas", en: "Layers" }, orden: 10, inicial: "A–H",
    montar: function (el) { elCapas = el; pintarCapas(); }
  });

  // ---------- pestañas y vistas ----------
  var VISTAS = [], ORDEN = ["inicio", "mapa", "demanda_mapa", "unifilar", "capas", "paquete", "n1", "planificacion", "sla", "comparar", "casos", "trazabilidad", "interconexion"];
  var activa = null, listo = false;
  NOC.registrarVista = function (v) {
    if (!v || !v.id) return;
    if (VISTAS.some(function (x) { return x.id === v.id; })) return;
    var el = document.createElement("div");
    el.className = "vista vista-" + v.id; el.hidden = true; el.id = "vista-" + v.id;
    $("#vistas").appendChild(el);
    VISTAS.push({ def: v, el: el, montada: false });
    VISTAS.sort(function (a, b) {
      var ia = ORDEN.indexOf(a.def.id), ib = ORDEN.indexOf(b.def.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    pintarTabs();
    if (listo && !activa && enEspacio(v.def)) activarVista(v.id);
  };
  function pintarTabs() {
    var extra = "";
    if (ESP === "analisis") extra = '<button type="button" class="tab acc" data-accion="estudios" title="' + esc(t({ es: "Guardar, cargar y compartir estudios; modo defensa (diapositivas sobre el simulador)", en: "Save, load and share studies; defence mode (slides over the simulator)" })) + '">' + esc(t({ es: "Estudios · defensa", en: "Studies · defence" })) + '</button>';
    else if (ESP === "datos") extra = '<a class="tab ext" href="demanda.html">' + esc(t(T.demanda)) + '</a>' +
      '<button type="button" class="tab acc" data-accion="exportar">' + esc(t({ es: "Exportar CSV / informe", en: "Export CSV / report" })) + '</button>';
    var e = espPorId(ESP);
    $("#tabs").innerHTML = '<span class="tabs-esp lbl">' + esc(t(e.n)) + '</span>' + VISTAS.filter(function (x) { return enEspacio(x.def); }).map(function (x) {
      return '<button type="button" class="tab" role="tab" data-vista="' + esc(x.def.id) + '" aria-selected="' + (activa === x.def.id) + '">' + esc(t(x.def.titulo)) + '</button>';
    }).join("") + extra;
  }
  // ---------- espacios (Revisión 10) ----------
  var ultimaPorEsp = {};
  try { ultimaPorEsp = JSON.parse(leer("noc.vistaEsp") || "{}") || {}; } catch (e) { ultimaPorEsp = {}; }
  function dockLista() {
    var base = [["alarmas", T.alarmas, ["red", "simulacion", "analisis"]], ["enlaces", T.enlaces, ["red", "analisis"]]];
    var l = base.filter(function (x) { return x[2].indexOf(ESP) >= 0; }).map(function (x) { return x[0]; });
    PEST_DOCK.forEach(function (p) { if (enEspacio(p)) l.push(p.id); });
    if (ESP === "simulacion") { var o = ["tiempo", "sucesos", "alarmas", "enlaces"]; l.sort(function (a, b) { return (o.indexOf(a) + 1 || 99) - (o.indexOf(b) + 1 || 99); }); }
    return l;
  }
  function escribirHash() {
    try {
      var h = (location.hash || "").replace(/^#/, "").split("&").filter(function (x) { return x && !/^e=/.test(x); });
      h.unshift("e=" + ESP);
      history.replaceState(null, "", location.href.split("#")[0] + "#" + h.join("&"));
    } catch (e) { /* nada */ }
  }
  function aplicarClasesEsp() {
    ESP_IDS.forEach(function (x) { document.body.classList.toggle("esp-" + x, x === ESP); });
    raiz.setAttribute("data-esp", ESP);
    raiz.classList.toggle("sin-dock", !dockLista().length);
  }
  var tabDockEsp = {};
  function setEspacio(e, opc) {
    opc = opc || {};
    if (e === "guia") { location.href = "guia.html"; return; }
    if (ESP_IDS.indexOf(e) < 0) return;
    var cambia = e !== ESP;
    if (dock.tab) tabDockEsp[ESP] = dock.tab;
    ESP = e; NOC.espacio = e;
    guardar("noc.espacio", e);
    aplicarClasesEsp();
    Array.prototype.forEach.call(document.querySelectorAll(".espacios [data-espacio]"), function (b) {
      if (b.getAttribute("data-espacio") === e) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    dock.plegado = NOC.plegado("dock");
    var dl = dockLista();
    if (dl.length) dock.tab = dl.indexOf(tabDockEsp[e]) >= 0 ? tabDockEsp[e] : dl[0];
    pintarDock();
    if (!opc.sinVista) {
      var actual = VISTAS.filter(function (x) { return x.def.id === activa; })[0];
      if (!actual || !enEspacio(actual.def)) {
        var u = ultimaPorEsp[e], cand = VISTAS.filter(function (x) { return enEspacio(x.def); });
        var v = cand.filter(function (x) { return x.def.id === u; })[0] || cand[0];
        if (v) activarVista(v.def.id); else pintarTabs();
      } else pintarTabs();
    } else pintarTabs();
    if (e === "inicio") alternarCasoPanel(false);
    if (opc.hash !== false) escribirHash();
    if (cambia) { avisarAncho(); emitir("espacio", e); }
  }
  NOC.setEspacio = setEspacio;
  NOC.espacio = ESP;
  NOC.espacios = function () { return ESPACIOS.map(function (e) { return e.id; }); };
  window.addEventListener("hashchange", function () { var e = espDeHash(); if (e && e !== ESP) setEspacio(e, { hash: false }); });
  function activarVista(id) {
    var v = VISTAS.filter(function (x) { return x.def.id === id; })[0];
    if (!v) return;
    // Revisión 10: si la vista no está en el espacio activo (modo defensa, casos → mapa…), se cambia de espacio
    if (!enEspacio(v.def)) setEspacio(gruposDe(v.def)[0], { sinVista: true });
    ultimaPorEsp[ESP] = id; guardar("noc.vistaEsp", JSON.stringify(ultimaPorEsp));
    var prev = VISTAS.filter(function (x) { return x.def.id === activa; })[0];
    if (prev && prev !== v) {
      try { prev.def.desactivar && prev.def.desactivar(); } catch (e) { console.error(e); }
      prev.el.hidden = true;
    }
    activa = id; NOC.vistaActiva = id;
    v.el.hidden = false;
    if (!v.montada) { v.montada = true; try { v.def.montar && v.def.montar(v.el); } catch (e) { console.error("montar " + id, e); } }
    try { v.def.activar && v.def.activar(); } catch (e) { console.error(e); }
    guardar("noc.vista", id);
    pintarTabs();
    emitir("vista", id);
  }
  NOC.activarVista = activarVista;

  // ---------- INICIO (Revisión 10): portada de tarjetas ----------
  var elInicio = null;
  function tarjeta(cls, titulo, cuerpo, pie) {
    return '<section class="tj ' + cls + '"><h2 class="tj-tit">' + titulo + '</h2><div class="tj-cuerpo">' + cuerpo + '</div>' + (pie ? '<div class="tj-pie">' + pie + '</div>' : '') + '</section>';
  }
  function boton(acc, txt, extra, prim) { return '<button type="button" class="btn' + (prim ? " prim" : "") + '" ' + acc + (extra || "") + '>' + esc(txt) + '</button>'; }
  // Revisión 11: INICIO visual. Miniatura de la red coloreada por estado, medidores (ocupación, servido, disponibilidad),
  // semáforo por slice, barra de trazabilidad y tarjetas de espacio con icono. El detalle de texto queda en experto.
  // Umbrales de ocupación de la leyenda del mapa (NOC.sevOcupacion): < 60 OK · 60–85 MIN · 85–100 MAJ · > 100 CRIT
  var UMB_LEY = [{ hasta: 0.6, sev: "ok" }, { hasta: 0.85, sev: "min" }, { hasta: 1, sev: "maj" }, { hasta: Infinity, sev: "crit" }];
  var ESP_CORTO = {
    red: { es: "Mapa, planos y capas", en: "Map, diagrams and layers" },
    simulacion: { es: "Película de 24 h con eventos", en: "24 h run with events" },
    analisis: { es: "N-1, planificación y SLA", en: "N-1, planning and SLA" },
    datos: { es: "De dónde sale cada cifra", en: "Where each figure comes from" },
    guia: { es: "Cómo se usa", en: "How to use it" }
  };
  // Disponibilidad (Motor.disponibilidad ≈ 0,5 s): se calcula una vez por caso, en diferido, y se guarda
  var DISP = { clave: null, res: null, estado: "nada", timer: null };
  function claveDisp() { try { return NOC.modo + "|" + JSON.stringify(opcionesCaso()); } catch (e) { return NOC.modo; } }
  function pedirDisp() {
    if (typeof Motor.disponibilidad !== "function") { DISP.estado = "sin"; return; }
    var k = claveDisp();
    if (DISP.clave === k && DISP.estado !== "nada") return;
    DISP.clave = k; DISP.estado = "calculando"; DISP.res = null;
    clearTimeout(DISP.timer);
    DISP.timer = setTimeout(function () {
      if (DISP.clave !== k) return;
      try { DISP.res = Motor.disponibilidad(RED, opcionesCaso()); DISP.estado = "ok"; }
      catch (e) { DISP.estado = "error"; console.warn("Motor.disponibilidad", e); }
      if (ESP === "inicio" && elInicio) pintarInicio();
    }, 350);
  }
  NOC.disponibilidadCache = function () { return DISP.estado === "ok" && DISP.clave === claveDisp() ? DISP.res : null; };
  function miniRed(r) {
    var ns = (RED.nodos || []).filter(function (n) { return n.coord; });
    if (!ns.length) return "";
    var la0 = Infinity, la1 = -Infinity, lo0 = Infinity, lo1 = -Infinity;
    ns.forEach(function (n) { la0 = Math.min(la0, n.coord[0]); la1 = Math.max(la1, n.coord[0]); lo0 = Math.min(lo0, n.coord[1]); lo1 = Math.max(lo1, n.coord[1]); });
    var kx = Math.cos((la0 + la1) / 2 * Math.PI / 180), Wd = 440, H = 300, pad = 18;
    var sx = (lo1 - lo0) * kx || 1, sy = (la1 - la0) || 1, k = Math.min((Wd - 2 * pad) / sx, (H - 2 * pad) / sy);
    var ox = (Wd - sx * k) / 2, oy = (H - sy * k) / 2;
    var P = {};
    ns.forEach(function (n) { P[n.id] = [ox + (n.coord[1] - lo0) * kx * k, oy + (la1 - n.coord[0]) * k]; });
    // nodos co-ubicados: pequeño abanico para que se vean
    var vistos = {};
    ns.forEach(function (n) {
      var key = Math.round(P[n.id][0] / 6) + "," + Math.round(P[n.id][1] / 6);
      var i = vistos[key] = (vistos[key] || 0) + 1;
      if (i > 1) { var an = i * 2.1; P[n.id] = [P[n.id][0] + 9 * Math.cos(an), P[n.id][1] + 9 * Math.sin(an)]; }
    });
    var cnt = { ok: 0, min: 0, maj: 0, crit: 0, unk: 0, nd: 0 };
    var lin = (RED.enlaces || []).map(function (e) {
      if (!P[e.a] || !P[e.b]) return "";
      var x = r && r.enlaces ? r.enlaces[e.id] : null, o = NOC.ocupacion(x), cd = x && x.caido, s = cd ? "unk" : o == null ? "nd" : NOC.sevOcupacion(o);
      cnt[s]++;
      var w = Math.max(1.2, Math.min(4.5, 0.6 + 0.9 * Math.log10(Math.max(1, e.capacidad_gbps || 1))));
      return '<line x1="' + P[e.a][0].toFixed(1) + '" y1="' + P[e.a][1].toFixed(1) + '" x2="' + P[e.b][0].toFixed(1) + '" y2="' + P[e.b][1].toFixed(1) + '" style="stroke:var(--' + (s === "nd" ? "line3" : s) + ')" stroke-width="' + w.toFixed(1) + '"' +
        (cd ? ' stroke-dasharray="4 3"' : e.tipo === "sat" ? ' stroke-dasharray="1.5 3"' : '') + ' class="mr-enl" data-accion="ir-elem" data-tipo="enlace" data-id="' + esc(e.id) + '" data-tip="' + esc(corto(e.id) + " · " + (cd ? "DOWN" : o == null ? t({ es: "sin tráfico", en: "no traffic" }) : fmt(o * 100, 1) + " % · " + SEV_TXT[s])) + '"/>';
    }).join("");
    var nod = ns.map(function (n) {
      var x = r && r.nodos ? r.nodos[n.id] : null, cd = x && x.caido, s = cd ? "unk" : "";
      var tam = { core: 11, metro: 11, edge: 9, ix: 10, agg: 7, site: 7 }[n.tipo] || 7;
      var forma = NOC.formaNodo ? NOC.formaNodo(n.tipo, tam, cd ? "var(--bg2)" : "var(--tx1)", "#000") : '<svg width="' + tam + '" height="' + tam + '"><circle cx="' + tam / 2 + '" cy="' + tam / 2 + '" r="' + (tam / 2 - 1) + '" fill="#ececec"/></svg>';
      return '<g transform="translate(' + (P[n.id][0] - tam / 2).toFixed(1) + ' ' + (P[n.id][1] - tam / 2).toFixed(1) + ')" class="mr-nodo" data-accion="ir-elem" data-tipo="nodo" data-id="' + esc(n.id) + '" data-tip="' + esc(corto(n.id) + (cd ? " · DOWN" : "")) + '">' +
        forma + (cd ? '<path d="M0 0L' + tam + ' ' + tam + 'M' + tam + ' 0L0 ' + tam + '" style="stroke:var(--crit)" stroke-width="1.5"/>' : '') + '</g>' + (s ? "" : "");
    }).join("");
    var etq = ["MET-NORTE", "MET-ESTE", "MET-SUR", "MET-CENTRO"].filter(function (id) { return P[id]; }).map(function (id) {
      return '<text x="' + (P[id][0] + 9).toFixed(1) + '" y="' + (P[id][1] - 6).toFixed(1) + '" class="mr-et">' + esc(corto(id)) + '</text>';
    }).join("");
    var resumen = ["ok", "min", "maj", "crit", "unk"].filter(function (s) { return cnt[s] || s === "ok"; }).map(function (s) {
      return '<span class="mr-c">' + (NOC.textoEstado ? NOC.textoEstado(s) : NOC.insignia(s)) + '<b>' + cnt[s] + '</b></span>';
    }).join("") + (cnt.nd ? '<span class="mr-c tx3" data-tip="' + esc(t({ es: "Enlaces sin tráfico en este caso (p. ej. satélite de respaldo inactivo).", en: "Links with no traffic in this case (e.g. idle backup satellite)." })) + '" tabindex="0">' + ico("enlace", 14) + esc(t({ es: "sin tráfico", en: "no traffic" })) + '<b>' + cnt.nd + '</b></span>' : '');
    var aria = t({ es: "Miniatura de la red: ", en: "Network thumbnail: " }) + ["ok", "min", "maj", "crit", "unk"].map(function (s) { return cnt[s] + " " + SEV_TXT[s]; }).join(", ");
    return '<figure class="mini-red"><svg viewBox="0 0 ' + Wd + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">' + lin + nod + etq + '</svg>' +
      '<figcaption><span class="lbl">' + esc(t({ es: "Enlaces", en: "Links" })) + '</span>' + resumen + '</figcaption></figure>';
  }
  var SLICE_ICO = { eMBB: "embb", URLLC: "urllc", mMTC: "iot", "fijo-bng": "ftth" };
  var SLICE_N = { eMBB: "eMBB", URLLC: "URLLC", mMTC: "mMTC", "fijo-bng": { es: "Fijo (BNG)", en: "Fixed (BNG)" } };
  function semaforoSlices(r) {
    var S = r && r.sla;
    if (!S || !Object.keys(S).length) return '<p class="nota">' + esc(t({ es: "SLA no calculado en este caso.", en: "SLA not computed for this case." })) + '</p>';
    return '<ul class="semaforo">' + Object.keys(S).map(function (k) {
      var x = S[k], ok = !!x.cumple, sv = ok ? "ok" : (x.cumple_pct >= 95 ? "maj" : "crit");
      var tip = (x.nombre || k) + " · " + fmt(x.cumple_gbps_pct, 1) + " % " + t({ es: "del tráfico cumple", en: "of traffic compliant" }) +
        (x.objetivo_lat_ms ? " · " + t({ es: "objetivo ", en: "target " }) + fmt(x.objetivo_lat_ms, 0) + " ms" : "") + (x.peor && x.peor.id ? " · " + t({ es: "peor: ", en: "worst: " }) + corto(x.peor.id) : "");
      return '<li class="sm-' + sv + '" data-tip="' + esc(tip) + '" tabindex="0"><span class="sm-luz" aria-hidden="true"></span>' + ico(SLICE_ICO[k] || "red", 18) +
        '<span class="sm-n">' + esc(t(SLICE_N[k] || x.nombre || k)) + '</span>' + (NOC.textoEstado ? NOC.textoEstado(sv, ok ? "OK" : t({ es: "NO", en: "NO" })) : "") +
        '<span class="sm-p mono solo-experto">' + fmt(x.cumple_gbps_pct, 1) + ' %</span></li>';
    }).join("") + '</ul>';
  }
  function medidorDisp() {
    if (!NOC.medidor) return "";
    var et = { es: "Disponibilidad de la red", en: "Network availability" };
    var inf = info({ es: "Motor.disponibilidad: minutos al año sin servicio por fallos de nodos y fibras (N-1, pares de vanos, SRLG y fallo común), ponderados por el tráfico perdido. Objetivo del núcleo 99,99 % (ARCO02).",
      en: "Motor.disponibilidad: minutes per year without service from node and fibre failures (N-1, span pairs, SRLG and common failure), weighted by lost traffic. Core target 99.99 % (ARCO02)." });
    if (DISP.estado === "sin") return "";
    if (DISP.estado !== "ok" || !DISP.res || !DISP.res.red) {
      return '<div class="ini-med"><span class="md-et">' + esc(t(et)) + '</span> ' + inf + '<div class="nota">' + esc(DISP.estado === "error" ? t({ es: "no se pudo calcular", en: "could not be computed" }) : t({ es: "calculando…", en: "computing…" })) + '</div></div>';
    }
    var d = DISP.res.red, obj = (DISP.res.objetivos && DISP.res.objetivos.nucleo_pct) || 99.99;
    var sv = d.disponibilidad_pct >= obj ? "ok" : d.disponibilidad_pct >= 99.9 ? "maj" : "crit";
    return '<div class="ini-med">' + NOC.medidor(d.disponibilidad_pct, { min: 99.9, max: 100, escala: 1, dec: 3, unidad: "%", etiqueta: et, objetivo: obj, estado: sv, umbrales: [] }) +
      '<div class="ini-med-pie"><span class="tx2">≈ ' + fmt(d.indisp_min_anio, 0) + ' ' + esc(t({ es: "min/año sin servicio", en: "min/year down" })) + ' · ' + esc(t({ es: "objetivo", en: "target" })) + ' ' + fmt(obj, 2) + ' %</span>' + inf + '</div></div>';
  }
  function barraTraza() {
    var L = NOC.linaje && NOC.linaje.cobertura ? NOC.linaje.cobertura("memoria") : null;
    if (!L || !L.total || !L.total.total) return '<p class="nota">' + esc(t({ es: "Linaje no cargado.", en: "Lineage not loaded." })) + '</p>';
    var T0 = L.total, p = function (a) { return a / T0.total * 100; };
    var partes = [["trazado", "ok", { es: "Trazado", en: "Traced" }, T0.trazado || 0], ["hueco", "min", { es: "Hueco", en: "Gap" }, T0.hueco || 0], ["discrepa", "crit", { es: "Discrepa", en: "Mismatch" }, T0.discrepa || 0]];
    return '<div class="traza" role="img" aria-label="' + esc(partes.map(function (x) { return t(x[2]) + " " + x[3]; }).join(", ")) + '"><div class="traza-b">' + partes.map(function (x) {
      return x[3] ? '<i style="width:' + p(x[3]).toFixed(2) + '%;background:var(--' + x[1] + ')" data-tip="' + esc(t(x[2]) + ": " + x[3] + " (" + fmt(p(x[3]), 1) + " %)") + '"></i>' : "";
    }).join("") + '</div><ul class="traza-ley">' + partes.map(function (x) {
      return '<li>' + (NOC.textoEstado ? NOC.textoEstado(x[1], t(x[2])) : esc(t(x[2]))) + '<b>' + x[3] + '</b><span class="tx3">' + fmt(p(x[3]), 1) + ' %</span></li>';
    }).join("") + '</ul></div>';
  }
  function pintarInicio() {
    if (!elInicio) return;
    var r = NOC.resultado, ref = NOC.modo === "ref", c = cuentaSev(), m = ocMax(r);
    pedirDisp();
    // 1 · estado de la red (gráfico)
    var meds = "";
    if (r && NOC.medidor) {
      var s0 = r.resumen;
      meds = '<div class="ini-med">' + NOC.medidor(m.o, { tipo: "arco", unidad: "%", estado: m.o == null ? undefined : NOC.sevOcupacion(m.o), umbrales: UMB_LEY, max: Math.max(1, m.o || 0), escala: 100, etiqueta: { es: "Enlace más cargado", en: "Busiest link" } }) +
        (m.id ? '<button type="button" class="lnk ini-medid" data-accion="ir-elem" data-tipo="enlace" data-id="' + esc(m.id) + '" title="' + esc(m.id) + '">' + esc(corto(m.id)) + '</button>' : '') + '</div>' +
        '<div class="ini-med">' + NOC.medidor(s0.pct_servida, { min: 0, max: 100, escala: 1, dec: 2, unidad: "%", etiqueta: { es: "Tráfico servido", en: "Traffic served" },
          umbrales: [{ hasta: 95, sev: "crit" }, { hasta: 99, sev: "maj" }, { hasta: 99.9, sev: "min" }, { hasta: Infinity, sev: "ok" }] }) +
        '<div class="ini-med-pie tx2">' + fmt(s0.dl_total_gbps, 0) + ' Gbit/s DL' + (s0.demandas_afectadas ? ' · ' + fmt(s0.demandas_afectadas, 0) + ' ' + esc(t({ es: "demandas afectadas", en: "affected demands" })) : '') + '</div></div>' +
        medidorDisp();
    } else if (!r) meds = '<p class="nota sev-crit">' + esc(t(T.motorMal)) + '</p>';
    var nz = ["crit", "maj", "min", "wrn"].filter(function (k) { return c[k] > 0; });
    var peores = ALARMAS.filter(function (a) { return a.sev !== "ok"; }).slice(0, 3);
    var lista = peores.length ? '<ul class="tj-lista ini-alarmas">' + peores.map(function (a) {
      var tipo = IDX.enlaces[a.elem] ? "enlace" : IDX.nodos[a.elem] ? "nodo" : "";
      return '<li>' + (NOC.textoEstado ? NOC.textoEstado(a.sev) : NOC.insignia(a.sev)) + (tipo ? '<button type="button" class="lnk" data-accion="ir-elem" data-tipo="' + tipo + '" data-id="' + esc(a.elem) + '" data-tip="' + esc(a.texto) + '">' + esc(corto(a.elem)) + '</button>' : '<span class="solo-simple" data-tip="' + esc(a.texto) + '" tabindex="0">' + esc(a.texto.length > 60 ? a.texto.slice(0, 58) + "…" : a.texto) + '</span>') +
        '<span class="txt solo-experto">' + esc(a.texto) + '</span></li>';
    }).join("") + '</ul>' : '<p class="nota">' + (NOC.textoEstado ? NOC.textoEstado("ok", t({ es: "Sin alarmas", en: "No alarms" })) : esc(t({ es: "Sin alarmas", en: "No alarms" }))) + '</p>';
    var tEstado = tarjeta("tj-estado", ico("red", 16) + ' ' + esc(t({ es: "Estado de la red", en: "Network status" })) + ' <span class="tj-hora mono">' + esc(horaTxt()) + '</span>',
      '<div class="ini-estado">' + miniRed(r) + '<div class="ini-meds">' + meds + '</div></div>',
      boton('data-espacio="red"', t({ es: "Abrir RED", en: "Open NETWORK" }), "", true) + boton('data-accion="ver-alarmas"', t({ es: "Todas las alarmas", en: "All alarms" }) + (nz.length ? " · " + nz.map(function (k) { return SEV_TXT[k] + " " + c[k]; }).join(" · ") : "")));
    var tSla = tarjeta("tj-sla", ico("ok", 16) + ' ' + esc(t({ es: "Slices: ¿cumplen su SLA?", en: "Slices: SLA met?" })) + ' ' + info({ es: "Un slice cumple si su tráfico se sirve (≥ 99 %) y la latencia P95 de transporte de cada demanda queda dentro de su presupuesto (ana.sla_objetivos). Pasa el ratón por cada fila para ver el peor caso.", en: "A slice meets its SLA if its traffic is served (≥ 99 %) and each demand's P95 transport latency is within its budget (ana.sla_objetivos). Hover each row for the worst case." }),
      semaforoSlices(r) + '<h3 class="tj-h3">' + esc(t({ es: "Alarmas principales", en: "Top alarms" })) + '</h3>' + lista,
      boton('data-espacio="analisis"', t({ es: "Abrir ANÁLISIS", en: "Open ANALYSIS" })));
    // 2 · caso activo: fichas con icono
    var tr = itemPorId(EJES.trafico, ref ? "BH" : caso.trafico), ev = itemPorId(EJES.evento, ref ? EV_REF : caso.evento), mo = resumenModelo();
    var diaTxt = ref ? "2031" : (((MT.tipos_dia || {})[caso.dia] || {})[NOC.lang === "en" ? "nombre_en" : "nombre_es"] || caso.dia) + " " + caso.anio;
    var evTxt = ev && ev.id && ev.id !== "ninguno" ? nomItem(ev) : t(T.ninguno);
    var nf = ref ? 0 : caso.fallos.length;
    function ch(k, txt, tip, cls) { return '<li class="cs' + (cls ? " " + cls : "") + '"' + (tip ? ' data-tip="' + esc(tip) + '" tabindex="0"' : '') + '>' + ico(k, 20) + '<span>' + esc(txt) + '</span></li>'; }
    var chips = '<ul class="caso-chips">' +
      ch("caso", tr ? nomItem(tr) : caso.trafico, t(T.trafico)) + ch("calendario", diaTxt, t(T.dia) + " / " + t(T.anio)) +
      ch("reloj", ref || traficoCargado() ? t(T.hc) : String(caso.hora).padStart(2, "0") + ":00", ref || traficoCargado() ? t(T.hcLargo) : t(T.hora)) +
      ch("evento", evTxt, t(T.evento)) +
      ch(nf ? "fallo" : "ok", nf ? nf + " " + t({ es: nf === 1 ? "fallo" : "fallos", en: nf === 1 ? "fault" : "faults" }) : t({ es: "sin fallos", en: "no faults" }), nf ? caso.fallos.map(corto).join(", ") : "", nf ? "cs-fallo" : "") +
      (!ref && (caso.eventos || []).length ? ch("simulacion", caso.eventos.length + " " + t({ es: "eventos 24 h", en: "24 h events" })) : "") +
      (mo ? ch("ajustes", mo.nombre, t({ es: "Modelo propio", en: "Own model" }) + " · " + mo.cambios + " " + t({ es: "cambios", en: "changes" })) : "") + '</ul>';
    var tCaso = tarjeta("tj-caso", ico("caso", 16) + ' ' + esc(t(T.casoAct)) + ' <b class="pas-modo">' + (ref ? "REF" : "LAB") + '</b>' +
      (ref ? ' ' + info({ es: "La referencia reproduce la Entrega 2 (v7): hora cargada de 2031 con partido en el Metropolitano, sin fallos. Para cambiar el caso, pasa a LABORATORIO.", en: "The reference reproduces Deliverable 2 (v7): 2031 busy hour with a match at the Metropolitano, no faults. To change the case, switch to LABORATORY." }) : ''),
      chips,
      boton('data-accion="caso-panel"', t(T.cambiarCaso), "", true) + boton('data-espacio="simulacion"', t({ es: "Ver en SIMULACIÓN", en: "Show in SIMULATION" })) + '<span class="solo-experto">' + boton('data-accion="ficha-caso"', t({ es: "Detalle del motor", en: "Engine detail" })) + '</span>');
    // 3 · trazabilidad (barra) y, en experto, discrepancias y huecos
    var L = NOC.linaje && NOC.linaje.cobertura ? NOC.linaje.cobertura("memoria") : null, det = "";
    if (L && L.total && L.total.total) {
      var dis = (L.discrepa || []).slice().sort(function (a, b) { return Math.abs(b.dif_rel || 0) - Math.abs(a.dif_rel || 0); }).slice(0, 3);
      det += '<h3 class="tj-h3">' + esc(t({ es: "Discrepancias con la v7", en: "Mismatches with v7" })) + '</h3>' + (dis.length ? '<ul class="tj-lista">' + dis.map(function (v) {
        var d = v.ref && esNum(v.ref.valor) && esNum(v.valor) ? (esNum(v.dif_rel) ? v.dif_rel * 100 : (v.ref.valor ? (v.valor - v.ref.valor) / Math.abs(v.ref.valor) * 100 : null)) : null;
        return '<li>' + NOC.insignia("crit", "Δ") + '<button type="button" class="lnk mono" data-accion="ir-linaje" data-id="' + esc(v.id) + '">' + esc(v.id) + '</button><span class="txt">' +
          esc((v.elemento ? v.elemento + (v.campo && v.campo !== "valor" ? " · " + v.campo : "") + " = " : "") + (esNum(v.valor) ? String(v.valor).replace(".", NOC.lang === "en" ? "." : ",") : String(v.valor == null ? "—" : v.valor)) + (v.unidad && v.unidad !== "—" ? " " + v.unidad : "")) +
          (d != null ? ' <span class="mono sev-crit">Δ ' + fmt(d, 2) + ' %</span>' : '') + (v.memoria ? ' <span class="tx3">· ' + esc(v.memoria) + '</span>' : '') + '</span></li>';
      }).join("") + '</ul>' : '<p class="nota">' + esc(t({ es: "Ninguna: lo recalculado coincide con la memoria.", en: "None: recomputed values match the report." })) + '</p>');
      var hu = (L.huecos || []).slice(0, 3);
      det += '<h3 class="tj-h3">' + esc(t({ es: "Huecos principales (valores que bloquean)", en: "Main gaps (values they block)" })) + '</h3>' + (hu.length ? '<ul class="tj-lista">' + hu.map(function (x) {
        var v = NOC.linaje.valor(x.id) || {};
        return '<li><span class="sev sev-min">' + x.bloquea + '</span><button type="button" class="lnk mono" data-accion="ir-linaje" data-id="' + esc(x.id) + '">' + esc(x.id) + '</button><span class="txt">' +
          esc(v.elemento ? v.elemento + (v.campo && v.campo !== "valor" ? " · " + v.campo : "") : "") + (x.supuesto ? ' <span class="mono tx3">' + esc(x.supuesto) + '</span>' : '') + '</span></li>';
      }).join("") + '</ul>' : '<p class="nota">—</p>');
    }
    var nSup = (RED.supuestos || []).length, nPend = (RED.supuestos || []).filter(function (x) { return x.estado !== "validado"; }).length;
    var tAvisos = tarjeta("tj-avisos", ico("traza", 16) + ' ' + esc(t({ es: "Trazabilidad de la memoria", en: "Report lineage" })) + ' ' + info({ es: "Cada cifra de la memoria v7 se sigue hasta su fuente. Trazado: llega a una fuente. Hueco: falta un dato y se usa un supuesto. Discrepa: lo recalculado no coincide con la v7.", en: "Each figure of report v7 is traced back to its source. Traced: reaches a source. Gap: missing input, an assumption is used. Mismatch: recomputed value differs from v7." }),
      barraTraza() + (nSup ? '<p class="ini-sup">' + ico("documento", 14) + '<span class="chip">' + nSup + ' ' + esc(t({ es: "supuestos", en: "assumptions" })) + '</span><span class="chip">' + nPend + ' ' + esc(t({ es: "por validar", en: "to validate" })) + '</span></p>' : '') +
      '<div class="solo-experto">' + det + '</div>',
      boton('data-espacio="datos"', t({ es: "Abrir DATOS", en: "Open DATA" }), "", true));
    // 4 · espacios: icono grande + 1 línea
    var tEsp = '<nav class="ini-esps" aria-label="' + esc(t(T.espacios)) + '">' + ESPACIOS.filter(function (e) { return e.id !== "inicio"; }).map(function (e) {
      var i = ESP_IDS.indexOf(e.id) + 1, cuerpo = ico(e.id, 34) + '<b>' + esc(t(e.n)) + '</b><span>' + esc(t(ESP_CORTO[e.id] || e.d)) + '</span><kbd class="solo-experto">' + i + '</kbd>';
      return e.href ? '<a class="ie" href="' + e.href + '" title="' + esc(t(e.d)) + '">' + cuerpo + '</a>' : '<button type="button" class="ie" data-espacio="' + e.id + '" title="' + esc(t(e.d)) + '">' + cuerpo + '</button>';
    }).join("") + '</nav>';
    // 5 · accesos rápidos
    var pl = [];
    try { pl = NOC.operador && NOC.operador.plantillas ? NOC.operador.plantillas() : []; } catch (e) { pl = []; }
    var acc = (pl.length ? '<div class="tj-botones">' + pl.slice(0, 6).map(function (p, i) {
      return '<button type="button" class="btn" data-accion="plantilla" data-i="' + i + '" data-tip="' + esc(p.desc ? t(p.desc) : t(p.nombre)) + '">' + ico("play", 12) + esc(t(p.nombre)) + '</button>';
    }).join("") + '</div>' : '') +
      '<div class="tj-botones">' + '<button type="button" class="btn" data-accion="exportar">' + ico("exportar", 14) + esc(t({ es: "Informe y CSV", en: "Report and CSV" })) + '</button>' +
      '<a class="btn" href="guia.html">' + ico("guia", 14) + esc(t({ es: "Guía", en: "Guide" })) + '</a>' +
      '<a class="btn solo-experto" href="demanda.html">' + ico("ajustes", 14) + esc(t({ es: "Modelo de demanda", en: "Demand model" })) + '</a>' +
      '<button type="button" class="btn" data-accion="tour">' + ico("tour", 14) + esc(t({ es: "Recorrido guiado", en: "Guided tour" })) + '</button></div>';
    var tAcc = tarjeta("tj-acc", ico("play", 16) + ' ' + esc(t({ es: "Empezar rápido", en: "Quick start" })) + ' ' + info({ es: "Las plantillas cargan un día de ejemplo (partido, avería…) en LABORATORIO y abren SIMULACIÓN.", en: "Templates load a sample day (match, outage…) in LABORATORY and open SIMULATION." }), acc);
    var sc = elInicio.scrollTop;
    elInicio.innerHTML = '<div class="inicio">' +
      '<header class="ini-cab"><h1>RED-MAD 2031</h1><span class="tx2">' + esc(t({ es: "Red 5G + FTTH de Madrid", en: "Madrid 5G + FTTH network" })) + '</span>' +
        info({ es: "Simulador de la red 5G + FTTH de Madrid en 2031 (Entrega 2, memoria v7). Elige un espacio arriba o con las teclas 1–6. El interruptor SIMPLE / EXPERTO muestra u oculta tablas, ids y fórmulas.",
          en: "Simulator of Madrid's 5G + FTTH network in 2031 (Deliverable 2, report v7). Pick a workspace above or with keys 1–6. The SIMPLE / EXPERT switch shows or hides tables, ids and formulas." }) + '</header>' +
      tEsp + '<div class="ini-rejilla">' + tEstado + tSla + tCaso + tAvisos + tAcc + '</div></div>';
    elInicio.scrollTop = sc;
  }
  NOC.registrarVista({ id: "inicio", grupo: "inicio", titulo: { es: "Inicio", en: "Home" },
    montar: function (el) { elInicio = el; }, activar: function () { pintarInicio(); } });
  NOC.registrarVista({ id: "n1", grupo: "analisis", titulo: { es: "N-1", en: "N-1" },
    montar: function (el) { elN1 = el; el.classList.add("vista-n1"); }, activar: function () { pintarN1(); } });

  // ---------- ficha ----------
  var fichaPropia = null;   // {tipo,id} si la ficha la pinta app.js (se refresca con cada resultado)
  NOC.abrirFicha = function (f, propia) {
    fichaPropia = propia || null;
    f = f || {};
    $("#ficha-cab").innerHTML = botonPlegarFicha() + '<div><h2>' + esc(f.titulo || "") + '</h2>' + (f.subtitulo ? '<div class="sub">' + esc(f.subtitulo) + '</div>' : '') + '</div>' +
      '<button type="button" class="cerrar" data-accion="cerrar-ficha" aria-label="×" title="Esc">×</button>';
    $("#ficha-cuerpo").innerHTML = f.html || "";
    $("#ficha").classList.add("visible");
    if (raiz.classList.contains("ficha-cerrada")) { raiz.classList.remove("ficha-cerrada"); avisarAncho(); }
    aplicarFichaSecs($("#ficha-cuerpo"));
    pintarFichaPlegado();
    renderTex($("#ficha-cuerpo"));
  };
  NOC.cerrarFicha = function () {
    fichaPropia = null;
    $("#ficha").classList.remove("visible");
    if (!raiz.classList.contains("ficha-cerrada")) { raiz.classList.add("ficha-cerrada"); avisarAncho(); }
    var habia = NOC.seleccion;
    NOC.seleccion = null;
    pintarFichaVacia();
    marcarSeleccionTablas();
    if (habia) emitir("seleccion", null);
  };
  function renderTex(el) {
    if (!window.katex) return;
    Array.prototype.forEach.call(el.querySelectorAll("[data-tex]"), function (n) {
      try { window.katex.render(n.getAttribute("data-tex"), n, { throwOnError: false, displayMode: true }); } catch (e) { /* texto plano */ }
    });
  }
  function pintarFichaVacia() {
    var ref = NOC.modo === "ref";
    var tr = ref ? itemPorId(EJES.trafico, "BH") : itemPorId(EJES.trafico, caso.trafico);
    var ev = itemPorId(EJES.evento, ref ? EV_REF : caso.evento);
    var kv = [
      [t({ es: "Modo", en: "Mode" }), ref ? "REF · " + t(T.ref) : "LAB · " + t(T.lab)],
      [t(T.trafico), (tr ? nomItem(tr) : caso.trafico) + (tr && tr.origen === "supuesto" ? " *" : "")],
      [t(T.dia) + " / " + t(T.anio), ref ? "— / 2031" : (((MT.tipos_dia || {})[caso.dia] || {})[NOC.lang === "en" ? "nombre_en" : "nombre_es"] || caso.dia) + " / " + caso.anio],
      [t(T.hora), ref || traficoCargado() ? t(T.hcLargo) : String(caso.hora).padStart(2, "0") + ":00"],
      [t(T.evento), ev && ev.id && ev.id !== "ninguno" ? nomItem(ev) : t(T.ninguno)],
      [t(T.fallo), ref || !caso.fallos.length ? t(T.ninguno) : caso.fallos.map(corto).join(", ")],
    ];
    $("#ficha-cab").innerHTML = botonPlegarFicha() + '<div><h2>' + esc(t(T.casoAct).toUpperCase()) + '</h2><div class="sub">' + esc(t(T.sinSel)) + '</div></div>';
    $("#ficha-cuerpo").innerHTML = '<div class="ficha-sec"><h3>' + esc(t(T.casoAct)) + '</h3><dl class="kv">' + kv.map(function (x, i) {
      return '<dt>' + esc(x[0]) + '</dt><dd class="txt">' + esc(x[1]) + '</dd>';
    }).join("") + '</dl></div>' +
      '<p class="fi-pista solo-simple">' + ico("mapa", 18) + '<span>' + esc(t({ es: "Toca un enlace o un nodo del mapa para ver su ficha.", en: "Tap a link or node on the map to see its card." })) + '</span></p>' +
      '<div class="ficha-sec solo-experto"><h3>' + esc(t({ es: "Motor y modelo", en: "Engine and model" })) + '</h3>' + resumenMotorHTML() + '</div>' +
      '<div class="ficha-sec solo-experto"><h3>' + esc(t({ es: "Referencia", en: "Reference" })) + '</h3><p class="nota">' +
      esc(t({ es: "La referencia reproduce la Entrega 2 (memoria conjunta v7, matriz A11): hora cargada coincidente de 2031 con partido en el Metropolitano, sin fallos. ",
        en: "The reference reproduces Deliverable 2 (joint report v7, A11 matrix): 2031 coincident busy hour with a match at the Metropolitano, no faults. " })) +
      '<span class="mono tx3">' + esc((RED.meta && RED.meta.referencia && RED.meta.referencia.doc) || "") + '</span></p></div>' +
      '<div class="ficha-sec solo-experto"><h3>' + esc(t({ es: "Tipos de dato", en: "Data types" })) + '</h3>' +
      '<div class="dato-doc nota">' + esc(t({ es: "documento (Entrega 2 o anterior)", en: "document (Deliverable 2 or earlier)" })) + '</div>' +
      '<div class="dato-sup nota" style="margin-top:3px">' + esc(t({ es: "supuesto del simulador", en: "simulator assumption" })) + '</div>' +
      '<div class="dato-calc nota" style="margin-top:3px">' + esc(t({ es: "calculado por el motor", en: "computed by the engine" })) + '</div>' +
      '<div class="dato-usr nota" style="margin-top:3px">' + esc(t({ es: "dato del usuario (modelo propio, solo LAB)", en: "user data (own model, LAB only)" })) + '</div></div>';
    aplicarFichaSecs($("#ficha-cuerpo"));
    pintarFichaPlegado();
  }

  // Revisión 10: resumen legible de las opciones con que se calculó (antes se volcaba el JSON entero)
  function resumenModelo() {
    var mu = NOC.modo === "lab" && caso.modelo_usuario && typeof caso.modelo_usuario === "object" ? caso.modelo_usuario : null;
    if (!mu) return null;
    var n = 0;
    ["perfiles", "factores", "crecimiento", "prioridades"].forEach(function (k) { n += Object.keys(mu[k] || {}).length; });
    if (mu.ruido && mu.ruido.sigma > 0) n++;
    if (mu.movilidad && mu.movilidad.activa) n++;
    var st = null;
    try { st = NOC.editorModelo && NOC.editorModelo.estado ? NOC.editorModelo.estado() : null; } catch (e) { st = null; }
    var mc = NOC.reloj && NOC.reloj.mc ? NOC.reloj.mc() : null;
    return { nombre: mu.nombre || mu.id || t({ es: "modelo propio", en: "own model" }), cambios: n,
      sigma: mu.ruido && mu.ruido.sigma > 0 ? mu.ruido.sigma : 0, semilla: mu.ruido ? mu.ruido.semilla : null,
      movilidad: !!(mu.movilidad && mu.movilidad.activa), replicas: mc && mc.n ? mc.n : null, replicasPrev: st && st.n ? st.n : null };
  }
  NOC.resumenModelo = resumenModelo;
  function resumenMotorHTML() {
    var op = NOC.opciones || {}, m = resumenModelo(), filas = [];
    var ev = (caso.eventos || []).length;
    filas.push([t({ es: "Casos", en: "Cases" }), t(EJES.fuente === "motor" ? T.casosMotor : T.casosLocal)]);
    if (NOC.modo === "lab") filas.push([t({ es: "Eventos 24 h", en: "24 h events" }), ev ? String(ev) : t(T.ninguno)]);
    if (m) {
      filas.push([t({ es: "Modelo propio", en: "Own model" }), m.nombre]);
      filas.push([t({ es: "Cambios del modelo", en: "Model changes" }), String(m.cambios)]);
      filas.push([t({ es: "Ruido", en: "Noise" }), m.sigma ? "σ " + fmt(m.sigma, 2) + (m.semilla != null ? " · " + t({ es: "semilla ", en: "seed " }) + m.semilla : "") : t({ es: "sin ruido", en: "no noise" })]);
      filas.push([t({ es: "Réplicas Montecarlo", en: "Monte Carlo replicas" }), m.replicas ? String(m.replicas) : t({ es: "sin calcular", en: "not computed" }) + (m.replicasPrev ? " (" + m.replicasPrev + ")" : "")]);
      if (m.movilidad) filas.push([t({ es: "Movilidad", en: "Mobility" }), t({ es: "activa", en: "active" })]);
    } else filas.push([t({ es: "Modelo propio", en: "Own model" }), NOC.modo === "lab" ? t(T.ninguno) : t({ es: "no (solo LAB)", en: "no (LAB only)" })]);
    return '<dl class="kv">' + filas.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd class="txt">' + esc(x[1]) + '</dd>'; }).join("") + '</dl>' +
      '<details class="det-json"><summary>' + esc(t({ es: "Opciones exactas del motor (JSON)", en: "Exact engine options (JSON)" })) + '</summary><pre>' + esc(JSON.stringify(op, null, 1)) + '</pre></details>';
  }
  function sec(tit, cuerpo, cls) { return '<div class="ficha-sec' + (cls ? " " + cls : "") + '"><h3>' + esc(tit) + '</h3>' + cuerpo + '</div>'; }
  // Revisión 11: piezas gráficas de las fichas (medidor, donut por servicio, camino y curva de 24 h)
  var SERV_N = { movil: { es: "Móvil", en: "Mobile" }, ftth: "FTTH", voz: { es: "Voz", en: "Voice" }, urllc: "URLLC", iot: "IoT",
    empresa: { es: "Empresa", en: "Business" }, evento: { es: "Evento", en: "Event" }, ntn: "NTN" };
  function medOcup(o, caido, pie) {
    if (!caido && o != null && NOC.medidor) return '<div class="fi-med">' + NOC.medidor(o, { etiqueta: { es: "Ocupación", en: "Occupancy" }, unidad: "%", estado: NOC.sevOcupacion(o), umbrales: UMB_LEY, max: Math.max(1, o), escala: 100 }) +
      (pie ? '<div class="fi-pie tx2">' + pie + '</div>' : '') + '</div>';
    if (!NOC.medidor) return barraOc(o, caido);
    return '<div class="fi-med">' + NOC.medidor(caido ? null : o, { etiqueta: { es: "Ocupación", en: "Occupancy" }, unidad: "%", estado: caido ? "unk" : undefined, estadoTexto: caido ? "DOWN" : undefined,
      texto: caido ? "—" : undefined, umbrales: UMB_LEY, max: Math.max(1, o || 0), escala: 100 }) +
      (pie ? '<div class="fi-pie tx2">' + pie + '</div>' : '') + '</div>';
  }
  function donutServicios(ps, dir) {
    if (!ps || !NOC.donut) return "";
    var partes = Object.keys(SERV_N).map(function (k) { var x = ps[k]; return { clave: k, etiqueta: SERV_N[k], valor: x ? (dir ? x[dir] : (x.ab || 0) + (x.ba || 0)) : 0 }; });
    var tot = partes.reduce(function (a, p) { return a + (p.valor || 0); }, 0);
    if (!(tot > 0)) return "";
    return NOC.donut(partes, { centro: fmt(tot, tot >= 100 ? 0 : 1), sub: "Gbit/s", unidad: "Gbit/s", titulo: { es: "Tráfico por servicio", en: "Traffic by service" } });
  }
  function kv(filas) {
    return '<dl class="kv">' + filas.filter(Boolean).map(function (f) {
      return '<dt>' + esc(f[0]) + '</dt><dd class="' + (f[2] || "") + '">' + f[1] + '</dd>';
    }).join("") + '</dl>';
  }
  function gb(x) { return esNum(x) ? fmt(x, Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2) + " Gbit/s" : "—"; }
  function barraOc(o, caido) {
    var s = NOC.sevOcupacion(o, caido);
    if (o == null) return '<span class="tx3">—</span>';
    return '<span class="barra-oc"><i style="width:' + Math.min(100, o * 100).toFixed(1) + '%;background:var(--' + s + ')"></i></span>' +
      '<span class="sev-' + s + '">' + fmt(o * 100, 1) + ' %</span>';
  }
  NOC.barraOcupacion = barraOc;
  function botonFallo(id, caido) {
    var activo = caso.fallos.indexOf(id) >= 0;
    var dis = NOC.modo === "ref" ? ' disabled title="' + esc(t(T.bloqueado)) + '"' : "";
    return '<div class="ficha-acc">' + (NOC.modo === "ref" ? ICO.candado : "") +
      '<button type="button" class="btn' + (activo ? " prim" : "") + '" data-accion="fallo" data-id="' + esc(id) + '"' + dis + '>' +
      esc(t(activo ? T.quitarFallo : T.simFallo)) + '</button></div>';
  }
  function fuenteHTML(o) {
    var f = o.fuente_e2 || o.fuente;
    return sec(t(T.fuente), '<div class="' + NOC.claseDato(o) + '">' + NOC.marcaOrigen(o) +
      (f ? ' <span class="nota">' + esc(f) + '</span>' : ' <span class="nota">' + esc(t(T.noEsp)) + '</span>') + '</div>' +
      (o.nota ? '<p class="nota" style="margin-top:6px">' + esc(o.nota) + '</p>' : '') +
      (o.supuesto && NOC.origenDe(o) !== "supuesto" ? '<p class="nota tx3" style="margin-top:4px">' + esc(t({ es: "Contiene valores marcados como supuesto en la fuente.", en: "Contains values flagged as assumptions in the source." })) + '</p>' : ''), "solo-experto");
  }
  function fichaNodo(id) {
    var n = IDX.nodos[id];
    if (!n) return null;
    var r = NOC.resultado && NOC.resultado.nodos ? NOC.resultado.nodos[id] : null;
    var caido = r ? r.caido : caso.fallos.indexOf(id) >= 0;
    var o = NOC.ocupacion(r), cd = NOC.claseDato(n);
    var cap = n.capacidad_gbps;
    var h = sec(t(T.estado), '<div class="fi-est">' + (NOC.icono ? NOC.icono(n.tipo, 28) : '') + '<div>' +
      (caido ? (NOC.textoEstado ? NOC.textoEstado("unk", "DOWN") : NOC.insignia("unk", "DOWN")) + ' <span>' + esc(t(T.caido)) + '</span>' : (NOC.textoEstado ? NOC.textoEstado(o == null ? "ok" : NOC.sevOcupacion(o), o == null ? "OK" : null) : NOC.insignia(o == null ? "ok" : NOC.sevOcupacion(o))) + ' <span>' + esc(t(T.servicio)) + '</span>') +
      '<div class="tx2">' + esc(t(TIPO_NODO[n.tipo] || { es: n.tipo })) + (esNum(cap) ? ' · ' + gb(cap) : '') + '<span class="tx3 mono solo-experto"> · ' + t({ es: "capa ", en: "layer " }) + NOC.capaNodo(n) + '</span></div></div></div>' +
      (r && o != null ? medOcup(o, caido, gb(r.carga_gbps) + (esNum(cap) ? " / " + gb(cap) : "")) : '') + botonFallo(id, caido));
    h += sec(t(T.datos), kv([
      [t({ es: "Tipo", en: "Type" }), esc(t(TIPO_NODO[n.tipo] || { es: n.tipo })), "txt"],
      [t({ es: "Nombre", en: "Name" }), esc(n.nombre || id), "txt"],
      n.area ? [t({ es: "Área", en: "Area" }), esc(n.area)] : null,
      [t({ es: "Capacidad", en: "Capacity" }), esNum(cap) ? gb(cap) : '<span class="tx3">' + esc(t(T.noEsp)) + '</span>', esNum(cap) ? cd : ""],
      esNum(n.latencia_ms) ? [t({ es: "Latencia nodo", en: "Node latency" }), fmt(n.latencia_ms, 2) + " ms", cd] : null,
      n.funciones && n.funciones.length ? [t({ es: "Funciones", en: "Functions" }), esc(n.funciones.join(" · ")), "txt " + cd] : null,
      n.respaldo ? [t({ es: "Respaldo", en: "Backup" }), esc(Array.isArray(n.respaldo) ? n.respaldo.join(", ") : n.respaldo), cd] : null,
      n.respaldo_de ? [t({ es: "Respalda a", en: "Backs up" }), esc([].concat(n.respaldo_de).join(", ")), cd] : null,
      n.transito ? [t({ es: "Tránsito", en: "Transit" }), esc(String(n.transito)) + (n.nota_transito ? ' <span class="nota">' + esc(n.nota_transito) + '</span>' : ''), "txt"] : null
    ]), "solo-experto");
    if (n.capacidad_detalle && typeof n.capacidad_detalle === "object") {
      h += sec(t({ es: "Detalle de capacidad", en: "Capacity detail" }), kv(Object.keys(n.capacidad_detalle).map(function (k) {
        var v = n.capacidad_detalle[k];
        return [k.replace(/_/g, " "), esc(typeof v === "object" ? JSON.stringify(v) : v), "txt " + cd];
      })), "solo-experto");
    }
    if (r) {
      h += sec(t(T.carga), kv([
        [t({ es: "Carga", en: "Load" }), gb(r.carga_gbps), "dato-calc"],
        esNum(r.demanda_gbps) && Math.abs(r.demanda_gbps - r.carga_gbps) > 1e-6 ? [t({ es: "Ofrecida", en: "Offered" }), gb(r.demanda_gbps), "dato-calc"] : null,
        [t({ es: "Ocupación", en: "Occupancy" }), barraOc(o, caido), "dato-calc"],
        [t({ es: "Demandas", en: "Demands" }), fmt((r.demandas || []).length, 0), "dato-calc"],
        r.absorbe_de && r.absorbe_de.length ? [t({ es: "Absorbe de", en: "Absorbs from" }), esc(r.absorbe_de.join(", ")), "dato-calc"] : null
      ]), "solo-experto");
    }
    var ady = (RED.enlaces || []).filter(function (e) { return e.a === id || e.b === id; });
    if (ady.length) {
      // tráfico por servicio sumado sobre sus enlaces (lo que entra y sale del nodo)
      var psN = {};
      ady.forEach(function (e) {
        var re = NOC.resultado && NOC.resultado.enlaces ? NOC.resultado.enlaces[e.id] : null;
        if (!re || !re.por_servicio) return;
        Object.keys(re.por_servicio).forEach(function (k) { var x = re.por_servicio[k] || {}; psN[k] = psN[k] || { ab: 0, ba: 0 }; psN[k].ab += x.ab || 0; psN[k].ba += x.ba || 0; });
      });
      var dnN = donutServicios(psN, null);
      if (dnN) h += sec(t({ es: "Tráfico por servicio", en: "Traffic by service" }), dnN + '<p class="nota solo-experto">' + esc(t({ es: "Suma de ambos sentidos en todos sus enlaces.", en: "Sum of both directions over all its links." })) + '</p>');
      h += sec(t(T.adyacentes), '<table class="tabla fi-ady"><tbody>' + ady.map(function (e) {
        var re = NOC.resultado ? NOC.resultado.enlaces[e.id] : null, otro = e.a === id ? e.b : e.a;
        return '<tr data-id="' + esc(e.id) + '" data-tipo="enlace"><td>' + (NOC.icono ? NOC.icono((IDX.nodos[otro] || {}).tipo || "sitio", 14) + ' ' : '') + esc(corto(otro)) +
          '<span class="nc-id mono solo-experto">' + esc(e.id) + '</span></td><td class="n">' + barraOc(NOC.ocupacion(re), re && re.caido) + '</td></tr>';
      }).join("") + '</tbody></table>');
    }
    h += fuenteHTML(n);
    return { titulo: corto(id), subtitulo: (corto(id) !== id ? id + " · " : "") + (n.nombre && n.nombre !== corto(id) ? n.nombre + " · " : "") + t(TIPO_NODO[n.tipo] || { es: n.tipo }), html: h };
  }
  function fichaEnlace(id) {
    var e = IDX.enlaces[id];
    if (!e) return null;
    var r = NOC.resultado && NOC.resultado.enlaces ? NOC.resultado.enlaces[id] : null;
    var caido = r ? r.caido : caso.fallos.indexOf(id) >= 0;
    var o = NOC.ocupacion(r), cd = NOC.claseDato(e), cap = e.capacidad_gbps;
    var cmax = r ? Math.max(r.carga_ab || 0, r.carga_ba || 0) : null;
    var h = sec(t(T.estado), medOcup(r ? o : null, caido, (r ? gb(cmax) : "—") + (esNum(cap) ? " / " + gb(cap) : "") +
      '<span class="solo-experto tx3 mono"> · ' + t({ es: "capa ", en: "layer " }) + NOC.capaEnlace(e) + '</span>') +
      (NOC.camino ? '<div class="fi-camino">' + NOC.camino([e.a, id, e.b], { resultado: NOC.resultado }) + '</div>' : '') + botonFallo(id, caido));
    if (r && r.por_servicio) {
      var dir = (r.carga_ab || 0) >= (r.carga_ba || 0) ? "ab" : "ba", dn = donutServicios(r.por_servicio, dir);
      if (dn) h += sec(t({ es: "Tráfico por servicio", en: "Traffic by service" }), dn + '<p class="nota fi-dir">' + esc((dir === "ab" ? corto(e.a) + " → " + corto(e.b) : corto(e.b) + " → " + corto(e.a)) + " · " + t({ es: "sentido más cargado", en: "busiest direction" })) + '</p>');
    }
    // la curva de 24 h la añade reloj.js a la ficha (sección «24 h · ocupación»)
    function lnk(n) { return '<a href="#" data-sel="nodo" data-id="' + esc(n) + '" class="mono">' + esc(n) + '</a> <span class="nota">' + esc(nombre(n) !== n ? nombre(n) : "") + '</span>'; }
    h += sec(t(T.datos), kv([
      [t({ es: "Tipo", en: "Type" }), esc(t(TIPO_ENL[e.tipo] || { es: e.tipo })), "txt"],
      ["A", lnk(e.a), "txt"], ["B", lnk(e.b), "txt"],
      [t({ es: "Capacidad", en: "Capacity" }), esNum(cap) ? gb(cap) + (e.canales_400g ? ' <span class="tx3">(' + e.canales_400g + '×400G)</span>' : '') : '<span class="tx3">' + esc(t(T.noEsp)) + '</span>', esNum(cap) ? cd : ""],
      esNum(e.km) ? ["km", fmt(e.km, 1), cd] : null,
      e.proteccion ? [t({ es: "Protección", en: "Protection" }), esc(e.proteccion).toUpperCase(), cd] : null,
      e.srlg ? ["SRLG", esc(e.srlg), cd] : null,
      e.acometida ? [t({ es: "Acometida", en: "Uplink" }), esc(e.acometida), cd] : null
    ]), "solo-experto");
    if (r) {
      var form = esNum(cap) && cap > 0 ? '<div class="formula" data-tex="' + esc("\\rho = \\frac{\\max(C_{A\\to B},\\,C_{B\\to A})}{C} = \\frac{" +
        fmt(Math.max(r.carga_ab || 0, r.carga_ba || 0), 1).replace(",", "{,}") + "}{" + fmt(cap, 0).replace(",", "{,}") + "} = " +
        fmt(Math.max(r.carga_ab || 0, r.carga_ba || 0) / cap * 100, 1).replace(",", "{,}") + "\\,\\%") + '">ρ = max(A→B, B→A) / C</div>' : "";
      h += sec(t(T.carga), kv([
        ["A→B", gb(r.carga_ab), "dato-calc"],
        ["B→A", gb(r.carga_ba), "dato-calc"],
        esNum(r.demanda_gbps) && r.demanda_gbps > (r.carga_gbps || 0) + 1e-6 ? [t({ es: "Ofrecida (máx.)", en: "Offered (max.)" }), gb(r.demanda_gbps), "dato-calc"] : null,
        [t({ es: "Ocupación", en: "Occupancy" }), barraOc(o, caido), "dato-calc"],
        [t({ es: "Demandas", en: "Demands" }), fmt((r.demandas || []).length, 0), "dato-calc"]
      ]) + (form ? '<div style="margin-top:6px">' + form + '</div>' : ''), "solo-experto");
    }
    h += fuenteHTML(e);
    return { titulo: corto(id), subtitulo: id + " · " + t(TIPO_ENL[e.tipo] || { es: e.tipo }), html: h };
  }
  function fichaZona(id) {
    var z = IDX.zonas[id];
    if (!z) return null;
    var r = NOC.resultado && NOC.resultado.zonas ? NOC.resultado.zonas[id] : null;
    var cd = NOC.claseDato(z);
    var h = r && NOC.medidor ? sec(t(T.estado), '<div class="fi-med">' + NOC.medidor(r.pct, { min: 0, max: 100, escala: 1, dec: 1, unidad: "%", etiqueta: { es: "Tráfico servido", en: "Traffic served" },
      umbrales: [{ hasta: 95, sev: "crit" }, { hasta: 99, sev: "maj" }, { hasta: 99.9, sev: "min" }, { hasta: Infinity, sev: "ok" }] }) +
      '<div class="fi-pie tx2">' + gb(r.servida_gbps) + ' / ' + gb(r.dl_gbps) + ' · ' + fmt(z.poblacion, 0) + ' ' + esc(t({ es: "hab.", en: "inhab." })) + '</div></div>') : "";
    h += sec(t(T.datos), kv([
      [t({ es: "Municipios", en: "Municipalities" }), esc((z.municipios || []).join(", ")), "txt"],
      [t({ es: "Área metro", en: "Metro area" }), esc(z.area)],
      [t({ es: "Población 2031", en: "Population 2031" }), fmt(z.poblacion, 0), cd],
      [t({ es: "Abonados fijos", en: "Fixed subscribers" }), fmt(z.abonados_fijos, 0), cd],
      [t({ es: "Abonados móviles", en: "Mobile subscribers" }), fmt(z.abonados_moviles, 0), cd],
      ["AGG / Edge", esc(z.agg + " / " + z.edge)]
    ]), "solo-experto");
    if (r) {
      h += sec(t(T.carga), kv([
        ["DL", gb(r.dl_gbps), "dato-calc"],
        [t({ es: "Servida", en: "Served" }), gb(r.servida_gbps), "dato-calc"],
        ["%", fmt(r.pct, 2) + " %", "dato-calc"]
      ]) + '<table class="tabla" style="margin-top:6px"><thead><tr><th>' + esc(t({ es: "Necesidad", en: "Need" })) + '</th><th class="n">DL</th><th class="n">%</th></tr></thead><tbody>' +
        Object.keys(r.necesidades || {}).map(function (k) {
          var x = r.necesidades[k], p = x.dl_gbps > 0 ? x.servida_gbps / x.dl_gbps * 100 : 100;
          return '<tr><td class="id">' + esc(k.replace(id + "/", "")) + '</td><td class="n">' + fmt(x.dl_gbps, 1) + '</td><td class="n">' + fmt(p, 1) + '</td></tr>';
        }).join("") + '</tbody></table>', "solo-experto");
    }
    h += fuenteHTML(z);
    return { titulo: corto(id), subtitulo: (corto(id) !== z.nombre ? z.nombre + " · " : "") + id + " · " + t({ es: "zona de demanda", en: "demand zone" }), html: h };
  }
  var FICHAS = { nodo: fichaNodo, enlace: fichaEnlace, zona: fichaZona };
  NOC.fichaElemento = function (tipo, id) {
    var f = FICHAS[tipo] && FICHAS[tipo](id);
    if (f) NOC.abrirFicha(f, { tipo: tipo, id: id });
    return !!f;
  };
  function refrescarFicha() {
    if (fichaPropia) {
      var f = FICHAS[fichaPropia.tipo] && FICHAS[fichaPropia.tipo](fichaPropia.id);
      if (f) { var sc = $("#ficha-cuerpo").scrollTop; NOC.abrirFicha(f, fichaPropia); $("#ficha-cuerpo").scrollTop = sc; }
    } else if (!NOC.seleccion) pintarFichaVacia();
  }

  NOC.seleccionar = function (tipo, id) {
    if (!tipo || !id) return;
    NOC.seleccion = { tipo: tipo, id: id };
    if (FICHAS[tipo]) NOC.fichaElemento(tipo, id);
    marcarSeleccionTablas();
    emitir("seleccion", NOC.seleccion);
  };

  // ---------- fallos ----------
  NOC.alternarFallo = function (id) {
    if (!id) return;
    if (NOC.modo === "ref") { mensaje(t(T.bloqueado)); return; }
    var i = caso.fallos.indexOf(id);
    if (i >= 0) caso.fallos.splice(i, 1); else caso.fallos.push(id);
    guardarCaso(); pintarBarra(); aplicarCaso();
  };
  NOC.fallosActivos = function () { return NOC.resultado ? (NOC.resultado.resumen.fallos || []) : []; };

  // ---------- dock ----------
  var dock = { tab: leer("noc.dock") || "alarmas", plegado: NOC.plegado("dock") };
  var orden = { alarmas: { k: "sev", d: 1 }, enlaces: { k: "oc", d: -1 }, n1: { k: "rk", d: 1 } };
  var N1 = { estado: "nada", filas: [], err: "" };
  // Revisión 4: pestañas extra del dock. NOC.registrarPestanaDock({id, titulo:{es,en}, cnt(), pintar(el)}).
  // pintar(el) recibe un contenedor propio que se conserva mientras la pestaña siga activa (puede actualizar en sitio).
  var PEST_DOCK = [];
  NOC.registrarPestanaDock = function (p) {
    if (!p || !p.id || PEST_DOCK.some(function (x) { return x.id === p.id; })) return;
    PEST_DOCK.push(p);
    pintarDock();
  };
  NOC.dockTab = function () { return dock.plegado ? null : dock.tab; };
  function cabTabla(tab, cols) {
    var o = orden[tab];
    return '<thead><tr>' + cols.map(function (c) {
      var cls = (c.n ? "n " : "") + (c.cls ? c.cls + " " : "") + (o.k === c.k ? (o.d > 0 ? "asc" : "desc") : "");
      return '<th class="' + cls + '"' + (c.k ? ' data-orden="' + c.k + '" data-tab="' + tab + '"' : '') + '>' + esc(c.t) + '</th>';
    }).join("") + '</tr></thead>';
  }
  function ordenar(tab, filas) {
    var o = orden[tab];
    return filas.sort(function (a, b) {
      var x = a[o.k], y = b[o.k];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return (x < y ? -1 : x > y ? 1 : 0) * o.d;
    });
  }
  function pintarDock() {
    var d = $("#dock");
    d.classList.toggle("plegado", dock.plegado);
    var c = cuentaSev(), nEnl = (RED.enlaces || []).length;
    var todas = [["alarmas", T.alarmas, ALARMAS.filter(function (a) { return a.sev !== "ok"; }).length], ["enlaces", T.enlaces, nEnl]];
    PEST_DOCK.forEach(function (p) { var n = ""; try { n = p.cnt ? p.cnt() : ""; } catch (e) { /* nada */ } todas.push([p.id, p.titulo, n == null ? "" : n]); });
    // Revisión 10: solo las pestañas del espacio activo (N-1 pasa a ser una vista de ANÁLISIS)
    var dl = dockLista(), pestanas = dl.map(function (id) { return todas.filter(function (x) { return x[0] === id; })[0]; }).filter(Boolean);
    raiz.classList.toggle("sin-dock", !pestanas.length);
    pintarN1();
    if (!pestanas.length) { $("#dock-cab").innerHTML = ""; $("#dock-cuerpo").innerHTML = ""; return; }
    if (dl.indexOf(dock.tab) < 0) dock.tab = dl[0];
    var propia = PEST_DOCK.filter(function (p) { return p.id === dock.tab; })[0];
    $("#dock-cab").innerHTML = pestanas.map(function (x) {
      return '<button type="button" class="tab" data-dock="' + x[0] + '" aria-selected="' + (dock.tab === x[0]) + '">' + esc(t(x[1])) + ' <span class="cnt">' + x[2] + '</span></button>';
    }).join("") + '<div class="ctl">' + (c.crit ? NOC.insignia("crit", "CRIT " + c.crit) : "") +
      '<button type="button" class="plg" data-plegar="dock" aria-expanded="' + !dock.plegado + '" title="' + esc(t(T.plegarDock)) + '"><span class="ind">' + (dock.plegado ? "▸" : "▾") + '</span>' + esc(t(dock.plegado ? T.desplegar : T.plegar)) + '</button></div>';
    if (dock.plegado) { $("#dock-cuerpo").innerHTML = ""; return; }
    if (propia) {
      var cp = $("#dock-cuerpo"), elp = cp.firstElementChild;
      if (!elp || elp.getAttribute("data-pest") !== propia.id || cp.children.length !== 1) {
        cp.innerHTML = ""; cp.scrollTop = 0;
        elp = document.createElement("div"); elp.className = "dock-pest dock-pest-" + propia.id; elp.setAttribute("data-pest", propia.id);
        cp.appendChild(elp);
      }
      try { propia.pintar(elp); } catch (e) { console.error("pestaña de dock " + propia.id, e); }
      return;
    }
    var h = "";
    if (dock.tab === "alarmas") h = tablaAlarmas();
    else h = tablaEnlaces();
    var cuerpo = $("#dock-cuerpo"), sc = cuerpo.scrollTop;
    cuerpo.innerHTML = h;
    cuerpo.scrollTop = sc;
    marcarSeleccionTablas();
  }
  function horaTxt() {
    var op = NOC.opciones || {};
    if (NOC.resultado && NOC.resultado.paso_reloj) return NOC.resultado.paso_reloj.etiqueta;   // paso del reloj (reloj.js)
    if (NOC.modo === "ref" || traficoCargado()) return t(T.hc);
    var h = NOC.resultado ? NOC.resultado.resumen.hora : caso.hora;
    return esNum(h) ? String(h).padStart(2, "0") + ":00" : t(T.hc);
  }
  function tablaAlarmas() {
    var filas = ALARMAS.map(function (a, i) { return { sev: RANGO[a.sev], s: a.sev, elem: a.elem || "", texto: a.texto, fuente: a.fuente, i: i }; });
    ordenar("alarmas", filas);
    var hh = horaTxt();
    return '<table class="tabla">' + cabTabla("alarmas", [
      { k: "sev", t: t({ es: "Sev.", en: "Sev." }) }, { k: "elem", t: t({ es: "Elemento", en: "Element" }) },
      { t: t({ es: "Hora", en: "Hour" }), cls: "solo-experto" }, { k: "texto", t: t({ es: "Texto", en: "Text" }) }, { k: "fuente", t: t({ es: "Origen", en: "Origin" }), cls: "solo-experto" }
    ]) + '<tbody>' + filas.map(function (f) {
      var tipo = IDX.enlaces[f.elem] ? "enlace" : IDX.nodos[f.elem] ? "nodo" : "";
      return '<tr' + (tipo ? ' data-id="' + esc(f.elem) + '" data-tipo="' + tipo + '"' : '') + '><td>' + (NOC.textoEstado ? NOC.textoEstado(f.s) : NOC.insignia(f.s)) + '</td><td class="id"><span class="solo-experto">' + esc(f.elem || "—") + '</span><span class="solo-simple">' + esc(f.elem ? corto(f.elem) : "—") + '</span>' +
        '</td><td class="mono tx2 solo-experto">' + hh + '</td><td class="txt">' + esc(f.texto) + '</td><td class="tx3 solo-experto">' +
        esc(f.fuente === "umbral" ? t({ es: "umbral 85 %", en: "85 % threshold" }) : t({ es: "motor", en: "engine" })) + '</td></tr>';
    }).join("") + '</tbody></table>';
  }
  function tablaEnlaces() {
    var r = NOC.resultado;
    var filas = (RED.enlaces || []).map(function (e) {
      var x = r ? r.enlaces[e.id] : null, o = NOC.ocupacion(x);
      return { id: e.id, tramo: corto(e.id), tipo: e.tipo, capa: NOC.capaEnlace(e), cap: e.capacidad_gbps,
        ab: x ? x.carga_ab : null, ba: x ? x.carga_ba : null, oc: x && x.caido ? -1 : o, caido: x && x.caido, o: o, origen: NOC.origenDe(e) };
    }).filter(function (f) { return NOC.capaVisible(f.capa); });
    ordenar("enlaces", filas);
    return '<table class="tabla">' + cabTabla("enlaces", [
      { k: "id", t: "ID", cls: "solo-experto" }, { k: "tramo", t: t({ es: "Tramo", en: "Span" }) }, { k: "capa", t: t({ es: "Capa", en: "Layer" }), cls: "solo-experto" },
      { k: "cap", t: t({ es: "Capacidad", en: "Capacity" }), n: 1 }, { k: "ab", t: "A→B", n: 1, cls: "solo-experto" }, { k: "ba", t: "B→A", n: 1, cls: "solo-experto" },
      { k: "oc", t: t({ es: "Ocupación", en: "Occupancy" }), n: 1 }, { k: "origen", t: t({ es: "Dato", en: "Data" }), cls: "solo-experto" }
    ]) + '<tbody>' + filas.map(function (f) {
      return '<tr data-id="' + esc(f.id) + '" data-tipo="enlace"><td class="id solo-experto">' + esc(f.id) + '</td><td>' + ico(f.tipo, 14) + ' ' + esc(f.tramo) + '</td><td class="mono solo-experto">' + f.capa +
        '</td><td class="n">' + (esNum(f.cap) ? fmt(f.cap, f.cap < 10 ? 1 : 0) : "—") + '</td><td class="n solo-experto">' + (esNum(f.ab) ? fmt(f.ab, 1) : "—") + '</td><td class="n solo-experto">' + (esNum(f.ba) ? fmt(f.ba, 1) : "—") +
        '</td><td class="n">' + (f.caido ? (NOC.textoEstado ? NOC.textoEstado("unk", "DOWN") : NOC.insignia("unk", "DOWN")) : barraOc(f.o, false)) + '</td><td class="solo-experto">' + NOC.marcaOrigen(IDX.enlaces[f.id]) + '</td></tr>';
    }).join("") + '</tbody></table>';
  }
  function normalizarN1(res) {
    var arr = Array.isArray(res) ? res : (res && (res.resultados || res.filas || res.elementos)) || [];
    var base = NOC.resultado ? NOC.resultado.resumen : null;
    return arr.map(function (x, i) {
      var s = x.resumen || x;
      var pct = esNum(s.pct_servida) ? s.pct_servida : null;
      var dl = esNum(s.dl_total_gbps) ? s.dl_total_gbps : null, sv = esNum(s.servida_gbps) ? s.servida_gbps : null;
      var perd = esNum(x.perdida_gbps) ? x.perdida_gbps : esNum(x.dl_perdida_gbps) ? x.dl_perdida_gbps : (dl != null && sv != null ? dl - sv : null);
      var oc = esNum(s.max_ocupacion_ofrecida) ? s.max_ocupacion_ofrecida : esNum(s.max_ocupacion) ? s.max_ocupacion : null;
      var id = x.id || x.elemento || x.fallo || "";
      return { rk: i + 1, id: id, clase: x.clase || (IDX.enlaces[id] ? "enlace" : IDX.nodos[id] ? "nodo" : x.tipo || ""),
        pct: pct, dpct: pct != null && base ? pct - base.pct_servida : null, oc: oc, emax: s.enlace_max || x.enlace_max || "",
        afect: esNum(x.demandas_caidas) ? x.demandas_caidas : esNum(s.demandas_afectadas) ? s.demandas_afectadas : (x.demandas ? x.demandas.length : null),
        perd: perd != null ? perd : (pct != null && base ? base.dl_total_gbps * (1 - pct / 100) : null), graves: esNum(x.alertas_graves) ? x.alertas_graves : null,
        sev: x.severidad || x.sev || null };
    });
  }
  function tablaN1() {
    var hayMotor = typeof Motor.barridoN1 === "function";
    var barra = '<div class="barra-n1"><button type="button" class="btn prim" data-accion="n1"' + (hayMotor ? "" : " disabled") + '>' + esc(t(T.ejecutar)) + '</button>' +
      '<span class="solo-experto">' + esc(hayMotor ? t(T.n1Desc) : t(T.pendMotor)) + '</span>' + (hayMotor ? '<span class="solo-simple">' + info(t(T.n1Desc)) + '</span>' : '<span>' + esc(t(T.pendMotor)) + '</span>') +
      (N1.estado === "ok" ? '<span class="tx3 mono">' + N1.filas.length + ' · ' + N1.ms + ' ms</span>' : '') + '</div>';
    if (N1.estado === "corriendo") return barra + '<div class="vacio">' + esc(t(T.ejecutando)) + '</div>';
    if (N1.estado === "error") return barra + '<div class="vacio sev-crit">' + esc(N1.err) + '</div>';
    if (N1.estado !== "ok") return barra;
    var filas = ordenar("n1", N1.filas.slice());
    return barra + '<table class="tabla">' + cabTabla("n1", [
      { k: "rk", t: "#", n: 1 }, { k: "id", t: t({ es: "Elemento caído", en: "Failed element" }) }, { k: "clase", t: t({ es: "Clase", en: "Class" }), cls: "solo-experto" },
      { k: "pct", t: t({ es: "% servido", en: "% served" }), n: 1 }, { k: "dpct", t: "Δ pp", n: 1 }, { k: "perd", t: t({ es: "No servido", en: "Unserved" }), n: 1, cls: "solo-experto" },
      { k: "oc", t: t({ es: "Ocup. máx.", en: "Max. occ." }), n: 1 }, { k: "emax", t: t({ es: "Enlace máx.", en: "Max. link" }), cls: "solo-experto" },
      { k: "afect", t: t({ es: "Dem. sin ruta", en: "Dropped dem." }), n: 1 }, { k: "graves", t: t({ es: "Alarmas graves", en: "Severe alarms" }), n: 1, cls: "solo-experto" }
    ]) + '<tbody>' + filas.map(function (f) {
      var sev = f.dpct == null ? "unk" : f.dpct < -5 ? "crit" : f.dpct < -1 ? "maj" : f.dpct < -0.01 ? "min" : "ok";
      return '<tr data-id="' + esc(f.id) + '" data-tipo="' + (f.clase === "enlace" ? "enlace" : "nodo") + '" title="' + esc(t({ es: "Doble clic: añadir como fallo al caso", en: "Double-click: add as fault to the case" })) + '">' +
        '<td class="n">' + f.rk + '</td><td class="id">' + (NOC.textoEstado ? NOC.textoEstado(sev) : NOC.insignia(sev)) + ' <span class="solo-experto">' + esc(f.id) + '</span><span class="solo-simple">' + esc(corto(f.id)) + '</span></td><td class="solo-experto">' + esc(f.clase) + '</td>' +
        '<td class="n">' + (f.pct == null ? "—" : fmt(f.pct, 2)) + '</td><td class="n">' + (f.dpct == null ? "—" : (f.dpct >= 0 ? "+" : "−") + fmt(Math.abs(f.dpct), 2)) + '</td>' +
        '<td class="n solo-experto">' + (f.perd == null ? "—" : fmt(f.perd, 1)) + '</td><td class="n">' + (f.oc == null ? "—" : fmt(f.oc * 100, 1) + " %") + '</td>' +
        '<td class="id solo-experto">' + esc(f.emax) + '</td><td class="n">' + (f.afect == null ? "—" : fmt(f.afect, 0)) + '</td><td class="n solo-experto">' + (f.graves == null ? "—" : fmt(f.graves, 0)) + '</td></tr>';
    }).join("") + '</tbody></table>';
  }
  // Revisión 10: N-1 como vista propia en ANÁLISIS (antes, pestaña del dock)
  var elN1 = null;
  function pintarN1() {
    if (!elN1 || activa !== "n1") return;
    var sc = elN1.scrollTop;
    elN1.innerHTML = '<div class="n1-vista"><div class="vista-cab"><h2>' + esc(t({ es: "Contingencia N-1", en: "N-1 contingency" })) + '</h2>' + info({ es: "Clic en una fila: ficha del elemento. Doble clic: añadirlo como fallo al caso (LAB).",
        en: "Click a row: element details. Double-click: add it as a fault to the case (LAB)." }) + '</div>' + tablaN1() + '</div>';
    elN1.scrollTop = sc;
    marcarSeleccionTablas();
  }
  function ejecutarN1() {
    if (typeof Motor.barridoN1 !== "function") return;
    N1.estado = "corriendo"; pintarDock(); pintarN1();
    setTimeout(function () {
      var t0 = Date.now();
      try {
        var op = copia(NOC.opciones || opcionesCaso());
        delete op.fallos;
        if (op.caso) op.caso.fallo = [];
        N1.filas = normalizarN1(Motor.barridoN1(RED, op));
        N1.estado = "ok"; N1.ms = Date.now() - t0;
        orden.n1 = { k: "rk", d: 1 };
      } catch (e) { N1.estado = "error"; N1.err = String(e && e.message || e); console.error(e); }
      pintarDock(); pintarN1();
    }, 30);
  }
  function marcarSeleccionTablas() {
    var s = NOC.seleccion;
    Array.prototype.forEach.call(document.querySelectorAll(".tabla tr[data-id]"), function (tr) {
      tr.classList.toggle("sel", !!s && tr.getAttribute("data-id") === s.id);
    });
  }

  // ---------- barra de estado ----------
  var msgTimer = null;
  function mensaje(txt) {
    var el = $("#sb-msg");
    if (!el) return;
    el.textContent = txt;
    clearTimeout(msgTimer);
    msgTimer = setTimeout(function () { el.textContent = ""; }, 4000);
  }
  NOC.mensaje = mensaje;
  function pctSupuestos() {
    // Registro por campo (Revisión 3): número de supuestos S-### registrados.
    if (RED.supuestos && RED.supuestos.length) return RED.supuestos.length;
    var sup = 0;
    (RED.nodos || []).concat(RED.enlaces || []).forEach(function (o) { if (NOC.origenDe(o) === "supuesto") sup++; });
    return sup;
  }
  var PCT_SUP = pctSupuestos();
  function fechaES(f) { var m = String(f || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + "-" + m[2] + "-" + m[1] : (f || "—"); }
  function pintarEstado() {
    var el = $("#sb");
    if (!el) return;
    var r = NOC.resultado, ref = NOC.modo === "ref";
    el.innerHTML =
      '<span>' + t({ es: "DATOS v7 ", en: "DATA v7 " }) + fechaES(RED.meta && RED.meta.fecha) + '</span>' +
      '<span class="' + (motorOK ? "ok" : "mal") + '">' + esc(t(motorOK ? T.motorOk : T.motorMal)) + ' · ' + motorMs + ' ms</span>' +
      '<span>' + (r ? fmt(r.demandas.length, 0) : "—") + ' ' + esc(t(T.demandas)) + '</span>' +
      '<span>' + fmt(PCT_SUP, 0) + ' ' + esc(t(T.supuestos)) + '</span>' +
      '<span class="modo-sb ' + NOC.modo + '">' + (NOC.lang === "en" ? "MODE " : "MODO ") + (ref ? "REF" : "LAB") + '</span>' +
      '<span class="opc solo-experto">' + esc(t(EJES.fuente === "motor" ? T.casosMotor : T.casosLocal)) + '</span>' +
      '<span class="msg" id="sb-msg"></span>' +
      '<span class="atajos solo-experto"><kbd>1</kbd>–<kbd>6</kbd> ' + esc(t({ es: "espacios", en: "workspaces" })) + ' · <kbd>F</kbd> <kbd>[</kbd> <kbd>]</kbd> <kbd>\\</kbd> <kbd>/</kbd> ' + esc(t(T.atajos)) + '</span>';
  }

  // ---------- búsqueda ----------
  function pintarLista() {
    $("#noc-lista").innerHTML = (RED.nodos || []).map(function (n) { return '<option value="' + esc(n.id) + '">' + esc(n.nombre || "") + '</option>'; }).join("") +
      (RED.enlaces || []).map(function (e) { return '<option value="' + esc(e.id) + '">' + esc(nombre(e.a) + " – " + nombre(e.b)) + '</option>'; }).join("") +
      (RED.zonas || []).map(function (z) { return '<option value="' + esc(z.id) + '">' + esc(z.nombre) + '</option>'; }).join("");
  }
  function buscar(q) {
    q = String(q || "").trim();
    if (!q) return false;
    var Q = q.toUpperCase();
    if (IDX.nodos[q]) { NOC.seleccionar("nodo", q); return true; }
    if (IDX.enlaces[q]) { NOC.seleccionar("enlace", q); return true; }
    if (IDX.zonas[q]) { NOC.seleccionar("zona", q); return true; }
    var n = (RED.nodos || []).filter(function (x) { return x.id.toUpperCase().indexOf(Q) >= 0 || (x.nombre || "").toUpperCase().indexOf(Q) >= 0; })[0];
    if (n) { NOC.seleccionar("nodo", n.id); return true; }
    var e = (RED.enlaces || []).filter(function (x) { return x.id.toUpperCase().indexOf(Q) >= 0; })[0];
    if (e) { NOC.seleccionar("enlace", e.id); return true; }
    mensaje(t({ es: "Sin coincidencias: ", en: "No match: " }) + q);
    return false;
  }

  // ---------- hora ▶ ----------
  var timerHora = null;
  function play() {
    if (timerHora) { clearInterval(timerHora); timerHora = null; pintarBarra(); return; }
    timerHora = setInterval(function () {
      caso.hora = (Number(caso.hora) + 1) % 24;
      var rg = $("#rng-hora"), out = $("#out-hora");
      if (rg) rg.value = caso.hora;
      if (out) out.textContent = String(caso.hora).padStart(2, "0") + ":00";
      guardarCaso(); aplicarCaso();
    }, 900);
    pintarBarra();
  }
  function pararHora() { if (timerHora) { clearInterval(timerHora); timerHora = null; } }

  // ---------- modo e idioma ----------
  function setModo(m) {
    if (m !== "ref" && m !== "lab" || m === NOC.modo) return;
    pararHora();
    NOC.modo = m; guardar("noc.modo", m);
    aplicarParamsDemanda();
    pintarBarra(); pintarEstado();
    aplicarCaso();
    emitir("modo", m);
  }
  NOC.setModo = setModo;
  // Vista de casos: pone un caso completo en LAB y recalcula con el motor. c = {trafico, dia, anio, hora, evento, fallos}
  NOC.aplicarCaso = function (c) {
    c = c || {};
    pararHora();
    caso.trafico = c.trafico || "BH";
    caso.dia = c.dia || "laborable";
    caso.anio = c.anio || ANIO_MAX;
    if (typeof c.hora === "number") caso.hora = c.hora;
    caso.evento = c.evento || "ninguno";
    caso.fallos = (c.fallos || []).slice();
    guardarCaso();
    if (NOC.modo !== "lab") {
      NOC.modo = "lab"; guardar("noc.modo", "lab");
      aplicarParamsDemanda();
      pintarBarra(); pintarEstado();
      aplicarCaso();
      emitir("modo", "lab");
    } else {
      pintarBarra();
      aplicarCaso();
    }
    return NOC.resultado;
  };
  function setLang(l) {
    if (l !== "es" && l !== "en" || l === NOC.lang) return;
    NOC.lang = l; guardar("noc.lang", l);
    document.documentElement.lang = l;
    EJES = ejes();
    construirAlarmas();
    pintarBarra(); pintarRail(); pintarTabs(); pintarDock(); pintarEstado();
    refrescarFicha();
    emitir("lang", l);
  }
  NOC.setLang = setLang;
  // Revisión 11: al cambiar SIMPLE / EXPERTO se repintan las piezas que cambian de texto (lo demás lo oculta el CSS)
  if (NOC.alNivel) NOC.alNivel(function (nv) {
    try { pintarBarra(); pintarDock(); pintarEstado(); refrescarFicha(); if (ESP === "inicio") pintarInicio(); } catch (e) { console.error("nivel", e); }
    emitir("nivel", nv);
  });

  // ---------- eventos (delegación) ----------
  raiz.addEventListener("click", function (ev) {
    var b;
    // Cabecera de una sección de ficha (vale para fichas que pintan otras vistas): pliega/despliega y se recuerda por título
    if ((b = ev.target.closest(".ficha-sec > h3, .ficha-sec > .ficha-sec-cab")) && !ev.target.closest("a, button, input, select")) {
      NOC.plegar(claveFs(b.parentNode));
      return;
    }
    if ((b = ev.target.closest("[data-espacio]"))) { ev.preventDefault(); setEspacio(b.getAttribute("data-espacio")); return; }
    if ((b = ev.target.closest("[data-modo]"))) { setModo(b.getAttribute("data-modo")); return; }
    if ((b = ev.target.closest("[data-lang]"))) { setLang(b.getAttribute("data-lang")); return; }
    if ((b = ev.target.closest("[data-capa]"))) {
      var c = b.getAttribute("data-capa");
      NOC.capas[c] = NOC.capas[c] === false;
      guardar("noc.capas", JSON.stringify(NOC.capas));
      pintarCapas(); pintarDock();
      emitir("capas", NOC.capas);
      return;
    }
    if ((b = ev.target.closest("[data-vista]"))) { activarVista(b.getAttribute("data-vista")); return; }
    if ((b = ev.target.closest("[data-dock]"))) {
      dock.tab = b.getAttribute("data-dock");
      guardar("noc.dock", dock.tab);
      if (NOC.plegado("dock")) NOC.plegar("dock", false); else { pintarDock(); emitir("dock", dock); }
      return;
    }
    if ((b = ev.target.closest("[data-plegar]"))) {
      var pid = b.getAttribute("data-plegar");
      // En el carril estrecho, la cabecera de una sección ensancha el carril y abre esa sección
      if (pid.indexOf("sec:") === 0 && NOC.plegado("carril")) { NOC.plegar(pid, false); NOC.plegar("carril", false); return; }
      NOC.plegar(pid);
      return;
    }
    if ((b = ev.target.closest("th[data-orden]"))) {
      var tab = b.getAttribute("data-tab"), k = b.getAttribute("data-orden"), o = orden[tab];
      if (o.k === k) o.d = -o.d; else { o.k = k; o.d = (k === "oc" || k === "cap" || k === "ab" || k === "ba" || k === "perd") ? -1 : 1; }
      pintarDock(); pintarN1(); return;
    }
    if ((b = ev.target.closest("[data-sel]"))) { ev.preventDefault(); NOC.seleccionar(b.getAttribute("data-sel"), b.getAttribute("data-id")); return; }
    if ((b = ev.target.closest("tr[data-id]"))) { NOC.seleccionar(b.getAttribute("data-tipo") || "enlace", b.getAttribute("data-id")); return; }
    if ((b = ev.target.closest("[data-accion]"))) {
      var a = b.getAttribute("data-accion"), id = b.getAttribute("data-id");
      if (a === "quitar-fallo" || a === "fallo") NOC.alternarFallo(id);
      else if (a === "limpiar-fallos") { caso.fallos = []; guardarCaso(); pintarBarra(); aplicarCaso(); }
      else if (a === "cerrar-ficha") NOC.cerrarFicha();
      else if (a === "plegar") NOC.plegar("dock");
      else if (a === "caso-panel") alternarCasoPanel();
      else if (a === "estudios") { if (NOC.estudios && NOC.estudios.alternarPanel) NOC.estudios.alternarPanel(); }
      else if (a === "ir-elem") { setEspacio("red"); NOC.seleccionar(b.getAttribute("data-tipo") || "enlace", id); }
      else if (a === "ir-linaje") { setEspacio("datos"); if (NOC.linaje && NOC.linaje.abrirValor) NOC.linaje.abrirValor(id); }
      else if (a === "plantilla") {
        if (NOC.modo !== "lab") setModo("lab");
        setEspacio("simulacion");
        if (NOC.operador && NOC.operador.aplicarPlantilla) NOC.operador.aplicarPlantilla(Number(b.getAttribute("data-i")));
      }
      else if (a === "ficha-caso") abrirFichaCaso();
      else if (a === "tour") { if (typeof NOC.tour === "function") NOC.tour(true); }
      else if (a === "ver-alarmas") { if (dockLista().indexOf("alarmas") < 0) setEspacio("red"); dock.tab = "alarmas"; guardar("noc.dock", "alarmas"); if (NOC.plegado("dock")) NOC.plegar("dock", false); else { pintarDock(); emitir("dock", dock); } }
      else if (a === "n1") ejecutarN1();
      else if (a === "exportar") { if (window.Exportar && Exportar.alternarPanel) Exportar.alternarPanel(); }
      else if (a === "play") play();
      else if (a === "rail") NOC.plegar("carril");
      else if (a === "rail-movil") $("#rail").classList.toggle("visible");
    }
  });
  raiz.addEventListener("dblclick", function (ev) {
    var tr = ev.target.closest(".n1-vista tr[data-id]");
    if (tr) NOC.alternarFallo(tr.getAttribute("data-id"));
  });
  raiz.addEventListener("change", function (ev) {
    var s = ev.target, eje = s.getAttribute && s.getAttribute("data-eje");
    if (eje && NOC.modo === "lab") {
      if (eje === "fallo") { if (s.value) NOC.alternarFallo(s.value); return; }
      caso[eje] = eje === "anio" ? Number(s.value) : s.value;
      if (eje === "trafico" && traficoCargado()) pararHora();
      guardarCaso(); pintarBarra(); aplicarCaso();
      return;
    }
    if (s.id === "buscar") { if (buscar(s.value)) { s.value = ""; s.blur(); } }
  });
  raiz.addEventListener("input", function (ev) {
    if (ev.target.id === "rng-hora" && NOC.modo === "lab") {
      caso.hora = Number(ev.target.value);
      $("#out-hora").textContent = String(caso.hora).padStart(2, "0") + ":00";
      guardarCaso(); aplicarCaso();
    }
  });
  raiz.addEventListener("keydown", function (ev) {
    if (ev.target.id === "buscar" && ev.key === "Enter") { ev.preventDefault(); if (buscar(ev.target.value)) { ev.target.value = ""; ev.target.blur(); } }
  });
  // Panel del caso: se cierra al pulsar fuera o con Esc
  document.addEventListener("click", function (ev) {
    if (!casoAbierto) return;
    var tg = ev.target;
    if (tg.closest && (tg.closest(".caso-panel") || tg.closest(".pastilla") || tg.closest("[data-accion=caso-panel]"))) return;
    if (!document.documentElement.contains(tg)) return;   // botón repintado (p. ej. × de un fallo)
    alternarCasoPanel(false);
  });
  function abrirFichaCaso() {
    pintarFichaVacia(); raiz.classList.remove("ficha-cerrada"); $("#ficha").classList.add("visible");
    if (NOC.plegado("ficha")) NOC.plegar("ficha", false);
    avisarAncho();
  }
  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target.tagName || "").toLowerCase();
    if (ev.key === "Escape" && casoAbierto) { alternarCasoPanel(false); if (ev.target.blur && tag !== "body") ev.target.blur(); return; }
    if (tag === "input" || tag === "select" || tag === "textarea" || ev.target.isContentEditable || ev.ctrlKey || ev.metaKey || ev.altKey) {
      if (ev.key === "Escape" && ev.target.blur) ev.target.blur();
      return;
    }
    // Revisión 10: 1–6 = espacios de trabajo (no en el modo defensa)
    if (/^[1-6]$/.test(ev.key) && !document.body.classList.contains("es-en-defensa")) { ev.preventDefault(); setEspacio(ESP_IDS[Number(ev.key) - 1]); return; }
    if (ev.key === "/") { ev.preventDefault(); var b = $("#buscar"); if (b) b.focus(); }
    else if (ev.key === "f" || ev.key === "F") {
      var s = NOC.seleccion;
      if (s && (s.tipo === "nodo" || s.tipo === "enlace")) NOC.alternarFallo(s.id);
      else mensaje(t({ es: "Selecciona un nodo o enlace para simular su fallo.", en: "Select a node or link to simulate its failure." }));
    } else if (ev.key === "l" || ev.key === "L" || ev.key === "[") {
      var ab = !NOC.plegar("carril");
      $("#rail").classList.toggle("visible", ab);
    }
    else if (ev.key === "]") {
      if (raiz.classList.contains("ficha-cerrada")) abrirFichaCaso();
      else { NOC.plegar("ficha"); if (!NOC.plegado("ficha")) $("#ficha").classList.add("visible"); }
    }
    else if (ev.key === "\\") NOC.plegar("dock");
    else if (ev.key === "Escape") { if (!NOC.plegado("carril")) { NOC.plegar("carril", true); $("#rail").classList.remove("visible"); } else NOC.cerrarFicha(); }
  });

  // ---------- arranque ----------
  document.documentElement.lang = NOC.lang;
  try { NOC.referencia = Motor.calcular(RED, copia(OPC_REF)); } catch (e) { console.error("referencia", e); }
  aplicarParamsDemanda();
  raiz.classList.add("ficha-cerrada");
  aplicarClasesEsp();
  pintarBarra(); pintarRail(); pintarTabs(); pintarLista(); pintarFichaVacia();
  colaCarril.forEach(function (s) { NOC.registrarSeccionCarril(s); });
  aplicarCaso();

  function arrancarVistas() {
    if (listo) return;
    listo = true;
    activa = null;
    setEspacio(ESP, { hash: !/estudio=|exportar/.test(location.hash || "") });
    colocarExtras();
  }
  NOC._listo = arrancarVistas;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancarVistas);
  else setTimeout(arrancarVistas, 0);
})();
