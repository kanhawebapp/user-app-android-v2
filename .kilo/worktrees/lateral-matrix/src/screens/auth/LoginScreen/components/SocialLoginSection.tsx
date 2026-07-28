import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Button} from '../../../../components/Button';
import {Icon} from '../../../../components/Icon';
import {Text} from '../../../../components/Text';
import {AUTH_LABELS} from '../../../../constants/app.constants';
import {socialLoginSectionStyles} from '../loginStyle';
import {SocialLoginSectionProps} from '../loginType';

export const SocialLoginSection: React.FC<SocialLoginSectionProps> = ({
  onGooglePress,
  onFacebookPress,
  isGoogleLoading = false,
  isFacebookLoading = false,
  testID = 'social-login-section',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = socialLoginSectionStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View
          style={[styles.dividerLine, {backgroundColor: colors.border.light}]}
        />
        <Text
          variant="caption"
          color={colors.text.tertiary}
          style={styles.dividerText}>
          {AUTH_LABELS.OR_DIVIDER}
        </Text>
        <View
          style={[styles.dividerLine, {backgroundColor: colors.border.light}]}
        />
      </View>

      {/* Google Login Button */}
      <Button
        title={AUTH_LABELS.CONTINUE_WITH_GOOGLE}
        variant="outline"
        size="large"
        onPress={onGooglePress}
        loading={isGoogleLoading}
        disabled={isGoogleLoading}
        leftIcon={
          <Icon
            name="google"
            size={22}
            color={colors.text.primary}
            library="MaterialCommunityIcons"
          />
        }
        style={styles.socialButton}
      />

      {/* Facebook Login Button */}
      <Button
        title={AUTH_LABELS.CONTINUE_WITH_FACEBOOK}
        variant="outline"
        size="large"
        onPress={onFacebookPress}
        loading={isFacebookLoading}
        disabled={isFacebookLoading}
        leftIcon={
          <Icon
            name="facebook"
            size={22}
            color={colors.text.primary}
            library="MaterialCommunityIcons"
          />
        }
        style={styles.socialButton}
      />
    </View>
  );
};

export default SocialLoginSection;
