// import React from 'react';
// import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../../components/Icon';
// import {ChatMessage} from '../ChatScreen';

// interface MessageBubbleProps {
//   item: ChatMessage;
//   astrologerName: string;
//   astrologerImage?: string;
//   onLike: (messageId: string) => void;
//   onReply: (message: ChatMessage) => void;
//   isLiked?: boolean;
// }

// export const MessageBubble: React.FC<MessageBubbleProps> = ({
//   item,
//   astrologerName,
//   astrologerImage,
//   onLike,
//   onReply,
//   isLiked = false,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const isUser = item.sender === 'user';

//   return (
//     <View
//       style={[
//         styles.messageContainer,
//         isUser ? styles.userMessageContainer : styles.astroMessageContainer,
//       ]}>
//       {!isUser && (
//         <View style={styles.avatarContainer}>
//           {astrologerImage ? (
//             <Image source={{uri: astrologerImage}} style={styles.avatar} />
//           ) : (
//             <View
//               style={[
//                 styles.avatarPlaceholder,
//                 {backgroundColor: colors.primary.light},
//               ]}>
//               <Text
//                 style={[styles.avatarInitial, {color: colors.primary.main}]}>
//                 {astrologerName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//         </View>
//       )}
//       <View
//         style={[
//           styles.messageBubbleWrapper,
//           isUser && styles.userMessageBubbleWrapper,
//         ]}>
//         <View
//           style={[
//             styles.messageBubble,
//             {
//               backgroundColor: isUser
//                 ? colors.primary.main
//                 : colors.background.secondary,
//               borderColor: isUser ? colors.primary.main : colors.border.light,
//             },
//           ]}>
//           <Text
//             style={[
//               styles.messageText,
//               {
//                 color: isUser
//                   ? colors.primary.contrastText
//                   : colors.text.primary,
//               },
//             ]}>
//             {item.text}
//           </Text>
//           <View style={styles.messageFooter}>
//             <Text
//               style={[
//                 styles.timestamp,
//                 {
//                   color: isUser
//                     ? colors.primary.contrastText + '99'
//                     : colors.text.tertiary,
//                 },
//               ]}>
//               {item.timestamp.toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </Text>
//             {isUser && (
//               <View style={styles.readStatus}>
//                 <Icon
//                   name={item.read ? 'done-all' : 'done'}
//                   size={14}
//                   color={colors.primary.contrastText + '99'}
//                 />
//               </View>
//             )}
//           </View>
//         </View>
//         <View style={styles.messageActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onLike(item.id)}>
//             <Icon
//               name={isLiked ? 'heart-sharp' : 'heart-outline'}
//               size={18}
//               color={isLiked ? colors.error.main : colors.text.tertiary}
//               library="Ionicons"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onReply(item)}>
//             <Icon name="reply" size={18} color={colors.text.tertiary} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   messageContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     alignItems: 'flex-end',
//   },
//   userMessageContainer: {
//     justifyContent: 'flex-end',
//   },
//   astroMessageContainer: {
//     justifyContent: 'flex-start',
//   },
//   avatarContainer: {
//     marginRight: 8,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//   },
//   avatarPlaceholder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarInitial: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   messageBubbleWrapper: {
//     maxWidth: '75%',
//   },
//   userMessageBubbleWrapper: {
//     alignItems: 'flex-end',
//   },
//   messageBubble: {
//     padding: 12,
//     borderRadius: 18,
//     borderWidth: 1,
//   },
//   messageText: {
//     fontSize: 15,
//     lineHeight: 21,
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginTop: 4,
//   },
//   timestamp: {
//     fontSize: 10,
//   },
//   readStatus: {
//     marginLeft: 4,
//   },
//   messageActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   actionButton: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
// });

// import React from 'react';
// import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../../components/Icon';
// import {ChatMessage} from '../ChatScreen';

// interface MessageBubbleProps {
//   item: ChatMessage;
//   astrologerName: string;
//   astrologerImage?: string;
//   onLike: (messageId: string) => void;
//   onReply: (message: ChatMessage) => void;
//   isLiked?: boolean;
// }

// export const MessageBubble: React.FC<MessageBubbleProps> = ({
//   item,
//   astrologerName,
//   astrologerImage,
//   onLike,
//   onReply,
//   isLiked = false,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const isUser = item.sender === 'user';

//   return (
//     <View
//       style={[
//         styles.container,
//         isUser ? styles.userContainer : styles.astroContainer,
//       ]}>
//       {/* Avatar */}
//       {!isUser && (
//         <View style={styles.avatarWrapper}>
//           {astrologerImage ? (
//             <Image source={{uri: astrologerImage}} style={styles.avatar} />
//           ) : (
//             <View
//               style={[
//                 styles.avatarPlaceholder,
//                 {backgroundColor: colors.primary.light},
//               ]}>
//               <Text style={{color: colors.primary.main, fontWeight: '700'}}>
//                 {astrologerName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Message */}
//       <View style={[styles.bubbleWrapper, isUser && {alignItems: 'flex-end'}]}>
//         <View
//           style={[
//             styles.bubble,
//             {
//               backgroundColor: isUser ? colors.primary.main : '#ffffff',
//               borderColor: isUser ? colors.primary.main : colors.border.light,
//             },
//           ]}>
//           {/* Message Text */}
//           <Text
//             style={[
//               styles.text,
//               {
//                 color: isUser ? '#fff' : colors.text.primary,
//               },
//             ]}>
//             {item.text}
//           </Text>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text
//               style={[
//                 styles.time,
//                 {
//                   color: isUser
//                     ? 'rgba(255,255,255,0.7)'
//                     : colors.text.tertiary,
//                 },
//               ]}>
//               {item.timestamp.toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </Text>

