// vista_demanda_mapa.js — PLANO DEMANDA (CONTRATO_UI Revisión 5, dueño PLANOS; PLAN_v3 §2.1).
// Emplazamientos por tecnología sobre el mismo mapa base que MAPA (Leaflet + Esri Dark Gray), con una burbuja por sitio
// que cambia con el reloj (NOC.mostrarResultado → evento "resultado"). Chips de tecnología combinables, color por
// tecnología o por utilización, filtro por zona, leyenda plegable, tooltip con Mbit/s · usuarios · util % · procedencia.
//
// Fuentes de datos (por orden):
//  1. window.EMPL (emplazamientos_datos.js, agente ACCESO) + NOC.resultado.acceso.sitios  → un punto por sitio/hexágono.
//  2. Adaptador provisional si EMPL no existe: un punto por zona (centro de zona de RED.zonas, o coordenada del nodo
//     de origen para servicios sin zona) y tecnología = clase de servicio, con la demanda de NOC.resultado.demandas.
//     No inventa posiciones: se marca "aproximado · centro de zona".
// Repintado: solo atributos (radio, color) de los marcadores existentes; el DOM/canvas no se regenera en cada paso.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista) return;
  var RED = NOC.RED, t = NOC.t, fmt = NOC.fmt, esc = NOC.esc;
  var ID = "demanda_mapa";
  var TITULO = { es: "Plano demanda", en: "Demand plan" };

  if (typeof window.L === "undefined") {
    NOC.registrarVista({ id: ID, grupo: ["red", "simulacion"], titulo: TITULO, montar: function (el) {
      el.innerHTML = '<div class="vacio">' + esc(t({ es: "Leaflet no se pudo cargar (requiere Internet).", en: "Leaflet could not be loaded (requires Internet)." })) + '</div>';
    } });
    return;
  }
  var L = window.L;

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function css(n, def) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || def || "#888"; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hhmm(m) { m = Math.round(m || 0); return pad(Math.floor(m / 60) % 24) + ":" + pad(m % 60); }

  // ---------- catálogo de tecnologías ----------
  // Tokens por defecto (Revisión 2): bandas de radio → --band-*, servicios → --sv-*, infraestructura → gris (no es dato).
  var TOKEN_DEF = { ftth: "--sv-ftth", n28: "--band-n28", n78: "--band-n78", n258: "--band-n258", voz: "--sv-voz", v2x: "--sv-urllc",
    iot: "--sv-iot", l2vpn: "--sv-empresa", ntn: "--sv-ntn", evento: "--sv-evento", radio5g: "--sv-movil", edge: "--tx2", dc: "--tx2", ix: "--tx2" };
  var NOM_DEF = {
    ftth: { es: "FTTH (OLT)", en: "FTTH (OLT)" }, n28: { es: "5G n28", en: "5G n28" }, n78: { es: "5G n78", en: "5G n78" }, n258: { es: "5G n258", en: "5G n258" },
    voz: { es: "Voz IMS/VoNR", en: "IMS/VoNR voice" }, v2x: { es: "V2X / URLLC", en: "V2X / URLLC" }, iot: { es: "IoT / sensores", en: "IoT / sensors" },
    l2vpn: { es: "Empresa L2VPN", en: "Enterprise L2VPN" }, ntn: { es: "Satélite NTN", en: "NTN satellite" }, evento: { es: "Evento (MEC)", en: "Event (MEC)" },
    radio5g: { es: "5G (bandas juntas)", en: "5G (all bands)" }, edge: { es: "Edge", en: "Edge" }, dc: { es: "DC", en: "DC" }, ix: { es: "IX", en: "IX" }
  };
  var INFRA = { edge: 1, dc: 1, ix: 1 };
  // Adaptador: clase de servicio del motor → tecnología del plano
  var CLASE_TEC = { ftth: "ftth", movil: "radio5g", voz: "voz", urllc: "v2x", iot: "iot", empresa: "l2vpn", evento: "evento", ntn: "ntn" };
  var ORDEN_ADAPT = ["ftth", "radio5g", "voz", "v2x", "iot", "l2vpn", "evento", "ntn"];

  function hayEMPL() { var E = window.EMPL; return !!(E && Array.isArray(E.sitios) && E.sitios.length); }
  function acceso() { return NOC.resultado && NOC.resultado.acceso && NOC.resultado.acceso.sitios ? NOC.resultado.acceso : null; }
  function tecnologias() {
    if (hayEMPL()) {
      var lista = (window.EMPL.tecnologias || []).map(function (x) {
        return { id: x.id, n: { es: x.es || (NOM_DEF[x.id] || {}).es || x.id, en: x.en || (NOM_DEF[x.id] || {}).en || x.id },
          token: x.color_token ? (x.color_token.indexOf("--") === 0 ? x.color_token : "--" + x.color_token) : (TOKEN_DEF[x.id] || "--tx2"), unidad: x.unidad || "" };
      });
      if (!lista.length) {
        var vistos = {};
        window.EMPL.sitios.forEach(function (s) { if (!vistos[s.tec]) { vistos[s.tec] = 1; lista.push({ id: s.tec, n: NOM_DEF[s.tec] || { es: s.tec, en: s.tec }, token: TOKEN_DEF[s.tec] || "--tx2" }); } });
      }
      return lista;
    }
    return ORDEN_ADAPT.map(function (id) { return { id: id, n: NOM_DEF[id], token: TOKEN_DEF[id] }; });
  }
  var TECS = [], TEC = {}, COL = {}, SEVC = {};
  function leerTecs() {
    TECS = tecnologias(); TEC = {};
    TECS.forEach(function (x) { TEC[x.id] = x; COL[x.id] = css(x.token, "#888"); });
    ["ok", "min", "maj", "crit", "unk", "tx2", "tx3", "bg0", "line3", "tx1"].forEach(function (k) { SEVC[k] = css("--" + k, "#888"); });
  }

  // ---------- estado de la vista (localStorage["noc.pdem"]) ----------
  var est = (function () {
    var g = {};
    try { g = JSON.parse(leer("noc.pdem") || "{}") || {}; } catch (e) { g = {}; }
    return { tecs: g.tecs || null, color: g.color === "util" ? "util" : "tec", zona: g.zona || "", fuente: g.fuente || "" };
  })();
  function guardarEst() { guardar("noc.pdem", JSON.stringify(est)); }
  function tecsActivas() {
    var fuente = hayEMPL() ? "empl" : "adapt";
    if (!est.tecs || est.fuente !== fuente) {   // por defecto: fijo + la capa de radio principal
      est.fuente = fuente;
      est.tecs = fuente === "empl" ? ["ftth", "n78"].filter(function (x) { return TEC[x]; }) : ["ftth", "radio5g"];
      if (!est.tecs.length && TECS.length) est.tecs = [TECS[0].id];
    }
    return est.tecs.filter(function (x) { return TEC[x]; });
  }

  // ---------- puntos ----------
  // punto = {id, tec, zona, ll:[lat,lon], n, cap_dl (Mbit/s), sup (posición supuesta), aprox (centro de zona), obj, marker}
  var PUNTOS = [], porId = {};
  function zonaDe(id) { return NOC.idx.zonas[id] || null; }
  function construirPuntos() {
    PUNTOS = []; porId = {};
    if (hayEMPL()) {
      window.EMPL.sitios.forEach(function (s) {
        if (!s || !s.coord) return;
        var p = s.proc || {}, pc = p.coord || p.posicion || null;
        var tipoPos = (pc && pc.t) || s.t || "";
        var cap = s.capacidad_mbps && esNum(s.capacidad_mbps.dl) ? s.capacidad_mbps.dl : null;
        var n = esNum(s.n) && s.n > 0 ? s.n : 1;
        PUNTOS.push({ id: s.id, tec: s.tec, zona: s.zona, municipio: s.municipio, ll: s.coord, n: n, cap_dl: cap,
          sup: tipoPos === "supuesto", supId: (pc && pc.s) || s.s || "", fuente: (pc && pc.f) || s.f || "", obj: s });
      });
    } else {
      // Adaptador: claves (zona|nodo de origen) × tecnología presentes en las demandas actuales o de referencia
      var R = NOC.referencia || NOC.resultado, vistos = {};
      ((R && R.demandas) || []).forEach(function (d) {
        var tec = CLASE_TEC[d.clase_servicio]; if (!tec) return;
        var z = d.zona ? zonaDe(d.zona) : null, n = !z && d.origen ? NOC.idx.nodos[d.origen] : null;
        var ll = z ? z.centro : n ? n.coord : null;
        if (!ll) return;
        var lugar = z ? z.id : n.id, id = lugar + "|" + tec;
        if (vistos[id]) return; vistos[id] = 1;
        PUNTOS.push({ id: id, tec: tec, zona: z ? z.id : "", lugar: lugar, nombre: z ? z.nombre : (n.nombre || n.id), ll: ll, n: 1, cap_dl: null, aprox: true, nodo: !z });
      });
    }
    PUNTOS.forEach(function (p) { porId[p.id] = p; });
  }

  // Valores del paso actual por punto: {dl (Mbit/s), ul, util (%), usuarios, servida}
  var VAL = {}, REF = {};
  function valoresAdaptador(R) {
    var out = {};
    ((R && R.demandas) || []).forEach(function (d) {
      var tec = CLASE_TEC[d.clase_servicio]; if (!tec) return;
      var lugar = d.zona || d.origen, id = lugar + "|" + tec;
      var v = out[id] || (out[id] = { dl: 0, ul: 0, servida: 0, util: null, usuarios: null });
      v.dl += (d.dl_gbps || 0) * 1000; v.ul += (d.ul_gbps || 0) * 1000; v.servida += (d.servida_gbps || 0) * 1000;
    });
    return out;
  }
  // Sin resultado.acceso del motor: reparte la demanda de cada zona entre sus sitios con las fracciones
  // EMPL.sitios[].dem (["zona|radio"|"zona|fijo", fracción]). radio = clase movil, fijo = clase ftth. Marcado "estimado".
  var REPARTO = { radio: ["movil"], fijo: ["ftth"] };
  function valoresReparto(R) {
    var tot = {}, out = {};
    ((R && R.demandas) || []).forEach(function (d) {
      if (!d.zona) return;
      Object.keys(REPARTO).forEach(function (k) {
        if (REPARTO[k].indexOf(d.clase_servicio) < 0) return;
        var c = tot[d.zona + "|" + k] || (tot[d.zona + "|" + k] = { dl: 0, ul: 0, servida: 0 });
        c.dl += (d.dl_gbps || 0) * 1000; c.ul += (d.ul_gbps || 0) * 1000; c.servida += (d.servida_gbps || 0) * 1000;
      });
    });
    PUNTOS.forEach(function (p) {
      var dem = p.obj && p.obj.dem; if (!dem || !dem.length) return;
      var v = { dl: 0, ul: 0, servida: 0, util: null, usuarios: null, estimado: true };
      dem.forEach(function (e) { var c = tot[e[0]]; if (c) { v.dl += c.dl * e[1]; v.ul += c.ul * e[1]; v.servida += c.servida * e[1]; } });
      if (esNum(p.cap_dl) && p.cap_dl > 0) v.util = 100 * v.dl / p.cap_dl;
      out[p.id] = v;
    });
    return out;
  }
  function calcularValores() {
    VAL = {};
    var A = acceso();
    if (hayEMPL()) {
      if (!A) { VAL = valoresReparto(NOC.resultado); return; }
      PUNTOS.forEach(function (p) {
        var x = A.sitios[p.id];
        if (x) VAL[p.id] = { dl: x.dl_mbps, ul: x.ul_mbps, util: x.util_pct, usuarios: x.usuarios, servida: null };
      });
    } else VAL = valoresAdaptador(NOC.resultado);
  }
  // Referencia de tamaño del adaptador: pico de cada tecnología en la hora cargada (NOC.referencia), fija entre pasos.
  function calcularRef() {
    REF = {};
    if (hayEMPL()) return;
    var v = valoresAdaptador(NOC.referencia || NOC.resultado);
    PUNTOS.forEach(function (p) { var x = v[p.id]; if (x && x.dl > (REF[p.tec] || 0)) REF[p.tec] = x.dl; });
  }

  // ---------- estilo ----------
  function sevUtil(u) { return !esNum(u) ? "unk" : u > 100.01 ? "crit" : u >= 85 ? "maj" : u >= 60 ? "min" : "ok"; }
  function radio(p) {
    if (INFRA[p.tec]) return 5;
    var v = VAL[p.id];
    if (!v || !esNum(v.dl)) return 2.5;
    var f;
    if (hayEMPL()) {
      var cap = esNum(p.cap_dl) && p.cap_dl > 0 ? p.cap_dl * p.n : null;
      f = cap ? v.dl / cap : (esNum(v.util) ? v.util / 100 : 0);
      // con ~1 000 sitios en Madrid (malla de 0,3 km²) el radio escala con el zoom para no fundirse en una mancha
      var kz = mapa ? Math.max(0.3, Math.min(1, Math.pow(2, mapa.getZoom() - 13))) : 1;
      var base = (p.n > 1 ? 4 : 2.5) * Math.max(0.6, kz), rmax = (p.n > 1 ? 16 : 9) * kz;
      return base + Math.max(0, rmax - base) * Math.sqrt(Math.max(0, Math.min(1.5, f)));
    }
    var ref = REF[p.tec] || 1;
    f = v.dl / ref;
    return 3 + 25 * Math.sqrt(Math.max(0, Math.min(1.6, f)));
  }
  function estilo(p) {
    var v = VAL[p.id], sel = NOC.seleccion && NOC.seleccion.id === p.id;
    var c = COL[p.tec] || SEVC.tx2;
    if (est.color === "util" && !INFRA[p.tec]) c = v && esNum(v.util) ? SEVC[sevUtil(v.util)] : SEVC.tx3;
    var vacio = !v || !(v.dl > 0);
    return { color: sel ? SEVC.tx1 : c, weight: sel ? 2 : 1, opacity: vacio ? 0.5 : 0.95,
      fillColor: c, fillOpacity: INFRA[p.tec] ? 0.15 : vacio ? 0.08 : (hayEMPL() ? 0.55 : 0.4),
      dashArray: p.sup || p.aprox ? "3 2" : null };
  }

  // ---------- textos ----------
  function mb(x) {
    if (!esNum(x)) return "—";
    if (x >= 1000) return fmt(x / 1000, x >= 1e5 ? 0 : x >= 1e4 ? 1 : 2) + " Gbit/s";
    return fmt(x, x >= 100 ? 0 : 1) + " Mbit/s";
  }
  function procTxt(p) {
    if (p.aprox) return t({ es: "posición aproximada: centro de zona (sin EMPL)", en: "approximate position: zone centre (no EMPL)" });
    if (p.sup) return t({ es: "posición supuesta", en: "assumed position" }) + (p.supId ? " · " + p.supId : "") + (p.fuente ? " · " + p.fuente : "");
    return (p.fuente || "v7");
  }
  function tip(p) {
    var v = VAL[p.id] || {}, tn = TEC[p.tec] ? t(TEC[p.tec].n) : p.tec;
    var nombre = p.aprox ? p.nombre : p.id;
    var h = '<b>' + esc(nombre) + '</b> · <span class="tx2">' + esc(tn) + (p.n > 1 ? " ×" + p.n : "") + '</span>';
    if (p.zona && !p.aprox) h += '<br><span class="tx3">' + esc((zonaDe(p.zona) || {}).nombre || p.zona) + (p.municipio && p.municipio !== (zonaDe(p.zona) || {}).nombre ? " · " + esc(p.municipio) : "") + '</span>';
    if (!INFRA[p.tec]) {
      h += '<br>DL ' + mb(v.dl) + ' · UL ' + mb(v.ul);
      h += '<br>' + esc(t({ es: "usuarios", en: "users" })) + ' ' + (esNum(v.usuarios) ? fmt(v.usuarios, 0) : "—") +
        ' · util ' + (esNum(v.util) ? '<span class="sev-' + sevUtil(v.util) + '">' + fmt(v.util, 1) + ' %</span>' : "—");
      if (v.estimado) h += '<br><span class="pd-sup">' + esc(t({ es: "estimado: demanda de zona del motor × fracción EMPL (sin resultado.acceso)", en: "estimated: motor zone demand × EMPL share (no resultado.acceso)" })) + '</span>';
      if (p.aprox && esNum(v.servida) && v.dl > 0) h += '<br>' + esc(t({ es: "servido", en: "served" })) + ' ' + fmt(100 * v.servida / v.dl, 1) + ' %';
    }
    h += '<br><span class="' + (p.sup || p.aprox ? "pd-sup" : "tx3") + '">' + esc(procTxt(p)) + '</span>';
    return h;
  }
  function ficha(p) {
    var v = VAL[p.id] || {}, tn = TEC[p.tec] ? t(TEC[p.tec].n) : p.tec;
    var kv = function (k, x) { return '<dt>' + esc(k) + '</dt><dd class="mono">' + x + '</dd>'; };
    var h = '<div class="ficha-sec dato-calc"><h3>' + esc(t({ es: "Paso actual", en: "Current step" })) + ' · ' + esc(etiquetaHora()) + '</h3><dl class="kv">' +
      kv("DL", mb(v.dl)) + kv("UL", mb(v.ul)) + kv(t({ es: "Usuarios", en: "Users" }), esNum(v.usuarios) ? fmt(v.usuarios, 0) : "—") +
      kv("Util", esNum(v.util) ? NOC.insignia(sevUtil(v.util)) + " " + fmt(v.util, 1) + " %" : "—") + '</dl></div>';
    h += '<div class="ficha-sec ' + (p.sup || p.aprox ? "dato-sup" : "dato-doc") + '"><h3>' + esc(t({ es: "Emplazamiento", en: "Site" })) + '</h3><dl class="kv">' +
      kv(t({ es: "Tecnología", en: "Technology" }), esc(tn)) + kv(t({ es: "Zona", en: "Zone" }), esc(p.zona || "—")) +
      (p.n > 1 ? kv(t({ es: "Sitios agrupados", en: "Grouped sites" }), fmt(p.n, 0)) : "") +
      (esNum(p.cap_dl) ? kv(t({ es: "Capacidad DL", en: "DL capacity" }), mb(p.cap_dl * p.n)) : "") +
      (p.obj && esNum(p.obj.sectores) ? kv(t({ es: "Sectores", en: "Sectors" }), fmt(p.obj.sectores, 0)) : "") +
      (p.obj && p.obj.agg ? kv(t({ es: "Agregación", en: "Aggregation" }), esc(p.obj.agg)) : "") +
      kv("lat, lon", fmt(p.ll[0], 4) + ", " + fmt(p.ll[1], 4)) + '</dl><div class="tx3" style="margin-top:4px">' + esc(procTxt(p)) + '</div></div>';
    return { titulo: p.aprox ? p.nombre + " · " + tn : p.id, subtitulo: tn + " · " + t({ es: "plano de demanda", en: "demand plan" }), html: h };
  }

  // ---------- mapa ----------
  var el = null, mapa = null, rend = null, capa = null, montado = false, sucio = true, activa = false;
  function construirMarcadores() {
    if (capa) capa.clearLayers(); else capa = L.layerGroup().addTo(mapa);
    // grandes debajo: el adaptador apila tecnologías en el mismo centro → orden fijo por tecnología (FTTH primero)
    var orden = {}; TECS.forEach(function (x, i) { orden[x.id] = i; });
    PUNTOS.sort(function (a, b) { return (orden[a.tec] || 0) - (orden[b.tec] || 0) || (a.id < b.id ? -1 : 1); });
    PUNTOS.forEach(function (p) {
      var m = INFRA[p.tec] ? L.circleMarker(p.ll, { renderer: rend, radius: 5 }) : L.circleMarker(p.ll, { renderer: rend, radius: 3 });
      m.bindTooltip(function () { return tip(p); }, { direction: "top", offset: [0, -4], className: "noc-tip", opacity: 1, sticky: false });
      m.on("click", function (ev) {
        L.DomEvent.stopPropagation(ev);
        if (p.aprox && p.zona) { NOC.seleccionar("zona", p.zona); return; }
        NOC.seleccion = { tipo: "sitio", id: p.id };
        NOC.abrirFicha(ficha(p));
        pintar();
      });
      p.marker = m;
    });
    aplicarFiltro();
  }
  function visible(p, act) {
    if (act.indexOf(p.tec) < 0) return false;
    if (est.zona && p.zona !== est.zona && !(p.aprox && p.lugar === est.zona)) return false;
    return true;
  }
  function aplicarFiltro() {
    var act = tecsActivas();
    PUNTOS.forEach(function (p) {
      var v = visible(p, act), en = capa.hasLayer(p.marker);
      if (v && !en) capa.addLayer(p.marker);
      if (!v && en) capa.removeLayer(p.marker);
    });
    // en el adaptador, los puntos co-ubicados: las burbujas grandes primero (debajo)
    if (!hayEMPL()) PUNTOS.filter(function (p) { return capa.hasLayer(p.marker); })
      .sort(function (a, b) { return radio(b) - radio(a); }).forEach(function (p) { p.marker.bringToFront(); });
    else {   // con EMPL: la tecnología con menos sitios encima (62 OLT no quedan bajo 1 113 sitios n78)
      var cuenta = {}; PUNTOS.forEach(function (p) { cuenta[p.tec] = (cuenta[p.tec] || 0) + 1; });
      PUNTOS.filter(function (p) { return capa.hasLayer(p.marker); })
        .sort(function (a, b) { return cuenta[b.tec] - cuenta[a.tec]; }).forEach(function (p) { p.marker.bringToFront(); });
    }
    pintar();
  }
  function pintar() {
    if (!montado) return;
    if (!activa) { sucio = true; return; }
    sucio = false;
    calcularValores();
    var act = tecsActivas();
    if (!hayEMPL()) abanico(act);
    PUNTOS.forEach(function (p) {
      if (!visible(p, act)) return;
      var r = radio(p);
      if (Math.abs((p._r || 0) - r) > 0.05) { p.marker.setRadius(r); p._r = r; }
      var s = estilo(p), k = s.color + s.fillColor + s.weight + s.opacity + s.fillOpacity;
      if (k !== p._k) { p.marker.setStyle(s); p._k = k; }
    });
    pintarHora(); pintarResumen();
  }
  // Adaptador: las tecnologías de un mismo lugar se abren en abanico alrededor del centro (en píxeles, por zoom),
  // para que ninguna burbuja tape a otra; distancia ∝ la burbuja mayor del lugar.
  function abanico(act) {
    var z = mapa.getZoom(), lugares = {}, orden = act.filter(function (x) { return !INFRA[x]; });
    PUNTOS.forEach(function (p) { if (visible(p, act)) (lugares[p.lugar] = lugares[p.lugar] || []).push(p); });
    Object.keys(lugares).forEach(function (k) {
      var ps = lugares[k], rmax = 0;
      ps.forEach(function (p) { rmax = Math.max(rmax, radio(p)); });
      var c = mapa.project(L.latLng(ps[0].ll[0], ps[0].ll[1]), z), n = orden.length;
      ps.forEach(function (p) {
        var i = orden.indexOf(p.tec), ll;
        if (n < 2 || i < 0) ll = L.latLng(p.ll[0], p.ll[1]);
        else {
          var an = -Math.PI / 2 + 2 * Math.PI * i / n, d = Math.max(7, rmax * (n === 2 ? 0.75 : 0.85));
          ll = mapa.unproject(L.point(c.x + d * Math.cos(an), c.y + d * Math.sin(an)), z);
        }
        var cl = p.marker.getLatLng();
        if (Math.abs(cl.lat - ll.lat) > 1e-7 || Math.abs(cl.lng - ll.lng) > 1e-7) p.marker.setLatLng(ll);
      });
    });
  }
  function enfocarZona() {
    if (!mapa) return;
    var z = est.zona && zonaDe(est.zona);
    if (z && z.centro) {
      var pts = PUNTOS.filter(function (p) { return p.zona === z.id; }).map(function (p) { return p.ll; });
      if (pts.length > 1) mapa.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 13, paddingTopLeft: [0, 70] });
      else mapa.setView(z.centro, 12);
    } else encuadreGeneral();
  }
  function encuadreGeneral() {
    var pts = (RED.zonas || []).filter(function (z) { return z.centro; }).map(function (z) { return z.centro; });
    if (pts.length) mapa.fitBounds(L.latLngBounds(pts).pad(0.08), { paddingTopLeft: [0, 70] }); else mapa.setView([40.42, -3.68], 10);
  }

  // ---------- barra, hora, resumen, leyenda ----------
  function etiquetaHora() {
    var r = NOC.resultado, m = metaUltima;
    if (m && esNum(m.t_min)) return hhmm(m.t_min);
    if (r && r.paso_reloj && esNum(r.paso_reloj.t_min)) return hhmm(r.paso_reloj.t_min);
    if (m && m.hc) return t({ es: "hora cargada", en: "busy hour" });
    return NOC.caso && esNum(NOC.caso.hora) ? pad(NOC.caso.hora) + ":00" : t({ es: "hora cargada", en: "busy hour" });
  }
  function pintarHora() { var h = el && el.querySelector(".pd-hora"); if (h) h.textContent = etiquetaHora(); }
  function pintarResumen() {
    var b = el && el.querySelector(".pd-resumen");
    if (!b) return;
    var act = tecsActivas(), A = acceso();
    var filas = act.filter(function (x) { return !INFRA[x]; }).map(function (tec) {
      var dl = 0, n = 0, umax = null, sat = 0;
      if (A && A.por_tec && A.por_tec[tec]) {
        var q = A.por_tec[tec]; dl = (q.dl_gbps || 0) * 1000; umax = q.util_max_pct; sat = q.sitios_sat || 0;
      } else {
        PUNTOS.forEach(function (p) { if (p.tec === tec && visible(p, act)) { var v = VAL[p.id]; if (v && esNum(v.dl)) dl += v.dl; if (v && esNum(v.util) && (umax == null || v.util > umax)) umax = v.util; } });
      }
      PUNTOS.forEach(function (p) { if (p.tec === tec && visible(p, act)) n += p.n; });
      return '<tr><td><i class="pd-sw" style="background:' + COL[tec] + '"></i>' + esc(t(TEC[tec].n)) + '</td><td class="num">' + fmt(n, 0) + '</td><td class="num">' + mb(dl) +
        '</td><td class="num">' + (esNum(umax) ? '<span class="sev-' + sevUtil(umax) + '">' + fmt(umax, 0) + ' %</span>' : "—") + (sat ? ' <span class="sev sev-crit">' + sat + '</span>' : '') + '</td></tr>';
    });
    b.innerHTML = filas.length ? '<table class="pd-tab"><thead><tr><th scope="col">' + esc(t({ es: "Tecnología", en: "Technology" })) + '</th><th scope="col" class="num">' +
      esc(hayEMPL() ? t({ es: "sitios", en: "sites" }) : t({ es: "puntos", en: "points" })) + '</th><th scope="col" class="num">DL</th><th scope="col" class="num">' +
      esc(t({ es: "util máx", en: "max util" })) + '</th></tr></thead><tbody>' + filas.join("") + '</tbody></table>' : "";
  }
  function pintarBarra() {
    var b = el && el.querySelector(".pd-barra");
    if (!b) return;
    var act = tecsActivas(), empl = hayEMPL();
    var zonas = (RED.zonas || []).map(function (z) { return '<option value="' + esc(z.id) + '"' + (est.zona === z.id ? " selected" : "") + '>' + esc(z.nombre) + '</option>'; }).join("");
    b.innerHTML =
      '<div class="pd-chips" role="group" aria-label="' + esc(t({ es: "Tecnologías", en: "Technologies" })) + '">' + TECS.map(function (x) {
        var on = act.indexOf(x.id) >= 0;
        return '<button type="button" class="pd-chip' + (on ? " on" : "") + '" data-tec="' + esc(x.id) + '" aria-pressed="' + on + '"><i style="background:' + COL[x.id] + '"></i>' + esc(t(x.n)) + '</button>';
      }).join("") + '</div>' +
      '<div class="pd-ctl"><span class="pd-rot">' + esc(t({ es: "Color", en: "Colour" })) + '</span>' +
      '<button type="button" class="pd-seg" data-color="tec" aria-pressed="' + (est.color === "tec") + '">' + esc(t({ es: "tecnología", en: "technology" })) + '</button>' +
      '<button type="button" class="pd-seg" data-color="util" aria-pressed="' + (est.color === "util") + '"' + (empl ? "" : " disabled title=\"" + esc(t({ es: "Necesita la utilización por sitio (EMPL + resultado.acceso)", en: "Needs per-site utilisation (EMPL + resultado.acceso)" })) + "\"") + '>' + esc(t({ es: "utilización", en: "utilisation" })) + '</button>' +
      '<span class="pd-rot">' + esc(t({ es: "Zona", en: "Zone" })) + '</span><select class="pd-zona"><option value="">' + esc(t({ es: "todas", en: "all" })) + '</option>' + zonas + '</select>' +
      '<span class="pd-hora mono"></span></div>' +
      (empl ? "" : '<div class="pd-aviso">' + esc(t({ es: "Aproximado: sin emplazamientos (EMPL); un punto por zona y tecnología con la demanda del motor", en: "Approximate: no sites (EMPL); one point per zone and technology with engine demand" })) + '</div>');
    pintarHora();
  }
  function pintarLeyenda() {
    var lg = el && el.querySelector(".pd-leyenda");
    if (!lg) return;
    var pleg = NOC.plegado ? NOC.plegado("leyenda-pdem") : false, empl = hayEMPL();
    lg.classList.toggle("plegada", pleg);
    var act = tecsActivas();
    lg.innerHTML = '<button type="button" class="ley-cab" aria-expanded="' + !pleg + '">' + esc(t({ es: "Leyenda", en: "Legend" })) + ' ' + (pleg ? "▸" : "▾") + '</button>' +
      '<div class="ley-cuerpo">' +
      (est.color === "util" ?
        '<div class="rot">' + esc(t({ es: "Utilización del sitio", en: "Site utilisation" })) + '</div>' +
        [["ok", "< 60 %"], ["min", "60–85 %"], ["maj", "85–100 %"], ["crit", "> 100 %"]].map(function (x) {
          return '<div class="fila"><i class="pt" style="background:' + SEVC[x[0]] + '"></i><span class="sev sev-' + x[0] + '">' + x[0].toUpperCase() + '</span><span class="mono">' + x[1] + '</span></div>';
        }).join("") :
        '<div class="rot">' + esc(t({ es: "Tecnología", en: "Technology" })) + '</div>' +
        act.map(function (x) { return '<div class="fila"><i class="pt" style="background:' + COL[x] + '"></i><span>' + esc(t(TEC[x].n)) + '</span></div>'; }).join("")) +
      '<div class="rot solo-experto" style="margin-top:6px">' + esc(t({ es: "Tamaño", en: "Size" })) + '</div>' +
      '<div class="tx3 solo-experto">' + esc(empl ?
        t({ es: "Área ∝ DL / capacidad del sitio (v7 §6.2.1)", en: "Area ∝ DL / site capacity (v7 §6.2.1)" }) :
        t({ es: "Área ∝ DL de la zona; 100 % = pico de esa tecnología en la hora cargada de referencia", en: "Area ∝ zone DL; 100 % = that technology's peak in the reference busy hour" })) + '</div>' +
      '<div class="fila" style="margin-top:4px"><i class="pt disc"></i><span>' + esc(empl ? t({ es: "borde discontinuo = posición supuesta", en: "dashed edge = assumed position" }) :
        t({ es: "borde discontinuo = centro de zona (aprox.)", en: "dashed edge = zone centre (approx.)" })) + '</span></div>' +
      '</div>';
  }

  // ---------- registro ----------
  var metaUltima = null;
  NOC.registrarVista({
    id: ID, grupo: ["red", "simulacion"], titulo: TITULO,
    montar: function (contenedor) {
      el = contenedor;
      leerTecs();
      el.innerHTML = '<div class="pd-mapa"></div><div class="pd-barra"></div><div class="pd-resumen"></div><div class="mapa-leyenda pd-leyenda"></div>';
      mapa = L.map(el.querySelector(".pd-mapa"), { zoomControl: false, attributionControl: true, zoomSnap: 0.5, minZoom: 9, maxZoom: 16, preferCanvas: true });
      L.control.zoom({ position: "bottomright" }).addTo(mapa);
      rend = L.canvas({ padding: 0.3 });
      var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16, attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ" });
      var fallos = 0;
      esri.on("tileerror", function () {
        if (++fallos !== 6) return;
        mapa.removeLayer(esri);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(mapa);
      });
      esri.addTo(mapa);
      encuadreGeneral();
      construirPuntos(); calcularRef();
      montado = true;
      construirMarcadores();
      pintarBarra(); pintarLeyenda();
      ["pd-barra", "pd-leyenda", "pd-resumen"].forEach(function (c) { var x = el.querySelector("." + c); L.DomEvent.disableClickPropagation(x); L.DomEvent.disableScrollPropagation(x); });
      el.querySelector(".pd-barra").addEventListener("click", function (ev) {
        var c = ev.target.closest(".pd-chip");
        if (c) {
          var id = c.getAttribute("data-tec"), act = tecsActivas(), i = act.indexOf(id);
          if (i >= 0) act.splice(i, 1); else act.push(id);
          est.tecs = act; guardarEst(); pintarBarra(); pintarLeyenda(); aplicarFiltro(); return;
        }
        var s = ev.target.closest(".pd-seg");
        if (s && !s.disabled) { est.color = s.getAttribute("data-color"); guardarEst(); PUNTOS.forEach(function (p) { p._k = null; }); pintarBarra(); pintarLeyenda(); pintar(); }
      });
      el.querySelector(".pd-barra").addEventListener("change", function (ev) {
        if (!ev.target.classList.contains("pd-zona")) return;
        est.zona = ev.target.value; guardarEst(); aplicarFiltro(); enfocarZona();
      });
      el.querySelector(".pd-leyenda").addEventListener("click", function (ev) {
        if (!ev.target.closest(".ley-cab")) return;
        if (NOC.plegar) NOC.plegar("leyenda-pdem", !NOC.plegado("leyenda-pdem"));
        else el.querySelector(".pd-leyenda").classList.toggle("plegada");
        pintarLeyenda();
      });
      mapa.on("click", function () { if (NOC.seleccion) NOC.cerrarFicha(); });
      mapa.on("zoomend", function () { if (!activa) return; if (!hayEMPL()) abanico(tecsActivas()); else pintar(); });
      if (window.ResizeObserver) new ResizeObserver(function () { if (mapa && activa) mapa.invalidateSize(); }).observe(el);
      if (est.zona) enfocarZona();
    },
    activar: function () {
      activa = true;
      if (mapa) setTimeout(function () { mapa.invalidateSize(); if (sucio) pintar(); }, 0);
    },
    desactivar: function () { activa = false; }
  });

  NOC.on("resultado", function () {
    metaUltima = NOC.resultadoMeta || null;
    if (!montado) return;
    if (!hayEMPL() && !(metaUltima && metaUltima.reloj)) calcularRef();   // cambio de caso: nueva referencia de tamaño
    pintar();
  });
  NOC.on("seleccion", function () { if (montado) { PUNTOS.forEach(function (p) { p._k = null; }); pintar(); } });
  NOC.on("lang", function () { if (montado) { leerTecs(); pintarBarra(); pintarLeyenda(); pintarResumen(); } });
  NOC.on("carril", function () { if (mapa && activa) setTimeout(function () { mapa.invalidateSize(); }, 0); });
  NOC.on("plegado", function (p) { if (montado && (!p || p.id === "leyenda-pdem")) pintarLeyenda(); });
})();
