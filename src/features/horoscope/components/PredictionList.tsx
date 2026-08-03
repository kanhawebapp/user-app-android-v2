import React from 'react';
import {View} from 'react-native';

import type {HoroscopeSection} from '../utils/horoscopeResponse';
import {PredictionCard} from './PredictionCard';

export interface PredictionListProps {
  sections: HoroscopeSection[];
}

export const PredictionList: React.FC<PredictionListProps> = ({sections}) => {
  return (
    <View style={{width: '100%'}}>
      {sections.map(section => (
        <PredictionCard
          key={section.key}
          title={`${section.emoji} ${section.label}`}
          description={section.description}
        />
      ))}
    </View>
  );
};

export default PredictionList;
