// linaje_mapa.js — mapa de procedencia (Revisión 13, trazabilidad para gente de fuera del grupo).
// Grafo en 4 columnas: Fuente → Cálculo → Cifra (por tema) → Red. Grosor = nº de cifras; color + forma = estado.
// Navegación solo con clics: fuente → cálculos → cifras → elementos de la red → ficha; migas de pan, Esc y botón atrás.
// Lee window.LINAJE y window.LINAJE_LLANO (no escribe nada). API: NOC.linajeMapa = { montar(el, opc), ir(foco), cadenaHTML(vid), redibujar() }.
// En cualquier parte de la página: [data-lm-ir="v:V-…|e:L-…|f:ine|…"] abre el mapa con esa cadena enfocada.
(function () {
  "use strict";
  if (!window.NOC) return;
  var L = window.LINAJE, LL = window.LINAJE_LLANO;
  if (!L || !LL || !Array.isArray(L.valores)) { NOC.linajeMapa = null; return; }
  function t(o) { return NOC.t ? NOC.t(o) : (o && o.es) || ""; }
  function T(es, en) { return { es: es, en: en || es }; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function cortar(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  var M = null;
  function mod() { return M || (M = LL.modelo()); }

  // ------------------------------------------------------------------ textos (≤ 3 palabras)
  var TX = {
    cifras: T("cifras de la memoria", "report figures"), buscar: T("¿De qué cifra quieres el origen?", "Which figure's origin?"),
    todo: T("Todo", "All"), atras: T("Atrás", "Back"), cerrar: T("Cerrar", "Close"),
    vieneDe: T("Viene de", "Comes from"), seUsa: T("Se usa en", "Used in"), alimenta: T("Alimenta", "Feeds"),
    entradas: T("Entradas", "Inputs"), salidas: T("Salidas", "Outputs"), docs: T("Documentos", "Documents"),
    cifrasT: T("Cifras", "Figures"), elementos: T("Elementos", "Elements"), abrirFicha: T("Abrir ficha", "Open card"),
    verMapa: T("Ver en el mapa", "See on the map"), arbol: T("Árbol completo", "Full tree"), memoria: T("Memoria", "Report"),
    recalc: T("recalculado", "recomputed"), sinRes: T("Sin resultados", "No results"), mas: T("más", "more"),
    info: T("Cada cifra de la memoria, desde su fuente hasta la parte de la red que la usa. Grosor = número de cifras. Pasa el ratón para ver la cadena; haz clic para seguirla. Esc vuelve atrás.",
      "Every report figure, from its source to the part of the network that uses it. Width = number of figures. Hover to see the chain; click to follow it. Esc goes back."),
    filtro: T("Filtrar por estado", "Filter by state"), directo: T("Dato directo", "Read directly"), supuesto: T("Supuesto", "Assumption"),
    tipo: { f: T("Fuente", "Source"), x: T("Cálculo", "Calculation"), m: T("Tema", "Topic"), p: T("Red", "Network"), v: T("Cifra", "Figure"), d: T("Documento", "Document"), e: T("Elemento", "Element") }
  };
  var COLS = [
    { c: "c1", t: "f", tit: T("Fuente", "Source"), lista: LL.FAM_FUENTE },
    { c: "c2", t: "x", tit: T("Cálculo", "Calculation"), lista: LL.FAM_FX },
    { c: "c3", t: "m", tit: T("Cifra (tema)", "Figure (topic)"), lista: LL.TEMAS },
    { c: "c4", t: "p", tit: T("Red", "Network"), lista: LL.PARTES }
  ];
  var EST = {}; LL.ESTADOS.forEach(function (e) { EST[e.k] = e; });
  var ORD_EST = ["oficial", "sup", "sinf", "discrepa"];

  // ------------------------------------------------------------------ iconos pequeños (14 px, trazo) y formas de estado
  var ICO = {
    ine: '<path d="M4 20V11M9.5 20V6M15 20V13M20.5 20V8M2.5 20h20"/>',
    cnmc: '<path d="M12 9v12M8.5 21 12 9l3.5 12"/><circle cx="12" cy="7" r="1.3"/><path d="M8 3.5a5.5 5.5 0 0 0 0 7M16 3.5a5.5 5.5 0 0 1 0 7"/>',
    boe: '<path d="M6 2.5h9l4 4v15H6z"/><path d="M15 2.5v4h4"/><circle cx="12.5" cy="14" r="3"/><path d="M11 16.5 10 20l2.5-1.2L15 20l-1-3.5"/>',
    norma: '<path d="M6 2.5h9l4 4v15H6z"/><path d="M15 2.5v4h4M9 11h7M9 14.5h7M9 18h4"/>',
    libro: '<path d="M3 5.5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM12 5.5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0z"/>',
    clase: '<path d="M2 9 12 4.5 22 9 12 13.5z"/><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M21 9v6"/>',
    grupo: '<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6M13.5 14.5c3.5-1 7 1 7.5 5"/>',
    decision: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="m7.5 12.5 3 3 6-7"/>',
    sup: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17v.5"/>',
    hueco: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 2.5"/><path d="M12 8v5M12 15.5v.5"/>',
    fx: '<path d="M14.5 4c-2.5-.5-3.5 1-4 3.5l-2 10c-.5 2.5-1.5 3.5-4 3"/><path d="M6.5 11h7M15 12l5 6M20 12l-5 6"/>',
    directo: '<path d="M3 12h16M14 7l5 5-5 5"/>',
    gente: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.6 2.7-6.2 6-6.2s6 2.6 6 6.2"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16.5 14c2.6 0 4.5 2 4.5 5"/>',
    trafico: '<path d="M7 20V5M3.5 8.5 7 5l3.5 3.5M17 4v15M13.5 15.5 17 19l3.5-3.5"/>'
  };
  var ICO_NODO = {
    f: { ine: "ine", cnmc: "cnmc", boe: "boe", "3gpp": "norma", itu: "norma", ietf: "norma", libros: "libro", enunciado: "clase", clase: "clase", grupos: "grupo", decision: "decision", sup: "sup", sinf: "hueco" },
    m: { poblacion: "gente", clientes: "embb", trafico: "trafico", voz: "voz", especiales: "evento", radio: "n78", fijo: "ftth", transporte: "metro", nucleo: "dc", disp: "reloj" },
    p: { zonas: "mapa", antenas: "gnb", acceso: "agg", anillo: "metro", nucleo: "dc", internet: "ix", satelite: "ntn", especiales: "evento", memoria: "documento" }
  };
  function ico(k, tam) {
    tam = tam || 14;
    if (ICO[k]) return '<svg class="lm-i" viewBox="0 0 24 24" width="' + tam + '" height="' + tam + '" fill="none" stroke="currentColor" stroke-width="' + (1.6 * 24 / tam).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[k] + '</svg>';
    return NOC.icono ? NOC.icono(k, tam) : "";
  }
  function icoNodo(tp, k) { return tp === "x" ? ico(k === "directo" ? "directo" : "fx") : ico((ICO_NODO[tp] || {})[k] || "documento"); }
  // forma del estado: ● ▲ ◆ ✕ (nunca solo color)
  function forma(k, tam) {
    tam = tam || 10;
    var p = k === "oficial" ? '<circle cx="5" cy="5" r="4"/>' : k === "sup" ? '<path d="M5 .8 9.4 9H.6z"/>' : k === "sinf" ? '<path d="M5 .5 9.5 5 5 9.5.5 5z"/>' :
      '<path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>';
    return '<svg class="lm-fm lm-e-' + k + '" viewBox="0 0 10 10" width="' + tam + '" height="' + tam + '" fill="currentColor" aria-hidden="true">' + p + '</svg>';
  }
  function estadoChip(k) { return '<span class="lm-est lm-e-' + k + '">' + forma(k, 10) + '<span>' + esc(t(EST[k].n)) + '</span></span>'; }

  // ------------------------------------------------------------------ números
  function num(x) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var loc = NOC.lang === "en" ? "en-US" : "es-ES", a = Math.abs(x);
    var d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a === 0 ? 0 : Math.min(6, 2 - Math.floor(Math.log10(a)));
    return x.toLocaleString(loc, { maximumFractionDigits: d });
  }
  function valorTxt(v) {
    if (!v) return "";
    var x = v.valor;
    var s = Array.isArray(x) ? x.slice(0, 3).map(function (q) { return typeof q === "number" ? num(q) : String(q); }).join(" / ") + (x.length > 3 ? " …" : "") :
      typeof x === "number" ? num(x) : x && typeof x === "object" ? "…" : String(x == null ? "—" : x);
    return s;
  }
  function unidad(v) { return v && v.unidad && v.unidad !== "—" && v.unidad !== "-" ? v.unidad : ""; }

  // ------------------------------------------------------------------ índices del mapa
  var CJ = null;   // conjuntos por nodo y bandas entre columnas
  function preparar() {
    if (CJ) return CJ;
    var m = mod(), nodo = {}, banda = [{}, {}, {}];
    COLS.forEach(function (col) { col.lista.forEach(function (x) { nodo[col.t + ":" + x.k] = []; }); });
    m.mem.forEach(function (v) {
      var f = m.fila[v.id], cs = [f.c1, [f.c2], [f.c3], f.c4];
      cs.forEach(function (lista, i) { lista.forEach(function (k) { var key = COLS[i].t + ":" + k; (nodo[key] = nodo[key] || []).push(v.id); }); });
      for (var i = 0; i < 3; i++) cs[i].forEach(function (a) { cs[i + 1].forEach(function (b) { var q = a + "|" + b; (banda[i][q] = banda[i][q] || []).push(v.id); }); });
    });
    var tot = {}; m.mem.forEach(function (v) { var e = m.fila[v.id].est; tot[e] = (tot[e] || 0) + 1; });
    CJ = { nodo: nodo, banda: banda, tot: tot, n: m.mem.length };
    return CJ;
  }
  // elemento del índice → elemento real del simulador (para abrir su ficha)
  function real(e) {
    var I = NOC.idx || {}, m;
    if ((I.zonas || {})[e]) return ["zona", e];
    if ((I.enlaces || {})[e]) return ["enlace", e];
    if ((I.nodos || {})[e]) return ["nodo", e];
    if ((m = /^(Z-[A-Z]+)\//.exec(e)) && (I.zonas || {})[m[1]]) return ["zona", m[1]];
    if ((m = /^R-(Z-[A-Z]+)-n\d+$/.exec(e)) && (I.zonas || {})[m[1]]) return ["zona", m[1]];
    return null;
  }
  var MEMEL = {};
  function elemsDe(vid, pila) {   // elementos reales que usan la cifra (ella y todo lo que se calcula a partir de ella)
    if (MEMEL[vid]) return MEMEL[vid];
    var m = mod(), out = {};
    pila = pila || {};
    if (pila[vid]) return out;
    pila[vid] = 1;
    (m.ELEM[vid] || []).forEach(function (e) { var r = real(e); if (r) out[r[1]] = r[0]; });
    (m.HIJOS[vid] || []).forEach(function (h) { var r = elemsDe(h, pila); Object.keys(r).forEach(function (q) { out[q] = r[q]; }); });
    delete pila[vid];
    MEMEL[vid] = out;
    return out;
  }
  function descMem(vid, out, pila) {
    var m = mod(); out = out || {}; pila = pila || {};
    if (pila[vid]) return out; pila[vid] = 1;
    (m.HIJOS[vid] || []).forEach(function (h) { if (m.V[h] && m.V[h].memoria) out[h] = 1; else descMem(h, out, pila); });
    return out;
  }
  function conjuntoValor(vid) {
    var m = mod(), v = m.V[vid];
    if (!v) return [];
    if (v.memoria) return [vid];
    var s = m.enMemoria(vid);
    descMem(vid, s);
    return Object.keys(s);
  }
  function clavesElemento(id) {
    var out = [];
    Object.keys(L.indice || {}).forEach(function (k) {
      var el = k.slice(0, k.lastIndexOf("|")), r = real(el);
      if (el === id || (r && r[1] === id)) out.push({ el: el, campo: k.slice(k.lastIndexOf("|") + 1), v: L.indice[k] });
    });
    return out;
  }
  function conjunto(f) {
    if (!f) return null;
    var cj = preparar(), m = mod(), s = {};
    if (f.t === "f" || f.t === "x" || f.t === "m" || f.t === "p") return cj.nodo[f.t + ":" + f.id] || [];
    if (f.t === "v") return conjuntoValor(f.id);
    if (f.t === "d") { m.mem.forEach(function (v) { if (m.origenes(v.id).docs[f.id]) s[v.id] = 1; }); return Object.keys(s); }
    if (f.t === "e") { clavesElemento(f.id).forEach(function (c) { conjuntoValor(c.v).forEach(function (q) { s[q] = 1; }); }); return Object.keys(s); }
    return [];
  }
  function nombreFoco(f) {
    var m = mod();
    if (f.t === "v") return t(LL.nombreValor(m.V[f.id]));
    if (f.t === "d") return t(LL.nombreFuente(m.FU[f.id]));
    if (f.t === "e") return NOC.nombreCorto ? NOC.nombreCorto(f.id) : f.id;
    var col = COLS.filter(function (c) { return c.t === f.t; })[0], x = col && col.lista.filter(function (q) { return q.k === f.id; })[0];
    return x ? t(x.n) : f.id;
  }

  // ------------------------------------------------------------------ estado de la vista
  var S = { el: null, pila: [], filtro: {}, hover: null, lay: null, pendiente: null, q: "", sel: 0 };
  function foco() { return S.pila[S.pila.length - 1] || null; }
  function filtroActivo() { return Object.keys(S.filtro).filter(function (k) { return S.filtro[k]; }); }
  function activos() {   // cifras encendidas: foco o hover ∩ filtro; null = todas
    var base = S.hover ? S.hover : foco() ? conjunto(foco()) : null, fl = filtroActivo();
    if (!base && !fl.length) return null;
    var m = mod(), lista = base || m.mem.map(function (v) { return v.id; }), o = {};
    lista.forEach(function (id) { if (!fl.length || fl.indexOf(m.fila[id] ? m.fila[id].est : "") >= 0) o[id] = 1; });
    return o;
  }

  // ------------------------------------------------------------------ maquetación
  function maquetar(W, H) {
    var cj = preparar(), cab = 22, bw = Math.max(118, Math.min(176, (W - 3 * 64) / 4)), gap = (W - 4 * bw) / 3, gy = 5, hmin = 22;
    var cols = COLS.map(function (col, i) {
      var ns = col.lista.map(function (x) { return { t: col.t, k: x.k, x: x, n: (cj.nodo[col.t + ":" + x.k] || []).length }; }).filter(function (q) { return q.n > 0; });
      var Hd = H - cab - gy * (ns.length - 1), sum = ns.reduce(function (a, q) { return a + q.n; }, 0), k = Hd / sum;
      for (var it = 0; it < 6; it++) {   // reparte el alto: los pequeños se quedan en hmin
        var peq = ns.filter(function (q) { return q.n * k < hmin; }), sg = sum - peq.reduce(function (a, q) { return a + q.n; }, 0);
        k = sg > 0 ? (Hd - peq.length * hmin) / sg : k;
      }
      var y = cab, x0 = i * (bw + gap);
      ns.forEach(function (q) { q.h = Math.max(hmin, q.n * k); q.y = y; q.xx = x0; q.w = bw; y += q.h + gy; });
      var sobra = H - y + gy; if (sobra > 0) ns.forEach(function (q) { q.y += sobra / 2; });
      return { col: col, x: x0, nodos: ns };
    });
    var idx = {}; cols.forEach(function (c) { c.nodos.forEach(function (q) { idx[q.t + ":" + q.k] = q; }); });
    // bandas: huecos en cada borde ordenados por la posición del otro extremo
    var bandas = [];
    for (var i = 0; i < 3; i++) {
      var B = cj.banda[i], lista = Object.keys(B).map(function (q) {
        var ab = q.split("|");
        return { i: i, a: idx[COLS[i].t + ":" + ab[0]], b: idx[COLS[i + 1].t + ":" + ab[1]], ids: B[q] };
      }).filter(function (b) { return b.a && b.b; });
      var porA = {}, porB = {};
      lista.forEach(function (b) { (porA[b.a.k] = porA[b.a.k] || []).push(b); (porB[b.b.k] = porB[b.b.k] || []).push(b); });
      Object.keys(porA).forEach(function (k) {
        var l = porA[k].sort(function (p, q) { return p.b.y - q.b.y; }), tot = l.reduce(function (a, b) { return a + b.ids.length; }, 0), y = l[0].a.y, s = l[0].a.h / tot;
        l.forEach(function (b) { b.ya = y; b.ha = b.ids.length * s; y += b.ha; });
      });
      Object.keys(porB).forEach(function (k) {
        var l = porB[k].sort(function (p, q) { return p.a.y - q.a.y; }), tot = l.reduce(function (a, b) { return a + b.ids.length; }, 0), y = l[0].b.y, s = l[0].b.h / tot;
        l.forEach(function (b) { b.yb = y; b.hb = b.ids.length * s; y += b.hb; });
      });
      bandas = bandas.concat(lista);
    }
    return { W: W, H: H, cols: cols, idx: idx, bandas: bandas, bw: bw };
  }
  function cinta(x1, y1, h1, x2, y2, h2) {
    var xm = (x1 + x2) / 2;
    return "M" + x1.toFixed(1) + " " + y1.toFixed(1) + "C" + xm.toFixed(1) + " " + y1.toFixed(1) + " " + xm.toFixed(1) + " " + y2.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1) +
      "L" + x2.toFixed(1) + " " + (y2 + h2).toFixed(1) + "C" + xm.toFixed(1) + " " + (y2 + h2).toFixed(1) + " " + xm.toFixed(1) + " " + (y1 + h1).toFixed(1) + " " + x1.toFixed(1) + " " + (y1 + h1).toFixed(1) + "Z";
  }

  // ------------------------------------------------------------------ pintado
  function pintarCintas() {
    var G = S.lay, m = mod(), A = activos(), lleno = !A, h = "";
    if (!G) return;
    // nodo enfocado (hover o clic): en su columna solo se encienden sus cintas, no las de sus vecinos
    var nf = S.hoverNodo || (foco() && /^[fxmp]$/.test(foco().t) ? foco().t + ":" + foco().id : null), ci = -1;
    if (nf) COLS.forEach(function (c, i) { if (nf.charAt(0) === c.t) ci = i; });
    G.bandas.forEach(function (b, bi) {
      var x1 = b.a.xx + b.a.w, x2 = b.b.xx, n = b.ids.length, cnt = { oficial: 0, sup: 0, sinf: 0, discrepa: 0 }, na = 0;
      var fuera = !lleno && ci >= 0 && ((b.i === ci - 1 && b.b.t + ":" + b.b.k !== nf) || (b.i === ci && b.a.t + ":" + b.a.k !== nf));
      if (!fuera) b.ids.forEach(function (id) { if (lleno || A[id]) { cnt[m.fila[id].est]++; na++; } });
      var tip = t(nombreNodo(b.a)) + " → " + t(nombreNodo(b.b)) + " · " + n + " " + t(TX.cifrasT).toLowerCase();
      h += '<g class="lm-b' + (na ? "" : " lm-apag") + '" data-lmb="' + bi + '" data-tip="' + esc(tip) + '">';
      if (!lleno) h += '<path class="lm-b-fondo" d="' + cinta(x1, b.ya, b.ha, x2, b.yb, b.hb) + '"/>';
      var ya = b.ya, yb = b.yb;
      ORD_EST.forEach(function (k) {
        if (!cnt[k]) return;
        var ha = Math.max(1.5, b.ha * cnt[k] / n), hb = Math.max(1.5, b.hb * cnt[k] / n);
        h += '<path class="lm-b-e lm-e-' + k + (lleno ? "" : " lm-luz") + '" d="' + cinta(x1, ya, ha, x2, yb, hb) + '"/>';
        ya += ha; yb += hb;
      });
      h += '</g>';
    });
    var svg = S.el.querySelector(".lm-cintas");
    svg.innerHTML = '<defs><pattern id="lm-rayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="lm-raya-f"/><path d="M0 0v6" class="lm-raya"/></pattern></defs>' + h;
    // nodos: recuento encendido
    Array.prototype.forEach.call(S.el.querySelectorAll(".lm-n"), function (nd) {
      var q = G.idx[nd.getAttribute("data-lm")], ids = preparar().nodo[nd.getAttribute("data-lm")] || [];
      if (!q) return;
      var key = nd.getAttribute("data-lm"), na = lleno ? ids.length : ci >= 0 && key.charAt(0) === nf.charAt(0) && key !== nf ? 0 : ids.filter(function (id) { return A[id]; }).length;
      nd.classList.toggle("lm-apag", !na);
      nd.classList.toggle("lm-luz", !lleno && na > 0);
      var c = nd.querySelector(".lm-cnt"); if (c) c.textContent = lleno || na === ids.length ? String(ids.length) : na + "/" + ids.length;
      var f = foco(); nd.classList.toggle("lm-sel", !!f && nd.getAttribute("data-lm") === f.t + ":" + f.id);
    });
  }
  function nombreNodo(q) { return q.x.n; }
  function htmlNodos() {
    var G = S.lay, m = mod(), h = "";
    G.cols.forEach(function (c) {
      h += '<div class="lm-colt" style="left:' + c.x.toFixed(1) + 'px;width:' + G.bw.toFixed(1) + 'px">' + esc(t(c.col.tit)) + '</div>';
      c.nodos.forEach(function (q) {
        var ids = preparar().nodo[q.t + ":" + q.k] || [], cnt = { oficial: 0, sup: 0, sinf: 0, discrepa: 0 };
        ids.forEach(function (id) { cnt[m.fila[id].est]++; });
        var tira = ORD_EST.map(function (k) { return cnt[k] ? '<i class="lm-e-' + k + '" style="flex:' + cnt[k] + '"></i>' : ""; }).join("");
        var marcas = ["sinf", "discrepa"].map(function (k) { return cnt[k] ? '<span class="lm-mk lm-e-' + k + '">' + forma(k, 9) + cnt[k] + '</span>' : ""; }).join("");
        var tip = t(q.x.n) + " · " + ids.length + " " + t(TX.cifras) + "\n" + t(q.x.f) + (q.t === "x" && q.x.fx && q.x.fx.length ? "\n" + q.x.fx.join(" ") : "");
        h += '<button type="button" class="lm-n lm-t-' + q.t + (q.h < 30 ? " lm-bajo" : "") + '" data-lm="' + q.t + ":" + q.k + '" data-tip="' + esc(tip) + '" style="left:' + q.xx.toFixed(1) + 'px;top:' + q.y.toFixed(1) + 'px;width:' + q.w.toFixed(1) + 'px;height:' + q.h.toFixed(1) + 'px">' +
          '<span class="lm-tira">' + tira + '</span>' + icoNodo(q.t, q.k) + '<span class="lm-nom">' + esc(t(q.x.n)) + '</span><span class="lm-cnt">' + ids.length + '</span>' + (marcas ? '<span class="lm-mks">' + marcas + '</span>' : '') + '</button>';
      });
    });
    return h;
  }
  function pintarGrafo() {
    var g = S.el.querySelector(".lm-grafo");
    if (!g) return;
    var W = g.clientWidth, H = g.clientHeight;
    if (W < 200 || H < 150) return;
    S.lay = maquetar(W, H);
    g.querySelector(".lm-nodos").innerHTML = htmlNodos();
    var svg = g.querySelector(".lm-cintas");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("width", W); svg.setAttribute("height", H);
    pintarCintas();
  }
  function resumen() {
    var cj = preparar(), fl = S.filtro;
    var barra = '<span class="lm-barra" role="img" aria-label="' + esc(ORD_EST.map(function (k) { return t(EST[k].n) + " " + (cj.tot[k] || 0); }).join(", ")) + '">' +
      ORD_EST.map(function (k) { return cj.tot[k] ? '<i class="lm-e-' + k + '" style="flex:' + cj.tot[k] + '"></i>' : ""; }).join("") + '</span>';
    return '<span class="lm-total"><b>' + cj.n + '</b> ' + esc(t(TX.cifras)) + '</span>' + barra +
      '<span class="lm-chips" role="group" aria-label="' + esc(t(TX.filtro)) + '">' + ORD_EST.map(function (k) {
        return '<button type="button" class="lm-chip lm-e-' + k + '" data-lm-fil="' + k + '" aria-pressed="' + !!fl[k] + '" data-tip="' + esc(t(EST[k].f)) + '">' + forma(k, 10) +
          '<span>' + esc(t(EST[k].n)) + '</span><b>' + (cj.tot[k] || 0) + '</b></button>';
      }).join("") + '</span>';
  }
  function migas() {
    if (!S.pila.length) return "";
    return '<nav class="lm-migas" aria-label="' + esc(t({ es: "Recorrido", en: "Path" })) + '"><button type="button" class="lm-atras" data-lm-atras="1" data-tip="' + esc(t(TX.atras) + " (Esc)") + '" aria-label="' + esc(t(TX.atras)) + '">‹</button>' +
      '<button type="button" class="lm-miga" data-lm-miga="0">' + esc(t(TX.todo)) + '</button>' + S.pila.map(function (f, i) {
        return '<span class="lm-sep">›</span><button type="button" class="lm-miga' + (i === S.pila.length - 1 ? " lm-act" : "") + '" data-lm-miga="' + (i + 1) + '"><span class="lm-mt">' + esc(t(TX.tipo[f.t])) + '</span>' + esc(cortar(nombreFoco(f), 32)) + '</button>';
      }).join("") + '</nav>';
  }

  // ------------------------------------------------------------------ panel de detalle
  function chipValor(id) {
    var m = mod(), v = m.V[id];
    if (!v) return "";
    var e = m.fila[id] ? m.fila[id].est : m.estado(v);
    return '<button type="button" class="lm-c" data-lm-ir="v:' + esc(id) + '" data-tip="' + esc(t(LL.nombreValor(v)) + " = " + valorTxt(v) + " " + unidad(v) + (NOC.nivel === "experto" ? "\n" + id : "")) + '">' + forma(e, 9) + '<span>' + esc(cortar(t(LL.nombreValor(v)), 34)) + '</span></button>';
  }
  function chipNodo(tp, k, n) {
    var col = COLS.filter(function (c) { return c.t === tp; })[0], x = col.lista.filter(function (q) { return q.k === k; })[0];
    if (!x) return "";
    return '<button type="button" class="lm-c" data-lm-ir="' + tp + ":" + k + '">' + icoNodo(tp, k) + '<span>' + esc(t(x.n)) + '</span>' + (n ? '<b>' + n + '</b>' : '') + '</button>';
  }
  function chipDoc(fid) {
    var m = mod(), f = m.FU[fid];
    if (!f) return "";
    var u = f.url ? '<a class="lm-ext" href="' + esc(f.url) + '" target="_blank" rel="noopener" data-tip="' + esc(f.url) + '" aria-label="' + esc(t({ es: "Abrir fuente original", en: "Open original source" })) + '">↗</a>' : "";
    return '<span class="lm-cw"><button type="button" class="lm-c" data-lm-ir="d:' + esc(fid) + '" data-tip="' + esc((f.titulo || "") + (f.localizador ? "\n" + f.localizador : "") + (NOC.nivel === "experto" ? "\n" + fid : "")) + '">' +
      icoNodo("f", LL.famFuente(fid)) + '<span>' + esc(cortar(t(LL.nombreFuente(f)), 30)) + '</span></button>' + u + '</span>';
  }
  function chipElem(id, tipo) {
    var ic = tipo === "zona" ? "mapa" : tipo === "enlace" ? "enlace" : ((NOC.idx.nodos || {})[id] || {}).tipo || "dc";
    return '<button type="button" class="lm-c" data-lm-ir="e:' + esc(id) + '">' + ico(ic === "core" ? "dc" : ic === "site" ? "gnb" : ic) + '<span>' + esc(cortar(NOC.nombreCorto ? NOC.nombreCorto(id) : id, 30)) + '</span></button>';
  }
  function lista(tit, items, max) {
    items = items.filter(Boolean);
    if (!items.length) return "";
    max = max || 10;
    var vis = items.slice(0, max).join(""), resto = items.length > max ? '<details class="lm-mas"><summary>+' + (items.length - max) + " " + esc(t(TX.mas)) + '</summary>' + items.slice(max).join("") + '</details>' : "";
    return '<div class="lm-pb"><div class="lm-pt">' + esc(t(tit)) + ' <span>' + items.length + '</span></div><div class="lm-cs">' + vis + resto + '</div></div>';
  }
  function cuentaPor(ids, fn) { var o = {}; ids.forEach(function (id) { [].concat(fn(id)).forEach(function (k) { o[k] = (o[k] || 0) + 1; }); }); return o; }
  function chipsCuenta(tp, o) {
    var col = COLS.filter(function (c) { return c.t === tp; })[0];
    return col.lista.filter(function (x) { return o[x.k]; }).map(function (x) { return chipNodo(tp, x.k, o[x.k]); });
  }
  function ordenValores(ids) {
    var m = mod(), r = { discrepa: 0, sinf: 1, sup: 2, oficial: 3 };
    return ids.slice().sort(function (a, b) { var ea = m.fila[a] ? m.fila[a].est : "sup", eb = m.fila[b] ? m.fila[b].est : "sup"; return r[ea] - r[eb] || (t(LL.nombreValor(m.V[a])) < t(LL.nombreValor(m.V[b])) ? -1 : 1); });
  }
  function elementosDe(ids) {
    var o = {};
    ids.forEach(function (id) { var r = elemsDe(id); Object.keys(r).forEach(function (q) { o[q] = r[q]; }); });
    return Object.keys(o).sort().map(function (q) { return chipElem(q, o[q]); });
  }
  function panelHTML(f) {
    var m = mod(), ids = conjunto(f), h = "", nom = nombreFoco(f), cab, linea = "";
    var cod = "";
    if (f.t === "v") {
      var v = m.V[f.id], e = m.fila[f.id] ? m.fila[f.id].est : m.estado(v), fx = LL.formula(v.formula);
      if (e === "discrepa" && v.ref) linea = t(TX.memoria) + " " + num(v.ref.valor) + " · " + t(TX.recalc) + " " + valorTxt(v);
      else if (fx) linea = "= " + t(fx.f);
      else if (v.fuente) linea = t(TX.directo) + (v.fuente.localizador ? " · " + cortar(v.fuente.localizador, 60) : "");
      else if (v.supuesto) { var sp = (L.supuestos || []).filter(function (s) { return s.id === v.supuesto; })[0]; linea = t(TX.supuesto) + ": " + cortar(sp ? sp.texto : v.supuesto, 80); }
      cod = v.id + (v.formula ? " · " + v.formula : "") + (v.supuesto ? " · " + v.supuesto : "") + (v.memoria ? " · " + v.memoria : "");
      cab = '<div class="lm-val"><b>' + esc(valorTxt(v)) + '</b> <span>' + esc(unidad(v)) + '</span></div>' + estadoChip(e);
      var prev = [];
      if (v.fuente) prev.push(chipDoc(v.fuente.id));
      (v.entradas || []).forEach(function (q) { prev.push(chipValor(q)); });
      if (v.supuesto && !v.fuente && !(v.entradas || []).length) {
        var es = v.supuesto === "S-L00" ? "sinf" : "sup";
        prev.push('<span class="lm-c lm-c-sin">' + forma(es, 9) + '<span>' + esc(t(es === "sinf" ? EST.sinf.n : TX.supuesto)) + '</span></span>');
      }
      h += lista(TX.vieneDe, prev, 8);
      var raiz = Object.keys(m.origenes(f.id).docs).filter(function (d) { return !v.fuente || d !== v.fuente.id; });
      h += lista(TX.docs, raiz.map(chipDoc), 6);
      h += lista(TX.seUsa, ordenValores(m.HIJOS[f.id] || []).map(chipValor), 8);
      h += lista(TX.elementos, elementosDe([f.id]), 8);
      if (m.fila[f.id]) h += lista(TX.tipo.p, m.fila[f.id].c4.map(function (k) { return chipNodo("p", k); }));
      h += '<div class="lm-acc solo-experto"><button type="button" class="btn" data-lm-arbol="' + esc(f.id) + '">' + esc(t(TX.arbol)) + '</button></div>';
    } else if (f.t === "d") {
      var fu = m.FU[f.id];
      linea = cortar(fu.titulo || "", 90);
      cod = f.id;
      cab = fu.url ? '<a class="lm-ext-g" href="' + esc(fu.url) + '" target="_blank" rel="noopener">' + esc(t({ es: "Abrir fuente original", en: "Open original source" })) + ' ↗</a>' : "";
      h += lista(TX.cifrasT, ordenValores(ids).map(chipValor), 12);
    } else if (f.t === "e") {
      var r = real(f.id);
      cab = r ? '<button type="button" class="btn prim" data-lm-ficha="' + r[0] + "|" + esc(r[1]) + '">' + esc(t(TX.abrirFicha)) + '</button>' : "";
      var cl = clavesElemento(f.id), vs = {};
      cl.forEach(function (c) { vs[c.v] = 1; });
      h += lista(TX.cifrasT, ordenValores(Object.keys(vs)).map(chipValor), 10);
      cod = f.id;
    } else {
      var col = COLS.filter(function (c) { return c.t === f.t; })[0], x = col.lista.filter(function (q) { return q.k === f.id; })[0];
      linea = t(x.f);
      cab = '<div class="lm-val"><b>' + ids.length + '</b> <span>' + esc(t(TX.cifras)) + '</span></div>';
      if (f.t === "f") {
        var docs = {}; ids.forEach(function (id) { Object.keys(m.origenes(id).docs).forEach(function (d) { if (LL.famFuente(d) === f.id) docs[d] = 1; }); });
        h += lista(TX.docs, Object.keys(docs).map(chipDoc), 6);
        h += lista(TX.alimenta, chipsCuenta("x", cuentaPor(ids, function (id) { return m.fila[id].c2; })));
      } else if (f.t === "x") {
        if (x.fx.length) h += '<div class="lm-pb"><div class="lm-fx">' + x.fx.map(function (q) { var p = LL.formula(q); return '<div data-tip="' + esc(q) + '"><b>' + esc(t(p.n)) + '</b> = ' + esc(t(p.f)) + '</div>'; }).slice(0, 4).join("") + '</div></div>';
        h += lista(TX.entradas, chipsCuenta("f", cuentaPor(ids, function (id) { return m.fila[id].c1; })));
        h += lista(TX.salidas, chipsCuenta("m", cuentaPor(ids, function (id) { return m.fila[id].c3; })));
      } else if (f.t === "m") {
        h += lista(TX.vieneDe, chipsCuenta("x", cuentaPor(ids, function (id) { return m.fila[id].c2; })));
        h += lista(TX.cifrasT, ordenValores(ids).map(chipValor), 12);
        h += lista(TX.seUsa, chipsCuenta("p", cuentaPor(ids, function (id) { return m.fila[id].c4; })));
      } else if (f.t === "p") {
        h += lista(TX.elementos, elementosDe(ids).filter(function (c) { return true; }), 12);
        h += lista(TX.cifrasT, ordenValores(ids).map(chipValor), 10);
      }
    }
    return '<div class="lm-pc"><span class="lm-mt">' + esc(t(TX.tipo[f.t])) + '</span><button type="button" class="lm-x" data-lm-cerrar="1" aria-label="' + esc(t(TX.cerrar)) + '">' + ico("cerrar", 14) + '</button></div>' +
      '<h3 class="lm-ptit">' + esc(nom) + '</h3>' + (cab ? '<div class="lm-pcab">' + cab + '</div>' : '') +
      (linea ? '<p class="lm-linea">' + esc(linea) + '</p>' : '') + (cod ? '<p class="lm-cod mono solo-experto">' + esc(cod) + '</p>' : '') + h;
  }
  function pintarPanel() {
    var p = S.el.querySelector(".lm-panel"), f = foco();
    S.el.classList.toggle("lm-con-panel", !!f);
    p.hidden = !f;
    p.innerHTML = f ? panelHTML(f) : "";
    S.el.querySelector(".lm-migas-w").innerHTML = migas();
  }
  function pintarTodo() {
    if (!S.el) return;
    S.el.querySelector(".lm-res-w").innerHTML = resumen();
    pintarPanel();
    pintarGrafo();
  }

  // ------------------------------------------------------------------ navegación
  function igual(a, b) { return a && b && a.t === b.t && a.id === b.id; }
  function ir(f, opc) {
    opc = opc || {};
    if (typeof f === "string") { var i = f.indexOf(":"); f = { t: f.slice(0, i), id: f.slice(i + 1) }; }
    if (!f || !f.t) return;
    if (!S.el) { S.pendiente = f; return; }
    if (igual(foco(), f)) return;
    var k = -1; S.pila.forEach(function (q, i) { if (igual(q, f)) k = i; });
    if (k >= 0) S.pila.length = k + 1; else S.pila.push(f);
    S.hover = null; S.hoverNodo = null;
    try { history.pushState({ lm: S.pila.length }, ""); } catch (e) { /* nada */ }
    pintarPanel(); pintarCintas();
    var p = S.el.querySelector(".lm-panel"); if (p) p.scrollTop = 0;
  }
  function volverA(n) { S.pila.length = Math.max(0, n); S.hover = null; S.hoverNodo = null; pintarPanel(); pintarCintas(); }
  function atras() {
    if (!S.pila.length) return;
    var st = history.state;
    if (st && typeof st.lm === "number" && st.lm === S.pila.length) { try { history.back(); return; } catch (e) { /* nada */ } }
    volverA(S.pila.length - 1);
  }
  window.addEventListener("popstate", function (ev) {
    if (!S.el) return;
    var n = ev.state && typeof ev.state.lm === "number" ? ev.state.lm : 0;
    if (n < S.pila.length) volverA(n);
  });
  function visible() { return !!(S.el && S.el.offsetParent); }
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape" || !visible() || !S.pila.length) return;
    var tag = (ev.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (document.querySelector(".noc-capa:not([hidden]), [role=dialog]:not([hidden])")) return;
    ev.preventDefault();
    atras();
  });
  function mostrarMapa() {
    try { document.dispatchEvent(new CustomEvent("lj-ver-mapa")); } catch (e) { /* nada */ }
    if (NOC.activarVista) NOC.activarVista("trazabilidad");
  }
  // clics globales (también desde la ficha)
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest("[data-lm-ir]") : null;
    if (b) {
      ev.preventDefault();
      var dentro = S.el && S.el.contains(b);
      if (!dentro) mostrarMapa();
      var f = b.getAttribute("data-lm-ir");
      ir(f);
      if (!dentro && NOC.cerrarFicha) NOC.cerrarFicha();   // que se vea el panel del mapa
      if (/^e:/.test(f) && dentro) {   // elemento de la red: también su ficha
        var r = real(f.slice(2)); if (r && NOC.seleccionar) NOC.seleccionar(r[0], r[1]);
      }
      return;
    }
    b = ev.target.closest ? ev.target.closest("[data-lm-ficha]") : null;
    if (b) { var p = b.getAttribute("data-lm-ficha").split("|"); if (NOC.seleccionar) NOC.seleccionar(p[0], p[1]); }
  });

  // ------------------------------------------------------------------ buscador
  var IDXQ = null;
  function indiceBusqueda() {
    if (IDXQ) return IDXQ;
    var m = mod(); IDXQ = [];
    L.valores.forEach(function (v) {
      var n = LL.nombreValor(v);
      IDXQ.push({ f: "v:" + v.id, t: "v", n: n, s: norm(n.es + " " + n.en + " " + v.id + " " + (v.elemento || "")), w: v.memoria ? 0 : 1, e: m.fila[v.id] ? m.fila[v.id].est : m.estado(v) });
    });
    (L.fuentes || []).forEach(function (f) { var n = LL.nombreFuente(f); IDXQ.push({ f: "d:" + f.id, t: "d", n: n, s: norm(n.es + " " + (f.titulo || "") + " " + f.id), w: 2 }); });
    var vistos = {};
    Object.keys(L.indice || {}).forEach(function (k) {
      var r = real(k.slice(0, k.lastIndexOf("|")));
      if (!r || vistos[r[1]]) return; vistos[r[1]] = 1;
      var nm = NOC.nombreCorto ? NOC.nombreCorto(r[1]) : r[1];
      IDXQ.push({ f: "e:" + r[1], t: "e", n: T(nm), s: norm(nm + " " + r[1]), w: 1 });
    });
    return IDXQ;
  }
  function buscar(q) {
    q = norm(q).trim();
    if (!q) return [];
    var ps = q.split(/\s+/);
    return indiceBusqueda().map(function (x) {
      if (!ps.every(function (p) { return x.s.indexOf(p) >= 0; })) return null;
      var nn = norm(t(x.n)), sc = (nn.indexOf(q) === 0 ? 0 : nn.indexOf(q) >= 0 ? 1 : 2) * 3 + x.w;
      return { x: x, sc: sc };
    }).filter(Boolean).sort(function (a, b) { return a.sc - b.sc || t(a.x.n).length - t(b.x.n).length; }).slice(0, 8).map(function (r) { return r.x; });
  }
  function pintarResultados() {
    var ul = S.el.querySelector(".lm-sug"), rs = buscar(S.q);
    if (!S.q.trim()) { ul.hidden = true; ul.innerHTML = ""; return; }
    ul.hidden = false;
    S.sel = Math.min(S.sel, Math.max(0, rs.length - 1));
    ul.innerHTML = rs.length ? rs.map(function (x, i) {
      var izq = x.t === "v" ? forma(x.e, 10) : x.t === "d" ? icoNodo("f", LL.famFuente(x.f.slice(2))) : ico("mapa");
      return '<li><button type="button" class="lm-sg' + (i === S.sel ? " lm-act" : "") + '" data-lm-sug="' + esc(x.f) + '">' + izq + '<span>' + esc(t(x.n)) + '</span><i>' + esc(t(TX.tipo[x.t])) + '</i></button></li>';
    }).join("") : '<li class="lm-nada">' + esc(t(TX.sinRes)) + '</li>';
  }
  function elegir(f) {
    var inp = S.el.querySelector(".lm-q");
    S.q = ""; if (inp) { inp.value = ""; inp.blur(); }
    pintarResultados();
    ir(f);
  }

  // ------------------------------------------------------------------ mini-cadena para la ficha: fuente → cálculo → valor
  function cadenaHTML(vid, etiqueta) {
    var m = mod(), v = m.V[vid];
    if (!v) return "";
    var e = m.fila[vid] ? m.fila[vid].est : m.estado(v), o = m.origenes(vid);
    var docs = Object.keys(o.docs), fams = Object.keys(o.fam);
    var src;
    if (docs.length) src = docs.slice(0, 2).map(function (d) { return '<span class="lm-k-s" data-tip="' + esc((m.FU[d] || {}).titulo || d) + '">' + icoNodo("f", LL.famFuente(d)) + esc(cortar(t(LL.nombreFuente(m.FU[d])), 28)) + '</span>'; }).join("") + (docs.length > 2 ? '<span class="lm-k-n">+' + (docs.length - 2) + '</span>' : "");
    else src = fams.slice(0, 2).map(function (k) { var x = LL.FAM_FUENTE.filter(function (q) { return q.k === k; })[0]; return x ? '<span class="lm-k-s">' + icoNodo("f", k) + esc(t(x.n)) + '</span>' : ""; }).join("");
    if (!src) src = '<span class="lm-k-s">' + icoNodo("f", "sinf") + esc(t(EST.sinf.n)) + '</span>';
    var fx = LL.formula(v.formula);
    var calc = fx ? '<span class="lm-k-x" data-tip="' + esc(t(fx.f)) + '">' + ico("fx") + esc(t(fx.n)) + '</span>' : '<span class="lm-k-x">' + ico("directo") + esc(t(TX.directo)) + '</span>';
    return '<button type="button" class="lm-cad" data-lm-ir="v:' + esc(vid) + '" data-tip="' + esc(t(TX.verMapa) + (NOC.nivel === "experto" ? " · " + vid : "")) + '">' +
      '<span class="lm-k-cab"><span class="lm-k-et">' + esc(etiqueta || t(LL.nombreValor(v))) + '</span><span class="lm-k-v">' + forma(e, 9) + '<b>' + esc(valorTxt(v)) + '</b> ' + esc(unidad(v)) + '</span></span>' +
      '<span class="lm-k-fila"><span class="lm-k-src">' + src + '</span><span class="lm-k-fl">→</span>' + calc + '</span></button>';
  }

  // ------------------------------------------------------------------ montaje
  function montar(el, opc) {
    opc = opc || {};
    S.el = el;
    el.classList.add("lm");
    el.innerHTML = '<div class="lm-cab"><div class="lm-res-w"></div><div class="lm-bus"><span class="lm-lupa">' + ico("buscar", 14) + '</span>' +
      '<input type="search" class="lm-q" autocomplete="off" spellcheck="false" placeholder="' + esc(t(TX.buscar)) + '" aria-label="' + esc(t(TX.buscar)) + '"><ul class="lm-sug" role="listbox" hidden></ul></div>' +
      (NOC.info ? NOC.info(TX.info, { glosario: false }) : "") + '<span class="lm-extra"></span></div>' +
      '<div class="lm-migas-w"></div>' +
      '<div class="lm-cuerpo"><div class="lm-grafo"><svg class="lm-cintas" aria-hidden="true"></svg><div class="lm-nodos"></div></div><aside class="lm-panel" hidden aria-live="polite"></aside></div>';
    if (opc.extra) el.querySelector(".lm-extra").innerHTML = opc.extra;
    el.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-lm]");
      if (b) { var f = b.getAttribute("data-lm"); if (igual(foco(), { t: f.split(":")[0], id: f.slice(f.indexOf(":") + 1) })) volverA(S.pila.length - 1); else ir(f); return; }
      b = ev.target.closest("[data-lm-fil]");
      if (b) { var k = b.getAttribute("data-lm-fil"); S.filtro[k] = !S.filtro[k]; b.setAttribute("aria-pressed", String(!!S.filtro[k])); pintarCintas(); return; }
      b = ev.target.closest("[data-lm-miga]");
      if (b) { var n = Number(b.getAttribute("data-lm-miga")); if (n < S.pila.length) { var d = S.pila.length - n; S.pila.length = n + 0; try { history.go(-d); } catch (e) { /* nada */ } volverA(n); } return; }
      if (ev.target.closest("[data-lm-atras]")) { atras(); return; }
      if (ev.target.closest("[data-lm-cerrar]")) { volverA(0); return; }
      b = ev.target.closest("[data-lm-sug]");
      if (b) { elegir(b.getAttribute("data-lm-sug")); return; }
      b = ev.target.closest("[data-lm-arbol]");
      if (b && NOC.linaje && NOC.linaje.abrirValor) { NOC.linaje.abrirValor(b.getAttribute("data-lm-arbol")); return; }
      b = ev.target.closest("[data-lmb]");
      if (b && S.lay) { var bd = S.lay.bandas[Number(b.getAttribute("data-lmb"))]; if (bd) ir({ t: bd.b.t, id: bd.b.k }); }
    });
    el.addEventListener("mouseover", function (ev) {
      var b = ev.target.closest("[data-lm], [data-lmb]");
      if (!b || !S.lay) return;
      var ids = b.hasAttribute("data-lm") ? preparar().nodo[b.getAttribute("data-lm")] : (S.lay.bandas[Number(b.getAttribute("data-lmb"))] || {}).ids;
      if (!ids || S.hover === ids) return;
      S.hover = ids; S.hoverNodo = b.hasAttribute("data-lm") ? b.getAttribute("data-lm") : null; pintarCintas();
    });
    el.addEventListener("mouseout", function (ev) {
      var b = ev.target.closest("[data-lm], [data-lmb]");
      if (!b || (ev.relatedTarget && b.contains(ev.relatedTarget))) return;
      S.hover = null; S.hoverNodo = null; pintarCintas();
    });
    el.addEventListener("focusin", function (ev) { var b = ev.target.closest("[data-lm]"); if (b) { S.hover = preparar().nodo[b.getAttribute("data-lm")]; S.hoverNodo = b.getAttribute("data-lm"); pintarCintas(); } });
    el.addEventListener("focusout", function (ev) { if (ev.target.closest("[data-lm]")) { S.hover = null; S.hoverNodo = null; pintarCintas(); } });
    var inp = el.querySelector(".lm-q");
    inp.addEventListener("input", function () { S.q = inp.value; S.sel = 0; pintarResultados(); });
    inp.addEventListener("keydown", function (ev) {
      var rs = buscar(S.q);
      if (ev.key === "ArrowDown") { ev.preventDefault(); S.sel = Math.min(rs.length - 1, S.sel + 1); pintarResultados(); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); S.sel = Math.max(0, S.sel - 1); pintarResultados(); }
      else if (ev.key === "Enter") { ev.preventDefault(); if (rs[S.sel]) elegir(rs[S.sel].f); }
      else if (ev.key === "Escape") { S.q = ""; inp.value = ""; pintarResultados(); }
    });
    inp.addEventListener("blur", function () { setTimeout(function () { if (S.el && !S.el.contains(document.activeElement)) { var ul = S.el.querySelector(".lm-sug"); if (ul) ul.hidden = true; } }, 150); });
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { pintarGrafo(); }); ro.observe(el.querySelector(".lm-grafo")); }
    pintarTodo();
    if (S.pendiente) { var p = S.pendiente; S.pendiente = null; ir(p); }
  }
  if (NOC.on) NOC.on("lang", function () { IDXQ = null; if (S.el) { var ex = S.el.querySelector(".lm-extra"); var h = ex ? ex.innerHTML : ""; var q = S.el.querySelector(".lm-q"); if (q) q.placeholder = t(TX.buscar); pintarTodo(); } });
  if (NOC.alNivel) NOC.alNivel(function () { if (S.el) pintarPanel(); });

  NOC.linajeMapa = { montar: montar, ir: function (f) { mostrarMapa(); ir(f); }, cadenaHTML: cadenaHTML, redibujar: pintarTodo, nombreValor: function (vid) { var v = mod().V[vid]; return v ? t(LL.nombreValor(v)) : vid; } };
})();
