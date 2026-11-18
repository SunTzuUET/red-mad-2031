// Generado por fusionar.py (escribir_arquitectura) — no editar a mano.
// Fuente: memoria conjunta v7 (datos/f0/conjunta.json) + inventarios F0 de grupo.
var ARQ = {
 "generado": "2026-11-19",
 "referencia": {
  "doc": "Memoria conjunta v7",
  "titulo": "High-Capacity Converged Network for the Madrid Metropolitan Region (SCOM + ARCO, M11G3)",
  "version": "v7",
  "etiquetas": "[DATA] fuente identificada, [HYP] hipótesis, [CALC] cálculo reproducible, [DEC] decisión (2.7.1)"
 },
 "capas": [
  {
   "id": "A",
   "nombre": {
    "es": "Acceso radio (5G NR)",
    "en": "Radio access (NG-RAN)"
   },
   "descripcion": "gNB 5G SA en tres capas (n28 cobertura, n78 capacidad, n258 hotspots), indoor en el hospital y ng-eNB NB-IoT/LTE-M para sensores. Los documentos llaman a esta capa 'Acceso' junto con el fijo.",
   "tecnologias": [
    "5G NR SA",
    "n28 700 MHz FDD",
    "n78 3,5 GHz TDD",
    "n258 26 GHz TDD",
    "NB-IoT/LTE-M (E-UTRA) vía ng-eNB",
    "PDCP duplication n28+n78, DAPS/CHO (A-2)"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.5",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 9, 16, 17, 19",
     "v7": false
    }
   ]
  },
  {
   "id": "B",
   "nombre": {
    "es": "Acceso fijo (FTTH/PON)",
    "en": "Fixed access (FTTH/XGS-PON)"
   },
   "descripcion": "ONT/HGW con VoIP SIP, ODN 1:64 (cascada 1:4+1:16) y OLT XGS-PON Nokia Lightspan MF-14. Diseño detallado solo para Alcorcón (2 centrales lógicas). Sedes ≥10 Gbit/s por 25G-PON o enlace dedicado.",
   "tecnologias": [
    "XGS-PON (ITU-T G.9807.1)",
    "25G-PON o enlace dedicado (sedes)",
    "G.652.D"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1, tabla 16",
     "v7": false
    }
   ]
  },
  {
   "id": "C",
   "nombre": {
    "es": "Agregación / backhaul",
    "en": "Aggregation / backhaul"
   },
   "descripcion": "No existe como capa diferenciada en los documentos: 'el acceso de cada site llega a su nodo metro con hasta 20 km de fibra y 4 saltos'. La agregación IP la hace el router de agregación de cada nodo metro.",
   "tecnologias": [
    "fibra hasta 20 km, ≤4 saltos (dato 3.1)"
   ],
   "inferido": true,
   "fuente": [
    {
     "doc": "2.1-S5d_Transporte_Metro_y_L2VPN def.pdf",
     "seccion": "§3",
     "v7": false
    }
   ]
  },
  {
   "id": "D",
   "nombre": {
    "es": "Metro / transporte",
    "en": "Metro transport"
   },
   "descripcion": "Anillo de 4 nodos metro (Centro, Norte, Este, Sur), ≈102 km, WDM/OTN con IP/MPLS (RSVP-TE + FRR facility backup, BFD). Óptica punto a punto por tramo (opción B). Referencia 6/4/4/6 × 400G. Cada DC con dos acometidas; cada Edge adjunto a su nodo metro.",
   "tecnologias": [
    "DWDM banda C (rejilla 100 GHz, hipótesis)",
    "OTN",
    "IP/MPLS",
    "RSVP-TE",
    "FRR (RFC 4090)",
    "BFD",
    "EVPN (RFC 7432)",
    "clases TC0a–TC3 (DSCP/MPLS TC)"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8, §9",
     "v7": false
    }
   ]
  },
  {
   "id": "E",
   "nombre": {
    "es": "Core (5GC, IMS, BNG)",
    "en": "Core (5GC, IMS, BNG)"
   },
   "descripcion": "Tres DC activo-activo (Centro, Norte, Sur), dimensionado N−1 (50 % cada uno, ≈1/3 en normal). 5GC e IMS como bloques separados (relaciones N5 y N6), HSS y UDM separados. BNG en los DC. Core IP/MPLS y routers de borde.",
   "tecnologias": [
    "5GC SA (SBA)",
    "IMS (3GPP TS 23.228)",
    "cloud-native sobre OpenShift (Nokia CNCS, Nokia 5GC SA)",
    "BNG Nokia 7750 SR-2se"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2, §8.5 'BNG de 2.2'",
     "v7": false
    }
   ]
  },
  {
   "id": "F",
   "nombre": {
    "es": "Edge / MEC",
    "en": "Edge / MEC"
   },
   "descripcion": "Tres Edge (Centro, Este, Sur) con UPF local y MEC; Norte sin Edge. Local Breakout por sesión PDU por DNN (sin N9 ni UL CL). Respaldo N−1 entre Edge (no al DC).",
   "tecnologias": [
    "Local Breakout por DNN",
    "UPF local",
    "MEC (Dell R760/R760xa + L40S)",
    "GPU analítica de vídeo"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6",
     "v7": false
    }
   ]
  },
  {
   "id": "G",
   "nombre": {
    "es": "Interconexión",
    "en": "Interconnection"
   },
   "descripcion": "Internet/IXP vía routers de borde BGP; frontera IMS-IMS (IBCF+TrGW); exposición Open Gateway (pasarela CAMARA ante el NEF); L2VPN empresa EVPN; red privada industrial (DN industrial, sin Internet); hub de satélite en Arganda. Sin CS ni roaming.",
   "tecnologias": [
    "BGP",
    "SIP (Ici)",
    "RTP (Izi)",
    "H.248 (Ix)",
    "OAuth 2.0/OIDC, CAMARA",
    "EVPN E-LAN",
    "OneWeb (satélite LEO)"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2, §7, §10.2, §11",
     "v7": false
    }
   ]
  },
  {
   "id": "H",
   "nombre": {
    "es": "Transversal (sincronización, gestión, seguridad)",
    "en": "Cross-layer (sync, OSS, security)"
   },
   "descripcion": "Seguridad ARCO16 (5 decisiones: identidades, segmentación, cifrado, interconexión protegida, detección/recuperación con NWDAF+SIEM). Gestión: modelo OSS/BSS de Dirección (no desarrollado por 2.1); red de gestión separada. Sincronización: no documentada.",
   "tecnologias": [
    "IPsec en N2/N3 con SecGW",
    "MACsec u OTN cifrado (anillo)",
    "mTLS/OAuth 2.0 entre NF (PKI)",
    "MFA",
    "NWDAF",
    "SIEM",
    "anti-DDoS/cortafuegos en N6"
   ],
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1, tabla 18",
     "v7": false
    },
    {
     "doc": "2026-11-10_Acta.pdf",
     "seccion": "§3.2",
     "v7": false
    }
   ]
  }
 ],
 "elementos": [
  {
   "id": "UE",
   "nombre": "Terminal de usuario 5G / IoT / AGV",
   "capa": "A",
   "funciones": [
    "acceso NR",
    "sesiones PDU por DNN (puede tener a la vez sesión MEC y general)"
   ],
   "ubicacion": "zonas de servicio",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": "Terminales comerciales; AGV con 2 Mbit/s UL (0,2 control n28 + 1,8 n78)",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3, §6.2",
     "v7": false
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué sesiones PDU tiene a la vez un terminal en el estadio y por qué?",
     "en": "Which PDU sessions does a terminal in the stadium hold at once, and why?"
    }
   ],
   "reglas": []
  },
  {
   "id": "gNB",
   "nombre": "gNB 5G NR (NG-RAN)",
   "capa": "A",
   "funciones": [
    "radio n28/n78/n258",
    "N2 al AMF",
    "N3 a la UPF",
    "cuota de recursos por slice"
   ],
   "ubicacion": "≈1.071 sites; ≈3.210 sectores n78 (Centro 2.353, Norte 125, Este 234, Sur 498); estadio 265 n258; A-2 ≈10 sites n28",
   "cantidad": "≈1.071 sites (mínimo por capacidad)",
   "redundancia": "A-2: ≈10 sites para cubrir caída de uno; PDCP duplication n28+n78",
   "como_se_implementa": "Nokia AirScale macro (n28), 64T64R massive MIMO (n78), Nokia mmWave (n258)",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 16, 17, 19",
     "v7": false
    }
   ],
   "equipos": [
    "RAD-N28",
    "RAD-N78",
    "RAD-N258",
    "RAD-BBU"
   ],
   "v7": [
    {
     "k": "Sectores n78 por zona (C/N/E/S)",
     "v": "2.353 / 125 / 234 / 498",
     "seccion": "3.1; 6.2.7"
    },
    {
     "k": "Capacidad por sector",
     "v": "n28 30/15; n78 280/60 (≈40 UL con DDDSU); n258 1.440/480 Mbit/s DL/UL",
     "seccion": "6.2.1; 6.5.3"
    },
    {
     "k": "Radio de celda",
     "v": "n78 ≈0,34 km; n28 urbano 2,40 km; n28 rural 3,89 km",
     "seccion": "6.2.4"
    },
    {
     "k": "TDD n78",
     "v": "70/30 para capacidad; latencia con el peor caso DDDSU",
     "seccion": "6.2.6"
    }
   ],
   "v7_corrige": {
    "como_se_implementa": {
     "valor": "Nokia macro n28, 64T64R MAA n78, mmWave Shikra n258",
     "seccion": "5.1.2"
    }
   },
   "red": {
    "nodos": [
     "AGG-ALCALA",
     "AGG-ALCOBENDAS",
     "AGG-ALCORCON",
     "AGG-FUENLABRADA",
     "AGG-GETAFE",
     "AGG-LEGANES",
     "AGG-MADRID",
     "AGG-TORREJON",
     "AGG-TRESCANTOS"
    ],
    "enlaces": [
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
    "nota": "En el simulador el acceso de cada municipio se agrega en un nodo AGG-* (supuesto del simulador, no está en la v7)."
   },
   "preguntas": [
    {
     "es": "¿Qué limita antes en un sector n78 de Centro, el DL o el UL, y qué cambiaría si el patrón TDD fuera DDDSU?",
     "en": "What limits an n78 sector in the Centre first, DL or UL, and what would change with a DDDSU TDD pattern?"
    },
    {
     "es": "Si cae un sitio macro, ¿quién absorbe su tráfico y con qué ocupación quedan las vecinas?",
     "en": "If a macro site fails, who absorbs its traffic and how loaded do the neighbours end up?"
    },
    {
     "es": "¿Por qué la v7 no define el split RAN y qué decisión de transporte depende de él?",
     "en": "Why does v7 not define the RAN split, and which transport decision depends on it?"
    }
   ],
   "reglas": [
    "Sectores equivalentes",
    "Capacidad por sector",
    "Ocupación máxima"
   ]
  },
  {
   "id": "gNB-indoor-hospital",
   "nombre": "Radio indoor Hospital de Getafe",
   "capa": "A",
   "funciones": [
    "cobertura indoor URLLC/salud"
   ],
   "ubicacion": "Hospital Universitario de Getafe",
   "cantidad": "20 pico-RRH (acta: 24–25)",
   "redundancia": "dos cadenas independientes A y B, dos conductos de fibra (99,9998 %)",
   "como_se_implementa": "Nokia AirScale Indoor Radio, ASiR-pRRH AWHQA ≈30 dBm",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 17, 19",
     "v7": false
    }
   ],
   "equipos": [
    "RAD-INDOOR-HOSP"
   ],
   "v7": [
    {
     "k": "Acceso",
     "v": "0,714/0,861 Gbit/s; 15 sectores n78 eq.; Nokia ASiR pRRH AWHQA en 2 cadenas A/B × 10 = 20 pico-RRH (cámaras por fibra; 24 si por radio); ≈30 dBm EIRP",
     "seccion": "6.3.2"
    },
    {
     "k": "Redundancia",
     "v": "Dos cadenas independientes, cada una lleva todo a ≤90 % y debe ir a un nodo Metro distinto con acometidas por conductos distintos (pendiente); disponibilidad 99,9998 % calc. (99,990 % si todo en el mismo sitio); MEC ≤5 s",
     "seccion": "6.3.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-HOSPITAL-GETAFE"
    ],
    "enlaces": [
     "L-SITEHOSPITALGETAFE-METSUR"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué ganáis llevando las dos cadenas a nodos Metro distintos y qué cuesta hacerlo?",
     "en": "What do you gain by homing the two chains on different Metro nodes, and what does it cost?"
    },
    {
     "es": "Si las cámaras van por radio en vez de por fibra, ¿qué cambia en el número de RRH?",
     "en": "If the cameras go over radio instead of fibre, what changes in the number of RRHs?"
    }
   ],
   "reglas": []
  },
  {
   "id": "ng-eNB",
   "nombre": "ng-eNB NB-IoT/LTE-M",
   "capa": "A",
   "funciones": [
    "acceso E-UTRA de 95.000 sensores",
    "N2 al AMF",
    "N3 a UPF central"
   ],
   "ubicacion": "Valdebebas",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": "Debe verificarse soporte NB-IoT con N3 en la RFI de 2.2",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.5",
     "v7": false
    }
   ],
   "equipos": [],
   "v7": [
    {
     "k": "Acceso sensores",
     "v": "Cámaras 7,14 Gbit/s UL; 120 sectores n78 (≈40 sitios); sensores NB-IoT/LTE-M vía ng-eNB, 2 portadoras de 1 PRB (hasta 8 en alarma); alarma: 9.500 informes ≤64 B, 7 portadoras NB-IoT en ≥3 sectores, 99,99 % en 6,9 s con UAC",
     "seccion": "6.3.4"
    },
    {
     "k": "Demanda",
     "v": "5.000 cámaras × 0,8 Mbit/s → 5,0 Gbit/s UL con 25 %; 80.000 sensores cada 900 s + 15.000 cada 60 s → 0,002142 Gbit/s UL",
     "seccion": "3.3.1"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-VALDEBEBAS"
    ],
    "enlaces": [
     "L-SITEVALDEBEBAS-METCENTRO"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué parte del diseño fija la ráfaga de alarma de Valdebebas: la radio, el core o la aplicación?",
     "en": "Which part of the design is driven by the Valdebebas alarm burst: radio, core or application?"
    },
    {
     "es": "¿Por qué los sensores van a la UPF central y no al Edge?",
     "en": "Why do the sensors go to the central UPF and not to the Edge?"
    }
   ],
   "reglas": []
  },
  {
   "id": "TERM-SAT",
   "nombre": "Terminales de satélite",
   "capa": "A",
   "funciones": [
    "acceso por satélite (respaldo)"
   ],
   "ubicacion": null,
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": "OneWeb ≥100/20 Mbit/s por terminal, conmutación ≤60 s",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 9, 20, 31",
     "v7": false
    }
   ],
   "equipos": [
    "SAT-LEO"
   ],
   "v7": [
    {
     "k": "Servicio",
     "v": "OneWeb LEO, hub en Arganda; ≥100/20 Mbit/s por terminal; C/N ≈9 dB a 2.000 km (preliminar); fase 2: ≈180 small cells tácticas con backhaul OneWeb",
     "seccion": "6.11"
    },
    {
     "k": "Uso",
     "v": "Servicios prioritarios: voz, telemetría hospital (sin objetivo 10 ms), gestión; no sirve al público del estadio",
     "seccion": "6.11"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-NTN-ARGANDA"
    ],
    "enlaces": [
     "L-SITENTNARGANDA-METESTE"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué servicios tienen sentido por satélite con ≥100/20 Mbit/s por terminal y cuáles no?",
     "en": "Which services make sense over satellite at ≥100/20 Mbit/s per terminal, and which do not?"
    },
    {
     "es": "¿Qué falta por definir del hub de Arganda para poder contar con él en un fallo?",
     "en": "What is still undefined about the Arganda hub before it can be relied on in a failure?"
    }
   ],
   "reglas": []
  },
  {
   "id": "ONT-HGW",
   "nombre": "ONT / HGW",
   "capa": "B",
   "funciones": [
    "terminación FTTH",
    "cliente SIP registrado en IMS (voz fija VoIP)"
   ],
   "ubicacion": "hogares y empresas",
   "cantidad": "22.353 accesos (Alcorcón 2031)",
   "redundancia": null,
   "como_se_implementa": "XGS-PON",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§2.2 tabla 1; §10.1",
     "v7": false
    }
   ],
   "equipos": [
    "ONT-HGW"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "El diseño FTTH solo está hecho para Alcorcón: ¿cómo extrapolaríais el número de OLT al resto y con qué dato?",
     "en": "FTTH is only designed for Alcorcón: how would you extrapolate the OLT count to the rest, and from which data?"
    },
    {
     "es": "Si cae el nodo Metro de la zona, ¿qué les pasa a los abonados FTTH y qué haría falta para evitarlo?",
     "en": "If the zone's Metro node fails, what happens to FTTH subscribers and what would be needed to avoid it?"
    },
    {
     "es": "¿Qué margen queda en el presupuesto óptico con el límite N2 de 31 dB?",
     "en": "What margin is left in the optical budget against the N2 31 dB limit?"
    }
   ],
   "reglas": []
  },
  {
   "id": "ODN",
   "nombre": "Red óptica pasiva (splitters)",
   "capa": "B",
   "funciones": [
    "distribución 1:64"
   ],
   "ubicacion": "Alcorcón",
   "cantidad": "3.120 splitters (1:4 + 1:16)",
   "redundancia": "sin protección",
   "como_se_implementa": "cascada 1:4 + 1:16; límites N2: 20 km, 31 dB",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1 tabla 16",
     "v7": false
    }
   ],
   "equipos": [
    "ODN-SPLIT"
   ],
   "v7": [
    {
     "k": "Límites",
     "v": "N2: 20 km / 31 dB; 148 Mbit/s por PON en hora cargada",
     "seccion": "6.1.1"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "El diseño FTTH solo está hecho para Alcorcón: ¿cómo extrapolaríais el número de OLT al resto y con qué dato?",
     "en": "FTTH is only designed for Alcorcón: how would you extrapolate the OLT count to the rest, and from which data?"
    },
    {
     "es": "Si cae el nodo Metro de la zona, ¿qué les pasa a los abonados FTTH y qué haría falta para evitarlo?",
     "en": "If the zone's Metro node fails, what happens to FTTH subscribers and what would be needed to avoid it?"
    },
    {
     "es": "¿Qué margen queda en el presupuesto óptico con el límite N2 de 31 dB?",
     "en": "What margin is left in the optical budget against the N2 31 dB limit?"
    }
   ],
   "reglas": [
    "PON"
   ]
  },
  {
   "id": "OLT",
   "nombre": "OLT XGS-PON",
   "capa": "B",
   "funciones": [
    "terminación PON",
    "agregación fija hacia el metro y el BNG"
   ],
   "ubicacion": "Alcorcón: 2 centrales lógicas A y B (sin ubicación exacta); resto de zonas no diseñado",
   "cantidad": "Alcorcón: 624 PON, 40 tarjetas LT de 16 puertos, 4 chasis Nokia Lightspan MF-14 (2 por central)",
   "redundancia": "dos centrales ≠ protección 1+1; doble conexión de OLT críticas pendiente (diap. 31)",
   "como_se_implementa": "Nokia Lightspan MF-14",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1 tabla 16",
     "v7": false
    }
   ],
   "equipos": [
    "OLT-MF14"
   ],
   "v7": [
    {
     "k": "Diseño FTTH",
     "v": "Solo Alcorcón: 624 PON, 40 LT, 4 MF-14, 2 centrales lógicas",
     "seccion": "6.1.1"
    },
    {
     "k": "Alcance",
     "v": "FTTH dimensionado para abonados del operador con 25 %, no para todos los hogares (Dirección 17/11)",
     "seccion": "2.5"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "AGG-ALCALA",
     "AGG-ALCOBENDAS",
     "AGG-ALCORCON",
     "AGG-FUENLABRADA",
     "AGG-GETAFE",
     "AGG-LEGANES",
     "AGG-MADRID",
     "AGG-TORREJON",
     "AGG-TRESCANTOS"
    ],
    "enlaces": [
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
    "nota": "En el simulador el acceso de cada municipio se agrega en un nodo AGG-* (supuesto del simulador, no está en la v7)."
   },
   "preguntas": [
    {
     "es": "El diseño FTTH solo está hecho para Alcorcón: ¿cómo extrapolaríais el número de OLT al resto y con qué dato?",
     "en": "FTTH is only designed for Alcorcón: how would you extrapolate the OLT count to the rest, and from which data?"
    },
    {
     "es": "Si cae el nodo Metro de la zona, ¿qué les pasa a los abonados FTTH y qué haría falta para evitarlo?",
     "en": "If the zone's Metro node fails, what happens to FTTH subscribers and what would be needed to avoid it?"
    },
    {
     "es": "¿Qué margen queda en el presupuesto óptico con el límite N2 de 31 dB?",
     "en": "What margin is left in the optical budget against the N2 31 dB limit?"
    }
   ],
   "reglas": [
    "PON"
   ]
  },
  {
   "id": "NODO-METRO",
   "nombre": "Nodo metro",
   "capa": "D",
   "funciones": [
    "nodo del anillo",
    "punto de conexión de accesos, Edge y DC"
   ],
   "ubicacion": "Centro, Norte, Este, Sur (un nodo por zona; sin emplazamiento concreto)",
   "cantidad": 4,
   "redundancia": "anillo con FRR; la caída completa de un nodo aísla su zona (escenario B, sin resolver)",
   "como_se_implementa": "Nokia 7750 SR + Nokia 1830 PSS",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.2 tabla 11; §9.2 tabla 14",
     "v7": false
    }
   ],
   "equipos": [
    "PE-METRO-7750",
    "WDM-1830PSS"
   ],
   "v7": [
    {
     "k": "Topología",
     "v": "C–N–E–S–C, 4 nodos Metro (uno por zona), sin tránsito por DC ni Edge; Edge = acometida local de su nodo",
     "seccion": "6.4.1"
    },
    {
     "k": "Vanos (km)",
     "v": "C–N 20 · N–E 28 · E–S 38 · S–C 16 (≈102); estimación de mapa ×1,4, no longitud de fibra verificada",
     "seccion": "6.4.1"
    },
    {
     "k": "Router por nodo",
     "v": "1 router de agregación por nodo [HYP]; duplicar Metro-Centro = propuesta (nodo crítico: 74,6 % de la demanda, 2.571,81 de 3.448,22 Gbit/s DL)",
     "seccion": "6.4.2; 6.4.3"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "MET-CENTRO",
     "MET-NORTE",
     "MET-ESTE",
     "MET-SUR"
    ],
    "enlaces": [
     "L-ANILLO-CN",
     "L-ANILLO-NE",
     "L-ANILLO-ES",
     "L-ANILLO-SC"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con la zona si cae el nodo Metro completo, y por qué FRR no lo resuelve?",
     "en": "What happens to the zone if the whole Metro node fails, and why does FRR not solve it?"
    },
    {
     "es": "¿Qué vano se satura antes con pico P2 y un corte a la vez, y estáis obligados a cubrir ese caso?",
     "en": "Which span saturates first with P2 peak plus a cut at the same time, and are you required to cover that case?"
    },
    {
     "es": "¿Qué ventajas e inconvenientes tendría SR-MPLS con TI-LFA frente al RSVP-TE elegido?",
     "en": "What would SR-MPLS with TI-LFA gain or lose compared with the chosen RSVP-TE?"
    }
   ],
   "reglas": [
    "Canales 400G",
    "Rutas",
    "Latencia de transporte"
   ]
  },
  {
   "id": "ROUTER-AGG-METRO",
   "nombre": "Router de agregación IP/MPLS (PE)",
   "capa": "D",
   "funciones": [
    "PE IP/MPLS",
    "RSVP-TE con LSP principal y secundario por par de nodos",
    "FRR bypass + BFD",
    "PE de EVPN"
   ],
   "ubicacion": "uno por nodo metro",
   "cantidad": 4,
   "redundancia": "un PE por nodo (Norte, Este, Sur sin multihoming)",
   "como_se_implementa": "Nokia 7750 SR (alternativa Juniper MX)",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.5; §10.2",
     "v7": false
    }
   ],
   "equipos": [
    "PE-METRO-7750"
   ],
   "v7": [
    {
     "k": "LAG",
     "v": "Un LAG 400GE por vano y por acometida (un miembro por λ, LACP); RSVP-TE ve un TE-link por vano; min-links = N−1; reserva RSVP ≤90 % del LAG en fallo y ≤70 % en normal; hash por flujo",
     "seccion": "6.4.4"
    },
    {
     "k": "Protección",
     "v": "RSVP-TE FRR Facility Backup (RFC 4090) con bypass NHOP por los otros tres vanos; detección LOS/BFD; objetivo ≤50 ms (no medido)",
     "seccion": "6.4.4"
    },
    {
     "k": "SRLG",
     "v": "Un SRLG por vano y uno por acometida (10 en total); secundarios SRLG-disjuntos comprobados. Todas las λ de un vano comparten SRLG; si los 2 enlaces van por conductos distintos habría 2 LAG con SRLG distintos (pendiente 2.1/3.1)",
     "seccion": "6.4.4"
    },
    {
     "k": "Clases de tráfico",
     "v": "TC0a: SIP (5QI 5); TC0b: control 5GC (N2, N4, SBI) y gestión; TC1: VoNR y URLLC (5QI 1, 82, 83), cola estricta; TC2: vídeo/datos garantizados (5QI 2, 71, 72), QoD, IPTV multicast, L2VPN; TC3: Internet/OTT (5QI 9)",
     "seccion": "6.4.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "MET-CENTRO",
     "MET-NORTE",
     "MET-ESTE",
     "MET-SUR"
    ],
    "enlaces": [
     "L-ANILLO-CN",
     "L-ANILLO-NE",
     "L-ANILLO-ES",
     "L-ANILLO-SC",
     "L-CORE1-METC",
     "L-CORE1-METN",
     "L-CORE2-METN",
     "L-CORE2-METE",
     "L-CORE3-METS",
     "L-CORE3-METC"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con la zona si cae el nodo Metro completo, y por qué FRR no lo resuelve?",
     "en": "What happens to the zone if the whole Metro node fails, and why does FRR not solve it?"
    },
    {
     "es": "¿Qué vano se satura antes con pico P2 y un corte a la vez, y estáis obligados a cubrir ese caso?",
     "en": "Which span saturates first with P2 peak plus a cut at the same time, and are you required to cover that case?"
    },
    {
     "es": "¿Qué ventajas e inconvenientes tendría SR-MPLS con TI-LFA frente al RSVP-TE elegido?",
     "en": "What would SR-MPLS with TI-LFA gain or lose compared with the chosen RSVP-TE?"
    }
   ],
   "reglas": [
    "Canales 400G",
    "LAG"
   ]
  },
  {
   "id": "ROUTER-AGG-METRO-CENTRO-B",
   "nombre": "Segundo router de agregación en Metro-Centro",
   "capa": "D",
   "funciones": [
    "duplicación por concentración de demanda (74,6 % DL)",
    "multihoming EVPN"
   ],
   "ubicacion": "Metro-Centro",
   "cantidad": 1,
   "redundancia": null,
   "como_se_implementa": "Nokia 7750 SR",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.4, §8.5, tabla 19",
     "v7": false
    }
   ],
   "equipos": [
    "PE-METRO-7750"
   ],
   "v7": [
    {
     "k": "Estado",
     "v": "Propuesta [HYP] pendiente para la entrega final; condiciona el multihoming L2VPN en Centro",
     "seccion": "6.4.2; 6.4.3; C.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "MET-CENTRO"
    ],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué riesgo cubre duplicar el router de Metro-Centro y cuánta demanda depende hoy de él?",
     "en": "Which risk does duplicating the Metro-Centre router cover, and how much demand depends on it today?"
    },
    {
     "es": "¿Qué otras decisiones (L2VPN, acometidas) cambian si se aprueba?",
     "en": "Which other decisions (L2VPN, feeds) change if it is approved?"
    }
   ],
   "reglas": []
  },
  {
   "id": "WDM-OTN",
   "nombre": "Capa óptica WDM/OTN",
   "capa": "D",
   "funciones": [
    "transporte de λ 400G por tramo"
   ],
   "ubicacion": "tramos C–N 20 km, N–E 28, E–S 38, S–C 16 (≈102 km, estimación × 1,4)",
   "cantidad": "referencia 6/4/4/6 × 400G (mínimo 6/3/4/3; 7/6/7/6 si pico y corte coinciden)",
   "redundancia": "protección IP (FRR); no se presupone 1+1 óptica",
   "como_se_implementa": "Nokia 1830 PSS (alternativa Ciena Waveserver); opción B punto a punto por tramo",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.2 tabla 11",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 8, 27",
     "v7": false
    }
   ],
   "equipos": [
    "WDM-1830PSS"
   ],
   "v7": [
    {
     "k": "Capa óptica",
     "v": "Opción B: cada λ termina en el router de cada nodo (punto a punto por vano); ROADM (opción A) como evolución. 2 enlaces × 7 λ × 400G por vano (2.800 Gbit/s por enlace), tarjeta 1830 PSS S5AD400H (CFP2-DCO, 63 GBaud, ~69 GHz en canal 100 GHz); 14 de ~48 λ banda C. OSNR y modo de línea pendientes.",
     "seccion": "6.4.1"
    },
    {
     "k": "Canales 400G referencia (C–N/N–E/E–S/S–C)",
     "v": "6/4/4/6 (LAG 2.400/1.600/1.600/2.400 Gbit/s)",
     "seccion": "6.4.3"
    },
    {
     "k": "Mínimo calculado",
     "v": "6/3/4/3; 7/6/7/6 solo si se exige pico P2 + corte",
     "seccion": "6.4.3; 7.1.2"
    },
    {
     "k": "Pérdidas por vano (dB)",
     "v": "C–N 6 · N–E 8 · E–S 10,5 · S–C 5; 0,25 dB/km + 1 dB conectores por vano [HYP 2.1]; camino de protección más largo 86 km > 22 dB",
     "seccion": "6.4.1"
    },
    {
     "k": "Carga máx. C-N",
     "v": "1.894,72 Gbit/s sobre 2.400 → 78,95 %",
     "seccion": "6.4.3"
    },
    {
     "k": "Carga máx. N-E",
     "v": "992,27 Gbit/s sobre 1.600 → 62,02 %",
     "seccion": "6.4.3"
    },
    {
     "k": "Carga máx. E-S",
     "v": "1.111,93 Gbit/s sobre 1.600 → 69,50 %",
     "seccion": "6.4.3"
    },
    {
     "k": "Carga máx. S-C",
     "v": "947,93 Gbit/s sobre 2.400 → 39,50 %",
     "seccion": "6.4.3"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "MET-CENTRO",
     "MET-NORTE",
     "MET-ESTE",
     "MET-SUR"
    ],
    "enlaces": [
     "L-ANILLO-CN",
     "L-ANILLO-NE",
     "L-ANILLO-ES",
     "L-ANILLO-SC"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Por qué todas las λ de un vano comparten SRLG y qué cambiaría con dos conductos distintos?",
     "en": "Why do all λ of a span share an SRLG, and what would change with two separate ducts?"
    },
    {
     "es": "¿Qué falta (OSNR, modo de línea) para dar por buena la opción B punto a punto?",
     "en": "What is missing (OSNR, line mode) before point-to-point option B can be accepted?"
    }
   ],
   "reglas": [
    "Canales 400G",
    "LAG"
   ]
  },
  {
   "id": "DC",
   "nombre": "Data Centre",
   "capa": "E",
   "funciones": [
    "plano de control 5GC e IMS",
    "UPF central",
    "BNG",
    "routers de borde"
   ],
   "ubicacion": "DC-Centro, DC-Norte, DC-Sur; DC-Centro→Metro Centro+Norte; DC-Norte→Norte+Este; DC-Sur→Sur+Centro",
   "cantidad": 3,
   "redundancia": "activo-activo N−1: 50 % cada uno, ≈1/3 en normal; replicación de estado pendiente",
   "como_se_implementa": "OpenShift; Dell R760",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.2; §8.3",
     "v7": false
    }
   ],
   "equipos": [
    "CAAS-OPENSHIFT",
    "SRV-R760"
   ],
   "v7": [
    {
     "k": "Modo",
     "v": "3 DC activo-activo, criterio N−1: cada DC dimensionado para 50 % de la carga; ~1/3 en normal, 1/2 por superviviente si cae uno",
     "seccion": "2.7.2; 6.4.1"
    },
    {
     "k": "Acometidas",
     "v": "DC-Centro: Metro-C (6×400G), Metro-N (4×400G) · DC-Norte: Metro-N (6×400G), Metro-E (4×400G) · DC-Sur: Metro-S (4×400G), Metro-C (6×400G)",
     "seccion": "6.4.1; 6.4.3"
    },
    {
     "k": "Agregado P2 por DC",
     "v": "2.407,86 Gbit/s máx. físico",
     "seccion": "A11.7"
    },
    {
     "k": "Disponibilidad core",
     "v": "99,996 % (20,1 min/año) — 99,98 % por DC [HYP]; fallo software común 20 min/año [HYP]",
     "seccion": "7.1.1; A.2 A5"
    },
    {
     "k": "Ubicación",
     "v": "Ninguna física: 'not a physical fibre plan'",
     "seccion": "3.1.2; 6.4.1"
    },
    {
     "k": "Replicación de estado",
     "v": "No verificada (7.6)",
     "seccion": "7.6"
    },
    {
     "k": "Acometida C–DC-Centro",
     "v": "6×400G = 2.400 Gbit/s; peor 2.139 (Pico P2) → 89,13 % (0,87 puntos hasta 90 %)",
     "seccion": "6.4.4; A11.5–A11.6"
    },
    {
     "k": "Acometida N–DC-Centro",
     "v": "4×400G = 1.600 Gbit/s; peor 1.222,66 (caída acometida C–DC) → 76,42 %",
     "seccion": "6.4.4; A11.5–A11.6"
    },
    {
     "k": "Acometida N–DC-Norte",
     "v": "6×400G = 2.400 Gbit/s; peor 1.859,38 (Pico P2) → 77,47 %",
     "seccion": "6.4.4; A11.5–A11.6"
    },
    {
     "k": "Acometida E–DC-Norte",
     "v": "4×400G = 1.600 Gbit/s; peor 1.222,66 (caída acometida N–DN) → 76,42 %",
     "seccion": "6.4.4; A11.5–A11.6"
    },
    {
     "k": "Acometida S–DC-Sur",
     "v": "4×400G = 1.600 Gbit/s; peor 1.222,66 (caída acometida C–DS) → 76,42 %",
     "seccion": "6.4.4; A11.5–A11.6"
    },
    {
     "k": "Acometida C–DC-Sur",
     "v": "6×400G = 2.400 Gbit/s; peor 1.859,38 (Pico P2) → 77,47 %",
     "seccion": "6.4.4; A11.5–A11.6"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "CORE-1",
     "CORE-2",
     "CORE-3"
    ],
    "enlaces": [
     "L-CORE1-METC",
     "L-CORE1-METN",
     "L-CORE2-METN",
     "L-CORE2-METE",
     "L-CORE3-METS",
     "L-CORE3-METC"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "Si dos DC comparten conducto o suministro eléctrico, ¿sigue valiendo el criterio N−1?",
     "en": "If two DCs share a duct or power feed, does the N−1 criterion still hold?"
    },
    {
     "es": "¿Qué acometida de DC está más cerca del 90 % y en qué escenario?",
     "en": "Which DC feed is closest to 90 %, and in which scenario?"
    },
    {
     "es": "¿Qué pasa con las sesiones activas si cae un DC y la replicación de estado no está verificada?",
     "en": "What happens to active sessions if a DC fails while state replication is unverified?"
    }
   ],
   "reglas": [
    "Reparto entre DC",
    "Un fallo a la vez (N−1)",
    "Disponibilidad core"
   ]
  },
  {
   "id": "AMF",
   "nombre": "AMF",
   "capa": "E",
   "funciones": [
    "registro y movilidad",
    "N1/N2",
    "localización a nivel de celda/TAI para Device Location"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "SMF",
   "nombre": "SMF",
   "capa": "E",
   "funciones": [
    "sesiones PDU",
    "selección de UPF por DNN, topología y política",
    "N4"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "PCF",
   "nombre": "PCF",
   "capa": "E",
   "funciones": [
    "políticas y QoS por flujo (5QI, ARP, GFBR/MFBR)",
    "N5 con P-CSCF"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "UDM",
   "nombre": "UDM",
   "capa": "E",
   "funciones": [
    "suscripciones (incl. slice privado)",
    "2.230.739 abonados por réplica"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "UDM"
   ],
   "v7": [
    {
     "k": "Abonados por DC",
     "v": "partición 1.239.300; réplica completa 2.230.739; base 1.784.591 (móviles + 100.000 IoT)",
     "seccion": "6.6.2; A3"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "AUSF",
   "nombre": "AUSF",
   "capa": "E",
   "funciones": [
    "autenticación 5G-AKA"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "NRF",
   "nombre": "NRF",
   "capa": "E",
   "funciones": [
    "descubrimiento de NF"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "NSSF",
   "nombre": "NSSF",
   "capa": "E",
   "funciones": [
    "selección de slice (obligatoria)"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "NEF",
   "nombre": "NEF",
   "capa": "E",
   "funciones": [
    "exposición a la pasarela CAMARA (Nnef_AFsessionWithQoS)"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1",
   "como_se_implementa": "Nokia 5G Core SA",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §5.4; §7.2",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "NEP-CAMARA"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con una petición QoD si la pasarela CAMARA no está disponible?",
     "en": "What happens to a QoD request if the CAMARA gateway is unavailable?"
    },
    {
     "es": "¿Qué datos del operador expone cada API y cómo se protegen?",
     "en": "Which operator data does each API expose, and how is it protected?"
    }
   ],
   "reglas": []
  },
  {
   "id": "BSF",
   "nombre": "BSF",
   "capa": "E",
   "funciones": [
    "localización del PCF de la sesión para QoD"
   ],
   "ubicacion": "no indicada",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2 (OG-1)",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "NWDAF",
   "nombre": "NWDAF",
   "capa": "H",
   "funciones": [
    "analítica de red para detección de anomalías"
   ],
   "ubicacion": "no indicada",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1 tabla 18",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "SMF-PRIV",
   "nombre": "SMF lógica dedicada al slice privado",
   "capa": "E",
   "funciones": [
    "sesiones del slice (2, 000101)"
   ],
   "ubicacion": "en los DC (sin ubicación física propia)",
   "cantidad": 1,
   "redundancia": null,
   "como_se_implementa": "instancia lógica",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ],
   "equipos": [
    "5GC-NOKIA",
    "CAAS-OPENSHIFT"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué funciones del 5GC necesitan estado compartido entre DC y cuáles pueden ser independientes?",
     "en": "Which 5GC functions need shared state across DCs, and which can be independent?"
    },
    {
     "es": "¿Por qué la v7 separa HSS y UDM en vez de unificarlos?",
     "en": "Why does v7 keep HSS and UDM separate rather than unified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "UPF-CENTRAL",
   "nombre": "UPF central",
   "capa": "E",
   "funciones": [
    "Internet móvil",
    "VoNR (DNN ims)",
    "95.000 sensores mMTC"
   ],
   "ubicacion": "3 DC",
   "cantidad": "2 instancias por DC; 3 servidores por DC (3.2 citaba 4)",
   "redundancia": "N−1 entre DC",
   "como_se_implementa": "rendimiento estimado (benchmark NEC): 2 Gbit/s y 0,75 Mpps por vCPU; la voz (100 B) limita: 168 vCPU",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3 tabla 7",
     "v7": false
    },
    {
     "doc": "Trazabilidad_interna_Memoria_2_1.xlsx",
     "seccion": "A3.9, A3.10",
     "v7": false
    }
   ],
   "equipos": [
    "UPF-CENTRAL",
    "SRV-R760"
   ],
   "v7": [
    {
     "k": "Servidores por DC",
     "v": "3 Dell R760 (2 útiles por RAM + 1 reserva)",
     "seccion": "6.7.4"
    },
    {
     "k": "Instancias públicas por DC",
     "v": 2,
     "seccion": "6.7.4"
    },
    {
     "k": "Normal",
     "v": "146 vCPU · 584 GB · NIC 283,56 Gbit/s",
     "seccion": "6.7.4; A10"
    },
    {
     "k": "Pico P2",
     "v": "147 vCPU · NIC 387,18 Gbit/s",
     "seccion": "6.7.4"
    },
    {
     "k": "Con un DC caído",
     "v": "162 vCPU · 646 GB · NIC 330,82 Gbit/s",
     "seccion": "6.7.4"
    },
    {
     "k": "UPF central total",
     "v": "398,20 / 111,89 Gbit/s DL/UL — Internet móvil + VoNR + 95.000 sensores mMTC (+0,002142 UL)",
     "seccion": "3.4.1; 6.7.2"
    }
   ],
   "v7_corrige": {
    "cantidad": {
     "valor": "2 instancias públicas y 3 servidores R760 por DC",
     "seccion": "6.7.4"
    },
    "como_se_implementa": {
     "valor": "UPF CPU = max(h·R/5; P/0,75); 5 Gbit/s por vCPU nominal (2 Gbit/s solo como cota IMIX)",
     "seccion": "6.7.4"
    }
   },
   "red": {
    "nodos": [
     "CORE-1",
     "CORE-2",
     "CORE-3"
    ],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué limita la UPF con tráfico de voz de 100 B: la CPU por Gbit/s o los paquetes por segundo?",
     "en": "With 100 B voice packets, what limits the UPF: CPU per Gbit/s or packets per second?"
    },
    {
     "es": "Si cae un DC, ¿qué pasa con la NIC de la UPF en los supervivientes?",
     "en": "If a DC fails, what happens to the UPF NIC in the surviving DCs?"
    }
   ],
   "reglas": [
    "UPF CPU",
    "Cabeceras de transporte"
   ]
  },
  {
   "id": "P-CSCF",
   "nombre": "P-CSCF",
   "capa": "E",
   "funciones": [
    "IMS: proxy SIP, AF ante el PCF (N5)"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "I-CSCF",
   "nombre": "I-CSCF",
   "capa": "E",
   "funciones": [
    "IMS: interrogación"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "S-CSCF",
   "nombre": "S-CSCF",
   "capa": "E",
   "funciones": [
    "IMS: control de sesión"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "TAS",
   "nombre": "TAS",
   "capa": "E",
   "funciones": [
    "IMS: servicios suplementarios y videoconferencia"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "HSS",
   "nombre": "HSS",
   "capa": "E",
   "funciones": [
    "IMS: base de abonados IMS (separada del UDM)"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "HSS-IMS"
   ],
   "v7": [
    {
     "k": "Registros por DC",
     "v": "partición 1.690.486; réplica completa 3.042.874",
     "seccion": "6.6.2; A3"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "MRFC",
   "nombre": "MRFC",
   "capa": "E",
   "funciones": [
    "IMS: control de recursos de medios"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": []
  },
  {
   "id": "MRFP",
   "nombre": "MRFP",
   "capa": "E",
   "funciones": [
    "IMS: procesado de medios"
   ],
   "ubicacion": "3 DC",
   "cantidad": "en los 3 DC",
   "redundancia": "activo-activo N−1; 1.014.292 legs y 902 CAPS por DC con un DC caído",
   "como_se_implementa": "Nokia CNCS sobre OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 13",
     "v7": false
    }
   ],
   "equipos": [
    "IMS-CNCS",
    "CAAS-OPENSHIFT"
   ],
   "v7": [
    {
     "k": "Patas por DC",
     "v": "1.014.292 (normal con 3 DC 869.393)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "CAPS por DC",
     "v": "902 (normal 773)",
     "seccion": "6.6.2; A3"
    },
    {
     "k": "Ocupación",
     "v": "60 % normal / 90 % con un DC caído (con 25 %); 48 %/72 % sin reserva",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso del IMS se dimensiona por patas y cuál por CAPS, y por qué?",
     "en": "Which IMS resource is sized by legs and which by CAPS, and why?"
    },
    {
     "es": "Con un DC caído el IMS sube al 90 %: ¿qué margen os queda para un evento?",
     "en": "With one DC down IMS reaches 90 %: what margin is left for an event?"
    }
   ],
   "reglas": []
  },
  {
   "id": "BNG",
   "nombre": "BNG (tráfico fijo)",
   "capa": "E",
   "funciones": [
    "terminación de sesiones fijas",
    "salida del tráfico fijo al core"
   ],
   "ubicacion": "DC-Centro 6 (3+3), DC-Norte 2 (1+1), DC-Sur 2 (1+1); Centro→DC-Centro, Norte→DC-Norte, Sur→DC-Sur, Este 50/50 Norte-Sur",
   "cantidad": "10 chasis; 774.515 sesiones; 2.885 Gbit/s DL",
   "redundancia": "1+1 dentro del mismo DC (acta: si cae el DC se cae el fijo de esa zona); diap. 13 dice respaldo en otro DC",
   "como_se_implementa": "Nokia 7750 SR-2se",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.5 'BNG de 2.2'",
     "v7": false
    },
    {
     "doc": "2.1-S5d_Transporte_Metro_y_L2VPN def.pdf",
     "seccion": "§7",
     "v7": false
    }
   ],
   "equipos": [
    "BNG-7750-SR2SE",
    "BNG-CP-MAGC"
   ],
   "v7": [
    {
     "k": "Equipo",
     "v": "Nokia 7750 SR-2se, 10 chasis",
     "seccion": "6.10.1"
    },
    {
     "k": "Sesiones",
     "v": "774.515",
     "seccion": "3.4.1"
    },
    {
     "k": "Tráfico con reserva",
     "v": "2.884,70 / 320,52 Gbit/s DL/UL",
     "seccion": "3.4.1"
    },
    {
     "k": "Política",
     "v": "Georredundante: respaldo de cada zona en otro DC; 1:1 entre chasis con sincronización de estado de abonado (familia multi-chasis 7750 IPoE/PPPoE; soporte en SR-2se y licencia por confirmar). Un fallo cada vez.",
     "seccion": "6.10.1"
    },
    {
     "k": "DC-Centro",
     "v": "3 activos + 2 respaldo = 5 (antes 6 (3+3))",
     "seccion": "6.10.1"
    },
    {
     "k": "DC-Norte",
     "v": "1 activos + 0 respaldo = 1 (antes 2 (1+1))",
     "seccion": "6.10.1"
    },
    {
     "k": "DC-Sur",
     "v": "1 activos + 3 respaldo = 4 (antes 2 (1+1))",
     "seccion": "6.10.1"
    },
    {
     "k": "Zona Centro",
     "v": "3 chasis DC-Centro; respaldo 3 chasis DC-Sur; si cae: Acometida directa Metro-Centro → DC-Sur",
     "seccion": "6.10.1"
    },
    {
     "k": "Zona Norte + ½ Este",
     "v": "1 chasis DC-Norte; respaldo 1 chasis DC-Centro; si cae: Acometida directa Metro-Norte → DC-Centro",
     "seccion": "6.10.1"
    },
    {
     "k": "Zona Sur + ½ Este",
     "v": "1 chasis DC-Sur; respaldo 1 chasis DC-Centro; si cae: Vano S–C (16 km) + acometida C–DC-Centro",
     "seccion": "6.10.1"
    }
   ],
   "v7_corrige": {
    "ubicacion": {
     "valor": "DC-Centro 5 (3+2), DC-Norte 1 (1+0), DC-Sur 4 (1+3)",
     "seccion": "6.10.1"
    },
    "redundancia": {
     "valor": "Georredundante 1:1 en otro DC (Centro→DC-Sur; Norte y Sur→DC-Centro)",
     "seccion": "6.10.1"
    }
   },
   "red": {
    "nodos": [
     "CORE-1",
     "CORE-2",
     "CORE-3"
    ],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "Si cae DC-Centro, ¿por dónde llega el tráfico fijo de Centro a su BNG de respaldo y cuánto carga esa acometida?",
     "en": "If DC-Centro fails, which path does Centre fixed traffic take to its backup BNG, and how loaded is that feed?"
    },
    {
     "es": "¿Qué no resuelve el respaldo georredundante del BNG?",
     "en": "What does geo-redundant BNG backup not solve?"
    }
   ],
   "reglas": [
    "Reserva de demanda",
    "Ocupación máxima"
   ]
  },
  {
   "id": "CORE-IPMPLS",
   "nombre": "Core IP/MPLS",
   "capa": "E",
   "funciones": [
    "transporte del core"
   ],
   "ubicacion": "DC",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "Si dos DC comparten conducto o suministro eléctrico, ¿sigue valiendo el criterio N−1?",
     "en": "If two DCs share a duct or power feed, does the N−1 criterion still hold?"
    },
    {
     "es": "¿Qué acometida de DC está más cerca del 90 % y en qué escenario?",
     "en": "Which DC feed is closest to 90 %, and in which scenario?"
    },
    {
     "es": "¿Qué pasa con las sesiones activas si cae un DC y la replicación de estado no está verificada?",
     "en": "What happens to active sessions if a DC fails while state replication is unverified?"
    }
   ],
   "reglas": []
  },
  {
   "id": "ROUTER-BORDE",
   "nombre": "Routers de borde (peering/tránsito BGP)",
   "capa": "G",
   "funciones": [
    "salida a Internet",
    "peering BGP"
   ],
   "ubicacion": "en los DC (junto a su nodo metro)",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2",
     "v7": false
    },
    {
     "doc": "2.1-S5d_Transporte_Metro_y_L2VPN def.pdf",
     "seccion": "§4.1",
     "v7": false
    }
   ],
   "equipos": [
    "ROUTER-BORDE"
   ],
   "v7": [
    {
     "k": "Salida a Internet",
     "v": "Salida por routers de borde del core (BGP peering y tránsito), IXP 'e.g. Espanix'. Internet fijo termina en BNG; móvil en UPF central (N6).",
     "seccion": "5.1.1; 5.2"
    },
    {
     "k": "Capacidad",
     "v": "No dimensionada (sin Gbit/s de IX/tránsito). Demanda de referencia: 3.614,24 Gbit/s fijo+móvil con 25 % (P2 ×2).",
     "seccion": "3.3.1"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "IX-INTERNET"
    ],
    "enlaces": [
     "L-CORE1-IXINTERNET",
     "L-CORE2-IXINTERNET",
     "L-CORE3-IXINTERNET"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Cómo dimensionaríais la salida a Internet si la v7 no da Gbit/s de IX?",
     "en": "How would you size the Internet exit when v7 gives no IX Gbit/s?"
    },
    {
     "es": "¿Qué pasa con el tráfico de Internet si cae el router de borde de un DC?",
     "en": "What happens to Internet traffic if one DC's border router fails?"
    }
   ],
   "reglas": []
  },
  {
   "id": "IBCF",
   "nombre": "IBCF (SBC, señalización)",
   "capa": "G",
   "funciones": [
    "frontera IMS con otros operadores IMS",
    "Ici (SIP)"
   ],
   "ubicacion": "no indicada",
   "cantidad": "13 SBC por DC (trazabilidad A1.6)",
   "redundancia": null,
   "como_se_implementa": "memoria: Ribbon SBC SWe; diap. 29: 'Carrier-grade SBC' (Nokia SBC o Ribbon)",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §11.1 tabla 18",
     "v7": false
    }
   ],
   "equipos": [
    "SBC-IBCF-TRGW"
   ],
   "v7": [
    {
     "k": "Interconexión IMS",
     "v": "973,72 CAPS ambos sentidos (876.347,4 Erl); 13 instancias SBC/DC (2.2); caudal de media hacia el otro operador no dado (media IMS total 186,95 Gbit/s/sentido para 1.460.579 patas a 128 kbit/s)",
     "seccion": "6.6.2; A2"
    },
    {
     "k": "SBC",
     "v": "13 instancias por DC (dato de 2.2)",
     "seccion": "6.6.2"
    }
   ],
   "v7_corrige": {
    "como_se_implementa": {
     "valor": "Sin modelo único (SBC carrier-grade / Ribbon SBC SWe)",
     "seccion": "5.1.2; 6.13"
    }
   },
   "red": {
    "nodos": [
     "IX-IMS"
    ],
    "enlaces": [
     "L-CORE1-IXIMS",
     "L-CORE2-IXIMS",
     "L-CORE3-IXIMS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué cambia entre el SBC integrado y uno especializado a la hora de dimensionar?",
     "en": "What changes in sizing between an integrated SBC and a specialised one?"
    },
    {
     "es": "¿Cómo pasaríais de 973,72 CAPS a Gbit/s de media hacia el otro operador?",
     "en": "How would you go from 973.72 CAPS to media Gbit/s towards the other operator?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "TrGW",
   "nombre": "TrGW (medios)",
   "capa": "G",
   "funciones": [
    "medios RTP hacia otro operador (Izi)",
    "controlado por IBCF vía Ix (H.248)"
   ],
   "ubicacion": "no indicada",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ],
   "equipos": [
    "SBC-IBCF-TRGW"
   ],
   "v7": [
    {
     "k": "Interconexión IMS",
     "v": "973,72 CAPS ambos sentidos (876.347,4 Erl); 13 instancias SBC/DC (2.2); caudal de media hacia el otro operador no dado (media IMS total 186,95 Gbit/s/sentido para 1.460.579 patas a 128 kbit/s)",
     "seccion": "6.6.2; A2"
    },
    {
     "k": "SBC",
     "v": "13 instancias por DC (dato de 2.2)",
     "seccion": "6.6.2"
    },
    {
     "k": "Media IMS",
     "v": "186,95 Gbit/s por sentido (todas las patas, antes de reserva); caudal hacia el otro operador no dado",
     "seccion": "6.6.2; A2"
    }
   ],
   "v7_corrige": {
    "como_se_implementa": {
     "valor": "Sin modelo único (SBC carrier-grade / Ribbon SBC SWe)",
     "seccion": "5.1.2; 6.13"
    }
   },
   "red": {
    "nodos": [
     "IX-IMS"
    ],
    "enlaces": [
     "L-CORE1-IXIMS",
     "L-CORE2-IXIMS",
     "L-CORE3-IXIMS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué cambia entre el SBC integrado y uno especializado a la hora de dimensionar?",
     "en": "What changes in sizing between an integrated SBC and a specialised one?"
    },
    {
     "es": "¿Cómo pasaríais de 973,72 CAPS a Gbit/s de media hacia el otro operador?",
     "en": "How would you go from 973.72 CAPS to media Gbit/s towards the other operator?"
    }
   ],
   "reglas": [
    "IMS"
   ]
  },
  {
   "id": "CAMARA-GW",
   "nombre": "Pasarela CAMARA / Open Gateway",
   "capa": "G",
   "funciones": [
    "autenticación OAuth2/OIDC (CIBA, client credentials)",
    "cuota",
    "traducción qosProfile",
    "QoD, Device Location Verification, Simple Edge Discovery"
   ],
   "ubicacion": "delante del NEF (ubicación física no indicada)",
   "cantidad": 1,
   "redundancia": null,
   "como_se_implementa": "Nokia NEP (modelo por fijar)",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2",
     "v7": false
    }
   ],
   "equipos": [
    "NEP-CAMARA"
   ],
   "v7": [
    {
     "k": "Open Gateway",
     "v": "Pasarela CAMARA delante del NEF (Nokia NEP planificado, modelo por fijar); QoD, Device Location Verification, Simple Edge Discovery; OAuth 2.0/OIDC",
     "seccion": "6.8"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con una petición QoD si la pasarela CAMARA no está disponible?",
     "en": "What happens to a QoD request if the CAMARA gateway is unavailable?"
    },
    {
     "es": "¿Qué datos del operador expone cada API y cómo se protegen?",
     "en": "Which operator data does each API expose, and how is it protected?"
    }
   ],
   "reglas": []
  },
  {
   "id": "EDGE",
   "nombre": "Emplazamiento Edge",
   "capa": "F",
   "funciones": [
    "UPF local + MEC"
   ],
   "ubicacion": "Edge-Centro, Edge-Este, Edge-Sur, adjuntos a su nodo metro (no tránsito); una única acometida Metro–Edge",
   "cantidad": 3,
   "redundancia": "N−1 entre Edge: Centro→Este; Este, Sur y privada→Centro; DC no es destino",
   "como_se_implementa": "servidores Dell R760/R760xa + 4 L40S; 24/7/3 servidores",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6, §8.2 tabla 11",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 8, 28",
     "v7": false
    }
   ],
   "equipos": [
    "SRV-R760XA",
    "SRV-R760"
   ],
   "v7": [
    {
     "k": "Edge-Centro",
     "v": "24 Dell R760xa (4 L40S); recurso dominante GPU: ceil(90/4)+1; carga DL/UL 164,69 / 93,75 Gbit/s; NIC normal 406,12 Gbit/s; acometida local única, capacidad no especificada",
     "seccion": "6.7.2; 6.7.3; 6.7.4; 6.7.5"
    },
    {
     "k": "Edge-Este",
     "v": "7 Dell R760xa (dimensionado como receptor de Edge-Centro; 21 GPU → 6 útiles + 1); carga DL/UL 0,04 / 0,04 Gbit/s; NIC normal 0,14 Gbit/s; acometida local única, capacidad no especificada",
     "seccion": "6.7.2; 6.7.5; A10"
    },
    {
     "k": "Edge-Sur",
     "v": "3 Dell R760 (RAM: ceil(512/480)+1); carga DL/UL 0,59 / 0,80 Gbit/s; NIC normal 2,18 Gbit/s; acometida local única, capacidad no especificada",
     "seccion": "6.7.2; 6.7.5; A11.7"
    },
    {
     "k": "Servidor tipo",
     "v": "224 vCPU instalados (216 asignables, 108 por NUMA), 512 GB (480), RAID10 15,36 TB (12,288 al 80 %), hasta 4 L40S en R760xa (100 cámaras/GPU a 20 fps), NIC UPF 2×ConnectX-6 Dx 2×100GbE = 400 Gbit/s por sentido",
     "seccion": "6.7.5"
    },
    {
     "k": "Recuperación",
     "v": "≤5 s servicios críticos; ≤60 s estadio (KPI MEC)",
     "seccion": "6.7.3"
    },
    {
     "k": "Sin Edge Norte",
     "v": "No se identificó servicio de baja latencia que lo requiera (3.1.2)",
     "seccion": "3.1.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "EDGE-CENTRO",
     "EDGE-ESTE",
     "EDGE-SUR"
    ],
    "enlaces": [
     "L-EDGECENTRO-METC",
     "L-EDGEESTE-METE",
     "L-EDGESUR-METS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso fija el número de servidores en cada Edge (CPU, RAM, GPU, NIC) y por qué es distinto en cada uno?",
     "en": "Which resource sets the server count in each Edge (CPU, RAM, GPU, NIC), and why does it differ?"
    },
    {
     "es": "Si se corta la única acometida Metro–Edge, ¿qué servicios se pierden y quién debería activar el respaldo?",
     "en": "If the single Metro–Edge feed is cut, which services are lost and who should trigger the backup?"
    },
    {
     "es": "¿Por qué no hay Edge en Norte?",
     "en": "Why is there no Edge in the North?"
    }
   ],
   "reglas": [
    "Servidores Edge"
   ]
  },
  {
   "id": "UPF-LOCAL",
   "nombre": "UPF local pública",
   "capa": "F",
   "funciones": [
    "Local Breakout por DNN"
   ],
   "ubicacion": "Edge-Centro (evento, video-ciudad), Edge-Este (v2x), Edge-Sur (salud)",
   "cantidad": "2 instancias por Edge",
   "redundancia": "respaldo en otro Edge",
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3 tabla 7",
     "v7": false
    },
    {
     "doc": "Trazabilidad_interna_Memoria_2_1.xlsx",
     "seccion": "A3.9",
     "v7": false
    }
   ],
   "equipos": [
    "UPF-EDGE"
   ],
   "v7": [
    {
     "k": "Edge-Centro",
     "v": "2 públicas + 2 privadas en hot-standby para Sur; base 32 vCPU",
     "seccion": "6.7.4"
    },
    {
     "k": "Edge-Este",
     "v": "2 públicas; base 16 vCPU",
     "seccion": "6.7.4"
    },
    {
     "k": "Edge-Sur",
     "v": "2 públicas + 2 privadas activas; base 32 vCPU",
     "seccion": "6.7.4"
    },
    {
     "k": "NIC Edge-Centro",
     "v": "2 UPF públicas × NIC 200G = 400G frente a 406,12G requeridos (cota conservadora); carga normal 71,07 % de esas NIC",
     "seccion": "6.7.5"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "EDGE-CENTRO",
     "EDGE-ESTE",
     "EDGE-SUR"
    ],
    "enlaces": [
     "L-EDGECENTRO-METC",
     "L-EDGEESTE-METE",
     "L-EDGESUR-METS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso fija el número de servidores en cada Edge (CPU, RAM, GPU, NIC) y por qué es distinto en cada uno?",
     "en": "Which resource sets the server count in each Edge (CPU, RAM, GPU, NIC), and why does it differ?"
    },
    {
     "es": "Si se corta la única acometida Metro–Edge, ¿qué servicios se pierden y quién debería activar el respaldo?",
     "en": "If the single Metro–Edge feed is cut, which services are lost and who should trigger the backup?"
    },
    {
     "es": "¿Por qué no hay Edge en Norte?",
     "en": "Why is there no Edge in the North?"
    }
   ],
   "reglas": [
    "UPF CPU",
    "Servidores Edge"
   ]
  },
  {
   "id": "UPF-PRIV",
   "nombre": "UPF privada dedicada (PNI-NPN)",
   "capa": "F",
   "funciones": [
    "N3 privado terminado directamente",
    "N6 solo a DN industrial (VRF propia, sin Internet)"
   ],
   "ubicacion": "Edge-Sur",
   "cantidad": "2 activas en Edge-Sur + 2 en reserva caliente en Edge-Centro",
   "redundancia": "reserva caliente en Edge-Centro (recuperación ≤5 s)",
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3, §6.3",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ],
   "equipos": [
    "UPF-EDGE",
    "SRV-R760"
   ],
   "v7": [
    {
     "k": "Red privada",
     "v": "Piloto 330 dispositivos (100 personas, 200 sensores, 20 cámaras, 10 AGV) → 0,070/0,160 BH; 0,0875/0,200 con 25 %; AGV 2 Mbit/s UL (0,2 control n28 + 1,8 n78)",
     "seccion": "6.3.5"
    },
    {
     "k": "Redundancia",
     "v": "SMF lógico dedicado, VRF propio sin salida a Internet; respaldo UPF privada en Edge-Centro; ≤5 s; 0 paquetes entre VRF",
     "seccion": "6.3.5"
    },
    {
     "k": "QoS",
     "v": "AGV 5QI 82, 0,2 Mbit/s, ARP 3; cámaras 5QI 71, 5 Mbit/s UL, ARP 6",
     "seccion": "6.3.5"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "EDGE-SUR"
    ],
    "enlaces": [
     "L-EDGESUR-METS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Cómo comprobaríais que no pasa ningún paquete entre la VRF industrial y la pública?",
     "en": "How would you verify that no packet crosses between the industrial VRF and the public one?"
    },
    {
     "es": "¿Qué le pasa a un AGV durante los segundos de conmutación a Edge-Centro?",
     "en": "What happens to an AGV during the seconds of switchover to Edge-Centre?"
    }
   ],
   "reglas": [
    "UPF CPU"
   ]
  },
  {
   "id": "MEC-APP",
   "nombre": "Aplicaciones MEC",
   "capa": "F",
   "funciones": [
    "estadio (caché/vídeo)",
    "analítica cámaras",
    "V2X V2N",
    "hospital",
    "industria"
   ],
   "ubicacion": "Edge-Centro/Este/Sur",
   "cantidad": null,
   "redundancia": "respaldo entre Edge con capacidad reducida",
   "como_se_implementa": "OpenShift",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3–6.5",
     "v7": false
    }
   ],
   "equipos": [
    "SRV-R760XA"
   ],
   "v7": [
    {
     "k": "Estadio Metropolitano (Connected Stadium)",
     "v": "Edge-Centro (respaldo Edge-Este al 60 %) · 50.000 usuarios activos × 2,635/1,420 Mbit/s → 131,75/71,0 Gbit/s BH; 164,6875/88,75 con 25 %",
     "seccion": "3.3.1; 4.2; 4.3; 6.2.7; 6.3.1; A6; A7; A9"
    },
    {
     "k": "Hospital Universitario de Getafe",
     "v": "Edge-Sur (respaldo Edge-Centro) · 100 videoconsultas × 4 Mbit/s, 40 cámaras × 2 UL, 100 sensores × 0,02 UL → 0,400/0,482 BH; 0,500/0,6025 con 25 %",
     "seccion": "3.3.1; 4.3; 6.2.7; 6.3.2; A8"
    },
    {
     "k": "Carretera conectada A-2 (V2X)",
     "v": "Edge-Este (respaldo Edge-Centro, +0,28 ms) · 1.000 vehículos, CAM 300 B a 10 Hz, ×1,5 overhead → 0,036/0,036 BH; 0,045/0,045 con 25 %",
     "seccion": "3.3.1; 4.3; 6.3.3; A.2 A3–A4"
    },
    {
     "k": "Smart City Valdebebas",
     "v": "Cámaras Edge-Centro (respaldo Edge-Este); sensores UPF central · 5.000 cámaras × 0,8 Mbit/s → 5,0 Gbit/s UL con 25 %; 80.000 sensores cada 900 s + 15.000 cada 60 s → 0,002142 Gbit/s UL",
     "seccion": "3.3.1; 6.2.7; 6.3.4; 6.5.3; 6.7.5; A8"
    },
    {
     "k": "Red privada 5G logística e industria (PNI-NPN tipo A)",
     "v": "UPF privada dedicada en Edge-Sur (respaldo en Edge-Centro, hot standby) · Piloto 330 dispositivos (100 personas, 200 sensores, 20 cámaras, 10 AGV) → 0,070/0,160 BH; 0,0875/0,200 con 25 %; AGV 2 Mbit/s UL (0,2 control n28 + 1,8 n78)",
     "seccion": "3.3.1; 4.3; 6.3.5; 6.5.3; A9"
    },
    {
     "k": "Respaldo N−1 Estadio",
     "v": "Edge-Centro → Edge-Este (60 %); P95 4.1 ms",
     "seccion": "6.7.3"
    },
    {
     "k": "Respaldo N−1 Cámaras Smart City",
     "v": "Edge-Centro → Edge-Este (100 % flujos y grabación; 30 % analítica (≤1.500 cámaras)); P95 6.2 (peor radio 9.7) ms",
     "seccion": "6.7.3"
    },
    {
     "k": "Respaldo N−1 V2X A-2",
     "v": "Edge-Este → Edge-Centro (continuidad); P95 5.8 ms",
     "seccion": "6.7.3"
    },
    {
     "k": "Respaldo N−1 Hospital",
     "v": "Edge-Sur → Edge-Centro (continuidad del servicio crítico); P95 7.5 (app 3 ms); 9.5 (app 5 ms) ms",
     "seccion": "6.7.3"
    },
    {
     "k": "Respaldo N−1 Privada 5G",
     "v": "Edge-Sur → Edge-Centro (UPF privada de respaldo y aislamiento); P95 3.6 ms",
     "seccion": "6.7.3"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "EDGE-CENTRO",
     "EDGE-ESTE",
     "EDGE-SUR"
    ],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué recurso fija el número de servidores en cada Edge (CPU, RAM, GPU, NIC) y por qué es distinto en cada uno?",
     "en": "Which resource sets the server count in each Edge (CPU, RAM, GPU, NIC), and why does it differ?"
    },
    {
     "es": "Si se corta la única acometida Metro–Edge, ¿qué servicios se pierden y quién debería activar el respaldo?",
     "en": "If the single Metro–Edge feed is cut, which services are lost and who should trigger the backup?"
    },
    {
     "es": "¿Por qué no hay Edge en Norte?",
     "en": "Why is there no Edge in the North?"
    }
   ],
   "reglas": [
    "Servidores Edge"
   ]
  },
  {
   "id": "DN-INDUSTRIAL",
   "nombre": "Red de datos industrial",
   "capa": "G",
   "funciones": [
    "destino del tráfico de la red privada"
   ],
   "ubicacion": "no indicada",
   "cantidad": 1,
   "redundancia": null,
   "como_se_implementa": "VRF propia con filtrado en N6, sin Internet",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3",
     "v7": false
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-INDUSTRIA-SUR"
    ],
    "enlaces": [
     "L-SITEINDUSTRIASUR-METSUR"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué destinos debe poder alcanzar la red industrial y cuáles nunca?",
     "en": "Which destinations must the industrial network reach, and which never?"
    }
   ],
   "reglas": []
  },
  {
   "id": "PE-L2VPN",
   "nombre": "PE de L2VPN (EVPN)",
   "capa": "G",
   "funciones": [
    "UNI 10 GbE por sede",
    "instancia EVPN por organización"
   ],
   "ubicacion": "Metro-Centro (2 PE, multihoming), Metro-Norte/Este/Sur (1 PE)",
   "cantidad": 4,
   "redundancia": "LSP secundario + FRR",
   "como_se_implementa": "router de agregación del nodo metro",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.2",
     "v7": false
    }
   ],
   "equipos": [
    "PE-METRO-7750"
   ],
   "v7": [
    {
     "k": "Sedes",
     "v": "Sedes: URJC Alcorcón (Metro-S), Univ. de Alcalá (Metro-E), Ayto. Alcobendas (Metro-N, por confirmar), UPM Ciudad Universitaria (Metro-C, por confirmar); alternativas Tres Cantos y Ayto. Madrid [HYP]",
     "seccion": "6.9"
    },
    {
     "k": "Demanda",
     "v": "No calculada; UNI 10 GbE como cota, 40 Gbit/s total; carga por vano no derivada de la suma de UNI",
     "seccion": "6.9"
    },
    {
     "k": "Redundancia",
     "v": "LSP secundario + FRR; un PE por sede (multihoming en Centro sujeto a duplicar router Metro-Centro)",
     "seccion": "6.9"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-L2VPN-CENTRO",
     "SITE-L2VPN-NORTE",
     "SITE-L2VPN-ESTE",
     "SITE-L2VPN-SUR"
    ],
    "enlaces": [
     "L-SITEL2VPNCENTRO-METCENTRO",
     "L-SITEL2VPNNORTE-METNORTE",
     "L-SITEL2VPNESTE-METESTE",
     "L-SITEL2VPNSUR-METSUR"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Cuánta carga de L2VPN pondríais en cada vano si la v7 no la deriva?",
     "en": "How much L2VPN load would you put on each span, given v7 does not derive it?"
    },
    {
     "es": "Con un solo PE por sede, ¿qué pasa si cae ese PE?",
     "en": "With a single PE per site, what happens if that PE fails?"
    }
   ],
   "reglas": []
  },
  {
   "id": "HUB-SAT",
   "nombre": "Hub de satélite",
   "capa": "G",
   "funciones": [
    "pasarela del servicio satélite"
   ],
   "ubicacion": "Arganda",
   "cantidad": 1,
   "redundancia": null,
   "como_se_implementa": "OneWeb (diap. 20, 31); backhaul por verificar",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2 tabla 4",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 31",
     "v7": false
    }
   ],
   "equipos": [
    "SAT-LEO"
   ],
   "v7": [
    {
     "k": "Satélite",
     "v": "OneWeb LEO con hub en Arganda; backhaul del hub por verificar",
     "seccion": "6.11"
    },
    {
     "k": "Capacidad",
     "v": "≥100/20 Mbit/s por terminal; conmutación ≤60 s",
     "seccion": "6.11"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "IX-ONEWEB"
    ],
    "enlaces": [
     "L-IXONEWEB-CORE1"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué servicios tienen sentido por satélite con ≥100/20 Mbit/s por terminal y cuáles no?",
     "en": "Which services make sense over satellite at ≥100/20 Mbit/s per terminal, and which do not?"
    },
    {
     "es": "¿Qué falta por definir del hub de Arganda para poder contar con él en un fallo?",
     "en": "What is still undefined about the Arganda hub before it can be relied on in a failure?"
    }
   ],
   "reglas": []
  },
  {
   "id": "SECGW",
   "nombre": "Security Gateway (SEG)",
   "capa": "H",
   "funciones": [
    "IPsec en N2 y N3"
   ],
   "ubicacion": "por fijar con 2.2",
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1, §11.3",
     "v7": false
    }
   ],
   "equipos": [
    "SEG-PERIMETRO"
   ],
   "v7": [
    {
     "k": "Estado",
     "v": "Solo como función (IPsec N2/N3); sin modelo",
     "seccion": "5.1.2; 6.13"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Dónde colocaríais el SecGW y qué latencia añade el IPsec en N3?",
     "en": "Where would you place the SecGW, and what latency does IPsec on N3 add?"
    },
    {
     "es": "¿Qué ataque cubre el anti-DDoS en N6 y cuál no?",
     "en": "Which attack does N6 anti-DDoS cover, and which not?"
    }
   ],
   "reglas": []
  },
  {
   "id": "PKI",
   "nombre": "PKI propia",
   "capa": "H",
   "funciones": [
    "mTLS y OAuth 2.0 entre NF"
   ],
   "ubicacion": null,
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1 tabla 18",
     "v7": false
    }
   ],
   "equipos": [
    "SEG-PERIMETRO"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Dónde colocaríais el SecGW y qué latencia añade el IPsec en N3?",
     "en": "Where would you place the SecGW, and what latency does IPsec on N3 add?"
    },
    {
     "es": "¿Qué ataque cubre el anti-DDoS en N6 y cuál no?",
     "en": "Which attack does N6 anti-DDoS cover, and which not?"
    }
   ],
   "reglas": []
  },
  {
   "id": "SIEM",
   "nombre": "SIEM",
   "capa": "H",
   "funciones": [
    "detección ≤60 s, contención ≤15 min"
   ],
   "ubicacion": null,
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1 tabla 18",
     "v7": false
    }
   ],
   "equipos": [
    "SEG-PERIMETRO"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Dónde colocaríais el SecGW y qué latencia añade el IPsec en N3?",
     "en": "Where would you place the SecGW, and what latency does IPsec on N3 add?"
    },
    {
     "es": "¿Qué ataque cubre el anti-DDoS en N6 y cuál no?",
     "en": "Which attack does N6 anti-DDoS cover, and which not?"
    }
   ],
   "reglas": []
  },
  {
   "id": "FW-ANTIDDOS",
   "nombre": "Cortafuegos y anti-DDoS en N6",
   "capa": "H",
   "funciones": [
    "protección de la salida N6"
   ],
   "ubicacion": null,
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": null,
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1 tabla 18",
     "v7": false
    }
   ],
   "equipos": [
    "SEG-PERIMETRO"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Dónde colocaríais el SecGW y qué latencia añade el IPsec en N3?",
     "en": "Where would you place the SecGW, and what latency does IPsec on N3 add?"
    },
    {
     "es": "¿Qué ataque cubre el anti-DDoS en N6 y cuál no?",
     "en": "Which attack does N6 anti-DDoS cover, and which not?"
    }
   ],
   "reglas": []
  },
  {
   "id": "OSS-BSS",
   "nombre": "OSS/BSS y red de gestión",
   "capa": "H",
   "funciones": [
    "inventario, aprovisionamiento, telemetría (ARCO12)",
    "red de gestión separada"
   ],
   "ubicacion": null,
   "cantidad": null,
   "redundancia": null,
   "como_se_implementa": "modelo de Dirección, no desarrollado por 2.1",
   "tipo": "elemento",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§3 tabla 3 (ARCO12); §11",
     "v7": false
    },
    {
     "doc": "2026-11-10_Acta.pdf",
     "seccion": "§3.2",
     "v7": false
    }
   ],
   "equipos": [
    "GESTION-NMS"
   ],
   "v7": [
    {
     "k": "Modelo",
     "v": "OSS/BSS por funciones ARCO12 (telemetría ≤1 min, escalado ≤5/≤15 min)",
     "seccion": "7.2"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué alarmas necesitaría un operador para detectar en ≤60 s un corte de vano?",
     "en": "Which alarms would an operator need to detect a span cut in ≤60 s?"
    },
    {
     "es": "¿Qué parte de la gestión debería ir por una red separada y por qué?",
     "en": "Which part of management should run on a separate network, and why?"
    }
   ],
   "reglas": []
  },
  {
   "id": "CDN-TV",
   "nombre": "CDN / TV",
   "capa": "H",
   "tipo": "equipo",
   "funciones": [],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    }
   ],
   "equipos": [
    "CDN-TV"
   ],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Dónde pondríais las cabeceras de IPTV/CDN y qué tráfico ahorraría en el anillo?",
     "en": "Where would you place IPTV/CDN heads, and how much ring traffic would that save?"
    }
   ],
   "reglas": []
  },
  {
   "id": "EXT-INTERNET",
   "nombre": "Internet / IXP",
   "capa": "G",
   "tipo": "externo",
   "funciones": [
    "peering y tránsito BGP"
   ],
   "ubicacion": "routers de borde de los DC; punto físico del IXP no indicado",
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "5.1.1; 5.2",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "IX-INTERNET"
    ],
    "enlaces": [
     "L-CORE1-IXINTERNET",
     "L-CORE2-IXINTERNET",
     "L-CORE3-IXINTERNET"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Cómo dimensionaríais la salida a Internet si la v7 no da Gbit/s de IX?",
     "en": "How would you size the Internet exit when v7 gives no IX Gbit/s?"
    },
    {
     "es": "¿Qué pasa con el tráfico de Internet si cae el router de borde de un DC?",
     "en": "What happens to Internet traffic if one DC's border router fails?"
    }
   ],
   "reglas": []
  },
  {
   "id": "EXT-IMS",
   "nombre": "Otro operador IMS",
   "capa": "G",
   "tipo": "externo",
   "funciones": [
    "interconexión de voz IMS–IMS"
   ],
   "ubicacion": "frontera IMS (IBCF + TrGW); ubicación no indicada",
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "6.6.1",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "IX-IMS"
    ],
    "enlaces": [
     "L-CORE1-IXIMS",
     "L-CORE2-IXIMS",
     "L-CORE3-IXIMS"
    ],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué cambia entre el SBC integrado y uno especializado a la hora de dimensionar?",
     "en": "What changes in sizing between an integrated SBC and a specialised one?"
    },
    {
     "es": "¿Cómo pasaríais de 973,72 CAPS a Gbit/s de media hacia el otro operador?",
     "en": "How would you go from 973.72 CAPS to media Gbit/s towards the other operator?"
    }
   ],
   "reglas": []
  },
  {
   "id": "EXT-APPS",
   "nombre": "Apps de terceros (Open Gateway)",
   "capa": "G",
   "tipo": "externo",
   "funciones": [
    "consumen APIs CAMARA"
   ],
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "6.8",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con una petición QoD si la pasarela CAMARA no está disponible?",
     "en": "What happens to a QoD request if the CAMARA gateway is unavailable?"
    },
    {
     "es": "¿Qué datos del operador expone cada API y cómo se protegen?",
     "en": "Which operator data does each API expose, and how is it protected?"
    }
   ],
   "reglas": []
  },
  {
   "id": "EXT-SEDES",
   "nombre": "Sedes de empresa (L2VPN)",
   "capa": "G",
   "tipo": "externo",
   "funciones": [
    "UNI 10 GbE"
   ],
   "ubicacion": "UNI en PE de Metro-Centro (UPM), Metro-Norte (Ayto. Alcobendas), Metro-Este (Univ. Alcalá), Metro-Sur (URJC Alcorcón)",
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "6.9",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [],
   "v7_corrige": {},
   "red": {
    "nodos": [
     "SITE-L2VPN-CENTRO",
     "SITE-L2VPN-NORTE",
     "SITE-L2VPN-ESTE",
     "SITE-L2VPN-SUR"
    ],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Cuánta carga de L2VPN pondríais en cada vano si la v7 no la deriva?",
     "en": "How much L2VPN load would you put on each span, given v7 does not derive it?"
    },
    {
     "es": "Con un solo PE por sede, ¿qué pasa si cae ese PE?",
     "en": "With a single PE per site, what happens if that PE fails?"
    }
   ],
   "reglas": []
  },
  {
   "id": "HUECO-C",
   "nombre": "Agregación / backhaul",
   "capa": "C",
   "tipo": "hueco",
   "funciones": [],
   "ubicacion": "no especificado en v7",
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "6.7.3; A.2 A1",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [
    {
     "k": "Lo único que dice la v7",
     "v": "No hay split ni fronthaul. Backhaul: solo transporte de acceso modelado como 20 km y 4 saltos (≈0,3 ms) y TR-02/TR-10 piden doble camino. Capa de agregación sin equipos.",
     "seccion": "6.7.3; A.2 A1"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "Sin capa de agregación definida, ¿qué capacidad y protección supone el modelo de 20 km y 4 saltos?",
     "en": "With no defined aggregation layer, what capacity and protection does the 20 km / 4-hop model assume?"
    },
    {
     "es": "¿Qué gNB u OLT críticos deberían tener doble conexión a dos nodos Metro?",
     "en": "Which critical gNBs or OLTs should be dual-homed to two Metro nodes?"
    }
   ],
   "reglas": []
  },
  {
   "id": "HUECO-SYNC",
   "nombre": "Sincronización PTP / SyncE / GNSS",
   "capa": "H",
   "tipo": "hueco",
   "funciones": [],
   "ubicacion": "no especificado en v7",
   "fuente": [
    {
     "doc": "Memoria conjunta v7",
     "seccion": "7.1.1; 7.2.1",
     "v7": true
    }
   ],
   "equipos": [],
   "v7": [
    {
     "k": "Lo único que dice la v7",
     "v": "Solo una fila en la matriz de fallos: 'GNSS loss → reference clock in ≥2 DCs and holdover; no interruption; PASS si fase ≤±1,5 µs'. TR-06 (pérdida de sincronización → la celda TDD desfasada se bloquea). Sin grandmaster, perfil PTP ni SyncE.",
     "seccion": "7.1.1; 7.2.1"
    }
   ],
   "v7_corrige": {},
   "red": {
    "nodos": [],
    "enlaces": [],
    "nota": null
   },
   "preguntas": [
    {
     "es": "¿Qué pasa con una celda TDD si pierde la referencia de fase y quién se la daría?",
     "en": "What happens to a TDD cell if it loses its phase reference, and who would provide it?"
    },
    {
     "es": "¿Qué elementos de la red necesitarían PTP o SyncE y cuáles no?",
     "en": "Which network elements would need PTP or SyncE, and which not?"
    }
   ],
   "reglas": []
  }
 ],
 "equipos": {
  "RAD-N28": {
   "id": "RAD-N28",
   "rol": "gNB macro FDD 700 MHz (cobertura macro y rural, corredor A-2, cuota crítica AGV)",
   "capa": "A",
   "fabricante": "Nokia",
   "modelo": "AirScale AHPB Single 4T4R B28/n28 320 W (CONDICIONADO a confirmar con Nokia; ficha en copia no oficial, nivel C)",
   "cantidad": {
    "valor": null,
    "nota": "Nº de emplazamientos lo fija 3.1: A-2 = 7 sitios en normal, ~10 propuestos para N−1. Resto de la región sin cifra en las fuentes 2.2."
   },
   "capacidad": "FDD 2×10 MHz, SCS 15 kHz; 4×80 W = 49,0 dBm/puerto, 55,05 dBm total; PIRE 69,5 dBm (objetivo 64 dBm, +5,5 dB); NF 5 dB; radio UL A-2 ≈3,89 km",
   "puertos": "4T4R; Tx 758–803 MHz, Rx 703–748 MHz",
   "interfaces": [
    "Uu NR n28",
    "N2 (al AMF, vía backhaul)",
    "N3 (a UPF, vía backhaul)"
   ],
   "protocolos": [
    "5G NR SA"
   ],
   "redundancia": "Sin redundancia de equipo; continuidad A-2 por solape de sitios: con 7 sitios NO cumple N−1 (RIESGO SCOM06)",
   "como_se_conecta": [
    {
     "con": "Antena pasiva sectorial 65° 16 dBi (p. ej. CommScope 4P-4L-C2, modelo por fijar)",
     "interfaz": "RF (latiguillo 1,5 dB)",
     "velocidad": null
    },
    {
     "con": "Router PE Metro (7750 SR) / agregación RAN",
     "interfaz": "backhaul N2/N3",
     "velocidad": "no especificada en fuentes 2.2"
    }
   ],
   "alternativas": [
    {
     "modelo": "Ericsson Radio",
     "motivo": "Alternativa considerada; se elige AirScale (afinidad con baseline Nokia); band-SKU y MIMO bajo validación 3.1"
    },
    {
     "modelo": "Nokia AWHQA 4×40 W (versión 24/10)",
     "motivo": "No encaja con una macro 4T4R; sustituida por AHPB 4×80 W"
    },
    {
     "modelo": "Samsung (radio)",
     "motivo": "Comparado en tabla de baseline sin motivo detallado"
    }
   ],
   "dimensionado": {
    "formula": "PIRE = P_cond_total + G_ant − pérdidas",
    "valores": "55,05 dBm + 16 dBi − 1,5 dB",
    "resultado": 69.5,
    "unidad": "dBm",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§2.1 Tabla 3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§2.1 Tabla 3; Tabla 1 (cambios)",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline (RAN) y §6, p.1–2 y p.6",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    }
   ],
   "v7": {
    "estado": "parcial",
    "texto": "La v7 elige Nokia macro para n28; el modelo AHPB 4T4R de 2.2 no figura en la v7.",
    "seccion": "5.1.2"
   }
  },
  "RAD-N78": {
   "id": "RAD-N78",
   "rol": "gNB Massive MIMO TDD 3,5 GHz (capacidad urbana; hospital; vídeo industrial)",
   "capa": "A",
   "fabricante": "Nokia",
   "modelo": "AirScale MAA 64T64R 192AE n78 200 W (AEQU/AEQE)",
   "cantidad": {
    "valor": null,
    "nota": "Sin recuento global. Hospital: 15 sectores equivalentes; 20–24 RRH indoor por doble cadena (pendiente 3.1)."
   },
   "capacidad": "TDD 100 MHz (OBW), IBW 200 MHz, SCS 30 kHz; 200 W = 53,01 dBm; 24,5 dBi; PIRE 77,5 dBm (objetivo 76 dBm); 16 flujos MIMO; NF 5 dB",
   "puertos": "64T64R; 3480–3800 MHz",
   "interfaces": [
    "Uu NR n78",
    "N2",
    "N3"
   ],
   "protocolos": [
    "5G NR SA",
    "TDD (patrón por fijar con 3.1; DDDSU ~20 % UL)"
   ],
   "redundancia": "Hospital: doble cadena radio (20–24 RRH) propuesta, no validada",
   "como_se_conecta": [
    {
     "con": "Router PE Metro / agregación RAN",
     "interfaz": "backhaul N2/N3",
     "velocidad": "no especificada"
    }
   ],
   "alternativas": [
    {
     "modelo": "Nokia Habrok AEQQ/AEQR 320 W, PIRE 79,5 dBm",
     "motivo": "Códigos sin fuente; PIRE verificada en FCC/ficha es 77,5 dBm. Habrok 64 queda como evolución"
    },
    {
     "modelo": "Ericsson AIR",
     "motivo": "Alternativa comparada; se mantiene Nokia"
    }
   ],
   "dimensionado": {
    "formula": "PIRE = P_total + G_array",
    "valores": "53,01 dBm + 24,5 dBi",
    "resultado": 77.5,
    "unidad": "dBm",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§2.2 Tabla 4",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§2.2 Tabla 4",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline y §6 p.6",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12 (cita Habrok 64TRX como candidato)",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Nokia macro 64T64R MAA: EIRP 77,5 dBm, Rx 24,5 dBi, NF 5 dB; SKU exacto pendiente (Habrok no aparece).",
    "seccion": "5.1.2; 6.2.2"
   }
  },
  "RAD-N258": {
   "id": "RAD-N258",
   "rol": "Small cell mmWave 26 GHz (Estadio Metropolitano, densidad extrema)",
   "capa": "A",
   "fabricante": "Nokia",
   "modelo": "Shikra (referencia de prestaciones: AirScale mmWave n258 AWGUC/D y AWKUC/D)",
   "cantidad": {
    "valor": 265,
    "unidad": "sectores equivalentes a 400 MHz",
    "nota": "265 sectores equivalentes NO son 265 radios físicas; nº físico pendiente de layout 3.1. Evolución: 133 sectores eq. solo con 800 MHz (8×100 MHz)"
   },
   "capacidad": "TDD 400 MHz base, SCS 120 kHz; PIRE 60 dBm (margen 0 dB); 8×8 elementos, 23 dBi; P_cond ≈37 dBm; NF 10 dB; radio ≈37 m (UL manda)",
   "puertos": null,
   "interfaces": [
    "Uu NR n258",
    "N2",
    "N3"
   ],
   "protocolos": [
    "5G NR SA FR2"
   ],
   "redundancia": "No definida",
   "como_se_conecta": [
    {
     "con": "Agregación RAN / Metro-Centro → UPF Edge-Centro",
     "interfaz": "N3",
     "velocidad": "no especificada"
    }
   ],
   "alternativas": [
    {
     "modelo": "Alternativas indoor neutral host",
     "motivo": "Selección depende de cobertura del estadio y sistema existente"
    },
    {
     "modelo": "Configuración 2×400 MHz",
     "motivo": "No confirmada como producto; alternativa homologada es 8×100 MHz"
    }
   ],
   "dimensionado": {
    "formula": "Sectores = demanda estadio / capacidad sector (3.1)",
    "valores": "50.000 activos; 131,75/71,00 Gbit/s antes de reserva",
    "resultado": 265,
    "unidad": "sectores equivalentes",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§6 p.6",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§2.3 Tabla 5",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§6 p.6",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    },
    {
     "doc": "02_Cambios_y_Traspasos_a_Grupos_13nov_r2.pdf",
     "seccion": "§1 fila 3.1 (EN CURSO)",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "mmWave Shikra para n258; 265 sectores eq. a 400 MHz en el estadio.",
    "seccion": "5.1.2; 6.3.1"
   }
  },
  "RAD-INDOOR-HOSP": {
   "id": "RAD-INDOOR-HOSP",
   "rol": "Sistema radio indoor del hospital (n78)",
   "capa": "A",
   "fabricante": "Nokia",
   "modelo": "ASiR (citado como «Elección ASiR»; sin SKU)",
   "cantidad": {
    "valor": "20–24",
    "unidad": "RRH",
    "nota": "Por doble cadena; 15 sectores eq. son screening (pendiente 3.1)"
   },
   "capacidad": null,
   "puertos": null,
   "interfaces": [
    "Uu NR n78"
   ],
   "protocolos": [
    "5G NR"
   ],
   "redundancia": "Dos cadenas radio independientes (propuesta)",
   "como_se_conecta": [],
   "alternativas": [],
   "dimensionado": {
    "formula": null,
    "valores": null,
    "resultado": "20–24 RRH",
    "unidad": "RRH",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§6 p.6",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§6 tabla radio, p.6",
     "v7": false
    },
    {
     "doc": "02_Cambios_y_Traspasos_a_Grupos_13nov_r2.pdf",
     "seccion": "§1 fila 3.1 Hospital",
     "v7": false
    },
    {
     "doc": "02_Matriz_28_Requisitos_y_Pruebas_13nov_r2.pdf",
     "seccion": "§1 SCOM05",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Nokia ASiR pRRH AWHQA en 2 cadenas A/B × 10 = 20 pico-RRH (24 si las cámaras van por radio).",
    "seccion": "6.3.2"
   }
  },
  "RAD-BBU": {
   "id": "RAD-BBU",
   "rol": "Banda base gNB (DU/CU) y ng-eNB NB-IoT/LTE-M",
   "capa": "A",
   "fabricante": null,
   "modelo": null,
   "cantidad": null,
   "capacidad": null,
   "puertos": null,
   "interfaces": [
    "F1/fronthaul (no definido)",
    "N2",
    "N3"
   ],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§5.1 Tabla 7 (ng-eNB/N3 por validar)",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.5",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "Banda base del gNB sin modelo; sin split RAN ni fronthaul.",
    "seccion": "5.1.2; 6.7.3"
   }
  },
  "OLT-MF14": {
   "id": "OLT-MF14",
   "rol": "OLT XGS-PON / 25G-PON de alta densidad",
   "capa": "B",
   "fabricante": "Nokia",
   "modelo": "Lightspan MF-14 (tarjetas LT de 16 puertos GPON/XGS-PON/25GS-PON/50G-PON sin código; NT LBNT-A; uplink LTIO-B)",
   "cantidad": {
    "valor": 4,
    "unidad": "chasis (solo Alcorcón)",
    "nota": "2 centrales lógicas × 2 chasis × 10 LT = 40 LT; resto de municipios sin dimensionar en 2.2"
   },
   "capacidad": "Chasis 19\", 15 RU, 14 slots LT (deducido del nombre, nivel C); LBNT-A 200 Gb/s por chasis (lectura conservadora); XGS-PON ~10 Gbit/s compartido por sentido",
   "puertos": "Por chasis: hasta 14 LT × 16 = 224 PON teóricos (NO confirmado instalable); equipado 10 LT = 160 PON; uplink LTIO-B 4×100GE",
   "interfaces": [
    "XGS-PON (G.9807.1) clase N2 31 dB",
    "25GS-PON (sedes >10G)",
    "100GE uplink (LTIO-B)"
   ],
   "protocolos": [
    "XGS-PON",
    "25GS-PON",
    "Ethernet"
   ],
   "redundancia": "Active/Active NT; 2 centrales ≠ protección 1+1; sin doble ascenso a dos Metro (P5 pendiente 2.1)",
   "como_se_conecta": [
    {
     "con": "ONT/HGW (vía ODN splitters 1:4 + 1:16)",
     "interfaz": "XGS-PON",
     "velocidad": "10 Gbit/s compartido por PON"
    },
    {
     "con": "Router PE Metro-Sur → BNG (7750 SR-2se) lado acceso",
     "interfaz": "100GE (LTIO-B)",
     "velocidad": "4×100GE por chasis"
    },
    {
     "con": "Nokia Altiplano",
     "interfaz": "gestión",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Huawei MA5800-X17",
     "motivo": "Comparado; se elige MF-14 (sin motivo detallado más allá de baseline Nokia)"
    },
    {
     "modelo": "Adtran SDX 6400",
     "motivo": "Comparado; no elegido"
    },
    {
     "modelo": "Chasis Lightspan compacto / multivendor",
     "motivo": "Posible mejor ajuste municipal; requiere ficha"
    },
    {
     "modelo": "Tarjeta FGLT-B (versión 24/10)",
     "motivo": "Es de ISAM FX, no de Lightspan"
    }
   ],
   "dimensionado": {
    "formula": "N_PON = ceil((accesos/split) × 1,25 / 0,70); LT = ceil(N_PON/16); chasis = centrales × 2",
    "valores": "ceil((22.353/64) × 1,25 / 0,70) = 624 PON; 624/16 = 39 → 40 LT (20 por central); 2 centrales × 2 chasis × 10 LT",
    "resultado": {
     "PON": 624,
     "LT": 40,
     "chasis": 4
    },
    "unidad": "PON / tarjetas / chasis",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§3 Tabla 6",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§3 Tabla 6",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.1 Tabla 11",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline (FTTH) y §6",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1 Tabla 16",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "MF-14 solo en Alcorcón: 4 chasis, 40 LT, 624 PON, 2 centrales lógicas. Las tarjetas LTIO-B/FGLT-B no figuran en la v7.",
    "seccion": "6.1.1; 5.1.2"
   }
  },
  "ODN-SPLIT": {
   "id": "ODN-SPLIT",
   "rol": "Splitters ópticos ODN (cascada 1:4 + 1:16 = 1:64)",
   "capa": "B",
   "fabricante": null,
   "modelo": "Pasivo genérico 1:4 + 1:16",
   "cantidad": {
    "valor": 3120,
    "unidad": "splitters (Alcorcón)",
    "nota": "HIP 2.1, pendiente de balance ODN"
   },
   "capacidad": "Pérdida ≈21 dB; presupuesto ODN ≈29,5 dB frente a 31 dB N2 → margen ≈1,5 dB",
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "dimensionado": {
    "formula": "Pérdida = splitters + fibra + conectores",
    "valores": "21 + 20 km×0,35 + 1,5",
    "resultado": 29.5,
    "unidad": "dB",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§3 Tabla 6",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1 Tabla 16",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§3 Tabla 6",
     "v7": false
    }
   ],
   "v7": {
    "estado": "parcial",
    "texto": "La v7 solo da límites N2 (20 km / 31 dB) y 148 Mbit/s por PON; el presupuesto ODN de 29,5 dB no figura.",
    "seccion": "6.1.1"
   }
  },
  "ONT-HGW": {
   "id": "ONT-HGW",
   "rol": "Terminal de cliente FTTH con VoIP (cliente SIP registrado en IMS)",
   "capa": "B",
   "fabricante": null,
   "modelo": null,
   "cantidad": {
    "valor": null,
    "nota": "619.611 accesos fijos 2031 (una sesión BNG por acceso, nivel D)",
    "inferido": true
   },
   "capacidad": null,
   "puertos": null,
   "interfaces": [
    "XGS-PON",
    "SIP/Gm hacia P-CSCF"
   ],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§2.2 Tabla 1 y §4.1",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§4.2",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "ONT/HGW sin fabricante ni modelo.",
    "seccion": "5.1.2"
   }
  },
  "PE-METRO-7750": {
   "id": "PE-METRO-7750",
   "rol": "Router de agregación / PE IP/MPLS de nodo Metro (RSVP-TE, FRR, EVPN)",
   "capa": "D",
   "fabricante": "Nokia",
   "modelo": "7750 SR (familia candidata; modelo concreto no fijado)",
   "cantidad": {
    "valor": 4,
    "unidad": "routers (1 por nodo Metro)",
    "nota": "Duplicar el de Metro-Centro es propuesta pendiente de 2.1 (no adoptada)"
   },
   "capacidad": "Interfaces 100/400G; FRR <50 ms objetivo",
   "puertos": {
    "valor": {
     "Metro-Centro": 24,
     "Metro-Norte": 20,
     "Metro-Este": 12,
     "Metro-Sur": 14
    },
    "unidad": "puertos 400GE de anillo+acometidas",
    "inferido": true,
    "nota": "Suma de miembros LAG de §5.1 por nodo: C = C–N 6 + S–C 6 + C–DC-Centro 6 + C–DC-Sur 6; N = 6+4+6+4; E = 4+4+4; S = 4+6+4. Sin contar Edge, OLT ni RAN"
   },
   "interfaces": [
    "400GE (LAG por tramo, cada miembro = 1 λ del 1830 PSS)",
    "10GE UNI L2VPN sedes",
    "enlaces a Edge local",
    "100GE hacia OLT/RAN"
   ],
   "protocolos": [
    "IP/MPLS",
    "RSVP-TE (21 pares, 42 LSP, secundario SRLG-disjunto)",
    "FRR facility backup (20 bypass NHOP)",
    "BFD",
    "LACP (802.1AX) min-links N−1",
    "EVPN E-LAN (RFC 7432)",
    "MPLS TC TC0a–TC3"
   ],
   "redundancia": "Protección IP: FRR por tramo y acometida; sin router duplicado salvo propuesta Metro-Centro. La caída de un nodo Metro aísla su zona (RIESGO FAL-06)",
   "como_se_conecta": [
    {
     "con": "Nokia 1830 PSS (λ 400G)",
     "interfaz": "400GE gris/coherente por λ",
     "velocidad": "400 Gbit/s por miembro"
    },
    {
     "con": "Router DC (core IP/MPLS)",
     "interfaz": "LAG 400GE acometida",
     "velocidad": "1.600–2.400 Gbit/s"
    },
    {
     "con": "Edge local (UPF/MEC)",
     "interfaz": "adjunto local (no extremo de LSP del anillo)",
     "velocidad": "no especificada"
    },
    {
     "con": "Sedes L2VPN (UPM, Alcobendas, U. Alcalá, URJC)",
     "interfaz": "UNI 10GE",
     "velocidad": "10 Gbit/s por sede"
    }
   ],
   "alternativas": [
    {
     "modelo": "Juniper MX",
     "motivo": "Alternativa multivendor; 7750 SR por afinidad Nokia"
    },
    {
     "modelo": "SR-MPLS con TI-LFA (mecanismo)",
     "motivo": "Se elige RSVP-TE por redacción del KPI «TE, FRR y protección»; SR queda como evolución"
    },
    {
     "modelo": "Enlaces TE por λ (en vez de LAG)",
     "motivo": "Todas las λ del tramo comparten SRLG; multiplica adyacencias y limita LSP a 400G"
    },
    {
     "modelo": "VPLS / Carrier Ethernet puro (L2VPN)",
     "motivo": "Sin multihoming activo-activo / sin TE ni FRR"
    }
   ],
   "dimensionado": {
    "formula": "canales_400G = ceil(1,10 × carga_sentido / (400 × u)), u=0,70 normal, 0,90 fallo/pico",
    "valores": "C–N: 1.714,23×1,10 = 1.885,65 Gbit/s sobre LAG 6×400 = 2.400 → 78,57 %; C–DC-Centro: 1.939,92×1,10 = 2.133,91 → 88,91 % (1,1 pt de margen)",
    "resultado": "Ring 6/4/4/6; acometidas 6 (C–DCC, N–DCN, C–DCS) y 4 (N–DCC, E–DCN, S–DCS)",
    "unidad": "×400GE",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§5.1 tabla LAG p.4; §5 p.3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§5.1–5.3 p.4–5",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.2 Tabla 11, §8.5, §10.2",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Nokia 7750 SR, un router de agregación por nodo Metro [HYP]; duplicar Metro-Centro es propuesta. Alternativa: Juniper MX.",
    "seccion": "6.4.1; 6.4.2"
   }
  },
  "WDM-1830PSS": {
   "id": "WDM-1830PSS",
   "rol": "Capa óptica DWDM/OTN del anillo Metro y acometidas DC",
   "capa": "D",
   "fabricante": "Nokia",
   "modelo": "1830 PSS (familia candidata; tarjetas/transpondedores sin fijar)",
   "cantidad": {
    "valor": {
     "lambdas_400G_anillo": 20,
     "lambdas_400G_acometidas": 30
    },
    "inferido": true,
    "nota": "Referencia 6/4/4/6 (= 20 λ) + acometidas 6+6+6+4+4+4 (= 30 λ). Transpondedores = 2 por λ (no demostrado: la fuente dice que los canales no demuestran por sí solos un número de transpondedores)"
   },
   "capacidad": "λ de 400G; tramos C–N 20 km, N–E 28, E–S 38, S–C 16 (≈102 km, estimación ×1,4); pérdidas 6,0/8,0/10,5/5,0 dB",
   "puertos": null,
   "interfaces": [
    "λ 400G punto a punto por tramo (opción B)"
   ],
   "protocolos": [
    "DWDM banda C (rejilla 100 GHz si se confirma)",
    "OTN"
   ],
   "redundancia": "Sin protección óptica 1+1 presupuesta; protección en capa IP (FRR). Plan 2 enlaces × 7 λ por tramo = hipótesis pendiente",
   "como_se_conecta": [
    {
     "con": "7750 SR (PE Metro / DC)",
     "interfaz": "puerto 400GE por λ",
     "velocidad": "400 Gbit/s"
    }
   ],
   "alternativas": [
    {
     "modelo": "Ciena Waveserver",
     "motivo": "Alternativa multivendor"
    },
    {
     "modelo": "Opción A: ROADM con λ de paso",
     "motivo": "Acumula OSNR; queda como evolución"
    },
    {
     "modelo": "6/2/4/3 ×400G (mínimo 3.2)",
     "motivo": "Descartada provisionalmente por 2.1: N–E 123,43 % con corte C–N"
    },
    {
     "modelo": "6/3/4/3 ×400G",
     "motivo": "En evaluación, no seleccionada como referencia"
    }
   ],
   "dimensionado": {
    "formula": "canales = ceil(1,10 × carga / (400 × u))",
    "valores": "cargas máx. 3.2: C–N 1.714,23; N–E 460,06; E–S 1.005,46; S–C 856,95 Gbit/s",
    "resultado": "6/4/4/6 referencia conservadora (3.2 mínimo 6/2/4/3)",
    "unidad": "λ×400G",
    "fuente": [
     {
      "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
      "seccion": "§8.4 Tabla 12; §9.3 Tabla 15",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§5 y §5.1 p.3–4",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.2 Tabla 11; §9",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Nokia 1830 PSS, opción B punto a punto por vano; alternativa Ciena Waveserver. OSNR y modo de línea pendientes.",
    "seccion": "6.4.1"
   }
  },
  "BNG-7750-SR2SE": {
   "id": "BNG-7750-SR2SE",
   "rol": "BNG-UP: terminación de sesiones FTTH (IPoE/PPPoE), CUPS",
   "capa": "E",
   "fabricante": "Nokia",
   "modelo": "7750 SR-2se (FP5, 2 slots, 5 RU, 36 Tb/s; tarjeta XMA2-s 6 Tb/s)",
   "cantidad": {
    "valor": 10,
    "unidad": "chasis",
    "reparto": {
     "DC-Centro": 5,
     "DC-Norte": 1,
     "DC-Sur": 4
    },
    "detalle": "Activos: 3 DC-Centro (Centro), 1 DC-Norte (Norte+½Este), 1 DC-Sur (Sur+½Este). Respaldo: 3 en DC-Sur (de Centro), 1+1 en DC-Centro (de Norte y de Sur)"
   },
   "capacidad": "774.515 sesiones (+25 %); 2.885 Gbit/s DL / 320,5 UL total; límite provisional 256.000 sesiones por BNG-UP (regla E8 Dirección, nivel D); ≥650 sesiones/s de reconexión",
   "puertos": {
    "DC-Centro (por chasis activo)": "3×400G red + 12×100G acceso (59 %)",
    "DC-Norte": "1×400G + 4×100G (54 %)",
    "DC-Sur": "2×400G + 8×100G (69 %)",
    "sensibilidad pico ×2": "Centro y Sur 4×400G+16×100G; Norte 2×400G+8×100G",
    "nota": "Puertos de los chasis de respaldo georredundante no detallados (inferido: idénticos al activo que respaldan)"
   },
   "interfaces": [
    "400GE lado red (core IP/MPLS / anillo WDM)",
    "100GE lado acceso (OLT LTIO-B vía Metro)"
   ],
   "protocolos": [
    "IPoE",
    "PPPoE",
    "CUPS (MAG-c)",
    "redundancia multi-chasis con sincronización de estado de abonado"
   ],
   "redundancia": "1:1 entre chasis en reserva caliente, respaldo georredundante en otro DC (r2 13/11). Soporte multi-chasis exacto en SR-2se y licencia por confirmar",
   "como_se_conecta": [
    {
     "con": "OLT Lightspan MF-14 (vía PE Metro)",
     "interfaz": "100GE",
     "velocidad": "12/4/8 ×100G por chasis activo"
    },
    {
     "con": "Core IP/MPLS / routers de borde del DC",
     "interfaz": "400GE",
     "velocidad": "3/1/2 ×400G por chasis activo"
    },
    {
     "con": "BNG-CP (MAG-c virtualizado en 3 DC)",
     "interfaz": "CUPS",
     "velocidad": null
    },
    {
     "con": "P-CSCF (IMS) para voz fija",
     "interfaz": "IP (ruta OLT→metro→BNG→P-CSCF)",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Reparto 6/2/2 con 1+1 en el mismo DC (versión 10/11 y verificación 29/10)",
     "motivo": "La caída del DC dejaba sin servicio fijo a la zona (riesgo FAL-05)"
    },
    {
     "modelo": "Un BNG por nodo Metro / BNG en Este",
     "motivo": "No ahorra anillo (el tráfico sale por core/borde en DC); añadiría 2 chasis y un 4.º emplazamiento"
    }
   ],
   "dimensionado": {
    "formula": "sesiones = accesos × 1,25; chasis_activos = ceil(sesiones_zona / 256.000); cap_min = tráfico_chasis / 0,70; puertos = menor nº de 400G ≥ cap_min; acceso = misma capacidad en 100G",
    "valores": "619.611 × 1,25 = 774.515; Centro 567.898 / 3 = 189.300 (74 %); 2.115/3 = 705 Gbit/s → 705/0,70 = 1.007 → 3×400G (2×400 = 800 no basta); Norte 112+105 ≈ 217 → 310 → 1×400G; Sur 447+105 ≈ 552 → 789 → 2×400G",
    "resultado": {
     "chasis": 10,
     "activos": 5,
     "respaldo": 5
    },
    "unidad": "chasis",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§4.2–4.5 Tablas 7–8",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline; §5.4 p.6",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§4 Tablas 7–9",
     "v7": false
    },
    {
     "doc": "02_Cambios_y_Traspasos_a_Grupos_13nov_r2.pdf",
     "seccion": "§1 fila 2.1 ACTUALIZAR; §2",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "10 chasis 7750 SR-2se, respaldo georredundante 1:1 (DC-C 3+2, DC-N 1+0, DC-S 1+3).",
    "seccion": "6.10.1; 5.1.2"
   }
  },
  "BNG-CP-MAGC": {
   "id": "BNG-CP-MAGC",
   "rol": "Plano de control BNG (CUPS) virtualizado",
   "capa": "E",
   "fabricante": "Nokia",
   "modelo": "MAG-c (SR OS, virtualizado)",
   "cantidad": {
    "valor": 3,
    "unidad": "DC",
    "nota": "Nº de instancias no dado"
   },
   "capacidad": null,
   "puertos": null,
   "interfaces": [],
   "protocolos": [
    "CUPS"
   ],
   "redundancia": "En los 3 DC; puede reasignar sesiones al BNG-UP superviviente si la OLT tiene uplinks a dos DC",
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§4 párrafo inicial y §4.1",
     "v7": false
    }
   ],
   "v7": {
    "estado": "no_v7",
    "texto": "CUPS/MAG-c no figura en la v7.",
    "seccion": "—"
   }
  },
  "IMS-CNCS": {
   "id": "IMS-CNCS",
   "rol": "Núcleo IMS convergente (P/I/S-CSCF, TAS, MRF) para voz fija y VoNR",
   "capa": "E",
   "fabricante": "Nokia",
   "modelo": "Cloud Native Communication Suite (CNCS) 25.7 sobre Red Hat OpenShift (CNF única)",
   "cantidad": {
    "valor": 3,
    "unidad": "DC activos",
    "nota": "Nº de CNF/contenedores no inferible sin benchmark"
   },
   "capacidad": "Requisito por DC (N−1): ≥1.014.292 legs y ≥902 CAPS; carga global 1.460.579 legs, 1.298,29 CAPS, SIP 18.284 msg/s (tormenta 24.776); ~48 % carga normal y ~72 % tras caer un DC. Capacidad por instancia NO publicada",
   "puertos": null,
   "interfaces": [
    "Gm (SIP, vía UPF N6 / BNG)",
    "N5 (P-CSCF como AF ↔ PCF)",
    "Ici/Izi (vía IBCF/TrGW)",
    "Cx/Sh hacia HSS (no detallado)"
   ],
   "protocolos": [
    "SIP",
    "RTP",
    "Diameter (inferido)"
   ],
   "redundancia": "3 DC activo-activo, capacidad N−1 preinstalada, réplica de estado, afinidad/anti-afinidad de pods",
   "como_se_conecta": [
    {
     "con": "PCF (Nokia 5GC)",
     "interfaz": "N5",
     "velocidad": null
    },
    {
     "con": "UPF central (medios/señalización móvil)",
     "interfaz": "N6",
     "velocidad": "medios voz ≈186,95 Gbit/s/sentido global (no atraviesa CSCF)"
    },
    {
     "con": "BNG (voz fija)",
     "interfaz": "IP",
     "velocidad": null
    },
    {
     "con": "IBCF/TrGW",
     "interfaz": "SIP / Ix (H.248)",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Ericsson Cloud Native IMS",
     "motivo": "Alternativa A comparable; requiere benchmark con misma unidad y carga"
    },
    {
     "modelo": "Mavenir Cloud-Native IMS",
     "motivo": "Alternativa B; sin cifra verificable por clúster"
    },
    {
     "modelo": "Huawei IMS / Single Voice Core",
     "motivo": "Alternativa C; documentación homologada pendiente; no atribuir 2.000 CAPS sin fuente"
    },
    {
     "modelo": "Open5GS + IMS de laboratorio",
     "motivo": "Útil para PoC, no carrier-grade"
    },
    {
     "modelo": "Ericsson Dual-mode 5G Core como IMS",
     "motivo": "No es producto IMS"
    },
    {
     "modelo": "MGCF/SGW/IMS-MGW (interconexión CS)",
     "motivo": "Instrucción docente: sin CS, 100 % IMS"
    }
   ],
   "dimensionado": {
    "formula": "legs/DC = ceil[1,25 × 2A / (2 × 0,90)]; CAPS/DC = ceil[1,25 × 1,6A/900 / (2 × 0,90)]",
    "valores": "A = 730.289,52 Erl (2.434.298 líneas × 0,3); 2A = 1.460.579; 1,6A/900 = 1.298,29",
    "resultado": {
     "legs_DC": 1014292,
     "CAPS_DC": 902
    },
    "unidad": "legs / CAPS por DC",
    "fuente": [
     {
      "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
      "seccion": "§2 Tabla 2",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§2, §3 Tabla 3, §4 Tabla 5",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2, §3 p.2",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§6 Tablas 12–13",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "CNCS elegido en la comparativa de candidatos por subsistema.",
    "seccion": "5.1.2"
   }
  },
  "HSS-IMS": {
   "id": "HSS-IMS",
   "rol": "HSS (dominio IMS, separado de UDM)",
   "capa": "E",
   "fabricante": null,
   "modelo": null,
   "cantidad": {
    "valor": 3,
    "unidad": "DC"
   },
   "capacidad": "Partición ≥1.690.486 registros/DC o réplica completa ≥3.042.874/DC (2.434.298 registros IMS)",
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": "Réplica entre DC (LSP DC↔DC para replicación de estado)",
   "como_se_conecta": [],
   "alternativas": [],
   "dimensionado": {
    "formula": "1,25 × N_IMS / (2 × 0,90) (partición); 1,25 × N_IMS (réplica)",
    "valores": "N_IMS = 2.434.298",
    "resultado": {
     "particion": 1690486,
     "replica": 3042874
    },
    "unidad": "registros/DC",
    "fuente": [
     {
      "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
      "seccion": "§2 párrafo N−1",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§3 p.2",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§6 Tabla 13 (productos por seleccionar)",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "HSS sin modelo; solo dimensionado.",
    "seccion": "6.6.2"
   }
  },
  "SBC-IBCF-TRGW": {
   "id": "SBC-IBCF-TRGW",
   "rol": "Frontera de interconexión IMS–IMS (IBCF señalización Ici, TrGW medios Izi)",
   "capa": "G",
   "fabricante": "Nokia (baseline 17/11) / Ribbon (verificación 29/10)",
   "modelo": "SBC integrado en CNCS (baseline provisional del informe 17/11; Ribbon SBC SWe solo si el integrado no cubre requisito)",
   "cantidad": {
    "valor": null,
    "nota": "Variante Ribbon SBC SWe (29/10): 13 instancias de 32 vCPU por DC (416 vCPU/DC)"
   },
   "capacidad": "Carga global 973,72 establecimientos/s externos (876.347,42 Erl); ≥608.575 sesiones SBC por DC (N−1). Ribbon: 49.500 sesiones y 550 CPS por instancia 32 vCPU (cae ~10× con transcodificación)",
   "puertos": null,
   "interfaces": [
    "Ici (SIP)",
    "Izi (RTP)",
    "Ix (H.248) IBCF–TrGW"
   ],
   "protocolos": [
    "SIP",
    "RTP",
    "H.248"
   ],
   "redundancia": "Diversidad física por SBC/TrGW y DC de borde (a definir)",
   "como_se_conecta": [
    {
     "con": "IMS de otro operador",
     "interfaz": "Ici/Izi",
     "velocidad": "medios externos ≈112 Gbit/s/sentido global (inferido: 1,2A × 128 kbit/s)"
    },
    {
     "con": "IMS-CNCS (CSCF)",
     "interfaz": "SIP",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Ribbon SBC SWe dedicado",
     "motivo": "Añade proveedor/CNF; sesiones/s y RTP pendientes; solo si demuestra requisito no cubierto (informe 17/11)"
    },
    {
     "modelo": "MGCF/IMS-MGW hacia CS",
     "motivo": "Sin interconexión CS"
    }
   ],
   "dimensionado": {
    "formula": "sesiones_DC = 1,25 × 1,2A / (2 × 0,90); instancias = ceil(sesiones_DC / 49.500)",
    "valores": "1,25 × 876.347 / 1,8 ≈ 608.575; 608.575 / 49.500 = 12,3 → 13",
    "resultado": 13,
    "unidad": "instancias Ribbon SWe por DC (variante 29/10)",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§6 Tablas 12–13",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§2.1 y §3.1 Tabla 4",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline (Borde IMS) p.2",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§6 Tabla 13",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §11.1 Tabla 18 (Ribbon SBC SWe)",
     "v7": false
    }
   ],
   "v7": {
    "estado": "abierto",
    "texto": "Sin modelo único: 5.1.2 'SBC carrier-grade, Ribbon candidato'; 6.13 'Ribbon SBC SWe'; 13 instancias/DC.",
    "seccion": "5.1.2; 6.6.2; 6.13"
   }
  },
  "5GC-NOKIA": {
   "id": "5GC-NOKIA",
   "rol": "5G Core SA: AMF, SMF, PCF, NRF, NSSF, NEF, AUSF (plano de control en DC)",
   "capa": "E",
   "fabricante": "Nokia",
   "modelo": "Nokia 5G Core (SKU/CNF exactas por confirmar) sobre OpenShift",
   "cantidad": {
    "valor": 3,
    "unidad": "DC activos"
   },
   "capacidad": "4 slices: eMBB (1,000001), URLLC (2,000002), mMTC (3,000003), privado industrial (2,000101)",
   "puertos": null,
   "interfaces": [
    "N1/N2 (AMF)",
    "N4 (SMF–UPF)",
    "N5 (PCF–P-CSCF)",
    "SBI",
    "N33/Nnef (NEF)"
   ],
   "protocolos": [
    "3GPP SBA (HTTP/2)",
    "PFCP",
    "NGAP"
   ],
   "redundancia": "3 DC activo-activo, N−1 (50 % por DC)",
   "como_se_conecta": [
    {
     "con": "gNB",
     "interfaz": "N2",
     "velocidad": null
    },
    {
     "con": "UPF central y Edge",
     "interfaz": "N4",
     "velocidad": null
    },
    {
     "con": "IMS P-CSCF",
     "interfaz": "N5",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Ericsson Dual-mode 5GC / CCRC (NRF/NSSF)",
     "motivo": "Comparación equivalente; se elige Nokia por afinidad con IMS/RAN"
    }
   ],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§5 Tabla 6, §5.1 Tabla 7",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline (5GC + slicing)",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §5",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "5GC Nokia elegido en la comparativa por subsistema.",
    "seccion": "5.1.2"
   }
  },
  "UDM": {
   "id": "UDM",
   "rol": "UDM/AUSF (dominio 5GC, separado de HSS)",
   "capa": "E",
   "fabricante": null,
   "modelo": null,
   "cantidad": {
    "valor": 3,
    "unidad": "DC"
   },
   "capacidad": "Partición 1.239.300/DC o réplica 2.230.739/DC (incluye 100.000 IoT)",
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "dimensionado": {
    "formula": null,
    "valores": null,
    "resultado": {
     "particion": 1239300,
     "replica": 2230739
    },
    "unidad": "abonados/DC",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§3 p.2",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§3 p.2",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§6 Tabla 13 (productos por seleccionar)",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "UDM sin modelo; solo dimensionado.",
    "seccion": "6.6.2"
   }
  },
  "UPF-CENTRAL": {
   "id": "UPF-CENTRAL",
   "rol": "UPF central (Internet móvil, VoNR/ims, 95.000 sensores mMTC)",
   "capa": "E",
   "fabricante": "Nokia (UPF CNF) sobre Dell",
   "modelo": "Nokia 5GC UPF sobre Dell PowerEdge R760",
   "cantidad": {
    "valor": 9,
    "unidad": "servidores R760 (3 por DC, propuesta 2.2 CONDICIONADA)",
    "variante_3.2": "4 por DC = 12"
   },
   "capacidad": "Carga total 398,20 DL / 111,89 UL Gbit/s (+25 %); en fallo por DC 162 vCPU, ≈646 GB RAM; rendimiento supuesto 2,0 Gbit/s y 0,75 Mpps por vCPU (IMIX, nivel C)",
   "puertos": "Dos NIC dobles por servidor (N3/N6 SR-IOV) [2.2]; 3.2: NIC un puerto/lado",
   "interfaces": [
    "N3",
    "N4",
    "N6",
    "N9 (no obligatorio)"
   ],
   "protocolos": [
    "GTP-U",
    "PFCP",
    "DPDK/SR-IOV"
   ],
   "redundancia": "N+1 por DC; reparto 1/3 normal, 1/2 si cae un DC",
   "como_se_conecta": [
    {
     "con": "gNB (vía Metro/anillo)",
     "interfaz": "N3",
     "velocidad": null
    },
    {
     "con": "Internet / IMS",
     "interfaz": "N6",
     "velocidad": null
    },
    {
     "con": "SMF",
     "interfaz": "N4",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Benchmark NEC 640 Gbit/s (5 Gbit/s/hilo a 800 B)",
     "motivo": "No es Nokia ni R760; se mantiene 2 Gbit/s/vCPU conservador"
    }
   ],
   "dimensionado": {
    "formula": "servidores = ceil(RAM_fallo / 480 GB) + 1",
    "valores": "ceil(646/480) + 1",
    "resultado": 3,
    "unidad": "servidores/DC",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§4.1 p.3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§4 y §4.1 p.2–3",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3 Tabla 7",
     "v7": false
    },
    {
     "doc": "02_Cambios_y_Traspasos_a_Grupos_13nov_r2.pdf",
     "seccion": "§1 filas 3.2",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "3 Dell R760 por DC (2 útiles por RAM + 1 de reserva), 2 instancias públicas.",
    "seccion": "6.7.4"
   }
  },
  "NEP-CAMARA": {
   "id": "NEP-CAMARA",
   "rol": "Exposición de red: NEF + pasarela API CAMARA (Open Gateway)",
   "capa": "H",
   "fabricante": "Nokia",
   "modelo": "Network Exposure Function / Network Exposure Platform (NEP) + API gateway (Network as Code como agregación)",
   "cantidad": {
    "valor": null,
    "nota": "Capacidad sin dato (E11)"
   },
   "capacidad": "3 APIs: Quality on Demand, Device Location (Retrieval [2.2] / Verification [2.1]), Simple Edge Discovery (no figura en primera versión NEP)",
   "puertos": null,
   "interfaces": [
    "Northbound REST CAMARA",
    "Nnef_AFsessionWithQoS",
    "Npcf_PolicyAuthorization (vía BSF)"
   ],
   "protocolos": [
    "OAuth2/OIDC (CIBA, client credentials)",
    "HTTP/2 SBI"
   ],
   "redundancia": null,
   "como_se_conecta": [
    {
     "con": "PCF/BSF",
     "interfaz": "Npcf",
     "velocidad": null
    },
    {
     "con": "AMF/SMF",
     "interfaz": "SBI",
     "velocidad": null
    }
   ],
   "alternativas": [
    {
     "modelo": "Ericsson Dual-mode NEF",
     "motivo": "Comparación equivalente"
    },
    {
     "modelo": "APIs directas sobre NEF sin pasarela",
     "motivo": "Autenticación/cuota/traducción QoS en un punto (2.1)"
    }
   ],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§5 Tabla 6, §5.2 Tabla 8",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§6 Tabla 13",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Nokia NEP planificado, modelo por fijar.",
    "seccion": "6.8"
   }
  },
  "CAAS-OPENSHIFT": {
   "id": "CAAS-OPENSHIFT",
   "rol": "Plataforma CaaS para CNF (IMS, 5GC, UPF, MEC)",
   "capa": "H",
   "fabricante": "Red Hat",
   "modelo": "OpenShift 4.16/4.18 (Telco Core Reference Design)",
   "cantidad": {
    "valor": null,
    "nota": "3 DC ≠ automáticamente 3 clusters; segmentación etcd/storage/red por detallar"
   },
   "capacidad": null,
   "puertos": null,
   "interfaces": [],
   "protocolos": [
    "Kubernetes",
    "SR-IOV",
    "DPDK"
   ],
   "redundancia": "Réplicas CNF, anti-afinidad, workers, geo-DC",
   "como_se_conecta": [],
   "alternativas": [
    {
     "modelo": "Kubernetes genérico autogestionado",
     "motivo": "Sin matriz de soporte CNCS"
    },
    {
     "modelo": "VNF clásica / appliance",
     "motivo": "No baseline para CNCS (comparativa ARCO15)"
    }
   ],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§4 Tabla 5",
     "v7": false
    },
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2 tabla baseline; §7",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§5.1 Tabla 10",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Decisión CNF sobre OpenShift.",
    "seccion": "5.1.2; 6.12"
   }
  },
  "SRV-R760XA": {
   "id": "SRV-R760XA",
   "rol": "Servidor MEC con GPU (analítica vídeo, estadio, respaldo)",
   "capa": "F",
   "fabricante": "Dell",
   "modelo": "PowerEdge R760xa con 4× NVIDIA L40S (48 GB, 350 W)",
   "cantidad": {
    "valor": 31,
    "unidad": "servidores (propuesta 2.2: Centro 24 + Este 7)",
    "variante_3.2": "Centro 24 + Este 9 = 33"
   },
   "capacidad": "Por servidor: 2× Xeon Platinum 8480+ (224 vCPU nominales / 216 asignables, 108 por NUMA); RAM 512 GB (480 asignables); 8×3,84 TB NVMe RAID10 = 15,36 TB (12,29 al 80 %); 1 L40S por 100 cámaras a 20 fps",
   "puertos": "NIC NVIDIA Mellanox ConnectX-6 Dx 2×100GbE (SR-IOV/DPDK)",
   "interfaces": [
    "N3",
    "N6",
    "N9"
   ],
   "protocolos": [
    "SR-IOV",
    "DPDK"
   ],
   "redundancia": "N+1 por Edge; respaldo entre Edge (Centro→Este 60 % estadio, 100 % grabación, 30 % analítica)",
   "como_se_conecta": [
    {
     "con": "PE Metro local",
     "interfaz": "2×100GbE",
     "velocidad": "200 Gbit/s por servidor"
    }
   ],
   "alternativas": [
    {
     "modelo": "HPE ProLiant DL380a",
     "motivo": "Alternativa B; configuración y benchmark por aplicación"
    },
    {
     "modelo": "Dell R760 con 4 GPU (versión 24/10)",
     "motivo": "R760 solo admite 2 GPU doble anchura"
    }
   ],
   "dimensionado": {
    "formula": "GPU = cámaras_eq / 100 / 0,70; servidores = ceil(GPU/4) + 1",
    "valores": "6.250 / 100 / 0,70 ≈ 90 GPU; ceil(90/4) + 1 = 24 (Centro). Este: máx(CPU, RAM, GPU, disco) + N+1 → 7 (914 vCPU; 2.484 GB; 21 GPU; ≈67 TB)",
    "resultado": {
     "Edge-Centro": 24,
     "Edge-Este": 7
    },
    "unidad": "servidores",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§4.1 p.3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2, §4, §4.1",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§5.1 Tabla 10; §5.3",
     "v7": false
    },
    {
     "doc": "02_Cambios_y_Traspasos_a_Grupos_13nov_r2.pdf",
     "seccion": "§1 filas 2.1/3.2/Dirección",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "Parque fijado por Dirección el 14/11: 24 R760xa en Edge-Centro y 7 en Edge-Este (4 L40S).",
    "seccion": "2.5; 6.7.5"
   }
  },
  "SRV-R760": {
   "id": "SRV-R760",
   "rol": "Servidor MEC/UPF sin GPU (Edge-Sur hospital+industria; UPF central DC)",
   "capa": "F",
   "fabricante": "Dell",
   "modelo": "PowerEdge R760 (2U, 2 sockets, 32 DIMM DDR5, 8 PCIe)",
   "cantidad": {
    "valor": 12,
    "unidad": "servidores (2.2: Edge-Sur 3 + UPF central 3×3)",
    "variante_3.2": "Edge-Sur 3 + 4×3 = 15"
   },
   "capacidad": "Igual CPU/RAM/disco/NIC que R760xa, sin GPU (máx. 2 GPU doble anchura)",
   "puertos": "ConnectX-6 Dx 2×100GbE; UPF central: dos NIC dobles",
   "interfaces": [
    "N3",
    "N6",
    "N4"
   ],
   "protocolos": [
    "SR-IOV",
    "DPDK"
   ],
   "redundancia": "N+1",
   "como_se_conecta": [
    {
     "con": "PE Metro-Sur / router DC",
     "interfaz": "100GbE",
     "velocidad": "2×100 Gbit/s por NIC"
    }
   ],
   "alternativas": [
    {
     "modelo": "HPE ProLiant DL380 Gen11",
     "motivo": "Alternativa B"
    },
    {
     "modelo": "Lenovo SR650",
     "motivo": "Comparado; no elegido"
    },
    {
     "modelo": "Servidor industrial/edge compacto",
     "motivo": "Alternativa C; capacidad a demostrar"
    }
   ],
   "dimensionado": {
    "formula": "servidores = ceil(RAM / 480 GB) + 1 (24 h); 30 días: ceil(145,8 TB / 12,29) + 1",
    "valores": "Edge-Sur 129 vCPU, 512 GB, 4,86 TB → ceil(512/480)+1 = 3; con 30 d → 13",
    "resultado": {
     "Edge-Sur_24h": 3,
     "Edge-Sur_30d": 13
    },
    "unidad": "servidores",
    "fuente": [
     {
      "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
      "seccion": "§4.1 p.3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "01_Solucion_Tecnica_2_2_13nov_r2.pdf",
     "seccion": "§2, §4.1",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§5.1 Tabla 10",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§6 Tabla 10",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "3 R760 en Edge-Sur y 3 R760 de UPF por DC.",
    "seccion": "2.5; 6.7.5"
   }
  },
  "UPF-EDGE": {
   "id": "UPF-EDGE",
   "rol": "UPF local pública (Centro, Este, Sur) y UPF privada dedicada (Sur, PNI-NPN tipo A)",
   "capa": "F",
   "fabricante": "Nokia",
   "modelo": "Nokia 5GC UPF (CNF) sobre los servidores Edge",
   "cantidad": {
    "valor": 4,
    "unidad": "instancias lógicas (3 públicas + 1 privada)"
   },
   "capacidad": "Cargas (+25 %): Edge-Centro 164,69/93,75; Edge-Este 0,045/0,045; Edge-Sur 0,500/0,6025; privada 0,0875/0,200 Gbit/s DL/UL. UPF Edge-Centro ≈158 vCPU",
   "puertos": null,
   "interfaces": [
    "N3",
    "N4",
    "N6 (VRF industrial sin salida Internet para la privada)"
   ],
   "protocolos": [
    "GTP-U",
    "PFCP"
   ],
   "redundancia": "Respaldo entre Edge: Este/Sur/privada → Centro; Centro → Este",
   "como_se_conecta": [],
   "alternativas": [],
   "dimensionado": {
    "formula": "vCPU = (Gbit/s × 1,10) / 2,0 + 16",
    "valores": "(258,44 × 1,10)/2,0 + 16",
    "resultado": 158,
    "unidad": "vCPU UPF Edge-Centro",
    "fuente": [
     {
      "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
      "seccion": "§5.3",
      "v7": false
     }
    ]
   },
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3 Tabla 7, §5.3",
     "v7": false
    },
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§5.1 Tabla 7; §6 Tabla 9",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§5.3",
     "v7": false
    }
   ],
   "v7": {
    "estado": "v7",
    "texto": "UPF Nokia CNF en los Edge: 2 públicas por Edge, 2 privadas en Sur y 2 en reserva caliente en Centro.",
    "seccion": "6.7.4; 6.7.5"
   }
  },
  "CDN-TV": {
   "id": "CDN-TV",
   "rol": "CDN / TV",
   "capa": "H",
   "fabricante": "Broadpeak (candidato)",
   "modelo": null,
   "cantidad": null,
   "capacidad": null,
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [
    {
     "modelo": "Alternativas CDN",
     "motivo": "Pendiente medición CDN e integración IMS/IPTV"
    }
   ],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    }
   ],
   "v7": {
    "estado": "no_v7",
    "texto": "Broadpeak no figura en la v7; IPTV/CDN sin dimensionar.",
    "seccion": "6.10.2"
   }
  },
  "SAT-LEO": {
   "id": "SAT-LEO",
   "rol": "Satélite táctico LEO de contingencia",
   "capa": "G",
   "fabricante": "OneWeb / Hughes (candidato)",
   "modelo": null,
   "cantidad": null,
   "capacidad": "Solo prioridades; NO respalda 131,75/71 Gbit/s del estadio; C/N y lluvia pendientes",
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2",
     "v7": false
    }
   ],
   "v7": {
    "estado": "parcial",
    "texto": "OneWeb LEO con hub en Arganda; OneWeb/Hughes como fabricante no figura.",
    "seccion": "6.11"
   }
  },
  "GESTION-NMS": {
   "id": "GESTION-NMS",
   "rol": "Gestión de red / NOC (ARCO12)",
   "capa": "H",
   "fabricante": "Nokia",
   "modelo": "Altiplano (acceso) + NSP (IP/óptica)",
   "cantidad": null,
   "capacidad": "Objetivos MTTD ≤60 s, MTTR ≤15 min (a ensayar)",
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [
    {
     "modelo": "OSS multi-fabricante",
     "motivo": "Alternativa; no elegida"
    }
   ],
   "fuente": [
    {
     "doc": "01_Informe_Tecnico_Seleccion_2_2.docx",
     "seccion": "§7.2 Tabla 12",
     "v7": false
    }
   ],
   "v7": {
    "estado": "no_v7",
    "texto": "Altiplano/NSP no figuran en la v7; la v7 da un modelo OSS/BSS por funciones.",
    "seccion": "7.2"
   }
  },
  "SEG-PERIMETRO": {
   "id": "SEG-PERIMETRO",
   "rol": "SecGW (IPsec N2/N3), cortafuegos y anti-DDoS en N6, SIEM/NWDAF",
   "capa": "H",
   "fabricante": null,
   "modelo": null,
   "cantidad": null,
   "capacidad": null,
   "puertos": null,
   "interfaces": [],
   "protocolos": [],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1 Tabla 18; §11.3",
     "v7": false
    },
    {
     "doc": "02_Matriz_28_Requisitos_y_Pruebas_13nov_r2.pdf",
     "seccion": "§1 ARCO16",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "SecGW, cortafuegos y SIEM sin modelo; solo como funciones.",
    "seccion": "5.1.2; 6.13"
   }
  },
  "ROUTER-BORDE": {
   "id": "ROUTER-BORDE",
   "rol": "Routers de borde para peering/tránsito BGP e IXP",
   "capa": "G",
   "fabricante": null,
   "modelo": null,
   "cantidad": null,
   "capacidad": null,
   "puertos": null,
   "interfaces": [],
   "protocolos": [
    "BGP"
   ],
   "redundancia": null,
   "como_se_conecta": [],
   "alternativas": [],
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    },
    {
     "doc": "Informe_Tecnico_Verificacion_Hardware_2.2_v2_ACTUALIZADO.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ],
   "v7": {
    "estado": "hueco",
    "texto": "Routers de borde sin modelo; salida a Internet sin dimensionar.",
    "seccion": "5.1.1; 5.2"
   }
  }
 },
 "interfaces": [
  {
   "id": "Uu",
   "entre": [
    "UE",
    "gNB"
   ],
   "pares": [
    [
     "UE",
     "gNB"
    ],
    [
     "UE",
     "gNB-indoor-hospital"
    ]
   ],
   "protocolo": "5G NR",
   "transporte": "radio n28/n78/n258",
   "descripcion": "Interfaz radio; el término 'Uu' no aparece en los documentos",
   "inferido": true,
   "nota": "Nombre normativo añadido; los documentos solo dan bandas.",
   "fuente": [
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 16",
     "v7": false
    }
   ]
  },
  {
   "id": "N1",
   "entre": [
    "UE",
    "AMF"
   ],
   "pares": [
    [
     "UE",
     "AMF"
    ]
   ],
   "protocolo": "NAS (cifrado)",
   "transporte": "vía gNB y N2",
   "descripcion": "Conexión lógica UE–AMF",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx",
     "seccion": "§2",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.1",
     "v7": false
    }
   ]
  },
  {
   "id": "N2",
   "entre": [
    "gNB",
    "AMF"
   ],
   "pares": [
    [
     "gNB",
     "AMF"
    ],
    [
     "ng-eNB",
     "AMF"
    ]
   ],
   "protocolo": "NGAP",
   "transporte": "IP/MPLS, IPsec con SecGW",
   "descripcion": "Control RAN–core (también ng-eNB→AMF)",
   "inferido": true,
   "nota": "Protocolo normativo 3GPP añadido; los documentos nombran la interfaz pero no el protocolo.",
   "fuente": [
    {
     "doc": "ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx",
     "seccion": "§2",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.5, §11.1",
     "v7": false
    }
   ]
  },
  {
   "id": "N3",
   "entre": [
    "gNB",
    "UPF-CENTRAL / UPF-LOCAL / UPF-PRIV"
   ],
   "pares": [
    [
     "gNB",
     "UPF-CENTRAL"
    ],
    [
     "gNB",
     "UPF-LOCAL"
    ],
    [
     "gNB",
     "UPF-PRIV"
    ]
   ],
   "protocolo": "GTP-U",
   "transporte": "IP/MPLS, IPsec con SecGW",
   "descripcion": "Plano de usuario; N3 privado termina directamente en la UPF privada de Edge-Sur",
   "inferido": true,
   "nota": "Protocolo normativo 3GPP añadido; los documentos nombran la interfaz pero no el protocolo.",
   "fuente": [
    {
     "doc": "ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx",
     "seccion": "§2, §3",
     "v7": false
    },
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3, §11.1",
     "v7": false
    }
   ]
  },
  {
   "id": "N4",
   "entre": [
    "SMF",
    "UPF"
   ],
   "pares": [
    [
     "SMF",
     "UPF-CENTRAL"
    ],
    [
     "SMF",
     "UPF-LOCAL"
    ],
    [
     "SMF-PRIV",
     "UPF-PRIV"
    ]
   ],
   "protocolo": "PFCP",
   "transporte": "IP/MPLS, clase TC0b",
   "descripcion": "Control de la UPF por la SMF (incluida la UPF privada desde la SMF dedicada)",
   "inferido": true,
   "nota": "Protocolo normativo 3GPP añadido; los documentos nombran la interfaz pero no el protocolo.",
   "fuente": [
    {
     "doc": "ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx",
     "seccion": "§2",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ]
  },
  {
   "id": "N6",
   "entre": [
    "UPF",
    "DN (Internet / IMS / MEC / DN industrial)"
   ],
   "pares": [
    [
     "UPF-CENTRAL",
     "ROUTER-BORDE"
    ],
    [
     "UPF-CENTRAL",
     "P-CSCF"
    ],
    [
     "UPF-LOCAL",
     "MEC-APP"
    ],
    [
     "UPF-PRIV",
     "DN-INDUSTRIAL"
    ]
   ],
   "protocolo": "IP",
   "transporte": "IP/MPLS; cortafuegos y anti-DDoS",
   "descripcion": "Salida de la UPF a la red de datos; por ella llega el tráfico al IMS y a Internet; en la privada, solo destinos industriales",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.2 tabla 4; §11.1",
     "v7": false
    }
   ]
  },
  {
   "id": "N5",
   "entre": [
    "P-CSCF",
    "PCF"
   ],
   "pares": [
    [
     "P-CSCF",
     "PCF"
    ]
   ],
   "protocolo": "no indicado",
   "transporte": "SBI",
   "descripcion": "P-CSCF como AF pide QoS por llamada: 5QI 1 voz, 5QI 2 vídeo; punto a punto",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.2 tabla 4",
     "v7": false
    }
   ]
  },
  {
   "id": "N11",
   "entre": [
    "AMF",
    "SMF / SMF-PRIV"
   ],
   "pares": [
    [
     "AMF",
     "SMF"
    ],
    [
     "AMF",
     "SMF-PRIV"
    ]
   ],
   "protocolo": "SBI HTTP/2",
   "transporte": "SBI",
   "descripcion": "Representada en el esquema del slice privado",
   "inferido": true,
   "nota": "Protocolo normativo 3GPP añadido; los documentos nombran la interfaz pero no el protocolo.",
   "fuente": [
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ]
  },
  {
   "id": "SBI",
   "entre": [
    "NF del 5GC",
    "NF del 5GC"
   ],
   "pares": [
    [
     "AMF",
     "NRF"
    ],
    [
     "SMF",
     "NRF"
    ],
    [
     "PCF",
     "NRF"
    ],
    [
     "UDM",
     "NRF"
    ],
    [
     "AUSF",
     "NRF"
    ],
    [
     "NSSF",
     "NRF"
    ],
    [
     "NEF",
     "NRF"
    ],
    [
     "BSF",
     "NRF"
    ]
   ],
   "protocolo": "HTTP/2 con mTLS/OAuth 2.0",
   "transporte": "clase TC0b",
   "descripcion": "Funciones como pares SBA (NSSF, NRF, PCF, UDM, AUSF, NEF, BSF...)",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.4; §8.5 tabla 13; §11.1",
     "v7": false
    }
   ]
  },
  {
   "id": "Gm",
   "entre": [
    "UE / ONT-HGW",
    "P-CSCF"
   ],
   "pares": [
    [
     "UE",
     "P-CSCF"
    ],
    [
     "ONT-HGW",
     "P-CSCF"
    ]
   ],
   "protocolo": "SIP",
   "transporte": "dentro de la sesión PDU ims (5QI 5), sale por N6; en fijo por OLT–metro–BNG",
   "descripcion": "Interfaz lógica extremo a extremo",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.2 tabla 4",
     "v7": false
    }
   ]
  },
  {
   "id": "Ix",
   "entre": [
    "IBCF",
    "TrGW"
   ],
   "pares": [
    [
     "IBCF",
     "TrGW"
    ]
   ],
   "protocolo": "H.248",
   "transporte": null,
   "descripcion": "Control de la TrGW por el IBCF",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ]
  },
  {
   "id": "Ici",
   "entre": [
    "IBCF",
    "Otro operador IMS"
   ],
   "pares": [
    [
     "IBCF",
     "EXT-IMS"
    ]
   ],
   "protocolo": "SIP",
   "transporte": null,
   "descripcion": "Señalización de interconexión IMS-IMS",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ]
  },
  {
   "id": "Izi",
   "entre": [
    "TrGW",
    "Otro operador IMS"
   ],
   "pares": [
    [
     "TrGW",
     "EXT-IMS"
    ]
   ],
   "protocolo": "RTP",
   "transporte": null,
   "descripcion": "Medios de interconexión IMS-IMS",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ]
  },
  {
   "id": "Nnef_AFsessionWithQoS",
   "entre": [
    "CAMARA-GW",
    "NEF"
   ],
   "pares": [
    [
     "CAMARA-GW",
     "NEF"
    ]
   ],
   "protocolo": "HTTP/REST",
   "transporte": "SBI",
   "descripcion": "Quality on Demand (OG-1)",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2",
     "v7": false
    }
   ]
  },
  {
   "id": "Npcf_PolicyAuthorization",
   "entre": [
    "NEF/BSF",
    "PCF"
   ],
   "pares": [
    [
     "NEF",
     "PCF"
    ],
    [
     "BSF",
     "PCF"
    ]
   ],
   "protocolo": "SBI HTTP/2",
   "transporte": "SBI",
   "descripcion": "QoD: NEF → BSF → PCF → SMF → UPF (N4) y RAN",
   "inferido": true,
   "nota": "Protocolo normativo 3GPP añadido; los documentos nombran la interfaz pero no el protocolo.",
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2",
     "v7": false
    }
   ]
  },
  {
   "id": "CAMARA-API",
   "entre": [
    "App de terceros",
    "CAMARA-GW"
   ],
   "pares": [
    [
     "EXT-APPS",
     "CAMARA-GW"
    ]
   ],
   "protocolo": "REST + OAuth 2.0/OIDC (CIBA, client credentials)",
   "transporte": "Internet",
   "descripcion": "Errores 401/403/429; Device Location da TRUE/FALSE/PARTIAL o 422",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2",
     "v7": false
    }
   ]
  },
  {
   "id": "PON",
   "entre": [
    "ONT-HGW",
    "OLT"
   ],
   "pares": [
    [
     "ONT-HGW",
     "ODN"
    ],
    [
     "ODN",
     "OLT"
    ]
   ],
   "protocolo": "XGS-PON (G.9807.1)",
   "transporte": "ODN 1:64",
   "descripcion": "Acceso fijo; ≈148 Mbit/s por PON en hora cargada",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.1",
     "v7": false
    }
   ]
  },
  {
   "id": "OLT-BNG",
   "entre": [
    "OLT",
    "BNG"
   ],
   "pares": [
    [
     "OLT",
     "BNG"
    ]
   ],
   "protocolo": "IP/MPLS (no especificado)",
   "transporte": "nodo metro y anillo hasta el DC",
   "descripcion": "Fijo: OLT → metro → BNG → core; no pasa por el 5GC",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §4.2 tabla 4",
     "v7": false
    }
   ]
  },
  {
   "id": "ANILLO",
   "entre": [
    "NODO-METRO",
    "NODO-METRO"
   ],
   "pares": [
    [
     "NODO-METRO",
     "NODO-METRO"
    ]
   ],
   "protocolo": "IP/MPLS RSVP-TE + FRR (BFD)",
   "transporte": "WDM/OTN 400G por λ",
   "descripcion": "Tramos C–N, N–E, E–S, S–C; LSP principal y secundario por par",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.5, §9.1",
     "v7": false
    }
   ]
  },
  {
   "id": "ACOMETIDA-DC",
   "entre": [
    "DC",
    "NODO-METRO"
   ],
   "pares": [
    [
     "DC",
     "NODO-METRO"
    ]
   ],
   "protocolo": "IP/MPLS",
   "transporte": "400G (6 o 4 canales)",
   "descripcion": "Dos por DC (6 en total); C–DC-Centro, N–DC-Norte, C–DC-Sur 6 canales; N–DC-Centro, E–DC-Norte, S–DC-Sur 4 canales",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.3, §8.4 tabla 12",
     "v7": false
    }
   ]
  },
  {
   "id": "ACOMETIDA-EDGE",
   "entre": [
    "EDGE",
    "NODO-METRO"
   ],
   "pares": [
    [
     "EDGE",
     "NODO-METRO"
    ]
   ],
   "protocolo": "IP/MPLS",
   "transporte": "no indicada",
   "descripcion": "Única acometida Metro–Edge; su corte deja el Edge inaccesible (escenario D)",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§8.2 tabla 11; §9.2 tabla 14",
     "v7": false
    }
   ]
  },
  {
   "id": "BGP-PEERING",
   "entre": [
    "ROUTER-BORDE",
    "Internet/IXP"
   ],
   "pares": [
    [
     "ROUTER-BORDE",
     "EXT-INTERNET"
    ]
   ],
   "protocolo": "BGP",
   "transporte": null,
   "descripcion": "Peering y tránsito",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ]
  },
  {
   "id": "EVPN",
   "entre": [
    "PE-L2VPN",
    "PE-L2VPN"
   ],
   "pares": [
    [
     "PE-L2VPN",
     "PE-L2VPN"
    ]
   ],
   "protocolo": "EVPN E-LAN (RFC 7432) sobre MPLS",
   "transporte": "LSP con FRR, clase TC2",
   "descripcion": "L2VPN entre 4 sedes",
   "inferido": false,
   "nota": null,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.2",
     "v7": false
    }
   ]
  }
 ],
 "interconexiones": [
  {
   "id": "IX-INTERNET",
   "red_externa": "Internet / punto neutro IXP (nombre '¿Espanix?' por verificar)",
   "punto_fisico": "routers de borde de los DC; punto físico del IXP no indicado",
   "protocolo": "BGP (peering y tránsito)",
   "capacidad": null,
   "proteccion": "cortafuegos y anti-DDoS en N6; protección física no indicada",
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §4.2 tabla 4; §11.1",
     "v7": false
    }
   ],
   "v7": {
    "dato": "Salida por routers de borde del core (BGP peering y tránsito), IXP 'e.g. Espanix'. Internet fijo termina en BNG; móvil en UPF central (N6).",
    "capacidad": "No dimensionada (sin Gbit/s de IX/tránsito). Demanda de referencia: 3.614,24 Gbit/s fijo+móvil con 25 % (P2 ×2).",
    "seccion": "5.1.1; 5.2; 6.10; 3.3.1"
   },
   "si_falla": null,
   "red": {
    "nodos": [
     "IX-INTERNET"
    ],
    "enlaces": [
     "L-CORE1-IXINTERNET",
     "L-CORE2-IXINTERNET",
     "L-CORE3-IXINTERNET"
    ]
   },
   "elementos": [
    "ROUTER-BORDE",
    "EXT-INTERNET"
   ],
   "nota": null,
   "preguntas": [
    {
     "es": "¿Cómo dimensionaríais la salida a Internet si la v7 no da Gbit/s de IX?",
     "en": "How would you size the Internet exit when v7 gives no IX Gbit/s?"
    },
    {
     "es": "¿Qué pasa con el tráfico de Internet si cae el router de borde de un DC?",
     "en": "What happens to Internet traffic if one DC's border router fails?"
    }
   ]
  },
  {
   "id": "IX-IMS",
   "red_externa": "Otros operadores IMS",
   "punto_fisico": "frontera IMS (IBCF + TrGW); ubicación no indicada",
   "protocolo": "SIP (Ici), RTP (Izi), H.248 (Ix) interno",
   "capacidad": "973,72 CAPS hacia otros operadores IMS; 13 SBC por DC",
   "proteccion": "un único punto de salida por tipo de interconexión",
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §11.1",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 7, 24, 29",
     "v7": false
    }
   ],
   "v7": {
    "dato": "IBCF + TrGW (Ix/H.248); hacia el otro operador Ici (señalización) e Izi (media). Sin CS. 100 % IMS.",
    "capacidad": "973,72 CAPS ambos sentidos (876.347,4 Erl); 13 instancias SBC/DC (2.2); caudal de media hacia el otro operador no dado (media IMS total 186,95 Gbit/s/sentido para 1.460.579 patas a 128 kbit/s)",
    "seccion": "5.1.1; 6.6.1; 6.6.2; A2; B.1 IMS-IBCF"
   },
   "si_falla": null,
   "red": {
    "nodos": [
     "IX-IMS"
    ],
    "enlaces": [
     "L-CORE1-IXIMS",
     "L-CORE2-IXIMS",
     "L-CORE3-IXIMS"
    ]
   },
   "elementos": [
    "IBCF",
    "TrGW",
    "EXT-IMS"
   ],
   "nota": null,
   "preguntas": [
    {
     "es": "¿Qué cambia entre el SBC integrado y uno especializado a la hora de dimensionar?",
     "en": "What changes in sizing between an integrated SBC and a specialised one?"
    },
    {
     "es": "¿Cómo pasaríais de 973,72 CAPS a Gbit/s de media hacia el otro operador?",
     "en": "How would you go from 973.72 CAPS to media Gbit/s towards the other operator?"
    }
   ]
  },
  {
   "id": "IX-CS",
   "red_externa": "Redes de circuitos (RTB/CS)",
   "punto_fisico": null,
   "protocolo": null,
   "capacidad": null,
   "proteccion": null,
   "excluida": true,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§2.2 tabla 1; §4.2",
     "v7": false
    }
   ],
   "v7": {
    "dato": "Voz 100 % IMS–IMS vía IBCF/SBC + TrGW; CS excluido.",
    "capacidad": "—",
    "seccion": "2.5; 6.6.1; C.2"
   },
   "si_falla": {
    "texto": "Excluida: 100 % IMS–IMS; BGCF/MGCF/SGW/IMS-MGW eliminados.",
    "seccion": "2.5; 6.6.1",
    "v7": true
   },
   "red": {
    "nodos": [],
    "enlaces": []
   },
   "elementos": [],
   "nota": "Excluida por decisión de alcance de la coordinación (BGCF/MGCF/SGW/IMS-MGW eliminados); ARCO04 lo pedía.",
   "preguntas": [
    {
     "es": "¿Qué tendría que pasar para que esta interconexión entrara en el alcance y qué elementos añadiría?",
     "en": "What would have to happen for this interconnection to enter the scope, and which elements would it add?"
    },
    {
     "es": "¿Qué servicios quedan sin cubrir al excluirla?",
     "en": "Which services are left uncovered by excluding it?"
    }
   ]
  },
  {
   "id": "IX-L2VPN",
   "red_externa": "Sedes empresa (L2VPN)",
   "punto_fisico": "UNI en PE de Metro-Centro (UPM), Metro-Norte (Ayto. Alcobendas), Metro-Este (Univ. Alcalá), Metro-Sur (URJC Alcorcón)",
   "protocolo": "EVPN E-LAN sobre MPLS",
   "capacidad": "10 GbE por UNI; 40 Gbit/s total",
   "proteccion": "LSP secundario + FRR; multihoming solo en Centro",
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.2 tabla 17",
     "v7": false
    }
   ],
   "v7": {
    "dato": "Sedes: URJC Alcorcón (Metro-S), Univ. de Alcalá (Metro-E), Ayto. Alcobendas (Metro-N, por confirmar), UPM Ciudad Universitaria (Metro-C, por confirmar); alternativas Tres Cantos y Ayto. Madrid [HYP]",
    "capacidad": "No calculada; UNI 10 GbE como cota, 40 Gbit/s total; carga por vano no derivada de la suma de UNI",
    "seccion": "6.9; 6.4.4"
   },
   "si_falla": {
    "texto": "con un solo PE (N, E, S) la sede pierde servicio si cae el PE",
    "seccion": null,
    "v7": false,
    "inferido": true
   },
   "red": {
    "nodos": [
     "SITE-L2VPN-CENTRO",
     "SITE-L2VPN-NORTE",
     "SITE-L2VPN-ESTE",
     "SITE-L2VPN-SUR"
    ],
    "enlaces": [
     "L-SITEL2VPNCENTRO-METCENTRO",
     "L-SITEL2VPNNORTE-METNORTE",
     "L-SITEL2VPNESTE-METESTE",
     "L-SITEL2VPNSUR-METSUR"
    ]
   },
   "elementos": [
    "PE-L2VPN",
    "EXT-SEDES"
   ],
   "nota": "'que_pasa_si_falla' deducido de 'si el servicio exige alta disponibilidad de sede, hay que duplicar el PE'.",
   "preguntas": [
    {
     "es": "¿Cuánta carga de L2VPN pondríais en cada vano si la v7 no la deriva?",
     "en": "How much L2VPN load would you put on each span, given v7 does not derive it?"
    },
    {
     "es": "Con un solo PE por sede, ¿qué pasa si cae ese PE?",
     "en": "With a single PE per site, what happens if that PE fails?"
    }
   ]
  },
  {
   "id": "IX-SAT",
   "red_externa": "Satélite NTN (OneWeb)",
   "punto_fisico": "hub en Arganda",
   "protocolo": null,
   "capacidad": "≥100/20 Mbit/s por terminal",
   "proteccion": "conmutación ≤60 s",
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1; §4.2 tabla 4",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 31",
     "v7": false
    }
   ],
   "v7": {
    "dato": "OneWeb LEO con hub en Arganda; backhaul del hub por verificar",
    "capacidad": "≥100/20 Mbit/s por terminal; conmutación ≤60 s",
    "seccion": "6.11; 5.2"
   },
   "si_falla": {
    "texto": "Es el respaldo de la red terrestre: pérdida de la red terrestre en un sitio → satélite OneWeb en ≤60 s, solo servicios prioritarios. Qué pasa si falla el propio satélite: no especificado en v7.",
    "seccion": "7.1.1",
    "v7": true
   },
   "red": {
    "nodos": [
     "IX-ONEWEB",
     "SITE-NTN-ARGANDA"
    ],
    "enlaces": [
     "L-IXONEWEB-CORE1",
     "L-SITENTNARGANDA-METESTE"
    ]
   },
   "elementos": [
    "HUB-SAT",
    "TERM-SAT"
   ],
   "nota": "Backhaul del hub, MODCOD y ficha pendientes; 'parte de satélite' aplazada a la entrega final (acta §3.3).",
   "preguntas": [
    {
     "es": "¿Qué servicios tienen sentido por satélite con ≥100/20 Mbit/s por terminal y cuáles no?",
     "en": "Which services make sense over satellite at ≥100/20 Mbit/s per terminal, and which do not?"
    },
    {
     "es": "¿Qué falta por definir del hub de Arganda para poder contar con él en un fallo?",
     "en": "What is still undefined about the Arganda hub before it can be relied on in a failure?"
    }
   ]
  },
  {
   "id": "IX-ROAMING",
   "red_externa": "Roaming (otros PLMN)",
   "punto_fisico": null,
   "protocolo": null,
   "capacidad": null,
   "proteccion": null,
   "excluida": true,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§11.2",
     "v7": false
    }
   ],
   "v7": {
    "dato": "No se asume; añadir SEPP si Dirección lo pide",
    "capacidad": "—",
    "seccion": "6.13 (Privacy)"
   },
   "si_falla": {
    "texto": "Excluida: no se asume roaming; añadir SEPP si Dirección lo pide.",
    "seccion": "6.13",
    "v7": true
   },
   "red": {
    "nodos": [],
    "enlaces": []
   },
   "elementos": [],
   "nota": "Se asume sin roaming; añadir SEPP si Dirección lo pide.",
   "preguntas": [
    {
     "es": "¿Qué tendría que pasar para que esta interconexión entrara en el alcance y qué elementos añadiría?",
     "en": "What would have to happen for this interconnection to enter the scope, and which elements would it add?"
    },
    {
     "es": "¿Qué servicios quedan sin cubrir al excluirla?",
     "en": "Which services are left uncovered by excluding it?"
    }
   ]
  },
  {
   "id": "IX-PRIV",
   "red_externa": "Red privada industrial (PNI-NPN tipo A)",
   "punto_fisico": "UPF privada en Edge-Sur → DN industrial (VRF propia)",
   "protocolo": "N6 filtrado; acceso solo si UDM autoriza (2, 000101); CAG opcional",
   "capacidad": "0,088 DL / 0,200 UL Gbit/s (piloto 330 equipos)",
   "proteccion": "2 UPF en reserva caliente en Edge-Centro",
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3, §6.4",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ],
   "v7": {
    "dato": "DN industrial en VRF propio, filtrado en N6, sin salida a Internet",
    "capacidad": "—",
    "seccion": "6.3.5; 6.13"
   },
   "si_falla": {
    "texto": "SMF lógico dedicado, VRF propio sin salida a Internet; respaldo UPF privada en Edge-Centro; ≤5 s; 0 paquetes entre VRF",
    "seccion": "6.3.5",
    "v7": true
   },
   "red": {
    "nodos": [
     "SITE-INDUSTRIA-SUR",
     "EDGE-SUR"
    ],
    "enlaces": [
     "L-SITEINDUSTRIASUR-METSUR",
     "L-EDGESUR-METS"
    ]
   },
   "elementos": [
    "UPF-PRIV",
    "DN-INDUSTRIAL"
   ],
   "nota": null,
   "preguntas": [
    {
     "es": "¿Cómo comprobaríais que no pasa ningún paquete entre la VRF industrial y la pública?",
     "en": "How would you verify that no packet crosses between the industrial VRF and the public one?"
    },
    {
     "es": "¿Qué le pasa a un AGV durante los segundos de conmutación a Edge-Centro?",
     "en": "What happens to an AGV during the seconds of switchover to Edge-Centre?"
    }
   ]
  },
  {
   "id": "IX-OPENGW",
   "red_externa": "Desarrolladores de apps (Open Gateway)",
   "punto_fisico": "pasarela CAMARA delante del NEF",
   "protocolo": "REST CAMARA + OAuth 2.0/OIDC",
   "capacidad": null,
   "proteccion": null,
   "excluida": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7",
     "v7": false
    }
   ],
   "v7": {
    "dato": "Pasarela CAMARA delante del NEF (Nokia NEP planificado, modelo por fijar); QoD, Device Location Verification, Simple Edge Discovery; OAuth 2.0/OIDC",
    "capacidad": "—",
    "seccion": "6.8"
   },
   "si_falla": null,
   "red": {
    "nodos": [],
    "enlaces": []
   },
   "elementos": [
    "CAMARA-GW",
    "NEF",
    "EXT-APPS"
   ],
   "nota": null,
   "preguntas": [
    {
     "es": "¿Qué pasa con una petición QoD si la pasarela CAMARA no está disponible?",
     "en": "What happens to a QoD request if the CAMARA gateway is unavailable?"
    },
    {
     "es": "¿Qué datos del operador expone cada API y cómo se protegen?",
     "en": "Which operator data does each API expose, and how is it protected?"
    }
   ]
  }
 ],
 "flujos": [
  {
   "id": "internet-fijo",
   "origen": "municipio",
   "dc": "bng",
   "saltos": [
    {
     "el": "ONT-HGW",
     "txt": "ONT-HGW",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "ODN",
     "txt": "ODN",
     "t": "local",
     "ifz": "PON",
     "nodo": "@ACC"
    },
    {
     "el": "OLT",
     "txt": "OLT",
     "t": "local",
     "ifz": "PON",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO (zona)",
     "t": "acceso",
     "ifz": "OLT-BNG",
     "nodo": "@MET"
    },
    {
     "el": "BNG",
     "txt": "DC (BNG de su zona)",
     "t": "dc",
     "ifz": "OLT-BNG",
     "nodo": "@DC"
    },
    {
     "el": "CORE-IPMPLS",
     "txt": "CORE-IPMPLS",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    },
    {
     "el": "ROUTER-BORDE",
     "txt": "ROUTER-BORDE",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    },
    {
     "el": "EXT-INTERNET",
     "txt": "Internet/IXP",
     "t": "externo",
     "ifz": "BGP-PEERING",
     "nodo": "IX-INTERNET"
    }
   ],
   "servicio": "Internet fijo",
   "camino": [
    "ONT-HGW",
    "ODN",
    "OLT",
    "NODO-METRO (zona)",
    "DC (BNG de su zona; Este 50/50 Norte-Sur)",
    "CORE-IPMPLS",
    "ROUTER-BORDE",
    "Internet/IXP"
   ],
   "interfaces": [
    "PON",
    "OLT-BNG",
    "BGP-PEERING"
   ],
   "respaldo": null,
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §8.5",
     "v7": false
    },
    {
     "doc": "2.1-S5d_Transporte_Metro_y_L2VPN def.pdf",
     "seccion": "§7.1",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "voz-fija",
   "origen": "municipio",
   "dc": "bng",
   "saltos": [
    {
     "el": "ONT-HGW",
     "txt": "ONT-HGW",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "OLT",
     "txt": "OLT",
     "t": "local",
     "ifz": "PON",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "OLT-BNG",
     "nodo": "@MET"
    },
    {
     "el": "BNG",
     "txt": "BNG",
     "t": "dc",
     "ifz": "OLT-BNG",
     "nodo": "@DC"
    },
    {
     "el": "P-CSCF",
     "txt": "P-CSCF",
     "t": "interno",
     "ifz": "Gm",
     "nodo": "@DC"
    },
    {
     "el": "S-CSCF",
     "txt": "S-CSCF",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    },
    {
     "el": "TAS",
     "txt": "TAS",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    }
   ],
   "servicio": "Voz fija VoIP",
   "camino": [
    "ONT-HGW",
    "OLT",
    "NODO-METRO",
    "BNG",
    "P-CSCF",
    "S-CSCF",
    "TAS"
   ],
   "interfaces": [
    "PON",
    "OLT-BNG",
    "Gm"
   ],
   "respaldo": null,
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.2 tabla 4",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "internet-movil",
   "origen": "municipio",
   "dc": "elegir",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL (DC)",
     "t": "dc",
     "ifz": "N3",
     "nodo": "@DC"
    },
    {
     "el": "ROUTER-BORDE",
     "txt": "ROUTER-BORDE",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@DC"
    },
    {
     "el": "EXT-INTERNET",
     "txt": "Internet/IXP",
     "t": "externo",
     "ifz": "BGP-PEERING",
     "nodo": "IX-INTERNET"
    }
   ],
   "servicio": "Internet móvil eMBB",
   "camino": [
    "UE",
    "gNB",
    "NODO-METRO",
    "ANILLO/ACOMETIDA-DC",
    "UPF-CENTRAL (DC)",
    "ROUTER-BORDE",
    "Internet/IXP"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6",
    "BGP-PEERING"
   ],
   "respaldo": null,
   "nota": "El móvil va del metro al core sin pasar por el BNG.",
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1, §6.3 tabla 7",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "vonr-sip",
   "origen": "municipio",
   "dc": "elegir",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL",
     "t": "dc",
     "ifz": "N3",
     "nodo": "@DC"
    },
    {
     "el": "P-CSCF",
     "txt": "P-CSCF",
     "t": "interno",
     "ifz": "N6 · Gm",
     "nodo": "@DC"
    },
    {
     "el": "S-CSCF",
     "txt": "I-CSCF/S-CSCF",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    },
    {
     "el": "TAS",
     "txt": "TAS",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    }
   ],
   "servicio": "Voz VoNR (señalización)",
   "camino": [
    "UE",
    "gNB",
    "NODO-METRO",
    "UPF-CENTRAL",
    "P-CSCF",
    "I-CSCF/S-CSCF",
    "TAS"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6",
    "Gm",
    "N5 (P-CSCF→PCF)"
   ],
   "respaldo": null,
   "nota": "DNN ims, slice eMBB, 5QI 5 para SIP.",
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§2.2 tabla 1; §4.2 tabla 4; §5.2",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "vonr-rtp",
   "origen": "municipio",
   "dc": "elegir",
   "nota_sup": "Lado B en la misma zona y el mismo DC que el lado A (supuesto del simulador para poder recorrerlo).",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE A",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL",
     "t": "dc",
     "ifz": "N3",
     "nodo": "@DC"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL (lado B)",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@DC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO (lado B)",
     "t": "vuelta",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "gNB",
     "txt": "gNB (lado B)",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@ACC"
    },
    {
     "el": "UE",
     "txt": "UE B",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    }
   ],
   "servicio": "Voz VoNR (medios RTP on-net)",
   "camino": [
    "UE A",
    "gNB",
    "UPF-CENTRAL",
    "UPF-CENTRAL",
    "gNB",
    "UE B"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6",
    "N3"
   ],
   "respaldo": null,
   "nota": "El audio no pasa por el IMS: va de UPF a UPF; 5QI 1 voz, 5QI 2 vídeo.",
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§2.2 tabla 1",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "ims-otro-operador",
   "origen": "municipio",
   "dc": "elegir",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL",
     "t": "dc",
     "ifz": "N3",
     "nodo": "@DC"
    },
    {
     "el": "P-CSCF",
     "txt": "P-CSCF",
     "t": "interno",
     "ifz": "Gm",
     "nodo": "@DC"
    },
    {
     "el": "S-CSCF",
     "txt": "S-CSCF",
     "t": "interno",
     "ifz": null,
     "nodo": "@DC"
    },
    {
     "el": "IBCF",
     "txt": "IBCF (señalización) / TrGW (medios)",
     "t": "interno",
     "ifz": "Ix",
     "nodo": "@DC"
    },
    {
     "el": "EXT-IMS",
     "txt": "Otro operador IMS",
     "t": "externo",
     "ifz": "Ici · Izi",
     "nodo": "IX-IMS"
    }
   ],
   "servicio": "Llamada a otro operador IMS",
   "camino": [
    "UE",
    "gNB",
    "UPF-CENTRAL",
    "P-CSCF",
    "S-CSCF",
    "IBCF (señalización) / TrGW (medios)",
    "Otro operador IMS"
   ],
   "interfaces": [
    "Gm",
    "Ix",
    "Ici",
    "Izi"
   ],
   "respaldo": null,
   "nota": "Orden S-CSCF→IBCF deducido de la arquitectura; los 5 flujos de llamada están en otro documento (no revisado).",
   "inferido": true,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§4.1",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "estadio",
   "origen": "SITE-METROPOLITANO",
   "metro": "C",
   "edge": "EDGE-CENTRO",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB n258/n78",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO Centro",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-LOCAL",
     "txt": "EDGE-CENTRO (UPF-LOCAL)",
     "t": "edge",
     "ifz": "N3",
     "nodo": "@EDGE"
    },
    {
     "el": "MEC-APP",
     "txt": "MEC-APP",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@EDGE"
    }
   ],
   "servicio": "Estadio Metropolitano (eMBB MEC)",
   "camino": [
    "UE",
    "gNB n258/n78",
    "NODO-METRO Centro",
    "EDGE-CENTRO (UPF-LOCAL)",
    "MEC-APP"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6"
   ],
   "respaldo": "Edge-Este al 60 %, 4,1 ms; QoD + Simple Edge Discovery",
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3, §6.4, §7.1",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "Latencia usuario–Edge ≤10 ms P95 (D-04); esperado 3,5–7,4 ms normal, ≤7,9 ms respaldo. Respaldo Edge-Este al 60 %: P95 4,1 ms.",
    "seccion": "2.6; 6.7.3"
   }
  },
  {
   "id": "camaras-valdebebas",
   "origen": "SITE-VALDEBEBAS",
   "metro": "C",
   "edge": "EDGE-CENTRO",
   "saltos": [
    {
     "el": "UE",
     "txt": "Cámara",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB n78",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO Centro",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-LOCAL",
     "txt": "EDGE-CENTRO (UPF-LOCAL)",
     "t": "edge",
     "ifz": "N3",
     "nodo": "@EDGE"
    },
    {
     "el": "MEC-APP",
     "txt": "MEC-APP analítica",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@EDGE"
    }
   ],
   "servicio": "Cámaras Smart City Valdebebas",
   "camino": [
    "Cámara",
    "gNB n78",
    "NODO-METRO Centro",
    "EDGE-CENTRO (UPF-LOCAL)",
    "MEC-APP analítica"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6"
   ],
   "respaldo": "Edge-Este (100 % streams/grabación, 30 % analítica)",
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.5, §6.3",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "Respaldo en Edge-Este: P95 6,2 ms (peor radio 9,7 ms).",
    "seccion": "6.7.3"
   }
  },
  {
   "id": "sensores-valdebebas",
   "origen": "SITE-VALDEBEBAS",
   "metro": "C",
   "dc": "DCC",
   "saltos": [
    {
     "el": "UE",
     "txt": "Sensor",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "ng-eNB",
     "txt": "ng-eNB NB-IoT/LTE-M",
     "t": "radio",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF-CENTRAL (DC-Centro)",
     "t": "dc",
     "ifz": "N3",
     "nodo": "@DC"
    }
   ],
   "servicio": "Sensores mMTC Valdebebas",
   "camino": [
    "Sensor",
    "ng-eNB NB-IoT/LTE-M",
    "NODO-METRO",
    "UPF-CENTRAL (DC-Centro)"
   ],
   "interfaces": [
    "N2",
    "N3"
   ],
   "respaldo": null,
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.5",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "≥99,9 % de 9.500 informes en ≤10 s y ≤10 intentos.",
    "seccion": "4.4"
   }
  },
  {
   "id": "v2x-a2",
   "origen": "SITE-A2-V2X",
   "metro": "E",
   "edge": "EDGE-ESTE",
   "saltos": [
    {
     "el": "UE",
     "txt": "Vehículo",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB n28/n78",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO Este",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-LOCAL",
     "txt": "EDGE-ESTE (UPF-LOCAL)",
     "t": "edge",
     "ifz": "N3",
     "nodo": "@EDGE"
    },
    {
     "el": "MEC-APP",
     "txt": "MEC-APP V2X",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@EDGE"
    }
   ],
   "servicio": "V2X A-2 (URLLC)",
   "camino": [
    "Vehículo",
    "gNB n28/n78",
    "NODO-METRO Este",
    "EDGE-ESTE (UPF-LOCAL)",
    "MEC-APP V2X"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6"
   ],
   "respaldo": "Edge-Centro, 5,8 ms",
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3, §6.4",
     "v7": false
    },
    {
     "doc": "ARCO11_MEC_Local_Breakout_S5a_DEFINITIVO_CORREGIDO_02-11-2026.docx",
     "seccion": "§3",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "≥99,999 % de mensajes en ≤10 ms; respaldo Edge-Centro P95 5,8 ms.",
    "seccion": "2.6; 6.7.3"
   }
  },
  {
   "id": "hospital-getafe",
   "origen": "SITE-HOSPITAL-GETAFE",
   "metro": "S",
   "edge": "EDGE-SUR",
   "saltos": [
    {
     "el": "UE",
     "txt": "UE/equipo",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB-indoor-hospital",
     "txt": "gNB-indoor-hospital",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO Sur",
     "t": "acceso",
     "ifz": "N3",
     "nodo": "@MET"
    },
    {
     "el": "UPF-LOCAL",
     "txt": "EDGE-SUR (UPF-LOCAL pública)",
     "t": "edge",
     "ifz": "N3",
     "nodo": "@EDGE"
    },
    {
     "el": "MEC-APP",
     "txt": "MEC-APP hospital",
     "t": "interno",
     "ifz": "N6",
     "nodo": "@EDGE"
    }
   ],
   "servicio": "Hospital de Getafe (URLLC)",
   "camino": [
    "UE/equipo",
    "gNB-indoor-hospital",
    "NODO-METRO Sur",
    "EDGE-SUR (UPF-LOCAL pública)",
    "MEC-APP hospital"
   ],
   "interfaces": [
    "Uu",
    "N3",
    "N6"
   ],
   "respaldo": "Edge-Centro, 7,5–9,5 ms (peor caso 9,9 con corte de fibra)",
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§6.3, §6.4",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "≤10 ms; respaldo Edge-Centro 7,5 ms (app 3 ms) / 9,5 ms (app 5 ms); la v7 da también 9,4 y 9,9 ms (contradicción interna 13).",
    "seccion": "4.4; 6.7.3; 6.13"
   }
  },
  {
   "id": "privada-industrial",
   "origen": "SITE-INDUSTRIA-SUR",
   "metro": "S",
   "edge": "EDGE-SUR",
   "saltos": [
    {
     "el": "UE",
     "txt": "AGV/terminal",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "gNB",
     "txt": "gNB (RAN pública compartida)",
     "t": "radio",
     "ifz": "Uu",
     "nodo": "@ACC"
    },
    {
     "el": "NODO-METRO",
     "txt": "NODO-METRO Sur",
     "t": "acceso",
     "ifz": "N3 privado",
     "nodo": "@MET"
    },
    {
     "el": "UPF-PRIV",
     "txt": "EDGE-SUR (UPF-PRIV)",
     "t": "edge",
     "ifz": "N3 privado · N4 desde SMF-PRIV",
     "nodo": "@EDGE"
    },
    {
     "el": "DN-INDUSTRIAL",
     "txt": "DN-INDUSTRIAL",
     "t": "interno",
     "ifz": "N6 filtrado",
     "nodo": null
    }
   ],
   "servicio": "Red privada industrial",
   "camino": [
    "AGV/terminal",
    "gNB (RAN pública compartida)",
    "NODO-METRO Sur",
    "EDGE-SUR (UPF-PRIV)",
    "DN-INDUSTRIAL"
   ],
   "interfaces": [
    "Uu",
    "N3 privado",
    "N4 (desde SMF-PRIV)",
    "N6 filtrado"
   ],
   "respaldo": "UPF privada en reserva caliente en Edge-Centro",
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§5.3",
     "v7": false
    },
    {
     "doc": "Presentacion_Entrega2_Actualizado.pptx",
     "seccion": "diap. 10",
     "v7": false
    }
   ],
   "objetivo": {
    "texto": "Crítico +≤1 ms con eMBB saturado; respaldo Edge-Centro P95 3,6 ms.",
    "seccion": "4.4; 6.7.3"
   }
  },
  {
   "id": "l2vpn",
   "origen": "sede",
   "saltos": [
    {
     "el": "EXT-SEDES",
     "txt": "Sede A",
     "t": "origen",
     "ifz": null,
     "nodo": "@ACC"
    },
    {
     "el": "PE-L2VPN",
     "txt": "PE-L2VPN (nodo metro A)",
     "t": "uni",
     "ifz": "UNI 10 GbE",
     "nodo": "@MET"
    },
    {
     "el": "PE-L2VPN",
     "txt": "PE-L2VPN (nodo metro B)",
     "t": "metro_b",
     "ifz": "EVPN · ANILLO",
     "nodo": "@MB"
    },
    {
     "el": "EXT-SEDES",
     "txt": "Sede B",
     "t": "uni",
     "ifz": "UNI 10 GbE",
     "nodo": "@ACCB"
    }
   ],
   "servicio": "L2VPN empresa",
   "camino": [
    "Sede A",
    "PE-L2VPN (nodo metro A)",
    "ANILLO (LSP)",
    "PE-L2VPN (nodo metro B)",
    "Sede B"
   ],
   "interfaces": [
    "EVPN",
    "ANILLO"
   ],
   "respaldo": null,
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§10.2",
     "v7": false
    }
   ],
   "objetivo": null
  },
  {
   "id": "opengw-qod",
   "origen": null,
   "nota_sup": "Flujo de control dentro del core: la v7 no da su latencia de transporte.",
   "saltos": [
    {
     "el": "EXT-APPS",
     "txt": "App",
     "t": "origen",
     "ifz": null,
     "nodo": null
    },
    {
     "el": "CAMARA-GW",
     "txt": "CAMARA-GW",
     "t": "externo",
     "ifz": "CAMARA-API",
     "nodo": null
    },
    {
     "el": "NEF",
     "txt": "NEF",
     "t": "interno",
     "ifz": "Nnef_AFsessionWithQoS",
     "nodo": null
    },
    {
     "el": "BSF",
     "txt": "BSF",
     "t": "interno",
     "ifz": null,
     "nodo": null
    },
    {
     "el": "PCF",
     "txt": "PCF",
     "t": "interno",
     "ifz": "Npcf_PolicyAuthorization",
     "nodo": null
    },
    {
     "el": "SMF",
     "txt": "SMF",
     "t": "interno",
     "ifz": null,
     "nodo": null
    },
    {
     "el": "UPF-CENTRAL",
     "txt": "UPF + RAN",
     "t": "interno",
     "ifz": "N4",
     "nodo": null
    }
   ],
   "servicio": "Open Gateway QoD",
   "camino": [
    "App",
    "CAMARA-GW",
    "NEF",
    "BSF",
    "PCF",
    "SMF",
    "UPF + RAN"
   ],
   "interfaces": [
    "CAMARA-API",
    "Nnef_AFsessionWithQoS",
    "Npcf_PolicyAuthorization",
    "N4"
   ],
   "respaldo": null,
   "nota": null,
   "inferido": false,
   "fuente": [
    {
     "doc": "Memoria_tecnica_Grupo_2_1v2.docx",
     "seccion": "§7.2",
     "v7": false
    }
   ],
   "objetivo": null
  }
 ],
 "sedes_l2vpn": [
  {
   "metro": "C",
   "nombre": "UPM, Ciudad Universitaria (por confirmar)",
   "red": "SITE-L2VPN-CENTRO"
  },
  {
   "metro": "N",
   "nombre": "Ayto. Alcobendas (por confirmar)",
   "red": "SITE-L2VPN-NORTE"
  },
  {
   "metro": "E",
   "nombre": "Universidad de Alcalá",
   "red": "SITE-L2VPN-ESTE"
  },
  {
   "metro": "S",
   "nombre": "URJC, Alcorcón",
   "red": "SITE-L2VPN-SUR"
  }
 ],
 "transporte": {
  "metro": {
   "C": {
    "red": "MET-CENTRO",
    "nombre": "Metro-Centro"
   },
   "N": {
    "red": "MET-NORTE",
    "nombre": "Metro-Norte"
   },
   "E": {
    "red": "MET-ESTE",
    "nombre": "Metro-Este"
   },
   "S": {
    "red": "MET-SUR",
    "nombre": "Metro-Sur"
   }
  },
  "dc": {
   "DCC": {
    "red": "CORE-1",
    "nombre": "DC-Centro"
   },
   "DCN": {
    "red": "CORE-2",
    "nombre": "DC-Norte"
   },
   "DCS": {
    "red": "CORE-3",
    "nombre": "DC-Sur"
   }
  },
  "edge": {
   "EDGE-CENTRO": {
    "red": "EDGE-CENTRO",
    "metro": "C",
    "nombre": "Edge-Centro"
   },
   "EDGE-ESTE": {
    "red": "EDGE-ESTE",
    "metro": "E",
    "nombre": "Edge-Este"
   },
   "EDGE-SUR": {
    "red": "EDGE-SUR",
    "metro": "S",
    "nombre": "Edge-Sur"
   }
  },
  "tramos": [
   {
    "a": "C",
    "b": "N",
    "km": 20,
    "red": "L-ANILLO-CN",
    "tipo": "anillo",
    "lag": 2400
   },
   {
    "a": "N",
    "b": "E",
    "km": 28,
    "red": "L-ANILLO-NE",
    "tipo": "anillo",
    "lag": 1600
   },
   {
    "a": "E",
    "b": "S",
    "km": 38,
    "red": "L-ANILLO-ES",
    "tipo": "anillo",
    "lag": 1600
   },
   {
    "a": "S",
    "b": "C",
    "km": 16,
    "red": "L-ANILLO-SC",
    "tipo": "anillo",
    "lag": 2400
   },
   {
    "a": "C",
    "b": "DCC",
    "km": 0,
    "red": "L-CORE1-METC",
    "tipo": "acometida",
    "lag": 2400
   },
   {
    "a": "N",
    "b": "DCC",
    "km": 0,
    "red": "L-CORE1-METN",
    "tipo": "acometida",
    "lag": 1600
   },
   {
    "a": "N",
    "b": "DCN",
    "km": 0,
    "red": "L-CORE2-METN",
    "tipo": "acometida",
    "lag": 2400
   },
   {
    "a": "E",
    "b": "DCN",
    "km": 0,
    "red": "L-CORE2-METE",
    "tipo": "acometida",
    "lag": 1600
   },
   {
    "a": "S",
    "b": "DCS",
    "km": 0,
    "red": "L-CORE3-METS",
    "tipo": "acometida",
    "lag": 1600
   },
   {
    "a": "C",
    "b": "DCS",
    "km": 0,
    "red": "L-CORE3-METC",
    "tipo": "acometida",
    "lag": 2400
   }
  ],
  "area_metro": {
   "CENTRO": "C",
   "NORTE": "N",
   "ESTE": "E",
   "SUR": "S"
  },
  "bng_zona": {
   "C": [
    "DCC"
   ],
   "N": [
    "DCN"
   ],
   "E": [
    "DCN",
    "DCS"
   ],
   "S": [
    "DCS"
   ]
  },
  "acceso": {
   "km": 20,
   "saltos": 4,
   "seccion": "6.4.2; A.2 A1",
   "texto": "acceso modelado como 20 km y 4 saltos (≈0,3 ms con 0,1 ms de cola)"
  },
  "regla": {
   "regla": "Latencia de transporte",
   "valor": "5 µs/km + 20 µs/salto (+0,1 ms de cola no usada); acceso 20 km y 4 saltos ≈0,3 ms",
   "seccion": "6.4.2; A.2 A1",
   "tex": "t = 5\\,\\mu\\mathrm{s/km}\\cdot L + 20\\,\\mu\\mathrm{s}\\cdot n_{\\mathrm{saltos}}"
  },
  "rutas": {
   "regla": "Rutas",
   "valor": "Mínimo de saltos, empate a partes iguales; en corte se sustituye el salto fallido por el arco opuesto (FRR facility) sin reoptimizar",
   "seccion": "6.4.3; A11.7",
   "tex": null
  },
  "fuente": [
   {
    "doc": "Memoria conjunta v7",
    "seccion": "6.4.1; 6.4.3; 6.4.4; 2.7.2",
    "v7": true
   }
  ],
  "nota_km": "estimación de mapa ×1,4, no longitud de fibra verificada"
 },
 "radio_latencia": [
  {
   "banda": "n28",
   "ms": 2.0,
   "fuente": [
    {
     "doc": "Memoria_Subgrupo_3_1_ACUMULADA_FINAL_rev15-11.pdf",
     "seccion": "§1.2 y §2 (tablas baseline y parámetros RF 2.2), p. 4-5",
     "v7": false
    }
   ]
  },
  {
   "banda": "n78",
   "ms": 3.9,
   "fuente": [
    {
     "doc": "Memoria_Subgrupo_3_1_ACUMULADA_FINAL_rev15-11.pdf",
     "seccion": "§2 (baseline) y §4.7 (TDD 70/30), p. 5 y 8",
     "v7": false
    }
   ]
  },
  {
   "banda": "n258",
   "ms": 2.3,
   "fuente": [
    {
     "doc": "Memoria_Subgrupo_3_1_ACUMULADA_FINAL_rev15-11.pdf",
     "seccion": "§2 (baseline y parámetros RF), p. 5",
     "v7": false
    }
   ]
  }
 ],
 "reglas": {
  "Etiquetas de origen": {
   "regla": "Etiquetas de origen",
   "valor": "[DATA], [HYP], [CALC], [DEC]; ningún resultado validado sin ensayo (Anexo B)",
   "seccion": "2.7.1",
   "tex": null
  },
  "Unidades/notación": {
   "regla": "Unidades/notación",
   "valor": "Gbit/s o Mbit/s como DL / UL; C, N, E, S nodos Metro; DCC, DCN, DCS los DC",
   "seccion": "2.7.1",
   "tex": null
  },
  "Reserva de demanda": {
   "regla": "Reserva de demanda",
   "valor": "Única del 25 %: D = 1,25·R; no se reaplica",
   "seccion": "2.7.2",
   "tex": "D = 1{,}25\\cdot R"
  },
  "Ocupación máxima": {
   "regla": "Ocupación máxima",
   "valor": "Capacidad = D/u, u = 0,70 hora cargada normal; 0,90 pico o contingencia simple",
   "seccion": "2.7.2",
   "tex": "C = \\frac{D}{u},\\quad u = 0{,}70\\ \\text{normal};\\ 0{,}90\\ \\text{pico/fallo}"
  },
  "Pico P2": {
   "regla": "Pico P2",
   "valor": "Internet fijo y móvil ×2; voz y sensores no; separado de fallos (PM = solo móvil ×2, sensibilidad)",
   "seccion": "2.7.2; 6.4.4",
   "tex": null
  },
  "Un fallo a la vez (N−1)": {
   "regla": "Un fallo a la vez (N−1)",
   "valor": "Sin dimensionar dos fallos simultáneos ni pico+fallo",
   "seccion": "2.7.2",
   "tex": null
  },
  "Reparto entre DC": {
   "regla": "Reparto entre DC",
   "valor": "1/3 del tráfico hacia DC en normal; 1/2 por DC superviviente si cae uno",
   "seccion": "2.7.2; 2.5 (acta 10/11)",
   "tex": null
  },
  "Cabeceras de transporte": {
   "regla": "Cabeceras de transporte",
   "valor": "10 % una sola vez (F = 1,10·R_resto + 1,44·Q_VoNR); 1,44 sustituye a 1,10 para voz (144 B/100 B)",
   "seccion": "2.7.2; 3.4.1; 4.3",
   "tex": null
  },
  "Redondeo": {
   "regla": "Redondeo",
   "valor": "Canales y equipos hacia arriba",
   "seccion": "2.7.2",
   "tex": null
  },
  "Sectores equivalentes": {
   "regla": "Sectores equivalentes",
   "valor": "N = max(⌈C_DL/c_DL⌉; ⌈C_UL/c_UL⌉), C = demanda×1,25/0,70 (÷0,90 pico/fallo); no son antenas ni sitios",
   "seccion": "2.7.2; 6.2.7",
   "tex": "N = \\max\\!\\left(\\left\\lceil \\frac{C_{DL}}{c_{DL}} \\right\\rceil;\\ \\left\\lceil \\frac{C_{UL}}{c_{UL}} \\right\\rceil\\right)"
  },
  "Capacidad por sector": {
   "regla": "Capacidad por sector",
   "valor": "n28 30/15; n78 280/60 (≈40 UL con DDDSU); n258 1.440/480 Mbit/s DL/UL",
   "seccion": "6.2.1; 6.5.3",
   "tex": null
  },
  "Hora cargada": {
   "regla": "Hora cargada",
   "valor": "R = N×V×8×0,10/(30×3.600) Gbit/s (V en GB/mes); DL/UL fijo 90/10, móvil 85/15",
   "seccion": "A4; 3.1.1",
   "tex": "R = \\frac{N\\cdot V\\cdot 8\\cdot 0{,}10}{30\\cdot 3600}"
  },
  "Canales 400G": {
   "regla": "Canales 400G",
   "valor": "n = ceil[max(F_AB,F_BA)/(400u)]",
   "seccion": "6.4.3",
   "tex": "n = \\left\\lceil \\frac{\\max(F_{AB},F_{BA})}{400\\,u} \\right\\rceil"
  },
  "Latencia de transporte": {
   "regla": "Latencia de transporte",
   "valor": "5 µs/km + 20 µs/salto (+0,1 ms de cola no usada); acceso 20 km y 4 saltos ≈0,3 ms",
   "seccion": "6.4.2; A.2 A1",
   "tex": "t = 5\\,\\mu\\mathrm{s/km}\\cdot L + 20\\,\\mu\\mathrm{s}\\cdot n_{\\mathrm{saltos}}"
  },
  "Rutas": {
   "regla": "Rutas",
   "valor": "Mínimo de saltos, empate a partes iguales; en corte se sustituye el salto fallido por el arco opuesto (FRR facility) sin reoptimizar",
   "seccion": "6.4.3; A11.7",
   "tex": null
  },
  "UPF CPU": {
   "regla": "UPF CPU",
   "valor": "CPUproc = max(h·R/5; P/0,75), P = 125R/L Mpps; h = 1,10 (VoNR 1,44); +8 vCPU por instancia; CPUcap = ceil[(ΣCPUproc+8n)/u]; RAM = 4×CPU",
   "seccion": "6.7.4",
   "tex": "CPU_{proc} = \\max\\!\\left(\\frac{h\\,R}{5};\\ \\frac{P}{0{,}75}\\right),\\quad P = \\frac{125\\,R}{L}"
  },
  "Servidores Edge": {
   "regla": "Servidores Edge",
   "valor": "N = 1 + max(CPU, RAM, GPU, disco, NIC) con recursos asignables 216 vCPU, 480 GB, 12,288 TB, 4 GPU",
   "seccion": "6.7.5",
   "tex": "N = 1 + \\max(CPU, RAM, GPU, disco, NIC)"
  },
  "IMS": {
   "regla": "IMS",
   "valor": "A = 0,3·N Erl; patas = 2A; llamadas simultáneas 1,6A; C_patas = ceil[1,25·2A/(2·0,90)]; CAPS = ⌈1,25·1,6A/900/1,8⌉",
   "seccion": "6.6.2; A1–A3",
   "tex": "C_{patas} = \\left\\lceil \\frac{1{,}25\\cdot 2A}{2\\cdot 0{,}90} \\right\\rceil,\\quad A = 0{,}3\\,N"
  },
  "PON": {
   "regla": "PON",
   "valor": "N_PON = ceil[(accesos/64)×1,25/0,70]",
   "seccion": "6.1.1",
   "tex": "N_{PON} = \\left\\lceil \\frac{\\mathrm{accesos}}{64}\\cdot\\frac{1{,}25}{0{,}70} \\right\\rceil"
  },
  "LAG": {
   "regla": "LAG",
   "valor": "Reserva RSVP ≤70 % normal, ≤90 % fallo; min-links N−1",
   "seccion": "6.4.4",
   "tex": null
  },
  "Disponibilidad core": {
   "regla": "Disponibilidad core",
   "valor": "2 de 3: 3u² + 20 min/año de fallo común",
   "seccion": "A.2 A5",
   "tex": null
  }
 },
 "huecos": [
  {
   "hueco": "Sincronización PTP/SyncE/GNSS",
   "dato": "Solo una fila en la matriz de fallos: 'GNSS loss → reference clock in ≥2 DCs and holdover; no interruption; PASS si fase ≤±1,5 µs'. TR-06 (pérdida de sincronización → la celda TDD desfasada se bloquea). Sin grandmaster, perfil PTP ni SyncE.",
   "seccion": "7.1.1; 7.2.1 (TR-06)",
   "parcial": true
  },
  {
   "hueco": "Split RAN (RU/DU/CU), fronthaul/midhaul y backhaul por sitio; capa C de agregación",
   "dato": "No hay split ni fronthaul. Backhaul: solo transporte de acceso modelado como 20 km y 4 saltos (≈0,3 ms) y TR-02/TR-10 piden doble camino. Capa de agregación sin equipos.",
   "seccion": "6.7.3 (latency budget); A.2 A1; 7.2.1",
   "parcial": false
  },
  {
   "hueco": "Equipos sin modelo (banda base gNB, ONT/HGW, routers core/borde, SecGW, firewall, SIEM, HSS/UDM)",
   "dato": "Siguen sin modelo. Se citan como funciones: SecGW (IPsec N2/N3), firewalls y anti-DDoS en N6, SIEM+NWDAF, routers de borde BGP; HSS/UDM solo dimensionados (1.690.486/3.042.874 y 1.239.300/2.230.739). Router metro: Nokia 7750 SR; BNG 7750 SR-2se; servidores Dell R760/R760xa.",
   "seccion": "5.1.2; 6.6.2; 6.13",
   "parcial": false
  },
  {
   "hueco": "FTTH fuera de Alcorcón",
   "dato": "Solo Alcorcón (624 PON, 40 LT, 4 MF-14, 2 centrales lógicas). Decisión 17/11: FTTH dimensionado para abonados del operador con 25 %, no para todos los hogares.",
   "seccion": "6.1.1; 2.5",
   "parcial": false
  },
  {
   "hueco": "Dimensionado IX-Internet",
   "dato": "Salida por routers de borde con BGP peering/tránsito, IXP 'e.g. Espanix'; sin Gbit/s. Demanda total Internet fijo+móvil 3.614,24 Gbit/s con reserva (no traducida a capacidad de IX).",
   "seccion": "5.1.1; 5.2; 3.3.1",
   "parcial": false
  },
  {
   "hueco": "IPTV/CDN",
   "dato": "IPTV multicast en TC2, 5QI 7/6 en móvil, admisión por PCF y KPI de QoE; ubicación de cabeceras/CDN y perfil Mbit/s por canal pendientes para la entrega final.",
   "seccion": "6.10.2",
   "parcial": true
  },
  {
   "hueco": "L2VPN",
   "dato": "4 sedes (UPM Ciudad Universitaria, Ayto. Alcobendas, Univ. Alcalá, URJC Alcorcón), EVPN E-LAN, UNI 10 GbE (cota), 40 Gbit/s total, TC2, LSP Metro↔Metro reservan 10 Gbit/s [HYP]. Carga por vano no derivada.",
   "seccion": "6.9; 6.4.4 (Initial LSP reservations)",
   "parcial": true
  },
  {
   "hueco": "Capacidad Metro–Edge",
   "dato": "Edge = acometida local única a su nodo Metro, sin capacidad; solo la NIC de servidor (2×ConnectX-6 Dx 2×100GbE = 400 G por sentido por servidor UPF) y la carga (Edge-Centro 164,69/93,75). Corte Metro–Edge = escenario D abierto.",
   "seccion": "6.4.1; 6.4.5 (escenario D); 6.7.5",
   "parcial": false
  },
  {
   "hueco": "Capacidad de interconexión IMS",
   "dato": "Solo señalización: 973,72 CAPS externos (IMS-IBCF), 13 instancias SBC/DC. Media IMS total 186,95 Gbit/s por sentido (todas las patas, antes de reserva y reparto); no se da el caudal hacia el otro operador.",
   "seccion": "6.6.2; A2; B.1",
   "parcial": true
  },
  {
   "hueco": "Fuente primaria de hora cargada 10 %, DL/UL 90/10 y 85/15, pico ×2, VoNR 0,04, 1,5 líneas/empresa, 1,10/1,44, servicios especiales",
   "dato": "Siguen sin fuente primaria: se dan como parámetros (3.1.1) o reglas (2.7.2). Pico P2 = decisión de Dirección (actas 10/11). VoNR 0,04 Mbit/s y 1,44 se justifican por cálculo (100 B a 50 pps; 144 B en N3) [CALC], no por fuente.",
   "seccion": "3.1.1; 2.7.2; 4.3; 3.4.1",
   "parcial": false
  },
  {
   "hueco": "Perfiles horarios",
   "dato": "Una única hora cargada coincidente (10 % del volumen diario); escenarios P2 y PM (sensibilidad). Sin perfiles por hora.",
   "seccion": "3.1.1; 2.7.2; 6.4.4",
   "parcial": false
  },
  {
   "hueco": "Ubicación física de DC, Edge, metro e IX",
   "dato": "Ninguna. Solo justificaciones de zona (Norte: perfil empresarial/tecnológico/de centros de datos; Sur: demanda residencial/industrial y servicios críticos), distancias de vano estimadas por mapa ×1,4 y ubicaciones concretas solo de sedes L2VPN, hub satelital (Arganda) y escenarios.",
   "seccion": "3.1.2; 6.4.1; 6.9; 6.11",
   "parcial": false
  },
  {
   "hueco": "Ensayos",
   "dato": "Ningún ensayo ejecutado; todas las pruebas PENDING/CONDITIONED/RISK. 19 de 28 requisitos CONDICIONADOS y 2 (SCOM06, SCOM10) en RIESGO.",
   "seccion": "1; 7.1.3; 7.3.1; 8; B.1",
   "parcial": false
  }
 ],
 "contradicciones": [
  {
   "n": 1,
   "tema": "Respaldo del BNG",
   "decision": "Respaldo georredundante en otro DC, mismos 10 chasis 7750 SR-2se; 1:1 entre chasis con sincronización de estado de abonado. Criterio: DC con acometida directa al mismo nodo Metro; si no, el de camino más corto.",
   "valor": "Activos/respaldo por DC: DC-Centro 3+2=5, DC-Norte 1+0=1, DC-Sur 1+3=4 (antes 6/2/2). Centro→respaldo DC-Sur; Norte+½Este→DC-Centro; Sur+½Este→DC-Centro",
   "seccion": "6.10.1 (Geo-redundant backup, 2 tablas); 6.4.4 tabla de implementación (fila BNG); 5.1.2",
   "estado": "resuelta"
  },
  {
   "n": 2,
   "tema": "Capacidad del anillo (×400G)",
   "decision": "Referencia 6/4/4/6 (provisional, conservadora); 6/3/4/3 alternativa en evaluación (mínimo calculado); 6/2/4/3 descartada (N–E 124,03 % con corte C–N); 7/6/7/6 solo si se exige cubrir pico P2 + corte simultáneos.",
   "valor": "C–N/N–E/E–S/S–C = 6/4/4/6 ×400G (LAG 2400/1600/1600/2400 Gbit/s); plan óptico 2 enlaces × 7 λ ×400G por vano (factible por datasheet, 6/4/4/6 no cambia)",
   "seccion": "6.4.1 (Topology and optical layer), 6.4.3 (Load and channel matrix), 6.4.4, 6.4.5, 7.1.2, C.2",
   "estado": "resuelta"
  },
  {
   "n": 3,
   "tema": "Capacidad de los DC (BNG/UPF)",
   "decision": "Se adoptan las cifras de 3.2: destino funcional BNG y UPF central con reserva del 25 %.",
   "valor": "BNG 2.884,70 / 320,52 Gbit/s (10 chasis, 774.515 sesiones, 2.885 Gbit/s DL); UPF central 398,20 / 111,89 Gbit/s IP (+0,002142 UL sensores); 3 servidores R760 de UPF por DC",
   "seccion": "3.4.1 (tabla destino funcional); 6.7.2; 6.7.4; 6.10.1",
   "estado": "resuelta"
  },
  {
   "n": 4,
   "tema": "Edge (NIC y parque)",
   "decision": "Parque fijado por Dirección el 14/11: 24/7/3 servidores (Centro/Este/Sur) y 3 servidores UPF por DC. NIC Edge-Centro = 406,12 Gbit/s (cota conservadora).",
   "valor": "24 R760xa / 7 R760xa / 3 R760 + 3 R760 por DC; NIC requerida Edge-Centro 406,12 G frente a 400 G instalados en 2 UPF públicas (asignación pendiente con 2.2)",
   "seccion": "2.5 (Fleet ... Management 14/11); 6.7.5 (tablas de escenarios y Fleet verification by 2.2)",
   "estado": "resuelta"
  },
  {
   "n": 5,
   "tema": "MET-CENTRO-B (duplicar router Metro-Centro)",
   "decision": "Sigue siendo propuesta [HYP] a evaluar para la entrega final; condiciona el multihoming L2VPN en Centro.",
   "valor": "Un router de agregación por nodo Metro [HYP]; duplicación de Metro-Centro = propuesta pendiente",
   "seccion": "6.4.2; 6.4.3 (Centre node as critical point); 6.9; C.2",
   "estado": "no resuelta"
  },
  {
   "n": 6,
   "tema": "SBC de interconexión",
   "decision": "No se cierra: 5.1.2 compara SBC integrado Nokia y Ribbon SBC SWe y elige 'Carrier-grade SBC compatible con IBCF/TrGW; Ribbon como candidato especializado'; 6.13 escribe 'IBCF/TrGW (Ribbon SBC SWe)'; 6.6.2 cita '2.2 sets 13 SBC instances per DC'.",
   "valor": "Sin modelo único; 13 instancias SBC por DC (2.2); 973,72 CAPS externos a validar",
   "seccion": "5.1.2 (fila IMS border); 6.6.2 (Signalling and media); 6.13 (decisión 4)",
   "estado": "no resuelta"
  },
  {
   "n": 7,
   "tema": "Radio n78",
   "decision": "Se elige Nokia macro 64T64R MAA para n78 (n28 Nokia macro, n258 mmWave Shikra). Habrok no aparece.",
   "valor": "n78: 64T64R MAA, EIRP 77,5 dBm, Rx 24,5 dBi, NF 5 dB; modelo SKU exacto pendiente",
   "seccion": "5.1.2 (fila RAN n28/n78/n258); 6.2.2",
   "estado": "resuelta"
  },
  {
   "n": 8,
   "tema": "Interconexión de voz",
   "decision": "100 % IMS–IMS vía IBCF/SBC + TrGW; se eliminan BGCF, MGCF, SGW, IMS-MGW y el reparto 20/80. ARCO04 queda parcialmente cubierto.",
   "valor": "Interconexión IMS 876.347,4 Erl, 973,72 CAPS (ambos sentidos); 5 flujos de llamada en lugar de 7",
   "seccion": "2.5; 5.2; 6.6.1; 6.6.2 (tabla flujos 2031); C.2",
   "estado": "resuelta"
  },
  {
   "n": 9,
   "tema": "Ratios 1,307 / 1,184 / 0,404 (origen)",
   "decision": "La memoria las da como 'Calculation value' de penetración sin citar fuente (ni CNMC ni 'hipótesis'); no aclara su origen. Las fuentes primarias INE/CNMC no se citan en ninguna parte del documento.",
   "valor": "Voz móvil 1,307 líneas/hab; datos móviles 1,184; Internet fijo 0,404 accesos/hab",
   "seccion": "3.1.1 (tabla de parámetros); A1, A4; 10.3 ([G32] 'own coefficients')",
   "estado": "no resuelta"
  },
  {
   "n": 10,
   "tema": "Radio de celda, V2X, TDD",
   "decision": "Manda la memoria 3.1: radio n78 urbano ≈0,34 km (M_I=3 dB, TDD 70/30); V2X 111 vehículos por sector n28 y 48 % del UL (74 % con fallo); TDD n78 70/30 para capacidad (decisión final de 3.1) y latencia calculada con el peor caso DDDSU.",
   "valor": "n78 0,34 km; n28 urbano 2,40 km; n28 rural 3,89 km; A-2 ≈10 sitios a 3,78 km; 111 veh./48 %; 70/30 (DDDSU como riesgo: 22/179/174 sectores)",
   "seccion": "6.2.4; 6.2.6 (n78 TDD); 6.3.3; A.2 (A4); A.3",
   "estado": "resuelta"
  },
  {
   "n": 11,
   "tema": "Ocupación máxima del modelo FRR con 6/4/4/6 (interna de la memoria)",
   "decision": "6.4.4 dice 'maximum 68.76 % with 6/4/4/6 in the four cuts'; 6.4.5 da 69,12 % (E–S con corte C–N, 1.105,95 Gbit/s).",
   "valor": "68,76 % vs 69,12 %",
   "seccion": "6.4.4 (tras tabla FRR bypass) vs 6.4.5 (Conclusions ...)",
   "estado": "nueva contradicción"
  },
  {
   "n": 12,
   "tema": "Peor caso acometida C–DC-Sur (interna de la memoria)",
   "decision": "6.10.1 cita 77,29 % como peor caso actual; la tabla LAG de 6.4.4 da 77,47 % (1.859,38/2.400).",
   "valor": "77,29 % vs 77,47 %",
   "seccion": "6.10.1 (Condition for 3.2) vs 6.4.4 (tabla 400GE LAG)",
   "estado": "nueva contradicción"
  },
  {
   "n": 13,
   "tema": "Latencia hospital con app de 5 ms (interna)",
   "decision": "6.7.3: peor caso 9,9 ms (app 5 ms + corte), respaldo 9,5 ms; 6.13 da 9,4 ms normal y 9,5 respaldo, y advierte que si se confirma 9,9 el cifrado (+0,3 ms) daría 10,2 ms.",
   "valor": "9,4 / 9,5 / 9,9 ms",
   "seccion": "6.7.3 (User–Edge latency budget); 6.13 (decisión 3)",
   "estado": "nueva contradicción"
  }
 ],
 "matriz_fallos": [
  {
   "fallo": "Corte de fibra del anillo",
   "recuperacion": "FRR por el otro arco",
   "tiempo": "≤50 ms",
   "pass": "Ningún enlace >90 %"
  },
  {
   "fallo": "Pérdida de un sitio macro",
   "recuperacion": "Vecinas (≈42 % → ≤90 %) y capa n28",
   "tiempo": "compensación ≤5 min",
   "pass": "VoNR mantenida"
  },
  {
   "fallo": "Pérdida de un Edge",
   "recuperacion": "Edge en hot standby",
   "tiempo": "≤5 s (estadio ≤60 s)",
   "pass": "Latencia ≤10 ms (hospital incluido)"
  },
  {
   "fallo": "Pérdida de un DC",
   "recuperacion": "Los otros dos con 1/2 cada uno",
   "tiempo": "≤10 s",
   "pass": "Ocupación ≤90 %"
  },
  {
   "fallo": "Pico de tráfico",
   "recuperacion": "Cuotas por slice, ARP y colas",
   "tiempo": "—",
   "pass": "Servicios críticos +≤1 ms"
  },
  {
   "fallo": "Pérdida GNSS",
   "recuperacion": "Reloj de referencia en ≥2 DC y holdover",
   "tiempo": "sin interrupción",
   "pass": "Fase ≤±1,5 µs"
  },
  {
   "fallo": "Pérdida de la red terrestre en un sitio",
   "recuperacion": "Satélite OneWeb",
   "tiempo": "≤60 s",
   "pass": "Solo servicios prioritarios"
  }
 ]
};
if (typeof window !== 'undefined') window.ARQ = ARQ;
if (typeof module !== 'undefined' && module.exports) module.exports = ARQ;
