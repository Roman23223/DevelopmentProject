export function notificationPermission() {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

export async function requestNotificationPermission() {
  const current = notificationPermission();
  if (current !== "default") return current; // переспросить нельзя
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function showNotification(title, body) {
  if (notificationPermission() !== "granted") return;
  try {
    // tag — чтобы новое уведомление заменяло старое, а не копилось стопкой
    new Notification(title, { body, tag: "pomodoro" });
  } catch (e) {
    console.error("Не удалось показать уведомление:", e);
  }
}
