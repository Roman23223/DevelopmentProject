// Локальная дата в виде "2026-10-12".
// НЕ toISOString() — он отдаёт UTC, и до 3 ночи по Москве вернёт вчерашний день.
export function todayKey(timestamp = Date.now()) {
  const d = new Date(timestamp);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
