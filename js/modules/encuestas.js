import { iniciar } from "../app.js";
import { montarCRUD } from "../ui/crud.js";
import { requerido, correoInstitucional, dni, telefono, nota } from "../utils/validators.js";
const user = await iniciar("encuestas");
if (user) await montarCRUD({
  coleccion: "encuestas", titulo: "Encuestas de estudiantes", singular: "encuesta",
  campos: [
    { k: "docenteId", label: "Docente", type: "docente", required: true },
    { k: "periodo", label: "Periodo académico", type: "select", options: ["2025-I","2025-II","2026-I","2026-II"], required: true },
    { k: "curso", label: "Curso", required: true },
    { k: "puntaje", label: "Puntaje promedio (0–20)", type: "number", required: true, validar: nota },
    { k: "respuestas", label: "N.º de respuestas", type: "number" },
    { k: "comentarios", label: "Comentarios destacados", type: "textarea" },
  ],
  columnas: ["docenteId", "periodo", "curso", "puntaje"],
}, user);
