import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from '../Modal';
import {Button} from '../Button';
import type {Astrologer} from './ChatRequestModal/types/index';
import {GenderSelector} from './ChatRequestModal/components/GenderSelector';
import {NameInput} from './ChatRequestModal/components/NameInput';
import {HeaderSection} from './ChatRequestModal/components/HeaderSection';
import {DatePickerInput} from './ChatRequestModal/components/DatePickerInput';
import {TimePickerInput} from './ChatRequestModal/components/TimePickerInput';
import {PlaceOfBirthInput} from './ChatRequestModal/components/PlaceOfBirthInput';
import {useProfile} from '../../services/api/profile/profile.hooks';
import {sendChatRequest} from '../../services/chat/chat.service';

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
  astrologer?: Astrologer;
  loading?: boolean;
}

type Gender = 'male' | 'female' | 'other';

export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  astrologer,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [occupation, setOccupation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {profile} = useProfile();

  const resetForm = useCallback(() => {
    setName('');
    setGender(null);
    setDateOfBirth('');
    setPlaceOfBirth('');
    setBirthTime('');
    setOccupation('');
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
    }
    if (!placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, gender, dateOfBirth, placeOfBirth]);

  const formatDate = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time: string) => {
    if (!time) return '00:00';

    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours}:${minutes}`;
  };

  const mapGender = (genderValue: Gender) => {
    switch (genderValue) {
      case 'male':
        return 'MALE';
      case 'female':
        return 'FEMALE';
      default:
        return 'OTHER';
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    if (!profile || !astrologer?.id) return;

    try {
      const result = await sendChatRequest({
        astrologerId: astrologer.id,
        userProfile: profile,
        name: name.trim(),
        gender: gender as 'male' | 'female' | 'other',
        dateOfBirth,
        placeOfBirth: placeOfBirth.trim(),
        birthTime,
        occupation: profile?.occupation,
      });

      console.log('[ChatRequestModal] Chat request result:', result);

      if (result.success) {
        onSubmit({
          name,
          gender: gender!,
          dateOfBirth,
          placeOfBirth,
          birthTime,
        });
        handleClose();
      } else {
        console.log('[ChatRequestModal] Chat request failed:', result.error);
      }
    } catch (err) {
      console.log('❌ CHAT REQUEST FAILED:', err);
    }
  }, [
    validate,
    profile,
    astrologer,
    name,
    gender,
    dateOfBirth,
    placeOfBirth,
    birthTime,
    onSubmit,
    handleClose,
  ]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      showBackdrop={true}
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <HeaderSection astrologer={astrologer} onClose={handleClose} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, {color: colors.text.secondary}]}>
          Please provide your birth details for accurate readings
        </Text>

        <NameInput value={name} onChangeText={setName} error={errors.name} />

        <GenderSelector
          value={gender}
          onSelect={setGender}
          error={errors.gender}
        />

        {/* <OccupationInput value={occupation} onChangeText={setOccupation} /> */}

        <DatePickerInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          error={errors.dateOfBirth}
        />

        <PlaceOfBirthInput
          value={placeOfBirth}
          onChangeText={setPlaceOfBirth}
          error={errors.placeOfBirth}
        />

        <TimePickerInput value={birthTime} onChangeText={setBirthTime} />
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
    maxHeight: '95%',
    paddingBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  subtitle: {
    marginBottom: 16,
    lineHeight: 20,
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
