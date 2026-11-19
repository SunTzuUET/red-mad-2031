// vista_casos.js — CASOS de RED-MAD 2031: casos guiados para la defensa (PLAN_v2 §5.3) y casos del día a día
// (PLAN_v2 §6). "Simular" pone el caso en LAB con el motor real (NOC.aplicarCaso); el resultado clave se lee de
// NOC.resultado, nunca se escribe a mano. Modo predecir: antes de simular se pide una predicción y después se compara.
// Datos: window.CASOS (casos_datos.js). Lo citado de la memoria lleva su sección de la v7.
(function () {
  "use strict";
  var NOC = window.NOC, C = window.CASOS;
  if (!NOC || !NOC.registrarVista) return;
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function t(o) { return NOC.t(o); }
  function f(x, d) { return NOC.fmt ? NOC.fmt(x, d) : (x == null ? "—" : Number(x).toFixed(d || 0)); }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  var TX = {
    guiados: { es: "Casos guiados", en: "Guided cases" },
    diario: { es: "Día a día", en: "Day to day" },
    predecir: { es: "Predecir antes de simular", en: "Predict before simulating" },
    si: { es: "Sí", en: "On" }, no: { es: "No", en: "Off" },
    simular: { es: "Simular en LAB", en: "Simulate in LAB" },
    resimular: { es: "Volver a simular", en: "Simulate again" },
    confirmar: { es: "Confirmar predicción y simular", en: "Confirm prediction and simulate" },
    cancelar: { es: "Cancelar", en: "Cancel" },
    planteamiento: { es: "Planteamiento", en: "Set-up" },
    pregunta: { es: "Pregunta de predicción", en: "Prediction question" },
    resultado: { es: "Resultado del motor", en: "Engine result" },
    proteccion: { es: "Mecanismo de protección (memoria v7)", en: "Protection mechanism (report v7)" },
    preguntas: { es: "Preguntas abiertas", en: "Open questions" },
    sintomas: { es: "Síntomas", en: "Symptoms" }, cliente: { es: "Cliente", en: "Customer" }, noc: { es: "NOC", en: "NOC" },
    causa: { es: "Causa", en: "Cause" }, operacion: { es: "Operación", en: "Operations" },
    configuracion: { es: "Caso", en: "Case" },
    pct: { es: "Demanda servida", en: "Demand served" },
    top: { es: "Enlace de transporte más cargado", en: "Most loaded transport link" },
    sinRuta: { es: "Demandas sin ruta", en: "Demands without route" },
    alarmas: { es: "Alarmas", en: "Alarms" },
    foco: { es: "Dónde mirar", en: "Where to look" },
    tuPred: { es: "Tu predicción", en: "Your prediction" },
    real: { es: "Motor", en: "Engine" },
    acierto: { es: "ACIERTO", en: "CORRECT" }, fallo: { es: "FALLO", en: "WRONG" },
    rango: { es: "Rango de demanda servida", en: "Served demand range" },
    enlacePred: { es: "Enlace de transporte más cargado", en: "Most loaded transport link" },
    elige: { es: "Elige al menos una respuesta.", en: "Pick at least one answer." },
    noActivo: { es: "Pulsa «Simular» para poner este caso en LAB y ver el resultado del motor.", en: "Press «Simulate» to put this case in LAB and see the engine result." },
    cambiado: { es: "El caso de LAB ya no es este (se ha cambiado en la barra). Vuelve a simular para verlo.", en: "The LAB case is no longer this one (changed in the bar). Simulate again to see it." },
    params: { es: "LAB usa parámetros de demanda editados: las cifras pueden no coincidir con la v7.", en: "LAB uses edited demand parameters: figures may differ from v7." },
    sinApi: { es: "Esta versión de la consola no tiene NOC.aplicarCaso.", en: "This console version has no NOC.aplicarCaso." },
    sinDatos: { es: "No se ha cargado casos_datos.js.", en: "casos_datos.js is not loaded." },
    verMapa: { es: "Ver en el mapa", en: "Show on map" },
    puestoN1: { es: "Puesto en el barrido N-1", en: "Rank in the N-1 sweep" },
    calcN1: { es: "Calcular", en: "Compute" },
    de: { es: "de", en: "of" },
    igualRef: { es: "igual que la referencia", en: "same as reference" },
    ref: { es: "Referencia", en: "Reference" },
    perdidos: { es: "Gbit/s sin servir", en: "Gbit/s not served" },
    simulable: { es: "SIMULABLE", en: "SIMULABLE" },
    parcial: { es: "PARCIAL — COTA", en: "PARTIAL — BOUND" },
    no_modelado: { es: "PARCIAL — NO MODELADO", en: "PARTIAL — NOT MODELLED" },
    explicado: { es: "EXPLICADO", en: "EXPLAINED" },
    nota: { es: "Las cifras de resultado se leen del motor en cada simulación. Marca E2 v7 = memoria conjunta v7; ANT. = documento anterior; SUP. = supuesto del simulador. Ocupación ofrecida = demanda / capacidad (como en el mapa); los enlaces de acceso de sitio no cuentan como transporte.",
      en: "Result figures are read from the engine on every run. Mark E2 v7 = joint report v7; EARLIER = earlier document; ASSUMP. = simulator assumption. Offered occupancy = demand / capacity (as on the map); site access links do not count as transport." },
    estado: { es: "Estado", en: "Status" },
    hora: { es: "hora", en: "hour" },
    ninguno: { es: "ninguno", en: "none" }
  };

  var raiz = null, sel = leer("noc.casos.sel") || "G1", activo = null, prediciendo = null, preds = {}, n1 = {};
  function predice() { return leer("noc.predice") === "1"; }

  function caso(id) { return C && C.porId ? C.porId(id) : null; }
  function tipoSim(c) { return c.simulable || "si"; }
  function etiquetaSim(c) {
    var s = tipoSim(c);
    var sev = s === "si" ? "ok" : s === "parcial" ? "min" : s === "no_modelado" ? "maj" : "unk";
    return '<span class="vc-sim vc-sim-' + s + ' sev-' + sev + '">' + esc(t(TX[s === "si" ? "simulable" : s])) + '</span>';
  }
  function marcaRef(ref) {
    if (!ref) return '<span class="marca sup">' + esc(t({ es: "SIN CITA", en: "NO CITE" })) + '</span>';
    return '<span class="marca doc" title="' + esc(t({ es: "memoria conjunta v7", en: "joint report v7" })) + '">E2 v7 ' + esc(ref) + '</span>';
  }
  function nomEnlace(id) { return id; }

  // ---------------------------------------------------------------- análisis del resultado actual
  function opcionesActuales() { return NOC.opciones && NOC.opciones.caso ? NOC.opciones.caso : null; }
  function coincide(c) {
    var o = opcionesActuales();
    if (NOC.modo !== "lab" || !o || !c.caso) return false;
    var tr = typeof o.trafico === "string" ? o.trafico : (o.trafico && o.trafico.id);
    if (tr !== c.caso.trafico) return false;
    if ((o.evento || "ninguno") !== (c.caso.evento || "ninguno")) return false;
    if (o.trafico && typeof o.trafico === "object") {
      if ((o.trafico.dia || "laborable") !== (c.caso.dia || "laborable")) return false;
      if (o.trafico.anio && o.trafico.anio !== (c.caso.anio || 2031)) return false;
      if (typeof c.caso.hora === "number" && o.trafico.hora !== c.caso.hora) return false;
    }
    var a = (o.fallo || []).slice().sort().join(","), b = (c.caso.fallos || []).slice().sort().join(",");
    return a === b;
  }

  function sevOc(o) { return NOC.sevOcupacion ? NOC.sevOcupacion(o) : (o > 1 ? "crit" : o >= 0.85 ? "maj" : o >= 0.6 ? "min" : "ok"); }
  function celdaOc(o) { return o == null ? "—" : '<span class="sev-' + sevOc(o) + '">' + f(o * 100, 1) + ' %</span>'; }

  function filaFoco(c, fo, r, ref) {
    var nom, val, refv = "";
    if (fo.tipo === "enlace" || fo.tipo === "nodo") {
      var x = fo.tipo === "enlace" ? C.enlace(r, fo.id) : C.nodo(r, fo.id);
      var xr = ref ? (fo.tipo === "enlace" ? C.enlace(ref, fo.id) : C.nodo(ref, fo.id)) : null;
      nom = '<span class="mono">' + esc(fo.id) + '</span>' + (fo.tipo === "nodo" ? ' <span class="vc-tenue">' + esc(NOC.nombre ? NOC.nombre(fo.id) : "") + '</span>' : "");
      if (!x) val = "—";
      else if (x.caido) val = '<span class="sev-crit">' + esc(t({ es: "CAÍDO", en: "DOWN" })) + '</span>';
      else val = celdaOc(x.oc) + ' <span class="vc-tenue">' + f(x.carga, 1) + ' / ' + f(x.cap, 0) + ' Gbit/s</span>';
      if (xr && !xr.caido) refv = celdaOc(xr.oc);
    } else if (fo.tipo === "servicio") {
      var s = C.servicio(r, fo.patron), sr = ref ? C.servicio(ref, fo.patron) : null;
      nom = esc(t(fo.nombre));
      val = s.pct == null ? "—" : '<span class="sev-' + (s.pct >= 99.99 ? "ok" : s.pct >= 50 ? "maj" : "crit") + '">' + f(s.pct, 1) + ' %</span> <span class="vc-tenue">' + f(s.servida, 2) + ' / ' + f(s.dl, 2) + ' Gbit/s</span>';
      if (sr && sr.pct != null) refv = f(sr.pct, 1) + ' %';
    } else if (fo.tipo === "zona") {
      var z = C.zona(r, fo.id), zr = ref ? C.zona(ref, fo.id) : null;
      nom = esc(NOC.nombre ? NOC.nombre(fo.id) : fo.id);
      val = !z ? "—" : '<span class="sev-' + (z.pct >= 99.99 ? "ok" : z.pct >= 50 ? "maj" : "crit") + '">' + f(z.pct, 1) + ' %</span> <span class="vc-tenue">' + f(z.servida, 1) + ' / ' + f(z.dl, 1) + ' Gbit/s</span>';
      if (zr) refv = f(zr.pct, 1) + ' %';
    } else if (fo.tipo === "n1") {
      nom = esc(t(TX.puestoN1)) + ' <span class="mono">' + esc(fo.id) + '</span>';
      var p = n1[fo.id];
      val = p ? (p.puesto ? '<span class="mono">' + p.puesto + '</span> ' + esc(t(TX.de)) + ' ' + p.total + ' <span class="vc-tenue">(' + f(p.pct, 2) + ' %)</span>' : "—")
        : '<button class="btn" data-vc-n1="' + esc(fo.id) + '">' + esc(t(TX.calcN1)) + '</button>';
    }
    return '<tr><td class="txt">' + nom + '</td><td>' + val + '</td><td class="vc-ref">' + refv + '</td></tr>';
  }

  function bloqueResultado(c) {
    var r = NOC.resultado, ref = NOC.referencia;
    if (!c.caso) return "";
    if (activo !== c.id || !r) return '<p class="nota vc-hueco">' + esc(t(TX.noActivo)) + '</p>';
    if (!coincide(c)) return '<p class="nota vc-hueco vc-aviso">' + esc(t(TX.cambiado)) + '</p>';
    var a = C.analizar(NOC.RED, r), ar = ref ? C.analizar(NOC.RED, ref) : null;
    if (!a) return "";
    var top = a.top[0], h = '<table class="tabla vc-res"><thead><tr><th></th><th>' + esc(t(TX.real)) + '</th><th>' + esc(t(TX.ref)) + '</th></tr></thead><tbody>';
    h += '<tr><td>' + esc(t(TX.pct)) + '</td><td><span class="vc-big sev-' + (a.pct >= 99.995 ? "ok" : a.pct >= 95 ? "min" : a.pct >= 80 ? "maj" : "crit") + '">' + f(a.pct, 2) + ' %</span> <span class="vc-tenue">' + f(a.servida, 0) + ' / ' + f(a.dl, 0) + ' Gbit/s</span></td><td class="vc-ref">' + (ar ? f(ar.pct, 2) + ' %' : "") + '</td></tr>';
    h += '<tr><td>' + esc(t(TX.top)) + '</td><td>' + (top ? '<span class="mono">' + esc(top.id) + '</span> ' + celdaOc(top.oc) + ' <span class="vc-tenue">' + f(top.carga, 1) + ' / ' + f(top.cap, 0) + ' Gbit/s</span>' : "—") +
      '</td><td class="vc-ref">' + (ar && ar.top[0] ? '<span class="mono">' + esc(ar.top[0].id) + '</span> ' + celdaOc(ar.top[0].oc) : "") + '</td></tr>';
    h += '<tr><td>' + esc(t(TX.sinRuta)) + '</td><td>' + (a.sin_ruta ? '<span class="sev-crit">' + a.sin_ruta + '</span> <span class="vc-tenue">' + f(a.perdido_gbps, 1) + ' ' + esc(t(TX.perdidos)) + '</span>' : '<span class="sev-ok">0</span>') + '</td><td class="vc-ref">' + (ar ? ar.sin_ruta : "") + '</td></tr>';
    var al = NOC.alarmas ? NOC.alarmas() : [], cnt = { crit: 0, maj: 0, min: 0 };
    al.forEach(function (x) { if (x.sev in cnt) cnt[x.sev]++; });
    h += '<tr><td>' + esc(t(TX.alarmas)) + '</td><td>' + NOC.insignia("crit", "CRIT " + cnt.crit) + ' ' + NOC.insignia("maj", "MAJ " + cnt.maj) + ' ' + NOC.insignia("min", "MIN " + cnt.min) + '</td><td></td></tr>';
    (c.foco || []).forEach(function (fo) { h += filaFoco(c, fo, r, ref); });
    h += '</tbody></table>';
    if (al.length) {
      h += '<ul class="vc-alarmas">';
      al.slice(0, 4).forEach(function (x) { h += '<li>' + NOC.insignia(x.sev) + ' ' + esc(x.texto) + '</li>'; });
      if (al.length > 4) h += '<li class="vc-tenue">+' + (al.length - 4) + '</li>';
      h += '</ul>';
    }
    h += comparacion(c, a);
    return h;
  }

  function comparacion(c, a) {
    var p = preds[c.id];
    if (!p) return "";
    var h = '<div class="vc-comp"><div class="rot">' + esc(t(TX.tuPred)) + '</div><table class="tabla"><tbody>';
    if (p.rango) {
      var real = C.rango(a.pct), ok = real === p.rango;
      var nr = C.RANGOS.filter(function (x) { return x.id === p.rango; })[0], rr = C.RANGOS.filter(function (x) { return x.id === real; })[0];
      h += '<tr><td>' + esc(t(TX.rango)) + '</td><td>' + esc(t(nr)) + '</td><td>' + esc(t(rr)) + '</td><td>' + NOC.insignia(ok ? "ok" : "crit", t(ok ? TX.acierto : TX.fallo)) + '</td></tr>';
    }
    if (p.enlace) {
      var top = a.top[0], mio = a.top.filter(function (x) { return x.id === p.enlace; })[0];
      // empate: se da por bueno un enlace a menos de 0,5 puntos del más cargado
      var ok2 = !!(top && mio && mio.oc >= top.oc - 0.005);
      h += '<tr><td>' + esc(t(TX.enlacePred)) + '</td><td class="mono">' + esc(p.enlace) + (mio ? ' ' + celdaOc(mio.oc) : "") + '</td><td class="mono">' + (top ? esc(top.id) + ' ' + celdaOc(top.oc) : "—") + '</td><td>' + NOC.insignia(ok2 ? "ok" : "crit", t(ok2 ? TX.acierto : TX.fallo)) + '</td></tr>';
    }
    return h + '</tbody></table></div>';
  }

  // Opciones de enlace en orden fijo pero no con la respuesta siempre primero (orden alfabético)
  function formPrediccion(c) {
    var h = '<form class="vc-pred" data-vc-pred="' + esc(c.id) + '"><div class="rot">' + esc(t(TX.tuPred)) + '</div>';
    h += '<fieldset><legend>' + esc(t(TX.rango)) + '</legend>';
    C.RANGOS.forEach(function (x) { h += '<label><input type="radio" name="rango" value="' + esc(x.id) + '"> ' + esc(t(x)) + '</label>'; });
    h += '</fieldset>';
    if (c.opciones_enlace && c.opciones_enlace.length) {
      h += '<fieldset><legend>' + esc(t(TX.enlacePred)) + '</legend>';
      c.opciones_enlace.slice().sort().forEach(function (id) { h += '<label class="mono"><input type="radio" name="enlace" value="' + esc(id) + '"> ' + esc(id) + '</label>'; });
      h += '</fieldset>';
    }
    h += '<div class="vc-acc"><button type="submit" class="btn prim">' + esc(t(TX.confirmar)) + '</button> <button type="button" class="btn" data-vc-cancel="1">' + esc(t(TX.cancelar)) + '</button> <span class="vc-err nota"></span></div></form>';
    return h;
  }

  function descCaso(c) {
    var k = c.caso; if (!k) return "";
    var tr = k.trafico + (typeof k.hora === "number" ? " · " + t(TX.hora) + " " + k.hora + ":00" : "");
    var fa = (k.fallos || []).length ? k.fallos.map(function (x) { return '<span class="chip mono">' + esc(x) + '</span>'; }).join(" ") : esc(t(TX.ninguno));
    return '<div class="kv vc-kv"><span class="rot">' + esc(t({ es: "Tráfico", en: "Traffic" })) + '</span><span class="mono">' + esc(tr) + '</span>' +
      '<span class="rot">' + esc(t({ es: "Evento", en: "Event" })) + '</span><span class="mono">' + esc(k.evento || "ninguno") + '</span>' +
      '<span class="rot">' + esc(t({ es: "Fallos", en: "Faults" })) + '</span><span>' + fa + '</span></div>';
  }

  function lista(items, titulo) {
    var h = '<tr class="vc-grupo"><th colspan="3">' + esc(t(titulo)) + '</th></tr>';
    items.forEach(function (c) {
      h += '<tr data-vc-id="' + esc(c.id) + '"' + (c.id === sel ? ' class="sel"' : "") + '><td class="id">' + esc(c.n ? c.n : c.id) + '</td><td class="txt">' + esc(t(c.titulo)) + '</td><td>' + etiquetaSim(c) + '</td></tr>';
    });
    return h;
  }

  function seccionRefs(titulo, arr) {
    if (!arr || !arr.length) return "";
    var h = '<div class="vc-sec"><div class="rot">' + esc(t(titulo)) + '</div><ul class="vc-refs">';
    arr.forEach(function (x) { h += '<li>' + (x.ref ? marcaRef(x.ref) + ' ' : "") + esc(t(x)) + '</li>'; });
    return h + '</ul></div>';
  }

  function detalle(c) {
    if (!c) return "";
    var h = '<div class="vc-det-cab"><span class="mono vc-id">' + esc(c.n ? "§6·" + c.n : c.id) + '</span> <span class="vc-tit">' + esc(t(c.titulo)) + '</span> ' + etiquetaSim(c) +
      (c.origen === "anterior" ? ' <span class="marca ant">' + esc(t({ es: "ANT.", en: "EARLIER" })) + '</span>' : "") + '</div>';
    if (c.planteamiento) h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.planteamiento)) + '</div><p class="nota vc-p">' + esc(t(c.planteamiento)) + '</p></div>';
    if (c.sintomas) {
      h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.sintomas)) + '</div><div class="kv vc-kv"><span class="rot">' + esc(t(TX.cliente)) + '</span><span>' + esc(t(c.sintomas.cliente)) +
        '</span><span class="rot">' + esc(t(TX.noc)) + '</span><span>' + esc(t(c.sintomas.noc)) + '</span><span class="rot">' + esc(t(TX.causa)) + '</span><span>' + esc(t(c.causa)) + '</span></div></div>';
    }
    if (c.srlg && NOC.RED) {
      h += '<div class="vc-sec"><div class="rot">SRLG</div><table class="tabla"><tbody>';
      c.srlg.forEach(function (id) {
        var l = (NOC.RED.enlaces || []).filter(function (x) { return x.id === id; })[0];
        h += '<tr><td class="id">' + esc(id) + '</td><td class="mono">' + esc(l && l.srlg != null ? (Array.isArray(l.srlg) ? l.srlg.join(", ") : l.srlg) : "—") + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    if (c.nota) h += '<p class="nota vc-nota vc-nota-' + tipoSim(c) + '">' + esc(t(c.nota)) + '</p>';
    if (c.pregunta) h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.pregunta)) + '</div><p class="vc-preg">' + esc(t(c.pregunta)) + '</p></div>';
    if (c.caso) {
      h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.configuracion)) + '</div>' + descCaso(c) + '</div>';
      if (prediciendo === c.id) h += formPrediccion(c);
      else {
        var lbl = c.boton ? t(c.boton) : t(activo === c.id ? TX.resimular : TX.simular);
        h += '<div class="vc-acc"><button class="btn prim" data-vc-sim="' + esc(c.id) + '"' + (NOC.aplicarCaso ? "" : " disabled") + '>' + esc(lbl) + '</button>' +
          (activo === c.id ? ' <button class="btn" data-vc-mapa="1">' + esc(t(TX.verMapa)) + '</button>' : "") +
          (NOC.aplicarCaso ? "" : ' <span class="nota vc-aviso">' + esc(t(TX.sinApi)) + '</span>') + '</div>';
      }
      h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.resultado)) + '</div>' + bloqueResultado(c) + '</div>';
    }
    h += seccionRefs(TX.proteccion, c.proteccion);
    h += seccionRefs(TX.operacion, c.operacion);
    if (c.preguntas && c.preguntas.length) {
      h += '<div class="vc-sec"><div class="rot">' + esc(t(TX.preguntas)) + '</div><ol class="vc-ol">';
      c.preguntas.forEach(function (q) { h += '<li>' + esc(t(q)) + '</li>'; });
      h += '</ol></div>';
    }
    return h;
  }

  function pintar() {
    if (!raiz) return;
    if (!C || !C.guiados) { raiz.innerHTML = '<div class="vc-error">' + esc(t(TX.sinDatos)) + '</div>'; return; }
    if (!caso(sel)) sel = C.guiados[0].id;
    var p = predice();
    var h = '<div class="vc-cab"><span class="rot">' + esc(t({ es: "Casos", en: "Cases" })) + '</span><span class="vc-n">' + C.guiados.length + ' + ' + C.diario.length + '</span>' +
      '<span class="vc-esp"></span><span class="rot">' + esc(t(TX.predecir)) + '</span><span class="seg" role="group">' +
      '<button data-vc-pred-on="1" aria-pressed="' + p + '">' + esc(t(TX.si)) + '</button><button data-vc-pred-on="0" aria-pressed="' + !p + '">' + esc(t(TX.no)) + '</button></span></div>';
    if (NOC.paramsEditados > 0) h += '<p class="nota vc-aviso vc-banda">' + esc(t(TX.params)) + '</p>';
    h += '<div class="vc-cuerpo"><div class="vc-lista"><table class="tabla"><tbody>' + lista(C.guiados, TX.guiados) + lista(C.diario, TX.diario) + '</tbody></table>' +
      '<p class="nota vc-pie">' + esc(t(TX.nota)) + '</p></div><div class="vc-det">' + detalle(caso(sel)) + '</div></div>';
    raiz.innerHTML = h;
  }

  function simular(c) {
    if (!c || !c.caso || !NOC.aplicarCaso) return;
    activo = c.id; prediciendo = null;
    try { NOC.aplicarCaso(c.caso); } catch (e) { console.error("aplicarCaso", e); }
    pintar();   // por si el evento "resultado" no llega (resultado idéntico)
  }

  function clic(ev) {
    var b = ev.target.closest ? ev.target.closest("[data-vc-id],[data-vc-sim],[data-vc-pred-on],[data-vc-cancel],[data-vc-mapa],[data-vc-n1]") : null;
    if (!b || !raiz.contains(b)) return;
    if (b.hasAttribute("data-vc-pred-on")) { guardar("noc.predice", b.getAttribute("data-vc-pred-on")); prediciendo = null; pintar(); return; }
    if (b.hasAttribute("data-vc-cancel")) { prediciendo = null; pintar(); return; }
    if (b.hasAttribute("data-vc-mapa")) { if (NOC.activarVista) NOC.activarVista("mapa"); return; }
    if (b.hasAttribute("data-vc-n1")) { calcularN1(b.getAttribute("data-vc-n1")); return; }
    if (b.hasAttribute("data-vc-sim")) {
      var c = caso(b.getAttribute("data-vc-sim"));
      if (predice()) { prediciendo = c.id; pintar(); } else simular(c);
      return;
    }
    if (b.hasAttribute("data-vc-id")) {
      sel = b.getAttribute("data-vc-id"); guardar("noc.casos.sel", sel); prediciendo = null; pintar();
      var det = raiz.querySelector(".vc-det"); if (det) det.scrollTop = 0;
    }
  }
  function enviar(ev) {
    var fm = ev.target;
    if (!fm || !fm.hasAttribute || !fm.hasAttribute("data-vc-pred")) return;
    ev.preventDefault();
    var c = caso(fm.getAttribute("data-vc-pred"));
    var r = fm.querySelector('input[name="rango"]:checked'), e = fm.querySelector('input[name="enlace"]:checked');
    if (!r && !e) { var err = fm.querySelector(".vc-err"); if (err) err.textContent = t(TX.elige); return; }
    preds[c.id] = { rango: r ? r.value : null, enlace: e ? e.value : null };
    simular(c);
  }
  function calcularN1(id) {
    var M = window.Motor;
    if (!M || typeof M.barridoN1 !== "function") return;
    try {
      var op = JSON.parse(JSON.stringify(NOC.opciones || {}));
      if (op.caso) op.caso.fallo = [];
      var b = M.barridoN1(NOC.RED, op), i = -1;
      b.forEach(function (x, k) { if (x.id === id && i < 0) i = k; });
      n1[id] = { puesto: i >= 0 ? i + 1 : null, total: b.length, pct: i >= 0 ? b[i].pct_servida : null };
    } catch (e) { console.error("barridoN1", e); n1[id] = { puesto: null }; }
    pintar();
  }

  NOC.registrarVista({
    id: "casos", grupo: "analisis",
    titulo: { es: "Casos", en: "Cases" },
    montar: function (el) {
      raiz = el; el.classList.add("vc");
      el.addEventListener("click", clic);
      el.addEventListener("submit", enviar);
      pintar();
    },
    activar: function () { pintar(); },
    desactivar: function () { prediciendo = null; }
  });
  NOC.on("resultado", function () { n1 = {}; pintar(); });
  NOC.on("lang", pintar);
  NOC.on("modo", pintar);
})();
