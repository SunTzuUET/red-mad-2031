// operador.js — T4 (CONTRATO_UI Revisión 7, dueño OPERADOR): eventos en el tiempo, acciones del operador y registro de sucesos.
//  · Línea de tiempo de eventos bajo la barra del reloj: marcas por tipo (arrastrables), clic = editar/borrar,
//    "+ evento" (formulario con búsqueda de elemento) y menú de plantillas (Motor.plantillasEventos).
//  · Acciones "en vivo": botones en la ficha del elemento y clic derecho en unifilar/mapa (NOC.menuOperador) → insertan
//    la acción en el instante actual del reloj. En REF piden pasar a LAB (la referencia v7 es de solo lectura).
//  · Pestaña SUCESOS del dock: registro tipo SCADA (hora, nivel, origen, texto, elemento), filtros, clic = saltar y seleccionar.
//    Los sucesos son los de Motor.serie (serie.sucesos / pasos[i].sucesos); la interfaz no los recalcula.
//  · Los eventos son parte del caso LAB: NOC.caso.eventos, guardado en localStorage["noc.caso"]. Se pasan a Motor.serie
//    a través de reloj.js (NOC.operador.eventosSerie()).
(function () {
  "use strict";
  var NOC = window.NOC, Motor = window.Motor || {};
  if (!NOC || !NOC.RED) return;
  var RED = NOC.RED, t = NOC.t, fmt = NOC.fmt, IDX = NOC.idx || { nodos: {}, enlaces: {}, zonas: {} };
  var esc = NOC.esc || function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardarLS(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); m = Math.max(0, Math.min(1440, m)); return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function deHHMM(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || "")); return m ? Math.max(0, Math.min(1439, Number(m[1]) * 60 + Number(m[2]))) : null; }
  function numL(x, dec, lang) { return esNum(x) ? x.toFixed(dec).replace(".", lang === "en" ? "." : ",") : "—"; }
  function $(s, el) { return (el || document).querySelector(s); }
  function nombre(id) { return NOC.nombre ? NOC.nombre(id) : id; }
  function tipoElem(id) { return IDX.enlaces[id] ? "enlace" : IDX.nodos[id] ? "nodo" : IDX.zonas[id] ? "zona" : ""; }
  function descElem(id) {
    var e = IDX.enlaces[id];
    if (e) return nombre(e.a) + " – " + nombre(e.b);
    var n = nombre(id);
    return n !== id ? n : "";
  }
  var uidN = 0;
  function nuevoUid() { return "ev" + Date.now().toString(36) + (uidN++).toString(36); }

  // ---------- tipos de evento (contrato Revisión 7) ----------
  // Esquema de Motor (TIPOS_EVENTO): fin = params.hasta_min; evento_demanda id = escenario; priorizar_slice id = "clase:x";
  // apagar_capa id = tecnología; activar_ntn id opcional (terminal / zona; sin id = todos).
  // elem: "ne" nodo o enlace · "e" enlace · "opt" opcional · "esc" escenario · "clase" clase de servicio · "tec" capa radio
  var HASTA = { k: "hasta_min", tipo: "hora", n: { es: "Hasta (opcional)", en: "Until (optional)" } };
  var TIPOS = {
    fallo: { abr: "FAL", color: "var(--crit)", nivel: "MAJ", elem: "ne", n: { es: "Fallo", en: "Failure" } },
    reparacion: { abr: "REP", color: "var(--ok)", nivel: "INFO", elem: "ne", n: { es: "Reparación", en: "Repair" } },
    degradar: { abr: "DEG", color: "var(--maj)", nivel: "MIN", elem: "ne", n: { es: "Degradar capacidad", en: "Degrade capacity" },
      params: [{ k: "factor", tipo: "num", def: 0.5, min: 0, max: 1, step: 0.05, n: { es: "Factor de capacidad (×)", en: "Capacity factor (×)" } }, HASTA] },
    evento_demanda: { abr: "DEM", color: "var(--sv-evento)", nivel: "INFO", elem: "esc", n: { es: "Evento de demanda", en: "Demand event" },
      params: [{ k: "hasta_min", tipo: "hora", n: { es: "Fin", en: "End" } }] },
    te_reencaminar: { abr: "TE", color: "var(--wrn)", accion: true, nivel: "INFO", elem: "e", n: { es: "TE: sacar LSP del enlace", en: "TE: move LSPs off link" },
      params: [{ k: "fraccion", tipo: "num", def: 1, min: 0, max: 1, step: 0.1, n: { es: "Fracción reencaminada", en: "Rerouted fraction" } }, HASTA] },
    activar_ntn: { abr: "NTN", color: "var(--sv-ntn)", accion: true, nivel: "INFO", elem: "opt", n: { es: "Activar satélite NTN", en: "Activate NTN satellite" }, params: [HASTA] },
    anadir_lambda: { abr: "λ+", color: "var(--sv-empresa)", accion: true, nivel: "INFO", elem: "e", n: { es: "Añadir λ / capacidad", en: "Add λ / capacity" },
      params: [{ k: "n", tipo: "num", def: 1, min: 1, max: 14, step: 1, n: { es: "Módulos (λ 400G)", en: "Modules (λ 400G)" } }, HASTA] },
    priorizar_slice: { abr: "PRI", color: "var(--sv-urllc)", accion: true, nivel: "INFO", elem: "clase", n: { es: "Priorizar slice", en: "Prioritise slice" },
      params: [{ k: "prioridad", tipo: "num", def: 0, min: 0, max: 9, step: 1, n: { es: "Prioridad (0 = máx.)", en: "Priority (0 = top)" } }, HASTA] },
    apagar_capa: { abr: "OFF", color: "var(--band-n258)", accion: true, nivel: "INFO", elem: "tec", n: { es: "Apagar capa radio", en: "Switch off radio layer" },
      params: [{ k: "hasta_min", tipo: "hora", n: { es: "Fin", en: "End" } }] }
  };
  function finDe(e) { var p = e.params || {}; return esNum(p.hasta_min) ? p.hasta_min : esNum(p.duracion_min) ? e.t_min + p.duracion_min : null; }
  var ORDEN_EV = ["fallo", "reparacion", "degradar", "evento_demanda"];
  var ORDEN_AC = ["te_reencaminar", "activar_ntn", "anadir_lambda", "priorizar_slice", "apagar_capa"];
  var NIVELES = ["CRIT", "MAJ", "MIN", "WRN", "INFO"];
  var SEVCLS = { CRIT: "crit", MAJ: "maj", MIN: "min", WRN: "wrn", INFO: "ok" };
  var RANGO_NIV = { CRIT: 0, MAJ: 1, MIN: 2, WRN: 3, INFO: 4 };

  var TX = {
    eventos: { es: "Eventos", en: "Events" }, nuevo: { es: "+ evento", en: "+ event" }, plantillas: { es: "Plantillas", en: "Templates" },
    nuevoTit: { es: "Nuevo evento", en: "New event" }, editarTit: { es: "Editar evento", en: "Edit event" },
    tipo: { es: "Tipo", en: "Type" }, hora: { es: "Hora", en: "Time" }, elemento: { es: "Elemento", en: "Element" },
    buscarEl: { es: "buscar id o nombre…", en: "search id or name…" }, guardar: { es: "Guardar", en: "Save" }, borrar: { es: "Borrar", en: "Delete" },
    cancelar: { es: "Cancelar", en: "Cancel" }, grEventos: { es: "Eventos", en: "Events" }, grAcciones: { es: "Acciones del operador", en: "Operator actions" },
    faltaEl: { es: "Falta el elemento o no existe en la red.", en: "Element missing or not in the network." },
    faltaHora: { es: "Hora no válida.", en: "Invalid time." },
    sinMotor: { es: "El motor aún no aplica este tipo: se guarda con el caso y se enviará a Motor.serie; hasta entonces no cambia las cifras.", en: "The engine does not apply this type yet: it is saved with the case and sent to Motor.serie; until then it does not change the figures." },
    refTit: { es: "Referencia v7: solo lectura", en: "v7 reference: read-only" },
    refTxt: { es: "Los eventos y las acciones del operador forman parte del caso de LABORATORIO. ¿Pasar a LAB y aplicar?", en: "Events and operator actions belong to the LABORATORY case. Switch to LAB and apply?" },
    pasarLab: { es: "Pasar a LAB", en: "Switch to LAB" },
    refLinea: { es: "REF: sin eventos (los eventos son del caso LAB)", en: "REF: no events (events belong to the LAB case)" },
    vacia: { es: "sin eventos · arrastra una marca para moverla · clic en la línea = saltar a esa hora", en: "no events · drag a mark to move it · click the line = jump to that time" },
    vaciar: { es: "Vaciar todos los eventos", en: "Clear all events" },
    plMotor: { es: "Motor.plantillasEventos", en: "Motor.plantillasEventos" },
    operador: { es: "Operador", en: "Operator" }, enInstante: { es: "en el instante del reloj", en: "at the clock instant" },
    programar: { es: "Programar…", en: "Schedule…" }, fallarPerm: { es: "Fallo permanente del caso (alternar)", en: "Permanent case fault (toggle)" },
    ficha: { es: "Ver ficha", en: "Open details" }, ahora: { es: "ahora", en: "now" },
    evElem: { es: "Eventos de este elemento", en: "Events on this element" },
    insertado: { es: "Acción insertada a las ", en: "Action inserted at " },
    arrastra: { es: "Arrastra para mover · clic para editar", en: "Drag to move · click to edit" },
    sucesos: { es: "Sucesos", en: "Events log" }, origen: { es: "Origen", en: "Origin" }, nivel: { es: "Nivel", en: "Level" },
    texto: { es: "Texto", en: "Text" }, todos: { es: "Todos", en: "All" }, oEvento: { es: "Evento", en: "Event" }, oAccion: { es: "Acción", en: "Action" },
    oMotor: { es: "Motor", en: "Engine" }, filtrar: { es: "filtrar texto o elemento…", en: "filter text or element…" },
    soloSel: { es: "solo selección", en: "selection only" }, seguir: { es: "seguir reloj", en: "follow clock" },
    sinSucMotor: { es: "el motor no da sucesos en esta serie", en: "the engine gives no events for this series" },
    deMotor: { es: "del motor (serie.sucesos)", en: "from the engine (serie.sucesos)" },
    sinSerie: { es: "Sin película de 24 h: los sucesos salen de la serie del reloj.", en: "No 24 h run: the log comes from the clock series." },
    sinFilas: { es: "Ningún suceso con estos filtros.", en: "No events match these filters." },
    clicFila: { es: "Clic: saltar a esa hora y seleccionar el elemento", en: "Click: jump to that time and select the element" }
  };

  // ---------- soporte del motor ----------
  var soportados = null;   // tipos que el motor devolvió en serie.eventos (null = aún sin serie)
  var tiposMotor = null;
  try { if (typeof Motor.tiposEvento === "function") { tiposMotor = {}; Motor.tiposEvento().forEach(function (x) { tiposMotor[x.id] = x; }); } } catch (e) { tiposMotor = null; }
  function motorAmpliado() { return !!tiposMotor || typeof Motor.plantillasEventos === "function"; }
  function soporta(tipo) {
    if (tiposMotor) return !!tiposMotor[tipo];
    if (soportados && soportados[tipo]) return true;
    if (motorAmpliado()) return true;
    return tipo === "fallo" || tipo === "reparacion";
  }

  // ---------- estado: eventos del caso LAB ----------
  function lista() {
    var c = NOC.caso || {};
    if (!Array.isArray(c.eventos)) c.eventos = [];
    c.eventos.forEach(function (e) { if (!e.uid) e.uid = nuevoUid(); });
    return c.eventos;
  }
  function ordenados() { return lista().slice().sort(function (a, b) { return a.t_min - b.t_min; }); }
  function limpio(e) {
    var o = { t_min: e.t_min, tipo: e.tipo };
    if (e.id) o.id = e.id;
    if (e.params && Object.keys(e.params).length) o.params = JSON.parse(JSON.stringify(e.params));
    return o;
  }
  function eventosSerie() { return NOC.modo === "lab" ? ordenados().map(limpio) : []; }
  function guardarEventos(sinRefrescar) {
    guardarLS("noc.caso", JSON.stringify(NOC.caso));
    pintarLinea();
    pintarFichaOp();
    if (!sinRefrescar && NOC.reloj && NOC.reloj.refrescar) NOC.reloj.refrescar();
  }
  function anadirEvento(e) {
    var x = { uid: nuevoUid(), t_min: Math.round(e.t_min), tipo: e.tipo };
    if (e.id) x.id = e.id;
    if (e.params && Object.keys(e.params).length) x.params = e.params;
    lista().push(x);
    return x;
  }
  function porUid(uid) { return lista().filter(function (e) { return e.uid === uid; })[0] || null; }
  function borrarUid(uid) { var l = lista(), i = l.indexOf(porUid(uid)); if (i >= 0) l.splice(i, 1); }

  // ---------- textos de evento ----------
  function nomEsc(id, lang) {
    var e = (RED.escenarios || []).filter(function (x) { return x.id === id; })[0];
    return e ? id + " (" + e.nombre + ")" : (id || (lang === "en" ? "scenario" : "escenario"));
  }
  var NOMCLASE = {
    movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo", en: "FTTH fixed" }, voz: { es: "Voz", en: "Voice" },
    urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT", en: "IoT" }, empresa: { es: "Empresa", en: "Enterprise" },
    evento: { es: "Evento (MEC)", en: "Event (MEC)" }, ntn: { es: "Satélite NTN", en: "NTN satellite" }
  };
  function nomClase(c, lang) { var i = NOC.infoServicio && NOC.infoServicio[c]; var o = (i && i.n) || NOMCLASE[c]; return o ? (o[lang] || o.es) : (c || ""); }
  function textoEvento(e) {
    var p = e.params || {}, id = e.id || "", d = id ? descElem(id) : "", el = id + (d ? " (" + d + ")" : "");
    var f0 = finDe(e), fin = f0 != null ? hhmm(f0) : null;
    function L(lang) {
      var en = lang === "en", h = fin ? (en ? " until " : " hasta ") + fin : "";
      switch (e.tipo) {
        case "fallo": return (en ? "Failure of " : "Fallo de ") + el;
        case "reparacion": return (en ? "Repair of " : "Reparación de ") + el;
        case "degradar": return (en ? "Capacity of " : "Capacidad de ") + el + " × " + numL(esNum(p.factor) ? p.factor : 0.5, 2, lang) + h;
        case "evento_demanda": return (en ? "Demand event " : "Evento de demanda ") + nomEsc(id || p.escenario, lang) + h;
        case "te_reencaminar": return (en ? "TE: move " : "TE: sacar ") + numL((esNum(p.fraccion) ? p.fraccion : 1) * 100, 0, lang) + (en ? " % of LSPs off " : " % de los LSP de ") + el + h;
        case "activar_ntn": return (en ? "NTN satellite on" : "Satélite NTN activado") + (id ? " (" + el + ")" : en ? " (all terminals)" : " (todos los terminales)") + h;
        case "anadir_lambda": return (en ? "Add " : "Añadir ") + (esNum(p.n) ? p.n : 1) + (en ? " module(s) on " : " módulo(s) en ") + el + h;
        case "priorizar_slice": return (en ? "Prioritise " : "Priorizar ") + (/^clase:/.test(id) ? nomClase(id.slice(6), lang) : id || nomClase(p.clase, lang)) + " (" + (en ? "priority " : "prioridad ") + (esNum(p.prioridad) ? p.prioridad : 0) + ")" + h;
        case "apagar_capa": return (en ? "Switch off layer " : "Apagar capa ") + (id || p.tec || "n258") + h;
      }
      return e.tipo + (id ? " " + id : "");
    }
    return { es: L("es"), en: L("en") };
  }

  // ---------- plantillas ----------
  function existe(id) { return !!tipoElem(id); }
  function txtNombre(x) {
    if (!x) return "";
    if (typeof x === "string") return x;
    return t(x);
  }
  function plantillas() {
    if (typeof Motor.plantillasEventos === "function") {
      try {
        var r = Motor.plantillasEventos(RED);
        var arr = Array.isArray(r) ? r : (r && (r.plantillas || r.lista)) || [];
        var out = arr.map(function (p, i) {
          var n = p.nombre || p.titulo || (p.es || p.en ? { es: p.es, en: p.en || p.es } : null) || p.id || ("#" + (i + 1));
          return { id: p.id || String(i), nombre: n, desc: p.descripcion || p.desc || null, eventos: (p.eventos || []).filter(function (e) { return e && esNum(e.t_min) && e.tipo; }), motor: true };
        }).filter(function (p) { return p.eventos.length; });
        if (out.length) return out;
      } catch (e) { console.error("Motor.plantillasEventos", e); }
    }
    return [];
  }

  // ---------- pasar a LAB ----------
  function pedirLab(fn, ancla) {
    if (NOC.modo === "lab") { fn(); return; }
    abrirPop(ancla, '<div class="op-pop-cab">' + esc(t(TX.refTit)) + '</div><p class="op-nota">' + esc(t(TX.refTxt)) + '</p>' +
      '<div class="op-pop-acc"><button type="button" class="btn prim" data-op="lab-si">' + esc(t(TX.pasarLab)) + '</button>' +
      '<button type="button" class="btn" data-op="cerrar">' + esc(t(TX.cancelar)) + '</button></div>', { lab: fn });
  }

  // ---------- instante del reloj ----------
  function instante() {
    var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    var tm = st && esNum(st.t_min) ? st.t_min : (NOC.caso && esNum(NOC.caso.hora) ? NOC.caso.hora * 60 : 0);
    return Math.max(0, Math.min(1439, Math.round(tm)));
  }
  function enPelicula() { var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null; return !!(st && st.pelicula); }

  // Acción en vivo: se inserta en el instante actual del reloj y la película se pone en ese paso.
  function accionEnVivo(tipo, id, params, ancla) {
    // activar_ntn: solo con id si es una zona o un enlace satélite; si no, todos los terminales
    if (tipo === "activar_ntn" && id && !IDX.zonas[id] && !(IDX.enlaces[id] && IDX.enlaces[id].tipo === "sat")) id = null;
    pedirLab(function () {
      var tm = instante();
      anadirEvento({ t_min: tm, tipo: tipo, id: id, params: params });
      cerrarPop(); cerrarMenu();
      if (NOC.reloj && NOC.reloj.ir && NOC.reloj.serie && NOC.reloj.serie()) NOC.reloj.ir(tm);
      guardarEventos();
      NOC.mensaje && NOC.mensaje(t(TX.insertado) + hhmm(tm) + " · " + t(TIPOS[tipo].n) + (id ? " · " + id : "") + (soporta(tipo) ? "" : " · " + t({ es: "pendiente del motor", en: "engine support pending" })));
    }, ancla);
  }

  // ======================================================================== línea de tiempo (barra superior)
  var fila = null;
  function montarLinea() {
    var tb = document.getElementById("tb");
    if (!tb) return;
    fila = tb.querySelector(".op-fila");
    if (!fila) {
      fila = document.createElement("div");
      fila.className = "tb-f op-fila";
      tb.appendChild(fila);
    }
    pintarLinea();
  }
  function pintarLinea() {
    if (!fila || !fila.isConnected) { fila = null; var tb = document.getElementById("tb"); if (tb) { montarLinea(); } return; }
    var lab = NOC.modo === "lab", evs = lab ? ordenados() : [];
    var h = '<span class="rot">' + esc(t(TX.eventos)) + '</span><span class="op-n mono">' + (lab ? evs.length : "—") + '</span>' +
      '<div class="op-linea' + (lab ? "" : " ref") + '" data-op-linea title="' + esc(lab ? "" : t(TX.refLinea)) + '">' + ejeHTML() + marcasHTML(evs) +
      '<div class="op-cur" style="left:' + (cursorT() / 1440 * 100).toFixed(3) + '%"></div>' +
      (evs.length ? "" : '<span class="op-vacia">' + esc(t(lab ? TX.vacia : TX.refLinea)) + '</span>') + '</div>' +
      '<button type="button" class="btn" data-op="nuevo">' + esc(t(TX.nuevo)) + '</button>' +
      '<button type="button" class="btn" data-op="plantillas" aria-haspopup="menu">' + esc(t(TX.plantillas)) + ' ▾</button>' +
      // Revisión 11: abre el diseñador de escenarios (escenarios.js) en el paso "Qué pasa"
      (document.querySelector("script[src='escenarios.js']") ? '<button type="button" class="btn prim" data-accion="disenar-escenario" data-paso="3">' + esc(t({ es: "Diseñar", en: "Design" })) + '</button>' : '');
    fila.innerHTML = h;
  }
  function ejeHTML() {
    var h = '<div class="op-eje">';
    for (var hh = 0; hh <= 24; hh++) {
      var x = (hh / 24 * 100).toFixed(3);
      h += '<i class="op-tick' + (hh % 3 === 0 ? " may" : "") + '" style="left:' + x + '%"></i>';
      if (hh % 3 === 0 && hh < 24) h += '<span class="op-hl" style="left:' + x + '%">' + pad(hh) + '</span>';
    }
    return h + '</div>';
  }
  function marcasHTML(evs) {
    var h = "", carriles = [-1e9, -1e9];   // carril = fila de marcas; se alterna si dos marcas quedan a < 40 min
    evs.forEach(function (e) {
      var T = TIPOS[e.tipo] || { abr: "?", color: "var(--tx2)", n: { es: e.tipo } };
      var c = e.t_min - carriles[0] >= 40 ? 0 : e.t_min - carriles[1] >= 40 ? 1 : 0;
      carriles[c] = e.t_min;
      var x = (e.t_min / 1440 * 100).toFixed(3), fin = finDe(e);
      if (fin != null) {
        var fx = fin >= e.t_min ? fin : 1440;
        h += '<div class="op-span c' + c + '" style="left:' + x + '%;width:' + ((fx - e.t_min) / 1440 * 100).toFixed(3) + '%;background:' + T.color + '"></div>';
      }
      var ok = soporta(e.tipo);
      h += '<button type="button" class="op-marca c' + c + (T.accion ? " acc" : "") + (ok ? "" : " sin-motor") + '" data-op-uid="' + esc(e.uid) + '" style="left:' + x + '%;--c:' + T.color + '" title="' +
        esc(hhmm(e.t_min) + " · " + t(T.n) + (e.id ? " · " + e.id : "") + "\n" + t(textoEvento(e)) + (ok ? "" : "\n" + t(TX.sinMotor)) + "\n" + t(TX.arrastra)) + '">' + esc(T.abr) + '</button>';
    });
    return h;
  }
  function cursorT() {
    var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    return st && esNum(st.t_min) ? st.t_min : 0;
  }
  function moverCursorLinea() {
    var c = fila && fila.querySelector(".op-cur");
    if (c) c.style.left = (cursorT() / 1440 * 100).toFixed(3) + "%";
  }

  // arrastre de marcas / clic en la línea
  var drag = null;
  function tDeX(linea, clientX) {
    var r = linea.getBoundingClientRect();
    var tm = (clientX - r.left) / (r.width || 1) * 1440;
    var paso = (NOC.reloj && NOC.reloj.estado && NOC.reloj.estado().paso_min) || 5;
    paso = Math.min(5, paso);
    return Math.max(0, Math.min(1435, Math.round(tm / paso) * paso));
  }
  document.addEventListener("pointerdown", function (ev) {
    if (ev.button !== 0) return;
    var m = ev.target.closest && ev.target.closest(".op-marca");
    var linea = ev.target.closest && ev.target.closest("[data-op-linea]");
    if (!linea) return;
    if (m) {
      ev.preventDefault();
      drag = { uid: m.getAttribute("data-op-uid"), el: m, linea: linea, x0: ev.clientX, movido: false };
      try { m.setPointerCapture(ev.pointerId); } catch (e) { /* nada */ }
      return;
    }
    // clic en la línea vacía: saltar el reloj a esa hora
    if (NOC.reloj && NOC.reloj.serie && NOC.reloj.serie()) NOC.reloj.ir(tDeX(linea, ev.clientX));
  });
  document.addEventListener("pointermove", function (ev) {
    if (!drag) return;
    if (Math.abs(ev.clientX - drag.x0) > 3) drag.movido = true;
    if (!drag.movido) return;
    var tm = tDeX(drag.linea, ev.clientX);
    drag.t = tm;
    drag.el.style.left = (tm / 1440 * 100).toFixed(3) + "%";
    drag.el.setAttribute("data-t", hhmm(tm));
    drag.el.classList.add("arr");
  });
  function finDrag(ev) {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.movido) { editarEvento(d.uid, d.el); return; }
    var e = porUid(d.uid);
    if (!e || !esNum(d.t)) { pintarLinea(); return; }
    var dt = d.t - e.t_min;
    e.t_min = d.t;
    if (e.params && esNum(e.params.hasta_min)) e.params.hasta_min = Math.max(0, Math.min(1440, e.params.hasta_min + dt));
    guardarEventos();
  }
  document.addEventListener("pointerup", finDrag);
  document.addEventListener("pointercancel", function () { drag = null; pintarLinea(); });

  // ======================================================================== popover genérico
  var pop = null, popCtx = null;
  function abrirPop(ancla, html, ctx) {
    cerrarPop(); cerrarMenu();
    pop = document.createElement("div");
    pop.className = "op-pop";
    pop.setAttribute("role", "dialog");
    pop.innerHTML = html;
    document.body.appendChild(pop);
    popCtx = ctx || {};
    colocar(pop, ancla);
    var f = pop.querySelector("input:not([type=hidden]), select, button.prim");
    if (f && !popCtx.sinFoco) try { f.focus(); } catch (e) { /* nada */ }
    return pop;
  }
  function colocar(el, ancla) {
    var W = window.innerWidth, H = window.innerHeight, w = el.offsetWidth, h = el.offsetHeight, x, y;
    if (ancla && ancla.getBoundingClientRect) { var r = ancla.getBoundingClientRect(); x = r.left; y = r.bottom + 4; }
    else if (ancla && esNum(ancla.x)) { x = ancla.x; y = ancla.y; }
    else { x = (W - w) / 2; y = 90; }
    if (x + w > W - 6) x = W - w - 6;
    if (y + h > H - 6) y = Math.max(6, (ancla && ancla.getBoundingClientRect ? ancla.getBoundingClientRect().top - h - 4 : H - h - 6));
    el.style.left = Math.max(6, x) + "px"; el.style.top = Math.max(6, y) + "px";
  }
  function cerrarPop() { if (pop) { pop.remove(); pop = null; popCtx = null; } }

  // ---------- formulario de evento ----------
  var DL = null;
  function datalist() {
    if (DL && DL.isConnected) return;
    DL = document.createElement("datalist");
    DL.id = "op-elems";
    DL.innerHTML = (RED.nodos || []).map(function (n) { return '<option value="' + esc(n.id) + '">' + esc(n.nombre || "") + '</option>'; }).join("") +
      (RED.enlaces || []).map(function (e) { return '<option value="' + esc(e.id) + '">' + esc(nombre(e.a) + " – " + nombre(e.b)) + '</option>'; }).join("") +
      (RED.zonas || []).map(function (z) { return '<option value="' + esc(z.id) + '">' + esc(z.nombre || "") + '</option>'; }).join("");
    document.body.appendChild(DL);
  }
  function buscarId(q) {
    q = String(q || "").trim();
    if (!q) return "";
    if (existe(q)) return q;
    var Q = q.toUpperCase();
    var n = (RED.nodos || []).filter(function (x) { return x.id.toUpperCase() === Q || (x.nombre || "").toUpperCase() === Q; })[0] ||
      (RED.enlaces || []).filter(function (x) { return x.id.toUpperCase() === Q; })[0] ||
      (RED.zonas || []).filter(function (x) { return x.id.toUpperCase() === Q || (x.nombre || "").toUpperCase() === Q; })[0] ||
      (RED.nodos || []).filter(function (x) { return x.id.toUpperCase().indexOf(Q) >= 0 || (x.nombre || "").toUpperCase().indexOf(Q) >= 0; })[0] ||
      (RED.enlaces || []).filter(function (x) { return x.id.toUpperCase().indexOf(Q) >= 0; })[0];
    return n ? n.id : "";
  }
  function elemValido(tipo, id) {
    var T = TIPOS[tipo]; if (!T || !T.elem) return true;
    if (T.elem === "opt") return !id || !!tipoElem(id);
    if (T.elem === "esc" || T.elem === "clase" || T.elem === "tec") return !!id;
    var k = tipoElem(id);
    if (!k) return false;
    if (T.elem === "e") return k === "enlace";
    if (T.elem === "ne") return k === "nodo" || k === "enlace";
    return true;
  }
  // opciones del selector de elemento cuando no es un nodo/enlace (escenario, clase de servicio, capa radio)
  function opcionesElem(kind, v) {
    if (kind === "esc") {
      return (RED.escenarios || []).filter(function (s) { return !(s.fallos || []).length && !/TABLA8/.test(s.id); }).map(function (s) {
        return '<option value="' + esc(s.id) + '"' + (s.id === (v || "E-EVENTO") ? " selected" : "") + '>' + esc(s.id + " · " + s.nombre) + '</option>';
      }).join("");
    }
    if (kind === "clase") {
      var cl = Motor.CLASES_SERVICIO || Object.keys(NOMCLASE), vc = /^clase:/.test(v || "") ? v.slice(6) : (v || "urllc");
      return cl.map(function (c) { return '<option value="clase:' + esc(c) + '"' + (c === vc ? " selected" : "") + '>' + esc(nomClase(c, NOC.lang)) + '</option>'; }).join("");
    }
    if (kind === "tec") {
      var tecs = [];
      try { tecs = (typeof Motor.tecnologias === "function" ? Motor.tecnologias(RED) : []).filter(function (x) { return /^n\d+/.test(x.id); }).map(function (x) { return x.id; }); } catch (e) { tecs = []; }
      if (!tecs.length) tecs = ["n258", "n78", "n28"];
      return tecs.map(function (c) { return '<option value="' + esc(c) + '"' + (c === (v || "n258") ? " selected" : "") + '>' + esc(c) + '</option>'; }).join("");
    }
    return "";
  }
  function paramsHTML(tipo, params) {
    var T = TIPOS[tipo] || {}, h = "";
    (T.params || []).forEach(function (p) {
      var v = params ? params[p.k] : undefined, ctl;
      if (p.tipo === "num") ctl = '<input type="number" data-op-p="' + p.k + '" min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + (esNum(v) ? v : p.def) + '">';
      else ctl = '<input type="time" step="300" data-op-p="' + p.k + '" value="' + (esNum(v) ? hhmm(v) : "") + '">';
      h += '<label class="op-campo"><span class="rot">' + esc(t(p.n)) + '</span>' + ctl + '</label>';
    });
    if (!soporta(tipo)) h += '<p class="op-nota op-aviso">' + esc(t(TX.sinMotor)) + '</p>';
    return h;
  }
  var NOM_EL = { esc: { es: "Escenario", en: "Scenario" }, clase: { es: "Slice / clase", en: "Slice / class" }, tec: { es: "Capa", en: "Layer" } };
  function elemHTML(tipo, id) {
    var T = TIPOS[tipo] || {};
    if (!T.elem) return "";
    if (NOM_EL[T.elem]) return '<label class="op-campo"><span class="rot">' + esc(t(NOM_EL[T.elem])) + '</span><select class="sel" data-op-f="idsel">' + opcionesElem(T.elem, id) + '</select></label>';
    return '<label class="op-campo"><span class="rot">' + esc(t(TX.elemento)) + '</span><input type="text" list="op-elems" data-op-f="id" value="' + esc(tipoElem(id) ? id : "") + '" placeholder="' +
      esc(T.elem === "opt" ? t({ es: "vacío = todos", en: "empty = all" }) : t(TX.buscarEl)) + '" spellcheck="false"></label>' +
      '<div class="op-elnom tx3" data-op-elnom>' + esc(id && tipoElem(id) ? descElem(id) : "") + '</div>';
  }
  function formHTML(e, nuevo) {
    var opt = function (k) { return '<option value="' + k + '"' + (k === e.tipo ? " selected" : "") + '>' + esc(t(TIPOS[k].n)) + (soporta(k) ? "" : " *") + '</option>'; };
    return '<div class="op-pop-cab">' + esc(t(nuevo ? TX.nuevoTit : TX.editarTit)) + '</div>' +
      '<form class="op-form" data-op-form="' + esc(e.uid || "") + '" autocomplete="off">' +
      '<label class="op-campo"><span class="rot">' + esc(t(TX.tipo)) + '</span><select class="sel" data-op-f="tipo">' +
        '<optgroup label="' + esc(t(TX.grEventos)) + '">' + ORDEN_EV.map(opt).join("") + '</optgroup>' +
        '<optgroup label="' + esc(t(TX.grAcciones)) + '">' + ORDEN_AC.map(opt).join("") + '</optgroup></select></label>' +
      '<label class="op-campo"><span class="rot">' + esc(t(TX.hora)) + '</span><input type="time" step="300" data-op-f="hora" value="' + hhmm(e.t_min) + '" required></label>' +
      '<div class="op-params" data-op-el>' + elemHTML(e.tipo, e.id) + '</div>' +
      '<div class="op-params" data-op-params>' + paramsHTML(e.tipo, e.params) + '</div>' +
      '<div class="op-err sev-crit" data-op-err hidden></div>' +
      '<div class="op-pop-acc"><button type="submit" class="btn prim">' + esc(t(TX.guardar)) + '</button>' +
      (nuevo ? "" : '<button type="button" class="btn" data-op="borrar">' + esc(t(TX.borrar)) + '</button>') +
      '<button type="button" class="btn" data-op="cerrar">' + esc(t(TX.cancelar)) + '</button></div></form>';
  }
  function abrirForm(e, nuevo, ancla) {
    datalist();
    abrirPop(ancla, formHTML(e, nuevo), { uid: e.uid, nuevo: nuevo });
  }
  function nuevoEvento(ancla, pre) {
    pedirLab(function () {
      var tm = instante();
      abrirForm(Object.assign({ t_min: tm, tipo: "fallo" }, pre || {}), true, ancla);
    }, ancla);
  }
  function editarEvento(uid, ancla) {
    var e = porUid(uid);
    if (!e) return;
    abrirForm(e, false, ancla);
  }
  function leerForm(form) {
    var tipo = form.querySelector('[data-op-f="tipo"]').value, T = TIPOS[tipo] || {};
    var tm = deHHMM(form.querySelector('[data-op-f="hora"]').value);
    var cSel = form.querySelector('[data-op-f="idsel"]'), cTxt = form.querySelector('[data-op-f="id"]');
    var id = cSel ? cSel.value : cTxt ? buscarId(cTxt.value) : "";
    var params = {};
    Array.prototype.forEach.call(form.querySelectorAll("[data-op-p]"), function (c) {
      var k = c.getAttribute("data-op-p"), p = (T.params || []).filter(function (x) { return x.k === k; })[0] || {};
      if (p.tipo === "num") { var v = Number(c.value); if (isFinite(v) && c.value !== "") params[k] = Math.max(p.min, Math.min(p.max, v)); }
      else { var m = deHHMM(c.value); if (m != null) params[k] = m; }
    });
    var err = tm == null ? t(TX.faltaHora) : T.elem && !elemValido(tipo, id) ? t(TX.faltaEl) : "";
    if (!err && esNum(params.hasta_min) && params.hasta_min <= tm) err = t({ es: "La hora de fin debe ser posterior al inicio.", en: "End time must be after the start." });
    return { tipo: tipo, t_min: tm, id: id, params: params, err: err };
  }
  document.addEventListener("submit", function (ev) {
    var form = ev.target.closest && ev.target.closest("form[data-op-form]");
    if (!form) return;
    ev.preventDefault();
    var d = leerForm(form), ctx = popCtx || {};
    var er = form.querySelector("[data-op-err]");
    if (d.err) { er.textContent = d.err; er.hidden = false; return; }
    if (ctx.nuevo) anadirEvento(d);
    else {
      var e = porUid(ctx.uid);
      if (!e) { cerrarPop(); return; }
      e.tipo = d.tipo; e.t_min = d.t_min;
      if (d.id) e.id = d.id; else delete e.id;
      if (Object.keys(d.params).length) e.params = d.params; else delete e.params;
    }
    cerrarPop();
    guardarEventos();
  });
  document.addEventListener("change", function (ev) {
    var s = ev.target;
    if (s.matches && s.matches('[data-op-f="tipo"]')) {
      var form = s.closest("form"), tipo = s.value, cTxt = form.querySelector('[data-op-f="id"]');
      var idPrev = cTxt ? buscarId(cTxt.value) : "";
      form.querySelector("[data-op-el]").innerHTML = elemHTML(tipo, idPrev);
      form.querySelector("[data-op-params]").innerHTML = paramsHTML(tipo, null);
      if (pop) colocar(pop, { x: parseFloat(pop.style.left), y: parseFloat(pop.style.top) });
    }
  });
  document.addEventListener("input", function (ev) {
    var s = ev.target;
    if (s.matches && s.matches('[data-op-f="id"]')) {
      var id = buscarId(s.value), out = s.closest("form").querySelector("[data-op-elnom]");
      if (out) out.textContent = id ? id + (descElem(id) ? " · " + descElem(id) : "") : "—";
    } else if (s.matches && s.matches("[data-su-q]")) {
      FIL.q = s.value; guardarFil(); pintarSucesos(elSu, true);
    }
  });

  // ---------- menú de plantillas ----------
  function menuPlantillas(ancla) {
    var pl = plantillas(), motor = pl.length && pl[0].motor;
    var h = '<div class="op-pop-cab">' + esc(t(TX.plantillas)) + ' <span class="tx3 op-fuente">' + esc(t(TX.plMotor)) + '</span></div><div class="op-menu" role="menu">' +
      pl.map(function (p, i) {
        var res = p.eventos.map(function (e) { return hhmm(e.t_min) + " " + ((TIPOS[e.tipo] || {}).abr || e.tipo) + (e.id ? " " + e.id : ""); }).join(" · ");
        return '<button type="button" role="menuitem" class="op-mi" data-op-pl="' + i + '"' + (p.desc ? ' title="' + esc(txtNombre(p.desc)) + '"' : '') + '><b>' + esc(txtNombre(p.nombre)) + '</b><span class="tx3 mono">' + esc(res) + '</span></button>';
      }).join("") +
      (NOC.modo === "lab" && lista().length ? '<button type="button" role="menuitem" class="op-mi op-mi-peligro" data-op="vaciar">' + esc(t(TX.vaciar)) + ' (' + lista().length + ')</button>' : '') +
      '</div>';
    abrirPop(ancla, h, { plantillas: pl, sinFoco: true });
  }
  function aplicarPlantilla(p) {
    pedirLab(function () {
      var t0 = 1440;
      p.eventos.forEach(function (e) { anadirEvento({ t_min: e.t_min, tipo: e.tipo, id: e.id, params: e.params ? JSON.parse(JSON.stringify(e.params)) : null }); t0 = Math.min(t0, e.t_min); });
      cerrarPop();
      // la película se coloca 30 min antes del primer evento (se recalcula la serie con los eventos nuevos)
      if (NOC.reloj && NOC.reloj.ir && NOC.reloj.serie && NOC.reloj.serie()) NOC.reloj.ir(Math.max(0, t0 - 30));
      guardarEventos();
      NOC.mensaje && NOC.mensaje(t({ es: "Plantilla añadida: ", en: "Template added: " }) + txtNombre(p.nombre));
    });
  }

  // ======================================================================== menú contextual (unifilar / mapa)
  var menu = null;
  function cerrarMenu() { if (menu) { menu.remove(); menu = null; } }
  function caidoAhora(id) {
    var r = NOC.resultado;
    if (!r) return false;
    var x = (r.enlaces && r.enlaces[id]) || (r.nodos && r.nodos[id]);
    return !!(x && x.caido);
  }
  function accionesDe(id) {
    var k = tipoElem(id), e = IDX.enlaces[id], out = [];
    if (k !== "nodo" && k !== "enlace") { out.push(["activar_ntn", null]); return out; }
    out.push(caidoAhora(id) ? ["reparacion", null] : ["fallo", null]);
    out.push(["degradar", { factor: 0.5 }]);
    if (k === "enlace") {
      out.push(["anadir_lambda", { n: 1 }]);
      out.push(["te_reencaminar", { fraccion: 1 }]);
    }
    out.push(["activar_ntn", null]);
    return out;
  }
  function etiquetaAccion(tipo, params) {
    var T = TIPOS[tipo];
    if (tipo === "degradar") return t({ es: "Degradar al 50 %", en: "Degrade to 50 %" });
    if (tipo === "anadir_lambda") return t({ es: "Añadir 1 módulo (λ 400G)", en: "Add 1 module (λ 400G)" });
    if (tipo === "activar_ntn") return t({ es: "Activar satélite NTN (todos)", en: "Activate NTN satellite (all)" });
    return t(T.n);
  }
  NOC.menuOperador = function (ev, id) {
    if (!id || !existe(id)) return false;
    cerrarMenu(); cerrarPop();
    var tm = instante(), lab = NOC.modo === "lab";
    menu = document.createElement("div");
    menu.className = "op-pop op-ctx";
    menu.setAttribute("role", "menu");
    var acc = accionesDe(id);
    menu.innerHTML = '<div class="op-pop-cab"><span class="mono">' + esc(id) + '</span> <span class="tx3">' + esc(descElem(id)) + '</span></div>' +
      '<div class="op-ctx-rot"><span class="rot">' + esc(t(TX.operador)) + '</span> <span class="mono">' + hhmm(tm) + '</span> <span class="tx3">' + esc(t(TX.enInstante)) + (lab ? "" : " · REF → LAB") + '</span></div>' +
      '<div class="op-menu">' + acc.map(function (a) {
        var T = TIPOS[a[0]];
        return '<button type="button" role="menuitem" class="op-mi" data-op-vivo="' + a[0] + '" data-op-id="' + esc(id) + '"' + (a[1] ? " data-op-par='" + esc(JSON.stringify(a[1])) + "'" : "") + '>' +
          '<i class="op-sw" style="--c:' + T.color + '">' + esc(T.abr) + '</i>' + esc(etiquetaAccion(a[0], a[1])) + (soporta(a[0]) ? "" : ' <span class="tx3">*</span>') + '</button>';
      }).join("") +
      '<button type="button" role="menuitem" class="op-mi" data-op-prog="' + esc(id) + '"><i class="op-sw vacio">…</i>' + esc(t(TX.programar)) + '</button>' +
      '<div class="op-sep"></div>' +
      '<button type="button" role="menuitem" class="op-mi" data-op-perm="' + esc(id) + '"' + (lab ? "" : " disabled") + '><i class="op-sw vacio">×</i>' + esc(t(TX.fallarPerm)) + '</button>' +
      '<button type="button" role="menuitem" class="op-mi" data-op-ficha="' + esc(id) + '"><i class="op-sw vacio">i</i>' + esc(t(TX.ficha)) + '</button></div>';
    document.body.appendChild(menu);
    colocar(menu, { x: (ev && ev.clientX) || 200, y: (ev && ev.clientY) || 200 });
    return true;
  };

  // ======================================================================== ficha: acciones en vivo
  var abrirOrig = NOC.abrirFicha;
  var fichaSel = null;
  NOC.abrirFicha = function (f, propia) {
    var r = abrirOrig.apply(NOC, arguments);
    fichaSel = propia || NOC.seleccion || null;
    try { pintarFichaOp(); } catch (e) { console.error("operador ficha", e); }
    return r;
  };
  function pintarFichaOp() {
    var cuerpo = document.getElementById("ficha-cuerpo");
    if (!cuerpo) return;
    var viejo = cuerpo.querySelector(".op-ficha");
    var s = fichaSel && NOC.seleccion && fichaSel.id === NOC.seleccion.id ? fichaSel : NOC.seleccion;
    if (!s || !existe(s.id) || !document.getElementById("ficha").classList.contains("visible")) { if (viejo) viejo.remove(); return; }
    var id = s.id, lab = NOC.modo === "lab", tm = instante();
    var propios = lab ? ordenados().filter(function (e) { return e.id === id; }) : [];
    var html = '<h3>' + esc(t(TX.operador)) + ' · <span class="mono">' + hhmm(tm) + '</span></h3>' +
      '<div class="op-fbtn">' + accionesDe(id).map(function (a) {
        var T = TIPOS[a[0]];
        return '<button type="button" class="btn" data-op-vivo="' + a[0] + '" data-op-id="' + esc(id) + '"' + (a[1] ? " data-op-par='" + esc(JSON.stringify(a[1])) + "'" : "") +
          ' title="' + esc(t(T.n) + " · " + t(TX.enInstante) + " (" + hhmm(tm) + ")" + (soporta(a[0]) ? "" : " · " + t(TX.sinMotor))) + '"><i class="op-sw" style="--c:' + T.color + '">' + esc(T.abr) + '</i>' + esc(etiquetaAccion(a[0], a[1])) + '</button>';
      }).join("") + '<button type="button" class="btn" data-op-prog="' + esc(id) + '">' + esc(t(TX.programar)) + '</button></div>' +
      (lab ? "" : '<p class="op-nota tx3">' + esc(t(TX.refTxt)) + '</p>') +
      (propios.length ? '<div class="rot op-fsub">' + esc(t(TX.evElem)) + '</div><table class="tabla op-ftab"><tbody>' + propios.map(function (e) {
        var T = TIPOS[e.tipo] || { abr: "?", color: "var(--tx2)" };
        return '<tr data-op-ed="' + esc(e.uid) + '"><td class="mono">' + hhmm(e.t_min) + '</td><td><i class="op-sw" style="--c:' + T.color + '">' + esc(T.abr) + '</i></td><td class="txt">' + esc(t(textoEvento(e))) + '</td></tr>';
      }).join("") + '</tbody></table>' : '');
    var sec = viejo;
    if (!sec) {
      sec = document.createElement("div");
      sec.className = "ficha-sec op-ficha";
      var primera = cuerpo.querySelector(".ficha-sec");
      if (primera && primera.nextSibling) cuerpo.insertBefore(sec, primera.nextSibling); else cuerpo.appendChild(sec);
    }
    sec.innerHTML = html;
    sec.classList.toggle("plegada", NOC.plegado ? NOC.plegado("fs:" + t(TX.operador).toLowerCase()) : false);
  }

  // ======================================================================== sucesos
  var SU = { lista: [], gen: 0, motor: false, haySerie: false };
  function suceso(tm, nivel, origen, texto, id, extra) {
    var s = { t_min: tm, nivel: nivel, origen: origen, texto: texto, id: id || "" };
    if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
    return s;
  }
  function L2(es, en) { return { es: es, en: en }; }
  function construirSucesos(s) {
    SU.haySerie = !!(s && s.pasos && s.pasos.length);
    SU.motor = false;
    if (!SU.haySerie) { SU.lista = []; SU.gen++; return; }
    // tipos que el motor aceptó (los demás los filtra la versión T1 del motor)
    soportados = {};
    (s.eventos || []).forEach(function (e) { soportados[e.tipo] = true; });
    // Motor.serie (Revisión 7): serie.sucesos en orden temporal; si no, los de cada paso
    var fuente = Array.isArray(s.sucesos) ? s.sucesos : [].concat.apply([], s.pasos.map(function (p) { return (p.sucesos || []).map(function (x) { return esNum(x.t_min) ? x : Object.assign({ t_min: p.t_min }, x); }); }));
    SU.motor = Array.isArray(s.sucesos) || s.pasos.some(function (p) { return Array.isArray(p.sucesos); });
    var out = fuente.map(function (x) {
      return suceso(x.t_min, NIVELES.indexOf(x.nivel) >= 0 ? x.nivel : "INFO", x.origen || "motor",
        typeof x.texto === "string" ? L2(x.texto, x.texto) : (x.texto || L2("", "")), x.id || "", x.tipo ? { tipo: x.tipo } : null);
    });
    out.sort(function (a, b) { return (a.t_min - b.t_min) || (RANGO_NIV[a.nivel] - RANGO_NIV[b.nivel]); });
    SU.lista = out;
    SU.gen++;
  }

  // ---------- pestaña SUCESOS ----------
  var FIL = { niv: { CRIT: true, MAJ: true, MIN: true, WRN: true, INFO: true }, origen: "", q: "", sel: false, seguir: true };
  try { var f0 = JSON.parse(leer("noc.sucesos.fil") || "null"); if (f0) { Object.keys(FIL).forEach(function (k) { if (f0[k] != null && k !== "q") FIL[k] = f0[k]; }); } } catch (e) { /* nada */ }
  function guardarFil() { var c = {}; Object.keys(FIL).forEach(function (k) { if (k !== "q") c[k] = FIL[k]; }); guardarLS("noc.sucesos.fil", JSON.stringify(c)); }
  var elSu = null, filasVis = [];
  function filtrados() {
    var q = FIL.q.trim().toUpperCase(), selId = FIL.sel && NOC.seleccion ? NOC.seleccion.id : null;
    return SU.lista.filter(function (s) {
      if (!FIL.niv[s.nivel]) return false;
      if (FIL.origen && s.origen !== FIL.origen) return false;
      if (selId && s.id !== selId) return false;
      if (q && (t(s.texto) + " " + s.id).toUpperCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function pintarSucesos(el, forzar) {
    if (!el) return;
    elSu = el;
    var firma = [SU.gen, NOC.lang, NOC.modo, JSON.stringify(FIL), FIL.sel && NOC.seleccion ? NOC.seleccion.id : ""].join("|");
    if (forzar || el.getAttribute("data-firma") !== firma) {
      el.setAttribute("data-firma", firma);
      var foco = document.activeElement && document.activeElement.matches && document.activeElement.matches("[data-su-q]");
      var pos = foco ? document.activeElement.selectionStart : 0;
      el.innerHTML = htmlSucesos();
      if (foco) { var inp = el.querySelector("[data-su-q]"); if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (e) { /* nada */ } } }
    }
    marcarActual();
  }
  function htmlSucesos() {
    var cuenta = { CRIT: 0, MAJ: 0, MIN: 0, WRN: 0, INFO: 0 };
    SU.lista.forEach(function (s) { cuenta[s.nivel] = (cuenta[s.nivel] || 0) + 1; });
    var orig = [["", TX.todos], ["evento", TX.oEvento], ["accion", TX.oAccion], ["motor", TX.oMotor]];
    var barra = '<div class="op-su-fil">' +
      NIVELES.map(function (nv) {
        return '<button type="button" class="op-su-niv sev sev-' + SEVCLS[nv] + (FIL.niv[nv] ? "" : " off") + '" data-su-niv="' + nv + '" aria-pressed="' + !!FIL.niv[nv] + '">' + nv + ' ' + cuenta[nv] + '</button>';
      }).join("") +
      '<span class="seg" role="group" aria-label="' + esc(t(TX.origen)) + '">' + orig.map(function (o) {
        return '<button type="button" data-su-or="' + o[0] + '" aria-pressed="' + (FIL.origen === o[0]) + '">' + esc(t(o[1])) + '</button>';
      }).join("") + '</span>' +
      '<input type="search" data-su-q placeholder="' + esc(t(TX.filtrar)) + '" value="' + esc(FIL.q) + '" aria-label="' + esc(t(TX.filtrar)) + '">' +
      '<label class="op-chk"><input type="checkbox" data-su-sel' + (FIL.sel ? " checked" : "") + '> ' + esc(t(TX.soloSel)) + '</label>' +
      '<label class="op-chk"><input type="checkbox" data-su-seg' + (FIL.seguir ? " checked" : "") + '> ' + esc(t(TX.seguir)) + '</label>' +
      '<span class="tx3 op-su-meta">' + (SU.haySerie ? esc(t(SU.motor ? TX.deMotor : TX.sinSucMotor)) : "") + '</span></div>';
    if (!SU.haySerie) return barra + '<div class="vacio op-su-vacio">' + esc(t(TX.sinSerie)) + '</div>';
    filasVis = filtrados();
    if (!filasVis.length) return barra + '<div class="vacio op-su-vacio">' + esc(t(TX.sinFilas)) + '</div>';
    var ORN = { evento: TX.oEvento, accion: TX.oAccion, motor: TX.oMotor };
    return barra + '<table class="tabla op-su-tab"><thead><tr><th>' + esc(t(TX.hora)) + '</th><th>' + esc(t(TX.nivel)) + '</th><th>' + esc(t(TX.origen)) + '</th><th>' + esc(t(TX.texto)) + '</th><th>' + esc(t(TX.elemento)) + '</th></tr></thead><tbody>' +
      filasVis.map(function (s, i) {
        return '<tr data-su="' + i + '" title="' + esc(t(TX.clicFila)) + '"><td class="mono">' + hhmm(s.t_min) + '</td><td>' + NOC.insignia(SEVCLS[s.nivel] || "unk", s.nivel) + '</td>' +
          '<td class="op-or op-or-' + esc(s.origen) + '">' + esc(t(ORN[s.origen] || { es: s.origen })) + '</td><td class="txt">' + esc(t(s.texto)) + '</td><td class="id">' + esc(s.id || "—") + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  var ultimoActual = -2;
  function marcarActual() {
    if (!elSu || !elSu.isConnected) return;
    var st = NOC.reloj && NOC.reloj.estado ? NOC.reloj.estado() : null;
    var tm = st && st.pelicula && esNum(st.t_min) ? st.t_min : null;
    var filas = elSu.querySelectorAll("tr[data-su]"), actual = -1;
    for (var i = 0; i < filas.length; i++) {
      var s = filasVis[i], fut = tm != null && s && s.t_min > tm + 1e-6;
      filas[i].classList.toggle("fut", fut);
      if (!fut && tm != null) actual = i;
    }
    Array.prototype.forEach.call(elSu.querySelectorAll("tr.actual"), function (r) { r.classList.remove("actual"); });
    if (actual >= 0) {
      filas[actual].classList.add("actual");
      if (FIL.seguir && actual !== ultimoActual) {
        var c = document.getElementById("dock-cuerpo");
        if (c) {
          var r = filas[actual], top = r.offsetTop, h = c.clientHeight;
          if (top < c.scrollTop + 50 || top > c.scrollTop + h - 30) c.scrollTop = Math.max(0, top - h / 2);
        }
      }
    }
    ultimoActual = actual;
  }
  document.addEventListener("click", function (ev) {
    var b;
    if (!ev.target.closest) return;
    if ((b = ev.target.closest("[data-su-niv]"))) { var nv = b.getAttribute("data-su-niv"); FIL.niv[nv] = !FIL.niv[nv]; guardarFil(); pintarSucesos(elSu, true); return; }
    if ((b = ev.target.closest("[data-su-or]"))) { FIL.origen = b.getAttribute("data-su-or"); guardarFil(); pintarSucesos(elSu, true); return; }
    if ((b = ev.target.closest("tr[data-su]"))) {
      var s = filasVis[Number(b.getAttribute("data-su"))];
      if (!s) return;
      if (NOC.reloj && NOC.reloj.serie && NOC.reloj.serie()) NOC.reloj.ir(s.t_min);
      var k = tipoElem(s.id);
      if (k) NOC.seleccionar(k, s.id);
      return;
    }
  });
  document.addEventListener("change", function (ev) {
    var s = ev.target;
    if (s.matches && s.matches("[data-su-sel]")) { FIL.sel = s.checked; guardarFil(); pintarSucesos(elSu, true); }
    else if (s.matches && s.matches("[data-su-seg]")) { FIL.seguir = s.checked; guardarFil(); }
  });

  // ======================================================================== delegación general
  document.addEventListener("click", function (ev) {
    if (!ev.target.closest) return;
    var b = ev.target.closest("[data-op], [data-op-vivo], [data-op-prog], [data-op-perm], [data-op-ficha], [data-op-pl], tr[data-op-ed]");
    if (!b) {
      if (pop && !ev.target.closest(".op-pop")) cerrarPop();
      if (menu && !ev.target.closest(".op-ctx")) cerrarMenu();
      return;
    }
    if (b.hasAttribute("data-op-vivo")) {
      var par = null;
      try { par = b.getAttribute("data-op-par") ? JSON.parse(b.getAttribute("data-op-par")) : null; } catch (e) { par = null; }
      accionEnVivo(b.getAttribute("data-op-vivo"), b.getAttribute("data-op-id"), par, b);
      return;
    }
    if (b.hasAttribute("data-op-prog")) { var idp = b.getAttribute("data-op-prog"); cerrarMenu(); nuevoEvento(b.closest(".op-ctx") ? null : b, { id: idp, tipo: IDX.zonas[idp] ? "activar_ntn" : "fallo" }); return; }
    if (b.hasAttribute("data-op-perm")) { var idf = b.getAttribute("data-op-perm"); cerrarMenu(); NOC.alternarFallo(idf); return; }
    if (b.hasAttribute("data-op-ficha")) { var idv = b.getAttribute("data-op-ficha"); cerrarMenu(); NOC.seleccionar(tipoElem(idv), idv); return; }
    if (b.hasAttribute("data-op-pl")) { var p = popCtx && popCtx.plantillas && popCtx.plantillas[Number(b.getAttribute("data-op-pl"))]; if (p) aplicarPlantilla(p); return; }
    if (b.hasAttribute("data-op-ed")) { editarEvento(b.getAttribute("data-op-ed"), b); return; }
    var a = b.getAttribute("data-op");
    if (a === "nuevo") nuevoEvento(b);
    else if (a === "plantillas") { if (pop && popCtx && popCtx.plantillas) cerrarPop(); else menuPlantillas(b); }
    else if (a === "cerrar") cerrarPop();
    else if (a === "borrar") { if (popCtx && popCtx.uid) borrarUid(popCtx.uid); cerrarPop(); guardarEventos(); }
    else if (a === "vaciar") { lista().length = 0; cerrarPop(); guardarEventos(); }
    else if (a === "lab-si") { var fn = popCtx && popCtx.lab; cerrarPop(); NOC.setModo && NOC.setModo("lab"); if (fn) fn(); }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && (pop || menu)) { ev.stopPropagation(); cerrarPop(); cerrarMenu(); }
  }, true);
  window.addEventListener("resize", function () { cerrarMenu(); });
  document.addEventListener("scroll", function () { cerrarMenu(); }, true);

  // ======================================================================== registro
  NOC.registrarPestanaDock && NOC.registrarPestanaDock({
    id: "sucesos", grupo: "simulacion", titulo: { es: "Sucesos", en: "Events log" },
    cnt: function () { return SU.haySerie ? SU.lista.length : ""; },
    pintar: function (el) { pintarSucesos(el); }
  });
  NOC.on("barra", function () { fila = null; montarLinea(); });
  NOC.on("resultado", function () { moverCursorLinea(); marcarActual(); });
  NOC.on("lang", function () { cerrarPop(); cerrarMenu(); pintarLinea(); SU.gen++; });
  NOC.on("modo", function () { cerrarPop(); cerrarMenu(); pintarLinea(); });
  NOC.on("seleccion", function () { if (FIL.sel && elSu && elSu.isConnected) pintarSucesos(elSu); });
  if (NOC.reloj && NOC.reloj.alSerie) {
    NOC.reloj.alSerie(function (s) {
      construirSucesos(s);
      pintarLinea();
      if (elSu && elSu.isConnected) pintarSucesos(elSu);
    });
    var s0 = NOC.reloj.serie && NOC.reloj.serie();
    if (s0) construirSucesos(s0);
  }

  // API (exportar.js, reloj.js)
  NOC.operador = {
    eventos: function () { return NOC.modo === "lab" ? ordenados().map(limpio) : []; },
    eventosSerie: eventosSerie,
    sucesos: function () { return SU.lista.slice(); },
    anadir: function (e) { var x = anadirEvento(e); guardarEventos(); return x.uid; },
    borrar: function (uid) { borrarUid(uid); guardarEventos(); },
    vaciar: function () { lista().length = 0; guardarEventos(); },
    plantillas: plantillas, aplicarPlantilla: function (i) { var p = plantillas()[i]; if (p) aplicarPlantilla(p); },
    accion: accionEnVivo, tipos: TIPOS, soporta: soporta,
    // Revisión 11 (diseñador de escenarios): sustituir toda la lista de una vez (un solo recálculo) y texto legible de un evento
    reemplazar: function (evs) {
      var l = lista(); l.length = 0;
      (evs || []).forEach(function (e) { if (e && esNum(e.t_min) && e.tipo) { var x = anadirEvento(e); if (e.uid) x.uid = e.uid; } });
      guardarEventos();
    },
    textoEvento: textoEvento
  };

  montarLinea();
  // eventos guardados con el caso LAB: la serie se recalcula con ellos
  if (NOC.modo === "lab" && lista().length && NOC.reloj && NOC.reloj.refrescar) NOC.reloj.refrescar();
})();
