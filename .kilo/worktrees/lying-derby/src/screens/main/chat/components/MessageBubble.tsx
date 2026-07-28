import React, {useState, useRef, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';
import {ChatMessage} from '../types';

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
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const MAX_LINES = 3;
const LINE_HEIGHT = 20;

export const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({
    item,
    astrologerName,
    astrologerImage,
    onLike,
    onReply,
    isLiked = false,
    isGrouped = false,
    onImagePress,
  }) => {
    const theme = useTheme();
    const colors = theme.colors;
    const isUser = item.sender === 'user';
    const Astro = item.sender === 'astrologer';
    // console.log("iteeeeee----=-=-=-=-,",item)

    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const [textHeight, setTextHeight] = useState(0);

    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const imageToShow = item.image || item.replyTo?.image;

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

    // const handleTextLayout = (event: any) => {
    //   const height = event.nativeEvent.layout.height;
    //   setTextHeight(height);
    //   setShowToggle(height > MAX_LINES * LINE_HEIGHT);
    // };

    const handleTextLayout = (event: any) => {
      const lines = event.nativeEvent.lines;
      if (lines.length > MAX_LINES) {
        setShowToggle(true);
      }
    };

    // console.log('all data getting in MessageBubble-------', item);

    const formatTime = (date: Date) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '--:--';
      }
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    const renderReadReceipt = () => {
      if (!isUser) return null;

      const status = item.status;
      // const status = item.status;
      const isRead = true;
      // const isRead = item.read === true;

      let iconName = 'done';
      let iconColor = 'rgba(255,255,255,0.5)';

      // if (status === 'sending') {
      //   iconName = 'schedule';
      //   iconColor = 'rgba(255,255,255,0.5)';
      // } else if (status === 'sent') {
      //   iconName = 'done';
      //   iconColor = 'rgba(255,255,255,0.5)';
      // } else if (status === 'delivered' || !isRead) {
      //   iconName = 'done-all';
      //   iconColor = 'rgba(255,255,255,0.5)';
      // }
      if (isRead) {
        iconName = 'done-all';
        iconColor = '#53bdeb';
      }

      return (
        <Icon
          name={iconName}
          size={14}
          color={iconColor}
          style={{marginLeft: 3}}
        />
      );
    };

    const renderMessageText = () => {
      const textStyle = [
        styles.text,
        {
          color: isUser ? '#fff' : colors.text.primary,
        },
      ];

      if (!showToggle) {
        return (
          <Text style={textStyle} numberOfLines={undefined}>
            {item.text}
          </Text>
        );
      }

      return (
        <>
          {/* <Text
            style={textStyle}
            numberOfLines={expanded ? undefined : MAX_LINES}
            onLayout={handleTextLayout}>
            {item.text}
          </Text> */}
          <Text
            style={textStyle}
            numberOfLines={expanded ? undefined : MAX_LINES}
            onTextLayout={handleTextLayout}>
            {item.text}
          </Text>
          {showToggle && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
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
      if (!item.replyTo) return null;

      const replySender =
        item.replyTo.sender === 'user' ? 'You' : item.replyTo.sender;

      return (
        <View style={styles.replyBox}>
          {/* <Text style={styles.replyBoxSender}>{replySender}</Text> */}

          {/* ✅ IMAGE FIRST */}

          {/* {item.replyTo.image ? (
            <Image
              source={{uri: item.replyTo.image}}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                marginTop: 4,
                marginBottom: 4,
              }}
            />
          ) : null} */}
          {item.replyTo.image && (
            <TouchableOpacity
              onPress={() => onImagePress?.(item.replyTo.image!)}>
              <Image
                source={{uri: item.replyTo.image}}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  marginTop: 4,
                  marginBottom: 4,
                }}
              />
            </TouchableOpacity>
          )}

          {/* ✅ TEXT */}
          {item.replyTo.message ? (
            <Text style={styles.replyBoxMessage} numberOfLines={1}>
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
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {!isUser && !isGrouped && (
          <View style={styles.avatarWrapper}>
            {astrologerImage ? (
              <Image source={{uri: astrologerImage}} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {backgroundColor: colors.primary.light},
                ]}>
                <Text
                  style={{
                    color: colors.primary.main,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {astrologerName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}

        <View
          style={[styles.bubbleWrapper, isUser && {alignItems: 'flex-end'}]}>
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: isUser
                  ? colors.primary.main
                  : colors.background.secondary,
                borderColor: isUser ? colors.primary.main : colors.border.light,
                borderBottomRightRadius: isUser ? 6 : 18,
                borderBottomLeftRadius: isUser ? 18 : 6,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
              },
            ]}>
            {renderReplyBox()}
            {renderMessageText()}
            {/* {item.image && (
              <Image
                source={{uri: item.image}}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 12,
                  marginTop: 5,
                }}
              />
            )} */}
            {item.image && (
              <TouchableOpacity
                onPress={() => onImagePress?.(item.image!)}
                activeOpacity={0.9}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 12,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            )}

            <View style={styles.footer}>
              <Text
                style={[
                  styles.time,
                  {
                    color: isUser
                      ? 'rgba(255,255,255,0.6)'
                      : colors.text.tertiary,
                  },
                ]}>
                <Text style={{color: 'gray'}}>
                  {' '}
                  {Astro && formatTime(item.timestamp)}{' '}
                </Text>
                <Text style={{color: 'white'}}>
                  {isUser && formatTime(item.timestamp)}{' '}
                </Text>
              </Text>
              {isUser && renderReadReceipt()}
            </View>
          </View>

          {/* {item.image && (
            <Image
              source={{uri: item.image}}
              style={{width: 200, height: 200, borderRadius: 12, marginTop: 5}}
            />
          )} */}

          {/* {item.text ? <Text>{item.text}</Text> : null} */}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onLike(item.id)}
              style={styles.actionBtn}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              {/* <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={isLiked ? '#ff3b30' : colors.text.tertiary}
                library="Ionicons"
              /> */}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onReply(item)}
              style={styles.actionBtn}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon name="reply" size={20} color={colors.primary.main} />
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
    marginVertical: 3,
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
    marginRight: 8,
    alignSelf: 'flex-end',
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bubbleWrapper: {
    maxWidth: '75%',
  },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },

  replyBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    marginBottom: 6,
    borderRadius: 4,
  },

  replyBoxSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },

  replyBoxMessage: {
    fontSize: 13,
    opacity: 0.8,
    color: 'white',
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
  },

  showMoreText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },

  time: {
    fontSize: 10.5,
    opacity: 0.8,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 12,
  },

  actionBtn: {
    padding: 4,
  },
});
