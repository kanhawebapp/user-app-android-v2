import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';

import HoroscopeDetailsView from './HoroscopeDetailsView';

type HoroscopeDetailsRouteParams = {
  zodiacName?: string;
};

const HoroscopeDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {zodiacName} = (route.params as HoroscopeDetailsRouteParams) || {};

  return (
    <HoroscopeDetailsView
      zodiacName={zodiacName || ''}
      onBack={() => navigation.goBack()}
    />
  );
};

export default HoroscopeDetailsScreen;
