import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { API_BASE_URL } from '../../../../../constants/api.constants';
import { OngoingLiveProps, UpcomingLive } from './type';
import { styles } from './styles';
import { useOngoingLive } from './hooks/useOngoingLive';

const getProfilePicUrl = (profilePic?: string | null): string | null => {
  if (!profilePic) {
    return null;
  }
  if (profilePic.startsWith('http')) {
    return profilePic;
  }
  return `${API_BASE_URL.DEVELOPMENT}${profilePic.replace(/^\/+/, '')}`;
};

const getAstrologerName = (session: UpcomingLive): string =>
  session.astrologer?.displayName?.trim() ||
  session.astrologer?.name?.trim() ||
  '';

export const OngoingLive: React.FC<OngoingLiveProps> = ({
  sessions = [],
  loading = false,
  joiningSessionId = null,
  onSessionPress,
  onJoinPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [failedAvatarIds, setFailedAvatarIds] = useState<Set<string>>(
    () => new Set(),
  );

  const { sessions: sessionsData, handleSessionPress, isLiveSession } =
    useOngoingLive(sessions, onSessionPress, onViewAllPress);

  const handleAvatarError = useCallback((sessionId: string) => {
    setFailedAvatarIds(prev => new Set(prev).add(sessionId));
  }, []);

  const handleJoin = useCallback(
    (session: UpcomingLive) => {
      if (onJoinPress) {
        onJoinPress(session);
        return;
      }
      handleSessionPress(session);
    },
    [handleSessionPress, onJoinPress],
  );

  if (loading && sessionsData.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="h6" weight="semibold">
              Ongoing Live Sessions

            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary.main} />
        </View>
      </View>
    );
  }

  if (!sessionsData.length) {
    return null;
  }

  const renderCard = (item: UpcomingLive) => {
    const profilePicUrl = failedAvatarIds.has(item.id)
      ? null
      : getProfilePicUrl(item.astrologer?.profilePic);
    const isJoining = joiningSessionId === item.id;
    const rating = item.astrologer?.rating;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.card,
          {
            backgroundColor: colors.card.background,
            shadowColor: colors.common.black,
          },
        ]}
        onPress={() => handleJoin(item)}
        activeOpacity={0.9}
        disabled={isJoining}>
        <View
          style={[
            styles.thumbnail,
            { backgroundColor: colors.background.tertiary },
          ]}>
          {profilePicUrl ? (
            <Image
              source={{ uri: profilePicUrl }}
              style={styles.thumbnailImage}
              resizeMode="cover"
              onError={() => handleAvatarError(item.id)}
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Icon
                name="person"
                size={36}
                color={colors.text.secondary}
                library="MaterialIcons"
              />
            </View>
          )}

          {isLiveSession(item) && (
            <View style={styles.liveBadgeCard}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={styles.liveBadgeText}>
                LIVE
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text
            variant="label"
            weight="semibold"
            style={{ color: colors.text.primary }}
            numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.contentFooter}>
            <View style={styles.metaBlock}>
              <Text
                variant="caption"
                style={[styles.astrologerName, { color: colors.text.secondary }]}
                numberOfLines={1}>
                {getAstrologerName(item)}
              </Text>
              {rating != null && (
                <View style={styles.ratingRow}>
                  <Icon
                    name="star"
                    size={11}
                    color={colors.warning.main}
                    library="MaterialIcons"
                  />
                  <Text
                    variant="captionSmall"
                    weight="medium"
                    style={{ color: colors.text.secondary, marginLeft: 2 }}>
                    {Number(rating).toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.joinButton,
                { borderColor: colors.primary.main },
                isJoining && styles.joinButtonDisabled,
              ]}
              onPress={() => handleJoin(item)}
              disabled={isJoining}
              activeOpacity={0.7}>
              {isJoining ? (
                <ActivityIndicator size="small" color={colors.primary.main} />
              ) : (
                <Text
                  variant="caption"
                  weight="medium"
                  style={{ color: colors.primary.main }}>
                  Join Now
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="h6" weight="semibold">
            Ongoing Live Sessions
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {sessionsData.map(renderCard)}
      </ScrollView>
    </View>
  );
};

export default OngoingLive;
