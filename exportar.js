// exportar.js — EXPORTAR (CONTRATO_UI Revisión 3): tablas CSV (Excel ES) en .zip con LEEME.txt e informe imprimible.
// Núcleo sin DOM (node: require("./exportar.js")): Exportar.construir(ctx, sel) -> {meta, tablas, registro}.
// Panel del shell (solo navegador): botón EXPORTAR de la barra superior -> Exportar.alternarPanel().
//
// Procedencia por campo: si el elemento trae proc = {campo: {t, f, s}} (lo genera DATOS) se usa celda a celda;
// si no, se degrada al origen del elemento (origen / supuesto / fuente_e2 / fuente) y la columna procedencia dice
// "por elemento (pendiente de detalle)". Dependencias de resultados: resultado.enlaces[id].depende, demandas[i].depende.
(function (raiz) {
  "use strict";

  var X = {};
  X.VERSION = "1";

  // ======================================================================== textos
  var TX = {
    v7: { es: "v7", en: "v7" }, anterior: { es: "doc. anterior", en: "earlier doc." },
    supuesto: { es: "supuesto", en: "assumption" }, supuestos: { es: "supuestos", en: "assumptions" },
    calculado: { es: "calculado", en: "computed" }, calculados: { es: "calculados", en: "computed" },
    usuario: { es: "dato del usuario", en: "user data" }, usuarios: { es: "datos del usuario", en: "user data" },   // Revisión 8
    sinEsp: { es: "no especificado en v7", en: "not specified in v7" },
    porElemento: { es: "por elemento (pendiente de detalle)", en: "per element (field detail pending)" },
    contieneSup: { es: "contiene supuestos", en: "contains assumptions" },
    si: { es: "sí", en: "yes" }, no: { es: "no", en: "no" }
  };
  function tr(o, lang) { if (o == null) return ""; if (typeof o !== "object") return String(o); return o[lang] != null ? o[lang] : (o.es != null ? o.es : ""); }

  // Catálogo de tablas (orden del zip y del informe). grupo = casilla del panel.
  var CATALOGO = [
    { id: "nodos", n: { es: "Nodos", en: "Nodes" } },
    { id: "enlaces", n: { es: "Enlaces", en: "Links" } },
    { id: "enlaces_servicio", n: { es: "Enlaces × servicio", en: "Links × service" } },
    { id: "demandas", n: { es: "Demandas", en: "Demands" } },
    { id: "zonas", n: { es: "Zonas", en: "Zones" } },
    { id: "servicios", n: { es: "Servicios", en: "Services" } },
    { id: "arquitectura", n: { es: "Capas y equipos", en: "Layers and equipment" } },
    { id: "interfaces", n: { es: "Interfaces", en: "Interfaces" } },
    { id: "interconexiones", n: { es: "Interconexiones", en: "Interconnections" } },
    { id: "flujos", n: { es: "Flujos", en: "Flows" } },
    { id: "radio", n: { es: "Radio (bandas y áreas)", en: "Radio (bands and areas)" } },
    { id: "alarmas", n: { es: "Alarmas", en: "Alarms" } },
    { id: "n1", n: { es: "Barrido N-1", en: "N-1 sweep" }, lento: true },
    { id: "serie", n: { es: "Serie temporal 24 h (reloj)", en: "24 h time series (clock)" } },
    { id: "sucesos", n: { es: "Sucesos (registro SCADA)", en: "Events log (SCADA)" } },
    { id: "eventos", n: { es: "Eventos del caso LAB", en: "LAB case events" } },
    { id: "linaje", n: { es: "Linaje (valores, fórmulas, fuentes)", en: "Lineage (values, formulas, sources)" } },
    { id: "supuestos", n: { es: "Registro de supuestos", en: "Assumption register" } },
    { id: "valores_detallados", n: { es: "Valores detallados", en: "Detailed values" } },
    // Revisión 9 (ESTUDIOS)
    { id: "planificacion", n: { es: "Planificación 2026–2035", en: "Planning 2026–2035" } },
    { id: "sla", n: { es: "SLA por slice", en: "SLA per slice" } },
    { id: "disponibilidad", n: { es: "Disponibilidad (zonas, servicios, sucesos)", en: "Availability (zones, services, events)" } },
    { id: "comparacion", n: { es: "Comparación A/B", en: "A/B comparison" } }
  ];
  X.CATALOGO = CATALOGO;
  X.SEL_DEFECTO = function () {
    var t = {};
    CATALOGO.forEach(function (c) { t[c.id] = /^(nodos|enlaces|demandas|zonas|servicios|alarmas|supuestos)$/.test(c.id); });
    return { tablas: t, capas: true, servicios: true, solo: false, delta: true, una: "enlaces" };
  };

  // ======================================================================== utilidades
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function union(a, b) { var s = {}, o = []; arr(a).concat(arr(b)).forEach(function (x) { if (x != null && x !== "" && !s[x]) { s[x] = 1; o.push(String(x)); } }); return o; }
  function ordenIds(l) {
    return l.slice().sort(function (a, b) {
      var na = /(\d+)/.exec(a), nb = /(\d+)/.exec(b);
      if (na && nb && a.replace(/\d+/, "") === b.replace(/\d+/, "")) return Number(na[1]) - Number(nb[1]);
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function fechaTxt(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  function fechaArchivo(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()); }
  function slug(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40); }

  // Número para CSV Excel ES: sin separador de miles, coma decimal.
  function numCSV(x, dec) {
    if (!esNum(x)) return "";
    var s = dec == null ? String(Math.round(x * 1e6) / 1e6) : x.toFixed(dec);
    if (/^-0(\.0+)?$/.test(s)) s = s.slice(1);
    return s.replace(".", ",");
  }
  // Número para el informe: con separador de miles según idioma
  function numInf(x, dec, lang) {
    if (!esNum(x)) return "";
    if (dec == null) dec = Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : Math.abs(x) >= 1 ? 2 : 3;
    var s = x.toFixed(dec), neg = s[0] === "-";
    if (neg) s = s.slice(1);
    var p = s.split("."), ent = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : ".");
    if (lang !== "en" && p[0].length <= 4) ent = p[0];   // RAE: sin punto en números de 4 cifras
    var r = ent + (p[1] ? (lang === "en" ? "." : ",") + p[1] : "");
    return (neg && Number(s) !== 0 ? "−" : "") + r;
  }
  X.numCSV = numCSV; X.numInf = numInf;

  // Celda CSV: comillas si hay ; " o saltos; protección contra fórmulas en celdas de texto.
  function celdaCSV(s, esTexto) {
    s = s == null ? "" : String(s);
    if (esTexto && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[;"\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  X.celdaCSV = celdaCSV;
  function lineaCSV(celdas, textos) { return celdas.map(function (c, i) { return celdaCSV(c, textos ? textos[i] : true); }).join(";"); }

  function texto(v, lang) {
    if (v == null) return "";
    if (Array.isArray(v)) return v.map(function (x) { return texto(x, lang); }).filter(Boolean).join(", ");
    if (typeof v === "boolean") return tr(v ? TX.si : TX.no, lang);
    if (typeof v === "object") {
      if (v.es != null || v.en != null) return tr(v, lang);
      if ("valor" in v) return v.valor != null ? texto(v.valor, lang) + (v.unidad ? " " + v.unidad : "") : (v.nota ? String(v.nota) : "");
      if (v.doc) return v.doc + (v.seccion ? " " + v.seccion : "");
      if (v.texto) return String(v.texto);
      return JSON.stringify(v);
    }
    return String(v);
  }
  function fuenteTxt(f) {
    if (f == null) return "";
    if (Array.isArray(f)) return f.map(fuenteTxt).filter(Boolean).join(" | ");
    if (typeof f === "object") return (f.doc || "") + (f.seccion ? " " + f.seccion : "") + (f.v7 ? " [v7]" : "");
    return String(f);
  }

  // ======================================================================== procedencia
  function tipoNorm(x) {
    x = String(x == null ? "" : x).toLowerCase();
    if (/^(v7|entrega2|entrega 2|e2|documento|doc|data)$/.test(x)) return "v7";
    if (/^(anterior|previo|doc_anterior)$/.test(x)) return "anterior";
    if (/^(supuesto|hyp|hipotesis|hipótesis|inferido)$/.test(x)) return "supuesto";
    if (/^(calculado|calc|motor|generador)$/.test(x)) return "calculado";
    if (/^(usuario|user|importado)$/.test(x)) return "usuario";   // Revisión 8: modelo de demanda propio (LAB)
    return "";
  }
  X.tipoNorm = tipoNorm;
  function sIds(s) { return union(arr(s).map(function (x) { return x && typeof x === "object" ? x.id : x; })); }
  // Tipo del elemento entero (datos actuales, sin proc)
  function tipoElemento(o) {
    if (!o) return "";
    var t = tipoNorm(o.t) || tipoNorm(o.origen);
    if (t) return t;
    if (o.supuesto === true || (typeof o.supuesto === "string" && o.supuesto)) return "supuesto";
    if (o.inferido === true) return "supuesto";
    if (Array.isArray(o.fuente) && o.fuente.length) return o.fuente.some(function (f) { return f && f.v7; }) ? "v7" : "anterior";
    if (o.v7 && typeof o.v7 === "object" && !Array.isArray(o.v7) && o.v7.estado) return o.v7.estado === "v7" ? "v7" : "anterior";
    if (Array.isArray(o.v7) && o.v7.length) return "v7";
    if (o.fuente_e2) return "v7";
    if (typeof o.fuente === "string" && /v7|Entrega 2/i.test(o.fuente)) return "v7";
    if (o.fuente) return "anterior";
    return "";
  }
  function contieneSup(o) {
    return !!o && (o.supuesto === true || (typeof o.supuesto === "string" && !!o.supuesto) || o.inferido === true || o.origen === "supuesto");
  }
  // Procedencia de un campo: {t, f, s:[], det:bool}
  function procCampo(o, campo) {
    if (o && o.proc && typeof o.proc.t === "string") return { t: tipoNorm(o.proc.t) || (o.proc.s ? "supuesto" : "v7"), f: o.proc.f || "", s: sIds(o.proc.s), det: true, elem: true };
    if (o && o.proc && campo) {
      var cs = arr(campo);
      for (var i = 0; i < cs.length; i++) {
        var p = o.proc[cs[i]];
        if (p) return { t: tipoNorm(p.t) || (p.s ? "supuesto" : "v7"), f: p.f || "", s: sIds(p.s), det: true };
      }
      // proc existe pero no trae este campo: el dato no tiene procedencia propia
      if (tipoNorm(o.t)) return { t: tipoNorm(o.t), f: o.f || "", s: sIds(o.s), det: true, nada: true, elem: true };
      return { t: tipoElemento(o), f: o.fuente_e2 || fuenteTxt(o.fuente), s: [], det: true, nada: true };
    }
    if (o && tipoNorm(o.t) && (o.f != null || o.s != null)) return { t: tipoNorm(o.t), f: o.f || "", s: sIds(o.s), det: true, elem: true };
    return { t: tipoElemento(o), f: (o && (o.fuente_e2 || fuenteTxt(o.fuente))) || "", s: [], det: false };
  }
  X.procCampo = procCampo;

  // ======================================================================== capas (igual que app.js; en el navegador manda NOC)
  function capasDe(ctx) {
    var N = {};
    (ctx.RED.nodos || []).forEach(function (n) { N[n.id] = n; });
    function inter(id) { return /L2VPN|NTN/.test(id || ""); }
    var nodo = ctx.capaNodo || function (n) {
      if (!n) return null;
      switch (n.tipo) {
        case "site": return inter(n.id) ? "G" : "A";
        case "agg": return "C"; case "metro": return "D"; case "core": return "E"; case "edge": return "F"; case "ix": return "G";
      }
      return "D";
    };
    var enl = ctx.capaEnlace || function (e) {
      if (!e) return null;
      var ta = (N[e.a] || {}).tipo, tb = (N[e.b] || {}).tipo;
      if (e.tipo === "acceso") return inter(e.a + e.b) ? "G" : "A";
      if (e.tipo === "backhaul") return "C";
      if (e.tipo === "ix" || e.tipo === "sat") return "G";
      if (ta === "edge" || tb === "edge") return "F";
      return "D";
    };
    return { nodo: nodo, enlace: enl, N: N };
  }

  // ======================================================================== registro de supuestos
  function registroDe(ctx) {
    var M = ctx.Motor;
    try {
      if (M && typeof M.supuestos === "function") {
        var r = M.supuestos(ctx.RED);
        if (Array.isArray(r)) return r;
        if (r && Array.isArray(r.supuestos)) return r.supuestos;
      }
    } catch (e) { /* sin registro del motor */ }
    return Array.isArray(ctx.RED && ctx.RED.supuestos) ? ctx.RED.supuestos : null;
  }
  X.registroDe = registroDe;

  // ======================================================================== constructor de tablas
  // col: {k, n:{es,en}, u, dec, tipo:"num"|"txt"|"bool"|"lista", rol:"id"|"dato"|"calc"|"info", campo, delta, ancho}
  function C(k, es, en, o) { o = o || {}; o.k = k; o.n = { es: es, en: en || es }; o.tipo = o.tipo || (o.u || o.dec != null ? "num" : "txt"); o.rol = o.rol || "info"; return o; }
  function D(k, es, en, o) { o = o || {}; o.rol = "dato"; return C(k, es, en, o); }
  function K(k, es, en, o) { o = o || {}; o.rol = "calc"; return C(k, es, en, o); }

  function nuevaTabla(id, n, desc, cols) { return { id: id, archivo: id + ".csv", n: n, desc: desc || null, cols: cols, filas: [] }; }
  // Añade una fila. obj = elemento con proc; v = valores; extra = {dep, ref (valores REF para Δ), clave}
  function anadir(tab, obj, v, extra) {
    extra = extra || {};
    var celdas = {}, cuenta = { v7: 0, anterior: 0, supuesto: 0, calculado: 0, usuario: 0 }, sup = [], det = false, hayDato = false, sinTipo = 0, elemP = null, aplic = {};
    tab.cols.forEach(function (c) {
      if (c.rol === "dato") {
        hayDato = true;
        var p = (extra.proc && extra.proc[c.k]) || procCampo(obj, c.campo || c.k);
        if (p.det) det = true;
        if (p.elem) elemP = p;
        var vacio = v[c.k] == null || v[c.k] === "" || (Array.isArray(v[c.k]) && !v[c.k].length);
        // Un dato vacío solo cuenta si su vacío es un supuesto (p. ej. capacidad null = sin límite, S-006)
        if (vacio && !(p.t === "supuesto" && p.s.length)) { celdas[c.k] = { t: "", s: [] }; return; }
        celdas[c.k] = { t: p.t, s: p.s, f: p.f };
        if (p.t) cuenta[p.t] = (cuenta[p.t] || 0) + 1; else sinTipo++;
        sup = union(sup, p.s);
        if (p.t && p.t !== "supuesto" && p.s.length) aplic[p.t] = union(aplic[p.t], p.s);
      } else if (c.rol === "calc") {
        var vac = v[c.k] == null || v[c.k] === "";
        celdas[c.k] = { t: vac ? "" : "calculado", s: [] };
        if (!vac) cuenta.calculado++;
      }
    });
    var flagEl = !det && contieneSup(obj);
    tab.filas.push({ v: v, c: celdas, cuenta: cuenta, sup: ordenIds(sup), dep: ordenIds(union(extra.dep, [])), det: det || !hayDato,
      flagEl: flagEl, tipoEl: hayDato && !det ? tipoElemento(obj) : "", elemT: elemP ? elemP.t : "", elemS: elemP ? elemP.s : [], aplic: aplic, hayDato: hayDato, ref: extra.ref || null, clave: extra.clave || v.id || "" });
  }
  function resumenProc(f, lang) {
    var p = [];
    if (f.hayDato && !f.det) {
      p.push(tr(TX[f.tipoEl] || TX.sinEsp, lang) + (f.flagEl && f.tipoEl !== "supuesto" ? " (" + tr(TX.contieneSup, lang) + ")" : ""));
      p.push(tr(TX.porElemento, lang));
      if (f.cuenta.calculado) p.push(f.cuenta.calculado + " " + tr(f.cuenta.calculado === 1 ? TX.calculado : TX.calculados, lang));
      return p.join(" · ");
    }
    if (f.elemT) {
      p.push(tr(TX[f.elemT] || TX.sinEsp, lang) + (f.elemT !== "supuesto" && f.elemS && f.elemS.length ? " (" + f.elemS.join(" ") + ")" : "") + " (" + tr({ es: "todo el elemento", en: "whole element" }, lang) + ")");
      if (f.cuenta.calculado) p.push(f.cuenta.calculado + " " + tr(f.cuenta.calculado === 1 ? TX.calculado : TX.calculados, lang));
      return p.join(" · ");
    }
    // "calculado (S-028)": valor obtenido aplicando un supuesto
    var ap = function (k) { var l = f.aplic && f.aplic[k]; return l && l.length ? " (" + l.join(" ") + ")" : ""; };
    if (f.cuenta.v7) p.push(tr(TX.v7, lang) + ap("v7"));
    if (f.cuenta.anterior) p.push(tr(TX.anterior, lang) + ap("anterior"));
    if (f.cuenta.supuesto) p.push(f.cuenta.supuesto + " " + tr(f.cuenta.supuesto === 1 ? TX.supuesto : TX.supuestos, lang));
    if (f.cuenta.calculado) p.push(f.cuenta.calculado + " " + tr(f.cuenta.calculado === 1 ? TX.calculado : TX.calculados, lang) + ap("calculado"));
    if (f.cuenta.usuario) p.push(f.cuenta.usuario + " " + tr(f.cuenta.usuario === 1 ? TX.usuario : TX.usuarios, lang));
    return p.join(" · ") || "—";
  }
  X.resumenProc = resumenProc;
  function tieneSup(f) { return f.sup.length > 0 || f.flagEl || f.tipoEl === "supuesto" || (!f.hayDato && f.dep.length > 0); }

  // ---------------------------------------------------------------- tablas concretas
  var SEV = function (o, caido) { if (caido) return "DOWN"; if (o == null) return ""; return o > 1.0001 ? "CRIT" : o >= 0.85 ? "MAJ" : o >= 0.6 ? "MIN" : "OK"; };
  function ocOfrecida(r) {
    if (!r || !esNum(r.capacidad_gbps) || r.capacidad_gbps <= 0) return null;
    var of = esNum(r.demanda_gbps) ? r.demanda_gbps / r.capacidad_gbps : 0;
    return Math.max(r.ocupacion || 0, of);
  }
  function pct(x) { return esNum(x) ? x * 100 : null; }

  function construir(ctx, sel) {
    sel = sel || X.SEL_DEFECTO();
    var lang = ctx.lang === "en" ? "en" : "es";
    var RED = ctx.RED || {}, R = ctx.resultado || { enlaces: {}, nodos: {}, zonas: {}, demandas: [], resumen: {} };
    var lab = ctx.modo === "lab";
    var R0 = lab && sel.delta && ctx.referencia ? ctx.referencia : null;
    var CP = capasDe(ctx);
    var capasOn = sel.capas && ctx.capas ? ctx.capas : null;
    var svOn = sel.servicios && ctx.servicios ? ctx.servicios : null;
    function capaOk(c) { return !capasOn || !c || capasOn[c] !== false; }
    function svOk(c) { return !svOn || !c || svOn[c] !== false; }
    var Motor = ctx.Motor || {};
    function claseSv(s) { try { return Motor.claseServicio ? Motor.claseServicio(s).clase : (s.clase_servicio || ""); } catch (e) { return ""; } }

    // dependencias de resultados
    var demIdx = {};
    (R.demandas || []).forEach(function (d) { demIdx[d.id] = d; });
    var hayDepende = Object.keys(R.enlaces || {}).some(function (k) { return Array.isArray(R.enlaces[k].depende); }) ||
      (R.demandas || []).some(function (d) { return Array.isArray(d.depende); });
    function depDemandas(ids) { var u = []; arr(ids).forEach(function (id) { var d = demIdx[id]; if (d && d.depende) u = union(u, d.depende); }); return u; }
    function depDe(x) { return x ? (Array.isArray(x.depende) ? x.depende : depDemandas(x.demandas)) : []; }

    var tablas = [], quiere = sel.tablas || {};
    function poner(t) { tablas.push(t); return t; }
    var fuenteCol = C("fuente", "fuente", "source", { ancho: "largo" });

    // ---- nodos
    if (quiere.nodos) {
      var tn = poner(nuevaTabla("nodos", { es: "Nodos", en: "Nodes" }, { es: "Nodos de la red con sus datos de documento y la carga calculada en este caso.", en: "Network nodes with document data and the load computed for this case." }, [
        C("id", "id", "id", { rol: "id" }), C("nombre", "nombre", "name"), C("tipo", "tipo", "type"), C("capa", "capa", "layer"), C("area", "area", "area"),
        D("capacidad_gbps", "capacidad", "capacity", { u: "Gbps", dec: 1 }), D("latencia_ms", "latencia", "latency", { u: "ms", dec: 2 }),
        D("respaldo", "respaldo", "backup", { tipo: "lista" }), D("lat", "lat", "lat", { dec: 5, campo: "coord" }), D("lon", "lon", "lon", { dec: 5, campo: "coord" }),
        D("modelo", "modelo", "model", { campo: ["modelo", "funciones"], tipo: "lista", ancho: "medio" }),
        K("carga_gbps", "carga", "load", { u: "Gbps", dec: 2, delta: 1 }), K("ofrecida_gbps", "demanda_ofrecida", "offered_demand", { u: "Gbps", dec: 2 }),
        K("ocupacion_pct", "ocupacion", "occupancy", { u: "pct", dec: 2, delta: 1 }), K("caido", "caido", "down", { tipo: "bool" }),
        K("n_demandas", "n_demandas", "n_demands", { dec: 0 }), fuenteCol
      ]));
      (RED.nodos || []).forEach(function (n) {
        var capa = CP.nodo(n);
        if (!capaOk(capa)) return;
        var r = (R.nodos || {})[n.id], r0 = R0 && (R0.nodos || {})[n.id];
        var v = { id: n.id, nombre: n.nombre, tipo: n.tipo, capa: capa, area: n.area, capacidad_gbps: n.capacidad_gbps, latencia_ms: n.latencia_ms,
          respaldo: n.respaldo, lat: n.coord && n.coord[0], lon: n.coord && n.coord[1], modelo: n.modelo || n.funciones,
          carga_gbps: r ? r.carga_gbps : null, ofrecida_gbps: r ? r.demanda_gbps : null, ocupacion_pct: r && esNum(r.capacidad_gbps) && r.capacidad_gbps > 0 ? pct(ocOfrecida(r)) : null,
          caido: r ? !!r.caido : null, n_demandas: r ? (r.demandas || []).length : null, fuente: n.fuente_e2 || fuenteTxt(n.fuente) };
        anadir(tn, n, v, { dep: depDe(r), ref: r0 ? { carga_gbps: r0.carga_gbps, ocupacion_pct: esNum(r0.capacidad_gbps) && r0.capacidad_gbps > 0 ? pct(ocOfrecida(r0)) : null } : null });
      });
    }

    // ---- enlaces
    if (quiere.enlaces) {
      var te = poner(nuevaTabla("enlaces", { es: "Enlaces", en: "Links" }, { es: "Capacidad (documento) frente a carga por sentido (motor). Ocupación = máx(A→B, B→A, ofrecida) / capacidad.", en: "Capacity (document) vs. load per direction (engine). Occupancy = max(A→B, B→A, offered) / capacity." }, [
        C("id", "id", "id", { rol: "id" }), D("a", "a", "a", { campo: ["a", "a/b"] }), D("b", "b", "b", { campo: ["b", "a/b"] }), C("tipo", "tipo", "type"), C("capa", "capa", "layer"),
        D("capacidad_gbps", "capacidad", "capacity", { u: "Gbps", dec: 1 }), D("km", "longitud", "length", { u: "km", dec: 2 }),
        D("proteccion", "proteccion", "protection"), D("srlg", "srlg", "srlg"),
        K("carga_ab_gbps", "carga_A-B", "load_A-B", { u: "Gbps", dec: 2, delta: 1 }), K("carga_ba_gbps", "carga_B-A", "load_B-A", { u: "Gbps", dec: 2, delta: 1 }),
        K("ofrecida_gbps", "demanda_ofrecida", "offered_demand", { u: "Gbps", dec: 2 }), K("ocupacion_pct", "ocupacion", "occupancy", { u: "pct", dec: 2, delta: 1 }),
        K("severidad", "severidad", "severity"), K("caido", "caido", "down", { tipo: "bool" }), K("n_demandas", "n_demandas", "n_demands", { dec: 0 }), fuenteCol
      ]));
      (RED.enlaces || []).forEach(function (e) {
        var capa = CP.enlace(e);
        if (!capaOk(capa)) return;
        var r = (R.enlaces || {})[e.id], r0 = R0 && (R0.enlaces || {})[e.id], o = ocOfrecida(r);
        var v = { id: e.id, a: e.a, b: e.b, tipo: e.tipo, capa: capa, capacidad_gbps: e.capacidad_gbps, km: e.km, proteccion: e.proteccion, srlg: e.srlg,
          carga_ab_gbps: r ? r.carga_ab : null, carga_ba_gbps: r ? r.carga_ba : null, ofrecida_gbps: r ? r.demanda_gbps : null,
          ocupacion_pct: pct(o), severidad: r ? SEV(o, r.caido) : "", caido: r ? !!r.caido : null, n_demandas: r ? (r.demandas || []).length : null,
          fuente: e.fuente_e2 || fuenteTxt(e.fuente) };
        anadir(te, e, v, { dep: depDe(r), ref: r0 ? { carga_ab_gbps: r0.carga_ab, carga_ba_gbps: r0.carga_ba, ocupacion_pct: pct(ocOfrecida(r0)) } : null });
      });
    }

    // ---- enlaces × servicio
    if (quiere.enlaces_servicio) {
      var tes = poner(nuevaTabla("enlaces_servicio", { es: "Enlaces × servicio", en: "Links × service" }, { es: "Desglose de la carga de cada enlace por tipo de servicio (solo filas con carga).", en: "Breakdown of each link's load by service type (rows with load only)." }, [
        C("enlace", "enlace", "link", { rol: "id" }), C("capa", "capa", "layer"), C("servicio", "servicio", "service"),
        K("carga_ab_gbps", "carga_A-B", "load_A-B", { u: "Gbps", dec: 3, delta: 1 }), K("carga_ba_gbps", "carga_B-A", "load_B-A", { u: "Gbps", dec: 3, delta: 1 }),
        K("cuota_pct", "cuota_del_enlace", "share_of_link", { u: "pct", dec: 2 })
      ]));
      (RED.enlaces || []).forEach(function (e) {
        var capa = CP.enlace(e), r = (R.enlaces || {})[e.id];
        if (!capaOk(capa) || !r || !r.por_servicio) return;
        var tot = 0;
        Object.keys(r.por_servicio).forEach(function (k) { tot += (r.por_servicio[k].ab || 0) + (r.por_servicio[k].ba || 0); });
        Object.keys(r.por_servicio).forEach(function (k) {
          var x = r.por_servicio[k];
          if (!svOk(k) || !((x.ab || 0) + (x.ba || 0) > 0)) return;
          var x0 = R0 && R0.enlaces && R0.enlaces[e.id] && R0.enlaces[e.id].por_servicio ? R0.enlaces[e.id].por_servicio[k] : null;
          anadir(tes, null, { enlace: e.id, capa: capa, servicio: k, carga_ab_gbps: x.ab, carga_ba_gbps: x.ba, cuota_pct: tot > 0 ? ((x.ab || 0) + (x.ba || 0)) / tot * 100 : null },
            { dep: depDe(r), clave: e.id + "/" + k, ref: x0 ? { carga_ab_gbps: x0.ab, carga_ba_gbps: x0.ba } : null });
        });
      });
    }

    // ---- demandas
    if (quiere.demandas) {
      var SVIDX = {}; (RED.servicios || []).forEach(function (s) { SVIDX[s.id] = s; });
      var ZIDX = {}, NEC = {}; (RED.zonas || []).forEach(function (z) { ZIDX[z.id] = z; arr(z.necesidades).forEach(function (n) { if (n && n.id) NEC[n.id] = n; }); });
      var td = poner(nuevaTabla("demandas", { es: "Demandas", en: "Demands" }, { es: "Cada demanda del caso (zona o servicio especial hacia su destino), con lo servido y la ruta.", en: "Each demand in the case (zone or special service to its destination), with served traffic and route." }, [
        C("id", "id", "id", { rol: "id" }), C("padre", "padre", "parent"), C("zona", "zona", "zone"), C("servicio", "servicio", "service"), C("tipo", "tipo", "type"),
        D("prioridad", "prioridad", "priority", { dec: 0 }), C("origen", "origen", "origin"), D("destino_nodo", "destino", "destination", { campo: ["destino_nodo", "destino"] }),
        D("dl_gbps", "DL", "DL", { u: "Gbps", dec: 3 }), D("ul_gbps", "UL", "UL", { u: "Gbps", dec: 3 }),
        K("servida_gbps", "servida", "served", { u: "Gbps", dec: 3, delta: 1 }), K("servida_pct", "servida", "served", { u: "pct", dec: 2 }),
        K("latencia_ms", "latencia", "latency", { u: "ms", dec: 3 }), C("latencia_max_ms", "latencia_max", "max_latency", { u: "ms", dec: 2 }),
        K("via", "via", "path"), K("estado", "estado", "status"), K("ruta", "ruta", "route", { ancho: "largo" })
      ]));
      var dRef = {}; if (R0) (R0.demandas || []).forEach(function (d) { dRef[d.id] = d; });
      (R.demandas || []).forEach(function (d) {
        if (!svOk(d.clase_servicio)) return;
        // El DL/UL de una demanda viene de la necesidad de su zona o del servicio especial: hereda su procedencia
        var fuenteObj = SVIDX[d.padre] || SVIDX[d.id.split("@")[0]] || NEC[d.padre] || NEC[d.id.split("@")[0]] || null, pr = null;
        if (d.proc) pr = { dl_gbps: procCampo(d, "dl_gbps"), ul_gbps: procCampo(d, "ul_gbps"), prioridad: procCampo(d, "prioridad"), destino_nodo: procCampo(d, ["destino_nodo", "destino"]) };
        else if (fuenteObj) pr = { dl_gbps: procCampo(fuenteObj, "dl_gbps"), ul_gbps: procCampo(fuenteObj, "ul_gbps"), prioridad: procCampo(fuenteObj, "prioridad"), destino_nodo: procCampo(fuenteObj, ["destino_nodo", "destino"]) };
        else {
          var z = ZIDX[d.zona], calc = { t: "calculado", f: { es: "generador de demanda por zona", en: "zone demand generator" }[lang], s: [], det: !!(z && z.proc) };
          var pz = z ? procCampo(z, "dl_gbps") : null;
          var dl = pz && pz.det && !pz.nada ? pz : calc;
          pr = { dl_gbps: dl, ul_gbps: dl, prioridad: calc, destino_nodo: calc };
          if (!calc.det) { pr = null; }
        }
        // Revisión 8: campos tocados por el modelo del usuario (resultado.demandas[i].proc_usuario) -> tipo "usuario"
        if (d.proc_usuario && typeof d.proc_usuario === "object") {
          pr = pr || {};
          ["dl_gbps", "ul_gbps", "prioridad"].forEach(function (k) {
            var pu = d.proc_usuario[k];
            if (pu) pr[k] = { t: "usuario", f: pu.f || "", s: [], det: true };
          });
        }
        var obj = d.proc ? d : (fuenteObj || ZIDX[d.zona] || d);
        var d0 = dRef[d.id];
        anadir(td, obj, { id: d.id, padre: d.padre, zona: d.zona, servicio: d.clase_servicio, tipo: d.tipo, prioridad: d.prioridad, origen: d.origen,
          destino_nodo: d.destino_nodo || d.destino, dl_gbps: d.dl_gbps, ul_gbps: d.ul_gbps, servida_gbps: d.servida_gbps,
          servida_pct: esNum(d.dl_gbps) && d.dl_gbps > 0 ? d.servida_gbps / d.dl_gbps * 100 : null, latencia_ms: d.latencia_ms, latencia_max_ms: d.latencia_max_ms,
          via: d.via, estado: d.estado, ruta: (d.ruta || []).join(" > ") },
          { dep: arr(d.depende), proc: pr, ref: d0 ? { servida_gbps: d0.servida_gbps } : null });
      });
    }

    // ---- zonas
    if (quiere.zonas && capaOk("B")) {
      var tz = poner(nuevaTabla("zonas", { es: "Zonas", en: "Zones" }, { es: "Municipios de demanda (capa B): población y abonados de documento; DL y servida calculados en este caso.", en: "Demand municipalities (layer B): population and subscribers from documents; DL and served computed for this case." }, [
        C("id", "id", "id", { rol: "id" }), C("nombre", "nombre", "name"), C("area", "area_metro", "metro_area"),
        D("poblacion", "poblacion_2031", "population_2031", { dec: 0 }), D("poblacion_2025", "poblacion_2025", "population_2025", { dec: 0 }),
        D("hogares", "hogares_2025", "households_2025", { dec: 0, campo: ["hogares", "hogares_2025"] }), D("hogar_medio", "hogar_medio", "avg_household", { dec: 2 }),
        D("empresas_2025", "empresas_2025", "companies_2025", { dec: 0 }), D("abonados_fijos", "abonados_fijos", "fixed_subscribers", { dec: 0 }),
        D("abonados_moviles", "abonados_moviles", "mobile_subscribers", { dec: 0 }), D("lineas_datos_moviles", "lineas_datos_moviles", "mobile_data_lines", { dec: 0 }),
        C("agg", "agregacion", "aggregation"), C("edge", "edge", "edge"),
        K("dl_gbps", "DL", "DL", { u: "Gbps", dec: 2, delta: 1 }), K("servida_gbps", "servida", "served", { u: "Gbps", dec: 2, delta: 1 }), K("servida_pct", "servida", "served", { u: "pct", dec: 2 }), fuenteCol
      ]));
      (RED.zonas || []).forEach(function (z) {
        var r = (R.zonas || {})[z.id], r0 = R0 && (R0.zonas || {})[z.id];
        var dep = []; (R.demandas || []).forEach(function (d) { if (d.zona === z.id && d.depende) dep = union(dep, d.depende); });
        anadir(tz, z, { id: z.id, nombre: z.nombre, area: z.area, poblacion: z.poblacion, poblacion_2025: z.poblacion_2025, hogares: z.hogares != null ? z.hogares : z.hogares_2025,
          hogar_medio: z.hogar_medio, empresas_2025: z.empresas_2025, abonados_fijos: z.abonados_fijos, abonados_moviles: z.abonados_moviles, lineas_datos_moviles: z.lineas_datos_moviles,
          agg: z.agg, edge: z.edge, dl_gbps: r ? r.dl_gbps : null, servida_gbps: r ? r.servida_gbps : null, servida_pct: r ? r.pct : null, fuente: z.fuente_e2 || fuenteTxt(z.fuente) },
          { dep: dep, ref: r0 ? { dl_gbps: r0.dl_gbps, servida_gbps: r0.servida_gbps } : null });
      });
    }

    // ---- servicios (por tipo y servicios especiales)
    if (quiere.servicios) {
      var NOMSV = { movil: { es: "Móvil eMBB", en: "Mobile eMBB" }, ftth: { es: "FTTH fijo (BNG)", en: "FTTH fixed (BNG)" }, voz: { es: "Voz (VoNR/IMS y fija)", en: "Voice (VoNR/IMS and fixed)" },
        urllc: { es: "URLLC / V2X", en: "URLLC / V2X" }, iot: { es: "IoT / sensores", en: "IoT / sensors" }, empresa: { es: "Empresa / L2VPN", en: "Enterprise / L2VPN" },
        evento: { es: "Evento / estadio (MEC)", en: "Event / stadium (MEC)" }, ntn: { es: "Satélite NTN", en: "NTN satellite" } };
      var tc = poner(nuevaTabla("servicios_tipo", { es: "Servicios por tipo", en: "Services by type" }, { es: "Resumen del motor por tipo de servicio (resumen.por_servicio).", en: "Engine summary per service type (resumen.por_servicio)." }, [
        C("servicio", "servicio", "service", { rol: "id" }), C("nombre", "nombre", "name"),
        K("dl_gbps", "DL", "DL", { u: "Gbps", dec: 2, delta: 1 }), K("ul_gbps", "UL", "UL", { u: "Gbps", dec: 2, delta: 1 }),
        K("servida_gbps", "servida", "served", { u: "Gbps", dec: 2, delta: 1 }), K("servida_pct", "servida", "served", { u: "pct", dec: 2, delta: 1 }), K("n_demandas", "n_demandas", "n_demands", { dec: 0 })
      ]));
      var ps = (R.resumen || {}).por_servicio || {}, ps0 = R0 ? (R0.resumen || {}).por_servicio || {} : {};
      Object.keys(ps).forEach(function (k) {
        if (!svOk(k)) return;
        var x = ps[k], x0 = ps0[k], dep = [];
        (R.demandas || []).forEach(function (d) { if (d.clase_servicio === k && d.depende) dep = union(dep, d.depende); });
        anadir(tc, null, { servicio: k, nombre: tr(NOMSV[k] || k, lang), dl_gbps: x.dl_gbps, ul_gbps: x.ul_gbps, servida_gbps: x.servida_gbps, servida_pct: x.pct, n_demandas: x.n },
          { dep: dep, clave: k, ref: x0 ? { dl_gbps: x0.dl_gbps, ul_gbps: x0.ul_gbps, servida_gbps: x0.servida_gbps, servida_pct: x0.pct } : null });
      });
      var ts = poner(nuevaTabla("servicios", { es: "Servicios especiales", en: "Special services" }, { es: "Servicios con sitio propio (RED.servicios): demanda, prioridad y destino.", en: "Services with their own site (RED.servicios): demand, priority and destination." }, [
        C("id", "id", "id", { rol: "id" }), C("nombre", "nombre", "name", { ancho: "medio" }), C("servicio", "tipo_servicio", "service_type"), C("zona", "zona", "zone"), C("nodo", "sitio", "site"), C("capa", "capa", "layer"),
        C("perfil", "perfil", "profile"), D("destino", "destino", "destination"), C("slice", "slice", "slice"),
        D("dl_gbps", "DL", "DL", { u: "Gbps", dec: 3 }), D("ul_gbps", "UL", "UL", { u: "Gbps", dec: 3 }), D("prioridad", "prioridad", "priority", { dec: 0 }),
        D("arp", "ARP", "ARP", { dec: 0 }), D("qi5", "5QI", "5QI", { dec: 0 }), D("latencia_max_ms", "latencia_max", "max_latency", { u: "ms", dec: 2 }),
        D("capacidad_acceso_gbps", "capacidad_acceso", "access_capacity", { u: "Gbps", dec: 1 }), C("activo", "activo_por_defecto", "active_by_default", { tipo: "bool" }), fuenteCol
      ]));
      (RED.servicios || []).forEach(function (s) {
        var cl = claseSv(s), capa = CP.nodo(CP.N[s.nodo]);
        if (!svOk(cl) || !capaOk(capa)) return;
        var dep = []; (R.demandas || []).forEach(function (d) { if ((d.padre === s.id || d.id.split("@")[0] === s.id) && d.depende) dep = union(dep, d.depende); });
        anadir(ts, s, { id: s.id, nombre: s.nombre, servicio: cl, zona: s.zona, nodo: s.nodo, capa: capa, perfil: s.perfil, destino: s.destino_nodo || s.destino, slice: s.slice,
          dl_gbps: s.dl_gbps, ul_gbps: s.ul_gbps, prioridad: s.prioridad, arp: s.arp, qi5: s.qi5, latencia_max_ms: s.latencia_max_ms, capacidad_acceso_gbps: s.capacidad_acceso_gbps,
          activo: !s.inactivo_por_defecto, fuente: fuenteTxt(s.fuente) }, { dep: dep });
      });
    }

    // ---- arquitectura: capas, elementos, equipos
    var ARQ = ctx.ARQ;
    if (quiere.arquitectura && ARQ) {
      var tca = poner(nuevaTabla("capas", { es: "Capas A–H", en: "Layers A–H" }, null, [
        C("id", "capa", "layer", { rol: "id" }), C("nombre", "nombre", "name"), D("tecnologias", "tecnologias", "technologies", { tipo: "lista", ancho: "largo" }), fuenteCol
      ]));
      (ARQ.capas || []).forEach(function (c) {
        if (!capaOk(c.id)) return;
        anadir(tca, c, { id: c.id, nombre: tr(c.nombre, lang), tecnologias: c.tecnologias, fuente: fuenteTxt(c.fuente) });
      });
      var tel = poner(nuevaTabla("elementos", { es: "Elementos funcionales", en: "Functional elements" }, null, [
        C("id", "id", "id", { rol: "id" }), C("nombre", "nombre", "name", { ancho: "medio" }), C("capa", "capa", "layer"), D("funciones", "funciones", "functions", { tipo: "lista", ancho: "largo" }),
        D("ubicacion", "ubicacion", "location"), D("cantidad", "cantidad", "quantity"), D("redundancia", "redundancia", "redundancy", { ancho: "medio" }),
        C("equipos", "equipos", "equipment", { tipo: "lista" }), C("v7", "datos_v7", "v7_data", { ancho: "largo" }), fuenteCol
      ]));
      (ARQ.elementos || []).forEach(function (el) {
        if (!capaOk(el.capa)) return;
        anadir(tel, el, { id: el.id, nombre: el.nombre, capa: el.capa, funciones: el.funciones, ubicacion: el.ubicacion, cantidad: el.cantidad, redundancia: el.redundancia,
          equipos: el.equipos, v7: arr(el.v7).map(function (x) { return x && x.k ? x.k + ": " + x.v : texto(x, lang); }).join(" | "), fuente: fuenteTxt(el.fuente) });
      });
      var teq = poner(nuevaTabla("equipos", { es: "Equipos", en: "Equipment" }, null, [
        C("id", "id", "id", { rol: "id" }), C("capa", "capa", "layer"), C("rol", "rol", "role", { ancho: "medio" }), D("fabricante", "fabricante", "vendor"),
        D("modelo", "modelo", "model", { ancho: "medio" }), D("cantidad", "cantidad", "quantity"), D("capacidad", "capacidad", "capacity", { ancho: "medio" }),
        D("redundancia", "redundancia", "redundancy", { ancho: "medio" }), D("dimensionado", "dimensionado", "sizing"), C("estado_v7", "estado_v7", "v7_status"),
        C("v7", "nota_v7", "v7_note", { ancho: "largo" }), fuenteCol
      ]));
      Object.keys(ARQ.equipos || {}).forEach(function (k) {
        var q = ARQ.equipos[k];
        if (!capaOk(q.capa)) return;
        anadir(teq, q, { id: q.id, capa: q.capa, rol: q.rol, fabricante: q.fabricante, modelo: q.modelo, cantidad: texto(q.cantidad, lang), capacidad: texto(q.capacidad, lang),
          redundancia: texto(q.redundancia, lang), dimensionado: q.dimensionado ? texto(q.dimensionado.resultado, lang) : "", estado_v7: q.v7 && q.v7.estado,
          v7: q.v7 && q.v7.texto, fuente: fuenteTxt(q.fuente) });
      });
    }
    if (quiere.interfaces && ARQ) {
      var ti = poner(nuevaTabla("interfaces", { es: "Interfaces", en: "Interfaces" }, null, [
        C("id", "id", "id", { rol: "id" }), D("entre", "entre", "between", { tipo: "lista" }), D("protocolo", "protocolo", "protocol"), D("transporte", "transporte", "transport"),
        C("descripcion", "descripcion", "description", { ancho: "largo" }), C("inferido", "inferido", "inferred", { tipo: "bool" }), fuenteCol
      ]));
      (ARQ.interfaces || []).forEach(function (x) {
        anadir(ti, x, { id: x.id, entre: x.entre, protocolo: x.protocolo, transporte: x.transporte, descripcion: x.descripcion, inferido: !!x.inferido, fuente: fuenteTxt(x.fuente) });
      });
    }
    if (quiere.interconexiones && ARQ && capaOk("G")) {
      var tix = poner(nuevaTabla("interconexiones", { es: "Interconexiones", en: "Interconnections" }, null, [
        C("id", "id", "id", { rol: "id" }), D("red_externa", "red_externa", "external_network", { ancho: "medio" }), D("punto_fisico", "punto_fisico", "physical_point", { ancho: "medio" }),
        D("protocolo", "protocolo", "protocol"), D("capacidad", "capacidad", "capacity"), D("proteccion", "proteccion", "protection", { ancho: "medio" }),
        C("excluida", "excluida", "excluded", { tipo: "bool" }), C("si_falla", "si_falla", "if_fails", { ancho: "largo" }), C("v7", "dato_v7", "v7_data", { ancho: "largo" }), fuenteCol
      ]));
      (ARQ.interconexiones || []).forEach(function (x) {
        anadir(tix, x, { id: x.id, red_externa: x.red_externa, punto_fisico: x.punto_fisico, protocolo: x.protocolo, capacidad: texto(x.capacidad, lang), proteccion: x.proteccion,
          excluida: !!x.excluida, si_falla: texto(x.si_falla, lang), v7: x.v7 ? texto(x.v7.dato || x.v7, lang) : "", fuente: fuenteTxt(x.fuente) });
      });
    }
    if (quiere.flujos && ARQ) {
      var tf = poner(nuevaTabla("flujos", { es: "Flujos de extremo a extremo", en: "End-to-end flows" }, null, [
        C("id", "id", "id", { rol: "id" }), C("servicio", "servicio", "service"), C("origen", "origen", "origin"), D("camino", "camino", "path", { tipo: "lista", ancho: "largo" }),
        D("interfaces", "interfaces", "interfaces", { tipo: "lista" }), D("respaldo", "respaldo", "backup", { ancho: "medio" }), C("objetivo", "objetivo", "target"),
        C("inferido", "inferido", "inferred", { tipo: "bool" }), fuenteCol
      ]));
      (ARQ.flujos || []).forEach(function (x) {
        anadir(tf, x, { id: x.id, servicio: x.servicio, origen: x.origen, camino: arr(x.camino).join(" > "), interfaces: x.interfaces, respaldo: texto(x.respaldo, lang),
          objetivo: texto(x.objetivo, lang), inferido: !!x.inferido, fuente: fuenteTxt(x.fuente) });
      });
    }

    // ---- radio
    var RADIO = ctx.RADIO;
    if (quiere.radio && RADIO && capaOk("A")) {
      var tb = poner(nuevaTabla("radio_bandas", { es: "Bandas de radio", en: "Radio bands" }, null, [
        C("id", "banda", "band", { rol: "id" }), D("frecuencia", "frecuencia", "frequency"), D("duplex", "duplex", "duplex"), D("ancho", "ancho", "bandwidth"),
        D("scs_khz", "scs", "scs", { u: "kHz", dec: 0 }), D("sector_dl_mbps", "sector_DL", "sector_DL", { u: "Mbps", dec: 0, campo: ["sector_dl_mbps", "sector_mbps"] }),
        D("sector_ul_mbps", "sector_UL", "sector_UL", { u: "Mbps", dec: 0, campo: ["sector_ul_mbps", "sector_mbps"] }), D("pire_dbm", "PIRE", "EIRP", { u: "dBm", dec: 1 }),
        D("latencia_p95_ms", "latencia_P95", "latency_P95", { u: "ms", dec: 1 }), C("rol", "rol", "role", { ancho: "medio" }), fuenteCol
      ]));
      (RADIO.bandas || []).forEach(function (b) {
        var sm = b.sector_mbps || {};
        anadir(tb, b, { id: b.id, frecuencia: b.frecuencia, duplex: b.duplex, ancho: b.ancho, scs_khz: b.scs_khz, sector_dl_mbps: sm.dl, sector_ul_mbps: sm.ul, pire_dbm: b.pire_dbm,
          latencia_p95_ms: b.latencia_p95_ms, rol: tr(b.rol, lang), fuente: fuenteTxt(b.fuente) }, { proc: b.proc || tipoNorm(b.t) ? null : uniforme(b, "v7") });
      });
      var ta = poner(nuevaTabla("radio_areas", { es: "Áreas de radio", en: "Radio areas" }, { es: "Áreas por zona y banda. Las áreas son de dibujo, no mapas de cobertura (v7 §6.2.4).", en: "Areas per zone and band. Drawing areas, not coverage maps (v7 §6.2.4)." }, [
        C("id", "id", "id", { rol: "id" }), C("banda", "banda", "band"), C("zona", "zona", "zone"), C("tipo", "tipo", "type"),
        D("radio_m", "radio_dibujo", "drawing_radius", { u: "m", dec: 0 }), D("radio_ul_km", "radio_UL", "UL_radius", { u: "km", dec: 2 }), D("radio_dl_km", "radio_DL", "DL_radius", { u: "km" , tipo: "txt" }),
        D("sitios", "sitios", "sites", { dec: 0, campo: ["sitios"] }), D("sectores_n78", "sectores_n78", "n78_sectors", { dec: 0 }), D("capacidad_gbps", "capacidad", "capacity", { u: "Gbps", dec: 2 }),
        D("latencia_ms", "latencia", "latency", { u: "ms", dec: 2 }), D("area_km2", "area", "area", { u: "km2", dec: 2 }), C("motivo_supuesto", "motivo_supuesto", "assumption_reason", { ancho: "largo" }), fuenteCol
      ]));
      (RADIO.areas || []).forEach(function (a) {
        var pr = null;
        if (!a.proc) {
          var base = { t: tipoNorm(a.origen) || "supuesto", f: fuenteTxt(a.fuente), s: [], det: false };
          var sit = { t: tipoNorm(a.origen_sitios) || base.t, f: base.f, s: [], det: false };
          pr = { radio_m: base, radio_ul_km: base, radio_dl_km: base, sitios: sit, sectores_n78: base, capacidad_gbps: base, latencia_ms: base, area_km2: base };
        }
        anadir(ta, a, { id: a.id, banda: a.banda, zona: a.zona, tipo: a.tipo, radio_m: a.radio_m, radio_ul_km: a.radio_ul_km, radio_dl_km: a.radio_dl_km != null ? String(a.radio_dl_km).replace(".", lang === "en" ? "." : ",") : null,
          sitios: a.sitios, sectores_n78: a.sectores_n78, capacidad_gbps: a.capacidad_gbps, latencia_ms: a.latencia_ms, area_km2: a.area_km2,
          motivo_supuesto: typeof a.supuesto === "string" ? a.supuesto : "", fuente: fuenteTxt(a.fuente) }, { proc: pr });
      });
    }

    // ---- alarmas
    if (quiere.alarmas) {
      var tal = poner(nuevaTabla("alarmas", { es: "Alarmas", en: "Alarms" }, null, [
        K("severidad", "severidad", "severity"), C("elemento", "elemento", "element", { rol: "id" }), K("texto", "texto", "text", { ancho: "largo" }), C("origen", "origen", "origin")
      ]));
      var ALS = ctx.alarmas;
      if (!ALS) {
        ALS = ((R.resumen || {}).alertas || []).map(function (a) {
          var x = a.texto || "", m = x.match(/\b(L-[A-Z0-9-]+)/);
          return { sev: a.nivel === "grave" ? "crit" : a.nivel === "aviso" ? (/recortan/.test(x) ? "maj" : "min") : /sin incidencias|no afecta/.test(x) ? "ok" : "wrn", elem: m ? m[1] : "", texto: x, fuente: "motor" };
        });
      }
      ALS.forEach(function (a, i) {
        var dep = a.elem && R.enlaces && R.enlaces[a.elem] ? depDe(R.enlaces[a.elem]) : a.elem && R.nodos && R.nodos[a.elem] ? depDe(R.nodos[a.elem]) : [];
        anadir(tal, null, { severidad: { crit: "CRIT", maj: "MAJ", min: "MIN", wrn: "WRN", ok: "OK", unk: "DOWN" }[a.sev] || a.sev, elemento: a.elem || "", texto: a.texto,
          origen: a.fuente === "umbral" ? tr({ es: "umbral 85 %", en: "85 % threshold" }, lang) : tr({ es: "motor", en: "engine" }, lang) }, { dep: dep, clave: (a.elem || "") + "#" + i });
      });
    }

    // ---- N-1
    if (quiere.n1) {
      var t1 = poner(nuevaTabla("n1", { es: "Barrido N-1", en: "N-1 sweep" }, { es: "Cada elemento caído uno a uno con el tráfico del caso (sin sus fallos), de peor a mejor.", en: "Each element failed one at a time with the case traffic (without its faults), worst to best." }, [
        K("rango", "rango", "rank", { dec: 0 }), C("id", "elemento_caido", "failed_element", { rol: "id" }), C("clase", "clase", "class"), C("tipo", "tipo", "type"), C("nombre", "nombre", "name"),
        K("servida_pct", "servida", "served", { u: "pct", dec: 2 }), K("delta_pp", "delta_servida", "served_delta", { u: "pp", dec: 2 }),
        K("ocupacion_max_pct", "ocupacion_max", "max_occupancy", { u: "pct", dec: 1 }), K("enlace_max", "enlace_max", "max_link"),
        K("demandas_caidas", "demandas_sin_ruta", "dropped_demands", { dec: 0 }), K("alertas_graves", "alarmas_graves", "severe_alarms", { dec: 0 })
      ]));
      var filasN1 = ctx.n1;
      if (!filasN1 && typeof Motor.barridoN1 === "function") {
        try {
          var op = JSON.parse(JSON.stringify(ctx.opciones || {}));
          delete op.fallos; if (op.caso) op.caso.fallo = [];
          filasN1 = Motor.barridoN1(RED, op);
        } catch (e) { filasN1 = []; t1.error = String(e && e.message || e); }
      }
      filasN1 = Array.isArray(filasN1) ? filasN1 : (filasN1 && (filasN1.resultados || filasN1.filas)) || [];
      var base = (R.resumen || {}).pct_servida;
      filasN1.forEach(function (x, i) {
        var s = x.resumen || x;
        anadir(t1, null, { rango: i + 1, id: x.id || x.elemento, clase: x.clase, tipo: x.tipo, nombre: x.nombre, servida_pct: s.pct_servida,
          delta_pp: esNum(s.pct_servida) && esNum(base) ? s.pct_servida - base : null, ocupacion_max_pct: pct(esNum(s.max_ocupacion_ofrecida) ? s.max_ocupacion_ofrecida : s.max_ocupacion),
          enlace_max: s.enlace_max || x.enlace_max, demandas_caidas: x.demandas_caidas, alertas_graves: x.alertas_graves }, { dep: arr(x.depende || s.supuestos_usados) });
      });
    }

    // ---- serie temporal (Revisión 4, reloj.js): KPI por paso y enlaces en formato largo. Solo si hay serie calculada.
    var SER = ctx.serie;
    if (quiere.serie && SER && SER.pasos && SER.pasos.length) {
      var CLS = Motor.CLASES_SERVICIO || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
      var depSer = arr(SER.supuestos_usados);
      var tsk = poner(nuevaTabla("serie_kpi", { es: "Serie temporal · KPI", en: "Time series · KPIs" },
        { es: "Un paso por fila (Motor.serie, paso " + (SER.paso_min || "") + " min)." + (SER.aviso ? " " + SER.aviso : ""), en: "One step per row (Motor.serie, step " + (SER.paso_min || "") + " min)." + (SER.aviso ? " " + SER.aviso : "") },
        [K("paso", "paso", "step", { dec: 0 }), C("hora", "hora", "time", { rol: "id" }), K("dl_total_gbps", "dl_total", "total_dl", { u: "Gbit/s", dec: 2 }),
          K("servido_pct", "servido", "served", { u: "pct", dec: 2 }), K("ocup_max_pct", "ocupacion_max", "max_occupancy", { u: "pct", dec: 1 }), K("ocup_max_id", "enlace_max", "max_link"),
          K("n_alarmas", "alarmas", "alarms", { dec: 0 }), K("demandas_afectadas", "demandas_afectadas", "affected_demands", { dec: 0 })].concat(
          CLS.map(function (c) { return K("sv_" + c, "dl_" + c, "dl_" + c, { u: "Gbit/s", dec: 2 }); }))));
      SER.pasos.forEach(function (p, i) {
        var r = p.resumen || {}, v = { paso: i, hora: p.etiqueta || (pad(Math.floor(p.t_min / 60)) + ":" + pad(p.t_min % 60)), dl_total_gbps: r.dl_total_gbps, servido_pct: r.servido_pct,
          ocup_max_pct: r.ocup_max_pct, ocup_max_id: r.ocup_max_id || "", n_alarmas: r.n_alarmas, demandas_afectadas: r.demandas_afectadas };
        CLS.forEach(function (c) { var x = r.por_servicio && r.por_servicio[c]; v["sv_" + c] = esNum(x) ? x : x && esNum(x.dl_gbps) ? x.dl_gbps : null; });
        anadir(tsk, null, v, { dep: depSer, clave: "t" + i });
      });
      var tse = poner(nuevaTabla("serie_enlaces", { es: "Serie temporal · enlaces", en: "Time series · links" },
        { es: "Formato largo: un enlace y un paso por fila.", en: "Long format: one link and one step per row." },
        [K("paso", "paso", "step", { dec: 0 }), C("hora", "hora", "time"), C("enlace", "enlace", "link", { rol: "id" }), C("capa", "capa", "layer"),
          K("carga_gbps", "carga", "load", { u: "Gbit/s", dec: 2 }), K("ocupacion_pct", "ocupacion", "occupancy", { u: "pct", dec: 1 })]));
      tse.larga = true;
      (RED.enlaces || []).forEach(function (e) {
        var x = SER.enlaces && SER.enlaces[e.id], capa = CP.enlace(e);
        if (!x || !capaOk(capa)) return;
        SER.pasos.forEach(function (p, i) {
          anadir(tse, null, { paso: i, hora: p.etiqueta || (pad(Math.floor(p.t_min / 60)) + ":" + pad(p.t_min % 60)), enlace: e.id, capa: capa,
            carga_gbps: x.carga ? x.carga[i] : null, ocupacion_pct: x.ocup ? x.ocup[i] : null }, { dep: [], clave: e.id + "@" + i });
        });
      });
    }

    // ---- sucesos y eventos (Revisión 7, operador.js). Solo si hay filas.
    function hhmmX(m) { m = Math.round(m || 0); return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
    if (quiere.sucesos && Array.isArray(ctx.sucesos) && ctx.sucesos.length) {
      var tsu = poner(nuevaTabla("sucesos", { es: "Sucesos", en: "Events log" },
        { es: "Registro tipo SCADA de la película de 24 h: eventos aplicados, acciones del operador y alarmas que entran o salen.", en: "SCADA-style log of the 24 h run: applied events, operator actions and alarms raised or cleared." },
        [C("hora", "hora", "time", { rol: "id" }), K("t_min", "minuto", "minute", { dec: 0 }), K("nivel", "nivel", "level"), C("origen", "origen", "origin"),
          K("texto", "texto", "text", { ancho: "largo" }), C("elemento", "elemento", "element")]));
      ctx.sucesos.forEach(function (s, i) {
        anadir(tsu, null, { hora: hhmmX(s.t_min), t_min: s.t_min, nivel: s.nivel || "", origen: s.origen || "", texto: tr(s.texto, lang), elemento: s.id || "" }, { dep: arr(s.depende), clave: "s" + i });
      });
    }
    if (quiere.eventos && Array.isArray(ctx.eventos) && ctx.eventos.length) {
      var tev = poner(nuevaTabla("eventos", { es: "Eventos del caso", en: "Case events" },
        { es: "Eventos y acciones del operador del caso LAB (entrada de Motor.serie).", en: "Events and operator actions of the LAB case (Motor.serie input)." },
        [C("hora", "hora", "time", { rol: "id" }), C("t_min", "minuto", "minute", { tipo: "num", dec: 0 }), C("tipo", "tipo", "type"), C("elemento", "elemento", "element"),
          C("parametros", "parametros", "parameters", { ancho: "largo" })]));
      ctx.eventos.forEach(function (e, i) {
        anadir(tev, null, { hora: hhmmX(e.t_min), t_min: e.t_min, tipo: e.tipo || "", elemento: e.id || "", parametros: e.params ? JSON.stringify(e.params) : "" }, { dep: arr(e.supuesto), clave: "e" + i });
      });
    }

    // ---- Revisión 9 (ESTUDIOS, vista_planificacion.js / estudios.js): planificación, SLA, disponibilidad y comparación. Solo si hay filas.
    estudiosTablas(ctx, quiere, lang).forEach(poner);

    // ---- filtros finales: solo filas con supuestos
    if (sel.solo) tablas.forEach(function (t) { t.filas = t.filas.filter(tieneSup); });

    // ---- linaje (Revisión 6): valores → fórmulas → fuentes. Sin columnas de procedencia: la tabla ES la procedencia.
    if (quiere.linaje && ctx.LINAJE && Array.isArray(ctx.LINAJE.valores)) linajeTablas(ctx.LINAJE, lang).forEach(poner);

    // ---- registro de supuestos y a qué filas afecta
    var reg = registroDe(ctx);
    var afecta = {};   // S-id -> {tabla: [claves]}
    tablas.forEach(function (t) {
      t.filas.forEach(function (f) {
        union(f.sup, f.dep).forEach(function (s) {
          var a = afecta[s] = afecta[s] || {};
          (a[t.id] = a[t.id] || []).push(String(f.clave));
        });
      });
    });
    var nDep = {};
    Object.keys(R.enlaces || {}).forEach(function (k) { arr(R.enlaces[k].depende).forEach(function (s) { nDep[s] = (nDep[s] || 0) + 1; }); });
    (R.demandas || []).forEach(function (d) { arr(d.depende).forEach(function (s) { nDep[s] = (nDep[s] || 0) + 1; }); });
    var provisional = !reg;
    var registro = reg ? reg.map(function (s) {
      return { id: s.id, ambito: s.ambito || "", elementos: arr(s.elementos), campo: s.campo || "", valor: s.valor, unidad: s.unidad || "", motivo: s.motivo || "",
        fuente_parcial: s.fuente_parcial || "", alternativa: s.alternativa || "", estado: s.estado || "", n_dependen: hayDepende ? (nDep[s.id] || 0) : null,
        usado: arr((R.resumen || {}).supuestos_usados).indexOf(s.id) >= 0, afecta: afecta[s.id] || {} };
    }) : registroProvisional(ctx, lang);
    if (quiere.supuestos) {
      var tsu = poner(nuevaTabla("supuestos", { es: "Registro de supuestos", en: "Assumption register" },
        provisional ? { es: "Registro provisional: DATOS aún no ha publicado RED.supuestos; se listan los elementos marcados como supuesto, sin S-id.", en: "Provisional register: DATOS has not published RED.supuestos yet; elements flagged as assumptions are listed, without S-id." } : null, [
          C("id", "id", "id", { rol: "id" }), C("ambito", "ambito", "scope"), C("elementos", "elementos", "elements", { tipo: "lista", ancho: "medio" }), C("campo", "campo", "field"),
          C("valor", "valor", "value"), C("unidad", "unidad", "unit"), C("motivo", "motivo", "reason", { ancho: "largo" }), C("fuente_parcial", "fuente_parcial", "partial_source", { ancho: "largo" }),
          C("alternativa", "alternativa", "alternative", { ancho: "medio" }), C("estado", "estado", "status"), C("n_dependen", "n_resultados_que_dependen", "n_dependent_results", { dec: 0 })
        ]));
      registro.forEach(function (s) {
        if (sel.solo === "usados" && !s.usado) return;
        var f = { v: { id: s.id, ambito: s.ambito, elementos: s.elementos, campo: s.campo, valor: esNum(s.valor) ? s.valor : texto(s.valor, lang), unidad: s.unidad, motivo: s.motivo,
          fuente_parcial: s.fuente_parcial, alternativa: s.alternativa, estado: s.estado, n_dependen: s.n_dependen }, c: {}, cuenta: {}, sup: [], dep: [], det: true, hayDato: false, clave: s.id, registro: true };
        tsu.filas.push(f);
      });
    }

    // ---- valores detallados (tabla larga)
    if (quiere.valores_detallados) {
      var tv = poner(nuevaTabla("valores_detallados", { es: "Valores detallados", en: "Detailed values" }, { es: "Un valor por fila: de qué elemento, qué campo, su tipo de procedencia, fuente y supuesto.", en: "One value per row: element, field, provenance type, source and assumption." }, [
        C("elemento", "elemento", "element", { rol: "id" }), C("clase", "clase", "class"), C("campo", "campo", "field"), C("valor", "valor", "value", { tipo: "mixto" }), C("unidad", "unidad", "unit"),
        C("tipo", "tipo", "type"), C("fuente", "fuente", "source", { ancho: "largo" }), C("supuesto", "supuesto", "assumption"), C("depende_de", "depende_de", "depends_on")
      ]));
      tv.larga = true;
      valoresDetallados(tv, ctx, { capaOk: capaOk, svOk: svOk, CP: CP, depDe: depDe, lang: lang, claseSv: claseSv, solo: sel.solo });
    }

    // ---- Δ frente a REF: columna tras cada columna calculada marcada
    if (R0) tablas.forEach(function (t) {
      var nuevas = [];
      t.cols.forEach(function (c) {
        nuevas.push(c);
        if (c.delta) nuevas.push({ k: c.k + "__d", n: { es: "delta_" + c.n.es, en: "delta_" + c.n.en }, u: c.u === "pct" ? "pp" : c.u, dec: c.dec, tipo: "num", rol: "calc", esDelta: true });
      });
      if (nuevas.length === t.cols.length) return;
      t.cols = nuevas;
      t.filas.forEach(function (f) {
        t.cols.forEach(function (c) {
          if (!c.esDelta) return;
          var base = c.k.slice(0, -3), v = f.v[base], r = f.ref ? f.ref[base] : null;
          f.v[c.k] = esNum(v) && esNum(r) ? v - r : null;
          f.c[c.k] = { t: f.v[c.k] == null ? "" : "calculado", s: [] };
        });
      });
    });

    var meta = metaDe(ctx, sel, lang, { hayDepende: hayDepende, provisional: provisional, nReg: registro.length });
    return { meta: meta, tablas: tablas, registro: registro, lang: lang };
  }
  X.construir = construir;

  // ======================================================================== linaje (CONTRATO_UI Revisión 6; datos de linaje_datos.js)
  var EST_LIN = { trazado: { es: "trazado", en: "traced" }, hueco: { es: "hueco", en: "gap" }, discrepa: { es: "discrepa", en: "mismatch" } };
  function linajeUsos(L) {
    var uf = {}, ufx = {}, ufxF = {};
    (L.fuentes || []).forEach(function (f) { uf[f.id] = 0; ufxF[f.id] = 0; });
    (L.formulas || []).forEach(function (f) { ufx[f.id] = 0; (f.refs || []).forEach(function (r) { if (r in ufxF) ufxF[r]++; }); });
    L.valores.forEach(function (v) { if (v.fuente && v.fuente.id in uf) uf[v.fuente.id]++; if (v.formula && v.formula in ufx) ufx[v.formula]++; });
    return { fuente: uf, formula: ufx, fuenteFx: ufxF };
  }
  function linajeTablas(L, lang) {
    var U = linajeUsos(L), out = [];
    function tabla(id, n, desc, cols) { var t = nuevaTabla(id, n, desc, cols); t.sinProc = true; out.push(t); return t; }
    function fila(t, v, clave) { t.filas.push({ v: v, c: {}, cuenta: {}, sup: [], dep: [], det: true, hayDato: false, clave: clave }); }
    var tv = tabla("linaje_valores", { es: "Linaje · valores", en: "Lineage · values" },
      { es: "Un valor por fila: estado (trazado/hueco/discrepa), fórmula y entradas (V-ids), fuente directa, supuesto que corta la cadena y comparación con la memoria v7 o el simulador.",
        en: "One value per row: status (traced/gap/mismatch), formula and inputs (V-ids), direct source, assumption that breaks the chain and comparison with the v7 report or the simulator." },
      [C("id", "id", "id", { rol: "id" }), C("elemento", "elemento", "element"), C("campo", "campo", "field"), C("ambito", "ambito", "scope"),
        C("valor", "valor", "value", { tipo: "mixto" }), C("unidad", "unidad", "unit"), C("tipo", "tipo", "type"), C("estado", "estado", "status"),
        C("formula", "formula", "formula"), C("entradas", "entradas", "inputs", { ancho: "medio" }), C("fuente", "fuente", "source"), C("localizador", "localizador", "locator", { ancho: "medio" }),
        C("id_supuesto", "id_supuesto", "assumption_id"), C("memoria", "memoria_v7", "v7_report"), C("ref_valor", "valor_referencia", "reference_value", { tipo: "mixto" }),
        C("ref_donde", "referencia_en", "reference_in", { ancho: "medio" }), C("dif", "diferencia", "difference", { u: "pct", dec: 4 }),
        C("huecos_raiz", "se_corta_en", "breaks_at", { ancho: "medio" }), C("alias", "alias", "aliases"), C("nota", "nota", "note", { ancho: "largo" })]);
    L.valores.forEach(function (v) {
      var r = v.ref || null, d = r && esNum(r.valor) && esNum(v.valor) ? (esNum(v.dif_rel) ? v.dif_rel * 100 : (r.valor ? (v.valor - r.valor) / Math.abs(r.valor) * 100 : null)) : null;
      fila(tv, { id: v.id, elemento: v.elemento || "", campo: v.campo || "", ambito: v.ambito || "", valor: v.valor, unidad: v.unidad && v.unidad !== "—" ? v.unidad : "",
        tipo: v.tipo || "", estado: tr(EST_LIN[v.estado] || v.estado, lang), formula: v.formula || "", entradas: (v.entradas || []).join(" "),
        fuente: v.fuente ? v.fuente.id : "", localizador: v.fuente ? v.fuente.localizador || "" : "", id_supuesto: v.supuesto || "", memoria: v.memoria || "",
        ref_valor: r ? r.valor : null, ref_donde: r ? (r.donde || "") + (r.localizador ? ": " + r.localizador : "") : "", dif: d,
        huecos_raiz: (v.huecos_raiz || []).join(" "), alias: (v.tambien || []).join(" "), nota: v.nota || "" }, v.id);
    });
    var tf = tabla("linaje_formulas", { es: "Linaje · fórmulas", en: "Lineage · formulas" },
      { es: "Fórmulas usadas en las deducciones, con variables y unidades, justificación y fuentes que la respaldan.", en: "Formulas used in the derivations, with variables and units, justification and supporting sources." },
      [C("id", "id", "id", { rol: "id" }), C("nombre", "nombre", "name", { ancho: "medio" }), C("expresion", "expresion", "expression", { ancho: "medio" }),
        C("variables", "variables", "variables", { ancho: "largo" }), C("justificacion", "justificacion", "justification", { ancho: "largo" }), C("refs", "fuentes", "sources"),
        C("n", "n_valores", "n_values", { dec: 0 })]);
    (L.formulas || []).forEach(function (f) {
      var vars = Object.keys(f.variables || {}).map(function (k) { var x = f.variables[k] || {}; return k + ": " + (x.desc || "") + (x.unidad ? " [" + x.unidad + "]" : ""); }).join(" | ");
      fila(tf, { id: f.id, nombre: f.nombre || "", expresion: f.expr || "", variables: vars, justificacion: f.justificacion || "", refs: (f.refs || []).join(" "), n: U.formula[f.id] || 0 }, f.id);
    });
    var tfu = tabla("linaje_fuentes", { es: "Linaje · fuentes", en: "Lineage · sources" },
      { es: "Fuentes externas (INE, CNMC…), normas, fabricantes, material de clase (ruta del apunte en el vault), documentos del grupo y nuestra memoria.", en: "External sources (INE, CNMC…), standards, vendors, class material (vault note path), team documents and our report." },
      [C("id", "id", "id", { rol: "id" }), C("tipo", "tipo", "type"), C("titulo", "titulo", "title", { ancho: "largo" }), C("editor", "editor", "publisher"), C("fecha", "fecha", "date"),
        C("localizador", "localizador", "locator", { ancho: "largo" }), C("url", "url", "url", { ancho: "medio" }), C("verificada", "verificada", "verified"),
        C("n_valores", "n_valores_directos", "n_direct_values", { dec: 0 }), C("n_formulas", "n_formulas", "n_formulas", { dec: 0 }), C("nota", "nota", "note", { ancho: "largo" })]);
    (L.fuentes || []).forEach(function (f) {
      fila(tfu, { id: f.id, tipo: f.tipo || "", titulo: f.titulo || "", editor: f.editor || "", fecha: f.fecha || "", localizador: f.localizador || "", url: f.url || "",
        verificada: !!f.verificada, n_valores: U.fuente[f.id] || 0, n_formulas: U.fuenteFx[f.id] || 0, nota: f.nota || "" }, f.id);
    });
    if (Array.isArray(L.supuestos) && L.supuestos.length) {
      var bl = {}; ((L.cobertura || {}).raices_hueco || []).forEach(function (r) { if (r.supuesto) bl[r.supuesto] = (bl[r.supuesto] || 0) + (r.bloquea || 0); });
      var ts = tabla("linaje_supuestos", { es: "Linaje · supuestos que cortan cadenas", en: "Lineage · assumptions that break chains" },
        { es: "Supuestos S-L del linaje (los S-0xx están en supuestos.csv): qué falta y qué fuente lo cerraría.", en: "Lineage S-L assumptions (S-0xx are in supuestos.csv): what is missing and which source would close it." },
        [C("id", "id", "id", { rol: "id" }), C("texto", "texto", "text", { ancho: "largo" }), C("motivo", "motivo", "reason", { ancho: "largo" }),
          C("fuente_propuesta", "fuente_propuesta", "proposed_source", { ancho: "largo" }), C("bloquea", "valores_memoria_bloqueados", "report_values_blocked", { dec: 0 })]);
      L.supuestos.forEach(function (s) { fila(ts, { id: s.id, texto: s.texto || "", motivo: s.motivo || "", fuente_propuesta: s.fuente_propuesta || "", bloquea: bl[s.id] || 0 }, s.id); });
    }
    return out;
  }
  // Resumen de trazabilidad para el informe (cobertura, huecos, discrepancias, fuentes)
  function linajeInforme(L, lang) {
    if (!L || !Array.isArray(L.valores)) return null;
    var c = L.cobertura || {}, V = {}, S = {}, U = linajeUsos(L);
    L.valores.forEach(function (v) { V[v.id] = v; });
    (L.supuestos || []).forEach(function (s) { S[s.id] = s; });
    var amb = c.por_ambito || {};
    return {
      generado: L.generado || "", alcance: c.alcance || "",
      total: { total: c.total, trazado: c.trazado, hueco: c.hueco, discrepa: c.discrepa, pct_trazado: c.pct_trazado, pct_hueco: c.pct_hueco },
      todos: c.todos || null,
      ambitos: Object.keys(amb).map(function (k) { var a = amb[k]; return { id: k, total: a.total, trazado: a.trazado, hueco: a.hueco, discrepa: a.discrepa, pct_trazado: a.pct_trazado }; })
        .sort(function (a, b) { return b.total - a.total; }),
      huecos: (c.raices_hueco || []).map(function (r) {
        var v = V[r.id] || {}, s = S[r.supuesto] || {};
        return { id: r.id, bloquea: r.bloquea, supuesto: r.supuesto || "", texto: s.texto || v.nota || "", propuesta: s.fuente_propuesta || "",
          valor: Array.isArray(v.valor) ? v.valor.length + " val." : numInf(v.valor, null, lang), unidad: v.unidad && v.unidad !== "—" ? v.unidad : "" };
      }),
      discrepa: L.valores.filter(function (v) { return v.estado === "discrepa"; }).map(function (v) {
        var r = v.ref || {};
        return { id: v.id, elemento: v.elemento || "", campo: v.campo || "", memoria: numInf(r.valor, null, lang), recalculado: numInf(v.valor, null, lang),
          dif_pct: esNum(v.dif_rel) ? numInf(v.dif_rel * 100, 2, lang) : "", donde: (r.donde || "") + (r.localizador ? ": " + r.localizador : "") || v.memoria || "" };
      }),
      con_ref: L.valores.filter(function (v) { return v.ref; }).length,
      fuentes: (L.fuentes || []).map(function (f) {
        return { id: f.id, tipo: f.tipo || "", titulo: f.titulo || "", editor: f.editor || "", localizador: f.localizador || "", url: f.url || "", verificada: !!f.verificada,
          n_valores: U.fuente[f.id] || 0, n_formulas: U.fuenteFx[f.id] || 0 };
      }),
      n_formulas: (L.formulas || []).length, n_valores: L.valores.length
    };
  }
  X.linajeTablas = linajeTablas; X.linajeInforme = linajeInforme;

  // proc uniforme para un elemento sin proc (todas las celdas del mismo tipo)
  function uniforme(o, t) {
    var p = { t: tipoElemento(o) || t, f: (o && (o.fuente_e2 || fuenteTxt(o.fuente))) || "", s: [], det: false };
    var h = {}; ["frecuencia", "duplex", "ancho", "scs_khz", "sector_dl_mbps", "sector_ul_mbps", "pire_dbm", "latencia_p95_ms"].forEach(function (k) { h[k] = p; });
    return h;
  }

  // Registro provisional (sin RED.supuestos): elementos marcados como supuesto
  function registroProvisional(ctx, lang) {
    var out = [], R = ctx.RED || {};
    function add(amb, o, motivo, fuente) {
      out.push({ id: "", ambito: amb, elementos: [o.id], campo: tr({ es: "(elemento)", en: "(element)" }, lang), valor: "", unidad: "", motivo: motivo || "",
        fuente_parcial: fuente || "", alternativa: "", estado: tr({ es: "pendiente de registro (DATOS)", en: "pending register (DATOS)" }, lang), n_dependen: null, afecta: {} });
    }
    function m(o) { return typeof o.supuesto === "string" ? o.supuesto : (o.nota || ""); }
    (R.nodos || []).forEach(function (o) { if (contieneSup(o)) add("red/nodos", o, m(o), o.fuente_e2 || fuenteTxt(o.fuente)); });
    (R.enlaces || []).forEach(function (o) { if (contieneSup(o)) add("red/enlaces", o, m(o), o.fuente_e2 || fuenteTxt(o.fuente)); });
    (R.zonas || []).forEach(function (o) { if (contieneSup(o)) add("demanda/zonas", o, m(o), o.fuente_e2 || fuenteTxt(o.fuente)); });
    (R.servicios || []).forEach(function (o) { if (contieneSup(o)) add("demanda/servicios", o, m(o), fuenteTxt(o.fuente)); });
    ((ctx.RADIO || {}).areas || []).forEach(function (o) { if (o.origen === "supuesto") add("radio", o, typeof o.supuesto === "string" ? o.supuesto : "", fuenteTxt(o.fuente)); });
    var A = ctx.ARQ || {};
    (A.interfaces || []).concat(A.flujos || []).forEach(function (o) { if (o.inferido) add("arquitectura", o, o.nota || o.descripcion || "", fuenteTxt(o.fuente)); });
    return out;
  }

  // Tabla larga
  var UNID = { capacidad_gbps: "Gbps", dl_gbps: "Gbps", ul_gbps: "Gbps", latencia_ms: "ms", latencia_max_ms: "ms", km: "km", coord: "lat, lon",
    poblacion: "hab", poblacion_2025: "hab", hogares: "hogares", hogares_2025: "hogares", empresas_2025: "empresas", abonados_fijos: "abonados", abonados_moviles: "abonados",
    lineas_datos_moviles: "líneas", capacidad_acceso_gbps: "Gbps", radio_m: "m", radio_ul_km: "km", radio_dl_km: "km", area_km2: "km2",
    carga_gbps: "Gbps", carga_ab: "Gbps", carga_ba: "Gbps", ocupacion: "pct", servida_gbps: "Gbps", pct: "pct" };
  var CAMPOS_DEF = {
    nodo: ["capacidad_gbps", "latencia_ms", "coord", "respaldo", "modelo", "area"],
    enlace: ["a", "b", "capacidad_gbps", "km", "srlg", "proteccion"],
    zona: ["poblacion", "poblacion_2025", "hogares", "hogares_2025", "hogar_medio", "empresas_2025", "abonados_fijos", "abonados_moviles", "lineas_datos_moviles"],
    servicio: ["dl_gbps", "ul_gbps", "prioridad", "destino", "latencia_max_ms", "capacidad_acceso_gbps"],
    radio: ["radio_m", "radio_ul_km", "radio_dl_km", "sitios", "sectores_n78", "capacidad_gbps", "latencia_ms", "area_km2"]
  };
  function valoresDetallados(tv, ctx, h) {
    var R = ctx.RED || {}, RS = ctx.resultado || {}, lang = h.lang;
    var hayProc = false;
    function fila(clase, o, campo, valor, p, dep) {
      if (valor == null || valor === "" || (Array.isArray(valor) && !valor.length)) return;
      if (typeof valor === "object" && !Array.isArray(valor)) valor = JSON.stringify(valor);
      var v = { elemento: o.id, clase: clase, campo: campo, valor: valor, unidad: UNID[campo] || "", tipo: p.t || tr(TX.sinEsp, lang),
        fuente: p.f || "", supuesto: (p.s || []).join(" "), depende_de: (dep || []).join(" ") };
      var f = { v: v, c: { valor: { t: p.t, s: p.s || [] } }, cuenta: {}, sup: p.s || [], dep: dep || [], det: p.det, hayDato: p.t !== "calculado",
        flagEl: !p.det && contieneSup(o) && p.t !== "calculado", tipoEl: p.det ? "" : p.t, clave: o.id + "." + campo };
      if (h.solo && !tieneSup(f)) return;
      tv.filas.push(f);
    }
    function campos(o, clase) { if (o.proc && typeof o.proc.t !== "string") { hayProc = true; return Object.keys(o.proc); } return CAMPOS_DEF[clase]; }
    function valorDe(o, k) { return k.indexOf("/") > 0 ? k.split("/").map(function (x) { return o[x]; }).join(" / ") : o[k]; }
    function emitir(clase, o) {
      campos(o, clase).forEach(function (k) { fila(clase, o, k, valorDe(o, k), procCampo(o, k)); });
    }
    var calcP = function () { return { t: "calculado", f: tr({ es: "motor (este caso)", en: "engine (this case)" }, lang), s: [], det: true }; };
    (R.nodos || []).forEach(function (n) {
      if (!h.capaOk(h.CP.nodo(n))) return;
      emitir("nodo", n);
      var r = (RS.nodos || {})[n.id];
      if (r) fila("nodo", n, "carga_gbps", r.carga_gbps, calcP(), h.depDe(r));
    });
    (R.enlaces || []).forEach(function (e) {
      if (!h.capaOk(h.CP.enlace(e))) return;
      emitir("enlace", e);
      var r = (RS.enlaces || {})[e.id];
      if (r) {
        var dep = h.depDe(r);
        fila("enlace", e, "carga_ab", r.carga_ab, calcP(), dep);
        fila("enlace", e, "carga_ba", r.carga_ba, calcP(), dep);
        var o = ocOfrecida(r);
        if (o != null) fila("enlace", e, "ocupacion", o * 100, calcP(), dep);
      }
    });
    if (h.capaOk("B")) (R.zonas || []).forEach(function (z) {
      emitir("zona", z);
      var r = (RS.zonas || {})[z.id];
      if (r) {
        var dep = []; (RS.demandas || []).forEach(function (d) { if (d.zona === z.id && d.depende) dep = union(dep, d.depende); });
        fila("zona", z, "dl_gbps", r.dl_gbps, calcP(), dep);
        fila("zona", z, "servida_gbps", r.servida_gbps, calcP(), dep);
      }
    });
    (R.servicios || []).forEach(function (s) {
      if (!h.svOk(h.claseSv(s)) || !h.capaOk(h.CP.nodo(h.CP.N[s.nodo]))) return;
      emitir("servicio", s);
    });
    if (ctx.RADIO && h.capaOk("A")) (ctx.RADIO.areas || []).forEach(function (a) {
      if (a.proc) { emitir("radio", a); return; }
      CAMPOS_DEF.radio.forEach(function (k) {
        var t = tipoNorm(k === "sitios" ? (a.origen_sitios || a.origen) : a.origen) || "supuesto";
        fila("radio", a, k, a[k], { t: t, f: fuenteTxt(a.fuente), s: [], det: false });
      });
    });
    tv.porCampo = hayProc;
  }

  // ======================================================================== metadatos del caso
  function metaDe(ctx, sel, lang, extra) {
    var R = ctx.RED || {}, rm = R.meta || {}, d = ctx.fecha ? new Date(ctx.fecha) : new Date();
    var caso = ctx.caso || {};
    var res = (ctx.resultado || {}).resumen || {};
    var filtros = [];
    if (sel.capas && ctx.capas) { var off = Object.keys(ctx.capas).filter(function (k) { return ctx.capas[k] === false; }); filtros.push(tr({ es: "capas", en: "layers" }, lang) + ": " + (off.length ? Object.keys(ctx.capas).filter(function (k) { return ctx.capas[k] !== false; }).join(" ") : tr({ es: "todas", en: "all" }, lang))); }
    if (sel.servicios && ctx.servicios) { var on = Object.keys(ctx.servicios).filter(function (k) { return ctx.servicios[k] !== false; }); filtros.push(tr({ es: "servicios", en: "services" }, lang) + ": " + (on.length === Object.keys(ctx.servicios).length ? tr({ es: "todos", en: "all" }, lang) : on.join(" "))); }
    if (sel.solo) filtros.push(tr({ es: "solo filas con supuestos", en: "rows with assumptions only" }, lang));
    if (ctx.modo === "lab" && sel.delta && ctx.referencia) filtros.push(tr({ es: "con Δ frente a REF", en: "with Δ vs REF" }, lang));
    var escP = [];
    var oc = (ctx.opciones || {}).caso || {}, trf = typeof oc.trafico === "object" && oc.trafico ? oc.trafico.id : oc.trafico;
    (R.escenarios || []).forEach(function (e) {
      if ((e.id === trf || e.id === oc.evento || e.id === caso.trafico || e.id === caso.evento) && e.proc && e.proc.definicion) {
        var pd = e.proc.definicion; escP.push(e.id + ": " + (tipoNorm(pd.t) || pd.t) + (sIds(pd.s).length ? " " + sIds(pd.s).join(" ") : "") + " · " + (pd.f || ""));
      }
    });
    return {
      escenario_proc: escP.join(" | "),
      proyecto: "RED-MAD 2031",
      modo: ctx.modo === "lab" ? "LAB" : "REF",
      modo_largo: ctx.modo === "lab" ? tr({ es: "Laboratorio", en: "Laboratory" }, lang) : tr({ es: "Referencia · Entrega 2 (v7)", en: "Reference · Deliverable 2 (v7)" }, lang),
      caso: caso.texto || "",
      caso_detalle: caso,
      opciones: ctx.opciones ? JSON.stringify(ctx.opciones) : "",
      fecha: fechaTxt(d), fecha_archivo: fechaArchivo(d),
      datos: "v7 · red.js " + (rm.version || rm.fecha || "") + (rm.referencia && rm.referencia.doc ? " · " + String(rm.referencia.doc).split("/").pop() : ""),
      ref_doc: rm.referencia && rm.referencia.doc ? String(rm.referencia.doc) : "",
      filtros: filtros.join(" · ") || tr({ es: "sin filtros", en: "no filters" }, lang),
      resumen: { dl_total_gbps: res.dl_total_gbps, servida_gbps: res.servida_gbps, pct_servida: res.pct_servida, demandas: ((ctx.resultado || {}).demandas || []).length,
        demandas_afectadas: res.demandas_afectadas, max_ocupacion: res.max_ocupacion, enlace_max: res.enlace_max, supuestos_usados: arr(res.supuestos_usados).length || null },
      resumen_ref: ctx.referencia && ctx.modo === "lab" ? (function (s) { return { dl_total_gbps: s.dl_total_gbps, pct_servida: s.pct_servida, demandas_afectadas: s.demandas_afectadas, max_ocupacion: s.max_ocupacion }; })(ctx.referencia.resumen || {}) : null,
      hay_depende: extra.hayDepende, registro_provisional: extra.provisional, n_registro: extra.nReg,
      lang: lang
    };
  }

  // ======================================================================== CSV
  function nombreCol(c, lang) { return c.n[lang] + (c.u ? "_" + c.u : ""); }
  X.nombreCol = nombreCol;
  function colsCSV(t, lang) {
    var cols = t.cols.slice();
    if (!t.larga && !t.sinProc && t.id !== "supuestos") {
      cols.push({ k: "__proc", n: { es: "procedencia", en: "provenance" }, tipo: "txt" });
      cols.push({ k: "__sup", n: { es: "supuestos", en: "assumptions" }, tipo: "txt" });
      cols.push({ k: "__dep", n: { es: "depende_de", en: "depends_on" }, tipo: "txt" });
    }
    return cols;
  }
  function valorCSV(c, f, lang) {
    if (c.k === "__proc") return resumenProc(f, lang);
    if (c.k === "__sup") return f.sup.join(" ");
    if (c.k === "__dep") return f.dep.join(" ");
    var v = f.v[c.k];
    if (v == null) return "";
    if (c.tipo === "num") return esNum(v) ? numCSV(v, c.dec) : texto(v, lang);
    if (c.tipo === "mixto") return esNum(v) ? numCSV(v, null) : Array.isArray(v) && v.every(esNum) ? v.map(function (x) { return numCSV(x, null); }).join(" / ") : texto(v, lang);
    return texto(v, lang);
  }
  function aCSV(t, lang) {
    lang = lang || "es";
    var cols = colsCSV(t, lang);
    var esTxt = cols.map(function (c) { return c.tipo !== "num"; });
    var lineas = [lineaCSV(cols.map(function (c) { return nombreCol(c, lang); }), null)];
    t.filas.forEach(function (f) {
      lineas.push(lineaCSV(cols.map(function (c) { return valorCSV(c, f, lang); }), cols.map(function (c) {
        return c.tipo === "mixto" ? !esNum(f.v[c.k]) : esTxt[cols.indexOf(c)];
      })));
    });
    return "﻿" + lineas.join("\r\n") + "\r\n";
  }
  X.aCSV = aCSV;

  function casoCSV(m, lang) {
    var L = function (es, en) { return lang === "en" ? en : es; };
    var filas = [[L("clave", "key"), L("valor", "value")],
      [L("proyecto", "project"), m.proyecto], [L("caso", "case"), m.caso], [L("modo", "mode"), m.modo + " · " + m.modo_largo],
      [L("fecha_exportacion", "export_date"), m.fecha], [L("datos", "data"), m.datos], [L("documento_referencia", "reference_document"), m.ref_doc],
      [L("filtros", "filters"), m.filtros], [L("procedencia_escenario", "scenario_provenance"), m.escenario_proc], [L("opciones_motor", "engine_options"), m.opciones],
      [L("dl_total_Gbps", "total_DL_Gbps"), numCSV(m.resumen.dl_total_gbps, 2)], [L("servida_pct", "served_pct"), numCSV(m.resumen.pct_servida, 3)],
      [L("ocupacion_max_pct", "max_occupancy_pct"), numCSV(esNum(m.resumen.max_ocupacion) ? m.resumen.max_ocupacion * 100 : null, 2)],
      [L("enlace_max", "max_link"), m.resumen.enlace_max || ""], [L("demandas", "demands"), numCSV(m.resumen.demandas, 0)],
      [L("demandas_afectadas", "affected_demands"), numCSV(m.resumen.demandas_afectadas, 0)],
      [L("supuestos_usados", "assumptions_used"), m.resumen.supuestos_usados == null ? L("pendiente (motor sin supuestos_usados)", "pending (engine without supuestos_usados)") : String(m.resumen.supuestos_usados)],
      [L("registro_supuestos", "assumption_register"), m.registro_provisional ? L("provisional (sin RED.supuestos)", "provisional (no RED.supuestos)") : String(m.n_registro)]];
    return "﻿" + filas.map(function (r) { return lineaCSV(r, [true, true]); }).join("\r\n") + "\r\n";
  }

  function leeme(m, tablas, lang) {
    var es = lang !== "en";
    var L = [];
    if (es) {
      L.push("RED-MAD 2031 · exportación del simulador (5G + FTTH, Madrid)", "");
      L.push("Caso:   " + m.caso, "Modo:   " + m.modo + " (" + m.modo_largo + ")", "Fecha:  " + m.fecha, "Datos:  " + m.datos, "Filtros: " + m.filtros, "");
      L.push("FORMATO", "- CSV para Excel en castellano: separador ';', coma decimal, sin separador de miles, UTF-8 con BOM, fin de línea CRLF.",
        "- Doble clic abre bien en Excel ES. En LibreOffice: separador ';', juego UTF-8. En pandas: pd.read_csv(f, sep=';', decimal=',', encoding='utf-8-sig').",
        "- La fila 1 de cada CSV es la cabecera (para filtros y tablas dinámicas). Los datos del caso no van como comentarios '#' en cada archivo",
        "  porque Excel los pondría como filas de datos y rompería filtros e importaciones: van aquí y en caso.csv.",
        "- Las unidades van en el nombre de la columna (capacidad_Gbps, latencia_ms, ocupacion_pct). 'pct' = %, 'pp' = puntos porcentuales.",
        "- Textos que empiezan por = + - @ llevan un apóstrofo delante para que Excel no los ejecute como fórmula.", "");
      L.push("CÓMO LEER LA PROCEDENCIA", "Cada dato es de uno de estos tipos:",
        "  v7         dato de la Entrega 2 (memoria conjunta v7).",
        "  anterior   dato de un documento anterior del equipo que la v7 no da.",
        "  supuesto   lo pone el simulador porque ningún documento lo da; tiene un id S-NNN en supuestos.csv.",
        "  calculado  lo calcula el motor o el generador de demanda para este caso.",
        "  usuario    dato del usuario: lo cambia un modelo de demanda propio (CSV importado o editor MODELO, solo LAB); fuente = archivo.",
        "Columnas comunes de cada tabla:",
        "  procedencia  resumen de la fila, p. ej. 'v7 · 1 supuesto · 2 calculados'.",
        "  supuestos    ids S-NNN de los DATOS de la fila que son supuestos (separados por espacio).",
        "  depende_de   ids S-NNN de los que dependen los RESULTADOS calculados de la fila (demandas que pasan por él, su capacidad, reglas del motor).",
        "valores_detallados.csv da lo mismo campo a campo: elemento; clase; campo; valor; unidad; tipo; fuente; supuesto; depende_de.",
        "supuestos.csv es el registro: id; ámbito; elementos; campo; valor; unidad; motivo; fuente_parcial; alternativa; estado; nº de resultados de este caso que dependen.");
      if (m.registro_provisional) L.push("", "AVISO: los datos aún no traen procedencia por campo (proc) ni registro RED.supuestos. La columna procedencia dice",
        "'por elemento (pendiente de detalle)' y supuestos.csv lista los elementos marcados como supuesto, sin S-id.");
      if (!m.hay_depende) L.push("AVISO: el motor aún no publica 'depende'; la columna depende_de va vacía.");
      L.push("", "ARCHIVOS");
      L.push("  caso.csv  caso, modo, fecha, datos, filtros y KPI del resumen.");
    } else {
      L.push("RED-MAD 2031 · simulator export (5G + FTTH, Madrid)", "");
      L.push("Case:   " + m.caso, "Mode:   " + m.modo + " (" + m.modo_largo + ")", "Date:   " + m.fecha, "Data:   " + m.datos, "Filters: " + m.filtros, "");
      L.push("FORMAT", "- CSV for Spanish-locale Excel: ';' separator, decimal comma, no thousands separator, UTF-8 with BOM, CRLF line ends.",
        "- In English-locale Excel use Data > From Text/CSV with ';' and ',' as decimal. pandas: pd.read_csv(f, sep=';', decimal=',', encoding='utf-8-sig').",
        "- Row 1 of each CSV is the header. Case metadata is not written as '#' comment lines (Excel would read them as data): it is here and in caso.csv.",
        "- Units are in the column name (capacity_Gbps, latency_ms, occupancy_pct). 'pct' = %, 'pp' = percentage points.",
        "- Text starting with = + - @ gets a leading apostrophe so Excel does not run it as a formula.", "");
      L.push("HOW TO READ PROVENANCE", "Each value is one of:",
        "  v7          Deliverable 2 data (joint report v7).",
        "  anterior    data from an earlier team document not given in v7.",
        "  supuesto    assumption set by the simulator; has an S-NNN id in supuestos.csv.",
        "  calculado   computed by the engine or the demand generator for this case.",
        "  usuario     user data: changed by an own demand model (imported CSV or MODEL editor, LAB only); source = file name.",
        "Common columns: provenance (row summary), assumptions (S-ids of the row's DATA), depends_on (S-ids the row's computed RESULTS depend on).",
        "valores_detallados.csv gives the same field by field; supuestos.csv is the register.");
      if (m.registro_provisional) L.push("", "NOTE: data has no per-field provenance (proc) nor RED.supuestos yet; provenance says 'per element (field detail pending)'.");
      if (!m.hay_depende) L.push("NOTE: the engine does not publish 'depende' yet; depends_on is empty.");
      L.push("", "FILES", "  caso.csv  case, mode, date, data, filters and summary KPIs.");
    }
    tablas.forEach(function (t) {
      L.push("  " + t.archivo + "  " + tr(t.n, lang) + " · " + t.filas.length + (es ? " filas" : " rows") + (t.desc ? ". " + tr(t.desc, lang) : "") + (t.error ? " [" + t.error + "]" : ""));
    });
    L.push("  LEEME.txt  " + (es ? "este archivo." : "this file."));
    return "﻿" + L.join("\r\n") + "\r\n";
  }

  // Lista de archivos del zip: [{nombre, texto}]
  X.archivos = function (ctx, sel) {
    var r = construir(ctx, sel), lang = r.lang;
    var out = [{ nombre: "LEEME.txt", texto: leeme(r.meta, r.tablas, lang) }, { nombre: "caso.csv", texto: casoCSV(r.meta, lang) }];
    r.tablas.forEach(function (t) { out.push({ nombre: t.archivo, texto: aCSV(t, lang) }); });
    return { archivos: out, meta: r.meta, tablas: r.tablas };
  };
  X.nombreZip = function (m) { return "RED-MAD-2031_" + m.modo + "_" + m.fecha_archivo + ".zip"; };
  X.nombreCSV = function (id, m) {
    var c = m.caso_detalle || {}, s = m.modo === "REF" ? "v7" : slug([c.trafico, c.evento, (c.fallos || []).length ? (c.fallos || []).length + "fallos" : ""].filter(Boolean).join("_"));
    return id + "_" + m.modo + (s ? "_" + s : "") + "_" + m.fecha_archivo + ".csv";
  };

  // ======================================================================== zip sin compresión (reserva si JSZip no carga; y para el test)
  var CRC = null;
  function crc32(b) {
    if (!CRC) { CRC = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; } }
    var x = 0xFFFFFFFF;
    for (var i = 0; i < b.length; i++) x = CRC[(x ^ b[i]) & 0xFF] ^ (x >>> 8);
    return (x ^ 0xFFFFFFFF) >>> 0;
  }
  function utf8(s) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(s);
    return new Uint8Array(Buffer.from(s, "utf8"));
  }
  X.zipStore = function (archivos) {
    var partes = [], central = [], off = 0, d = new Date();
    var dt = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
    var dd = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    archivos.forEach(function (a) {
      var nom = utf8(a.nombre), dat = a.bytes || utf8(a.texto), crc = crc32(dat);
      var cab = [].concat([0x50, 0x4b, 3, 4], u16(20), u16(0x0800), u16(0), u16(dt), u16(dd), u32(crc), u32(dat.length), u32(dat.length), u16(nom.length), u16(0));
      partes.push(new Uint8Array(cab), nom, dat);
      central.push(new Uint8Array([].concat([0x50, 0x4b, 1, 2], u16(20), u16(20), u16(0x0800), u16(0), u16(dt), u16(dd), u32(crc), u32(dat.length), u32(dat.length),
        u16(nom.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), nom);
      off += cab.length + nom.length + dat.length;
    });
    var tamC = central.reduce(function (s, p) { return s + p.length; }, 0);
    var fin = new Uint8Array([].concat([0x50, 0x4b, 5, 6], u16(0), u16(0), u16(archivos.length), u16(archivos.length), u32(tamC), u32(off), u16(0)));
    var todo = partes.concat(central, [fin]), n = todo.reduce(function (s, p) { return s + p.length; }, 0), out = new Uint8Array(n), p = 0;
    todo.forEach(function (x) { out.set(x, p); p += x.length; });
    return out;
  };
  // Nombres de archivo dentro de un zip (lee el directorio central)
  X.zipNombres = function (b) {
    var i = b.length - 22;
    while (i >= 0 && !(b[i] === 0x50 && b[i + 1] === 0x4b && b[i + 2] === 5 && b[i + 3] === 6)) i--;
    if (i < 0) return [];
    var n = b[i + 10] | (b[i + 11] << 8), p = (b[i + 16] | (b[i + 17] << 8) | (b[i + 18] << 16) | (b[i + 19] << 24)) >>> 0, out = [];
    for (var k = 0; k < n; k++) {
      var ln = b[p + 28] | (b[p + 29] << 8), le = b[p + 30] | (b[p + 31] << 8), lc = b[p + 32] | (b[p + 33] << 8);
      out.push(typeof TextDecoder !== "undefined" ? new TextDecoder().decode(b.subarray(p + 46, p + 46 + ln)) : Buffer.from(b.subarray(p + 46, p + 46 + ln)).toString("utf8"));
      p += 46 + ln + le + lc;
    }
    return out;
  };

  // ======================================================================== datos del informe
  // {meta, tablas:[{id, n, desc, ancha, cols:[{k, n, u, rol}], filas:[[{x, t, s}]]}], registro, leyenda}
  X.informe = function (ctx, sel) {
    var r = construir(ctx, sel), lang = r.lang;
    var tablas = r.tablas.map(function (t) {
      var cols = colsCSV(t, lang).map(function (c) {
        var nombre = c.k === "__proc" ? tr({ es: "Procedencia", en: "Provenance" }, lang) : c.k === "__sup" ? tr({ es: "Supuestos", en: "Assumptions" }, lang) :
          c.k === "__dep" ? tr({ es: "Depende de", en: "Depends on" }, lang) : (c.esDelta ? "Δ " + c.n[lang].replace(/^delta_/, "") : c.n[lang]).replace(/_/g, " ");
        var u = c.u === "pct" ? "%" : c.u === "pp" ? "pp" : c.u;
        return { k: c.k, n: nombre.charAt(0).toUpperCase() + nombre.slice(1), u: u || "", rol: c.k.indexOf("__") === 0 ? "meta" : c.rol, num: c.tipo === "num", ancho: c.ancho || "" };
      });
      var filas = t.filas.map(function (f) {
        return colsCSV(t, lang).map(function (c) {
          var v = f.v[c.k], x;
          if (c.k === "__proc") x = resumenProc(f, lang);
          else if (c.k === "__sup") x = f.sup.join(" ");
          else if (c.k === "__dep") x = f.dep.join(" ");
          else if ((c.tipo === "num" || c.tipo === "mixto") && esNum(v)) x = (c.esDelta && v > 0 ? "+" : "") + numInf(v, c.tipo === "mixto" ? null : c.dec, lang);
          else if (c.tipo === "mixto" && Array.isArray(v) && v.every(esNum)) x = v.map(function (n) { return numInf(n, null, lang); }).join(" / ");
          else x = texto(v, lang);
          var cel = f.c[c.k] || {};
          return { x: x, t: cel.t || "", s: cel.s || [] };
        });
      });
      return { id: t.id, n: tr(t.n, lang), desc: t.desc ? tr(t.desc, lang) : "", ancha: cols.length > 9, larga: !!t.larga, error: t.error || "", cols: cols, filas: filas };
    });
    var registro = r.registro.map(function (s) {
      return { id: s.id, ambito: s.ambito, elementos: s.elementos, campo: s.campo, valor: esNum(s.valor) ? numInf(s.valor, null, lang) : texto(s.valor, lang), unidad: s.unidad,
        motivo: s.motivo, fuente_parcial: s.fuente_parcial, alternativa: s.alternativa, estado: s.estado, n_dependen: s.n_dependen, usado: !!s.usado, afecta: s.afecta || {} };
    });
    return { version: X.VERSION, meta: r.meta, tablas: tablas, registro: registro, lang: lang, trazabilidad: ctx.LINAJE ? linajeInforme(ctx.LINAJE, lang) : null,
      nombres: CATALOGO.reduce(function (o, c) { o[c.id] = tr(c.n, lang); return o; }, {}) };
  };

  if (typeof module !== "undefined" && module.exports) module.exports = X;
  if (typeof window === "undefined" || !window.document) return;
  window.Exportar = X;

  // ======================================================================== panel (navegador)
  var NOC = window.NOC;
  if (!NOC) return;
  function t(o) { return NOC.t(o); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var CLAVE = "noc.exportar";
  var S = X.SEL_DEFECTO();
  try {
    var g = JSON.parse(localStorage.getItem(CLAVE) || "null");
    if (g && typeof g === "object") {
      Object.keys(S).forEach(function (k) { if (k !== "tablas" && g[k] != null) S[k] = g[k]; });
      if (g.tablas) Object.keys(S.tablas).forEach(function (k) { if (typeof g.tablas[k] === "boolean") S.tablas[k] = g.tablas[k]; });
    }
  } catch (e) { /* sin almacenamiento */ }
  function guardarSel() { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }

  var T = {
    titulo: { es: "Exportar", en: "Export" },
    tablas: { es: "Tablas", en: "Tables" }, filtros: { es: "Filtros", en: "Filters" }, salida: { es: "Salida", en: "Output" },
    todas: { es: "todas", en: "all" }, ninguna: { es: "ninguna", en: "none" },
    lento: { es: "recalcula el caso por cada elemento (~0,3 s)", en: "recomputes the case per element (~0.3 s)" },
    capas: { es: "Solo capas activas del carril", en: "Only layers active in the rail" },
    sv: { es: "Solo servicios activos del carril", en: "Only services active in the rail" },
    solo: { es: "Solo filas con supuestos", en: "Only rows with assumptions" },
    delta: { es: "Incluir Δ frente a REF", en: "Include Δ vs REF" },
    deltaRef: { es: "solo en LABORATORIO", en: "LABORATORY only" },
    zip: { es: "CSV (.zip)", en: "CSV (.zip)" }, una: { es: "CSV de una tabla", en: "Single-table CSV" }, pdf: { es: "Informe PDF", en: "PDF report" },
    formato: { es: "Excel ES: ';' · coma decimal · UTF-8 con BOM. El zip lleva LEEME.txt y caso.csv.", en: "Spanish Excel: ';' · decimal comma · UTF-8 with BOM. The zip includes LEEME.txt and caso.csv." },
    nada: { es: "Marca al menos una tabla.", en: "Tick at least one table." },
    generando: { es: "Generando…", en: "Generating…" },
    bloqueo: { es: "El navegador bloqueó la ventana: permite ventanas emergentes para este sitio.", en: "The browser blocked the window: allow pop-ups for this site." },
    sinProc: { es: "Procedencia por elemento: los datos aún no traen detalle por campo.", en: "Per-element provenance: data has no per-field detail yet." },
    cerrar: { es: "Cerrar (Esc)", en: "Close (Esc)" }
  };
  // ======================================================================== Revisión 9 (ESTUDIOS): tablas de estudios
  // planificacion.csv (+ planificacion_hoja_ruta.csv), sla.csv, disponibilidad.csv, comparacion.csv. Cada una solo si tiene filas.
  function estudiosTablas(ctx, quiere, lang) {
    var out = [], M = ctx.Motor, RED = ctx.RED, op = ctx.opciones || { caso: { trafico: "BH", evento: "E-EVENTO" } };
    function n(x) { return esNum(x) ? x : null; }
    if (quiere.planificacion && M && typeof M.planificacion === "function") {
      var p = null;
      try { p = ctx.planificacion || M.planificacion(RED, op); } catch (e) { p = null; }
      if (p && p.anios && p.anios.length) {
        var sp = arr(p.supuestos);
        var ta = nuevaTabla("planificacion", { es: "Planificación por año", en: "Planning by year" },
          { es: "Motor.planificacion: ocupación máxima por familia y año (" + p.desde + "–" + p.hasta + "); años > 2031 extrapolados.", en: "Motor.planificacion: maximum occupancy per family and year (" + p.desde + "–" + p.hasta + "); years > 2031 extrapolated." },
          [C("anio", "anio", "year", { rol: "id" }), K("dl_total_gbps", "dl_total", "total_dl", { u: "Gbps", dec: 1 }), K("pct_servida_pct", "servida", "served", { u: "pct", dec: 2 }),
            K("enlace_max_pct", "enlace_max", "link_max", { u: "pct", dec: 1 }), C("enlace_max_id", "enlace_max_id", "link_max_id"),
            K("sitio_max_pct", "sitio_max", "site_max", { u: "pct", dec: 1 }), C("sitio_max_id", "sitio_max_id", "site_max_id"),
            K("nucleo_max_pct", "nucleo_max", "core_max", { u: "pct", dec: 1 }), C("nucleo_max_id", "nucleo_max_id", "core_max_id"),
            K("nodo_max_pct", "nodo_max", "node_max", { u: "pct", dec: 1 }), C("nodo_max_id", "nodo_max_id", "node_max_id"),
            K("n_85", "n_85", "n_85", { dec: 0 }), K("n_100", "n_100", "n_100", { dec: 0 }), C("extrapolado", "extrapolado", "extrapolated")]);
        p.anios.forEach(function (a) {
          anadir(ta, null, { anio: a.anio, dl_total_gbps: n(a.dl_total_gbps), pct_servida_pct: n(a.pct_servida), enlace_max_pct: n(a.ocup_max_pct), enlace_max_id: a.ocup_max_id || "",
            sitio_max_pct: n(a.sitio_max_pct), sitio_max_id: a.sitio_max_id || "", nucleo_max_pct: n(a.nucleo_max_pct), nucleo_max_id: a.nucleo_max_id || "",
            nodo_max_pct: n(a.nodo_max_pct), nodo_max_id: a.nodo_max_id || "", n_85: a.n_85, n_100: a.n_100, extrapolado: a.anio > 2031 ? "sí" : "no" }, { dep: sp, clave: "a" + a.anio });
        });
        if (ta.filas.length) out.push(ta);
        if ((p.elementos || []).length) {
          var tel = nuevaTabla("planificacion_elementos", { es: "Qué satura primero", en: "What saturates first" },
            { es: "Elementos que pasan del 85 % en el horizonte: año en que cruzan 85 % y 100 %.", en: "Elements exceeding 85 % within the horizon: year they cross 85 % and 100 %." },
            [C("elemento", "elemento", "element", { rol: "id" }), C("familia", "familia", "family"), C("tipo", "tipo", "type"), K("anio_85", "anio_85", "year_85", { dec: 0 }), K("anio_100", "anio_100", "year_100", { dec: 0 }),
              K("ocup_inicio_pct", "ocup_inicio", "occ_start", { u: "pct", dec: 1 }), K("ocup_fin_pct", "ocup_fin", "occ_end", { u: "pct", dec: 1 }),
              K("capacidad_gbps", "capacidad", "capacity", { u: "Gbps", dec: 1 }), C("nace_saturado", "nace_85", "born_85")]);
          p.elementos.forEach(function (e) {
            anadir(tel, null, { elemento: e.id, familia: e.familia || "", tipo: e.tipo || "", anio_85: n(e.anio_85), anio_100: n(e.anio_100), ocup_inicio_pct: n(e.pct_inicio), ocup_fin_pct: n(e.pct_fin),
              capacidad_gbps: n(e.capacidad_gbps), nace_saturado: e.desde_inicio_85 ? "sí" : "no" }, { dep: sp, clave: "e" + e.familia + e.id });
          });
          out.push(tel);
        }
        if ((p.hoja_ruta || []).length) {
          var th = nuevaTabla("planificacion_hoja_ruta", { es: "Hoja de ruta", en: "Roadmap" },
            { es: "Ampliaciones propuestas por Motor.planificacion (umbral " + (p.umbral_ampliacion || 85) + " %).", en: "Upgrades proposed by Motor.planificacion (threshold " + (p.umbral_ampliacion || 85) + " %)." },
            [C("anio", "anio", "year", { rol: "id" }), C("accion", "accion", "action"), C("elemento", "elemento", "element"), C("familia", "familia", "family"), K("n", "n", "n", { dec: 0 }),
              K("ampliacion_gbps", "ampliacion", "upgrade", { u: "Gbps", dec: 1 }), K("capacidad_antes_gbps", "capacidad_antes", "capacity_before", { u: "Gbps", dec: 1 }),
              K("capacidad_gbps", "capacidad", "capacity", { u: "Gbps", dec: 1 }), K("ocup_antes_pct", "ocup_antes", "occ_before", { u: "pct", dec: 1 }),
              K("ocup_despues_pct", "ocup_despues", "occ_after", { u: "pct", dec: 1 }), C("evento", "evento", "event"), C("aviso", "aviso", "warning", { ancho: "largo" })]);
          p.hoja_ruta.forEach(function (r, i) {
            anadir(th, null, { anio: r.anio, accion: r.accion, elemento: r.id || arr(r.sitios).join(" "), familia: r.familia || "", n: n(r.n) != null ? r.n : n(r.n_sitios),
              ampliacion_gbps: n(r.gbps), capacidad_antes_gbps: n(r.capacidad_antes_gbps), capacidad_gbps: n(r.capacidad_gbps), ocup_antes_pct: n(r.ocup_antes_pct), ocup_despues_pct: n(r.ocup_despues_pct),
              evento: r.evento ? JSON.stringify(r.evento) : "", aviso: r.aviso || r.nota || "" }, { dep: sp, clave: "h" + i });
          });
          out.push(th);
        }
      }
    }
    var R = ctx.resultado;
    if (quiere.sla && R && R.sla && Object.keys(R.sla).length) {
      var ts = nuevaTabla("sla", { es: "SLA por slice", en: "SLA per slice" },
        { es: "resultado.sla: objetivo de latencia (KPI y transporte), P95 de la peor demanda, margen y cumplimiento.", en: "resultado.sla: latency target (KPI and transport), worst-demand P95, margin and compliance." },
        [C("slice", "slice", "slice", { rol: "id" }), C("nombre", "nombre", "name"), C("estado", "estado", "status"), K("objetivo_ms", "objetivo", "target", { u: "ms", dec: 3 }),
          K("objetivo_transporte_ms", "objetivo_transporte", "transport_target", { u: "ms", dec: 3 }), K("p95_peor_ms", "p95_peor", "worst_p95", { u: "ms", dec: 3 }),
          K("margen_ms", "margen", "margin", { u: "ms", dec: 3 }), C("peor_demanda", "peor_demanda", "worst_demand"), K("n", "n", "n", { dec: 0 }), K("n_cumple", "n_cumple", "n_meet", { dec: 0 }),
          K("cumple_pct", "cumple", "meets", { u: "pct", dec: 2 }), K("cumple_gbps_pct", "cumple_gbps", "meets_gbps", { u: "pct", dec: 2 }), K("dl_gbps", "dl", "dl", { u: "Gbps", dec: 2 })]);
      Object.keys(R.sla).forEach(function (k) {
        var s = R.sla[k], pe = s.peor || {};
        anadir(ts, null, { slice: k, nombre: s.nombre || "", estado: s.cumple ? "OK" : "CRIT", objetivo_ms: n(s.objetivo_lat_ms), objetivo_transporte_ms: n(s.objetivo_transporte_ms),
          p95_peor_ms: n(pe.lat_p95_ms), margen_ms: n(pe.margen_ms), peor_demanda: pe.id || "", n: s.n, n_cumple: s.n_cumple, cumple_pct: n(s.cumple_pct), cumple_gbps_pct: n(s.cumple_gbps_pct), dl_gbps: n(s.dl_gbps) },
          { dep: [], clave: k });
      });
      if (ts.filas.length) out.push(ts);
    }
    if (quiere.disponibilidad && M && typeof M.disponibilidad === "function") {
      var d = null;
      try { d = ctx.disponibilidad || M.disponibilidad(RED, op); } catch (e) { d = null; }
      if (d && d.red) {
        var sd = arr(d.supuestos);
        var td = nuevaTabla("disponibilidad", { es: "Disponibilidad", en: "Availability" },
          { es: "Motor.disponibilidad: indisponibilidad (min/año) por ámbito y sucesos de fallo (N-1, SRLG, N-2, común).", en: "Motor.disponibilidad: unavailability (min/year) per scope and failure events (N-1, SRLG, N-2, common)." },
          [C("ambito", "ambito", "scope", { rol: "id" }), C("id", "id", "id"), K("dl_gbps", "dl", "dl", { u: "Gbps", dec: 2 }), K("indisp_min_anio", "indisp_min_anio", "unavail_min_year", { dec: 2 }),
            K("disponibilidad_pct", "disponibilidad", "availability", { u: "pct", dec: 5 }), C("peor_suceso", "peor_suceso", "worst_event"), C("tipo", "tipo", "type"),
            K("peor_min_anio", "peor_min_anio", "worst_min_year", { dec: 2 }), K("dl_perdida_gbps", "dl_perdida", "dl_lost", { u: "Gbps", dec: 2 })]);
        anadir(td, null, { ambito: "red", id: "red", indisp_min_anio: n(d.red.indisp_min_anio), disponibilidad_pct: n(d.red.disponibilidad_pct) }, { dep: sd, clave: "red" });
        ["zonas", "servicios", "slices", "especiales"].forEach(function (g) {
          var o = d[g] || {};
          Object.keys(o).forEach(function (k) {
            var x = o[k], pe = x.peor || {};
            anadir(td, null, { ambito: g, id: k, dl_gbps: n(x.dl_gbps), indisp_min_anio: n(x.indisp_min_anio), disponibilidad_pct: n(x.disponibilidad_pct), peor_suceso: pe.id || "", tipo: pe.tipo || "", peor_min_anio: n(pe.min_anio) },
              { dep: sd, clave: g + ":" + k });
          });
        });
        (d.sucesos || []).forEach(function (s) {
          anadir(td, null, { ambito: "suceso", id: s.id, tipo: s.tipo || "", peor_suceso: arr(s.elementos).join(" "), indisp_min_anio: n(s.contribucion_min_anio), peor_min_anio: n(s.min_anio), dl_perdida_gbps: n(s.dl_perdida_gbps) },
            { dep: sd, clave: "s:" + s.id });
        });
        out.push(td);
      }
    }
    if (quiere.comparacion && M && typeof M.comparar === "function") {
      var cmpR = ctx.comparacion || null;
      if (!cmpR && ctx.referencia && R && ctx.modo === "lab") { try { cmpR = { nombreA: "REF", nombreB: "LAB", c: M.comparar(ctx.referencia, R) }; } catch (e) { cmpR = null; } }
      if (cmpR && cmpR.c) {
        var c = cmpR.c;
        var tc = nuevaTabla("comparacion", { es: "Comparación A/B", en: "A/B comparison" },
          { es: "Motor.comparar: A = " + (cmpR.nombreA || "A") + ", B = " + (cmpR.nombreB || "B") + "; Δ = B − A. Solo elementos que cambian.", en: "Motor.comparar: A = " + (cmpR.nombreA || "A") + ", B = " + (cmpR.nombreB || "B") + "; Δ = B − A. Changed elements only." },
          [C("familia", "familia", "family", { rol: "id" }), C("id", "id", "id"), C("campo", "campo", "field"), K("a", "a", "a", { dec: 4 }), K("b", "b", "b", { dec: 4 }), K("delta", "delta", "delta", { dec: 4 }), C("texto", "texto", "text")]);
        Object.keys(c.kpi || {}).forEach(function (k) { var x = c.kpi[k]; anadir(tc, null, { familia: "kpi", id: k, campo: k, a: n(x.a), b: n(x.b), delta: n(x.d) }, { dep: [], clave: "k" + k }); });
        ["enlaces", "nodos", "demandas", "sla"].forEach(function (g) {
          var o = c[g] || {};
          Object.keys(o).forEach(function (id) {
            var x = o[id];
            if (!x || !x.cambia) return;
            Object.keys(x).forEach(function (campo) {
              var v = x[campo];
              if (!v || typeof v !== "object" || !("a" in v)) return;
              if (esNum(v.d) && Math.abs(v.d) < 1e-9) return;
              if (!esNum(v.d) && !v.cambia) return;
              anadir(tc, null, { familia: g, id: id, campo: campo, a: n(v.a), b: n(v.b), delta: n(v.d), texto: esNum(v.a) ? "" : String(v.a) + " → " + String(v.b) }, { dep: [], clave: g + id + campo });
            });
          });
        });
        if (tc.filas.length >= 1) out.push(tc);
      }
    }
    return out;
  }
  X.estudiosTablas = estudiosTablas;

  var panel = null, ultimoInforme = null;

  function ctxActual(sel) {
    var cap = document.querySelector(".caso-resumen");
    return {
      RED: NOC.RED || window.RED, ARQ: window.ARQ || null, RADIO: window.RADIO || null, Motor: window.Motor, LINAJE: window.LINAJE || null,
      resultado: NOC.resultado, referencia: NOC.referencia, opciones: NOC.opciones, modo: NOC.modo, lang: NOC.lang,
      caso: { texto: (cap ? cap.textContent : "") + (NOC.modo === "lab" && NOC.caso && NOC.caso.modelo_usuario ?   // Revisión 8: modelo del usuario
          " · " + NOC.t({ es: "modelo: ", en: "model: " }) + (NOC.caso.modelo_usuario.nombre || NOC.caso.modelo_usuario.id || "usuario") : ""), trafico: NOC.caso && NOC.caso.trafico, evento: NOC.caso && NOC.caso.evento,
        fallos: NOC.modo === "lab" && NOC.caso ? (NOC.caso.fallos || []).slice() : [], anio: NOC.caso && NOC.caso.anio, dia: NOC.caso && NOC.caso.dia, hora: NOC.caso && NOC.caso.hora },
      alarmas: NOC.alarmas ? NOC.alarmas() : null,
      serie: NOC.reloj && NOC.reloj.serie ? NOC.reloj.serie() : null,
      sucesos: NOC.operador && NOC.operador.sucesos ? NOC.operador.sucesos() : null,
      eventos: NOC.operador && NOC.operador.eventos ? NOC.operador.eventos() : null,
      // Revisión 9 (ESTUDIOS): cálculos ya hechos en las pestañas (si no, estudiosTablas los calcula) y última comparación A/B
      planificacion: NOC.planificacion && NOC.planificacion.plan ? (function () { try { return NOC.planificacion.plan(); } catch (e) { return null; } })() : null,
      comparacion: NOC.estudios && NOC.estudios.comparacion ? NOC.estudios.comparacion : null,
      capas: NOC.capas, servicios: NOC.sv ? NOC.sv.activos : null,
      capaNodo: NOC.capaNodo, capaEnlace: NOC.capaEnlace, fecha: new Date()
    };
  }
  function selFinal(extraTablas) {
    var s = JSON.parse(JSON.stringify(S));
    if (extraTablas) s.tablas = extraTablas;
    s.delta = !!S.delta && NOC.modo === "lab";
    return s;
  }
  function descargar(blob, nombre) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function estado(txt, mal) { var el = panel && panel.querySelector(".exp-estado"); if (el) { el.textContent = txt || ""; el.classList.toggle("mal", !!mal); } }
  function kb(n) { return n < 1024 ? n + " B" : NOC.fmt(n / 1024, n < 10240 ? 1 : 0) + " kB"; }
  function algunaTabla() { return Object.keys(S.tablas).some(function (k) { return S.tablas[k]; }); }

  function hacerZip() {
    if (!algunaTabla()) { estado(t(T.nada), true); return; }
    estado(t(T.generando));
    setTimeout(function () {
      try {
        var r = X.archivos(ctxActual(), selFinal()), nombre = X.nombreZip(r.meta);
        var aviso = r.meta.registro_provisional ? " · " + t(T.sinProc) : "";
        if (window.JSZip) {
          var z = new window.JSZip();
          r.archivos.forEach(function (a) { z.file(a.nombre, a.texto); });
          z.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } }).then(function (b) {
            descargar(b, nombre); estado(nombre + " · " + r.archivos.length + " " + t({ es: "archivos", en: "files" }) + " · " + kb(b.size) + aviso);
          }, function (e) { estado(String(e), true); });
        } else {
          var b = new Blob([X.zipStore(r.archivos)], { type: "application/zip" });
          descargar(b, nombre); estado(nombre + " · " + r.archivos.length + " " + t({ es: "archivos (sin comprimir)", en: "files (uncompressed)" }) + " · " + kb(b.size) + aviso);
        }
      } catch (e) { console.error("Exportar zip", e); estado(String(e && e.message || e), true); }
    }, 20);
  }
  function hacerUna() {
    var id = S.una, tabs = {};
    tabs[id] = true;
    estado(t(T.generando));
    setTimeout(function () {
      try {
        var r = X.archivos(ctxActual(), selFinal(tabs)), tb = r.tablas[0];
        if (!tb) { estado(t({ es: "La tabla queda vacía con estos filtros.", en: "The table is empty with these filters." }), true); return; }
        // "servicios" y "arquitectura"/"radio" dan varias tablas: la primera va como CSV; el resto, en el zip
        var a = r.archivos.filter(function (x) { return x.nombre === tb.archivo; })[0];
        var nombre = X.nombreCSV(tb.id, r.meta);
        var b = new Blob([a.texto], { type: "text/csv;charset=utf-8" });
        descargar(b, nombre);
        estado(nombre + " · " + tb.filas.length + " " + t({ es: "filas", en: "rows" }) + (r.tablas.length > 1 ? " · " + t({ es: "las demás tablas del grupo van en el .zip", en: "the group's other tables are in the .zip" }) : ""));
      } catch (e) { console.error("Exportar CSV", e); estado(String(e && e.message || e), true); }
    }, 20);
  }
  function hacerInforme() {
    if (!algunaTabla()) { estado(t(T.nada), true); return; }
    var w = window.open("informe.html", "_blank");
    if (!w) { estado(t(T.bloqueo), true); return; }
    estado(t(T.generando));
    setTimeout(function () {
      try {
        ultimoInforme = X.informe(ctxActual(), selFinal());
        var txt = JSON.stringify(ultimoInforme), guardado = false;
        try { localStorage.setItem("noc.informe", txt); guardado = true; } catch (e) { try { localStorage.removeItem("noc.informe"); } catch (e2) { /* nada */ } }
        try { w.postMessage({ tipo: "noc-informe", datos: ultimoInforme }, location.origin === "null" ? "*" : location.origin); } catch (e) { /* aún cargando: lo pedirá */ }
        estado(t({ es: "Informe abierto en otra pestaña", en: "Report opened in another tab" }) + " · " + kb(txt.length) + (guardado ? "" : " · postMessage"));
      } catch (e) { console.error("Exportar informe", e); estado(String(e && e.message || e), true); }
    }, 20);
  }
  window.addEventListener("message", function (ev) {
    if (!ev.data || ev.data.tipo !== "noc-informe-pide" || !ultimoInforme) return;
    if (ev.origin !== location.origin && location.origin !== "null") return;
    try { ev.source.postMessage({ tipo: "noc-informe", datos: ultimoInforme }, ev.origin === "null" ? "*" : ev.origin); } catch (e) { /* nada */ }
  });

  function resumenCapas() {
    var c = NOC.capas || {}, on = Object.keys(c).filter(function (k) { return c[k] !== false; });
    return on.length === Object.keys(c).length ? t({ es: "todas", en: "all" }) : on.join(" ") || "—";
  }
  function resumenSv() {
    if (!NOC.sv) return "—";
    var a = NOC.sv.activos, on = Object.keys(a).filter(function (k) { return a[k]; });
    return on.length === Object.keys(a).length ? t({ es: "todos", en: "all" }) : on.length + "/" + Object.keys(a).length + " · " + on.join(" ");
  }
  function sec(id, tit, cuerpo) {
    var pl = NOC.plegado(id);
    return '<section class="exp-sec' + (pl ? " plegado" : "") + '" data-plegable="' + id + '"><button type="button" class="plg exp-sec-cab" data-exp-plegar="' + id + '" aria-expanded="' + !pl + '">' +
      '<span class="ind">' + (pl ? "▸" : "▾") + '</span>' + esc(t(tit)) + '</button><div class="exp-sec-cuerpo">' + cuerpo + '</div></section>';
  }
  function chk(nombre, on, txt, extra, dis) {
    return '<label class="exp-chk' + (dis ? " dis" : "") + '"><input type="checkbox" data-exp="' + nombre + '"' + (on ? " checked" : "") + (dis ? " disabled" : "") + '><span>' + txt + '</span>' + (extra ? '<small>' + extra + '</small>' : '') + '</label>';
  }
  function pintar() {
    if (!panel) return;
    var lab = NOC.modo === "lab";
    var hTab = '<div class="exp-acc"><button type="button" class="btn" data-exp-acc="todas">' + esc(t(T.todas)) + '</button><button type="button" class="btn" data-exp-acc="ninguna">' + esc(t(T.ninguna)) + '</button></div><div class="exp-rejilla">' +
      CATALOGO.map(function (c) { return chk("t:" + c.id, S.tablas[c.id], esc(t(c.n)), c.lento ? esc(t(T.lento)) : (c.id === "n1" && typeof window.Motor.barridoN1 !== "function" ? "—" : "")); }).join("") + '</div>';
    var hFil = chk("capas", S.capas, esc(t(T.capas)), esc(resumenCapas())) + chk("servicios", S.servicios, esc(t(T.sv)), esc(resumenSv())) +
      chk("solo", S.solo, esc(t(T.solo))) + chk("delta", S.delta && lab, esc(t(T.delta)), lab ? "" : esc(t(T.deltaRef)), !lab);
    var hSal = '<div class="exp-botones"><button type="button" class="btn prim" data-exp-acc="zip">' + esc(t(T.zip)) + '</button>' +
      '<button type="button" class="btn" data-exp-acc="pdf">' + esc(t(T.pdf)) + '</button></div>' +
      '<div class="exp-una"><select class="sel" data-exp="una" aria-label="' + esc(t(T.una)) + '">' + CATALOGO.map(function (c) {
        return '<option value="' + c.id + '"' + (S.una === c.id ? " selected" : "") + '>' + esc(t(c.n)) + '</option>';
      }).join("") + '</select><button type="button" class="btn" data-exp-acc="una">' + esc(t(T.una)) + '</button></div>' +
      '<p class="exp-nota">' + esc(t(T.formato)) + '</p><p class="exp-estado" role="status"></p>';
    var cap = document.querySelector(".caso-resumen");
    panel.innerHTML = '<div class="exp-cab"><span class="lbl">' + esc(t(T.titulo)) + '</span><span class="' + (lab ? "ins-lab" : "ins-ref") + '">' + (lab ? "LAB" : "REF") + '</span>' +
      '<span class="exp-caso" title="' + esc(cap ? cap.textContent : "") + '">' + esc(cap ? cap.textContent : "") + '</span>' +
      '<button type="button" class="exp-x" data-exp-acc="cerrar" title="' + esc(t(T.cerrar)) + '" aria-label="' + esc(t(T.cerrar)) + '">×</button></div>' +
      sec("exp:tablas", T.tablas, hTab) + sec("exp:filtros", T.filtros, hFil) + sec("exp:salida", T.salida, hSal);
  }
  function colocar() {
    if (!panel) return;
    var tb = document.getElementById("tb"), bt = document.querySelector('[data-accion="exportar"]');
    var top = tb ? tb.getBoundingClientRect().bottom : 72;
    panel.style.top = Math.round(top) + "px";
    if (bt) {
      var r = bt.getBoundingClientRect();
      panel.style.right = Math.max(8, Math.round(window.innerWidth - r.right)) + "px";
    }
  }
  function abierto() { return !!panel && !panel.hidden; }
  function marcarBoton() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-accion="exportar"]'), function (b) { b.setAttribute("aria-pressed", String(abierto())); b.classList.toggle("activo", abierto()); });
  }
  X.abrirPanel = function () {
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "exp"; panel.id = "exp-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "EXPORTAR");
      document.body.appendChild(panel);
      panel.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-exp-plegar]");
        if (b) { NOC.plegar(b.getAttribute("data-exp-plegar")); pintar(); return; }
        b = ev.target.closest("[data-exp-acc]");
        if (!b) return;
        var a = b.getAttribute("data-exp-acc");
        if (a === "cerrar") X.cerrarPanel();
        else if (a === "todas" || a === "ninguna") { Object.keys(S.tablas).forEach(function (k) { S.tablas[k] = a === "todas"; }); guardarSel(); pintar(); }
        else if (a === "zip") hacerZip();
        else if (a === "una") hacerUna();
        else if (a === "pdf") hacerInforme();
      });
      panel.addEventListener("change", function (ev) {
        var k = ev.target.getAttribute("data-exp");
        if (!k) return;
        if (k.indexOf("t:") === 0) S.tablas[k.slice(2)] = ev.target.checked;
        else if (k === "una") S.una = ev.target.value;
        else S[k] = ev.target.checked;
        guardarSel();
      });
    }
    pintar(); panel.hidden = false; colocar(); marcarBoton();
  };
  X.cerrarPanel = function () { if (panel) panel.hidden = true; marcarBoton(); };
  X.alternarPanel = function () { if (abierto()) X.cerrarPanel(); else X.abrirPanel(); };
  NOC.exportar = X;
  ["lang", "modo", "capas", "resultado"].forEach(function (ev) { NOC.on(ev, function () { if (abierto()) { pintar(); colocar(); } marcarBoton(); }); });
  if (NOC.sv && NOC.sv.on) NOC.sv.on(function () { if (abierto()) pintar(); });
  window.addEventListener("resize", function () { if (abierto()) colocar(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && abierto()) X.cerrarPanel(); });
  if (/(^|[#&])exportar\b/.test(location.hash)) setTimeout(X.abrirPanel, 300);
})(this);
