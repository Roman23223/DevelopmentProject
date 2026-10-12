import { clampMinutes, MIN_MINUTES, MAX_MINUTES } from "@utils/pomodoro/duration";
import Styles from "@styles/pomodoro/Pomodoro.module.css";

export default function DurationInput({ label, phase, minutes, disabled, onCommit }) {
  function handleBlur(e) {
    const value = clampMinutes(e.target.value, minutes);
    e.target.value = String(value); // поправляем поле, если ввели ерунду
    onCommit(phase, value);
  }

  return (
    <label className={Styles.settingsField}>
      <span className={Styles.settingsLabel}>{label}</span>
      <input
        className={Styles.settingsInput}
        type="number"
        min={MIN_MINUTES}
        max={MAX_MINUTES}
        defaultValue={minutes}
        disabled={disabled}
        onBlur={handleBlur}
      />
    </label>
  );
}
