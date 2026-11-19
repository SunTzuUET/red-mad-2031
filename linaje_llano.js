// linaje_llano.js — diccionario en lenguaje llano para la trazabilidad (Revisión 13, petición de David: "accesible para gente de fuera").
// Solo lee window.LINAJE (linaje_datos.js). No cambia datos: traduce ids (V-/FX-/F-/S-) a nombres que entiende alguien que no
// conoce la memoria, y agrupa fuentes, fórmulas, cifras y elementos de la red en familias para el mapa de procedencia.
// API: window.LINAJE_LLANO = { ESTADOS, FAM_FUENTE, FAM_FX, TEMAS, PARTES, FX, famFuente(fid), famFormula(fxid), tema(ambito),
//   parte(elemento), nombreValor(v) → {es,en}, nombreFuente(f) → {es,en}, modelo() → índices calculados (perezoso) }.
// Los textos son {es, en}; quien los pinta usa NOC.t.
(function () {
  "use strict";
  var L = window.LINAJE && Array.isArray(window.LINAJE.valores) ? window.LINAJE : null;
  function T(es, en) { return { es: es, en: en || es }; }

  // ------------------------------------------------------------------ estados (color + forma; nunca solo color)
  // oficial = la cadena llega a INE/CNMC/normas/clase/enunciado (estado "trazado"); sup = algún eslabón es un supuesto razonado
  // (hueco con supuesto S-L.. justificado); sinf = la cadena acaba en nuestra memoria sin fuente (S-L00 o sin supuesto); discrepa.
  var ESTADOS = [
    { k: "oficial", n: T("Con fuente", "Sourced"), f: T("Llega a una fuente oficial, una norma o material de clase.", "Reaches an official source, a standard or class material."), forma: "circulo", sev: "ok", cssv: "--ok" },
    { k: "sup", n: T("Supuesto razonado", "Reasoned assumption"), f: T("Usa una hipótesis del grupo, explicada pero sin fuente externa.", "Uses a team assumption, explained but without an external source."), forma: "triangulo", sev: "sup", cssv: "--sup" },
    { k: "sinf", n: T("Sin fuente aún", "No source yet"), f: T("Solo aparece en la memoria; falta la fuente.", "Only in the report; the source is missing."), forma: "rombo", sev: "min", cssv: "--min" },
    { k: "discrepa", n: T("No cuadra", "Mismatch"), f: T("Al recalcularla no da lo que pone la memoria.", "Recomputing it does not give the report's figure."), forma: "cruz", sev: "crit", cssv: "--crit" }
  ];

  // ------------------------------------------------------------------ fuentes → familias (columna 1)
  var FAM_FUENTE = [
    { k: "ine", n: T("INE", "INE (statistics)"), f: T("Instituto Nacional de Estadística: padrón, hogares y empresas.", "Spanish statistics office: census, households and companies."), ico: "ine" },
    { k: "cnmc", n: T("CNMC", "CNMC (regulator)"), f: T("Regulador de telecomunicaciones: líneas, cuotas y tráfico.", "Telecom regulator: lines, market shares and traffic."), ico: "cnmc" },
    { k: "boe", n: T("BOE · espectro", "BOE · spectrum"), f: T("Boletín Oficial del Estado: subasta de frecuencias.", "Official State Gazette: spectrum auction."), ico: "boe" },
    { k: "3gpp", n: T("3GPP / ETSI", "3GPP / ETSI"), f: T("Normas de la telefonía móvil 5G.", "5G mobile standards."), ico: "norma" },
    { k: "itu", n: T("UIT (ITU)", "ITU"), f: T("Unión Internacional de Telecomunicaciones.", "International Telecommunication Union."), ico: "norma" },
    { k: "ietf", n: T("IETF · protocolos", "IETF · protocols"), f: T("Normas de Internet (RFC): cabeceras IP, UDP, RTP.", "Internet standards (RFC): IP, UDP, RTP headers."), ico: "norma" },
    { k: "libros", n: T("Libros y artículos", "Books and papers"), f: T("Bibliografía técnica (colas, fiabilidad de fibra).", "Technical literature (queues, fibre reliability)."), ico: "libro" },
    { k: "enunciado", n: T("Enunciado", "Project brief"), f: T("Lo que pide el enunciado de la asignatura.", "What the course project brief asks for."), ico: "clase" },
    { k: "clase", n: T("Apuntes de clase", "Class notes"), f: T("Material y ejercicios de la asignatura ARCO.", "ARCO course material and exercises."), ico: "clase" },
    { k: "grupos", n: T("Otros subgrupos", "Other subgroups"), f: T("Cálculos de otros subgrupos del proyecto.", "Calculations by other project subgroups."), ico: "grupo" },
    { k: "decision", n: T("Decisión de diseño", "Design decision"), f: T("Elección del grupo o convención (p. ej. mes de 30 días).", "Team choice or convention (e.g. 30-day month)."), ico: "decision" },
    { k: "sup", n: T("Supuesto", "Assumption"), f: T("Hipótesis del grupo explicada en la memoria, sin fuente externa.", "Team assumption explained in the report, no external source."), ico: "sup" },
    { k: "sinf", n: T("Sin fuente aún", "No source yet"), f: T("La cadena se corta en nuestra memoria.", "The chain stops at our own report."), ico: "hueco" }
  ];
  function famFuente(fid) {
    var f = String(fid || "");
    if (/^F-INE/.test(f)) return "ine";
    if (/^F-CNMC/.test(f)) return "cnmc";
    if (/^F-BOE/.test(f)) return "boe";
    if (/^F-(3GPP|ETSI)/.test(f)) return "3gpp";
    if (/^F-ITU/.test(f)) return "itu";
    if (/^F-RFC/.test(f)) return "ietf";
    if (/^F-(BG|ARXIV|TO-)/.test(f)) return "libros";
    if (/^F-ENUNCIADO/.test(f)) return "enunciado";
    if (/^F-ARCO|^F-SCOM/.test(f)) return "clase";
    if (/^F-(G\d|3\d)/.test(f)) return "grupos";
    if (/^F-MEMORIA/.test(f)) return "sinf";
    var x = L && (L.fuentes || []).filter(function (q) { return q.id === f; })[0];
    if (x) return x.tipo === "norma" ? "3gpp" : x.tipo === "clase" ? "clase" : x.tipo === "grupo" ? "grupos" : x.tipo === "memoria" ? "sinf" : "libros";
    return "sinf";
  }
  // nombre corto de un documento (editor + título recortado al primer separador)
  function nombreFuente(f) {
    if (!f) return T("—");
    var tit = String(f.titulo || f.id).split(/[:·(]/)[0].trim();
    var ed = String(f.editor || "").split("·")[0].trim();
    if (/^F-BOE/.test(f.id)) return T("BOE · subasta 26 GHz", "BOE · 26 GHz auction");
    if (/^F-ENUNCIADO/.test(f.id)) return T("Enunciado del proyecto", "Project brief");
    if (/^F-MEMORIA/.test(f.id)) return T("Nuestra memoria", "Our report");
    if (/^F-ARCO/.test(f.id)) return T("ARCO · " + String(f.titulo || "").replace(/^ARCO · /, "").split(":")[0].replace(/^Ejercicio /, "ejercicio "), "ARCO · " + String(f.titulo || "").replace(/^ARCO · /, "").split(":")[0]);
    if (/^F-(G\d|3\d)/.test(f.id)) return T(ed || tit);
    return T(ed && tit.indexOf(ed) < 0 ? ed + " · " + tit : tit);
  }

  // ------------------------------------------------------------------ fórmulas en lenguaje llano + familias (columna 2)
  var FX = {
    "FX-001": [T("Tendencia del padrón", "Census trend"), T("recta que mejor encaja el padrón 2015–2025", "best-fit line through the 2015–2025 census")],
    "FX-002": [T("Población en 2031", "Population in 2031"), T("población 2025 + 6 años de tendencia", "2025 population + 6 years of trend")],
    "FX-003": [T("Suma", "Sum"), T("suma de las partes", "sum of the parts")],
    "FX-004": [T("Hogares", "Households"), T("habitantes ÷ personas por hogar", "inhabitants ÷ people per household")],
    "FX-005": [T("Peso de la zona", "Zone weight"), T("población de la zona ÷ población total", "zone population ÷ total population")],
    "FX-006": [T("Crece con la población", "Grows with population"), T("valor 2025 × crecimiento de la población", "2025 value × population growth")],
    "FX-007": [T("Líneas fijas del mercado", "Market fixed lines"), T("hogares × % con fijo + empresas × líneas por empresa", "households × % with landline + companies × lines per company")],
    "FX-008": [T("Clientes del operador", "Operator customers"), T("habitantes × líneas por habitante × cuota", "inhabitants × lines per inhabitant × market share")],
    "FX-009": [T("Uso en 2031", "Usage in 2031"), T("uso 2025 × (1 + crecimiento anual)⁶", "2025 usage × (1 + yearly growth)⁶")],
    "FX-010": [T("Tráfico en hora punta", "Busy-hour traffic"), T("líneas × GB al mes × peso de la hora punta ÷ segundos", "lines × GB per month × busy-hour share ÷ seconds")],
    "FX-011": [T("Margen de reserva", "Reserve margin"), T("valor × 1,25", "value × 1.25")],
    "FX-012": [T("Bajada y subida", "Down and up"), T("tráfico × % de bajada (o de subida)", "traffic × % downlink (or uplink)")],
    "FX-013": [T("Voz móvil", "Mobile voice"), T("líneas × erlangs × kbit/s × 2 sentidos", "lines × erlangs × kbit/s × 2 directions")],
    "FX-014": [T("Capacidad con holgura", "Capacity with headroom"), T("1,25 × tráfico ÷ ocupación máxima", "1.25 × traffic ÷ maximum load")],
    "FX-015": [T("Tráfico radio", "Radio traffic"), T("tráfico móvil × reparto + voz", "mobile traffic × split + voice")],
    "FX-016": [T("Internet por zona", "Internet per zone"), T("1,25 × tráfico total × peso de la zona", "1.25 × total traffic × zone weight")],
    "FX-017": [T("Voz fija por zona", "Fixed voice per zone"), T("voz fija × parte de la zona", "fixed voice × zone share")],
    "FX-018": [T("Producto o cociente", "Product or ratio"), T("multiplica o divide otras cifras", "multiplies or divides other figures")],
    "FX-019": [T("Capacidad de un sector", "Sector capacity"), T("MHz × bit/s por Hz × % del tiempo", "MHz × bit/s per Hz × % of time")],
    "FX-020": [T("Sectores necesarios", "Sectors needed"), T("capacidad pedida ÷ capacidad de un sector", "required capacity ÷ capacity of one sector")],
    "FX-021": [T("Puertos de fibra (PON)", "Fibre ports (PON)"), T("accesos ÷ 64 × 1,25 ÷ 0,70", "accesses ÷ 64 × 1.25 ÷ 0.70")],
    "FX-022": [T("Canales de 400G", "400G channels"), T("carga máxima ÷ (400 × ocupación)", "peak load ÷ (400 × load limit)")],
    "FX-023": [T("Carga de un enlace", "Link load"), T("tráfico que pasa, con un centro de datos caído", "traffic through it with one data centre down")],
    "FX-024": [T("Dimensionado de voz IMS", "IMS voice sizing"), T("llamadas a la vez = erlangs × líneas", "simultaneous calls = erlangs × lines")],
    "FX-025": [T("Mensajes de señalización", "Signalling messages"), T("12 por llamada + 4 por registro", "12 per call + 4 per registration")],
    "FX-026": [T("Flujo de dispositivos", "Device flow"), T("dispositivos × bytes × 8 × mensajes por segundo", "devices × bytes × 8 × messages per second")],
    "FX-027": [T("Enlace de la zona", "Zone link"), T("tráfico × 1,10 ÷ 0,70, en módulos de 100G", "traffic × 1.10 ÷ 0.70, in 100G modules")],
    "FX-028": [T("Reparto por municipio", "Split per municipality"), T("tráfico de la zona × peso del municipio", "zone traffic × municipality weight")],
    "FX-029": [T("Años de proyección", "Projection years"), T("(año del curso + horizonte) − año base", "(course year + horizon) − base year")],
    "FX-030": [T("Tasa de una llamada", "Bit rate of a call"), T("(voz + cabeceras) × 8 ÷ duración de trama", "(voice + headers) × 8 ÷ frame time")],
    "FX-031": [T("Sobrecoste del túnel", "Tunnel overhead"), T("(paquete + cabeceras del túnel) ÷ paquete", "(packet + tunnel headers) ÷ packet")],
    "FX-032": [T("Penetración y cuota", "Penetration and share"), T("líneas ÷ habitantes; líneas propias ÷ total", "lines ÷ inhabitants; own lines ÷ total")],
    "FX-033": [T("Crecimiento medio anual", "Average yearly growth"), T("(uso final ÷ uso inicial)^(1/años) − 1", "(final ÷ initial usage)^(1/years) − 1")],
    "FX-034": [T("Espectro del operador", "Operator spectrum"), T("banda ÷ concesiones × concesiones propias", "band ÷ licences × own licences")],
    "FX-035": [T("Retardo de un enlace", "Link delay"), T("km × 5 µs + transmisión + cola", "km × 5 µs + transmission + queue")],
    "FX-036": [T("Espera en cola", "Queueing wait"), T("espera según la carga (cola M/M/1)", "wait as a function of load (M/M/1)")],
    "FX-037": [T("Retardo del 95 %", "95th-percentile delay"), T("espera × ln(carga ÷ 0,05)", "wait × ln(load ÷ 0.05)")],
    "FX-038": [T("Cumplimiento de servicio", "Service compliance"), T("% de demandas dentro de su objetivo", "% of demands within target")],
    "FX-039": [T("Fallo de un tramo de fibra", "Fibre span failure"), T("cortes por km × tiempo de reparación", "cuts per km × repair time")],
    "FX-040": [T("Minutos sin servicio", "Minutes of outage"), T("Σ fallos × tráfico perdido × minutos al año", "Σ failures × traffic lost × minutes per year")],
    "FX-041": [T("Módulos de ampliación", "Upgrade modules"), T("(carga ÷ 0,85 − capacidad) ÷ módulo", "(load ÷ 0.85 − capacity) ÷ module")]
  };
  var FAM_FX = [
    { k: "directo", n: T("Dato directo", "Read directly"), f: T("Se copia de la fuente, sin cálculo.", "Copied from the source, no calculation."), fx: [] },
    { k: "proy", n: T("Proyección a 2031", "Projection to 2031"), f: T("Lleva datos de 2025 al año de diseño.", "Takes 2025 data to the design year."), fx: ["FX-001", "FX-002", "FX-006", "FX-009", "FX-029", "FX-033"] },
    { k: "clientes", n: T("Hogares y clientes", "Households and customers"), f: T("De habitantes a hogares, líneas y clientes.", "From inhabitants to households, lines and customers."), fx: ["FX-004", "FX-007", "FX-008", "FX-032"] },
    { k: "reparto", n: T("Repartos", "Splits"), f: T("Reparte un total por zona o por sentido.", "Splits a total by zone or direction."), fx: ["FX-005", "FX-012", "FX-016", "FX-017", "FX-028"] },
    { k: "hora", n: T("Tráfico en hora punta", "Busy-hour traffic"), f: T("Del consumo mensual a Gbit/s en la peor hora.", "From monthly usage to Gbit/s at the busiest hour."), fx: ["FX-010", "FX-015"] },
    { k: "margen", n: T("Margen de reserva", "Reserve margin"), f: T("Añade holgura para crecer y para fallos.", "Adds headroom for growth and failures."), fx: ["FX-011", "FX-014"] },
    { k: "voz", n: T("Voz y llamadas", "Voice and calls"), f: T("Llamadas a la vez, kbit/s y señalización.", "Simultaneous calls, kbit/s and signalling."), fx: ["FX-013", "FX-024", "FX-025", "FX-030"] },
    { k: "flujos", n: T("Flujos y cabeceras", "Flows and headers"), f: T("Bits por mensaje y coste de las cabeceras.", "Bits per message and header overhead."), fx: ["FX-026", "FX-031"] },
    { k: "radio", n: T("Antenas y espectro", "Antennas and spectrum"), f: T("Cuánto da un sector y cuántos hacen falta.", "What one sector carries and how many are needed."), fx: ["FX-019", "FX-020", "FX-034"] },
    { k: "pon", n: T("Puertos de fibra", "Fibre ports"), f: T("Puertos PON para los accesos de fibra.", "PON ports for the fibre accesses."), fx: ["FX-021"] },
    { k: "enlaces", n: T("Capacidad de enlaces", "Link capacity"), f: T("Carga de cada enlace y canales de 400G.", "Load of each link and 400G channels."), fx: ["FX-022", "FX-023", "FX-027", "FX-041"] },
    { k: "retardo", n: T("Retardo y colas", "Delay and queues"), f: T("Tiempo que tarda un paquete.", "How long a packet takes."), fx: ["FX-035", "FX-036", "FX-037", "FX-038"] },
    { k: "disp", n: T("Disponibilidad", "Availability"), f: T("Probabilidad de fallo y minutos sin servicio.", "Failure probability and minutes of outage."), fx: ["FX-039", "FX-040"] },
    { k: "aritm", n: T("Sumas y productos", "Sums and products"), f: T("Suma, multiplica o divide otras cifras.", "Adds, multiplies or divides other figures."), fx: ["FX-003", "FX-018"] }
  ];
  var FX_A_FAM = {};
  FAM_FX.forEach(function (g) { g.fx.forEach(function (x) { FX_A_FAM[x] = g.k; }); });
  function famFormula(fx) { return fx ? FX_A_FAM[fx] || "aritm" : "directo"; }

  // ------------------------------------------------------------------ temas de la memoria (columna 3)
  var TEMAS = [
    { k: "poblacion", n: T("Población", "Population"), f: T("Habitantes, hogares y empresas por municipio.", "Inhabitants, households and companies per municipality."), ico: "gente", amb: ["poblacion"] },
    { k: "clientes", n: T("Clientes", "Customers"), f: T("Líneas fijas y móviles del operador.", "Operator fixed and mobile lines."), ico: "embb", amb: ["lineas"] },
    { k: "trafico", n: T("Tráfico", "Traffic"), f: T("Consumo por línea y Gbit/s por zona.", "Usage per line and Gbit/s per zone."), ico: "mapa", amb: ["trafico", "demanda"] },
    { k: "voz", n: T("Voz", "Voice"), f: T("Llamadas móviles y fijas.", "Mobile and fixed calls."), ico: "voz", amb: ["voz"] },
    { k: "especiales", n: T("Servicios especiales", "Special services"), f: T("Estadio, hospital, coches conectados, IoT, satélite.", "Stadium, hospital, connected cars, IoT, satellite."), ico: "evento", amb: ["especiales"] },
    { k: "radio", n: T("Radio 5G", "5G radio"), f: T("Espectro, sectores y sitios de antenas.", "Spectrum, sectors and antenna sites."), ico: "n78", amb: ["radio"] },
    { k: "fijo", n: T("Acceso fijo (fibra)", "Fixed access (fibre)"), f: T("Fibra hasta casa: puertos y divisores.", "Fibre to the home: ports and splitters."), ico: "olt", amb: ["pon"] },
    { k: "transporte", n: T("Transporte", "Transport"), f: T("Anillo de fibra y enlaces troncales.", "Fibre ring and trunk links."), ico: "metro", amb: ["transporte"] },
    { k: "nucleo", n: T("Núcleo", "Core"), f: T("Centros de datos: BNG, UPF, IMS, Edge.", "Data centres: BNG, UPF, IMS, Edge."), ico: "dc", amb: ["core", "nodos"] },
    { k: "disp", n: T("Disponibilidad", "Availability"), f: T("Fallos, reparación y objetivos.", "Failures, repair and targets."), ico: "reloj", amb: ["analisis"] }
  ];
  var AMB_A_TEMA = {};
  TEMAS.forEach(function (x) { x.amb.forEach(function (a) { AMB_A_TEMA[a] = x.k; }); });
  function tema(amb) { return AMB_A_TEMA[amb] || "nucleo"; }

  // ------------------------------------------------------------------ partes de la red (columna 4) desde las claves de LINAJE.indice
  var PARTES = [
    { k: "zonas", n: T("Municipios", "Municipalities"), f: T("Demanda de cada municipio en el simulador.", "Demand of each municipality in the simulator."), ico: "mapa" },
    { k: "antenas", n: T("Antenas 5G", "5G antennas"), f: T("Sitios y sectores de radio.", "Radio sites and sectors."), ico: "sitio" },
    { k: "acceso", n: T("Enlaces municipio", "Town links"), f: T("Fibra de cada municipio a su nodo metro.", "Fibre from each municipality to its metro node."), ico: "agg" },
    { k: "anillo", n: T("Anillo y troncales", "Ring and trunks"), f: T("Anillo metropolitano y enlaces a los centros de datos.", "Metro ring and links to the data centres."), ico: "metro" },
    { k: "nucleo", n: T("Centros de datos", "Data centres"), f: T("BNG, UPF, IMS y Edge.", "BNG, UPF, IMS and Edge."), ico: "dc" },
    { k: "internet", n: T("Salida a Internet", "Internet exit"), f: T("Enlaces con Internet y con IMS.", "Links to the Internet and IMS."), ico: "ix" },
    { k: "satelite", n: T("Satélite", "Satellite"), f: T("Respaldo por satélite.", "Satellite backup."), ico: "ntn" },
    { k: "especiales", n: T("Servicios especiales", "Special services"), f: T("Estadio, hospital, V2X, IoT, empresas.", "Stadium, hospital, V2X, IoT, enterprise."), ico: "evento" },
    { k: "memoria", n: T("Solo en la memoria", "Report only"), f: T("Cifra de la memoria que el simulador no usa directamente.", "Report figure the simulator does not use directly."), ico: "documento" }
  ];
  function parte(el) {
    var e = String(el || "");
    if (/^Z-/.test(e)) return "zonas";
    if (/^R-|^n(28|78|258)$|^territorial$|^(CENTRO|NORTE|ESTE|SUR)$|^radio_/.test(e)) return "antenas";
    if (/^L-SAT-|^L-IXONEWEB/.test(e)) return "satelite";
    if (/^L-.*IX/.test(e)) return "internet";
    if (/^L-AGG/.test(e)) return "acceso";
    if (/^L-|^link_|^DC_agg/.test(e)) return "anillo";
    if (/^(BNG|UPF|IMS|EDGE|N_IMS|CORE-|DC-)/.test(e)) return "nucleo";
    if (/^S-|^(estadio|hospital|v2x|sensores|camaras|industria|especiales)/.test(e)) return "especiales";
    return null;
  }

  // ------------------------------------------------------------------ nombres llanos de las cifras
  var LUG = {
    MADRID: "Madrid", ALCOBENDAS: "Alcobendas", TRESCANTOS: "Tres Cantos", TALAMANCA: "Talamanca", TORREJON: "Torrejón", ALCALA: "Alcalá",
    LOSSANTOS: "Los Santos", GETAFE: "Getafe", LEGANES: "Leganés", FUENLABRADA: "Fuenlabrada", ALCORCON: "Alcorcón", BATRES: "Batres", ALC: "Alcorcón",
    ZC: T("zona Centro", "Centre zone"), ZN: T("zona Norte", "North zone"), ZE: T("zona Este", "East zone"), ZS: T("zona Sur", "South zone"),
    C: T("zona Centro", "Centre zone"), N: T("zona Norte", "North zone"), E: T("zona Este", "East zone"), S: T("zona Sur", "South zone"), TOT: T("total", "total")
  };
  var TRAMO = {
    "ANILLO-CN": T("anillo Centro–Norte", "ring Centre–North"), "ANILLO-NE": T("anillo Norte–Este", "ring North–East"),
    "ANILLO-ES": T("anillo Este–Sur", "ring East–South"), "ANILLO-SC": T("anillo Sur–Centro", "ring South–Centre"),
    "CORE1-METC": T("DC Centro–Metro Centro", "DC Centre–Metro Centre"), "CORE1-METN": T("DC Centro–Metro Norte", "DC Centre–Metro North"),
    "CORE2-METN": T("DC Norte–Metro Norte", "DC North–Metro North"), "CORE2-METE": T("DC Norte–Metro Este", "DC North–Metro East"),
    "CORE3-METS": T("DC Sur–Metro Sur", "DC South–Metro South"), "CORE3-METC": T("DC Sur–Metro Centro", "DC South–Metro Centre")
  };
  var BANDA = { N28: "n28 (700 MHz)", N78: "n78 (3,5 GHz)", N258: "n258 (26 GHz)" };
  // nombre base (sin lugar ni sentido)
  var BASE = {
    "26G-BANDA": T("Banda de 26 GHz", "26 GHz band"), "26G-NCONC": T("Concesiones a 26 GHz", "26 GHz licences"), "26G-TEF": T("Concesiones del operador", "Operator licences"),
    "TEF-26G": T("Espectro propio a 26 GHz", "Own 26 GHz spectrum"),
    "A111": T("Tráfico total", "Total traffic"), "AIMS": T("Llamadas a la vez (IMS)", "Simultaneous calls (IMS)"),
    "ALC-ACC": T("Accesos de fibra Alcorcón", "Fibre accesses Alcorcón"), "ALC-BH": T("Tráfico de fibra Alcorcón", "Fibre traffic Alcorcón"),
    "ANA-COMUN": T("Corte común al año", "Common outage per year"), "ANA-CORTES": T("Cortes de fibra por km", "Fibre cuts per km"),
    "ANA-MTTR": T("Tiempo de reparación", "Repair time"), "ANA-OBJ-NUCLEO": T("Objetivo de disponibilidad", "Availability target"),
    "ANA-PAQ": T("Tamaño de paquete", "Packet size"), "ANA-SER400": T("Envío de un paquete a 400G", "Packet send time at 400G"),
    "ANA-UFIB-ANILLOCN": T("Fallo de fibra Centro–Norte", "Fibre failure Centre–North"), "ANA-UNODO": T("Fallo de un nodo", "Node failure"),
    "ANO-BASE": T("Año de los datos", "Data year"), "B": T("Crecimiento anual de población", "Yearly population growth"),
    "BAF-ES25": T("Banda ancha fija en España", "Fixed broadband in Spain"), "BNG-CHAS": T("Chasis del BNG", "BNG chassis"),
    "BNG": T("Capacidad del BNG", "BNG capacity"), "BNG-SES": T("Sesiones del BNG", "BNG sessions"),
    "BW": T("Ancho de banda", "Bandwidth"), "CAMS": T("Cámaras de Valdebebas", "Valdebebas cameras"),
    "CAP": T("Capacidad", "Capacity"), "CAPAGG": T("Enlace del municipio", "Municipality link"),
    "CAPS-DC": T("Llamadas por segundo por DC", "Calls per second per DC"), "CAPS-O": T("Llamadas nuevas por segundo", "New calls per second"),
    "CAPS-T": T("Llamadas por segundo (total)", "Calls per second (total)"), "CDC": T("Patas de voz por DC", "Voice legs per DC"),
    "CH400": T("Capacidad por canal", "Capacity per channel"), "CHAS-ALC": T("Chasis de fibra Alcorcón", "Fibre chassis Alcorcón"),
    "CO": T("Centrales de fibra", "Fibre central offices"), "CSEC": T("Capacidad de un sector", "Sector capacity"),
    "CUOTA-IF": T("Cuota internet fijo", "Fixed internet share"), "CUOTA-IM": T("Cuota internet móvil", "Mobile internet share"),
    "CUOTA-TM": T("Cuota telefonía móvil", "Mobile telephony share"), "CUOTA-VF": T("Cuota voz fija", "Fixed voice share"),
    "CURSO": T("Año del curso", "Course year"), "DCAGG": T("Canales DC–agregación", "DC–aggregation channels"),
    "DIRCE-ES25": T("Empresas en España", "Companies in Spain"), "E25": T("Empresas 2025", "Companies 2025"), "E31": T("Empresas 2031", "Companies 2031"),
    "ECP25": T("Población 2025 (INE)", "Population 2025 (INE)"), "EDGE-C": T("Capacidad Edge Centro", "Edge Centre capacity"),
    "EDGE-FLOTA": T("Servidores Edge", "Edge servers"), "ERL": T("Voz por línea (erlangs)", "Voice per line (erlangs)"),
    "ESP": T("Servicios especiales", "Special services"), "EST-C": T("Capacidad del estadio", "Stadium capacity"),
    "EST": T("Tráfico del estadio", "Stadium traffic"), "EST-SEC": T("Sectores del estadio", "Stadium sectors"), "EST-SUMA": T("Suma del estadio", "Stadium sum"),
    "EVS-BITS": T("Bits por trama de voz", "Bits per voice frame"), "EXT": T("Llamadas fuera de la red", "Off-net calls"),
    "FBH": T("Peso de la hora punta", "Busy-hour share"), "FMAX": T("Carga máxima", "Peak load"),
    "G711-B": T("Bytes por paquete G.711", "Bytes per G.711 packet"), "GF": T("Crecimiento del uso fijo", "Fixed usage growth"),
    "GF-CAGR3": T("Crecimiento fijo (3 años)", "Fixed growth (3 years)"), "GF-CAGR4": T("Crecimiento fijo (4 años)", "Fixed growth (4 years)"),
    "GM": T("Crecimiento del uso móvil", "Mobile usage growth"), "GM-CAGR3": T("Crecimiento móvil (3 años)", "Mobile growth (3 years)"),
    "GM-CAGR4": T("Crecimiento móvil (4 años)", "Mobile growth (4 years)"), "GTPU": T("Cabecera del túnel GTP-U", "GTP-U tunnel header"),
    "GTPU-OPT": T("Campos opcionales GTP-U", "GTP-U optional fields"), "PDUSC": T("Cabecera de sesión PDU", "PDU session header"),
    "H25": T("Hogares 2025", "Households 2025"), "H31": T("Hogares 2031", "Households 2031"), "HAB-SITIO": T("Habitantes por sitio", "Inhabitants per site"),
    "HORIZ": T("Horizonte del proyecto", "Project horizon"), "HOSP-CAM": T("Cámaras del hospital", "Hospital cameras"),
    "HOSP-CRIT": T("Hospital crítico", "Critical hospital"), "HOSP": T("Tráfico del hospital", "Hospital traffic"), "HOSP-B": T("Hospital sin margen", "Hospital without margin"),
    "HSS-TOT": T("Registros HSS (total)", "HSS records (total)"), "HSS-DC": T("Registros HSS por DC", "HSS records per DC"),
    "IMS-IP-B": T("Bytes por paquete IMS", "Bytes per IMS packet"), "IMS-MEDIA": T("Tráfico de voz IMS", "IMS voice traffic"),
    "IND": T("Tráfico de industria", "Industry traffic"), "IND-B": T("Industria sin margen", "Industry without margin"),
    "INET": T("Internet", "Internet"), "IOT": T("Dispositivos IoT", "IoT devices"), "IOT-PAR": T("Parámetros IoT", "IoT parameters"),
    "IOT-SUMA": T("Total de dispositivos IoT", "Total IoT devices"), "IP": T("Tráfico IP total", "Total IP traffic"), "IPV4": T("Cabecera IPv4", "IPv4 header"),
    "KM": T("Longitud", "Length"), "KVONR": T("Factor de voz en transporte", "Voice factor in transport"), "KVONR-CALC": T("Factor de voz (calculado)", "Voice factor (computed)"),
    "L2VPN-PAR": T("Enlaces de empresa", "Enterprise links"), "LEGS": T("Patas de llamada", "Call legs"),
    "LEMP": T("Líneas por empresa", "Lines per company"), "LEMP-CALC": T("Líneas por empresa (calculado)", "Lines per company (computed)"),
    "LIN-F": T("Líneas fijas (serie)", "Fixed lines (series)"), "LIN-M": T("Líneas móviles (serie)", "Mobile lines (series)"),
    "LMK25": T("Líneas fijas del mercado 2025", "Market fixed lines 2025"), "LMK31": T("Líneas fijas del mercado 2031", "Market fixed lines 2031"),
    "LT-ALC": T("Tarjetas de fibra Alcorcón", "Fibre line cards Alcorcón"),
    "MAD-BAF": T("Banda ancha en Madrid", "Broadband in Madrid"), "MAD-BAF-MOV": T("Banda ancha del operador", "Operator broadband"),
    "MAD-CUOTA-IF": T("Cuota internet fijo Madrid", "Fixed internet share Madrid"), "MAD-CUOTA-VF": T("Cuota voz fija Madrid", "Fixed voice share Madrid"),
    "MAD-RATIO-IF": T("Accesos por habitante Madrid", "Accesses per inhabitant Madrid"),
    "MAD-TF": T("Líneas fijas en Madrid", "Fixed lines in Madrid"), "MAD-TF-MOV": T("Líneas fijas del operador", "Operator fixed lines"),
    "MES": T("Días por mes", "Days per month"), "MIX": T("Uso por espectador", "Usage per spectator"),
    "N3-OVH": T("Cabeceras en N3", "N3 headers"), "NAC-RATIO-IF": T("Accesos por habitante España", "Accesses per inhabitant Spain"),
    "NB25": T("Accesos de fibra 2025", "Fibre accesses 2025"), "NB31": T("Accesos de fibra 2031", "Fibre accesses 2031"),
    "ND25": T("Líneas de datos móviles 2025", "Mobile data lines 2025"), "ND31": T("Líneas de datos móviles 2031", "Mobile data lines 2031"),
    "NDC": T("Centros de datos activos", "Active data centres"), "NEMP": T("Tráfico de empresas", "Enterprise traffic"),
    "NF25": T("Líneas fijas 2025", "Fixed lines 2025"), "NF31": T("Líneas fijas 2031", "Fixed lines 2031"),
    "NIMS": T("Líneas de voz IMS", "IMS voice lines"), "NM25": T("Líneas móviles 2025", "Mobile lines 2025"), "NM31": T("Líneas móviles 2031", "Mobile lines 2031"),
    "NMIN": T("Canales mínimos", "Minimum channels"), "NMOV": T("Tráfico móvil", "Mobile traffic"), "NREF": T("Canales instalados", "Installed channels"),
    "NRES": T("Tráfico residencial", "Residential traffic"), "NTN": T("Tráfico por satélite", "Satellite traffic"), "NTN-TERM": T("Terminales de satélite", "Satellite terminals"),
    "NVF": T("Voz fija", "Fixed voice"), "NVONR": T("Voz móvil", "Mobile voice"), "OCUP": T("Ocupación", "Load"),
    "OVH": T("Cabecera de transporte", "Transport header"), "P25": T("Población 2025", "Population 2025"), "P31": T("Población 2031", "Population 2031"),
    "P31R": T("Población 2031", "Population 2031"), "PAD": T("Padrón 2015–2025", "Census 2015–2025"), "PPAD25": T("Padrón 2025", "Census 2025"),
    "PFIJO": T("Hogares con teléfono fijo", "Households with landline"), "PICO": T("Factor de pico", "Peak factor"),
    "POB-ES25": T("Población de España", "Population of Spain"), "POB-MAD25": T("Población Comunidad de Madrid", "Population Madrid region"),
    "PON-ALC": T("Puertos PON Alcorcón", "PON ports Alcorcón"), "PON-BH": T("Tráfico por puerto PON", "Traffic per PON port"), "PON-OCUP": T("Ocupación de un PON", "PON load"),
    "PRES": T("Peso residencial", "Residential share"), "QVONR": T("Voz móvil total", "Total mobile voice"), "QVONR-R": T("Voz móvil con reserva", "Mobile voice with margin"),
    "RATIO-IF": T("Accesos fijos por habitante", "Fixed accesses per inhabitant"), "RATIO-IM": T("Líneas de datos por habitante", "Data lines per inhabitant"),
    "RATIO-TM": T("Líneas móviles por habitante", "Mobile lines per inhabitant"),
    "RBH": T("Tráfico radio hora punta", "Radio busy-hour traffic"), "RCAP": T("Capacidad radio", "Radio capacity"), "RCAPZ": T("Capacidad radio", "Radio capacity"),
    "RPK": T("Tráfico radio en pico", "Radio peak traffic"), "RED-AF": T("Clientes de fibra", "Fibre customers"), "RED-AM": T("Clientes móviles", "Mobile customers"),
    "RED": T("Tráfico", "Traffic"), "RED-LD": T("Líneas de datos móviles", "Mobile data lines"), "RED-P31": T("Población 2031", "Population 2031"),
    "RES": T("Margen de reserva", "Reserve margin"), "RF": T("Tráfico fijo en hora punta", "Fixed busy-hour traffic"),
    "RIMS": T("kbit/s por llamada IMS", "kbit/s per IMS call"), "RIMS-CALC": T("kbit/s por llamada IMS (calc.)", "kbit/s per IMS call (comp.)"),
    "RM": T("Tráfico móvil en hora punta", "Mobile busy-hour traffic"), "RTP": T("Cabecera RTP", "RTP header"),
    "RVONR": T("kbit/s por llamada móvil", "kbit/s per mobile call"), "RVONR-CALC": T("kbit/s por llamada (calc.)", "kbit/s per call (comp.)"),
    "S": T("Personas por hogar", "People per household"), "SE": T("Eficiencia espectral", "Spectral efficiency"),
    "SEC": T("Sectores 5G", "5G sectors"), "SENS": T("Sensores de Valdebebas", "Valdebebas sensors"), "SENS-SIM": T("Sensores (simulador)", "Sensors (simulator)"),
    "SIP": T("Mensajes de señalización", "Signalling messages"), "SIP-TORM": T("Señalización en tormenta", "Signalling storm"), "SIPP": T("Parámetros de señalización", "Signalling parameters"),
    "SIT": T("Sitios de antenas", "Antenna sites"), "SPF": T("Reparto fijo bajada/subida", "Fixed down/up split"), "SPM": T("Reparto móvil bajada/subida", "Mobile down/up split"),
    "SPL-ALC": T("Divisores ópticos Alcorcón", "Optical splitters Alcorcón"), "SPLIT": T("Reparto óptico 1:64", "Optical split 1:64"),
    "SUP-L01": T("Años de proyección", "Projection years"), "SUP-L03": T("Datos nacionales aplicados a Madrid", "National data applied to Madrid"),
    "SUP-L04": T("Crecimiento constante", "Constant growth"), "TDD": T("Tiempo de bajada (TDD)", "Downlink time (TDD)"),
    "TF-NEG25": T("Líneas fijas en España", "Fixed lines in Spain"), "TLL": T("Duración de llamada", "Call duration"), "TRAMA": T("Duración de trama de voz", "Voice frame duration"),
    "TRF-F": T("Tráfico fijo anual (serie)", "Yearly fixed traffic (series)"), "TRF-M": T("Tráfico móvil anual (serie)", "Yearly mobile traffic (series)"),
    "UDM-TOT": T("Suscriptores UDM (total)", "UDM subscribers (total)"), "UDM-DC": T("Suscriptores UDM por DC", "UDM subscribers per DC"),
    "UDP": T("Cabecera UDP", "UDP header"), "UF25-CALC": T("Uso fijo por línea 2025", "Fixed usage per line 2025"), "UM25-CALC": T("Uso móvil por línea 2025", "Mobile usage per line 2025"),
    "UN": T("Ocupación máxima normal", "Max normal load"), "UP": T("Ocupación máxima en pico", "Max peak load"), "UNI-10G": T("Puerto de 10 Gbit/s", "10 Gbit/s port"),
    "UPF": T("Capacidad del UPF", "UPF capacity"), "UPF-SRV": T("Servidores UPF", "UPF servers"), "USR-EST": T("Espectadores del estadio", "Stadium spectators"),
    "V2X": T("Tráfico de coches conectados", "Connected-car traffic"), "V2X-B": T("Bytes por mensaje V2X", "Bytes per V2X message"),
    "V2X-CAB": T("Cabecera V2X", "V2X header"), "V2X-F": T("Mensajes V2X por segundo", "V2X messages per second"), "V2X-N": T("Coches conectados", "Connected cars"),
    "VF": T("Voz fija", "Fixed voice"), "VF25": T("Uso fijo por línea 2025", "Fixed usage per line 2025"), "VF31": T("Uso fijo por línea 2031", "Fixed usage per line 2031"),
    "VFRTP": T("Voz fija total", "Total fixed voice"), "VM25": T("Uso móvil por línea 2025", "Mobile usage per line 2025"), "VM31": T("Uso móvil por línea 2031", "Mobile usage per line 2031"),
    "VONR": T("Voz móvil", "Mobile voice"), "VONR-IP-B": T("Bytes por paquete de voz", "Bytes per voice packet"), "W": T("Peso de la zona", "Zone weight"),
    "XGS": T("Velocidad XGS-PON", "XGS-PON speed"),
    "S-ESTADIO-PRENSA": T("Estadio · prensa", "Stadium · press"), "S-ESTADIO-LIGERO": T("Estadio · público", "Stadium · crowd"), "S-ESTADIO-VIDEO": T("Estadio · vídeo", "Stadium · video"),
    "SIM-CORE1-IXIMS": T("Salida a IMS · DC Centro", "IMS exit · DC Centre"), "SIM-CORE2-IXIMS": T("Salida a IMS · DC Norte", "IMS exit · DC North"),
    "SIM-CORE3-IXIMS": T("Salida a IMS · DC Sur", "IMS exit · DC South"), "SIM-CORE1-IXINTERNET": T("Salida a Internet · DC Centro", "Internet exit · DC Centre"),
    "SIM-CORE2-IXINTERNET": T("Salida a Internet · DC Norte", "Internet exit · DC North"), "SIM-CORE3-IXINTERNET": T("Salida a Internet · DC Sur", "Internet exit · DC South"),
    "SIM-IXONEWEB-CORE1": T("Enlace satélite OneWeb", "OneWeb satellite link")
  };
  var DIR = { DL: T("bajada", "down"), UL: T("subida", "up"), DLB: T("bajada", "down"), ULB: T("subida", "up"), CDL: T("bajada", "down"), CUL: T("subida", "up") };
  function une(a, b, sep) { sep = sep || " · "; return T(a.es + sep + b.es, a.en + sep + b.en); }
  function lugar(x) { var l = LUG[x]; return typeof l === "string" ? T(l) : l; }
  function nombreBase(r) {
    if (BASE[r]) return BASE[r];
    var m;
    if ((m = /^IMP-L(\d\d)-(.+)$/.exec(r))) { var b = nombreBase(m[2]) || T(m[2]); return T(b.es + " (si cambia el supuesto)", b.en + " (if the assumption changes)"); }
    if ((m = /^(CAP|FMAX|NMIN|NREF|OCUP|KM)-(ANILLO-[A-Z]{2}|CORE\d-MET[A-Z])$/.exec(r)) && TRAMO[m[2]]) return une(BASE[m[1]], TRAMO[m[2]]);
    if ((m = /^(BW|SE|TDD|CSEC)-(N28|N78|N258)(?:-(DL|UL))?$/.exec(r))) { var x = une(BASE[m[1]], T(BANDA[m[2]])); return m[3] ? une(x, DIR[m[3]], " ") : x; }
    if ((m = /^(.+)-(DL|UL|DLB|ULB|CDL|CUL)$/.exec(r))) {
      var k = m[1] + (/B$/.test(m[2]) ? "-B" : /^C/.test(m[2]) ? "-C" : "");
      var bb = BASE[k] || BASE[m[1]];
      if (bb) return une(bb, DIR[m[2]], " · ");
    }
    if ((m = /^(.+)-(DL|UL)-(.+)$/.exec(r)) && BASE[m[1]]) return une(BASE[m[1]], DIR[m[2]], " · ");
    return null;
  }
  var CACHE_N = {};
  function nombreValor(v) {
    if (!v) return T("—");
    if (CACHE_N[v.id]) return CACHE_N[v.id];
    var r = String(v.id).replace(/^V-/, ""), n = nombreBase(r), m;
    if (!n && (m = /^(.+)-([A-Z]+)$/.exec(r)) && LUG[m[2]]) {
      var base = m[1], dir = null, mm;
      if ((mm = /^(.+)-(DL|UL)$/.exec(base)) && !BASE[base]) { base = mm[1]; dir = mm[2]; }
      var b = BASE[base] || nombreBase(base);
      if (b) { n = dir ? une(b, DIR[dir], " · ") : b; n = une(n, lugar(m[2])); }
    }
    if (!n && v.elemento) {
      var el = window.NOC && NOC.nombreCorto ? NOC.nombreCorto(v.elemento) : v.elemento;
      n = T(el + (v.campo && v.campo !== "valor" ? " · " + String(v.campo).replace(/_/g, " ") : ""));
    }
    n = n || T(r.replace(/-/g, " ").toLowerCase());
    CACHE_N[v.id] = n;
    return n;
  }

  // ------------------------------------------------------------------ modelo calculado (perezoso)
  var MOD = null;
  function modelo() {
    if (MOD || !L) return MOD;
    var V = {}, FU = {}, HIJOS = {};
    L.valores.forEach(function (v) { V[v.id] = v; });
    (L.fuentes || []).forEach(function (f) { FU[f.id] = f; });
    L.valores.forEach(function (v) { (v.entradas || []).forEach(function (e) { (HIJOS[e] = HIJOS[e] || []).push(v.id); }); });
    var ELEM = {};   // V-id → [elementos del índice]
    Object.keys(L.indice || {}).forEach(function (k) { var vid = L.indice[k]; (ELEM[vid] = ELEM[vid] || []).push(k.slice(0, k.lastIndexOf("|"))); });
    function estado(v) {
      if (!v) return "sinf";
      if (v.estado === "trazado") return "oficial";
      if (v.estado === "discrepa") return "discrepa";
      var r = v.huecos_raiz || [];
      if (!r.length) return "sinf";
      return r.some(function (x) { var q = V[x]; return !q || !q.supuesto || q.supuesto === "S-L00"; }) ? "sinf" : "sup";
    }
    // orígenes: familias de fuente y documentos concretos (con memo; ciclos cortados)
    var MEMO = {};
    function origenes(vid, pila) {
      if (MEMO[vid]) return MEMO[vid];
      var v = V[vid], out = { fam: {}, docs: {}, sups: {} };
      if (!v) return out;
      pila = pila || {};
      if (pila[vid]) return out;
      pila[vid] = 1;
      if (v.fuente) { out.fam[famFuente(v.fuente.id)] = 1; out.docs[v.fuente.id] = v.fuente.localizador || 1; }
      if (v.supuesto) {
        var k = v.supuesto === "S-L00" ? "sinf" : v.estado === "trazado" ? "decision" : "sup";
        out.fam[k] = 1; out.sups[v.supuesto] = vid;
      }
      if (!v.fuente && !v.supuesto && !(v.entradas || []).length && v.estado !== "trazado") out.fam.sinf = 1;
      (v.entradas || []).forEach(function (e) {
        var r = origenes(e, pila);
        Object.keys(r.fam).forEach(function (q) { out.fam[q] = 1; });
        Object.keys(r.docs).forEach(function (q) { if (!out.docs[q]) out.docs[q] = r.docs[q]; });
        Object.keys(r.sups).forEach(function (q) { if (!out.sups[q]) out.sups[q] = r.sups[q]; });
      });
      delete pila[vid];
      MEMO[vid] = out;
      return out;
    }
    // partes de la red que usan la cifra: elementos suyos y de todo lo que se calcula a partir de ella
    var MEMP = {};
    function partes(vid, pila) {
      if (MEMP[vid]) return MEMP[vid];
      var out = {};
      pila = pila || {};
      if (pila[vid]) return out;
      pila[vid] = 1;
      (ELEM[vid] || []).forEach(function (e) { var p = parte(e); if (p) out[p] = 1; });
      (HIJOS[vid] || []).forEach(function (h) { var r = partes(h, pila); Object.keys(r).forEach(function (q) { out[q] = 1; }); });
      delete pila[vid];
      MEMP[vid] = out;
      return out;
    }
    // cifras de la memoria de las que sale un valor (él mismo si está en la memoria)
    function enMemoria(vid, pila, out) {
      out = out || {};
      var v = V[vid];
      if (!v) return out;
      pila = pila || {};
      if (pila[vid]) return out;
      pila[vid] = 1;
      if (v.memoria) out[vid] = 1;
      else (v.entradas || []).forEach(function (e) { enMemoria(e, pila, out); });
      return out;
    }
    var mem = L.valores.filter(function (v) { return !!v.memoria; });
    var fila = {};
    mem.forEach(function (v) {
      var o = origenes(v.id), fams = Object.keys(o.fam);
      if (!fams.length) fams = ["sinf"];
      var ps = Object.keys(partes(v.id));
      if (!ps.length) ps = ["memoria"];
      fila[v.id] = { id: v.id, est: estado(v), c1: fams, c2: famFormula(v.formula), c3: tema(v.ambito), c4: ps };
    });
    MOD = { V: V, FU: FU, HIJOS: HIJOS, ELEM: ELEM, estado: estado, origenes: origenes, partes: partes, enMemoria: enMemoria, mem: mem, fila: fila };
    return MOD;
  }

  window.LINAJE_LLANO = {
    ESTADOS: ESTADOS, FAM_FUENTE: FAM_FUENTE, FAM_FX: FAM_FX, TEMAS: TEMAS, PARTES: PARTES, FX: FX,
    famFuente: famFuente, famFormula: famFormula, tema: tema, parte: parte,
    nombreValor: nombreValor, nombreFuente: nombreFuente,
    formula: function (id) { var x = FX[id]; return x ? { n: x[0], f: x[1] } : null; },
    modelo: modelo
  };
  if (typeof module !== "undefined" && module.exports) module.exports = window.LINAJE_LLANO;
})();
