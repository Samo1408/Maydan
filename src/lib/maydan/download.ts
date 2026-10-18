export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadText(filename: string, content: string, type = "text/csv;charset=utf-8") {
  downloadBlob(new Blob([content], { type }), filename);
}

export function fileSlug(title: string): string {
  const cleaned = title.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  return cleaned.slice(0, 48) || "maydan";
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
