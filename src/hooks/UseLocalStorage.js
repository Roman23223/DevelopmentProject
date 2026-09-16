import { useState, useEffect } from 'react';

/**
 * Кастомный хук для работы с localStorage.
 * Автоматически сериализует/десериализует значения через JSON.
 *
 * @param {string} key — ключ в localStorage
 * @param {any} initialValue — значение по умолчанию (если ключа нет или значение невалидно)
 * @returns {[any, function]} — [текущее значение, функция установки]
 */
export function useLocalStorage(key, initialValue) {
  // Ленивая инициализация: читаем из localStorage один раз при монтировании
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      return JSON.parse(saved);
    } catch {
      // Если в localStorage мусор (битый JSON) — возвращаем initialValue
      return initialValue;
    }
  });

  // При каждом изменении value — пишем в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Не удалось сохранить "${key}" в localStorage:`, e);
    }
  }, [key, value]);

  return [value, setValue];
}