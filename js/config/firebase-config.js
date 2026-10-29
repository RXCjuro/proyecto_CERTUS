// Reemplaza con la configuración de tu proyecto (Firebase Console > Configuración del proyecto > Tus apps > Web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCK9pfxQfxbGVXqnlP4jLOBk6EZAS6KJkA",
  authDomain: "docente-1c7f6.firebaseapp.com",
  projectId: "docente-1c7f6",
  storageBucket: "docente-1c7f6.firebasestorage.app",
  messagingSenderId: "519222119958",
  appId: "1:519222119958:web:243130ed66cc7552556f37"
};

// Dominio del correo institucional (también está en firestore.rules)
export const DOMINIO = "certus.edu.pe";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
