import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Icon } from '../../../../components/Icon';
import {
  Session,
  SessionStatus,
} from '../../../../services/api/sessions/sessions.types';

interface SessionCardProps {
  session: Session;
  onPress: (session: Session) => void;
  onRemediesPress: (session: Session) => void;
}

const STATUS_COLORS: Record<SessionStatus, { dot: string; text: string }> = {
  COMPLETED: { dot: '#22C55E', text: '#22C55E' },
  ONGOING: { dot: '#F59E0B', text: '#F59E0B' },
  CANCELLED: { dot: '#EF4444', text: '#EF4444' },
  SCHEDULED: { dot: '#3B82F6', text: '#3B82F6' },
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
  //  session, onPress 
  session,
  onPress,
  onRemediesPress,
}) => {
  const { colors, isDark } = useTheme();
  const statusColors = STATUS_COLORS[session.status] || STATUS_COLORS.COMPLETED;

  const formatDateTime = (ms: string): string => {
    if (!ms) {
      return '-';
    }

    return new Date(Number(ms)).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(session)}
      style={[styles.cardOuterWrapper, { paddingHorizontal: 16 }]}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.background.primary,
            borderColor: isDark ? colors.border.dark : colors.border.light,
          },
        ]}>
        <View style={styles.cardTopRow}>
          <View style={styles.astrologerInfo}>
            {session.astrologerImage ? (
              <Image
                source={{ uri: session.astrologerImage }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.primary.light + '30' },
                ]}>
                <Icon name="person" size={22} color={colors.primary.main} />
              </View>
            )}
            <View style={styles.nameInfo}>
              <Text
                variant="body"
                weight="semibold"
                numberOfLines={1}
                style={{ color: colors.text.primary }}>
                {session.displayName || session.astrologerName || 'Astrologer'}
              </Text>
              <Text
                variant="captionSmall"
                style={{ color: colors.text.secondary, marginTop: 2 }}>
                Session ID: {session.id?.slice(0, 8) || 'N/A'}
              </Text>
              {/* <Text
                variant="captionSmall"
                style={{ color: colors.text.secondary, marginTop: 2 }}>
                {formatTime(session.startedAt)}
              </Text> */}
              <View style={styles.timeContainer}>
                <View style={styles.timeRow}>
                  <Icon name="play-circle-outline" size={14} color="#22C55E" />

                  <Text
                    variant="captionSmall"
                    style={[styles.timeText, { color: colors.text.secondary }]}>
                    Started: {formatDateTime(session.startedAt)}
                  </Text>
                </View>

                <View style={[styles.timeRow, { marginTop: 4 }]}>
                  <Icon name="stop-circle" size={14} color="#EF4444" />

                  <Text
                    variant="captionSmall"
                    style={[styles.timeText, { color: colors.text.secondary }]}>
                    Ended: {formatDateTime(session.endedAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.background.secondary },
            ]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColors.dot }]}
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
              style={{ color: colors.text.secondary, marginTop: 4 }}>
              Duration
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{ color: colors.text.primary, marginTop: 2 }}>
              {formatDuration(session.durationSec || 0)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Icon name="payments" size={16} color={colors.primary.main} />
            <Text
              variant="captionSmall"
              style={{ color: colors.text.secondary, marginTop: 4 }}>
              Spent
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{ color: colors.text.primary, marginTop: 2 }}>
              ₹{session.totalCharge || 0}
            </Text>
          </View>

          {/* <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Icon name="star" size={16} color={colors.primary.main} />
            <Text
              variant="captionSmall"
              style={{ color: colors.text.secondary, marginTop: 4 }}>
              Earned
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{ color: colors.text.primary, marginTop: 2 }}>
              {session.coinsEarned || 0}
            </Text>
          </View> */}
        </View>

        {/* <View style={styles.cardFooter}>
          <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
            Tap to view details
          </Text>
          <Icon name="chevron-right" size={18} color={colors.text.secondary} />
        </View> */}

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                borderColor: colors.border.light,
              },
            ]}
            onPress={() => onPress(session)}>
            <Text
              variant="captionSmall"
              style={{ color: colors.text.secondary }}>
              My Chat History
            </Text>

            <Icon
              name="chevron-right"
              size={18}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor: colors.primary.main,
              },
            ]}
            onPress={() => onRemediesPress(session)}>
            <Text
              variant="captionSmall"
              style={{ color: '#fff' }}>
              My Remedies
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardOuterWrapper: {
    marginBottom: 12,
  },
  cardContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  // cardFooter: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 12,
  //   paddingTop: 12,
  //   borderTopWidth: 1,
  //   borderTopColor: 'rgba(0,0,0,0.05)',
  // },
  timeContainer: {
    marginTop: 6,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    marginLeft: 6,
    fontSize: 11,
    flexShrink: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 10,
  },

  footerButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SessionCard;
