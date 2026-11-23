// Motor de cálculo del simulador de red (Proyecto 2 Madrid, SCOM + ARCO).
// Sin dependencias ni build. Funciona en navegador (window.Motor) y en node (module.exports).
// Contrato y reglas del modelo: ver PLAN.md.
// API: calcular(RED, opciones) · barridoN1(RED, opciones) · casos(RED) · serieDiaria · puntosUnicosFallo · demandasBase
//   · serie(RED, caso, {paso_min, desde, hasta, fallos, eventos}) · serieAsync (Web Worker serie_worker.js) — CONTRATO_UI Revisión 4.
//   · eventos ampliados y acciones del operador en serie (y opciones.acciones en calcular), sucesos por paso,
//     plantillasEventos(RED), opcionesPaso, tiposEvento — Revisión 7.
//   · opciones.modelo_usuario (calcular y serie) · serieMontecarlo (Promise, worker) / serieMontecarloSync · factorRuido — Revisión 8.
//   · resultado.acceso (sitios, por_tec, nucleo BNG/UPF/IMS) · tecnologias(RED) · claseDeTec(tec) — Revisión 5; necesita
//     window.EMPL (emplazamientos_datos.js, cargarlo antes que motor.js) o opciones.empl; opciones.acceso === false lo omite.
//   · lat_* con carga en enlaces y demandas, resultado.sla (opciones.latencia === false lo omite) · planificacion · disponibilidad
//     · comparar — Revisión 9.
// opciones: escenario, hora, fallos[], factores, modelo{id,anio,dia}, reparto_core, hora_cargada,
//   rutas ("v7" por defecto si RED.meta.referencia; si no "dijkstra"), caso {trafico, evento, fallo[]}.
// Cada demanda trae caminos[{peso, destino, ruta, enlaces, latencia_ms}] (reparto en empates/respaldos) y
// fraccion_con_ruta; ruta/enlaces/destino_nodo son los del camino de más peso.
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
    // Modo v7: no hay tránsito por DC ni Edge (v7 §6.4.3) además de site/ix; tramos de anillo = metro–metro
    var transV7 = new Uint8Array(V), anilloL = new Uint8Array(enlaces.length);
    ordenNodos.forEach(function (id, i) {
      var t = nodos[id].tipo;
      transV7[i] = (t === "site" || t === "ix" || t === "core" || t === "edge" || nodos[id].transito === false) ? 0 : 1;
    });
    enlaces.forEach(function (l, i) {
      anilloL[i] = (nodos[l.a].tipo === "metro" && nodos[l.b].tipo === "metro") ? 1 : 0;
    });
    var cores =ordenNodos.filter(function (id) { return nodos[id].tipo === "core"; });
    var coresIms = cores.filter(function (id) { return (nodos[id].funciones || []).indexOf("IMS") >= 0; });
    return { nodos: nodos, ordenNodos: ordenNodos, enlaces: enlaces, enlacePorId: enlacePorId,
      cores: cores, coresIms: coresIms.length ? coresIms : cores,
      idx: idx, idxL: idxL, latArr: latArr, latL: latL, transito: transito,
      transV7: transV7, anilloL: anilloL,
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

  function mascaras(G, caidosN, caidosL) {
    var cN = new Uint8Array(G.ordenNodos.length), cL = new Uint8Array(G.enlaces.length), k;
    for (k in caidosN) if (caidosN[k] && G.idx[k] !== undefined) cN[G.idx[k]] = 1;
    for (k in caidosL) if (caidosL[k] && G.idxL[k] !== undefined) cL[G.idxL[k]] = 1;
    return { cN: cN, cL: cL };
  }

  // Enruta cada demanda; devuelve array paralelo con
  // {destino, ruta, enlaces, latencia, caminos:[{peso, destino, ruta, enlaces, latencia}]} o null.
  // `ruta`/`enlaces`/`destino` son los del camino de más peso; `caminos` reparte la demanda (Σpeso ≤ 1:
  // lo que falta hasta 1 no tiene ruta, p. ej. el 40 % del estadio en el respaldo MEC).
  // modo "dijkstra": un camino por latencia mínima. modo "v7": reglas de la memoria v7 (enrutarV7).
  // excl (Revisión 7, te_reencaminar): {id enlace: true} que no se usan para enrutar aunque estén vivos; a diferencia
  // de un corte no activan FRR: los LSP se vuelven a señalizar por mínimos saltos sin ese enlace (make-before-break).
  function enrutar(G, demandas, caidosN, caidosL, modo, excl) {
    if (excl) {
      var cx = {}, kx;
      for (kx in caidosL) cx[kx] = caidosL[kx];
      for (kx in excl) if (excl[kx]) cx[kx] = true;
      caidosL = cx;
    }
    if (modo === "v7") return enrutarV7(G, demandas, caidosN, caidosL, excl);
    var m = mascaras(G, caidosN, caidosL), cN = m.cN, cL = m.cL;
    var cache = {};
    return demandas.map(function (d) {
      if (!(d.origen in cache)) cache[d.origen] = dijkstra(G, d.origen, cN, cL);
      var dj = cache[d.origen];
      if (!dj) return null;
      var dest = elegirDestino(G, d, dj, caidosN);
      if (!dest) return null;
      var c = camino(G, dj, dest), lat = distDe(G, dj, dest);
      return { destino: dest, ruta: c.ruta, enlaces: c.enlaces, latencia: lat,
        caminos: [{ peso: 1, destino: dest, ruta: c.ruta, enlaces: c.enlaces, latencia: lat }] };
    });
  }

  // ---------- rutas de la memoria v7 (Entrega 2) ----------
  // Reglas (v7 §2.7.2, §6.4.3, §6.7.3, A11.1–A11.7):
  //  1. Mínimo de saltos; empate → reparto a partes iguales entre todos los caminos mínimos ("+" de A11.1–A11.3).
  //     Sin tránsito por DC, Edge, sitios ni IX (§6.4.3).
  //  2. Corte de un tramo de anillo (metro–metro): RSVP-TE FRR facility backup. Se calculan las rutas como si el
  //     tramo estuviera vivo y cada aparición del salto caído se sustituye por el arco opuesto del anillo, sin
  //     reoptimizar (no se cancelan idas y vueltas, A11.7). Se mantiene la acometida normal.
  //     [Supuesto] si el arco opuesto tampoco existe (dos cortes, N−2, fuera de la v7) se reoptimiza.
  //  3. Caída de acometida: el DC se alcanza por su otra acometida con rutas de mínimos saltos (empate a partes
  //     iguales) — sale solo de la regla 1 sobre la red sin esa acometida.
  //  4. Caída de un DC: la parte de cada zona que iba a ese DC se reparte a partes iguales entre los DC
  //     supervivientes (1/3 + 1/6 + 1/6 → 1/2 por DC, §2.7.2).
  //  5. Caída de un nodo Metro: solo se quita la zona inalcanzable y sus enlaces; el resto sigue la regla 1.
  //  6. Caída de un Edge: respaldo MEC en el Edge indicado en `respaldo` del nodo (§6.7.3), por rutas de mínimos
  //     saltos (C→E por C–N–E y C–S–E al 50 %; S→C directo). Fracción transportada según §6.7.3 / A6:
  //     estadio 60 % (prensa, ligero y vídeo); el resto 100 % (cámaras: 100 % de flujos y grabación —el 30 % de
  //     analítica es cómputo en el Edge, no transporte—; V2X, hospital y red privada: continuidad).
  //     [Supuesto] si cae también el Edge de respaldo, el servicio va al DC más cercano al 100 % (la v7 no lo
  //     trata: la hipótesis es N−1). Lo que no se transporta queda como demanda no servida (estado degradado).
  var RESPALDO_MEC_V7 = { "S-ESTADIO-PRENSA": 0.6, "S-ESTADIO-LIGERO": 0.6, "S-ESTADIO-VIDEO": 0.6 };
  // [Supuesto mot.respaldo_camaras] cámaras al 100 % en respaldo (el 30 % de analítica es cómputo, no transporte)
  var RESPALDO_CAMARAS = { "S-VALDEBEBAS-CAMARAS": 1 };
  var MAX_CAMINOS = 64;

  // BFS por saltos con todos los predecesores de mínimo coste. soloAnillo: solo tramos metro–metro.
  function bfsSaltos(G, origen, cN, cL, soloAnillo) {
    var o = typeof origen === "number" ? origen : G.idx[origen];
    if (o === undefined || cN[o]) return null;
    var V = G.ordenNodos.length, dist = new Int32Array(V), preds = new Array(V), cola = [o];
    for (var i = 0; i < V; i++) dist[i] = -1;
    dist[o] = 0; preds[o] = [];
    for (var q = 0; q < cola.length; q++) {
      var u = cola[q];
      if (u !== o && !G.transV7[u]) continue;
      for (var k = G.adjStart[u], fin = G.adjStart[u + 1]; k < fin; k++) {
        var v = G.adjTo[k], li = G.adjLink[k];
        if (cL[li] || cN[v] || (soloAnillo && !G.anilloL[li])) continue;
        if (dist[v] < 0) { dist[v] = dist[u] + 1; preds[v] = [[u, li]]; cola.push(v); }
        else if (dist[v] === dist[u] + 1) preds[v].push([u, li]);
      }
    }
    return { o: o, dist: dist, preds: preds };
  }

  // Todos los caminos de mínimo número de saltos de b.o a destino (índices de nodo y enlace).
  function caminosMin(G, b, destino) {
    var t = typeof destino === "number" ? destino : G.idx[destino];
    if (t === undefined || b.dist[t] < 0) return [];
    var out = [], ns = [t], ls = [];
    (function rec(v) {
      if (out.length >= MAX_CAMINOS) return;
      if (v === b.o) { out.push({ n: ns.slice().reverse(), l: ls.slice().reverse() }); return; }
      var ps = b.preds[v];
      for (var i = 0; i < ps.length; i++) {
        ns.push(ps[i][0]); ls.push(ps[i][1]); rec(ps[i][0]); ns.pop(); ls.pop();
      }
    })(t);
    return out;
  }

  function latCamino(G, c) {
    var s = 0, i;
    for (i = 0; i < c.n.length; i++) s += G.latArr[c.n[i]];
    for (i = 0; i < c.l.length; i++) s += G.latL[c.l[i]];
    return s;
  }

  function enrutarV7(G, demandas, caidosN, caidosL, excl) {
    var m = mascaras(G, caidosN, caidosL), cN = m.cN, cL = m.cL;
    // Cortes de tramo protegidos por FRR (los dos extremos vivos) y su arco opuesto por sentido
    var cLpre = new Uint8Array(cL), arcos = {}, hayCortes = false;
    G.enlaces.forEach(function (l, li) {
      if (!cL[li] || !G.anilloL[li] || (excl && excl[l.id])) return;
      var a = G.idx[l.a], b = G.idx[l.b];
      if (cN[a] || cN[b]) return;
      hayCortes = true; cLpre[li] = 0;
      var arco = function (x, y) {
        var bb = bfsSaltos(G, x, cN, cL, true), ps = bb ? caminosMin(G, bb, y) : [];
        return ps.length ? ps[0] : null;
      };
      arcos[li] = { ab: arco(a, b), ba: arco(b, a) };
    });
    function frr(c) {
      var n = [c.n[0]], l = [];
      for (var k = 0; k < c.l.length; k++) {
        var li = c.l[k];
        if (arcos[li]) {
          var arc = arcos[li][c.n[k] === G.idx[G.enlaces[li].a] ? "ab" : "ba"];
          if (!arc) return null;
          for (var j = 0; j < arc.l.length; j++) { l.push(arc.l[j]); n.push(arc.n[j + 1]); }
        } else { l.push(li); n.push(c.n[k + 1]); }
      }
      return { n: n, l: l };
    }
    var cachePre = {}, cacheFull = {};
    function bfsDe(cache, origen, mascL) {
      if (!(origen in cache)) cache[origen] = bfsSaltos(G, origen, cN, mascL, false);
      return cache[origen];
    }
    function ok(b, id) { var i = G.idx[id]; return i !== undefined && !cN[i] && b.dist[i] >= 0; }
    function masCercanos(b, lista) {
      var md = Infinity, out = [];
      lista.forEach(function (id) {
        if (!ok(b, id)) return;
        var x = b.dist[G.idx[id]];
        if (x < md) { md = x; out = [id]; } else if (x === md) out.push(id);
      });
      return out;
    }
    function reparto(lista, w) { return lista.map(function (id) { return [id, w / lista.length]; }); }
    var reglas = null;   // claves de supuestos de regla activadas por la demanda en curso
    function regla(k) { if (reglas && reglas.indexOf(k) < 0) reglas.push(k); }
    // Destinos de la demanda con su peso
    function destinos(d, b) {
      var cores = d.destino === "ims" ? G.coresIms : G.cores;
      if (d.destino === "nodo") return ok(b, d.destino_fijo) ? [[d.destino_fijo, 1]] : [];
      if (d.core_fijo) {
        if (ok(b, d.core_fijo)) return [[d.core_fijo, 1]];
        // Regla 4: la parte del DC caído se reparte a partes iguales entre los supervivientes
        var sup = (d.cores_reparto || cores).filter(function (c) { return ok(b, c); });
        if (!sup.length) sup = cores.filter(function (c) { return ok(b, c); });
        return reparto(sup, 1);
      }
      if (d.destino === "edge") {
        if (ok(b, d.edge)) return [[d.edge, 1]];
        var e = G.nodos[d.edge];
        if (e && ok(b, e.respaldo)) {
          if (RESPALDO_CAMARAS[d.padre || d.id]) regla("mot.respaldo_camaras");
          return [[e.respaldo, num(d.respaldo_mec, 1)]];
        }
        regla("mot.edge_sin_respaldo");
        return reparto(masCercanos(b, G.cores), 1);
      }
      return reparto(masCercanos(b, cores), 1);   // modo "cercano": DC(s) a menos saltos, empate a partes iguales
    }
    function construir(d, b, conFrr) {
      var out = [], fallo = false;
      destinos(d, b).forEach(function (dw) {
        var ps = caminosMin(G, b, dw[0]);
        ps.forEach(function (c) {
          if (conFrr) { c = frr(c); if (!c) { fallo = true; return; } }
          out.push({ peso: dw[1] / ps.length, destino: dw[0], c: c });
        });
      });
      return fallo ? null : out;
    }
    return demandas.map(function (d) {
      var b = bfsDe(hayCortes ? cachePre : cacheFull, d.origen, hayCortes ? cLpre : cL);
      if (!b) return null;
      reglas = [];
      var cams = construir(d, b, hayCortes);
      if (cams === null) {   // [Supuesto] FRR imposible (N−2): se reoptimiza sobre la red con todos los fallos
        reglas = ["mot.frr_n2"];
        b = bfsDe(cacheFull, d.origen, cL);
        cams = b ? construir(d, b, false) : [];
      }
      var rg = reglas; reglas = null;
      if (!cams.length) return null;
      var caminos = cams.map(function (x) {
        return { peso: x.peso, destino: x.destino,
          ruta: x.c.n.map(function (i) { return G.ordenNodos[i]; }),
          enlaces: x.c.l.map(function (i) { return G.enlaces[i].id; }),
          latencia: latCamino(G, x.c) };
      });
      var main = caminos[0], lat = 0;
      caminos.forEach(function (c) { if (c.peso > main.peso + EPS) main = c; lat = Math.max(lat, c.latencia); });
      return { destino: main.destino, ruta: main.ruta, enlaces: main.enlaces, latencia: lat, caminos: caminos, reglas: rg };
    });
  }

  // ---------- tipos de servicio (CONTRATO_UI Revisión 2 §4) ----------
  // Ocho clases para ver la red por servicio. Se deducen de los campos de la demanda (tipo, perfil, slice,
  // destino, id); un campo `clase_servicio` explícito en los datos manda. Reglas en orden; la primera que casa gana.
  var CLASES_SERVICIO = ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var REGLAS_SERVICIO = [
    ["ntn", "satélite NTN (id S-NTN / nodo NTN)", function (x) {
      return /^S-NTN/.test(x.id || "") || /NTN/.test(x.nodo || x.origen || "") || x.tipo === "sat"; }],
    ["evento", "perfil evento (estadio, MEC)", function (x) { return x.perfil === "evento"; }],
    ["urllc", "slice URLLC o perfil movilidad (V2X)", function (x) { return x.slice === "URLLC" || x.perfil === "movilidad"; }],
    ["empresa", "slice privado PRIV-* o L2VPN sede a sede", function (x) {
      return /^PRIV/.test(x.slice || "") || x.destino === "nodo" || /^S-L2VPN/.test(x.id || ""); }],
    ["iot", "slice mMTC o perfil iot", function (x) { return x.slice === "mMTC" || x.perfil === "iot"; }],
    ["voz", "tipo voz-* o destino IMS", function (x) { return /^voz/.test(x.tipo || "") || x.destino === "ims"; }],
    ["movil", "tipo movil-* (eMBB por radio)", function (x) { return /^movil/.test(x.tipo || ""); }],
    ["ftth", "Internet fijo por BNG (tipo residencial-fijo/empresa, slice fijo-bng)", function (x) {
      return x.tipo === "residencial-fijo" || x.tipo === "empresa" || x.slice === "fijo-bng"; }]
  ];
  // Devuelve {clase, regla}. regla "reserva" = ninguna regla casó (test_servicios.js exige que no pase).
  function claseServicio(x) {
    if (x && CLASES_SERVICIO.indexOf(x.clase_servicio) >= 0) return { clase: x.clase_servicio, regla: "explícita en los datos" };
    for (var i = 0; i < REGLAS_SERVICIO.length; i++) if (REGLAS_SERVICIO[i][2](x || {})) return { clase: REGLAS_SERVICIO[i][0], regla: REGLAS_SERVICIO[i][1] };
    return { clase: x && x.perfil === "empresa" ? "empresa" : "movil", regla: "reserva" };
  }
  function nuevoPorServicio() {
    var o = {};
    for (var i = 0; i < CLASES_SERVICIO.length; i++) o[CLASES_SERVICIO[i]] = { ab: 0, ba: 0 };
    return o;
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
          reparto_cores: n.reparto_cores || null, latencia_max_ms: latMax(n), clase_servicio_dato: n.clase_servicio || null });
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
        respaldo_mec: num(s.respaldo_mec, num(RESPALDO_MEC_V7[s.id], 1)),
        latencia_max_ms: latMax(s), clase_servicio_dato: s.clase_servicio || null });
    });
    out.forEach(function (d) {
      var c = claseServicio({ id: d.id, tipo: d.tipo, perfil: d.perfil, slice: d.slice, destino: d.destino,
        origen: d.origen, clase_servicio: d.clase_servicio_dato });
      d.clase_servicio = c.clase; d.regla_servicio = c.regla;
      delete d.clase_servicio_dato;
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
        x.cores_reparto = pesos.map(function (q) { return q[0]; });
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
    // Excepciones por prefijo de id (p. ej. L2VPN: fuera de la matriz A11, la cota de 10 GbE ya es velocidad de línea).
    var pp = c.por_prefijo || {};
    for (var k in pp) if (b.id && String(b.id).indexOf(k) === 0) return num(pp[k], 1);
    return num(c.por_tipo && c.por_tipo[b.tipo], num(c.general, 1));
  }

  // ¿Pasa alguna de las rutas de r (salida de enrutar) por el nodo/enlace id?
  function usaElemento(r, id, esNodo) {
    var cs = r.caminos || [r];
    for (var i = 0; i < cs.length; i++) if ((esNodo ? cs[i].ruta : cs[i].enlaces).indexOf(id) >= 0) return true;
    return false;
  }
  function firmaRuta(r) {
    return (r.caminos || [r]).map(function (c) {
      return c.destino + ":" + c.enlaces.join(",") + ":" + (c.peso === undefined ? 1 : c.peso).toFixed(6);
    }).join("|");
  }

  // Sentido del DL en el k-ésimo enlace de la ruta (la ruta va del origen al destino; el DL vuelve).
  function sentidoDL(G, d, k) {
    var l = G.enlacePorId[d.enlaces[k]];
    return d.ruta[k + 1] === l.a ? "ab" : "ba";
  }

  // Valor de un perfil de 24 valores horarios a la hora `hora` (puede ser fraccionaria: 19.5 = 19:30).
  // Entre horas enteras, interpolación lineal (supuesto dem.interpolacion_horaria); 23:xx interpola hacia las 00:00.
  function valorPerfil(p, hora, defecto) {
    if (!p) return defecto;
    var h = ((hora % 24) + 24) % 24, i = Math.floor(h), fr = h - i;
    var a = num(p[i], defecto);
    if (fr < 1e-9) return a;
    var b = num(p[(i + 1) % 24], defecto);
    return a + (b - a) * fr;
  }
  function horaFraccionaria(h) { return typeof h === "number" && Math.abs(h - Math.round(h)) > 1e-9; }

  function perfilDe(RED, perfil, hora) {
    if (hora === null || hora === undefined) return 1;
    var p = RED.perfiles && RED.perfiles[perfil];
    if (!p) return 1;
    return valorPerfil(p, hora, 1);
  }

  // Modo de rutas: "v7" por defecto con red de referencia (RED.meta.referencia), si no "dijkstra".
  function modoRutas(RED, opciones) {
    var m = opciones && opciones.rutas;
    if (m === "v7" || m === "dijkstra") return m;
    return (RED.meta && RED.meta.referencia) ? "v7" : "dijkstra";
  }

  // opciones.caso = {trafico, evento, fallo:[ids]} (constructor de casos, ver casos()) → opciones internas.
  //   trafico: id de modelo ("BH", "P2", …) u objeto {id, anio, dia, hora}; evento: id de escenario sin fallos
  //   (o "ninguno" = E-NORMAL si existe); fallo: id o lista de ids de nodos/enlaces. Lo explícito en
  //   `opciones` (escenario, modelo, hora, fallos) se respeta y se suma.
  function traducirCaso(RED, opciones) {
    var c = opciones.caso, o = {}, k;
    for (k in opciones) if (k !== "caso") o[k] = opciones[k];
    if (!c) return o;
    if (!o.escenario) {
      if (c.evento && c.evento !== "ninguno") o.escenario = c.evento;
      else if ((RED.escenarios || []).some(function (e) { return e.id === EVENTO_NINGUNO; })) o.escenario = EVENTO_NINGUNO;
    }
    var t = c.trafico;
    if (t && !o.modelo) {
      if (typeof t === "string") o.modelo = { id: t };
      else {
        o.modelo = { id: t.id || "BH" };
        if (t.anio) o.modelo.anio = t.anio;
        if (t.dia) o.modelo.dia = t.dia;
        if (typeof t.hora === "number" && typeof o.hora !== "number") o.hora = t.hora;
      }
    }
    if (c.fallo) o.fallos = [].concat(o.fallos || [], c.fallo);
    return o;
  }
  var EVENTO_NINGUNO = "E-NORMAL";

  // ---------- eventos y acciones del operador (CONTRATO_UI Revisión 7, PLAN_v3 §1 y §5.1) ----------
  // Un evento es {t_min, tipo, id?, params?}; en calcular() se pasan los activos en opciones.acciones = [{tipo, id, params}].
  //   fallo / reparacion (id nodo o enlace) · degradar (capacidad × params.factor, o params.miembros_caidos de un LAG) ·
  //   evento_demanda (id escenario de RED, p. ej. E-EVENTO) · te_reencaminar (id enlace; params.fraccion, origen, destino) ·
  //   activar_ntn (id terminal/enlace sat/zona; sin id = todos) · anadir_lambda (id enlace; params.n o params.gbps) ·
  //   priorizar_slice (id slice | "clase:x" | "tipo:x" | zona | demanda; params.prioridad, 0 por defecto) ·
  //   apagar_capa (id tecnología radio: n258, n78, n28).
  // Cualquiera admite params.hasta_min (o params.duracion_min): deja de aplicarse en ese instante. "reparacion" quita
  // también una degradación del mismo id. Reglas que no vienen de documento: supuestos del ámbito "eventos" (evt.*).
  var TIPOS_EVENTO = [
    { id: "fallo", origen: "evento", es: "Fallo", en: "Failure", objetivo: "nodo|enlace", params: [] },
    { id: "reparacion", origen: "evento", es: "Reparación", en: "Repair", objetivo: "nodo|enlace", params: [] },
    { id: "degradar", origen: "evento", es: "Degradación", en: "Degradation", objetivo: "nodo|enlace",
      params: ["factor", "miembros_caidos", "hasta_min"] },
    { id: "evento_demanda", origen: "evento", es: "Evento de demanda", en: "Demand event", objetivo: "escenario",
      params: ["hasta_min", "duracion_min"] },
    { id: "te_reencaminar", origen: "accion", es: "Reencaminar (TE)", en: "Reroute (TE)", objetivo: "enlace",
      params: ["fraccion", "origen", "destino", "hasta_min"] },
    { id: "activar_ntn", origen: "accion", es: "Activar satélite (NTN)", en: "Activate satellite (NTN)", objetivo: "terminal|zona|—",
      params: ["hasta_min"] },
    { id: "anadir_lambda", origen: "accion", es: "Añadir λ / capacidad", en: "Add λ / capacity", objetivo: "enlace",
      params: ["n", "gbps", "hasta_min"] },
    { id: "priorizar_slice", origen: "accion", es: "Priorizar slice", en: "Prioritise slice", objetivo: "slice|clase:x|demanda",
      params: ["prioridad", "hasta_min"] },
    { id: "apagar_capa", origen: "accion", es: "Apagar capa radio", en: "Switch off radio layer", objetivo: "n258|n78|n28",
      params: ["hasta_min"] }
  ];
  var TIPO_EV = {};
  TIPOS_EVENTO.forEach(function (t) { TIPO_EV[t.id] = t; });
  // Supuesto de cada tipo (clave estable del registro, ámbito "eventos")
  var SUP_TIPO = { degradar: "evt.degradar", evento_demanda: "evt.ventana_evento", te_reencaminar: "evt.te_reoptimizar",
    activar_ntn: "evt.ntn_rescate", anadir_lambda: "evt.modulo_ampliacion", priorizar_slice: "evt.prioridad_slice",
    apagar_capa: "evt.apagar_capa" };
  // v7 §6.4.4: un λ = un miembro 400GE del LAG; v7 §6.4.1: plan óptico de 2 enlaces × 7 λ por vano (tope 14 λ).
  var LAMBDA_GBPS = 400, LAMBDA_MAX = 14;
  // [Supuesto evt.modulo_ampliacion] módulo de los enlaces sin λ: backhaul e IX n × 100GE (como su dimensionado),
  // acceso de servicio 10GbE (UNI de la v7 §6.9), satélite un terminal OneWeb más (100 Mbit/s, v7 §6.11).
  var MODULO_TIPO = { backhaul: 100, ix: 100, acceso: 10, sat: 0.1 };
  // v7 §6.11: el satélite lleva voz, telemetría del hospital (sin objetivo de 10 ms) y gestión; ≥100/20 Mbit/s por terminal
  var NTN_PRIORITARIOS = { "S-HOSPITAL-CRITICO": 1 };
  var NTN_SERVICIO = "S-NTN-EMERGENCIA", NTN_UL_FRAC = 0.2;

  function copiaPlana(o) { var x = {}, k; for (k in (o || {})) x[k] = o[k]; return x; }
  function finEvento(e) {
    var p = e.params || {};
    if (typeof p.hasta_min === "number") return p.hasta_min;
    if (typeof p.duracion_min === "number") return e.t_min + p.duracion_min;
    return undefined;
  }
  // Terminales satélite: enlaces tipo "sat" (extremo a = nodo con terminal, b = hub) y zonas que cubre cada uno
  function terminalesNTN(RED) {
    var zonaDe = {}, out = [];
    (RED.zonas || []).forEach(function (z) {
      if (z.agg) (zonaDe[z.agg] || (zonaDe[z.agg] = [])).push(z.id);
      if (z.edge) (zonaDe[z.edge] || (zonaDe[z.edge] = [])).push(z.id);
    });
    (RED.enlaces || []).forEach(function (l) {
      if (!l || l.tipo !== "sat") return;
      out.push({ enlace: l.id, nodo: l.a, hub: l.b, zonas: zonaDe[l.a] || [] });
    });
    return out;
  }

  // opciones.acciones → estado A que usa calcular()
  function normalizarAcciones(RED, lista, esc) {
    var A = { n: 0, fallos: [], degradar: {}, lambdas: {}, ov: null, pico: {}, te: [], teExcl: null, ntn: null,
      prio: [], apagar: {}, claves: [], avisos: [], aplicadas: [] };
    if (!Array.isArray(lista) || !lista.length) return A;
    var nodos = {}, enl = {}, escs = {};
    (RED.nodos || []).forEach(function (n) { nodos[n.id] = n; });
    (RED.enlaces || []).forEach(function (l) { enl[l.id] = l; });
    (RED.escenarios || []).forEach(function (e) { escs[e.id] = e; });
    function clave(k) { if (A.claves.indexOf(k) < 0) A.claves.push(k); }
    function aviso(t) { A.avisos.push(t); }
    var miembros = {};
    lista.forEach(function (a) {
      if (!a || !TIPO_EV[a.tipo]) { if (a) aviso("Tipo de evento desconocido: " + a.tipo); return; }
      var p = a.params || {}, id = a.id;
      A.n++;
      A.aplicadas.push({ tipo: a.tipo, id: id || null });
      if (SUP_TIPO[a.tipo]) clave(SUP_TIPO[a.tipo]);
      switch (a.tipo) {
        case "fallo": if (id) A.fallos.push(id); break;
        case "reparacion": break;   // en calcular puntual no hay nada que levantar
        case "degradar":
          if (!nodos[id] && !enl[id]) { aviso("degradar: elemento desconocido " + id); break; }
          if (typeof p.miembros_caidos === "number" && enl[id] && enl[id].canales_400g) {
            miembros[id] = (miembros[id] || 0) + p.miembros_caidos;
          } else {
            var f = typeof p.factor === "number" ? Math.max(0, p.factor) : 0.5;
            A.degradar[id] = (A.degradar[id] === undefined ? 1 : A.degradar[id]) * f;
          }
          break;
        case "evento_demanda":
          var e = escs[id];
          if (!e) { aviso("evento_demanda: escenario desconocido " + id); break; }
          if ((e.fallos || []).length) aviso("evento_demanda " + id + ": se aplican sus factores, no sus fallos (use eventos de fallo)");
          A.ov = A.ov || {};
          Object.keys(e.factores || {}).forEach(function (k) {
            A.ov[k] = e.factores[k];
            if (k.indexOf("tipo:") !== 0 && k.indexOf("slice:") !== 0 && e.factores[k] > 0) A.pico[k] = 1;
          });
          break;
        case "te_reencaminar":
          if (!enl[id]) { aviso("te_reencaminar: enlace desconocido " + id); break; }
          A.te.push({ id: id, f: typeof p.fraccion === "number" ? Math.max(0, Math.min(1, p.fraccion)) : 1,
            origen: p.origen || null, destino: p.destino || null });
          (A.teExcl || (A.teExcl = {}))[id] = true;
          break;
        case "activar_ntn":
          var ts = terminalesNTN(RED), sel = ts.filter(function (t) {
            return !id || id === "*" || t.enlace === id || t.nodo === id || t.zonas.indexOf(id) >= 0;
          });
          if (!sel.length) { if (id) aviso("activar_ntn: " + id + " no tiene terminal; se activan todos"); sel = ts; }
          A.ntn = A.ntn || {};
          sel.forEach(function (t) { A.ntn[t.enlace] = t; });
          break;
        case "anadir_lambda":
          var l = enl[id];
          if (!l || !esCap(l.capacidad_gbps)) { aviso("anadir_lambda: enlace desconocido o sin capacidad " + id); break; }
          var g;
          if (typeof p.gbps === "number") g = p.gbps;
          else if (l.canales_400g) {
            var ya = Math.round((A.lambdas[id] || 0) / LAMBDA_GBPS), nl = typeof p.n === "number" ? Math.round(p.n) : 1;
            nl = Math.min(nl, LAMBDA_MAX - l.canales_400g - ya);
            if (nl <= 0 && (typeof p.n !== "number" || p.n > 0)) { aviso("anadir_lambda: " + id + " ya tiene " + LAMBDA_MAX + " λ (2 × 7, v7 §6.4.1)"); break; }
            g = nl * LAMBDA_GBPS;
          } else g = (typeof p.n === "number" ? p.n : 1) * num(MODULO_TIPO[l.tipo], 100);
          A.lambdas[id] = (A.lambdas[id] || 0) + g;
          break;
        case "priorizar_slice":
          var sel2 = id || p.slice || p.clase;
          if (!sel2) { aviso("priorizar_slice: sin slice"); break; }
          A.prio.push({ sel: sel2, prioridad: typeof p.prioridad === "number" ? p.prioridad : 0 });
          break;
        case "apagar_capa":
          var tec = id || p.tec;
          if (ORDEN_CAPAS.indexOf(tec) < 0) { aviso("apagar_capa: solo capas radio " + ORDEN_CAPAS.join("/") + " (" + tec + ")"); break; }
          A.apagar[tec] = 1;
          break;
      }
    });
    // LAG (v7 §6.4.4): con un miembro menos sigue con N−1; min-links = N−1, así que con dos o más caídos el LAG cae y actúa el FRR
    Object.keys(miembros).forEach(function (id) {
      var N = enl[id].canales_400g + Math.round((A.lambdas[id] || 0) / LAMBDA_GBPS), k = Math.min(miembros[id], N);
      if (k >= 2) { A.fallos.push(id); A.lagCaidos = A.lagCaidos || {}; A.lagCaidos[id] = k; }
      else if (k > 0) A.degradar[id] = (A.degradar[id] === undefined ? 1 : A.degradar[id]) * (N - k) / N;
    });
    if (A.ntn) {   // el satélite de emergencia (S-NTN-EMERGENCIA, inactivo por defecto) entra como en E-INCIDENTE-NTN
      A.ov = A.ov || {};
      A.ov[NTN_SERVICIO] = 1; A.pico[NTN_SERVICIO] = 1;
    }
    return A;
  }
  function capEf(id, cap, A, l) {
    if (!esCap(cap)) return null;
    var c = cap + (A.lambdas[id] || 0);
    if (A.degradar[id] !== undefined) c *= A.degradar[id];
    return Math.max(0, c);
  }
  function casaPrio(p, d) {
    var s = p.sel;
    if (s.indexOf("clase:") === 0) return d.clase_servicio === s.slice(6);
    if (s.indexOf("tipo:") === 0) return d.tipo === s.slice(5);
    return d.slice === s || (d.padre || d.id) === s || d.id === s || d.zona === s;
  }
  function casaTE(t, b) {
    if (t.origen && b.origen !== t.origen && b.zona !== t.origen) return false;
    if (t.destino && b.core_fijo !== t.destino && b.edge !== t.destino && b.destino_fijo !== t.destino) return false;
    return true;
  }
  // Mezcla de rutas: (1 − f) por la ruta normal y f por la reencaminada
  function mezclarRutas(r, x, f) {
    if (!x) return r;
    if (!r || f >= 1 - 1e-9) return x;
    var cams = r.caminos.map(function (c) { var y = copiaPlana(c); y.peso = c.peso * (1 - f); return y; })
      .concat(x.caminos.map(function (c) { var y = copiaPlana(c); y.peso = c.peso * f; return y; }));
    var main = cams[0], lat = 0;
    cams.forEach(function (c) { if (c.peso > main.peso + EPS) main = c; lat = Math.max(lat, c.latencia); });
    return { destino: main.destino, ruta: main.ruta, enlaces: main.enlaces, latencia: lat, caminos: cams,
      reglas: [].concat(r.reglas || [], x.reglas || []) };
  }

  function resolverOpciones(RED, opciones) {
    opciones = traducirCaso(RED, opciones || {});
    var esc = null;
    if (opciones.escenario) {
      (RED.escenarios || []).forEach(function (e) { if (e.id === opciones.escenario) esc = e; });
    }
    var hora = typeof opciones.hora === "number" ? opciones.hora :
      (esc && typeof esc.hora === "number" ? esc.hora : null);
    var fallos = [].concat((esc && esc.fallos) || [], opciones.fallos || []);
    // fallos_exactos (uso interno de serie(): fallos del caso ± eventos ya resueltos) sustituye a la lista
    if (Array.isArray(opciones.fallos_exactos)) fallos = opciones.fallos_exactos.slice();
    // Revisión 7: acciones/eventos activos (fallos que añaden, p. ej. LAG por debajo de min-links)
    var A = normalizarAcciones(RED, opciones.acciones, esc);
    if (A.fallos.length) fallos = fallos.concat(A.fallos);
    // hora_cargada: todas las demandas en su hora cargada a la vez (reproduce las tablas de dimensionado)
    var cargada = !!(opciones.hora_cargada || (esc && esc.hora_cargada));
    // perfil_horario (uso de serie()): un caso de hora cargada se recorre con los perfiles horarios
    // (supuesto dem.serie_hora_cargada). Sin esta opción la hora cargada no cambia.
    var forzarHoraria = !!opciones.perfil_horario, forzada = false;
    if (forzarHoraria && cargada) { cargada = false; forzada = true; }
    var reparto = opciones.reparto_core || (esc && esc.reparto_core) ||
      (RED.meta && RED.meta.reparto_core) || "equitativo";
    var escFac = esc && esc.factores;
    if (A.ov && escFac) {   // evento_demanda / NTN: sus factores sustituyen a los del escenario base para esas claves
      escFac = {};
      Object.keys(esc.factores).forEach(function (k) { if (!(k in A.ov)) escFac[k] = esc.factores[k]; });
    }
    var factores = [escFac, opciones.factores, A.ov], perfiles = null, avisoModelo = null, modeloInfo = null;
    // Modelo de tráfico (modelos.js, PLAN_v2 §4): añade factores (año, pico, día, pendular) y perfiles por demanda
    if (opciones.modelo) {
      var Mo = typeof Modelos !== "undefined" ? Modelos :
        (typeof require !== "undefined" ? require("./modelos.js") : null);
      if (Mo) {
        var aj = Mo.ajustar(RED, opciones.modelo, hora, !!esc, forzarHoraria ? { forzar_horaria: true } : null);
        factores.push(aj.factores);
        perfiles = aj.perfiles;
        if (aj.forzada) forzada = true;
        if (aj.cargada) cargada = true; else if (aj.hora !== undefined && aj.hora !== null) hora = aj.hora;
        avisoModelo = aj.aviso || null;
        modeloInfo = { id: opciones.modelo.id || "BH", anio: opciones.modelo.anio || null, dia: opciones.modelo.dia || "laborable",
          def: aj.def || null, cargada: !!aj.cargada };
      } else avisoModelo = "modelos.js no cargado: se ignora el modelo de tráfico";
    }
    if (forzada && (hora === null || hora === undefined)) hora = 21;
    // Revisión 8: modelo de demanda del usuario (encima del caso)
    var MU = opciones.modelo_usuario && typeof opciones.modelo_usuario === "object" ? compilarMU(RED, opciones.modelo_usuario) : null;
    if (MU) factores.push(MU.factores);
    return { esc: esc, escId: opciones.escenario || null, hora: hora, fallos: fallos, rutas: modoRutas(RED, opciones),
      factores: factores, cargada: cargada, reparto: reparto, perfiles: perfiles, avisoModelo: avisoModelo, modelo: modeloInfo,
      forzada: forzada, cache: opciones._cache || null, A: A, MU: MU };
  }

  // ---------- procedencia: supuestos de los que depende cada resultado (CONTRATO_UI Revisión 3) ----------
  // RED.supuestos (fusionar.py) trae {id: "S-xxx", clave: "ámbito.tema", …}. El motor recoge los `s` de los `proc`
  // de los datos que usa cada demanda y añade las claves de las reglas que se activan en ese caso.
  var SUP_CONDICIONAL = { "dem.perfiles_horarios": 1 };   // solo cuentan si se usa la forma horaria
  function mapaSupuestos(RED) {
    var lista = RED.supuestos;
    if (!lista || !lista.length) return { porClave: {}, ids: {} };
    if (lista.__mapa) return lista.__mapa;
    var m = { porClave: {}, ids: {} };
    lista.forEach(function (x) { if (x && x.id) { m.ids[x.id] = x.clave || x.id; if (x.clave) m.porClave[x.clave] = x.id; } });
    try { Object.defineProperty(lista, "__mapa", { value: m, enumerable: false }); } catch (e) { /* objeto congelado */ }
    return m;
  }
  // S-ids de los proc de un objeto de datos (sin los condicionales)
  function supsDeProc(o, M, out) {
    var p = o && o.proc;
    if (!p) return out;
    for (var k in p) {
      var s = p[k] && p[k].s;
      if (s && M.ids[s] && out.indexOf(s) < 0 && !SUP_CONDICIONAL[M.ids[s]]) out.push(s);
    }
    return out;
  }
  function anadir(lista, ids) { for (var i = 0; i < ids.length; i++) if (ids[i] && lista.indexOf(ids[i]) < 0) lista.push(ids[i]); }

  // activar_ntn (Revisión 7, supuesto evt.ntn_rescate): cada terminal OneWeb activo (enlace "sat" desde su AGG/Edge al hub)
  // lleva las demandas prioritarias (v7 §6.11: voz y telemetría del hospital) de sus zonas que se han quedado sin ruta
  // terrestre, hasta su capacidad (100/20 Mbit/s por terminal), por orden de prioridad. Necesita vivos el terminal, el hub
  // y la salida del hub a un DC. Lo que pasa por el satélite cuenta como servido (estado "degradado" si no llega al 99 %).
  function rescateNTN(G, A, dem, enlacesOut, caidosN, caidosL, alertas) {
    var out = { terminales: {}, demandas: [], gbps: 0 };
    var salidaHub = {};
    G.enlaces.forEach(function (l) {
      if (l.tipo === "sat") return;
      [["a", "b"], ["b", "a"]].forEach(function (x) {
        var hub = l[x[0]], otro = l[x[1]];
        if (G.nodos[hub] && G.nodos[hub].tipo === "ix" && G.nodos[otro] && G.nodos[otro].tipo === "core" &&
            !caidosN[otro] && !caidosL[l.id] && !(enlacesOut[l.id] && enlacesOut[l.id].caido)) salidaHub[hub] = l.id;
      });
    });
    Object.keys(A.ntn).sort().forEach(function (lid) {
      var t = A.ntn[lid], e = enlacesOut[lid];
      var vivo = e && !caidosN[t.nodo] && !caidosN[t.hub] && !caidosL[lid] && salidaHub[t.hub];
      var o = { nodo: t.nodo, zonas: t.zonas, activo: !!vivo, capacidad_gbps: e ? e.capacidad_gbps : 0, dl_gbps: 0, ul_gbps: 0, demandas: [] };
      out.terminales[lid] = o;
      if (!vivo) return;
      var lista = dem.filter(function (d) {
        if (d.estado !== "caido" || d.dl_gbps <= EPS) return false;
        if (!(d.clase_servicio === "voz" || NTN_PRIORITARIOS[d.padre || d.id])) return false;
        return d.origen === t.nodo || (d.zona && t.zonas.indexOf(d.zona) >= 0);
      }).sort(function (a, b) { return (a.prioridad - b.prioridad) || (a.dl_gbps - b.dl_gbps); });
      var capD = num(e.capacidad_gbps, 0), capU = capD * NTN_UL_FRAC, hubL = enlacesOut[salidaHub[t.hub]];
      // sentido DL: del hub al terminal
      var sdl = G.enlacePorId[lid].a === t.nodo ? "ba" : "ab", sul = sdl === "ab" ? "ba" : "ab";
      lista.forEach(function (d) {
        var s = Math.min(d.dl_gbps * d.h, Math.max(0, capD - o.dl_gbps)), su = Math.min(d.ul_gbps * d.h, Math.max(0, capU - o.ul_gbps));
        if (s <= EPS && su <= EPS) return;
        o.dl_gbps += s; o.ul_gbps += su;
        d.servida_gbps = s / d.h; d.servida_ul_gbps = su / d.h; d.via = "ntn"; d.ntn = lid;
        d.estado = d.servida_gbps < 0.99 * d.dl_gbps ? "degradado" : "ok";
        o.demandas.push(d.id); out.demandas.push(d.id);
        e["carga_" + sdl] += s; e["carga_" + sul] += su;
        e.por_servicio[d.clase_servicio][sdl] += s; e.por_servicio[d.clase_servicio][sul] += su;
        if (e.demandas.indexOf(d.id) < 0) e.demandas.push(d.id);
        if (hubL) {
          var hdl = G.enlacePorId[salidaHub[t.hub]].a === t.hub ? "ba" : "ab";
          hubL["carga_" + hdl] += s; hubL["carga_" + (hdl === "ab" ? "ba" : "ab")] += su;
          if (hubL.demandas.indexOf(d.id) < 0) hubL.demandas.push(d.id);
        }
      });
      out.gbps += o.dl_gbps;
    });
    var nt = Object.keys(out.terminales).filter(function (k) { return out.terminales[k].activo; }).length;
    alertas.push({ nivel: "info", texto: "Satélite NTN activo (" + nt + " terminal" + (nt === 1 ? "" : "es") + "): " +
      out.demandas.length + " demandas prioritarias por satélite (" + fmt(out.gbps * 1000, 0) + " Mbit/s)" });
    return out;
  }

  // ---------- modelo de demanda del usuario (CONTRATO_UI Revisión 8, PLAN_v3 §4) ----------
  // opciones.modelo_usuario = {id, nombre, perfiles:{clave:[24]}, factores:{clave:f}, crecimiento:{clase|"*": CAGR}, anio_base, anio,
  //   prioridades:{demanda|servicio: p}, ruido:{sigma, semilla}, movilidad:{activa, fraccion, presencia?, origen_destino?},
  //   eventos_demanda?:[{t_min, id, params}], proc?:{clave: {t:"usuario", f}}}. Se aplica encima del caso (LAB).
  // Claves de perfiles (de más a menos concreta): id de demanda/servicio · "perfil|zona" · "clase|zona" · "*|zona" · perfil · clase · "*".
  //   perfil = nombre de RED.perfiles / perfiles_extra (con modelo horario, el móvil y la voz usan "movil-<tipo de zona>"); clase = clase
  //   de servicio (movil, ftth, voz, urllc, iot, empresa, evento, ntn). La curva sustituye a la forma horaria (supuesto mod.perfil_usuario).
  // Claves de factores: zona · demanda/servicio · "tipo:x" · "slice:x" (como los escenarios) · "clase:x" o el nombre de la clase.
  var SUP_MU = { perfil: "mod.perfil_usuario", ruido: "mod.ruido_lognormal", mov: "mod.movilidad", crec: "mod.crecimiento_cagr",
    mc: "mod.montecarlo" };
  var MOV_TIPOS = ["movil-ebb", "voz-ims"], MOV_FRACCION = 0.2;
  function esArr24(a) {
    if (!a || a.length !== 24) return false;
    for (var i = 0; i < 24; i++) if (typeof a[i] !== "number" || !isFinite(a[i])) return false;
    return true;
  }
  function compilarMU(RED, mu) {
    var C = { mu: mu, perfiles: {}, factores: {}, clase: {}, crec: {}, prio: {}, ruido: null, mov: null, avisos: [], nPerf: 0, nFac: 0 };
    var zonas = {}, ids = {};
    (RED.zonas || []).forEach(function (z) { zonas[z.id] = z; (z.necesidades || []).forEach(function (n) { ids[n.id] = 1; }); });
    (RED.servicios || []).forEach(function (s) { ids[s.id] = 1; });
    Object.keys(mu.perfiles || {}).forEach(function (k) {
      var a = mu.perfiles[k];
      if (!esArr24(a)) { C.avisos.push("Perfil «" + k + "» ignorado: necesita 24 valores numéricos"); return; }
      C.perfiles[k] = a.map(function (x) { return Math.max(0, x); }); C.nPerf++;
    });
    Object.keys(mu.factores || {}).forEach(function (k) {
      var f = mu.factores[k];
      if (typeof f !== "number" || !isFinite(f) || f < 0) { C.avisos.push("Factor «" + k + "» ignorado: " + f); return; }
      C.nFac++;
      var m = /^clase:(.+)$/.exec(k);
      if (m) { C.clase[m[1]] = f; return; }
      if (CLASES_SERVICIO.indexOf(k) >= 0 && !zonas[k] && !ids[k]) { C.clase[k] = f; return; }
      if (!(zonas[k] || ids[k] || /^(tipo|slice):/.test(k))) C.avisos.push("Factor «" + k + "»: clave que no casa con ninguna zona, demanda ni servicio");
      C.factores[k] = f;
    });
    var anio = num(mu.anio, null), base = num(mu.anio_base, 2031);
    Object.keys(mu.crecimiento || {}).forEach(function (k) {
      var g = mu.crecimiento[k];
      if (typeof g !== "number" || !isFinite(g) || g <= -1) { C.avisos.push("Crecimiento «" + k + "» ignorado: " + g); return; }
      C.crec[k] = g;
    });
    C.anio = anio; C.anio_base = base;
    Object.keys(mu.prioridades || {}).forEach(function (k) {
      var p = mu.prioridades[k];
      if (typeof p === "number" && isFinite(p)) C.prio[k] = p;
    });
    var rz = mu.ruido;
    if (rz && typeof rz.sigma === "number" && rz.sigma > 0) C.ruido = { sigma: Math.min(rz.sigma, 2), semilla: rz.semilla === undefined || rz.semilla === null ? 1 : rz.semilla };
    var mv = mu.movilidad;
    if (mv && mv.activa !== false && (mv.activa || mv.fraccion !== undefined || mv.origen_destino)) {
      var MT = RED.modelos_trafico || {}, pe = MT.pendular || {};
      C.mov = { fraccion: mv.fraccion === undefined ? MOV_FRACCION : mv.fraccion,
        presencia: esArr24(mv.presencia) ? mv.presencia : (esArr24(pe.presencia) ? pe.presencia : null),
        od: mv.origen_destino || null, tz: MT.tipos_zona || {}, tipos: Array.isArray(mv.tipos) ? mv.tipos : MOV_TIPOS };
      if (!C.mov.presencia) { C.avisos.push("Movilidad sin perfil de presencia (RED.modelos_trafico.pendular.presencia): no se aplica"); C.mov = null; }
    }
    C.proc = mu.proc || {};
    C.fuente = mu.fuente || mu.nombre || mu.id || "modelo de usuario";
    return C;
  }
  // Nombre del perfil con el que va la demanda en este caso (el del modelo horario si lo hay)
  function nombrePerfilMU(RED, b, conModelo) {
    if (conModelo && (b.tipo === "movil-ebb" || b.tipo === "voz-ims")) {
      var tz = (RED.modelos_trafico && RED.modelos_trafico.tipos_zona) || {};
      return "movil-" + (tz[b.zona] || "residencial");
    }
    return b.perfil || null;
  }
  function perfilMU(C, b, nombre) {
    var P = C.perfiles, id = b.padre || b.id, z = b.zona, cl = b.clase_servicio;
    var claves = [id];
    if (z) { if (nombre) claves.push(nombre + "|" + z); claves.push(cl + "|" + z, "*|" + z); }
    if (nombre) claves.push(nombre);
    claves.push(cl, "*");
    for (var i = 0; i < claves.length; i++) if (P[claves[i]]) return { k: claves[i], arr: P[claves[i]] };
    return null;
  }
  // Multiplicador por clase de servicio y crecimiento CAGR: (1 + g)^(año − año_base)
  function multMU(C, b, anioCaso) {
    var f = 1, cl = b.clase_servicio, crec = false, clase = false;
    if (typeof C.clase[cl] === "number") { f *= C.clase[cl]; clase = true; }
    var g = typeof C.crec[cl] === "number" ? C.crec[cl] : C.crec["*"];
    var anio = C.anio !== null ? C.anio : (anioCaso || 2031);
    if (typeof g === "number" && anio !== C.anio_base) { f *= Math.pow(1 + g, anio - C.anio_base); crec = true; }
    return { f: f, crec: crec, clase: clase };
  }
  // Ruido lognormal determinista: z ~ N(0,1) de un generador con semilla (FNV-1a de "semilla|demanda|t" → mulberry32 → Box-Muller);
  // factor = exp(σ z − σ²/2) (media 1). Misma (semilla, demanda, paso) → mismo factor en node, navegador y worker.
  function hash32(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normalDet(clave) {
    var r = mulberry32(hash32(clave)), u1 = r(), u2 = r();
    if (u1 < 1e-12) u1 = 1e-12;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  function factorRuido(sigma, semilla, id, t) {
    var z = normalDet(String(semilla) + "|" + id + "|" + t);
    return Math.exp(sigma * z - sigma * sigma / 2);
  }
  // Movilidad pendular (supuesto mod.movilidad): una fracción f × presencia(h) de la demanda móvil (eMBB y voz IMS) de cada zona
  // residencial se traslada a las zonas de oficinas/mixtas (Centro) en proporción a su demanda del mismo tipo, o según origen_destino
  // ({origen: {destino: peso}}). Se conserva el total (DL); el UL de cada grupo se escala con el mismo factor.
  function aplicarMovilidad(C, dem, hora, marcar) {
    var M = C.mov, out = { gbps: 0, presencia: 0 };
    if (!M || hora === null || hora === undefined) return out;
    var pres = valorPerfil(M.presencia, hora, 0);
    out.presencia = pres;
    if (!(pres > 0)) return out;
    M.tipos.forEach(function (tipo) {
      var grupos = {};
      dem.forEach(function (d, i) {
        if (d.clase !== "necesidad" || d.tipo !== tipo || !d.zona) return;
        var g = grupos[d.zona] || (grupos[d.zona] = { idx: [], dl: 0 });
        g.idx.push(i); g.dl += d.dl_gbps;
      });
      var zs = Object.keys(grupos).sort(), od = {};
      if (M.od) Object.keys(M.od).forEach(function (o) { od[o] = M.od[o]; });
      else {
        var dests = zs.filter(function (z) { var t = M.tz[z] || "residencial"; return t === "oficinas" || t === "mixto"; });
        zs.forEach(function (z) {
          if ((M.tz[z] || "residencial") !== "residencial") return;
          var w = {};
          dests.forEach(function (x) { w[x] = grupos[x].dl; });
          od[z] = w;
        });
      }
      var escala = {};
      Object.keys(od).sort().forEach(function (o) {
        var go = grupos[o];
        if (!go || !(go.dl > EPS)) return;
        var f = typeof M.fraccion === "number" ? M.fraccion : num(M.fraccion && M.fraccion[o], 0);
        var s = Math.max(0, Math.min(1, f * pres));
        var pesos = od[o] || {}, tot = 0;
        Object.keys(pesos).forEach(function (x) { if (x !== o && grupos[x] && grupos[x].dl > EPS && pesos[x] > 0) tot += pesos[x]; });
        if (!(s > 0) || !(tot > 0)) return;
        var movido = s * go.dl;
        escala[o] = (escala[o] || 0) - movido;
        Object.keys(pesos).forEach(function (x) {
          if (x === o || !grupos[x] || !(grupos[x].dl > EPS) || !(pesos[x] > 0)) return;
          escala[x] = (escala[x] || 0) + movido * pesos[x] / tot;
        });
        out.gbps += movido;
      });
      Object.keys(escala).forEach(function (z) {
        var g = grupos[z], k = 1 + escala[z] / g.dl;
        if (k < 0) k = 0;
        g.idx.forEach(function (i) { dem[i].dl_gbps *= k; dem[i].ul_gbps *= k; marcar(i, SUP_MU.mov); });
      });
    });
    return out;
  }

  // ---------- cálculo principal ----------
  function calcular(RED, opciones) {
    var op = resolverOpciones(RED, opciones);
    // _cache (uso interno de serie()): grafo, demandas base y rutas no dependen de la hora; se reutilizan entre pasos
    var C = op.cache, ck = op.reparto + "|" + op.rutas, CE = null;
    if (C) { CE = C[ck] || (C[ck] = { G: construirGrafo(RED), base: null, rutas: {} }); }
    var G = CE ? CE.G : construirGrafo(RED);
    var base = CE ? (CE.base || (CE.base = expandirCores(G, demandasBase(RED), op.reparto))) : expandirCores(G, demandasBase(RED), op.reparto);
    var alertas = [];

    if (op.escId && !op.esc) alertas.push({ nivel: "aviso", texto: "Escenario desconocido: " + op.escId });
    if (op.avisoModelo) alertas.push({ nivel: "aviso", texto: op.avisoModelo });
    var A = op.A;
    A.avisos.forEach(function (t) { alertas.push({ nivel: "aviso", texto: t }); });

    // Fallos
    var caidosN = {}, caidosL = {}, hayFallos = false, vistos = {};
    op.fallos.forEach(function (id) {
      if (vistos[id]) return; vistos[id] = true;
      if (G.nodos[id]) { caidosN[id] = true; hayFallos = true; }
      else if (G.enlacePorId[id]) { caidosL[id] = true; hayFallos = true; }
      else alertas.push({ nivel: "aviso", texto: "Elemento en fallo desconocido: " + id });
    });

    // Rutas sin fallos y con fallos
    function rutasDe(cN, cL, clave, excl) {
      if (!CE) return enrutar(G, base, cN, cL, op.rutas, excl);
      return CE.rutas[clave] || (CE.rutas[clave] = enrutar(G, base, cN, cL, op.rutas, excl));
    }
    var rutasBase = rutasDe({}, {}, "");
    var claveF = Object.keys(caidosN).sort().join(",") + "|" + Object.keys(caidosL).sort().join(",");
    var rutasF = hayFallos ? rutasDe(caidosN, caidosL, claveF) : rutasBase, rutas = rutasF;
    // te_reencaminar (Revisión 7): las demandas que casan van (en la fracción pedida) por rutas sin los enlaces excluidos
    if (A.te.length) {
      var rutasTE = rutasDe(caidosN, caidosL, claveF + "|te:" + Object.keys(A.teExcl).sort().join(","), A.teExcl);
      rutas = rutasF.map(function (r, i) {
        var f = 0;
        A.te.forEach(function (t) { if (casaTE(t, base[i])) f = Math.max(f, t.f); });
        return f > 0 ? mezclarRutas(r, rutasTE[i], f) : r;
      });
    }

    // Estructuras de salida
    var enlacesOut = {}, nodosOut = {}, residualL = {}, residualN = {}, ofertaL = {}, ofertaN = {};
    G.enlaces.forEach(function (l) {
      var cap = capEf(l.id, l.capacidad_gbps, A);
      // Enlaces full duplex: carga por sentido (ab = a→b, ba = b→a); carga_gbps = sentido más cargado (v7 A11.4)
      enlacesOut[l.id] = { carga_gbps: 0, carga_ab: 0, carga_ba: 0, capacidad_gbps: cap, ocupacion: 0,
        caido: !!(caidosL[l.id] || caidosN[l.a] || caidosN[l.b]), demandas: [], demanda_gbps: 0,
        virtual: !!l.virtual, por_servicio: nuevoPorServicio() };
      residualL[l.id] = { ab: cap === null ? Infinity : cap, ba: cap === null ? Infinity : cap };
      ofertaL[l.id] = { ab: 0, ba: 0 };
    });
    G.ordenNodos.forEach(function (id) {
      var n = G.nodos[id], cap = capEf(id, n.capacidad_gbps, A);
      nodosOut[id] = { carga_gbps: 0, capacidad_gbps: cap, ocupacion: 0, caido: !!caidosN[id],
        demandas: [], absorbe_de: [], demanda_gbps: 0 };
      residualN[id] = cap === null ? Infinity : cap;
      ofertaN[id] = 0;
    });

    // Demandas con valor de la hora
    var MU = op.MU, muClaves = [], muUsu = [];
    var dem = base.map(function (b, i) {
      var r = rutas[i], rb = rutasBase[i], rf = rutasF[i];
      var pp = op.perfiles && op.perfiles[b.padre || b.id];
      // evento_demanda / NTN activos: sus servicios a su valor de pico (perfil = 1) mientras dura la ventana (evt.ventana_evento)
      var ph = (op.cargada || A.pico[b.padre || b.id]) ? 1 : (pp ? valorPerfil(pp, op.hora, 1) : perfilDe(RED, b.perfil, op.hora));
      var fmu = 1;
      if (MU) {   // Revisión 8: curva del usuario (sustituye la forma horaria) y factores por clase / crecimiento
        var cl = muClaves[i] = [], pu = [];
        if (!op.cargada && !A.pico[b.padre || b.id] && typeof op.hora === "number") {
          var up = perfilMU(MU, b, nombrePerfilMU(RED, b, !!op.perfiles));
          if (up) { ph = valorPerfil(up.arr, op.hora, 1); cl.push(SUP_MU.perfil); pu.push("perfiles." + up.k); }
        }
        var mm = multMU(MU, b, op.modelo && op.modelo.anio);
        fmu = mm.f;
        if (mm.crec) { cl.push(SUP_MU.crec); pu.push("crecimiento"); }
        if (mm.clase) pu.push("factores.clase:" + b.clase_servicio);
        var kid = b.padre || b.id;
        [b.zona, kid, "tipo:" + b.tipo, b.slice ? "slice:" + b.slice : null].forEach(function (k) {
          if (k && typeof MU.factores[k] === "number") pu.push("factores." + k);
        });
        muUsu[i] = pu;
      }
      var f = ph * factorDe(b, op.factores) * (b.reparto || 1) * fmu;
      var dl = b.dl_gbps * f;
      var via = "principal";
      if (r && (!rb || firmaRuta(rb) !== firmaRuta(rf || r))) via = "respaldo";
      else if (r && r !== rf) via = "te";
      var caminos = r ? r.caminos.map(function (c) {
        return { peso: c.peso, destino: c.destino, ruta: c.ruta, enlaces: c.enlaces, latencia_ms: c.latencia,
          sds: c.enlaces.map(function (id, k) { return sentidoDL(G, c, k); }) };
      }) : [];
      var pesoRuta = 0;
      caminos.forEach(function (c) { pesoRuta += c.peso; });
      return { id: b.id, padre: b.padre || null, zona: b.zona, origen: b.origen, destino_nodo: r ? r.destino : null,
        destino: b.destino, tipo: b.tipo, clase: b.clase, prioridad: b.prioridad, slice: b.slice,
        clase_servicio: b.clase_servicio, regla_servicio: b.regla_servicio,
        dl_gbps: dl, ul_gbps: b.ul_gbps * f, h: cabeceraDe(RED, b), servida_gbps: 0, ruta: r ? r.ruta : [], enlaces: r ? r.enlaces : [],
        caminos: caminos, fraccion_con_ruta: pesoRuta,
        latencia_ms: r ? r.latencia : null, latencia_max_ms: b.latencia_max_ms,
        via: r ? via : "respaldo", estado: "ok" };
    });

    // Revisión 8: prioridades, movilidad pendular y ruido del modelo de usuario; procedencia "usuario" por demanda
    var muOut = null;
    if (MU) {
      var marcar = function (i, k) { if (muClaves[i].indexOf(k) < 0) muClaves[i].push(k); };
      dem.forEach(function (d, i) {
        var k = d.padre || d.id;
        if (typeof MU.prio[k] === "number") { d.prioridad_base = d.prioridad; d.prioridad = MU.prio[k]; muUsu[i].push("prioridades." + k); }
      });
      var mov = aplicarMovilidad(MU, dem, op.cargada ? null : op.hora, marcar);
      if (MU.ruido) {
        var tR = typeof op.hora === "number" && !op.cargada ? Math.round(op.hora * 60) : -1;
        dem.forEach(function (d, i) {
          var x = factorRuido(MU.ruido.sigma, MU.ruido.semilla, d.padre || d.id, tR);
          d.dl_gbps *= x; d.ul_gbps *= x; marcar(i, SUP_MU.ruido);
        });
      }
      var nUsu = 0;
      dem.forEach(function (d, i) {
        if (!muUsu[i].length) return;
        nUsu++;
        var f = muUsu[i].map(function (k) { var p = MU.proc[k]; return p && p.f ? p.f : k; })
          .filter(function (x, j, a) { return a.indexOf(x) === j; }).join(" · ");
        var pc = { t: "usuario", f: MU.fuente + ": " + f };
        d.proc_usuario = { dl_gbps: pc, ul_gbps: pc };
        if (muUsu[i].some(function (k) { return k.indexOf("prioridades.") === 0; })) d.proc_usuario.prioridad = pc;
      });
      muOut = { id: MU.mu.id || null, nombre: MU.mu.nombre || null, fuente: MU.fuente, avisos: MU.avisos.slice(),
        perfiles: MU.nPerf, factores: MU.nFac, demandas_usuario: nUsu, ruido: MU.ruido ? { sigma: MU.ruido.sigma, semilla: MU.ruido.semilla, t: tR } : null,
        movilidad: MU.mov ? { gbps_movidos: mov.gbps, presencia: mov.presencia } : null, supuestos: [] };
    }

    // priorizar_slice (Revisión 7): cambia la prioridad de la asignación voraz de las demandas que casan
    if (A.prio.length) dem.forEach(function (d) {
      A.prio.forEach(function (p) {
        if (!casaPrio(p, d)) return;
        if (d.prioridad_base === undefined) d.prioridad_base = d.prioridad;
        d.prioridad = p.prioridad;
      });
    });

    // Oferta por elemento (para % de demanda sobre capacidad)
    dem.forEach(function (d) {
      d.caminos.forEach(function (c) {
        c.enlaces.forEach(function (id, k) {
          var sd = c.sds[k];
          ofertaL[id][sd] += d.dl_gbps * d.h * c.peso; ofertaL[id][sd === "ab" ? "ba" : "ab"] += d.ul_gbps * d.h * c.peso;
        });
        c.ruta.forEach(function (id) { ofertaN[id] += (G.nodos[id].tipo === "edge" ? d.dl_gbps + d.ul_gbps : d.dl_gbps) * d.h * c.peso; });
      });
    });

    // Asignación voraz por prioridad (1 primero; empate por menor demanda). Cada camino lleva su peso de la demanda.
    var orden = [];
    dem.forEach(function (d, i) { if (d.caminos.length) orden.push(i); });
    orden.sort(function (a, b) {
      var A = dem[a], B = dem[b];
      return (A.prioridad - B.prioridad) || (A.dl_gbps - B.dl_gbps) || (A.id < B.id ? -1 : A.id > B.id ? 1 : 0);
    });
    var cuello = {}; // "L:id" | "N:id" -> { tipo, id, recortado, prios:{} }
    orden.forEach(function (i) {
      var d = dem[i], sTot = 0, suTot = 0, vL = {}, vN = {};
      d.caminos.forEach(function (c) {
        var minR = Infinity, cue = null, sds = c.sds;
        c.enlaces.forEach(function (id, k) { var x = residualL[id][sds[k]]; if (x < minR) { minR = x; cue = "L:" + id; } });
        // Edge: la NIC (N3 + N6) reparte su hueco entre DL y UL en proporción a la demanda
        var fDL = d.dl_gbps + d.ul_gbps > 0 ? d.dl_gbps / (d.dl_gbps + d.ul_gbps) : 1;
        c.ruta.forEach(function (id) {
          var x = G.nodos[id].tipo === "edge" ? residualN[id] * fDL : residualN[id];
          if (x < minR) { minR = x; cue = "N:" + id; } });
        // Carga física en la red = IP × cabecera (v7 §2.7.2); lo servido se cuenta en Gbit/s IP
        var pedido = d.dl_gbps * d.h * c.peso;
        var s = Math.max(0, Math.min(pedido, minR));
        var cut = pedido - s;
        if (cut > EPS && cue) {
          var cu = cuello[cue] || (cuello[cue] = { tipo: cue.charAt(0), id: cue.slice(2), recortado: 0, prios: {}, n: 0 });
          cu.recortado += cut; cu.prios[d.prioridad] = true; cu.n++;
        }
        // UL por el sentido contrario, limitado por lo que quede en ese sentido (no recorta el DL)
        var minU = Infinity;
        c.enlaces.forEach(function (id, k) { minU = Math.min(minU, residualL[id][sds[k] === "ab" ? "ba" : "ab"]); });
        c.ruta.forEach(function (id) { if (G.nodos[id].tipo === "edge") minU = Math.min(minU, residualN[id] - s); });
        var su = Math.max(0, Math.min(d.ul_gbps * d.h * c.peso, minU));
        sTot += s; suTot += su;
        c.enlaces.forEach(function (id, k) {
          var e = enlacesOut[id], sd = sds[k], su_ = sd === "ab" ? "ba" : "ab", ps = e.por_servicio[d.clase_servicio];
          residualL[id][sd] -= s; residualL[id][su_] -= su;
          e["carga_" + sd] += s; e["carga_" + su_] += su;
          ps[sd] += s; ps[su_] += su;
          if (!vL[id]) { vL[id] = 1; e.demandas.push(d.id); }
        });
        c.ruta.forEach(function (id) {
          // Edge: la NIC de la UPF ve N3 (UL) y N6 (DL) a la vez → carga = DL + UL con cabecera (v7 §6.7.5: 71,07 % de 400G en normal)
          var sn = G.nodos[id].tipo === "edge" ? s + su : s;
          residualN[id] -= sn; var n = nodosOut[id]; n.carga_gbps += sn;
          if (!vN[id]) { vN[id] = 1; n.demandas.push(d.id); }
        });
      });
      d.servida_gbps = sTot / d.h;
      d.servida_ul_gbps = suTot / d.h;
    });
    // Revisión 9: sentido DL de cada tramo, guardado aparte para la latencia con carga (latenciaCarga)
    var sdsDem = dem.map(function (d) { return d.caminos.map(function (c) { return c.sds; }); });
    dem.forEach(function (d) { d.caminos.forEach(function (c) { delete c.sds; }); });

    // Estados
    dem.forEach(function (d) {
      if (!d.ruta.length) d.estado = "caido";
      else if (d.dl_gbps > EPS && d.servida_gbps < 0.99 * d.dl_gbps) d.estado = "degradado";
      else if ((d.dl_gbps > EPS || d.ul_gbps > EPS) && d.fraccion_con_ruta < 0.99) d.estado = "degradado";
      else if (d.latencia_max_ms !== null && d.latencia_max_ms !== undefined && d.latencia_ms > d.latencia_max_ms) d.estado = "latencia";
      else d.estado = "ok";
    });
    var ntnOut = A.ntn ? rescateNTN(G, A, dem, enlacesOut, caidosN, caidosL, alertas) : null;

    // ---- Procedencia: supuestos de los que depende cada demanda y cada enlace ----
    var M = mapaSupuestos(RED), usados = [];
    function ids(claves) { var o = []; claves.forEach(function (k) { if (M.porClave[k]) o.push(M.porClave[k]); }); return o; }
    var fuenteDem = {};
    (RED.zonas || []).forEach(function (z) { (z.necesidades || []).forEach(function (n) { fuenteDem[n.id] = n; }); });
    (RED.servicios || []).forEach(function (sv) { fuenteDem[sv.id] = sv; });
    // Globales del caso: rutas LAB, forma horaria, modelo de tráfico, escenario
    var glob = [], globZona = [], globServ = [];
    if (op.rutas === "dijkstra") glob.push("mot.rutas_dijkstra");
    var usaHora = !op.cargada && op.hora !== null && op.hora !== undefined;
    if (usaHora && horaFraccionaria(op.hora)) glob.push("dem.interpolacion_horaria");
    if (op.forzada) glob.push("dem.serie_hora_cargada");
    var mo = op.modelo;
    if (mo) {
      glob.push("dem.modelo_" + String(mo.id).toLowerCase());
      if (mo.def && mo.def.pendular) glob.push("dem.pendular");
      var MT = RED.modelos_trafico || {}, td = (MT.tipos_dia || {})[mo.dia] || {};
      if (Object.keys(td.servicios || {}).length || Object.keys(td.perfil || {}).length) glob.push("dem.tipos_dia");
      if (!mo.cargada) globZona.push("dem.tipos_zona");
      if (mo.anio && mo.anio !== 2031) globServ.push("dem.crecimiento_servicios");
    }
    var escS = op.esc && op.esc.proc && op.esc.proc.definicion && op.esc.proc.definicion.s;
    var escF = op.esc && op.esc.factores ? Object.keys(op.esc.factores) : [];
    var gIds = ids(glob), gZ = ids(globZona), gS = ids(globServ);
    dem.forEach(function (d, i) {
      var src = fuenteDem[d.padre || d.id], dep = supsDeProc(src, M, []), r = rutas[i];
      if (d.clase === "necesidad" && M.porClave["top.agg_abstracto"]) anadir(dep, [M.porClave["top.agg_abstracto"]]);
      if (usaHora && src && src.proc && src.proc.perfil && M.ids[src.proc.perfil.s]) anadir(dep, [src.proc.perfil.s]);
      if (r && r.reglas && r.reglas.length) anadir(dep, ids(r.reglas));
      var rec = [];
      if (d.servida_gbps < d.dl_gbps - 1e-6 || (d.servida_ul_gbps !== undefined && d.servida_ul_gbps < d.ul_gbps - 1e-6)) rec.push("mot.voraz_prioridad");
      if (d.estado === "degradado") rec.push("mot.umbral_degradado");
      anadir(dep, ids(rec));
      anadir(dep, gIds);
      if (MU && muClaves[i] && muClaves[i].length) anadir(dep, ids(muClaves[i]));
      anadir(dep, d.clase === "necesidad" ? gZ : gS);
      if (escS && (!escF.length || escF.some(function (k) {
        return k === d.zona || k === (d.padre || d.id) || k === "tipo:" + d.tipo || k === "slice:" + d.slice; }))) anadir(dep, [escS]);
      dep.sort();
      d.depende = dep;
      anadir(usados, dep);
    });
    G.enlaces.forEach(function (l) {
      var e = enlacesOut[l.id], dep = [];
      var pc = l.proc && l.proc.capacidad_gbps;
      if (pc && M.ids[pc.s]) dep.push(pc.s);
      e.depende = dep;
    });
    dem.forEach(function (d) {
      if (!d.depende.length) return;
      var vistosL = {};
      d.caminos.forEach(function (c) {
        c.enlaces.forEach(function (id) { if (!vistosL[id]) { vistosL[id] = 1; anadir(enlacesOut[id].depende, d.depende); } });
      });
    });
    G.enlaces.forEach(function (l) { var dp = enlacesOut[l.id].depende; dp.sort(); anadir(usados, dp); });
    if (M.porClave["mot.clasificacion_servicio"]) anadir(usados, [M.porClave["mot.clasificacion_servicio"]]);
    if (escS) anadir(usados, [escS]);
    if (A.claves.length) anadir(usados, ids(A.claves));
    if (muOut) { muClaves.forEach(function (c) { if (c) anadir(muOut.supuestos, ids(c)); }); muOut.supuestos.sort(); anadir(usados, muOut.supuestos); }
    usados.sort();

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
          var dests = [];
          d.caminos.forEach(function (c) { if (c.destino !== id && dests.indexOf(c.destino) < 0) dests.push(c.destino); });
          dests.forEach(function (dn) {
            if (!migr[dn]) { migr[dn] = []; ordenMigr.push(dn); }
            migr[dn].push({ d: d, lb: rb.latencia });
          });
        } else if (d.via === "respaldo" && usaElemento(rb, id, !!caidosN[id])) {
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
          return d.estado === "caido" && rb && usaElemento(rb, id, !!caidosN[id]);
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
      var listaCaidas = caidas.slice(0, 5).map(function (d) { return d.id; }).join(", ") + (caidas.length > 5 ? "…" : "");
      var gb = 0; caidas.forEach(function (d) { gb += d.dl_gbps; });
      alertas.push({ nivel: "grave", texto: plural(caidas.length, "demanda sin ruta", "demandas sin ruta") +
        " (" + fmtG(gb) + " Gbit/s perdidos): " + listaCaidas });
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
    var dlTot = 0, servTot = 0, afectadas = 0, porServ = {}, vistosServ = {};
    CLASES_SERVICIO.forEach(function (c) { porServ[c] = { dl_gbps: 0, ul_gbps: 0, servida_gbps: 0, pct: 100, n: 0 }; });
    dem.forEach(function (d) {
      dlTot += d.dl_gbps; servTot += d.servida_gbps;
      var ps = porServ[d.clase_servicio];
      ps.dl_gbps += d.dl_gbps; ps.ul_gbps += d.ul_gbps; ps.servida_gbps += d.servida_gbps;
      if (!vistosServ[d.padre || d.id]) { vistosServ[d.padre || d.id] = 1; ps.n++; }   // n = demandas (sin contar subdemandas por DC)
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
    CLASES_SERVICIO.forEach(function (c) {
      var ps = porServ[c];
      ps.pct = ps.dl_gbps > EPS ? ps.servida_gbps / ps.dl_gbps * 100 : 100;
    });

    if (!alertas.length) alertas.push({ nivel: "info", texto: "Red sin incidencias: " + fmt(pctServ, 1) + " % de la demanda servida" });
    var pesoN = { grave: 0, aviso: 1, info: 2 };
    alertas.sort(function (a, b) { return pesoN[a.nivel] - pesoN[b.nivel]; });

    var res = {
      demandas: dem,
      enlaces: enlacesOut,
      nodos: nodosOut,
      zonas: zonasOut,
      resumen: {
        escenario: op.escId, hora: op.hora, fallos: Object.keys(vistos),
        dl_total_gbps: dlTot, servida_gbps: servTot, pct_servida: pctServ,
        enlaces_saturados: saturados, demandas_afectadas: afectadas,
        max_ocupacion: maxOc, enlace_max: enlaceMax,
        por_servicio: porServ,
        supuestos_usados: usados,
        alertas: alertas
      }
    };
    // Acceso por emplazamiento (Revisión 5): solo lee demandas y nodos; opciones.acceso === false lo omite
    if (A.n) res.acciones = { aplicadas: A.aplicadas, avisos: A.avisos, degradar: A.degradar, lambdas_gbps: A.lambdas,
      lag_caidos: A.lagCaidos || {}, te: A.te.map(function (t) { return { id: t.id, fraccion: t.f, origen: t.origen, destino: t.destino }; }),
      prioridades: A.prio.slice(), apagar: Object.keys(A.apagar), ntn: ntnOut, supuestos: ids(A.claves) };
    // Revisión 9: latencia dependiente de la carga (enlaces y demandas) y SLA por slice; no cambia cargas ni estados
    if (!opciones || opciones.latencia !== false) {
      latenciaCarga(G, enlacesOut, dem, sdsDem);
      res.sla = slaPorSlice(RED, dem, M);
    }
    if (muOut) res.modelo_usuario = muOut;
    if (!opciones || opciones.acceso !== false) res.acceso = acceso(RED, res, opciones, A);
    return res;
  }

  // ---------- acceso: emplazamientos por tecnología y núcleo (CONTRATO_UI Revisión 5) ----------
  // Lee window.EMPL (emplazamientos_datos.js, generado por fusionar.py). No toca enlaces ni nodos: solo lee
  // r.demandas (demanda pedida en la hora del paso) y r.nodos (caídas). Reglas: supuestos del ámbito "acceso".
  var ORDEN_CAPAS = ["n258", "n78", "n28"];
  // k_UPF = carga NIC por DC en normal de la v7 (283,56 Gbit/s, N6-DL + N3-UL con cabecera conservadora) /
  // ((398,20 + 111,89) / 3): convierte la demanda IP central del DC en carga de NIC (calculado de v7 §6.7.4).
  var UPF_NIC_K = 283.56 * 3 / (398.20 + 111.89);
  var CLASES_TEC_DEF = { ftth: ["ftth", "voz"], n28: ["movil", "voz", "empresa"], n78: ["movil", "voz", "iot", "urllc", "empresa"],
    n258: ["evento"], voz: ["voz"], v2x: ["urllc"], iot: ["iot"], l2vpn: ["empresa"], ntn: ["ntn"],
    edge: ["evento", "urllc", "iot", "empresa"], dc: ["movil", "ftth", "voz", "iot"], ix: ["movil", "ftth", "voz", "ntn"] };
  var EMPL_NODE = null;
  function emplDe(RED, opciones) {
    if (opciones && opciones.empl) return opciones.empl;
    if (RED && RED.empl) return RED.empl;
    if (typeof EMPL !== "undefined" && EMPL && EMPL.sitios) return EMPL;
    if (typeof window !== "undefined" && window.EMPL) return window.EMPL;
    if (EMPL_NODE === null) {
      EMPL_NODE = false;
      try { if (typeof require === "function") EMPL_NODE = require("./emplazamientos_datos.js"); } catch (e) { EMPL_NODE = false; }
    }
    return EMPL_NODE || null;
  }
  function claveDem(E, d) {
    var p = d.padre || d.id, gt = E.meta.grupos_tipo || {};
    if (p.indexOf("S-") === 0) return p;
    var g = gt[d.tipo];
    return g && d.zona ? d.zona + "|" + g : null;
  }
  // Índice estático (no depende de la hora): sitios, pesos, desbordes y demanda de referencia (hora cargada) por clave
  function indiceAcceso(E, RED) {
    var ix = E._idx;
    if (ix && ix.red === RED) return ix;
    var gt = E.meta.grupos_tipo || {}, bh = {}, voz = 0;
    (RED.zonas || []).forEach(function (z) {
      (z.necesidades || []).forEach(function (n) {
        var g = gt[n.tipo];
        if (n.tipo === "voz-ims" || n.tipo === "voz-fija") voz += num(n.dl_gbps, 0);
        if (!g) return;
        var k = z.id + "|" + g, b = bh[k] || (bh[k] = { dl: 0, ul: 0 });
        b.dl += num(n.dl_gbps, 0); b.ul += num(n.ul_gbps, 0);
      });
    });
    (RED.servicios || []).forEach(function (s) { bh[s.id] = { dl: num(s.dl_gbps, 0), ul: num(s.ul_gbps, 0) }; });
    var pos = {}, porTec = {};
    E.sitios.forEach(function (s, i) {
      pos[s.id] = i;
      (porTec[s.tec] || (porTec[s.tec] = [])).push(i);
    });
    var sit = E.sitios.map(function (s) {
      var cap = s.capacidad_mbps || {};
      return { id: s.id, tec: s.tec, agg: s.agg || null, nodo: s.nodo || null, ab: num(s.abonados, 0),
        cdl: esCap(cap.dl) ? cap.dl : null, cul: esCap(cap.ul) ? cap.ul : null,
        dem: s.dem || [], des: (s.desborde || []).map(function (id) { return pos[id]; }).filter(function (x) { return x !== undefined; }),
        pon: s.pon || 0, upl: s.uplink_gbps || 0 };
    });
    ix = { red: RED, bh: bh, vozBH: voz, sit: sit, porTec: porTec };
    try { Object.defineProperty(E, "_idx", { value: ix, enumerable: false, configurable: true, writable: true }); } catch (e) { /* objeto congelado */ }
    return ix;
  }
  function pct(x, c) { return c ? x / c * 100 : 0; }

  function acceso(RED, r, opciones, A) {
    var E = emplDe(RED, opciones), apag = (A && A.apagar) || {};
    if (!E || !E.sitios || !E.meta) return null;
    var X = indiceAcceso(E, RED), nuc = E.meta.nucleo || {};
    // 1. demanda pedida por clave (zona|radio, zona|fijo, id de servicio) y destinos de núcleo
    var K = {}, dcUPF = {}, voz = 0;
    r.demandas.forEach(function (d) {
      var k = claveDem(E, d);
      if (d.tipo === "voz-ims" || d.tipo === "voz-fija") voz += d.dl_gbps;
      var upf = d.tipo === "movil-ebb" || d.tipo === "voz-ims" || (d.padre || d.id) === "S-VALDEBEBAS-SENSORES";
      if (upf || /^EDGE/.test(d.destino_nodo || "")) {
        d.caminos.forEach(function (c) {
          var u = dcUPF[c.destino] || (dcUPF[c.destino] = { dl: 0, ul: 0 });
          u.dl += d.dl_gbps * c.peso; u.ul += d.ul_gbps * c.peso;
        });
      }
      if (!k) return;
      var x = K[k] || (K[k] = { dl: 0, ul: 0, n: 0, caidas: 0 });
      x.dl += d.dl_gbps; x.ul += d.ul_gbps; x.n++;
      if (d.estado === "caido") x.caidas++;
    });
    // 2. carga propia de cada sitio (Mbit/s)
    var n = X.sit.length, dl = new Float64Array(n), ul = new Float64Array(n), rdl = new Float64Array(n), rul = new Float64Array(n);
    var sitios = {}, nodos = r.nodos || {};
    var i, j, s, out;
    for (i = 0; i < n; i++) {
      s = X.sit[i];
      var a = 0, b = 0, ref = 0, ahora = 0, caidoK = s.dem.length > 0;
      for (j = 0; j < s.dem.length; j++) {
        var kk = s.dem[j][0], w = s.dem[j][1], x = K[kk], h = X.bh[kk];
        if (x) { a += x.dl * w; b += x.ul * w; if (x.caidas < x.n) caidoK = false; } else caidoK = false;
        if (h) { ref += (h.dl + h.ul) * w; ahora += x ? (x.dl + x.ul) * w : 0; }
      }
      dl[i] = a * 1000; ul[i] = b * 1000;
      var nAgg = s.agg && nodos[s.agg], nN = s.nodo && nodos[s.nodo];
      sitios[s.id] = { dl_mbps: 0, ul_mbps: 0, util_pct: 0, usuarios: Math.round(s.ab * (ref > EPS ? ahora / ref : 0)),
        caido: !!((nAgg && nAgg.caido) || (nN && nN.caido) || caidoK) };
    }
    // 3. desborde entre capas n258 → n78 → n28 (lo que pasa del 100 % va a los sitios de la capa siguiente)
    //    apagar_capa (Revisión 7, supuesto evt.apagar_capa): un sitio de una capa apagada desborda toda su demanda;
    //    si no tiene capa siguiente, esa demanda queda sin capa (sin_capa_gbps).
    var desb = 0, desbTec = {}, sinCapa = 0;
    ORDEN_CAPAS.forEach(function (tec) {
      var off = !!apag[tec];
      (X.porTec[tec] || []).forEach(function (i) {
        var s = X.sit[i], td = dl[i] + rdl[i], tu = ul[i] + rul[i];
        var ed = off ? td : (s.cdl !== null ? Math.max(0, td - s.cdl) : 0), eu = off ? tu : (s.cul !== null ? Math.max(0, tu - s.cul) : 0);
        if (off) sitios[s.id].apagado = true;
        if ((ed > EPS || eu > EPS) && s.des.length) {
          var m = s.des.length;
          for (var q = 0; q < m; q++) { rdl[s.des[q]] += ed / m; rul[s.des[q]] += eu / m; }
          sitios[s.id].desborde_mbps = { dl: ed, ul: eu };
          desb += ed + eu; desbTec[tec] = (desbTec[tec] || 0) + (ed + eu) / 1000;
          td -= ed; tu -= eu;
        } else if (off) { sinCapa += td + tu; td = 0; tu = 0; }
        dl[i] = td; ul[i] = tu; rdl[i] = 0; rul[i] = 0;
      });
    });
    // 4. núcleo
    var cores = {};
    (RED.nodos || []).forEach(function (nd) { if (nd.tipo === "core") cores[nd.id] = !(nodos[nd.id] && nodos[nd.id].caido); });
    // BNG: unidades activo/respaldo por zona (v7 §6.10.1), Gbit/s fijos (residencial + empresa) y sesiones
    var B = nuc.BNG || {}, bngOut = { gbps: 0, sesiones: 0, util_pct: 0, util_sesiones_pct: 0, unidades: {} };
    var areaZ = {};
    (RED.zonas || []).forEach(function (z) { areaZ[z.id] = z; });
    var tiposB = {};
    (B.tipos || []).forEach(function (t) { tiposB[t] = 1; });
    var fijoArea = {};
    r.demandas.forEach(function (d) {
      if (!tiposB[d.tipo] || !areaZ[d.zona]) return;
      var ar = areaZ[d.zona].area;
      fijoArea[ar] = (fijoArea[ar] || 0) + d.dl_gbps;
    });
    var sesArea = {};
    (RED.zonas || []).forEach(function (z) { sesArea[z.area] = (sesArea[z.area] || 0) + num(z.abonados_fijos, 0) * num(B.factor_sesiones, 1.25); });
    var bngDC = {};
    (B.unidades || []).forEach(function (u) {
      var g = 0, se = 0;
      Object.keys(u.areas).forEach(function (ar) { g += (fijoArea[ar] || 0) * u.areas[ar]; se += (sesArea[ar] || 0) * u.areas[ar]; });
      var dc = cores[u.activo] ? u.activo : (cores[u.respaldo] ? u.respaldo : null);
      var capG = u.chasis * u.gbps_chasis, capS = u.chasis * num(B.sesiones_chasis, 256000);
      var o = { gbps: g, sesiones: Math.round(se), dc: dc, en_respaldo: dc !== null && dc !== u.activo, caido: dc === null,
        capacidad_gbps: capG, util_pct: dc ? pct(g, capG) : 0, util_sesiones_pct: dc ? pct(se, capS) : 0 };
      bngOut.unidades[u.id] = o;
      bngOut.gbps += g; bngOut.sesiones += o.sesiones;
      bngOut.util_pct = Math.max(bngOut.util_pct, o.util_pct);
      bngOut.util_sesiones_pct = Math.max(bngOut.util_sesiones_pct, o.util_sesiones_pct);
      if (dc) bngDC[dc] = Math.max(bngDC[dc] || 0, o.util_pct);
      if (dc === null) bngOut.caido = true;
    });
    // UPF: demanda IP central por DC (caminos de las demandas) → carga NIC (k_UPF) / (2 servidores útiles × 400 Gbit/s)
    var U = nuc.UPF || {}, capU = num(U.capacidad_dc_gbps, 800), upfOut = { gbps: 0, dl_gbps: 0, ul_gbps: 0, util_pct: 0, dcs: {}, edges: {} };
    Object.keys(dcUPF).sort().forEach(function (id) {
      var u = dcUPF[id];
      if (id in cores) {
        var nic = (u.dl + u.ul) * UPF_NIC_K;
        var o = { dl_gbps: u.dl, ul_gbps: u.ul, nic_gbps: nic, capacidad_gbps: capU, util_pct: cores[id] ? pct(nic, capU) : 0, caido: !cores[id] };
        upfOut.dcs[id] = o;
        upfOut.dl_gbps += u.dl; upfOut.ul_gbps += u.ul;
        upfOut.util_pct = Math.max(upfOut.util_pct, o.util_pct);
      } else if (/^EDGE/.test(id)) upfOut.edges[id] = { dl_gbps: u.dl, ul_gbps: u.ul };
    });
    upfOut.gbps = upfOut.dl_gbps + upfOut.ul_gbps;
    // IMS: CAPS de hora cargada × (voz del paso / voz de hora cargada), repartidos entre los DC vivos
    var I = nuc.IMS || {}, vivos = (I.dcs || []).filter(function (id) { return cores[id]; });
    var esc = X.vozBH > EPS ? voz / X.vozBH : 0, caps = num(I.caps_bh, 0) * esc;
    var imsOut = { caps: caps, tramos: num(I.tramos_bh, 0) * esc, dcs_vivos: vivos.length,
      capacidad_caps: vivos.length * num(I.caps_dc, 0), util_pct: vivos.length ? pct(caps, vivos.length * num(I.caps_dc, 0)) : 0,
      caido: !vivos.length };
    // 5. utilización por sitio y por tecnología
    var porTec = {};
    (E.tecnologias || []).forEach(function (t) { porTec[t.id] = { dl_gbps: 0, ul_gbps: 0, util_max_pct: 0, sitio_max: null, sitios_sat: 0, sitios_caidos: 0, n: 0 }; });
    for (i = 0; i < n; i++) {
      s = X.sit[i]; out = sitios[s.id];
      var u = 0;
      if (s.tec === "ftth") {
        var pu = s.pon ? pct(Math.max(dl[i], ul[i]), s.pon * 10000) : 0, uu = s.upl ? pct(Math.max(dl[i], ul[i]), s.upl * 1000) : 0;
        out.pon_util_pct = pu; out.uplink_util_pct = uu; u = Math.max(pu, uu);
      } else if (s.tec === "voz") {
        u = cores[s.nodo] ? imsOut.util_pct : 0;
        out.caps = cores[s.nodo] && vivos.length ? caps / vivos.length : 0;
      } else if (s.tec === "dc") {
        var ud = upfOut.dcs[s.nodo];
        u = Math.max(ud ? ud.util_pct : 0, bngDC[s.nodo] || 0);
        if (ud) { dl[i] = ud.dl_gbps * 1000; ul[i] = ud.ul_gbps * 1000; }
      } else if (s.tec === "edge" || s.tec === "ix") {
        var nn = nodos[s.nodo];
        if (nn) { dl[i] = nn.carga_gbps * 1000; u = nn.capacidad_gbps ? nn.ocupacion * 100 : 0; }
      } else {
        u = Math.max(s.cdl ? pct(dl[i], s.cdl) : 0, s.cul ? pct(ul[i], s.cul) : 0);
      }
      if (out.caido || out.apagado) u = 0;
      out.dl_mbps = dl[i]; out.ul_mbps = ul[i]; out.util_pct = u;
      var pt = porTec[s.tec] || (porTec[s.tec] = { dl_gbps: 0, ul_gbps: 0, util_max_pct: 0, sitio_max: null, sitios_sat: 0, sitios_caidos: 0, n: 0 });
      pt.n++;
      if (s.tec !== "dc" && s.tec !== "edge" && s.tec !== "ix") { pt.dl_gbps += dl[i] / 1000; pt.ul_gbps += ul[i] / 1000; }
      if (u > pt.util_max_pct) { pt.util_max_pct = u; pt.sitio_max = s.id; }
      if (u >= 100 - 1e-6) pt.sitios_sat++;
      if (out.caido) pt.sitios_caidos++;
    }
    if (porTec.dc) { porTec.dc.dl_gbps = upfOut.dl_gbps; porTec.dc.ul_gbps = upfOut.ul_gbps; }
    Object.keys(apag).forEach(function (t) { if (porTec[t]) porTec[t].apagada = true; });
    return { sitios: sitios, por_tec: porTec, nucleo: { BNG: bngOut, UPF: upfOut, IMS: imsOut }, desborde_gbps: desb / 1000,
      desborde_por_tec: desbTec, sin_capa_gbps: sinCapa / 1000, capas_apagadas: Object.keys(apag),
      supuestos: (E.meta.proc ? Object.keys(E.meta.proc).map(function (k) { return E.meta.proc[k].s; }) : []) };
  }

  // Motor.tecnologias(RED) -> [{id, es, en, color_token, unidad, capa, banda, clases, n_sitios, sectores}]
  function tecnologias(RED, opciones) {
    var E = emplDe(RED, opciones);
    if (!E) return [];
    var c = {};
    E.sitios.forEach(function (s) {
      var x = c[s.tec] || (c[s.tec] = { n: 0, sec: 0 });
      x.n++; x.sec += s.sectores || 0;
    });
    return (E.tecnologias || []).map(function (t) {
      var o = {}, k;
      for (k in t) o[k] = t[k];
      o.clases = (t.clases || CLASES_TEC_DEF[t.id] || []).slice();
      o.n_sitios = c[t.id] ? c[t.id].n : 0;
      o.sectores = c[t.id] ? c[t.id].sec : 0;
      return o;
    });
  }
  // Motor.claseDeTec(tec) -> clases de servicio (CLASES_SERVICIO) que viajan por esa tecnología
  function claseDeTec(tec) {
    var E = emplDe(null, null), t = E && (E.tecnologias || []).filter(function (x) { return x.id === tec; })[0];
    return ((t && t.clases) || CLASES_TEC_DEF[tec] || []).slice();
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

  // ---------- serie temporal: "película" de 24 h (CONTRATO_UI Revisión 4, PLAN_v3 §3) ----------
  // Motor.serie(RED, caso, {paso_min: 60|15|5, desde: 0, hasta: 24, fallos: [], eventos: [{t_min, tipo, id}]})
  //   caso: lo mismo que se pasa a calcular ({caso: {trafico, evento, fallo}} u opciones sueltas) o el propio
  //   {trafico, evento, fallo|fallos, dia, anio}. La hora del caso se ignora: manda la de cada paso.
  //   Cada paso = calcular() a la hora t_min/60 (fraccionaria: perfiles interpolados linealmente).
  //   Casos de hora cargada (BH/P2/PM o escenario hora_cargada): se recorren con los perfiles horarios
  //   (supuesto dem.serie_hora_cargada) y se avisa en serie.aviso.
  function ahoraMs() {
    return (typeof performance !== "undefined" && performance && performance.now) ? performance.now() : Date.now();
  }
  function opcionesDeCaso(caso) {
    var o = {}, k;
    caso = caso || {};
    var suelto = !caso.caso && ("trafico" in caso || "evento" in caso || "fallo" in caso) &&
      !("modelo" in caso || "escenario" in caso);
    if (!suelto) { for (k in caso) o[k] = caso[k]; return o; }
    // Forma del NOC ({trafico: "NC", dia, anio, hora, evento, fallos}) o del constructor ({trafico, evento, fallo})
    var c = {}, t = caso.trafico;
    if (typeof t === "string" && (caso.dia || caso.anio)) {
      t = { id: t };
      if (caso.dia) t.dia = caso.dia;
      if (caso.anio) t.anio = caso.anio;
    }
    if (t) c.trafico = t;
    c.evento = caso.evento || "ninguno";
    c.fallo = [].concat(caso.fallo || [], caso.fallos || []);
    o.caso = c;
    return o;
  }
  function horaTexto(tm) {
    var m = Math.round(tm), h = Math.floor(m / 60), mm = m - h * 60;
    return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm;
  }
  // Estado en el instante t: fallos activos (los del caso + eventos con t_min <= t aplicados en orden; "fallo" tumba,
  // "reparacion" levanta aunque viniera del caso) y acciones/eventos activos (todo lo demás que no haya acabado).
  // [Supuesto evt.instantaneo] cada evento cuenta entero desde el primer paso con t >= t_min (sin transitorios).
  function estadoEn(baseF, eventos, t) {
    var act = {}, orden = [], deg = {}, otros = [];
    baseF.forEach(function (id) { if (!act[id]) { act[id] = 1; orden.push(id); } });
    for (var i = 0; i < eventos.length; i++) {
      var e = eventos[i];
      if (e.t_min > t + 1e-9) break;
      var vivo = !(typeof e.fin === "number" && t >= e.fin - 1e-9);
      if (e.tipo === "fallo") {
        if (vivo) { if (!act[e.id]) { act[e.id] = 1; orden.push(e.id); } }
        else delete act[e.id];
      } else if (e.tipo === "reparacion") { delete act[e.id]; delete deg[e.id]; }
      else if (e.tipo === "degradar") { if (vivo) (deg[e.id] || (deg[e.id] = [])).push(e); else delete deg[e.id]; }
      else if (vivo) otros.push(e);
    }
    var acc = [];
    Object.keys(deg).forEach(function (id) { deg[id].forEach(function (e) { acc.push(e); }); });
    acc = acc.concat(otros).sort(function (a, b) { return a._i - b._i; })
      .map(function (e) { var o = { tipo: e.tipo }; if (e.id) o.id = e.id; if (e.params) o.params = e.params; return o; });
    return { fallos: orden.filter(function (id) { return act[id]; }), acciones: acc };
  }
  function fallosEn(baseF, eventos, t) { return estadoEn(baseF, eventos, t).fallos; }

  // ---------- sucesos (registro tipo SCADA, Revisión 7) ----------
  // {t_min, nivel: CRIT|MAJ|MIN|WRN|INFO, origen: evento|accion|motor, texto: {es, en}, id}
  // Alarmas de ocupación: MAJ ≥ 85 %, CRIT ≥ 100 % de la demanda sobre la capacidad (supuesto evt.umbrales_alarma).
  var UMBRAL_MAJ = 85, UMBRAL_CRIT = 100;
  function fmtEn(x, dec) { return (Math.round(x * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec); }
  function txt(es, en) { return { es: es, en: en }; }
  function nombreEl(G, id) { return G.nodos[id] ? nombreNodo(G, id) : id; }
  function textoEvento(G, e, fin) {
    var p = e.params || {}, id = e.id || "", n = nombreEl(G, id), T = TIPO_EV[e.tipo];
    function minus(x) { return x.charAt(0).toLowerCase() + x.slice(1); }
    if (fin) return txt("Fin de " + minus(T.es) + (id ? ": " + n : ""), "End of " + minus(T.en) + (id ? ": " + n : ""));
    switch (e.tipo) {
      case "fallo": return txt("Fallo: " + n, "Failure: " + n);
      case "reparacion": return txt("Reparación: " + n, "Repair: " + n);
      case "degradar":
        if (typeof p.miembros_caidos === "number") return txt("Degradación: " + n + " pierde " + p.miembros_caidos + " λ del LAG",
          "Degradation: " + n + " loses " + p.miembros_caidos + " λ of the LAG");
        var f = typeof p.factor === "number" ? p.factor : 0.5;
        return txt("Degradación: " + n + " al " + fmt(f * 100, 0) + " % de su capacidad", "Degradation: " + n + " at " + fmtEn(f * 100, 0) + " % of capacity");
      case "evento_demanda": return txt("Evento de demanda: " + id, "Demand event: " + id);
      case "te_reencaminar":
        var fr = typeof p.fraccion === "number" ? p.fraccion : 1;
        return txt("TE: LSP fuera de " + n + " (" + fmt(fr * 100, 0) + " %)", "TE: LSPs moved off " + n + " (" + fmtEn(fr * 100, 0) + " %)");
      case "activar_ntn": return txt("Satélite NTN activado" + (id ? " (" + n + ")" : ""), "NTN satellite activated" + (id ? " (" + n + ")" : ""));
      case "anadir_lambda":
        return txt("Ampliación de " + n + (typeof p.gbps === "number" ? " +" + fmtG(p.gbps) + " Gbit/s" : " +" + (typeof p.n === "number" ? p.n : 1) + " módulo(s)"),
          "Capacity added to " + n + (typeof p.gbps === "number" ? " +" + fmtEn(p.gbps, 0) + " Gbit/s" : " +" + (typeof p.n === "number" ? p.n : 1) + " module(s)"));
      case "priorizar_slice":
        var pr = typeof p.prioridad === "number" ? p.prioridad : 0;
        return txt("Prioridad " + pr + " para " + id, "Priority " + pr + " for " + id);
      case "apagar_capa": return txt("Capa " + id + " apagada", "Layer " + id + " switched off");
    }
    return txt(e.tipo + " " + id, e.tipo + " " + id);
  }
  function nivelEvento(G, e, fin) {
    if (fin || e.tipo === "reparacion") return "INFO";
    if (e.tipo === "fallo") return G.nodos[e.id] ? "CRIT" : "MAJ";
    if (e.tipo === "degradar") return "MIN";
    return "INFO";
  }
  function nivelOcup(p) { return p >= UMBRAL_CRIT - 1e-9 ? 2 : (p >= UMBRAL_MAJ - 1e-9 ? 1 : 0); }

  // Compara el resultado del paso con el anterior (estado en `prev`) y devuelve los sucesos del motor
  function sucesosMotor(G, r, tm, prev, fallos) {
    var out = [], ahora = { alarma: {}, caidas: {}, degr: {}, frr: {}, desb: {}, sinCapa: 0, ntn: -1 };
    function add(nivel, es, en, id) { out.push({ t_min: tm, nivel: nivel, origen: "motor", texto: txt(es, en), id: id }); }
    // FRR: tramo de anillo caído con los dos extremos vivos
    var caidoN = {}, f;
    fallos.forEach(function (id) { if (G.nodos[id]) caidoN[id] = 1; });
    fallos.forEach(function (id) {
      var li = G.idxL[id];
      if (li === undefined || !G.anilloL[li]) return;
      var l = G.enlaces[li];
      if (!caidoN[l.a] && !caidoN[l.b]) ahora.frr[id] = 1;
    });
    var teTot = {};
    ((r.acciones && r.acciones.te) || []).forEach(function (t) { if (t.fraccion >= 1 - 1e-9 && !t.origen && !t.destino) teTot[t.id] = 1; });
    Object.keys(ahora.frr).forEach(function (id) {
      if (prev.frr[id]) return;
      if (teTot[id]) add("INFO", "FRR armado en " + id + " sin tráfico: los LSP ya estaban fuera por TE",
        "FRR armed on " + id + " with no traffic: LSPs had already been moved by TE", id);
      else add("MAJ", "FRR activo en " + id + ": el tráfico del tramo va por el arco opuesto del anillo",
        "FRR active on " + id + ": span traffic takes the opposite ring arc", id);
    });
    Object.keys(prev.frr).forEach(function (id) {
      if (!ahora.frr[id]) add("INFO", "FRR desactivado en " + id, "FRR cleared on " + id, id);
    });
    // Alarmas de ocupación de enlaces y nodos con capacidad (demanda sobre capacidad)
    function alarma(id, nombre, cap, carga, demanda, caido) {
      if (!cap || caido) { if (prev.alarma[id]) add("INFO", nombre + " sale de alarma", nombre + " alarm cleared", id); return; }
      var p = Math.max(carga, demanda) / cap * 100, n = nivelOcup(p), a = prev.alarma[id] || 0;
      if (n) ahora.alarma[id] = n;
      if (n === a) return;
      if (n === 0) add("INFO", nombre + " sale de alarma (" + fmt(p, 0) + " %)", nombre + " alarm cleared (" + fmtEn(p, 0) + " %)", id);
      else if (n > a) add(n === 2 ? "CRIT" : "MAJ", nombre + " al " + fmt(p, 0) + " %" + (n === 2 ? " (saturado)" : ""),
        nombre + " at " + fmtEn(p, 0) + " %" + (n === 2 ? " (saturated)" : ""), id);
      else add("MAJ", nombre + " baja al " + fmt(p, 0) + " %", nombre + " down to " + fmtEn(p, 0) + " %", id);
    }
    G.enlaces.forEach(function (l) {
      var e = r.enlaces[l.id];
      alarma(l.id, "Enlace " + l.id, e.capacidad_gbps, e.carga_gbps, e.demanda_gbps, e.caido);
    });
    G.ordenNodos.forEach(function (id) {
      var x = r.nodos[id];
      if (x.capacidad_gbps) alarma(id, nombreNodo(G, id), x.capacidad_gbps, x.carga_gbps, x.demanda_gbps, x.caido);
    });
    if (r.acceso && r.acceso.nucleo) ["BNG", "UPF", "IMS"].forEach(function (k) {
      var u = r.acceso.nucleo[k], p = u ? u.util_pct : 0;
      alarma(k, k, 100, p, p, false);
    });
    // Demandas perdidas / recuperadas / degradadas (por demanda, sin contar las subdemandas por DC)
    var est = {};
    r.demandas.forEach(function (d) {
      var k = d.padre || d.id, g = GRAV_EST[d.estado] || 0, x = est[k];
      if (!x) est[k] = { g: g, dl: d.dl_gbps, ntn: d.via === "ntn" }; else { x.g = Math.max(x.g, g); x.dl += d.dl_gbps; if (d.via === "ntn") x.ntn = true; }
    });
    Object.keys(est).forEach(function (k) {
      var x = est[k];
      if (x.g === 3) ahora.caidas[k] = 1; else if (x.g === 2) ahora.degr[k] = 1;
      if (x.g === 3 && !prev.caidas[k]) add("CRIT", "Demanda perdida (sin ruta): " + k + " · " + fmtG(x.dl) + " Gbit/s",
        "Demand lost (no route): " + k + " · " + fmtEn(x.dl, x.dl >= 10 ? 0 : 1) + " Gbit/s", k);
      else if (x.g < 3 && prev.caidas[k]) add("INFO", "Demanda recuperada: " + k + (x.ntn ? " (por satélite)" : ""),
        "Demand restored: " + k + (x.ntn ? " (via satellite)" : ""), k);
      else if (x.g === 2 && !prev.degr[k] && !prev.caidas[k]) add("MIN", "Demanda degradada: " + k, "Demand degraded: " + k, k);
      else if (x.g < 2 && prev.degr[k]) add("INFO", "Demanda normalizada: " + k, "Demand back to normal: " + k, k);
    });
    Object.keys(prev.caidas).forEach(function (k) { if (!est[k]) add("INFO", "Demanda recuperada: " + k, "Demand restored: " + k, k); });
    // Desborde de capas radio y demanda sin capa
    var A = r.acceso;
    if (A) {
      var dt = A.desborde_por_tec || {};
      Object.keys(dt).forEach(function (tec) {
        if (dt[tec] <= 1e-6) return;
        ahora.desb[tec] = 1;
        if (!prev.desb[tec]) add("WRN", "Desborde de la capa " + tec + " a la siguiente: " + fmtG(dt[tec]) + " Gbit/s",
          "Layer " + tec + " overflows to the next one: " + fmtEn(dt[tec], dt[tec] >= 10 ? 0 : 1) + " Gbit/s", tec);
      });
      Object.keys(prev.desb).forEach(function (tec) {
        if (!ahora.desb[tec]) add("INFO", "Fin del desborde de la capa " + tec, "Layer " + tec + " overflow ended", tec);
      });
      ahora.sinCapa = A.sin_capa_gbps > 1e-6 ? 1 : 0;
      if (ahora.sinCapa && !prev.sinCapa) add("MAJ", "Demanda radio sin capa (capa apagada sin desborde): " + fmtG(A.sin_capa_gbps) + " Gbit/s",
        "Radio demand without a layer (switched-off layer with no overflow): " + fmtEn(A.sin_capa_gbps, 1) + " Gbit/s", (A.capas_apagadas || [])[0] || null);
      else if (!ahora.sinCapa && prev.sinCapa) add("INFO", "Toda la demanda radio vuelve a tener capa", "All radio demand has a layer again", null);
    }
    // Satélite: demandas por NTN
    var nt = r.acciones && r.acciones.ntn;
    ahora.ntn = nt ? nt.demandas.length : -1;
    if (nt && ahora.ntn !== prev.ntn && ahora.ntn > 0) add("WRN", "NTN: " + ahora.ntn + " demandas prioritarias por satélite (" + fmt(nt.gbps * 1000, 0) + " Mbit/s)",
      "NTN: " + ahora.ntn + " priority demands via satellite (" + fmtEn(nt.gbps * 1000, 0) + " Mbit/s)", null);
    return { sucesos: out, estado: ahora };
  }
  var PESO_NIVEL = { CRIT: 0, MAJ: 1, MIN: 2, WRN: 3, INFO: 4 };

  function serie(RED, caso, opciones) {
    var t0 = ahoraMs();
    opciones = opciones || {};
    var paso = num(opciones.paso_min, 60);
    if (!(paso > 0)) throw new Error("serie: paso_min no válido: " + opciones.paso_min);
    var desde = num(opciones.desde, 0), hasta = num(opciones.hasta, 24);
    if (!(hasta > desde)) throw new Error("serie: hasta debe ser mayor que desde");
    var base = opcionesDeCaso(caso);
    delete base.hora;
    if (base.caso && base.caso.trafico && typeof base.caso.trafico === "object") {
      var tc = {}, k;
      for (k in base.caso.trafico) if (k !== "hora") tc[k] = base.caso.trafico[k];
      base.caso = { trafico: tc, evento: base.caso.evento, fallo: base.caso.fallo };
    }
    if (opciones.fallos && opciones.fallos.length) base.fallos = [].concat(base.fallos || [], opciones.fallos);
    // Revisión 8: modelo de usuario (en opciones de la serie o en el caso); sus eventos_demanda se suman a los eventos
    var mu = opciones.modelo_usuario || (caso && caso.modelo_usuario) || null;
    if (mu) base.modelo_usuario = mu; else delete base.modelo_usuario;
    var evIn = opciones.eventos || [];
    if (mu && Array.isArray(mu.eventos_demanda) && mu.eventos_demanda.length)
      evIn = evIn.concat(mu.eventos_demanda.map(function (e) { var o = copiaPlana(e); o.tipo = o.tipo || "evento_demanda"; return o; }));

    // ¿Es un caso de hora cargada? Entonces la película usa los perfiles horarios (supuesto) y se avisa.
    var op0 = resolverOpciones(RED, base);
    var cargada = !!op0.cargada, aviso = null;
    if (cargada) {
      base.perfil_horario = true;
      aviso = "Caso de hora cargada" + (op0.modelo ? " (" + op0.modelo.id + ")" : "") + ": la v7 solo define la foto " +
        "con todas las demandas en su hora cargada a la vez. La película de 24 h es una extensión del simulador " +
        "(supuesto): cada demanda alcanza su valor v7 en el pico de su perfil horario (residencial y móvil residencial " +
        "21:00, empresa 10:00, oficinas 09:00, V2X 07:00/18:00, estadio 20:00–21:00), no todas a la vez, así que ningún " +
        "paso reproduce la hora cargada coincidente (tampoco el de las 21:00). Para la foto v7 use el cálculo de hora cargada.";
    }
    var baseF = op0.fallos.slice();
    // Revisión 7: tipos ampliados; los que necesitan elemento sin id (o tipos desconocidos) van a eventos_descartados
    var descartados = [];
    var eventos = evIn.filter(function (e) {
      var ok = e && typeof e.t_min === "number" && isFinite(e.t_min) && TIPO_EV[e.tipo] &&
        (e.id || e.tipo === "activar_ntn" || (e.tipo === "apagar_capa" && e.params && e.params.tec) ||
         (e.tipo === "priorizar_slice" && e.params && (e.params.slice || e.params.clase)));
      if (!ok && e) descartados.push(e);
      return ok;
    }).map(function (e, i) {
      var o = { t_min: e.t_min, tipo: e.tipo, _i: i };
      if (e.id) o.id = e.id;
      if (e.params) o.params = e.params;
      var f = finEvento(e);
      if (typeof f === "number") o.fin = f;
      return o;
    });
    eventos.sort(function (a, b) { return (a.t_min - b.t_min) || (a._i - b._i); });

    var ts = [];
    for (var t = desde * 60; t < hasta * 60 - 1e-9; t += paso) ts.push(t);
    var n = ts.length;
    var G = construirGrafo(RED);
    var enl = {}, nod = {};
    G.enlaces.forEach(function (l) { enl[l.id] = { ocup: new Float32Array(n), carga: new Float32Array(n) }; });
    G.ordenNodos.forEach(function (id) { nod[id] = { carga: new Float32Array(n), ocup: new Float32Array(n) }; });
    var cache = {}, pasos = [], usados = [], pico = null, acc = null, accN = null, todos = [];
    var prevSuc = { alarma: {}, caidas: {}, degr: {}, frr: {}, desb: {}, sinCapa: 0, ntn: -1 }, tPrev = -Infinity;
    var M = mapaSupuestos(RED);
    var E = emplDe(RED, base);
    if (E && opciones.acceso !== false) {
      acc = {}; accN = {};
      (E.tecnologias || []).forEach(function (t) { acc[t.id] = { util_max: new Float32Array(n), dl: new Float32Array(n), ul: new Float32Array(n) }; });
      ["BNG", "UPF", "IMS"].forEach(function (k) { accN[k] = { util: new Float32Array(n) }; });
    } else base.acceso = false;
    ts.forEach(function (tm, i) {
      var o = {}, k;
      for (k in base) o[k] = base[k];
      o.hora = tm / 60;
      var est = estadoEn(baseF, eventos, tm);
      o.fallos_exactos = est.fallos;
      if (est.acciones.length) o.acciones = est.acciones;
      o._cache = cache;
      var r = calcular(RED, o), R = r.resumen;
      // sucesos del paso: eventos que empiezan o acaban en (paso anterior, este paso] + cambios de estado del motor
      var suc = [];
      eventos.forEach(function (e) {
        var T = TIPO_EV[e.tipo];
        if (e.t_min > tPrev + 1e-9 && e.t_min <= tm + 1e-9)
          suc.push({ t_min: e.t_min, nivel: nivelEvento(G, e, false), origen: T.origen, texto: textoEvento(G, e, false), id: e.id || null, tipo: e.tipo });
        if (typeof e.fin === "number" && e.fin > tPrev + 1e-9 && e.fin <= tm + 1e-9)
          suc.push({ t_min: e.fin, nivel: "INFO", origen: T.origen, texto: textoEvento(G, e, true), id: e.id || null, tipo: e.tipo });
      });
      if (i === 0) baseF.forEach(function (id) {
        suc.push({ t_min: tm, nivel: G.nodos[id] ? "CRIT" : "MAJ", origen: "evento",
          texto: txt("Fallo del caso: " + nombreEl(G, id), "Case failure: " + nombreEl(G, id)), id: id, tipo: "fallo" });
      });
      if (r.acciones) r.acciones.avisos.forEach(function (a) { suc.push({ t_min: tm, nivel: "WRN", origen: "accion", texto: txt(a, a), id: null }); });
      var sm = sucesosMotor(G, r, tm, prevSuc, R.fallos);
      prevSuc = sm.estado;
      suc = suc.concat(sm.sucesos);
      suc.sort(function (a, b) { return (a.t_min - b.t_min) || (PESO_NIVEL[a.nivel] - PESO_NIVEL[b.nivel]); });
      tPrev = tm;
      Array.prototype.push.apply(todos, suc);
      var nAl = 0, nGr = 0;
      R.alertas.forEach(function (a) { if (a.nivel !== "info") nAl++; if (a.nivel === "grave") nGr++; });
      var ps = {};
      CLASES_SERVICIO.forEach(function (c) { ps[c] = R.por_servicio[c].dl_gbps; });
      var ocMax = R.max_ocupacion * 100;
      pasos.push({ t_min: tm, hora: tm / 60, etiqueta: horaTexto(tm),
        resumen: { dl_total_gbps: R.dl_total_gbps, servida_gbps: R.servida_gbps, servido_pct: R.pct_servida,
          ocup_max_pct: ocMax, ocup_max_id: R.enlace_max, n_alarmas: nAl, n_graves: nGr,
          demandas_afectadas: R.demandas_afectadas, por_servicio: ps },
        fallos: o.fallos_exactos.slice(), sucesos: suc,
        opciones_paso: est.acciones.length ? { acciones: est.acciones } : null });
      Object.keys(r.enlaces).forEach(function (id) {
        var e = r.enlaces[id], s = enl[id];
        if (!s) return;
        s.ocup[i] = e.ocupacion * 100; s.carga[i] = e.carga_gbps;
      });
      Object.keys(r.nodos).forEach(function (id) {
        var x = r.nodos[id], s = nod[id];
        if (!s) return;
        s.carga[i] = x.carga_gbps; s.ocup[i] = x.ocupacion * 100;
      });
      if (acc && r.acceso) {
        var pt = r.acceso.por_tec;
        Object.keys(acc).forEach(function (t) {
          var x = pt[t];
          if (x) { acc[t].util_max[i] = x.util_max_pct; acc[t].dl[i] = x.dl_gbps; acc[t].ul[i] = x.ul_gbps; }
        });
        accN.BNG.util[i] = r.acceso.nucleo.BNG.util_pct; accN.UPF.util[i] = r.acceso.nucleo.UPF.util_pct; accN.IMS.util[i] = r.acceso.nucleo.IMS.util_pct;
      }
      anadir(usados, R.supuestos_usados);
      if (!pico || ocMax > pico.ocup_max_pct + 1e-9) pico = { t_min: tm, ocup_max_pct: ocMax, id: R.enlace_max };
    });
    // supuestos de la propia serie de eventos: umbrales de alarma de los sucesos y aplicación instantánea
    ["evt.umbrales_alarma"].concat(eventos.length ? ["evt.instantaneo"] : []).forEach(function (k) { if (M.porClave[k]) anadir(usados, [M.porClave[k]]); });
    usados.sort();
    eventos.forEach(function (e) { delete e._i; });
    return { pasos: pasos, enlaces: enl, nodos: nod, acceso_tec: acc, acceso_nucleo: accN, pico: pico, supuestos_usados: usados,
      ms: ahoraMs() - t0, n: n, paso_min: paso, desde: desde, hasta: hasta,
      hora_cargada: cargada, aviso: aviso, eventos: eventos, eventos_descartados: descartados, fallos_base: baseF, sucesos: todos,
      modelo_usuario: mu ? { id: mu.id || null, nombre: mu.nombre || null, ruido: mu.ruido || null, movilidad: !!(mu.movilidad && mu.movilidad.activa !== false) } : null };
  }

  // Buffers de los Float32Array de una serie (para postMessage con transferencia)
  function transferiblesSerie(s) {
    var out = [];
    ["enlaces", "nodos", "acceso_tec", "acceso_nucleo"].forEach(function (g) {
      Object.keys(s[g] || {}).forEach(function (id) {
        var x = s[g][id];
        Object.keys(x).forEach(function (k) { if (x[k] && x[k].buffer) out.push(x[k].buffer); });
      });
    });
    return out;
  }

  // ---------- Montecarlo del ruido del modelo de usuario (CONTRATO_UI Revisión 8) ----------
  // Motor.serieMontecarloSync(RED, caso, opciones, n) -> {n, percentiles:[5,50,95,99], t_min, etiquetas, kpi:{k:{p5,p50,p95,p99,media}},
  //   enlaces:{id:{ocup:{p5,p50,p95,p99}, carga:{p50,p95}, prob_85, prob_100}}, pico:{p50,p95,p99, por_replica}, semillas, …}
  // Cada réplica k es Motor.serie con la semilla "<semilla>#<k>" (mismas opciones, eventos y modelo); n ≤ 50.
  // Percentiles empíricos por rango más cercano (supuesto mod.montecarlo). Sin opciones.acceso === true omite el acceso (más rápido).
  var PCT_MC = [5, 50, 95, 99], KPI_MC = ["dl_total_gbps", "servida_gbps", "servido_pct", "ocup_max_pct", "n_alarmas", "demandas_afectadas"];
  function percentilOrdenado(a, p) { var i = Math.ceil(p / 100 * a.length) - 1; return a[Math.max(0, Math.min(a.length - 1, i))]; }
  function serieMontecarloSync(RED, caso, opciones, n) {
    var t0 = ahoraMs();
    opciones = opciones || {};
    n = Math.max(1, Math.min(50, Math.round(num(n, num(opciones.n, 20)))));
    var mu = opciones.modelo_usuario || (caso && caso.modelo_usuario) || {}, rz = mu.ruido || {}, avisos = [];
    var sigma = num(rz.sigma, 0), semilla = rz.semilla === undefined || rz.semilla === null ? 1 : rz.semilla;
    if (!(sigma > 0)) avisos.push("Modelo sin ruido (sigma = 0): todas las réplicas salen iguales");
    var o = copiaPlana(opciones);
    delete o.n; delete o.worker;
    if (o.acceso === undefined) o.acceso = false;
    var reps = [], semillas = [], usados = [];
    for (var k = 0; k < n; k++) {
      var m = copiaPlana(mu), sk = String(semilla) + "#" + k;
      m.ruido = { sigma: sigma, semilla: sk };
      o.modelo_usuario = m;
      var s = serie(RED, caso, o);
      reps.push(s); semillas.push(sk); anadir(usados, s.supuestos_usados);
    }
    var s0 = reps[0], np = s0.n, kpi = {}, buf = new Array(n);
    KPI_MC.forEach(function (key) {
      var x = { media: new Float32Array(np) };
      PCT_MC.forEach(function (p) { x["p" + p] = new Float32Array(np); });
      for (var i = 0; i < np; i++) {
        var sum = 0;
        for (var r = 0; r < n; r++) { buf[r] = num(reps[r].pasos[i].resumen[key], 0); sum += buf[r]; }
        var a = buf.slice(0, n).sort(function (u, v) { return u - v; });
        PCT_MC.forEach(function (p) { x["p" + p][i] = percentilOrdenado(a, p); });
        x.media[i] = sum / n;
      }
      kpi[key] = x;
    });
    var enl = {};
    Object.keys(s0.enlaces).forEach(function (id) {
      var oc = {}, ca = { p50: new Float32Array(np), p95: new Float32Array(np) }, s85 = 0, s100 = 0;
      PCT_MC.forEach(function (p) { oc["p" + p] = new Float32Array(np); });
      for (var i = 0; i < np; i++) {
        var a = [], c = [];
        for (var r = 0; r < n; r++) { a.push(reps[r].enlaces[id].ocup[i]); c.push(reps[r].enlaces[id].carga[i]); }
        a.sort(function (u, v) { return u - v; }); c.sort(function (u, v) { return u - v; });
        PCT_MC.forEach(function (p) { oc["p" + p][i] = percentilOrdenado(a, p); });
        ca.p50[i] = percentilOrdenado(c, 50); ca.p95[i] = percentilOrdenado(c, 95);
      }
      for (var r2 = 0; r2 < n; r2++) {
        var mx = 0, oc2 = reps[r2].enlaces[id].ocup;
        for (var j = 0; j < np; j++) if (oc2[j] > mx) mx = oc2[j];
        if (mx >= 85 - 1e-6) s85++;
        if (mx >= 100 - 1e-6) s100++;
      }
      enl[id] = { ocup: oc, carga: ca, prob_85: s85 / n, prob_100: s100 / n };
    });
    var picos = reps.map(function (s) { return s.pico ? s.pico.ocup_max_pct : 0; }), ps = picos.slice().sort(function (u, v) { return u - v; });
    var M = mapaSupuestos(RED);
    if (M.porClave[SUP_MU.mc]) anadir(usados, [M.porClave[SUP_MU.mc]]);
    usados.sort();
    return { n: n, percentiles: PCT_MC.slice(), paso_min: s0.paso_min, desde: s0.desde, hasta: s0.hasta, np: np,
      t_min: s0.pasos.map(function (p) { return p.t_min; }), etiquetas: s0.pasos.map(function (p) { return p.etiqueta; }),
      kpi: kpi, enlaces: enl, sigma: sigma, semilla: semilla, semillas: semillas,
      pico: { p50: percentilOrdenado(ps, 50), p95: percentilOrdenado(ps, 95), p99: percentilOrdenado(ps, 99), por_replica: picos,
        ids: reps.map(function (s) { return s.pico ? s.pico.id : null; }) },
      hora_cargada: s0.hora_cargada, aviso: s0.aviso, avisos: avisos, supuestos_usados: usados, ms: ahoraMs() - t0 };
  }
  function transferiblesMontecarlo(mc) {
    var out = [];
    function rec(x) {
      if (!x || typeof x !== "object") return;
      if (x.buffer && x.BYTES_PER_ELEMENT) { if (out.indexOf(x.buffer) < 0) out.push(x.buffer); return; }
      Object.keys(x).forEach(function (k) { rec(x[k]); });
    }
    rec(mc.kpi); rec(mc.enlaces);
    return out;
  }

  // Motor.serieAsync(RED, caso, opciones) -> Promise<serie>. Usa serie_worker.js si hay Worker (http/https);
  // si no (file://, node, error del worker) calcula en el hilo principal. opciones.worker === false fuerza síncrono.
  // Motor.serieMontecarlo(RED, caso, opciones, n) -> Promise<montecarlo>, por el mismo worker (o síncrono si no hay).
  var trab = null, trabRoto = false, trabSeq = 0, trabPend = {};
  function promesa(fn) {
    return new Promise(function (res, rej) { try { res(fn()); } catch (e) { rej(e); } });
  }
  function sincrono(RED, caso, opciones) {
    return promesa(function () { var s = serie(RED, caso, opciones); s.via = "sincrono"; return s; });
  }
  function caerASincrono() {
    trabRoto = true;
    try { if (trab) trab.terminate(); } catch (e) { /* nada */ }
    trab = null;
    var p = trabPend; trabPend = {};
    Object.keys(p).forEach(function (id) { p[id].fb().then(p[id].res, p[id].rej); });
  }
  function trabajador() {
    if (trab || trabRoto) return trab;
    if (typeof Worker === "undefined" || typeof location === "undefined" || !/^https?:$/.test(location.protocol)) { trabRoto = true; return null; }
    try { trab = new Worker(serieAsync.url || "serie_worker.js"); } catch (e) { trabRoto = true; return null; }
    trab.onmessage = function (ev) {
      var m = ev.data || {}, p = trabPend[m.id];
      if (!p) return;
      delete trabPend[m.id];
      if (m.ok) { m.serie.via = "worker"; p.res(m.serie); } else p.rej(new Error(m.error || "serie_worker: error"));
    };
    trab.onerror = function (ev) { if (ev && ev.preventDefault) ev.preventDefault(); caerASincrono(); };
    return trab;
  }
  function alTrabajador(msg, fb, sinWorker) {
    var w = sinWorker ? null : trabajador();
    if (!w) return fb();
    return new Promise(function (res, rej) {
      var id = ++trabSeq;
      trabPend[id] = { res: res, rej: rej, fb: fb };
      msg.id = id;
      try { w.postMessage(msg); }
      catch (e) { delete trabPend[id]; fb().then(res, rej); }
    });
  }
  function serieAsync(RED, caso, opciones) {
    return alTrabajador({ tipo: "serie", red: RED, caso: caso, opciones: opciones },
      function () { return sincrono(RED, caso, opciones); }, !!(opciones && opciones.worker === false));
  }
  function serieMontecarlo(RED, caso, opciones, n) {
    return alTrabajador({ tipo: "montecarlo", red: RED, caso: caso, opciones: opciones, n: n },
      function () { return promesa(function () { var r = serieMontecarloSync(RED, caso, opciones, n); r.via = "sincrono"; return r; }); },
      !!(opciones && opciones.worker === false));
  }

  // ---------- puntos únicos de fallo ----------
  // Solo enrutamiento (sin congestión). Un elemento que no está en ninguna ruta sin fallos no puede
  // dejar demandas sin ruta, así que se descarta sin recalcular.
  function puntosUnicosFallo(RED, opciones) {
    var G = construirGrafo(RED);
    var op = resolverOpciones(RED, opciones);
    var base = expandirCores(G, demandasBase(RED), op.reparto);
    var rb = enrutar(G, base, {}, {}, op.rutas);
    var usaN = {}, usaL = {};
    rb.forEach(function (r) {
      if (!r) return;
      r.caminos.forEach(function (c) {
        c.ruta.forEach(function (id) { usaN[id] = true; });
        c.enlaces.forEach(function (id) { usaL[id] = true; });
      });
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
        return rb[i] && usaElemento(rb[i], c.id, c.clase === "nodo");
      });
      var r = enrutar(G, sub, cN, cL, op.rutas), afect = [];
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

  // ---------- barrido N-1 (PLAN_v2 §5.2) ----------
  // Tumba uno a uno cada elemento de transporte (nodos metro, core, edge, ix; enlaces wdm, mpls —acometidas
  // de DC y de Edge—, ix) con las opciones dadas (tráfico, evento y fallos ya presentes) y ordena de peor a mejor:
  // menor % servido, más demandas sin ruta, más alertas graves, mayor ocupación máxima.
  var TIPOS_N1_NODO = { metro: 1, core: 1, edge: 1, ix: 1 }, TIPOS_N1_ENLACE = { wdm: 1, mpls: 1, ix: 1 };
  function barridoN1(RED, opciones) {
    opciones = opciones || {};
    var ya = {};
    resolverOpciones(RED, opciones).fallos.forEach(function (id) { ya[id] = true; });
    var cands = [];
    (RED.nodos || []).forEach(function (n) {
      if (n && TIPOS_N1_NODO[n.tipo] && !ya[n.id]) cands.push({ id: n.id, tipo: n.tipo, clase: "nodo", nombre: n.nombre || n.id });
    });
    (RED.enlaces || []).forEach(function (l) {
      if (l && TIPOS_N1_ENLACE[l.tipo] && !ya[l.id]) cands.push({ id: l.id, tipo: l.tipo, clase: "enlace", nombre: l.nombre || (l.a + " – " + l.b) });
    });
    var out = cands.map(function (c) {
      var o = {}, k;
      for (k in opciones) o[k] = opciones[k];
      o.fallos = [].concat(opciones.fallos || [], [c.id]);
      var r = calcular(RED, o), caidas = 0, graves = 0;
      r.demandas.forEach(function (d) { if (d.estado === "caido") caidas++; });
      r.resumen.alertas.forEach(function (a) { if (a.nivel === "grave") graves++; });
      return { id: c.id, tipo: c.tipo, clase: c.clase, nombre: c.nombre, pct_servida: r.resumen.pct_servida,
        max_ocupacion: r.resumen.max_ocupacion, enlace_max: r.resumen.enlace_max,
        demandas_caidas: caidas, alertas_graves: graves };
    });
    out.sort(function (a, b) {
      return (a.pct_servida - b.pct_servida) || (b.demandas_caidas - a.demandas_caidas) ||
        (b.alertas_graves - a.alertas_graves) || (b.max_ocupacion - a.max_ocupacion) || (a.id < b.id ? -1 : 1);
    });
    return out;
  }

  // ---------- constructor de casos (PLAN_v2 §5.1): ejes tráfico · evento · fallo ----------
  // Devuelve los valores posibles de cada eje; Motor.calcular(RED, {caso: {trafico, evento, fallo: [ids]}}).
  var TIPOS_FALLO = [
    { id: "corte_tramo", es: "Corte de tramo del anillo", en: "Ring span cut", clase: "enlace",
      filtro: function (l, N) { return l.tipo === "wdm" || (N[l.a] && N[l.b] && N[l.a].tipo === "metro" && N[l.b].tipo === "metro"); } },
    { id: "caida_metro", es: "Caída de nodo Metro", en: "Metro node failure", clase: "nodo", filtro: function (n) { return n.tipo === "metro"; } },
    { id: "caida_acometida", es: "Caída de acometida de DC", en: "DC feed failure", clase: "enlace",
      filtro: function (l, N) { return tipoPar(l, N, "core", "metro"); } },
    { id: "caida_dc", es: "Caída de DC", en: "DC failure", clase: "nodo", filtro: function (n) { return n.tipo === "core"; } },
    { id: "caida_edge", es: "Caída de Edge", en: "Edge failure", clase: "nodo", filtro: function (n) { return n.tipo === "edge"; } },
    { id: "corte_acometida_edge", es: "Corte de acometida Metro–Edge", en: "Metro–Edge feed cut", clase: "enlace",
      filtro: function (l, N) { return tipoPar(l, N, "edge", "metro"); } },
    { id: "interconexion", es: "Interconexión (IX)", en: "Interconnection (IX)", clase: "mixto",
      filtro: function (x, N) { return x.tipo === "ix"; } },
    { id: "acceso", es: "Corte de acceso de un servicio", en: "Service access cut", clase: "enlace",
      filtro: function (l) { return l.tipo === "acceso"; } }
  ];
  function tipoPar(l, N, t1, t2) {
    var a = N[l.a], b = N[l.b];
    return !!(a && b && ((a.tipo === t1 && b.tipo === t2) || (a.tipo === t2 && b.tipo === t1)));
  }
  function casos(RED) {
    var MT = RED.modelos_trafico || {}, N = {};
    (RED.nodos || []).forEach(function (n) { N[n.id] = n; });
    var trafico = ((MT.modelos) || []).slice().sort(function (a, b) { return num(a.orden, 99) - num(b.orden, 99); })
      .map(function (m) {
        return { id: m.id, es: m.nombre_es || m.id, en: m.nombre_en || m.nombre_es || m.id, origen: m.origen || null,
          hora_cargada: !!m.hora_cargada, usa_hora: !m.hora_cargada, fuente: m.fuente || null };
      });
    if (!trafico.length) trafico.push({ id: "BH", es: "Hora cargada coincidente", en: "Coincident busy hour",
      origen: "documento", hora_cargada: true, usa_hora: false, fuente: null });
    var dias = Object.keys(MT.tipos_dia || {});
    // Eventos: escenarios sin fallos que no son un modelo de tráfico (sin factores "tipo:…") ni de dimensionado
    var evento = [], nEsc = {};
    (RED.escenarios || []).forEach(function (e) {
      nEsc[e.id] = e;
      if ((e.fallos || []).length || e.hora_cargada || e.reparto_core) return;
      if (Object.keys(e.factores || {}).some(function (k) { return k.indexOf("tipo:") === 0; })) return;
      if (e.id === EVENTO_NINGUNO) return;
      evento.push({ id: e.id, es: e.nombre || e.id, en: e.nombre_en || e.nombre || e.id,
        hora: typeof e.hora === "number" ? e.hora : null });
    });
    evento.unshift({ id: "ninguno", es: "Ninguno", en: "None", escenario: nEsc[EVENTO_NINGUNO] ? EVENTO_NINGUNO : null,
      hora: nEsc[EVENTO_NINGUNO] && typeof nEsc[EVENTO_NINGUNO].hora === "number" ? nEsc[EVENTO_NINGUNO].hora : null });
    var fallo = [{ id: "ninguno", es: "Ninguno", en: "None", elementos: [] }];
    TIPOS_FALLO.forEach(function (t) {
      var els = [];
      if (t.clase !== "enlace") (RED.nodos || []).forEach(function (n) {
        if (n && t.filtro(n, N)) els.push({ id: n.id, clase: "nodo", nombre: n.nombre || n.id });
      });
      if (t.clase !== "nodo") (RED.enlaces || []).forEach(function (l) {
        if (l && t.filtro(l, N)) els.push({ id: l.id, clase: "enlace",
          nombre: (N[l.a] ? N[l.a].nombre : l.a) + " – " + (N[l.b] ? N[l.b].nombre : l.b) });
      });
      if (els.length) fallo.push({ id: t.id, es: t.es, en: t.en, elementos: els });
    });
    // Escenarios guardados con fallo (equivalen a evento + fallo); útiles como accesos directos
    var predefinidos = (RED.escenarios || []).filter(function (e) { return (e.fallos || []).length; })
      .map(function (e) { return { id: e.id, es: e.nombre || e.id, fallos: e.fallos.slice() }; });
    return { trafico: trafico, dias: dias, evento: evento, fallo: fallo, predefinidos: predefinidos,
      rutas: (RED.meta && RED.meta.referencia) ? "v7" : "dijkstra" };
  }

  // ---------- plantillas de eventos (Revisión 7) ----------
  // Motor.plantillasEventos(RED) -> [{id, es, en, descripcion:{es, en}, eventos:[{t_min, tipo, id?, params?}]}]
  // Los ids se buscan en RED (tramo E-S, escenario de partido, DC-Sur…); una plantilla cuyo elemento no existe se omite.
  function plantillasEventos(RED) {
    RED = RED || {};
    var tramo = {}, nodos = {}, escs = {};
    (RED.enlaces || []).forEach(function (l) { if (l && l.anillo && l.tramo) tramo[l.tramo] = l.id; });
    (RED.nodos || []).forEach(function (n) { if (n) nodos[n.id] = n; });
    (RED.escenarios || []).forEach(function (e) { escs[e.id] = e; });
    var dcSur = (RED.nodos || []).filter(function (n) { return n.tipo === "core" && /sur/i.test(n.nombre || ""); })[0];
    var partido = escs["E-EVENTO"] || (RED.escenarios || []).filter(function (e) {
      return !(e.fallos || []).length && Object.keys(e.factores || {}).some(function (k) { return /ESTADIO/.test(k) && e.factores[k] > 0; });
    })[0];
    var E = emplDe(RED, null), hayN258 = !E || (E.sitios || []).some(function (s) { return s.tec === "n258"; });
    function h(hh, mm) { return hh * 60 + (mm || 0); }
    var out = [];
    if (tramo["E-S"]) out.push({ id: "corte_es", es: "Corte E–S 19:30 + reparación 21:10", en: "E–S cut 19:30 + repair 21:10",
      descripcion: txt("Corte de fibra del tramo Metro-Este – Metro-Sur a las 19:30 (FRR por el arco opuesto) y reparación a las 21:10.",
        "Fibre cut on the Metro-East – Metro-South span at 19:30 (FRR over the opposite arc), repaired at 21:10."),
      eventos: [{ t_min: h(19, 30), tipo: "fallo", id: tramo["E-S"] }, { t_min: h(21, 10), tipo: "reparacion", id: tramo["E-S"] }] });
    if (partido) out.push({ id: "partido", es: "Partido 21:00–23:00", en: "Match 21:00–23:00",
      descripcion: txt("Partido en el Metropolitano (" + partido.id + "): servicios del estadio a su valor de diseño de 21:00 a 23:00.",
        "Match at the Metropolitano (" + partido.id + "): stadium services at their design value from 21:00 to 23:00."),
      eventos: [{ t_min: h(21), tipo: "evento_demanda", id: partido.id, params: { hasta_min: h(23) } }] });
    if (tramo["N-E"]) out.push({ id: "mantenimiento", es: "Mantenimiento 03:00 (N–E)", en: "Maintenance 03:00 (N–E)",
      descripcion: txt("Ventana de mantenimiento del tramo Metro-Norte – Metro-Este: TE saca los LSP a las 02:55, corte programado 03:00–05:00, TE se retira a las 05:05.",
        "Maintenance window on the Metro-North – Metro-East span: TE moves the LSPs away at 02:55, planned outage 03:00–05:00, TE removed at 05:05."),
      eventos: [{ t_min: h(2, 55), tipo: "te_reencaminar", id: tramo["N-E"], params: { fraccion: 1, hasta_min: h(5, 5) } },
        { t_min: h(3), tipo: "fallo", id: tramo["N-E"], params: { motivo: "mantenimiento" } },
        { t_min: h(5), tipo: "reparacion", id: tramo["N-E"] }] });
    if (hayN258) out.push({ id: "n258_noche", es: "Apagado nocturno n258 01:00–06:00", en: "Night switch-off n258 01:00–06:00",
      descripcion: txt("Se apaga la capa n258 (ahorro de energía): su demanda desborda a n78.",
        "The n258 layer is switched off (energy saving): its demand overflows to n78."),
      eventos: [{ t_min: h(1), tipo: "apagar_capa", id: "n258", params: { hasta_min: h(6) } }] });
    if (dcSur) out.push({ id: "caida_dc_sur", es: "Caída " + (dcSur.nombre || dcSur.id) + " 20:00 + activar NTN 20:05",
      en: "Loss of " + (dcSur.nombre || dcSur.id) + " 20:00 + NTN on 20:05",
      descripcion: txt("Cae " + (dcSur.nombre || dcSur.id) + " a las 20:00 (su parte pasa a los DC supervivientes) y a las 20:05 se activa el satélite de emergencia.",
        (dcSur.nombre || dcSur.id) + " fails at 20:00 (its share moves to the surviving DCs) and the emergency satellite is activated at 20:05."),
      eventos: [{ t_min: h(20), tipo: "fallo", id: dcSur.id }, { t_min: h(20, 5), tipo: "activar_ntn" }] });
    return out;
  }
  // Motor.opcionesPaso(o, serie, i): opciones de calcular() que reproducen el paso i de la serie (fallos + acciones activas)
  function opcionesPaso(o, s, i) {
    var p = s && s.pasos && s.pasos[i];
    if (!p) return o;
    o = o || {};
    if (Array.isArray(p.fallos)) o.fallos_exactos = p.fallos.slice();
    if (p.opciones_paso && p.opciones_paso.acciones) o.acciones = p.opciones_paso.acciones.slice(); else delete o.acciones;
    return o;
  }
  // Motor.tiposEvento() -> catálogo de tipos para el formulario de la UI
  function tiposEvento() {
    return TIPOS_EVENTO.map(function (t) { var o = copiaPlana(t); o.params = t.params.slice(); o.supuesto = SUP_TIPO[t.id] || null; return o; });
  }

  // ---------- análisis: latencia con carga, SLA, planificación, disponibilidad, comparar (CONTRATO_UI Revisión 9) ----------
  // Fórmulas con linaje en datos/gen_linaje.py (FX-035…FX-041); reglas del simulador: supuestos del ámbito "analisis" (ana.*).
  var PAQ_BITS = 1500 * 8;        // [ana.tamano_paquete] 1500 B (MTU Ethernet, RFC 894): cota superior del tiempo de servicio
  var RHO_TOPE = 0.99;            // [ana.rho_tope]
  var P95_COLA = 0.05;            // percentil 95 → cola de probabilidad 0,05
  var CLASES_PRIO = { voz: 1, urllc: 1 };   // TC1 de la v7 §6.4.2 (VoNR y URLLC en cola de prioridad estricta)
  var MIN_ANIO = 525960;          // min/año (365,25 d), como la v7 A5
  var CORTES_KM_ANIO = 4.39 / 1609.344, MTTR_FIBRA_H = 12, U_NODO = 2e-4, COMUN_MIN_ANIO = 20;   // [ana.disp_*]
  var TIPOS_DISP_NODO = { metro: 1, core: 1, edge: 1, ix: 1 };
  var SUP_ANA = { lat: ["ana.cola_mm1", "ana.tamano_paquete", "ana.rho_tope", "ana.p95_cola"], sla: ["ana.sla_objetivos"],
    plan: ["ana.planificacion", "evt.modulo_ampliacion"], disp: ["ana.disp_fibra", "ana.disp_nodo", "ana.disp_comun", "ana.disp_ponderacion"] };
  function idsSup(RED, claves) {
    var M = mapaSupuestos(RED), o = [];
    claves.forEach(function (k) { if (M.porClave[k] && o.indexOf(M.porClave[k]) < 0) o.push(M.porClave[k]); });
    return o.sort();
  }

  // Tasa de un miembro (Gbit/s): LAG de λ 400GE; backhaul/IX en módulos de 100GE (evt.modulo_ampliacion); si no, el enlace entero
  function tasaMiembro(l, cap) {
    if (!esCap(cap) || cap <= 0) return null;
    if (l.canales_400g) return Math.min(LAMBDA_GBPS, cap);
    var m = MODULO_TIPO[l.tipo];
    return (m && cap >= m) ? m : cap;
  }
  // FX-037: P95 de la espera con P(espera > 0) = ρ y espera condicionada exponencial de media W/ρ (exacto en M/M/1 FIFO)
  function esperaP95(w, rho) { return (rho > P95_COLA && w > 0) ? (w / rho) * Math.log(rho / P95_COLA) : 0; }
  // FX-036 (Cobham, no expulsiva, 2 clases, servicio exponencial): R = ρ·S; W_alta = R/(1−ρ_a); W_resto = R/((1−ρ_a)(1−ρ))
  function colaSentido(carga, cargaAlta, cap, sMs) {
    var rho = cap > 0 ? carga / cap : 0, sat = rho >= RHO_TOPE - 1e-12;
    if (rho > RHO_TOPE) rho = RHO_TOPE;
    if (rho < 0) rho = 0;
    var ra = cap > 0 ? Math.max(0, Math.min(cargaAlta / cap, rho)) : 0, R = rho * sMs;
    var w = R / ((1 - ra) * (1 - rho)), wa = R / (1 - ra);
    return { rho: rho, rho_alta: ra, sat: sat, w: w, w_alta: wa, w95: esperaP95(w, rho), w95_alta: esperaP95(wa, rho) };
  }
  var COLA_CERO = { rho: 0, rho_alta: 0, sat: false, w: 0, w_alta: 0, w95: 0, w95_alta: 0 };
  // Rellena enlaces[id].lat_* y demandas[i].lat_* (FX-035: propagación + proceso + serialización + cola)
  function latenciaCarga(G, E, dem, sdsDem) {
    var W = {};
    G.enlaces.forEach(function (l, i) {
      var e = E[l.id], cap = e.capacidad_gbps, r = tasaMiembro(l, cap), prop = G.latL[i];
      var sMs = r ? PAQ_BITS / (r * 1e6) : 0, x = { s: sMs }, ps = e.por_servicio;
      ["ab", "ba"].forEach(function (sd) {
        var alta = 0, k;
        for (k in CLASES_PRIO) if (ps[k]) alta += ps[k][sd];
        x[sd] = r && !e.caido ? colaSentido(e["carga_" + sd], alta, cap, sMs) : COLA_CERO;
      });
      W[l.id] = x;
      var sd = x.ab.w >= x.ba.w ? "ab" : "ba", m = x[sd];
      e.lat_prop_ms = prop; e.lat_ser_ms = sMs; e.cola_ms = m.w; e.cola_p95_ms = m.w95;
      e.lat_ms = prop + sMs + m.w; e.lat_p95_ms = prop + sMs + m.w95;
      e.lat_prio_ms = prop + sMs + m.w_alta; e.lat_prio_p95_ms = prop + sMs + m.w95_alta;
      e.lat_ab_ms = prop + sMs + x.ab.w; e.lat_ba_ms = prop + sMs + x.ba.w;
      e.lat_sentido = sd; e.rho_cola = m.rho; e.lat_saturado = !!(x.ab.sat || x.ba.sat);
    });
    dem.forEach(function (d, i) {
      var alta = !!CLASES_PRIO[d.clase_servicio], best = null, b95 = null, prop = null, sat = false;
      d.caminos.forEach(function (c, j) {
        if (!(c.peso > EPS)) return;
        var sds = sdsDem[i][j], ex = 0, ex95 = 0;
        c.enlaces.forEach(function (id, k) {
          var x = W[id], q = x[sds[k]];
          ex += x.s + (alta ? q.w_alta : q.w); ex95 += x.s + (alta ? q.w95_alta : q.w95);
          if (q.sat) sat = true;
        });
        if (best === null || c.latencia_ms + ex > best) best = c.latencia_ms + ex;
        if (b95 === null || c.latencia_ms + ex95 > b95) b95 = c.latencia_ms + ex95;
        if (prop === null || c.latencia_ms > prop) prop = c.latencia_ms;
      });
      if (best === null) { var l0 = typeof d.latencia_ms === "number" ? d.latencia_ms : null; best = b95 = prop = l0; }
      d.lat_ms = best; d.lat_p95_ms = b95; d.lat_sin_cola_ms = prop;
      d.lat_cola_ms = best !== null ? best - prop : null; d.lat_prioridad = alta; d.lat_saturado = sat;
    });
  }

  // resultado.sla = {slice: {nombre, objetivo_lat_ms (KPI del slice), objetivo_transporte_ms (presupuesto mínimo de sus demandas),
  //   objetivo_tput (% servido), n, n_cumple, cumple_pct, cumple_gbps_pct, n_lat, n_lat_cumple, lat_p95_max_ms, cumple, peor:{id, lat_ms, lat_p95_ms, objetivo_ms, margen_ms, servida_pct, estado}}}
  // [ana.sla_objetivos] latencia: P95 de transporte ≤ latencia_max_ms de la demanda; caudal: estado ok/latencia (servido ≥ 99 %)
  var SLA_TPUT_PCT = 99;
  function slaPorSlice(RED, dem) {
    var sl = {}, out = {};
    (RED.slices || []).forEach(function (s) { sl[s.id] = s; });
    function peorQue(a, b) {
      if (a.cumple !== b.cumple) return !a.cumple;
      var ma = a.margen_ms, mb = b.margen_ms;
      if (ma !== null && mb !== null && ma !== mb) return ma < mb;
      if ((ma === null) !== (mb === null)) return ma !== null;
      if (a.servida_pct !== b.servida_pct) return a.servida_pct < b.servida_pct;
      return (a.lat_p95_ms || 0) > (b.lat_p95_ms || 0);
    }
    dem.forEach(function (d) {
      if (!(d.dl_gbps > EPS || d.ul_gbps > EPS)) return;
      var k = d.slice || "sin_slice", o = out[k], s = sl[k];
      if (!o) o = out[k] = { nombre: s ? (s.nombre || k) : (k === "sin_slice" ? "Sin slice (L2VPN, NTN)" : k),
        objetivo_lat_ms: s ? num(s.latencia_max_ms, null) : null, objetivo_transporte_ms: null, objetivo_tput: SLA_TPUT_PCT,
        n: 0, n_cumple: 0, n_lat: 0, n_lat_cumple: 0, dl_gbps: 0, dl_cumple_gbps: 0, cumple_pct: 100, cumple_gbps_pct: 100,
        lat_p95_max_ms: null, cumple: true, peor: null };
      var lim = d.latencia_max_ms, conLim = typeof lim === "number";
      var l95 = typeof d.lat_p95_ms === "number" ? d.lat_p95_ms : null;
      var tputOk = d.estado === "ok" || d.estado === "latencia";
      var latOk = !conLim || (l95 !== null && l95 <= lim + 1e-12), ok = latOk && tputOk;
      o.n++; o.dl_gbps += d.dl_gbps;
      if (conLim) { o.n_lat++; if (latOk) o.n_lat_cumple++; o.objetivo_transporte_ms = o.objetivo_transporte_ms === null ? lim : Math.min(o.objetivo_transporte_ms, lim); }
      if (ok) { o.n_cumple++; o.dl_cumple_gbps += d.dl_gbps; }
      if (l95 !== null && (o.lat_p95_max_ms === null || l95 > o.lat_p95_max_ms)) o.lat_p95_max_ms = l95;
      var c = { id: d.id, lat_ms: typeof d.lat_ms === "number" ? d.lat_ms : null, lat_p95_ms: l95, objetivo_ms: conLim ? lim : null,
        margen_ms: conLim && l95 !== null ? lim - l95 : null, servida_pct: d.dl_gbps > EPS ? d.servida_gbps / d.dl_gbps * 100 : 100,
        estado: d.estado, cumple: ok };
      if (!o.peor || peorQue(c, o.peor)) o.peor = c;
    });
    Object.keys(out).forEach(function (k) {
      var o = out[k];
      o.cumple_pct = o.n ? o.n_cumple / o.n * 100 : 100;
      o.cumple_gbps_pct = o.dl_gbps > EPS ? o.dl_cumple_gbps / o.dl_gbps * 100 : 100;
      o.cumple = o.n_cumple === o.n;
    });
    return out;
  }

  // ---------- Motor.planificacion(RED, caso, {desde: 2026, hasta: 2035, umbral_ampliacion: 85}) ----------
  // Un calcular() por año con modelo.anio = año (proyección 3.2, extrapolada tras 2031: ana.planificacion). Por año: ocupación
  // máxima (oferta/capacidad) de enlaces, nodos con capacidad, emplazamientos de acceso y núcleo (BNG/UPF/IMS); primer elemento
  // que pasa 85 % y 100 % por familia; hoja de ruta con el módulo de evt.modulo_ampliacion (sin reencaminar: rutas fijas).
  function conAnio(base, y) {
    var o = copiaPlana(base);
    if (o.caso) {
      var c = copiaPlana(o.caso), t = c.trafico;
      c.trafico = typeof t === "string" ? { id: t, anio: y } : (t && typeof t === "object" ? copiaPlana(t) : { id: "BH" });
      c.trafico.anio = y;
      o.caso = c;
    } else {
      o.modelo = copiaPlana(o.modelo || { id: "BH" });
      o.modelo.anio = y;
    }
    return o;
  }
  function planificacion(RED, caso, opciones) {
    var t0 = ahoraMs();
    opciones = opciones || {};
    var desde = Math.round(num(opciones.desde, 2026)), hasta = Math.round(num(opciones.hasta, 2035));
    if (!(hasta >= desde)) throw new Error("planificacion: hasta debe ser ≥ desde");
    var uAmp = num(opciones.umbral_ampliacion, UMBRAL_MAJ) / 100;
    var base = opcionesDeCaso(caso || { caso: { trafico: "BH" } });
    delete base.latencia;
    var cache = {}, anios = [], EL = {}, n = hasta - desde + 1, G = construirGrafo(RED);
    function el(id, fam, tipo, extra) {
      var x = EL[fam + ":" + id];
      if (!x) {
        x = EL[fam + ":" + id] = { id: id, familia: fam, tipo: tipo || null, pct: new Array(n), oferta: new Array(n), capacidad_gbps: null };
        for (var i = 0; i < n; i++) { x.pct[i] = null; x.oferta[i] = null; }
        if (extra) for (var k in extra) x[k] = extra[k];
      }
      return x;
    }
    for (var y = desde; y <= hasta; y++) {
      var i = y - desde, o = conAnio(base, y);
      o._cache = cache; o.latencia = false;
      var r = calcular(RED, o), mx = { enlace: [0, null], nodo: [0, null], sitio: [0, null], nucleo: [0, null] };
      function marca(fam, id, p) { if (p > mx[fam][0]) { mx[fam][0] = p; mx[fam][1] = id; } }
      G.enlaces.forEach(function (l) {
        var e = r.enlaces[l.id];
        if (!e || !esCap(e.capacidad_gbps) || !(e.capacidad_gbps > 0) || e.caido) return;
        var x = el(l.id, "enlace", l.tipo, { virtual: !!l.virtual, canales_400g: l.canales_400g || null });
        x.capacidad_gbps = e.capacidad_gbps; x.oferta[i] = e.demanda_gbps; x.pct[i] = e.demanda_gbps / e.capacidad_gbps * 100;
        marca("enlace", l.id, x.pct[i]);
      });
      G.ordenNodos.forEach(function (id) {
        var nd = r.nodos[id];
        if (!nd || !esCap(nd.capacidad_gbps) || !(nd.capacidad_gbps > 0) || nd.caido) return;
        var x = el(id, "nodo", G.nodos[id].tipo);
        x.capacidad_gbps = nd.capacidad_gbps; x.oferta[i] = nd.demanda_gbps; x.pct[i] = nd.demanda_gbps / nd.capacidad_gbps * 100;
        marca("nodo", id, x.pct[i]);
      });
      var ac = r.acceso;
      if (ac) {
        Object.keys(ac.sitios || {}).forEach(function (sid) {
          var s = ac.sitios[sid];
          if (!s || s.caido || s.apagado || typeof s.util_pct !== "number") return;
          var x = EL["sitio:" + sid];
          if (!x && s.util_pct < uAmp * 100 * 0.5 && y < hasta) return;   // solo se siguen los que se acercan (coste)
          x = el(sid, "sitio", s.tec || null);
          x.pct[i] = s.util_pct;
          marca("sitio", sid, s.util_pct);
        });
        var nu = ac.nucleo || {};
        var nuc = [];
        if (nu.BNG) {
          nuc.push(["BNG", nu.BNG.util_pct], ["BNG-sesiones", nu.BNG.util_sesiones_pct]);
          Object.keys(nu.BNG.unidades || {}).forEach(function (k) { var u = nu.BNG.unidades[k]; nuc.push([k, Math.max(num(u.util_pct, 0), num(u.util_sesiones_pct, 0))]); });
        }
        if (nu.UPF) {
          nuc.push(["UPF", nu.UPF.util_pct]);
          Object.keys(nu.UPF.dcs || {}).forEach(function (k) { if (!nu.UPF.dcs[k].caido) nuc.push(["UPF@" + k, nu.UPF.dcs[k].util_pct]); });
        }
        if (nu.IMS) nuc.push(["IMS", nu.IMS.util_pct]);
        nuc.forEach(function (p) {
          if (typeof p[1] !== "number" || !isFinite(p[1])) return;
          var x = el(p[0], "nucleo", p[0].split(/[-@]/)[0]);
          x.pct[i] = p[1]; marca("nucleo", p[0], p[1]);
        });
      }
      var gl = ["enlace", "nodo", "sitio", "nucleo"].reduce(function (a, f) { return mx[f][0] > a[0] ? [mx[f][0], mx[f][1], f] : a; }, [0, null, null]);
      anios.push({ anio: y, dl_total_gbps: r.resumen.dl_total_gbps, pct_servida: r.resumen.pct_servida,
        ocup_max_pct: mx.enlace[0], ocup_max_id: mx.enlace[1], nodo_max_pct: mx.nodo[0], nodo_max_id: mx.nodo[1],
        sitio_max_pct: mx.sitio[0], sitio_max_id: mx.sitio[1], nucleo_max_pct: mx.nucleo[0], nucleo_max_id: mx.nucleo[1],
        global_max_pct: gl[0], global_max_id: gl[1], global_max_familia: gl[2], n_85: 0, n_100: 0 });
    }
    // Cruce de umbrales por elemento
    var lista = Object.keys(EL).map(function (k) { return EL[k]; });
    lista.forEach(function (x) {
      x.anio_85 = null; x.anio_100 = null;
      for (var i = 0; i < n; i++) {
        var p = x.pct[i];
        if (p === null) continue;
        if (p >= UMBRAL_MAJ - 1e-9) { anios[i].n_85++; if (x.anio_85 === null) x.anio_85 = desde + i; }
        if (p >= UMBRAL_CRIT - 1e-9) { anios[i].n_100++; if (x.anio_100 === null) x.anio_100 = desde + i; }
      }
      var p0 = null;
      for (var j = 0; j < n && p0 === null; j++) p0 = x.pct[j];
      x.pct_inicio = p0; x.pct_fin = x.pct[n - 1];
      x.desde_inicio_85 = x.anio_85 === desde; x.desde_inicio_100 = x.anio_100 === desde;
    });
    function primero(u, fam, sinInicio) {
      var k = "anio_" + u, best = null;
      lista.forEach(function (x) {
        if (x[k] === null || (fam && x.familia !== fam) || (sinInicio && x[k] === desde)) return;
        var px = x.pct[x[k] - desde];
        if (!best || x[k] < best.anio || (x[k] === best.anio && px > best.pct)) best = { id: x.id, familia: x.familia, tipo: x.tipo, anio: x[k], pct: px, desde_inicio: x[k] === desde };
      });
      return best;
    }
    var sat = {};
    [UMBRAL_MAJ, UMBRAL_CRIT].forEach(function (u) {
      var o = { global: primero(u), por_crecimiento: primero(u, null, true) };
      ["enlace", "nodo", "sitio", "nucleo"].forEach(function (f) { o[f] = primero(u, f); });
      sat[u] = o;
    });
    // Hoja de ruta: enlaces con módulo (evt.modulo_ampliacion); sitios y núcleo, solo el año (la v7 no da módulo)
    var ruta = [];
    lista.filter(function (x) { return x.familia === "enlace"; }).forEach(function (x) {
      var l = G.enlacePorId[x.id], lam = !!x.canales_400g, m = lam ? LAMBDA_GBPS : num(MODULO_TIPO[x.tipo], 100), extra = 0, nl = 0;
      for (var i = 0; i < n; i++) {
        var of = x.oferta[i], cap = x.capacidad_gbps + extra;
        if (of === null || of <= uAmp * cap + EPS) continue;
        var k = Math.ceil((of / uAmp - cap) / m - 1e-9), aviso = null;
        if (lam && x.canales_400g + nl + k > LAMBDA_MAX) {
          var kk = Math.max(0, LAMBDA_MAX - x.canales_400g - nl);
          aviso = "supera " + LAMBDA_MAX + " λ (2 × 7, v7 §6.4.1): faltan " + (k - kk) + " λ → nuevo par de fibras o ruta";
          k = kk;
        }
        if (k > 0) { extra += k * m; nl += k; }
        ruta.push({ anio: desde + i, id: x.id, familia: "enlace", tipo: x.tipo, accion: "anadir_lambda", n: k, gbps: k * m, modulo_gbps: m,
          capacidad_antes_gbps: cap, capacidad_gbps: x.capacidad_gbps + extra, ocup_antes_pct: of / cap * 100,
          ocup_despues_pct: of / (x.capacidad_gbps + extra) * 100, desde_inicio: i === 0, aviso: aviso,
          evento: k > 0 ? { tipo: "anadir_lambda", id: x.id, params: { n: k } } : null });
        if (l && l.virtual && !aviso) ruta[ruta.length - 1].nota = "acceso de servicio: módulo 10GbE (UNI v7 §6.9)";
      }
      x.ampliaciones = nl;
    });
    var porTec = {};
    lista.forEach(function (x) {
      if (x.anio_85 === null) return;
      if (x.familia === "sitio") {
        var kk = x.anio_85 + "|" + (x.tipo || "?"), g = porTec[kk] || (porTec[kk] = { anio: x.anio_85, id: x.tipo, familia: "sitio", tipo: x.tipo,
          accion: "ampliar_sitios", n_sitios: 0, sitios: [], nota: "sin módulo en la v7: más sectores/portadoras o desborde a la capa siguiente" });
        g.n_sitios++; if (g.sitios.length < 20) g.sitios.push(x.id);
      } else if (x.familia === "nucleo" || x.familia === "nodo") {
        ruta.push({ anio: x.anio_85, id: x.id, familia: x.familia, tipo: x.tipo, accion: "ampliar", ocup_antes_pct: x.pct[x.anio_85 - desde],
          desde_inicio: x.anio_85 === desde, nota: x.familia === "nucleo" ? "sin módulo en la v7: añadir unidad/servidor" : "sin módulo en la v7" });
      }
    });
    Object.keys(porTec).forEach(function (k) { ruta.push(porTec[k]); });
    ruta.sort(function (a, b) { return (a.anio - b.anio) || (a.familia < b.familia ? -1 : a.familia > b.familia ? 1 : 0) || (a.id < b.id ? -1 : 1); });
    var elementos = lista.filter(function (x) { return x.anio_85 !== null && x.familia !== "sitio"; })
      .concat(lista.filter(function (x) { return x.anio_85 !== null && x.familia === "sitio"; }).sort(function (a, b) { return (a.anio_85 - b.anio_85) || (b.pct_fin - a.pct_fin); }).slice(0, 50));
    elementos.sort(function (a, b) { return (a.anio_85 - b.anio_85) || ((b.pct_fin || 0) - (a.pct_fin || 0)); });
    return { desde: desde, hasta: hasta, umbrales: [UMBRAL_MAJ, UMBRAL_CRIT], umbral_ampliacion: uAmp * 100, anios: anios,
      saturacion: sat, elementos: elementos, hoja_ruta: ruta,
      sitios_85_total: lista.filter(function (x) { return x.familia === "sitio" && x.anio_85 !== null; }).length,
      aviso: hasta > 2031 ? "Después de 2031 la demanda extrapola la proyección 3.2 (la v7 solo llega a 2031): supuesto ana.planificacion." : null,
      supuestos: idsSup(RED, SUP_ANA.plan.concat(hasta > 2031 || desde !== 2031 ? ["dem.crecimiento_servicios"] : [])),
      ms: ahoraMs() - t0 };
  }

  // ---------- Motor.disponibilidad(RED, caso, {mtbf, mttr, cortes_km_anio, mttr_fibra_h, u_nodo, comun_min_anio, n2}) ----------
  // Indisponibilidad (min/año) por zona, clase de servicio, slice y servicio especial = Σ sucesos u·(fracción de DL perdida respecto
  // al caso sin fallos) (FX-039/FX-040, ana.disp_ponderacion). Sucesos: N-1 de nodos Metro/DC/Edge/IX y de enlaces con km, N-2 por SRLG
  // (los enlaces de un SRLG caen juntos), pares de vanos del anillo (u_i·u_j) y fallo común del núcleo (ana.disp_comun).
  function disponibilidad(RED, caso, opciones) {
    var t0 = ahoraMs();
    opciones = opciones || {};
    var cortes = num(opciones.cortes_km_anio, CORTES_KM_ANIO), mttrF = num(opciones.mttr_fibra_h, MTTR_FIBRA_H);
    var uN = (opciones.mtbf > 0 && opciones.mttr > 0) ? opciones.mttr / (opciones.mtbf + opciones.mttr) : num(opciones.u_nodo, U_NODO);
    var comun = num(opciones.comun_min_anio, COMUN_MIN_ANIO), n2 = opciones.n2 !== false;
    var base = opcionesDeCaso(caso || { caso: { trafico: "BH" } });
    base._cache = {}; base.latencia = false; base.acceso = false;
    var r0 = calcular(RED, base), ya = {};
    r0.resumen.fallos.forEach(function (id) { ya[id] = true; });
    var G = construirGrafo(RED);
    function uFibra(km) { var lh = cortes * km / 8760; return lh * mttrF / (1 + lh * mttrF); }   // FX-039
    // Grupos (clave → demandas): zona, clase de servicio, slice, servicio especial (padre)
    var s0 = {}, grupos = { zonas: {}, servicios: {}, slices: {}, especiales: {} }, total = { dl: 0 };
    function gk(d) { return [["zonas", d.zona], ["servicios", d.clase_servicio], ["slices", d.slice || "sin_slice"], ["especiales", d.clase === "servicio" ? (d.padre || d.id) : null]]; }
    r0.demandas.forEach(function (d) {
      s0[d.id] = d.servida_gbps;
      if (!(d.dl_gbps > EPS)) return;
      total.dl += d.dl_gbps;
      gk(d).forEach(function (p) {
        if (!p[1]) return;
        var g = grupos[p[0]][p[1]] || (grupos[p[0]][p[1]] = { dl_gbps: 0, indisp_min_anio: 0, sucesos: [] });
        g.dl_gbps += d.dl_gbps;
      });
    });
    // Sucesos
    var suc = [], srlg = {};
    (RED.nodos || []).forEach(function (nd) {
      if (nd && TIPOS_DISP_NODO[nd.tipo] && !ya[nd.id]) suc.push({ id: nd.id, tipo: "n1", clase: "nodo", elementos: [nd.id], u: uN });
    });
    G.enlaces.forEach(function (l) {
      if (ya[l.id] || l.tipo === "sat" || typeof l.km !== "number" || !(l.km > 0)) return;
      if (l.srlg) (srlg[l.srlg] || (srlg[l.srlg] = [])).push(l);
      else suc.push({ id: l.id, tipo: "n1", clase: "enlace", elementos: [l.id], u: uFibra(l.km), km: l.km });
    });
    Object.keys(srlg).sort().forEach(function (k) {
      var ls = srlg[k], u = 0;
      ls.forEach(function (l) { u = Math.max(u, uFibra(l.km)); });
      suc.push({ id: ls.length > 1 ? k : ls[0].id, tipo: ls.length > 1 ? "srlg" : "n1", clase: "enlace", srlg: k,
        elementos: ls.map(function (l) { return l.id; }), u: u, km: Math.max.apply(null, ls.map(function (l) { return l.km; })) });
    });
    if (n2) {
      var vanos = G.enlaces.filter(function (l) { return !ya[l.id] && G.anilloL[G.idxL[l.id]] && typeof l.km === "number"; });
      for (var a = 0; a < vanos.length; a++) for (var b = a + 1; b < vanos.length; b++)
        suc.push({ id: vanos[a].id + "+" + vanos[b].id, tipo: "n2", clase: "enlace", elementos: [vanos[a].id, vanos[b].id],
          u: uFibra(vanos[a].km) * uFibra(vanos[b].km) });
    }
    if (comun > 0 && G.cores.length) suc.push({ id: "NUCLEO-COMUN", tipo: "comun", clase: "nodo", elementos: G.cores.slice(), u: comun / MIN_ANIO });
    suc.forEach(function (s) {
      var o = copiaPlana(base);
      o.fallos = [].concat(base.fallos || [], s.elementos);
      var r = calcular(RED, o), perd = { tot: 0 }, porG = {};
      r.demandas.forEach(function (d) {
        var p = Math.max(0, (s0[d.id] || 0) - d.servida_gbps);
        if (!(p > 1e-9)) return;
        perd.tot += p;
        gk(d).forEach(function (q) { if (q[1]) { var kk = q[0] + "|" + q[1]; porG[kk] = (porG[kk] || 0) + p; } });
      });
      s.min_anio = s.u * MIN_ANIO;
      s.dl_perdida_gbps = perd.tot;
      s.fraccion_red = total.dl > EPS ? perd.tot / total.dl : 0;
      s.contribucion_min_anio = s.min_anio * s.fraccion_red;
      s.grupos_afectados = 0;
      Object.keys(porG).forEach(function (kk) {
        var i = kk.indexOf("|"), fam = kk.slice(0, i), id = kk.slice(i + 1), g = grupos[fam][id];
        if (!g || !(g.dl_gbps > EPS)) return;
        var f = Math.min(1, porG[kk] / g.dl_gbps), c = s.u * f * MIN_ANIO;
        g.indisp_min_anio += c;
        g.sucesos.push({ id: s.id, tipo: s.tipo, fraccion: f, min_anio: c });
        if (fam === "zonas") s.grupos_afectados++;
      });
    });
    var red = { indisp_min_anio: 0 };
    suc.forEach(function (s) { red.indisp_min_anio += s.contribucion_min_anio; });
    red.disponibilidad_pct = 100 * (1 - red.indisp_min_anio / MIN_ANIO);
    Object.keys(grupos).forEach(function (fam) {
      Object.keys(grupos[fam]).forEach(function (id) {
        var g = grupos[fam][id];
        g.sucesos.sort(function (a, b) { return b.min_anio - a.min_anio; });
        g.peor = g.sucesos.length ? { id: g.sucesos[0].id, tipo: g.sucesos[0].tipo, min_anio: g.sucesos[0].min_anio } : null;
        g.sucesos = g.sucesos.slice(0, 5);
        g.disponibilidad_pct = 100 * (1 - g.indisp_min_anio / MIN_ANIO);
      });
    });
    suc.sort(function (a, b) { return b.contribucion_min_anio - a.contribucion_min_anio || (a.id < b.id ? -1 : 1); });
    return { zonas: grupos.zonas, servicios: grupos.servicios, slices: grupos.slices, especiales: grupos.especiales, red: red,
      sucesos: suc, base_pct_servida: r0.resumen.pct_servida,
      parametros: { cortes_km_anio: cortes, cortes_1000mi_anio: cortes * 1609.344, mttr_fibra_h: mttrF, u_nodo: uN,
        comun_min_anio: comun, minutos_anio: MIN_ANIO, n2: n2 },
      objetivos: { nucleo_pct: 99.99, hospital_pct: 99.999, fuente: "ARCO02 (enunciado p3); v7 §2.6 (cadena del hospital 99,999 %)" },
      supuestos: idsSup(RED, SUP_ANA.disp.concat(["top.agg_abstracto"])), ms: ahoraMs() - t0 };
  }

  // ---------- Motor.comparar(resA, resB) → Δ = B − A por KPI, enlace, nodo, demanda y slice (simétrico: comparar(B, A) = −Δ) ----------
  function dif(a, b) {
    var na = typeof a === "number" && isFinite(a), nb = typeof b === "number" && isFinite(b);
    return { a: na ? a : null, b: nb ? b : null, d: na && nb ? b - a : null };
  }
  function comparar(A, B) {
    A = A || {}; B = B || {};
    var ra = A.resumen || {}, rb = B.resumen || {};
    function graves(r) { return (r.alertas || []).filter(function (x) { return x.nivel === "grave"; }).length; }
    function latMedia(R) {
      var s = 0, w = 0;
      (R.demandas || []).forEach(function (d) { if (typeof d.lat_ms === "number" && d.dl_gbps > EPS) { s += d.lat_ms * d.dl_gbps; w += d.dl_gbps; } });
      return w > 0 ? s / w : null;
    }
    var kpi = {
      dl_total_gbps: dif(ra.dl_total_gbps, rb.dl_total_gbps), servida_gbps: dif(ra.servida_gbps, rb.servida_gbps),
      pct_servida: dif(ra.pct_servida, rb.pct_servida), max_ocupacion: dif(ra.max_ocupacion, rb.max_ocupacion),
      demandas_afectadas: dif(ra.demandas_afectadas, rb.demandas_afectadas),
      enlaces_saturados: dif((ra.enlaces_saturados || []).length, (rb.enlaces_saturados || []).length),
      alertas_graves: dif(graves(ra), graves(rb)), lat_media_ms: dif(latMedia(A), latMedia(B))
    };
    function porId(oa, ob, campos) {
      var out = {}, ids = {}, k;
      for (k in (oa || {})) ids[k] = 1;
      for (k in (ob || {})) ids[k] = 1;
      Object.keys(ids).sort().forEach(function (id) {
        var x = (oa || {})[id] || {}, y = (ob || {})[id] || {}, o = { cambia: false };
        campos.forEach(function (c) { o[c] = dif(x[c], y[c]); if (o[c].d === null ? (o[c].a !== o[c].b) : Math.abs(o[c].d) > 1e-9) o.cambia = true; });
        if (!(id in (oa || {})) || !(id in (ob || {}))) { o.solo = id in (oa || {}) ? "a" : "b"; o.cambia = true; }
        out[id] = o;
      });
      return out;
    }
    function arr(R) { var o = {}; (R.demandas || []).forEach(function (d) { o[d.id] = d; }); return o; }
    var da = arr(A), db = arr(B), dems = porId(da, db, ["dl_gbps", "servida_gbps", "lat_ms", "lat_p95_ms"]);
    Object.keys(dems).forEach(function (id) {
      var ea = da[id] ? da[id].estado : null, eb = db[id] ? db[id].estado : null;
      dems[id].estado = { a: ea, b: eb, cambia: ea !== eb };
      if (ea !== eb) dems[id].cambia = true;
    });
    var enl = porId(A.enlaces, B.enlaces, ["carga_gbps", "capacidad_gbps", "ocupacion", "lat_ms", "lat_p95_ms"]);
    var nod = porId(A.nodos, B.nodos, ["carga_gbps", "ocupacion"]);
    var sla = porId(A.sla, B.sla, ["cumple_pct", "cumple_gbps_pct", "lat_p95_max_ms"]);
    function cuenta(o) { return Object.keys(o).filter(function (k) { return o[k].cambia; }).length; }
    function top(o, c, n) {
      return Object.keys(o).filter(function (k) { return o[k][c] && o[k][c].d !== null && Math.abs(o[k][c].d) > 1e-9; })
        .sort(function (x, y) { return Math.abs(o[y][c].d) - Math.abs(o[x][c].d) || (x < y ? -1 : 1); }).slice(0, n)
        .map(function (k) { return { id: k, a: o[k][c].a, b: o[k][c].b, d: o[k][c].d }; });
    }
    return { kpi: kpi, enlaces: enl, nodos: nod, demandas: dems, sla: sla,
      n_cambios: { enlaces: cuenta(enl), nodos: cuenta(nod), demandas: cuenta(dems), sla: cuenta(sla) },
      top: { enlaces_ocupacion: top(enl, "ocupacion", 10), demandas_servida: top(dems, "servida_gbps", 10), demandas_lat: top(dems, "lat_ms", 10) },
      energia: null, energia_nota: "Sin consumos por equipo en la v7 ni en hojas de datos del vault: no se calcula (v7 §7.x pide W por Gbit/s útil como dato pendiente)." };
  }

  // Registro de supuestos (RED.supuestos de fusionar.py; [] si la red no lo trae)
  function supuestos(RED) { return (RED && RED.supuestos) || []; }

  return {
    calcular: calcular,
    supuestos: supuestos,
    barridoN1: barridoN1,
    casos: casos,
    demandasBase: demandasBase,
    serieDiaria: serieDiaria,
    serie: serie,
    serieAsync: serieAsync,
    serieMontecarlo: serieMontecarlo,
    serieMontecarloSync: serieMontecarloSync,
    transferiblesMontecarlo: transferiblesMontecarlo,
    factorRuido: factorRuido,
    transferiblesSerie: transferiblesSerie,
    valorPerfil: valorPerfil,
    puntosUnicosFallo: puntosUnicosFallo,
    CLASES_SERVICIO: CLASES_SERVICIO.slice(),
    claseServicio: claseServicio,
    tecnologias: tecnologias,
    claseDeTec: claseDeTec,
    plantillasEventos: plantillasEventos,
    opcionesPaso: opcionesPaso,
    tiposEvento: tiposEvento,
    planificacion: planificacion,
    disponibilidad: disponibilidad,
    comparar: comparar,
    _construirGrafo: construirGrafo
  };
})();

if (typeof module !== "undefined") module.exports = Motor; else window.Motor = Motor;
