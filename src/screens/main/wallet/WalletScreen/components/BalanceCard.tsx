import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { BalanceCardProps } from '../walletType';
import { WALLET_LABELS, DEFAULTS } from '../../../../../constants/app.constants';
import { useWallet } from '../../../../../services/api/wallet/wallet.hooks';
import { SkeletonLoader } from '../../../../../components/SkeletonLoader/ShimmerLoader';

export const BalanceCard: React.FC<BalanceCardProps> = ({ onRechargePress }) => {
  const { wallet, loading } = useWallet();

  const balanceCoins = wallet?.balanceCoins ?? 0;
  const lockedCoins = wallet?.lockedCoins ?? 0;

  console.log('BalanceCard - Balance:', balanceCoins, 'Locked:', lockedCoins);

  return (
    <>
      <LinearGradient
        colors={['#6200EE', '#9C27B0', '#673AB7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}>
        {/* Decorative Circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.balanceCont}>
            <View style={{ flex: 1, marginLeft: 28 }}>
              <Text style={styles.balanceLabel}>
                {WALLET_LABELS.AVAILABLE_BALANCE}
              </Text>

              {loading ? (
                <SkeletonLoader
                  width={140}
                  height={40}
                  borderRadius={8}
                  shimmerColor="rgba(255,255,255,0.35)"
                  backgroundColor="rgba(255,255,255,0.15)"
                  style={styles.balanceShimmer}
                />
              ) : (


                <Text style={styles.balanceText}>

                  {DEFAULTS.CURRENCY}
                  {balanceCoins}
                </Text>
              )}
            </View>

            {/* Wallet Icon */}
            <View style={styles.walletIconContainer}>
              <View style={styles.walletIcon}>
                <Icon
                  name="wallet"
                  size={32}
                  color="#FFFFFF"
                  library="Ionicons"
                />
              </View>
            </View>
          </View>
        </View>

        {/* ✅ FIXED CONDITION */}
        {lockedCoins > 0 && (
          <View style={styles.lockedCoinsContainer}>
            <Icon
              name="lock-closed"
              size={14}
              color="#FFFFFF"
              library="Ionicons"
            />
            <Text style={styles.lockedText}>
              Locked: {DEFAULTS.CURRENCY}
              {lockedCoins}
            </Text>
          </View>
        )}

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon
              name="security"
              size={14}
              color="rgba(255,255,255,0.9)"
              library="MaterialIcons"
            />
            <Text style={styles.infoText}>{WALLET_LABELS.SECURE_PAYMENT}</Text>
          </View>

          <View style={styles.infoItem}>
            <Icon
              name="verified-user"
              size={14}
              color="rgba(255,255,255,0.9)"
              library="MaterialIcons"
            />
            <Text style={styles.infoText}>{WALLET_LABELS.PERCENT_SECURE}</Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.minBalanceWarning}>
          <Icon
            name="info-outline"
            size={16}
            color="#FFFFFF"
            library="MaterialIcons"
          />
          <Text style={styles.warningText}>
            {WALLET_LABELS.MIN_BALANCE_WARNING}
          </Text>
        </View>
      </LinearGradient>

      {/* Button */}
      {onRechargePress && (
        <View style={styles.buttonRow}>
          <Button
            title={WALLET_LABELS.RECHARGE}
            variant="primary"
            size="large"
            onPress={onRechargePress}
            style={styles.rechargeButton}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 200,
    marginHorizontal: 10,
    marginTop: -15,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 60,
    left: -40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  balanceCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    // marginLeft:28
  },
  balanceText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 24,
    // marginVertical: 8,
    // textAlign: 'center',
    marginTop: 4,

  },
  balanceShimmer: {
    marginVertical: 8,
    marginTop: -4,
  },
  walletIconContainer: {
    marginBottom: 12,
  },
  walletIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedCoinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  lockedText: {
    color: '#FFFFFF',
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 8,
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontSize: 14,
  },
  minBalanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  warningText: {
    color: '#FFFFFF',
    marginLeft: 6,
    flex: 1,
    fontSize: 14
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  rechargeButton: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default BalanceCard;
