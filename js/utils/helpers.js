export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const prom = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
export const fmtNota = (n) => (n === null || n === undefined ? "—" : Number(n).toFixed(1));
export const nombreCompleto = (d) => (d ? `${d.apellidos}, ${d.nombres}` : "—");
