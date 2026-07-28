import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme, typography} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {AUTH_LABELS} from '../../../../constants/app.constants';

interface GuestSkipButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  testID?: string;
}

export const GuestSkipButton: React.FC<GuestSkipButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  testID = 'guest-skip-button',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Continue as Guest"
      accessibilityState={{disabled: disabled || isLoading}}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.text.secondary} />
      ) : (
        <Text
          variant="body"
          color={colors.primary.main}
          style={styles.continueGuest}>
          {AUTH_LABELS.CONTINUE_AS_GUEST}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: typography.spacing.xl,
    alignSelf: 'center',
    paddingVertical: typography.padding.md,
    paddingHorizontal: typography.padding.xl,
  },
  continueGuest: {
    fontFamily: 'Inter',
    fontWeight: '600', // Medium
    fontSize: 16,
    textAlign: 'center', // usually centered CTA text
    alignSelf: 'center',
  },
});

export default GuestSkipButton;
