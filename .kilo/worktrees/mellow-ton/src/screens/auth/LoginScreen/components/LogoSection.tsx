// import React from 'react';
// import {View, StyleSheet} from 'react-native';
// import {useTheme, typography} from '../../../../theme';
// import {CustomImage} from '../../../../components/Image';
// import {Text} from '../../../../components/Text';
// import {useAppName, useLogoUrl} from '../../../../stores/config.store';
// import {getLogoSource} from '../../../../assets/images';
// import {logoSectionStyles} from '../loginStyle';

// interface LogoSectionProps {
//   testID?: string;
// }

// export const LogoSection: React.FC<LogoSectionProps> = ({
//   testID = 'logo-section',
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   // Get config values
//   const appName = useAppName();
//   const logoUrl = useLogoUrl();
//   const styles = logoSectionStyles(colors);

//   // Get logo source
//   const logoSource = getLogoSource(logoUrl);

//   return (
//     <View style={styles.container} testID={testID}>
//       {/* Logo Container */}
//       <View
//         style={[
//           styles.logoContainer,
//           // { backgroundColor: colors.primary.main + '20' }
//         ]}>
//         <CustomImage
//           source={logoSource}
//           width={280}
//           height={235}
//           borderRadius={0}
//           resizeMode="contain"
//           showLoading={false}
//         />
//       </View>

//       {/* App Name */}
//       <Text
//         variant="h2"
//         weight="bold"
//         color={colors.text.primary}
//         align="center"
//         style={styles.appName}>
//         {appName}
//       </Text>

//       {/* Tagline */}
//       <Text
//         variant="bodySmall"
//         color={colors.text.secondary}
//         align="center"
//         style={styles.tagline}>
//         Trusted by thousands of users
//       </Text>
//     </View>
//   );
// };

// export default LogoSection;

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, useTheme} from '../../../../theme';
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
  const colors = theme.colors;

  const appName = useAppName();
  const logoUrl = useLogoUrl();
  const styles = logoSectionStyles(colors);

  const logoSource = getLogoSource(logoUrl);

  return (
    <View style={styles.container} testID={testID}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <CustomImage
          source={logoSource}
          width={120}
          height={140}
          borderRadius={0}
          resizeMode="contain"
          showLoading={false}
        />
      </View>

      {/* App Name */}
      <Text
        variant="h2"
        weight="bold"
        color={colors.text.primary}
        align="center"
        style={styles.appName}>
        {appName}
      </Text>

      {/* Trust Badge */}
      <View
        style={[
          localStyles.trustBadge,
          // {backgroundColor: colors.primary.main + '15'},
        ]}>
        {/* <Icon
          name="verified"
          size={16}
          color={colors.primary.main}
          library="MaterialIcons"
        /> */}
        <CustomImage
          source={images.TrustedGuidance}
          width={24}
          height={24}
          resizeMode="contain"
          localStyles={styles.iconImage}
          showLoading={false}
          tintColor={colors.text.tertiary}
        />

        <Text variant="bodySmall" weight="medium" style={localStyles.trustText}>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },

  trustText: {
    marginLeft: 6,

    fontFamily: 'Inter',
    fontWeight: '400', // Regular
    fontSize: 16,
    color: colors.textColor.tertiary,
    // lineHeight: 16, // 100%
    textAlign: 'center',
  },

  iconImage: {
    width: 24,
    height: 24,
  },
});

export default LogoSection;
