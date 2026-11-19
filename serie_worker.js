// serie_worker.js — Web Worker de la serie temporal (CONTRATO_UI Revisiones 4 y 8). Lo usan Motor.serieAsync y Motor.serieMontecarlo.
// Carga los mismos archivos que completo.html necesita para el motor (mismo orden): red.js, modelo_demanda.js,
// modelos.js, motor.js. Mensajes de entrada: {tipo: "serie", id, red?, caso, opciones} o {tipo: "montecarlo", id, red?, caso, opciones, n}
//   (red: la RED del hilo principal, para respetar cambios de LAB; si no viene, la de red.js; opciones.modelo_usuario viaja con ellas).
// Respuesta: {tipo, id, ok: true, serie} (serie o resultado del Montecarlo) con los Float32Array transferidos, o {ok: false, error}.
self.window = self;   // los scripts se registran en window.* (RED, ModeloDemanda, Modelos, Motor)
importScripts("red.js", "modelo_demanda.js", "modelos.js", "emplazamientos_datos.js", "motor.js");

self.onmessage = function (ev) {
  var m = ev.data || {};
  if (m.tipo !== "serie" && m.tipo !== "montecarlo") return;
  try {
    var red = m.red || self.RED, s, tr;
    if (m.tipo === "montecarlo") { s = self.Motor.serieMontecarloSync(red, m.caso, m.opciones || {}, m.n); tr = self.Motor.transferiblesMontecarlo(s); }
    else { s = self.Motor.serie(red, m.caso, m.opciones || {}); tr = self.Motor.transferiblesSerie(s); }
    self.postMessage({ tipo: m.tipo, id: m.id, ok: true, serie: s }, tr);
  } catch (e) {
    self.postMessage({ tipo: m.tipo, id: m.id, ok: false, error: String((e && e.message) || e) });
  }
};
