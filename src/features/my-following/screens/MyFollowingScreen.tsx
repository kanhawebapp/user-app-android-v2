import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {Button} from '../../../components/Button';
import {Card} from '../../../components/Card';
import {GoBack} from '../../../components';

import {useTheme} from '../../../theme';
import {useFollowedAstrologers} from '../../../services/api/followedastrologersList/useFollowedAstrologers';
import {FollowedAstrologer} from '../../../services/api/followedastrologersList/followed-astrologers.types';
import {API_BASE_URL} from '../../../constants/api.constants';
import {ConsultationFlowLayer} from '../../../screens/main/consultation';
import {getAstrologerStatus} from '../../../screens/main/chat/utils/astrologerStatus';
import {formatDate} from '../../../utils/helpers';
import {DATE_FORMATS} from '../../../constants/app.constants';

interface MyFollowingScreenProps {
  onNavigateBack?: () => void;
  onAstrologerPress: any;
}

const AVATAR_BORDER = '#C9B6E8';
const RATING_STAR = '#F5B301';
const META_TEXT = '#8E8E9A';
const FOLLOWED_TEXT = '#9A9AA8';

const parseCreatedAt = (value: unknown): Date | null => {
  if (value == null || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const ms = numeric < 1e12 ? numeric * 1000 : numeric;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getFollowedDateLabel = (
  astrologer: FollowedAstrologer,
): string | null => {
  const parsed = parseCreatedAt(astrologer?.createdAt);
  if (!parsed) {
    return null;
  }

  return `Followed on ${formatDate(parsed, DATE_FORMATS.DISPLAY_DATE)}`;
};

const getSkillsLabel = (skills?: string[] | null): string | null => {
  if (!Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  const visibleSkills = skills.filter(Boolean).slice(0, 2).join(', ');

  if (!visibleSkills) {
    return null;
  }

  return skills.length > 2 ? `${visibleSkills}...` : visibleSkills;
};

const resolveProfileImageUrl = (profilePic?: string | null): string => {
  if (!profilePic) {
    return '';
  }

  if (
    profilePic.startsWith('http://') ||
    profilePic.startsWith('https://')
  ) {
    return profilePic;
  }

  const normalizedPath = profilePic.startsWith('/')
    ? profilePic
    : `/${profilePic}`;

  return `${API_BASE_URL.DEVELOPMENT}${normalizedPath}`;
};

const MyFollowingScreen: React.FC<MyFollowingScreenProps> = ({
  onNavigateBack,
  onAstrologerPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useFollowedAstrologers();

  return (
    <ConsultationFlowLayer>
      {() => (
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background.primary,
            },
          ]}>
          <StatusBar
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background.primary}
          />

          <GoBack onBack={onNavigateBack} title="My Following" />

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: insets.bottom + 100,
              },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                colors={[colors.primary.main]}
                tintColor={colors.primary.main}
              />
            }>
            {loading && !refreshing && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color={colors.primary.main}
                />
              </View>
            )}

            {!loading && !!error && (
              <View style={styles.emptyState}>
                <Icon
                  name="error-outline"
                  size={64}
                  color={colors.error.main}
                  library="MaterialIcons"
                />

                <Text
                  variant="h6"
                  weight="semibold"
                  style={{
                    color: colors.text.secondary,
                    marginTop: 16,
                    textAlign: 'center',
                  }}>
                  Failed to load following
                </Text>

                <Text
                  variant="body"
                  style={{
                    color: colors.text.tertiary,
                    marginTop: 8,
                    textAlign: 'center',
                  }}>
                  {error}
                </Text>

                <Button
                  title="Retry"
                  variant="outline"
                  onPress={refresh}
                  style={{marginTop: 16}}
                />
              </View>
            )}

            {!loading &&
              !error &&
              data.map(astrologer => {
                const imageUrl = resolveProfileImageUrl(
                  astrologer.profilePic,
                );
                const {status, color: indicatorColor} =
                  getAstrologerStatus(astrologer);
                const showStatusDot =
                  status === 'online' || status === 'busy';
                const followedLabel = getFollowedDateLabel(astrologer);
                const skillsLabel = getSkillsLabel(astrologer.skills);

                return (
                  <Card
                    key={astrologer.id}
                    style={styles.astrologerCard}
                    onPress={() => {
                      onAstrologerPress(astrologer);
                    }}>
                    <View style={styles.astrologerHeader}>
                      <View style={styles.avatarContainer}>
                        {imageUrl ? (
                          <Image
                            source={{uri: imageUrl}}
                            style={[
                              styles.avatar,
                              {borderColor: AVATAR_BORDER},
                            ]}
                          />
                        ) : (
                          <View
                            style={[
                              styles.avatar,
                              styles.avatarPlaceholder,
                              {
                                backgroundColor:
                                  colors.primary.light + '30',
                                borderColor: AVATAR_BORDER,
                              },
                            ]}>
                            <Icon
                              name="person"
                              size={28}
                              color={colors.primary.main}
                              library="MaterialIcons"
                            />
                          </View>
                        )}

                        {showStatusDot && (
                          <View
                            style={[
                              styles.onlineIndicator,
                              {
                                backgroundColor: indicatorColor,
                                borderColor: colors.common.white,
                              },
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.astrologerInfo}>
                        <View style={styles.nameRow}>
                          <Text
                            variant="body"
                            weight="bold"
                            numberOfLines={1}
                            style={[
                              styles.nameText,
                              {color: colors.text.primary},
                            ]}>
                            {astrologer.displayName ||
                              astrologer.name ||
                              'Astrologer'}
                          </Text>

                          <Icon
                            name="verified"
                            size={16}
                            color={colors.primary.main}
                            library="MaterialIcons"
                            style={styles.verifiedIcon}
                          />
                        </View>

                        <View style={styles.ratingRow}>
                          <Icon
                            name="star-border"
                            size={15}
                            color={RATING_STAR}
                            library="MaterialIcons"
                          />
                          <Text
                            variant="captionSmall"
                            style={styles.ratingText}>
                            {Number(astrologer.rating ?? 0).toFixed(1)}
                          </Text>
                        </View>

                        
                        {!!followedLabel && (
                          <Text
                            variant="captionSmall"
                            style={styles.followedText}>
                            {followedLabel}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card>
                );
              })}

            {!loading && !error && data.length === 0 && (
              <View style={styles.emptyState}>
                <Icon
                  name="favorite-border"
                  size={64}
                  color={colors.icon.tertiary}
                  library="MaterialIcons"
                />

                <Text
                  variant="h6"
                  weight="semibold"
                  style={{
                    color: colors.text.secondary,
                    marginTop: 16,
                  }}>
                  No Following Yet
                </Text>

                <Text
                  variant="body"
                  style={{
                    color: colors.text.tertiary,
                    marginTop: 8,
                    textAlign: 'center',
                  }}>
                  Start following astrologers to see them here
                </Text>
              </View>
            )}

            {hasMore && !loading && !error && (
              <Button
                title={loadingMore ? 'Loading...' : 'Load More'}
                variant="outline"
                onPress={loadMore}
                disabled={loadingMore}
                style={{marginTop: 8}}
              />
            )}
          </ScrollView>
        </View>
      )}
    </ConsultationFlowLayer>
  );
};

export default MyFollowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },

  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  astrologerCard: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 14,
    borderRadius: 20,
    alignItems: 'stretch',
    alignSelf: 'stretch',
    width: '100%',
    elevation: 1,
  },

  astrologerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: AVATAR_BORDER,
  },

  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },

  astrologerInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    minWidth: 0,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },

  nameText: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
  },

  verifiedIcon: {
    marginLeft: 6,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  ratingText: {
    color: META_TEXT,
    marginLeft: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  skillsText: {
    color: META_TEXT,
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
  },

  followedText: {
    color: FOLLOWED_TEXT,
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
});
