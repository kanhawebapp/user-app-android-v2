import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme';
import {ToastProvider} from './src/context/ToastContext';
import {ErrorBoundary, AppContent} from './src/components';
import type {Mode} from './src/theme/colors';
import OneSignalService from './src/services/notifications/OneSignalService';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';

const App: React.FC = () => {
  const [themeMode] = useState<Mode>('light');

  useEffect(() => {
    OneSignalService.init();
  }, []);

  const analytics = getAnalytics();

  useEffect(() => {
    const testAnalytics = async () => {
      try {
        await logEvent(analytics, 'app_test_open');
        console.log('Analytics event sent');
      } catch (error) {
        console.log('Analytics error:', error);
      }
    };

    testAnalytics();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider mode={themeMode}>
        <ToastProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
