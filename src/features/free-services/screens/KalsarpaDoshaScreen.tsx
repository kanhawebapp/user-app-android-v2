import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import KalsarpaDoshaView from '../components/KalsarpaDoshaView';

type KalsarpaDoshaRouteParams = {
  result: any;
  serviceTitle?: string;
};

const KalsarpaDoshaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as KalsarpaDoshaRouteParams) || {};

  return (
    <KalsarpaDoshaView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default KalsarpaDoshaScreen;
