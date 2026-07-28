import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../../../../theme';
import {useChatStore} from '../../../../services/chat/chat.store';
import {
  useChatSocket,
  useChatActions,
} from '../../../../services/chat/chat.hooks';
import {useSocket} from '../../../../services/socket/socket.context';

interface QueueScreenProps {
  astrologerName: string;
  onBack: () => void;
  onChatStart: () => void;
  onRejected: (reason?: string) => void;
}

export const QueueScreen: React.FC<QueueScreenProps> = ({
  astrologerName,
  onBack,
  onChatStart,
  onRejected,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const {socket} = useSocket();
  const {queueData, chatStatus, error} = useChatStore();
  const {cancelChatRequest} = useChatActions();

  useChatSocket(socket);

  useEffect(() => {
    if (chatStatus === 'active') {
      onChatStart();
    }
  }, [chatStatus, onChatStart]);

  useEffect(() => {
    if (chatStatus === 'rejected') {
      onRejected(error || 'Chat request was rejected');
    }
  }, [chatStatus, error, onRejected]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Chat Request',
      'Are you sure you want to cancel this chat request?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            cancelChatRequest();
            useChatStore.getState().reset();
            onBack();
          },
        },
      ],
    );
  }, [cancelChatRequest, onBack]);

  const formatWaitTime = (minutes: number): string => {
    if (minutes < 1) {
      return 'Less than a minute';
    }
    if (minutes === 1) {
      return '1 minute';
    }
    return `${minutes} minutes`;
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: colors.primary.main + '20'},
            ]}>
            <Text style={[styles.iconText, {color: colors.primary.main}]}>
              {astrologerName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, {color: colors.text.primary}]}>
          Waiting for {astrologerName}
        </Text>

        <Text style={[styles.subtitle, {color: colors.text.secondary}]}>
          {chatStatus === 'queued' && queueData
            ? `Position: ${
                queueData.position
              } | Estimated wait: ${formatWaitTime(
                queueData.estimatedWaitTime,
              )}`
            : 'Connecting...'}
        </Text>

        {chatStatus === 'queued' && queueData && (
          <View style={styles.positionCard}>
            <Text
              style={[styles.positionLabel, {color: colors.text.secondary}]}>
              Your Position
            </Text>
            <Text style={[styles.positionValue, {color: colors.primary.main}]}>
              #{queueData.position}
            </Text>
          </View>
        )}

        <View style={styles.waitingIndicator}>
          <View style={[styles.dot, {backgroundColor: colors.primary.main}]} />
          <View style={[styles.dot, {backgroundColor: colors.primary.main}]} />
          <View style={[styles.dot, {backgroundColor: colors.primary.main}]} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.cancelButton, {borderColor: colors.error.main}]}
        onPress={handleCancel}>
        <Text style={[styles.cancelText, {color: colors.error.main}]}>
          Cancel Request
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  positionCard: {
    marginTop: 32,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  positionLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  positionValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  waitingIndicator: {
    flexDirection: 'row',
    marginTop: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  cancelButton: {
    margin: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
