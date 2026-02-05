export function downloadBlobAsFile(
  data: BlobPart,
  fileName: string,
  mime = 'application/octet-stream',
) {
  const blob = new Blob([data], { type: mime });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
