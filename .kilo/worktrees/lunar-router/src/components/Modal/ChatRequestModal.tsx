import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Icon} from '../Icon';

export interface ChatRequestData {
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
}

export interface ChatRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ChatRequestData) => void;
  astrologerName?: string;
  loading?: boolean;
}

const GENDER_OPTIONS = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'other', label: 'Other'},
] as const;

export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  astrologerName = 'Astrologer',
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    null,
  );
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setName('');
    setGender(null);
    setDateOfBirth('');
    setPlaceOfBirth('');
    setBirthTime('');
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!gender) {
      newErrors.gender = 'Please select gender';
    }
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
      newErrors.dateOfBirth = 'Use format DD/MM/YYYY';
    }
    if (!placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, gender, dateOfBirth, placeOfBirth]);

  const handleSubmit = useCallback(() => {
    if (validate()) {
      onSubmit({
        name: name.trim(),
        gender: gender!,
        dateOfBirth: dateOfBirth.trim(),
        placeOfBirth: placeOfBirth.trim(),
        birthTime: birthTime.trim(),
      });
    }
  }, [validate, onSubmit, name, gender, dateOfBirth, placeOfBirth, birthTime]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      showBackdrop={true}
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <View style={styles.header}>
        <Text
          variant="h6"
          weight="bold"
          style={[styles.headerTitle, {color: colors.text.primary}]}>
          Start Chat with {astrologerName}
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="close" size={22} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text
          variant="body2"
          style={[styles.subtitle, {color: colors.text.secondary}]}>
          Please provide your birth details for accurate readings
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text.primary}]}>
            Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: errors.name
                  ? colors.error.main
                  : colors.border.light,
              },
            ]}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.tertiary}
            value={name}
            onChangeText={setName}
          />
          {errors.name && (
            <Text style={[styles.errorText, {color: colors.error.main}]}>
              {errors.name}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text.primary}]}>
            Gender *
          </Text>
          <View style={styles.genderContainer}>
            {GENDER_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderButton,
                  {
                    backgroundColor:
                      gender === option.value
                        ? colors.primary.main
                        : colors.background.secondary,
                    borderColor:
                      gender === option.value
                        ? colors.primary.main
                        : colors.border.light,
                  },
                ]}
                onPress={() => setGender(option.value)}>
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        gender === option.value
                          ? colors.primary.contrastText
                          : colors.text.primary,
                    },
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && (
            <Text style={[styles.errorText, {color: colors.error.main}]}>
              {errors.gender}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text.primary}]}>
            Date of Birth * (DD/MM/YYYY)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: errors.dateOfBirth
                  ? colors.error.main
                  : colors.border.light,
              },
            ]}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.text.tertiary}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.dateOfBirth && (
            <Text style={[styles.errorText, {color: colors.error.main}]}>
              {errors.dateOfBirth}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text.primary}]}>
            Place of Birth *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: errors.placeOfBirth
                  ? colors.error.main
                  : colors.border.light,
              },
            ]}
            placeholder="City, State, Country"
            placeholderTextColor={colors.text.tertiary}
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
          />
          {errors.placeOfBirth && (
            <Text style={[styles.errorText, {color: colors.error.main}]}>
              {errors.placeOfBirth}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text.secondary}]}>
            Time of Birth (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: colors.border.light,
              },
            ]}
            placeholder="HH:MM AM/PM"
            placeholderTextColor={colors.text.tertiary}
            value={birthTime}
            onChangeText={setBirthTime}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="outline"
          size="large"
          onPress={handleClose}
          style={[styles.cancelButton, {borderColor: colors.border.light}]}
        />
        <Button
          title={loading ? 'Sending...' : 'Send Request'}
          variant="primary"
          size="large"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    maxHeight: '90%',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 400,
  },
  subtitle: {
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1.5,
  },
});

export default ChatRequestModal;
