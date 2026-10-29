import { exigirSesion } from "./auth.js";
import { montarLayout } from "./ui/layout.js";

export async function iniciar(pagina, roles = null) {
  const user = await exigirSesion(roles);
  if (!user) return null;
  montarLayout(pagina, user);
  return user;
}
