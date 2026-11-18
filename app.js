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
  var t = NOC.t, fmt = NOC.fmt;

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
    atajos: { es: "F fallo · L capas · / buscar", en: "F fault · L layers · / find" },
    paramsDem: { es: "parámetros de demanda editados", en: "edited demand parameters" }
  };
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
  var caso = { trafico: "BH", dia: "laborable", anio: ANIO_MAX, hora: 21, evento: typeof Motor.casos === "function" ? "E-EVENTO" : "", fallos: [] };
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
  function opcionesCaso() {
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
      ALARMAS.push({ sev: "min", elem: id, fuente: "umbral",
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
    '<nav class="rail" id="rail" aria-label="Capas"></nav>' +
    '<main class="centro"><div class="tabs" id="tabs" role="tablist"></div><div class="vistas" id="vistas"></div></main>' +
    '<aside class="ficha" id="ficha"><div class="ficha-cab" id="ficha-cab"></div><div class="ficha-cuerpo" id="ficha-cuerpo"></div></aside>' +
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

    $("#tb").innerHTML =
      '<div class="tb-f">' +
        '<button class="btn solo-estrecho" type="button" data-accion="rail-movil">' + esc(t(T.capas)) + '</button>' +
        '<span class="marca-red">RED-MAD 2031<small>NOC · 5G + FTTH</small></span><span class="sep"></span>' +
        '<div class="modo" role="group" aria-label="Modo">' +
          '<button type="button" data-modo="ref" aria-pressed="' + ref + '">' + ICO.candado.replace("candado", "") + esc(t(T.ref)) + '</button>' +
          '<button type="button" data-modo="lab" aria-pressed="' + !ref + '">' + esc(t(T.lab)) + '</button>' +
        '</div>' +
        '<div class="kpis" id="kpis"></div>' +
        '<span class="buscar">' + ICO.lupa + '<input type="search" id="buscar" list="noc-lista" placeholder="' + esc(t(T.buscar)) + '" aria-label="' + esc(t(T.buscar)) + '"></span>' +
        '<div class="seg" role="group" aria-label="Idioma / Language"><button type="button" data-lang="es" aria-pressed="' + (NOC.lang === "es") + '">ES</button><button type="button" data-lang="en" aria-pressed="' + (NOC.lang === "en") + '">EN</button></div>' +
      '</div>' +
      '<div class="tb-f">' +
        '<span class="rotulo-modo" title="' + esc(t(ref ? T.rotRef : T.rotLab)) + '">' + (ref ? ICO.candado : "") + '<b>' + (ref ? "REF" : "LAB") + '</b> ' + esc(t(ref ? T.rotRefCorto : T.rotLabCorto)) +
          (!ref && NOC.paramsEditados ? ' · <a href="demanda.html">' + NOC.paramsEditados + " " + esc(t(T.paramsDem)) + '</a>' : '') + '</span>' +
        '<span class="sep"></span>' +
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
        '<button type="button" class="cnt-alarmas" id="cnt-alarmas" data-accion="ver-alarmas" title="' + esc(t(T.alarmas)) + '"></button>' +
      '</div>';
    document.body.classList.toggle("m-ref", ref);
    document.body.classList.toggle("m-lab", !ref);
    pintarKPI(); pintarContador();
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
    var el = $("#kpis");
    if (!el) return;
    var r = NOC.resultado, R0 = NOC.referencia;
    if (!r) { el.innerHTML = '<div class="kpi"><span class="rot">' + esc(t(T.motorMal)) + '</span></div>'; return; }
    var s = r.resumen, s0 = R0 ? R0.resumen : null, m = ocMax(r), m0 = ocMax(R0);
    var ref = NOC.modo === "ref";
    function k(rot, v, d, tit) {
      return '<div class="kpi"' + (tit ? ' title="' + esc(tit) + '"' : '') + '><span class="rot">' + rot + '</span><span class="v">' + v + '</span>' + (ref ? "" : d) + '</div>';
    }
    el.innerHTML =
      k(esc(t(T.kDl)), fmt(s.dl_total_gbps, 0) + ' <small>Gbit/s</small>', s0 ? delta(s.dl_total_gbps, s0.dl_total_gbps, 0, null) : "") +
      k(esc(t(T.kServ)), fmt(s.pct_servida, 2) + ' <small>%</small>', s0 ? delta(s.pct_servida, s0.pct_servida, 2, false, " pp") : "") +
      k(esc(t(T.kOc)) + ' <span class="mono kpi-id">' + esc(m.id || "") + '</span>',
        (m.o == null ? "—" : '<span class="sev-' + NOC.sevOcupacion(m.o) + '">' + fmt(m.o * 100, 1) + '</span>') + ' <small>%</small>',
        s0 && m0.o != null && m.o != null ? delta(m.o * 100, m0.o * 100, 1, true, " pp") : "", m.id || "") +
      k(esc(t(T.kAfect)), fmt(s.demandas_afectadas, 0) + ' <small>/ ' + fmt((r.demandas || []).length, 0) + '</small>', s0 ? delta(s.demandas_afectadas, s0.demandas_afectadas, 0, true) : "");
  }

  // ---------- carril de capas ----------
  function cuentaCapa(c) {
    var n = 0;
    (RED.nodos || []).forEach(function (x) { if (NOC.capaNodo(x) === c) n++; });
    (RED.enlaces || []).forEach(function (x) { if (NOC.capaEnlace(x) === c) n++; });
    if (c === "B") n += (RED.zonas || []).length;
    return n;
  }
  var railAbierto = false;
  function pintarRail() {
    var el = $("#rail");
    el.classList.toggle("abierto", railAbierto);
    el.innerHTML = '<span class="rot">' + esc(t(T.capas)) + '</span>' + CAPAS.map(function (c) {
      return '<button type="button" class="capa" data-capa="' + c.id + '" aria-pressed="' + (NOC.capas[c.id] !== false) + '" title="' + c.id + ' · ' + esc(t(c.n)) + '">' +
        c.id + '<span class="nom">' + esc(t(c.n)) + '<small>' + cuentaCapa(c.id) + '</small></span></button>';
    }).join("") + '<button type="button" class="exp" data-accion="rail" title="L">' + (railAbierto ? "«" : "»") + ' L</button>';
  }

  // ---------- pestañas y vistas ----------
  var VISTAS = [], ORDEN = ["mapa", "capas", "paquete", "interconexion"];
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
    if (listo && !activa) activarVista(v.id);
  };
  function pintarTabs() {
    $("#tabs").innerHTML = VISTAS.map(function (x) {
      return '<button type="button" class="tab" role="tab" data-vista="' + esc(x.def.id) + '" aria-selected="' + (activa === x.def.id) + '">' + esc(t(x.def.titulo)) + '</button>';
    }).join("") + '<a class="tab ext" href="demanda.html">' + esc(t(T.demanda)) + '</a>';
  }
  function activarVista(id) {
    var v = VISTAS.filter(function (x) { return x.def.id === id; })[0];
    if (!v) return;
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

  // ---------- ficha ----------
  var fichaPropia = null;   // {tipo,id} si la ficha la pinta app.js (se refresca con cada resultado)
  NOC.abrirFicha = function (f, propia) {
    fichaPropia = propia || null;
    f = f || {};
    $("#ficha-cab").innerHTML = '<div><h2>' + esc(f.titulo || "") + '</h2>' + (f.subtitulo ? '<div class="sub">' + esc(f.subtitulo) + '</div>' : '') + '</div>' +
      '<button type="button" class="cerrar" data-accion="cerrar-ficha" aria-label="×" title="Esc">×</button>';
    $("#ficha-cuerpo").innerHTML = f.html || "";
    $("#ficha").classList.add("visible");
    renderTex($("#ficha-cuerpo"));
  };
  NOC.cerrarFicha = function () {
    fichaPropia = null;
    $("#ficha").classList.remove("visible");
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
      [t(T.fallo), ref || !caso.fallos.length ? t(T.ninguno) : caso.fallos.join(", ")],
      [t({ es: "Opciones motor", en: "Engine options" }), JSON.stringify(NOC.opciones || {})]
    ];
    $("#ficha-cab").innerHTML = '<div><h2>' + esc(t(T.casoAct).toUpperCase()) + '</h2><div class="sub">' + esc(t(T.sinSel)) + '</div></div>';
    $("#ficha-cuerpo").innerHTML = '<div class="ficha-sec"><h3>' + esc(t(T.casoAct)) + '</h3><dl class="kv">' + kv.map(function (x, i) {
      return '<dt>' + esc(x[0]) + '</dt><dd class="' + (i === 6 ? "" : "txt") + '" style="' + (i === 6 ? "font-size:10px;color:var(--tx3)" : "") + '">' + esc(x[1]) + '</dd>';
    }).join("") + '</dl></div>' +
      '<div class="ficha-sec"><h3>' + esc(t({ es: "Referencia", en: "Reference" })) + '</h3><p class="nota">' +
      esc(t({ es: "La referencia reproduce la Entrega 2 (memoria conjunta v7, matriz A11): hora cargada coincidente de 2031 con partido en el Metropolitano, sin fallos. ",
        en: "The reference reproduces Deliverable 2 (joint report v7, A11 matrix): 2031 coincident busy hour with a match at the Metropolitano, no faults. " })) +
      '<span class="mono tx3">' + esc((RED.meta && RED.meta.referencia && RED.meta.referencia.doc) || "") + '</span></p></div>' +
      '<div class="ficha-sec"><h3>' + esc(t({ es: "Tipos de dato", en: "Data types" })) + '</h3>' +
      '<div class="dato-doc nota">' + esc(t({ es: "documento (Entrega 2 o anterior)", en: "document (Deliverable 2 or earlier)" })) + '</div>' +
      '<div class="dato-sup nota" style="margin-top:3px">' + esc(t({ es: "supuesto del simulador", en: "simulator assumption" })) + '</div>' +
      '<div class="dato-calc nota" style="margin-top:3px">' + esc(t({ es: "calculado por el motor", en: "computed by the engine" })) + '</div></div>';
  }

  function sec(tit, cuerpo) { return '<div class="ficha-sec"><h3>' + esc(tit) + '</h3>' + cuerpo + '</div>'; }
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
      (o.supuesto && NOC.origenDe(o) !== "supuesto" ? '<p class="nota tx3" style="margin-top:4px">' + esc(t({ es: "Contiene valores marcados como supuesto en la fuente.", en: "Contains values flagged as assumptions in the source." })) + '</p>' : ''));
  }
  function fichaNodo(id) {
    var n = IDX.nodos[id];
    if (!n) return null;
    var r = NOC.resultado && NOC.resultado.nodos ? NOC.resultado.nodos[id] : null;
    var caido = r ? r.caido : caso.fallos.indexOf(id) >= 0;
    var o = NOC.ocupacion(r), cd = NOC.claseDato(n);
    var h = sec(t(T.estado), '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">' +
      (caido ? NOC.insignia("unk", "DOWN") + ' <span>' + esc(t(T.caido)) + '</span>' : NOC.insignia(o == null ? "ok" : NOC.sevOcupacion(o), o == null ? "OK" : null) + ' <span>' + esc(t(T.servicio)) + '</span>') +
      '<span class="tx3 mono">' + t({ es: "capa ", en: "layer " }) + NOC.capaNodo(n) + '</span></div>' + botonFallo(id, caido));
    var cap = n.capacidad_gbps;
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
    ]));
    if (n.capacidad_detalle && typeof n.capacidad_detalle === "object") {
      h += sec(t({ es: "Detalle de capacidad", en: "Capacity detail" }), kv(Object.keys(n.capacidad_detalle).map(function (k) {
        var v = n.capacidad_detalle[k];
        return [k.replace(/_/g, " "), esc(typeof v === "object" ? JSON.stringify(v) : v), "txt " + cd];
      })));
    }
    if (r) {
      h += sec(t(T.carga), kv([
        [t({ es: "Carga", en: "Load" }), gb(r.carga_gbps), "dato-calc"],
        esNum(r.demanda_gbps) && Math.abs(r.demanda_gbps - r.carga_gbps) > 1e-6 ? [t({ es: "Ofrecida", en: "Offered" }), gb(r.demanda_gbps), "dato-calc"] : null,
        [t({ es: "Ocupación", en: "Occupancy" }), barraOc(o, caido), "dato-calc"],
        [t({ es: "Demandas", en: "Demands" }), fmt((r.demandas || []).length, 0), "dato-calc"],
        r.absorbe_de && r.absorbe_de.length ? [t({ es: "Absorbe de", en: "Absorbs from" }), esc(r.absorbe_de.join(", ")), "dato-calc"] : null
      ]));
    }
    var ady = (RED.enlaces || []).filter(function (e) { return e.a === id || e.b === id; });
    if (ady.length) {
      h += sec(t(T.adyacentes), '<table class="tabla"><tbody>' + ady.map(function (e) {
        var re = NOC.resultado ? NOC.resultado.enlaces[e.id] : null;
        return '<tr data-id="' + esc(e.id) + '" data-tipo="enlace"><td class="id">' + esc(e.id) + '</td><td class="n">' + barraOc(NOC.ocupacion(re), re && re.caido) + '</td></tr>';
      }).join("") + '</tbody></table>');
    }
    h += fuenteHTML(n);
    return { titulo: id, subtitulo: (n.nombre || "") + " · " + t(TIPO_NODO[n.tipo] || { es: n.tipo }), html: h };
  }
  function fichaEnlace(id) {
    var e = IDX.enlaces[id];
    if (!e) return null;
    var r = NOC.resultado && NOC.resultado.enlaces ? NOC.resultado.enlaces[id] : null;
    var caido = r ? r.caido : caso.fallos.indexOf(id) >= 0;
    var o = NOC.ocupacion(r), cd = NOC.claseDato(e), cap = e.capacidad_gbps;
    var h = sec(t(T.estado), '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">' +
      (caido ? NOC.insignia("unk", "DOWN") + ' <span>' + esc(t(T.caido)) + '</span>' : NOC.insignia(NOC.sevOcupacion(o), o == null ? "OK" : null) + ' <span>' + esc(t(T.servicio)) + '</span>') +
      '<span class="tx3 mono">' + t({ es: "capa ", en: "layer " }) + NOC.capaEnlace(e) + '</span></div>' + botonFallo(id, caido));
    function lnk(n) { return '<a href="#" data-sel="nodo" data-id="' + esc(n) + '" class="mono">' + esc(n) + '</a> <span class="nota">' + esc(nombre(n) !== n ? nombre(n) : "") + '</span>'; }
    h += sec(t(T.datos), kv([
      [t({ es: "Tipo", en: "Type" }), esc(t(TIPO_ENL[e.tipo] || { es: e.tipo })), "txt"],
      ["A", lnk(e.a), "txt"], ["B", lnk(e.b), "txt"],
      [t({ es: "Capacidad", en: "Capacity" }), esNum(cap) ? gb(cap) + (e.canales_400g ? ' <span class="tx3">(' + e.canales_400g + '×400G)</span>' : '') : '<span class="tx3">' + esc(t(T.noEsp)) + '</span>', esNum(cap) ? cd : ""],
      esNum(e.km) ? ["km", fmt(e.km, 1), cd] : null,
      e.proteccion ? [t({ es: "Protección", en: "Protection" }), esc(e.proteccion).toUpperCase(), cd] : null,
      e.srlg ? ["SRLG", esc(e.srlg), cd] : null,
      e.acometida ? [t({ es: "Acometida", en: "Uplink" }), esc(e.acometida), cd] : null
    ]));
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
      ]) + (form ? '<div style="margin-top:6px">' + form + '</div>' : ''));
    }
    h += fuenteHTML(e);
    return { titulo: id, subtitulo: t(TIPO_ENL[e.tipo] || { es: e.tipo }) + " · " + nombre(e.a) + " – " + nombre(e.b), html: h };
  }
  function fichaZona(id) {
    var z = IDX.zonas[id];
    if (!z) return null;
    var r = NOC.resultado && NOC.resultado.zonas ? NOC.resultado.zonas[id] : null;
    var cd = NOC.claseDato(z);
    var h = sec(t(T.datos), kv([
      [t({ es: "Municipios", en: "Municipalities" }), esc((z.municipios || []).join(", ")), "txt"],
      [t({ es: "Área metro", en: "Metro area" }), esc(z.area)],
      [t({ es: "Población 2031", en: "Population 2031" }), fmt(z.poblacion, 0), cd],
      [t({ es: "Abonados fijos", en: "Fixed subscribers" }), fmt(z.abonados_fijos, 0), cd],
      [t({ es: "Abonados móviles", en: "Mobile subscribers" }), fmt(z.abonados_moviles, 0), cd],
      ["AGG / Edge", esc(z.agg + " / " + z.edge)]
    ]));
    if (r) {
      h += sec(t(T.carga), kv([
        ["DL", gb(r.dl_gbps), "dato-calc"],
        [t({ es: "Servida", en: "Served" }), gb(r.servida_gbps), "dato-calc"],
        ["%", fmt(r.pct, 2) + " %", "dato-calc"]
      ]) + '<table class="tabla" style="margin-top:6px"><thead><tr><th>' + esc(t({ es: "Necesidad", en: "Need" })) + '</th><th class="n">DL</th><th class="n">%</th></tr></thead><tbody>' +
        Object.keys(r.necesidades || {}).map(function (k) {
          var x = r.necesidades[k], p = x.dl_gbps > 0 ? x.servida_gbps / x.dl_gbps * 100 : 100;
          return '<tr><td class="id">' + esc(k.replace(id + "/", "")) + '</td><td class="n">' + fmt(x.dl_gbps, 1) + '</td><td class="n">' + fmt(p, 1) + '</td></tr>';
        }).join("") + '</tbody></table>');
    }
    h += fuenteHTML(z);
    return { titulo: id, subtitulo: z.nombre + " · " + t({ es: "zona de demanda (capa B)", en: "demand zone (layer B)" }), html: h };
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
  var dock = { tab: leer("noc.dock") || "alarmas", plegado: leer("noc.dockPleg") === "1" };
  var orden = { alarmas: { k: "sev", d: 1 }, enlaces: { k: "oc", d: -1 }, n1: { k: "rk", d: 1 } };
  var N1 = { estado: "nada", filas: [], err: "" };
  function cabTabla(tab, cols) {
    var o = orden[tab];
    return '<thead><tr>' + cols.map(function (c) {
      var cls = (c.n ? "n " : "") + (o.k === c.k ? (o.d > 0 ? "asc" : "desc") : "");
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
    $("#dock-cab").innerHTML = [["alarmas", T.alarmas, ALARMAS.filter(function (a) { return a.sev !== "ok"; }).length], ["enlaces", T.enlaces, nEnl], ["n1", T.n1, N1.filas.length || ""]].map(function (x) {
      return '<button type="button" class="tab" data-dock="' + x[0] + '" aria-selected="' + (dock.tab === x[0]) + '">' + esc(t(x[1])) + ' <span class="cnt">' + x[2] + '</span></button>';
    }).join("") + '<div class="ctl">' + (c.crit ? NOC.insignia("crit", "CRIT " + c.crit) : "") +
      '<button type="button" class="btn" data-accion="plegar">' + esc(t(dock.plegado ? T.desplegar : T.plegar)) + ' ' + (dock.plegado ? "▴" : "▾") + '</button></div>';
    if (dock.plegado) { $("#dock-cuerpo").innerHTML = ""; return; }
    var h = "";
    if (dock.tab === "alarmas") h = tablaAlarmas();
    else if (dock.tab === "enlaces") h = tablaEnlaces();
    else h = tablaN1();
    var cuerpo = $("#dock-cuerpo"), sc = cuerpo.scrollTop;
    cuerpo.innerHTML = h;
    cuerpo.scrollTop = sc;
    marcarSeleccionTablas();
  }
  function horaTxt() {
    var op = NOC.opciones || {};
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
      { t: t({ es: "Hora", en: "Hour" }) }, { k: "texto", t: t({ es: "Texto", en: "Text" }) }, { k: "fuente", t: t({ es: "Origen", en: "Origin" }) }
    ]) + '<tbody>' + filas.map(function (f) {
      var tipo = IDX.enlaces[f.elem] ? "enlace" : IDX.nodos[f.elem] ? "nodo" : "";
      return '<tr' + (tipo ? ' data-id="' + esc(f.elem) + '" data-tipo="' + tipo + '"' : '') + '><td>' + NOC.insignia(f.s) + '</td><td class="id">' + esc(f.elem || "—") +
        '</td><td class="mono tx2">' + hh + '</td><td class="txt">' + esc(f.texto) + '</td><td class="tx3">' +
        esc(f.fuente === "umbral" ? t({ es: "umbral 85 %", en: "85 % threshold" }) : t({ es: "motor", en: "engine" })) + '</td></tr>';
    }).join("") + '</tbody></table>';
  }
  function tablaEnlaces() {
    var r = NOC.resultado;
    var filas = (RED.enlaces || []).map(function (e) {
      var x = r ? r.enlaces[e.id] : null, o = NOC.ocupacion(x);
      return { id: e.id, tramo: nombre(e.a) + " – " + nombre(e.b), tipo: e.tipo, capa: NOC.capaEnlace(e), cap: e.capacidad_gbps,
        ab: x ? x.carga_ab : null, ba: x ? x.carga_ba : null, oc: x && x.caido ? -1 : o, caido: x && x.caido, o: o, origen: NOC.origenDe(e) };
    }).filter(function (f) { return NOC.capaVisible(f.capa); });
    ordenar("enlaces", filas);
    return '<table class="tabla">' + cabTabla("enlaces", [
      { k: "id", t: "ID" }, { k: "tramo", t: t({ es: "Tramo", en: "Span" }) }, { k: "capa", t: t({ es: "Capa", en: "Layer" }) },
      { k: "cap", t: t({ es: "Capacidad", en: "Capacity" }), n: 1 }, { k: "ab", t: "A→B", n: 1 }, { k: "ba", t: "B→A", n: 1 },
      { k: "oc", t: t({ es: "Ocupación", en: "Occupancy" }), n: 1 }, { k: "origen", t: t({ es: "Dato", en: "Data" }) }
    ]) + '<tbody>' + filas.map(function (f) {
      return '<tr data-id="' + esc(f.id) + '" data-tipo="enlace"><td class="id">' + esc(f.id) + '</td><td>' + esc(f.tramo) + '</td><td class="mono">' + f.capa +
        '</td><td class="n">' + (esNum(f.cap) ? fmt(f.cap, f.cap < 10 ? 1 : 0) : "—") + '</td><td class="n">' + (esNum(f.ab) ? fmt(f.ab, 1) : "—") + '</td><td class="n">' + (esNum(f.ba) ? fmt(f.ba, 1) : "—") +
        '</td><td class="n">' + (f.caido ? NOC.insignia("unk", "DOWN") : barraOc(f.o, false)) + '</td><td>' + NOC.marcaOrigen(IDX.enlaces[f.id]) + '</td></tr>';
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
      '<span>' + esc(hayMotor ? t(T.n1Desc) : t(T.pendMotor)) + '</span>' +
      (N1.estado === "ok" ? '<span class="tx3 mono">' + N1.filas.length + ' · ' + N1.ms + ' ms</span>' : '') + '</div>';
    if (N1.estado === "corriendo") return barra + '<div class="vacio">' + esc(t(T.ejecutando)) + '</div>';
    if (N1.estado === "error") return barra + '<div class="vacio sev-crit">' + esc(N1.err) + '</div>';
    if (N1.estado !== "ok") return barra;
    var filas = ordenar("n1", N1.filas.slice());
    return barra + '<table class="tabla">' + cabTabla("n1", [
      { k: "rk", t: "#", n: 1 }, { k: "id", t: t({ es: "Elemento caído", en: "Failed element" }) }, { k: "clase", t: t({ es: "Clase", en: "Class" }) },
      { k: "pct", t: t({ es: "% servido", en: "% served" }), n: 1 }, { k: "dpct", t: "Δ pp", n: 1 }, { k: "perd", t: t({ es: "No servido", en: "Unserved" }), n: 1 },
      { k: "oc", t: t({ es: "Ocup. máx.", en: "Max. occ." }), n: 1 }, { k: "emax", t: t({ es: "Enlace máx.", en: "Max. link" }) },
      { k: "afect", t: t({ es: "Dem. sin ruta", en: "Dropped dem." }), n: 1 }, { k: "graves", t: t({ es: "Alarmas graves", en: "Severe alarms" }), n: 1 }
    ]) + '<tbody>' + filas.map(function (f) {
      var sev = f.dpct == null ? "unk" : f.dpct < -5 ? "crit" : f.dpct < -1 ? "maj" : f.dpct < -0.01 ? "min" : "ok";
      return '<tr data-id="' + esc(f.id) + '" data-tipo="' + (f.clase === "enlace" ? "enlace" : "nodo") + '" title="' + esc(t({ es: "Doble clic: añadir como fallo al caso", en: "Double-click: add as fault to the case" })) + '">' +
        '<td class="n">' + f.rk + '</td><td class="id">' + NOC.insignia(sev) + ' ' + esc(f.id) + '</td><td>' + esc(f.clase) + '</td>' +
        '<td class="n">' + (f.pct == null ? "—" : fmt(f.pct, 2)) + '</td><td class="n">' + (f.dpct == null ? "—" : (f.dpct >= 0 ? "+" : "−") + fmt(Math.abs(f.dpct), 2)) + '</td>' +
        '<td class="n">' + (f.perd == null ? "—" : fmt(f.perd, 1)) + '</td><td class="n">' + (f.oc == null ? "—" : fmt(f.oc * 100, 1) + " %") + '</td>' +
        '<td class="id">' + esc(f.emax) + '</td><td class="n">' + (f.afect == null ? "—" : fmt(f.afect, 0)) + '</td><td class="n">' + (f.graves == null ? "—" : fmt(f.graves, 0)) + '</td></tr>';
    }).join("") + '</tbody></table>';
  }
  function ejecutarN1() {
    if (typeof Motor.barridoN1 !== "function") return;
    N1.estado = "corriendo"; pintarDock();
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
      pintarDock();
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
    var tot = 0, sup = 0;
    (RED.nodos || []).concat(RED.enlaces || []).forEach(function (o) { tot++; if (NOC.origenDe(o) === "supuesto") sup++; });
    return tot ? sup / tot * 100 : 0;
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
      '<span>' + fmt(PCT_SUP, 0) + ' % ' + esc(t(T.supuestos)) + '</span>' +
      '<span class="modo-sb ' + NOC.modo + '">' + (NOC.lang === "en" ? "MODE " : "MODO ") + (ref ? "REF" : "LAB") + '</span>' +
      '<span class="opc">' + esc(t(EJES.fuente === "motor" ? T.casosMotor : T.casosLocal)) + '</span>' +
      '<span class="msg" id="sb-msg"></span>' +
      '<span class="atajos"><kbd>F</kbd> <kbd>L</kbd> <kbd>/</kbd> ' + esc(t(T.atajos)) + '</span>';
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

  // ---------- eventos (delegación) ----------
  raiz.addEventListener("click", function (ev) {
    var b;
    if ((b = ev.target.closest("[data-modo]"))) { setModo(b.getAttribute("data-modo")); return; }
    if ((b = ev.target.closest("[data-lang]"))) { setLang(b.getAttribute("data-lang")); return; }
    if ((b = ev.target.closest("[data-capa]"))) {
      var c = b.getAttribute("data-capa");
      NOC.capas[c] = NOC.capas[c] === false;
      guardar("noc.capas", JSON.stringify(NOC.capas));
      pintarRail(); pintarDock();
      emitir("capas", NOC.capas);
      return;
    }
    if ((b = ev.target.closest("[data-vista]"))) { activarVista(b.getAttribute("data-vista")); return; }
    if ((b = ev.target.closest("[data-dock]"))) {
      dock.tab = b.getAttribute("data-dock"); dock.plegado = false;
      guardar("noc.dock", dock.tab); guardar("noc.dockPleg", "0"); pintarDock(); emitir("dock", dock); return;
    }
    if ((b = ev.target.closest("th[data-orden]"))) {
      var tab = b.getAttribute("data-tab"), k = b.getAttribute("data-orden"), o = orden[tab];
      if (o.k === k) o.d = -o.d; else { o.k = k; o.d = (k === "oc" || k === "cap" || k === "ab" || k === "ba" || k === "perd") ? -1 : 1; }
      pintarDock(); return;
    }
    if ((b = ev.target.closest("[data-sel]"))) { ev.preventDefault(); NOC.seleccionar(b.getAttribute("data-sel"), b.getAttribute("data-id")); return; }
    if ((b = ev.target.closest("tr[data-id]"))) { NOC.seleccionar(b.getAttribute("data-tipo") || "enlace", b.getAttribute("data-id")); return; }
    if ((b = ev.target.closest("[data-accion]"))) {
      var a = b.getAttribute("data-accion"), id = b.getAttribute("data-id");
      if (a === "quitar-fallo" || a === "fallo") NOC.alternarFallo(id);
      else if (a === "limpiar-fallos") { caso.fallos = []; guardarCaso(); pintarBarra(); aplicarCaso(); }
      else if (a === "cerrar-ficha") NOC.cerrarFicha();
      else if (a === "plegar") { dock.plegado = !dock.plegado; guardar("noc.dockPleg", dock.plegado ? "1" : "0"); pintarDock(); emitir("dock", dock); }
      else if (a === "ver-alarmas") { dock.tab = "alarmas"; dock.plegado = false; guardar("noc.dock", "alarmas"); pintarDock(); emitir("dock", dock); }
      else if (a === "n1") ejecutarN1();
      else if (a === "play") play();
      else if (a === "rail") { railAbierto = !railAbierto; pintarRail(); }
      else if (a === "rail-movil") $("#rail").classList.toggle("visible");
    }
  });
  raiz.addEventListener("dblclick", function (ev) {
    var tr = ev.target.closest("#dock-cuerpo tr[data-id]");
    if (tr && dock.tab === "n1") NOC.alternarFallo(tr.getAttribute("data-id"));
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
  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea" || ev.ctrlKey || ev.metaKey || ev.altKey) {
      if (ev.key === "Escape" && ev.target.blur) ev.target.blur();
      return;
    }
    if (ev.key === "/") { ev.preventDefault(); var b = $("#buscar"); if (b) b.focus(); }
    else if (ev.key === "f" || ev.key === "F") {
      var s = NOC.seleccion;
      if (s && (s.tipo === "nodo" || s.tipo === "enlace")) NOC.alternarFallo(s.id);
      else mensaje(t({ es: "Selecciona un nodo o enlace para simular su fallo.", en: "Select a node or link to simulate its failure." }));
    } else if (ev.key === "l" || ev.key === "L") { railAbierto = !railAbierto; pintarRail(); $("#rail").classList.toggle("visible", railAbierto); }
    else if (ev.key === "Escape") { if (railAbierto) { railAbierto = false; pintarRail(); } else NOC.cerrarFicha(); }
  });

  // ---------- arranque ----------
  document.documentElement.lang = NOC.lang;
  try { NOC.referencia = Motor.calcular(RED, copia(OPC_REF)); } catch (e) { console.error("referencia", e); }
  aplicarParamsDemanda();
  pintarBarra(); pintarRail(); pintarTabs(); pintarLista(); pintarFichaVacia();
  aplicarCaso();

  function arrancarVistas() {
    if (listo) return;
    listo = true;
    var g = leer("noc.vista");
    var id = VISTAS.some(function (x) { return x.def.id === g; }) ? g : (VISTAS[0] && VISTAS[0].def.id);
    if (id) activarVista(id);
  }
  NOC._listo = arrancarVistas;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancarVistas);
  else setTimeout(arrancarVistas, 0);
})();
