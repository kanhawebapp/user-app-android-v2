import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {
  getAdvancedPanchang,
  getChaughadiyaMuhurta,
  getHoraMuhurta,
  geocodeAddress,
} from '../../../services/api/astrologyApi/astrology.api';
import {PlaceOfBirthInput} from '../../../components/Modal/ChatRequestModal/components/PlaceOfBirthInput';
import {DatePickerInput} from '../../../components/Modal/ChatRequestModal/components/DatePickerInput';
import {TimePickerInput} from '../../../components/Modal/ChatRequestModal/components/TimePickerInput';
import {getMuhurtaServiceKind, formatTimeValue} from '../utils/muhurtaService';
import {
  getInitialBirthValues,
  buildBirthPayload,
  type BirthFormValues,
} from '../utils/freeServiceForm';
import type {
  AdvancedPanchangResponse,
  ChaughadiyaMuhurtaResponse,
  HoraMuhurtaResponse,
} from '../../../services/api/astrologyApi/astrology.types';

type PanchangPanelProps = {
  visible: boolean;
  serviceTitle: string;
  onClose: () => void;
  onSuccess?: (payload: any) => void;
};

const initialPayload = getInitialBirthValues();

const PanchangPanel: React.FC<PanchangPanelProps> = ({
  visible,
  serviceTitle,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {showError} = useToast();

  const [formValues, setFormValues] = useState(initialPayload);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [panchangData, setPanchangData] =
    useState<AdvancedPanchangResponse | null>(null);

  const isPanchang = useMemo(
    () => getMuhurtaServiceKind(serviceTitle) === 'panchang',
    [serviceTitle],
  );

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
    setFormValues(initialPayload);
    setAddress('');
    setError(null);
    setDateError(null);
    setTimeError(null);
    setPanchangData(null);
  }, []);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [resetState, visible]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;

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
    }

    return isValid;
  }, [address, formValues.date, formValues.time]);

  const handleFetch = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPanchangData(null);

      const coords = await geocodeAddress(address);
      const tzone = new Date().getTimezoneOffset() / -60;
      const payload = buildBirthPayload(
        formValues,
        Number(coords.lat),
        Number(coords.lon),
        tzone,
        coords.display_name,
      );

      console.log('PanchangPanel Hora API request:', payload);

      const results = await Promise.allSettled([
        getAdvancedPanchang(payload),
        getChaughadiyaMuhurta(payload),
        getHoraMuhurta(payload),
      ]);

      const panchangSettled = results[0];
      const chaughadiyaSettled = results[1];
      const horaSettled = results[2];

      let responseData: AdvancedPanchangResponse | null = null;

      if (panchangSettled.status === 'fulfilled') {
        responseData = panchangSettled.value;
        setPanchangData(panchangSettled.value);
      } else {
        setPanchangData(null);
      }

      let chaughadiyaResult: ChaughadiyaMuhurtaResponse | null = null;
      if (chaughadiyaSettled.status === 'fulfilled') {
        chaughadiyaResult = chaughadiyaSettled.value;
        console.log(
          'PanchangPanel Chaughadiya API response:',
          chaughadiyaResult,
        );
      }

      let horaResult: HoraMuhurtaResponse | null = null;
      if (horaSettled.status === 'fulfilled') {
        horaResult = horaSettled.value;
        console.log('PanchangPanel Hora API response:', horaResult);
      }

      if (!responseData) {
        setError('Unable to fetch Panchang details. Please try again.');
        showError('Unable to fetch Panchang details. Please try again.');
        return;
      }

      onSuccess?.({
        serviceTitle,
        payload,
        data: responseData,
        chaughadiyaResult,
        horaMuhurta: horaResult,
      });
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Unable to fetch Panchang details.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    formValues,
    onClose,
    onSuccess,
    serviceTitle,
    showError,
    validateForm,
  ]);

  const renderRequestSummary = () => {
    if (!formValues.date || !formValues.time) {
      return null;
    }

    const [day, month, year] = formValues.date.split('/');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const locationValue = address || 'Address not available';

    return (
      <View
        style={[
          styles.summaryCard,
          {backgroundColor: colors.background.secondary},
        ]}>
        <View
          style={[
            styles.summaryHeaderBar,
            {backgroundColor: colors.primary.main},
          ]}>
          <Text variant="bodyMedium" weight="bold" style={{color: '#ffffff'}}>
            Request Summary
          </Text>
        </View>

        <View style={styles.summaryContentCenter}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColumn}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  textAlign: 'center',
                }}>
                Date
              </Text>
              <Text
                variant="bodyMedium"
                weight="bold"
                style={{color: colors.text.primary, textAlign: 'center'}}>
                {formattedDate}
              </Text>
            </View>

            <View style={styles.summaryColumn}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  textAlign: 'center',
                }}>
                Time
              </Text>
              <Text
                variant="bodyMedium"
                weight="bold"
                style={{color: colors.text.primary, textAlign: 'center'}}>
                {formValues.time}
              </Text>
            </View>
          </View>

          <View style={styles.summaryLocationRow}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
                textAlign: 'center',
              }}>
              Location
            </Text>
            <Text
              variant="bodyMedium"
              weight="bold"
              style={{color: colors.text.primary, textAlign: 'center'}}>
              {locationValue}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSunMoonTimings = () => {
    if (!panchangData) {
      return null;
    }

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="wb-sunny"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Sun & Moon Timings
          </Text>
        </View>

        <View style={styles.timingGrid}>
          <View style={styles.timingBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Sunrise
            </Text>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatTimeValue(panchangData?.sunrise) || '-'}
            </Text>
          </View>
          <View style={styles.timingBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Sunset
            </Text>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatTimeValue(panchangData?.sunset) || '-'}
            </Text>
          </View>
          <View style={styles.timingBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Moonrise
            </Text>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatTimeValue(panchangData?.moonrise) || '-'}
            </Text>
          </View>
          <View style={styles.timingBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Moonset
            </Text>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatTimeValue(panchangData?.moonset) || '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDayInformation = () => {
    if (!panchangData) {
      return null;
    }

    const items = [
      {label: 'Day', value: panchangData?.day},
      {label: 'Ayana', value: panchangData?.ayana},
      {label: 'Ritu', value: panchangData?.ritu},
      {label: 'Sun Sign', value: panchangData?.sun_sign},
      {label: 'Moon Sign', value: panchangData?.moon_sign},
      {label: 'Paksha', value: panchangData?.paksha},
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="calendar-today"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Day Information
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCalendarInformation = () => {
    if (!panchangData) {
      return null;
    }

    const items = [
      {label: 'Vikram Samvat', value: panchangData?.vikram_samvat},
      {label: 'Vikram Samvat Name', value: panchangData?.vkram_samvat_name},
      {label: 'Shaka Samvat', value: panchangData?.shaka_samvat},
      {label: 'Shaka Samvat Name', value: panchangData?.shaka_samvat_name},
      {label: 'Disha Shool', value: panchangData?.disha_shool},
      {
        label: 'Disha Shool Remedies',
        value: panchangData?.disha_shool_remedies,
      },
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="public"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Calendar Information
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAuspiciousTimings = () => {
    if (!panchangData) {
      return null;
    }

    const entries = [
      {key: 'rahukaal', label: 'Rahukaal', data: panchangData?.rahukaal},
      {
        key: 'yamghant_kaal',
        label: 'Yamghant Kaal',
        data: panchangData?.yamghant_kaal,
      },
      {key: 'guliKaal', label: 'Gulikaal', data: panchangData?.guliKaal},
      {
        key: 'abhijit_muhurta',
        label: 'Abhijit Muhurta',
        data: panchangData?.abhijit_muhurta,
      },
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="access-time"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Auspicious & Inauspicious Timings
          </Text>
        </View>

        {entries.map(entry => (
          <View key={entry.key} style={styles.timingCard}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary, marginBottom: 8}}>
              {entry.label}
            </Text>
            <View style={styles.timingRow}>
              <View style={styles.timingValueBlock}>
                <Text
                  variant="captionSmall"
                  weight="bold"
                  style={{
                    color: colors.text.secondary,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                  Start
                </Text>
                <Text
                  variant="h6"
                  weight="bold"
                  style={{color: colors.text.primary}}>
                  {formatTimeValue(entry.data?.start) || '-'}
                </Text>
              </View>
              <View style={styles.timingValueBlock}>
                <Text
                  variant="captionSmall"
                  weight="bold"
                  style={{
                    color: colors.text.secondary,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                  End
                </Text>
                <Text
                  variant="h6"
                  weight="bold"
                  style={{color: colors.text.primary}}>
                  {formatTimeValue(entry.data?.end) || '-'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTithiDetails = () => {
    if (!panchangData?.tithi?.details) {
      return null;
    }
    const details = panchangData.tithi.details;

    const items = [
      {label: 'Tithi Number', value: details?.tithi_number},
      {label: 'Tithi Name', value: details?.tithi_name},
      {label: 'Special', value: details?.special},
      {label: 'Deity', value: details?.deity},
      {
        label: 'End Time',
        value: formatTimeValue(panchangData?.tithi?.end_time),
      },
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="brightness-5"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Tithi Details
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>

        {details?.summary ? (
          <View style={styles.summaryBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Summary
            </Text>
            <Text variant="bodySmall" style={{color: colors.text.primary}}>
              {details.summary}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderNakshatraDetails = () => {
    if (!panchangData?.nakshatra?.details) {
      return null;
    }
    const details = panchangData.nakshatra.details;

    const items = [
      {label: 'Nak Number', value: details?.nak_number},
      {label: 'Nak Name', value: details?.nak_name},
      {label: 'Ruler', value: details?.ruler},
      {label: 'Deity', value: details?.deity},
      {label: 'Special', value: details?.special},
      {
        label: 'End Time',
        value: formatTimeValue(panchangData?.nakshatra?.end_time),
      },
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="stars"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Nakshatra Details
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>

        {details?.summary ? (
          <View style={styles.summaryBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Summary
            </Text>
            <Text variant="bodySmall" style={{color: colors.text.primary}}>
              {details.summary}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderYogDetails = () => {
    if (!panchangData?.yog?.details) {
      return null;
    }
    const details = panchangData.yog.details;

    const items = [
      {label: 'Yog Number', value: details?.yog_number},
      {label: 'Yog Name', value: details?.yog_name},
      {label: 'Special', value: details?.special},
      {label: 'Meaning', value: details?.meaning},
      {label: 'End Time', value: formatTimeValue(panchangData?.yog?.end_time)},
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="self-improvement"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Yog Details
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>

        {details?.meaning ? (
          <View style={styles.summaryBlock}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{
                color: colors.text.secondary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              Meaning
            </Text>
            <Text variant="bodySmall" style={{color: colors.text.primary}}>
              {details.meaning}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderKaranDetails = () => {
    if (!panchangData?.karan?.details) {
      return null;
    }
    const details = panchangData.karan.details;

    const items = [
      {label: 'Karan Number', value: details?.karan_number},
      {label: 'Karan Name', value: details?.karan_name},
      {label: 'Deity', value: details?.deity},
      {label: 'Special', value: details?.special},
      {
        label: 'End Time',
        value: formatTimeValue(panchangData?.karan?.end_time),
      },
    ];

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeaderCenter}>
          <Icon
            name="auto-fix-high"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodyMedium"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Karan Details
          </Text>
        </View>

        <View style={styles.kvGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.kvItem}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.text.primary}}>
                {item.value || '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

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
                name="calendar-today"
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
                Select Address
              </Text>
              <PlaceOfBirthInput
                value={address}
                onChangeText={setAddress}
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
                  Get Panchang
                </Text>
              )}
            </TouchableOpacity>

            {error ? (
              <View style={styles.stateCard}>
                <Text style={{color: colors.error.main}}>{error}</Text>
              </View>
            ) : null}

            {!loading && !error && isPanchang && panchangData ? (
              <View>
                {renderRequestSummary()}
                {renderSunMoonTimings()}
                {renderDayInformation()}
                {renderCalendarInformation()}
                {renderAuspiciousTimings()}
                {renderTithiDetails()}
                {renderNakshatraDetails()}
                {renderYogDetails()}
                {renderKaranDetails()}
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
  summaryCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  summaryHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryContentCenter: {
    padding: 16,
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 24,
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLocationRow: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  timingBlock: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  timingCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timingValueBlock: {
    flex: 1,
    alignItems: 'center',
  },
  kvGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kvItem: {
    width: '48%',
    marginBottom: 8,
  },
  summaryBlock: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,42,0.08)',
  },
});

export default PanchangPanel;
