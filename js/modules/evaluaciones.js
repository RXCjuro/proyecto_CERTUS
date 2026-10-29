import { iniciar } from "../app.js";
import { montarCRUD } from "../ui/crud.js";
import { requerido, correoInstitucional, dni, telefono, nota } from "../utils/validators.js";
const user = await iniciar("evaluaciones");
if (user) await montarCRUD({
  coleccion: "evaluaciones", titulo: "Evaluaciones por periodo", singular: "evaluación",
  campos: [
    { k: "docenteId", label: "Docente", type: "docente", required: true },
    { k: "periodo", label: "Periodo académico", type: "select", options: ["2025-I","2025-II","2026-I","2026-II"], required: true },
    { k: "nota", label: "Resultado (0–20)", type: "number", required: true, validar: nota },
    { k: "observaciones", label: "Observaciones", type: "textarea" },
  ],
  columnas: ["docenteId", "periodo", "nota"],
}, user);
