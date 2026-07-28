import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme } from '../../../../../../components';


interface WalletBalanceCardProps {
  balance: number;
  loading?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.balanceCard,
        { backgroundColor: colors.primary.light, borderColor: colors.primary.main },
      ]}>
      <Text
        variant="bodySmall"
        weight="medium"
        color={colors.text.secondary}
        style={styles.balanceLabel}>
        Available Balance
      </Text>
      <Text
        variant="h3"
        weight="bold"
        color={colors.primary.main}
        style={styles.balanceAmount}>
        ₹ {loading ? '--' : balance}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    // padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  } as ViewStyle,
  balanceLabel: {
    marginBottom: 8,
    opacity: 0.8,
  } as TextStyle,
  balanceAmount: {
    textAlign: 'center',
    letterSpacing: 0.5,
  } as TextStyle,
});