//             {isUser && (
//               <Icon
//                 name={item.read ? 'done-all' : 'done'}
//                 size={14}
//                 color="rgba(255,255,255,0.7)"
//                 style={{marginLeft: 4}}
//               />
//             )}
//           </View>

//           {/* Bubble Tail */}
//           <View
//             style={[
//               styles.tail,
//               isUser ? styles.userTail : styles.astroTail,
//               {
//                 backgroundColor: isUser ? colors.primary.main : '#fff',
//               },
//             ]}
//           />
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => onLike(item.id)}
//             style={styles.actionBtn}>
//             <Icon
//               name={isLiked ? 'heart' : 'heart-outline'}
//               size={18}
//               color={isLiked ? '#ff3b30' : colors.text.tertiary}
//               library="Ionicons"
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => onReply(item)}
//             style={styles.actionBtn}>
//             <Icon name="reply" size={18} color={colors.text.tertiary} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     marginBottom: 14,
//     alignItems: 'flex-end',
//   },

//   userContainer: {
//     justifyContent: 'flex-end',
//   },

//   astroContainer: {
//     justifyContent: 'flex-start',
//   },

//   avatarWrapper: {
//     marginRight: 8,
//   },

//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },

//   avatarPlaceholder: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   bubbleWrapper: {
//     maxWidth: '75%',
//   },

//   bubble: {
//     padding: 14,
//     borderRadius: 18,
//     borderWidth: 1,

//     // 🔥 Premium Shadow
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: {width: 0, height: 3},
//     elevation: 3,
//   },

//   text: {
//     fontSize: 15,
//     lineHeight: 22,
//   },

//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: 6,
//   },

//   time: {
//     fontSize: 11,
//   },

//   actions: {
//     flexDirection: 'row',
//     marginTop: 6,
//     gap: 6,
//   },

//   actionBtn: {
//     padding: 6,
//     borderRadius: 20,
//   },

//   // 🔥 Bubble Tail
//   tail: {
//     position: 'absolute',
//     bottom: -4,
//     width: 10,
//     height: 10,
//     transform: [{rotate: '45deg'}],
//   },

//   userTail: {
//     right: 10,
//   },

//   astroTail: {
//     left: 10,
//   },
// });

import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';
import {ChatMessage} from '../ChatScreen';

interface MessageBubbleProps {
  item: ChatMessage;
  astrologerName: string;
  astrologerImage?: string;
  onLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  isLiked?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  item,
  astrologerName,
  astrologerImage,
  onLike,
  onReply,
  isLiked = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isUser = item.sender === 'user';

  // 🔥 Swipe Animation
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dx) > 10;
    },

    onPanResponderMove: (_, gesture) => {
      if (gesture.dx > 0) {
        translateX.setValue(Math.min(gesture.dx, 80));
      }
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 60) {
        onReply(item); // 🔥 Trigger reply
      }

      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.astroContainer,
      ]}>
      {/* Avatar */}
      {!isUser && (
        <View style={styles.avatarWrapper}>
          {astrologerImage ? (
            <Image source={{uri: astrologerImage}} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {backgroundColor: colors.primary.light},
              ]}>
              <Text style={{color: colors.primary.main, fontWeight: '700'}}>
                {astrologerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Swipe Wrapper */}
      <Animated.View
        style={[styles.bubbleWrapper, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}>
        {/* Swipe Icon */}

        {/* Bubble */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? colors.primary.main : '#fff',
              borderColor: isUser ? colors.primary.main : colors.border.light,

              // 🔥 Corner Fix
              borderBottomRightRadius: isUser ? 4 : 18,
              borderBottomLeftRadius: isUser ? 18 : 4,
            },
          ]}>
          {/* Text */}
          <Text
            style={[
              styles.text,
              {
                color: isUser ? '#fff' : colors.text.primary,
              },
            ]}>
            {item.text}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.time,
                {
                  color: isUser
                    ? 'rgba(255,255,255,0.7)'
                    : colors.text.tertiary,
                },
              ]}>
              {item.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>

            {isUser && (
              <Icon
                name={item.read ? 'done-all' : 'done'}
                size={14}
                color="rgba(255,255,255,0.7)"
                style={{marginLeft: 4}}
              />
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onLike(item.id)}
            style={styles.actionBtn}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#ff3b30' : colors.text.tertiary}
              library="Ionicons"
            />
          </TouchableOpacity>

          {/* ✅ Reply only for astrologer */}
          {!isUser && (
            <TouchableOpacity
              onPress={() => onReply(item)}
              style={styles.actionBtn}>
              <Icon name="reply" size={20} color={colors.primary.main} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },

  userContainer: {
    justifyContent: 'flex-end',
  },

  astroContainer: {
    justifyContent: 'flex-start',
  },

  avatarWrapper: {
    marginRight: 8,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bubbleWrapper: {
    maxWidth: '75%',
  },

  bubble: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },

  time: {
    fontSize: 11,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 6,
  },

  actionBtn: {
    padding: 6,
  },

  swipeIcon: {
    position: 'absolute',
    left: -30,
    top: '40%',
  },
});
