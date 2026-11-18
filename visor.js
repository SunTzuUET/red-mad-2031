// Visor del simulador de red. Consume window.RED y window.Motor (contrato en PLAN.md).
(function () {
  "use strict";

  var RED = window.RED, Motor = window.Motor;
  var $ = function (id) { return document.getElementById(id); };

  if (!RED || !Motor || typeof L === "undefined") {
    document.body.innerHTML = '<p style="padding:20px;font-size:16px">No se pudo cargar ' +
      (!RED ? "la red (red.js / datos/mock.js)" : !Motor ? "el motor (motor.js / motor_stub.js)" : "Leaflet (requiere Internet)") + ".</p>";
    return;
  }

  // ---------- Índices ----------
  var nodos = {}, enlaces = {}, zonas = {}, servicios = {};
  (RED.nodos || []).forEach(function (n) { nodos[n.id] = n; });
  (RED.enlaces || []).forEach(function (e) { enlaces[e.id] = e; });
  (RED.zonas || []).forEach(function (z) { zonas[z.id] = z; });
  (RED.servicios || []).forEach(function (s) { servicios[s.id] = s; });
  var escenarios = RED.escenarios || [];

  // ---------- Estado ----------
  var S = {
    escenario: escenarios.length ? escenarios[0].id : null,
    hora: escenarios.length && escenarios[0].hora != null ? escenarios[0].hora : 21,
    manual: [],
    sel: null,              // {tipo: "enlace"|"nodo"|"zona"|"servicio", id}
    rutaHover: null,        // id de demanda resaltada
    rutaFija: null,
    puf: false, pufInfo: null,
    supuestos: false,
    res: null, serie: null, timer: null,
    capas: { zonas: true, nodos: true, acceso: true, wdm: true, mpls: true, servicios: true, rutas: true }
  };

  // ---------- Utilidades ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(x, d) { return Number(x).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function fmtG(x) {
    if (x == null || isNaN(x)) return "—";
    if (x === Infinity) return "∞";
    if (Math.abs(x) >= 1000) return num(x / 1000, 2) + " Tbps";
    return num(x, Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2) + " Gbps";
  }
  // % servida: se calcula de los Gbps (el motor puede dar pct en 0..1 o 0..100)
  function ratio(serv, dl, pct) {
    if (dl > 0 && serv != null) return serv / dl;
    if (pct == null || isNaN(pct)) return null;
    return pct > 1.0001 ? pct / 100 : pct;
  }
  function fmtN(x) { // Gbps sin unidad, para tablas
    if (x == null || isNaN(x)) return "—";
    return num(x, Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2);
  }
  function fmtPct(x) { return x == null || isNaN(x) ? "—" : num(x * 100, 1) + " %"; }
  function fmtMs(x) { return x == null || isNaN(x) ? "—" : num(x, 2) + " ms"; }
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function nombre(id) {
    var o = nodos[id] || zonas[id] || servicios[id] || enlaces[id];
    return o && o.nombre ? o.nombre : id;
  }
  function colorOcup(o, caido) {
    if (caido) return cssVar("--caido");
    if (o > 0.9) return cssVar("--mal");
    if (o >= 0.6) return cssVar("--medio");
    return cssVar("--ok");
  }
  function colorPct(p) {
    if (p == null) return cssVar("--caido");
    if (p >= 0.99) return cssVar("--ok");
    if (p >= 0.9) return cssVar("--medio");
    return cssVar("--mal");
  }
  function escActual() {
    for (var i = 0; i < escenarios.length; i++) if (escenarios[i].id === S.escenario) return escenarios[i];
    return null;
  }
  function fallosEsc() { var e = escActual(); return (e && e.fallos) || []; }
  function esSupuesto(o) { return !!(o && o.supuesto); }
  function zonaTieneSupuestos(z) {
    return esSupuesto(z) || (z.necesidades || []).some(esSupuesto);
  }
  function capaEnlace(e) {
    if (e.tipo === "mpls") return "mpls";
    if (e.tipo === "backhaul" || e.tipo === "fttx" || e.tipo === "acceso" || e.tipo === "sat") return "acceso";
    return "wdm"; // wdm e ix
  }
  function capaNodo(n) {
    if (n.tipo === "agg") return "acceso";
    if (n.tipo === "site") return "servicios";
    return "nodos";
  }
  var ETQ = { core: "CPD", edge: "E", metro: "M", agg: "A", ix: "IX", site: "S" };
  var TIPO_NODO = { core: "CPD core", edge: "Edge (UPF/MEC)", metro: "Nodo metro", agg: "Agregación de acceso", ix: "Interconexión (IX)", site: "Sitio de servicio" };
  var TIPO_ENL = { wdm: "Transporte WDM", mpls: "MPLS", backhaul: "Backhaul", fttx: "FTTx", ix: "Peering/IX", acceso: "Acceso de sitio", sat: "Satélite (NTN)" };

  // ---------- Mapa ----------
  var mapa = L.map("mapa", { zoomControl: true, preferCanvas: false });
  mapa.createPane("zonas").style.zIndex = 350;
  mapa.createPane("etiquetas").style.zIndex = 380;
  mapa.getPane("etiquetas").style.pointerEvents = "none";
  mapa.createPane("halos").style.zIndex = 390;
  mapa.createPane("rutas").style.zIndex = 450;
  var teselas = null;
  function temaOscuro() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  // Teselas Esri Canvas (gris claro/oscuro, sin clave; CARTO pide ya API key). Etiquetas en capa aparte.
  function ponerTeselas() {
    if (teselas) teselas.forEach(function (t) { mapa.removeLayer(t); });
    var base = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_" + (temaOscuro() ? "Dark" : "Light") + "_Gray_";
    var attr = 'Teselas &copy; <a href="https://www.esri.com/">Esri</a> — Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    teselas = [
      L.tileLayer(base + "Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: attr }),
      L.tileLayer(base + "Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, pane: "etiquetas", opacity: 0.9 })
    ];
    teselas.forEach(function (t) { t.addTo(mapa); });
  }

  var grupos = {};
  Object.keys(S.capas).forEach(function (k) { grupos[k] = L.layerGroup().addTo(mapa); });

  // Enlaces
  var maxCap = 1;
  (RED.enlaces || []).forEach(function (e) { if (e.capacidad_gbps > maxCap) maxCap = e.capacidad_gbps; });
  function grosor(e) { return 2 + 8 * Math.sqrt((e.capacidad_gbps || 0) / maxCap); }
  var vEnl = {};
  (RED.enlaces || []).forEach(function (e) {
    var a = nodos[e.a], b = nodos[e.b];
    if (!a || !b || !a.coord || !b.coord) return;
    var ll = [a.coord, b.coord], w = grosor(e), g = grupos[capaEnlace(e)];
    var halo = L.polyline(ll, { pane: "halos", weight: w + 7, opacity: 0, color: "#7c3aed", dashArray: "2 6", interactive: false }).addTo(g);
    var linea = L.polyline(ll, { weight: w, opacity: 0.9, lineCap: "round", interactive: false }).addTo(g);
    var hit = L.polyline(ll, { weight: Math.max(w + 6, 14), opacity: 0, bubblingMouseEvents: false }).addTo(g);
    hit.on("click", function () { seleccionar("enlace", e.id); });
    hit.bindTooltip("", { sticky: true });
    vEnl[e.id] = { halo: halo, linea: linea, hit: hit, w: w };
  });

  // Nodos
  var vNod = {};
  function iconoNodo(n, extra) {
    var cls = "nodo-ico " + n.tipo + (esSupuesto(n) ? " sup" : "") + (extra || "");
    var t = ETQ[n.tipo] || "?";
    return L.divIcon({ className: "", html: '<div class="' + cls + '"><span>' + t + "</span></div>", iconSize: null });
  }
  (RED.nodos || []).forEach(function (n) {
    if (!n.coord) return;
    var m = L.marker(n.coord, { icon: iconoNodo(n), riseOnHover: true, zIndexOffset: n.tipo === "core" ? 300 : n.tipo === "edge" ? 200 : 0 });
    m.on("click", function () { seleccionar("nodo", n.id); });
    m.bindTooltip("", { direction: "top", offset: [0, -10] });
    m.addTo(grupos[capaNodo(n)]);
    vNod[n.id] = m;
  });

  // Zonas y servicios (círculos de demanda)
  var vZon = {}, vSer = {};
  (RED.zonas || []).forEach(function (z) {
    if (!z.centro) return;
    var c = L.circleMarker(z.centro, { pane: "zonas", radius: 10, weight: 2, fillOpacity: 0.28, bubblingMouseEvents: false,
      dashArray: zonaTieneSupuestos(z) ? "5 4" : null });
    c.on("click", function () { seleccionar("zona", z.id); });
    c.bindTooltip("", { direction: "top" });
    c.addTo(grupos.zonas);
    vZon[z.id] = c;
  });
  (RED.servicios || []).forEach(function (s) {
    var co = s.coord || (nodos[s.nodo] && nodos[s.nodo].coord);
    if (!co) return;
    var c = L.circleMarker(co, { pane: "zonas", radius: 8, weight: 2, fillOpacity: 0.3, bubblingMouseEvents: false,
      dashArray: esSupuesto(s) ? "5 4" : null });
    c.on("click", function () { seleccionar("servicio", s.id); });
    c.bindTooltip("", { direction: "top" });
    c.addTo(grupos.servicios);
    vSer[s.id] = c;
  });

  mapa.on("click", function () { cerrarFicha(); });

  function encuadrar() {
    var pts = [];
    (RED.nodos || []).forEach(function (n) { if (n.coord) pts.push(n.coord); });
    (RED.zonas || []).forEach(function (z) { if (z.centro) pts.push(z.centro); });
    if (pts.length) mapa.fitBounds(L.latLngBounds(pts).pad(0.12));
    else mapa.setView([40.42, -3.70], 10);
  }

  // ---------- Cálculo ----------
  var demById = {};
  function calcular() {
    try {
      S.res = Motor.calcular(RED, { escenario: S.escenario, hora: S.hora, fallos: S.manual.slice(), factores: {} });
    } catch (err) {
      console.error(err);
      S.res = null;
      $("alertas").innerHTML = '<li class="grave">Error del motor: ' + esc(err && err.message) + "</li>";
      return;
    }
    demById = {};
    (S.res.demandas || []).forEach(function (d) { demById[d.id] = d; });
    // Demandas repartidas entre CPD ("<id>@CORE-n", con padre): se agregan bajo el id padre
    var GRAV = { ok: 0, latencia: 1, degradado: 2, caido: 3 };
    (S.res.demandas || []).forEach(function (d) {
      if (!d.padre) return;
      var a = demById[d.padre];
      if (!a) {
        a = demById[d.padre] = { id: d.padre, zona: d.zona, origen: d.origen, tipo: d.tipo, clase: d.clase,
          prioridad: d.prioridad, slice: d.slice, dl_gbps: 0, servida_gbps: 0, latencia_ms: null,
          latencia_max_ms: d.latencia_max_ms, via: "principal", estado: "ok", ruta: [], enlaces: [], partes: [] };
      }
      a.partes.push(d);
      a.dl_gbps += d.dl_gbps; a.servida_gbps += d.servida_gbps;
      if (d.latencia_ms != null && (a.latencia_ms == null || d.latencia_ms > a.latencia_ms)) a.latencia_ms = d.latencia_ms;
      if (d.via === "respaldo") a.via = "respaldo";
      if (GRAV[d.estado] > GRAV[a.estado]) a.estado = d.estado;
      a.destino_nodo = a.partes.map(function (p) { return p.destino_nodo; }).join(" + ");
    });
    pintar();
  }
  function calcularSerie() {
    try {
      S.serie = typeof Motor.serieDiaria === "function"
        ? Motor.serieDiaria(RED, { escenario: S.escenario, fallos: S.manual.slice(), factores: {} }) : null;
    } catch (err) { console.error(err); S.serie = null; }
  }
  function todo() { calcularSerie(); calcular(); }

  function caidoPor(id) {
    if (S.manual.indexOf(id) >= 0) return "manual";
    if (fallosEsc().indexOf(id) >= 0) return "escenario";
    return null;
  }
  function pufSet() {
    var s = {};
    if (S.puf && S.pufInfo) S.pufInfo.forEach(function (p) { s[p.id] = p; });
    return s;
  }

  // ---------- Pintado del mapa ----------
  function pintar() {
    var r = S.res; if (!r) return;
    var puf = pufSet(), saturados = {};
    ((r.resumen && r.resumen.enlaces_saturados) || []).forEach(function (id) { saturados[id] = true; });
    var supCol = cssVar("--supuesto"), pufCol = cssVar("--puf");

    Object.keys(vEnl).forEach(function (id) {
      var v = vEnl[id], e = enlaces[id], x = (r.enlaces || {})[id] || {};
      var caido = !!x.caido || !!caidoPor(id);
      var sel = S.sel && S.sel.tipo === "enlace" && S.sel.id === id;
      v.linea.setStyle({ color: colorOcup(x.ocupacion || 0, caido), dashArray: caido ? "6 8" : null,
        opacity: caido ? 0.75 : 0.92, weight: v.w + (sel ? 3 : 0) });
      if (puf[id]) v.halo.setStyle({ opacity: 0.85, color: pufCol, dashArray: null, weight: v.w + 9 });
      else if (S.supuestos && esSupuesto(e)) v.halo.setStyle({ opacity: 0.9, color: supCol, dashArray: "2 6", weight: v.w + 7 });
      else if (sel) v.halo.setStyle({ opacity: 0.6, color: cssVar("--acento"), dashArray: null, weight: v.w + 8 });
      else v.halo.setStyle({ opacity: 0 });
      v.hit.setTooltipContent("<b>" + esc(id) + "</b> · " + esc(TIPO_ENL[e.tipo] || e.tipo) + "<br>" +
        (caido ? "<b>CAÍDO</b>" : fmtG(x.carga_gbps) + " / " + fmtG(e.capacidad_gbps) + " (" + fmtPct(x.ocupacion) + ")") +
        (esSupuesto(e) ? '<br><span class="tt-sup">supuesto</span>' : ""));
    });

    Object.keys(vNod).forEach(function (id) {
      var n = nodos[id], x = (r.nodos || {})[id] || {};
      var extra = ((x.caido || caidoPor(id)) ? " caido" : "") + (puf[id] ? " puf" : "") +
        (S.sel && S.sel.tipo === "nodo" && S.sel.id === id ? " sel" : "") +
        (x.capacidad_gbps && x.ocupacion > 0.9 ? " sat" : "");
      vNod[id].setIcon(iconoNodo(n, extra));
      vNod[id].setTooltipContent("<b>" + esc(n.nombre || id) + "</b> (" + esc(id) + ")<br>" +
        esc(TIPO_NODO[n.tipo] || n.tipo) + ((x.caido || caidoPor(id)) ? " · <b>CAÍDO</b>" :
        x.capacidad_gbps ? " · " + fmtPct(x.ocupacion) : "") +
        (esSupuesto(n) ? '<br><span class="tt-sup">supuesto</span>' : ""));
    });

    var maxDl = 0;
    Object.keys(r.zonas || {}).forEach(function (k) { maxDl = Math.max(maxDl, r.zonas[k].dl_gbps || 0); });
    (r.demandas || []).forEach(function (d) { if (servicios[d.padre || d.id]) maxDl = Math.max(maxDl, d.dl_gbps || 0); });
    maxDl = maxDl || 1;
    Object.keys(vZon).forEach(function (id) {
      var z = (r.zonas || {})[id] || { dl_gbps: 0, servida_gbps: 0, pct: null };
      z = { dl_gbps: z.dl_gbps, servida_gbps: z.servida_gbps, pct: ratio(z.servida_gbps, z.dl_gbps, z.pct) };
      var col = colorPct(z.pct);
      var sel = S.sel && S.sel.tipo === "zona" && S.sel.id === id;
      vZon[id].setRadius(8 + 34 * Math.sqrt((z.dl_gbps || 0) / maxDl));
      vZon[id].setStyle({ color: S.supuestos && zonaTieneSupuestos(zonas[id]) ? supCol : col, fillColor: col, weight: sel ? 4 : 2 });
      vZon[id].setTooltipContent("<b>" + esc(zonas[id].nombre || id) + "</b><br>Demanda " + fmtG(z.dl_gbps) +
        " · servida " + fmtPct(z.pct) + (zonaTieneSupuestos(zonas[id]) ? '<br><span class="tt-sup">contiene supuestos</span>' : ""));
    });
    Object.keys(vSer).forEach(function (id) {
      var d = demById[id] || { dl_gbps: 0, servida_gbps: 0 };
      var p = d.dl_gbps ? d.servida_gbps / d.dl_gbps : null;
      var col = colorPct(p), s = servicios[id];
      vSer[id].setRadius(6 + 26 * Math.sqrt((d.dl_gbps || 0) / maxDl));
      vSer[id].setStyle({ color: S.supuestos && esSupuesto(s) ? supCol : col, fillColor: col,
        weight: S.sel && S.sel.tipo === "servicio" && S.sel.id === id ? 4 : 2 });
      vSer[id].setTooltipContent("<b>" + esc(s.nombre || id) + "</b><br>Demanda " + fmtG(d.dl_gbps) + " · " + esc(d.estado || ""));
    });

    pintarResumen(); pintarAlertas(); pintarChips(); pintarGrafica(); pintarPuf(); pintarRutas();
    if (S.sel) pintarFicha();
  }

  // ---------- Rutas ----------
  var capaRutas = grupos.rutas;
  function coordsRuta(d) {
    var segs = [];
    if (d.enlaces && d.enlaces.length) {
      d.enlaces.forEach(function (lid) {
        var e = enlaces[lid]; if (!e || !nodos[e.a] || !nodos[e.b]) return;
        segs.push([nodos[e.a].coord, nodos[e.b].coord]);
      });
    } else if (d.ruta && d.ruta.length > 1) {
      for (var i = 1; i < d.ruta.length; i++) {
        var a = nodos[d.ruta[i - 1]], b = nodos[d.ruta[i]];
        if (a && b) segs.push([a.coord, b.coord]);
      }
    }
    return segs;
  }
  function demandasContexto() {
    if (!S.sel || !S.res) return [];
    if (S.sel.tipo === "zona") return (S.res.demandas || []).filter(function (d) { return d.zona === S.sel.id && !servicios[d.padre || d.id]; });
    if (S.sel.tipo === "servicio") { var x = demById[S.sel.id]; return x ? (x.partes || [x]) : []; }
    return [];
  }
  function pintarRutas() {
    capaRutas.clearLayers();
    if (!S.res) return;
    var col = cssVar("--ruta");
    demandasContexto().forEach(function (d) {
      coordsRuta(d).forEach(function (s) {
        L.polyline(s, { pane: "rutas", color: col, weight: 3, opacity: 0.35, interactive: false }).addTo(capaRutas);
      });
    });
    [S.rutaFija, S.rutaHover].forEach(function (id) {
      var dd = id && demById[id]; if (!dd) return;
      (dd.partes || [dd]).forEach(function (d) {
        coordsRuta(d).forEach(function (s) {
          L.polyline(s, { pane: "rutas", color: col, weight: 7, opacity: 0.9, interactive: false, lineCap: "round" }).addTo(capaRutas);
        });
        var o = nodos[d.origen], t = nodos[d.destino_nodo];
        if (o) L.circleMarker(o.coord, { pane: "rutas", radius: 6, color: col, fillColor: "#fff", fillOpacity: 1, weight: 3, interactive: false }).addTo(capaRutas);
        if (t) L.circleMarker(t.coord, { pane: "rutas", radius: 7, color: col, fillColor: col, fillOpacity: 1, weight: 2, interactive: false }).addTo(capaRutas);
      });
    });
  }

  // ---------- Panel ----------
  function kpi(v, t, color) { return '<div class="kpi"><b' + (color ? ' style="color:' + color + '"' : "") + ">" + v + "</b><span>" + t + "</span></div>"; }
  function pintarResumen() {
    var r = S.res.resumen || {};
    var sat = r.enlaces_saturados || [];
    var pr = ratio(r.servida_gbps, r.dl_total_gbps, r.pct_servida);
    $("resumen").innerHTML =
      kpi(fmtG(r.dl_total_gbps), "Demanda total (DL)") +
      kpi(fmtPct(pr), "Servida (" + fmtG(r.servida_gbps) + ")", colorPct(pr)) +
      kpi(String(sat.length), "Enlaces saturados (&gt;90 %)", sat.length ? cssVar("--mal") : null) +
      kpi(String(r.demandas_afectadas || 0), "Demandas afectadas", r.demandas_afectadas ? cssVar("--medio") : null);
  }
  function pintarAlertas() {
    var al = (S.res.resumen && S.res.resumen.alertas) || [];
    var ord = { grave: 0, aviso: 1, info: 2 };
    al = al.slice().sort(function (a, b) { var x = a.nivel in ord ? ord[a.nivel] : 3, y = b.nivel in ord ? ord[b.nivel] : 3; return x - y; });
    $("alertas").innerHTML = al.length ? al.map(function (a) {
      return '<li class="' + esc(a.nivel) + '">' + esc(a.texto) + "</li>";
    }).join("") : '<li class="info">Sin alertas.</li>';
  }
  function pintarChips() {
    var h = "";
    fallosEsc().forEach(function (id) {
      h += '<span class="chip escenario" title="Fallo del escenario" data-sel="' + esc(id) + '">' + esc(id) + "</span>";
    });
    S.manual.forEach(function (id) {
      h += '<span class="chip" data-sel="' + esc(id) + '">' + esc(id) +
        '<button type="button" title="Restaurar" data-quitar="' + esc(id) + '">×</button></span>';
    });
    $("chips-fallos").innerHTML = h || '<span class="vacio">Ninguno. Pulsa un enlace o nodo y “Simular caída”.</span>';
    $("btn-restaurar").disabled = !S.manual.length;
  }
  $("chips-fallos").addEventListener("click", function (ev) {
    var q = ev.target.getAttribute("data-quitar");
    if (q) { alternarFallo(q); return; }
    var c = ev.target.closest("[data-sel]");
    if (c) seleccionarId(c.getAttribute("data-sel"));
  });

  // Gráfica SVG de la serie diaria
  function pintarGrafica() {
    var cont = $("grafica");
    var s = S.serie;
    if (!s || !s.length) { cont.innerHTML = '<span class="vacio">El motor no ofrece serie diaria.</span>'; return; }
    var W = 300, H = 130, ml = 34, mr = 26, mt = 8, mb = 18;
    var pw = W - ml - mr, ph = H - mt - mb;
    var ymax = 0;
    s.forEach(function (p) { ymax = Math.max(ymax, p.dl_total_gbps || 0, p.servida_gbps || 0); });
    ymax = ymax || 1;
    var x = function (h) { return ml + pw * h / 23; };
    var y = function (v) { return mt + ph * (1 - v / ymax); };
    var yo = function (o) { return mt + ph * (1 - Math.min(o, 1.2) / 1.2); };
    var ok = cssVar("--ok"), ac = cssVar("--acento"), mal = cssVar("--mal"), t2 = cssVar("--texto-2"), tx = cssVar("--texto");
    var lin = function (f) { return s.map(function (p, i) { return (i ? "L" : "M") + x(p.hora != null ? p.hora : i).toFixed(1) + " " + f(p).toFixed(1); }).join(" "); };
    var area = lin(function (p) { return y(p.servida_gbps || 0); }) + " L" + x(23) + " " + y(0) + " L" + x(0) + " " + y(0) + " Z";
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Serie diaria de demanda y tráfico servido">';
    g += '<line class="eje" x1="' + ml + '" y1="' + y(0) + '" x2="' + (W - mr) + '" y2="' + y(0) + '"/>';
    g += '<line class="eje" x1="' + ml + '" y1="' + yo(0.9) + '" x2="' + (W - mr) + '" y2="' + yo(0.9) + '" stroke-dasharray="2 3" stroke="' + mal + '" opacity=".5"/>';
    g += '<text x="' + (ml - 4) + '" y="' + (mt + 7) + '" text-anchor="end">' + esc(fmtG(ymax).replace(" Gbps", "G").replace(" Tbps", "T")) + "</text>";
    g += '<text x="' + (ml - 4) + '" y="' + y(0) + '" text-anchor="end">0</text>';
    g += '<text x="' + (W - mr + 3) + '" y="' + (yo(0.9) + 3) + '" fill="' + mal + '">90%</text>';
    [0, 6, 12, 18, 23].forEach(function (h) { g += '<text x="' + x(h) + '" y="' + (H - 5) + '" text-anchor="middle">' + h + "h</text>"; });
    g += '<path d="' + area + '" fill="' + ok + '" opacity=".22"/>';
    g += '<path d="' + lin(function (p) { return y(p.dl_total_gbps || 0); }) + '" fill="none" stroke="' + t2 + '" stroke-width="1.5" stroke-dasharray="4 3"/>';
    g += '<path d="' + lin(function (p) { return y(p.servida_gbps || 0); }) + '" fill="none" stroke="' + ok + '" stroke-width="2"/>';
    g += '<path d="' + lin(function (p) { return yo(p.max_ocupacion || 0); }) + '" fill="none" stroke="' + mal + '" stroke-width="1.3" opacity=".85"/>';
    var hx = x(S.hora);
    g += '<line x1="' + hx + '" y1="' + mt + '" x2="' + hx + '" y2="' + y(0) + '" stroke="' + ac + '" stroke-width="2"/>';
    var ph_ = s[S.hora];
    if (ph_) g += '<circle cx="' + hx + '" cy="' + y(ph_.servida_gbps || 0) + '" r="3.5" fill="' + ac + '" stroke="' + tx + '" stroke-width=".5"/>';
    s.forEach(function (p, i) {
      var h = p.hora != null ? p.hora : i;
      g += '<rect data-h="' + h + '" x="' + (x(h) - pw / 46) + '" y="' + mt + '" width="' + (pw / 23) + '" height="' + ph + '" fill="transparent"><title>' +
        h + ":00 · demanda " + esc(fmtG(p.dl_total_gbps)) + " · servida " + esc(fmtPct(ratio(p.servida_gbps, p.dl_total_gbps, p.pct_servida))) +
        " · ocupación máx. " + esc(fmtPct(p.max_ocupacion)) + (p.enlace_max ? " (" + esc(p.enlace_max) + ")" : "") + "</title></rect>";
    });
    g += "</svg>";
    g += '<div class="desc"><span style="color:' + t2 + '">┄ demanda</span> · <span style="color:' + ok + '">━ servida</span> · <span style="color:' + mal + '">━ ocupación máx. (eje 0–120 %)</span></div>';
    cont.innerHTML = g;
  }
  $("grafica").addEventListener("click", function (ev) {
    var h = ev.target.getAttribute && ev.target.getAttribute("data-h");
    if (h != null) ponerHora(+h);
  });

  // Puntos únicos de fallo
  function normalizarPuf(r) {
    var out = [];
    function add(it) {
      if (it == null) return;
      if (typeof it === "string") out.push({ id: it });
      else if (typeof it === "object") {
        var id = it.id || it.elemento || it.nodo || it.enlace;
        if (id) out.push({ id: id, info: it });
      }
    }
    if (Array.isArray(r)) r.forEach(add);
    else if (r && typeof r === "object") Object.keys(r).forEach(function (k) {
      if (Array.isArray(r[k])) r[k].forEach(add); else if (r[k] && typeof r[k] === "object") add(Object.assign({ id: k }, r[k]));
    });
    return out;
  }
  function pintarPuf() {
    var b = $("bloque-puf");
    b.hidden = !S.puf;
    $("btn-puf").classList.toggle("activo", S.puf);
    if (!S.puf) return;
    var l = S.pufInfo || [];
    $("lista-puf").innerHTML = l.length ? l.map(function (p) {
      return '<span class="chip escenario" style="cursor:pointer;border-color:var(--puf)" data-sel="' + esc(p.id) + '">' + esc(p.id) + "</span>";
    }).join("") : '<span class="vacio">El motor no encuentra puntos únicos de fallo.</span>';
  }
  $("lista-puf").addEventListener("click", function (ev) {
    var c = ev.target.closest("[data-sel]"); if (c) seleccionarId(c.getAttribute("data-sel"));
  });
  $("btn-puf").addEventListener("click", function () {
    S.puf = !S.puf;
    if (S.puf && !S.pufInfo) {
      try { S.pufInfo = normalizarPuf(Motor.puntosUnicosFallo(RED)); }
      catch (err) { console.error(err); S.pufInfo = []; }
    }
    pintar();
  });

  // ---------- Selección y ficha ----------
  function seleccionarId(id) {
    if (enlaces[id]) seleccionar("enlace", id);
    else if (nodos[id]) seleccionar("nodo", id);
    else if (zonas[id]) seleccionar("zona", id);
    else if (servicios[id]) seleccionar("servicio", id);
  }
  function seleccionar(tipo, id) {
    S.sel = { tipo: tipo, id: id }; S.rutaHover = null; S.rutaFija = null;
    $("ficha").hidden = false;
    pintar();
  }
  function cerrarFicha() {
    if (!S.sel) return;
    S.sel = null; S.rutaHover = null; S.rutaFija = null;
    $("ficha").hidden = true;
    pintar();
  }
  $("ficha-cerrar").addEventListener("click", cerrarFicha);

  function trazab(o) {
    if (!o) return "";
    var h = "";
    if (o.supuesto) h += '<span class="badge sup">SUPUESTO</span> ';
    if (o.nota) h += "<div><b>Nota:</b> " + esc(o.nota) + "</div>";
    if (o.fuente) h += "<div><b>Fuente:</b> " + esc(typeof o.fuente === "string" ? o.fuente : JSON.stringify(o.fuente)) + "</div>";
    if (!h) h = '<span class="vacio">Sin fuente indicada.</span>';
    return '<div class="trazab' + (o.supuesto ? " sup" : "") + '">' + h + "</div>";
  }
  function badgeEstado(e) {
    var t = { ok: "ok", degradado: "degradado", latencia: "latencia", caido: "caído" }[e] || e || "—";
    return '<span class="badge ' + esc(e) + '">' + esc(t) + "</span>";
  }
  function barra(o, caido) {
    return '<div class="barra-ocup"><i style="width:' + Math.min(100, (o || 0) * 100).toFixed(1) + "%;background:" + colorOcup(o || 0, caido) + '"></i></div>';
  }
  function botonFallo(id) {
    var c = caidoPor(id);
    if (c === "escenario") return '<button type="button" disabled>Caído por el escenario</button>';
    if (c === "manual") return '<button type="button" data-fallo="' + esc(id) + '">Restaurar</button>';
    return '<button type="button" data-fallo="' + esc(id) + '">Simular caída</button>';
  }
  function infoPuf(id) {
    if (!S.puf || !S.pufInfo) return "";
    var p = null;
    S.pufInfo.forEach(function (x) { if (x.id === id) p = x; });
    if (!p) return "";
    var af = p.info && (p.info.afecta || p.info.demandas || p.info.zonas);
    return '<div class="trazab" style="border:1.5px solid var(--puf)"><b>Punto único de fallo.</b>' +
      (Array.isArray(af) && af.length ? " Si cae, se quedan sin servicio: " + af.map(esc).join(", ") : "") + "</div>";
  }
  function tablaDemandas(ids) {
    if (!ids || !ids.length) return '<p class="vacio">Ninguna demanda lo atraviesa.</p>';
    var filas = ids.map(function (i) { return demById[i]; }).filter(Boolean)
      .sort(function (a, b) { return (b.servida_gbps || 0) - (a.servida_gbps || 0); });
    return '<table class="tabla"><thead><tr><th>Demanda</th><th class="num">P</th><th class="num">Servida Gbps</th><th>Estado</th></tr></thead><tbody>' +
      filas.map(function (d) {
        return '<tr data-dem="' + esc(d.id) + '"' + (S.rutaFija === d.id ? ' class="sel"' : "") + "><td>" + esc(d.id) +
          (d.via === "respaldo" ? ' <span class="badge resp">respaldo</span>' : "") + '</td><td class="num">' + esc(d.prioridad) +
          '</td><td class="num">' + fmtN(d.servida_gbps) + "</td><td>" + badgeEstado(d.estado) + "</td></tr>";
      }).join("") + "</tbody></table><p class=\"desc\">Pasa el ratón por una fila para ver su ruta; clic para fijarla.</p>";
  }

  function fichaEnlace(id) {
    var e = enlaces[id], x = (S.res.enlaces || {})[id] || {};
    var caido = !!x.caido || !!caidoPor(id);
    var lat = e.latencia_ms != null ? e.latencia_ms : (e.km || 0) * 0.005;
    return "<h2>" + esc(e.nombre || id) + (esSupuesto(e) ? ' <span class="badge sup">supuesto</span>' : "") + "</h2>" +
      '<div class="sub">' + esc(id) + " · " + esc(nombre(e.a)) + " ↔ " + esc(nombre(e.b)) + "</div>" +
      '<div class="acciones">' + botonFallo(id) + "</div>" + infoPuf(id) +
      "<dl><dt>Tipo</dt><dd>" + esc(TIPO_ENL[e.tipo] || e.tipo) + "</dd>" +
      "<dt>Estado</dt><dd>" + (caido ? '<span class="badge caido">caído</span>' : '<span class="badge ok">activo</span>') + "</dd>" +
      "<dt>Capacidad</dt><dd>" + fmtG(e.capacidad_gbps) + "</dd>" +
      "<dt>Carga</dt><dd>" + fmtG(x.carga_gbps) + "</dd>" +
      (x.demanda_gbps != null && x.demanda_gbps > (x.carga_gbps || 0) + 0.01 ? "<dt>Ofrecida</dt><dd style=\"color:var(--mal)\">" + fmtG(x.demanda_gbps) + " (se recorta " + fmtG(x.demanda_gbps - (x.carga_gbps || 0)) + ")</dd>" : "") +
      "<dt>Ocupación</dt><dd>" + fmtPct(x.ocupacion) + barra(x.ocupacion, caido) + "</dd>" +
      "<dt>Longitud</dt><dd>" + (e.km != null ? num(e.km, 1) + " km" : "—") + "</dd>" +
      "<dt>Latencia</dt><dd>" + fmtMs(lat) + (e.latencia_ms == null ? ' <span class="desc">(km × 0,005)</span>' : "") + "</dd>" +
      "<dt>Protección</dt><dd>" + esc(e.proteccion || "ninguna") + (e.anillo ? " · anillo " + esc(e.anillo) : "") + "</dd></dl>" +
      "<h3>Demandas que lo cruzan (" + ((x.demandas || []).length) + ")</h3>" + tablaDemandas(x.demandas) +
      "<h3>Trazabilidad</h3>" + trazab(e);
  }

  function fichaNodo(id) {
    var n = nodos[id], x = (S.res.nodos || {})[id] || {};
    var caido = !!x.caido || !!caidoPor(id);
    var zs = (RED.zonas || []).filter(function (z) { return z.agg === id || z.edge === id; });
    return "<h2>" + esc(n.nombre || id) + (esSupuesto(n) ? ' <span class="badge sup">supuesto</span>' : "") + "</h2>" +
      '<div class="sub">' + esc(id) + " · " + esc(TIPO_NODO[n.tipo] || n.tipo) + (n.area ? " · " + esc(n.area) : "") + "</div>" +
      '<div class="acciones">' + botonFallo(id) + "</div>" + infoPuf(id) +
      "<dl><dt>Estado</dt><dd>" + (caido ? '<span class="badge caido">caído</span>' : '<span class="badge ok">activo</span>') + "</dd>" +
      "<dt>Funciones</dt><dd>" + ((n.funciones && n.funciones.length) ? esc(n.funciones.join(", ")) : "—") + "</dd>" +
      "<dt>Capacidad</dt><dd>" + (n.capacidad_gbps == null ? "sin límite (no modelada)" : fmtG(n.capacidad_gbps)) + "</dd>" +
      "<dt>Carga</dt><dd>" + fmtG(x.carga_gbps) + "</dd>" +
      (n.capacidad_gbps != null ? "<dt>Ocupación</dt><dd>" + fmtPct(x.ocupacion) + barra(x.ocupacion, caido) + "</dd>" : "") +
      "<dt>Latencia proc.</dt><dd>" + fmtMs(n.latencia_ms != null ? n.latencia_ms : 0.05) + "</dd>" +
      (n.respaldo ? "<dt>Respaldo</dt><dd><a href=\"#\" data-ir=\"" + esc(n.respaldo) + "\">" + esc(nombre(n.respaldo)) + "</a></dd>" : "") +
      ((x.absorbe_de && x.absorbe_de.length) ? "<dt>Absorbe de</dt><dd>" + x.absorbe_de.map(function (a) {
        return '<a href="#" data-ir="' + esc(a) + '">' + esc(a) + "</a>"; }).join(", ") + "</dd>" : "") +
      (zs.length ? "<dt>Zonas</dt><dd>" + zs.map(function (z) {
        return '<a href="#" data-ir="' + esc(z.id) + '">' + esc(z.nombre || z.id) + "</a>"; }).join(", ") + "</dd>" : "") +
      "</dl>" +
      "<h3>Demandas que lo cruzan (" + ((x.demandas || []).length) + ")</h3>" + tablaDemandas(x.demandas) +
      "<h3>Trazabilidad</h3>" + trazab(n);
  }

  function demandaDeNecesidad(zid, nid) {
    if (demById[nid]) return demById[nid];
    var c = (S.res.demandas || []).filter(function (d) { return d.zona === zid && String(d.id).indexOf(nid) === 0; });
    return c[0] || null;
  }
  function filaNecesidad(n, d, nr) {
    var pedida = d ? d.dl_gbps : nr && nr.dl_gbps;
    var servida = d ? d.servida_gbps : nr && nr.servida_gbps;
    var estado = (d && d.estado) || (nr && nr.estado);
    var lat = d && d.latencia_ms, lmax = n.latencia_max_ms != null ? n.latencia_max_ms : d && d.latencia_max_ms;
    var latTxt = lat == null ? "—" : num(lat, 2);
    if (lmax != null) latTxt += " / " + num(lmax, 0);
    var mal = lmax != null && lat != null && lat > lmax;
    return '<tr data-dem="' + esc(d ? d.id : "") + '"' + (d && S.rutaFija === d.id ? ' class="sel"' : "") + "><td>" + esc(n.tipo || n.nombre || n.id) +
      (esSupuesto(n) ? ' <span class="badge sup" title="' + esc(n.nota || "supuesto") + '">sup.</span>' : "") +
      (d && d.via === "respaldo" ? ' <span class="badge resp">resp.</span>' : "") +
      "</td><td>" + esc(n.slice || "—") + '</td><td class="num">' + esc(n.prioridad != null ? n.prioridad : "—") +
      '</td><td class="num">' + fmtN(pedida) + '</td><td class="num">' + fmtN(servida) + "</td><td>" + badgeEstado(estado) +
      '</td><td class="num"' + (mal ? ' style="color:var(--mal);font-weight:600"' : "") + ">" + latTxt + "</td></tr>";
  }
  var CAB_NEC = '<table class="tabla"><thead><tr><th>Tipo</th><th>Slice</th><th class="num">P</th><th class="num">Pide<br>Gbps</th>' +
    '<th class="num">Sirve<br>Gbps</th><th>Estado</th><th class="num">Lat. / máx<br>ms</th></tr></thead><tbody>';

  function fichaZona(id) {
    var z = zonas[id], x = (S.res.zonas || {})[id] || {};
    var nr = x.necesidades || {};
    var filas = (z.necesidades || []).map(function (n) { return filaNecesidad(n, demandaDeNecesidad(id, n.id), nr[n.id]); });
    var serv = (RED.servicios || []).filter(function (s) { return s.zona === id; });
    serv.forEach(function (s) { filas.push(filaNecesidad({ id: s.id, tipo: s.nombre || s.id, slice: s.slice, prioridad: s.prioridad, latencia_max_ms: s.latencia_max_ms, supuesto: s.supuesto, nota: s.nota }, demById[s.id], null)); });
    var notas = (z.necesidades || []).filter(function (n) { return n.nota || n.fuente; }).map(function (n) {
      return "<li><b>" + esc(n.tipo || n.id) + "</b>" + (n.supuesto ? ' <span class="badge sup">supuesto</span>' : "") + ": " +
        esc(n.nota || "") + (n.fuente ? " <i>(" + esc(typeof n.fuente === "string" ? n.fuente : JSON.stringify(n.fuente)) + ")</i>" : "") + "</li>";
    });
    var sinNada = (z.necesidades || []).filter(function (n) { return n.supuesto && !n.nota && !n.fuente; }).length;
    return "<h2>" + esc(z.nombre || id) + (zonaTieneSupuestos(z) ? ' <span class="badge sup">con supuestos</span>' : "") + "</h2>" +
      '<div class="sub">' + esc(id) + (z.area ? " · área " + esc(z.area) : "") + "</div>" +
      "<dl>" + (z.municipios && z.municipios.length > 1 ? "<dt>Municipios</dt><dd>" + esc(z.municipios.join(", ")) + "</dd>" : "") +
      (z.poblacion != null ? "<dt>Población</dt><dd>" + num(z.poblacion, 0) + "</dd>" : "") +
      (z.abonados_fijos != null ? "<dt>Abonados fijos</dt><dd>" + num(z.abonados_fijos, 0) + "</dd>" : "") +
      (z.abonados_moviles != null ? "<dt>Abonados móviles</dt><dd>" + num(z.abonados_moviles, 0) + "</dd>" : "") +
      "<dt>Agregación</dt><dd><a href=\"#\" data-ir=\"" + esc(z.agg) + "\">" + esc(z.agg) + "</a></dd>" +
      "<dt>Edge</dt><dd><a href=\"#\" data-ir=\"" + esc(z.edge) + "\">" + esc(z.edge) + "</a></dd>" +
      "<dt>Demanda</dt><dd>" + fmtG(x.dl_gbps) + " a las " + S.hora + ":00</dd>" +
      "<dt>Servida</dt><dd>" + fmtG(x.servida_gbps) + " (" + fmtPct(ratio(x.servida_gbps, x.dl_gbps, x.pct)) + ")</dd></dl>" +
      "<h3>Necesidades</h3>" + CAB_NEC + filas.join("") + "</tbody></table>" +
      '<p class="desc">Pasa el ratón por una necesidad para resaltar su ruta; clic para fijarla.</p>' +
      (notas.length ? "<h3>Origen de los datos</h3><ul class=\"desc\" style=\"padding-left:18px\">" + notas.join("") + "</ul>" : "") +
      (sinNada ? '<p class="desc">' + sinNada + " necesidad(es) supuesta(s) sin nota explicativa.</p>" : "") +
      "<h3>Trazabilidad de la zona</h3>" + trazab(z);
  }

  function fichaServicio(id) {
    var s = servicios[id], d = demById[id];
    return "<h2>" + esc(s.nombre || id) + (esSupuesto(s) ? ' <span class="badge sup">supuesto</span>' : "") + "</h2>" +
      '<div class="sub">' + esc(id) + " · zona <a href=\"#\" data-ir=\"" + esc(s.zona) + "\">" + esc(s.zona) + "</a></div>" +
      "<dl><dt>Sitio</dt><dd><a href=\"#\" data-ir=\"" + esc(s.nodo) + "\">" + esc(nombre(s.nodo)) + "</a></dd>" +
      "<dt>Conecta a</dt><dd><a href=\"#\" data-ir=\"" + esc(s.conecta_a) + "\">" + esc(s.conecta_a) + "</a></dd>" +
      "<dt>Acceso</dt><dd>" + fmtG(s.capacidad_acceso_gbps) + "</dd>" +
      "<dt>Destino</dt><dd>" + esc(s.destino) + (d && d.destino_nodo ? " → " + esc(d.destino_nodo) : "") + "</dd>" +
      "<dt>Slice / prio.</dt><dd>" + esc(s.slice || "—") + " / " + esc(s.prioridad) + "</dd></dl>" +
      "<h3>Demanda ahora</h3>" + CAB_NEC + filaNecesidad({ id: id, tipo: "DL", slice: s.slice, prioridad: s.prioridad, latencia_max_ms: s.latencia_max_ms }, d, null) + "</tbody></table>" +
      "<h3>Trazabilidad</h3>" + trazab(s);
  }

  function pintarFicha() {
    var f = $("ficha-cuerpo"), t = S.sel.tipo, id = S.sel.id, h = "";
    if (t === "enlace" && enlaces[id]) h = fichaEnlace(id);
    else if (t === "nodo" && nodos[id]) h = fichaNodo(id);
    else if (t === "zona" && zonas[id]) h = fichaZona(id);
    else if (t === "servicio" && servicios[id]) h = fichaServicio(id);
    var sc = $("ficha").scrollTop;
    f.innerHTML = h;
    $("ficha").scrollTop = sc;
  }
  var cuerpoFicha = $("ficha-cuerpo");
  cuerpoFicha.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-fallo]");
    if (b) { alternarFallo(b.getAttribute("data-fallo")); return; }
    var a = ev.target.closest("[data-ir]");
    if (a) { ev.preventDefault(); seleccionarId(a.getAttribute("data-ir")); return; }
    var tr = ev.target.closest("tr[data-dem]");
    if (tr && tr.getAttribute("data-dem")) {
      var id = tr.getAttribute("data-dem");
      S.rutaFija = S.rutaFija === id ? null : id;
      pintarRutas(); pintarFicha();
    }
  });
  cuerpoFicha.addEventListener("mouseover", function (ev) {
    var tr = ev.target.closest("tr[data-dem]");
    var id = tr ? tr.getAttribute("data-dem") || null : null;
    if (id !== S.rutaHover) { S.rutaHover = id; pintarRutas(); }
  });
  cuerpoFicha.addEventListener("mouseleave", function () {
    if (S.rutaHover) { S.rutaHover = null; pintarRutas(); }
  });

  // ---------- Fallos ----------
  function alternarFallo(id) {
    var i = S.manual.indexOf(id);
    if (i >= 0) S.manual.splice(i, 1);
    else if (fallosEsc().indexOf(id) < 0) S.manual.push(id);
    todo();
  }
  $("btn-restaurar").addEventListener("click", function () { S.manual = []; todo(); });

  // ---------- Escenario y hora ----------
  var sel = $("sel-escenario");
  sel.innerHTML = escenarios.map(function (e) {
    return '<option value="' + esc(e.id) + '">' + esc(e.nombre || e.id) + (e.supuesto ? " (supuesto)" : "") + "</option>";
  }).join("") + '<option value="">— Base, sin escenario —</option>';
  sel.value = S.escenario || "";
  function pintarDescEscenario() {
    var e = escActual();
    var t = e ? (e.descripcion || "") : "Demanda de los perfiles sin factores ni fallos.";
    if (e && (e.fuente || e.nota)) t += (t ? " · " : "") + (e.nota || "") + (e.fuente ? " Fuente: " + (typeof e.fuente === "string" ? e.fuente : JSON.stringify(e.fuente)) : "");
    $("desc-escenario").textContent = t;
  }
  sel.addEventListener("change", function () {
    S.escenario = sel.value || null;
    var e = escActual();
    if (e && e.hora != null) S.hora = e.hora;
    $("rng-hora").value = S.hora; $("out-hora").textContent = pad(S.hora) + ":00";
    pintarDescEscenario();
    todo();
  });
  function pad(h) { return (h < 10 ? "0" : "") + h; }
  function ponerHora(h) {
    S.hora = ((h % 24) + 24) % 24;
    $("rng-hora").value = S.hora;
    $("out-hora").textContent = pad(S.hora) + ":00";
    calcular();
  }
  $("rng-hora").addEventListener("input", function () { ponerHora(+this.value); });
  function alternarPlay() {
    var b = $("btn-play");
    if (S.timer) { clearInterval(S.timer); S.timer = null; b.textContent = "▶"; b.classList.remove("activo"); b.setAttribute("aria-label", "Reproducir"); }
    else {
      S.timer = setInterval(function () { ponerHora(S.hora + 1); }, 1000);
      b.textContent = "❚❚"; b.classList.add("activo"); b.setAttribute("aria-label", "Pausar");
    }
  }
  $("btn-play").addEventListener("click", alternarPlay);
  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target.tagName || "").toLowerCase();
    if (tag === "select" || (tag === "input" && ev.target.type !== "range")) return;
    if (ev.key === "ArrowRight" && tag !== "input") ponerHora(S.hora + 1);
    else if (ev.key === "ArrowLeft" && tag !== "input") ponerHora(S.hora - 1);
    else if (ev.key === " " && tag !== "button") { ev.preventDefault(); alternarPlay(); }
    else if (ev.key === "Escape") cerrarFicha();
  });

  // ---------- Capas ----------
  var NOM_CAPA = { zonas: "Zonas", nodos: "Núcleo y edge", acceso: "Acceso", wdm: "Transporte WDM", mpls: "MPLS", servicios: "Servicios", rutas: "Rutas" };
  $("capas").innerHTML = Object.keys(S.capas).map(function (k) {
    return '<label><input type="checkbox" data-capa="' + k + '" checked> ' + NOM_CAPA[k] + "</label>";
  }).join("");
  $("capas").addEventListener("change", function (ev) {
    var k = ev.target.getAttribute("data-capa"); if (!k) return;
    S.capas[k] = ev.target.checked;
    if (S.capas[k]) mapa.addLayer(grupos[k]); else mapa.removeLayer(grupos[k]);
  });

  // ---------- Supuestos ----------
  var nSup = 0;
  ["zonas", "nodos", "enlaces", "servicios", "escenarios"].forEach(function (k) { (RED[k] || []).forEach(function (o) { if (o.supuesto) nSup++; }); });
  (RED.zonas || []).forEach(function (z) { (z.necesidades || []).forEach(function (n) { if (n.supuesto) nSup++; }); });
  $("chk-supuestos").parentNode.title = nSup + " elementos marcados como supuesto (no salen de documentos)";
  $("chk-supuestos").addEventListener("change", function () {
    S.supuestos = this.checked;
    document.body.classList.toggle("marca-sup", S.supuestos);
    pintar();
  });

  // ---------- Tema ----------
  function guardarTema(t) { try { localStorage.setItem("simred-tema", t); } catch (e) { /* sin almacenamiento */ } }
  try { var t0 = localStorage.getItem("simred-tema"); if (t0) document.documentElement.setAttribute("data-theme", t0); } catch (e) { /* idem */ }
  $("btn-tema").addEventListener("click", function () {
    var t = temaOscuro() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    guardarTema(t);
    ponerTeselas(); pintarLeyenda(); pintar();
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var alCambiar = function () { if (!document.documentElement.getAttribute("data-theme")) { ponerTeselas(); pintarLeyenda(); pintar(); } };
    if (mq.addEventListener) mq.addEventListener("change", alCambiar); else if (mq.addListener) mq.addListener(alCambiar);
  }

  // ---------- Leyenda ----------
  function pintarLeyenda() {
    var abierta = $("leyenda").querySelector("details");
    var estabaAbierta = abierta ? abierta.open : null;
    var lin = function (c, t, disc) { return '<div class="fila"><span class="linea' + (disc ? " disc" : "") + '" style="border-color:' + c + '"></span>' + t + "</div>"; };
    var pto = function (c, t) { return '<div class="fila"><span class="punto" style="background:' + c + ';opacity:.8"></span>' + t + "</div>"; };
    var ico = Object.keys(ETQ).map(function (k) {
      return '<div class="fila"><div class="nodo-ico ' + k + '"><span>' + ETQ[k] + "</span></div>" + esc(TIPO_NODO[k].split(" (")[0]) + "</div>";
    }).join("");
    $("leyenda").innerHTML = '<details' + (window.innerHeight > 820 ? " open" : "") + '><summary>Leyenda</summary>' +
      '<div class="grupo"><h4>Ocupación de enlace</h4>' + lin(cssVar("--ok"), "&lt; 60 %") + lin(cssVar("--medio"), "60–90 %") +
      lin(cssVar("--mal"), "&gt; 90 %") + lin(cssVar("--caido"), "caído", true) + '<div class="desc">Grosor ∝ capacidad</div></div>' +
      '<div class="grupo"><h4>Zona: % servida</h4>' + pto(cssVar("--ok"), "≥ 99 %") + pto(cssVar("--medio"), "90–99 %") + pto(cssVar("--mal"), "&lt; 90 %") +
      '<div class="desc">Tamaño ∝ demanda</div></div>' +
      '<div class="grupo"><h4>Nodos</h4><div class="iconos">' + ico + "</div></div>" +
      '<div class="grupo">' + lin(cssVar("--ruta"), "ruta resaltada") + lin(cssVar("--supuesto"), "supuesto (borde discontinuo)", true) +
      lin(cssVar("--puf"), "punto único de fallo") + "</div></details>";
    if (estabaAbierta != null) $("leyenda").querySelector("details").open = estabaAbierta;
  }

  // ---------- Avisos de datos de prueba ----------
  var avisos = [];
  if (window.__RED_MOCK) avisos.push("Datos de prueba (mock)");
  if (window.__MOTOR_STUB || Motor.esStub) avisos.push("Motor de prueba");
  if (RED.meta && RED.meta.version) document.title = "Simulador de red Madrid · " + RED.meta.version;
  if (avisos.length) { $("aviso-datos").textContent = avisos.join(" · "); $("aviso-datos").hidden = false; }

  // ---------- Arranque ----------
  ponerTeselas();
  encuadrar();
  pintarLeyenda();
  pintarDescEscenario();
  $("rng-hora").value = S.hora; $("out-hora").textContent = pad(S.hora) + ":00";
  todo();
})();
