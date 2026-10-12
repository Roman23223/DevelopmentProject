export const MIN_MINUTES = 1;
export const MAX_MINUTES = 90;

// Из того, что ввёл пользователь, делаем целое число минут в границах.
// Мусор ("", "abc", "3.7") → fallback.
export function clampMinutes(value, fallbackMinutes) {
  // Осторожно: Number("") === 0, а не NaN — пустое поле надо отсечь отдельно
  const text = String(value ?? "").trim();
  if (text === "") return fallbackMinutes;

  const parsed = Math.round(Number(text));
  if (!Number.isFinite(parsed)) return fallbackMinutes;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, parsed));
}
