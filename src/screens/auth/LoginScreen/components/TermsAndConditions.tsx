import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {TERMS_AND_POLICY} from '../../../../constants/app.constants';

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
        color={colors.text.tertiary}
        align="center"
        style={styles.termsText}>
        By continuing you agree to our{' '}
        <Text
          variant="caption"
          color={colors.primary.main}
          weight="medium"
          style={styles.link}
          onPress={handleTermsPress}>
          {TERMS_AND_POLICY.TERMS_OF_SERVICE}
        </Text>
        {' & '}
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

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  termsText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  link: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default TermsAndConditions;
