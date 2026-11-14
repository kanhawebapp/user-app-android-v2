import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { Reply } from 'lucide-react-native';
import { useTheme } from '../../../../theme';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  item: ChatMessage;
  astrologerName: string;
  astrologerImage?: string;
  onLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  onImagePress?: (url: string) => void;
  isLiked?: boolean;
  isGrouped?: boolean;
}

const MAX_REPLY_LENGTH = 50;

const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return '';
  }
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const MAX_LINES = 3;

const CHAT_BUBBLE = {
  outgoing: '#6221A8',
  incoming: '#FFFFFF',
  meta: '#8E8E93',
};

export const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({
    item,
    astrologerName,
    astrologerImage,
    onLike: _onLike,
    onReply,
    isLiked: _isLiked = false,
    isGrouped = false,
    onImagePress,
  }) => {
    const theme = useTheme();
    const colors = theme.colors;
    const isUser = item.sender === 'user';

    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const handleTextLayout = (event: any) => {
      const lines = event.nativeEvent.lines;
      if (lines.length > MAX_LINES) {
        setShowToggle(true);
      }
    };

    const formatTime = (date: Date) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '--:--';
      }
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    const renderMessageText = () => {
      const textStyle = [
        styles.text,
        {
          color: isUser ? '#FFFFFF' : colors.text.primary,
        },
      ];

      return (
        <>
          <Text
            style={textStyle}
            numberOfLines={showToggle && !expanded ? MAX_LINES : undefined}
            onTextLayout={handleTextLayout}>
            {item.text}
          </Text>
          {showToggle && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                style={[
                  styles.showMoreText,
                  {
                    color: isUser
                      ? 'rgba(255,255,255,0.8)'
                      : colors.primary.main,
                  },
                ]}>
                {expanded ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      );
    };

    const renderReplyBox = () => {
      if (!item.replyTo) {
        return null;
      }

      return (
        <View
          style={[
            styles.replyBox,
            {
              backgroundColor: isUser
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.05)',
              borderLeftColor: isUser
                ? 'rgba(255,255,255,0.9)'
                : colors.primary.main,
            },
          ]}>
          {item.replyTo.image && (
            <TouchableOpacity
              onPress={() => onImagePress?.(item.replyTo.image!)}>
              <Image
                source={{ uri: item.replyTo.image }}
                style={styles.replyImage}
              />
            </TouchableOpacity>
          )}

          {item.replyTo.message ? (
            <Text
              style={[
                styles.replyBoxMessage,
                { color: isUser ? '#FFFFFF' : colors.text.secondary },
              ]}
              numberOfLines={1}>
              {truncateText(item.replyTo.message, MAX_REPLY_LENGTH)}
            </Text>
          ) : null}
        </View>
      );
    };

    return (
      <Animated.View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.astroContainer,
          isGrouped && styles.groupedContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        {!isUser && (
          <View
            style={[
              styles.avatarWrapper,
              isGrouped && styles.avatarPlaceholderSpace,
            ]}>
            {!isGrouped &&
              (astrologerImage ? (
                <Image
                  source={{ uri: astrologerImage }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarFallback,
                    { backgroundColor: colors.primary.light },
                  ]}>
                  <Text
                    style={{
                      color: colors.primary.main,
                      fontWeight: '700',
                      fontSize: 14,
                    }}>
                    {astrologerName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ))}
          </View>
        )}

        <View
          style={[
            styles.bubbleColumn,
            isUser && styles.userBubbleColumn,
          ]}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.astroBubble,
            ]}>
            {renderReplyBox()}
            {!!item.text && renderMessageText()}
            {item.image && (
              <TouchableOpacity
                onPress={() => onImagePress?.(item.image!)}
                activeOpacity={0.9}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaTime}>{formatTime(item.timestamp)}</Text>
            <TouchableOpacity
              onPress={() => onReply(item)}
              style={styles.metaAction}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Reply size={16} color={CHAT_BUBBLE.meta} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },

  userContainer: {
    justifyContent: 'flex-end',
  },

  astroContainer: {
    justifyContent: 'flex-start',
  },

  groupedContainer: {
    marginTop: 2,
  },

  avatarWrapper: {
    width: 32,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  avatarPlaceholderSpace: {
    opacity: 0,
  },

  avatar: {
    width: 20,
    height: 20,
    borderRadius: 16,
    marginBottom: 30,
  },

  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bubbleColumn: {
    maxWidth: '78%',
    alignItems: 'flex-start',
  },

  userBubbleColumn: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  astroBubble: {
    backgroundColor: CHAT_BUBBLE.incoming,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4,
  },

  userBubble: {
    backgroundColor: CHAT_BUBBLE.outgoing,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },

  replyBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    marginBottom: 6,
    borderRadius: 4,
  },

  replyImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },

  replyBoxMessage: {
    fontSize: 13,
    opacity: 0.85,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
  },

  showMoreText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },

  metaTime: {
    fontSize: 10,
    color: CHAT_BUBBLE.meta,
  },

  metaAction: {
    padding: 2,
  },
});
