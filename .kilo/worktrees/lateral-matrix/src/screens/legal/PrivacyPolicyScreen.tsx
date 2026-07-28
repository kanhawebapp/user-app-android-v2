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

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({onBack}) => {
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
          Privacy Policy
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
          At Dhwani Astro, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines how we
          collect, use, disclose, and safeguard your data when you use our
          mobile application.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          1. Information We Collect
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We collect information you provide directly to us, including:
          {'\n'}- Name and contact information (phone number, email)
          {'\n'}- Profile information (date of birth, time, place of birth for
          astrological calculations)
          {'\n'}- Payment information (processed securely through third-party
          payment processors)
          {'\n'}- Communication history with astrologers
          {'\n'}- Device information and usage data
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          2. How We Use Your Information
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We use the information we collect to:
          {'\n'}- Provide, maintain, and improve our services
          {'\n'}- Process transactions and send related information
          {'\n'}- Generate personalized horoscopes and astrological readings
          {'\n'}- Connect you with astrologers for consultations
          {'\n'}- Send you technical notices, updates, and support messages
          {'\n'}- Respond to your comments, questions, and requests
          {'\n'}- Communicate with you about products, services, and events
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          3. Information Sharing
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We may share your information with:
          {'\n'}- Astrologers you choose to consult with (necessary for
          providing services)
          {'\n'}- Third-party service providers who perform services on our
          behalf
          {'\n'}- Payment processors for transaction processing
          {'\n'}- Analytics providers to understand app usage
          {'\n'}- Legal authorities when required by law
          {'\n'}
          {'\n'}We do not sell your personal information to third parties.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          4. Data Security
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the Internet is 100% secure, and we cannot guarantee
          absolute security.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          5. Data Retention
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We retain your personal information for as long as your account is
          active or as needed to provide you services. We will retain and use
          your information as necessary to comply with our legal obligations,
          resolve disputes, and enforce our agreements.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          6. Your Rights
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          You have the right to:
          {'\n'}- Access and receive a copy of your personal information
          {'\n'}- Correct or update inaccurate personal information
          {'\n'}- Request deletion of your personal information
          {'\n'}- Object to processing of your personal information
          {'\n'}- Request restriction of processing your personal information
          {'\n'}- Data portability - receive your data in a structured format
          {'\n'}
          {'\n'}To exercise these rights, please contact us at
          support@dhwaniastro.com.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          7. Children's Privacy
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Our service is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children under 13. If
          you are a parent or guardian and believe your child has provided us
          with personal information, please contact us immediately.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          8. Third-Party Links
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Our app may contain links to third-party websites, services, or
          applications that are not operated by us. We are not responsible for
          the privacy practices of these third parties. We encourage you to
          review the privacy policies of any third-party sites you visit.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          9. Changes to This Policy
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date. You are advised to review this
          Privacy Policy periodically for any changes.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          10. Contact Us
        </Text>

        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at:
          {'\n'}Email: support@dhwaniastro.com
          {'\n'}Phone: +91 (Your support number)
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
    marginTop:30
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

export default PrivacyPolicyScreen;
