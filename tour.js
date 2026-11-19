// tour.js — Recorrido guiado de 5 pasos (Revisión 11, dueño VISUAL).
// Sale solo la primera vez (localStorage "noc.tour"), se puede saltar y se relanza con NOC.tour(true),
// con el botón «Recorrido guiado» de INICIO o con index.html#tour=1 (enlace en guia.html).
(function () {
  "use strict";
  var W = window, D = document;
  var CLAVE = "noc.tour";
  function N() { return W.NOC || {}; }
  function t(x) { var n = N(); return n.t ? n.t(x) : (x && typeof x === "object" ? x.es : String(x == null ? "" : x)); }
  function ico(k, tam) { var n = N(); return n.icono ? n.icono(k, tam) : ""; }
  function leer() { try { return W.localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { W.localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ } }

  var PASOS = [
    { sel: ".espacios", ico: "inicio",
      tit: { es: "Seis espacios", en: "Six workspaces" },
      txt: { es: "INICIO resume todo. RED es el mapa, SIMULACIÓN la película de 24 h, ANÁLISIS el N-1 y los SLA, DATOS de dónde sale cada cifra.",
        en: "HOME sums it all up. NETWORK is the map, SIMULATION the 24 h run, ANALYSIS the N-1 and SLAs, DATA where each figure comes from." } },
    { sel: ".nivel-seg", ico: "experto",
      tit: { es: "Simple o experto", en: "Simple or expert" },
      txt: { es: "En SIMPLE ves gráficos y nombres cortos. EXPERTO añade tablas, ids, fórmulas y fuentes.",
        en: "SIMPLE shows charts and short names. EXPERT adds tables, ids, formulas and sources." } },
    { sel: ".tb-kpi", ico: "alarma",
      tit: { es: "Estado de un vistazo", en: "Status at a glance" },
      txt: { es: "Tráfico servido, enlace más cargado y alarmas del caso activo. El color va siempre con un icono y un texto (OK, MIN, MAJ, CRIT).",
        en: "Traffic served, busiest link and alarms of the active case. Colour always comes with an icon and text (OK, MIN, MAJ, CRIT)." } },
    { sel: ".pastilla, .modo", ico: "caso",
      tit: { es: "El caso que se simula", en: "The case being simulated" },
      txt: { es: "REF reproduce la Entrega 2 y no se toca. En LAB eliges tráfico, hora, evento y fallos; todo se recalcula al momento.",
        en: "REF reproduces Deliverable 2 and is locked. In LAB you pick traffic, hour, event and faults; everything recomputes instantly." } },
    { sel: ".mini-red, .vista-inicio, main", ico: "info",
      tit: { es: "Toca para ver detalle", en: "Tap for details" },
      txt: { es: "Pulsa un enlace o nodo para abrir su ficha con gráficos. Los botones ⓘ explican cada pieza sin llenar la pantalla de texto.",
        en: "Click a link or node to open its card with charts. The ⓘ buttons explain each piece without filling the screen with text." } }
  ];

  var capa = null, i = 0, previo = null;
  function objetivo(sel) {
    var L = D.querySelectorAll(sel);
    for (var k = 0; k < L.length; k++) { var r = L[k].getBoundingClientRect(); if (r.width > 0 && r.height > 0) return L[k]; }
    return null;
  }
  function cerrar(hecho) {
    if (!capa) return;
    capa.remove(); capa = null;
    D.removeEventListener("keydown", teclas, true);
    W.removeEventListener("resize", colocar);
    guardar(hecho ? "visto" : "saltado");
    if (previo && previo.focus) try { previo.focus(); } catch (e) { /* nada */ }
  }
  function teclas(ev) {
    if (!capa) return;
    if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cerrar(false); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); ev.stopPropagation(); ir(i + 1); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); ev.stopPropagation(); ir(i - 1); }
  }
  function colocar() {
    if (!capa) return;
    var p = PASOS[i], el = objetivo(p.sel), foco = capa.querySelector(".tour-foco"), caja = capa.querySelector(".tour-caja");
    var vw = W.innerWidth, vh = W.innerHeight, r;
    if (el) {
      r = el.getBoundingClientRect();
      var x = Math.max(4, r.left - 6), y = Math.max(4, r.top - 6), w = Math.min(vw - 8, r.width + 12), h = Math.min(vh - 8, r.height + 12);
      foco.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
      foco.hidden = false;
      var cw = caja.offsetWidth, ch = caja.offsetHeight;
      var cy = y + h + 12 + ch <= vh ? y + h + 12 : (y - 12 - ch >= 0 ? y - 12 - ch : Math.max(8, (vh - ch) / 2));
      var cx = Math.max(8, Math.min(vw - cw - 8, x));
      if (cy === Math.max(8, (vh - ch) / 2) && h > vh * 0.6) cx = Math.max(8, Math.min(vw - cw - 8, x + w / 2 - cw / 2));
      caja.style.left = cx + "px"; caja.style.top = cy + "px";
    } else {
      foco.hidden = true;
      caja.style.left = Math.max(8, (vw - caja.offsetWidth) / 2) + "px"; caja.style.top = Math.max(8, (vh - caja.offsetHeight) / 2) + "px";
    }
  }
  function ir(k) {
    if (k < 0) return;
    if (k >= PASOS.length) { cerrar(true); return; }
    i = k;
    var p = PASOS[i], caja = capa.querySelector(".tour-caja");
    caja.innerHTML = '<div class="tour-cab">' + ico(p.ico, 22) + '<h2 id="tour-tit">' + t(p.tit) + '</h2><span class="tour-n mono">' + (i + 1) + ' / ' + PASOS.length + '</span></div>' +
      '<p id="tour-txt">' + t(p.txt) + '</p>' +
      '<div class="tour-puntos" aria-hidden="true">' + PASOS.map(function (_, j) { return '<i' + (j === i ? ' class="on"' : '') + '></i>'; }).join("") + '</div>' +
      '<div class="tour-pie"><button type="button" class="btn" data-tour="saltar">' + t({ es: "Saltar", en: "Skip" }) + '</button>' +
      '<span class="tour-esp"></span>' +
      (i > 0 ? '<button type="button" class="btn" data-tour="atras">' + t({ es: "Atrás", en: "Back" }) + '</button>' : '') +
      '<button type="button" class="btn prim" data-tour="sig">' + t(i === PASOS.length - 1 ? { es: "Empezar", en: "Start" } : { es: "Siguiente", en: "Next" }) + '</button></div>';
    colocar();
    var b = caja.querySelector('[data-tour="sig"]'); if (b) b.focus();
  }
  function abrir() {
    if (capa) return;
    var n = N();
    if (n.setEspacio && n.espacio !== "inicio") try { n.setEspacio("inicio"); } catch (e) { /* nada */ }
    previo = D.activeElement;
    capa = D.createElement("div");
    capa.className = "tour";
    capa.setAttribute("role", "dialog"); capa.setAttribute("aria-modal", "true");
    capa.setAttribute("aria-labelledby", "tour-tit"); capa.setAttribute("aria-describedby", "tour-txt");
    capa.innerHTML = '<div class="tour-foco" hidden></div><div class="tour-caja"></div>';
    capa.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-tour]");
      if (!b) return;
      var a = b.getAttribute("data-tour");
      if (a === "saltar") cerrar(false); else if (a === "atras") ir(i - 1); else if (a === "sig") ir(i + 1);
    });
    D.body.appendChild(capa);
    D.addEventListener("keydown", teclas, true);
    W.addEventListener("resize", colocar);
    setTimeout(function () { ir(0); }, 30);
  }
  function arrancar() {
    var n = N();
    n.tour = function (forzar) { if (forzar || !leer()) abrir(); };
    var porHash = /[#&]tour=1/.test(location.hash || "");
    if (porHash) {
      try { history.replaceState(null, "", location.href.replace(/([#&])tour=1&?/, "$1").replace(/[#&]$/, "")); } catch (e) { /* nada */ }
    }
    if (porHash || !leer()) setTimeout(function () { abrir(); }, 700);
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", arrancar); else arrancar();
})();
