// import React, { useCallback, useMemo } from 'react';
// import { View, ScrollView } from 'react-native';
// import { ModalHeader } from './components/ModalHeader';
// import { AstrologerCard } from './components/AstrologerCard';
// import { WalletBalanceCard } from './components/WalletBalanceCard';
// import { GiftGrid } from './components/GiftGrid';
// import { MessageSection } from './components/MessageSection';
// import { RechargeSection } from './components/RechargeSection';
// import { GiftHistoryList } from './components/GiftHistoryList';
// import { styles } from './SendGiftModal.styles';
// import { Gift } from '../../../../../services/api/gift/gift.types';
// import { Button, Icon, Modal, Text, useTheme } from '../../../../../components';
// import { useWallet } from '../../../../../services/api/wallet/wallet.hooks';
// import { useRechargePacks } from '../../../../../services/api/recharge/recharge.hooks';
// import { RechargePack } from '../../../../../services/api/recharge/recharge.types';
// import { useGiftHistory } from '../../../../../services/api/giftHistory/useGiftHistory';
// import { useProfile } from '../../../../../services/api/profile/profile.hooks';
// import { useRechargeOrder } from '../../../../../services/api/recharge/recharge.order.hooks';
// import { openRazorpayCheckout } from '../../../../../services/api/recharge/razorpay.service';

// interface SendGiftModalProps {
//   visible: boolean;
//   onClose: () => void;
//   gifts: Gift[];
//   astrologerName?: string;
//   astrologerProfilePic?: string;
//   onSendGift?: (gift: Gift, message: string) => void;
//   loading?: boolean;
// }

// export const SendGiftModal: React.FC<SendGiftModalProps> = ({
//   visible,
//   onClose,
//   gifts,
//   astrologerName,
//   astrologerProfilePic,
//   onSendGift,
//   loading = false,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   // Wallet
//   const { wallet, loading: walletBalanceLoading } = useWallet();
//   const balanceCoins = wallet?.balanceCoins ?? 0;
// const [activeTab, setActiveTab] = React.useState<'gift' | 'history'>('gift');
//   // Recharge packs
//   const { data: rechargePacks, loading: rechargePackLoading } = useRechargePacks();
//   const [selectedPack, setSelectedPack] = React.useState<RechargePack | null>(null);

//   // Gift history
//   const {
//     data: giftHistory,
//     loading: getGiftHistoryLoading,
//   } = useGiftHistory();

//   // Local state for gift selection
//   const [selectedGift, setSelectedGift] = React.useState<Gift | null>(null);
//   const [message, setMessage] = React.useState('');

//   // Profile for payment
//   const { profile } = useProfile();
//   const { createOrder, loading: orderLoading } = useRechargeOrder();

//   // Handle send gift
//   const handleSendGift = useCallback(() => {
//     if (selectedGift) {
//       onSendGift?.(selectedGift, message);
//       setSelectedGift(null);
//       setMessage('');
//     }
//   }, [selectedGift, message, onSendGift]);

//   // Handle pack selection
//   const handlePackSelect = useCallback((pack: RechargePack) => {
//     setSelectedPack(pack);
//   }, []);

//   // Handle gift selection
//   const handleGiftSelect = useCallback((gift: Gift) => {
//     setSelectedGift(gift);
//   }, []);

//   // Handle proceed to pay
//   const handleProceedToPay = useCallback(async () => {
//     if (!selectedPack) {
//       return;
//     }

//     try {
//       const order = await createOrder(selectedPack.id);
//       await openRazorpayCheckout({
//         order,
//         user: profile,
//         selectedPack,
//       });
//     } catch (error) {
//       console.log('PAYMENT FAILED', error);
//     }
//   }, [selectedPack, createOrder, profile]);

//   // Close handler - reset selections
//   const handleClose = useCallback(() => {
//     setSelectedGift(null);
//     setMessage('');
//     setSelectedPack(null);
//     onClose();
//   }, [onClose]);

//   // Memoized button states
//   const sendGiftDisabled = !selectedGift || loading;
//   const payDisabled = !selectedPack || rechargePackLoading || orderLoading;

//   // Modal content style
//   const modalContentStyle = useMemo(
//     () => ({
//       marginHorizontal: 8,
//       // maxHeight: '90%',
//       flex: 1
//     }),
//     [],
//   );

//   return (
//     <Modal
//       visible={visible}
//       onClose={handleClose}
//       animationType="slide"
//       dismissOnBackdropPress
//       contentStyle={modalContentStyle}>
//       <ScrollView
//       // style={styles.scrollContainer}
//       // showsVerticalScrollIndicator={false}
//       // contentContainerStyle={styles.scrollContent}
//       >
//         {/* Header */}
//         <ModalHeader title="Send Gift" onClose={handleClose} colors={colors} />

//         {/* {astrologerName && (
//           <AstrologerCard
//             name={astrologerName}
//             profilePic={astrologerProfilePic}
//           />
//         )} */}

//         <WalletBalanceCard
//           balance={balanceCoins}
//           loading={walletBalanceLoading}
//         />

//         {/* Gift Selection Section */}
//         <View style={styles.section}>
//           <Text
//             variant="bodySmall"
//             weight="medium"
//             color={colors.text.secondary}
//             style={styles.sectionTitle}>
//             Choose a gift
//           </Text>
//           <GiftGrid
//             gifts={gifts}
//             selectedGift={selectedGift}
//             onGiftSelect={handleGiftSelect}
//           />
//         </View>

//         {/* Message Section */}
//         {/* <MessageSection message={message} onChangeMessage={setMessage} /> */}

