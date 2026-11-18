// modelo_demanda.js — cadena de cálculo de la demanda (INE/CNMC → Gbit/s), reimplementada paso a paso.
// Reproduce las fórmulas del grupo 3.2 (G32_Calculos_Dimensionamiento_2025_2031, memoria conjunta v7 §3 y A4-A11)
// con los mismos identificadores que datos/f0/calculos.json, para poder enlazar cada paso con su fuente.
//
//   ModeloDemanda.calcular(P, { anio: 2031, lang: "es" })  ->  { pasos: {id: paso}, orden: [ids], anio }
//   paso = { id, tex, sust, valor, unidad, entradas: [ids] }   (valor: número o {DL, UL})
//
// P = parámetros (ModeloDemanda.PARAMETROS_DEFECTO o los editados en la página). El año mueve la proyección:
//   población P_z(Y) = P_z,2025 + (P_z,2031 − P_z,2025)·(Y−2025)/6  (la proyección del 3.2 es lineal en n: P·(1+n·b/P_padrón))
//   volumen V(Y) = V_2025·(1+g)^(Y−2025)
// Los servicios especiales (estadio, hospital…) no cambian con el año (supuesto del simulador).
(function (root) {
  "use strict";

  var ZONAS = ["C", "N", "E", "S"];

  // Valores por defecto = los del documento (ver datos/f0/calculos.json; id entre corchetes cuando difiere)
  var PARAMETROS_DEFECTO = {
    P25: { C: 3477497, N: 182421, E: 349627, S: 760170 },          // [P25_C…] INE ECP 2025
    P31: { C: 3663025, N: 194748, E: 363077, S: 774882 },          // [P31_C…] proyección 3.2 (padrón 2015-25)
    P31_tot: 4995732.7636,                                          // con decimales (el doc usa este)
    H25: { C: 1390999, N: 61605, E: 127546, S: 287104 },           // [H25_C…] Σ P_i / s_i (INE ADRH)
    E25: { C: 297693, N: 14209, E: 16369, S: 38099 },              // Σ E25_i por zona (INE DIRCE)
    pen_fijo_hog: 0.622, lin_empresa: 1.5,
    cuota_vf: 0.418, cuota_tm: 0.258, cuota_im: 0.247, cuota_if: 0.307,
    ratio_tm: 1.307, ratio_im: 1.184, ratio_if: 0.404,
    Vm25: 14.6, gm: 0.129, Vf25: 356, gf: 0.078,
    fBH: 0.10, mes: 30, reserva: 1.25,
    split_f: 0.90, split_m: 0.85,
    A_lin: 0.3, r_IMS: 0.128, r_VoNR: 0.04,
    u_norm: 0.70, u_pico: 0.90, pico2: 2,
    // servicios especiales (fórmulas de calculos.json: estadio, hospital, v2x, sensores_vb, camaras_vb, industria)
    estadio_users: 50000, estadio_rDL: 2.635, estadio_rUL: 1.42,    // Mbit/s medios por usuario (mezcla de apps)
    hosp_DL: 0.4, hosp_UL: 0.482,                                   // Gbit/s
    v2x_veh: 1000, v2x_B: 300, v2x_hz: 10, v2x_k: 1.5,
    sens_n1: 80000, sens_B1: 200, sens_T1: 900, sens_n2: 15000, sens_B2: 500, sens_T2: 60, sens_k: 1.5,
    cam_n: 5000, cam_r: 0.8,                                        // cámaras × Mbit/s
    ind_DL: 70, ind_UL: 160                                         // Mbit/s
  };

  // Ficha de cada parámetro editable: id del documento (para la fuente), rango para la página
  var EDITABLES = [
    { k: "pen_fijo_hog", ref: "pen_fijo_hog", min: 0.3, max: 1, paso: 0.001 },
    { k: "lin_empresa", ref: "lin_empresa", min: 0.5, max: 4, paso: 0.1 },
    { k: "cuota_vf", ref: "cuota_vf", min: 0.05, max: 0.8, paso: 0.001 },
    { k: "cuota_tm", ref: "cuota_tm", min: 0.05, max: 0.8, paso: 0.001 },
    { k: "cuota_im", ref: "cuota_im", min: 0.05, max: 0.8, paso: 0.001 },
    { k: "cuota_if", ref: "cuota_if", min: 0.05, max: 0.8, paso: 0.001 },
    { k: "ratio_tm", ref: "ratio_tm", min: 0.5, max: 2, paso: 0.001 },
    { k: "ratio_im", ref: "ratio_im", min: 0.5, max: 2, paso: 0.001 },
    { k: "ratio_if", ref: "ratio_if", min: 0.1, max: 1, paso: 0.001 },
    { k: "Vf25", ref: "Vf25", min: 50, max: 1000, paso: 1 },
    { k: "gf", ref: "gf", min: 0, max: 0.4, paso: 0.001 },
    { k: "Vm25", ref: "Vm25", min: 1, max: 100, paso: 0.1 },
    { k: "gm", ref: "gm", min: 0, max: 0.4, paso: 0.001 },
    { k: "fBH", ref: "fBH", min: 0.05, max: 0.15, paso: 0.005 },
    { k: "reserva", ref: "reserva", min: 1, max: 1.5, paso: 0.01 },
    { k: "split_f", ref: "split_f", min: 0.5, max: 1, paso: 0.01 },
    { k: "split_m", ref: "split_m", min: 0.5, max: 1, paso: 0.01 },
    { k: "A_lin", ref: "A_lin", min: 0.05, max: 0.6, paso: 0.01 },
    { k: "r_VoNR", ref: "r_VoNR", min: 0.01, max: 0.2, paso: 0.001 },
    { k: "r_IMS", ref: "r_IMS", min: 0.05, max: 0.2, paso: 0.001 },
    { k: "estadio_users", ref: "estadio_users", min: 10000, max: 80000, paso: 1000 }
  ];

  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  // Números en LaTeX: separador de miles fino y coma decimal (es) o punto (en)
  function num(x, dec, lang) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    if (dec === undefined) dec = Math.abs(x) >= 1000 ? 0 : Math.abs(x) >= 10 ? 2 : Math.abs(x) >= 1 ? 3 : 4;
    var s = x.toFixed(dec), neg = s[0] === "-";
    if (neg) s = s.slice(1);
    var p = s.split("."), ent = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
    var out = ent + (p[1] ? (lang === "en" ? "." : "{,}") + p[1].replace(/0+$/, "").replace(/^$/, "0") : "");
    if (p[1] && /^0+$/.test(p[1])) out = ent;
    return (neg ? "-" : "") + out;
  }

  function calcular(Pin, opciones) {
    opciones = opciones || {};
    var P = Pin || PARAMETROS_DEFECTO;
    var anio = opciones.anio || 2031, n = anio - 2025, L = opciones.lang || "es";
    var f = function (x, d) { return num(x, d, L); };
    var pasos = {}, orden = [];
    function paso(id, tex, sust, valor, unidad, entradas) {
      pasos[id] = { id: id, tex: tex, sust: sust, valor: valor, unidad: unidad, entradas: entradas || [] };
      orden.push(id);
      return valor;
    }
    var k = P.reserva;

    // --- 1. Población por zona y total en el año ---
    var Pz = {}, Hz = {}, Ez = {}, Ptot = 0, Htot = 0, Etot = 0, Ptot31 = 0;
    ZONAS.forEach(function (z) { Ptot31 += P.P31[z]; });
    var corr = P.P31_tot / Ptot31;  // el doc suma P31 con decimales; se reparte la diferencia proporcionalmente
    ZONAS.forEach(function (z) {
      var p31 = P.P31[z] * corr;
      Pz[z] = P.P25[z] + (p31 - P.P25[z]) * n / 6;
      paso("P_" + z, "P_{" + z + "}(" + anio + ") = P_{" + z + ",2025} + (P_{" + z + ",2031} - P_{" + z + ",2025})\\cdot\\frac{" + n + "}{6}",
        f(P.P25[z]) + " + (" + f(p31) + " - " + f(P.P25[z]) + ")\\cdot\\frac{" + n + "}{6} = " + f(Pz[z]),
        Pz[z], "hab", ["P25_" + z, "P31_" + z]);
      Hz[z] = P.H25[z] * Pz[z] / P.P25[z];
      Ez[z] = P.E25[z] * Pz[z] / P.P25[z];
      Ptot += Pz[z]; Htot += Hz[z]; Etot += Ez[z];
    });
    paso("P_tot", "P = \\sum_z P_z", ZONAS.map(function (z) { return f(Pz[z]); }).join(" + ") + " = " + f(Ptot), Ptot, "hab",
      ZONAS.map(function (z) { return "P_" + z; }));
    paso("H_tot", "H = \\sum_z H_{z,2025}\\cdot\\frac{P_z}{P_{z,2025}}", "= " + f(Htot), Htot, "hogares", ["H25_tot", "P_tot"]);
    paso("E_tot", "E = \\sum_z E_{z,2025}\\cdot\\frac{P_z}{P_{z,2025}}", "= " + f(Etot), Etot, "empresas", ["E25_tot", "P_tot"]);
    var w = {};
    ZONAS.forEach(function (z) {
      w[z] = Pz[z] / Ptot;
      paso("w_" + z, "w_{" + z + "} = P_{" + z + "} / P", f(Pz[z]) + " / " + f(Ptot) + " = " + f(w[z], 6), w[z], "-", ["P_" + z, "P_tot"]);
    });

    // --- 2. Parque de Operador 1 ---
    var Lmk = paso("Lmk", "L = p_{hf}\\cdot H + l_E\\cdot E",
      f(P.pen_fijo_hog, 3) + "\\cdot " + f(Htot) + " + " + f(P.lin_empresa, 1) + "\\cdot " + f(Etot) + " = " + f(P.pen_fijo_hog * Htot + P.lin_empresa * Etot),
      P.pen_fijo_hog * Htot + P.lin_empresa * Etot, "líneas", ["pen_fijo_hog", "H_tot", "lin_empresa", "E_tot"]);
    var Nf = paso("Nf", "N_f = L\\cdot c_{vf}", f(Lmk) + "\\cdot " + f(P.cuota_vf, 3) + " = " + f(Lmk * P.cuota_vf), Lmk * P.cuota_vf, "líneas", ["Lmk", "cuota_vf"]);
    var Nm = paso("Nm", "N_m = P\\cdot r_{tm}\\cdot c_{tm}", f(Ptot) + "\\cdot " + f(P.ratio_tm, 3) + "\\cdot " + f(P.cuota_tm, 3) + " = " + f(Ptot * P.ratio_tm * P.cuota_tm),
      Ptot * P.ratio_tm * P.cuota_tm, "líneas", ["P_tot", "ratio_tm", "cuota_tm"]);
    var Nd = paso("Nd", "N_d = P\\cdot r_{im}\\cdot c_{im}", f(Ptot) + "\\cdot " + f(P.ratio_im, 3) + "\\cdot " + f(P.cuota_im, 3) + " = " + f(Ptot * P.ratio_im * P.cuota_im),
      Ptot * P.ratio_im * P.cuota_im, "líneas", ["P_tot", "ratio_im", "cuota_im"]);
    var Nb = paso("Nb", "N_b = P\\cdot r_{if}\\cdot c_{if}", f(Ptot) + "\\cdot " + f(P.ratio_if, 3) + "\\cdot " + f(P.cuota_if, 3) + " = " + f(Ptot * P.ratio_if * P.cuota_if),
      Ptot * P.ratio_if * P.cuota_if, "accesos", ["P_tot", "ratio_if", "cuota_if"]);

    // --- 3. Volumen por usuario y tasa en hora cargada ---
    var Vf = paso("Vf", "V_f = V_{f,2025}\\cdot(1+g_f)^{" + n + "}", f(P.Vf25, 1) + "\\cdot " + f(1 + P.gf, 3) + "^{" + n + "} = " + f(P.Vf25 * Math.pow(1 + P.gf, n)),
      P.Vf25 * Math.pow(1 + P.gf, n), "GB/mes", ["Vf25", "gf"]);
    var Vm = paso("Vm", "V_m = V_{m,2025}\\cdot(1+g_m)^{" + n + "}", f(P.Vm25, 1) + "\\cdot " + f(1 + P.gm, 3) + "^{" + n + "} = " + f(P.Vm25 * Math.pow(1 + P.gm, n)),
      P.Vm25 * Math.pow(1 + P.gm, n), "GB/mes", ["Vm25", "gm"]);
    var den = P.mes * 3600;
    var Rf = paso("Rf", "R_f = \\frac{N_b\\cdot V_f\\cdot 8\\cdot f_{BH}}{d\\cdot 3600}",
      "\\frac{" + f(Nb) + "\\cdot " + f(Vf) + "\\cdot 8\\cdot " + f(P.fBH, 2) + "}{" + f(P.mes, 0) + "\\cdot 3600} = " + f(Nb * Vf * 8 * P.fBH / den),
      Nb * Vf * 8 * P.fBH / den, "Gbit/s", ["Nb", "Vf", "fBH", "mes"]);
    var Rm = paso("Rm", "R_m = \\frac{N_d\\cdot V_m\\cdot 8\\cdot f_{BH}}{d\\cdot 3600}",
      "\\frac{" + f(Nd) + "\\cdot " + f(Vm) + "\\cdot 8\\cdot " + f(P.fBH, 2) + "}{" + f(P.mes, 0) + "\\cdot 3600} = " + f(Nd * Vm * 8 * P.fBH / den),
      Nd * Vm * 8 * P.fBH / den, "Gbit/s", ["Nd", "Vm", "fBH", "mes"]);

    // --- 4. Voz ---
    var Q = paso("Q_VoNR", "Q = 2\\cdot a\\cdot N_m\\cdot r_v", "2\\cdot " + f(P.A_lin, 2) + "\\cdot " + f(Nm) + "\\cdot " + f(P.r_VoNR, 3) + "/1000 = " + f(2 * P.A_lin * Nm * P.r_VoNR / 1000),
      2 * P.A_lin * Nm * P.r_VoNR / 1000, "Gbit/s", ["A_lin", "Nm", "r_VoNR"]);
    var VF = paso("VF_RTP", "V_F = a\\cdot N_f\\cdot r_{IMS}\\cdot k_r", f(P.A_lin, 2) + "\\cdot " + f(Nf) + "\\cdot " + f(P.r_IMS, 3) + "\\cdot " + f(k, 2) + "/1000 = " + f(P.A_lin * Nf * P.r_IMS * k / 1000),
      P.A_lin * Nf * P.r_IMS * k / 1000, "Gbit/s", ["A_lin", "Nf", "r_IMS", "reserva"]);

    // --- 5. Reparto por zona (por población) ---
    var I = {}, sumIdl = 0, sumIul = 0;
    ZONAS.forEach(function (z) {
      var rf = w[z] * Rf, rm = w[z] * Rm;
      paso("Rf_" + z, "R_{f," + z + "} = w_{" + z + "}\\cdot R_f", f(w[z], 6) + "\\cdot " + f(Rf) + " = " + f(rf), rf, "Gbit/s", ["w_" + z, "Rf"]);
      paso("Rm_" + z, "R_{m," + z + "} = w_{" + z + "}\\cdot R_m", f(w[z], 6) + "\\cdot " + f(Rm) + " = " + f(rm), rm, "Gbit/s", ["w_" + z, "Rm"]);
      var fdl = k * P.split_f * rf, ful = k * (1 - P.split_f) * rf, mdl = k * P.split_m * rm, mul = k * (1 - P.split_m) * rm;
      paso("If_" + z, "I_{f," + z + "} = k_r\\cdot(\\alpha_f;\\,1-\\alpha_f)\\cdot R_{f," + z + "}",
        f(k, 2) + "\\cdot(" + f(P.split_f, 2) + ";\\," + f(1 - P.split_f, 2) + ")\\cdot " + f(rf) + " = " + f(fdl) + " / " + f(ful),
        { DL: fdl, UL: ful }, "Gbit/s", ["reserva", "split_f", "Rf_" + z]);
      paso("Im_" + z, "I_{m," + z + "} = k_r\\cdot(\\alpha_m;\\,1-\\alpha_m)\\cdot R_{m," + z + "}",
        f(k, 2) + "\\cdot(" + f(P.split_m, 2) + ";\\," + f(1 - P.split_m, 2) + ")\\cdot " + f(rm) + " = " + f(mdl) + " / " + f(mul),
        { DL: mdl, UL: mul }, "Gbit/s", ["reserva", "split_m", "Rm_" + z]);
      I[z] = { DL: fdl + mdl, UL: ful + mul };
      paso("Inet_" + z, "I_{" + z + "} = I_{f," + z + "} + I_{m," + z + "}", f(fdl) + " + " + f(mdl) + " = " + f(I[z].DL) + "\\;/\\;" + f(I[z].UL),
        I[z], "Gbit/s", ["If_" + z, "Im_" + z]);
      paso("VoNR_" + z, "Q_{" + z + "} = k_r\\cdot w_{" + z + "}\\cdot Q", f(k, 2) + "\\cdot " + f(w[z], 6) + "\\cdot " + f(Q) + " = " + f(k * w[z] * Q),
        k * w[z] * Q, "Gbit/s", ["reserva", "w_" + z, "Q_VoNR"]);
      sumIdl += I[z].DL; sumIul += I[z].UL;
    });
    ZONAS.forEach(function (z) {
      var v = VF * I[z].DL / sumIdl;
      paso("VF_" + z, "V_{F," + z + "} = V_F\\cdot I_{" + z + ",DL} / \\sum I_{DL}", f(VF) + "\\cdot " + f(I[z].DL) + " / " + f(sumIdl) + " = " + f(v), v, "Gbit/s", ["VF_RTP", "Inet_" + z]);
    });

    // --- 6. Servicios especiales (sin crecimiento anual) ---
    var est = { DL: k * P.estadio_users * P.estadio_rDL / 1000, UL: k * P.estadio_users * P.estadio_rUL / 1000 };
    paso("estadio", "D_{est} = k_r\\cdot U\\cdot \\bar r", f(k, 2) + "\\cdot " + f(P.estadio_users) + "\\cdot(" + f(P.estadio_rDL, 3) + ";\\," + f(P.estadio_rUL, 2) + ")/1000 = " + f(est.DL) + " / " + f(est.UL),
      est, "Gbit/s", ["reserva", "estadio_users"]);
    var hos = { DL: k * P.hosp_DL, UL: k * P.hosp_UL };
    paso("hospital", "D_{hosp} = k_r\\cdot(D_{DL};\\,D_{UL})", f(k, 2) + "\\cdot(" + f(P.hosp_DL, 3) + ";\\," + f(P.hosp_UL, 3) + ") = " + f(hos.DL) + " / " + f(hos.UL), hos, "Gbit/s", ["reserva"]);
    var v2 = P.v2x_veh * P.v2x_B * 8 * P.v2x_hz * P.v2x_k * k / 1e9;
    paso("v2x", "D_{V2X} = N_v\\cdot B\\cdot 8\\cdot f\\cdot k_{s}\\cdot k_r", f(P.v2x_veh) + "\\cdot " + f(P.v2x_B) + "\\cdot 8\\cdot " + f(P.v2x_hz) + "\\cdot " + f(P.v2x_k, 1) + "\\cdot " + f(k, 2) + " = " + f(v2 * 1000) + "\\,\\text{Mbit/s}",
      { DL: v2, UL: v2 }, "Gbit/s", ["reserva"]);
    var se = (P.sens_n1 * P.sens_B1 * 8 / P.sens_T1 + P.sens_n2 * P.sens_B2 * 8 / P.sens_T2) * P.sens_k * k / 1e9;
    paso("sensores_vb", "D_{IoT} = \\left(\\frac{n_1 B_1 8}{T_1} + \\frac{n_2 B_2 8}{T_2}\\right)\\cdot k_s\\cdot k_r",
      "\\left(\\frac{" + f(P.sens_n1) + "\\cdot " + f(P.sens_B1) + "\\cdot 8}{" + f(P.sens_T1) + "} + \\frac{" + f(P.sens_n2) + "\\cdot " + f(P.sens_B2) + "\\cdot 8}{" + f(P.sens_T2) + "}\\right)\\cdot " + f(P.sens_k, 1) + "\\cdot " + f(k, 2) + " = " + f(se * 1000) + "\\,\\text{Mbit/s}",
      { DL: 0, UL: se }, "Gbit/s", ["reserva"]);
    var ca = P.cam_n * P.cam_r * k / 1000;
    paso("camaras_vb", "D_{cam} = n_c\\cdot r_c\\cdot k_r", f(P.cam_n) + "\\cdot " + f(P.cam_r, 1) + "\\cdot " + f(k, 2) + " = " + f(ca * 1000) + "\\,\\text{Mbit/s}", { DL: 0, UL: ca }, "Gbit/s", ["reserva"]);
    var ind = { DL: k * P.ind_DL / 1000, UL: k * P.ind_UL / 1000 };
    paso("industria", "D_{ind} = k_r\\cdot(D_{DL};\\,D_{UL})", f(k, 2) + "\\cdot(" + f(P.ind_DL) + ";\\," + f(P.ind_UL) + ")\\,\\text{Mbit/s} = " + f(ind.DL * 1000) + " / " + f(ind.UL * 1000) + "\\,\\text{Mbit/s}", ind, "Gbit/s", ["reserva"]);
    var esp = {
      C: { DL: est.DL, UL: est.UL + ca + se },   // cámaras y sensores solo suben (UL)
      N: { DL: 0, UL: 0 },
      E: { DL: v2, UL: v2 },
      S: { DL: hos.DL + ind.DL, UL: hos.UL + ind.UL }
    };
    ZONAS.forEach(function (z) {
      var ent = { C: ["estadio", "camaras_vb", "sensores_vb"], N: [], E: ["v2x"], S: ["hospital", "industria"] }[z];
      paso("esp_" + z, "S_{" + z + "} = \\sum \\text{especiales}_{" + z + "}", ent.length ? "= " + f(esp[z].DL) + " / " + f(esp[z].UL) : "\\text{ninguno}", esp[z], "Gbit/s", ent);
    });

    // --- 7. Totales por zona y globales ---
    var T = { DL: 0, UL: 0 }, A111 = { DL: 0, UL: 0 }, ESP = { DL: 0, UL: 0 }, QT = 0;
    ZONAS.forEach(function (z) {
      var q = pasos["VoNR_" + z].valor, vf = pasos["VF_" + z].valor;
      var d = { DL: I[z].DL + q + esp[z].DL, UL: I[z].UL + q + esp[z].UL };
      paso("D_" + z, "D_{" + z + "} = I_{" + z + "} + Q_{" + z + "} + S_{" + z + "}", f(I[z].DL) + " + " + f(q) + " + " + f(esp[z].DL) + " = " + f(d.DL) + "\\;/\\;" + f(d.UL),
        d, "Gbit/s", ["Inet_" + z, "VoNR_" + z, "esp_" + z]);
      T.DL += d.DL; T.UL += d.UL; ESP.DL += esp[z].DL; ESP.UL += esp[z].UL; QT += q;
      A111.DL += I[z].DL + q + vf; A111.UL += I[z].UL + q + vf;
    });
    paso("Inet_tot", "\\sum I_z", "= " + f(sumIdl) + "\\;/\\;" + f(sumIul), { DL: sumIdl, UL: sumIul }, "Gbit/s", ZONAS.map(function (z) { return "Inet_" + z; }));
    paso("especiales_tot", "\\sum S_z", "= " + f(ESP.DL) + "\\;/\\;" + f(ESP.UL), ESP, "Gbit/s", ZONAS.map(function (z) { return "esp_" + z; }));
    paso("A111_tot", "\\sum I_z + \\sum Q_z + V_F", f(sumIdl) + " + " + f(QT) + " + " + f(VF) + " = " + f(A111.DL) + "\\;/\\;" + f(A111.UL),
      A111, "Gbit/s", ["Inet_tot", "VF_RTP"].concat(ZONAS.map(function (z) { return "VoNR_" + z; })));
    paso("IP_tot", "D = \\sum D_z = \\sum I_z + \\sum Q_z + \\sum S_z", f(sumIdl) + " + " + f(QT) + " + " + f(ESP.DL) + " = " + f(T.DL) + "\\;/\\;" + f(T.UL),
      T, "Gbit/s", ZONAS.map(function (z) { return "D_" + z; }));

    // --- 8. Destinos funcionales y capacidad radio ---
    var bng = { DL: k * P.split_f * Rf, UL: k * (1 - P.split_f) * Rf };
    paso("BNG", "D_{BNG} = k_r\\cdot(\\alpha_f;\\,1-\\alpha_f)\\cdot R_f", f(k, 2) + "\\cdot(" + f(P.split_f, 2) + ";\\," + f(1 - P.split_f, 2) + ")\\cdot " + f(Rf) + " = " + f(bng.DL) + " / " + f(bng.UL), bng, "Gbit/s", ["reserva", "split_f", "Rf"]);
    var rdl = P.split_m * Rm + Q, rul = (1 - P.split_m) * Rm + Q;
    var upf = { DL: k * rdl, UL: k * rul };
    paso("UPF_central", "D_{UPF} = k_r\\cdot(\\alpha_m R_m + Q;\\,(1-\\alpha_m) R_m + Q)", f(k, 2) + "\\cdot(" + f(rdl) + ";\\," + f(rul) + ") = " + f(upf.DL) + " / " + f(upf.UL), upf, "Gbit/s", ["reserva", "split_m", "Rm", "Q_VoNR"]);
    var pdl = P.pico2 * P.split_m * Rm + Q, pul = P.pico2 * (1 - P.split_m) * Rm + Q;
    var cap = { DL: k * Math.max(rdl / P.u_norm, pdl / P.u_pico), UL: k * Math.max(rul / P.u_norm, pul / P.u_pico) };
    paso("radio_cap", "C_{radio} = k_r\\cdot\\max\\left(\\frac{BH}{u_n};\\,\\frac{pico}{u_p}\\right)",
      "DL: " + f(k, 2) + "\\cdot\\max(" + f(rdl) + "/" + f(P.u_norm, 2) + ";\\," + f(pdl) + "/" + f(P.u_pico, 2) + ") = " + f(cap.DL) + "\\quad UL: " + f(cap.UL),
      cap, "Gbit/s", ["Rm", "Q_VoNR", "u_norm", "u_pico", "pico2", "reserva"]);

    return { anio: anio, pasos: pasos, orden: orden };
  }

  var api = { ZONAS: ZONAS, PARAMETROS_DEFECTO: PARAMETROS_DEFECTO, EDITABLES: EDITABLES, calcular: calcular, copia: copia, num: num };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ModeloDemanda = api;
})(typeof window !== "undefined" ? window : this);
