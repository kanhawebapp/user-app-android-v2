import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';
import {Button} from '../../../../components';
import images from '../../../../assets/images';

interface ChatHeaderProps {
  astrologerName: string;
  astrologerImage?: string;
  astrologerRating?: number;
  isOnline?: boolean;
  lastSeen?: string;
  showProfile: boolean;
  onBack: () => void;
  onToggleProfile: () => void;
  onEndChat: () => void;
  pulseAnim: Animated.Value;
  timeLeft?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  astrologerName,
  astrologerImage,
  astrologerRating = 4.8,
  isOnline = true,
  lastSeen = 'Just now',
  showProfile,
  onBack,
  onToggleProfile,
  onEndChat,
  pulseAnim,
  timeLeft = 0,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeLeft > 60) {
      return colors.success.main;
    }
    if (timeLeft > 20) {
      return colors.warning.main;
    }
    return colors.error.main;
  };

  const isLastTenSeconds = timeLeft > 0 && timeLeft <= 10;

  return (
    <View style={[styles.header, {paddingTop: insets.top + 8}]}>
      {/* <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.headerInfo}
        onPress={onToggleProfile}
        activeOpacity={0.8}>
        <View style={styles.avatarSmallContainer}>
          {!astrologerImage ? (
            <Image source={{uri: astrologerImage}} style={styles.avatarSmall} />
          ) : (
            <View
              style={[
                styles.avatarSmallPlaceholder,
                {backgroundColor: colors.primary.light},
              ]}>
              <Text
                style={[
                  styles.avatarSmallInitial,
                  {color: colors.primary.main},
                ]}>
                {astrologerName.charAt(0).toUpperCase()}
              </Text>
              {/* <Image source={images.Logo2} style={{height:50, width:50}} /> */}
            </View>
          )}
          {isOnline && (
            <Animated.View
              style={[
                styles.onlineDot,
                {backgroundColor: colors.success.main},
                {transform: [{scale: pulseAnim}]},
              ]}
            />
          )}
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.astrologerName, {color: colors.text.primary}]}>
            {astrologerName}
          </Text>
          <View style={styles.statusContainer}>
            {timeLeft > 0 ? (
              <Animated.Text
                style={[
                  styles.statusText,
                  {
                    color: getTimerColor(),
                    fontWeight: '600',
                  },
                  isLastTenSeconds && {
                    transform: [{scale: pulseAnim}],
                  },
                ]}>
                {`⏳ ${formatTime(timeLeft)}`}
                {isLastTenSeconds ? ' Hurry up!' : ' remaining'}
              </Animated.Text>
            ) : (
              <>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isOnline
                        ? colors.success.main
                        : colors.text.tertiary,
                    },
                  ]}>
                  {isOnline ? 'Online' : lastSeen}
                </Text>
                <View
                  style={[
                    styles.dotSeparator,
                    {backgroundColor: colors.text.tertiary},
                  ]}
                />
                <Icon name="star" size={12} color={colors.common.yellow[500]} />
                <Text
                  style={[styles.ratingText, {color: colors.text.secondary}]}>
                  {astrologerRating}
                </Text>
              </>
            )}
          </View>
        </View>
        <Icon
          name={showProfile ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={colors.text.secondary}
          style={{marginRight: 10}}
        />
      </TouchableOpacity>
      <Button style={{height: 35}} onPress={onEndChat} title="End Chat" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarSmallContainer: {
    position: 'relative',
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarSmallPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallInitial: {
    fontSize: 18,
    fontWeight: '600',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  astrologerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '500',
  },
  endButton: {
    padding: 4,
  },
  endButtonInner: {
    // width: 40,
    // height: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

