import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RenderModeType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import {useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Button} from '../../components/Button';
import {getLiveJoinChatError} from '../../services/api/liveSessions/live-sessions.api';
import type {
  LiveJoinResponse,
  UpcomingLive,
} from '../../services/api/liveSessions/live-sessions.types';
import {useLiveAudienceRtc} from '../../modules/live/hooks/useLiveAudienceRtc';
import {
  LiveChatMessage,
  useLiveRoomChat,
} from '../../modules/live/hooks/useLiveRoomChat';

interface LiveStreamScreenProps {
  joinData: LiveJoinResponse;
  session: UpcomingLive;
  onBack: () => void;
}

const OVERLAY_BACKGROUND = 'rgba(0, 0, 0, 0.45)';
const VIDEO_BACKGROUND = '#000';

const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({
  joinData,
  session,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');

  const rtc = useLiveAudienceRtc({
    appId: joinData.appId,
    channelName: joinData.channelName,
    rtcToken: joinData.rtcToken,
    uid: joinData.uid,
  });

  const chatCredentialError = useMemo(
    () => getLiveJoinChatError(joinData),
    [joinData],
  );

  const chat = useLiveRoomChat({
    enabled: chatCredentialError === null,
    chatAppKey: joinData.chatAppKey,
    chatUserId: joinData.chatUserId,
    chatToken: joinData.chatToken,
    chatRoomId: joinData.chatRoomId,
  });

  const reversedMessages = useMemo(
    () => [...chat.messages].reverse(),
    [chat.messages],
  );

  const astrologerName =
    session.astrologer?.displayName?.trim() ||
    session.astrologer?.name?.trim() ||
    '';

  const isChatReady = chat.status === 'connected';
  const chatNotice = chatCredentialError ?? chat.error;

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setDraft('');
    const sent = await chat.sendMessage(text);
    if (!sent) {
      setDraft(text);
    }
  }, [chat, draft]);

  const getRtcStatusText = (): string | null => {
    switch (rtc.status) {
      case 'joining':
        return 'Joining live...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'failed':
        return rtc.error;
      case 'connected':
        if (rtc.hostUid === null) {
          return 'Waiting for the astrologer to start the stream...';
        }
        return rtc.isHostVideoOn ? null : 'Astrologer video is paused';
      default:
        return null;
    }
  };

  const rtcStatusText = getRtcStatusText();
  const showVideo =
    rtc.status !== 'failed' && rtc.hostUid !== null && rtc.isHostVideoOn;

  const renderMessage = ({item}: {item: LiveChatMessage}) => (
    <View style={styles.messageRow}>
      <Text
        variant="captionSmall"
        weight="bold"
        style={{color: item.isOwn ? colors.primary.light : colors.common.white}}
        numberOfLines={1}>
        {item.isOwn ? 'You' : item.senderName || item.senderId}
      </Text>
      <Text variant="caption" style={{color: colors.common.white}}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={VIDEO_BACKGROUND} />

      <View style={StyleSheet.absoluteFill}>
        {showVideo && rtc.hostUid !== null ? (
          <RtcSurfaceView
            style={StyleSheet.absoluteFill}
            canvas={{
              uid: rtc.hostUid,
              sourceType: VideoSourceType.VideoSourceRemote,
              renderMode: RenderModeType.RenderModeHidden,
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Icon
              name="live-tv"
              size={64}
              color={colors.common.white}
              library="MaterialIcons"
            />
          </View>
        )}
      </View>

      <View style={[styles.topBar, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.iconButton}
          accessibilityLabel="Leave live session">
          <Icon
            name="arrow-back"
            size={24}
            color={colors.common.white}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <View style={styles.topBarText}>
          <Text
            variant="subtitle"
            weight="semibold"
            style={{color: colors.common.white}}
            numberOfLines={1}>
            {session.title}
          </Text>
          {!!astrologerName && (
            <Text
              variant="caption"
              style={{color: colors.common.white}}
              numberOfLines={1}>
              {astrologerName}
            </Text>
          )}
        </View>
        <View style={[styles.liveBadge, {backgroundColor: colors.error.main}]}>
          <View style={styles.liveDot} />
          <Text
            variant="captionSmall"
            weight="bold"
            style={{color: colors.common.white}}>
            LIVE
          </Text>
        </View>
      </View>

      {!!rtcStatusText && (
        <View style={styles.statusOverlay} pointerEvents="box-none">
          <View style={styles.statusCard}>
            {(rtc.status === 'joining' || rtc.status === 'reconnecting') && (
              <ActivityIndicator color={colors.common.white} />
            )}
            <Text
              variant="body"
              style={[styles.statusText, {color: colors.common.white}]}>
              {rtcStatusText}
            </Text>
            {rtc.status === 'failed' && (
              <View style={styles.statusActions}>
                <Button
                  title="Retry"
                  variant="primary"
                  size="small"
                  onPress={rtc.retry}
                />
                <Button
                  title="Leave"
                  variant="outline"
                  size="small"
                  style={styles.leaveButton}
                  onPress={onBack}
                />
              </View>
            )}
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}>
        <FlatList
          data={reversedMessages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          inverted
          style={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {!!chatNotice && (
          <View style={styles.chatNotice}>
            <Text
              variant="captionSmall"
              style={[styles.chatNoticeText, {color: colors.common.white}]}>
              {chatNotice}
            </Text>
            {!chatCredentialError && chat.status === 'failed' && (
              <TouchableOpacity onPress={chat.retry}>
                <Text
                  variant="captionSmall"
                  weight="bold"
                  style={{color: colors.primary.light}}>
                  Retry
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={[styles.inputRow, {paddingBottom: insets.bottom + 8}]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={
              isChatReady
                ? 'Say something...'
                : chat.status === 'connecting'
                ? 'Connecting to chat...'
                : 'Chat unavailable'
            }
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            editable={isChatReady}
            style={[styles.input, {color: colors.common.white}]}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!isChatReady || !draft.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: colors.primary.main,
                opacity: isChatReady && draft.trim() ? 1 : 0.5,
              },
            ]}
            accessibilityLabel="Send message">
            <Icon
              name="send"
              size={18}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VIDEO_BACKGROUND,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  iconButton: {
    padding: 4,
  },
  topBarText: {
    flex: 1,
    marginHorizontal: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  statusCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  statusText: {
    marginTop: 8,
    textAlign: 'center',
  },
  statusActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  leaveButton: {
    marginLeft: 8,
  },
  chatContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageList: {
    maxHeight: 260,
    paddingHorizontal: 12,
  },
  messageRow: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 3,
    borderRadius: 10,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  chatNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  chatNoticeText: {
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveStreamScreen;
