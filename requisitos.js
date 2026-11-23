// requisitos.js — pestañas SCOM y ARCO de la app mínima: cada requisito del enunciado con su comprobación en el motor.
// Sin DOM: en node exporta el núcleo (test_requisitos.js). En el navegador queda en window.Requisitos.
// El proyecto es conjunto; la separación es solo para plantear qué comprueba cada asignatura.
// Estado: "ok" cumple · "amb" cumple justo o con condiciones · "rojo" no cumple · "gris" no se simula (está en la memoria).
(function (raiz) {
  "use strict";

  var REF = { caso: { trafico: "BH", evento: "E-EVENTO" } };   // hora cargada 2031 de la v7 con partido (= OPC_REF de simple.js)
  var U_AMB = 70, U_ROJO = 90;                                  // v7 §6.4.4: ≤ 70 % en normal, ≤ 90 % con fallo o pico

  // Estado de cada requisito en la matriz de la v7 (Tabla 77, §7.3): DESIGN / CONDITIONED / RISK
  var V7 = {
    ARCO01: "DESIGN", ARCO02: "CONDITIONED", ARCO03: "DESIGN", ARCO04: "CONDITIONED", ARCO05: "DESIGN", ARCO06: "CONDITIONED",
    ARCO07: "CONDITIONED", ARCO08: "CONDITIONED", ARCO09: "CONDITIONED", ARCO10: "CONDITIONED", ARCO11: "CONDITIONED",
    ARCO12: "CONDITIONED", ARCO13: "CONDITIONED", ARCO14: "CONDITIONED", ARCO15: "DESIGN", ARCO16: "CONDITIONED", ARCO17: "DESIGN",
    SCOM01: "CONDITIONED", SCOM02: "CONDITIONED", SCOM03: "CONDITIONED", SCOM04: "CONDITIONED", SCOM05: "CONDITIONED",
    SCOM06: "RISK", SCOM07: "CONDITIONED", SCOM08: "CONDITIONED", SCOM09: "DESIGN", SCOM10: "RISK", SCOM11: "DESIGN"
  };

  // ---------- mejoras propuestas (auditoría 2026-11-21; NO están en la v7) ----------
  // Segunda conexión de cada agregación al nodo Metro vecino del anillo, con la misma capacidad que la principal
  // (mismo criterio que la v7 para Metro-Centro: "cada enlace dimensionado para el total"). km = 1,3 × línea recta (S-014).
  var VECINO = { "MET-CENTRO": "MET-SUR", "MET-NORTE": "MET-CENTRO", "MET-ESTE": "MET-NORTE", "MET-SUR": "MET-CENTRO" };
  function km13(a, b) {
    var r = Math.PI / 180, dl = (b[0] - a[0]) * r, dg = (b[1] - a[1]) * r;
    var x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dg / 2) * Math.sin(dg / 2);
    return Math.round(1.3 * 2 * 6371 * Math.asin(Math.sqrt(x)) * 10) / 10;
  }
  var PROPUESTAS = [
    { id: "doble", es: "Doble conexión de cada municipio", en: "Dual-homing of every municipality",
      porque: { es: "Hoy cada municipio cuelga de un solo nodo Metro: si cae Metro-Centro se pierde Madrid entera.",
        en: "Each municipality hangs from a single Metro node: losing Metro-Centre loses all of Madrid." },
      req: ["SCOM10", "ARCO02", "ARCO08"],
      enlaces: function (RED, N) {
        return RED.enlaces.filter(function (l) { return l.tipo === "backhaul" && /^AGG-/.test(l.a) && VECINO[l.b]; }).map(function (l) {
          var m2 = VECINO[l.b];
          return { id: "L-PROP-" + l.a.slice(4) + "-" + m2.slice(4), a: l.a, b: m2, tipo: "backhaul", capacidad_gbps: l.capacidad_gbps,
            km: km13(N[l.a].coord, N[m2].coord), proteccion: "frr", propuesta: "doble" };
        });
      } },
    { id: "hospital", es: "Segunda acometida del hospital", en: "Second feed for the hospital",
      porque: { es: "La v7 da 99,9998 % al hospital solo con dos acometidas por conductos distintos, y no están diseñadas.",
        en: "v7 gives the hospital 99.9998 % only with two feeds through separate ducts, which are not designed." },
      req: ["ARCO02", "SCOM05"],
      enlaces: function (RED, N) {
        return [{ id: "L-PROP-HOSPITAL-CENTRO", a: "SITE-HOSPITAL-GETAFE", b: "MET-CENTRO", tipo: "acceso", capacidad_gbps: 10,
          km: km13(N["SITE-HOSPITAL-GETAFE"].coord, N["MET-CENTRO"].coord), propuesta: "hospital" }];
      } },
    { id: "evento", es: "Segunda acometida del estadio y Valdebebas", en: "Second feed for the stadium and Valdebebas",
      porque: { es: "Estadio y Valdebebas solo llegan a Metro-Centro.", en: "Stadium and Valdebebas only reach Metro-Centre." },
      req: ["SCOM04", "SCOM07", "SCOM10"],
      enlaces: function (RED, N) {
        return [["SITE-METROPOLITANO", 400], ["SITE-VALDEBEBAS", 10]].map(function (x) {
          return { id: "L-PROP-" + x[0].slice(5) + "-NORTE", a: x[0], b: "MET-NORTE", tipo: "acceso", capacidad_gbps: x[1],
            km: km13(N[x[0]].coord, N["MET-NORTE"].coord), propuesta: "evento" };
        });
      } }
  ];
  // RED con las mejoras activas (copia; red.js no se toca)
  function redCon(RED, activas) {
    var ids = Object.keys(activas || {}).filter(function (k) { return activas[k]; });
    if (!ids.length) return RED;
    var N = {}, r = {}, k;
    RED.nodos.forEach(function (n) { N[n.id] = n; });
    for (k in RED) r[k] = RED[k];
    r.enlaces = RED.enlaces.slice();
    PROPUESTAS.forEach(function (p) { if (activas[p.id]) r.enlaces = r.enlaces.concat(p.enlaces(RED, N)); });
    return r;
  }

  // ---------- utilidades ----------
  function nivel(p, amb, rojo) { return p > (rojo || U_ROJO) ? "rojo" : (p >= (amb || U_AMB) ? "amb" : "ok"); }
  function peor(a, b) { var o = { ok: 0, gris: 0, amb: 1, rojo: 2 }; return o[a] >= o[b] ? a : b; }
  function opc(base, extra) { var o = JSON.parse(JSON.stringify(base)), k; for (k in (extra || {})) o.caso[k] = extra[k]; return o; }
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function esUNI(RED, id) {   // acceso de una sede L2VPN: 10 GbE por UNI es cota superior (v7 §6.9), no demanda medida
    for (var i = 0; i < RED.enlaces.length; i++) { var l = RED.enlaces[i]; if (l.id === id) return l.tipo === "acceso" && (/^SITE-L2VPN/.test(l.a) || /^SITE-L2VPN/.test(l.b)); }
    return false;
  }
  // Ocupación máxima de enlaces sin las UNI L2VPN (y opcionalmente solo de ciertos tipos)
  function maxEnl(RED, r, tipos) {
    var m = 0, id = null, T = {};
    RED.enlaces.forEach(function (l) { T[l.id] = l.tipo; });
    Object.keys(r.enlaces).forEach(function (k) {
      var e = r.enlaces[k];
      if (!e.capacidad_gbps || e.caido || esUNI(RED, k) || (tipos && !tipos[T[k]])) return;
      if (e.ocupacion > m) { m = e.ocupacion; id = k; }
    });
    return { pct: m * 100, id: id };
  }
  function servidaDe(r, filtro) {
    var d = 0, s = 0;
    r.demandas.forEach(function (x) { if (filtro(x) && x.dl_gbps > 1e-9) { d += x.dl_gbps; s += x.servida_gbps; } });
    return d > 0 ? s / d * 100 : 100;
  }
  function padre(x) { return x.padre || x.id; }

  // ---------- comprobaciones ----------
  // Cada una: (ctx) → { estado, cifra:{es,en}, ver:{opc, foco[]} }. ctx = { M, RED, ref (resultado REF), memo(clave, fn) }
  var REQ = [
    // ======== SCOM ========
    { id: "SCOM01", asig: "scom", es: "Fibra FTTH ≥ 1G / 10G", en: "FTTH ≥ 1G / 10G", parte: "fibra",
      fn: function (c) {
        var t = c.ref.acceso.por_tec.ftth || {}, u = t.util_max_pct || 0;
        return { estado: nivel(u), cifra: { es: "PON más cargado " + f1(u) + " %", en: "Busiest PON " + f1(u) + " %" }, ver: { opc: REF, foco: [] } };
      } },
    { id: "SCOM02", asig: "scom", es: "Anillo WDM metro", en: "WDM metro ring", parte: "transporte",
      fn: function (c) {
        var n = maxEnl(c.RED, c.ref, { wdm: 1 }), peorC = null;
        ["E-CORTE-CN", "E-CORTE-NE", "E-CORTE-ES", "E-CORTE-SC"].forEach(function (e) {
          var esc = c.RED.escenarios.filter(function (x) { return x.id === e; })[0]; if (!esc) return;
          var r = c.calc(opc(REF, { fallo: esc.fallos })), m = maxEnl(c.RED, r, { wdm: 1 });
          if (!peorC || m.pct > peorC.pct) peorC = { pct: m.pct, srv: r.resumen.pct_servida, fallos: esc.fallos, id: m.id };
        });
        var est = peor(nivel(n.pct), peorC ? nivel(peorC.pct, U_ROJO, 100) : "ok");
        if (peorC && peorC.srv < 99.99) est = "rojo";
        return { estado: est, cifra: { es: "normal " + f1(n.pct) + " % · peor corte " + f1(peorC.pct) + " %", en: "normal " + f1(n.pct) + " % · worst cut " + f1(peorC.pct) + " %" },
          ver: { opc: opc(REF, { fallo: peorC.fallos }), foco: peorC.fallos.concat([peorC.id]) } };
      } },
    { id: "SCOM03", asig: "scom", es: "Radio 5G macro y small cells", en: "5G macro and small-cell RAN", parte: "radio",
      fn: function (c) {
        var m = 0, tec = "";
        ["n28", "n78", "n258"].forEach(function (t) { var x = c.ref.acceso.por_tec[t]; if (x && x.util_max_pct > m) { m = x.util_max_pct; tec = t; } });
        return { estado: nivel(m), cifra: { es: "sector más cargado " + f1(m) + " % (" + tec + ")", en: "busiest sector " + f1(m) + " % (" + tec + ")" }, ver: { opc: REF, foco: [] } };
      } },
    { id: "SCOM04", asig: "scom", es: "Evento ≥ 50 000 usuarios", en: "Event ≥ 50,000 users", parte: "radio",
      fn: function (c) {
        var s = servidaDe(c.ref, function (x) { return /^S-ESTADIO/.test(padre(x)); }), e = c.ref.nodos["EDGE-CENTRO"] || {};
        var a = c.ref.enlaces["L-SITEMETROPOLITANO-METCENTRO"] || {}, ed = (e.ocupacion || 0) * 100, ac = (a.ocupacion || 0) * 100;
        var est = s < 99.99 ? "rojo" : peor(nivel(ed), nivel(ac));
        return { estado: est, cifra: { es: "servido " + f1(s) + " % · Edge " + f1(ed) + " % · acometida " + f1(ac) + " %",
          en: "served " + f1(s) + " % · Edge " + f1(ed) + " % · feed " + f1(ac) + " %" }, ver: { opc: REF, foco: ["EDGE-CENTRO", "L-SITEMETROPOLITANO-METCENTRO"] } };
      } },
    { id: "SCOM05", asig: "scom", es: "Indoor (hospital)", en: "Indoor (hospital)", parte: "radio",
      fn: function (c) {
        var f = ["L-SITEHOSPITALGETAFE-METSUR"], r = c.calc(opc(REF, { fallo: f }));
        var s = servidaDe(r, function (x) { return /^S-HOSPITAL/.test(padre(x)); });
        return { estado: s < 99.99 ? "rojo" : "amb", cifra: { es: "corte de su acometida: " + f1(s) + " % servido", en: "feed cut: " + f1(s) + " % served" },
          nota: { es: "La radio indoor (RRH, pisos) está en la memoria, no en el simulador.", en: "Indoor radio (RRH, floors) is in the report, not the simulator." },
          ver: { opc: opc(REF, { fallo: f }), foco: f.concat(["SITE-HOSPITAL-GETAFE"]) } };
      } },
    { id: "SCOM06", asig: "scom", es: "Corredor V2X (A-2)", en: "V2X corridor (A-2)", parte: "radio",
      fn: function (c) {
        var o = { caso: { trafico: "BH", evento: "E-PUNTA-A2" } }, r = c.calc(o);
        var d = r.demandas.filter(function (x) { return padre(x) === "S-V2X-A2"; })[0] || {};
        var ok = d.estado === "ok", lat = d.latencia_ms;
        return { estado: ok ? "amb" : "rojo", cifra: { es: "transporte " + f1(lat || 0) + " ms · " + (ok ? "cumple" : d.estado), en: "transport " + f1(lat || 0) + " ms · " + (ok ? "meets" : d.estado) },
          nota: { es: "La v7 lo marca RISK: 7 emplazamientos no aguantan N−1 (la radio no se simula).", en: "v7 marks it RISK: 7 sites do not withstand N−1 (radio not simulated)." },
          ver: { opc: o, foco: ["EDGE-ESTE"] } };
      } },
    { id: "SCOM07", asig: "scom", es: "IoT ≥ 100 000 dispositivos", en: "IoT ≥ 100,000 devices", parte: "radio",
      fn: function (c) {
        var o = { caso: { trafico: "BH", evento: "E-ALARMA-VALDEBEBAS" } }, r = c.calc(o);
        var s = servidaDe(r, function (x) { return /^S-VALDEBEBAS/.test(padre(x)); }), u = (r.acceso.por_tec.iot || {}).util_max_pct || 0;
        return { estado: s < 99.99 ? "rojo" : nivel(u), cifra: { es: "alarma masiva: " + f1(s) + " % servido · celda IoT " + f1(u) + " %", en: "mass alarm: " + f1(s) + " % served · IoT cell " + f1(u) + " %" },
          ver: { opc: o, foco: ["SITE-VALDEBEBAS"] } };
      } },
    { id: "SCOM08", asig: "scom", es: "Satélite / NTN de emergencia", en: "Emergency satellite / NTN", parte: "nucleo",
      fn: function (c) {
        var esc = c.RED.escenarios.filter(function (x) { return x.id === "E-INCIDENTE-NTN"; })[0];
        if (!esc) return { estado: "gris", cifra: { es: "sin escenario", en: "no scenario" }, ver: { opc: REF, foco: [] } };
        var r = c.calc({ escenario: esc.id }), s = servidaDe(r, function (x) { return padre(x) === "S-NTN-EMERGENCIA"; });
        return { estado: s < 99.99 ? "rojo" : "ok", cifra: { es: "incidente: " + f1(s) + " % del tráfico satelital", en: "incident: " + f1(s) + " % of satellite traffic" },
          ver: { opc: { escenario: esc.id }, foco: ["IX-ONEWEB"] } };
      } },
    { id: "SCOM09", asig: "scom", es: "Dimensionado: hora cargada y pico", en: "Sizing: busy hour and peak", parte: "transporte",
      fn: function (c) {
        var a = maxEnl(c.RED, c.ref), p = c.calc({ caso: { trafico: "P2", evento: "E-EVENTO" } }), b = maxEnl(c.RED, p);
        return { estado: peor(nivel(a.pct), nivel(b.pct, U_ROJO, 100)),
          cifra: { es: "hora cargada " + f1(a.pct) + " % · pico P2 " + f1(b.pct) + " %", en: "busy hour " + f1(a.pct) + " % · P2 peak " + f1(b.pct) + " %" },
          nota: { es: "Las UNI L2VPN (10 GbE, cota superior de la v7 §6.9) no cuentan.", en: "L2VPN UNIs (10 GbE, v7 §6.9 upper bound) are not counted." },
          ver: { opc: { caso: { trafico: "P2", evento: "E-EVENTO" } }, foco: [b.id] } };
      } },
    { id: "SCOM10", asig: "scom", es: "Continuidad ante fallos", en: "Continuity under failures", parte: "transporte",
      fn: function (c) {
        var b = c.memo("n1", function () { return c.M.barridoN1(c.RED, REF); }), w = b[0];
        var est = w.pct_servida >= 99.99 ? "ok" : (w.pct_servida >= 95 ? "amb" : "rojo");
        return { estado: est, cifra: { es: "peor fallo único: " + w.nombre + " → " + f1(w.pct_servida) + " %", en: "worst single failure: " + w.nombre + " → " + f1(w.pct_servida) + " %" },
          ver: { opc: opc(REF, { fallo: [w.id] }), foco: [w.id] } };
      } },
    { id: "SCOM11", asig: "scom", es: "Evolución a 5 años", en: "Five-year evolution", parte: "transporte",
      fn: function (c) {
        var o = { caso: { trafico: { id: "BH", anio: 2035 }, evento: "E-EVENTO", fallo: [] } }, r = c.calc(o), m = maxEnl(c.RED, r);
        return { estado: nivel(m.pct), cifra: { es: "en 2035: " + f1(m.pct) + " % en el más cargado", en: "in 2035: " + f1(m.pct) + " % on the busiest" },
          ver: { opc: o, foco: [m.id] } };
      } },

    // ======== ARCO ========
    { id: "ARCO01", asig: "arco", es: "Arquitectura integrada", en: "Integrated architecture", parte: "todo",
      fn: function (c) {
        return { estado: "gris", cifra: { es: c.RED.nodos.length + " nodos · " + c.RED.enlaces.length + " enlaces", en: c.RED.nodos.length + " nodes · " + c.RED.enlaces.length + " links" },
          nota: { es: "Vistas física/virtual y plano de gestión: en la memoria.", en: "Physical/virtual views and management plane: in the report." }, ver: { opc: REF, foco: [] } };
      } },
    { id: "ARCO02", asig: "arco", es: "Disponibilidad ≥ 99,99 %", en: "Availability ≥ 99.99 %", parte: "nucleo",
      fn: function (c) {
        var d = c.memo("disp", function () { return c.M.disponibilidad(c.RED, REF); });
        var red = d.red.disponibilidad_pct, h = (d.especiales["S-HOSPITAL-CRITICO"] || {}).disponibilidad_pct;
        var est = red < 99.99 ? "rojo" : (h != null && h < 99.999 ? "amb" : "ok");
        var s0 = d.sucesos[0] || {};
        return { estado: est, cifra: { es: "red " + red.toFixed(3) + " % · hospital " + (h != null ? h.toFixed(4) : "—") + " %",
          en: "network " + red.toFixed(3) + " % · hospital " + (h != null ? h.toFixed(4) : "—") + " %" },
          nota: { es: "Lo que más resta: " + (s0.id || "—") + " (" + f1(s0.contribucion_min_anio || 0) + " min/año).", en: "Largest contributor: " + (s0.id || "—") + " (" + f1(s0.contribucion_min_anio || 0) + " min/year)." },
          ver: { opc: s0.elementos ? opc(REF, { fallo: s0.elementos }) : REF, foco: s0.elementos || [] } };
      } },
    { id: "ARCO03", asig: "arco", es: "2 DC + 3 Edge con respaldo", en: "2 DCs + 3 Edges with failover", parte: "nucleo",
      fn: function (c) {
        var dcs = c.RED.nodos.filter(function (n) { return n.tipo === "core"; }), eds = c.RED.nodos.filter(function (n) { return n.tipo === "edge"; });
        var w = null;
        dcs.concat(eds).forEach(function (n) {
          var r = c.calc(opc(REF, { fallo: [n.id] })), s = r.resumen.pct_servida;
          if (!w || s < w.s) w = { s: s, id: n.id, nombre: n.nombre };
        });
        var est = dcs.length < 2 || eds.length < 3 ? "rojo" : (w.s >= 99.99 ? "ok" : (w.s >= 95 ? "amb" : "rojo"));
        return { estado: est, cifra: { es: dcs.length + " DC · " + eds.length + " Edge · peor caída " + f1(w.s) + " %", en: dcs.length + " DCs · " + eds.length + " Edges · worst loss " + f1(w.s) + " %" },
          nota: { es: "Peor: " + w.nombre + ". Estado y replicación entre DC: en la memoria.", en: "Worst: " + w.nombre + ". State and replication between DCs: in the report." },
          ver: { opc: opc(REF, { fallo: [w.id] }), foco: [w.id] } };
      } },
    { id: "ARCO04", asig: "arco", es: "Voz IMS / VoNR e interconexión", en: "IMS / VoNR voice and interconnect", parte: "nucleo",
      fn: function (c) {
        var i = c.ref.acceso.nucleo.IMS, r = c.calc(opc(REF, { fallo: ["CORE-1"] })), i1 = r.acceso.nucleo.IMS;
        return { estado: peor(nivel(i.util_pct), nivel(i1.util_pct, U_ROJO, 100)),
          cifra: { es: "IMS " + f1(i.util_pct) + " % · sin un DC " + f1(i1.util_pct) + " %", en: "IMS " + f1(i.util_pct) + " % · one DC down " + f1(i1.util_pct) + " %" },
          nota: { es: "Interconexión con operador CS excluida (instrucción del profesor, 13/10): anexarla.", en: "CS operator interworking excluded (lecturer's instruction, 13/10): attach it." },
          ver: { opc: opc(REF, { fallo: ["CORE-1"] }), foco: ["IX-IMS", "CORE-1"] } };
      } },
    { id: "ARCO05", asig: "arco", es: "Voz fija 0,3 Erl · 900 s · 40/60", en: "Fixed voice 0.3 Erl · 900 s · 40/60", parte: "nucleo",
      fn: function (c) {
        var i = c.ref.acceso.nucleo.IMS;
        return { estado: "amb", cifra: { es: Math.round(i.caps) + " intentos/s de " + i.capacidad_caps + " (" + f1(i.util_pct) + " %)",
          en: Math.round(i.caps) + " attempts/s of " + i.capacidad_caps + " (" + f1(i.util_pct) + " %)" },
          nota: { es: "Sin Erlang B ni GoS; 0,3 Erl leído como originado (1,6A). Justificar.", en: "No Erlang B or GoS; 0.3 Erl read as originated (1.6A). Justify." },
          ver: { opc: REF, foco: ["IX-IMS"] } };
      } },
    { id: "ARCO06", asig: "arco", es: "Clases de tráfico y congestión", en: "Traffic classes and congestion", parte: "todo",
      fn: function (c) {
        var o = { caso: { trafico: "P2", evento: "E-EVENTO-ESTRES" } }, r = c.calc(o);
        var p1 = servidaDe(r, function (x) { return x.prioridad <= 2; }), be = servidaDe(r, function (x) { return x.prioridad >= 5; });
        return { estado: p1 >= 99.99 ? "ok" : "rojo", cifra: { es: "pico + estrés: críticos " + f1(p1) + " % · best-effort " + f1(be) + " %",
          en: "peak + stress: critical " + f1(p1) + " % · best-effort " + f1(be) + " %" },
          nota: { es: "TV/streaming sin dimensionar y QoE sin objetivos (memoria).", en: "TV/streaming not sized and QoE without targets (report)." },
          ver: { opc: o, foco: [] } };
      } },
    { id: "ARCO07", asig: "arco", es: "L2VPN entre 4 sedes", en: "L2VPN across 4 sites", parte: "fibra",
      fn: function (c) {
        var sedes = c.RED.nodos.filter(function (n) { return /^SITE-L2VPN/.test(n.id); });
        var s = servidaDe(c.ref, function (x) { return /^S-L2VPN/.test(padre(x)); });
        var f = ["L-SITEL2VPNCENTRO-METCENTRO"], r = c.calc(opc(REF, { fallo: f }));
        var s1 = servidaDe(r, function (x) { return /^S-L2VPN/.test(padre(x)); });
        return { estado: s < 99.99 ? "rojo" : (s1 < 99.99 ? "amb" : "ok"), cifra: { es: sedes.length + " sedes · " + f1(s) + " % · corte de una sede " + f1(s1) + " %",
          en: sedes.length + " sites · " + f1(s) + " % · one site cut " + f1(s1) + " %" },
          nota: { es: "Un solo PE por sede (sin multihoming hasta duplicar Metro-Centro).", en: "One PE per site (no multihoming until Metro-Centre is duplicated)." },
          ver: { opc: opc(REF, { fallo: f }), foco: f } };
      } },
    { id: "ARCO08", asig: "arco", es: "IP/MPLS con FRR sobre WDM", en: "IP/MPLS with FRR over WDM", parte: "transporte",
      fn: function (c) {
        var w = null;
        c.RED.enlaces.filter(function (l) { return (l.tipo === "wdm" || l.tipo === "mpls") && !/^EDGE-/.test(l.a); }).forEach(function (l) {
          var r = c.calc(opc(REF, { fallo: [l.id] })), s = r.resumen.pct_servida, m = maxEnl(c.RED, r).pct;
          if (!w || s < w.s || (s === w.s && m > w.m)) w = { s: s, m: m, id: l.id };
        });
        return { estado: w.s < 99.99 ? "rojo" : nivel(w.m, U_ROJO, 100), cifra: { es: "peor corte de tramo: " + f1(w.s) + " % servido, máx " + f1(w.m) + " %",
          en: "worst span cut: " + f1(w.s) + " % served, max " + f1(w.m) + " %" },
          nota: { es: "Interconexión externa (BGP, IXP) y escalabilidad: sin dimensionar en la memoria.", en: "External interconnect (BGP, IXP) and scalability: not sized in the report." },
          ver: { opc: opc(REF, { fallo: [w.id] }), foco: [w.id] } };
      } },
    { id: "ARCO09", asig: "arco", es: "5G Core SA (UPF)", en: "5G SA Core (UPF)", parte: "nucleo",
      fn: function (c) {
        var u = c.ref.acceso.nucleo.UPF.util_pct, p = c.calc({ caso: { trafico: "P2", evento: "E-EVENTO" } }).acceso.nucleo.UPF.util_pct;
        return { estado: peor(nivel(u), nivel(p, U_ROJO, 100)), cifra: { es: "UPF central " + f1(u) + " % · pico P2 " + f1(p) + " %", en: "central UPF " + f1(u) + " % · P2 peak " + f1(p) + " %" },
          ver: { opc: REF, foco: ["CORE-1", "CORE-2", "CORE-3"] } };
      } },
    { id: "ARCO10", asig: "arco", es: "≥ 3 slices", en: "≥ 3 slices", parte: "nucleo",
      fn: function (c) {
        var ks = Object.keys(c.ref.sla).filter(function (k) { return k !== "sin_slice" && k !== "fijo-bng"; });
        var ok = ks.filter(function (k) { return c.ref.sla[k].cumple; }).length;
        return { estado: ks.length < 3 ? "rojo" : (ok === ks.length ? "ok" : "amb"), cifra: { es: ks.length + " slices · " + ok + " cumplen SLA", en: ks.length + " slices · " + ok + " meet SLA" },
          nota: { es: "Aislamiento (VAL-04) sin probar.", en: "Isolation (VAL-04) not tested." }, ver: { opc: REF, foco: [] } };
      } },
    { id: "ARCO11", asig: "arco", es: "MEC con continuidad", en: "MEC with continuity", parte: "nucleo",
      fn: function (c) {
        var e = (c.ref.nodos["EDGE-CENTRO"].ocupacion || 0) * 100, f = ["EDGE-CENTRO"], r = c.calc(opc(REF, { fallo: f }));
        var s = servidaDe(r, function (x) { return x.destino === "edge" || /EDGE/.test(x.destino_nodo || ""); });
        return { estado: peor(nivel(e), s >= 99.99 ? "ok" : "amb"), cifra: { es: "Edge-Centro " + f1(e) + " % · si cae, MEC servido " + f1(s) + " %",
          en: "Edge-Centre " + f1(e) + " % · if lost, MEC served " + f1(s) + " %" },
          nota: { es: "La v7 (§6.7) solo respalda el 60 % del estadio en Edge-Este. Orquestación y SSC: en la memoria.", en: "v7 (§6.7) only backs up 60 % of the stadium on Edge-East. Orchestration and SSC: in the report." },
          ver: { opc: opc(REF, { fallo: f }), foco: ["EDGE-CENTRO", "EDGE-ESTE"] } };
      } }
  ];
  // Requisitos que el simulador no comprueba (solo memoria)
  [["ARCO12", "Gestión (OSS/NOC)", "Management (OSS/NOC)"], ["ARCO13", "≥ 3 servicios Open Gateway", "≥ 3 Open Gateway services"],
   ["ARCO14", "Red 5G privada", "Private 5G network"], ["ARCO15", "Tradicional vs SDN/NFV", "Traditional vs SDN/NFV"],
   ["ARCO16", "Seguridad extremo a extremo", "End-to-end security"], ["ARCO17", "Evolución 5G-A / IMT-2030", "5G-A / IMT-2030 evolution"]
  ].forEach(function (x) {
    REQ.push({ id: x[0], asig: "arco", es: x[1], en: x[2], parte: "todo",
      fn: function () { return { estado: "gris", cifra: { es: "en la memoria", en: "in the report" }, ver: { opc: REF, foco: [] } }; } });
  });
  REQ.forEach(function (q) { q.v7 = V7[q.id] || null; });

  // Evalúa los requisitos de una asignatura ("scom" | "arco") con la RED dada (ya con mejoras si las hay)
  function evaluar(M, RED, asig) {
    var cache = {}, memo = {};
    var ctx = { M: M, RED: RED,
      calc: function (o) { var k = JSON.stringify(o); return cache[k] || (cache[k] = M.calcular(RED, o)); },
      memo: function (k, fn) { return k in memo ? memo[k] : (memo[k] = fn()); } };
    ctx.ref = ctx.calc(REF);
    return REQ.filter(function (q) { return !asig || q.asig === asig; }).map(function (q) {
      var r;
      try { r = q.fn(ctx); } catch (e) { r = { estado: "gris", cifra: { es: "error: " + e.message, en: "error: " + e.message }, ver: { opc: REF, foco: [] } }; }
      r.id = q.id; r.asig = q.asig; r.nombre = { es: q.es, en: q.en }; r.parte = q.parte; r.v7 = q.v7;
      return r;
    });
  }

  var API = { REF: REF, V7: V7, REQ: REQ, PROPUESTAS: PROPUESTAS, redCon: redCon, evaluar: evaluar, maxEnl: maxEnl, esUNI: esUNI };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Requisitos = API;
})(typeof window !== "undefined" ? window : this);
