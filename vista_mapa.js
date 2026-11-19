// vista_mapa.js — vista MAPA del NOC (CONTRATO_UI.md). Leaflet 1.9.4 con teselas oscuras sin etiquetas.
// Nodos con icono por tipo, enlaces coloreados por ocupación y con grosor por capacidad, zonas de demanda (capa B).
// Clic = NOC.seleccionar + ficha; clic derecho = añadir/quitar fallo (en LAB); tooltip corto al pasar.
// Revisión 2: vista por tipo de servicio (NOC.sv, ver carril_servicios.js) y capa de radio n28/n78/n258
// (radio_datos.js, v7 §6.2) bajo los enlaces. El mapa Leaflet queda en NOC.mapa.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista) return;
  var RED = NOC.RED, t = NOC.t, fmt = NOC.fmt, esc = NOC.esc;

  if (typeof window.L === "undefined") {
    NOC.registrarVista({ id: "mapa", grupo: ["red", "simulacion"], titulo: { es: "Mapa", en: "Map" },
      montar: function (el) { el.innerHTML = '<div class="vacio">' + esc(t({ es: "Leaflet no se pudo cargar (requiere Internet).", en: "Leaflet could not be loaded (requires Internet)." })) + '</div>'; } });
    return;
  }
  var L = window.L;

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888"; }
  var C = {};
  function leerTokens() {
    ["--bg0", "--bg1", "--bg2", "--line", "--tx1", "--tx2", "--tx3", "--acc", "--crit", "--maj", "--min", "--wrn", "--ok", "--unk", "--sup"].forEach(function (k) { C[k.slice(2)] = tok(k); });
    CLASES.forEach(function (c) { CS[c] = getComputedStyle(document.documentElement).getPropertyValue("--sv-" + c).trim() || RESERVA[c]; });
    BANDAS.forEach(function (b) { CS[b] = getComputedStyle(document.documentElement).getPropertyValue("--band-" + b).trim() || RESERVA[b]; });
  }

  var IDX = NOC.idx;
  var RANGO_TIPO = { core: 0, metro: 1, edge: 2, ix: 3, agg: 4, site: 5 };
  var TAM = { core: 16, metro: 15, edge: 13, ix: 14, agg: 11, site: 11 };
  // Revisión 11: etiqueta en todos los nodos, por niveles de zoom (1: núcleo y metro, 2: edge/IX/agregación, 3: emplazamientos).
  // En SIMPLE muestra el nombre corto con icono; en EXPERTO, el id.
  var CON_ETIQUETA = { core: 1, metro: 1, edge: 2, ix: 3, agg: 2, site: 3 };
  function zoomClase() {
    if (!mapa) return;
    var z = mapa.getZoom(), c = mapa.getContainer();
    c.classList.toggle("etq-z1", z >= 10);
    c.classList.toggle("etq-z2", z >= 11);
    c.classList.toggle("etq-z3", z >= 12.5);
  }
  function htmlEtq(n) {
    var corto = NOC.nombreCorto ? NOC.nombreCorto(n.id) : n.id;
    return '<span class="etq-n' + CON_ETIQUETA[n.tipo] + '">' + (NOC.icono ? NOC.icono(n.tipo, 11) : '') + '<b class="solo-simple">' + esc(corto) + '</b><b class="solo-experto">' + esc(n.id) + '</b></span>';
  }

  // ---------- estado de servicios y radio (mismo bloque en carril_servicios.js) ----------
  var CLASES = (window.Motor && window.Motor.CLASES_SERVICIO) || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var BANDAS = ["n28", "n78", "n258"];
  function estadoSV() {
    if (NOC.sv) return NOC.sv;
    var g = {};
    try { g = JSON.parse(localStorage.getItem("noc.servicios") || "{}") || {}; } catch (e) { g = {}; }
    var sv = NOC.sv = { activos: {}, dominante: !!g.dominante, bandas: {}, _f: [],
      on: function (fn) { this._f.push(fn); },
      modoMapa: function () { var s = this; return s.dominante || CLASES.some(function (c) { return !s.activos[c]; }); },
      cambio: function () {
        try { localStorage.setItem("noc.servicios", JSON.stringify({ activos: this.activos, dominante: this.dominante, bandas: this.bandas })); } catch (e) { /* sin almacenamiento */ }
        this._f.forEach(function (fn) { try { fn(); } catch (e) { console.error("NOC.sv", e); } });
      } };
    CLASES.forEach(function (c) { sv.activos[c] = !(g.activos && g.activos[c] === false); });
    BANDAS.forEach(function (b) { sv.bandas[b] = !!(g.bandas && g.bandas[b]); });
    return sv;
  }
  var SV = estadoSV();
  var RESERVA = { movil: "#3987e5", ftth: "#d95926", voz: "#199e70", urllc: "#c98500", iot: "#d55181",
    empresa: "#0ca30c", evento: "#9085e9", ntn: "#e66767", n28: "#8a7ff0", n78: "#20a8a0", n258: "#c08a1e" };
  var CS = {};
  function colorSV(k) { return CS[k] || RESERVA[k] || "#888"; }
  var NOMBRE_SV = {
    movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo", en: "Fixed FTTH" }, voz: { es: "Voz", en: "Voice" },
    urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT / mMTC", en: "IoT / mMTC" }, empresa: { es: "Empresa", en: "Enterprise" },
    evento: { es: "Evento", en: "Event" }, ntn: { es: "Satélite NTN", en: "NTN satellite" } };

  var mapa = null, el = null, grupos = {}, disp = {}, radioL = {};
  var nodosL = {}, etiqL = {}, enlL = {}, golpeL = {}, zonasL = {}, halo = null;
  var montado = false;

  // ---------- formas SVG por tipo ----------
  function forma(tipo, s, fill, stroke, sw) {
    var h = s / 2, a = 'fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"';
    switch (tipo) {
      case "core": return '<rect x="1.5" y="1.5" width="' + (s - 3) + '" height="' + (s - 3) + '" ' + a + '/>';
      case "edge": return '<polygon points="' + h + ',1 ' + (s - 1) + ',' + h + ' ' + h + ',' + (s - 1) + ' 1,' + h + '" ' + a + '/>';
      case "metro": {
        var p = [];
        for (var i = 0; i < 6; i++) { var an = Math.PI / 3 * i; p.push((h + (h - 1.2) * Math.cos(an)).toFixed(2) + "," + (h + (h - 1.2) * Math.sin(an)).toFixed(2)); }
        return '<polygon points="' + p.join(" ") + '" ' + a + '/>';
      }
      case "agg": return '<circle cx="' + h + '" cy="' + h + '" r="' + (h - 1.5) + '" ' + a + '/>';
      case "site": return '<polygon points="' + h + ',1 ' + (s - 1) + ',' + (s - 1.5) + ' 1,' + (s - 1.5) + '" ' + a + '/>';
      case "ix": {
        var q = [];
        for (var j = 0; j < 10; j++) {
          var r = j % 2 ? (h - 1) * 0.45 : h - 1, b = -Math.PI / 2 + Math.PI / 5 * j;
          q.push((h + r * Math.cos(b)).toFixed(2) + "," + (h + r * Math.sin(b)).toFixed(2));
        }
        return '<polygon points="' + q.join(" ") + '" ' + a + '/>';
      }
    }
    return '<circle cx="' + h + '" cy="' + h + '" r="' + (h - 1.5) + '" ' + a + '/>';
  }
  NOC.formaNodo = function (tipo, s, fill, stroke) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '">' + forma(tipo, s, fill, stroke, 1.2) + '</svg>'; };

  // ---------- estado de cada elemento ----------
  function resN(id) { return NOC.resultado && NOC.resultado.nodos ? NOC.resultado.nodos[id] : null; }
  function resE(id) { return NOC.resultado && NOC.resultado.enlaces ? NOC.resultado.enlaces[id] : null; }
  function colSev(s) { return C[s] || C.tx2; }
  function iconoNodo(n) {
    var r = resN(n.id), caido = r && r.caido, o = NOC.ocupacion(r), s = TAM[n.tipo] || 11;
    var sel = NOC.seleccion && NOC.seleccion.id === n.id;
    var fill = caido ? C.bg2 : (o == null ? C.tx2 : colSev(NOC.sevOcupacion(o))), stroke = caido ? C.unk : C.bg0;
    var pad = 4, S = s + pad * 2;
    var svg = '<svg width="' + S + '" height="' + S + '" viewBox="' + (-pad) + ' ' + (-pad) + ' ' + S + ' ' + S + '">' +
      (sel ? '<rect x="' + (-pad + 0.5) + '" y="' + (-pad + 0.5) + '" width="' + (S - 1) + '" height="' + (S - 1) + '" fill="none" stroke="' + C.acc + '" stroke-width="1"/>' : '') +
      forma(n.tipo, s, fill, stroke, caido ? 1.4 : 1.2) +
      (caido ? '<path d="M2 2L' + (s - 2) + ' ' + (s - 2) + 'M' + (s - 2) + ' 2L2 ' + (s - 2) + '" stroke="' + C.crit + '" stroke-width="1.6"/>' : '') +
      '</svg>';
    return L.divIcon({ className: "noc-nodo t-" + n.tipo + (caido ? " caido" : ""), html: svg, iconSize: [S, S], iconAnchor: [S / 2, S / 2] });
  }
  function grosor(cap) {
    if (typeof cap !== "number" || !isFinite(cap)) return 1.5;
    return Math.max(1, Math.min(6, 1 + 1.25 * Math.log10(Math.max(1, cap))));
  }
  // Carga de los tipos activos en el enlace: {g: Gbit/s del sentido más cargado, dom: tipo dominante, total}
  function cargaSV(r) {
    var ps = r && r.por_servicio;
    if (!ps) return null;
    var ab = 0, ba = 0, dom = null, md = 0;
    CLASES.forEach(function (c) {
      if (!SV.activos[c] || !ps[c]) return;
      ab += ps[c].ab; ba += ps[c].ba;
      var m = Math.max(ps[c].ab, ps[c].ba);
      if (m > md) { md = m; dom = c; }
    });
    return { g: Math.max(ab, ba), dom: dom, total: r.carga_gbps || 0 };
  }
  function estiloEnlace(e) {
    var r = resE(e.id), caido = r && r.caido, o = NOC.ocupacion(r);
    if (caido) return { color: C.unk, weight: Math.max(1.5, grosor(e.capacidad_gbps) - 1), dashArray: "5 4", opacity: 0.9 };
    if (SV.modoMapa()) {
      var x = cargaSV(r);
      if (x) {
        if (!x.dom || x.g < 1e-6) return { color: C.tx3, weight: 1, dashArray: "2 5", opacity: 0.35 };
        var share = x.total > 0 ? Math.min(1, x.g / x.total) : 1;
        return { color: colorSV(x.dom), weight: Math.max(1.2, Math.min(9, 1 + 1.6 * Math.log10(1 + x.g))), dashArray: e.tipo === "sat" ? "1 4" : null,
          opacity: 0.4 + 0.55 * share };
      }
    }
    return { color: o == null ? C.tx3 : colSev(NOC.sevOcupacion(o)), weight: grosor(e.capacidad_gbps), dashArray: e.tipo === "sat" ? "1 4" : null, opacity: 0.95 };
  }
  function estiloZona(z) {
    var r = NOC.resultado && NOC.resultado.zonas ? NOC.resultado.zonas[z.id] : null;
    var p = r ? r.pct : 100, sev = p >= 99.5 ? null : p >= 95 ? "min" : p >= 80 ? "maj" : "crit";
    var sel = NOC.seleccion && NOC.seleccion.id === z.id;
    return { color: sel ? C.acc : (sev ? colSev(sev) : C.line), weight: sel || sev ? 1.5 : 1, dashArray: sev ? null : "3 4",
      fillColor: sev ? colSev(sev) : C.tx3, fillOpacity: sev ? 0.08 : 0.03, opacity: 1 };
  }

  // ---------- textos de tooltip ----------
  function gbCorto(x) { return typeof x === "number" && isFinite(x) ? fmt(x, x >= 100 ? 0 : x >= 10 ? 1 : 2) : "—"; }
  function tipNodo(n) {
    var r = resN(n.id), o = NOC.ocupacion(r);
    return '<b>' + esc(n.id) + '</b> · ' + esc(n.nombre || "") + '<br><span class="tx2">' + esc(t(NOC.TIPO_NODO[n.tipo] || { es: n.tipo })) + '</span> · ' +
      (r && r.caido ? '<span class="sev-unk">DOWN</span>' : gbCorto(r ? r.carga_gbps : null) + " Gbit/s" + (o != null ? " · " + fmt(o * 100, 1) + " %" : ""));
  }
  function tipEnlace(e) {
    var r = resE(e.id), o = NOC.ocupacion(r);
    return '<b>' + esc(e.id) + '</b><br>' + (typeof e.capacidad_gbps === "number" ? gbCorto(e.capacidad_gbps) + " G" : "C —") + ' · ' +
      (r && r.caido ? '<span class="sev-unk">DOWN</span>' : '<span class="sev-' + NOC.sevOcupacion(o) + '">' + (o == null ? "—" : fmt(o * 100, 1) + " %") + '</span>' +
        ' · ↗ ' + gbCorto(r ? r.carga_ab : null) + ' ↙ ' + gbCorto(r ? r.carga_ba : null)) + tipServicios(r);
  }
  function tipServicios(r) {
    var ps = r && r.por_servicio;
    if (!ps || !r.carga_gbps) return "";
    var l = CLASES.map(function (c) { return [c, Math.max(ps[c].ab, ps[c].ba)]; }).filter(function (x) { return x[1] > 1e-6; })
      .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 4);
    return l.length ? '<br>' + l.map(function (x) {
      return '<i style="display:inline-block;width:8px;height:8px;margin-right:3px;background:' + colorSV(x[0]) + (SV.activos[x[0]] ? '' : ';opacity:.35') + '"></i>' +
        esc(t(NOMBRE_SV[x[0]])) + ' ' + gbCorto(x[1]);
    }).join('<br>') : "";
  }
  function tipZona(z) {
    var r = NOC.resultado && NOC.resultado.zonas ? NOC.resultado.zonas[z.id] : null;
    return '<b>' + esc(z.id) + '</b> · ' + esc(z.nombre) + '<br>DL ' + gbCorto(r ? r.dl_gbps : null) + ' Gbit/s · ' + (r ? fmt(r.pct, 1) : "—") + ' %';
  }

  // ---------- posiciones de dibujo (abanico de nodos co-ubicados) ----------
  function calcularDisp() {
    var z = mapa.getZoom(), puntos = [];
    (RED.nodos || []).forEach(function (n) {
      if (!n.coord) return;
      puntos.push({ n: n, p: mapa.project(L.latLng(n.coord[0], n.coord[1]), z) });
    });
    puntos.sort(function (a, b) { return (RANGO_TIPO[a.n.tipo] || 9) - (RANGO_TIPO[b.n.tipo] || 9) || (a.n.id < b.n.id ? -1 : 1); });
    var grupos = [];
    puntos.forEach(function (x) {
      var g = null;
      for (var i = 0; i < grupos.length; i++) if (grupos[i].c.distanceTo(x.p) < 18) { g = grupos[i]; break; }
      if (!g) { g = { c: x.p, m: [] }; grupos.push(g); }
      g.m.push(x);
      var sx = 0, sy = 0; g.m.forEach(function (m) { sx += m.p.x; sy += m.p.y; });
      g.c = L.point(sx / g.m.length, sy / g.m.length);
    });
    disp = {};
    grupos.forEach(function (g) {
      if (g.m.length === 1) { disp[g.m[0].n.id] = L.latLng(g.m[0].n.coord[0], g.m[0].n.coord[1]); return; }
      var rad = Math.max(13, g.m.length * 5.5);
      g.m.forEach(function (m, i) {
        var an = -Math.PI / 2 + 2 * Math.PI * i / g.m.length;
        disp[m.n.id] = mapa.unproject(L.point(g.c.x + rad * Math.cos(an), g.c.y + rad * Math.sin(an)), z);
      });
    });
  }
  function recolocar() {
    calcularDisp();
    Object.keys(nodosL).forEach(function (id) { if (disp[id]) { nodosL[id].setLatLng(disp[id]); if (etiqL[id]) etiqL[id].setLatLng(disp[id]); } });
    (RED.enlaces || []).forEach(function (e) {
      if (!enlL[e.id] || !disp[e.a] || !disp[e.b]) return;
      enlL[e.id].setLatLngs([disp[e.a], disp[e.b]]);
      golpeL[e.id].setLatLngs([disp[e.a], disp[e.b]]);
    });
    pintarHalo();
  }

  // ---------- construcción ----------
  function grupo(c) { return grupos[c] || (grupos[c] = L.layerGroup()); }
  function eventos(capa, tipo, id) {
    capa.on("click", function (ev) { L.DomEvent.stopPropagation(ev); NOC.seleccionar(tipo, id); });
    if (tipo !== "zona") capa.on("contextmenu", function (ev) {
      L.DomEvent.preventDefault(ev.originalEvent || ev);
      if (NOC.menuOperador && NOC.menuOperador(ev.originalEvent || ev, id)) return;   // Revisión 7 (operador.js)
      NOC.alternarFallo(id);
    });
  }
  function construir() {
    calcularDisp();
    (RED.zonas || []).forEach(function (z) {
      if (!z.centro) return;
      var c = L.circle(z.centro, { pane: "zonas", radius: Math.sqrt(z.poblacion || 1e4) * 2.6, interactive: true, bubblingMouseEvents: false });
      c.setStyle(estiloZona(z));
      c.bindTooltip(function () { return tipZona(z); }, { sticky: true, direction: "top", className: "noc-tip", opacity: 1 });
      eventos(c, "zona", z.id);
      zonasL[z.id] = c; grupo("B").addLayer(c);
    });
    (RED.enlaces || []).forEach(function (e) {
      if (!disp[e.a] || !disp[e.b]) return;
      var ll = [disp[e.a], disp[e.b]], cap = NOC.capaEnlace(e);
      var linea = L.polyline(ll, { pane: "enlaces", interactive: false, lineCap: "butt" });
      linea.setStyle(estiloEnlace(e));
      var golpe = L.polyline(ll, { pane: "enlaces", weight: 12, opacity: 0, className: "noc-golpe", bubblingMouseEvents: false });
      golpe.bindTooltip(function () { return tipEnlace(e); }, { sticky: true, direction: "top", className: "noc-tip", opacity: 1 });
      eventos(golpe, "enlace", e.id);
      enlL[e.id] = linea; golpeL[e.id] = golpe;
      grupo(cap).addLayer(linea); grupo(cap).addLayer(golpe);
    });
    (RED.nodos || []).forEach(function (n) {
      if (!disp[n.id]) return;
      var cap = NOC.capaNodo(n);
      var m = L.marker(disp[n.id], { icon: iconoNodo(n), keyboard: false, riseOnHover: true });
      m.bindTooltip(function () { return tipNodo(n); }, { direction: "top", offset: [0, -8], className: "noc-tip", opacity: 1 });
      eventos(m, "nodo", n.id);
      nodosL[n.id] = m; grupo(cap).addLayer(m);
      if (CON_ETIQUETA[n.tipo]) {
        var et = L.marker(disp[n.id], { pane: "etiquetas", interactive: false, keyboard: false,
          icon: L.divIcon({ className: "noc-etq", html: htmlEtq(n), iconSize: [0, 0], iconAnchor: [-10, 6] }) });
        etiqL[n.id] = et; grupo(cap).addLayer(et);
      }
    });
    aplicarCapas();
    construirRadio();
  }
  // ---------- capa de radio (radio_datos.js) ----------
  function construirRadio() {
    var RADIO = window.RADIO;
    if (!RADIO || !RADIO.areas) return;
    BANDAS.forEach(function (b) { radioL[b] = L.layerGroup(); });
    // grandes primero para que las pequeñas queden encima y se puedan pulsar
    var areas = RADIO.areas.slice().sort(function (a, b) { return (b.radio_m || 0) - (a.radio_m || 0); });
    areas.forEach(function (a) {
      if (!radioL[a.banda] || !a.centro) return;
      var col = colorSV(a.banda), sup = a.origen === "supuesto", capas = [];
      var base = { pane: "radio", color: col, weight: 1, opacity: 0.85, fillColor: col, bubblingMouseEvents: false,
        dashArray: sup ? "4 3" : null, fillOpacity: a.tipo === "zona" ? 0.06 : a.tipo === "celda_ref" ? 0 : 0.1 };
      if (a.forma === "rectangulo" && a.lado_m) {
        var dLat = a.lado_m[1] / 2 / 111320, dLon = a.lado_m[0] / 2 / (111320 * Math.cos(a.centro[0] * Math.PI / 180));
        capas.push(L.rectangle([[a.centro[0] - dLat, a.centro[1] - dLon], [a.centro[0] + dLat, a.centro[1] + dLon]], base));
      } else if (a.radio_m) {
        capas.push(L.circle(a.centro, Object.assign({ radius: a.radio_m }, base)));
      }
      // marca de tamaño fijo para lo que a escala de área metropolitana no se ve (estadio, hospital, nave)
      if (a.forma === "punto" || a.forma === "rectangulo" || (a.radio_m && a.radio_m < 300)) {
        capas.push(L.circleMarker(a.centro, { pane: "radio", radius: a.forma === "punto" ? 5 : 7, color: col, weight: 1.5, opacity: 0.95,
          fillColor: col, fillOpacity: a.forma === "punto" ? 0.5 : 0.15, dashArray: sup ? "3 2" : null, bubblingMouseEvents: false }));
      }
      capas.forEach(function (c) {
        c.bindTooltip(function () {
          return '<b>' + esc(t(a.titulo)) + '</b><br>' + esc(a.banda) + (a.radio_ul_km != null ? ' · R_UL ≈' + fmt(a.radio_ul_km, 2) + ' km' : '') +
            ' · <span class="tx2">' + esc(a.origen) + '</span>';
        }, { sticky: true, direction: "top", className: "noc-tip", opacity: 1 });
        c.on("click", function (ev) { L.DomEvent.stopPropagation(ev); if (NOC.fichaRadio) NOC.fichaRadio(a.id); });
        radioL[a.banda].addLayer(c);
      });
    });
    aplicarRadio();
  }
  function aplicarRadio() {
    if (!mapa) return;
    BANDAS.forEach(function (b) {
      var g = radioL[b]; if (!g) return;
      var vis = !!SV.bandas[b];
      if (vis && !mapa.hasLayer(g)) g.addTo(mapa);
      if (!vis && mapa.hasLayer(g)) mapa.removeLayer(g);
    });
  }
  function aplicarCapas() {
    Object.keys(grupos).forEach(function (c) {
      var vis = NOC.capaVisible(c);
      if (vis && !mapa.hasLayer(grupos[c])) grupos[c].addTo(mapa);
      if (!vis && mapa.hasLayer(grupos[c])) mapa.removeLayer(grupos[c]);
    });
  }
  function refrescar() {
    if (!montado) return;
    (RED.enlaces || []).forEach(function (e) { if (enlL[e.id]) enlL[e.id].setStyle(estiloEnlace(e)); });
    (RED.nodos || []).forEach(function (n) { if (nodosL[n.id]) nodosL[n.id].setIcon(iconoNodo(n)); });
    (RED.zonas || []).forEach(function (z) { if (zonasL[z.id]) zonasL[z.id].setStyle(estiloZona(z)); });
    pintarHalo();
  }
  function pintarHalo() {
    if (halo) { mapa.removeLayer(halo); halo = null; }
    var s = NOC.seleccion;
    if (!s || s.tipo !== "enlace") return;
    var e = IDX.enlaces[s.id];
    if (!e || !disp[e.a] || !disp[e.b]) return;
    halo = L.polyline([disp[e.a], disp[e.b]], { pane: "halo", color: C.acc, weight: grosor(e.capacidad_gbps) + 6, opacity: 0.55, interactive: false, lineCap: "butt" }).addTo(mapa);
  }
  function enfocar(s) {
    if (!s || !mapa) return;
    var ll = null;
    if (s.tipo === "nodo" && disp[s.id]) ll = disp[s.id];
    else if (s.tipo === "enlace" && IDX.enlaces[s.id]) { var e = IDX.enlaces[s.id]; if (disp[e.a] && disp[e.b]) ll = L.latLngBounds([disp[e.a], disp[e.b]]).getCenter(); }
    else if (s.tipo === "zona" && IDX.zonas[s.id]) ll = L.latLng(IDX.zonas[s.id].centro);
    if (ll && !mapa.getBounds().pad(-0.1).contains(ll)) mapa.panTo(ll);
  }

  // ---------- leyenda ----------
  function pintarLeyenda() {
    var lg = el && el.querySelector(".mapa-leyenda");
    if (!lg) return;
    var esc_ = [["ok", "< 60 %"], ["min", "60–85 %"], ["maj", "85–100 %"], ["crit", "> 100 %"]];
    var tipos = ["core", "edge", "metro", "agg", "site", "ix"];
    var plegada = lg.classList.contains("plegada");
    var modoSV = SV.modoMapa();
    var bandasOn = BANDAS.filter(function (b) { return SV.bandas[b]; });
    lg.innerHTML =
      '<button type="button" class="ley-cab" aria-expanded="' + !plegada + '">' + esc(t({ es: "Leyenda", en: "Legend" })) + ' ' + (plegada ? "▸" : "▾") + '</button>' +
      '<div class="ley-cuerpo">' +
      (modoSV ?
        '<div class="rot">' + esc(t(SV.dominante ? { es: "Enlace por tipo dominante", en: "Link by dominant type" } : { es: "Enlace por tipo (activos)", en: "Link by type (active)" })) + '</div>' +
        CLASES.filter(function (c) { return SV.activos[c]; }).map(function (c) {
          return '<div class="fila"><i style="background:' + colorSV(c) + '"></i><span>' + esc(t(NOMBRE_SV[c])) + '</span></div>';
        }).join("") +
        '<div class="tx3">' + esc(t({ es: "Grosor ∝ log(carga de los tipos activos); opacidad = su parte de la carga", en: "Width ∝ log(load of active types); opacity = their share of the load" })) + '</div>'
      :
      '<div class="rot">' + esc(t({ es: "Ocupación de enlace", en: "Link occupancy" })) + '</div>' +
      esc_.map(function (x) { return '<div class="fila"><i style="background:' + colSev(x[0]) + '"></i><span class="sev sev-' + x[0] + '">' + x[0].toUpperCase().replace("CRIT", "CRIT") + '</span><span class="mono">' + x[1] + '</span></div>'; }).join("") +
      '<div class="tx3">' + esc(t({ es: "Grosor ∝ log(capacidad)", en: "Width ∝ log(capacity)" })) + '</div>') +
      '<div class="fila"><i class="disc"></i><span class="sev sev-unk">DOWN</span><span>' + esc(t({ es: "caído", en: "down" })) + '</span></div>' +
      (bandasOn.length ? '<div class="rot" style="margin-top:6px">' + esc(t({ es: "Radio (v7 §6.2)", en: "Radio (v7 §6.2)" })) + '</div>' +
        bandasOn.map(function (b) { return '<div class="fila"><i style="background:' + colorSV(b) + ';opacity:.6"></i><span class="mono">' + b + '</span></div>'; }).join("") +
        '<div class="tx3">' + esc(t({ es: "Trazo discontinuo = supuesto (forma o posición)", en: "Dashed outline = assumption (shape or position)" })) + '</div>' : '') +
      '<div class="rot" style="margin-top:6px">' + esc(t({ es: "Nodos", en: "Nodes" })) + '</div>' +
      '<div class="formas">' + tipos.map(function (tp) {
        return '<span>' + NOC.formaNodo(tp, 11, C.tx2, C.bg0) + esc(t(NOC.TIPO_NODO[tp])) + '</span>';
      }).join("") + '</div>' +
      '<div class="tx3" style="margin-top:6px">' + esc(t({ es: "Nodos co-ubicados en abanico. Clic: ficha · clic dcho. o F: fallo", en: "Co-located nodes fanned out. Click: details · right-click or F: fault" })) + '</div></div>';
  }

  // ---------- registro ----------
  NOC.registrarVista({
    id: "mapa", grupo: ["red", "simulacion"],
    titulo: { es: "Mapa", en: "Map" },
    montar: function (contenedor) {
      el = contenedor;
      leerTokens();
      el.innerHTML = '<div class="mapa-noc"></div><div class="mapa-leyenda"></div>' +
        '<div class="mapa-modo"></div>';
      mapa = L.map(el.querySelector(".mapa-noc"), { zoomControl: false, attributionControl: true, zoomSnap: 0.5, minZoom: 9, maxZoom: 16 });
      NOC.mapa = mapa;
      L.control.zoom({ position: "bottomright" }).addTo(mapa);
      mapa.createPane("zonas").style.zIndex = 350;
      mapa.createPane("radio").style.zIndex = 360;   // bandas de radio: encima de las zonas, debajo de los enlaces
      mapa.createPane("halo").style.zIndex = 395;
      mapa.createPane("enlaces").style.zIndex = 410;
      var pe = mapa.createPane("etiquetas"); pe.style.zIndex = 620; pe.style.pointerEvents = "none";
      // Teselas oscuras sin etiquetas: Esri Dark Gray Base (sin clave). CARTO dark_nolabels pide ya clave de API
      // (sale una marca de agua "API key required"), así que queda solo como alternativa si Esri falla.
      var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16, attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      });
      var fallos = 0;
      esri.on("tileerror", function () {
        if (++fallos !== 6) return;
        mapa.removeLayer(esri);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(mapa);
      });
      esri.addTo(mapa);
      var pts = (RED.nodos || []).filter(function (n) { return n.coord; }).map(function (n) { return n.coord; });
      if (pts.length) mapa.fitBounds(L.latLngBounds(pts).pad(0.08)); else mapa.setView([40.42, -3.68], 10);
      construir();
      montado = true;
      mapa.on("zoomend", recolocar);
      mapa.on("zoomend", zoomClase); zoomClase();
      mapa.on("click", function () { if (NOC.seleccion) NOC.cerrarFicha(); });
      if (window.ResizeObserver) new ResizeObserver(function () { if (mapa) mapa.invalidateSize(); }).observe(el);
      var lg = el.querySelector(".mapa-leyenda");
      // plegado recordado en localStorage["noc.plegado"].leyenda (NOC.plegado/NOC.plegar de app.js)
      var plegLey = function () { return NOC.plegado ? NOC.plegado("leyenda") : lg.classList.contains("plegada"); };
      lg.classList.toggle("plegada", NOC.plegado ? plegLey() : el.clientHeight < 520);
      L.DomEvent.disableClickPropagation(lg); L.DomEvent.disableScrollPropagation(lg);
      lg.addEventListener("click", function (ev) {
        if (!ev.target.closest(".ley-cab")) return;
        if (NOC.plegar) NOC.plegar("leyenda", !plegLey());
        lg.classList.toggle("plegada", NOC.plegar ? plegLey() : !lg.classList.contains("plegada")); pintarLeyenda();
      });
      NOC.on("plegado", function (p) { if (!p || p.id === "leyenda") { lg.classList.toggle("plegada", plegLey()); pintarLeyenda(); } });
      pintarLeyenda(); pintarModo();
    },
    activar: function () { if (mapa) setTimeout(function () { mapa.invalidateSize(); }, 0); },
    desactivar: function () { }
  });
  function pintarModo() {
    var m = el && el.querySelector(".mapa-modo");
    if (!m) return;
    var ref = NOC.modo === "ref";
    var f = NOC.fallosActivos ? NOC.fallosActivos() : [];
    m.className = "mapa-modo " + NOC.modo;
    m.innerHTML = (ref ? "REF · E2 v7" : "LAB") + (f.length ? ' · <span class="sev-unk">' + f.length + ' DOWN</span>' : '');
  }

  NOC.on("resultado", function () { refrescar(); pintarModo(); });
  NOC.on("seleccion", function (s) { refrescar(); enfocar(s); });
  NOC.on("capas", function () { if (montado) aplicarCapas(); });
  NOC.on("lang", function () { pintarLeyenda(); });
  NOC.on("modo", function () { pintarModo(); });
  NOC.on("carril", function () { if (mapa) setTimeout(function () { mapa.invalidateSize(); }, 0); });
  SV.on(function () { if (!montado) return; leerTokens(); refrescar(); aplicarRadio(); pintarLeyenda(); });
})();
