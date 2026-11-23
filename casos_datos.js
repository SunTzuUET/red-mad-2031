// casos_datos.js — casos guiados (PLAN_v2 §5.3) y casos del día a día (PLAN_v2 §6) de RED-MAD 2031.
// Navegador: window.CASOS · node: module.exports. Sin dependencias.
// Reglas: las cifras de resultado NO se escriben aquí; se leen del motor (CASOS.analizar). Lo que se cita de la
// memoria conjunta v7 (Entrega 2) lleva su sección en `ref`. Lo que no está en la v7 se marca (origen "supuesto"
// o "anterior") o se dice "no especificado en v7".
// `esperado` solo lo usa test_casos.js para comprobar que el motor produce el efecto que dice el texto.
var CASOS = (function () {
  "use strict";

  var REF = { trafico: "BH", evento: "E-EVENTO", fallos: [] };   // referencia de la Entrega 2 (matriz A11)
  var TRANSPORTE = { wdm: 1, mpls: 1, backhaul: 1 };              // enlaces que cuentan como "transporte"

  // Rangos de % servido para la predicción
  var RANGOS = [
    { id: "100", es: "100 % (no se pierde nada)", en: "100 % (nothing lost)", min: 99.995, max: Infinity },
    { id: "95", es: "95–100 %", en: "95–100 %", min: 95, max: 99.995 },
    { id: "80", es: "80–95 %", en: "80–95 %", min: 80, max: 95 },
    { id: "0", es: "menos del 80 %", en: "below 80 %", min: -Infinity, max: 80 }
  ];

  // ---------------------------------------------------------------- casos guiados (defensa)
  var guiados = [
    {
      id: "G1",
      titulo: { es: "Corte de fibra Centro–Norte con FRR", en: "Centre–North fibre cut with FRR" },
      planteamiento: {
        es: "Una obra corta el tramo C–N del anillo DWDM en la hora cargada con partido. Todo el tráfico que iba por C–N tiene que dar la vuelta por el otro arco del anillo.",
        en: "Civil works cut the C–N span of the DWDM ring at busy hour with a match on. All traffic that used C–N must go round the other arc of the ring."
      },
      pregunta: { es: "¿Se pierde tráfico? ¿Qué tramo del anillo acaba más cargado?", en: "Is any traffic lost? Which ring span ends up most loaded?" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["L-ANILLO-CN"] },
      opciones_enlace: ["L-ANILLO-NE", "L-ANILLO-ES", "L-ANILLO-SC", "L-CORE1-METC"],
      foco: [{ tipo: "enlace", id: "L-ANILLO-NE" }, { tipo: "enlace", id: "L-ANILLO-ES" }],
      proteccion: [
        { ref: "§6.4.2", es: "FRR con bypass local por el resto del anillo y detección BFD; objetivo de recuperación ≤50 ms.", en: "FRR with local bypass over the rest of the ring and BFD detection; recovery target ≤50 ms." },
        { ref: "§6.4.4", es: "20 túneles de bypass NHOP (Facility Backup): dos por tramo del anillo, rodeando los otros tres tramos.", en: "20 NHOP bypass tunnels (Facility Backup): two per ring span, going round the other three spans." },
        { ref: "A11.7", es: "Ejemplo de la memoria: N→E mantiene 88,86 Gbit/s y recibe 903,41 Gbit/s de N→C; total 992,27 Gbit/s; con 4×400G, ocupación 62,02 %.", en: "Worked example: N→E keeps 88.86 Gbit/s and receives 903.41 Gbit/s from N→C; total 992.27 Gbit/s; with 4×400G, 62.02 % occupancy." },
        { ref: "§7.1.1", es: "Criterio de PASS del corte de fibra: ningún enlace por encima del 90 %.", en: "PASS criterion for a fibre cut: no link above 90 %." }
      ],
      preguntas: [
        { es: "Comparad la ocupación de N–E con el 62,02 % de A11.7: ¿de dónde sale la diferencia (reparto en empates, sentido DL/UL)?", en: "Compare N–E occupancy with the 62.02 % of A11.7: where does the difference come from (tie splitting, DL/UL direction)?" },
        { es: "Si el tramo E–S es el más cargado y no el que cita la memoria, ¿qué tramo debería usarse para justificar el número de λ?", en: "If E–S is the most loaded span and not the one the report quotes, which span should justify the number of λ?" },
        { es: "El FRR no está probado (§7.6): ¿qué medida de laboratorio daría el PASS?", en: "FRR is not tested (§7.6): what lab measurement would give the PASS?" }
      ],
      esperado: { pct: [99.99, 100.01], top_en: ["L-ANILLO-ES", "L-ANILLO-NE"], top_oc: [0, 0.90], enlaces: { "L-ANILLO-NE": [0.60, 0.65] } }
    },
    {
      id: "G2",
      titulo: { es: "Caída de DC-Centro", en: "DC-Centre failure" },
      planteamiento: {
        es: "Cae entero el DC-Centro (5GC, IMS, BNG y UPF central). Los otros dos DC tienen que absorber su parte en la hora cargada con partido.",
        en: "DC-Centre fails completely (5GC, IMS, BNG and central UPF). The other two DCs must absorb its share at busy hour with a match on."
      },
      pregunta: { es: "¿Cuánto se sirve? ¿Qué acometida se carga más?", en: "How much is served? Which DC feed gets most loaded?" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["CORE-1"] },
      opciones_enlace: ["L-CORE2-METN", "L-ANILLO-SC", "L-CORE3-METS", "L-AGGMADRID-METC"],
      foco: [{ tipo: "enlace", id: "L-CORE2-METN" }, { tipo: "enlace", id: "L-CORE3-METC" }],
      proteccion: [
        { ref: "§2.7.2", es: "Reparto entre los tres DC: un tercio del tráfico hacia DC en normal y la mitad por DC superviviente si cae uno.", en: "Split between the three DCs: one third of DC-bound traffic in normal operation and half per surviving DC if one fails." },
        { ref: "§7.1.1", es: "Pérdida de un DC: los otros dos con 1/2 cada uno, ≤10 s, PASS si ocupación ≤90 %. Dos DC bastan para la capacidad completa.", en: "Loss of a DC: the other two with 1/2 each, ≤10 s, PASS if occupancy ≤90 %. Two DCs are enough for full capacity." },
        { ref: "§6.4.4", es: "Los LSP hacia los dos supervivientes se re-señalizan con la reserva de 1/2 por make-before-break.", en: "LSPs towards the two survivors are re-signalled with the 1/2 reservation via make-before-break." },
        { ref: "§6.10.1", es: "BNG: si cae DC-Centro, Centro pasa a DC-Sur por la acometida C–DC-Sur (77,29 % en su peor caso actual).", en: "BNG: if DC-Centre fails, Centre moves to DC-South over the C–DC-South feed (77.29 % in its current worst case)." }
      ],
      preguntas: [
        { es: "El motor reparte por igual entre los dos supervivientes. ¿Cumple la v7 la condición de §6.10.1 sobre el tráfico fijo de Centro?", en: "The engine splits evenly between the two survivors. Does v7 meet the §6.10.1 condition on Centre's fixed traffic?" },
        { es: "¿Qué pasa con las sesiones de abonado del BNG durante esos ≤10 s (FAL-05)?", en: "What happens to BNG subscriber sessions during those ≤10 s (FAL-05)?" },
        { es: "Si los tres DC comparten versión de software, ¿protege esto frente al fallo común que limita la disponibilidad (§7.1.1)?", en: "If all three DCs share software version, does this protect against the common failure that limits availability (§7.1.1)?" }
      ],
      esperado: { pct: [99.99, 100.01], top_en: ["L-CORE2-METN", "L-CORE3-METC"], top_oc: [0, 0.90] }
    },
    {
      id: "G3",
      titulo: { es: "Caída del nodo Metro-Centro", en: "Metro-Centre node failure" },
      planteamiento: {
        es: "Cae el router del nodo Metro-Centro. El anillo sigue cerrado por los otros tres nodos, pero la agregación de Madrid y los sitios colgados de Metro-Centro no tienen otra salida.",
        en: "The Metro-Centre node router fails. The ring stays closed through the other three nodes, but Madrid aggregation and the sites hanging off Metro-Centre have no other exit."
      },
      pregunta: { es: "¿Qué porcentaje de la demanda se sirve? ¿Es el peor fallo simple de la red?", en: "What share of demand is served? Is it the worst single failure in the network?" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["MET-CENTRO"] },
      opciones_enlace: null,
      foco: [{ tipo: "zona", id: "Z-MADRID" }, { tipo: "n1", id: "MET-CENTRO" }],
      proteccion: [
        { ref: "§7.1.2", es: "Pérdida de nodo Metro: se quitan el nodo y su demanda local. Demuestra la red superviviente, no la continuidad de la zona aislada.", en: "Loss of a Metro node: the node and its local demand are removed. It proves the surviving network, not continuity of the isolated zone." },
        { ref: "FAL-06", es: "El anillo sigue, pero la zona queda sin acceso: FAIL si no hay doble conexión (dual homing).", en: "The ring continues but the zone is left without access: FAIL if not dual-homed." },
        { ref: "§7.6", es: "Pendiente para la entrega final: cerrar el dual homing de los accesos críticos; la diversidad física no está comprobada.", en: "Pending for the final delivery: close dual homing of critical accesses; physical diversity is not checked." }
      ],
      preguntas: [
        { es: "¿Qué agregaciones habría que conectar a un segundo nodo Metro, y a cuál, para que este caso no sea un FAIL?", en: "Which aggregation nodes should be connected to a second Metro node, and to which one, so this case is not a FAIL?" },
        { es: "¿Cuánto costaría (puertos, fibra, λ) frente a lo que se pierde?", en: "What would it cost (ports, fibre, λ) compared with what is lost?" },
        { es: "¿Por qué el barrido N-1 lo pone el primero aunque ningún enlace se sature?", en: "Why does the N-1 sweep rank it first even though no link saturates?" }
      ],
      esperado: { pct: [0, 50], sin_ruta: true, n1_peor: "MET-CENTRO" }
    },
    {
      id: "G4",
      titulo: { es: "Caída de Edge-Centro durante el partido", en: "Edge-Centre failure during the match" },
      planteamiento: {
        es: "Cae el Edge-Centro (UPF local, MEC y caché del estadio) con el Metropolitano lleno. El respaldo es el Edge-Este, que no tiene capacidad para todo.",
        en: "Edge-Centre (local UPF, MEC and stadium cache) fails with the Metropolitano full. The backup is Edge-East, which cannot take everything."
      },
      pregunta: { es: "¿Qué parte del tráfico del estadio se sigue sirviendo? ¿Y del total de la red?", en: "What share of the stadium traffic is still served? And of the whole network?" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["EDGE-CENTRO"] },
      opciones_enlace: null,
      foco: [{ tipo: "servicio", patron: "^S-ESTADIO-", nombre: { es: "Estadio (prensa + ligero + vídeo)", en: "Stadium (press + light + video)" } }],
      proteccion: [
        { ref: "§6.3.1", es: "Con Edge-Centro caído, Edge-Este solo absorbe el 60 %. Prensa (QoD) y tráfico ligero entran enteros; el vídeo del público se queda con el resto, ≈47 % en DL (de 8 a ≈3,8 Mbit/s por usuario, aún 720p).", en: "With Edge-Centre down, Edge-East only absorbs 60 %. Press (QoD) and light traffic get in fully; audience video keeps the rest, ≈47 % in DL (8 to ≈3.8 Mbit/s per user, still 720p)." },
        { ref: "A6", es: "0,60 × 164,69 = 98,81 Gbit/s DL; ligero 39,69; vídeo 59,12 de 125 (47 %).", en: "0.60 × 164.69 = 98.81 Gbit/s DL; light 39.69; video 59.12 of 125 (47 %)." },
        { ref: "§7.1.1", es: "Pérdida de un Edge: Edge de respaldo en caliente, ≤5 s (estadio ≤60 s), latencia ≤10 ms.", en: "Loss of an Edge: hot-standby Edge, ≤5 s (stadium ≤60 s), latency ≤10 ms." },
        { ref: "§6.4.4", es: "El LSP de respaldo MEC Centro→Este (≈99 Gbit/s DL) solo se señaliza al activar el respaldo.", en: "The Centre→East MEC backup LSP (≈99 Gbit/s DL) is only signalled when the backup is activated." }
      ],
      preguntas: [
        { es: "El motor aplica el 60 % por igual a ligero y vídeo; la v7 reparte por prioridad. ¿Qué cambia en la experiencia del público?", en: "The engine applies 60 % equally to light and video traffic; v7 splits by priority. What changes for the audience?" },
        { es: "¿Por qué el estadio tolera ≤60 s y el resto de servicios ≤5 s?", en: "Why does the stadium tolerate ≤60 s while other services need ≤5 s?" },
        { es: "¿Compensa dimensionar Edge-Este para el 100 % del estadio un día de partido al año?", en: "Is it worth sizing Edge-East for 100 % of the stadium for match days?" }
      ],
      esperado: { pct: [95, 99.99], servicios: { "^S-ESTADIO-": [59, 61] } }
    },
    {
      id: "G5",
      titulo: { es: "Pico P2 (Internet ×2)", en: "P2 peak (Internet ×2)" },
      planteamiento: {
        es: "Pico de congestión P2: se duplica el Internet fijo y móvil, sin fallos. Es el escenario que fija la capacidad de las acometidas.",
        en: "P2 congestion peak: fixed and mobile Internet double, with no failures. It is the scenario that sets the DC feed capacity."
      },
      pregunta: { es: "¿Qué enlace llega más cerca del 90 %?", en: "Which link gets closest to 90 %?" },
      caso: { trafico: "P2", evento: "E-EVENTO", fallos: [] },
      opciones_enlace: ["L-CORE1-METC", "L-AGGMADRID-METC", "L-ANILLO-ES", "L-CORE2-METN"],
      foco: [{ tipo: "enlace", id: "L-CORE1-METC" }],
      proteccion: [
        { ref: "§6.4.4", es: "La acometida C–DC-Centro es la más cargada: 89,13 % en el pico P2, con 0,87 puntos de margen hasta el 90 %.", en: "The C–DC-Centre feed is the most loaded: 89.13 % at peak P2, 0.87 points of margin up to 90 %." },
        { ref: "§6.4.4", es: "Reserva limitada al 90 % del LAG en pico o fallo y al 70 % en normal (desequilibrio del hash por flujo).", en: "Reservation capped at 90 % of the LAG at peak or failure and 70 % in normal operation (per-flow hash imbalance)." },
        { ref: "FAL-04", es: "Pico P2 (confirmado por Dirección): ocupación ≤90 % y protección de los 5QI críticos; PM solo como sensibilidad; no se combina con fallo.", en: "Peak P2 (confirmed by Management): occupancy ≤90 % and protection of critical 5QIs; PM only as sensitivity; not combined with failure." }
      ],
      preguntas: [
        { es: "Con 0,87 puntos de margen, ¿qué crecimiento de tráfico tumba el criterio? ¿En qué año pasaría?", en: "With 0.87 points of margin, what traffic growth breaks the criterion? In which year?" },
        { es: "¿Por qué P2 carga la acometida C–DC-Centro y no un tramo del anillo?", en: "Why does P2 load the C–DC-Centre feed rather than a ring span?" },
        { es: "Cambiad a PM: ¿por qué la v7 lo deja solo como sensibilidad?", en: "Switch to PM: why does v7 keep it only as sensitivity?" }
      ],
      esperado: { pct: [99.99, 100.01], top_en: ["L-CORE1-METC"], top_oc: [0.88, 0.90] }
    },
    {
      id: "G6",
      titulo: { es: "Pico P2 + corte C–N a la vez", en: "P2 peak + C–N cut at the same time" },
      planteamiento: {
        es: "Coinciden el pico P2 y el corte del tramo C–N. La v7 dimensiona el pico y el fallo por separado: este caso queda fuera de la garantía base.",
        en: "Peak P2 and the C–N span cut coincide. v7 sizes peak and failure separately: this case is outside the base guarantee."
      },
      pregunta: { es: "¿Aguanta el anillo? ¿Qué tramo se satura?", en: "Does the ring hold? Which span saturates?" },
      caso: { trafico: "P2", evento: "E-EVENTO", fallos: ["L-ANILLO-CN"] },
      opciones_enlace: ["L-ANILLO-ES", "L-ANILLO-NE", "L-ANILLO-SC", "L-CORE1-METC"],
      foco: [{ tipo: "enlace", id: "L-ANILLO-ES" }],
      proteccion: [
        { ref: "§7.1.2", es: "En P2 más corte C–N, E–S llega a 2.174,45 Gbit/s de carga física modelada; con 4×400G la ocupación es 135,90 %. Fuera de la garantía base: hace falta ampliar si se exige simultaneidad.", en: "In P2 plus C–N cut, E–S reaches 2,174.45 Gbit/s of modelled physical load; with 4×400G occupancy is 135.90 %. Outside the base guarantee: expansion needed if simultaneity is required." },
        { ref: "§7.1.2", es: "Cubrir P2 con cualquiera de los cuatro cortes FRR exige 7/6/7/6 λ en lugar de 6/3/4/3.", en: "Covering P2 with any of the four FRR cuts requires 7/6/7/6 λ instead of 6/3/4/3." },
        { ref: "§7.6", es: "Decisión pendiente: si el anillo debe cubrir el pico a la vez que un corte.", en: "Pending decision: whether the ring must cover the peak at the same time as a cut." }
      ],
      preguntas: [
        { es: "¿Qué tráfico recorta el motor (best-effort) y cuál protege? ¿Coincide con la política de colas de la v7?", en: "Which traffic does the engine trim (best-effort) and which does it protect? Does it match the v7 queueing policy?" },
        { es: "¿Cuántas λ más cuesta 7/6/7/6 y con qué probabilidad coinciden pico y corte?", en: "How many more λ does 7/6/7/6 cost, and how likely are peak and cut to coincide?" }
      ],
      esperado: { pct: [0, 99.99], top_en: ["L-ANILLO-ES"], top_oc: [1.30, 1.45] }
    },
    {
      id: "G7",
      titulo: { es: "Pérdida de la acometida C–DC-Centro", en: "Loss of the C–DC-Centre feed" },
      planteamiento: {
        es: "Se corta la fibra entre Metro-Centro y DC-Centro. El DC sigue vivo, pero solo se llega a él por su otra acometida, en Metro-Norte.",
        en: "The fibre between Metro-Centre and DC-Centre is cut. The DC is still up, but it can only be reached through its other feed, at Metro-North."
      },
      pregunta: { es: "¿Qué enlace absorbe el desvío y cuánto se acerca al 90 %?", en: "Which link absorbs the detour and how close to 90 % does it get?" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["L-CORE1-METC"] },
      opciones_enlace: ["L-ANILLO-CN", "L-CORE1-METN", "L-ANILLO-SC", "L-CORE3-METC"],
      foco: [{ tipo: "enlace", id: "L-ANILLO-CN" }, { tipo: "enlace", id: "L-CORE1-METN" }],
      proteccion: [
        { ref: "§7.1.2", es: "Pérdida de una acometida de DC: se usan la otra acometida y las rutas más cortas.", en: "Loss of a DC feed: the other feed and the shortest routes are used." },
        { ref: "A11.4", es: "Fila \"C–DC feed\": el tramo C–N lleva 1.894,72 Gbit/s en su sentido más cargado.", en: "Row \"C–DC feed\": the C–N span carries 1,894.72 Gbit/s in its most loaded direction." },
        { ref: "§6.4.4", es: "Es el peor caso del tramo C–N: 78,95 % sobre 2.400 Gbit/s (LAG de 6 miembros).", en: "It is the worst case of the C–N span: 78.95 % of 2,400 Gbit/s (6-member LAG)." },
        { ref: "§6.4.4", es: "FRR de acometida: dos bypass por acometida que llegan al DC por su otro nodo Metro.", en: "Feed FRR: two bypasses per feed reaching the DC via its other Metro node." }
      ],
      preguntas: [
        { es: "¿Por qué el tramo C–N se lleva 6 λ y N–E solo 4?", en: "Why does the C–N span get 6 λ and N–E only 4?" },
        { es: "Si las dos acometidas de DC-Centro compartieran canalización, ¿qué caso sería? (ved el caso día a día 2)", en: "If both DC-Centre feeds shared a duct, which case would this become? (see day-to-day case 2)" }
      ],
      esperado: { pct: [99.99, 100.01], top_en: ["L-ANILLO-CN"], top_oc: [0.77, 0.82] }
    },
    {
      id: "G8",
      titulo: { es: "Alarma masiva en Valdebebas", en: "Mass alarm in Valdebebas" },
      planteamiento: {
        es: "Salta una alarma y el 10 % de los 95.000 sensores de Valdebebas (9.500 avisos) transmite en ≈1 s. Son mensajes muy pequeños.",
        en: "An alarm goes off and 10 % of the 95,000 Valdebebas sensors (9,500 reports) transmit in ≈1 s. The messages are very small."
      },
      pregunta: { es: "¿Se nota en el transporte? ¿Dónde está el cuello de botella?", en: "Is it visible in transport? Where is the bottleneck?" },
      caso: { trafico: "BH", evento: "E-ALARMA-VALDEBEBAS", fallos: [] },
      opciones_enlace: ["L-CORE1-METC", "L-AGGMADRID-METC", "L-CORE2-METN", "L-ANILLO-CN"],
      foco: [{ tipo: "enlace", id: "L-SITEVALDEBEBAS-METCENTRO" }, { tipo: "servicio", patron: "^S-VALDEBEBAS-SENSORES", nombre: { es: "Sensores Valdebebas", en: "Valdebebas sensors" } }],
      proteccion: [
        { ref: "§6.3.4", es: "10 % de 95.000 sensores (9.500 avisos) en ≈1 s, ≥99,9 % entregados en ≤10 s. Con control de acceso UAC y 4 recursos NPRACH: 99,99 % en 6,9 s; sin UAC solo pasa ≈10 %.", en: "10 % of 95,000 sensors (9,500 reports) in ≈1 s, ≥99.9 % delivered in ≤10 s. With UAC access control and 4 NPRACH resources: 99.99 % in 6.9 s; without UAC only ≈10 % gets through." },
        { ref: "A8", es: "192 preámbulos cada 40 ms; UAC deja ≈0,5 intentos por preámbulo; éxito e^(−0,5) = 61 %: 1.456 avisos/s; 9.500 / 1.456 = 6,5 s.", en: "192 preambles every 40 ms; UAC leaves ≈0.5 attempts per preamble; success e^(−0.5) = 61 %: 1,456 reports/s; 9,500 / 1,456 = 6.5 s." },
        { ref: "§2.6", es: "KPI: ≥99,9 % de 9.500 avisos en ≤10 s y ≤10 intentos.", en: "KPI: ≥99.9 % of 9,500 reports in ≤10 s and ≤10 attempts." }
      ],
      preguntas: [
        { es: "El motor es un grafo de capacidades: ¿por qué no puede ver el problema de acceso aleatorio?", en: "The engine is a capacity graph: why can't it see the random-access problem?" },
        { es: "¿Qué pasaría con los 9.500 avisos sin UAC, y qué otros servicios de la celda sufrirían?", en: "What would happen to the 9,500 reports without UAC, and which other services in the cell would suffer?" }
      ],
      esperado: { pct: [99.99, 100.01], igual_ref: true }
    },
    {
      id: "G9",
      titulo: { es: "Incidente en el Sur con satélite de emergencia", en: "South incident with emergency satellite" },
      planteamiento: {
        es: "Cae el nodo Metro-Sur y con él el acceso terrestre del hospital de Getafe. Se activan los terminales OneWeb hacia el hub de Arganda para los servicios prioritarios.",
        en: "Metro-South fails and with it the terrestrial access of Getafe hospital. OneWeb terminals towards the Arganda hub are activated for priority services."
      },
      pregunta: { es: "¿Qué se sirve en Getafe? ¿Llega el satélite a sustituir la fibra?", en: "What is served in Getafe? Can the satellite replace the fibre?" },
      caso: { trafico: "BH", evento: "E-INCIDENTE-NTN", fallos: ["MET-SUR", "L-SITEHOSPITALGETAFE-METSUR"] },
      opciones_enlace: null,
      foco: [{ tipo: "zona", id: "Z-GETAFE" }, { tipo: "servicio", patron: "^S-NTN-", nombre: { es: "Satélite de emergencia OneWeb", en: "OneWeb emergency satellite" } }, { tipo: "servicio", patron: "^S-HOSPITAL-", nombre: { es: "Hospital de Getafe", en: "Getafe hospital" } }],
      proteccion: [
        { ref: "§6.11", es: "OneWeb (órbita baja, hub en Arganda): ≥100/20 Mbit/s por terminal y conmutación en ≤60 s para servicios prioritarios (voz, telemetría del hospital sin el objetivo de 10 ms, gestión). No sustituye a la fibra ni sirve al público del estadio.", en: "OneWeb (low orbit, Arganda hub): ≥100/20 Mbit/s per terminal and switchover in ≤60 s for priority services (voice, hospital telemetry without the 10 ms target, management). It does not replace fibre or serve the stadium audience." },
        { ref: "§7.1.1", es: "Pérdida de la red terrestre en una sede: satélite OneWeb, ≤60 s, solo servicios prioritarios.", en: "Loss of the terrestrial network at a site: OneWeb satellite, ≤60 s, priority services only." },
        { ref: "FAL-06", es: "Caída de Metro: el anillo sigue, la zona queda sin acceso; FAIL si no hay dual homing.", en: "Metro loss: the ring continues, the zone has no access; FAIL if not dual-homed." }
      ],
      nota: { es: "El incidente concreto (caída de Metro-Sur) lo elige el simulador (escenario E-INCIDENTE-NTN, supuesto); la v7 habla de pérdida de la red terrestre en una sede.", en: "The concrete incident (Metro-South failure) is chosen by the simulator (scenario E-INCIDENTE-NTN, assumption); v7 speaks of loss of the terrestrial network at a site." },
      preguntas: [
        { es: "El hospital pide 99,999 % y ≤10 ms (§4.2). ¿Qué parte de eso cumple el satélite?", en: "The hospital requires 99.999 % and ≤10 ms (§4.2). What part of that does the satellite meet?" },
        { es: "¿Sería más barato un segundo acceso de fibra del hospital a otro nodo Metro?", en: "Would a second fibre access from the hospital to another Metro node be cheaper?" }
      ],
      esperado: { pct: [0, 95], sin_ruta: true, zonas: { "Z-GETAFE": [0, 5] }, servicios: { "^S-NTN-": [99, 101], "^S-HOSPITAL-": [0, 1] } }
    }
  ];

  // ---------------------------------------------------------------- día a día (PLAN_v2 §6)
  // simulable: "si" | "parcial" (se simula una aproximación, dicha) | "no_modelado" (parcial, el motor no lo admite) | "explicado"
  var diario = [
    {
      id: "D01", n: 1, simulable: "si",
      titulo: { es: "Corte de fibra por obra en el tramo E–S", en: "Fibre cut by civil works on the E–S span" },
      sintomas: {
        cliente: { es: "Normalmente nada: un corte de ≤50 ms no se nota en navegación ni vídeo.", en: "Normally nothing: a ≤50 ms cut is not noticed in browsing or video." },
        noc: { es: "Alarma de pérdida de señal en el tramo, FRR activado, subida de carga en el arco contrario.", en: "Loss-of-signal alarm on the span, FRR triggered, load rise on the opposite arc." }
      },
      causa: { es: "Una retroexcavadora corta el cable del tramo Metro-Este – Metro-Sur.", en: "An excavator cuts the cable on the Metro-East – Metro-South span." },
      proteccion: [
        { ref: "§6.4.2", es: "FRR con bypass por el resto del anillo y detección BFD, objetivo ≤50 ms.", en: "FRR with bypass over the rest of the ring and BFD detection, target ≤50 ms." },
        { ref: "§7.1.1", es: "PASS si ningún enlace supera el 90 %.", en: "PASS if no link exceeds 90 %." }
      ],
      operacion: [
        { ref: "§7.2", es: "Incidente correlado automáticamente; servicio restablecido (MTTR) ≤15 min gracias al FRR.", en: "Incident correlated automatically; service restored (MTTR) ≤15 min thanks to FRR." },
        { ref: "§7.2.1", es: "Reparación física ≤4 h en urbano (supuesto de la v7).", en: "Physical repair ≤4 h in urban areas (v7 assumption)." }
      ],
      preguntas: [
        { es: "Mientras dura la reparación, la red está sin protección en ese arco: ¿qué haríais si cae otro tramo?", en: "While the repair lasts, the network is unprotected on that arc: what would you do if another span fails?" }
      ],
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["L-ANILLO-ES"] },
      opciones_enlace: ["L-ANILLO-CN", "L-ANILLO-NE", "L-ANILLO-SC", "L-CORE1-METC"],
      foco: [{ tipo: "enlace", id: "L-ANILLO-CN" }],
      esperado: { pct: [99.99, 100.01], top_oc: [0, 0.90] }
    },
    {
      id: "D02", n: 2, simulable: "si",
      titulo: { es: "Dos acometidas \"redundantes\" en la misma canalización (SRLG)", en: "Two \"redundant\" feeds in the same duct (SRLG)" },
      sintomas: {
        cliente: { es: "Si el resto de la red aguanta, nada; si no, cortes amplios a la vez.", en: "If the rest of the network holds, nothing; otherwise wide simultaneous outages." },
        noc: { es: "Dos alarmas de enlace en el mismo segundo: las dos acometidas de DC-Centro caen juntas y el DC queda aislado del transporte.", en: "Two link alarms in the same second: both DC-Centre feeds go down together and the DC is cut off from transport." }
      },
      causa: { es: "Hipótesis: las acometidas C–DC-Centro y N–DC-Centro comparten un tramo de canalización. En los datos tienen SRLG distintos; la diversidad física no está comprobada.", en: "Hypothesis: the C–DC-Centre and N–DC-Centre feeds share a duct section. In the data they have different SRLGs; physical diversity is not checked." },
      srlg: ["L-CORE1-METC", "L-CORE1-METN"],
      proteccion: [
        { ref: "§6.4.4", es: "Un SRLG por tramo y uno por acometida (10 en total); se ha comprobado que ningún secundario comparte SRLG con su primario.", en: "One SRLG per span and one per feed (10 in total); it has been checked that no secondary shares an SRLG with its primary." },
        { ref: "§7.6", es: "La diversidad física de fibras y acometidas no está comprobada.", en: "Physical diversity of fibres and feeds is not checked." },
        { ref: "§7.1.2", es: "No se declara N−2.", en: "N−2 is not declared." }
      ],
      operacion: [
        { es: "Equivale a perder el DC: los otros dos absorben la mitad cada uno. Pedir al propietario de la obra civil el trazado real de las dos canalizaciones.", en: "Equivalent to losing the DC: the other two absorb half each. Ask the civil-works owner for the real route of both ducts." }
      ],
      preguntas: [
        { es: "¿Cómo comprobaríais que dos fibras con SRLG distinto no comparten de verdad un puente o un registro?", en: "How would you check that two fibres with different SRLGs really do not share a bridge or a manhole?" },
        { es: "Comparad con la caída de DC-Centro (G2): ¿hay alguna diferencia para el cliente?", en: "Compare with the DC-Centre failure (G2): is there any difference for the customer?" }
      ],
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["L-CORE1-METC", "L-CORE1-METN"] },
      opciones_enlace: ["L-CORE2-METN", "L-ANILLO-CN", "L-CORE1-METN", "L-ANILLO-SC"],
      foco: [{ tipo: "enlace", id: "L-CORE2-METN" }, { tipo: "enlace", id: "L-CORE3-METC" }],
      esperado: { pct: [99.99, 100.01], top_en: ["L-CORE2-METN", "L-CORE3-METC"] }
    },
    {
      id: "D03", n: 3, simulable: "si",
      titulo: { es: "Ventana de mantenimiento a las 3:00: se retira DC-Centro para actualizarlo", en: "Maintenance window at 3:00: DC-Centre withdrawn for upgrade" },
      sintomas: {
        cliente: { es: "Nada si la migración de sesiones funciona.", en: "Nothing if session migration works." },
        noc: { es: "Fallo planificado: alarmas suprimidas por la ventana, tráfico migrado a DC-Norte y DC-Sur.", en: "Planned failure: alarms suppressed by the window, traffic migrated to DC-North and DC-South." }
      },
      causa: { es: "Actualización de software de un DC; se hace de uno en uno.", en: "Software upgrade of one DC; done one at a time." },
      proteccion: [
        { ref: "§7.1.1", es: "Se mitiga el fallo común de software actualizando un DC cada vez, con vuelta atrás en ≤10 min.", en: "Common software failure is mitigated by upgrading one DC at a time, with rollback in ≤10 min." },
        { ref: "§2.7.2", es: "Si cae un DC, la mitad a cada superviviente.", en: "If a DC fails, half to each survivor." }
      ],
      operacion: [
        { es: "Hacerlo en hora valle. Comparad la ocupación máxima de este caso con la caída de DC-Centro en hora cargada (G2).", en: "Do it at off-peak hours. Compare this case's maximum occupancy with the DC-Centre failure at busy hour (G2)." }
      ],
      nota: { es: "La hora valle usa el modelo de hora cargada no coincidente (NC), que es un supuesto del simulador: la v7 no da perfiles horarios.", en: "Off-peak uses the non-coincident busy-hour model (NC), a simulator assumption: v7 gives no hourly profiles." },
      preguntas: [
        { es: "¿Por qué no basta con que la hora sea valle si el elemento retirado fuera Metro-Centro?", en: "Why would off-peak not be enough if the element withdrawn were Metro-Centre?" }
      ],
      caso: { trafico: "NC", hora: 3, evento: "ninguno", fallos: ["CORE-1"] },
      opciones_enlace: ["L-CORE2-METN", "L-ANILLO-CN", "L-AGGMADRID-METC", "L-CORE1-METC"],
      foco: [{ tipo: "enlace", id: "L-CORE2-METN" }],
      esperado: { pct: [99.99, 100.01], top_oc: [0, 0.20] }
    },
    {
      id: "D04", n: 4, simulable: "parcial",
      titulo: { es: "Corte eléctrico en un DC: pierde parte de su capacidad", en: "Power cut in a DC: it loses part of its capacity" },
      sintomas: {
        cliente: { es: "Lentitud o cortes en una parte de los abonados atendidos por ese DC.", en: "Slowness or outages for part of the subscribers served by that DC." },
        noc: { es: "Alarmas de energía y de servidores caídos en un DC; el DC sigue respondiendo.", en: "Power and server-down alarms in one DC; the DC still responds." }
      },
      causa: { es: "Falla una línea de alimentación y parte de los equipos se apaga.", en: "A power feed fails and part of the equipment shuts down." },
      proteccion: [
        { ref: "§7.1.1", es: "Tres DC activo-activo; dos bastan para la capacidad completa (disponibilidad de cada DC 99,98 %, supuesto).", en: "Three active-active DCs; two are enough for full capacity (availability of each DC 99.98 %, assumption)." },
        { es: "Pérdida parcial de capacidad de un DC: no especificado en v7.", en: "Partial capacity loss in a DC: not specified in v7." }
      ],
      operacion: [
        { es: "Decidir si se vacía el DC (pasar a 1/2 en los otros dos) o se sigue con capacidad reducida.", en: "Decide whether to drain the DC (go to 1/2 on the other two) or keep running with reduced capacity." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el motor no permite reducir la capacidad de un nodo. El botón simula la cota superior (DC entero caído), que es lo que haría operación si decide vaciarlo.", en: "PARTIAL — NOT MODELLED: the engine cannot reduce a node's capacity. The button simulates the upper bound (whole DC down), which is what operations would do if it decides to drain it." },
      preguntas: [
        { es: "¿Es mejor para el cliente un DC al 50 % o vaciarlo del todo?", en: "Is a DC at 50 % or a fully drained one better for the customer?" }
      ],
      boton: { es: "Simular cota: DC-Sur entero", en: "Simulate bound: whole DC-South" },
      caso: { trafico: "BH", evento: "E-EVENTO", fallos: ["CORE-3"] },
      opciones_enlace: ["L-CORE1-METC", "L-CORE2-METN", "L-ANILLO-SC", "L-AGGALCORCON-METS"],
      foco: [],
      esperado: { pct: [99.99, 100.01], top_oc: [0, 0.90] }
    },
    {
      id: "D05", n: 5, simulable: "no_modelado",
      titulo: { es: "Degradación óptica (BER alta): el enlace baja de capacidad o parpadea", en: "Optical degradation (high BER): the link loses capacity or flaps" },
      sintomas: {
        cliente: { es: "Pérdidas y retransmisiones intermitentes, difíciles de reproducir.", en: "Intermittent losses and retransmissions, hard to reproduce." },
        noc: { es: "Errores FEC/BER crecientes en una λ; miembros del LAG que entran y salen.", en: "Rising FEC/BER errors on one λ; LAG members flapping." }
      },
      causa: { es: "Conector sucio, curvatura o envejecimiento de un transpondedor.", en: "Dirty connector, bend or transponder ageing." },
      proteccion: [
        { ref: "§6.4.4", es: "Fallo de una λ o transpondedor: el LAG sigue con N−1 miembros y se actualiza el ancho de banda TE; min-links = N−1: si fallan dos miembros, el LAG cae y actúa el FRR de todo el tramo.", en: "Failure of one λ or transponder: the LAG continues with N−1 members and TE bandwidth is updated; min-links = N−1: if two members fail, the LAG goes down and whole-span FRR acts." }
      ],
      operacion: [
        { es: "Sacar la λ degradada del LAG antes de que parpadee y abrir orden de limpieza o cambio.", en: "Remove the degraded λ from the LAG before it flaps and open a cleaning or replacement order." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el motor solo tumba enlaces enteros; no reduce capacidad ni modela parpadeo.", en: "PARTIAL — NOT MODELLED: the engine only takes whole links down; it does not reduce capacity or model flapping." },
      preguntas: [
        { es: "¿Por qué un enlace que parpadea puede ser peor que uno caído?", en: "Why can a flapping link be worse than a dead one?" }
      ]
    },
    {
      id: "D06", n: 6, simulable: "no_modelado",
      titulo: { es: "Partido + concierto el mismo día en zonas cercanas", en: "Match + concert the same day in nearby areas" },
      sintomas: {
        cliente: { es: "Congestión radio y de Edge en las dos zonas a la vez.", en: "Radio and Edge congestion in both areas at once." },
        noc: { es: "Dos picos de carga en el mismo Edge y en los mismos tramos.", en: "Two load peaks on the same Edge and spans." }
      },
      causa: { es: "Dos eventos masivos coinciden.", en: "Two mass events coincide." },
      proteccion: [
        { ref: "§2.5", es: "La v7 solo dimensiona un evento (Metropolitano, 50.000 activos); IFEMA se retiró del catálogo. Un segundo evento simultáneo no está especificado en v7.", en: "v7 only sizes one event (Metropolitano, 50,000 active); IFEMA was withdrawn from the catalogue. A second simultaneous event is not specified in v7." }
      ],
      operacion: [
        { es: "Cuotas por slice y prioridades (§7.1.1, pico de tráfico): proteger servicios críticos y dejar que el vídeo se degrade.", en: "Per-slice quotas and priorities (§7.1.1, traffic peak): protect critical services and let video degrade." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el motor admite un solo evento por caso y la v7 no define el concierto.", en: "PARTIAL — NOT MODELLED: the engine allows one event per case and v7 does not define the concert." },
      preguntas: [
        { es: "¿Qué datos necesitaríais del segundo recinto para añadirlo al modelo?", en: "What data would you need from the second venue to add it to the model?" }
      ]
    },
    {
      id: "D07", n: 7, simulable: "no_modelado",
      titulo: { es: "Caída del peering/IX principal", en: "Main peering/IX failure" },
      sintomas: {
        cliente: { es: "Sin Internet o Internet lento; la voz entre abonados propios sigue.", en: "No Internet or slow Internet; voice between own subscribers continues." },
        noc: { es: "Sesiones BGP caídas en los routers frontera; tráfico desviado a tránsito.", en: "BGP sessions down on border routers; traffic shifted to transit." }
      },
      causa: { es: "Caída del punto neutro o del enlace hacia él.", en: "Failure of the exchange point or the link to it." },
      proteccion: [
        { ref: "§5.1.1", es: "Routers frontera para peering BGP y tránsito; punto neutro (p. ej. Espanix).", en: "Border routers for BGP peering and transit; exchange point (e.g. Espanix)." },
        { ref: "§6.13", es: "Un único punto de salida por tipo de interconexión, protegido.", en: "A single, protected exit point per interconnection type." },
        { es: "Capacidad y redundancia del peering: no especificado en v7.", en: "Peering capacity and redundancy: not specified in v7." }
      ],
      operacion: [
        { es: "Desviar a tránsito y vigilar la ocupación de los enlaces de salida.", en: "Shift to transit and watch exit link occupancy." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el motor termina la demanda de Internet en los DC y no carga los enlaces DC–IX; tumbar el IX no cambia nada en el modelo.", en: "PARTIAL — NOT MODELLED: the engine ends Internet demand at the DCs and does not load DC–IX links; taking the IX down changes nothing in the model." },
      preguntas: [
        { es: "¿Cuánto tráfico debería ir por peering y cuánto por tránsito? ¿Lo dice algún documento?", en: "How much traffic should go via peering and how much via transit? Does any document say?" }
      ]
    },
    {
      id: "D08", n: 8, simulable: "no_modelado",
      titulo: { es: "Tráfico anómalo / DDoS hacia un cliente de empresa", en: "Anomalous traffic / DDoS towards an enterprise customer" },
      sintomas: {
        cliente: { es: "El cliente atacado se queda sin servicio; los vecinos pueden notar congestión.", en: "The attacked customer loses service; neighbours may notice congestion." },
        noc: { es: "Pico de tráfico entrante hacia un prefijo; alertas del SIEM.", en: "Inbound traffic spike towards one prefix; SIEM alerts." }
      },
      causa: { es: "Ataque volumétrico desde Internet.", en: "Volumetric attack from the Internet." },
      proteccion: [
        { ref: "§6.13", es: "Cortafuegos y anti-DDoS en N6; una instancia L2VPN por cliente.", en: "Firewalls and anti-DDoS on N6; one L2VPN instance per customer." },
        { ref: "§6.13", es: "Detección ≤60 s y contención ≤15 min (NWDAF y SIEM).", en: "Detection ≤60 s and containment ≤15 min (NWDAF and SIEM)." }
      ],
      operacion: [
        { ref: "§7.2", es: "Eventos de seguridad: SIEM alimentado por los dominios y la NWDAF.", en: "Security events: SIEM fed by the domains and NWDAF." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el caso del motor no admite añadir demanda extra a una zona, y la salida N6 no se carga.", en: "PARTIAL — NOT MODELLED: the engine case cannot add extra demand to one zone, and the N6 exit is not loaded." },
      preguntas: [
        { es: "¿Dónde conviene filtrar: en el IX, en N6 o en el acceso del cliente?", en: "Where is it best to filter: at the IX, at N6 or at the customer access?" }
      ]
    },
    {
      id: "D09", n: 9, simulable: "explicado",
      titulo: { es: "Tormenta de señalización tras un apagón", en: "Signalling storm after a blackout" },
      sintomas: {
        cliente: { es: "Al volver la luz, los terminales tardan en registrarse; llamadas que no salen.", en: "When power returns, devices take long to register; calls fail." },
        noc: { es: "Pico de registros en AMF/IMS y de sesiones en BNG; CPU alta en el control.", en: "Registration spike at AMF/IMS and session spike at BNG; high control-plane CPU." }
      },
      causa: { es: "Miles de ONT y terminales vuelven a la vez y se registran en el mismo minuto.", en: "Thousands of ONTs and devices come back at once and register in the same minute." },
      proteccion: [
        { ref: "A3", es: "Mensajes SIP: 18.284,29/s; tormenta de re-registro (+4·0,20N/300): 24.775,75/s.", en: "SIP messages: 18,284.29/s; re-registration storm (+4·0.20N/300): 24,775.75/s." },
        { ref: "§6.3.4", es: "Control de acceso UAC para ráfagas de acceso (alarma de Valdebebas).", en: "UAC access control for access bursts (Valdebebas alarm)." },
        { es: "Reconexión masiva de sesiones BNG: no especificado en v7.", en: "Mass BNG session reconnection: not specified in v7." }
      ],
      operacion: [
        { es: "Escalonar el retorno (UAC, temporizadores aleatorios) y vigilar la CPU del plano de control.", en: "Stagger the return (UAC, random timers) and watch control-plane CPU." }
      ],
      nota: { es: "EXPLICADO: es un problema de plano de control (mensajes por segundo), no de Gbit/s; un grafo de capacidades no lo captura.", en: "EXPLAINED: it is a control-plane problem (messages per second), not Gbit/s; a capacity graph does not capture it." },
      preguntas: [
        { es: "¿Qué pasa si el AMF rechaza registros: los terminales reintentan antes o después?", en: "What happens if the AMF rejects registrations: do devices retry sooner or later?" }
      ]
    },
    {
      id: "D10", n: 10, simulable: "explicado",
      titulo: { es: "Pérdida de sincronización (PTP/GNSS)", en: "Loss of synchronisation (PTP/GNSS)" },
      sintomas: {
        cliente: { es: "Caída de velocidad y cortes en zonas de celdas TDD.", en: "Speed drop and drops in TDD cell areas." },
        noc: { es: "Alarmas de fase y de reloj en los gNB; interferencia entre celdas.", en: "Phase and clock alarms on gNBs; inter-cell interference." }
      },
      causa: { es: "Se pierde la referencia GNSS y el reloj deriva más allá del margen de fase.", en: "The GNSS reference is lost and the clock drifts beyond the phase margin." },
      proteccion: [
        { ref: "§7.1.1", es: "Pérdida de GNSS: reloj de referencia en ≥2 DC y holdover; sin interrupción; fase ≤±1,5 µs.", en: "GNSS loss: reference clock in ≥2 DCs and holdover; no interruption; phase ≤±1.5 µs." },
        { ref: "§6.2.6", es: "Patrón TDD 70/30 en n78; si la sincronización con otros operadores impusiera DDDSU harían falta más sectores.", en: "70/30 TDD pattern in n78; if synchronisation with other operators imposed DDDSU, more sectors would be needed." }
      ],
      operacion: [
        { es: "Comprobar que el holdover aguanta hasta recuperar GNSS; si no, bloquear las celdas afectadas.", en: "Check holdover lasts until GNSS returns; otherwise lock the affected cells." }
      ],
      nota: { es: "EXPLICADO: la sincronización no es capacidad; el motor no la modela.", en: "EXPLAINED: synchronisation is not capacity; the engine does not model it." },
      preguntas: [
        { es: "¿Cuánto tiempo de holdover hace falta y quién lo especifica?", en: "How much holdover time is needed and who specifies it?" }
      ]
    },
    {
      id: "D11", n: 11, simulable: "explicado",
      titulo: { es: "Fallo de HSS/UDM: hay datos pero no voz ni registros", en: "HSS/UDM failure: data works but no voice or registrations" },
      sintomas: {
        cliente: { es: "Los que ya estaban conectados navegan; no se pueden hacer llamadas nuevas ni registrarse.", en: "Already-connected users browse; no new calls or registrations." },
        noc: { es: "Errores de autenticación y de registro IMS; el plano de usuario está sano.", en: "Authentication and IMS registration errors; the user plane is healthy." }
      },
      causa: { es: "Dependencia de servicio: sin la base de abonados no se autentica a nadie nuevo.", en: "Service dependency: without the subscriber database, nobody new can authenticate." },
      proteccion: [
        { ref: "§5.2", es: "HSS (IMS) y UDM (5GC) separados.", en: "HSS (IMS) and UDM (5GC) kept separate." },
        { ref: "A3", es: "HSS particionado / réplica: 1.690.486 / 3.042.874; UDM: 1.239.300 / 2.230.739.", en: "HSS partitioned / replica: 1,690,486 / 3,042,874; UDM: 1,239,300 / 2,230,739." },
        { ref: "§6.6.2", es: "La columna particionada incluye dimensionado para dos DC al 90 %; la réplica completa contiene toda la base con reserva.", en: "The partitioned column includes sizing for two DCs at 90 %; the full replica contains the whole base with reserve." }
      ],
      operacion: [
        { ref: "FAL-05", es: "En la prueba de pérdida de DC se mide también HSS/UDM.", en: "The DC loss test also measures HSS/UDM." }
      ],
      nota: { es: "EXPLICADO: es una dependencia de servicio, no de capacidad; el motor no la modela.", en: "EXPLAINED: it is a service dependency, not capacity; the engine does not model it." },
      preguntas: [
        { es: "¿Qué ventaja tiene separar HSS y UDM si falla uno de ellos?", en: "What is the advantage of separating HSS and UDM if one of them fails?" }
      ]
    },
    {
      id: "D12", n: 12, simulable: "si",
      titulo: { es: "Saturación del UPF de Edge-Centro en un evento", en: "Edge-Centre UPF saturation during an event" },
      sintomas: {
        cliente: { es: "En el estadio, vídeo que baja de calidad.", en: "In the stadium, video quality drops." },
        noc: { es: "Ocupación del Edge-Centro cerca del límite.", en: "Edge-Centre occupancy close to its limit." }
      },
      causa: { es: "Los servicios especiales (estadio, hospital, industria) crecen ×2,07 respecto a la base.", en: "Special services (stadium, hospital, industry) grow ×2.07 over the baseline." },
      proteccion: [
        { ref: "§6.7.3", es: "En respaldo, el tráfico va al Edge de reserva por el anillo y añade como mucho 0,49 ms.", en: "In backup, traffic goes to the standby Edge over the ring and adds at most 0.49 ms." },
        { ref: "§7.1.1", es: "Pico de tráfico: cuotas por slice, ARP y colas; servicios críticos +≤1 ms.", en: "Traffic peak: per-slice quotas, ARP and queues; critical services +≤1 ms." }
      ],
      operacion: [
        { es: "Vigilar la ocupación del Edge frente a los umbrales del 70 % y 90 % (§7.2) y preparar la ampliación.", en: "Watch Edge occupancy against the 70 % and 90 % thresholds (§7.2) and prepare expansion." }
      ],
      nota: { es: "El escenario de estrés ×2,07 sale de un documento anterior (3.2, §4.3 Tabla 7), no de la v7. La NIC del Edge cuenta N3 + N6 (DL + UL, como la v7 §6.7.5): con ×2,07 llega al 100 % y se recorta vídeo del estadio (~97 % servido). El motor no desborda el Edge hacia el DC.", en: "The ×2.07 stress scenario comes from an earlier document (3.2, §4.3 Table 7), not v7. The Edge NIC counts N3 + N6 (DL + UL, as in v7 §6.7.5): at ×2.07 it reaches 100 % and stadium video is trimmed (~97 % served). The engine does not overflow the Edge to the DC." },
      origen: "anterior",
      preguntas: [
        { es: "Si el Edge pasa del 90 %, ¿preferís recortar vídeo o sacar tráfico por el DC con más latencia?", en: "If the Edge exceeds 90 %, would you rather trim video or route traffic via the DC with more latency?" }
      ],
      caso: { trafico: "BH", evento: "E-EVENTO-ESTRES", fallos: [] },
      opciones_enlace: null,
      foco: [{ tipo: "nodo", id: "EDGE-CENTRO" }],
      esperado: { pct: [96, 99], nodos: { "EDGE-CENTRO": [1.3, 1.6] } }
    },
    {
      id: "D13", n: 13, simulable: "no_modelado",
      titulo: { es: "Error de configuración: ruta mal anunciada manda tráfico por el camino largo", en: "Misconfiguration: a wrongly advertised route sends traffic the long way" },
      sintomas: {
        cliente: { es: "Más latencia en algunos destinos; los servicios de baja latencia pueden incumplir.", en: "More latency to some destinations; low-latency services may miss their target." },
        noc: { es: "Cambio de rutas sin fallo físico; tramos que se cargan sin motivo aparente.", en: "Route changes without physical failure; spans loading up for no apparent reason." }
      },
      causa: { es: "Un cambio reciente anuncia mal un prefijo o un coste.", en: "A recent change mis-advertises a prefix or a metric." },
      proteccion: [
        { ref: "§7.2", es: "Acciones automáticas: compensación, FRR, conmutación de Edge y vuelta atrás de cambios recientes.", en: "Automatic actions: compensation, FRR, Edge switchover and rollback of recent changes." },
        { ref: "§7.2", es: "Inventario coherente con la red tras cada cambio; aprovisionamiento con plantillas declarativas.", en: "Inventory consistent with the network after each change; provisioning with declarative templates." }
      ],
      operacion: [
        { es: "Correlacionar la anomalía con el último cambio y deshacerlo.", en: "Correlate the anomaly with the last change and roll it back." }
      ],
      nota: { es: "PARCIAL — NO MODELADO: el motor enruta siempre por las rutas de la v7 (A11); no admite forzar una ruta errónea.", en: "PARTIAL — NOT MODELLED: the engine always routes along the v7 routes (A11); it cannot force a wrong route." },
      preguntas: [
        { es: "¿Qué servicio sería el primero en incumplir con una ruta más larga?", en: "Which service would be the first to miss its target with a longer route?" }
      ]
    },
    {
      id: "D14", n: 14, simulable: "si",
      titulo: { es: "Corte del satélite NTN mientras está activo como respaldo", en: "NTN satellite cut while active as backup" },
      sintomas: {
        cliente: { es: "En el hospital aislado se pierden también la voz y la telemetría de respaldo.", en: "At the isolated hospital, backup voice and telemetry are lost too." },
        noc: { es: "Sur aislado y, además, el acceso del satélite caído.", en: "South isolated and, in addition, the satellite access down." }
      },
      causa: { es: "Falla el hub o el enlace del satélite durante el incidente del Sur (doble fallo).", en: "The satellite hub or link fails during the South incident (double failure)." },
      proteccion: [
        { ref: "§6.11", es: "OneWeb para servicios prioritarios; pendiente para la entrega final: hoja del terminal, MODCOD y disponibilidad del enlace, y backhaul del hub de Arganda.", en: "OneWeb for priority services; pending for the final delivery: terminal datasheet, MODCOD and link availability, and Arganda hub backhaul." },
        { ref: "§7.1.2", es: "No se declara N−2.", en: "N−2 is not declared." }
      ],
      operacion: [
        { es: "Despachar unidades tácticas y priorizar la reparación de la fibra del hospital (≤2 h según §7.2.1, supuesto).", en: "Dispatch tactical units and prioritise repair of the hospital fibre (≤2 h per §7.2.1, assumption)." }
      ],
      nota: { es: "El acceso del satélite se modela como un enlace de 1 Gbit/s en Metro-Este (supuesto del simulador con documentos anteriores).", en: "The satellite access is modelled as a 1 Gbit/s link at Metro-East (simulator assumption from earlier documents)." },
      preguntas: [
        { es: "¿Tiene sentido un segundo hub o un segundo proveedor de satélite para un caso N−2?", en: "Does a second hub or satellite provider make sense for an N−2 case?" }
      ],
      caso: { trafico: "BH", evento: "E-INCIDENTE-NTN", fallos: ["MET-SUR", "L-SITEHOSPITALGETAFE-METSUR", "L-SITENTNARGANDA-METESTE"] },
      opciones_enlace: null,
      foco: [{ tipo: "servicio", patron: "^S-NTN-", nombre: { es: "Satélite de emergencia OneWeb", en: "OneWeb emergency satellite" } }, { tipo: "zona", id: "Z-GETAFE" }],
      esperado: { pct: [0, 95], sin_ruta: true, servicios: { "^S-NTN-": [0, 1] } }
    }
  ];

  // ---------------------------------------------------------------- análisis de un resultado del motor
  function num(x) { return typeof x === "number" && isFinite(x); }
  // Ocupación ofrecida (igual que NOC.ocupacion): max(ocupación servida, demanda ofrecida / capacidad)
  function ocupacion(e) {
    if (!e || !num(e.capacidad_gbps) || e.capacidad_gbps <= 0) return null;
    var of = num(e.demanda_gbps) ? e.demanda_gbps / e.capacidad_gbps : 0;
    return Math.max(e.ocupacion || 0, of);
  }
  function indice(RED) {
    var I = { enl: {}, nod: {} };
    (RED.enlaces || []).forEach(function (l) { I.enl[l.id] = l; });
    (RED.nodos || []).forEach(function (n) { I.nod[n.id] = n; });
    return I;
  }
  // Devuelve las cifras clave de un resultado: % servido, ranking de enlaces de transporte, demandas sin ruta,
  // servicios / zonas / nodos de foco. Todo leído del resultado; nada escrito a mano.
  function analizar(RED, r) {
    if (!r || !r.resumen) return null;
    var I = indice(RED), top = [];
    Object.keys(r.enlaces || {}).forEach(function (id) {
      var e = r.enlaces[id], l = I.enl[id];
      if (!l || !TRANSPORTE[l.tipo] || e.caido) return;
      var o = ocupacion(e);
      if (o != null) top.push({ id: id, oc: o, carga: e.carga_gbps, cap: e.capacidad_gbps });
    });
    top.sort(function (a, b) { return b.oc - a.oc || (a.id < b.id ? -1 : 1); });
    var sinRuta = 0, perdido = 0;
    (r.demandas || []).forEach(function (d) { if (d.estado === "caido") { sinRuta++; perdido += d.dl_gbps || 0; } });
    var graves = 0, avisos = 0;
    (r.resumen.alertas || []).forEach(function (a) { if (a.nivel === "grave") graves++; else if (a.nivel === "aviso") avisos++; });
    return { pct: r.resumen.pct_servida, dl: r.resumen.dl_total_gbps, servida: r.resumen.servida_gbps,
      top: top, sin_ruta: sinRuta, perdido_gbps: perdido, graves: graves, avisos: avisos,
      afectadas: r.resumen.demandas_afectadas };
  }
  // % servido de las demandas cuyo id casa con el patrón (servicios especiales)
  function servicio(r, patron) {
    var re = new RegExp(patron), dl = 0, sv = 0, n = 0;
    (r.demandas || []).forEach(function (d) { if (re.test(d.id)) { dl += d.dl_gbps || 0; sv += d.servida_gbps || 0; n++; } });
    return { n: n, dl: dl, servida: sv, pct: dl > 1e-9 ? sv / dl * 100 : (n ? 100 : null) };
  }
  function zona(r, id) { var z = r.zonas && r.zonas[id]; return z ? { dl: z.dl_gbps, servida: z.servida_gbps, pct: z.pct } : null; }
  function enlace(r, id) { var e = r.enlaces && r.enlaces[id]; return e ? { oc: ocupacion(e), carga: e.carga_gbps, cap: e.capacidad_gbps, caido: !!e.caido } : null; }
  function nodo(r, id) { var e = r.nodos && r.nodos[id]; return e ? { oc: ocupacion(e), carga: e.carga_gbps, cap: e.capacidad_gbps, caido: !!e.caido } : null; }
  function rango(pct) {
    for (var i = 0; i < RANGOS.length; i++) if (pct >= RANGOS[i].min && pct < RANGOS[i].max) return RANGOS[i].id;
    return RANGOS[RANGOS.length - 1].id;
  }
  // Opciones del motor equivalentes a las que construye app.js en LAB (año 2031, laborable)
  function opcionesMotor(caso, cargado) {
    var tr = { id: caso.trafico, anio: caso.anio || 2031, dia: caso.dia || "laborable" };
    if (!cargado && typeof caso.hora === "number") tr.hora = caso.hora;
    return { caso: { trafico: tr, evento: caso.evento || "ninguno", fallo: (caso.fallos || []).slice() } };
  }
  function todos() { return guiados.concat(diario); }
  function porId(id) { return todos().filter(function (c) { return c.id === id; })[0] || null; }

  return { version: "2026-11-19", REF: REF, TRANSPORTE: TRANSPORTE, RANGOS: RANGOS, guiados: guiados, diario: diario,
    analizar: analizar, servicio: servicio, zona: zona, enlace: enlace, nodo: nodo, ocupacion: ocupacion, rango: rango,
    opcionesMotor: opcionesMotor, todos: todos, porId: porId };
})();

if (typeof module !== "undefined" && module.exports) module.exports = CASOS; else window.CASOS = CASOS;
