import { listar, crear, actualizar, eliminar } from "../services/firestore-service.js";
import { esc, nombreCompleto } from "../utils/helpers.js";
import { requerido } from "../utils/validators.js";
import { toast } from "./toast.js";
import { puedeEscribir } from "../auth.js";

// Tabla + formulario reutilizable. cfg: { coleccion, titulo, singular, campos[], columnas[], acciones?(fila) }
export async function montarCRUD(cfg, user) {
  const escribe = puedeEscribir(user), borra = user.rol === "admin";
  const root = document.getElementById("app");
  const usaDocente = cfg.campos.some((c) => c.type === "docente");
  const docentes = usaDocente ? await listar("docentes") : [];
  const nomDoc = (id) => nombreCompleto(docentes.find((d) => d.id === id));
  let filas = [], editando = null;

  root.innerHTML = `
    <header class="cabecera"><h1>${cfg.titulo}</h1>
      <div class="herramientas"><input id="q" type="search" placeholder="Buscar" aria-label="Buscar">
      ${escribe ? `<button id="nuevo" class="btn">Nuevo ${cfg.singular}</button>` : ""}</div></header>
    <div class="tabla-wrap"><table><thead><tr>${cfg.columnas.map((k) => `<th>${cfg.campos.find((c) => c.k === k).label}</th>`).join("")}<th></th></tr></thead><tbody id="filas"></tbody></table></div>
    <dialog id="dlg"><form id="frm" novalidate><h2 id="dlg-t"></h2><div class="grid-form" id="campos"></div>
      <div class="acciones-form"><button type="button" id="cancelar" class="btn ghost">Cancelar</button><button class="btn">Guardar</button></div></form></dialog>`;

  const celda = (f, k) => { const c = cfg.campos.find((x) => x.k === k); return c.type === "docente" ? esc(nomDoc(f[k])) : esc(f[k]); };
  const pintar = () => {
    const q = document.getElementById("q").value.toLowerCase();
    const vis = filas.filter((f) => cfg.columnas.map((k) => celda(f, k)).join(" ").toLowerCase().includes(q));
    document.getElementById("filas").innerHTML = vis.length ? vis.map((f) => `<tr>${cfg.columnas.map((k) => `<td>${celda(f, k)}</td>`).join("")}
      <td class="fila-acc">${cfg.acciones ? cfg.acciones(f) : ""}${escribe ? `<button class="link" data-e="${f.id}">Editar</button>` : ""}${borra ? `<button class="link peligro" data-d="${f.id}">Eliminar</button>` : ""}</td></tr>`).join("")
      : `<tr><td colspan="${cfg.columnas.length + 1}" class="vacio">Aún no hay registros. ${escribe ? `Crea el primero con “Nuevo ${cfg.singular}”.` : ""}</td></tr>`;
  };
  const cargar = async () => { filas = await listar(cfg.coleccion); pintar(); };

  const campoHTML = (c, v = "") => {
    const id = "f_" + c.k, base = `id="${id}" name="${c.k}" ${c.required ? "required" : ""}`;
    let input;
    if (c.type === "select") input = `<select ${base}><option value="">Selecciona</option>${c.options.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else if (c.type === "docente") input = `<select ${base}><option value="">Selecciona</option>${docentes.map((d) => `<option value="${d.id}" ${d.id === v ? "selected" : ""}>${esc(nombreCompleto(d))}</option>`).join("")}</select>`;
    else if (c.type === "textarea") input = `<textarea ${base} rows="3">${esc(v)}</textarea>`;
    else input = `<input ${base} type="${c.type || "text"}" ${c.type === "number" ? 'step="0.1" min="0"' : ""} value="${esc(v)}">`;
    return `<label class="${c.type === "textarea" ? "ancho" : ""}">${c.label}${input}<small class="err" id="e_${c.k}"></small></label>`;
  };
  const abrir = (f) => {
    editando = f;
    document.getElementById("dlg-t").textContent = (f ? "Editar " : "Nuevo ") + cfg.singular;
    document.getElementById("campos").innerHTML = cfg.campos.map((c) => campoHTML(c, f?.[c.k])).join("");
    document.getElementById("dlg").showModal();
  };

  document.getElementById("q").oninput = pintar;
  document.getElementById("cancelar").onclick = () => document.getElementById("dlg").close();
  if (escribe) document.getElementById("nuevo").onclick = () => abrir(null);
  document.getElementById("filas").onclick = async (ev) => {
    const e = ev.target.dataset.e, d = ev.target.dataset.d;
    if (e) abrir(filas.find((f) => f.id === e));
    if (d && confirm("¿Eliminar este registro? No se puede deshacer.")) { await eliminar(cfg.coleccion, d); toast("Registro eliminado"); cargar(); }
  };
  document.getElementById("frm").onsubmit = async (ev) => {
    ev.preventDefault();
    const data = {}; let ok = true;
    cfg.campos.forEach((c) => {
      let v = document.getElementById("f_" + c.k).value.trim();
      const msg = (c.required ? requerido(v) : "") || (c.validar ? c.validar(v) : "");
      document.getElementById("e_" + c.k).textContent = msg;
      if (msg) ok = false;
      data[c.k] = c.type === "number" && v !== "" ? Number(v) : v;
    });
    if (!ok) return;
    try {
      editando ? await actualizar(cfg.coleccion, editando.id, data) : await crear(cfg.coleccion, data);
      document.getElementById("dlg").close(); toast("Guardado"); cargar();
    } catch (e) { toast("No se pudo guardar: " + e.message, "error"); }
  };
  await cargar();
}
