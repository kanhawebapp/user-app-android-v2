// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Animated,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../../components/Icon';
// import {Button} from '../../../../components';
// import images from '../../../../assets/images';

// interface ChatHeaderProps {
//   astrologerName: string;
//   astrologerImage?: string;
//   astrologerRating?: number;
//   isOnline?: boolean;
//   lastSeen?: string;
//   showProfile: boolean;
//   onBack: () => void;
//   onToggleProfile: () => void;
//   onEndChat: () => void;
//   pulseAnim: Animated.Value;
//   timeLeft?: number;
// }

// export const ChatHeader: React.FC<ChatHeaderProps> = ({
//   astrologerName,
//   astrologerImage,
//   astrologerRating = 4.8,
//   isOnline = true,
//   lastSeen = 'Just now',
//   showProfile,
//   onBack,
//   onToggleProfile,
//   onEndChat,
//   pulseAnim,
//   timeLeft = 0,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const insets = useSafeAreaInsets();

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs
//       .toString()
//       .padStart(2, '0')}`;
//   };

//   const getTimerColor = (): string => {
//     if (timeLeft > 60) {
//       return colors.success.main;
//     }
//     if (timeLeft > 20) {
//       return colors.warning.main;
//     }
//     return colors.error.main;
//   };

//   const isLastTenSeconds = timeLeft > 0 && timeLeft <= 10;

//   return (
//     <View style={[styles.header, {paddingTop: insets.top + 8}]}>
//       {/* <TouchableOpacity onPress={onBack} style={styles.backButton}>
//         <Icon name="arrow-back" size={24} color={colors.text.primary} />
//       </TouchableOpacity> */}

