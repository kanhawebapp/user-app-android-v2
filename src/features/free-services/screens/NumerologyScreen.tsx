import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import NumerologyView from '../components/NumerologyView';

type NumerologyRouteParams = {
  result: any;
  serviceTitle?: string;
};

const NumerologyScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as NumerologyRouteParams) || {};

  return (
    <NumerologyView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default NumerologyScreen;
