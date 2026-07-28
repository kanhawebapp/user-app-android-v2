
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { UpcomingLiveProps } from '../../types';

export const UpcomingLive: React.FC<UpcomingLiveProps> = ({
  sessions = [],
  onSessionPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!sessions.length) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold">
          Upcoming Sessions
        </Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={onViewAllPress}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => onSessionPress?.(session)}
            activeOpacity={0.9}
          >
             <View style={[styles.thumbnail, { backgroundColor: colors.background.secondary }]}>
                <Icon name="event" size={32} color={colors.primary.main} library="MaterialIcons" />
                <View style={styles.timeBadge}>
                    <Text variant="captionSmall" style={styles.timeText}>
                        {session.scheduledTime}
                    </Text>
                </View>
            </View>
            
            <View style={styles.cardContent}>
                <Text variant="label" weight="semibold" numberOfLines={1}>
                    {session.astrologerName}
                </Text>
                <Text variant="caption" style={{ color: colors.text.secondary }} numberOfLines={1}>
                    {session.title}
                </Text>
                <View style={styles.footer}>
                     <Icon name="schedule" size={14} color={colors.text.secondary} library="MaterialIcons" />
                     <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>
                        {session.duration}
                     </Text>
                </View>
                <Button
                    title="Notify Me"
                    variant="outline"
                    size="small"
                    style={styles.notifyButton}
                    onPress={() => onSessionPress?.(session)}
                />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: 200,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  thumbnail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeText: {
    color: '#FFF',
  },
  cardContent: {
    padding: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  notifyButton: {
    height: 32,
  },
});
