import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Card} from '../../../../../components/Card';
import {Button} from '../../../../../components/Button';
import {UpcomingLiveProps} from '../../types';
import images from '../../../../../assets/images';
import {Icon} from '../../../../../components';

export const UpcomingLive: React.FC<UpcomingLiveProps> = ({
  sessions = [],
  onSessionPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!sessions.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold" style={{fontWeight: '600'}}>
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
        contentContainerStyle={styles.scrollContent}>
        {sessions.map(session => (
          <Card
            variant="elevated"
            onPress={() => onSessionPress?.(session)}
            style={[styles.card, {padding: 0}]}>
            {/* <View
              style={[
                styles.thumbnail,
                {backgroundColor: colors.background.secondary},
              ]}>
              <ImageBackground
                source={images.Banner1}
                style={styles.thumbnail}
                imageStyle={{borderRadius: 8}}>
                <View style={styles.timeBadge}>
                  <Icon
                    name="schedule"
                    size={12}
                    color="#FFF"
                    library="MaterialIcons"
                  />
                  <Text variant="captionSmall" style={styles.timeText}>
                    {session.scheduledTime}
                  </Text>
                </View>
              </ImageBackground>
            </View> */}
            <View style={styles.imageWrapper}>
              <Image
                source={images.astro}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.timeBadge}>
                <Icon
                  name="schedule"
                  size={12}
                  color="#FFF"
                  library="MaterialIcons"
                />
                <Text variant="captionSmall" style={styles.timeText}>
                  {session.scheduledTime}
                </Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text
                variant="label"
                weight="semibold"
                style={{color: colors.text.primary}}
                numberOfLines={1}>
                {session.title}
              </Text>

              <View style={styles.hostRow}>
                <Text variant="caption" style={{color: colors.text.secondary}}>
                  Host:
                </Text>
                <Text
                  variant="label"
                  weight="semibold"
                  numberOfLines={1}
                  color={colors.primary.main}>
                  {session.astrologerName}
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
          </Card>
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
    // paddingHorizontal: 12,
  },
  card: {
    marginHorizontal: 6,
    width: 220,
  },
  thumbnail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  // timeBadge: {
  //   position: 'absolute',
  //   bottom: 8,
  //   right: 8,
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 4,
  //   paddingHorizontal: 6,
  //   paddingVertical: 2,
  //   borderRadius: 12,
  // },
  timeText: {
    color: '#FFF',
  },
  cardContent: {
    padding: 12,
    paddingTop: 8,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 12,
  },
  notifyButton: {
    height: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 5,
  },
  imageWrapper: {
    height: 130,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden', // 🔥 important for rounded corners
  },

  image: {
    width: '100%',
    height: '100%',
  },

  timeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
