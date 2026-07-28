import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';

import { useTheme } from '../../theme';
import { useChatStore } from '../../services/chat/chat.store';
import { useChatActions } from '../../services/chat/chat.hooks';
import { useCall } from '../../services/call';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BUBBLE_MIN_WIDTH = 220;
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH - 24;

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface QueueBubbleProps {
  onCancel?: () => void;
}

export const QueueBubble: React.FC<QueueBubbleProps> = () => {
  const { colors } = useTheme();

  const queueData = useChatStore(state => state.queueData);

  const chatStatus = useChatStore(state => state.chatStatus);

  const queueTimeLeft = useChatStore(state => state.queueTimeLeft);

  const userData = useChatStore(state => state.userData);

  const userPayload = useChatStore(state => state.userPayload);

  const selectedAstrologer = useChatStore(state => state.selectedAstrologer);

  const stopTimer = useChatStore(state => state.stopTimer);

  const { cancelChatRequest } = useChatActions();

  const { cancelCallRequest } = useCall();

  const shouldShow =
    chatStatus === 'queued' && !!queueData && queueTimeLeft > 0;

  const [isExpanded, setIsExpanded] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Animations
  |--------------------------------------------------------------------------
  */

  const entranceAnim = useRef(new Animated.Value(0)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const expandAnim = useRef(new Animated.Value(0)).current;

  /*
  |--------------------------------------------------------------------------
  | DRAG POSITION
  |--------------------------------------------------------------------------
  */

  const pan = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;

  const lastPosition = useRef({
    x: 0,
    y: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | Entrance Animation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (shouldShow) {
      Animated.spring(entranceAnim, {
        toValue: 1,
        useNativeDriver: false,
        friction: 7,
        tension: 80,
      }).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),

          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );

      pulseLoop.start();

      return () => {
        pulseLoop.stop();
      };
    } else {
      Animated.timing(entranceAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [shouldShow]);

  /*
  |--------------------------------------------------------------------------
  | Expand Animation
  |--------------------------------------------------------------------------
  */

  const toggleExpand = useCallback(() => {
    const next = !isExpanded;

    setIsExpanded(next);

    Animated.spring(expandAnim, {
      toValue: next ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 70,
    }).start();
  }, [isExpanded]);

  /*
  |--------------------------------------------------------------------------
  | PAN RESPONDER
  |--------------------------------------------------------------------------
  */

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return (
          !isExpanded && (Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5)
        );
      },

      onPanResponderGrant: () => {
        pan.setOffset({
          x: lastPosition.current.x,
          y: lastPosition.current.y,
        });

        pan.setValue({
          x: 0,
          y: 0,
        });
      },

      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        {
          useNativeDriver: false,
        },
      ),

      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        let newX = lastPosition.current.x + gesture.dx;

        let newY = lastPosition.current.y + gesture.dy;

        /*
        |--------------------------------------------------------------------------
        | SCREEN BOUNDS
        |--------------------------------------------------------------------------
        */

        const currentWidth = isExpanded ? BUBBLE_MAX_WIDTH : BUBBLE_MIN_WIDTH;

        const maxX = SCREEN_WIDTH - currentWidth - 12;

        const minX = -12;

        const maxY = SCREEN_HEIGHT - 220;

        const minY = 0;

        newX = Math.max(minX, Math.min(newX, maxX));

        newY = Math.max(minY, Math.min(newY, maxY));

        lastPosition.current = {
          x: newX,
          y: newY,
        };

        Animated.spring(pan, {
          toValue: {
            x: newX,
            y: newY,
          },
          useNativeDriver: false,
          friction: 7,
          tension: 60,
        }).start();
      },
    }),
  ).current;

  /*
  |--------------------------------------------------------------------------
  | Cancel
  |--------------------------------------------------------------------------
  */

  const handleCancel = useCallback(() => {
    let parsedPayload = userPayload;

    try {
      if (typeof userPayload === 'string') {
        parsedPayload = JSON.parse(userPayload);
      }
    } catch (e) { }

    if (parsedPayload?.consultationType === 'call') {
      cancelCallRequest({
        roomId: parsedPayload?.room_id,
        astroId: parsedPayload?.astro_id,
        userId: parsedPayload?.user_id,
      });
    } else {
      cancelChatRequest();
    }

    stopTimer();
  }, [userPayload, cancelCallRequest, cancelChatRequest, stopTimer]);

  /*
  |--------------------------------------------------------------------------
  | Dynamic Styles
  |--------------------------------------------------------------------------
  */

  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [170, 520],
  });

  const animatedWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BUBBLE_MIN_WIDTH, BUBBLE_MAX_WIDTH],
  });

  const rotateArrow = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const translateEntranceY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });

  /*
  |--------------------------------------------------------------------------
  | Text
  |--------------------------------------------------------------------------
  */

  const title = useMemo(() => {
    if (queueData?.position <= 1) {
      return 'Almost There!';
    }

    return 'Waiting in Queue';
  }, [queueData]);

  const message = useMemo(() => {
    if (queueData?.position <= 1) {
      return "You're next in line";
    }

    return queueData?.message || 'Connecting you...';
  }, [queueData]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Animated.View
      {...(!isExpanded ? panResponder.panHandlers : {})}
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary?.main || '#6B46C1',

          width: animatedWidth,
          height: animatedHeight,

          opacity: entranceAnim,

          transform: [
            {
              translateY: translateEntranceY,
            },

            {
              translateX: pan.x,
            },

            {
              translateY: pan.y,
            },

            {
              scale: pulseAnim,
            },
          ],
        },
      ]}>

      {/* close btn new */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCancel}
        style={styles.closeButton}>
        <Ionicons
          name="close"
          size={20}
          color={colors.primary?.contrastText || '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Drag Indicator */}
      <View style={styles.dragWrapper}>
        <View
          style={[
            styles.dragIndicator,
            {
              backgroundColor: colors.primary?.contrastText || '#FFFFFF',
            },
          ]}
        />
      </View>

      {/* Header */}
      <TouchableOpacity
        activeOpacity={0.9}
        // onPress={toggleExpand}
        style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              {
                color: colors.primary?.contrastText || '#FFFFFF',
              },
            ]}>
            {title}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.primary?.contrastText || '#FFFFFF',
              },
            ]}>
            {message}
          </Text>
        </View>


        {/* <Animated.View
          style={[
            styles.expandButton,
            {
              transform: [
                {
                  rotate: rotateArrow,
                },
              ],
            },
          ]}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.primary?.contrastText || '#FFFFFF'}
          />
        </Animated.View> */}
      </TouchableOpacity>

      {/* Compact */}
      {/* <View style={styles.compactRow}
      > */}
      <View
        style={[
          styles.compactRow,
          {
            justifyContent:
              queueData?.position > 0 ? 'space-between' : 'center',
          },
        ]}>
        {queueData?.position > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{queueData?.position ?? '-'}</Text>
          </View>
        )}

        <View style={[styles.timerBadge]}>
          <Text style={styles.timerText}>{formatTime(queueTimeLeft)}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleExpand}
        style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>
          {isExpanded ? 'See Less' : 'See More'}
        </Text>

        <Animated.View
          style={{
            marginLeft: 6,
            transform: [
              {
                rotate: rotateArrow,
              },
            ],
          }}>
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.primary?.contrastText || '#FFFFFF'}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Expanded */}
      {isExpanded && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Info Card */}
          <View style={styles.card}>
            <InfoRow
              label="Queue Position"
              value={`#${queueData?.position ?? '-'}`}
            />

            <InfoRow label="Estimated Time" value={formatTime(queueTimeLeft)} />

            <InfoRow
              label="Astrologer"
              value={selectedAstrologer?.name || '-'}
            />
          </View>

          {/* User Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Details</Text>

            <InfoRow label="Name" value={userData?.name || '-'} />

            <InfoRow
              label="Gender"
              value={
                userData?.gender
                  ? userData.gender.charAt(0).toUpperCase() +
                  userData.gender.slice(1)
                  : '-'
              }
            />

            <InfoRow label="DOB" value={userData?.dateOfBirth || '-'} />

            <InfoRow label="Birth Time" value={userData?.birthTime || '-'} />

            <InfoRow label="Place" value={userData?.placeOfBirth || '-'} />
          </View>

          {/* More Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>More Details</Text>

            <Text style={styles.moreText}>
              Please stay connected while we prepare your consultation. Do not
              close the app during queue process.
            </Text>

            <Text style={styles.moreText}>
              You will automatically connect once your turn arrives.
            </Text>
          </View>

          {/* Cancel */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cancelButton}
            onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel Request</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Animated.View>
  );
};

