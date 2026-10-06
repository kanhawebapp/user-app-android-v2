import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import DashaView from '../components/DashaView';

type DashaRouteParams = {
  result: any;
  serviceTitle?: string;
};

const DashaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as DashaRouteParams) || {};

  return (
    <DashaView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default DashaScreen;
