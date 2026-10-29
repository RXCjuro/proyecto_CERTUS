import { observarSesion, logout } from "./services/auth-service.js";

// Guard de rutas: redirige a login (sin sesión) o a 403 (rol no permitido).
export function exigirSesion(roles = null) {
  return new Promise((res) => {
    observarSesion((u) => {
      if (!u) { location.href = "login.html"; return res(null); }
      if (roles && !roles.includes(u.rol)) { location.href = "403.html"; return res(null); }
      res(u);
    });
  });
}
export const puedeEscribir = (u) => ["admin", "editor"].includes(u.rol);
export { logout };
