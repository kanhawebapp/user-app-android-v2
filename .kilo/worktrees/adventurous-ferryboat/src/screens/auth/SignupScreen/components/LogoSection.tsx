import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../../theme';
import {CustomImage} from '../../../../components/Image';
import {Text} from '../../../../components/Text';
import {useAppName, useLogoUrl} from '../../../../stores/config.store';
import {getLogoSource} from '../../../../assets/images';
import {logoSectionStyles} from '../signupStyles';
import type {LogoSectionProps} from '../signupType';
import {AUTH_LABELS} from '../../../../constants/app.constants';

export const LogoSection: React.FC<LogoSectionProps> = ({
  testID = 'logo-section',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const appName = useAppName();
  const logoUrl = useLogoUrl();
  const logoSource = getLogoSource(logoUrl);
  const styles = logoSectionStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      <View
        style={[
          styles.logoContainer,
          {backgroundColor: colors.primary.main + '20'},
        ]}>
        <CustomImage
          source={logoSource}
          width={100}
          height={65}
          borderRadius={0}
          resizeMode="contain"
          showLoading={false}
        />
      </View>

      <Text
        variant="h2"
        weight="bold"
        color={colors.text.primary}
        align="center"
        style={styles.appName}>
        {appName}
      </Text>

      <Text
        variant="bodySmall"
        color={colors.text.secondary}
        align="center"
        style={styles.tagline}>
        {AUTH_LABELS.CREATE_ACC_GET_STARTED}
      </Text>
    </View>
  );
};

export default LogoSection;
