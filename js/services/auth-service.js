import { auth, db, DOMINIO } from "../config/firebase-config.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const esInstitucional = (e) => !!e && e.toLowerCase().endsWith("@" + DOMINIO);

export async function login() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ hd: DOMINIO, prompt: "select_account" });
  const { user } = await signInWithPopup(auth, p);
  if (!esInstitucional(user.email)) {
    await signOut(auth);
    throw new Error(`Ingresa con tu correo @${DOMINIO}.`);
  }
  return user;
}

export const logout = () => signOut(auth);

// Entrega { uid, email, nombre, rol } o null. El primer ingreso crea el perfil con rol "consulta".
export function observarSesion(cb) {
  onAuthStateChanged(auth, async (u) => {
    if (!u) return cb(null);
    if (!esInstitucional(u.email)) { await signOut(auth); return cb(null); }
    const r = doc(db, "usuarios", u.uid);
    let snap = await getDoc(r);
    if (!snap.exists()) {
      await setDoc(r, { email: u.email, nombre: u.displayName || u.email, rol: "consulta", creado: serverTimestamp() });
      snap = await getDoc(r);
    }
    cb({ uid: u.uid, ...snap.data() });
  });
}
