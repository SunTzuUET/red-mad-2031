// Datos de prueba (inventados) para desarrollar motor y visor. No usar para conclusiones.
(function () {
  var flat = function (v) { var a = []; for (var i = 0; i < 24; i++) a.push(v); return a; };
  var RED = {
    meta: { version: "mock", fecha: "2026-11-18", fuentes: [] },
    perfiles: {
      residencial: [0.3,0.2,0.15,0.1,0.1,0.15,0.3,0.45,0.5,0.5,0.55,0.6,0.65,0.65,0.6,0.6,0.65,0.7,0.8,0.9,1,1,0.85,0.5],
      empresa:     [0.05,0.05,0.05,0.05,0.05,0.1,0.3,0.7,0.95,1,1,0.95,0.8,0.85,0.95,0.9,0.8,0.6,0.3,0.15,0.1,0.1,0.05,0.05],
      iot: flat(0.8),
      evento:      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0.3,0.6,0.9,1,1,0.4,0.1],
      movilidad:   [0.1,0.05,0.05,0.05,0.1,0.3,0.7,1,0.9,0.6,0.5,0.5,0.55,0.6,0.6,0.6,0.7,0.9,1,0.8,0.5,0.4,0.3,0.2]
    },
    zonas: [
      { id: "Z-MADRID", nombre: "Madrid", area: "CENTRO", municipios: ["Madrid"], centro: [40.4168, -3.7038],
        poblacion: 3400000, abonados_fijos: 400000, abonados_moviles: 900000, agg: "AGG-MADRID", edge: "EDGE-CENTRO",
        necesidades: [
          { id: "Z-MADRID/residencial-fijo", tipo: "residencial-fijo", dl_gbps: 900, ul_gbps: 90, perfil: "residencial", destino: "internet", slice: "eMBB", prioridad: 4, supuesto: true },
          { id: "Z-MADRID/movil-ebb", tipo: "movil-ebb", dl_gbps: 400, ul_gbps: 40, perfil: "residencial", destino: "internet", slice: "eMBB", prioridad: 4, supuesto: true },
          { id: "Z-MADRID/voz-ims", tipo: "voz-ims", dl_gbps: 2, ul_gbps: 2, perfil: "empresa", destino: "ims", slice: "voz", prioridad: 1, latencia_max_ms: 20, supuesto: true }
        ] },
      { id: "Z-GETAFE", nombre: "Getafe", area: "SUR", municipios: ["Getafe"], centro: [40.3083, -3.7327],
        poblacion: 185000, abonados_fijos: 25000, abonados_moviles: 50000, agg: "AGG-GETAFE", edge: "EDGE-SUR",
        necesidades: [
          { id: "Z-GETAFE/residencial-fijo", tipo: "residencial-fijo", dl_gbps: 80, ul_gbps: 8, perfil: "residencial", destino: "internet", slice: "eMBB", prioridad: 4, supuesto: true },
          { id: "Z-GETAFE/iot", tipo: "iot", dl_gbps: 0.5, ul_gbps: 1, perfil: "iot", destino: "edge", slice: "mIoT", prioridad: 3, latencia_max_ms: 50, supuesto: true }
        ] },
      { id: "Z-ALCOBENDAS", nombre: "Alcobendas", area: "NORTE", municipios: ["Alcobendas"], centro: [40.5475, -3.6420],
        poblacion: 120000, abonados_fijos: 18000, abonados_moviles: 40000, agg: "AGG-ALCOBENDAS", edge: "EDGE-NORTE",
        necesidades: [
          { id: "Z-ALCOBENDAS/empresa", tipo: "empresa", dl_gbps: 120, ul_gbps: 60, perfil: "empresa", destino: "internet", slice: "empresa", prioridad: 3, supuesto: true }
        ] }
    ],
    nodos: [
      { id: "CORE-1", tipo: "core", nombre: "CPD 1", coord: [40.4520, -3.6900], area: "CENTRO", capacidad_gbps: 4000, funciones: ["5GC","IMS","UPF"], respaldo: "CORE-2", supuesto: true },
      { id: "CORE-2", tipo: "core", nombre: "CPD 2", coord: [40.5390, -3.6350], area: "NORTE", capacidad_gbps: 4000, funciones: ["5GC","IMS","UPF"], respaldo: "CORE-1", supuesto: true },
      { id: "EDGE-CENTRO", tipo: "edge", nombre: "Edge Centro", coord: [40.4100, -3.6900], area: "CENTRO", capacidad_gbps: 400, funciones: ["UPF","MEC"], respaldo: "EDGE-SUR", supuesto: true },
      { id: "EDGE-SUR", tipo: "edge", nombre: "Edge Sur", coord: [40.3150, -3.7500], area: "SUR", capacidad_gbps: 200, funciones: ["UPF","MEC"], respaldo: "EDGE-CENTRO", supuesto: true },
      { id: "EDGE-NORTE", tipo: "edge", nombre: "Edge Norte", coord: [40.5400, -3.6450], area: "NORTE", capacidad_gbps: 200, funciones: ["UPF","MEC"], respaldo: "EDGE-CENTRO", supuesto: true },
      { id: "AGG-MADRID", tipo: "agg", nombre: "Agregación Madrid", coord: [40.4168, -3.7038], area: "CENTRO", capacidad_gbps: null, supuesto: true },
      { id: "AGG-GETAFE", tipo: "agg", nombre: "Agregación Getafe", coord: [40.3083, -3.7327], area: "SUR", capacidad_gbps: null, supuesto: true },
      { id: "AGG-ALCOBENDAS", tipo: "agg", nombre: "Agregación Alcobendas", coord: [40.5475, -3.6420], area: "NORTE", capacidad_gbps: null, supuesto: true },
      { id: "IX-ESPANIX", tipo: "ix", nombre: "Espanix", coord: [40.4470, -3.6930], area: "CENTRO", capacidad_gbps: null, supuesto: true },
      { id: "SITE-METROPOLITANO", tipo: "site", nombre: "Estadio Metropolitano", coord: [40.4362, -3.5995], area: "CENTRO", capacidad_gbps: null, supuesto: true }
    ],
    enlaces: [
      { id: "L-CORE1-CORE2", a: "CORE-1", b: "CORE-2", tipo: "wdm", capacidad_gbps: 1600, km: 14, proteccion: "anillo", supuesto: true },
      { id: "L-CORE1-EDGECENTRO", a: "CORE-1", b: "EDGE-CENTRO", tipo: "wdm", capacidad_gbps: 800, km: 6, proteccion: "anillo", supuesto: true },
      { id: "L-EDGECENTRO-EDGESUR", a: "EDGE-CENTRO", b: "EDGE-SUR", tipo: "wdm", capacidad_gbps: 400, km: 13, proteccion: "anillo", supuesto: true },
      { id: "L-EDGESUR-CORE1", a: "EDGE-SUR", b: "CORE-1", tipo: "wdm", capacidad_gbps: 400, km: 18, proteccion: "anillo", supuesto: true },
      { id: "L-CORE2-EDGENORTE", a: "CORE-2", b: "EDGE-NORTE", tipo: "wdm", capacidad_gbps: 400, km: 2, proteccion: "anillo", supuesto: true },
      { id: "L-EDGENORTE-CORE1", a: "EDGE-NORTE", b: "CORE-1", tipo: "wdm", capacidad_gbps: 400, km: 12, proteccion: "anillo", supuesto: true },
      { id: "L-AGGMADRID-EDGECENTRO", a: "AGG-MADRID", b: "EDGE-CENTRO", tipo: "mpls", capacidad_gbps: 1600, km: 2, supuesto: true },
      { id: "L-AGGMADRID-CORE1", a: "AGG-MADRID", b: "CORE-1", tipo: "mpls", capacidad_gbps: 800, km: 4, supuesto: true },
      { id: "L-AGGGETAFE-EDGESUR", a: "AGG-GETAFE", b: "EDGE-SUR", tipo: "mpls", capacidad_gbps: 200, km: 2, supuesto: true },
      { id: "L-AGGGETAFE-EDGECENTRO", a: "AGG-GETAFE", b: "EDGE-CENTRO", tipo: "mpls", capacidad_gbps: 100, km: 12, supuesto: true },
      { id: "L-AGGALCOBENDAS-EDGENORTE", a: "AGG-ALCOBENDAS", b: "EDGE-NORTE", tipo: "mpls", capacidad_gbps: 200, km: 1, supuesto: true },
      { id: "L-CORE1-IXESPANIX", a: "CORE-1", b: "IX-ESPANIX", tipo: "ix", capacidad_gbps: 2000, km: 1, supuesto: true },
      { id: "L-CORE2-IXESPANIX", a: "CORE-2", b: "IX-ESPANIX", tipo: "ix", capacidad_gbps: 2000, km: 12, supuesto: true },
      { id: "L-SITEMETRO-EDGECENTRO", a: "SITE-METROPOLITANO", b: "EDGE-CENTRO", tipo: "backhaul", capacidad_gbps: 200, km: 9, supuesto: true }
    ],
    servicios: [
      { id: "S-ESTADIO", nombre: "Estadio Metropolitano (50k)", zona: "Z-MADRID", nodo: "SITE-METROPOLITANO", coord: [40.4362, -3.5995],
        conecta_a: "EDGE-CENTRO", capacidad_acceso_gbps: 200, dl_gbps: 150, ul_gbps: 60, perfil: "evento", destino: "edge", edge: "EDGE-CENTRO",
        slice: "eMBB-evento", prioridad: 3, latencia_max_ms: 20, supuesto: true }
    ],
    slices: [
      { id: "voz", nombre: "Voz IMS/VoNR", sst: 1, prioridad: 1, latencia_max_ms: 20 },
      { id: "eMBB", nombre: "Banda ancha", sst: 1, prioridad: 4 },
      { id: "mIoT", nombre: "IoT masivo", sst: 3, prioridad: 3 }
    ],
    escenarios: [
      { id: "normal", nombre: "Hora cargada normal", descripcion: "Demanda base", hora: 21, factores: {}, fallos: [] },
      { id: "evento", nombre: "Partido en el Metropolitano", descripcion: "Pico del estadio", hora: 21, factores: { "S-ESTADIO": 1.0 }, fallos: [] },
      { id: "corte-sur", nombre: "Corte de fibra Edge Sur–Centro", descripcion: "", hora: 21, factores: {}, fallos: ["L-EDGECENTRO-EDGESUR"] },
      { id: "caida-edge-sur", nombre: "Caída del Edge Sur", descripcion: "", hora: 12, factores: {}, fallos: ["EDGE-SUR"] }
    ]
  };
  if (typeof module !== "undefined" && module.exports) module.exports = RED; else window.RED = RED;
})();
