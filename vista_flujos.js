// vista_flujos.js — CONTRATO_UI Revisión 11 (dueño GRAFICOS). Espacio RED, pestaña FLUJOS.
//  · Sankey en SVG propio (sin librerías): zonas → servicios → núcleo (BNG / UPF / IMS / MEC / L2VPN) → salida (IX).
//    Anchura ∝ Gbit/s DL servidos del resultado actual (NOC.resultado: se recalcula con el caso y con la hora del reloj).
//    Lo no servido (fallos, saturación) sale del servicio hacia un nodo rayado "NO SERVIDA".
//    Hover o foco (teclado) en un nodo o banda: resalta todo el camino que pasa por él y muestra la cifra; clic / Intro = ficha.
//  · Treemap zona × servicio (área ∝ demanda DL; la parte no servida, rayada): segunda pestaña de la misma vista.
//  · Experto (.solo-experto): matriz zona × servicio en tabla (alternativa accesible al gráfico).
//  Color = tipo de servicio (tokens --sv-*, NOC.colorServicio); el resto del cromo es monocromo.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista) return;
  var RED = NOC.RED || window.RED || {};
  var IDX = NOC.idx || { nodos: {}, enlaces: {}, zonas: {} };
  function t(o) { return NOC.t(o); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function gb(x) { return !esNum(x) ? "—" : NOC.fmt(x, x >= 100 ? 0 : x >= 1 ? 1 : 2); }
  function pc(x) { return !esNum(x) ? "—" : NOC.fmt(x, x >= 10 ? 0 : 1) + " %"; }
  function ico(k, tam) { try { var s = NOC.icono ? NOC.icono(k, tam || 14) : ""; return typeof s === "string" ? s : ""; } catch (e) { return ""; } }
  function colorSv(k) {
    try { if (NOC.color && NOC.color.servicio) { var c = NOC.color.servicio(k); if (c) return c; } } catch (e) { /* respaldo */ }
    if (NOC.colorServicio) return NOC.colorServicio(k);
    return "var(--sv-" + k + ")";
  }
  var CLASES = (window.Motor && Motor.CLASES_SERVICIO) || ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var ICO_SV = { movil: "embb", ftth: "ftth", voz: "voz", urllc: "urllc", iot: "iot", empresa: "l2vpn", evento: "evento", ntn: "ntn" };

  var TX = {
    tit: { es: "Flujos", en: "Flows" },
    sankey: { es: "Recorrido", en: "Path" }, treemap: { es: "Demanda por zona", en: "Demand by zone" },
    cols: [{ es: "Zona", en: "Zone" }, { es: "Servicio", en: "Service" }, { es: "Núcleo", en: "Core" }, { es: "Salida", en: "Exit" }],
    servida: { es: "servida", en: "served" }, noServ: { es: "NO SERVIDA", en: "NOT SERVED" },
    total: { es: "DL total", en: "Total DL" }, sinDatos: { es: "Sin resultado del motor todavía.", en: "No engine result yet." },
    ayuda: { es: "Ancho de cada banda ∝ Gbit/s de bajada servidos ahora (caso y hora actuales). Pasa el ratón o usa Tab sobre un bloque para ver su camino; clic o Intro abre su ficha. Rayado = tráfico no servido.",
      en: "Band width ∝ downlink Gbit/s served now (current case and time). Hover or Tab onto a block to see its path; click or Enter opens its card. Hatched = traffic not served." },
    ayudaT: { es: "Área ∝ demanda de bajada de cada zona y servicio. Rayado = parte no servida. Clic en un bloque: ficha de la zona.",
      en: "Area ∝ downlink demand per zone and service. Hatched = part not served. Click a block: zone card." },
    tabla: { es: "Matriz zona × servicio (Gbit/s DL)", en: "Zone × service matrix (DL Gbit/s)" },
    delTotal: { es: "del total", en: "of total" }, uso: { es: "uso", en: "use" }
  };
  var NOM_NUC = {
    BNG: { es: "BNG (fijo)", en: "BNG (fixed)" }, UPF: { es: "UPF 5GC", en: "UPF 5GC" }, IMS: { es: "IMS (voz)", en: "IMS (voice)" },
    MEC: { es: "MEC · UPF edge", en: "MEC · edge UPF" }, L2VPN: { es: "L2VPN directo", en: "Direct L2VPN" }, NOSERV: TX.noServ
  };
  var NOM_SAL = {
    "IX-INTERNET": { es: "IX Internet", en: "IX Internet" }, "IX-IMS": { es: "IX IMS (voz)", en: "IX IMS (voice)" }, "IX-ONEWEB": { es: "IX OneWeb (NTN)", en: "IX OneWeb (NTN)" },
    LOCAL: { es: "Local (MEC)", en: "Local (MEC)" }, SEDE: { es: "Sede empresa", en: "Enterprise site" }
  };
  var ICO_NUC = { BNG: "bng", UPF: "upf", IMS: "ims", MEC: "edge", L2VPN: "l2vpn", NOSERV: "down" };
  var ICO_SAL = { "IX-INTERNET": "ix", "IX-IMS": "ix", "IX-ONEWEB": "ix", LOCAL: "edge", SEDE: "l2vpn" };
  var ORD_NUC = ["BNG", "UPF", "IMS", "MEC", "L2VPN", "NOSERV"], ORD_SAL = ["IX-INTERNET", "IX-IMS", "IX-ONEWEB", "LOCAL", "SEDE"];

  // ======================================================================== modelo de flujos
  function nucleoDe(d) {
    if (d.destino === "ims") return "IMS";
    if (d.destino === "edge") return "MEC";
    if (d.destino === "nodo") return "L2VPN";
    if (d.slice === "fijo-bng" || d.clase_servicio === "ftth") return "BNG";
    return "UPF";
  }
  function salidaDe(d) {
    if (d.destino === "ims") return "IX-IMS";
    if (d.destino === "edge") return "LOCAL";
    if (d.destino === "nodo") return "SEDE";
    if (d.clase_servicio === "ntn") return "IX-ONEWEB";
    return "IX-INTERNET";
  }
  function nomZona(id) { return id === "SIN-ZONA" ? t({ es: "Sin zona", en: "No zone" }) : ((IDX.zonas[id] || {}).nombre || id); }
  function nomSv(k) { var I = NOC.infoServicio && NOC.infoServicio[k]; return I ? t(I.n) : k; }
  function nomNodo(col, id) {
    if (col === 0) return nomZona(id);
    if (col === 1) return nomSv(id);
    if (col === 2) return t(NOM_NUC[id] || { es: id, en: id });
    return t(NOM_SAL[id] || { es: id, en: id });
  }
  function modelo(r) {
    var tuplas = [], dl = 0, sv = 0;
    (r.demandas || []).forEach(function (d) {
      var x = Math.max(0, d.dl_gbps || 0);
      if (x <= 1e-9) return;
      var s = Math.min(x, Math.max(0, esNum(d.servida_gbps) ? d.servida_gbps : x)), u = x - s;
      var z = d.zona || "SIN-ZONA", c = CLASES.indexOf(d.clase_servicio) >= 0 ? d.clase_servicio : "movil";
      dl += x; sv += s;
      if (s > 1e-9) tuplas.push({ p: [z, c, nucleoDe(d), salidaDe(d)], v: s, d: d });
      if (u > 1e-9) tuplas.push({ p: [z, c, "NOSERV", null], v: u, d: d, no: true });
    });
    return { tuplas: tuplas, dl: dl, servida: sv };
  }

  // ======================================================================== estado
  var S = { el: null, activa: false, sucio: true, modo: "sankey", M: null, lay: null, fijo: null };
  try { var g0 = localStorage.getItem("noc.flujos.modo"); if (g0 === "treemap" || g0 === "sankey") S.modo = g0; } catch (e) { /* sin almacenamiento */ }

  // ======================================================================== Sankey: maquetación
  function maquetar(M, W, H) {
    var cols = [{}, {}, {}, {}], links = {};
    M.tuplas.forEach(function (tu, ti) {
      for (var i = 0; i < 4; i++) {
        var id = tu.p[i];
        if (id == null) continue;
        var n = cols[i][id] || (cols[i][id] = { col: i, id: id, ent: 0, sal: 0, tu: [] });
        n.tu.push(ti);
        if (i > 0) n.ent += tu.v;
        if (i < 3 && tu.p[i + 1] != null) n.sal += tu.v;
        if (i === 0) n.sal = n.sal; // zonas: solo salida
        if (i < 3 && tu.p[i + 1] != null) {
          var k = i + "|" + id + "|" + tu.p[i + 1] + "|" + tu.p[1];
          var l = links[k] || (links[k] = { k: k, col: i, a: id, b: tu.p[i + 1], sv: tu.p[1], v: 0, no: !!tu.no });
          l.v += tu.v;
        }
      }
    });
    // valor de cada nodo
    var N = cols.map(function (c, i) {
      var l = Object.keys(c).map(function (k) { var n = c[k]; n.v = Math.max(n.ent, n.sal); return n; });
      if (i === 0) l.sort(function (a, b) { return b.v - a.v; });
      else if (i === 1) l.sort(function (a, b) { return CLASES.indexOf(a.id) - CLASES.indexOf(b.id); });
      else if (i === 2) l.sort(function (a, b) { return ORD_NUC.indexOf(a.id) - ORD_NUC.indexOf(b.id); });
      else l.sort(function (a, b) { return ORD_SAL.indexOf(a.id) - ORD_SAL.indexOf(b.id); });
      return l;
    });
    var mt = 30, mb = 14, ml = Math.min(150, Math.max(96, W * 0.12)), mr = Math.min(170, Math.max(110, W * 0.14)), nw = 12;
    var ih = H - mt - mb, pad = 10;
    var k = Infinity;
    N.forEach(function (l) {
      var tot = l.reduce(function (s, n) { return s + n.v; }, 0);
      if (tot > 0) k = Math.min(k, (ih - pad * Math.max(0, l.length - 1)) / tot);
    });
    if (!isFinite(k) || k <= 0) k = 1;
    var X = [ml, ml + (W - ml - mr) / 3, ml + 2 * (W - ml - mr) / 3, W - mr - nw];
    N.forEach(function (l, i) {
      var alto = l.reduce(function (s, n) { return s + Math.max(1.5, n.v * k); }, 0) + pad * Math.max(0, l.length - 1);
      var y = mt + Math.max(0, (ih - alto) / 2);
      l.forEach(function (n) { n.x = X[i]; n.y = y; n.h = Math.max(1.5, n.v * k); y += n.h + pad; n.oo = 0; n.io = 0; });
    });
    var porId = cols;
    // bandas: orden de salida según y del destino; de entrada según y del origen
    var L = Object.keys(links).map(function (q) { return links[q]; });
    L.forEach(function (l) { l.na = porId[l.col][l.a]; l.nb = porId[l.col + 1][l.b]; l.h = l.v * k; });
    var svOrd = function (a, b) { return CLASES.indexOf(a.sv) - CLASES.indexOf(b.sv); };
    L.slice().sort(function (a, b) { return (a.nb.y - b.nb.y) || svOrd(a, b); }).forEach(function (l) { l.y0 = l.na.y + l.na.oo; l.na.oo += l.h; });
    L.slice().sort(function (a, b) { return (a.na.y - b.na.y) || svOrd(a, b); }).forEach(function (l) { l.y1 = l.nb.y + l.nb.io; l.nb.io += l.h; });
    return { N: N, L: L, porId: porId, k: k, W: W, H: H, nw: nw, X: X, mt: mt };
  }
  function bandaD(x0, y0, x1, y1, h) {
    var xm = (x0 + x1) / 2;
    return "M" + x0.toFixed(1) + " " + y0.toFixed(2) + "C" + xm.toFixed(1) + " " + y0.toFixed(2) + " " + xm.toFixed(1) + " " + y1.toFixed(2) + " " + x1.toFixed(1) + " " + y1.toFixed(2) +
      "L" + x1.toFixed(1) + " " + (y1 + h).toFixed(2) + "C" + xm.toFixed(1) + " " + (y1 + h).toFixed(2) + " " + xm.toFixed(1) + " " + (y0 + h).toFixed(2) + " " + x0.toFixed(1) + " " + (y0 + h).toFixed(2) + "Z";
  }
  function nucleoUso(id) {
    var A = NOC.resultado && NOC.resultado.acceso && NOC.resultado.acceso.nucleo;
    if (!A) return null;
    if (id === "BNG" && A.BNG) return A.BNG.util_pct;
    if (id === "UPF" && A.UPF) return A.UPF.util_pct;
    if (id === "IMS" && A.IMS) return A.IMS.util_pct;
    return null;
  }
  function sevPct(v) { return !esNum(v) ? "ok" : v > 100 ? "crit" : v >= 85 ? "maj" : v >= 60 ? "min" : "ok"; }
  function svgSankey(lay, M) {
    var W = lay.W, H = lay.H, nw = lay.nw, o = "";
    o += '<svg class="fx-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' +
      esc(t({ es: "Diagrama de flujos: zonas, servicios, núcleo y salida. ", en: "Flow diagram: zones, services, core and exit. " }) + t(TX.total) + " " + gb(M.dl) + " Gbit/s") + '">';
    o += '<defs><pattern id="fx-rayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="rgba(229,72,77,.18)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--crit)" stroke-width="2"/></pattern></defs>';
    // cabeceras de columna
    TX.cols.forEach(function (c, i) {
      var x = lay.X[i] + (i === 3 ? nw : 0), an = i === 0 ? "start" : i === 3 ? "end" : "start";
      o += '<text class="fx-colt" x="' + x.toFixed(1) + '" y="14" text-anchor="' + an + '">' + esc(t(c).toUpperCase()) + '</text>';
    });
    // bandas
    o += '<g class="fx-bandas">';
    lay.L.forEach(function (l, i) {
      var x0 = l.na.x + nw, x1 = l.nb.x;
      o += '<path class="fx-l' + (l.no ? " fx-l-no" : "") + '" data-l="' + i + '" d="' + bandaD(x0, l.y0, x1, l.y1, Math.max(0.6, l.h)) + '" style="fill:' + (l.no ? "url(#fx-rayas)" : colorSv(l.sv)) + '"/>';
    });
    o += '</g><g class="fx-resalte"></g>';
    // nodos
    lay.N.forEach(function (l, ci) {
      l.forEach(function (n) {
        var nom = nomNodo(ci, n.id), uso = ci === 2 ? nucleoUso(n.id) : null, no = n.id === "NOSERV";
        var fill = ci === 1 ? colorSv(n.id) : no ? "url(#fx-rayas)" : "var(--steel-flat)";
        var lbl = nom + " · " + gb(n.v) + " Gbit/s" + (esNum(uso) ? " · " + t(TX.uso) + " " + pc(uso) : "");
        o += '<g class="fx-n' + (no ? " fx-n-no" : "") + '" data-c="' + ci + '" data-id="' + esc(n.id) + '" tabindex="0" role="button" aria-label="' + esc(lbl) + '">' +
          '<rect class="fx-golpe" x="' + (n.x - 4).toFixed(1) + '" y="' + (n.y - 2).toFixed(1) + '" width="' + (nw + 8) + '" height="' + (n.h + 4).toFixed(1) + '"/>' +
          '<rect class="fx-nr" x="' + n.x.toFixed(1) + '" y="' + n.y.toFixed(1) + '" width="' + nw + '" height="' + n.h.toFixed(2) + '" style="fill:' + fill + '"' + (no ? ' stroke="var(--crit)"' : '') + '/>';
        // etiqueta (solo si el bloque es lo bastante alto; el resto, en el tooltip)
        if (n.h >= 9 || no || ci >= 2) {
          var izq = ci === 0, x = izq ? n.x - 6 : n.x + nw + 6, yc = n.y + n.h / 2;
          var ic = ci === 2 ? ico(ICO_NUC[n.id], 13) : ci === 3 ? ico(ICO_SAL[n.id], 13) : ci === 1 ? ico(ICO_SV[n.id], 13) : "";
          var dx = 0;
          if (ic && /^<svg/.test(ic) && !izq) { o += '<g class="fx-ico" transform="translate(' + x.toFixed(1) + ',' + (yc - 6.5).toFixed(1) + ')">' + ic + '</g>'; dx = 17; }
          var anchoTxt = izq ? null : (ci === 3 ? lay.W - x - dx - 2 : (lay.X[ci + 1] - x - dx - 8));
          var txt = nom, cif = gb(n.v);
          if (anchoTxt != null && anchoTxt < 70) cif = "";
          o += '<text class="fx-et' + (no ? " fx-et-no" : "") + '" x="' + (x + dx).toFixed(1) + '" y="' + (yc + (ci === 2 && esNum(uso) && n.h > 22 ? -2 : 4)).toFixed(1) + '" text-anchor="' + (izq ? "end" : "start") + '">' +
            esc(txt) + (cif ? ' <tspan class="fx-cif">' + cif + '</tspan>' : '') + '</text>';
          if (ci === 2 && esNum(uso) && n.h > 22) o += '<text class="fx-uso sev-t-' + sevPct(uso) + '" x="' + (x + dx).toFixed(1) + '" y="' + (yc + 11).toFixed(1) + '">' + esc(t(TX.uso)) + ' ' + pc(uso) + '</text>';
        }
        o += '</g>';
      });
    });
    return o + '</svg>';
  }

  // ======================================================================== Sankey: resalte de caminos
  function seleccionDe(lay, M, tipo, ref) {
    // devuelve las tuplas (índices) del camino
    if (tipo === "n") {
      var n = lay.porId[ref.c][ref.id];
      return n ? n.tu : [];
    }
    var l = lay.L[ref];
    if (!l) return [];
    var out = [];
    M.tuplas.forEach(function (tu, i) { if (tu.p[l.col] === l.a && tu.p[l.col + 1] === l.b && tu.p[1] === l.sv) out.push(i); });
    return out;
  }
  function resaltar(tipo, ref) {
    var svg = S.el && S.el.querySelector(".fx-svg");
    if (!svg || !S.lay) return;
    var g = svg.querySelector(".fx-resalte");
    if (tipo == null) { svg.classList.remove("fx-foco"); g.innerHTML = ""; return null; }
    var lay = S.lay, M = S.M, sel = seleccionDe(lay, M, tipo, ref);
    var porL = {}, tot = 0;
    sel.forEach(function (i) {
      var tu = M.tuplas[i];
      tot += tu.v;
      for (var c = 0; c < 3; c++) {
        if (tu.p[c + 1] == null) continue;
        var k = c + "|" + tu.p[c] + "|" + tu.p[c + 1] + "|" + tu.p[1];
        porL[k] = (porL[k] || 0) + tu.v;
      }
    });
    var o = "";
    lay.L.forEach(function (l) {
      var v = porL[l.k];
      if (!v) return;
      var h = Math.max(0.8, v * lay.k);
      o += '<path class="fx-lr" d="' + bandaD(l.na.x + lay.nw, l.y0, l.nb.x, l.y1, h) + '" style="fill:' + (l.no ? "url(#fx-rayas)" : colorSv(l.sv)) + '"/>';
    });
    g.innerHTML = o;
    svg.classList.add("fx-foco");
    return { sel: sel, tot: tot };
  }
  function tooltipHTML(tipo, ref, res) {
    var lay = S.lay, M = S.M, h = "";
    var porSv = {};
    (res.sel || []).forEach(function (i) { var tu = M.tuplas[i]; var k = tu.no ? "_no" : tu.p[1]; porSv[k] = (porSv[k] || 0) + tu.v; });
    if (tipo === "n") {
      var n = lay.porId[ref.c][ref.id], uso = ref.c === 2 ? nucleoUso(ref.id) : null;
      h += '<div class="fx-tt-cab">' + esc(nomNodo(ref.c, ref.id)) + '</div>' +
        '<div class="fx-tt-big"><b>' + gb(n.v) + '</b> Gbit/s <span class="tx3">' + pc(M.dl ? n.v / M.dl * 100 : 0) + ' ' + esc(t(TX.delTotal)) + '</span></div>' +
        (esNum(uso) ? '<div>' + esc(t(TX.uso)) + ' <b class="sev-t-' + sevPct(uso) + '">' + pc(uso) + '</b></div>' : '');
    } else {
      var l = lay.L[ref];
      h += '<div class="fx-tt-cab">' + esc(nomNodo(l.col, l.a)) + ' → ' + esc(nomNodo(l.col + 1, l.b)) + '</div>' +
        '<div class="fx-tt-big"><b>' + gb(l.v) + '</b> Gbit/s <span class="tx3">' + esc(nomSv(l.sv)) + '</span></div>';
    }
    var ks = Object.keys(porSv).sort(function (a, b) { return porSv[b] - porSv[a]; });
    if (ks.length > 1 || tipo === "n") {
      h += ks.slice(0, 5).map(function (k) {
        var no = k === "_no";
        return '<div class="fx-tt-f"><i class="' + (no ? "fx-sw-no" : "") + '" style="' + (no ? "" : "background:" + colorSv(k)) + '"></i><span>' + esc(no ? t(TX.noServ) : nomSv(k)) + '</span><b>' + gb(porSv[k]) + '</b></div>';
      }).join("");
    }
    return h;
  }
  function mostrarTT(html, x, y) {
    var tt = S.el && S.el.querySelector(".fx-tt"), box = S.el && S.el.querySelector(".fx-lienzo");
    if (!tt || !box) return;
    tt.innerHTML = html; tt.hidden = false;
    var bw = box.clientWidth, tw = tt.offsetWidth || 220, th = tt.offsetHeight || 80;
    var px = x + 14, py = y + 12;
    if (px + tw > bw - 4) px = x - tw - 14;
    if (py + th > box.clientHeight - 4) py = Math.max(4, y - th - 10);
    tt.style.left = Math.max(4, px) + "px"; tt.style.top = py + "px";
  }
  function ocultarTT() { var tt = S.el && S.el.querySelector(".fx-tt"); if (tt) tt.hidden = true; }

  // ======================================================================== fichas
  function filaDem(d) {
    return '<tr data-fx-dem="' + esc(d.id) + '"><td class="id" title="' + esc(d.id) + '">' + esc(NOC.nombreCorto ? NOC.nombreCorto(d.id) : d.id) + '</td><td class="n">' + gb(d.dl_gbps) + '</td><td class="n">' + pc(d.dl_gbps > 0 ? d.servida_gbps / d.dl_gbps * 100 : 100) + '</td></tr>';
  }
  function tablaDems(ds) {
    ds = ds.slice().sort(function (a, b) { return b.dl_gbps - a.dl_gbps; });
    return '<table class="tabla fx-ft"><thead><tr><th scope="col">' + esc(t({ es: "Demanda", en: "Demand" })) + '</th><th scope="col" class="n">Gbit/s</th><th scope="col" class="n">' + esc(t(TX.servida)) + '</th></tr></thead><tbody>' +
      ds.slice(0, 12).map(filaDem).join("") + '</tbody></table>' + (ds.length > 12 ? '<p class="nota tx3">+' + (ds.length - 12) + '</p>' : '');
  }
  function medidor(v) {
    if (!esNum(v)) return "";
    try { if (NOC.medidor) { var m = NOC.medidor(v / 100, { max: 1, unidad: "%", ancho: 220 }); if (m) return '<div class="fx-med">' + m + '</div>'; } } catch (e) { /* respaldo */ }
    return '<div class="fx-barra" role="img" aria-label="' + esc(t(TX.uso) + " " + pc(v)) + '"><i class="sev-b-' + sevPct(v) + '" style="width:' + Math.min(100, v).toFixed(1) + '%"></i><span>' + pc(v) + '</span></div>';
  }
  function barrasSv(ds) {
    var porSv = {}, tot = 0;
    ds.forEach(function (d) { porSv[d.clase_servicio] = (porSv[d.clase_servicio] || 0) + d.dl_gbps; tot += d.dl_gbps; });
    var ks = Object.keys(porSv).filter(function (k) { return porSv[k] > 1e-9; }).sort(function (a, b) { return porSv[b] - porSv[a]; });
    if (!tot) return "";
    return '<div class="fx-apil" role="img" aria-label="' + esc(ks.map(function (k) { return nomSv(k) + " " + gb(porSv[k]); }).join(", ")) + '">' + ks.map(function (k) {
      return '<i style="width:' + (porSv[k] / tot * 100).toFixed(2) + '%;background:' + colorSv(k) + '" title="' + esc(nomSv(k) + " " + gb(porSv[k]) + " Gbit/s") + '"></i>';
    }).join("") + '</div><div class="fx-apil-ley">' + ks.map(function (k) { return '<span><i style="background:' + colorSv(k) + '"></i>' + esc(nomSv(k)) + ' <b>' + gb(porSv[k]) + '</b></span>'; }).join("") + '</div>';
  }
  function fichaPropia(tit, sub, cuerpo, ds) {
    NOC.seleccion = { tipo: "flujo", id: tit };
    NOC.abrirFicha({ titulo: tit, subtitulo: sub, html: '<div class="ficha-sec"><h3>' + esc(t({ es: "Tráfico", en: "Traffic" })) + '</h3>' + cuerpo + barrasSv(ds) + '</div>' +
      '<div class="ficha-sec solo-experto"><h3>' + esc(t({ es: "Demandas", en: "Demands" })) + '</h3>' + tablaDems(ds) + '</div>' });
  }
  function abrirNodo(c, id) {
    var M = S.M, r = NOC.resultado || {};
    if (c === 0 && IDX.zonas[id]) { NOC.seleccionar("zona", id); return; }
    if (c === 1 && NOC.fichaServicio) { NOC.seleccion = { tipo: "servicio", id: id }; NOC.fichaServicio(id); return; }
    if (c === 3 && IDX.nodos[id]) { NOC.seleccionar("nodo", id); return; }
    var n = S.lay && S.lay.porId[c][id];
    if (!n) return;
    var ds = [], visto = {};
    n.tu.forEach(function (i) { var d = M.tuplas[i].d; if (!visto[d.id]) { visto[d.id] = 1; ds.push(d); } });
    var cuerpo = '<div class="fx-big"><b>' + gb(n.v) + '</b> Gbit/s</div>' + medidor(c === 2 ? nucleoUso(id) : null);
    if (c === 2) {
      var A = r.acceso && r.acceso.nucleo;
      var uni = id === "BNG" && A && A.BNG ? A.BNG.unidades : id === "UPF" && A && A.UPF ? A.UPF.dcs : id === "MEC" && A && A.UPF ? A.UPF.edges : null;
      if (uni) cuerpo += '<div class="fx-uni">' + Object.keys(uni).map(function (u) {
        var x = uni[u];
        return '<div class="fx-uni-f"><span class="mono" title="' + esc(u) + '">' + esc(NOC.nombreCorto ? NOC.nombreCorto(u) : u) + '</span><b>' + gb(x.gbps != null ? x.gbps : x.dl_gbps) + '</b>' + (esNum(x.util_pct) ? medidor(x.util_pct) : '') + '</div>';
      }).join("") + '</div>';
    }
    fichaPropia(nomNodo(c, id), t(TX.cols[c]) + " · " + t(TX.tit), cuerpo, ds);
  }
  function abrirBanda(i) {
    var l = S.lay && S.lay.L[i];
    if (!l) return;
    var ds = [], visto = {};
    seleccionDe(S.lay, S.M, "l", i).forEach(function (j) { var d = S.M.tuplas[j].d; if (!visto[d.id]) { visto[d.id] = 1; ds.push(d); } });
    fichaPropia(nomNodo(l.col, l.a) + " → " + nomNodo(l.col + 1, l.b), nomSv(l.sv) + " · " + t(TX.tit), '<div class="fx-big"><b>' + gb(l.v) + '</b> Gbit/s</div>', ds);
  }

  // ======================================================================== treemap (squarified)
  function squarify(items, x, y, w, h) {
    var out = [], tot = items.reduce(function (s, it) { return s + it.v; }, 0);
    if (tot <= 0 || w <= 0 || h <= 0) return out;
    var esc2 = w * h / tot, cola = items.map(function (it) { return { it: it, a: it.v * esc2 }; });
    function peor(fila, lado) {
      var s = 0, mx = 0, mn = Infinity;
      fila.forEach(function (f) { s += f.a; mx = Math.max(mx, f.a); mn = Math.min(mn, f.a); });
      return Math.max(lado * lado * mx / (s * s), (s * s) / (lado * lado * mn));
    }
    function colocar(fila) {
      var s = fila.reduce(function (q, f) { return q + f.a; }, 0);
      if (w >= h) {
        var cw = s / h, yy = y;
        fila.forEach(function (f) { var fh = f.a / cw; out.push({ it: f.it, x: x, y: yy, w: cw, h: fh }); yy += fh; });
        x += cw; w -= cw;
      } else {
        var ch = s / w, xx = x;
        fila.forEach(function (f) { var fw = f.a / ch; out.push({ it: f.it, x: xx, y: y, w: fw, h: ch }); xx += fw; });
        y += ch; h -= ch;
      }
    }
    var fila = [];
    while (cola.length) {
      var lado = Math.min(w, h), c = cola[0];
      if (!fila.length || peor(fila.concat([c]), lado) <= peor(fila, lado)) { fila.push(c); cola.shift(); }
      else { colocar(fila); fila = []; }
    }
    if (fila.length) colocar(fila);
    return out;
  }
  function svgTreemap(r, W, H) {
    var Z = {}, tot = 0;
    (r.demandas || []).forEach(function (d) {
      var x = Math.max(0, d.dl_gbps || 0);
      if (x <= 1e-9) return;
      var z = d.zona || "SIN-ZONA", c = d.clase_servicio;
      var zz = Z[z] || (Z[z] = { id: z, v: 0, sv: {} });
      var s = zz.sv[c] || (zz.sv[c] = { id: c, v: 0, s: 0 });
      zz.v += x; s.v += x; s.s += Math.min(x, Math.max(0, esNum(d.servida_gbps) ? d.servida_gbps : x)); tot += x;
    });
    var zs = Object.keys(Z).map(function (k) { return Z[k]; }).sort(function (a, b) { return b.v - a.v; });
    var R = squarify(zs, 0, 0, W, H), o = "";
    o += '<svg class="tm-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + esc(t({ es: "Mapa de demanda por zona y servicio", en: "Demand treemap by zone and service" }) + " · " + gb(tot) + " Gbit/s") + '">' +
      '<defs><pattern id="tm-rayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-width="2.4"/></pattern></defs>';
    R.forEach(function (rz) {
      var z = rz.it, cab = rz.h > 40 && rz.w > 60 ? 18 : 0, g = 2;
      var lbl = nomZona(z.id) + " · " + gb(z.v) + " Gbit/s · " + pc(tot ? z.v / tot * 100 : 0);
      o += '<g class="tm-z" data-z="' + esc(z.id) + '" tabindex="0" role="button" aria-label="' + esc(lbl) + '">' +
        '<rect class="tm-zr" x="' + rz.x.toFixed(1) + '" y="' + rz.y.toFixed(1) + '" width="' + rz.w.toFixed(1) + '" height="' + rz.h.toFixed(1) + '"/>';
      if (cab) o += '<text class="tm-zt" x="' + (rz.x + 6).toFixed(1) + '" y="' + (rz.y + 13).toFixed(1) + '">' + esc(nomZona(z.id)) + ' <tspan class="tm-zc">' + gb(z.v) + '</tspan></text>';
      var svs = Object.keys(z.sv).map(function (k) { return z.sv[k]; }).filter(function (s) { return s.v > 1e-9; }).sort(function (a, b) { return b.v - a.v; });
      squarify(svs, rz.x + g, rz.y + cab + g, Math.max(0, rz.w - 2 * g), Math.max(0, rz.h - cab - 2 * g)).forEach(function (rs) {
        var s = rs.it, no = Math.max(0, s.v - s.s), x0 = rs.x + 1, y0 = rs.y + 1, w0 = Math.max(0, rs.w - 2), h0 = Math.max(0, rs.h - 2);
        var tl = nomZona(z.id) + " · " + nomSv(s.id) + " · " + gb(s.v) + " Gbit/s" + (no > 1e-6 ? " · " + t(TX.noServ) + " " + gb(no) : "");
        o += '<g class="tm-c" data-z="' + esc(z.id) + '" data-s="' + esc(s.id) + '" data-tt="' + esc(tl) + '"><rect x="' + x0.toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + w0.toFixed(1) + '" height="' + h0.toFixed(1) + '" style="fill:' + colorSv(s.id) + '"/>';
        if (no > 1e-6 && h0 > 0) {
          var hn = h0 * no / s.v;
          o += '<rect class="tm-no" x="' + x0.toFixed(1) + '" y="' + (y0 + h0 - hn).toFixed(1) + '" width="' + w0.toFixed(1) + '" height="' + hn.toFixed(1) + '" fill="url(#tm-rayas)"/>';
        }
        if (w0 > 58 && h0 > 30) o += '<text class="tm-ct" x="' + (x0 + 5).toFixed(1) + '" y="' + (y0 + 14).toFixed(1) + '">' + esc(nomSv(s.id)) + '</text><text class="tm-cv" x="' + (x0 + 5).toFixed(1) + '" y="' + (y0 + 27).toFixed(1) + '">' + gb(s.v) + '</text>';
        else if (w0 > 34 && h0 > 16) o += '<text class="tm-cv" x="' + (x0 + 4).toFixed(1) + '" y="' + (y0 + 12).toFixed(1) + '">' + gb(s.v) + '</text>';
        o += '</g>';
      });
      if (!cab && rz.w > 30 && rz.h > 14) o += '<text class="tm-zt tm-zt-p" x="' + (rz.x + 4).toFixed(1) + '" y="' + (rz.y + rz.h - 4).toFixed(1) + '">' + esc(nomZona(z.id)) + '</text>';
      o += '</g>';
    });
    return o + '</svg>';
  }
  function leyendaSv(r) {
    var ps = (r.resumen && r.resumen.por_servicio) || {};
    return '<div class="fx-ley" aria-hidden="true">' + CLASES.filter(function (k) { return ps[k] && ps[k].dl_gbps > 1e-9; }).map(function (k) {
      return '<span><i style="background:' + colorSv(k) + '"></i>' + esc(nomSv(k)) + '</span>';
    }).join("") + '<span><i class="fx-sw-no"></i>' + esc(t(TX.noServ)) + '</span></div>';
  }

  // ======================================================================== tabla (experto)
  function tablaMatriz(M) {
    var Z = {}, cs = {};
    M.tuplas.forEach(function (tu) { var z = tu.p[0], c = tu.p[1]; Z[z] = Z[z] || {}; Z[z][c] = (Z[z][c] || 0) + tu.v; cs[c] = 1; });
    var cl = CLASES.filter(function (c) { return cs[c]; }), zs = Object.keys(Z).sort(function (a, b) {
      var sa = 0, sb = 0; cl.forEach(function (c) { sa += Z[a][c] || 0; sb += Z[b][c] || 0; }); return sb - sa;
    });
    return '<table class="tabla fx-mat"><caption class="lbl">' + esc(t(TX.tabla)) + '</caption><thead><tr><th scope="col">' + esc(t(TX.cols[0])) + '</th>' + cl.map(function (c) { return '<th scope="col" class="n">' + esc(nomSv(c)) + '</th>'; }).join("") + '<th scope="col" class="n">Σ</th></tr></thead><tbody>' +
      zs.map(function (z) {
        var s = 0;
        return '<tr data-sel="zona" data-id="' + esc(z) + '"><td>' + esc(nomZona(z)) + '</td>' + cl.map(function (c) { var v = Z[z][c] || 0; s += v; return '<td class="n">' + (v ? gb(v) : "") + '</td>'; }).join("") + '<td class="n"><b>' + gb(s) + '</b></td></tr>';
      }).join("") + '</tbody></table>';
  }

  // ======================================================================== pintar
  function info(txt) {
    try { if (NOC.info) { var b = NOC.info(txt); if (b) return b; } } catch (e) { /* respaldo */ }
    return '<span class="fx-info" tabindex="0" role="note" title="' + esc(txt) + '" aria-label="' + esc(txt) + '">i</span>';
  }
  function pintar() {
    var el = S.el;
    if (!el) return;
    S.sucio = false;
    var r = NOC.resultado;
    if (!r || !r.demandas) { el.innerHTML = '<div class="vacio">' + esc(t(TX.sinDatos)) + '</div>'; return; }
    S.M = modelo(r);
    var M = S.M, pr = r.paso_reloj, no = M.dl - M.servida, pctS = M.dl ? M.servida / M.dl * 100 : 100;
    var h = '<div class="fx-barra-sup"><span class="lbl">' + esc(t(TX.tit)) + '</span>' +
      '<span class="seg" role="tablist">' + [["sankey", TX.sankey], ["treemap", TX.treemap]].map(function (x) {
        return '<button type="button" role="tab" data-fx-modo="' + x[0] + '" aria-pressed="' + (S.modo === x[0]) + '" aria-selected="' + (S.modo === x[0]) + '">' + esc(t(x[1])) + '</button>';
      }).join("") + '</span>' +
      '<span class="fx-kpi"><b>' + gb(M.dl) + '</b> Gbit/s DL</span>' +
      '<span class="fx-kpi' + (no > 1e-6 ? " fx-kpi-mal" : "") + '">' + (no > 1e-6 ? '<i class="fx-sw-no"></i>' : '') + '<b>' + pc(pctS) + '</b> ' + esc(t(TX.servida)) + (no > 1e-6 ? ' <span class="tx3">(−' + gb(no) + ')</span>' : '') + '</span>' +
      (pr ? '<span class="fx-kpi tx3">▶ ' + esc(pr.etiqueta) + '</span>' : '') +
      '<span class="pl-esp" style="flex:1"></span>' + info(t(S.modo === "sankey" ? TX.ayuda : TX.ayudaT)) + '</div>' +
      '<div class="fx-lienzo" data-modo="' + S.modo + '"></div><div class="fx-pie">' + leyendaSv(r) + '</div>' +
      '<div class="fx-exp solo-experto">' + tablaMatriz(M) + '</div>';
    el.innerHTML = h;
    var lz = el.querySelector(".fx-lienzo");
    lz.insertAdjacentHTML("beforeend", '<div class="fx-tt" role="tooltip" hidden></div>');
    dibujar();
  }
  function dibujar() {
    var lz = S.el && S.el.querySelector(".fx-lienzo"), r = NOC.resultado;
    if (!lz || !r || !S.M) return;
    var W = Math.max(520, lz.clientWidth || 900), H = Math.max(380, Math.min(760, (S.el.clientHeight || 600) - 96));
    var vieja = lz.querySelector("svg");
    if (vieja) vieja.remove();
    var html;
    if (S.modo === "treemap") { S.lay = null; html = svgTreemap(r, W, H); }
    else { S.lay = maquetar(S.M, W, H); html = svgSankey(S.lay, S.M); }
    lz.insertAdjacentHTML("afterbegin", html);
  }

  // ======================================================================== eventos
  function refDe(target) {
    var n = target.closest && target.closest(".fx-n");
    if (n) return { tipo: "n", ref: { c: Number(n.getAttribute("data-c")), id: n.getAttribute("data-id") }, el: n };
    var l = target.closest && target.closest(".fx-l");
    if (l) return { tipo: "l", ref: Number(l.getAttribute("data-l")), el: l };
    return null;
  }
  function posRel(ev, el) {
    var b = S.el.querySelector(".fx-lienzo").getBoundingClientRect();
    if (ev && esNum(ev.clientX) && ev.clientX) return { x: ev.clientX - b.left, y: ev.clientY - b.top };
    var r = el.getBoundingClientRect();
    return { x: r.right - b.left, y: r.top - b.top };
  }
  function hoverSankey(ev, foco) {
    var q = refDe(ev.target);
    if (!q) { if (!S.fijo) { resaltar(null); ocultarTT(); } return; }
    var res = resaltar(q.tipo, q.ref);
    if (!res) return;
    var p = posRel(foco ? null : ev, q.el);
    mostrarTT(tooltipHTML(q.tipo, q.ref, res), p.x, p.y);
  }
  function hoverTreemap(ev, foco) {
    var c = ev.target.closest && (ev.target.closest(".tm-c") || ev.target.closest(".tm-z"));
    if (!c) { ocultarTT(); return; }
    var txt = c.getAttribute("data-tt") || c.getAttribute("aria-label") || "";
    var p = posRel(foco ? null : ev, c);
    mostrarTT('<div class="fx-tt-cab">' + esc(txt) + '</div>', p.x, p.y);
  }
  function montar(el) {
    S.el = el; el.classList.add("fx");
    el.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-fx-modo]");
      if (b) { S.modo = b.getAttribute("data-fx-modo"); try { localStorage.setItem("noc.flujos.modo", S.modo); } catch (e) { /* nada */ } pintar(); return; }
      if ((b = ev.target.closest("[data-fx-dem]"))) return;
      if (S.modo === "sankey") {
        var q = refDe(ev.target);
        if (!q) return;
        if (q.tipo === "n") abrirNodo(q.ref.c, q.ref.id); else abrirBanda(q.ref);
      } else {
        var z = ev.target.closest(".tm-z");
        if (z) { var id = z.getAttribute("data-z"); if (IDX.zonas[id]) NOC.seleccionar("zona", id); }
      }
    });
    el.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var n = ev.target.closest && (ev.target.closest(".fx-n") || ev.target.closest(".tm-z"));
      if (!n) return;
      ev.preventDefault();
      n.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    el.addEventListener("mousemove", function (ev) { if (S.modo === "sankey") hoverSankey(ev); else hoverTreemap(ev); });
    el.addEventListener("focusin", function (ev) { if (S.modo === "sankey") hoverSankey(ev, true); else hoverTreemap(ev, true); });
    el.addEventListener("focusout", function () { resaltar(null); ocultarTT(); });
    el.addEventListener("mouseleave", function () { resaltar(null); ocultarTT(); });
    // tabla experto y fichas: clic en fila de demanda
    document.addEventListener("click", function (ev) {
      var d = ev.target.closest && ev.target.closest("[data-fx-dem]");
      if (d && NOC.planificacion && NOC.planificacion.abrirDemanda) { ev.preventDefault(); NOC.planificacion.abrirDemanda(d.getAttribute("data-fx-dem")); }
    });
    pintar();
  }
  NOC.registrarVista({ id: "flujos", grupo: "red", titulo: { es: "Flujos", en: "Flows" }, montar: montar,
    activar: function () { S.activa = true; if (S.sucio) pintar(); else dibujar(); },
    desactivar: function () { S.activa = false; resaltar(null); ocultarTT(); } });
  var tRes = 0;
  NOC.on("resultado", function () { S.sucio = true; if (!S.activa) return; clearTimeout(tRes); tRes = setTimeout(pintar, 60); });
  NOC.on("lang", function () { S.sucio = true; if (S.activa) pintar(); });
  if (NOC.alNivel) { try { NOC.alNivel(function () { if (S.activa) dibujar(); }); } catch (e) { /* nada */ } }
  if (window.ResizeObserver) {
    var tRz = 0;
    new ResizeObserver(function () { clearTimeout(tRz); tRz = setTimeout(function () { if (S.activa && !S.sucio) dibujar(); }, 80); }).observe(document.getElementById("vistas") || document.body);
  }
  NOC.flujos = { modelo: function () { return NOC.resultado ? modelo(NOC.resultado) : null; }, squarify: squarify };
})();
