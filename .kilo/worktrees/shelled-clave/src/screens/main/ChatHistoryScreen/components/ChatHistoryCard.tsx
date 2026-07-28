// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
// import { colors, useTheme } from '../../../../theme';
// import { Text } from '../../../../components/Text';
// import { Icon } from '../../../../components/Icon';
// // import { UserChatHistory } from '../../../../services/api/chatHistory/chat-history.types';
// import { useChatMessages } from '../../../../services/api/chatMessage/useChatMessages';

// interface ChatHistoryCardProps {
//   chat: any;
//   onPress: (chat: any) => void;
// }

// const STATUS_COLORS: Record<string, { dot: string; text: string }> = {
//   COMPLETED: { dot: '#22C55E', text: '#22C55E' },
//   ONGOING: { dot: '#F59E0B', text: '#F59E0B' },
//   CANCELLED: { dot: '#EF4444', text: '#EF4444' },
// };

// const getStatusLabel = (status: string): string => {
//   const labels: Record<string, string> = {
//     COMPLETED: 'Completed',
//     ONGOING: 'Ongoing',
//     CANCELLED: 'Cancelled',
//   };
//   return labels[status] || 'Completed';
// };

// const formatTime = (dateString: string): string => {
//   if (!dateString) {
//     return '-';
//   }
//   return new Date(dateString).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// const formatDuration = (seconds: number): string => {
//   if (!seconds || seconds === 0) {
//     return '0s';
//   }
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   if (mins === 0) {
//     return `${secs}s`;
//   }
//   return `${mins}m ${secs}s`;
// };

// const formatMessages = (messages: any['messages']) => {
//   if (!messages || messages.length === 0) {
//     return 'No messages';
//   }
//   return `${messages.length} message${messages.length > 1 ? 's' : ''}`;
// };

// export const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({
//   chat,
//   onPress,
// }) => {
//   const { colors, isDark } = useTheme();
//   const statusColors = STATUS_COLORS[chat.status] || STATUS_COLORS.COMPLETED;
//   const [showMessagesModal, setShowMessagesModal] = useState(false);

//   // console.log("chatttttt",chat?.sessionId)
//   //  const {data} = useChatHistory();

//   const {
//     data: messages,
//     fetchMessages,
//     loading,
//   } = useChatMessages();

//   //  YAHI API CALL HOGI
//   const handleViewMore = async (
//     sessionId: string,
//   ) => {
//     try {
//       await fetchMessages(sessionId);
//       setShowMessagesModal(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const closeModal = () => {
//     setShowMessagesModal(false);
//   };

//   console.log("messagesmessagesmessages",messages)

//   return (
//     <>
//       <TouchableOpacity
//         activeOpacity={0.7}
//         onPress={() => onPress(chat)}
//         style={[styles.cardOuterWrapper, { paddingHorizontal: 16 }]}>
//         <View
//           style={[
//             styles.cardContainer,
//             {
//               backgroundColor: colors.background.primary,
//               borderColor: isDark ? colors.border.dark : colors.border.light,
//             },
//           ]}>
//           <View style={styles.cardTopRow}>
//             <View style={styles.astrologerInfo}>
//               {chat.astrologerImage ? (
//                 <Image
//                   source={{ uri: chat.astrologerImage }}
//                   style={styles.avatar}
//                 />
//               ) : (
//                 <View
//                   style={[
//                     styles.avatar,
//                     styles.avatarPlaceholder,
//                     { backgroundColor: colors.primary.light + '30' },
//                   ]}>
//                   <Icon name="person" size={22} color={colors.primary.main} />
//                 </View>
//               )}
//               <View style={styles.nameInfo}>
//                 <Text
//                   variant="body"
//                   weight="semibold"
//                   numberOfLines={1}
//                   style={{ color: colors.text.primary }}>
//                   {chat.astrologerName || 'Astrologer'}
//                 </Text>
//                 <Text
//                   variant="captionSmall"
//                   style={{ color: colors.text.secondary, marginTop: 2 }}>
//                   {formatTime(chat.startedAt)}
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: colors.background.secondary },
//               ]}>
//                 <View
//                   style={[styles.statusDot, { backgroundColor: statusColors.dot }]}
//                 />
//                 <Text
//                   variant="captionSmall"
//                   weight="medium"
//                   style={{
//                     color: statusColors.text,
//                   }}>
//                   {getStatusLabel(chat.status)}
//                 </Text>
//               </View>
//           </View>

