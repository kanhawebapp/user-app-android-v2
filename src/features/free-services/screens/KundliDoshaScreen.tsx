import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import KundliDoshaView, {
  type DoshaListItem,
} from '../components/KundliDoshaView';

type KundliDoshaRouteParams = {
  result: any;
  serviceTitle?: string;
};

const KundliDoshaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as KundliDoshaRouteParams) || {};

  const handleDoshaPress = (item: DoshaListItem) => {
    navigation.navigate(item.screen, {
      result,
      serviceTitle,
    });
  };

  return (
    <KundliDoshaView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
      onDoshaPress={handleDoshaPress}
    />
  );
};

export default KundliDoshaScreen;
