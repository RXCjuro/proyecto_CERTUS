import { logout } from "../auth.js";
import { esc } from "../utils/helpers.js";

const NAV = [
  ["dashboard", "Inicio", "dashboard.html"],
  ["docentes", "Docentes", "docentes.html"],
  ["evaluaciones", "Evaluaciones", "evaluaciones.html"],
  ["supervisiones", "Supervisiones de clase", "supervisiones.html"],
  ["encuestas", "Encuestas", "encuestas.html"],
  ["reportes", "Reportes", "reportes.html"],
  ["usuarios", "Usuarios y roles", "usuarios.html", ["admin"]],
];

export function montarLayout(pagina, user) {
  const side = document.getElementById("side");
  const links = NAV.filter((n) => !n[3] || n[3].includes(user.rol))
    .map((n) => `<a href="${n[2]}" ${n[0] === pagina ? 'aria-current="page"' : ""}>${n[1]}</a>`).join("");
  side.innerHTML = `
    <div class="marca">Docente360<small>CERTUS · Gestión docente</small></div>
    <nav>${links}</nav>
    <div class="usuario"><strong>${esc(user.nombre)}</strong><span>${esc(user.email)}</span>
      <span class="rol">Rol: ${esc(user.rol)}</span><button id="salir" class="btn ghost">Cerrar sesión</button></div>`;
  document.getElementById("salir").onclick = async () => { await logout(); location.href = "login.html"; };
  const m = document.getElementById("menu");
  if (m) m.onclick = () => document.body.classList.toggle("menu-abierto");
}
