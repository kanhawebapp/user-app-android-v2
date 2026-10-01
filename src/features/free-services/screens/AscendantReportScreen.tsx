import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import AscendantReportView from '../components/AscendantReportView';

type AscendantReportRouteParams = {
  result: any;
  serviceTitle?: string;
};

const AscendantReportScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as AscendantReportRouteParams) || {};

  return (
    <AscendantReportView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default AscendantReportScreen;
