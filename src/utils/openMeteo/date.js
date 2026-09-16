// '2026-09-16' → 'ср, 16 сент.'
export function formatDay(dateStr) {
  // T00:00:00 — парсим как ЛОКАЛЬНОЕ время, а не UTC
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// Первый день прогноза подписываем как «Сегодня»
export function isToday(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toDateString() === new Date().toDateString();
}