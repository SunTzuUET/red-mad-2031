// editor_modelo.js — T5 (CONTRATO_UI Revisión 8, dueño EDITOR): editor del modelo de demanda propio.
//  · Botón MODELO en la barra del caso (solo LAB; en REF ofrece pasar a LAB) → panel plegable con:
//    importar CSV (arrastrar/soltar varios; avisos/errores con archivo/fila/columna; resumen de cambios), plantillas (Blob),
//    curvas horarias (24 puntos arrastrables en SVG, original en gris), factores por zona/clase, crecimiento CAGR,
//    ruido (σ, semilla), movilidad, Montecarlo (n réplicas → bandas P5–P95/P50 en TIEMPO), guardar/cargar JSON
//    (descarga + localStorage) y comparación con REF (Δ en KPI).
//  · El modelo vive en NOC.caso.modelo_usuario (se guarda con el caso) y app.js lo pasa a calcular y a la serie.
//  · Todo lo que se cambia aquí lleva procedencia {t:"usuario", f:"editor MODELO"} (o el archivo del CSV importado).
// API reales usadas: opciones.modelo_usuario, Motor.serieMontecarlo, Importar.leerArchivos / plantillas, NOC.aplicarModelo.
(function () {
  "use strict";
  var NOC = window.NOC, Motor = window.Motor, Importar = window.Importar;
  if (!NOC || !NOC.RED || !Motor) return;
  var RED = NOC.RED;
  function t(o) { return NOC.t(o); }
  function fmt(x, d) { return NOC.fmt ? NOC.fmt(x, d) : Number(x).toFixed(d); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function copia(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function numero(s) {
    if (typeof s === "number") return s;
    if (Importar && Importar.numero) return Importar.numero(s);
    s = String(s == null ? "" : s).trim().replace(",", ".");
    return s === "" ? null : Number(s);
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  var FUENTE_ED = "editor MODELO";

  var TX = {
    boton: { es: "Modelo", en: "Model" },
    botonTit: { es: "Modelo de demanda propio: CSV, curvas, factores, ruido y Montecarlo (LAB)", en: "Own demand model: CSV, curves, factors, noise and Monte Carlo (LAB)" },
    titulo: { es: "Modelo de demanda", en: "Demand model" },
    cerrar: { es: "Cerrar (Esc)", en: "Close (Esc)" },
    soloLab: { es: "El modelo propio es parte del caso de LABORATORIO. La REFERENCIA reproduce la Entrega 2 (v7) y no se edita.", en: "The own model is part of the LAB case. REFERENCE reproduces Deliverable 2 (v7) and cannot be edited." },
    aLab: { es: "Pasar a LABORATORIO", en: "Switch to LAB" },
    sinModelo: { es: "sin modelo propio: demanda del caso tal cual", en: "no own model: case demand as is" },
    activo: { es: "modelo activo", en: "active model" },
    quitar: { es: "Quitar modelo", en: "Remove model" },
    nombre: { es: "Nombre", en: "Name" },
    // secciones
    sImp: { es: "Importar CSV", en: "Import CSV" }, sCur: { es: "Curvas horarias", en: "Hourly curves" },
    sFac: { es: "Factores", en: "Factors" }, sCre: { es: "Crecimiento", en: "Growth" },
    sRui: { es: "Ruido y Montecarlo", en: "Noise and Monte Carlo" }, sMov: { es: "Movilidad", en: "Mobility" },
    sGua: { es: "Guardar / cargar", en: "Save / load" }, sCmp: { es: "Comparar con REF", en: "Compare with REF" },
    // importar
    soltar: { es: "Suelta aquí uno o varios CSV (perfiles, parametros, demandas, zonas, servicios, servicios_tipo) o un modelo .json", en: "Drop one or more CSV files (perfiles, parametros, demandas, zonas, servicios, servicios_tipo) or a model .json here" },
    elegir: { es: "Elegir archivos…", en: "Choose files…" },
    sumar: { es: "sumar al modelo actual", en: "add to current model" },
    plantillas: { es: "Plantillas", en: "Templates" },
    archivo: { es: "archivo", en: "file" }, tabla: { es: "tabla", en: "table" }, filas: { es: "filas", en: "rows" },
    fila: { es: "fila", en: "row" }, columna: { es: "columna", en: "column" }, texto: { es: "texto", en: "text" },
    errores: { es: "errores", en: "errors" }, avisos: { es: "avisos", en: "warnings" }, cambios: { es: "cambios", en: "changes" },
    aplicado: { es: "Aplicado al caso LAB", en: "Applied to the LAB case" },
    conErrores: { es: "Hay errores: las filas con error no se usan. El resto puede aplicarse.", en: "There are errors: rows with errors are skipped. The rest can be applied." },
    aplicarIgual: { es: "Aplicar sin las filas con error", en: "Apply without the rows with errors" },
    descartar: { es: "Descartar", en: "Discard" },
    leyendo: { es: "leyendo…", en: "reading…" },
    sinImportar: { es: "Falta Importar (importar.js no cargado).", en: "Importar missing (importar.js not loaded)." },
    // curvas
    tipoCurva: { es: "Curva de", en: "Curve of" }, perfil: { es: "perfil", en: "profile" }, clase: { es: "clase", en: "class" }, tec: { es: "tecnología", en: "technology" },
    zona: { es: "zona", en: "zone" }, todas: { es: "todas", en: "all" },
    editada: { es: "editada", en: "edited" }, original: { es: "original", en: "original" },
    restablecer: { es: "Restablecer", en: "Reset" }, valores: { es: "valores (24, separados por ;)", en: "values (24, separated by ;)" },
    curvasEd: { es: "Curvas del modelo", en: "Model curves" }, ninguna: { es: "ninguna", en: "none" },
    ayudaCurva: { es: "Arrastra los puntos (o pinta a lo largo). 1 = valor de diseño en la hora cargada. ↑↓ con un punto enfocado: ±0,01.", en: "Drag the points (or paint across). 1 = design value at the busy hour. ↑↓ on a focused point: ±0.01." },
    notaHC: { es: "Caso de hora cargada: la curva cambia la película (TIEMPO), no la foto de dimensionado.", en: "Busy-hour case: the curve changes the time series (TIME), not the dimensioning snapshot." },
    notaTec: { es: "Se aplica a sus clases de servicio:", en: "Applied to its service classes:" },
    // factores, crecimiento
    porZona: { es: "Por zona", en: "By zone" }, porClase: { es: "Por clase de servicio", en: "By service class" },
    cagr: { es: "CAGR %/año", en: "CAGR %/yr" }, todasClases: { es: "todas (*)", en: "all (*)" },
    anioBase: { es: "año base", en: "base year" }, anio: { es: "año a simular", en: "year to simulate" },
    notaCre: { es: "Multiplica por (1+g)^(año − año base). Vacío = sin crecimiento.", en: "Multiplies by (1+g)^(year − base year). Empty = no growth." },
    // ruido / MC
    sigma: { es: "σ (lognormal)", en: "σ (lognormal)" }, semilla: { es: "semilla", en: "seed" },
    replicas: { es: "réplicas", en: "replicas" }, pasoMC: { es: "paso", en: "step" },
    calcular: { es: "Calcular bandas", en: "Compute bands" }, calculando: { es: "calculando réplicas…", en: "computing replicas…" },
    verTiempo: { es: "Ver en TIEMPO", en: "Show in TIME" }, quitarBandas: { es: "Quitar bandas", en: "Clear bands" },
    sigma0: { es: "Con σ = 0 todas las réplicas son iguales: sube σ para ver la dispersión.", en: "With σ = 0 all replicas are identical: raise σ to see the spread." },
    picoMC: { es: "Pico de ocupación (máx. del día por réplica)", en: "Occupancy peak (daily max per replica)" },
    probEnl: { es: "Enlaces con más probabilidad de pasar del 85 %", en: "Links most likely to exceed 85 %" },
    notaRuido: { es: "Misma semilla = misma película. La serie de TIEMPO usa esta semilla; las réplicas, «semilla#k».", en: "Same seed = same time series. TIME uses this seed; the replicas use “seed#k”." },
    // movilidad
    movAct: { es: "Movilidad pendular activa", en: "Commuting mobility on" }, fraccion: { es: "fracción del móvil residencial que se desplaza", en: "share of residential mobile that commutes" },
    notaMov: { es: "Traslada esa fracción del móvil y la voz IMS de zonas residenciales a oficinas/Centro en horario laboral (supuesto mod.movilidad).", en: "Moves that share of mobile and IMS voice from residential zones to offices/centre in working hours (assumption mod.movilidad)." },
    // guardar
    descJSON: { es: "Descargar JSON", en: "Download JSON" }, cargJSON: { es: "Cargar JSON…", en: "Load JSON…" },
    guardarNav: { es: "Guardar en este navegador", en: "Save in this browser" }, guardados: { es: "Guardados en este navegador", en: "Saved in this browser" },
    cargar: { es: "cargar", en: "load" }, borrar: { es: "borrar", en: "delete" }, sinGuardados: { es: "ninguno", en: "none" },
    sinAlmacen: { es: "Este navegador no deja guardar (almacenamiento bloqueado). Usa «Descargar JSON».", en: "This browser does not allow saving (storage blocked). Use “Download JSON”." },
    jsonMal: { es: "El JSON no es un modelo válido", en: "The JSON is not a valid model" },
    // comparar
    kpi: { es: "KPI", en: "KPI" }, ref: { es: "REF v7", en: "REF v7" }, labSin: { es: "LAB sin modelo", en: "LAB no model" }, labCon: { es: "LAB con modelo", en: "LAB with model" },
    dl: { es: "DL total · Gbit/s", en: "Total DL · Gbit/s" }, servida: { es: "Servida · Gbit/s", en: "Served · Gbit/s" }, pctS: { es: "Servido · %", en: "Served · %" },
    ocMax: { es: "Ocup. máx. (ofrecida) · %", en: "Max. occ. (offered) · %" }, sat: { es: "Enlaces > 85 %", en: "Links > 85 %" }, afect: { es: "Demandas afectadas", en: "Affected demands" },
    alarmas: { es: "Alertas (grave + aviso)", en: "Alerts (major + warning)" },
    notaCmp: { es: "Foto del caso a su hora (sin película). Δ = LAB con modelo − REF.", en: "Case snapshot at its hour (no time series). Δ = LAB with model − REF." }
  };
  var CLASES = Motor.CLASES_SERVICIO || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var NOMSV = { movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo", en: "FTTH fixed" }, voz: { es: "Voz", en: "Voice" },
    urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT", en: "IoT" }, empresa: { es: "Empresa", en: "Enterprise" },
    evento: { es: "Evento (MEC)", en: "Event (MEC)" }, ntn: { es: "Satélite NTN", en: "NTN satellite" } };
  function nomSv(c) { var i = NOC.infoServicio && NOC.infoServicio[c]; return t((i && i.n) || NOMSV[c] || { es: c, en: c }); }
  // Perfil de referencia de cada clase (el de la mayoría de sus demandas en RED; supuesto S-027 del generador)
  var PERFIL_CLASE = { movil: "residencial", ftth: "residencial", voz: "residencial", urllc: "movilidad", iot: "iot", empresa: "empresa", evento: "evento", ntn: "residencial" };
  var MT = RED.modelos_trafico || {};
  var PERFILES = {};
  Object.keys(RED.perfiles || {}).forEach(function (k) { PERFILES[k] = RED.perfiles[k]; });
  Object.keys(MT.perfiles_extra || {}).forEach(function (k) { if (k.charAt(0) !== "_" && Array.isArray(MT.perfiles_extra[k])) PERFILES[k] = MT.perfiles_extra[k]; });
  var TECS = [];
  try { TECS = (Motor.tecnologias ? Motor.tecnologias(RED) : []).filter(function (x) { return (x.capa !== "sitio" && x.capa !== "nucleo") || x.id === "voz"; }); } catch (e) { TECS = []; }
  function clasesTec(id) { var x = TECS.filter(function (q) { return q.id === id; })[0]; if (x && x.clases && x.clases.length) return x.clases.slice(); try { return Motor.claseDeTec ? Motor.claseDeTec(id) || [] : []; } catch (e) { return []; } }
  var ZONAS = (RED.zonas || []).map(function (z) { return { id: z.id, nombre: z.nombre || z.id }; });

  // ---------------------------------------------------------------- estado
  var E = {
    abierto: false, D: null, imp: null, impMsg: "", mc: null, mcEstado: "", mcErr: "", mcGen: 0,
    cur: { tipo: "perfil", obj: "residencial", zona: "*" },
    n: 20, pasoMC: 60, tApl: 0, msg: ""
  };
  try { var c0 = JSON.parse(leer("noc.modelo.ui") || "null"); if (c0) { if (c0.cur) E.cur = c0.cur; if (c0.n) E.n = c0.n; if (c0.pasoMC) E.pasoMC = c0.pasoMC; } } catch (e) { /* nada */ }
  function guardarUI() { guardar("noc.modelo.ui", JSON.stringify({ cur: E.cur, n: E.n, pasoMC: E.pasoMC })); }
  function modeloCaso() { return NOC.caso && NOC.caso.modelo_usuario && typeof NOC.caso.modelo_usuario === "object" ? NOC.caso.modelo_usuario : null; }
  function borrador() { if (!E.D) E.D = copia(modeloCaso()) || {}; return E.D; }
  function vacio(mu) {
    if (!mu) return true;
    var ks = ["perfiles", "factores", "crecimiento", "prioridades"];
    for (var i = 0; i < ks.length; i++) if (mu[ks[i]] && Object.keys(mu[ks[i]]).length) return false;
    if (mu.ruido && mu.ruido.sigma > 0) return false;
    if (mu.movilidad && mu.movilidad.activa) return false;
    if (esNum(mu.anio)) return false;
    if (mu.eventos_demanda && mu.eventos_demanda.length) return false;
    return true;
  }
  function limpiar(mu) {
    ["perfiles", "factores", "crecimiento", "prioridades", "proc"].forEach(function (k) { if (mu[k] && !Object.keys(mu[k]).length) delete mu[k]; });
    if (mu.ruido && !(mu.ruido.sigma > 0) && mu.ruido.semilla == null) delete mu.ruido;
    return mu;
  }
  function marcar(clave) {
    var D = borrador();
    D.proc = D.proc || {};
    D.proc[clave] = { t: "usuario", f: FUENTE_ED };
    if (!D.fuente) D.fuente = FUENTE_ED;
    else if (String(D.fuente).split(" + ").indexOf(FUENTE_ED) < 0) D.fuente += " + " + FUENTE_ED;
  }
  // Aplica el borrador al caso (con retardo para no recalcular en cada tecla)
  function aplicar(inmediato) {
    clearTimeout(E.tApl);
    function ya() {
      E.tApl = 0;
      var D = limpiar(borrador());
      if (!D.id) D.id = "editor";
      if (!D.nombre) D.nombre = t({ es: "Modelo propio", en: "Own model" });
      NOC.aplicarModelo(vacio(D) ? null : copia(D));
      pintarEstadoModelo(); pintarBoton();
    }
    if (inmediato) ya(); else E.tApl = setTimeout(ya, 380);
  }
  function pendiente() { if (E.tApl) aplicar(true); }

  // ---------------------------------------------------------------- botón en la barra del caso
  function pintarBoton() {
    var tb = document.getElementById("tb");
    if (!tb) return;
    var b = tb.querySelector(".em-btn");
    if (!b) {
      var ancla = tb.querySelector(".caso-resumen");
      if (!ancla) return;
      b = document.createElement("button");
      b.type = "button"; b.className = "btn em-btn"; b.setAttribute("data-em", "alternar");
      ancla.parentNode.insertBefore(b, ancla);
    }
    var mu = NOC.modo === "lab" ? modeloCaso() : null;
    b.classList.toggle("activo", E.abierto);
    b.classList.toggle("con-modelo", !!mu);
    b.classList.toggle("ref", NOC.modo === "ref");
    b.setAttribute("aria-pressed", String(E.abierto));
    b.title = t(TX.botonTit) + (NOC.modo === "ref" ? " · " + t({ es: "solo LAB", en: "LAB only" }) : "");
    b.innerHTML = esc(t(TX.boton)) + (mu ? ' <span class="em-n mono">' + esc(resumenCorto(mu)) + '</span>' : "");
  }
  function resumenCorto(mu) {
    var n = 0;
    ["perfiles", "factores", "crecimiento", "prioridades"].forEach(function (k) { n += Object.keys(mu[k] || {}).length; });
    if (mu.ruido && mu.ruido.sigma > 0) n++;
    if (mu.movilidad && mu.movilidad.activa) n++;
    return String(n);
  }

  // ---------------------------------------------------------------- panel
  var panel = null;
  function abrir() {
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "em"; panel.id = "em-panel";
      panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", t(TX.titulo));
      document.body.appendChild(panel);
      engancharPanel();
    }
    E.abierto = true; E.D = copia(modeloCaso()) || {};
    if (window.Exportar && Exportar.cerrarPanel) { try { Exportar.cerrarPanel(); } catch (e) { /* nada */ } }
    panel.hidden = false;
    pintarPanel(); pintarBoton();
  }
  function cerrar() { pendiente(); E.abierto = false; if (panel) panel.hidden = true; pintarBoton(); }
  function sec(id, tit, cuerpo, extra) {
    var pid = "em:" + id, pl = NOC.plegado ? NOC.plegado(pid) : false;
    return '<section class="em-sec' + (pl ? " plegado" : "") + '" data-plegable="' + pid + '" data-sec="' + id + '">' +
      '<button type="button" class="plg em-sec-cab" data-em-plegar="' + pid + '" data-plegar="' + pid + '" aria-expanded="' + !pl + '"><span class="ind">' + (pl ? "▸" : "▾") + '</span>' +
      esc(t(tit)) + (extra ? ' <span class="em-cnt">' + extra + '</span>' : '') + '</button><div class="em-sec-cuerpo">' + cuerpo + '</div></section>';
  }
  function pintarPanel() {
    if (!panel || !E.abierto) return;
    var cab = '<div class="em-cab"><span class="lbl">' + esc(t(TX.titulo)) + '</span><span class="em-modo">' + (NOC.modo === "lab" ? "LAB" : "REF") + '</span>' +
      '<span class="em-esp"></span><button type="button" class="em-x" data-em="cerrar" title="' + esc(t(TX.cerrar)) + '" aria-label="' + esc(t(TX.cerrar)) + '">×</button></div>';
    if (NOC.modo !== "lab") {
      panel.innerHTML = cab + '<div class="em-ref"><p>' + esc(t(TX.soloLab)) + '</p><button type="button" class="btn prim" data-em="a-lab">' + esc(t(TX.aLab)) + '</button></div>';
      return;
    }
    var D = borrador();
    panel.innerHTML = cab +
      '<div class="em-estado" id="em-estado"></div>' +
      sec("imp", TX.sImp, htmlImportar(), E.imp ? (E.imp.errores.length ? '<span class="sev sev-crit">' + E.imp.errores.length + '</span>' : '') : '') +
      sec("cur", TX.sCur, htmlCurvas(), D.perfiles ? Object.keys(D.perfiles).length : "") +
      sec("fac", TX.sFac, htmlFactores(), D.factores ? Object.keys(D.factores).length : "") +
      sec("cre", TX.sCre, htmlCrec(), D.crecimiento ? Object.keys(D.crecimiento).length : "") +
      sec("rui", TX.sRui, htmlRuido(), E.mc && mcVigente() ? "MC " + E.mc.n : "") +
      sec("mov", TX.sMov, htmlMov(), D.movilidad && D.movilidad.activa ? "ON" : "") +
      sec("gua", TX.sGua, htmlGuardar()) +
      sec("cmp", TX.sCmp, '<div id="em-cmp"></div>');
    pintarEstadoModelo();
    pintarSvgCurva();
    pintarComparar();
  }
  function pintarEstadoModelo() {
    var el = panel && panel.querySelector("#em-estado");
    if (!el) return;
    var mu = modeloCaso(), D = borrador();
    var partes = [];
    if (mu) {
      [["perfiles", { es: "curvas", en: "curves" }], ["factores", { es: "factores", en: "factors" }], ["crecimiento", { es: "CAGR", en: "CAGR" }], ["prioridades", { es: "prioridades", en: "priorities" }]].forEach(function (k) {
        var n = Object.keys(mu[k[0]] || {}).length; if (n) partes.push(n + " " + t(k[1]));
      });
      if (mu.ruido && mu.ruido.sigma > 0) partes.push("σ " + fmt(mu.ruido.sigma, 2));
      if (mu.movilidad && mu.movilidad.activa) partes.push(t({ es: "movilidad", en: "mobility" }));
    }
    var r = NOC.resultado && NOC.resultado.modelo_usuario, av = r && r.avisos && r.avisos.length ? r.avisos : [];
    el.innerHTML = '<label class="em-fila"><span class="rot">' + esc(t(TX.nombre)) + '</span><input type="text" class="em-in em-nombre" data-em-in="nombre" value="' + esc(D.nombre || "") + '" placeholder="' + esc(t({ es: "Modelo propio", en: "Own model" })) + '"></label>' +
      '<div class="em-res dato-usr">' + (mu ? '<b>' + esc(t(TX.activo)) + '</b> · ' + esc(partes.join(" · ") || "—") + (mu.fuente ? ' <span class="tx3">· ' + esc(mu.fuente) + '</span>' : '') +
        (r ? ' <span class="tx3">· ' + fmt(r.demandas_usuario || 0, 0) + ' ' + esc(t({ es: "demandas tocadas", en: "demands touched" })) + '</span>' : '') :
        '<span class="tx3">' + esc(t(TX.sinModelo)) + '</span>') +
      (mu ? ' <button type="button" class="btn em-quitar" data-em="quitar">' + esc(t(TX.quitar)) + '</button>' : '') + '</div>' +
      (av.length ? '<ul class="em-avisos-motor">' + av.slice(0, 6).map(function (a) { return '<li><span class="sev sev-min">MIN</span> ' + esc(a) + '</li>'; }).join("") + '</ul>' : '') +
      (E.msg ? '<div class="em-msg">' + esc(E.msg) + '</div>' : '');
  }

  // ---------------------------------------------------------------- importar
  function htmlImportar() {
    if (!Importar) return '<p class="nota sev-crit">' + esc(t(TX.sinImportar)) + '</p>';
    var pls = [];
    try { pls = Importar.plantillas(RED) || []; } catch (e) { pls = []; }
    var h = '<div class="em-drop" data-em-drop tabindex="0" role="button" aria-label="' + esc(t(TX.soltar)) + '"><span>' + esc(t(TX.soltar)) + '</span>' +
      '<span class="em-drop-acc"><button type="button" class="btn" data-em="elegir">' + esc(t(TX.elegir)) + '</button>' +
      '<label class="em-chk"><input type="checkbox" data-em-in="sumar"' + (E.sumar !== false ? " checked" : "") + '> ' + esc(t(TX.sumar)) + '</label></span>' +
      '<input type="file" class="em-file" data-em-file="csv" multiple accept=".csv,.txt,.json,text/csv,application/json" hidden></div>';
    h += '<div class="em-pl"><span class="rot">' + esc(t(TX.plantillas)) + '</span> ' + pls.map(function (p, i) {
      return '<button type="button" class="chip em-chip" data-em="plantilla" data-i="' + i + '" title="' + esc(p.desc || "") + '">' + esc(p.nombre) + '</button>';
    }).join(" ") + '</div>';
    if (E.impMsg) h += '<div class="em-msg">' + esc(typeof E.impMsg === "object" ? t(E.impMsg) : E.impMsg) + '</div>';
    var r = E.imp;
    if (r) {
      h += '<table class="tabla em-tab"><thead><tr><th>' + esc(t(TX.archivo)) + '</th><th>' + esc(t(TX.tabla)) + '</th><th class="n">' + esc(t(TX.filas)) + '</th><th></th></tr></thead><tbody>' +
        r.tablas.map(function (x) {
          return '<tr><td class="mono">' + esc(x.nombre) + '</td><td>' + esc(x.tabla || "—") + '</td><td class="n">' + fmt(x.filas || 0, 0) + '</td><td>' + (x.ok ? '<span class="sev sev-ok">OK</span>' : '<span class="sev sev-crit">CRIT</span>') + '</td></tr>';
        }).join("") + '</tbody></table>';
      var lista = r.errores.map(function (a) { return { n: "crit", a: a }; }).concat(r.avisos.map(function (a) { return { n: "min", a: a }; }));
      if (lista.length) {
        h += '<div class="em-sub"><span class="rot">' + esc(t(TX.errores)) + ' ' + r.errores.length + ' · ' + esc(t(TX.avisos)) + ' ' + r.avisos.length + '</span></div>' +
          '<div class="em-scroll"><table class="tabla em-tab em-av"><thead><tr><th></th><th>' + esc(t(TX.archivo)) + '</th><th class="n">' + esc(t(TX.fila)) + '</th><th>' + esc(t(TX.columna)) + '</th><th>' + esc(t(TX.texto)) + '</th></tr></thead><tbody>' +
          lista.slice(0, 200).map(function (x) {
            return '<tr class="sev-fila-' + x.n + '"><td><span class="sev sev-' + x.n + '">' + (x.n === "crit" ? "ERR" : "AVISO") + '</span></td><td class="mono">' + esc(x.a.archivo) + '</td><td class="n">' + (x.a.fila == null ? "" : x.a.fila) +
              '</td><td class="mono">' + esc(x.a.columna == null ? "" : x.a.columna) + '</td><td class="txt">' + esc(x.a.texto) + '</td></tr>';
          }).join("") + '</tbody></table></div>';
      }
      if (r.cambios.length) {
        h += '<div class="em-sub"><span class="rot">' + esc(t(TX.cambios)) + ' ' + r.cambios.length + '</span></div><div class="em-scroll em-scroll-c"><table class="tabla em-tab"><tbody>' +
          r.cambios.slice(0, 120).map(function (c) {
            var v = c.de != null || c.a != null ? (c.de != null ? fmtV(c.de) : "—") + " → " + (c.a != null ? fmtV(c.a) : "—") : "";
            return '<tr><td class="mono">' + esc(c.clave) + '</td><td class="n tx3">' + (c.fila != null ? esc(t(TX.fila)) + " " + c.fila : "") + '</td><td class="n">' + esc(v) + '</td></tr>';
          }).join("") + (r.cambios.length > 120 ? '<tr><td colspan="3" class="tx3">+' + (r.cambios.length - 120) + '</td></tr>' : '') + '</tbody></table></div>';
      }
      if (r.pendiente) {
        h += '<div class="em-acc"><span class="sev sev-crit">CRIT</span> <span class="nota">' + esc(t(TX.conErrores)) + '</span></div><div class="em-acc">' +
          (r.modelo_usuario ? '<button type="button" class="btn prim" data-em="imp-aplicar">' + esc(t(TX.aplicarIgual)) + '</button>' : '') +
          '<button type="button" class="btn" data-em="imp-descartar">' + esc(t(TX.descartar)) + '</button></div>';
      }
    }
    return h;
  }
  function fmtV(x) { return esNum(x) ? fmt(x, Math.abs(x) < 10 ? 3 : 1) : String(x); }
  function leerArchivos(files) {
    files = Array.prototype.slice.call(files || []);
    if (!files.length) return;
    E.impMsg = TX.leyendo; repintarSec("imp");
    Promise.all(files.map(function (f) {
      return (f.text ? f.text() : new Promise(function (ok, mal) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = mal; r.readAsText(f, "utf-8"); }))
        .then(function (txt) { return { nombre: f.name, texto: txt }; });
    })).then(function (lista) {
      var jsons = lista.filter(function (a) { return /\.json$/i.test(a.nombre); }), csvs = lista.filter(function (a) { return !/\.json$/i.test(a.nombre); });
      jsons.forEach(function (a) { cargarJSONTexto(a.texto, a.nombre); });
      if (!csvs.length) { E.impMsg = ""; pintarPanel(); return; }
      importarCSV(csvs);
    }, function (e) { E.impMsg = String(e && e.message || e); repintarSec("imp"); });
  }
  function importarCSV(lista) {
    var op = copia(NOC.opcionesCaso ? NOC.opcionesCaso() : NOC.opciones || {});
    delete op.modelo_usuario;
    var ctx = { RED: RED, opciones: op, Motor: Motor };
    if (E.sumar !== false && !vacio(borrador())) ctx.modelo = copia(borrador());
    var r;
    try { r = Importar.leerArchivos(lista, ctx); } catch (e) { console.error("Importar", e); E.impMsg = "Importar: " + (e && e.message || e); repintarSec("imp"); return; }
    E.imp = r; E.impMsg = "";
    if (r.ok && r.modelo_usuario) {
      E.D = copia(r.modelo_usuario);
      aplicar(true);
      E.impMsg = { es: TX.aplicado.es + " · " + r.cambios.length + " " + TX.cambios.es, en: TX.aplicado.en + " · " + r.cambios.length + " " + TX.cambios.en };
    } else r.pendiente = true;
    pintarPanel();
  }
  function descargar(texto, nombre, tipo) {
    var b = new Blob([texto], { type: tipo || "text/plain;charset=utf-8" });
    var u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = nombre; a.style.display = "none";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 1500);
  }

  // ---------------------------------------------------------------- curvas horarias
  function opcionesCurva(tipo) {
    if (tipo === "perfil") return Object.keys(PERFILES).map(function (k) { return { id: k, n: k }; });
    if (tipo === "clase") return CLASES.map(function (c) { return { id: c, n: nomSv(c) }; });
    return TECS.map(function (x) { return { id: x.id, n: NOC.lang === "en" ? (x.en || x.es || x.id) : (x.es || x.id) }; });
  }
  // Claves de modelo_usuario.perfiles que escribe la selección actual
  function clavesCurva(c) {
    c = c || E.cur;
    var base = c.tipo === "tec" ? clasesTec(c.obj) : [c.obj];
    return base.map(function (b) { return c.zona && c.zona !== "*" ? b + "|" + c.zona : b; });
  }
  function perfilBase(c) {
    c = c || E.cur;
    var p = c.tipo === "perfil" ? c.obj : PERFIL_CLASE[c.tipo === "tec" ? (clasesTec(c.obj)[0] || "movil") : c.obj] || "residencial";
    var a = PERFILES[p] || PERFILES.residencial;
    return a && a.length === 24 ? a.slice() : null;
  }
  // Curva vigente: la del modelo para la clave más concreta que ya exista (si no, la original)
  function curvaActual() {
    var D = borrador(), P = D.perfiles || {}, ks = clavesCurva();
    if (ks[0] && P[ks[0]]) return P[ks[0]].slice();
    if (E.cur.zona !== "*") { var gen = E.cur.tipo === "tec" ? clasesTec(E.cur.obj)[0] : E.cur.obj; if (gen && P[gen]) return P[gen].slice(); }
    return perfilBase();
  }
  function htmlCurvas() {
    var c = E.cur, ops = opcionesCurva(c.tipo);
    if (!ops.some(function (o) { return o.id === c.obj; }) && ops.length) c.obj = ops[0].id;
    var D = borrador(), P = D.perfiles || {};
    var hc = NOC.resultado && NOC.reloj && NOC.reloj.estado && NOC.reloj.estado().cargada;
    var h = '<div class="em-fila em-cur-sel">' +
      '<span class="rot">' + esc(t(TX.tipoCurva)) + '</span>' +
      '<div class="seg em-seg" role="group">' + ["perfil", "clase", "tec"].map(function (k) {
        return '<button type="button" data-em="cur-tipo" data-v="' + k + '" aria-pressed="' + (c.tipo === k) + '">' + esc(t(TX[k])) + '</button>';
      }).join("") + '</div>' +
      '<select class="sel" data-em-in="cur-obj" aria-label="' + esc(t(TX[c.tipo])) + '">' + ops.map(function (o) { return '<option value="' + esc(o.id) + '"' + (o.id === c.obj ? " selected" : "") + '>' + esc(o.n) + '</option>'; }).join("") + '</select>' +
      '<span class="rot">' + esc(t(TX.zona)) + '</span><select class="sel" data-em-in="cur-zona" aria-label="' + esc(t(TX.zona)) + '"><option value="*">' + esc(t(TX.todas)) + '</option>' +
      ZONAS.map(function (z) { return '<option value="' + esc(z.id) + '"' + (z.id === c.zona ? " selected" : "") + '>' + esc(z.nombre) + '</option>'; }).join("") + '</select></div>';
    if (c.tipo === "tec") h += '<div class="nota tx3">' + esc(t(TX.notaTec)) + ' ' + esc(clasesTec(c.obj).map(nomSv).join(", ") || "—") + '</div>';
    h += '<div class="em-svg" id="em-svg"></div>' +
      '<div class="em-fila em-cur-pie"><span class="em-ley"><span class="em-ley-i"><i class="ed"></i>' + esc(t(TX.editada)) + '</span><span class="em-ley-i"><i class="or"></i>' + esc(t(TX.original)) + '</span></span>' +
      '<span class="mono tx3 em-clave">' + esc(clavesCurva().join(", ")) + '</span><span class="em-esp"></span>' +
      '<button type="button" class="btn" data-em="cur-reset"' + (clavesCurva().some(function (k) { return P[k]; }) ? "" : " disabled") + '>' + esc(t(TX.restablecer)) + '</button></div>' +
      '<label class="em-valores"><span class="rot">' + esc(t(TX.valores)) + '</span><input type="text" class="em-in mono" data-em-in="cur-valores" spellcheck="false"></label>' +
      '<div class="nota tx3">' + esc(t(TX.ayudaCurva)) + (hc ? " " + esc(t(TX.notaHC)) : "") + '</div>';
    var ks = Object.keys(P);
    h += '<div class="em-pl"><span class="rot">' + esc(t(TX.curvasEd)) + '</span> ' + (ks.length ? ks.map(function (k) {
      return '<span class="chip em-chip dato-usr"><button type="button" class="em-lnk" data-em="cur-ir" data-k="' + esc(k) + '">' + esc(k) + '</button><button type="button" data-em="cur-borrar" data-k="' + esc(k) + '" aria-label="' + esc(t(TX.borrar)) + '">×</button></span>';
    }).join(" ") : '<span class="tx3">' + esc(t(TX.ninguna)) + '</span>') + '</div>';
    return h;
  }
  var SV_W = 470, SV_H = 176, ML = 34, MR = 8, MT_ = 8, MB = 20;
  var curva = null, original = null, arrastre = null, hoverH = -1;
  function yMax() { return Math.max(1.2, Math.ceil(Math.max.apply(null, curva.concat(original || [0])) * 1.1 * 10) / 10); }
  function X(h) { return ML + h / 23 * (SV_W - ML - MR); }
  function Y(v) { return SV_H - MB - v / yMax() * (SV_H - MB - MT_); }
  function pintarSvgCurva() {
    var cont = panel && panel.querySelector("#em-svg");
    if (!cont) return;
    if (!arrastre) { curva = curvaActual(); original = perfilBase(); }
    if (!curva) { cont.innerHTML = '<p class="nota tx3">—</p>'; return; }
    var ym = yMax(), g = '<svg class="em-curva" viewBox="0 0 ' + SV_W + ' ' + SV_H + '" width="100%" role="img" aria-label="' + esc(t(TX.sCur) + " " + clavesCurva().join(", ")) + '">';
    for (var v = 0; v <= ym + 1e-9; v += ym > 2 ? 0.5 : 0.25) {
      g += '<line class="em-rej' + (Math.abs(v - 1) < 1e-9 ? " uno" : "") + '" x1="' + ML + '" x2="' + (SV_W - MR) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' +
        '<text class="em-ty" x="' + (ML - 4) + '" y="' + (Y(v) + 3).toFixed(1) + '">' + fmt(v, 2) + '</text>';
    }
    g += '<text class="em-ty em-uno" x="' + (SV_W - MR) + '" y="' + (Y(1) - 3).toFixed(1) + '" text-anchor="end">' + esc(t({ es: "diseño (HC)", en: "design (BH)" })) + '</text>';
    [0, 3, 6, 9, 12, 15, 18, 21, 23].forEach(function (hh) { g += '<text class="em-tx" x="' + X(hh).toFixed(1) + '" y="' + (SV_H - 6) + '" text-anchor="middle">' + pad(hh) + '</text>'; });
    function ruta(a) { return a.map(function (x, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(x).toFixed(1); }).join(""); }
    if (original) g += '<path class="em-orig" d="' + ruta(original) + '"/>';
    g += '<path class="em-ed-area" d="' + ruta(curva) + 'L' + X(23).toFixed(1) + ' ' + Y(0).toFixed(1) + 'L' + X(0).toFixed(1) + ' ' + Y(0).toFixed(1) + 'Z"/>';
    g += '<path class="em-ed" d="' + ruta(curva) + '"/>';
    g += '<line class="em-hover" x1="0" x2="0" y1="' + MT_ + '" y2="' + (SV_H - MB) + '" visibility="hidden"/>';
    curva.forEach(function (x, i) {
      var cambia = original && Math.abs(x - original[i]) > 1e-6;
      g += '<circle class="em-pt' + (cambia ? " cambia" : "") + '" data-h="' + i + '" cx="' + X(i).toFixed(1) + '" cy="' + Y(x).toFixed(1) + '" r="4" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="' + ym + '" aria-valuenow="' + x.toFixed(3) + '" aria-label="' + pad(i) + ':00"/>';
    });
    g += '<rect class="em-hit" x="' + (ML - 8) + '" y="0" width="' + (SV_W - ML - MR + 16) + '" height="' + (SV_H - MB + 6) + '" fill="transparent"/>';
    g += '</svg><div class="em-tip" hidden></div>';
    cont.innerHTML = g;
    var inp = panel.querySelector('[data-em-in="cur-valores"]');
    if (inp && document.activeElement !== inp) inp.value = curva.map(function (x) { return fmt(x, 3); }).join("; ");
  }
  function moverPunto(h, v) {
    v = Math.max(0, Math.min(3, Math.round(v * 1000) / 1000));
    curva[h] = v;
    var svg = panel.querySelector(".em-curva");
    if (!svg) return;
    var c = svg.querySelector('.em-pt[data-h="' + h + '"]');
    if (c) { c.setAttribute("cy", Y(v).toFixed(1)); c.setAttribute("aria-valuenow", v.toFixed(3)); c.classList.toggle("cambia", !!original && Math.abs(v - original[h]) > 1e-6); }
    var d = curva.map(function (x, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(x).toFixed(1); }).join("");
    svg.querySelector(".em-ed").setAttribute("d", d);
    svg.querySelector(".em-ed-area").setAttribute("d", d + "L" + X(23).toFixed(1) + " " + Y(0).toFixed(1) + "L" + X(0).toFixed(1) + " " + Y(0).toFixed(1) + "Z");
    tip(h);
  }
  function tip(h) {
    var el = panel.querySelector(".em-tip"), svg = panel.querySelector(".em-curva");
    if (!el || !svg) return;
    var ln = svg.querySelector(".em-hover");
    if (h < 0) { el.hidden = true; if (ln) ln.setAttribute("visibility", "hidden"); return; }
    if (ln) { ln.setAttribute("x1", X(h).toFixed(1)); ln.setAttribute("x2", X(h).toFixed(1)); ln.setAttribute("visibility", "visible"); }
    el.innerHTML = '<b class="mono">' + pad(h) + ':00</b> <span class="mono">' + fmt(curva[h], 3) + '</span>' + (original ? ' <span class="tx3">· ' + esc(t(TX.original)) + ' ' + fmt(original[h], 3) + '</span>' : '');
    el.hidden = false;
    var r = svg.getBoundingClientRect(), s = r.width / SV_W, pr = svg.parentNode.getBoundingClientRect();
    var x = X(h) * s + (r.left - pr.left), y = Y(curva[h]) * s + (r.top - pr.top);
    var w = el.offsetWidth;
    el.style.left = Math.max(0, Math.min(pr.width - w, x - w / 2)) + "px";
    el.style.top = Math.max(0, y - 30) + "px";
  }
  function hDeEvento(svg, ev) {
    var r = svg.getBoundingClientRect(), s = r.width / SV_W;
    var x = (ev.clientX - r.left) / s, y = (ev.clientY - r.top) / s;
    var h = Math.round((x - ML) / (SV_W - ML - MR) * 23);
    return { h: Math.max(0, Math.min(23, h)), v: (SV_H - MB - y) / (SV_H - MB - MT_) * yMax() };
  }
  function guardarCurva() {
    if (!curva) return;
    var D = borrador();
    D.perfiles = D.perfiles || {};
    var igual = original && curva.every(function (x, i) { return Math.abs(x - original[i]) < 1e-6; });
    clavesCurva().forEach(function (k) {
      if (igual) { delete D.perfiles[k]; if (D.proc) delete D.proc["perfiles." + k]; }
      else { D.perfiles[k] = curva.slice(); marcar("perfiles." + k); }
    });
    aplicar();
    repintarSec("cur", true);
  }

  // ---------------------------------------------------------------- factores, crecimiento
  function inNum(attr, val, ph, extra) {
    return '<input type="text" inputmode="decimal" class="em-in em-num mono" ' + attr + ' value="' + (val == null || val === "" ? "" : esc(fmtIn(val))) + '" placeholder="' + esc(ph || "") + '"' + (extra || "") + '>';
  }
  function fmtIn(v) { return esNum(v) ? String(Math.round(v * 10000) / 10000).replace(".", NOC.lang === "es" ? "," : ".") : String(v); }
  function htmlFactores() {
    var F = borrador().factores || {};
    var h = '<div class="em-dos"><div><div class="em-sub"><span class="rot">' + esc(t(TX.porZona)) + '</span></div><table class="tabla em-tab em-kv"><tbody>' +
      ZONAS.map(function (z) {
        return '<tr' + (F[z.id] != null ? ' class="dato-usr"' : '') + '><td>' + esc(z.nombre) + '</td><td class="n">× ' + inNum('data-em-in="factor" data-k="' + esc(z.id) + '"', F[z.id], "1") + '</td></tr>';
      }).join("") + '</tbody></table></div>' +
      '<div><div class="em-sub"><span class="rot">' + esc(t(TX.porClase)) + '</span></div><table class="tabla em-tab em-kv"><tbody>' +
      CLASES.map(function (c) {
        var k = "clase:" + c, v = F[k] != null ? F[k] : F[c];
        return '<tr' + (v != null ? ' class="dato-usr"' : '') + '><td><i class="em-sw" style="background:var(--sv-' + c + ')"></i>' + esc(nomSv(c)) + '</td><td class="n">× ' + inNum('data-em-in="factor" data-k="' + esc(k) + '"', v, "1") + '</td></tr>';
      }).join("") + '</tbody></table></div></div>';
    var otros = Object.keys(F).filter(function (k) { return !ZONAS.some(function (z) { return z.id === k; }) && !/^clase:/.test(k) && CLASES.indexOf(k) < 0; });
    if (otros.length) h += '<div class="em-pl"><span class="rot">' + esc(t({ es: "otros factores (CSV)", en: "other factors (CSV)" })) + '</span> ' + otros.map(function (k) {
      return '<span class="chip em-chip dato-usr">' + esc(k) + ' × ' + fmt(F[k], 3) + '<button type="button" data-em="factor-borrar" data-k="' + esc(k) + '" aria-label="' + esc(t(TX.borrar)) + '">×</button></span>';
    }).join(" ") + '</div>';
    return h;
  }
  function htmlCrec() {
    var D = borrador(), G = D.crecimiento || {};
    var anios = []; for (var a = 2025; a <= 2040; a++) anios.push(a);
    var h = '<div class="em-fila"><span class="rot">' + esc(t(TX.anioBase)) + '</span>' + inNum('data-em-in="anio_base"', D.anio_base, "2031") +
      '<span class="rot">' + esc(t(TX.anio)) + '</span><select class="sel" data-em-in="anio"><option value="">' + esc(t({ es: "el del caso", en: "case year" })) + ' (' + ((NOC.caso && NOC.caso.anio) || 2031) + ')</option>' +
      anios.map(function (x) { return '<option value="' + x + '"' + (D.anio === x ? " selected" : "") + '>' + x + '</option>'; }).join("") + '</select></div>';
    h += '<table class="tabla em-tab em-kv em-crec"><thead><tr><th></th><th class="n">' + esc(t(TX.cagr)) + '</th><th class="n">' + esc(t({ es: "factor", en: "factor" })) + '</th></tr></thead><tbody>' +
      ["*"].concat(CLASES).map(function (c) {
        var g = G[c], f = factorCrec(c);
        return '<tr' + (g != null ? ' class="dato-usr"' : '') + '><td>' + (c === "*" ? esc(t(TX.todasClases)) : '<i class="em-sw" style="background:var(--sv-' + c + ')"></i>' + esc(nomSv(c))) + '</td><td class="n">' +
          inNum('data-em-in="crec" data-k="' + esc(c) + '"', g == null ? null : Math.round(g * 10000) / 100, "—") + '</td><td class="n mono tx3">' + (f == null ? "" : "× " + fmt(f, 3)) + '</td></tr>';
      }).join("") + '</tbody></table><div class="nota tx3">' + esc(t(TX.notaCre)) + '</div>';
    return h;
  }
  function factorCrec(c) {
    var D = borrador(), G = D.crecimiento || {}, g = G[c] != null ? G[c] : (c !== "*" ? G["*"] : null);
    if (g == null) return null;
    var anio = esNum(D.anio) ? D.anio : ((NOC.caso && NOC.caso.anio) || 2031), base = esNum(D.anio_base) ? D.anio_base : 2031;
    return Math.pow(1 + g, anio - base);
  }

  // ---------------------------------------------------------------- ruido, Montecarlo, movilidad
  function mcVigente() { return !!(E.mc && NOC.reloj && NOC.reloj.mc && NOC.reloj.mc() === E.mc); }
  function htmlRuido() {
    var R = borrador().ruido || {}, s = esNum(R.sigma) ? R.sigma : 0;
    var h = '<div class="em-fila"><span class="rot">' + esc(t(TX.sigma)) + '</span><input type="range" min="0" max="0.5" step="0.01" data-em-in="sigma" value="' + s + '" aria-label="σ">' +
      inNum('data-em-in="sigma-n"', s, "0") +
      '<span class="rot">' + esc(t(TX.semilla)) + '</span><input type="text" class="em-in em-num mono" data-em-in="semilla" value="' + esc(R.semilla == null ? "1" : R.semilla) + '"></div>' +
      '<div class="em-fila"><span class="rot">' + esc(t(TX.replicas)) + '</span>' + inNum('data-em-in="n"', E.n, "20") +
      '<span class="rot">' + esc(t(TX.pasoMC)) + '</span><select class="sel" data-em-in="pasoMC">' + [60, 30, 15].map(function (p) { return '<option value="' + p + '"' + (p === E.pasoMC ? " selected" : "") + '>' + p + ' min</option>'; }).join("") + '</select>' +
      '<button type="button" class="btn prim" data-em="mc"' + (E.mcEstado === "calc" ? " disabled" : "") + '>' + esc(t(TX.calcular)) + '</button></div>' +
      '<div class="nota tx3">' + esc(t(TX.notaRuido)) + '</div>' +
      '<div id="em-mc">' + htmlMC() + '</div>';
    return h;
  }
  function htmlMC() {
    if (E.mcEstado === "calc") return '<div class="em-msg">' + esc(t(TX.calculando)) + '</div>';
    if (E.mcErr) return '<div class="em-msg sev-crit">' + esc(E.mcErr) + '</div>';
    var mc = E.mc;
    if (!mc) return "";
    var vig = mcVigente();
    var h = '<div class="em-mc-res' + (vig ? "" : " viejo") + '"><div class="em-fila"><span class="mono">' + mc.n + ' ' + esc(t(TX.replicas)) + ' · σ ' + fmt(mc.sigma, 2) + ' · ' + esc(t(TX.semilla)) + ' ' + esc(mc.semilla) +
      ' · ' + mc.paso_min + ' min · ' + fmt(mc.ms || 0, 0) + ' ms' + (mc.via ? ' (' + esc(mc.via) + ')' : '') + '</span><span class="em-esp"></span>' +
      (vig ? '<button type="button" class="btn" data-em="ver-tiempo">' + esc(t(TX.verTiempo)) + '</button><button type="button" class="btn" data-em="mc-quitar">' + esc(t(TX.quitarBandas)) + '</button>' :
        '<span class="tx3">' + esc(t({ es: "caso cambiado: recalcula", en: "case changed: recompute" })) + '</span>') + '</div>';
    if (!(mc.sigma > 0)) h += '<div class="nota">' + esc(t(TX.sigma0)) + '</div>';
    if (mc.pico) {
      h += '<table class="tabla em-tab"><thead><tr><th>' + esc(t(TX.picoMC)) + '</th><th class="n">P50</th><th class="n">P95</th><th class="n">P99</th></tr></thead><tbody><tr><td>' + esc(t({ es: "Ocup. máx. · %", en: "Max. occ. · %" })) + '</td>' +
        ["p50", "p95", "p99"].map(function (k) { var v = mc.pico[k]; return '<td class="n">' + (esNum(v) ? NOC.insignia(NOC.sevOcupacion(v / 100)) + ' ' + fmt(v, 1) : "—") + '</td>'; }).join("") + '</tr></tbody></table>';
    }
    var enl = Object.keys(mc.enlaces || {}).map(function (id) { var e = mc.enlaces[id]; return { id: id, p85: e.prob_85 || 0, p100: e.prob_100 || 0, p95: e.ocup && e.ocup.p95 ? Math.max.apply(null, Array.prototype.slice.call(e.ocup.p95)) : 0 }; })
      .filter(function (x) { return x.p85 > 0; }).sort(function (a, b) { return b.p85 - a.p85 || b.p95 - a.p95; }).slice(0, 6);
    if (enl.length) {
      h += '<div class="em-sub"><span class="rot">' + esc(t(TX.probEnl)) + '</span></div><table class="tabla em-tab"><thead><tr><th>' + esc(t({ es: "enlace", en: "link" })) + '</th><th class="n">P(&gt;85 %)</th><th class="n">P(&gt;100 %)</th><th class="n">P95 ' + esc(t({ es: "máx.", en: "max." })) + '</th></tr></thead><tbody>' +
        enl.map(function (x) { return '<tr data-em-enl="' + esc(x.id) + '"><td class="mono">' + esc(x.id) + '</td><td class="n">' + fmt(x.p85 * 100, 0) + ' %</td><td class="n">' + fmt(x.p100 * 100, 0) + ' %</td><td class="n">' + fmt(x.p95, 1) + ' %</td></tr>'; }).join("") + '</tbody></table>';
    }
    if (mc.avisos && mc.avisos.length) h += '<ul class="em-avisos-motor">' + mc.avisos.slice(0, 4).map(function (a) { return '<li><span class="sev sev-min">MIN</span> ' + esc(a) + '</li>'; }).join("") + '</ul>';
    return h + '</div>';
  }
  function calcularMC() {
    pendiente();
    var op = copia(NOC.opcionesCaso ? NOC.opcionesCaso() : NOC.opciones || {});
    delete op.hora;
    if (op.caso && op.caso.trafico && typeof op.caso.trafico === "object") delete op.caso.trafico.hora;
    var ev = [];
    try { ev = NOC.operador && NOC.operador.eventosSerie ? NOC.operador.eventosSerie() : []; } catch (e) { ev = []; }
    var n = Math.max(2, Math.min(50, Math.round(E.n) || 20)), clave = NOC.reloj && NOC.reloj.clave ? NOC.reloj.clave() : null, gen = ++E.mcGen;
    E.mcEstado = "calc"; E.mcErr = ""; repintarSec("rui", true);
    var fn = Motor.serieMontecarlo || function (R, c, o, k) { return Promise.resolve(Motor.serieMontecarloSync(R, c, o, k)); };
    var t0 = (window.performance || Date).now();
    var p;
    try { p = fn(RED, op, { paso_min: E.pasoMC, desde: 0, hasta: 24, eventos: ev }, n); } catch (e) { p = Promise.reject(e); }
    Promise.resolve(p).then(function (mc) {
      if (gen !== E.mcGen) return;
      if (!esNum(mc.ms)) mc.ms = (window.performance || Date).now() - t0;
      E.mc = mc; E.mcEstado = "";
      if (NOC.reloj && NOC.reloj.montecarlo) NOC.reloj.montecarlo(mc, clave);
      repintarSec("rui", true);
    }, function (e) {
      if (gen !== E.mcGen) return;
      console.error("Motor.serieMontecarlo", e);
      E.mcEstado = ""; E.mcErr = "Montecarlo: " + (e && e.message || e); repintarSec("rui", true);
    });
  }
  function htmlMov() {
    var M = borrador().movilidad || {}, f = esNum(M.fraccion) ? M.fraccion : 0.2;
    return '<div class="em-fila"><label class="em-chk"><input type="checkbox" data-em-in="mov"' + (M.activa ? " checked" : "") + '> ' + esc(t(TX.movAct)) + '</label></div>' +
      '<div class="em-fila"><span class="rot">' + esc(t(TX.fraccion)) + '</span><input type="range" min="0" max="1" step="0.05" data-em-in="mov-f" value="' + f + '"' + (M.activa ? "" : " disabled") + '>' +
      '<output class="mono" id="em-mov-o">' + fmt(f * 100, 0) + ' %</output></div><div class="nota tx3">' + esc(t(TX.notaMov)) + '</div>' +
      (NOC.resultado && NOC.resultado.modelo_usuario && NOC.resultado.modelo_usuario.movilidad ? '<div class="nota">' + esc(t({ es: "Movido en esta foto: ", en: "Moved in this snapshot: " })) +
        fmt(NOC.resultado.modelo_usuario.movilidad.gbps_movidos || 0, 1) + ' Gbit/s</div>' : '');
  }

  // ---------------------------------------------------------------- guardar / cargar
  function guardados() { try { return JSON.parse(leer("noc.modelos") || "{}") || {}; } catch (e) { return {}; } }
  function htmlGuardar() {
    var G = guardados(), ks = Object.keys(G).sort();
    return '<div class="em-fila"><button type="button" class="btn" data-em="json-bajar">' + esc(t(TX.descJSON)) + '</button>' +
      '<button type="button" class="btn" data-em="json-cargar">' + esc(t(TX.cargJSON)) + '</button><input type="file" data-em-file="json" accept=".json,application/json" hidden>' +
      '<button type="button" class="btn" data-em="ls-guardar">' + esc(t(TX.guardarNav)) + '</button></div>' +
      '<div class="em-sub"><span class="rot">' + esc(t(TX.guardados)) + '</span></div>' +
      (ks.length ? '<table class="tabla em-tab"><tbody>' + ks.map(function (k) {
        var m = G[k] || {};
        return '<tr><td>' + esc(k) + '</td><td class="tx3 mono">' + esc(m._guardado || "") + '</td><td class="n"><button type="button" class="btn" data-em="ls-cargar" data-k="' + esc(k) + '">' + esc(t(TX.cargar)) + '</button> ' +
          '<button type="button" class="btn" data-em="ls-borrar" data-k="' + esc(k) + '">' + esc(t(TX.borrar)) + '</button></td></tr>';
      }).join("") + '</tbody></table>' : '<div class="tx3">' + esc(t(TX.sinGuardados)) + '</div>');
  }
  function modeloParaGuardar() {
    var D = limpiar(copia(borrador()));
    if (!D.id) D.id = "editor";
    if (!D.nombre) D.nombre = t({ es: "Modelo propio", en: "Own model" });
    return D;
  }
  function cargarJSONTexto(txt, nombre) {
    var o;
    try { o = JSON.parse(String(txt).replace(/^﻿/, "")); } catch (e) { E.msg = t(TX.jsonMal) + " (" + nombre + "): " + e.message; return false; }
    if (o && o.modelo_usuario) o = o.modelo_usuario;
    if (!o || typeof o !== "object" || Array.isArray(o)) { E.msg = t(TX.jsonMal) + " (" + nombre + ")"; return false; }
    delete o._guardado;
    if (!o.fuente) o.fuente = nombre;
    E.D = o; E.msg = nombre + " · " + t(TX.aplicado);
    aplicar(true);
    return true;
  }

  // ---------------------------------------------------------------- comparar con REF
  function kpis(r) {
    if (!r || !r.resumen) return null;
    var s = r.resumen, sat = 0, om = 0, omId = s.enlace_max;
    Object.keys(r.enlaces || {}).forEach(function (k) {
      var e = r.enlaces[k], o = NOC.ocupacion ? NOC.ocupacion(e) : e.ocupacion;
      if (e.caido || !esNum(o)) return;
      if (o >= 0.85) sat++;
      if (o > om) { om = o; omId = k; }
    });
    var al = (s.alertas || []).filter(function (a) { return a.nivel === "grave" || a.nivel === "aviso"; }).length;
    return { dl: s.dl_total_gbps, servida: s.servida_gbps, pct: s.pct_servida, oc: Math.max(om, s.max_ocupacion || 0) * 100, ocId: omId, sat: sat, afect: s.demandas_afectadas || 0, al: al };
  }
  var tCmp = 0;
  function pintarComparar() {
    var el = panel && panel.querySelector("#em-cmp");
    if (!el || NOC.plegado("em:cmp")) return;
    clearTimeout(tCmp);
    tCmp = setTimeout(function () {
      var op = NOC.opcionesCaso ? NOC.opcionesCaso() : null, rCon = null, rSin = null;
      if (!op) return;
      try {
        rCon = Motor.calcular(RED, copia(op));
        var o2 = copia(op); delete o2.modelo_usuario;
        rSin = op.modelo_usuario ? Motor.calcular(RED, o2) : rCon;
      } catch (e) { el.innerHTML = '<div class="em-msg sev-crit">' + esc(e.message || e) + '</div>'; return; }
      var R0 = kpis(NOC.referencia), S0 = kpis(rSin), C0 = kpis(rCon);
      var filas = [["dl", TX.dl, 0], ["servida", TX.servida, 0], ["pct", TX.pctS, 2], ["oc", TX.ocMax, 1], ["sat", TX.sat, 0], ["afect", TX.afect, 0], ["al", TX.alarmas, 0]];
      var mejorArriba = { dl: 0, servida: 0, pct: 1, oc: -1, sat: -1, afect: -1, al: -1 };
      el.innerHTML = '<table class="tabla em-tab em-cmp"><thead><tr><th>' + esc(t(TX.kpi)) + '</th><th class="n">' + esc(t(TX.ref)) + '</th><th class="n">' + esc(t(TX.labSin)) + '</th><th class="n">' + esc(t(TX.labCon)) + '</th><th class="n">Δ</th></tr></thead><tbody>' +
        filas.map(function (f) {
          var a = R0 ? R0[f[0]] : null, b = S0 ? S0[f[0]] : null, c = C0 ? C0[f[0]] : null, d = esNum(a) && esNum(c) ? c - a : null;
          var sg = d == null || Math.abs(d) < Math.pow(10, -f[2]) / 2 ? "" : (mejorArriba[f[0]] === 0 ? "" : (d * mejorArriba[f[0]] > 0 ? "mejor" : "peor"));
          return '<tr><td>' + esc(t(f[1])) + '</td><td class="n">' + (esNum(a) ? fmt(a, f[2]) : "—") + '</td><td class="n tx2">' + (esNum(b) ? fmt(b, f[2]) : "—") + '</td><td class="n dato-usr-n">' + (esNum(c) ? fmt(c, f[2]) : "—") +
            '</td><td class="n em-d ' + sg + '">' + (d == null ? "—" : (d > 0 ? "+" : d < 0 ? "−" : "±") + fmt(Math.abs(d), f[2])) + '</td></tr>';
        }).join("") + '</tbody></table>' +
        '<div class="nota tx3">' + esc(t(TX.notaCmp)) + (C0 && C0.ocId ? ' ' + esc(t({ es: "Ocup. máx. en", en: "Max. occ. at" })) + ' <span class="mono">' + esc(C0.ocId) + '</span>.' : '') + '</div>';
    }, 120);
  }

  // ---------------------------------------------------------------- repintado parcial
  function repintarSec(id, conservarFoco) {
    if (!panel) return;
    var s = panel.querySelector('.em-sec[data-sec="' + id + '"] .em-sec-cuerpo');
    if (!s) { pintarPanel(); return; }
    var html = id === "imp" ? htmlImportar() : id === "cur" ? htmlCurvas() : id === "fac" ? htmlFactores() : id === "cre" ? htmlCrec() : id === "rui" ? htmlRuido() : id === "mov" ? htmlMov() : id === "gua" ? htmlGuardar() : null;
    if (html == null) return;
    var foco = conservarFoco && document.activeElement && s.contains(document.activeElement) ? document.activeElement.getAttribute("data-em-in") : null;
    s.innerHTML = html;
    if (id === "cur") pintarSvgCurva();
    if (foco) { var f = s.querySelector('[data-em-in="' + foco + '"]'); if (f) f.focus(); }
  }

  // ---------------------------------------------------------------- eventos del panel
  function engancharPanel() {
    panel.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-em-plegar]");
      if (b) { NOC.plegar(b.getAttribute("data-em-plegar")); if (b.getAttribute("data-em-plegar") === "em:cmp") pintarComparar(); if (b.getAttribute("data-em-plegar") === "em:cur") pintarSvgCurva(); return; }
      var tr = ev.target.closest("tr[data-em-enl]");
      if (tr) { NOC.seleccionar("enlace", tr.getAttribute("data-em-enl")); return; }
      b = ev.target.closest("[data-em]");
      if (!b) return;
      var a = b.getAttribute("data-em"), D = borrador(), k = b.getAttribute("data-k");
      if (a === "cerrar") cerrar();
      else if (a === "a-lab") { NOC.setModo("lab"); }
      else if (a === "quitar") { E.D = {}; E.imp = null; E.msg = ""; aplicar(true); pintarPanel(); }
      else if (a === "elegir") { var f = panel.querySelector('[data-em-file="csv"]'); if (f) f.click(); }
      else if (a === "plantilla") {
        var pls = Importar.plantillas(RED), p = pls[Number(b.getAttribute("data-i"))];
        if (p) descargar(p.texto, p.nombre, "text/csv;charset=utf-8");
      }
      else if (a === "imp-aplicar") { if (E.imp && E.imp.modelo_usuario) { E.D = copia(E.imp.modelo_usuario); E.imp.pendiente = false; E.impMsg = TX.aplicado; aplicar(true); pintarPanel(); } }
      else if (a === "imp-descartar") { E.imp = null; E.impMsg = ""; repintarSec("imp"); }
      else if (a === "cur-tipo") { E.cur.tipo = b.getAttribute("data-v"); E.cur.obj = (opcionesCurva(E.cur.tipo)[0] || {}).id; guardarUI(); repintarSec("cur"); }
      else if (a === "cur-reset") {
        if (D.perfiles) clavesCurva().forEach(function (x) { delete D.perfiles[x]; if (D.proc) delete D.proc["perfiles." + x]; });
        aplicar(); repintarSec("cur");
      }
      else if (a === "cur-ir" || a === "cur-borrar") {
        if (a === "cur-borrar") { if (D.perfiles) delete D.perfiles[k]; if (D.proc) delete D.proc["perfiles." + k]; aplicar(); repintarSec("cur"); return; }
        var i = k.indexOf("|"), base = i >= 0 ? k.slice(0, i) : k, z = i >= 0 ? k.slice(i + 1) : "*";
        E.cur = { tipo: PERFILES[base] ? "perfil" : CLASES.indexOf(base) >= 0 ? "clase" : "perfil", obj: base, zona: z };
        guardarUI(); repintarSec("cur");
      }
      else if (a === "factor-borrar") { if (D.factores) delete D.factores[k]; aplicar(); repintarSec("fac"); }
      else if (a === "mc") calcularMC();
      else if (a === "mc-quitar") { E.mc = null; if (NOC.reloj && NOC.reloj.montecarlo) NOC.reloj.montecarlo(null); repintarSec("rui"); }
      else if (a === "ver-tiempo") { var d = document.querySelector('[data-dock="tiempo"]'); if (d) d.click(); }
      else if (a === "json-bajar") { var m = modeloParaGuardar(); descargar(JSON.stringify(m, null, 2), (m.id || "modelo") + ".json", "application/json"); }
      else if (a === "json-cargar") { var fj = panel.querySelector('[data-em-file="json"]'); if (fj) fj.click(); }
      else if (a === "ls-guardar") {
        var mg = modeloParaGuardar(), G = guardados();
        mg._guardado = new Date().toISOString().slice(0, 16).replace("T", " ");
        G[mg.nombre] = mg;
        E.msg = guardar("noc.modelos", JSON.stringify(G)) ? mg.nombre + " · " + t({ es: "guardado", en: "saved" }) : t(TX.sinAlmacen);
        pintarEstadoModelo(); repintarSec("gua");
      }
      else if (a === "ls-cargar") { var G2 = guardados(); if (G2[k]) { cargarJSONTexto(JSON.stringify(G2[k]), k); pintarPanel(); } }
      else if (a === "ls-borrar") { var G3 = guardados(); delete G3[k]; guardar("noc.modelos", JSON.stringify(G3)); repintarSec("gua"); }
    });
    panel.addEventListener("change", function (ev) {
      var el = ev.target, a = el.getAttribute("data-em-in"), fl = el.getAttribute("data-em-file");
      if (fl === "csv") { leerArchivos(el.files); el.value = ""; return; }
      if (fl === "json") {
        var f = el.files && el.files[0];
        if (f) f.text().then(function (txt) { cargarJSONTexto(txt, f.name); pintarPanel(); });
        el.value = ""; return;
      }
      if (!a) return;
      var D = borrador();
      if (a === "sumar") { E.sumar = el.checked; return; }
      if (a === "cur-obj") { E.cur.obj = el.value; guardarUI(); repintarSec("cur"); return; }
      if (a === "cur-zona") { E.cur.zona = el.value; guardarUI(); repintarSec("cur"); return; }
      if (a === "cur-valores") {
        var vs = el.value.split(/[;\t\n]+|\s{2,}/).map(function (x) { return numero(x.trim()); }).filter(function (x) { return x !== null; });
        if (vs.length === 24 && vs.every(function (x) { return esNum(x) && x >= 0; })) { curva = vs; guardarCurva(); }
        else { el.classList.add("mal"); el.title = t({ es: "Hacen falta 24 números ≥ 0", en: "24 numbers ≥ 0 needed" }); }
        return;
      }
      if (a === "anio") { if (el.value) { D.anio = Number(el.value); marcar("anio"); } else delete D.anio; aplicar(); repintarSec("cre"); return; }
      if (a === "pasoMC") { E.pasoMC = Number(el.value); guardarUI(); return; }
      if (a === "mov") {
        D.movilidad = D.movilidad || {};
        D.movilidad.activa = el.checked;
        if (!esNum(D.movilidad.fraccion)) D.movilidad.fraccion = 0.2;
        if (!el.checked) delete D.movilidad;
        else marcar("movilidad");
        aplicar(); repintarSec("mov"); return;
      }
    });
    panel.addEventListener("input", function (ev) {
      var el = ev.target, a = el.getAttribute("data-em-in"), D = borrador(), k = el.getAttribute("data-k");
      if (!a) return;
      el.classList.remove("mal");
      var v = el.value.trim() === "" ? null : numero(el.value);
      var malo = v !== null && !esNum(v);
      if (a === "nombre") { D.nombre = el.value; aplicar(); return; }
      if (a === "factor") {
        if (malo || (v !== null && v < 0)) { el.classList.add("mal"); return; }
        D.factores = D.factores || {};
        if (/^clase:/.test(k)) delete D.factores[k.slice(6)];
        if (v === null || Math.abs(v - 1) < 1e-12) { delete D.factores[k]; if (D.proc) delete D.proc["factores." + k]; }
        else { D.factores[k] = v; marcar("factores." + k); }
        el.closest("tr").classList.toggle("dato-usr", v !== null && Math.abs(v - 1) >= 1e-12);
        aplicar(); return;
      }
      if (a === "crec") {
        if (malo || (v !== null && (v <= -50 || v > 100))) { el.classList.add("mal"); return; }
        D.crecimiento = D.crecimiento || {};
        if (v === null) delete D.crecimiento[k]; else { D.crecimiento[k] = v / 100; marcar("crecimiento"); }
        aplicar();
        var tb = el.closest("tbody");
        Array.prototype.forEach.call(tb.querySelectorAll("tr"), function (tr, i) {
          var c = ["*"].concat(CLASES)[i], f = factorCrec(c), td = tr.querySelector("td.tx3");
          if (td) td.textContent = f == null ? "" : "× " + fmt(f, 3);
          tr.classList.toggle("dato-usr", (D.crecimiento || {})[c] != null);
        });
        return;
      }
      if (a === "anio_base") {
        if (malo || (v !== null && (v < 2000 || v > 2100))) { el.classList.add("mal"); return; }
        if (v === null) delete D.anio_base; else D.anio_base = Math.round(v);
        aplicar(); return;
      }
      if (a === "sigma" || a === "sigma-n") {
        if (malo || (v !== null && (v < 0 || v > 2))) { el.classList.add("mal"); return; }
        D.ruido = D.ruido || {};
        D.ruido.sigma = v || 0;
        if (D.ruido.semilla == null) D.ruido.semilla = 1;
        marcar("ruido");
        var otro = panel.querySelector('[data-em-in="' + (a === "sigma" ? "sigma-n" : "sigma") + '"]');
        if (otro) otro.value = a === "sigma" ? fmtIn(v || 0) : String(v || 0);
        aplicar(); return;
      }
      if (a === "semilla") { D.ruido = D.ruido || { sigma: 0 }; var sv = el.value.trim(); D.ruido.semilla = sv === "" ? 1 : (esNum(numero(sv)) ? numero(sv) : sv); marcar("ruido"); aplicar(); return; }
      if (a === "n") { if (malo || (v !== null && (v < 2 || v > 50))) { el.classList.add("mal"); return; } if (v !== null) { E.n = Math.round(v); guardarUI(); } return; }
      if (a === "mov-f") {
        D.movilidad = D.movilidad || { activa: true };
        D.movilidad.fraccion = Number(el.value);
        marcar("movilidad");
        var o = panel.querySelector("#em-mov-o"); if (o) o.textContent = fmt(Number(el.value) * 100, 0) + " %";
        aplicar(); return;
      }
    });
    // arrastrar y soltar CSV
    panel.addEventListener("dragover", function (ev) {
      var z = ev.target.closest && ev.target.closest("[data-em-drop]");
      if (!z) return;
      ev.preventDefault(); ev.dataTransfer.dropEffect = "copy"; z.classList.add("sobre");
    });
    panel.addEventListener("dragleave", function (ev) { var z = ev.target.closest && ev.target.closest("[data-em-drop]"); if (z) z.classList.remove("sobre"); });
    panel.addEventListener("drop", function (ev) {
      var z = ev.target.closest && ev.target.closest("[data-em-drop]");
      if (!z) return;
      ev.preventDefault(); z.classList.remove("sobre");
      leerArchivos(ev.dataTransfer && ev.dataTransfer.files);
    });
    panel.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { ev.stopPropagation(); cerrar(); return; }
      var z = ev.target.closest && ev.target.closest("[data-em-drop]");
      if (z && ev.target === z && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); var f = panel.querySelector('[data-em-file="csv"]'); if (f) f.click(); return; }
      var pt = ev.target.closest && ev.target.closest(".em-pt");
      if (pt && (ev.key === "ArrowUp" || ev.key === "ArrowDown")) {
        ev.preventDefault();
        var h = Number(pt.getAttribute("data-h"));
        moverPunto(h, curva[h] + (ev.key === "ArrowUp" ? 1 : -1) * (ev.shiftKey ? 0.1 : 0.01));
        clearTimeout(E.tCur); E.tCur = setTimeout(guardarCurva, 500);
      }
    });
    // curva: arrastre de puntos / pintar
    panel.addEventListener("pointerdown", function (ev) {
      var svg = ev.target.closest && ev.target.closest(".em-curva");
      if (!svg || ev.button !== 0 || !curva) return;
      ev.preventDefault();
      arrastre = { svg: svg, h: null };
      try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* nada */ }
      var p = hDeEvento(svg, ev);
      arrastre.h = p.h;
      moverPunto(p.h, p.v);
    });
    panel.addEventListener("pointermove", function (ev) {
      var svg = ev.target.closest && ev.target.closest(".em-curva");
      if (arrastre) { var p = hDeEvento(arrastre.svg, ev); arrastre.h = p.h; moverPunto(p.h, p.v); return; }
      if (svg && curva) { var q = hDeEvento(svg, ev); if (q.h !== hoverH) { hoverH = q.h; tip(q.h); } }
      else if (hoverH >= 0) { hoverH = -1; tip(-1); }
    });
    function soltar() { if (!arrastre) return; arrastre = null; guardarCurva(); }
    panel.addEventListener("pointerup", soltar);
    panel.addEventListener("pointercancel", soltar);
    panel.addEventListener("pointerleave", function () { if (!arrastre && hoverH >= 0) { hoverH = -1; tip(-1); } });
  }

  // ---------------------------------------------------------------- shell
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest('#tb [data-em="alternar"]');
    if (!b) return;
    if (E.abierto) cerrar(); else abrir();
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && E.abierto && !(panel && panel.contains(ev.target))) cerrar(); });
  NOC.on("barra", function () { pintarBoton(); });
  NOC.on("lang", function () { if (panel) panel.setAttribute("aria-label", t(TX.titulo)); pintarBoton(); pintarPanel(); });
  NOC.on("modo", function () { E.D = copia(modeloCaso()) || {}; pintarBoton(); pintarPanel(); });
  var tRes = 0;
  NOC.on("resultado", function () {
    if (!E.abierto || (NOC.resultadoMeta && NOC.resultadoMeta.reloj)) return;
    clearTimeout(tRes);
    tRes = setTimeout(function () { pintarEstadoModelo(); pintarComparar(); if (E.mc) { var m = panel && panel.querySelector("#em-mc"); if (m) m.innerHTML = htmlMC(); } }, 60);
  });
  if (NOC.reloj && NOC.reloj.alSerie) NOC.reloj.alSerie(function () { if (E.abierto && E.mc) { var m = panel && panel.querySelector("#em-mc"); if (m) m.innerHTML = htmlMC(); } });

  NOC.editorModelo = { abrir: abrir, cerrar: cerrar, modelo: function () { return copia(modeloCaso()); }, importar: importarCSV, montecarlo: calcularMC, estado: function () { return E; } };
  pintarBoton();
})();
