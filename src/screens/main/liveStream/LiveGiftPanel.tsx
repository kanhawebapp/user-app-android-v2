import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text, Button, Icon, useTheme} from '../../../components';
import {LiveGift} from '../../../services/api/liveGifts/live-gifts.types';
import {useLiveGifts} from '../../../services/api/liveGifts/useLiveGifts';
import {useWallet} from '../../../services/api/wallet/wallet.hooks';
import {resolveLiveGiftIcon} from './resolveLiveGiftIcon';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

interface LiveGiftPanelProps {
  onClose: () => void;
  onSend: (gift: LiveGift, quantity: number) => Promise<void>;
  sending?: boolean;
}

/** Inline bottom gift panel — plain Views only (no Modal / animations). */
export const LiveGiftPanel: React.FC<LiveGiftPanelProps> = ({
  onClose,
  onSend,
  sending = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {wallet, loading: walletLoading} = useWallet();
  const balanceCoins = wallet?.balanceCoins ?? 0;

  const {
    data: gifts,
    loading,
    error,
    refresh,
  } = useLiveGifts({
    enabled: true,
  });

  const [selectedGift, setSelectedGift] = useState<LiveGift | null>(null);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSelect = useCallback((gift: LiveGift) => {
    setSelectedGift(gift);
    setLocalError(null);
  }, []);

  const decreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(MIN_QUANTITY, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(prev => Math.min(MAX_QUANTITY, prev + 1));
  }, []);

  const handleSend = useCallback(async () => {
    if (!selectedGift || sending) {
      return;
    }
    const total = selectedGift.price * quantity;
    if (total > balanceCoins) {
      setLocalError('Insufficient coin balance. Please recharge your wallet.');
      return;
    }
    setLocalError(null);
    await onSend(selectedGift, quantity);
  }, [selectedGift, quantity, sending, onSend, balanceCoins]);

  const totalPrice =
    selectedGift != null ? selectedGift.price * quantity : null;
  const canSend = !!selectedGift && !sending && !loading;
  const sendButtonTitle =
    totalPrice != null ? `🎁 Send Gift · ${totalPrice} coins` : '🎁 Send Gift';

  const renderGift = ({item}: {item: LiveGift}) => {
    const isSelected = selectedGift?.id === item.id;
    const iconUri = resolveLiveGiftIcon(item.icon);

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleSelect(item)}
        style={[
          styles.giftCard,
          {
            borderColor: isSelected ? colors.primary.main : colors.border.light,
            backgroundColor: isSelected
              ? colors.primary.main + '12'
              : colors.card.background,
          },
        ]}
        accessibilityLabel={`${item.name}, ${item.price} coins`}
        accessibilityState={{selected: isSelected}}>
        {isSelected && (
          <View
            style={[styles.checkBadge, {backgroundColor: colors.primary.main}]}>
            <Icon
              name="check"
              size={12}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          </View>
        )}
        {iconUri ? (
          <Image
            source={{uri: iconUri}}
            style={styles.giftIcon}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.giftIconFallback}>
            <Icon
              name="card-giftcard"
              size={28}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          </View>
        )}
        <Text
          variant="caption"
          weight="semibold"
          color={colors.text.primary}
          style={styles.giftName}
          numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          variant="caption"
          weight="bold"
          color={isSelected ? colors.primary.main : colors.text.secondary}>
          {item.price} coins
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGiftGrid = () => {
    if (loading && gifts.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary.main} />
          <Text
            variant="caption"
            color={colors.text.secondary}
            style={styles.statusText}>
            Loading gifts...
          </Text>
        </View>
      );
    }

    if (error && gifts.length === 0) {
      return (
        <View style={styles.centered}>
          <Text
            variant="bodySmall"
            color={colors.error.main}
            style={styles.statusText}>
            {error}
          </Text>
          <Button
            title="Retry"
            variant="outline"
            size="small"
            onPress={refresh}
          />
        </View>
      );
    }

    if (!loading && gifts.length === 0) {
      return (
        <View style={styles.centered}>
          <Text variant="bodySmall" color={colors.text.tertiary}>
            No gifts available right now
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={gifts}
        keyExtractor={item => item.id}
        renderItem={renderGift}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.giftRow}
        contentContainerStyle={styles.giftList}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const selectedIconUri = selectedGift
    ? resolveLiveGiftIcon(selectedGift.icon)
    : null;

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.light,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
      testID="live-gift-panel">
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="h6" weight="semibold" style={styles.headerTitle}>
            🎁 Send a Gift
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            disabled={sending}
            style={[
              styles.closeButton,
              {backgroundColor: colors.background.secondary},
            ]}
            accessibilityLabel="Close gift panel">
            <Text
              variant="subtitle"
              weight="semibold"
              color={colors.text.primary}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
        <Text variant="bodySmall" color={colors.text.secondary}>
          Choose a gift to support the astrologer.
        </Text>
        <Text
          variant="caption"
          color={colors.text.tertiary}
          style={styles.walletLine}>
          Wallet: {walletLoading ? '...' : `${balanceCoins.toFixed(0)} coins`}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {renderGiftGrid()}

        {selectedGift != null && (
          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.light,
              },
            ]}>
            <View style={styles.detailsHeader}>
              {selectedIconUri ? (
                <Image
                  source={{uri: selectedIconUri}}
                  style={styles.detailsIcon}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.detailsIconFallback}>
                  <Icon
                    name="card-giftcard"
                    size={28}
                    color={colors.primary.main}
                    library="MaterialIcons"
                  />
                </View>
              )}
              <View style={styles.detailsText}>
                <Text
                  variant="subtitle"
                  weight="semibold"
                  color={colors.text.primary}
                  numberOfLines={1}>
                  {selectedGift.name}
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  {selectedGift.price} coins each
                </Text>
              </View>
            </View>

            <View style={styles.quantityBlock}>
              <Text variant="bodySmall" color={colors.text.secondary}>
                Quantity
              </Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={decreaseQuantity}
                  disabled={quantity <= MIN_QUANTITY || sending}
                  style={[
                    styles.quantityButton,
                    {
                      borderColor: colors.border.light,
                      opacity: quantity <= MIN_QUANTITY || sending ? 0.4 : 1,
                    },
                  ]}
                  accessibilityLabel="Decrease quantity">
                  <Text
                    variant="subtitle"
                    weight="semibold"
                    color={colors.text.primary}>
                    −
                  </Text>
                </TouchableOpacity>
                <Text
                  variant="subtitle"
                  weight="semibold"
                  style={styles.quantityValue}
                  color={colors.text.primary}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={increaseQuantity}
                  disabled={quantity >= MAX_QUANTITY || sending}
                  style={[
                    styles.quantityButton,
                    {
                      borderColor: colors.border.light,
                      opacity: quantity >= MAX_QUANTITY || sending ? 0.4 : 1,
                    },
                  ]}
                  accessibilityLabel="Increase quantity">
                  <Text
                    variant="subtitle"
                    weight="semibold"
                    color={colors.text.primary}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text
              variant="bodySmall"
              weight="semibold"
              color={colors.text.primary}
              style={styles.totalLine}>
              Total cost: {totalPrice} coins
            </Text>
          </View>
        )}

        {!!localError && (
          <Text
            variant="caption"
            color={colors.error.main}
            style={styles.localError}>
            {localError}
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={sendButtonTitle}
          variant="primary"
          size="large"
          onPress={handleSend}
          loading={sending}
          disabled={!canSend}
        />
        <Text
          variant="captionSmall"
          color={colors.text.tertiary}
          style={styles.footerNote}>
          Your wallet will be charged when the gift is sent successfully.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitle: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLine: {
    marginTop: 6,
  },
  scroll: {
    flexGrow: 0,
    maxHeight: 320,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  centered: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 4,
  },
  giftList: {
    paddingBottom: 4,
  },
  giftRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  giftCard: {
    width: '48%',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  giftIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  giftIconFallback: {
    width: 48,
    height: 48,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: '100%',
  },
  detailsCard: {
    marginTop: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailsIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  detailsIconFallback: {
    width: 40,
    height: 40,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsText: {
    flex: 1,
    minWidth: 0,
  },
  quantityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 28,
    textAlign: 'center',
  },
  totalLine: {
    marginTop: 2,
  },
  localError: {
    marginTop: 10,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
  },
  footerNote: {
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default LiveGiftPanel;
