import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { useCreateServiceBooking } from '../../../services/api/healingServices/serviceBooking/useServiceBooking';
import { GoBack } from '../../../components';
import { useToast } from '../../../context/ToastContext';

interface BookingFormScreenProps {
  service: {
    id: string;
    name: string;
    price: number;
    category?: {
      name: string;
    };
  } | null;
  onBack: () => void;
  onSubmit: (response: any) => void;
}

export interface BookingFormData {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  tob: string;
  pob: string;
  gender: string;
  concern: string;
}

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  // { label: 'Other', value: 'other' },
];

const BookingFormScreen: React.FC<BookingFormScreenProps> = ({
  service,
  onBack,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    name: '',
    email: '',
    phone: '',
    dob: '',
    tob: '',
    pob: '',
    gender: '',
    concern: '',
  });

  const { showSuccess, showError } = useToast();

  const { submitBooking, loading } = useCreateServiceBooking();

  useEffect(() => {
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceId: service.id,
      }));
    }
  }, [service]);

  const updateField = (key: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateAndSubmit = async () => {
    const values = Object.values(formData);
    const hasEmpty = values.some(item => !String(item).trim());

    if (hasEmpty) {
      // Alert.alert('Validation', 'Please fill all fields');
      showSuccess('Validation! Please fill all fields')
      return;
    }

    try {
      const response = await submitBooking(formData);
      onSubmit(response);
    } catch (error) {
      // console.log('Booking submit error:', error);
      showError("Booking submit error:")
    }
  };

  const renderInput = (
    label: string,
    key: keyof BookingFormData,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    multiline: boolean = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label} weight="medium">
        {label}
      </Text>
      <TextInput
        value={formData[key]}
        onChangeText={text => updateField(key, text)}
        style={[styles.input, multiline && styles.textareaInput]}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#A5A5B8"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  const renderGenderSelector = () => (
    <View style={styles.genderSelector}>
      <Text style={styles.label} weight="medium">
        Gender
      </Text>
      <View style={styles.genderChipsContainer}>
        {GENDER_OPTIONS.map(option => {
          const isSelected = formData.gender === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderChip,
                isSelected && styles.genderChipSelected,
              ]}
              onPress={() => updateField('gender', option.value)}
              activeOpacity={0.7}>
              <Text
                style={isSelected ? styles.genderChipTextSelected : styles.genderChipText}
                weight={isSelected ? 'semibold' : 'regular'}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderProgressStepper = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressSegmentActive]} />
        <View style={[styles.progressSegment, styles.progressSegmentActive]} />
        <View style={[styles.progressSegment, styles.progressSegmentInactive]} />
      </View>
      <View style={styles.progressLabelsContainer}>
        <View style={styles.progressLabelItem}>
          <Text style={styles.progressCheckmark}>✓</Text>
          <Text style={styles.progressLabel} weight="medium">
            Service Selected
          </Text>
        </View>
        <View style={styles.progressLabelItem}>
          <Text style={styles.progressCheckmark}>✓</Text>
          <Text style={styles.progressLabel} weight="medium">
            Booking Details
          </Text>
        </View>
        <View style={styles.progressLabelItem}>
          <Text style={styles.progressDot}>○</Text>
          <Text style={styles.progressLabel} weight="medium">
            Astrologer Selection
          </Text>
        </View>
      </View>
    </View>
  );

  const renderServiceSummaryCard = () => {
    if (!service) {
      return null;
    }
    return (
      <View style={styles.card}>
        <View style={styles.serviceCardHeader}>
          <View style={styles.serviceIconContainer}>
            <Text style={styles.serviceIcon}>✦</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName} weight="semibold">
              {service.name}
            </Text>
            {service.category && (
              <Text style={styles.serviceCategory} weight="medium">
                {service.category.name}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.servicePriceContainer}>
          <Text style={styles.servicePriceLabel} weight="regular">
            Service Price
          </Text>
          <Text style={styles.servicePriceValue} weight="semibold">
            ₹{service.price}
          </Text>
        </View>
      </View>
    );
  };

  const renderFormSection = (title: string, children: React.ReactNode) => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle} weight="semibold">
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GoBack onBack={onBack} titleAlign="left" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} weight="semibold">
            Booking Details
          </Text>
          <Text style={styles.headerSubtitle} weight="regular">
            Step 2 of 3
          </Text>
        </View>
      </View>

      {renderProgressStepper()}

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {renderServiceSummaryCard()}

        {renderFormSection('Personal Information', (
          <>
            {renderInput('Full Name', 'name')}
            {renderInput('Email', 'email', 'email-address')}
            {renderInput('Phone', 'phone', 'phone-pad')}
          </>
        ))}

        {renderFormSection('Birth Information', (
          <>
            {renderInput('Date of Birth', 'dob')}
            {renderInput('Time of Birth', 'tob')}
            {renderInput('Place of Birth', 'pob')}
            {renderGenderSelector()}
          </>
        ))}

        {renderFormSection('Concern Details', (
          <>
            {renderInput('Concern', 'concern', 'default', true)}
          </>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerTotalLabel} weight="regular">
            Total Amount
          </Text>
          <Text style={styles.footerPrice} weight="semibold">
            ₹{service?.price || 0}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={validateAndSubmit}
          disabled={loading}
          activeOpacity={loading ? 1 : 0.8}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText} weight="medium">
                Processing...
              </Text>
            </View>
          ) : (
            <Text style={styles.submitText} weight="semibold">
              Continue to Astrologer Selection
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#1F1F2E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B6B80',
    marginTop: 2,
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary.main,
  },
  progressSegmentInactive: {
    backgroundColor: '#E5E5E5',
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressCheckmark: {
    fontSize: 16,
    color: colors.primary.main,
    marginBottom: 4,
  },
  progressDot: {
    fontSize: 16,
    color: '#A5A5B8',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1F1F2E',
    marginBottom: 16,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceIcon: {
    fontSize: 24,
    color: colors.primary.main,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    color: '#1F1F2E',
  },
  serviceCategory: {
    fontSize: 13,
    color: colors.primary.main,
    marginTop: 4,
  },
  servicePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  servicePriceLabel: {
    fontSize: 14,
    color: '#6B6B80',
  },
  servicePriceValue: {
    fontSize: 22,
    color: '#22A45D',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F1F2E',
  },
  textareaInput: {
    minHeight: 100,
    paddingVertical: 16,
  },
  genderSelector: {
    marginBottom: 16,
  },
  genderChipsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  genderChip: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSelected: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  genderChipText: {
    fontSize: 14,
    color: '#444',
  },
  genderChipTextSelected: {
    fontSize: 14,
    color: colors.primary.main,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  footerLeft: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: '#6B6B80',
  },
  footerPrice: {
    fontSize: 20,
    color: '#22A45D',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default BookingFormScreen;