import { useEffect } from 'react';
import AnalyticsService from '../AnalyticsService';

const useScreenTracking = (screenName: string) => {
  useEffect(() => {
    if (!screenName) return;

    AnalyticsService.logScreen(screenName);
  }, [screenName]);
};

export default useScreenTracking;

