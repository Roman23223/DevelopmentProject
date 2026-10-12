import { todayKey } from "@utils/pomodoro/date";

export const PHASES = {
  WORK: "work",
  SHORT_BREAK: "short",
  LONG_BREAK: "long",
};

export const PHASE_LABELS = {
  [PHASES.WORK]: "Работа",
  [PHASES.SHORT_BREAK]: "Перерыв",
  [PHASES.LONG_BREAK]: "Длинный перерыв",
};

export const DEFAULT_DURATIONS = {
  [PHASES.WORK]: 25 * 60,
  [PHASES.SHORT_BREAK]: 5 * 60,
  [PHASES.LONG_BREAK]: 15 * 60,
};

export const ROUNDS_BEFORE_LONG_BREAK = 4;

// Сколько 00:00 стоит на экране перед сменой фазы
const ZERO_HOLD_MS = 1000;

export const TIMER_ACTIONS = {
  START: "start",
  PAUSE: "pause",
  RESET: "reset",
  TICK: "tick",
  SET_DURATION: "setDuration",
  SET_ALERT: "setAlert",
};

export const initialTimerState = {
  phase: PHASES.WORK,
  durations: DEFAULT_DURATIONS,
  secondsLeft: DEFAULT_DURATIONS[PHASES.WORK],
  endsAt: null,
  isRunning: false,
  round: 0,
  statsDate: null,
  completedToday: 0,
  completedPhases: 0,
  alerts: { sound: true, notifications: false },
};

function remainingSeconds(endsAt, now) {
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

// Фаза, которая идёт после текущей. startedAt — когда она начинается.
function nextPhaseState(state, startedAt) {
  if (state.phase !== PHASES.WORK) {
    return {
      ...state,
      phase: PHASES.WORK,
      secondsLeft: state.durations[PHASES.WORK],
      endsAt: startedAt + state.durations[PHASES.WORK] * 1000,
      completedPhases: state.completedPhases + 1,
    };
  }

  const round = state.round + 1;
  const isLong = round % ROUNDS_BEFORE_LONG_BREAK === 0;
  const phase = isLong ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK;

  // Помидор засчитывается в тот день, когда закончилась работа
  const day = todayKey(startedAt);
  const isNewDay = day !== state.statsDate;

  return {
    ...state,
    phase,
    secondsLeft: state.durations[phase],
    endsAt: startedAt + state.durations[phase] * 1000,
    round: isLong ? 0 : round,
    completedPhases: state.completedPhases + 1,
    statsDate: day,
    completedToday: isNewDay ? 1 : state.completedToday + 1,
  };
}

export function timerReducer(state, action) {
  switch (action.type) {
    case TIMER_ACTIONS.START:
      return {
        ...state,
        isRunning: true,
        endsAt: action.payload.now + state.secondsLeft * 1000,
      };

    case TIMER_ACTIONS.PAUSE:
      return {
        ...state,
        isRunning: false,
        secondsLeft: remainingSeconds(state.endsAt, action.payload.now),
        endsAt: null,
      };

    case TIMER_ACTIONS.RESET:
      return {
        ...state,
        phase: PHASES.WORK,
        secondsLeft: state.durations[PHASES.WORK],
        endsAt: null,
        isRunning: false,
        round: 0,
      };

    case TIMER_ACTIONS.SET_DURATION: {
      const { phase, minutes } = action.payload;
      const seconds = minutes * 60;
      if (state.durations[phase] === seconds) return state;

      const durations = { ...state.durations, [phase]: seconds };

      // Правим настройку текущей фазы на паузе — показываем новую длительность
      if (!state.isRunning && phase === state.phase) {
        return { ...state, durations, secondsLeft: seconds };
      }
      return { ...state, durations };
    }

    case TIMER_ACTIONS.SET_ALERT: {
      const { kind, enabled } = action.payload;
      if (state.alerts[kind] === enabled) return state;
      return { ...state, alerts: { ...state.alerts, [kind]: enabled } };
    }

    case TIMER_ACTIONS.TICK: {
      if (state.endsAt === null) return state;

      const { now } = action.payload;

      // Фаза ещё идёт
      if (now < state.endsAt) {
        const remaining = remainingSeconds(state.endsAt, now);
        if (remaining === state.secondsLeft) return state;
        return { ...state, secondsLeft: remaining };
      }

      // Дедлайн прошёл. Отматываем столько фаз, сколько успело закончиться,
      // считая каждую следующую от конца предыдущей — так время не плывёт.
      let next = state;
      let guard = 0;
      while (now >= next.endsAt + ZERO_HOLD_MS && guard++ < 10000) {
        next = nextPhaseState(next, next.endsAt + ZERO_HOLD_MS);
      }

      // Ни одна фаза не сменилась — значит держим 00:00
      if (next === state) {
        return state.secondsLeft === 0 ? state : { ...state, secondsLeft: 0 };
      }

      const remaining = remainingSeconds(next.endsAt, now);
      return remaining === next.secondsLeft ? next : { ...next, secondsLeft: remaining };
    }

    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
}
