import React from 'react';
import { View, StyleSheet, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Text, useTheme } from '../../../../../../components';

const sendGiftIcon = require('../../../../../../assets/images/sendgift-icon.png');

interface WalletBalanceCardProps {
  balance: number;
  loading?: boolean;
  astrologerName?: string;
  astrologerProfilePic?: string;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  loading = false,
  astrologerName,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      {astrologerName ? (
        <View style={styles.recipientSection}>
          <Image
            source={sendGiftIcon}
            style={styles.giftIcon}
            resizeMode="contain"
          />
          <Text
            variant="body"
            weight="semibold"
            color={colors.text.primary}
            style={styles.recipientTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            Send a Gift to {astrologerName}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.common.white,
            borderColor: colors.common.gray[300],
          },
        ]}>
        <Text
          variant="body"
          weight="medium"
          color={colors.text.primary}
          style={styles.balanceLabel}>
          Wallet Balance:
        </Text>
        <View
          style={[
            styles.amountPill,
            { backgroundColor: colors.primary.light },
          ]}>
          <Text
            variant="body"
            weight="bold"
            color={colors.primary.main}
            style={styles.balanceAmount}>
            ₹{loading ? '--' : balance}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  } as ViewStyle,
  recipientSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  } as ViewStyle,
  giftIcon: {
    width: 52,
    height: 56,
    marginBottom: 14,
  } as ImageStyle,
  recipientTitle: {
    textAlign: 'center',
    maxWidth: '100%',
  } as TextStyle,
  balanceCard: {
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  balanceLabel: {
    flexShrink: 1,
  } as TextStyle,
  amountPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 12,
  } as ViewStyle,
  balanceAmount: {
    letterSpacing: 0.3,
  } as TextStyle,
});
