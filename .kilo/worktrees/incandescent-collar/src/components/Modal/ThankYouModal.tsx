import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {ThankYouModalProps} from './modalType';

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  visible,
  onClose,
  onRecharge,
  onChatAgain,
  onExit,
  walletBalance = 0,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const handleRecharge = () => {
    onRecharge?.();
    onClose();
  };

  const handleChatAgain = () => {
    onChatAgain?.();
    onClose();
  };

  const handleExit = () => {
    onExit?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleExit}
      animationType="slide"
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.success.main + '20'},
          ]}>
          <Icon
            name="check-circle"
            size={64}
            color={colors.success.main}
            library="MaterialIcons"
          />
        </View>

        <Text
          variant="h4"
          weight="bold"
          style={[styles.title, {color: colors.text.primary}]}>
          Thank You!
        </Text>

        <Text
          variant="body"
          style={[styles.description, {color: colors.text.secondary}]}>
          Your feedback helps us improve.
        </Text>

        <View
          style={[
            styles.balanceContainer,
            {backgroundColor: colors.background.secondary},
          ]}>
          <Text variant="bodySmall" style={{color: colors.text.secondary}}>
            Wallet Balance
          </Text>
          <Text variant="h5" weight="bold" style={{color: colors.primary.main}}>
            ₹{walletBalance.toFixed(2)}
          </Text>
        </View>

        <Text
          variant="body"
          weight="medium"
          style={[styles.question, {color: colors.text.primary}]}>
          What would you like to do?
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Recharge Wallet"
            variant="primary"
            size="large"
            onPress={handleRecharge}
            style={styles.button}
            // leftIcon={
            //   <Icon
            //     name="account-balance-wallet"
            //     size={20}
            //     color={colors.primary.contrastText}
            //     library="MaterialIcons"
            //   />
            // }
          />

          <Button
            title="Chat Again"
            variant="secondary"
            size="large"
            onPress={handleChatAgain}
            style={[
              styles.button,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.primary.main,
              },
            ]}
            // leftIcon={
            //   <Icon
            //     name="chat"
            //     size={20}
            //     color={colors.primary.main}
            //     library="MaterialIcons"
            //   />
            // }
          />

          <Button
            title="Exit"
            variant="ghost"
            size="large"
            onPress={handleExit}
            style={styles.exitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 16,
    marginVertical: 40,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  balanceContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  question: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  exitButton: {
    marginTop: 8,
  },
});

export default ThankYouModal;
