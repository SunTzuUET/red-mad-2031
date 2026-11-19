// estudios.js — CONTRATO_UI Revisión 9 (dueño ESTUDIOS).
//  · Estudios: guardar / cargar / listar (nombre, notas, caso completo con eventos y modelo del usuario, vista, hora del reloj,
//    selección y pasos). JSON descargable y localStorage["noc.estudios"] (try/catch). URL para compartir
//    #estudio=<base64url de JSON comprimido con CompressionStream("gzip") si existe; si no, JSON sin comprimir>.
//  · Pestaña COMPARAR A/B: dos estudios o REF vs caso actual con Motor.comparar; tabla de Δ y resaltado en mapa/unifilar
//    de los enlaces que más cambian (capa propia sobre NOC.mapa y halos sobre el SVG del unifilar, sin tocar sus archivos).
//  · Modo defensa: pasos (vista, hora del reloj, selección, texto) que se recorren con ← / → y banda de notas abajo; pantalla completa opcional.
//  API: NOC.estudios = {capturar(), cargar(est), guardar(), lista(), codificar(est) → Promise<string>, decodificar(s) → Promise<est>,
//       enlace(est) → Promise<url>, comparar(a, b), comparacion (última {a, b, nombreA, nombreB, c}), defensa(est?), salirDefensa()}.
(function () {
  "use strict";
  var NOC = window.NOC;
  if (!NOC || !NOC.registrarVista || !window.Motor) return;
  var RED = NOC.RED, Motor = window.Motor, IDX = NOC.idx || { nodos: {}, enlaces: {} };
  function t(o) { return NOC.t(o); }
  function fmt(x, d) { return NOC.fmt(x, d); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function esNum(x) { return typeof x === "number" && isFinite(x); }
  function copia(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function leer(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function escribir(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function hhmm(m) { if (!esNum(m)) return "—"; m = Math.round(m); var h = Math.floor(m / 60) % 24, mm = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm; }
  var VISTAS_PROPIAS = { comparar: 1 };

  var TX = {
    boton: { es: "Estudios", en: "Studies" },
    botonTit: { es: "Guardar, cargar, compartir y comparar estudios; modo defensa", en: "Save, load, share and compare studies; defence mode" },
    actual: { es: "Estudio actual", en: "Current study" },
    nombre: { es: "Nombre", en: "Name" }, notas: { es: "Notas", en: "Notes" },
    guardar: { es: "Guardar", en: "Save" }, descargar: { es: "Descargar JSON", en: "Download JSON" }, subir: { es: "Abrir JSON…", en: "Open JSON…" },
    compartir: { es: "Copiar URL", en: "Copy URL" }, guardados: { es: "Guardados", en: "Saved" },
    pasos: { es: "Pasos (modo defensa)", en: "Steps (defence mode)" }, anadirPaso: { es: "Añadir paso (vista, hora y selección actuales)", en: "Add step (current view, time and selection)" },
    defensa: { es: "Modo defensa", en: "Defence mode" }, cargar: { es: "Cargar", en: "Load" }, borrar: { es: "Borrar", en: "Delete" },
    comparar: { es: "COMPARAR A/B", en: "COMPARE A/B" },
    sinNombre: { es: "estudio sin nombre", en: "untitled study" },
    ref: { es: "REF (v7)", en: "REF (v7)" }, casoActual: { es: "Caso actual (lo que se ve)", en: "Current case (as shown)" }
  };

  // ======================================================================== captura y carga
  var BOR = { nombre: "", notas: "", pasos: [] };
  try { var b0 = JSON.parse(leer("noc.estudio.borrador") || "null"); if (b0 && typeof b0 === "object") { BOR.nombre = b0.nombre || ""; BOR.notas = b0.notas || ""; BOR.pasos = Array.isArray(b0.pasos) ? b0.pasos : []; } } catch (e) { /* nada */ }
  function guardarBorrador() { escribir("noc.estudio.borrador", JSON.stringify(BOR)); }
  var ultimaVista = null;
  function vistaActual() { var v = NOC.vistaActiva; return v && !VISTAS_PROPIAS[v] ? v : (ultimaVista || v || "mapa"); }
  function tRel() { try { var e = NOC.reloj && NOC.reloj.estado(); return e && e.pelicula && esNum(e.t_min) ? e.t_min : null; } catch (e2) { return null; } }
  function selActual() { var s = NOC.seleccion; return s && s.tipo && s.id ? { tipo: s.tipo, id: s.id } : null; }
  function capturar() {
    var c = copia(NOC.caso || {});
    (c.eventos || []).forEach(function (e) { delete e._i; });
    return { v: 1, app: "red-mad-2031", nombre: BOR.nombre || "", notas: BOR.notas || "", fecha: new Date().toISOString().slice(0, 19),
      modo: NOC.modo, caso: c, vista: vistaActual(), t_min: tRel(), sel: selActual(), lang: NOC.lang, pasos: copia(BOR.pasos || []) };
  }
  function valido(est) { return est && typeof est === "object" && est.caso && typeof est.caso === "object" && (est.modo === "ref" || est.modo === "lab"); }

  var pendienteT = null;   // hora del reloj a fijar cuando llegue la serie
  if (NOC.reloj && NOC.reloj.alSerie) NOC.reloj.alSerie(function () {
    if (pendienteT == null) return;
    var tm = pendienteT; pendienteT = null;
    setTimeout(function () { try { NOC.reloj.ir(tm); } catch (e) { /* nada */ } }, 0);
  });
  function irHora(tm) {
    if (!esNum(tm) || !NOC.reloj) return;
    if (NOC.reloj.serie && NOC.reloj.serie()) { NOC.reloj.ir(tm); pendienteT = null; }
    else pendienteT = tm;
  }
  function seleccionarSel(s) {
    if (!s || !s.tipo || !s.id) return;
    if (s.tipo === "demanda" && NOC.planificacion && NOC.planificacion.abrirDemanda) { NOC.planificacion.abrirDemanda(s.id); return; }
    if (s.tipo === "nodo" || s.tipo === "enlace" || s.tipo === "zona") NOC.seleccionar(s.tipo, s.id);
  }
  function mismoCaso(est) {
    if (est.modo !== NOC.modo) return false;
    if (est.modo === "ref") return true;
    var a = NOC.caso || {}, b = est.caso;
    return JSON.stringify([a.trafico, a.dia, a.anio, a.hora, a.evento, a.fallos, a.eventos || [], a.modelo_usuario || null].map(norm)) ===
      JSON.stringify([b.trafico, b.dia, b.anio, b.hora, b.evento, b.fallos, b.eventos || [], b.modelo_usuario || null].map(norm));
  }
  function norm(x) { return x === undefined ? null : x; }
  function cargar(est, conPasos) {
    if (!valido(est)) { NOC.mensaje && NOC.mensaje(t({ es: "Estudio no válido", en: "Invalid study" })); return false; }
    BOR.nombre = est.nombre || ""; BOR.notas = est.notas || ""; BOR.pasos = Array.isArray(est.pasos) ? copia(est.pasos) : [];
    guardarBorrador();
    if (!mismoCaso(est)) {
      if (est.modo === "ref") NOC.setModo("ref");
      else {
        var c = copia(est.caso);
        NOC.caso.eventos = (c.eventos || []).map(function (e, i) { if (!e.uid) e.uid = "es" + Date.now().toString(36) + i; return e; });
        NOC.caso.modelo_usuario = c.modelo_usuario || null;
        NOC.aplicarCaso(c);
        // operador.js repinta su línea de tiempo y el reloj recalcula la serie (borrar de un uid inexistente = guardar y refrescar)
        if (NOC.operador && NOC.operador.borrar) { try { NOC.operador.borrar("__ninguno__"); } catch (e) { /* nada */ } }
        else if (NOC.reloj && NOC.reloj.refrescar) NOC.reloj.refrescar();
      }
    }
    if (est.vista && !conPasos) NOC.activarVista(est.vista);
    if (esNum(est.t_min) && !conPasos) irHora(est.t_min);
    if (est.sel && !conPasos) setTimeout(function () { seleccionarSel(est.sel); }, 30);
    pintarPanel();
    NOC.mensaje && NOC.mensaje(t({ es: "Estudio cargado: ", en: "Study loaded: " }) + (est.nombre || t(TX.sinNombre)));
    return true;
  }

  // ======================================================================== almacén local
  function lista() { try { var l = JSON.parse(leer("noc.estudios") || "[]"); return Array.isArray(l) ? l.filter(valido) : []; } catch (e) { return []; } }
  function guardarLista(l) { return escribir("noc.estudios", JSON.stringify(l)); }
  function guardar() {
    var est = capturar();
    if (!est.nombre) { est.nombre = t(TX.sinNombre) + " " + est.fecha.replace("T", " ").slice(0, 16); BOR.nombre = est.nombre; guardarBorrador(); }
    var l = lista().filter(function (x) { return x.nombre !== est.nombre; });
    l.unshift(est);
    var ok = guardarList(l);
    NOC.mensaje && NOC.mensaje(ok ? t({ es: "Estudio guardado en este navegador", en: "Study saved in this browser" }) : t({ es: "No se pudo guardar (almacenamiento bloqueado): usa Descargar JSON", en: "Could not save (storage blocked): use Download JSON" }));
    pintarPanel(); pintarSelectoresAB();
    return est;
  }
  function guardarList(l) { return guardarLista(l); }

  // ======================================================================== codificación para la URL
  function b64url(bytes) {
    var s = "", i, CH = 0x8000;
    for (i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function desdeB64url(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
    var bin = atob(s), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  function flujo(bytes, T) {
    var st = new Blob([bytes]).stream().pipeThrough(new T("gzip"));
    return new Response(st).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function codificar(est) {
    var bytes = new TextEncoder().encode(JSON.stringify(est));
    if (typeof window.CompressionStream === "function") {
      return flujo(bytes, window.CompressionStream).then(b64url).catch(function () { return b64url(bytes); });
    }
    return Promise.resolve(b64url(bytes));
  }
  function decodificar(s) {
    return Promise.resolve().then(function () {
      var u = desdeB64url(String(s || "").trim());
      if (u.length > 2 && u[0] === 0x1f && u[1] === 0x8b) {
        if (typeof window.DecompressionStream !== "function") throw new Error(t({ es: "Este navegador no descomprime gzip", en: "This browser cannot gunzip" }));
        return flujo(u, window.DecompressionStream);
      }
      return u;
    }).then(function (u) { return JSON.parse(new TextDecoder().decode(u)); });
  }
  function enlace(est) {
    return codificar(est || capturar()).then(function (s) { return location.href.split("#")[0] + "#estudio=" + s; });
  }
  function copiarTexto(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt).then(function () { return true; }, function () { return false; });
    return Promise.resolve(false);
  }
  function leerHash() {
    var m = /[#&]estudio=([A-Za-z0-9_\-]+)/.exec(location.hash || "");
    if (!m) return;
    decodificar(m[1]).then(function (est) {
      if (!valido(est)) throw new Error("estudio");
      cargar(est);
      try { history.replaceState(null, "", location.href.split("#")[0]); } catch (e) { /* nada */ }
    }).catch(function (e) {
      console.warn("estudio de la URL", e);
      NOC.mensaje && NOC.mensaje(t({ es: "La URL del estudio no se pudo leer", en: "The study URL could not be read" }));
    });
  }
  window.addEventListener("hashchange", leerHash);

  // ======================================================================== descargar / subir
  function descargar(est) {
    est = est || capturar();
    var nom = (est.nombre || "estudio").replace(/[^\w\-áéíóúñÁÉÍÓÚÑ]+/g, "_").slice(0, 60) || "estudio";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(est, null, 2)], { type: "application/json" }));
    a.download = nom + ".estudio.json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function subir(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var est = JSON.parse(String(r.result));
        if (!valido(est)) throw new Error("estudio");
        cargar(est);
        var l = lista().filter(function (x) { return x.nombre !== est.nombre; }); l.unshift(est); guardarLista(l);
        pintarPanel(); pintarSelectoresAB();
      } catch (e) { NOC.mensaje && NOC.mensaje(t({ es: "El archivo no es un estudio válido", en: "The file is not a valid study" })); }
    };
    r.readAsText(file);
  }

  // ======================================================================== panel flotante (botón en la barra del caso)
  var P = { el: null, abierto: false };
  function pintarBoton() {
    var tb = document.getElementById("tb");
    if (!tb) return;
    var b = tb.querySelector(".es-btn");
    if (!b) {
      var ancla = tb.querySelector('[data-accion="exportar"]');
      b = document.createElement("button");
      b.type = "button"; b.className = "btn es-btn"; b.setAttribute("data-es", "alternar");
      if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(b, ancla.nextSibling);
      else { var cr = tb.querySelector(".caso-resumen"); if (cr) cr.parentNode.insertBefore(b, cr); else tb.appendChild(b); }
    }
    b.textContent = t(TX.boton);
    b.title = t(TX.botonTit);
    b.setAttribute("aria-pressed", String(P.abierto));
    b.classList.toggle("activo", P.abierto);
  }
  function alternarPanel(v) {
    P.abierto = typeof v === "boolean" ? v : !P.abierto;
    if (!P.el) {
      P.el = document.createElement("div");
      P.el.className = "es-panel"; P.el.setAttribute("role", "dialog"); P.el.setAttribute("aria-label", t(TX.boton));
      document.body.appendChild(P.el);
      P.el.addEventListener("click", clicPanel);
      P.el.addEventListener("input", function (ev) {
        var k = ev.target.getAttribute("data-es-campo");
        if (k === "nombre" || k === "notas") { BOR[k] = ev.target.value; guardarBorrador(); }
        var ip = ev.target.getAttribute("data-es-ptxt");
        if (ip != null && BOR.pasos[+ip]) { BOR.pasos[+ip].texto = ev.target.value; guardarBorrador(); }
      });
      P.el.addEventListener("change", function (ev) { if (ev.target.getAttribute("data-es") === "fichero" && ev.target.files[0]) subir(ev.target.files[0]); });
    }
    P.el.hidden = !P.abierto;
    if (P.abierto) pintarPanel();
    pintarBoton();
  }
  function descPaso(p) {
    var v = p.vista || "—", s = p.sel ? p.sel.tipo + " " + p.sel.id : "";
    return v + (esNum(p.t_min) ? " · " + hhmm(p.t_min) : "") + (s ? " · " + s : "");
  }
  function pintarPanel() {
    if (!P.el || !P.abierto) return;
    var l = lista(), cas = NOC.modo === "ref" ? "REF" : "LAB · " + [NOC.caso.trafico, NOC.caso.anio, NOC.caso.evento].concat((NOC.caso.fallos || []).length ? ["✕ " + NOC.caso.fallos.join(", ")] : []).join(" · ");
    P.el.innerHTML = '<div class="es-cab"><span class="lbl">' + esc(t(TX.boton)) + '</span><span class="es-caso">' + esc(cas) + '</span><button type="button" class="es-x" data-es="cerrar" aria-label="×">×</button></div>' +
      '<div class="es-sec"><div class="es-tit">' + esc(t(TX.actual)) + '</div>' +
      '<label class="es-campo">' + esc(t(TX.nombre)) + '<input class="sel" data-es-campo="nombre" value="' + esc(BOR.nombre) + '" placeholder="' + esc(t(TX.sinNombre)) + '"></label>' +
      '<label class="es-campo">' + esc(t(TX.notas)) + '<textarea class="sel" rows="3" data-es-campo="notas">' + esc(BOR.notas) + '</textarea></label>' +
      '<div class="es-fila"><button type="button" class="btn prim" data-es="guardar">' + esc(t(TX.guardar)) + '</button><button type="button" class="btn" data-es="descargar">' + esc(t(TX.descargar)) + '</button>' +
      '<label class="btn es-file">' + esc(t(TX.subir)) + '<input type="file" accept=".json,application/json" data-es="fichero" hidden></label>' +
      '<button type="button" class="btn" data-es="compartir">' + esc(t(TX.compartir)) + '</button></div><div class="es-url tx3" hidden></div>' +
      '<p class="nota tx3">' + esc(t({ es: "Se guarda el caso completo (modo, tráfico, año, evento, fallos, eventos del operador y modelo propio), la vista, la hora del reloj y la selección.", en: "Saves the full case (mode, traffic, year, event, failures, operator events and own model), the view, the clock time and the selection." })) + '</p></div>' +
      '<div class="es-sec"><div class="es-tit">' + esc(t(TX.pasos)) + ' <span class="tx3">' + BOR.pasos.length + '</span></div>' +
      (BOR.pasos.length ? '<ol class="es-pasos">' + BOR.pasos.map(function (p, i) {
        return '<li><div class="es-paso-cab"><span class="mono tx2">' + esc(descPaso(p)) + '</span><span class="es-paso-b"><button type="button" class="es-mini" data-es-sube="' + i + '" title="↑"' + (i ? "" : " disabled") + '>↑</button><button type="button" class="es-mini" data-es-baja="' + i + '" title="↓"' + (i < BOR.pasos.length - 1 ? "" : " disabled") + '>↓</button><button type="button" class="es-mini" data-es-ir="' + i + '" title="' + esc(t({ es: "Ir", en: "Go" })) + '">▶</button><button type="button" class="es-mini" data-es-quita="' + i + '" title="' + esc(t(TX.borrar)) + '">×</button></span></div>' +
          '<textarea class="sel" rows="2" data-es-ptxt="' + i + '" placeholder="' + esc(t({ es: "Texto de la nota del paso", en: "Step note text" })) + '">' + esc(p.texto || "") + '</textarea></li>';
      }).join("") + '</ol>' : '<p class="tx3 es-vacio">' + esc(t({ es: "Sin pasos. Coloca la vista, la hora y la selección y pulsa «Añadir paso».", en: "No steps. Set up the view, time and selection and press “Add step”." })) + '</p>') +
      '<div class="es-fila"><button type="button" class="btn" data-es="paso">' + esc(t(TX.anadirPaso)) + '</button><button type="button" class="btn prim" data-es="defensa"' + (BOR.pasos.length ? "" : " disabled") + '>' + esc(t(TX.defensa)) + ' ▶</button></div></div>' +
      '<div class="es-sec"><div class="es-tit">' + esc(t(TX.guardados)) + ' <span class="tx3">' + l.length + '</span></div>' +
      (l.length ? '<table class="tabla es-lista"><tbody>' + l.map(function (e, i) {
        return '<tr><td class="txt"><b>' + esc(e.nombre || t(TX.sinNombre)) + '</b><br><span class="tx3 mono">' + esc((e.modo || "").toUpperCase() + " · " + (e.fecha || "").replace("T", " ").slice(0, 16) + (e.pasos && e.pasos.length ? " · " + e.pasos.length + " " + t({ es: "pasos", en: "steps" }) : "")) + '</span>' +
          (e.notas ? '<br><span class="tx3">' + esc(String(e.notas).slice(0, 120)) + '</span>' : '') + '</td><td class="es-acc"><button type="button" class="btn" data-es-carga="' + i + '">' + esc(t(TX.cargar)) + '</button>' +
          '<button type="button" class="es-mini" data-es-baja-json="' + i + '" title="JSON">⤓</button><button type="button" class="es-mini" data-es-borra="' + i + '" title="' + esc(t(TX.borrar)) + '">×</button></td></tr>';
      }).join("") + '</tbody></table>' : '<p class="tx3 es-vacio">' + esc(t({ es: "Nada guardado en este navegador.", en: "Nothing saved in this browser." })) + '</p>') +
      '<div class="es-fila"><button type="button" class="btn" data-es="comparar">' + esc(t({ es: "Comparar A/B…", en: "Compare A/B…" })) + '</button></div></div>';
  }
  function clicPanel(ev) {
    var b = ev.target.closest("button, [data-es]");
    if (!b) return;
    var a = b.getAttribute("data-es"), l;
    if (a === "cerrar") alternarPanel(false);
    else if (a === "guardar") guardar();
    else if (a === "descargar") descargar();
    else if (a === "compartir") {
      enlace().then(function (u) {
        var c = P.el.querySelector(".es-url");
        copiarTexto(u).then(function (ok) {
          if (c) { c.hidden = false; c.innerHTML = esc(ok ? t({ es: "Copiada (" + u.length + " caracteres):", en: "Copied (" + u.length + " chars):" }) : t({ es: "Copia esta URL:", en: "Copy this URL:" })) + '<input class="sel mono" readonly value="' + esc(u) + '">'; var ip = c.querySelector("input"); if (ip) ip.select(); }
        });
      });
    }
    else if (a === "paso") {
      BOR.pasos.push({ vista: vistaActual(), t_min: tRel(), sel: selActual(), texto: "" });
      guardarBorrador(); pintarPanel();
      var ts = P.el.querySelectorAll("[data-es-ptxt]"); if (ts.length) ts[ts.length - 1].focus();
    }
    else if (a === "defensa") { alternarPanel(false); defensa(); }
    else if (a === "comparar") { alternarPanel(false); NOC.activarVista("comparar"); }
    else if (b.hasAttribute("data-es-quita")) { BOR.pasos.splice(+b.getAttribute("data-es-quita"), 1); guardarBorrador(); pintarPanel(); }
    else if (b.hasAttribute("data-es-sube") || b.hasAttribute("data-es-baja")) {
      var i = +(b.getAttribute("data-es-sube") || b.getAttribute("data-es-baja")), j = b.hasAttribute("data-es-sube") ? i - 1 : i + 1;
      if (j >= 0 && j < BOR.pasos.length) { var x = BOR.pasos[i]; BOR.pasos[i] = BOR.pasos[j]; BOR.pasos[j] = x; guardarBorrador(); pintarPanel(); }
    }
    else if (b.hasAttribute("data-es-ir")) aplicarPaso(BOR.pasos[+b.getAttribute("data-es-ir")]);
    else if (b.hasAttribute("data-es-carga")) { l = lista(); cargar(l[+b.getAttribute("data-es-carga")]); }
    else if (b.hasAttribute("data-es-baja-json")) { l = lista(); descargar(l[+b.getAttribute("data-es-baja-json")]); }
    else if (b.hasAttribute("data-es-borra")) { l = lista(); l.splice(+b.getAttribute("data-es-borra"), 1); guardarLista(l); pintarPanel(); pintarSelectoresAB(); }
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest('#tb [data-es="alternar"]');
    if (b) { ev.preventDefault(); alternarPanel(); }
  });

  // ======================================================================== modo defensa
  var D = { activo: false, i: 0, pasos: [], el: null };
  function aplicarPaso(p) {
    if (!p) return;
    if (p.vista) NOC.activarVista(p.vista);
    if (esNum(p.t_min)) irHora(p.t_min);
    else if (NOC.reloj && NOC.reloj.estado && NOC.reloj.estado().pelicula && NOC.reloj.volverHC) { try { NOC.reloj.volverHC(); } catch (e) { /* nada */ } }
    if (p.sel) setTimeout(function () { seleccionarSel(p.sel); }, 30);
    else if (NOC.cerrarFicha) NOC.cerrarFicha();
  }
  function defensa(est) {
    if (est && valido(est)) { cargar(est, true); }
    D.pasos = copia(BOR.pasos || []);
    if (!D.pasos.length) { NOC.mensaje && NOC.mensaje(t({ es: "El estudio no tiene pasos", en: "The study has no steps" })); return; }
    D.activo = true; D.i = 0;
    if (!D.el) {
      D.el = document.createElement("div");
      D.el.className = "es-defensa"; D.el.setAttribute("role", "region"); D.el.setAttribute("aria-live", "polite");
      document.body.appendChild(D.el);
      D.el.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-esd]");
        if (!b) return;
        var a = b.getAttribute("data-esd");
        if (a === "ant") mover(-1); else if (a === "sig") mover(1); else if (a === "salir") salirDefensa();
        else if (a === "pc") pantallaCompleta();
      });
    }
    D.el.hidden = false;
    document.body.classList.add("es-en-defensa");
    pintarDefensa(); aplicarPaso(D.pasos[0]);
  }
  function mover(d) {
    var j = Math.max(0, Math.min(D.pasos.length - 1, D.i + d));
    if (j === D.i) return;
    D.i = j; pintarDefensa(); aplicarPaso(D.pasos[j]);
  }
  function pintarDefensa() {
    if (!D.el) return;
    var p = D.pasos[D.i] || {};
    D.el.innerHTML = '<div class="es-d-izq"><span class="lbl">' + esc(t({ es: "PASO", en: "STEP" })) + ' <b class="mono">' + (D.i + 1) + '/' + D.pasos.length + '</b></span><span class="es-d-meta mono tx3">' + esc(descPaso(p)) + '</span></div>' +
      '<div class="es-d-txt">' + (p.texto ? esc(p.texto).replace(/\n/g, "<br>") : '<span class="tx3">—</span>') + '</div>' +
      '<div class="es-d-bot"><button type="button" class="btn" data-esd="ant"' + (D.i ? "" : " disabled") + ' title="←">◀</button><button type="button" class="btn" data-esd="sig"' + (D.i < D.pasos.length - 1 ? "" : " disabled") + ' title="→">▶</button>' +
      '<button type="button" class="btn" data-esd="pc" title="' + esc(t({ es: "Pantalla completa", en: "Full screen" })) + '">⛶</button><button type="button" class="btn" data-esd="salir" title="Esc">✕</button></div>';
  }
  function pantallaCompleta() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () { /* nada */ });
    } catch (e) { /* nada */ }
  }
  function salirDefensa() {
    D.activo = false;
    if (D.el) D.el.hidden = true;
    document.body.classList.remove("es-en-defensa");
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* nada */ }
  }
  // fase de captura: ← / → del modo defensa tienen prioridad sobre el reloj (que usa las flechas para mover la hora)
  document.addEventListener("keydown", function (ev) {
    if (!D.activo) return;
    var tg = ev.target && ev.target.tagName;
    if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (ev.target && ev.target.isContentEditable)) return;
    if (ev.key === "ArrowRight" || ev.key === "PageDown" || ev.key === "ArrowLeft" || ev.key === "PageUp" || ev.key === "Escape") {
      ev.preventDefault(); ev.stopImmediatePropagation();
      if (ev.key === "Escape") salirDefensa(); else mover(ev.key === "ArrowRight" || ev.key === "PageDown" ? 1 : -1);
    }
  }, true);

  // ======================================================================== comparador A/B
  var TRAF = {};
  try { (Motor.casos ? Motor.casos(RED).trafico : []).forEach(function (x) { TRAF[x.id] = x; }); } catch (e) { /* nada */ }
  // Estado de eventos en el instante t (misma regla que la serie del motor: fallo tumba, reparacion levanta, el resto son acciones vivas)
  function estadoEn(baseF, eventos, tm) {
    var act = {}, orden = [], deg = {}, otros = [];
    baseF.forEach(function (id) { if (!act[id]) { act[id] = 1; orden.push(id); } });
    var ev = (eventos || []).map(function (e, i) { var x = copia(e); x._i = i; return x; }).sort(function (a, b) { return a.t_min - b.t_min || a._i - b._i; });
    ev.forEach(function (e) {
      if (e.t_min > tm + 1e-9) return;
      var pp = e.params || {}, fin = esNum(pp.hasta_min) ? pp.hasta_min : esNum(pp.duracion_min) ? e.t_min + pp.duracion_min : null;   // = finEvento del motor
      var vivo = !(esNum(fin) && tm >= fin - 1e-9);
      if (e.tipo === "fallo") { if (vivo) { if (!act[e.id]) { act[e.id] = 1; orden.push(e.id); } } else delete act[e.id]; }
      else if (e.tipo === "reparacion") { delete act[e.id]; delete deg[e.id]; }
      else if (e.tipo === "degradar") { if (vivo) (deg[e.id] || (deg[e.id] = [])).push(e); else delete deg[e.id]; }
      else if (vivo) otros.push(e);
    });
    var acc = [];
    Object.keys(deg).forEach(function (id) { acc = acc.concat(deg[id]); });
    acc = acc.concat(otros).sort(function (a, b) { return a._i - b._i; }).map(function (e) { var o = { tipo: e.tipo }; if (e.id) o.id = e.id; if (e.params) o.params = e.params; return o; });
    return { fallos: orden.filter(function (id) { return act[id]; }), acciones: acc };
  }
  function opcionesEstudio(est) {
    if (est.modo === "ref") return { caso: { trafico: "BH", evento: "E-EVENTO" } };
    var c = est.caso || {}, it = TRAF[c.trafico] || {};
    var tr = { id: c.trafico || "BH", anio: c.anio || 2031, dia: c.dia || "laborable" };
    if (it.usa_hora && esNum(c.hora)) tr.hora = c.hora;
    var st = estadoEn((c.fallos || []).slice(), c.eventos || [], esNum(est.t_min) ? est.t_min : 1440);
    var o = { caso: { trafico: tr, evento: c.evento || "ninguno", fallo: st.fallos } };
    if (st.acciones.length) o.acciones = st.acciones;
    if (c.modelo_usuario && typeof c.modelo_usuario === "object") o.modelo_usuario = copia(c.modelo_usuario);
    return o;
  }
  var C = { el: null, activa: false, a: "ref", b: "actual", res: null, resaltar: true, capa: null, err: "" };
  function fuentes() {
    var l = lista();
    return [{ k: "ref", n: t(TX.ref) }, { k: "actual", n: t(TX.casoActual) }].concat(l.map(function (e, i) { return { k: "e" + i, n: e.nombre || t(TX.sinNombre), est: e }; }));
  }
  function nombreFuente(k) { var f = fuentes().filter(function (x) { return x.k === k; })[0]; return f ? f.n : k; }
  function resultadoDe(k) {
    if (k === "ref") return NOC.referencia;
    if (k === "actual") return NOC.resultado;
    var f = fuentes().filter(function (x) { return x.k === k; })[0];
    if (!f || !f.est) return null;
    if (f.est.modo === "ref") return NOC.referencia;
    return Motor.calcular(RED, opcionesEstudio(f.est));
  }
  function comparar(ka, kb) {
    C.err = "";
    try {
      var a = resultadoDe(ka), b = resultadoDe(kb);
      if (!a || !b) throw new Error(t({ es: "falta un resultado", en: "missing a result" }));
      C.res = { a: ka, b: kb, nombreA: nombreFuente(ka), nombreB: nombreFuente(kb), c: Motor.comparar(a, b) };
    } catch (e) { C.res = null; C.err = String(e && e.message || e); console.error("comparar", e); }
    API.comparacion = C.res;
    return C.res;
  }
  function pintarSelectoresAB() {
    if (!C.el) return;
    var f = fuentes();
    ["a", "b"].forEach(function (lado) {
      var s = C.el.querySelector('[data-es-ab="' + lado + '"]');
      if (!s) return;
      if (!f.some(function (x) { return x.k === C[lado]; })) C[lado] = lado === "a" ? "ref" : "actual";
      s.innerHTML = f.map(function (x) { return '<option value="' + esc(x.k) + '"' + (x.k === C[lado] ? " selected" : "") + '>' + esc(x.n) + '</option>'; }).join("");
    });
  }
  var KPI = [
    ["dl_total_gbps", { es: "DL total", en: "Total DL" }, "Gbit/s", 1, 1],
    ["servida_gbps", { es: "DL servido", en: "DL served" }, "Gbit/s", 1, 1],
    ["pct_servida", { es: "% servido", en: "% served" }, "%", 2, 1],
    ["max_ocupacion", { es: "Ocupación máxima", en: "Max occupancy" }, "%", 1, 100],
    ["demandas_afectadas", { es: "Demandas afectadas", en: "Affected demands" }, "", 0, 1],
    ["enlaces_saturados", { es: "Enlaces saturados", en: "Saturated links" }, "", 0, 1],
    ["alertas_graves", { es: "Alarmas graves", en: "Major alarms" }, "", 0, 1],
    ["lat_media_ms", { es: "Latencia media", en: "Mean latency" }, "ms", 3, 1]
  ];
  function dTxt(d, dec, mul) {
    if (!esNum(d)) return "—";
    var v = d * mul;
    if (Math.abs(v) < Math.pow(10, -dec) / 2) return '<span class="tx3">0</span>';
    return '<b class="' + (v > 0 ? "es-mas" : "es-menos") + '">' + (v > 0 ? "+" : "−") + fmt(Math.abs(v), dec) + '</b>';
  }
  function pintarComparar() {
    var el = C.el;
    if (!el) return;
    var h = '<div class="pl-barra"><span class="lbl">' + esc(t(TX.comparar)) + '</span>' +
      '<label class="pl-ctl">A <select class="sel" data-es-ab="a"></select></label><span class="tx3">vs</span>' +
      '<label class="pl-ctl">B <select class="sel" data-es-ab="b"></select></label>' +
      '<button type="button" class="btn" data-es-c="cruzar" title="A ⇄ B">⇄</button>' +
      '<label class="pl-ctl"><input type="checkbox" data-es-c="resaltar"' + (C.resaltar ? " checked" : "") + '> ' + esc(t({ es: "Resaltar en mapa y unifilar", en: "Highlight on map and diagram" })) + '</label>' +
      '<span class="pl-esp"></span><span class="tx3">' + esc(t({ es: "Δ = B − A. Estudios: caso a su hora del reloj con los eventos activos.", en: "Δ = B − A. Studies: case at its clock time with active events." })) + '</span></div>';
    var r = C.res;
    if (!r) { el.innerHTML = h + '<div class="vacio">' + esc(C.err || "—") + '</div>'; pintarSelectoresAB(); return; }
    var c = r.c;
    h += '<div class="pl-cuerpo"><section class="pl-sec"><h3 class="lbl">KPI</h3><table class="tabla pl-tab"><thead><tr><th></th><th class="n">A · ' + esc(r.nombreA) + '</th><th class="n">B · ' + esc(r.nombreB) + '</th><th class="n">Δ</th></tr></thead><tbody>' +
      KPI.map(function (k) {
        var x = c.kpi[k[0]] || {};
        return '<tr><td>' + esc(t(k[1])) + (k[2] ? ' <span class="tx3">' + esc(k[2]) + '</span>' : '') + '</td><td class="n">' + (esNum(x.a) ? fmt(x.a * k[4], k[3]) : "—") + '</td><td class="n">' + (esNum(x.b) ? fmt(x.b * k[4], k[3]) : "—") + '</td><td class="n">' + dTxt(x.d, k[3], k[4]) + '</td></tr>';
      }).join("") + '</tbody></table>' +
      '<p class="tx3 es-cambios">' + esc(t({ es: "Cambian", en: "Changed" })) + ': ' + c.n_cambios.enlaces + ' ' + esc(t({ es: "enlaces", en: "links" })) + ' · ' + c.n_cambios.nodos + ' ' + esc(t({ es: "nodos", en: "nodes" })) + ' · ' + c.n_cambios.demandas + ' ' + esc(t({ es: "demandas", en: "demands" })) + ' · ' + c.n_cambios.sla + ' slices</p>' +
      (c.energia_nota ? '<p class="nota tx3">' + esc(t({ es: "Energía", en: "Energy" })) + ': ' + esc(c.energia_nota) + '</p>' : '') + '</section>';
    h += '<section class="pl-sec"><h3 class="lbl">' + esc(t({ es: "Enlaces que más cambian (ocupación)", en: "Links that change most (occupancy)" })) + '</h3>' + tablaTop(c.top.enlaces_ocupacion, "enlace", 100, 1, "%", "pp") + '</section>';
    h += '<section class="pl-sec"><h3 class="lbl">SLA</h3><table class="tabla pl-tab"><thead><tr><th>Slice</th><th class="n">' + esc(t({ es: "Cumple A", en: "Meets A" })) + '</th><th class="n">' + esc(t({ es: "Cumple B", en: "Meets B" })) + '</th><th class="n">P95 A</th><th class="n">P95 B</th><th class="n">Δ P95</th></tr></thead><tbody>' +
      Object.keys(c.sla || {}).map(function (k) {
        var s = c.sla[k], cp = s.cumple_pct || {}, p95 = s.lat_p95_max_ms || {};
        return '<tr' + (s.cambia ? ' class="es-cambia"' : '') + '><td>' + esc(k) + '</td><td class="n">' + fmt(cp.a, 1) + ' %</td><td class="n' + (cp.d < 0 ? " sev-crit" : "") + '">' + fmt(cp.b, 1) + ' %</td><td class="n">' + fmt(p95.a, 3) + '</td><td class="n">' + fmt(p95.b, 3) + '</td><td class="n">' + dTxt(p95.d, 3, 1) + '</td></tr>';
      }).join("") + '</tbody></table></section>';
    h += '<section class="pl-sec"><h3 class="lbl">' + esc(t({ es: "Demandas: servido y latencia", en: "Demands: served and latency" })) + '</h3>' +
      (c.top.demandas_servida.length ? '<div class="es-sub tx2">' + esc(t({ es: "Servido (Gbit/s)", en: "Served (Gbit/s)" })) + '</div>' + tablaTop(c.top.demandas_servida, "demanda", 1, 2, "", "Gbit/s") : '<p class="tx3">' + esc(t({ es: "Ninguna demanda cambia de servido.", en: "No demand changes served traffic." })) + '</p>') +
      (c.top.demandas_lat.length ? '<div class="es-sub tx2">' + esc(t({ es: "Latencia media (ms)", en: "Mean latency (ms)" })) + '</div>' + tablaTop(c.top.demandas_lat, "demanda", 1, 3, "", "ms") : '') + '</section></div>';
    el.innerHTML = h;
    pintarSelectoresAB();
  }
  function tablaTop(lst, tipo, mul, dec, uv, ud) {
    if (!lst || !lst.length) return '<p class="tx3">—</p>';
    var max = 0; lst.forEach(function (x) { max = Math.max(max, Math.abs(x.d || 0)); });
    return '<table class="tabla pl-tab"><thead><tr><th>id</th><th class="n">A' + (uv ? " " + uv : "") + '</th><th class="n">B' + (uv ? " " + uv : "") + '</th><th class="n">Δ ' + esc(ud) + '</th><th></th></tr></thead><tbody>' +
      lst.slice(0, 15).map(function (x) {
        var attr = tipo === "enlace" ? ' data-id="' + esc(x.id) + '" data-tipo="enlace"' : ' data-es-dem="' + esc(x.id) + '"';
        var w = max > 0 ? Math.abs(x.d) / max * 100 : 0;
        return '<tr' + attr + '><td class="id">' + esc(x.id) + '</td><td class="n">' + fmt(x.a * mul, dec) + '</td><td class="n">' + fmt(x.b * mul, dec) + '</td><td class="n">' + dTxt(x.d, dec, mul) + '</td>' +
          '<td class="es-bar-c"><i class="es-bar ' + (x.d > 0 ? "mas" : "menos") + '" style="width:' + w.toFixed(1) + '%"></i></td></tr>';
      }).join("") + '</tbody></table>';
  }
  function recalcularComparar() { comparar(C.a, C.b); pintarComparar(); resaltar(); }
  function montarComparar(el) {
    C.el = el; el.classList.add("pl", "es-cmp");
    el.addEventListener("change", function (ev) {
      var lado = ev.target.getAttribute("data-es-ab");
      if (lado) { C[lado] = ev.target.value; recalcularComparar(); return; }
      if (ev.target.getAttribute("data-es-c") === "resaltar") { C.resaltar = ev.target.checked; resaltar(); }
    });
    el.addEventListener("click", function (ev) {
      var b;
      if ((b = ev.target.closest('[data-es-c="cruzar"]'))) { var x = C.a; C.a = C.b; C.b = x; recalcularComparar(); return; }
      if ((b = ev.target.closest("[data-es-dem]"))) { if (NOC.planificacion && NOC.planificacion.abrirDemanda) NOC.planificacion.abrirDemanda(b.getAttribute("data-es-dem")); }
    });
    recalcularComparar();
  }
  NOC.registrarVista({ id: "comparar", grupo: "analisis", titulo: { es: "COMPARAR A/B", en: "COMPARE A/B" }, montar: montarComparar,
    activar: function () { C.activa = true; recalcularComparar(); }, desactivar: function () { C.activa = false; } });

  // ---- resaltado en mapa (capa Leaflet propia) y unifilar (halos SVG propios)
  function topEnlaces() {
    if (!C.resaltar || !C.res) return [];
    return (C.res.c.top.enlaces_ocupacion || []).filter(function (x) { return Math.abs(x.d) >= 0.005; }).slice(0, 15);
  }
  function resaltar() {
    var top = topEnlaces();
    // mapa
    var L = window.L, m = NOC.mapa;
    if (L && m) {
      if (!C.capa) C.capa = L.layerGroup();
      C.capa.clearLayers();
      top.forEach(function (x) {
        var e = IDX.enlaces[x.id], A = e && IDX.nodos[e.a], B = e && IDX.nodos[e.b];
        if (!A || !B || !A.coord || !B.coord) return;
        var pl = L.polyline([A.coord, B.coord], { color: "#ffffff", weight: 9, opacity: 0.55, dashArray: "2 6", className: "es-dif-mapa", interactive: true });
        pl.bindTooltip('<b>' + esc(x.id) + '</b><br>A ' + fmt(x.a * 100, 1) + ' % → B ' + fmt(x.b * 100, 1) + ' % (' + (x.d > 0 ? "+" : "−") + fmt(Math.abs(x.d) * 100, 1) + ' pp)', { sticky: true, className: "sd-tt" });
        pl.on("click", function () { NOC.seleccionar("enlace", x.id); });
        pl.addTo(C.capa);
      });
      if (top.length && !m.hasLayer(C.capa)) C.capa.addTo(m);
      if (!top.length && m.hasLayer(C.capa)) m.removeLayer(C.capa);
    }
    // unifilar
    Array.prototype.forEach.call(document.querySelectorAll("g.es-dif-uf"), function (g) { g.remove(); });
    if (!top.length) return;
    Array.prototype.forEach.call(document.querySelectorAll("g.uf-lineas"), function (gl) {
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "es-dif-uf");
      top.forEach(function (x) {
        var p = gl.querySelector('path.uf-l[data-l="' + String(x.id).replace(/"/g, "") + '"]');
        if (!p) return;
        var h = document.createElementNS("http://www.w3.org/2000/svg", "path");
        h.setAttribute("d", p.getAttribute("d"));
        h.setAttribute("class", "es-dif-halo");
        var tt = document.createElementNS("http://www.w3.org/2000/svg", "title");
        tt.textContent = x.id + " · Δ " + (x.d > 0 ? "+" : "−") + fmt(Math.abs(x.d) * 100, 1) + " pp";
        h.appendChild(tt);
        g.appendChild(h);
      });
      gl.parentNode.insertBefore(g, gl);
    });
  }

  // ======================================================================== eventos del shell
  NOC.on("vista", function (id) {
    var v = typeof id === "string" ? id : NOC.vistaActiva;
    if (v && !VISTAS_PROPIAS[v]) ultimaVista = v;
    setTimeout(resaltar, 60);
  });
  NOC.on("resultado", function () {
    if (C.activa) recalcularComparar(); else if (C.res && (C.a === "actual" || C.b === "actual")) { comparar(C.a, C.b); setTimeout(resaltar, 60); }
    if (P.abierto) pintarPanel();
  });
  NOC.on("lang", function () { pintarBoton(); if (P.abierto) pintarPanel(); if (C.activa) pintarComparar(); if (D.activo) pintarDefensa(); });
  NOC.on("barra", function () { pintarBoton(); });
  NOC.on("modo", function () { pintarBoton(); });

  var API = {
    capturar: capturar, cargar: cargar, guardar: guardar, lista: lista, codificar: codificar, decodificar: decodificar, enlace: enlace,
    descargar: descargar, opcionesEstudio: opcionesEstudio, comparar: function (a, b) { return comparar(a, b); }, comparacion: null,
    defensa: defensa, salirDefensa: salirDefensa, alternarPanel: alternarPanel, resaltar: resaltar,
    // Revisión 11 (diseñador de escenarios): guardar el caso actual con nombre y notas
    guardarComo: function (nombre, notas) {
      if (nombre != null) BOR.nombre = String(nombre);
      if (notas != null) BOR.notas = String(notas);
      guardarBorrador();
      return guardar();
    }
  };
  NOC.estudios = API;

  function arrancar() { pintarBoton(); leerHash(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(arrancar, 0); });
  else setTimeout(arrancar, 0);
})();