//       <TouchableOpacity
//         style={styles.headerInfo}
//         onPress={onToggleProfile}
//         activeOpacity={0.8}>
//         <View style={styles.avatarSmallContainer}>
//           {!astrologerImage ? (
//             <Image source={{uri: astrologerImage}} style={styles.avatarSmall} />
//           ) : (
//             <View
//               style={[
//                 styles.avatarSmallPlaceholder,
//                 {backgroundColor: colors.primary.light},
//               ]}>
//               <Text
//                 style={[
//                   styles.avatarSmallInitial,
//                   {color: colors.primary.main},
//                 ]}>
//                 {astrologerName.charAt(0).toUpperCase()}
//               </Text>
//               {/* <Image source={images.Logo2} style={{height:50, width:50}} /> */}
//             </View>
//           )}
//           {isOnline && (
//             <Animated.View
//               style={[
//                 styles.onlineDot,
//                 {backgroundColor: colors.success.main},
//                 {transform: [{scale: pulseAnim}]},
//               ]}
//             />
//           )}
//         </View>
//         <View style={styles.headerTextContainer}>
//           <Text style={[styles.astrologerName, {color: colors.text.primary}]}>
//             {astrologerName}
//           </Text>
//           <View style={styles.statusContainer}>
//             {timeLeft > 0 ? (
//               <Animated.Text
//                 style={[
//                   styles.statusText,
//                   {
//                     color: getTimerColor(),
//                     fontWeight: '600',
//                   },
//                   isLastTenSeconds && {
//                     transform: [{scale: pulseAnim}],
//                   },
//                 ]}>
//                 {`⏳ ${formatTime(timeLeft)}`}
//                 {isLastTenSeconds ? ' Hurry up!' : ' remaining'}
//               </Animated.Text>
//             ) : (
//               <>
//                 <Text
//                   style={[
//                     styles.statusText,
//                     {
//                       color: isOnline
//                         ? colors.success.main
//                         : colors.text.tertiary,
//                     },
//                   ]}>
//                   {isOnline ? 'Online' : lastSeen}
//                 </Text>
//                 <View
//                   style={[
//                     styles.dotSeparator,
//                     {backgroundColor: colors.text.tertiary},
//                   ]}
//                 />
//                 <Icon name="star" size={12} color={colors.common.yellow[500]} />
//                 <Text
//                   style={[styles.ratingText, {color: colors.text.secondary}]}>
//                   {astrologerRating}
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//       <Button style={{height: 35}} onPress={onEndChat} title="End Chat" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   avatarSmallContainer: {
//     position: 'relative',
//   },
//   avatarSmall: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//   },
//   avatarSmallPlaceholder: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarSmallInitial: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   onlineDot: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   astrologerName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 2,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   dotSeparator: {
//     width: 3,
//     height: 3,
//     borderRadius: 1.5,
//     marginHorizontal: 6,
//   },
//   ratingText: {
//     fontSize: 12,
//     marginLeft: 2,
//     fontWeight: '500',
//   },
//   endButton: {
//     padding: 4,
//   },
//   endButtonInner: {
//     // width: 40,
//     // height: 40,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';

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
  astrologerRating = 4.9,
  isOnline = true,
  lastSeen = 'Active now',
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

  const getTimerGradient = (): string[] => {
    if (timeLeft > 60) {
      return ['#1DB954', '#17A74A'];
    }

    if (timeLeft > 20) {
      return ['#FFB020', '#FF8F00'];
    }

    return ['#FF4D67', '#FF1744'];
  };

  const isLastTenSeconds = timeLeft > 0 && timeLeft <= 10;

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background.primary,
        },
      ]}>
      <LinearGradient
        colors={['rgba(18,18,18,0.96)', 'rgba(25,25,25,0.98)']}
        style={styles.gradient}>
        {Platform.OS === 'ios' && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={18}
            reducedTransparencyFallbackColor="#111"
          />
        )}

        <View style={styles.container}>
          {/* LEFT SECTION */}
          <View style={styles.leftSection}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onToggleProfile}
              style={styles.profileSection}>
              {/* AVATAR */}
              <View style={styles.avatarWrapper}>
                {astrologerImage ? (
                  <Image
                    source={{uri: astrologerImage}}
                    style={styles.avatar}
                  />
                ) : (
                  <LinearGradient
                    colors={['#8E2DE2', '#4A00E0']}
                    style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>
                      {astrologerName?.charAt(0)?.toUpperCase()}
                    </Text>
                  </LinearGradient>
                )}

                {isOnline && (
                  <Animated.View
                    style={[
                      styles.onlineDot,
                      {
                        transform: [{scale: pulseAnim}],
                      },
                    ]}
                  />
                )}
              </View>

              {/* NAME + STATUS */}
              <View style={styles.textContainer}>
                <View style={styles.nameRow}>
                  <Text numberOfLines={1} style={styles.astrologerName}>
                    {astrologerName}
                  </Text>

                  <LinearGradient
                    colors={['#FFD700', '#FFB800']}
                    style={styles.verifiedBadge}>
                    <Icon name="star" size={10} color="#111" />
                  </LinearGradient>
                </View>

                {timeLeft > 0 ? (
                  <Animated.View
                    style={[
                      styles.timerContainer,
                      isLastTenSeconds && {
                        transform: [{scale: pulseAnim}],
                      },
                    ]}>
                    <LinearGradient
                      colors={getTimerGradient()}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.timerPill}>
                      <Icon name="time-outline" size={12} color="#FFF" />

                      <Text style={styles.timerText}>
                        {formatTime(timeLeft)}
                      </Text>

                      {isLastTenSeconds && (
                        <Text style={styles.hurryText}>Hurry!</Text>
                      )}
                    </LinearGradient>
                  </Animated.View>
                ) : (
                  <View style={styles.statusRow}>
                    <View style={styles.onlineIndicator} />

                    <Text style={styles.ratingText}>{astrologerRating}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* END BUTTON */}
          <TouchableOpacity activeOpacity={0.85} onPress={onEndChat}>
            <LinearGradient
              colors={['#FF4D67', '#FF1744']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.endButton}>
              <Icon name="call" size={15} color="#FFF" />

              <Text style={styles.endButtonText}>End</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    overflow: 'hidden',
  },

  gradient: {
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 12,
  },

  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,

    backgroundColor: 'rgba(255,255,255,0.08)',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
  },

  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,

    width: 14,
    height: 14,
    borderRadius: 20,

    backgroundColor: '#1DB954',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  astrologerName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    maxWidth: '80%',
  },

  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 6,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  onlineIndicator: {
    width: 7,
    height: 7,
    borderRadius: 10,

    backgroundColor: '#1DB954',
    marginRight: 6,
  },

  statusText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 10,

    backgroundColor: 'rgba(255,255,255,0.3)',

    marginHorizontal: 8,
  },

  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },

  timerContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 50,
  },

  timerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',

    marginLeft: 5,
  },

  hurryText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',

    marginLeft: 6,
  },

  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 16,

    shadowColor: '#FF1744',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },

  endButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5,
  },
});
