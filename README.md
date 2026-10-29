# Docente360 – Prototipo de gestión del legajo docente (CERTUS)

Aplicación web responsive (HTML + CSS + JavaScript) con Firebase Authentication (Google), Firestore y Firebase Hosting.
Nada se publica automáticamente: el despliegue lo haces tú.

## Puesta en marcha
1. Crea o abre tu proyecto en https://console.firebase.google.com
2. Activa **Authentication > Google**, **Firestore Database** y **Hosting**.
3. Registra una app web y copia su configuración en `js/config/firebase-config.js`.
   Ajusta `DOMINIO` (por defecto `certus.edu.pe`); si lo cambias, cámbialo también en `firestore.rules`.
4. Instala la CLI: `npm i -g firebase-tools`, luego `firebase login` y pon el ID de tu proyecto en `.firebaserc`.
5. Prueba en local: `npx serve .` (los módulos ES no funcionan abriendo el HTML con doble clic).
6. Despliega cuando quieras:
   - Solo la web: `firebase deploy --only hosting`
   - Solo las reglas: `firebase deploy --only firestore:rules`
   - Todo: `firebase deploy`

Si Firebase te pide verificación en dos pasos, también puedes subir la carpeta desde la consola de Firebase (Hosting > Primeros pasos) o autenticarte con `firebase login --no-localhost`.

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
