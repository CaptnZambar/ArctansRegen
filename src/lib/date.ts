const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Convert an ISO timestamp to "dd/mm/yyyy HH:MM:SS"
 * @param iso — the ISO‑format date string
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const day    = pad(d.getDate());
  const month  = pad(d.getMonth() + 1);
  const year   = d.getFullYear();
  const hours  = pad(d.getHours());
  const mins   = pad(d.getMinutes());
  const secs   = pad(d.getSeconds());
  return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
}