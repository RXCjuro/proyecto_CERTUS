import { iniciar } from "../app.js";
import { montarCRUD } from "../ui/crud.js";
import { requerido, correoInstitucional, dni, telefono, nota } from "../utils/validators.js";
const user = await iniciar("supervisiones");
if (user) await montarCRUD({
  coleccion: "supervisiones", titulo: "Supervisiones de clase", singular: "supervisión",
  campos: [
    { k: "docenteId", label: "Docente", type: "docente", required: true },
    { k: "periodo", label: "Periodo académico", type: "select", options: ["2025-I","2025-II","2026-I","2026-II"], required: true },
    { k: "fecha", label: "Fecha de supervisión", type: "date", required: true },
    { k: "curso", label: "Curso", required: true },
    { k: "puntaje", label: "Puntaje (0–20)", type: "number", required: true, validar: nota },
    { k: "feedback", label: "Feedback del supervisor", type: "textarea", required: true },
  ],
  columnas: ["docenteId", "periodo", "fecha", "curso", "puntaje"],
}, user);
