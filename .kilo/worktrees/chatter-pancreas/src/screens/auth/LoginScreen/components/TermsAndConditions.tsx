import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {TERMS_AND_POLICY} from '../../../../constants/app.constants';
import {termsAndConditionsStyles} from '../loginStyle';

interface TermsAndConditionsProps {
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  testID?: string;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onTermsPress,
  onPrivacyPress,
  testID = 'terms-conditions',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = termsAndConditionsStyles(colors);

  const handleTermsPress = () => {
    if (onTermsPress) {
      onTermsPress();
    } else {
      // Default behavior - navigate to terms page
      console.log('Navigate to Terms of Service');
      // TODO: Implement navigation to Terms of Service page
      // navigation.navigate(SCREEN_NAMES.TERMS_OF_SERVICE);
    }
  };

  const handlePrivacyPress = () => {
    if (onPrivacyPress) {
      onPrivacyPress();
    } else {
      // Default behavior - navigate to privacy page
      console.log('Navigate to Privacy Policy');
      // TODO: Implement navigation to Privacy Policy page
      // navigation.navigate(SCREEN_NAMES.PRIVACY_POLICY);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text
        variant="caption"
        color={colors.text.secondary}
        align="center"
        style={styles.termsText}>
        {TERMS_AND_POLICY.LOGIN_TERMS_PREFIX}{' '}
        <Text
          variant="caption"
          color={colors.primary.main}
          weight="medium"
          style={styles.link}
          onPress={handleTermsPress}>
          {TERMS_AND_POLICY.TERMS_OF_SERVICE}
        </Text>{' '}
        {TERMS_AND_POLICY.AND}{' '}
        <Text
          variant="caption"
          color={colors.primary.main}
          weight="medium"
          style={styles.link}
          onPress={handlePrivacyPress}>
          {TERMS_AND_POLICY.PRIVACY_POLICY}
        </Text>
      </Text>
    </View>
  );
};

export default TermsAndConditions;
