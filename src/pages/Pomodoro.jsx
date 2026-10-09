import { useReducer, useEffect } from "react";
import {
  timerReducer,
  initialTimerState,
  TIMER_ACTIONS,
  PHASE_LABELS,
  PHASES,
  ROUNDS_BEFORE_LONG_BREAK,
} from "@/reducers/timerReducer";
import Styles from "@styles/pomodoro/Pomodoro.module.css";

export default function Pomodoro() {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);

  useEffect(() => {
    document.title = "Помодоро";
  }, []);

  // Пока таймер идёт — живёт интервал. Остановился или ушли со страницы —
  // React вызовет очистку и уберёт его сам.
  useEffect(() => {
    if (!state.isRunning) return;

    const id = setInterval(() => {
      dispatch({ type: TIMER_ACTIONS.TICK });
    }, 1000);

    return () => clearInterval(id);
  }, [state.isRunning]);

  const minutes = String(Math.floor(state.secondsLeft / 60)).padStart(2, "0");
  const seconds = String(state.secondsLeft % 60).padStart(2, "0");

  const isWork = state.phase === PHASES.WORK;
  const roundLabel = isWork
    ? `подход ${state.round + 1} из ${ROUNDS_BEFORE_LONG_BREAK}`
    : "перерыв";

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
            <button
              type="button"
              className={Styles.button}
              onClick={() => dispatch({ type: TIMER_ACTIONS.PAUSE })}
            >
              Пауза
            </button>
          ) : (
            <button
              type="button"
              className={Styles.button}
              onClick={() => dispatch({ type: TIMER_ACTIONS.START })}
            >
              Старт
            </button>
          )}
          <button
            type="button"
            className={Styles.buttonSecondary}
            onClick={() => dispatch({ type: TIMER_ACTIONS.RESET })}
          >
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
}
