import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { RechargePack } from '../../../../../../services/api/recharge/recharge.types';
import { Text, useTheme } from '../../../../../../components';
import { RechargeAmountGrid } from '../../../../wallet/RechargePackScreen/components';

interface RechargeSectionProps {
  packs: RechargePack[];
  selectedPack: RechargePack | null;
  onSelectPack: (pack: RechargePack) => void;
  loading?: boolean;
}

export const RechargeSection: React.FC<RechargeSectionProps> = ({
  packs,
  selectedPack,
  onSelectPack,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.rechargeSection}>
      {/* <Text
        variant="bodySmall"
        weight="medium"
        color={colors.text.secondary}
        style={styles.sectionTitle}>
        Recharge Wallet
      </Text> */}
      <RechargeAmountGrid
        packs={packs}
        selectedPack={selectedPack}
        onSelectPack={onSelectPack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rechargeSection: {
    marginHorizontal: 16,
    // marginBottom: 20,
    marginTop:-40
  } as ViewStyle,
  sectionTitle: {
    marginBottom: 12,
  } as TextStyle,
});