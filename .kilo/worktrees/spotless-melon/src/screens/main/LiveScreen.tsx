import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {LoginRequiredModal} from '../../components/Modal';
import {useAuthStore} from '../../stores';

export interface LiveSession {
  id: number;
  title: string;
  description: string;
  astrologer: AstrologerProfile;
  viewers: number;
  status: 'live' | 'upcoming' | 'ended';
  thumbnail: string | null;
  category: SessionCategory;
  scheduledTime?: string;
  duration: number;
  language: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface AstrologerProfile {
  id: number;
  name: string;
  avatar: string | null;
  experience: number;
  rating: number;
  specializations: string[];
  totalSessions: number;
  isVerified: boolean;
}

export type SessionCategory =
  | 'horoscope'
  | 'tarot'
  | 'vastu'
  | 'career'
  | 'love'
  | 'health'
  | 'finance'
  | 'numerology';

export interface FilterOption {
  key: 'all' | 'live' | 'upcoming';
  label: string;
  icon?: string;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const CATEGORIES: {key: SessionCategory; label: string; icon: string}[] = [
  {key: 'horoscope', label: 'Horoscope', icon: 'auto-awesome'},
  {key: 'tarot', label: 'Tarot', icon: 'style'},
  {key: 'vastu', label: 'Vastu', icon: 'home'},
  {key: 'career', label: 'Career', icon: 'work'},
  {key: 'love', label: 'Love', icon: 'favorite'},
  {key: 'health', label: 'Health', icon: 'local-hospital'},
  {key: 'finance', label: 'Finance', icon: 'attach-money'},
  {key: 'numerology', label: 'Numerology', icon: 'tag'},
];

const FILTER_OPTIONS: FilterOption[] = [
  {key: 'all', label: 'All'},
  {key: 'live', label: 'Live', icon: 'radio-button-checked'},
  {key: 'upcoming', label: 'Upcoming', icon: 'schedule'},
];

const generateDummyAstrologers = (): AstrologerProfile[] => [
  {
    id: 1,
    name: 'Acharya Rahul Sharma',
    avatar: null,
    experience: 15,
    rating: 4.9,
    specializations: ['Vedic Astrology', 'Palmistry'],
    totalSessions: 12500,
    isVerified: true,
  },
  {
    id: 2,
    name: 'Pt. Priya Mishra',
    avatar: null,
    experience: 12,
    rating: 4.8,
    specializations: ['Tarot Reading', 'Numerology'],
    totalSessions: 8200,
    isVerified: true,
  },
  {
    id: 3,
    name: 'Dr. Amit Verma',
    avatar: null,
    experience: 20,
    rating: 4.7,
    specializations: ['Vastu Shastra', 'Prashna'],
    totalSessions: 15600,
    isVerified: true,
  },
  {
    id: 4,
    name: 'Maharshi Ankit',
    avatar: null,
    experience: 8,
    rating: 4.6,
    specializations: ['Career Guidance', 'Match Making'],
    totalSessions: 4500,
    isVerified: true,
  },
  {
    id: 5,
    name: 'Pt. Sneha Iyer',
    avatar: null,
    experience: 18,
    rating: 4.9,
    specializations: ['KP System', 'Remedies'],
    totalSessions: 18200,
    isVerified: true,
  },
  {
    id: 6,
    name: 'Acharya Kartik',
    avatar: null,
    experience: 10,
    rating: 4.5,
    specializations: ['Tarot', 'Angel Healing'],
    totalSessions: 3800,
    isVerified: false,
  },
];

const generateDummySessions = (): LiveSession[] => {
  const astrologers = generateDummyAstrologers();

  return [
    {
      id: 1,
      title: 'Daily Horoscope special guidance',
      description: 'Get your daily predictions and remedies for success',
      astrologer: astrologers[0],
      viewers: 2540,
      status: 'live',
      thumbnail: null,
      category: 'horoscope',
      duration: 60,
      language: 'Hindi',
      isFeatured: true,
      tags: ['Daily', 'Remedies', 'Guidance'],
    },
    {
      id: 2,
      title: 'Tarot Card Reading - Love & Relationships',
      description: 'Deep insight into your love life through tarot cards',
      astrologer: astrologers[1],
      viewers: 1890,
      status: 'live',
      thumbnail: null,
      category: 'tarot',
      duration: 45,
      language: 'English',
      isFeatured: true,
      tags: ['Love', 'Tarot', 'Insights'],
    },
    {
      id: 3,
      title: 'Vastu Consultation Session',
      description: 'Expert vastu tips for your home and office',
      astrologer: astrologers[2],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'vastu',
      scheduledTime: 'Today, 6:00 PM',
      duration: 90,
      language: 'Hindi',
      tags: ['Vastu', 'Property', 'Energy'],
    },
    {
      id: 4,
      title: 'Career & Job Guidance',
      description: 'Find the right career path and job opportunities',
      astrologer: astrologers[3],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'career',
      scheduledTime: 'Today, 7:30 PM',
      duration: 60,
      language: 'English',
      tags: ['Career', 'Job', 'Business'],
    },
    {
      id: 5,
      title: 'Numerology Life Path Reading',
      description: 'Discover your life path number and its significance',
      astrologer: astrologers[1],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'numerology',
      scheduledTime: 'Tomorrow, 10:00 AM',
      duration: 45,
      language: 'English',
      tags: ['Numerology', 'Life Path', 'Destiny'],
    },
    {
      id: 6,
      title: 'Health Astrology Consultation',
      description: 'Medical astrology and health remedies',
      astrologer: astrologers[4],
      viewers: 980,
      status: 'live',
      thumbnail: null,
      category: 'health',
      duration: 30,
      language: 'Hindi',
      tags: ['Health', 'Medical', 'Remedies'],
    },
    {
      id: 7,
      title: 'Finance & Stock Market Prediction',
      description: 'Astrological insights for financial growth',
      astrologer: astrologers[4],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'finance',
      scheduledTime: 'Tomorrow, 4:00 PM',
      duration: 75,
      language: 'English',
      tags: ['Finance', 'Stocks', 'Investment'],
    },
    {
      id: 8,
      title: 'Match Making & Marriage Remedies',
      description: 'Perfect match analysis and dosha removal',
      astrologer: astrologers[0],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'love',
      scheduledTime: 'Today, 8:00 PM',
      duration: 60,
      language: 'Hindi',
      tags: ['Marriage', 'Match Making', 'Love'],
    },
    {
      id: 9,
      title: 'Quick Tarot Reading - 5 Min Special',
      description: 'Fast answers to your pressing questions',
      astrologer: astrologers[5],
      viewers: 650,
      status: 'live',
      thumbnail: null,
      category: 'tarot',
      duration: 5,
      language: 'Hindi',
      tags: ['Quick', 'Tarot', 'Answers'],
    },
    {
      id: 10,
      title: 'Weekly Horoscope Overview',
      description: 'Complete week prediction for all zodiac signs',
      astrologer: astrologers[4],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'horoscope',
      scheduledTime: 'Sunday, 11:00 AM',
      duration: 120,
      language: 'Hindi',
      tags: ['Weekly', 'All Signs', 'Prediction'],
    },
    {
      id: 11,
      title: 'Business Astrology Consultation',
      description: 'Strategic decisions for business growth',
      astrologer: astrologers[2],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'career',
      scheduledTime: 'Sunday, 3:00 PM',
      duration: 90,
      language: 'English',
      tags: ['Business', 'Growth', 'Strategy'],
    },
    {
      id: 12,
      title: 'Angel Card Healing Session',
      description: 'Divine healing and spiritual guidance',
      astrologer: astrologers[5],
      viewers: 0,
      status: 'upcoming',
      thumbnail: null,
      category: 'love',
      scheduledTime: 'Saturday, 6:00 PM',
      duration: 45,
      language: 'English',
      tags: ['Healing', 'Spiritual', 'Angels'],
    },
  ];
};

interface LiveScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const LiveScreen: React.FC<LiveScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming'>(
    'all',
  );
  const [selectedCategory, setSelectedCategory] =
    useState<SessionCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [liveSessions] = useState<LiveSession[]>(() => generateDummySessions());

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'Please login to perform this action',
  );

  const featuredSession = useMemo(
    () => liveSessions.find(s => s.isFeatured && s.status === 'live'),
    [liveSessions],
  );

  const liveSessionsOnly = useMemo(
    () => liveSessions.filter(s => s.status === 'live'),
    [liveSessions],
  );

  const trendingAstrologers = useMemo(() => {
    return [...liveSessions]
      .map(s => s.astrologer)
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [liveSessions]);

  const filteredSessions = useMemo(() => {
    let filtered = liveSessions;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(s => s.status === activeFilter);
    }

    if (selectedCategory) {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    return filtered;
  }, [liveSessions, activeFilter, selectedCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  const handleJoinOrReminderPress = useCallback(
    (sessionStatus: string) => {
      if (sessionStatus === 'live') {
        handleRestrictedAction('Please login to join live sessions');
      } else {
        handleRestrictedAction(
          'Please login to set reminders for upcoming sessions',
        );
      }
    },
    [handleRestrictedAction],
  );

  const handleCategoryPress = useCallback((category: SessionCategory) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  const renderCategoryPill = (category: {
    key: SessionCategory;
    label: string;
    icon: string;
  }) => {
    const isActive = selectedCategory === category.key;
    return (
      <TouchableOpacity
        key={category.key}
        style={[
          styles.categoryPill,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.background.secondary,
          },
        ]}
        onPress={() => handleCategoryPress(category.key)}>
        <Icon
          name={category.icon}
          size={14}
          color={isActive ? colors.primary.contrastText : colors.text.secondary}
          library="MaterialIcons"
        />
        <Text
          variant="captionSmall"
          weight="medium"
          style={{
            color: isActive
              ? colors.primary.contrastText
              : colors.text.secondary,
            marginLeft: 4,
          }}>
          {category.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filter: FilterOption) => {
    const isActive = activeFilter === filter.key;
    return (
      <TouchableOpacity
        key={filter.key}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.background.secondary,
          },
        ]}
        onPress={() => {
          setActiveFilter(filter.key);
          setSelectedCategory(null);
        }}>
        {filter.icon && (
          <Icon
            name={filter.icon}
            size={16}
            color={
              isActive ? colors.primary.contrastText : colors.text.secondary
            }
            library="MaterialIcons"
          />
        )}
        <Text
          variant="label"
          weight="medium"
          style={{
            color: isActive
              ? colors.primary.contrastText
              : colors.text.secondary,
            marginLeft: filter.icon ? 6 : 0,
          }}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLiveBadge = () => (
    <View
      style={[styles.liveBadgeContainer, {backgroundColor: colors.error.main}]}>
      <View style={styles.liveDot} />
      <Text
        variant="captionSmall"
        weight="bold"
        style={{color: colors.common.white}}>
        LIVE
      </Text>
    </View>
  );

  const renderUpcomingBadge = () => (
    <View
      style={[
        styles.liveBadgeContainer,
        {backgroundColor: colors.primary.main},
      ]}>
      <Icon
        name="schedule"
        size={12}
        color={colors.common.white}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        weight="bold"
        style={{color: colors.common.white, marginLeft: 4}}>
        UPCOMING
      </Text>
    </View>
  );

  const renderViewerCount = (count: number) => (
    <View style={styles.viewerCountContainer}>
      <Icon
        name="visibility"
        size={14}
        color={colors.common.white}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        style={{color: colors.common.white, marginLeft: 4}}>
        {count.toLocaleString()}+
      </Text>
    </View>
  );

  const renderRating = (rating: number) => (
    <View style={styles.ratingContainer}>
      <Icon
        name="star"
        size={12}
        color={colors.warning.main}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        weight="medium"
        style={{color: colors.text.secondary}}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );

  const renderFeaturedSession = () => {
    if (!featuredSession || activeFilter !== 'all') {
      return null;
    }

    return (
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" weight="bold">
            Featured Live
          </Text>
          <TouchableOpacity>
            <Text variant="caption" style={{color: colors.primary.main}}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <Card
          style={styles.featuredCard}
          variant="elevated"
          onPress={() => handleJoinOrReminderPress('live')}>
          <View
            style={[
              styles.featuredThumbnail,
              {backgroundColor: colors.background.tertiary},
            ]}>
            {renderLiveBadge()}
            {renderViewerCount(featuredSession.viewers)}
            <View
              style={[
                styles.playButton,
                {backgroundColor: colors.primary.main},
              ]}>
              <Icon
                name="play-arrow"
                size={24}
                color={colors.primary.contrastText}
                library="MaterialIcons"
              />
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text variant="subtitle" weight="semibold" numberOfLines={2}>
              {featuredSession.title}
            </Text>
            <View style={styles.featuredMeta}>
              <Text variant="caption" style={{color: colors.text.secondary}}>
                {featuredSession.astrologer.name}
              </Text>
              {renderRating(featuredSession.astrologer.rating)}
            </View>
            <View style={styles.featuredTags}>
              {featuredSession.tags.slice(0, 2).map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, {backgroundColor: colors.primary.light}]}>
                  <Text
                    variant="captionSmall"
                    style={{color: colors.primary.dark}}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const renderTrendingAstrologers = () => {
    if (activeFilter !== 'all') {
      return null;
    }

    return (
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" weight="bold">
            Top Astrologers
          </Text>
          <TouchableOpacity>
            <Text variant="caption" style={{color: colors.primary.main}}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.astrologerScroll}>
          {trendingAstrologers.map(astrologer => (
            <TouchableOpacity
              key={astrologer.id}
              style={[
                styles.astrologerCard,
                {backgroundColor: colors.card.background},
              ]}>
              <View
                style={[
                  styles.astrologerAvatar,
                  {backgroundColor: colors.background.tertiary},
                ]}>
                <Icon
                  name="person"
                  size={24}
                  color={colors.text.secondary}
                  library="MaterialIcons"
                />
              </View>
              <Text variant="captionSmall" weight="medium" numberOfLines={1}>
                {astrologer.name.split(' ').slice(1).join(' ')}
              </Text>
              {renderRating(astrologer.rating)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSessionCard = (session: LiveSession) => (
    <Card key={session.id} style={styles.sessionCard} variant="elevated">
      <View
        style={[
          styles.thumbnail,
          {backgroundColor: colors.background.tertiary},
        ]}>
        {session.status === 'live' && renderLiveBadge()}
        {session.status === 'upcoming' && renderUpcomingBadge()}
        {session.status === 'live' && renderViewerCount(session.viewers)}
      </View>
      <View style={styles.sessionInfo}>
        <Text variant="subtitle" weight="semibold" numberOfLines={2}>
          {session.title}
        </Text>
        <View style={styles.astrologerRow}>
          <View
            style={[
              styles.smallAvatar,
              {backgroundColor: colors.background.secondary},
            ]}>
            <Icon
              name="person"
              size={12}
              color={colors.text.secondary}
              library="MaterialIcons"
            />
          </View>
          <Text
            variant="captionSmall"
            style={{color: colors.text.secondary, flex: 1, marginLeft: 4}}
            numberOfLines={1}>
            {session.astrologer.name.split(' ').slice(1).join(' ')}
          </Text>
          {renderRating(session.astrologer.rating)}
        </View>
        <View style={styles.sessionMeta}>
          <View style={styles.metaItem}>
            <Icon
              name="schedule"
              size={12}
              color={colors.text.tertiary}
              library="MaterialIcons"
            />
            <Text
              variant="captionSmall"
              style={{color: colors.text.tertiary, marginLeft: 4}}>
              {session.status === 'upcoming'
                ? session.scheduledTime
                : `${session.duration} min`}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon
              name="translate"
              size={12}
              color={colors.text.tertiary}
              library="MaterialIcons"
            />
            <Text
              variant="captionSmall"
              style={{color: colors.text.tertiary, marginLeft: 4}}>
              {session.language}
            </Text>
          </View>
        </View>
        <Button
          title={session.status === 'live' ? 'Join Now' : 'Set Reminder'}
          variant={session.status === 'live' ? 'primary' : 'outline'}
          size="small"
          style={{marginTop: 8}}
          onPress={() => handleJoinOrReminderPress(session.status)}
        />
      </View>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text variant="h5" weight="bold">
          Live Sessions
        </Text>
        <Text
          variant="bodySmall"
          style={{color: colors.text.secondary, marginTop: 4}}>
          Watch expert astrologers live
        </Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="h6" weight="bold" style={{color: colors.primary.main}}>
            {liveSessionsOnly.length}
          </Text>
          <Text variant="caption" style={{color: colors.text.secondary}}>
            Live Now
          </Text>
        </View>
        <View
          style={[styles.statDivider, {backgroundColor: colors.border.light}]}
        />
        <View style={styles.statItem}>
          <Text variant="h6" weight="bold" style={{color: colors.primary.main}}>
            {liveSessions.filter(s => s.status === 'upcoming').length}
          </Text>
          <Text variant="caption" style={{color: colors.text.secondary}}>
            Upcoming
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        {FILTER_OPTIONS.map(renderFilterButton)}
      </ScrollView>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text variant="label" weight="medium" style={{marginBottom: 8}}>
        Browse by Category
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}>
        {CATEGORIES.map(renderCategoryPill)}
      </ScrollView>
    </View>
  );

  const renderSessionsList = () => (
    <FlatList
      data={filteredSessions}
      renderItem={({item}) => renderSessionCard(item)}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      contentContainerStyle={[
        styles.listContent,
        {paddingBottom: insets.bottom + 100},
      ]}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        filteredSessions.length > 0 ? (
          <Text variant="label" weight="medium" style={styles.listHeader}>
            {activeFilter === 'all'
              ? 'All Sessions'
              : activeFilter === 'live'
              ? 'Live Now'
              : 'Upcoming Sessions'}
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon
            name="live-tv"
            size={64}
            color={colors.icon.tertiary}
            library="MaterialIcons"
          />
          <Text
            variant="body"
            style={{color: colors.text.secondary, marginTop: 16}}>
            No sessions available
          </Text>
          <Text
            variant="caption"
            style={{color: colors.text.tertiary, marginTop: 4}}>
            Check back later for new sessions
          </Text>
        </View>
      }
    />
  );

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }>
        {renderHeader()}
        {renderFilterSection()}
        {renderCategories()}
        {renderFeaturedSession()}
        {renderTrendingAstrologers()}
        {renderSessionsList()}
      </ScrollView>
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTextContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  filterSection: {
    marginVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    paddingRight: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredCard: {
    padding: 0,
    overflow: 'hidden',
  },
  featuredThumbnail: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  viewerCountContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  featuredTags: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  trendingSection: {
    marginBottom: 16,
  },
  astrologerScroll: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  astrologerCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 80,
  },
  astrologerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listHeader: {
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  sessionCard: {
    width: CARD_WIDTH,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionInfo: {
    flex: 1,
  },
  astrologerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  smallAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
});

export default LiveScreen;
