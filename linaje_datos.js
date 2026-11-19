// linaje_datos.js — GENERADO por datos/gen_linaje.py (2026-11-19). No editar a mano.
// Revisión 6 de CONTRATO_UI.md: valor → fórmula → fuentes. Ver LINAJE.md.
var LINAJE = {
 "generado": "2026-11-19",
 "generado_por": "datos/gen_linaje.py",
 "contrato": "CONTRATO_UI.md Revisión 6",
 "nota": "Estado estricto: 'trazado' solo si toda la cadena llega a INE/CNMC/ITU/enunciado/apuntes verificados. Los supuestos S-L.. son del linaje; los S-0.. son del simulador (RED.supuestos).",
 "fuentes": [
  {
   "id": "F-INE-ECP-79543",
   "tipo": "externa",
   "titulo": "Estadística Continua de Población: población residente por municipio a 1 de enero de 2025",
   "editor": "INE",
   "fecha": "2025-01-01",
   "localizador": "tabla 79543 (API servicios.ine.es/wstempus/js/ES/DATOS_TABLA/79543)",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19: Madrid 3 477 497, Alcobendas 123 222, Torrejón 144 211, Alcalá 202 549, Getafe 195 628, Leganés 195 946, Fuenlabrada 189 814, Alcorcón 176 806 (coinciden con el grupo).",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=79543"
  },
  {
   "id": "F-INE-PADRON-2881",
   "tipo": "externa",
   "titulo": "Revisión del Padrón municipal: Madrid, población por municipios y sexo (series 2015-2025)",
   "editor": "INE",
   "fecha": "2025-01-01",
   "localizador": "tabla 2881 (series DPOP… 'Total'), años 2015-2025",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19 (las 12 series). Con ellas se recalculan las pendientes MCO del grupo.",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=2881"
  },
  {
   "id": "F-INE-ADRH-31105",
   "tipo": "externa",
   "titulo": "Atlas de Distribución de Renta de los Hogares: tamaño medio del hogar por municipio (2023)",
   "editor": "INE",
   "fecha": "2023",
   "localizador": "tabla 31105, indicador 'Tamaño medio del hogar', año 2023",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19. Ojo: ya está publicado ADRH 2024 y cambia Leganés (2,7), Los Santos (2,9) y Torrejón (2,9); el grupo usa 2023.",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=31105"
  },
  {
   "id": "F-INE-DIRCE-4721",
   "tipo": "externa",
   "titulo": "Directorio Central de Empresas: empresas activas por municipio (2025)",
   "editor": "INE",
   "fecha": "2025-01-01",
   "localizador": "tabla 4721, total empresas",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19 (12 municipios).",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=4721"
  },
  {
   "id": "F-INE-TICH-76598",
   "tipo": "externa",
   "titulo": "Encuesta TIC-H 2025: viviendas con teléfono fijo por comunidad autónoma",
   "editor": "INE",
   "fecha": "2025",
   "localizador": "tabla 76598, Comunidad de Madrid, 'teléfono fijo' 62,2 % (universo 2 413 927 viviendas)",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19.",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=76598"
  },
  {
   "id": "F-CNMC-IES-2025",
   "tipo": "externa",
   "titulo": "Informe económico sectorial de las telecomunicaciones y el audiovisual 2025 (ESTAD/CNMC/003/26)",
   "editor": "CNMC",
   "fecha": "2026-06-09",
   "localizador": "ver localizador de cada valor (página/gráfico)",
   "verificada": true,
   "nota": "PDF descargado y leído el 2026-11-19. Cifras nacionales: aplicarlas a Madrid es el supuesto S-L03. El grupo cita 'CNMC p. 50' en bloque; las páginas exactas están en cada valor.",
   "url": "https://www.cnmc.es/sites/default/files/6641332.pdf"
  },
  {
   "id": "F-ITU-M2410",
   "tipo": "norma",
   "titulo": "Report ITU-R M.2410-0 (2017): Minimum requirements related to technical performance for IMT-2020",
   "editor": "ITU-R",
   "fecha": "2017-11",
   "localizador": "§4.5, Tabla 2 (p. 5): eficiencia espectral media DL/UL por TRxP",
   "verificada": true,
   "nota": "Descargado y leído el 2026-11-19: Indoor Hotspot 9 / 6,75; Dense Urban 7,8 / 5,4; Rural 3,3 / 1,6 bit/s/Hz/TRxP. Es un mínimo de evaluación IMT-2020: sirve de cota superior razonable, no de valor exacto.",
   "url": "https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-M.2410-2017-PDF-E.pdf"
  },
  {
   "id": "F-ITU-G711",
   "tipo": "norma",
   "titulo": "ITU-T G.711: Pulse code modulation (PCM) of voice frequencies",
   "editor": "ITU-T",
   "fecha": "1988",
   "localizador": "§1-2 (64 kbit/s)",
   "verificada": false,
   "nota": "No descargada. Ya no hace falta: el cálculo de la pata G.711 usa RFC 3551 (F-RFC3551), que fija PCMU/PCMA a 8 bit/muestra y 8000 Hz.",
   "url": "https://www.itu.int/rec/T-REC-G.711"
  },
  {
   "id": "F-ENUNCIADO-P2",
   "tipo": "clase",
   "titulo": "SCOM-ARCO PBL 2026-27 · Project 2: High-capacity converged network for the Madrid Metropolitan Region",
   "editor": "UPM · DIT/SSR",
   "fecha": "2026-09",
   "localizador": "S1/ARCO/00-info/Proyecto PBL/SCOM_ARCO_Project_2_Madrid_Metropolitan_2026-27_v2.pdf",
   "verificada": true,
   "nota": "Leído (pdftotext) el 2026-11-19: p3 ARCO02, ARCO03, ARCO05; p4 SCOM01, SCOM04, SCOM07."
  },
  {
   "id": "F-ARCO-NC",
   "tipo": "clase",
   "titulo": "ARCO · Network Concepts: Architecture, Models, Planes, Dimensioning, QoS",
   "editor": "UPM · ARCO",
   "fecha": "2026-27",
   "localizador": "S1/ARCO/01-apuntes/2 Network Concepts/1 Network Concepts - Architecture, Models, Planes, Dimensioning, QoS.pdf",
   "verificada": true,
   "nota": "p15 'PON Ports = Homes Passed / Split Ratio'; p20 Erlang, hora cargada, BHCA, Erlang B."
  },
  {
   "id": "F-ARCO-CS2",
   "tipo": "clase",
   "titulo": "ARCO · Control & Services Architecture, Part 2",
   "editor": "UPM · ARCO",
   "fecha": "2026-27",
   "localizador": "S1/ARCO/01-apuntes/3 Control y servicios - 5G e IMS/2 Control & Services Architecture - Part 2.pdf",
   "verificada": true,
   "nota": "p36 (diapositiva 41, ejercicio de interconexión): 'Max load 70% (overdimension 30%)'; 0,25 E/usuario."
  },
  {
   "id": "F-ARCO-FTTH100K",
   "tipo": "clase",
   "titulo": "ARCO · Ejercicio 'FTTH for 100000 clients'",
   "editor": "UPM · ARCO",
   "fecha": "2026-27",
   "localizador": "S1/ARCO/03-ejercicios/Dimensionado acceso/FTTH for 100000 clients.pdf",
   "verificada": true,
   "nota": "p2: el núcleo se dimensiona con tráfico medio por cliente en hora cargada, no con velocidades contratadas; p4/p11: '+25% headroom'; p11: 'Peak (×1.30)'; p5: 100 000 ÷ 64 puertos."
  },
  {
   "id": "F-ARCO-COVDIM",
   "tipo": "clase",
   "titulo": "ARCO · Ejercicio 'Coverage Dimension in the Access'",
   "editor": "UPM · ARCO",
   "fecha": "2026-27",
   "localizador": "S1/ARCO/03-ejercicios/Dimensionado acceso/Coverage Dimension in the Access.pdf",
   "verificada": true,
   "nota": "p10: 'XGS-PON 9.95 Gb/s ↓ 9.95 Gb/s ↑'; '1:32 and 1:64 are widely used ratios'."
  },
  {
   "id": "F-ARCO-IMS-EJ",
   "tipo": "clase",
   "titulo": "ARCO · Ejercicio IMS (EN)",
   "editor": "UPM · ARCO",
   "fecha": "2026-27",
   "localizador": "S1/ARCO/03-ejercicios/IMS/Ejercicio IMS (EN).pdf",
   "verificada": true,
   "nota": "p1: tráfico por usuario en Erlang × usuarios, duración media de llamada en hora cargada (método A = a·N, λ = A/t)."
  },
  {
   "id": "F-MEMORIA-V7",
   "tipo": "memoria",
   "titulo": "High-Capacity Converged Network for the Madrid Metropolitan Region (SCOM + ARCO, M11G3) · memoria conjunta v7",
   "editor": "Grupo M11G3",
   "fecha": "2026-11-18",
   "localizador": "S1/SCOM/09-proyecto-ARCO-SCOM/Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_conjunta_Entrega2_v7_EN_actualizado.docx",
   "verificada": true,
   "nota": "Nuestra memoria: dónde aparece cada valor, no su origen."
  },
  {
   "id": "F-G32-S1",
   "tipo": "grupo",
   "titulo": "Caracterización y modelo de tráfico · Grupo 3.2 (Semana 1)",
   "editor": "Grupo 3.2",
   "fecha": "2026-09",
   "localizador": "S1/SCOM/09-proyecto-ARCO-SCOM/Semana 1/3.2 Población y tráfico (nosotros)/Caracterizacion y modelo de trafico - Grupo 3.2.pdf",
   "verificada": true,
   "nota": "§11 y Tabla 12: regresión MCO 2015-2025 y P(2030) = P_ECP(2025)·(1 + 5·b/P_padrón(2025))."
  },
  {
   "id": "F-G32-S7",
   "tipo": "grupo",
   "titulo": "G32 Semana 7 · 3.2 Completo v08-11",
   "editor": "Grupo 3.2",
   "fecha": "2026-11-08",
   "localizador": "S1/SCOM/09-proyecto-ARCO-SCOM/Semana 7/Entrega 3.2 (2026-11-13)/G32_Semana7_3.2_Completo_v08-11.docx",
   "verificada": true,
   "nota": "Tabla 1 (parámetros y criterios), Tabla 8 (reparto por zona), A1, A4, A6."
  },
  {
   "id": "F-31-MEM",
   "tipo": "grupo",
   "titulo": "Memoria subgrupo 3.1 acumulada (rev 15-11)",
   "editor": "Grupo 3.1",
   "fecha": "2026-11-15",
   "localizador": "S1/SCOM/09-proyecto-ARCO-SCOM/Semana 8/Entrega 2 (definitivos 2026-11-18)/Memoria_Subgrupo_3_1_ACUMULADA_FINAL_rev15-11.pdf",
   "verificada": true,
   "nota": "§2 p.5: bandas, eficiencias espectrales y reparto TDD (vía datos/f0/acceso.json)."
  },
  {
   "id": "F-INE-ECP-56940",
   "tipo": "externa",
   "titulo": "Estadística Continua de Población trimestral: población residente por comunidad autónoma",
   "editor": "INE",
   "fecha": "2025-01-01",
   "localizador": "tabla 56940, 'Total. Todas las edades. Madrid, Comunidad de' y 'Total Nacional', periodo 1-1-2025",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19: Comunidad de Madrid 7 113 886; Total Nacional 49 128 297 (1-1-2025). Madrid es uniprovincial: comunidad = provincia.",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=56940"
  },
  {
   "id": "F-INE-DIRCE-39372",
   "tipo": "externa",
   "titulo": "Directorio Central de Empresas: empresas por comunidad autónoma, actividad y estrato",
   "editor": "INE",
   "fecha": "2025-01-01",
   "localizador": "tabla 39372, 'Nacional. Total. Total', 2025",
   "verificada": true,
   "nota": "Comprobado por API el 2026-11-19: 3 310 824 empresas activas en España.",
   "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=39372"
  },
  {
   "id": "F-CNMCDATA-GEO",
   "tipo": "externa",
   "titulo": "CNMCData · Telecomunicaciones Geográfico (ds_24375_1): líneas por provincia y operador",
   "editor": "CNMC",
   "fecha": "2026",
   "localizador": "recurso 84ad8266-b922-47f9-8d06-25a9a6cefb35; filtros anno=2025, provincia=Madrid, concepto=Líneas, servicio='Banda ancha fija' o 'Telefonía fija'; columna lineas_o_accesos por operador",
   "verificada": true,
   "nota": "Descargado (volcado CSV) y leído el 2026-11-19. Los totales nacionales reproducen el IES 2025 (Movistar 30,7 % BAF, 41,8 % telefonía fija) y la tasa de Movistar FTTH en Madrid (15,2/100) sale con la población INE a 1-1-2025: mismo método. La serie móvil provincial solo trae pospago y la cuenta por sede de facturación: no sirve para Madrid.",
   "url": "https://catalogodatos.cnmc.es/dataset/ds_24375_1"
  },
  {
   "id": "F-CNMCDATA-ANUAL",
   "tipo": "externa",
   "titulo": "CNMCData · Telecomunicaciones Anual Mercados (ds_24232_1)",
   "editor": "CNMC",
   "fecha": "2026",
   "localizador": "recurso 1f2e6d4f-8a9f-44f9-b775-e50f2c1de239; servicio 'Banda Ancha móvil'/'Banda ancha fija minorista'/'Telefonía fija', conceptos 'Líneas' y 'Tráfico - datos' (TB), años 2021-2025",
   "verificada": true,
   "nota": "Descargado (volcado CSV) y leído el 2026-11-19. Reproduce el IES: 356 GB/mes fijo y 14,6 GB/mes móvil en 2025.",
   "url": "https://catalogodatos.cnmc.es/dataset/ds_24232_1"
  },
  {
   "id": "F-3GPP-TS26445",
   "tipo": "norma",
   "titulo": "3GPP TS 26.445 V19.1.0: Codec for Enhanced Voice Services (EVS); Detailed algorithmic description",
   "editor": "3GPP / ETSI",
   "fecha": "2026-03",
   "localizador": "Anexo A.2.1 y Tabla A.1 (tamaños de carga útil del formato Compact)",
   "verificada": true,
   "nota": "Leído el 2026-11-19: Tabla A.1 480 bits ↔ 23,85 kbit/s y 488 bits ↔ 24,4 kbit/s; A.2.1.1 'exactly one coded frame … without any additional EVS RTP payload header', trama de 20 ms.",
   "url": "https://www.etsi.org/deliver/etsi_ts/126400_126499/126445/"
  },
  {
   "id": "F-RFC3550",
   "tipo": "norma",
   "titulo": "RFC 3550: RTP, A Transport Protocol for Real-Time Applications",
   "editor": "IETF",
   "fecha": "2003-07",
   "localizador": "§5.1 'The first twelve octets are present in every RTP packet'",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.rfc-editor.org/rfc/rfc3550"
  },
  {
   "id": "F-RFC768",
   "tipo": "norma",
   "titulo": "RFC 768: User Datagram Protocol",
   "editor": "IETF",
   "fecha": "1980-08",
   "localizador": "Formato: cabecera de 8 octetos ('the minimum value of the length is eight')",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.rfc-editor.org/rfc/rfc768"
  },
  {
   "id": "F-RFC791",
   "tipo": "norma",
   "titulo": "RFC 791: Internet Protocol",
   "editor": "IETF",
   "fecha": "1981-09",
   "localizador": "§3.1 IHL: 'the minimum value for a correct header is 5' (palabras de 32 bits = 20 octetos)",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.rfc-editor.org/rfc/rfc791"
  },
  {
   "id": "F-RFC3551",
   "tipo": "norma",
   "titulo": "RFC 3551: RTP Profile for Audio and Video Conferences with Minimal Control",
   "editor": "IETF",
   "fecha": "2003-07",
   "localizador": "Tabla 1 y §4.5.14 (PCMA/PCMU: 8 bits por muestra, 8000 Hz, paquetización por defecto 20 ms)",
   "verificada": true,
   "nota": "Leído el 2026-11-19: 160 octetos de G.711 por paquete de 20 ms.",
   "url": "https://www.rfc-editor.org/rfc/rfc3551"
  },
  {
   "id": "F-3GPP-TS29281",
   "tipo": "norma",
   "titulo": "3GPP TS 29.281 V19.2.0: GPRS Tunnelling Protocol User Plane (GTPv1-U)",
   "editor": "3GPP / ETSI",
   "fecha": "2026",
   "localizador": "§5.1 (cabecera obligatoria 8 octetos; con E=1 se añaden Sequence Number, N-PDU Number y Next Extension Header Type: +4) y §5.2.1 (longitud de cabecera de extensión en unidades de 4 octetos)",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.etsi.org/deliver/etsi_ts/129200_129299/129281/"
  },
  {
   "id": "F-3GPP-TS38415",
   "tipo": "norma",
   "titulo": "3GPP TS 38.415 V19.1.0: NG-RAN; PDU Session User Plane protocol",
   "editor": "3GPP / ETSI",
   "fecha": "2026",
   "localizador": "§5.5.2.1, Figura 5.5.2.1-1 (DL PDU SESSION INFORMATION: tipo + QFI, 4 octetos con longitud y siguiente tipo)",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.etsi.org/deliver/etsi_ts/138400_138499/138415/"
  },
  {
   "id": "F-3GPP-TS22185",
   "tipo": "norma",
   "titulo": "3GPP TS 22.185 V19.0.0: Service requirements for V2X services",
   "editor": "3GPP / ETSI",
   "fecha": "2025-10",
   "localizador": "§5.2.2 [R-5.2.2-001] 'variable message payloads of 50-300 bytes'; §5.2.3 [R-5.2.3-001] 'maximum frequency of 10 messages per second per transmitting UE'",
   "verificada": true,
   "nota": "Leído el 2026-11-19. Ojo: los 50-300 B son 'not including security-related message component(s)': la seguridad va aparte (parte del factor 1,5 del grupo).",
   "url": "https://www.etsi.org/deliver/etsi_ts/122100_122199/122185/"
  },
  {
   "id": "F-ETSI-EN302637-2",
   "tipo": "norma",
   "titulo": "ETSI EN 302 637-2 V1.4.1: ITS; Cooperative Awareness Basic Service (CAM)",
   "editor": "ETSI",
   "fecha": "2019-04",
   "localizador": "§6.1.3: T_GenCamMin = 100 ms (10 Hz máximo)",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.etsi.org/deliver/etsi_en/302600_302699/30263702/01.04.01_60/"
  },
  {
   "id": "F-BOE-26GHZ",
   "tipo": "externa",
   "titulo": "Orden ETD/114/2023, por la que se resuelve la subasta de la banda de 26 GHz (BOE-A-2023-3490)",
   "editor": "Ministerio de Asuntos Económicos y Transformación Digital · BOE",
   "fecha": "2023-02-09",
   "localizador": "Anexo (p. 19375): banda 25,10-27,50 GHz, 12 concesiones estatales; concesiones 8-12 a Telefónica Móviles España",
   "verificada": true,
   "nota": "Leído el 2026-11-19. La nota de prensa de Telefónica (21-12-2022) confirma '5 bloques de 200 MHz' = 1 GHz.",
   "url": "https://www.boe.es/boe/dias/2023/02/09/pdfs/BOE-A-2023-3490.pdf"
  },
  {
   "id": "F-BG-DATANETS",
   "tipo": "externa",
   "titulo": "Data Networks, 2.ª ed., cap. 3 'Delay Models in Data Networks'",
   "editor": "D. Bertsekas, R. Gallager · Prentice Hall",
   "fecha": "1992",
   "localizador": "§3.5.3 'Priority Queueing', p. 203-205, ec. (3.78)-(3.82) (W1 = R/(1−ρ1); W2 = (R+ρ1W1)/(1−ρ1−ρ2)); §3.3 M/M/1 (p_n = ρ^n(1−ρ)); §3.6 aproximación de independencia de Kleinrock",
   "verificada": true,
   "nota": "PDF del capítulo descargado de la web del autor (descarga libre no comercial) y leído el 2026-11-19. Con servicio exponencial E[X²] = 2/μ², luego R = Σλ_iE[X_i²]/2 = ρ/μ.",
   "url": "https://web.mit.edu/dimitrib/www/datanets.html"
  },
  {
   "id": "F-RFC894",
   "tipo": "norma",
   "titulo": "RFC 894: A Standard for the Transmission of IP Datagrams over Ethernet Networks",
   "editor": "IETF (C. Hornig)",
   "fecha": "1984-04",
   "localizador": "'the maximum length of an IP datagram sent over an Ethernet is 1500 octets'",
   "verificada": true,
   "nota": "Leído el 2026-11-19.",
   "url": "https://www.rfc-editor.org/rfc/rfc894.txt"
  },
  {
   "id": "F-ARXIV-2607.14324",
   "tipo": "externa",
   "titulo": "Transition-Aware Routing in Hybrid Hollow-Core/Single-Mode Fiber Networks (arXiv:2607.14324)",
   "editor": "Saber, Jiang",
   "fecha": "2026",
   "localizador": "sección de disponibilidad: 'MTTR_cab = 12 h' (Bellcore, To y Neusy [36]); '4.39 cable cuts per 1000 sheath-miles per year [36]'; a = 1/(1+λ·MTTR) 'follows the ITU-T G.911 methodology [37]'",
   "verificada": true,
   "nota": "Leído el 2026-11-19 (texto del PDF). Fuente secundaria: tabula los valores de campo de To y Neusy (F-TO-NEUSY-1994).",
   "url": "https://arxiv.org/abs/2607.14324"
  },
  {
   "id": "F-TO-NEUSY-1994",
   "tipo": "externa",
   "titulo": "Unavailability analysis of long-haul networks",
   "editor": "M. To, P. Neusy · IEEE JSAC 12(1), 100-109",
   "fecha": "1994",
   "localizador": "tasa de cortes de cable y tiempo de reparación (Bellcore)",
   "verificada": false,
   "nota": "No leído directamente (IEEE, de pago): se cita a través de F-ARXIV-2607.14324.",
   "url": "https://doi.org/10.1109/49.265709"
  },
  {
   "id": "F-ITU-G911",
   "tipo": "norma",
   "titulo": "ITU-T G.911: Parameters and calculation methodologies for reliability and availability of fibre optic systems",
   "editor": "UIT-T",
   "fecha": "1997-04",
   "localizador": "metodología de disponibilidad en régimen permanente A = MTBF/(MTBF+MTTR)",
   "verificada": false,
   "nota": "Citada por F-ARXIV-2607.14324; no leída el 2026-11-19.",
   "url": "https://www.itu.int/rec/T-REC-G.911-199704-I/en"
  }
 ],
 "formulas": [
  {
   "id": "FX-001",
   "nombre": "Pendiente por mínimos cuadrados",
   "expr": "b = Σ(t−t̄)(P_t−P̄) / Σ(t−t̄)²",
   "variables": {
    "P_t": {
     "desc": "población padrón año t",
     "unidad": "hab"
    },
    "t": {
     "desc": "año 2015…2025",
     "unidad": "año"
    }
   },
   "justificacion": "Estimador MCO de la recta P = a + b·t (definición estándar); es el método de la Semana 1 §11.",
   "refs": [
    "F-G32-S1",
    "F-INE-PADRON-2881"
   ]
  },
  {
   "id": "FX-002",
   "nombre": "Proyección municipal a 2031",
   "expr": "P31 = P25·(1 + 6·b / P_padrón,2025)",
   "variables": {
    "P25": {
     "desc": "población base 2025 (ECP si existe; si no, padrón)",
     "unidad": "hab"
    },
    "b": {
     "desc": "pendiente MCO 2015-2025",
     "unidad": "hab/año"
    },
    "P_padrón,2025": {
     "desc": "padrón 2025",
     "unidad": "hab"
    }
   },
   "justificacion": "Crecimiento lineal relativo del padrón aplicado a la base ECP (Semana 1 §11, con 5 años para 2030; aquí 6 años = (2026 + 5) − 2025, FX-029). Con base padrón se reduce a P25 + 6·b.",
   "refs": [
    "F-G32-S1"
   ]
  },
  {
   "id": "FX-003",
   "nombre": "Suma",
   "expr": "X = Σ x_i",
   "variables": {
    "x_i": {
     "desc": "sumandos",
     "unidad": "—"
    }
   },
   "justificacion": "Agregación por zona o total.",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-004",
   "nombre": "Hogares",
   "expr": "H = P / s",
   "variables": {
    "P": {
     "desc": "población",
     "unidad": "hab"
    },
    "s": {
     "desc": "tamaño medio del hogar",
     "unidad": "hab/hogar"
    }
   },
   "justificacion": "Definición del tamaño medio del hogar del ADRH (personas / hogares).",
   "refs": [
    "F-INE-ADRH-31105"
   ]
  },
  {
   "id": "FX-005",
   "nombre": "Cuota de zona",
   "expr": "w_z = P_z,2031 / P_2031",
   "variables": {
    "P_z": {
     "desc": "población zona 2031",
     "unidad": "hab"
    }
   },
   "justificacion": "Reparto del tráfico proporcional a la población (A6 de Semana 7).",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-006",
   "nombre": "Crecimiento proporcional a la población",
   "expr": "X31 = Σ_z X_z,2025 · P_z,2031 / P_z,2025",
   "variables": {
    "X": {
     "desc": "hogares o empresas",
     "unidad": "—"
    }
   },
   "justificacion": "Hipótesis del informe 3.2 §1.5: hogares y empresas crecen como la población.",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-007",
   "nombre": "Líneas fijas de mercado",
   "expr": "L = p_fijo·H + l_emp·E",
   "variables": {
    "p_fijo": {
     "desc": "hogares con fijo (TIC-H)",
     "unidad": "—"
    },
    "l_emp": {
     "desc": "líneas por empresa",
     "unidad": "líneas"
    }
   },
   "justificacion": "Líneas residenciales (penetración INE TIC-H) más líneas de empresa (DIRCE).",
   "refs": [
    "F-INE-TICH-76598",
    "F-INE-DIRCE-4721",
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-008",
   "nombre": "Líneas del operador",
   "expr": "N = base · ratio · cuota",
   "variables": {
    "base": {
     "desc": "población o líneas de mercado",
     "unidad": "—"
    },
    "ratio": {
     "desc": "líneas por habitante",
     "unidad": "—"
    },
    "cuota": {
     "desc": "cuota de Movistar",
     "unidad": "—"
    }
   },
   "justificacion": "Penetración CNMC × cuota CNMC del operador incumbente (Op1 = Movistar).",
   "refs": [
    "F-CNMC-IES-2025",
    "F-CNMCDATA-ANUAL",
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-009",
   "nombre": "Crecimiento compuesto del uso",
   "expr": "V31 = V25·(1+g)^6",
   "variables": {
    "V25": {
     "desc": "uso mensual 2025",
     "unidad": "GB/mes"
    },
    "g": {
     "desc": "crecimiento anual",
     "unidad": "1/año"
    }
   },
   "justificacion": "Interés compuesto con la tasa anual CNMC durante 2025→2031 (supuesto S-L04).",
   "refs": [
    "F-CNMC-IES-2025"
   ]
  },
  {
   "id": "FX-010",
   "nombre": "Volumen mensual → tasa en hora cargada",
   "expr": "R = N·V·8·f_BH / (d·3600)",
   "variables": {
    "N": {
     "desc": "líneas",
     "unidad": "líneas"
    },
    "V": {
     "desc": "uso",
     "unidad": "GB/mes"
    },
    "f_BH": {
     "desc": "fracción del tráfico diario en la hora cargada",
     "unidad": "—"
    },
    "d": {
     "desc": "días por mes",
     "unidad": "d"
    }
   },
   "justificacion": "GB/mes ÷ d = GB/día; × f_BH = GB en la hora cargada; × 8 / 3600 = Gbit/s. Clase: el núcleo se dimensiona con el tráfico medio por cliente en hora cargada, no con velocidades contratadas.",
   "refs": [
    "F-ARCO-FTTH100K",
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-011",
   "nombre": "Reserva",
   "expr": "X' = 1,25·X",
   "variables": {
    "X": {
     "desc": "demanda",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Margen de crecimiento del 25 % de clase (+25 % headroom), aplicado una sola vez.",
   "refs": [
    "F-ARCO-FTTH100K"
   ]
  },
  {
   "id": "FX-012",
   "nombre": "Reparto por sentido",
   "expr": "X_DL = s·X ; X_UL = (1−s)·X",
   "variables": {
    "s": {
     "desc": "fracción DL",
     "unidad": "—"
    }
   },
   "justificacion": "Separación DL/UL con la fracción del grupo (S-L07).",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-013",
   "nombre": "Voz VoNR por sentido",
   "expr": "Q = 2·a·N_m·r",
   "variables": {
    "a": {
     "desc": "Erlang por línea",
     "unidad": "Erl"
    },
    "N_m": {
     "desc": "líneas móviles",
     "unidad": "líneas"
    },
    "r": {
     "desc": "tasa por llamada y sentido",
     "unidad": "Mbit/s"
    }
   },
   "justificacion": "Tráfico ofrecido A = a·N (Erlang, clase) × 2 extremos × tasa del códec.",
   "refs": [
    "F-ARCO-NC",
    "F-ENUNCIADO-P2"
   ]
  },
  {
   "id": "FX-014",
   "nombre": "Capacidad con ocupación",
   "expr": "C = 1,25·max(BH/u_n, Pico/u_p)",
   "variables": {
    "u_n": {
     "desc": "ocupación normal",
     "unidad": "—"
    },
    "u_p": {
     "desc": "ocupación en pico/fallo",
     "unidad": "—"
    }
   },
   "justificacion": "Clase: carga máxima 70 % (sobredimensionado 30 %) y +25 % de reserva; 90 % en pico es del grupo (S-L06).",
   "refs": [
    "F-ARCO-CS2",
    "F-ARCO-FTTH100K"
   ]
  },
  {
   "id": "FX-015",
   "nombre": "Tráfico radio en hora cargada / pico",
   "expr": "DL = s_m·k·R_m + Q ; UL = (1−s_m)·k·R_m + Q (k = 1 normal, 2 en P2)",
   "variables": {
    "R_m": {
     "desc": "datos móviles",
     "unidad": "Gbit/s"
    },
    "Q": {
     "desc": "VoNR por sentido",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Datos móviles repartidos por sentido más voz; en P2 se duplica solo Internet (S-L08).",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-016",
   "nombre": "Internet por zona",
   "expr": "I_z = 1,25·(s_f·R_f + s_m·R_m)·w_z",
   "variables": {
    "w_z": {
     "desc": "cuota de zona",
     "unidad": "—"
    }
   },
   "justificacion": "Tabla 8/A6 de Semana 7: reparto por población.",
   "refs": [
    "F-G32-S7",
    "F-ARCO-FTTH100K"
   ]
  },
  {
   "id": "FX-017",
   "nombre": "Voz fija RTP repartida por zona",
   "expr": "V_z = V_F · I_z,DL / Σ I_DL",
   "variables": {
    "V_F": {
     "desc": "voz fija total",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Reparto por peso de Internet DL (A11.1, H-E7).",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-018",
   "nombre": "Producto / cociente",
   "expr": "X = Π entradas (o cociente indicado en calc)",
   "variables": {
    "—": {
     "desc": "ver calc",
     "unidad": "—"
    }
   },
   "justificacion": "Operación aritmética directa sobre las entradas (definición del valor).",
   "refs": [
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-019",
   "nombre": "Capacidad de sector",
   "expr": "c = B·η·f_TDD",
   "variables": {
    "B": {
     "desc": "ancho de banda",
     "unidad": "MHz"
    },
    "η": {
     "desc": "eficiencia espectral media",
     "unidad": "bit/s/Hz"
    },
    "f_TDD": {
     "desc": "fracción de tiempo del sentido",
     "unidad": "—"
    }
   },
   "justificacion": "Capacidad media de celda = ancho × eficiencia espectral media (definición ITU-R M.2410 §4.5).",
   "refs": [
    "F-ITU-M2410",
    "F-31-MEM"
   ]
  },
  {
   "id": "FX-020",
   "nombre": "Sectores necesarios",
   "expr": "N = max(⌈C_DL/c_DL⌉, ⌈C_UL/c_UL⌉); sitios = ⌈N/3⌉",
   "variables": {
    "C": {
     "desc": "capacidad necesaria",
     "unidad": "Mbit/s"
    },
    "c": {
     "desc": "capacidad de sector",
     "unidad": "Mbit/s"
    }
   },
   "justificacion": "Cociente capacidad/capacidad de sector, sentido limitante; 3 sectores por sitio.",
   "refs": [
    "F-31-MEM",
    "F-ITU-M2410"
   ]
  },
  {
   "id": "FX-021",
   "nombre": "Puertos PON",
   "expr": "N_PON = ⌈(A/split)·1,25/0,70⌉",
   "variables": {
    "A": {
     "desc": "accesos",
     "unidad": "accesos"
    },
    "split": {
     "desc": "relación de división",
     "unidad": "—"
    }
   },
   "justificacion": "Clase: PON ports = homes / split ratio; +25 % y ocupación 70 % de clase.",
   "refs": [
    "F-ARCO-NC",
    "F-ARCO-COVDIM",
    "F-ARCO-CS2",
    "F-ARCO-FTTH100K"
   ]
  },
  {
   "id": "FX-022",
   "nombre": "Canales 400G",
   "expr": "n = ⌈F_max/(400·u_p)⌉ ; C = 400·n_ref (n_ref ≥ n)",
   "variables": {
    "F_max": {
     "desc": "carga máxima en N-1/pico",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Cociente carga/capacidad útil del canal; la decisión n_ref debe cumplir n_ref ≥ n.",
   "refs": [
    "F-ARCO-FTTH100K",
    "F-G32-S7"
   ]
  },
  {
   "id": "FX-023",
   "nombre": "Carga de enlace (matriz A11)",
   "expr": "F = 1,10·R_resto + 1,44·Q_VoNR, 1/3 por DC (1/2 tras perder uno), máx. sobre escenarios",
   "variables": {
    "R_resto": {
     "desc": "tráfico sin VoNR",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Reparto activo-activo entre 3 DC; lo reproduce motor.js (test_v7.js: 220/220 cargas ±1 Gbit/s).",
   "refs": [
    "F-G32-S7",
    "F-ENUNCIADO-P2"
   ]
  },
  {
   "id": "FX-024",
   "nombre": "Dimensionado IMS",
   "expr": "A = a·N ; patas = 2A ; λ = A/t ; C_DC = ⌈1,25·X/(n_DC−1)/u_p⌉",
   "variables": {
    "a": {
     "desc": "Erlang por línea",
     "unidad": "Erl"
    },
    "t": {
     "desc": "duración media",
     "unidad": "s"
    }
   },
   "justificacion": "Clase: A = λ·h y tráfico por usuario × usuarios; N-1 entre DC activo-activo con reserva.",
   "refs": [
    "F-ARCO-NC",
    "F-ARCO-IMS-EJ",
    "F-ENUNCIADO-P2"
   ]
  },
  {
   "id": "FX-025",
   "nombre": "Mensajes SIP",
   "expr": "M = 12·λ_total + 4·N/T_reg (+ 4·0,2N/300 en tormenta)",
   "variables": {
    "T_reg": {
     "desc": "periodo de re-registro",
     "unidad": "s"
    }
   },
   "justificacion": "Mensajes por llamada y por registro (S-L17).",
   "refs": [
    "F-ARCO-IMS-EJ"
   ]
  },
  {
   "id": "FX-026",
   "nombre": "Tasa de flujo periódico",
   "expr": "r = n·B·8·f (·1,5 de cabeceras ·1,25 de reserva)",
   "variables": {
    "n": {
     "desc": "dispositivos",
     "unidad": "—"
    },
    "B": {
     "desc": "bytes por mensaje",
     "unidad": "B"
    },
    "f": {
     "desc": "frecuencia",
     "unidad": "Hz"
    }
   },
   "justificacion": "Producto mensajes × tamaño; la cabecera 1,5 es del grupo (S-L13).",
   "refs": [
    "F-ARCO-FTTH100K"
   ]
  },
  {
   "id": "FX-027",
   "nombre": "Enlace municipio–Metro (simulador)",
   "expr": "n = ⌈max(DL·1,10/0,70; 2·DL·1,10/0,90)/100⌉ × 100GE",
   "variables": {
    "DL": {
     "desc": "demanda DL del municipio",
     "unidad": "Gbit/s"
    }
   },
   "justificacion": "Mismo criterio de ocupación que el resto (S-003 del simulador).",
   "refs": [
    "F-ARCO-CS2"
   ]
  },
  {
   "id": "FX-028",
   "nombre": "Reparto municipal (simulador)",
   "expr": "X_m = X_zona · P_m,2025 / P_zona,2025",
   "variables": {
    "X_zona": {
     "desc": "magnitud de la zona Metro",
     "unidad": "—"
    }
   },
   "justificacion": "Cuota por población 2025 (S-029 del simulador).",
   "refs": [
    "F-INE-ECP-79543"
   ]
  },
  {
   "id": "FX-029",
   "nombre": "Años de proyección",
   "expr": "n = (año del curso + horizonte) − año base",
   "variables": {
    "año del curso": {
     "desc": "inicio del curso del enunciado",
     "unidad": "año"
    },
    "horizonte": {
     "desc": "horizonte de diseño",
     "unidad": "años"
    },
    "año base": {
     "desc": "fecha de referencia de la ECP (1 de enero)",
     "unidad": "año"
    }
   },
   "justificacion": "El enunciado pide un horizonte de cinco años desde el curso 2026-27 (año 2031); la base de población es el 1-1-2025.",
   "refs": [
    "F-ENUNCIADO-P2",
    "F-INE-ECP-79543"
   ]
  },
  {
   "id": "FX-030",
   "nombre": "Tasa de un flujo RTP de voz",
   "expr": "r = (carga + RTP + UDP + IP)·8 / T_trama",
   "variables": {
    "carga": {
     "desc": "octetos de voz por paquete",
     "unidad": "B"
    },
    "T_trama": {
     "desc": "duración del paquete",
     "unidad": "s"
    }
   },
   "justificacion": "Un paquete IP por trama: carga del códec más cabeceras fijas RTP (12 B), UDP (8 B) e IPv4 (20 B), sin RoHC (la compresión solo actúa en el radioenlace, no en el transporte).",
   "refs": [
    "F-3GPP-TS26445",
    "F-RFC3551",
    "F-RFC3550",
    "F-RFC768",
    "F-RFC791"
   ]
  },
  {
   "id": "FX-031",
   "nombre": "Factor de encapsulado GTP-U en N3",
   "expr": "k = (IP_int + GTP-U + UDP + IP_ext) / IP_int",
   "variables": {
    "IP_int": {
     "desc": "paquete IP del usuario",
     "unidad": "B"
    },
    "GTP-U": {
     "desc": "8 + 4 + 4 (contenedor de sesión PDU)",
     "unidad": "B"
    }
   },
   "justificacion": "En N3 cada paquete del usuario viaja en GTP-U/UDP/IP; el factor es el cociente de longitudes.",
   "refs": [
    "F-3GPP-TS29281",
    "F-3GPP-TS38415",
    "F-RFC768",
    "F-RFC791"
   ]
  },
  {
   "id": "FX-032",
   "nombre": "Penetración y cuota provinciales",
   "expr": "pen = L / P ; cuota = L_op / L",
   "variables": {
    "L": {
     "desc": "líneas o accesos en la provincia",
     "unidad": "líneas"
    },
    "P": {
     "desc": "población a 1 de enero",
     "unidad": "hab"
    }
   },
   "justificacion": "Definición de la CNMC (líneas por 100 habitantes con la población INE a 1 de enero; cuota = líneas del operador / total).",
   "refs": [
    "F-CNMCDATA-GEO",
    "F-INE-ECP-56940"
   ]
  },
  {
   "id": "FX-033",
   "nombre": "Crecimiento medio compuesto",
   "expr": "g = (u_t1 / u_t0)^(1/(t1−t0)) − 1 ; u = tráfico·10³ / (12·líneas)",
   "variables": {
    "u": {
     "desc": "uso medio por línea",
     "unidad": "GB/mes"
    }
   },
   "justificacion": "Tasa media anual compuesta entre dos años de la serie de la CNMC.",
   "refs": [
    "F-CNMCDATA-ANUAL"
   ]
  },
  {
   "id": "FX-034",
   "nombre": "Espectro de un operador por concesiones",
   "expr": "B = (f_sup − f_inf)/n_concesiones · k",
   "variables": {
    "k": {
     "desc": "concesiones adjudicadas al operador",
     "unidad": "—"
    }
   },
   "justificacion": "Bloques iguales de la banda subastada (anexo de la orden).",
   "refs": [
    "F-BOE-26GHZ"
   ]
  },
  {
   "id": "FX-035",
   "nombre": "Latencia de un enlace con carga",
   "expr": "T = km·5 µs/km + 20 µs (proceso) + L/C_miembro + W_cola(ρ); demanda: Σ tramos del camino peor",
   "variables": {
    "km": "longitud",
    "L": "tamaño de paquete (1500 B)",
    "C_miembro": "tasa del miembro del LAG",
    "W_cola": "espera media (FX-036)"
   },
   "justificacion": "Clase: el retardo = propagación + proceso + transmisión + cola (F-ARCO-NC p17). La v7 da 5 µs/km y 20 µs por salto y omite la cola; aquí se suma la cola de FX-036 (aproximación de independencia de Kleinrock, B&G §3.6).",
   "refs": [
    "F-ARCO-NC",
    "F-MEMORIA-V7",
    "F-BG-DATANETS"
   ]
  },
  {
   "id": "FX-036",
   "nombre": "Cola M/M/1 con prioridad estricta no expulsiva (2 clases)",
   "expr": "R = ρ·S; W_alta = R/(1−ρ_alta); W_resto = R/((1−ρ_alta)(1−ρ))",
   "variables": {
    "S": "tiempo de servicio L/C",
    "ρ": "ocupación total del sentido",
    "ρ_alta": "ocupación de VoNR + URLLC (TC1 v7)"
   },
   "justificacion": "Bertsekas y Gallager §3.5.3 ec. (3.78)-(3.82) con servicio exponencial (E[X²] = 2S²). La v7 pone VoNR/URLLC en cola estricta (§6.4.2).",
   "refs": [
    "F-BG-DATANETS",
    "F-MEMORIA-V7"
   ]
  },
  {
   "id": "FX-037",
   "nombre": "P95 de la espera",
   "expr": "P95 = (W/ρ)·ln(ρ/0,05) si ρ > 0,05; 0 si no",
   "variables": {
    "W": "espera media",
    "ρ": "ocupación"
   },
   "justificacion": "M/M/1 FIFO: P(espera > t) = ρ·e^{−μ(1−ρ)t} (de p_n = ρ^n(1−ρ), B&G §3.3); despejando t para 0,05 y W = ρ/(μ(1−ρ)). En la clase de prioridad es una aproximación (supuesto ana.p95_cola); de extremo a extremo se suman los P95 (cota).",
   "refs": [
    "F-BG-DATANETS"
   ]
  },
  {
   "id": "FX-038",
   "nombre": "Cumplimiento de SLA por slice",
   "expr": "cumple_pct = #demandas con P95 ≤ presupuesto y servido ≥ 99 % / #demandas",
   "variables": {
    "presupuesto": "latencia_max_ms de transporte (v7 §6.7.3)"
   },
   "justificacion": "KPI D-04 de la v7 (10 ms ida P95) repartido en presupuesto por servicio; el 99 % de caudal es el umbral de 'degradado' del motor.",
   "refs": [
    "F-MEMORIA-V7"
   ]
  },
  {
   "id": "FX-039",
   "nombre": "Indisponibilidad de un tramo de fibra",
   "expr": "λ = c·km/8760 (1/h); U = λ·MTTR/(1 + λ·MTTR)",
   "variables": {
    "c": "cortes por km y año",
    "MTTR": "tiempo de reparación del cable (h)"
   },
   "justificacion": "Régimen permanente de un elemento reparable A = 1/(1+λ·MTTR) (ITU-T G.911, como lo aplica arXiv:2607.14324) con los valores de campo de To y Neusy.",
   "refs": [
    "F-ARXIV-2607.14324",
    "F-ITU-G911"
   ]
  },
  {
   "id": "FX-040",
   "nombre": "Indisponibilidad por zona o servicio",
   "expr": "I = Σ_sucesos U_s · (DL perdido con s / DL del grupo) · 525 960 min/año",
   "variables": {
    "U_s": "indisponibilidad del suceso (N-1, SRLG, par de vanos u_i·u_j, fallo común)"
   },
   "justificacion": "Suma de sucesos raros independientes ponderada por la fracción de demanda que se pierde; la v7 usa la misma suma para el núcleo (3u² + fallo común, §7.1.1 A5).",
   "refs": [
    "F-MEMORIA-V7",
    "F-ITU-G911",
    "F-ENUNCIADO-P2"
   ]
  },
  {
   "id": "FX-041",
   "nombre": "Módulos de ampliación",
   "expr": "n = techo((O/0,85 − C)/m), con ≤ 14 λ por vano",
   "variables": {
    "O": "oferta del año",
    "C": "capacidad",
    "m": "módulo (400G por λ; 100GE; 10GbE)"
   },
   "justificacion": "Deja la ocupación ≤ 85 % (umbral MAJ del motor); módulo y tope de 2 × 7 λ de la v7 §6.4.1 (supuesto evt.modulo_ampliacion).",
   "refs": [
    "F-MEMORIA-V7"
   ]
  }
 ],
 "supuestos": [
  {
   "id": "S-L00",
   "texto": "Valor que solo aparece en la memoria, sin derivación ni fuente externa",
   "motivo": "La cadena se corta en nuestra propia memoria.",
   "fuente_propuesta": "Ver nota del valor."
  },
  {
   "id": "S-L01",
   "texto": "CERRADO en la revisión 2: 6 años = (2026 + 5) − 2025, del enunciado y de la fecha de la ECP",
   "motivo": "El enunciado fija curso 2026-27 y horizonte de cinco años; la base INE es 1-1-2025. La Semana 1 usaba 5 años (2030).",
   "fuente_propuesta": "Escribir el método en la memoria (§3.1.1) citando G32 Semana 1 §11 y el enunciado p2."
  },
  {
   "id": "S-L02",
   "texto": "1,5 líneas fijas por empresa",
   "motivo": "Calibrado a 35,5 líneas fijas/100 hab (Semana 1). DISCREPA: CNMCData da 5 420 267 líneas fijas de negocio / 3 310 824 empresas DIRCE = 1,637 (nacional 2025).",
   "fuente_propuesta": "Para cerrarlo del todo: líneas fijas de negocio de la Comunidad de Madrid (CNMCData Geográfico no separa segmento; pedir a la CNMC o usar el Informe trimestral por segmento) / DIRCE Madrid."
  },
  {
   "id": "S-L03",
   "texto": "Penetraciones y cuotas nacionales de la CNMC aplicadas a la Comunidad de Madrid",
   "motivo": "DISCREPA en fijo: CNMCData Geográfico 2025 da en Madrid 43,8 accesos BAF/100 hab (v7 40,4), Movistar 36,8 % de la BAF (v7 30,7) y 46,2 % de la telefonía fija (v7 41,8). Móvil sin dato provincial útil (la serie provincial es solo pospago y por sede de facturación).",
   "fuente_propuesta": "Móvil: líneas móviles (pospago + prepago) y de banda ancha móvil por provincia y operador; no está en CNMCData (ds_24375_1 solo pospago). Pedirlo a la CNMC o usar el informe de cobertura/abonados de Telefónica por CC. AA."
  },
  {
   "id": "S-L04",
   "texto": "Crecimiento anual de uso constante 2025-2031 (7,8 % fijo, 12,9 % móvil)",
   "motivo": "Se extrapola la tasa de un año a seis. La serie CNMCData 2021-2025 da medias de 8,0 % fijo y 19,8 % móvil (4 años) o 7,3 % y 14,3 % (3 años) y frena: ninguna serie pasada fija la futura.",
   "fuente_propuesta": "Una previsión publicada: Ericsson Mobility Report (tráfico por smartphone en Europa Occidental a 2030/2031) para el móvil y Cisco/Analysys Mason o el escenario de la CNMC para el fijo."
  },
  {
   "id": "S-L05",
   "texto": "Fracción de tráfico diario en la hora cargada f_BH = 10 %",
   "motivo": "Hipótesis de ingeniería (sensibilidad 5-15 %); no está en los apuntes ni en la CNMC (solo publica volúmenes anuales).",
   "fuente_propuesta": "Curva horaria de tráfico de un punto neutro (estadísticas diarias de ESPANIX o DE-CIX Madrid: Gbit/s de la hora pico ÷ volumen del día) o del informe de tráfico de un operador."
  },
  {
   "id": "S-L06",
   "texto": "Ocupación máxima 90 % en pico o fallo",
   "motivo": "Los apuntes solo dan 70 % en operación normal.",
   "fuente_propuesta": "Criterio de operador o de fabricante (planificación N-1)."
  },
  {
   "id": "S-L07",
   "texto": "Reparto DL/UL 90/10 fijo y 85/15 móvil",
   "motivo": "Hipótesis del grupo. La CNMC no separa el tráfico por sentido.",
   "fuente_propuesta": "Ericsson Mobility Report (relación DL/UL del tráfico móvil) y Sandvine Global Internet Phenomena (cuota upstream fija)."
  },
  {
   "id": "S-L08",
   "texto": "Pico P2 = Internet × 2",
   "motivo": "Los apuntes usan ×1,30 (FTTH for 100000 clients p11).",
   "fuente_propuesta": "Justificar el ×2 con un evento real o usar el ×1,30 de clase."
  },
  {
   "id": "S-L09",
   "texto": "VoNR 40 kbit/s por sentido",
   "motivo": "RESPALDADO en la revisión 2: EVS 23,85 kbit/s en formato Compact (480 bits = 60 B, TS 26.445 Tabla A.1) + RTP 12 + UDP 8 + IPv4 20 = 100 B cada 20 ms = 40,0 kbit/s. Con EVS 24,4 (488 bits) sale 40,4.",
   "fuente_propuesta": "—"
  },
  {
   "id": "S-L10",
   "texto": "128 kbit/s por pata de voz IMS/G.711 con cabeceras",
   "motivo": "DISCREPA: RFC 3551 da 160 B de G.711 por 20 ms; con RTP/UDP/IPv4 son 200 B × 50 pps = 80 kbit/s por sentido (93,6 con Ethernet Q-in-Q de clase). 128 = 2 × 64 parece contar los dos sentidos.",
   "fuente_propuesta": "Si el 128 es intencionado (dos sentidos o margen), escribirlo en §6.6; si no, usar 80 kbit/s."
  },
  {
   "id": "S-L11",
   "texto": "Cabecera de transporte 1,10 y factor VoNR en transporte 1,44",
   "motivo": "1,44 RESPALDADO: GTP-U 8 + 4 (E=1) + 4 (PDU Session Container) + UDP 8 + IPv4 20 = 44 B sobre 100 B. El 1,10 sigue sin cerrar: con Ethernet Q-in-Q (34 B, apuntes Carrier Ethernet) + 2 etiquetas MPLS (8 B, RFC 3032) solo vale 1,10 si el paquete medio es ≥ 420 B.",
   "fuente_propuesta": "Distribución de tamaños de paquete IP en un enlace troncal (p. ej. trazas CAIDA 'Passive Monitor' o informe de tamaño medio de paquete de un IXP) para el paquete medio."
  },
  {
   "id": "S-L12",
   "texto": "Mezcla de aplicaciones del estadio (r̄ DL 2,635 / UL 1,42 Mbit/s por usuario)",
   "motivo": "Mezcla y tasas por aplicación del grupo.",
   "fuente_propuesta": "Informes de operadores en grandes eventos (p. ej. Ericsson/Nokia Super Bowl, Mobile World Congress) para tasas por usuario."
  },
  {
   "id": "S-L13",
   "texto": "Parámetros de servicios especiales (hospital, V2X, IoT, industria, NTN)",
   "motivo": "V2X: 300 B y 10 Hz ya verificados (TS 22.185, EN 302 637-2); quedan 1 000 vehículos y el factor 1,5. IoT, hospital, industria y NTN siguen siendo del grupo.",
   "fuente_propuesta": "V2X: censo de vehículos conectados en el área A2 (DGT) y cabeceras de seguridad IEEE 1609.2 para el 1,5. IoT: 3GPP TR 45.820 Anexo E (modelo de tráfico 'Mobile Autonomous Reporting'). Hospital/industria: 3GPP TS 22.104 Tablas 5.2-1/5.3-1 (tasas por caso de uso). NTN: hoja de datos del terminal OneWeb."
  },
  {
   "id": "S-L14",
   "texto": "Espectro asignado por banda (n28 10 MHz, n78 100 MHz, n258 400 MHz) y reparto TDD",
   "motivo": "n258 COMPROBADO: Telefónica tiene 1 000 MHz en 26 GHz (Orden ETD/114/2023) ≥ 400 MHz de portadora. n28 y n78 solo tienen prensa (2×10 MHz y 100 MHz contiguos), no la resolución oficial.",
   "fuente_propuesta": "Orden ETD que resuelve la subasta de 700 MHz (BOE, 2021) y la orden de reordenación de 3,4-3,8 GHz (BOE, 2022) o el Registro Público de Concesiones de Dominio Público Radioeléctrico; 3GPP TS 38.213/38.331 para el patrón TDD."
  },
  {
   "id": "S-L15",
   "texto": "Duración de mes de 30 días",
   "motivo": "Convención de conversión GB/mes → Gbit/s.",
   "fuente_propuesta": "—"
  },
  {
   "id": "S-L16",
   "texto": "Decisiones de diseño (nº de DC activos, canales 400G, 1:64, centrales lógicas)",
   "motivo": "Son decisiones; se comprueba con una fórmula que cumplen el mínimo deducido.",
   "fuente_propuesta": "—"
  },
  {
   "id": "S-L17",
   "texto": "Re-registro SIP cada 3 600 s, tormenta del 20 % en 300 s, 12 mensajes/llamada y 4/registro",
   "motivo": "Escenario propio del grupo.",
   "fuente_propuesta": "3GPP TS 24.229 (temporizadores de registro) y RFC 3261 (flujo de llamada)."
  },
  {
   "id": "S-L18",
   "texto": "Longitud de los vanos del anillo",
   "motivo": "Distancias de la memoria sin trazado de fibra.",
   "fuente_propuesta": "Trazado real o distancia por carretera × 1,3 entre los edificios de los nodos Metro."
  }
 ],
 "valores": [
  {
   "id": "V-CURSO",
   "ambito": "poblacion",
   "valor": 2026,
   "unidad": "año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "cabecera de cada página 'Academic Year 2026–27'"
   }
  },
  {
   "id": "V-HORIZ",
   "ambito": "poblacion",
   "valor": 5,
   "unidad": "años",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p2 'The design shall cover a five-year technology-evolution horizon'"
   }
  },
  {
   "id": "V-ANO-BASE",
   "ambito": "poblacion",
   "valor": 2025,
   "unidad": "año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "fecha de referencia 1-1-2025"
   }
  },
  {
   "id": "V-SUP-L01",
   "ambito": "poblacion",
   "valor": 6,
   "unidad": "años",
   "tipo": "derivado",
   "entradas": [
    "V-CURSO",
    "V-HORIZ",
    "V-ANO-BASE"
   ],
   "estado": "trazado",
   "formula": "FX-029",
   "calc": "e[0]+e[1]-e[2]",
   "nota": "Revisión 2: deducido (antes supuesto S-L01). La Semana 1 usaba 5 años porque proyectaba a 2030."
  },
  {
   "id": "V-PAD-MADRID",
   "ambito": "poblacion",
   "valor": [
    3141991,
    3165541,
    3182981,
    3223334,
    3266126,
    3334730,
    3305408,
    3280782,
    3332035,
    3416771,
    3506730
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Madrid, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-MADRID",
   "ambito": "poblacion",
   "valor": 3506730,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-MADRID",
   "ambito": "poblacion",
   "valor": 31181.40909,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 31181.409,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-MADRID",
   "ambito": "poblacion",
   "valor": 3477497,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Madrid, 1-1-2025"
   }
  },
  {
   "id": "V-P25-MADRID",
   "ambito": "poblacion",
   "valor": 3477497,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 3477497,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-MADRID",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_madrid|valor"
   ]
  },
  {
   "id": "V-P31R-MADRID",
   "ambito": "poblacion",
   "valor": 3663025.837,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-MADRID",
    "V-B-MADRID",
    "V-PPAD25-MADRID",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-MADRID",
   "ambito": "poblacion",
   "valor": 2.5,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Madrid, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-MADRID",
   "campo": "hogar_medio",
   "tambien": [
    "s_madrid|valor"
   ]
  },
  {
   "id": "V-E25-MADRID",
   "ambito": "poblacion",
   "valor": 297693,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Madrid, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-MADRID",
   "campo": "empresas_2025",
   "tambien": [
    "E25_madrid|valor"
   ]
  },
  {
   "id": "V-H25-MADRID",
   "ambito": "poblacion",
   "valor": 1390998.8,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-MADRID",
    "V-S-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 1390999,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.hogares_2025"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-MADRID",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": [
    113055,
    113340,
    114864,
    116037,
    117040,
    118417,
    116589,
    117041,
    119416,
    121373,
    123342
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Alcobendas, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 123342,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCOBENDAS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 898.0,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCOBENDAS"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 898.0,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5
  },
  {
   "id": "V-ECP25-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 123222,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Alcobendas, 1-1-2025"
   }
  },
  {
   "id": "V-P25-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 123222,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-ALCOBENDAS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 123222,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-ALCOBENDAS",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_alcobendas|valor"
   ]
  },
  {
   "id": "V-P31R-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 128604.758,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCOBENDAS",
    "V-B-ALCOBENDAS",
    "V-PPAD25-ALCOBENDAS",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 3.0,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Alcobendas, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCOBENDAS",
   "campo": "hogar_medio",
   "tambien": [
    "s_alcobendas|valor"
   ]
  },
  {
   "id": "V-E25-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 10393,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Alcobendas, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCOBENDAS",
   "campo": "empresas_2025",
   "tambien": [
    "E25_alcobendas|valor"
   ]
  },
  {
   "id": "V-H25-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 41074.0,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCOBENDAS",
    "V-S-ALCOBENDAS"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 41074,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.hogares_2025"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-ALCOBENDAS",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-TRESCANTOS",
   "ambito": "poblacion",
   "valor": [
    43309,
    44764,
    46046,
    46750,
    47722,
    48326,
    48751,
    50187,
    51453,
    52932,
    54592
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Tres Cantos, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 54592,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TRESCANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 1029.190909,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TRESCANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 1029.191,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-P25-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 54592,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PPAD25-TRESCANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Municipio sin ECP: base 2025 = padrón (método Semana 1 / Informe 18-10).",
   "elemento": "Z-TRESCANTOS",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_tres_cantos|valor"
   ]
  },
  {
   "id": "V-P31R-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 60767.14545,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TRESCANTOS",
    "V-B-TRESCANTOS",
    "V-PPAD25-TRESCANTOS",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 2.9,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Tres Cantos, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TRESCANTOS",
   "campo": "hogar_medio",
   "tambien": [
    "s_tres_cantos|valor"
   ]
  },
  {
   "id": "V-E25-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 3586,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Tres Cantos, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TRESCANTOS",
   "campo": "empresas_2025",
   "tambien": [
    "E25_tres_cantos|valor"
   ]
  },
  {
   "id": "V-H25-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 18824.82759,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TRESCANTOS",
    "V-S-TRESCANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 18825,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.hogares_2025"
   },
   "dif_rel": 9e-06,
   "tol_abs": 0.5,
   "elemento": "Z-TRESCANTOS",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-TALAMANCA",
   "ambito": "poblacion",
   "valor": [
    3371,
    3451,
    3573,
    3725,
    3857,
    4012,
    4123,
    4210,
    4355,
    4533,
    4607
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Talamanca de Jarama, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-TALAMANCA",
   "ambito": "poblacion",
   "valor": 4607,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-TALAMANCA",
   "ambito": "poblacion",
   "valor": 128.0909091,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 128.091,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005
  },
  {
   "id": "V-P25-TALAMANCA",
   "ambito": "poblacion",
   "valor": 4607,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PPAD25-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Municipio sin ECP: base 2025 = padrón (método Semana 1 / Informe 18-10).",
   "elemento": "Z-TALAMANCA",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_talamanca|valor"
   ]
  },
  {
   "id": "V-P31R-TALAMANCA",
   "ambito": "poblacion",
   "valor": 5375.545455,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TALAMANCA",
    "V-B-TALAMANCA",
    "V-PPAD25-TALAMANCA",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-TALAMANCA",
   "ambito": "poblacion",
   "valor": 2.7,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Talamanca de Jarama, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TALAMANCA",
   "campo": "hogar_medio",
   "tambien": [
    "s_talamanca|valor"
   ]
  },
  {
   "id": "V-E25-TALAMANCA",
   "ambito": "poblacion",
   "valor": 230,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Talamanca de Jarama, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TALAMANCA",
   "campo": "empresas_2025",
   "tambien": [
    "E25_talamanca|valor"
   ]
  },
  {
   "id": "V-H25-TALAMANCA",
   "ambito": "poblacion",
   "valor": 1706.296296,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TALAMANCA",
    "V-S-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 1706,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.hogares_2025"
   },
   "dif_rel": 0.000174,
   "tol_abs": 0.5,
   "elemento": "Z-TALAMANCA",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-TORREJON",
   "ambito": "poblacion",
   "valor": [
    126934,
    126981,
    128013,
    129729,
    131376,
    132853,
    132771,
    134733,
    137711,
    140626,
    143526
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Torrejón de Ardoz, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-TORREJON",
   "ambito": "poblacion",
   "valor": 143526,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TORREJON"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-TORREJON",
   "ambito": "poblacion",
   "valor": 1618.518182,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-TORREJON"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 1618.518,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-TORREJON",
   "ambito": "poblacion",
   "valor": 144211,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Torrejón de Ardoz, 1-1-2025"
   }
  },
  {
   "id": "V-P25-TORREJON",
   "ambito": "poblacion",
   "valor": 144211,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-TORREJON"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 144211,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-TORREJON",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_torrejon|valor"
   ]
  },
  {
   "id": "V-P31R-TORREJON",
   "ambito": "poblacion",
   "valor": 153968.4569,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TORREJON",
    "V-B-TORREJON",
    "V-PPAD25-TORREJON",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-TORREJON",
   "ambito": "poblacion",
   "valor": 2.8,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Torrejón de Ardoz, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TORREJON",
   "campo": "hogar_medio",
   "tambien": [
    "s_torrejon|valor"
   ]
  },
  {
   "id": "V-E25-TORREJON",
   "ambito": "poblacion",
   "valor": 6457,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Torrejón de Ardoz, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-TORREJON",
   "campo": "empresas_2025",
   "tambien": [
    "E25_torrejon|valor"
   ]
  },
  {
   "id": "V-H25-TORREJON",
   "ambito": "poblacion",
   "valor": 51503.92857,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TORREJON",
    "V-S-TORREJON"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 51504,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.hogares_2025"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "elemento": "Z-TORREJON",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-ALCALA",
   "ambito": "poblacion",
   "valor": [
    198750,
    195907,
    194310,
    193751,
    195649,
    197562,
    195982,
    196888,
    199184,
    200702,
    203208
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Alcalá de Henares, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-ALCALA",
   "ambito": "poblacion",
   "valor": 203208,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCALA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-ALCALA",
   "ambito": "poblacion",
   "valor": 569.9909091,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCALA"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 569.991,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-ALCALA",
   "ambito": "poblacion",
   "valor": 202549,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Alcalá de Henares, 1-1-2025"
   }
  },
  {
   "id": "V-P25-ALCALA",
   "ambito": "poblacion",
   "valor": 202549,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-ALCALA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 202549,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-ALCALA",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_alcala|valor"
   ]
  },
  {
   "id": "V-P31R-ALCALA",
   "ambito": "poblacion",
   "valor": 205957.8546,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCALA",
    "V-B-ALCALA",
    "V-PPAD25-ALCALA",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-ALCALA",
   "ambito": "poblacion",
   "valor": 2.7,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Alcalá de Henares, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCALA",
   "campo": "hogar_medio",
   "tambien": [
    "s_alcala|valor"
   ]
  },
  {
   "id": "V-E25-ALCALA",
   "ambito": "poblacion",
   "valor": 9786,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Alcalá de Henares, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCALA",
   "campo": "empresas_2025",
   "tambien": [
    "E25_alcala|valor"
   ]
  },
  {
   "id": "V-H25-ALCALA",
   "ambito": "poblacion",
   "valor": 75018.14815,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCALA",
    "V-S-ALCALA"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 75018,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.hogares_2025"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "elemento": "Z-ALCALA",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-LOSSANTOS",
   "ambito": "poblacion",
   "valor": [
    2389,
    2435,
    2486,
    2542,
    2590,
    2694,
    2729,
    2751,
    2772,
    2785,
    2867
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Los Santos de la Humosa, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 2867,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 47.31818182,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 47.318,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.0005
  },
  {
   "id": "V-P25-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 2867,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PPAD25-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Municipio sin ECP: base 2025 = padrón (método Semana 1 / Informe 18-10).",
   "elemento": "Z-LOSSANTOS",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_los_santos|valor"
   ]
  },
  {
   "id": "V-P31R-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 3150.909091,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-LOSSANTOS",
    "V-B-LOSSANTOS",
    "V-PPAD25-LOSSANTOS",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 2.8,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Los Santos de la Humosa, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-LOSSANTOS",
   "campo": "hogar_medio",
   "tambien": [
    "s_los_santos|valor"
   ]
  },
  {
   "id": "V-E25-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 126,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Los Santos de la Humosa, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-LOSSANTOS",
   "campo": "empresas_2025",
   "tambien": [
    "E25_los_santos|valor"
   ]
  },
  {
   "id": "V-H25-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 1023.928571,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-LOSSANTOS",
    "V-S-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 1024,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.hogares_2025"
   },
   "dif_rel": 7e-05,
   "tol_abs": 0.5,
   "elemento": "Z-LOSSANTOS",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-GETAFE",
   "ambito": "poblacion",
   "valor": [
    174921,
    176659,
    178288,
    180747,
    183374,
    185180,
    183095,
    183219,
    185899,
    189906,
    193238
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Getafe, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-GETAFE",
   "ambito": "poblacion",
   "valor": 193238,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-GETAFE"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie).",
   "elemento": "Ppad25_getafe",
   "campo": "valor"
  },
  {
   "id": "V-B-GETAFE",
   "ambito": "poblacion",
   "valor": 1564.281818,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-GETAFE"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 1564.282,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "elemento": "b_getafe",
   "campo": "valor"
  },
  {
   "id": "V-ECP25-GETAFE",
   "ambito": "poblacion",
   "valor": 195628,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Getafe, 1-1-2025"
   }
  },
  {
   "id": "V-P25-GETAFE",
   "ambito": "poblacion",
   "valor": 195628,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-GETAFE"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 195628,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-GETAFE",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_getafe|valor"
   ]
  },
  {
   "id": "V-P31R-GETAFE",
   "ambito": "poblacion",
   "valor": 205129.7747,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-GETAFE",
    "V-B-GETAFE",
    "V-PPAD25-GETAFE",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031.",
   "elemento": "P31_getafe",
   "campo": "valor"
  },
  {
   "id": "V-S-GETAFE",
   "ambito": "poblacion",
   "valor": 2.6,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Getafe, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-GETAFE",
   "campo": "hogar_medio",
   "tambien": [
    "s_getafe|valor"
   ]
  },
  {
   "id": "V-E25-GETAFE",
   "ambito": "poblacion",
   "valor": 9655,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Getafe, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-GETAFE",
   "campo": "empresas_2025",
   "tambien": [
    "E25_getafe|valor"
   ]
  },
  {
   "id": "V-H25-GETAFE",
   "ambito": "poblacion",
   "valor": 75241.53846,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-GETAFE",
    "V-S-GETAFE"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 75242,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.hogares_2025"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.5,
   "elemento": "Z-GETAFE",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-LEGANES",
   "ambito": "poblacion",
   "valor": [
    186907,
    187173,
    187720,
    188425,
    189861,
    191114,
    187762,
    186660,
    190665,
    194084,
    195734
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Leganés, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-LEGANES",
   "ambito": "poblacion",
   "valor": 195734,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-LEGANES"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-LEGANES",
   "ambito": "poblacion",
   "valor": 681.6818182,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-LEGANES"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 681.682,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-LEGANES",
   "ambito": "poblacion",
   "valor": 195946,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Leganés, 1-1-2025"
   }
  },
  {
   "id": "V-P25-LEGANES",
   "ambito": "poblacion",
   "valor": 195946,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-LEGANES"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 195946,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-LEGANES",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_leganes|valor"
   ]
  },
  {
   "id": "V-P31R-LEGANES",
   "ambito": "poblacion",
   "valor": 200040.5209,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-LEGANES",
    "V-B-LEGANES",
    "V-PPAD25-LEGANES",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-LEGANES",
   "ambito": "poblacion",
   "valor": 2.6,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Leganés, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-LEGANES",
   "campo": "hogar_medio",
   "tambien": [
    "s_leganes|valor"
   ]
  },
  {
   "id": "V-E25-LEGANES",
   "ambito": "poblacion",
   "valor": 9301,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Leganés, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-LEGANES",
   "campo": "empresas_2025",
   "tambien": [
    "E25_leganes|valor"
   ]
  },
  {
   "id": "V-H25-LEGANES",
   "ambito": "poblacion",
   "valor": 75363.84615,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-LEGANES",
    "V-S-LEGANES"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 75364,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.hogares_2025"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "elemento": "Z-LEGANES",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-FUENLABRADA",
   "ambito": "poblacion",
   "valor": [
    195180,
    194171,
    194669,
    193586,
    193700,
    194514,
    192233,
    189891,
    188736,
    190790,
    190076
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Fuenlabrada, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 190076,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-FUENLABRADA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-FUENLABRADA",
   "ambito": "poblacion",
   "valor": -597.2727273,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-FUENLABRADA"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": -597.273,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 189814,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Fuenlabrada, 1-1-2025"
   }
  },
  {
   "id": "V-P25-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 189814,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-FUENLABRADA"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 189814,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-FUENLABRADA",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_fuenlabrada|valor"
   ]
  },
  {
   "id": "V-P31R-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 186235.3033,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-FUENLABRADA",
    "V-B-FUENLABRADA",
    "V-PPAD25-FUENLABRADA",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 2.8,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Fuenlabrada, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-FUENLABRADA",
   "campo": "hogar_medio",
   "tambien": [
    "s_fuenlabrada|valor"
   ]
  },
  {
   "id": "V-E25-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 10090,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Fuenlabrada, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-FUENLABRADA",
   "campo": "empresas_2025",
   "tambien": [
    "E25_fuenlabrada|valor"
   ]
  },
  {
   "id": "V-H25-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 67790.71429,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-FUENLABRADA",
    "V-S-FUENLABRADA"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 67791,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.hogares_2025"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.5,
   "elemento": "Z-FUENLABRADA",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-ALCORCON",
   "ambito": "poblacion",
   "valor": [
    167136,
    167354,
    168141,
    169502,
    170514,
    172384,
    170817,
    170296,
    171772,
    173625,
    175719
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Alcorcón, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-ALCORCON",
   "ambito": "poblacion",
   "valor": 175719,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCORCON"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-ALCORCON",
   "ambito": "poblacion",
   "valor": 734.3909091,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-ALCORCON"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 734.391,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005
  },
  {
   "id": "V-ECP25-ALCORCON",
   "ambito": "poblacion",
   "valor": 176806,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-79543",
    "localizador": "tabla 79543, Alcorcón, 1-1-2025"
   }
  },
  {
   "id": "V-P25-ALCORCON",
   "ambito": "poblacion",
   "valor": 176806,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-ECP25-ALCORCON"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Base 2025 = ECP (método Semana 1).",
   "ref": {
    "valor": 176806,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-ALCORCON",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_alcorcon|valor"
   ]
  },
  {
   "id": "V-P31R-ALCORCON",
   "ambito": "poblacion",
   "valor": 181239.6032,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCORCON",
    "V-B-ALCORCON",
    "V-PPAD25-ALCORCON",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-ALCORCON",
   "ambito": "poblacion",
   "valor": 2.6,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Alcorcón, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCORCON",
   "campo": "hogar_medio",
   "tambien": [
    "s_alcorcon|valor"
   ]
  },
  {
   "id": "V-E25-ALCORCON",
   "ambito": "poblacion",
   "valor": 8883,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Alcorcón, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-ALCORCON",
   "campo": "empresas_2025",
   "tambien": [
    "E25_alcorcon|valor"
   ]
  },
  {
   "id": "V-H25-ALCORCON",
   "ambito": "poblacion",
   "valor": 68002.30769,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCORCON",
    "V-S-ALCORCON"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 68002,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.hogares_2025"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.5,
   "elemento": "Z-ALCORCON",
   "campo": "hogares_2025"
  },
  {
   "id": "V-PAD-BATRES",
   "ambito": "poblacion",
   "valor": [
    1568,
    1582,
    1610,
    1638,
    1684,
    1750,
    1820,
    1823,
    1872,
    1943,
    1976
   ],
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-PADRON-2881",
    "localizador": "tabla 2881, Batres, Total, 2015-2025"
   }
  },
  {
   "id": "V-PPAD25-BATRES",
   "ambito": "poblacion",
   "valor": 1976,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0][10]",
   "nota": "Padrón a 1-1-2025 (último punto de la serie)."
  },
  {
   "id": "V-B-BATRES",
   "ambito": "poblacion",
   "valor": 43.41818182,
   "unidad": "hab/año",
   "tipo": "derivado",
   "entradas": [
    "V-PAD-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-001",
   "calc": "F.mco(e[0])",
   "ref": {
    "valor": 43.418,
    "donde": "grupo",
    "localizador": "G32 Semana 1 Tabla 12 / Informe 18-10 §1.1-1.5"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.0005
  },
  {
   "id": "V-P25-BATRES",
   "ambito": "poblacion",
   "valor": 1976,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-PPAD25-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "nota": "Municipio sin ECP: base 2025 = padrón (método Semana 1 / Informe 18-10).",
   "elemento": "Z-BATRES",
   "campo": "poblacion_2025",
   "tambien": [
    "P25_batres|valor"
   ]
  },
  {
   "id": "V-P31R-BATRES",
   "ambito": "poblacion",
   "valor": 2236.509091,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-BATRES",
    "V-B-BATRES",
    "V-PPAD25-BATRES",
    "V-SUP-L01"
   ],
   "estado": "trazado",
   "formula": "FX-002",
   "calc": "e[0]*(1+e[3]*e[1]/e[2])",
   "nota": "Proyección municipal por regresión. La memoria no da cifras municipales 2031."
  },
  {
   "id": "V-S-BATRES",
   "ambito": "poblacion",
   "valor": 2.8,
   "unidad": "hab/hogar",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ADRH-31105",
    "localizador": "tabla 31105, Batres, 2023"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-BATRES",
   "campo": "hogar_medio",
   "tambien": [
    "s_batres|valor"
   ]
  },
  {
   "id": "V-E25-BATRES",
   "ambito": "poblacion",
   "valor": 170,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-4721",
    "localizador": "tabla 4721, Batres, 2025"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Z-BATRES",
   "campo": "empresas_2025",
   "tambien": [
    "E25_batres|valor"
   ]
  },
  {
   "id": "V-H25-BATRES",
   "ambito": "poblacion",
   "valor": 705.7142857,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-P25-BATRES",
    "V-S-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-004",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 706,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.hogares_2025"
   },
   "dif_rel": 0.000405,
   "tol_abs": 0.5,
   "elemento": "Z-BATRES",
   "campo": "hogares_2025"
  },
  {
   "id": "V-P25-ZC",
   "ambito": "poblacion",
   "valor": 3477497,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1 (2025 por zona)",
   "elemento": "P25_C",
   "campo": "valor"
  },
  {
   "id": "V-P31-ZC",
   "ambito": "poblacion",
   "valor": 3663025.837,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31R-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 3663025,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 tabla de población por zona 2031"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "P31_C",
   "campo": "valor"
  },
  {
   "id": "V-H25-ZC",
   "ambito": "poblacion",
   "valor": 1390998.8,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]",
   "elemento": "H25_C",
   "campo": "valor"
  },
  {
   "id": "V-E25-ZC",
   "ambito": "poblacion",
   "valor": 297693,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-MADRID"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]"
  },
  {
   "id": "V-P25-ZN",
   "ambito": "poblacion",
   "valor": 182421,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ALCOBENDAS",
    "V-P25-TRESCANTOS",
    "V-P25-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.1.1 (2025 por zona)",
   "elemento": "P25_N",
   "campo": "valor"
  },
  {
   "id": "V-P31-ZN",
   "ambito": "poblacion",
   "valor": 194747.4489,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31R-ALCOBENDAS",
    "V-P31R-TRESCANTOS",
    "V-P31R-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 194748,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 tabla de población por zona 2031"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.5,
   "elemento": "P31_N",
   "campo": "valor"
  },
  {
   "id": "V-H25-ZN",
   "ambito": "poblacion",
   "valor": 61605.12388,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-ALCOBENDAS",
    "V-H25-TRESCANTOS",
    "V-H25-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "elemento": "H25_N",
   "campo": "valor"
  },
  {
   "id": "V-E25-ZN",
   "ambito": "poblacion",
   "valor": 14209,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-ALCOBENDAS",
    "V-E25-TRESCANTOS",
    "V-E25-TALAMANCA"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]"
  },
  {
   "id": "V-P25-ZE",
   "ambito": "poblacion",
   "valor": 349627,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TORREJON",
    "V-P25-ALCALA",
    "V-P25-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.1.1 (2025 por zona)",
   "elemento": "P25_E",
   "campo": "valor"
  },
  {
   "id": "V-P31-ZE",
   "ambito": "poblacion",
   "valor": 363077.2206,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31R-TORREJON",
    "V-P31R-ALCALA",
    "V-P31R-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 363077,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 tabla de población por zona 2031"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "elemento": "P31_E",
   "campo": "valor"
  },
  {
   "id": "V-H25-ZE",
   "ambito": "poblacion",
   "valor": 127546.0053,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-TORREJON",
    "V-H25-ALCALA",
    "V-H25-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "elemento": "H25_E",
   "campo": "valor"
  },
  {
   "id": "V-E25-ZE",
   "ambito": "poblacion",
   "valor": 16369,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-TORREJON",
    "V-E25-ALCALA",
    "V-E25-LOSSANTOS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]"
  },
  {
   "id": "V-P25-ZS",
   "ambito": "poblacion",
   "valor": 760170,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-GETAFE",
    "V-P25-LEGANES",
    "V-P25-FUENLABRADA",
    "V-P25-ALCORCON",
    "V-P25-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]",
   "memoria": "v7 §3.1.1 (2025 por zona)",
   "elemento": "P25_S",
   "campo": "valor"
  },
  {
   "id": "V-P31-ZS",
   "ambito": "poblacion",
   "valor": 774881.7112,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31R-GETAFE",
    "V-P31R-LEGANES",
    "V-P31R-FUENLABRADA",
    "V-P31R-ALCORCON",
    "V-P31R-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 774882,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 tabla de población por zona 2031"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "P31_S",
   "campo": "valor"
  },
  {
   "id": "V-H25-ZS",
   "ambito": "poblacion",
   "valor": 287104.1209,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-GETAFE",
    "V-H25-LEGANES",
    "V-H25-FUENLABRADA",
    "V-H25-ALCORCON",
    "V-H25-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]",
   "elemento": "H25_S",
   "campo": "valor"
  },
  {
   "id": "V-E25-ZS",
   "ambito": "poblacion",
   "valor": 38099,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-GETAFE",
    "V-E25-LEGANES",
    "V-E25-FUENLABRADA",
    "V-E25-ALCORCON",
    "V-E25-BATRES"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]"
  },
  {
   "id": "V-P25-TOT",
   "ambito": "poblacion",
   "valor": 4769715,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P25-ZC",
    "V-P25-ZN",
    "V-P25-ZE",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 4769715,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "P25_tot",
   "campo": "valor"
  },
  {
   "id": "V-P31-TOT",
   "ambito": "poblacion",
   "valor": 4995732.218,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZC",
    "V-P31-ZN",
    "V-P31-ZE",
    "V-P31-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.1.1",
   "ref": {
    "valor": 4995733,
    "donde": "memoria",
    "localizador": "v7 §3.1.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "P31_tot",
   "campo": "valor"
  },
  {
   "id": "V-H25-TOT",
   "ambito": "poblacion",
   "valor": 1867254.05,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-ZC",
    "V-H25-ZN",
    "V-H25-ZE",
    "V-H25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.1.1 / A1",
   "ref": {
    "valor": 1867254.1,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "elemento": "H25_tot",
   "campo": "valor"
  },
  {
   "id": "V-E25-TOT",
   "ambito": "poblacion",
   "valor": 366370,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-ZC",
    "V-E25-ZN",
    "V-E25-ZE",
    "V-E25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 366370,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5
  },
  {
   "id": "V-W-ZC",
   "ambito": "poblacion",
   "valor": 0.7332310215,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZC",
    "V-P31-TOT"
   ],
   "estado": "trazado",
   "formula": "FX-005",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §3.4.1",
   "elemento": "share31_C",
   "campo": "valor"
  },
  {
   "id": "V-W-ZN",
   "ambito": "poblacion",
   "valor": 0.03898276377,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZN",
    "V-P31-TOT"
   ],
   "estado": "trazado",
   "formula": "FX-005",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §3.4.1",
   "elemento": "share31_N",
   "campo": "valor"
  },
  {
   "id": "V-W-ZE",
   "ambito": "poblacion",
   "valor": 0.07267747844,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZE",
    "V-P31-TOT"
   ],
   "estado": "trazado",
   "formula": "FX-005",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §3.4.1",
   "elemento": "share31_E",
   "campo": "valor"
  },
  {
   "id": "V-W-ZS",
   "ambito": "poblacion",
   "valor": 0.1551087363,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P31-TOT"
   ],
   "estado": "trazado",
   "formula": "FX-005",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §3.4.1",
   "elemento": "share31_S",
   "campo": "valor"
  },
  {
   "id": "V-H31-TOT",
   "ambito": "poblacion",
   "valor": 1956091.431,
   "unidad": "hogares",
   "tipo": "derivado",
   "entradas": [
    "V-H25-ZC",
    "V-P31-ZC",
    "V-P25-ZC",
    "V-H25-ZN",
    "V-P31-ZN",
    "V-P25-ZN",
    "V-H25-ZE",
    "V-P31-ZE",
    "V-P25-ZE",
    "V-H25-ZS",
    "V-P31-ZS",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-006",
   "calc": "e[0]*e[1]/e[2]+e[3]*e[4]/e[5]+e[6]*e[7]/e[8]+e[9]*e[10]/e[11]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 1956091.311,
    "donde": "grupo",
    "localizador": "G32 Semana 7 §4.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "elemento": "H31_tot",
   "campo": "valor"
  },
  {
   "id": "V-E31-TOT",
   "ambito": "poblacion",
   "valor": 384579.4741,
   "unidad": "empresas",
   "tipo": "derivado",
   "entradas": [
    "V-E25-ZC",
    "V-P31-ZC",
    "V-P25-ZC",
    "V-E25-ZN",
    "V-P31-ZN",
    "V-P25-ZN",
    "V-E25-ZE",
    "V-P31-ZE",
    "V-P25-ZE",
    "V-E25-ZS",
    "V-P31-ZS",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-006",
   "calc": "e[0]*e[1]/e[2]+e[3]*e[4]/e[5]+e[6]*e[7]/e[8]+e[9]*e[10]/e[11]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 384579.45,
    "donde": "grupo",
    "localizador": "G32 Semana 7 §4.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "elemento": "E31_tot",
   "campo": "valor"
  },
  {
   "id": "V-RED-P31-MADRID",
   "ambito": "poblacion",
   "valor": 3663025.837,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZC",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 3663025,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.poblacion"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-MADRID",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-ALCOBENDAS",
   "ambito": "poblacion",
   "valor": 131548.2875,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 131549,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.poblacion"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.5,
   "elemento": "Z-ALCOBENDAS",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-TRESCANTOS",
   "ambito": "poblacion",
   "valor": 58280.85983,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 58281,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.poblacion"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "elemento": "Z-TRESCANTOS",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-TALAMANCA",
   "ambito": "poblacion",
   "valor": 4918.301605,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 4918,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.poblacion"
   },
   "dif_rel": 6.1e-05,
   "tol_abs": 0.5,
   "elemento": "Z-TALAMANCA",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-TORREJON",
   "ambito": "poblacion",
   "valor": 149758.826,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 149759,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.poblacion"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "elemento": "Z-TORREJON",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-ALCALA",
   "ambito": "poblacion",
   "valor": 210341.1005,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 210341,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.poblacion"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-ALCALA",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-LOSSANTOS",
   "ambito": "poblacion",
   "valor": 2977.294063,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2977,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.poblacion"
   },
   "dif_rel": 9.9e-05,
   "tol_abs": 0.5,
   "elemento": "Z-LOSSANTOS",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-GETAFE",
   "ambito": "poblacion",
   "valor": 199414.025,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 199414,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.poblacion"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "Z-GETAFE",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-LEGANES",
   "ambito": "poblacion",
   "valor": 199738.1793,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 199738,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.poblacion"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "elemento": "Z-LEGANES",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-FUENLABRADA",
   "ambito": "poblacion",
   "valor": 193487.5056,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 193488,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.poblacion"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.5,
   "elemento": "Z-FUENLABRADA",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-ALCORCON",
   "ambito": "poblacion",
   "valor": 180227.7593,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "memoria": "v7 §6.1 (solo Alcorcón: 180 228)",
   "ref": {
    "valor": 180228,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.poblacion"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "elemento": "Z-ALCORCON",
   "campo": "poblacion"
  },
  {
   "id": "V-RED-P31-BATRES",
   "ambito": "poblacion",
   "valor": 2014.241895,
   "unidad": "hab",
   "tipo": "derivado",
   "entradas": [
    "V-P31-ZS",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "trazado",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2014,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.poblacion"
   },
   "dif_rel": 0.00012,
   "tol_abs": 0.5,
   "elemento": "Z-BATRES",
   "campo": "poblacion"
  },
  {
   "id": "V-PFIJO",
   "ambito": "lineas",
   "valor": 0.622,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-TICH-76598",
    "localizador": "tabla 76598, C. de Madrid, teléfono fijo 62,2 %"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "pen_fijo_hog",
   "campo": "valor"
  },
  {
   "id": "V-TF-NEG25",
   "ambito": "lineas",
   "valor": 5420267,
   "unidad": "líneas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "2025, 'Telefonía fija', 'Líneas', segmento Negocios (total)"
   }
  },
  {
   "id": "V-DIRCE-ES25",
   "ambito": "lineas",
   "valor": 3310824,
   "unidad": "empresas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-DIRCE-39372",
    "localizador": "tabla 39372, Nacional, Total, 2025"
   }
  },
  {
   "id": "V-LEMP-CALC",
   "ambito": "lineas",
   "valor": 1.637135348,
   "unidad": "líneas/empresa",
   "tipo": "derivado",
   "entradas": [
    "V-TF-NEG25",
    "V-DIRCE-ES25"
   ],
   "estado": "discrepa",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "nota": "Cociente nacional: incluye en el numerador líneas de administraciones públicas (no están en DIRCE); es una cota alta.",
   "ref": {
    "valor": 1.5,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 lin_empresa"
   },
   "dif_rel": 0.091424,
   "tol_abs": 0.05
  },
  {
   "id": "V-LEMP",
   "ambito": "lineas",
   "valor": 1.5,
   "unidad": "líneas/empresa",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "discrepa",
   "supuesto": "S-L02",
   "memoria": "v7 §3.1.1",
   "respaldo": [
    "V-LEMP-CALC"
   ],
   "huecos_raiz": [
    "V-LEMP"
   ],
   "elemento": "lin_empresa",
   "campo": "valor"
  },
  {
   "id": "V-RATIO-TM",
   "ambito": "lineas",
   "valor": 1.307,
   "unidad": "líneas/hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 10 y p. 84: 130,7 líneas móviles/100 hab"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "ratio_tm",
   "campo": "valor"
  },
  {
   "id": "V-RATIO-IM",
   "ambito": "lineas",
   "valor": 1.184,
   "unidad": "líneas/hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 100: 118,4 líneas de banda ancha móvil/100 hab"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "ratio_im",
   "campo": "valor"
  },
  {
   "id": "V-RATIO-IF",
   "ambito": "lineas",
   "valor": 0.404,
   "unidad": "accesos/hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 9, 50 y 69: 40,4 accesos de banda ancha fija/100 hab"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "ratio_if",
   "campo": "valor"
  },
  {
   "id": "V-CUOTA-VF",
   "ambito": "lineas",
   "valor": 0.418,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 59 y 63: Movistar 41,8 % de la telefonía fija"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "cuota_vf",
   "campo": "valor"
  },
  {
   "id": "V-CUOTA-IF",
   "ambito": "lineas",
   "valor": 0.307,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 68, 75 y 77: Movistar 30,7 % de la banda ancha fija"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "cuota_if",
   "campo": "valor"
  },
  {
   "id": "V-CUOTA-TM",
   "ambito": "lineas",
   "valor": 0.258,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 96, gráfico 59 (lectura del gráfico; el texto dice Movistar −0,2 pp, serie 25,9→25,8)"
   },
   "memoria": "v7 §3.1.1",
   "nota": "Leído de un gráfico: coherente con el texto.",
   "elemento": "cuota_tm",
   "campo": "valor"
  },
  {
   "id": "V-CUOTA-IM",
   "ambito": "lineas",
   "valor": 0.247,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "2025, 'Banda Ancha móvil', 'Líneas': Movistar 14 378 334 + 5 224 = 14 383 558 de 58 174 065 (24,72 %)"
   },
   "memoria": "v7 §3.1.1",
   "nota": "Revisión 2: confirmado con la tabla de CNMCData (antes leído de la tarta del IES p. 105). El mismo total da 118,4 líneas/100 hab con la población INE: cuadra con V-RATIO-IM.",
   "elemento": "cuota_im",
   "campo": "valor"
  },
  {
   "id": "V-MAD-BAF",
   "ambito": "lineas",
   "valor": 3117844,
   "unidad": "accesos",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-GEO",
    "localizador": "2025, Madrid, 'Banda ancha fija', 'Líneas', suma de operadores y tecnologías"
   }
  },
  {
   "id": "V-POB-MAD25",
   "ambito": "lineas",
   "valor": 7113886,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-56940",
    "localizador": "Comunidad de Madrid, 1-1-2025"
   }
  },
  {
   "id": "V-MAD-RATIO-IF",
   "ambito": "lineas",
   "valor": 0.4382757891,
   "unidad": "accesos/hab",
   "tipo": "derivado",
   "entradas": [
    "V-MAD-BAF",
    "V-POB-MAD25"
   ],
   "estado": "discrepa",
   "formula": "FX-032",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 0.404,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 ratio_if (cifra nacional aplicada a Madrid)"
   },
   "dif_rel": 0.084841,
   "tol_abs": 0.0005
  },
  {
   "id": "V-MAD-BAF-MOV",
   "ambito": "lineas",
   "valor": 1146921,
   "unidad": "accesos",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-GEO",
    "localizador": "2025, Madrid, 'Banda ancha fija', Movistar (FTTH 1 078 751 + otras 68 170)"
   }
  },
  {
   "id": "V-MAD-CUOTA-IF",
   "ambito": "lineas",
   "valor": 0.3678570833,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-MAD-BAF-MOV",
    "V-MAD-BAF"
   ],
   "estado": "discrepa",
   "formula": "FX-032",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 0.307,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 cuota_if (cifra nacional aplicada a Madrid)"
   },
   "dif_rel": 0.198232,
   "tol_abs": 0.0005
  },
  {
   "id": "V-MAD-TF-MOV",
   "ambito": "lineas",
   "valor": 1548388,
   "unidad": "líneas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-GEO",
    "localizador": "2025, Madrid, 'Telefonía fija', Movistar"
   }
  },
  {
   "id": "V-MAD-TF",
   "ambito": "lineas",
   "valor": 3354141,
   "unidad": "líneas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-GEO",
    "localizador": "2025, Madrid, 'Telefonía fija', 'Líneas', suma de operadores"
   }
  },
  {
   "id": "V-MAD-CUOTA-VF",
   "ambito": "lineas",
   "valor": 0.4616347375,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-MAD-TF-MOV",
    "V-MAD-TF"
   ],
   "estado": "discrepa",
   "formula": "FX-032",
   "calc": "e[0]/e[1]",
   "ref": {
    "valor": 0.418,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 cuota_vf (cifra nacional aplicada a Madrid)"
   },
   "dif_rel": 0.104389,
   "tol_abs": 0.0005
  },
  {
   "id": "V-SUP-L03",
   "ambito": "lineas",
   "valor": "nacional→Madrid",
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "discrepa",
   "supuesto": "S-L03",
   "memoria": "v7 §3.1.1",
   "nota": "Solo hay contraste provincial para el fijo (y discrepa); el móvil sigue sin dato de Madrid.",
   "respaldo": [
    "V-MAD-RATIO-IF",
    "V-MAD-CUOTA-IF",
    "V-MAD-CUOTA-VF"
   ],
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-LMK25",
   "ambito": "lineas",
   "valor": 1710987.019,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-TOT",
    "V-LEMP",
    "V-E25-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-007",
   "calc": "e[0]*e[1]+e[2]*e[3]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 1710987,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP"
   ],
   "elemento": "Lmk25",
   "campo": "valor"
  },
  {
   "id": "V-NF25",
   "ambito": "lineas",
   "valor": 715192.574,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-LMK25",
    "V-CUOTA-VF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 715193,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ],
   "elemento": "Nf25",
   "campo": "valor"
  },
  {
   "id": "V-NM25",
   "ambito": "lineas",
   "valor": 1608376.516,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TOT",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 1608377,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nm25",
   "campo": "valor"
  },
  {
   "id": "V-ND25",
   "ambito": "lineas",
   "valor": 1394893.612,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TOT",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1394894,
    "donde": "grupo",
    "localizador": "G32 S7 §2.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nd25",
   "campo": "valor"
  },
  {
   "id": "V-NB25",
   "ambito": "lineas",
   "valor": 591578.212,
   "unidad": "accesos",
   "tipo": "derivado",
   "entradas": [
    "V-P25-TOT",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 591578,
    "donde": "grupo",
    "localizador": "G32 S7 §2.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nb25",
   "campo": "valor"
  },
  {
   "id": "V-LMK31",
   "ambito": "lineas",
   "valor": 1793558.081,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H31-TOT",
    "V-LEMP",
    "V-E31-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-007",
   "calc": "e[0]*e[1]+e[2]*e[3]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 1793557.97,
    "donde": "grupo",
    "localizador": "G32 S7 §5.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP"
   ],
   "elemento": "Lmk31",
   "campo": "valor"
  },
  {
   "id": "V-NF31",
   "ambito": "lineas",
   "valor": 749707.278,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-LMK31",
    "V-CUOTA-VF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 749707.3395,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ],
   "elemento": "Nf31",
   "campo": "valor"
  },
  {
   "id": "V-NM31",
   "ambito": "lineas",
   "valor": 1684590.878,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-P31-TOT",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 1684591.0623,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nm31",
   "campo": "valor"
  },
  {
   "id": "V-ND31",
   "ambito": "lineas",
   "valor": 1460991.896,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-P31-TOT",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 A4",
   "ref": {
    "valor": 1460992.1,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nd31",
   "campo": "valor"
  },
  {
   "id": "V-NB31",
   "ambito": "lineas",
   "valor": 619610.6755,
   "unidad": "accesos",
   "tipo": "derivado",
   "entradas": [
    "V-P31-TOT",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 A4",
   "ref": {
    "valor": 619610.7,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Nb31",
   "campo": "valor"
  },
  {
   "id": "V-NIMS",
   "ambito": "lineas",
   "valor": 2434298.156,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-NF31",
    "V-NM31"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 2434298.4018,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ],
   "elemento": "N_IMS31",
   "campo": "valor"
  },
  {
   "id": "V-RED-AF-MADRID",
   "ambito": "lineas",
   "valor": 454317.7685,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-MADRID",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 454318,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.abonados_fijos"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-MADRID",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-MADRID",
   "ambito": "lineas",
   "valor": 1235194.29,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-MADRID",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1235194,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.abonados_moviles"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-MADRID",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-MADRID",
   "ambito": "lineas",
   "valor": 1071244.58,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-MADRID",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1071244,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.lineas_datos_moviles"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-MADRID",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-ALCOBENDAS",
   "ambito": "lineas",
   "valor": 16315.671,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCOBENDAS",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 16316,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.abonados_fijos"
   },
   "dif_rel": 2e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCOBENDAS",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-ALCOBENDAS",
   "ambito": "lineas",
   "valor": 44358.87182,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCOBENDAS",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 44359,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.abonados_moviles"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCOBENDAS",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-ALCOBENDAS",
   "ambito": "lineas",
   "valor": 38471.03357,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCOBENDAS",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 38471,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.lineas_datos_moviles"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCOBENDAS",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-TRESCANTOS",
   "ambito": "lineas",
   "valor": 7228.458482,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TRESCANTOS",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 7228,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.abonados_fijos"
   },
   "dif_rel": 6.3e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TRESCANTOS",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-TRESCANTOS",
   "ambito": "lineas",
   "valor": 19652.65562,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TRESCANTOS",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 19653,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.abonados_moviles"
   },
   "dif_rel": 1.8e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TRESCANTOS",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-TRESCANTOS",
   "ambito": "lineas",
   "valor": 17044.12089,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TRESCANTOS",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 17044,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.lineas_datos_moviles"
   },
   "dif_rel": 7e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TRESCANTOS",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-TALAMANCA",
   "ambito": "lineas",
   "valor": 610.0071115,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TALAMANCA",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 610,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.abonados_fijos"
   },
   "dif_rel": 1.2e-05,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TALAMANCA",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-TALAMANCA",
   "ambito": "lineas",
   "valor": 1658.480811,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TALAMANCA",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1658,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.abonados_moviles"
   },
   "dif_rel": 0.00029,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TALAMANCA",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-TALAMANCA",
   "ambito": "lineas",
   "valor": 1438.347468,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TALAMANCA",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1438,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.lineas_datos_moviles"
   },
   "dif_rel": 0.000242,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TALAMANCA",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-TORREJON",
   "ambito": "lineas",
   "valor": 18574.28767,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TORREJON",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 18574,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.abonados_fijos"
   },
   "dif_rel": 1.5e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TORREJON",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-TORREJON",
   "ambito": "lineas",
   "valor": 50499.57468,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TORREJON",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 50500,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.abonados_moviles"
   },
   "dif_rel": 8e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TORREJON",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-TORREJON",
   "ambito": "lineas",
   "valor": 43796.66915,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TORREJON",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 43797,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.lineas_datos_moviles"
   },
   "dif_rel": 8e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TORREJON",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-ALCALA",
   "ambito": "lineas",
   "valor": 26088.18602,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCALA",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 26088,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.abonados_fijos"
   },
   "dif_rel": 7e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCALA",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-ALCALA",
   "ambito": "lineas",
   "valor": 70928.28114,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCALA",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 70928,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.abonados_moviles"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCALA",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-ALCALA",
   "ambito": "lineas",
   "valor": 61513.83416,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCALA",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 61514,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.lineas_datos_moviles"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCALA",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-LOSSANTOS",
   "ambito": "lineas",
   "valor": 369.2678281,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LOSSANTOS",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 369,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.abonados_fijos"
   },
   "dif_rel": 0.000726,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LOSSANTOS",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-LOSSANTOS",
   "ambito": "lineas",
   "valor": 1003.961422,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LOSSANTOS",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 1004,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.abonados_moviles"
   },
   "dif_rel": 3.8e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LOSSANTOS",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-LOSSANTOS",
   "ambito": "lineas",
   "valor": 870.7036942,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LOSSANTOS",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 871,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.lineas_datos_moviles"
   },
   "dif_rel": 0.00034,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LOSSANTOS",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-GETAFE",
   "ambito": "lineas",
   "valor": 24732.92269,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-GETAFE",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 24733,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.abonados_fijos"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-GETAFE",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-GETAFE",
   "ambito": "lineas",
   "valor": 67243.60572,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-GETAFE",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 67244,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.abonados_moviles"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-GETAFE",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-GETAFE",
   "ambito": "lineas",
   "valor": 58318.23279,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-GETAFE",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 58318,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.lineas_datos_moviles"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-GETAFE",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-LEGANES",
   "ambito": "lineas",
   "valor": 24773.12691,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LEGANES",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 24773,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.abonados_fijos"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LEGANES",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-LEGANES",
   "ambito": "lineas",
   "valor": 67352.9125,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LEGANES",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 67353,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.abonados_moviles"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LEGANES",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-LEGANES",
   "ambito": "lineas",
   "valor": 58413.03107,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LEGANES",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 58413,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.lineas_datos_moviles"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LEGANES",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-FUENLABRADA",
   "ambito": "lineas",
   "valor": 23997.86834,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-FUENLABRADA",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 23998,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.abonados_fijos"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-FUENLABRADA",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-FUENLABRADA",
   "ambito": "lineas",
   "valor": 65245.14781,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-FUENLABRADA",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 65245,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.abonados_moviles"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-FUENLABRADA",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-FUENLABRADA",
   "ambito": "lineas",
   "valor": 56585.03403,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-FUENLABRADA",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 56585,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.lineas_datos_moviles"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-FUENLABRADA",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-ALCORCON",
   "ambito": "lineas",
   "valor": 22353.28854,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 22353,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.abonados_fijos"
   },
   "dif_rel": 1.3e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-ALCORCON",
   "ambito": "lineas",
   "valor": 60773.88182,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 60774,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.abonados_moviles"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-ALCORCON",
   "ambito": "lineas",
   "valor": 52707.24777,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 52707,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.lineas_datos_moviles"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-RED-AF-BATRES",
   "ambito": "lineas",
   "valor": 249.8223937,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-BATRES",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 250,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.abonados_fijos"
   },
   "dif_rel": 0.00071,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-BATRES",
   "campo": "abonados_fijos"
  },
  {
   "id": "V-RED-AM-BATRES",
   "ambito": "lineas",
   "valor": 679.2144524,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-BATRES",
    "V-RATIO-TM",
    "V-CUOTA-TM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 679,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.abonados_moviles"
   },
   "dif_rel": 0.000316,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-BATRES",
   "campo": "abonados_moviles"
  },
  {
   "id": "V-RED-LD-BATRES",
   "ambito": "lineas",
   "valor": 589.0610137,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-BATRES",
    "V-RATIO-IM",
    "V-CUOTA-IM",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "ref": {
    "valor": 589,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.lineas_datos_moviles"
   },
   "dif_rel": 0.000104,
   "tol_abs": 0.5,
   "tol": 0.02,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-BATRES",
   "campo": "lineas_datos_moviles"
  },
  {
   "id": "V-POB-ES25",
   "ambito": "lineas",
   "valor": 49128297,
   "unidad": "hab",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-INE-ECP-56940",
    "localizador": "Total Nacional, 1-1-2025"
   }
  },
  {
   "id": "V-BAF-ES25",
   "ambito": "lineas",
   "valor": 19855381,
   "unidad": "accesos",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "2025, 'Banda ancha fija minorista', 'Líneas', suma por operador"
   }
  },
  {
   "id": "V-NAC-RATIO-IF",
   "ambito": "lineas",
   "valor": 0.4041536591,
   "unidad": "accesos/hab",
   "tipo": "derivado",
   "entradas": [
    "V-BAF-ES25",
    "V-POB-ES25"
   ],
   "estado": "trazado",
   "formula": "FX-032",
   "calc": "e[0]/e[1]",
   "nota": "Control del método: con los mismos datos sale el 40,4/100 nacional del IES.",
   "ref": {
    "valor": 0.404,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 ratio_if"
   },
   "dif_rel": 0.00038,
   "tol_abs": 0.0005
  },
  {
   "id": "V-IMP-L03-NB31",
   "ambito": "lineas",
   "valor": 805426.2032,
   "unidad": "accesos",
   "tipo": "derivado",
   "entradas": [
    "V-P31-TOT",
    "V-MAD-RATIO-IF",
    "V-MAD-CUOTA-IF"
   ],
   "estado": "trazado",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "impacto_de": "V-NB31"
  },
  {
   "id": "V-IMP-L03-NF31",
   "ambito": "lineas",
   "valor": 827968.7141,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-LMK31",
    "V-MAD-CUOTA-VF"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]",
   "impacto_de": "V-NF31",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-VF25",
   "ambito": "trafico",
   "valor": 356,
   "unidad": "GB/mes",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 10 y p. 75: 356 GB/línea/mes (banda ancha fija)"
   },
   "memoria": "v7 A4",
   "elemento": "Vf25",
   "campo": "valor"
  },
  {
   "id": "V-GF",
   "ambito": "trafico",
   "valor": 0.078,
   "unidad": "1/año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 10 y p. 75: +7,8 % interanual"
   },
   "memoria": "v7 A4",
   "elemento": "gf",
   "campo": "valor"
  },
  {
   "id": "V-SUP-L04",
   "ambito": "trafico",
   "valor": "g constante",
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L04",
   "huecos_raiz": [
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-VF31",
   "ambito": "trafico",
   "valor": 558.6792778,
   "unidad": "GB/mes",
   "tipo": "derivado",
   "entradas": [
    "V-VF25",
    "V-GF",
    "V-SUP-L04"
   ],
   "estado": "hueco",
   "formula": "FX-009",
   "calc": "e[0]*Math.pow(1+e[1],6)",
   "memoria": "v7 A4",
   "ref": {
    "valor": 558.6793,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L04"
   ],
   "elemento": "Vf31",
   "campo": "valor"
  },
  {
   "id": "V-FBH",
   "ambito": "trafico",
   "valor": 0.1,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L05",
   "memoria": "v7 §3.1.1",
   "huecos_raiz": [
    "V-FBH"
   ],
   "elemento": "fBH",
   "campo": "valor"
  },
  {
   "id": "V-MES",
   "ambito": "trafico",
   "valor": 30,
   "unidad": "días",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L15",
   "clase": "convencion",
   "elemento": "mes",
   "campo": "valor"
  },
  {
   "id": "V-IMP-L03-RF",
   "ambito": "trafico",
   "valor": 3333.147626,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-IMP-L03-NB31",
    "V-VF31",
    "V-FBH",
    "V-MES"
   ],
   "estado": "hueco",
   "formula": "FX-010",
   "calc": "e[0]*e[1]*8*e[2]/(e[3]*3600)",
   "impacto_de": "V-RF",
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-RES",
   "ambito": "trafico",
   "valor": 1.25,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARCO-FTTH100K",
    "localizador": "p4/p11 '+25% headroom'"
   },
   "supuesto": "S-L16",
   "memoria": "v7 §2.7.2",
   "elemento": "reserva",
   "campo": "valor"
  },
  {
   "id": "V-SPF",
   "ambito": "trafico",
   "valor": 0.9,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L07",
   "memoria": "v7 §3.3",
   "nota": "UL = 0,10",
   "huecos_raiz": [
    "V-SPF"
   ]
  },
  {
   "id": "V-IMP-L03-BNG-DL",
   "ambito": "core",
   "valor": 3749.79108,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-IMP-L03-RF"
   ],
   "estado": "hueco",
   "formula": "FX-012",
   "calc": "e[0]*e[1]*e[2]",
   "impacto_de": "V-BNG-DL",
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-SPM",
   "ambito": "trafico",
   "valor": 0.85,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L07",
   "memoria": "v7 §3.3",
   "nota": "UL = 0,15",
   "huecos_raiz": [
    "V-SPM"
   ]
  },
  {
   "id": "V-VM25",
   "ambito": "trafico",
   "valor": 14.6,
   "unidad": "GB/mes",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 103: 14,6 GB/línea/mes (banda ancha móvil)"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "Vm25",
   "campo": "valor"
  },
  {
   "id": "V-GM",
   "ambito": "trafico",
   "valor": 0.129,
   "unidad": "1/año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMC-IES-2025",
    "localizador": "p. 103: +12,9 % interanual"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "gm",
   "campo": "valor"
  },
  {
   "id": "V-VM31",
   "ambito": "trafico",
   "valor": 30.23545492,
   "unidad": "GB/mes",
   "tipo": "derivado",
   "entradas": [
    "V-VM25",
    "V-GM",
    "V-SUP-L04"
   ],
   "estado": "hueco",
   "formula": "FX-009",
   "calc": "e[0]*Math.pow(1+e[1],6)",
   "memoria": "v7 A4",
   "ref": {
    "valor": 30.2355,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 1e-06,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L04"
   ],
   "elemento": "Vm31",
   "campo": "valor"
  },
  {
   "id": "V-RM",
   "ambito": "trafico",
   "valor": 327.212997,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ND31",
    "V-VM31",
    "V-FBH",
    "V-MES"
   ],
   "estado": "hueco",
   "formula": "FX-010",
   "calc": "e[0]*e[1]*8*e[2]/(e[3]*3600)",
   "memoria": "v7 A4",
   "ref": {
    "valor": 327.21,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 9e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Rm",
   "campo": "valor"
  },
  {
   "id": "V-IMP-L03-INET-DL",
   "ambito": "demanda",
   "valor": 4097.454889,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-IMP-L03-RF",
    "V-SPM",
    "V-RM"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*(e[1]*e[2]+e[3]*e[4])",
   "impacto_de": "V-INET-DL-TOT",
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-IMP-L03-ALC-ACC",
   "ambito": "pon",
   "valor": 29056.83363,
   "unidad": "accesos",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-MAD-RATIO-IF",
    "V-MAD-CUOTA-IF"
   ],
   "estado": "trazado",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "impacto_de": "V-ALC-ACC"
  },
  {
   "id": "V-SPLIT",
   "ambito": "pon",
   "valor": 64,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARCO-COVDIM",
    "localizador": "p10 '1:32 and 1:64 are widely used ratios'"
   },
   "memoria": "v7 §6.1"
  },
  {
   "id": "V-UN",
   "ambito": "trafico",
   "valor": 0.7,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARCO-CS2",
    "localizador": "p36 'Max load 70% (overdimension 30%)'"
   },
   "supuesto": "S-L16",
   "memoria": "v7 §2.7.2",
   "elemento": "u_norm",
   "campo": "valor"
  },
  {
   "id": "V-IMP-L03-PON-ALC",
   "ambito": "pon",
   "valor": 811,
   "unidad": "PON",
   "tipo": "derivado",
   "entradas": [
    "V-IMP-L03-ALC-ACC",
    "V-SPLIT",
    "V-RES",
    "V-UN"
   ],
   "estado": "trazado",
   "formula": "FX-021",
   "calc": "Math.ceil(e[0]/e[1]*e[2]/e[3])",
   "impacto_de": "V-PON-ALC"
  },
  {
   "id": "V-IMP-L02-LMK31",
   "ambito": "lineas",
   "valor": 1846297.521,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H31-TOT",
    "V-LEMP-CALC",
    "V-E31-TOT"
   ],
   "estado": "trazado",
   "formula": "FX-007",
   "calc": "e[0]*e[1]+e[2]*e[3]",
   "impacto_de": "V-LMK31"
  },
  {
   "id": "V-IMP-L02-NF31",
   "ambito": "lineas",
   "valor": 771752.3639,
   "unidad": "líneas",
   "tipo": "derivado",
   "entradas": [
    "V-IMP-L02-LMK31",
    "V-CUOTA-VF"
   ],
   "estado": "trazado",
   "formula": "FX-008",
   "calc": "e[0]*e[1]",
   "impacto_de": "V-NF31"
  },
  {
   "id": "V-TRF-F",
   "ambito": "trafico",
   "valor": [
    52106194.38,
    58938063.09,
    67057255.59,
    75364128.26,
    84832201.26
   ],
   "unidad": "TB/año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "'Banda ancha fija minorista', 'Tráfico - datos', 2021-2025"
   }
  },
  {
   "id": "V-LIN-F",
   "ambito": "trafico",
   "valor": [
    16606351,
    17035417,
    17830207,
    19015119,
    19855381
   ],
   "unidad": "líneas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "'Banda ancha fija minorista', 'Líneas', suma por operador, 2021-2025"
   }
  },
  {
   "id": "V-TRF-M",
   "ambito": "trafico",
   "valor": [
    4350502.85,
    6201283.24,
    7899455.49,
    8679124.72,
    10220349.03
   ],
   "unidad": "TB/año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "'Banda Ancha móvil', 'Tráfico - datos', tráfico Nacional (todas las tecnologías), 2021-2025"
   }
  },
  {
   "id": "V-LIN-M",
   "ambito": "trafico",
   "valor": [
    50954186,
    52700116,
    54512263,
    55680797,
    58174065
   ],
   "unidad": "líneas",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-CNMCDATA-ANUAL",
    "localizador": "'Banda Ancha móvil', 'Líneas', total sin operador, 2021-2025"
   }
  },
  {
   "id": "V-UF25-CALC",
   "ambito": "trafico",
   "valor": 356.0420273,
   "unidad": "GB/mes",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-F",
    "V-LIN-F"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "e[0][4]*1000/(12*e[1][4])",
   "nota": "Control: la serie reproduce los 356 GB/mes del IES.",
   "ref": {
    "valor": 356,
    "donde": "memoria",
    "localizador": "v7 A4 Vf25"
   },
   "dif_rel": 0.000118,
   "tol_abs": 0.5
  },
  {
   "id": "V-UM25-CALC",
   "ambito": "trafico",
   "valor": 14.6404717,
   "unidad": "GB/mes",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-M",
    "V-LIN-M"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "e[0][4]*1000/(12*e[1][4])",
   "nota": "Control: la serie reproduce los 14,6 GB/mes del IES.",
   "ref": {
    "valor": 14.6,
    "donde": "memoria",
    "localizador": "v7 §3.1.1 Vm25"
   },
   "dif_rel": 0.002772,
   "tol_abs": 0.05
  },
  {
   "id": "V-GF-CAGR4",
   "ambito": "trafico",
   "valor": 0.08023151236,
   "unidad": "1/año",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-F",
    "V-LIN-F"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "Math.pow((e[0][4]/e[1][4])/(e[0][0]/e[1][0]), 1/4)-1",
   "nota": "Media compuesta 2021-2025 (informativa; v7 usa la tasa de 2025: 7,8 %)."
  },
  {
   "id": "V-GM-CAGR4",
   "ambito": "trafico",
   "valor": 0.1976893328,
   "unidad": "1/año",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-M",
    "V-LIN-M"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "Math.pow((e[0][4]/e[1][4])/(e[0][0]/e[1][0]), 1/4)-1",
   "nota": "Media compuesta 2021-2025 (informativa; v7 usa la tasa de 2025: 12,9 %)."
  },
  {
   "id": "V-GF-CAGR3",
   "ambito": "trafico",
   "valor": 0.07286844881,
   "unidad": "1/año",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-F",
    "V-LIN-F"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "Math.pow((e[0][4]/e[1][4])/(e[0][1]/e[1][1]), 1/3)-1",
   "nota": "Media compuesta 2022-2025 (informativa; v7 usa la tasa de 2025: 7,8 %)."
  },
  {
   "id": "V-GM-CAGR3",
   "ambito": "trafico",
   "valor": 0.1429365106,
   "unidad": "1/año",
   "tipo": "derivado",
   "entradas": [
    "V-TRF-M",
    "V-LIN-M"
   ],
   "estado": "trazado",
   "formula": "FX-033",
   "calc": "Math.pow((e[0][4]/e[1][4])/(e[0][1]/e[1][1]), 1/3)-1",
   "nota": "Media compuesta 2022-2025 (informativa; v7 usa la tasa de 2025: 12,9 %)."
  },
  {
   "id": "V-UP",
   "ambito": "trafico",
   "valor": 0.9,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L06",
   "memoria": "v7 §2.7.2",
   "huecos_raiz": [
    "V-UP"
   ],
   "elemento": "u_pico",
   "campo": "valor"
  },
  {
   "id": "V-PICO",
   "ambito": "trafico",
   "valor": 2,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L08",
   "memoria": "v7 §3.3",
   "nota": "Clase usa ×1,30 (FTTH for 100000 clients p11).",
   "huecos_raiz": [
    "V-PICO"
   ],
   "elemento": "pico2",
   "campo": "valor"
  },
  {
   "id": "V-RF",
   "ambito": "trafico",
   "valor": 2564.175146,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NB31",
    "V-VF31",
    "V-FBH",
    "V-MES"
   ],
   "estado": "hueco",
   "formula": "FX-010",
   "calc": "e[0]*e[1]*8*e[2]/(e[3]*3600)",
   "memoria": "v7 A4",
   "ref": {
    "valor": 2564.18,
    "donde": "memoria",
    "localizador": "v7 A4"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Rf",
   "campo": "valor"
  },
  {
   "id": "V-ERL",
   "ambito": "voz",
   "valor": 0.3,
   "unidad": "Erl/línea",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p3, ARCO05 '0.3 Erlang per subscriber in the busy hour'"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "A_lin",
   "campo": "valor"
  },
  {
   "id": "V-TLL",
   "ambito": "voz",
   "valor": 900,
   "unidad": "s",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p3, ARCO05 'average call duration of 900 seconds'"
   },
   "memoria": "v7 §3.1.1",
   "elemento": "t_llam",
   "campo": "valor"
  },
  {
   "id": "V-EXT",
   "ambito": "voz",
   "valor": 0.6,
   "unidad": "—",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p3, ARCO05 'sixty per cent exchanged with external operators'"
   },
   "memoria": "v7 §3.1.1"
  },
  {
   "id": "V-EVS-BITS",
   "ambito": "voz",
   "valor": 480,
   "unidad": "bit/trama",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS26445",
    "localizador": "Tabla A.1: 480 bits ↔ 23,85 kbit/s (Compact, sin cabecera de carga útil, A.2.1.1)"
   }
  },
  {
   "id": "V-RTP",
   "ambito": "voz",
   "valor": 12,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-RFC3550",
    "localizador": "§5.1 'first twelve octets'"
   }
  },
  {
   "id": "V-UDP",
   "ambito": "voz",
   "valor": 8,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-RFC768",
    "localizador": "longitud mínima 8"
   }
  },
  {
   "id": "V-IPV4",
   "ambito": "voz",
   "valor": 20,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-RFC791",
    "localizador": "§3.1 IHL mínimo 5 × 4 B"
   }
  },
  {
   "id": "V-VONR-IP-B",
   "ambito": "voz",
   "valor": 100,
   "unidad": "B",
   "tipo": "derivado",
   "entradas": [
    "V-EVS-BITS",
    "V-RTP",
    "V-UDP",
    "V-IPV4"
   ],
   "estado": "trazado",
   "formula": "FX-030",
   "calc": "Math.ceil(e[0]/8)+e[1]+e[2]+e[3]",
   "ref": {
    "valor": 100,
    "donde": "memoria",
    "localizador": "v7 §3.3 'IP voice uses 100 B at 50 packets/s'"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5
  },
  {
   "id": "V-TRAMA",
   "ambito": "voz",
   "valor": 0.02,
   "unidad": "s",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS26445",
    "localizador": "A.2.1.1 'a speech frame of 20 ms'"
   }
  },
  {
   "id": "V-RVONR-CALC",
   "ambito": "voz",
   "valor": 0.04,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-IP-B",
    "V-TRAMA"
   ],
   "estado": "trazado",
   "formula": "FX-030",
   "calc": "e[0]*8/e[1]/1e6",
   "nota": "Con EVS 24,4 kbit/s (488 bits = 61 B) serían 101 B y 0,0404 Mbit/s (+1 %).",
   "ref": {
    "valor": 0.04,
    "donde": "memoria",
    "localizador": "v7 §3.3 r_VoNR"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005
  },
  {
   "id": "V-RVONR",
   "ambito": "voz",
   "valor": 0.04,
   "unidad": "Mbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L09",
   "memoria": "v7 §3.3",
   "respaldo": [
    "V-RVONR-CALC"
   ],
   "elemento": "r_VoNR",
   "campo": "valor"
  },
  {
   "id": "V-G711-B",
   "ambito": "voz",
   "valor": 160,
   "unidad": "B/paquete",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-RFC3551",
    "localizador": "§4.5.14 PCMU/PCMA 8 bit × 8000 Hz × 20 ms"
   }
  },
  {
   "id": "V-IMS-IP-B",
   "ambito": "voz",
   "valor": 200,
   "unidad": "B",
   "tipo": "derivado",
   "entradas": [
    "V-G711-B",
    "V-RTP",
    "V-UDP",
    "V-IPV4"
   ],
   "estado": "trazado",
   "formula": "FX-030",
   "calc": "e[0]+e[1]+e[2]+e[3]"
  },
  {
   "id": "V-RIMS-CALC",
   "ambito": "voz",
   "valor": 0.08,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-IMS-IP-B",
    "V-TRAMA"
   ],
   "estado": "discrepa",
   "formula": "FX-030",
   "calc": "e[0]*8/e[1]/1e6",
   "nota": "80 kbit/s por sentido en IP; con Ethernet Q-in-Q de clase (34 B) serían 93,6. 128 = 2 × 64 parece sumar los dos sentidos.",
   "ref": {
    "valor": 0.128,
    "donde": "memoria",
    "localizador": "v7 §6.6 r_IMS"
   },
   "dif_rel": 0.375,
   "tol_abs": 0.0005
  },
  {
   "id": "V-RIMS",
   "ambito": "voz",
   "valor": 0.128,
   "unidad": "Mbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "discrepa",
   "supuesto": "S-L10",
   "memoria": "v7 §6.6",
   "respaldo": [
    "V-RIMS-CALC"
   ],
   "huecos_raiz": [
    "V-RIMS"
   ],
   "elemento": "r_IMS",
   "campo": "valor"
  },
  {
   "id": "V-NDC",
   "ambito": "voz",
   "valor": 3,
   "unidad": "DC",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p3 ARCO03 'at least two main data-centre/core sites'"
   },
   "supuesto": "S-L16",
   "memoria": "v7 §3.1.2",
   "nota": "3 DC activo-activo ≥ 2 del enunciado; N-1 deja 2.",
   "clase": "decision"
  },
  {
   "id": "V-QVONR",
   "ambito": "voz",
   "valor": 40.43018108,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ERL",
    "V-NM31",
    "V-RVONR"
   ],
   "estado": "hueco",
   "formula": "FX-013",
   "calc": "2*e[0]*e[1]*e[2]/1000",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 40.4302,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Q_VoNR",
   "campo": "valor"
  },
  {
   "id": "V-QVONR-R",
   "ambito": "voz",
   "valor": 50.53772635,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-QVONR",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 50.54,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 4.5e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Q_VoNR_r",
   "campo": "valor"
  },
  {
   "id": "V-VFRTP",
   "ambito": "voz",
   "valor": 35.98594935,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ERL",
    "V-NF31",
    "V-RIMS",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]*e[2]*e[3]/1000",
   "memoria": "v7 A11",
   "ref": {
    "valor": 35.985952,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-07,
   "huecos_raiz": [
    "V-LEMP",
    "V-RIMS",
    "V-SUP-L03"
   ],
   "elemento": "VF_RTP",
   "campo": "valor"
  },
  {
   "id": "V-IMP-L10-VFRTP",
   "ambito": "voz",
   "valor": 22.49121834,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ERL",
    "V-NF31",
    "V-RIMS-CALC",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]*e[2]*e[3]/1000",
   "impacto_de": "V-VFRTP",
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-AIMS",
   "ambito": "core",
   "valor": 730289.4469,
   "unidad": "Erl",
   "tipo": "derivado",
   "entradas": [
    "V-ERL",
    "V-NIMS"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.6 / A1",
   "ref": {
    "valor": 730289.5205,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ],
   "elemento": "A_IMS",
   "campo": "valor"
  },
  {
   "id": "V-LEGS",
   "ambito": "core",
   "valor": 1460578.894,
   "unidad": "patas",
   "tipo": "derivado",
   "entradas": [
    "V-AIMS"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "2*e[0]",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 1460579.04,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ],
   "elemento": "legs",
   "campo": "valor"
  },
  {
   "id": "V-CAPS-O",
   "ambito": "core",
   "valor": 811.4327188,
   "unidad": "llamadas/s",
   "tipo": "derivado",
   "entradas": [
    "V-AIMS",
    "V-TLL"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "e[0]/e[1]",
   "memoria": "v7 A1",
   "ref": {
    "valor": 811.43,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-CAPS-T",
   "ambito": "core",
   "valor": 1298.29235,
   "unidad": "llamadas/s",
   "tipo": "derivado",
   "entradas": [
    "V-CAPS-O",
    "V-EXT"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "e[0]*(1+e[1])",
   "memoria": "v7 A1",
   "nota": "Reconstruida: originadas + entrantes de otros operadores (60 %).",
   "ref": {
    "valor": 1298.29,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-CDC",
   "ambito": "core",
   "valor": 1014291,
   "unidad": "patas",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-LEGS",
    "V-NDC",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*e[1]/((e[2]-1)*e[3]))",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 1014292,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03",
    "V-UP"
   ]
  },
  {
   "id": "V-CAPS-DC",
   "ambito": "core",
   "valor": 902,
   "unidad": "llamadas/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-CAPS-T",
    "V-NDC",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*e[1]/((e[2]-1)*e[3]))",
   "memoria": "v7 A1",
   "ref": {
    "valor": 902,
    "donde": "memoria",
    "localizador": "v7 A1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03",
    "V-UP"
   ]
  },
  {
   "id": "V-HSS-TOT",
   "ambito": "core",
   "valor": 3042873,
   "unidad": "registros",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-NIMS"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*e[1])",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 3042874,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-HSS-DC",
   "ambito": "core",
   "valor": 1690485,
   "unidad": "registros",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-NIMS",
    "V-NDC",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*e[1]/((e[2]-1)*e[3]))",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 1690486,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03",
    "V-UP"
   ]
  },
  {
   "id": "V-IOT",
   "ambito": "core",
   "valor": 100000,
   "unidad": "dispositivos",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p4, SCOM07 'at least 100,000 devices'"
   },
   "memoria": "v7 §3.3"
  },
  {
   "id": "V-UDM-TOT",
   "ambito": "core",
   "valor": 2230739,
   "unidad": "suscriptores",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-NM31",
    "V-IOT"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*(e[1]+e[2]))",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 2230739,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-UDM-DC",
   "ambito": "core",
   "valor": 1239300,
   "unidad": "suscriptores",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-NM31",
    "V-IOT",
    "V-NDC",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-024",
   "calc": "Math.ceil(e[0]*(e[1]+e[2])/((e[3]-1)*e[4]))",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 1239300,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03",
    "V-UP"
   ]
  },
  {
   "id": "V-SIPP",
   "ambito": "core",
   "valor": "12/llamada · 4/registro · T_reg 3600 s · tormenta 20 %/300 s",
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L17",
   "memoria": "v7 §6.6",
   "huecos_raiz": [
    "V-SIPP"
   ]
  },
  {
   "id": "V-SIP",
   "ambito": "core",
   "valor": 18284.28393,
   "unidad": "mensajes/s",
   "tipo": "derivado",
   "entradas": [
    "V-CAPS-T",
    "V-NIMS",
    "V-SIPP"
   ],
   "estado": "hueco",
   "formula": "FX-025",
   "calc": "12*e[0]+4*e[1]/3600",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 18284.29,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-SIPP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-SIP-TORM",
   "ambito": "core",
   "valor": 24775.74568,
   "unidad": "mensajes/s",
   "tipo": "derivado",
   "entradas": [
    "V-SIP",
    "V-NIMS",
    "V-SIPP"
   ],
   "estado": "hueco",
   "formula": "FX-025",
   "calc": "e[0]+4*0.2*e[1]/300",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 24775.75,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-SIPP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-IMS-MEDIA",
   "ambito": "core",
   "valor": 186.9540984,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-LEGS",
    "V-RIMS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/1000",
   "memoria": "v7 §6.6",
   "ref": {
    "valor": 186.95,
    "donde": "memoria",
    "localizador": "v7 §6.6"
   },
   "dif_rel": 2.2e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-LEMP",
    "V-RIMS",
    "V-SUP-L03"
   ],
   "elemento": "IMS_media",
   "campo": "valor"
  },
  {
   "id": "V-BNG-DL",
   "ambito": "core",
   "valor": 2884.697039,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF"
   ],
   "estado": "hueco",
   "formula": "FX-012",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.10",
   "ref": {
    "valor": 2884.7,
    "donde": "memoria",
    "localizador": "v7 §3.4 / §6.10"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "BNG",
   "campo": "DL"
  },
  {
   "id": "V-BNG-UL",
   "ambito": "core",
   "valor": 320.5218933,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF"
   ],
   "estado": "hueco",
   "formula": "FX-012",
   "calc": "e[0]*(1-e[1])*e[2]",
   "memoria": "v7 §6.10",
   "ref": {
    "valor": 320.52,
    "donde": "memoria",
    "localizador": "v7 §3.4 / §6.10"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "BNG",
   "campo": "UL"
  },
  {
   "id": "V-BNG-SES",
   "ambito": "core",
   "valor": 774513.3444,
   "unidad": "sesiones",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-NB31"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §5.1",
   "ref": {
    "valor": 774515,
    "donde": "simulador",
    "localizador": "red.js CORE-1.capacidad_detalle.nota"
   },
   "dif_rel": 2e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-IMP-L10-IMS-MEDIA",
   "ambito": "core",
   "valor": 116.8463115,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-LEGS",
    "V-RIMS-CALC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/1000",
   "impacto_de": "V-IMS-MEDIA",
   "huecos_raiz": [
    "V-LEMP",
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-RBH-DL",
   "ambito": "radio",
   "valor": 318.5612285,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-SPM",
    "V-RM",
    "V-QVONR"
   ],
   "estado": "hueco",
   "formula": "FX-015",
   "calc": "e[0]*e[1]+e[2]",
   "memoria": "v7 A5",
   "ref": {
    "valor": 318.5613,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "radio_DL",
   "campo": "valor"
  },
  {
   "id": "V-RBH-UL",
   "ambito": "radio",
   "valor": 89.51213063,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-SPM",
    "V-RM",
    "V-QVONR"
   ],
   "estado": "hueco",
   "formula": "FX-015",
   "calc": "(1-e[0])*e[1]+e[2]",
   "memoria": "v7 A5",
   "ref": {
    "valor": 89.5121,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "radio_UL",
   "campo": "valor"
  },
  {
   "id": "V-RPK-DL",
   "ambito": "radio",
   "valor": 596.692276,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-SPM",
    "V-PICO",
    "V-RM",
    "V-QVONR"
   ],
   "estado": "hueco",
   "formula": "FX-015",
   "calc": "e[0]*e[1]*e[2]+e[3]",
   "memoria": "v7 A5",
   "ref": {
    "valor": 596.6923,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-RPK-UL",
   "ambito": "radio",
   "valor": 138.5940802,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-SPM",
    "V-PICO",
    "V-RM",
    "V-QVONR"
   ],
   "estado": "hueco",
   "formula": "FX-015",
   "calc": "(1-e[0])*e[1]*e[2]+e[3]",
   "memoria": "v7 A5",
   "ref": {
    "valor": 138.5941,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-RCAP-DL",
   "ambito": "radio",
   "valor": 828.7392722,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-RBH-DL",
    "V-UN",
    "V-RPK-DL",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-014",
   "calc": "e[0]*Math.max(e[1]/e[2], e[3]/e[4])",
   "memoria": "v7 A5 / §6.2.7",
   "ref": {
    "valor": 828.74,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "radio_cap_DL",
   "campo": "valor",
   "tambien": [
    "territorial|capacidad_dl_gbps"
   ]
  },
  {
   "id": "V-RCAP-UL",
   "ambito": "radio",
   "valor": 192.491778,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-RBH-UL",
    "V-UN",
    "V-RPK-UL",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-014",
   "calc": "e[0]*Math.max(e[1]/e[2], e[3]/e[4])",
   "memoria": "v7 A5 / §6.2.7",
   "ref": {
    "valor": 192.49,
    "donde": "memoria",
    "localizador": "v7 A5"
   },
   "dif_rel": 9e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "radio_cap_UL",
   "campo": "valor",
   "tambien": [
    "territorial|capacidad_ul_gbps"
   ]
  },
  {
   "id": "V-UPF-DL",
   "ambito": "core",
   "valor": 398.2015357,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-RBH-DL"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.7",
   "ref": {
    "valor": 398.2,
    "donde": "memoria",
    "localizador": "v7 §6.7"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "UPF_central",
   "campo": "DL"
  },
  {
   "id": "V-UPF-UL",
   "ambito": "core",
   "valor": 111.8901633,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-RBH-UL"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.7",
   "ref": {
    "valor": 111.89,
    "donde": "memoria",
    "localizador": "v7 §6.7"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "UPF_central",
   "campo": "UL"
  },
  {
   "id": "V-BW-N28",
   "ambito": "radio",
   "valor": 10,
   "unidad": "MHz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.1",
   "huecos_raiz": [
    "V-BW-N28"
   ]
  },
  {
   "id": "V-SE-N28-DL",
   "ambito": "radio",
   "valor": 3.0,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Rural – eMBB 3,3 / 1,6"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N28-DL",
   "ambito": "radio",
   "valor": 1.0,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L15",
   "nota": "FDD: el sentido usa todo el tiempo.",
   "clase": "convencion"
  },
  {
   "id": "V-CSEC-N28-DL",
   "ambito": "radio",
   "valor": 30.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N28",
    "V-SE-N28-DL",
    "V-TDD-N28-DL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 30,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N28"
   ],
   "elemento": "n28",
   "campo": "sector_mbps.dl"
  },
  {
   "id": "V-SE-N28-UL",
   "ambito": "radio",
   "valor": 1.5,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Rural – eMBB 3,3 / 1,6"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N28-UL",
   "ambito": "radio",
   "valor": 1.0,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L15",
   "nota": "FDD: el sentido usa todo el tiempo.",
   "clase": "convencion"
  },
  {
   "id": "V-CSEC-N28-UL",
   "ambito": "radio",
   "valor": 15.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N28",
    "V-SE-N28-UL",
    "V-TDD-N28-UL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 15,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N28"
   ],
   "elemento": "n28",
   "campo": "sector_mbps.ul"
  },
  {
   "id": "V-BW-N78",
   "ambito": "radio",
   "valor": 100,
   "unidad": "MHz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.1",
   "huecos_raiz": [
    "V-BW-N78"
   ]
  },
  {
   "id": "V-SE-N78-DL",
   "ambito": "radio",
   "valor": 4.0,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Dense Urban – eMBB 7,8 / 5,4"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N78-DL",
   "ambito": "radio",
   "valor": 0.7,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.6",
   "huecos_raiz": [
    "V-TDD-N78-DL"
   ]
  },
  {
   "id": "V-CSEC-N78-DL",
   "ambito": "radio",
   "valor": 280.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N78",
    "V-SE-N78-DL",
    "V-TDD-N78-DL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 280,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-TDD-N78-DL"
   ],
   "elemento": "n78",
   "campo": "sector_mbps.dl"
  },
  {
   "id": "V-SE-N78-UL",
   "ambito": "radio",
   "valor": 2.0,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Dense Urban – eMBB 7,8 / 5,4"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N78-UL",
   "ambito": "radio",
   "valor": 0.3,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.6",
   "huecos_raiz": [
    "V-TDD-N78-UL"
   ]
  },
  {
   "id": "V-CSEC-N78-UL",
   "ambito": "radio",
   "valor": 60.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N78",
    "V-SE-N78-UL",
    "V-TDD-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 60,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-TDD-N78-UL"
   ],
   "elemento": "n78",
   "campo": "sector_mbps.ul"
  },
  {
   "id": "V-26G-BANDA",
   "ambito": "radio",
   "valor": [
    25.1,
    27.5
   ],
   "unidad": "GHz",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-BOE-26GHZ",
    "localizador": "Anexo: 'Banda 25,10-27,50 GHz'"
   }
  },
  {
   "id": "V-26G-NCONC",
   "ambito": "radio",
   "valor": 12,
   "unidad": "concesiones",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-BOE-26GHZ",
    "localizador": "Anexo: concesiones estatales 1-12"
   }
  },
  {
   "id": "V-26G-TEF",
   "ambito": "radio",
   "valor": 5,
   "unidad": "concesiones",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-BOE-26GHZ",
    "localizador": "Anexo: 8, 9, 10, 11 y 12 a Telefónica Móviles España, SAU"
   }
  },
  {
   "id": "V-TEF-26G",
   "ambito": "radio",
   "valor": 1000,
   "unidad": "MHz",
   "tipo": "derivado",
   "entradas": [
    "V-26G-BANDA",
    "V-26G-NCONC",
    "V-26G-TEF"
   ],
   "estado": "trazado",
   "formula": "FX-034",
   "calc": "Math.round((e[0][1]-e[0][0])*1000/e[1]*e[2])",
   "nota": "1 000 MHz (la nota de prensa de Telefónica del 21-12-2022 dice '5 bloques de 200 MHz')."
  },
  {
   "id": "V-BW-N258",
   "ambito": "radio",
   "valor": 400,
   "unidad": "MHz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-BOE-26GHZ",
    "localizador": "Anexo: concesiones 8-12 (5 × 200 MHz) a Telefónica"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.1",
   "nota": "Portadora de 400 MHz dentro de los 1 000 MHz de Telefónica en 26 GHz.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]<=e[1]",
    "entradas": [
     "V-BW-N258",
     "V-TEF-26G"
    ],
    "cumple": true
   }
  },
  {
   "id": "V-SE-N258-DL",
   "ambito": "radio",
   "valor": 6.0,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Indoor Hotspot – eMBB 9 / 6,75"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N258-DL",
   "ambito": "radio",
   "valor": 0.6,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.6",
   "huecos_raiz": [
    "V-TDD-N258-DL"
   ]
  },
  {
   "id": "V-CSEC-N258-DL",
   "ambito": "radio",
   "valor": 1440.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N258",
    "V-SE-N258-DL",
    "V-TDD-N258-DL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 1440,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-TDD-N258-DL"
   ],
   "elemento": "n258",
   "campo": "sector_mbps.dl"
  },
  {
   "id": "V-SE-N258-UL",
   "ambito": "radio",
   "valor": 3.0,
   "unidad": "bit/s/Hz",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ITU-M2410",
    "localizador": "Tabla 2: Indoor Hotspot – eMBB 9 / 6,75"
   },
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.2",
   "nota": "Acotado: el valor del grupo es menor que el mínimo IMT-2020 medio de M.2410 (conservador), no igual."
  },
  {
   "id": "V-TDD-N258-UL",
   "ambito": "radio",
   "valor": 0.4,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L14",
   "memoria": "v7 §6.2.6",
   "huecos_raiz": [
    "V-TDD-N258-UL"
   ]
  },
  {
   "id": "V-CSEC-N258-UL",
   "ambito": "radio",
   "valor": 480.0,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-BW-N258",
    "V-SE-N258-UL",
    "V-TDD-N258-UL"
   ],
   "estado": "hueco",
   "formula": "FX-019",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.2.2",
   "ref": {
    "valor": 480,
    "donde": "memoria",
    "localizador": "v7 §6.2.2"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-TDD-N258-UL"
   ],
   "elemento": "n258",
   "campo": "sector_mbps.ul"
  },
  {
   "id": "V-RCAPZ-UL-C",
   "ambito": "radio",
   "valor": 141.140943,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-UL",
    "V-W-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 141.14,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 7e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "CENTRO",
   "campo": "ul_gbps"
  },
  {
   "id": "V-RCAPZ-DL-C",
   "ambito": "radio",
   "valor": 607.6573431,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-DL",
    "V-W-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-SEC-C",
   "ambito": "radio",
   "valor": 2353,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-RCAPZ-DL-C",
    "V-CSEC-N78-DL",
    "V-RCAPZ-UL-C",
    "V-CSEC-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.max(Math.ceil(1000*e[0]/e[1]), Math.ceil(1000*e[2]/e[3]))",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 2353,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "CENTRO",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-C",
   "ambito": "radio",
   "valor": 785,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-C"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(e[0]/3)",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-MADRID-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-MADRID-n28|sitios"
   ]
  },
  {
   "id": "V-RCAPZ-UL-N",
   "ambito": "radio",
   "valor": 7.50386151,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-UL",
    "V-W-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-RCAPZ-DL-N",
   "ambito": "radio",
   "valor": 32.30654728,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-DL",
    "V-W-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-SEC-N",
   "ambito": "radio",
   "valor": 126,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-RCAPZ-DL-N",
    "V-CSEC-N78-DL",
    "V-RCAPZ-UL-N",
    "V-CSEC-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.max(Math.ceil(1000*e[0]/e[1]), Math.ceil(1000*e[2]/e[3]))",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 125,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.008,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "NORTE",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-N",
   "ambito": "radio",
   "valor": 42,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-N"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(e[0]/3)",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ]
  },
  {
   "id": "V-RCAPZ-UL-E",
   "ambito": "radio",
   "valor": 13.98981705,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-UL",
    "V-W-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-RCAPZ-DL-E",
   "ambito": "radio",
   "valor": 60.2306806,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-DL",
    "V-W-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-SEC-E",
   "ambito": "radio",
   "valor": 234,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-RCAPZ-DL-E",
    "V-CSEC-N78-DL",
    "V-RCAPZ-UL-E",
    "V-CSEC-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.max(Math.ceil(1000*e[0]/e[1]), Math.ceil(1000*e[2]/e[3]))",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 234,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "ESTE",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-E",
   "ambito": "radio",
   "valor": 78,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-E"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(e[0]/3)",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ]
  },
  {
   "id": "V-RCAPZ-UL-S",
   "ambito": "radio",
   "valor": 29.85715644,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-UL",
    "V-W-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-RCAPZ-DL-S",
   "ambito": "radio",
   "valor": 128.5447012,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RCAP-DL",
    "V-W-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "huecos_raiz": [
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ]
  },
  {
   "id": "V-SEC-S",
   "ambito": "radio",
   "valor": 498,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-RCAPZ-DL-S",
    "V-CSEC-N78-DL",
    "V-RCAPZ-UL-S",
    "V-CSEC-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.max(Math.ceil(1000*e[0]/e[1]), Math.ceil(1000*e[2]/e[3]))",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 498,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "SUR",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-S",
   "ambito": "radio",
   "valor": 166,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-S"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(e[0]/3)",
   "memoria": "v7 §6.2.7",
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ]
  },
  {
   "id": "V-SEC-TOT",
   "ambito": "radio",
   "valor": 3211,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-C",
    "V-SEC-N",
    "V-SEC-E",
    "V-SEC-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 3210,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.000312,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "territorial",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-TOT",
   "ambito": "radio",
   "valor": 1071,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SIT-C",
    "V-SIT-N",
    "V-SIT-E",
    "V-SIT-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 1071,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-DL",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "territorial",
   "campo": "sitios_trisector"
  },
  {
   "id": "V-SEC-ALC",
   "ambito": "radio",
   "valor": 116,
   "unidad": "sectores",
   "tipo": "derivado",
   "entradas": [
    "V-RCAPZ-UL-S",
    "V-RED-P31-ALCORCON",
    "V-P31-ZS",
    "V-CSEC-N78-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(1000*e[0]*e[1]/e[2]/e[3])",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 116,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "sectores_n78"
  },
  {
   "id": "V-SIT-ALC",
   "ambito": "radio",
   "valor": 39,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-SEC-ALC"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.ceil(e[0]/3)",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 39,
    "donde": "memoria",
    "localizador": "v7 §6.2.7"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "sitios",
   "tambien": [
    "R-Z-ALCORCON-n78|sitios",
    "R-Z-ALCORCON-n28|sitios"
   ]
  },
  {
   "id": "V-HAB-SITIO",
   "ambito": "radio",
   "valor": 4621.224599,
   "unidad": "hab/sitio",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-SIT-ALC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.2.7",
   "ref": {
    "valor": 4600,
    "donde": "memoria",
    "localizador": "v7 §6.2.7 'atajo urbano ≈1 sitio por 4 600 habitantes'"
   },
   "dif_rel": 0.004614,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ]
  },
  {
   "id": "V-SIT-ALCOBENDAS",
   "ambito": "radio",
   "valor": 29,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCOBENDAS",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 29,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-ALCOBENDAS-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-ALCOBENDAS-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-ALCOBENDAS-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-TRESCANTOS",
   "ambito": "radio",
   "valor": 13,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TRESCANTOS",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 13,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-TRESCANTOS-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-TRESCANTOS-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-TRESCANTOS-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-TORREJON",
   "ambito": "radio",
   "valor": 33,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-TORREJON",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 33,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-TORREJON-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-TORREJON-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-TORREJON-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-ALCALA",
   "ambito": "radio",
   "valor": 46,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCALA",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 46,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-ALCALA-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-ALCALA-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-ALCALA-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-GETAFE",
   "ambito": "radio",
   "valor": 43,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-GETAFE",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 43,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-GETAFE-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-GETAFE-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-GETAFE-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-LEGANES",
   "ambito": "radio",
   "valor": 43,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-LEGANES",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 43,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-LEGANES-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-LEGANES-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-LEGANES-n28|sitios"
   ]
  },
  {
   "id": "V-SIT-FUENLABRADA",
   "ambito": "radio",
   "valor": 42,
   "unidad": "sitios",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-FUENLABRADA",
    "V-HAB-SITIO"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.round(e[0]/4600)",
   "supuesto": "S-062",
   "nota": "Atajo de 4 600 hab/sitio (S-062); el recálculo usa 4 600 redondeado de la memoria.",
   "ref": {
    "valor": 42,
    "donde": "simulador",
    "localizador": "radio_datos.js R-Z-FUENLABRADA-n78.sitios"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-BW-N78",
    "V-FBH",
    "V-PICO",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-TDD-N78-UL",
    "V-UP"
   ],
   "elemento": "R-Z-FUENLABRADA-n78",
   "campo": "sitios",
   "tambien": [
    "R-Z-FUENLABRADA-n28|sitios"
   ]
  },
  {
   "id": "V-INET-DL-C",
   "ambito": "demanda",
   "valor": 2370.067247,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*(e[1]*e[2]+e[3]*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 2370.07,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_C",
   "campo": "DL"
  },
  {
   "id": "V-INET-UL-C",
   "ambito": "demanda",
   "valor": 280.0021052,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*((1-e[1])*e[2]+(1-e[3])*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 280.0,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 8e-06,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_C",
   "campo": "UL"
  },
  {
   "id": "V-VONR-C",
   "ambito": "demanda",
   "valor": 37.05582871,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-QVONR-R",
    "V-W-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 37.06,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 0.000113,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "VoNR_C",
   "campo": "valor"
  },
  {
   "id": "V-INET-DL-N",
   "ambito": "demanda",
   "valor": 126.0063594,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*(e[1]*e[2]+e[3]*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 126.01,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 2.9e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_N",
   "campo": "DL"
  },
  {
   "id": "V-INET-UL-N",
   "ambito": "demanda",
   "valor": 14.8865168,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*((1-e[1])*e[2]+(1-e[3])*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 14.89,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 0.000234,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_N",
   "campo": "UL"
  },
  {
   "id": "V-VONR-N",
   "ambito": "demanda",
   "valor": 1.970100248,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-QVONR-R",
    "V-W-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 1.97,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 5.1e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "VoNR_N",
   "campo": "valor"
  },
  {
   "id": "V-INET-DL-E",
   "ambito": "demanda",
   "valor": 234.9198359,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*(e[1]*e[2]+e[3]*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 234.92,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_E",
   "campo": "DL"
  },
  {
   "id": "V-INET-UL-E",
   "ambito": "demanda",
   "valor": 27.7536634,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*((1-e[1])*e[2]+(1-e[3])*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 27.75,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 0.000132,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_E",
   "campo": "UL"
  },
  {
   "id": "V-VONR-E",
   "ambito": "demanda",
   "valor": 3.672954517,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-QVONR-R",
    "V-W-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 3.67,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 0.000805,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "VoNR_E",
   "campo": "valor"
  },
  {
   "id": "V-INET-DL-S",
   "ambito": "demanda",
   "valor": 501.3674065,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*(e[1]*e[2]+e[3]*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 501.37,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_S",
   "campo": "DL"
  },
  {
   "id": "V-INET-UL-S",
   "ambito": "demanda",
   "valor": 59.23204478,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-SPM",
    "V-RM",
    "V-W-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-016",
   "calc": "e[0]*((1-e[1])*e[2]+(1-e[3])*e[4])*e[5]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 59.23,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 3.5e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_S",
   "campo": "UL"
  },
  {
   "id": "V-VONR-S",
   "ambito": "demanda",
   "valor": 7.838842869,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-QVONR-R",
    "V-W-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 7.84,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 0.000148,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "VoNR_S",
   "campo": "valor"
  },
  {
   "id": "V-INET-DL-TOT",
   "ambito": "demanda",
   "valor": 3232.360849,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-C",
    "V-INET-DL-N",
    "V-INET-DL-E",
    "V-INET-DL-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 3232.37,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_tot",
   "campo": "DL"
  },
  {
   "id": "V-INET-UL-TOT",
   "ambito": "demanda",
   "valor": 381.8743302,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-C",
    "V-INET-UL-N",
    "V-INET-UL-E",
    "V-INET-UL-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.4.1",
   "ref": {
    "valor": 381.87,
    "donde": "memoria",
    "localizador": "v7 §3.4.1"
   },
   "dif_rel": 1.1e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Inet_tot",
   "campo": "UL"
  },
  {
   "id": "V-VF-C",
   "ambito": "demanda",
   "valor": 26.3860144,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VFRTP",
    "V-INET-DL-C",
    "V-INET-DL-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-017",
   "calc": "e[0]*e[1]/e[2]",
   "memoria": "v7 A11.1",
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "VF_C",
   "campo": "valor"
  },
  {
   "id": "V-A111-DL-C",
   "ambito": "demanda",
   "valor": 2433.50909,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-C",
    "V-VONR-C",
    "V-VF-C"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 2433.52,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_C",
   "campo": "DL"
  },
  {
   "id": "V-A111-UL-C",
   "ambito": "demanda",
   "valor": 343.4439483,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-C",
    "V-VONR-C",
    "V-VF-C"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 343.45,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 1.8e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_C",
   "campo": "UL"
  },
  {
   "id": "V-VF-N",
   "ambito": "demanda",
   "valor": 1.402831762,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VFRTP",
    "V-INET-DL-N",
    "V-INET-DL-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-017",
   "calc": "e[0]*e[1]/e[2]",
   "memoria": "v7 A11.1",
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "VF_N",
   "campo": "valor"
  },
  {
   "id": "V-A111-DL-N",
   "ambito": "demanda",
   "valor": 129.3792914,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-N",
    "V-VONR-N",
    "V-VF-N"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 129.38,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_N",
   "campo": "DL"
  },
  {
   "id": "V-A111-UL-N",
   "ambito": "demanda",
   "valor": 18.25944881,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-N",
    "V-VONR-N",
    "V-VF-N"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 18.26,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 3e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_N",
   "campo": "UL"
  },
  {
   "id": "V-VF-E",
   "ambito": "demanda",
   "valor": 2.615368058,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VFRTP",
    "V-INET-DL-E",
    "V-INET-DL-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-017",
   "calc": "e[0]*e[1]/e[2]",
   "memoria": "v7 A11.1",
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "VF_E",
   "campo": "valor"
  },
  {
   "id": "V-A111-DL-E",
   "ambito": "demanda",
   "valor": 241.2081585,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-E",
    "V-VONR-E",
    "V-VF-E"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 241.21,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 8e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_E",
   "campo": "DL"
  },
  {
   "id": "V-A111-UL-E",
   "ambito": "demanda",
   "valor": 34.04198598,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-E",
    "V-VONR-E",
    "V-VF-E"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 34.04,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 5.8e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_E",
   "campo": "UL"
  },
  {
   "id": "V-VF-S",
   "ambito": "demanda",
   "valor": 5.581735127,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VFRTP",
    "V-INET-DL-S",
    "V-INET-DL-TOT"
   ],
   "estado": "hueco",
   "formula": "FX-017",
   "calc": "e[0]*e[1]/e[2]",
   "memoria": "v7 A11.1",
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "VF_S",
   "campo": "valor"
  },
  {
   "id": "V-A111-DL-S",
   "ambito": "demanda",
   "valor": 514.7879845,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-S",
    "V-VONR-S",
    "V-VF-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 514.79,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_S",
   "campo": "DL"
  },
  {
   "id": "V-A111-UL-S",
   "ambito": "demanda",
   "valor": 72.65262278,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-S",
    "V-VONR-S",
    "V-VF-S"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 A11.1",
   "ref": {
    "valor": 72.65,
    "donde": "memoria",
    "localizador": "v7 A11.1"
   },
   "dif_rel": 3.6e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "A111_S",
   "campo": "UL"
  },
  {
   "id": "V-RED-DL-MADRID",
   "ambito": "demanda",
   "valor": 2433.50909,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2433.511,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.dl_gbps"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-MADRID",
   "ambito": "demanda",
   "valor": 343.4439483,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-C",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 343.448,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID.ul_gbps"
   },
   "dif_rel": 1.2e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-MADRID",
   "ambito": "demanda",
   "valor": 0.6595825061,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-MADRID",
    "V-LEMP",
    "V-E25-MADRID"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-MADRID",
   "ambito": "demanda",
   "valor": 1395.115514,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC",
    "V-PRES-MADRID"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 1395.116,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/residencial-fijo"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-MADRID",
   "ambito": "demanda",
   "valor": 720.0338433,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC",
    "V-PRES-MADRID"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 720.034,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/empresa"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-MADRID",
   "ambito": "demanda",
   "valor": 254.9178901,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 254.915,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/movil-ebb"
   },
   "dif_rel": 1.1e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-MADRID",
   "ambito": "demanda",
   "valor": 155.0128348,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC",
    "V-PRES-MADRID"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 155.013,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/residencial-fijo"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-MADRID",
   "ambito": "demanda",
   "valor": 80.00376037,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC",
    "V-PRES-MADRID"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 80.004,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/empresa"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-MADRID",
   "ambito": "demanda",
   "valor": 44.98551001,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZC",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 44.985,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/movil-ebb"
   },
   "dif_rel": 1.1e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-MADRID",
   "ambito": "demanda",
   "valor": 37.05582871,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-C",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 37.06,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/voz-ims"
   },
   "dif_rel": 0.000113,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-MADRID/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-MADRID/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-MADRID",
   "ambito": "demanda",
   "valor": 26.3860144,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-C",
    "V-P25-MADRID",
    "V-P25-ZC"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 26.386,
    "donde": "simulador",
    "localizador": "red.js Z-MADRID/voz-fija"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-MADRID/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-MADRID/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 87.39331022,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-N",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 87.3963,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.dl_gbps"
   },
   "dif_rel": 3.4e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 12.3339188,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-N",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 12.3353,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS.ul_gbps"
   },
   "dif_rel": 0.000112,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 0.6210394557,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-ALCOBENDAS",
    "V-LEMP",
    "V-E25-ALCOBENDAS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 47.17429829,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN",
    "V-PRES-ALCOBENDAS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 47.176,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/residencial-fijo"
   },
   "dif_rel": 3.6e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 28.78592912,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN",
    "V-PRES-ALCOBENDAS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 28.787,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/empresa"
   },
   "dif_rel": 3.7e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 9.154729825,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 9.155,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/movil-ebb"
   },
   "dif_rel": 3e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 5.241588699,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN",
    "V-PRES-ALCOBENDAS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 5.242,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/residencial-fijo"
   },
   "dif_rel": 7.8e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 3.198436569,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN",
    "V-PRES-ALCOBENDAS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 3.199,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/empresa"
   },
   "dif_rel": 0.000176,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 1.615540557,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.616,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/movil-ebb"
   },
   "dif_rel": 0.000284,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 1.330766155,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-N",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.3307,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/voz-ims"
   },
   "dif_rel": 5e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCOBENDAS/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCOBENDAS/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-ALCOBENDAS",
   "ambito": "demanda",
   "valor": 0.9475868207,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-N",
    "V-P25-ALCOBENDAS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.9476,
    "donde": "simulador",
    "localizador": "red.js Z-ALCOBENDAS/voz-fija"
   },
   "dif_rel": 1.4e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCOBENDAS/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCOBENDAS/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 38.71853721,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-N",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 38.7203,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.dl_gbps"
   },
   "dif_rel": 4.6e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 5.464391872,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-N",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 5.4643,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS.ul_gbps"
   },
   "dif_rel": 1.7e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-TRESCANTOS",
   "ambito": "demanda",
   "valor": 0.6852184843,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-TRESCANTOS",
    "V-LEMP",
    "V-E25-TRESCANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 23.05982876,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN",
    "V-PRES-TRESCANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 23.061,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/residencial-fijo"
   },
   "dif_rel": 5.1e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 10.59342095,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN",
    "V-PRES-TRESCANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 10.594,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/empresa"
   },
   "dif_rel": 5.5e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 4.05589108,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 4.056,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/movil-ebb"
   },
   "dif_rel": 2.7e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 2.562203195,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN",
    "V-PRES-TRESCANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 2.562,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/residencial-fijo"
   },
   "dif_rel": 7.9e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 1.177046772,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN",
    "V-PRES-TRESCANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 1.177,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/empresa"
   },
   "dif_rel": 4e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-TRESCANTOS",
   "ambito": "demanda",
   "valor": 0.7157454846,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.716,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/movil-ebb"
   },
   "dif_rel": 0.000355,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-TRESCANTOS",
   "ambito": "demanda",
   "valor": 0.5895796686,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-N",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.5895,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/voz-ims"
   },
   "dif_rel": 0.000135,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TRESCANTOS/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TRESCANTOS/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-TRESCANTOS",
   "ambito": "demanda",
   "valor": 0.4198167512,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-N",
    "V-P25-TRESCANTOS",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.4198,
    "donde": "simulador",
    "localizador": "red.js Z-TRESCANTOS/voz-fija"
   },
   "dif_rel": 4e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TRESCANTOS/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TRESCANTOS/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-TALAMANCA",
   "ambito": "demanda",
   "valor": 3.267443964,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-N",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 3.2672,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.dl_gbps"
   },
   "dif_rel": 7.5e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.4611381403,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-N",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.4602,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA.ul_gbps"
   },
   "dif_rel": 0.002039,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.7546782321,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-TALAMANCA",
    "V-LEMP",
    "V-E25-TALAMANCA"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-TALAMANCA",
   "ambito": "demanda",
   "valor": 2.143275692,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN",
    "V-PRES-TALAMANCA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 2.143,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/residencial-fijo"
   },
   "dif_rel": 0.000129,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.6967104118,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN",
    "V-PRES-TALAMANCA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.697,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/empresa"
   },
   "dif_rel": 0.000415,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.3422752455,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.342,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/movil-ebb"
   },
   "dif_rel": 0.000805,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.2381417436,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN",
    "V-PRES-TALAMANCA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.238,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/residencial-fijo"
   },
   "dif_rel": 0.000596,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.07741226798,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN",
    "V-PRES-TALAMANCA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.077,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/empresa"
   },
   "dif_rel": 0.005354,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.06040151392,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZN",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.06,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/movil-ebb"
   },
   "dif_rel": 0.006692,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.04975442433,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-N",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0498,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/voz-ims"
   },
   "dif_rel": 0.000915,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TALAMANCA/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TALAMANCA/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-TALAMANCA",
   "ambito": "demanda",
   "valor": 0.03542819044,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-N",
    "V-P25-TALAMANCA",
    "V-P25-ZN"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0354,
    "donde": "simulador",
    "localizador": "red.js Z-TALAMANCA/voz-fija"
   },
   "dif_rel": 0.000796,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TALAMANCA/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TALAMANCA/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-TORREJON",
   "ambito": "demanda",
   "valor": 99.4913715,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-E",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 99.4896,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.dl_gbps"
   },
   "dif_rel": 1.8e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-TORREJON",
   "ambito": "demanda",
   "valor": 14.04133216,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-E",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 14.0406,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON.ul_gbps"
   },
   "dif_rel": 5.2e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-TORREJON",
   "ambito": "demanda",
   "valor": 0.7678504087,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-TORREJON",
    "V-LEMP",
    "V-E25-TORREJON"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-TORREJON",
   "ambito": "demanda",
   "valor": 66.40030958,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE",
    "V-PRES-TORREJON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 66.4,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/residencial-fijo"
   },
   "dif_rel": 5e-06,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-TORREJON",
   "ambito": "demanda",
   "valor": 20.0752706,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE",
    "V-PRES-TORREJON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 20.075,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/empresa"
   },
   "dif_rel": 1.3e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-TORREJON",
   "ambito": "demanda",
   "valor": 10.42204059,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 10.422,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/movil-ebb"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-TORREJON",
   "ambito": "demanda",
   "valor": 7.377812176,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE",
    "V-PRES-TORREJON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 7.378,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/residencial-fijo"
   },
   "dif_rel": 2.5e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-TORREJON",
   "ambito": "demanda",
   "valor": 2.230585622,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE",
    "V-PRES-TORREJON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 2.231,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/empresa"
   },
   "dif_rel": 0.000186,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-TORREJON",
   "ambito": "demanda",
   "valor": 1.839183633,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.839,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/movil-ebb"
   },
   "dif_rel": 0.0001,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-TORREJON",
   "ambito": "demanda",
   "valor": 1.51498724,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-E",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.5138,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/voz-ims"
   },
   "dif_rel": 0.000784,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-TORREJON/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TORREJON/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-TORREJON",
   "ambito": "demanda",
   "valor": 1.078763491,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-E",
    "V-P25-TORREJON",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.0788,
    "donde": "simulador",
    "localizador": "red.js Z-TORREJON/voz-fija"
   },
   "dif_rel": 3.4e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-TORREJON/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-TORREJON/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-ALCALA",
   "ambito": "demanda",
   "valor": 139.7388397,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-E",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 139.7363,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.dl_gbps"
   },
   "dif_rel": 1.8e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-ALCALA",
   "ambito": "demanda",
   "valor": 19.72150382,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-E",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 19.7193,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA.ul_gbps"
   },
   "dif_rel": 0.000112,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-ALCALA",
   "ambito": "demanda",
   "valor": 0.7606956139,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-ALCALA",
    "V-LEMP",
    "V-E25-ALCALA"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-ALCALA",
   "ambito": "demanda",
   "valor": 92.39237087,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE",
    "V-PRES-ALCALA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 92.392,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/residencial-fijo"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-ALCALA",
   "ambito": "demanda",
   "valor": 29.06537016,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE",
    "V-PRES-ALCALA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 29.065,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/empresa"
   },
   "dif_rel": 1.3e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-ALCALA",
   "ambito": "demanda",
   "valor": 14.63809209,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 14.638,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/movil-ebb"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-ALCALA",
   "ambito": "demanda",
   "valor": 10.26581899,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE",
    "V-PRES-ALCALA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 10.266,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/residencial-fijo"
   },
   "dif_rel": 1.8e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-ALCALA",
   "ambito": "demanda",
   "valor": 3.229485573,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE",
    "V-PRES-ALCALA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 3.229,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/empresa"
   },
   "dif_rel": 0.00015,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-ALCALA",
   "ambito": "demanda",
   "valor": 2.583192722,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.583,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/movil-ebb"
   },
   "dif_rel": 7.5e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-ALCALA",
   "ambito": "demanda",
   "valor": 2.127848434,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-E",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.1261,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/voz-ims"
   },
   "dif_rel": 0.000822,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCALA/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCALA/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-ALCALA",
   "ambito": "demanda",
   "valor": 1.515158111,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-E",
    "V-P25-ALCALA",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.5152,
    "donde": "simulador",
    "localizador": "red.js Z-ALCALA/voz-fija"
   },
   "dif_rel": 2.8e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCALA/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCALA/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 1.977947328,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-E",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.9775,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.dl_gbps"
   },
   "dif_rel": 0.000226,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.2791499907,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-E",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.2795,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS.ul_gbps"
   },
   "dif_rel": 0.001252,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.7711541838,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-LOSSANTOS",
    "V-LEMP",
    "V-E25-LOSSANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 1.325757242,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE",
    "V-PRES-LOSSANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 1.326,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/residencial-fijo"
   },
   "dif_rel": 0.000183,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.3934284538,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE",
    "V-PRES-LOSSANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.393,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/empresa"
   },
   "dif_rel": 0.00109,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.2071963329,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.207,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/movil-ebb"
   },
   "dif_rel": 0.000948,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.1473063602,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE",
    "V-PRES-LOSSANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.147,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/residencial-fijo"
   },
   "dif_rel": 0.002084,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.04371427264,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE",
    "V-PRES-LOSSANTOS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.044,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/empresa"
   },
   "dif_rel": 0.006494,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.03656405874,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZE",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.037,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/movil-ebb"
   },
   "dif_rel": 0.011782,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.03011884266,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-E",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0301,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/voz-ims"
   },
   "dif_rel": 0.000626,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LOSSANTOS/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-LOSSANTOS/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-LOSSANTOS",
   "ambito": "demanda",
   "valor": 0.02144645643,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-E",
    "V-P25-LOSSANTOS",
    "V-P25-ZE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0214,
    "donde": "simulador",
    "localizador": "red.js Z-LOSSANTOS/voz-fija"
   },
   "dif_rel": 0.002171,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LOSSANTOS/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-LOSSANTOS/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-GETAFE",
   "ambito": "demanda",
   "valor": 132.479503,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-S",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 132.48,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.dl_gbps"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-GETAFE",
   "ambito": "demanda",
   "valor": 18.69698526,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-S",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 18.698,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE.ul_gbps"
   },
   "dif_rel": 5.4e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-GETAFE",
   "ambito": "demanda",
   "valor": 0.7636773302,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-GETAFE",
    "V-LEMP",
    "V-E25-GETAFE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-GETAFE",
   "ambito": "demanda",
   "valor": 87.9359897,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS",
    "V-PRES-GETAFE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 87.936,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/residencial-fijo"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-GETAFE",
   "ambito": "demanda",
   "valor": 27.21210521,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS",
    "V-PRES-GETAFE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 27.212,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/empresa"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-GETAFE",
   "ambito": "demanda",
   "valor": 13.87765327,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 13.878,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/movil-ebb"
   },
   "dif_rel": 2.5e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-GETAFE",
   "ambito": "demanda",
   "valor": 9.770665522,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS",
    "V-PRES-GETAFE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 9.771,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/residencial-fijo"
   },
   "dif_rel": 3.4e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-GETAFE",
   "ambito": "demanda",
   "valor": 3.023567245,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS",
    "V-PRES-GETAFE"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 3.024,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/empresa"
   },
   "dif_rel": 0.000143,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-GETAFE",
   "ambito": "demanda",
   "valor": 2.448997637,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.449,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/movil-ebb"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-GETAFE",
   "ambito": "demanda",
   "valor": 2.017308172,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-S",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.0176,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/voz-ims"
   },
   "dif_rel": 0.000145,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-GETAFE/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-GETAFE/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-GETAFE",
   "ambito": "demanda",
   "valor": 1.436446689,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-S",
    "V-P25-GETAFE",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.4364,
    "donde": "simulador",
    "localizador": "red.js Z-GETAFE/voz-fija"
   },
   "dif_rel": 3.3e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-GETAFE/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-GETAFE/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-LEGANES",
   "ambito": "demanda",
   "valor": 132.694853,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-S",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 132.6947,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.dl_gbps"
   },
   "dif_rel": 1e-06,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-LEGANES",
   "ambito": "demanda",
   "valor": 18.72737785,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-S",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 18.7277,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES.ul_gbps"
   },
   "dif_rel": 1.7e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-LEGANES",
   "ambito": "demanda",
   "valor": 0.770639458,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-LEGANES",
    "V-LEMP",
    "V-E25-LEGANES"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-LEGANES",
   "ambito": "demanda",
   "valor": 88.88191156,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS",
    "V-PRES-LEGANES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 88.882,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/residencial-fijo"
   },
   "dif_rel": 1e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-LEGANES",
   "ambito": "demanda",
   "valor": 26.45336051,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS",
    "V-PRES-LEGANES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 26.453,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/empresa"
   },
   "dif_rel": 1.4e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-LEGANES",
   "ambito": "demanda",
   "valor": 13.90021187,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 13.9,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/movil-ebb"
   },
   "dif_rel": 1.5e-05,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-LEGANES",
   "ambito": "demanda",
   "valor": 9.875767951,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS",
    "V-PRES-LEGANES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 9.876,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/residencial-fijo"
   },
   "dif_rel": 2.3e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-LEGANES",
   "ambito": "demanda",
   "valor": 2.939262279,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS",
    "V-PRES-LEGANES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 2.939,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/empresa"
   },
   "dif_rel": 8.9e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-LEGANES",
   "ambito": "demanda",
   "valor": 2.452978566,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.453,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/movil-ebb"
   },
   "dif_rel": 9e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-LEGANES",
   "ambito": "demanda",
   "valor": 2.020587375,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-S",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.0209,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/voz-ims"
   },
   "dif_rel": 0.000155,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-LEGANES/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-LEGANES/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-LEGANES",
   "ambito": "demanda",
   "valor": 1.438781682,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-S",
    "V-P25-LEGANES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.4388,
    "donde": "simulador",
    "localizador": "red.js Z-LEGANES/voz-fija"
   },
   "dif_rel": 1.3e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-LEGANES/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-LEGANES/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 128.5422557,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-S",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 128.5424,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.dl_gbps"
   },
   "dif_rel": 1e-06,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 18.14131699,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-S",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 18.1414,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA.ul_gbps"
   },
   "dif_rel": 5e-06,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-FUENLABRADA",
   "ambito": "demanda",
   "valor": 0.735867674,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-FUENLABRADA",
    "V-LEMP",
    "V-E25-FUENLABRADA"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 82.21550119,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS",
    "V-PRES-FUENLABRADA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 82.216,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/residencial-fijo"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 29.51043011,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS",
    "V-PRES-FUENLABRADA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 29.51,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/empresa"
   },
   "dif_rel": 1.5e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 13.46521397,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 13.465,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/movil-ebb"
   },
   "dif_rel": 1.6e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 9.135055687,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS",
    "V-PRES-FUENLABRADA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 9.135,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/residencial-fijo"
   },
   "dif_rel": 6e-06,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 3.278936678,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS",
    "V-PRES-FUENLABRADA"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 3.279,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/empresa"
   },
   "dif_rel": 1.9e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-FUENLABRADA",
   "ambito": "demanda",
   "valor": 2.37621423,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.376,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/movil-ebb"
   },
   "dif_rel": 9e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-FUENLABRADA",
   "ambito": "demanda",
   "valor": 1.957354434,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-S",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.9576,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/voz-ims"
   },
   "dif_rel": 0.000125,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-FUENLABRADA/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-FUENLABRADA/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-FUENLABRADA",
   "ambito": "demanda",
   "valor": 1.393755964,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-S",
    "V-P25-FUENLABRADA",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.3938,
    "donde": "simulador",
    "localizador": "red.js Z-FUENLABRADA/voz-fija"
   },
   "dif_rel": 3.2e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-FUENLABRADA/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-FUENLABRADA/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-ALCORCON",
   "ambito": "demanda",
   "valor": 119.7332233,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-S",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 119.7327,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.dl_gbps"
   },
   "dif_rel": 4e-06,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-ALCORCON",
   "ambito": "demanda",
   "valor": 16.89808809,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-S",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 16.8977,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON.ul_gbps"
   },
   "dif_rel": 2.3e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-ALCORCON",
   "ambito": "demanda",
   "valor": 0.7604452289,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-ALCORCON",
    "V-LEMP",
    "V-E25-ALCORCON"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-ALCORCON",
   "ambito": "demanda",
   "valor": 79.13902228,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS",
    "V-PRES-ALCORCON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 79.139,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/residencial-fijo"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-ALCORCON",
   "ambito": "demanda",
   "valor": 24.93030352,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS",
    "V-PRES-ALCORCON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 24.93,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/empresa"
   },
   "dif_rel": 1.2e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-ALCORCON",
   "ambito": "demanda",
   "valor": 12.54243955,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 12.542,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/movil-ebb"
   },
   "dif_rel": 3.5e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-ALCORCON",
   "ambito": "demanda",
   "valor": 8.793224698,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS",
    "V-PRES-ALCORCON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 8.793,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/residencial-fijo"
   },
   "dif_rel": 2.6e-05,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-ALCORCON",
   "ambito": "demanda",
   "valor": 2.770033725,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS",
    "V-PRES-ALCORCON"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 2.77,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/empresa"
   },
   "dif_rel": 1.2e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-ALCORCON",
   "ambito": "demanda",
   "valor": 2.213371686,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 2.213,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/movil-ebb"
   },
   "dif_rel": 0.000168,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-ALCORCON",
   "ambito": "demanda",
   "valor": 1.823216455,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-S",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.8235,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/voz-ims"
   },
   "dif_rel": 0.000155,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-ALCORCON/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCORCON/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-ALCORCON",
   "ambito": "demanda",
   "valor": 1.298241526,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-S",
    "V-P25-ALCORCON",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.2982,
    "donde": "simulador",
    "localizador": "red.js Z-ALCORCON/voz-fija"
   },
   "dif_rel": 3.2e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-ALCORCON/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-ALCORCON/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-RED-DL-BATRES",
   "ambito": "demanda",
   "valor": 1.338149437,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-S",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 1.3379,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.dl_gbps"
   },
   "dif_rel": 0.000186,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES",
   "campo": "dl_gbps"
  },
  {
   "id": "V-RED-UL-BATRES",
   "ambito": "demanda",
   "valor": 0.1888545754,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-UL-S",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.1889,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES.ul_gbps"
   },
   "dif_rel": 0.00024,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES",
   "campo": "ul_gbps"
  },
  {
   "id": "V-PRES-BATRES",
   "ambito": "demanda",
   "valor": 0.6325406367,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PFIJO",
    "V-H25-BATRES",
    "V-LEMP",
    "V-E25-BATRES"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/(e[0]*e[1]+e[2]*e[3])",
   "supuesto": "S-030",
   "nota": "Peso residencial del Internet fijo (líneas 0,622·H frente a 1,5·E).",
   "huecos_raiz": [
    "V-LEMP"
   ]
  },
  {
   "id": "V-NRES-DL-BATRES",
   "ambito": "demanda",
   "valor": 0.735700606,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS",
    "V-PRES-BATRES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.736,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/residencial-fijo"
   },
   "dif_rel": 0.000407,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/residencial-fijo",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NEMP-DL-BATRES",
   "ambito": "demanda",
   "valor": 0.4273876817,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS",
    "V-PRES-BATRES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.427,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/empresa"
   },
   "dif_rel": 0.000908,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/empresa",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NMOV-DL-BATRES",
   "ambito": "demanda",
   "valor": 0.1401754497,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.14,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/movil-ebb"
   },
   "dif_rel": 0.001253,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/movil-ebb",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NRES-UL-BATRES",
   "ambito": "demanda",
   "valor": 0.08174451178,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS",
    "V-PRES-BATRES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*e[6]",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.082,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/residencial-fijo"
   },
   "dif_rel": 0.003116,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/residencial-fijo",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NEMP-UL-BATRES",
   "ambito": "demanda",
   "valor": 0.04748752018,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPF",
    "V-RF",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS",
    "V-PRES-BATRES"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]*(1-e[6])",
   "supuesto": "S-030",
   "ref": {
    "valor": 0.047,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/empresa"
   },
   "dif_rel": 0.010373,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-SPF",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/empresa",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NMOV-UL-BATRES",
   "ambito": "demanda",
   "valor": 0.02473684406,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-SPM",
    "V-RM",
    "V-W-ZS",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*(1-e[1])*e[2]*e[3]*e[4]/e[5]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.025,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/movil-ebb"
   },
   "dif_rel": 0.010526,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-FBH",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/movil-ebb",
   "campo": "ul_gbps"
  },
  {
   "id": "V-NVONR-BATRES",
   "ambito": "demanda",
   "valor": 0.02037643357,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-S",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0204,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/voz-ims"
   },
   "dif_rel": 0.001155,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-SUP-L03"
   ],
   "elemento": "Z-BATRES/voz-ims",
   "campo": "dl_gbps",
   "tambien": [
    "Z-BATRES/voz-ims|ul_gbps"
   ]
  },
  {
   "id": "V-NVF-BATRES",
   "ambito": "demanda",
   "valor": 0.01450926584,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-VF-S",
    "V-P25-BATRES",
    "V-P25-ZS"
   ],
   "estado": "hueco",
   "formula": "FX-028",
   "calc": "e[0]*e[1]/e[2]",
   "supuesto": "S-029",
   "ref": {
    "valor": 0.0145,
    "donde": "simulador",
    "localizador": "red.js Z-BATRES/voz-fija"
   },
   "dif_rel": 0.000639,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04"
   ],
   "elemento": "Z-BATRES/voz-fija",
   "campo": "dl_gbps",
   "tambien": [
    "Z-BATRES/voz-fija|ul_gbps"
   ]
  },
  {
   "id": "V-USR-EST",
   "ambito": "especiales",
   "valor": 50000,
   "unidad": "usuarios",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p4, SCOM04 'at least 50,000 simultaneous users'"
   },
   "memoria": "v7 §3.3"
  },
  {
   "id": "V-MIX-DL",
   "ambito": "especiales",
   "valor": 2.635,
   "unidad": "Mbit/s/usuario",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "memoria": "v7 §3.3",
   "nota": "0,5·1 + 0,25·8 + 0,15·0,2 + 0,05·0,1 + 0,05·2",
   "huecos_raiz": [
    "V-MIX-DL"
   ]
  },
  {
   "id": "V-MIX-UL",
   "ambito": "especiales",
   "valor": 1.42,
   "unidad": "Mbit/s/usuario",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "memoria": "v7 §3.3",
   "nota": "71 Gbit/s / 50 000 usuarios",
   "huecos_raiz": [
    "V-MIX-UL"
   ]
  },
  {
   "id": "V-EST-DL",
   "ambito": "especiales",
   "valor": 164.6875,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-USR-EST",
    "V-MIX-DL"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]*e[2]/1000",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 164.6875,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-MIX-DL"
   ],
   "elemento": "estadio",
   "campo": "DL"
  },
  {
   "id": "V-EST-UL",
   "ambito": "especiales",
   "valor": 88.75,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-USR-EST",
    "V-MIX-UL"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]*e[2]/1000",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 88.75,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-MIX-UL"
   ],
   "elemento": "estadio",
   "campo": "UL"
  },
  {
   "id": "V-EST-CDL",
   "ambito": "especiales",
   "valor": 235.2678571,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-EST-DL",
    "V-UN"
   ],
   "estado": "hueco",
   "formula": "FX-014",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.3",
   "ref": {
    "valor": 235.27,
    "donde": "memoria",
    "localizador": "v7 §6.3"
   },
   "dif_rel": 9e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-MIX-DL"
   ]
  },
  {
   "id": "V-EST-CUL",
   "ambito": "especiales",
   "valor": 126.7857143,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-EST-UL",
    "V-UN"
   ],
   "estado": "hueco",
   "formula": "FX-014",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.3",
   "ref": {
    "valor": 126.79,
    "donde": "memoria",
    "localizador": "v7 §6.3"
   },
   "dif_rel": 3.4e-05,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-MIX-UL"
   ]
  },
  {
   "id": "V-EST-SEC",
   "ambito": "especiales",
   "valor": 265,
   "unidad": "sectores n258",
   "tipo": "derivado",
   "entradas": [
    "V-EST-CDL",
    "V-CSEC-N258-DL",
    "V-EST-CUL",
    "V-CSEC-N258-UL"
   ],
   "estado": "hueco",
   "formula": "FX-020",
   "calc": "Math.max(Math.ceil(1000*e[0]/e[1]), Math.ceil(1000*e[2]/e[3]))",
   "memoria": "v7 §6.3",
   "ref": {
    "valor": 265,
    "donde": "memoria",
    "localizador": "v7 §6.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-MIX-DL",
    "V-MIX-UL",
    "V-TDD-N258-DL",
    "V-TDD-N258-UL"
   ],
   "elemento": "R-ESTADIO-n258",
   "campo": "sectores"
  },
  {
   "id": "V-S-ESTADIO-PRENSA-DL",
   "ambito": "especiales",
   "valor": 0.0,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 0.0,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-PRENSA"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-S-ESTADIO-PRENSA-DL"
   ],
   "elemento": "S-ESTADIO-PRENSA",
   "campo": "dl_gbps"
  },
  {
   "id": "V-S-ESTADIO-PRENSA-UL",
   "ambito": "especiales",
   "valor": 1.0,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 1.0,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-PRENSA"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-S-ESTADIO-PRENSA-UL"
   ],
   "elemento": "S-ESTADIO-PRENSA",
   "campo": "ul_gbps"
  },
  {
   "id": "V-S-ESTADIO-LIGERO-DL",
   "ambito": "especiales",
   "valor": 39.69,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 39.69,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-LIGERO"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-S-ESTADIO-LIGERO-DL"
   ],
   "elemento": "S-ESTADIO-LIGERO",
   "campo": "dl_gbps"
  },
  {
   "id": "V-S-ESTADIO-LIGERO-UL",
   "ambito": "especiales",
   "valor": 10.63,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 10.63,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-LIGERO"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-S-ESTADIO-LIGERO-UL"
   ],
   "elemento": "S-ESTADIO-LIGERO",
   "campo": "ul_gbps"
  },
  {
   "id": "V-S-ESTADIO-VIDEO-DL",
   "ambito": "especiales",
   "valor": 125.0,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 125.0,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-VIDEO"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-S-ESTADIO-VIDEO-DL"
   ],
   "elemento": "S-ESTADIO-VIDEO",
   "campo": "dl_gbps"
  },
  {
   "id": "V-S-ESTADIO-VIDEO-UL",
   "ambito": "especiales",
   "valor": 77.13,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L12",
   "nota": "Reparto prensa/ligero/vídeo de 3.1-S5 §5.4 (documento del grupo).",
   "ref": {
    "valor": 77.13,
    "donde": "simulador",
    "localizador": "red.js S-ESTADIO-VIDEO"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-S-ESTADIO-VIDEO-UL"
   ],
   "elemento": "S-ESTADIO-VIDEO",
   "campo": "ul_gbps"
  },
  {
   "id": "V-EST-SUMA-DL",
   "ambito": "especiales",
   "valor": 164.69,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-S-ESTADIO-PRENSA-DL",
    "V-S-ESTADIO-LIGERO-DL",
    "V-S-ESTADIO-VIDEO-DL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "ref": {
    "valor": 164.6875,
    "donde": "memoria",
    "localizador": "v7 §3.3 (el reparto debe sumar el total)"
   },
   "dif_rel": 1.5e-05,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-S-ESTADIO-LIGERO-DL",
    "V-S-ESTADIO-PRENSA-DL",
    "V-S-ESTADIO-VIDEO-DL"
   ]
  },
  {
   "id": "V-EST-SUMA-UL",
   "ambito": "especiales",
   "valor": 88.76,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-S-ESTADIO-PRENSA-UL",
    "V-S-ESTADIO-LIGERO-UL",
    "V-S-ESTADIO-VIDEO-UL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "ref": {
    "valor": 88.75,
    "donde": "memoria",
    "localizador": "v7 §3.3 (el reparto debe sumar el total)"
   },
   "dif_rel": 0.000113,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-S-ESTADIO-LIGERO-UL",
    "V-S-ESTADIO-PRENSA-UL",
    "V-S-ESTADIO-VIDEO-UL"
   ]
  },
  {
   "id": "V-HOSP-DLB",
   "ambito": "especiales",
   "valor": 0.4,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3",
   "huecos_raiz": [
    "V-HOSP-DLB"
   ]
  },
  {
   "id": "V-HOSP-ULB",
   "ambito": "especiales",
   "valor": 0.482,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3",
   "huecos_raiz": [
    "V-HOSP-ULB"
   ]
  },
  {
   "id": "V-HOSP-DL",
   "ambito": "especiales",
   "valor": 0.5,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-HOSP-DLB"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.5,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-HOSP-DLB"
   ],
   "elemento": "S-HOSPITAL-CRITICO",
   "campo": "dl_gbps",
   "tambien": [
    "hospital|DL"
   ]
  },
  {
   "id": "V-HOSP-UL",
   "ambito": "especiales",
   "valor": 0.6025,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-HOSP-ULB"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.6025,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-HOSP-ULB"
   ],
   "elemento": "hospital",
   "campo": "UL"
  },
  {
   "id": "V-HOSP-CAM",
   "ambito": "especiales",
   "valor": 0.1,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.1,
    "donde": "simulador",
    "localizador": "red.js S-HOSPITAL-CAMARAS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-HOSP-CAM"
   ],
   "elemento": "S-HOSPITAL-CAMARAS",
   "campo": "ul_gbps"
  },
  {
   "id": "V-HOSP-CRIT-UL",
   "ambito": "especiales",
   "valor": 0.5025,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-HOSP-UL",
    "V-HOSP-CAM"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]-e[1]",
   "ref": {
    "valor": 0.5025,
    "donde": "simulador",
    "localizador": "red.js S-HOSPITAL-CRITICO"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-HOSP-CAM",
    "V-HOSP-ULB"
   ],
   "elemento": "S-HOSPITAL-CRITICO",
   "campo": "ul_gbps"
  },
  {
   "id": "V-V2X-N",
   "ambito": "especiales",
   "valor": 1000,
   "unidad": "vehículos",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3 / A4",
   "huecos_raiz": [
    "V-V2X-N"
   ]
  },
  {
   "id": "V-V2X-B",
   "ambito": "especiales",
   "valor": 300,
   "unidad": "B/mensaje",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS22185",
    "localizador": "[R-5.2.2-001] 50-300 B (cota superior, sin seguridad)"
   },
   "memoria": "v7 §3.3 / A4"
  },
  {
   "id": "V-V2X-F",
   "ambito": "especiales",
   "valor": 10,
   "unidad": "Hz",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS22185",
    "localizador": "[R-5.2.3-001] máx. 10 mensajes/s por UE (= EN 302 637-2 T_GenCamMin 100 ms)"
   },
   "memoria": "v7 §3.3 / A4"
  },
  {
   "id": "V-V2X-CAB",
   "ambito": "especiales",
   "valor": 1.5,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3 / A4",
   "nota": "Incluye la seguridad que TS 22.185 deja fuera de los 300 B.",
   "huecos_raiz": [
    "V-V2X-CAB"
   ]
  },
  {
   "id": "V-V2X",
   "ambito": "especiales",
   "valor": 0.045,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-V2X-N",
    "V-V2X-B",
    "V-V2X-F",
    "V-V2X-CAB",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-026",
   "calc": "e[0]*e[1]*8*e[2]*e[3]*e[4]/1e9",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.045,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0005,
   "huecos_raiz": [
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "S-V2X-A2",
   "campo": "dl_gbps",
   "tambien": [
    "S-V2X-A2|ul_gbps",
    "v2x|valor"
   ]
  },
  {
   "id": "V-IOT-PAR",
   "ambito": "especiales",
   "valor": "80 000 × 200 B/900 s + 15 000 × 500 B/60 s; 5 000 cámaras × 0,8 Mbit/s; cabecera 1,5",
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3 / §6.5",
   "huecos_raiz": [
    "V-IOT-PAR"
   ]
  },
  {
   "id": "V-IOT-SUMA",
   "ambito": "especiales",
   "valor": 100000,
   "unidad": "dispositivos",
   "tipo": "derivado",
   "entradas": [
    "V-IOT-PAR"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "80000+15000+5000",
   "ref": {
    "valor": 100000,
    "donde": "memoria",
    "localizador": "v7 §3.3 = SCOM07 (≥100 000)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-IOT-PAR"
   ]
  },
  {
   "id": "V-SENS",
   "ambito": "especiales",
   "valor": 0.002141666667,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-IOT-PAR",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-026",
   "calc": "(80000*200*8/900+15000*500*8/60)*1.5*e[1]/1e9",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.002141667,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-10,
   "huecos_raiz": [
    "V-IOT-PAR"
   ],
   "elemento": "sensores_vb",
   "campo": "valor"
  },
  {
   "id": "V-CAMS",
   "ambito": "especiales",
   "valor": 5.0,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-IOT-PAR",
    "V-RES"
   ],
   "estado": "hueco",
   "formula": "FX-026",
   "calc": "5000*0.8*e[1]/1000",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 5.0,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-IOT-PAR"
   ],
   "elemento": "S-VALDEBEBAS-CAMARAS",
   "campo": "ul_gbps",
   "tambien": [
    "camaras_vb|valor"
   ]
  },
  {
   "id": "V-SENS-SIM",
   "ambito": "especiales",
   "valor": 0.002141666667,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-SENS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]",
   "nota": "El simulador redondea a 0,0021 Gbit/s (−2 %).",
   "ref": {
    "valor": 0.0021,
    "donde": "simulador",
    "localizador": "red.js S-VALDEBEBAS-SENSORES.ul_gbps"
   },
   "dif_rel": 0.019841,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-IOT-PAR"
   ],
   "elemento": "S-VALDEBEBAS-SENSORES",
   "campo": "ul_gbps"
  },
  {
   "id": "V-IND-DLB",
   "ambito": "especiales",
   "valor": 0.07,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3",
   "huecos_raiz": [
    "V-IND-DLB"
   ]
  },
  {
   "id": "V-IND-ULB",
   "ambito": "especiales",
   "valor": 0.16,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §3.3",
   "huecos_raiz": [
    "V-IND-ULB"
   ]
  },
  {
   "id": "V-IND-DL",
   "ambito": "especiales",
   "valor": 0.0875,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-IND-DLB"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.0875,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 5e-05,
   "huecos_raiz": [
    "V-IND-DLB"
   ],
   "elemento": "industria",
   "campo": "DL"
  },
  {
   "id": "V-IND-UL",
   "ambito": "especiales",
   "valor": 0.2,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RES",
    "V-IND-ULB"
   ],
   "estado": "hueco",
   "formula": "FX-011",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §3.3",
   "ref": {
    "valor": 0.2,
    "donde": "memoria",
    "localizador": "v7 §3.3"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-IND-ULB"
   ],
   "elemento": "industria",
   "campo": "UL"
  },
  {
   "id": "V-ESP-DL",
   "ambito": "especiales",
   "valor": 165.32,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-EST-DL",
    "V-HOSP-DL",
    "V-V2X",
    "V-IND-DL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]",
   "memoria": "v7 §3.4",
   "ref": {
    "valor": 165.32,
    "donde": "memoria",
    "localizador": "v7 §3.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-MIX-DL",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "especiales_tot",
   "campo": "DL"
  },
  {
   "id": "V-ESP-UL",
   "ambito": "especiales",
   "valor": 94.59964167,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-EST-UL",
    "V-HOSP-UL",
    "V-V2X",
    "V-SENS",
    "V-CAMS",
    "V-IND-UL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]+e[5]",
   "memoria": "v7 §3.4",
   "ref": {
    "valor": 94.6,
    "donde": "memoria",
    "localizador": "v7 §3.4"
   },
   "dif_rel": 4e-06,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-HOSP-ULB",
    "V-IND-ULB",
    "V-IOT-PAR",
    "V-MIX-UL",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "especiales_tot",
   "campo": "UL"
  },
  {
   "id": "V-IP-DL",
   "ambito": "especiales",
   "valor": 3448.218575,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-DL-TOT",
    "V-QVONR-R",
    "V-ESP-DL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.4",
   "ref": {
    "valor": 3448.23,
    "donde": "memoria",
    "localizador": "v7 §3.4"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-MIX-DL",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "IP_tot",
   "campo": "DL"
  },
  {
   "id": "V-IP-UL",
   "ambito": "especiales",
   "valor": 527.0116982,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-INET-UL-TOT",
    "V-QVONR-R",
    "V-ESP-UL"
   ],
   "estado": "hueco",
   "formula": "FX-003",
   "calc": "e[0]+e[1]+e[2]",
   "memoria": "v7 §3.4",
   "ref": {
    "valor": 527.01,
    "donde": "memoria",
    "localizador": "v7 §3.4"
   },
   "dif_rel": 3e-06,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-ULB",
    "V-IND-ULB",
    "V-IOT-PAR",
    "V-MIX-UL",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "IP_tot",
   "campo": "UL"
  },
  {
   "id": "V-UNI-10G",
   "ambito": "especiales",
   "valor": 10,
   "unidad": "Gbit/s",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p4, SCOM01 'at least 10 Gbit/s connectivity for selected enterprise … sites'"
   },
   "memoria": "v7 §6.9"
  },
  {
   "id": "V-L2VPN-PAR",
   "ambito": "especiales",
   "valor": 3.333333333,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-UNI-10G"
   ],
   "estado": "trazado",
   "formula": "FX-018",
   "calc": "e[0]/3",
   "supuesto": "S-035",
   "nota": "10 GbE de cada sede repartidos entre las otras 3 (S-035).",
   "ref": {
    "valor": 3.33,
    "donde": "simulador",
    "localizador": "red.js S-L2VPN-*"
   },
   "dif_rel": 0.001001,
   "tol_abs": 0.005,
   "elemento": "S-L2VPN-CN",
   "campo": "dl_gbps",
   "tambien": [
    "S-L2VPN-CN|ul_gbps",
    "S-L2VPN-CE|dl_gbps",
    "S-L2VPN-CE|ul_gbps",
    "S-L2VPN-CS|dl_gbps",
    "S-L2VPN-CS|ul_gbps",
    "S-L2VPN-NE|dl_gbps",
    "S-L2VPN-NE|ul_gbps",
    "S-L2VPN-NS|dl_gbps",
    "S-L2VPN-NS|ul_gbps",
    "S-L2VPN-ES|dl_gbps",
    "S-L2VPN-ES|ul_gbps"
   ]
  },
  {
   "id": "V-NTN-TERM",
   "ambito": "especiales",
   "valor": "100 / 20 Mbit/s por terminal OneWeb",
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L13",
   "memoria": "v7 §6.11",
   "nota": "Hoja de datos del terminal sin verificar.",
   "huecos_raiz": [
    "V-NTN-TERM"
   ],
   "elemento": "L-SAT-AGGGETAFE",
   "campo": "capacidad_gbps",
   "tambien": [
    "L-SAT-AGGMADRID|capacidad_gbps",
    "L-SAT-EDGEESTE|capacidad_gbps"
   ]
  },
  {
   "id": "V-NTN-DL",
   "ambito": "especiales",
   "valor": 0.3,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NTN-TERM"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "3*0.1",
   "supuesto": "S-037",
   "ref": {
    "valor": 0.3,
    "donde": "simulador",
    "localizador": "red.js S-NTN-EMERGENCIA"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-NTN-TERM"
   ],
   "elemento": "S-NTN-EMERGENCIA",
   "campo": "dl_gbps"
  },
  {
   "id": "V-NTN-UL",
   "ambito": "especiales",
   "valor": 0.06,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NTN-TERM"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "3*0.02",
   "supuesto": "S-037",
   "ref": {
    "valor": 0.06,
    "donde": "simulador",
    "localizador": "red.js S-NTN-EMERGENCIA"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-NTN-TERM"
   ],
   "elemento": "S-NTN-EMERGENCIA",
   "campo": "ul_gbps"
  },
  {
   "id": "V-ALC-ACC",
   "ambito": "pon",
   "valor": 22353.28854,
   "unidad": "accesos",
   "tipo": "derivado",
   "entradas": [
    "V-RED-P31-ALCORCON",
    "V-RATIO-IF",
    "V-CUOTA-IF",
    "V-SUP-L03"
   ],
   "estado": "hueco",
   "formula": "FX-008",
   "calc": "e[0]*e[1]*e[2]",
   "memoria": "v7 §6.1",
   "ref": {
    "valor": 22353,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 1.3e-05,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-XGS",
   "ambito": "pon",
   "valor": 9.95,
   "unidad": "Gbit/s",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARCO-COVDIM",
    "localizador": "p10 'XGS-PON 9.95 Gb/s ↓ 9.95 Gb/s ↑'"
   },
   "memoria": "v7 §6.1"
  },
  {
   "id": "V-PON-ALC",
   "ambito": "pon",
   "valor": 624,
   "unidad": "PON",
   "tipo": "derivado",
   "entradas": [
    "V-ALC-ACC",
    "V-SPLIT",
    "V-RES",
    "V-UN"
   ],
   "estado": "hueco",
   "formula": "FX-021",
   "calc": "Math.ceil(e[0]/e[1]*e[2]/e[3])",
   "memoria": "v7 §6.1",
   "ref": {
    "valor": 624,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-CO",
   "ambito": "pon",
   "valor": 2,
   "unidad": "centrales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARCO-FTTH100K",
    "localizador": "p5-p6 (OLT por densidad de puertos)"
   },
   "supuesto": "S-L16",
   "memoria": "v7 §6.1",
   "clase": "decision"
  },
  {
   "id": "V-LT-ALC",
   "ambito": "pon",
   "valor": 40,
   "unidad": "tarjetas LT",
   "tipo": "derivado",
   "entradas": [
    "V-PON-ALC",
    "V-CO"
   ],
   "estado": "hueco",
   "formula": "FX-021",
   "calc": "e[1]*Math.ceil(e[0]/e[1]/16)",
   "memoria": "v7 §6.1",
   "nota": "Tarjetas de 16 puertos por central (2 × 20).",
   "ref": {
    "valor": 40,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-CHAS-ALC",
   "ambito": "pon",
   "valor": 4,
   "unidad": "chasis MF-14",
   "tipo": "derivado",
   "entradas": [
    "V-LT-ALC",
    "V-CO"
   ],
   "estado": "hueco",
   "formula": "FX-021",
   "calc": "e[1]*Math.ceil(e[0]/e[1]/14)",
   "memoria": "v7 §6.1",
   "nota": "14 ranuras LT por chasis (hoja de datos Nokia Lightspan MF-14 sin verificar).",
   "ref": {
    "valor": 4,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-SPL-ALC",
   "ambito": "pon",
   "valor": 3120,
   "unidad": "divisores",
   "tipo": "derivado",
   "entradas": [
    "V-PON-ALC"
   ],
   "estado": "hueco",
   "formula": "FX-021",
   "calc": "e[0]*(1+4)",
   "memoria": "v7 §6.1",
   "nota": "Cascada 1:4 + 4 × 1:16 por PON.",
   "ref": {
    "valor": 3120,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SUP-L03"
   ]
  },
  {
   "id": "V-ALC-BH",
   "ambito": "pon",
   "valor": 92.50606738,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ALC-ACC",
    "V-RF",
    "V-NB31"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]*e[1]/e[2]",
   "memoria": "v7 §6.1",
   "ref": {
    "valor": 92.5,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 6.6e-05,
   "tol_abs": 0.05,
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-PON-BH",
   "ambito": "pon",
   "valor": 148.2469029,
   "unidad": "Mbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-ALC-BH",
    "V-PON-ALC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "1000*e[0]/e[1]",
   "memoria": "v7 §6.1",
   "ref": {
    "valor": 148,
    "donde": "memoria",
    "localizador": "v7 §6.1"
   },
   "dif_rel": 0.001668,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-PON-OCUP",
   "ambito": "pon",
   "valor": 0.01489918622,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-PON-BH",
    "V-XGS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/(1000*e[1])",
   "memoria": "v7 §6.1",
   "ref": {
    "valor": 0.015,
    "donde": "memoria",
    "localizador": "v7 §6.1 '≈1.5 %'"
   },
   "dif_rel": 0.006721,
   "tol_abs": 0.0005,
   "tol": 0.02,
   "huecos_raiz": [
    "V-FBH",
    "V-SUP-L03",
    "V-SUP-L04"
   ]
  },
  {
   "id": "V-OVH",
   "ambito": "transporte",
   "valor": 1.1,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-L11",
   "memoria": "v7 §2.7.2",
   "huecos_raiz": [
    "V-OVH"
   ]
  },
  {
   "id": "V-GTPU",
   "ambito": "transporte",
   "valor": 8,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS29281",
    "localizador": "§5.1 cabecera obligatoria"
   }
  },
  {
   "id": "V-GTPU-OPT",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS29281",
    "localizador": "§5.1 con E=1: Sequence Number (2) + N-PDU (1) + Next Extension Header Type (1)"
   }
  },
  {
   "id": "V-PDUSC",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "B",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-3GPP-TS38415",
    "localizador": "§5.5.2.1 DL PDU SESSION INFORMATION (tipo + QFI) en 1 unidad de 4 B (TS 29.281 §5.2.1)"
   }
  },
  {
   "id": "V-N3-OVH",
   "ambito": "transporte",
   "valor": 44,
   "unidad": "B",
   "tipo": "derivado",
   "entradas": [
    "V-GTPU",
    "V-GTPU-OPT",
    "V-PDUSC",
    "V-UDP",
    "V-IPV4"
   ],
   "estado": "trazado",
   "formula": "FX-031",
   "calc": "e[0]+e[1]+e[2]+e[3]+e[4]",
   "nota": "GTP-U 16 B + UDP 8 B + IPv4 20 B por paquete en N3."
  },
  {
   "id": "V-KVONR-CALC",
   "ambito": "transporte",
   "valor": 1.44,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-VONR-IP-B",
    "V-N3-OVH"
   ],
   "estado": "trazado",
   "formula": "FX-031",
   "calc": "(e[0]+e[1])/e[0]",
   "ref": {
    "valor": 1.44,
    "donde": "memoria",
    "localizador": "v7 §6.4 k_VoNR"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005
  },
  {
   "id": "V-KVONR",
   "ambito": "transporte",
   "valor": 1.44,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L11",
   "memoria": "v7 §6.4",
   "respaldo": [
    "V-KVONR-CALC"
   ]
  },
  {
   "id": "V-CH400",
   "ambito": "transporte",
   "valor": 400,
   "unidad": "Gbit/s/canal",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p4 SCOM02 (WDM/OTN metropolitana)"
   },
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.1",
   "clase": "decision"
  },
  {
   "id": "V-FMAX-ANILLO-CN",
   "ambito": "transporte",
   "valor": 1894.72,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1894.72,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-N",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-ANILLO-CN",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-CN",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 6,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-N",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-ANILLO-CN",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-ANILLO-CN.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-ANILLO-CN",
     "V-NMIN-ANILLO-CN"
    ],
    "cumple": true
   },
   "elemento": "L-ANILLO-CN",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-ANILLO-CN",
   "ambito": "transporte",
   "valor": 2400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-ANILLO-CN",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 2400,
    "donde": "simulador",
    "localizador": "red.js L-ANILLO-CN.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-ANILLO-CN",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_C-N|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-ANILLO-CN",
   "ambito": "transporte",
   "valor": 0.7894666667,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-CN",
    "V-CAP-ANILLO-CN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-KM-ANILLO-CN",
   "ambito": "transporte",
   "valor": 20,
   "unidad": "km",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.4.1 (vanos del anillo)"
   },
   "supuesto": "S-L18",
   "memoria": "v7 §6.4.1",
   "huecos_raiz": [
    "V-KM-ANILLO-CN"
   ],
   "elemento": "L-ANILLO-CN",
   "campo": "km"
  },
  {
   "id": "V-FMAX-ANILLO-NE",
   "ambito": "transporte",
   "valor": 992.27,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 992.27,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-E",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-ANILLO-NE",
   "ambito": "transporte",
   "valor": 3,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-NE",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 3,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-E",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-ANILLO-NE",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-ANILLO-NE.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-ANILLO-NE",
     "V-NMIN-ANILLO-NE"
    ],
    "cumple": true
   },
   "elemento": "L-ANILLO-NE",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-ANILLO-NE",
   "ambito": "transporte",
   "valor": 1600,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-ANILLO-NE",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 1600,
    "donde": "simulador",
    "localizador": "red.js L-ANILLO-NE.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-ANILLO-NE",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_N-E|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-ANILLO-NE",
   "ambito": "transporte",
   "valor": 0.62016875,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-NE",
    "V-CAP-ANILLO-NE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-KM-ANILLO-NE",
   "ambito": "transporte",
   "valor": 28,
   "unidad": "km",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.4.1 (vanos del anillo)"
   },
   "supuesto": "S-L18",
   "memoria": "v7 §6.4.1",
   "huecos_raiz": [
    "V-KM-ANILLO-NE"
   ],
   "elemento": "L-ANILLO-NE",
   "campo": "km"
  },
  {
   "id": "V-FMAX-ANILLO-ES",
   "ambito": "transporte",
   "valor": 1111.93,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1111.93,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_E-S",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-ANILLO-ES",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-ES",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 4,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_E-S",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-ANILLO-ES",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-ANILLO-ES.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-ANILLO-ES",
     "V-NMIN-ANILLO-ES"
    ],
    "cumple": true
   },
   "elemento": "L-ANILLO-ES",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-ANILLO-ES",
   "ambito": "transporte",
   "valor": 1600,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-ANILLO-ES",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 1600,
    "donde": "simulador",
    "localizador": "red.js L-ANILLO-ES.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-ANILLO-ES",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_E-S|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-ANILLO-ES",
   "ambito": "transporte",
   "valor": 0.69495625,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-ES",
    "V-CAP-ANILLO-ES"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-KM-ANILLO-ES",
   "ambito": "transporte",
   "valor": 38,
   "unidad": "km",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.4.1 (vanos del anillo)"
   },
   "supuesto": "S-L18",
   "memoria": "v7 §6.4.1",
   "huecos_raiz": [
    "V-KM-ANILLO-ES"
   ],
   "elemento": "L-ANILLO-ES",
   "campo": "km"
  },
  {
   "id": "V-FMAX-ANILLO-SC",
   "ambito": "transporte",
   "valor": 947.93,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 947.93,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_S-C",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-ANILLO-SC",
   "ambito": "transporte",
   "valor": 3,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-SC",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 3,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_S-C",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-ANILLO-SC",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-ANILLO-SC.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-ANILLO-SC",
     "V-NMIN-ANILLO-SC"
    ],
    "cumple": true
   },
   "elemento": "L-ANILLO-SC",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-ANILLO-SC",
   "ambito": "transporte",
   "valor": 2400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-ANILLO-SC",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 2400,
    "donde": "simulador",
    "localizador": "red.js L-ANILLO-SC.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-ANILLO-SC",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_S-C|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-ANILLO-SC",
   "ambito": "transporte",
   "valor": 0.3949708333,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-ANILLO-SC",
    "V-CAP-ANILLO-SC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-KM-ANILLO-SC",
   "ambito": "transporte",
   "valor": 16,
   "unidad": "km",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.4.1 (vanos del anillo)"
   },
   "supuesto": "S-L18",
   "memoria": "v7 §6.4.1",
   "huecos_raiz": [
    "V-KM-ANILLO-SC"
   ],
   "elemento": "L-ANILLO-SC",
   "campo": "km"
  },
  {
   "id": "V-FMAX-CORE1-METC",
   "ambito": "transporte",
   "valor": 2139.0,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 2139.0,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-DC",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE1-METC",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE1-METC",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 6,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-DC",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE1-METC",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE1-METC.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE1-METC",
     "V-NMIN-CORE1-METC"
    ],
    "cumple": true
   },
   "elemento": "L-CORE1-METC",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE1-METC",
   "ambito": "transporte",
   "valor": 2400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE1-METC",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 2400,
    "donde": "simulador",
    "localizador": "red.js L-CORE1-METC.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE1-METC",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_C-DC|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE1-METC",
   "ambito": "transporte",
   "valor": 0.89125,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE1-METC",
    "V-CAP-CORE1-METC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-FMAX-CORE1-METN",
   "ambito": "transporte",
   "valor": 1222.66,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1222.66,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-DC",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE1-METN",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE1-METN",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 4,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-DC",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE1-METN",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE1-METN.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE1-METN",
     "V-NMIN-CORE1-METN"
    ],
    "cumple": true
   },
   "elemento": "L-CORE1-METN",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE1-METN",
   "ambito": "transporte",
   "valor": 1600,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE1-METN",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 1600,
    "donde": "simulador",
    "localizador": "red.js L-CORE1-METN.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE1-METN",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_N-DC|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE1-METN",
   "ambito": "transporte",
   "valor": 0.7641625,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE1-METN",
    "V-CAP-CORE1-METN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-FMAX-CORE2-METN",
   "ambito": "transporte",
   "valor": 1859.38,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1859.38,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-DN",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE2-METN",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE2-METN",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 6,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_N-DN",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE2-METN",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE2-METN.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE2-METN",
     "V-NMIN-CORE2-METN"
    ],
    "cumple": true
   },
   "elemento": "L-CORE2-METN",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE2-METN",
   "ambito": "transporte",
   "valor": 2400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE2-METN",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 2400,
    "donde": "simulador",
    "localizador": "red.js L-CORE2-METN.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE2-METN",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_N-DN|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE2-METN",
   "ambito": "transporte",
   "valor": 0.7747416667,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE2-METN",
    "V-CAP-CORE2-METN"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-FMAX-CORE2-METE",
   "ambito": "transporte",
   "valor": 1222.66,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1222.66,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_E-DN",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE2-METE",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE2-METE",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 4,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_E-DN",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE2-METE",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE2-METE.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE2-METE",
     "V-NMIN-CORE2-METE"
    ],
    "cumple": true
   },
   "elemento": "L-CORE2-METE",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE2-METE",
   "ambito": "transporte",
   "valor": 1600,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE2-METE",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 1600,
    "donde": "simulador",
    "localizador": "red.js L-CORE2-METE.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE2-METE",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_E-DN|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE2-METE",
   "ambito": "transporte",
   "valor": 0.7641625,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE2-METE",
    "V-CAP-CORE2-METE"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-FMAX-CORE3-METS",
   "ambito": "transporte",
   "valor": 1222.66,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1222.66,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_S-DS",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE3-METS",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE3-METS",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 4,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_S-DS",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE3-METS",
   "ambito": "transporte",
   "valor": 4,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE3-METS.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE3-METS",
     "V-NMIN-CORE3-METS"
    ],
    "cumple": true
   },
   "elemento": "L-CORE3-METS",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE3-METS",
   "ambito": "transporte",
   "valor": 1600,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE3-METS",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 1600,
    "donde": "simulador",
    "localizador": "red.js L-CORE3-METS.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE3-METS",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_S-DS|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE3-METS",
   "ambito": "transporte",
   "valor": 0.7641625,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE3-METS",
    "V-CAP-CORE3-METS"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-FMAX-CORE3-METC",
   "ambito": "transporte",
   "valor": 1859.38,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-A111-DL-C",
    "V-A111-DL-N",
    "V-A111-DL-E",
    "V-A111-DL-S",
    "V-A111-UL-C",
    "V-A111-UL-N",
    "V-A111-UL-E",
    "V-A111-UL-S",
    "V-OVH",
    "V-KVONR",
    "V-ESP-DL",
    "V-NDC"
   ],
   "estado": "hueco",
   "formula": "FX-023",
   "memoria": "v7 §6.4.4 / A11.4-A11.6",
   "nota": "Recalculado por motor.js (comparar_v7.js / test_v7.js: 220/220 cargas a ±1 Gbit/s).",
   "ref": {
    "valor": 1859.38,
    "donde": "memoria",
    "localizador": "v7 §6.4.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.005,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-DS",
   "campo": "max_Gbit_s"
  },
  {
   "id": "V-NMIN-CORE3-METC",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE3-METC",
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(e[0]/(e[1]*e[2]))",
   "memoria": "v7 §6.4.3",
   "ref": {
    "valor": 6,
    "donde": "memoria",
    "localizador": "v7 §6.4.3 (mínimo)"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP",
    "V-V2X-CAB",
    "V-V2X-N"
   ],
   "elemento": "link_C-DS",
   "campo": "n_min_400G"
  },
  {
   "id": "V-NREF-CORE3-METC",
   "ambito": "transporte",
   "valor": 6,
   "unidad": "canales",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "supuesto": "S-L16",
   "memoria": "v7 §6.4.4",
   "nota": "Decisión de diseño; comprobación n_ref ≥ n_min en V-NMIN-CORE3-METC.",
   "clase": "decision",
   "comprueba": {
    "expr": "e[0]>=e[1]",
    "entradas": [
     "V-NREF-CORE3-METC",
     "V-NMIN-CORE3-METC"
    ],
    "cumple": true
   },
   "elemento": "L-CORE3-METC",
   "campo": "canales_400g"
  },
  {
   "id": "V-CAP-CORE3-METC",
   "ambito": "transporte",
   "valor": 2400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-NREF-CORE3-METC",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-022",
   "calc": "e[0]*e[1]",
   "memoria": "v7 §6.4.4",
   "ref": {
    "valor": 2400,
    "donde": "simulador",
    "localizador": "red.js L-CORE3-METC.capacidad_gbps"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "elemento": "L-CORE3-METC",
   "campo": "capacidad_gbps",
   "tambien": [
    "link_C-DS|cap_ref_Gbit_s"
   ]
  },
  {
   "id": "V-OCUP-CORE3-METC",
   "ambito": "transporte",
   "valor": 0.7747416667,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-FMAX-CORE3-METC",
    "V-CAP-CORE3-METC"
   ],
   "estado": "hueco",
   "formula": "FX-018",
   "calc": "e[0]/e[1]",
   "memoria": "v7 §6.4.4",
   "huecos_raiz": [
    "V-FBH",
    "V-HOSP-DLB",
    "V-IND-DLB",
    "V-LEMP",
    "V-MIX-DL",
    "V-OVH",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-V2X-CAB",
    "V-V2X-N"
   ]
  },
  {
   "id": "V-DCAGG",
   "ambito": "transporte",
   "valor": 7,
   "unidad": "canales",
   "tipo": "derivado",
   "entradas": [
    "V-CH400",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-022",
   "calc": "Math.ceil(2407.86/e[1]/e[0])",
   "memoria": "v7 §6.4",
   "nota": "2 407,86 Gbit/s es la carga agregada de un DC en N-1 de la matriz A11 (no recalculada aquí).",
   "ref": {
    "valor": 7,
    "donde": "memoria",
    "localizador": "v7 §6.4"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-UP"
   ],
   "elemento": "DC_agg",
   "campo": "valor"
  },
  {
   "id": "V-CAPAGG-MADRID",
   "ambito": "transporte",
   "valor": 6000,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-MADRID",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 6000,
    "donde": "simulador",
    "localizador": "red.js L-AGGMADRID-METC"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGMADRID-METC",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-ALCOBENDAS",
   "ambito": "transporte",
   "valor": 300,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-ALCOBENDAS",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 300,
    "donde": "simulador",
    "localizador": "red.js L-AGGALCOBENDAS-METN"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGALCOBENDAS-METN",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-TRESCANTOS",
   "ambito": "transporte",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-TRESCANTOS",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-AGGTRESCANTOS-METN"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGTRESCANTOS-METN",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-TALAMANCA",
   "ambito": "transporte",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-TALAMANCA",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-AGGTALAMANCA-METN"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGTALAMANCA-METN",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-TORREJON",
   "ambito": "transporte",
   "valor": 300,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-TORREJON",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 300,
    "donde": "simulador",
    "localizador": "red.js L-AGGTORREJON-METE"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGTORREJON-METE",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-ALCALA",
   "ambito": "transporte",
   "valor": 400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-ALCALA",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 400,
    "donde": "simulador",
    "localizador": "red.js L-AGGALCALA-METE"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGALCALA-METE",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-LOSSANTOS",
   "ambito": "transporte",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-LOSSANTOS",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-AGGLOSSANTOS-METE"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGLOSSANTOS-METE",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-GETAFE",
   "ambito": "transporte",
   "valor": 400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-GETAFE",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 400,
    "donde": "simulador",
    "localizador": "red.js L-AGGGETAFE-METS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGGETAFE-METS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-LEGANES",
   "ambito": "transporte",
   "valor": 400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-LEGANES",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 400,
    "donde": "simulador",
    "localizador": "red.js L-AGGLEGANES-METS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGLEGANES-METS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-FUENLABRADA",
   "ambito": "transporte",
   "valor": 400,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-FUENLABRADA",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 400,
    "donde": "simulador",
    "localizador": "red.js L-AGGFUENLABRADA-METS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGFUENLABRADA-METS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-ALCORCON",
   "ambito": "transporte",
   "valor": 300,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-ALCORCON",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 300,
    "donde": "simulador",
    "localizador": "red.js L-AGGALCORCON-METS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGALCORCON-METS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-CAPAGG-BATRES",
   "ambito": "transporte",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "derivado",
   "entradas": [
    "V-RED-DL-BATRES",
    "V-OVH",
    "V-UN",
    "V-PICO",
    "V-UP"
   ],
   "estado": "hueco",
   "formula": "FX-027",
   "calc": "100*Math.ceil(Math.max(e[0]*e[1]/e[2], e[3]*e[0]*e[1]/e[4])/100)",
   "supuesto": "S-003",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-AGGBATRES-METS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-FBH",
    "V-LEMP",
    "V-OVH",
    "V-PICO",
    "V-RIMS",
    "V-SPF",
    "V-SPM",
    "V-SUP-L03",
    "V-SUP-L04",
    "V-UP"
   ],
   "elemento": "L-AGGBATRES-METS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-EDGE-C",
   "ambito": "nodos",
   "valor": 400,
   "unidad": "Gbit/s",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.7.2, §6.7.5 (NIC Edge-Centro; tabla con 406,12 Gbit/s)"
   },
   "supuesto": "S-L00",
   "memoria": "v7 §6.7.2",
   "nota": "Sin derivación escrita completa; hueco. Fuente propuesta: hoja de datos de la NIC + reparto de flujos MEC.",
   "huecos_raiz": [
    "V-EDGE-C"
   ],
   "elemento": "EDGE-CENTRO",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-BNG-CHAS",
   "ambito": "nodos",
   "valor": 10,
   "unidad": "chasis",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§5.1 (Nokia 7750 SR-2se, 10 chasis, 2.2 sizing)"
   },
   "supuesto": "S-L00",
   "memoria": "v7 §5.1",
   "nota": "Falta la capacidad por chasis (hoja de datos Nokia 7750 SR-2se) para deducir 10.",
   "huecos_raiz": [
    "V-BNG-CHAS"
   ]
  },
  {
   "id": "V-UPF-SRV",
   "ambito": "nodos",
   "valor": 3,
   "unidad": "servidores/DC",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.7.2 (3 R760 por DC)"
   },
   "supuesto": "S-L00",
   "memoria": "v7 §6.7.2",
   "nota": "Falta el rendimiento por servidor (benchmark de la UPF elegida) para deducir 3.",
   "huecos_raiz": [
    "V-UPF-SRV"
   ]
  },
  {
   "id": "V-EDGE-FLOTA",
   "ambito": "nodos",
   "valor": "24 / 7 / 3",
   "unidad": "servidores",
   "tipo": "dato",
   "entradas": [],
   "estado": "hueco",
   "fuente": {
    "id": "F-MEMORIA-V7",
    "localizador": "§6.7.2 (Centro/Este/Sur)"
   },
   "supuesto": "S-L00",
   "memoria": "v7 §6.7.2",
   "huecos_raiz": [
    "V-EDGE-FLOTA"
   ]
  },
  {
   "id": "V-SIM-CORE1-IXIMS",
   "ambito": "nodos",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-004",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-CORE1-IXIMS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE1-IXIMS"
   ],
   "elemento": "L-CORE1-IXIMS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-CORE2-IXIMS",
   "ambito": "nodos",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-004",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-CORE2-IXIMS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE2-IXIMS"
   ],
   "elemento": "L-CORE2-IXIMS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-CORE3-IXIMS",
   "ambito": "nodos",
   "valor": 100,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-004",
   "ref": {
    "valor": 100,
    "donde": "simulador",
    "localizador": "red.js L-CORE3-IXIMS"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE3-IXIMS"
   ],
   "elemento": "L-CORE3-IXIMS",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-CORE1-IXINTERNET",
   "ambito": "nodos",
   "valor": 4000,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-005",
   "ref": {
    "valor": 4000,
    "donde": "simulador",
    "localizador": "red.js L-CORE1-IXINTERNET"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE1-IXINTERNET"
   ],
   "elemento": "L-CORE1-IXINTERNET",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-CORE2-IXINTERNET",
   "ambito": "nodos",
   "valor": 4000,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-005",
   "ref": {
    "valor": 4000,
    "donde": "simulador",
    "localizador": "red.js L-CORE2-IXINTERNET"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE2-IXINTERNET"
   ],
   "elemento": "L-CORE2-IXINTERNET",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-CORE3-IXINTERNET",
   "ambito": "nodos",
   "valor": 4000,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-005",
   "ref": {
    "valor": 4000,
    "donde": "simulador",
    "localizador": "red.js L-CORE3-IXINTERNET"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-CORE3-IXINTERNET"
   ],
   "elemento": "L-CORE3-IXINTERNET",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-SIM-IXONEWEB-CORE1",
   "ambito": "nodos",
   "valor": 1,
   "unidad": "Gbit/s",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-007",
   "ref": {
    "valor": 1,
    "donde": "simulador",
    "localizador": "red.js L-IXONEWEB-CORE1"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.5,
   "huecos_raiz": [
    "V-SIM-IXONEWEB-CORE1"
   ],
   "elemento": "L-IXONEWEB-CORE1",
   "campo": "capacidad_gbps"
  },
  {
   "id": "V-ANA-PAQ",
   "ambito": "analisis",
   "valor": 1500,
   "unidad": "B",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-RFC894",
    "localizador": "MTU Ethernet 1500 octetos"
   },
   "supuesto": "S-111",
   "nota": "Cota superior del tiempo de servicio; la v7 §6.7.4 da 800 B (móvil) y 100 B (VoNR) para la UPF."
  },
  {
   "id": "V-ANA-SER400",
   "ambito": "analisis",
   "valor": 3e-05,
   "unidad": "ms",
   "tipo": "derivado",
   "entradas": [
    "V-ANA-PAQ",
    "V-CH400"
   ],
   "estado": "trazado",
   "formula": "FX-035",
   "calc": "e[0]*8/(e[1]*1e6)",
   "ref": {
    "valor": 3e-05,
    "donde": "simulador",
    "localizador": "motor.js enlaces['L-ANILLO-CN'].lat_ser_ms"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0
  },
  {
   "id": "V-ANA-CORTES",
   "ambito": "analisis",
   "valor": 4.39,
   "unidad": "cortes/1000 millas·año",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARXIV-2607.14324",
    "localizador": "sección de disponibilidad, ref. [36] To y Neusy"
   },
   "nota": "Supuesto ana.disp_fibra: valor de larga distancia aplicado al metro de Madrid."
  },
  {
   "id": "V-ANA-MTTR",
   "ambito": "analisis",
   "valor": 12,
   "unidad": "h",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ARXIV-2607.14324",
    "localizador": "'MTTR_cab = 12 h' (Bellcore, ref. [36])"
   }
  },
  {
   "id": "V-ANA-UFIB-ANILLOCN",
   "ambito": "analisis",
   "valor": 7.472919688e-05,
   "unidad": "—",
   "tipo": "derivado",
   "entradas": [
    "V-ANA-CORTES",
    "V-KM-ANILLO-CN",
    "V-ANA-MTTR"
   ],
   "estado": "hueco",
   "formula": "FX-039",
   "calc": "(e[0]/1609.344*e[1]/8760*e[2])/(1+e[0]/1609.344*e[1]/8760*e[2])",
   "ref": {
    "valor": 7.472919688106544e-05,
    "donde": "simulador",
    "localizador": "motor.js disponibilidad().sucesos L-ANILLO-CN .u"
   },
   "dif_rel": 0.0,
   "tol_abs": 0.0,
   "huecos_raiz": [
    "V-KM-ANILLO-CN"
   ]
  },
  {
   "id": "V-ANA-UNODO",
   "ambito": "analisis",
   "valor": 0.0002,
   "unidad": "—",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-105",
   "memoria": "v7 §7.1.1 A5 [HYP]",
   "nota": "u de un DC en la v7, extendida a Metro, Edge e IX por el simulador.",
   "huecos_raiz": [
    "V-ANA-UNODO"
   ]
  },
  {
   "id": "V-ANA-COMUN",
   "ambito": "analisis",
   "valor": 20,
   "unidad": "min/año",
   "tipo": "supuesto",
   "entradas": [],
   "estado": "hueco",
   "supuesto": "S-103",
   "memoria": "v7 §7.1.1 A5 [HYP]",
   "huecos_raiz": [
    "V-ANA-COMUN"
   ]
  },
  {
   "id": "V-ANA-OBJ-NUCLEO",
   "ambito": "analisis",
   "valor": 99.99,
   "unidad": "%",
   "tipo": "dato",
   "entradas": [],
   "estado": "trazado",
   "fuente": {
    "id": "F-ENUNCIADO-P2",
    "localizador": "p3 ARCO02 (disponibilidad ≥ 99,99 %)"
   },
   "memoria": "v7 §7.1.1"
  }
 ],
 "indice": {
  "Z-MADRID|poblacion_2025": "V-P25-MADRID",
  "P25_madrid|valor": "V-P25-MADRID",
  "Z-MADRID|hogar_medio": "V-S-MADRID",
  "s_madrid|valor": "V-S-MADRID",
  "Z-MADRID|empresas_2025": "V-E25-MADRID",
  "E25_madrid|valor": "V-E25-MADRID",
  "Z-MADRID|hogares_2025": "V-H25-MADRID",
  "Z-ALCOBENDAS|poblacion_2025": "V-P25-ALCOBENDAS",
  "P25_alcobendas|valor": "V-P25-ALCOBENDAS",
  "Z-ALCOBENDAS|hogar_medio": "V-S-ALCOBENDAS",
  "s_alcobendas|valor": "V-S-ALCOBENDAS",
  "Z-ALCOBENDAS|empresas_2025": "V-E25-ALCOBENDAS",
  "E25_alcobendas|valor": "V-E25-ALCOBENDAS",
  "Z-ALCOBENDAS|hogares_2025": "V-H25-ALCOBENDAS",
  "Z-TRESCANTOS|poblacion_2025": "V-P25-TRESCANTOS",
  "P25_tres_cantos|valor": "V-P25-TRESCANTOS",
  "Z-TRESCANTOS|hogar_medio": "V-S-TRESCANTOS",
  "s_tres_cantos|valor": "V-S-TRESCANTOS",
  "Z-TRESCANTOS|empresas_2025": "V-E25-TRESCANTOS",
  "E25_tres_cantos|valor": "V-E25-TRESCANTOS",
  "Z-TRESCANTOS|hogares_2025": "V-H25-TRESCANTOS",
  "Z-TALAMANCA|poblacion_2025": "V-P25-TALAMANCA",
  "P25_talamanca|valor": "V-P25-TALAMANCA",
  "Z-TALAMANCA|hogar_medio": "V-S-TALAMANCA",
  "s_talamanca|valor": "V-S-TALAMANCA",
  "Z-TALAMANCA|empresas_2025": "V-E25-TALAMANCA",
  "E25_talamanca|valor": "V-E25-TALAMANCA",
  "Z-TALAMANCA|hogares_2025": "V-H25-TALAMANCA",
  "Z-TORREJON|poblacion_2025": "V-P25-TORREJON",
  "P25_torrejon|valor": "V-P25-TORREJON",
  "Z-TORREJON|hogar_medio": "V-S-TORREJON",
  "s_torrejon|valor": "V-S-TORREJON",
  "Z-TORREJON|empresas_2025": "V-E25-TORREJON",
  "E25_torrejon|valor": "V-E25-TORREJON",
  "Z-TORREJON|hogares_2025": "V-H25-TORREJON",
  "Z-ALCALA|poblacion_2025": "V-P25-ALCALA",
  "P25_alcala|valor": "V-P25-ALCALA",
  "Z-ALCALA|hogar_medio": "V-S-ALCALA",
  "s_alcala|valor": "V-S-ALCALA",
  "Z-ALCALA|empresas_2025": "V-E25-ALCALA",
  "E25_alcala|valor": "V-E25-ALCALA",
  "Z-ALCALA|hogares_2025": "V-H25-ALCALA",
  "Z-LOSSANTOS|poblacion_2025": "V-P25-LOSSANTOS",
  "P25_los_santos|valor": "V-P25-LOSSANTOS",
  "Z-LOSSANTOS|hogar_medio": "V-S-LOSSANTOS",
  "s_los_santos|valor": "V-S-LOSSANTOS",
  "Z-LOSSANTOS|empresas_2025": "V-E25-LOSSANTOS",
  "E25_los_santos|valor": "V-E25-LOSSANTOS",
  "Z-LOSSANTOS|hogares_2025": "V-H25-LOSSANTOS",
  "Z-GETAFE|poblacion_2025": "V-P25-GETAFE",
  "P25_getafe|valor": "V-P25-GETAFE",
  "Z-GETAFE|hogar_medio": "V-S-GETAFE",
  "s_getafe|valor": "V-S-GETAFE",
  "Z-GETAFE|empresas_2025": "V-E25-GETAFE",
  "E25_getafe|valor": "V-E25-GETAFE",
  "Z-GETAFE|hogares_2025": "V-H25-GETAFE",
  "b_getafe|valor": "V-B-GETAFE",
  "Ppad25_getafe|valor": "V-PPAD25-GETAFE",
  "P31_getafe|valor": "V-P31R-GETAFE",
  "Z-LEGANES|poblacion_2025": "V-P25-LEGANES",
  "P25_leganes|valor": "V-P25-LEGANES",
  "Z-LEGANES|hogar_medio": "V-S-LEGANES",
  "s_leganes|valor": "V-S-LEGANES",
  "Z-LEGANES|empresas_2025": "V-E25-LEGANES",
  "E25_leganes|valor": "V-E25-LEGANES",
  "Z-LEGANES|hogares_2025": "V-H25-LEGANES",
  "Z-FUENLABRADA|poblacion_2025": "V-P25-FUENLABRADA",
  "P25_fuenlabrada|valor": "V-P25-FUENLABRADA",
  "Z-FUENLABRADA|hogar_medio": "V-S-FUENLABRADA",
  "s_fuenlabrada|valor": "V-S-FUENLABRADA",
  "Z-FUENLABRADA|empresas_2025": "V-E25-FUENLABRADA",
  "E25_fuenlabrada|valor": "V-E25-FUENLABRADA",
  "Z-FUENLABRADA|hogares_2025": "V-H25-FUENLABRADA",
  "Z-ALCORCON|poblacion_2025": "V-P25-ALCORCON",
  "P25_alcorcon|valor": "V-P25-ALCORCON",
  "Z-ALCORCON|hogar_medio": "V-S-ALCORCON",
  "s_alcorcon|valor": "V-S-ALCORCON",
  "Z-ALCORCON|empresas_2025": "V-E25-ALCORCON",
  "E25_alcorcon|valor": "V-E25-ALCORCON",
  "Z-ALCORCON|hogares_2025": "V-H25-ALCORCON",
  "Z-BATRES|poblacion_2025": "V-P25-BATRES",
  "P25_batres|valor": "V-P25-BATRES",
  "Z-BATRES|hogar_medio": "V-S-BATRES",
  "s_batres|valor": "V-S-BATRES",
  "Z-BATRES|empresas_2025": "V-E25-BATRES",
  "E25_batres|valor": "V-E25-BATRES",
  "Z-BATRES|hogares_2025": "V-H25-BATRES",
  "P25_C|valor": "V-P25-ZC",
  "P31_C|valor": "V-P31-ZC",
  "H25_C|valor": "V-H25-ZC",
  "P25_N|valor": "V-P25-ZN",
  "P31_N|valor": "V-P31-ZN",
  "H25_N|valor": "V-H25-ZN",
  "P25_E|valor": "V-P25-ZE",
  "P31_E|valor": "V-P31-ZE",
  "H25_E|valor": "V-H25-ZE",
  "P25_S|valor": "V-P25-ZS",
  "P31_S|valor": "V-P31-ZS",
  "H25_S|valor": "V-H25-ZS",
  "share31_C|valor": "V-W-ZC",
  "share31_N|valor": "V-W-ZN",
  "share31_E|valor": "V-W-ZE",
  "share31_S|valor": "V-W-ZS",
  "P25_tot|valor": "V-P25-TOT",
  "P31_tot|valor": "V-P31-TOT",
  "H25_tot|valor": "V-H25-TOT",
  "H31_tot|valor": "V-H31-TOT",
  "E31_tot|valor": "V-E31-TOT",
  "Z-MADRID|poblacion": "V-RED-P31-MADRID",
  "Z-ALCOBENDAS|poblacion": "V-RED-P31-ALCOBENDAS",
  "Z-TRESCANTOS|poblacion": "V-RED-P31-TRESCANTOS",
  "Z-TALAMANCA|poblacion": "V-RED-P31-TALAMANCA",
  "Z-TORREJON|poblacion": "V-RED-P31-TORREJON",
  "Z-ALCALA|poblacion": "V-RED-P31-ALCALA",
  "Z-LOSSANTOS|poblacion": "V-RED-P31-LOSSANTOS",
  "Z-GETAFE|poblacion": "V-RED-P31-GETAFE",
  "Z-LEGANES|poblacion": "V-RED-P31-LEGANES",
  "Z-FUENLABRADA|poblacion": "V-RED-P31-FUENLABRADA",
  "Z-ALCORCON|poblacion": "V-RED-P31-ALCORCON",
  "Z-BATRES|poblacion": "V-RED-P31-BATRES",
  "pen_fijo_hog|valor": "V-PFIJO",
  "lin_empresa|valor": "V-LEMP",
  "ratio_tm|valor": "V-RATIO-TM",
  "ratio_im|valor": "V-RATIO-IM",
  "ratio_if|valor": "V-RATIO-IF",
  "cuota_vf|valor": "V-CUOTA-VF",
  "cuota_if|valor": "V-CUOTA-IF",
  "cuota_tm|valor": "V-CUOTA-TM",
  "cuota_im|valor": "V-CUOTA-IM",
  "Lmk25|valor": "V-LMK25",
  "Nf25|valor": "V-NF25",
  "Nm25|valor": "V-NM25",
  "Nd25|valor": "V-ND25",
  "Nb25|valor": "V-NB25",
  "Lmk31|valor": "V-LMK31",
  "Nf31|valor": "V-NF31",
  "Nm31|valor": "V-NM31",
  "Nd31|valor": "V-ND31",
  "Nb31|valor": "V-NB31",
  "N_IMS31|valor": "V-NIMS",
  "Z-MADRID|abonados_fijos": "V-RED-AF-MADRID",
  "Z-MADRID|abonados_moviles": "V-RED-AM-MADRID",
  "Z-MADRID|lineas_datos_moviles": "V-RED-LD-MADRID",
  "Z-ALCOBENDAS|abonados_fijos": "V-RED-AF-ALCOBENDAS",
  "Z-ALCOBENDAS|abonados_moviles": "V-RED-AM-ALCOBENDAS",
  "Z-ALCOBENDAS|lineas_datos_moviles": "V-RED-LD-ALCOBENDAS",
  "Z-TRESCANTOS|abonados_fijos": "V-RED-AF-TRESCANTOS",
  "Z-TRESCANTOS|abonados_moviles": "V-RED-AM-TRESCANTOS",
  "Z-TRESCANTOS|lineas_datos_moviles": "V-RED-LD-TRESCANTOS",
  "Z-TALAMANCA|abonados_fijos": "V-RED-AF-TALAMANCA",
  "Z-TALAMANCA|abonados_moviles": "V-RED-AM-TALAMANCA",
  "Z-TALAMANCA|lineas_datos_moviles": "V-RED-LD-TALAMANCA",
  "Z-TORREJON|abonados_fijos": "V-RED-AF-TORREJON",
  "Z-TORREJON|abonados_moviles": "V-RED-AM-TORREJON",
  "Z-TORREJON|lineas_datos_moviles": "V-RED-LD-TORREJON",
  "Z-ALCALA|abonados_fijos": "V-RED-AF-ALCALA",
  "Z-ALCALA|abonados_moviles": "V-RED-AM-ALCALA",
  "Z-ALCALA|lineas_datos_moviles": "V-RED-LD-ALCALA",
  "Z-LOSSANTOS|abonados_fijos": "V-RED-AF-LOSSANTOS",
  "Z-LOSSANTOS|abonados_moviles": "V-RED-AM-LOSSANTOS",
  "Z-LOSSANTOS|lineas_datos_moviles": "V-RED-LD-LOSSANTOS",
  "Z-GETAFE|abonados_fijos": "V-RED-AF-GETAFE",
  "Z-GETAFE|abonados_moviles": "V-RED-AM-GETAFE",
  "Z-GETAFE|lineas_datos_moviles": "V-RED-LD-GETAFE",
  "Z-LEGANES|abonados_fijos": "V-RED-AF-LEGANES",
  "Z-LEGANES|abonados_moviles": "V-RED-AM-LEGANES",
  "Z-LEGANES|lineas_datos_moviles": "V-RED-LD-LEGANES",
  "Z-FUENLABRADA|abonados_fijos": "V-RED-AF-FUENLABRADA",
  "Z-FUENLABRADA|abonados_moviles": "V-RED-AM-FUENLABRADA",
  "Z-FUENLABRADA|lineas_datos_moviles": "V-RED-LD-FUENLABRADA",
  "Z-ALCORCON|abonados_fijos": "V-RED-AF-ALCORCON",
  "Z-ALCORCON|abonados_moviles": "V-RED-AM-ALCORCON",
  "Z-ALCORCON|lineas_datos_moviles": "V-RED-LD-ALCORCON",
  "Z-BATRES|abonados_fijos": "V-RED-AF-BATRES",
  "Z-BATRES|abonados_moviles": "V-RED-AM-BATRES",
  "Z-BATRES|lineas_datos_moviles": "V-RED-LD-BATRES",
  "Vf25|valor": "V-VF25",
  "gf|valor": "V-GF",
  "Vm25|valor": "V-VM25",
  "gm|valor": "V-GM",
  "Vf31|valor": "V-VF31",
  "Vm31|valor": "V-VM31",
  "fBH|valor": "V-FBH",
  "mes|valor": "V-MES",
  "reserva|valor": "V-RES",
  "u_norm|valor": "V-UN",
  "u_pico|valor": "V-UP",
  "pico2|valor": "V-PICO",
  "Rf|valor": "V-RF",
  "Rm|valor": "V-RM",
  "A_lin|valor": "V-ERL",
  "t_llam|valor": "V-TLL",
  "r_VoNR|valor": "V-RVONR",
  "r_IMS|valor": "V-RIMS",
  "Q_VoNR|valor": "V-QVONR",
  "Q_VoNR_r|valor": "V-QVONR-R",
  "VF_RTP|valor": "V-VFRTP",
  "A_IMS|valor": "V-AIMS",
  "legs|valor": "V-LEGS",
  "IMS_media|valor": "V-IMS-MEDIA",
  "BNG|DL": "V-BNG-DL",
  "BNG|UL": "V-BNG-UL",
  "radio_DL|valor": "V-RBH-DL",
  "radio_UL|valor": "V-RBH-UL",
  "radio_cap_DL|valor": "V-RCAP-DL",
  "radio_cap_UL|valor": "V-RCAP-UL",
  "UPF_central|DL": "V-UPF-DL",
  "UPF_central|UL": "V-UPF-UL",
  "territorial|capacidad_dl_gbps": "V-RCAP-DL",
  "territorial|capacidad_ul_gbps": "V-RCAP-UL",
  "n28|sector_mbps.dl": "V-CSEC-N28-DL",
  "n28|sector_mbps.ul": "V-CSEC-N28-UL",
  "n78|sector_mbps.dl": "V-CSEC-N78-DL",
  "n78|sector_mbps.ul": "V-CSEC-N78-UL",
  "n258|sector_mbps.dl": "V-CSEC-N258-DL",
  "n258|sector_mbps.ul": "V-CSEC-N258-UL",
  "CENTRO|sectores_n78": "V-SEC-C",
  "NORTE|sectores_n78": "V-SEC-N",
  "ESTE|sectores_n78": "V-SEC-E",
  "SUR|sectores_n78": "V-SEC-S",
  "CENTRO|ul_gbps": "V-RCAPZ-UL-C",
  "territorial|sectores_n78": "V-SEC-TOT",
  "territorial|sitios_trisector": "V-SIT-TOT",
  "R-Z-MADRID-n78|sitios": "V-SIT-C",
  "R-Z-MADRID-n28|sitios": "V-SIT-C",
  "Z-ALCORCON|sectores_n78": "V-SEC-ALC",
  "Z-ALCORCON|sitios": "V-SIT-ALC",
  "R-Z-ALCORCON-n78|sitios": "V-SIT-ALC",
  "R-Z-ALCORCON-n28|sitios": "V-SIT-ALC",
  "R-Z-ALCOBENDAS-n78|sitios": "V-SIT-ALCOBENDAS",
  "R-Z-ALCOBENDAS-n28|sitios": "V-SIT-ALCOBENDAS",
  "R-Z-TRESCANTOS-n78|sitios": "V-SIT-TRESCANTOS",
  "R-Z-TRESCANTOS-n28|sitios": "V-SIT-TRESCANTOS",
  "R-Z-TORREJON-n78|sitios": "V-SIT-TORREJON",
  "R-Z-TORREJON-n28|sitios": "V-SIT-TORREJON",
  "R-Z-ALCALA-n78|sitios": "V-SIT-ALCALA",
  "R-Z-ALCALA-n28|sitios": "V-SIT-ALCALA",
  "R-Z-GETAFE-n78|sitios": "V-SIT-GETAFE",
  "R-Z-GETAFE-n28|sitios": "V-SIT-GETAFE",
  "R-Z-LEGANES-n78|sitios": "V-SIT-LEGANES",
  "R-Z-LEGANES-n28|sitios": "V-SIT-LEGANES",
  "R-Z-FUENLABRADA-n78|sitios": "V-SIT-FUENLABRADA",
  "R-Z-FUENLABRADA-n28|sitios": "V-SIT-FUENLABRADA",
  "Inet_C|DL": "V-INET-DL-C",
  "Inet_C|UL": "V-INET-UL-C",
  "VoNR_C|valor": "V-VONR-C",
  "Inet_N|DL": "V-INET-DL-N",
  "Inet_N|UL": "V-INET-UL-N",
  "VoNR_N|valor": "V-VONR-N",
  "Inet_E|DL": "V-INET-DL-E",
  "Inet_E|UL": "V-INET-UL-E",
  "VoNR_E|valor": "V-VONR-E",
  "Inet_S|DL": "V-INET-DL-S",
  "Inet_S|UL": "V-INET-UL-S",
  "VoNR_S|valor": "V-VONR-S",
  "Inet_tot|DL": "V-INET-DL-TOT",
  "Inet_tot|UL": "V-INET-UL-TOT",
  "VF_C|valor": "V-VF-C",
  "A111_C|DL": "V-A111-DL-C",
  "A111_C|UL": "V-A111-UL-C",
  "VF_N|valor": "V-VF-N",
  "A111_N|DL": "V-A111-DL-N",
  "A111_N|UL": "V-A111-UL-N",
  "VF_E|valor": "V-VF-E",
  "A111_E|DL": "V-A111-DL-E",
  "A111_E|UL": "V-A111-UL-E",
  "VF_S|valor": "V-VF-S",
  "A111_S|DL": "V-A111-DL-S",
  "A111_S|UL": "V-A111-UL-S",
  "Z-MADRID|dl_gbps": "V-RED-DL-MADRID",
  "Z-MADRID|ul_gbps": "V-RED-UL-MADRID",
  "Z-MADRID/residencial-fijo|dl_gbps": "V-NRES-DL-MADRID",
  "Z-MADRID/empresa|dl_gbps": "V-NEMP-DL-MADRID",
  "Z-MADRID/movil-ebb|dl_gbps": "V-NMOV-DL-MADRID",
  "Z-MADRID/residencial-fijo|ul_gbps": "V-NRES-UL-MADRID",
  "Z-MADRID/empresa|ul_gbps": "V-NEMP-UL-MADRID",
  "Z-MADRID/movil-ebb|ul_gbps": "V-NMOV-UL-MADRID",
  "Z-MADRID/voz-ims|dl_gbps": "V-NVONR-MADRID",
  "Z-MADRID/voz-fija|dl_gbps": "V-NVF-MADRID",
  "Z-MADRID/voz-ims|ul_gbps": "V-NVONR-MADRID",
  "Z-MADRID/voz-fija|ul_gbps": "V-NVF-MADRID",
  "Z-ALCOBENDAS|dl_gbps": "V-RED-DL-ALCOBENDAS",
  "Z-ALCOBENDAS|ul_gbps": "V-RED-UL-ALCOBENDAS",
  "Z-ALCOBENDAS/residencial-fijo|dl_gbps": "V-NRES-DL-ALCOBENDAS",
  "Z-ALCOBENDAS/empresa|dl_gbps": "V-NEMP-DL-ALCOBENDAS",
  "Z-ALCOBENDAS/movil-ebb|dl_gbps": "V-NMOV-DL-ALCOBENDAS",
  "Z-ALCOBENDAS/residencial-fijo|ul_gbps": "V-NRES-UL-ALCOBENDAS",
  "Z-ALCOBENDAS/empresa|ul_gbps": "V-NEMP-UL-ALCOBENDAS",
  "Z-ALCOBENDAS/movil-ebb|ul_gbps": "V-NMOV-UL-ALCOBENDAS",
  "Z-ALCOBENDAS/voz-ims|dl_gbps": "V-NVONR-ALCOBENDAS",
  "Z-ALCOBENDAS/voz-fija|dl_gbps": "V-NVF-ALCOBENDAS",
  "Z-ALCOBENDAS/voz-ims|ul_gbps": "V-NVONR-ALCOBENDAS",
  "Z-ALCOBENDAS/voz-fija|ul_gbps": "V-NVF-ALCOBENDAS",
  "Z-TRESCANTOS|dl_gbps": "V-RED-DL-TRESCANTOS",
  "Z-TRESCANTOS|ul_gbps": "V-RED-UL-TRESCANTOS",
  "Z-TRESCANTOS/residencial-fijo|dl_gbps": "V-NRES-DL-TRESCANTOS",
  "Z-TRESCANTOS/empresa|dl_gbps": "V-NEMP-DL-TRESCANTOS",
  "Z-TRESCANTOS/movil-ebb|dl_gbps": "V-NMOV-DL-TRESCANTOS",
  "Z-TRESCANTOS/residencial-fijo|ul_gbps": "V-NRES-UL-TRESCANTOS",
  "Z-TRESCANTOS/empresa|ul_gbps": "V-NEMP-UL-TRESCANTOS",
  "Z-TRESCANTOS/movil-ebb|ul_gbps": "V-NMOV-UL-TRESCANTOS",
  "Z-TRESCANTOS/voz-ims|dl_gbps": "V-NVONR-TRESCANTOS",
  "Z-TRESCANTOS/voz-fija|dl_gbps": "V-NVF-TRESCANTOS",
  "Z-TRESCANTOS/voz-ims|ul_gbps": "V-NVONR-TRESCANTOS",
  "Z-TRESCANTOS/voz-fija|ul_gbps": "V-NVF-TRESCANTOS",
  "Z-TALAMANCA|dl_gbps": "V-RED-DL-TALAMANCA",
  "Z-TALAMANCA|ul_gbps": "V-RED-UL-TALAMANCA",
  "Z-TALAMANCA/residencial-fijo|dl_gbps": "V-NRES-DL-TALAMANCA",
  "Z-TALAMANCA/empresa|dl_gbps": "V-NEMP-DL-TALAMANCA",
  "Z-TALAMANCA/movil-ebb|dl_gbps": "V-NMOV-DL-TALAMANCA",
  "Z-TALAMANCA/residencial-fijo|ul_gbps": "V-NRES-UL-TALAMANCA",
  "Z-TALAMANCA/empresa|ul_gbps": "V-NEMP-UL-TALAMANCA",
  "Z-TALAMANCA/movil-ebb|ul_gbps": "V-NMOV-UL-TALAMANCA",
  "Z-TALAMANCA/voz-ims|dl_gbps": "V-NVONR-TALAMANCA",
  "Z-TALAMANCA/voz-fija|dl_gbps": "V-NVF-TALAMANCA",
  "Z-TALAMANCA/voz-ims|ul_gbps": "V-NVONR-TALAMANCA",
  "Z-TALAMANCA/voz-fija|ul_gbps": "V-NVF-TALAMANCA",
  "Z-TORREJON|dl_gbps": "V-RED-DL-TORREJON",
  "Z-TORREJON|ul_gbps": "V-RED-UL-TORREJON",
  "Z-TORREJON/residencial-fijo|dl_gbps": "V-NRES-DL-TORREJON",
  "Z-TORREJON/empresa|dl_gbps": "V-NEMP-DL-TORREJON",
  "Z-TORREJON/movil-ebb|dl_gbps": "V-NMOV-DL-TORREJON",
  "Z-TORREJON/residencial-fijo|ul_gbps": "V-NRES-UL-TORREJON",
  "Z-TORREJON/empresa|ul_gbps": "V-NEMP-UL-TORREJON",
  "Z-TORREJON/movil-ebb|ul_gbps": "V-NMOV-UL-TORREJON",
  "Z-TORREJON/voz-ims|dl_gbps": "V-NVONR-TORREJON",
  "Z-TORREJON/voz-fija|dl_gbps": "V-NVF-TORREJON",
  "Z-TORREJON/voz-ims|ul_gbps": "V-NVONR-TORREJON",
  "Z-TORREJON/voz-fija|ul_gbps": "V-NVF-TORREJON",
  "Z-ALCALA|dl_gbps": "V-RED-DL-ALCALA",
  "Z-ALCALA|ul_gbps": "V-RED-UL-ALCALA",
  "Z-ALCALA/residencial-fijo|dl_gbps": "V-NRES-DL-ALCALA",
  "Z-ALCALA/empresa|dl_gbps": "V-NEMP-DL-ALCALA",
  "Z-ALCALA/movil-ebb|dl_gbps": "V-NMOV-DL-ALCALA",
  "Z-ALCALA/residencial-fijo|ul_gbps": "V-NRES-UL-ALCALA",
  "Z-ALCALA/empresa|ul_gbps": "V-NEMP-UL-ALCALA",
  "Z-ALCALA/movil-ebb|ul_gbps": "V-NMOV-UL-ALCALA",
  "Z-ALCALA/voz-ims|dl_gbps": "V-NVONR-ALCALA",
  "Z-ALCALA/voz-fija|dl_gbps": "V-NVF-ALCALA",
  "Z-ALCALA/voz-ims|ul_gbps": "V-NVONR-ALCALA",
  "Z-ALCALA/voz-fija|ul_gbps": "V-NVF-ALCALA",
  "Z-LOSSANTOS|dl_gbps": "V-RED-DL-LOSSANTOS",
  "Z-LOSSANTOS|ul_gbps": "V-RED-UL-LOSSANTOS",
  "Z-LOSSANTOS/residencial-fijo|dl_gbps": "V-NRES-DL-LOSSANTOS",
  "Z-LOSSANTOS/empresa|dl_gbps": "V-NEMP-DL-LOSSANTOS",
  "Z-LOSSANTOS/movil-ebb|dl_gbps": "V-NMOV-DL-LOSSANTOS",
  "Z-LOSSANTOS/residencial-fijo|ul_gbps": "V-NRES-UL-LOSSANTOS",
  "Z-LOSSANTOS/empresa|ul_gbps": "V-NEMP-UL-LOSSANTOS",
  "Z-LOSSANTOS/movil-ebb|ul_gbps": "V-NMOV-UL-LOSSANTOS",
  "Z-LOSSANTOS/voz-ims|dl_gbps": "V-NVONR-LOSSANTOS",
  "Z-LOSSANTOS/voz-fija|dl_gbps": "V-NVF-LOSSANTOS",
  "Z-LOSSANTOS/voz-ims|ul_gbps": "V-NVONR-LOSSANTOS",
  "Z-LOSSANTOS/voz-fija|ul_gbps": "V-NVF-LOSSANTOS",
  "Z-GETAFE|dl_gbps": "V-RED-DL-GETAFE",
  "Z-GETAFE|ul_gbps": "V-RED-UL-GETAFE",
  "Z-GETAFE/residencial-fijo|dl_gbps": "V-NRES-DL-GETAFE",
  "Z-GETAFE/empresa|dl_gbps": "V-NEMP-DL-GETAFE",
  "Z-GETAFE/movil-ebb|dl_gbps": "V-NMOV-DL-GETAFE",
  "Z-GETAFE/residencial-fijo|ul_gbps": "V-NRES-UL-GETAFE",
  "Z-GETAFE/empresa|ul_gbps": "V-NEMP-UL-GETAFE",
  "Z-GETAFE/movil-ebb|ul_gbps": "V-NMOV-UL-GETAFE",
  "Z-GETAFE/voz-ims|dl_gbps": "V-NVONR-GETAFE",
  "Z-GETAFE/voz-fija|dl_gbps": "V-NVF-GETAFE",
  "Z-GETAFE/voz-ims|ul_gbps": "V-NVONR-GETAFE",
  "Z-GETAFE/voz-fija|ul_gbps": "V-NVF-GETAFE",
  "Z-LEGANES|dl_gbps": "V-RED-DL-LEGANES",
  "Z-LEGANES|ul_gbps": "V-RED-UL-LEGANES",
  "Z-LEGANES/residencial-fijo|dl_gbps": "V-NRES-DL-LEGANES",
  "Z-LEGANES/empresa|dl_gbps": "V-NEMP-DL-LEGANES",
  "Z-LEGANES/movil-ebb|dl_gbps": "V-NMOV-DL-LEGANES",
  "Z-LEGANES/residencial-fijo|ul_gbps": "V-NRES-UL-LEGANES",
  "Z-LEGANES/empresa|ul_gbps": "V-NEMP-UL-LEGANES",
  "Z-LEGANES/movil-ebb|ul_gbps": "V-NMOV-UL-LEGANES",
  "Z-LEGANES/voz-ims|dl_gbps": "V-NVONR-LEGANES",
  "Z-LEGANES/voz-fija|dl_gbps": "V-NVF-LEGANES",
  "Z-LEGANES/voz-ims|ul_gbps": "V-NVONR-LEGANES",
  "Z-LEGANES/voz-fija|ul_gbps": "V-NVF-LEGANES",
  "Z-FUENLABRADA|dl_gbps": "V-RED-DL-FUENLABRADA",
  "Z-FUENLABRADA|ul_gbps": "V-RED-UL-FUENLABRADA",
  "Z-FUENLABRADA/residencial-fijo|dl_gbps": "V-NRES-DL-FUENLABRADA",
  "Z-FUENLABRADA/empresa|dl_gbps": "V-NEMP-DL-FUENLABRADA",
  "Z-FUENLABRADA/movil-ebb|dl_gbps": "V-NMOV-DL-FUENLABRADA",
  "Z-FUENLABRADA/residencial-fijo|ul_gbps": "V-NRES-UL-FUENLABRADA",
  "Z-FUENLABRADA/empresa|ul_gbps": "V-NEMP-UL-FUENLABRADA",
  "Z-FUENLABRADA/movil-ebb|ul_gbps": "V-NMOV-UL-FUENLABRADA",
  "Z-FUENLABRADA/voz-ims|dl_gbps": "V-NVONR-FUENLABRADA",
  "Z-FUENLABRADA/voz-fija|dl_gbps": "V-NVF-FUENLABRADA",
  "Z-FUENLABRADA/voz-ims|ul_gbps": "V-NVONR-FUENLABRADA",
  "Z-FUENLABRADA/voz-fija|ul_gbps": "V-NVF-FUENLABRADA",
  "Z-ALCORCON|dl_gbps": "V-RED-DL-ALCORCON",
  "Z-ALCORCON|ul_gbps": "V-RED-UL-ALCORCON",
  "Z-ALCORCON/residencial-fijo|dl_gbps": "V-NRES-DL-ALCORCON",
  "Z-ALCORCON/empresa|dl_gbps": "V-NEMP-DL-ALCORCON",
  "Z-ALCORCON/movil-ebb|dl_gbps": "V-NMOV-DL-ALCORCON",
  "Z-ALCORCON/residencial-fijo|ul_gbps": "V-NRES-UL-ALCORCON",
  "Z-ALCORCON/empresa|ul_gbps": "V-NEMP-UL-ALCORCON",
  "Z-ALCORCON/movil-ebb|ul_gbps": "V-NMOV-UL-ALCORCON",
  "Z-ALCORCON/voz-ims|dl_gbps": "V-NVONR-ALCORCON",
  "Z-ALCORCON/voz-fija|dl_gbps": "V-NVF-ALCORCON",
  "Z-ALCORCON/voz-ims|ul_gbps": "V-NVONR-ALCORCON",
  "Z-ALCORCON/voz-fija|ul_gbps": "V-NVF-ALCORCON",
  "Z-BATRES|dl_gbps": "V-RED-DL-BATRES",
  "Z-BATRES|ul_gbps": "V-RED-UL-BATRES",
  "Z-BATRES/residencial-fijo|dl_gbps": "V-NRES-DL-BATRES",
  "Z-BATRES/empresa|dl_gbps": "V-NEMP-DL-BATRES",
  "Z-BATRES/movil-ebb|dl_gbps": "V-NMOV-DL-BATRES",
  "Z-BATRES/residencial-fijo|ul_gbps": "V-NRES-UL-BATRES",
  "Z-BATRES/empresa|ul_gbps": "V-NEMP-UL-BATRES",
  "Z-BATRES/movil-ebb|ul_gbps": "V-NMOV-UL-BATRES",
  "Z-BATRES/voz-ims|dl_gbps": "V-NVONR-BATRES",
  "Z-BATRES/voz-fija|dl_gbps": "V-NVF-BATRES",
  "Z-BATRES/voz-ims|ul_gbps": "V-NVONR-BATRES",
  "Z-BATRES/voz-fija|ul_gbps": "V-NVF-BATRES",
  "R-ESTADIO-n258|sectores": "V-EST-SEC",
  "estadio|DL": "V-EST-DL",
  "estadio|UL": "V-EST-UL",
  "S-ESTADIO-PRENSA|dl_gbps": "V-S-ESTADIO-PRENSA-DL",
  "S-ESTADIO-PRENSA|ul_gbps": "V-S-ESTADIO-PRENSA-UL",
  "S-ESTADIO-LIGERO|dl_gbps": "V-S-ESTADIO-LIGERO-DL",
  "S-ESTADIO-LIGERO|ul_gbps": "V-S-ESTADIO-LIGERO-UL",
  "S-ESTADIO-VIDEO|dl_gbps": "V-S-ESTADIO-VIDEO-DL",
  "S-ESTADIO-VIDEO|ul_gbps": "V-S-ESTADIO-VIDEO-UL",
  "S-HOSPITAL-CRITICO|dl_gbps": "V-HOSP-DL",
  "S-HOSPITAL-CRITICO|ul_gbps": "V-HOSP-CRIT-UL",
  "S-HOSPITAL-CAMARAS|ul_gbps": "V-HOSP-CAM",
  "hospital|DL": "V-HOSP-DL",
  "hospital|UL": "V-HOSP-UL",
  "S-V2X-A2|dl_gbps": "V-V2X",
  "S-V2X-A2|ul_gbps": "V-V2X",
  "v2x|valor": "V-V2X",
  "S-VALDEBEBAS-SENSORES|ul_gbps": "V-SENS-SIM",
  "S-VALDEBEBAS-CAMARAS|ul_gbps": "V-CAMS",
  "sensores_vb|valor": "V-SENS",
  "camaras_vb|valor": "V-CAMS",
  "industria|DL": "V-IND-DL",
  "industria|UL": "V-IND-UL",
  "especiales_tot|DL": "V-ESP-DL",
  "especiales_tot|UL": "V-ESP-UL",
  "IP_tot|DL": "V-IP-DL",
  "IP_tot|UL": "V-IP-UL",
  "S-L2VPN-CN|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-CN|ul_gbps": "V-L2VPN-PAR",
  "S-L2VPN-CE|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-CE|ul_gbps": "V-L2VPN-PAR",
  "S-L2VPN-CS|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-CS|ul_gbps": "V-L2VPN-PAR",
  "S-L2VPN-NE|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-NE|ul_gbps": "V-L2VPN-PAR",
  "S-L2VPN-NS|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-NS|ul_gbps": "V-L2VPN-PAR",
  "S-L2VPN-ES|dl_gbps": "V-L2VPN-PAR",
  "S-L2VPN-ES|ul_gbps": "V-L2VPN-PAR",
  "S-NTN-EMERGENCIA|dl_gbps": "V-NTN-DL",
  "S-NTN-EMERGENCIA|ul_gbps": "V-NTN-UL",
  "L-SAT-AGGGETAFE|capacidad_gbps": "V-NTN-TERM",
  "L-SAT-AGGMADRID|capacidad_gbps": "V-NTN-TERM",
  "L-SAT-EDGEESTE|capacidad_gbps": "V-NTN-TERM",
  "L-ANILLO-CN|capacidad_gbps": "V-CAP-ANILLO-CN",
  "L-ANILLO-CN|canales_400g": "V-NREF-ANILLO-CN",
  "link_C-N|max_Gbit_s": "V-FMAX-ANILLO-CN",
  "link_C-N|n_min_400G": "V-NMIN-ANILLO-CN",
  "link_C-N|cap_ref_Gbit_s": "V-CAP-ANILLO-CN",
  "L-ANILLO-CN|km": "V-KM-ANILLO-CN",
  "L-ANILLO-NE|capacidad_gbps": "V-CAP-ANILLO-NE",
  "L-ANILLO-NE|canales_400g": "V-NREF-ANILLO-NE",
  "link_N-E|max_Gbit_s": "V-FMAX-ANILLO-NE",
  "link_N-E|n_min_400G": "V-NMIN-ANILLO-NE",
  "link_N-E|cap_ref_Gbit_s": "V-CAP-ANILLO-NE",
  "L-ANILLO-NE|km": "V-KM-ANILLO-NE",
  "L-ANILLO-ES|capacidad_gbps": "V-CAP-ANILLO-ES",
  "L-ANILLO-ES|canales_400g": "V-NREF-ANILLO-ES",
  "link_E-S|max_Gbit_s": "V-FMAX-ANILLO-ES",
  "link_E-S|n_min_400G": "V-NMIN-ANILLO-ES",
  "link_E-S|cap_ref_Gbit_s": "V-CAP-ANILLO-ES",
  "L-ANILLO-ES|km": "V-KM-ANILLO-ES",
  "L-ANILLO-SC|capacidad_gbps": "V-CAP-ANILLO-SC",
  "L-ANILLO-SC|canales_400g": "V-NREF-ANILLO-SC",
  "link_S-C|max_Gbit_s": "V-FMAX-ANILLO-SC",
  "link_S-C|n_min_400G": "V-NMIN-ANILLO-SC",
  "link_S-C|cap_ref_Gbit_s": "V-CAP-ANILLO-SC",
  "L-ANILLO-SC|km": "V-KM-ANILLO-SC",
  "L-CORE1-METC|capacidad_gbps": "V-CAP-CORE1-METC",
  "L-CORE1-METC|canales_400g": "V-NREF-CORE1-METC",
  "link_C-DC|max_Gbit_s": "V-FMAX-CORE1-METC",
  "link_C-DC|n_min_400G": "V-NMIN-CORE1-METC",
  "link_C-DC|cap_ref_Gbit_s": "V-CAP-CORE1-METC",
  "L-CORE1-METN|capacidad_gbps": "V-CAP-CORE1-METN",
  "L-CORE1-METN|canales_400g": "V-NREF-CORE1-METN",
  "link_N-DC|max_Gbit_s": "V-FMAX-CORE1-METN",
  "link_N-DC|n_min_400G": "V-NMIN-CORE1-METN",
  "link_N-DC|cap_ref_Gbit_s": "V-CAP-CORE1-METN",
  "L-CORE2-METN|capacidad_gbps": "V-CAP-CORE2-METN",
  "L-CORE2-METN|canales_400g": "V-NREF-CORE2-METN",
  "link_N-DN|max_Gbit_s": "V-FMAX-CORE2-METN",
  "link_N-DN|n_min_400G": "V-NMIN-CORE2-METN",
  "link_N-DN|cap_ref_Gbit_s": "V-CAP-CORE2-METN",
  "L-CORE2-METE|capacidad_gbps": "V-CAP-CORE2-METE",
  "L-CORE2-METE|canales_400g": "V-NREF-CORE2-METE",
  "link_E-DN|max_Gbit_s": "V-FMAX-CORE2-METE",
  "link_E-DN|n_min_400G": "V-NMIN-CORE2-METE",
  "link_E-DN|cap_ref_Gbit_s": "V-CAP-CORE2-METE",
  "L-CORE3-METS|capacidad_gbps": "V-CAP-CORE3-METS",
  "L-CORE3-METS|canales_400g": "V-NREF-CORE3-METS",
  "link_S-DS|max_Gbit_s": "V-FMAX-CORE3-METS",
  "link_S-DS|n_min_400G": "V-NMIN-CORE3-METS",
  "link_S-DS|cap_ref_Gbit_s": "V-CAP-CORE3-METS",
  "L-CORE3-METC|capacidad_gbps": "V-CAP-CORE3-METC",
  "L-CORE3-METC|canales_400g": "V-NREF-CORE3-METC",
  "link_C-DS|max_Gbit_s": "V-FMAX-CORE3-METC",
  "link_C-DS|n_min_400G": "V-NMIN-CORE3-METC",
  "link_C-DS|cap_ref_Gbit_s": "V-CAP-CORE3-METC",
  "DC_agg|valor": "V-DCAGG",
  "L-AGGMADRID-METC|capacidad_gbps": "V-CAPAGG-MADRID",
  "L-AGGALCOBENDAS-METN|capacidad_gbps": "V-CAPAGG-ALCOBENDAS",
  "L-AGGTRESCANTOS-METN|capacidad_gbps": "V-CAPAGG-TRESCANTOS",
  "L-AGGTALAMANCA-METN|capacidad_gbps": "V-CAPAGG-TALAMANCA",
  "L-AGGTORREJON-METE|capacidad_gbps": "V-CAPAGG-TORREJON",
  "L-AGGALCALA-METE|capacidad_gbps": "V-CAPAGG-ALCALA",
  "L-AGGLOSSANTOS-METE|capacidad_gbps": "V-CAPAGG-LOSSANTOS",
  "L-AGGGETAFE-METS|capacidad_gbps": "V-CAPAGG-GETAFE",
  "L-AGGLEGANES-METS|capacidad_gbps": "V-CAPAGG-LEGANES",
  "L-AGGFUENLABRADA-METS|capacidad_gbps": "V-CAPAGG-FUENLABRADA",
  "L-AGGALCORCON-METS|capacidad_gbps": "V-CAPAGG-ALCORCON",
  "L-AGGBATRES-METS|capacidad_gbps": "V-CAPAGG-BATRES",
  "EDGE-CENTRO|capacidad_gbps": "V-EDGE-C",
  "L-CORE1-IXIMS|capacidad_gbps": "V-SIM-CORE1-IXIMS",
  "L-CORE2-IXIMS|capacidad_gbps": "V-SIM-CORE2-IXIMS",
  "L-CORE3-IXIMS|capacidad_gbps": "V-SIM-CORE3-IXIMS",
  "L-CORE1-IXINTERNET|capacidad_gbps": "V-SIM-CORE1-IXINTERNET",
  "L-CORE2-IXINTERNET|capacidad_gbps": "V-SIM-CORE2-IXINTERNET",
  "L-CORE3-IXINTERNET|capacidad_gbps": "V-SIM-CORE3-IXINTERNET",
  "L-IXONEWEB-CORE1|capacidad_gbps": "V-SIM-IXONEWEB-CORE1"
 },
 "cobertura": {
  "total": 293,
  "trazado": 112,
  "hueco": 178,
  "discrepa": 3,
  "pct_trazado": 38.2,
  "pct_hueco": 60.8,
  "pct_discrepa": 1.0,
  "alcance": "valores que aparecen en la memoria v7 (campo memoria)",
  "por_ambito": {
   "analisis": {
    "total": 3,
    "trazado": 1,
    "hueco": 2,
    "discrepa": 0,
    "pct_trazado": 33.3,
    "pct_hueco": 66.7,
    "pct_discrepa": 0.0
   },
   "core": {
    "total": 20,
    "trazado": 1,
    "hueco": 19,
    "discrepa": 0,
    "pct_trazado": 5.0,
    "pct_hueco": 95.0,
    "pct_discrepa": 0.0
   },
   "demanda": {
    "total": 26,
    "trazado": 0,
    "hueco": 26,
    "discrepa": 0,
    "pct_trazado": 0.0,
    "pct_hueco": 100.0,
    "pct_discrepa": 0.0
   },
   "especiales": {
    "total": 31,
    "trazado": 4,
    "hueco": 27,
    "discrepa": 0,
    "pct_trazado": 12.9,
    "pct_hueco": 87.1,
    "pct_discrepa": 0.0
   },
   "lineas": {
    "total": 19,
    "trazado": 8,
    "hueco": 9,
    "discrepa": 2,
    "pct_trazado": 42.1,
    "pct_hueco": 47.4,
    "pct_discrepa": 10.5
   },
   "nodos": {
    "total": 4,
    "trazado": 0,
    "hueco": 4,
    "discrepa": 0,
    "pct_trazado": 0.0,
    "pct_hueco": 100.0,
    "pct_discrepa": 0.0
   },
   "poblacion": {
    "total": 55,
    "trazado": 55,
    "hueco": 0,
    "discrepa": 0,
    "pct_trazado": 100.0,
    "pct_hueco": 0.0,
    "pct_discrepa": 0.0
   },
   "pon": {
    "total": 11,
    "trazado": 3,
    "hueco": 8,
    "discrepa": 0,
    "pct_trazado": 27.3,
    "pct_hueco": 72.7,
    "pct_discrepa": 0.0
   },
   "radio": {
    "total": 42,
    "trazado": 7,
    "hueco": 35,
    "discrepa": 0,
    "pct_trazado": 16.7,
    "pct_hueco": 83.3,
    "pct_discrepa": 0.0
   },
   "trafico": {
    "total": 15,
    "trazado": 6,
    "hueco": 9,
    "discrepa": 0,
    "pct_trazado": 40.0,
    "pct_hueco": 60.0,
    "pct_discrepa": 0.0
   },
   "transporte": {
    "total": 58,
    "trazado": 22,
    "hueco": 36,
    "discrepa": 0,
    "pct_trazado": 37.9,
    "pct_hueco": 62.1,
    "pct_discrepa": 0.0
   },
   "voz": {
    "total": 9,
    "trazado": 5,
    "hueco": 3,
    "discrepa": 1,
    "pct_trazado": 55.6,
    "pct_hueco": 33.3,
    "pct_discrepa": 11.1
   }
  },
  "todos": {
   "total": 661,
   "trazado": 254,
   "hueco": 399,
   "discrepa": 8,
   "pct_trazado": 38.4,
   "pct_hueco": 60.4,
   "pct_discrepa": 1.2
  },
  "indice": {
   "total": 433,
   "trazado": 123,
   "hueco": 308,
   "discrepa": 2,
   "pct_trazado": 28.4,
   "pct_hueco": 71.1,
   "pct_discrepa": 0.5
  },
  "raices_hueco": [
   {
    "id": "V-SUP-L03",
    "bloquea": 120,
    "supuesto": "S-L03"
   },
   {
    "id": "V-SUP-L04",
    "bloquea": 88,
    "supuesto": "S-L04"
   },
   {
    "id": "V-FBH",
    "bloquea": 87,
    "supuesto": "S-L05"
   },
   {
    "id": "V-SPM",
    "bloquea": 80,
    "supuesto": "S-L07"
   },
   {
    "id": "V-LEMP",
    "bloquea": 60,
    "supuesto": "S-L02"
   },
   {
    "id": "V-SPF",
    "bloquea": 57,
    "supuesto": "S-L07"
   },
   {
    "id": "V-RIMS",
    "bloquea": 45,
    "supuesto": "S-L10"
   },
   {
    "id": "V-MIX-DL",
    "bloquea": 36,
    "supuesto": "S-L12"
   },
   {
    "id": "V-V2X-N",
    "bloquea": 36,
    "supuesto": "S-L13"
   },
   {
    "id": "V-V2X-CAB",
    "bloquea": 36,
    "supuesto": "S-L13"
   },
   {
    "id": "V-UP",
    "bloquea": 35,
    "supuesto": "S-L06"
   },
   {
    "id": "V-HOSP-DLB",
    "bloquea": 34,
    "supuesto": "S-L13"
   },
   {
    "id": "V-IND-DLB",
    "bloquea": 34,
    "supuesto": "S-L13"
   },
   {
    "id": "V-OVH",
    "bloquea": 31,
    "supuesto": "S-L11"
   },
   {
    "id": "V-PICO",
    "bloquea": 22,
    "supuesto": "S-L08"
   },
   {
    "id": "V-BW-N78",
    "bloquea": 16,
    "supuesto": "S-L14"
   },
   {
    "id": "V-TDD-N78-UL",
    "bloquea": 15,
    "supuesto": "S-L14"
   },
   {
    "id": "V-TDD-N78-DL",
    "bloquea": 12,
    "supuesto": "S-L14"
   },
   {
    "id": "V-MIX-UL",
    "bloquea": 6,
    "supuesto": "S-L12"
   },
   {
    "id": "V-IOT-PAR",
    "bloquea": 5,
    "supuesto": "S-L13"
   },
   {
    "id": "V-HOSP-ULB",
    "bloquea": 4,
    "supuesto": "S-L13"
   },
   {
    "id": "V-IND-ULB",
    "bloquea": 4,
    "supuesto": "S-L13"
   },
   {
    "id": "V-SIPP",
    "bloquea": 3,
    "supuesto": "S-L17"
   },
   {
    "id": "V-BW-N28",
    "bloquea": 3,
    "supuesto": "S-L14"
   },
   {
    "id": "V-TDD-N258-DL",
    "bloquea": 3,
    "supuesto": "S-L14"
   },
   {
    "id": "V-TDD-N258-UL",
    "bloquea": 3,
    "supuesto": "S-L14"
   },
   {
    "id": "V-HOSP-CAM",
    "bloquea": 1,
    "supuesto": "S-L13"
   },
   {
    "id": "V-NTN-TERM",
    "bloquea": 1,
    "supuesto": "S-L13"
   },
   {
    "id": "V-KM-ANILLO-CN",
    "bloquea": 1,
    "supuesto": "S-L18"
   },
   {
    "id": "V-KM-ANILLO-NE",
    "bloquea": 1,
    "supuesto": "S-L18"
   },
   {
    "id": "V-KM-ANILLO-ES",
    "bloquea": 1,
    "supuesto": "S-L18"
   },
   {
    "id": "V-KM-ANILLO-SC",
    "bloquea": 1,
    "supuesto": "S-L18"
   },
   {
    "id": "V-EDGE-C",
    "bloquea": 1,
    "supuesto": "S-L00"
   },
   {
    "id": "V-BNG-CHAS",
    "bloquea": 1,
    "supuesto": "S-L00"
   },
   {
    "id": "V-UPF-SRV",
    "bloquea": 1,
    "supuesto": "S-L00"
   },
   {
    "id": "V-EDGE-FLOTA",
    "bloquea": 1,
    "supuesto": "S-L00"
   },
   {
    "id": "V-ANA-UNODO",
    "bloquea": 1,
    "supuesto": "S-105"
   },
   {
    "id": "V-ANA-COMUN",
    "bloquea": 1,
    "supuesto": "S-103"
   }
  ]
 }
};
if (typeof window !== 'undefined') window.LINAJE = LINAJE;
if (typeof module !== 'undefined') module.exports = LINAJE;
