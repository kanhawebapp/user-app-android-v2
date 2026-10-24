
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {RechargePackCard} from './RechargePackCard';
import {RechargePack} from '../../../../../services/api/recharge/recharge.types';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components';
import {WALLET_LABELS} from '../../../../../constants/app.constants';

interface RechargeAmountGridProps {
  packs: RechargePack[];
  selectedPack: RechargePack | null;
  onSelectPack: (pack: RechargePack) => void;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2 - 6;

export const RechargeAmountGrid: React.FC<RechargeAmountGridProps> = ({
  packs,
  selectedPack,
  onSelectPack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderItem = ({item}: {item: RechargePack}) => {
    const isSelected = selectedPack?.id === item.id;

    return (
      <View style={styles.cardWrapper}>
        <RechargePackCard
          pack={item}
          isSelected={isSelected}
          onSelect={onSelectPack}
        />
      </View>
    );
  };

  if (!packs || packs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
          }}>
          No recharge packs available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {color: colors.text.primary},
        ]}>
        {WALLET_LABELS.SELECT_RECHARGE}
      </Text>

      <FlatList
        data={packs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={
          packs.length === 1
            ? styles.singleItemRow
            : styles.row
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },

  sectionTitle: {
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 8,
  },

  row: {
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  singleItemRow: {
    justifyContent: 'flex-start',
    marginBottom: 12,
  },

  cardWrapper: {
    width: CARD_WIDTH,
  },

  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
