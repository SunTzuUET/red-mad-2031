// anotar.js — globos con flecha anclados a elementos (CONTRATO_UI.md, Revisión 12, dueño PREGUNTAS).
// API:
//   NOC.anotar([{elem, texto, tipo, lado?}], {limpiar=true, grupo?}) → número de globos puestos
//     elem  = Element | selector CSS | {tipo:"nodo"|"enlace"|"zona", id} | {x, y} (px de la ventana)
//     tipo  = "info" (por defecto) | "ok" | "min" | "maj" | "crit" | "down" | "defensa" — el tipo de estado lleva su forma
//             (● ▲ ◆ ■ ✕) además del color: nunca solo color.
//     lado  = "n" | "s" | "e" | "o" (opcional; si no, se busca el hueco libre)
//   NOC.limpiarAnotaciones(grupo?) — sin grupo quita todas.
//   NOC.posicionElemento(elem) → {x, y, w, h} en px de la ventana o null (lo usa también inicio.js).
// Los globos se recolocan solos (rAF mientras haya alguno): siguen al elemento si el mapa/VIVA/unifilar se mueve o hace zoom.
// Resolución de {tipo, id}: 1) NOC.viva.posicion (vista VIVA) 2) [data-id|data-c|data-l|data-n="id"] visible en la vista activa
// 3) mapa Leaflet (NOC.mapa) con las coordenadas de RED. Si no se encuentra, el globo se queda sin flecha en una esquina.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es != null ? o.es : String(o == null ? "" : o)); }
  var FORMA = { ok: "●", min: "▲", maj: "◆", crit: "■", down: "✕", info: "", defensa: "" };
  var SEV_TXT = { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT", down: "DOWN" };
  var capa = null, svg = null, lista = [], raf = 0;

  function asegurarCapa() {
    if (capa && document.body.contains(capa)) return;
    capa = document.createElement("div");
    capa.className = "an-capa";
    capa.setAttribute("role", "group");
    capa.setAttribute("aria-label", t({ es: "Anotaciones", en: "Annotations" }));
    capa.innerHTML = '<svg class="an-svg" aria-hidden="true" focusable="false"></svg>';
    svg = capa.firstChild;
    document.body.appendChild(capa);
  }
  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    return r.width + r.height > 0 && !el.closest("[hidden]");
  }
  function rectDe(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }
  function vistaActivaEl() {
    var id = NOC.vistaActiva;
    return (id && document.getElementById("vista-" + id)) || document;
  }
  function idx() { return NOC.idx || {}; }
  function coordNodo(id) {
    var R = NOC.RED || window.RED || {};
    var n = (idx().nodos || {})[id] || (R.nodos || []).filter(function (x) { return x.id === id; })[0];
    return n && n.coord ? n.coord : null;
  }
  function posMapa(o) {
    var m = NOC.mapa;
    if (!m || NOC.vistaActiva !== "mapa" || !m.latLngToContainerPoint) return null;
    var cont = m.getContainer && m.getContainer();
    if (!cont || !visible(cont)) return null;
    var c = null, R = NOC.RED || window.RED || {};
    if (o.tipo === "nodo") c = coordNodo(o.id);
    else if (o.tipo === "enlace") {
      var e = (idx().enlaces || {})[o.id] || (R.enlaces || []).filter(function (x) { return x.id === o.id; })[0];
      var a = e && coordNodo(e.a), b = e && coordNodo(e.b);
      if (a && b) c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    } else if (o.tipo === "zona") {
      var z = (idx().zonas || {})[o.id] || (R.zonas || []).filter(function (x) { return x.id === o.id; })[0];
      if (z && z.centro) c = z.centro;
    }
    if (!c) return null;
    var p = m.latLngToContainerPoint(c), rc = cont.getBoundingClientRect();
    return { x: rc.left + p.x, y: rc.top + p.y, w: 14, h: 14 };
  }
  function posViva(o) {
    var V = NOC.viva;
    if (!V || typeof V.posicion !== "function" || NOC.vistaActiva !== "viva") return null;
    var p = null;
    try { p = V.posicion(o.id); } catch (e) { p = null; }
    // {x, y, r, visible} en coordenadas de ventana; fuera de pantalla o de nivel: sin ancla
    if (!p || typeof p.x !== "number" || typeof p.y !== "number" || p.visible === false) return null;
    return { x: p.x, y: p.y, w: p.w || p.r * 2 || 14, h: p.h || p.r * 2 || 14 };
  }
  function cssId(id) { return window.CSS && CSS.escape ? CSS.escape(id) : String(id).replace(/["\\]/g, "\\$&"); }
  function posicion(elem) {
    if (!elem) return null;
    if (elem.nodeType === 1) return visible(elem) ? rectDe(elem) : null;
    if (typeof elem === "string") {
      var l = document.querySelectorAll(elem);
      for (var i = 0; i < l.length; i++) if (visible(l[i])) return rectDe(l[i]);
      return null;
    }
    if (typeof elem === "object") {
      if (typeof elem.x === "number" && typeof elem.y === "number" && !elem.id) return { x: elem.x, y: elem.y, w: elem.w || 10, h: elem.h || 10 };
      if (!elem.id) return null;
      var p = posViva(elem);
      if (p) return p;
      var raiz = vistaActivaEl(), q = cssId(elem.id);
      var sel = ['[data-id="' + q + '"]', '[data-c="' + q + '"]', '[data-l="' + q + '"]', '[data-n="' + q + '"]'];
      for (var k = 0; k < sel.length; k++) {
        var cand = raiz.querySelectorAll(sel[k]);
        for (var j = 0; j < cand.length; j++) if (visible(cand[j]) && !cand[j].closest(".an-capa")) return rectDe(cand[j]);
      }
      return posMapa(elem);
    }
    return null;
  }
  NOC.posicionElemento = posicion;

  function pintarGlobo(a) {
    var tp = a.tipo || "info", f = FORMA[tp] || "";
    a.el = document.createElement("div");
    a.el.className = "an-globo an-" + tp;
    a.el.setAttribute("role", "note");
    a.el.innerHTML = (f ? '<span class="an-forma" aria-hidden="true">' + f + '</span>' : '') +
      (SEV_TXT[tp] ? '<span class="an-sr">' + SEV_TXT[tp] + ': </span>' : '') + '<span class="an-txt">' + esc(a.texto) + '</span>';
    capa.appendChild(a.el);
    a.flecha = document.createElementNS("http://www.w3.org/2000/svg", "path");
    a.flecha.setAttribute("class", "an-flecha an-f-" + tp);
    a.anillo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    a.anillo.setAttribute("class", "an-anillo an-f-" + tp);
    svg.appendChild(a.flecha); svg.appendChild(a.anillo);
  }
  function solapa(r, otros) {
    for (var i = 0; i < otros.length; i++) {
      var o = otros[i];
      if (r.x < o.x + o.w + 6 && r.x + r.w + 6 > o.x && r.y < o.y + o.h + 6 && r.y + r.h + 6 > o.y) return true;
    }
    return false;
  }
  function colocar() {
    raf = 0;
    if (!lista.length) return;
    var W = window.innerWidth, H = window.innerHeight, puestos = [];
    // rectángulos que no se deben tapar (panel de la guía y tarjeta final)
    Array.prototype.forEach.call(document.querySelectorAll(".pq-guia:not([hidden]), .pq-final:not([hidden])"), function (x) {
      var r = x.getBoundingClientRect(); if (r.width) puestos.push({ x: r.left, y: r.top, w: r.width, h: r.height });
    });
    lista.forEach(function (a, n) {
      var p = posicion(a.elem);
      var gw = a.el.offsetWidth, gh = a.el.offsetHeight, gx, gy;
      if (!p || p.x < -20 || p.y < -20 || p.x > W + 20 || p.y > H + 20) {
        // sin ancla visible: arriba a la derecha, apilados
        gx = W - gw - 24; gy = 70 + n * (gh + 8);
        a.el.style.transform = "translate(" + Math.round(gx) + "px," + Math.round(gy) + "px)";
        a.el.classList.add("an-suelto");
        a.flecha.setAttribute("d", ""); a.anillo.setAttribute("r", 0);
        puestos.push({ x: gx, y: gy, w: gw, h: gh });
        return;
      }
      a.el.classList.remove("an-suelto");
      var rad = Math.max(10, Math.min(28, Math.max(p.w, p.h) / 2 + 6));
      var dist = rad + 46;
      var lados = { n: [0, -1], s: [0, 1], e: [1, 0], o: [-1, 0], ne: [0.75, -0.75], no: [-0.75, -0.75], se: [0.75, 0.75], so: [-0.75, 0.75] };
      var orden = a.lado ? [a.lado] : [];
      // primero hacia el centro de la pantalla (más espacio), luego el resto
      var hx = p.x < W / 2 ? "e" : "o", hy = p.y < H / 2 ? "s" : "n";
      orden = orden.concat([hy + hx, hx, hy, (hy === "n" ? "s" : "n") + hx, hy + (hx === "e" ? "o" : "e"), hx === "e" ? "o" : "e", hy === "n" ? "s" : "n"]);
      var mejor = null;
      [1, 1.8, 2.6].some(function (k) {
        return orden.some(function (l) {
          var d = lados[l] || lados.ne, cx = p.x + d[0] * dist * k, cy = p.y + d[1] * dist * k;
          var r = { x: d[0] > 0.1 ? cx : d[0] < -0.1 ? cx - gw : cx - gw / 2, y: d[1] > 0.1 ? cy : d[1] < -0.1 ? cy - gh : cy - gh / 2, w: gw, h: gh };
          r.x = Math.max(8, Math.min(W - gw - 8, r.x)); r.y = Math.max(52, Math.min(H - gh - 8, r.y));
          if (!mejor) mejor = r;
          if (!solapa(r, puestos) && !(p.x > r.x - rad && p.x < r.x + r.w + rad && p.y > r.y - rad && p.y < r.y + r.h + rad)) { mejor = r; return true; }
          return false;
        });
      });
      gx = mejor.x; gy = mejor.y;
      puestos.push(mejor);
      a.el.style.transform = "translate(" + Math.round(gx) + "px," + Math.round(gy) + "px)";
      // flecha: del borde del globo más cercano al ancla hasta el anillo
      var bx = Math.max(gx, Math.min(gx + gw, p.x)), by = Math.max(gy, Math.min(gy + gh, p.y));
      var dx = p.x - bx, dy = p.y - by, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var ex = p.x - dx / L * (rad + 3), ey = p.y - dy / L * (rad + 3);
      var ang = Math.atan2(ey - by, ex - bx), pa = 7;
      var h1x = ex - pa * Math.cos(ang - 0.45), h1y = ey - pa * Math.sin(ang - 0.45), h2x = ex - pa * Math.cos(ang + 0.45), h2y = ey - pa * Math.sin(ang + 0.45);
      a.flecha.setAttribute("d", L > rad + 8 ? "M" + bx.toFixed(1) + " " + by.toFixed(1) + "L" + ex.toFixed(1) + " " + ey.toFixed(1) +
        "M" + h1x.toFixed(1) + " " + h1y.toFixed(1) + "L" + ex.toFixed(1) + " " + ey.toFixed(1) + "L" + h2x.toFixed(1) + " " + h2y.toFixed(1) : "");
      a.anillo.setAttribute("cx", p.x.toFixed(1)); a.anillo.setAttribute("cy", p.y.toFixed(1)); a.anillo.setAttribute("r", rad.toFixed(1));
    });
    raf = requestAnimationFrame(colocar);
  }
  NOC.anotar = function (items, opc) {
    opc = opc || {};
    if (opc.limpiar !== false) NOC.limpiarAnotaciones();
    if (!items || !items.length) return 0;
    asegurarCapa();
    capa.hidden = false;
    items.forEach(function (it) {
      if (!it || it.texto == null) return;
      var a = { elem: it.elem, texto: typeof it.texto === "object" ? t(it.texto) : String(it.texto), tipo: it.tipo || "info", lado: it.lado, grupo: opc.grupo || it.grupo || "" };
      pintarGlobo(a);
      lista.push(a);
    });
    if (!raf) raf = requestAnimationFrame(colocar);
    return lista.length;
  };
  NOC.limpiarAnotaciones = function (grupo) {
    lista = lista.filter(function (a) {
      if (grupo && a.grupo !== grupo) return true;
      if (a.el) a.el.remove(); if (a.flecha) a.flecha.remove(); if (a.anillo) a.anillo.remove();
      return false;
    });
    if (!lista.length) { if (raf) cancelAnimationFrame(raf); raf = 0; if (capa) capa.hidden = true; }
  };
  NOC.anotaciones = function () { return lista.map(function (a) { return { texto: a.texto, tipo: a.tipo, grupo: a.grupo }; }); };
  // Modo defensa (estudios.js): al salir de él se quitan sus globos.
  if (window.MutationObserver && document.body) {
    var enDef = document.body.classList.contains("es-en-defensa");
    new MutationObserver(function () {
      var d = document.body.classList.contains("es-en-defensa");
      if (enDef && !d) NOC.limpiarAnotaciones("defensa");
      enDef = d;
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
})();
