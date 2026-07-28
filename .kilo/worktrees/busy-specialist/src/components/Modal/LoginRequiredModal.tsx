import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {LoginRequiredModalProps} from './modalType';
import {AUTH_LABELS} from '../../constants/app.constants';
import {useAuthUser} from '../../navigation/mainNavigation';

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  visible,
  onClose,
  onLoginPress,
  onSignupPress,
  title = AUTH_LABELS.LOGIN_REQUIRED_TITLE,
  message = AUTH_LABELS.LOGIN_REQUIRED_MESSAGE,
  loginButtonText = AUTH_LABELS.LOGIN_REQUIRED_LOGIN_BUTTON,
  signupButtonText = AUTH_LABELS.LOGIN_REQUIRED_SIGNUP_BUTTON,
  showSignup = true,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const { handleLogout} = useAuthUser({});

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showBackdrop={true}
      dismissOnBackdropPress={true}
      showCloseButton={false} // disable default close
      style={styles.centeredModal}
      contentStyle={styles.modalContent}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text variant="h6" weight="bold" style={styles.headerTitle}>
          {title}
        </Text>

        <Icon
          name="close"
          size={22}
          onPress={onClose}
          style={styles.closeIcon}
        />
      </View>

      <View style={styles.container}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.light + '20'},
          ]}>
          <Icon
            name="lock"
            size={40}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>

        {/* Message */}
        <Text
          variant="body"
          style={styles.message}
          color={colors.text.secondary}>
          {message}. {AUTH_LABELS.LOGIN_REQUIRED_MESSAGE_SUFFIX}
        </Text>

        {/* Login Button */}
        <Button
          title={loginButtonText}
          variant="primary"
          size="large"
          onPress={handleLogout}
          // onPress={onLoginPress}
          style={styles.loginButton}
          leftIcon={
            <Icon
              name="login"
              size={20}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          }
        />

        {/* Continue as Guest Option */}
        <Button
          title={AUTH_LABELS.LOGIN_REQUIRED_GUEST_BUTTON}
          variant="ghost"
          size="medium"
          onPress={onClose}
          style={styles.guestButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  centeredModal: {
    justifyContent: 'center',
  },
  modalContent: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
  },
  signupButton: {
    width: '100%',
    marginBottom: 12,
  },
  guestButton: {
    marginTop: 4,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
  },

  closeIcon: {
    // padding: 4,
  },
});

export default LoginRequiredModal;
