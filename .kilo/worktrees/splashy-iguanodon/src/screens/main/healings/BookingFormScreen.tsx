import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';

interface BookingFormScreenProps {
  service: {
    id: string;
    name: string;
    price: number;
  } | null;
  onBack: () => void;
  onSubmit: (payload: BookingFormData) => void;
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

  const validateAndSubmit = () => {
    const values = Object.values(formData);
    const hasEmpty = values.some(item => !String(item).trim());

    if (hasEmpty) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    onSubmit(formData);
  };

  const renderInput = (
    label: string,
    key: keyof BookingFormData,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label} weight="medium">
        {label}
      </Text>
      <TextInput
        value={formData[key]}
        onChangeText={text => updateField(key, text)}
        style={styles.input}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#A5A5B8"
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="semibold">
          Booking Details
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {service && (
          <View style={styles.serviceBanner}>
            <Text style={styles.serviceName} weight="semibold">
              {service.name}
            </Text>
            <Text style={styles.servicePrice}>₹{service.price}</Text>
          </View>
        )}

        <Text style={styles.formTitle}>Personal Information</Text>

        {renderInput('Full Name', 'name')}
        {renderInput('Email', 'email', 'email-address')}
        {renderInput('Phone', 'phone', 'phone-pad')}

        <Text style={styles.formTitle}>Birth Details</Text>

        {renderInput('Date of Birth', 'dob')}
        {renderInput('Time of Birth', 'tob')}
        {renderInput('Place of Birth', 'pob')}
        {renderInput('Gender', 'gender')}

        <Text style={styles.formTitle}>Additional Information</Text>

        {renderInput('Concern', 'concern')}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
        >
          <Text style={styles.submitText} weight="semibold">
            Continue to Astrologer Selection
          </Text>
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
  backIcon: {
    marginRight: 16,
  },
  backIconText: {
    fontSize: 22,
    color: colors.primary.main,
  },
  headerTitle: {
    fontSize: 20,
    color: '#1F1F2E',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  serviceBanner: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 1,
  },
  serviceName: {
    fontSize: 18,
    color: '#1F1F2E',
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22A45D',
    marginTop: 8,
  },
  formTitle: {
    fontSize: 16,
    color: '#1F1F2E',
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '600',
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
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookingFormScreen;