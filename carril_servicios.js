// carril_servicios.js — secciones SERVICIOS y RADIO del carril izquierdo (CONTRATO_UI Revisión 2 §3–§5).
// SERVICIOS: una fila por tipo (Motor.CLASES_SERVICIO) con color, Gbit/s y % servido; interruptores "ver" y
// "solo este tipo" y modo "colorear por tipo dominante". RADIO: bandas n28/n78/n258 (radio_datos.js, v7 §6.2)
// conmutables en el mapa, sectores n78 por zona y fichas de banda/área.
// Estado compartido con vista_mapa.js en NOC.sv (lo crea el primero que carga). Fichas: NOC.fichaServicio(clase),
// NOC.fichaBanda(id), NOC.fichaRadio(areaId).
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC) return;
  var RADIO = window.RADIO || null;
  var Motor = window.Motor || {};
  var CLASES = Motor.CLASES_SERVICIO || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var BANDAS = ["n28", "n78", "n258"];

  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es) || ""; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function fmt(x, d) { return NOC.fmt ? NOC.fmt(x, d) : (esNum(x) ? x.toFixed(d || 0) : "—"); }
  function gb(x) { return esNum(x) ? fmt(x, Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2) : "—"; }

  // ---------- estado compartido (mismo bloque en vista_mapa.js) ----------
  function estadoSV() {
    if (NOC.sv) return NOC.sv;
    var g = {};
    try { g = JSON.parse(localStorage.getItem("noc.servicios") || "{}") || {}; } catch (e) { g = {}; }
    var sv = NOC.sv = { activos: {}, dominante: !!g.dominante, bandas: {}, _f: [],
      on: function (fn) { this._f.push(fn); },
      // true si el mapa debe pintar por servicio (algún tipo apagado o modo dominante)
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

  // ---------- colores (tokens de TEMA, con reserva) ----------
  var RESERVA = { movil: "#3987e5", ftth: "#d95926", voz: "#199e70", urllc: "#c98500", iot: "#d55181",
    empresa: "#0ca30c", evento: "#9085e9", ntn: "#e66767", n28: "#8a7ff0", n78: "#20a8a0", n258: "#c08a1e" };
  function color(k) {
    var n = (BANDAS.indexOf(k) >= 0 ? "--band-" : "--sv-") + k, v = "";
    try { v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); } catch (e) { v = ""; }
    return v || RESERVA[k] || "#888";
  }
  NOC.colorServicio = color;

  // ---------- textos de cada tipo ----------
  var INFO = {
    movil: { n: { es: "Móvil eMBB", en: "Mobile eMBB" }, largo: { es: "Banda ancha móvil por radio", en: "Mobile broadband over radio" },
      que: { es: "Internet móvil de los abonados de cada municipio (slice eMBB, DNN internet): gNB n28/n78 → agregación → anillo → UPF central de los DC, 1/3 a cada DC.",
        en: "Mobile Internet of each municipality's subscribers (eMBB slice, DNN internet): n28/n78 gNB → aggregation → ring → central UPF in the DCs, 1/3 per DC." },
      fuente: "v7 §3.4.1 (reparto por zona), A4 (327,21 Gbit/s en hora cargada; 409,02 con +25 %), A5 (capacidad radio 828,74/192,49 Gbit/s)" },
    ftth: { n: { es: "FTTH fijo", en: "Fixed FTTH" }, largo: { es: "Internet fijo (BNG)", en: "Fixed Internet (BNG)" },
      que: { es: "Internet fijo por XGS-PON que termina en el BNG de los DC, sin pasar por la UPF. Incluye la parte de empresas del Internet fijo (el reparto residencial/empresa es un supuesto del simulador).",
        en: "Fixed Internet over XGS-PON ending at the DC BNGs, not crossing a UPF. Includes the business share of fixed Internet (the residential/business split is a simulator assumption)." },
      fuente: "v7 §3.4.1, A4 (fijo BNG 2 564,18 Gbit/s; 3 205,22 con +25 %), §6.10.1 (BNG)" },
    voz: { n: { es: "Voz", en: "Voice" }, largo: { es: "VoNR/IMS y voz fija", en: "VoNR/IMS and fixed voice" },
      que: { es: "Voz móvil VoNR (5QI 1) y voz fija IMS hacia los DC con IMS. En transporte lleva cabecera 1,44 (144 B/100 B).",
        en: "Mobile VoNR (5QI 1) and fixed IMS voice to the DCs with IMS. Transport overhead 1.44 (144 B/100 B)." },
      fuente: "v7 A1–A3 (voz y registro), A5 (VoNR 40,43 Gbit/s por sentido), §2.7.2 (factor 1,44)" },
    urllc: { n: { es: "URLLC / V2X", en: "URLLC / V2X" }, largo: { es: "Servicios críticos", en: "Critical services" },
      que: { es: "Slice URLLC: avisos V2N de la A-2 (Edge-Este) y hospital de Getafe (videoconsulta, telemetría y cámaras, Edge-Sur). Prioridad 1.",
        en: "URLLC slice: A-2 V2N warnings (Edge-East) and Getafe hospital (video consultation, telemetry and cameras, Edge-South). Priority 1." },
      fuente: "v7 §6.3.2 (hospital), §6.3.3 (A-2), A8" },
    iot: { n: { es: "IoT / mMTC", en: "IoT / mMTC" }, largo: { es: "Sensores y cámaras ciudad", en: "City sensors and cameras" },
      que: { es: "Smart City Valdebebas: 95 000 sensores NB-IoT/LTE-M (mMTC, UPF central) y 5 000 cámaras RedCap (eMBB video-ciudad, Edge-Centro).",
        en: "Smart City Valdebebas: 95,000 NB-IoT/LTE-M sensors (mMTC, central UPF) and 5,000 RedCap cameras (eMBB video-ciudad, Edge-Centre)." },
      fuente: "v7 §6.3.4, A8 (sensores 2,14 Mbit/s UL; cámaras 5 000 Mbit/s UL)" },
    empresa: { n: { es: "Empresa", en: "Enterprise" }, largo: { es: "L2VPN y red privada", en: "L2VPN and private network" },
      que: { es: "Red privada PNI-NPN tipo A de la industria Sur (UPF privada en Edge-Sur) y L2VPN EVPN entre cuatro sedes.",
        en: "Type-A PNI-NPN private network for South industry (private UPF at Edge-South) and EVPN L2VPN between four sites." },
      fuente: "v7 §6.3.5 y A9 (piloto industrial), §6.9 (L2VPN; la cota de 10 GbE por UNI sale de un documento anterior y va marcada en el servicio)" },
    evento: { n: { es: "Evento", en: "Event" }, largo: { es: "Estadio (MEC)", en: "Stadium (MEC)" },
      que: { es: "Estadio Metropolitano: QoD de prensa, tráfico ligero y vídeo del público, en Edge-Centro (respaldo Edge-Este al 60 %).",
        en: "Metropolitano Stadium: press QoD, light traffic and audience video, at Edge-Centre (Edge-East backup at 60 %)." },
      fuente: "v7 §6.3.1, A7 (164,69 / 88,75 Gbit/s con reserva)" },
    ntn: { n: { es: "Satélite NTN", en: "NTN satellite" }, largo: { es: "Contingencia por satélite", en: "Satellite contingency" },
      que: { es: "Satélite de emergencia OneWeb con hub en Arganda. Inactivo salvo que un escenario lo active.",
        en: "OneWeb emergency satellite with hub in Arganda. Inactive unless a scenario enables it." },
      fuente: "v7 §6.11" }
  };
  NOC.infoServicio = INFO;

  // ---------- estilos propios (solo tokens; el resto del carril lo pinta TEMA) ----------
  (function () {
    if (document.getElementById("css-carril-servicios")) return;
    var st = document.createElement("style");
    st.id = "css-carril-servicios";
    st.textContent =
      ".svc{font-size:11px;font-variant-numeric:tabular-nums}" +
      ".svc .svc-barra{display:flex;gap:4px;align-items:center;justify-content:space-between;margin:0 0 4px}" +
      ".svc label{display:flex;gap:4px;align-items:center;cursor:pointer;color:var(--tx2,#a6a6a6)}" +
      ".svc button{font:inherit;font-size:10px;border:1px solid var(--line,#333);background:none;color:var(--tx2,#a6a6a6);padding:0 5px;height:18px;cursor:pointer;border-radius:0}" +
      ".svc button:hover,.svc button.on{color:var(--tx1,#ececec);border-color:var(--tx2,#a6a6a6)}" +
      ".svc table{width:100%;border-collapse:collapse}" +
      ".svc td{padding:0 2px;height:22px;border-top:1px solid var(--line,#222);white-space:nowrap}" +
      ".svc td.n{text-align:right;font-family:var(--mono,ui-monospace,monospace)}" +
      ".svc tr.off td{opacity:.45}" +
      ".svc i.sw{display:inline-block;width:10px;height:10px;vertical-align:-1px}" +
      ".svc .nom{cursor:pointer;color:var(--tx1,#ececec);text-decoration:none;max-width:90px;overflow:hidden;text-overflow:ellipsis;display:inline-block;vertical-align:middle}" +
      ".svc .nom:hover{text-decoration:underline}" +
      ".svc input{margin:0;accent-color:var(--tx2,#a6a6a6)}" +
      ".svc .rot{color:var(--tx3,#707070);font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:8px 0 2px}" +
      ".svc .nota{color:var(--tx3,#707070);font-size:10px;line-height:1.35;margin-top:4px;white-space:normal}" +
      ".sv-flotante{position:fixed;left:8px;bottom:40px;z-index:900;width:240px;max-height:60vh;overflow:auto;background:var(--bg1,#0b0b0b);border:1px solid var(--line,#333);padding:6px 8px;color:var(--tx1,#ececec)}" +
      ".sv-flotante h4{margin:6px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3,#707070)}" +
      ".ficha-sv .sw{display:inline-block;width:10px;height:10px;margin-right:4px;vertical-align:-1px}" +
      ".ficha-sv a[data-sv-enlace],.ficha-sv a[data-sv-zona]{cursor:pointer;color:inherit;text-decoration:underline dotted}";
    document.head.appendChild(st);
  })();

  // ---------- SERVICIOS ----------
  var elSV = null;
  function resumenSV() { var r = NOC.resultado; return r && r.resumen && r.resumen.por_servicio; }
  function pintarServicios() {
    if (!elSV) return;
    var ps = resumenSV() || {};
    var todos = CLASES.every(function (c) { return SV.activos[c]; });
    elSV.innerHTML = '<div class="svc">' +
      '<div class="svc-barra"><label title="' + esc(t({ es: "Color de cada enlace = tipo que más carga lleva", en: "Each link coloured by its largest service type" })) + '">' +
      '<input type="checkbox" data-sv-dom' + (SV.dominante ? " checked" : "") + '> ' + esc(t({ es: "Color por dominante", en: "Colour by dominant" })) + '</label>' +
      '<button type="button" data-sv-todos class="' + (todos ? "" : "on") + '">' + esc(t({ es: "Todos", en: "All" })) + '</button></div>' +
      '<table><tbody>' + CLASES.map(function (c) {
        var p = ps[c] || {}, on = SV.activos[c];
        var sev = esNum(p.pct) ? (p.pct >= 99.5 ? "ok" : p.pct >= 95 ? "min" : p.pct >= 80 ? "maj" : "crit") : "unk";
        return '<tr data-clase="' + c + '" class="' + (on ? "" : "off") + '">' +
          '<td><input type="checkbox" data-sv-act title="' + esc(t({ es: "Ver en el mapa", en: "Show on map" })) + '"' + (on ? " checked" : "") + '></td>' +
          '<td><i class="sw" style="background:' + color(c) + '"></i> <a class="nom" data-sv-ficha title="' + esc(t(INFO[c].largo)) + '">' + esc(t(INFO[c].n)) + '</a></td>' +
          '<td class="n" title="DL / UL Gbit/s">' + gb(p.dl_gbps) + '<span style="color:var(--tx3,#707070)">/</span>' + gb(p.ul_gbps) + '</td>' +
          '<td class="n sev-' + sev + '" title="' + esc(t({ es: "% de la demanda DL servida", en: "% of DL demand served" })) + '">' + (esNum(p.pct) ? fmt(p.pct, p.pct >= 99.95 ? 0 : 1) : "—") + '</td>' +
          '<td><button type="button" data-sv-solo title="' + esc(t({ es: "Ver solo este tipo", en: "Show only this type" })) + '">1</button></td></tr>';
      }).join("") + '</tbody></table>' +
      '<div class="nota">' + esc(t({ es: "Gbit/s IP DL/UL y % servido del caso actual. Con algún tipo apagado, el mapa pinta cada enlace con la carga de los tipos activos.",
        en: "IP Gbit/s DL/UL and % served in the current case. With a type off, the map draws each link with the load of the active types." })) + '</div></div>';
  }
  function clicServicios(ev) {
    var tr = ev.target.closest("tr[data-clase]"), c = tr && tr.getAttribute("data-clase");
    if (ev.target.closest("[data-sv-todos]")) { CLASES.forEach(function (k) { SV.activos[k] = true; }); SV.cambio(); return; }
    if (!c) return;
    if (ev.target.closest("[data-sv-ficha]")) { NOC.fichaServicio(c); return; }
    if (ev.target.closest("[data-sv-solo]")) {
      var solo = CLASES.every(function (k) { return SV.activos[k] === (k === c); });
      CLASES.forEach(function (k) { SV.activos[k] = solo ? true : k === c; });
      SV.cambio();
    }
  }
  function cambioServicios(ev) {
    if (ev.target.matches("[data-sv-dom]")) { SV.dominante = ev.target.checked; SV.cambio(); return; }
    var tr = ev.target.closest("tr[data-clase]");
    if (tr && ev.target.matches("[data-sv-act]")) { SV.activos[tr.getAttribute("data-clase")] = ev.target.checked; SV.cambio(); }
  }
  function montarServicios(el) {
    elSV = el;
    el.addEventListener("click", clicServicios);
    el.addEventListener("change", cambioServicios);
    pintarServicios();
  }

  // ---------- fichas ----------
  function sec(tit, cuerpo) { return '<div class="ficha-sec"><h3>' + esc(tit) + '</h3>' + cuerpo + '</div>'; }
  function kv(filas) {
    return '<dl class="kv">' + filas.filter(Boolean).map(function (f) {
      return '<dt>' + esc(f[0]) + '</dt><dd class="' + (f[2] || "") + '">' + f[1] + '</dd>';
    }).join("") + '</dl>';
  }
  var NE = { es: "no especificado en v7", en: "not specified in v7" };
  function ne() { return '<span style="color:var(--tx3,#707070)">' + esc(t(NE)) + '</span>'; }

  NOC.fichaServicio = function (c) {
    var I = INFO[c]; if (!I) return;
    var r = NOC.resultado || {}, p = (r.resumen && r.resumen.por_servicio && r.resumen.por_servicio[c]) || {};
    var dems = (r.demandas || []).filter(function (d) { return d.clase_servicio === c; });
    var agr = {}, orden = [];
    dems.forEach(function (d) {
      var k = d.padre || d.id;
      if (!agr[k]) { agr[k] = { dl: 0, ul: 0, sv: 0, regla: d.regla_servicio }; orden.push(k); }
      agr[k].dl += d.dl_gbps; agr[k].ul += d.ul_gbps; agr[k].sv += d.servida_gbps;
    });
    orden.sort(function (a, b) { return (agr[b].dl + agr[b].ul) - (agr[a].dl + agr[a].ul); });
    var enl = [];
    Object.keys(r.enlaces || {}).forEach(function (id) {
      var e = r.enlaces[id], q = e.por_servicio && e.por_servicio[c];
      if (!q) return;
      var m = Math.max(q.ab, q.ba);
      if (m > 1e-9) enl.push({ id: id, g: m, share: e.carga_gbps > 0 ? m / e.carga_gbps : 0, oc: e.capacidad_gbps ? m / e.capacidad_gbps : null });
    });
    enl.sort(function (a, b) { return b.g - a.g; });
    var h = '<div class="ficha-sv">' +
      sec(t({ es: "Qué es", en: "What it is" }), '<div class="dato-doc"><i class="sw" style="background:' + color(c) + '"></i>' + esc(t(I.que)) + '</div>') +
      sec(t({ es: "Demanda ahora", en: "Demand now" }), kv([
        [t({ es: "DL / UL (IP)", en: "DL / UL (IP)" }), gb(p.dl_gbps) + " / " + gb(p.ul_gbps) + " Gbit/s", "mono"],
        [t({ es: "Servida DL", en: "Served DL" }), gb(p.servida_gbps) + " Gbit/s · " + (esNum(p.pct) ? fmt(p.pct, 1) + " %" : "—"), "mono"],
        [t({ es: "Demandas", en: "Demands" }), String(p.n != null ? p.n : orden.length), "mono"]
      ])) +
      sec(t({ es: "De dónde sale", en: "Where it comes from" }), '<div class="dato-doc">' + esc(I.fuente) + '</div>' +
        '<table class="tabla"><thead><tr><th>ID</th><th class="n">DL</th><th class="n">UL</th></tr></thead><tbody>' +
        orden.slice(0, 24).map(function (k) {
          return '<tr title="' + esc(t({ es: "Regla: ", en: "Rule: " }) + (agr[k].regla || "")) + '"><td class="id">' + esc(k) + '</td><td class="n">' + gb(agr[k].dl) + '</td><td class="n">' + gb(agr[k].ul) + '</td></tr>';
        }).join("") + (orden.length > 24 ? '<tr><td colspan="3">… ' + (orden.length - 24) + '</td></tr>' : '') + '</tbody></table>' +
        '<div class="dato-calc" style="margin-top:4px">' + esc(t({ es: "Clasificación del simulador por tipo, perfil, slice y destino de cada demanda (Motor.claseServicio).",
          en: "Simulator classification by each demand's type, profile, slice and destination (Motor.claseServicio)." })) + '</div>') +
      sec(t({ es: "Enlaces que más carga", en: "Links it loads most" }), enl.length ?
        '<table class="tabla"><thead><tr><th>' + esc(t({ es: "Enlace", en: "Link" })) + '</th><th class="n">Gbit/s</th><th class="n">' + esc(t({ es: "% enl.", en: "% link" })) + '</th><th class="n">' + esc(t({ es: "% cap.", en: "% cap." })) + '</th></tr></thead><tbody>' +
        enl.slice(0, 10).map(function (x) {
          return '<tr><td class="id"><a data-sv-enlace="' + esc(x.id) + '">' + esc(x.id) + '</a></td><td class="n">' + gb(x.g) + '</td><td class="n">' + fmt(x.share * 100, 0) + '</td><td class="n">' + (x.oc == null ? "—" : fmt(x.oc * 100, 1)) + '</td></tr>';
        }).join("") + '</tbody></table><div class="nota" style="color:var(--tx3,#707070);font-size:10px">' +
        esc(t({ es: "Gbit/s físicos (con cabecera) en el sentido más cargado del tipo; % enl. = parte de la carga del enlace.", en: "Physical Gbit/s (with overhead) in the type's busiest direction; % link = share of the link load." })) + '</div>'
        : '<div class="tx3">' + esc(t({ es: "No carga ningún enlace en este caso.", en: "Loads no link in this case." })) + '</div>') + '</div>';
    NOC.abrirFicha({ titulo: t(I.n), subtitulo: t(I.largo) + " · " + t({ es: "tipo de servicio", en: "service type" }), html: h });
  };

  function banda(id) { return RADIO ? RADIO.bandas.filter(function (b) { return b.id === id; })[0] : null; }
  function filasBanda(b) {
    return kv([
      [t({ es: "Frecuencia", en: "Frequency" }), esc(b.frecuencia + " · " + b.duplex + " " + b.ancho + " · " + b.scs_khz + " kHz"), "mono"],
      [t({ es: "Por sector", en: "Per sector" }), fmt(b.sector_mbps.dl, 0) + " / " + fmt(b.sector_mbps.ul, 0) + " Mbit/s DL/UL", "mono"],
      [t({ es: "Papel", en: "Role" }), esc(t(b.rol))],
      [t({ es: "PIRE gNB", en: "gNB EIRP" }), fmt(b.pire_dbm, 1) + " dBm · G_RX " + fmt(b.g_rx_dbi, 1) + " dBi · NF " + fmt(b.nf_db, 0) + " dB", "mono"],
      [t({ es: "UE", en: "UE" }), esc(b.ue)],
      [t({ es: "P95 radio (ida)", en: "Radio P95 (one way)" }), fmt(b.latencia_p95_ms, 1) + " ms", "mono"],
      b.tdd ? ["TDD", esc(b.tdd)] : null,
      b.nota ? [t({ es: "Nota", en: "Note" }), esc(b.nota)] : null
    ]) + '<div class="dato-doc">' + esc(b.fuente) + '</div>';
  }
  NOC.fichaBanda = function (id) {
    var b = banda(id); if (!b) return;
    var as = RADIO.areas.filter(function (a) { return a.banda === id; });
    var h = '<div class="ficha-sv">' + sec(t({ es: "Configuración (v7 §6.2.1–6.2.2)", en: "Configuration (v7 §6.2.1–6.2.2)" }), filasBanda(b));
    if (id === "n78") {
      h += sec(t({ es: "Sectores n78 por zona (§6.2.7)", en: "n78 sectors per zone (§6.2.7)" }),
        '<table class="tabla"><thead><tr><th>' + esc(t({ es: "Zona", en: "Zone" })) + '</th><th class="n">' + esc(t({ es: "Sectores", en: "Sectors" })) + '</th><th>' + esc(t({ es: "Limita", en: "Limit" })) + '</th></tr></thead><tbody>' +
        RADIO.zonas.map(function (z) { return '<tr><td>' + esc(t(z.nombre)) + '</td><td class="n">' + fmt(z.sectores_n78, 0) + '</td><td>' + esc(z.limita) + '</td></tr>'; }).join("") +
        '<tr><td>Total</td><td class="n">' + fmt(RADIO.territorial.sectores_n78, 0) + '</td><td>≈' + fmt(RADIO.territorial.sitios_trisector, 0) + ' ' + esc(t({ es: "sitios", en: "sites" })) + '</td></tr></tbody></table>' +
        '<div class="dato-doc">' + esc(RADIO.territorial.regla) + '. ' + esc(RADIO.territorial.nota) + '</div>');
    }
    h += sec(t({ es: "Áreas dibujadas", en: "Drawn areas" }), '<table class="tabla"><tbody>' + as.map(function (a) {
      return '<tr><td><a data-sv-area="' + esc(a.id) + '">' + esc(t(a.titulo)) + '</a></td><td class="n">' + (a.radio_m ? fmt(a.radio_m >= 1000 ? a.radio_m / 1000 : a.radio_m, a.radio_m >= 1000 ? 2 : 0) + (a.radio_m >= 1000 ? " km" : " m") : "—") + '</td><td>' + esc(a.origen) + '</td></tr>';
    }).join("") + '</tbody></table>') + '</div>';
    NOC.abrirFicha({ titulo: b.id + " · " + b.frecuencia, subtitulo: t({ es: "banda de radio", en: "radio band" }), html: h });
  };
  NOC.fichaRadio = function (areaId) {
    if (!RADIO) return;
    var a = RADIO.areas.filter(function (x) { return x.id === areaId; })[0]; if (!a) return;
    var b = banda(a.banda), m = a.zona && RADIO.municipios[a.zona], z = a.zona && NOC.RED && (NOC.RED.zonas || []).filter(function (x) { return x.id === a.zona; })[0];
    var km = function (x) { return x == null ? ne() : (typeof x === "number" ? "≈" + fmt(x, x < 1 ? 2 : 2) + " km" : esc(x) + " km"); };
    var lat = a.latencia_ms;
    var claseOrigen = a.origen === "supuesto" ? "dato-sup" : a.origen === "calculado" ? "dato-calc" : "dato-doc";
    var h = '<div class="ficha-sv">' +
      sec(t({ es: "Área", en: "Area" }), '<div class="' + claseOrigen + '">' + kv([
        [t({ es: "Banda", en: "Band" }), '<i class="sw" style="background:' + color(a.banda) + '"></i><a data-sv-banda="' + esc(a.banda) + '">' + esc(a.banda + (b ? " · " + b.frecuencia : "")) + '</a>'],
        [t({ es: "Tipo", en: "Type" }), esc(a.tipo)],
        [t({ es: "Origen", en: "Origin" }), esc(a.origen)],
        [t({ es: "Radio UL", en: "UL radius" }), a.radio_ul_km != null ? km(a.radio_ul_km) : (a.radio_nota ? esc(a.radio_nota) : ne()), "mono"],
        [t({ es: "Radio DL", en: "DL radius" }), km(a.radio_dl_km), "mono"],
        a.radios_haz ? [t({ es: "Radios por haz", en: "Radius per beam" }), esc(a.radios_haz), "mono"] : null,
        a.radios_de ? [t({ es: "Radios de", en: "Radii from" }), esc(a.radios_de)] : null,
        a.mapl_dl_ul ? ["MAPL DL/UL", esc(a.mapl_dl_ul), "mono"] : null,
        [t({ es: "Modelo", en: "Model" }), a.modelo ? esc(a.modelo) : ne()],
        a.area_km2 ? [t({ es: "Área dibujada", en: "Drawn area" }), fmt(a.area_km2, 1) + " km²", "mono"] : null,
        a.lado_m ? [t({ es: "Nave", en: "Warehouse" }), a.lado_m[0] + " × " + a.lado_m[1] + " m", "mono"] : null,
        [t({ es: "Sectores", en: "Sectors" }), a.sectores != null ? fmt(a.sectores, 0) : a.sectores_n78 != null ? fmt(a.sectores_n78, 0) + " n78" : ne(), "mono"],
        [t({ es: "Sitios", en: "Sites" }), a.sitios != null ? fmt(a.sitios, 0) + (a.origen_sitios ? " (" + esc(a.origen_sitios) + ")" : "") : ne(), "mono"],
        [t({ es: "Capacidad DL/UL", en: "Capacity DL/UL" }), a.capacidad_gbps ? (a.capacidad_gbps.dl == null ? "—" : gb(a.capacidad_gbps.dl)) + " / " + gb(a.capacidad_gbps.ul) + " Gbit/s" : ne(), "mono"],
        [t({ es: "Por sector", en: "Per sector" }), b ? fmt(b.sector_mbps.dl, 0) + " / " + fmt(b.sector_mbps.ul, 0) + " Mbit/s" : ne(), "mono"],
        [t({ es: "P95 radio / usuario–Edge", en: "P95 radio / user–Edge" }), lat ? fmt(lat.radio, 1) + " / " + fmt(lat.normal, 1) + " ms (" + t({ es: "respaldo ", en: "backup " }) + fmt(lat.respaldo, 1) + ")" : (b ? fmt(b.latencia_p95_ms, 1) + " ms " + t({ es: "(radio de la banda)", en: "(band radio)" }) : ne()), "mono"]
      ]) + '</div>' + (a.lectura ? '<div class="dato-doc" style="margin-top:4px">' + esc(a.lectura) + '</div>' : '') +
      (a.latencia_nota ? '<div class="dato-doc">' + esc(a.latencia_nota) + '</div>' : '')) +
      (a.supuesto ? sec(t({ es: "Supuesto del simulador", en: "Simulator assumption" }), '<div class="dato-sup">' + esc(a.supuesto) + '</div>') : '') +
      (m ? sec(t({ es: "Municipio", en: "Municipality" }) + (z ? " · " + z.nombre : ""), kv([
        [t({ es: "Zona v7", en: "v7 zone" }), esc(m.zona_v7 || "—")],
        [t({ es: "Sectores n78", en: "n78 sectors" }), m.sectores_n78 != null ? fmt(m.sectores_n78, 0) : ne(), "mono"],
        [t({ es: "Sitios", en: "Sites" }), m.sitios != null ? fmt(m.sitios, 0) + " (" + esc(m.origen_sitios) + ")" : ne(), "mono"]
      ]) + (m.nota ? '<div class="' + (m.origen_sitios === "calculado" ? "dato-calc" : "dato-doc") + '">' + esc(m.nota) + '</div>' : '')) : '') +
      (b ? sec(t({ es: "Banda", en: "Band" }), filasBanda(b)) : '') +
      sec(t({ es: "Fuente", en: "Source" }), '<div class="dato-doc">' + esc(a.fuente) + '</div>') + '</div>';
    NOC.abrirFicha({ titulo: t(a.titulo), subtitulo: t({ es: "cobertura radio · ", en: "radio coverage · " }) + a.banda, html: h });
  };

  // enlaces dentro de las fichas
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-sv-enlace],[data-sv-area],[data-sv-banda]");
    if (!a || !a.closest(".ficha-sv")) return;
    ev.preventDefault();
    if (a.hasAttribute("data-sv-enlace")) NOC.seleccionar("enlace", a.getAttribute("data-sv-enlace"));
    else if (a.hasAttribute("data-sv-area")) NOC.fichaRadio(a.getAttribute("data-sv-area"));
    else NOC.fichaBanda(a.getAttribute("data-sv-banda"));
  });

  // ---------- RADIO ----------
  var elRF = null;
  function pintarRadio() {
    if (!elRF) return;
    if (!RADIO) { elRF.innerHTML = '<div class="svc"><div class="nota">radio_datos.js ' + esc(t({ es: "no cargado", en: "not loaded" })) + '</div></div>'; return; }
    elRF.innerHTML = '<div class="svc"><table><tbody>' + RADIO.bandas.map(function (b) {
      var n = RADIO.areas.filter(function (a) { return a.banda === b.id; }).length;
      return '<tr data-banda="' + b.id + '" class="' + (SV.bandas[b.id] ? "" : "off") + '">' +
        '<td><input type="checkbox" data-rf-act title="' + esc(t({ es: "Áreas en el mapa", en: "Areas on map" })) + '"' + (SV.bandas[b.id] ? " checked" : "") + '></td>' +
        '<td><i class="sw" style="background:' + color(b.id) + '"></i> <a class="nom" data-rf-ficha title="' + esc(t(b.rol)) + '">' + esc(b.id) + '</a></td>' +
        '<td>' + esc(b.frecuencia) + '</td><td class="n" title="DL/UL Mbit/s ' + esc(t({ es: "por sector", en: "per sector" })) + '">' + fmt(b.sector_mbps.dl, 0) + '/' + fmt(b.sector_mbps.ul, 0) + '</td>' +
        '<td class="n" title="' + esc(t({ es: "áreas dibujadas", en: "drawn areas" })) + '">' + n + '</td></tr>';
    }).join("") + '</tbody></table>' +
      '<div class="rot">' + esc(t({ es: "Sectores n78 por zona", en: "n78 sectors per zone" })) + '</div><table><tbody>' +
      RADIO.zonas.map(function (z) { return '<tr><td>' + esc(t(z.nombre)) + '</td><td class="n">' + fmt(z.sectores_n78, 0) + '</td></tr>'; }).join("") +
      '<tr><td>Total</td><td class="n">' + fmt(RADIO.territorial.sectores_n78, 0) + '</td></tr></tbody></table>' +
      '<div class="nota">' + esc(t({ es: "v7 §6.2. Áreas por zona = dibujo aproximado (supuesto), no cobertura calculada. Clic en un área: ficha.",
        en: "v7 §6.2. Zone areas = approximate drawing (assumption), not computed coverage. Click an area: details." })) + '</div></div>';
  }
  function montarRadio(el) {
    elRF = el;
    el.addEventListener("click", function (ev) {
      var tr = ev.target.closest("tr[data-banda]");
      if (tr && ev.target.closest("[data-rf-ficha]")) NOC.fichaBanda(tr.getAttribute("data-banda"));
    });
    el.addEventListener("change", function (ev) {
      var tr = ev.target.closest("tr[data-banda]");
      if (tr && ev.target.matches("[data-rf-act]")) { SV.bandas[tr.getAttribute("data-banda")] = ev.target.checked; SV.cambio(); }
    });
    pintarRadio();
  }

  SV.on(function () { pintarServicios(); pintarRadio(); });
  if (NOC.on) {
    NOC.on("resultado", pintarServicios);
    NOC.on("lang", function () { pintarServicios(); pintarRadio(); });
  }

  // ---------- registro en el carril (con reintento; si no hay API, panel flotante) ----------
  var registrado = false;
  function registrar() {
    if (registrado) return true;
    if (typeof NOC.registrarSeccionCarril !== "function") return false;
    registrado = true;
    NOC.registrarSeccionCarril({ id: "servicios", titulo: { es: "Servicios", en: "Services" }, orden: 20, inicial: "SV", montar: montarServicios });
    NOC.registrarSeccionCarril({ id: "radio", titulo: { es: "Radio", en: "Radio" }, orden: 30, inicial: "RF", montar: montarRadio });
    return true;
  }
  function flotante() {
    if (registrado || !document.body) return;
    registrado = true;
    var d = document.createElement("div");
    d.className = "sv-flotante";
    d.innerHTML = '<h4>' + esc(t({ es: "Servicios", en: "Services" })) + '</h4><div class="sv-a"></div><h4>' + esc(t({ es: "Radio", en: "Radio" })) + '</h4><div class="sv-b"></div>';
    document.body.appendChild(d);
    montarServicios(d.querySelector(".sv-a")); montarRadio(d.querySelector(".sv-b"));
  }
  if (!registrar()) {
    if (NOC.on) NOC.on("listo", registrar);
    document.addEventListener("DOMContentLoaded", registrar);
    var intentos = 0, iv = setInterval(function () {
      if (registrar()) clearInterval(iv);
      else if (++intentos > 20) { clearInterval(iv); flotante(); }
    }, 150);
  }
})();
