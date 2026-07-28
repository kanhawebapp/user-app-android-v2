import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Header} from '../../components';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.main,
          },
        ]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          color={colors.text.primary}
          weight="semibold"
          style={styles.headerTitle}>
          Terms of Service
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text
          variant="body"
          color={colors.text.primary}
          style={styles.paragraph}>
          Welcome to Dhwani Astro. By accessing and using our mobile application
          and services, you agree to be bound by these Terms of Service.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          1. Acceptance of Terms
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          By downloading, installing, or using the Dhwani Astro app, you accept
          and agree to be bound by the terms and provision of this agreement. If
          you do not agree to abide by these terms, please do not use this
          service.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          2. Description of Service
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Dhwani Astro provides astrological consultations, horoscope
          predictions, kundali matching, and related spiritual services through
          our mobile application. The service includes chat and call
          consultations with verified astrologers.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          3. User Accounts
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your
          account and password. You agree to accept responsibility for all
          activities that occur under your account. You must provide accurate
          and complete registration information.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          4. Privacy & Data
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Your privacy is important to us. We collect, store, and process your
          personal information in accordance with our Privacy Policy. By using
          our services, you consent to such processing.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          5. Astrological Services Disclaimer
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          The astrological readings, predictions, and consultations provided
          through Dhwani Astro are for entertainment and informational purposes
          only. We do not guarantee the accuracy or completeness of any
          prediction. Astrology is not a science and should not be used as a
          substitute for professional advice.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          6. Payment & Refunds
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          All payments for consultations and services must be made in advance.
          Refund requests will be processed according to our refund policy.
          Please refer to the app for current pricing and refund terms.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          7. User Conduct
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          You agree not to use the service for any unlawful purpose or in any
          way that could damage, disable, overburden, or impair our services.
          Harassment, abuse, or disrespectful behavior toward astrologers or
          other users is strictly prohibited.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          8. Intellectual Property
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          All content, features, and functionality of the Dhwani Astro app are
          owned by us and are protected by international copyright, trademark,
          and other intellectual property laws.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          9. Limitation of Liability
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Dhwani Astro shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages resulting from your use of
          or inability to use the service.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          10. Changes to Terms
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We reserve the right to modify these Terms of Service at any time.
          Your continued use of the app after any changes constitutes acceptance
          of the new terms.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          11. Contact Information
        </Text>
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact
          us at support@dhwaniastro.com.
        </Text>

        <Text
          variant="caption"
          color={colors.text.tertiary}
          style={styles.lastUpdated}>
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  lastUpdated: {
    marginTop: 20,
    textAlign: 'center',
  },
});

export default TermsOfServiceScreen;
