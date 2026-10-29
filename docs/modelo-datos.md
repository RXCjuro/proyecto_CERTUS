# Modelo de datos (Firestore)
- `usuarios/{uid}`: email, nombre, rol, creado
- `docentes/{id}`: codigo, dni, apellidos, nombres, correo, telefono, area, cargo, condicion, fechaIngreso
- `evaluaciones/{id}`: docenteId, periodo, nota (0–20), observaciones
- `supervisiones/{id}`: docenteId, periodo, fecha, curso, puntaje (0–20), feedback
- `encuestas/{id}`: docenteId, periodo, curso, puntaje (0–20), respuestas, comentarios

