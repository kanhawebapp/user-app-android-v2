import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * useCallLifecycle
 *
 * Tracks app-level events that affect the ongoing call:
 * - Detects when the app transitions from active → background
 * - Navigates back automatically when the call ends or is rejected
 *
 * Additional lifecycle hooks (headphone detection, audio-session
 * restoration, notification suppression) can be added here without
 * cluttering the screen component.
 */
export const useCallLifecycle = (
  status: string,
  participantId: string | null,
  endCall: (params: {roomId: string | null; astroId: string | null}) => void,
) => {
  const navigation = useNavigation();

  // App-state tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (AppState.currentState.match(/active/) && nextState === 'background') {
        console.log('[CallScreen] App went to background');
      }
    });
    return () => subscription.remove();
  }, []);

  // Navigate back when call ends or is rejected
  useEffect(() => {
    if (status === 'ended' || status === 'rejected') {
      if (navigation.canGoBack()) {
        console.log('[CallScreen] Call', status, '— navigating back');
        navigation.goBack();
      }
    }
  }, [status, navigation]);
};

/**
 * useAppStateListener
 *
 * A lighter hook that only tracks app-state changes and calls an
 * optional callback — useful when the caller needs only background
 * detection without navigation logic.
 */
export const useAppStateListener = (onBackground?: () => void) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (AppState.currentState.match(/active/) && nextState === 'background') {
        console.log('[AppState] App entered background');
        onBackground?.();
      }
    });
    return () => subscription.remove();
  }, [onBackground]);
};
