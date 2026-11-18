// vista_capas.js — vista CAPAS de RED-MAD 2031: capas A–H en filas, una caja por elemento/equipo, líneas de interfaz
// entre capas y ficha de 7 puntos al pulsar. Datos: window.ARQ (arquitectura_datos.js, generado por fusionar.py).
// Expone window.ARQ_VISTAS (ficha compartida) para vista_paquete.js y vista_interconexion.js.
(function () {
  "use strict";
  var NOC = window.NOC, ARQ = window.ARQ;
  if (!NOC || !NOC.registrarVista) return;

  // ---------- utilidades compartidas ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function t(o) { return NOC.t(o); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  var NE = { es: "no especificado en v7", en: "not specified in v7" };

  function marca(tipo) {
    if (tipo === "v7") return '<span class="marca doc">E2 v7</span>';
    if (tipo === "sup") return '<span class="marca sup">' + t({ es: "SUPUESTO", en: "ASSUMPTION" }) + '</span>';
    if (tipo === "calc") return '<span class="marca calc">' + t({ es: "CALC.", en: "CALC." }) + '</span>';
    if (tipo === "ne") return '<span class="marca ant">' + t({ es: "NO ESP. V7", en: "NOT IN V7" }) + '</span>';
    return '<span class="marca ant">' + t({ es: "DOC. ANTERIOR", en: "EARLIER DOC." }) + '</span>';
  }
  // Valor genérico de los inventarios (texto, número, lista u objeto) a texto plano
  function val(x) {
    if (x == null || x === "") return "";
    if (typeof x === "number") return NOC.fmt(x, x % 1 ? 2 : 0);
    if (typeof x === "string") return x;
    if (Array.isArray(x)) return x.map(val).filter(Boolean).join("; ");
    if (typeof x === "object") {
      if ("valor" in x || "unidad" in x) return [val(x.valor), x.unidad].filter(Boolean).join(" ") + (x.nota ? " (" + x.nota + ")" : "");
      return Object.keys(x).map(function (k) { var v = val(x[k]); return v ? k.replace(/_/g, " ") + ": " + v : ""; }).filter(Boolean).join(" · ");
    }
    return String(x);
  }
  function sec(tit, cuerpo) { return '<div class="ficha-sec"><h3>' + esc(tit) + '</h3>' + cuerpo + '</div>'; }
  function kv(filas) {
    filas = filas.filter(function (f) { return f && f[1] !== "" && f[1] != null; });
    if (!filas.length) return "";
    return '<dl class="kv arq-kv">' + filas.map(function (f) {
      return '<dt>' + esc(f[0]) + '</dt><dd class="' + (f[2] || "txt") + '">' + f[1] + '</dd>';
    }).join("") + '</dl>';
  }
  function nota(txt, tipo) { return '<p class="nota ' + (tipo === "sup" ? "dato-sup" : tipo === "v7" ? "dato-doc" : tipo === "calc" ? "dato-calc" : "") + '">' + txt + '</p>'; }
  function ne() { return '<span class="arq-ne">' + esc(t(NE)) + '</span>'; }

  // Ocupación actual de un nodo o enlace del simulador (NOC.resultado)
  function estadoRed(tipo, id) {
    var R = NOC.resultado;
    var r = R && (tipo === "nodo" ? R.nodos : R.enlaces) ? (tipo === "nodo" ? R.nodos : R.enlaces)[id] : null;
    if (!r) return null;
    var o = NOC.ocupacion ? NOC.ocupacion(r) : (esNum(r.ocupacion) ? r.ocupacion : null);
    var sev = r.caido ? "unk" : o == null ? null : o > 1.0001 ? "crit" : o >= 0.85 ? "maj" : o >= 0.6 ? "min" : "ok";
    return { id: id, tipo: tipo, oc: o, sev: sev, caido: !!r.caido, carga: r.carga_gbps, cap: r.capacidad_gbps };
  }
  function insignia(e) {
    if (!e) return '<span class="arq-ne">—</span>';
    if (e.caido) return NOC.insignia ? NOC.insignia("unk", t({ es: "CAÍDO", en: "DOWN" })) : '<span class="sev sev-unk">DOWN</span>';
    if (e.oc == null) return '<span class="arq-ne">' + esc(t({ es: "sin capacidad", en: "no capacity" })) + '</span>';
    var txt = NOC.fmt(e.oc * 100, 0) + " %";
    return NOC.insignia ? NOC.insignia(e.sev, txt) : '<span class="sev sev-' + e.sev + '">' + txt + '</span>';
  }
  // Peor estado entre los nodos (y enlaces) que representan un elemento
  function peor(nodos, enlaces) {
    var lista = (nodos || []).map(function (n) { return estadoRed("nodo", n); })
      .concat((enlaces || []).map(function (l) { return estadoRed("enlace", l); })).filter(Boolean);
    if (!lista.length) return null;
    var caidos = lista.filter(function (e) { return e.caido; });
    var con = lista.filter(function (e) { return e.oc != null; }).sort(function (a, b) { return b.oc - a.oc; });
    return { max: con[0] || null, caidos: caidos.length, n: lista.length };
  }
  function celdaCarga(nodos, enlaces) {
    var p = peor(nodos, enlaces);
    if (!p) return "";
    var s = p.max ? insignia(p.max) + ' <span class="mono arq-id">' + esc(p.max.id) + '</span>' : "";
    if (p.caidos) s += ' ' + (NOC.insignia ? NOC.insignia("unk", p.caidos + " " + t({ es: "CAÍDO", en: "DOWN" })) : "");
    return s;
  }

  // ---------- índices ----------
  var EL = {}, IF_DE = {};
  if (ARQ) {
    ARQ.elementos.forEach(function (e) { EL[e.id] = e; });
    ARQ.interfaces.forEach(function (f) {
      (f.pares || []).forEach(function (p) {
        [0, 1].forEach(function (i) {
          var yo = p[i], otro = p[1 - i];
          (IF_DE[yo] = IF_DE[yo] || []).push({ ifz: f, otro: otro });
        });
      });
    });
  }
  function capa(id) { return ARQ ? ARQ.capas.filter(function (c) { return c.id === id; })[0] : null; }
  function enlaceEl(id, txt) {
    return EL[id] ? '<a href="#" class="arq-enl" data-arq-el="' + esc(id) + '">' + esc(txt || id) + '</a>' : esc(txt || id);
  }
  function fuentes(lista, siVacio) {
    lista = lista || [];
    if (!lista.length) return nota(marca(siVacio || "sup") + " " + esc(t({ es: "Sin documento de origen.", en: "No source document." })), "sup");
    var vistos = {};
    return '<ul class="arq-fuentes">' + lista.filter(function (f) {
      var k = f.doc + "|" + f.seccion; if (vistos[k]) return false; vistos[k] = 1; return true;
    }).map(function (f) {
      return '<li class="' + (f.v7 ? "dato-doc" : "") + '">' + marca(f.v7 ? "v7" : "ant") + ' ' + esc(f.doc) + (f.seccion ? ' · <span class="mono">' + esc(f.seccion) + '</span>' : "") + '</li>';
    }).join("") + '</ul>';
  }
  function preguntas(lista) {
    return '<ol class="arq-preg">' + (lista || []).map(function (p) { return '<li>' + esc(t(p)) + '</li>'; }).join("") + '</ol>';
  }
  function cargaRed(red) {
    if (!red || (!red.nodos.length && !red.enlaces.length)) return nota(esc(t({ es: "No se representa como nodo ni enlace en el simulador.", en: "Not represented as a node or link in the simulator." })));
    var filas = red.nodos.map(function (n) { return ["nodo", n]; }).concat(red.enlaces.map(function (l) { return ["enlace", l]; }));
    var h = '<table class="tabla arq-tabla"><thead><tr><th>' + esc(t({ es: "Simulador", en: "Simulator" })) + '</th><th class="n">' +
      esc(t({ es: "Carga Gbit/s", en: "Load Gbit/s" })) + '</th><th class="n">Cap.</th><th>' + esc(t({ es: "Ocup.", en: "Util." })) + '</th></tr></thead><tbody>' +
      filas.map(function (f) {
        var e = estadoRed(f[0], f[1]);
        return '<tr data-arq-red="' + f[0] + ":" + esc(f[1]) + '"><td class="id">' + esc(f[1]) + '</td><td class="n">' + (e ? NOC.fmt(e.carga, 1) : "—") +
          '</td><td class="n">' + (e ? NOC.fmt(e.cap, 0) : "—") + '</td><td>' + insignia(e) + '</td></tr>';
      }).join("") + '</tbody></table>';
    if (red.nota) h += nota(marca("sup") + " " + esc(red.nota), "sup");
    return h;
  }

  var ESTADO = {
    v7: { es: "CONFIRMADO EN V7", en: "CONFIRMED IN V7", c: "v7" }, parcial: { es: "PARCIAL EN V7", en: "PARTIAL IN V7", c: "v7" },
    abierto: { es: "ABIERTO EN V7", en: "OPEN IN V7", c: "sup" }, hueco: { es: "HUECO EN V7", en: "GAP IN V7", c: "ne" },
    no_v7: { es: "NO FIGURA EN V7", en: "NOT IN V7", c: "ne" }
  };
  function estadoEq(q) {
    var e = ESTADO[q.v7.estado] || ESTADO.hueco;
    return '<span class="marca ' + (e.c === "v7" ? "doc" : e.c === "sup" ? "sup" : "ant") + '">' + esc(t(e)) + '</span>';
  }

  // ---------- ficha de 7 puntos de un elemento ----------
  function fichaElemento(id) {
    var e = EL[id]; if (!e) return null;
    var c = capa(e.capa) || { nombre: { es: "", en: "" } };
    var eqs = (e.equipos || []).map(function (q) { return ARQ.equipos[q]; }).filter(Boolean);
    var cor = e.v7_corrige || {};
    var h = '<div data-arq-ficha="el:' + esc(id) + '">';

    // 1 · rol y capa
    var tipoTxt = { elemento: { es: "elemento lógico", en: "logical element" }, equipo: { es: "equipo sin elemento lógico", en: "equipment without logical element" },
      externo: { es: "red externa", en: "external network" }, hueco: { es: "hueco de la v7", en: "v7 gap" } }[e.tipo];
    function campo(k, nombre) {
      if (cor[k]) return [nombre, marca("v7") + ' ' + esc(cor[k].valor) + ' <span class="mono arq-sec">§' + esc(cor[k].seccion) + '</span>' +
        (e[k] ? '<div class="arq-antes">' + marca("ant") + ' ' + esc(val(e[k])) + '</div>' : "")];
      return e[k] ? [nombre, (e.tipo === "hueco" ? "" : marca("ant") + ' ') + esc(val(e[k]))] : null;
    }
    h += sec(t({ es: "1 · Rol y capa", en: "1 · Role and layer" }), kv([
      [t({ es: "Capa", en: "Layer" }), '<span class="mono">' + esc(e.capa) + '</span> · ' + esc(t(c.nombre)) + (c.inferido ? ' ' + marca("sup") : "")],
      [t({ es: "Tipo", en: "Kind" }), esc(t(tipoTxt || { es: e.tipo, en: e.tipo }))],
      e.funciones && e.funciones.length ? [t({ es: "Funciones", en: "Functions" }), esc(val(e.funciones))] : null,
      campo("ubicacion", t({ es: "Ubicación", en: "Location" })),
      campo("cantidad", t({ es: "Cantidad", en: "Quantity" }))
    ]) + (e.tipo === "hueco" ? nota(marca("ne") + " " + esc(t({ es: "La v7 no define este bloque; se muestra para que el hueco se vea.", en: "v7 does not define this block; it is shown so the gap is visible." }))) : ""));

    // 2 · modelo y fabricante
    var h2 = "";
    if (cor.como_se_implementa) h2 += nota(marca("v7") + " " + esc(cor.como_se_implementa.valor) + ' <span class="mono arq-sec">§' + esc(cor.como_se_implementa.seccion) + '</span>', "v7");
    eqs.forEach(function (q) {
      h2 += '<div class="arq-eq"><div class="arq-eq-cab"><span class="mono">' + esc(q.id) + '</span> ' + estadoEq(q) + '</div>' +
        kv([[t({ es: "Fabricante/modelo", en: "Vendor/model" }), q.fabricante || q.modelo ? marca("ant") + ' ' + esc([q.fabricante, q.modelo].filter(Boolean).join(" · ")) : ne()],
          [t({ es: "En la v7", en: "In v7" }), esc(q.v7.texto) + (q.v7.seccion && q.v7.seccion !== "—" ? ' <span class="mono arq-sec">§' + esc(q.v7.seccion) + '</span>' : "")]]) +
        (q.alternativas && q.alternativas.length ? '<table class="tabla arq-tabla"><thead><tr><th>' + esc(t({ es: "Descartado", en: "Discarded" })) + '</th><th>' +
          esc(t({ es: "Por qué", en: "Why" })) + '</th></tr></thead><tbody>' + q.alternativas.map(function (a) {
            return '<tr><td class="txt">' + esc(a.modelo) + '</td><td class="txt">' + esc(a.motivo) + '</td></tr>';
          }).join("") + '</tbody></table>' : "") + '</div>';
    });
    if (!h2) h2 = e.como_se_implementa ? nota(marca("ant") + " " + esc(e.como_se_implementa)) : nota(ne());
    else if (e.como_se_implementa && !cor.como_se_implementa) h2 = nota(marca("ant") + " " + esc(e.como_se_implementa)) + h2;
    h += sec(t({ es: "2 · Modelo y fabricante", en: "2 · Model and vendor" }), h2);

    // 3 · capacidad y dimensionado paso a paso
    var h3 = "";
    (e.reglas || []).forEach(function (k) {
      var r = ARQ.reglas[k]; if (!r) return;
      h3 += '<div class="arq-regla dato-doc"><div class="arq-regla-cab">' + marca("v7") + ' ' + esc(r.regla) + ' <span class="mono arq-sec">§' + esc(r.seccion) + '</span></div>' +
        (r.tex ? '<div class="formula" data-tex="' + esc(r.tex) + '">' + esc(r.tex) + '</div>' : "") + '<p class="nota">' + esc(r.valor) + '</p></div>';
    });
    if (e.v7 && e.v7.length) h3 += '<div class="dato-doc">' + kv(e.v7.map(function (x) {
      return [x.k, esc(val(x.v)) + ' <span class="arq-sec">§' + esc(x.seccion) + '</span>', "mono"];
    })) + '</div>';
    eqs.forEach(function (q) {
      var d = q.dimensionado;
      if (!d && !q.capacidad) return;
      h3 += '<div class="arq-dim dato-calc"><div class="arq-eq-cab"><span class="mono">' + esc(q.id) + '</span> ' + marca("ant") + '</div>' + kv([
        q.capacidad ? [t({ es: "Capacidad", en: "Capacity" }), esc(val(q.capacidad))] : null,
        d && d.formula ? [t({ es: "1 · Fórmula", en: "1 · Formula" }), esc(val(d.formula)), "mono"] : null,
        d && d.valores ? [t({ es: "2 · Sustitución", en: "2 · Substitution" }), esc(val(d.valores)), "mono"] : null,
        d && d.resultado != null ? [t({ es: "3 · Resultado", en: "3 · Result" }), esc(val(d.resultado)) + (d.unidad ? " " + esc(d.unidad) : ""), "mono"] : null
      ]) + '</div>';
    });
    h += sec(t({ es: "3 · Capacidad y dimensionado", en: "3 · Capacity and sizing" }), h3 || nota(ne()));

    // 4 · interfaces con los vecinos
    var vec = IF_DE[id] || [];
    h += sec(t({ es: "4 · Interfaces con los vecinos", en: "4 · Interfaces to neighbours" }), vec.length ?
      '<table class="tabla arq-tabla"><thead><tr><th>' + esc(t({ es: "Vecino", en: "Neighbour" })) + '</th><th>' + esc(t({ es: "Interfaz", en: "Interface" })) +
      '</th><th>' + esc(t({ es: "Protocolo / transporte", en: "Protocol / transport" })) + '</th></tr></thead><tbody>' + vec.map(function (v) {
        var f = v.ifz;
        return '<tr class="' + (f.inferido ? "arq-inf" : "") + '"><td class="txt">' + enlaceEl(v.otro, EL[v.otro] ? EL[v.otro].id : v.otro) + '</td><td class="id">' + esc(f.id) +
          (f.inferido ? ' ' + marca("sup") : "") + '</td><td class="txt">' + esc([f.protocolo, f.transporte].filter(Boolean).join(" / ")) + '</td></tr>';
      }).join("") + '</tbody></table>' + (vec.some(function (v) { return v.ifz.inferido; }) ? nota(marca("sup") + " " + esc(t({ es: "Interfaz deducida de los documentos, no descrita como tal.", en: "Interface inferred from the documents, not described as such." })), "sup") : "")
      : nota(esc(t({ es: "Sin interfaces descritas.", en: "No interfaces described." }))));

    // 5 · protección y quién le respalda
    var prot = [campo("redundancia", t({ es: "Elemento", en: "Element" }))];
    eqs.forEach(function (q) { if (q.redundancia) prot.push([q.id, marca("ant") + ' ' + esc(val(q.redundancia))]); });
    var resp = (e.v7 || []).filter(function (x) { return /respaldo|redund|protecc|política|recuperación/i.test(x.k); });
    h += sec(t({ es: "5 · Protección y respaldo", en: "5 · Protection and backup" }),
      (kv(prot) || "") + (resp.length ? '<div class="dato-doc">' + kv(resp.map(function (x) { return [x.k, marca("v7") + ' ' + esc(val(x.v)) + ' <span class="arq-sec">§' + esc(x.seccion) + '</span>']; })) + '</div>' : "") ||
      nota(ne()));

    // Carga actual en el simulador
    h += sec(t({ es: "Carga actual (simulador)", en: "Current load (simulator)" }), '<div data-arq-carga-ficha>' + cargaRed(e.red) + '</div>');

    // 6 · fuente
    var fs = (e.fuente || []).slice();
    eqs.forEach(function (q) { fs = fs.concat(q.fuente || []); });
    if (e.v7 && e.v7.length) fs.unshift({ doc: ARQ.referencia.doc, seccion: e.v7.map(function (x) { return x.seccion; }).filter(function (s, i, a) { return a.indexOf(s) === i; }).join("; "), v7: true });
    h += sec(t({ es: "6 · Fuente", en: "6 · Source" }), fuentes(fs));

    // 7 · preguntas
    h += sec(t({ es: "7 · Para pensar", en: "7 · To think about" }), preguntas(e.preguntas));
    return { titulo: e.id, subtitulo: (e.nombre || "") + " · " + t({ es: "capa", en: "layer" }) + " " + e.capa, html: h + '</div>' };
  }

  var abierta = null;   // {tipo, id} de la ficha propia abierta
  function fichaMia() { var f = document.querySelector("#ficha-cuerpo [data-arq-ficha]"); return f ? f.getAttribute("data-arq-ficha") : null; }
  function abrir(tipo, id, constructor, conservarScroll) {
    var f = constructor(id); if (!f) return;
    var cu = document.getElementById("ficha-cuerpo"), sc = cu ? cu.scrollTop : 0;
    if (!conservarScroll && NOC.seleccionar) NOC.seleccionar(tipo === "el" ? "equipo" : "interconexion", id);
    NOC.abrirFicha(f);
    abierta = { tipo: tipo, id: id, f: constructor };
    if (conservarScroll && cu) cu.scrollTop = sc;
    marcarSel();
  }
  var EXTRA = {};   // constructores de ficha registrados por otras vistas (interconexión)
  var API = window.ARQ_VISTAS = {
    esc: esc, marca: marca, val: val, sec: sec, kv: kv, nota: nota, ne: ne, estadoRed: estadoRed, insignia: insignia,
    celdaCarga: celdaCarga, fuentes: fuentes, preguntas: preguntas, cargaRed: cargaRed, EL: EL,
    abrirElemento: function (id) { abrir("el", id, fichaElemento); },
    registrarFicha: function (tipo, fn) { EXTRA[tipo] = fn; },
    abrir: function (tipo, id) { if (EXTRA[tipo]) abrir(tipo, id, EXTRA[tipo]); },
    refrescarFicha: function () {
      if (!abierta || fichaMia() !== abierta.tipo + ":" + abierta.id) { abierta = null; return; }
      abrir(abierta.tipo, abierta.id, abierta.f, true);
    }
  };

  // Clics en cualquier [data-arq-el] / [data-arq-ix] (cajas, saltos, filas, enlaces dentro de la ficha)
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-arq-el],[data-arq-ix]");
    if (!b) return;
    ev.preventDefault();
    if (b.hasAttribute("data-arq-el")) API.abrirElemento(b.getAttribute("data-arq-el"));
    else API.abrir("ix", b.getAttribute("data-arq-ix"));
  });
  NOC.on("lang", function () { API.refrescarFicha(); });
  NOC.on("resultado", function () {
    if (!abierta || fichaMia() !== abierta.tipo + ":" + abierta.id) return;
    var c = document.querySelector("#ficha-cuerpo [data-arq-carga-ficha]");
    if (c && abierta.tipo === "el" && EL[abierta.id]) c.innerHTML = cargaRed(EL[abierta.id].red);
    else API.refrescarFicha();
  });

  // ---------- vista CAPAS ----------
  var raiz = null, svg = null, obs = null;
  function cajaHtml(e) {
    var eqs = (e.equipos || []).map(function (q) { return ARQ.equipos[q]; }).filter(Boolean);
    var v7 = (e.v7 && e.v7.length) || eqs.some(function (q) { return q.v7.estado === "v7" || q.v7.estado === "parcial"; });
    var cls = e.tipo === "hueco" ? "vc-hueco" : e.tipo === "externo" ? "vc-ext" : v7 ? "dato-doc" : "dato-calc";
    var mod = eqs.map(function (q) { return q.modelo ? q.modelo.split(/[(;,]/)[0].trim() : ""; }).filter(Boolean);
    var tieneRed = e.red && (e.red.nodos.length || e.red.enlaces.length);
    return '<button type="button" class="vc-caja ' + cls + '" data-arq-el="' + esc(e.id) + '" data-capa="' + esc(e.capa) + '" title="' + esc(e.nombre || e.id) + '">' +
      '<span class="vc-id">' + esc(e.id) + '</span>' +
      '<span class="vc-nom">' + esc(e.tipo === "hueco" ? t(NE) : (e.nombre || "")) + '</span>' +
      (mod.length ? '<span class="vc-mod">' + esc(mod.slice(0, 2).join(" · ")) + '</span>' : "") +
      (tieneRed ? '<span class="vc-carga" data-arq-carga="' + esc(e.id) + '"></span>' : "") + '</button>';
  }
  function pintar() {
    if (!raiz) return;
    if (!ARQ) { raiz.innerHTML = '<div class="vc-error">arquitectura_datos.js ' + esc(t({ es: "no se pudo cargar", en: "could not be loaded" })) + '</div>'; return; }
    var h = '<div class="vc-cab"><span class="rot">' + esc(t({ es: "Arquitectura por capas · Entrega 2 (v7)", en: "Layered architecture · Deliverable 2 (v7)" })) + '</span>' +
      '<span class="vc-ley"><i class="dato-doc"></i>' + esc(t({ es: "con datos v7", en: "with v7 data" })) + '<i class="dato-calc"></i>' +
      esc(t({ es: "solo docs. anteriores", en: "earlier docs only" })) + '<i class="vc-hueco"></i>' + esc(t({ es: "hueco v7", en: "v7 gap" })) +
      '<i class="vc-ext"></i>' + esc(t({ es: "red externa", en: "external" })) + '<span class="vc-sep"></span>' +
      esc(t({ es: "líneas: interfaces entre capas", en: "lines: inter-layer interfaces" })) + '</span></div><div class="vc-lienzo"><svg class="vc-svg" aria-hidden="true"></svg>';
    ARQ.capas.forEach(function (c) {
      var els = ARQ.elementos.filter(function (e) { return e.capa === c.id; });
      h += '<div class="vc-fila" data-fila="' + c.id + '"><div class="vc-capa"><span class="vc-letra">' + c.id + '</span><span class="vc-cnom">' + esc(t(c.nombre)) + '</span>' +
        (c.inferido ? '<span class="vc-inf">' + esc(t({ es: "no es capa en los docs.", en: "not a layer in docs" })) + '</span>' : "") +
        '<span class="vc-tec">' + esc((c.tecnologias || []).slice(0, 4).join(" · ")) + '</span></div><div class="vc-cajas">' + els.map(cajaHtml).join("") + '</div></div>';
    });
    raiz.innerHTML = h + '</div>';
    svg = raiz.querySelector(".vc-svg");
    actualizarCargas(); marcarSel(); lineas();
    requestAnimationFrame(lineas);
  }
  // Pares de interfaces entre capas distintas (sin repetir el mismo par)
  function paresEntreCapas() {
    var vistos = {}, out = [];
    ARQ.interfaces.forEach(function (f) {
      (f.pares || []).forEach(function (p) {
        var a = EL[p[0]], b = EL[p[1]];
        if (!a || !b || a.capa === b.capa) return;
        var k = [p[0], p[1]].sort().join("|");
        if (vistos[k]) { vistos[k].ifz.push(f.id); return; }
        vistos[k] = { a: p[0], b: p[1], ifz: [f.id], inferido: f.inferido };
        out.push(vistos[k]);
      });
    });
    return out;
  }
  function lineas() {
    if (!raiz || !svg || raiz.offsetParent === null) return;
    var lienzo = raiz.querySelector(".vc-lienzo"); if (!lienzo) return;
    var r0 = lienzo.getBoundingClientRect();
    svg.setAttribute("width", lienzo.scrollWidth); svg.setAttribute("height", lienzo.scrollHeight);
    function caja(id) {
      var n = lienzo.querySelector('.vc-caja[data-arq-el="' + id + '"]'); if (!n) return null;
      var r = n.getBoundingClientRect();
      return { x: r.left - r0.left + r.width / 2, t: r.top - r0.top, b: r.bottom - r0.top };
    }
    var s = "";
    paresEntreCapas().forEach(function (p) {
      var a = caja(p.a), b = caja(p.b); if (!a || !b) return;
      if (a.t > b.t) { var x = a; a = b; b = x; }
      var y1 = a.b, y2 = b.t, mx = (a.x + b.x) / 2, my = (y1 + y2) / 2;
      var lab = p.ifz.join("/");
      s += '<g class="vc-l' + (p.inferido ? " inf" : "") + '" data-a="' + esc(p.a) + '" data-b="' + esc(p.b) + '"><line x1="' + a.x.toFixed(1) + '" y1="' + y1.toFixed(1) +
        '" x2="' + b.x.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/><text x="' + mx.toFixed(1) + '" y="' + (my + 3).toFixed(1) + '" text-anchor="middle">' + esc(lab) + '</text></g>';
    });
    svg.innerHTML = s;
  }
  function resaltar(id) {
    if (!svg) return;
    Array.prototype.forEach.call(svg.querySelectorAll(".vc-l"), function (g) {
      var on = id && (g.getAttribute("data-a") === id || g.getAttribute("data-b") === id);
      g.classList.toggle("on", !!on);
    });
    svg.classList.toggle("foco", !!id);
  }
  function actualizarCargas() {
    if (!raiz) return;
    Array.prototype.forEach.call(raiz.querySelectorAll("[data-arq-carga]"), function (n) {
      var e = EL[n.getAttribute("data-arq-carga")];
      n.innerHTML = e ? celdaCarga(e.red.nodos, e.red.enlaces) : "";
    });
  }
  function marcarSel() {
    if (!raiz) return;
    var s = NOC.seleccion;
    Array.prototype.forEach.call(raiz.querySelectorAll(".vc-caja"), function (n) {
      var e = EL[n.getAttribute("data-arq-el")], on = false;
      if (s && e) {
        if (s.tipo === "equipo") on = s.id === e.id;
        else if (s.tipo === "nodo") on = e.red.nodos.indexOf(s.id) >= 0;
        else if (s.tipo === "enlace") on = e.red.enlaces.indexOf(s.id) >= 0;
      }
      n.classList.toggle("sel", on);
    });
  }

  NOC.registrarVista({
    id: "capas",
    titulo: { es: "Capas", en: "Layers" },
    montar: function (el) {
      raiz = el; el.classList.add("vc");
      el.addEventListener("mouseover", function (ev) { var b = ev.target.closest(".vc-caja"); resaltar(b ? b.getAttribute("data-arq-el") : null); });
      el.addEventListener("mouseleave", function () { resaltar(null); });
      if (window.ResizeObserver) { obs = new ResizeObserver(function () { requestAnimationFrame(lineas); }); obs.observe(el); }
      else window.addEventListener("resize", function () { requestAnimationFrame(lineas); });
      pintar();
    },
    activar: function () { actualizarCargas(); marcarSel(); requestAnimationFrame(lineas); },
    desactivar: function () { resaltar(null); }
  });
  NOC.on("resultado", actualizarCargas);
  NOC.on("seleccion", marcarSel);
  NOC.on("lang", pintar);
})();
