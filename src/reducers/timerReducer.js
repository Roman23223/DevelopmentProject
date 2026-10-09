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

export const DURATIONS = {
  [PHASES.WORK]: 25 * 60,
  [PHASES.SHORT_BREAK]: 5 * 60,
  [PHASES.LONG_BREAK]: 15 * 60,
};

export const ROUNDS_BEFORE_LONG_BREAK = 4;

export const TIMER_ACTIONS = {
  START: "start",
  PAUSE: "pause",
  RESET: "reset",
  TICK: "tick",
};

export const initialTimerState = {
  phase: PHASES.WORK,
  secondsLeft: DURATIONS[PHASES.WORK],
  isRunning: false,
  round: 0,
  completedToday: 0,
};

function startNextPhase(state) {
  if (state.phase !== PHASES.WORK) {
    return { ...state, phase: PHASES.WORK, secondsLeft: DURATIONS[PHASES.WORK] };
  }

  const round = state.round + 1;
  const isLong = round % ROUNDS_BEFORE_LONG_BREAK === 0;
  const phase = isLong ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK;

  return {
    ...state,
    phase,
    secondsLeft: DURATIONS[phase],
    round: isLong ? 0 : round,
    completedToday: state.completedToday + 1,
  };
}

export function timerReducer(state, action) {
  switch (action.type) {
    case TIMER_ACTIONS.START:
      return { ...state, isRunning: true };

    case TIMER_ACTIONS.PAUSE:
      return { ...state, isRunning: false };

    case TIMER_ACTIONS.RESET:
      return {
        ...state,
        phase: PHASES.WORK,
        secondsLeft: DURATIONS[PHASES.WORK],
        isRunning: false,
        round: 0,
      };

    case TIMER_ACTIONS.TICK:
      if (state.secondsLeft > 0) {
        return { ...state, secondsLeft: state.secondsLeft - 1 };
      }
      return startNextPhase(state);

    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
}
