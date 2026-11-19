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
    doc: "#d9d9d9", sup: "#9085e9", calc: "#707070", usr: "#f2f2f2", tx1: "#ececec", tx2: "#a6a6a6", tx3: "#707070", line: "#222", line2: "#333", bg0: "#000", bg1: "#0b0b0b" };
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

  // ---------- ⓘ: explicaciones fuera de la pantalla ----------
  API.info = function (texto, opc) {
    var tx = t(texto);
    if (!tx) return "";
    opc = opc || {};
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
  function mostrar(el, fijar) {
    var tx = el.getAttribute("data-tip");
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
    else if (!el && ancla && !fijada) ocultar();
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
})();
