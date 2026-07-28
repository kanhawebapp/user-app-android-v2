import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {Card} from '../../../components/Card';
import {Button} from '../../../components/Button';

interface FreeServicesScreenProps {
  onNavigateBack?: () => void;
}

const FreeServicesScreen: React.FC<FreeServicesScreenProps> = ({
  onNavigateBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const freeServices = [
    {
      id: '1',
      title: 'Daily Horoscope',
      description:
        'Get your daily horoscope predictions based on your zodiac sign',
      icon: 'stars',
      iconColor: colors.primary.main,
      backgroundColor: colors.primary.light + '20',
    },
    {
      id: '2',
      title: 'Free Kundali',
      description: 'Generate your basic Kundali with birth chart analysis',
      icon: 'auto-awesome',
      iconColor: colors.secondary.main,
      backgroundColor: colors.secondary.light + '20',
    },
    {
      id: '3',
      title: 'Match Making',
      description:
        'Check compatibility with your partner using Kundli matching',
      icon: 'favorite',
      iconColor: colors.common.red[400],
      backgroundColor: colors.common.red[50],
    },
    {
      id: '4',
      title: 'Panchang',
      description: 'Get daily panchang with auspicious and inauspicious times',
      icon: 'calendar-today',
      iconColor: colors.common.orange[500],
      backgroundColor: colors.common.orange[50],
    },
    {
      id: '5',
      title: 'Moon Sign',
      description: 'Find your moon sign and understand your emotional nature',
      icon: 'nightlight',
      iconColor: colors.common.purple[400],
      backgroundColor: colors.common.purple[50],
    },
    {
      id: '6',
      title: 'Numerology',
      description: 'Discover your lucky numbers and their significance',
      icon: 'pin',
      iconColor: colors.common.cyan[500],
      backgroundColor: colors.common.cyan[50],
    },
  ];

  const popularArticles = [
    {id: '1', title: 'How to Read Your Kundali', views: '10.5K'},
    {id: '2', title: 'Understanding Planetary Positions', views: '8.2K'},
    {id: '3', title: 'Rahu Ketu Transit 2024', views: '7.8K'},
    {id: '4', title: 'Remedies for Career Problems', views: '6.5K'},
  ];

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
          Free Services
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <Icon
              name="card-giftcard"
              size={40}
              color={colors.common.white}
              library="MaterialIcons"
            />
            <View style={styles.bannerText}>
              <Text
                variant="h6"
                weight="bold"
                style={{color: colors.common.white}}>
                Free Astrology Services
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: colors.common.white,
                  opacity: 0.9,
                  marginTop: 4,
                }}>
                Explore our free tools and predictions
              </Text>
            </View>
          </View>
        </Card>

        {/* Free Services Grid */}
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary, marginBottom: 16}}>
          Free Tools
        </Text>

        <View style={styles.servicesGrid}>
          {freeServices.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.serviceIcon,
                  {backgroundColor: service.backgroundColor},
                ]}>
                <Icon
                  name={service.icon}
                  size={28}
                  color={service.iconColor}
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
                {service.title}
              </Text>
              <Text
                variant="captionSmall"
                style={{
                  color: colors.text.tertiary,
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Articles */}
        <View style={styles.section}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary, marginBottom: 12}}>
            Popular Articles
          </Text>
          <Card style={styles.articlesCard}>
            {popularArticles.map((article, index) => (
              <TouchableOpacity
                key={article.id}
                style={[
                  styles.articleItem,
                  index < popularArticles.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border.light,
                  },
                ]}
                activeOpacity={0.7}>
                <Icon
                  name="article"
                  size={20}
                  color={colors.icon.secondary}
                  library="MaterialIcons"
                />
                <View style={styles.articleInfo}>
                  <Text variant="body" style={{color: colors.text.primary}}>
                    {article.title}
                  </Text>
                  <Text
                    variant="captionSmall"
                    style={{color: colors.text.tertiary, marginTop: 2}}>
                    {article.views} views
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={colors.icon.tertiary}
                  library="MaterialIcons"
                />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Subscribe CTA */}
        <Card style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <Icon
              name="workspace-premium"
              size={32}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <View style={styles.ctaText}>
              <Text
                variant="body"
                weight="semibold"
                style={{color: colors.text.primary}}>
                Unlock Premium Services
              </Text>
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 4}}>
                Get personalized consultations with expert astrologers
              </Text>
            </View>
          </View>
          <Button
            title="Subscribe Now"
            variant="primary"
            size="small"
            onPress={() => {}}
            style={{marginTop: 12}}
          />
        </Card>
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
  bannerCard: {
    padding: 20,
    marginBottom: 24,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    marginLeft: 16,
    flex: 1,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceCard: {
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
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  articlesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  articleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ctaCard: {
    padding: 16,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    marginLeft: 12,
    flex: 1,
  },
});

export default FreeServicesScreen;
