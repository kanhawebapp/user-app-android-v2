import React, {useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {RatingModalProps} from './modalType';

const MAX_RATING = 5;

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  astrologerName = 'Astrologer',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback.trim() || undefined);
      setRating(0);
      setFeedback('');
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    onClose();
  };

  const getStarColor = (index: number) => {
    const currentRating = hoverRating || rating;
    return index <= currentRating ? colors.warning.main : colors.text.disabled;
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({length: MAX_RATING}, (_, index) => {
          const starIndex = index + 1;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleRatingPress(starIndex)}
              onPressIn={() => setHoverRating(starIndex)}
              onPressOut={() => setHoverRating(0)}
              style={styles.starButton}
              accessibilityLabel={`Rate ${starIndex} stars`}
              accessibilityRole="button">
              <Icon
                name={
                  starIndex <= (hoverRating || rating) ? 'star' : 'star-border'
                }
                size={40}
                color={getStarColor(starIndex)}
                library="MaterialIcons"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const ratingLabels = useMemo(() => {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[rating] || '';
  }, [rating]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      animationType="slide"
      dismissOnBackdropPress={false}
      showCloseButton={true}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        <Text
          variant="h5"
          weight="bold"
          style={[styles.title, {color: colors.text.primary}]}>
          Rate Your Experience
        </Text>

        <Text
          variant="body"
          style={[styles.subtitle, {color: colors.text.secondary}]}>
          Share your feedback (optional)
        </Text>

        {renderStars()}

        {rating > 0 && (
          <Text
            variant="body"
            weight="medium"
            style={[styles.ratingLabel, {color: colors.primary.main}]}>
            {ratingLabels}
          </Text>
        )}

        <View style={styles.feedbackContainer}>
          <TextInput
            style={[
              styles.feedbackInput,
              {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: colors.border.default,
              },
            ]}
            placeholder="Tell us about your experience..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={rating === 0}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 16,
    marginVertical: 40,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    marginBottom: 16,
  },
  feedbackContainer: {
    width: '100%',
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
  },
});

export default RatingModal;
