// import React from 'react';
// import {View, StyleSheet} from 'react-native';
// import {useTheme} from '../../theme';
// import {Modal} from '../Modal';
// import {Button} from '../Button';
// import {Icon} from '../Icon';
// import {Text} from '../Text';
// import {ThankYouModalProps} from './modalType';

// export const ThankYouModal: React.FC<ThankYouModalProps> = ({
//   visible,
//   onClose,
//   onRecharge,
//   onChatAgain,
//   onExit,
//   walletBalance = 0,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const handleRecharge = () => {
//     onRecharge?.();
//     onClose();
//   };

//   const handleChatAgain = () => {
//     onChatAgain?.();
//     onClose();
//   };

//   const handleExit = () => {
//     onExit?.();
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       onClose={handleExit}
//       animationType="slide"
//       dismissOnBackdropPress={false}
//       showCloseButton={false}
//       contentStyle={styles.modalContent}>
//       <View style={styles.container}>
//         <View
//           style={[
//             styles.iconContainer,
//             {backgroundColor: colors.success.main + '20'},
//           ]}>
//           <Icon
//             name="check-circle"
//             size={64}
//             color={colors.success.main}
//             library="MaterialIcons"
//           />
//         </View>

//         <Text
//           variant="h4"
//           weight="bold"
//           style={[styles.title, {color: colors.text.primary}]}>
//           Thank You!
//         </Text>

//         <Text
//           variant="body"
//           style={[styles.description, {color: colors.text.secondary}]}>
//           Your feedback helps us improve.
//         </Text>

//         <View
//           style={[
//             styles.balanceContainer,
//             {backgroundColor: colors.background.secondary},
//           ]}>
//           <Text variant="bodySmall" style={{color: colors.text.secondary}}>
//             Wallet Balance
//           </Text>
//           <Text variant="h5" weight="bold" style={{color: colors.primary.main}}>
//             ₹{walletBalance.toFixed(2)}
//           </Text>
//         </View>

//         <Text
//           variant="body"
//           weight="medium"
//           style={[styles.question, {color: colors.text.primary}]}>
//           What would you like to do?
//         </Text>

//         <View style={styles.buttonContainer}>
//           <Button
//             title="Recharge Wallet"
//             variant="primary"
//             size="large"
//             onPress={handleRecharge}
//             style={styles.button}
//             // leftIcon={
//             //   <Icon
//             //     name="account-balance-wallet"
//             //     size={20}
//             //     color={colors.primary.contrastText}
//             //     library="MaterialIcons"
//             //   />
//             // }
//           />

//           <Button
//             title="Chat Again"
//             variant="secondary"
//             size="large"
//             onPress={handleChatAgain}
//             style={[
//               styles.button,
//               {
//                 backgroundColor: 'transparent',
//                 borderWidth: 1,
//                 borderColor: colors.primary.main,
//               },
//             ]}
//             // leftIcon={
//             //   <Icon
//             //     name="chat"
//             //     size={20}
//             //     color={colors.primary.main}
//             //     library="MaterialIcons"
//             //   />
//             // }
//           />

//           <Button
//             title="Exit"
//             variant="ghost"
//             size="large"
//             onPress={handleExit}
//             style={styles.exitButton}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContent: {
//     marginHorizontal: 16,
//     marginVertical: 40,
//   },
//   container: {
//     alignItems: 'center',
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//   },
//   iconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   description: {
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   balanceContainer: {
//     width: '100%',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   question: {
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     width: '100%',
//   },
//   button: {
//     width: '100%',
//     marginBottom: 12,
//   },
//   exitButton: {
//     marginTop: 8,
//   },
// });

// export default ThankYouModal;

import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '../../theme';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {ThankYouModalProps} from './modalType';

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  visible,
  onRecharge,
  onChatAgain,
  onExit,
  walletBalance = 0,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const handleRecharge = () => {
    onRecharge?.();
  };

  const handleChatAgain = () => {
    onChatAgain?.();
  };

  const handleExit = () => {
    onExit?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* 🔥 BACKGROUND BLUR */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={theme.isDark ? 'dark' : 'light'}
        blurAmount={12}
      />

      {/* 🔥 CENTER CONTENT */}
      <View style={styles.overlay}>
        <View
          style={[styles.card, {backgroundColor: colors.background.primary}]}>
          {/* SUCCESS ICON */}
          <View
            style={[
              styles.iconWrapper,
              {backgroundColor: colors.success.main + '20'},
            ]}>
            <Icon
              name="check-circle"
              size={64}
              color={colors.success.main}
              library="MaterialIcons"
            />
          </View>

          {/* TITLE */}
          <Text
            variant="h4"
            weight="bold"
            style={[styles.title, {color: colors.text.primary}]}>
            Thank You!
          </Text>

          <Text
            variant="body"
            style={[styles.subtitle, {color: colors.text.secondary}]}>
            Your feedback helps us improve your experience.
          </Text>

          {/* WALLET CARD */}
          <View
            style={[
              styles.walletCard,
              {backgroundColor: colors.background.secondary},
            ]}>
            <Text variant="bodySmall" style={{color: colors.text.secondary}}>
              Wallet Balance
            </Text>

            <Text
              variant="h5"
              weight="bold"
              style={{color: colors.primary.main}}>
              ₹{walletBalance.toFixed(2)}
            </Text>
          </View>

          {/* QUESTION */}
          <Text
            variant="body"
            weight="medium"
            style={[styles.question, {color: colors.text.primary}]}>
            What would you like to do next?
          </Text>

          {/* ACTION BUTTONS */}
          <View style={styles.actions}>
            <Button
              title="Recharge Wallet"
              variant="primary"
              onPress={handleRecharge}
              style={{flex: 1}}
            />

            <Button
              title="Chat Again"
              variant="outline"
              onPress={handleChatAgain}
              style={{flex: 1}}
            />
          </View>

          {/* EXIT */}
          <Button
            title="Exit"
            variant="ghost"
            onPress={handleExit}
            style={styles.exitBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ThankYouModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',

    // 🔥 Premium shadow
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
  },

  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },

  walletCard: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },

  question: {
    marginBottom: 20,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 12,
  },

  exitBtn: {
    marginTop: 8,
  },
});
