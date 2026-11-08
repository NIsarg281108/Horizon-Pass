// Turns an array of plain objects into CSV text
function escapeCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ];
  return lines.join("\n");
}

// Downloads a CSV file. The BOM makes Excel read UTF-8 correctly.
export function downloadCsv(filename, rows) {
  const blob = new Blob(["\uFEFF" + toCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
