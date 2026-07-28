/**
 * call.constants.ts
 * Centralized constants for the call screen.
 */

import type {AppStateStatus} from 'react-native';

export const APP_STATE_ACTIVE = 'active';

export const APP_STATE_MATCH_REGEX = /active/;

export const UNANSWERED_CALL_TIMEOUT_MS = 60_000;

/** Seconds before countdown hits zero that forces call end from server */
export const CALL_DURATION_COUNTDOWN_INTERVAL_MS = 1_000;

/** Audio permission name */
export const RECORD_AUDIO_PERMISSION = 'android.permission.RECORD_AUDIO';

/** Ringback tones */
export function isAppStateActive(state: AppStateStatus): boolean {
  return APP_STATE_MATCH_REGEX.test(state);
}
