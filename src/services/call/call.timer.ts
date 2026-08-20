import {AppState, AppStateStatus} from 'react-native';
import {useCallStore} from './call.store';

class CallTimerService {
  private static instance: CallTimerService | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private endTimestamp: number | null = null;
  private isRunningFlag: boolean = false;
  private appStateSubscription: {remove: () => void} | null = null;

  private constructor() {}

  static getInstance(): CallTimerService {
    if (!CallTimerService.instance) {
      CallTimerService.instance = new CallTimerService();
    }
    return CallTimerService.instance;
  }

  private computeRemaining(): number {
    if (this.endTimestamp === null) {
      return 0;
    }
    return Math.max(
      0,
      Math.ceil((this.endTimestamp - Date.now()) / 1000),
    );
  }

  private syncRemaining(): number {
    const remaining = this.computeRemaining();
    useCallStore.getState().setCallDurationRemaining(remaining);
    return remaining;
  }

  private clearForegroundInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunningFlag = false;
  }

  private startForegroundInterval(): void {
    this.clearForegroundInterval();
    this.isRunningFlag = true;

    this.intervalId = setInterval(() => {
      if (this.endTimestamp === null) {
        this.clearForegroundInterval();
        return;
      }

      const remaining = this.syncRemaining();
      if (remaining <= 0) {
        useCallStore.getState().setCallDurationRemaining(0);
        this.clearForegroundInterval();
        this.removeAppStateListener();
      }
    }, 1000);
  }

  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState !== 'active' || this.endTimestamp === null) {
      return;
    }

    if (useCallStore.getState().status !== 'connected') {
      return;
    }

    console.log('[CallTimer] App returned to foreground — recalculating remaining');

    const remaining = this.syncRemaining();

    if (remaining <= 0) {
      useCallStore.getState().setCallDurationRemaining(0);
      this.clearForegroundInterval();
      this.removeAppStateListener();
      return;
    }

    this.startForegroundInterval();
  };

  private ensureAppStateListener(): void {
    if (this.appStateSubscription) {
      return;
    }
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  private removeAppStateListener(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  startCountdown(seconds: number): void {
    if (this.endTimestamp !== null && this.intervalId !== null) {
      console.log('[CallTimer] already running');
      return;
    }

    this.clearForegroundInterval();
    this.removeAppStateListener();

    if (seconds <= 0) {
      this.endTimestamp = null;
      useCallStore.getState().setCallDurationRemaining(0);
      return;
    }

    this.endTimestamp = Date.now() + seconds * 1000;
    console.log('[CallTimer] start', {seconds, endTimestamp: this.endTimestamp});

    this.syncRemaining();
    this.startForegroundInterval();
    this.ensureAppStateListener();
  }

  stopCountdown(): void {
    this.clearForegroundInterval();
    this.removeAppStateListener();
    this.endTimestamp = null;
    console.log('[CallTimer] stop');
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
