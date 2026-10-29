import { iniciar } from "../app.js";
import { montarCRUD } from "../ui/crud.js";
import { requerido, correoInstitucional, dni, telefono, nota } from "../utils/validators.js";
const user = await iniciar("docentes");
if (user) await montarCRUD({
  coleccion: "docentes", titulo: "Docentes", singular: "docente",
  campos: [
    { k: "codigo", label: "Código", required: true },
    { k: "dni", label: "DNI", required: true, validar: dni },
    { k: "apellidos", label: "Apellidos", required: true },
    { k: "nombres", label: "Nombres", required: true },
    { k: "correo", label: "Correo institucional", type: "email", required: true, validar: correoInstitucional },
    { k: "telefono", label: "Teléfono", validar: telefono },
    { k: "area", label: "Área académica", required: true },
    { k: "cargo", label: "Cargo" },
    { k: "condicion", label: "Condición", type: "select", options: ["Tiempo completo", "Tiempo parcial", "Por horas"], required: true },
    { k: "fechaIngreso", label: "Fecha de ingreso", type: "date" },
  ],
  columnas: ["codigo", "apellidos", "nombres", "area", "condicion"],
  acciones: (f) => `<a class="link" href="ficha.html?id=${f.id}">Ver ficha</a>`,
}, user);
