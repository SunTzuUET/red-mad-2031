// vista_interconexion.js — INTERCONEXIÓN de RED-MAD 2031: una fila por interconexión (Internet/IXP, IMS–IMS con
// IBCF/TrGW, NTN OneWeb, Open Gateway/CAMARA, red privada industrial, roaming, L2VPN, CS) con punto físico, protocolo,
// capacidad, qué pasa si falla, ocupación actual y fuente. Clic: ficha. Datos: window.ARQ (memoria conjunta v7 manda).
(function () {
  "use strict";
  var NOC = window.NOC, ARQ = window.ARQ;
  if (!NOC || !NOC.registrarVista) return;
  function A() { return window.ARQ_VISTAS; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function t(o) { return NOC.t(o); }
  var NODIM = { es: "no dimensionada en v7", en: "not sized in v7" };
  var NE = { es: "no especificado en v7", en: "not specified in v7" };
  var NOMBRE = {
    "IX-INTERNET": { es: "Internet / IXP", en: "Internet / IXP" }, "IX-IMS": { es: "IMS–IMS (IBCF/TrGW)", en: "IMS–IMS (IBCF/TrGW)" },
    "IX-CS": { es: "Red CS / PSTN", en: "CS network / PSTN" }, "IX-L2VPN": { es: "L2VPN empresa", en: "Enterprise L2VPN" },
    "IX-SAT": { es: "NTN OneWeb", en: "NTN OneWeb" }, "IX-ROAMING": { es: "Roaming", en: "Roaming" },
    "IX-PRIV": { es: "Red privada industrial", en: "Private industrial network" }, "IX-OPENGW": { es: "Open Gateway / CAMARA", en: "Open Gateway / CAMARA" }
  };
  var ORDEN = ["IX-INTERNET", "IX-IMS", "IX-SAT", "IX-OPENGW", "IX-PRIV", "IX-ROAMING", "IX-L2VPN", "IX-CS"];
  function lista() {
    return ARQ.interconexiones.slice().sort(function (a, b) {
      var ia = ORDEN.indexOf(a.id), ib = ORDEN.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  }
  function porId(id) { return ARQ.interconexiones.filter(function (x) { return x.id === id; })[0]; }

  // Capacidad: la de la v7 si la da; si no, "no dimensionada en v7"
  function capacidad(x) {
    var M = A();
    if (x.v7 && x.v7.capacidad && x.v7.capacidad !== "—" && !/^no dimensionad/i.test(x.v7.capacidad))
      return { html: M.marca("v7") + ' ' + esc(x.v7.capacidad), cls: "dato-doc" };
    if (x.v7 && /^no dimensionad/i.test(x.v7.capacidad || "")) return { html: M.marca("v7") + ' ' + esc(x.v7.capacidad), cls: "dato-doc" };
    if (x.capacidad) return { html: M.marca("ant") + ' ' + esc(M.val(x.capacidad)) + ' · <span class="arq-ne">' + esc(t(NODIM)) + '</span>', cls: "" };
    return { html: '<span class="arq-ne">' + esc(t(NODIM)) + '</span>', cls: "" };
  }
  function siFalla(x) {
    var M = A(), s = x.si_falla;
    if (!s) return { html: '<span class="arq-ne">' + esc(t(NE)) + '</span>', cls: "" };
    if (s.v7) return { html: M.marca("v7") + ' ' + esc(s.texto) + ' <span class="arq-sec">§' + esc(s.seccion) + '</span>', cls: "dato-doc" };
    return { html: M.marca(s.inferido ? "sup" : "ant") + ' ' + esc(s.texto), cls: s.inferido ? "dato-sup" : "" };
  }
  function fuenteCorta(x) {
    var f = (x.v7 ? [{ doc: ARQ.referencia.doc, seccion: x.v7.seccion, v7: true }] : []).concat(x.fuente || []);
    if (!f.length) return A().marca("sup");
    return f.map(function (y) { return (y.v7 ? "v7 §" : "") + (y.v7 ? y.seccion : y.doc + (y.seccion ? " " + y.seccion : "")); }).join("; ");
  }

  // ---------- ficha ----------
  function ficha(id) {
    var x = porId(id), M = A(); if (!x || !M) return null;
    var cap = capacidad(x), sf = siFalla(x);
    var h = '<div data-arq-ficha="ix:' + esc(id) + '">';
    h += M.sec(t({ es: "Qué es", en: "What it is" }), M.kv([
      [t({ es: "Red externa", en: "External network" }), M.marca("ant") + ' ' + esc(x.red_externa)],
      x.v7 ? [t({ es: "En la v7", en: "In v7" }), M.marca("v7") + ' ' + esc(x.v7.dato) + ' <span class="arq-sec">§' + esc(x.v7.seccion) + '</span>'] : [t({ es: "En la v7", en: "In v7" }), M.ne()],
      [t({ es: "Estado", en: "Status" }), x.excluida ? '<span class="marca ant">' + esc(t({ es: "EXCLUIDA DEL ALCANCE", en: "OUT OF SCOPE" })) + '</span>' : '<span class="marca doc">' + esc(t({ es: "EN EL DISEÑO", en: "IN DESIGN" })) + '</span>'],
      [t({ es: "Elementos", en: "Elements" }), (x.elementos || []).map(function (e) { return '<a href="#" class="arq-enl" data-arq-el="' + esc(e) + '">' + esc(e) + '</a>'; }).join(" · ") || M.ne()]
    ]));
    h += M.sec(t({ es: "Punto físico y protocolo", en: "Physical point and protocol" }), M.kv([
      [t({ es: "Punto físico", en: "Physical point" }), x.punto_fisico ? M.marca("ant") + ' ' + esc(x.punto_fisico) : M.ne()],
      [t({ es: "Protocolo", en: "Protocol" }), x.protocolo ? M.marca("ant") + ' ' + esc(x.protocolo) : M.ne()]
    ]));
    h += M.sec(t({ es: "Capacidad", en: "Capacity" }), '<div class="' + cap.cls + '">' + cap.html + '</div>');
    h += M.sec(t({ es: "Protección y qué pasa si falla", en: "Protection and failure impact" }), M.kv([
      [t({ es: "Protección", en: "Protection" }), x.proteccion ? M.marca("ant") + ' ' + esc(M.val(x.proteccion)) : M.ne()],
      [t({ es: "Si falla", en: "If it fails" }), sf.html]
    ]));
    h += M.sec(t({ es: "Carga actual (simulador)", en: "Current load (simulator)" }), '<div data-arq-carga-ficha>' + M.cargaRed({ nodos: x.red.nodos, enlaces: x.red.enlaces }) + '</div>');
    var fs = (x.v7 ? [{ doc: ARQ.referencia.doc, seccion: x.v7.seccion, v7: true }] : []).concat(x.fuente || []);
    if (x.si_falla && x.si_falla.v7) fs.push({ doc: ARQ.referencia.doc, seccion: x.si_falla.seccion, v7: true });
    h += M.sec(t({ es: "Fuente", en: "Source" }), M.fuentes(fs));
    h += M.sec(t({ es: "Para pensar", en: "To think about" }), M.preguntas(x.preguntas));
    return { titulo: t(NOMBRE[id] || { es: id, en: id }), subtitulo: id + " · " + t({ es: "interconexión", en: "interconnection" }), html: h + '</div>' };
  }

  // ---------- tabla ----------
  var raiz = null;
  function pintar() {
    if (!raiz) return;
    if (!ARQ || !A()) { raiz.innerHTML = '<div class="vi-error">arquitectura_datos.js / vista_capas.js ' + esc(t({ es: "no se pudieron cargar", en: "could not be loaded" })) + '</div>'; return; }
    var M = A(), s = NOC.seleccion;
    var h = '<div class="vi-cab"><span class="rot">' + esc(t({ es: "Interconexiones con redes externas · Entrega 2 (v7)", en: "Interconnections with external networks · Deliverable 2 (v7)" })) + '</span>' +
      '<span class="vi-n mono">' + ARQ.interconexiones.length + '</span></div>' +
      '<table class="tabla vi-tabla"><thead><tr><th>' + esc(t({ es: "Interconexión", en: "Interconnection" })) + '</th><th>' + esc(t({ es: "Punto físico", en: "Physical point" })) +
      '</th><th>' + esc(t({ es: "Protocolo", en: "Protocol" })) + '</th><th>' + esc(t({ es: "Capacidad", en: "Capacity" })) + '</th><th>' +
      esc(t({ es: "Si falla", en: "If it fails" })) + '</th><th>' + esc(t({ es: "Ocup. actual", en: "Current util." })) + '</th><th>' + esc(t({ es: "Fuente", en: "Source" })) + '</th></tr></thead><tbody>';
    lista().forEach(function (x) {
      var cap = capacidad(x), sf = siFalla(x);
      var tieneRed = x.red.nodos.length || x.red.enlaces.length;
      h += '<tr data-id="' + esc(x.id) + '" data-arq-ix="' + esc(x.id) + '" class="' + (x.excluida ? "vi-excl" : "") + (s && s.tipo === "interconexion" && s.id === x.id ? " sel" : "") + '">' +
        '<td class="txt vi-nom"><span class="mono">' + esc(x.id) + '</span><br>' + esc(t(NOMBRE[x.id] || { es: x.red_externa, en: x.red_externa })) +
        (x.excluida ? ' <span class="marca ant">' + esc(t({ es: "EXCLUIDA", en: "EXCLUDED" })) + '</span>' : "") + '</td>' +
        '<td class="txt">' + (x.punto_fisico ? esc(x.punto_fisico) : '<span class="arq-ne">' + esc(t(NE)) + '</span>') + '</td>' +
        '<td class="txt">' + (x.protocolo ? esc(x.protocolo) : '<span class="arq-ne">' + esc(t(NE)) + '</span>') + '</td>' +
        '<td class="txt ' + cap.cls + '">' + cap.html + '</td>' +
        '<td class="txt ' + sf.cls + '">' + sf.html + '</td>' +
        '<td class="vi-oc" data-vi-oc="' + esc(x.id) + '">' + (tieneRed ? M.celdaCarga(x.red.nodos, x.red.enlaces) : '<span class="arq-ne">—</span>') + '</td>' +
        '<td class="txt vi-fte mono">' + esc(fuenteCorta(x)) + '</td></tr>';
    });
    h += '</tbody></table><p class="nota vi-pie">' + esc(t({ es: "Marcas: E2 v7 = memoria conjunta v7; DOC. ANTERIOR = inventarios de grupo previos; SUPUESTO = deducido. Pulsa una fila para ver la ficha.",
      en: "Marks: E2 v7 = joint report v7; EARLIER DOC. = earlier group inventories; ASSUMPTION = inferred. Click a row for its sheet." })) + '</p>';
    raiz.innerHTML = h;
  }
  function actualizarCargas() {
    if (!raiz || !ARQ || !A()) return;
    Array.prototype.forEach.call(raiz.querySelectorAll("[data-vi-oc]"), function (n) {
      var x = porId(n.getAttribute("data-vi-oc"));
      if (x && (x.red.nodos.length || x.red.enlaces.length)) n.innerHTML = A().celdaCarga(x.red.nodos, x.red.enlaces);
    });
  }
  function marcarSel() {
    if (!raiz) return;
    var s = NOC.seleccion;
    Array.prototype.forEach.call(raiz.querySelectorAll("tr[data-arq-ix]"), function (r) {
      r.classList.toggle("sel", !!(s && s.tipo === "interconexion" && s.id === r.getAttribute("data-arq-ix")));
    });
  }

  if (window.ARQ_VISTAS) window.ARQ_VISTAS.registrarFicha("ix", ficha);
  NOC.registrarVista({
    id: "interconexion", grupo: "datos",
    titulo: { es: "Interconexión", en: "Interconnection" },
    montar: function (el) { raiz = el; el.classList.add("vi"); pintar(); },
    activar: function () { actualizarCargas(); marcarSel(); },
    desactivar: function () { }
  });
  NOC.on("resultado", actualizarCargas);
  NOC.on("seleccion", marcarSel);
  NOC.on("lang", pintar);
})();
