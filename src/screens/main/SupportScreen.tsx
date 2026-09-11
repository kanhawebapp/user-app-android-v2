/**
 * Support Screen
 * Customer support and help options
 */

import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  ActivityIndicator,
  FlatList,
  Text as RNText,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {colors} from '../../theme/colors';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Card} from '../../components/Card';
import {Button} from '../../components/Button';
import { GoBack } from '../../components';
import {useFAQs} from '../../services/api/faq/useFAQs';

interface SupportScreenProps {
  onNavigateBack?: () => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({onNavigateBack}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {data: faqs, loading, error} = useFAQs();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const supportOptions = [
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chat',
      iconColor: colors.primary.main,
      backgroundColor: colors.primary.light + '20',
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      icon: 'email',
      iconColor: colors.secondary.main,
      backgroundColor: colors.secondary.light + '20',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Connect on WhatsApp',
      icon: 'phone-in-talk',
      iconColor: colors.common.green[500],
      backgroundColor: colors.common.green[50],
    },
    {
      id: 'call',
      title: 'Call Us',
      description: 'Speak with our team',
      icon: 'call',
      iconColor: colors.common.orange[500],
      backgroundColor: colors.common.orange[50],
    },
  ];

  const handleSupportOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/1234567890');
        break;
      case 'call':
        Linking.openURL('tel:+1234567890');
        break;
      case 'email':
        Linking.openURL('mailto:support@dhwaniastro.com');
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      {/* <View
        style={[
          styles.header,
          {backgroundColor: colors.background.primary, paddingTop: insets.top},
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          Support
        </Text>
        <View style={styles.placeholder} />
      </View> */}
     <GoBack onBack={onNavigateBack} title='Support' />
      <FlatList
        data={[{key: 'content'}]}
        keyExtractor={item => item.key}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <>
            {/* Header Card */}
            <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Icon
              name="headset-mic"
              size={48}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <Text
              variant="h5"
              weight="bold"
              style={{color: colors.text.primary, marginTop: 12}}>
              How can we help?
            </Text>
            <Text
              variant="body"
              style={{
                color: colors.text.secondary,
                marginTop: 8,
                textAlign: 'center',
              }}>
              We're here to help you with any questions or concerns
            </Text>
          </View>
        </Card>

        {/* Support Options */}
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary, marginBottom: 12}}>
          Contact Options
        </Text>
        <View style={styles.optionsGrid}>
          {supportOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSupportOptionPress(option.id)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.optionIcon,
                  {backgroundColor: option.backgroundColor},
                ]}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={option.iconColor}
                  library="MaterialIcons"
                />
              </View>
              <Text
                variant="bodySmall"
                weight="semibold"
                style={{
                  color: colors.text.primary,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                {option.title}
              </Text>
              <Text
                variant="captionSmall"
                style={{
                  color: colors.text.tertiary,
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary, marginBottom: 12}}>
            Frequently Asked Questions
          </Text>
          {loading ? (
            <View style={styles.faqLoading}>
              <ActivityIndicator size="large" color={colors.primary.main} />
            </View>
          ) : error ? (
            <View style={styles.faqState}>
              <RNText style={styles.error}>Failed to load FAQs: {error.message}</RNText>
            </View>
          ) : faqs.length === 0 ? (
            <View style={styles.faqState}>
              <RNText style={styles.empty}>No FAQs available at the moment.</RNText>
            </View>
          ) : (
            <FlatList
              data={faqs}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              renderItem={({item}) => {
                const expanded = expandedId === item.id;

                return (
                  <View
                    style={[
                      styles.card,
                      expanded && {
                        borderLeftColor: colors.primary.main,
                        borderLeftWidth: 4,
                      },
                    ]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleFaq(item.id)}
                      style={styles.questionRow}>
                      <RNText
                        style={[
                          styles.question,
                          expanded && {
                            color: colors.primary.main,
                          },
                        ]}>
                        {item.question}
                      </RNText>
                      <View
                        style={[
                          styles.iconContainer,
                          expanded && {
                            backgroundColor: colors.primary.main,
                          },
                        ]}>
                        <Icon
                          library="Feather"
                          name={expanded ? 'minus' : 'plus'}
                          size={18}
                          color={expanded ? '#fff' : colors.primary.main}
                        />
                      </View>
                    </TouchableOpacity>
                    {expanded && (
                      <View style={styles.answerContainer}>
                        <RNText style={styles.answer}>{item.answer}</RNText>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}
        </View>

        {/* Contact Info */}
        <Card style={styles.contactCard}>
          <Text
            variant="subtitle"
            weight="semibold"
            style={{color: colors.text.primary, marginBottom: 12}}>
            Other Ways to Reach Us
          </Text>
          <View style={styles.contactItem}>
            <Icon
              name="email"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <Text
              variant="body"
              style={{color: colors.text.secondary, marginLeft: 12}}>
              support@dhwaniastro.com
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Icon
              name="phone"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <Text
              variant="body"
              style={{color: colors.text.secondary, marginLeft: 12}}>
              +91 6366526901
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Icon
              name="schedule"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <Text
              variant="body"
              style={{color: colors.text.secondary, marginLeft: 12}}>
              Mon - Sat, 9 AM - 9 PM
            </Text>
          </View>
        </Card>

        {/* Submit Ticket Button */}
        {/* <Button
          title="Submit a Ticket"
          variant="outline"
          size="large"
          onPress={() => {}}
          style={{marginTop: 8}}
          leftIcon={
            <Icon
              name="mail-outline"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          }
        /> */}
          </>
        )}
      />
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
  headerCard: {
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  error: {
    color: colors.error.main,
    textAlign: 'center',
    marginTop: 24,
  },
  empty: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    paddingRight: 12,
    lineHeight: 24,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  answer: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  faqLoading: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    padding: 16,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default SupportScreen;
