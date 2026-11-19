// linaje.js — UI de la Revisión 6 de CONTRATO_UI.md (trazabilidad hasta el origen).
// Lee window.LINAJE (linaje_datos.js, generado por datos/gen_linaje.py; aquí solo se lee) y añade:
//  · En la ficha de cualquier elemento, la sección plegable "¿De dónde sale?": por campo con linaje
//    (LINAJE.indice["<elemento>|<campo>"]) un árbol plegable valor → fórmula → entradas (recursivo) → fuentes,
//    con estado TRAZADO / HUECO / DISCREPA; los campos sin linaje salen como "sin linaje todavía".
//  · Vista TRAZABILIDAD: cobertura total y por ámbito, huecos por nº de valores bloqueados, discrepancias,
//    catálogo de fuentes, fórmulas y valores con buscador. Clic en un valor = su árbol en la ficha.
//  · API: NOC.linaje = {datos, valor(id), abrirValor(id), claves(elemento), cobertura(alcance)}.
// Sin LINAJE (archivo ausente) no pinta nada y no falla.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC) return;
  var L = window.LINAJE && Array.isArray(window.LINAJE.valores) ? window.LINAJE : null;

  // ======================================================================== índices
  var V = {}, FU = {}, FX = {}, SUP = {}, CLAVES = {}, USOS_F = {}, USOS_FX = {}, PADRES = {};
  function preparar() {
    if (!L) return;
    L.valores.forEach(function (v) { V[v.id] = v; });
    (L.fuentes || []).forEach(function (f) { FU[f.id] = f; USOS_F[f.id] = { valores: [], formulas: [] }; });
    (L.formulas || []).forEach(function (f) {
      FX[f.id] = f; USOS_FX[f.id] = [];
      (f.refs || []).forEach(function (r) { if (USOS_F[r]) USOS_F[r].formulas.push(f.id); });
    });
    ((NOC.RED || window.RED || {}).supuestos || []).forEach(function (s) { SUP[s.id] = { id: s.id, texto: s.motivo || s.campo || "", motivo: s.motivo || "", fuente_propuesta: s.fuente_parcial || s.alternativa || "", sim: true }; });
    (L.supuestos || []).forEach(function (s) { SUP[s.id] = s; });
    L.valores.forEach(function (v) {
      if (v.fuente && USOS_F[v.fuente.id]) USOS_F[v.fuente.id].valores.push(v.id);
      if (v.formula && USOS_FX[v.formula]) USOS_FX[v.formula].push(v.id);
      (v.entradas || []).forEach(function (e) { (PADRES[e] = PADRES[e] || []).push(v.id); });
    });
    Object.keys(L.indice || {}).forEach(function (k) {
      var i = k.lastIndexOf("|"), el = k.slice(0, i);
      (CLAVES[el] = CLAVES[el] || []).push({ clave: k, elemento: el, campo: k.slice(i + 1), v: L.indice[k] });
    });
  }
  preparar();

  // ======================================================================== textos
  var TX = {
    sec: { es: "¿De dónde sale?", en: "Where does it come from?" },
    vista: { es: "Trazabilidad", en: "Traceability" },
    trazado: { es: "TRAZADO", en: "TRACED" }, hueco: { es: "HUECO", en: "GAP" }, discrepa: { es: "DISCREPA", en: "MISMATCH" },
    sinLinaje: { es: "sin linaje todavía", en: "no lineage yet" },
    sinDatos: { es: "No hay linaje cargado (falta linaje_datos.js).", en: "No lineage loaded (linaje_datos.js missing)." },
    dato: { es: "dato", en: "data" }, derivado: { es: "derivado", en: "derived" }, supuesto: { es: "supuesto", en: "assumption" },
    usuario: { es: "dato del usuario", en: "user data" },   // Revisión 8: tipo de procedencia "usuario" (modelo propio, LAB)
    usuarioNota: { es: "En LAB, el modelo de demanda propio cambia este elemento; el linaje de abajo es el del valor de diseño.", en: "In LAB, the own demand model changes this element; the lineage below is that of the design value." },
    formula: { es: "Fórmula", en: "Formula" }, calculo: { es: "cálculo", en: "calculation" }, variables: { es: "Variables", en: "Variables" },
    justif: { es: "Justificación", en: "Justification" }, refs: { es: "Referencias", en: "References" },
    entradas: { es: "Entradas", en: "Inputs" }, fuente: { es: "Fuente", en: "Source" },
    verif: { es: "VERIFICADA", en: "VERIFIED" }, noVerif: { es: "NO VERIFICADA", en: "NOT VERIFIED" },
    apunte: { es: "apunte del vault", en: "vault note" },
    memoria: { es: "En la memoria", en: "In the report" }, recalc: { es: "recalculado", en: "recomputed" },
    comprob: { es: "Comprobación", en: "Check" }, cumple: { es: "cumple", en: "holds" }, noCumple: { es: "NO cumple", en: "does NOT hold" },
    seCorta: { es: "La cadena se corta en", en: "The chain breaks at" }, propuesta: { es: "fuente propuesta", en: "proposed source" },
    motor: { es: "Lo recalcula motor.js (comparar_v7.js / test_v7.js); sin expresión cerrada aquí.", en: "Recomputed by motor.js (comparar_v7.js / test_v7.js); no closed form here." },
    nota: { es: "Nota", en: "Note" }, abrir: { es: "abrir su árbol", en: "open its tree" },
    ciclo: { es: "(ya aparece más arriba en esta rama)", en: "(already shown above in this branch)" },
    campos: { es: "campos con linaje", en: "fields with lineage" },
    verFicha: { es: "ficha del elemento", en: "element card" },
    usadoEn: { es: "Se usa en", en: "Used in" },
    cobertura: { es: "Cobertura", en: "Coverage" }, porAmbito: { es: "Por ámbito", en: "By scope" },
    huecos: { es: "Huecos (por valores bloqueados)", en: "Gaps (by values blocked)" },
    discrepancias: { es: "Discrepancias", en: "Mismatches" },
    catalogo: { es: "Catálogo", en: "Catalogue" }, fuentes: { es: "Fuentes", en: "Sources" }, formulas: { es: "Fórmulas", en: "Formulas" }, valores: { es: "Valores", en: "Values" },
    buscar: { es: "Buscar (id, texto, editor, elemento…)", en: "Search (id, text, publisher, element…)" },
    alcance: { es: "Alcance", en: "Scope" },
    alcMem: { es: "memoria v7", en: "v7 report" }, alcIdx: { es: "campos del simulador", en: "simulator fields" }, alcTodos: { es: "todos", en: "all" },
    bloquea: { es: "bloquea", en: "blocks" },
    ninguna: { es: "Ninguna: todos los valores con referencia coinciden con su recálculo dentro de la tolerancia.", en: "None: every value with a reference matches its recomputation within tolerance." },
    conRef: { es: "valores comparados con la memoria o el simulador", en: "values compared with the report or the simulator" },
    leyenda: { es: "TRAZADO = toda la cadena llega a INE/CNMC/normas/fabricante/clase verificados · HUECO = algún eslabón es un supuesto sin fuente · DISCREPA = el recálculo no da el valor de la memoria.",
      en: "TRACED = whole chain reaches verified INE/CNMC/standards/vendor/class sources · GAP = some link is an assumption without source · MISMATCH = recomputation differs from the report." },
    nRes: { es: "resultados", en: "results" }, mas: { es: "más", en: "more" }
  };
  function t(o) { return NOC.t(o); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function num(x, md) {
    if (!esNum(x)) return String(x == null ? "—" : x);
    var a = Math.abs(x);
    if (md == null) md = a >= 1000 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : a === 0 ? 0 : 5;
    return x.toLocaleString(NOC.lang === "en" ? "en-GB" : "es-ES", { maximumFractionDigits: md, minimumFractionDigits: 0 });
  }
  function valorTxt(v) {
    var x = v.valor;
    if (Array.isArray(x)) return "[" + x.length + " " + t({ es: "valores", en: "values" }) + ": " + num(x[0]) + " … " + num(x[x.length - 1]) + "]";
    return num(x);
  }
  function unidad(u) { return u && u !== "—" ? " " + u : ""; }
  function marcaEstado(e) {
    var c = e === "trazado" ? "ok" : e === "discrepa" ? "crit" : "min";
    return '<span class="sev sev-' + c + ' lj-est">' + esc(t(TX[e] || { es: e, en: e })) + '</span>';
  }
  function marcaVerif(f) {
    return f.verificada ? '<span class="marca lj-ver">' + esc(t(TX.verif)) + '</span>' : '<span class="marca lj-nover">' + esc(t(TX.noVerif)) + '</span>';
  }
  function tipoFuente(tp) {
    return t({ externa: { es: "externa", en: "external" }, norma: { es: "norma", en: "standard" }, fabricante: { es: "fabricante", en: "vendor" },
      clase: { es: "clase", en: "class" }, memoria: { es: "memoria", en: "report" }, grupo: { es: "grupo", en: "team" } }[tp] || { es: tp, en: tp });
  }
  function nombreValor(v) { return v.elemento ? v.elemento + (v.campo && v.campo !== "valor" ? " · " + v.campo : "") : v.id; }

  // ======================================================================== árbol (HTML; los hijos se rellenan al desplegar)
  var ABIERTOS = {};   // ruta -> true (estado del árbol en esta sesión)
  function nodoValor(vid, ruta, etiqueta, abrir) {
    var v = V[vid];
    if (!v) return '<div class="lj-falta">' + esc(vid) + ' · ' + esc(t(TX.sinLinaje)) + '</div>';
    ruta = ruta ? ruta + ">" + vid : vid;
    var ab = abrir || ABIERTOS[ruta];
    if (abrir) ABIERTOS[ruta] = true;
    var hojaDato = v.tipo === "dato" && !(v.entradas || []).length;
    return '<details class="lj-n lj-' + esc(v.estado) + '" data-lj-v="' + esc(vid) + '" data-lj-r="' + esc(ruta) + '"' + (ab ? " open" : "") + '>' +
      '<summary>' + marcaEstado(v.estado) + '<span class="lj-et">' + esc(etiqueta || nombreValor(v)) + '</span>' +
      '<span class="lj-val">' + esc(valorTxt(v)) + '<span class="lj-u">' + esc(unidad(v.unidad)) + '</span></span>' +
      '<span class="lj-tipo">' + esc(t(TX[v.tipo] || { es: v.tipo, en: v.tipo })) + (v.formula ? " · " + esc(v.formula) : hojaDato && v.fuente ? " · " + esc((FU[v.fuente.id] || {}).editor || v.fuente.id) : "") + '</span></summary>' +
      '<div class="lj-c">' + (ab ? cuerpoValor(vid, ruta) : "") + '</div></details>';
  }
  function calculoTxt(v) {
    if (!v.calc) return "";
    var ok = true;
    var s = v.calc.replace(/e\[(\d+)\]/g, function (m, i) {
      var e = V[v.entradas[+i]];
      if (!e) { ok = false; return m; }
      return Array.isArray(e.valor) ? "[" + e.valor.length + "]" : num(e.valor);
    });
    if (!ok) return "";
    s = s.replace(/Math\./g, "").replace(/F\.mco/g, "MCO").replace(/\*/g, " × ").replace(/\//g, " / ").replace(/([^ ])([+-])([^ ])/g, "$1 $2 $3").replace(/\s+/g, " ");
    return s + " = " + num(v.valor);
  }
  function fuenteHTML(fid, loc, abrir) {
    var f = FU[fid];
    if (!f) return '<div class="lj-falta">' + esc(fid) + '</div>';
    var clase = f.tipo === "clase" || f.tipo === "grupo" || f.tipo === "memoria";
    return '<details class="lj-f lj-f-' + esc(f.tipo) + '"' + (abrir ? " open" : "") + '><summary><span class="lj-ftipo">' + esc(tipoFuente(f.tipo)) + '</span>' +
      '<span class="lj-fed">' + esc(f.editor || "") + '</span><span class="lj-fid">' + esc(f.id) + '</span>' + marcaVerif(f) + '</summary>' +
      '<div class="lj-fc"><div class="lj-ftit">' + esc(f.titulo || "") + (f.fecha ? ' <span class="tx3">(' + esc(f.fecha) + ')</span>' : '') + '</div>' +
      (loc && loc !== f.localizador ? '<div class="lj-floc"><span class="rot">' + esc(t({ es: "Aquí", en: "Here" })) + '</span> ' + esc(loc) + '</div>' : '') +
      (f.localizador ? '<div class="lj-floc"><span class="rot">' + esc(clase ? t(TX.apunte) : t({ es: "Localizador", en: "Locator" })) + '</span> <span class="' + (clase ? "lj-ruta" : "") + '">' + esc(f.localizador) + '</span></div>' : '') +
      (f.url && /^https?:\/\//i.test(f.url) ? '<div class="lj-floc"><a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.url) + '</a> <span class="tx3">↗</span></div>' : '') +
      (f.nota ? '<p class="nota lj-fnota">' + esc(f.nota) + '</p>' : '') + '</div></details>';
  }
  function supHTML(sid) {
    var s = SUP[sid];
    if (!s) return '<div class="lj-sup"><span class="mono">' + esc(sid) + '</span></div>';
    return '<div class="lj-sup"><span class="mono lj-sid">' + esc(sid) + '</span> ' + esc(s.texto || s.motivo || "") +
      (s.motivo && s.motivo !== s.texto ? '<div class="nota">' + esc(s.motivo) + '</div>' : '') +
      (s.fuente_propuesta && s.fuente_propuesta !== "—" ? '<div class="nota lj-prop"><span class="rot">' + esc(t(TX.propuesta)) + '</span> ' + esc(s.fuente_propuesta) + '</div>' : '') + '</div>';
  }
  function difPct(v) {
    if (!v.ref || !esNum(v.ref.valor) || !esNum(v.valor)) return null;
    if (esNum(v.dif_rel)) return v.dif_rel * 100;
    return v.ref.valor ? (v.valor - v.ref.valor) / Math.abs(v.ref.valor) * 100 : null;
  }
  function cuerpoValor(vid, ruta) {
    var v = V[vid], h = "";
    if (!v) return "";
    // fórmula
    if (v.formula) {
      var f = FX[v.formula] || { id: v.formula, nombre: "", expr: "", variables: {}, refs: [] };
      var vars = Object.keys(f.variables || {});
      h += '<div class="lj-blq lj-fx"><div class="lj-blq-cab"><span class="rot">' + esc(t(TX.formula)) + '</span> <span class="mono">' + esc(f.id) + '</span> ' + esc(f.nombre || "") + '</div>' +
        '<div class="lj-expr">' + esc(f.expr || "") + '</div>' +
        (v.calc ? '<div class="lj-calc"><span class="tx3">' + esc(t(TX.calculo)) + ':</span> ' + esc(calculoTxt(v)) + '</div>' : '<div class="nota tx3">' + esc(t(TX.motor)) + '</div>') +
        (vars.length ? '<dl class="lj-vars">' + vars.map(function (k) {
          var x = f.variables[k] || {};
          return '<dt>' + esc(k) + '</dt><dd>' + esc(x.desc || "") + (x.unidad ? ' <span class="lj-u">[' + esc(x.unidad) + ']</span>' : '') + '</dd>';
        }).join("") + '</dl>' : '') +
        (f.justificacion ? '<p class="nota lj-just"><span class="rot">' + esc(t(TX.justif)) + '</span> ' + esc(f.justificacion) + '</p>' : '') +
        ((f.refs || []).length ? '<div class="lj-refs"><span class="rot">' + esc(t(TX.refs)) + '</span>' + f.refs.map(function (r) { return fuenteHTML(r); }).join("") + '</div>' : '') + '</div>';
    }
    // fuente directa (dato, o supuesto respaldado por un documento)
    if (v.fuente) h += '<div class="lj-blq"><div class="lj-blq-cab"><span class="rot">' + esc(t(TX.fuente)) + '</span></div>' + fuenteHTML(v.fuente.id, v.fuente.localizador, true) + '</div>';
    // comparación con la memoria / simulador
    if (v.ref) {
      var d = difPct(v), dis = v.estado === "discrepa";
      h += '<div class="lj-blq lj-cmp' + (dis ? " lj-cmp-mal" : "") + '"><span class="rot">' + esc(v.ref.donde === "memoria" ? t(TX.memoria) : v.ref.donde === "simulador" ? t({ es: "En el simulador", en: "In the simulator" }) : t({ es: "En el grupo", en: "In the team doc" })) + '</span> ' +
        '<span class="mono">' + esc(num(v.ref.valor)) + '</span> <span class="tx3">' + esc(v.ref.localizador || "") + '</span> · ' + esc(t(TX.recalc)) + ' <span class="mono">' + esc(num(v.valor)) + '</span>' +
        (d != null ? ' · Δ <span class="mono' + (dis ? " sev-crit" : "") + '">' + esc(num(d, Math.abs(d) >= 1 ? 2 : 4)) + ' %</span>' : '') + (dis ? ' ' + marcaEstado("discrepa") : '') + '</div>';
    } else if (v.memoria) {
      h += '<div class="lj-blq lj-cmp"><span class="rot">' + esc(t(TX.memoria)) + '</span> ' + esc(v.memoria) + '</div>';
    }
    if (v.memoria && v.ref && v.ref.donde !== "memoria") h += '<div class="lj-blq nota"><span class="rot">' + esc(t(TX.memoria)) + '</span> ' + esc(v.memoria) + '</div>';
    if (v.comprueba) {
      h += '<div class="lj-blq"><span class="rot">' + esc(t(TX.comprob)) + '</span> <span class="mono">' + esc(String(v.comprueba.expr || "").replace(/e\[(\d+)\]/g, function (m, i) { return (v.comprueba.entradas || [])[+i] || m; })) + '</span> → ' +
        (v.comprueba.cumple ? '<span class="sev sev-ok">' + esc(t(TX.cumple)) + '</span>' : '<span class="sev sev-crit">' + esc(t(TX.noCumple)) + '</span>') + '</div>';
    }
    if (v.supuesto) h += '<div class="lj-blq"><span class="rot">' + esc(t(TX.supuesto)) + '</span>' + supHTML(v.supuesto) + '</div>';
    if (v.estado === "hueco" && (v.huecos_raiz || []).length && !(v.huecos_raiz.length === 1 && v.huecos_raiz[0] === v.id)) {
      h += '<div class="lj-blq lj-corte"><span class="rot">' + esc(t(TX.seCorta)) + '</span> ' + v.huecos_raiz.map(function (r) {
        var x = V[r] || {};
        return '<button type="button" class="chip lj-chip" data-lj-abrir="' + esc(r) + '" title="' + esc(t(TX.abrir) + (x.supuesto ? " · " + x.supuesto + " " + ((SUP[x.supuesto] || {}).texto || "") : "")) + '">' + esc(r) + (x.supuesto ? ' <span class="tx3">' + esc(x.supuesto) + '</span>' : '') + '</button>';
      }).join(" ") + '</div>';
    }
    if (v.nota) h += '<p class="nota lj-blq"><span class="rot">' + esc(t(TX.nota)) + '</span> ' + esc(v.nota) + '</p>';
    // entradas (recursivo)
    var ent = v.entradas || [];
    if (ent.length) {
      var enRuta = String(ruta || "").split(">");
      h += '<div class="lj-blq lj-ent"><div class="lj-blq-cab"><span class="rot">' + esc(t(TX.entradas)) + ' · ' + ent.length + '</span></div>' + ent.map(function (e) {
        if (enRuta.indexOf(e) >= 0) return '<div class="lj-falta">' + esc(e) + ' ' + esc(t(TX.ciclo)) + '</div>';
        return nodoValor(e, ruta);
      }).join("") + '</div>';
    }
    return h;
  }
  function rellenar(d) {
    var c = d.querySelector(":scope > .lj-c");
    if (!c || c.childNodes.length) return;
    c.innerHTML = cuerpoValor(d.getAttribute("data-lj-v"), d.getAttribute("data-lj-r"));
  }
  document.addEventListener("toggle", function (ev) {
    var d = ev.target;
    if (!d || !d.classList || !d.classList.contains("lj-n")) return;
    var r = d.getAttribute("data-lj-r");
    if (d.open) { ABIERTOS[r] = true; rellenar(d); } else delete ABIERTOS[r];
  }, true);
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-lj-abrir]");
    if (b) { ev.preventDefault(); ev.stopPropagation(); abrirValor(b.getAttribute("data-lj-abrir")); return; }
    b = ev.target.closest && ev.target.closest("[data-lj-elem]");
    if (b) { ev.preventDefault(); ev.stopPropagation(); NOC.seleccionar(b.getAttribute("data-lj-tipo"), b.getAttribute("data-lj-elem")); }
  }, true);

  // ======================================================================== grafo fuente → fórmula → valor (Revisión 11, GRAFICOS)
  // Filas de arriba abajo: orígenes (fuentes externas, de clase, supuestos o huecos; los que llegan por varios pasos, con línea
  // discontinua) → entradas → fórmula (con el supuesto propio al lado) → valor. Clic en una entrada = el grafo se centra en ella
  // (con "volver"); clic en un origen o en la fórmula = su detalle debajo. Tooltips con data-tip (ratón, foco y toque).
  var GLIFO = {
    externa: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z"/>',
    norma: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>',
    fabricante: '<rect x="6" y="6" width="12" height="12"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    clase: '<path d="M3 5.5c3-1 6-1 9 1v13c-3-2-6-2-9-1z"/><path d="M21 5.5c-3-1-6-1-9 1v13c3-2 6-2 9-1z"/>',
    memoria: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    sup: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.6"/><path d="M12 16.8v.4"/>',
    hueco: '<path d="M9 7.5 7.5 6a3.5 3.5 0 0 0-5 5L4 12.5M15 16.5l1.5 1.5a3.5 3.5 0 0 0 5-5L20 11.5"/><path d="M8 2.5v2.5M2.5 8H5M16 21.5V19M21.5 16H19"/>',
    dato: '<path d="M9.5 4 7.5 20M16.5 4l-2 16M4.5 9h15M4 15h15"/>',
    fx: '<path d="M15.5 4.5c-2.5-.8-4 .4-4.5 3L8.5 19.5c-.5 2.2-2 2.8-4 2.2M7 10h8"/>',
    mas: '<path d="M12 6v12M6 12h12"/>'
  };
  function glifo(k, x, y, tam) {
    tam = tam || 16;
    return '<g class="lg-ico lg-ico-' + k + '" transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + (tam / 24).toFixed(3) + ')"><g fill="none" stroke="currentColor" stroke-width="' + (1.5 * 24 / tam).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round">' + (GLIFO[k] || GLIFO.dato) + '</g></g>';
  }
  function glifoHTML(k, tam) {
    tam = tam || 14;
    return '<svg class="lg-ico-h lg-ico-' + k + '" width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (1.5 * 24 / tam).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (GLIFO[k] || "") + '</svg>';
  }
  function claseFuente(tp) { return tp === "externa" ? "externa" : tp === "norma" ? "norma" : tp === "fabricante" ? "fabricante" : tp === "clase" ? "clase" : "memoria"; }
  // orígenes raíz (fuentes de los datos hoja, supuestos y huecos) de un valor, con memo
  var RAIZ = {};
  function raices(vid, pila) {
    if (RAIZ[vid]) return RAIZ[vid];
    var v = V[vid], out = {};
    if (!v) return out;
    pila = pila || {};
    if (pila[vid]) return out;
    pila[vid] = 1;
    if (v.fuente) out["fuente:" + v.fuente.id] = { k: "fuente", id: v.fuente.id, loc: v.fuente.localizador };
    if (v.supuesto) out[(v.estado === "hueco" && !(v.entradas || []).length ? "hueco:" : "sup:") + v.supuesto] = { k: v.estado === "hueco" && !(v.entradas || []).length ? "hueco" : "sup", id: v.supuesto, vid: vid };
    if (!v.fuente && !v.supuesto && !(v.entradas || []).length && v.estado === "hueco") out["hueco:" + vid] = { k: "hueco", id: vid, vid: vid };
    (v.entradas || []).forEach(function (e) { var r = raices(e, pila); Object.keys(r).forEach(function (q) { out[q] = r[q]; }); });
    delete pila[vid];
    RAIZ[vid] = out;
    return out;
  }
  function origenDirecto(x) {
    if (x.fuente) return { k: "fuente", id: x.fuente.id, loc: x.fuente.localizador };
    if (x.supuesto && !(x.entradas || []).length) return { k: x.estado === "hueco" ? "hueco" : "sup", id: x.supuesto, vid: x.id };
    if (x.estado === "hueco" && !(x.entradas || []).length) return { k: "hueco", id: x.id, vid: x.id };
    return null;
  }
  function claveNodo(n) { return n.k + ":" + n.id; }
  function cortar(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + "…" : s; }
  function etiquetaValor(x) { return x.campo && x.campo !== "valor" ? x.campo.replace(/_/g, " ") : (x.elemento || x.id); }
  function textoNodo(n) {
    if (n.k === "valor") {
      var x = V[n.id] || {};
      return { l1: etiquetaValor(x), l2: valorTxt(x) + unidad(x.unidad), tip: x.id + " · " + nombreValor(x) + " = " + valorTxt(x) + unidad(x.unidad) + " · " + t(TX[x.estado] || { es: x.estado, en: x.estado }) + ((x.entradas || []).length ? " · " + t({ es: "clic: ver de dónde sale", en: "click: see where it comes from" }) : ""), ico: x.formula ? "fx" : x.supuesto && !x.fuente ? "sup" : "dato" };
    }
    if (n.k === "fuente") {
      var f = FU[n.id] || { id: n.id };
      return { l1: f.editor || f.id, l2: cortar(f.localizador || f.titulo || f.id, 60), tip: (f.editor ? f.editor + " · " : "") + (f.titulo || f.id) + (f.localizador ? " · " + f.localizador : "") + " · " + (f.verificada ? t(TX.verif) : t(TX.noVerif)), ico: claseFuente(f.tipo) };
    }
    if (n.k === "sup" || n.k === "hueco") {
      var s = SUP[n.id] || {}, xv = n.vid && V[n.vid];
      return { l1: n.k === "hueco" ? t(TX.hueco) : t(TX.supuesto), l2: (SUP[n.id] ? n.id + " · " : "") + cortar(s.texto || s.motivo || (xv ? nombreValor(xv) : n.id), 60), tip: n.id + " · " + (s.texto || s.motivo || "") + (s.fuente_propuesta ? " · " + t(TX.propuesta) + ": " + s.fuente_propuesta : ""), ico: n.k };
    }
    if (n.k === "fx") {
      var fx = FX[n.id] || { id: n.id };
      return { l1: "ƒ " + fx.id + (fx.nombre ? " · " + fx.nombre : ""), l2: fx.expr || "", tip: fx.id + " · " + (fx.nombre || "") + " · " + (fx.expr || "") + (fx.justificacion ? " · " + fx.justificacion : ""), ico: "fx" };
    }
    return { l1: "+" + n.n, l2: t({ es: "entradas más", en: "more inputs" }), tip: "+" + n.n, ico: "mas" };
  }
  function maquetaGrafo(vid) {
    var v = V[vid], filas = [], aristas = [], vistos = {};
    var obj = { k: "valor", id: vid, obj: true };
    function nodo(n) { var c = claveNodo(n); if (!vistos[c]) vistos[c] = n; return vistos[c]; }
    var ent = v.entradas || [];
    if (ent.length) {
      var MAXE = 6, ins = ent.slice(0, MAXE).map(function (id) { return nodo({ k: "valor", id: id }); });
      if (ent.length > MAXE) ins.push({ k: "mas", id: vid + "+", n: ent.length - MAXE });
      var orig = [], MAXO = 6, sobran = 0;
      ins.forEach(function (n) {
        if (n.k !== "valor" || !V[n.id]) return;
        var x = V[n.id], d = origenDirecto(x);
        var lista = d ? [{ n: d, dir: true }] : Object.keys(raices(n.id)).map(function (q) { return { n: raices(n.id)[q], dir: false }; });
        lista.forEach(function (o) {
          var c = claveNodo(o.n);
          if (!vistos[c]) { if (orig.length >= MAXO) { sobran++; return; } orig.push(nodo(o.n)); }
          aristas.push({ a: vistos[c], b: n, ind: !o.dir });
        });
      });
      if (sobran) orig.push({ k: "mas", id: vid + "+o", n: sobran });
      if (orig.length) filas.push(orig);
      filas.push(ins);
      var fila3 = [];
      var fx = v.formula ? nodo({ k: "fx", id: v.formula }) : null;
      if (fx) { fila3.push(fx); ins.forEach(function (n) { aristas.push({ a: n, b: fx }); }); aristas.push({ a: fx, b: obj }); }
      else ins.forEach(function (n) { aristas.push({ a: n, b: obj }); });
      var propio = v.fuente ? { k: "fuente", id: v.fuente.id, loc: v.fuente.localizador } : v.supuesto ? { k: "sup", id: v.supuesto, vid: vid } : null;
      if (propio) { var pn = nodo(propio); if (orig.indexOf(pn) < 0) { fila3.push(pn); aristas.push({ a: pn, b: obj }); } }
      if (fila3.length) filas.push(fila3);
    } else {
      var o = origenDirecto(v) || (v.formula ? { k: "fx", id: v.formula } : null);
      if (o) { var on = nodo(o); filas.push([on]); aristas.push({ a: on, b: obj }); }
    }
    filas.push([obj]);
    // posiciones (ancho fijo del viewBox; el SVG escala al ancho de la ficha)
    var W = 340, bh = 40, gx = 8, gy = 24, y = 6;
    filas.forEach(function (f, fi) {
      var unico = f.length === 1, porLinea = unico ? 1 : Math.min(f.length, 3);
      for (var i = 0; i < f.length; i += porLinea) {
        var trozo = f.slice(i, i + porLinea), n = trozo.length;
        var bw = unico ? (f[0].obj ? 250 : 230) : (W - gx * (porLinea - 1)) / porLinea;
        var anchoT = n * bw + (n - 1) * gx, x0 = (W - anchoT) / 2;
        trozo.forEach(function (nd, j) { nd.x = x0 + j * (bw + gx); nd.y = y; nd.w = bw; nd.h = nd.obj ? 46 : bh; nd.fila = fi; });
        y += (trozo[0].obj ? 46 : bh) + (i + porLinea < f.length ? 8 : gy);
      }
    });
    return { filas: filas, aristas: aristas, W: W, H: y - gy + 10, obj: obj };
  }
  function grafoSVG(vid) {
    var v = V[vid];
    if (!v) return "";
    var G = maquetaGrafo(vid), o = "";
    o += '<svg class="lg-svg" viewBox="0 0 ' + G.W + ' ' + G.H + '" width="100%" role="group" aria-label="' + esc(t(TX.sec) + ": " + nombreValor(v)) + '">' +
      '<defs><marker id="lg-flecha" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="var(--tx3)"/></marker>' +
      '<pattern id="lg-rayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(245,197,24,.35)" stroke-width="2"/></pattern></defs>';
    G.aristas.forEach(function (e) {
      var a = e.a, b = e.b;
      if (a.x == null || b.x == null) return;
      var x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y - 2, ym = (y1 + y2) / 2;
      o += '<path class="lg-ar' + (e.ind ? " lg-ar-ind" : "") + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'C' + x1.toFixed(1) + ' ' + ym.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + ym.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" marker-end="url(#lg-flecha)"/>';
    });
    G.filas.forEach(function (f) {
      f.forEach(function (n) {
        var tx = textoNodo(n), est = n.k === "valor" ? (V[n.id] || {}).estado : n.k === "hueco" ? "hueco" : "";
        var clase = "lg-n lg-" + n.k + (n.obj ? " lg-obj" : "") + (est ? " lg-e-" + est : "") + (n.k === "fuente" ? " lg-f-" + claseFuente((FU[n.id] || {}).tipo) : "");
        var ir = n.k === "valor" && !n.obj ? ' data-lj-gir="' + esc(n.id) + '"' : n.k === "mas" ? "" : ' data-lj-gdet="' + esc(n.k + "|" + n.id + "|" + (n.loc || n.vid || "")) + '"';
        var car = Math.floor((n.w - 34) / 6.2);
        o += '<g class="' + clase + '"' + ir + ' tabindex="0" role="button" aria-label="' + esc(tx.tip) + '" data-tip="' + esc(tx.tip) + '">' +
          '<rect class="lg-r" x="' + n.x.toFixed(1) + '" y="' + n.y.toFixed(1) + '" width="' + n.w.toFixed(1) + '" height="' + n.h + '"/>' +
          (est === "hueco" ? '<rect x="' + n.x.toFixed(1) + '" y="' + n.y.toFixed(1) + '" width="' + n.w.toFixed(1) + '" height="' + n.h + '" fill="url(#lg-rayas)" pointer-events="none"/>' : '') +
          glifo(tx.ico, n.x + 6, n.y + (n.h - 16) / 2, 16) +
          '<text class="lg-t1" x="' + (n.x + 28).toFixed(1) + '" y="' + (n.y + (n.obj ? 19 : 16)).toFixed(1) + '">' + esc(cortar(tx.l1, car)) + '</text>' +
          '<text class="lg-t2" x="' + (n.x + 28).toFixed(1) + '" y="' + (n.y + (n.obj ? 36 : 31)).toFixed(1) + '">' + esc(cortar(tx.l2, car)) + '</text>';
        if (n.k === "valor" && est && est !== "trazado") o += '<text class="lg-tag lg-tag-' + est + '" x="' + (n.x + n.w - 4).toFixed(1) + '" y="' + (n.y + 11).toFixed(1) + '" text-anchor="end">' + esc(t(TX[est])) + '</text>';
        if (n.k === "fuente" && FU[n.id] && !FU[n.id].verificada) o += '<text class="lg-tag lg-tag-nover" x="' + (n.x + n.w - 4).toFixed(1) + '" y="' + (n.y + 11).toFixed(1) + '" text-anchor="end">?</text>';
        if (n.k === "valor" && !n.obj && (V[n.id] || {}).entradas && V[n.id].entradas.length) o += '<text class="lg-mas" x="' + (n.x + n.w - 5).toFixed(1) + '" y="' + (n.y + n.h - 6).toFixed(1) + '" text-anchor="end">▸</text>';
        o += '</g>';
      });
    });
    return o + '</svg>';
  }
  function leyendaGrafo() {
    return '<div class="lg-ley">' + [["externa", { es: "fuente externa", en: "external source" }], ["clase", { es: "material de clase", en: "class material" }],
      ["fx", { es: "fórmula", en: "formula" }], ["sup", TX.supuesto], ["hueco", TX.hueco]].map(function (x) {
      return '<span class="lg-ley-i lg-ico-' + x[0] + '">' + glifoHTML(x[0], 14) + esc(t(x[1])) + '</span>';
    }).join("") + '<span class="lg-ley-i"><svg width="22" height="8" aria-hidden="true"><path d="M0 4H22" class="lg-ar lg-ar-ind"/></svg>' + esc(t({ es: "por varios pasos", en: "via several steps" })) + '</span></div>';
  }
  // contenedor del grafo: navegación propia (pila) dentro de la ficha
  function grafoHTML(vid, pila) {
    pila = pila || [];
    var v = V[vid];
    if (!v) return "";
    var migas = pila.length ? '<button type="button" class="btn lg-volver" data-lj-gvolver="1">← ' + esc(t({ es: "volver", en: "back" })) + '</button><span class="lg-migas tx3">' +
      pila.concat([vid]).map(function (p) { return esc(etiquetaValor(V[p] || { id: p })); }).join(" › ") + '</span>' : '';
    return '<div class="lg-cab">' + marcaEstado(v.estado) + '<b class="lg-tit">' + esc(nombreValor(v)) + '</b>' + migas + '</div>' + grafoSVG(vid) + leyendaGrafo() + '<div class="lg-det"></div>';
  }
  function pintarGrafo(cont, vid, pila) {
    cont.setAttribute("data-lj-g", vid);
    cont.setAttribute("data-lj-pila", JSON.stringify(pila || []));
    cont.innerHTML = grafoHTML(vid, pila);
  }
  function detalleNodo(k, id, extra) {
    if (k === "fuente") return fuenteHTML(id, extra, true);
    if (k === "fx") {
      var f = FX[id] || { id: id }, vars = Object.keys(f.variables || {});
      return '<div class="lj-blq lj-fx"><div class="lj-blq-cab"><span class="rot">' + esc(t(TX.formula)) + '</span> <span class="mono">' + esc(f.id) + '</span> ' + esc(f.nombre || "") + '</div><div class="lj-expr">' + esc(f.expr || "") + '</div>' +
        (vars.length ? '<dl class="lj-vars">' + vars.map(function (q) { var x = f.variables[q] || {}; return '<dt>' + esc(q) + '</dt><dd>' + esc(x.desc || "") + (x.unidad ? ' <span class="lj-u">[' + esc(x.unidad) + ']</span>' : '') + '</dd>'; }).join("") + '</dl>' : '') +
        (f.justificacion ? '<p class="nota lj-just"><span class="rot">' + esc(t(TX.justif)) + '</span> ' + esc(f.justificacion) + '</p>' : '') +
        ((f.refs || []).length ? '<div class="lj-refs"><span class="rot">' + esc(t(TX.refs)) + '</span>' + f.refs.map(function (r) { return fuenteHTML(r); }).join("") + '</div>' : '') + '</div>';
    }
    if (k === "sup" || k === "hueco") return SUP[id] ? supHTML(id) : (V[id] ? '<div class="lj-sup">' + esc(nombreValor(V[id])) + ' · ' + esc(t(TX.hueco)) + (V[id].nota ? '<div class="nota">' + esc(V[id].nota) + '</div>' : '') + '</div>' : '');
    return "";
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-lj-gir], [data-lj-gdet], [data-lj-gvolver], [data-lj-gcampo]");
    if (!b) return;
    var cont = b.closest(".lj-grafo");
    if (!cont) return;
    ev.preventDefault(); ev.stopPropagation();
    var pila = []; try { pila = JSON.parse(cont.getAttribute("data-lj-pila") || "[]"); } catch (e) { pila = []; }
    var act = cont.getAttribute("data-lj-g");
    if (b.hasAttribute("data-lj-gir")) { pila.push(act); pintarGrafo(cont, b.getAttribute("data-lj-gir"), pila); }
    else if (b.hasAttribute("data-lj-gvolver")) { var prev = pila.pop(); if (prev) pintarGrafo(cont, prev, pila); }
    else if (b.hasAttribute("data-lj-gcampo")) {
      var w = b.closest(".lj-gw");
      Array.prototype.forEach.call(w.querySelectorAll("[data-lj-gcampo]"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      pintarGrafo(cont, b.getAttribute("data-lj-gcampo"), []);
    } else {
      var p = b.getAttribute("data-lj-gdet").split("|"), det = cont.querySelector(".lg-det");
      if (det) { var html = detalleNodo(p[0], p[1], p.slice(2).join("|")); det.innerHTML = det.getAttribute("data-k") === b.getAttribute("data-lj-gdet") ? "" : html; det.setAttribute("data-k", det.innerHTML ? b.getAttribute("data-lj-gdet") : ""); }
    }
  }, true);
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    var b = ev.target.closest && ev.target.closest(".lj-grafo [data-lj-gir], .lj-grafo [data-lj-gdet]");
    if (!b) return;
    ev.preventDefault();
    b.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  // bloque de ficha: chips de campo (si hay varios) + grafo
  function bloqueGrafo(lista) {
    if (!lista.length) return "";
    var pref = lista.filter(function (c) { var v = V[c.v]; return v && (v.entradas || []).length; })[0] || lista[0];
    var chips = lista.length > 1 ? '<div class="lg-campos" role="group">' + lista.slice(0, 14).map(function (c) {
      var v = V[c.v] || {};
      return '<button type="button" class="lg-campo lg-c-' + esc(v.estado || "") + '" data-lj-gcampo="' + esc(c.v) + '" aria-pressed="' + (c === pref) + '" title="' + esc(c.v + " · " + t(TX[v.estado] || { es: "", en: "" })) + '">' + esc(c.et) + '</button>';
    }).join("") + (lista.length > 14 ? '<span class="tx3">+' + (lista.length - 14) + '</span>' : '') + '</div>' : '';
    var cont = '<div class="lj-grafo" data-lj-g="' + esc(pref.v) + '" data-lj-pila="[]">' + grafoHTML(pref.v, []) + '</div>';
    return '<div class="lj-gw">' + chips + cont + '</div>';
  }

  // ======================================================================== ficha: "¿De dónde sale?"
  var CAMPOS = {
    zona: ["poblacion", "poblacion_2025", "hogares", "hogares_2025", "hogar_medio", "empresas_2025", "abonados_fijos", "abonados_moviles", "lineas_datos_moviles", "dl_gbps", "ul_gbps"],
    nodo: ["capacidad_gbps", "latencia_ms"],
    enlace: ["capacidad_gbps", "km", "canales_400g", "latencia_ms"]
  };
  function tipoElemento(id) {
    var I = NOC.idx || {};
    if (I.zonas && I.zonas[id]) return "zona";
    if (I.nodos && I.nodos[id]) return "nodo";
    if (I.enlaces && I.enlaces[id]) return "enlace";
    return null;
  }
  function objeto(tipo, id) { var I = NOC.idx || {}; return tipo === "zona" ? (I.zonas || {})[id] : tipo === "nodo" ? (I.nodos || {})[id] : tipo === "enlace" ? (I.enlaces || {})[id] : null; }
  // Claves del índice de un elemento: las suyas, las de sus necesidades (Z-x/…) y las de radio por zona (R-Z-x-n78)
  function clavesDe(id) {
    var out = (CLAVES[id] || []).slice();
    Object.keys(CLAVES).forEach(function (el) {
      if (el !== id && (el.indexOf(id + "/") === 0 || el.indexOf("R-" + id + "-") === 0)) out = out.concat(CLAVES[el]);
    });
    return out;
  }
  // Revisión 8: claves del modelo del usuario (NOC.caso.modelo_usuario, solo LAB) que tocan el elemento
  function modeloUsuario() { return NOC.modo === "lab" && NOC.caso && NOC.caso.modelo_usuario && typeof NOC.caso.modelo_usuario === "object" ? NOC.caso.modelo_usuario : null; }
  function usuarioDe(id) {
    var mu = modeloUsuario(), out = [];
    if (!mu || !id) return out;
    function toca(k) { return k === id || k.indexOf(id + "/") === 0 || k.slice(-(id.length + 1)) === "|" + id; }
    [["factores", "×"], ["prioridades", "prio"], ["perfiles", "24 h"]].forEach(function (g) {
      Object.keys(mu[g[0]] || {}).forEach(function (k) {
        if (!toca(k)) return;
        var v = mu[g[0]][k], pr = (mu.proc || {})[g[0] + "." + k];
        out.push({ clave: g[0] + "." + k, valor: g[0] === "perfiles" ? g[1] : (g[0] === "factores" ? "× " : "") + (esNum(v) ? num(v, 3) : String(v)), f: pr && pr.f ? pr.f : (mu.fuente || mu.nombre || "") });
      });
    });
    return out;
  }
  function bloqueUsuario(id) {
    var us = usuarioDe(id);
    if (!us.length) return "";
    return '<div class="lj-usr dato-usr"><span class="rot">' + esc(t(TX.usuario)) + '</span> ' + us.map(function (u) {
      return '<span class="lj-sin-c" title="' + esc(u.f) + '"><span class="mono">' + esc(u.clave) + '</span> ' + esc(u.valor) + '</span>';
    }).join(" ") + '<div class="nota tx3">' + esc(t(TX.usuarioNota)) + '</div></div>';
  }
  function seccionFicha(sel) {
    var claves = clavesDe(sel.id), tipo = sel.tipo, o = objeto(tipo, sel.id);
    var visto = {};
    claves.forEach(function (c) { if (c.elemento === sel.id) visto[c.campo] = 1; });
    var sin = [];
    if (o) {
      var cand = (CAMPOS[tipo] || []).concat(o.proc && typeof o.proc.t !== "string" ? Object.keys(o.proc) : []);
      cand.forEach(function (k) { if (!visto[k] && esNum(o[k]) && sin.indexOf(k) < 0) sin.push(k); });
    }
    if (!claves.length && !sin.length && !L) return "";
    var h = '<h3>' + esc(t(TX.sec)) + '</h3>' + bloqueUsuario(sel.id);
    if (!L) return h + '<p class="nota tx3">' + esc(t(TX.sinDatos)) + '</p>';
    if (claves.length) {
      var n = { trazado: 0, hueco: 0, discrepa: 0 };
      claves.forEach(function (c) { var v = V[c.v]; if (v) n[v.estado] = (n[v.estado] || 0) + 1; });
      h += '<div class="lj-res"><span class="tx3">' + claves.length + ' ' + esc(t(TX.campos)) + '</span>' +
        ['trazado', 'hueco', 'discrepa'].map(function (e) { return n[e] ? ' ' + marcaEstado(e) + '<span class="mono"> ' + n[e] + '</span>' : ''; }).join("") + '</div>';
      var etq = function (c) { return c.elemento === sel.id ? c.campo : c.elemento.replace(sel.id + "/", "").replace("R-" + sel.id + "-", "") + " · " + c.campo; };
      h += bloqueGrafo(claves.map(function (c) { return { v: c.v, et: etq(c).replace(/_/g, " ") }; }));
      h += '<div class="lj-arbol solo-experto">' + claves.map(function (c) {
        return nodoValor(c.v, sel.id + "|" + c.clave, etq(c));
      }).join("") + '</div>';
    }
    if (sin.length || !claves.length) {
      h += '<div class="lj-sin"><span class="rot">' + esc(t(TX.sinLinaje)) + '</span> ' +
        (sin.length ? sin.map(function (k) { return '<span class="lj-sin-c">' + esc(k) + '</span>'; }).join(" ") : '<span class="tx3">' + esc(sel.id) + '</span>') + '</div>';
    }
    return h;
  }
  var CACHE = { clave: "", el: null };
  function pintarFicha() {
    var cuerpo = document.getElementById("ficha-cuerpo"), sel = NOC.seleccion;
    if (!cuerpo) return;
    var viejo = cuerpo.querySelector(":scope > .lj-ficha");
    if (!sel || !sel.id || sel.tipo === "linaje" || !document.getElementById("ficha").classList.contains("visible")) { if (viejo && sel && sel.tipo !== "linaje") viejo.remove(); return; }
    var clave = sel.tipo + "|" + sel.id + "|" + NOC.lang + "|" + JSON.stringify(usuarioDe(sel.id));
    var el = CACHE.clave === clave && CACHE.el ? CACHE.el : null;
    if (!el) {
      var html = seccionFicha(sel);
      if (!html) { if (viejo) viejo.remove(); return; }
      el = document.createElement("div");
      el.className = "ficha-sec lj-ficha";
      el.setAttribute("data-pl", "linaje");
      el.innerHTML = html;
      CACHE = { clave: clave, el: el };
    }
    if (viejo && viejo !== el) viejo.remove();
    if (el.parentNode !== cuerpo) cuerpo.appendChild(el);
    el.classList.toggle("plegada", NOC.plegado ? NOC.plegado("fs:linaje") : false);
  }
  var abrirOrig = NOC.abrirFicha;
  NOC.abrirFicha = function () {
    var r = abrirOrig.apply(NOC, arguments);
    try { pintarFicha(); } catch (e) { console.error("linaje ficha", e); }
    return r;
  };

  // Ficha de un valor suelto (desde el panel o desde "se corta en")
  function abrirValor(vid) {
    var v = V[vid];
    if (!v) return false;
    NOC.seleccion = { tipo: "linaje", id: vid };
    var tipo = v.elemento ? tipoElemento(v.elemento) : null;
    var usa = (PADRES[vid] || []);
    var html = '<div class="ficha-sec lj-ficha lj-sola" data-pl="linaje"><h3>' + esc(t(TX.sec)) + '</h3>' +
      '<div class="lj-res">' + marcaEstado(v.estado) + ' <span class="mono">' + esc(v.id) + '</span> <span class="tx3">' + esc(v.ambito || "") + '</span>' +
      (tipo ? ' · <a href="#" data-lj-elem="' + esc(v.elemento) + '" data-lj-tipo="' + tipo + '">' + esc(t(TX.verFicha)) + ' ' + esc(v.elemento) + '</a>' : '') + '</div>' +
      bloqueGrafo([{ v: vid, et: nombreValor(v) }]) +
      '<div class="lj-arbol solo-experto">' + nodoValor(vid, "solo", nombreValor(v), true) + '</div>' +
      (usa.length ? '<div class="lj-usa"><span class="rot">' + esc(t(TX.usadoEn)) + ' · ' + usa.length + '</span> ' + usa.slice(0, 30).map(function (p) {
        return '<button type="button" class="chip lj-chip" data-lj-abrir="' + esc(p) + '">' + esc(p) + '</button>';
      }).join(" ") + (usa.length > 30 ? ' <span class="tx3">+' + (usa.length - 30) + '</span>' : '') + '</div>' : '') + '</div>';
    NOC.abrirFicha({ titulo: vid, subtitulo: nombreValor(v) + " · " + valorTxt(v) + unidad(v.unidad) + " · " + t(TX.sec), html: html });
    if (NOC.plegado && NOC.plegado("ficha")) NOC.plegar("ficha", false);
    var c = document.getElementById("ficha-cuerpo");
    if (c) c.scrollTop = 0;
    return true;
  }
  NOC.on("lang", function () { if (NOC.seleccion && NOC.seleccion.tipo === "linaje") abrirValor(NOC.seleccion.id); });

  // ======================================================================== cobertura (por alcance)
  function enAlcance(v, a) {
    if (a === "memoria") return !!v.memoria;
    if (a === "indice") return !!v.elemento;
    return true;
  }
  function cobertura(a) {
    a = a || "memoria";
    var tot = { total: 0, trazado: 0, hueco: 0, discrepa: 0 }, amb = {}, raices = {}, dis = [], conRef = 0;
    if (!L) return { total: tot, ambitos: [], huecos: [], discrepa: [], conRef: 0 };
    L.valores.forEach(function (v) {
      if (!enAlcance(v, a)) return;
      var x = amb[v.ambito || "—"] = amb[v.ambito || "—"] || { id: v.ambito || "—", total: 0, trazado: 0, hueco: 0, discrepa: 0 };
      tot.total++; x.total++;
      tot[v.estado] = (tot[v.estado] || 0) + 1; x[v.estado] = (x[v.estado] || 0) + 1;
      (v.huecos_raiz || []).forEach(function (r) { raices[r] = (raices[r] || 0) + 1; });
      if (v.estado === "discrepa") dis.push(v);
      if (v.ref) conRef++;
    });
    var huecos = Object.keys(raices).map(function (r) { return { id: r, bloquea: raices[r], supuesto: (V[r] || {}).supuesto || null }; })
      .sort(function (p, q) { return q.bloquea - p.bloquea || (p.id < q.id ? -1 : 1); });
    var ambitos = Object.keys(amb).map(function (k) { return amb[k]; }).sort(function (p, q) { return q.total - p.total; });
    return { total: tot, ambitos: ambitos, huecos: huecos, discrepa: dis, conRef: conRef };
  }

  // ======================================================================== vista TRAZABILIDAD
  var EST = { alcance: "memoria", cat: "fuentes", q: "", abierto: null };
  try { var g = JSON.parse(localStorage.getItem("noc.linaje") || "null"); if (g) { if (g.alcance) EST.alcance = g.alcance; if (g.cat) EST.cat = g.cat; } } catch (e) { /* sin almacenamiento */ }
  function guardarEst() { try { localStorage.setItem("noc.linaje", JSON.stringify({ alcance: EST.alcance, cat: EST.cat })); } catch (e) { /* nada */ } }
  var elV = null;
  function pct(n, d) { return d ? n / d * 100 : 0; }
  function barra(x) {
    var tr = pct(x.trazado, x.total), hu = pct(x.hueco, x.total), di = pct(x.discrepa, x.total);
    return '<span class="lj-barra" title="' + esc(t(TX.trazado) + " " + x.trazado + " · " + t(TX.hueco) + " " + x.hueco + " · " + t(TX.discrepa) + " " + x.discrepa) + '">' +
      '<i class="lj-b-ok" style="width:' + tr.toFixed(2) + '%"></i><i class="lj-b-hu" style="width:' + hu.toFixed(2) + '%"></i><i class="lj-b-di" style="width:' + di.toFixed(2) + '%"></i></span>';
  }
  // Revisión 11 (GRAFICOS): cobertura como barra apilada con etiquetas (hueco rayado, discrepa con borde), por ámbito y huecos en barras.
  function barraGrande(x) {
    var seg = [["trazado", "ok", x.trazado], ["hueco", "hu", x.hueco], ["discrepa", "di", x.discrepa || 0]].filter(function (q) { return q[2] > 0; });
    var lbl = seg.map(function (q) { return t(TX[q[0]]) + " " + q[2] + " (" + num(pct(q[2], x.total), 1) + " %)"; }).join(" · ");
    return '<div class="lj-gb" role="img" aria-label="' + esc(t(TX.cobertura) + ": " + lbl) + '">' + seg.map(function (q) {
      var w = pct(q[2], x.total);
      return '<div class="lj-gb-s lj-gb-' + q[1] + '" style="flex:' + Math.max(w, 0.8).toFixed(2) + ' 1 0" data-tip="' + esc(t(TX[q[0]]) + ": " + q[2] + " / " + x.total) + '" tabindex="0">' +
        (w >= 7 ? '<span class="lj-gb-t">' + glifoHTML(q[0] === "trazado" ? "dato" : q[0] === "hueco" ? "hueco" : "sup", 13) + esc(t(TX[q[0]])) + ' <b>' + num(w, 1) + ' %</b></span>' : '') + '</div>';
    }).join("") + '</div><div class="lj-gb-ley">' + seg.map(function (q) {
      return '<span><i class="lj-sw lj-gb-' + q[1] + '"></i>' + esc(t(TX[q[0]])) + ' <b class="mono">' + q[2] + '</b></span>';
    }).join("") + '<span class="tx3">' + esc(t({ es: "de", en: "of" })) + ' ' + x.total + ' ' + esc(t(TX.valores).toLowerCase()) + '</span></div>';
  }
  function barrasAmbito(ambs) {
    return '<div class="lj-ab" role="list">' + ambs.map(function (a) {
      var tr = pct(a.trazado, a.total), hu = pct(a.hueco, a.total), di = pct(a.discrepa || 0, a.total);
      var lbl = a.id + ": " + t(TX.trazado) + " " + num(tr, 1) + " % · " + t(TX.hueco) + " " + a.hueco + " · " + t(TX.discrepa) + " " + (a.discrepa || 0) + " · " + a.total;
      return '<div class="lj-ab-f" role="listitem" tabindex="0" aria-label="' + esc(lbl) + '" data-tip="' + esc(lbl) + '"><span class="lj-ab-n">' + esc(a.id) + '</span>' +
        '<span class="lj-ab-b"><i class="lj-gb-ok" style="width:' + tr.toFixed(2) + '%"></i><i class="lj-gb-hu" style="width:' + hu.toFixed(2) + '%"></i><i class="lj-gb-di" style="width:' + di.toFixed(2) + '%"></i></span>' +
        '<span class="lj-ab-v mono">' + num(tr, 0) + ' %' + (a.hueco ? ' <span class="lj-ab-h">' + glifoHTML("hueco", 11) + a.hueco + '</span>' : '') + '</span></div>';
    }).join("") + '</div>';
  }
  function barrasHuecos(hs) {
    if (!hs.length) return "";
    var top = hs.slice(0, 10), mx = top[0].bloquea || 1;
    return '<div class="lj-hb">' + top.map(function (x) {
      var v = V[x.id] || {}, s = SUP[x.supuesto] || {}, nom = v.elemento ? nombreValor(v) : x.id;
      var lbl = x.id + " · " + nom + " · " + t(TX.bloquea) + " " + x.bloquea + (s.texto ? " · " + s.texto : "");
      return '<button type="button" class="lj-hb-f" data-lj-abrir="' + esc(x.id) + '" aria-label="' + esc(lbl) + '" data-tip="' + esc(lbl) + '">' +
        '<span class="lj-hb-n">' + glifoHTML("hueco", 12) + esc(cortar(nom, 34)) + '</span><span class="lj-hb-b"><i style="width:' + (x.bloquea / mx * 100).toFixed(1) + '%"></i></span><b class="mono">' + x.bloquea + '</b></button>';
    }).join("") + (hs.length > 10 ? '<p class="nota tx3">+' + (hs.length - 10) + ' ' + esc(t(TX.mas)) + '</p>' : '') + '</div>';
  }
  function sec(id, tit, extra, cuerpo) {
    var pl = NOC.plegado("lj:" + id);
    return '<section class="lj-sec' + (pl ? " plegado" : "") + '" data-plegable="lj:' + id + '"><button type="button" class="plg lj-sec-cab" data-plegar="lj:' + id + '" aria-expanded="' + !pl + '">' +
      '<span class="ind">' + (pl ? "▸" : "▾") + '</span>' + esc(t(tit)) + (extra ? ' <span class="lj-cnt">' + extra + '</span>' : '') + '</button><div class="lj-sec-cuerpo">' + cuerpo + '</div></section>';
  }
  function pintarVista() {
    if (!elV) return;
    if (!L) { elV.innerHTML = '<div class="lj-v"><p class="vacio">' + esc(t(TX.sinDatos)) + '</p></div>'; return; }
    var C = cobertura(EST.alcance), T0 = C.total;
    var alc = [["memoria", TX.alcMem], ["indice", TX.alcIdx], ["todos", TX.alcTodos]];
    var cab = '<div class="lj-cab"><span class="lbl">' + esc(t(TX.vista)) + '</span>' +
      '<span class="lj-kpi"><b>' + num(pct(T0.trazado, T0.total), 1) + ' %</b> ' + marcaEstado("trazado") + ' <span class="mono">' + T0.trazado + '/' + T0.total + '</span></span>' +
      '<span class="lj-kpi"><b>' + num(pct(T0.hueco, T0.total), 1) + ' %</b> ' + marcaEstado("hueco") + ' <span class="mono">' + T0.hueco + '</span></span>' +
      '<span class="lj-kpi"><b>' + T0.discrepa + '</b> ' + marcaEstado("discrepa") + '</span>' +
      '<span class="lj-esp"></span><span class="rot">' + esc(t(TX.alcance)) + '</span><span class="seg" role="group">' + alc.map(function (a) {
        return '<button type="button" data-lj-alc="' + a[0] + '" aria-pressed="' + (EST.alcance === a[0]) + '">' + esc(t(a[1])) + '</button>';
      }).join("") + '</span></div>' +
      '<div class="lj-banda nota">' + esc(t(TX.leyenda)) + ' <span class="tx3">' + esc(L.generado_por || "") + ' · ' + esc(L.generado || "") + '</span></div>';
    // cobertura por ámbito
    var hAmb = barraGrande(T0) + barrasAmbito(C.ambitos) + '<table class="tabla lj-tab solo-experto"><thead><tr><th>' + esc(t({ es: "Ámbito", en: "Scope" })) + '</th><th class="n">' + esc(t({ es: "Total", en: "Total" })) +
      '</th><th class="lj-bcol">' + esc(t(TX.cobertura)) + '</th><th class="n">' + esc(t(TX.trazado)) + '</th><th class="n">' + esc(t(TX.hueco)) + '</th><th class="n">' + esc(t(TX.discrepa)) + '</th></tr></thead><tbody>' +
      C.ambitos.map(function (a) {
        return '<tr><td>' + esc(a.id) + '</td><td class="n">' + a.total + '</td><td class="lj-bcol">' + barra(a) + '</td><td class="n">' + num(pct(a.trazado, a.total), 1) + ' %</td><td class="n">' + a.hueco + '</td><td class="n">' + (a.discrepa || 0) + '</td></tr>';
      }).join("") + '</tbody></table>';
    // huecos
    var hHu = barrasHuecos(C.huecos) + '<table class="tabla lj-tab lj-click solo-experto"><thead><tr><th>' + esc(t({ es: "Raíz", en: "Root" })) + '</th><th class="n">' + esc(t(TX.bloquea)) + '</th><th>' + esc(t(TX.supuesto)) + '</th><th>' + esc(t(TX.propuesta)) + '</th></tr></thead><tbody>' +
      C.huecos.map(function (x) {
        var s = SUP[x.supuesto] || {}, v = V[x.id] || {};
        return '<tr data-lj-abrir="' + esc(x.id) + '" title="' + esc(t(TX.abrir)) + '"><td class="mono">' + esc(x.id) + '<div class="tx3 lj-sub">' + esc(nombreValor(v)) + ' = ' + esc(valorTxt(v) + unidad(v.unidad)) + '</div></td><td class="n"><b>' + x.bloquea + '</b></td>' +
          '<td class="txt"><span class="mono">' + esc(x.supuesto || "") + '</span> ' + esc(s.texto || "") + '</td><td class="txt tx2">' + esc(s.fuente_propuesta || "") + '</td></tr>';
      }).join("") + '</tbody></table>';
    // discrepancias
    var hDi = C.discrepa.length ? '<table class="tabla lj-tab lj-click"><thead><tr><th>' + esc(t({ es: "Valor", en: "Value" })) + '</th><th class="n">' + esc(t(TX.memoria)) + '</th><th class="n">' + esc(t(TX.recalc)) + '</th><th class="n">Δ %</th></tr></thead><tbody>' +
      C.discrepa.map(function (v) {
        var d = difPct(v);
        return '<tr data-lj-abrir="' + esc(v.id) + '"><td class="mono">' + esc(v.id) + '<div class="tx3 lj-sub">' + esc(nombreValor(v)) + ' · ' + esc((v.ref || {}).localizador || v.memoria || "") + '</div></td><td class="n">' + esc(num((v.ref || {}).valor)) +
          '</td><td class="n">' + esc(num(v.valor)) + '</td><td class="n sev-crit">' + esc(d == null ? "—" : num(d, 2)) + '</td></tr>';
      }).join("") + '</tbody></table>' : '<p class="nota lj-pad">' + esc(t(TX.ninguna)) + ' <span class="mono">' + C.conRef + '</span> ' + esc(t(TX.conRef)) + '.</p>';
    var izq = sec("cob", TX.porAmbito, T0.total + "", hAmb) + sec("huecos", TX.huecos, C.huecos.length + "", hHu) + sec("dis", TX.discrepancias, C.discrepa.length + "", hDi);
    var cats = [["fuentes", TX.fuentes, (L.fuentes || []).length], ["formulas", TX.formulas, (L.formulas || []).length], ["valores", TX.valores, L.valores.length]];
    var der = '<div class="lj-catcab"><span class="seg" role="tablist">' + cats.map(function (c) {
      return '<button type="button" data-lj-cat="' + c[0] + '" aria-pressed="' + (EST.cat === c[0]) + '">' + esc(t(c[1])) + ' <span class="lj-cnt">' + c[2] + '</span></button>';
    }).join("") + '</span><input type="search" class="lj-q" placeholder="' + esc(t(TX.buscar)) + '" value="' + esc(EST.q) + '" aria-label="' + esc(t(TX.buscar)) + '"></div><div class="lj-cat"></div>';
    elV.innerHTML = '<div class="lj-v">' + cab + '<div class="lj-cuerpo"><div class="lj-izq">' + izq + '</div><div class="lj-der">' + der + '</div></div></div>';
    pintarCatalogo();
  }
  function coincide(q, campos) {
    if (!q) return true;
    var s = campos.join(" ").toLowerCase();
    return q.split(/\s+/).every(function (p) { return s.indexOf(p) >= 0; });
  }
  function pintarCatalogo() {
    var el = elV && elV.querySelector(".lj-cat");
    if (!el) return;
    var q = EST.q.trim().toLowerCase(), h = "", n = 0, MAX = 200;
    if (EST.cat === "fuentes") {
      var fs = (L.fuentes || []).filter(function (f) { return coincide(q, [f.id, f.tipo, f.titulo, f.editor, f.localizador, f.nota, f.url || ""]); });
      n = fs.length;
      h = fs.map(function (f) {
        var u = USOS_F[f.id] || { valores: [], formulas: [] }, ab = EST.abierto === f.id;
        return '<div class="lj-item' + (ab ? " abierto" : "") + '"><button type="button" class="lj-item-cab" data-lj-item="' + esc(f.id) + '"><span class="lj-ftipo">' + esc(tipoFuente(f.tipo)) + '</span>' +
          '<span class="mono">' + esc(f.id) + '</span><span class="lj-item-tit">' + esc(f.editor || "") + ' · ' + esc(f.titulo || "") + '</span>' + marcaVerif(f) +
          '<span class="lj-cnt">' + u.valores.length + 'v · ' + u.formulas.length + 'fx</span></button>' +
          (ab ? '<div class="lj-item-c">' + fuenteHTML(f.id, null, true) + usosHTML(u.valores, u.formulas) + '</div>' : '') + '</div>';
      }).join("");
    } else if (EST.cat === "formulas") {
      var fx = (L.formulas || []).filter(function (f) { return coincide(q, [f.id, f.nombre, f.expr, f.justificacion, (f.refs || []).join(" "), JSON.stringify(f.variables || {})]); });
      n = fx.length;
      h = fx.map(function (f) {
        var u = USOS_FX[f.id] || [], ab = EST.abierto === f.id, vars = Object.keys(f.variables || {});
        return '<div class="lj-item' + (ab ? " abierto" : "") + '"><button type="button" class="lj-item-cab" data-lj-item="' + esc(f.id) + '"><span class="mono">' + esc(f.id) + '</span>' +
          '<span class="lj-item-tit">' + esc(f.nombre || "") + '</span><span class="lj-expr-c">' + esc(f.expr || "") + '</span><span class="lj-cnt">' + u.length + 'v</span></button>' +
          (ab ? '<div class="lj-item-c"><div class="lj-expr">' + esc(f.expr || "") + '</div>' +
            (vars.length ? '<dl class="lj-vars">' + vars.map(function (k) { var x = f.variables[k] || {}; return '<dt>' + esc(k) + '</dt><dd>' + esc(x.desc || "") + (x.unidad ? ' <span class="lj-u">[' + esc(x.unidad) + ']</span>' : '') + '</dd>'; }).join("") + '</dl>' : '') +
            '<p class="nota"><span class="rot">' + esc(t(TX.justif)) + '</span> ' + esc(f.justificacion || "") + '</p>' +
            '<div class="lj-refs"><span class="rot">' + esc(t(TX.refs)) + '</span>' + (f.refs || []).map(function (r) { return fuenteHTML(r); }).join("") + '</div>' + usosHTML(u, []) + '</div>' : '') + '</div>';
      }).join("");
    } else {
      var vs = L.valores.filter(function (v) { return coincide(q, [v.id, v.elemento || "", v.campo || "", v.ambito || "", v.estado, v.tipo, v.formula || "", v.supuesto || "", v.memoria || "", (v.fuente || {}).id || "", v.nota || ""]); });
      n = vs.length;
      h = '<table class="tabla lj-tab lj-click"><thead><tr><th>' + esc(t({ es: "Estado", en: "Status" })) + '</th><th>Id</th><th>' + esc(t({ es: "Elemento · campo", en: "Element · field" })) + '</th><th class="n">' + esc(t({ es: "Valor", en: "Value" })) + '</th><th>' + esc(t({ es: "Tipo", en: "Type" })) + '</th><th>' + esc(t(TX.memoria)) + '</th></tr></thead><tbody>' +
        vs.slice(0, MAX).map(function (v) {
          return '<tr data-lj-abrir="' + esc(v.id) + '"><td>' + marcaEstado(v.estado) + '</td><td class="mono">' + esc(v.id) + '</td><td class="txt">' + esc(v.elemento ? nombreValor(v) : "—") + '</td><td class="n">' + esc(valorTxt(v) + unidad(v.unidad)) +
            '</td><td>' + esc(t(TX[v.tipo] || { es: v.tipo, en: v.tipo })) + (v.formula ? ' <span class="tx3">' + esc(v.formula) + '</span>' : '') + '</td><td class="tx3">' + esc(v.memoria || "") + '</td></tr>';
        }).join("") + '</tbody></table>' + (vs.length > MAX ? '<p class="nota lj-pad">+' + (vs.length - MAX) + ' ' + esc(t(TX.mas)) + '</p>' : '');
    }
    el.innerHTML = '<div class="lj-catn tx3">' + n + ' ' + esc(t(TX.nRes)) + '</div>' + (h || '<p class="vacio">—</p>');
  }
  function usosHTML(vals, fxs) {
    if (!vals.length && !fxs.length) return "";
    return '<div class="lj-usa"><span class="rot">' + esc(t(TX.usadoEn)) + '</span> ' + fxs.map(function (f) { return '<span class="chip">' + esc(f) + '</span>'; }).join(" ") + ' ' +
      vals.slice(0, 40).map(function (p) { var v = V[p] || {}; return '<button type="button" class="chip lj-chip lj-c-' + esc(v.estado || "") + '" data-lj-abrir="' + esc(p) + '">' + esc(p) + '</button>'; }).join(" ") +
      (vals.length > 40 ? ' <span class="tx3">+' + (vals.length - 40) + '</span>' : '') + '</div>';
  }
  function montarVista(el) {
    elV = el;
    el.classList.add("lj-vista");
    el.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-lj-alc]");
      if (b) { EST.alcance = b.getAttribute("data-lj-alc"); guardarEst(); pintarVista(); return; }
      b = ev.target.closest("[data-lj-cat]");
      if (b) { EST.cat = b.getAttribute("data-lj-cat"); EST.abierto = null; guardarEst(); pintarVista(); return; }
      b = ev.target.closest("[data-lj-item]");
      if (b) { var id = b.getAttribute("data-lj-item"); EST.abierto = EST.abierto === id ? null : id; pintarCatalogo(); }
    });
    el.addEventListener("input", function (ev) {
      if (!ev.target.classList.contains("lj-q")) return;
      EST.q = ev.target.value; EST.abierto = null; pintarCatalogo();
    });
    pintarVista();
  }
  NOC.registrarVista({
    id: "trazabilidad", grupo: "datos", titulo: TX.vista,
    montar: montarVista,
    activar: function () { },
    desactivar: function () { }
  });
  NOC.on("lang", function () { CACHE = { clave: "", el: null }; if (elV) pintarVista(); });

  NOC.linaje = {
    datos: L, valor: function (id) { return V[id] || null; }, abrirValor: abrirValor,
    claves: clavesDe, cobertura: cobertura, fuente: function (id) { return FU[id] || null; }, formula: function (id) { return FX[id] || null; }
  };
})();
