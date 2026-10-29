import { iniciar } from "../app.js";
import { listar } from "../services/firestore-service.js";
import { esc, prom, fmtNota, nombreCompleto } from "../utils/helpers.js";
import { exportarCSV } from "../utils/export.js";

const user = await iniciar("reportes");
if (user) {
  const [docs, evs, sups, encs] = await Promise.all(["docentes", "evaluaciones", "supervisiones", "encuestas"].map(listar));
  const periodos = [...new Set([...evs, ...sups, ...encs].map((x) => x.periodo))].sort();
  const areas = [...new Set(docs.map((d) => d.area))].sort();
  const root = document.getElementById("app");
  root.innerHTML = `<header class="cabecera"><h1>Reporte consolidado de docentes</h1>
    <div class="herramientas"><select id="fp"><option value="">Todos los periodos</option>${periodos.map((p) => `<option>${esc(p)}</option>`).join("")}</select>
    <select id="fa"><option value="">Todas las áreas</option>${areas.map((a) => `<option>${esc(a)}</option>`).join("")}</select>
    <button id="csv" class="btn">Exportar a Excel (CSV)</button></div></header>
    <div class="tabla-wrap"><table><thead><tr><th>Docente</th><th>Área</th><th>Evaluación</th><th>Supervisión</th><th>Encuesta</th><th>Promedio general</th></tr></thead><tbody id="filas"></tbody></table></div>`;
  let filas = [];
  const calcular = () => {
    const p = document.getElementById("fp").value, a = document.getElementById("fa").value;
    const sel = (arr, id) => arr.filter((x) => x.docenteId === id && (!p || x.periodo === p));
    filas = docs.filter((d) => !a || d.area === a).map((d) => {
      const ev = prom(sel(evs, d.id).map((x) => x.nota)), su = prom(sel(sups, d.id).map((x) => x.puntaje)), en = prom(sel(encs, d.id).map((x) => x.puntaje));
      const todos = [ev, su, en].filter((x) => x !== null);
      return { docente: nombreCompleto(d), area: d.area, evaluacion: fmtNota(ev), supervision: fmtNota(su), encuesta: fmtNota(en), general: fmtNota(prom(todos)), id: d.id };
    });
    document.getElementById("filas").innerHTML = filas.length ? filas.map((f) => `<tr><td><a class="link" href="ficha.html?id=${f.id}">${esc(f.docente)}</a></td><td>${esc(f.area)}</td><td>${f.evaluacion}</td><td>${f.supervision}</td><td>${f.encuesta}</td><td><b>${f.general}</b></td></tr>`).join("")
      : '<tr><td colspan="6" class="vacio">No hay datos para este filtro.</td></tr>';
  };
  document.getElementById("fp").onchange = calcular;
  document.getElementById("fa").onchange = calcular;
  document.getElementById("csv").onclick = () => exportarCSV("reporte-docentes", filas, [
    { k: "docente", label: "Docente" }, { k: "area", label: "Área" }, { k: "evaluacion", label: "Evaluación" },
    { k: "supervision", label: "Supervisión" }, { k: "encuesta", label: "Encuesta" }, { k: "general", label: "Promedio general" }]);
  calcular();
}
