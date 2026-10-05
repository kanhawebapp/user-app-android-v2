import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Button} from '../../../../../components/Button';
import {Icon, Modal} from '../../../../../components';
import {Coupon} from '../../../../../services/api/coupon/coupon.types';
import {
  getCouponApplicableLabel,
  getCouponDiscountLabel,
  getCouponMaxDiscountLabel,
  getCouponMinOrderLabel,
  getCouponTypeLabel,
} from '../../../../../services/api/coupon/coupon.utils';

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  /** Coupons already filtered by the parent for the active payment flow. */
  coupons: Coupon[];
  loading: boolean;
  hasError: boolean;
  /** Code of the currently applied coupon, if any. */
  appliedCode?: string;
  onSelectCoupon: (coupon: Coupon) => void;
  onApplyManualCode: (code: string) => void;
  onRetry: () => void;
}

const CouponMetaRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <Text variant="caption" weight="medium" style={{color}}>
    {`${label}: ${value}`}
  </Text>
);

const renderCoupon = (
  coupon: Coupon,
  isApplied: boolean,
  colors: any,
  onPress: () => void,
) => {
  const discountLabel = getCouponDiscountLabel(coupon);
  const typeLabel = getCouponTypeLabel(coupon);
  const maxDiscountLabel = getCouponMaxDiscountLabel(coupon);
  const minOrderLabel = getCouponMinOrderLabel(coupon);
  const applicableLabel = getCouponApplicableLabel(coupon);

  return (
    <View
      style={[
        styles.couponItem,
        {
          backgroundColor: colors.background.primary,
          borderColor: isApplied ? colors.success.main : colors.border.light,
        },
      ]}>
      <View style={styles.couponItemHeader}>
        <Text
          variant="h6"
          weight="bold"
          numberOfLines={1}
          style={[styles.couponCode, {color: colors.text.primary}]}>
          {coupon.code}
        </Text>

        <View
          style={[
            styles.couponTypeBadge,
            {backgroundColor: colors.primary.light},
          ]}>
          <Text
            variant="captionSmall"
            weight="semibold"
            style={{color: colors.primary.main}}>
            {typeLabel}
          </Text>
        </View>
      </View>

      {!!coupon.description && (
        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={[styles.couponDescription, {color: colors.text.secondary}]}>
          {coupon.description}
        </Text>
      )}

      <Text
        variant="h6"
        weight="bold"
        style={[styles.couponDiscount, {color: colors.primary.main}]}>
        {discountLabel}
      </Text>

      <View style={styles.couponMeta}>
        {!!maxDiscountLabel && (
          <CouponMetaRow
            label="Maximum discount"
            value={maxDiscountLabel}
            color={colors.text.tertiary}
          />
        )}

        {!!minOrderLabel && (
          <CouponMetaRow
            label="Minimum order"
            value={minOrderLabel}
            color={colors.text.tertiary}
          />
        )}

        {!!applicableLabel && (
          <CouponMetaRow
            label="Applicable"
            value={applicableLabel}
            color={colors.text.tertiary}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.couponApplyButton,
          isApplied
            ? {backgroundColor: colors.success.background}
            : {backgroundColor: colors.primary.main},
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={
          isApplied
            ? `Change coupon to ${coupon.code}`
            : `Apply coupon ${coupon.code}`
        }>
        <Text
          variant="label"
          weight="semibold"
          style={{
            color: isApplied
              ? colors.success.dark
              : colors.primary.contrastText,
          }}>
          {isApplied ? 'Applied' : 'Apply'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Bottom sheet listing the coupons returned by `GetCoupons`, plus a manual
 * coupon code entry that always stays available.
 *
 * The sheet is presentational: filtering, minimum order validation and all
 * state changes are handled by `PaymentScreen`.
 */
export const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  onClose,
  coupons,
  loading,
  hasError,
  appliedCode,
  onSelectCoupon,
  onApplyManualCode,
  onRetry,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  console.log('CouponModal rendered with props:', {
    visible,
    coupons,
    loading,
    hasError,
    appliedCode,
  });
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (!visible) {
      setManualCode('');
    }
  }, [visible]);

  const handleApplyManualCode = () => {
    onApplyManualCode(manualCode.trim().toUpperCase());
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />

          <Text
            variant="body"
            weight="medium"
            style={[styles.stateText, {color: colors.text.secondary}]}>
            Loading coupons...
          </Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.stateContainer}>
          <Icon
            name="cloud-offline-outline"
            library="Ionicons"
            size={28}
            color={colors.error.main}
          />

          <Text
            variant="body"
            weight="medium"
            align="center"
            style={[styles.stateText, {color: colors.text.secondary}]}>
            Unable to load coupons. Please try again.
          </Text>

          <Button
            title="Retry"
            variant="outline"
            size="small"
            onPress={onRetry}
          />
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Icon
          name="ticket-outline"
          library="Ionicons"
          size={28}
          color={colors.text.tertiary}
        />

        <Text
          variant="body"
          weight="medium"
          align="center"
          style={[styles.stateText, {color: colors.text.secondary}]}>
          No coupons available
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      animationType="fade"
      dismissOnBackdropPress
      avoidKeyboard
      contentStyle={styles.modalContent}
      accessibilityLabel="Apply coupon">
      <View style={styles.container}>
        {/* Local header: keeps the title centered and the close button pinned
            to the top-right without overlapping it. */}
        <View style={[styles.header, {borderBottomColor: colors.divider}]}>
          <View style={styles.headerSide} />

          <Text
            variant="h5"
            weight="semibold"
            align="center"
            style={[styles.headerTitle, {color: colors.text.primary}]}>
            Apply Coupon
          </Text>

          <TouchableOpacity
            style={styles.headerSide}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close coupon list"
            testID="coupon-modal-close">
            <Icon
              name="close"
              library="Ionicons"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Manual coupon entry - always available, even with no coupons. */}
        <View style={[styles.manualEntry, {borderBottomColor: colors.divider}]}>
          <Text
            variant="caption"
            weight="semibold"
            style={{color: colors.text.tertiary}}>
            Have a coupon?
          </Text>

          <View style={styles.manualRow}>
            <TextInput
              style={[
                styles.manualInput,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.light,
                  backgroundColor: colors.common.white,
                },
              ]}
              value={manualCode}
              onChangeText={setManualCode}
              onSubmitEditing={handleApplyManualCode}
              placeholder="Enter coupon code"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              editable={!loading}
              maxLength={32}
              testID="coupon-manual-input"
            />

            <TouchableOpacity
              style={[
                styles.manualApplyButton,
                {backgroundColor: colors.primary.main},
              ]}
              onPress={handleApplyManualCode}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Apply entered coupon code"
              testID="coupon-manual-apply">
              <Text
                variant="label"
                weight="semibold"
                style={{color: colors.primary.contrastText}}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={coupons}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => {
            const isApplied =
              (item.code || '').trim().toUpperCase() ===
              (appliedCode || '').trim().toUpperCase();

            return renderCoupon(item, isApplied, colors, () =>
              onSelectCoupon(item),
            );
          }}
          ListEmptyComponent={renderEmptyState()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    maxHeight: '85%',
    padding: 0,
  },
  container: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  stateText: {
    maxWidth: 260,
  },
  couponItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  couponItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  couponCode: {
    flex: 1,
    letterSpacing: 0.5,
  },
  couponTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  couponDescription: {
    marginTop: 2,
  },
  couponDiscount: {
    marginTop: 2,
  },
  couponMeta: {
    marginTop: 2,
    gap: 2,
  },
  couponApplyButton: {
    marginTop: 10,
    minHeight: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualEntry: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  manualApplyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CouponModal;
