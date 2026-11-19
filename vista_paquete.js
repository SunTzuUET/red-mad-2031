// vista_paquete.js — "Sigue el paquete": los 14 flujos de arquitectura.json salto a salto, con interfaz, latencia
// acumulada (regla v7: 5 µs/km + 20 µs/salto, §6.4.2) y ocupación actual de cada nodo/enlace del simulador.
// Camino por el anillo: mínimo de saltos y, a igualdad, de km; evita lo que el motor marca como caído (regla "Rutas" v7).
(function () {
  "use strict";
  var NOC = window.NOC, ARQ = window.ARQ, RED = window.RED;
  if (!NOC || !NOC.registrarVista) return;
  function A() { return window.ARQ_VISTAS; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function t(o) { return NOC.t(o); }
  var NE = { es: "no especificado en v7", en: "not specified in v7" };
  var US_KM = 5, US_SALTO = 20, ACC_US = 0;
  var TR = ARQ && ARQ.transporte;
  if (TR) ACC_US = TR.acceso.km * US_KM + TR.acceso.saltos * US_SALTO;
  var DC_DIRECTO = { C: "DCC", N: "DCN", E: "DCN", S: "DCS" };

  var raiz = null;
  var est = { flujo: null, zona: "Z-MADRID", sedeA: "C", sedeB: "E", dc: {} };
  try { var g = JSON.parse(localStorage.getItem("noc.paquete") || "null"); if (g) Object.keys(est).forEach(function (k) { if (g[k] != null) est[k] = g[k]; }); } catch (e) { /* sin almacenamiento */ }
  function guardar() { try { localStorage.setItem("noc.paquete", JSON.stringify(est)); } catch (e) { /* nada */ } }

  // ---------- grafo de transporte v7 ----------
  function caido(tipo, id) { var e = A() && A().estadoRed(tipo, id); return !!(e && e.caido); }
  function nodoRed(k) { return TR.metro[k] ? TR.metro[k].red : TR.dc[k] ? TR.dc[k].red : null; }
  function nombre(k) { return TR.metro[k] ? TR.metro[k].nombre : TR.dc[k] ? TR.dc[k].nombre : k; }
  // Camino mínimo (saltos, luego km) de a hasta b; los DC solo pueden ser extremo, nunca tránsito
  function ruta(a, b) {
    if (a === b) return [];
    var dist = {}, prev = {}, hecho = {}, cola = [a];
    dist[a] = 0;
    if (caido("nodo", nodoRed(a)) || caido("nodo", nodoRed(b))) return null;
    while (cola.length) {
      cola.sort(function (x, y) { return dist[x] - dist[y]; });
      var u = cola.shift();
      if (hecho[u]) continue; hecho[u] = true;
      if (u === b) break;
      if (u !== a && TR.dc[u]) continue;
      TR.tramos.forEach(function (tr) {
        var v = tr.a === u ? tr.b : tr.b === u ? tr.a : null;
        if (!v || hecho[v] || caido("enlace", tr.red) || caido("nodo", nodoRed(v))) return;
        var d = dist[u] + 1000 + tr.km;
        if (dist[v] == null || d < dist[v]) { dist[v] = d; prev[v] = { de: u, tr: tr }; cola.push(v); }
      });
    }
    if (dist[b] == null) return null;
    var out = [], x = b;
    while (x !== a) { out.unshift({ de: prev[x].de, a: x, tr: prev[x].tr }); x = prev[x].de; }
    return out;
  }
  function enlaceEntre(a, b) {
    if (!RED || !a || !b) return null;
    var l = RED.enlaces.filter(function (e) { return (e.a === a && e.b === b) || (e.a === b && e.b === a); })[0];
    return l ? l.id : null;
  }

  // ---------- construcción del recorrido ----------
  function zona(id) { return (RED.zonas || []).filter(function (z) { return z.id === id; })[0] || RED.zonas[0]; }
  function sede(k) { return ARQ.sedes_l2vpn.filter(function (s) { return s.metro === k; })[0]; }
  function opcionesDC(f, met) {
    if (f.dc === "bng") return TR.bng_zona[met] || [];
    if (f.dc === "elegir") return ["DCC", "DCN", "DCS"];
    return f.dc ? [f.dc] : [];
  }
  function contexto(f) {
    var c = { met: f.metro || null, acc: null, accB: null, mb: null, dc: null, edge: f.edge || null };
    if (f.origen === "municipio") { var z = zona(est.zona); c.met = TR.area_metro[z.area]; c.acc = z.agg; c.zona = z; }
    else if (f.origen === "sede") { c.met = est.sedeA; c.mb = est.sedeB; c.acc = sede(est.sedeA).red; c.accB = sede(est.sedeB).red; }
    else if (f.origen) c.acc = f.origen;
    var ops = opcionesDC(f, c.met);
    if (ops.length) {
      var def = f.dc === "elegir" ? DC_DIRECTO[c.met] : ops[0];
      var elegido = est.dc[f.id];
      c.dc = ops.indexOf(elegido) >= 0 ? elegido : def;
      c.dcOps = ops; c.dcDef = def;
    }
    return c;
  }
  function resolver(n, c) {
    if (!n) return null;
    if (n === "@ACC") return c.acc; if (n === "@ACCB") return c.accB;
    if (n === "@MET") return c.met && TR.metro[c.met].red; if (n === "@MB") return c.mb && TR.metro[c.mb].red;
    if (n === "@DC") return c.dc && TR.dc[c.dc].red; if (n === "@EDGE") return c.edge;
    return n;
  }
  // Paso: {el, txt, ifz, us (µs o null), dato: v7|sup|ne|cero, nota, nodo, enlace}
  function recorrer(f, c) {
    var pasos = [], previo = null, err = null;
    function paso(p) { pasos.push(p); previo = p.nodo || previo; }
    function anillo(de, a, s, final) {
      var r = ruta(de, a);
      if (r == null) { err = t({ es: "Sin camino entre ", en: "No path between " }) + nombre(de) + " → " + nombre(a) + t({ es: " con los fallos actuales.", en: " with the current failures." }); return false; }
      r.forEach(function (h, i) {
        var ult = i === r.length - 1, acom = h.tr.tipo === "acometida";
        var us = h.tr.km * US_KM + US_SALTO;
        var p = (ult && final) ? { el: s.el, txt: s.txt, ifz: (s.ifz ? s.ifz + " · " : "") + (acom ? "ACOMETIDA-DC" : "ANILLO") }
          : { el: TR.dc[h.a] ? "DC" : "NODO-METRO", txt: "NODO-METRO " + nombre(h.a) + " (" + t({ es: "tránsito", en: "transit" }) + ")", ifz: acom ? "ACOMETIDA-DC" : "ANILLO" };
        p.us = us; p.dato = "v7"; p.nodo = nodoRed(h.a); p.enlace = h.tr.red;
        p.nota = acom ? t({ es: "acometida Metro–DC: 1 salto, distancia 0 km en la v7", en: "Metro–DC feed: 1 hop, 0 km in v7" })
          : h.tr.km + " km × 5 µs + 20 µs (" + nombre(h.de) + "–" + nombre(h.a) + ")";
        paso(p);
      });
      if (!r.length && final) paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: 0, dato: "cero", nodo: nodoRed(a), nota: t({ es: "mismo nodo", en: "same node" }) });
      return true;
    }
    for (var i = 0; i < f.saltos.length && !err; i++) {
      var s = f.saltos[i], nodo = resolver(s.nodo, c);
      switch (s.t) {
        case "origen":
          paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: 0, dato: "cero", nodo: nodo }); break;
        case "radio": case "local":
          paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: 0, dato: "cero", nodo: nodo,
            nota: s.t === "radio" ? t({ es: "radio aparte (P95 abajo)", en: "radio shown apart (P95 below)" }) : t({ es: "dentro del acceso", en: "within access" }) }); break;
        case "acceso":
          paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: ACC_US, dato: "v7", nodo: nodo, enlace: enlaceEntre(previo, nodo),
            nota: TR.acceso.km + " km × 5 µs + " + TR.acceso.saltos + " × 20 µs" }); break;
        case "dc":
          anillo(c.met, c.dc, s, true); break;
        case "vuelta":
          anillo(c.dc, c.met, s, true); break;
        case "metro_b":
          anillo(c.met, c.mb, s, true); break;
        case "edge":
          var em = TR.edge[c.edge].metro;
          if (em !== c.met && !anillo(c.met, em, s, false)) break;
          paso({ el: s.el, txt: s.txt, ifz: (s.ifz ? s.ifz + " · " : "") + "ACOMETIDA-EDGE", us: US_SALTO, dato: "sup", nodo: nodo,
            enlace: enlaceEntre(TR.metro[em].red, nodo),
            nota: t({ es: "acometida Metro–Edge: 20 µs del salto; distancia no especificada en v7", en: "Metro–Edge feed: 20 µs hop; distance not specified in v7" }) }); break;
        case "uni":
          paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: US_SALTO, dato: "sup", nodo: nodo, enlace: enlaceEntre(previo, nodo),
            nota: t({ es: "UNI sede–PE: 20 µs del salto; km no especificados en v7", en: "Site–PE UNI: 20 µs hop; km not specified in v7" }) }); break;
        default:   // interno, externo
          paso({ el: s.el, txt: s.txt, ifz: s.ifz, us: null, dato: "ne", nodo: nodo,
            nota: s.t === "externo" ? t({ es: "fuera de la red del operador", en: "outside the operator network" }) : t({ es: "dentro del mismo emplazamiento", en: "within the same site" }) });
      }
    }
    return { pasos: pasos, err: err };
  }

  // ---------- pintado ----------
  function ms(us) { return NOC.fmt(us / 1000, 2) + " ms"; }
  function sel(id, ops, valor) {
    return '<select class="sel" data-vp="' + id + '">' + ops.map(function (o) {
      return '<option value="' + esc(o[0]) + '"' + (o[0] === valor ? " selected" : "") + '>' + esc(o[1]) + '</option>';
    }).join("") + '</select>';
  }
  function pintar() {
    if (!raiz) return;
    if (!ARQ || !TR || !A()) { raiz.innerHTML = '<div class="vp-error">arquitectura_datos.js / vista_capas.js ' + esc(t({ es: "no se pudieron cargar", en: "could not be loaded" })) + '</div>'; return; }
    var f = ARQ.flujos.filter(function (x) { return x.id === est.flujo; })[0] || ARQ.flujos[0];
    est.flujo = f.id;
    var c = contexto(f);
    var h = '<div class="vp-cab"><label class="vp-ctl"><span class="rot">' + esc(t({ es: "Flujo", en: "Flow" })) + '</span>' +
      sel("flujo", ARQ.flujos.map(function (x, i) { return [x.id, (i + 1) + " · " + x.servicio]; }), f.id) + '</label>';
    if (f.origen === "municipio") h += '<label class="vp-ctl"><span class="rot">' + esc(t({ es: "Origen", en: "Origin" })) + '</span>' +
      sel("zona", RED.zonas.map(function (z) { return [z.id, z.nombre + " · " + z.area]; }), est.zona) + '</label>';
    else if (f.origen === "sede") {
      var so = ARQ.sedes_l2vpn.map(function (s) { return [s.metro, s.nombre]; });
      h += '<label class="vp-ctl"><span class="rot">' + esc(t({ es: "Sede A", en: "Site A" })) + '</span>' + sel("sedeA", so, est.sedeA) + '</label>' +
        '<label class="vp-ctl"><span class="rot">' + esc(t({ es: "Sede B", en: "Site B" })) + '</span>' + sel("sedeB", so, est.sedeB) + '</label>';
    } else if (f.origen) h += '<span class="vp-ctl"><span class="rot">' + esc(t({ es: "Origen", en: "Origin" })) + '</span><span class="mono">' + esc(f.origen) + '</span></span>';
    if (c.dcOps && c.dcOps.length > 1) h += '<label class="vp-ctl"><span class="rot">DC</span>' +
      sel("dc", c.dcOps.map(function (d) { return [d, TR.dc[d].nombre + (d === c.dcDef ? " *" : "")]; }), c.dc) + '</label>';
    else if (c.dc) h += '<span class="vp-ctl"><span class="rot">DC</span><span class="mono">' + esc(TR.dc[c.dc].nombre) + '</span></span>';
    h += '</div>';

    var r = recorrer(f, c), acum = 0, hayNE = false;
    h += '<div class="vp-camino" role="list">';
    r.pasos.forEach(function (p, i) {
      if (i > 0) {
        var le = p.enlace ? A().estadoRed("enlace", p.enlace) : null;
        h += '<div class="vp-con" aria-hidden="true"><span class="vp-ifz">' + esc(p.ifz || "—") + '</span><span class="vp-flecha"></span>' +
          (p.enlace ? '<span class="vp-enl mono">' + esc(p.enlace) + '</span><span class="vp-oc">' + A().insignia(le) + '</span>' : '<span class="vp-enl"></span>') + '</div>';
      }
      if (p.us == null) hayNE = true; else acum += p.us;
      var ne = p.us == null;
      var cls = p.dato === "v7" ? "dato-doc" : p.dato === "sup" ? "dato-sup" : p.dato === "ne" ? "vp-ne" : "dato-calc";
      var en = p.nodo ? A().estadoRed("nodo", p.nodo) : null;
      h += '<button type="button" class="vp-salto ' + cls + '" role="listitem" data-arq-el="' + esc(p.el) + '">' +
        '<span class="vp-n">' + (i + 1) + '</span><span class="vp-el">' + esc(p.txt) + '</span>' +
        (p.nodo ? '<span class="vp-nodo mono">' + esc(p.nodo) + (en && (en.oc != null || en.caido) ? ' '+ A().insignia(en) : "") + '</span>' : '<span class="vp-nodo arq-ne">' + esc(t({ es: "sin nodo en el simulador", en: "no simulator node" })) + '</span>') +
        '<span class="vp-t mono">' + (ne ? '<span class="arq-ne">+ ' + esc(t(NE)) + '</span>' : "+" + NOC.fmt(p.us, 0) + " µs") + '</span>' +
        '<span class="vp-acum mono">Σ ' + ms(acum) + (hayNE ? " +?" : "") + '</span>' +
        (p.nota ? '<span class="vp-nota">' + esc(p.nota) + '</span>' : "") + '</button>';
    });
    h += '</div>';
    if (r.err) h += '<div class="vp-aviso">' + (NOC.insignia ? NOC.insignia("crit", "CRIT") : "") + ' ' + esc(r.err) + '</div>';

    // Resumen del flujo
    var M = A();
    var reg = TR.regla || {};
    var radio = (ARQ.radio_latencia || []).map(function (b) { return b.banda + " " + NOC.fmt(b.ms, 1) + " ms"; }).join(" · ");
    var res = M.kv([
      [t({ es: "Transporte acumulado", en: "Cumulative transport" }), '<b>' + ms(acum) + '</b>' + (hayNE ? ' + ' + M.ne() : "") + ' ' + M.marca("calc"), "mono"],
      [t({ es: "Regla", en: "Rule" }), M.marca("v7") + ' ' + esc(reg.valor || "") + ' <span class="arq-sec">§' + esc(reg.seccion || "") + '</span>'],
      [t({ es: "Acceso", en: "Access" }), M.marca("v7") + ' ' + esc(TR.acceso.texto) + ' <span class="arq-sec">§' + esc(TR.acceso.seccion) + '</span>'],
      [t({ es: "Radio P95 (ida, aparte)", en: "Radio P95 (one way, apart)" }), radio ? M.marca("ant") + ' ' + esc(radio) : M.ne(), "mono"],
      [t({ es: "Objetivo", en: "Target" }), f.objetivo ? M.marca("v7") + ' ' + esc(f.objetivo.texto) + ' <span class="arq-sec">§' + esc(f.objetivo.seccion) + '</span>' : M.ne()],
      c.dcOps && f.dc === "elegir" ? [t({ es: "DC", en: "DC" }), M.marca("sup") + ' ' + esc(t({ es: "La v7 reparte el tráfico móvil 1/3 por DC; * = DC con acometida directa al Metro de origen.", en: "v7 splits mobile traffic 1/3 per DC; * = DC directly fed from the origin Metro." }))] : null,
      c.dcOps && f.dc === "bng" ? [t({ es: "DC", en: "DC" }), M.marca("v7") + ' ' + esc(t({ es: "BNG activo de la zona (Este 50/50 Norte–Sur).", en: "Active BNG of the zone (East 50/50 North–South)." })) + ' <span class="arq-sec">§6.10.1</span>'] : null,
      [t({ es: "Rutas", en: "Routing" }), M.marca("v7") + ' ' + esc((TR.rutas || {}).valor || "") + (TR.rutas ? ' <span class="arq-sec">§' + esc(TR.rutas.seccion) + '</span>' : "")],
      [t({ es: "Camino documentado", en: "Documented path" }), M.marca("ant") + ' ' + esc((f.camino || []).join(" → ")), "mono"],
      f.respaldo ? [t({ es: "Respaldo", en: "Backup" }), M.marca("ant") + ' ' + esc(M.val(f.respaldo))] : null,
      f.nota_sup ? [t({ es: "Supuesto", en: "Assumption" }), M.marca("sup") + ' ' + esc(f.nota_sup)] : null,
      f.inferido ? [t({ es: "Camino", en: "Path" }), M.marca("sup") + ' ' + esc(t({ es: "deducido de los documentos", en: "inferred from the documents" }))] : null
    ]);
    h += '<div class="vp-res"><div class="vp-res-cab rot">' + esc(t({ es: "Resumen del flujo", en: "Flow summary" })) + '</div>' + res +
      (reg.tex ? '<div class="formula" data-tex="' + esc(reg.tex) + '">' + esc(reg.tex) + '</div>' : "") +
      '<div class="vp-fuente">' + M.fuentes(f.fuente) + '</div>' +
      '<p class="nota">' + esc(t({ es: "Se suma solo el transporte; la radio, el procesado y la cola de la aplicación van aparte. Pulsa un salto para ver su ficha.",
        en: "Only transport is summed; radio, processing and application queueing are separate. Click a hop to see its sheet." })) + '</p></div>';
    raiz.innerHTML = h;
    if (window.katex) Array.prototype.forEach.call(raiz.querySelectorAll("[data-tex]"), function (n) {
      try { window.katex.render(n.getAttribute("data-tex"), n, { throwOnError: false, displayMode: true }); } catch (e) { /* texto plano */ }
    });
  }

  NOC.registrarVista({
    id: "paquete", grupo: "red",
    titulo: { es: "Sigue el paquete", en: "Follow the packet" },
    montar: function (el) {
      raiz = el; el.classList.add("vp");
      el.addEventListener("change", function (ev) {
        var k = ev.target.getAttribute("data-vp"); if (!k) return;
        if (k === "dc") est.dc[est.flujo] = ev.target.value; else est[k] = ev.target.value;
        guardar(); pintar();
      });
      pintar();
    },
    activar: pintar,
    desactivar: function () { }
  });
  NOC.on("resultado", function () { if (raiz && !raiz.hidden) pintar(); });
  NOC.on("lang", function () { if (raiz) pintar(); });
})();
