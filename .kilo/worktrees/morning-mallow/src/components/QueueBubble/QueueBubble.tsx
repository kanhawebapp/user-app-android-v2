import React, {useEffect, useRef, useMemo, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  PanResponder,
} from 'react-native';
import {useTheme} from '../../theme';
import {useChatStore} from '../../services/chat/chat.store';
import {useChatActions} from '../../services/chat/chat.hooks';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface DetailRowProps {
  label: string;
  value: string | number;
}

const DetailRow: React.FC<DetailRowProps> = ({label, value}) => {
  const {colors} = useTheme();
  return (
    <View style={detailStyles.row}>
      <Text style={[detailStyles.label, {color: colors.text.secondary}]}>
        {label}
      </Text>
      <Text style={[detailStyles.value, {color: colors.text.primary}]}>
        {value}
      </Text>
    </View>
  );
};

interface QueueDetailsProps {
  visible: boolean;
  onClose: () => void;
  queueData: any;
  userData: any;
  roomId: string | null;
  chatDuration: number;
}

const QueueDetailsModal: React.FC<QueueDetailsProps> = ({
  visible,
  onClose,
  queueData,
  userData,
  roomId,
  chatDuration,
}) => {
  const {colors} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={detailStyles.overlay} onPress={onClose}>
        <Pressable
          style={[
            detailStyles.modal,
            {backgroundColor: colors.background.primary},
          ]}
          onPress={e => e.stopPropagation()}>
          <Text style={[detailStyles.title, {color: colors.text.primary}]}>
            Chat Request Details
          </Text>

          <ScrollView
            style={detailStyles.scrollView}
            showsVerticalScrollIndicator={false}>
            <View style={detailStyles.section}>
              <Text
                style={[
                  detailStyles.sectionTitle,
                  {color: colors.primary.main},
                ]}>
                User Information
              </Text>
              <DetailRow label="Name" value={userData?.name || '-'} />
              <DetailRow label="Gender" value={userData?.gender || '-'} />
              <DetailRow
                label="Date of Birth"
                value={userData?.dateOfBirth || '-'}
              />
              <DetailRow
                label="Birth Time"
                value={userData?.birthTime || '-'}
              />
              <DetailRow
                label="Place of Birth"
                value={userData?.placeOfBirth || '-'}
              />
              {userData?.occupation && (
                <DetailRow label="Occupation" value={userData.occupation} />
              )}
            </View>

            <View style={detailStyles.section}>
              <Text
                style={[
                  detailStyles.sectionTitle,
                  {color: colors.primary.main},
                ]}>
                Queue Information
              </Text>
              <DetailRow
                label="Position"
                value={`#${queueData?.position ?? '-'}`}
              />
              <DetailRow
                label="Estimated Wait"
                value={formatTime(
                  queueData?.waitTime || queueData?.estimatedWaitTime || 0,
                )}
              />
              <DetailRow label="Starting In" value={formatTime(chatDuration)} />
              {queueData?.astrologerName && (
                <DetailRow
                  label="Astrologer"
                  value={queueData.astrologerName}
                />
              )}
            </View>

            <View style={detailStyles.section}>
              <Text
                style={[
                  detailStyles.sectionTitle,
                  {color: colors.primary.main},
                ]}>
                Room Information
              </Text>
              <DetailRow label="Room ID" value={roomId || '-'} />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              detailStyles.closeButton,
              {backgroundColor: colors.primary.main},
            ]}
            onPress={onClose}>
            <Text
              style={[
                detailStyles.closeButtonText,
                {color: colors.primary.contrastText},
              ]}>
              Close
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

interface QueueBubbleProps {
  onCancel?: () => void;
}

export const QueueBubble: React.FC<QueueBubbleProps> = ({
  onCancel: _onCancel,
}) => {
  const {colors} = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityRef = useRef(new Animated.Value(0)).current;
  const panAnim = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  const queueData = useChatStore(state => state.queueData);
  const chatStatus = useChatStore(state => state.chatStatus);
  const queueTimeLeft = useChatStore(state => state.queueTimeLeft);
  const userData = useChatStore(state => state.userData);
  const roomId = useChatStore(state => state.roomId);
  const chatDuration = useChatStore(state => state.chatDuration);

  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const shouldShow =
    chatStatus === 'queued' && !!queueData && queueTimeLeft > 0;

  const stopTimer = useChatStore(state => state.stopTimer);
  const {cancelChatRequest} = useChatActions();
  const handleCancel = useCallback(() => {
    cancelChatRequest();
    stopTimer();
  }, [cancelChatRequest, stopTimer]);

  const handleBubblePress = useCallback(() => {
    if (!isDragging) {
      setShowModal(true);
    }
  }, [isDragging]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        panAnim.setOffset({
          x: (panAnim.x as any)._value,
          y: (panAnim.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, {dx: panAnim.x, dy: panAnim.y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        panAnim.flattenOffset();
        setIsDragging(false);
      },
    }),
  ).current;

  const combinedTranslateY = Animated.add(
    animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0],
      extrapolate: 'clamp',
    }),
    panAnim.y,
  );

  useEffect(() => {
    if (shouldShow) {
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityRef, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

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

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {translateY: combinedTranslateY},
              {scale: pulseAnim},
              {translateX: panAnim.x},
            ],
            opacity: opacityRef,
            backgroundColor: colors.secondary?.main || '#6B46C1',
          },
        ]}
        {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={handleBubblePress}
          activeOpacity={0.8}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  {color: colors.primary?.contrastText || '#FFFFFF'},
                ]}>
                {getTitle}
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

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.cancelText,
                  {color: colors.primary?.contrastText || '#FFFFFF'},
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <QueueDetailsModal
        visible={showModal}
        onClose={handleModalClose}
        queueData={queueData}
        userData={userData}
        roomId={roomId}
        chatDuration={chatDuration}
      />
    </>
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
  touchable: {
    width: '100%',
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
