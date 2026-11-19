// Generado por fusionar.py — no editar a mano. Editar datos/*.json y volver a fusionar.
var RED = {
 "meta": {
  "version": "2026-11-19",
  "fecha": "2026-11-19",
  "fuentes": [
   "datos/zonas.json",
   "datos/red_fisica.json",
   "datos/servicios.json",
   "datos/integracion.json",
   "datos/entrega2.json"
  ],
  "cabecera_transporte": {
   "general": 1.1,
   "por_tipo": {
    "voz-ims": 1.44
   },
   "fuente_e2": "v7 §2.7.2, §3.4.1, §4.3: F = 1,10·R_resto + 1,44·Q_VoNR (144 B/100 B), una sola vez",
   "nota": "Las cargas de enlaces y nodos son Gbit/s físicos (con cabecera); la demanda y lo servido se muestran en Gbit/s IP.",
   "por_prefijo": {
    "S-L2VPN-": 1.0
   },
   "nota_por_prefijo": "L2VPN sin cabecera 1,10: la v7 aplica F = 1,10·R_resto a la matriz A11, que no incluye la L2VPN (reservada aparte, §6.4.3); la cota de 10 GbE por UNI (§6.9) ya es velocidad de línea Ethernet."
  },
  "referencia": {
   "doc": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "nombre": "Entrega 2 · memoria conjunta v7"
  }
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
   "poblacion": 3663025,
   "poblacion_2025": 3477497,
   "hogar_medio": 2.5,
   "hogares_2025": 1390999,
   "empresas_2025": 297693,
   "cuota_area": 1.0,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 454318,
   "abonados_moviles": 1235194,
   "lineas_datos_moviles": 1071244,
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
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
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
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
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
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
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
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
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
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (CENTRO), no por municipio: el municipio recibe 100.0 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 73.323 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (3663025) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área CENTRO suma 164.688/93.752 Gbit/s DL/UL: evento Metropolitano 164,688/88,750 + IoT/cámaras Valdebebas 0/5,002). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 2433.511,
   "ul_gbps": 343.448
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
   "poblacion": 131549,
   "poblacion_2025": 123222,
   "hogar_medio": 3.0,
   "hogares_2025": 41074,
   "empresas_2025": 10393,
   "cuota_area": 0.675481,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 16316,
   "abonados_moviles": 44359,
   "lineas_datos_moviles": 38471,
   "agg": "AGG-ALCOBENDAS",
   "edge": null,
   "necesidades": [
    {
     "id": "Z-ALCOBENDAS/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 47.176,
     "ul_gbps": 5.242,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.621 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCOBENDAS/empresa",
     "tipo": "empresa",
     "dl_gbps": 28.787,
     "ul_gbps": 3.199,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.379 del fijo; 10393 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCOBENDAS/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 9.155,
     "ul_gbps": 1.616,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCOBENDAS/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.3307,
     "ul_gbps": 1.3307,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-ALCOBENDAS/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.9476,
     "ul_gbps": 0.9476,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (NORTE), no por municipio: el municipio recibe 67.55 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 3.898 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (194748) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área NORTE suma 0.0/0.0 Gbit/s DL/UL: ninguno). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Edge: Norte no tiene Edge (S7 apartado 5); edge = null: sus demandas con destino edge irían al CPD más cercano (DC-Norte).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 87.3963,
   "ul_gbps": 12.3353
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
   "poblacion": 58281,
   "poblacion_2025": 54592,
   "hogar_medio": 2.9,
   "hogares_2025": 18825,
   "empresas_2025": 3586,
   "cuota_area": 0.299264,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 7228,
   "abonados_moviles": 19653,
   "lineas_datos_moviles": 17044,
   "agg": "AGG-TRESCANTOS",
   "edge": null,
   "necesidades": [
    {
     "id": "Z-TRESCANTOS/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 23.061,
     "ul_gbps": 2.562,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.685 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TRESCANTOS/empresa",
     "tipo": "empresa",
     "dl_gbps": 10.594,
     "ul_gbps": 1.177,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.315 del fijo; 3586 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TRESCANTOS/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 4.056,
     "ul_gbps": 0.716,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TRESCANTOS/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 0.5895,
     "ul_gbps": 0.5895,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-TRESCANTOS/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.4198,
     "ul_gbps": 0.4198,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (NORTE), no por municipio: el municipio recibe 29.93 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 3.898 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (194748) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área NORTE suma 0.0/0.0 Gbit/s DL/UL: ninguno). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Edge: Norte no tiene Edge (S7 apartado 5); edge = null: sus demandas con destino edge irían al CPD más cercano (DC-Norte).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 38.7203,
   "ul_gbps": 5.4643
  },
  {
   "id": "Z-TALAMANCA",
   "nombre": "Talamanca de Jarama",
   "area": "NORTE",
   "municipios": [
    "Talamanca de Jarama"
   ],
   "centro": [
    40.7445,
    -3.51
   ],
   "poblacion": 4918,
   "poblacion_2025": 4607,
   "hogar_medio": 2.7,
   "hogares_2025": 1706,
   "empresas_2025": 230,
   "cuota_area": 0.025255,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "nuevo_v7": true,
   "rural": true,
   "centro_aproximado": true,
   "abonados_fijos": 610,
   "abonados_moviles": 1658,
   "lineas_datos_moviles": 1438,
   "agg": "AGG-TALAMANCA",
   "edge": null,
   "necesidades": [
    {
     "id": "Z-TALAMANCA/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 2.143,
     "ul_gbps": 0.238,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.755 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TALAMANCA/empresa",
     "tipo": "empresa",
     "dl_gbps": 0.697,
     "ul_gbps": 0.077,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.245 del fijo; 230 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TALAMANCA/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 0.342,
     "ul_gbps": 0.06,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TALAMANCA/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 0.0498,
     "ul_gbps": 0.0498,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-TALAMANCA/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.0354,
     "ul_gbps": 0.0354,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (NORTE), no por municipio: el municipio recibe 2.53 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 3.898 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (194748) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área NORTE suma 0.0/0.0 Gbit/s DL/UL: ninguno). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Municipio pequeño de referencia de su zona (v7 §2.5, actas 28/09 y 04/10), escenario rural n28. Estaba en los totales de zona de la v7 pero el simulador lo repartía entre los municipios grandes (rurales absorbidos); desde F2.0c tiene zona y nodo AGG propios. Coordenada del centro aproximada (casco urbano, tomada a mano del mapa). Edge: Norte no tiene Edge (S7 apartado 5); edge = null: sus demandas con destino edge irían al CPD más cercano (DC-Norte).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "aproximado",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 3.2672,
   "ul_gbps": 0.4602
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
   "poblacion": 149759,
   "poblacion_2025": 144211,
   "hogar_medio": 2.8,
   "hogares_2025": 51504,
   "empresas_2025": 6457,
   "cuota_area": 0.412471,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 18574,
   "abonados_moviles": 50500,
   "lineas_datos_moviles": 43797,
   "agg": "AGG-TORREJON",
   "edge": "EDGE-ESTE",
   "necesidades": [
    {
     "id": "Z-TORREJON/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 66.4,
     "ul_gbps": 7.378,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.768 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TORREJON/empresa",
     "tipo": "empresa",
     "dl_gbps": 20.075,
     "ul_gbps": 2.231,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.232 del fijo; 6457 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TORREJON/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 10.422,
     "ul_gbps": 1.839,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-TORREJON/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.5138,
     "ul_gbps": 1.5138,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-TORREJON/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.0788,
     "ul_gbps": 1.0788,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (ESTE), no por municipio: el municipio recibe 41.25 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 7.268 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (363077) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área ESTE suma 0.045/0.045 Gbit/s DL/UL: V2X A-2 0,045/0,045). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 99.4896,
   "ul_gbps": 14.0406
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
   "poblacion": 210341,
   "poblacion_2025": 202549,
   "hogar_medio": 2.7,
   "hogares_2025": 75018,
   "empresas_2025": 9786,
   "cuota_area": 0.579329,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 26088,
   "abonados_moviles": 70928,
   "lineas_datos_moviles": 61514,
   "agg": "AGG-ALCALA",
   "edge": "EDGE-ESTE",
   "necesidades": [
    {
     "id": "Z-ALCALA/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 92.392,
     "ul_gbps": 10.266,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.761 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCALA/empresa",
     "tipo": "empresa",
     "dl_gbps": 29.065,
     "ul_gbps": 3.229,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.239 del fijo; 9786 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCALA/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 14.638,
     "ul_gbps": 2.583,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCALA/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.1261,
     "ul_gbps": 2.1261,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-ALCALA/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.5152,
     "ul_gbps": 1.5152,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (ESTE), no por municipio: el municipio recibe 57.93 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 7.268 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (363077) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área ESTE suma 0.045/0.045 Gbit/s DL/UL: V2X A-2 0,045/0,045). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 139.7363,
   "ul_gbps": 19.7193
  },
  {
   "id": "Z-LOSSANTOS",
   "nombre": "Los Santos de la Humosa",
   "area": "ESTE",
   "municipios": [
    "Los Santos de la Humosa"
   ],
   "centro": [
    40.5,
    -3.256
   ],
   "poblacion": 2977,
   "poblacion_2025": 2867,
   "hogar_medio": 2.8,
   "hogares_2025": 1024,
   "empresas_2025": 126,
   "cuota_area": 0.0082,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "nuevo_v7": true,
   "rural": true,
   "centro_aproximado": true,
   "abonados_fijos": 369,
   "abonados_moviles": 1004,
   "lineas_datos_moviles": 871,
   "agg": "AGG-LOSSANTOS",
   "edge": "EDGE-ESTE",
   "necesidades": [
    {
     "id": "Z-LOSSANTOS/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 1.326,
     "ul_gbps": 0.147,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.771 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LOSSANTOS/empresa",
     "tipo": "empresa",
     "dl_gbps": 0.393,
     "ul_gbps": 0.044,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.229 del fijo; 126 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LOSSANTOS/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 0.207,
     "ul_gbps": 0.037,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LOSSANTOS/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 0.0301,
     "ul_gbps": 0.0301,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-LOSSANTOS/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.0214,
     "ul_gbps": 0.0214,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (ESTE), no por municipio: el municipio recibe 0.82 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 7.268 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (363077) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área ESTE suma 0.045/0.045 Gbit/s DL/UL: V2X A-2 0,045/0,045). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Municipio pequeño de referencia de su zona (v7 §2.5, actas 28/09 y 04/10), escenario rural n28. Estaba en los totales de zona de la v7 pero el simulador lo repartía entre los municipios grandes (rurales absorbidos); desde F2.0c tiene zona y nodo AGG propios. Coordenada del centro aproximada (casco urbano, tomada a mano del mapa).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "aproximado",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 1.9775,
   "ul_gbps": 0.2795
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
   "poblacion": 199414,
   "poblacion_2025": 195628,
   "hogar_medio": 2.6,
   "hogares_2025": 75242,
   "empresas_2025": 9655,
   "cuota_area": 0.257348,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 24733,
   "abonados_moviles": 67244,
   "lineas_datos_moviles": 58318,
   "agg": "AGG-GETAFE",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-GETAFE/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 87.936,
     "ul_gbps": 9.771,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.764 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-GETAFE/empresa",
     "tipo": "empresa",
     "dl_gbps": 27.212,
     "ul_gbps": 3.024,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.236 del fijo; 9655 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-GETAFE/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.878,
     "ul_gbps": 2.449,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-GETAFE/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.0176,
     "ul_gbps": 2.0176,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-GETAFE/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.4364,
     "ul_gbps": 1.4364,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 25.73 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 15.511 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (774882) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 132.48,
   "ul_gbps": 18.698
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
   "poblacion": 199738,
   "poblacion_2025": 195946,
   "hogar_medio": 2.6,
   "hogares_2025": 75364,
   "empresas_2025": 9301,
   "cuota_area": 0.257766,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 24773,
   "abonados_moviles": 67353,
   "lineas_datos_moviles": 58413,
   "agg": "AGG-LEGANES",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-LEGANES/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 88.882,
     "ul_gbps": 9.876,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.771 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LEGANES/empresa",
     "tipo": "empresa",
     "dl_gbps": 26.453,
     "ul_gbps": 2.939,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.229 del fijo; 9301 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LEGANES/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.9,
     "ul_gbps": 2.453,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-LEGANES/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 2.0209,
     "ul_gbps": 2.0209,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-LEGANES/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.4388,
     "ul_gbps": 1.4388,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 25.78 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 15.511 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (774882) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 132.6947,
   "ul_gbps": 18.7277
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
   "poblacion": 193488,
   "poblacion_2025": 189814,
   "hogar_medio": 2.8,
   "hogares_2025": 67791,
   "empresas_2025": 10090,
   "cuota_area": 0.249699,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 23998,
   "abonados_moviles": 65245,
   "lineas_datos_moviles": 56585,
   "agg": "AGG-FUENLABRADA",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-FUENLABRADA/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 82.216,
     "ul_gbps": 9.135,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.736 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-FUENLABRADA/empresa",
     "tipo": "empresa",
     "dl_gbps": 29.51,
     "ul_gbps": 3.279,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.264 del fijo; 10090 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-FUENLABRADA/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 13.465,
     "ul_gbps": 2.376,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-FUENLABRADA/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.9576,
     "ul_gbps": 1.9576,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-FUENLABRADA/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.3938,
     "ul_gbps": 1.3938,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 24.97 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 15.511 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (774882) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 128.5424,
   "ul_gbps": 18.1414
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
   "poblacion": 180228,
   "poblacion_2025": 176806,
   "hogar_medio": 2.6,
   "hogares_2025": 68002,
   "empresas_2025": 8883,
   "cuota_area": 0.232587,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "abonados_fijos": 22353,
   "abonados_moviles": 60774,
   "lineas_datos_moviles": 52707,
   "agg": "AGG-ALCORCON",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-ALCORCON/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 79.139,
     "ul_gbps": 8.793,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.76 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCORCON/empresa",
     "tipo": "empresa",
     "dl_gbps": 24.93,
     "ul_gbps": 2.77,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.24 del fijo; 8883 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCORCON/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 12.542,
     "ul_gbps": 2.213,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-ALCORCON/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 1.8235,
     "ul_gbps": 1.8235,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-ALCORCON/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 1.2982,
     "ul_gbps": 1.2982,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 23.26 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 15.511 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (774882) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil).",
   "proc": {
    "poblacion": {
     "t": "v7",
     "f": "v7 §6.1.1 (180 228 hab., FTTH Alcorcón); coincide con el reparto"
    },
    "abonados_fijos": {
     "t": "v7",
     "f": "v7 §6.1.1 (22 353 accesos)"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "casco urbano",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 119.7327,
   "ul_gbps": 16.8977
  },
  {
   "id": "Z-BATRES",
   "nombre": "Batres",
   "area": "SUR",
   "municipios": [
    "Batres"
   ],
   "centro": [
    40.2095,
    -3.922
   ],
   "poblacion": 2014,
   "poblacion_2025": 1976,
   "hogar_medio": 2.8,
   "hogares_2025": 706,
   "empresas_2025": 170,
   "cuota_area": 0.002599,
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "nuevo_v7": true,
   "rural": true,
   "centro_aproximado": true,
   "abonados_fijos": 250,
   "abonados_moviles": 679,
   "lineas_datos_moviles": 589,
   "agg": "AGG-BATRES",
   "edge": "EDGE-SUR",
   "necesidades": [
    {
     "id": "Z-BATRES/residencial-fijo",
     "tipo": "residencial-fijo",
     "dl_gbps": 0.736,
     "ul_gbps": 0.082,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 5,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8 y A4/A6 (Internet fijo BNG, reparto 90/10, +25 %)",
     "supuesto": true,
     "nota": "Parte residencial del Internet fijo del municipio (0.633 del fijo). Los documentos no separan empresa en datos: el reparto residencial/empresa usa el peso de líneas fijas de A1 (0,622·hogares vs 1,5·empresas DIRCE) — supuesto. Slice 'fijo-bng': no pasa por 5GC (Tabla 9). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 5",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-BATRES/empresa",
     "tipo": "empresa",
     "dl_gbps": 0.427,
     "ul_gbps": 0.047,
     "perfil": "empresa",
     "destino": "internet",
     "slice": "fijo-bng",
     "prioridad": 3,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4/8, A1 (1,5 líneas por empresa), DIRCE 2025 en Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion poblacion 2025.md T4",
     "supuesto": true,
     "nota": "Parte empresa del Internet fijo (0.367 del fijo; 170 empresas DIRCE). Reparto supuesto con el peso de líneas de A1; perfil y prioridad supuestos. Los documentos suman todo en una misma hora cargada: con perfil empresa la suma simulada a las 21 h queda por debajo de la Tabla 8.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet fijo BNG de la zona (v7 §3.4.1, 90/10, +25 %) × cuota × peso residencial/empresa",
       "s": "S-030"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 3",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'empresa' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-BATRES/movil-ebb",
     "tipo": "movil-ebb",
     "dl_gbps": 0.14,
     "ul_gbps": 0.025,
     "perfil": "residencial",
     "destino": "internet",
     "slice": "eMBB",
     "dnn": "internet",
     "prioridad": 4,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4, Tabla 8, A4/A6 (Internet móvil UPF central, reparto 85/15, +25 %); slice/DNN: Asignación S-NSSAI eMBB (1, 000001) DNN internet",
     "nota": "Termina en la UPF central de los DC (no en Edge). Prioridad supuesta.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "Internet móvil UPF de la zona (v7 §3.4.1, 85/15, +25 %) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 4",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      }
     }
    },
    {
     "id": "Z-BATRES/voz-ims",
     "tipo": "voz-ims",
     "dl_gbps": 0.0204,
     "ul_gbps": 0.0204,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "eMBB",
     "dnn": "ims",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 4 (VoNR 0,04 Mbit/s por extremo y sentido, 0,3 Erl) y Tabla 8 (VoNR por zona, +25 %)",
     "nota": "VoNR por sentido. Prioridad y latencia_max_ms (20 ms de presupuesto en red de transporte/core) supuestas; los documentos no fijan latencia de voz. Perfil residencial supuesto (los documentos usan una única hora cargada).",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "VoNR por sentido de la zona (v7 §3.4.1) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    },
    {
     "id": "Z-BATRES/voz-fija",
     "tipo": "voz-fija",
     "dl_gbps": 0.0145,
     "ul_gbps": 0.0145,
     "perfil": "residencial",
     "destino": "ims",
     "slice": "fijo-bng",
     "prioridad": 2,
     "latencia_max_ms": 20,
     "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · A11 (voz fija RTP 35,985952 Gbit/s/sentido repartida por peso de Internet DL); Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx · H-E7; Semana 6/Cierre 3.2 (2026-11-02)/G32_3.2-E_completo_v02-11.docx · Tabla A11.1",
     "nota": "Voz fija RTP G.711 0,128 Mbit/s (0,3 Erl × 749 707 líneas × 1,25). Solo está en el cálculo de transporte, no en la Tabla 8; códec supuesto por 3.2 y pendiente de Dirección. Prioridad y latencia supuestas.",
     "proc": {
      "cuota": {
       "t": "supuesto",
       "f": "cuota del municipio en su zona Metro (población 2025)",
       "s": "S-029"
      },
      "dl_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "ul_gbps": {
       "t": "calculado",
       "f": "35,985952 Gbit/s por sentido repartidos por Internet DL (v7 §3.4.1, A11) × cuota",
       "s": "S-029"
      },
      "prioridad": {
       "t": "supuesto",
       "f": "prioridad 2",
       "s": "S-028"
      },
      "destino": {
       "t": "v7",
       "f": "v7 §3.3: el Internet fijo termina en el BNG; móvil y VoNR en la UPF central; voz en el IMS"
      },
      "perfil": {
       "t": "supuesto",
       "f": "perfil horario 'residencial' (solo fuera de la hora cargada)",
       "s": "S-027"
      },
      "latencia_max_ms": {
       "t": "supuesto",
       "f": "20 ms de transporte/core",
       "s": "S-023"
      }
     }
    }
   ],
   "fuente": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx §3.1.1 y §3.4.1; Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx · Tabla 1 (penetraciones CNMC 2025), A6 y Tabla 8 (reparto por zona Metro, mismas cifras que v7 §3.4.1)",
   "supuesto": true,
   "nota": "Año horizonte 2031, hora cargada, +25 % aplicado una vez. Los documentos dan la demanda por zona Metro (SUR), no por municipio: el municipio recibe 0.26 % de su área según su población 2025 (v7 §3.1.1; supuesto del simulador: mismo crecimiento 2025-2031 dentro del área, como la v7 hace con hogares, empresas y líneas). Peso del área en la red 15.511 % (Tabla 8 = v7 §3.4.1; Sur exacto de A6: 397,7262/2564,18). Población 2031 = población 2031 de la zona en v7 §3.1.1 (774882) × cuota (Alcorcón da 180 228, la cifra FTTH de la v7). Hogares 2025 = población / hogar medio (v7 §3.1.1). Abonados fijos = accesos de Internet fijo Op1 (0,404·0,307 por hab.); abonados móviles = líneas IMS móviles Op1 (1,307·0,258 por hab., A1 → 1 684 591 en total). La base zonal sin redondear está pendiente en los documentos (S7 apartado 7), así que los pesos salen de cifras redondeadas a 0,01 Gbit/s. Servicios especiales EXCLUIDOS (los modela otro agente; en Tabla 8 el área SUR suma 0.588/0.802 Gbit/s DL/UL: Hospital de Getafe 0,500/0,6025 + piloto industrial 0,0875/0,200). Sin necesidad IoT: el único IoT de los documentos es el de Valdebebas (servicio especial). TV/streaming no se separa en los documentos (va dentro del Internet fijo/móvil). Municipio pequeño de referencia de su zona (v7 §2.5, actas 28/09 y 04/10), escenario rural n28. Estaba en los totales de zona de la v7 pero el simulador lo repartía entre los municipios grandes (rurales absorbidos); desde F2.0c tiene zona y nodo AGG propios. Coordenada del centro aproximada (casco urbano, tomada a mano del mapa).",
   "proc": {
    "poblacion": {
     "t": "calculado",
     "f": "población 2031 de la zona Metro (v7 §3.1.1) × cuota 2025 del municipio",
     "s": "S-029"
    },
    "abonados_fijos": {
     "t": "calculado",
     "f": "población 2031 × 0,404 × 0,307 (v7 §3.1.1)",
     "s": "S-029"
    },
    "abonados_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,307 × 0,258 (v7 §3.1.1)",
     "s": "S-029"
    },
    "lineas_datos_moviles": {
     "t": "calculado",
     "f": "población 2031 × 1,184 × 0,247 (v7 §3.1.1)",
     "s": "S-029"
    },
    "poblacion_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogar_medio": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "empresas_2025": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios)"
    },
    "hogares_2025": {
     "t": "calculado",
     "f": "población 2025 / hogar medio (v7 §3.1.1)"
    },
    "cuota_area": {
     "t": "calculado",
     "f": "población 2025 del municipio / población 2025 de su zona Metro",
     "s": "S-029"
    },
    "dl_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "ul_gbps": {
     "t": "calculado",
     "f": "suma de necesidades: demanda v7 §3.4.1 de la zona Metro × cuota del municipio",
     "s": "S-029"
    },
    "centro": {
     "t": "supuesto",
     "f": "aproximado",
     "s": "S-020"
    },
    "area": {
     "t": "v7",
     "f": "v7 §3.1.1 / §3.1.2 (municipios de cada zona Metro)"
    },
    "agg": {
     "t": "supuesto",
     "f": "nodo de agregación abstracto",
     "s": "S-001"
    },
    "edge": {
     "t": "v7",
     "f": "v7 §3.1.2 (Edge en Centro, Este y Sur; Norte sin Edge)"
    }
   },
   "dl_gbps": 1.3379,
   "ul_gbps": 0.1889
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
   "capacidad_gbps": null,
   "capacidad_detalle": {
    "bng_chasis_activos": 3,
    "bng_chasis_respaldo": 2,
    "bng_chasis_total": 5,
    "bng_respaldo_de": "Norte + ½ Este y Sur + ½ Este (1 chasis cada una)",
    "upf_central": "3 servidores R760 por DC; UPF central total 398,20 / 111,89 Gbit/s IP",
    "nota": "3 DC activo-activo, cada uno dimensionado para el 50 % de la carga (N−1). BNG total: 10 chasis Nokia 7750 SR-2se, 774.515 sesiones, 2.885 Gbit/s DL. Respaldo georredundante: si cae DC-Centro, el BNG de Centro pasa a DC-Sur por la acometida C–DC-Sur."
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
   "nota": "Capacidad de proceso del DC no limitada en el simulador: la v7 lo dimensiona para el 50 % de la carga total y lo que se comprueba son las acometidas.",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.2, §6.10.1, §6.7.4; contradicción resuelta 1 y 3",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 5GC SA + Nokia CNCS (IMS) sobre OpenShift; BNG Nokia 7750 SR-2se; servidores Dell R760",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-009"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §3.1.2, §6.10.1, §6.7.4; contradicción resuelta 1 y 3"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (tabla de equipos)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
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
   "capacidad_gbps": null,
   "capacidad_detalle": {
    "bng_chasis_activos": 1,
    "bng_chasis_respaldo": 0,
    "bng_chasis_total": 1,
    "bng_respaldo_en": "DC-Centro (acometida directa Metro-Norte → DC-Centro)",
    "nota": "Atiende el BNG de Norte + ½ Este."
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
   "nota": "Capacidad de proceso del DC no limitada en el simulador (50 % de la carga total por DC, v7).",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.2, §6.10.1",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 5GC SA + Nokia CNCS (IMS) sobre OpenShift; BNG Nokia 7750 SR-2se; servidores Dell R760",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-009"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §3.1.2, §6.10.1"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (tabla de equipos)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
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
   "capacidad_gbps": null,
   "capacidad_detalle": {
    "bng_chasis_activos": 1,
    "bng_chasis_respaldo": 3,
    "bng_chasis_total": 4,
    "bng_respaldo_de": "Centro (3 chasis)",
    "bng_respaldo_en": "DC-Centro (vano S–C + acometida C–DC-Centro)",
    "nota": "Atiende el BNG de Sur + ½ Este y guarda el respaldo de Centro."
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
   "nota": "Capacidad de proceso del DC no limitada en el simulador (50 % de la carga total por DC, v7).",
   "transito": false,
   "nota_transito": "No se permite tránsito por los DC (UPF2 §5.4): el motor no debe usar este nodo como salto intermedio.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.2, §6.10.1",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 5GC SA + Nokia CNCS (IMS) sobre OpenShift; BNG Nokia 7750 SR-2se; servidores Dell R760",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-009"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §3.1.2, §6.10.1"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (tabla de equipos)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
  },
  {
   "id": "MET-CENTRO",
   "tipo": "metro",
   "nombre": "Metro-Centro",
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
   "respaldo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §1, §3, §5, §6.1 (anillo C-N-E-S, Nokia 7750 SR + 1830 PSS candidatos); 20 µs por salto (3.1 respuesta 27/10, citada en S5d §2)",
   "supuesto": true,
   "nota": "Un router de agregación por nodo [HYP]. Nodo crítico: 74,6 % de la demanda (2.571,81 de 3.448,22 Gbit/s DL). Duplicarlo (MET-CENTRO-B) es una propuesta sin resolver en la v7 (contradicción 5), por eso no está en la red de referencia.",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.4.1, §6.4.2, §6.4.3",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 7750 SR (IP/MPLS) + Nokia 1830 PSS (WDM/OTN)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-011"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.4.1: un router por nodo; MET-CENTRO-B no está en la red de referencia"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 y §6.4.1"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "20 µs por salto (3.1 respuesta 27/10)"
    }
   }
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
   "nota": "Emplazamiento plausible: polígono industrial de Alcobendas, junto a DC-Norte. Un solo PE (sin doble PE).",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.4.1",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 7750 SR (IP/MPLS) + Nokia 1830 PSS (WDM/OTN)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-011"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.4.1: un router por nodo; MET-CENTRO-B no está en la red de referencia"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 y §6.4.1"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "20 µs por salto (3.1 respuesta 27/10)"
    }
   }
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
   "nota": "Emplazamiento plausible: polígono Las Monjas (Torrejón de Ardoz), junto a la A-2 y cerca de Barajas, junto a Edge-Este. Un solo PE. Este no tiene DC.",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.4.1",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 7750 SR (IP/MPLS) + Nokia 1830 PSS (WDM/OTN)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-011"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.4.1: un router por nodo; MET-CENTRO-B no está en la red de referencia"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 y §6.4.1"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "20 µs por salto (3.1 respuesta 27/10)"
    }
   }
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
   "nota": "Emplazamiento plausible: polígono Los Ángeles (Getafe), junto a DC-Sur y Edge-Sur. Un solo PE.",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.4.1",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Nokia 7750 SR (IP/MPLS) + Nokia 1830 PSS (WDM/OTN)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-011"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.4.1: un router por nodo; MET-CENTRO-B no está en la red de referencia"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 y §6.4.1"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "20 µs por salto (3.1 respuesta 27/10)"
    }
   }
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
   "capacidad_gbps": 400,
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
   "nota": "24 Dell R760xa (4 L40S). Capacidad = NIC de 2 UPF públicas × 200G = 400 Gbit/s instalados frente a 406,12 requeridos (cota conservadora; carga normal 71,07 % de esas NIC). Respaldo: Edge-Este (60 % del estadio, 100 % grabación y 30 % analítica de cámaras).",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.7.2, §6.7.5",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Dell R760xa (4 × L40S)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-010"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.7.2, §6.7.5"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.7.3 (respaldo entre Edges)"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §6.7.2 (24 / 7 / 3 servidores)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
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
   "capacidad_gbps": null,
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
   "nota": "7 Dell R760xa, dimensionado como receptor de Edge-Centro (NIC requerida 192,08 Gbit/s al recibirlo). La v7 no da la NIC instalada: el simulador no la limita.",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.7.2, §6.7.5",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Dell R760xa (4 × L40S)",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-010"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.7.3 (respaldo entre Edges)"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §6.7.2 (24 / 7 / 3 servidores)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
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
   "capacidad_gbps": null,
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
   "nota": "3 Dell R760 (hospital + red privada industria-sur). NIC requerida 2,18 Gbit/s. La v7 no da la NIC instalada: el simulador no la limita. Respaldo: Edge-Centro.",
   "origen": "entrega2",
   "fuente_e2": "v7 §6.7.2, §6.7.5",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "modelo": "Dell R760",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-010"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §6.7.3 (respaldo entre Edges)"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §6.7.2 (24 / 7 / 3 servidores)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "UPF 0,2 ms (3.1-S5 §4.3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
  },
  {
   "id": "AGG-TALAMANCA",
   "tipo": "agg",
   "nombre": "Agregación Talamanca de Jarama",
   "area": "NORTE",
   "coord": [
    40.7445,
    -3.51
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json. Municipio añadido en F2.0c (v7 §3.1.1 y §2.5: municipio pequeño de referencia de la zona NORTE, rural n28). La v7 no define nodos de agregación: el nodo y su coordenada (aproximada) son del simulador.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
  },
  {
   "id": "AGG-LOSSANTOS",
   "tipo": "agg",
   "nombre": "Agregación Los Santos de la Humosa",
   "area": "ESTE",
   "coord": [
    40.5,
    -3.256
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json. Municipio añadido en F2.0c (v7 §3.1.1 y §2.5: municipio pequeño de referencia de la zona ESTE, rural n28). La v7 no define nodos de agregación: el nodo y su coordenada (aproximada) son del simulador.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json. Alcorcón tiene dos centrales FTTH (A y B, 50/50) sin ubicación fijada (Semana 6/Teams (descargado 2026-11-02)/Diseno_FTTH_Alcorcon_Grupo_2_1_cerrado.docx §5); aquí se agregan en un nodo. Dos centrales no equivalen a protección 1+1.",
   "origen": "anterior",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
  },
  {
   "id": "AGG-BATRES",
   "tipo": "agg",
   "nombre": "Agregación Batres",
   "area": "SUR",
   "coord": [
    40.2095,
    -3.922
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
   "nota": "Nodo de agregación abstracto (central del casco urbano). Coordenada tomada del centro de la zona para coherencia con zonas.json. Municipio añadido en F2.0c (v7 §3.1.1 y §2.5: municipio pequeño de referencia de la zona SUR, rural n28). La v7 no define nodos de agregación: el nodo y su coordenada (aproximada) son del simulador.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "modelo": "Nokia Lightspan MF-14 (OLT XGS-PON/25G-PON) + agregación RAN",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "centro de la zona en zonas.json",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "v7",
     "f": "v7 §7.1.3 FAL-06: si cae el Metro la zona de acceso queda aislada"
    },
    "modelo": {
     "t": "v7",
     "f": "v7 §5.1 (FTTH)"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "acceso ≤20 km y 4 saltos (2.1-S5d §3)"
    }
   }
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
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios.",
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-012"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "anterior",
     "f": "punto externo único: la diversidad de peering no está diseñada (HW §4.1)"
    },
    "modelo": {
     "t": "anterior",
     "f": "externo, sin equipo propio: Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (salida a…"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "red_fisica.json"
    }
   }
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
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios.",
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-012"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "anterior",
     "f": "punto externo único: la diversidad de peering no está diseñada (HW §4.1)"
    },
    "modelo": {
     "t": "anterior",
     "f": "externo, sin equipo propio: Semana 7/G32_Semana5_Transporte_Completo_UPF2.docx Tabla 1 (interconexión 100 % IMS, sin CS); Semana 7/Teams…"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "red_fisica.json"
    }
   }
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
   "nota_transito": "Punto externo: no es camino de tránsito entre nodos propios.",
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-012"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "anterior",
     "f": "punto externo único: la diversidad de peering no está diseñada (HW §4.1)"
    },
    "modelo": {
     "t": "anterior",
     "f": "externo, sin equipo propio: Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (OneWeb, hub en Arganda…"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "red_fisica.json"
    }
   }
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
   "nota": "Sede Sur de la L2VPN (solo aparece como destino en servicios.json). Coordenadas aproximadas del campus; acceso 10 GbE a MET-SUR como las demás sedes.",
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": false,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": false,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
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
   "supuesto": true,
   "origen": "anterior",
   "proc": {
    "coord": {
     "t": "supuesto",
     "f": "coordenada elegida por el simulador",
     "s": "S-008"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "sin capacidad en los documentos: null = sin límite",
     "s": "S-006"
    },
    "respaldo": {
     "t": "supuesto",
     "f": "acceso único",
     "s": "S-017"
    },
    "modelo": {
     "t": "supuesto",
     "f": "extremo lógico del servicio",
     "s": "S-019"
    },
    "latencia_ms": {
     "t": "supuesto",
     "f": "valor por defecto del motor",
     "s": "S-015"
    }
   }
  }
 ],
 "enlaces": [
  {
   "id": "L-CORE1-METC",
   "a": "CORE-1",
   "b": "MET-CENTRO",
   "tipo": "mpls",
   "capacidad_gbps": 2400,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "C-DCC",
   "canales_400g": 6,
   "srlg": "SRLG-C-DCC",
   "fuente_e2": "v7 §6.4.1, §6.4.3, §6.4.4; A11.5",
   "origen": "entrega2",
   "nota": "Acometida Metro-Centro – DC-Centro, LAG 6×400G. Peor caso v7: 2.139 Gbit/s en pico P2 = 89,13 % (0,87 puntos hasta el 90 %). Bypass C–N–DCC. km sin medir (v7: la acometida cuenta como salto sin longitud).",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4; A11.5"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4; A11.5"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4; A11.5"
    }
   }
  },
  {
   "id": "L-CORE1-METN",
   "a": "CORE-1",
   "b": "MET-NORTE",
   "tipo": "mpls",
   "capacidad_gbps": 1600,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "N-DCC",
   "canales_400g": 4,
   "srlg": "SRLG-N-DCC",
   "fuente_e2": "v7 §6.4.3, §6.4.4; A11.5",
   "origen": "entrega2",
   "nota": "Acometida Metro-Norte – DC-Centro, LAG 4×400G. Peor caso v7: 1.222,66 Gbit/s (76,42 %) con caída de C–DC-Centro. Bypass N–C–DCC.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    }
   }
  },
  {
   "id": "L-CORE2-METN",
   "a": "CORE-2",
   "b": "MET-NORTE",
   "tipo": "mpls",
   "capacidad_gbps": 2400,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "N-DCN",
   "canales_400g": 6,
   "srlg": "SRLG-N-DCN",
   "fuente_e2": "v7 §6.4.3, §6.4.4; A11.5",
   "origen": "entrega2",
   "nota": "Acometida Metro-Norte – DC-Norte, LAG 6×400G. Peor caso v7: 1.859,38 Gbit/s en P2 (77,47 %). Bypass N–E–DCN.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.5"
    }
   }
  },
  {
   "id": "L-CORE2-METE",
   "a": "CORE-2",
   "b": "MET-ESTE",
   "tipo": "mpls",
   "capacidad_gbps": 1600,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "E-DCN",
   "canales_400g": 4,
   "srlg": "SRLG-E-DCN",
   "fuente_e2": "v7 §6.4.3, §6.4.4; A11.6",
   "origen": "entrega2",
   "nota": "Acometida Metro-Este – DC-Norte, LAG 4×400G. Peor caso v7: 1.222,66 Gbit/s (76,42 %) con caída de N–DC-Norte. Bypass E–N–DCN.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    }
   }
  },
  {
   "id": "L-CORE3-METS",
   "a": "CORE-3",
   "b": "MET-SUR",
   "tipo": "mpls",
   "capacidad_gbps": 1600,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "S-DCS",
   "canales_400g": 4,
   "srlg": "SRLG-S-DCS",
   "fuente_e2": "v7 §6.4.3, §6.4.4; A11.6",
   "origen": "entrega2",
   "nota": "Acometida Metro-Sur – DC-Sur, LAG 4×400G. Peor caso v7: 1.222,66 Gbit/s (76,42 %) con caída de C–DC-Sur. Bypass S–C–DCS.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    }
   }
  },
  {
   "id": "L-EDGECENTRO-METC",
   "a": "EDGE-CENTRO",
   "b": "MET-CENTRO",
   "tipo": "mpls",
   "capacidad_gbps": null,
   "km": 0.3,
   "proteccion": null,
   "fuente_e2": "v7 §6.7.2, §6.4.5 (escenario D)",
   "origen": "entrega2",
   "nota": "Acometida local única. Capacidad NO especificada en la v7: el simulador no la limita. Un corte deja el Edge activo pero inalcanzable (escenario D, activación del respaldo sin validar).",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.7.2, §6.4.5 (escenario D)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad no especificada en la v7: sin límite",
     "s": "S-006"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
  },
  {
   "id": "L-EDGEESTE-METE",
   "a": "EDGE-ESTE",
   "b": "MET-ESTE",
   "tipo": "mpls",
   "capacidad_gbps": null,
   "km": 0.3,
   "proteccion": null,
   "fuente_e2": "v7 §6.7.2, §6.4.5 (escenario D)",
   "origen": "entrega2",
   "nota": "Acometida local única. Capacidad NO especificada en la v7: el simulador no la limita.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.7.2, §6.4.5 (escenario D)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad no especificada en la v7: sin límite",
     "s": "S-006"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
  },
  {
   "id": "L-EDGESUR-METS",
   "a": "EDGE-SUR",
   "b": "MET-SUR",
   "tipo": "mpls",
   "capacidad_gbps": null,
   "km": 0.3,
   "proteccion": null,
   "fuente_e2": "v7 §6.7.2, §6.4.5 (escenario D)",
   "origen": "entrega2",
   "nota": "Acometida local única. Capacidad NO especificada en la v7: el simulador no la limita.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.7.2, §6.4.5 (escenario D)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad no especificada en la v7: sin límite",
     "s": "S-006"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 2433.5 Gbit/s. km = 1,3 x línea recta (estimado). Doble pertenencia a los dos PE de Metro-Centro (3.1 S5 F2: 'acceso y DC conectados a los dos'); cada enlace dimensionado para el total.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 87.4 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 38.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
  },
  {
   "id": "L-AGGTALAMANCA-METN",
   "a": "AGG-TALAMANCA",
   "b": "MET-NORTE",
   "tipo": "backhaul",
   "capacidad_gbps": 100,
   "km": 32.9,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 3.3 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada'). Municipio añadido en F2.0c (v7 §3.1.1); cuelga del nodo Metro de su zona (MET-NORTE, v7 §3.1.2: C/N/E/S). Supera los ≤20 km de fibra de S5d §3 (32.9 km estimados): pendiente de validar.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'."
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 99.5 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 139.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
  },
  {
   "id": "L-AGGLOSSANTOS-METE",
   "a": "AGG-LOSSANTOS",
   "b": "MET-ESTE",
   "tipo": "backhaul",
   "capacidad_gbps": 100,
   "km": 25.8,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 2.0 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada'). Municipio añadido en F2.0c (v7 §3.1.1); cuelga del nodo Metro de su zona (MET-ESTE, v7 §3.1.2: C/N/E/S). Supera los ≤20 km de fibra de S5d §3 (25.8 km estimados): pendiente de validar.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'."
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 132.5 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 132.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 128.5 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 119.7 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada').",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "n × 100GE por la demanda DL del municipio",
     "s": "S-003"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
  },
  {
   "id": "L-AGGBATRES-METS",
   "a": "AGG-BATRES",
   "b": "MET-SUR",
   "tipo": "backhaul",
   "capacidad_gbps": 100,
   "km": 28.7,
   "proteccion": null,
   "anillo": null,
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §3 (≤20 km de fibra hasta el nodo metro); demanda DL de Simulador red/datos/zonas.json; criterio de capacidad de Semana 6/Cierre 3.2 (2026-11-02)/G32_Cierre_3.2_capacidad_enlaces.docx H-E8",
   "supuesto": true,
   "nota": "Capacidad supuesta: n x 100GE con n = techo(max(DL·1,10/0,70; 2·DL·1,10/0,90)/100), DL = 1.3 Gbit/s. km = 1,3 x línea recta (estimado). Una sola conexión: el diseño no define acceso alternativo si cae el nodo metro o este enlace (UPF2 §5.4: 'la zona queda aislada'). Municipio añadido en F2.0c (v7 §3.1.1); cuelga del nodo Metro de su zona (MET-SUR, v7 §3.1.2: C/N/E/S). Supera los ≤20 km de fibra de S5d §3 (28.7 km estimados): pendiente de validar.",
   "origen": "entrega2",
   "fuente_e2": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'.",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §3.1.2: el municipio cuelga del Metro de su zona; extremo AGG abstracto",
     "s": "S-001"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §3.1.1 (tabla de los 12 municipios: población 2025, hogar medio, empresas; tabla de población por zona 2025/2030/2031) y §3.4.1 (demanda por zona Metro). §2.5: un municipio pequeño de referencia por zona (Talamanca de Jarama, Los Santos de la Humosa, Batres), escenario rural n28; 'cada municipio no se dimensiona por separado'."
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.7.2: acometida local única, sin SRLG asignado"
    }
   }
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
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "igual a las acometidas del DC",
     "s": "S-005"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "1 × 100GE",
     "s": "S-004"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "igual a las acometidas del DC",
     "s": "S-005"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "1 × 100GE",
     "s": "S-004"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad no dimensionada en ningún documento: se supone igual a la suma de las dos acometidas del DC (10 x 400G) para no ser cuello de botella. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §4.1 (routers de borde en los 3 DC); Semana 7/Teams…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "igual a las acometidas del DC",
     "s": "S-005"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Capacidad supuesta 1 x 100GE: interconexión = 60 % de los legs -> ~112 Gbit/s por sentido en total; si cae un DC, 1/2 por DC (~56) x 1,25 / 0,90 ≈ 78 Gbit/s. km = 1,3 x línea recta.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx §6 (13 instancias SBC por DC); Semana…"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "1 × 100GE",
     "s": "S-004"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "DC más cercano al hub de Arganda en este modelo: DC-Centro (≈22 km en línea recta frente a ≈23 km de DC-Sur). Capacidad supuesta 1 Gbit/s (5 terminales x ≥100 Mbit/s).",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (VRF del operador hasta el DC más cercano [HYP])"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "5 terminales × 100 Mbit/s",
     "s": "S-007"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "Terminal OneWeb del hospital de Getafe. Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "supuesto",
     "f": "terminal OneWeb en el AGG/Edge más próximo",
     "s": "S-016"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.11 (≥100 Mbit/s por terminal OneWeb)"
    },
    "km": {
     "t": "anterior",
     "f": "sin km: latencia fija = RTT medio 75 ms / 2 (D5 §5.7)"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "RTT OneWeb 50–100 ms → 75/2 (D5 §5.7)"
    }
   }
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
   "nota": "Terminal OneWeb del estadio (centro de control). Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "supuesto",
     "f": "terminal OneWeb en el AGG/Edge más próximo",
     "s": "S-016"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.11 (≥100 Mbit/s por terminal OneWeb)"
    },
    "km": {
     "t": "anterior",
     "f": "sin km: latencia fija = RTT medio 75 ms / 2 (D5 §5.7)"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "RTT OneWeb 50–100 ms → 75/2 (D5 §5.7)"
    }
   }
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
   "nota": "Terminal OneWeb del Edge-Este (centro de control de la A-2). Se activa solo si cae la red terrestre (≤60 s, despliegue ≤30 min). latencia = RTT medio 75 ms / 2. El extremo real es el sitio del servicio (SITE-* de servicios.json); aquí se cuelga de su nodo de agregación/Edge.",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "supuesto",
     "f": "terminal OneWeb en el AGG/Edge más próximo",
     "s": "S-016"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.11 (≥100 Mbit/s por terminal OneWeb)"
    },
    "km": {
     "t": "anterior",
     "f": "sin km: latencia fija = RTT medio 75 ms / 2 (D5 §5.7)"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    },
    "latencia_ms": {
     "t": "anterior",
     "f": "RTT OneWeb 50–100 ms → 75/2 (D5 §5.7)"
    }
   }
  },
  {
   "id": "L-ANILLO-CN",
   "a": "MET-CENTRO",
   "b": "MET-NORTE",
   "tipo": "wdm",
   "capacidad_gbps": 2400,
   "km": 20,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "C-N",
   "srlg": "SRLG-CN",
   "canales_400g": 6,
   "fuente_e2": "v7 §6.4.1, §6.4.3, §6.4.4 (LAG 6×400G); vano 20 km",
   "origen": "entrega2",
   "nota": "LAG 400GE de 6 λ (referencia provisional 6/4/4/6). Mínimo calculado 6. Peor caso v7: 1.894,72 Gbit/s (78,95 %) con caída de la acometida C–DC-Centro. Plan óptico: 2 enlaces × 7 λ por vano.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4 (LAG 6×400G); vano 20 km"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4 (LAG 6×400G); vano 20 km"
    },
    "km": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4 (LAG 6×400G); vano 20 km"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.1, §6.4.3, §6.4.4 (LAG 6×400G); vano 20 km"
    }
   }
  },
  {
   "id": "L-ANILLO-NE",
   "a": "MET-NORTE",
   "b": "MET-ESTE",
   "tipo": "wdm",
   "capacidad_gbps": 1600,
   "km": 28,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "N-E",
   "srlg": "SRLG-NE",
   "canales_400g": 4,
   "fuente_e2": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 28 km",
   "origen": "entrega2",
   "nota": "LAG 4×400G. Mínimo calculado 3. Peor caso v7: 992,27 Gbit/s (62,02 %) con corte C–N.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 28 km"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 28 km"
    },
    "km": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 28 km"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 28 km"
    }
   }
  },
  {
   "id": "L-ANILLO-ES",
   "a": "MET-ESTE",
   "b": "MET-SUR",
   "tipo": "wdm",
   "capacidad_gbps": 1600,
   "km": 38,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "E-S",
   "srlg": "SRLG-ES",
   "canales_400g": 4,
   "fuente_e2": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 38 km",
   "origen": "entrega2",
   "nota": "LAG 4×400G. Mínimo calculado 4. Peor caso v7: 1.111,93 Gbit/s (69,50 %) con Metro-Norte caído. P2 + corte C–N daría 2.174,45 (135,90 %), fuera de garantía (7.1.2).",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 38 km"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 38 km"
    },
    "km": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 38 km"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 4×400G); vano 38 km"
    }
   }
  },
  {
   "id": "L-ANILLO-SC",
   "a": "MET-SUR",
   "b": "MET-CENTRO",
   "tipo": "wdm",
   "capacidad_gbps": 2400,
   "km": 16,
   "proteccion": "anillo",
   "anillo": "ANILLO-METRO",
   "tramo": "S-C",
   "srlg": "SRLG-SC",
   "canales_400g": 6,
   "fuente_e2": "v7 §6.4.3, §6.4.4 (LAG 6×400G); vano 16 km",
   "origen": "entrega2",
   "nota": "LAG 6×400G. Mínimo calculado 3 (alternativa 6/3/4/3 en evaluación). Peor caso v7: 947,93 Gbit/s (39,50 %) con caída de la acometida C–DC-Sur.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 6×400G); vano 16 km"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 6×400G); vano 16 km"
    },
    "km": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 6×400G); vano 16 km"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4 (LAG 6×400G); vano 16 km"
    }
   }
  },
  {
   "id": "L-CORE3-METC",
   "a": "CORE-3",
   "b": "MET-CENTRO",
   "tipo": "mpls",
   "capacidad_gbps": 2400,
   "km": 0.3,
   "proteccion": "frr",
   "acometida": "C-DCS",
   "canales_400g": 6,
   "srlg": "SRLG-C-DCS",
   "fuente_e2": "v7 §6.4.3, §6.4.4; A11.6",
   "origen": "entrega2",
   "nota": "Acometida Metro-Centro – DC-Sur, LAG 6×400G. Peor caso v7: 1.859,38 Gbit/s en P2 (77,47 %). Bypass C–S–DCS. Es el camino del BNG de Centro si cae DC-Centro.",
   "doc_e2": "Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "proc": {
    "a/b": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "capacidad_gbps": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    },
    "km": {
     "t": "supuesto",
     "f": "acometida sin longitud en la v7",
     "s": "S-013"
    },
    "srlg": {
     "t": "v7",
     "f": "v7 §6.4.3, §6.4.4; A11.6"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.4 (tabla del 60 %, prioridad 1: 0 / 1,00 Gbit/s con +25 %) y §2 (5QI 71, ARP 5)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5, A8 (5 000 × 0,8 Mbit/s ×1,25 = 5,00 Gbit/s UL), Tabla 10; Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (1 000 vehículos × 300 B × 10 Hz ×1,5 = 0,036 → 0,045 Gbit/s con +25 %); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2 (tramo 34 km, 5,5 ms de ida); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2, §4.3 y §5.5",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8 (DL 100×4 = 0,400; UL 0,400 + 100×0,02 = 0,402 Gbit/s; ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §3 y §5 (5QI 2 y 82, ARP 1); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §4.3-4.4",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A9 (AGV 0,2 Mbit/s de control UL y 0,2 DL por AGV, ×10 ×1,25); Semana 7/Teams (descargado 2026-11-08)/Asignacion_S_NSSAI_DNN_4_slices_PNI_NPN_tipo_A_final_02-11 (1).docx §5; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §2 y §4.3 (AGV 3,5 ms)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona) y §8.3 (10 GbE por UNI como cota alta, 40 Gbit/s en total, TC2)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.7 (100 / 20 Mbit/s por terminal; 5 transportables: hospital, estadio, Edge-Este y 2 de reserva; terminal → satélite → hub de Arganda → VRF hasta el DC más cercano; conmutación 60 s); Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (OneWeb, hub en Arganda)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "supuesto",
     "f": "hub de Arganda al Metro más próximo",
     "s": "S-038"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "fuente": "Semana 7/Teams (descargado 2026-11-08)/2.1-S5d_Transporte_Metro_y_L2VPN def.pdf §8.1 (sedes, una por zona)",
   "origen": "anterior",
   "proc": {
    "a/b": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (≤20 km, 4 saltos; 2.1-S5d §2)"
    },
    "capacidad_gbps": {
     "t": "supuesto",
     "f": "capacidad_acceso_gbps del servicio",
     "s": "S-002"
    },
    "km": {
     "t": "supuesto",
     "f": "1,3 × línea recta",
     "s": "S-014"
    },
    "srlg": {
     "t": "supuesto",
     "f": "sin estudio de diversidad física",
     "s": "S-018"
    }
   }
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
   "nota": "El perfil de prensa (50 × 20 Mbit/s UL) es [HYP] de 3.1. Se separa del resto porque tiene ARP 5 y GBR: en respaldo entra al 100 %. capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP 5, 5QI 71)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "anterior"
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
   "nota": "Mezcla del G32 Semana 2 que usa 3.1; en respaldo (Edge-Este) entra al 100 %. Prioridad 4 > vídeo para que el recorte del 60 % caiga sobre el vídeo, como propone 3.1. capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 4 (ARP 9, 5QI 9)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "anterior"
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
   "nota": "En respaldo baja al 47 % DL / 54 % UL (720p) para que el estadio quede en el 60 % (98,81 / 53,25 Gbit/s, Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A7 control). capacidad_acceso_gbps 400 = una lambda 400G para el sitio (supuesto: ningún documento dimensiona la acometida del estadio; la NIC de Edge-Centro en normal pide 258,8 Gbit/s, 3.2 §6.2). conecta_a MET-CENTRO: el acceso de cada site llega a su nodo metro (≤20 km, 4 saltos, 2.1-S5d §2). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto prensa/ligero/vídeo de 3.1-S5 §5.4 del total v7 §3.3 (164,6875 / 88,75 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 5 (ARP 9, 5QI 9)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "anterior"
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
   "nota": "Valdebebas está en Hortaleza, zona Centro [I13] (3.2 Tabla 5). Coordenada: Parque Central de Valdebebas (aprox.). capacidad_acceso_gbps 10 = supuesto (5 Gbit/s UL ×1,10/0,70 = 7,9 Gbit/s; ~40 sitios n78, KPIs v5). Si cae Edge-Centro, Edge-Este recibe el 100 % de streams y grabación y analiza el 30 % (Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "v7",
     "f": "v7 §3.3 (cámaras 0 / 5,000; sensores 0 / 0,002142 Gbit/s)"
    },
    "ul_gbps": {
     "t": "v7",
     "f": "v7 §3.3 (cámaras 0 / 5,000; sensores 0 / 0,002142 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 4 (ARP 7, 5QI 72)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "entrega2"
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
   "nota": "Valdebebas está en Hortaleza, zona Centro [I13] (3.2 Tabla 5). Coordenada: Parque Central de Valdebebas (aprox.). capacidad_acceso_gbps 10 = supuesto (5 Gbit/s UL ×1,10/0,70 = 7,9 Gbit/s; ~40 sitios n78, KPIs v5). destino 'internet' = UPF central del DC (DNN iot-ciudad, sin MEC). En mMTC dimensiona el número de dispositivos, no los Gbit/s. Sin objetivo de latencia: la alarma pide 99,9 % en ≤10 s. DL despreciable (4 % del DL de n28, 3.1-S5 §3): 0.",
   "proc": {
    "dl_gbps": {
     "t": "v7",
     "f": "v7 §3.3 (cámaras 0 / 5,000; sensores 0 / 0,002142 Gbit/s)"
    },
    "ul_gbps": {
     "t": "v7",
     "f": "v7 §3.3 (cámaras 0 / 5,000; sensores 0 / 0,002142 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 5 (ARP 10, 5QI 9)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §3.3 (sensores en la UPF central)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "entrega2"
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
   "nota": "Un único flujo: los documentos solo definen avisos de seguridad (5QI 83, ARP 2); no hay infoentretenimiento en el diseño, así que no se inventa. Sitio = punto medio del corredor (Torrejón, km ~21) y 'trazado' = puntos aproximados de la A-2 (supuesto sobre mapa). zona Z-TORREJON por ser el tramo central (el corredor cruza Madrid, Coslada/San Fernando, Torrejón y Alcalá). capacidad_acceso 10 = supuesto. Respaldo en Edge-Centro: 5,8 ms de ida P95 (Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6). latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,045 / 0,045 Gbit/s)"
    },
    "ul_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,045 / 0,045 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 1 (ARP 2, 5QI 83)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "trazado": {
     "t": "supuesto",
     "f": "puntos aproximados de la A-2",
     "s": "S-040"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "entrega2"
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
   "nota": "H. U. de Getafe, Ctra. de Toledo km 12,5 (KPIs v5 §4); coordenada aproximada. Acceso: 3.1 supone dos accesos de fibra de 10 Gbit/s (SCOM01) por conductos distintos [HYP]; nadie diseña aún la segunda acometida (Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4). En respaldo (Edge-Centro) el PASS es 20 ms de ida y lo esperado 7,5 ms (7,9 con corte). Videoconsulta (5QI 2) y sensores (5QI 82) comparten slice, DNN, ARP y objetivo de 10 ms: un solo servicio. perfil 'empresa' (consultas en horario diurno): supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,500 / 0,6025 total; cámaras 0,100 UL)"
    },
    "ul_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,500 / 0,6025 total; cámaras 0,100 UL)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 1 (ARP 1, 5QI 2)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "entrega2"
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
   "nota": "H. U. de Getafe, Ctra. de Toledo km 12,5 (KPIs v5 §4); coordenada aproximada. Acceso: 3.1 supone dos accesos de fibra de 10 Gbit/s (SCOM01) por conductos distintos [HYP]; nadie diseña aún la segunda acometida (Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4). En respaldo (Edge-Centro) el PASS es 20 ms de ida y lo esperado 7,5 ms (7,9 con corte). Cámaras por la fibra del hospital (suposición más realista de 3.1): sin radio en el presupuesto, latencia_max = 10 - UPF 0,2 - app 3,0 - reserva 0,5 (supuesto; 5QI 72 tiene PDB de 300 ms).",
   "proc": {
    "dl_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,500 / 0,6025 total; cámaras 0,100 UL)"
    },
    "ul_gbps": {
     "t": "v7",
     "f": "v7 §3.3 y A8 (0,500 / 0,6025 total; cámaras 0,100 UL)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 1 (ARP 1, 5QI 72)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "supuesto",
     "f": "presupuesto sin radio",
     "s": "S-036"
    }
   },
   "origen": "entrega2"
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
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 2 (ARP 3, 5QI 82)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "anterior"
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
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. latencia_max_ms = presupuesto de TRANSPORTE (lo que mide el motor): 10 ms ida P95 (D-04) - radio - UPF 0,2 - aplicación - reserva 0,5, con los valores de 3.1-S5 §4.3. latencia_kpi_ms = KPI extremo a extremo.",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP 6, 5QI 71)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    },
    "latencia_max_ms": {
     "t": "calculado",
     "f": "10 ms ida P95 − radio − UPF 0,2 − aplicación − 0,5 (3.1-S5 §4.3; v7 §6.7.3)"
    }
   },
   "origen": "anterior"
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
   "nota": "Piloto de 330 equipos (100 personal, 200 sensores, 20 cámaras, 10 AGV), decisión del equipo pendiente de ratificar por Dirección. Emplazamiento NO definido en los documentos (solo 'empresas del Sur: Getafe, Leganés, Fuenlabrada...'): se sitúa en un polígono industrial de Getafe (Los Ángeles), supuesto. UPF privada en Edge-Sur, VRF propia y sin salida a Internet; respaldo con UPF privada en Edge-Centro (3,6 ms de ida P95). capacidad_acceso 10 = supuesto. Resto del piloto sin objetivo de latencia propio. Suma de los tres servicios = 0,0875 / 0,200 Gbit/s (3.2 Tabla 5).",
   "proc": {
    "dl_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "ul_gbps": {
     "t": "anterior",
     "f": "reparto AGV/cámaras/resto de 3.2 A9 del total v7 §3.3 (0,0875 / 0,200 Gbit/s)"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 4 (ARP 8, 5QI 9)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.7.3 (Edge primario y de respaldo de cada servicio)"
    },
    "respaldo_edge": {
     "t": "v7",
     "f": "v7 §6.7.3"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = NORTE→CENTRO, ul = CENTRO→NORTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = ESTE→CENTRO, ul = CENTRO→ESTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→CENTRO, ul = CENTRO→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = ESTE→NORTE, ul = NORTE→ESTE. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→NORTE, ul = NORTE→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "destino 'nodo' (extensión del esquema): tráfico sede a sede, se encamina hasta destino_nodo; dl = SUR→ESTE, ul = ESTE→SUR. Reparto de los 10 GbE de cada sede a partes iguales entre las otras 3 (3,33 Gbit/s por par y sentido; 6 pares × 2 sentidos = 40 Gbit/s) = supuesto sobre la cota alta de 2.1. Sedes de Norte y Centro pendientes de confirmar por Dirección. Sin slice 5G (servicio fijo IP/MPLS). Prioridad 3 por la clase TC2 garantizada de §8.3 (la tabla de clases de §6 la pone en TC3: discrepancia). Coordenadas aproximadas.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "10 GbE de cada sede a partes iguales entre las otras 3",
     "s": "S-035"
    },
    "cabecera": {
     "t": "supuesto",
     "f": "sin cabecera 1,10",
     "s": "S-034"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 3 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "v7",
     "f": "v7 §6.9 (EVPN E-LAN entre las 4 sedes)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "anterior",
     "f": "acceso del sitio a su nodo Metro (2.1-S5d §2)"
    }
   },
   "origen": "anterior"
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
   "nota": "Solo existe en incidentes: inactivo_por_defecto = true y factor 0 en todos los escenarios salvo los de NTN. Carga = 3 terminales desplegados × 100/20 Mbit/s. Lleva VoNR (5QI 1), mensajería, telemetría del hospital y gestión; 10 Mbit/s por terminal reservados a voz/control. RTT satélite 50–100 ms: fuera del presupuesto de 10 ms, sin latencia_max. Arganda del Rey no es una de las 9 zonas (zona null); conecta_a MET-ESTE por proximidad = supuesto (el documento dice 'DC más cercano'). Coordenada de Arganda aproximada.",
   "proc": {
    "dl_gbps": {
     "t": "supuesto",
     "f": "3 terminales × 100/20 Mbit/s",
     "s": "S-037"
    },
    "ul_gbps": {
     "t": "supuesto",
     "f": "3 terminales × 100/20 Mbit/s",
     "s": "S-037"
    },
    "prioridad": {
     "t": "supuesto",
     "f": "prioridad 2 (ARP None, 5QI None)",
     "s": "S-039"
    },
    "destino": {
     "t": "anterior",
     "f": "D5 §5.7 (VRF hasta el DC)"
    },
    "coord": {
     "t": "supuesto",
     "f": "posición aproximada del sitio",
     "s": "S-008"
    },
    "conecta_a": {
     "t": "supuesto",
     "f": "Metro más próximo",
     "s": "S-038"
    }
   },
   "origen": "anterior"
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.2 Tabla 6 (caso B: sin evento) y Tabla 1 (hora cargada)"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.2 Tabla 6 (caso A) y Tabla 8"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §4.3 Tabla 7"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "La hora (8) la marca el perfil 'movilidad'; los documentos no fijan la hora punta de la A-2.",
     "s": "S-050"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las claves tipo:* dependen de los tipos de necesidad del agente A (PLAN.md). Dirección aún no ha elegido entre P2 y PM.",
     "s": "S-048"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Clave tipo:movil-ebb según PLAN.md.",
     "s": "S-049"
    }
   }
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
   "fallos": [],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Factor 9,0 = 0,019 / 0,0021 Gbit/s (redondeado).",
     "s": "S-042"
    }
   }
  },
  {
   "id": "E-CORTE-CN",
   "nombre": "Corte de fibra en el tramo Metro-Centro – Metro-Norte",
   "hora": 21,
   "fallos": [
    "L-ANILLO-CN"
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
   ],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte C-N); Semana 7/Teams (descargado…"
    }
   }
  },
  {
   "id": "E-CORTE-NE",
   "nombre": "Corte de fibra en el tramo Metro-Norte – Metro-Este",
   "hora": 21,
   "fallos": [
    "L-ANILLO-NE"
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
   ],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte N-E); Semana 7/Teams (descargado…"
    }
   }
  },
  {
   "id": "E-CORTE-ES",
   "nombre": "Corte de fibra en el tramo Metro-Este – Metro-Sur",
   "hora": 21,
   "fallos": [
    "L-ANILLO-ES"
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
   ],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte E-S); Semana 7/Teams (descargado…"
    }
   }
  },
  {
   "id": "E-CORTE-SC",
   "nombre": "Corte de fibra en el tramo Metro-Sur – Metro-Centro (tramo más crítico)",
   "hora": 21,
   "fallos": [
    "L-ANILLO-SC"
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
   ],
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Corte S-C); Semana 7/Teams (descargado…"
    }
   }
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
   },
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11 (Cae Metro C); Semana 7/Teams (descargado…"
    }
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
  },
  {
   "id": "E-ACOMETIDA-C-CORE-3",
   "nombre": "Pérdida de la acometida Metro-Centro – DC-Sur",
   "hora": 21,
   "fallos": [
    "L-CORE3-METC"
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
   ],
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver…",
     "s": "S-041"
    }
   }
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
   },
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Hora 11 (y no la cargada de 21) para que hospital e industria (perfil empresa) estén en carga; supuesto.",
     "s": "S-044"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1, §6.1 y A7; Semana 7/Teams (descargado…"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Hora 8 (punta de la A-2) en lugar de la cargada; supuesto.",
     "s": "S-043"
    }
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
   "critico": true,
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DC); Semana 7/Teams (descargado…"
    }
   }
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
   },
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DN); Semana 7/Teams (descargado…"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "anterior",
     "f": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §2.2, §5.4 y A11 (Cae DS); Semana 7/Teams (descargado…"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "NTN al 0,33 = solo el terminal del estadio (1 de 3).",
     "s": "S-046"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Hora 11 para que el hospital esté en carga.",
     "s": "S-045"
    }
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
   },
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "El incidente concreto (caída de Metro-Sur) lo elige este fichero; los documentos hablan de 'caída de la red terrestre en una sede' o 'incidente grave'.",
     "s": "S-047"
    }
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
   "nota": "Escenario de comprobación añadido en la integración: sirve para contrastar el simulador con las tablas de dimensionado.",
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Escenario de comprobación añadido en la integración: sirve para contrastar el simulador con las tablas de dimensionado.",
     "s": "S-051"
    }
   }
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
   "nota": "Escenario de comparación añadido en la integración.",
   "proc": {
    "definicion": {
     "t": "supuesto",
     "f": "Escenario de comparación añadido en la integración.",
     "s": "S-052"
    }
   }
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
    "factores_tipo": {},
    "proc": {
     "definicion": {
      "t": "v7",
      "f": "v7 §2.7.2 (hora cargada, pico P2; PM como sensibilidad)"
     }
    }
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
    },
    "proc": {
     "definicion": {
      "t": "v7",
      "f": "v7 §2.7.2 (hora cargada, pico P2; PM como sensibilidad)"
     }
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
    },
    "proc": {
     "definicion": {
      "t": "v7",
      "f": "v7 §2.7.2 (hora cargada, pico P2; PM como sensibilidad)"
     }
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
    "factores_tipo": {},
    "proc": {
     "definicion": {
      "t": "supuesto",
      "f": "modelo del simulador",
      "s": "S-024"
     }
    }
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
    "pendular": true,
    "proc": {
     "definicion": {
      "t": "supuesto",
      "f": "modelo del simulador",
      "s": "S-025"
     }
    }
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
 },
 "supuestos": [
  {
   "id": "S-001",
   "clave": "top.agg_abstracto",
   "ambito": "topologia",
   "elementos": [
    "AGG-ALCALA",
    "AGG-ALCOBENDAS",
    "AGG-ALCORCON",
    "AGG-BATRES",
    "AGG-FUENLABRADA",
    "AGG-GETAFE",
    "AGG-LEGANES",
    "AGG-LOSSANTOS",
    "AGG-MADRID",
    "AGG-TALAMANCA",
    "AGG-TORREJON",
    "AGG-TRESCANTOS",
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGBATRES-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGLOSSANTOS-METE",
    "L-AGGMADRID-METC",
    "L-AGGTALAMANCA-METN",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN",
    "OLT",
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-BATRES",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-LOSSANTOS",
    "Z-MADRID",
    "Z-TALAMANCA",
    "Z-TORREJON",
    "Z-TRESCANTOS",
    "gNB"
   ],
   "campo": "nodo AGG-* y su coordenada",
   "valor": "un nodo de agregación por municipio, en el centro de la zona",
   "unidad": "",
   "motivo": "La v7 no define nodos de agregación: el simulador agrupa OLT y backhaul de cada municipio en un nodo abstracto.",
   "fuente_parcial": "v7 §3.1.2 (cada municipio cuelga del Metro de su zona); 2.1-S5d §3 (≤20 km y 4 saltos de acceso)",
   "alternativa": "Modelar las centrales reales (p. ej. las dos de Alcorcón) cuando 2.1 las fije.",
   "estado": "pendiente"
  },
  {
   "id": "S-002",
   "clave": "top.cap_acceso_sitio",
   "ambito": "topologia",
   "elementos": [
    "L-SITEA2V2X-METESTE",
    "L-SITEHOSPITALGETAFE-METSUR",
    "L-SITEINDUSTRIASUR-METSUR",
    "L-SITEL2VPNCENTRO-METCENTRO",
    "L-SITEL2VPNESTE-METESTE",
    "L-SITEL2VPNNORTE-METNORTE",
    "L-SITEL2VPNSUR-METSUR",
    "L-SITEMETROPOLITANO-METCENTRO",
    "L-SITENTNARGANDA-METESTE",
    "L-SITEVALDEBEBAS-METCENTRO"
   ],
   "campo": "capacidad_gbps",
   "valor": "400 (estadio) / 10 (resto) / 1 (NTN)",
   "unidad": "Gbit/s",
   "motivo": "Ningún documento dimensiona la acometida de los sitios de servicio: una λ 400G para el estadio, 10 GbE para el resto (hospital: 10 Gbit/s de SCOM01 [HYP 3.1]).",
   "fuente_parcial": "3.1-S5 §5.3 (hospital, dos accesos de 10 Gbit/s [HYP]); v7 §6.9 (10 GbE por UNI L2VPN)",
   "alternativa": "Acometida dimensionada por 2.1 para cada sitio.",
   "estado": "pendiente"
  },
  {
   "id": "S-003",
   "clave": "top.cap_agg_formula",
   "ambito": "topologia",
   "elementos": [
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGMADRID-METC",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN"
   ],
   "campo": "capacidad_gbps",
   "valor": "n × 100GE, n = ⌈max(DL·1,10/0,70; 2·DL·1,10/0,90)/100⌉",
   "unidad": "Gbit/s",
   "motivo": "Ningún documento dimensiona el enlace municipio–Metro; se aplica el criterio de ocupación común a la demanda DL del municipio.",
   "fuente_parcial": "v7 §2.7.2 (70 %/90 %, cabecera 1,10); 3.2 H-E8; 2.2 §4.5 (uplinks 100GE de la OLT)",
   "alternativa": "Dimensionar con la matriz de acceso de 2.1 cuando exista.",
   "estado": "pendiente"
  },
  {
   "id": "S-004",
   "clave": "top.cap_ix_ims",
   "ambito": "topologia",
   "elementos": [
    "L-CORE1-IXIMS",
    "L-CORE2-IXIMS",
    "L-CORE3-IXIMS"
   ],
   "campo": "capacidad_gbps",
   "valor": 100,
   "unidad": "Gbit/s",
   "motivo": "1 × 100GE por DC hacia la interconexión IMS (≈78 Gbit/s necesarios si cae un DC).",
   "fuente_parcial": "UPF2 §2.2 (medios IMS 186,95 Gbit/s); HW §6 (SBC por DC)",
   "alternativa": "2 × 100GE si se quiere margen N-1 al 70 %.",
   "estado": "pendiente"
  },
  {
   "id": "S-005",
   "clave": "top.cap_ix_internet",
   "ambito": "topologia",
   "elementos": [
    "L-CORE1-IXINTERNET",
    "L-CORE2-IXINTERNET",
    "L-CORE3-IXINTERNET"
   ],
   "campo": "capacidad_gbps",
   "valor": 4000,
   "unidad": "Gbit/s",
   "motivo": "Capacidad de salida a Internet no dimensionada: se iguala a la suma de las acometidas del DC para que no sea cuello de botella.",
   "fuente_parcial": "HW §4.1 (routers de borde en los 3 DC)",
   "alternativa": "Dimensionar peering/tránsito con la demanda Internet por DC.",
   "estado": "pendiente"
  },
  {
   "id": "S-006",
   "clave": "top.cap_null_sin_limite",
   "ambito": "topologia",
   "elementos": [
    "AGG-ALCALA",
    "AGG-ALCOBENDAS",
    "AGG-ALCORCON",
    "AGG-BATRES",
    "AGG-FUENLABRADA",
    "AGG-GETAFE",
    "AGG-LEGANES",
    "AGG-LOSSANTOS",
    "AGG-MADRID",
    "AGG-TALAMANCA",
    "AGG-TORREJON",
    "AGG-TRESCANTOS",
    "CORE-1",
    "CORE-2",
    "CORE-3",
    "EDGE-ESTE",
    "EDGE-SUR",
    "IX-IMS",
    "IX-INTERNET",
    "IX-ONEWEB",
    "L-EDGECENTRO-METC",
    "L-EDGEESTE-METE",
    "L-EDGESUR-METS",
    "MET-CENTRO",
    "MET-ESTE",
    "MET-NORTE",
    "MET-SUR",
    "SITE-A2-V2X",
    "SITE-HOSPITAL-GETAFE",
    "SITE-INDUSTRIA-SUR",
    "SITE-L2VPN-CENTRO",
    "SITE-L2VPN-ESTE",
    "SITE-L2VPN-NORTE",
    "SITE-L2VPN-SUR",
    "SITE-METROPOLITANO",
    "SITE-NTN-ARGANDA",
    "SITE-VALDEBEBAS"
   ],
   "campo": "capacidad_gbps",
   "valor": "null = sin límite",
   "unidad": "Gbit/s",
   "motivo": "La v7 no da capacidad de conmutación/proceso de estos nodos ni la NIC instalada de Edge-Este/Sur y las acometidas de Edge: el simulador no los limita.",
   "fuente_parcial": "v7 §6.7.2/§6.7.5 (NIC requeridas: Edge-Este 192,08, Edge-Sur 2,18 Gbit/s); v7 §6.10.1 (DC al 50 % de la carga)",
   "alternativa": "Poner la NIC requerida de la v7 como capacidad para ver su ocupación.",
   "estado": "pendiente"
  },
  {
   "id": "S-007",
   "clave": "top.cap_oneweb",
   "ambito": "topologia",
   "elementos": [
    "L-IXONEWEB-CORE1"
   ],
   "campo": "capacidad_gbps",
   "valor": 1,
   "unidad": "Gbit/s",
   "motivo": "Enlace hub OneWeb–DC-Centro: 5 terminales × ≥100 Mbit/s redondeado a 1 Gbit/s.",
   "fuente_parcial": "v7 §6.11 (≥100/20 Mbit/s por terminal); D5 §5.7",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-008",
   "clave": "top.coord_sitios",
   "ambito": "topologia",
   "elementos": [
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS",
    "S-NTN-EMERGENCIA",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS",
    "S-VALDEBEBAS-SENSORES",
    "SITE-A2-V2X",
    "SITE-HOSPITAL-GETAFE",
    "SITE-INDUSTRIA-SUR",
    "SITE-L2VPN-CENTRO",
    "SITE-L2VPN-ESTE",
    "SITE-L2VPN-NORTE",
    "SITE-L2VPN-SUR",
    "SITE-METROPOLITANO",
    "SITE-NTN-ARGANDA",
    "SITE-VALDEBEBAS"
   ],
   "campo": "coord",
   "valor": "posición aproximada de cada sitio de servicio (estadio, Valdebebas, A-2, hospital, polígono, sedes L2VPN, Arganda)",
   "unidad": "lat/lon",
   "motivo": "Los documentos nombran el lugar pero no dan coordenadas; las sedes L2VPN y el polígono industrial están por confirmar.",
   "fuente_parcial": "v7 §3.3 (servicios y lugares), §6.9 (una sede por zona)",
   "alternativa": "Coordenadas exactas cuando Dirección confirme sedes y polígono.",
   "estado": "pendiente"
  },
  {
   "id": "S-009",
   "clave": "top.emplazamiento_dc",
   "ambito": "topologia",
   "elementos": [
    "CORE-1",
    "CORE-2",
    "CORE-3"
   ],
   "campo": "coord",
   "valor": "polígonos con CPD en San Blas, Alcobendas y Getafe",
   "unidad": "lat/lon",
   "motivo": "Los documentos solo dicen que cada DC está junto a su nodo Metro; la parcela concreta la elige el simulador.",
   "fuente_parcial": "v7 §3.1.2 y §6.4.1 (DC en Centro, Norte y Sur, junto a su Metro)",
   "alternativa": "Otra parcela de la misma zona: solo cambian km y latencia de acceso.",
   "estado": "pendiente"
  },
  {
   "id": "S-010",
   "clave": "top.emplazamiento_edge",
   "ambito": "topologia",
   "elementos": [
    "EDGE-CENTRO",
    "EDGE-ESTE",
    "EDGE-SUR"
   ],
   "campo": "coord",
   "valor": "coordenada del nodo Metro de su zona",
   "unidad": "lat/lon",
   "motivo": "Edge 'junto a su nodo metro': se dibuja en el mismo punto.",
   "fuente_parcial": "v7 §6.7.2; 2.1-S5d §1",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-011",
   "clave": "top.emplazamiento_metro",
   "ambito": "topologia",
   "elementos": [
    "MET-CENTRO",
    "MET-ESTE",
    "MET-NORTE",
    "MET-SUR"
   ],
   "campo": "coord",
   "valor": "mismo polígono que el DC/Edge de la zona (Torrejón para Este)",
   "unidad": "lat/lon",
   "motivo": "La v7 fija los cuatro nodos Metro (C/N/E/S) pero no su edificio.",
   "fuente_parcial": "v7 §6.4.1",
   "alternativa": "Cualquier edificio de la zona con acceso a la planta del anillo.",
   "estado": "pendiente"
  },
  {
   "id": "S-012",
   "clave": "top.ix_ubicacion",
   "ambito": "topologia",
   "elementos": [
    "IX-IMS",
    "IX-INTERNET",
    "IX-ONEWEB"
   ],
   "campo": "coord",
   "valor": "carrier hotel de C/ Albasanz (Internet e IMS); polígono de Arganda (OneWeb)",
   "unidad": "lat/lon",
   "motivo": "Ningún documento fija el punto de peering ni el de interconexión IMS; del hub OneWeb solo se dice 'Arganda'.",
   "fuente_parcial": "HW §4.1 (salida por los routers de borde de los DC); v7 §6.11 (hub OneWeb en Arganda)",
   "alternativa": "Otro IXP de Madrid: cambia solo km de los enlaces IX.",
   "estado": "pendiente"
  },
  {
   "id": "S-013",
   "clave": "top.km_acometida",
   "ambito": "topologia",
   "elementos": [
    "L-AGGBATRES-METS",
    "L-AGGLOSSANTOS-METE",
    "L-AGGTALAMANCA-METN",
    "L-CORE1-METC",
    "L-CORE1-METN",
    "L-CORE2-METE",
    "L-CORE2-METN",
    "L-CORE3-METC",
    "L-CORE3-METS",
    "L-EDGECENTRO-METC",
    "L-EDGEESTE-METE",
    "L-EDGESUR-METS"
   ],
   "campo": "km",
   "valor": 0.3,
   "unidad": "km",
   "motivo": "La v7 cuenta la acometida DC/Edge–Metro como un salto sin longitud; 0,3 km es un relleno para la latencia.",
   "fuente_parcial": "v7 §6.4.1 (DC y Edge junto a su nodo Metro)",
   "alternativa": "0 km (mismo edificio).",
   "estado": "pendiente"
  },
  {
   "id": "S-014",
   "clave": "top.km_recta_x13",
   "ambito": "topologia",
   "elementos": [
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGMADRID-METC",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN",
    "L-CORE1-IXIMS",
    "L-CORE1-IXINTERNET",
    "L-CORE2-IXIMS",
    "L-CORE2-IXINTERNET",
    "L-CORE3-IXIMS",
    "L-CORE3-IXINTERNET",
    "L-IXONEWEB-CORE1",
    "L-SITEA2V2X-METESTE",
    "L-SITEHOSPITALGETAFE-METSUR",
    "L-SITEINDUSTRIASUR-METSUR",
    "L-SITEL2VPNCENTRO-METCENTRO",
    "L-SITEL2VPNESTE-METESTE",
    "L-SITEL2VPNNORTE-METNORTE",
    "L-SITEL2VPNSUR-METSUR",
    "L-SITEMETROPOLITANO-METCENTRO",
    "L-SITENTNARGANDA-METESTE",
    "L-SITEVALDEBEBAS-METCENTRO"
   ],
   "campo": "km",
   "valor": "1,3 × distancia en línea recta",
   "unidad": "km",
   "motivo": "Sin trazado de fibra en los documentos fuera del anillo: se estima la ruta como 1,3 × línea recta.",
   "fuente_parcial": "3.1 respuesta 27/10 (anillo sobre mapa × 1,4)",
   "alternativa": "Longitudes reales de planta cuando 2.1 las dé.",
   "estado": "pendiente"
  },
  {
   "id": "S-015",
   "clave": "top.lat_nodo_defecto",
   "ambito": "topologia",
   "elementos": [
    "SITE-A2-V2X",
    "SITE-HOSPITAL-GETAFE",
    "SITE-INDUSTRIA-SUR",
    "SITE-L2VPN-CENTRO",
    "SITE-L2VPN-ESTE",
    "SITE-L2VPN-NORTE",
    "SITE-L2VPN-SUR",
    "SITE-METROPOLITANO",
    "SITE-NTN-ARGANDA",
    "SITE-VALDEBEBAS"
   ],
   "campo": "latencia_ms",
   "valor": 0.05,
   "unidad": "ms",
   "motivo": "Los SITE-* no tienen retardo de nodo en los datos: el motor usa 0,05 ms por defecto.",
   "fuente_parcial": "—",
   "alternativa": "0 ms.",
   "estado": "pendiente"
  },
  {
   "id": "S-016",
   "clave": "top.sat_extremo",
   "ambito": "topologia",
   "elementos": [
    "L-SAT-AGGGETAFE",
    "L-SAT-AGGMADRID",
    "L-SAT-EDGEESTE"
   ],
   "campo": "a/b",
   "valor": "terminal OneWeb colgado del AGG o Edge más próximo al sitio",
   "unidad": "",
   "motivo": "El terminal está en el sitio (hospital, estadio, Edge-Este) pero se conecta al nodo de agregación/Edge para no duplicar sitios.",
   "fuente_parcial": "D5 §5.7 (terminales transportables en hospital, estadio y Edge-Este [HYP])",
   "alternativa": "Colgar el terminal directamente del SITE-*.",
   "estado": "pendiente"
  },
  {
   "id": "S-017",
   "clave": "top.sin_respaldo_acceso",
   "ambito": "topologia",
   "elementos": [
    "SITE-A2-V2X",
    "SITE-HOSPITAL-GETAFE",
    "SITE-INDUSTRIA-SUR",
    "SITE-L2VPN-CENTRO",
    "SITE-L2VPN-ESTE",
    "SITE-L2VPN-NORTE",
    "SITE-L2VPN-SUR",
    "SITE-METROPOLITANO",
    "SITE-NTN-ARGANDA",
    "SITE-VALDEBEBAS"
   ],
   "campo": "respaldo",
   "valor": "acceso único",
   "unidad": "",
   "motivo": "Los sitios de servicio tienen un solo acceso: la segunda acometida (p. ej. la del hospital) no está diseñada.",
   "fuente_parcial": "3.1-S5 §5.3 (dos accesos [HYP]); Reunión 03-11 punto 4",
   "alternativa": "Añadir el segundo acceso cuando esté diseñado.",
   "estado": "pendiente"
  },
  {
   "id": "S-018",
   "clave": "top.sin_srlg",
   "ambito": "topologia",
   "elementos": [
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGMADRID-METC",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN",
    "L-CORE1-IXIMS",
    "L-CORE1-IXINTERNET",
    "L-CORE2-IXIMS",
    "L-CORE2-IXINTERNET",
    "L-CORE3-IXIMS",
    "L-CORE3-IXINTERNET",
    "L-IXONEWEB-CORE1",
    "L-SAT-AGGGETAFE",
    "L-SAT-AGGMADRID",
    "L-SAT-EDGEESTE",
    "L-SITEA2V2X-METESTE",
    "L-SITEHOSPITALGETAFE-METSUR",
    "L-SITEINDUSTRIASUR-METSUR",
    "L-SITEL2VPNCENTRO-METCENTRO",
    "L-SITEL2VPNESTE-METESTE",
    "L-SITEL2VPNNORTE-METNORTE",
    "L-SITEL2VPNSUR-METSUR",
    "L-SITEMETROPOLITANO-METCENTRO",
    "L-SITENTNARGANDA-METESTE",
    "L-SITEVALDEBEBAS-METCENTRO"
   ],
   "campo": "srlg",
   "valor": "sin SRLG",
   "unidad": "",
   "motivo": "Fuera del anillo y las acometidas de DC no hay estudio de diversidad física: el simulador no agrupa cortes comunes.",
   "fuente_parcial": "v7 §5.1 (2.1 aún tiene que validar SRLG y diversidad física)",
   "alternativa": "Asignar SRLG cuando 2.1 entregue la planta.",
   "estado": "pendiente"
  },
  {
   "id": "S-019",
   "clave": "top.site_abstracto",
   "ambito": "topologia",
   "elementos": [
    "SITE-A2-V2X",
    "SITE-HOSPITAL-GETAFE",
    "SITE-INDUSTRIA-SUR",
    "SITE-L2VPN-CENTRO",
    "SITE-L2VPN-ESTE",
    "SITE-L2VPN-NORTE",
    "SITE-L2VPN-SUR",
    "SITE-METROPOLITANO",
    "SITE-NTN-ARGANDA",
    "SITE-VALDEBEBAS"
   ],
   "campo": "modelo",
   "valor": "sitio sin equipo modelado",
   "unidad": "",
   "motivo": "El sitio del servicio es un extremo lógico: su equipo (gNB, CPE, terminal) no se modela.",
   "fuente_parcial": "—",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-020",
   "clave": "dem.centro_municipio",
   "ambito": "demanda",
   "elementos": [
    "R-A2-n28-01",
    "R-A2-n28-02",
    "R-A2-n28-03",
    "R-A2-n28-04",
    "R-A2-n28-05",
    "R-A2-n28-06",
    "R-A2-n28-07",
    "R-A2-n28-08",
    "R-A2-n28-09",
    "R-A2-n28-10",
    "R-ALCORCON-CELDA-n28",
    "R-ALCORCON-CELDA-n78",
    "R-ESTADIO-n258",
    "R-ESTADIO-n78",
    "R-HOSPITAL-n78",
    "R-PRIVADA-n28",
    "R-PRIVADA-n78",
    "R-VALDEBEBAS-n28",
    "R-VALDEBEBAS-n78",
    "R-Z-ALCALA-n28",
    "R-Z-ALCALA-n78",
    "R-Z-ALCOBENDAS-n28",
    "R-Z-ALCOBENDAS-n78",
    "R-Z-ALCORCON-n28",
    "R-Z-ALCORCON-n78",
    "R-Z-BATRES-n28",
    "R-Z-BATRES-n78",
    "R-Z-FUENLABRADA-n28",
    "R-Z-FUENLABRADA-n78",
    "R-Z-GETAFE-n28",
    "R-Z-GETAFE-n78",
    "R-Z-LEGANES-n28",
    "R-Z-LEGANES-n78",
    "R-Z-LOSSANTOS-n28",
    "R-Z-LOSSANTOS-n78",
    "R-Z-MADRID-n28",
    "R-Z-MADRID-n78",
    "R-Z-TALAMANCA-n28",
    "R-Z-TALAMANCA-n78",
    "R-Z-TORREJON-n28",
    "R-Z-TORREJON-n78",
    "R-Z-TRESCANTOS-n28",
    "R-Z-TRESCANTOS-n78",
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-BATRES",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-LOSSANTOS",
    "Z-MADRID",
    "Z-TALAMANCA",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "centro",
   "valor": "casco urbano (aproximado en Talamanca, Los Santos y Batres)",
   "unidad": "lat/lon",
   "motivo": "Coordenada de dibujo del municipio elegida por el simulador.",
   "fuente_parcial": "v7 §3.1.1 (lista de municipios)",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-021",
   "clave": "dem.crecimiento_servicios",
   "ambito": "demanda",
   "elementos": [
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS",
    "S-NTN-EMERGENCIA",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS",
    "S-VALDEBEBAS-SENSORES"
   ],
   "campo": "crecimiento",
   "valor": "servicios especiales constantes 2025-2031",
   "unidad": "",
   "motivo": "El 3.2 proyecta población y volumen; los servicios especiales no tienen proyección y se dejan constantes.",
   "fuente_parcial": "3.2 (proyección lineal de población, geométrica de volumen)",
   "alternativa": "Escalar servicios con la población.",
   "estado": "pendiente"
  },
  {
   "id": "S-022",
   "clave": "dem.interpolacion_horaria",
   "ambito": "demanda",
   "elementos": [
    "empresa",
    "evento",
    "movil-mixto",
    "movil-oficinas",
    "movil-residencial",
    "movilidad",
    "pendular.presencia",
    "residencial"
   ],
   "campo": "perfil (entre horas enteras)",
   "valor": "interpolación lineal entre los valores horarios del perfil",
   "unidad": "",
   "motivo": "Los perfiles tienen 24 valores horarios; con paso de 15 o 5 min (serie temporal, CONTRATO_UI Revisión 4) el simulador interpola linealmente entre la hora entera anterior y la siguiente (23:xx hacia las 00:00).",
   "fuente_parcial": "—",
   "alternativa": "Escalón: mantener el valor de la hora entera durante toda la hora.",
   "estado": "pendiente"
  },
  {
   "id": "S-023",
   "clave": "dem.latencia_voz",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA/voz-fija",
    "Z-ALCALA/voz-ims",
    "Z-ALCOBENDAS/voz-fija",
    "Z-ALCOBENDAS/voz-ims",
    "Z-ALCORCON/voz-fija",
    "Z-ALCORCON/voz-ims",
    "Z-BATRES/voz-fija",
    "Z-BATRES/voz-ims",
    "Z-FUENLABRADA/voz-fija",
    "Z-FUENLABRADA/voz-ims",
    "Z-GETAFE/voz-fija",
    "Z-GETAFE/voz-ims",
    "Z-LEGANES/voz-fija",
    "Z-LEGANES/voz-ims",
    "Z-LOSSANTOS/voz-fija",
    "Z-LOSSANTOS/voz-ims",
    "Z-MADRID/voz-fija",
    "Z-MADRID/voz-ims",
    "Z-TALAMANCA/voz-fija",
    "Z-TALAMANCA/voz-ims",
    "Z-TORREJON/voz-fija",
    "Z-TORREJON/voz-ims",
    "Z-TRESCANTOS/voz-fija",
    "Z-TRESCANTOS/voz-ims"
   ],
   "campo": "latencia_max_ms",
   "valor": 20,
   "unidad": "ms",
   "motivo": "Presupuesto de transporte/core para la voz: los documentos no fijan latencia de voz.",
   "fuente_parcial": "—",
   "alternativa": "Sin límite de latencia para la voz.",
   "estado": "pendiente"
  },
  {
   "id": "S-024",
   "clave": "dem.modelo_nc",
   "ambito": "demanda",
   "elementos": [
    "NC"
   ],
   "campo": "modelo de tráfico",
   "valor": "NC",
   "unidad": "",
   "motivo": "Hora cargada no coincidente (sin fuente en los documentos).",
   "fuente_parcial": "v7 §2.7.2 (solo hora cargada coincidente y pico P2/PM)",
   "alternativa": "Modelos BH, P2 o PM.",
   "estado": "pendiente"
  },
  {
   "id": "S-025",
   "clave": "dem.modelo_pend",
   "ambito": "demanda",
   "elementos": [
    "PEND"
   ],
   "campo": "modelo de tráfico",
   "valor": "PEND",
   "unidad": "",
   "motivo": "Movilidad pendular (sin fuente en los documentos).",
   "fuente_parcial": "v7 §2.7.2 (solo hora cargada coincidente y pico P2/PM)",
   "alternativa": "Modelos BH, P2 o PM.",
   "estado": "pendiente"
  },
  {
   "id": "S-026",
   "clave": "dem.pendular",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "pendular",
   "valor": "fracción de usuarios móviles de cada zona que trabaja en Madrid",
   "unidad": "",
   "motivo": "Movilidad pendular inventada para el modelo PEND; ningún documento la cuantifica.",
   "fuente_parcial": "—",
   "alternativa": "Sin movilidad pendular.",
   "estado": "pendiente"
  },
  {
   "id": "S-027",
   "clave": "dem.perfiles_horarios",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA/empresa",
    "Z-ALCALA/movil-ebb",
    "Z-ALCALA/residencial-fijo",
    "Z-ALCALA/voz-fija",
    "Z-ALCALA/voz-ims",
    "Z-ALCOBENDAS/empresa",
    "Z-ALCOBENDAS/movil-ebb",
    "Z-ALCOBENDAS/residencial-fijo",
    "Z-ALCOBENDAS/voz-fija",
    "Z-ALCOBENDAS/voz-ims",
    "Z-ALCORCON/empresa",
    "Z-ALCORCON/movil-ebb",
    "Z-ALCORCON/residencial-fijo",
    "Z-ALCORCON/voz-fija",
    "Z-ALCORCON/voz-ims",
    "Z-BATRES/empresa",
    "Z-BATRES/movil-ebb",
    "Z-BATRES/residencial-fijo",
    "Z-BATRES/voz-fija",
    "Z-BATRES/voz-ims",
    "Z-FUENLABRADA/empresa",
    "Z-FUENLABRADA/movil-ebb",
    "Z-FUENLABRADA/residencial-fijo",
    "Z-FUENLABRADA/voz-fija",
    "Z-FUENLABRADA/voz-ims",
    "Z-GETAFE/empresa",
    "Z-GETAFE/movil-ebb",
    "Z-GETAFE/residencial-fijo",
    "Z-GETAFE/voz-fija",
    "Z-GETAFE/voz-ims",
    "Z-LEGANES/empresa",
    "Z-LEGANES/movil-ebb",
    "Z-LEGANES/residencial-fijo",
    "Z-LEGANES/voz-fija",
    "Z-LEGANES/voz-ims",
    "Z-LOSSANTOS/empresa",
    "Z-LOSSANTOS/movil-ebb",
    "Z-LOSSANTOS/residencial-fijo",
    "Z-LOSSANTOS/voz-fija",
    "Z-LOSSANTOS/voz-ims",
    "Z-MADRID/empresa",
    "Z-MADRID/movil-ebb",
    "Z-MADRID/residencial-fijo",
    "Z-MADRID/voz-fija",
    "Z-MADRID/voz-ims",
    "Z-TALAMANCA/empresa",
    "Z-TALAMANCA/movil-ebb",
    "Z-TALAMANCA/residencial-fijo",
    "Z-TALAMANCA/voz-fija",
    "Z-TALAMANCA/voz-ims",
    "Z-TORREJON/empresa",
    "Z-TORREJON/movil-ebb",
    "Z-TORREJON/residencial-fijo",
    "Z-TORREJON/voz-fija",
    "Z-TORREJON/voz-ims",
    "Z-TRESCANTOS/empresa",
    "Z-TRESCANTOS/movil-ebb",
    "Z-TRESCANTOS/residencial-fijo",
    "Z-TRESCANTOS/voz-fija",
    "Z-TRESCANTOS/voz-ims"
   ],
   "campo": "perfil",
   "valor": "perfiles residencial/empresa/evento/movilidad de 24 h",
   "unidad": "",
   "motivo": "Los documentos solo usan una hora cargada coincidente; la forma horaria es del simulador (iot sí está documentado).",
   "fuente_parcial": "v7 §2.7.2 y A4 (hora cargada)",
   "alternativa": "Hora cargada para todo (modelo BH).",
   "estado": "pendiente"
  },
  {
   "id": "S-028",
   "clave": "dem.prioridad_necesidad",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA/empresa",
    "Z-ALCALA/movil-ebb",
    "Z-ALCALA/residencial-fijo",
    "Z-ALCALA/voz-fija",
    "Z-ALCALA/voz-ims",
    "Z-ALCOBENDAS/empresa",
    "Z-ALCOBENDAS/movil-ebb",
    "Z-ALCOBENDAS/residencial-fijo",
    "Z-ALCOBENDAS/voz-fija",
    "Z-ALCOBENDAS/voz-ims",
    "Z-ALCORCON/empresa",
    "Z-ALCORCON/movil-ebb",
    "Z-ALCORCON/residencial-fijo",
    "Z-ALCORCON/voz-fija",
    "Z-ALCORCON/voz-ims",
    "Z-BATRES/empresa",
    "Z-BATRES/movil-ebb",
    "Z-BATRES/residencial-fijo",
    "Z-BATRES/voz-fija",
    "Z-BATRES/voz-ims",
    "Z-FUENLABRADA/empresa",
    "Z-FUENLABRADA/movil-ebb",
    "Z-FUENLABRADA/residencial-fijo",
    "Z-FUENLABRADA/voz-fija",
    "Z-FUENLABRADA/voz-ims",
    "Z-GETAFE/empresa",
    "Z-GETAFE/movil-ebb",
    "Z-GETAFE/residencial-fijo",
    "Z-GETAFE/voz-fija",
    "Z-GETAFE/voz-ims",
    "Z-LEGANES/empresa",
    "Z-LEGANES/movil-ebb",
    "Z-LEGANES/residencial-fijo",
    "Z-LEGANES/voz-fija",
    "Z-LEGANES/voz-ims",
    "Z-LOSSANTOS/empresa",
    "Z-LOSSANTOS/movil-ebb",
    "Z-LOSSANTOS/residencial-fijo",
    "Z-LOSSANTOS/voz-fija",
    "Z-LOSSANTOS/voz-ims",
    "Z-MADRID/empresa",
    "Z-MADRID/movil-ebb",
    "Z-MADRID/residencial-fijo",
    "Z-MADRID/voz-fija",
    "Z-MADRID/voz-ims",
    "Z-TALAMANCA/empresa",
    "Z-TALAMANCA/movil-ebb",
    "Z-TALAMANCA/residencial-fijo",
    "Z-TALAMANCA/voz-fija",
    "Z-TALAMANCA/voz-ims",
    "Z-TORREJON/empresa",
    "Z-TORREJON/movil-ebb",
    "Z-TORREJON/residencial-fijo",
    "Z-TORREJON/voz-fija",
    "Z-TORREJON/voz-ims",
    "Z-TRESCANTOS/empresa",
    "Z-TRESCANTOS/movil-ebb",
    "Z-TRESCANTOS/residencial-fijo",
    "Z-TRESCANTOS/voz-fija",
    "Z-TRESCANTOS/voz-ims"
   ],
   "campo": "prioridad",
   "valor": "residencial 5 · empresa 3 · móvil 4 · voz 2",
   "unidad": "1 = más alta",
   "motivo": "El motor necesita un orden para recortar en congestión; los documentos solo dan 5QI/ARP de los servicios avanzados.",
   "fuente_parcial": "v7 §4 (5QI 1 para voz, ARP)",
   "alternativa": "Misma prioridad para todo el tráfico territorial.",
   "estado": "pendiente"
  },
  {
   "id": "S-029",
   "clave": "dem.reparto_municipal",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA",
    "Z-ALCALA/empresa",
    "Z-ALCALA/movil-ebb",
    "Z-ALCALA/residencial-fijo",
    "Z-ALCALA/voz-fija",
    "Z-ALCALA/voz-ims",
    "Z-ALCOBENDAS",
    "Z-ALCOBENDAS/empresa",
    "Z-ALCOBENDAS/movil-ebb",
    "Z-ALCOBENDAS/residencial-fijo",
    "Z-ALCOBENDAS/voz-fija",
    "Z-ALCOBENDAS/voz-ims",
    "Z-ALCORCON",
    "Z-ALCORCON/empresa",
    "Z-ALCORCON/movil-ebb",
    "Z-ALCORCON/residencial-fijo",
    "Z-ALCORCON/voz-fija",
    "Z-ALCORCON/voz-ims",
    "Z-BATRES",
    "Z-BATRES/empresa",
    "Z-BATRES/movil-ebb",
    "Z-BATRES/residencial-fijo",
    "Z-BATRES/voz-fija",
    "Z-BATRES/voz-ims",
    "Z-FUENLABRADA",
    "Z-FUENLABRADA/empresa",
    "Z-FUENLABRADA/movil-ebb",
    "Z-FUENLABRADA/residencial-fijo",
    "Z-FUENLABRADA/voz-fija",
    "Z-FUENLABRADA/voz-ims",
    "Z-GETAFE",
    "Z-GETAFE/empresa",
    "Z-GETAFE/movil-ebb",
    "Z-GETAFE/residencial-fijo",
    "Z-GETAFE/voz-fija",
    "Z-GETAFE/voz-ims",
    "Z-LEGANES",
    "Z-LEGANES/empresa",
    "Z-LEGANES/movil-ebb",
    "Z-LEGANES/residencial-fijo",
    "Z-LEGANES/voz-fija",
    "Z-LEGANES/voz-ims",
    "Z-LOSSANTOS",
    "Z-LOSSANTOS/empresa",
    "Z-LOSSANTOS/movil-ebb",
    "Z-LOSSANTOS/residencial-fijo",
    "Z-LOSSANTOS/voz-fija",
    "Z-LOSSANTOS/voz-ims",
    "Z-MADRID",
    "Z-MADRID/empresa",
    "Z-MADRID/movil-ebb",
    "Z-MADRID/residencial-fijo",
    "Z-MADRID/voz-fija",
    "Z-MADRID/voz-ims",
    "Z-TALAMANCA",
    "Z-TALAMANCA/empresa",
    "Z-TALAMANCA/movil-ebb",
    "Z-TALAMANCA/residencial-fijo",
    "Z-TALAMANCA/voz-fija",
    "Z-TALAMANCA/voz-ims",
    "Z-TORREJON",
    "Z-TORREJON/empresa",
    "Z-TORREJON/movil-ebb",
    "Z-TORREJON/residencial-fijo",
    "Z-TORREJON/voz-fija",
    "Z-TORREJON/voz-ims",
    "Z-TRESCANTOS",
    "Z-TRESCANTOS/empresa",
    "Z-TRESCANTOS/movil-ebb",
    "Z-TRESCANTOS/residencial-fijo",
    "Z-TRESCANTOS/voz-fija",
    "Z-TRESCANTOS/voz-ims"
   ],
   "campo": "poblacion, cuota, demanda por municipio",
   "valor": "cuota del municipio = población 2025 / población 2025 de su zona Metro",
   "unidad": "",
   "motivo": "La v7 da población 2031 y demanda por zona Metro, no por municipio (salvo Alcorcón): el simulador reparte por la población 2025.",
   "fuente_parcial": "v7 §3.1.1 ('hogares, empresas y líneas proporcionales a la población de zona'), §3.4.1, §2.5",
   "alternativa": "Reparto por líneas reales de cada municipio si 3.2 las publica.",
   "estado": "pendiente"
  },
  {
   "id": "S-030",
   "clave": "dem.reparto_res_empresa",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA/empresa",
    "Z-ALCALA/residencial-fijo",
    "Z-ALCOBENDAS/empresa",
    "Z-ALCOBENDAS/residencial-fijo",
    "Z-ALCORCON/empresa",
    "Z-ALCORCON/residencial-fijo",
    "Z-BATRES/empresa",
    "Z-BATRES/residencial-fijo",
    "Z-FUENLABRADA/empresa",
    "Z-FUENLABRADA/residencial-fijo",
    "Z-GETAFE/empresa",
    "Z-GETAFE/residencial-fijo",
    "Z-LEGANES/empresa",
    "Z-LEGANES/residencial-fijo",
    "Z-LOSSANTOS/empresa",
    "Z-LOSSANTOS/residencial-fijo",
    "Z-MADRID/empresa",
    "Z-MADRID/residencial-fijo",
    "Z-TALAMANCA/empresa",
    "Z-TALAMANCA/residencial-fijo",
    "Z-TORREJON/empresa",
    "Z-TORREJON/residencial-fijo",
    "Z-TRESCANTOS/empresa",
    "Z-TRESCANTOS/residencial-fijo"
   ],
   "campo": "dl_gbps/ul_gbps (residencial-fijo, empresa)",
   "valor": "peso de líneas fijas 0,622·hogares vs 1,5·empresas",
   "unidad": "",
   "motivo": "Los documentos no separan el Internet fijo de empresa: se reparte con el peso de líneas fijas de A1.",
   "fuente_parcial": "v7 §3.1.1 (62,2 % de hogares con fijo; 1,5 líneas por empresa)",
   "alternativa": "Todo el fijo como residencial.",
   "estado": "pendiente"
  },
  {
   "id": "S-031",
   "clave": "dem.serie_hora_cargada",
   "ambito": "demanda",
   "elementos": [
    "BH",
    "P2",
    "PM"
   ],
   "campo": "serie de 24 h de un caso de hora cargada",
   "valor": "valor de hora cargada × perfil horario de cada demanda",
   "unidad": "",
   "motivo": "La v7 solo da la foto con todas las demandas en su hora cargada a la vez. La película de 24 h de los modelos BH/P2/PM es una extensión del simulador: cada demanda alcanza su valor v7 en el pico de su perfil horario, no todas a la vez, así que ningún paso reproduce la hora cargada coincidente.",
   "fuente_parcial": "v7 §2.7.2 y A4 (hora cargada)",
   "alternativa": "Sin película para los modelos de hora cargada (solo la foto v7).",
   "estado": "pendiente"
  },
  {
   "id": "S-032",
   "clave": "dem.tipos_dia",
   "ambito": "demanda",
   "elementos": [
    "agosto",
    "fin_de_semana",
    "laborable",
    "partido"
   ],
   "campo": "tipos_dia",
   "valor": "multiplicadores por tipo de día (estadio solo en día de partido)",
   "unidad": "",
   "motivo": "Variación por tipo de día: supuesto del simulador.",
   "fuente_parcial": "—",
   "alternativa": "Día laborable con estadio activo.",
   "estado": "pendiente"
  },
  {
   "id": "S-033",
   "clave": "dem.tipos_zona",
   "ambito": "demanda",
   "elementos": [
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-MADRID",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "tipos_zona, perfiles_extra",
   "valor": "tipo de zona (mixto/oficinas/residencial) y perfil móvil por tipo",
   "unidad": "",
   "motivo": "Perfil horario del móvil y la voz por tipo de zona: supuesto del simulador.",
   "fuente_parcial": "—",
   "alternativa": "Mismo perfil en todas las zonas.",
   "estado": "pendiente"
  },
  {
   "id": "S-034",
   "clave": "srv.cabecera_l2vpn",
   "ambito": "servicios",
   "elementos": [
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS"
   ],
   "campo": "cabecera",
   "valor": 1.0,
   "unidad": "×",
   "motivo": "L2VPN sin cabecera 1,10: la v7 aplica 1,10 a la matriz A11, que no incluye la L2VPN; la cota de 10 GbE ya es velocidad de línea.",
   "fuente_parcial": "v7 §2.7.2, §6.4.3, §6.9",
   "alternativa": "Aplicar 1,10 también a la L2VPN.",
   "estado": "pendiente"
  },
  {
   "id": "S-035",
   "clave": "srv.l2vpn_reparto",
   "ambito": "servicios",
   "elementos": [
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS"
   ],
   "campo": "dl_gbps/ul_gbps",
   "valor": 3.33,
   "unidad": "Gbit/s por par y sentido",
   "motivo": "Los 10 GbE de cada sede se reparten a partes iguales entre las otras 3 (6 pares × 2 sentidos = 40 Gbit/s).",
   "fuente_parcial": "v7 §6.9 (10 GbE por UNI como cota y 40 Gbit/s en total)",
   "alternativa": "Matriz de tráfico real entre sedes.",
   "estado": "pendiente"
  },
  {
   "id": "S-036",
   "clave": "srv.latencia_camaras_hospital",
   "ambito": "servicios",
   "elementos": [
    "S-HOSPITAL-CAMARAS"
   ],
   "campo": "latencia_max_ms",
   "valor": "10 − UPF 0,2 − app 3,0 − reserva 0,5",
   "unidad": "ms",
   "motivo": "Cámaras del hospital por fibra, sin radio en el presupuesto (5QI 72 tiene PDB de 300 ms).",
   "fuente_parcial": "3.1-S5 §4.3",
   "alternativa": "PDB del 5QI 72 (300 ms).",
   "estado": "pendiente"
  },
  {
   "id": "S-037",
   "clave": "srv.ntn_carga",
   "ambito": "servicios",
   "elementos": [
    "S-NTN-EMERGENCIA"
   ],
   "campo": "dl_gbps/ul_gbps",
   "valor": "3 terminales × 100/20 Mbit/s",
   "unidad": "Gbit/s",
   "motivo": "Número de terminales desplegados a la vez en un incidente: 3 de los 5.",
   "fuente_parcial": "v7 §6.11 (≥100/20 Mbit/s por terminal); D5 §5.7 (5 transportables)",
   "alternativa": "5 terminales.",
   "estado": "pendiente"
  },
  {
   "id": "S-038",
   "clave": "srv.ntn_conecta",
   "ambito": "servicios",
   "elementos": [
    "L-SITENTNARGANDA-METESTE",
    "S-NTN-EMERGENCIA"
   ],
   "campo": "conecta_a",
   "valor": "MET-ESTE",
   "unidad": "",
   "motivo": "El hub de Arganda entra por el Metro más próximo; el documento dice 'VRF hasta el DC más cercano'.",
   "fuente_parcial": "D5 §5.7",
   "alternativa": "Conectar a DC-Centro (L-IXONEWEB-CORE1).",
   "estado": "pendiente"
  },
  {
   "id": "S-039",
   "clave": "srv.prioridad_motor",
   "ambito": "servicios",
   "elementos": [
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS",
    "S-NTN-EMERGENCIA",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS",
    "S-VALDEBEBAS-SENSORES"
   ],
   "campo": "prioridad",
   "valor": "1–5 a partir de ARP/5QI/clase TC",
   "unidad": "1 = más alta",
   "motivo": "El motor ordena el recorte con una prioridad numérica; la correspondencia con ARP/5QI es del simulador.",
   "fuente_parcial": "v7 §4 (5QI/ARP por servicio); 2.1-S5d §8.3 (L2VPN TC2)",
   "alternativa": "Prioridad = ARP directamente.",
   "estado": "pendiente"
  },
  {
   "id": "S-040",
   "clave": "srv.v2x_trazado",
   "ambito": "servicios",
   "elementos": [
    "S-V2X-A2"
   ],
   "campo": "trazado",
   "valor": "puntos aproximados de la A-2 sobre mapa",
   "unidad": "lat/lon",
   "motivo": "La v7 da longitud y número de sitios del corredor, no su trazado.",
   "fuente_parcial": "v7 §6.2 (A-2, 34 km)",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-041",
   "clave": "esc.acometidas",
   "ambito": "escenarios",
   "elementos": [
    "E-ACOMETIDA-C-CORE-1",
    "E-ACOMETIDA-C-CORE-3",
    "E-ACOMETIDA-E-CORE-2",
    "E-ACOMETIDA-N-CORE-1",
    "E-ACOMETIDA-N-CORE-2",
    "E-ACOMETIDA-S-CORE-3"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-ACOMETIDA-C-CORE-1: hora 21, fallos L-CORE1-METC; E-ACOMETIDA-N-CORE-1: hora 21, fallos L-CORE1-METN; E-ACOMETIDA-N-CORE-2: hora 21, fallos L-CORE2-METN; E-ACOMETIDA-E-CORE-2: hora 21, fallos L-CORE2-METE; E-ACOMETIDA-S-CORE-3: hora 21, fallos L-CORE3-METS; E-ACOMETIDA-C-CORE-3: hora 21, fallos L-CORE3-METC",
   "unidad": "",
   "motivo": "Las seis acometidas son las del G32 Completo v08-11 (propuesta, diversidad física sin acreditar); 2.1-S5d y el 3.2-E final v08-11 proponen otras (ver meta.discrepancias).",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 y A11.2 (Pérdida C-DC)",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-042",
   "clave": "esc.alarma-valdebebas",
   "ambito": "escenarios",
   "elementos": [
    "E-ALARMA-VALDEBEBAS"
   ],
   "campo": "hora, factores",
   "valor": "E-ALARMA-VALDEBEBAS: hora 21",
   "unidad": "",
   "motivo": "Factor 9,0 = 0,019 / 0,0021 Gbit/s (redondeado).",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx A8 (alarma, Dirección 27/10); Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §6.1",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-043",
   "clave": "esc.caida-edge-este",
   "ambito": "escenarios",
   "elementos": [
    "E-CAIDA-EDGE-ESTE"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-CAIDA-EDGE-ESTE: hora 8, fallos EDGE-ESTE",
   "unidad": "",
   "motivo": "Hora 8 (punta de la A-2) en lugar de la cargada; supuesto.",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1; Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F7",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-044",
   "clave": "esc.caida-edge-sur",
   "ambito": "escenarios",
   "elementos": [
    "E-CAIDA-EDGE-SUR"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-CAIDA-EDGE-SUR: hora 11, fallos EDGE-SUR",
   "unidad": "",
   "motivo": "Hora 11 (y no la cargada de 21) para que hospital e industria (perfil empresa) estén en carga; supuesto.",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla R1 y §6.1; Semana 7/Teams (descargado 2026-11-08)/ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx §6; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F6",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-045",
   "clave": "esc.corte-acometida-hospital",
   "ambito": "escenarios",
   "elementos": [
    "E-CORTE-ACOMETIDA-HOSPITAL"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-CORTE-ACOMETIDA-HOSPITAL: hora 11, fallos L-SITEHOSPITALGETAFE-METSUR",
   "unidad": "",
   "motivo": "Hora 11 para que el hospital esté en carga.",
   "fuente_parcial": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.3 y §5.6 F14; Semana 7/Teams (descargado 2026-11-08)/Reunion_03-11_suposiciones_y_cambios_Diego.pdf punto 4; Semana 6/Teams (descargado 2026-11-02)/KPIs_Proyecto2_2026-10-27_v5.pdf §7",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-046",
   "clave": "esc.corte-estadio",
   "ambito": "escenarios",
   "elementos": [
    "E-CORTE-ESTADIO"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-CORTE-ESTADIO: hora 21, fallos L-SITEMETROPOLITANO-METCENTRO",
   "unidad": "",
   "motivo": "NTN al 0,33 = solo el terminal del estadio (1 de 3).",
   "fuente_parcial": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F13 y §5.7",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-047",
   "clave": "esc.incidente-ntn",
   "ambito": "escenarios",
   "elementos": [
    "E-INCIDENTE-NTN"
   ],
   "campo": "hora, factores, fallos",
   "valor": "E-INCIDENTE-NTN: hora 11, fallos MET-SUR+L-SITEHOSPITALGETAFE-METSUR",
   "unidad": "",
   "motivo": "El incidente concreto (caída de Metro-Sur) lo elige este fichero; los documentos hablan de 'caída de la red terrestre en una sede' o 'incidente grave'.",
   "fuente_parcial": "Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F15 y §5.7; Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf (satélite de emergencia)",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-048",
   "clave": "esc.pico-p2",
   "ambito": "escenarios",
   "elementos": [
    "E-PICO-P2"
   ],
   "campo": "hora, factores",
   "valor": "E-PICO-P2: hora 21",
   "unidad": "",
   "motivo": "Las claves tipo:* dependen de los tipos de necesidad del agente A (PLAN.md). Dirección aún no ha elegido entre P2 y PM.",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 (P2) y Tabla R2; Semana 7/Teams (descargado 2026-11-08)/3.1-S5_Diego_semana5_QoS_latencia_resiliencia.pdf §5.6 F10",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-049",
   "clave": "esc.pico-pm",
   "ambito": "escenarios",
   "elementos": [
    "E-PICO-PM"
   ],
   "campo": "hora, factores",
   "valor": "E-PICO-PM: hora 21",
   "unidad": "",
   "motivo": "Clave tipo:movil-ebb según PLAN.md.",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx §5.4 (PM)",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-050",
   "clave": "esc.punta-a2",
   "ambito": "escenarios",
   "elementos": [
    "E-PUNTA-A2"
   ],
   "campo": "hora, factores",
   "valor": "E-PUNTA-A2: hora 8",
   "unidad": "",
   "motivo": "La hora (8) la marca el perfil 'movilidad'; los documentos no fijan la hora punta de la A-2.",
   "fuente_parcial": "Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx Tabla 5 y A8; Semana 6/Teams (descargado 2026-11-02)/Servicios_5Play_y_avanzados_2026-10-27.pdf ficha 2",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-051",
   "clave": "esc.tabla8",
   "ambito": "escenarios",
   "elementos": [
    "E-TABLA8"
   ],
   "campo": "hora",
   "valor": "E-TABLA8: hora 21",
   "unidad": "",
   "motivo": "Escenario de comprobación añadido en la integración: sirve para contrastar el simulador con las tablas de dimensionado.",
   "fuente_parcial": "",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-052",
   "clave": "esc.tabla8-cercano",
   "ambito": "escenarios",
   "elementos": [
    "E-TABLA8-CERCANO"
   ],
   "campo": "hora",
   "valor": "E-TABLA8-CERCANO: hora 21",
   "unidad": "",
   "motivo": "Escenario de comparación añadido en la integración.",
   "fuente_parcial": "",
   "alternativa": "Ajustar al caso que fije Dirección.",
   "estado": "pendiente"
  },
  {
   "id": "S-053",
   "clave": "mot.clasificacion_servicio",
   "ambito": "motor",
   "elementos": [
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS",
    "S-NTN-EMERGENCIA",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS",
    "S-VALDEBEBAS-SENSORES",
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-BATRES",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-LOSSANTOS",
    "Z-MADRID",
    "Z-TALAMANCA",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "clase_servicio",
   "valor": "8 clases (movil, ftth, voz, urllc, iot, empresa, evento, ntn)",
   "unidad": "",
   "motivo": "Reglas para agrupar demandas por clase de servicio en la vista y en por_servicio.",
   "fuente_parcial": "CONTRATO_UI Revisión 2 §4",
   "alternativa": "Clase explícita en los datos.",
   "estado": "pendiente"
  },
  {
   "id": "S-054",
   "clave": "mot.edge_sin_respaldo",
   "ambito": "motor",
   "elementos": [
    "EDGE-CENTRO",
    "EDGE-ESTE",
    "EDGE-SUR",
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS"
   ],
   "campo": "destino (Edge y su respaldo caídos, o zona sin Edge)",
   "valor": "DC más cercano al 100 %",
   "unidad": "",
   "motivo": "La v7 supone la pérdida de un solo Edge: si cae también el de respaldo (o la zona no tiene Edge) el servicio va al DC más cercano.",
   "fuente_parcial": "v7 §6.7.3 (hipótesis N−1; el DC no reserva cómputo MEC)",
   "alternativa": "Dejar el servicio sin ruta.",
   "estado": "pendiente"
  },
  {
   "id": "S-055",
   "clave": "mot.frr_n2",
   "ambito": "motor",
   "elementos": [
    "L-ANILLO-CN",
    "L-ANILLO-ES",
    "L-ANILLO-NE",
    "L-ANILLO-SC"
   ],
   "campo": "rutas (dos cortes)",
   "valor": "reoptimización por mínimos saltos",
   "unidad": "",
   "motivo": "Si el arco FRR opuesto tampoco existe (N-2) el motor reoptimiza; la v7 solo trata N-1.",
   "fuente_parcial": "v7 §6.4.4 (FRR facility backup), §7.1.2 ('N−2 is not declared')",
   "alternativa": "Dejar sin ruta lo que el FRR no protege.",
   "estado": "pendiente"
  },
  {
   "id": "S-056",
   "clave": "mot.respaldo_camaras",
   "ambito": "motor",
   "elementos": [
    "EDGE-CENTRO",
    "S-VALDEBEBAS-CAMARAS"
   ],
   "campo": "respaldo_mec (cámaras)",
   "valor": "100 % de los flujos transportados",
   "unidad": "",
   "motivo": "En respaldo se transporta el 100 % de flujos y grabación; el 30 % de analítica se interpreta como cómputo en el Edge, no como transporte.",
   "fuente_parcial": "v7 §6.7.3 y FAL-03 (100 % de streams y grabación; 30 % de analítica)",
   "alternativa": "Transportar solo el 30 %.",
   "estado": "pendiente"
  },
  {
   "id": "S-057",
   "clave": "mot.rutas_dijkstra",
   "ambito": "motor",
   "elementos": [
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGBATRES-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGLOSSANTOS-METE",
    "L-AGGMADRID-METC",
    "L-AGGTALAMANCA-METN",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN",
    "L-ANILLO-CN",
    "L-ANILLO-ES",
    "L-ANILLO-NE",
    "L-ANILLO-SC",
    "L-CORE1-IXIMS",
    "L-CORE1-IXINTERNET",
    "L-CORE1-METC",
    "L-CORE1-METN",
    "L-CORE2-IXIMS",
    "L-CORE2-IXINTERNET",
    "L-CORE2-METE",
    "L-CORE2-METN",
    "L-CORE3-IXIMS",
    "L-CORE3-IXINTERNET",
    "L-CORE3-METC",
    "L-CORE3-METS",
    "L-EDGECENTRO-METC",
    "L-EDGEESTE-METE",
    "L-EDGESUR-METS",
    "L-IXONEWEB-CORE1",
    "L-SAT-AGGGETAFE",
    "L-SAT-AGGMADRID",
    "L-SAT-EDGEESTE",
    "L-SITEA2V2X-METESTE",
    "L-SITEHOSPITALGETAFE-METSUR",
    "L-SITEINDUSTRIASUR-METSUR",
    "L-SITEL2VPNCENTRO-METCENTRO",
    "L-SITEL2VPNESTE-METESTE",
    "L-SITEL2VPNNORTE-METNORTE",
    "L-SITEL2VPNSUR-METSUR",
    "L-SITEMETROPOLITANO-METCENTRO",
    "L-SITENTNARGANDA-METESTE",
    "L-SITEVALDEBEBAS-METCENTRO"
   ],
   "campo": "rutas",
   "valor": "latencia mínima, un camino (modo LAB 'dijkstra')",
   "unidad": "",
   "motivo": "Alternativa a las reglas v7 de mínimo de saltos con reparto; no está en los documentos.",
   "fuente_parcial": "—",
   "alternativa": "Reglas v7 (modo por defecto).",
   "estado": "pendiente"
  },
  {
   "id": "S-058",
   "clave": "mot.umbral_degradado",
   "ambito": "motor",
   "elementos": [
    "S-ESTADIO-LIGERO",
    "S-ESTADIO-PRENSA",
    "S-ESTADIO-VIDEO",
    "S-HOSPITAL-CAMARAS",
    "S-HOSPITAL-CRITICO",
    "S-INDUSTRIA-AGV",
    "S-INDUSTRIA-CAMARAS",
    "S-INDUSTRIA-GENERAL",
    "S-L2VPN-CE",
    "S-L2VPN-CN",
    "S-L2VPN-CS",
    "S-L2VPN-ES",
    "S-L2VPN-NE",
    "S-L2VPN-NS",
    "S-NTN-EMERGENCIA",
    "S-V2X-A2",
    "S-VALDEBEBAS-CAMARAS",
    "S-VALDEBEBAS-SENSORES",
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-ALCORCON",
    "Z-BATRES",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-LOSSANTOS",
    "Z-MADRID",
    "Z-TALAMANCA",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "estado",
   "valor": "degradado si servida < 99 % o ruta para < 99 %",
   "unidad": "",
   "motivo": "Umbral del simulador para marcar una demanda como degradada.",
   "fuente_parcial": "—",
   "alternativa": "Cualquier recorte > 0.",
   "estado": "pendiente"
  },
  {
   "id": "S-059",
   "clave": "mot.voraz_prioridad",
   "ambito": "motor",
   "elementos": [
    "L-AGGALCALA-METE",
    "L-AGGALCOBENDAS-METN",
    "L-AGGALCORCON-METS",
    "L-AGGBATRES-METS",
    "L-AGGFUENLABRADA-METS",
    "L-AGGGETAFE-METS",
    "L-AGGLEGANES-METS",
    "L-AGGLOSSANTOS-METE",
    "L-AGGMADRID-METC",
    "L-AGGTALAMANCA-METN",
    "L-AGGTORREJON-METE",
    "L-AGGTRESCANTOS-METN",
    "L-ANILLO-CN",
    "L-ANILLO-ES",
    "L-ANILLO-NE",
    "L-ANILLO-SC",
    "L-CORE1-IXIMS",
    "L-CORE1-IXINTERNET",
    "L-CORE1-METC",
    "L-CORE1-METN",
    "L-CORE2-IXIMS",
    "L-CORE2-IXINTERNET",
    "L-CORE2-METE",
    "L-CORE2-METN",
    "L-CORE3-IXIMS",
    "L-CORE3-IXINTERNET",
    "L-CORE3-METC",
    "L-CORE3-METS",
    "L-IXONEWEB-CORE1",
    "L-SAT-AGGGETAFE",
    "L-SAT-AGGMADRID",
    "L-SAT-EDGEESTE",
    "L-SITEA2V2X-METESTE",
    "L-SITEHOSPITALGETAFE-METSUR",
    "L-SITEINDUSTRIASUR-METSUR",
    "L-SITEL2VPNCENTRO-METCENTRO",
    "L-SITEL2VPNESTE-METESTE",
    "L-SITEL2VPNNORTE-METNORTE",
    "L-SITEL2VPNSUR-METSUR",
    "L-SITEMETROPOLITANO-METCENTRO",
    "L-SITENTNARGANDA-METESTE",
    "L-SITEVALDEBEBAS-METCENTRO"
   ],
   "campo": "servida_gbps",
   "valor": "asignación voraz por prioridad (empate: menor demanda)",
   "unidad": "",
   "motivo": "Cuando un enlace no da para todo, se sirve antes la prioridad más alta; la v7 no describe el recorte.",
   "fuente_parcial": "v7 §4 (ARP 1-3 pueden expropiar)",
   "alternativa": "Recorte proporcional.",
   "estado": "pendiente"
  },
  {
   "id": "S-060",
   "clave": "rad.a2_posiciones",
   "ambito": "radio",
   "elementos": [
    "R-A2-n28-01",
    "R-A2-n28-02",
    "R-A2-n28-03",
    "R-A2-n28-04",
    "R-A2-n28-05",
    "R-A2-n28-06",
    "R-A2-n28-07",
    "R-A2-n28-08",
    "R-A2-n28-09",
    "R-A2-n28-10"
   ],
   "campo": "centro",
   "valor": "10 sitios equidistantes sobre el trazado del simulador",
   "unidad": "",
   "motivo": "La v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "fuente_parcial": "v7 §6.2 (A-2)",
   "alternativa": "Posiciones reales de los emplazamientos.",
   "estado": "pendiente"
  },
  {
   "id": "S-061",
   "clave": "rad.alcorcon_circulo",
   "ambito": "radio",
   "elementos": [
    "R-Z-ALCORCON-n28",
    "R-Z-ALCORCON-n78"
   ],
   "campo": "radio_m",
   "valor": "círculo de igual área que ≈12 km²",
   "unidad": "m",
   "motivo": "Forma y centro del área de Alcorcón los pone el simulador.",
   "fuente_parcial": "v7 §6.2.7 (≈12 km² poblados [HYP])",
   "alternativa": "Polígono urbano real.",
   "estado": "pendiente"
  },
  {
   "id": "S-062",
   "clave": "rad.atajo_municipal",
   "ambito": "radio",
   "elementos": [
    "Z-ALCALA",
    "Z-ALCOBENDAS",
    "Z-FUENLABRADA",
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-TORREJON",
    "Z-TRESCANTOS"
   ],
   "campo": "sitios",
   "valor": "población 2031 / 4 600 por municipio",
   "unidad": "sitios",
   "motivo": "La v7 da sectores por zona Metro; aplicar el atajo urbano a cada municipio es del simulador.",
   "fuente_parcial": "v7 §6.2.7, A4–A5",
   "alternativa": "Solo el total por zona.",
   "estado": "pendiente"
  },
  {
   "id": "S-063",
   "clave": "rad.celda_escala",
   "ambito": "radio",
   "elementos": [
    "R-ALCORCON-CELDA-n28",
    "R-ALCORCON-CELDA-n78",
    "R-VALDEBEBAS-n78"
   ],
   "campo": "radio_m",
   "valor": "una celda dibujada en el centro para dar la escala",
   "unidad": "m",
   "motivo": "Las posiciones de los sitios (39 en Alcorcón, ≈40 en Valdebebas) no están en la v7.",
   "fuente_parcial": "v7 §6.2.7, §6.3",
   "alternativa": "Dibujar todos los sitios cuando haya posiciones.",
   "estado": "pendiente"
  },
  {
   "id": "S-064",
   "clave": "rad.circulo_zona",
   "ambito": "radio",
   "elementos": [
    "R-Z-ALCALA-n28",
    "R-Z-ALCALA-n78",
    "R-Z-ALCOBENDAS-n28",
    "R-Z-ALCOBENDAS-n78",
    "R-Z-FUENLABRADA-n28",
    "R-Z-FUENLABRADA-n78",
    "R-Z-GETAFE-n28",
    "R-Z-GETAFE-n78",
    "R-Z-LEGANES-n28",
    "R-Z-LEGANES-n78",
    "R-Z-MADRID-n28",
    "R-Z-MADRID-n78",
    "R-Z-TORREJON-n28",
    "R-Z-TORREJON-n78",
    "R-Z-TRESCANTOS-n28",
    "R-Z-TRESCANTOS-n78"
   ],
   "campo": "radio_m",
   "valor": "√población × 2,6 m",
   "unidad": "m",
   "motivo": "Área de dibujo de la zona, no cobertura calculada: la v7 no da el contorno desplegado.",
   "fuente_parcial": "v7 §6.2.7 (sectores por zona)",
   "alternativa": "Contorno municipal real.",
   "estado": "pendiente"
  },
  {
   "id": "S-065",
   "clave": "rad.estadio_n258",
   "ambito": "radio",
   "elementos": [
    "R-ESTADIO-n258"
   ],
   "campo": "radio_m",
   "valor": "≈37 m a ±45°, dibujado una vez",
   "unidad": "m",
   "motivo": "Geometría de haces y número físico de small cells n258 sin especificar.",
   "fuente_parcial": "v7 §6.3 (cota de planificación)",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-066",
   "clave": "rad.privada_n28",
   "ambito": "radio",
   "elementos": [
    "R-PRIVADA-n28"
   ],
   "campo": "radio_m",
   "valor": 600,
   "unidad": "m",
   "motivo": "Círculo de la distancia máxima al macro n28 centrado en la nave; la posición del macro no está en la v7.",
   "fuente_parcial": "v7 §6.3.5",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-067",
   "clave": "rad.privada_nave",
   "ambito": "radio",
   "elementos": [
    "R-PRIVADA-n78"
   ],
   "campo": "forma",
   "valor": "nave de 200 × 100 m orientada este-oeste",
   "unidad": "m",
   "motivo": "Nave tipo de la v7 dibujada en el emplazamiento del servicio.",
   "fuente_parcial": "v7 §6.3.5 (nave tipo [HYP])",
   "alternativa": "Plano real de la nave.",
   "estado": "pendiente"
  },
  {
   "id": "S-068",
   "clave": "rad.rural_tipo_batres",
   "ambito": "radio",
   "elementos": [
    "R-Z-LOSSANTOS-n28",
    "R-Z-LOSSANTOS-n78",
    "R-Z-TALAMANCA-n28",
    "R-Z-TALAMANCA-n78"
   ],
   "campo": "radio_m",
   "valor": "caso rural tipo de Batres",
   "unidad": "m",
   "motivo": "Se aplica el caso rural de Batres a Talamanca y Los Santos: la v7 no los calcula por separado.",
   "fuente_parcial": "v7 §2.5, §6.2.5",
   "alternativa": "Cálculo propio de cada municipio.",
   "estado": "pendiente"
  },
  {
   "id": "S-069",
   "clave": "rad.valdebebas_n28",
   "ambito": "radio",
   "elementos": [
    "R-VALDEBEBAS-n28"
   ],
   "campo": "radio_m",
   "valor": "radio de planificación en el emplazamiento del servicio",
   "unidad": "m",
   "motivo": "Polígono real y sitios de Valdebebas sin especificar.",
   "fuente_parcial": "v7 §6.3",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-070",
   "clave": "arq.flujo_inferido",
   "ambito": "arquitectura",
   "elementos": [
    "ims-otro-operador"
   ],
   "campo": "flujo",
   "valor": "secuencia de saltos deducida",
   "unidad": "",
   "motivo": "Recorrido de un flujo que los documentos no dibujan salto a salto.",
   "fuente_parcial": "v7 §4.4",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-071",
   "clave": "arq.hueco",
   "ambito": "arquitectura",
   "elementos": [
    "HSS-IMS",
    "HUECO-C",
    "HUECO-SYNC",
    "ONT-HGW",
    "RAD-BBU",
    "ROUTER-BORDE",
    "SEG-PERIMETRO",
    "UDM"
   ],
   "campo": "elemento/equipo",
   "valor": "se muestra como hueco",
   "unidad": "",
   "motivo": "Elemento que la arquitectura necesita y la v7 nombra sin diseñarlo (sin modelo, cantidad o ubicación).",
   "fuente_parcial": "v7 §5, §7.1.1",
   "alternativa": "Completar con 2.2.",
   "estado": "pendiente"
  },
  {
   "id": "S-072",
   "clave": "arq.interfaz_inferida",
   "ambito": "arquitectura",
   "elementos": [
    "N11",
    "N2",
    "N3",
    "N4",
    "Npcf_PolicyAuthorization",
    "Uu"
   ],
   "campo": "interfaz",
   "valor": "nombre normativo 3GPP/IETF añadido",
   "unidad": "",
   "motivo": "Los documentos dan la relación pero no el nombre de la interfaz.",
   "fuente_parcial": "v7 §5.2",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-073",
   "clave": "arq.qod_latencia",
   "ambito": "arquitectura",
   "elementos": [
    "opengw-qod"
   ],
   "campo": "flujo",
   "valor": "sin latencia de transporte",
   "unidad": "",
   "motivo": "Flujo de control QoD dentro del core: la v7 no da su latencia de transporte.",
   "fuente_parcial": "v7 §4.4",
   "alternativa": "—",
   "estado": "pendiente"
  },
  {
   "id": "S-074",
   "clave": "arq.vonr_lado_b",
   "ambito": "arquitectura",
   "elementos": [
    "vonr-rtp"
   ],
   "campo": "flujo",
   "valor": "lado B en la misma zona y DC que el lado A",
   "unidad": "",
   "motivo": "Lado B de la llamada VoNR en la misma zona y el mismo DC que el lado A, para poder recorrerlo.",
   "fuente_parcial": "v7 §4.4",
   "alternativa": "—",
   "estado": "pendiente"
  }
 ]
};
if (typeof window !== 'undefined') window.RED = RED;
if (typeof module !== 'undefined' && module.exports) module.exports = RED;
