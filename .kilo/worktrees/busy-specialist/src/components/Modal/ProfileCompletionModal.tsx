/**
 * Profile Completion Modal
 * Just-in-time modal to collect missing profile fields when user tries to use specific features
 */

import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Modal} from '../Modal';
import {Text} from '../Text';
import {Button} from '../Button';
import {InputBox} from '../InputBox';
import {Icon} from '../Icon';
import {useProfileStore} from '../../stores';
import type {
  ProfileFieldKey,
  ProfileField,
  PendingProfileRequest,
} from '../../types/profile.types';
import {PROFILE_FIELDS} from '../../types/profile.types';

interface ProfileCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Get profile store state and actions
  const {
    currentRequest,
    isUpdating,
    updateProfileFields,
    dismissProfileRequest,
    completeProfileRequest,
  } = useProfileStore();

  // Local form state
  const [formData, setFormData] = useState<Record<ProfileFieldKey, string>>({
    name: '',
    email: '',
    dateOfBirth: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    languagePreference: '',
  });

  const [errors, setErrors] = useState<Record<ProfileFieldKey, string>>(
    {} as any,
  );

  // Get fields to display based on current request
  const fieldsToDisplay = useMemo((): ProfileField[] => {
    if (!currentRequest) return [];

    const allFields = [
      ...currentRequest.requiredFields,
      ...currentRequest.optionalFields,
    ];
    return PROFILE_FIELDS.filter(field => allFields.includes(field.key));
  }, [currentRequest]);

  // Get feature display name
  const featureDisplayName = useMemo((): string => {
    if (!currentRequest) return '';

    const featureNames: Record<string, string> = {
      kundli: 'Kundli',
      matchmaking: 'Matchmaking',
      chat: 'Chat',
      call: 'Call',
      live: 'Live',
      remedies: 'Remedies',
      wallet: 'Wallet',
      profile_edit: 'Profile',
    };

    return featureNames[currentRequest.feature] || currentRequest.feature;
  }, [currentRequest]);

  // Reset form when modal opens with new request
  useEffect(() => {
    if (visible && currentRequest) {
      // Pre-fill with existing user data if available
      setFormData({
        name: '',
        email: '',
        dateOfBirth: '',
        birthTime: '',
        birthPlace: '',
        gender: '',
        languagePreference: '',
      });
      setErrors({} as any);
    }
  }, [visible, currentRequest]);

  // Handle input change
  const handleInputChange = useCallback(
    (field: ProfileFieldKey, value: string) => {
      setFormData(prev => ({...prev, [field]: value}));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [errors],
  );

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<ProfileFieldKey, string> = {} as any;
    let isValid = true;

    fieldsToDisplay.forEach(field => {
      const value = formData[field.key];

      // Check required fields
      if (field.required && (!value || value.trim().length === 0)) {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      }

      // Validate text length
      if (value && field.validation) {
        if (
          field.validation.minLength &&
          value.length < field.validation.minLength
        ) {
          newErrors[field.key] =
            field.validation.errorMessage ||
            `Minimum ${field.validation.minLength} characters required`;
          isValid = false;
        }
        if (
          field.validation.maxLength &&
          value.length > field.validation.maxLength
        ) {
          newErrors[field.key] =
            field.validation.errorMessage ||
            `Maximum ${field.validation.maxLength} characters allowed`;
          isValid = false;
        }
        if (field.validation.pattern && !field.validation.pattern.test(value)) {
          newErrors[field.key] =
            field.validation.errorMessage || 'Invalid format';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, fieldsToDisplay]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await updateProfileFields(formData);
      completeProfileRequest();
      onComplete();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }, [
    validateForm,
    formData,
    updateProfileFields,
    completeProfileRequest,
    onComplete,
  ]);

  // Handle skip/dismiss
  const handleSkip = useCallback(() => {
    dismissProfileRequest();
    onClose();
  }, [dismissProfileRequest, onClose]);

  // Render input field based on type
  const renderField = useCallback(
    (field: ProfileField) => {
      const value = formData[field.key];
      const error = errors[field.key];

      if (field.type === 'select' && field.options) {
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text
              variant="bodySmall"
              color={colors.text.secondary}
              style={styles.fieldLabel}>
              {field.label}
              {field.required && <Text color={colors.error.main}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    value === option.value && {
                      backgroundColor: colors.primary.main + '20',
                      borderColor: colors.primary.main,
                    },
                  ]}
                  onPress={() => handleInputChange(field.key, option.value)}>
                  <Text
                    variant="body"
                    color={
                      value === option.value
                        ? colors.primary.main
                        : colors.text.primary
                    }
                    style={styles.selectOptionText}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {error && (
              <Text
                variant="caption"
                color={colors.error.main}
                style={styles.errorText}>
                {error}
              </Text>
            )}
          </View>
        );
      }

      return (
        <View key={field.key} style={styles.fieldContainer}>
          <InputBox
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={text => handleInputChange(field.key, text)}
            error={error}
            required={field.required}
            keyboardType={field.type === 'email' ? 'email-address' : 'default'}
            autoCapitalize={field.type === 'email' ? 'none' : 'words'}
            size="large"
          />
        </View>
      );
    },
    [formData, errors, colors, handleInputChange],
  );

  return (
    <Modal
      visible={visible}
      onClose={handleSkip}
      animationType="slide"
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.primary.main + '20'},
            ]}>
            <Icon
              name="person-add"
              size={32}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          </View>
          <Text variant="h5" weight="bold" style={styles.title}>
            Complete Your Profile
          </Text>
          <Text
            variant="body"
            color={colors.text.secondary}
            style={styles.subtitle}>
            {currentRequest?.reason || 'We need some information to proceed'}
          </Text>
        </View>

        {/* Form Fields */}
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {fieldsToDisplay.map(renderField)}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Skip for now"
            variant="outline"
            onPress={handleSkip}
            style={styles.skipButton}
            disabled={isUpdating}
          />
          <Button
            title="Continue"
            variant="primary"
            onPress={handleSubmit}
            style={styles.continueButton}
            loading={isUpdating}
            disabled={isUpdating}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 16,
    marginVertical: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    maxHeight: 350,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  selectOptionText: {
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  skipButton: {
    flex: 1,
  },
  continueButton: {
    flex: 1,
  },
});

export default ProfileCompletionModal;
