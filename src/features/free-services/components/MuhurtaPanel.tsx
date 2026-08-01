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

import {InputBox} from '../../../components/InputBox';
import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import {useToast} from '../../../context/ToastContext';
import {
  getAbhijeetMuhurta,
  getChaughadiyaMuhurta,
  geocodeAddress,
} from '../../../services/api/astrologyApi/astrology.api';
import {PlaceOfBirthInput} from '../../../components/Modal/ChatRequestModal/components/PlaceOfBirthInput';
import {getMuhurtaServiceKind} from '../utils/muhurtaService';
import {
  getMuhurtaDetailsViewModel,
  getAbhijeetStatus,
} from '../utils/muhurtaResponse';
import {getMuhurtaStyle} from '../utils/muhurtaColors';

type MuhurtaPanelProps = {
  visible: boolean;
  serviceTitle: string;
  onClose: () => void;
  onSuccess?: (payload: any) => void;
};

const initialPayload = {
  day: '10',
  month: '5',
  year: '1990',
  hour: '19',
  min: '55',
};

const buildPayload = (
  values: typeof initialPayload,
  lat: number,
  lon: number,
  tzone: number,
) => ({
  day: Number(values.day),
  month: Number(values.month),
  year: Number(values.year),
  hour: Number(values.hour),
  min: Number(values.min),
  lat,
  lon,
  tzone,
});

