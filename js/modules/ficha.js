import { iniciar } from "../app.js";
import { obtener, listar } from "../services/firestore-service.js";
import { esc, nombreCompleto, fmtNota } from "../utils/helpers.js";
import { exportarPDF } from "../utils/export.js";

const user = await iniciar("docentes");
const root = document.getElementById("app");
const id = new URLSearchParams(location.search).get("id");
if (user) {
  const d = id && (await obtener("docentes", id));
  if (!d) root.innerHTML = '<p class="vacio">No encontramos a este docente. <a href="docentes.html">Volver a docentes</a></p>';
  else {
    const por = async (col) => (await listar(col)).filter((x) => x.docenteId === id).sort((a, b) => (b.periodo || "").localeCompare(a.periodo || ""));
    const [evs, sups, encs] = await Promise.all([por("evaluaciones"), por("supervisiones"), por("encuestas")]);
    const datos = [["Código", d.codigo], ["DNI", d.dni], ["Correo", d.correo], ["Teléfono", d.telefono], ["Área", d.area], ["Cargo", d.cargo], ["Condición", d.condicion], ["Ingreso", d.fechaIngreso]];
    const tabla = (cols, filas) => filas.length ? `<table><thead><tr>${cols.map((c) => `<th>${c[1]}</th>`).join("")}</tr></thead><tbody>${filas.map((f) => `<tr>${cols.map((c) => `<td>${esc(f[c[0]])}</td>`).join("")}</tr>`).join("")}</tbody></table>` : '<p class="vacio">Sin registros.</p>';
    root.innerHTML = `<header class="cabecera"><h1>${esc(nombreCompleto(d))}</h1>
      <div class="herramientas"><a class="btn ghost" href="docentes.html">Volver</a><button id="pdf" class="btn">Descargar ficha en PDF</button></div></header>
      <section class="panel"><h2>Datos personales y laborales</h2><dl class="datos">${datos.map((x) => `<div><dt>${x[0]}</dt><dd>${esc(x[1] || "—")}</dd></div>`).join("")}</dl></section>
      <section class="panel"><h2>Evaluaciones por periodo</h2>${tabla([["periodo", "Periodo"], ["nota", "Resultado"], ["observaciones", "Observaciones"]], evs)}</section>
      <section class="panel"><h2>Supervisiones de clase</h2>${tabla([["fecha", "Fecha"], ["curso", "Curso"], ["puntaje", "Puntaje"], ["feedback", "Feedback"]], sups)}</section>
      <section class="panel"><h2>Resultados de encuestas</h2>${tabla([["periodo", "Periodo"], ["curso", "Curso"], ["puntaje", "Puntaje"], ["comentarios", "Comentarios"]], encs)}</section>`;
    document.getElementById("pdf").onclick = () => exportarPDF("ficha-" + d.codigo, "Ficha docente: " + nombreCompleto(d), [
      { titulo: "Datos personales y laborales", lineas: datos.map((x) => `${x[0]}: ${x[1] || "—"}`) },
      { titulo: "Evaluaciones", lineas: evs.map((e) => `${e.periodo} | ${fmtNota(e.nota)} | ${e.observaciones || ""}`) },
      { titulo: "Supervisiones de clase", lineas: sups.map((s) => `${s.fecha} | ${s.curso} | ${fmtNota(s.puntaje)} | ${s.feedback}`) },
      { titulo: "Encuestas", lineas: encs.map((e) => `${e.periodo} | ${e.curso} | ${fmtNota(e.puntaje)} | ${e.comentarios || ""}`) }]);
  }
}
