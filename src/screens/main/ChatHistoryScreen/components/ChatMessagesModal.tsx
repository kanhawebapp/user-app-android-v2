import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';

import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Icon } from '../../../../components/Icon';

interface Props {
  visible: boolean;
  loading: boolean;
  messages: any[];
  onClose: () => void;
}

const ChatMessagesModal: React.FC<Props> = ({
  visible,
  loading,
  messages = [],
  onClose,
}) => {
  const { colors, isDark } = useTheme();

  //   const renderMessage = ({item, index}: any) => {
  //     const isUser =
  //       item?.sender?.toLowerCase() === 'user';

  //     return (
  //       <View
  //         style={[
  //           styles.messageRow,
  //           isUser
  //             ? styles.userRow
  //             : styles.astrologerRow,
  //         ]}>
  //         <View
  //           style={[
  //             styles.messageBubble,
  //             {
  //               backgroundColor: isUser
  //                 ? colors.primary.main
  //                 : isDark
  //                 ? '#1E293B'
  //                 : '#F3F4F6',
  //             },
  //           ]}>
  //           <Text
  //             variant="bodySmall"
  //             style={{
  //               color: isUser
  //                 ? '#FFFFFF'
  //                 : colors.text.primary,
  //               lineHeight: 20,
  //             }}>
  //             {item?.message || 'Unknown message'}
  //           </Text>

  //           <Text
  //             variant="captionSmall"
  //             style={{
  //               marginTop: 6,
  //               opacity: 0.7,
  //               color: isUser
  //                 ? '#FFFFFF'
  //                 : colors.text.secondary,
  //             }}>
  //             {item?.sender || 'Unknown'}
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   };

  const renderMessage = ({ item }: any) => {

    console.log('item>>>>>', item);
    const isUser = item?.sender?.toLowerCase() === 'user';

    const hasImage = !!item?.image && item?.image?.trim() !== '';

    const hasMessage = !!item?.message && item?.message?.trim() !== '';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.astrologerRow,
        ]}>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser
                ? colors.primary.main
                : isDark
                  ? '#1E293B'
                  : '#F3F4F6',
            },
          ]}>
          {/* IMAGE */}
          {hasImage && (
            <TouchableOpacity activeOpacity={0.9}>
              <Image
                source={{
                  uri: item?.image,
                }}
                resizeMode="cover"
                style={styles.messageImage}
              />
            </TouchableOpacity>
          )}

          {/* SENDER */}
          <Text
            variant="captionSmall"
            style={{
              marginTop: 6,
              opacity: 0.7,
              color: isUser ? '#FFFFFF' : colors.text.secondary,
            }}>
            {item?.sender || 'Unknown'}
          </Text>

          {/* MESSAGE */}
          {hasMessage && (
            <Text
              variant="bodySmall"
              style={{
                color: isUser ? '#FFFFFF' : colors.text.primary,
                lineHeight: 20,
                marginTop: hasImage ? 10 : 0,
              }}>
              {item?.message}
            </Text>
          )}

          {/* FALLBACK */}
          {!hasMessage && !hasImage && (
            <Text
              variant="bodySmall"
              style={{
                color: isUser ? '#FFFFFF' : colors.text.primary,
              }}>
              Unknown message
            </Text>
          )}



          {/* TIME */}
          {!!item?.time && (
            <Text
              variant="captionSmall"
              style={{
                marginTop: 4,
                opacity: 0.55,
                fontSize: 11,
                color: isUser ? '#FFFFFF' : colors.text.secondary,
              }}>
              {item.time}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background.primary,
            },
          ]}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text
              variant="body"
              weight="bold"
              style={{
                color: colors.text.primary,
              }}>
              Chat Messages
            </Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary.main} />
            </View>
          ) : (
            <FlatList
              data={messages || []}
              keyExtractor={(item, index) => String(item?.msg_id || index)}
              renderItem={renderMessage}
              contentContainerStyle={{
                paddingVertical: 12,
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: colors.text.secondary,
                    }}>
                    No messages found
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },

  container: {
    height: '75%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },

  messageRow: {
    marginBottom: 14,
    flexDirection: 'row',
  },

  userRow: {
    justifyContent: 'flex-end',
  },

  astrologerRow: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageImage: {
    // width: 220,
    // height: 260,
    maxWidth: 220,
    minWidth: 160,
    height: 260,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
});

export default ChatMessagesModal;