//           <View style={styles.cardStatsRow}>
//             <View style={styles.statBox}>
//               <Icon name="schedule" size={16} color={colors.primary.main} />
//               <Text
//                 variant="captionSmall"
//                 style={{ color: colors.text.secondary, marginTop: 4 }}>
//                 Duration
//               </Text>
//               <Text
//                 variant="bodySmall"
//                 weight="bold"
//                 style={{ color: colors.text.primary, marginTop: 2 }}>
//                 {formatDuration(chat.durationSec || 0)}
//               </Text>
//             </View>

//             <View style={styles.statDivider} />

//             <View style={styles.statBox}>
//               <Icon name="payments" size={16} color={colors.secondary.main} />
//               <Text
//                 variant="captionSmall"
//                 style={{ color: colors.text.secondary, marginTop: 4 }}>
//                 Spent
//               </Text>
//               <Text
//                 variant="bodySmall"
//                 weight="bold"
//                 style={{ color: colors.text.primary, marginTop: 2 }}>
//                 ₹{chat.coinsDeducted || 0}
//               </Text>
//             </View>

//             <View style={styles.statDivider} />

//             <View style={styles.statBox}>
//               <Icon name="forum" size={16} color={colors.primary.main} />
//               <Text
//                 variant="captionSmall"
//                 style={{ color: colors.text.secondary, marginTop: 4 }}>
//                 Messages
//               </Text>
//               <Text
//                 variant="bodySmall"
//                 weight="bold"
//                 style={{ color: colors.text.primary, marginTop: 2 }}>
//                 {formatMessages(chat.messages)}
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             onPress={() => {
//               handleViewMore(chat?.sessionId)
//             }}
//           >
//             <View style={styles.cardFooter}>
//               <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
//                 Tap to view details
//               </Text>
//               <Icon name="chevron-right" size={18} color={colors.text.secondary} />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>

//       {/* Messages Modal */}
//       <Modal
//         transparent={true}
//         visible={showMessagesModal}
//         onRequestClose={closeModal}
//         animationType="fade">
//         <View style={styles.modalBackdrop} onTouchStart={closeModal}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text variant="body" weight="semibold" style={{ color: colors.text.primary }}>
//                 Chat Messages
//               </Text>
//               <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
//                 <Icon name="x" size={20} color={colors.text.secondary} />
//               </TouchableOpacity>
//             </View>
//             {loading ? (
//               <View style={styles.modalLoading}>
//                 <ActivityIndicator size="large" color={colors.primary.main} />
//               </View>
//             ) : (
//               <View style={styles.modalContent}>
//                 {messages.length > 0 ? (
//                   messages.map((msg: any, index: number) => (
//                     <View key={index} style={[
//                       styles.messageItem,
//                       msg.sender === 'user' ? styles.messageUser : styles.messageAstrologer
//                     ]}>
//                       <Text variant="bodySmall" style={{ color: colors.text.primary }}>
//                         {msg.message}
//                       </Text>
//                       {msg.sender !== 'user' && (
//                         <View style={styles.avatarSmall}>
//                           <Icon name="person" size={24} color={colors.primary.main} />
//                         </View>
//                       )}
//                     </View>
//                   ))
//                 ) : (
//                   <Text variant="captionSmall" style={{ color: colors.text.secondary, textAlign: 'center' }}>
//                     No messages available
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   cardOuterWrapper: {
//     marginBottom: 12,
//   },
//   cardContainer: {
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardTopRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   astrologerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   avatarPlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   nameInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 6,
//   },
//   cardStatsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.05)',
//   },
//   statBox: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.05)',
//   },
//   // Modal Styles
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '90%',
//     maxWidth: 400,
//     backgroundColor: colors.background.primary,
//     borderRadius: 16,
//     padding: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalCloseButton: {
//     padding: 8,
//   },
//   modalLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     flex: 1,
//   },
//   messageItem: {
//     padding: 12,
//     borderRadius: 12,
//     marginVertical: 8,
//     maxWidth: '80%',
//   },
//   messageUser: {
//     backgroundColor: colors.primary.light,
//     alignSelf: 'flex-end',
//   },
//   messageAstrologer: {
//     backgroundColor: colors.background.secondary,
//     alignSelf: 'flex-start',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatarSmall: {
//     marginRight: 8,
//   },
// });

// export default ChatHistoryCard;

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {colors, useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
// import { UserChatHistory } from '../../../../services/api/chatHistory/chat-history.types';
import {useChatMessages} from '../../../../services/api/chatMessage/useChatMessages';
import ChatMessagesModal from './ChatMessagesModal';

interface ChatHistoryCardProps {
  chat: any;
  onPress: (chat: any) => void;
}

const STATUS_COLORS: Record<string, {dot: string; text: string}> = {
  COMPLETED: {dot: '#22C55E', text: '#22C55E'},
  ONGOING: {dot: '#F59E0B', text: '#F59E0B'},
  CANCELLED: {dot: '#EF4444', text: '#EF4444'},
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    COMPLETED: 'Completed',
    ONGOING: 'Ongoing',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || 'Completed';
};

const formatTime = (dateString: string): string => {
  if (!dateString) {
    return '-';
  }
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds === 0) {
    return '0s';
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

const formatMessages = (messages: any['messages']) => {
  if (!messages || messages.length === 0) {
    return 'No messages';
  }
  return `${messages.length} message${messages.length > 1 ? 's' : ''}`;
};

export const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({
  chat,
  onPress,
}) => {
  const {colors, isDark} = useTheme();
  const statusColors = STATUS_COLORS[chat.status] || STATUS_COLORS.COMPLETED;
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  // console.log("chatttttt",chat?.sessionId)
  //  const {data} = useChatHistory();

  const {data: messages, fetchMessages, loading} = useChatMessages();

  //  YAHI API CALL HOGI
  const handleViewMore = async (sessionId: string) => {
    try {
      await fetchMessages(sessionId);
      setShowMessagesModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowMessagesModal(false);
  };

  console.log('CHAT_MESSAGES', JSON.stringify(messages, null, 2));

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(chat)}
        style={[styles.cardOuterWrapper, {paddingHorizontal: 16}]}>
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.background.primary,
              borderColor: isDark ? colors.border.dark : colors.border.light,
            },
          ]}>
          <View style={styles.cardTopRow}>
            <View style={styles.astrologerInfo}>
              {chat.astrologerImage ? (
                <Image
                  source={{uri: chat.astrologerImage}}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.avatarPlaceholder,
                    {backgroundColor: colors.primary.light + '30'},
                  ]}>
                  <Icon name="person" size={22} color={colors.primary.main} />
                </View>
              )}
              <View style={styles.nameInfo}>
                <Text
                  variant="body"
                  weight="semibold"
                  numberOfLines={1}
                  style={{color: colors.text.primary}}>
                  {chat.astrologerName || 'Astrologer'}
                </Text>
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary, marginTop: 2}}>
                  {formatTime(chat.startedAt)}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: colors.background.secondary},
              ]}>
              <View
                style={[styles.statusDot, {backgroundColor: statusColors.dot}]}
              />
              <Text
                variant="captionSmall"
                weight="medium"
                style={{
                  color: statusColors.text,
                }}>
                {getStatusLabel(chat.status)}
              </Text>
            </View>
          </View>

          <View style={styles.cardStatsRow}>
            <View style={styles.statBox}>
              <Icon name="schedule" size={16} color={colors.primary.main} />
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 4}}>
                Duration
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 2}}>
                {formatDuration(chat.durationSec || 0)}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Icon name="payments" size={16} color={colors.secondary.main} />
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 4}}>
                Spent
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 2}}>
                ₹{chat.coinsDeducted || 0}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Icon name="forum" size={16} color={colors.primary.main} />
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 4}}>
                Messages
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 2}}>
                {formatMessages(chat.messages)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              handleViewMore(chat?.sessionId);
            }}>
            <View style={styles.cardFooter}>
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary}}>
                Tap to view details
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.text.secondary}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Messages Modal */}
      <ChatMessagesModal
        visible={showMessagesModal}
        loading={loading}
        messages={Array.isArray(messages) ? messages : []}
        onClose={closeModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardOuterWrapper: {
    marginBottom: 12,
  },
  cardContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  astrologerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  messageItem: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: '80%',
  },
  messageUser: {
    backgroundColor: colors.primary.light,
    alignSelf: 'flex-end',
  },
  messageAstrologer: {
    backgroundColor: colors.background.secondary,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    marginRight: 8,
  },
});

export default ChatHistoryCard;
