import { iniciar } from "../app.js";
import { listar } from "../services/firestore-service.js";
import { prom, fmtNota } from "../utils/helpers.js";

const user = await iniciar("dashboard");
if (user) {
  const [d, e, s, en] = await Promise.all(["docentes", "evaluaciones", "supervisiones", "encuestas"].map(listar));
  const areas = {};
  d.forEach((x) => (areas[x.area] = (areas[x.area] || 0) + 1));
  const max = Math.max(1, ...Object.values(areas));
  document.getElementById("app").innerHTML = `
    <header class="cabecera"><h1>Hola, ${user.nombre.split(" ")[0]}</h1></header>
    <section class="resumen">
      <a href="docentes.html"><b>${d.length}</b> docentes registrados</a>
      <a href="evaluaciones.html"><b>${e.length}</b> evaluaciones</a>
      <a href="supervisiones.html"><b>${s.length}</b> supervisiones de clase</a>
      <a href="encuestas.html"><b>${en.length}</b> encuestas</a>
    </section>
    <section class="panel"><h2>Docentes por área</h2>
      ${Object.entries(areas).map(([a, n]) => `<div class="barra"><span>${a}</span><i style="width:${(n / max) * 100}%"></i><em>${n}</em></div>`).join("") || '<p class="vacio">Registra docentes para ver la distribución por área.</p>'}</section>
    <section class="panel"><h2>Promedios generales</h2>
      <p>Evaluaciones: <b>${fmtNota(prom(e.map((x) => x.nota)))}</b> · Supervisiones: <b>${fmtNota(prom(s.map((x) => x.puntaje)))}</b> · Encuestas: <b>${fmtNota(prom(en.map((x) => x.puntaje)))}</b></p></section>`;
}
