import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import PitraDoshaView from '../components/PitraDoshaView';

type PitraDoshaRouteParams = {
  result: any;
  serviceTitle?: string;
};

const PitraDoshaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as PitraDoshaRouteParams) || {};

  return (
    <PitraDoshaView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default PitraDoshaScreen;
