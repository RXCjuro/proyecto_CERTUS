export function toast(msg, tipo = "ok") {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.append(box); }
  const t = document.createElement("div");
  t.className = "toast " + tipo;
  t.textContent = msg;
  box.append(t);
  setTimeout(() => t.remove(), 3500);
}
