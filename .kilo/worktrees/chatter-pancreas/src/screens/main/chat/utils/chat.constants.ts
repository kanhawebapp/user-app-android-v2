export const TIMER_THRESHOLDS = {
  SAFE: 60,
  WARNING: 20,
  CRITICAL: 10,
} as const;

export const getTimerColorCode = (
  timeLeft: number,
  getColor: (key: string) => string,
): string => {
  if (timeLeft > TIMER_THRESHOLDS.SAFE) {
    return getColor('success.main');
  }
  if (timeLeft > TIMER_THRESHOLDS.WARNING) {
    return getColor('warning.main');
  }
  return getColor('error.main');
};

export const RECEIVE_MESSAGE_EVENTS = ['receive_message'] as const;

export const TYPING_EVENTS = ['typing', 'typing_status'] as const;

export const CHAT_COMPLETED_EVENTS = [
  'chatCompleted',
  'chat_completed',
  'chatCompletedByAstrologer',
] as const;

export const RECHARGE_SUCCESS_EVENTS = [
  'recharge_complted',
  'recharge_completed',
  'recharge_success',
] as const;

export const RECHARGE_FAIL_EVENTS = [
  'customer_recharge_fail',
  'recharge_failed',
] as const;

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than a minute';
  }
  if (minutes === 1) {
    return '1 minute';
  }
  return `${minutes} minutes`;
};
