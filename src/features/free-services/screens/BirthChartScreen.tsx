import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import BirthChartView from '../components/BirthChartView';

type BirthChartRouteParams = {
  result?: any;
  serviceTitle?: string;
};

const BirthChartScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as BirthChartRouteParams) || {};

  return (
    <BirthChartView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default BirthChartScreen;
