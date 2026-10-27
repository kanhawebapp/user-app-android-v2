import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoBack } from '../../../components';
import { Text } from '../../../components/Text';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button';
import { SkeletonLoader } from '../../../components/SkeletonLoader';
import { useTheme } from '../../../theme';
import { useToast } from '../../../context/ToastContext';
import { usePujaDetails } from '../../../services/api/pujaServices/usePujaDetails';
import { useCreatePujaBooking } from '../../../services/api/pujaServices/pujaBooking/useCreatePujaBooking';
import type {
  PujaFaq,
  PujaMantraOption,
  PujaReview,
  PujaServiceDetails,
} from '../../../services/api/pujaServices/puja-services.types';
import PaymentScreen, { PujaPaymentData } from '../wallet/PaymentScreen';
import {
  formatDevoteeCount,
  formatPrice,
  formatReviewDate,
  getPujaImageUrl,
  sortMantraOptions,
} from './pujaDetails.helpers';

const STAR_COLOR = '#FFB300';
const EMPTY_STAR_COLOR = '#D1D5DB';
const MAX_STARS = 5;
const GST_PERCENTAGE = 18;

type PujaServiceDetailsRouteParams = {
  slug?: string;
};

/** Payload ready for a future puja checkout / booking API. */
export type PujaCheckoutPayload = {
  puja: Pick<
    PujaServiceDetails,
    'id' | 'title' | 'slug' | 'price' | 'mrp' | 'discount'
  >;
  mantraOption: PujaMantraOption | null;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  totalPrice: number;
};

const StarRating: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 14,
}) => {
  const filledCount = Math.min(
    MAX_STARS,
    Math.max(0, Math.round(Number(rating) || 0)),
  );

  return (
    <View style={styles.starRow}>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <RNText
          key={index}
          style={{
            color: index < filledCount ? STAR_COLOR : EMPTY_STAR_COLOR,
            fontSize: size,
            lineHeight: size + 2,
          }}>
          ★
        </RNText>
      ))}
    </View>
  );
};

const ExpandableSection: React.FC<{
  title: string;
  content?: string | null;
  expanded: boolean;
  onToggle: () => void;
}> = ({ title, content, expanded, onToggle }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const body = content?.trim();

  if (!body) {
    return null;
  }

  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.light,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={styles.sectionHeader}>
        <Text
          variant="label"
          weight="semibold"
          style={{ color: colors.text.primary, flex: 1, paddingRight: 12 }}>
          {title}
        </Text>
        <View
          style={[
            styles.sectionIcon,
            {
              backgroundColor: expanded
                ? colors.primary.main
                : colors.background.secondary,
            },
          ]}>
          <Icon
            library="Feather"
            name={expanded ? 'minus' : 'plus'}
            size={16}
            color={expanded ? '#fff' : colors.primary.main}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <Text
          variant="bodySmall"
          style={[styles.sectionBody, { color: colors.text.secondary }]}>
          {body}
        </Text>
      )}
    </View>
  );
};

