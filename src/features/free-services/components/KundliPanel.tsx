import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import {useToast} from '../../../context/ToastContext';
import {geocodeAddress} from '../../../services/api/astrologyApi/astrology.api';
import {NameInput} from '../../../components/Modal/ChatRequestModal/components/NameInput';
import {PlaceOfBirthInput} from '../../../components/Modal/ChatRequestModal/components/PlaceOfBirthInput';
import {DatePickerInput} from '../../../components/Modal/ChatRequestModal/components/DatePickerInput';
import {TimePickerInput} from '../../../components/Modal/ChatRequestModal/components/TimePickerInput';
import {
  getInitialBirthValues,
  buildBirthPayload,
  type BirthFormValues,
} from '../utils/freeServiceForm';

type KundliPanelProps = {
  visible: boolean;
  serviceTitle: string;
  onClose: () => void;
  onSuccess?: (payload: any) => void;
};

const initialPayload = getInitialBirthValues();

const KundliPanel: React.FC<KundliPanelProps> = ({
  visible,
  serviceTitle,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {showError} = useToast();

  const [name, setName] = useState('');
  const [formValues, setFormValues] = useState(initialPayload);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (key: keyof BirthFormValues, value: string) => {
      setFormValues(prev => ({...prev, [key]: value}));
      if (key === 'date') {
        setDateError(null);
      }
      if (key === 'time') {
        setTimeError(null);
      }
      setError(null);
    },
    [],
  );

  const resetState = useCallback(() => {
    setName('');
    setFormValues(initialPayload);
    setAddress('');
    setError(null);
    setNameError(null);
    setDateError(null);
    setTimeError(null);
  }, []);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [resetState, visible]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!formValues.date || !/^\d{2}\/\d{2}\/\d{4}$/.test(formValues.date)) {
      setDateError('Please select a valid date');
      isValid = false;
    } else {
      setDateError(null);
    }

    if (
      !formValues.time ||
      !/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(formValues.time)
    ) {
      setTimeError('Please select a valid time');
      isValid = false;
    } else {
      setTimeError(null);
    }

    if (!address.trim()) {
      setError('Please select an address first.');
      isValid = false;
    } else {
      setError(null);
    }

    return isValid;
  }, [address, formValues.date, formValues.time, name]);

  const handleFetch = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const coords = await geocodeAddress(address);
      const tzone = new Date().getTimezoneOffset() / -60;
      const payload = buildBirthPayload(
        formValues,
        Number(coords.lat),
        Number(coords.lon),
        tzone,
        coords.display_name,
      );

      onSuccess?.({
        serviceTitle,
        name: name.trim(),
        payload,
      });
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Unable to generate Kundli details.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    formValues,
    name,
    onClose,
    onSuccess,
    serviceTitle,
    showError,
    validateForm,
  ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.background.primary,
              paddingBottom: insets.bottom + 16,
            },
          ]}>
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Icon
                name="auto-awesome"
                size={24}
                color={colors.primary.main}
                library="MaterialIcons"
              />
              <Text
                variant="h6"
                weight="bold"
                style={{color: colors.text.primary}}>
                {serviceTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon
                name="close"
                size={22}
                color={colors.text.secondary}
                library="MaterialIcons"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.sectionCard}>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginBottom: 8}}>
                Personal Details
              </Text>
              <NameInput
                value={name}
                onChangeText={text => {
                  setName(text);
                  setNameError(null);
                  setError(null);
                }}
                error={nameError || undefined}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginBottom: 12}}>
                Date & Time
              </Text>
              <DatePickerInput
                value={formValues.date}
                onChangeText={(text: string) => handleInputChange('date', text)}
                error={dateError || undefined}
              />
              <TimePickerInput
                value={formValues.time}
                onChangeText={(text: string) => handleInputChange('time', text)}
              />
              {timeError ? (
                <Text
                  style={{
                    color: colors.error.main,
                    fontSize: 12,
                    marginTop: 6,
                    fontWeight: '500',
                  }}>
                  {timeError}
                </Text>
              ) : null}
            </View>

            <View style={styles.sectionCard}>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary, marginBottom: 8}}>
                Birth Place
              </Text>
              <PlaceOfBirthInput
                value={address}
                onChangeText={setAddress}
                placeholder="Your birth place"
                error={undefined}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.fetchButton,
                {
                  backgroundColor: colors.primary.main,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleFetch}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text variant="bodySmall" weight="bold" style={{color: '#fff'}}>
                  Generate Kundli
                </Text>
              )}
            </TouchableOpacity>

            {error ? (
              <View style={styles.stateCard}>
                <Text style={{color: colors.error.main}}>{error}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(109,40,217,0.05)',
  },
  fetchButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  stateCard: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.04)',
    marginBottom: 10,
  },
});

export default KundliPanel;
