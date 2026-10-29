# Docente360 – Prototipo de gestión del legajo docente (CERTUS)

Aplicación web responsive (HTML + CSS + JavaScript) con Firebase Authentication (Google) y Firestore.

## Puesta en marcha
1. Crea un proyecto en https://console.firebase.google.com
2. Activa **Authentication > Google** y **Firestore Database**.
3. Copia tu configuración web en `js/config/firebase-config.js` y ajusta `DOMINIO` (por defecto `certus.edu.pe`).
   Si cambias el dominio, cámbialo también en `firestore.rules`.
4. Instala la CLI: `npm i -g firebase-tools`, luego `firebase login` y edita `.firebaserc`.
5. Publica reglas: `firebase deploy --only firestore:rules`
6. Prueba en local: `firebase serve` (o `npx serve .`; los módulos ES requieren servidor, no abrir con doble clic).
7. Despliega: `firebase deploy`

## Primer administrador
El primer ingreso crea el perfil con rol `consulta`. En Firestore > `usuarios/{uid}` cambia `rol` a `admin`.
Luego el administrador asigna roles desde **Usuarios y roles**.

| Rol | Permisos |
|---|---|
| admin | Todo, incluida la eliminación y gestión de roles |
| editor | Registrar y editar información |
| consulta | Solo ver fichas y reportes |

## Módulos
Docentes · Evaluaciones · Supervisiones de clase · Encuestas · Ficha del docente (PDF) · Reportes consolidados (CSV para Excel) · Usuarios y roles.
