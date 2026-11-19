// simple.js — app mínima "Red Madrid 2031" (CONTRATO_UI Revisión 15). Portada del simulador; la app completa sigue en completo.html.
// Tres vistas: Red (mapa por partes), Simular (24 h + cortar enlace), Cambiar (año, demanda, evento, capacidad).
// Solo usa red.js, emplazamientos_datos.js, modelos.js, modelo_demanda.js y motor.js (sin tocarlos). En node exporta el núcleo (test_simple.js).
(function (raiz) {
  "use strict";

  // ---------- núcleo (sin DOM) ----------
  var OPC_REF = { caso: { trafico: "BH", evento: "E-EVENTO" } };   // = OPC_REF de app.js: hora cargada 2031 de la v7 con partido
  var ANIO_REF = 2031, EVENTO_REF = "E-EVENTO";
  // Umbrales de la v7 §6.4.4 (reserva RSVP: ≤ 70 % en normal, ≤ 90 % con fallo); supuesto S-094 los cita como alternativa.
  var U_AMB = 70, U_ROJO = 90;

  function estadoRef() { return { anio: ANIO_REF, crec: 0, evento: EVENTO_REF, cap: {}, fallos: [], hora: null }; }
  function esRef(e) {
    return e.anio === ANIO_REF && !e.crec && e.evento === EVENTO_REF && !Object.keys(e.cap || {}).length;
  }
  function modeloCrec(Motor, crec) {
    if (!crec) return null;
    var f = {};
    (Motor.CLASES_SERVICIO || []).forEach(function (c) { f[c] = 1 + crec / 100; });
    return { id: "crecimiento", nombre: "+" + crec + " %", factores: f };
  }
  // Opciones de Motor.calcular para un estado. Sin cambios, sin hora y sin cortes = OPC_REF tal cual (números de la memoria).
  function opciones(Motor, e) {
    var fallos = (e.fallos || []).slice();
    if (esRef(e) && e.hora == null && !fallos.length) return JSON.parse(JSON.stringify(OPC_REF));
    var o = { caso: { trafico: { id: "BH", anio: e.anio }, evento: e.evento || "ninguno", fallo: fallos } };
    var mu = modeloCrec(Motor, e.crec);
    if (mu) o.modelo_usuario = mu;
    if (e.hora != null) { o.hora = e.hora; o.perfil_horario = true; }   // = paso de Motor.serie a esa hora
    return o;
  }
  // RED con las capacidades cambiadas (copia superficial; red.js no se toca).
  function redCon(RED, cap) {
    var ids = Object.keys(cap || {});
    if (!ids.length) return RED;
    var r = {}, k;
    for (k in RED) r[k] = RED[k];
    r.enlaces = RED.enlaces.map(function (l) {
      if (!(l.id in cap)) return l;
      var c = {}, j; for (j in l) c[j] = l[j];
      c.capacidad_gbps = cap[l.id];
      return c;
    });
    return r;
  }
  function calcular(Motor, RED, e) { return Motor.calcular(redCon(RED, e.cap), opciones(Motor, e)); }
  function nivel(pct) { return pct > U_ROJO ? "rojo" : (pct >= U_AMB ? "amb" : "ok"); }

  // Partes de la red: qué enlaces, nodos y emplazamientos de acceso enseña cada una.
  var TEC_RADIO = { n28: 1, n78: 1, n258: 1, v2x: 1, iot: 1, ntn: 1 };
  var SITE_FIBRA = { "SITE-L2VPN-CENTRO": 1, "SITE-L2VPN-NORTE": 1, "SITE-L2VPN-ESTE": 1, "SITE-L2VPN-SUR": 1 };
  function parteEnlace(RED, l) {
    var p = {};
    if (l.tipo === "wdm" || l.tipo === "backhaul" || l.tipo === "mpls") p.transporte = 1;
    if (l.tipo === "mpls" || l.tipo === "ix" || l.tipo === "sat") p.nucleo = 1;
    if (l.tipo === "acceso") { if (SITE_FIBRA[l.a] || SITE_FIBRA[l.b]) p.fibra = 1; else p.radio = 1; }
    return p;
  }
  function parteNodo(n) {
    var p = {};
    if (n.tipo === "metro" || n.tipo === "agg") p.transporte = 1;
    if (n.tipo === "core" || n.tipo === "edge" || n.tipo === "ix") p.nucleo = 1;
    if (n.tipo === "site") { if (SITE_FIBRA[n.id]) p.fibra = 1; else p.radio = 1; }
    return p;
  }
  function parteSitio(s) { return s.tec === "ftth" ? "fibra" : (TEC_RADIO[s.tec] ? "radio" : null); }

  var nucleo = { OPC_REF: OPC_REF, U_AMB: U_AMB, U_ROJO: U_ROJO, estadoRef: estadoRef, esRef: esRef, opciones: opciones,
    redCon: redCon, calcular: calcular, nivel: nivel, parteEnlace: parteEnlace, parteNodo: parteNodo, parteSitio: parteSitio };
  if (typeof module !== "undefined" && module.exports) { module.exports = nucleo; return; }
  raiz.Simple = nucleo;

  // ---------- interfaz ----------
  var RED = raiz.RED, Motor = raiz.Motor, EMPL = raiz.EMPL || { sitios: [] };
  var $ = function (s) { return document.querySelector(s); };
  var lang = "es";
  try { lang = localStorage.getItem("simple.lang") === "en" ? "en" : "es"; } catch (x) { /* sin almacenamiento */ }

  var TX = {
    red: ["Red", "Network"], simular: ["Simular", "Simulate"], cambiar: ["Cambiar", "Change"], completo: ["Modo completo ↗", "Full mode ↗"],
    todo: ["Todo", "All"], radio: ["Radio 5G", "5G radio"], fibra: ["Fibra (FTTH)", "Fibre (FTTH)"], transporte: ["Transporte", "Transport"], nucleo: ["Núcleo/DC", "Core/DC"],
    servido: ["del tráfico servido", "of traffic served"], max: ["enlace más cargado", "busiest link"], afect: ["demandas afectadas", "demands hit"],
    cortar: ["Cortar enlace", "Cut link"], restaurar: ["Restaurar", "Restore"], curva: ["Ocupación máx. (%)", "Peak load (%)"],
    cortado: ["Cortado", "Cut"], anio: ["Año", "Year"], crec: ["Crecimiento", "Growth"], evento: ["Evento", "Event"],
    demanda: ["Demanda", "Demand"], transp: ["Transporte", "Transport"], enlace: ["Capacidad", "Capacity"], clic: ["Clic en un enlace del mapa", "Click a link on the map"],
    volver: ["Volver a la memoria (REF)", "Back to the report (REF)"], igual: ["= memoria v7", "= v7 report"], distinto: ["Cambiado respecto a la memoria", "Changed vs the report"],
    i_red: ["Red de la memoria v7 en la hora cargada de 2031. Grosor = tráfico; color = ocupación.",
      "The v7 report network at the 2031 busy hour. Width = traffic; colour = load."],
    i_simular: ["Un día de 24 h con los perfiles horarios. Pulsa «Cortar enlace» y elige un enlace para ver el reencaminado.",
      "A 24-hour day with the hourly profiles. Press “Cut link” and pick a link to see the rerouting."],
    i_cambiar: ["Cambia la demanda o la capacidad de un enlace: el mapa se recalcula al instante.",
      "Change demand or a link's capacity: the map recalculates instantly."]
  };
  var TIPO = { wdm: ["Anillo WDM", "WDM ring"], backhaul: ["Backhaul", "Backhaul"], mpls: ["Acometida MPLS", "MPLS uplink"], ix: ["Interconexión", "Interconnect"],
    sat: ["Satélite", "Satellite"], acceso: ["Acceso", "Access"], core: ["Centro de datos", "Data centre"], metro: ["Nodo metro", "Metro node"],
    edge: ["Edge (MEC)", "Edge (MEC)"], agg: ["Agregación", "Aggregation"], site: ["Emplazamiento", "Site"] };
  var EVT = { ninguno: ["Ninguno", "None"], "E-EVENTO": ["Partido", "Match"], "E-EVENTO-ESTRES": ["Partido ×2", "Match ×2"],
    "E-PUNTA-A2": ["Punta A-2", "A-2 rush hour"], "E-ALARMA-VALDEBEBAS": ["Alarma Valdebebas", "Valdebebas alarm"] };
  var CORTO = { "SITE-METROPOLITANO": "Estadio", "SITE-VALDEBEBAS": "Valdebebas", "SITE-A2-V2X": "A-2 V2X", "SITE-HOSPITAL-GETAFE": "Hospital Getafe",
    "SITE-INDUSTRIA-SUR": "Industria Sur", "SITE-NTN-ARGANDA": "NTN Arganda", "SITE-L2VPN-CENTRO": "UPM", "SITE-L2VPN-NORTE": "Alcobendas L2VPN",
    "SITE-L2VPN-ESTE": "UAH", "SITE-L2VPN-SUR": "URJC", "IX-INTERNET": "Internet", "IX-IMS": "IMS", "IX-ONEWEB": "OneWeb" };
  // Rótulos fijos por parte (~8); el resto, al pasar el ratón.
  var ROTULOS = {
    todo: ["CORE-1", "CORE-2", "CORE-3", "MET-CENTRO", "MET-NORTE", "MET-ESTE", "MET-SUR", "SITE-METROPOLITANO"],
    transporte: ["MET-CENTRO", "MET-NORTE", "MET-ESTE", "MET-SUR", "AGG-MADRID", "AGG-ALCALA", "AGG-GETAFE", "AGG-TRESCANTOS"],
    nucleo: ["CORE-1", "CORE-2", "CORE-3", "EDGE-CENTRO", "EDGE-ESTE", "EDGE-SUR", "IX-INTERNET", "IX-ONEWEB"],
    radio: ["SITE-METROPOLITANO", "SITE-VALDEBEBAS", "SITE-A2-V2X", "SITE-HOSPITAL-GETAFE", "SITE-INDUSTRIA-SUR", "SITE-NTN-ARGANDA"],
    fibra: ["SITE-L2VPN-CENTRO", "SITE-L2VPN-NORTE", "SITE-L2VPN-ESTE", "SITE-L2VPN-SUR", "MET-CENTRO", "MET-SUR"]
  };
  var DIR = { "SITE-HOSPITAL-GETAFE": "left", "SITE-L2VPN-SUR": "left", "EDGE-CENTRO": "left", "EDGE-SUR": "left", "SITE-INDUSTRIA-SUR": "right" };
  var RADIO_N = { core: 9, metro: 8, edge: 6, ix: 5, agg: 5, site: 5 };
  var COL = { ok: "#30a46c", amb: "#f5a524", rojo: "#e5484d", nulo: "#6e6e6e", nodo: "#d9d9d9" };

  function t(k) { var v = TX[k] || TIPO[k] || EVT[k]; return v ? v[lang === "en" ? 1 : 0] : k; }
  function fmt(x, d) {
    if (x == null || !isFinite(x)) return "—";
    return Number(x).toLocaleString(lang === "en" ? "en-GB" : "es-ES", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function fmtG(x) { return fmt(x, x < 10 ? (x < 1 ? 2 : 1) : 0); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var NODO = {}; RED.nodos.forEach(function (n) { NODO[n.id] = n; });
  var ENL = {}; RED.enlaces.forEach(function (l) { ENL[l.id] = l; });
  var SITIO = {}; (EMPL.sitios || []).forEach(function (s) { SITIO[s.id] = s; });
  function corto(id) {
    if (CORTO[id]) return CORTO[id];
    var n = NODO[id]; if (!n) return id;
    if (n.tipo === "agg") return n.nombre.replace(/^Agregación\s+/, "");
    return n.nombre;
  }
  function nombreEnlace(id) { var l = ENL[id]; return l ? corto(l.a) + " – " + corto(l.b) : id; }

  // ---------- posiciones de dibujo: los nodos co-ubicados (DC, metro, edge, IX en el mismo edificio) se separan ~3 km ----------
  var POS = (function () {
    var cos = Math.cos(40.45 * Math.PI / 180), KX = 111.32 * cos, KY = 110.57, D = 3.2;
    var P = RED.nodos.map(function (n, i) {
      return { id: n.id, x: (n.coord[1] + 3.7) * KX, y: (n.coord[0] - 40.4) * KY, fijo: n.tipo === "metro", i: i };
    });
    for (var it = 0; it < 300; it++) {
      var mov = false;
      for (var a = 0; a < P.length; a++) for (var b = a + 1; b < P.length; b++) {
        var p = P[a], q = P[b];
        if (p.fijo && q.fijo) continue;
        var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d >= D) continue;
        if (d < 1e-6) { var ang = (a * 7 + b * 13) * 0.9; dx = Math.cos(ang); dy = Math.sin(ang); d = 1e-6; } else { dx /= d; dy /= d; }
        var em = (D - d) * 0.5;
        var wp = p.fijo ? 0 : (q.fijo ? 1 : 0.5), wq = q.fijo ? 0 : (p.fijo ? 1 : 0.5);
        p.x -= dx * em * wp * 2; p.y -= dy * em * wp * 2; q.x += dx * em * wq * 2; q.y += dy * em * wq * 2;
        mov = true;
      }
      if (!mov) break;
    }
    var out = {};
    P.forEach(function (p) { out[p.id] = [40.4 + p.y / KY, -3.7 + p.x / KX]; });
    return out;
  })();

  // ---------- estado ----------
  var EVENTOS = null;
  var S = { vista: "red", parte: "todo", sel: null, cortando: false, play: null };
  var E = estadoRef(); E.horaSim = 21;
  var R = null, cacheR = {};
  function estadoCalc() {
    return { anio: E.anio, crec: E.crec, evento: E.evento, cap: E.cap,
      fallos: S.vista === "simular" ? E.fallos : [], hora: S.vista === "simular" ? E.horaSim : null };
  }
  function recalcular() {
    var e = estadoCalc(), k = JSON.stringify(e);
    if (!cacheR[k]) {
      try { cacheR[k] = calcular(Motor, RED, e); } catch (x) { console.error("Motor.calcular", x); return; }
      var ks = Object.keys(cacheR); if (ks.length > 80) delete cacheR[ks[0]];
    }
    R = cacheR[k];
    pintar();
  }

  // ---------- mapa ----------
  var mapa = L.map("mapa", { zoomControl: false, zoomSnap: 0.25, minZoom: 8, maxZoom: 15, attributionControl: true });
  mapa.attributionControl.setPrefix(false);
  mapa.setView([40.45, -3.65], 10);
  var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 16, attribution: "Tiles &copy; Esri" });
  var nTileErr = 0;
  esri.on("tileerror", function () {
    if (++nTileErr !== 6) return;
    mapa.removeLayer(esri);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19,
      attribution: "&copy; OpenStreetMap &copy; CARTO" }).addTo(mapa);
  });
  esri.addTo(mapa);
  mapa.createPane("puntos").style.zIndex = 380;
  mapa.createPane("enlaces").style.zIndex = 410;
  mapa.createPane("nodos").style.zIndex = 420;
  var lienzo = L.canvas({ pane: "puntos", padding: 0.2 });
  function encuadrar() {
    var parte = parteVisible(), pts = [];
    if (parte === "todo") pts = RED.nodos.map(function (n) { return POS[n.id]; });
    else {
      Object.keys(dib.nod).forEach(function (id) { pts.push(POS[id]); });
      Object.keys(dib.sit).forEach(function (id) { if (SITIO[id].tec !== "v2x") pts.push(SITIO[id].coord); });
    }
    if (pts.length < 2) return;
    mapa.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [20, 44], paddingBottomRight: [S.vista === "cambiar" ? 20 : 20, S.vista === "simular" ? 80 : 40] });
  }
  var capa = L.layerGroup().addTo(mapa);
  var dib = { enl: {}, nod: {}, sit: {} }, halo = null;

  function parteVisible() { return S.vista === "red" ? S.parte : "todo"; }
  function construir() {
    capa.clearLayers(); dib = { enl: {}, nod: {}, sit: {} }; halo = null;
    var parte = parteVisible(), todo = parte === "todo", nodosVis = {};
    // emplazamientos de acceso (radio / FTTH): puntos pequeños en canvas
    (EMPL.sitios || []).forEach(function (s) {
      var p = parteSitio(s);
      if (!p || !s.coord || (!todo && p !== parte)) return;
      var m = L.circleMarker(s.coord, { renderer: lienzo, radius: todo ? 1.6 : (p === "fibra" ? 4 : 2), stroke: false, fillOpacity: todo ? 0.35 : 0.85,
        fillColor: COL.nulo, interactive: !todo, bubblingMouseEvents: false });
      if (!todo) {
        m.on("click", function (ev) { seleccionar("sitio", s.id, ev); });
        m.bindTooltip(function () { return esc(etiquetaSitio(s)); }, { className: "hov", direction: "top", offset: [0, -4] });
      }
      m.addTo(capa); dib.sit[s.id] = m;
    });
    // enlaces
    RED.enlaces.forEach(function (l) {
      if (!todo && !parteEnlace(RED, l)[parte]) return;
      var ll = [POS[l.a], POS[l.b]];
      var linea = L.polyline(ll, { pane: "enlaces", weight: 2, color: COL.nulo, opacity: 0.95, lineCap: "round", interactive: false });
      var golpe = L.polyline(ll, { pane: "enlaces", weight: 16, opacity: 0, bubblingMouseEvents: false });
      golpe.on("click", function (ev) { clicEnlace(l.id, ev); });
      golpe.on("mouseover", function () { linea.setStyle({ opacity: 1 }); });
      golpe.bindTooltip(function () { return esc(nombreEnlace(l.id)) + (R && R.enlaces[l.id] && R.enlaces[l.id].capacidad_gbps ? " · " + fmt(R.enlaces[l.id].ocupacion * 100, 1) + " %" : ""); },
        { className: "hov", sticky: true, direction: "top", offset: [0, -8] });
      linea.addTo(capa); golpe.addTo(capa);
      dib.enl[l.id] = linea;
      nodosVis[l.a] = 1; nodosVis[l.b] = 1;
    });
    // nodos
    var rot = {}; (ROTULOS[parte] || []).forEach(function (id) { rot[id] = 1; });
    RED.nodos.forEach(function (n) {
      if (!todo && !parteNodo(n)[parte] && !nodosVis[n.id]) return;
      var propio = todo || parteNodo(n)[parte];
      var m = L.circleMarker(POS[n.id], { pane: "nodos", radius: propio ? RADIO_N[n.tipo] || 5 : 4, color: "#000", weight: 1.5,
        fillColor: propio ? COL.nodo : "#5f5f5f", fillOpacity: 1, bubblingMouseEvents: false });
      m.on("click", function (ev) { seleccionar("nodo", n.id, ev); });
      if (rot[n.id]) {
        var izq = DIR[n.id] ? DIR[n.id] === "left" : POS[n.id][1] < n.coord[1] - 1e-4;
        m.bindTooltip(esc(corto(n.id)), { permanent: true, className: "rot", direction: izq ? "left" : "right", offset: [izq ? -6 : 6, 0] });
      } else m.bindTooltip(esc(corto(n.id)), { className: "hov", direction: "top", offset: [0, -6] });
      m.addTo(capa); dib.nod[n.id] = m;
    });
  }
  function etiquetaSitio(s) {
    var tec = s.tec === "ftth" ? "OLT FTTH" : s.tec.toUpperCase();
    return tec + " · " + (s.municipio || "");
  }
  var CARGA_REF = 3000;   // Gbit/s que dan el grosor máximo (≈ la acometida más cargada de la v7)
  function colorOcup(pct, conCap) { return conCap ? COL[nivel(pct)] : COL.nulo; }
  function pintar() {
    if (!R) return;
    var cortados = {}; (estadoCalc().fallos || []).forEach(function (id) { cortados[id] = 1; });
    Object.keys(dib.enl).forEach(function (id) {
      var r = R.enlaces[id] || {}, pct = (r.ocupacion || 0) * 100, cap = r.capacidad_gbps;
      var w = 1.5 + 6.5 * Math.sqrt(Math.min(1, (r.carga_gbps || 0) / CARGA_REF));
      if (r.caido || cortados[id]) dib.enl[id].setStyle({ color: COL.rojo, weight: 2, dashArray: "3 6", opacity: 0.9 });
      else dib.enl[id].setStyle({ color: colorOcup(pct, cap), weight: w, dashArray: null, opacity: 0.95 });
    });
    var todo = parteVisible() === "todo", acc = (R.acceso && R.acceso.sitios) || {};
    Object.keys(dib.sit).forEach(function (id) {
      if (todo) return;
      var a = acc[id];
      dib.sit[id].setStyle({ fillColor: a ? (a.caido ? COL.rojo : COL[nivel(a.util_pct || 0)]) : COL.nulo });
    });
    pintarEstado();
    if (S.sel) pintarTarjeta();
    if (S.vista === "cambiar") actualizarPanel();
    if (S.vista === "simular") pintarCurva();
  }
  function pintarEstado() {
    var rs = R.resumen || {}, maxId = rs.enlace_max, pct = (rs.max_ocupacion || 0) * 100;
    var h = "<span><b>" + fmt(rs.pct_servida, rs.pct_servida < 100 ? 1 : 0) + " %</b> " + t("servido") + "</span>";
    if (rs.demandas_afectadas) h += "<span><b>" + rs.demandas_afectadas + "</b> " + t("afect") + "</span>";
    if (maxId) h += '<span>' + t("max") + ' <a data-max="' + esc(maxId) + '" title="' + esc(nombreEnlace(maxId)) + '"><b>' + fmt(pct, 1) + " %</b></a></span>";
    $(".estado-txt").innerHTML = h;
    var m = $(".estado-txt a[data-max]");
    if (m) m.onclick = function () { var c = mapa.latLngToContainerPoint(L.latLngBounds([POS[ENL[maxId].a], POS[ENL[maxId].b]]).getCenter()); abrirTarjeta("enlace", maxId, c); };
  }
  function pintarLeyenda() {
    $(".leyenda").innerHTML = '<span><i style="background:' + COL.ok + '"></i>&lt; 70</span><span><i style="background:' + COL.amb +
      '"></i>70–90</span><span><i style="background:' + COL.rojo + '"></i>&gt; 90 %</span>';
  }

  // ---------- selección y tarjeta ----------
  function clicEnlace(id, ev) {
    if (S.vista === "simular" && S.cortando) {
      var i = E.fallos.indexOf(id);
      if (i >= 0) E.fallos.splice(i, 1); else E.fallos.push(id);
      cerrarTarjeta(); recalcular(); pedirCurva();
      return;
    }
    seleccionar("enlace", id, ev);
  }
  function seleccionar(tipo, id, ev) { abrirTarjeta(tipo, id, ev && ev.containerPoint); }
  function abrirTarjeta(tipo, id, punto) {
    S.sel = { tipo: tipo, id: id, punto: punto || L.point(300, 200) };
    pintarTarjeta();
    if (S.vista === "cambiar") pintarPanel();
  }
  function cerrarTarjeta() {
    S.sel = null; $(".tarjeta").hidden = true;
    if (halo) { capa.removeLayer(halo); halo = null; }
    if (S.vista === "cambiar") pintarPanel();
  }
  function barra(pct, color) {
    return '<div class="barra-oc"><i style="width:' + Math.max(0, Math.min(100, pct)).toFixed(1) + "%;background:" + color + '"></i></div>';
  }
  function pintarTarjeta() {
    var s = S.sel, h = "", el = $(".tarjeta");
    if (!s || !R) return;
    if (halo) { capa.removeLayer(halo); halo = null; }
    if (s.tipo === "enlace") {
      var l = ENL[s.id], r = R.enlaces[s.id] || {}, pct = (r.ocupacion || 0) * 100, cap = r.capacidad_gbps;
      var cortado = r.caido || E.fallos.indexOf(s.id) >= 0 && S.vista === "simular";
      h = "<h3>" + esc(nombreEnlace(s.id)) + "</h3>" + (cap ? barra(pct, cortado ? COL.nulo : colorOcup(pct, cap)) : "") +
        '<div class="cifra"><span class="mono"><b>' + fmtG(r.carga_gbps || 0) + "</b> / " + (cap ? fmtG(cap) : "—") + " Gbit/s</span>" +
        (cap ? '<b class="mono">' + fmt(pct, 1) + " %</b>" : "") + "</div>" +
        '<div class="linea">' + esc(cortado ? t("cortado") : t(l.tipo)) + "</div>";
      halo = L.polyline([POS[l.a], POS[l.b]], { pane: "enlaces", color: "#fff", weight: 12, opacity: 0.18, interactive: false }).addTo(capa);
    } else if (s.tipo === "nodo") {
      var n = NODO[s.id], rn = R.nodos[s.id] || {};
      h = "<h3>" + esc(n.nombre) + "</h3>" + (rn.capacidad_gbps ? barra(rn.ocupacion * 100, colorOcup(rn.ocupacion * 100, 1)) : "") +
        '<div class="cifra"><span class="mono"><b>' + fmtG(rn.carga_gbps || 0) + "</b>" + (rn.capacidad_gbps ? " / " + fmtG(rn.capacidad_gbps) : "") + " Gbit/s</span></div>" +
        '<div class="linea">' + esc(t(n.tipo)) + (rn.caido ? " · " + t("cortado") : "") + "</div>";
    } else {
      var st = SITIO[s.id], a = (R.acceso && R.acceso.sitios && R.acceso.sitios[s.id]) || {}, u = a.util_pct || 0, capM = st.capacidad_mbps && st.capacidad_mbps.dl;
      h = "<h3>" + esc(etiquetaSitio(st)) + "</h3>" + barra(u, COL[nivel(u)]) +
        '<div class="cifra"><span class="mono"><b>' + fmt(a.dl_mbps || 0) + "</b> / " + fmt(capM) + " Mbit/s</span><b class=\"mono\">" + fmt(u, 1) + " %</b></div>" +
        (a.usuarios ? '<div class="linea">' + fmt(a.usuarios) + (lang === "en" ? " users" : " usuarios") + "</div>" : "");
    }
    el.innerHTML = '<button class="x" aria-label="×">×</button>' + h;
    el.hidden = false;
    el.querySelector(".x").onclick = cerrarTarjeta;
    var W = $(".mapa").clientWidth, Hh = $(".mapa").clientHeight, x = s.punto.x + 14, y = s.punto.y - 20;
    if (x + 240 > W) x = s.punto.x - 244;
    y = Math.max(50, Math.min(y, Hh - el.offsetHeight - 50));
    el.style.left = Math.max(8, x) + "px"; el.style.top = y + "px";
  }
  mapa.on("click", function () { cerrarTarjeta(); });

  // ---------- Simular: reloj, cortes y curva del día ----------
  var curva = null, curvaKey = "";
  function pedirCurva() {
    var e = estadoCalc(), o = opciones(Motor, { anio: e.anio, crec: e.crec, evento: e.evento, cap: e.cap, fallos: [], hora: 0 });
    var caso = { caso: o.caso }, op = { paso_min: 60, fallos: E.fallos.slice() };
    if (o.modelo_usuario) op.modelo_usuario = o.modelo_usuario;
    var k = JSON.stringify([caso, op, E.cap]);
    if (k === curvaKey) { pintarCurva(); return; }
    curvaKey = k;
    Motor.serieAsync(redCon(RED, E.cap), caso, op).then(function (s) {
      if (k !== curvaKey) return;
      curva = s.pasos.map(function (p) { return p.resumen.ocup_max_pct; });
      pintarCurva();
    }).catch(function (x) { console.error("serie", x); });
  }
  function pintarCurva() {
    var el = $(".curva");
    if (S.vista !== "simular" || !curva) { el.hidden = S.vista !== "simular"; if (!curva) el.innerHTML = ""; return; }
    var W = 230, H = 86, ml = 24, mr = 6, mt = 6, mb = 16, iw = W - ml - mr, ih = H - mt - mb, ymax = 120;
    var X = function (h) { return ml + iw * h / 23; }, Y = function (v) { return mt + ih * (1 - Math.min(v, ymax) / ymax); };
    var d = curva.map(function (v, h) { return (h ? "L" : "M") + X(h).toFixed(1) + "," + Y(v).toFixed(1); }).join("");
    var hs = E.horaSim, svg = '<svg width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(t("curva")) + '">';
    [0, 50, 100].forEach(function (v) { svg += '<text x="' + (ml - 4) + '" y="' + (Y(v) + 3) + '" fill="#858585" font-size="9" text-anchor="end">' + v + "</text>"; });
    [[U_AMB, COL.amb], [U_ROJO, COL.rojo]].forEach(function (u) { svg += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(u[0]) + '" y2="' + Y(u[0]) + '" stroke="' + u[1] + '" stroke-opacity=".45" stroke-dasharray="2 3"/>'; });
    [0, 6, 12, 18, 23].forEach(function (h) { svg += '<text x="' + X(h) + '" y="' + (H - 3) + '" fill="#858585" font-size="9" text-anchor="middle">' + (h === 23 ? "23" : h) + "</text>"; });
    svg += '<path d="' + d + '" fill="none" stroke="#d9d9d9" stroke-width="2" stroke-linejoin="round"/>';
    svg += '<line x1="' + X(hs) + '" x2="' + X(hs) + '" y1="' + mt + '" y2="' + (mt + ih) + '" stroke="#f2f2f2" stroke-opacity=".5"/>';
    svg += '<circle cx="' + X(hs) + '" cy="' + Y(curva[hs]) + '" r="4" fill="' + COL[nivel(curva[hs])] + '" stroke="#000" stroke-width="2"/>';
    svg += '<rect class="golpe" x="' + ml + '" y="0" width="' + iw + '" height="' + H + '" fill="transparent" style="cursor:pointer"/></svg>';
    el.innerHTML = '<div class="tit">' + esc(t("curva")) + '</div>' + svg + '<div class="tip" hidden></div>';
    el.hidden = false;
    var g = el.querySelector(".golpe"), tip = el.querySelector(".tip");
    function horaDe(ev) { var b = g.getBoundingClientRect(); return Math.max(0, Math.min(23, Math.round((ev.clientX - b.left) / b.width * 23))); }
    g.onmousemove = function (ev) {
      var h = horaDe(ev); tip.hidden = false;
      tip.textContent = (h < 10 ? "0" : "") + h + ":00 · " + fmt(curva[h], 0) + " %";
      tip.style.left = (X(h) + 8 - (h > 15 ? 90 : 0)) + "px"; tip.style.top = "22px";
    };
    g.onmouseleave = function () { tip.hidden = true; };
    g.onclick = function (ev) { ponerHora(horaDe(ev)); };
  }
  function ponerHora(h) {
    E.horaSim = h; $(".hora").value = h; $(".hora-txt").textContent = (h < 10 ? "0" : "") + h + ":00";
    recalcular();
  }
  $(".hora").oninput = function () { ponerHora(+this.value); };
  $(".play").onclick = function () {
    if (S.play) { clearInterval(S.play); S.play = null; this.textContent = "▶"; return; }
    this.textContent = "❚❚";
    S.play = setInterval(function () { ponerHora((E.horaSim + 1) % 24); }, 700);
  };
  $(".cortar").onclick = function () {
    S.cortando = !S.cortando; this.setAttribute("aria-pressed", S.cortando ? "true" : "false");
    document.body.classList.toggle("cortando", S.cortando);
  };
  $(".restaurar").onclick = function () { E.fallos = []; recalcular(); pedirCurva(); };

  // ---------- Cambiar ----------
  function pintarPanel() {
    var el = $(".panel"), evs = (EVENTOS = EVENTOS || Motor.casos(RED).evento || []).map(function (x) { return x.id; });
    var sel = S.sel && S.sel.tipo === "enlace" ? S.sel.id : null, capV = sel ? (sel in E.cap ? E.cap[sel] : ENL[sel].capacidad_gbps) : null;
    var foco = document.activeElement && document.activeElement.id;
    el.innerHTML =
      '<span class="marca-cambio"></span>' +
      "<h4>" + esc(t("demanda")) + "</h4>" +
      '<label>' + esc(t("anio")) + ' <b class="mono" id="v-anio"></b></label><input id="c-anio" type="range" min="2026" max="2035" step="1" value="' + E.anio + '">' +
      '<label>' + esc(t("crec")) + ' <b class="mono" id="v-crec"></b></label><input id="c-crec" type="range" min="-50" max="100" step="5" value="' + E.crec + '">' +
      '<label>' + esc(t("evento")) + ' <select id="c-evento">' + evs.map(function (id) {
        return '<option value="' + esc(id) + '"' + (id === E.evento ? " selected" : "") + ">" + esc(EVT[id] ? t(id) : id) + "</option>"; }).join("") + "</select></label>" +
      "<h4>" + esc(t("transp")) + "</h4>" +
      (sel ? '<div>' + esc(nombreEnlace(sel)) + '</div><label>' + esc(t("enlace")) + ' <span><input id="c-cap" type="number" min="0" step="10" value="' + (capV == null ? "" : capV) + '"> Gbit/s</span></label>'
        : '<div class="nada">' + esc(t("clic")) + "</div>") +
      '<button class="ref" id="c-ref">' + esc(t("volver")) + "</button>";
    el.querySelector("#c-anio").oninput = function () { E.anio = +this.value; recalcular(); };
    el.querySelector("#c-crec").oninput = function () { E.crec = +this.value; recalcular(); };
    el.querySelector("#c-evento").onchange = function () { E.evento = this.value; recalcular(); };
    var ic = el.querySelector("#c-cap");
    if (ic) ic.onchange = function () {
      var v = parseFloat(this.value);
      if (!isFinite(v) || v < 0) return;
      if (v === ENL[sel].capacidad_gbps) delete E.cap[sel]; else E.cap[sel] = v;
      recalcular();
    };
    el.querySelector("#c-ref").onclick = function () { var h = E.horaSim; E = estadoRef(); E.horaSim = h; pintarPanel(); recalcular(); };
    if (foco) { var f = el.querySelector("#" + foco); if (f) f.focus(); }
    actualizarPanel();
  }
  function actualizarPanel() {
    var el = $(".panel"), ref = esRef(E), m = el.querySelector(".marca-cambio");
    if (!m) return;
    m.className = "marca-cambio " + (ref ? "ref" : "lab"); m.textContent = ref ? t("igual") : t("distinto");
    el.querySelector("#v-anio").textContent = E.anio;
    el.querySelector("#v-crec").textContent = (E.crec > 0 ? "+" : "") + E.crec + " %";
    el.querySelector("#c-ref").disabled = ref;
  }

  // ---------- vistas, partes, idioma ----------
  function pintarChips() {
    var c = $(".chips");
    if (S.vista !== "red") { c.innerHTML = ""; return; }
    c.innerHTML = ["todo", "radio", "fibra", "transporte", "nucleo"].map(function (p) {
      return '<button data-parte="' + p + '" aria-pressed="' + (S.parte === p) + '">' + esc(t(p)) + "</button>"; }).join("");
    c.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () { S.parte = b.getAttribute("data-parte"); cerrarTarjeta(); pintarChips(); construir(); encuadrar(); pintar(); };
    });
  }
  function ponerVista(v) {
    S.vista = v;
    try { history.replaceState(null, "", "#" + v); } catch (x) { /* nada */ }
    document.querySelectorAll(".tabs button").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-vista") === v ? "true" : "false"); });
    document.body.classList.toggle("con-panel", v === "cambiar");
    $(".panel").hidden = v !== "cambiar";
    $(".reloj").hidden = v !== "simular";
    $(".curva").hidden = v !== "simular";
    if (v !== "simular") { if (S.play) $(".play").click(); S.cortando = false; $(".cortar").setAttribute("aria-pressed", "false"); document.body.classList.remove("cortando"); }
    $(".info-txt").hidden = true;
    cerrarTarjeta();
    mapa.invalidateSize();
    pintarChips(); construir(); encuadrar(); recalcular();
    if (v === "simular") pedirCurva();
  }
  function ponerIdioma(l) {
    lang = l; document.documentElement.lang = l;
    try { localStorage.setItem("simple.lang", l); } catch (x) { /* nada */ }
    document.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t(n.getAttribute("data-t")); });
    document.querySelectorAll(".idioma button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false"); });
    pintarChips(); pintarLeyenda();
    if (S.vista === "cambiar") pintarPanel();
    if ($(".info-txt").hidden === false) $(".info-txt").textContent = t("i_" + S.vista);
    if (R) pintar();
  }
  document.querySelectorAll(".tabs button").forEach(function (b) { b.onclick = function () { ponerVista(b.getAttribute("data-vista")); }; });
  document.querySelectorAll(".idioma button").forEach(function (b) { b.onclick = function () { ponerIdioma(b.getAttribute("data-lang")); }; });
  $(".info").onclick = function () { var x = $(".info-txt"); x.textContent = t("i_" + S.vista); x.hidden = !x.hidden; };
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { cerrarTarjeta(); $(".info-txt").hidden = true; } });
  if (window.ResizeObserver) new ResizeObserver(function () { mapa.invalidateSize(); }).observe($(".mapa"));

  // Atajos para probar (y para CDP): Simple.ui.vista("simular"), .hora(21), .cortar("L-ANILLO-CN"), .parte("transporte")…
  raiz.Simple.ui = {
    vista: ponerVista, hora: ponerHora,
    parte: function (p) { S.parte = p; cerrarTarjeta(); pintarChips(); construir(); encuadrar(); pintar(); },
    cortar: function (id) { E.fallos.push(id); recalcular(); pedirCurva(); },
    enlace: function (id) { var c = mapa.latLngToContainerPoint(L.latLngBounds([POS[ENL[id].a], POS[ENL[id].b]]).getCenter()); abrirTarjeta("enlace", id, c); },
    anio: function (a) { E.anio = a; recalcular(); },
    resultado: function () { return R; }, estado: function () { return E; }
  };

  ponerIdioma(lang);
  var v0 = (location.hash || "").replace("#", "");
  ponerVista(v0 === "simular" || v0 === "cambiar" ? v0 : "red");
})(typeof window !== "undefined" ? window : this);
