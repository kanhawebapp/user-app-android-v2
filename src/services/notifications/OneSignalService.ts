import {OneSignal} from 'react-native-onesignal';

class OneSignalService {
  // private appId = '4d271e90-fc1e-496a-992b-36fb0ea43b33';
  private appId = 'e84db3b2-3286-47c4-ac4f-cbf86b86ff91';

  init() {
    OneSignal.initialize(this.appId);

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

  setExternalUserId(userId: string) {
    OneSignal.login(userId);
  }

  logout() {
    OneSignal.logout();
  }
}

export default new OneSignalService();
