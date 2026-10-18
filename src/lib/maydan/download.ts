declare global {
  interface Window {
    AndroidDownloads?: {
      saveBase64: (filename: string, mimeType: string, base64: string) => string;
    };
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  if (typeof window !== "undefined" && window.AndroidDownloads) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const base64 = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : "";
      window.AndroidDownloads?.saveBase64(filename, blob.type || "application/octet-stream", base64);
    };
    reader.readAsDataURL(blob);
    return;
  }
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
