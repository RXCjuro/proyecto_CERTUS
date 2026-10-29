// CSV con BOM para que Excel respete tildes. Requiere jsPDF (CDN) solo para PDF.
export function exportarCSV(nombre, filas, columnas) {
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [columnas.map((c) => q(c.label)).join(",")]
    .concat(filas.map((f) => columnas.map((c) => q(f[c.k])).join(","))).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  a.download = nombre + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportarPDF(nombre, titulo, bloques) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 20;
  const linea = (txt, size = 10, bold = false) => {
    pdf.setFontSize(size); pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.splitTextToSize(String(txt), 175).forEach((l) => { if (y > 280) { pdf.addPage(); y = 20; } pdf.text(l, 18, y); y += size * 0.55 + 2; });
  };
  linea(titulo, 16, true); y += 4;
  bloques.forEach((b) => { y += 3; linea(b.titulo, 12, true); b.lineas.forEach((l) => linea(l)); });
  pdf.save(nombre + ".pdf");
}
