import React from 'react';
import {
  Linking,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {SOCIAL_MEDIA} from '../constants';

interface SocialIconProps {
  social: (typeof SOCIAL_MEDIA)[0];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const SocialIcon: React.FC<SocialIconProps> = ({social, onPress, style}) => {
  const theme = useTheme();
  const isDarkMode = theme.colors.background.primary === '#121212';

  // Brand colors for each social media platform
  const getBrandColors = () => {
    switch (social.key) {
      case 'facebook':
        return {
          default: '#1877F2',
          pressed: '#0C4B9C',
        };
      case 'linkedin':
        return {
          default: '#0A66C2',
          pressed: '#004170',
        };
      case 'instagram':
        return {
          default: '#E4405F',
          pressed: '#9A2540',
        };
      case 'youtube':
        return {
          default: '#FF0000',
          pressed: '#B30000',
        };
      default:
        return {
          default: theme.colors.primary.main,
          pressed: theme.colors.primary.dark,
        };
    }
  };

  const brandColors = getBrandColors();

  const socialMediaUrls: Record<string, string> = {
    facebook: 'https://www.facebook.com/dhwaniastro',
    linkedin: 'https://www.linkedin.com/company/dhwani-astro11/',
    instagram: 'https://www.instagram.com/healer.dhwaaani/',
    youtube: 'https://www.youtube.com/@dhwaniastro',
  };

  const handlePress = () => {
    const url = socialMediaUrls[social.key];
    if (url) {
      onPress?.();
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity
      style={[
        sidebarStyle.socialIcon,
        {
          backgroundColor: brandColors.default,
          shadowColor: brandColors.default,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Visit us on ${social.key}`}
      accessibilityRole="link">
      <Icon
        name={social.icon}
        size={20}
        color="#FFFFFF"
        library={social.library}
      />
    </TouchableOpacity>
  );
};

export const SocialIcons: React.FC = () => {
  return (
    <View style={sidebarStyle.socialMediaContainer}>
      {SOCIAL_MEDIA.map(social => (
        <SocialIcon key={social.key} social={social} />
      ))}
    </View>
  );
};