const MuhurtaPanel: React.FC<MuhurtaPanelProps> = ({
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
  const [chaughadiyaData, setChaughadiyaData] = useState<any>(null);
  const [abhijeetData, setAbhijeetData] = useState<any>(null);

  const isChaughadiya = useMemo(
    () => getMuhurtaServiceKind(serviceTitle) === 'chaughadiya',
    [serviceTitle],
  );
  const isAbhijeet = useMemo(
    () => getMuhurtaServiceKind(serviceTitle) === 'abhijeet',
    [serviceTitle],
  );

  const handleInputChange = useCallback(
    (key: keyof typeof initialPayload, value: string) => {
      setFormValues(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const resetState = useCallback(() => {
    setFormValues(initialPayload);
    setAddress('');
    setError(null);
    setChaughadiyaData(null);
    setAbhijeetData(null);
  }, []);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [resetState, visible]);

  const handleFetch = useCallback(async () => {
    if (!address.trim()) {
      setError('Please select an address first.');
      showError('Please select an address first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const coords = await geocodeAddress(address);
      const tzone = new Date().getTimezoneOffset() / -60;
      const payload = buildPayload(
        formValues,
        Number(coords.lat),
        Number(coords.lon),
        tzone,
      );

      let responseData: any = null;
      let normalizedData: any = null;
      let chaughadiyaResult: any = null;
      let abhijeetResult: any = null;

      if (isChaughadiya) {
        const results = await Promise.allSettled([
          getChaughadiyaMuhurta(payload),
          getAbhijeetMuhurta(payload),
        ]);

        const chaughadiyaSettled = results[0];
        const abhijeetSettled = results[1];

        if (chaughadiyaSettled.status === 'fulfilled') {
          responseData = chaughadiyaSettled.value;
          normalizedData = getMuhurtaDetailsViewModel(
            'chaughadiya',
            chaughadiyaSettled.value,
          );
          setChaughadiyaData(chaughadiyaSettled.value?.chaughadiya || null);
          chaughadiyaResult = {
            data: chaughadiyaSettled.value,
            normalizedData,
          };
        } else {
          setChaughadiyaData(null);
          chaughadiyaResult = {
            error:
              chaughadiyaSettled.reason?.message ||
              'Failed to fetch Chaughadiya Muhurta',
          };
        }

        if (abhijeetSettled.status === 'fulfilled') {
          const abhijeetNormalized = getMuhurtaDetailsViewModel(
            'abhijeet',
            abhijeetSettled.value,
          );
          setAbhijeetData(abhijeetSettled.value?.abhijit_muhurta || null);
          abhijeetResult = {
            data: abhijeetSettled.value,
            normalizedData: abhijeetNormalized,
          };
        } else {
          setAbhijeetData(null);
          abhijeetResult = {
            error:
              abhijeetSettled.reason?.message ||
              'Failed to fetch Abhijeet Muhurta',
          };
        }
      }

      if (isAbhijeet) {
        const response = await getAbhijeetMuhurta(payload);
        responseData = response;
        normalizedData = getMuhurtaDetailsViewModel('abhijeet', response);
        setAbhijeetData(response?.abhijit_muhurta || null);
        setChaughadiyaData(null);
        abhijeetResult = {
          data: response,
          normalizedData,
        };
      }

      if (
        !normalizedData &&
        !chaughadiyaResult?.normalizedData &&
        !abhijeetResult?.normalizedData
      ) {
        setError('The Muhurta API returned invalid data.');
        showError('The Muhurta API returned invalid data.');
        return;
      }

      onSuccess?.({
        serviceTitle,
        payload,
        data: responseData,
        normalizedData,
        chaughadiyaResult,
        abhijeetResult,
      });
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Unable to fetch muhurta details.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    formValues,
    isAbhijeet,
    isChaughadiya,
    onClose,
    onSuccess,
    serviceTitle,
    showError,
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
                name="event"
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
              <View style={styles.inputRow}>
                {(
                  ['day', 'month', 'year'] as Array<keyof typeof initialPayload>
                ).map(field => (
                  <View key={field} style={styles.inputColumn}>
                    <Text
                      variant="captionSmall"
                      style={{color: colors.text.secondary, marginBottom: 6}}>
                      {field === 'day'
                        ? 'Day'
                        : field === 'month'
                        ? 'Month'
                        : 'Year'}
                    </Text>
                    <InputBox
                      value={formValues[field]}
                      onChangeText={text => handleInputChange(field, text)}
                      keyboardType="numeric"
                      placeholder={
                        field === 'day'
                          ? 'Day'
                          : field === 'month'
                          ? 'Month'
                          : 'Year'
                      }
                      containerStyle={styles.inputBox}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.inputRow}>
                {(['hour', 'min'] as Array<keyof typeof initialPayload>).map(
                  field => (
                    <View key={field} style={styles.inputColumn}>
                      <Text
                        variant="captionSmall"
                        style={{color: colors.text.secondary, marginBottom: 6}}>
                        {field === 'hour' ? 'Hour' : 'Minute'}
                      </Text>
                      <InputBox
                        value={formValues[field]}
                        onChangeText={text => handleInputChange(field, text)}
                        keyboardType="numeric"
                        placeholder={field === 'hour' ? 'Hour' : 'Minute'}
                        containerStyle={styles.inputBox}
                      />
                    </View>
                  ),
                )}
              </View>
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
                  Fetch Muhurta
                </Text>
              )}
            </TouchableOpacity>

            {error ? (
              <View style={styles.stateCard}>
                <Text style={{color: colors.error.main}}>{error}</Text>
              </View>
            ) : null}

            {!loading && !error && (isChaughadiya || isAbhijeet) ? (
              <View style={styles.stateCard}>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  style={{color: colors.text.primary, marginBottom: 12}}>
                  Results
                </Text>

                {isChaughadiya && chaughadiyaData ? (
                  <View>
                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      style={{
                        color: colors.text.primary,
                        marginBottom: 8,
                        textAlign: 'center',
                      }}>
                      Chaughadiya Muhurta
                    </Text>
                    {chaughadiyaData.day?.length ||
                    chaughadiyaData.night?.length ? (
                      <>
                        {chaughadiyaData.day?.length ? (
                          <View style={styles.resultSection}>
                            <Text
                              variant="bodyMedium"
                              weight="bold"
                              style={{
                                color: colors.text.primary,
                                marginBottom: 8,
                                textAlign: 'center',
                              }}>
                              Day Chaughadiya
                            </Text>
                            <View style={styles.resultList}>
                              {chaughadiyaData.day.map(
                                (item: any, index: number) => {
                                  const muhurtaStyle = getMuhurtaStyle(
                                    item.muhurta,
                                  );
                                  const itemStyle =
                                    muhurtaStyle.backgroundColor !==
                                    'transparent'
                                      ? {
                                          backgroundColor:
                                            muhurtaStyle.backgroundColor,
                                        }
                                      : {backgroundColor: '#fff'};
                                  const nameColor = muhurtaStyle.textColor;

                                  return (
                                    <View
                                      key={`day-${index}`}
                                      style={[
                                        styles.resultItemCenter,
                                        itemStyle,
                                      ]}>
                                      <Text
                                        variant="bodyMedium"
                                        weight="bold"
                                        style={{color: nameColor}}>
                                        {item.muhurta || 'No name'}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.resultTimeText,
                                          {
                                            color:
                                              nameColor === '#ffffff'
                                                ? '#ffffff'
                                                : colors.text.secondary,
                                          },
                                        ]}>
                                        {item.time || 'Not available'}
                                      </Text>
                                    </View>
                                  );
                                },
                              )}
                            </View>
                          </View>
                        ) : null}

                        {chaughadiyaData.night?.length ? (
                          <View style={styles.resultSection}>
                            <Text
                              variant="bodyMedium"
                              weight="bold"
                              style={{
                                color: colors.text.primary,
                                marginBottom: 8,
                                textAlign: 'center',
                              }}>
                              Night Chaughadiya
                            </Text>
                            <View style={styles.resultList}>
                              {chaughadiyaData.night.map(
                                (item: any, index: number) => {
                                  const muhurtaStyle = getMuhurtaStyle(
                                    item.muhurta,
                                  );
                                  const itemStyle =
                                    muhurtaStyle.backgroundColor !==
                                    'transparent'
                                      ? {
                                          backgroundColor:
                                            muhurtaStyle.backgroundColor,
                                        }
                                      : {backgroundColor: '#fff'};
                                  const nameColor = muhurtaStyle.textColor;

                                  return (
                                    <View
                                      key={`night-${index}`}
                                      style={[
                                        styles.resultItemCenter,
                                        itemStyle,
                                      ]}>
                                      <Text
                                        variant="bodyMedium"
                                        weight="bold"
                                        style={{color: nameColor}}>
                                        {item.muhurta || 'No name'}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.resultTimeText,
                                          {
                                            color:
                                              nameColor === '#ffffff'
                                                ? '#ffffff'
                                                : colors.text.secondary,
                                          },
                                        ]}>
                                        {item.time || 'Not available'}
                                      </Text>
                                    </View>
                                  );
                                },
                              )}
                            </View>
                          </View>
                        ) : null}
                      </>
                    ) : (
                      <Text style={{color: colors.text.secondary}}>
                        No Chaughadiya data available for the selected date and
                        time.
                      </Text>
                    )}
                  </View>
                ) : null}

                {isChaughadiya && abhijeetData ? (
                  <View style={styles.resultSection}>
                    <View
                      style={[
                        styles.resultItem,
                        {backgroundColor: colors.background.secondary},
                      ]}>
                      <View style={styles.cardHeaderCenter}>
                        <Icon
                          name="access-time"
                          size={18}
                          color={colors.primary.main}
                          library="MaterialIcons"
                        />
                        <Text
                          variant="bodyMedium"
                          weight="bold"
                          style={{
                            color: colors.primary.main,
                            marginLeft: 8,
                          }}>
                          Abhijeet Muhurta
                        </Text>
                        {abhijeetData.start && abhijeetData.end ? (
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  getAbhijeetStatus(
                                    abhijeetData.start,
                                    abhijeetData.end,
                                    payload.tzone,
                                  ).variant === 'success'
                                    ? colors.success.background
                                    : colors.warning.background,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.statusBadgeText,
                                {
                                  color:
                                    getAbhijeetStatus(
                                      abhijeetData.start,
                                      abhijeetData.end,
                                      payload.tzone,
                                    ).variant === 'success'
                                      ? colors.success.main
                                      : colors.warning.main,
                                },
                              ]}>
                              {
                                getAbhijeetStatus(
                                  abhijeetData.start,
                                  abhijeetData.end,
                                  payload.tzone,
                                ).label
                              }
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.abhijeetCenterCard}>
                        <View style={styles.abhijeetTimeRow}>
                          <View style={styles.abhijeetTimeBlock}>
                            <Text
                              variant="captionSmall"
                              weight="bold"
                              style={{
                                color: colors.text.secondary,
                                textTransform: 'uppercase',
                                marginBottom: 4,
                              }}>
                              Start Time
                            </Text>
                            <Text
                              variant="h6"
                              weight="bold"
                              style={{color: colors.text.primary}}>
                              {abhijeetData.start || 'Not available'}
                            </Text>
                          </View>

                          <View style={styles.abhijeetSeparator}>
                            <Icon
                              name="schedule"
                              size={20}
                              color={colors.primary.main}
                              library="MaterialIcons"
                            />
                          </View>

                          <View style={styles.abhijeetTimeBlock}>
                            <Text
                              variant="captionSmall"
                              weight="bold"
                              style={{
                                color: colors.text.secondary,
                                textTransform: 'uppercase',
                                marginBottom: 4,
                              }}>
                              End Time
                            </Text>
                            <Text
                              variant="h6"
                              weight="bold"
                              style={{color: colors.text.primary}}>
                              {abhijeetData.end || 'Not available'}
                            </Text>
                          </View>
                        </View>

                        {abhijeetData.start && abhijeetData.end ? (
                          <>
                            <View style={styles.abhijeetDivider} />
                            <View style={styles.abhijeetDurationRow}>
                              <Text
                                variant="captionSmall"
                                weight="bold"
                                style={{
                                  color: colors.text.secondary,
                                  textTransform: 'uppercase',
                                  marginBottom: 4,
                                }}>
                                Duration
                              </Text>
                              <Text
                                variant="h6"
                                weight="bold"
                                style={{color: colors.text.primary}}>
                                {getMuhurtaDetailsViewModel('abhijeet', {
                                  abhijit_muhurta: abhijeetData,
                                })?.duration || 'Not available'}
                              </Text>
                            </View>
                          </>
                        ) : null}

                        <View style={styles.abhijeetStatusRow}>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  getAbhijeetStatus(
                                    abhijeetData.start,
                                    abhijeetData.end,
                                    payload.tzone,
                                  ).variant === 'success'
                                    ? colors.success.background
                                    : colors.warning.background,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.statusBadgeText,
                                {
                                  color:
                                    getAbhijeetStatus(
                                      abhijeetData.start,
                                      abhijeetData.end,
                                      payload.tzone,
                                    ).variant === 'success'
                                      ? colors.success.main
                                      : colors.warning.main,
                                },
                              ]}>
                              {
                                getAbhijeetStatus(
                                  abhijeetData.start,
                                  abhijeetData.end,
                                  payload.tzone,
                                ).label
                              }
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputBox: {
    marginBottom: 0,
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
  resultList: {
    gap: 8,
  },
  resultSection: {
    marginBottom: 10,
  },
  resultItem: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  resultItemCenter: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTimeText: {
    marginTop: 6,
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  abhijeetCenterCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 16,
    alignItems: 'center',
  },
  abhijeetTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  abhijeetTimeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  abhijeetSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  abhijeetDivider: {
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.08)',
    marginVertical: 10,
  },
  abhijeetDurationRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  abhijeetStatusRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  timeValueChip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(15,23,42,0.04)',
    marginTop: 2,
  },
});

export default MuhurtaPanel;
