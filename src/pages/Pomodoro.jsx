import { useReducer, useEffect, useState, useRef } from "react";
import {
  timerReducer,
  initialTimerState,
  TIMER_ACTIONS,
  PHASE_LABELS,
  PHASES,
  ROUNDS_BEFORE_LONG_BREAK,
} from "@/reducers/timerReducer";
import Styles from "@styles/pomodoro/Pomodoro.module.css";
import DurationInput from "@components/pomodoro/DurationInput";
import {
  readDurations,
  readStats,
  readAlerts,
  writeDurations,
  writeStats,
  writeAlerts,
} from "@utils/pomodoro/storage";
import { unlockAudio, playBeep } from "@utils/pomodoro/sound";
import {
  notificationPermission,
  requestNotificationPermission,
  showNotification,
} from "@utils/pomodoro/notify";

// Снаружи компонента: ничего из него не использует
function init() {
  const durations = readDurations();
  const stats = readStats();

  return {
    ...initialTimerState,
    durations,
    alerts: readAlerts(),
    secondsLeft: durations[PHASES.WORK],
    statsDate: stats.date,
    completedToday: stats.count,
  };
}

export default function Pomodoro() {
  // 1. Состояние — всё остальное на него опирается
  const [state, dispatch] = useReducer(timerReducer, undefined, init);
  const [permission, setPermission] = useState(notificationPermission);
  const seenPhases = useRef(state.completedPhases);

  // 2. Эффекты
  useEffect(() => {
    document.title = "Помодоро";
  }, []);

  useEffect(() => {
    writeDurations(state.durations);
  }, [state.durations]);

  useEffect(() => {
    writeStats(state.statsDate, state.completedToday);
  }, [state.statsDate, state.completedToday]);

  useEffect(() => {
    writeAlerts(state.alerts);
  }, [state.alerts]);

  // Сигнал при автоматической смене фазы
  useEffect(() => {
    if (state.completedPhases === seenPhases.current) return;
    seenPhases.current = state.completedPhases;

    const toWork = state.phase === PHASES.WORK;

    if (state.alerts.sound) playBeep(toWork ? 880 : 660);
    if (state.alerts.notifications) {
      showNotification(
        toWork ? "Перерыв закончен" : "Помидор готов",
        toWork ? "Пора возвращаться к работе" : "Можно отдохнуть"
      );
    }
  }, [state.completedPhases, state.phase, state.alerts]);

  // Пока таймер идёт — живёт интервал. Остановился или ушли со страницы —
  // React вызовет очистку и уберёт его сам.
  useEffect(() => {
    if (!state.isRunning) return;

    const id = setInterval(() => {
      dispatch({ type: TIMER_ACTIONS.TICK, payload: { now: Date.now() } });
    }, 250);

    return () => clearInterval(id);
  }, [state.isRunning]);

  // 3. Вычисления для разметки
  const minutes = String(Math.floor(state.secondsLeft / 60)).padStart(2, "0");
  const seconds = String(state.secondsLeft % 60).padStart(2, "0");

  const isWork = state.phase === PHASES.WORK;
  const roundLabel = isWork
    ? `подход ${state.round + 1} из ${ROUNDS_BEFORE_LONG_BREAK}`
    : "перерыв";

  // 4. Обработчики — внутри, потому что им нужны dispatch и setPermission
  function handleStart() {
    unlockAudio(); // пользуемся кликом, чтобы разбудить звук
    dispatch({ type: TIMER_ACTIONS.START, payload: { now: Date.now() } });
  }

  function handlePause() {
    dispatch({ type: TIMER_ACTIONS.PAUSE, payload: { now: Date.now() } });
  }

  function handleReset() {
    dispatch({ type: TIMER_ACTIONS.RESET });
  }

  function handleSetDuration(phase, minutes) {
    dispatch({ type: TIMER_ACTIONS.SET_DURATION, payload: { phase, minutes } });
  }

  function handleSoundToggle(e) {
    const enabled = e.target.checked;
    dispatch({ type: TIMER_ACTIONS.SET_ALERT, payload: { kind: "sound", enabled } });
    if (enabled) {
      unlockAudio();
      playBeep(); // сразу слышно, что включил
    }
  }

  async function handleNotificationsToggle(e) {
    if (!e.target.checked) {
      dispatch({
        type: TIMER_ACTIONS.SET_ALERT,
        payload: { kind: "notifications", enabled: false },
      });
      return;
    }
    const result = await requestNotificationPermission();
    setPermission(result);
    dispatch({
      type: TIMER_ACTIONS.SET_ALERT,
      payload: { kind: "notifications", enabled: result === "granted" },
    });
  }

  return (
    <div className={Styles.page}>
      <h1 className={Styles.pageTitle}>Помодоро</h1>

      <div className={Styles.pomodoroContainer}>
        <div className={isWork ? Styles.typeTimer : Styles.typeTimerBreak}>
          {PHASE_LABELS[state.phase]}
        </div>

        <div className={Styles.timer}>
          {minutes}:{seconds}
        </div>

        <div className={Styles.round}>
          {roundLabel} · сегодня: {state.completedToday}
        </div>

        <div className={Styles.controls}>
          {state.isRunning ? (
            <button type="button" className={Styles.button} onClick={handlePause}>
              Пауза
            </button>
          ) : (
            <button type="button" className={Styles.button} onClick={handleStart}>
              Старт
            </button>
          )}
          <button type="button" className={Styles.buttonSecondary} onClick={handleReset}>
            Сброс
          </button>
        </div>

        <div className={Styles.settings}>
          <DurationInput
            label="Работа"
            phase={PHASES.WORK}
            minutes={state.durations[PHASES.WORK] / 60}
            disabled={state.isRunning}
            onCommit={handleSetDuration}
          />
          <DurationInput
            label="Перерыв"
            phase={PHASES.SHORT_BREAK}
            minutes={state.durations[PHASES.SHORT_BREAK] / 60}
            disabled={state.isRunning}
            onCommit={handleSetDuration}
          />
          <DurationInput
            label="Длинный"
            phase={PHASES.LONG_BREAK}
            minutes={state.durations[PHASES.LONG_BREAK] / 60}
            disabled={state.isRunning}
            onCommit={handleSetDuration}
          />
        </div>

        {state.isRunning && <p className={Styles.settingsHint}>Настройки доступны на паузе</p>}

        <div className={Styles.alerts}>
          <label className={Styles.alertToggle}>
            <input type="checkbox" checked={state.alerts.sound} onChange={handleSoundToggle} />
            Звук
          </label>

          <label className={Styles.alertToggle}>
            <input
              type="checkbox"
              checked={state.alerts.notifications}
              onChange={handleNotificationsToggle}
              disabled={permission === "denied" || permission === "unsupported"}
            />
            Уведомления
          </label>
        </div>

        {permission === "denied" && (
          <p className={Styles.settingsHint}>
            Уведомления заблокированы в настройках сайта — разрешите их в браузере
          </p>
        )}
      </div>
    </div>
  );
}
