import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, Image, TouchableOpacity, TextInput} from 'react-native';
// import {useTheme} from '../../theme';
import {Modal} from '../../../../components/Modal';
import {Button} from '../../../../components/Button';
import {Icon} from '../../../../components/Icon';
import {Text} from '../../../../components/Text';
import {Gift} from '../../../../services/api/gift/gift.types';
import { useTheme } from '../../../../theme';

interface SendGiftModalProps {
  visible: boolean;
  onClose: () => void;
  gifts: Gift[];
  astrologerName?: string;
  onSendGift?: (gift: Gift, message: string) => void;
  loading?: boolean;
}

export const SendGiftModal: React.FC<SendGiftModalProps> = ({
  visible,
  onClose,
  gifts,
  astrologerName,
  onSendGift,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState('');

  const handleGiftSelect = useCallback((gift: Gift) => {
    setSelectedGift(gift);
  }, []);

  const handleSendGift = useCallback(() => {
    if (selectedGift) {
      onSendGift?.(selectedGift, message);
      setSelectedGift(null);
      setMessage('');
    }
  }, [selectedGift, message, onSendGift]);

  const renderGiftItem = useCallback(({item}: {item: Gift}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleGiftSelect(item)}
      style={[
        styles.giftItem,
        {
          backgroundColor: selectedGift?.id === item.id
            ? colors.primary.light + '30'
            : colors.background.secondary,
          borderColor: selectedGift?.id === item.id
            ? colors.primary.main
            : colors.border.light,
        },
      ]}>
      <Image
        source={{uri: `https://dhwaniastro.com${item.image}`}}
        style={styles.giftImage}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.giftAmount,
          {color: colors.text.primary},
        ]}>
        ₹{item.amount}
      </Text>
    </TouchableOpacity>
  ), [selectedGift, colors]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      animationType="slide"
      dismissOnBackdropPress={true}
      showCloseButton={true}
      title="Send Gift"
      contentStyle={styles.modalContent}
    >
      <View style={styles.container}>
        {astrologerName && (
          <Text
            style={[styles.astrologerName, {color: colors.text.primary}]}
          >
            To: {astrologerName}
          </Text>
        )}

        <Text
          style={[styles.sectionTitle, {color: colors.text.secondary}]}
        >
          Choose a gift
        </Text>

        <FlatList
          data={gifts}
          renderItem={renderGiftItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.giftRow}
          contentContainerStyle={styles.giftList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="card-giftcard"
                size={48}
                color={colors.text.tertiary}
                library="MaterialIcons"
              />
              <Text
                style={[styles.emptyText, {color: colors.text.tertiary}]}
              >
                No gifts available right now
              </Text>
            </View>
          }
        />

        <View style={styles.messageContainer}>
          <Text
            style={[styles.sectionTitle, {color: colors.text.secondary}]}
          >
            Add a message (optional)
          </Text>
          <TextInput
            style={[
              styles.messageInput,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.light,
                color: colors.text.primary,
              },
            ]}
            placeholder="Write your message here..."
            placeholderTextColor={colors.text.tertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Send Gift"
            variant="primary"
            size="large"
            onPress={handleSendGift}
            loading={loading}
            disabled={!selectedGift || loading}
            style={styles.sendButton}
            leftIcon={
              <Icon
                name="send"
                size={20}
                color={colors.primary.contrastText}
                library="MaterialIcons"
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 16,
    maxHeight: '80%',
  },
  container: {
    paddingVertical: 16,
  },
  astrologerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  giftList: {
    paddingBottom: 16,
  },
  giftRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  giftItem: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: '33%',
  },
  giftImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  giftAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  messageContainer: {
    marginTop: 8,
  },
  messageInput: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
  },
  sendButton: {
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default SendGiftModal;