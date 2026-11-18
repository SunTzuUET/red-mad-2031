// demanda.js — explorador de la demanda (F1 del PLAN_v2): de dónde sale cada Gbit/s y cómo cambia con el modelo de tráfico.
// Usa: ModeloDemanda (modelo_demanda.js), DEMANDA (demanda_datos.js), RED (red.js), Modelos (modelos.js), Motor (motor.js), katex.
(function () {
  "use strict";
  var MD = window.ModeloDemanda, DEM = window.DEMANDA || { magnitudes: {}, fuentes: {}, municipios: [], memoria_v7: {} };
  var RED = window.RED, Motor = window.Motor, Mo = window.Modelos;
  var MAG = DEM.magnitudes, FUE = DEM.fuentes;
  var ZN = ["C", "N", "E", "S"];

  // ---------- textos ES/EN ----------
  var T = {
    es: {
      titulo: "Demanda", anio: "Año", idioma: "Idioma", volver: "Mapa", reset: "Restablecer parámetros",
      m_ref: "Referencia · Entrega 2 (v7)", m_lab: "Laboratorio", m_ref_rot: "parámetros de la Entrega 2 · 2031 · solo lectura", m_lab_rot: "parámetros editables; el NOC los usa en modo LAB",
      intro: "Toda la demanda de la red, paso a paso: del dato del INE o la CNMC a los Gbit/s que llegan a cada equipo. Pulsa cualquier cifra para ver su fórmula, de qué depende y de dónde sale.",
      resumen: "Resumen", explorador: "¿De dónde sale cada cifra?", parametros: "Parámetros editables",
      pasos: "Cadena de cálculo", municipios: "Reparto por municipio", modelos: "Modelos de tráfico",
      municipios_intro: "Las zonas Metro (C, N, E, S) se reparten entre municipios con el peso de la población y las líneas de cada uno. El reparto es del simulador; los documentos solo dan totales por zona.",
      modelos_intro: "El equipo dimensiona con una hora cargada coincidente: todo a la vez. Aquí se compara con modelos más realistas para ver cuánto margen da esa hipótesis.",
      g_pob: "Población y empresas", g_parque: "Líneas y accesos", g_vol: "Volumen y caudal en hora cargada",
      g_zona: "Zona", g_esp: "Servicios especiales", g_tot: "Totales y destinos",
      depende: "Depende de", usado: "Se usa en", formula: "Fórmula", documento: "Documento del equipo",
      fuente_prim: "Fuente primaria", sin_fuente: "Sin fuente primaria citada en los documentos: pendiente del equipo.",
      calculado: "calculado", dato: "dato", parametro: "parámetro", editado: "editado", supuesto: "supuesto", documento_b: "documento",
      control_ok: "Coincide con la memoria conjunta v7 (Tabla 3.4.1): ", control_dif: "Difiere de la memoria conjunta v7 porque has cambiado el año o algún parámetro: ",
      valor_doc: "Valor en el documento", defecto: "por defecto", zona: "Zona", municipio: "Municipio", pob31: "Población 2031",
      fijo_res: "Fijo resid.", empresa: "Empresa", movil: "Móvil", voz: "Voz", total: "Total DL", suma: "Suma",
      dia: "Tipo de día", ambito: "Ámbito", todo: "Toda la red", hora: "Hora", pico: "Pico", hora_pico: "Hora del pico",
      ocup: "Ocupación máx.", enlace: "Enlace más cargado", servida: "Servida", modelo: "Modelo",
      prediccion: "Antes de mirar: ¿cuántos Gbit/s crees que se ahorran en el pico frente a la hora cargada coincidente? Compruébalo pasando el ratón por la gráfica.",
      calculando: "Calculando…", gbps: "Gbit/s", tabla_modelos: "Resumen por modelo (pico en el día)",
      nota_mun: "Voz = VoNR + voz fija. Los servicios especiales (estadio, hospital…) no se reparten por municipio: están en «Servicios especiales».",
      zonas: { C: "Centro", N: "Norte", E: "Este", S: "Sur" }
    },
    en: {
      titulo: "Demand", anio: "Year", idioma: "Language", volver: "Map", reset: "Reset parameters",
      m_ref: "Reference · Deliverable 2 (v7)", m_lab: "Laboratory", m_ref_rot: "Deliverable 2 parameters · 2031 · read-only", m_lab_rot: "editable parameters; the NOC uses them in LAB mode",
      intro: "All network demand, step by step: from the INE or CNMC figure to the Gbit/s reaching each element. Click any number to see its formula, what it depends on and where it comes from.",
      resumen: "Summary", explorador: "Where does each figure come from?", parametros: "Editable parameters",
      pasos: "Calculation chain", municipios: "Split by municipality", modelos: "Traffic models",
      municipios_intro: "Metro zones (C, N, E, S) are split between municipalities by each one's population and lines. The split is the simulator's; the documents only give zone totals.",
      modelos_intro: "The team sizes with a coincident busy hour: everything at once. Here it is compared with more realistic models to see how much margin that assumption gives.",
      g_pob: "Population and businesses", g_parque: "Lines and accesses", g_vol: "Volume and busy-hour rate",
      g_zona: "Zone", g_esp: "Special services", g_tot: "Totals and destinations",
      depende: "Depends on", usado: "Used in", formula: "Formula", documento: "Team document",
      fuente_prim: "Primary source", sin_fuente: "No primary source cited in the documents: pending for the team.",
      calculado: "calculated", dato: "input", parametro: "parameter", editado: "edited", supuesto: "assumption", documento_b: "document",
      control_ok: "Matches the joint report v7 (Table 3.4.1): ", control_dif: "Differs from the joint report v7 because you changed the year or a parameter: ",
      valor_doc: "Value in the document", defecto: "default", zona: "Zone", municipio: "Municipality", pob31: "Population 2031",
      fijo_res: "Fixed resid.", empresa: "Business", movil: "Mobile", voz: "Voice", total: "Total DL", suma: "Sum",
      dia: "Day type", ambito: "Scope", todo: "Whole network", hora: "Hour", pico: "Peak", hora_pico: "Peak hour",
      ocup: "Max. occupancy", enlace: "Busiest link", servida: "Served", modelo: "Model",
      prediccion: "Before looking: how many Gbit/s do you think are saved at the peak compared with the coincident busy hour? Check it by hovering over the chart.",
      calculando: "Computing…", gbps: "Gbit/s", tabla_modelos: "Summary per model (daily peak)",
      nota_mun: "Voice = VoNR + fixed voice. Special services (stadium, hospital…) are not split by municipality: see “Special services”.",
      zonas: { C: "Centre", N: "North", E: "East", S: "South" }
    }
  };
  // Nombres de pasos que no tienen magnitud con el mismo id en calculos.json
  var NOMBRES = {
    P_tot: ["Población total", "Total population"], H_tot: ["Hogares totales", "Total households"],
    E_tot: ["Empresas totales", "Total businesses"], w: ["Peso de la zona", "Zone weight"],
    If: ["Internet fijo con reserva", "Fixed Internet with reserve"], Im: ["Internet móvil con reserva", "Mobile Internet with reserve"],
    esp: ["Servicios especiales de la zona", "Zone special services"], D: ["Demanda total de la zona", "Total zone demand"],
    radio_cap: ["Capacidad radio necesaria", "Required radio capacity"],
    P25: ["Población 2025", "Population 2025"], P31: ["Población 2031", "Population 2031"],
    H25: ["Hogares 2025", "Households 2025"], E25: ["Empresas 2025", "Businesses 2025"]
  };

  // ---------- estado ----------
  var lang = leer("noc.lang") || leer("dem.lang") || "es";
  var REF = leer("noc.modo") !== "lab";   // REF: parámetros bloqueados y año 2031 (CONTRATO_UI)
  var anio = 2031;
  var P = MD.copia(MD.PARAMETROS_DEFECTO);
  var editados = {};
  if (!REF) try { var g = JSON.parse(leer("dem.params") || "{}"); Object.keys(g).forEach(function (k) { if (k in P) { P[k] = g[k]; editados[k] = true; } }); } catch (e) { /* sin estado */ }
  var R = null;                       // resultado de ModeloDemanda.calcular
  var R31 = MD.calcular(MD.PARAMETROS_DEFECTO, { anio: 2031 });
  var actual = "IP_tot", migas = [];
  var dia = "laborable", ambito = "", ocultos = {};

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function t(k) { return T[lang][k]; }
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function fmt(x, dec) {
    if (typeof x !== "number" || !isFinite(x)) return "—";
    if (dec === undefined) { var a = Math.abs(x); dec = a >= 1000 ? 0 : a >= 100 ? 1 : a >= 1 ? 2 : a >= 0.01 ? 3 : 5; }
    return x.toLocaleString(lang === "es" ? "es-ES" : "en-GB", { minimumFractionDigits: 0, maximumFractionDigits: dec });
  }
  function fmtValor(v, unidad) {
    if (v && typeof v === "object") return fmt(v.DL) + " / " + fmt(v.UL) + (unidad ? " " + unidad : "") + " <small>(DL / UL)</small>";
    return fmt(v) + (unidad ? " <small>" + esc(unidad) + "</small>" : "");
  }
  function tex(el, s) {
    if (window.katex) { try { katex.render(s, el, { throwOnError: false, displayMode: false }); return; } catch (e) { /* cae a texto */ } }
    el.textContent = s;
  }

  // ---------- resolución de identificadores ----------
  function magDe(id) {
    var c = [id, id + "31", id.replace(/_([CNES])$/, "31_$1")];
    for (var i = 0; i < c.length; i++) if (MAG[c[i]]) return MAG[c[i]];
    return null;
  }
  function nombre(id) {
    var m = magDe(id);
    if (m) return lang === "es" ? m.nombre_es : (m.nombre_en || m.nombre_es);
    var z = id.match(/^(.*)_([CNES])$/), base = z ? z[1] : id;
    var n = NOMBRES[base];
    if (n) return n[lang === "es" ? 0 : 1] + (z ? " · " + T[lang].zonas[z[2]] : "");
    return id;
  }
  // Valor de un identificador: paso calculado, parámetro (también por zona: P25_C) o dato del documento
  function valorDe(id) {
    if (R.pasos[id]) return R.pasos[id].valor;
    if (typeof P[id] === "number") return P[id];
    var z = id.match(/^(P25|P31|H25|E25)_([CNES])$/);
    if (z && P[z[1]]) return P[z[1]][z[2]];
    var tt = id.match(/^(P25|P31|H25|E25)_tot$/);
    if (tt && P[tt[1]]) return ZN.reduce(function (s, k) { return s + P[tt[1]][k]; }, 0);
    return MAG[id] ? MAG[id].valor : null;
  }
  function clase(id) {
    if (R.pasos[id]) return "paso";
    if (id in P || /^(P25|P31|H25|E25)_/.test(id)) return "param";
    return MAG[id] ? "dato" : "nada";
  }
  var USADO = {};
  function indexar() {
    USADO = {};
    R.orden.forEach(function (id) { R.pasos[id].entradas.forEach(function (e) { (USADO[e] = USADO[e] || []).push(id); }); });
    Object.keys(MAG).forEach(function (id) { (MAG[id].entradas || []).forEach(function (e) { if (!R.pasos[id]) (USADO[e] = USADO[e] || []).push(id); }); });
  }

  // ---------- cálculo ----------
  function recalcular() {
    R = MD.calcular(P, { anio: anio, lang: lang });
    indexar();
    var hay = Object.keys(editados).length > 0;
    if (RED) RED.demanda = hay ? { parametros: P } : null;
    pintarResumen(); pintarArbol(); pintarDetalle(); pintarParametros(); pintarMunicipios(); programarModelos();
  }

  // ---------- resumen ----------
  function pintarResumen() {
    var fichas = [["IP_tot", "Total IP"], ["Inet_tot", "Internet"], ["especiales_tot", null], ["BNG", "BNG"], ["UPF_central", "UPF"], ["radio_cap", null]];
    $("#fichas").innerHTML = fichas.map(function (f) {
      var v = R.pasos[f[0]].valor;
      return '<div class="ficha" data-ir="' + f[0] + '" tabindex="0"><div class="et">' + esc(f[1] || nombre(f[0])) + '</div>' +
        '<div class="v">' + fmt(v.DL, 0) + ' <small>Gbit/s DL</small></div><div class="ul">UL ' + fmt(v.UL, 0) + '</div></div>';
    }).join("");
    var mz = (DEM.memoria_v7 && DEM.memoria_v7.demanda_zonas) || [];
    var difs = mz.filter(function (z) { return R.pasos["D_" + z.zona]; }).map(function (z) {
      var d = R.pasos["D_" + z.zona].valor;
      return { z: z.zona, ed: (d.DL - z.total_DL) / z.total_DL, doc: z.total_DL, v: d.DL };
    });
    var max = difs.reduce(function (m, d) { return Math.max(m, Math.abs(d.ed)); }, 0);
    var c = $("#control"), ok = max < 0.002;
    c.className = "control" + (ok ? "" : " dif");
    c.innerHTML = (ok ? "✓ " + t("control_ok") : "△ " + t("control_dif")) + difs.map(function (d) {
      return T[lang].zonas[d.z] + " " + fmt(d.v, 1) + (ok ? "" : " (" + (d.ed >= 0 ? "+" : "") + fmt(d.ed * 100, 1) + " %)");
    }).join(" · ") + " Gbit/s DL";
  }

  // ---------- árbol ----------
  function grupos() {
    var g = [
      ["g_pob", ["P_C", "P_N", "P_E", "P_S", "P_tot", "H_tot", "E_tot", "w_C", "w_N", "w_E", "w_S"]],
      ["g_parque", ["Lmk", "Nf", "Nm", "Nd", "Nb"]],
      ["g_vol", ["Vf", "Vm", "Rf", "Rm", "Q_VoNR", "VF_RTP"]]
    ];
    ZN.forEach(function (z) {
      g.push(["g_zona", ["Rf_", "Rm_", "If_", "Im_", "Inet_", "VoNR_", "VF_", "esp_", "D_"].map(function (p) { return p + z; }), z]);
    });
    g.push(["g_esp", ["estadio", "hospital", "v2x", "sensores_vb", "camaras_vb", "industria"]]);
    g.push(["g_tot", ["Inet_tot", "especiales_tot", "A111_tot", "IP_tot", "BNG", "UPF_central", "radio_cap"]]);
    return g;
  }
  var abiertos = { g_tot: true };
  function pintarArbol() {
    $("#arbol").innerHTML = grupos().map(function (g) {
      var clave = g[0] + (g[2] || ""), tit = t(g[0]) + (g[2] ? " " + T[lang].zonas[g[2]] : "");
      var contiene = g[1].indexOf(actual) >= 0;
      return '<details data-g="' + clave + '"' + (abiertos[clave] || contiene ? " open" : "") + '><summary>' + esc(tit) + '</summary>' +
        g[1].filter(function (id) { return R.pasos[id]; }).map(function (id) {
          var v = R.pasos[id].valor, n = typeof v === "object" ? v.DL : v;
          return '<button data-ir="' + id + '"' + (id === actual ? ' aria-current="true"' : "") + '><span>' + esc(nombre(id)) +
            '</span><span class="num">' + fmt(n) + '</span></button>';
        }).join("") + '</details>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#arbol details"), function (d) {
      d.addEventListener("toggle", function () { abiertos[d.dataset.g] = d.open; });
    });
  }

  // ---------- detalle ----------
  function chip(id) {
    var c = clase(id), v = valorDe(id), n = v && typeof v === "object" ? v.DL : v;
    var ed = editados[id] ? " editado" : "";
    return '<span class="chip' + (c === "paso" ? "" : " param") + ed + '" data-ir="' + id + '" tabindex="0">' + esc(nombre(id)) +
      ' <span class="num">' + fmt(n) + '</span></span>';
  }
  function fuenteHTML(m) {
    if (!m) return "";
    var h = "";
    if (m.fuente_doc) h += '<div class="lbl">' + t("documento") + '</div><div class="fuente" style="border-left-color:var(--txt3)"><span class="t">' +
      esc(m.fuente_doc.doc.split("/").pop()) + '</span> <span class="d">' + esc(m.fuente_doc.seccion || "") + '</span></div>';
    var f = m.fuente_primaria && FUE[m.fuente_primaria];
    if (f) {
      h += '<div class="lbl">' + t("fuente_prim") + '</div><div class="fuente"><span class="t">' + esc(f.organismo) + " · " + esc(f.titulo) + '</span>' +
        ' <span class="d">' + esc(f.tabla_o_seccion || "") + (f.anio ? " (" + f.anio + ")" : "") + '</span>' +
        (f.url ? '<div><a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.url) + '</a></div>' : "") + '</div>';
    } else if (m.tipo === "dato" || m.tipo === "parametro" || !m.formula) {
      h += '<div class="fuente sin">' + t("sin_fuente") + '</div>';
    }
    return h;
  }
  function pintarDetalle() {
    var id = actual, c = clase(id), m = magDe(id), h = "";
    h += '<div class="migas">' + migas.slice(-6).map(function (x) { return '<button data-ir="' + x + '">' + esc(nombre(x)) + '</button> ›'; }).join(" ") + '</div>';
    var badge = c === "paso" ? '<span class="badge b-calc">' + t("calculado") + '</span>' :
      c === "param" ? '<span class="badge ' + (editados[id] ? "b-sup" : "b-doc") + '">' + (editados[id] ? t("editado") : t("parametro")) + '</span>' :
        '<span class="badge b-doc">' + t("dato") + '</span>';
    if (m && m.fuente_primaria) badge += '<span class="badge b-fuente">' + esc(m.fuente_primaria.split("_")[0]) + '</span>';
    h += '<h4>' + esc(nombre(id)) + badge + '</h4><div class="sub">' + esc(id) + (m && m.simbolo ? " · " + esc(m.simbolo) : "") + ' · ' + anio + '</div>';
    var v = valorDe(id), paso = R.pasos[id];
    h += '<div class="valor-grande">' + fmtValor(v, paso ? paso.unidad : (m && m.unidad)) + '</div>';
    if (paso) {
      h += '<div class="lbl">' + t("formula") + '</div><div class="formula"><div id="f-tex"></div><div class="sust" id="f-sust"></div></div>';
    } else if (m && m.formula) {
      h += '<div class="lbl">' + t("formula") + '</div><div class="formula"><div class="mono">' + esc(m.formula) + '</div>' +
        (m.valores_sustituidos ? '<div class="sust mono">' + esc(m.valores_sustituidos) + '</div>' : "") + '</div>';
    }
    if (paso && m && anio === 2031 && !Object.keys(editados).length) {
      var dv = m.valor, a = typeof v === "object" ? v.DL : v, b = dv && typeof dv === "object" ? dv.DL : dv;
      if (typeof a === "number" && typeof b === "number") {
        var e = Math.abs(a - b) / Math.max(1e-9, Math.abs(b));
        h += '<div class="nota">' + t("valor_doc") + ': <span class="mono">' + fmt(b) + '</span> ' + (e < 0.005 ? "✓" : "△ " + fmt(e * 100, 2) + " %") + '</div>';
      }
    }
    var ent = paso ? paso.entradas : (m && m.entradas) || [];
    if (ent.length) h += '<div class="lbl">' + t("depende") + '</div><div class="chips">' + ent.map(chip).join("") + '</div>';
    if (c === "param" && id in P && typeof P[id] === "number") {
      var ed = MD.EDITABLES.filter(function (x) { return x.k === id; })[0];
      if (ed) h += '<div class="lbl">' + t("parametro") + '</div><div class="ctl"><input type="range" id="p-rango" min="' + ed.min + '" max="' + ed.max +
        '" step="' + ed.paso + '" value="' + P[id] + '"><span class="mono">' + fmt(P[id], 4) + '</span><span class="nota">' + t("defecto") + ' ' +
        fmt(MD.PARAMETROS_DEFECTO[id], 4) + '</span></div>';
    }
    h += fuenteHTML(m);
    var us = (USADO[id] || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
    if (us.length) h += '<div class="lbl">' + t("usado") + '</div><div class="chips">' + us.map(chip).join("") + '</div>';
    $("#detalle").innerHTML = h;
    if (paso) { tex($("#f-tex"), paso.tex); tex($("#f-sust"), paso.sust); }
    var rg = $("#p-rango");
    if (rg && REF) rg.disabled = true;
    if (rg) rg.addEventListener("input", function () { cambiarParam(id, parseFloat(rg.value)); });
  }
  function ir(id, sinMiga) {
    if (!id || clase(id) === "nada") return;
    if (!sinMiga && actual !== id) { migas.push(actual); if (migas.length > 30) migas.shift(); }
    actual = id;
    pintarArbol(); pintarDetalle();
    if (window.innerWidth < 1100) $("#detalle").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- parámetros ----------
  function pintarParametros() {
    $("#params").innerHTML = MD.EDITABLES.map(function (x) {
      var ed = editados[x.k];
      return '<div class="param' + (ed ? " editado" : "") + '"><div class="fila"><span class="nom" data-ir="' + x.k + '">' + esc(nombre(x.k)) + '</span>' +
        '<input type="number"' + (REF ? " disabled" : "") + ' data-p="' + x.k + '" min="' + x.min + '" max="' + x.max + '" step="' + x.paso + '" value="' + P[x.k] + '"></div>' +
        '<div class="def">' + esc(x.k) + ' · ' + t("defecto") + ' ' + fmt(MD.PARAMETROS_DEFECTO[x.k], 4) + '</div></div>';
    }).join("");
  }
  var tParam = null;
  function cambiarParam(k, v) {
    if (REF || !isFinite(v)) return;
    P[k] = v;
    if (v === MD.PARAMETROS_DEFECTO[k]) delete editados[k]; else editados[k] = true;
    var g = {}; Object.keys(editados).forEach(function (x) { g[x] = P[x]; });
    guardar("dem.params", JSON.stringify(g));
    clearTimeout(tParam);
    tParam = setTimeout(recalcular, 120);
  }

  // ---------- municipios ----------
  function pintarMunicipios() {
    var cr = Mo && RED ? Mo.crecimiento(RED, anio) : null;
    var AREA = { C: "C", N: "N", E: "E", S: "S" };
    var filas = "", tot = [0, 0, 0, 0, 0];
    ZN.forEach(function (z) {
      var ms = DEM.municipios.filter(function (m) { return m.zona === z; });
      if (!ms.length) return;
      filas += '<tr class="zona"><td colspan="7">' + t("zona") + " " + T[lang].zonas[z] + '</td></tr>';
      ms.forEach(function (m) {
        var c = {};
        m.necesidades.forEach(function (n) { c[n.tipo] = (n.dl_gbps || 0) * (cr && cr[AREA[z]] && cr[AREA[z]][n.tipo] ? cr[AREA[z]][n.tipo] : 1); });
        var voz = (c["voz-ims"] || 0) + (c["voz-fija"] || 0), s = (c["residencial-fijo"] || 0) + (c.empresa || 0) + (c["movil-ebb"] || 0) + voz;
        tot[0] += c["residencial-fijo"] || 0; tot[1] += c.empresa || 0; tot[2] += c["movil-ebb"] || 0; tot[3] += voz; tot[4] += s;
        filas += '<tr><td class="txt">' + esc(m.nombre) + '</td><td class="txt">' + z + '</td><td>' + fmt(m.poblacion_2031, 0) + '</td><td>' +
          fmt(c["residencial-fijo"], 1) + '</td><td>' + fmt(c.empresa, 1) + '</td><td>' + fmt(c["movil-ebb"], 1) + '</td><td>' + fmt(voz, 2) + '</td><td>' + fmt(s, 1) + '</td></tr>';
      });
    });
    $("#municipios").innerHTML = '<thead><tr><th>' + t("municipio") + '</th><th>' + t("zona") + '</th><th>' + t("pob31") + '</th><th>' + t("fijo_res") +
      '</th><th>' + t("empresa") + '</th><th>' + t("movil") + '</th><th>' + t("voz") + '</th><th>' + t("total") + '</th></tr></thead><tbody>' + filas +
      '</tbody><tfoot><tr><td class="txt">' + t("suma") + '</td><td></td><td></td><td>' + fmt(tot[0], 1) + '</td><td>' + fmt(tot[1], 1) + '</td><td>' +
      fmt(tot[2], 1) + '</td><td>' + fmt(tot[3], 2) + '</td><td>' + fmt(tot[4], 1) + '</td></tr></tfoot>';
    // la colspan de la fila de zona tiene que cubrir 8 columnas
    Array.prototype.forEach.call(document.querySelectorAll("#municipios tr.zona td"), function (td) { td.colSpan = 8; });
  }

  // ---------- modelos de tráfico ----------
  var COLORES = { BH: "var(--s1)", P2: "var(--s2)", PM: "var(--s3)", NC: "var(--s4)", PEND: "var(--s5)" };
  var serie = null, tModelos = null;
  function modelosDef() { return ((RED && RED.modelos_trafico && RED.modelos_trafico.modelos) || []).slice().sort(function (a, b) { return a.orden - b.orden; }); }
  function programarModelos() {
    if (!RED || !Motor || !Mo) { $("#modelos-graf").innerHTML = '<p class="nota">red.js / motor.js / modelos.js no cargados.</p>'; return; }
    clearTimeout(tModelos);
    tModelos = setTimeout(calcularModelos, 60);
  }
  function sumaAmbito(res) {
    if (!ambito) return res.resumen.dl_total_gbps;
    return res.demandas.filter(function (d) { return d.zona === ambito; }).reduce(function (s, d) { return s + d.dl_gbps; }, 0);
  }
  function calcularModelos() {
    serie = {};
    modelosDef().forEach(function (m) {
      var pts = [], estado = [];
      if (m.hora_cargada) {
        var r = Motor.calcular(RED, { modelo: { id: m.id, anio: anio, dia: dia } });
        var v = sumaAmbito(r);
        for (var h = 0; h < 24; h++) { pts.push(v); estado.push(r.resumen); }
      } else {
        for (var h2 = 0; h2 < 24; h2++) {
          var r2 = Motor.calcular(RED, { modelo: { id: m.id, anio: anio, dia: dia }, hora: h2 });
          pts.push(sumaAmbito(r2)); estado.push(r2.resumen);
        }
      }
      serie[m.id] = { def: m, pts: pts, estado: estado };
    });
    pintarGrafica(); pintarTablaModelos();
  }
  var W = 760, H = 300, M = { l: 52, r: 64, t: 12, b: 30 };
  function pintarGrafica() {
    var ids = Object.keys(serie).filter(function (k) { return !ocultos[k]; });
    var max = 0;
    ids.forEach(function (k) { serie[k].pts.forEach(function (v) { if (v > max) max = v; }); });
    max = niceMax(max || 1);
    var x = function (h) { return M.l + (W - M.l - M.r) * h / 23; }, y = function (v) { return H - M.b - (H - M.t - M.b) * v / max; };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t("modelos")) + '">';
    for (var i = 0; i <= 4; i++) {
      var gv = max * i / 4;
      s += '<line x1="' + M.l + '" x2="' + (W - M.r) + '" y1="' + y(gv) + '" y2="' + y(gv) + '" stroke="var(--borde)" stroke-width="1"/>' +
        '<text x="' + (M.l - 6) + '" y="' + (y(gv) + 4) + '" fill="var(--txt3)" font-size="11" text-anchor="end" font-family="var(--mono)">' + fmt(gv, 0) + '</text>';
    }
    for (var hh = 0; hh < 24; hh += 3) s += '<text x="' + x(hh) + '" y="' + (H - 10) + '" fill="var(--txt3)" font-size="11" text-anchor="middle" font-family="var(--mono)">' + hh + 'h</text>';
    s += '<text x="' + M.l + '" y="' + (M.t + 2) + '" fill="var(--txt3)" font-size="11" dy="-2">Gbit/s DL</text>';
    var etiquetas = [];
    ids.forEach(function (k) {
      var d = serie[k].pts.map(function (v, h) { return (h ? "L" : "M") + x(h).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
      var plano = serie[k].def.hora_cargada;
      s += '<path d="' + d + '" fill="none" stroke="' + COLORES[k] + '" stroke-width="2" stroke-linejoin="round"' + (plano ? ' stroke-dasharray="6 4"' : "") + '/>';
      etiquetas.push({ k: k, y: y(serie[k].pts[23]) });
    });
    // etiquetas directas al final, separadas para que no se pisen
    etiquetas.sort(function (a, b) { return a.y - b.y; });
    for (var j = 1; j < etiquetas.length; j++) if (etiquetas[j].y - etiquetas[j - 1].y < 13) etiquetas[j].y = etiquetas[j - 1].y + 13;
    etiquetas.forEach(function (e) { s += '<text x="' + (W - M.r + 6) + '" y="' + (e.y + 4) + '" fill="var(--txt2)" font-size="11" font-family="var(--mono)">' + e.k + '</text>'; });
    s += '<line id="cruz" y1="' + M.t + '" y2="' + (H - M.b) + '" stroke="var(--txt3)" stroke-width="1" visibility="hidden"/>';
    s += '<rect id="zona-hover" x="' + M.l + '" y="' + M.t + '" width="' + (W - M.l - M.r) + '" height="' + (H - M.t - M.b) + '" fill="transparent"/></svg>';
    var ley = modelosDef().map(function (m) {
      return '<span data-serie="' + m.id + '" class="' + (ocultos[m.id] ? "off" : "") + '"><i style="background:' + COLORES[m.id] + '"></i>' + m.id + " · " +
        esc(lang === "es" ? m.nombre_es : m.nombre_en) + '</span>';
    }).join("");
    $("#modelos-graf").innerHTML = '<div class="leyenda">' + ley + '</div>' + s + '<div class="tip" id="tip"></div>';
    var svg = $("#modelos-graf svg"), zona = $("#zona-hover"), tip = $("#tip"), cruz = $("#cruz");
    function mover(ev) {
      var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
      var h = Math.max(0, Math.min(23, Math.round((px - M.l) / (W - M.l - M.r) * 23)));
      cruz.setAttribute("x1", x(h)); cruz.setAttribute("x2", x(h)); cruz.setAttribute("visibility", "visible");
      var filas = ids.slice().sort(function (a, b) { return serie[b].pts[h] - serie[a].pts[h]; }).map(function (k) {
        return '<div class="r"><span><i style="background:' + COLORES[k] + '"></i>' + k + '</span><span>' + fmt(serie[k].pts[h], 0) + '</span></div>';
      }).join("");
      tip.innerHTML = '<div class="h">' + t("hora") + " " + h + ':00 · ' + t("gbps") + '</div>' + filas;
      tip.style.display = "block";
      var cont = $("#modelos-graf").getBoundingClientRect(), left = ev.clientX - cont.left + 14;
      if (left + 190 > cont.width) left = ev.clientX - cont.left - 200;
      tip.style.left = left + "px"; tip.style.top = (ev.clientY - cont.top + 10) + "px";
    }
    zona.addEventListener("mousemove", mover);
    zona.addEventListener("mouseleave", function () { tip.style.display = "none"; cruz.setAttribute("visibility", "hidden"); });
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
  function pintarTablaModelos() {
    var bh = serie.BH ? Math.max.apply(null, serie.BH.pts) : null;
    var filas = modelosDef().map(function (m) {
      var s = serie[m.id], hp = 0;
      s.pts.forEach(function (v, h) { if (v > s.pts[hp]) hp = h; });
      var e = s.estado[hp], pico = s.pts[hp];
      return '<tr><td class="txt"><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + COLORES[m.id] + ';margin-right:6px"></i>' + m.id +
        ' <span class="badge ' + (m.origen === "documento" ? "b-doc" : "b-sup") + '">' + (m.origen === "documento" ? t("documento_b") : t("supuesto")) + '</span></td>' +
        '<td>' + fmt(pico, 0) + (bh && m.id !== "BH" ? ' <span style="color:var(--txt3)">(' + (pico >= bh ? "+" : "") + fmt((pico / bh - 1) * 100, 0) + ' %)</span>' : "") + '</td>' +
        '<td>' + (m.hora_cargada ? "—" : hp + ":00") + '</td><td>' + fmt(e.max_ocupacion * 100, 0) + ' %</td><td>' + fmt(e.pct_servida, 1) + ' %</td>' +
        '<td class="txt mono" style="font-size:11px">' + esc(e.enlace_max || "") + '</td></tr>';
    }).join("");
    $("#tabla-modelos").innerHTML = '<thead><tr><th>' + t("modelo") + '</th><th>' + t("pico") + ' Gbit/s</th><th>' + t("hora_pico") + '</th><th>' + t("ocup") +
      '</th><th>' + t("servida") + '</th><th>' + t("enlace") + '</th></tr></thead><tbody>' + filas + '</tbody>';
    var sel = modelosDef().map(function (m) {
      return '<div style="margin-bottom:10px"><h4>' + m.id + " · " + esc(lang === "es" ? m.nombre_es : m.nombre_en) +
        ' <span class="badge ' + (m.origen === "documento" ? "b-doc" : "b-sup") + '">' + (m.origen === "documento" ? t("documento_b") : t("supuesto")) + '</span></h4>' +
        '<p>' + esc(lang === "es" ? m.desc_es : m.desc_en) + '</p><p class="nota">' + esc(m.fuente) + '</p></div>';
    }).join("");
    $("#desc-modelos").innerHTML = sel + '<div class="pregunta">' + t("prediccion") + '</div>';
  }

  // ---------- textos fijos e idioma ----------
  function pintarTextos() {
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll("[data-t]"), function (el) { el.textContent = t(el.dataset.t); });
    Array.prototype.forEach.call(document.querySelectorAll(".seg [data-lang]"), function (b) { b.setAttribute("aria-pressed", b.dataset.lang === lang); });
    document.body.classList.toggle("m-ref", REF); document.body.classList.toggle("m-lab", !REF);
    Array.prototype.forEach.call(document.querySelectorAll("[data-modo]"), function (b) { b.setAttribute("aria-pressed", (b.dataset.modo === "ref") === REF); });
    $("#anio").disabled = REF; $("#reset").disabled = REF;
    $("#rotulo-modo").innerHTML = '<b>' + (REF ? "REF" : "LAB") + '</b> ' + esc(t(REF ? "m_ref_rot" : "m_lab_rot"));
    var ds = (RED && RED.modelos_trafico && RED.modelos_trafico.tipos_dia) || {};
    $("#sel-dia").innerHTML = Object.keys(ds).filter(function (k) { return k[0] !== "_"; }).map(function (k) {
      return '<option value="' + k + '"' + (k === dia ? " selected" : "") + '>' + esc(lang === "es" ? ds[k].nombre_es : ds[k].nombre_en) + '</option>';
    }).join("");
    $("#sel-ambito").innerHTML = '<option value="">' + t("todo") + '</option>' + DEM.municipios.map(function (m) {
      return '<option value="' + m.id + '"' + (m.id === ambito ? " selected" : "") + '>' + esc(m.nombre) + '</option>';
    }).join("");
  }

  // ---------- eventos ----------
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-ir]");
    if (el) { ir(el.dataset.ir); return; }
    var sl = ev.target.closest("[data-serie]");
    if (sl) { var k = sl.dataset.serie; if (ocultos[k]) delete ocultos[k]; else ocultos[k] = true; pintarGrafica(); return; }
    var lb = ev.target.closest("[data-lang]");
    if (lb) { lang = lb.dataset.lang; guardar("noc.lang", lang); guardar("dem.lang", lang); pintarTextos(); recalcular(); return; }
    var mb = ev.target.closest("[data-modo]");
    if (mb && (mb.dataset.modo === "lab") === REF) { guardar("noc.modo", mb.dataset.modo); location.reload(); }
  });
  document.addEventListener("keydown", function (ev) {
    if ((ev.key === "Enter" || ev.key === " ") && ev.target.dataset && ev.target.dataset.ir) { ev.preventDefault(); ir(ev.target.dataset.ir); }
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.dataset && ev.target.dataset.p) cambiarParam(ev.target.dataset.p, parseFloat(ev.target.value));
  });
  $("#anio").addEventListener("input", function () { if (REF) return; anio = parseInt(this.value, 10); $("#anio-v").textContent = anio; recalcular(); });
  $("#reset").addEventListener("click", function () { if (REF) return; P = MD.copia(MD.PARAMETROS_DEFECTO); editados = {}; guardar("dem.params", "{}"); recalcular(); });
  $("#sel-dia").addEventListener("change", function () { dia = this.value; programarModelos(); });
  $("#sel-ambito").addEventListener("change", function () { ambito = this.value; programarModelos(); });

  pintarTextos();
  recalcular();
})();
