// Motor de cálculo del simulador de red (Proyecto 2 Madrid, SCOM + ARCO).
// Sin dependencias ni build. Funciona en navegador (window.Motor) y en node (module.exports).
// Contrato y reglas del modelo: ver PLAN.md.
var Motor = (function () {
  "use strict";

  var LAT_NODO = 0.05;   // ms por nodo si no trae latencia_ms
  var KM_MS = 0.005;     // ms por km de fibra
  var EPS = 1e-9;

  // ---------- utilidades ----------
  function num(v, d) { return (typeof v === "number" && isFinite(v)) ? v : d; }
  function esCap(c) { return typeof c === "number" && isFinite(c); }

  function fmt(x, dec) {
    var s = (Math.round(x * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
    return s.replace(".", ",");
  }
  function fmtG(x) { return fmt(x, Math.abs(x) >= 10 ? 0 : 1); }
  function fmtMs(x) { var a = Math.abs(x); return (x >= 0 ? "+" : "") + fmt(x, a >= 10 ? 0 : a >= 1 ? 1 : 2) + " ms"; }

  function haversineKm(c1, c2) {
    if (!c1 || !c2) return 0;
    var R = 6371, rad = Math.PI / 180;
    var dLat = (c2[0] - c1[0]) * rad, dLon = (c2[1] - c1[1]) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(c1[0] * rad) * Math.cos(c2[0] * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  function nombreNodo(G, id) { var n = G.nodos[id]; return (n && n.nombre) || id; }

  // ---------- grafo ----------
  function construirGrafo(RED) {
    var nodos = {}, ordenNodos = [], enlaces = [], enlacePorId = {}, adj = {}, pares = {};
    (RED.nodos || []).forEach(function (n) {
      if (!n || !n.id || nodos[n.id]) return;
      nodos[n.id] = n; ordenNodos.push(n.id);
    });
    function claveP(a, b) { return a < b ? a + "|" + b : b + "|" + a; }
    function addEnlace(l) {
      if (!l || !l.id || enlacePorId[l.id] || !nodos[l.a] || !nodos[l.b]) return false;
      enlaces.push(l); enlacePorId[l.id] = l; pares[claveP(l.a, l.b)] = true;
      return true;
    }
    (RED.enlaces || []).forEach(addEnlace);
    // Servicios: nodo SITE implícito si falta y enlace de acceso virtual si no hay uno explícito.
    (RED.servicios || []).forEach(function (s) {
      if (!s || !s.nodo) return;
      if (!nodos[s.nodo]) {
        nodos[s.nodo] = { id: s.nodo, tipo: "site", nombre: s.nombre || s.nodo, coord: s.coord,
          capacidad_gbps: null, virtual: true };
        ordenNodos.push(s.nodo);
      }
      if (s.conecta_a && nodos[s.conecta_a] && !pares[claveP(s.nodo, s.conecta_a)]) {
        var km = haversineKm(nodos[s.nodo].coord || s.coord, nodos[s.conecta_a].coord);
        addEnlace({ id: "L-" + s.nodo + "-ACCESO", a: s.nodo, b: s.conecta_a, tipo: "acceso",
          capacidad_gbps: esCap(s.capacidad_acceso_gbps) ? s.capacidad_acceso_gbps : null,
          km: Math.round(km * 100) / 100, virtual: true });
      }
    });
    // Representación compacta (CSR) para Dijkstra, sin tocar los objetos de RED
    var V = ordenNodos.length, idx = {}, idxL = {};
    ordenNodos.forEach(function (id, i) { idx[id] = i; adj[id] = []; });
    var latL = new Float64Array(enlaces.length);
    enlaces.forEach(function (l, i) {
      idxL[l.id] = i;
      latL[i] = num(l.latencia_ms, num(l.km, 0) * KM_MS);
      adj[l.a].push({ to: idx[l.b], li: i });
      adj[l.b].push({ to: idx[l.a], li: i });
    });
    var latArr = new Float64Array(V), transito = new Uint8Array(V), adjStart = new Int32Array(V + 1);
    var nAdj = 0;
    ordenNodos.forEach(function (id) { nAdj += adj[id].length; });
    var adjTo = new Int32Array(nAdj), adjLink = new Int32Array(nAdj), p = 0;
    ordenNodos.forEach(function (id, i) {
      var t = nodos[id].tipo;
      latArr[i] = num(nodos[id].latencia_ms, LAT_NODO);
      transito[i] = (t === "site" || t === "ix" || nodos[id].transito === false) ? 0 : 1;
      adjStart[i] = p;
      adj[id].forEach(function (e) { adjTo[p] = e.to; adjLink[p] = e.li; p++; });
    });
    adjStart[V] = p;
    var cores = ordenNodos.filter(function (id) { return nodos[id].tipo === "core"; });
    var coresIms = cores.filter(function (id) { return (nodos[id].funciones || []).indexOf("IMS") >= 0; });
    return { nodos: nodos, ordenNodos: ordenNodos, enlaces: enlaces, enlacePorId: enlacePorId,
      cores: cores, coresIms: coresIms.length ? coresIms : cores,
      idx: idx, idxL: idxL, latArr: latArr, latL: latL, transito: transito,
      adjStart: adjStart, adjTo: adjTo, adjLink: adjLink };
  }

  // Dijkstra por latencia (montículo binario, índices enteros). Los nodos site/ix no hacen tránsito.
  function dijkstra(G, origen, cN, cL) {
    var o = G.idx[origen];
    if (o === undefined || cN[o]) return null;
    var V = G.ordenNodos.length;
    var dist = new Float64Array(V), prevN = new Int32Array(V), prevL = new Int32Array(V), hecho = new Uint8Array(V);
    for (var i = 0; i < V; i++) { dist[i] = Infinity; prevN[i] = -1; prevL[i] = -1; }
    var hd = [], hv = [];
    function push(d, v) {
      hd.push(d); hv.push(v); var i = hd.length - 1;
      while (i > 0) {
        var p = (i - 1) >> 1; if (hd[p] <= hd[i]) break;
        var t = hd[p]; hd[p] = hd[i]; hd[i] = t; t = hv[p]; hv[p] = hv[i]; hv[i] = t; i = p;
      }
    }
    function pop() {
      var top = hv[0], ld = hd.pop(), lv = hv.pop(), n = hd.length;
      if (n) {
        hd[0] = ld; hv[0] = lv; var i = 0;
        for (;;) {
          var l = 2 * i + 1, r = l + 1, m = i;
          if (l < n && hd[l] < hd[m]) m = l;
          if (r < n && hd[r] < hd[m]) m = r;
          if (m === i) break;
          var t = hd[m]; hd[m] = hd[i]; hd[i] = t; t = hv[m]; hv[m] = hv[i]; hv[i] = t; i = m;
        }
      }
      return top;
    }
    dist[o] = G.latArr[o];
    push(dist[o], o);
    while (hd.length) {
      var u = pop();
      if (hecho[u]) continue;
      hecho[u] = 1;
      if (u !== o && !G.transito[u]) continue;
      for (var k = G.adjStart[u], fin = G.adjStart[u + 1]; k < fin; k++) {
        var v = G.adjTo[k], li = G.adjLink[k];
        if (cL[li] || cN[v] || hecho[v]) continue;
        var nd = dist[u] + G.latL[li] + G.latArr[v];
        if (nd < dist[v] - 1e-12) { dist[v] = nd; prevN[v] = u; prevL[v] = li; push(nd, v); }
      }
    }
    return { dist: dist, prevN: prevN, prevL: prevL, o: o };
  }

  function distDe(G, dj, id) { var i = G.idx[id]; return i === undefined ? Infinity : dj.dist[i]; }

  function camino(G, dj, destino) {
    var v = G.idx[destino], ruta = [destino], enl = [];
    while (v !== dj.o) { enl.push(G.enlaces[dj.prevL[v]].id); v = dj.prevN[v]; ruta.push(G.ordenNodos[v]); }
    return { ruta: ruta.reverse(), enlaces: enl.reverse() };
  }

  function elegirDestino(G, d, dj, caidosN) {
    function ok(id) { return id && G.nodos[id] && !caidosN[id] && distDe(G, dj, id) < Infinity; }
    if (d.destino === "nodo") return ok(d.destino_fijo) ? d.destino_fijo : null;
    if (d.core_fijo && ok(d.core_fijo)) return d.core_fijo;
    if (d.destino === "edge") {
      if (ok(d.edge)) return d.edge;
      var e = G.nodos[d.edge];
      if (e && ok(e.respaldo)) return e.respaldo;
    }
    var cores = d.destino === "ims" ? G.coresIms : G.cores, mejor = null, md = Infinity;
    for (var i = 0; i < cores.length; i++) {
      var x = distDe(G, dj, cores[i]);
      if (!caidosN[cores[i]] && x < md) { md = x; mejor = cores[i]; }
    }
    return mejor;
  }

  // Enruta cada demanda; devuelve array paralelo con {destino, ruta, enlaces, latencia} o null.
  function enrutar(G, demandas, caidosN, caidosL) {
    var cN = new Uint8Array(G.ordenNodos.length), cL = new Uint8Array(G.enlaces.length), k;
    for (k in caidosN) if (caidosN[k] && G.idx[k] !== undefined) cN[G.idx[k]] = 1;
    for (k in caidosL) if (caidosL[k] && G.idxL[k] !== undefined) cL[G.idxL[k]] = 1;
    var cache = {};
    return demandas.map(function (d) {
      if (!(d.origen in cache)) cache[d.origen] = dijkstra(G, d.origen, cN, cL);
      var dj = cache[d.origen];
      if (!dj) return null;
      var dest = elegirDestino(G, d, dj, caidosN);
      if (!dest) return null;
      var c = camino(G, dj, dest);
      return { destino: dest, ruta: c.ruta, enlaces: c.enlaces, latencia: distDe(G, dj, dest) };
    });
  }

  // ---------- demandas ----------
  function demandasBase(RED) {
    var slices = {};
    (RED.slices || []).forEach(function (s) { slices[s.id] = s; });
    var zonas = {};
    (RED.zonas || []).forEach(function (z) { zonas[z.id] = z; });
    function prio(x) {
      var s = slices[x.slice];
      return num(x.prioridad, s ? num(s.prioridad, 5) : 5);
    }
    function latMax(x) {
      var s = slices[x.slice];
      return num(x.latencia_max_ms, s ? num(s.latencia_max_ms, null) : null);
    }
    var out = [];
    (RED.zonas || []).forEach(function (z) {
      (z.necesidades || []).forEach(function (n) {
        out.push({ id: n.id, clase: "necesidad", zona: z.id, origen: z.agg, tipo: n.tipo,
          prioridad: prio(n), slice: n.slice || null, dl_gbps: num(n.dl_gbps, 0), ul_gbps: num(n.ul_gbps, 0),
          perfil: n.perfil || null, destino: n.destino || "internet", edge: z.edge || null,
          reparto_cores: n.reparto_cores || null, latencia_max_ms: latMax(n) });
      });
    });
    (RED.servicios || []).forEach(function (s) {
      var z = zonas[s.zona];
      out.push({ id: s.id, clase: "servicio", nombre: s.nombre, zona: s.zona || null, origen: s.nodo,
        tipo: s.tipo || "servicio", prioridad: prio(s), slice: s.slice || null,
        dl_gbps: num(s.dl_gbps, 0), ul_gbps: num(s.ul_gbps, 0), perfil: s.perfil || null,
        destino: s.destino || "internet", edge: s.edge || (z && z.edge) || null,
        destino_fijo: s.destino_nodo || null, inactivo: !!s.inactivo_por_defecto,
        reparto_cores: s.reparto_cores || null,
        latencia_max_ms: latMax(s) });
    });
    return out;
  }

  // Reparto de las demandas internet/ims entre los CPD (diseño UPF2: cada zona reparte 1/N a cada DC).
  // modo "equitativo" (por defecto) divide la demanda en N subdemandas "<id>@<core>" con `padre`;
  // si su CPD cae, la subdemanda va al CPD superviviente más cercano. modo "cercano": todo al más cercano.
  function expandirCores(G, base, modo) {
    if (modo === "cercano") return base;
    var out = [];
    base.forEach(function (b) {
      var cores = b.destino === "ims" ? G.coresIms : (b.destino === "internet" ? G.cores : []);
      // Pesos: reparto_cores de la demanda ({core: peso}, p. ej. el fijo a su BNG) o 1/N entre los CPD
      var pesos = [], tot = 0;
      cores.forEach(function (c) {
        var w = b.reparto_cores ? num(b.reparto_cores[c], 0) : 1;
        if (w > 0) { pesos.push([c, w]); tot += w; }
      });
      if (pesos.length === 0) { out.push(b); return; }
      if (pesos.length === 1) {
        var y = {}, kk; for (kk in b) y[kk] = b[kk];
        y.core_fijo = pesos[0][0]; out.push(y); return;
      }
      pesos.forEach(function (p) {
        var x = {}, k;
        for (k in b) x[k] = b[k];
        x.id = b.id + "@" + p[0]; x.padre = b.id; x.core_fijo = p[0]; x.reparto = p[1] / tot;
        out.push(x);
      });
    });
    return out;
  }

  function factorDe(d, listas) {
    var f = 1, claves = [d.zona, d.padre || d.id, "tipo:" + d.tipo], explicito = false;
    if (d.slice) claves.push("slice:" + d.slice);
    listas.forEach(function (fs) {
      if (!fs) return;
      claves.forEach(function (k) { if (k && typeof fs[k] === "number") f *= fs[k]; });
      if (typeof fs[d.padre || d.id] === "number") explicito = true;
    });
    // Servicios inactivos por defecto (p. ej. NTN de emergencia) solo cuentan si el escenario los nombra
    if (d.inactivo && !explicito) return 0;
    return f;
  }

  // Cabecera de transporte (v7 §2.7.2): F = 1,10·R_resto + 1,44·Q_VoNR, una sola vez.
  // RED.meta.cabecera_transporte = {general: 1.10, por_tipo: {"voz-ims": 1.44}}; sin dato, 1 (IP puro).
  function cabeceraDe(RED, b) {
    var c = RED.meta && RED.meta.cabecera_transporte;
    if (!c) return 1;
    return num(c.por_tipo && c.por_tipo[b.tipo], num(c.general, 1));
  }

  // Sentido del DL en el k-ésimo enlace de la ruta (la ruta va del origen al destino; el DL vuelve).
  function sentidoDL(G, d, k) {
    var l = G.enlacePorId[d.enlaces[k]];
    return d.ruta[k + 1] === l.a ? "ab" : "ba";
  }

  function perfilDe(RED, perfil, hora) {
    if (hora === null || hora === undefined) return 1;
    var p = RED.perfiles && RED.perfiles[perfil];
    if (!p) return 1;
    return num(p[((hora % 24) + 24) % 24], 1);
  }

  function resolverOpciones(RED, opciones) {
    opciones = opciones || {};
    var esc = null;
    if (opciones.escenario) {
      (RED.escenarios || []).forEach(function (e) { if (e.id === opciones.escenario) esc = e; });
    }
    var hora = typeof opciones.hora === "number" ? opciones.hora :
      (esc && typeof esc.hora === "number" ? esc.hora : null);
    var fallos = [].concat((esc && esc.fallos) || [], opciones.fallos || []);
    // hora_cargada: todas las demandas en su hora cargada a la vez (reproduce las tablas de dimensionado)
    var cargada = !!(opciones.hora_cargada || (esc && esc.hora_cargada));
    var reparto = opciones.reparto_core || (esc && esc.reparto_core) ||
      (RED.meta && RED.meta.reparto_core) || "equitativo";
    var factores = [esc && esc.factores, opciones.factores], perfiles = null, avisoModelo = null;
    // Modelo de tráfico (modelos.js, PLAN_v2 §4): añade factores (año, pico, día, pendular) y perfiles por demanda
    if (opciones.modelo) {
      var Mo = typeof Modelos !== "undefined" ? Modelos :
        (typeof require !== "undefined" ? require("./modelos.js") : null);
      if (Mo) {
        var aj = Mo.ajustar(RED, opciones.modelo, hora, !!esc);
        factores.push(aj.factores);
        perfiles = aj.perfiles;
        if (aj.cargada) cargada = true; else if (aj.hora !== undefined && aj.hora !== null) hora = aj.hora;
        avisoModelo = aj.aviso || null;
      } else avisoModelo = "modelos.js no cargado: se ignora el modelo de tráfico";
    }
    return { esc: esc, escId: opciones.escenario || null, hora: hora, fallos: fallos,
      factores: factores, cargada: cargada, reparto: reparto, perfiles: perfiles, avisoModelo: avisoModelo };
  }

  // ---------- cálculo principal ----------
  function calcular(RED, opciones) {
    var op = resolverOpciones(RED, opciones);
    var G = construirGrafo(RED);
    var base = expandirCores(G, demandasBase(RED), op.reparto);
    var alertas = [];

    if (op.escId && !op.esc) alertas.push({ nivel: "aviso", texto: "Escenario desconocido: " + op.escId });
    if (op.avisoModelo) alertas.push({ nivel: "aviso", texto: op.avisoModelo });

    // Fallos
    var caidosN = {}, caidosL = {}, hayFallos = false, vistos = {};
    op.fallos.forEach(function (id) {
      if (vistos[id]) return; vistos[id] = true;
      if (G.nodos[id]) { caidosN[id] = true; hayFallos = true; }
      else if (G.enlacePorId[id]) { caidosL[id] = true; hayFallos = true; }
      else alertas.push({ nivel: "aviso", texto: "Elemento en fallo desconocido: " + id });
    });

    // Rutas sin fallos y con fallos
    var rutasBase = enrutar(G, base, {}, {});
    var rutas = hayFallos ? enrutar(G, base, caidosN, caidosL) : rutasBase;

    // Estructuras de salida
    var enlacesOut = {}, nodosOut = {}, residualL = {}, residualN = {}, ofertaL = {}, ofertaN = {};
    G.enlaces.forEach(function (l) {
      var cap = esCap(l.capacidad_gbps) ? l.capacidad_gbps : null;
      // Enlaces full duplex: carga por sentido (ab = a→b, ba = b→a); carga_gbps = sentido más cargado (v7 A11.4)
      enlacesOut[l.id] = { carga_gbps: 0, carga_ab: 0, carga_ba: 0, capacidad_gbps: cap, ocupacion: 0,
        caido: !!(caidosL[l.id] || caidosN[l.a] || caidosN[l.b]), demandas: [], demanda_gbps: 0,
        virtual: !!l.virtual };
      residualL[l.id] = { ab: cap === null ? Infinity : cap, ba: cap === null ? Infinity : cap };
      ofertaL[l.id] = { ab: 0, ba: 0 };
    });
    G.ordenNodos.forEach(function (id) {
      var n = G.nodos[id], cap = esCap(n.capacidad_gbps) ? n.capacidad_gbps : null;
      nodosOut[id] = { carga_gbps: 0, capacidad_gbps: cap, ocupacion: 0, caido: !!caidosN[id],
        demandas: [], absorbe_de: [], demanda_gbps: 0 };
      residualN[id] = cap === null ? Infinity : cap;
      ofertaN[id] = 0;
    });

    // Demandas con valor de la hora
    var dem = base.map(function (b, i) {
      var r = rutas[i], rb = rutasBase[i];
      var pp = op.perfiles && op.perfiles[b.padre || b.id];
      var ph = op.cargada ? 1 : (pp ? num(pp[((op.hora % 24) + 24) % 24], 1) : perfilDe(RED, b.perfil, op.hora));
      var f = ph * factorDe(b, op.factores) * (b.reparto || 1);
      var dl = b.dl_gbps * f;
      var via = "principal";
      if (r && (!rb || rb.destino !== r.destino || rb.enlaces.join(",") !== r.enlaces.join(","))) via = "respaldo";
      return { id: b.id, padre: b.padre || null, zona: b.zona, origen: b.origen, destino_nodo: r ? r.destino : null,
        destino: b.destino, tipo: b.tipo, clase: b.clase, prioridad: b.prioridad, slice: b.slice,
        dl_gbps: dl, ul_gbps: b.ul_gbps * f, h: cabeceraDe(RED, b), servida_gbps: 0, ruta: r ? r.ruta : [], enlaces: r ? r.enlaces : [],
        latencia_ms: r ? r.latencia : null, latencia_max_ms: b.latencia_max_ms,
        via: r ? via : "respaldo", estado: "ok" };
    });

    // Oferta por elemento (para % de demanda sobre capacidad)
    dem.forEach(function (d) {
      if (!d.ruta.length) return;
      d.enlaces.forEach(function (id, k) {
        var sd = sentidoDL(G, d, k);
        ofertaL[id][sd] += d.dl_gbps * d.h; ofertaL[id][sd === "ab" ? "ba" : "ab"] += d.ul_gbps * d.h;
      });
      d.ruta.forEach(function (id) { ofertaN[id] += d.dl_gbps * d.h; });
    });

    // Asignación voraz por prioridad (1 primero; empate por menor demanda)
    var orden = [];
    dem.forEach(function (d, i) { if (d.ruta.length) orden.push(i); });
    orden.sort(function (a, b) {
      var A = dem[a], B = dem[b];
      return (A.prioridad - B.prioridad) || (A.dl_gbps - B.dl_gbps) || (A.id < B.id ? -1 : A.id > B.id ? 1 : 0);
    });
    var cuello = {}; // "L:id" | "N:id" -> { tipo, id, recortado, prios:{} }
    orden.forEach(function (i) {
      var d = dem[i], minR = Infinity, cue = null;
      var sds = d.enlaces.map(function (id, k) { return sentidoDL(G, d, k); });
      d.enlaces.forEach(function (id, k) { var x = residualL[id][sds[k]]; if (x < minR) { minR = x; cue = "L:" + id; } });
      d.ruta.forEach(function (id) { if (residualN[id] < minR) { minR = residualN[id]; cue = "N:" + id; } });
      // Carga física en la red = IP × cabecera (v7 §2.7.2); lo servido se cuenta en Gbit/s IP
      var s = Math.max(0, Math.min(d.dl_gbps * d.h, minR));
      d.servida_gbps = s / d.h;
      var cut = d.dl_gbps * d.h - s;
      if (cut > EPS && cue) {
        var c = cuello[cue] || (cuello[cue] = { tipo: cue.charAt(0), id: cue.slice(2), recortado: 0, prios: {}, n: 0 });
        c.recortado += cut; c.prios[d.prioridad] = true; c.n++;
      }
      // UL por el sentido contrario, limitado por lo que quede en ese sentido (no recorta el DL)
      var minU = Infinity;
      d.enlaces.forEach(function (id, k) { minU = Math.min(minU, residualL[id][sds[k] === "ab" ? "ba" : "ab"]); });
      var su = Math.max(0, Math.min(d.ul_gbps * d.h, minU));
      d.servida_ul_gbps = su / d.h;
      d.enlaces.forEach(function (id, k) {
        var e = enlacesOut[id], sd = sds[k], su_ = sd === "ab" ? "ba" : "ab";
        residualL[id][sd] -= s; residualL[id][su_] -= su;
        e["carga_" + sd] += s; e["carga_" + su_] += su; e.demandas.push(d.id);
      });
      d.ruta.forEach(function (id) {
        residualN[id] -= s; var n = nodosOut[id]; n.carga_gbps += s; n.demandas.push(d.id);
      });
    });

    // Estados
    dem.forEach(function (d) {
      if (!d.ruta.length) d.estado = "caido";
      else if (d.dl_gbps > EPS && d.servida_gbps < 0.99 * d.dl_gbps) d.estado = "degradado";
      else if (d.latencia_max_ms !== null && d.latencia_max_ms !== undefined && d.latencia_ms > d.latencia_max_ms) d.estado = "latencia";
      else d.estado = "ok";
    });

    // Ocupaciones
    var saturados = [], maxOc = 0, enlaceMax = null;
    G.enlaces.forEach(function (l) {
      var e = enlacesOut[l.id];
      e.carga_gbps = Math.max(e.carga_ab, e.carga_ba);
      e.sentido_max = e.carga_ab >= e.carga_ba ? "ab" : "ba";
      e.demanda_gbps = Math.max(ofertaL[l.id].ab, ofertaL[l.id].ba);
      e.ocupacion = e.capacidad_gbps ? e.carga_gbps / e.capacidad_gbps : 0;
      if (e.capacidad_gbps !== null && e.demanda_gbps > e.capacidad_gbps * (1 + 1e-9) + EPS) saturados.push(l.id);
      if (e.ocupacion > maxOc) { maxOc = e.ocupacion; enlaceMax = l.id; }
    });
    G.ordenNodos.forEach(function (id) {
      var n = nodosOut[id];
      n.demanda_gbps = ofertaN[id];
      n.ocupacion = n.capacidad_gbps ? n.carga_gbps / n.capacidad_gbps : 0;
    });

    // ---- Alertas de fallos ----
    var demPorId = {};
    dem.forEach(function (d) { demPorId[d.id] = d; });
    function difLat(lista) {
      var s = 0; lista.forEach(function (x) { s += x.d.latencia_ms - x.lb; });
      return lista.length ? s / lista.length : 0;
    }
    function plural(n, sing, plu) { return n + " " + (n === 1 ? sing : plu); }
    var vistosF = {};
    op.fallos.forEach(function (id) {
      if (vistosF[id] || !(caidosN[id] || caidosL[id])) return; vistosF[id] = true;
      var migr = {}, ordenMigr = [], reenc = [];
      dem.forEach(function (d, i) {
        var rb = rutasBase[i];
        if (!rb || d.estado === "caido") return;
        if (caidosN[id] && rb.destino === id && d.destino_nodo !== id) {
          if (!migr[d.destino_nodo]) { migr[d.destino_nodo] = []; ordenMigr.push(d.destino_nodo); }
          migr[d.destino_nodo].push({ d: d, lb: rb.latencia });
        } else if (d.via === "respaldo" &&
          (caidosN[id] ? rb.ruta.indexOf(id) >= 0 : rb.enlaces.indexOf(id) >= 0)) {
          reenc.push({ d: d, lb: rb.latencia });
        }
      });
      var nombre = caidosN[id] ? nombreNodo(G, id) : "Enlace " + id;
      ordenMigr.forEach(function (dest) {
        var l = migr[dest];
        if (nodosOut[dest].absorbe_de.indexOf(id) < 0) nodosOut[dest].absorbe_de.push(id);
        alertas.push({ nivel: "aviso", texto: nombre + " caído: " + plural(l.length, "demanda migra", "demandas migran") +
          " a " + nombreNodo(G, dest) + " (" + fmtMs(difLat(l)) + ")" });
      });
      if (reenc.length) {
        alertas.push({ nivel: "info", texto: nombre + " caído: " + plural(reenc.length, "demanda reencaminada", "demandas reencaminadas") +
          " (" + fmtMs(difLat(reenc)) + ")" });
      }
      if (!ordenMigr.length && !reenc.length) {
        var sinRuta = dem.filter(function (d, i) {
          var rb = rutasBase[i];
          return d.estado === "caido" && rb && (caidosN[id] ? rb.ruta.indexOf(id) >= 0 : rb.enlaces.indexOf(id) >= 0);
        }).length;
        if (!sinRuta) alertas.push({ nivel: "info", texto: nombre + " caído: no afecta a ninguna demanda" });
      }
    });

    // ---- Alertas de congestión ----
    Object.keys(cuello).forEach(function (k) {
      var c = cuello[k];
      var cap = c.tipo === "L" ? enlacesOut[c.id].capacidad_gbps : nodosOut[c.id].capacidad_gbps;
      var of = c.tipo === "L" ? enlacesOut[c.id].demanda_gbps : ofertaN[c.id];
      var prios = Object.keys(c.prios).map(Number).sort(function (a, b) { return a - b; });
      var quien = prios[0] >= 4 ? "best-effort" : (prios.length === 1 ? "prioridad " + prios[0] : "prioridades " + prios.join(", "));
      var nom = c.tipo === "L" ? "Enlace " + c.id : "Nodo " + nombreNodo(G, c.id);
      alertas.push({ nivel: prios[0] <= 2 ? "grave" : "aviso",
        texto: nom + " al " + fmt(cap ? of / cap * 100 : 0, 0) + " %: se recortan " + fmtG(c.recortado) + " Gbit/s de " + quien });
    });

    // ---- Sin ruta y latencia ----
    var caidas = dem.filter(function (d) { return d.estado === "caido"; });
    if (caidas.length) {
      var ids = caidas.slice(0, 5).map(function (d) { return d.id; }).join(", ") + (caidas.length > 5 ? "…" : "");
      var gb = 0; caidas.forEach(function (d) { gb += d.dl_gbps; });
      alertas.push({ nivel: "grave", texto: plural(caidas.length, "demanda sin ruta", "demandas sin ruta") +
        " (" + fmtG(gb) + " Gbit/s perdidos): " + ids });
    }
    var lentas = dem.filter(function (d) { return d.estado === "latencia"; });
    if (lentas.length) {
      var ej = lentas[0];
      alertas.push({ nivel: "aviso", texto: plural(lentas.length, "demanda supera", "demandas superan") +
        " su latencia máxima (p. ej. " + ej.id + ": " + fmt(ej.latencia_ms, 2) + " ms > " + fmt(ej.latencia_max_ms, 0) + " ms)" });
    }

    // ---- Zonas ----
    var zonasOut = {};
    (RED.zonas || []).forEach(function (z) {
      zonasOut[z.id] = { dl_gbps: 0, servida_gbps: 0, pct: 100, necesidades: {} };
    });
    var dlTot = 0, servTot = 0, afectadas = 0;
    dem.forEach(function (d) {
      dlTot += d.dl_gbps; servTot += d.servida_gbps;
      if (d.estado !== "ok" || d.via === "respaldo") afectadas++;
      var z = zonasOut[d.zona];
      if (!z) return;
      z.dl_gbps += d.dl_gbps; z.servida_gbps += d.servida_gbps;
      var key = d.padre || d.id, prev = z.necesidades[key];
      if (!prev) z.necesidades[key] = { dl_gbps: d.dl_gbps, servida_gbps: d.servida_gbps, estado: d.estado };
      else {
        prev.dl_gbps += d.dl_gbps; prev.servida_gbps += d.servida_gbps;
        if (GRAV_EST[d.estado] > GRAV_EST[prev.estado]) prev.estado = d.estado;
      }
    });
    Object.keys(zonasOut).forEach(function (k) {
      var z = zonasOut[k];
      z.pct = z.dl_gbps > EPS ? z.servida_gbps / z.dl_gbps * 100 : 100;
    });
    var pctServ = dlTot > EPS ? servTot / dlTot * 100 : 100;

    if (!alertas.length) alertas.push({ nivel: "info", texto: "Red sin incidencias: " + fmt(pctServ, 1) + " % de la demanda servida" });
    var pesoN = { grave: 0, aviso: 1, info: 2 };
    alertas.sort(function (a, b) { return pesoN[a.nivel] - pesoN[b.nivel]; });

    return {
      demandas: dem,
      enlaces: enlacesOut,
      nodos: nodosOut,
      zonas: zonasOut,
      resumen: {
        escenario: op.escId, hora: op.hora, fallos: Object.keys(vistos),
        dl_total_gbps: dlTot, servida_gbps: servTot, pct_servida: pctServ,
        enlaces_saturados: saturados, demandas_afectadas: afectadas,
        max_ocupacion: maxOc, enlace_max: enlaceMax,
        alertas: alertas
      }
    };
  }

  // ---------- serie de 24 h ----------
  var GRAV_EST = { ok: 0, latencia: 1, degradado: 2, caido: 3 };

  function serieDiaria(RED, opciones) {
    var out = [];
    for (var h = 0; h < 24; h++) {
      var o = {}, k;
      for (k in (opciones || {})) o[k] = opciones[k];
      o.hora = h;
      var r = calcular(RED, o).resumen;
      out.push({ hora: h, dl_total_gbps: r.dl_total_gbps, servida_gbps: r.servida_gbps,
        pct_servida: r.pct_servida, max_ocupacion: r.max_ocupacion, enlace_max: r.enlace_max });
    }
    return out;
  }

  // ---------- puntos únicos de fallo ----------
  // Solo enrutamiento (sin congestión). Un elemento que no está en ninguna ruta sin fallos no puede
  // dejar demandas sin ruta, así que se descarta sin recalcular.
  function puntosUnicosFallo(RED, opciones) {
    var G = construirGrafo(RED);
    var base = expandirCores(G, demandasBase(RED), resolverOpciones(RED, opciones).reparto);
    var rb = enrutar(G, base, {}, {});
    var usaN = {}, usaL = {};
    rb.forEach(function (r) {
      if (!r) return;
      r.ruta.forEach(function (id) { usaN[id] = true; });
      r.enlaces.forEach(function (id) { usaL[id] = true; });
    });
    var cands = [];
    G.ordenNodos.forEach(function (id) {
      var t = G.nodos[id].tipo;
      if (t !== "agg" && t !== "site") cands.push({ id: id, clase: "nodo" });
    });
    G.enlaces.forEach(function (l) { cands.push({ id: l.id, clase: "enlace" }); });
    var out = [];
    cands.forEach(function (c) {
      if (!(c.clase === "nodo" ? usaN[c.id] : usaL[c.id])) return;
      var cN = {}, cL = {};
      if (c.clase === "nodo") cN[c.id] = true; else cL[c.id] = true;
      // solo se reenrutan las demandas cuya ruta sin fallos pasa por el elemento
      var sub = base.filter(function (b, i) {
        return rb[i] && (c.clase === "nodo" ? rb[i].ruta.indexOf(c.id) >= 0 : rb[i].enlaces.indexOf(c.id) >= 0);
      });
      var r = enrutar(G, sub, cN, cL), afect = [];
      r.forEach(function (x, i) { if (!x) afect.push(sub[i].id); });
      if (afect.length) {
        var n = c.clase === "nodo" ? G.nodos[c.id] : G.enlacePorId[c.id];
        out.push({ id: c.id, clase: c.clase, tipo: n.tipo || null, nombre: n.nombre || c.id,
          virtual: !!n.virtual, demandas: afect, n: afect.length });
      }
    });
    out.sort(function (a, b) { return b.n - a.n || (a.id < b.id ? -1 : 1); });
    return out;
  }

  return {
    calcular: calcular,
    demandasBase: demandasBase,
    serieDiaria: serieDiaria,
    puntosUnicosFallo: puntosUnicosFallo,
    _construirGrafo: construirGrafo
  };
})();

if (typeof module !== "undefined") module.exports = Motor; else window.Motor = Motor;
