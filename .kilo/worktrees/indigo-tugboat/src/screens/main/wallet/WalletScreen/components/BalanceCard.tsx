import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { BalanceCardProps } from '../walletType';
import { WALLET_LABELS, DEFAULTS } from '../../../../../constants/app.constants';

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  onRechargePress,
  onWithdrawPress,
  isAuthenticated,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card style={styles.balanceCard}>
      {/* Wallet Icon */}
      <View style={styles.walletIconContainer}>
        <View
          style={[
            styles.walletIcon,
            { backgroundColor: colors.primary.light + '20' },
          ]}
        >
          <Icon
            name="wallet"
            size={32}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>
      </View>

      {/* Balance Label */}
      <Text
        variant="body"
        style={{ color: colors.text.secondary, textAlign: 'center' }}
      >
        {WALLET_LABELS.AVAILABLE_BALANCE}
      </Text>

      {/* Balance Amount */}
      <Text
        variant="h2"
        weight="bold"
        style={{
          color: colors.text.primary,
          marginVertical: 8,
          textAlign: 'center',
        }}
      >
        {DEFAULTS.CURRENCY}{balance?.toFixed(2) || '0.00'}
      </Text>

      {/* Quick Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon
            name="security"
            size={14}
            color={colors.success.main}
            library="MaterialIcons"
          />
          <Text
            variant="captionSmall"
            style={{ color: colors.text.tertiary, marginLeft: 4 }}
          >
            {WALLET_LABELS.SECURE_PAYMENT}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Icon
            name="verified-user"
            size={14}
            color={colors.success.main}
            library="MaterialIcons"
          />
          <Text
            variant="captionSmall"
            style={{ color: colors.text.tertiary, marginLeft: 4 }}
          >
            {WALLET_LABELS.PERCENT_SECURE}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button
          title={WALLET_LABELS.RECHARGE}
          variant="primary"
          size="large"
          onPress={onRechargePress}
          style={styles.rechargeButton}
          leftIcon={
            <Icon
              name="add-circle"
              size={20}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          }
        />
      </View>

      {/* Minimum Balance Warning */}
      <View
        style={[
          styles.minBalanceWarning,
          { backgroundColor: colors.warning.light + '15' },
        ]}
      >
        <Icon
          name="info-outline"
          size={16}
          color={colors.warning.main}
          library="MaterialIcons"
        />
        <Text
          variant="captionSmall"
          style={{ color: colors.warning.main, marginLeft: 6, flex: 1 }}
        >
          {WALLET_LABELS.MIN_BALANCE_WARNING}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  walletIconContainer: {
    marginBottom: 12,
  },
  walletIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  rechargeButton: {
    flex: 1,
    marginRight: 8,
  },
  withdrawButton: {
    flex: 1,
    marginLeft: 8,
  },
  minBalanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
});

export default BalanceCard;
