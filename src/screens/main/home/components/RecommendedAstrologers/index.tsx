import React from 'react';
import {ScrollView, View, TouchableOpacity, StyleSheet} from 'react-native';

import {Text} from '../../../../../components';
import AstrologerCard from '../../../recomandedAstrologer/AstrologerCard';
import type {Astrologer} from '../../../../../services/api/recomandedAstrologer/astrologer.types';
import {colors} from '../../../../../theme';

type HomeAstrologersProps = {
  onViewAllPress?: () => void;
  onAstrologerPress?: (astrologer: Astrologer) => void;
  onChatPress?: (astrologer: Astrologer) => void;
  onCallPress?: (astrologer: Astrologer) => void;
  onAddPress?: (astrologer: Astrologer) => void;
  data: Astrologer[];
};

const HomeAstrologers: React.FC<HomeAstrologersProps> = ({
  onViewAllPress,
  onAstrologerPress,
  onChatPress,
  onCallPress,
  data,
}) => {
  if (!data?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.borderHeader}>
        <Text variant="h6" weight="semibold" style={styles.headerTitle}>
          Recommended Astrologers
        </Text>
        <TouchableOpacity onPress={onViewAllPress} hitSlop={8}>
          <Text color={colors.primary.main} style={styles.viewAllText}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {data.slice(0, 5).map(item => (
          <AstrologerCard
            key={item.id}
            item={item}
            style={styles.cardSpacing}
            onPress={() => onAstrologerPress?.(item)}
            onChatPress={() => onChatPress?.(item)}
            onCallPress={() => onCallPress?.(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeAstrologers;

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  borderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingRight: 4,
    paddingBottom: 8,
    paddingTop: 2,
  },
  cardSpacing: {
    marginRight: 12,
  },
});