const FaqSection: React.FC<{ faqs: PujaFaq[] }> = ({ faqs }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!faqs.length) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text
        variant="h6"
        weight="semibold"
        style={{ color: colors.text.primary, marginBottom: 12 }}>
        FAQ's
      </Text>
      {faqs.map(faq => {
        const expanded = expandedId === faq.id;
        return (
          <View
            key={faq.id}
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.light,
                borderLeftWidth: expanded ? 4 : 1,
                borderLeftColor: expanded
                  ? colors.primary.main
                  : colors.border.light,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setExpandedId(prev => (prev === faq.id ? null : faq.id))
              }
              style={styles.sectionHeader}>
              <Text
                variant="label"
                weight="semibold"
                style={{
                  color: expanded ? colors.primary.main : colors.text.primary,
                  flex: 1,
                  paddingRight: 12,
                }}>
                {faq.question}
              </Text>
              <View
                style={[
                  styles.sectionIcon,
                  {
                    backgroundColor: expanded
                      ? colors.primary.main
                      : colors.background.secondary,
                  },
                ]}>
                <Icon
                  library="Feather"
                  name={expanded ? 'minus' : 'plus'}
                  size={16}
                  color={expanded ? '#fff' : colors.primary.main}
                />
              </View>
            </TouchableOpacity>
            {expanded && !!faq.answer?.trim() && (
              <Text
                variant="bodySmall"
                style={[styles.sectionBody, { color: colors.text.secondary }]}>
                {faq.answer.trim()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const ReviewItem: React.FC<{ review: PujaReview }> = ({ review }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const dateText = formatReviewDate(review.createdAt);

  return (
    <View
      style={[
        styles.reviewCard,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}>
      <View style={styles.reviewHeader}>
        <Text
          weight="semibold"
          style={{ color: colors.text.primary, flex: 1 }}
          numberOfLines={1}>
          {review.userName?.trim() || 'User'}
        </Text>
        <StarRating rating={review.rating} size={12} />
      </View>
      {!!review.comment?.trim() && (
        <Text
          variant="bodySmall"
          style={{ color: colors.text.secondary, marginTop: 8 }}>
          {review.comment.trim()}
        </Text>
      )}
      {!!dateText && (
        <Text
          variant="caption"
          style={{ color: colors.text.tertiary, marginTop: 8 }}>
          {dateText}
        </Text>
      )}
    </View>
  );
};

const DetailsSkeleton: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.skeletonContainer}>
      <SkeletonLoader
        width="100%"
        height={280}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={styles.skeletonBody}>
        <SkeletonLoader
          width="70%"
          height={22}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width="100%"
          height={14}
          style={{ marginTop: 12 }}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width="90%"
          height={14}
          style={{ marginTop: 8 }}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width="40%"
          height={20}
          style={{ marginTop: 16 }}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width="100%"
          height={72}
          style={{ marginTop: 20 }}
          borderRadius={12}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width="100%"
          height={72}
          style={{ marginTop: 12 }}
          borderRadius={12}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>
    </View>
  );
};

const PujaServiceDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { showError } = useToast();

  const { slug } = (route.params as PujaServiceDetailsRouteParams) || {};
  const { service, loading, error, refresh } = usePujaDetails(slug);
  const {
    loading: isBooking,
    submitBooking,
    resetBooking,
  } = useCreatePujaBooking();

  const mantraOptions = useMemo(
    () => sortMantraOptions(service?.mantraOptions),
    [service?.mantraOptions],
  );

  const [selectedMantraId, setSelectedMantraId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [pujaPaymentData, setPujaPaymentData] =
    useState<PujaPaymentData | null>(null);

  useEffect(() => {
    setQuantity(1);
    setExpandedSection(null);
    setSelectedMantraId(mantraOptions[0]?.id ?? null);
  }, [slug, mantraOptions]);

  // Drop any in-progress booking/payment when navigating to a different puja.
  useEffect(() => {
    setPujaPaymentData(null);
    resetBooking();
  }, [slug, resetBooking]);

  const selectedMantra = useMemo(
    () => mantraOptions.find(option => option.id === selectedMantraId) ?? null,
    [mantraOptions, selectedMantraId],
  );

  const unitPrice = selectedMantra
    ? Number(selectedMantra.offerPrice)
    : Number(service?.price);
  const originalUnitPrice = selectedMantra
    ? Number(selectedMantra.originalPrice)
    : Number(service?.mrp);
  const displayUnitPrice = Number.isFinite(unitPrice) ? unitPrice : 0;
  const displayOriginalPrice = Number.isFinite(originalUnitPrice)
    ? originalUnitPrice
    : 0;
  const totalPrice = displayUnitPrice * quantity;
  const discountAmount = displayOriginalPrice - displayUnitPrice;
  const discountPercentage =
    displayOriginalPrice > 0 && discountAmount > 0
      ? Math.round((discountAmount / displayOriginalPrice) * 100)
      : 0;
  const discountLabel =
    discountPercentage > 0 ? `${discountPercentage}% OFF` : '';
  const reviews = service?.reviews ?? [];
  const reviewCount = reviews.length;
  const imageUrl = getPujaImageUrl(service?.image);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const decreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const toggleSection = useCallback((key: string) => {
    setExpandedSection(prev => (prev === key ? null : key));
  }, []);

  const handlePaymentBack = useCallback(() => {
    // Keep the details selection; drop payment context so a new Buy It Now
    // creates a fresh booking instead of reusing a stale one.
    setPujaPaymentData(null);
    resetBooking();
  }, [resetBooking]);

  const handlePaymentComplete = useCallback(() => {
    setPujaPaymentData(null);
    resetBooking();
    navigation.goBack();
  }, [navigation, resetBooking]);

  /**
   * Buy It Now → CreatePujaBooking → PaymentScreen.
   * Mantra / quantity selections are preserved via the booking + payment payload.
   */
  const handleBuyNow = useCallback(async () => {
    if (isBooking) {
      return;
    }

    if (!service?.id) {
      showError('Puja details are unavailable. Please try again.');
      return;
    }

    if (mantraOptions.length > 0 && !selectedMantra?.id) {
      showError('Please select a mantra option to continue.');
      return;
    }

    if (!selectedMantra?.id) {
      showError(
        'A mantra option is required to book this puja. Please try again later.',
      );
      return;
    }

    const safeQuantity = Math.max(1, quantity);

    try {
      const booking = await submitBooking({
        pujaId: service.id,
        mantraOptionId: selectedMantra.id,
        quantity: safeQuantity,
      });

      // Duplicate in-flight request was ignored by the hook.
      if (!booking?.id) {
        return;
      }

      const amount = Number(booking.totalAmount);
      const unitPrice = Number(booking.unitPrice);

      if (!Number.isFinite(amount) || amount < 0) {
        showError('Invalid booking amount returned by the server.');
        return;
      }

      const gstAmount = Number(((amount * GST_PERCENTAGE) / 100).toFixed(2));
      const payableTotal = Number((amount + gstAmount).toFixed(2));

      const paymentData: PujaPaymentData = {
        bookingId: booking.id,
        puja: {
          id: service.id,
          title: service.title,
          slug: service.slug,
        },
        mantraOptionId: booking.mantraOptionId || selectedMantra.id,
        mantraOptionName:
          booking.mantraOptionName || selectedMantra.name || null,
        quantity: booking.quantity || safeQuantity,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : displayUnitPrice,
        amount,
        gstAmount,
        totalAmount: payableTotal,
      };

      setPujaPaymentData(paymentData);
    } catch (err: any) {
      showError(
        err?.message || 'Unable to create the puja booking. Please try again.',
      );
    }
  }, [
    isBooking,
    service,
    mantraOptions.length,
    selectedMantra,
    quantity,
    displayUnitPrice,
    submitBooking,
    showError,
  ]);

  if (pujaPaymentData) {
    return (
      <PaymentScreen
        paymentType="puja"
        pujaPayment={pujaPaymentData}
        onBack={handlePaymentBack}
        onComplete={handlePaymentComplete}
      />
    );
  }

  if (!slug) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}>
        <GoBack onBack={handleBack} title="Puja Details" />
        <View style={styles.centeredState}>
          <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>
            Missing puja reference. Please go back and select a puja.
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}>
        <GoBack onBack={handleBack} title="Puja Details" />
        <DetailsSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}>
        <GoBack onBack={handleBack} title="Puja Details" />
        <View style={styles.centeredState}>
          <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>
            Unable to load puja details. Please try again.
          </Text>
          <View style={{ marginTop: 16, width: '60%' }}>
            <Button title="Retry" onPress={refresh} />
          </View>
        </View>
      </View>
    );
  }

  if (!service) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}>
        <GoBack onBack={handleBack} title="Puja Details" />
        <View style={styles.centeredState}>
          <Text
            variant="h6"
            weight="semibold"
            style={{ color: colors.text.primary, textAlign: 'center' }}>
            Puja not found
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              textAlign: 'center',
              marginTop: 8,
            }}>
            This puja is unavailable or may have been removed.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <GoBack onBack={handleBack} title="Puja Details" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120 + Math.max(insets.bottom, 16),
        }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.heroImage,
              { backgroundColor: colors.background.secondary },
            ]}
          />
        )}

        <View style={styles.content}>
          <Text
            variant="h5"
            weight="semibold"
            style={{ color: colors.text.primary }}>
            {service.title}
          </Text>

          {!!service.shortDescription?.trim() && (
            <Text
              variant="bodySmall"
              style={{ color: colors.text.secondary, marginTop: 8 }}>
              {service.shortDescription.trim()}
            </Text>
          )}

          <View style={styles.ratingRow}>
            <StarRating rating={service.rating} />
            <Text
              variant="caption"
              style={{ color: colors.text.secondary, marginLeft: 8 }}>
              {Number.isFinite(Number(service.rating))
                ? Number(service.rating)
                : 0}{' '}
              · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text
              weight="bold"
              style={{ color: colors.primary.main, fontSize: 22 }}>
              {formatPrice(displayUnitPrice)}
            </Text>
            {displayOriginalPrice > displayUnitPrice && (
              <Text
                style={{
                  color: colors.text.secondary,
                  textDecorationLine: 'line-through',
                  marginLeft: 10,
                }}>
                {formatPrice(displayOriginalPrice)}
              </Text>
            )}
            {!!discountLabel && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountLabel}</Text>
              </View>
            )}
          </View>

          <Text
            variant="caption"
            style={{ color: colors.text.secondary, marginTop: 6 }}>
            {formatDevoteeCount(service.customersCount)}
          </Text>

          {mantraOptions.length > 0 && (
            <View style={styles.block}>
              <Text
                variant="h6"
                weight="semibold"
                style={{ color: colors.text.primary, marginBottom: 12 }}>
                Mantra Jaap
              </Text>
              {mantraOptions.map(option => {
                const selected = option.id === selectedMantraId;
                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedMantraId(option.id)}
                    style={[
                      styles.mantraCard,
                      {
                        borderColor: selected
                          ? colors.primary.main
                          : colors.border.light,
                        backgroundColor: selected
                          ? colors.primary.light
                          : colors.background.primary,
                      },
                    ]}>
                    <View style={styles.mantraRow}>
                      <View
                        style={[
                          styles.radioOuter,
                          {
                            borderColor: selected
                              ? colors.primary.main
                              : colors.border.main,
                          },
                        ]}>
                        {selected && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: colors.primary.main },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        weight="semibold"
                        style={{
                          color: colors.text.primary,
                          flex: 1,
                          paddingHorizontal: 12,
                        }}>
                        {option.name}
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text
                          weight="bold"
                          style={{ color: colors.primary.main }}>
                          {formatPrice(option.offerPrice)}
                        </Text>
                        {Number(option.originalPrice) >
                          Number(option.offerPrice) && (
                            <Text
                              variant="caption"
                              style={{
                                color: colors.text.secondary,
                                textDecorationLine: 'line-through',
                              }}>
                              {formatPrice(option.originalPrice)}
                            </Text>
                          )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.block}>
            <Text
              variant="h6"
              weight="semibold"
              style={{ color: colors.text.primary, marginBottom: 12 }}>
              Quantity
            </Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
                style={[
                  styles.quantityButton,
                  {
                    borderColor: colors.border.light,
                    opacity: quantity <= 1 ? 0.4 : 1,
                  },
                ]}
                accessibilityLabel="Decrease quantity">
                <Icon
                  library="Feather"
                  name="minus"
                  size={18}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <Text
                weight="semibold"
                style={[styles.quantityValue, { color: colors.text.primary }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={increaseQuantity}
                style={[
                  styles.quantityButton,
                  { borderColor: colors.border.light },
                ]}
                accessibilityLabel="Increase quantity">
                <Icon
                  library="Feather"
                  name="plus"
                  size={18}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.block}>
            <ExpandableSection
              title="Benefits"
              content={service.benefits}
              expanded={expandedSection === 'benefits'}
              onToggle={() => toggleSection('benefits')}
            />
            <ExpandableSection
              title="Description"
              content={service.description}
              expanded={expandedSection === 'description'}
              onToggle={() => toggleSection('description')}
            />
            <ExpandableSection
              title="How to perform?"
              content={service.howToPerform}
              expanded={expandedSection === 'howToPerform'}
              onToggle={() => toggleSection('howToPerform')}
            />
          </View>

          <FaqSection faqs={service.faqs ?? []} />

          {!!service.packaging?.trim() && (
            <View style={styles.block}>
              <ExpandableSection
                title="Packaging"
                content={service.packaging}
                expanded={expandedSection === 'packaging'}
                onToggle={() => toggleSection('packaging')}
              />
            </View>
          )}

          <View style={styles.block}>
            <Text
              variant="h6"
              weight="semibold"
              style={{ color: colors.text.primary, marginBottom: 12 }}>
              Reviews ({reviewCount})
            </Text>
            {reviewCount === 0 ? (
              <Text style={{ color: colors.text.secondary }}>No reviews yet</Text>
            ) : (
              reviews.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.light,
          },
        ]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text variant="caption" style={{ color: colors.text.secondary }}>
            Total
          </Text>
          <Text
            weight="bold"
            style={{ color: colors.primary.main, fontSize: 18 }}>
            {formatPrice(totalPrice)}
          </Text>
        </View>
        <View style={{ flex: 1.4 }}>
          <Button
            title="Buy It Now"
            onPress={handleBuyNow}
            loading={isBooking}
            disabled={isBooking}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonBody: {
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    flexWrap: 'wrap',
  },
  discountBadge: {
    marginLeft: 10,
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  block: {
    marginTop: 24,
  },
  mantraCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  mantraRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 18,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBody: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    lineHeight: 22,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default PujaServiceDetailsScreen;
