import { DOMINIO } from "../config/firebase-config.js";
export const requerido = (v) => (String(v ?? "").trim() ? "" : "Este campo es obligatorio.");
export const correoInstitucional = (v) => (!v || new RegExp(`^[^@\\s]+@${DOMINIO.replace(".", "\\.")}$`, "i").test(v) ? "" : `Usa un correo @${DOMINIO}.`);
export const dni = (v) => (!v || /^\d{8}$/.test(v) ? "" : "El DNI debe tener 8 dígitos.");
export const telefono = (v) => (!v || /^\d{9}$/.test(v) ? "" : "El teléfono debe tener 9 dígitos.");
export const nota = (v) => (v === "" || (v >= 0 && v <= 20) ? "" : "Ingresa un valor entre 0 y 20.");
