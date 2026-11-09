import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import {CustomImage} from '../../../../components/Image';
import {Text} from '../../../../components/Text';
import {useAppName, useLogoUrl} from '../../../../stores/config.store';
import images, {getLogoSource} from '../../../../assets/images';
import {logoSectionStyles} from '../loginStyle';
import {AUTH_LABELS} from '../../../../constants/app.constants';

interface LogoSectionProps {
  testID?: string;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  testID = 'logo-section',
}) => {
  const theme = useTheme();
  const themeColors = theme.colors;

  const appName = useAppName();
  const logoUrl = useLogoUrl();
  const styles = logoSectionStyles(themeColors);

  const logoSource = getLogoSource(logoUrl);

  return (
    <View style={styles.container} testID={testID}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <CustomImage
          source={logoSource}
          width={120}
          height={120}
          borderRadius={0}
          resizeMode="contain"
          showLoading={false}
        />
      </View>

      {/* App Name */}
      <Text
        variant="h2"
        weight="bold"
        color={themeColors.text.primary}
        align="center"
        style={styles.appName}>
        {appName}
      </Text>

      {/* Trust Badge */}
      <View style={localStyles.trustBadge}>
        <CustomImage
          source={images.TrustedGuidance}
          width={18}
          height={18}
          resizeMode="contain"
          showLoading={false}
          tintColor={themeColors.text.tertiary}
        />

        <Text
          variant="bodySmall"
          weight="medium"
          style={[
            localStyles.trustText,
            {color: themeColors.text.tertiary},
          ]}>
          {AUTH_LABELS.TRUSTED_THOUSANDS}
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },

  trustText: {
    marginLeft: 6,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LogoSection;
