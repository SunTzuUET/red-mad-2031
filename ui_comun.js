// ui_comun.js — API visual común de RED-MAD 2031 (CONTRATO_UI.md, Revisión 11, dueño VISUAL).
// Se carga ANTES que app.js (app.js copia en el NOC definitivo lo que encuentre en window.NOC) y funciona igual si se
// carga después. Las funciones leen window.NOC en el momento de la llamada (idioma, índices), nunca al cargar.
//   NOC.nivel "simple"|"experto" · NOC.setNivel(n) · NOC.alNivel(fn) · body.n-simple / body.n-experto
//   NOC.icono(clave, tam?, {titulo, clase}?) · NOC.nombreCorto(id, {largo}?) · NOC.info(texto, {etiqueta}?)
//   NOC.color.sev(x) / .estado(x) / .servicio(clave) / .dato(tipo) / .tok(nombre)
//   NOC.medidor(valor, {min, max, umbrales, unidad, escala, dec, etiqueta, objetivo, tipo:"barra"|"arco", estado, ancho})
//   Extras: NOC.donut(partes, opc) · NOC.curva(valores, opc) · NOC.camino(ids, opc) · NOC.textoEstado(sev) · NOC.interruptorNivel()
//   [data-tip="texto"] en cualquier elemento: misma burbuja que ⓘ al pasar, enfocar o tocar.
(function () {
  "use strict";
  var W = window;
  function N() { return W.NOC || {}; }
  function t(o) { var n = N(); if (n.t) return n.t(o); if (o == null) return ""; return typeof o === "string" ? o : (o.es != null ? o.es : ""); }
  function lang() { return N().lang === "en" ? "en" : "es"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function fmt(x, d) {
    var n = N();
    if (n.fmt) return n.fmt(x, d);
    return esNum(x) ? Number(x).toLocaleString(lang() === "es" ? "es-ES" : "en-GB", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }) : "—";
  }
  var API = W.NOC = W.NOC || {};

  // ---------- nivel simple / experto ----------
  var oyNivel = [];
  API.nivel = leer("noc.nivel") === "experto" ? "experto" : "simple";
  function clasesNivel() {
    var b = document.body;
    if (!b) return;
    var n = N().nivel === "experto" ? "experto" : "simple";
    b.classList.toggle("n-simple", n === "simple");
    b.classList.toggle("n-experto", n === "experto");
  }
  API.setNivel = function (v) {
    v = v === "experto" ? "experto" : "simple";
    var n = N();
    if (n.nivel === v && document.body && document.body.classList.contains("n-" + v)) return;
    n.nivel = v; API.nivel = v;
    guardar("noc.nivel", v);
    clasesNivel();
    Array.prototype.forEach.call(document.querySelectorAll("[data-nivel]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-nivel") === v)); });
    oyNivel.forEach(function (fn) { try { fn(v); } catch (e) { console.error("NOC.alNivel", e); } });
  };
  API.alNivel = function (fn) { if (typeof fn === "function") oyNivel.push(fn); };
  API.interruptorNivel = function () {
    var v = N().nivel === "experto" ? "experto" : "simple";
    return '<div class="seg nivel-seg" role="group" aria-label="' + esc(t({ es: "Nivel de detalle", en: "Detail level" })) + '">' +
      '<button type="button" data-nivel="simple" aria-pressed="' + (v === "simple") + '" title="' + esc(t({ es: "Simple: gráficos y lo esencial", en: "Simple: charts and the essentials" })) + '">' + API.icono("simple", 14) + '<span>' + esc(t({ es: "Simple", en: "Simple" })) + '</span></button>' +
      '<button type="button" data-nivel="experto" aria-pressed="' + (v === "experto") + '" title="' + esc(t({ es: "Experto: tablas, ids y fórmulas", en: "Expert: tables, ids and formulas" })) + '">' + API.icono("experto", 14) + '<span>' + esc(t({ es: "Experto", en: "Expert" })) + '</span></button></div>';
  };
  if (document.body) clasesNivel(); else document.addEventListener("DOMContentLoaded", clasesNivel);

  // ---------- iconos ----------
  API.icono = function (clave, tam, opc) {
    var I = W.NOC_ICONOS || { trazos: {}, alias: {} };
    var k = String(clave || "").toLowerCase();
    k = I.alias[k] || k;
    var p = I.trazos[k] || I.trazos.unk || "";
    tam = tam || 16; opc = opc || {};
    var sw = Math.max(0.75, 1.5 * 24 / tam).toFixed(2);   // 1,5 px reales a cualquier tamaño
    var tit = opc.titulo ? t(opc.titulo) : "";
    return '<svg class="ico-n' + (opc.clase ? " " + opc.clase : "") + '" width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw +
      '" stroke-linecap="round" stroke-linejoin="round" focusable="false"' + (tit ? ' role="img" aria-label="' + esc(tit) + '"><title>' + esc(tit) + '</title>' : ' aria-hidden="true">') + p + '</svg>';
  };

  // ---------- nombres cortos ----------
  function idx() {
    var n = N();
    if (n.idx) return n.idx;
    var R = W.RED || {}, o = { nodos: {}, enlaces: {}, zonas: {} };
    (R.nodos || []).forEach(function (x) { o.nodos[x.id] = x; });
    (R.enlaces || []).forEach(function (x) { o.enlaces[x.id] = x; });
    (R.zonas || []).forEach(function (x) { o.zonas[x.id] = x; });
    return o;
  }
  function capital(s) { s = String(s || "").toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }
  var IX_CORTO = { "IX-INTERNET": "Internet", "IX-IMS": "IMS", "IX-ONEWEB": "OneWeb" };
  function nombreNodo(n) {
    var id = n.id, nom = String(n.nombre || id), m;
    switch (n.tipo) {
      case "core": return "DC " + nom.replace(/^DC-?\s*/i, "");
      case "metro": return "Metro " + nom.replace(/^Metro-?\s*/i, "");
      case "edge": return "Edge " + nom.replace(/^Edge-?\s*/i, "");
      case "agg": return (lang() === "en" ? "Agg. " : "Agr. ") + nom.replace(/^Agregaci[oó]n\s*/i, "").replace(/ de (Jarama|Ardoz|Henares|la Humosa)$/i, "");
      case "ix": return IX_CORTO[id] || nom.split(/[:(·]/)[0].trim();
    }
    if ((m = /^SITE-L2VPN-(\w+)/.exec(id))) return "L2VPN " + capital(m[1]);
    if ((m = /^SITE-NTN-(\w+)/.exec(id))) return "NTN " + capital(m[1]);
    var c = nom.split(" · ")[0].trim();
    return c.length > 26 ? c.slice(0, 25) + "…" : c;
  }
  API.nombreCorto = function (id, opc) {
    if (id == null || id === "") return "";
    var I = idx(), x;
    if ((x = I.nodos[id])) return nombreNodo(x);
    if ((x = I.enlaces[id])) {
      var a = I.nodos[x.a], b = I.nodos[x.b];
      return (a ? nombreNodo(a) : x.a) + (x.tipo === "wdm" ? " ↔ " : " → ") + (b ? nombreNodo(b) : x.b);
    }
    if ((x = I.zonas[id])) return x.nombre || id;
    // demandas "Z-MADRID/residencial-fijo@CORE-1" -> "Madrid · residencial fijo"
    var m = /^(Z-[A-Z0-9-]+)\/([^@]+)(?:@(.+))?$/.exec(String(id));
    if (m) {
      var z = I.zonas[m[1]];
      return (z ? z.nombre : m[1]) + " · " + m[2].replace(/-/g, " ") + (opc && opc.largo && m[3] && I.nodos[m[3]] ? " → " + nombreNodo(I.nodos[m[3]]) : "");
    }
    return String(id);
  };
  // HTML: nombre corto con el id en title (y visible solo en experto)
  API.nombreHTML = function (id) {
    var c = API.nombreCorto(id);
    if (c === id) return '<span class="mono">' + esc(id) + '</span>';
    return '<span class="nc" title="' + esc(id) + '">' + esc(c) + '</span><span class="nc-id mono solo-experto">' + esc(id) + '</span>';
  };

  // ---------- color: una sola semántica ----------
  var RESERVA = { ok: "#30a46c", min: "#f5c518", maj: "#f76b15", crit: "#e5484d", wrn: "#3e9bff", unk: "#6e6e6e",
    movil: "#3987e5", ftth: "#d95926", voz: "#199e70", urllc: "#c98500", iot: "#d55181", empresa: "#0ca30c", evento: "#9085e9", ntn: "#e66767",
    doc: "#d9d9d9", sup: "#9085e9", calc: "#858585", usr: "#f2f2f2", tx1: "#ececec", tx2: "#a6a6a6", tx3: "#858585", line: "#222", line2: "#333", bg0: "#000", bg1: "#0b0b0b" };
  var cacheTok = {};
  function tok(nombre) {
    if (cacheTok[nombre]) return cacheTok[nombre];
    var v = "";
    try { v = getComputedStyle(document.documentElement).getPropertyValue("--" + nombre).trim(); } catch (e) { v = ""; }
    var sv = /^sv-/.test(nombre) ? RESERVA[nombre.slice(3)] : RESERVA[nombre];
    if (v) cacheTok[nombre] = v;
    return v || sv || "#888";
  }
  var SV_ALIAS = { embb: "movil", "eMBB": "movil", URLLC: "urllc", v2x: "urllc", mMTC: "iot", "fijo-bng": "ftth", l2vpn: "empresa", sat: "ntn", ims: "voz" };
  function sev(x) {
    if (x == null) return "unk";
    if (typeof x === "string") { var s = x.toLowerCase(); return s === "down" || s === "caido" ? "unk" : (RESERVA[s] && ["ok", "min", "maj", "crit", "wrn", "unk"].indexOf(s) >= 0 ? s : "unk"); }
    if (typeof x === "boolean") return x ? "ok" : "crit";
    if (esNum(x)) return x > 1.0001 ? "crit" : x >= 0.85 ? "maj" : x >= 0.6 ? "min" : "ok";
    if (typeof x === "object") {
      if (x.caido) return "unk";
      if (typeof x.cumple === "boolean") return x.cumple ? "ok" : "crit";
      var n = N(), o = n.ocupacion ? n.ocupacion(x) : x.ocupacion;
      return esNum(o) ? sev(o) : "unk";
    }
    return "unk";
  }
  API.color = {
    tok: tok,
    sev: sev,
    estado: function (x) { return tok(sev(x)); },
    servicio: function (k) { k = SV_ALIAS[k] || String(k || "").toLowerCase(); k = SV_ALIAS[k] || k; return tok("sv-" + k); },
    dato: function (tipo) {
      var k = { documento: "doc", entrega2: "doc", anterior: "doc", supuesto: "sup", calculado: "calc", usuario: "usr" }[tipo] || tipo;
      return k === "usr" ? RESERVA.usr : tok(k);
    }
  };
  var SEV_TXT = { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT", wrn: "WRN", unk: "DOWN" };
  // Insignia de estado con icono + texto corto (nunca solo color)
  API.textoEstado = function (s, txt) {
    s = SEV_TXT[s] ? s : sev(s);
    return '<span class="est est-' + s + '">' + API.icono(s === "unk" ? "down" : s, 14) + '<b>' + esc(txt || SEV_TXT[s]) + '</b></span>';
  };

  // ---------- glosario de siglas (Revisión 12, dueño ACCESIBLE): una línea por sigla ----------
  // NOC.info("BNG") devuelve la definición; un ⓘ con texto libre añade al final las siglas que mencione (máx. 3).
  // Cualquier elemento cuyo texto sea solo una sigla del glosario muestra su definición al pasar o enfocar.
  API.glosario = {
    "BNG": { es: "Broadband Network Gateway: puerta de los clientes de fibra (FTTH) hacia la red.", en: "Broadband Network Gateway: entry point of fibre (FTTH) customers to the network." },
    "UPF": { es: "User Plane Function (5G): nodo por el que pasa el tráfico de datos móviles.", en: "User Plane Function (5G): node that carries mobile data traffic." },
    "IMS": { es: "IP Multimedia Subsystem: núcleo que da la voz (VoNR, VoLTE, fija).", en: "IP Multimedia Subsystem: core that provides voice (VoNR, VoLTE, fixed)." },
    "PON": { es: "Passive Optical Network: fibra compartida con divisores pasivos hasta las casas.", en: "Passive Optical Network: shared fibre with passive splitters to homes." },
    "XGS-PON": { es: "PON de 10 Gbit/s simétricos (ITU-T G.9807.1).", en: "Symmetric 10 Gbit/s PON (ITU-T G.9807.1)." },
    "OLT": { es: "Optical Line Terminal: cabecera de la PON en la central.", en: "Optical Line Terminal: PON head-end in the central office." },
    "ONT": { es: "Optical Network Terminal: equipo de fibra en casa del cliente.", en: "Optical Network Terminal: fibre box at the customer's home." },
    "λ": { es: "Lambda: una longitud de onda (un canal) en la fibra DWDM.", en: "Lambda: one wavelength (one channel) on the DWDM fibre." },
    "DWDM": { es: "Multiplexación densa por longitud de onda: muchas λ por una fibra.", en: "Dense wavelength-division multiplexing: many λ on one fibre." },
    "WDM": { es: "Multiplexación por longitud de onda: varias λ por una fibra.", en: "Wavelength-division multiplexing: several λ on one fibre." },
    "LAG": { es: "Link Aggregation Group: varios enlaces físicos que funcionan como uno.", en: "Link Aggregation Group: several physical links working as one." },
    "FRR": { es: "Fast ReRoute: desvío del tráfico en < 50 ms si cae un enlace.", en: "Fast ReRoute: traffic is diverted in < 50 ms if a link fails." },
    "N-1": { es: "Prueba N-1: se quita un elemento cada vez y se mira si la red aguanta.", en: "N-1 test: remove one element at a time and check the network copes." },
    "SLA": { es: "Service Level Agreement: lo comprometido (disponibilidad, retardo).", en: "Service Level Agreement: what is promised (availability, delay)." },
    "URLLC": { es: "Comunicaciones ultra fiables y de muy bajo retardo (V2X, industria).", en: "Ultra-reliable low-latency communications (V2X, industry)." },
    "eMBB": { es: "Banda ancha móvil mejorada: datos del móvil.", en: "Enhanced mobile broadband: mobile data." },
    "mMTC": { es: "Comunicaciones masivas de máquinas: sensores IoT.", en: "Massive machine-type communications: IoT sensors." },
    "NTN": { es: "Non-Terrestrial Network: acceso por satélite.", en: "Non-Terrestrial Network: satellite access." },
    "L2VPN": { es: "Red privada virtual de nivel 2 para empresas.", en: "Layer-2 virtual private network for businesses." },
    "IX": { es: "Internet Exchange: punto de intercambio con otras redes e Internet.", en: "Internet Exchange: peering point with other networks and the Internet." },
    "DC": { es: "Data Centre: centro de datos del núcleo de la red.", en: "Data centre of the network core." },
    "MEC": { es: "Multi-access Edge Computing: servidores cerca del usuario (borde).", en: "Multi-access Edge Computing: servers close to the user (edge)." },
    "HC": { es: "Hora cargada: la hora del día con más tráfico.", en: "Busy hour: the hour of the day with most traffic." },
    "BH": { es: "Busy hour (hora cargada): la hora del día con más tráfico.", en: "Busy hour: the hour of the day with most traffic." },
    "V2X": { es: "Comunicación vehículo con todo (coches, semáforos).", en: "Vehicle-to-everything communication." },
    "VoNR": { es: "Voz sobre 5G (New Radio).", en: "Voice over 5G New Radio." },
    "AMF": { es: "Access and Mobility Function (5G): registro y movilidad de los móviles.", en: "Access and Mobility Function (5G): device registration and mobility." },
    "SMF": { es: "Session Management Function (5G): abre y gestiona las sesiones de datos.", en: "Session Management Function (5G): sets up data sessions." },
    "PCF": { es: "Policy Control Function (5G): reglas de calidad y tarificación.", en: "Policy Control Function (5G): QoS and charging rules." },
    "UDM": { es: "Unified Data Management (5G): datos de los abonados.", en: "Unified Data Management (5G): subscriber data." },
    "NRF": { es: "Network Repository Function (5G): directorio de funciones del núcleo.", en: "Network Repository Function (5G): core function directory." },
    "NSSF": { es: "Network Slice Selection Function (5G): elige la slice.", en: "Network Slice Selection Function (5G): picks the slice." },
    "OTN": { es: "Optical Transport Network: transporte óptico con contenedores (ITU-T G.709).", en: "Optical Transport Network: optical transport with containers (ITU-T G.709)." },
    "MPLS": { es: "Conmutación por etiquetas: encamina el tráfico por túneles.", en: "Label switching: routes traffic through tunnels." },
    "SR": { es: "Segment Routing: el camino va escrito en la cabecera del paquete.", en: "Segment Routing: the path is written in the packet header." },
    "BFD": { es: "Detección rápida de fallo de enlace (milisegundos).", en: "Bidirectional Forwarding Detection: fast link-failure detection." },
    "SRLG": { es: "Grupo de enlaces con riesgo compartido (misma zanja o conducto).", en: "Shared Risk Link Group (same trench or duct)." },
    "KPI": { es: "Indicador clave: una cifra que resume el estado.", en: "Key performance indicator." },
    "DL": { es: "Downlink: tráfico de bajada (red → usuario).", en: "Downlink: network → user traffic." },
    "UL": { es: "Uplink: tráfico de subida (usuario → red).", en: "Uplink: user → network traffic." },
    "PE": { es: "Provider Edge: router de borde del operador.", en: "Provider Edge router." },
    "IMS-EJ": { es: "Ejercicio IMS de la asignatura ARCO.", en: "IMS exercise from the ARCO course." },
    "REF": { es: "Referencia: la red exactamente como la Entrega 2 (v7), solo lectura.", en: "Reference: the network exactly as Deliverable 2 (v7), read-only." },
    "LAB": { es: "Laboratorio: puedes cambiar caso, hora, fallos y modelo.", en: "Laboratory: you can change case, hour, faults and model." }
  };
  function definicion(k) {
    var g = API.glosario, d = g[k] || g[String(k).toUpperCase()];
    return d ? t(d) : "";
  }
  API.definicion = definicion;
  // siglas mencionadas en un texto (palabras completas), en orden de aparición
  function siglasEn(tx) {
    var out = [];
    String(tx || "").split(/[^\wλ\-]+/u).forEach(function (w) {
      if (w && w !== "DC" && API.glosario[w] && out.indexOf(w) < 0) out.push(w);
    });
    return out;
  }
  API.siglasEn = siglasEn;
  // <abbr> con definición en la burbuja (para rótulos de siglas)
  API.sigla = function (k) {
    var d = definicion(k);
    return d ? '<abbr class="sigla" tabindex="0" data-tip="' + esc(k + ": " + d) + '">' + esc(k) + '</abbr>' : esc(k);
  };

  // ---------- ⓘ: explicaciones fuera de la pantalla ----------
  API.info = function (texto, opc) {
    var tx = t(texto);
    if (!tx) return "";
    opc = opc || {};
    if (typeof texto === "string" && API.glosario[texto]) tx = texto + ": " + definicion(texto);
    else if (opc.glosario !== false) {
      var ss = siglasEn(tx).slice(0, 3);
      if (ss.length) tx += "\n" + ss.map(function (s) { return s + ": " + definicion(s); }).join("\n");
    }
    return '<button type="button" class="info-b' + (opc.clase ? " " + opc.clase : "") + '" data-tip="' + esc(tx) + '" aria-label="' + esc(t({ es: "Información: ", en: "Information: " }) + tx) + '">' +
      API.icono("info", 14) + (opc.etiqueta ? '<span>' + esc(t(opc.etiqueta)) + '</span>' : '') + '</button>';
  };
  var burbuja = null, ancla = null, fijada = false;
  function crearBurbuja() {
    if (burbuja) return burbuja;
    burbuja = document.createElement("div");
    burbuja.className = "noc-burbuja"; burbuja.id = "noc-burbuja"; burbuja.setAttribute("role", "tooltip"); burbuja.hidden = true;
    document.body.appendChild(burbuja);
    return burbuja;
  }
  // texto de una sigla del glosario si el elemento solo contiene esa sigla (p. ej. <th>BNG</th>, <text>UPF</text>)
  function siglaDe(el) {
    if (!el || el.nodeType !== 1 || el.children.length || el.closest("[data-tip], input, select, textarea, .noc-burbuja")) return "";
    var s = (el.textContent || "").trim();
    if (!s || s.length > 8) return "";
    var d = definicion(s);
    return d ? s + ": " + d : "";
  }
  function mostrar(el, fijar, txFijo) {
    var tx = txFijo || el.getAttribute("data-tip");
    if (!tx) return;
    var b = crearBurbuja();
    if (ancla && ancla !== el) ancla.removeAttribute("aria-describedby");
    ancla = el; fijada = !!fijar;
    b.textContent = tx;
    b.hidden = false;
    el.setAttribute("aria-describedby", "noc-burbuja");
    var r = el.getBoundingClientRect(), bw = Math.min(320, W.innerWidth - 16);
    b.style.maxWidth = bw + "px";
    b.style.left = "0px"; b.style.top = "0px";
    var w = b.offsetWidth, h = b.offsetHeight;
    var x = Math.max(8, Math.min(W.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var y = r.top - h - 8;
    if (y < 8) y = r.bottom + 8;
    b.style.left = Math.round(x) + "px"; b.style.top = Math.round(y) + "px";
  }
  function ocultar() {
    if (burbuja) burbuja.hidden = true;
    if (ancla) ancla.removeAttribute("aria-describedby");
    ancla = null; fijada = false;
  }
  API.ocultarBurbuja = ocultar;
  document.addEventListener("mouseover", function (ev) {
    var el = ev.target.closest && ev.target.closest("[data-tip]");
    if (el && el !== ancla) mostrar(el, false);
    else if (!el) {
      var sg = siglaDe(ev.target);
      if (sg && ev.target !== ancla) { mostrar(ev.target, false, sg); return; }
      if (!sg && ancla && !fijada) ocultar();
    }
  });
  document.addEventListener("focusin", function (ev) { var el = ev.target.closest && ev.target.closest("[data-tip]"); if (el) mostrar(el, false); });
  document.addEventListener("focusout", function (ev) { if (ancla && ev.target === ancla && !fijada) ocultar(); });
  document.addEventListener("click", function (ev) {
    var nv = ev.target.closest && ev.target.closest("[data-nivel]");
    if (nv) { API.setNivel(nv.getAttribute("data-nivel")); return; }
    var el = ev.target.closest && ev.target.closest(".info-b");
    if (el) { ev.preventDefault(); ev.stopPropagation(); if (ancla === el && fijada) ocultar(); else mostrar(el, true); return; }
    if (fijada) ocultar();
  }, true);
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && ancla) ocultar(); });
  W.addEventListener("scroll", function () { if (ancla && !fijada) ocultar(); }, true);

  // ---------- medidor ----------
  var UMB_OCUP = [{ hasta: 0.6, sev: "ok" }, { hasta: 0.85, sev: "min" }, { hasta: 1.0001, sev: "maj" }, { hasta: Infinity, sev: "crit" }];
  function sevUmbral(v, umb) {
    for (var i = 0; i < umb.length; i++) if (v < umb[i].hasta) return umb[i].sev;
    return umb.length ? umb[umb.length - 1].sev : "unk";
  }
  // valor en las unidades de max (p. ej. ocupación 0,45 con max 1 y escala 100 -> "45,0 %")
  API.medidor = function (valor, o) {
    o = o || {};
    var min = esNum(o.min) ? o.min : 0, max = esNum(o.max) ? o.max : 1, esc_ = esNum(o.escala) ? o.escala : (max === 1 && o.unidad === "%" ? 100 : 1);
    var umb = o.umbrales || (max === 1 ? UMB_OCUP : []);
    var hay = esNum(valor);
    var s = o.estado || (hay ? (umb.length ? sevUmbral(valor, umb) : "ok") : "unk");
    var dec = esNum(o.dec) ? o.dec : 1;
    var vtx = o.texto != null ? String(o.texto) : (hay ? fmt(valor * esc_, dec) : "—");
    var un = o.unidad || "";
    var f = hay ? Math.max(0, Math.min(1, (valor - min) / (max - min || 1))) : 0;
    var col = "var(--" + s + ")";
    var et = o.etiqueta ? t(o.etiqueta) : "";
    var aria = (et ? et + ": " : "") + vtx + (un ? " " + un : "") + " · " + SEV_TXT[s] + (esNum(o.objetivo) ? " · " + t({ es: "objetivo ", en: "target " }) + fmt(o.objetivo * esc_, dec) + (un ? " " + un : "") : "");
    var svg;
    if (o.tipo === "arco") {
      var R = 40, cx = 50, cy = 48, a0 = Math.PI, a1 = Math.PI * (1 - f);
      var pt = function (a) { return (cx + R * Math.cos(a)).toFixed(2) + " " + (cy - R * Math.sin(a)).toFixed(2); };
      var ticks = umb.filter(function (u) { return esNum(u.hasta) && u.hasta > min && u.hasta < max; }).map(function (u) {
        var a = Math.PI * (1 - (u.hasta - min) / (max - min)), c = Math.cos(a), sn = Math.sin(a);
        return '<path d="M' + (cx + (R - 7) * c).toFixed(1) + ' ' + (cy - (R - 7) * sn).toFixed(1) + 'L' + (cx + (R + 7) * c).toFixed(1) + ' ' + (cy - (R + 7) * sn).toFixed(1) + '" class="md-tick"/>';
      }).join("");
      var obj = esNum(o.objetivo) && o.objetivo > min && o.objetivo < max ? (function () {
        var a = Math.PI * (1 - (o.objetivo - min) / (max - min)), c = Math.cos(a), sn = Math.sin(a);
        return '<path d="M' + (cx + (R - 9) * c).toFixed(1) + ' ' + (cy - (R - 9) * sn).toFixed(1) + 'L' + (cx + (R + 9) * c).toFixed(1) + ' ' + (cy - (R + 9) * sn).toFixed(1) + '" class="md-obj"/>';
      })() : "";
      svg = '<svg class="md-arco" viewBox="0 0 100 56" aria-hidden="true">' +
        '<path d="M' + pt(a0) + ' A' + R + ' ' + R + ' 0 0 1 ' + pt(0) + '" class="md-pista" fill="none"/>' +
        (f > 0.001 ? '<path d="M' + pt(a0) + ' A' + R + ' ' + R + ' 0 0 1 ' + pt(a1) + '" fill="none" style="stroke:' + col + '" class="md-valor"/>' : '') +
        ticks + obj + '</svg>';
      return '<span class="medidor md-tipo-arco" role="img" aria-label="' + esc(aria) + '">' + svg +
        '<span class="md-centro"><span class="md-v">' + esc(vtx) + (un ? '<small>' + esc(un) + '</small>' : '') + '</span>' + API.textoEstado(s, o.estadoTexto) + '</span>' +
        (et ? '<span class="md-et">' + esc(et) + '</span>' : '') + '</span>';
    }
    var Wd = o.ancho || 200, H = 10;
    var tk = umb.filter(function (u) { return esNum(u.hasta) && u.hasta > min && u.hasta < max; }).map(function (u) {
      var x = ((u.hasta - min) / (max - min) * Wd).toFixed(1);
      return '<path d="M' + x + ' 0V' + (H + 4) + '" class="md-tick"/>';
    }).join("");
    var ob = esNum(o.objetivo) && o.objetivo >= min && o.objetivo <= max ? '<path d="M' + ((o.objetivo - min) / (max - min) * Wd).toFixed(1) + ' -2V' + (H + 5) + '" class="md-obj"/>' : "";
    var sobre = hay && valor > max ? '<rect x="' + (Wd - 6) + '" y="0" width="6" height="' + H + '" fill="url(#md-rayado)"/>' : "";
    svg = '<svg class="md-barra" viewBox="0 -3 ' + Wd + ' ' + (H + 9) + '" preserveAspectRatio="none" aria-hidden="true">' +
      (sobre ? '<defs><pattern id="md-rayado" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="4" fill="#000"/></pattern></defs>' : '') +
      '<rect x="0" y="0" width="' + Wd + '" height="' + H + '" class="md-pista"/>' +
      (f > 0 ? '<rect x="0" y="0" width="' + (f * Wd).toFixed(1) + '" height="' + H + '" style="fill:' + col + '"/>' : '') + sobre + tk + ob + '</svg>';
    return '<span class="medidor md-tipo-barra" role="img" aria-label="' + esc(aria) + '">' +
      '<span class="md-cab">' + (et ? '<span class="md-et">' + esc(et) + '</span>' : '') + '<span class="md-v">' + esc(vtx) + (un ? '<small>' + esc(un) + '</small>' : '') + '</span>' + API.textoEstado(s, o.estadoTexto) + '</span>' +
      svg + '</span>';
  };

  // ---------- donut (partes de un todo; ≤ 8 categorías fijas, leyenda siempre) ----------
  // partes: [{clave, valor, etiqueta, color?}] ; opc: {tam, centro, sub, unidad, dec}
  API.donut = function (partes, opc) {
    opc = opc || {};
    var tam = opc.tam || 120, R = 46, r = 30, cx = 60, cy = 60;
    var L = (partes || []).filter(function (p) { return esNum(p.valor) && p.valor > 0; });
    var tot = L.reduce(function (s, p) { return s + p.valor; }, 0);
    if (!(tot > 0)) return '<div class="donut vacio-g">' + esc(t({ es: "Sin carga", en: "No load" })) + '</div>';
    var a = -Math.PI / 2, gap = L.length > 1 ? 0.025 : 0, arcos = "";
    L.forEach(function (p) {
      var da = p.valor / tot * Math.PI * 2, a0 = a + gap / 2, a1 = a + da - gap / 2;
      if (a1 <= a0) { a += da; return; }
      var big = a1 - a0 > Math.PI ? 1 : 0;
      var P = function (rr, an) { return (cx + rr * Math.cos(an)).toFixed(2) + " " + (cy + rr * Math.sin(an)).toFixed(2); };
      var d = L.length === 1 ? "M" + P(R, -Math.PI / 2) + " A" + R + " " + R + " 0 1 1 " + P(R, Math.PI * 1.4999) + " L" + P(r, Math.PI * 1.4999) + " A" + r + " " + r + " 0 1 0 " + P(r, -Math.PI / 2) + "Z"
        : "M" + P(R, a0) + " A" + R + " " + R + " 0 " + big + " 1 " + P(R, a1) + " L" + P(r, a1) + " A" + r + " " + r + " 0 " + big + " 0 " + P(r, a0) + "Z";
      var pct = p.valor / tot * 100;
      arcos += '<path d="' + d + '" style="fill:' + (p.color || API.color.servicio(p.clave)) + '" tabindex="0" data-tip="' + esc(t(p.etiqueta) + ": " + fmt(p.valor, opc.dec != null ? opc.dec : 1) + (opc.unidad ? " " + opc.unidad : "") + " · " + fmt(pct, 0) + " %") + '"/>';
      a += da;
    });
    var ley = L.slice().sort(function (x, y) { return y.valor - x.valor; }).map(function (p) {
      return '<li><i style="background:' + (p.color || API.color.servicio(p.clave)) + '"></i><span>' + esc(t(p.etiqueta)) + '</span><b>' + fmt(p.valor / tot * 100, 0) + ' %</b></li>';
    }).join("");
    return '<div class="donut"><svg width="' + tam + '" height="' + tam + '" viewBox="0 0 120 120" role="img" aria-label="' + esc(t(opc.titulo || { es: "Reparto", en: "Breakdown" })) + '">' + arcos +
      (opc.centro != null ? '<text x="60" y="' + (opc.sub ? 60 : 65) + '" class="dn-c">' + esc(opc.centro) + '</text>' : '') +
      (opc.sub ? '<text x="60" y="76" class="dn-s">' + esc(opc.sub) + '</text>' : '') + '</svg><ul class="dn-ley">' + ley + '</ul></div>';
  };

  // ---------- curva (una serie en el tiempo; umbrales en línea fina, cursor opcional) ----------
  // valores: array de números; opc: {xs (minutos), max, umbrales:[valor], cursor (índice), ancho, alto, unidad, etiquetaX(i)}
  API.curva = function (vals, opc) {
    opc = opc || {};
    var V = Array.prototype.map.call(vals || [], function (v) { return esNum(v) ? v : null; });   // también Float32Array (serie del reloj)
    if (!V.length) return "";
    var Wd = opc.ancho || 300, H = opc.alto || 70, pl = 28, pb = 14, pt = 4;
    var mx = Math.max(opc.max || 0, Math.max.apply(null, V.filter(function (v) { return v != null; }).concat([0]))) * 1.05 || 1;
    var X = function (i) { return pl + (V.length > 1 ? i / (V.length - 1) : 0) * (Wd - pl - 4); };
    var Y = function (v) { return pt + (1 - v / mx) * (H - pt - pb); };
    var d = "", area = "", empezado = false;
    V.forEach(function (v, i) { if (v == null) { empezado = false; return; } d += (empezado ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); empezado = true; });
    var ini = V.findIndex(function (v) { return v != null; }), fin = V.length - 1 - V.slice().reverse().findIndex(function (v) { return v != null; });
    if (ini >= 0) area = d + "L" + X(fin).toFixed(1) + " " + Y(0).toFixed(1) + "L" + X(ini).toFixed(1) + " " + Y(0).toFixed(1) + "Z";
    var um = (opc.umbrales || []).filter(function (u) { return u < mx; }).map(function (u) {
      return '<path d="M' + pl + ' ' + Y(u).toFixed(1) + 'H' + (Wd - 4) + '" class="cv-umb"/><text x="' + (pl - 3) + '" y="' + (Y(u) + 3).toFixed(1) + '" class="cv-ej">' + fmt(u, 0) + '</text>';
    }).join("");
    var c = esNum(opc.cursor) && V[opc.cursor] != null ? '<path d="M' + X(opc.cursor).toFixed(1) + ' ' + pt + 'V' + (H - pb) + '" class="cv-cur"/><circle cx="' + X(opc.cursor).toFixed(1) + '" cy="' + Y(V[opc.cursor]).toFixed(1) + '" r="4" class="cv-pt"/>' : "";
    var ejes = [0, 6, 12, 18, 24].map(function (h) {
      var i = Math.round(h / 24 * (V.length - (V.length % 24 === 0 ? 0 : 1)));
      var x = pl + h / 24 * (Wd - pl - 4);
      return '<text x="' + x.toFixed(1) + '" y="' + (H - 2) + '" class="cv-ej cv-ejx">' + (h < 10 ? "0" : "") + h + '</text>';
    }).join("");
    // zonas de hover por punto
    var hits = V.map(function (v, i) {
      if (v == null) return "";
      var w = (Wd - pl - 4) / Math.max(1, V.length - 1);
      var lab = opc.etiquetaX ? opc.etiquetaX(i) : String(i);
      return '<rect x="' + (X(i) - w / 2).toFixed(1) + '" y="0" width="' + w.toFixed(1) + '" height="' + H + '" fill="transparent" data-tip="' + esc(lab + " · " + fmt(v, 1) + (opc.unidad ? " " + opc.unidad : "")) + '"/>';
    }).join("");
    return '<svg class="curva" viewBox="0 0 ' + Wd + ' ' + H + '" role="img" aria-label="' + esc(t(opc.titulo || { es: "Curva de 24 h", en: "24 h curve" })) + '">' +
      '<path d="M' + pl + ' ' + Y(0).toFixed(1) + 'H' + (Wd - 4) + '" class="cv-base"/>' + um +
      '<path d="' + area + '" class="cv-area"/><path d="' + d + '" class="cv-linea"/>' + c + ejes + hits + '</svg>';
  };

  // ---------- camino dibujado (nodos con icono por tipo unidos por enlaces coloreados por ocupación) ----------
  // ids: [nodo, enlace, nodo, enlace, nodo…] o {nodos:[…], enlaces:[…]} ; opc: {resultado}
  API.camino = function (ids, opc) {
    opc = opc || {};
    var I = idx(), n = N(), res = opc.resultado || n.resultado || {};
    var nodos = Array.isArray(ids) ? ids.filter(function (x) { return I.nodos[x]; }) : (ids.nodos || []);
    var enl = Array.isArray(ids) ? ids.filter(function (x) { return I.enlaces[x]; }) : (ids.enlaces || []);
    if (nodos.length < 2) return "";
    var paso = 96, Wd = (nodos.length - 1) * paso + 60, H = 70, y = 22;
    var h = "";
    enl.forEach(function (eid, i) {
      if (i >= nodos.length - 1) return;
      var r = (res.enlaces || {})[eid], s = sev(r), x0 = 30 + i * paso + 14, x1 = 30 + (i + 1) * paso - 14;
      var caido = r && r.caido;
      var o = n.ocupacion ? n.ocupacion(r) : null;
      h += '<g data-tip="' + esc(API.nombreCorto(eid) + " · " + (caido ? "DOWN" : (esNum(o) ? fmt(o * 100, 1) + " %" : "—"))) + '" tabindex="0" class="cm-enl" data-sel="enlace" data-id="' + esc(eid) + '">' +
        '<rect x="' + x0 + '" y="' + (y - 8) + '" width="' + (x1 - x0) + '" height="16" fill="transparent"/>' +
        '<path d="M' + x0 + ' ' + y + 'H' + x1 + '" style="stroke:' + tok(s) + '" stroke-width="3"' + (caido ? ' stroke-dasharray="4 3"' : '') + '/>' +
        '<text x="' + ((x0 + x1) / 2) + '" y="' + (y - 6) + '" class="cm-pct">' + (caido ? "DOWN" : esNum(o) ? fmt(o * 100, 0) + " %" : "") + '</text></g>';
    });
    nodos.forEach(function (nid, i) {
      var x = 30 + i * paso, nd = I.nodos[nid], r = (res.nodos || {})[nid], caido = r && r.caido;
      h += '<g class="cm-nodo' + (caido ? " caido" : "") + '" data-sel="nodo" data-id="' + esc(nid) + '" tabindex="0" data-tip="' + esc(nid + " · " + (nd.nombre || "")) + '">' +
        '<rect x="' + (x - 13) + '" y="' + (y - 13) + '" width="26" height="26" class="cm-caja"/>' +
        '<g transform="translate(' + (x - 9) + ' ' + (y - 9) + ')">' + API.icono(nd.tipo, 18).replace('<svg ', '<svg x="0" y="0" ') + '</g>' +
        '<text x="' + x + '" y="' + (y + 28) + '" class="cm-et">' + esc(API.nombreCorto(nid)) + '</text></g>';
    });
    return '<svg class="camino" viewBox="0 0 ' + Wd + ' ' + H + '" style="max-width:' + Wd + 'px" role="img" aria-label="' + esc(t({ es: "Camino: ", en: "Path: " }) + nodos.map(API.nombreCorto).join(" → ")) + '">' + h + '</svg>';
  };

  // =====================================================================================================
  // Accesibilidad (Revisión 12, dueño ACCESIBLE)
  //   NOC.accesibilidad = { texto: 100|125|150, contraste, daltonismo, menosMov, tema: "oscuro"|"claro"|"sistema", voz,
  //     set(clave, valor), alCambiar(fn(estado)), resumen() → frase, leerResumen(), abrir(), cerrar(), atajos(), boton() }
  //   Clases en <html> y <body>: txt-125 / txt-150, alto-contraste, daltonismo, menos-mov, tema-claro (los tokens se
  //   redefinen en :root.<clase> en noc.css). Evento DOM "noc-accesibilidad" en document (detail = estado).
  //   localStorage["noc.acc"] (JSON, try/catch). menosMov = null → sigue prefers-reduced-motion.
  // =====================================================================================================
  var ACC_K = "noc.acc";
  var mqMov = W.matchMedia ? W.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var mqClaro = W.matchMedia ? W.matchMedia("(prefers-color-scheme: light)") : null;
  var ACC_DEF = { texto: 100, contraste: false, daltonismo: false, menosMov: null, tema: "oscuro", voz: false };
  var accEst = (function () {
    var o = {}, g = null;
    try { g = JSON.parse(leer(ACC_K) || "null"); } catch (e) { g = null; }
    Object.keys(ACC_DEF).forEach(function (k) { o[k] = g && g[k] !== undefined ? g[k] : ACC_DEF[k]; });
    if ([100, 125, 150].indexOf(Number(o.texto)) < 0) o.texto = 100;
    o.texto = Number(o.texto);
    if (["oscuro", "claro", "sistema"].indexOf(o.tema) < 0) o.tema = "oscuro";
    return o;
  })();
  var oyAcc = [];
  function menosMovEf() { return accEst.menosMov == null ? !!(mqMov && mqMov.matches) : !!accEst.menosMov; }
  function claroEf() { return accEst.tema === "claro" || (accEst.tema === "sistema" && !!(mqClaro && mqClaro.matches)); }
  function clasesAcc() {
    var z = accEst.texto / 100;
    [document.documentElement, document.body].forEach(function (el) {
      if (!el) return;
      el.classList.toggle("txt-125", accEst.texto === 125);
      el.classList.toggle("txt-150", accEst.texto === 150);
      el.classList.toggle("alto-contraste", !!accEst.contraste);
      el.classList.toggle("daltonismo", !!accEst.daltonismo);
      el.classList.toggle("menos-mov", menosMovEf());
      el.classList.toggle("tema-claro", claroEf());
    });
    document.documentElement.style.setProperty("--zoom", String(z));
    document.documentElement.setAttribute("data-tema", claroEf() ? "claro" : "oscuro");
  }
  function estadoPublico() {
    return { texto: accEst.texto, contraste: !!accEst.contraste, daltonismo: !!accEst.daltonismo, menosMov: menosMovEf(),
      menosMovSistema: accEst.menosMov == null, tema: claroEf() ? "claro" : "oscuro", temaElegido: accEst.tema, voz: !!accEst.voz };
  }
  var ACC = API.accesibilidad = {
    get texto() { return accEst.texto; },
    get contraste() { return !!accEst.contraste; },
    get daltonismo() { return !!accEst.daltonismo; },
    get menosMov() { return menosMovEf(); },
    get tema() { return claroEf() ? "claro" : "oscuro"; },
    get voz() { return !!accEst.voz; },
    estado: estadoPublico,
    alCambiar: function (fn) { if (typeof fn === "function") oyAcc.push(fn); },
    set: function (k, v) {
      if (!(k in ACC_DEF)) return;
      var antesColor = colorFirma();
      if (k === "texto") v = [100, 125, 150].indexOf(Number(v)) >= 0 ? Number(v) : 100;
      accEst[k] = v;
      guardar(ACC_K, JSON.stringify(accEst));
      clasesAcc();
      var e = estadoPublico();
      if (colorFirma() !== antesColor) repintarColores();
      if (k === "texto") setTimeout(function () { try { W.dispatchEvent(new Event("resize")); } catch (x) { /* nada */ } }, 30);
      oyAcc.forEach(function (fn) { try { fn(e); } catch (x) { console.error("NOC.accesibilidad", x); } });
      try { document.dispatchEvent(new CustomEvent("noc-accesibilidad", { detail: e })); } catch (x) { /* nada */ }
      pintarPanel();
    },
    restablecer: function () {
      Object.keys(ACC_DEF).forEach(function (k) { accEst[k] = ACC_DEF[k]; });
      ACC.set("texto", 100);
      repintarColores();
    }
  };
  function colorFirma() { return [accEst.contraste, accEst.daltonismo, claroEf()].join("|"); }
  // Los tokens cambian: vaciar la caché de NOC.color y repintar lo que pinta colores desde JS
  var recargaPend = false;
  function repintarColores() {
    cacheTok = {};
    var n = N();
    try { if (n.sv && n.sv._f) n.sv._f.forEach(function (fn) { fn(); }); } catch (e) { /* mapa */ }
    try { if (n.mostrarResultado && n.resultado) n.mostrarResultado(n.resultado, n.opciones, { reloj: true, accesibilidad: true }); } catch (e) { console.error(e); }
    // Vistas que leen los tokens una sola vez al montarse (plano unifilar, plano de demanda): se recarga la página
    // conservando el panel abierto, para que el color cambie de verdad "en todo".
    var fijas = document.querySelector("#vista-unifilar .uf-lienzo, #vista-demanda_mapa .leaflet-container");
    if (fijas && !recargaPend) {
      recargaPend = true;
      guardar("noc.acc.reabrir", "1");
      setTimeout(function () { try { location.reload(); } catch (e) { /* nada */ } }, 350);
    }
  }
  if (mqMov && mqMov.addEventListener) mqMov.addEventListener("change", function () { if (accEst.menosMov == null) { clasesAcc(); pintarPanel(); } });
  if (mqClaro && mqClaro.addEventListener) mqClaro.addEventListener("change", function () { if (accEst.tema === "sistema") { clasesAcc(); repintarColores(); } });
  clasesAcc();
  if (!document.body) document.addEventListener("DOMContentLoaded", clasesAcc);

  // ---------- resumen hablado (aria-live) ----------
  function vivo() {
    var v = document.getElementById("noc-vivo");
    if (!v && document.body) {
      v = document.createElement("div");
      v.id = "noc-vivo"; v.className = "sr-only"; v.setAttribute("role", "status"); v.setAttribute("aria-live", "polite"); v.setAttribute("aria-atomic", "true");
      document.body.appendChild(v);
    }
    return v;
  }
  function horaTxt(n) {
    var r = n.resultado || {}, op = n.opciones || {};
    if (r.paso_reloj && r.paso_reloj.etiqueta) return r.paso_reloj.etiqueta;
    if (esNum(op.hora)) return (op.hora < 10 ? "0" : "") + op.hora + ":00";
    return t({ es: "hora cargada", en: "busy hour" });
  }
  ACC.resumen = function () {
    var n = N(), r = n.resultado;
    if (!r) return t({ es: "Sin resultado del motor.", en: "No engine result." });
    var m = n.ocupacionMaxima ? n.ocupacionMaxima(r) : { o: null, id: null, sat: 0 };
    var s = r.resumen || {};
    var modo = n.modo === "lab" ? t({ es: "Laboratorio", en: "Laboratory" }) : t({ es: "Referencia", en: "Reference" });
    var p = [modo + ", " + horaTxt(n) + "."];
    if (m.o != null) p.push(t({ es: "Red al ", en: "Network at " }) + fmt(m.o * 100, 1) + " % " + t({ es: "en ", en: "on " }) + API.nombreCorto(m.id) + ".");
    var ps = s.pct_servida;
    if (esNum(ps)) p.push(ps >= 99.995 ? t({ es: "Todo servido.", en: "All traffic served." }) : t({ es: "Servido ", en: "Served " }) + fmt(ps, 2) + " %.");
    if (m.sat) p.push(m.sat + t({ es: " enlaces saturados.", en: " links saturated." }));
    var al = n.alarmas ? n.alarmas() : [], cr = al.filter(function (a) { return a.sev === "crit"; }).length, mj = al.filter(function (a) { return a.sev === "maj"; }).length;
    p.push(cr || mj ? t({ es: "Alarmas: ", en: "Alarms: " }) + [cr ? cr + " " + t({ es: "críticas", en: "critical" }) : "", mj ? mj + " " + t({ es: "mayores", en: "major" }) : ""].filter(Boolean).join(", ") + "." : t({ es: "Sin alarmas graves.", en: "No serious alarms." }));
    var fa = (n.opciones && n.opciones.fallos) || [];
    if (fa.length) p.push(fa.length + t({ es: fa.length === 1 ? " fallo activo." : " fallos activos.", en: fa.length === 1 ? " active fault." : " active faults." }));
    return p.join(" ");
  };
  var ultimoDicho = "";
  function anunciar(tx, forzar) {
    var v = vivo();
    if (!v || (!forzar && tx === ultimoDicho)) return;
    ultimoDicho = tx;
    v.textContent = "";
    setTimeout(function () { v.textContent = tx; }, 60);
    var pv = document.getElementById("acc-dicho");
    if (pv) pv.textContent = tx;
    if (accEst.voz && W.speechSynthesis && W.SpeechSynthesisUtterance) {
      try { W.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(tx); u.lang = lang() === "en" ? "en-GB" : "es-ES"; W.speechSynthesis.speak(u); } catch (e) { /* sin voz */ }
    }
  }
  API.anunciar = function (tx) { anunciar(t(tx), true); };
  ACC.leerResumen = function () { anunciar(ACC.resumen(), true); };
  // Al cambiar de caso u hora (no en cada repintado): firma del caso + hora, con espera para no hablar a cada paso del reloj
  var firmaCaso = null, tAnuncio = null;
  function firmaActual() {
    var n = N(), op = n.opciones || {}, r = n.resultado || {};
    return JSON.stringify([n.modo, op.modelo && op.modelo.id, op.modelo && op.modelo.anio, op.modelo && op.modelo.dia, op.hora, op.escenario, op.fallos, op.factores ? Object.keys(op.factores).length : 0, r.paso_reloj && r.paso_reloj.etiqueta]);
  }
  function alResultado(r, meta) {
    if (N().resultadoMeta && N().resultadoMeta.accesibilidad) return;
    var f = firmaActual();
    if (firmaCaso === null) { firmaCaso = f; return; }   // el primer cálculo no se anuncia
    if (f === firmaCaso) return;
    firmaCaso = f;
    clearTimeout(tAnuncio);
    tAnuncio = setTimeout(function () { anunciar(ACC.resumen(), false); }, 1200);
  }

  // ---------- botón y panel ----------
  var ICO_ACC = '<svg class="ico-n" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="6.6" r="1.4"/><path d="M6.8 9.6 12 10.6l5.2-1M12 10.6v3.6M12 14.2l-2.6 4.6M12 14.2l2.6 4.6"/></svg>';
  ACC.boton = function () {
    var ab = !!(panel && !panel.hidden);
    return '<button type="button" class="btn acc-btn" data-acc="panel" aria-haspopup="dialog" aria-expanded="' + ab + '" aria-controls="acc-panel" title="' +
      esc(t({ es: "Accesibilidad: texto, contraste, colores, movimiento", en: "Accessibility: text, contrast, colours, motion" })) + '">' + ICO_ACC +
      '<span class="acc-btn-tx">' + esc(t({ es: "Accesibilidad", en: "Accessibility" })) + '</span></button>';
  };
  var panel = null, focoPrevio = null;
  function interruptor(clave, txt, val, tip) {
    return '<div class="acc-fila"><span class="acc-et" id="acc-et-' + clave + '">' + esc(t(txt)) + '</span>' + (tip ? API.info(tip, { glosario: false }) : '') +
      '<button type="button" role="switch" class="acc-sw" data-acc-sw="' + clave + '" aria-checked="' + !!val + '" aria-labelledby="acc-et-' + clave + '">' +
      '<span class="acc-sw-p" aria-hidden="true"></span><span class="acc-sw-t">' + esc(val ? t({ es: "Sí", en: "On" }) : t({ es: "No", en: "Off" })) + '</span></button></div>';
  }
  function segmento(clave, txt, opciones, val) {
    return '<div class="acc-fila"><span class="acc-et" id="acc-et-' + clave + '">' + esc(t(txt)) + '</span>' +
      '<div class="seg acc-seg" role="group" aria-labelledby="acc-et-' + clave + '">' + opciones.map(function (o) {
        return '<button type="button" data-acc-set="' + clave + '" data-v="' + esc(o[0]) + '" aria-pressed="' + (String(val) === String(o[0])) + '"' + (o[2] ? ' title="' + esc(t(o[2])) + '"' : '') + '>' + o[1] + '</button>';
      }).join("") + '</div></div>';
  }
  function muestraEstados() {
    return '<div class="acc-muestra" aria-hidden="true">' + ["ok", "min", "maj", "crit", "unk"].map(function (s) {
      return '<span class="sev sev-' + s + '">' + SEV_TXT[s] + '</span>';
    }).join("") + '</div>';
  }
  function pintarPanel() {
    Array.prototype.forEach.call(document.querySelectorAll(".acc-btn"), function (b) { b.setAttribute("aria-expanded", String(!!(panel && !panel.hidden))); });
    if (!panel || panel.hidden) return;
    var e = estadoPublico();
    var ae = document.activeElement, foco = null;
    if (ae && panel.contains(ae)) foco = ae.getAttribute("data-acc-sw") || (ae.getAttribute("data-acc-set") ? ae.getAttribute("data-acc-set") + "=" + ae.getAttribute("data-v") : ae.getAttribute("data-acc"));
    panel.innerHTML =
      '<div class="acc-cab"><h2 id="acc-tit">' + ICO_ACC + esc(t({ es: "Accesibilidad", en: "Accessibility" })) + '</h2>' +
      '<button type="button" class="btn acc-x" data-acc="cerrar" aria-label="' + esc(t({ es: "Cerrar", en: "Close" })) + '" title="Esc">' + API.icono("cerrar", 14) + '</button></div>' +
      segmento("texto", { es: "Tamaño texto", en: "Text size" }, [[100, "100 %"], [125, "125 %"], [150, "150 %"]], e.texto) +
      interruptor("contraste", { es: "Alto contraste", en: "High contrast" }, e.contraste) +
      interruptor("daltonismo", { es: "Colores daltonismo", en: "Colour-blind palette" }, e.daltonismo,
        { es: "Paleta Okabe-Ito y una forma por estado: ● OK, ▲ MIN, ◆ MAJ, ■ CRIT, ✕ caído.", en: "Okabe-Ito palette and one shape per state: ● OK, ▲ MIN, ◆ MAJ, ■ CRIT, ✕ down." }) +
      muestraEstados() +
      interruptor("menosMov", { es: "Menos movimiento", en: "Reduce motion" }, e.menosMov,
        e.menosMovSistema ? { es: "Ahora sigue el ajuste del sistema.", en: "Now follows the system setting." } : null) +
      segmento("tema", { es: "Tema", en: "Theme" }, [["oscuro", esc(t({ es: "Oscuro", en: "Dark" }))], ["claro", esc(t({ es: "Claro", en: "Light" }))], ["sistema", esc(t({ es: "Sistema", en: "System" }))]], e.temaElegido) +
      '<div class="acc-fila acc-leer"><button type="button" class="btn prim" data-acc="leer">' + API.icono("play", 14) + esc(t({ es: "Leer resumen", en: "Read summary" })) + '</button>' +
      interruptor("voz", { es: "Voz", en: "Voice" }, e.voz, { es: "Además de avisar al lector de pantalla, lo dice en voz alta.", en: "Besides notifying the screen reader, it speaks aloud." }) + '</div>' +
      '<p class="acc-dicho" id="acc-dicho">' + esc(ultimoDicho) + '</p>' +
      '<div class="acc-pie"><button type="button" class="btn" data-acc="atajos"><kbd>?</kbd>' + esc(t({ es: "Atajos", en: "Shortcuts" })) + '</button>' +
      '<button type="button" class="btn" data-acc="restablecer">' + esc(t({ es: "Restablecer", en: "Reset" })) + '</button></div>';
    if (foco) {
      var f = panel.querySelector('[data-acc-sw="' + foco + '"]') || (foco.indexOf("=") > 0 ? panel.querySelector('[data-acc-set="' + foco.split("=")[0] + '"][data-v="' + foco.split("=")[1] + '"]') : null) || panel.querySelector('[data-acc="' + foco + '"]');
      if (f) f.focus();
    }
  }
  ACC.abrir = function () {
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "acc-panel"; panel.className = "acc-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false"); panel.setAttribute("aria-labelledby", "acc-tit");
      panel.hidden = true;
      document.body.appendChild(panel);
    }
    focoPrevio = document.activeElement;
    panel.hidden = false;
    pintarPanel();
    var p = panel.querySelector("[aria-pressed=true], [role=switch]");
    if (p) p.focus();
  };
  ACC.cerrar = function (devolver) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    pintarPanel();
    var b = document.querySelector(".acc-btn") || focoPrevio;
    if (devolver !== false && b && b.focus) b.focus();
  };
  ACC.alternar = function () { if (panel && !panel.hidden) ACC.cerrar(); else ACC.abrir(); };

  // ---------- atajos ("?") ----------
  var capa = null;
  var ATAJOS = [
    ["?", { es: "Esta ayuda", en: "This help" }],
    ["1 … 6", { es: "Espacios: Inicio, Red, Simulación, Análisis, Datos, Guía", en: "Workspaces: Home, Network, Simulation, Analysis, Data, Guide" }],
    ["/", { es: "Buscar un elemento", en: "Search an element" }],
    ["F", { es: "Simular fallo del elemento elegido", en: "Fail the selected element" }],
    ["L  [", { es: "Abrir o cerrar el carril", en: "Open or close the rail" }],
    ["]", { es: "Abrir o cerrar la ficha", en: "Open or close the detail panel" }],
    ["\\", { es: "Abrir o cerrar el panel inferior", en: "Open or close the bottom panel" }],
    ["← →", { es: "Reloj: hora anterior / siguiente (Simulación)", en: "Clock: previous / next hour (Simulation)" }],
    ["Esc", { es: "Cerrar panel, ficha o burbuja", en: "Close panel, detail or tooltip" }],
    ["Tab", { es: "Ir al siguiente control", en: "Next control" }],
    ["Alt + A", { es: "Panel de accesibilidad", en: "Accessibility panel" }],
    ["Alt + R", { es: "Leer resumen de la red", en: "Read network summary" }]
  ];
  ACC.atajos = function () {
    if (!capa) {
      capa = document.createElement("div");
      capa.className = "acc-capa"; capa.hidden = true;
      capa.innerHTML = '<div class="acc-atajos" role="dialog" aria-modal="true" aria-labelledby="acc-at-tit" tabindex="-1"></div>';
      document.body.appendChild(capa);
      capa.addEventListener("click", function (ev) { if (ev.target === capa) cerrarAtajos(); });
    }
    focoPrevio = document.activeElement;
    var siglas = Object.keys(API.glosario).filter(function (k) { return ["REF", "LAB", "IMS-EJ", "BH", "KPI"].indexOf(k) < 0; }).sort(function (a, b) { return a.localeCompare(b); });
    capa.firstChild.innerHTML = '<div class="acc-cab"><h2 id="acc-at-tit">' + esc(t({ es: "Atajos de teclado", en: "Keyboard shortcuts" })) + '</h2>' +
      '<button type="button" class="btn acc-x" data-acc="cerrar-atajos" aria-label="' + esc(t({ es: "Cerrar", en: "Close" })) + '">' + API.icono("cerrar", 14) + '</button></div>' +
      '<div class="acc-at-cols"><table class="acc-at-t"><caption class="sr-only">' + esc(t({ es: "Atajos de teclado", en: "Keyboard shortcuts" })) + '</caption><thead><tr><th scope="col">' + esc(t({ es: "Tecla", en: "Key" })) + '</th><th scope="col">' + esc(t({ es: "Acción", en: "Action" })) + '</th></tr></thead><tbody>' +
      ATAJOS.map(function (a) { return '<tr><th scope="row"><kbd>' + esc(a[0]) + '</kbd></th><td>' + esc(t(a[1])) + '</td></tr>'; }).join("") + '</tbody></table>' +
      '<div class="acc-glos"><h3>' + esc(t({ es: "Siglas", en: "Acronyms" })) + '</h3><dl>' + siglas.map(function (k) { return '<dt>' + esc(k) + '</dt><dd>' + esc(definicion(k)) + '</dd>'; }).join("") + '</dl></div></div>';
    capa.hidden = false;
    capa.firstChild.focus();
  };
  function cerrarAtajos() {
    if (!capa || capa.hidden) return;
    capa.hidden = true;
    if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
  }
  ACC.cerrarAtajos = cerrarAtajos;

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-acc], [data-acc-sw], [data-acc-set]");
    if (!b) {
      if (panel && !panel.hidden && !(ev.target.closest && ev.target.closest(".acc-panel, .noc-burbuja")) && document.documentElement.contains(ev.target)) ACC.cerrar(false);
      return;
    }
    var a = b.getAttribute("data-acc");
    if (a === "panel") ACC.alternar();
    else if (a === "cerrar") ACC.cerrar();
    else if (a === "leer") ACC.leerResumen();
    else if (a === "atajos") { ACC.cerrar(false); ACC.atajos(); }
    else if (a === "cerrar-atajos") cerrarAtajos();
    else if (a === "restablecer") ACC.restablecer();
    else if (b.hasAttribute("data-acc-sw")) { var k = b.getAttribute("data-acc-sw"); ACC.set(k, !(k === "menosMov" ? menosMovEf() : accEst[k])); }
    else if (b.hasAttribute("data-acc-set")) ACC.set(b.getAttribute("data-acc-set"), b.getAttribute("data-v"));
  });
  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target.tagName || "").toLowerCase(), escribiendo = tag === "input" || tag === "select" || tag === "textarea" || ev.target.isContentEditable;
    if (capa && !capa.hidden) {
      if (ev.key === "Escape" || ev.key === "?") { ev.preventDefault(); ev.stopPropagation(); cerrarAtajos(); return; }
      if (ev.key === "Tab") {   // foco atrapado en la capa
        var fs = capa.querySelectorAll("button, [tabindex='0']");
        if (fs.length) { var pr = fs[0], ul = fs[fs.length - 1]; if (ev.shiftKey && document.activeElement === pr) { ev.preventDefault(); ul.focus(); } else if (!ev.shiftKey && document.activeElement === ul) { ev.preventDefault(); pr.focus(); } }
      }
      return;
    }
    if (panel && !panel.hidden && ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); ACC.cerrar(); return; }
    if (ev.altKey && !ev.ctrlKey && !ev.metaKey && (ev.code === "KeyA" || ev.code === "KeyR")) {
      ev.preventDefault();
      if (ev.code === "KeyA") ACC.alternar(); else ACC.leerResumen();
      return;
    }
    if (escribiendo || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === "?") { ev.preventDefault(); ACC.atajos(); }
  }, true);

  // ---------- tablas: scope en cabeceras (todas las vistas, sin tocar su código) ----------
  function scopes(raiz) {
    if (!raiz || !raiz.querySelectorAll) return;
    Array.prototype.forEach.call(raiz.querySelectorAll("thead th:not([scope])"), function (th) { th.setAttribute("scope", "col"); });
    Array.prototype.forEach.call(raiz.querySelectorAll("tbody th:not([scope])"), function (th) { th.setAttribute("scope", "row"); });
  }
  var tScope = null;
  function vigilarTablas() {
    scopes(document.body);
    if (!W.MutationObserver) return;
    new MutationObserver(function () { if (tScope) return; tScope = setTimeout(function () { tScope = null; scopes(document.body); }, 250); })
      .observe(document.body, { childList: true, subtree: true });
  }

  // ---------- arranque (cuando app.js ya ha creado NOC y el shell) ----------
  function arrancarAcc() {
    clasesAcc(); vivo(); vigilarTablas();
    if (!document.querySelector(".saltar") && document.getElementById("principal")) {
      var sl = document.createElement("a");
      sl.className = "saltar"; sl.href = "#principal"; sl.textContent = t({ es: "Saltar al contenido", en: "Skip to content" });
      sl.addEventListener("click", function (ev) { ev.preventDefault(); var m = document.getElementById("principal"); if (m) m.focus(); });
      document.body.insertBefore(sl, document.body.firstChild);
    }
    var n = N();
    if (n.on) n.on("resultado", alResultado);
    if (n.on) n.on("lang", function () { pintarPanel(); });
    // si la barra no trae el botón (p. ej. app.js antiguo), se pone fijo arriba a la derecha
    setTimeout(function () {
      if (!document.querySelector(".acc-btn")) {
        var d = document.createElement("div"); d.className = "acc-fijo"; d.innerHTML = ACC.boton(); document.body.appendChild(d);
      }
    }, 0);
    if (leer("noc.acc.reabrir") === "1") { try { localStorage.removeItem("noc.acc.reabrir"); } catch (e) { /* nada */ } setTimeout(ACC.abrir, 300); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancarAcc); else setTimeout(arrancarAcc, 0);
})();
