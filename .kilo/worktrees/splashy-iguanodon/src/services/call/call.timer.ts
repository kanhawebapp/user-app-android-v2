import {useCallStore} from './call.store';

class CallTimerService {
  private static instance: CallTimerService | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunningFlag: boolean = false;

  private constructor() {}

  static getInstance(): CallTimerService {
    if (!CallTimerService.instance) {
      CallTimerService.instance = new CallTimerService();
    }
    return CallTimerService.instance;
  }

  startCountdown(seconds: number): void {
    if (this.intervalId) {
      console.log('[CallTimer] already running');
      return;
    }

    useCallStore.getState().setCallDurationRemaining(seconds);
    console.log('[CallTimer] start');
    this.isRunningFlag = true;

    // this.intervalId = setInterval(() => {
    //   const remaining = useCallStore.getState().callDurationRemaining;
    //   console.log(
    //     '[CallTimer] REAL TICK',
    //     Date.now(),
    //     remaining,
    //   );

    //   if (remaining <= 0) {
    //     console.log('[CallTimer] tick: time uppppp', remaining);
    //     this.stopCountdown();
    //     useCallStore.getState().setStatus('ended');
    //     return;
    //   }

    //   console.log('[CallTimer] tick', remaining);
    //   useCallStore.getState().setCallDurationRemaining(remaining - 1);
    // }, 1000);

    const startedAt = Date.now();
    const initialSeconds = seconds;

    this.intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);

      const remaining = initialSeconds - elapsedSeconds;

      console.log('[CallTimer] ACCURATE TICK', {
        elapsedSeconds,
        remaining,
        now: Date.now(),
      });

      if (remaining <= 0) {
        this.stopCountdown();
        useCallStore.getState().setCallDurationRemaining(0);
        useCallStore.getState().setStatus('ended');
        return;
      }

      useCallStore.getState().setCallDurationRemaining(remaining);
    }, 1000);
  }

  stopCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[CallTimer] stop');
    }
    this.isRunningFlag = false;
  }

  resetCountdown(): void {
    this.stopCountdown();
    useCallStore.getState().setCallDurationRemaining(0);
    console.log('[CallTimer] cleanup');
  }

  isRunning(): boolean {
    return this.isRunningFlag && this.intervalId !== null;
  }

  forceCleanup(): void {
    this.stopCountdown();
    useCallStore.getState().setCallDurationRemaining(0);
  }
}

export const callTimerService = CallTimerService.getInstance();

export const useCallTimer = () => {
  const startCountdown = (seconds: number) =>
    callTimerService.startCountdown(seconds);
  const stopCountdown = () => callTimerService.stopCountdown();
  const resetCountdown = () => callTimerService.resetCountdown();
  const isRunning = callTimerService.isRunning();

  return {
    startCountdown,
    stopCountdown,
    resetCountdown,
    isRunning,
  };
};
