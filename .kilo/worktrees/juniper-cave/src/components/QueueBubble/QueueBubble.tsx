import React, {useEffect, useRef, useMemo, useCallback, useState} from 'react';
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
} from 'react-native';
import {useTheme} from '../../theme';
import {useChatStore} from '../../services/chat/chat.store';
import {useChatActions} from '../../services/chat/chat.hooks';
import {useCall} from '../../services/call';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface QueueBubbleProps {
  onCancel?: () => void;
}

export const QueueBubble: React.FC<QueueBubbleProps> = () => {
  const {colors} = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityRef = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const queueData = useChatStore(state => state.queueData);
  const chatStatus = useChatStore(state => state.chatStatus);
  const queueTimeLeft = useChatStore(state => state.queueTimeLeft);
  const userData = useChatStore(state => state.userData);
  const userPayload = useChatStore(state => state.userPayload);
  const selectedAstrologer = useChatStore(state => state.selectedAstrologer);

  const [isExpanded, setIsExpanded] = useState(false);
  const [pan] = useState(new Animated.ValueXY({x: 0, y: 0}));
  const [isDragging, setIsDragging] = useState(false);

  const stopTimer = useChatStore(state => state.stopTimer);
  const {cancelChatRequest} = useChatActions();
  const {cancelCallRequest} = useCall();

  const handleCancel = useCallback(() => {
    let parsedPayload = userPayload;

    try {
      if (typeof userPayload === 'string') {
        parsedPayload = JSON.parse(userPayload);
      }
    } catch (error) {
      console.log('[QueueBubble] Failed to parse userPayload', error);
    }

    // console.log('consultationType', parsedPayload?.consultationType);

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

  const screenWidth = Dimensions.get('window').width;
  const bubbleWidth = isExpanded ? screenWidth - 32 : 200;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isExpanded,
    onMoveShouldSetPanResponder: () => !isExpanded,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: (pan.x as any).__getValue(),
        y: (pan.y as any).__getValue(),
      });
    },
    onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  const shouldShow =
    chatStatus === 'queued' && !!queueData && queueTimeLeft > 0;

  useEffect(() => {
    if (queueData) {
      console.log('queue whole data in bubblequeu', queueData);
    }
  }, [queueData]);

  useEffect(() => {
    console.log('user data in the queue bubble', userData);
    console.log('user payload in the queue bubble', userPayload);
  }, [userData, userPayload]);

  useEffect(() => {
    if (shouldShow) {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShow, animatedValue, pulseAnim, opacityRef]);

  const handleToggleExpand = useCallback(() => {
    if (isDragging) {
      return;
    }

    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.timing(scaleAnim, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isExpanded, isDragging, scaleAnim]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  // const getQueueMessage = useMemo((): string => {
  const getQueueMessage = useMemo(() => {
    if (queueData?.position === 0 || queueData?.position === 1) {
      return "You're next in line!";
    }
    return queueData?.message || 'Connecting you with astrologer...';
  }, [queueData?.position, queueData?.message]);

  // const getTitle = useMemo((): string => {
  const getTitle = useMemo(() => {
    if (queueData?.position === 0 || queueData?.position === 1) {
      return 'Almost there!';
    }
    return 'Connecting you with astrologer...';
  }, [queueData?.position]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {translateY},
            {translateX: pan.x},
            {translateY: pan.y},
            {scale: isExpanded ? scaleAnim : pulseAnim},
          ],
          opacity: opacityRef,
          backgroundColor: colors.secondary?.main || '#6B46C1',
          width: bubbleWidth,
        },
      ]}
      {...(!isExpanded ? panResponder.panHandlers : {})}>
      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleExpand}
          onPressIn={() => setIsDragging(false)}
          onPressOut={() => setIsDragging(false)}
          style={styles.headerTouchable}>
          <View style={styles.header}>
            <View style={styles.dragHandle}>
              <View
                style={[
                  styles.dragIndicator,
                  {backgroundColor: colors.primary?.contrastText || '#FFFFFF'},
                ]}
              />
            </View>
            <Text
              style={[
                styles.title,
                {color: colors.primary?.contrastText || '#FFFFFF'},
              ]}
              numberOfLines={isExpanded ? 0 : 1}>
              {getTitle}
            </Text>
          </View>

          {!isExpanded && (
            <View style={styles.compactInfo}>
              <Text
                style={[
                  styles.compactPosition,
                  {color: colors.primary?.contrastText || '#FFFFFF'},
                ]}>
                # {queueData?.position ?? '-'}
              </Text>
              <Text
                style={[
                  styles.compactTimer,
                  {color: colors.primary?.contrastText || '#FFFFFF'},
                ]}>
                {formatTime(queueTimeLeft)}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView
            style={styles.expandedContent}
            showsVerticalScrollIndicator={false}>
            <Text
              style={[
                styles.message,
                {color: colors.primary?.contrastText || '#FFFFFF'},
              ]}>
              {getQueueMessage}
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.label,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  Position
                </Text>
                <Text
                  style={[
                    styles.value,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  # {queueData?.position ?? '-'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.label,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  Starting in
                </Text>
                <Text
                  style={[
                    styles.timerValue,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  {formatTime(queueTimeLeft)}
                </Text>
              </View>
            </View>

            {selectedAstrologer && (
              <View style={styles.astrologerContainer}>
                <Text
                  style={[
                    styles.sectionLabel,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  Astrologer
                </Text>
                <Text
                  style={[
                    styles.astrologer,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}
                  numberOfLines={1}>
                  {selectedAstrologer.name}
                </Text>
              </View>
            )}

            {userData && (
              <View style={styles.userDataContainer}>
                <Text
                  style={[
                    styles.sectionLabel,
                    {color: colors.primary?.contrastText || '#FFFFFF'},
                  ]}>
                  Your Details
                </Text>

                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    Name
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    {userData.name}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    Gender
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    {/* {userData.gender?.charAt(0).toUpperCase() +
                      userData.gender?.slice(1)} */}
                    {userData?.gender
                      ? userData.gender.charAt(0).toUpperCase() +
                        userData.gender.slice(1)
                      : '-'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    Date of Birth
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    {userData.dateOfBirth}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}>
                    Place of Birth
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.primary?.contrastText || '#FFFFFF'},
                    ]}
                    numberOfLines={1}>
                    {userData.placeOfBirth}
                  </Text>
                </View>

                {userData.birthTime && (
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.detailLabel,
                        {color: colors.primary?.contrastText || '#FFFFFF'},
                      ]}>
                      Birth Time
                    </Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {color: colors.primary?.contrastText || '#FFFFFF'},
                      ]}>
                      {userData.birthTime}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.cancelText,
                  {color: colors.primary?.contrastText || '#FFFFFF'},
                ]}>
                Cancel Request
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
    maxWidth: '90%',
  },
  content: {
    padding: 16,
  },
  headerTouchable: {
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  compactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  compactPosition: {
    fontSize: 24,
    fontWeight: '700',
  },
  compactTimer: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expandedContent: {
    maxHeight: 450,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  astrologerContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  astrologer: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  userDataContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QueueBubble;
