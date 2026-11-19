// iconos.js — juego de iconos de RED-MAD 2031 (CONTRATO_UI.md, Revisión 11, dueño VISUAL).
// Dibujo en una rejilla de 24×24, solo trazo (currentColor), sin relleno: NOC.icono(clave, tam) en ui_comun.js lo envuelve
// en un <svg> con trazo de 1,5 px reales a cualquier tamaño. Claves: tecnologías, equipos, estados, espacios y acciones.
(function () {
  "use strict";
  var P = {
    // ---------- tecnologías / servicios ----------
    ftth: '<path d="M4 11 12 4.5 20 11"/><path d="M6 9.5V20h12V9.5"/><circle cx="12" cy="14.5" r="2"/><path d="M12 16.5V20M2 20h20"/>',
    n28: '<path d="M12 9v12M9 21l3-12 3 12"/><circle cx="12" cy="7.5" r="1.2"/><path d="M6.5 3.5a8 8 0 0 0 0 8M17.5 3.5a8 8 0 0 1 0 8"/>',
    n78: '<path d="M12 9v12M9 21l3-12 3 12"/><circle cx="12" cy="7.5" r="1.2"/><path d="M8.5 5a4 4 0 0 0 0 5M15.5 5a4 4 0 0 1 0 5M5.5 3a8 8 0 0 0 0 9M18.5 3a8 8 0 0 1 0 9"/>',
    n258: '<path d="M12 9v12M9 21l3-12 3 12"/><circle cx="12" cy="7.5" r="1.2"/><path d="M9.5 6a2.5 2.5 0 0 0 0 3M14.5 6a2.5 2.5 0 0 1 0 3M7.5 5a5 5 0 0 0 0 5M16.5 5a5 5 0 0 1 0 5M5.5 4a7 7 0 0 0 0 7M18.5 4a7 7 0 0 1 0 7"/>',
    embb: '<rect x="7" y="2.5" width="10" height="19" rx="1.5"/><path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3"/>',
    v2x: '<path d="M5 15V12l2-5h10l2 5v3z"/><path d="M5 12h14M5 15v2.5M19 15v2.5"/><circle cx="8" cy="15" r=".5"/><circle cx="16" cy="15" r=".5"/><path d="M9 3.5a5 5 0 0 1 6 0"/>',
    iot: '<rect x="8" y="8" width="8" height="8"/><path d="M10 8V5M14 8V5M10 19v-3M14 19v-3M8 10H5M8 14H5M19 10h-3M19 14h-3"/><circle cx="12" cy="12" r="1"/>',
    ntn: '<path d="M9 9l6 6M7.5 10.5l-3-3 3-3 3 3M16.5 13.5l3 3-3 3-3-3"/><rect x="9.5" y="9.5" width="5" height="5" transform="rotate(45 12 12)"/><path d="M4 20a6 6 0 0 1 4-4"/>',
    voz: '<path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    l2vpn: '<path d="M3 20V9h6v11M15 20V5h6v15M2 20h20"/><path d="M9 13h6" stroke-dasharray="2 1.5"/><path d="M5 12h2M5 15h2M17 8h2M17 11h2M17 14h2"/>',
    urllc: '<path d="M13 2.5 5.5 13.5H11l-1 8 7.5-11H12z"/>',
    evento: '<ellipse cx="12" cy="12" rx="9.5" ry="6"/><ellipse cx="12" cy="12" rx="5" ry="2.8"/><path d="M12 6v3.2M12 14.8V18"/>',
    // ---------- equipos ----------
    dc: '<rect x="4" y="3.5" width="16" height="5"/><rect x="4" y="9.5" width="16" height="5"/><rect x="4" y="15.5" width="16" height="5"/><path d="M7 6h.01M7 12h.01M7 18h.01M11 6h6M11 12h6M11 18h6"/>',
    metro: '<path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5z"/><circle cx="12" cy="12" r="3.5"/>',
    edge: '<path d="M12 2.5 21.5 12 12 21.5 2.5 12z"/><rect x="9.5" y="9.5" width="5" height="5"/>',
    agg: '<circle cx="12" cy="12" r="8.5"/><path d="M6.5 8.5 11 12l-4.5 3.5M12 12h6M15.5 9.5 18 12l-2.5 2.5"/>',
    sitio: '<path d="M12 3 21 20H3z"/><path d="M12 9v6M12 17.5v.01"/>',
    ix: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    bng: '<rect x="3" y="8" width="18" height="8"/><path d="M7 12h.01M10 12h.01M15 10.5l2 1.5-2 1.5M3 4.5h6M15 19.5h6"/>',
    upf: '<rect x="3.5" y="5" width="17" height="14"/><path d="M8.5 9v4a3.5 3.5 0 0 0 7 0V9"/>',
    ims: '<rect x="3.5" y="3.5" width="17" height="17"/><path d="M8.5 7.5h2l1 2.5-1.2 1a6 6 0 0 0 3.2 3.2l1-1.2 2.5 1v2a1.3 1.3 0 0 1-1.3 1.3A9 9 0 0 1 7.2 8.8 1.3 1.3 0 0 1 8.5 7.5z"/>',
    olt: '<rect x="2.5" y="9" width="7" height="6"/><path d="M9.5 12h3M12.5 12l8-6.5M12.5 12h8M12.5 12l8 6.5"/>',
    // ---------- estados (X.733: siempre con texto al lado) ----------
    ok: '<circle cx="12" cy="12" r="9"/><path d="M7.5 12.5l3 3 6-6.5"/>',
    min: '<path d="M12 3 21.5 20h-19z"/><path d="M12 9.5v5M12 17.2v.01"/>',
    maj: '<path d="M12 2.5 21.5 12 12 21.5 2.5 12z"/><path d="M12 7.5v5.5M12 16.2v.01"/>',
    crit: '<path d="M8.2 2.5h7.6l5.7 5.7v7.6l-5.7 5.7H8.2l-5.7-5.7V8.2z"/><path d="M9 9l6 6M15 9l-6 6"/>',
    down: '<circle cx="12" cy="12" r="9"/><path d="M5.6 18.4 18.4 5.6"/>',
    wrn: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>',
    unk: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 16.8v.01"/>',
    // ---------- espacios ----------
    inicio: '<path d="M3.5 11 12 3.5l8.5 7.5"/><path d="M5.5 9.5V20.5h5v-6h3v6h5V9.5"/>',
    red: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="10" r="1.5"/><path d="M6.8 6.9l3.9 2.3M17.2 6.9l-3.9 2.3M12 11.5v4.5M7 6h10"/>',
    simulacion: '<circle cx="12" cy="13" r="8"/><path d="M12 8.5V13l3 2M9.5 2.5h5M19 5.5l1.5-1.5"/>',
    analisis: '<path d="M3.5 20.5h17"/><rect x="5" y="12" width="3" height="6"/><rect x="10.5" y="7" width="3" height="11"/><rect x="16" y="3.5" width="3" height="14.5"/>',
    datos: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
    guia: '<path d="M3.5 5c3-1.3 6-1.3 8.5.5v15c-2.5-1.8-5.5-1.8-8.5-.5zM20.5 5c-3-1.3-6-1.3-8.5.5v15c2.5-1.8 5.5-1.8 8.5-.5z"/>',
    // ---------- acciones y varios ----------
    buscar: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
    exportar: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M4 15.5v5h16v-5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pausa: '<path d="M7.5 4.5v15M16.5 4.5v15"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.8v.01"/>',
    cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    fallo: '<path d="M3 12h6.5l1.5-3 2 6 1.5-3H21"/><path d="M10 4.5 14 19.5" stroke-dasharray="1.5 2"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    caso: '<rect x="3.5" y="6.5" width="17" height="13"/><path d="M8.5 6.5V4h7v2.5M3.5 12h17M11 12v2h2v-2"/>',
    capas: '<path d="M12 3.5 21 8l-9 4.5L3 8z"/><path d="M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5"/>',
    mapa: '<path d="M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    tour: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z"/>',
    ajustes: '<path d="M4 7h10M18 7h2M4 17h3M11 17h9"/><circle cx="16" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    flecha: '<path d="M4 12h15M14 7l5 5-5 5"/>',
    candado: '<rect x="5" y="11" width="14" height="9.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    enlace: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7.2 12h9.6"/>',
    alarma: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    traza: '<circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 5h4v14H7M11 12h6"/>',
    documento: '<path d="M6 2.5h8l4.5 4.5v14.5H6z"/><path d="M14 2.5V7h4.5M9 12h6M9 15.5h6"/>',
    experto: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="10" cy="18" r="1.6"/>',
    simple: '<path d="M4 8h16M4 16h16"/><circle cx="12" cy="8" r="1.6"/><circle cx="12" cy="16" r="1.6"/>'
  };
  // Alias: claves del motor (CLASES_SERVICIO, tipo de nodo, severidad) -> icono
  var ALIAS = { movil: "embb", empresa: "l2vpn", core: "dc", site: "sitio", unk: "down", caido: "down", grave: "crit",
    sat: "ntn", wdm: "metro", mpls: "enlace", backhaul: "agg", acceso: "sitio", simulación: "simulacion", análisis: "analisis" };
  window.NOC_ICONOS = { trazos: P, alias: ALIAS };
})();
