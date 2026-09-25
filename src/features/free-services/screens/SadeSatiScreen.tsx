import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import SadeSatiView from '../components/SadeSatiView';

type SadeSatiRouteParams = {
  result: any;
  serviceTitle?: string;
};

const SadeSatiScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as SadeSatiRouteParams) || {};

  return (
    <SadeSatiView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default SadeSatiScreen;
