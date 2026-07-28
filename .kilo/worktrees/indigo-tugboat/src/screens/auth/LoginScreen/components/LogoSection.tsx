import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, typography } from '../../../../theme';
import { CustomImage } from '../../../../components/Image';
import { Text } from '../../../../components/Text';
import { useAppName, useLogoUrl } from '../../../../stores/config.store';
import { getLogoSource } from '../../../../assets/images';
import { logoSectionStyles } from '../loginStyle';

interface LogoSectionProps {
  testID?: string;
}

export const LogoSection: React.FC<LogoSectionProps> = ({ testID = 'logo-section' }) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Get config values
  const appName = useAppName();
  const logoUrl = useLogoUrl();
  const styles= logoSectionStyles(colors)
  
  // Get logo source
  const logoSource = getLogoSource(logoUrl);

  return (
    <View style={styles.container} testID={testID}>
      {/* Logo Container */}
      <View 
        style={[
          styles.logoContainer, 
          // { backgroundColor: colors.primary.main + '20' }
        ]}
      >
        <CustomImage
          source={logoSource}
          width={240}
          height={105}
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
        style={styles.appName}
      >
        {appName}
      </Text>
      
      {/* Tagline */}
      <Text
        variant="bodySmall"
        color={colors.text.secondary}
        align="center"
        style={styles.tagline}
      >
        Trusted by thousands of users
      </Text>
    </View>
  );
};


export default LogoSection;

