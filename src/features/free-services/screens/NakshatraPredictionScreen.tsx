import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import NakshatraPredictionView from '../components/NakshatraPredictionView';

type NakshatraPredictionRouteParams = {
  result: any;
  serviceTitle?: string;
};

const NakshatraPredictionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as NakshatraPredictionRouteParams) || {};

  return (
    <NakshatraPredictionView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default NakshatraPredictionScreen;
