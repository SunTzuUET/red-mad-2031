// serie_worker.js — Web Worker de la serie temporal (CONTRATO_UI Revisión 4). Lo usa Motor.serieAsync.
// Carga los mismos archivos que index.html necesita para el motor (mismo orden): red.js, modelo_demanda.js,
// modelos.js, motor.js. Mensaje de entrada: {tipo: "serie", id, red?, caso, opciones}
//   (red: la RED del hilo principal, para respetar cambios de LAB; si no viene, la de red.js).
// Respuesta: {tipo: "serie", id, ok: true, serie} con los Float32Array transferidos, o {ok: false, error}.
self.window = self;   // los scripts se registran en window.* (RED, ModeloDemanda, Modelos, Motor)
importScripts("red.js", "modelo_demanda.js", "modelos.js", "motor.js");

self.onmessage = function (ev) {
  var m = ev.data || {};
  if (m.tipo !== "serie") return;
  try {
    var s = self.Motor.serie(m.red || self.RED, m.caso, m.opciones || {});
    self.postMessage({ tipo: "serie", id: m.id, ok: true, serie: s }, self.Motor.transferiblesSerie(s));
  } catch (e) {
    self.postMessage({ tipo: "serie", id: m.id, ok: false, error: String((e && e.message) || e) });
  }
};
