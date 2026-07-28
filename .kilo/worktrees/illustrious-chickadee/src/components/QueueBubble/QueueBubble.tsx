import React, {useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../theme';
import {useChatStore} from '../../services/chat/chat.store';
import {socketService} from '../../services/socket/socket.service';
import {useChatActions} from '../../services/chat/chat.hooks';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface QueueBubbleProps {
  onCancel?: () => void;
}

export const QueueBubble: React.FC<QueueBubbleProps> = ({onCancel}) => {
  const {colors} = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityRef = useRef(new Animated.Value(0)).current;

  const queueData = useChatStore(state => state.queueData);
  const chatStatus = useChatStore(state => state.chatStatus);
  const queueTimeLeft = useChatStore(state => state.queueTimeLeft);

  //new for chancel chat aut after 60 second
  // const hasCancelledRef = useRef(false);

  // useEffect(() => {
  //   if (
  //     chatStatus === 'queued' &&
  //     queueTimeLeft === 0 &&
  //     !hasCancelledRef.current
  //   ) {
  //     hasCancelledRef.current = true;

  //     console.log('⏱️ Queue timeout → cancelling');

  //     const roomId = useChatStore.getState().roomId;

  //     if (roomId) {
  //       socketService.emit('cancel_chat_request', {roomId});
  //     }

  //     useChatStore.getState().setChatStatus('cancelled');
  //   }
  // }, [queueTimeLeft, chatStatus]);

  // useEffect(() => {
  //   if (chatStatus === 'queued') {
  //     hasCancelledRef.current = false;
  //   }
  // }, [chatStatus]);
  // const hasCancelledRef = useRef(false);
  // useEffect(() => {
  //   if (
  //     chatStatus === 'queued' &&
  //     queueTimeLeft === 0 &&
  //     !hasCancelledRef.current
  //   ) {
  //     hasCancelledRef.current = true;

  //     console.log('⏱️ Queue timeout → cancelling');

  //     const {roomId} = useChatStore.getState();

  //     if (roomId) {
  //       socketService.emit('cancel_chat_request', {roomId});
  //     }

  //     useChatStore.getState().setChatStatus('cancelled');
  //   }
  // }, [queueTimeLeft, chatStatus]);

  // useEffect(() => {
  //   if (chatStatus === 'queued' && queueTimeLeft > 0) {
  //     hasCancelledRef.current = false;
  //   }
  // }, [chatStatus, queueTimeLeft]);

  const shouldShow =
    chatStatus === 'queued' && !!queueData && queueTimeLeft > 0;

  console.log('queueData', queueData?.roomId);
  console.log('chatStatus', chatStatus);
  console.log('queueTimeLeft', queueTimeLeft);
  const stopTimer = useChatStore(state => state.stopTimer);

  const {cancelChatRequest} = useChatActions();
  const handleCancel = useCallback(() => {
    cancelChatRequest();
    stopTimer();
  }, [cancelChatRequest]);

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

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const getQueueMessage = useMemo((): string => {
    if (queueData?.position === 0 || queueData?.position === 1) {
      return "You're next in line!";
    }
    return queueData?.message || 'Connecting you with astrologer...';
  }, [queueData?.position, queueData?.message]);

  const getTitle = useMemo((): string => {
    if (queueData?.position === 0 || queueData?.position === 1) {
      return 'Almost there!';
    }
    return 'Connecting you with astrologer...';
  }, [queueData?.position]);

  const getEmoji = useMemo((): string => {
    if (queueData?.position === 0 || queueData?.position === 1) {
      return '';
    }
    return '';
  }, [queueData?.position]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}, {scale: pulseAnim}],
          opacity: opacityRef,
          backgroundColor: colors.secondary?.main || '#6B46C1',
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {color: colors.primary?.contrastText || '#FFFFFF'},
            ]}>
            {getEmoji} {getTitle}
          </Text>
        </View>

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
              #{queueData?.position ?? '-'}
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

        {queueData?.astrologerName ? (
          <View style={styles.astrologerContainer}>
            <Text
              style={[
                styles.astrologer,
                {color: colors.primary?.contrastText || '#FFFFFF'},
              ]}
              numberOfLines={1}>
              {queueData.astrologerName}
            </Text>
          </View>
        ) : null}

        {/* {onCancel && ( */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          // onPress={onCancel}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.cancelText,
              {color: colors.primary?.contrastText || '#FFFFFF'},
            ]}>
            Cancel
          </Text>
        </TouchableOpacity>
        {/* )} */}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  astrologer: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.9,
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
