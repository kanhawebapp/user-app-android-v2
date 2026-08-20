import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletBalanceCard } from './astrologerProfile/components/SendGiftModal/components/WalletBalanceCard';
import { GiftGrid } from './astrologerProfile/components/SendGiftModal/components/GiftGrid';
import { RechargeSection } from './astrologerProfile/components/SendGiftModal/components/RechargeSection';
import { GiftHistoryList } from './astrologerProfile/components/SendGiftModal/components/GiftHistoryList';
import { Gift } from '../../services/api/gift/gift.types';
import { Button, Icon, Text, useTheme } from '../../components';
import { useWallet } from '../../services/api/wallet/wallet.hooks';
import { useRechargePacks } from '../../services/api/recharge/recharge.hooks';
import { RechargePack } from '../../services/api/recharge/recharge.types';
import { useGiftHistory } from '../../services/api/giftHistory/useGiftHistory';
import { useProfile } from '../../services/api/profile/profile.hooks';
import { useRechargeOrder } from '../../services/api/recharge/recharge.order.hooks';
import { openRazorpayCheckout } from '../../services/api/recharge/razorpay.service';
import { styles } from './SendGiftScreen.styles';

interface SendGiftScreenProps {
  gifts: Gift[];
  astrologerName?: string;
  astrologerProfilePic?: string;
  onSendGift: (gift: Gift, message: string) => void | Promise<void>;
  onGoBack: () => void;
  loading?: boolean;
}

export const SendGiftScreen: React.FC<SendGiftScreenProps> = ({
  gifts,
  astrologerName,
  astrologerProfilePic,
  onSendGift,
  onGoBack,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Wallet
  const { wallet, loading: walletBalanceLoading, refresh: refreshWallet } =
    useWallet();
  const balanceCoins = wallet?.balanceCoins ?? 0;
  const [activeTab, setActiveTab] = React.useState<'gift' | 'history'>('gift');
  // Recharge packs
  const { data: rechargePacks, loading: rechargePackLoading } = useRechargePacks();
  const [selectedPack, setSelectedPack] = React.useState<RechargePack | null>(null);

  // Gift history
  const {
    data: giftHistory,
    loading: getGiftHistoryLoading,
    refresh: refreshGiftHistory,
  } = useGiftHistory();

  // Local state for gift selection
  const [selectedGift, setSelectedGift] = React.useState<Gift | null>(null);
  const [message, setMessage] = React.useState('');

  // Profile for payment
  const { profile } = useProfile();
  const { createOrder, loading: orderLoading } = useRechargeOrder();

  // Handle send gift
  const handleSendGift = useCallback(async () => {
    if (!selectedGift) {
      return;
    }

    try {
      await onSendGift(selectedGift, message);
      setSelectedGift(null);
      setMessage('');
      // Re-fetch in case mutation omitted userBalance; shared cache already
      // updated from applyWalletBalanceCoins in the send handler.
      await Promise.all([refreshWallet(), refreshGiftHistory()]);
    } catch (error) {
      console.log('SEND GIFT SCREEN ERROR:', error);
    }
  }, [
    selectedGift,
    message,
    onSendGift,
    refreshWallet,
    refreshGiftHistory,
  ]);

  // Handle pack selection
  const handlePackSelect = useCallback((pack: RechargePack) => {
    setSelectedPack(pack);
  }, []);

  // Handle gift selection
  const handleGiftSelect = useCallback((gift: Gift) => {
    setSelectedGift(gift);
  }, []);

  // Handle proceed to pay
  const handleProceedToPay = useCallback(async () => {
    if (!selectedPack) {
      return;
    }

    try {
      const order = await createOrder(selectedPack.id);
      await openRazorpayCheckout({
        order,
        user: profile,
        selectedPack,
      });
    } catch (error) {
      console.log('PAYMENT FAILED', error);
    }
  }, [selectedPack, createOrder, profile]);

  // Close handler - reset selections
  const handleClose = useCallback(() => {
    setSelectedGift(null);
    setMessage('');
    setSelectedPack(null);
    onGoBack();
  }, [onGoBack]);

  const sendGiftDisabled = !selectedGift || loading;
  const payDisabled = !selectedPack || rechargePackLoading || orderLoading;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClose}
          style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.primary.main}
            library="Ionicons"
          />
        </TouchableOpacity>

        <Text
          variant="h6"
          weight="semibold"
          style={styles.headerTitle}
          color={colors.text.primary}>
          Send Gift
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WalletBalanceCard
          balance={balanceCoins}
          loading={walletBalanceLoading}
        />

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: colors.background.secondary,
            borderRadius: 12,
            padding: 4,
          }}>
          <TouchableOpacity
            onPress={() => setActiveTab('gift')}
            style={[
              styles.tab,
              activeTab === 'gift' ? {
                backgroundColor: colors.primary.main
              } : {
                backgroundColor: colors.background.secondary
              }
            ]}>

            <Text
              weight="medium"
              color={
                activeTab === 'gift'
                  ? colors.primary.contrastText
                  : colors.text.secondary
              }>
              Send Gift
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[
              styles.tab,
              activeTab === 'history' ? {
                backgroundColor: colors.primary.main
              } : {
                backgroundColor: colors.background.secondary
              }
            ]}>

            <Text
              weight="medium"
              color={
                activeTab === 'history'
                  ? colors.primary.contrastText
                  : colors.text.secondary
              }>
              History
            </Text>

          </TouchableOpacity>
        </View>

        {/* Gift Selection Section */}
        {activeTab === 'gift' ? (
          <>
            <View style={styles.section}>
              <Text
                variant="bodySmall"
                weight="medium"
                color={colors.text.secondary}
                style={styles.sectionTitle}>
                Choose a gift
              </Text>

              <GiftGrid
                gifts={gifts}
                selectedGift={selectedGift}
                onGiftSelect={handleGiftSelect}
              />
            </View>

            <RechargeSection
              packs={rechargePacks || []}
              selectedPack={selectedPack}
              onSelectPack={handlePackSelect}
              loading={rechargePackLoading}
            />
          </>
        ) : (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}>
            <Text
              variant="bodySmall"
              weight="medium"
              color={colors.text.secondary}
              style={styles.sectionTitle}>
              Gift History
            </Text>

            <GiftHistoryList
              history={giftHistory}
              loading={getGiftHistoryLoading}
            />
          </View>
        )}
      </ScrollView>

      {/* Button Container - Sticky at bottom */}
      <View style={styles.buttonContainer}>
        <Button
          title="Recharge Wallet"
          variant="outline"
          size="large"
          onPress={handleProceedToPay}
          loading={orderLoading || rechargePackLoading}
          disabled={payDisabled}
          style={styles.button}
          leftIcon={
            <Icon
              name="account-balance-wallet"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          }
        />
        <Button
          title="Send Gift"
          variant="primary"
          size="large"
          onPress={handleSendGift}
          loading={loading}
          disabled={sendGiftDisabled}
          style={styles.button}
          leftIcon={
            <Icon
              name="send"
              size={20}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SendGiftScreen;