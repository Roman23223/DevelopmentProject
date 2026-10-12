import { PHASES, DEFAULT_DURATIONS } from "@/reducers/timerReducer";
import { MIN_MINUTES, MAX_MINUTES } from "@utils/pomodoro/duration";
import { todayKey } from "@utils/pomodoro/date";

const DURATIONS_KEY = "pomodoroDurations";
const STATS_KEY = "pomodoroStats";

function isValidSeconds(value) {
  return Number.isInteger(value) && value >= MIN_MINUTES * 60 && value <= MAX_MINUTES * 60;
}

export function readDurations() {
  try {
    const saved = JSON.parse(localStorage.getItem(DURATIONS_KEY) ?? "null");
    if (!saved || typeof saved !== "object") return DEFAULT_DURATIONS;

    // Проверяем каждое поле отдельно: одно испорченное не должно
    // обнулить остальные настройки
    const result = { ...DEFAULT_DURATIONS };
    for (const phase of Object.values(PHASES)) {
      if (isValidSeconds(saved[phase])) result[phase] = saved[phase];
    }
    return result;
  } catch {
    return DEFAULT_DURATIONS;
  }
}

export function readStats(now = Date.now()) {
  const today = todayKey(now);
  const empty = { date: today, count: 0 };

  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY) ?? "null");
    if (!saved || saved.date !== today) return empty;
    if (!Number.isInteger(saved.count) || saved.count < 0) return empty;
    return { date: saved.date, count: saved.count };
  } catch {
    return empty;
  }
}

export function writeDurations(durations) {
  try {
    localStorage.setItem(DURATIONS_KEY, JSON.stringify(durations));
  } catch (e) {
    console.error("Не удалось сохранить настройки:", e);
  }
}

export function writeStats(date, count) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify({ date, count }));
  } catch (e) {
    console.error("Не удалось сохранить статистику:", e);
  }
}

const ALERTS_KEY = "pomodoroAlerts";

export function readAlerts() {
  const defaults = { sound: true, notifications: false };
  try {
    const saved = JSON.parse(localStorage.getItem(ALERTS_KEY) ?? "null");
    if (!saved || typeof saved !== "object") return defaults;
    return {
      sound: typeof saved.sound === "boolean" ? saved.sound : defaults.sound,
      notifications:
        typeof saved.notifications === "boolean" ? saved.notifications : defaults.notifications,
    };
  } catch {
    return defaults;
  }
}

export function writeAlerts(alerts) {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error("Не удалось сохранить настройки оповещений:", e);
  }
}
