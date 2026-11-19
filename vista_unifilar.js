// vista_unifilar.js — PLANO SISTEMA (CONTRATO_UI Revisión 5, dueño PLANOS; PLAN_v3 §2.2).
// Esquema unifilar por capas en columnas, como el unifilar de PowerFactory con cajas de resultado:
//   ACCESO (zona: radio/fijo; sitios de servicio) → AGREGACIÓN → ANILLO METRO → EDGE / DC (+ BNG/UPF/IMS) → IX
// Una caja por elemento con carga / capacidad / % / latencia; líneas con grosor por tráfico y color por ocupación
// o por clase de servicio dominante; flujo animado discreto (guiones, velocidad ∝ carga, desactivable); fallos con
// línea discontinua y caja rayada. Clic = NOC.seleccionar (ficha); clic dcho. = fallo (LAB). Sigue al reloj.
// Layout determinista (solo depende de RED): grupos por nodo metro en el orden del anillo, zonas en el orden de su AGG.
// Repintado por paso: solo atributos y textos de los elementos ya creados.
// Columna de acceso: NOC.resultado.acceso + window.EMPL si existen (agente ACCESO); si no, demandas del motor por zona.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista) return;
  var RED = NOC.RED, t = NOC.t, fmt = NOC.fmt, esc = NOC.esc;
  var ID = "unifilar";
  var SVGNS = "http://www.w3.org/2000/svg";
  var CLASES = (window.Motor && window.Motor.CLASES_SERVICIO) || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var NOMSV = {
    movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo", en: "Fixed FTTH" }, voz: { es: "Voz", en: "Voice" },
    urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT / mMTC", en: "IoT / mMTC" }, empresa: { es: "Empresa", en: "Enterprise" },
    evento: { es: "Evento", en: "Event" }, ntn: { es: "Satélite NTN", en: "NTN satellite" } };
  var KM_MS = 0.005;   // mismo valor que motor.js (propagación en fibra)

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function css(n, d) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d || "#888"; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); return pad(Math.floor(m / 60) % 24) + ":" + pad(m % 60); }
  function gb(x) { return esNum(x) ? fmt(x, x >= 100 ? 0 : x >= 10 ? 1 : 2) : "—"; }
  function S(tag, at, padre) {
    var n = document.createElementNS(SVGNS, tag);
    if (at) Object.keys(at).forEach(function (k) { if (at[k] != null) n.setAttribute(k, at[k]); });
    if (padre) padre.appendChild(n);
    return n;
  }
  function setA(n, k, v) { v = String(v); if (n.getAttribute(k) !== v) n.setAttribute(k, v); }
  function setT(n, v) { if (n.textContent !== v) n.textContent = v; }

  // ---------- estado de la vista (localStorage["noc.unif"]) ----------
  var est = (function () {
    var g = {};
    try { g = JSON.parse(leer("noc.unif") || "{}") || {}; } catch (e) { g = {}; }
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return { color: g.color === "servicio" ? "servicio" : "ocup", flujo: g.flujo == null ? !reducido : !!g.flujo,
      zoom: g.zoom === "1" || g.zoom === "todo" ? g.zoom : "ajustar", ley: !!g.ley };
  })();
  function guardarEst() { guardar("noc.unif", JSON.stringify(est)); }

  // ---------- geometría ----------
  var M = 14, CAB = 30;
  var COLS = [
    { id: "acc", w: 156, n: { es: "Acceso", en: "Access" } },
    { id: "agg", w: 124, n: { es: "Agregación", en: "Aggregation" } },
    { id: "met", w: 146, wb: 116, n: { es: "Anillo metro", en: "Metro ring" } },
    { id: "dc", w: 142, n: { es: "Edge / DC / núcleo", en: "Edge / DC / core" } },
    { id: "ix", w: 116, n: { es: "Interconexión", en: "Interconnection" } }
  ];
  var GAP = 50;
  (function () { var x = M; COLS.forEach(function (c, i) { c.i = i; c.x = x; x += c.w + GAP; }); })();
  var COLI = {}; COLS.forEach(function (c) { COLI[c.id] = c; });
  var H_GR = 42, H_SITE = 20, PITCH_GR = 48, PITCH_SITE = 24, GRUPO_GAP = 14, H_NUC = 32;

  var CAJAS = {}, LINEAS = [], LIN = {}, NAT = { w: 0, h: 0 };
  var IDX = NOC.idx;

  function colNodo(n) {
    switch (n.tipo) { case "agg": return "agg"; case "metro": return "met"; case "edge": case "core": return "dc"; case "ix": return "ix"; case "site": return "acc"; }
    return "dc";
  }
  function layout() {
    CAJAS = {}; LINEAS = []; LIN = {};
    var nodos = RED.nodos || [], enl = RED.enlaces || [];
    var metros = nodos.filter(function (n) { return n.tipo === "metro"; });
    // orden del anillo: se recorre desde el primer metro siguiendo los enlaces wdm
    var anillo = [], vecinos = {};
    enl.forEach(function (e) {
      if (e.tipo !== "wdm") return;
      (vecinos[e.a] = vecinos[e.a] || []).push(e.b); (vecinos[e.b] = vecinos[e.b] || []).push(e.a);
    });
    if (metros.length) {
      var cur = metros[0].id, prev = null;
      while (cur && anillo.indexOf(cur) < 0) {
        anillo.push(cur);
        var sig = (vecinos[cur] || []).filter(function (v) { return v !== prev && anillo.indexOf(v) < 0; });
        prev = cur; cur = sig.length ? sig.sort(function (a, b) { return metros.findIndex(function (m) { return m.id === a; }) - metros.findIndex(function (m) { return m.id === b; }); })[0] : null;
      }
      metros.forEach(function (m) { if (anillo.indexOf(m.id) < 0) anillo.push(m.id); });
    }
    // AGG → metro (backhaul), sitio → metro (acceso), zona → AGG
    var aggMet = {}, siteMet = {};
    enl.forEach(function (e) {
      var na = IDX.nodos[e.a], nb = IDX.nodos[e.b];
      if (!na || !nb) return;
      if (na.tipo === "agg" && nb.tipo === "metro" && !aggMet[na.id]) aggMet[na.id] = nb.id;
      if (nb.tipo === "agg" && na.tipo === "metro" && !aggMet[nb.id]) aggMet[nb.id] = na.id;
      if (na.tipo === "site" && nb.tipo === "metro" && !siteMet[na.id]) siteMet[na.id] = nb.id;
      if (nb.tipo === "site" && na.tipo === "metro" && !siteMet[nb.id]) siteMet[nb.id] = na.id;
    });
    var zonasDeAgg = {};
    (RED.zonas || []).forEach(function (z) { if (z.agg) (zonasDeAgg[z.agg] = zonasDeAgg[z.agg] || []).push(z); });
    var aggs = nodos.filter(function (n) { return n.tipo === "agg"; });
    var sites = nodos.filter(function (n) { return n.tipo === "site"; });

    function caja(id, tipo, col, y, h, extra) {
      var c = COLI[col], w = c.wb || c.w;
      var b = { id: id, tipo: tipo, col: col, x: c.x, y: y, w: w, h: h, izq: [], der: [] };
      if (extra) Object.keys(extra).forEach(function (k) { b[k] = extra[k]; });
      CAJAS[id] = b; return b;
    }
    var y = M + CAB;
    var grupos = anillo.map(function (mid) { return { met: mid, aggs: aggs.filter(function (a) { return aggMet[a.id] === mid; }), sites: sites.filter(function (s) { return siteMet[s.id] === mid; }) }; });
    var sueltosA = aggs.filter(function (a) { return !aggMet[a.id]; }), sueltosS = sites.filter(function (s) { return !siteMet[s.id]; });
    if (sueltosA.length || sueltosS.length) grupos.push({ met: null, aggs: sueltosA, sites: sueltosS });
    grupos.forEach(function (g) {
      var y0 = y;
      g.aggs.forEach(function (a) {
        var zs = zonasDeAgg[a.id] || [];
        if (zs.length) zs.forEach(function (z, k) { caja(z.id, "zona", "acc", y + k * PITCH_GR, H_GR, { zona: z }); });
        caja(a.id, "agg", "agg", y, H_GR, { nodo: a });
        y += Math.max(1, zs.length) * PITCH_GR;
      });
      g.sites.forEach(function (s) { caja(s.id, "site", "acc", y, H_SITE, { nodo: s }); y += PITCH_SITE; });
      if (g.met) {
        var mn = IDX.nodos[g.met], centro = (y0 + y - (y > y0 ? 8 : 0)) / 2;
        caja(g.met, "metro", "met", Math.max(y0, Math.round(centro - H_GR / 2)), H_GR, { nodo: mn });
        if (y - y0 < H_GR + 8) y = y0 + H_GR + 8;
      }
      g.y0 = y0; g.y1 = y - 8;
      y += GRUPO_GAP;
    });
    var yAcc = y;
    // columna DC: edge en la altura de su metro; core en la media de sus metros; luego núcleo (BNG/UPF/IMS)
    function vecinosCol(id, col) {
      var o = [];
      enl.forEach(function (e) {
        var otro = e.a === id ? e.b : e.b === id ? e.a : null;
        if (otro && CAJAS[otro] && CAJAS[otro].col === col) o.push(CAJAS[otro]);
      });
      return o;
    }
    function resolver(lista, col, hueco) {
      lista.sort(function (a, b) { return a.d - b.d || (a.id < b.id ? -1 : 1); });
      var fondo = M + CAB - hueco;
      lista.forEach(function (x) { var yy = Math.max(Math.round(x.d), fondo + hueco); x.b = caja(x.id, x.tipo, col, yy, x.h, x.extra); fondo = yy + x.h; });
      return fondo;
    }
    var dcs = nodos.filter(function (n) { return n.tipo === "edge" || n.tipo === "core"; }).map(function (n) {
      var v = vecinosCol(n.id, "met"), d = v.length ? v.reduce(function (s, b) { return s + b.y; }, 0) / v.length : yAcc;
      return { id: n.id, tipo: n.tipo, d: d + (n.tipo === "core" ? 0.5 : 0), h: H_GR, extra: { nodo: n } };
    });
    var fondoDC = resolver(dcs, "dc", 10);
    NUCLEO.forEach(function (k, i) { caja("NUC-" + k, "nucleo", "dc", fondoDC + 24 + i * (H_NUC + 6), H_NUC, { nuc: k }); });
    var ixs = nodos.filter(function (n) { return n.tipo === "ix"; }).map(function (n) {
      var v = vecinosCol(n.id, "dc"), d = v.length ? v.reduce(function (s, b) { return s + b.y; }, 0) / v.length : yAcc;
      return { id: n.id, tipo: n.tipo, d: d, h: H_GR, extra: { nodo: n } };
    });
    var fondoIX = resolver(ixs, "ix", 14);
    // nodos de otro tipo sin columna conocida: al final del acceso
    nodos.forEach(function (n) { if (!CAJAS[n.id]) { caja(n.id, n.tipo, colNodo(n), y, H_SITE, { nodo: n }); y += PITCH_SITE; } });

    // ---------- líneas ----------
    (RED.zonas || []).forEach(function (z) {
      if (CAJAS[z.id] && z.agg && CAJAS[z.agg]) LINEAS.push({ id: "ACC:" + z.id, virtual: true, zona: z.id, izq: CAJAS[z.id], der: CAJAS[z.agg] });
    });
    enl.forEach(function (e) {
      var A = CAJAS[e.a], B = CAJAS[e.b];
      if (!A || !B) return;
      var ia = COLI[A.col].i, ib = COLI[B.col].i;
      if (ia === ib) LINEAS.push({ id: e.id, e: e, mismo: true, izq: A.y <= B.y ? A : B, der: A.y <= B.y ? B : A });
      else LINEAS.push({ id: e.id, e: e, izq: ia < ib ? A : B, der: ia < ib ? B : A, aIzq: ia < ib });
    });
    // puertos: lado derecho del extremo izquierdo, lado izquierdo del extremo derecho, ordenados por la altura del otro extremo
    LINEAS.forEach(function (l) { if (!l.mismo) { l.izq.der.push(l); l.der.izq.push(l); } });
    Object.keys(CAJAS).forEach(function (k) {
      var b = CAJAS[k];
      function repartir(lista, lado) {
        lista.sort(function (p, q) { var a = lado === "der" ? p.der : p.izq, c = lado === "der" ? q.der : q.izq; return (a.y - c.y) || (p.id < q.id ? -1 : 1); });
        var n = lista.length, top = b.y + (b.tipo === "metro" && lado === "der" ? 16 : 7), alto = b.y + b.h - 6 - top;
        lista.forEach(function (l, i) { var yy = top + alto * (i + 0.5) / n; if (lado === "der") l.y1 = yy; else l.y2 = yy; });
      }
      repartir(b.der, "der"); repartir(b.izq, "izq");
    });
    // anillo: tramos verticales entre metros consecutivos; el cierre por un carril a la derecha de la columna
    var metCol = COLI.met, xRing = metCol.x + metCol.wb / 2, xCierre = metCol.x + metCol.wb + 16;
    LINEAS.forEach(function (l) {
      var x1, y1, x2, y2;
      if (l.mismo) {
        var a = l.izq, b = l.der, consecutivos = anillo.indexOf(b.id) - anillo.indexOf(a.id) === 1;
        if (a.col === "met" && consecutivos) {
          l.d = "M" + xRing + " " + (a.y + a.h) + "V" + b.y;
          l.lab = { x: xRing + 6, y: (a.y + a.h + b.y) / 2 + 4, anc: "start" };
        } else {
          var xr = a.x + a.w, yA = a.y + 8, yB = b.y + 8, xc = a.col === "met" ? xCierre : xr + 12;
          l.d = "M" + xr + " " + yA + "H" + xc + "V" + yB + "H" + xr;
          l.lab = { x: xc + 4, y: (yA + yB) / 2 + 4, anc: "start" };
        }
        return;
      }
      x1 = l.izq.x + l.izq.w; y1 = l.y1; x2 = l.der.x; y2 = l.y2;
      var salto = COLI[l.der.col].i - COLI[l.izq.col].i;
      if (Math.abs(y1 - y2) < 0.5) { l.d = "M" + x1 + " " + y1 + "H" + x2; return; }
      if (salto > 1 && !(l.e && l.e.tipo === "sat")) {
        // recto por el hueco de las columnas intermedias y curva solo en el último hueco
        var xg = x2 - GAP;
        l.d = "M" + x1 + " " + y1 + "H" + xg + "C" + (xg + GAP / 2) + " " + y1 + " " + (x2 - GAP / 2) + " " + y2 + " " + x2 + " " + y2;
        return;
      }
      var dx = Math.max(GAP / 2, (x2 - x1) * 0.5);
      l.d = "M" + x1 + " " + y1 + "C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2;
    });
    LINEAS.forEach(function (l) { LIN[l.id] = l; });
    var maxY = Math.max(yAcc, fondoDC + (NUCLEO.length ? 24 + NUCLEO.length * (H_NUC + 6) : 0), fondoIX) + M;
    NAT.w = COLS[COLS.length - 1].x + COLS[COLS.length - 1].w + M; NAT.h = maxY;
    NAT.grupos = grupos;
  }
  var NUCLEO = [];   // ["BNG","UPF","IMS"] cuando hay resultado.acceso.nucleo

  // ---------- cálculo por paso ----------
  function R() { return NOC.resultado || null; }
  function resN(id) { var r = R(); return r && r.nodos ? r.nodos[id] : null; }
  function resE(id) { var r = R(); return r && r.enlaces ? r.enlaces[id] : null; }
  var LAT = {}, ZON = {};
  function calcularPaso() {
    LAT = {}; ZON = {};
    var r = R(); if (!r) return;
    (r.demandas || []).forEach(function (d) {
      var cs = d.caminos && d.caminos.length ? d.caminos : (d.ruta ? [{ ruta: d.ruta, latencia_ms: d.latencia_ms }] : []);
      cs.forEach(function (c) {
        if (!esNum(c.latencia_ms)) return;
        (c.ruta || []).forEach(function (n) { if (!(LAT[n] >= c.latencia_ms)) LAT[n] = c.latencia_ms; });
        if (d.zona && !(LAT[d.zona] >= c.latencia_ms)) LAT[d.zona] = c.latencia_ms;
      });
      if (d.zona) {
        var z = ZON[d.zona] || (ZON[d.zona] = { dl: 0, servida: 0, cls: {} });
        z.dl += d.dl_gbps || 0; z.servida += d.servida_gbps || 0;
        var k = d.clase_servicio || "otro"; z.cls[k] = (z.cls[k] || 0) + (d.dl_gbps || 0);
      }
    });
    // acceso por zona (agente ACCESO): radio/fijo y utilización máxima de sus sitios
    var A = r.acceso, E = window.EMPL;
    if (A && A.sitios && E && Array.isArray(E.sitios)) {
      E.sitios.forEach(function (s) {
        var x = A.sitios[s.id], z = ZON[s.zona];
        if (!x || !z) return;
        var fijo = s.tec === "ftth", radio = /^n\d+$/.test(s.tec || "");
        if (!fijo && !radio) return;
        var k = fijo ? "fijo" : "radio";
        z["acc_" + k] = (z["acc_" + k] || 0) + (x.dl_mbps || 0) / 1000;
        if (esNum(x.util_pct)) { var u = "util_" + k; if (!(z[u] >= x.util_pct)) z[u] = x.util_pct; }
      });
    }
  }
  function ocup(r) { return NOC.ocupacion(r); }
  function sevO(o, caido) { return NOC.sevOcupacion(o, caido); }
  function sevPct(p) { return !esNum(p) ? "unk" : p >= 99.5 ? "ok" : p >= 95 ? "min" : p >= 80 ? "maj" : "crit"; }
  function sevUtil(u) { return !esNum(u) ? "unk" : u > 100.01 ? "crit" : u >= 85 ? "maj" : u >= 60 ? "min" : "ok"; }
  function cargaLinea(l) {
    if (l.virtual) { var z = ZON[l.zona]; return { g: z ? z.dl : 0, ab: 0, ba: z ? z.dl : 0, dom: z ? domCls(z.cls) : null, o: null, caido: false }; }
    var r = resE(l.id) || {};
    var ab = r.carga_ab || 0, ba = r.carga_ba || 0, dom = null, md = 0;
    if (r.por_servicio) CLASES.forEach(function (c) { var p = r.por_servicio[c]; if (!p) return; var m = Math.max(p.ab, p.ba); if (m > md) { md = m; dom = c; } });
    return { g: Math.max(ab, ba, r.carga_gbps || 0), ab: ab, ba: ba, dom: dom, o: ocup(r), caido: !!r.caido, r: r };
  }
  function domCls(cls) { var dom = null, m = 0; Object.keys(cls || {}).forEach(function (k) { if (cls[k] > m) { m = cls[k]; dom = k; } }); return dom; }
  function grosor(g) { return Math.max(1, Math.min(8, 1 + 1.5 * Math.log10(1 + Math.max(0, g)))); }

  // ---------- DOM ----------
  var el = null, svg = null, gLin = null, gFlu = null, gCaj = null, gLab = null, gSel = null, tipEl = null, montado = false, activa = false, sucio = true;
  var C = {};
  function leerTokens() {
    ["ok", "min", "maj", "crit", "unk", "tx1", "tx2", "tx3", "tx4", "bg0", "bg1", "bg2", "line", "line2", "line3"].forEach(function (k) { C[k] = css("--" + k); });
    CLASES.forEach(function (c) { C["sv-" + c] = css("--sv-" + c); });
  }
  function colorSev(s) { return C[s] || C.tx3; }

  function construir() {
    var cont = el.querySelector(".uf-lienzo");
    cont.innerHTML = "";
    svg = S("svg", { class: "uf-svg", role: "img", "aria-label": t({ es: "Esquema unifilar de la red por capas", en: "Single-line diagram of the network by layer" }) }, cont);
    var defs = S("defs", null, svg);
    var pat = S("pattern", { id: "uf-rayado", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    S("rect", { width: 6, height: 6, fill: C.bg1 }, pat);
    S("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: C.line3, "stroke-width": 2 }, pat);
    // cabeceras de columna y bandas de grupo
    var gCab = S("g", { class: "uf-cab" }, svg);
    COLS.forEach(function (c) {
      S("text", { x: c.x, y: M + 12, class: "uf-colt" }, gCab).textContent = t(c.n).toUpperCase();
      S("line", { x1: c.x, x2: c.x + c.w, y1: M + 18, y2: M + 18, class: "uf-colr" }, gCab);
    });
    (NAT.grupos || []).forEach(function (g, i) {
      if (i > 0) S("line", { x1: M, x2: NAT.w - M, y1: g.y0 - GRUPO_GAP / 2, y2: g.y0 - GRUPO_GAP / 2, class: "uf-sep" }, gCab);
    });
    gSel = S("g", { class: "uf-sel" }, svg);
    gLin = S("g", { class: "uf-lineas" }, svg);
    gFlu = S("g", { class: "uf-flujos" + (est.flujo ? "" : " off") }, svg);
    gLab = S("g", { class: "uf-etq" }, svg);
    gCaj = S("g", { class: "uf-cajas" }, svg);
    LINEAS.forEach(function (l) {
      l._k = null;
      l.n = S("path", { d: l.d, class: "uf-l" + (l.virtual ? " virt" : ""), "data-l": l.id }, gLin);
      l.f = S("path", { d: l.d, class: "uf-f", "data-l": l.id }, gFlu);
      l.h = S("path", { d: l.d, class: "uf-golpe", "data-l": l.id }, gLin);
      if (l.lab) { l.t = S("text", { x: l.lab.x, y: l.lab.y, "text-anchor": l.lab.anc, class: "uf-lt" }, gLab); }
    });
    Object.keys(CAJAS).forEach(function (k) {
      var b = CAJAS[k]; b.seg = null;
      var g = S("g", { class: "uf-caja t-" + b.tipo, "data-c": b.id, transform: "translate(" + b.x + " " + b.y + ")" }, gCaj);
      b.g = g;
      b.r = S("rect", { x: 0.5, y: 0.5, width: b.w - 1, height: b.h - 1, class: "uf-r" }, g);
      var chica = b.h < 30;
      b.t1 = S("text", { x: 6, y: chica ? 14 : 13, class: "uf-id" + (chica ? " uf-id-s" : "") }, g);
      setT(b.t1, rotulo(b));
      b.bd = S("g", { class: "uf-bd" }, g);
      b.bdr = S("rect", { x: b.w - 38, y: 4, width: 33, height: 12 }, b.bd);
      b.bdt = S("text", { x: b.w - 21.5, y: 13, "text-anchor": "middle" }, b.bd);
      if (b.h >= H_GR) {
        b.t2 = S("text", { x: 6, y: 25, class: "uf-v" }, g);
        b.t2r = S("text", { x: b.w - 6, y: 25, class: "uf-v uf-dim", "text-anchor": "end" }, g);
        b.mf = S("rect", { x: 6, y: 31, width: b.w - 48, height: 5, class: "uf-mf" }, g);
        b.mb = S("g", null, g);
        b.m = S("rect", { x: 6, y: 31, width: 0, height: 5 }, b.mb);
        b.t3 = S("text", { x: b.w - 6, y: 37, class: "uf-v", "text-anchor": "end" }, g);
      } else if (chica) {
        b.t2 = null;
        b.t2r = S("text", { x: b.w - 42, y: 14, class: "uf-v", "text-anchor": "end" }, g);
      } else {
        b.t2 = S("text", { x: 6, y: 26, class: "uf-v" }, g);
        b.t2r = S("text", { x: b.w - 6, y: 26, class: "uf-v uf-dim", "text-anchor": "end" }, g);
      }
    });
    escalar();
  }
  function rotulo(b) {
    if (b.tipo === "zona") { var n = b.zona.nombre || b.id; return n.length > 17 ? n.slice(0, 16) + "…" : n; }
    if (b.tipo === "nucleo") return b.nuc;
    var id = b.id.replace(/^SITE-/, "").replace(/^AGG-/, "").replace(/^MET-/, "MET ").replace(/^EDGE-/, "EDGE ").replace(/^IX-/, "IX ");
    var mx = b.h < 30 ? 15 : 17;
    return id.length > mx ? id.slice(0, mx - 1) + "…" : id;
  }
  function insignia(b, sev, txt) {
    if (!sev) { b.bd.setAttribute("display", "none"); return; }
    b.bd.removeAttribute("display");
    setA(b.bdr, "fill", sev === "unk" ? C.bg2 : colorSev(sev));
    setA(b.bdr, "stroke", sev === "unk" ? C.tx3 : "none");
    setA(b.bdt, "fill", sev === "unk" ? C.tx1 : "#000");
    setT(b.bdt, txt || { ok: "OK", min: "MIN", maj: "MAJ", crit: "CRIT", unk: "DOWN" }[sev]);
  }
  function medidor(b, frac, color) {
    if (!b.m) return;
    if (frac == null) { b.mb.setAttribute("display", "none"); b.mf.setAttribute("display", "none"); return; }
    b.mb.removeAttribute("display"); b.mf.removeAttribute("display");
    var w = (b.w - 48) * Math.max(0, Math.min(1, frac));
    setA(b.m, "width", w.toFixed(1)); setA(b.m, "fill", color);
  }
  function apilado(b, cls, total) {
    // barra apilada por clase de servicio (zona sin datos de acceso); reutiliza segmentos
    if (!b.m) return;
    b.mf.removeAttribute("display"); b.mb.removeAttribute("display");
    b.m.setAttribute("width", 0);
    if (!b.seg) { b.seg = {}; CLASES.forEach(function (c) { b.seg[c] = S("rect", { y: 31, height: 5, fill: C["sv-" + c] }, b.mb); }); }
    var x = 6, W = b.w - 48;
    CLASES.forEach(function (c) {
      var w = total > 0 ? W * (cls[c] || 0) / total : 0;
      setA(b.seg[c], "x", x.toFixed(1)); setA(b.seg[c], "width", Math.max(0, w - (w > 2 ? 1 : 0)).toFixed(1)); x += w;
    });
  }
  function pintarCaja(b) {
    var sel = NOC.seleccion && NOC.seleccion.id === b.id;
    b.g.classList.toggle("sel", !!sel);
    if (b.tipo === "zona") {
      var z = ZON[b.id] || { dl: 0, servida: 0, cls: {} }, rz = R() && R().zonas ? R().zonas[b.id] : null;
      var pct = rz ? rz.pct : (z.dl > 0 ? 100 * z.servida / z.dl : null), sv = sevPct(pct);
      insignia(b, sv === "ok" ? null : sv, sv === "unk" ? "—" : fmt(pct, 0) + "%");
      if (esNum(z.acc_radio) || esNum(z.acc_fijo)) {
        setT(b.t2, "5G " + gb(z.acc_radio) + " · FTTH " + gb(z.acc_fijo));
        var u = Math.max(z.util_radio || 0, z.util_fijo || 0);
        medidor(b, u / 100, colorSev(sevUtil(u)));
        if (b.seg) CLASES.forEach(function (c) { b.seg[c].setAttribute("width", 0); });
        setT(b.t3, "util " + fmt(u, 0) + " %");
      } else {
        var mov = (z.cls.movil || 0), fij = (z.cls.ftth || 0);
        setT(b.t2, "5G " + gb(mov) + " · FTTH " + gb(fij));
        apilado(b, z.cls, z.dl);
        setT(b.t3, "Σ " + gb(z.dl));
      }
      setT(b.t2r, LAT[b.id] != null ? fmt(LAT[b.id], 2) + " ms" : "");
      b.g.classList.remove("caido");
      return;
    }
    if (b.tipo === "nucleo") {
      var A = R() && R().acceso && R().acceso.nucleo ? R().acceso.nucleo[b.nuc] : null;
      if (!A) { setT(b.t2, "—"); setT(b.t2r, ""); insignia(b, null); return; }
      var ut = A.util_pct;
      insignia(b, esNum(ut) ? sevUtil(ut) : null, esNum(ut) ? fmt(ut, 0) + "%" : null);
      setT(b.t2, b.nuc === "IMS" ? (esNum(A.caps) ? fmt(A.caps, 0) + " CAPS" : "—") : gb(A.gbps) + " Gbit/s" + (esNum(A.sesiones) ? " · " + fmt(A.sesiones, 0) + " ses." : ""));
      setT(b.t2r, "");
      return;
    }
    var r = resN(b.id) || {}, cap = r.capacidad_gbps, o = ocup(r), caido = !!r.caido;
    b.g.classList.toggle("caido", caido);
    if (caido) insignia(b, "unk");
    else insignia(b, o == null ? null : sevO(o), o == null ? null : null);
    var carga = gb(r.carga_gbps) + (esNum(cap) ? " / " + gb(cap) : "") + " G";
    if (!b.t2) {   // caja de una línea (sitio de servicio): la cifra se arrima a la insignia si la hay
      setA(b.t2r, "x", caido || o != null ? b.w - 42 : b.w - 6);
      setT(b.t2r, caido ? "" : gb(r.carga_gbps) + " G");
      return;
    }
    setT(b.t2, caido ? "DOWN" : carga);
    var lat = LAT[b.id] != null ? fmt(LAT[b.id], 2) + " ms" : "";
    if (b.t3) {
      setT(b.t2r, lat);
      if (o != null && !caido) { medidor(b, o, colorSev(sevO(o))); setT(b.t3, fmt(o * 100, 1) + " %"); }
      else { medidor(b, null); setT(b.t3, caido ? "" : t({ es: "sin límite", en: "no limit" })); }
    } else setT(b.t2r, o != null && !caido ? fmt(o * 100, 0) + " %" : "");
  }
  var NIV = [0.1, 1, 10, 100, 1000];
  function pintarLinea(l) {
    var c = cargaLinea(l), sel = NOC.seleccion && (NOC.seleccion.id === l.id || (l.virtual && NOC.seleccion.id === l.zona && NOC.seleccion.tipo === "zona"));
    var col;
    if (c.caido) col = C.unk;
    else if (est.color === "servicio") col = c.dom ? C["sv-" + c.dom] : C.tx3;
    else col = l.virtual ? C.tx3 : (c.o == null ? C.tx2 : colorSev(sevO(c.o)));
    var w = c.caido ? 1.5 : grosor(c.g);
    if (l.e && l.e.tipo === "sat" && !c.caido) w = Math.max(1, w);
    setA(l.n, "stroke", col); setA(l.n, "stroke-width", w.toFixed(2));
    var dash = c.caido ? "5 4" : (l.e && l.e.tipo === "sat") ? "1 4" : "";
    if (dash) setA(l.n, "stroke-dasharray", dash); else if (l.n.hasAttribute("stroke-dasharray")) l.n.removeAttribute("stroke-dasharray");
    l.n.classList.toggle("caida", c.caido);
    l.n.classList.toggle("sel", !!sel);
    // flujo: guiones claros sobre la línea; sentido = sentido más cargado; velocidad por escalones de carga
    var vivo = !c.caido && c.g > 1e-4;
    if (!vivo) setA(l.f, "display", "none");
    else {
      if (l.f.hasAttribute("display")) l.f.removeAttribute("display");
      var nivel = 0; NIV.forEach(function (x) { if (c.g >= x) nivel++; });
      var dur = [6, 4.5, 3.2, 2.3, 1.6, 1.1][nivel];
      var haciaIzq = l.virtual ? true : l.mismo ? c.ba >= c.ab : (l.aIzq ? c.ba >= c.ab : c.ab >= c.ba);
      var k = dur + (haciaIzq ? "i" : "d");
      if (l._k !== k) { l.f.style.animationDuration = dur + "s"; l.f.style.animationDirection = haciaIzq ? "normal" : "reverse"; l._k = k; }
      setA(l.f, "stroke-width", Math.max(1, Math.min(2.4, w * 0.4)).toFixed(2));
    }
    if (l.t) setT(l.t, c.caido ? "DOWN" : (l.e ? l.e.id.replace(/^L-ANILLO-/, "") + " " : "") + (c.o == null ? "" : fmt(c.o * 100, 0) + " %"));
  }
  function pintar() {
    if (!montado) return;
    if (!activa) { sucio = true; return; }
    sucio = false;
    var r = R();
    var nuevo = r && r.acceso && r.acceso.nucleo ? ["BNG", "UPF", "IMS"].filter(function (k) { return r.acceso.nucleo[k]; }) : [];
    if (nuevo.join() !== NUCLEO.join()) { NUCLEO = nuevo; layout(); construir(); }
    calcularPaso();
    LINEAS.forEach(pintarLinea);
    Object.keys(CAJAS).forEach(function (k) { pintarCaja(CAJAS[k]); });
    pintarSel();
    pintarBarra();
  }
  function pintarSel() {
    while (gSel.firstChild) gSel.removeChild(gSel.firstChild);
    var s = NOC.seleccion;
    if (!s) return;
    var l = LIN[s.id];
    if (l) S("path", { d: l.d, class: "uf-halo", "stroke-width": (parseFloat(l.n.getAttribute("stroke-width")) || 2) + 6 }, gSel);
  }
  function escalar() {
    if (!svg) return;
    var cont = el.querySelector(".uf-lienzo");
    var disp = Math.max(200, cont.clientWidth - 14), dispH = Math.max(120, cont.clientHeight - 4);
    var k = est.zoom === "1" ? 1 : est.zoom === "todo" ? Math.min(1, disp / NAT.w, dispH / NAT.h) : Math.min(1.1, disp / NAT.w);
    svg.setAttribute("viewBox", "0 0 " + NAT.w + " " + NAT.h);
    svg.setAttribute("width", Math.round(NAT.w * k));
    svg.setAttribute("height", Math.round(NAT.h * k));
  }

  // ---------- barra superior de la vista ----------
  function etiquetaHora() {
    var m = metaUltima, r = R();
    if (m && esNum(m.t_min)) return hhmm(m.t_min);
    if (r && r.paso_reloj && esNum(r.paso_reloj.t_min)) return hhmm(r.paso_reloj.t_min);
    return t({ es: "hora cargada", en: "busy hour" });
  }
  function pintarBarra() {
    var b = el && el.querySelector(".uf-barra");
    if (!b) return;
    var r = R(), f = NOC.fallosActivos ? NOC.fallosActivos() : [];
    var hayAcc = !!(r && r.acceso && window.EMPL);
    var html =
      '<span class="uf-rot">' + esc(t({ es: "Color", en: "Colour" })) + '</span>' +
      '<button type="button" class="uf-seg" data-color="ocup" aria-pressed="' + (est.color === "ocup") + '">' + esc(t({ es: "ocupación", en: "occupancy" })) + '</button>' +
      '<button type="button" class="uf-seg" data-color="servicio" aria-pressed="' + (est.color === "servicio") + '">' + esc(t({ es: "servicio", en: "service" })) + '</button>' +
      '<span class="uf-rot">' + esc(t({ es: "Flujo", en: "Flow" })) + '</span>' +
      '<button type="button" class="uf-seg" data-flujo="1" aria-pressed="' + est.flujo + '">' + esc(est.flujo ? t({ es: "animado", en: "animated" }) : t({ es: "quieto", en: "static" })) + '</button>' +
      '<span class="uf-rot">' + esc(t({ es: "Escala", en: "Scale" })) + '</span>' +
      '<button type="button" class="uf-seg" data-zoom="ajustar" aria-pressed="' + (est.zoom === "ajustar") + '">' + esc(t({ es: "ancho", en: "width" })) + '</button>' +
      '<button type="button" class="uf-seg" data-zoom="todo" aria-pressed="' + (est.zoom === "todo") + '">' + esc(t({ es: "todo", en: "all" })) + '</button>' +
      '<button type="button" class="uf-seg" data-zoom="1" aria-pressed="' + (est.zoom === "1") + '">1:1</button>' +
      '<span class="uf-hora mono">' + esc(etiquetaHora()) + '</span>' +
      (f.length ? '<span class="sev sev-unk">' + f.length + ' DOWN</span>' : '') +
      '<span class="uf-nota tx3">' + esc(hayAcc ? t({ es: "acceso: resultado.acceso (EMPL)", en: "access: resultado.acceso (EMPL)" }) :
        t({ es: "acceso: demanda del motor por zona (sin EMPL)", en: "access: engine demand per zone (no EMPL)" })) + '</span>';
    if (b._h !== html) { b.innerHTML = html; b._h = html; }
  }
  function pintarLeyenda() {
    var lg = el && el.querySelector(".uf-leyenda");
    if (!lg) return;
    var pleg = !est.ley;
    lg.classList.toggle("plegada", pleg);
    var cuerpo = est.color === "servicio" ?
      '<div class="rot">' + esc(t({ es: "Línea: servicio dominante", en: "Line: dominant service" })) + '</div>' +
      CLASES.map(function (c) { return '<div class="fila"><i style="background:' + C["sv-" + c] + '"></i><span>' + esc(t(NOMSV[c])) + '</span></div>'; }).join("") :
      '<div class="rot">' + esc(t({ es: "Línea: ocupación", en: "Line: occupancy" })) + '</div>' +
      [["ok", "< 60 %"], ["min", "60–85 %"], ["maj", "85–100 %"], ["crit", "> 100 %"]].map(function (x) {
        return '<div class="fila"><i style="background:' + C[x[0]] + '"></i><span class="sev sev-' + x[0] + '">' + x[0].toUpperCase() + '</span><span class="mono">' + x[1] + '</span></div>';
      }).join("") + '<div class="fila"><i style="background:' + C.tx2 + '"></i><span>' + esc(t({ es: "sin capacidad dada", en: "no capacity given" })) + '</span></div>';
    lg.innerHTML = '<button type="button" class="ley-cab" aria-expanded="' + !pleg + '">' + esc(t({ es: "Leyenda", en: "Legend" })) + ' ' + (pleg ? "▸" : "▾") + '</button>' +
      '<div class="ley-cuerpo">' + cuerpo +
      '<div class="fila"><i class="disc"></i><span class="sev sev-unk">DOWN</span><span>' + esc(t({ es: "caído", en: "down" })) + '</span></div>' +
      '<div class="tx3" style="margin-top:4px">' + esc(t({ es: "Grosor ∝ log(Gbit/s del sentido más cargado). Guiones: sentido del flujo, más rápidos con más carga.", en: "Width ∝ log(Gbit/s, busier direction). Dashes: flow direction, faster with more load." })) + '</div>' +
      '<div class="tx3" style="margin-top:4px">' + esc(t({ es: "Caja: carga / capacidad (G = Gbit/s) · latencia máx. de las demandas que pasan · ocupación. Zona: DL 5G · FTTH, barra por servicio, % servido si < 99,5 %.", en: "Box: load / capacity (G = Gbit/s) · max latency of demands through it · occupancy. Zone: DL 5G · FTTH, bar by service, % served if < 99.5 %." })) + '</div>' +
      '<div class="tx3" style="margin-top:4px">' + esc(t({ es: "Clic: ficha · clic dcho.: fallo (LAB)", en: "Click: details · right-click: fault (LAB)" })) + '</div></div>';
  }

  // ---------- tooltip ----------
  function tipLinea(l) {
    var c = cargaLinea(l);
    if (l.virtual) {
      var z = IDX.zonas[l.zona] || {};
      return '<b>' + esc(z.nombre || l.zona) + ' → ' + esc(z.agg || "") + '</b><br><span class="tx2">' + esc(t({ es: "acceso agregado de la zona (no es un enlace de RED)", en: "aggregated zone access (not a RED link)" })) + '</span><br>DL ' + gb(c.g) + ' Gbit/s';
    }
    var e = l.e, r = c.r || {}, lat = esNum(e.latencia_ms) ? e.latencia_ms : esNum(e.km) ? e.km * KM_MS : null;
    var h = '<b>' + esc(e.id) + '</b> <span class="tx2">' + esc(t(NOC.TIPO_ENL[e.tipo] || { es: e.tipo })) + '</span><br>' +
      (c.caido ? '<span class="sev-unk">DOWN</span>' : gb(c.g) + ' / ' + (esNum(e.capacidad_gbps) ? gb(e.capacidad_gbps) : "—") + ' Gbit/s · ' +
        (c.o == null ? "—" : '<span class="sev-' + sevO(c.o) + '">' + fmt(c.o * 100, 1) + ' %</span>')) +
      '<br>' + esc(e.a) + ' → ' + esc(e.b) + ' ' + gb(r.carga_ab) + ' · ← ' + gb(r.carga_ba) +
      (lat != null ? '<br>' + esc(t({ es: "propagación", en: "propagation" })) + ' ' + fmt(lat, 3) + ' ms' + (esNum(e.km) ? ' (' + fmt(e.km, 1) + ' km)' : '') : '');
    if (r.por_servicio) {
      var l4 = CLASES.map(function (k) { var p = r.por_servicio[k]; return [k, p ? Math.max(p.ab, p.ba) : 0]; }).filter(function (x) { return x[1] > 1e-3; })
        .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 4);
      h += l4.map(function (x) { return '<br><i class="uf-sw" style="background:' + C["sv-" + x[0]] + '"></i>' + esc(t(NOMSV[x[0]])) + ' ' + gb(x[1]); }).join("");
    }
    return h;
  }
  function tipCaja(b) {
    if (b.tipo === "zona") {
      var z = ZON[b.id] || { dl: 0, servida: 0, cls: {} };
      var h = '<b>' + esc(b.zona.nombre) + '</b> <span class="tx2">' + esc(b.id) + '</span><br>DL ' + gb(z.dl) + ' · ' + esc(t({ es: "servido", en: "served" })) + ' ' + gb(z.servida) + ' Gbit/s';
      CLASES.filter(function (c) { return z.cls[c] > 1e-3; }).sort(function (a, c) { return z.cls[c] - z.cls[a]; }).forEach(function (c) {
        h += '<br><i class="uf-sw" style="background:' + C["sv-" + c] + '"></i>' + esc(t(NOMSV[c])) + ' ' + gb(z.cls[c]);
      });
      if (esNum(z.acc_radio) || esNum(z.acc_fijo)) h += '<br>' + esc(t({ es: "acceso", en: "access" })) + ': 5G ' + gb(z.acc_radio) + ' (util ' + (esNum(z.util_radio) ? fmt(z.util_radio, 0) : "—") + ' %) · FTTH ' + gb(z.acc_fijo) + ' (util ' + (esNum(z.util_fijo) ? fmt(z.util_fijo, 0) : "—") + ' %)';
      if (LAT[b.id] != null) h += '<br>' + esc(t({ es: "latencia máx. hasta DC", en: "max latency to DC" })) + ' ' + fmt(LAT[b.id], 2) + ' ms';
      return h;
    }
    if (b.tipo === "nucleo") return '<b>' + esc(b.nuc) + '</b><br><span class="tx2">resultado.acceso.nucleo</span>';
    var n = b.nodo || {}, r = resN(b.id) || {}, o = ocup(r);
    return '<b>' + esc(b.id) + '</b> · ' + esc(n.nombre || "") + '<br><span class="tx2">' + esc(t(NOC.TIPO_NODO[n.tipo] || { es: n.tipo })) + '</span><br>' +
      (r.caido ? '<span class="sev-unk">DOWN</span>' : gb(r.carga_gbps) + ' / ' + (esNum(r.capacidad_gbps) ? gb(r.capacidad_gbps) : "—") + ' Gbit/s' + (o != null ? ' · <span class="sev-' + sevO(o) + '">' + fmt(o * 100, 1) + ' %</span>' : '')) +
      (LAT[b.id] != null ? '<br>' + esc(t({ es: "latencia máx. de las demandas que pasan", en: "max latency of demands through it" })) + ' ' + fmt(LAT[b.id], 2) + ' ms' : '') +
      '<br><span class="tx3">' + (r.demandas ? r.demandas.length : 0) + ' ' + esc(t({ es: "demandas", en: "demands" })) + '</span>';
  }
  function objetivo(ev) {
    var c = ev.target.closest && ev.target.closest("[data-c]"), l = ev.target.closest && ev.target.closest("[data-l]");
    if (c) return { caja: CAJAS[c.getAttribute("data-c")] };
    if (l) return { linea: LIN[l.getAttribute("data-l")] };
    return null;
  }
  function moverTip(ev) {
    var o = objetivo(ev);
    if (!o || (!o.caja && !o.linea)) { tipEl.hidden = true; tipEl._o = null; return; }
    var clave = o.caja ? "c" + o.caja.id : "l" + o.linea.id;
    if (tipEl._o !== clave || ev.type === "refresco") { tipEl.innerHTML = o.caja ? tipCaja(o.caja) : tipLinea(o.linea); tipEl._o = clave; }
    tipEl.hidden = false;
    var rc = el.getBoundingClientRect(), x = ev.clientX - rc.left + 14, y = ev.clientY - rc.top + 14;
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    if (x + w > rc.width - 4) x = ev.clientX - rc.left - w - 10;
    if (y + h > rc.height - 4) y = ev.clientY - rc.top - h - 10;
    tipEl.style.left = Math.max(4, x) + "px"; tipEl.style.top = Math.max(4, y) + "px";
  }

  // ---------- registro ----------
  var metaUltima = null;
  NOC.registrarVista({
    id: ID, titulo: { es: "Plano sistema", en: "System diagram" },
    montar: function (contenedor) {
      el = contenedor;
      leerTokens();
      var r = R();
      NUCLEO = r && r.acceso && r.acceso.nucleo ? ["BNG", "UPF", "IMS"].filter(function (k) { return r.acceso.nucleo[k]; }) : [];
      layout();
      el.innerHTML = '<div class="uf-barra"></div><div class="uf-lienzo"></div><div class="mapa-leyenda uf-leyenda"></div><div class="noc-tip uf-tip" hidden></div>';
      tipEl = el.querySelector(".uf-tip");
      construir();
      montado = true;
      var lienzo = el.querySelector(".uf-lienzo");
      lienzo.addEventListener("click", function (ev) {
        var o = objetivo(ev);
        if (!o) { if (NOC.seleccion) NOC.cerrarFicha(); return; }
        if (o.caja) { var b = o.caja; if (b.tipo === "zona") NOC.seleccionar("zona", b.id); else if (b.tipo !== "nucleo") NOC.seleccionar("nodo", b.id); }
        else if (o.linea) { if (o.linea.virtual) NOC.seleccionar("zona", o.linea.zona); else NOC.seleccionar("enlace", o.linea.id); }
      });
      lienzo.addEventListener("contextmenu", function (ev) {
        var o = objetivo(ev);
        if (!o) return;
        var id = o.caja ? (o.caja.nodo ? o.caja.id : null) : (o.linea && !o.linea.virtual ? o.linea.id : null);
        if (!id) return;
        ev.preventDefault();
        if (NOC.menuOperador && NOC.menuOperador(ev, id)) return;   // Revisión 7: menú de acciones del operador (operador.js)
        NOC.alternarFallo(id);
      });
      lienzo.addEventListener("mousemove", moverTip);
      lienzo.addEventListener("mouseleave", function () { tipEl.hidden = true; tipEl._o = null; });
      el.querySelector(".uf-barra").addEventListener("click", function (ev) {
        var s = ev.target.closest(".uf-seg");
        if (!s) return;
        if (s.hasAttribute("data-color")) est.color = s.getAttribute("data-color");
        if (s.hasAttribute("data-flujo")) { est.flujo = !est.flujo; gFlu.classList.toggle("off", !est.flujo); }
        if (s.hasAttribute("data-zoom")) { est.zoom = s.getAttribute("data-zoom"); escalar(); }
        guardarEst(); pintar(); pintarLeyenda();
      });
      el.querySelector(".uf-leyenda").addEventListener("click", function (ev) {
        if (!ev.target.closest(".ley-cab")) return;
        est.ley = !est.ley; guardarEst();
        pintarLeyenda();
      });
      if (window.ResizeObserver) { var tz = 0; new ResizeObserver(function () { clearTimeout(tz); tz = setTimeout(escalar, 60); }).observe(lienzo); }
      pintarLeyenda();
    },
    activar: function () { activa = true; escalar(); if (sucio) pintar(); },
    desactivar: function () { activa = false; if (tipEl) tipEl.hidden = true; }
  });

  NOC.on("resultado", function () { metaUltima = NOC.resultadoMeta || null; pintar(); });
  NOC.on("seleccion", function () { if (montado && activa) { Object.keys(CAJAS).forEach(function (k) { var b = CAJAS[k]; b.g.classList.toggle("sel", !!(NOC.seleccion && NOC.seleccion.id === b.id)); }); LINEAS.forEach(function (l) { l.n.classList.toggle("sel", !!(NOC.seleccion && NOC.seleccion.id === l.id)); }); pintarSel(); } else sucio = true; });
  NOC.on("lang", function () { if (montado) { construir(); sucio = true; pintar(); pintarLeyenda(); } });
  NOC.on("carril", function () { if (montado) setTimeout(escalar, 0); });
  NOC.on("plegado", function (p) { if (montado && (!p || p.id === "leyenda-unif")) pintarLeyenda(); if (montado) setTimeout(escalar, 0); });
})();
