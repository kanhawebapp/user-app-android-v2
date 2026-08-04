import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import GeneralLifePredictionView from '../components/GeneralLifePredictionView';

type GeneralLifePredictionRouteParams = {
  result: any;
  serviceTitle?: string;
};

const GeneralLifePredictionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as GeneralLifePredictionRouteParams) || {};

  return (
    <GeneralLifePredictionView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default GeneralLifePredictionScreen;
