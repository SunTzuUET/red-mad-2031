// importar.js — modelo de demanda propio desde CSV (CONTRATO_UI Revisión 8, PLAN_v3 §4). Núcleo sin DOM (node: require("./importar.js")).
// Cierra el ciclo con exportar.js: el grupo exporta, edita en Excel y vuelve a cargar. Lee el CSV del simulador
// (';', coma decimal, UTF-8 con BOM, CRLF; cabeceras en castellano o inglés) y devuelve un opciones.modelo_usuario para el motor.
//
//   Importar.leerCSV(texto, ctx)        -> {tabla, modelo_usuario, avisos, errores, cambios, filas}
//   Importar.leerArchivos([{nombre, texto}], ctx) -> lo mismo, combinando todos los archivos en un modelo
//   Importar.combinar(a, b)             -> modelo_usuario con b encima de a
//   Importar.plantillas(RED?)           -> [{nombre, texto}] CSV de ejemplo (cabecera + fila de muestra)
//   Importar.parsearCSV(texto) · Importar.numero(texto) · Importar.TABLAS
// ctx = {RED, nombre (archivo; es la fuente de la procedencia), referencia (resultado de Motor.calcular del caso exportado),
//        opciones (si no hay referencia: opciones del caso para calcularla con Motor), modelo (modelo previo sobre el que se suma),
//        id, nombre_modelo}
// Tablas aceptadas:
//   demandas.csv        id;padre;…;DL_Gbps;UL_Gbps;prioridad;… (la del exportador) o mínima id;DL_Gbps;UL_Gbps;prioridad;factor
//   zonas.csv           id;…;DL_Gbps;… o mínima id;DL_Gbps;factor
//   servicios.csv       id;…;DL_Gbps;UL_Gbps;prioridad;activo_por_defecto;… o mínima id;DL_Gbps;UL_Gbps;prioridad;activo_por_defecto;factor
//   servicios_tipo.csv  servicio;nombre;DL_Gbps;… o mínima servicio;DL_Gbps;factor
//   perfiles.csv        perfil;zona;h00;…;h23   (zona vacía o * = todas; perfil: nombre de perfil, clase, id de demanda o *)
//   parametros.csv      clave;valor  (id, nombre, anio, anio_base, ruido_sigma, ruido_semilla, movilidad_activa, movilidad_fraccion,
//                       crecimiento_<clase|*>, factor_<clave>, prioridad_<id>)
// Un DL editado se convierte en factor = nuevo / exportado (supuesto mod.importar_relativo); diferencias menores que el redondeo
// del CSV no cuentan. Columnas de solo lectura (servida, ruta, procedencia…) se aceptan y no se usan. Todo valor importado lleva
// procedencia {t: "usuario", f: "<archivo> fila N"} en modelo_usuario.proc.
(function (raiz) {
  "use strict";

  var CLASES = ["movil", "ftth", "voz", "urllc", "iot", "empresa", "evento", "ntn"];
  var INFO = ["procedencia", "provenance", "supuestos", "assumptions", "depende_de", "depends_on", "nota", "note", "notas", "notes"];
  // Columnas por tabla: canónica -> alias (es/en, en minúsculas). Las marcadas en EDIT se usan; el resto son informativas.
  var TABLAS = {
    demandas: { id: "id", cols: { id: ["id"], padre: ["padre", "parent"], zona: ["zona", "zone"], servicio: ["servicio", "service"],
      tipo: ["tipo", "type"], prioridad: ["prioridad", "priority"], origen: ["origen", "origin"], destino: ["destino", "destination"],
      dl: ["dl_gbps"], ul: ["ul_gbps"], servida: ["servida_gbps", "served_gbps"], servida_pct: ["servida_pct", "served_pct"],
      latencia: ["latencia_ms", "latency_ms"], latencia_max: ["latencia_max_ms", "max_latency_ms"], via: ["via", "path"],
      estado: ["estado", "status"], ruta: ["ruta", "route"], factor: ["factor"] }, edit: ["dl", "ul", "prioridad", "factor"] },
    zonas: { id: "id", cols: { id: ["id"], nombre: ["nombre", "name"], area: ["area_metro", "metro_area"],
      poblacion: ["poblacion_2031", "population_2031"], poblacion_2025: ["poblacion_2025", "population_2025"],
      hogares: ["hogares_2025", "households_2025"], hogar_medio: ["hogar_medio", "avg_household"], empresas: ["empresas_2025", "companies_2025"],
      abonados_fijos: ["abonados_fijos", "fixed_subscribers"], abonados_moviles: ["abonados_moviles", "mobile_subscribers"],
      lineas: ["lineas_datos_moviles", "mobile_data_lines"], agg: ["agregacion", "aggregation"], edge: ["edge"],
      dl: ["dl_gbps"], servida: ["servida_gbps", "served_gbps"], servida_pct: ["servida_pct", "served_pct"], fuente: ["fuente", "source"],
      factor: ["factor"] }, edit: ["dl", "factor"] },
    servicios: { id: "id", cols: { id: ["id"], nombre: ["nombre", "name"], tipo_servicio: ["tipo_servicio", "service_type"], zona: ["zona", "zone"],
      sitio: ["sitio", "site"], capa: ["capa", "layer"], perfil: ["perfil", "profile"], destino: ["destino", "destination"], slice: ["slice"],
      dl: ["dl_gbps"], ul: ["ul_gbps"], prioridad: ["prioridad", "priority"], arp: ["arp"], qi5: ["5qi"], latencia_max: ["latencia_max_ms", "max_latency_ms"],
      cap_acceso: ["capacidad_acceso_gbps", "access_capacity_gbps"], activo: ["activo_por_defecto", "active_by_default"], fuente: ["fuente", "source"],
      factor: ["factor"] }, edit: ["dl", "ul", "prioridad", "activo", "factor"] },
    servicios_tipo: { id: "servicio", cols: { servicio: ["servicio", "service"], nombre: ["nombre", "name"], dl: ["dl_gbps"], ul: ["ul_gbps"],
      servida: ["servida_gbps", "served_gbps"], servida_pct: ["servida_pct", "served_pct"], n: ["n_demandas", "n_demands"], factor: ["factor"] },
      edit: ["dl", "ul", "factor"] },
    perfiles: { id: "perfil", cols: { perfil: ["perfil", "profile"], zona: ["zona", "zone"] }, edit: [] },
    parametros: { id: "clave", cols: { clave: ["clave", "key"], valor: ["valor", "value"] }, edit: [] }
  };

  // ---------------------------------------------------------------- CSV
  function parsearCSV(txt) {
    txt = String(txt == null ? "" : txt);
    if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
    var sep = ";";
    var l0 = txt.split(/\r?\n/)[0] || "";
    if (l0.indexOf(";") < 0 && l0.indexOf("\t") >= 0) sep = "\t";
    var filas = [], f = [], c = "", q = false;
    for (var i = 0; i < txt.length; i++) {
      var ch = txt[i];
      if (q) {
        if (ch === '"') { if (txt[i + 1] === '"') { c += '"'; i++; } else q = false; }
        else c += ch;
      } else if (ch === '"' && c === "") q = true;
      else if (ch === sep) { f.push(c); c = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && txt[i + 1] === "\n") i++;
        f.push(c); filas.push(f); f = []; c = "";
      } else c += ch;
    }
    if (c !== "" || f.length) { f.push(c); filas.push(f); }
    return filas.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); });
  }
  // Número en formato ES (coma decimal) o con punto; "" -> null; inválido -> NaN. Devuelve también los decimales escritos.
  function numeroDet(s) {
    s = String(s == null ? "" : s).trim().replace(/^'(?=[=+\-@])/, "").replace(/−/g, "-").replace(/\s| /g, "");
    if (s === "") return { v: null, dec: 0 };
    var t = s;
    if (t.indexOf(",") >= 0 && t.indexOf(".") >= 0) t = t.replace(/\./g, "").replace(",", ".");
    else if (t.indexOf(",") >= 0) t = t.replace(",", ".");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) return { v: NaN, dec: 0 };
    var m = /\.(\d+)/.exec(t);
    return { v: Number(t), dec: m && !/[eE]/.test(t) ? m[1].length : (/[eE]/.test(t) ? 12 : 0) };
  }
  function numero(s) { return numeroDet(s).v; }
  function booleano(s) {
    s = String(s == null ? "" : s).trim().toLowerCase();
    if (s === "") return null;
    if (/^(s[ií]|si|yes|y|true|verdadero|1|x)$/.test(s)) return true;
    if (/^(no|n|false|falso|0)$/.test(s)) return false;
    return undefined;
  }
  function texto(s) { return String(s == null ? "" : s).trim().replace(/^'(?=[=+\-@])/, ""); }
  function fmtN(x) { return (Math.round(x * 1e6) / 1e6).toString().replace(".", ","); }

  // ---------------------------------------------------------------- detección de tabla
  var HORA_RE = /^h?(\d{1,2})(:00)?$/;
  function normCab(s) { return texto(s).toLowerCase(); }
  function detectar(cab, nombre, filas) {
    var has = function (l) { return l.some(function (x) { return cab.indexOf(x) >= 0; }); };
    var horas = cab.filter(function (c) { return HORA_RE.test(c); }).length;
    if (has(["perfil", "profile"]) && horas >= 1) return "perfiles";
    if (has(["clave", "key"]) && has(["valor", "value"])) {
      var pr = filas.some(function (f) { return /^(proyecto|project)$/i.test(texto(f[0])); });
      return pr ? "caso" : "parametros";
    }
    if (has(["servicio", "service"]) && cab.indexOf("id") < 0) return "servicios_tipo";
    if (cab.indexOf("id") >= 0) {
      if (has(["padre", "parent", "ruta", "route", "via", "path", "estado", "status"])) return "demandas";
      if (has(["area_metro", "metro_area", "poblacion_2031", "population_2031", "agregacion", "aggregation", "hogares_2025", "households_2025"])) return "zonas";
      if (has(["tipo_servicio", "service_type", "sitio", "site", "activo_por_defecto", "active_by_default", "arp", "5qi"])) return "servicios";
    }
    var n = String(nombre || "").toLowerCase().replace(/^.*[\\/]/, "");
    var porNombre = [["servicios_tipo", /servicios?_tipo|services?_type/], ["perfiles", /perfil|profile/], ["parametros", /param/],
      ["demandas", /demand/], ["zonas", /zona|zone/], ["servicios", /servic/]];
    for (var i = 0; i < porNombre.length; i++) if (porNombre[i][1].test(n)) return porNombre[i][0];
    if (cab.indexOf("id") >= 0 && filas.length) {
      var id0 = texto(filas[0][cab.indexOf("id")]);
      if (/\//.test(id0)) return "demandas";
      if (/^Z-/.test(id0)) return "zonas";
      if (/^S-/.test(id0)) return "servicios";
    }
    return null;
  }

  // ---------------------------------------------------------------- referencia (resultado del caso exportado)
  function motorDe() {
    if (raiz && raiz.Motor) return raiz.Motor;
    if (typeof require === "function") { try { return require("./motor.js"); } catch (e) { return null; } }
    return null;
  }
  function referenciaDe(ctx, avisos, archivo) {
    if (ctx._ref !== undefined) return ctx._ref;
    var R = ctx.referencia || ctx.resultado || null;
    if (!R && ctx.opciones && ctx.RED) {
      var M = ctx.Motor || motorDe();
      if (M) { var o = {}, k; for (k in ctx.opciones) if (k !== "modelo_usuario") o[k] = ctx.opciones[k]; o.acceso = false; R = M.calcular(ctx.RED, o); }
    }
    if (!R) avisos.push(av(archivo, null, null, "Sin resultado de referencia (ctx.referencia u ctx.opciones): el DL se compara con el valor de diseño de RED (hora cargada); "
      + "si el CSV es de otra hora o caso, los factores no serán 1 aunque no se haya editado nada."));
    ctx._ref = R;
    return R;
  }
  function av(archivo, fila, col, t, id) { return { archivo: archivo || "", fila: fila, columna: col || null, id: id || null, texto: t }; }

  // ---------------------------------------------------------------- lectura
  function leerCSV(txt, ctx) {
    ctx = ctx || {};
    var RED = ctx.RED || (raiz && raiz.RED) || {};
    var archivo = ctx.nombre || "CSV";
    var avisos = [], errores = [], cambios = [];
    var mu = { perfiles: {}, factores: {}, prioridades: {}, crecimiento: {}, proc: {} };
    var out = function (tabla) {
      return { tabla: tabla, modelo_usuario: limpiar(mu, ctx, archivo), avisos: avisos, errores: errores, cambios: cambios,
        filas: Math.max(0, filasT.length - 1), ok: !errores.length };
    };
    var filasT = parsearCSV(txt);
    if (!filasT.length) { errores.push(av(archivo, null, null, "Archivo vacío")); return out(null); }
    var cabOrig = filasT[0].map(texto), cab = cabOrig.map(normCab), datos = filasT.slice(1);
    var tabla = ctx.tabla || detectar(cab, archivo, datos);
    if (!tabla) { errores.push(av(archivo, 1, null, "No se reconoce la tabla (cabecera: " + cabOrig.join(";") + "). Use una de las plantillas: demandas, zonas, servicios, servicios_tipo, perfiles o parametros.")); return out(null); }
    if (tabla === "caso") { avisos.push(av(archivo, null, null, "caso.csv es informativo (datos del caso exportado): no se importa")); return out(tabla); }
    var T = TABLAS[tabla];
    // Columnas: canónica por índice; desconocidas -> error
    var idx = {}, vistos = {};
    cab.forEach(function (c, j) {
      if (c === "") return;
      var canon = null;
      Object.keys(T.cols).forEach(function (k) { if (T.cols[k].indexOf(c) >= 0) canon = k; });
      if (!canon && tabla === "perfiles" && HORA_RE.test(c)) {
        var h = Number(HORA_RE.exec(c)[1]);
        if (h > 23) { errores.push(av(archivo, 1, cabOrig[j], "Columna de hora fuera de rango: «" + cabOrig[j] + "» (h00…h23)")); return; }
        canon = "h" + h;
      }
      if (!canon && INFO.indexOf(c) >= 0) canon = "_info" + j;
      if (!canon) { errores.push(av(archivo, 1, cabOrig[j], "Columna desconocida en " + tabla + ".csv: «" + cabOrig[j] + "»")); return; }
      if (vistos[canon]) { errores.push(av(archivo, 1, cabOrig[j], "Columna repetida: «" + cabOrig[j] + "»")); return; }
      vistos[canon] = 1; idx[canon] = j;
    });
    if (idx[T.id] === undefined) { errores.push(av(archivo, 1, T.id, "Falta la columna «" + T.id + "»")); return out(tabla); }
    function celda(f, k) { return idx[k] === undefined ? "" : (f[idx[k]] === undefined ? "" : f[idx[k]]); }
    function leerNum(f, k, n, cond) {
      var d = numeroDet(celda(f, k));
      if (d.v === null) return d;
      if (isNaN(d.v)) { errores.push(av(archivo, n, cabOrig[idx[k]], "Fila " + n + ", columna «" + cabOrig[idx[k]] + "»: «" + texto(celda(f, k)) + "» no es un número")); d.v = null; d.malo = true; return d; }
      if (cond && cond.min !== undefined && d.v < cond.min) { errores.push(av(archivo, n, cabOrig[idx[k]], "Fila " + n + ", «" + cabOrig[idx[k]] + "» = " + fmtN(d.v) + " fuera de rango (mínimo " + cond.min + (cond.u ? " " + cond.u : "") + ")")); d.v = null; d.malo = true; }
      else if (cond && cond.max !== undefined && d.v > cond.max) { errores.push(av(archivo, n, cabOrig[idx[k]], "Fila " + n + ", «" + cabOrig[idx[k]] + "» = " + fmtN(d.v) + " fuera de rango (máximo " + cond.max + (cond.u ? " " + cond.u : "") + ")")); d.v = null; d.malo = true; }
      else if (cond && cond.entero && Math.round(d.v) !== d.v) { errores.push(av(archivo, n, cabOrig[idx[k]], "Fila " + n + ", «" + cabOrig[idx[k]] + "» debe ser un entero")); d.v = null; d.malo = true; }
      return d;
    }
    function igual(d, ref) {   // ¿el valor del CSV es el exportado (dentro del redondeo escrito)?
      if (ref === null || ref === undefined || !isFinite(ref)) return false;
      var tol = 0.5 * Math.pow(10, -d.dec) * 1.0001 + 1e-12;
      return Math.abs(d.v - ref) <= tol;
    }
    function proc(clave, n) { mu.proc[clave] = { t: "usuario", f: archivo + " fila " + n }; }
    function ponerFactor(k, f, n, de, a, que) {
      if (typeof mu.factores[k] === "number") avisos.push(av(archivo, n, null, "Factor de «" + k + "» repetido: manda la fila " + n, k));
      mu.factores[k] = f; proc("factores." + k, n);
      cambios.push({ clave: "factores." + k, fila: n, de: de, a: a, factor: f, que: que || "DL", supuesto: "mod.importar_relativo" });
    }

    // índices de RED
    var Z = {}, NEC = {}, SV = {};
    (RED.zonas || []).forEach(function (z) { Z[z.id] = z; (z.necesidades || []).forEach(function (x) { NEC[x.id] = x; }); });
    (RED.servicios || []).forEach(function (s) { SV[s.id] = s; });

    if (tabla === "demandas" || tabla === "zonas" || tabla === "servicios_tipo") {
      var usaRef = (idx.dl !== undefined || idx.ul !== undefined);
      var R = usaRef ? referenciaDe(ctx, avisos, archivo) : null;
      var refDem = {}, refPadre = {}, grupos = {}, orden = [];
      if (R) (R.demandas || []).forEach(function (d) {
        refDem[d.id] = d;
        var pk = d.padre || d.id, x = refPadre[pk] || (refPadre[pk] = { dl: 0, ul: 0, prioridad: d.prioridad });
        x.dl += d.dl_gbps; x.ul += d.ul_gbps;
      });
      datos.forEach(function (f, i) {
        var n = i + 2, id = texto(celda(f, T.id));
        if (!id) { errores.push(av(archivo, n, T.id, "Fila " + n + ": falta el " + T.id)); return; }
        var key, refDL = null, refUL = null, refP = null;
        if (tabla === "demandas") {
          key = texto(celda(f, "padre")) || id.split("@")[0];
          if (!NEC[key] && !SV[key]) { errores.push(av(archivo, n, "id", "Fila " + n + ": id inexistente «" + id + "» (no es una necesidad de zona ni un servicio de RED)", id)); return; }
          var rd = refDem[id] || (id.indexOf("@") < 0 && refPadre[id] ? { dl_gbps: refPadre[id].dl, ul_gbps: refPadre[id].ul, prioridad: refPadre[id].prioridad } : null);
          var conValor = texto(celda(f, "dl")) !== "" || texto(celda(f, "ul")) !== "";
          if (R && !rd && conValor) avisos.push(av(archivo, n, "id", "Fila " + n + ": «" + id + "» no está en el caso de referencia (otro reparto entre CPD): se compara con el diseño", id));
          if (rd) { refDL = rd.dl_gbps; refUL = rd.ul_gbps; refP = rd.prioridad; }
          else { var src = NEC[key] || SV[key], sub = id.indexOf("@") > 0 ? null : 1; refDL = sub ? src.dl_gbps : null; refUL = sub ? src.ul_gbps : null; }
        } else if (tabla === "zonas") {
          key = id;
          if (!Z[key]) { errores.push(av(archivo, n, "id", "Fila " + n + ": id inexistente «" + id + "» (zona desconocida)", id)); return; }
          var rz = R && R.zonas && R.zonas[id];
          if (rz) refDL = rz.dl_gbps;
          else { refDL = 0; (Z[id].necesidades || []).forEach(function (x) { refDL += x.dl_gbps || 0; }); }
          // datos de documento editados: no mueven la demanda (avisar)
          [["poblacion", "poblacion"], ["abonados_fijos", "abonados_fijos"], ["abonados_moviles", "abonados_moviles"], ["lineas", "lineas_datos_moviles"]].forEach(function (p) {
            if (idx[p[0]] === undefined) return;
            var dd = numeroDet(celda(f, p[0]));
            if (dd.v !== null && !isNaN(dd.v) && typeof Z[id][p[1]] === "number" && !igual(dd, Z[id][p[1]]))
              avisos.push(av(archivo, n, cabOrig[idx[p[0]]], "Fila " + n + ": «" + cabOrig[idx[p[0]]] + "» cambiado en " + id + " pero no se usa para la demanda; edite DL_Gbps o factor", id));
          });
        } else {
          key = "clase:" + id;
          if (CLASES.indexOf(id) < 0) { errores.push(av(archivo, n, T.id, "Fila " + n + ": clase de servicio inexistente «" + id + "» (" + CLASES.join(", ") + ")", id)); return; }
          var ps = R && R.resumen && R.resumen.por_servicio && R.resumen.por_servicio[id];
          if (ps) { refDL = ps.dl_gbps; refUL = ps.ul_gbps; }
        }
        var dl = leerNum(f, "dl", n, { min: 0, u: "Gbit/s" }), ul = leerNum(f, "ul", n, { min: 0, u: "Gbit/s" });
        var fa = leerNum(f, "factor", n, { min: 0 });
        var pr = tabla === "demandas" ? leerNum(f, "prioridad", n, { min: 0, max: 99, entero: true }) : { v: null };
        var g = grupos[key];
        if (!g) { g = grupos[key] = { n: n, csv: 0, ref: 0, csvU: 0, refU: 0, cambia: false, cambiaU: false, factor: null, prio: null, nDL: 0, nUL: 0 }; orden.push(key); }
        if (dl.v !== null) {
          g.nDL++; g.csv += dl.v; g.ref += refDL || 0;
          if (!igual(dl, refDL)) g.cambia = true;
        }
        if (ul.v !== null) {
          g.nUL++; g.csvU += ul.v; g.refU += refUL || 0;
          if (!igual(ul, refUL)) g.cambiaU = true;
        }
        if (fa.v !== null) g.factor = fa.v;
        if (pr.v !== null && pr.v !== refP) g.prio = { v: pr.v, n: n, de: refP };
      });
      orden.forEach(function (key) {
        var g = grupos[key], k = key;
        if (g.factor !== null) { ponerFactor(k, g.factor, g.n, null, null, "factor"); return; }
        if (g.cambia) {
          if (!(g.ref > 0)) { avisos.push(av(archivo, g.n, "DL_Gbps", "Fila " + g.n + ": «" + k + "» tiene DL 0 en el caso exportado: no se puede escalar (use un caso en el que esté activo)", k)); }
          else {
            ponerFactor(k, g.csv / g.ref, g.n, g.ref, g.csv, "DL");
            if (g.cambiaU && g.refU > 0 && Math.abs(g.csvU / g.refU - g.csv / g.ref) > 1e-3)
              avisos.push(av(archivo, g.n, "UL_Gbps", "Fila " + g.n + ": DL y UL de «" + k + "» cambian en proporciones distintas; se usa la del DL para los dos", k));
          }
        } else if (g.cambiaU) {
          if (g.refU > 0) {
            ponerFactor(k, g.csvU / g.refU, g.n, g.refU, g.csvU, "UL");
            avisos.push(av(archivo, g.n, "UL_Gbps", "Fila " + g.n + ": solo cambia el UL de «" + k + "»; el factor se aplica también al DL", k));
          } else avisos.push(av(archivo, g.n, "UL_Gbps", "Fila " + g.n + ": «" + k + "» tiene UL 0 en el caso exportado: no se puede escalar", k));
        }
        if (g.prio) {
          mu.prioridades[k] = g.prio.v; proc("prioridades." + k, g.prio.n);
          cambios.push({ clave: "prioridades." + k, fila: g.prio.n, de: g.prio.de, a: g.prio.v });
        }
      });
    } else if (tabla === "servicios") {
      datos.forEach(function (f, i) {
        var n = i + 2, id = texto(celda(f, "id"));
        if (!id) { errores.push(av(archivo, n, "id", "Fila " + n + ": falta el id")); return; }
        var s = SV[id];
        if (!s) { errores.push(av(archivo, n, "id", "Fila " + n + ": id inexistente «" + id + "» (servicio desconocido)", id)); return; }
        var dl = leerNum(f, "dl", n, { min: 0, u: "Gbit/s" }), ul = leerNum(f, "ul", n, { min: 0, u: "Gbit/s" });
        var fa = leerNum(f, "factor", n, { min: 0 }), pr = leerNum(f, "prioridad", n, { min: 0, max: 99, entero: true });
        var ac = idx.activo === undefined ? null : booleano(celda(f, "activo"));
        if (ac === undefined) { errores.push(av(archivo, n, cabOrig[idx.activo], "Fila " + n + ", «" + cabOrig[idx.activo] + "»: «" + texto(celda(f, "activo")) + "» no es sí/no", id)); ac = null; }
        var activoRED = !s.inactivo_por_defecto, factor = null, que = null, de = null, a = null;
        if (fa.v !== null) { factor = fa.v; que = "factor"; }
        else if (dl.v !== null && !igual(dl, s.dl_gbps)) {
          if (s.dl_gbps > 0) { factor = dl.v / s.dl_gbps; que = "DL"; de = s.dl_gbps; a = dl.v; }
          else avisos.push(av(archivo, n, "DL_Gbps", "Fila " + n + ": «" + id + "» tiene DL 0 en el diseño: no se puede escalar", id));
          if (ul.v !== null && !igual(ul, s.ul_gbps) && s.ul_gbps > 0 && factor !== null && Math.abs(ul.v / s.ul_gbps - factor) > 1e-3)
            avisos.push(av(archivo, n, "UL_Gbps", "Fila " + n + ": DL y UL de «" + id + "» cambian en proporciones distintas; se usa la del DL", id));
        } else if (ul.v !== null && !igual(ul, s.ul_gbps)) {
          if (s.ul_gbps > 0) { factor = ul.v / s.ul_gbps; que = "UL"; de = s.ul_gbps; a = ul.v; avisos.push(av(archivo, n, "UL_Gbps", "Fila " + n + ": solo cambia el UL de «" + id + "»; el factor se aplica también al DL", id)); }
          else avisos.push(av(archivo, n, "UL_Gbps", "Fila " + n + ": «" + id + "» tiene UL 0 en el diseño: no se puede escalar", id));
        }
        if (ac === false && activoRED) { factor = 0; que = "activo=no"; }
        else if (ac === true && !activoRED && factor === null) { factor = 1; que = "activo=sí"; }
        if (factor !== null) ponerFactor(id, factor, n, de, a, que);
        var prRED = typeof s.prioridad === "number" ? s.prioridad : null;
        if (pr.v !== null && pr.v !== prRED) { mu.prioridades[id] = pr.v; proc("prioridades." + id, n); cambios.push({ clave: "prioridades." + id, fila: n, de: prRED, a: pr.v }); }
      });
    } else if (tabla === "perfiles") {
      var faltan = [];
      for (var h = 0; h < 24; h++) if (idx["h" + h] === undefined) faltan.push("h" + (h < 10 ? "0" : "") + h);
      if (faltan.length) { errores.push(av(archivo, 1, null, "Faltan columnas de hora: " + faltan.join(", ") + " (hacen falta h00…h23)")); return out(tabla); }
      var MT = RED.modelos_trafico || {}, nombres = {};
      Object.keys(RED.perfiles || {}).forEach(function (k) { nombres[k] = 1; });
      Object.keys(MT.perfiles_extra || {}).forEach(function (k) { if (k.charAt(0) !== "_") nombres[k] = 1; });
      CLASES.forEach(function (k) { nombres[k] = 1; });
      datos.forEach(function (f, i) {
        var n = i + 2, p = texto(celda(f, "perfil")), z = texto(celda(f, "zona"));
        if (!p) { errores.push(av(archivo, n, "perfil", "Fila " + n + ": falta el perfil")); return; }
        var esDem = !!(NEC[p] || SV[p]);
        if (!(nombres[p] || esDem || p === "*")) { errores.push(av(archivo, n, "perfil", "Fila " + n + ": perfil inexistente «" + p + "» (" + Object.keys(nombres).join(", ") + ", * o un id de demanda/servicio)", p)); return; }
        if (z && z !== "*" && !Z[z]) { errores.push(av(archivo, n, "zona", "Fila " + n + ": id inexistente «" + z + "» (zona desconocida)", z)); return; }
        if (esDem && z && z !== "*") avisos.push(av(archivo, n, "zona", "Fila " + n + ": «" + p + "» es una demanda: la zona no hace falta y se ignora", p));
        var arr = [], mal = false, sobre1 = false;
        for (var hh = 0; hh < 24; hh++) {
          var d = leerNum(f, "h" + hh, n, { min: 0 });
          if (d.malo) { mal = true; continue; }
          if (d.v === null) { errores.push(av(archivo, n, cabOrig[idx["h" + hh]], "Fila " + n + ": falta el valor de la hora " + hh, p)); mal = true; continue; }
          if (d.v > 1) sobre1 = true;
          arr.push(d.v);
        }
        if (mal) return;
        if (sobre1) avisos.push(av(archivo, n, null, "Fila " + n + ": el perfil «" + p + "» pasa de 1 (por encima del valor de diseño en hora cargada)", p));
        var clave = esDem || !z || z === "*" ? p : p + "|" + z;
        if (mu.perfiles[clave]) avisos.push(av(archivo, n, null, "Perfil «" + clave + "» repetido: manda la fila " + n, clave));
        mu.perfiles[clave] = arr; proc("perfiles." + clave, n);
        cambios.push({ clave: "perfiles." + clave, fila: n });
      });
    } else if (tabla === "parametros") {
      datos.forEach(function (f, i) {
        var n = i + 2, k = texto(celda(f, "clave")), vs = celda(f, "valor"), m;
        if (!k) return;
        var d = numeroDet(vs);
        function numOk(min, max) {
          if (d.v === null || isNaN(d.v)) { errores.push(av(archivo, n, "valor", "Fila " + n + ", «" + k + "»: «" + texto(vs) + "» no es un número", k)); return null; }
          if ((min !== undefined && d.v < min) || (max !== undefined && d.v > max)) { errores.push(av(archivo, n, "valor", "Fila " + n + ", «" + k + "» = " + fmtN(d.v) + " fuera de rango [" + min + ", " + max + "]", k)); return null; }
          return d.v;
        }
        var v;
        if (k === "id" || k === "nombre" || k === "name") { if (texto(vs)) mu[k === "name" ? "nombre" : k] = texto(vs); }
        else if (k === "anio" || k === "anio_base") { v = numOk(2000, 2100); if (v !== null) { mu[k] = Math.round(v); proc(k, n); } }
        else if (k === "ruido_sigma") { v = numOk(0, 2); if (v !== null) { (mu.ruido = mu.ruido || {}).sigma = v; proc("ruido", n); if (v > 0.5) avisos.push(av(archivo, n, "valor", "Fila " + n + ": σ = " + fmtN(v) + " es un ruido muy grande", k)); } }
        else if (k === "ruido_semilla") { if (texto(vs)) { (mu.ruido = mu.ruido || {}).semilla = d.v !== null && !isNaN(d.v) ? d.v : texto(vs); proc("ruido", n); } }
        else if (k === "movilidad_activa") { var b = booleano(vs); if (b === undefined) errores.push(av(archivo, n, "valor", "Fila " + n + ", «" + k + "»: «" + texto(vs) + "» no es sí/no", k)); else if (b !== null) { (mu.movilidad = mu.movilidad || {}).activa = b; proc("movilidad", n); } }
        else if (k === "movilidad_fraccion") { v = numOk(0, 1); if (v !== null) { (mu.movilidad = mu.movilidad || {}).fraccion = v; proc("movilidad", n); } }
        else if ((m = /^crecimiento_(.+)$/.exec(k))) {
          if (CLASES.indexOf(m[1]) < 0 && m[1] !== "*") { errores.push(av(archivo, n, "clave", "Fila " + n + ": clase inexistente «" + m[1] + "» en «" + k + "»", k)); return; }
          v = numOk(-0.5, 1); if (v !== null) { mu.crecimiento[m[1]] = v; proc("crecimiento", n); }
        } else if ((m = /^factor_(.+)$/.exec(k))) {
          var fk = m[1], okK = Z[fk] || NEC[fk] || SV[fk] || CLASES.indexOf(fk) >= 0 || /^(clase|tipo|slice):/.test(fk);
          if (!okK) { errores.push(av(archivo, n, "clave", "Fila " + n + ": id inexistente «" + fk + "» en «" + k + "»", fk)); return; }
          v = numOk(0, 100); if (v !== null) ponerFactor(CLASES.indexOf(fk) >= 0 ? "clase:" + fk : fk, v, n, null, null, "factor");
        } else if ((m = /^prioridad_(.+)$/.exec(k))) {
          if (!(NEC[m[1]] || SV[m[1]])) { errores.push(av(archivo, n, "clave", "Fila " + n + ": id inexistente «" + m[1] + "» en «" + k + "»", m[1])); return; }
          v = numOk(0, 99); if (v !== null) { mu.prioridades[m[1]] = Math.round(v); proc("prioridades." + m[1], n); }
        } else errores.push(av(archivo, n, "clave", "Fila " + n + ": parámetro desconocido «" + k + "»", k));
      });
    }
    return out(tabla);
  }

  // Quita partes vacías y pone id/nombre/fuente; combina con ctx.modelo si viene
  function limpiar(mu, ctx, archivo) {
    var o = { id: mu.id || ctx.id || undefined, nombre: mu.nombre || ctx.nombre_modelo || undefined, fuente: archivo };
    if (!ctx._multi) { o.id = o.id || "importado"; o.nombre = o.nombre || archivo; }
    if (o.id === undefined) delete o.id;
    if (o.nombre === undefined) delete o.nombre;
    ["perfiles", "factores", "prioridades", "crecimiento", "proc"].forEach(function (k) { if (Object.keys(mu[k]).length) o[k] = mu[k]; });
    ["anio", "anio_base", "ruido", "movilidad"].forEach(function (k) { if (mu[k] !== undefined) o[k] = mu[k]; });
    if (o.movilidad && o.movilidad.activa === undefined) o.movilidad.activa = true;
    return ctx.modelo ? combinar(ctx.modelo, o) : o;
  }
  function copia(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
  // b encima de a: los diccionarios se mezclan clave a clave (manda b); ruido y movilidad campo a campo
  function combinar(a, b) {
    if (!a) return copia(b); if (!b) return copia(a);
    var o = copia(a);
    ["perfiles", "factores", "prioridades", "crecimiento", "proc", "ruido", "movilidad"].forEach(function (k) {
      if (!b[k]) return;
      o[k] = o[k] || {};
      Object.keys(b[k]).forEach(function (x) { o[k][x] = copia(b[k][x]); });
    });
    ["anio", "anio_base"].forEach(function (k) { if (b[k] !== undefined) o[k] = b[k]; });
    if (b.eventos_demanda) o.eventos_demanda = (o.eventos_demanda || []).concat(copia(b.eventos_demanda));
    if (b.id) o.id = b.id;
    if (b.nombre) o.nombre = b.nombre;
    var fs = String(a.fuente || "").split(" + ").filter(Boolean);
    if (b.fuente && fs.indexOf(b.fuente) < 0) fs.push(b.fuente);
    o.fuente = fs.join(" + ");
    return o;
  }
  function leerArchivos(lista, ctx) {
    ctx = ctx || {};
    var mu = ctx.modelo || null, avisos = [], errores = [], cambios = [], tablas = [];
    var c2 = {}, k;
    for (k in ctx) c2[k] = ctx[k];
    c2._multi = true;
    (lista || []).forEach(function (a) {
      c2.nombre = a.nombre; c2.modelo = null; c2.tabla = a.tabla || null;
      var r = leerCSV(a.texto, c2);
      tablas.push({ nombre: a.nombre, tabla: r.tabla, filas: r.filas, ok: r.ok });
      avisos = avisos.concat(r.avisos); errores = errores.concat(r.errores); cambios = cambios.concat(r.cambios);
      if (r.tabla && r.tabla !== "caso") mu = combinar(mu, r.modelo_usuario);
    });
    if (mu) {
      if (ctx.id) mu.id = ctx.id;
      if (ctx.nombre_modelo) mu.nombre = ctx.nombre_modelo;
      if (!mu.id) mu.id = "importado";
      if (!mu.nombre) mu.nombre = tablas.map(function (t) { return t.nombre; }).join(" + ");
    }
    return { modelo_usuario: mu, avisos: avisos, errores: errores, cambios: cambios, tablas: tablas, ok: !errores.length };
  }

  // ---------------------------------------------------------------- plantillas
  function csv(filas) {
    return "﻿" + filas.map(function (r) {
      return r.map(function (c) { c = String(c == null ? "" : c); return /[;"\r\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";");
    }).join("\r\n") + "\r\n";
  }
  function plantillas(RED) {
    RED = RED || (raiz && raiz.RED) || null;
    var horas = [];
    for (var h = 0; h < 24; h++) horas.push("h" + (h < 10 ? "0" : "") + h);
    var perf = RED && RED.perfiles && RED.perfiles.residencial;
    if (!perf || perf.length !== 24) perf = [0.3, 0.2, 0.15, 0.1, 0.1, 0.15, 0.3, 0.45, 0.5, 0.5, 0.5, 0.55, 0.6, 0.6, 0.55, 0.55, 0.6, 0.7, 0.8, 0.9, 0.95, 1, 0.85, 0.55];
    return [
      { nombre: "perfiles.csv", desc: "Curva horaria (0..1, 1 = valor de diseño en hora cargada). perfil: residencial, empresa, iot, evento, movilidad, movil-residencial, movil-oficinas, movil-mixto, una clase (movil, ftth, voz…), un id de demanda o *. zona: id de zona, vacío o * = todas.",
        texto: csv([["perfil", "zona"].concat(horas), ["residencial", "Z-MADRID"].concat(perf.map(fmtN))]) },
      { nombre: "parametros.csv", desc: "Parámetros del modelo: ruido, movilidad, crecimiento (CAGR por clase o *), factores y prioridades sueltos.",
        texto: csv([["clave", "valor", "nota"], ["id", "mi-modelo", "identificador"], ["nombre", "Mi modelo de demanda", ""],
          ["ruido_sigma", "0,1", "σ del ruido lognormal (0 = sin ruido)"], ["ruido_semilla", "1", "misma semilla = misma película"],
          ["movilidad_activa", "no", "sí/no"], ["movilidad_fraccion", "0,2", "fracción del móvil residencial que va a oficinas/Centro"],
          ["anio_base", "2031", "año de los valores de diseño"], ["anio", "2031", "año a simular con el CAGR"], ["crecimiento_movil", "0,15", "CAGR de la clase (0,15 = 15 %/año)"],
          ["factor_Z-GETAFE", "1", "multiplica toda la demanda de la zona"], ["prioridad_S-HOSPITAL-CRITICO", "1", "prioridad de la demanda (1 = primero)"]]) },
      { nombre: "demandas.csv", desc: "Demandas: DL/UL en Gbit/s del caso exportado (el cambio se convierte en factor) o factor directo. Vale también el demandas.csv que exporta el simulador.",
        texto: csv([["id", "DL_Gbps", "UL_Gbps", "prioridad", "factor"], ["Z-MADRID/movil-ebb", "", "", "", "1,1"]]) },
      { nombre: "zonas.csv", desc: "Zonas: DL total en Gbit/s del caso exportado o factor directo. Vale también el zonas.csv que exporta el simulador.",
        texto: csv([["id", "DL_Gbps", "factor"], ["Z-GETAFE", "", "1,05"]]) },
      { nombre: "servicios.csv", desc: "Servicios especiales: DL/UL de diseño en Gbit/s, prioridad, activo_por_defecto (sí/no) o factor. Vale también el servicios.csv exportado.",
        texto: csv([["id", "DL_Gbps", "UL_Gbps", "prioridad", "activo_por_defecto", "factor"], ["S-HOSPITAL-CRITICO", "", "", "1", "", ""]]) },
      { nombre: "servicios_tipo.csv", desc: "Clases de servicio: DL en Gbit/s del caso exportado o factor por clase. Vale también el servicios_tipo.csv exportado.",
        texto: csv([["servicio", "DL_Gbps", "factor"], ["movil", "", "1,2"]]) }
    ];
  }

  var API = { leerCSV: leerCSV, leerArchivos: leerArchivos, combinar: combinar, plantillas: plantillas, parsearCSV: parsearCSV,
    numero: numero, TABLAS: TABLAS, CLASES: CLASES.slice(), VERSION: "1" };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Importar = API;
})(typeof window !== "undefined" ? window : (typeof self !== "undefined" ? self : this));
