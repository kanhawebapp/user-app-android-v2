import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import ManglikDoshaView from '../components/ManglikDoshaView';

type ManglikDoshaRouteParams = {
  result: any;
  serviceTitle?: string;
};

const ManglikDoshaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as ManglikDoshaRouteParams) || {};

  return (
    <ManglikDoshaView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default ManglikDoshaScreen;
