let audioContext = null;

function getContext() {
  if (audioContext) return audioContext;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  audioContext = new Ctor();
  return audioContext;
}

// Браузер разрешает звук только после действия пользователя.
// Зовём это из обработчика клика, чтобы к моменту сигнала контекст уже проснулся.
export function unlockAudio() {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") ctx.resume();
}

export function playBeep(frequency = 880) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = frequency;

  // Плавное нарастание и затухание — без них слышен щелчок
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}
