// Generado por fusionar.py (escribir_radio) — no editar a mano.
// Fuente: memoria conjunta v7 (Entrega 2), §6.2, §6.3 y §6.7.3. Origen de cada área en `origen`.
var RADIO = {
 "meta": {
  "fuente": "Entrega 2 · memoria conjunta v7 (texto, §6.2–§6.3 y §6.7.3)",
  "generado_por": "fusionar.py (escribir_radio)",
  "origenes": {
   "documento": "cifra copiada de la v7",
   "supuesto": "posición/forma o extrapolación del simulador (motivo en `supuesto`)",
   "calculado": "cálculo del simulador con una regla de la v7"
  },
  "aviso": "Sectores equivalentes = medida de capacidad, no antenas instaladas. Las áreas por zona son de dibujo, no mapas de cobertura (faltan mapa RF e interferencia simulada, §6.2.4)."
 },
 "bandas": [
  {
   "id": "n28",
   "frecuencia": "700 MHz",
   "duplex": "FDD",
   "ancho": "2×10 MHz",
   "scs_khz": 15,
   "sector_mbps": {
    "dl": 30,
    "ul": 15
   },
   "rol": {
    "es": "Cobertura macro, rural, continuidad y movilidad",
    "en": "Macro coverage, rural, continuity and mobility support"
   },
   "pire_dbm": 69.5,
   "g_rx_dbi": 16,
   "nf_db": 5,
   "ue": "23 dBm; NF 9 dB",
   "perdida_cuerpo_db": 3,
   "latencia_p95_ms": 2.0,
   "tdd": null,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.1 (capas), §6.2.2 (RF), §6.7.3 (P95 radio de ida por banda)"
  },
  {
   "id": "n78",
   "frecuencia": "3,5 GHz",
   "duplex": "TDD",
   "ancho": "100 MHz",
   "scs_khz": 30,
   "sector_mbps": {
    "dl": 280,
    "ul": 60
   },
   "rol": {
    "es": "Capacidad urbana y capa sub-6 principal",
    "en": "Urban capacity and main sub-6 layer"
   },
   "pire_dbm": 77.5,
   "g_rx_dbi": 24.5,
   "nf_db": 5,
   "ue": "23 dBm; NF 9 dB",
   "perdida_cuerpo_db": 3,
   "latencia_p95_ms": 3.9,
   "tdd": "70/30 DL/UL (decisión de 3.1); con DDDSU (~20 % UL) bajaría de ~60 a ~40 Mbit/s UL por sector (§6.2.6)",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.1, §6.2.2, §6.2.6 (TDD), §6.7.3"
  },
  {
   "id": "n258",
   "frecuencia": "26 GHz",
   "duplex": "TDD",
   "ancho": "400 MHz",
   "scs_khz": 120,
   "sector_mbps": {
    "dl": 1440,
    "ul": 480
   },
   "rol": {
    "es": "Hotspots y densidad extrema, sobre todo el estadio",
    "en": "Hotspots and extreme density, especially the Stadium"
   },
   "pire_dbm": 60,
   "g_rx_dbi": 23,
   "nf_db": 10,
   "ue": "PIRE UL 22,4 dBm; NF 9 dB",
   "perdida_cuerpo_db": 4,
   "latencia_p95_ms": 2.3,
   "tdd": null,
   "nota": "No se usa como capa territorial (§6.2.4; en Batres ≈0,13 km, §6.2.5). Evolución a 800 MHz (8×100 MHz) supeditada a terminales (§6.3.1).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.1, §6.2.2, §6.3.1, §6.7.3"
  }
 ],
 "zonas": [
  {
   "id": "CENTRO",
   "nombre": {
    "es": "Centro",
    "en": "Centre"
   },
   "sectores_n78": 2353,
   "ul_gbps": 141.14,
   "municipios": [
    "Z-MADRID"
   ],
   "limita": "UL",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7 (Centre 141,14 Gbit/s UL / 60 Mbit/s = 2 353 sectores n78; North 125; East 234; South 498)"
  },
  {
   "id": "NORTE",
   "nombre": {
    "es": "Norte",
    "en": "North"
   },
   "sectores_n78": 125,
   "ul_gbps": null,
   "municipios": [
    "Z-ALCOBENDAS",
    "Z-TRESCANTOS",
    "Z-TALAMANCA"
   ],
   "limita": "UL",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7 (Centre 141,14 Gbit/s UL / 60 Mbit/s = 2 353 sectores n78; North 125; East 234; South 498)"
  },
  {
   "id": "ESTE",
   "nombre": {
    "es": "Este",
    "en": "East"
   },
   "sectores_n78": 234,
   "ul_gbps": null,
   "municipios": [
    "Z-TORREJON",
    "Z-ALCALA",
    "Z-LOSSANTOS"
   ],
   "limita": "UL",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7 (Centre 141,14 Gbit/s UL / 60 Mbit/s = 2 353 sectores n78; North 125; East 234; South 498)"
  },
  {
   "id": "SUR",
   "nombre": {
    "es": "Sur",
    "en": "South"
   },
   "sectores_n78": 498,
   "ul_gbps": null,
   "municipios": [
    "Z-GETAFE",
    "Z-LEGANES",
    "Z-FUENLABRADA",
    "Z-ALCORCON",
    "Z-BATRES"
   ],
   "limita": "UL",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7 (Centre 141,14 Gbit/s UL / 60 Mbit/s = 2 353 sectores n78; North 125; East 234; South 498)"
  }
 ],
 "territorial": {
  "capacidad_dl_gbps": 828.74,
  "capacidad_ul_gbps": 192.49,
  "sectores_n78": 3210,
  "sitios_trisector": 1071,
  "regla": "C = demanda × 1,25 / 0,70 (÷ 0,90 en pico o fallo); N = max(⌈C_DL/c_DL⌉; ⌈C_UL/c_UL⌉)",
  "regla_sitios": "Resto de municipios: N = max(cobertura, capacidad), hexágono de 0,300 km² urbano o 39,3 km² rural; atajo urbano ≈1 sitio por 4 600 habitantes",
  "nota": "Un sector equivalente es una medida de capacidad, no una antena instalada.",
  "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, A4–A5"
 },
 "municipios": {
  "Z-MADRID": {
   "zona_v7": "CENTRO",
   "rural": false,
   "poblacion": 3663025,
   "sitios": 785,
   "sectores_n78": 2353,
   "origen_sitios": "calculado",
   "nota": "La zona Centro es solo Madrid: sus 2 353 sectores n78 son los del municipio. Sitios = ⌈2 353/3⌉ (tri-sector), cálculo del simulador; la v7 solo da el total de 1 071 sitios.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-ALCOBENDAS": {
   "zona_v7": "NORTE",
   "rural": false,
   "poblacion": 131549,
   "sitios": 29,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-TRESCANTOS": {
   "zona_v7": "NORTE",
   "rural": false,
   "poblacion": 58281,
   "sitios": 13,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-TALAMANCA": {
   "zona_v7": "NORTE",
   "rural": true,
   "poblacion": 4918,
   "sitios": null,
   "sectores_n78": null,
   "origen_sitios": null,
   "nota": "Sitios y sectores del municipio no especificado en v7. La v7 usa Batres como caso rural tipo (§2.5, §6.2.5).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-TORREJON": {
   "zona_v7": "ESTE",
   "rural": false,
   "poblacion": 149759,
   "sitios": 33,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-ALCALA": {
   "zona_v7": "ESTE",
   "rural": false,
   "poblacion": 210341,
   "sitios": 46,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-LOSSANTOS": {
   "zona_v7": "ESTE",
   "rural": true,
   "poblacion": 2977,
   "sitios": null,
   "sectores_n78": null,
   "origen_sitios": null,
   "nota": "Sitios y sectores del municipio no especificado en v7. La v7 usa Batres como caso rural tipo (§2.5, §6.2.5).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-GETAFE": {
   "zona_v7": "SUR",
   "rural": false,
   "poblacion": 199414,
   "sitios": 43,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-LEGANES": {
   "zona_v7": "SUR",
   "rural": false,
   "poblacion": 199738,
   "sitios": 43,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-FUENLABRADA": {
   "zona_v7": "SUR",
   "rural": false,
   "poblacion": 193488,
   "sitios": 42,
   "sectores_n78": null,
   "origen_sitios": "calculado",
   "nota": "Reparto por municipio no especificado en v7 (solo el total de la zona). Sitios ≈ población 2031 / 4 600: atajo urbano de la v7 §6.2.7, aplicado por el simulador.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7"
  },
  "Z-ALCORCON": {
   "zona_v7": "SUR",
   "rural": false,
   "poblacion": 180228,
   "sitios": 39,
   "sectores_n78": 116,
   "origen_sitios": "documento",
   "nota": "39 sitios tri-sector (39 por capacidad frente a 38 por cobertura sobre ≈12 km² poblados [HYP v7]).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.2.4"
  },
  "Z-BATRES": {
   "zona_v7": "SUR",
   "rural": true,
   "poblacion": 2014,
   "sitios": 1,
   "sectores_n78": null,
   "origen_sitios": "documento",
   "nota": "1 sitio n28 + n78.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.2.5"
  }
 },
 "areas": [
  {
   "id": "R-Z-MADRID-n28",
   "banda": "n28",
   "zona": "Z-MADRID",
   "tipo": "zona",
   "titulo": {
    "es": "Madrid · n28 (zona)",
    "en": "Madrid · n28 (zone)"
   },
   "centro": [
    40.4168,
    -3.7038
   ],
   "radio_m": 4976,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Madrid.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 785,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 77.79,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-MADRID-n78",
   "banda": "n78",
   "zona": "Z-MADRID",
   "tipo": "zona",
   "titulo": {
    "es": "Madrid · n78 (zona)",
    "en": "Madrid · n78 (zone)"
   },
   "centro": [
    40.4168,
    -3.7038
   ],
   "radio_m": 4976,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Madrid.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": 2353,
   "sitios": 785,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 77.79,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCOBENDAS-n28",
   "banda": "n28",
   "zona": "Z-ALCOBENDAS",
   "tipo": "zona",
   "titulo": {
    "es": "Alcobendas · n28 (zona)",
    "en": "Alcobendas · n28 (zone)"
   },
   "centro": [
    40.5475,
    -3.642
   ],
   "radio_m": 943,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Alcobendas.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 29,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 2.79,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCOBENDAS-n78",
   "banda": "n78",
   "zona": "Z-ALCOBENDAS",
   "tipo": "zona",
   "titulo": {
    "es": "Alcobendas · n78 (zona)",
    "en": "Alcobendas · n78 (zone)"
   },
   "centro": [
    40.5475,
    -3.642
   ],
   "radio_m": 943,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Alcobendas.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 29,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 2.79,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-TRESCANTOS-n28",
   "banda": "n28",
   "zona": "Z-TRESCANTOS",
   "tipo": "zona",
   "titulo": {
    "es": "Tres Cantos · n28 (zona)",
    "en": "Tres Cantos · n28 (zone)"
   },
   "centro": [
    40.6006,
    -3.7084
   ],
   "radio_m": 628,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Tres Cantos.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 13,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 1.24,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-TRESCANTOS-n78",
   "banda": "n78",
   "zona": "Z-TRESCANTOS",
   "tipo": "zona",
   "titulo": {
    "es": "Tres Cantos · n78 (zona)",
    "en": "Tres Cantos · n78 (zone)"
   },
   "centro": [
    40.6006,
    -3.7084
   ],
   "radio_m": 628,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Tres Cantos.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 13,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 1.24,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-TALAMANCA-n28",
   "banda": "n28",
   "zona": "Z-TALAMANCA",
   "tipo": "celda",
   "titulo": {
    "es": "Talamanca de Jarama · n28 rural",
    "en": "Talamanca de Jarama · n28 rural"
   },
   "centro": [
    40.7445,
    -3.51
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Se aplica el caso rural tipo de Batres (§6.2.5) a Talamanca de Jarama; la v7 no calcula este municipio por separado (§2.5). Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 3.89,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "sitios": null,
   "lectura": "Orden de magnitud defendible ≈4 km; 8 km no demostrado. Un hexágono ideal de R≈3,89 km supera los 21,6 km² de Batres, pero no valida un único sitio (faltan terreno, clutter y huecos).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-Z-TALAMANCA-n78",
   "banda": "n78",
   "zona": "Z-TALAMANCA",
   "tipo": "celda",
   "titulo": {
    "es": "Talamanca de Jarama · n78 núcleo",
    "en": "Talamanca de Jarama · n78 core"
   },
   "centro": [
    40.7445,
    -3.51
   ],
   "radio_m": 540,
   "origen": "supuesto",
   "supuesto": "Se aplica el caso rural tipo de Batres (§6.2.5) a Talamanca de Jarama; la v7 no calcula este municipio por separado (§2.5). Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 0.54,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "lectura": "Refuerzo de capacidad, no capa rural principal.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-Z-TORREJON-n28",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "zona",
   "titulo": {
    "es": "Torrejón de Ardoz · n28 (zona)",
    "en": "Torrejón de Ardoz · n28 (zone)"
   },
   "centro": [
    40.457,
    -3.478
   ],
   "radio_m": 1006,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Torrejón de Ardoz.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 33,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 3.18,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-TORREJON-n78",
   "banda": "n78",
   "zona": "Z-TORREJON",
   "tipo": "zona",
   "titulo": {
    "es": "Torrejón de Ardoz · n78 (zona)",
    "en": "Torrejón de Ardoz · n78 (zone)"
   },
   "centro": [
    40.457,
    -3.478
   ],
   "radio_m": 1006,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Torrejón de Ardoz.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 33,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 3.18,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCALA-n28",
   "banda": "n28",
   "zona": "Z-ALCALA",
   "tipo": "zona",
   "titulo": {
    "es": "Alcalá de Henares · n28 (zona)",
    "en": "Alcalá de Henares · n28 (zone)"
   },
   "centro": [
    40.4819,
    -3.3635
   ],
   "radio_m": 1192,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Alcalá de Henares.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 46,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 4.46,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCALA-n78",
   "banda": "n78",
   "zona": "Z-ALCALA",
   "tipo": "zona",
   "titulo": {
    "es": "Alcalá de Henares · n78 (zona)",
    "en": "Alcalá de Henares · n78 (zone)"
   },
   "centro": [
    40.4819,
    -3.3635
   ],
   "radio_m": 1192,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Alcalá de Henares.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 46,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 4.46,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-LOSSANTOS-n28",
   "banda": "n28",
   "zona": "Z-LOSSANTOS",
   "tipo": "celda",
   "titulo": {
    "es": "Los Santos de la Humosa · n28 rural",
    "en": "Los Santos de la Humosa · n28 rural"
   },
   "centro": [
    40.5,
    -3.256
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Se aplica el caso rural tipo de Batres (§6.2.5) a Los Santos de la Humosa; la v7 no calcula este municipio por separado (§2.5). Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 3.89,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "sitios": null,
   "lectura": "Orden de magnitud defendible ≈4 km; 8 km no demostrado. Un hexágono ideal de R≈3,89 km supera los 21,6 km² de Batres, pero no valida un único sitio (faltan terreno, clutter y huecos).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-Z-LOSSANTOS-n78",
   "banda": "n78",
   "zona": "Z-LOSSANTOS",
   "tipo": "celda",
   "titulo": {
    "es": "Los Santos de la Humosa · n78 núcleo",
    "en": "Los Santos de la Humosa · n78 core"
   },
   "centro": [
    40.5,
    -3.256
   ],
   "radio_m": 540,
   "origen": "supuesto",
   "supuesto": "Se aplica el caso rural tipo de Batres (§6.2.5) a Los Santos de la Humosa; la v7 no calcula este municipio por separado (§2.5). Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 0.54,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "lectura": "Refuerzo de capacidad, no capa rural principal.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-Z-GETAFE-n28",
   "banda": "n28",
   "zona": "Z-GETAFE",
   "tipo": "zona",
   "titulo": {
    "es": "Getafe · n28 (zona)",
    "en": "Getafe · n28 (zone)"
   },
   "centro": [
    40.3083,
    -3.7327
   ],
   "radio_m": 1161,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Getafe.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 43,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 4.23,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-GETAFE-n78",
   "banda": "n78",
   "zona": "Z-GETAFE",
   "tipo": "zona",
   "titulo": {
    "es": "Getafe · n78 (zona)",
    "en": "Getafe · n78 (zone)"
   },
   "centro": [
    40.3083,
    -3.7327
   ],
   "radio_m": 1161,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Getafe.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 43,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 4.23,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-LEGANES-n28",
   "banda": "n28",
   "zona": "Z-LEGANES",
   "tipo": "zona",
   "titulo": {
    "es": "Leganés · n28 (zona)",
    "en": "Leganés · n28 (zone)"
   },
   "centro": [
    40.3281,
    -3.7644
   ],
   "radio_m": 1162,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Leganés.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 43,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 4.24,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-LEGANES-n78",
   "banda": "n78",
   "zona": "Z-LEGANES",
   "tipo": "zona",
   "titulo": {
    "es": "Leganés · n78 (zona)",
    "en": "Leganés · n78 (zone)"
   },
   "centro": [
    40.3281,
    -3.7644
   ],
   "radio_m": 1162,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Leganés.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 43,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 4.24,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-FUENLABRADA-n28",
   "banda": "n28",
   "zona": "Z-FUENLABRADA",
   "tipo": "zona",
   "titulo": {
    "es": "Fuenlabrada · n28 (zona)",
    "en": "Fuenlabrada · n28 (zone)"
   },
   "centro": [
    40.2842,
    -3.7942
   ],
   "radio_m": 1144,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Fuenlabrada.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 42,
   "origen_sitios": "calculado",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 4.11,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-FUENLABRADA-n78",
   "banda": "n78",
   "zona": "Z-FUENLABRADA",
   "tipo": "zona",
   "titulo": {
    "es": "Fuenlabrada · n78 (zona)",
    "en": "Fuenlabrada · n78 (zone)"
   },
   "centro": [
    40.2842,
    -3.7942
   ],
   "radio_m": 1144,
   "origen": "supuesto",
   "supuesto": "Área de dibujo de la zona (mismo círculo que la capa B, √población × 2,6 m), no área de cobertura calculada: la v7 no da el contorno desplegado de Fuenlabrada.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 42,
   "origen_sitios": "calculado",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 4.11,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCORCON-n28",
   "banda": "n28",
   "zona": "Z-ALCORCON",
   "tipo": "zona",
   "titulo": {
    "es": "Alcorcón · n28 (zona)",
    "en": "Alcorcón · n28 (zone)"
   },
   "centro": [
    40.3458,
    -3.8249
   ],
   "radio_m": 1954,
   "origen": "supuesto",
   "supuesto": "Círculo de igual área que los ≈12 km² poblados de Alcorcón [HYP v7 §6.2.7]; la forma y el centro los pone el simulador.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": null,
   "sitios": 39,
   "origen_sitios": "documento",
   "lectura": "Capa de alcance (UL limita): continuidad y movilidad bajo la capa n78.",
   "area_km2": 11.99,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-Z-ALCORCON-n78",
   "banda": "n78",
   "zona": "Z-ALCORCON",
   "tipo": "zona",
   "titulo": {
    "es": "Alcorcón · n78 (zona)",
    "en": "Alcorcón · n78 (zone)"
   },
   "centro": [
    40.3458,
    -3.8249
   ],
   "radio_m": 1954,
   "origen": "supuesto",
   "supuesto": "Círculo de igual área que los ≈12 km² poblados de Alcorcón [HYP v7 §6.2.7]; la forma y el centro los pone el simulador.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "radios_de": "Alcorcón (caso urbano tipo, UMa NLOS)",
   "modelo": "3GPP TR 38.901 UMa NLOS (caso Alcorcón)",
   "sectores_n78": 116,
   "sitios": 39,
   "origen_sitios": "documento",
   "lectura": "Capa de capacidad urbana; los sectores son mínimos de capacidad, no radios físicas.",
   "area_km2": 11.99,
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.7"
  },
  {
   "id": "R-ALCORCON-CELDA-n28",
   "banda": "n28",
   "zona": "Z-ALCORCON",
   "tipo": "celda_ref",
   "titulo": {
    "es": "Alcorcón · celda de referencia n28",
    "en": "Alcorcón · reference cell n28"
   },
   "centro": [
    40.3458,
    -3.8249
   ],
   "radio_m": 2400,
   "origen": "supuesto",
   "supuesto": "Una celda de radio UL dibujada en el centro del municipio para dar la escala; las posiciones de los 39 sitios no especificado en v7.",
   "radio_ul_km": 2.4,
   "radio_dl_km": ">5",
   "mapl_dl_ul": "169,05 / 142,55 dB",
   "modelo": "3GPP TR 38.901 UMa NLOS; M_I = 3 dB; TDD 70/30 [HYP]",
   "lectura": "El UL limita; capa de alcance.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.6"
  },
  {
   "id": "R-ALCORCON-CELDA-n78",
   "banda": "n78",
   "zona": "Z-ALCORCON",
   "tipo": "celda_ref",
   "titulo": {
    "es": "Alcorcón · celda de referencia n78",
    "en": "Alcorcón · reference cell n78"
   },
   "centro": [
    40.3458,
    -3.8249
   ],
   "radio_m": 340,
   "origen": "supuesto",
   "supuesto": "Una celda de radio UL dibujada en el centro del municipio para dar la escala; las posiciones de los 39 sitios no especificado en v7.",
   "radio_ul_km": 0.34,
   "radio_dl_km": 1.26,
   "mapl_dl_ul": "145,53 / 123,45 dB",
   "modelo": "3GPP TR 38.901 UMa NLOS; M_I = 3 dB; TDD 70/30 [HYP]",
   "lectura": "El UL limita. n78 50/10 Mbit/s en el borde de celda; M_I 0/1/3/6 dB → 0,41/0,38/0,34/0,29 km (§6.2.6).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.4, §6.2.6"
  },
  {
   "id": "R-Z-BATRES-n28",
   "banda": "n28",
   "zona": "Z-BATRES",
   "tipo": "celda",
   "titulo": {
    "es": "Batres · n28 rural",
    "en": "Batres · n28 rural"
   },
   "centro": [
    40.2095,
    -3.922
   ],
   "radio_m": 3890,
   "origen": "documento",
   "supuesto": "Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 3.89,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "sitios": 1,
   "lectura": "Orden de magnitud defendible ≈4 km; 8 km no demostrado. Un hexágono ideal de R≈3,89 km supera los 21,6 km² de Batres, pero no valida un único sitio (faltan terreno, clutter y huecos).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-Z-BATRES-n78",
   "banda": "n78",
   "zona": "Z-BATRES",
   "tipo": "celda",
   "titulo": {
    "es": "Batres · n78 núcleo",
    "en": "Batres · n78 core"
   },
   "centro": [
    40.2095,
    -3.922
   ],
   "radio_m": 540,
   "origen": "documento",
   "supuesto": "Sitio único dibujado en el centro del municipio (posición del sitio no especificado en v7).",
   "radio_ul_km": 0.54,
   "radio_dl_km": null,
   "modelo": "3GPP TR 38.901 RMa NLOS",
   "lectura": "Refuerzo de capacidad, no capa rural principal.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.5"
  },
  {
   "id": "R-ESTADIO-n258",
   "banda": "n258",
   "zona": "Z-MADRID",
   "tipo": "hotspot",
   "titulo": {
    "es": "Estadio Metropolitano · n258",
    "en": "Metropolitano Stadium · n258"
   },
   "centro": [
    40.4362,
    -3.5995
   ],
   "radio_m": 37,
   "origen": "supuesto",
   "supuesto": "Radio UL ≈37 m a ±45° (cota de planificación de la v7) dibujado una vez en el estadio: la geometría de haces y el número físico de small cells están no especificado en v7.",
   "radio_ul_km": 0.037,
   "radios_haz": "centro ≈55 m · ±30° ≈46 m · ±45° ≈37 m · ±60° ≈27 m",
   "modelo": "3GPP UMi Street Canyon NLOS, hBS 10 m, hUT 1,5 m, M_SF ≈12,9 dB, M_I 3 dB",
   "capacidad_gbps": {
    "dl": 235.27,
    "ul": 126.79
   },
   "sectores": 265,
   "lectura": "265 sectores n258 equivalentes a 400 MHz (UL limita); ≈133 a 800 MHz como evolución. No son 265 antenas nuevas: arquitectura híbrida con el DAS existente (≈250 antenas, 39 sectores sub-6).",
   "latencia_ms": {
    "radio": 2.3,
    "normal": 3.8,
    "respaldo": 4.1
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.1, §6.7.3"
  },
  {
   "id": "R-ESTADIO-n78",
   "banda": "n78",
   "zona": "Z-MADRID",
   "tipo": "punto",
   "forma": "punto",
   "titulo": {
    "es": "Estadio Metropolitano · n78 de respaldo",
    "en": "Metropolitano Stadium · n78 backup"
   },
   "centro": [
    40.4362,
    -3.5995
   ],
   "radio_m": null,
   "origen": "documento",
   "lectura": "La v7 reutiliza fibra, salas y la capa sub-6 compatible y añade n258 en los puntos calientes; radio y sectores de la capa n78 del recinto no especificado en v7.",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.3.1"
  },
  {
   "id": "R-HOSPITAL-n78",
   "banda": "n78",
   "zona": "Z-GETAFE",
   "tipo": "indoor",
   "forma": "punto",
   "titulo": {
    "es": "Hospital de Getafe · n78 indoor",
    "en": "Getafe Hospital · n78 indoor"
   },
   "centro": [
    40.3027,
    -3.74
   ],
   "radio_m": null,
   "origen": "documento",
   "radio_nota": "Radio de celda no especificado en v7 (indoor; falta plano de planta y simulación de interferencia).",
   "capacidad_gbps": {
    "dl": 0.714,
    "ul": 0.861
   },
   "sectores": 15,
   "equipo": "Nokia AirScale Indoor Radio ASiR-pRRH AWHQA, n78 3,4–3,6 GHz, 4T4R, 4×250 mW, ≈30 dBm PIRE",
   "lectura": "15 sectores n78 equivalentes en operación normal; dos cadenas A/B independientes de 10 pico-RRH (20 en total, cámaras por fibra). Con DDDSU harían falta 22.",
   "latencia_ms": {
    "radio": 3.9,
    "normal": 7.4,
    "respaldo": 7.5
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.6, §6.2.7, §6.3.2, §6.7.3"
  },
  {
   "id": "R-A2-n28-01",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 1 de 10",
    "en": "A-2 V2X · n28 site 1 of 10"
   },
   "centro": [
    40.4385,
    -3.66
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-02",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 2 de 10",
    "en": "A-2 V2X · n28 site 2 of 10"
   },
   "centro": [
    40.44249,
    -3.61916
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-03",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 3 de 10",
    "en": "A-2 V2X · n28 site 3 of 10"
   },
   "centro": [
    40.44648,
    -3.57833
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-04",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 4 de 10",
    "en": "A-2 V2X · n28 site 4 of 10"
   },
   "centro": [
    40.44949,
    -3.53735
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-05",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 5 de 10",
    "en": "A-2 V2X · n28 site 5 of 10"
   },
   "centro": [
    40.45386,
    -3.49658
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-06",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 6 de 10",
    "en": "A-2 V2X · n28 site 6 of 10"
   },
   "centro": [
    40.46292,
    -3.45754
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-07",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 7 de 10",
    "en": "A-2 V2X · n28 site 7 of 10"
   },
   "centro": [
    40.47565,
    -3.41991
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-08",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 8 de 10",
    "en": "A-2 V2X · n28 site 8 of 10"
   },
   "centro": [
    40.48975,
    -3.38314
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-09",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 9 de 10",
    "en": "A-2 V2X · n28 site 9 of 10"
   },
   "centro": [
    40.51022,
    -3.35283
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-A2-n28-10",
   "banda": "n28",
   "zona": "Z-TORREJON",
   "tipo": "corredor",
   "grupo": "A-2",
   "titulo": {
    "es": "A-2 V2X · sitio n28 10 de 10",
    "en": "A-2 V2X · n28 site 10 of 10"
   },
   "centro": [
    40.534,
    -3.326
   ],
   "radio_m": 3890,
   "origen": "supuesto",
   "supuesto": "Los 10 sitios se reparten a distancias iguales sobre el trazado del simulador (≈31.4 km); la v7 da el número y el espaciado medio (≈3,78 km), no las posiciones.",
   "radio_ul_km": 3.89,
   "modelo": "RMa NLOS como aproximación del corredor [CALC/HYP]",
   "sitios": 10,
   "capacidad_gbps": {
    "dl": 0.064,
    "ul": 0.064
   },
   "lectura": "Ancla V2X en n28 FDD (2,0 ms de radio frente a 3,9 en n78; un traspaso cada ≈113 s). 7 sitios a ≈5,67 km bastan en normal; 10 a ≈3,78 km para N−1 (criterio ≤3,9 km). V2X ocupa el 48 % del UL de un sector n28. Segunda pata n78 (R_UL ≈0,54 km, duplicación PDCP): número de sitios n78 no especificado en v7.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 5.5,
    "respaldo": 5.8
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.3, §6.7.3"
  },
  {
   "id": "R-VALDEBEBAS-n28",
   "banda": "n28",
   "zona": "Z-MADRID",
   "tipo": "celda",
   "titulo": {
    "es": "Valdebebas · 95 000 sensores (proxy n28)",
    "en": "Valdebebas · 95,000 sensors (n28 proxy)"
   },
   "centro": [
    40.4815,
    -3.618
   ],
   "radio_m": 2400,
   "origen": "supuesto",
   "supuesto": "Radio de planificación de la v7 dibujado en el emplazamiento del servicio; el polígono real y los sitios no especificado en v7.",
   "radio_ul_km": 2.4,
   "modelo": "proxy n28 [HYP/CALC] para NB-IoT/LTE-M",
   "lectura": "mMTC, DNN iot-ciudad, UPF central. Informes de ≤64 B: 7 portadoras NB-IoT repartidas en ≥3 sectores (≈2,3 por sector, 29 % del máximo de 8).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.3.4"
  },
  {
   "id": "R-VALDEBEBAS-n78",
   "banda": "n78",
   "zona": "Z-MADRID",
   "tipo": "celda",
   "titulo": {
    "es": "Valdebebas · 5 000 cámaras (n78)",
    "en": "Valdebebas · 5,000 cameras (n78)"
   },
   "centro": [
    40.4815,
    -3.618
   ],
   "radio_m": 340,
   "origen": "supuesto",
   "supuesto": "Una celda de radio ≈0,34 km dibujada en el emplazamiento para dar la escala; las posiciones de los ≈40 sitios no especificado en v7.",
   "radio_ul_km": 0.34,
   "modelo": "n78 UMa (caso Alcorcón) [HYP/CALC]",
   "capacidad_gbps": {
    "dl": null,
    "ul": 7.14
   },
   "sectores": 120,
   "sitios": 40,
   "lectura": "≈5,002 Gbit/s UL con +25 %; 120 sectores n78 (≈40 sitios tri-sector), 179 con DDDSU. Cámaras RedCap a Edge-Centro (respaldo Edge-Este).",
   "latencia_ms": {
    "radio": 4.4,
    "normal": 5.9,
    "respaldo": 6.2
   },
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.6, §6.2.7, §6.3.4, §6.7.3"
  },
  {
   "id": "R-PRIVADA-n78",
   "banda": "n78",
   "zona": "Z-GETAFE",
   "tipo": "indoor",
   "forma": "rectangulo",
   "titulo": {
    "es": "Red privada Sur · n78 en nave",
    "en": "South private network · n78 in warehouse"
   },
   "centro": [
    40.315,
    -3.713
   ],
   "lado_m": [
    200,
    100
   ],
   "radio_m": null,
   "origen": "supuesto",
   "supuesto": "Nave tipo de 200 × 100 m [HYP v7] dibujada en el emplazamiento del servicio y orientada este-oeste por el simulador.",
   "capacidad_gbps": {
    "dl": 0.125,
    "ul": 0.286
   },
   "sectores": 9,
   "lectura": "9 sectores n78 en rejilla 3×3 (con 5 el cliente tomaría el 94 % del UL, por encima de la cuota del 80 %; 9 cumplen el 55 % también con un sector caído). Por cobertura bastarían 3 celdas.",
   "latencia_ms": {
    "radio": 2.0,
    "normal": 3.5,
    "respaldo": 3.6
   },
   "latencia_nota": "P95 del control de AGV por n28 (§6.7.3).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.2.7, §6.3.5, §6.7.3"
  },
  {
   "id": "R-PRIVADA-n28",
   "banda": "n28",
   "zona": "Z-GETAFE",
   "tipo": "celda",
   "titulo": {
    "es": "Red privada Sur · control de AGV (n28 macro)",
    "en": "South private network · AGV control (n28 macro)"
   },
   "centro": [
    40.315,
    -3.713
   ],
   "radio_m": 600,
   "origen": "supuesto",
   "supuesto": "Círculo de 0,6 km (distancia máxima al macro n28 según la v7) centrado en la nave; la posición del macro no especificado en v7.",
   "radio_ul_km": 0.6,
   "lectura": "Control de AGV (0,2 Mbit/s UL por AGV, 5QI 82) por el macro n28 a ≤0,6 km; cuota crítica n28 ≈24 % (25 %).",
   "fuente": "Entrega 2 · memoria conjunta v7 §6.3.5"
  }
 ]
};
if (typeof window !== 'undefined') window.RADIO = RADIO;
if (typeof module !== 'undefined' && module.exports) module.exports = RADIO;
