import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import MuhurtaDetailsView from '../components/MuhurtaDetailsView';

type MuhurtaDetailsRouteParams = {
  result: any;
  serviceTitle?: string;
};

const MuhurtaDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} =
    (route.params as MuhurtaDetailsRouteParams) || {};

  return (
    <MuhurtaDetailsView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default MuhurtaDetailsScreen;
