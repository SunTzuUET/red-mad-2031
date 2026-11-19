// Motor de cálculo del simulador de red (Proyecto 2 Madrid, SCOM + ARCO).
// Sin dependencias ni build. Funciona en navegador (window.Motor) y en node (module.exports).
// Contrato y reglas del modelo: ver PLAN.md.
// API: calcular(RED, opciones) · barridoN1(RED, opciones) · casos(RED) · serieDiaria · puntosUnicosFallo · demandasBase.
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
  function enrutar(G, demandas, caidosN, caidosL, modo) {
    if (modo === "v7") return enrutarV7(G, demandas, caidosN, caidosL);
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

  function enrutarV7(G, demandas, caidosN, caidosL) {
    var m = mascaras(G, caidosN, caidosL), cN = m.cN, cL = m.cL;
    // Cortes de tramo protegidos por FRR (los dos extremos vivos) y su arco opuesto por sentido
    var cLpre = new Uint8Array(cL), arcos = {}, hayCortes = false;
    G.enlaces.forEach(function (l, li) {
      if (!cL[li] || !G.anilloL[li]) return;
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

  function perfilDe(RED, perfil, hora) {
    if (hora === null || hora === undefined) return 1;
    var p = RED.perfiles && RED.perfiles[perfil];
    if (!p) return 1;
    return num(p[((hora % 24) + 24) % 24], 1);
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

  function resolverOpciones(RED, opciones) {
    opciones = traducirCaso(RED, opciones || {});
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
    var factores = [esc && esc.factores, opciones.factores], perfiles = null, avisoModelo = null, modeloInfo = null;
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
        modeloInfo = { id: opciones.modelo.id || "BH", anio: opciones.modelo.anio || null, dia: opciones.modelo.dia || "laborable",
          def: aj.def || null, cargada: !!aj.cargada };
      } else avisoModelo = "modelos.js no cargado: se ignora el modelo de tráfico";
    }
    return { esc: esc, escId: opciones.escenario || null, hora: hora, fallos: fallos, rutas: modoRutas(RED, opciones),
      factores: factores, cargada: cargada, reparto: reparto, perfiles: perfiles, avisoModelo: avisoModelo, modelo: modeloInfo };
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
    var rutasBase = enrutar(G, base, {}, {}, op.rutas);
    var rutas = hayFallos ? enrutar(G, base, caidosN, caidosL, op.rutas) : rutasBase;

    // Estructuras de salida
    var enlacesOut = {}, nodosOut = {}, residualL = {}, residualN = {}, ofertaL = {}, ofertaN = {};
    G.enlaces.forEach(function (l) {
      var cap = esCap(l.capacidad_gbps) ? l.capacidad_gbps : null;
      // Enlaces full duplex: carga por sentido (ab = a→b, ba = b→a); carga_gbps = sentido más cargado (v7 A11.4)
      enlacesOut[l.id] = { carga_gbps: 0, carga_ab: 0, carga_ba: 0, capacidad_gbps: cap, ocupacion: 0,
        caido: !!(caidosL[l.id] || caidosN[l.a] || caidosN[l.b]), demandas: [], demanda_gbps: 0,
        virtual: !!l.virtual, por_servicio: nuevoPorServicio() };
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
      if (r && (!rb || firmaRuta(rb) !== firmaRuta(r))) via = "respaldo";
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

    // Oferta por elemento (para % de demanda sobre capacidad)
    dem.forEach(function (d) {
      d.caminos.forEach(function (c) {
        c.enlaces.forEach(function (id, k) {
          var sd = c.sds[k];
          ofertaL[id][sd] += d.dl_gbps * d.h * c.peso; ofertaL[id][sd === "ab" ? "ba" : "ab"] += d.ul_gbps * d.h * c.peso;
        });
        c.ruta.forEach(function (id) { ofertaN[id] += d.dl_gbps * d.h * c.peso; });
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
        c.ruta.forEach(function (id) { if (residualN[id] < minR) { minR = residualN[id]; cue = "N:" + id; } });
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
          residualN[id] -= s; var n = nodosOut[id]; n.carga_gbps += s;
          if (!vN[id]) { vN[id] = 1; n.demandas.push(d.id); }
        });
      });
      d.servida_gbps = sTot / d.h;
      d.servida_ul_gbps = suTot / d.h;
    });
    dem.forEach(function (d) { d.caminos.forEach(function (c) { delete c.sds; }); });

    // Estados
    dem.forEach(function (d) {
      if (!d.ruta.length) d.estado = "caido";
      else if (d.dl_gbps > EPS && d.servida_gbps < 0.99 * d.dl_gbps) d.estado = "degradado";
      else if ((d.dl_gbps > EPS || d.ul_gbps > EPS) && d.fraccion_con_ruta < 0.99) d.estado = "degradado";
      else if (d.latencia_max_ms !== null && d.latencia_max_ms !== undefined && d.latencia_ms > d.latencia_max_ms) d.estado = "latencia";
      else d.estado = "ok";
    });

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
        por_servicio: porServ,
        supuestos_usados: usados,
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

  // Registro de supuestos (RED.supuestos de fusionar.py; [] si la red no lo trae)
  function supuestos(RED) { return (RED && RED.supuestos) || []; }

  return {
    calcular: calcular,
    supuestos: supuestos,
    barridoN1: barridoN1,
    casos: casos,
    demandasBase: demandasBase,
    serieDiaria: serieDiaria,
    puntosUnicosFallo: puntosUnicosFallo,
    CLASES_SERVICIO: CLASES_SERVICIO.slice(),
    claseServicio: claseServicio,
    _construirGrafo: construirGrafo
  };
})();

if (typeof module !== "undefined") module.exports = Motor; else window.Motor = Motor;