//         {/* Recharge Section */}
//         <RechargeSection
//           packs={rechargePacks || []}
//           selectedPack={selectedPack}
//           onSelectPack={handlePackSelect}
//           loading={rechargePackLoading}
//         />



//       </ScrollView>


//       {/* Button Container - Fixed at bottom */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Recharge Wallet"
//           variant="outline"
//           size="large"
//           onPress={handleProceedToPay}
//           loading={orderLoading || rechargePackLoading}
//           disabled={payDisabled}
//           style={styles.button}
//           leftIcon={
//             <Icon
//               name="account-balance-wallet"
//               size={20}
//               color={colors.primary.main}
//               library="MaterialIcons"
//             />
//           }
//         />
//         <Button
//           title="Send Gift"
//           variant="primary"
//           size="large"
//           onPress={handleSendGift}
//           loading={loading}
//           disabled={sendGiftDisabled}
//           style={styles.button}
//           leftIcon={
//             <Icon
//               name="send"
//               size={20}
//               color={colors.primary.contrastText}
//               library="MaterialIcons"
//             />
//           }
//         />
//       </View>
//       {/* Gift History Section */}
//       <ScrollView style={styles.section2}>
//         <Text
//           variant="bodySmall"
//           weight="medium"
//           color={colors.text.secondary}
//           style={styles.sectionTitle}>
//           Recent Gifts
//         </Text>
//         <GiftHistoryList
//           history={giftHistory}
//           loading={getGiftHistoryLoading}
//         />
//       </ScrollView>

//     </Modal>
//   );
// };

// export default SendGiftModal;


import React, { useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { ModalHeader } from './components/ModalHeader';
import { WalletBalanceCard } from './components/WalletBalanceCard';
import { GiftGrid } from './components/GiftGrid';
import { RechargeSection } from './components/RechargeSection';
import { GiftHistoryList } from './components/GiftHistoryList';
import { styles } from './SendGiftModal.styles';
import { Gift } from '../../../../../services/api/gift/gift.types';
import { Button, Icon, Modal, Text, useTheme } from '../../../../../components';
import { useWallet } from '../../../../../services/api/wallet/wallet.hooks';
import { useRechargePacks } from '../../../../../services/api/recharge/recharge.hooks';
import { RechargePack } from '../../../../../services/api/recharge/recharge.types';
import { useGiftHistory } from '../../../../../services/api/giftHistory/useGiftHistory';
import { useProfile } from '../../../../../services/api/profile/profile.hooks';
import { useRechargeOrder } from '../../../../../services/api/recharge/recharge.order.hooks';
import { openRazorpayCheckout } from '../../../../../services/api/recharge/razorpay.service';

interface SendGiftModalProps {
  visible: boolean;
  onClose: () => void;
  gifts: Gift[];
  astrologerName?: string;
  astrologerProfilePic?: string;
  onSendGift?: (gift: Gift, message: string) => void;
  loading?: boolean;
}

export const SendGiftModal: React.FC<SendGiftModalProps> = ({
  visible,
  onClose,
  gifts,
  astrologerName,
  astrologerProfilePic,
  onSendGift,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Wallet
  const { wallet, loading: walletBalanceLoading } = useWallet();
  const balanceCoins = wallet?.balanceCoins ?? 0;
  const [activeTab, setActiveTab] = React.useState<'gift' | 'history'>('gift');
  // Recharge packs
  const { data: rechargePacks, loading: rechargePackLoading } = useRechargePacks();
  const [selectedPack, setSelectedPack] = React.useState<RechargePack | null>(null);

  // Gift history
  const {
    data: giftHistory,
    loading: getGiftHistoryLoading,
  } = useGiftHistory();

  // Local state for gift selection
  const [selectedGift, setSelectedGift] = React.useState<Gift | null>(null);
  const [message, setMessage] = React.useState('');

  // Profile for payment
  const { profile } = useProfile();
  const { createOrder, loading: orderLoading } = useRechargeOrder();

  // Handle send gift
  const handleSendGift = useCallback(() => {
    if (selectedGift) {
      onSendGift?.(selectedGift, message);
      setSelectedGift(null);
      setMessage('');
    }
  }, [selectedGift, message, onSendGift]);

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
    onClose();
  }, [onClose]);

  // Memoized button states
  const sendGiftDisabled = !selectedGift || loading;
  const payDisabled = !selectedPack || rechargePackLoading || orderLoading;

  // Modal content style
  const modalContentStyle = useMemo(
    () => ({
      marginHorizontal: 8,
      // maxHeight: '90%',
      flex: 1
    }),
    [],
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      animationType="slide"
      dismissOnBackdropPress
      contentStyle={modalContentStyle}>
      <ScrollView
      // style={styles.scrollContainer}
      // showsVerticalScrollIndicator={false}
      // contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ModalHeader title="Send Gift" onClose={handleClose} colors={colors} />

        {/* {astrologerName && (
          <AstrologerCard
            name={astrologerName}
            profilePic={astrologerProfilePic}
          />
        )} */}

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
          <Button
            title="Send Gift"
            variant={activeTab === 'gift' ? 'primary' : 'ghost'}
            size="small"
            style={{ flex: 1 }}
            onPress={() => setActiveTab('gift')}
          />

          <Button
            title="History"
            variant={activeTab === 'history' ? 'primary' : 'ghost'}
            size="small"
            style={{ flex: 1 }}
            onPress={() => setActiveTab('history')}
          />
        </View>

        {/* Gift Selection Section */}
        {activeTab === 'gift' ? (
          <>
            {/* Gift Selection Section */}
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


      {/* Button Container - Fixed at bottom */}
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
    
    </Modal>
  );
};

export default SendGiftModal;
