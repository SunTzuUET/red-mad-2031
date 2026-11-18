// Generado por fusionar.py — no editar a mano. Editar datos/*.json y volver a fusionar.
var RED = {
 "meta": {
  "version": "2026-11-18",
  "fecha": "2026-11-18",
  "fuentes": [
   "datos/zonas.json",
   "datos/red_fisica.json",
   "datos/servicios.json",
   "datos/integracion.json"
  ]
 },
 "perfiles": {
  "residencial": [
   0.272,
   0.163,
   0.109,
   0.082,
   0.073,
   0.091,
   0.163,
   0.272,
   0.345,
   0.363,
   0.381,
   0.4,
   0.436,
   0.454,
   0.436,
   0.418,
   0.454,
   0.527,
   0.618,
   0.727,
   0.836,
   1.0,
   0.817,
   0.563
  ],
  "empresa": [
   0.05,
   0.04,
   0.04,
   0.04,
   0.05,
   0.08,
   0.2,
   0.5,
   0.85,
   0.97,
   1.0,
   0.98,
   0.9,
   0.75,
   0.8,
   0.9,
   0.85,
   0.7,
   0.45,
   0.25,
   0.15,
   0.1,
   0.08,
   0.06
  ],
  "iot": [
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0,
   1.0
  ],
  "evento": [
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0.05,
   0.15,
   0.4,
   0.8,
   1.0,
   1.0,
   0.5,
   0.1
  ],
  "movilidad": [
   0.1,
   0.05,
   0.04,
   0.04,
   0.08,
   0.25,
   0.65,
   1.0,
   0.95,
   0.6,
   0.45,
   0.45,
   0.5,
   0.55,
   0.6,
   0.65,
   0.75,
   0.95,
   1.0,
   0.8,
   0.5,
   0.35,
   0.25,
   0.15
  ]
 },
 "zonas": [
  {
   "id": "Z-MADRID",
   "nombre": "Madrid",
   "area": "CENTRO",
   "municipios": [
    "Madrid"
   ],
   "centro": [
    40.4168,
    -3.7038
   ],
   "poblacion": 3663020,
   "poblacion_2025": 3477497,
   "abonados_fijos": 454317,
   "abonados_moviles": 1235192,
   "lineas_datos_moviles": 1071243,
   "agg": "AGG-MADRID",
   "edge": "EDGE-CENTRO",
   "necesidades": [
    {
     "id": "Z-MADRID/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 1395.116,
     "ul_gbps": 155.013,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.66 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-1": 1
     }
    },
    {
     "id": "Z-MADRID/empresa",
     "tipo": "empresa",
     "dl_gbps": 720.034,
     "ul_gbps": 80.004,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.34 del fijo; 297693 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-1": 1
     }
    },
    {
     "id": "Z-MADRID/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 254.915,
     "ul_gbps": 44.985,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-MADRID/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 37.06,
     "ul_gbps": 37.06,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-MADRID/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 26.386,
     "ul_gbps": 26.386,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (CENTRO), no por municipio: el municipio recibe 100.0 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 73.323 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área CENTRO suma 164.688/93.752 Gbit/s DL/UL: evento Metropolitano 164,688/88,750 + IoT/cámaras Valdebebas 0/5,002). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-ALCOBENDAS",
   "nombre": "Alcobendas",
   "area": "NORTE",
   "municipios": [
    "Alcobendas"
   ],
   "centro": [
    40.5475,
    -3.642
   ],
   "poblacion": 134960,
   "poblacion_2025": 123222,
   "abonados_fijos": 16739,
   "abonados_moviles": 45509,
   "lineas_datos_moviles": 39469,
   "agg": "AGG-ALCOBENDAS",
   "edge": null,
   "necesidades": [
    {
     "id": "Z-ALCOBENDAS/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 48.398,
     "ul_gbps": 5.378,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.621 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-2": 1
     }
    },
    {
     "id": "Z-ALCOBENDAS/empresa",
     "tipo": "empresa",
     "dl_gbps": 29.533,
     "ul_gbps": 3.281,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.379 del fijo; 10393 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-2": 1
     }
    },
    {
     "id": "Z-ALCOBENDAS/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 9.392,
     "ul_gbps": 1.657,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-ALCOBENDAS/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.3652,
     "ul_gbps": 1.3652,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-ALCOBENDAS/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.9722,
     "ul_gbps": 0.9722,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (NORTE), no por municipio: el municipio recibe 69.3 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 3.898 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área NORTE suma 0.0/0.0 Gbit/s DL/UL: ninguno). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Edge: Norte no tiene Edge (S7 apartado 5); edge = null: sus demandas con destino edge irían al CPD más cercano (DC-Norte)."
  },
  {
   "id": "Z-TRESCANTOS",
   "nombre": "Tres Cantos",
   "area": "NORTE",
   "municipios": [
    "Tres Cantos"
   ],
   "centro": [
    40.6006,
    -3.7084
   ],
   "poblacion": 59792,
   "poblacion_2025": 54592,
   "abonados_fijos": 7416,
   "abonados_moviles": 20162,
   "lineas_datos_moviles": 17486,
   "agg": "AGG-TRESCANTOS",
   "edge": null,
   "necesidades": [
    {
     "id": "Z-TRESCANTOS/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 23.658,
     "ul_gbps": 2.629,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.685 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-2": 1
     }
    },
    {
     "id": "Z-TRESCANTOS/empresa",
     "tipo": "empresa",
     "dl_gbps": 10.868,
     "ul_gbps": 1.208,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.315 del fijo; 3586 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-2": 1
     }
    },
    {
     "id": "Z-TRESCANTOS/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 4.161,
     "ul_gbps": 0.734,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-TRESCANTOS/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 0.6048,
     "ul_gbps": 0.6048,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-TRESCANTOS/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.4307,
     "ul_gbps": 0.4307,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (NORTE), no por municipio: el municipio recibe 30.7 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 3.898 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área NORTE suma 0.0/0.0 Gbit/s DL/UL: ninguno). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Edge: Norte no tiene Edge (S7 apartado 5); edge = null: sus demandas con destino edge irían al CPD más cercano (DC-Norte)."
  },
  {
   "id": "Z-TORREJON",
   "nombre": "Torrejón de Ardoz",
   "area": "ESTE",
   "municipios": [
    "Torrejón de Ardoz"
   ],
   "centro": [
    40.457,
    -3.478
   ],
   "poblacion": 150997,
   "poblacion_2025": 144211,
   "abonados_fijos": 18728,
   "abonados_moviles": 50917,
   "lineas_datos_moviles": 44159,
   "agg": "AGG-TORREJON",
   "edge": "EDGE-ESTE",
   "necesidades": [
    {
     "id": "Z-TORREJON/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 66.949,
     "ul_gbps": 7.439,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.768 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-2": 0.5,
      "CORE-3": 0.5
     }
    },
    {
     "id": "Z-TORREJON/empresa",
     "tipo": "empresa",
     "dl_gbps": 20.241,
     "ul_gbps": 2.249,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.232 del fijo; 6457 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-2": 0.5,
      "CORE-3": 0.5
     }
    },
    {
     "id": "Z-TORREJON/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 10.508,
     "ul_gbps": 1.854,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-TORREJON/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.5263,
     "ul_gbps": 1.5263,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-TORREJON/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.0877,
     "ul_gbps": 1.0877,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (ESTE), no por municipio: el municipio recibe 41.59 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 7.268 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área ESTE suma 0.045/0.045 Gbit/s DL/UL: V2X A-2 0,045/0,045). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-ALCALA",
   "nombre": "Alcalá de Henares",
   "area": "ESTE",
   "municipios": [
    "Alcalá de Henares"
   ],
   "centro": [
    40.4819,
    -3.3635
   ],
   "poblacion": 212080,
   "poblacion_2025": 202549,
   "abonados_fijos": 26304,
   "abonados_moviles": 71515,
   "lineas_datos_moviles": 62022,
   "agg": "AGG-ALCALA",
   "edge": "EDGE-ESTE",
   "necesidades": [
    {
     "id": "Z-ALCALA/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 93.156,
     "ul_gbps": 10.351,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.761 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-2": 0.5,
      "CORE-3": 0.5
     }
    },
    {
     "id": "Z-ALCALA/empresa",
     "tipo": "empresa",
     "dl_gbps": 29.306,
     "ul_gbps": 3.256,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.239 del fijo; 9786 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-2": 0.5,
      "CORE-3": 0.5
     }
    },
    {
     "id": "Z-ALCALA/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 14.759,
     "ul_gbps": 2.605,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-ALCALA/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.1437,
     "ul_gbps": 2.1437,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-ALCALA/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.5277,
     "ul_gbps": 1.5277,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (ESTE), no por municipio: el municipio recibe 58.41 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 7.268 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área ESTE suma 0.045/0.045 Gbit/s DL/UL: V2X A-2 0,045/0,045). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-GETAFE",
   "nombre": "Getafe",
   "area": "SUR",
   "municipios": [
    "Getafe"
   ],
   "centro": [
    40.3083,
    -3.7327
   ],
   "poblacion": 199933,
   "poblacion_2025": 195628,
   "abonados_fijos": 24797,
   "abonados_moviles": 67419,
   "lineas_datos_moviles": 58470,
   "agg": "AGG-GETAFE",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-GETAFE/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 88.165,
     "ul_gbps": 9.796,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.764 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-GETAFE/empresa",
     "tipo": "empresa",
     "dl_gbps": 27.283,
     "ul_gbps": 3.031,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.236 del fijo; 9655 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-GETAFE/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.914,
     "ul_gbps": 2.455,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-GETAFE/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.0229,
     "ul_gbps": 2.0229,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-GETAFE/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.4402,
     "ul_gbps": 1.4402,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 25.8 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 15.511 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-LEGANES",
   "nombre": "Leganés",
   "area": "SUR",
   "municipios": [
    "Leganés"
   ],
   "centro": [
    40.3281,
    -3.7644
   ],
   "poblacion": 200258,
   "poblacion_2025": 195946,
   "abonados_fijos": 24838,
   "abonados_moviles": 67528,
   "lineas_datos_moviles": 58565,
   "agg": "AGG-LEGANES",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-LEGANES/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 89.114,
     "ul_gbps": 9.902,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.771 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-LEGANES/empresa",
     "tipo": "empresa",
     "dl_gbps": 26.522,
     "ul_gbps": 2.947,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.229 del fijo; 9301 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-LEGANES/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.936,
     "ul_gbps": 2.459,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-LEGANES/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.0262,
     "ul_gbps": 2.0262,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-LEGANES/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.4425,
     "ul_gbps": 1.4425,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 25.84 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 15.511 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-FUENLABRADA",
   "nombre": "Fuenlabrada",
   "area": "SUR",
   "municipios": [
    "Fuenlabrada"
   ],
   "centro": [
    40.2842,
    -3.7942
   ],
   "poblacion": 193992,
   "poblacion_2025": 189814,
   "abonados_fijos": 24060,
   "abonados_moviles": 65415,
   "lineas_datos_moviles": 56732,
   "agg": "AGG-FUENLABRADA",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-FUENLABRADA/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 82.43,
     "ul_gbps": 9.159,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.736 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-FUENLABRADA/empresa",
     "tipo": "empresa",
     "dl_gbps": 29.587,
     "ul_gbps": 3.287,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.264 del fijo; 10090 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-FUENLABRADA/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.5,
     "ul_gbps": 2.382,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-FUENLABRADA/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.9627,
     "ul_gbps": 1.9627,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-FUENLABRADA/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.3974,
     "ul_gbps": 1.3974,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 25.04 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 15.511 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  },
  {
   "id": "Z-ALCORCON",
   "nombre": "Alcorcón",
   "area": "SUR",
   "municipios": [
    "Alcorcón"
   ],
   "centro": [
    40.3458,
    -3.8249
   ],
   "poblacion": 180697,
   "poblacion_2025": 176806,
   "abonados_fijos": 22412,
   "abonados_moviles": 60932,
   "lineas_datos_moviles": 52845,
   "agg": "AGG-ALCORCON",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-ALCORCON/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 79.345,
     "ul_gbps": 8.816,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.76 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-ALCORCON/empresa",
     "tipo": "empresa",
     "dl_gbps": 24.995,
     "ul_gbps": 2.777,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.24 del fijo; 8883 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "reparto_cores": {
      "CORE-3": 1
     }
    },
    {
     "id": "Z-ALCORCON/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 12.575,
     "ul_gbps": 2.219,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta."
    },
    {
     "id": "Z-ALCORCON/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.8282,
     "ul_gbps": 1.8282,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada)."
    },
    {
     "id": "Z-ALCORCON/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.3016,
     "ul_gbps": 1.3016,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas."
    }
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A4 (población 2031 total 4 995 732,76), A6 y Tabla 8 (reparto por zona Metro); Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md · T1 (ECP 2025), T3, T4",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 23.32 % de su área según ECP 2025 (supuesto: mismo crecimiento 2025-2031 dentro del área). Peso del área en la red 15.511 % (Tabla 8/A11.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = 4 995 732,76 × peso. Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil)."
  }
 ],
 "nodos": [
  {
   "id": "CORE-1",
   "tipo": "core",
   "nombre": "DC-Centro",
   "area": "CENTRO",
   "coord": [
    40.4344,
    -3.6252
   ],
   "capacidad_gbps": 3821.2,
   "capacidad_detalle": {
    "bng_gbps": 3600,
    "upf_central_gbps": 221.2,
    "nota": "BNG: 3 chasis 7750 SR-2se activos x 3x400G lado red (+3 en reserva 1:1 en el mismo DC). UPF: 199,10/0,90."
   },
   "latencia_ms": 0.2,
   "funciones": [
    "5GC (AMF/SMF/PCF/NRF/NSSF/NEF)",
    "UDM/UDR/AUSF/HSS",
    "IMS (CSCF/TAS)",
    "IBCF/SBC+TrGW",
    "UPF central",
    "BNG-UP",
    "router de borde",
    "OSS (telemetría, inventario)"
   ],
   "respaldo": "CORE-3",
   "respaldo_reparto": {
    "CORE-2": 0.5,
    "CORE-3": 0.5
   },
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 y §7 (DC en Centro, Norte y Sur; BNG por DC); Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.3-4.4 (BNG); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 y Tabla 6.6b (UPF central, reparto 1/3 y 1/2); Semana 7/Teams (descargado 2026-11-08)/3.1_Diego_semana2_core_edge_transporte_resiliencia_v1.1.pdf §5.1 (activo-activo, OSS en DC-Centro/Norte)",
   "supuesto": true,
   "nota": "Emplazamiento: los documentos solo dicen 'junto a su nodo metro' (3.2 H-E2, 2.1-S5d §4.1). Se elige la zona Julián Camarillo-Albasanz (San Blas-Canillejas), polígono con varios CPD y centrales reales, cerca del Metropolitano y de Valdebebas. Respaldo: KPIs v5 = 1/2 a cada DC superviviente; 'respaldo' indica el DC vivo más cercano, que 2.1-S5d usa como hipótesis para el fijo. El BNG de reserva está en el mismo DC (2.2 §4.7): si cae el DC se pierde también la reserva y Norte/Sur no tienen BNG para absorber los 2.115 Gbit/s del fijo de Centro.",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio."
  },
  {
   "id": "CORE-2",
   "tipo": "core",
   "nombre": "DC-Norte",
   "area": "NORTE",
   "coord": [
    40.5388,
    -3.6383
   ],
   "capacidad_gbps": 621.2,
   "capacidad_detalle": {
    "bng_gbps": 400,
    "upf_central_gbps": 221.2,
    "nota": "BNG: 1 chasis activo x 1x400G lado red (+1 reserva). Atiende Norte + 50 % de Este."
   },
   "latencia_ms": 0.2,
   "funciones": [
    "5GC (AMF/SMF/PCF/NRF/NSSF/NEF)",
    "UDM/UDR/AUSF/HSS",
    "IMS (CSCF/TAS)",
    "IBCF/SBC+TrGW",
    "UPF central",
    "BNG-UP",
    "router de borde",
    "OSS (telemetría, inventario)"
   ],
   "respaldo": "CORE-1",
   "respaldo_reparto": {
    "CORE-1": 0.5,
    "CORE-3": 0.5
   },
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 y §7; Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1-4.4; Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 y Tabla 6.6b; Semana 1/2.1 Arquitectura/explicacion_topologia_madrid_subgrupo_2_1.pdf §4 (Norte, actividad de CPD, candidato a core)",
   "supuesto": true,
   "nota": "Emplazamiento plausible: polígono industrial de Alcobendas (entorno C/ Valgrande, zona con CPD comerciales). Documentos: solo 'Norte, junto a su nodo metro'.",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio."
  },
  {
   "id": "CORE-3",
   "tipo": "core",
   "nombre": "DC-Sur",
   "area": "SUR",
   "coord": [
    40.3233,
    -3.7078
   ],
   "capacidad_gbps": 1021.2,
   "capacidad_detalle": {
    "bng_gbps": 800,
    "upf_central_gbps": 221.2,
    "nota": "BNG: 1 chasis activo x 2x400G lado red (+1 reserva), 69 % en normal. Atiende Sur + 50 % de Este."
   },
   "latencia_ms": 0.2,
   "funciones": [
    "5GC (AMF/SMF/PCF/NRF/NSSF/NEF)",
    "UDM/UDR/AUSF/HSS",
    "IMS (CSCF/TAS)",
    "IBCF/SBC+TrGW",
    "UPF central",
    "BNG-UP",
    "router de borde"
   ],
   "respaldo": "CORE-1",
   "respaldo_reparto": {
    "CORE-1": 0.5,
    "CORE-2": 0.5
   },
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 y §7; Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1-4.4; Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 y Tabla 6.6b; Semana 1/2.1 Arquitectura/explicacion_topologia_madrid_subgrupo_2_1.pdf §6 (justificación del tercer DC)",
   "supuesto": true,
   "nota": "Emplazamiento plausible: polígono industrial Los Ángeles (Getafe norte, junto a la A-4). Documentos: solo 'Sur, junto a su nodo metro'. El tercer DC está cerrado (3.1 v1.1 §9 #4: '3 DC').",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio."
  },
  {
   "id": "MET-CENTRO",
   "tipo": "metro",
   "nombre": "Metro-Centro (PE-A)",
   "area": "CENTRO",
   "coord": [
    40.435,
    -3.6268
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "PE IP/MPLS (RSVP-TE, FRR)",
    "WDM/OTN (7λ x 400G por enlace)",
    "agregación"
   ],
   "respaldo": "MET-CENTRO-B",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §3, §5, §6.1 (anillo C-N-E-S, Nokia 7750 SR + 1830 PSS candidatos); 20 µs por salto (3.1 respuesta 27/10, citada en S5d §2)",
   "supuesto": true,
   "nota": "Emplazamiento plausible (San Blas, mismo edificio que DC-Centro y Edge-Centro, según 'DC y Edge junto a su nodo metro'). Concentra el 74,6 % de la demanda (S5d §3.3). Capacidad de conmutación sin dato (null)."
  },
  {
   "id": "MET-CENTRO-B",
   "tipo": "metro",
   "nombre": "Metro-Centro (PE-B, duplicado)",
   "area": "CENTRO",
   "coord": [
    40.4353,
    -3.626
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "PE IP/MPLS (RSVP-TE, FRR)",
    "WDM/OTN (7λ x 400G por enlace)",
    "agregación"
   ],
   "respaldo": "MET-CENTRO",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.3 y §6.1 (router de agregación duplicado en Metro-Centro); Semana 7/Teams (descargado 2026-11-08)/3.1_Diego_semana2_core_edge_transporte_resiliencia_v1.1.pdf §6 F2 (acceso y DC conectados a los dos)",
   "supuesto": true,
   "nota": "Segundo PE de Metro-Centro. Se supone en el mismo edificio: 3.1 (R1) pide edificios distintos, pero 2.1 no lo fija. Qué enlaces llegan a cada PE (A del anillo a PE-A, B del anillo a PE-B; C-DC a PE-A; C-DS a PE-B) es un supuesto de este modelo."
  },
  {
   "id": "MET-NORTE",
   "tipo": "metro",
   "nombre": "Metro-Norte",
   "area": "NORTE",
   "coord": [
    40.5395,
    -3.6395
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "PE IP/MPLS (RSVP-TE, FRR)",
    "WDM/OTN (7λ x 400G por enlace)",
    "agregación"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §3, §5, §6.1 (anillo C-N-E-S, Nokia 7750 SR + 1830 PSS candidatos)",
   "supuesto": true,
   "nota": "Emplazamiento plausible: polígono industrial de Alcobendas, junto a DC-Norte. Un solo PE (sin doble PE)."
  },
  {
   "id": "MET-ESTE",
   "tipo": "metro",
   "nombre": "Metro-Este",
   "area": "ESTE",
   "coord": [
    40.448,
    -3.48
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "PE IP/MPLS (RSVP-TE, FRR)",
    "WDM/OTN (7λ x 400G por enlace)",
    "agregación"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §3, §5, §6.1 (anillo C-N-E-S, Nokia 7750 SR + 1830 PSS candidatos)",
   "supuesto": true,
   "nota": "Emplazamiento plausible: polígono Las Monjas (Torrejón de Ardoz), junto a la A-2 y cerca de Barajas, junto a Edge-Este. Un solo PE. Este no tiene DC."
  },
  {
   "id": "MET-SUR",
   "tipo": "metro",
   "nombre": "Metro-Sur",
   "area": "SUR",
   "coord": [
    40.324,
    -3.709
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "PE IP/MPLS (RSVP-TE, FRR)",
    "WDM/OTN (7λ x 400G por enlace)",
    "agregación"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §3, §5, §6.1 (anillo C-N-E-S, Nokia 7750 SR + 1830 PSS candidatos)",
   "supuesto": true,
   "nota": "Emplazamiento plausible: polígono Los Ángeles (Getafe), junto a DC-Sur y Edge-Sur. Un solo PE."
  },
  {
   "id": "EDGE-CENTRO",
   "tipo": "edge",
   "nombre": "Edge-Centro",
   "area": "CENTRO",
   "coord": [
    40.4357,
    -3.6278
   ],
   "capacidad_gbps": 258.8,
   "latencia_ms": 0.2,
   "funciones": [
    "UPF local pública",
    "MEC",
    "GPU (analítica de vídeo)",
    "CDN/caché estadio"
   ],
   "servicios": [
    "Estadio Metropolitano (DNN evento)",
    "Cámaras Smart City Valdebebas (DNN video-ciudad)"
   ],
   "respaldo": "EDGE-ESTE",
   "respaldo_pct": {
    "estadio": 0.6,
    "camaras_streams_grabacion": 1.0,
    "camaras_analitica": 0.3
   },
   "respaldo_de": [
    "EDGE-ESTE",
    "EDGE-SUR"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §3, §4.1 y §6 (placement y respaldo definitivos); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.1-6.4 (NIC mínima 258,795 Gbit/s en normal; 24 servidores)",
   "supuesto": true,
   "nota": "Ubicación: 'junto a su nodo metro' (S5d §1); coordenada = Metro-Centro. capacidad_gbps = capacidad NIC mínima de 3.2 (caso normal, ya con 70 %). Nunca recibe Este y Sur a la vez (DATO 2.1, 3.1 S5 §5.1)."
  },
  {
   "id": "EDGE-ESTE",
   "tipo": "edge",
   "nombre": "Edge-Este",
   "area": "ESTE",
   "coord": [
    40.4485,
    -3.479
   ],
   "capacidad_gbps": 120.8,
   "latencia_ms": 0.2,
   "funciones": [
    "UPF local pública",
    "MEC",
    "GPU (respaldo analítica)"
   ],
   "servicios": [
    "V2X Carretera Conectada A-2 (DNN v2x)"
   ],
   "respaldo": "EDGE-CENTRO",
   "respaldo_de": [
    "EDGE-CENTRO"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §3, §4.2 y §6; Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.1-6.4 (NIC 120,83 Gbit/s al recibir Centro; 9 servidores)",
   "supuesto": true,
   "nota": "Ubicación: 'junto a su nodo metro' (S5d §1), Torrejón junto a la A-2. capacidad_gbps = NIC mínima en el caso que manda (recibe Edge-Centro, al 90 %)."
  },
  {
   "id": "EDGE-SUR",
   "tipo": "edge",
   "nombre": "Edge-Sur",
   "area": "SUR",
   "coord": [
    40.3245,
    -3.71
   ],
   "capacidad_gbps": 1.3,
   "latencia_ms": 0.2,
   "funciones": [
    "UPF local pública (hospital)",
    "UPF privada (industria, PNI-NPN tipo A)",
    "MEC"
   ],
   "servicios": [
    "Hospital Conectado Getafe (DNN salud)",
    "5G privada logística e industria (DNN industria-sur)"
   ],
   "respaldo": "EDGE-CENTRO",
   "respaldo_de": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §3, §4.3 y §6; Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.2-6.5 (NIC 1,261 Gbit/s; 3 servidores con 24 h de vídeo)",
   "supuesto": true,
   "nota": "Ubicación: 'junto a su nodo metro' (S5d §1), Getafe. capacidad_gbps = NIC mínima de 3.2 (1,261 redondeado). No hay Edge-Norte (2.1 semana 1 §7; 3.2 §5: 'Norte no tiene Edge')."
  },
  {
   "id": "AGG-MADRID",
   "tipo": "agg",
   "nombre": "Agregación Madrid",
   "area": "CENTRO",
   "coord": [
    40.4168,
    -3.7038
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-ALCOBENDAS",
   "tipo": "agg",
   "nombre": "Agregación Alcobendas",
   "area": "NORTE",
   "coord": [
    40.5475,
    -3.642
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-TRESCANTOS",
   "tipo": "agg",
   "nombre": "Agregación Tres Cantos",
   "area": "NORTE",
   "coord": [
    40.6006,
    -3.7084
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-TORREJON",
   "tipo": "agg",
   "nombre": "Agregación Torrejón de Ardoz",
   "area": "ESTE",
   "coord": [
    40.457,
    -3.478
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-ALCALA",
   "tipo": "agg",
   "nombre": "Agregación Alcalá de Henares",
   "area": "ESTE",
   "coord": [
    40.4819,
    -3.3635
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-GETAFE",
   "tipo": "agg",
   "nombre": "Agregación Getafe",
   "area": "SUR",
   "coord": [
    40.3083,
    -3.7327
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-LEGANES",
   "tipo": "agg",
   "nombre": "Agregación Leganés",
   "area": "SUR",
   "coord": [
    40.3281,
    -3.7644
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-FUENLABRADA",
   "tipo": "agg",
   "nombre": "Agregación Fuenlabrada",
   "area": "SUR",
   "coord": [
    40.2842,
    -3.7942
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json."
  },
  {
   "id": "AGG-ALCORCON",
   "tipo": "agg",
   "nombre": "Agregación Alcorcón",
   "area": "SUR",
   "coord": [
    40.3458,
    -3.8249
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.08,
   "funciones": [
    "OLT XGS-PON (Nokia Lightspan MF-14)",
    "agregación RAN (backhaul 5G)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (acceso de cada site a su nodo metro con ≤20 km y 4 saltos -> 0,08 ms); coordenada = centro de la zona en Simulador red/datos/zonas.json",
   "supuesto": true,
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json. Alcorcón tiene dos centrales FTTH (A y B, 50/50) sin ubicación fijada (Semana 6/Teams (descargado 2026-11-02)/Diseno_FTTH_Alcorcon_Grupo_2_1_cerrado.docx §5); aquí se agregan en un nodo. Dos centrales no equivalen a protección 1+1."
  },
  {
   "id": "IX-INTERNET",
   "tipo": "ix",
   "nombre": "Internet: peering/tránsito (Espanix / DE-CIX Madrid)",
   "area": "CENTRO",
   "coord": [
    40.4386,
    -3.619
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "peering IP",
    "tránsito Internet"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (salida a Internet por los routers de borde de los DC); Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.1 (routers de borde en los DC)",
   "supuesto": true,
   "nota": "Ningún documento fija el punto de peering. Se usa el carrier hotel de C/ Albasanz (San Blas), donde están presentes Espanix y DE-CIX Madrid. Un solo nodo lógico: la diversidad de puntos de peering no está diseñada.",
   "transito": false,
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios."
  },
  {
   "id": "IX-IMS",
   "tipo": "ix",
   "nombre": "Interconexión IMS con otros operadores",
   "area": "CENTRO",
   "coord": [
    40.439,
    -3.6182
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "interconexión IMS (IBCF/SBC, TrGW)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx Tabla 1 (interconexión 100 % IMS, sin CS); Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (Ribbon SBC SWe, 13 instancias por DC); Semana 7/Teams (descargado 2026-11-08)/3.1_Diego_semana2_core_edge_transporte_resiliencia_v1.1.pdf §5.1 (IBCF/SBC en ≥2 DC, dos puntos de interconexión)",
   "supuesto": true,
   "nota": "Punto físico de interconexión no definido (3.1 R7 'por confirmar con 2.1'; 3.1 v1.1 §9 #6 'abierto'). Se supone en el mismo carrier hotel que IX-INTERNET. No hay interconexión CS: decisión docente del 13/10 (el enunciado ARCO04 pedía un operador CS).",
   "transito": false,
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios."
  },
  {
   "id": "IX-ONEWEB",
   "tipo": "ix",
   "nombre": "Hub satélite OneWeb (Arganda del Rey)",
   "area": "ESTE",
   "coord": [
    40.3,
    -3.445
   ],
   "capacidad_gbps": null,
   "latencia_ms": 0.02,
   "funciones": [
    "gateway satélite LEO (respaldo de emergencia)"
   ],
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (OneWeb, hub en Arganda [DATO catálogo 27/10]; VRF hasta el DC más cercano [HYP])",
   "supuesto": true,
   "nota": "Coordenada aproximada de Arganda del Rey (polígono industrial); el catálogo solo dice 'hub en Arganda'. Solo servicios prioritarios; no sustituye al anillo.",
   "transito": false,
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios."
  },
  {
   "id": "SITE-L2VPN-SUR",
   "tipo": "site",
   "nombre": "Sede L2VPN Sur · URJC, Campus de Alcorcón",
   "coord": [
    40.3463,
    -3.8436
   ],
   "area": "SUR",
   "capacidad_gbps": null,
   "funciones": [
    "L2VPN"
   ],
   "conecta_a": "MET-SUR",
   "capacidad_acceso_gbps": 10,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona)",
   "supuesto": true,
   "nota": "Sede Sur de la L2VPN (solo aparece como destino en servicios.json). Coordenadas aproximadas del campus; acceso 10 GbE a MET-SUR como las demás sedes."
  },
  {
   "id": "SITE-METROPOLITANO",
   "tipo": "site",
   "nombre": "Estadio Metropolitano · QoD de prensa",
   "coord": [
    40.4362,
    -3.5995
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (tabla del 60 %, prioridad 1: 0 / 1,00 Gbit/s con +25 %) y §2 (5QI 71, ARP 5)",
   "supuesto": true
  },
  {
   "id": "SITE-VALDEBEBAS",
   "tipo": "site",
   "nombre": "Smart City Valdebebas · 5 000 cámaras RedCap",
   "coord": [
    40.4815,
    -3.618
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5, A8 (5 000 × 0,8 Mbit/s ×1,25 = 5,00 Gbit/s UL), Tabla 10; Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3",
   "supuesto": false
  },
  {
   "id": "SITE-A2-V2X",
   "tipo": "site",
   "nombre": "Carretera Conectada A-2 · avisos V2N",
   "coord": [
    40.456,
    -3.478
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (1 000 vehículos × 300 B × 10 Hz ×1,5 = 0,036 → 0,045 Gbit/s con +25 %); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2 (tramo 34 km, 5,5 ms de ida); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2, §4.3 y §5.5",
   "supuesto": true
  },
  {
   "id": "SITE-HOSPITAL-GETAFE",
   "tipo": "site",
   "nombre": "Hospital de Getafe · videoconsulta QoD",
   "coord": [
    40.3027,
    -3.74
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (DL 100×4 = 0,400; UL 0,400 + 100×0,02 = 0,402 Gbit/s; ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §3 y §5 (5QI 2 y 82, ARP 1); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §4.3-4.4",
   "supuesto": false
  },
  {
   "id": "SITE-INDUSTRIA-SUR",
   "tipo": "site",
   "nombre": "Red privada Sur · control de 10 AGV",
   "coord": [
    40.315,
    -3.713
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (AGV 0,2 Mbit/s de control UL y 0,2 DL por AGV, ×10 ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §5; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3 (AGV 3,5 ms)",
   "supuesto": true
  },
  {
   "id": "SITE-L2VPN-CENTRO",
   "tipo": "site",
   "nombre": "L2VPN EVPN E-LAN · UPM, Ciudad Universitaria ↔ Ayuntamiento de Alcobendas",
   "coord": [
    40.4489,
    -3.719
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true
  },
  {
   "id": "SITE-L2VPN-NORTE",
   "tipo": "site",
   "nombre": "L2VPN EVPN E-LAN · Ayuntamiento de Alcobendas ↔ Universidad de Alcalá",
   "coord": [
    40.5392,
    -3.6419
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true
  },
  {
   "id": "SITE-L2VPN-ESTE",
   "tipo": "site",
   "nombre": "L2VPN EVPN E-LAN · Universidad de Alcalá ↔ URJC, Campus de Alcorcón",
   "coord": [
    40.4826,
    -3.3635
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true
  },
  {
   "id": "SITE-NTN-ARGANDA",
   "tipo": "site",
   "nombre": "Satélite de emergencia OneWeb",
   "coord": [
    40.3007,
    -3.438
   ],
   "area": null,
   "capacidad_gbps": null,
   "funciones": [],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (100 / 20 Mbit/s por terminal; 5 transportables: hospital, estadio, Edge-Este y 2 de reserva; terminal → satélite → hub de Arganda → VRF hasta el DC más cercano; conmutación 60 s); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (OneWeb, hub en Arganda)",
   "supuesto": true
  }
 ],
 "enlaces": [
  {
   "id": "L-METC-METN-A",
   "a": "MET-CENTRO",
   "b": "MET-NORTE",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 20,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "C-N",
   "srlg": "SRLG-1",
   "enlace_del_tramo": "A",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace A del tramo C-N. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METCB-METN-B",
   "a": "MET-CENTRO-B",
   "b": "MET-NORTE",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 20,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "C-N",
   "srlg": "SRLG-1",
   "enlace_del_tramo": "B",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": true,
   "nota": "Enlace B del tramo C-N. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3). Supuesto: el enlace B termina en el PE-B de Metro-Centro."
  },
  {
   "id": "L-METN-METE-A",
   "a": "MET-NORTE",
   "b": "MET-ESTE",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 28,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "N-E",
   "srlg": "SRLG-2",
   "enlace_del_tramo": "A",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace A del tramo N-E. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METN-METE-B",
   "a": "MET-NORTE",
   "b": "MET-ESTE",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 28,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "N-E",
   "srlg": "SRLG-2",
   "enlace_del_tramo": "B",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace B del tramo N-E. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METE-METS-A",
   "a": "MET-ESTE",
   "b": "MET-SUR",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 38,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "E-S",
   "srlg": "SRLG-3",
   "enlace_del_tramo": "A",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace A del tramo E-S. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METE-METS-B",
   "a": "MET-ESTE",
   "b": "MET-SUR",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 38,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "E-S",
   "srlg": "SRLG-3",
   "enlace_del_tramo": "B",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace B del tramo E-S. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METS-METC-A",
   "a": "MET-SUR",
   "b": "MET-CENTRO",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 16,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "S-C",
   "srlg": "SRLG-4",
   "enlace_del_tramo": "A",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": false,
   "nota": "Enlace A del tramo S-C. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3)."
  },
  {
   "id": "L-METS-METCB-B",
   "a": "MET-SUR",
   "b": "MET-CENTRO-B",
   "tipo": "wdm",
   "capacidad_gbps": 2800,
   "km": 16,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "S-C",
   "srlg": "SRLG-4",
   "enlace_del_tramo": "B",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §2 (km: 3.1 respuesta 27/10, estimación sobre mapa x1,4), §3.3 (SRLG), §5.1 (2 enlaces de 7λ x 400G por tramo, conductos distintos donde la planta lo permita), §6.1 (LSP secundario + FRR ≤50 ms)",
   "supuesto": true,
   "nota": "Enlace B del tramo S-C. 3.2 (UPF2 §5.4) da como mínimo 6/2/4/3 x 400G por tramo (C-N/N-E/E-S/S-C) y 2.1 cota superior 7/4/4/6; los 7λ por enlace los cubren. Si A y B comparten conducto forman un solo SRLG y el tramo no queda protegido frente a un corte (S5d §3.3). Supuesto: el enlace B termina en el PE-B de Metro-Centro."
  },
  {
   "id": "L-CORE1-METC",
   "a": "CORE-1",
   "b": "MET-CENTRO",
   "tipo": "mpls",
   "capacidad_gbps": 2400,
   "km": 0.3,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "C-DC",
   "capacidad_alt_gbps": 6000,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida C-DC de 3.2: 6 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). DC en el mismo emplazamiento que su nodo metro (3.2 H-E2; S5d §4.1): puertos 400GE dentro del edificio; km supuesto 0,3. Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-CORE1-METN",
   "a": "CORE-1",
   "b": "MET-NORTE",
   "tipo": "wdm",
   "capacidad_gbps": 1600,
   "km": 20,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "N-DC",
   "capacidad_alt_gbps": null,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida N-DC de 3.2: 4 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). Segunda acometida: km supuesto = longitud del tramo de anillo paralelo (20 km); si va por el mismo conducto que el tramo comparte SRLG con él (diversidad física pendiente, UPF2 Tabla R2). Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-CORE2-METN",
   "a": "CORE-2",
   "b": "MET-NORTE",
   "tipo": "mpls",
   "capacidad_gbps": 2400,
   "km": 0.3,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "N-DN",
   "capacidad_alt_gbps": 2000,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida N-DN de 3.2: 6 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). DC en el mismo emplazamiento que su nodo metro (3.2 H-E2; S5d §4.1): puertos 400GE dentro del edificio; km supuesto 0,3. Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-CORE2-METE",
   "a": "CORE-2",
   "b": "MET-ESTE",
   "tipo": "wdm",
   "capacidad_gbps": 1600,
   "km": 28,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "E-DN",
   "capacidad_alt_gbps": null,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida E-DN de 3.2: 4 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). Segunda acometida: km supuesto = longitud del tramo de anillo paralelo (28 km); si va por el mismo conducto que el tramo comparte SRLG con él (diversidad física pendiente, UPF2 Tabla R2). Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-CORE3-METS",
   "a": "CORE-3",
   "b": "MET-SUR",
   "tipo": "mpls",
   "capacidad_gbps": 1600,
   "km": 0.3,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "S-DS",
   "capacidad_alt_gbps": 2400,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida S-DS de 3.2: 4 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). DC en el mismo emplazamiento que su nodo metro (3.2 H-E2; S5d §4.1): puertos 400GE dentro del edificio; km supuesto 0,3. Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-CORE3-METCB",
   "a": "CORE-3",
   "b": "MET-CENTRO-B",
   "tipo": "wdm",
   "capacidad_gbps": 2400,
   "km": 16,
   "proteccion": "frr",
   "anillo": null,
   "acometida": "C-DS",
   "capacidad_alt_gbps": null,
   "fuente": "Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §5.4 (conexiones propuestas y tabla de canales 400G) y A11; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.4",
   "supuesto": true,
   "nota": "Acometida C-DS de 3.2: 6 x 400G (máximo con pico P2 entre normal, fallos y pico; reparto 1/3 por DC). Segunda acometida: km supuesto = longitud del tramo de anillo paralelo (16 km); si va por el mismo conducto que el tramo comparte SRLG con él (diversidad física pendiente, UPF2 Tabla R2). Discrepancia: 2.1-S5d §3.3 proponía DC-Centro a Centro y Sur, DC-Norte a Norte y Centro, DC-Sur a Sur y Centro; manda UPF2 (06/11). Con el reparto 'cada zona a su DC' (BNG de 2.2; caso base 3.2 15/5/6 x 400G por DC; S5d caso esperado 14/3/5) el enlace propio de DC-Centro necesitaría ~6.000 Gbit/s."
  },
  {
   "id": "L-EDGECENTRO-METC",
   "a": "EDGE-CENTRO",
   "b": "MET-CENTRO",
   "tipo": "mpls",
   "capacidad_gbps": 300,
   "km": 0.3,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 (Edge junto a su nodo metro); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.1-6.4 (NIC); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 (doble conexión de Edge, R3, no recogida en 2.1-S5d)",
   "supuesto": true,
   "nota": "Capacidad supuesta: NIC mínima 258,8 Gbit/s -> 3 x 100GE (puertos 100GE como en 3.2 S1c). km supuesto (mismo emplazamiento). Sin doble conexión: un corte aquí equivale a la caída del Edge (F5-F7)."
  },
  {
   "id": "L-EDGEESTE-METE",
   "a": "EDGE-ESTE",
   "b": "MET-ESTE",
   "tipo": "mpls",
   "capacidad_gbps": 200,
   "km": 0.3,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 (Edge junto a su nodo metro); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.1-6.4 (NIC); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 (doble conexión de Edge, R3, no recogida en 2.1-S5d)",
   "supuesto": true,
   "nota": "Capacidad supuesta: NIC mínima 120,8 Gbit/s al recibir Centro -> 2 x 100GE (puertos 100GE como en 3.2 S1c). km supuesto (mismo emplazamiento). Sin doble conexión: un corte aquí equivale a la caída del Edge (F5-F7)."
  },
  {
   "id": "L-EDGESUR-METS",
   "a": "EDGE-SUR",
   "b": "MET-SUR",
   "tipo": "mpls",
   "capacidad_gbps": 100,
   "km": 0.3,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1 (Edge junto a su nodo metro); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §6.1-6.4 (NIC); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 (doble conexión de Edge, R3, no recogida en 2.1-S5d)",
   "supuesto": true,
   "nota": "Capacidad supuesta: NIC mínima 1,26 Gbit/s -> 1 x 100GE (puertos 100GE como en 3.2 S1c). km supuesto (mismo emplazamiento). Sin doble conexión: un corte aquí equivale a la caída del Edge (F5-F7)."
  },
  {
   "id": "L-AGGMADRID-METC",
   "a": "AGG-MADRID",
   "b": "MET-CENTRO",
   "tipo": "backhaul",
   "capacidad_gbps": 6000,
   "km": 8.9,
   "proteccion": "frr",
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 2433.5 Gbit/s. km = 1,3 x línea recta (estimado). Doble pertenencia a los dos PE de Metro-Centro (3.1 S5 F2: 'acceso y DC conectados a los dos'); cada enlace dimensionado para el total."
  },
  {
   "id": "L-AGGMADRID-METCB",
   "a": "AGG-MADRID",
   "b": "MET-CENTRO-B",
   "tipo": "backhaul",
   "capacidad_gbps": 6000,
   "km": 9.0,
   "proteccion": "frr",
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 2433.5 Gbit/s. km = 1,3 x línea recta (estimado). Doble pertenencia a los dos PE de Metro-Centro (3.1 S5 F2: 'acceso y DC conectados a los dos'); cada enlace dimensionado para el total."
  },
  {
   "id": "L-AGGALCOBENDAS-METN",
   "a": "AGG-ALCOBENDAS",
   "b": "MET-NORTE",
   "tipo": "backhaul",
   "capacidad_gbps": 300,
   "km": 1.2,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 89.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGTRESCANTOS-METN",
   "a": "AGG-TRESCANTOS",
   "b": "MET-NORTE",
   "tipo": "backhaul",
   "capacidad_gbps": 100,
   "km": 11.6,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 39.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGTORREJON-METE",
   "a": "AGG-TORREJON",
   "b": "MET-ESTE",
   "tipo": "backhaul",
   "capacidad_gbps": 300,
   "km": 1.3,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 100.3 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGALCALA-METE",
   "a": "AGG-ALCALA",
   "b": "MET-ESTE",
   "tipo": "backhaul",
   "capacidad_gbps": 400,
   "km": 13.7,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 140.9 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGGETAFE-METS",
   "a": "AGG-GETAFE",
   "b": "MET-SUR",
   "tipo": "backhaul",
   "capacidad_gbps": 400,
   "km": 3.5,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 132.8 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGLEGANES-METS",
   "a": "AGG-LEGANES",
   "b": "MET-SUR",
   "tipo": "backhaul",
   "capacidad_gbps": 400,
   "km": 6.1,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 133.0 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGFUENLABRADA-METS",
   "a": "AGG-FUENLABRADA",
   "b": "MET-SUR",
   "tipo": "backhaul",
   "capacidad_gbps": 400,
   "km": 11.0,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 128.9 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-AGGALCORCON-METS",
   "a": "AGG-ALCORCON",
   "b": "MET-SUR",
   "tipo": "backhaul",
   "capacidad_gbps": 300,
   "km": 13.2,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 120.0 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada')."
  },
  {
   "id": "L-CORE1-IXINTERNET",
   "a": "CORE-1",
   "b": "IX-INTERNET",
   "tipo": "ix",
   "capacidad_gbps": 4000,
   "km": 0.9,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.1",
   "supuesto": true,
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta."
  },
  {
   "id": "L-CORE1-IXIMS",
   "a": "CORE-1",
   "b": "IX-IMS",
   "tipo": "ix",
   "capacidad_gbps": 100,
   "km": 1.0,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §2.2 (medios IMS 186,95 Gbit/s por sentido para 2·A legs)",
   "supuesto": true,
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta."
  },
  {
   "id": "L-CORE2-IXINTERNET",
   "a": "CORE-2",
   "b": "IX-INTERNET",
   "tipo": "ix",
   "capacidad_gbps": 4000,
   "km": 14.6,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.1",
   "supuesto": true,
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta."
  },
  {
   "id": "L-CORE2-IXIMS",
   "a": "CORE-2",
   "b": "IX-IMS",
   "tipo": "ix",
   "capacidad_gbps": 100,
   "km": 14.6,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §2.2 (medios IMS 186,95 Gbit/s por sentido para 2·A legs)",
   "supuesto": true,
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta."
  },
  {
   "id": "L-CORE3-IXINTERNET",
   "a": "CORE-3",
   "b": "IX-INTERNET",
   "tipo": "ix",
   "capacidad_gbps": 4000,
   "km": 19.3,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §4.1",
   "supuesto": true,
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta."
  },
  {
   "id": "L-CORE3-IXIMS",
   "a": "CORE-3",
   "b": "IX-IMS",
   "tipo": "ix",
   "capacidad_gbps": 100,
   "km": 19.4,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx §2.2 (medios IMS 186,95 Gbit/s por sentido para 2·A legs)",
   "supuesto": true,
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta."
  },
  {
   "id": "L-IXONEWEB-CORE1",
   "a": "IX-ONEWEB",
   "b": "CORE-1",
   "tipo": "ix",
   "capacidad_gbps": 1,
   "km": 27.8,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (VRF del operador hasta el DC más cercano [HYP])",
   "supuesto": true,
   "nota": "DC más cercano al hub de Arganda en este modelo: DC-Centro (≈22 km en línea recta frente a ≈23 km de DC-Sur). Capacidad supuesta 1 Gbit/s (5 terminales x ≥100 Mbit/s)."
  },
  {
   "id": "L-SAT-AGGGETAFE",
   "a": "AGG-GETAFE",
   "b": "IX-ONEWEB",
   "tipo": "sat",
   "capacidad_gbps": 0.1,
   "km": null,
   "latencia_ms": 37.5,
   "proteccion": null,
   "anillo": null,
   "emergencia": true,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (terminales transportables en hospital, estadio y Edge-Este [HYP]; ≥100 Mbit/s DL y ≥20 Mbit/s UL; RTT IP 50-100 ms)",
   "supuesto": true,
   "nota": "Terminal OneWeb del hospital de Getafe. Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge."
  },
  {
   "id": "L-SAT-AGGMADRID",
   "a": "AGG-MADRID",
   "b": "IX-ONEWEB",
   "tipo": "sat",
   "capacidad_gbps": 0.1,
   "km": null,
   "latencia_ms": 37.5,
   "proteccion": null,
   "anillo": null,
   "emergencia": true,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (terminales transportables en hospital, estadio y Edge-Este [HYP]; ≥100 Mbit/s DL y ≥20 Mbit/s UL; RTT IP 50-100 ms)",
   "supuesto": true,
   "nota": "Terminal OneWeb del estadio (centro de control). Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge."
  },
  {
   "id": "L-SAT-EDGEESTE",
   "a": "EDGE-ESTE",
   "b": "IX-ONEWEB",
   "tipo": "sat",
   "capacidad_gbps": 0.1,
   "km": null,
   "latencia_ms": 37.5,
   "proteccion": null,
   "anillo": null,
   "emergencia": true,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (terminales transportables en hospital, estadio y Edge-Este [HYP]; ≥100 Mbit/s DL y ≥20 Mbit/s UL; RTT IP 50-100 ms)",
   "supuesto": true,
   "nota": "Terminal OneWeb del Edge-Este (centro de control de la A-2). Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge."
  },
  {
   "id": "L-SITEMETROPOLITANO-METCENTRO",
   "a": "SITE-METROPOLITANO",
   "b": "MET-CENTRO",
   "tipo": "acceso",
   "capacidad_gbps": 400,
   "km": 3.0,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (tabla del 60 %, prioridad 1: 0 / 1,00 Gbit/s con +25 %) y §2 (5QI 71, ARP 5)"
  },
  {
   "id": "L-SITEVALDEBEBAS-METCENTRO",
   "a": "SITE-VALDEBEBAS",
   "b": "MET-CENTRO",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 6.8,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5, A8 (5 000 × 0,8 Mbit/s ×1,25 = 5,00 Gbit/s UL), Tabla 10; Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3"
  },
  {
   "id": "L-SITEA2V2X-METESTE",
   "a": "SITE-A2-V2X",
   "b": "MET-ESTE",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 1.2,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (1 000 vehículos × 300 B × 10 Hz ×1,5 = 0,036 → 0,045 Gbit/s con +25 %); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2 (tramo 34 km, 5,5 ms de ida); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2, §4.3 y §5.5"
  },
  {
   "id": "L-SITEHOSPITALGETAFE-METSUR",
   "a": "SITE-HOSPITAL-GETAFE",
   "b": "MET-SUR",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 4.6,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (DL 100×4 = 0,400; UL 0,400 + 100×0,02 = 0,402 Gbit/s; ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §3 y §5 (5QI 2 y 82, ARP 1); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §4.3-4.4"
  },
  {
   "id": "L-SITEINDUSTRIASUR-METSUR",
   "a": "SITE-INDUSTRIA-SUR",
   "b": "MET-SUR",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 1.4,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (AGV 0,2 Mbit/s de control UL y 0,2 DL por AGV, ×10 ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §5; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3 (AGV 3,5 ms)"
  },
  {
   "id": "L-SITEL2VPNCENTRO-METCENTRO",
   "a": "SITE-L2VPN-CENTRO",
   "b": "MET-CENTRO",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 10.3,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)"
  },
  {
   "id": "L-SITEL2VPNNORTE-METNORTE",
   "a": "SITE-L2VPN-NORTE",
   "b": "MET-NORTE",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 0.3,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)"
  },
  {
   "id": "L-SITEL2VPNESTE-METESTE",
   "a": "SITE-L2VPN-ESTE",
   "b": "MET-ESTE",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 13.8,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)"
  },
  {
   "id": "L-SITENTNARGANDA-METESTE",
   "a": "SITE-NTN-ARGANDA",
   "b": "MET-ESTE",
   "tipo": "acceso",
   "capacidad_gbps": 1,
   "km": 21.8,
   "proteccion": null,
   "supuesto": true,
   "nota": "Acceso del sitio creado en la integración: capacidad = capacidad_acceso_gbps del servicio, km = 1,3 × línea recta.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (100 / 20 Mbit/s por terminal; 5 transportables: hospital, estadio, Edge-Este y 2 de reserva; terminal → satélite → hub de Arganda → VRF hasta el DC más cercano; conmutación 60 s); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (OneWeb, hub en Arganda)"
  },
  {
   "id": "L-SITEL2VPNSUR-METSUR",
   "a": "SITE-L2VPN-SUR",
   "b": "MET-SUR",
   "tipo": "acceso",
   "capacidad_gbps": 10,
   "km": 15.2,
   "proteccion": null,
   "supuesto": true,
   "nota": "Sede Sur de la L2VPN (solo aparece como destino en servicios.json). Coordenadas aproximadas del campus; acceso 10 GbE a MET-SUR como las demás sedes.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona)"
  }
 ],
 "servicios": [
  {
   "id": "S-ESTADIO-PRENSA",
   "nombre": "Estadio Metropolitano · QoD de prensa (50 sesiones × 20 Mbit/s UL)",
   "zona": "Z-MADRID",
   "nodo": "SITE-METROPOLITANO",
   "coord": [
    40.4362,
    -3.5995
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 400,
   "perfil": "evento",
   "destino": "edge",
   "edge": "EDGE-CENTRO",
   "respaldo_edge": "EDGE-ESTE",
   "slice": "eMBB",
   "dnn": "evento",
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 6.0,
   "requisitos": [
    "SCOM04",
    "ARCO11",
    "ARCO13"
   ],
   "dl_gbps": 0.0,
   "ul_gbps": 1.0,
   "prioridad": 3,
   "arp": 5,
   "qi5": 71,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (tabla del 60 %, prioridad 1: 0 / 1,00 Gbit/s con +25 %) y §2 (5QI 71, ARP 5)",
   "supuesto": true,
   "nota": "El perfil de prensa (50 × 20 Mbit/s UL) es [HYP] de 3.1. Se separa del resto porque tiene ARP 5 y GBR: en respaldo entra al 100 %. capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-ESTADIO-LIGERO",
   "nombre": "Estadio Metropolitano · tráfico ligero (navegación, mensajería, voz por app, otros)",
   "zona": "Z-MADRID",
   "nodo": "SITE-METROPOLITANO",
   "coord": [
    40.4362,
    -3.5995
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 400,
   "perfil": "evento",
   "destino": "edge",
   "edge": "EDGE-CENTRO",
   "respaldo_edge": "EDGE-ESTE",
   "slice": "eMBB",
   "dnn": "evento",
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 6.0,
   "requisitos": [
    "SCOM04",
    "ARCO11",
    "ARCO13"
   ],
   "dl_gbps": 39.69,
   "ul_gbps": 10.63,
   "prioridad": 4,
   "arp": 9,
   "qi5": 9,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (31,25+1,88+0,31+6,25 / 6,25+0,94+0,31+3,13 Gbit/s con +25 %); total estadio Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A7",
   "nota": "Mezcla del G32 Semana 2 que usa 3.1; en respaldo (Edge-Este) entra al 100 %. Prioridad 4 > vídeo para que el recorte del 60 % caiga sobre el vídeo, como propone 3.1. capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-ESTADIO-VIDEO",
   "nombre": "Estadio Metropolitano · vídeo del público (25 % de usuarios, 8/5 Mbit/s)",
   "zona": "Z-MADRID",
   "nodo": "SITE-METROPOLITANO",
   "coord": [
    40.4362,
    -3.5995
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 400,
   "perfil": "evento",
   "destino": "edge",
   "edge": "EDGE-CENTRO",
   "respaldo_edge": "EDGE-ESTE",
   "slice": "eMBB",
   "dnn": "evento",
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 6.0,
   "requisitos": [
    "SCOM04",
    "ARCO11",
    "ARCO13"
   ],
   "dl_gbps": 125.0,
   "ul_gbps": 77.13,
   "prioridad": 5,
   "arp": 9,
   "qi5": 9,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (125,00 / 77,13 Gbit/s con +25 %); total estadio 164,69 / 88,75 en Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A7",
   "nota": "En respaldo baja al 47 % DL / 54 % UL (720p) para que el estadio quede en el 60 % (98,81 / 53,25 Gbit/s, Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A7 control). capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-VALDEBEBAS-CAMARAS",
   "nombre": "Smart City Valdebebas · 5 000 cámaras RedCap (vídeo-ciudad)",
   "zona": "Z-MADRID",
   "nodo": "SITE-VALDEBEBAS",
   "coord": [
    40.4815,
    -3.618
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 10,
   "perfil": "iot",
   "requisitos": [
    "SCOM07",
    "ARCO10",
    "ARCO13"
   ],
   "dl_gbps": 0.0,
   "ul_gbps": 5.0,
   "destino": "edge",
   "edge": "EDGE-CENTRO",
   "respaldo_edge": "EDGE-ESTE",
   "slice": "eMBB",
   "dnn": "video-ciudad",
   "prioridad": 4,
   "arp": 7,
   "qi5": 72,
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 3.9,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5, A8 (5 000 × 0,8 Mbit/s ×1,25 = 5,00 Gbit/s UL), Tabla 10; Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3",
   "nota": "Valdebebas está en Hortaleza, zona Centro [I13] (3.2 Tabla 5). Coordenada: Parque Central de Valdebebas (aprox.). capacidad_acceso_gbps 10 = supuesto (5 Gbit/s UL ×1,10/0,70 = 7,9 Gbit/s; ~40 sitios n78, KPIs v5). Si cae Edge-Centro, Edge-Este recibe el 100 % de streams y grabación y analiza el 30 % (Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-VALDEBEBAS-SENSORES",
   "nombre": "Smart City Valdebebas · 95 000 sensores NB-IoT/LTE-M (iot-ciudad)",
   "zona": "Z-MADRID",
   "nodo": "SITE-VALDEBEBAS",
   "coord": [
    40.4815,
    -3.618
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 10,
   "perfil": "iot",
   "requisitos": [
    "SCOM07",
    "ARCO10",
    "ARCO13"
   ],
   "dl_gbps": 0.0,
   "ul_gbps": 0.0021,
   "destino": "internet",
   "edge": null,
   "slice": "mMTC",
   "dnn": "iot-ciudad",
   "prioridad": 5,
   "arp": 10,
   "qi5": 9,
   "latencia_max_ms": null,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 10 y A8 (1,25 × 1,5 × 1 142 222 bit/s = 0,0021 Gbit/s UL); Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §3 (UPF central)",
   "nota": "Valdebebas está en Hortaleza, zona Centro [I13] (3.2 Tabla 5). Coordenada: Parque Central de Valdebebas (aprox.). capacidad_acceso_gbps 10 = supuesto (5 Gbit/s UL ×1,10/0,70 = 7,9 Gbit/s; ~40 sitios n78, KPIs v5). destino 'internet' = UPF central del DC (DNN iot-ciudad, sin MEC). En mMTC dimensiona el número de dispositivos, no los Gbit/s. Sin objetivo de latencia: la alarma pide 99,9 % en ≤10 s. DL despreciable (4 % del DL de n28, 3.1-S5 §3): 0."
  },
  {
   "id": "S-V2X-A2",
   "nombre": "Carretera Conectada A-2 · avisos V2N (CAM/DENM), M-30 km 4 – Meco km 38",
   "zona": "Z-TORREJON",
   "nodo": "SITE-A2-V2X",
   "coord": [
    40.456,
    -3.478
   ],
   "trazado": [
    [
     40.4385,
     -3.66
    ],
    [
     40.447,
     -3.573
    ],
    [
     40.45,
     -3.53
    ],
    [
     40.456,
     -3.478
    ],
    [
     40.479,
     -3.41
    ],
    [
     40.495,
     -3.37
    ],
    [
     40.534,
     -3.326
    ]
   ],
   "conecta_a": "MET-ESTE",
   "conecta_a_alternativa": "AGG-TORREJON",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 0.045,
   "ul_gbps": 0.045,
   "perfil": "movilidad",
   "destino": "edge",
   "edge": "EDGE-ESTE",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "URLLC",
   "dnn": "v2x",
   "prioridad": 1,
   "arp": 2,
   "qi5": 83,
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 4.3,
   "requisitos": [
    "SCOM06",
    "ARCO10",
    "ARCO11",
    "ARCO13"
   ],
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (1 000 vehículos × 300 B × 10 Hz ×1,5 = 0,036 → 0,045 Gbit/s con +25 %); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2 (tramo 34 km, 5,5 ms de ida); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2, §4.3 y §5.5",
   "supuesto": true,
   "nota": "Un único flujo: los documentos solo definen avisos de seguridad (5QI 83, ARP 2); no hay infoentretenimiento en el diseño, así que no se inventa. Sitio = punto medio del corredor (Torrejón, km ~21) y 'trazado' = puntos aproximados de la A-2 (supuesto sobre mapa). zona Z-TORREJON por ser el tramo central (el corredor cruza Madrid, Coslada/San Fernando, Torrejón y Alcalá). capacidad_acceso 10 = supuesto. Respaldo en Edge-Centro: 5,8 ms de ida P95 (Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-HOSPITAL-CRITICO",
   "nombre": "Hospital de Getafe · videoconsulta QoD (100 × 4 Mbit/s) y telemetría (100 sensores)",
   "zona": "Z-GETAFE",
   "nodo": "SITE-HOSPITAL-GETAFE",
   "coord": [
    40.3027,
    -3.74
   ],
   "conecta_a": "MET-SUR",
   "conecta_a_alternativa": "AGG-GETAFE",
   "capacidad_acceso_gbps": 10,
   "destino": "edge",
   "edge": "EDGE-SUR",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "URLLC",
   "dnn": "salud",
   "prioridad": 1,
   "arp": 1,
   "latencia_kpi_ms": 10,
   "requisitos": [
    "SCOM05",
    "ARCO02",
    "ARCO10",
    "SCOM01"
   ],
   "dl_gbps": 0.5,
   "ul_gbps": 0.5025,
   "perfil": "empresa",
   "qi5": 2,
   "latencia_max_ms": 2.4,
   "latencia_max_respaldo_ms": 12.4,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (DL 100×4 = 0,400; UL 0,400 + 100×0,02 = 0,402 Gbit/s; ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §3 y §5 (5QI 2 y 82, ARP 1); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §4.3-4.4",
   "nota": "H. U. de Getafe, Ctra. de Toledo km 12,5 (KPIs v5 §4); coordenada aproximada. Acceso: 3.1 supone dos accesos de fibra de 10 Gbit/s (SCOM01) por conductos distintos [HYP]; nadie diseña aún la segunda acometida (Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4). En respaldo (Edge-Centro) el PASS es 20 ms de ida y lo esperado 7,5 ms (7,9 con corte). Videoconsulta (5QI 2) y sensores (5QI 82) comparten slice, DNN, ARP y objetivo de 10 ms: un solo servicio. perfil 'empresa' (consultas en horario diurno): supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-HOSPITAL-CAMARAS",
   "nombre": "Hospital de Getafe · 40 cámaras (2 Mbit/s UL, por fibra)",
   "zona": "Z-GETAFE",
   "nodo": "SITE-HOSPITAL-GETAFE",
   "coord": [
    40.3027,
    -3.74
   ],
   "conecta_a": "MET-SUR",
   "conecta_a_alternativa": "AGG-GETAFE",
   "capacidad_acceso_gbps": 10,
   "destino": "edge",
   "edge": "EDGE-SUR",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "URLLC",
   "dnn": "salud",
   "prioridad": 1,
   "arp": 1,
   "latencia_kpi_ms": 10,
   "requisitos": [
    "SCOM05",
    "ARCO02",
    "ARCO10",
    "SCOM01"
   ],
   "dl_gbps": 0.0,
   "ul_gbps": 0.1,
   "perfil": "iot",
   "qi5": 72,
   "latencia_max_ms": 6.3,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A8 (40 × 2 Mbit/s ×1,25 = 0,100 Gbit/s; 'cámaras por fibra') y §7; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 (5QI 72, ARP 1) y §5.3",
   "supuesto": true,
   "nota": "H. U. de Getafe, Ctra. de Toledo km 12,5 (KPIs v5 §4); coordenada aproximada. Acceso: 3.1 supone dos accesos de fibra de 10 Gbit/s (SCOM01) por conductos distintos [HYP]; nadie diseña aún la segunda acometida (Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4). En respaldo (Edge-Centro) el PASS es 20 ms de ida y lo esperado 7,5 ms (7,9 con corte). Cámaras por la fibra del hospital (suposición más realista de 3.1): sin radio en el presupuesto, latencia_max = 10 - UPF 0,2 - app 3,0 - reserva 0,5 (supuesto; 5QI 72 tiene PDB de 300 ms)."
  },
  {
   "id": "S-INDUSTRIA-AGV",
   "nombre": "Red privada Sur · control de 10 AGV (n28, 5QI 82)",
   "zona": "Z-GETAFE",
   "nodo": "SITE-INDUSTRIA-SUR",
   "coord": [
    40.315,
    -3.713
   ],
   "conecta_a": "MET-SUR",
   "conecta_a_alternativa": "AGG-GETAFE",
   "capacidad_acceso_gbps": 10,
   "perfil": "empresa",
   "destino": "edge",
   "edge": "EDGE-SUR",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "PRIV-SUR",
   "dnn": "industria-sur",
   "requisitos": [
    "ARCO14",
    "ARCO10",
    "ARCO11"
   ],
   "dl_gbps": 0.0025,
   "ul_gbps": 0.0025,
   "prioridad": 2,
   "arp": 3,
   "qi5": 82,
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 6.3,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (AGV 0,2 Mbit/s de control UL y 0,2 DL por AGV, ×10 ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §5; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3 (AGV 3,5 ms)",
   "supuesto": true,
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-INDUSTRIA-CAMARAS",
   "nombre": "Red privada Sur · 20 cámaras de línea (5 Mbit/s UL, 5QI 71)",
   "zona": "Z-GETAFE",
   "nodo": "SITE-INDUSTRIA-SUR",
   "coord": [
    40.315,
    -3.713
   ],
   "conecta_a": "MET-SUR",
   "conecta_a_alternativa": "AGG-GETAFE",
   "capacidad_acceso_gbps": 10,
   "perfil": "empresa",
   "destino": "edge",
   "edge": "EDGE-SUR",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "PRIV-SUR",
   "dnn": "industria-sur",
   "requisitos": [
    "ARCO14",
    "ARCO10",
    "ARCO11"
   ],
   "dl_gbps": 0.0,
   "ul_gbps": 0.125,
   "prioridad": 3,
   "arp": 6,
   "qi5": 71,
   "latencia_kpi_ms": 10,
   "latencia_max_ms": 4.4,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (20 × 5 Mbit/s ×1,25 = 0,125 Gbit/s); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 (5QI 71, ARP 6) y §4.3 (cámaras privadas 5,4 ms)",
   "supuesto": true,
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo."
  },
  {
   "id": "S-INDUSTRIA-GENERAL",
   "nombre": "Red privada Sur · personal, sensores y datos AGV por n78",
   "zona": "Z-GETAFE",
   "nodo": "SITE-INDUSTRIA-SUR",
   "coord": [
    40.315,
    -3.713
   ],
   "conecta_a": "MET-SUR",
   "conecta_a_alternativa": "AGG-GETAFE",
   "capacidad_acceso_gbps": 10,
   "perfil": "empresa",
   "destino": "edge",
   "edge": "EDGE-SUR",
   "respaldo_edge": "EDGE-CENTRO",
   "slice": "PRIV-SUR",
   "dnn": "industria-sur",
   "requisitos": [
    "ARCO14",
    "ARCO10",
    "ARCO11"
   ],
   "dl_gbps": 0.085,
   "ul_gbps": 0.0725,
   "prioridad": 4,
   "arp": 8,
   "qi5": 9,
   "latencia_max_ms": null,
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (DL 100·0,30·2 + 10·0,8 = 68 Mbit/s; UL 30 + 10 + 18 = 58 Mbit/s; ×1,25); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 (5QI 9, ARP 8)",
   "supuesto": true,
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. Resto del piloto sin objetivo de latencia propio. Suma de los tres servicios = 0,0875 / 0,200 Gbit/s (3.2 Tabla 5)."
  },
  {
   "id": "S-L2VPN-CN",
   "nombre": "L2VPN EVPN E-LAN · UPM, Ciudad Universitaria ↔ Ayuntamiento de Alcobendas",
   "zona": "Z-MADRID",
   "nodo": "SITE-L2VPN-CENTRO",
   "coord": [
    40.4489,
    -3.719
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-NORTE",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = NORTE→CENTRO, ul = CENTRO→NORTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-L2VPN-CE",
   "nombre": "L2VPN EVPN E-LAN · UPM, Ciudad Universitaria ↔ Universidad de Alcalá",
   "zona": "Z-MADRID",
   "nodo": "SITE-L2VPN-CENTRO",
   "coord": [
    40.4489,
    -3.719
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-ESTE",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = ESTE→CENTRO, ul = CENTRO→ESTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-L2VPN-CS",
   "nombre": "L2VPN EVPN E-LAN · UPM, Ciudad Universitaria ↔ URJC, Campus de Alcorcón",
   "zona": "Z-MADRID",
   "nodo": "SITE-L2VPN-CENTRO",
   "coord": [
    40.4489,
    -3.719
   ],
   "conecta_a": "MET-CENTRO",
   "conecta_a_alternativa": "AGG-MADRID",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-SUR",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→CENTRO, ul = CENTRO→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-L2VPN-NE",
   "nombre": "L2VPN EVPN E-LAN · Ayuntamiento de Alcobendas ↔ Universidad de Alcalá",
   "zona": "Z-ALCOBENDAS",
   "nodo": "SITE-L2VPN-NORTE",
   "coord": [
    40.5392,
    -3.6419
   ],
   "conecta_a": "MET-NORTE",
   "conecta_a_alternativa": "AGG-ALCOBENDAS",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-ESTE",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = ESTE→NORTE, ul = NORTE→ESTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-L2VPN-NS",
   "nombre": "L2VPN EVPN E-LAN · Ayuntamiento de Alcobendas ↔ URJC, Campus de Alcorcón",
   "zona": "Z-ALCOBENDAS",
   "nodo": "SITE-L2VPN-NORTE",
   "coord": [
    40.5392,
    -3.6419
   ],
   "conecta_a": "MET-NORTE",
   "conecta_a_alternativa": "AGG-ALCOBENDAS",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-SUR",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→NORTE, ul = NORTE→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-L2VPN-ES",
   "nombre": "L2VPN EVPN E-LAN · Universidad de Alcalá ↔ URJC, Campus de Alcorcón",
   "zona": "Z-ALCALA",
   "nodo": "SITE-L2VPN-ESTE",
   "coord": [
    40.4826,
    -3.3635
   ],
   "conecta_a": "MET-ESTE",
   "conecta_a_alternativa": "AGG-ALCALA",
   "capacidad_acceso_gbps": 10,
   "dl_gbps": 3.33,
   "ul_gbps": 3.33,
   "perfil": "empresa",
   "destino": "nodo",
   "destino_nodo": "SITE-L2VPN-SUR",
   "edge": null,
   "slice": null,
   "prioridad": 3,
   "latencia_max_ms": null,
   "requisitos": [
    "ARCO07"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "supuesto": true,
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→ESTE, ul = ESTE→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas."
  },
  {
   "id": "S-NTN-EMERGENCIA",
   "nombre": "Satélite de emergencia OneWeb (3 terminales activos → hub de Arganda)",
   "zona": null,
   "nodo": "SITE-NTN-ARGANDA",
   "coord": [
    40.3007,
    -3.438
   ],
   "conecta_a": "MET-ESTE",
   "conecta_a_alternativa": "EDGE-ESTE",
   "capacidad_acceso_gbps": 1,
   "dl_gbps": 0.3,
   "ul_gbps": 0.06,
   "perfil": "iot",
   "destino": "internet",
   "edge": null,
   "slice": null,
   "prioridad": 2,
   "latencia_max_ms": null,
   "inactivo_por_defecto": true,
   "terminales": [
    "SITE-HOSPITAL-GETAFE",
    "SITE-METROPOLITANO",
    "EDGE-ESTE (centro de control A-2)"
   ],
   "requisitos": [
    "SCOM08"
   ],
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (100 / 20 Mbit/s por terminal; 5 transportables: hospital, estadio, Edge-Este y 2 de reserva; terminal → satélite → hub de Arganda → VRF hasta el DC más cercano; conmutación 60 s); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (OneWeb, hub en Arganda)",
   "supuesto": true,
   "nota": "Solo existe en incidentes: inactivo_por_defecto = true y factor 0 en todos los escenarios salvo los de NTN. Carga = 3 terminales desplegados × 100/20 Mbit/s. Lleva VoNR (5QI 1), mensajería, telemetría del hospital y gestión; 10 Mbit/s por terminal reservados a voz/control. RTT satélite 50–100 ms: fuera del presupuesto de 10 ms, sin latencia_max. Arganda del Rey no es una de las 9 zonas (zona null); conecta_a MET-ESTE por proximidad = supuesto (el documento dice 'DC más cercano'). Coordenada de Arganda aproximada."
  }
 ],
 "slices": [
  {
   "id": "eMBB",
   "nombre": "eMBB público",
   "sst": 1,
   "sd": "000001",
   "prioridad": 4,
   "latencia_max_ms": 10,
   "dnn": [
    "evento",
    "video-ciudad",
    "internet",
    "ims"
   ],
   "servicios": [
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-VIDEO",
    "S-VALDEBEBAS-CAMARAS",
    "tipo:movil-ebb",
    "tipo:voz-ims"
   ],
   "upf": "evento y video-ciudad: UPF local Edge-Centro (respaldo Edge-Este); internet e ims: UPF central DC (N-1 entre DC)",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2 y §3; Semana 6/Teams (descargado 2026-11-02)/Politica_slices_MEC_APIs.pdf §2 (10 ms usuario–Edge en evento y video-ciudad)",
   "nota": "latencia_max_ms = KPI 10 ms ida P95 solo para las DNN con MEC (evento, video-ciudad); internet sin objetivo. La VoNR (DNN ims, 5QI 1, ARP 4) va en este slice: no hay slice de voz propio en el diseño. Prioridad del slice: la de su tráfico mayoritario (ARP 9)."
  },
  {
   "id": "URLLC",
   "nombre": "URLLC público",
   "sst": 2,
   "sd": "000002",
   "prioridad": 1,
   "latencia_max_ms": 10,
   "dnn": [
    "v2x",
    "salud"
   ],
   "servicios": [
    "S-V2X-A2",
    "S-HOSPITAL-CRITICO",
    "S-HOSPITAL-CAMARAS"
   ],
   "upf": "v2x: UPF local Edge-Este (respaldo Edge-Centro); salud: UPF local Edge-Sur (respaldo Edge-Centro)",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2 y §3; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 (ARP 1 hospital, 2 V2X)",
   "nota": "Hospital y A-2 comparten (2, 000002) y se separan por DNN. Plan B del CTO si VAL-04 bis detecta interferencia: hospital a (2, 000004). V2X en SST 2 (no SST 4) por decisión del CTO."
  },
  {
   "id": "mMTC",
   "nombre": "mMTC público",
   "sst": 3,
   "sd": "000003",
   "prioridad": 5,
   "latencia_max_ms": null,
   "dnn": [
    "iot-ciudad"
   ],
   "servicios": [
    "S-VALDEBEBAS-SENSORES"
   ],
   "upf": "UPF central DC (N-1 entre DC), sin MEC",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2 y §3; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 (ARP 10)",
   "nota": "Sin objetivo de latencia de red: alarma 9 500 avisos en 1 s entregados al 99,9 % en ≤10 s."
  },
  {
   "id": "PRIV-SUR",
   "nombre": "Privado Sur (PNI-NPN tipo A)",
   "sst": 2,
   "sd": "000101",
   "prioridad": 2,
   "latencia_max_ms": 10,
   "dnn": [
    "industria-sur"
   ],
   "servicios": [
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL"
   ],
   "upf": "UPF privada dedicada Edge-Sur (respaldo: UPF privada en Edge-Centro); VRF propia, sin salida a Internet",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2, §4 y §5; Semana 6/Teams (descargado 2026-11-02)/Politica_slices_MEC_APIs.pdf §2 (10 ms para el control de AGV)",
   "nota": "Prioridad 2 por el control de AGV (ARP 3); el resto del slice va con ARP 6 y 8."
  }
 ],
 "escenarios": [
  {
   "id": "E-NORMAL",
   "nombre": "Hora cargada normal (sin partido)",
   "hora": 21,
   "descripcion": "Hora cargada de 2031 sin evento en el Metropolitano: equivale al caso B de 3.2 (red sin evento).",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.2 Tabla 6 (caso B: sin evento) y Tabla 1 (hora cargada)",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 0,
    "S-ESTADIO-LIGERO": 0,
    "S-ESTADIO-VIDEO": 0
   },
   "fallos": []
  },
  {
   "id": "E-EVENTO",
   "nombre": "Partido en el Metropolitano (50 000 activos, base de diseño 3.2)",
   "hora": 21,
   "descripcion": "Hora cargada con el estadio lleno: caso A de 3.2 (base de diseño). Edge-Centro 164,69 / 93,75 Gbit/s.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.2 Tabla 6 (caso A) y Tabla 8",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos": []
  },
  {
   "id": "E-EVENTO-ESTRES",
   "nombre": "Estrés: servicios especiales ×2,07",
   "hora": 21,
   "descripcion": "Sensibilidad de 3.2 si los bitrates del evento, hospital e industria crecieran como el consumo móvil (×1,129⁶ = ×2,07). Escenario de estrés, fuera de la base.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.3 Tabla 7",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 2.07,
    "S-ESTADIO-LIGERO": 2.07,
    "S-ESTADIO-VIDEO": 2.07,
    "S-HOSPITAL-CRITICO": 2.07,
    "S-HOSPITAL-CAMARAS": 2.07,
    "S-INDUSTRIA-AGV": 2.07,
    "S-INDUSTRIA-CAMARAS": 2.07,
    "S-INDUSTRIA-GENERAL": 2.07
   },
   "fallos": []
  },
  {
   "id": "E-PUNTA-A2",
   "nombre": "Hora punta de movilidad en la A-2",
   "hora": 8,
   "descripcion": "Mañana laborable: 1 000 vehículos en el tramo M-30–Meco (carga de diseño del V2X). Sin evento.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8; Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2",
   "supuesto": true,
   "nota": "La hora (8) la marca el perfil 'movilidad'; los documentos no fijan la hora punta de la A-2.",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 0,
    "S-ESTADIO-LIGERO": 0,
    "S-ESTADIO-VIDEO": 0,
    "S-V2X-A2": 1
   },
   "fallos": []
  },
  {
   "id": "E-PICO-P2",
   "nombre": "Pico de congestión P2 (2 × Internet fijo y móvil)",
   "hora": 21,
   "descripcion": "Pico de 3.2 (H-E5) y fallo 'pico de tráfico' de SCOM10 (F10): se duplica Internet fijo y móvil en las cuatro zonas; voz y sensores no se duplican. Sin fallos.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 (P2) y Tabla R2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F10",
   "supuesto": true,
   "nota": "Las claves tipo:* dependen de los tipos de necesidad del agente A (PLAN.md). Dirección aún no ha elegido entre P2 y PM.",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "tipo:residencial-fijo": 2,
    "tipo:empresa": 2,
    "tipo:movil-ebb": 2,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos": []
  },
  {
   "id": "E-PICO-PM",
   "nombre": "Pico de congestión PM (2 × Internet móvil)",
   "hora": 21,
   "descripcion": "Variante de pico de 3.2 que duplica solo el móvil.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 (PM)",
   "supuesto": true,
   "nota": "Clave tipo:movil-ebb según PLAN.md.",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "tipo:movil-ebb": 2,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos": []
  },
  {
   "id": "E-ALARMA-VALDEBEBAS",
   "nombre": "Alarma masiva en Valdebebas (9 500 avisos en 1 s)",
   "hora": 21,
   "descripcion": "El 10 % de los sensores avisa a la vez: 9 500 × 200 B × 8 / 1 s = 15,2 Mbit/s (19 con +25 %), unas 9 veces el caudal medio de sensores. Mide sobre todo el acceso radio (6,9 s), no la red.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A8 (alarma, Dirección 27/10); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §6.1",
   "supuesto": true,
   "nota": "Factor 9,0 = 0,019 / 0,0021 Gbit/s (redondeado).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-VALDEBEBAS-SENSORES": 9.0
   },
   "fallos": []
  },
  {
   "id": "E-CORTE-CN",
   "nombre": "Corte de fibra en el tramo Metro-Centro – Metro-Norte",
   "hora": 21,
   "fallos": [
    "L-METC-METN-A",
    "L-METCB-METN-B"
   ],
   "fallo_descripcion": "tramo WDM del anillo metro Metro-Centro–Metro-Norte (C–N, 20 km, ambos enlaces del tramo si comparten SRLG)",
   "descripcion": "Corte del tramo C–N (20 km). FRR por el otro arco en ≤50 ms. En la matriz de 3.2 es el corte que más tráfico desvía (E–S 1 000 / S–C 835 Gbit/s, 4 y 3 canales de 400G).",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte C-N); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F1; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.1 y §3.3",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "critico_carga": true,
   "fallos_originales": [
    "L-METCENTRO-METNORTE"
   ]
  },
  {
   "id": "E-CORTE-NE",
   "nombre": "Corte de fibra en el tramo Metro-Norte – Metro-Este",
   "hora": 21,
   "fallos": [
    "L-METN-METE-A",
    "L-METN-METE-B"
   ],
   "fallo_descripcion": "tramo WDM del anillo metro Metro-Norte–Metro-Este (N–E, 28 km, ambos enlaces del tramo si comparten SRLG)",
   "descripcion": "Corte del tramo N–E (28 km). FRR por el otro arco en ≤50 ms.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte N-E); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F1; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.1 y §3.3",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METNORTE-METESTE"
   ]
  },
  {
   "id": "E-CORTE-ES",
   "nombre": "Corte de fibra en el tramo Metro-Este – Metro-Sur",
   "hora": 21,
   "fallos": [
    "L-METE-METS-A",
    "L-METE-METS-B"
   ],
   "fallo_descripcion": "tramo WDM del anillo metro Metro-Este–Metro-Sur (E–S, 38 km, ambos enlaces del tramo si comparten SRLG)",
   "descripcion": "Corte del tramo E–S (38 km). FRR por el otro arco en ≤50 ms.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte E-S); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F1; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.1 y §3.3",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METESTE-METSUR"
   ]
  },
  {
   "id": "E-CORTE-SC",
   "nombre": "Corte de fibra en el tramo Metro-Sur – Metro-Centro (tramo más crítico)",
   "hora": 21,
   "fallos": [
    "L-METS-METC-A",
    "L-METS-METCB-B"
   ],
   "fallo_descripcion": "tramo WDM del anillo metro Metro-Sur–Metro-Centro (S–C, 16 km, ambos enlaces del tramo si comparten SRLG)",
   "descripcion": "Corte del tramo S–C (16 km). FRR por el otro arco en ≤50 ms. Es el corte más crítico del diseño: el camino de protección Sur↔Centro es el más largo (86 km, +0,49 ms) y por él va el respaldo del hospital y de la red privada (ARCO02): hospital 7,9 ms, 9,9 ms con app de 5 ms (PASS sin margen). En 2.1-S5d es además el tramo que llega al 90 % si cae DC-Centro.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte S-C); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F1; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.1 y §3.3",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "critico": true,
   "fallos_originales": [
    "L-METSUR-METCENTRO"
   ]
  },
  {
   "id": "E-CAIDA-MET-CENTRO",
   "nombre": "Caída del nodo Metro-Centro",
   "hora": 21,
   "fallos": [
    "MET-CENTRO"
   ],
   "fallo_descripcion": "nodo metro Metro-Centro completo (PE del anillo en la zona Centro)",
   "descripcion": "Punto único de fallo: Metro-Centro lleva ~73–75 % del tráfico. Sin doble PE la zona Centro queda aislada (3.2 no define acceso alternativo); los DC siguen accesibles por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11 (Cae Metro C); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F2; Semana 6/Teams (descargado 2026-11-02)/Riesgos_tecnicos.pdf R6; Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3.3",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   }
  },
  {
   "id": "E-ACOMETIDA-C-CORE-1",
   "nombre": "Pérdida de la acometida Metro-Centro – DC-Centro",
   "hora": 21,
   "fallos": [
    "L-CORE1-METC"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Centro ↔ DC-Centro (C–DC)",
   "descripcion": "Se pierde la acometida C–DC; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida C-DC)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METCENTRO-CORE1"
   ]
  },
  {
   "id": "E-ACOMETIDA-N-CORE-1",
   "nombre": "Pérdida de la acometida Metro-Norte – DC-Centro",
   "hora": 21,
   "fallos": [
    "L-CORE1-METN"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Norte ↔ DC-Centro (N–DC)",
   "descripcion": "Se pierde la acometida N–DC; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida N-DC)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METNORTE-CORE1"
   ]
  },
  {
   "id": "E-ACOMETIDA-N-CORE-2",
   "nombre": "Pérdida de la acometida Metro-Norte – DC-Norte",
   "hora": 21,
   "fallos": [
    "L-CORE2-METN"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Norte ↔ DC-Norte (N–DN)",
   "descripcion": "Se pierde la acometida N–DN; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida N-DN)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METNORTE-CORE2"
   ]
  },
  {
   "id": "E-ACOMETIDA-E-CORE-2",
   "nombre": "Pérdida de la acometida Metro-Este – DC-Norte",
   "hora": 21,
   "fallos": [
    "L-CORE2-METE"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Este ↔ DC-Norte (E–DN)",
   "descripcion": "Se pierde la acometida E–DN; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida E-DN)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METESTE-CORE2"
   ]
  },
  {
   "id": "E-ACOMETIDA-S-CORE-3",
   "nombre": "Pérdida de la acometida Metro-Sur – DC-Sur",
   "hora": 21,
   "fallos": [
    "L-CORE3-METS"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Sur ↔ DC-Sur (S–DS)",
   "descripcion": "Se pierde la acometida S–DS; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida S-DS)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METSUR-CORE3"
   ]
  },
  {
   "id": "E-ACOMETIDA-C-CORE-3",
   "nombre": "Pérdida de la acometida Metro-Centro – DC-Sur",
   "hora": 21,
   "fallos": [
    "L-CORE3-METCB"
   ],
   "fallo_descripcion": "enlace de acometida Metro-Centro ↔ DC-Sur (C–DS)",
   "descripcion": "Se pierde la acometida C–DS; el DC sigue accesible por su otra acometida.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida C-DS)",
   "supuesto": true,
   "nota": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "fallos_originales": [
    "L-METCENTRO-CORE3"
   ]
  },
  {
   "id": "E-CAIDA-EDGE-SUR",
   "nombre": "Caída del Edge Sur",
   "hora": 11,
   "fallos": [
    "EDGE-SUR"
   ],
   "fallo_descripcion": "CPD Edge Sur completo (MEC, UPF local salud y UPF privada)",
   "descripcion": "Hospital y red privada pasan a Edge-Centro (UPF privada de respaldo): +0,59 / 0,80 Gbit/s; CPU 12,7 %. Hospital 7,5 ms de ida (PASS ≤20 ms en respaldo), privada 3,6 ms. RTO 5 s.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1 y §6.1; Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F6",
   "supuesto": true,
   "nota": "Hora 11 (y no la cargada de 21) para que hospital e industria (perfil empresa) estén en carga; supuesto.",
   "factores": {
    "S-NTN-EMERGENCIA": 0
   }
  },
  {
   "id": "E-CAIDA-EDGE-CENTRO",
   "nombre": "Caída del Edge Centro (con partido)",
   "hora": 21,
   "fallos": [
    "EDGE-CENTRO"
   ],
   "fallo_descripcion": "CPD Edge Centro completo (MEC y UPF local evento / video-ciudad)",
   "descripcion": "Edge-Este recibe el 60 % del estadio (prensa y tráfico ligero al 100 %, vídeo al 47 %) y el 100 % de las cámaras (+98,81 / 58,25 Gbit/s; 30 % de analítica). RTO 60 s estadio, 5 s cámaras.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1, §6.1 y A7; Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 y §5.6 F5",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   }
  },
  {
   "id": "E-CAIDA-EDGE-ESTE",
   "nombre": "Caída del Edge Este",
   "hora": 8,
   "fallos": [
    "EDGE-ESTE"
   ],
   "fallo_descripcion": "CPD Edge Este completo (MEC y UPF local v2x)",
   "descripcion": "V2X pasa a Edge-Centro (+0,045 Gbit/s por sentido); 5,8 ms de ida P95. RTO 5 s.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1; Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F7",
   "supuesto": true,
   "nota": "Hora 8 (punta de la A-2) en lugar de la cargada; supuesto.",
   "factores": {
    "S-NTN-EMERGENCIA": 0
   }
  },
  {
   "id": "E-CAIDA-CORE-1",
   "nombre": "Caída de un CPD core: DC-Centro",
   "hora": 21,
   "fallos": [
    "CORE-1"
   ],
   "fallo_descripcion": "CPD DC-Centro completo (5GC, IMS, UPF central, BNG)",
   "descripcion": "Cae DC-Centro: los otros dos DC asumen 1/2 del tráfico cada uno (activo-activo), ocupación ≤90 %. RTO 10 s control, 30 s llamadas nuevas. Es la caída de DC que más carga el transporte (2.1-S5d: Sur–Centro al 90 %; 3.2: agregados de 5 canales en las acometidas de los otros DC).",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DC); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F8",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   },
   "critico": true
  },
  {
   "id": "E-CAIDA-CORE-2",
   "nombre": "Caída de un CPD core: DC-Norte",
   "hora": 21,
   "fallos": [
    "CORE-2"
   ],
   "fallo_descripcion": "CPD DC-Norte completo (5GC, IMS, UPF central, BNG)",
   "descripcion": "Cae DC-Norte: los otros dos DC asumen 1/2 del tráfico cada uno (activo-activo), ocupación ≤90 %. RTO 10 s control, 30 s llamadas nuevas.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DN); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F8",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   }
  },
  {
   "id": "E-CAIDA-CORE-3",
   "nombre": "Caída de un CPD core: DC-Sur",
   "hora": 21,
   "fallos": [
    "CORE-3"
   ],
   "fallo_descripcion": "CPD DC-Sur completo (5GC, IMS, UPF central, BNG)",
   "descripcion": "Cae DC-Sur: los otros dos DC asumen 1/2 del tráfico cada uno (activo-activo), ocupación ≤90 %. RTO 10 s control, 30 s llamadas nuevas.",
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DS); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F8",
   "factores": {
    "S-NTN-EMERGENCIA": 0,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   }
  },
  {
   "id": "E-CORTE-ESTADIO",
   "nombre": "Corte de la fibra del estadio durante el partido",
   "hora": 21,
   "fallos": [
    "L-SITEMETROPOLITANO-METCENTRO"
   ],
   "fallo_descripcion": "acceso de fibra SITE-METROPOLITANO ↔ MET-CENTRO",
   "descripcion": "F13 de 3.1: sin pérdida solo si existe un segundo acceso por otra ruta [HYP, no diseñado]; el satélite solo cubre tráfico prioritario (centro de control).",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F13 y §5.7",
   "supuesto": true,
   "nota": "NTN al 0,33 = solo el terminal del estadio (1 de 3).",
   "factores": {
    "S-NTN-EMERGENCIA": 0.33,
    "S-ESTADIO-PRENSA": 1,
    "S-ESTADIO-LIGERO": 1,
    "S-ESTADIO-VIDEO": 1
   }
  },
  {
   "id": "E-CORTE-ACOMETIDA-HOSPITAL",
   "nombre": "Corte de la acometida de fibra del hospital",
   "hora": 11,
   "fallos": [
    "L-SITEHOSPITALGETAFE-METSUR"
   ],
   "fallo_descripcion": "acceso de fibra SITE-HOSPITAL-GETAFE ↔ MET-SUR",
   "descripcion": "F14 de 3.1: sin pérdida solo con segunda acometida por otro conducto (no diseñada aún). Con una sola, el hospital queda sin servicio de red: no se cumple el 99,999 % de ARCO02.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3 y §5.6 F14; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4; Semana 6/Teams (descargado 2026-11-02)/KPIs_Proyecto2_2026-10-27_v5.pdf §7",
   "supuesto": true,
   "nota": "Hora 11 para que el hospital esté en carga.",
   "factores": {
    "S-NTN-EMERGENCIA": 0
   }
  },
  {
   "id": "E-INCIDENTE-NTN",
   "nombre": "Incidente grave en el Sur con satélite de emergencia",
   "hora": 11,
   "fallos": [
    "MET-SUR",
    "L-SITEHOSPITALGETAFE-METSUR"
   ],
   "fallo_descripcion": "cae el nodo Metro-Sur y con él el acceso terrestre del hospital",
   "descripcion": "F15 de 3.1: cae la red terrestre en el Sur. La zona Sur queda aislada; se activan los terminales OneWeb (hospital, estadio y centro de control A-2) hacia el hub de Arganda en 60 s, solo para servicios prioritarios (VoNR, mensajería, telemetría), RTT 50–100 ms.",
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F15 y §5.7; Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (satélite de emergencia)",
   "supuesto": true,
   "nota": "El incidente concreto (caída de Metro-Sur) lo elige este fichero; los documentos hablan de 'caída de la red terrestre en una sede' o 'incidente grave'.",
   "factores": {
    "S-NTN-EMERGENCIA": 1
   }
  },
  {
   "id": "E-TABLA8",
   "nombre": "Dimensionado (todo en hora cargada)",
   "descripcion": "Todas las demandas en su hora cargada a la vez, sin perfiles horarios. Reproduce la suma de la Tabla 8 / A11.1 del informe 3.2 (caso de dimensionado, más exigente que cualquier hora real). Sin evento ni servicios inactivos.",
   "hora": 21,
   "hora_cargada": true,
   "factores": {},
   "fallos": [],
   "supuesto": true,
   "nota": "Escenario de comprobación añadido en la integración: sirve para contrastar el simulador con las tablas de dimensionado."
  },
  {
   "id": "E-TABLA8-CERCANO",
   "nombre": "Dimensionado con todo al CPD más cercano",
   "descripcion": "Como E-TABLA8 pero sin reparto 1/3 entre CPD: cada zona manda todo al CPD más cercano. Muestra por qué las acometidas de UPF2 exigen el reparto equitativo.",
   "hora": 21,
   "hora_cargada": true,
   "reparto_core": "cercano",
   "factores": {},
   "fallos": [],
   "supuesto": true,
   "nota": "Escenario de comparación añadido en la integración."
  }
 ],
 "modelos_trafico": {
  "_nota": "Modelos de tráfico (PLAN_v2 §4). Se edita a mano. 'origen': documento = lo usa el equipo y está en la memoria; supuesto = aportación del simulador, sin fuente en los documentos, editable. Los documentos solo usan una hora cargada coincidente (memoria v7 §2.7.2, A4).",
  "modelos": [
   {
    "id": "BH",
    "orden": 1,
    "origen": "documento",
    "nombre_es": "Hora cargada coincidente",
    "nombre_en": "Coincident busy hour",
    "desc_es": "Todas las zonas y servicios en su hora cargada a la vez. Es el caso de dimensionado del equipo: cota superior.",
    "desc_en": "All zones and services at their busy hour at the same time. The team's sizing case: upper bound.",
    "fuente": "Memoria conjunta v7 §2.7.2 y A4 (R = N·V·8·0,10/(30·3600))",
    "hora_cargada": true,
    "factores_tipo": {}
   },
   {
    "id": "P2",
    "orden": 2,
    "origen": "documento",
    "nombre_es": "Pico P2 (Internet ×2)",
    "nombre_en": "P2 peak (Internet ×2)",
    "desc_es": "Hora cargada con Internet fijo y móvil duplicados; voz y sensores sin duplicar. Ocupación admitida 0,90.",
    "desc_en": "Busy hour with fixed and mobile Internet doubled; voice and sensors not doubled. Allowed occupancy 0.90.",
    "fuente": "Memoria conjunta v7 §2.7.2; §6.4.4",
    "hora_cargada": true,
    "factores_tipo": {
     "residencial-fijo": 2,
     "empresa": 2,
     "movil-ebb": 2
    }
   },
   {
    "id": "PM",
    "orden": 3,
    "origen": "documento",
    "nombre_es": "Pico PM (solo móvil ×2)",
    "nombre_en": "PM peak (mobile only ×2)",
    "desc_es": "Sensibilidad: solo el Internet móvil se duplica. Dimensiona la radio.",
    "desc_en": "Sensitivity: only mobile Internet doubles. Sizes the radio access.",
    "fuente": "Memoria conjunta v7 §2.7.2; A5",
    "hora_cargada": true,
    "factores_tipo": {
     "movil-ebb": 2
    }
   },
   {
    "id": "NC",
    "orden": 4,
    "origen": "supuesto",
    "nombre_es": "Hora cargada no coincidente",
    "nombre_en": "Non-coincident busy hour",
    "desc_es": "Cada necesidad sigue su perfil de 24 h según el tipo de zona: el residencial pica de noche, la empresa y el móvil en oficinas por la mañana. La suma de picos ya no coincide.",
    "desc_en": "Each demand follows its 24 h profile by zone type: residential peaks at night, business and mobile in office areas in the morning. Peaks no longer add up.",
    "fuente": "Supuesto del simulador: los documentos no dan perfiles horarios (hueco F0).",
    "hora_cargada": false,
    "factores_tipo": {}
   },
   {
    "id": "PEND",
    "orden": 5,
    "origen": "supuesto",
    "nombre_es": "Movilidad pendular",
    "nombre_en": "Commuting mobility",
    "desc_es": "Como el no coincidente, pero una fracción de los usuarios móviles de la periferia trabaja en Madrid: su tráfico móvil y de voz se genera en Madrid en horario laboral. El total no cambia; se mueve entre zonas.",
    "desc_en": "Like non-coincident, but a share of mobile users from the outer municipalities work in Madrid: their mobile and voice traffic is generated in Madrid during working hours. Total unchanged; it moves between zones.",
    "fuente": "Supuesto del simulador. Fuente candidata para el equipo (no consultada): Encuesta Domiciliaria de Movilidad del Consorcio Regional de Transportes de Madrid.",
    "hora_cargada": false,
    "factores_tipo": {},
    "pendular": true
   }
  ],
  "tipos_zona": {
   "_nota": "Supuesto del simulador, editable. Fija el perfil horario del móvil y la voz de la zona.",
   "Z-MADRID": "mixto",
   "Z-ALCOBENDAS": "oficinas",
   "Z-TRESCANTOS": "oficinas",
   "Z-TORREJON": "residencial",
   "Z-ALCALA": "residencial",
   "Z-GETAFE": "residencial",
   "Z-LEGANES": "residencial",
   "Z-FUENLABRADA": "residencial",
   "Z-ALCORCON": "residencial"
  },
  "perfiles_extra": {
   "_nota": "Supuestos (forma horaria, valor 1 = su hora cargada). Se suman a los perfiles de datos/zonas.json.",
   "movil-residencial": [
    0.25,
    0.15,
    0.1,
    0.08,
    0.08,
    0.12,
    0.3,
    0.55,
    0.6,
    0.5,
    0.5,
    0.55,
    0.6,
    0.62,
    0.6,
    0.6,
    0.65,
    0.75,
    0.85,
    0.92,
    0.97,
    1.0,
    0.85,
    0.5
   ],
   "movil-oficinas": [
    0.08,
    0.05,
    0.04,
    0.04,
    0.05,
    0.1,
    0.3,
    0.7,
    0.95,
    1.0,
    1.0,
    0.98,
    0.95,
    0.9,
    0.92,
    0.95,
    0.9,
    0.75,
    0.55,
    0.4,
    0.3,
    0.25,
    0.18,
    0.12
   ],
   "movil-mixto": [
    0.2,
    0.12,
    0.08,
    0.06,
    0.07,
    0.12,
    0.3,
    0.6,
    0.8,
    0.82,
    0.83,
    0.85,
    0.88,
    0.86,
    0.84,
    0.85,
    0.88,
    0.92,
    0.95,
    0.97,
    1.0,
    0.98,
    0.8,
    0.45
   ]
  },
  "pendular": {
   "_nota": "Supuesto del simulador. fraccion = parte de los usuarios móviles de la zona que trabaja en Madrid; presencia = qué parte de esa fracción está en Madrid a cada hora.",
   "destino": "Z-MADRID",
   "tipos_afectados": [
    "movil-ebb",
    "voz-ims"
   ],
   "fraccion": {
    "Z-ALCOBENDAS": 0.2,
    "Z-TRESCANTOS": 0.2,
    "Z-TORREJON": 0.3,
    "Z-ALCALA": 0.25,
    "Z-GETAFE": 0.3,
    "Z-LEGANES": 0.3,
    "Z-FUENLABRADA": 0.3,
    "Z-ALCORCON": 0.3
   },
   "presencia": [
    0,
    0,
    0,
    0,
    0,
    0,
    0.1,
    0.6,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0.9,
    0.5,
    0.2,
    0.05,
    0,
    0,
    0,
    0
   ]
  },
  "tipos_dia": {
   "_nota": "Supuestos del simulador: multiplicadores por perfil sobre el día laborable. 'servicios' fija factores de servicios concretos (p. ej. el estadio solo el día de partido).",
   "laborable": {
    "nombre_es": "Laborable",
    "nombre_en": "Weekday",
    "perfil": {},
    "servicios": {
     "S-ESTADIO-PRENSA": 0,
     "S-ESTADIO-LIGERO": 0,
     "S-ESTADIO-VIDEO": 0
    }
   },
   "fin_de_semana": {
    "nombre_es": "Fin de semana",
    "nombre_en": "Weekend",
    "perfil": {
     "empresa": 0.25,
     "movil-oficinas": 0.35,
     "residencial": 1.1,
     "movil-residencial": 1.05
    },
    "servicios": {
     "S-ESTADIO-PRENSA": 0,
     "S-ESTADIO-LIGERO": 0,
     "S-ESTADIO-VIDEO": 0
    },
    "sin_pendular": true
   },
   "agosto": {
    "nombre_es": "Agosto",
    "nombre_en": "August",
    "perfil": {
     "empresa": 0.4,
     "movil-oficinas": 0.5,
     "residencial": 0.75,
     "movil-residencial": 0.75,
     "movil-mixto": 0.7
    },
    "servicios": {
     "S-ESTADIO-PRENSA": 0,
     "S-ESTADIO-LIGERO": 0,
     "S-ESTADIO-VIDEO": 0
    },
    "pendular_factor": 0.5
   },
   "partido": {
    "nombre_es": "Día de partido",
    "nombre_en": "Match day",
    "perfil": {},
    "servicios": {
     "S-ESTADIO-PRENSA": 1,
     "S-ESTADIO-LIGERO": 1,
     "S-ESTADIO-VIDEO": 1
    }
   }
  },
  "crecimiento": {
   "_nota": "Documento: la proyección del 3.2 es lineal en años para la población (P·(1+n·b/P_padrón)) y geométrica para el volumen (V·(1+g)^n). El simulador la evalúa año a año con modelo_demanda.js. Servicios especiales constantes (supuesto).",
   "anio_min": 2025,
   "anio_max": 2031,
   "anio_defecto": 2031
  }
 }
};
if (typeof window !== 'undefined') window.RED = RED;
if (typeof module !== 'undefined' && module.exports) module.exports = RED;
