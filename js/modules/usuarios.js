import { iniciar } from "../app.js";
import { listar, actualizar } from "../services/firestore-service.js";
import { esc } from "../utils/helpers.js";
import { toast } from "../ui/toast.js";

const user = await iniciar("usuarios", ["admin"]);
if (user) {
  const root = document.getElementById("app");
  const roles = { admin: "Administrador", editor: "Editor (registra y edita)", consulta: "Consulta (solo lectura)" };
  const usuarios = await listar("usuarios");
  root.innerHTML = `<header class="cabecera"><h1>Usuarios y roles</h1></header>
    <p class="nota">Quien ingresa por primera vez con su correo institucional queda como Consulta. Asigna aquí el rol que corresponda.</p>
    <div class="tabla-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead><tbody>
    ${usuarios.map((u) => `<tr><td>${esc(u.nombre)}</td><td>${esc(u.email)}</td><td><select data-id="${u.id}" ${u.id === user.uid ? "disabled" : ""}>
      ${Object.entries(roles).map(([k, v]) => `<option value="${k}" ${k === u.rol ? "selected" : ""}>${v}</option>`).join("")}</select></td></tr>`).join("")}
    </tbody></table></div>`;
  root.onchange = async (e) => {
    if (!e.target.dataset.id) return;
    try { await actualizar("usuarios", e.target.dataset.id, { rol: e.target.value }); toast("Rol actualizado"); }
    catch (err) { toast("No se pudo cambiar el rol", "error"); }
  };
}
