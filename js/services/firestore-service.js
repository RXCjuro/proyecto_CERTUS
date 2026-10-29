import { db } from "../config/firebase-config.js";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function listar(col) {
  const s = await getDocs(collection(db, col));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function obtener(col, id) {
  const s = await getDoc(doc(db, col, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}
export const crear = (col, data) => addDoc(collection(db, col), { ...data, creado: serverTimestamp() });
export const actualizar = (col, id, data) => updateDoc(doc(db, col, id), { ...data, actualizado: serverTimestamp() });
export const eliminar = (col, id) => deleteDoc(doc(db, col, id));
