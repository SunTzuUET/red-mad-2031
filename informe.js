// informe.js — pinta el informe imprimible que prepara exportar.js (Exportar.informe).
// Datos: 1) postMessage {tipo:"noc-informe", datos} del simulador que abrió la pestaña (se pide con "noc-informe-pide");
//        2) localStorage["noc.informe"] (lo deja el simulador; sirve también al recargar la pestaña).
// informe.html#demo (o #demo-lab) construye el caso REF (o un fallo en LAB) aquí mismo, sin simulador: para pruebas.
(function () {
  "use strict";
  var raiz = document.getElementById("informe"), estado = document.getElementById("estado"), btn = document.getElementById("imprimir");
  var pintado = false, L = "es";
  function t(es, en) { return L === "en" ? en : es; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(x, d) {
    if (x == null || !isFinite(x)) return "—";
    return (window.Exportar && Exportar.numInf) ? Exportar.numInf(x, d, L) : x.toFixed(d == null ? 1 : d);
  }
  btn.addEventListener("click", function () { window.print(); });

  function supIds(s) { return (s || []).map(function (x) { return '<sup class="s">' + esc(x) + "</sup>"; }).join(""); }

  function celda(c, col) {
    var cls = [];
    if (col.num) cls.push("num");
    if (col.ancho) cls.push(col.ancho);
    if (col.rol === "meta") { cls.push("meta"); if (col.k !== "__proc") cls.push("ids"); }
    if (c.t) cls.push("t-" + c.t);
    var x = c.x === "" && c.t === "supuesto" ? "—" : c.x;
    var tit = c.t ? ' title="' + esc(c.t + (c.s && c.s.length ? " " + c.s.join(" ") : "")) + '"' : "";
    return "<td" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") + tit + ">" + esc(x) + (c.s && c.s.length ? supIds(c.s) : "") + "</td>";
  }

  function tabla(tb) {
    var h = '<section class="sec' + (tb.ancha ? " ancha" : "") + '" id="t-' + esc(tb.id) + '"><h2>' + esc(tb.n) + '<span class="n">' + tb.filas.length + " " + t("filas", "rows") + "</span></h2>";
    if (tb.desc) h += '<p class="desc">' + esc(tb.desc) + "</p>";
    if (tb.error) h += '<p class="aviso">' + esc(tb.error) + "</p>";
    if (!tb.filas.length) return h + '<p class="desc">' + t("Sin filas con estos filtros.", "No rows with these filters.") + "</p></section>";
    h += '<div class="envol"><table><thead><tr>' + tb.cols.map(function (c) {
      return "<th" + (c.rol === "meta" ? ' class="meta"' : "") + ">" + esc(c.n) + (c.u ? ' <span class="u">(' + esc(c.u) + ")</span>" : "") + "</th>";
    }).join("") + "</tr></thead><tbody>";
    var trozos = [];
    tb.filas.forEach(function (f) { trozos.push("<tr>" + f.map(function (c, i) { return celda(c, tb.cols[i]); }).join("") + "</tr>"); });
    return h + trozos.join("") + "</tbody></table></div></section>";
  }

  function kpis(m) {
    var r = m.resumen || {}, r0 = m.resumen_ref;
    function d(v, v0, dec, suf) { return r0 && v != null && v0 != null ? "<small>REF " + num(v0, dec) + (suf || "") + "</small>" : ""; }
    var k = [
      [num(r.dl_total_gbps, 1), t("Gbit/s DL total", "Gbit/s total DL"), d(r.dl_total_gbps, r0 && r0.dl_total_gbps, 1)],
      [num(r.pct_servida, 2) + " %", t("demanda servida", "demand served"), d(r.pct_servida, r0 && r0.pct_servida, 2, " %")],
      [num(r.demandas_afectadas, 0) + " / " + num(r.demandas, 0), t("demandas afectadas", "affected demands"), d(r.demandas_afectadas, r0 && r0.demandas_afectadas, 0)],
      [num(r.max_ocupacion != null ? r.max_ocupacion * 100 : null, 1) + " %", t("ocupación máxima", "max occupancy") + (r.enlace_max ? " · " + esc(r.enlace_max) : ""),
        d(r.max_ocupacion, r0 && r0.max_ocupacion != null ? r0.max_ocupacion * 100 : null, 1, " %")],
      [r.supuestos_usados != null ? num(r.supuestos_usados, 0) + " / " + num(m.n_registro, 0) : (m.registro_provisional ? "—" : num(m.n_registro, 0)),
        r.supuestos_usados != null ? t("supuestos usados / registrados", "assumptions used / registered") : t("supuestos registrados", "registered assumptions"), ""]
    ];
    return '<div class="kpis">' + k.map(function (x) { return '<div class="kpi"><b>' + x[0] + "</b><span>" + x[1] + "</span>" + x[2] + "</div>"; }).join("") + "</div>";
  }

  function portada(P) {
    var m = P.meta;
    return '<section class="portada"><div class="proy">RED-MAD 2031 · 5G + FTTH · Comunidad de Madrid</div>' +
      "<h1>" + t("Informe del simulador de red", "Network simulator report") + "</h1>" +
      '<div><span class="modo' + (m.modo === "LAB" ? " lab" : "") + '">' + esc(m.modo) + "</span>" + esc(m.modo_largo) + "</div>" +
      "<dl><dt>" + t("Caso", "Case") + "</dt><dd>" + esc(m.caso || "—") + "</dd>" +
      "<dt>" + t("Fecha", "Date") + "</dt><dd>" + esc(m.fecha) + "</dd>" +
      "<dt>" + t("Datos", "Data") + "</dt><dd>" + esc(m.datos) + "</dd>" +
      (m.ref_doc ? "<dt>" + t("Documento", "Document") + "</dt><dd>" + esc(m.ref_doc) + "</dd>" : "") +
      (m.escenario_proc ? "<dt>" + t("Escenario", "Scenario") + "</dt><dd>" + esc(m.escenario_proc) + "</dd>" : "") +
      "<dt>" + t("Filtros", "Filters") + "</dt><dd>" + esc(m.filtros) + "</dd></dl>" + kpis(m) +
      '<ol class="indice">' + P.tablas.filter(function (tb) { return tb.id !== "supuestos"; }).map(function (tb) { return '<li><a href="#t-' + esc(tb.id) + '">' + esc(tb.n) + "</a> · " + tb.filas.length + "</li>"; }).join("") +
      '<li><a href="#registro">' + t("Registro de supuestos", "Assumption register") + '</a></li><li><a href="#leyenda">' + t("Leyenda de procedencia", "Provenance legend") + "</a></li></ol></section>";
  }

  function registro(P) {
    var m = P.meta, h = '<section class="sec" id="registro"><h2>' + t("Registro de supuestos", "Assumption register") + '<span class="n">' + P.registro.length + "</span></h2>";
    if (m.registro_provisional) h += '<p class="aviso">' + t("Registro provisional: los datos aún no traen RED.supuestos. Se listan los elementos marcados como supuesto, sin S-id.",
      "Provisional register: data has no RED.supuestos yet. Elements flagged as assumptions are listed, without S-id.") + "</p>";
    if (!m.hay_depende) h += '<p class="aviso">' + t("El motor aún no publica de qué supuestos depende cada resultado: «afecta en este caso» solo cuenta los datos.",
      "The engine does not publish result dependencies yet: “affects in this case” counts data only.") + "</p>";
    h += '<p class="desc">' + t("Agrupado por ámbito. «Afecta en este caso» = filas de las tablas de este informe cuyo dato es este supuesto o cuyo resultado depende de él.",
      "Grouped by scope. “Affects in this case” = rows of this report's tables whose data is this assumption or whose result depends on it.") + "</p>";
    var grupos = {}, orden = [];
    P.registro.forEach(function (s) { var a = s.ambito || "—"; if (!grupos[a]) { grupos[a] = []; orden.push(a); } grupos[a].push(s); });
    orden.forEach(function (a) {
      h += '<div class="amb"><h3>' + esc(a) + " · " + grupos[a].length + "</h3>";
      grupos[a].forEach(function (s) {
        var af = Object.keys(s.afecta || {}).map(function (k) {
          var l = s.afecta[k];
          return "<b>" + esc(P.nombres[k] || k) + "</b> " + l.length + (l.length ? " (" + esc(l.slice(0, 6).join(", ")) + (l.length > 6 ? ", …" : "") + ")" : "");
        });
        h += '<div class="sup-ficha' + (af.length || s.usado ? "" : " no-usado") + '"><div class="cab"><span class="id">' + esc(s.id || "—") + '</span><span class="campo">' + esc(s.campo) + "</span>" +
          (s.valor !== "" && s.valor != null ? '<span class="valor">= ' + esc(s.valor) + (s.unidad ? " " + esc(s.unidad) : "") + "</span>" : "") +
          '<span class="estado">' + esc(s.estado) + "</span></div><dl>" +
          (s.elementos && s.elementos.length ? "<dt>" + t("Elementos", "Elements") + "</dt><dd>" + esc(s.elementos.length > 14 ? s.elementos.slice(0, 14).join(", ") + " … (" + s.elementos.length + ")" : s.elementos.join(", ")) + "</dd>" : "") +
          (s.motivo ? "<dt>" + t("Motivo", "Reason") + "</dt><dd>" + esc(s.motivo) + "</dd>" : "") +
          (s.fuente_parcial ? "<dt>" + t("Fuente parcial", "Partial source") + "</dt><dd>" + esc(s.fuente_parcial) + "</dd>" : "") +
          (s.alternativa ? "<dt>" + t("Alternativa", "Alternative") + "</dt><dd>" + esc(s.alternativa) + "</dd>" : "") +
          "<dt>" + t("Afecta en este caso", "Affects in this case") + '</dt><dd class="afecta">' + (af.length ? af.join(" · ") : t("ninguna fila de las tablas elegidas", "no row of the chosen tables")) +
          (s.n_dependen != null ? " · " + s.n_dependen + " " + t("resultados del motor dependen de él", "engine results depend on it") : "") + "</dd></dl></div>";
      });
      h += "</div>";
    });
    return h + "</section>";
  }

  function leyenda() {
    var f = [
      ['<span class="muestra">24,0</span>', "v7", t("Dato de la Entrega 2 (memoria conjunta v7). Sin marca.", "Deliverable 2 data (joint report v7). No mark.")],
      ['<span class="muestra t-anterior" style="display:inline-block">24,0</span>', t("anterior †", "earlier †"), t("Dato de un documento anterior del equipo que la v7 no da.", "Data from an earlier team document not given in v7.")],
      ['<span class="muestra" style="background:var(--rayado)">24,0<sup class="s">S-014</sup></span>', t("supuesto", "assumption"),
        t("Lo pone el simulador porque ningún documento lo da. Fondo rayado y su id S-NNN, que se explica en el registro.", "Set by the simulator because no document gives it. Hatched background and its S-NNN id, explained in the register.")],
      ['<span class="muestra" style="font-style:italic">24,0</span>', t("calculado", "computed"), t("Lo calcula el motor o el generador de demanda para este caso. Cursiva; la columna «Depende de» da los supuestos de los que depende.",
        "Computed by the engine or the demand generator for this case. Italic; the “Depends on” column lists the assumptions it depends on.")],
      ["<b>" + t("Procedencia", "Provenance") + "</b>", "", t("Resumen de la fila: p. ej. «v7 · 1 supuesto · 2 calculados». «por elemento (pendiente de detalle)» = el dato no trae procedencia campo a campo; «todo el elemento» = la procedencia es del elemento entero.",
        "Row summary, e.g. “v7 · 1 assumption · 2 computed”. “per element (field detail pending)” = no field-level provenance; “whole element” = provenance applies to the whole element.")],
      ["<b>" + t("Supuestos", "Assumptions") + "</b>", "", t("S-ids de los datos de la fila que son supuestos.", "S-ids of the row's data that are assumptions.")],
      ["<b>" + t("Depende de", "Depends on") + "</b>", "", t("S-ids de los que dependen los resultados calculados de la fila (demandas que pasan por el elemento, su capacidad y reglas del motor).",
        "S-ids the row's computed results depend on (demands through the element, its capacity and engine rules).")]
    ];
    return '<section class="sec" id="leyenda"><h2>' + t("Leyenda de procedencia", "Provenance legend") + '</h2><div class="envol"><table class="leyenda"><tbody>' +
      f.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td><td>" + x[2] + "</td></tr>"; }).join("") + "</tbody></table></div></section>";
  }

  function pintar(P) {
    if (!P || !P.meta || !Array.isArray(P.tablas)) { raiz.innerHTML = '<p class="error">' + t("Datos de informe no válidos.", "Invalid report data.") + "</p>"; return; }
    pintado = true;
    L = P.lang === "en" ? "en" : "es";
    document.documentElement.lang = L;
    document.title = "RED-MAD 2031 · " + P.meta.modo + " · " + P.meta.fecha;
    document.getElementById("barra-sub").textContent = t("Informe", "Report") + " · " + P.meta.modo + " · " + P.meta.fecha;
    btn.textContent = t("Imprimir / Guardar PDF", "Print / Save as PDF");
    var t0 = Date.now();
    raiz.innerHTML = portada(P) + P.tablas.filter(function (tb) { return tb.id !== "supuestos"; }).map(tabla).join("") + registro(P) + leyenda();
    btn.disabled = false;
    var filas = P.tablas.reduce(function (s, x) { return s + x.filas.length; }, 0);
    estado.textContent = P.tablas.length + " " + t("tablas", "tables") + " · " + filas + " " + t("filas", "rows") + " · " + t("A4; tablas anchas en apaisado", "A4; wide tables in landscape") + " · " + (Date.now() - t0) + " ms";
  }

  // ---- llegada de datos
  window.addEventListener("message", function (ev) {
    if (ev.origin !== location.origin && location.origin !== "null") return;
    if (ev.data && ev.data.tipo === "noc-informe" && ev.data.datos) pintar(ev.data.datos);
  });
  function desdeAlmacen() {
    try { var s = localStorage.getItem("noc.informe"); if (s) { pintar(JSON.parse(s)); return true; } } catch (e) { /* sin almacenamiento */ }
    return false;
  }
  function cargar(src) {
    return new Promise(function (ok, mal) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function () { mal(new Error(src)); }; document.head.appendChild(s); });
  }
  function demo(lab, en) {
    estado.textContent = "demo…";
    ["red.js", "arquitectura_datos.js", "radio_datos.js", "motor.js", "exportar.js"].reduce(function (p, f) { return p.then(function () { return cargar(f); }); }, Promise.resolve()).then(function () {
      var op = { caso: { trafico: "BH", evento: "E-EVENTO" } }, opL = { caso: { trafico: "BH", evento: "E-EVENTO", fallo: ["L-CORE1-METC"] } };
      var R0 = Motor.calcular(RED, op), R = lab ? Motor.calcular(RED, opL) : R0;
      var tablas = {}; Exportar.CATALOGO.forEach(function (c) { tablas[c.id] = c.id !== "n1" || lab; });
      if (/corto/.test(location.hash)) ["demandas", "valores_detallados", "enlaces_servicio", "arquitectura", "flujos", "interfaces", "interconexiones"].forEach(function (k) { tablas[k] = false; });
      pintar(Exportar.informe({ RED: RED, ARQ: window.ARQ, RADIO: window.RADIO, Motor: Motor, resultado: R, referencia: R0, opciones: lab ? opL : op, modo: lab ? "lab" : "ref", lang: en ? "en" : "es",
        caso: { texto: lab ? "LAB · BH · E-EVENTO · fallo L-CORE1-METC" : "REF · Entrega 2 (v7) · hora cargada · evento estadio", trafico: "BH", evento: "E-EVENTO", fallos: lab ? ["L-CORE1-METC"] : [] } },
        Object.assign(Exportar.SEL_DEFECTO(), { tablas: tablas, delta: true })));
    }).catch(function (e) { raiz.innerHTML = '<p class="error">demo: ' + esc(e.message) + "</p>"; });
  }

  var h = location.hash;
  if (/^#demo/.test(h)) { demo(/lab/.test(h), /en/.test(h)); return; }
  // Pedir los datos al simulador (los manda en cuanto los tiene); si no llegan, los del almacén
  if (window.opener) { try { window.opener.postMessage({ tipo: "noc-informe-pide" }, location.origin === "null" ? "*" : location.origin); } catch (e) { /* nada */ } }
  setTimeout(function () {
    if (pintado) return;
    if (!desdeAlmacen()) {
      setTimeout(function () {
        if (!pintado && !desdeAlmacen()) raiz.innerHTML = '<p class="espera">' + t("No hay datos de informe. Ábrelo desde el simulador: EXPORTAR → Informe PDF.", "No report data. Open it from the simulator: EXPORT → PDF report.") + "</p>";
      }, 2500);
    }
  }, 400);
})();
