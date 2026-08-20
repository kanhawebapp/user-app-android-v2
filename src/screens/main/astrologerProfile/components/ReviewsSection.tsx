import React, {useMemo} from 'react';
import {View, StyleSheet, Text as RNText} from 'react-native';
import {format} from 'date-fns';
import {Text, useTheme} from '../../../../components';
import type {AstrologerReview} from '../../../../services/api/astrologerProfile/astrologer-details.types';

const MAX_STARS = 5;
const STAR_COLOR = '#F59E0B';
const EMPTY_STAR_COLOR = '#D1D5DB';

type ReviewsSectionProps = {
  reviews?: AstrologerReview[] | null;
};

const getReviewDate = (createdAt?: string | null): Date | null => {
  if (!createdAt) {
    return null;
  }

  const trimmed = String(createdAt).trim();
  const asNumber = Number(trimmed);
  const date =
    /^\d+$/.test(trimmed) && Number.isFinite(asNumber)
      ? new Date(asNumber)
      : new Date(trimmed);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatReviewDate = (createdAt?: string | null): string => {
  const date = getReviewDate(createdAt);
  return date ? format(date, 'dd MMM yyyy') : '';
};

const ReviewStars: React.FC<{rating: number}> = ({rating}) => {
  const filledCount = Math.min(
    MAX_STARS,
    Math.max(0, Math.round(Number(rating) || 0)),
  );

  return (
    <View style={styles.starRow}>
      {Array.from({length: MAX_STARS}, (_, index) => (
        <RNText
          key={index}
          style={[
            styles.starIcon,
            {color: index < filledCount ? STAR_COLOR : EMPTY_STAR_COLOR},
          ]}>
          ★
        </RNText>
      ))}
    </View>
  );
};

const ReviewCard: React.FC<{review: AstrologerReview}> = ({review}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const formattedDate = formatReviewDate(review.createdAt);
  const reply = review.reply?.trim();

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
          style={[styles.userName, {color: colors.text.primary}]}
          numberOfLines={1}>
          {review.userName?.trim() || 'User'}
        </Text>
        <ReviewStars rating={review.rating} />
      </View>

      {!!review.comment?.trim() && (
        <Text style={[styles.comment, {color: colors.text.secondary}]}>
          {review.comment.trim()}
        </Text>
      )}

      {!!formattedDate && (
        <Text style={[styles.date, {color: colors.text.tertiary}]}>
          {formattedDate}
        </Text>
      )}

      {!!reply && (
        <View
          style={[
            styles.replyBox,
            {
              backgroundColor: colors.primary.light,
              borderLeftColor: colors.primary.main,
            },
          ]}>
          <Text style={[styles.replyLabel, {color: colors.primary.main}]}>
            Astrologer reply
          </Text>
          <Text style={[styles.replyText, {color: colors.text.secondary}]}>
            {reply}
          </Text>
        </View>
      )}
    </View>
  );
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({reviews}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const sortedReviews = useMemo(() => {
    if (!reviews?.length) {
      return [];
    }

    return [...reviews].sort((a, b) => {
      const timeA = getReviewDate(a.createdAt)?.getTime() ?? 0;
      const timeB = getReviewDate(b.createdAt)?.getTime() ?? 0;
      return timeB - timeA;
    });
  }, [reviews]);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: colors.text.primary}]}>
        Reviews
      </Text>

      {sortedReviews.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
            },
          ]}>
          <Text style={[styles.emptyText, {color: colors.text.secondary}]}>
            No reviews yet
          </Text>
        </View>
      ) : (
        sortedReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  userName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    marginLeft: 1,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  replyBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});

export default ReviewsSection;
