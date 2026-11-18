// Motor de PRUEBA para el visor. Solo se usa si motor.js no define window.Motor.
// Cumple el contrato de PLAN.md de forma simplificada (Dijkstra por latencia + reparto voraz).
(function () {
  "use strict";
  function lat(e) { return e.latencia_ms != null ? e.latencia_ms : (e.km || 0) * 0.005; }
  function nlat(n) { return n && n.latencia_ms != null ? n.latencia_ms : 0.05; }

  function demandasBase(RED, esc, hora, factoresExtra) {
    var f = {}, k;
    var fe = (esc && esc.factores) || {};
    for (k in fe) f[k] = fe[k];
    for (k in (factoresExtra || {})) f[k] = (f[k] != null ? f[k] : 1) * factoresExtra[k];
    function fac(ids) {
      var m = 1;
      ids.forEach(function (i) { if (f[i] != null) m *= f[i]; });
      return m;
    }
    function perfil(p) { var a = RED.perfiles[p]; return a ? a[hora] : 1; }
    var out = [];
    (RED.zonas || []).forEach(function (z) {
      (z.necesidades || []).forEach(function (n) {
        out.push({ id: n.id, zona: z.id, origen: z.agg, destinoTipo: n.destino, edge: z.edge, tipo: n.tipo,
          prioridad: n.prioridad || 5, slice: n.slice, latencia_max_ms: n.latencia_max_ms,
          dl_gbps: n.dl_gbps * perfil(n.perfil) * fac([z.id, n.id, "tipo:" + n.tipo]) });
      });
    });
    (RED.servicios || []).forEach(function (s) {
      out.push({ id: s.id, zona: s.zona, origen: s.nodo, destinoTipo: s.destino, edge: s.edge, tipo: "servicio",
        prioridad: s.prioridad || 5, slice: s.slice, latencia_max_ms: s.latencia_max_ms,
        dl_gbps: s.dl_gbps * perfil(s.perfil) * fac([s.zona, s.id, "tipo:servicio"]) });
    });
    return out;
  }

  function dijkstra(RED, caidos, origen) {
    var dist = {}, prev = {}, prevL = {}, vis = {};
    var nodos = {};
    RED.nodos.forEach(function (n) { nodos[n.id] = n; });
    if (!nodos[origen] || caidos[origen]) return { dist: dist, prev: prev, prevL: prevL };
    dist[origen] = nlat(nodos[origen]);
    while (true) {
      var u = null, best = Infinity;
      for (var id in dist) if (!vis[id] && dist[id] < best) { best = dist[id]; u = id; }
      if (u === null) break;
      vis[u] = true;
      RED.enlaces.forEach(function (e) {
        if (caidos[e.id]) return;
        var v = e.a === u ? e.b : (e.b === u ? e.a : null);
        if (!v || caidos[v] || !nodos[v]) return;
        var d = dist[u] + lat(e) + nlat(nodos[v]);
        if (dist[v] == null || d < dist[v]) { dist[v] = d; prev[v] = u; prevL[v] = e.id; }
      });
    }
    return { dist: dist, prev: prev, prevL: prevL };
  }

  function camino(dj, destino) {
    if (dj.dist[destino] == null) return null;
    var r = [destino], l = [], c = destino;
    while (dj.prev[c] != null) { l.unshift(dj.prevL[c]); c = dj.prev[c]; r.unshift(c); }
    return { ruta: r, enlaces: l, latencia: dj.dist[destino] };
  }

  function enrutar(RED, caidos, d) {
    var nodos = {};
    RED.nodos.forEach(function (n) { nodos[n.id] = n; });
    var dj = dijkstra(RED, caidos, d.origen);
    var cores = RED.nodos.filter(function (n) { return n.tipo === "core" && !caidos[n.id]; });
    function mejorCore() {
      var b = null;
      cores.forEach(function (c) { if (dj.dist[c.id] != null && (!b || dj.dist[c.id] < dj.dist[b])) b = c.id; });
      return b;
    }
    var dest;
    if (d.destinoTipo === "edge") {
      dest = d.edge;
      if (!dest || caidos[dest]) {
        var resp = dest && nodos[dest] && nodos[dest].respaldo;
        dest = resp && !caidos[resp] ? resp : mejorCore();
      }
    } else dest = mejorCore();
    var c = dest ? camino(dj, dest) : null;
    return { destino: dest, c: c };
  }

  function calcular(RED, opt) {
    opt = opt || {};
    var esc = null;
    (RED.escenarios || []).forEach(function (e) { if (e.id === opt.escenario) esc = e; });
    var hora = opt.hora != null ? opt.hora : (esc ? esc.hora : 21);
    var fallos = ((esc && esc.fallos) || []).concat(opt.fallos || []);
    var caidos = {};
    fallos.forEach(function (f) { caidos[f] = true; });
    var dems = demandasBase(RED, esc, hora, opt.factores);
    var res = { demandas: [], enlaces: {}, nodos: {}, zonas: {}, resumen: {} };
    RED.enlaces.forEach(function (e) {
      res.enlaces[e.id] = { carga_gbps: 0, capacidad_gbps: e.capacidad_gbps, ocupacion: 0, caido: !!caidos[e.id], demandas: [] };
    });
    RED.nodos.forEach(function (n) {
      res.nodos[n.id] = { carga_gbps: 0, capacidad_gbps: n.capacidad_gbps, ocupacion: 0, caido: !!caidos[n.id], demandas: [], absorbe_de: [] };
    });
    dems.sort(function (a, b) { return a.prioridad - b.prioridad || a.dl_gbps - b.dl_gbps; });
    dems.forEach(function (d) {
      var r = enrutar(RED, caidos, d);
      var base = enrutar(RED, {}, d);
      var out = { id: d.id, zona: d.zona, origen: d.origen, destino_nodo: r.destino, tipo: d.tipo,
        prioridad: d.prioridad, slice: d.slice, dl_gbps: d.dl_gbps, servida_gbps: 0, ruta: [], enlaces: [],
        latencia_ms: null, latencia_max_ms: d.latencia_max_ms, via: "principal", estado: "caido" };
      if (r.c) {
        out.ruta = r.c.ruta; out.enlaces = r.c.enlaces; out.latencia_ms = r.c.latencia;
        if (!base.c || base.destino !== r.destino || base.c.enlaces.join() !== r.c.enlaces.join()) out.via = "respaldo";
        if (base.destino && base.destino !== r.destino && res.nodos[r.destino] &&
            res.nodos[r.destino].absorbe_de.indexOf(base.destino) < 0) res.nodos[r.destino].absorbe_de.push(base.destino);
        var resid = Infinity;
        out.enlaces.forEach(function (l) { var x = res.enlaces[l]; if (x.capacidad_gbps != null) resid = Math.min(resid, x.capacidad_gbps - x.carga_gbps); });
        out.ruta.forEach(function (n) { var x = res.nodos[n]; if (x.capacidad_gbps != null) resid = Math.min(resid, x.capacidad_gbps - x.carga_gbps); });
        var s = Math.max(0, Math.min(d.dl_gbps, resid));
        out.servida_gbps = s;
        out.enlaces.forEach(function (l) { res.enlaces[l].carga_gbps += s; res.enlaces[l].demandas.push(d.id); });
        out.ruta.forEach(function (n) { res.nodos[n].carga_gbps += s; res.nodos[n].demandas.push(d.id); });
        if (d.dl_gbps > 0 && s < 0.99 * d.dl_gbps) out.estado = "degradado";
        else if (d.latencia_max_ms != null && out.latencia_ms > d.latencia_max_ms) out.estado = "latencia";
        else out.estado = "ok";
      }
      res.demandas.push(out);
    });
    var tot = 0, serv = 0, sat = [], afect = 0;
    Object.keys(res.enlaces).forEach(function (k) {
      var x = res.enlaces[k];
      x.ocupacion = x.capacidad_gbps ? x.carga_gbps / x.capacidad_gbps : 0;
      if (x.ocupacion >= 0.9 && !x.caido) sat.push(k);
    });
    Object.keys(res.nodos).forEach(function (k) {
      var x = res.nodos[k];
      x.ocupacion = x.capacidad_gbps ? x.carga_gbps / x.capacidad_gbps : 0;
    });
    res.demandas.forEach(function (d) {
      tot += d.dl_gbps; serv += d.servida_gbps;
      if (d.estado !== "ok") afect++;
      var z = res.zonas[d.zona] || (res.zonas[d.zona] = { dl_gbps: 0, servida_gbps: 0, pct: 1, necesidades: {} });
      z.dl_gbps += d.dl_gbps; z.servida_gbps += d.servida_gbps;
      z.necesidades[d.id] = { dl_gbps: d.dl_gbps, servida_gbps: d.servida_gbps, estado: d.estado };
    });
    Object.keys(res.zonas).forEach(function (k) { var z = res.zonas[k]; z.pct = z.dl_gbps ? z.servida_gbps / z.dl_gbps : 1; });
    var alertas = [{ nivel: "info", texto: "Motor de prueba (motor_stub.js): resultados orientativos." }];
    sat.forEach(function (k) { alertas.push({ nivel: "aviso", texto: "Enlace " + k + " por encima del 90 %." }); });
    res.demandas.forEach(function (d) {
      if (d.estado === "caido") alertas.push({ nivel: "grave", texto: d.id + " sin ruta." });
    });
    res.resumen = { dl_total_gbps: tot, servida_gbps: serv, pct_servida: tot ? serv / tot : 1,
      enlaces_saturados: sat, demandas_afectadas: afect, alertas: alertas };
    return res;
  }

  function serieDiaria(RED, o) {
    o = o || {};
    var s = [];
    for (var h = 0; h < 24; h++) {
      var r = calcular(RED, { escenario: o.escenario, hora: h, fallos: o.fallos, factores: o.factores });
      var mx = 0, id = null;
      for (var k in r.enlaces) if (r.enlaces[k].ocupacion > mx) { mx = r.enlaces[k].ocupacion; id = k; }
      s.push({ hora: h, dl_total_gbps: r.resumen.dl_total_gbps, servida_gbps: r.resumen.servida_gbps,
        pct_servida: r.resumen.pct_servida, max_ocupacion: mx, enlace_max: id });
    }
    return s;
  }

  function puntosUnicosFallo(RED) {
    var out = [];
    RED.nodos.concat(RED.enlaces).forEach(function (el) {
      var r = calcular(RED, { escenario: null, hora: 21, fallos: [el.id] });
      var af = r.demandas.filter(function (d) { return d.estado === "caido"; }).map(function (d) { return d.id; });
      if (af.length) out.push({ id: el.id, afecta: af });
    });
    return out;
  }

  var M = { calcular: calcular, serieDiaria: serieDiaria, puntosUnicosFallo: puntosUnicosFallo, esStub: true };
  if (typeof module !== "undefined" && module.exports) module.exports = M;
  else if (!window.Motor) window.Motor = M;
})();
