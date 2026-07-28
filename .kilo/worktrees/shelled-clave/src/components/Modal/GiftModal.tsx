/**
 * GiftModal Component
 * Modal to display special offers, gifts, and bonuses to users
 */

import React, {useMemo} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {GiftModalProps} from './modalType';

const getOfferIcon = (offerType?: string) => {
  switch (offerType) {
    case 'bonus':
      return 'card-giftcard';
    case 'discount':
      return 'local-offer';
    case 'free':
      return 'star';
    case 'coins':
      return 'monetization-on';
    default:
      return 'card-giftcard';
  }
};

const getOfferColor = (offerType?: string, colors?: any) => {
  switch (offerType) {
    case 'bonus':
      return colors?.common?.purple?.[500] || '#9C27B0';
    case 'discount':
      return colors?.common?.orange?.[500] || '#FF9800';
    case 'free':
      return colors?.common?.green?.[500] || '#4CAF50';
    case 'coins':
      return colors?.common?.yellow?.[600] || '#FDD835';
    default:
      return colors?.primary?.main || '#6200EE';
  }
};

const getOfferBackgroundColor = (offerType?: string, colors?: any) => {
  const color = getOfferColor(offerType, colors);
  return color + '20';
};

export const GiftModal: React.FC<GiftModalProps> = ({
  visible,
  onClose,
  onClaim,
  title = 'Special Offer! 🎁',
  description = 'We have a special gift for you! Claim your bonus and enjoy exclusive benefits.',
  offerAmount = '100',
  offerType = 'bonus',
  claimButtonText = 'Claim Now',
  showLaterButton = true,
  onLaterPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const offerIcon = useMemo(() => getOfferIcon(offerType), [offerType]);
  const offerColor = useMemo(
    () => getOfferColor(offerType, colors),
    [offerType, colors],
  );
  const offerBackgroundColor = useMemo(
    () => getOfferBackgroundColor(offerType, colors),
    [offerType, colors],
  );

  const formattedAmount = useMemo(() => {
    if (typeof offerAmount === 'number') {
      return offerType === 'discount' ? `${offerAmount}%` : `₹${offerAmount}`;
    }
    return offerAmount;
  }, [offerAmount, offerType]);

  const handleClaim = () => {
    onClaim?.();
    onClose();
  };

  const handleLater = () => {
    onLaterPress?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      animationType="slide"
      dismissOnBackdropPress={true}
      showCloseButton={true}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        {/* Gift Icon Container */}
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: offerBackgroundColor},
          ]}>
          <Icon
            name={offerIcon}
            size={56}
            color={offerColor}
            library="MaterialIcons"
          />
        </View>

        {/* Offer Amount Badge */}
        <View style={[styles.offerBadge, {backgroundColor: offerColor}]}>
          <Text variant="h6" weight="bold" style={{color: colors.common.white}}>
            {formattedAmount}
          </Text>
          {offerType === 'bonus' && (
            <Text
              variant="captionSmall"
              style={{color: colors.common.white, marginTop: 2}}>
              BONUS
            </Text>
          )}
        </View>

        {/* Title */}
        <Text
          variant="h5"
          weight="bold"
          style={[styles.title, {color: colors.text.primary}]}>
          {title}
        </Text>

        {/* Description */}
        <Text
          variant="body"
          style={[styles.description, {color: colors.text.secondary}]}>
          {description}
        </Text>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              style={[styles.featureText, {color: colors.text.primary}]}>
              Instant credit to wallet
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              style={[styles.featureText, {color: colors.text.primary}]}>
              Valid for 7 days
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              style={[styles.featureText, {color: colors.text.primary}]}>
              Applicable on all services
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={claimButtonText}
            variant="primary"
            size="large"
            onPress={handleClaim}
            style={styles.claimButton}
            leftIcon={
              <Icon
                name="celebration"
                size={20}
                color={colors.primary.contrastText}
                library="MaterialIcons"
              />
            }
          />

          {showLaterButton && (
            <Button
              title="Maybe Later"
              variant="ghost"
              size="medium"
              onPress={handleLater || onClose}
              style={styles.laterButton}
            />
          )}
        </View>

        {/* Terms Text */}
        <Text
          variant="captionSmall"
          style={[styles.termsText, {color: colors.text.tertiary}]}>
          *Offer valid for new users only. Terms and conditions apply.
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 16,
    marginVertical: Platform.OS === 'ios' ? 40 : 20,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
    zIndex: 1,
  },
  offerBadge: {
    position: 'absolute',
    top: 70,
    right: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  featureText: {
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  claimButton: {
    width: '100%',
    marginBottom: 12,
  },
  laterButton: {
    marginTop: 4,
  },
  termsText: {
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default GiftModal;
