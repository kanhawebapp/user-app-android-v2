import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import KundliCardsView from '../components/KundliCardsView';
import {
  isBirthChartCard,
  isGeneralLifePredictionCard,
} from '../utils/kundliService';

type KundliCardsRouteParams = {
  result: any;
  serviceTitle?: string;
};

const KundliCardsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as KundliCardsRouteParams) || {};

  const handleCardPress = (card: any) => {
    if (isBirthChartCard(card?.name)) {
      navigation.navigate('BirthChart', {
        result,
        serviceTitle,
      });
    } else if (isGeneralLifePredictionCard(card?.name)) {
      navigation.navigate('GeneralLifePrediction', {
        result,
        serviceTitle,
      });
    }
  };

  return (
    <KundliCardsView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
      onCardPress={handleCardPress}
    />
  );
};

export default KundliCardsScreen;
