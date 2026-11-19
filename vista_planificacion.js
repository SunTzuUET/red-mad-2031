// vista_planificacion.js — CONTRATO_UI Revisión 9 (dueño ESTUDIOS).
//  · Pestaña PLANIFICACIÓN: Motor.planificacion → gráfica 2026–2035 (ocupación máx. de enlaces, sitios y núcleo; umbrales 85/100 %),
//    tabla "qué satura primero", hoja de ruta con "aplicar ampliación" (evento anadir_lambda en LAB, vía NOC.operador.anadir),
//    avisos y supuestos enlazados al linaje. Selector de año que cambia el caso (rango que admite el caso: crecimiento.anio_min…max).
//  · Pestaña SLA / DISPONIBILIDAD: semáforo por slice (resultado.sla), demandas del slice con desglose de latencia,
//    Motor.disponibilidad por zona/servicio/slice/especial, mapa de zonas coloreado por indisponibilidad (Leaflet, como el plano de demanda).
//  · Ficha de enlace: sección LATENCIA (propagación / serialización / cola) — aditivo, envolviendo NOC.abrirFicha como reloj/operador/linaje.
//  API: NOC.planificacion = {plan(), disponibilidad(), abrirDemanda(id), abrirSupuesto(sid), latenciaEnlaceHTML(id)}.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista || !window.Motor) return;
  var RED = NOC.RED, Motor = window.Motor;
  function t(o) { return NOC.t(o); }
  function fmt(x, d) { return NOC.fmt(x, d); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function f1(x) { return esNum(x) ? fmt(x, Math.abs(x) >= 100 ? 0 : 1) : "—"; }
  function ms(x) { return esNum(x) ? fmt(x, x >= 10 ? 1 : x >= 1 ? 2 : 3) + " ms" : "—"; }
  var IDX = NOC.idx || { nodos: {}, enlaces: {}, zonas: {} };
  var CR = (RED.modelos_trafico || {}).crecimiento || {};
  var ANIO_MIN = CR.anio_min || 2025, ANIO_MAX = CR.anio_max || 2031;
  var DESDE = 2026, HASTA = 2035;

  var TX = {
    plan: { es: "Planificación", en: "Planning" },
    slaTit: { es: "SLA / Disponibilidad", en: "SLA / Availability" },
    ocup: { es: "Ocupación máxima por año", en: "Maximum occupancy per year" },
    enlaces: { es: "Enlaces", en: "Links" }, sitios: { es: "Sitios", en: "Sites" }, nucleo: { es: "Núcleo", en: "Core" }, nodos: { es: "Nodos", en: "Nodes" },
    satura: { es: "Qué satura primero", en: "What saturates first" },
    hoja: { es: "Hoja de ruta", en: "Roadmap" },
    avisos: { es: "Avisos y supuestos", en: "Warnings and assumptions" },
    anioCaso: { es: "Año del caso", en: "Case year" },
    anioVer: { es: "Año marcado", en: "Marked year" },
    aplicarAnio: { es: "Aplicar al caso", en: "Apply to case" },
    fueraRango: { es: "fuera del rango del caso", en: "outside the case range" },
    aplicar: { es: "Aplicar ampliación", en: "Apply upgrade" },
    aplicada: { es: "aplicada", en: "applied" },
    calculando: { es: "Calculando…", en: "Computing…" },
    sinMotor: { es: "El motor no tiene Motor.planificacion.", en: "The engine has no Motor.planificacion." },
    desdeInicio: { es: "nace ≥ 85 %", en: "born ≥ 85 %" },
    tabla: { es: "Tabla por año", en: "Table by year" },
    primero: { es: "Primero por crecimiento", en: "First by growth" },
    global: { es: "Primero (global)", en: "First (overall)" },
    nunca: { es: "no llega", en: "never" },
    sla: { es: "SLA por slice", en: "SLA per slice" },
    disp: { es: "Disponibilidad", en: "Availability" },
    peores: { es: "Peores sucesos (red)", en: "Worst events (network)" },
    latencia: { es: "Latencia", en: "Latency" },
    prop: { es: "propagación", en: "propagation" }, ser: { es: "serialización", en: "serialisation" }, cola: { es: "cola", en: "queue" },
    sinCola: { es: "sin cola (prop.+ser.+nodos)", en: "no queue (prop.+ser.+nodes)" }
  };

  // ======================================================================== cálculos (con caché por caso)
  function opcCaso() { try { return NOC.opcionesCaso ? NOC.opcionesCaso() : (NOC.opciones || {}); } catch (e) { return {}; } }
  function claveCaso() { return JSON.stringify([NOC.modo, opcCaso(), NOC.paramsEditados || 0]); }
  var PL = { k: null, p: null, err: "" }, DI = { k: null, d: null, err: "" };
  function plan() {
    if (typeof Motor.planificacion !== "function") return null;
    var k = claveCaso();
    if (PL.k !== k) {
      PL.k = k; PL.err = "";
      try { PL.p = Motor.planificacion(RED, opcCaso(), { desde: DESDE, hasta: HASTA }); } catch (e) { PL.p = null; PL.err = String(e && e.message || e); console.error("Motor.planificacion", e); }
    }
    return PL.p;
  }
  function disponibilidad() {
    if (typeof Motor.disponibilidad !== "function") return null;
    var k = claveCaso();
    if (DI.k !== k) {
      DI.k = k; DI.err = "";
      try { DI.d = Motor.disponibilidad(RED, opcCaso(), {}); } catch (e) { DI.d = null; DI.err = String(e && e.message || e); console.error("Motor.disponibilidad", e); }
    }
    return DI.d;
  }

  // ======================================================================== supuestos → linaje
  var SUPS = {};
  (RED.supuestos || []).forEach(function (s) { SUPS[s.id] = s; });
  function abrirSupuesto(sid) {
    var L = window.LINAJE;
    if (L && Array.isArray(L.valores) && NOC.linaje && NOC.linaje.abrirValor) {
      var v = L.valores.filter(function (x) { return x.supuesto === sid; })[0];
      if (v && NOC.linaje.abrirValor(v.id)) return;
    }
    var s = SUPS[sid];
    if (!s) return;
    NOC.seleccion = { tipo: "supuesto", id: sid };
    NOC.abrirFicha({ titulo: sid, subtitulo: (s.clave || "") + " · " + (s.ambito || ""), html:
      '<div class="ficha-sec dato-sup"><h3>' + esc(t({ es: "Supuesto", en: "Assumption" })) + '</h3><dl class="kv">' +
      [[t({ es: "Campo", en: "Field" }), s.campo], [t({ es: "Valor", en: "Value" }), typeof s.valor === "object" ? JSON.stringify(s.valor) : s.valor],
        [t({ es: "Motivo", en: "Reason" }), s.motivo], [t({ es: "Fuente parcial", en: "Partial source" }), s.fuente_parcial],
        [t({ es: "Alternativa", en: "Alternative" }), s.alternativa], [t({ es: "Estado", en: "Status" }), s.estado]].filter(function (x) { return x[1] != null && x[1] !== ""; })
        .map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd class="txt">' + esc(x[1]) + '</dd>'; }).join("") + '</dl></div>' });
  }
  function chipsSup(ids) {
    return (ids || []).map(function (s) {
      var x = SUPS[s];
      return '<button type="button" class="chip pl-sup" data-pl-sup="' + esc(s) + '" title="' + esc(x ? (x.clave || "") + " · " + (x.motivo || x.campo || "") : s) + '">' + esc(s) + (x && x.clave ? ' <span class="tx3">' + esc(x.clave) + '</span>' : '') + '</button>';
    }).join(" ");
  }

  // ======================================================================== gráfica (SVG, sin dependencias)
  // Tres series categóricas: slots 1–3 de la paleta dataviz (modo oscuro), validados todos-los-pares; forma de marcador distinta como 2.ª codificación.
  var SERIES = [
    { k: "enlace", campo: "ocup_max_pct", idc: "ocup_max_id", n: TX.enlaces, color: "var(--pl-s1)", forma: "c" },
    { k: "sitio", campo: "sitio_max_pct", idc: "sitio_max_id", n: TX.sitios, color: "var(--pl-s2)", forma: "s" },
    { k: "nucleo", campo: "nucleo_max_pct", idc: "nucleo_max_id", n: TX.nucleo, color: "var(--pl-s3)", forma: "d" }
  ];
  function marcador(forma, x, y, color) {
    var st = 'style="fill:' + color + ';stroke:var(--bg0);stroke-width:2"';
    if (forma === "s") return '<rect x="' + (x - 4).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" width="8" height="8" ' + st + '/>';
    if (forma === "d") return '<path d="M' + x.toFixed(1) + ' ' + (y - 5.5).toFixed(1) + 'l5.5 5.5-5.5 5.5-5.5-5.5z" ' + st + '/>';
    return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5" ' + st + '/>';
  }
  function grafica(p, sel, w) {
    var h = 230, ml = 40, mr = 150, mt = 12, mb = 24, A = p.anios, n = A.length;
    var mx = 0;
    A.forEach(function (a) { SERIES.forEach(function (s) { if (esNum(a[s.campo])) mx = Math.max(mx, a[s.campo]); }); });
    var ymax = Math.max(110, Math.ceil(mx / 10) * 10 + 5);
    var iw = Math.max(120, w - ml - mr), ih = h - mt - mb;
    function X(i) { return ml + (n <= 1 ? iw / 2 : i * iw / (n - 1)); }
    function Y(v) { return mt + ih - Math.max(0, Math.min(ymax, v)) / ymax * ih; }
    var o = '<svg class="pl-svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(t(TX.ocup)) + '">';
    for (var v = 0; v <= ymax; v += 25) {
      o += '<line x1="' + ml + '" x2="' + (ml + iw) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" class="pl-grid"/>' +
        '<text x="' + (ml - 6) + '" y="' + (Y(v) + 3).toFixed(1) + '" class="pl-eje" text-anchor="end">' + v + '</text>';
    }
    [[85, "maj", "85 %"], [100, "crit", "100 %"]].forEach(function (u) {
      o += '<line x1="' + ml + '" x2="' + (ml + iw) + '" y1="' + Y(u[0]).toFixed(1) + '" y2="' + Y(u[0]).toFixed(1) + '" style="stroke:var(--' + u[1] + ')" class="pl-umbral"/>' +
        '<text x="' + (ml + (n > 1 ? iw / (n - 1) / 2 : 4)).toFixed(1) + '" y="' + (Y(u[0]) - 3).toFixed(1) + '" class="pl-eje-u" text-anchor="middle">' + u[2] + '</text>';
    });
    A.forEach(function (a, i) {
      var es = a.anio === sel;
      if (es) o += '<line x1="' + X(i).toFixed(1) + '" x2="' + X(i).toFixed(1) + '" y1="' + mt + '" y2="' + (mt + ih) + '" class="pl-sel"/>';
      o += '<text x="' + X(i).toFixed(1) + '" y="' + (h - 7) + '" class="pl-eje' + (es ? " fuerte" : "") + '" text-anchor="middle">' + a.anio + (a.anio > ANIO_MAX ? "*" : "") + '</text>';
    });
    // líneas
    SERIES.slice().reverse().forEach(function (s) {
      var d = "";
      A.forEach(function (a, i) { if (esNum(a[s.campo])) d += (d ? "L" : "M") + X(i).toFixed(1) + " " + Y(a[s.campo]).toFixed(1); });
      if (d) o += '<path d="' + d + '" class="pl-linea" style="stroke:' + s.color + '"/>';
    });
    SERIES.slice().reverse().forEach(function (s) { A.forEach(function (a, i) { if (esNum(a[s.campo])) o += marcador(s.forma, X(i), Y(a[s.campo]), s.color); }); });
    // etiquetas directas al final, separadas ≥ 13 px
    var fin = SERIES.map(function (s) { var a = A[n - 1]; return { s: s, v: a[s.campo], y: Y(a[s.campo] || 0) }; }).filter(function (e) { return esNum(e.v); });
    fin.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < fin.length; i++) if (fin[i].y - fin[i - 1].y < 13) fin[i].y = fin[i - 1].y + 13;
    fin.forEach(function (e) {
      o += '<line x1="' + (ml + iw + 8) + '" x2="' + (ml + iw + 18) + '" y1="' + e.y.toFixed(1) + '" y2="' + e.y.toFixed(1) + '" style="stroke:' + e.s.color + ';stroke-width:2"/>' +
        '<text x="' + (ml + iw + 22) + '" y="' + (e.y + 3.5).toFixed(1) + '" class="pl-etq">' + esc(t(e.s.n)) + ' ' + fmt(e.v, 1) + ' %</text>';
    });
    // zonas de golpe por año (tooltip + clic = marcar año)
    A.forEach(function (a, i) {
      var x0 = i === 0 ? ml - 10 : (X(i - 1) + X(i)) / 2, x1 = i === n - 1 ? ml + iw + 6 : (X(i) + X(i + 1)) / 2;
      o += '<rect class="pl-golpe" data-pl-anio="' + a.anio + '" data-i="' + i + '" x="' + x0.toFixed(1) + '" y="' + mt + '" width="' + (x1 - x0).toFixed(1) + '" height="' + ih + '"/>';
    });
    o += '<line class="pl-cruz" x1="0" x2="0" y1="' + mt + '" y2="' + (mt + ih) + '" style="display:none"/>';
    return o + '</svg>';
  }
  function tooltipAnio(p, i) {
    var a = p.anios[i];
    return '<div class="pl-tt-cab">' + a.anio + (a.anio > ANIO_MAX ? ' <span class="tx3">' + esc(t({ es: "extrapolado", en: "extrapolated" })) + '</span>' : '') + '</div>' +
      SERIES.map(function (s) {
        return '<div class="pl-tt-f"><i style="background:' + s.color + '"></i><span>' + esc(t(s.n)) + '</span><b>' + f1(a[s.campo]) + ' %</b><span class="tx3 mono">' + esc(a[s.idc] || "") + '</span></div>';
      }).join("") +
      '<div class="pl-tt-f"><i></i><span>DL</span><b>' + f1(a.dl_total_gbps) + ' Gbit/s</b><span class="tx3">≥85 %: ' + a.n_85 + ' · ≥100 %: ' + a.n_100 + '</span></div>';
  }

  // ======================================================================== PLANIFICACIÓN
  var V = { el: null, activa: false, sucio: true, anio: null };
  function anioCaso() { return NOC.modo === "ref" ? 2031 : Number((NOC.caso || {}).anio) || 2031; }
  function eventoAplicado(ev) {
    var l = (NOC.caso && NOC.caso.eventos) || [];
    return NOC.modo === "lab" && l.some(function (e) { return e.tipo === ev.tipo && e.id === ev.id; });
  }
  function nomFam(f) { return t({ enlace: TX.enlaces, nodo: TX.nodos, sitio: TX.sitios, nucleo: TX.nucleo }[f] || { es: f, en: f }); }
  function selAttr(id, fam) {
    if (fam === "enlace" && IDX.enlaces[id]) return ' data-sel="enlace" data-id="' + esc(id) + '"';
    if (fam === "nodo" && IDX.nodos[id]) return ' data-sel="nodo" data-id="' + esc(id) + '"';
    return "";
  }
  function pintarPlan() {
    var el = V.el;
    if (!el) return;
    V.sucio = false;
    if (typeof Motor.planificacion !== "function") { el.innerHTML = '<div class="vacio">' + esc(t(TX.sinMotor)) + '</div>'; return; }
    var p = plan();
    if (!p) { el.innerHTML = '<div class="vacio">' + esc(PL.err || t(TX.sinMotor)) + '</div>'; return; }
    if (V.anio == null || V.anio < p.desde || V.anio > p.hasta) V.anio = Math.max(p.desde, Math.min(p.hasta, anioCaso()));
    var ac = anioCaso(), ref = NOC.modo === "ref";
    var opts = "";
    for (var y = p.desde; y <= p.hasta; y++) opts += '<option value="' + y + '"' + (y === V.anio ? " selected" : "") + '>' + y + (y > ANIO_MAX ? " *" : "") + '</option>';
    var enRango = V.anio >= ANIO_MIN && V.anio <= ANIO_MAX;
    var h = '<div class="pl-barra"><span class="lbl">' + esc(t(TX.plan)) + '</span>' +
      '<span class="pl-modo">' + (ref ? "REF" : "LAB") + ' · ' + esc(t(TX.anioCaso)) + ' <b class="mono">' + ac + '</b></span>' +
      '<label class="pl-ctl">' + esc(t(TX.anioVer)) + ' <select class="sel" data-pl="anio">' + opts + '</select></label>' +
      '<button type="button" class="btn" data-pl="aplicar-anio"' + (enRango && V.anio !== ac ? "" : " disabled") + ' title="' +
        esc(enRango ? t({ es: "Pone este año en el caso LAB y recalcula", en: "Sets this year in the LAB case and recomputes" }) : t(TX.fueraRango) + " (" + ANIO_MIN + "–" + ANIO_MAX + ")") + '">' + esc(t(TX.aplicarAnio)) + '</button>' +
      (enRango ? "" : '<span class="tx3">' + esc(t(TX.fueraRango)) + ' (' + ANIO_MIN + '–' + ANIO_MAX + ')</span>') +
      '<span class="pl-esp"></span><span class="tx3 mono">' + fmt(p.ms || 0, 0) + ' ms</span></div>';
    // avisos arriba (son parte de leer la gráfica)
    var avisos = [];
    if (p.aviso) avisos.push(p.aviso);
    h += '<div class="pl-cuerpo"><section class="pl-sec pl-graf"><div class="pl-cab"><h3 class="lbl">' + esc(t(TX.ocup)) + '</h3><div class="pl-ley">' +
      SERIES.map(function (s) { return '<span class="pl-ley-i"><svg width="22" height="10"><line x1="0" x2="22" y1="5" y2="5" style="stroke:' + s.color + ';stroke-width:2"/>' + marcador(s.forma, 11, 5, s.color) + '</svg>' + esc(t(s.n)) + '</span>'; }).join("") +
      '<span class="pl-ley-i"><i class="pl-u maj"></i>85 % MAJ</span><span class="pl-ley-i"><i class="pl-u crit"></i>100 % CRIT</span></div></div>' +
      '<div class="pl-lienzo"></div><div class="pl-tt" hidden></div>' +
      '<p class="pl-pie tx3">* ' + esc(t({ es: "años > " + ANIO_MAX + " extrapolados (la v7 llega a 2031). Máximo por familia: enlaces de transporte, sitios de acceso y núcleo (BNG/UPF/IMS).", en: "years > " + ANIO_MAX + " extrapolated (v7 goes up to 2031). Maximum per family: transport links, access sites and core (BNG/UPF/IMS)." })) + '</p>' +
      '<details class="pl-det"><summary>' + esc(t(TX.tabla)) + '</summary>' + tablaAnios(p) + '</details></section>';
    h += '<section class="pl-sec"><h3 class="lbl">' + esc(t(TX.satura)) + '</h3>' + resumenSat(p) + tablaSatura(p) + '</section>';
    h += '<section class="pl-sec"><h3 class="lbl">' + esc(t(TX.avisos)) + '</h3>' +
      avisos.map(function (a) { return '<p class="pl-aviso dato-sup">' + esc(a) + '</p>'; }).join("") +
      '<div class="pl-sups">' + chipsSup(p.supuestos) + '</div>' +
      '<p class="nota tx3">' + esc(t({ es: "Clic en un supuesto: su linaje (¿De dónde sale?) o su registro.", en: "Click an assumption: its lineage (Where does it come from?) or its record." })) + '</p></section>' +
      '<section class="pl-sec pl-ancha"><h3 class="lbl">' + esc(t(TX.hoja)) + '</h3>' + tablaHoja(p) + '</section></div>';
    el.innerHTML = h;
    dibujarGrafica();
  }
  function dibujarGrafica() {
    var p = PL.p, c = V.el && V.el.querySelector(".pl-lienzo");
    if (!p || !c) return;
    var w = Math.max(360, Math.min(1100, c.clientWidth || 700));
    c.innerHTML = grafica(p, V.anio, w);
  }
  function tablaAnios(p) {
    return '<table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Año", en: "Year" })) + '</th><th class="n">DL Gbit/s</th>' +
      SERIES.map(function (s) { return '<th class="n">' + esc(t(s.n)) + ' %</th><th>id</th>'; }).join("") + '<th class="n">≥85</th><th class="n">≥100</th></tr></thead><tbody>' +
      p.anios.map(function (a) {
        return '<tr' + (a.anio === V.anio ? ' class="sel"' : '') + '><td class="mono">' + a.anio + '</td><td class="n">' + f1(a.dl_total_gbps) + '</td>' +
          SERIES.map(function (s) { return '<td class="n">' + f1(a[s.campo]) + '</td><td class="id tx3">' + esc(a[s.idc] || "") + '</td>'; }).join("") +
          '<td class="n">' + a.n_85 + '</td><td class="n">' + a.n_100 + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  function resumenSat(p) {
    var s = p.saturacion || {};
    function uno(u, k, tit) {
      var x = s[u] && s[u][k];
      return '<span class="pl-res-i"><span class="tx3">' + esc(tit) + ' ' + u + ' %</span> ' + (x ? '<b class="mono">' + x.anio + '</b> <span class="mono">' + esc(x.id || "") + '</span> <span class="tx3">' + esc(nomFam(x.familia)) + '</span>' : '<span class="tx3">' + esc(t(TX.nunca)) + '</span>') + '</span>';
    }
    return '<div class="pl-res">' + uno("85", "global", t(TX.global)) + uno("85", "por_crecimiento", t(TX.primero)) + uno("100", "global", t(TX.global)) + uno("100", "por_crecimiento", t(TX.primero)) + '</div>';
  }
  function sevPct(v) { return !esNum(v) ? "ok" : v > 100 ? "crit" : v >= 85 ? "maj" : v >= 60 ? "min" : "ok"; }
  function tablaSatura(p) {
    var els = (p.elementos || []).slice().sort(function (a, b) {
      return ((a.anio_85 || 9999) - (b.anio_85 || 9999)) || ((a.anio_100 || 9999) - (b.anio_100 || 9999)) || ((b.pct_fin || 0) - (a.pct_fin || 0));
    });
    if (!els.length) return '<div class="vacio">' + esc(t({ es: "Ningún elemento pasa del 85 % en el horizonte.", en: "No element exceeds 85 % within the horizon." })) + '</div>';
    var iy = V.anio - p.desde;
    return '<table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Elemento", en: "Element" })) + '</th><th>' + esc(t({ es: "Familia", en: "Family" })) + '</th><th class="n">' + esc(t({ es: "Año 85 %", en: "Year 85 %" })) +
      '</th><th class="n">' + esc(t({ es: "Año 100 %", en: "Year 100 %" })) + '</th><th class="n">' + p.desde + '</th><th class="n">' + V.anio + '</th><th class="n">' + p.hasta + '</th><th>' + esc(t({ es: "Nota", en: "Note" })) + '</th></tr></thead><tbody>' +
      els.map(function (e) {
        var py = e.pct ? e.pct[iy] : null;
        return '<tr' + selAttr(e.id, e.familia) + '><td class="id">' + esc(e.id) + '</td><td>' + esc(nomFam(e.familia)) + (e.tipo ? ' <span class="tx3">' + esc(e.tipo) + '</span>' : '') + '</td>' +
          '<td class="n"><b>' + (e.anio_85 || "—") + '</b></td><td class="n">' + (e.anio_100 || "—") + '</td>' +
          '<td class="n sev-' + sevPct(e.pct_inicio) + '">' + f1(e.pct_inicio) + '</td><td class="n sev-' + sevPct(py) + '">' + f1(py) + '</td><td class="n sev-' + sevPct(e.pct_fin) + '">' + f1(e.pct_fin) + '</td>' +
          '<td class="txt tx3 nw">' + (e.desde_inicio_85 ? esc(t(TX.desdeInicio)) : "") + (e.virtual ? " · virtual" : "") + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  function tablaHoja(p) {
    var hr = p.hoja_ruta || [];
    if (!hr.length) return '<div class="vacio">' + esc(t({ es: "Sin ampliaciones en el horizonte.", en: "No upgrades within the horizon." })) + '</div>';
    return '<table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Año", en: "Year" })) + '</th><th>' + esc(t({ es: "Acción", en: "Action" })) + '</th><th>' + esc(t({ es: "Elemento", en: "Element" })) +
      '</th><th class="n">+Gbit/s</th><th class="n">' + esc(t({ es: "Capacidad", en: "Capacity" })) + '</th><th class="n">' + esc(t({ es: "Ocup. antes → después", en: "Occ. before → after" })) + '</th><th>' + esc(t({ es: "Aviso / nota", en: "Warning / note" })) + '</th><th></th></tr></thead><tbody>' +
      hr.map(function (r, i) {
        var acc = { anadir_lambda: { es: "añadir λ", en: "add λ" }, ampliar: { es: "ampliar", en: "upgrade" }, ampliar_sitios: { es: "ampliar sitios", en: "upgrade sites" } }[r.accion] || { es: r.accion, en: r.accion };
        var elTxt = r.id ? esc(r.id) : (r.sitios ? esc(r.sitios.slice(0, 3).join(", ") + (r.sitios.length > 3 ? " +" + (r.sitios.length - 3) : "")) : "—");
        var aplicada = r.evento && eventoAplicado(r.evento);
        var btn = r.evento ? '<button type="button" class="btn' + (aplicada ? "" : " prim") + '" data-pl-aplicar="' + i + '"' + (aplicada ? " disabled" : "") + ' title="' +
          esc(t({ es: "Inserta el evento " + r.evento.tipo + " (00:00) en el caso LAB", en: "Inserts the " + r.evento.tipo + " event (00:00) in the LAB case" })) + '">' + esc(aplicada ? t(TX.aplicada) : t(TX.aplicar)) + '</button>' : '';
        return '<tr' + (r.anio === V.anio ? ' class="sel"' : '') + '><td class="mono">' + r.anio + '</td><td>' + esc(t(acc)) + (r.n ? ' ×' + r.n : '') + (r.n_sitios ? ' ×' + r.n_sitios : '') + '</td>' +
          '<td class="id"' + selAttr(r.id, r.familia) + '>' + elTxt + '</td><td class="n">' + (esNum(r.gbps) ? f1(r.gbps) : "—") + '</td>' +
          '<td class="n">' + (esNum(r.capacidad_antes_gbps) ? f1(r.capacidad_antes_gbps) + " → " + f1(r.capacidad_gbps) : "—") + '</td>' +
          '<td class="n"><span class="sev-' + sevPct(r.ocup_antes_pct) + '">' + f1(r.ocup_antes_pct) + '</span>' + (esNum(r.ocup_despues_pct) ? ' → <span class="sev-' + sevPct(r.ocup_despues_pct) + '">' + f1(r.ocup_despues_pct) + '</span>' : '') + ' %</td>' +
          '<td class="txt' + (r.aviso ? " pl-aviso-c" : " tx3") + '">' + esc(r.aviso || r.nota || (r.desde_inicio ? t(TX.desdeInicio) : "")) + '</td><td>' + btn + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  function aplicarAmpliacion(i) {
    var p = PL.p, r = p && p.hoja_ruta[i];
    if (!r || !r.evento) return;
    if (!NOC.operador || !NOC.operador.anadir) { NOC.mensaje && NOC.mensaje(t({ es: "Falta operador.js", en: "operador.js missing" })); return; }
    if (NOC.modo !== "lab") NOC.setModo("lab");
    NOC.operador.anadir({ t_min: 0, tipo: r.evento.tipo, id: r.evento.id, params: JSON.parse(JSON.stringify(r.evento.params || {})) });
    NOC.mensaje && NOC.mensaje(t({ es: "Ampliación " + r.evento.id + " añadida al caso LAB (00:00, película de 24 h del reloj).", en: "Upgrade " + r.evento.id + " added to the LAB case (00:00, 24 h clock run)." }));
    V.sucio = true; if (V.activa) pintarPlan();
  }

  function montarPlan(el) {
    V.el = el; el.classList.add("pl");
    el.addEventListener("change", function (ev) {
      if (ev.target.getAttribute("data-pl") === "anio") { V.anio = Number(ev.target.value); pintarPlan(); }
    });
    el.addEventListener("click", function (ev) {
      var b;
      if ((b = ev.target.closest("[data-pl-sup]"))) { abrirSupuesto(b.getAttribute("data-pl-sup")); return; }
      if ((b = ev.target.closest("[data-pl-aplicar]"))) { ev.stopPropagation(); aplicarAmpliacion(Number(b.getAttribute("data-pl-aplicar"))); return; }
      if ((b = ev.target.closest('[data-pl="aplicar-anio"]'))) {
        var c = JSON.parse(JSON.stringify(NOC.caso || {})); c.anio = V.anio;
        NOC.aplicarCaso(c); return;
      }
      if ((b = ev.target.closest("[data-pl-anio]"))) { V.anio = Number(b.getAttribute("data-pl-anio")); pintarPlan(); }
    });
    el.addEventListener("mousemove", function (ev) {
      var g = ev.target.closest && ev.target.closest(".pl-golpe"), tt = el.querySelector(".pl-tt"), cr = el.querySelector(".pl-cruz");
      if (!tt) return;
      if (!g || !PL.p) { tt.hidden = true; if (cr) cr.style.display = "none"; return; }
      var i = Number(g.getAttribute("data-i")), box = el.querySelector(".pl-graf").getBoundingClientRect();
      tt.innerHTML = tooltipAnio(PL.p, i); tt.hidden = false;
      var x = ev.clientX - box.left + 14, y = ev.clientY - box.top + 10;
      if (x + 260 > box.width) x = ev.clientX - box.left - 270;
      tt.style.left = x + "px"; tt.style.top = y + "px";
      if (cr) { var gx = Number(g.getAttribute("x")) + Number(g.getAttribute("width")) / 2; cr.setAttribute("x1", gx); cr.setAttribute("x2", gx); cr.style.display = ""; }
    });
    el.addEventListener("mouseleave", function () { var tt = el.querySelector(".pl-tt"); if (tt) tt.hidden = true; });
    pintarPlan();
  }
  NOC.registrarVista({ id: "planificacion", grupo: "analisis", titulo: { es: "PLANIFICACIÓN", en: "PLANNING" }, montar: montarPlan,
    activar: function () { V.activa = true; if (V.sucio || PL.k !== claveCaso()) pintarPlan(); else dibujarGrafica(); },
    desactivar: function () { V.activa = false; } });

  // ======================================================================== SLA / DISPONIBILIDAD
  var W = { el: null, activa: false, sucio: true, slice: null, tabD: "zonas", mapa: null, capa: null };
  function semaforo(s) {
    if (!s) return NOC.insignia("unk", "—");
    if (!s.cumple) return NOC.insignia("crit", "CRIT");
    var m = s.peor && s.peor.margen_ms, o = s.peor && s.peor.objetivo_ms;
    if (esNum(m) && esNum(o) && o > 0 && m < 0.2 * o) return NOC.insignia("min", "MIN");
    return NOC.insignia("ok", "OK");
  }
  function nomSlice(k, s) { return k === "sin_slice" ? t({ es: "sin slice", en: "no slice" }) : k === "fijo-bng" ? t({ es: "fijo (BNG)", en: "fixed (BNG)" }) : (s && s.nombre) || k; }
  function tablaSLA() {
    var S = NOC.resultado && NOC.resultado.sla;
    if (!S) return '<div class="vacio">' + esc(t({ es: "El resultado no trae SLA (motor sin latencia).", en: "The result has no SLA (engine without latency)." })) + '</div>';
    var ks = Object.keys(S);
    return '<table class="tabla pl-tab sd-sla"><thead><tr><th></th><th>Slice</th><th class="n" title="' + esc(t({ es: "Presupuesto de transporte (el KPI extremo a extremo va en la ayuda de cada celda)", en: "Transport budget (the end-to-end KPI is in each cell tooltip)" })) + '">' + esc(t({ es: "Obj. transp.", en: "Transp. target" })) +
      '</th><th class="n">P95 ' + esc(t({ es: "peor", en: "worst" })) + '</th><th class="n">' + esc(t({ es: "Margen", en: "Margin" })) + '</th><th class="n">' + esc(t({ es: "Cumple", en: "Meets" })) + '</th><th>' + esc(t({ es: "Peor demanda", en: "Worst demand" })) + '</th></tr></thead><tbody>' +
      ks.map(function (k) {
        var s = S[k], pe = s.peor || {};
        return '<tr data-sd-slice="' + esc(k) + '"' + (W.slice === k ? ' class="sel"' : '') + '><td>' + semaforo(s) + '</td><td>' + esc(nomSlice(k, s)) + '</td>' +
          '<td class="n" title="KPI ' + esc(ms(s.objetivo_lat_ms)) + '">' + ms(s.objetivo_transporte_ms) + '</td><td class="n">' + ms(pe.lat_p95_ms) + '</td>' +
          '<td class="n' + (esNum(pe.margen_ms) && pe.margen_ms < 0 ? " sev-crit" : "") + '">' + ms(pe.margen_ms) + '</td>' +
          '<td class="n" title="' + esc(fmt(s.cumple_pct, 1) + ' % · ' + fmt(s.cumple_gbps_pct, 1)) + ' % Gbit/s">' + s.n_cumple + '/' + s.n + '</td>' +
          '<td class="id"><a href="#" data-sd-dem="' + esc(pe.id || "") + '">' + esc(pe.id || "—") + '</a></td></tr>';
      }).join("") + '</tbody></table>';
  }
  function demandasSlice(k) {
    var r = NOC.resultado;
    if (!r || !k) return "";
    var ds = (r.demandas || []).filter(function (d) { return (d.slice || "sin_slice") === k && (d.dl_gbps > 1e-9 || d.ul_gbps > 1e-9); });
    ds.sort(function (a, b) {
      var ma = esNum(a.latencia_max_ms) && esNum(a.lat_p95_ms) ? a.latencia_max_ms - a.lat_p95_ms : 1e9, mb = esNum(b.latencia_max_ms) && esNum(b.lat_p95_ms) ? b.latencia_max_ms - b.lat_p95_ms : 1e9;
      return ma - mb || (b.lat_p95_ms || 0) - (a.lat_p95_ms || 0);
    });
    return '<div class="sd-sub"><span class="lbl">' + esc(nomSlice(k, (r.sla || {})[k])) + ' · ' + ds.length + ' ' + esc(t({ es: "demandas (menor margen primero)", en: "demands (smallest margin first)" })) + '</span></div>' +
      '<div class="sd-dems"><table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Demanda", en: "Demand" })) + '</th><th class="n">' + esc(t({ es: "Media", en: "Mean" })) + '</th><th class="n">P95</th><th class="n">' + esc(t({ es: "Obj.", en: "Target" })) +
      '</th><th class="n">' + esc(t({ es: "Margen", en: "Margin" })) + '</th><th class="n">' + esc(t({ es: "Servida", en: "Served" })) + '</th><th>' + esc(t({ es: "Estado", en: "Status" })) + '</th></tr></thead><tbody>' +
      ds.slice(0, 200).map(function (d) {
        var m = esNum(d.latencia_max_ms) && esNum(d.lat_p95_ms) ? d.latencia_max_ms - d.lat_p95_ms : null, sv = d.dl_gbps > 0 ? d.servida_gbps / d.dl_gbps * 100 : 100;
        return '<tr data-sd-dem="' + esc(d.id) + '"><td class="id">' + esc(d.id) + '</td><td class="n">' + ms(d.lat_ms) + '</td><td class="n">' + ms(d.lat_p95_ms) + '</td><td class="n">' + ms(d.latencia_max_ms) + '</td>' +
          '<td class="n' + (esNum(m) && m < 0 ? " sev-crit" : "") + '">' + ms(m) + '</td><td class="n">' + fmt(sv, 1) + ' %</td><td>' + esc(d.estado || "") + (d.lat_saturado ? ' <span class="sev-crit">ρ≥0,99</span>' : '') + '</td></tr>';
      }).join("") + '</tbody></table></div>';
  }

  // barra apilada de latencia (3 componentes) — colores de las series 1–3 con leyenda en texto
  function barraLat(partes) {
    var tot = partes.reduce(function (s, p) { return s + (esNum(p.v) ? Math.max(0, p.v) : 0); }, 0) || 1;
    return '<div class="lat-barra">' + partes.map(function (p) {
      var w = Math.max(0, p.v || 0) / tot * 100;
      return w > 0 ? '<i style="width:' + w.toFixed(2) + '%;background:' + p.c + ';min-width:2px" title="' + esc(p.n + " " + ms(p.v)) + '"></i>' : '';
    }).join("") + '</div><div class="lat-ley">' + partes.map(function (p) {
      return '<span><i style="background:' + p.c + '"></i>' + esc(p.n) + ' <b class="mono">' + ms(p.v) + '</b></span>';
    }).join("") + '</div>';
  }
  function latenciaEnlaceHTML(id) {
    var e = NOC.resultado && NOC.resultado.enlaces && NOC.resultado.enlaces[id];
    if (!e || !esNum(e.lat_ms)) return "";
    var km = (IDX.enlaces[id] || {}).km;
    return '<h3>' + esc(t(TX.latencia)) + '</h3>' +
      barraLat([{ n: t(TX.prop), v: e.lat_prop_ms, c: "var(--pl-s1)" }, { n: t(TX.ser), v: e.lat_ser_ms, c: "var(--pl-s2)" }, { n: t(TX.cola), v: e.cola_ms, c: "var(--pl-s3)" }]) +
      '<dl class="kv" style="margin-top:6px">' +
      [[t({ es: "Media (sentido peor)", en: "Mean (worst direction)" }), ms(e.lat_ms) + (e.lat_sentido ? ' <span class="tx3">' + esc(e.lat_sentido.toUpperCase()) + '</span>' : '')],
        ["P95", ms(e.lat_p95_ms)],
        [t({ es: "A→B / B→A", en: "A→B / B→A" }), ms(e.lat_ab_ms) + " / " + ms(e.lat_ba_ms)],
        [t({ es: "Propagación", en: "Propagation" }), ms(e.lat_prop_ms) + (esNum(km) ? ' <span class="tx3">' + fmt(km, 1) + ' km × 5 µs/km</span>' : '')],
        [t({ es: "Cola media / P95", en: "Queue mean / P95" }), ms(e.cola_ms) + " / " + ms(e.cola_p95_ms) + ' <span class="tx3">M/M/1 · ρ = ' + fmt(e.rho_cola, 3) + '</span>'],
        [t({ es: "Prioridad (VoNR+URLLC)", en: "Priority (VoNR+URLLC)" }), ms(e.lat_prio_ms) + " · P95 " + ms(e.lat_prio_p95_ms)],
        e.lat_saturado ? [t({ es: "Saturado", en: "Saturated" }), '<span class="sev-crit">ρ ≥ 0,99 · ' + esc(t({ es: "cota inferior", en: "lower bound" })) + '</span>'] : null
      ].filter(Boolean).map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + x[1] + '</dd>'; }).join("") + '</dl>' +
      '<p class="nota tx3" style="margin-top:4px">' + esc(t({ es: "Modelo de cola M/M/1 (supuesto ana.cola_mm1); tamaño de paquete ana.tamano_paquete.", en: "M/M/1 queue model (assumption ana.cola_mm1); packet size ana.tamano_paquete." })) + '</p>';
  }
  function abrirDemanda(id) {
    var r = NOC.resultado, d = r && (r.demandas || []).filter(function (x) { return x.id === id; })[0];
    if (!d) return false;
    var m = esNum(d.latencia_max_ms) && esNum(d.lat_p95_ms) ? d.latencia_max_ms - d.lat_p95_ms : null;
    var h = '<div class="ficha-sec"><h3>' + esc(t({ es: "Demanda", en: "Demand" })) + '</h3><dl class="kv">' +
      [["Slice", esc(d.slice || "—")], [t({ es: "Clase", en: "Class" }), esc(d.clase_servicio || d.clase || "")],
        [t({ es: "Origen → destino", en: "Origin → destination" }), esc((d.origen || "") + " → " + (d.destino_nodo || d.destino || ""))],
        ["DL", f1(d.dl_gbps) + " Gbit/s"], [t({ es: "Servida", en: "Served" }), fmt(d.dl_gbps > 0 ? d.servida_gbps / d.dl_gbps * 100 : 100, 1) + " %"],
        [t({ es: "Estado", en: "Status" }), esc(d.estado || "") + (d.via ? ' <span class="tx3">' + esc(d.via) + '</span>' : '')]]
        .map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + x[1] + '</dd>'; }).join("") + '</dl></div>' +
      '<div class="ficha-sec dato-calc" data-pl="latencia-dem"><h3>' + esc(t(TX.latencia)) + '</h3>' +
      barraLat([{ n: t(TX.sinCola), v: d.lat_sin_cola_ms, c: "var(--pl-s1)" }, { n: t(TX.cola), v: d.lat_cola_ms, c: "var(--pl-s3)" }]) +
      '<dl class="kv" style="margin-top:6px">' +
      [[t({ es: "Media", en: "Mean" }), ms(d.lat_ms)], ["P95", ms(d.lat_p95_ms)], [t({ es: "Latencia v7 (sin cola)", en: "v7 latency (no queue)" }), ms(d.latencia_ms)],
        [t({ es: "Presupuesto", en: "Budget" }), ms(d.latencia_max_ms)],
        [t({ es: "Margen (P95)", en: "Margin (P95)" }), '<span class="' + (esNum(m) && m < 0 ? "sev-crit" : "") + '">' + ms(m) + '</span>'],
        [t({ es: "Cola prioritaria", en: "Priority queue" }), d.lat_prioridad ? t({ es: "sí", en: "yes" }) : t({ es: "no", en: "no" })]]
        .map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + x[1] + '</dd>'; }).join("") + '</dl>' +
      ((d.enlaces || []).length ? '<table class="tabla" style="margin-top:6px"><thead><tr><th>' + esc(t({ es: "Enlace del camino", en: "Path link" })) + '</th><th class="n">prop.</th><th class="n">' + esc(t(TX.cola)) + '</th><th class="n">' + esc(t({ es: "media", en: "mean" })) + '</th></tr></thead><tbody>' +
        d.enlaces.map(function (lid) {
          var e = r.enlaces[lid] || {}, pr = d.lat_prioridad;
          return '<tr data-id="' + esc(lid) + '" data-tipo="enlace"><td class="id">' + esc(lid) + '</td><td class="n">' + ms(e.lat_prop_ms) + '</td><td class="n">' + ms(pr ? (e.lat_prio_ms - e.lat_prop_ms - e.lat_ser_ms) : e.cola_ms) + '</td><td class="n">' + ms(pr ? e.lat_prio_ms : e.lat_ms) + '</td></tr>';
        }).join("") + '</tbody></table>' : '') + '</div>';
    NOC.seleccion = { tipo: "demanda", id: id };
    NOC.abrirFicha({ titulo: id, subtitulo: t({ es: "demanda · latencia y SLA", en: "demand · latency and SLA" }), html: h });
    if (NOC.plegado && NOC.plegado("ficha")) NOC.plegar("ficha", false);
    return true;
  }

  // ---- disponibilidad
  // Escala secuencial de un solo tono (azul), de oscuro (poca indisponibilidad) a claro (mucha) sobre fondo negro.
  var RAMPA = ["#1d3a5f", "#23548c", "#2f6fbd", "#3987e5", "#8db8f2"];
  var CORTES = [5.26, 26.3, 52.6, 105.2];   // por defecto; pintarDisp los recalcula en 5 intervalos iguales entre el mínimo y el máximo de las zonas
  function colorIndisp(m) { for (var i = 0; i < CORTES.length; i++) if (m < CORTES[i]) return RAMPA[i]; return RAMPA[CORTES.length]; }
  function binTxt(i) { return i === 0 ? "< " + fmt(CORTES[0], 0) : i === CORTES.length ? "≥ " + fmt(CORTES[i - 1], 0) : fmt(CORTES[i - 1], 0) + "–" + fmt(CORTES[i], 0); }
  var TIPO_SU = { n1: "N-1", srlg: "SRLG", n2: "N-2", comun: { es: "común", en: "common" } };
  function tipoSu(x) { var v = TIPO_SU[x]; return typeof v === "object" ? t(v) : (v || x || ""); }
  function nomItem(tab, id) {
    if (tab === "zonas") return (IDX.zonas[id] || {}).nombre || id;
    if (tab === "slices") return nomSlice(id, null);
    if (tab === "servicios" && NOC.infoServicio && NOC.infoServicio[id]) return t(NOC.infoServicio[id].n || NOC.infoServicio[id].nombre || { es: id, en: id });
    return id;
  }
  function tablaDisp(D) {
    var tabs = [["zonas", { es: "Zonas", en: "Zones" }], ["servicios", { es: "Servicios", en: "Services" }], ["slices", { es: "Slices", en: "Slices" }], ["especiales", { es: "Especiales", en: "Special" }]];
    var g = D[W.tabD] || {}, ks = Object.keys(g).sort(function (a, b) { return g[b].indisp_min_anio - g[a].indisp_min_anio; });
    var obj = D.objetivos || {};
    return '<div class="sd-tabs">' + tabs.map(function (x) { return '<button type="button" class="uf-seg" data-sd-tab="' + x[0] + '" aria-pressed="' + (W.tabD === x[0]) + '">' + esc(t(x[1])) + '</button>'; }).join("") + '</div>' +
      '<table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Ámbito", en: "Scope" })) + '</th><th class="n">DL Gbit/s</th><th class="n">min/' + esc(t({ es: "año", en: "yr" })) + '</th><th class="n">%</th><th>' +
      esc(t({ es: "Peor suceso", en: "Worst event" })) + '</th></tr></thead><tbody>' +
      ks.map(function (k) {
        var x = g[k], p = x.peor || {}, objPct = k === "S-HOSPITAL-CRITICO" ? obj.hospital_pct : obj.nucleo_pct;
        var sev = esNum(objPct) && x.disponibilidad_pct < objPct ? "maj" : "ok";
        return '<tr data-sd-disp="' + esc(k) + '"><td>' + esc(nomItem(W.tabD, k)) + (nomItem(W.tabD, k) !== k ? ' <span class="tx3 mono">' + esc(k) + '</span>' : '') + '</td><td class="n">' + f1(x.dl_gbps) + '</td>' +
          '<td class="n"><i class="sd-sw" style="background:' + colorIndisp(x.indisp_min_anio) + '"></i>' + fmt(x.indisp_min_anio, 1) + '</td><td class="n">' + fmt(x.disponibilidad_pct, 4) + (sev === "maj" ? ' <span class="tx3" title="' + esc(t({ es: "por debajo del objetivo", en: "below target" }) + " " + fmt(objPct, 3) + " %") + '">&lt; obj.</span>' : '') + '</td>' +
          '<td class="id tx2">' + esc((p.id || "—") + (p.tipo ? " · " + tipoSu(p.tipo) : "") + (esNum(p.min_anio) ? " · " + fmt(p.min_anio, 1) + " min" : "")) + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  function tablaSucesos(D) {
    var s = (D.sucesos || []).slice().sort(function (a, b) { return (b.contribucion_min_anio || 0) - (a.contribucion_min_anio || 0); }).slice(0, 12);
    return '<table class="tabla pl-tab"><thead><tr><th>' + esc(t({ es: "Suceso", en: "Event" })) + '</th><th>' + esc(t({ es: "Tipo", en: "Type" })) + '</th><th class="n">U</th><th class="n">min/' + esc(t({ es: "año", en: "yr" })) +
      '</th><th class="n">DL ' + esc(t({ es: "perdida", en: "lost" })) + '</th><th class="n">' + esc(t({ es: "Contrib. red", en: "Network contrib." })) + '</th></tr></thead><tbody>' +
      s.map(function (x) {
        var sel = x.elementos && x.elementos.length === 1 ? (IDX.enlaces[x.elementos[0]] ? ' data-id="' + esc(x.elementos[0]) + '" data-tipo="enlace"' : IDX.nodos[x.elementos[0]] ? ' data-id="' + esc(x.elementos[0]) + '" data-tipo="nodo"' : '') : '';
        return '<tr' + sel + '><td class="id" title="' + esc((x.elementos || []).join(", ")) + '">' + esc(x.id) + '</td><td>' + esc(tipoSu(x.tipo)) + '</td><td class="n">' + (esNum(x.u) ? x.u.toExponential(1) : "—") + '</td>' +
          '<td class="n">' + fmt(x.min_anio, 1) + '</td><td class="n">' + f1(x.dl_perdida_gbps) + '</td><td class="n">' + fmt(x.contribucion_min_anio, 2) + '</td></tr>';
      }).join("") + '</tbody></table>';
  }
  function abrirDisp(k) {
    var D = DI.d, x = D && D[W.tabD] && D[W.tabD][k];
    if (!x) return;
    if (W.tabD === "zonas" && IDX.zonas[k]) { NOC.seleccionar("zona", k); }
    else {
      NOC.seleccion = { tipo: "disponibilidad", id: k };
      NOC.abrirFicha({ titulo: k, subtitulo: t(TX.disp), html: '' });
    }
    var c = document.getElementById("ficha-cuerpo");
    if (!c) return;
    var sec = document.createElement("div");
    sec.className = "ficha-sec dato-calc sd-ficha";
    sec.innerHTML = '<h3>' + esc(t(TX.disp)) + '</h3><dl class="kv"><dt>min/' + esc(t({ es: "año", en: "yr" })) + '</dt><dd>' + fmt(x.indisp_min_anio, 2) + '</dd><dt>%</dt><dd>' + fmt(x.disponibilidad_pct, 5) + '</dd></dl>' +
      '<table class="tabla" style="margin-top:6px"><thead><tr><th>' + esc(t({ es: "Suceso", en: "Event" })) + '</th><th>' + esc(t({ es: "Tipo", en: "Type" })) + '</th><th class="n">' + esc(t({ es: "fracción", en: "fraction" })) + '</th><th class="n">min/' + esc(t({ es: "año", en: "yr" })) + '</th></tr></thead><tbody>' +
      (x.sucesos || []).map(function (s) { return '<tr><td class="id">' + esc(s.id) + '</td><td>' + esc(tipoSu(s.tipo)) + '</td><td class="n">' + fmt((s.fraccion || 0) * 100, 1) + ' %</td><td class="n">' + fmt(s.min_anio, 2) + '</td></tr>'; }).join("") + '</tbody></table>';
    var primera = c.querySelector(".ficha-sec");
    if (primera && primera.nextSibling) c.insertBefore(sec, primera.nextSibling); else c.appendChild(sec);
  }
  function pintarMapaDisp(D) {
    var cont = W.el && W.el.querySelector(".sd-mapa");
    if (!cont) return;
    if (typeof window.L === "undefined") { cont.innerHTML = '<div class="vacio">' + esc(t({ es: "Leaflet no se pudo cargar: ver la tabla.", en: "Leaflet could not be loaded: see the table." })) + '</div>'; return; }
    var L = window.L;
    if (!W.mapa || W.mapa.getContainer() !== cont) {
      if (W.mapa) { try { W.mapa.remove(); } catch (e) { /* nada */ } }
      W.mapa = L.map(cont, { zoomControl: false, attributionControl: true, zoomSnap: 0.5, minZoom: 8, maxZoom: 14 });
      L.control.zoom({ position: "bottomright" }).addTo(W.mapa);
      var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ" });
      var fallos = 0;
      esri.on("tileerror", function () {
        if (++fallos !== 4) return;
        W.mapa.removeLayer(esri);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(W.mapa);
      });
      esri.addTo(W.mapa);
      var pts = (RED.zonas || []).map(function (z) { return z.centro; }).filter(Boolean);
      if (pts.length) W.mapa.fitBounds(L.latLngBounds(pts).pad(0.15)); else W.mapa.setView([40.42, -3.68], 10);
      W.capa = L.layerGroup().addTo(W.mapa);
    }
    W.capa.clearLayers();
    var z = D.zonas || {}, dlmax = 1;
    Object.keys(z).forEach(function (k) { dlmax = Math.max(dlmax, z[k].dl_gbps || 0); });
    (RED.zonas || []).forEach(function (zo) {
      var x = z[zo.id];
      if (!x || !zo.centro) return;
      var r = 7 + 15 * Math.sqrt((x.dl_gbps || 0) / dlmax);
      var m = L.circleMarker(zo.centro, { radius: r, color: "#000", weight: 2, fillColor: colorIndisp(x.indisp_min_anio), fillOpacity: 0.92 });
      m.bindTooltip('<b>' + esc(zo.nombre) + '</b><br>' + fmt(x.indisp_min_anio, 1) + ' min/' + esc(t({ es: "año", en: "yr" })) + ' · ' + fmt(x.disponibilidad_pct, 4) + ' %<br><span class="tx3">' +
        esc(t({ es: "peor", en: "worst" })) + ': ' + esc((x.peor || {}).id || "—") + '</span>', { direction: "top", className: "sd-tt" });
      m.on("click", function () { W.tabD = "zonas"; abrirDisp(zo.id); });
      m.addTo(W.capa);
    });
    setTimeout(function () { if (W.mapa) W.mapa.invalidateSize(); }, 0);
  }
  function pintarSLA() {
    var el = W.el;
    if (!el) return;
    W.sucio = false;
    var r = NOC.resultado, paso = r && r.paso_reloj ? " · " + r.paso_reloj.etiqueta : "";
    var h = '<div class="pl-barra"><span class="lbl">' + esc(t(TX.slaTit)) + '</span><span class="pl-modo">' + (NOC.modo === "ref" ? "REF" : "LAB") + esc(paso) + '</span><span class="pl-esp"></span>' +
      '<span class="tx3">' + esc(t({ es: "OK = cumple con margen ≥ 20 % · MIN = cumple ajustado · CRIT = incumple (P95 > presupuesto o no servida)", en: "OK = meets with margin ≥ 20 % · MIN = tight · CRIT = fails (P95 > budget or not served)" })) + '</span></div>' +
      '<div class="sd-cuerpo"><section class="pl-sec"><h3 class="lbl">' + esc(t(TX.sla)) + '</h3>' + tablaSLA() + demandasSlice(W.slice) + '</section>' +
      '<section class="pl-sec sd-disp"><h3 class="lbl">' + esc(t(TX.disp)) + '</h3><div class="sd-disp-c"><div class="vacio">' + esc(t(TX.calculando)) + '</div></div></section></div>';
    el.innerHTML = h;
    setTimeout(pintarDisp, 0);
  }
  function pintarDisp() {
    var c = W.el && W.el.querySelector(".sd-disp-c");
    if (!c) return;
    if (typeof Motor.disponibilidad !== "function") { c.innerHTML = '<div class="vacio">Motor.disponibilidad —</div>'; return; }
    var D = disponibilidad();
    if (D && D.zonas) {
      var vs = Object.keys(D.zonas).map(function (k) { return D.zonas[k].indisp_min_anio; }).filter(esNum);
      if (vs.length > 1) {
        var lo = Math.floor(Math.min.apply(null, vs)), hi = Math.ceil(Math.max.apply(null, vs)), pa = Math.max(1, Math.ceil((hi - lo) / 5));
        CORTES = [1, 2, 3, 4].map(function (i) { return lo + pa * i; });
      }
    }
    if (!D) { c.innerHTML = '<div class="vacio">' + esc(DI.err) + '</div>'; return; }
    var red = D.red || {}, obj = D.objetivos || {}, P = D.parametros || {};
    var minObj = esNum(obj.nucleo_pct) ? (100 - obj.nucleo_pct) / 100 * (P.minutos_anio || 525960) : null;
    c.innerHTML = '<div class="sd-red"><span><span class="tx3">' + esc(t({ es: "Red", en: "Network" })) + '</span> <b class="mono">' + fmt(red.indisp_min_anio, 1) + ' min/' + esc(t({ es: "año", en: "yr" })) + '</b> · <b class="mono">' + fmt(red.disponibilidad_pct, 4) + ' %</b></span>' +
      (esNum(obj.nucleo_pct) ? '<span>' + (red.disponibilidad_pct >= obj.nucleo_pct ? NOC.insignia("ok", "OK") : NOC.insignia("maj", "MAJ")) + ' <span class="tx3">' + esc(t({ es: "objetivo núcleo", en: "core target" })) + '</span> ' + fmt(obj.nucleo_pct, 2) + ' % (' + fmt(minObj, 1) + ' min)</span>' : '') +
      (esNum(obj.hospital_pct) ? '<span class="tx3">' + esc(t({ es: "hospital", en: "hospital" })) + ' ' + fmt(obj.hospital_pct, 3) + ' %</span>' : '') + '</div>' +
      '<div class="sd-mapa-w"><div class="sd-mapa"></div><div class="sd-ley"><span class="lbl">min/' + esc(t({ es: "año", en: "yr" })) + '</span>' +
      RAMPA.map(function (c2, i) { return '<span><i style="background:' + c2 + '"></i>' + binTxt(i) + '</span>'; }).join("") +
      '<span class="tx3">' + esc(t({ es: "área ∝ DL", en: "area ∝ DL" })) + '</span></div></div>' +
      tablaDisp(D) + '<h3 class="lbl sd-h">' + esc(t(TX.peores)) + '</h3>' + tablaSucesos(D) +
      '<p class="nota tx3 sd-par">' + esc(t({ es: "Parámetros", en: "Parameters" })) + ': ' + esc(Object.keys(P).filter(function (k) { return esNum(P[k]); }).map(function (k) { return k + "=" + (Math.abs(P[k]) < 0.01 ? P[k].toExponential(2) : fmt(P[k], 2)); }).join(" · ")) +
      ' · ' + esc(obj.fuente || "") + '</p><div class="pl-sups">' + chipsSup(D.supuestos) + '</div>';
    pintarMapaDisp(D);
  }
  function montarSLA(el) {
    W.el = el; el.classList.add("pl", "sd");
    el.addEventListener("click", function (ev) {
      var b;
      if ((b = ev.target.closest("[data-pl-sup]"))) { abrirSupuesto(b.getAttribute("data-pl-sup")); return; }
      if ((b = ev.target.closest("[data-sd-dem]"))) { ev.preventDefault(); abrirDemanda(b.getAttribute("data-sd-dem")); return; }
      if ((b = ev.target.closest("[data-sd-slice]"))) { var k = b.getAttribute("data-sd-slice"); W.slice = W.slice === k ? null : k; pintarSLA(); return; }
      if ((b = ev.target.closest("[data-sd-tab]"))) { W.tabD = b.getAttribute("data-sd-tab"); pintarDisp(); return; }
      if ((b = ev.target.closest("[data-sd-disp]"))) { abrirDisp(b.getAttribute("data-sd-disp")); return; }
    });
    pintarSLA();
  }
  NOC.registrarVista({ id: "sla", grupo: "analisis", titulo: { es: "SLA / DISPONIBILIDAD", en: "SLA / AVAILABILITY" }, montar: montarSLA,
    activar: function () { W.activa = true; if (W.sucio) pintarSLA(); else if (W.mapa) setTimeout(function () { W.mapa.invalidateSize(); }, 0); },
    desactivar: function () { W.activa = false; } });

  // ======================================================================== ficha de enlace: sección LATENCIA (aditivo)
  var abrirOrig = NOC.abrirFicha;
  NOC.abrirFicha = function () {
    var r = abrirOrig.apply(NOC, arguments);
    try { pintarLatFicha(); } catch (e) { console.error("latencia ficha", e); }
    return r;
  };
  function pintarLatFicha() {
    var c = document.getElementById("ficha-cuerpo"), sel = NOC.seleccion;
    if (!c) return;
    var viejo = c.querySelector(":scope > .pl-lat");
    if (!sel || sel.tipo !== "enlace") { if (viejo) viejo.remove(); return; }
    var html = latenciaEnlaceHTML(sel.id);
    if (!html) { if (viejo) viejo.remove(); return; }
    var sec = viejo || document.createElement("div");
    sec.className = "ficha-sec dato-calc pl-lat"; sec.setAttribute("data-pl", "latencia");
    sec.innerHTML = html;
    if (!viejo) {
      var lj = c.querySelector(":scope > .lj-ficha");
      if (lj) c.insertBefore(sec, lj); else c.appendChild(sec);
    }
    sec.classList.toggle("plegada", NOC.plegado ? NOC.plegado("fs:latencia") : false);
  }

  // ======================================================================== eventos
  var tRes = 0;
  NOC.on("resultado", function () {
    var reloj = NOC.resultadoMeta && NOC.resultadoMeta.reloj;
    if (!reloj) { V.sucio = true; }
    W.sucio = true;
    clearTimeout(tRes);
    tRes = setTimeout(function () {
      if (V.activa && V.sucio && PL.k !== claveCaso()) pintarPlan();
      else if (V.activa && V.sucio) { V.sucio = false; pintarPlan(); }
      if (W.activa) pintarSLA();
    }, 120);
  });
  NOC.on("lang", function () { V.sucio = W.sucio = true; if (V.activa) pintarPlan(); if (W.activa) pintarSLA(); });
  NOC.on("modo", function () { V.sucio = W.sucio = true; });
  if (window.ResizeObserver) {
    var tRz = 0;
    new ResizeObserver(function () { clearTimeout(tRz); tRz = setTimeout(function () { if (V.activa) dibujarGrafica(); }, 80); }).observe(document.getElementById("vistas") || document.body);
  }

  NOC.planificacion = { plan: plan, disponibilidad: disponibilidad, abrirDemanda: abrirDemanda, abrirSupuesto: abrirSupuesto, latenciaEnlaceHTML: latenciaEnlaceHTML };
})();
