// ============================================
// DhwaniAstro - Crash Recovery Manager
// ============================================

import {loggingService} from '../logging';
import {mmkvStorage, STORAGE_KEYS} from '../storage/mmkv.storage';
import type {
  ActiveSession,
  CrashRecoveryState,
  PendingAction,
  SessionType,
} from '../../types/global.types';

/**
 * Crash Recovery Manager
 * Handles session restoration and pending action recovery after app crash/restart
 */
class CrashRecoveryManager {
  private static instance: CrashRecoveryManager;
  private isInitialized = false;
  private recoveryListeners: Set<(state: CrashRecoveryState) => void> =
    new Set();

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): CrashRecoveryManager {
    if (!CrashRecoveryManager.instance) {
      CrashRecoveryManager.instance = new CrashRecoveryManager();
    }
    return CrashRecoveryManager.instance;
  }

  /**
   * Initialize crash recovery system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      loggingService.info(
        '[CrashRecovery] Initializing crash recovery manager',
      );
      this.isInitialized = true;
      loggingService.info('[CrashRecovery] Crash recovery manager initialized');
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to initialize', {error});
    }
  }

  /**
   * Handle app crash
   */
  private handleCrash(error: unknown): void {
    try {
      const currentSession = this.getActiveSession();

      const crashState: CrashRecoveryState = {
        lastSessionId: currentSession?.id,
        lastSessionType: currentSession?.type,
        crashTimestamp: new Date().toISOString(),
        recoveryAttempted: false,
        restoredSession: currentSession || null,
        pendingActions: this.getPendingActions(),
      };

      this.saveCrashState(crashState);
      loggingService.warn(
        '[CrashRecovery] Crash state saved',
        crashState as unknown as Record<string, unknown>,
      );
    } catch (e) {
      loggingService.error('[CrashRecovery] Failed to save crash state', {e});
    }
  }

  /**
   * Save crash state to storage
   */
  private saveCrashState(state: CrashRecoveryState): void {
    try {
      mmkvStorage.setItem(
        STORAGE_KEYS.CRASH_RECOVERY_STATE,
        JSON.stringify(state),
      );
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to save crash state', {
        error,
      });
    }
  }

  /**
   * Get saved crash state
   */
  getCrashState(): CrashRecoveryState | null {
    try {
      const state = mmkvStorage.getItem(STORAGE_KEYS.CRASH_RECOVERY_STATE);
      if (state) {
        return JSON.parse(state) as CrashRecoveryState;
      }
      return null;
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to get crash state', {
        error,
      });
      return null;
    }
  }

  /**
   * Get active session from storage
   */
  getActiveSession(): ActiveSession | null {
    try {
      const session = mmkvStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (session) {
        return JSON.parse(session) as ActiveSession;
      }
      return null;
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to get active session', {
        error,
      });
      return null;
    }
  }

  /**
   * Save active session to storage
   */
  saveActiveSession(session: ActiveSession | null): void {
    try {
      if (session) {
        mmkvStorage.setItem(
          STORAGE_KEYS.ACTIVE_SESSION,
          JSON.stringify(session),
        );
      } else {
        mmkvStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to save active session', {
        error,
      });
    }
  }

  /**
   * Get pending actions from storage
   */
  getPendingActions(): PendingAction[] {
    try {
      const actions = mmkvStorage.getItem(STORAGE_KEYS.CRASH_RECOVERY_STATE);
      if (actions) {
        const state = JSON.parse(actions) as CrashRecoveryState;
        return state.pendingActions || [];
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Add pending action
   */
  addPendingAction(action: PendingAction): void {
    try {
      const existingState = mmkvStorage.getItem(
        STORAGE_KEYS.CRASH_RECOVERY_STATE,
      );
      const state: CrashRecoveryState = existingState
        ? JSON.parse(existingState)
        : {
            crashTimestamp: new Date().toISOString(),
            recoveryAttempted: false,
            restoredSession: null,
            pendingActions: [],
          };

      state.pendingActions = [...state.pendingActions, action];
      this.saveCrashState(state);
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to add pending action', {
        error,
      });
    }
  }

  /**
   * Clear pending action
   */
  clearPendingAction(actionId: string): void {
    try {
      const state = this.getCrashState();
      if (state) {
        state.pendingActions = state.pendingActions.filter(
          a => a.id !== actionId,
        );
        this.saveCrashState(state);
      }
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to clear pending action', {
        error,
      });
    }
  }

  /**
   * Attempt to recover from crash
   */
  async attemptRecovery(): Promise<CrashRecoveryState> {
    const crashState = this.getCrashState() || {
      crashTimestamp: new Date().toISOString(),
      recoveryAttempted: false,
      restoredSession: null,
      pendingActions: [],
    };

    crashState.recoveryAttempted = true;

    try {
      loggingService.info(
        '[CrashRecovery] Attempting recovery',
        crashState as unknown as Record<string, unknown>,
      );

      // Restore active session if exists
      if (crashState.restoredSession) {
        loggingService.info(
          '[CrashRecovery] Restoring session',
          crashState.restoredSession as unknown as Record<string, unknown>,
        );
      }

      // Process pending actions
      for (const action of crashState.pendingActions) {
        await this.processPendingAction(action);
      }

      // Clear crash state after successful recovery
      this.clearCrashState();

      // Notify listeners
      this.notifyRecoveryListeners(crashState);

      loggingService.info(
        '[CrashRecovery] Recovery completed',
        crashState as unknown as Record<string, unknown>,
      );
    } catch (error) {
      loggingService.error('[CrashRecovery] Recovery failed', {error});
    }

    return crashState;
  }

  /**
   * Process a pending action
   */
  private async processPendingAction(action: PendingAction): Promise<void> {
    loggingService.info('[CrashRecovery] Processing pending action', {action});

    try {
      switch (action.type) {
        case 'payment':
          // TODO: Verify and process pending payment
          break;
        case 'message':
          // TODO: Resend pending messages
          break;
        case 'call':
          // TODO: Clean up call session
          break;
      }

      this.clearPendingAction(action.id);
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to process action', {
        action,
        error,
      });
    }
  }

  /**
   * Clear crash state
   */
  clearCrashState(): void {
    try {
      mmkvStorage.removeItem(STORAGE_KEYS.CRASH_RECOVERY_STATE);
      mmkvStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      loggingService.error('[CrashRecovery] Failed to clear crash state', {
        error,
      });
    }
  }

  /**
   * Register recovery listener
   */
  addRecoveryListener(
    listener: (state: CrashRecoveryState) => void,
  ): () => void {
    this.recoveryListeners.add(listener);
    return () => {
      this.recoveryListeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of recovery state
   */
  private notifyRecoveryListeners(state: CrashRecoveryState): void {
    this.recoveryListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        loggingService.error('[CrashRecovery] Listener error', {error});
      }
    });
  }

  /**
   * Save session state for crash recovery
   */
  saveSessionState(
    type: SessionType,
    sessionId: string,
    metadata?: Record<string, unknown>,
  ): void {
    const session: ActiveSession = {
      id: sessionId,
      type,
      status: 'active',
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      metadata,
    };

    this.saveActiveSession(session);
  }

  /**
   * Update session activity timestamp
   */
  updateSessionActivity(): void {
    const session = this.getActiveSession();
    if (session) {
      session.lastActivityAt = new Date().toISOString();
      this.saveActiveSession(session);
    }
  }

  /**
   * End session and clear crash recovery state
   */
  endSession(): void {
    this.saveActiveSession(null);
    // Clear all pending actions when session ends
    const state = this.getCrashState();
    if (state) {
      state.pendingActions = [];
      this.saveCrashState(state);
    }
    loggingService.info(
      '[CrashRecovery] Session ended, recovery state cleared',
    );
  }
}

export const crashRecoveryManager = CrashRecoveryManager.getInstance();
export default crashRecoveryManager;
