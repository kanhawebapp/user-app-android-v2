import {OneSignal} from 'react-native-onesignal';

class OneSignalService {
  // private appId = '4d271e90-fc1e-496a-992b-36fb0ea43b33';
  private appId = 'e84db3b2-3286-47c4-ac4f-cbf86b86ff91';
  private initialized = false;

  init() {
    if (this.initialized) {
      return;
    }

    OneSignal.initialize(this.appId);
    this.initialized = true;

    // Request permission (Android 13+)
    OneSignal.Notifications.requestPermission(true);

    // Notification opened
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      console.log('Notification Clicked:', event);
    });

    // Foreground notification
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (event: {
        preventDefault: () => void;
        notification: {display: () => void};
      }) => {
        console.log('Foreground Notification:', event);
        event.preventDefault();
        event.notification.display();
      },
    );
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Freshly reads the OneSignal push subscription ID (Player ID) from the SDK.
   * Does not use Redux or other cached app state.
   * Returns null when unavailable so auth can proceed without playerId.
   */
  async getPlayerId(): Promise<string | null> {
    try {
      if (!this.initialized) {
        console.log('[OneSignal] Not initialized; skipping playerId');
        return null;
      }

      const [hasPermission, isOptedIn] = await Promise.all([
        OneSignal.Notifications.getPermissionAsync(),
        OneSignal.User.pushSubscription.getOptedInAsync(),
      ]);

      console.log('[OneSignal] Permission/subscription status:', {
        hasPermission,
        isOptedIn,
      });

      if (!hasPermission && !isOptedIn) {
        console.log(
          '[OneSignal] No permission/subscription; skipping playerId',
        );
        return null;
      }

      const playerId = await OneSignal.User.pushSubscription.getIdAsync();

      if (
        typeof playerId !== 'string' ||
        !playerId.trim() ||
        playerId.trim().toLowerCase() === 'null'
      ) {
        console.log('[OneSignal] playerId unavailable from SDK');
        return null;
      }

      return playerId.trim();
    } catch (error) {
      console.log('[OneSignal] Failed to get playerId:', error);
      return null;
    }
  }

  setExternalUserId(userId: string) {
    OneSignal.login(userId);
  }

  logout() {
    OneSignal.logout();
  }
}

const oneSignalService = new OneSignalService();

export {oneSignalService};
export default oneSignalService;
