// import React from 'react';
// import {View, StyleSheet, ImageBackground} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {Card} from '../../../../../components/Card';
// import {BalanceCardProps} from '../walletType';
// import {WALLET_LABELS, DEFAULTS} from '../../../../../constants/app.constants';
// import {useWallet} from '../../../../../services/api/wallet/wallet.hooks';

// export const BalanceCard: React.FC<BalanceCardProps> = ({
//   balance,
//   onRechargePress,
//   onWithdrawPress,
//   isAuthenticated,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const {wallet, loading} = useWallet();

//   return (
//     <>
//       <LinearGradient
//         colors={['#6200EE', '#9C27B0', '#673AB7']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}
//         style={styles.balanceCard}>
//         {/* Decorative Background Elements */}
//         <View style={styles.decorativeCircle1} />
//         <View style={styles.decorativeCircle2} />
//         <View style={styles.decorativeCircle3} />

//         {/* Content Container */}
//         <View style={styles.contentContainer}>
//           <View style={styles.balanceCont}>
//             <View>
//               {/* Balance Label */}
//               <Text
//                 variant="body"
//                 style={{
//                   color: 'rgba(255, 255, 255, 0.8)',
//                   textAlign: 'center',
//                 }}>
//                 {WALLET_LABELS.AVAILABLE_BALANCE}
//               </Text>

//               {/* Balance Amount */}
//               <Text
//                 variant="h1"
//                 weight="bold"
//                 style={{
//                   color: '#FFFFFF',
//                   marginVertical: 8,
//                   textAlign: 'center',
//                   textShadowColor: 'rgba(0, 0, 0, 0.2)',
//                   textShadowOffset: {width: 0, height: 2},
//                   textShadowRadius: 4,
//                   marginTop: -4,
//                 }}>
//                 {DEFAULTS.CURRENCY}
//                 {wallet?.balanceCoins || '0.00'}
//               </Text>
//             </View>
//             {/* Wallet Icon */}
//             <View style={styles.walletIconContainer}>
//               <View
//                 style={[
//                   styles.walletIcon,
//                   {backgroundColor: 'rgba(255, 255, 255, 0.25)'},
//                 ]}>
//                 <Icon
//                   name="wallet"
//                   size={32}
//                   color="#FFFFFF"
//                   library="Ionicons"
//                 />
//               </View>
//             </View>
//           </View>

//           {/* Quick Info */}

//           {/* Minimum Balance Warning */}
//         </View>
//         {wallet?.lockedCoins && wallet.lockedCoins > 0 && (
//           <View
//             style={[
//               styles.lockedCoinsContainer,
//               {backgroundColor: 'rgba(255, 255, 255, 0.15)'},
//             ]}>
//             <Icon
//               name="lock-closed"
//               size={14}
//               color="#FFFFFF"
//               library="Ionicons"
//             />
//             <Text
//               variant="captionSmall"
//               style={{color: '#FFFFFF', marginLeft: 6}}>
//               Locked: {DEFAULTS.CURRENCY}
//               {wallet.lockedCoins}
//             </Text>
//           </View>
//         )}
//         <View style={styles.infoRow}>
//           <View style={styles.infoItem}>
//             <Icon
//               name="security"
//               size={14}
//               color="rgba(255, 255, 255, 0.9)"
//               library="MaterialIcons"
//             />
//             <Text
//               variant="captionSmall"
//               style={{color: 'rgba(255, 255, 255, 0.8)', marginLeft: 4}}>
//               {WALLET_LABELS.SECURE_PAYMENT}
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Icon
//               name="verified-user"
//               size={14}
//               color="rgba(255, 255, 255, 0.9)"
//               library="MaterialIcons"
//             />
//             <Text
//               variant="captionSmall"
//               style={{color: 'rgba(255, 255, 255, 0.8)', marginLeft: 4}}>
//               {WALLET_LABELS.PERCENT_SECURE}
//             </Text>
//           </View>
//         </View>
//         <View
//           style={[
//             styles.minBalanceWarning,
//             {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
//           ]}>
//           <Icon
//             name="info-outline"
//             size={16}
//             color="#FFFFFF"
//             library="MaterialIcons"
//           />
//           <Text
//             variant="captionSmall"
//             style={{color: '#FFFFFF', marginLeft: 6, flex: 1}}>
//             {WALLET_LABELS.MIN_BALANCE_WARNING}
//           </Text>
//         </View>
//       </LinearGradient>
//       {/* Action Buttons */}
//       {onRechargePress && (
//         <View style={styles.buttonRow}>
//           <Button
//             title={WALLET_LABELS.RECHARGE}
//             variant="primary"
//             size="large"
//             onPress={onRechargePress}
//             style={styles.rechargeButton}
//           />
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   balanceCard: {
//     marginBottom: 16,
//     borderRadius: 20,
//     overflow: 'hidden',
//     minHeight: 230,
//     marginHorizontal: 10,
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 20,
//     // display:'flex',
//     // flexDirection:'column',
//   },
//   decorativeCircle1: {
//     position: 'absolute',
//     top: -30,
//     right: -30,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   decorativeCircle2: {
//     position: 'absolute',
//     bottom: -20,
//     left: -20,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   decorativeCircle3: {
//     position: 'absolute',
//     top: 60,
//     left: -40,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.03)',
//   },
//   walletIconContainer: {
//     marginBottom: 12,
//   },
//   walletIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     width: '100%',
//     marginTop: 8,
//   },
//   rechargeButton: {
//     flex: 1,
//     marginRight: 8,
//     marginHorizontal: 10,
//   },
//   withdrawButton: {
//     flex: 1,
//     marginLeft: 8,
//   },
//   minBalanceWarning: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 12,
//     width: '100%',
//   },
//   balanceCont: {
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   lockedCoinsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 16,
//     alignSelf: 'center',
//     marginBottom: 8,
//   },
// });

// export default BalanceCard;

import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {Button} from '../../../../../components/Button';
import {BalanceCardProps} from '../walletType';
import {WALLET_LABELS, DEFAULTS} from '../../../../../constants/app.constants';
import {useWallet} from '../../../../../services/api/wallet/wallet.hooks';

export const BalanceCard: React.FC<BalanceCardProps> = ({onRechargePress}) => {
  const theme = useTheme();
  const {wallet, loading} = useWallet();

  const balanceCoins = wallet?.balanceCoins ?? 0;
  const lockedCoins = wallet?.lockedCoins ?? 0;

  return (
    <>
      <LinearGradient
        colors={['#6200EE', '#9C27B0', '#673AB7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.balanceCard}>
        {/* Decorative Circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.balanceCont}>
            <View>
              <Text variant="body" style={styles.balanceLabel}>
                {WALLET_LABELS.AVAILABLE_BALANCE}
              </Text>

              <Text variant="h1" weight="bold" style={styles.balanceText}>
                {DEFAULTS.CURRENCY}
                {balanceCoins}
              </Text>
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
            <Text variant="captionSmall" style={styles.lockedText}>
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
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 230,
    marginHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
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
    marginTop: 30,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  balanceText: {
    color: '#FFFFFF',
    marginVertical: 8,
    textAlign: 'center',
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
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
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
