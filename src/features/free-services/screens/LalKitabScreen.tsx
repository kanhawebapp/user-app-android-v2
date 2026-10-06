import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import LalKitabView from '../components/LalKitabView';

type LalKitabRouteParams = {
  result: any;
  serviceTitle?: string;
};

const LalKitabScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as LalKitabRouteParams) || {};

  return (
    <LalKitabView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default LalKitabScreen;
