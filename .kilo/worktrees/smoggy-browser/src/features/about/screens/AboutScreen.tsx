/**
 * About Screen
 * App information, company details, and legal information
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface AboutScreenProps {
  onNavigateBack?: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigateBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const APP_VERSION = '1.0.0';
  const BUILD_NUMBER = '1';

  const features = [
    {
      id: '1',
      title: 'Expert Astrologers',
      description: 'Connect with verified and experienced astrologers',
      icon: 'verified-user',
    },
    {
      id: '2',
      title: 'Instant Consultation',
      description: 'Get instant chat and call consultations',
      icon: 'flash-on',
    },
    {
      id: '3',
      title: 'Accurate Predictions',
      description: 'Precise predictions based on Vedic astrology',
      icon: 'auto-graph',
    },
    {
      id: '4',
      title: 'Secure Platform',
      description: 'Your data and payments are fully secure',
      icon: 'lock',
    },
  ];

  const socialLinks = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
    { id: 'youtube', name: 'YouTube', icon: 'youtube-play', url: 'https://youtube.com' },
  ];

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.icon.primary} library="MaterialIcons" />
        </TouchableOpacity>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary }}>
          About
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo and Info */}
        <View style={styles.appInfoSection}>
          <View style={[styles.appLogo, { backgroundColor: colors.primary.main }]}>
            <Icon name="auto-awesome" size={48} color={colors.common.white} library="MaterialIcons" />
          </View>
          <Text variant="h5" weight="bold" style={{ color: colors.text.primary, marginTop: 16 }}>
            Dhwani Astro
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary, marginTop: 4 }}>
            Version {APP_VERSION} ({BUILD_NUMBER})
          </Text>
          <Text variant="captionSmall" style={{ color: colors.text.tertiary, marginTop: 8 }}>
            Your Trusted Astrology Companion
          </Text>
        </View>

        {/* About Description */}
        <Card style={styles.descriptionCard}>
          <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
            Dhwani Astro is a premier astrology platform that connects you with expert astrologers for personalized consultations. Get accurate predictions, remedies, and guidance for all aspects of your life.
          </Text>
        </Card>

        {/* Features */}
        <View style={styles.section}>
          <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, marginBottom: 16 }}>
            Why Choose Us
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: colors.primary.light + '20' }]}>
                  <Icon name={feature.icon} size={24} color={colors.primary.main} library="MaterialIcons" />
                </View>
                <Text variant="bodySmall" weight="semibold" style={{ color: colors.text.primary, marginTop: 8, textAlign: 'center' }}>
                  {feature.title}
                </Text>
                <Text variant="captionSmall" style={{ color: colors.text.tertiary, marginTop: 4, textAlign: 'center' }}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, marginBottom: 12 }}>
            Contact Us
          </Text>
          <Card style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem}>
              <Icon name="email" size={22} color={colors.primary.main} library="MaterialIcons" />
              <Text variant="body" style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>support@dhwaniastro.com</Text>
              <Icon name="chevron-right" size={22} color={colors.icon.tertiary} library="MaterialIcons" />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
            <TouchableOpacity style={styles.contactItem}>
              <Icon name="language" size={22} color={colors.primary.main} library="MaterialIcons" />
              <Text variant="body" style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>www.dhwaniastro.com</Text>
              <Icon name="chevron-right" size={22} color={colors.icon.tertiary} library="MaterialIcons" />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
            <TouchableOpacity style={styles.contactItem}>
              <Icon name="phone" size={22} color={colors.primary.main} library="MaterialIcons" />
              <Text variant="body" style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>+91 1234567890</Text>
              <Icon name="chevron-right" size={22} color={colors.icon.tertiary} library="MaterialIcons" />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, marginBottom: 12 }}>
            Follow Us
          </Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social) => (
              <TouchableOpacity
                key={social.id}
                style={[styles.socialButton, { backgroundColor: colors.background.secondary }]}
                onPress={() => handleSocialPress(social.url)}
                activeOpacity={0.7}
              >
                <Icon name={social.icon} size={22} color={colors.icon.primary} library="FontAwesome" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <View style={styles.legalLinks}>
            <TouchableOpacity style={styles.legalLink}>
              <Text variant="bodySmall" style={{ color: colors.primary.main }}>Terms of Service</Text>
            </TouchableOpacity>
            <View style={[styles.legalDivider, { backgroundColor: colors.border.light }]} />
            <TouchableOpacity style={styles.legalLink}>
              <Text variant="bodySmall" style={{ color: colors.primary.main }}>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={[styles.legalDivider, { backgroundColor: colors.border.light }]} />
            <TouchableOpacity style={styles.legalLink}>
              <Text variant="bodySmall" style={{ color: colors.primary.main }}>Cookie Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text variant="captionSmall" style={{ color: colors.text.tertiary, textAlign: 'center' }}>
            © 2024 Dhwani Astro. All rights reserved.
          </Text>
          <Text variant="captionSmall" style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: 4 }}>
            Made with ❤️ in India
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  appInfoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appLogo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionCard: {
    padding: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    padding: 0,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 54,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  legalDivider: {
    width: 1,
    height: 16,
  },
  copyrightSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default AboutScreen;

