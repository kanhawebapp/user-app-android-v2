import React from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {useAstrologers} from '../../../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from '../../../recomandedAstrologer/AstrologerCard';
import type {Astrologer} from '../../../../../services/api/recomandedAstrologer/astrologer.types';

type HomeAstrologersProps = {
  onViewAllPress?: () => void;
  onAstrologerPress?: (astrologer: Astrologer) => void;
  onChatPress?: (astrologer: Astrologer) => void;
  onAddPress?: (astrologer: Astrologer) => void;
};

const HomeAstrologers: React.FC<HomeAstrologersProps> = ({
  onViewAllPress,
  onAstrologerPress,
  onChatPress,
  onAddPress,
}) => {
  const {data} = useAstrologers();

  return (
    <View>
      {/* Header */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>Recommended Astrologers</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.slice(0, 5).map(item => (
          <AstrologerCard
            key={item.id}
            item={item}
            style={{width: 160, marginRight: 10}}
            onPress={() => onAstrologerPress?.(item)}
            onChatPress={() => onChatPress?.(item)}
            onAddPress={() => onAddPress?.(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeAstrologers;
