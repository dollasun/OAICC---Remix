/** Saves a blob as a file in the browser. */
export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const downloadCsv = (csv: string, fileName: string) =>
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), fileName);
