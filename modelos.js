// modelos.js — modelos de tráfico (PLAN_v2 §4) traducidos a opciones del motor.
//   Modelos.ajustar(RED, modelo, hora, conEscenario) -> { cargada, hora, factores: {id|tipo:x: f}, perfiles: {id: [24]}, def }
//   modelo = { id: "BH"|"P2"|"PM"|"NC"|"PEND", anio: 2025..2031, dia: "laborable"|"fin_de_semana"|"agosto"|"partido" }
// Definiciones en RED.modelos_trafico (datos/modelos_trafico.json, lo copia fusionar.py).
// Crecimiento por año con ModeloDemanda (modelo_demanda.js): factor = demanda(año)/demanda(2031) por zona y tipo.
var Modelos = (function () {
  "use strict";
  var MD = (typeof module !== "undefined" && typeof require !== "undefined") ? require("./modelo_demanda.js")
    : (typeof window !== "undefined" ? window.ModeloDemanda : null);

  var AREA = { CENTRO: "C", NORTE: "N", ESTE: "E", SUR: "S" };
  var cache = {};

  // Factor de crecimiento de cada tipo de necesidad en cada zona Metro: valor(año)/valor(2031)
  // Con parámetros editados (RED.demanda.parametros) el factor es valor(editado, año)/valor(documento, 2031):
  // así red.js (valores 2031 del documento) se escala a lo que el usuario haya cambiado en demanda.html.
  function crecimiento(RED, anio) {
    if (!MD) return null;
    anio = anio || 2031;
    var P = (RED.demanda && RED.demanda.parametros) || null;
    if (anio === 2031 && !P) return null;
    var clave = anio + "|" + (P ? JSON.stringify(P) : "doc");
    if (cache[clave]) return cache[clave];
    var a = MD.calcular(P || MD.PARAMETROS_DEFECTO, { anio: anio }).pasos,
      b = MD.calcular(MD.PARAMETROS_DEFECTO, { anio: 2031 }).pasos, out = {};
    MD.ZONAS.forEach(function (z) {
      out[z] = {
        "residencial-fijo": a["If_" + z].valor.DL / b["If_" + z].valor.DL,
        "empresa": a["If_" + z].valor.DL / b["If_" + z].valor.DL,
        "movil-ebb": a["Im_" + z].valor.DL / b["Im_" + z].valor.DL,
        "voz-ims": a["VoNR_" + z].valor / b["VoNR_" + z].valor,
        "voz-fija": a["VF_" + z].valor / b["VF_" + z].valor
      };
    });
    cache[clave] = out;
    return out;
  }

  function definicion(RED, id) {
    var ms = (RED.modelos_trafico && RED.modelos_trafico.modelos) || [];
    for (var i = 0; i < ms.length; i++) if (ms[i].id === id) return ms[i];
    return null;
  }

  function perfilBase(RED, MT, nombre) {
    return (MT.perfiles_extra && MT.perfiles_extra[nombre]) || (RED.perfiles && RED.perfiles[nombre]) || null;
  }

  function ajustar(RED, modelo, hora, conEscenario) {
    modelo = modelo || {};
    var MT = RED.modelos_trafico || {};
    var def = definicion(RED, modelo.id || "BH");
    if (!def) return { cargada: false, hora: hora, factores: {}, perfiles: {}, def: null, aviso: "Modelo desconocido: " + modelo.id };
    var dia = (MT.tipos_dia || {})[modelo.dia || "laborable"] || {};
    var factores = {}, perfiles = {};
    function mult(k, f) { factores[k] = (typeof factores[k] === "number" ? factores[k] : 1) * f; }

    // 1. factores del modelo por tipo (P2, PM)
    Object.keys(def.factores_tipo || {}).forEach(function (t) { mult("tipo:" + t, def.factores_tipo[t]); });

    // 2. crecimiento por año
    var cr = crecimiento(RED, modelo.anio);
    (RED.zonas || []).forEach(function (z) {
      var l = AREA[z.area];
      (z.necesidades || []).forEach(function (n) {
        if (cr && l && cr[l][n.tipo]) mult(n.id, cr[l][n.tipo]);
      });
    });

    // 3. servicios según tipo de día (solo si no manda un escenario)
    if (!conEscenario) Object.keys(dia.servicios || {}).forEach(function (s) { mult(s, dia.servicios[s]); });

    var cargada = !!def.hora_cargada;
    if (cargada) return { cargada: true, hora: hora, factores: factores, perfiles: perfiles, def: def };

    // 4. modelos horarios: perfil por tipo de zona para móvil y voz, multiplicadores del tipo de día
    if (hora === null || hora === undefined) hora = 21;
    var tz = MT.tipos_zona || {}, mdia = dia.perfil || {};
    var perfilDe = {};   // id necesidad -> {nombre, arr}
    (RED.zonas || []).forEach(function (z) {
      (z.necesidades || []).forEach(function (n) {
        var nombre = n.perfil;
        if (n.tipo === "movil-ebb" || n.tipo === "voz-ims") nombre = "movil-" + (tz[z.id] || "residencial");
        var arr = perfilBase(RED, MT, nombre);
        if (!arr) return;
        var m = typeof mdia[nombre] === "number" ? mdia[nombre] : 1;
        perfiles[n.id] = arr.map(function (x) { return x * m; });
        perfilDe[n.id] = perfiles[n.id];
      });
    });

    // 5. movilidad pendular: parte del móvil de la periferia se genera en Madrid en horario laboral
    var pe = MT.pendular;
    if (def.pendular && pe && !dia.sin_pendular) {
      var pf = typeof dia.pendular_factor === "number" ? dia.pendular_factor : 1;
      var pres = (pe.presencia || [])[((hora % 24) + 24) % 24] || 0;
      var zonas = {};
      (RED.zonas || []).forEach(function (z) { zonas[z.id] = z; });
      var dest = zonas[pe.destino];
      if (dest && pres > 0) {
        (pe.tipos_afectados || []).forEach(function (tipo) {
          var nd = (dest.necesidades || []).filter(function (n) { return n.tipo === tipo; })[0];
          if (!nd) return;
          var movido = 0;
          Object.keys(pe.fraccion || {}).forEach(function (zid) {
            var z = zonas[zid];
            if (!z) return;
            var n = (z.necesidades || []).filter(function (x) { return x.tipo === tipo; })[0];
            if (!n) return;
            var s = pe.fraccion[zid] * pf * pres;
            var g = cr && cr[AREA[z.area]] ? cr[AREA[z.area]][tipo] : 1;
            var d = (n.dl_gbps || 0) * (perfilDe[n.id] ? perfilDe[n.id][hora] : 1) * g;
            movido += s * d;
            mult(n.id, 1 - s);
          });
          var gd = cr && cr[AREA[dest.area]] ? cr[AREA[dest.area]][tipo] : 1;
          var dM = (nd.dl_gbps || 0) * (perfilDe[nd.id] ? perfilDe[nd.id][hora] : 1) * gd;
          if (dM > 0) mult(nd.id, 1 + movido / dM);
        });
      }
    }
    return { cargada: false, hora: hora, factores: factores, perfiles: perfiles, def: def };
  }

  return { ajustar: ajustar, crecimiento: crecimiento, definicion: definicion };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Modelos; else window.Modelos = Modelos;