/*
|--------------------------------------------------------------------------
| Reusable Row
|--------------------------------------------------------------------------
*/

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    top: Platform.OS === 'ios' ? 60 : 30,

    alignSelf: 'center',

    borderRadius: 24,

    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,

    zIndex: 9999,

    elevation: 20,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,

    shadowRadius: 20,

    overflow: 'hidden',
  },

  dragWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },

  dragIndicator: {
    width: 42,
    height: 5,
    borderRadius: 10,
    opacity: 0.5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.9,
  },

  arrow: {
    fontSize: 24,
    marginLeft: 10,
    fontWeight: '700',
  },

  compactRow: {
    marginTop: 1,
    marginBottom: 10,
    flexDirection: 'row',

    // justifyContent:
    //   'space-between',

    alignItems: 'center',
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 18,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },

  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 18,
  },

  timerText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  scrollContent: {
    paddingTop: 18,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',

    borderRadius: 18,

    padding: 14,

    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingVertical: 10,
  },

  infoLabel: {
    color: 'rgba(255,255,255,0.75)',

    fontSize: 13,

    flex: 1,
  },

  infoValue: {
    color: '#FFF',

    fontSize: 14,

    fontWeight: '600',

    flex: 1,

    textAlign: 'right',

    marginLeft: 10,
  },

  moreText: {
    color: '#FFF',

    opacity: 0.85,

    fontSize: 13,

    lineHeight: 20,

    marginBottom: 10,
  },

  cancelButton: {
    marginTop: 10,

    backgroundColor: 'rgba(255,255,255,0.15)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.2)',

    borderRadius: 18,

    paddingVertical: 14,

    alignItems: 'center',
  },

  cancelText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  expandButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.16)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',

    marginLeft: 12,
  },

  closeButton: {
    position: 'absolute',

    top: 1,
    right: 1,

    width: 36,
    height: 36,

    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.16)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',

    zIndex: 100,

  },
  seeMoreButton: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  seeMoreText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QueueBubble;
