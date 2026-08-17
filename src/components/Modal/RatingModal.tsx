import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '../../theme';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {RatingModalProps} from './modalType';
import {useCreateReview} from '../../services/api/submitReview/useCreateReview';
import {useChatStore} from '../../stores/chat.store';
const MAX_RATING = 5;

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  astrologerName = 'Astrologer',
  userName,
  astrologerId,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setRating(0);
    setFeedback('');
    setHoverRating(0);
    setIsSubmitting(false);
  };
  // console.log('ASTROLOGER ID FROM MODAL =>', astrologerId);

  // const store = useChatStore.getState();

  // const astroId =
  //   store.queueData?.astrologerId || store.chatRoom?.astrologerId;
  // console.log('ASTROLOGER ID FROM STORE =>', astroId);

  const handleSubmit = async () => {
    if (!rating || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(astrologerId, rating, feedback);
      resetState();
    } catch {
      setIsSubmitting(false);
    }
  };

  // const { submitReview, loading } = useCreateReview();

  // const handleSubmitReview = async () => {
  //   try {
  //     const response = await submitReview({
  //       astro_id: astrologerId,
  //       star: rating,
  //       comment: feedback,
  //       user_name: userName,
  //       astro_name: astrologerName,
  //     });

  //     console.log('REVIEW SUCCESS:', response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const currentRating = hoverRating || rating;

  const ratingLabels = useMemo(
    () => ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    [],
  );

  const renderStars = () => (
    <View style={styles.starsContainer}>
      {Array.from({length: MAX_RATING}, (_, i) => {
        const index = i + 1;
        const active = index <= currentRating;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index)}
            onPressIn={() => setHoverRating(index)}
            onPressOut={() => setHoverRating(0)}
            activeOpacity={0.7}
            style={styles.starButton}>
            <Icon
              name={active ? 'star' : 'star-border'}
              size={44}
              color={active ? colors.warning.main : colors.text.disabled}
              library="MaterialIcons"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      {/*BACKGROUND BLUR */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={theme.isDark ? 'dark' : 'light'}
        blurAmount={12}
      />

      {/*OVERLAY CENTER */}
      <View style={styles.overlay}>
        <View
          style={[styles.card, {backgroundColor: colors.background.primary}]}>
          {/* TITLE */}
          <Text
            variant="h4"
            weight="bold"
            style={[styles.title, {color: colors.text.primary}]}>
            Rate your experience
          </Text>

          <Text
            variant="body"
            style={[styles.subtitle, {color: colors.text.secondary}]}>
            How was your session with {astrologerName}?
          </Text>

          {/* STARS */}
          {renderStars()}

          {/* LABEL */}
          {currentRating > 0 && (
            <Text
              variant="body"
              weight="semibold"
              style={[styles.ratingLabel, {color: colors.primary.main}]}>
              {ratingLabels[currentRating]}
            </Text>
          )}

          {/* INPUT */}
          <TextInput
            placeholder="Write your feedback (optional)"
            placeholderTextColor={colors.text.tertiary}
            multiline
            value={feedback}
            onChangeText={setFeedback}
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                borderColor: 'gray',
                color: colors.text.primary,
              },
            ]}
          />

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={{flex: 1}}
            />

            <Button
              title="Submit"
              variant="primary"
              onPress={handleSubmit}
              disabled={!rating || isSubmitting}
              loading={isSubmitting}
              style={{flex: 1}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,

    //Premium Shadow
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
  },

  title: {
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },

  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },

  starButton: {
    marginHorizontal: 6,
  },

  ratingLabel: {
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    minHeight: 100,
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
