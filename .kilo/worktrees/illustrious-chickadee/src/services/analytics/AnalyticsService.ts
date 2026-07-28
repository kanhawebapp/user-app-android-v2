import {
  getAnalytics,
  setUserId,
  setUserProperties,
  logEvent,
} from '@react-native-firebase/analytics';

const getAnalyticsInstance = () => getAnalytics();

class AnalyticsService {
  // Set User ID
  static async setUser(userId: string | null) {
    if (!userId) return;
    const analytics = getAnalyticsInstance();
    await setUserId(analytics, userId);
  }

  // Set User Properties
  static async setUserProperties(properties: {[key: string]: string | null}) {
    const analytics = getAnalyticsInstance();
    await setUserProperties(analytics, properties);
  }

  // Generic Event Logger
  static async logEvent(eventName: string, params: Record<string, any> = {}) {
    try {
      const analytics = getAnalyticsInstance();
      await logEvent(analytics, eventName, params);
      console.log(`📊 Analytics Event: ${eventName}`, params);
    } catch (error) {
      console.log('Analytics Error:', error);
    }
  }

  // Updated Screen Tracking (GA4 Standard)
  static async logScreen(screenName: string) {
    try {
      const analytics = getAnalyticsInstance();
      await logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenName,
      });
    } catch (error) {
      console.log('Screen Tracking Error:', error);
    }
  }

  // Purchase / Revenue Tracking (Revenue Dashboard Compatible)
  static async logPurchase(amount: number) {
    try {
      const analytics = getAnalyticsInstance();
      await logEvent(analytics, 'purchase', {
        currency: 'INR',
        value: amount,
      });
    } catch (error) {
      console.log('Purchase Tracking Error:', error);
    }
  }
}

export default AnalyticsService;
