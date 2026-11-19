// inicio.js — INICIO "¿Qué quieres saber?" y respuestas guiadas (CONTRATO_UI.md, Revisión 12, dueño PREGUNTAS).
// · NOC.pintarInicio(el): en SIMPLE pinta en INICIO 6 tarjetas-pregunta con ilustración propia (en vivo con el caso) y 3 iconos
//   grandes de estado (red · servicios · datos). app.js la llama si existe; en EXPERTO queda la portada de app.js.
// · Cada pregunta abre una respuesta guiada: pasos de 1 frase con ← / → / Esc, cámara sobre la red (VIVA si existe; si no, mapa o
//   unifilar), resaltados y globos (NOC.anotar), y una tarjeta final: sí/no + 1 cifra grande + "ver detalle".
// · API: NOC.preguntas = {lista(), lanzar(id, opc), cerrar(), estado()}.
// Solo lee: NOC.resultado / NOC.referencia, Motor.barridoN1 / calcular / planificacion, resultado.sla, NOC.linaje. No cambia el caso.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista || typeof Motor === "undefined") return;
  var RED = NOC.RED || window.RED;
  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es != null ? o.es : String(o == null ? "" : o)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function fmt(x, d) { return NOC.fmt ? NOC.fmt(x, d) : (esNum(x) ? x.toFixed(d || 0) : "—"); }
  function ico(k, s) { return NOC.icono ? NOC.icono(k, s || 16) : ""; }
  function corto(id) { return NOC.nombreCorto ? NOC.nombreCorto(id) : id; }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function quieto() {
    var b = document.body.classList;
    return (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) || b.contains("menos-movimiento") || b.contains("reducir-movimiento") || b.contains("a11y-quieto");
  }
  var FORMA = { ok: "●", min: "▲", maj: "◆", crit: "■", down: "✕", unk: "✕", wrn: "●" };
  var SEVT = { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT", down: "DOWN", unk: "—", wrn: "WRN" };
  function sevOc(o) { if (!esNum(o)) return "unk"; return NOC.sevOcupacion ? NOC.sevOcupacion(o) : o < 0.6 ? "ok" : o < 0.85 ? "min" : o <= 1 ? "maj" : "crit"; }
  function sevTag(s, txt) { return '<span class="pq-sev pq-' + s + '"><i aria-hidden="true">' + FORMA[s] + '</i>' + esc(txt == null ? SEVT[s] : txt) + '</span>'; }
  function pct(x, d) { return fmt(x, d == null ? 1 : d) + " %"; }
  function grande(x, u) {
    if (!esNum(x)) return Array.isArray(x) ? t({ es: "serie de ", en: "series of " }) + x.length : String(x == null ? "—" : x);
    var a = Math.abs(x), s;
    if (a >= 1e6) s = fmt(x / 1e6, 2) + " M";
    else if (a >= 1e4) s = fmt(x / 1e3, 1) + " k";
    else if (a >= 100) s = fmt(x, 0);
    else if (a >= 1 || a === 0) s = fmt(x, Math.round(x) === x ? 0 : 2);
    else s = fmt(x, 3);
    return s + (u && u !== "—" ? " " + u : "");
  }
  function vRes() { return NOC.resultado || null; }
  function opcBase() {
    var op = {};
    try { op = copia(NOC.opciones || (NOC.opcionesCaso && NOC.opcionesCaso()) || {}); } catch (e) { op = {}; }
    delete op.fallos; if (op.caso) op.caso.fallo = [];
    return op;
  }
  var CACHE = {};
  function cache(nombre, clave, fn) {
    var c = CACHE[nombre];
    if (c && c.k === clave) return c.v;
    var v = fn(); CACHE[nombre] = { k: clave, v: v }; return v;
  }
  function claveCaso() { try { return NOC.modo + "|" + JSON.stringify(opcBase()); } catch (e) { return String(NOC.modo); } }

  // ======================================================================== escena (cámara y resaltados)
  // VIVA (otro agente) si existe; si no, mapa Leaflet; si no, unifilar. Todo con try/catch: la API de VIVA puede cambiar.
  var Esc = {
    vista: null,
    preparar: function () {
      if (NOC.cerrarFicha) try { NOC.cerrarFicha(); } catch (e) { /* nada */ }
      var cand = ["viva", "mapa", "unifilar"];
      for (var i = 0; i < cand.length; i++) {
        if (cand[i] === "viva" && !NOC.viva) continue;
        if (cand[i] === "mapa" && typeof window.L === "undefined") continue;
        try { NOC.activarVista(cand[i]); } catch (e) { /* nada */ }
        if (NOC.vistaActiva === cand[i]) { Esc.vista = cand[i]; return cand[i]; }
      }
      Esc.vista = NOC.vistaActiva; return Esc.vista;
    },
    nodosDe: function (items) {
      var out = [], I = NOC.idx || {};
      items.forEach(function (x) {
        if (x.tipo === "nodo") out.push(x.id);
        else if (x.tipo === "enlace" && (I.enlaces || {})[x.id]) { out.push(I.enlaces[x.id].a, I.enlaces[x.id].b); }
      });
      return out;
    },
    enfocar: function (items) {
      items = items || [];
      var v = Esc.vista;
      try {
        if (v === "viva" && NOC.viva && NOC.viva.enfocar) {
          // API VIVA (Rev. 12): enfocar(id, nivel?) para uno; camara({ids}) encaja varios en el nivel actual
          var V = NOC.viva, ids = items.map(function (x) { return x.id; });
          if (!ids.length) { V.camara({ nivel: "red" }); return; }
          if (ids.length === 1) { V.enfocar(ids[0]); return; }
          var soloZonas = items.every(function (x) { return x.tipo === "zona"; }), nv = soloZonas ? "madrid" : "red";
          Promise.resolve(V.nivel() === nv ? null : V.nivel(nv)).then(function () { return V.camara({ ids: ids, margen: 70 }); }).catch(function () { /* nada */ });
          return;
        }
        if (v === "mapa" && NOC.mapa && window.L) {
          var I = NOC.idx || {}, ll = Esc.nodosDe(items).map(function (id) { var n = (I.nodos || {})[id]; return n && n.coord; }).filter(Boolean);
          if (!items.length) ll = (RED.nodos || []).filter(function (n) { return n.coord; }).map(function (n) { return n.coord; });
          if (!ll.length) return;
          NOC.mapa.invalidateSize(false);
          var sz = NOC.mapa.getSize();
          if (!sz || sz.x < 120 || sz.y < 120) return;
          // el panel de la guía tapa la parte de abajo: se reserva su alto si cabe
          var g = document.querySelector(".pq-guia:not([hidden])"), hg = g ? g.offsetHeight + 24 : 0;
          var pv = Math.min(60, sz.y / 8), pb = Math.max(pv, Math.min(hg, sz.y - 2 * pv - 140)), ph = Math.min(60, sz.x / 8);
          var b = L.latLngBounds(ll), opc = { paddingTopLeft: [ph, pv], paddingBottomRight: [ph, pb], maxZoom: items.length ? 13 : 11 };
          var z = NOC.mapa.getBoundsZoom(b, false, L.point(ph * 2, pv + pb));
          if (!isFinite(z)) { NOC.mapa.fitBounds(b, { maxZoom: 12 }); return; }
          if (quieto()) NOC.mapa.fitBounds(b, opc); else NOC.mapa.flyToBounds(b, Object.assign({ duration: 0.8 }, opc));
          return;
        }
        if (items.length) {
          var el = document.querySelector('#vista-' + v + ' [data-c="' + items[0].id + '"], #vista-' + v + ' [data-l="' + items[0].id + '"]');
          if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", inline: "center", behavior: quieto() ? "auto" : "smooth" });
        }
      } catch (e) { console.warn("escena.enfocar", e); }
    },
    resaltar: function (items, sev) {
      try { if (Esc.vista === "viva" && NOC.viva && NOC.viva.resaltar) NOC.viva.resaltar((items || []).map(function (x) { return x.id; })); } catch (e) { /* nada */ }
    },
    limpiar: function () { Esc.resaltar([]); }
  };

  // ======================================================================== guía (pasos ← / →, tarjeta final)
  var G = { activo: false, q: null, pasos: [], i: 0, final: null, origen: null, el: null, fin: null, velo: null, enFinal: false };
  function asegurarGuia() {
    if (G.el) return;
    G.velo = document.createElement("div"); G.velo.className = "pq-velo"; G.velo.hidden = true;
    G.el = document.createElement("section"); G.el.className = "pq-guia"; G.el.hidden = true;
    G.el.setAttribute("role", "region");
    G.fin = document.createElement("div"); G.fin.className = "pq-final"; G.fin.hidden = true;
    G.fin.setAttribute("role", "dialog"); G.fin.setAttribute("aria-modal", "true"); G.fin.setAttribute("aria-labelledby", "pq-fin-tit");
    document.body.appendChild(G.velo); document.body.appendChild(G.el); document.body.appendChild(G.fin);
    G.el.addEventListener("click", clicGuia);
    G.fin.addEventListener("click", clicGuia);
    G.fin.addEventListener("keydown", function (ev) {
      if (ev.key !== "Tab") return;
      var f = G.fin.querySelectorAll("button"); if (!f.length) return;
      if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
    });
  }
  function clicGuia(ev) {
    var b = ev.target.closest("[data-pqg]");
    if (b) {
      var a = b.getAttribute("data-pqg");
      if (a === "ant") mover(-1); else if (a === "sig") mover(1); else if (a === "cerrar") cerrar();
      else if (a === "detalle") { var f = G.final; cerrar(true); try { f && f.detalle && f.detalle(); } catch (e) { console.error(e); } }
      else if (a === "repetir") { G.enFinal = false; G.i = 0; pintarPaso(); }
      else if (a === "otra") cerrar();
      else if (a === "ir") irPaso(+b.getAttribute("data-i"));
      return;
    }
    var e = ev.target.closest("[data-pq-elegir]");
    if (e) { elegir(e.getAttribute("data-pq-elegir")); }
  }
  function lanzarGuia(q, pasos, final) {
    asegurarGuia();
    if (!G.activo) G.origen = document.activeElement && document.activeElement.closest ? document.activeElement.closest("[data-pq]") : null;
    G.activo = true; G.q = q; G.pasos = pasos; G.final = final; G.i = 0; G.enFinal = false;
    document.body.classList.add("pq-en-guia");
    G.el.setAttribute("aria-label", t(q.q));
    pintarPaso();
  }
  function elegir(v) {
    var p = G.pasos[G.i];
    if (!p || !p.elegir) return;
    var r = p.elegir(v);
    if (!r) return;
    G.pasos = G.pasos.slice(0, G.i + 1).concat(r.pasos || []);
    if (r.final) G.final = r.final;
    mover(1);
  }
  function mover(d) {
    if (!G.activo) return;
    if (G.enFinal) { if (d < 0) { G.enFinal = false; pintarPaso(); } return; }
    var p = G.pasos[G.i];
    if (d > 0 && p && p.elegir && G.pasos.length === G.i + 1) { elegir(p.porDefecto ? p.porDefecto() : null); return; }
    var j = G.i + d;
    if (j < 0) return;
    if (j >= G.pasos.length) { if (G.final) mostrarFinal(); return; }
    G.i = j; pintarPaso();
  }
  function irPaso(i) { if (i >= 0 && i < G.pasos.length) { G.enFinal = false; G.i = i; pintarPaso(); } }
  function pintarPaso() {
    var p = G.pasos[G.i], n = G.pasos.length, q = G.q;
    G.fin.hidden = true;
    if (NOC.limpiarAnotaciones) NOC.limpiarAnotaciones("pq");
    var fig = typeof p.fig === "function" ? p.fig() : (p.fig || "");
    var enRed = !!p.red;
    var nueva = false;
    if (enRed) { if (!Esc.vista || NOC.vistaActiva !== Esc.vista) { Esc.preparar(); nueva = true; } } else Esc.limpiar();
    G.velo.hidden = enRed;
    G.el.classList.toggle("pq-guia-red", enRed);
    G.el.classList.toggle("pq-guia-fig", !!fig);
    var puntos = G.pasos.map(function (x, i) {
      return '<button type="button" class="pq-punto' + (i === G.i ? " act" : i < G.i ? " hecho" : "") + '" data-pqg="ir" data-i="' + i + '" aria-label="' + esc(t({ es: "Paso ", en: "Step " }) + (i + 1)) + '"' + (i === G.i ? ' aria-current="step"' : '') + '></button>';
    }).join("");
    var ult = G.i === n - 1 && !p.elegir;
    G.el.hidden = false;
    G.el.innerHTML = '<header class="pq-g-cab">' + ico(q.icono, 18) + '<span class="pq-g-q">' + esc(t(q.q)) + '</span>' +
      '<span class="pq-g-n mono" aria-hidden="true">' + (G.i + 1) + '/' + n + (p.elegir ? "+" : "") + '</span>' +
      '<button type="button" class="pq-g-x" data-pqg="cerrar" aria-label="' + esc(t({ es: "Cerrar (Esc)", en: "Close (Esc)" })) + '" title="Esc">' + ico("cerrar", 16) + '</button></header>' +
      (fig ? '<div class="pq-fig">' + fig + '</div>' : '') +
      '<p class="pq-frase" aria-live="polite" aria-atomic="true"><span class="pq-sr">' + esc(t({ es: "Paso ", en: "Step " }) + (G.i + 1) + t({ es: " de ", en: " of " }) + n + ". ") + '</span>' + esc(t(p.texto)) + '</p>' +
      '<nav class="pq-nav" aria-label="' + esc(t({ es: "Pasos", en: "Steps" })) + '">' +
      '<button type="button" class="pq-b" data-pqg="ant"' + (G.i ? "" : " disabled") + ' aria-label="' + esc(t({ es: "Anterior (←)", en: "Previous (←)" })) + '"><span aria-hidden="true">←</span></button>' +
      '<div class="pq-puntos">' + puntos + '</div>' +
      '<button type="button" class="pq-b pq-b-sig" data-pqg="sig" aria-label="' + esc(ult ? t({ es: "Ver respuesta (→)", en: "See answer (→)" }) : t({ es: "Siguiente (→)", en: "Next (→)" })) + '">' +
      (ult ? '<span>' + esc(t({ es: "Respuesta", en: "Answer" })) + '</span>' : '') + '<span aria-hidden="true">→</span></button></nav>';
    // foco: el innerHTML lo ha borrado; va a la primera opción (selector) o a "siguiente"
    var f = G.el.querySelector(p.elegir ? "[data-pq-elegir]" : ".pq-b-sig");
    if (f) f.focus({ preventScroll: true });
    try {
      if (enRed) {
        // la vista recién activada (mapa) mide su contenedor en el siguiente ciclo
        setTimeout(function () {
          if (!G.activo || G.pasos[G.i] !== p || G.enFinal) return;
          if (p.enfocar) Esc.enfocar(p.enfocar);
          Esc.resaltar(p.resaltar || p.enfocar || [], p.sev);
        }, nueva ? 120 : 0);
      }
      if (p.anotar && NOC.anotar) setTimeout(function () { if (G.activo && G.pasos[G.i] === p && !G.enFinal) NOC.anotar(p.anotar, { grupo: "pq" }); }, enRed ? 120 : 0);
    } catch (e) { console.warn("paso", e); }
  }
  function mostrarFinal() {
    var F = G.final, q = G.q;
    G.enFinal = true;
    if (NOC.limpiarAnotaciones) NOC.limpiarAnotaciones("pq");
    G.el.hidden = true; G.velo.hidden = false;
    var s = F.si === true ? "ok" : F.si === false ? (F.sevNo || "crit") : "min";
    var palabra = F.si === true ? t({ es: "SÍ", en: "YES" }) : F.si === false ? t({ es: "NO", en: "NO" }) : t({ es: "CASI", en: "ALMOST" });
    var simb = F.si === true ? '<path d="M14 33l12 12 24-26"/>' : F.si === false ? '<path d="M18 18l28 28M46 18L18 46"/>' : '<path d="M32 14v22M32 46v4"/>';
    G.fin.innerHTML = '<div class="pq-f-cab">' + ico(q.icono, 18) + '<span id="pq-fin-tit">' + esc(t(q.q)) + '</span></div>' +
      '<div class="pq-f-cuerpo">' +
      '<div class="pq-f-ver pq-' + s + '"><svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true"><rect x="3" y="3" width="58" height="58" class="pq-f-marco"/>' + simb + '</svg>' +
      '<b>' + esc(palabra) + '</b><span class="pq-sr">' + esc(SEVT[s]) + '</span></div>' +
      '<div class="pq-f-cifra"><span class="pq-f-num">' + esc(F.cifra) + '</span><span class="pq-f-uni">' + esc(t(F.sub || "")) + '</span></div></div>' +
      '<p class="pq-f-frase">' + esc(t(F.frase || "")) + '</p>' +
      '<div class="pq-f-bot">' +
      (F.detalle ? '<button type="button" class="pq-btn prim" data-pqg="detalle">' + ico("flecha", 14) + esc(t(F.detalleTxt || { es: "Ver detalle", en: "See detail" })) + '</button>' : '') +
      '<button type="button" class="pq-btn" data-pqg="repetir">' + esc(t({ es: "Repetir", en: "Replay" })) + '</button>' +
      '<button type="button" class="pq-btn" data-pqg="otra">' + esc(t({ es: "Otra pregunta", en: "Another question" })) + '</button></div>';
    G.fin.hidden = false;
    var b = G.fin.querySelector("button"); if (b) b.focus();
  }
  function cerrar(sinVolver) {
    if (!G.activo) return;
    G.activo = false; G.enFinal = false;
    if (NOC.limpiarAnotaciones) NOC.limpiarAnotaciones("pq");
    Esc.limpiar(); Esc.vista = null;
    G.el.hidden = true; G.fin.hidden = true; G.velo.hidden = true;
    document.body.classList.remove("pq-en-guia");
    var orig = G.origen && G.origen.getAttribute ? G.origen.getAttribute("data-pq") : null;
    if (!sinVolver) {
      if (NOC.setEspacio) NOC.setEspacio("inicio");
      setTimeout(function () {
        var b = orig && document.querySelector('.pq-ini [data-pq="' + orig + '"]');
        if (b) b.focus(); else { var c = document.querySelector(".pq-ini [data-pq]"); if (c) c.focus(); }
      }, 30);
    }
  }
  // fase de captura: ← / → / Esc de la guía tienen prioridad sobre el reloj y el shell
  document.addEventListener("keydown", function (ev) {
    if (!G.activo) return;
    var tg = ev.target && ev.target.tagName;
    if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (ev.target && ev.target.isContentEditable)) return;
    if (ev.key === "ArrowRight" || ev.key === "ArrowLeft" || ev.key === "Escape" || ev.key === "PageDown" || ev.key === "PageUp") {
      ev.preventDefault(); ev.stopImmediatePropagation();
      if (ev.key === "Escape") cerrar(); else mover(ev.key === "ArrowRight" || ev.key === "PageDown" ? 1 : -1);
    }
  }, true);
  // elegir un enlace tocándolo en la red mientras está abierto el selector de corte
  if (NOC.on) NOC.on("seleccion", function (s) {
    if (!G.activo || G.enFinal) return;
    var p = G.pasos[G.i];
    if (p && p.elegir && p.tipoElegir && s && s.tipo === p.tipoElegir) { setTimeout(function () { if (NOC.cerrarFicha) NOC.cerrarFicha(); }, 0); elegir(s.id); }
  });

  // ======================================================================== gráficos de las respuestas (SVG/HTML, solo tokens)
  function barra(v, max, sev, et, valTxt, extra) {
    var w = Math.max(0, Math.min(100, max ? v / max * 100 : 0));
    return '<div class="pq-bar' + (extra || "") + '"><span class="pq-bar-et">' + et + '</span><span class="pq-bar-pista"><i class="pq-bg-' + sev + '" style="width:' + w.toFixed(2) + '%"></i></span>' +
      '<span class="pq-bar-v">' + sevTag(sev, valTxt) + '</span></div>';
  }
  function heroe(num, sub, sev) {
    return '<div class="pq-heroe">' + (sev ? '<span class="pq-heroe-f pq-' + sev + '" aria-hidden="true">' + FORMA[sev] + '</span>' : '') + '<span class="pq-heroe-n">' + esc(num) + '</span><span class="pq-heroe-s">' + esc(sub) + '</span></div>';
  }

  // ---------------------------------------------------------------- 1 · ¿Aguanta la red hoy?
  function topEnlaces(r, n) {
    return Object.keys((r && r.enlaces) || {}).map(function (k) { return { id: k, x: r.enlaces[k], o: NOC.ocupacion ? NOC.ocupacion(r.enlaces[k]) : r.enlaces[k].ocupacion }; })
      .filter(function (e) { return !e.x.caido && esNum(e.o); }).sort(function (a, b) { return b.o - a.o; }).slice(0, n);
  }
  function qAguanta(q) {
    var r = NOC.referencia || vRes();
    if (!r) return null;
    var s = r.resumen, top = topEnlaces(r, 3), m = top[0], ms = m ? sevOc(m.o) : "unk";
    var sat = top.filter(function (e) { return e.o > 1.0001; }).length;
    var servSev = s.pct_servida >= 99.9 ? "ok" : s.pct_servida >= 99 ? "maj" : "crit";
    var pasos = [
      { red: true, enfocar: [], texto: { es: "Hora más cargada de 2031, con partido: la referencia v7.", en: "Busiest hour of 2031, with a match: the v7 reference." },
        fig: '<div class="pq-chips">' + '<span>' + ico("reloj", 16) + esc(t({ es: "Hora cargada", en: "Busy hour" })) + '</span><span>' + ico("calendario", 16) + '2031</span><span>' + ico("evento", 16) + esc(t({ es: "Partido", en: "Match" })) + '</span><span>' + ico("candado", 16) + 'REF v7</span></div>' },
      { red: true, enfocar: top.map(function (e) { return { tipo: "enlace", id: e.id }; }), sev: ms,
        texto: { es: "Estos 3 enlaces son los más cargados.", en: "These 3 links carry the most load." },
        anotar: top.map(function (e) { return { elem: { tipo: "enlace", id: e.id }, texto: corto(e.id) + " · " + pct(e.o * 100), tipo: sevOc(e.o) }; }),
        fig: '<div class="pq-bars">' + top.map(function (e) { return barra(e.o * 100, 100, sevOc(e.o), esc(corto(e.id)), pct(e.o * 100)); }).join("") + '</div>' },
      { red: true, enfocar: m ? [{ tipo: "enlace", id: m.id }] : [], sev: ms,
        texto: m && m.o > 1.0001 ? { es: "El más cargado se desborda.", en: "The busiest one overflows." } : m && m.o >= 0.85 ? { es: "El más cargado va justo, pero no se desborda.", en: "The busiest one is tight, but does not overflow." } : { es: "Ni el más cargado pasa del 85 %.", en: "Not even the busiest passes 85 %." },
        anotar: m ? [{ elem: { tipo: "enlace", id: m.id }, texto: pct(m.o * 100) + " · " + (m.o > 1.0001 ? t({ es: "desborda", en: "overflows" }) : t({ es: "cabe", en: "fits" })), tipo: ms }] : [] },
      { red: false, texto: { es: "Se sirve el " + pct(s.pct_servida, 1) + " del tráfico.", en: pct(s.pct_servida, 1) + " of traffic is served." },
        fig: heroe(pct(s.pct_servida, 1), fmt(s.servida_gbps, 0) + " / " + fmt(s.dl_total_gbps, 0) + " Gbit/s", servSev) +
          barra(s.pct_servida, 100, servSev, esc(t({ es: "Servido", en: "Served" })), pct(s.pct_servida, 1)) }
    ];
    var si = s.pct_servida >= 99.9 && !sat;
    return { pasos: pasos, final: { si: si, sevNo: "crit", cifra: pct(s.pct_servida, 1), sub: { es: "del tráfico servido", en: "of traffic served" },
      frase: si ? (m && m.o >= 0.85 ? { es: "Aguanta, pero " + corto(m.id) + " va al " + pct(m.o * 100) + ".", en: "It holds, but " + corto(m.id) + " runs at " + pct(m.o * 100) + "." } : { es: "Aguanta con margen.", en: "It holds with margin." })
        : { es: "No aguanta: hay tráfico sin servir.", en: "It does not hold: some traffic is not served." },
      detalle: function () { NOC.activarVista(NOC.viva ? "viva" : "mapa"); if (NOC.dockTab) try { NOC.dockTab("enlaces"); } catch (e) { /* nada */ } } } };
  }

  // ---------------------------------------------------------------- 2 · ¿Qué pasa si se corta…?
  function barridoEnlaces() {
    return cache("n1", claveCaso(), function () {
      return Motor.barridoN1(RED, opcBase()).filter(function (x) { return x.clase === "enlace"; });
    });
  }
  function calcularCon(fallos) {
    var op = opcBase(); op.fallos = fallos.slice();
    if (op.caso) op.caso.fallo = fallos.slice();
    return Motor.calcular(RED, op);
  }
  function antes() { return cache("antes", claveCaso(), function () { return Motor.calcular(RED, opcBase()); }); }
  function figCorte(lista) {
    var max = Math.max(1, Math.max.apply(null, lista.map(function (x) { return 100 - x.pct_servida; })));
    return '<div class="pq-fig-t lbl">' + esc(t({ es: "Tráfico perdido si se corta", en: "Traffic lost if cut" })) + '</div><div class="pq-elegir" role="list">' + lista.map(function (x, i) {
      var p = 100 - x.pct_servida, s = p > 10 ? "crit" : p > 1 ? "maj" : p > 0.01 ? "min" : "ok";
      return '<button type="button" role="listitem" class="pq-opc" data-pq-elegir="' + esc(x.id) + '" aria-label="' + esc(corto(x.id) + ": " + t({ es: "se pierde ", en: "loses " }) + pct(p) + (i === 0 ? t({ es: " (el más crítico)", en: " (most critical)" }) : "")) + '">' +
        barra(p, max, s, (i === 0 ? '<b class="pq-tag">' + esc(t({ es: "Más crítico", en: "Most critical" })) + '</b> ' : '') + esc(corto(x.id)), "−" + pct(p)) + '</button>';
    }).join("") + '</div>';
  }
  function qCorte(q) {
    var pasoElegir = {
      red: true, enfocar: [], tipoElegir: "enlace",
      texto: { es: "Elige un enlace, o tócalo en la red.", en: "Pick a link, or tap it on the network." },
      fig: function () {
        var l = null;
        try { l = barridoEnlaces(); } catch (e) { console.error(e); }
        if (!l || !l.length) return '<p class="tx2">' + esc(t({ es: "N-1 no disponible.", en: "N-1 not available." })) + '</p>';
        setTimeout(function () { if (NOC.anotar && G.activo && G.pasos[G.i] === pasoElegir) NOC.anotar([{ elem: { tipo: "enlace", id: l[0].id }, texto: t({ es: "El más crítico", en: "Most critical" }), tipo: "crit" }], { grupo: "pq" }); }, 150);
        return figCorte(l.slice(0, 6));
      },
      porDefecto: function () { var l = barridoEnlaces(); return l[0] && l[0].id; },
      elegir: function (id) { return id ? respuestaCorte(id) : null; }
    };
    return { pasos: [pasoElegir], final: null };
  }
  function respuestaCorte(id) {
    var A = antes(), B = calcularCon([id]), sa = A.resumen, sb = B.resumen;
    var it = [{ tipo: "enlace", id: id }];
    // reencaminamiento: enlaces que más carga ganan
    var desv = Object.keys(B.enlaces).map(function (k) {
      var a = A.enlaces[k], b = B.enlaces[k];
      return { id: k, d: (b && !b.caido ? b.carga_gbps : 0) - (a && !a.caido ? a.carga_gbps : 0), o: NOC.ocupacion ? NOC.ocupacion(b) : b.ocupacion };
    }).filter(function (x) { return x.id !== id && x.d > 0.5; }).sort(function (a, b) { return b.d - a.d; }).slice(0, 3);
    // demandas afectadas y pérdida por zona
    var porZona = {}, nAf = 0, ia = {};
    A.demandas.forEach(function (d) { ia[d.id] = d; });
    B.demandas.forEach(function (d) {
      var a = ia[d.id]; if (!a) return;
      var perd = (a.servida_gbps || 0) - (d.servida_gbps || 0);
      if (perd > 1e-6 || (d.estado !== a.estado && d.estado !== "ok")) { nAf++; var z = d.zona || d.origen || "?"; porZona[z] = (porZona[z] || 0) + Math.max(0, perd); }
    });
    var zonas = Object.keys(porZona).map(function (z) { return { z: z, g: porZona[z] }; }).sort(function (a, b) { return b.g - a.g; }).slice(0, 5);
    var perdidaPct = sa.pct_servida - sb.pct_servida, sevB = sb.pct_servida >= 99.9 ? "ok" : sb.pct_servida >= 95 ? "maj" : "crit";
    var maxOA = sa.max_ocupacion, maxOB = sb.max_ocupacion;
    var pasos = [
      { red: true, enfocar: it, sev: "crit", texto: { es: "Cortamos " + corto(id) + ".", en: "We cut " + corto(id) + "." },
        anotar: [{ elem: it[0], texto: "✂ " + t({ es: "Corte", en: "Cut" }), tipo: "down" }] },
      { red: false, texto: perdidaPct > 0.01 ? { es: "Se pierde el " + pct(perdidaPct, 1) + " del tráfico.", en: pct(perdidaPct, 1) + " of traffic is lost." } : { es: "No se pierde tráfico.", en: "No traffic is lost." },
        fig: '<div class="pq-ad">' +
          '<div class="pq-ad-c"><span class="lbl">' + esc(t({ es: "Antes", en: "Before" })) + '</span>' + heroe(pct(sa.pct_servida, 1), t({ es: "servido", en: "served" }), "ok") + '</div>' +
          '<svg class="pq-ad-fl" viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12h34M28 5l8 7-8 7"/></svg>' +
          '<div class="pq-ad-c"><span class="lbl">' + esc(t({ es: "Después", en: "After" })) + '</span>' + heroe(pct(sb.pct_servida, 1), t({ es: "servido", en: "served" }), sevB) + '</div></div>' +
          '<div class="pq-bars">' + barra(sa.pct_servida, 100, "ok", esc(t({ es: "Antes", en: "Before" })), pct(sa.pct_servida, 1)) + barra(sb.pct_servida, 100, sevB, esc(t({ es: "Después", en: "After" })), pct(sb.pct_servida, 1)) +
          barra(maxOB * 100, Math.max(100, maxOB * 100), sevOc(maxOB), esc(t({ es: "Pico enlace", en: "Peak link" })), pct(maxOA * 100, 0) + " → " + pct(maxOB * 100, 0)) + '</div>' },
      { red: true, enfocar: it.concat(desv.map(function (x) { return { tipo: "enlace", id: x.id }; })), sev: "maj",
        texto: desv.length ? { es: "El tráfico se desvía por aquí.", en: "Traffic is rerouted through here." } : { es: "No hay camino alternativo con carga.", en: "No loaded alternative path." },
        anotar: [{ elem: it[0], texto: "✂", tipo: "down" }].concat(desv.map(function (x) { return { elem: { tipo: "enlace", id: x.id }, texto: "+" + fmt(x.d, 0) + " Gbit/s · " + pct(x.o * 100, 0), tipo: sevOc(x.o) }; })) },
      { red: false, texto: nAf ? { es: nAf + " demandas pierden servicio.", en: nAf + " demands lose service." } : { es: "Ninguna demanda pierde servicio.", en: "No demand loses service." },
        fig: nAf ? '<div class="pq-fig-t lbl">' + esc(t({ es: "Gbit/s perdidos por zona", en: "Gbit/s lost per zone" })) + '</div><div class="pq-bars">' + zonas.map(function (z) {
          return barra(z.g, zonas[0].g || 1, "crit", esc(corto(z.z)), fmt(z.g, 1) + " Gbit/s");
        }).join("") + '</div>' : heroe("0", t({ es: "demandas afectadas", en: "affected demands" }), "ok") }
    ];
    return { pasos: pasos, final: { si: sb.pct_servida >= 99.9, sevNo: sevB, cifra: pct(sb.pct_servida, 1), sub: { es: "servido tras el corte", en: "served after the cut" },
      frase: sb.pct_servida >= 99.9 ? { es: "Aguanta el corte de " + corto(id) + ".", en: "It survives cutting " + corto(id) + "." } : { es: "Con " + corto(id) + " cortado, " + nAf + " demandas sufren.", en: "With " + corto(id) + " cut, " + nAf + " demands suffer." },
      detalle: function () { NOC.activarVista("n1"); }, detalleTxt: { es: "Ver N-1", en: "See N-1" } } };
  }

  // ---------------------------------------------------------------- 3 · ¿Cuándo se llena?
  function plan() {
    return cache("plan", claveCaso(), function () { return Motor.planificacion(RED, opcBase(), { desde: 2026, hasta: 2035 }); });
  }
  function figPlan(P, foco) {
    var W = 640, H = 230, ml = 40, mr = 150, mt = 14, mb = 26, x0 = P.desde, x1 = P.hasta;
    var els = P.elementos.filter(function (e) { return !e.desde_inicio_85; }).sort(function (a, b) { return b.pct_fin - a.pct_fin; }).slice(0, 3);
    var llenos = P.elementos.filter(function (e) { return e.desde_inicio_85; });
    var ymax = Math.max(110, Math.ceil(Math.max.apply(null, P.elementos.map(function (e) { return Math.max.apply(null, e.pct); })) / 10) * 10);
    function X(a) { return ml + (a - x0) / (x1 - x0) * (W - ml - mr); }
    function Y(p) { return mt + (1 - Math.min(p, ymax) / ymax) * (H - mt - mb); }
    var g = "";
    [0, 50, 100].forEach(function (p) { g += '<line class="pq-eje" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(p) + '" y2="' + Y(p) + '"/><text class="pq-tx" x="' + (ml - 6) + '" y="' + (Y(p) + 4) + '" text-anchor="end">' + p + '</text>'; });
    for (var a = x0; a <= x1; a++) if ((a - x0) % 3 === 0 || a === x1) g += '<text class="pq-tx" x="' + X(a) + '" y="' + (H - 8) + '" text-anchor="middle">' + a + '</text>';
    // umbrales 85 / 100 (con texto, no solo color)
    [[85, "maj"], [100, "crit"]].forEach(function (u) {
      g += '<line class="pq-umb pq-s-' + u[1] + (foco === u[0] ? " foco" : "") + '" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(u[0]) + '" y2="' + Y(u[0]) + '"/>' +
        '<text class="pq-tx pq-umb-t" x="' + (ml + 4) + '" y="' + (Y(u[0]) - 4) + '">' + FORMA[u[1]] + ' ' + u[0] + ' %</text>';
    });
    var etiq = [];
    if (llenos.length) {
      var pl = llenos[0].pct;
      g += '<path class="pq-ln pq-ln-lleno" d="' + pl.map(function (p, i) { return (i ? "L" : "M") + X(x0 + i).toFixed(1) + " " + Y(p).toFixed(1); }).join("") + '"/>';
      etiq.push({ y: Y(pl[pl.length - 1]), txt: llenos.length + " " + t({ es: "ya > 85 % en 2026", en: "already > 85 % in 2026" }), cls: "tx3" });
    }
    var clave = P.saturacion && P.saturacion[85] && P.saturacion[85].por_crecimiento;
    els.forEach(function (e, k) {
      var prin = clave ? e.id === clave.id : k === 0;
      g += '<path class="pq-ln' + (prin ? " pq-ln-prin" : "") + '" d="' + e.pct.map(function (p, i) { return (i ? "L" : "M") + X(x0 + i).toFixed(1) + " " + Y(p).toFixed(1); }).join("") + '"/>';
      e.pct.forEach(function (p, i) { g += '<circle class="pq-pt" cx="' + X(x0 + i).toFixed(1) + '" cy="' + Y(p).toFixed(1) + '" r="7" data-tip="' + esc(corto(e.id) + " · " + (x0 + i) + " · " + pct(p, 0)) + '"/>'; });
      etiq.push({ y: Y(e.pct[e.pct.length - 1]), txt: corto(e.id), cls: prin ? "" : "tx2" });
    });
    etiq.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < etiq.length; i++) if (etiq[i].y - etiq[i - 1].y < 15) etiq[i].y = etiq[i - 1].y + 15;
    etiq.forEach(function (e) { g += '<text class="pq-tx pq-et ' + e.cls + '" x="' + (W - mr + 6) + '" y="' + (e.y + 4).toFixed(1) + '">' + esc(e.txt.length > 19 ? e.txt.slice(0, 18) + "…" : e.txt) + '</text>'; });
    // marcador del primer cruce
    var mk = foco && P.saturacion && P.saturacion[foco] && P.saturacion[foco].por_crecimiento;
    if (mk && mk.anio) {
      var cx = X(mk.anio), cy = Y(mk.pct);
      g += '<circle class="pq-mk pq-s-' + (foco === 100 ? "crit" : "maj") + '" cx="' + cx + '" cy="' + cy + '" r="9"/>' +
        '<text class="pq-tx pq-mk-t" x="' + (cx - 12) + '" y="' + Math.min(cy - 14, Y(100) - 7).toFixed(1) + '" text-anchor="end">' + mk.anio + ' · ' + esc(corto(mk.id)) + ' ' + pct(mk.pct, 0) + '</text>';
    }
    var aria = t({ es: "Ocupación por año de los elementos que más crecen; ", en: "Yearly utilisation of the fastest-growing elements; " }) + els.map(function (e) { return corto(e.id) + " " + pct(e.pct[0], 0) + " → " + pct(e.pct_fin, 0); }).join(", ");
    return '<svg class="pq-graf" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">' + g + '</svg>';
  }
  function figRuta(P) {
    var acc = (P.hoja_ruta || []).reduce(function (m, h) { (m[h.anio] = m[h.anio] || []).push(h); return m; }, {});
    var anios = Object.keys(acc).map(Number).sort();
    return '<ol class="pq-ruta">' + anios.map(function (a) {
      return '<li><b class="mono">' + a + '</b><span>' + acc[a].map(function (h) {
        var q = h.id ? corto(h.id) : (h.n_sitios || (h.sitios || []).length) + " " + t({ es: "sitios", en: "sites" });
        var ac = { anadir_lambda: { es: "+λ", en: "+λ" }, ampliar: { es: "ampliar", en: "expand" }, ampliar_sitios: { es: "ampliar", en: "expand" } }[h.accion] || { es: h.accion, en: h.accion };
        return '<span class="pq-ruta-i">' + ico(h.familia === "nucleo" ? "bng" : h.familia === "sitio" ? "sitio" : "enlace", 14) + esc(t(ac) + " " + q) + '</span>';
      }).join("") + '</span></li>';
    }).join("") + '</ol>';
  }
  function qLlena(q) {
    var P = plan();
    if (!P || !P.elementos) return null;
    var s85 = P.saturacion[85] && P.saturacion[85].por_crecimiento, s100 = P.saturacion[100] && P.saturacion[100].por_crecimiento;
    var llenos = P.elementos.filter(function (e) { return e.desde_inicio_85; });
    var pasos = [
      { texto: { es: "Hacemos crecer la demanda año a año, hasta " + P.hasta + ".", en: "Demand grows year by year, up to " + P.hasta + "." }, fig: function () { return figPlan(P, null); } },
      { texto: s85 ? { es: corto(s85.id) + " pasa del 85 % en " + s85.anio + ".", en: corto(s85.id) + " passes 85 % in " + s85.anio + "." } : { es: "Nada que crezca pasa del 85 %.", en: "Nothing growing passes 85 %." }, fig: function () { return figPlan(P, 85); } },
      { texto: s100 ? { es: corto(s100.id) + " se llena en " + s100.anio + ".", en: corto(s100.id) + " fills up in " + s100.anio + "." } : { es: "Nada llega al 100 % antes de " + (P.hasta + 1) + ".", en: "Nothing reaches 100 % before " + (P.hasta + 1) + "." }, fig: function () { return figPlan(P, 100); } }
    ];
    if (llenos.length) pasos.push({ texto: { es: llenos.length + " elementos ya nacen llenos (" + corto(llenos[0].id) + "…).", en: llenos.length + " elements start already full (" + corto(llenos[0].id) + "…)." },
      fig: '<div class="pq-bars">' + llenos.slice(0, 6).map(function (e) { return barra(e.pct_inicio, 100, sevOc(e.pct_inicio / 100), esc(corto(e.id)), pct(e.pct_inicio, 0)); }).join("") + '</div>' });
    if ((P.hoja_ruta || []).length) pasos.push({ texto: { es: "Plan: qué ampliar y cuándo.", en: "Plan: what to expand and when." }, fig: function () { return figRuta(P); } });
    return { pasos: pasos, final: { si: s100 ? false : (s85 ? null : true), sevNo: "crit",
      cifra: s100 ? String(s100.anio) : s85 ? String(s85.anio) : "> " + P.hasta,
      sub: s100 ? { es: corto(s100.id) + " al 100 %", en: corto(s100.id) + " at 100 %" } : s85 ? { es: corto(s85.id) + " al 85 %", en: corto(s85.id) + " at 85 %" } : { es: "sin saturar", en: "no saturation" },
      frase: s100 ? { es: "Se llena en " + s100.anio + ".", en: "It fills up in " + s100.anio + "." } : { es: "No se llena antes de " + (P.hasta + 1) + (s85 ? "; hay que ampliar en " + s85.anio + "." : "."), en: "It does not fill up before " + (P.hasta + 1) + (s85 ? "; expand in " + s85.anio + "." : ".") },
      detalle: function () { NOC.activarVista("planificacion"); }, detalleTxt: { es: "Ver planificación", en: "See planning" } } };
  }

  // ---------------------------------------------------------------- 4 · ¿Cumple cada servicio?
  var SLICE_ICO = { eMBB: "embb", URLLC: "urllc", mMTC: "iot", "fijo-bng": "ftth", sin_slice: "l2vpn" };
  var SLICE_N = { eMBB: "eMBB", URLLC: "URLLC", mMTC: "mMTC", "fijo-bng": { es: "Fijo", en: "Fixed" }, sin_slice: { es: "Sin slice", en: "No slice" } };
  function nomSlice(k, x) { var n = SLICE_N[k]; if (n) return t(n); var s = (x && x.nombre) || k; return s.length > 18 ? s.split(/[ (]/)[0] + " " + (s.split(" ")[1] || "") : s; }
  function margenRel(x) { var p = x.peor || {}; return esNum(p.lat_p95_ms) && esNum(p.objetivo_ms) && p.objetivo_ms > 0 ? p.lat_p95_ms / p.objetivo_ms : null; }
  function figSla(S, foco) {
    var ks = Object.keys(S);
    return '<div class="pq-sla" role="list">' + ks.map(function (k) {
      var x = S[k], p = x.peor || {}, s = x.cumple ? "ok" : (x.cumple_pct >= 95 ? "maj" : "crit"), r = margenRel(x);
      var bullet;
      if (r != null) {
        var w = Math.min(100, r * 100);
        bullet = '<span class="pq-bul" data-tip="' + esc(t({ es: "Peor P95 ", en: "Worst P95 " }) + fmt(p.lat_p95_ms, 2) + " ms / " + t({ es: "objetivo ", en: "target " }) + fmt(p.objetivo_ms, 1) + " ms") + '"><i class="pq-bg-' + (r > 1 ? "crit" : r > 0.85 ? "maj" : "ok") + '" style="width:' + w.toFixed(1) + '%"></i><b class="pq-bul-obj" aria-hidden="true"></b></span>' +
          '<span class="pq-sla-v mono">' + fmt(p.lat_p95_ms, 2) + ' / ' + fmt(p.objetivo_ms, 1) + ' ms</span>';
      } else bullet = '<span class="pq-bul pq-bul-nada"><i class="pq-bg-' + s + '" style="width:' + Math.min(100, x.cumple_gbps_pct || 0).toFixed(1) + '%"></i></span><span class="pq-sla-v mono">' + pct(x.cumple_gbps_pct, 0) + '</span>';
      return '<div role="listitem" class="pq-sla-f' + (foco === k ? " foco" : "") + '">' + ico(SLICE_ICO[k] || "red", 22) + '<span class="pq-sla-n">' + esc(nomSlice(k, x)) + '</span>' + bullet + sevTag(s, x.cumple ? "OK" : t({ es: "NO", en: "NO" })) + '</div>';
    }).join("") + '</div><div class="pq-ley tx2"><span><i class="pq-ley-b"></i>' + esc(t({ es: "peor latencia P95", en: "worst P95 latency" })) + '</span><span><i class="pq-ley-o"></i>' + esc(t({ es: "objetivo", en: "target" })) + '</span></div>';
  }
  function qCumple(q) {
    var r = vRes(), S = r && r.sla;
    if (!S || !Object.keys(S).length) return null;
    var ks = Object.keys(S), nOk = ks.filter(function (k) { return S[k].cumple; }).length;
    var malos = ks.filter(function (k) { return !S[k].cumple; });
    var justo = ks.filter(function (k) { return margenRel(S[k]) != null; }).sort(function (a, b) { return margenRel(S[b]) - margenRel(S[a]); })[0];
    var foco = malos[0] || justo;
    var x = S[foco], p = (x && x.peor) || {};
    var d = p.id ? (r.demandas || []).filter(function (dd) { return dd.id === p.id; })[0] : null;
    var pasos = [
      { texto: { es: nOk + " de " + ks.length + " grupos de servicio cumplen.", en: nOk + " of " + ks.length + " service groups comply." }, fig: function () { return figSla(S, null); } }
    ];
    if (foco) pasos.push({ texto: malos.length ? { es: nomSlice(foco, x) + " no cumple.", en: nomSlice(foco, x) + " does not comply." } : { es: "El más justo: " + nomSlice(foco, x) + ", " + fmt(p.lat_p95_ms, 2) + " de " + fmt(p.objetivo_ms, 1) + " ms.", en: "Tightest: " + nomSlice(foco, x) + ", " + fmt(p.lat_p95_ms, 2) + " of " + fmt(p.objetivo_ms, 1) + " ms." },
      fig: function () { return figSla(S, foco); } });
    if (d && d.enlaces && d.enlaces.length) {
      var it = d.enlaces.map(function (id) { return { tipo: "enlace", id: id }; });
      pasos.push({ red: true, enfocar: it, sev: x.cumple ? "ok" : "crit",
        texto: { es: "Su peor caso viaja por este camino.", en: "Its worst case travels along this path." },
        anotar: [{ elem: { tipo: "nodo", id: d.origen || d.ruta[0] }, texto: corto(p.id) + " · " + fmt(p.lat_p95_ms, 2) + " ms", tipo: x.cumple ? "ok" : "crit" }].concat(
          d.ruta && d.ruta.length > 1 ? [{ elem: { tipo: "nodo", id: d.ruta[d.ruta.length - 1] }, texto: corto(d.ruta[d.ruta.length - 1]), tipo: "info" }] : []) });
    }
    return { pasos: pasos, final: { si: nOk === ks.length, sevNo: "crit", cifra: nOk + "/" + ks.length, sub: { es: "grupos cumplen su SLA", en: "groups meet their SLA" },
      frase: nOk === ks.length ? { es: "Todos cumplen latencia y caudal.", en: "All meet latency and throughput." } : { es: "Falla " + malos.map(function (k) { return nomSlice(k, S[k]); }).join(", ") + ".", en: "Failing: " + malos.map(function (k) { return nomSlice(k, S[k]); }).join(", ") + "." },
      detalle: function () { NOC.activarVista("sla"); }, detalleTxt: { es: "Ver SLA", en: "See SLA" } } };
  }

  // ---------------------------------------------------------------- 5 · ¿De dónde sale este número?
  var VALORES = [
    { clave: "Z-MADRID|poblacion", n: { es: "Población de Madrid", en: "Madrid population" }, ico: "red" },
    { clave: "BNG|DL", n: { es: "Tráfico del BNG", en: "BNG traffic" }, ico: "bng" },
    { clave: "L-ANILLO-CN|capacidad_gbps", n: { es: "Capacidad del anillo", en: "Ring capacity" }, ico: "enlace" },
    { clave: "L-CORE1-METC|capacidad_gbps", n: { es: "Acometida DC Centro", en: "DC Centro feed" }, ico: "dc" }
  ];
  function LJ() { return NOC.linaje && NOC.linaje.datos ? NOC.linaje : null; }
  function valoresDisp() {
    var L = LJ(); if (!L) return [];
    var ix = L.datos.indice || {};
    return VALORES.filter(function (v) { return ix[v.clave] && L.valor(ix[v.clave]); }).map(function (v) { return { v: v, x: L.valor(ix[v.clave]) }; });
  }
  // Cadena representativa: del valor hacia atrás, siguiendo la entrada que llega a una fuente (preferencia: trazado).
  function cadena(id) {
    var L = LJ(), memo = {};
    function llega(vid, prof) {
      if (memo[vid] != null) return memo[vid];
      var v = L.valor(vid); if (!v || prof > 14) return (memo[vid] = 0);
      if (v.fuente && v.fuente.id) return (memo[vid] = v.estado === "trazado" ? 2 : 1);
      var m = 0; (v.entradas || []).forEach(function (e) { m = Math.max(m, llega(e, prof + 1)); });
      return (memo[vid] = m);
    }
    var out = [], v = L.valor(id), vistos = {};
    while (v && !vistos[v.id] && out.length < 20) {
      vistos[v.id] = 1; out.unshift(v);
      if (v.fuente || !(v.entradas || []).length) break;
      var mejor = null, pm = -1;
      v.entradas.forEach(function (e) { var p = llega(e, 0) * 10 - out.length * 0 + (L.valor(e) && L.valor(e).estado === "trazado" ? 1 : 0); if (p > pm) { pm = p; mejor = e; } });
      v = L.valor(mejor);
    }
    return out;
  }
  function etiqueta(v) {
    var CAMPO = { poblacion: { es: "Población", en: "Population" }, capacidad_gbps: { es: "Capacidad", en: "Capacity" }, DL: { es: "Tráfico DL", en: "DL traffic" }, UL: { es: "Tráfico UL", en: "UL traffic" }, km: "km" };
    if (v.elemento && v.campo && v.campo !== "valor") return (CAMPO[v.campo] ? t(CAMPO[v.campo]) : v.campo) + " · " + corto(v.elemento);
    if (v.elemento && /^[A-Z]/.test(v.elemento) && v.elemento.length < 16) return v.elemento;
    return v.id.replace(/^V-/, "");
  }
  function figCadena(ch, foco, fuente) {
    var L = LJ(), cajas = [];
    if (fuente) cajas.push({ k: "fuente", tit: t({ es: "FUENTE", en: "SOURCE" }), txt: (fuente.editor || "") + (fuente.editor ? " · " : "") + (fuente.titulo || fuente.id), sub: (ch[0].fuente && ch[0].fuente.localizador) || "", ico: "documento" });
    else cajas.push({ k: "hueco", tit: t({ es: "SIN FUENTE", en: "NO SOURCE" }), txt: ch[0].supuesto ? t({ es: "Supuesto ", en: "Assumption " }) + ch[0].supuesto : t({ es: "Hueco", en: "Gap" }), sub: "", ico: "min" });
    ch.forEach(function (v, i) {
      var f = v.formula ? L.formula(v.formula) : null;
      cajas.push({ k: i === ch.length - 1 ? "valor" : v.tipo === "dato" ? "dato" : "deriv", fx: f, tit: i === ch.length - 1 ? t({ es: "VALOR", en: "VALUE" }) : v.tipo === "dato" ? t({ es: "DATO", en: "DATA" }) : v.tipo === "supuesto" ? t({ es: "SUPUESTO", en: "ASSUMPTION" }) : t({ es: "CÁLCULO", en: "STEP" }),
        txt: grande(v.valor, v.unidad), sub: etiqueta(v), otras: Math.max(0, (v.entradas || []).length - 1), estado: v.estado, id: v.id });
    });
    // si la cadena es larga, se plegan los intermedios que no están en foco
    var vis = cajas.map(function (c, i) { return i; });
    if (cajas.length > 6) {
      var keep = {}; [0, 1, cajas.length - 2, cajas.length - 1, foco, foco - 1, foco + 1].forEach(function (i) { if (i >= 0 && i < cajas.length) keep[i] = 1; });
      vis = []; var hueco = 0;
      cajas.forEach(function (c, i) { if (keep[i]) { if (hueco) { vis.push(-hueco); hueco = 0; } vis.push(i); } else hueco++; });
    }
    return '<ol class="pq-cad">' + vis.map(function (i, n) {
      if (i < 0) return '<li class="pq-cad-plg" aria-label="' + esc((-i) + t({ es: " pasos más", en: " more steps" })) + '"><span>⋯ ' + (-i) + '</span></li>';
      var c = cajas[i], fl = n > 0 ? '<span class="pq-cad-fl' + (c.fx ? " fx" : "") + '" aria-hidden="true">' + (c.fx ? '<i>f(x)</i>' : '') + '→</span>' : '';
      return '<li class="pq-cad-c pq-cad-' + c.k + (i === foco ? " foco" : "") + (c.estado === "hueco" ? " hueco" : "") + '"' + (i === foco ? ' aria-current="step"' : '') + '>' + fl +
        '<div class="pq-cad-b"><span class="lbl">' + (c.ico ? ico(c.ico, 12) : '') + esc(c.tit) + '</span><b>' + esc(c.txt) + '</b><span class="pq-cad-s">' + esc(c.sub) + '</span>' +
        (c.otras ? '<span class="pq-cad-o tx3">+' + c.otras + ' ' + esc(t({ es: "entradas", en: "inputs" })) + '</span>' : '') + '</div></li>';
    }).join("") + '</ol>' + (cajas[foco] && cajas[foco].fx ? '<div class="pq-fx"><span class="lbl">f(x) · ' + esc(cajas[foco].fx.nombre || cajas[foco].fx.id) + '</span><code>' + esc(cajas[foco].fx.expr || "") + '</code></div>' : '');
  }
  function respuestaLinaje(clave) {
    var L = LJ(), vid = L.datos.indice[clave], v = L.valor(vid);
    if (!v) return null;
    var def = VALORES.filter(function (x) { return x.clave === clave; })[0];
    var ch = cadena(vid), base = ch[0], fu = base && base.fuente ? L.fuente(base.fuente.id) : null;
    var huecos = (v.huecos_raiz || []).length;
    var pasos = [];
    pasos.push({ texto: fu ? { es: "Empieza en una fuente externa: " + (fu.editor || fu.id) + ".", en: "It starts at an external source: " + (fu.editor || fu.id) + "." } : { es: "Empieza en un supuesto, sin fuente.", en: "It starts at an assumption, with no source." },
      fig: function () { return figCadena(ch, 0, fu); } });
    pasos.push({ texto: { es: "Dato publicado: " + grande(base.valor, base.unidad) + ".", en: "Published figure: " + grande(base.valor, base.unidad) + "." }, fig: function () { return figCadena(ch, 1, fu); } });
    // pasos intermedios: como mucho 3 (el primero, uno del medio y el penúltimo)
    var mid = []; for (var i = 1; i < ch.length - 1; i++) mid.push(i);
    if (mid.length > 3) mid = [mid[0], mid[Math.floor(mid.length / 2)], mid[mid.length - 1]];
    mid.forEach(function (i) {
      var w = ch[i], f = w.formula ? L.formula(w.formula) : null;
      pasos.push({ texto: f ? { es: "Se aplica «" + (f.nombre || f.id) + "»: " + grande(w.valor, w.unidad) + ".", en: "Apply «" + (f.nombre || f.id) + "»: " + grande(w.valor, w.unidad) + "." } : { es: "Paso intermedio: " + grande(w.valor, w.unidad) + ".", en: "Intermediate step: " + grande(w.valor, w.unidad) + "." },
        fig: function () { return figCadena(ch, i + 1, fu); } });
    });
    if (ch.length > 1) {
      var fl = v.formula ? L.formula(v.formula) : null;
      pasos.push({ texto: { es: "Y así sale el valor de " + t(def.n) + ": " + grande(v.valor, v.unidad) + ".", en: "And that gives " + t(def.n) + ": " + grande(v.valor, v.unidad) + "." }, fig: function () { return figCadena(ch, ch.length, fu); } });
    }
    if (huecos) pasos.push({ texto: { es: "Ojo: " + huecos + (huecos === 1 ? " entrada es un supuesto" : " entradas son supuestos") + " sin fuente.", en: "Note: " + huecos + (huecos === 1 ? " input is an assumption" : " inputs are assumptions") + " with no source." },
      fig: '<ul class="pq-huecos">' + v.huecos_raiz.slice(0, 5).map(function (h) { var x = L.valor(h) || { id: h }; return '<li>' + sevTag("min", t({ es: "HUECO", en: "GAP" })) + '<span>' + esc(etiqueta(x)) + '</span><span class="mono tx3">' + esc(x.supuesto || "") + '</span></li>'; }).join("") + '</ul>' });
    var traz = v.estado === "trazado";
    return { pasos: pasos, final: { si: traz ? true : v.estado === "discrepa" ? false : null, sevNo: "crit", cifra: grande(v.valor, v.unidad), sub: def.n,
      frase: traz ? { es: "Trazado hasta " + (fu ? (fu.editor || fu.id) : t({ es: "la fuente", en: "the source" })) + ".", en: "Traced back to " + (fu ? (fu.editor || fu.id) : "the source") + "." } : v.estado === "discrepa" ? { es: "El recálculo no coincide con la memoria.", en: "The recomputation does not match the report." } : { es: "Trazado en parte: quedan " + huecos + " huecos.", en: "Partly traced: " + huecos + " gaps remain." },
      detalle: function () { NOC.activarVista("trazabilidad"); if (L.abrirValor) setTimeout(function () { L.abrirValor(vid); }, 50); }, detalleTxt: { es: "Ver árbol completo", en: "See full tree" } } };
  }
  function qOrigen(q) {
    if (!LJ()) return null;
    var disp = valoresDisp();
    if (!disp.length) return null;
    var paso = {
      texto: { es: "Elige una cifra.", en: "Pick a figure." },
      fig: '<div class="pq-valores">' + disp.map(function (d) {
        return '<button type="button" class="pq-valor" data-pq-elegir="' + esc(d.v.clave) + '">' + ico(d.v.ico, 22) + '<b>' + esc(grande(d.x.valor, d.x.unidad)) + '</b><span>' + esc(t(d.v.n)) + '</span>' +
          sevTag(d.x.estado === "trazado" ? "ok" : d.x.estado === "discrepa" ? "crit" : "min", d.x.estado === "trazado" ? t({ es: "trazado", en: "traced" }) : d.x.estado === "discrepa" ? t({ es: "discrepa", en: "mismatch" }) : t({ es: "hueco", en: "gap" })) + '</button>';
      }).join("") + '</div>',
      porDefecto: function () { return disp[0].v.clave; },
      elegir: function (k) { return respuestaLinaje(k); }
    };
    return { pasos: [paso], final: null };
  }

  // ======================================================================== preguntas (tarjetas de INICIO)
  function ilAguanta() {
    var r = NOC.referencia || vRes(), m = r && NOC.ocupacionMaxima ? NOC.ocupacionMaxima(r) : { o: null }, o = esNum(m.o) ? Math.min(1.1, m.o) : 0, s = sevOc(m.o);
    var a0 = Math.PI, a = a0 - Math.min(1, o) * Math.PI, cx = 80, cy = 74, R = 46;
    var px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><path class="il-pista" d="M34 74A46 46 0 0 1 126 74"/>' +
      '<path class="il-dato pq-s-' + s + '" d="M34 74A46 46 0 0 1 ' + px.toFixed(1) + ' ' + py.toFixed(1) + '"/>' +
      '<line class="il-aguja" x1="80" y1="74" x2="' + (cx + 38 * Math.cos(a)).toFixed(1) + '" y2="' + (cy - 38 * Math.sin(a)).toFixed(1) + '"/><circle class="il-n" cx="80" cy="74" r="4"/>' +
      '<line class="il-tick" x1="' + (cx + 40 * Math.cos(a0 - 0.85 * Math.PI)).toFixed(1) + '" y1="' + (cy - 40 * Math.sin(a0 - 0.85 * Math.PI)).toFixed(1) + '" x2="' + (cx + 54 * Math.cos(a0 - 0.85 * Math.PI)).toFixed(1) + '" y2="' + (cy - 54 * Math.sin(a0 - 0.85 * Math.PI)).toFixed(1) + '"/>' +
      '<text class="il-t" x="80" y="92" text-anchor="middle">' + (esNum(m.o) ? fmt(m.o * 100, 0) + " %" : "—") + '</text></svg>';
  }
  function ilCorte() {
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><path class="il-alt" d="M30 52C30 14 130 14 130 52"/><line class="il-l" x1="30" y1="52" x2="68" y2="52"/><line class="il-l" x1="92" y1="52" x2="130" y2="52"/>' +
      '<path class="il-x" d="M74 44l12 16M86 44L74 60"/><rect class="il-n" x="22" y="44" width="16" height="16"/><path class="il-n" d="M130 42l10 10-10 10-10-10z"/>' +
      '<path class="il-fl" d="M76 22h10M82 18l4 4-4 4"/><text class="il-t" x="80" y="84" text-anchor="middle">N-1</text></svg>';
  }
  function ilLlena() {
    var P = null; try { P = plan(); } catch (e) { P = null; }
    var s = P && P.saturacion && P.saturacion[85] && P.saturacion[85].por_crecimiento;
    var e = s && P.elementos.filter(function (x) { return x.id === s.id; })[0];
    var serie = e ? e.pct : [40, 44, 48, 53, 58, 64, 70, 77, 85, 93];
    function X(i) { return 16 + i * (128 / (serie.length - 1)); } function Y(p) { return 80 - Math.min(110, p) / 110 * 66; }
    var d = serie.map(function (p, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p).toFixed(1); }).join("");
    var k = serie.findIndex ? serie.findIndex(function (p) { return p >= 85; }) : -1;
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><line class="il-umb pq-s-maj" x1="16" x2="148" y1="' + Y(85).toFixed(1) + '" y2="' + Y(85).toFixed(1) + '"/><line class="il-umb pq-s-crit" x1="16" x2="148" y1="' + Y(100).toFixed(1) + '" y2="' + Y(100).toFixed(1) + '"/>' +
      '<line class="il-eje" x1="16" x2="148" y1="80" y2="80"/><path class="il-l il-l2" d="' + d + '"/>' +
      (k >= 0 ? '<circle class="il-mk pq-s-maj" cx="' + X(k).toFixed(1) + '" cy="' + Y(serie[k]).toFixed(1) + '" r="5"/><text class="il-t" x="' + X(k).toFixed(1) + '" y="92" text-anchor="middle">' + (s ? s.anio : "") + '</text>' : '') + '</svg>';
  }
  function ilCumple() {
    var S = (vRes() || {}).sla || {}, ks = Object.keys(S).slice(0, 6);
    if (!ks.length) ks = ["a", "b", "c", "d"];
    var w = 128 / ks.length;
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><line class="il-umb" x1="12" x2="148" y1="26" y2="26"/>' + ks.map(function (k, i) {
      var x = S[k], r = x ? margenRel(x) : 0.5, h = Math.max(6, Math.min(1.15, r == null ? (x && x.cumple ? 0.5 : 1.1) : r) * 50), ok = !x || x.cumple;
      var cx = 16 + i * w + w / 2;
      return '<rect class="il-b pq-s-' + (ok ? "ok" : "crit") + '" x="' + (cx - w * 0.28).toFixed(1) + '" y="' + (76 - h).toFixed(1) + '" width="' + (w * 0.56).toFixed(1) + '" height="' + h.toFixed(1) + '"/>' +
        '<text class="il-t" x="' + cx.toFixed(1) + '" y="91" text-anchor="middle">' + (ok ? "✓" : "✕") + '</text>';
    }).join("") + '<line class="il-eje" x1="12" x2="148" y1="76" y2="76"/></svg>';
  }
  function ilOrigen() {
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><path class="il-n2" d="M12 30h22l6 6v28H12z"/><path class="il-l il-fino" d="M17 42h18M17 49h18M17 56h12"/>' +
      '<path class="il-fl" d="M46 48h14M56 44l4 4-4 4"/><rect class="il-n2" x="64" y="36" width="34" height="24"/><text class="il-t il-fx" x="81" y="53" text-anchor="middle">f(x)</text>' +
      '<path class="il-fl" d="M102 48h14M112 44l4 4-4 4"/><rect class="il-n il-valor" x="120" y="34" width="30" height="28"/><text class="il-t il-inv" x="135" y="53" text-anchor="middle">42</text></svg>';
  }
  function ilDisenar() {
    return '<svg viewBox="0 0 160 96" aria-hidden="true"><line class="il-eje" x1="12" x2="148" y1="70" y2="70"/>' +
      [16, 52, 88, 124].map(function (x) { return '<line class="il-tick" x1="' + x + '" x2="' + x + '" y1="70" y2="74"/>'; }).join("") +
      '<rect class="il-blq" x="22" y="24" width="40" height="14"/><rect class="il-blq il-blq2" x="54" y="44" width="56" height="14"/><rect class="il-blq il-blq3" x="96" y="24" width="30" height="14"/>' +
      '<path class="il-l" d="M136 12v16M128 20h16"/></svg>';
  }
  var PREGS = [
    { id: "aguanta", icono: "red", q: { es: "¿Aguanta la red hoy?", en: "Does the network hold?" }, il: ilAguanta, hacer: qAguanta,
      aria: { es: "¿Aguanta la red hoy? Hora más cargada, enlaces más llenos y tráfico servido.", en: "Does the network hold today? Busy hour, fullest links and traffic served." } },
    { id: "corte", icono: "fallo", q: { es: "¿Qué pasa si se corta…?", en: "What if … is cut?" }, il: ilCorte, hacer: qCorte,
      aria: { es: "¿Qué pasa si se corta un enlace? Elige uno y mira antes y después.", en: "What if a link is cut? Pick one and see before and after." } },
    { id: "llena", icono: "calendario", q: { es: "¿Cuándo se llena?", en: "When does it fill up?" }, il: ilLlena, hacer: qLlena,
      aria: { es: "¿Cuándo se llena? Ocupación año a año hasta 2035.", en: "When does it fill up? Utilisation year by year to 2035." } },
    { id: "cumple", icono: "ok", q: { es: "¿Cumple cada servicio?", en: "Is each service OK?" }, il: ilCumple, hacer: qCumple,
      aria: { es: "¿Cumple cada servicio? Latencia y caudal por slice, peor caso.", en: "Does each service comply? Latency and throughput per slice, worst case." } },
    { id: "origen", icono: "traza", q: { es: "¿De dónde sale este número?", en: "Where does this number come from?" }, il: ilOrigen, hacer: qOrigen,
      aria: { es: "¿De dónde sale este número? Recorre una cifra desde su fuente.", en: "Where does this number come from? Follow a figure from its source." } },
    { id: "disenar", icono: "ajustes", q: { es: "Diseñar mi escenario", en: "Design my scenario" }, il: ilDisenar,
      hacer: function () { if (NOC.escenarios && NOC.escenarios.abrir) NOC.escenarios.abrir(); else if (NOC.abrirCaso) NOC.abrirCaso(); return false; },
      aria: { es: "Diseñar mi escenario: abre el diseñador por pasos.", en: "Design my scenario: opens the step-by-step designer." } }
  ];
  function lanzar(id, opc) {
    var q = PREGS.filter(function (x) { return x.id === id; })[0];
    if (!q) return false;
    var r;
    try { r = q.hacer(q, opc || {}); } catch (e) { console.error("pregunta " + id, e); r = null; }
    if (r === false) return true;
    if (!r) { if (NOC.mensaje) NOC.mensaje(t({ es: "Sin datos para responder en este caso.", en: "No data to answer in this case." })); return false; }
    lanzarGuia(q, r.pasos, r.final);
    if (opc && opc.elegir) elegir(opc.elegir);
    return true;
  }

  // ======================================================================== INICIO en SIMPLE
  function estadoRed() {
    var r = vRes();
    if (!r) return { s: "unk", v: "—", sub: "" };
    var m = NOC.ocupacionMaxima ? NOC.ocupacionMaxima(r) : { o: r.resumen.max_ocupacion }, sp = r.resumen.pct_servida;
    var s = sp < 99 ? "crit" : sp < 99.9 ? "maj" : sevOc(m.o);
    return { s: s, v: pct(sp, sp >= 99.95 ? 0 : 1), sub: t({ es: "servido · pico ", en: "served · peak " }) + (esNum(m.o) ? pct(m.o * 100, 0) : "—") };
  }
  function estadoServ() {
    var S = (vRes() || {}).sla || {}, ks = Object.keys(S);
    if (!ks.length) return { s: "unk", v: "—", sub: "" };
    var n = ks.filter(function (k) { return S[k].cumple; }).length;
    return { s: n === ks.length ? "ok" : n >= ks.length - 1 ? "maj" : "crit", v: n + "/" + ks.length, sub: t({ es: "cumplen SLA", en: "meet SLA" }) };
  }
  function estadoDatos() {
    var C = NOC.linaje && NOC.linaje.cobertura ? NOC.linaje.cobertura("memoria") : null;
    if (!C || !C.total || !C.total.total) return { s: "unk", v: "—", sub: "" };
    var p = C.total.trazado / C.total.total * 100;
    return { s: C.total.discrepa ? "maj" : p >= 90 ? "ok" : "min", v: pct(p, 0), sub: t({ es: "trazado a fuente", en: "traced to source" }) };
  }
  function iconoEstado(id, icono, nombre, e, preg) {
    var forma = { ok: '<circle cx="28" cy="28" r="20"/>', min: '<path d="M28 7L50 47H6z"/>', maj: '<path d="M28 5l23 23-23 23L5 28z"/>', crit: '<rect x="8" y="8" width="40" height="40"/>', unk: '<path d="M10 10l36 36M46 10L10 46"/>' }[e.s] || "";
    return '<button type="button" class="pq-est pq-' + e.s + '" data-pq="est-' + id + '" data-pq-lanzar="' + preg + '" aria-label="' + esc(nombre + ": " + SEVT[e.s] + ", " + e.v + " " + e.sub) + '">' +
      '<svg class="pq-est-f" viewBox="0 0 56 56" aria-hidden="true">' + forma + '</svg>' +
      '<span class="pq-est-t">' + ico(icono, 16) + esc(nombre) + '</span><b class="pq-est-v">' + esc(e.v) + '</b><span class="pq-est-s">' + sevTag(e.s) + ' ' + esc(e.sub) + '</span></button>';
  }
  var elIni = null;
  NOC.pintarInicio = function (el) {
    if (!el) return false;
    elIni = el;
    var foco = document.activeElement && el.contains(document.activeElement) && document.activeElement.getAttribute ? document.activeElement.getAttribute("data-pq") : null;
    var sc = el.scrollTop;
    var tarj = PREGS.map(function (q, i) {
      var il = ""; try { il = q.il(); } catch (e) { il = ""; }
      return '<li><button type="button" class="pq-tj pq-tj-' + q.id + '" data-pq="' + q.id + '" data-pq-lanzar="' + q.id + '" aria-label="' + esc(t(q.aria)) + '">' +
        '<span class="pq-tj-il">' + il + '</span><span class="pq-tj-q">' + ico(q.icono, 16) + '<span>' + esc(t(q.q)) + '</span></span></button></li>';
    }).join("");
    el.innerHTML = '<div class="pq-ini">' +
      '<h1 class="pq-h1">' + esc(t({ es: "¿Qué quieres saber?", en: "What do you want to know?" })) + '</h1>' +
      '<ul class="pq-tjs" aria-label="' + esc(t({ es: "Preguntas", en: "Questions" })) + '">' + tarj + '</ul>' +
      '<section class="pq-ests" aria-label="' + esc(t({ es: "Estado ahora", en: "Status now" })) + '">' +
      iconoEstado("red", "red", t({ es: "Red", en: "Network" }), estadoRed(), "aguanta") +
      iconoEstado("serv", "embb", t({ es: "Servicios", en: "Services" }), estadoServ(), "cumple") +
      iconoEstado("datos", "traza", t({ es: "Datos", en: "Data" }), estadoDatos(), "origen") + '</section></div>';
    el.scrollTop = sc;
    if (foco) { var b = el.querySelector('[data-pq="' + foco + '"]'); if (b) b.focus({ preventScroll: true }); }
    if (!el._pq) {
      el._pq = true;
      el.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-pq-lanzar]");
        if (!b || !el.querySelector(".pq-ini")) return;
        b.focus();
        lanzar(b.getAttribute("data-pq-lanzar"));
      });
      el.addEventListener("keydown", function (ev) {
        if (!el.querySelector(".pq-ini") || G.activo) return;
        var tj = Array.prototype.slice.call(el.querySelectorAll(".pq-tj")), i = tj.indexOf(document.activeElement);
        if (i >= 0 && /^Arrow/.test(ev.key)) {
          var cols = Math.max(1, Math.round(el.querySelector(".pq-tjs").offsetWidth / (tj[0].offsetWidth + 1)));
          var j = i + ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols })[ev.key];
          if (j >= 0 && j < tj.length) { ev.preventDefault(); tj[j].focus(); }
        }
      });
    }
    return true;
  };

  NOC.preguntas = {
    lista: function () { return PREGS.map(function (q) { return { id: q.id, q: q.q }; }); },
    lanzar: lanzar, cerrar: function () { cerrar(); },
    estado: function () { return { activo: G.activo, pregunta: G.q && G.q.id, paso: G.i, pasos: G.pasos.length, final: G.enFinal }; }
  };
  // repintar INICIO al cambiar de nivel o idioma si está a la vista
  function repintar() { if (elIni && !elIni.hidden && NOC.nivel !== "experto") NOC.pintarInicio(elIni); }
  if (NOC.on) { NOC.on("lang", function () { repintar(); if (G.activo) { if (G.enFinal) mostrarFinal(); else pintarPaso(); } }); }
  // invalidar cachés si cambia el caso
  if (NOC.on) NOC.on("resultado", function () { CACHE.antes = null; });
  // primer pintado si INICIO ya estaba abierto al cargar este archivo
  setTimeout(function () {
    var el = document.getElementById("vista-inicio");
    if (el && !el.hidden && NOC.nivel !== "experto" && !el.querySelector(".pq-ini")) NOC.pintarInicio(el);
  }, 0);
})();
