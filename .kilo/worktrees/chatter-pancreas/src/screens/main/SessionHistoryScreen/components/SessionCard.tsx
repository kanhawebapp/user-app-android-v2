import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
// import {SkeletonLoader} from '../../../components/SkeletonLoader/ShimmerLoader';
import {
  Session,
  SessionStatus,
} from '../../../../services/api/sessions/sessions.types';
import SkeletonLoader from '../../../../components/SkeletonLoader/ShimmerLoader';

interface SessionCardProps {
  session: Session;
  onPress: (session: Session) => void;
  isPressed?: boolean;
}

const STATUS_COLORS: Record<SessionStatus, {dot: string; text: string}> = {
  COMPLETED: {dot: '#22C55E', text: '#22C55E'},
  ONGOING: {dot: '#F59E0B', text: '#F59E0B'},
  CANCELLED: {dot: '#EF4444', text: '#EF4444'},
  SCHEDULED: {dot: '#3B82F6', text: '#3B82F6'},
};

const getStatusLabel = (status: SessionStatus): string => {
  const labels: Record<SessionStatus, string> = {
    COMPLETED: 'Completed',
    ONGOING: 'Ongoing',
    CANCELLED: 'Cancelled',
    SCHEDULED: 'Scheduled',
  };
  return labels[status];
};

const formatTime = (ms: string): string => {
  if (!ms) {
    return '-';
  }
  return new Date(Number(ms)).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds === 0) {
    return '0s';
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
  isPressed = false,
}) => {
  const {colors, isDark} = useTheme();
  const statusColors = STATUS_COLORS[session.status] || STATUS_COLORS.COMPLETED;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(session)}
      style={[
        styles.cardOuterWrapper,
        {paddingHorizontal: 16},
        isPressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.background.primary,
            borderColor: isDark ? colors.border.dark : colors.border.light,
          },
        ]}>
        {/* Loading overlay */}
        {isPressed && (
          <View style={styles.loadingOverlay}>
            <SkeletonLoader
              width="100%"
              height={12}
              borderRadius={6}
              visible={true}
              style={[styles.loadingLine, {marginTop: 8, marginHorizontal: 16}]}
            />
            <SkeletonLoader
              width="60%"
              height={10}
              borderRadius={4}
              visible={true}
              style={[
                styles.loadingLine,
                {marginTop: 4, marginHorizontal: 16, alignSelf: 'flex-start'},
              ]}
            />
            <SkeletonLoader
              width="40%"
              height={8}
              borderRadius={4}
              visible={true}
              style={[
                styles.loadingLine,
                {marginTop: 2, marginHorizontal: 16, alignSelf: 'flex-start'},
              ]}
            />
          </View>
        )}

        {!isPressed && (
          <>
            <View style={styles.cardTopRow}>
              <View style={styles.astrologerInfo}>
                {session.astrologerImage ? (
                  <Image
                    source={{uri: session.astrologerImage}}
                    style={styles.avatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarPlaceholder,
                      {backgroundColor: colors.primary.light + '30'},
                    ]}>
                    <Icon name="person" size={22} color={colors.primary.main} />
                  </View>
                )}
                <View style={styles.nameInfo}>
                  <Text
                    variant="body"
                    weight="semibold"
                    numberOfLines={1}
                    style={{color: colors.text.primary}}>
                    {session.astrologerName || 'Astrologer'}
                  </Text>
                  <Text
                    variant="captionSmall"
                    style={{color: colors.text.secondary, marginTop: 2}}>
                    {formatTime(session.startedAt)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: colors.background.secondary},
                ]}>
                <View
                  style={[
                    styles.statusDot,
                    {backgroundColor: statusColors.dot},
                  ]}
                />
                <Text
                  variant="captionSmall"
                  weight="medium"
                  style={{
                    color: statusColors.text,
                  }}>
                  {getStatusLabel(session.status)}
                </Text>
              </View>
            </View>

            <View style={styles.cardStatsRow}>
              <View style={styles.statBox}>
                <Icon name="schedule" size={16} color={colors.primary.main} />
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary, marginTop: 4}}>
                  Duration
                </Text>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  style={{color: colors.text.primary, marginTop: 2}}>
                  {formatDuration(session.durationSec || 0)}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Icon name="payments" size={16} color={colors.secondary.main} />
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary, marginTop: 4}}>
                  Spent
                </Text>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  style={{color: colors.text.primary, marginTop: 2}}>
                  ₹{session.totalCharge || 0}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Icon name="star" size={16} color="#EAB308" />
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary, marginTop: 4}}>
                  Earned
                </Text>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  style={{color: colors.text.primary, marginTop: 2}}>
                  {session.coinsEarned || 0}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary}}>
                Tap to view details
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.text.secondary}
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardOuterWrapper: {
    marginBottom: 16,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    transform: [{scale: 0.98}],
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  astrologerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInfo: {
    marginLeft: 14,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLine: {
    marginVertical: 4,
  },
});

export default SessionCard;
