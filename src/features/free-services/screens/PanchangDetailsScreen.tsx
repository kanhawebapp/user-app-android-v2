import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import PanchangDetailsView from '../components/PanchangDetailsView';

type PanchangDetailsRouteParams = {
  result: any;
  serviceTitle?: string;
};

const PanchangDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as PanchangDetailsRouteParams) || {};

  console.log('PanchangDetailsScreen navigation params:', {
    result,
    serviceTitle,
  });

  return (
    <PanchangDetailsView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default PanchangDetailsScreen;
