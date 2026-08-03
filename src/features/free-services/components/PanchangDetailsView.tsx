import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {formatTimeValue} from '../utils/muhurtaService';
import {getMuhurtaStyle, getHoraStyle} from '../utils/muhurtaColors';
import {getAbhijeetStatus} from '../utils/muhurtaResponse';
import type {AdvancedPanchangResponse} from '../../../services/api/astrologyApi/astrology.types';

type PanchangDetailsViewProps = {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
};

const PanchangDetailsView: React.FC<PanchangDetailsViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const data = result?.data as AdvancedPanchangResponse | null;
  const payload = result?.payload;
  const [muhurtaTab, setMuhurtaTab] = useState<'chaughadiya' | 'hora'>(
    'chaughadiya',
  );

  useEffect(() => {
    console.log('PanchangDetailsView Selected tab:', muhurtaTab);
  }, [muhurtaTab]);

  const renderRequestSummary = () => {
    if (!payload) {
      return null;
    }

    const year = String(payload.year);
    const month = String(payload.month).padStart(2, '0');
    const day = String(payload.day).padStart(2, '0');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const min = String(payload.min).padStart(2, '0');
    const meridiem = Number(payload.hour) >= 12 ? 'PM' : 'AM';
    const hour12 = Number(payload.hour) % 12 || 12;
    const formattedTime = `${String(hour12).padStart(
      2,
      '0',
    )}:${min} ${meridiem}`;

    const locationValue = payload.address || '-';

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
                {formattedTime}
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
    if (!data) {
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
              {formatTimeValue(data?.sunrise) || '-'}
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
              {formatTimeValue(data?.sunset) || '-'}
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
              {formatTimeValue(data?.moonrise) || '-'}
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
              {formatTimeValue(data?.moonset) || '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDayInformation = () => {
    if (!data) {
      return null;
    }

    const items = [
      {label: 'Day', value: data?.day},
      {label: 'Ayana', value: data?.ayana},
      {label: 'Ritu', value: data?.ritu},
      {label: 'Sun Sign', value: data?.sun_sign},
      {label: 'Moon Sign', value: data?.moon_sign},
      {label: 'Paksha', value: data?.paksha},
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
    if (!data) {
      return null;
    }

    const items = [
      {label: 'Vikram Samvat', value: data?.vikram_samvat},
      {label: 'Vikram Samvat Name', value: data?.vkram_samvat_name},
      {label: 'Shaka Samvat', value: data?.shaka_samvat},
      {label: 'Shaka Samvat Name', value: data?.shaka_samvat_name},
      {label: 'Disha Shool', value: data?.disha_shool},
      {label: 'Disha Shool Remedies', value: data?.disha_shool_remedies},
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
    if (!data) {
      return null;
    }

    const entries = [
      {key: 'rahukaal', label: 'Rahukaal', data: data?.rahukaal},
      {
        key: 'yamghant_kaal',
        label: 'Yamghant Kaal',
        data: data?.yamghant_kaal,
      },
      {key: 'guliKaal', label: 'Gulikaal', data: data?.guliKaal},
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
    if (!data?.tithi?.details) {
      return null;
    }
    const details = data.tithi.details;

    const items = [
      {label: 'Tithi Number', value: details?.tithi_number},
      {label: 'Tithi Name', value: details?.tithi_name},
      {label: 'Special', value: details?.special},
      {label: 'Deity', value: details?.deity},
      {label: 'End Time', value: formatTimeValue(data?.tithi?.end_time)},
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
    if (!data?.nakshatra?.details) {
      return null;
    }
    const details = data.nakshatra.details;

    const items = [
      {label: 'Nak Number', value: details?.nak_number},
      {label: 'Nak Name', value: details?.nak_name},
      {label: 'Ruler', value: details?.ruler},
      {label: 'Deity', value: details?.deity},
      {label: 'Special', value: details?.special},
      {label: 'End Time', value: formatTimeValue(data?.nakshatra?.end_time)},
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
    if (!data?.yog?.details) {
      return null;
    }
    const details = data.yog.details;

    const items = [
      {label: 'Yog Number', value: details?.yog_number},
      {label: 'Yog Name', value: details?.yog_name},
      {label: 'Special', value: details?.special},
      {label: 'Meaning', value: details?.meaning},
      {label: 'End Time', value: formatTimeValue(data?.yog?.end_time)},
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
    if (!data?.karan?.details) {
      return null;
    }
    const details = data.karan.details;

    const items = [
      {label: 'Karan Number', value: details?.karan_number},
      {label: 'Karan Name', value: details?.karan_name},
      {label: 'Deity', value: details?.deity},
      {label: 'Special', value: details?.special},
      {label: 'End Time', value: formatTimeValue(data?.karan?.end_time)},
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

  const renderMuhurtaTabs = () => {
    return (
      <View style={styles.muhurtaTabContainer}>
        <TouchableOpacity
          style={[
            styles.muhurtaTab,
            muhurtaTab === 'chaughadiya' && {
              backgroundColor: colors.primary.main,
            },
          ]}
          onPress={() => setMuhurtaTab('chaughadiya')}>
          <Text
            variant="bodySmall"
            weight="bold"
            style={[
              styles.muhurtaTabText,
              {
                color:
                  muhurtaTab === 'chaughadiya'
                    ? '#ffffff'
                    : colors.text.secondary,
              },
            ]}>
            Chaughadiya Muhurta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.muhurtaTab,
            muhurtaTab === 'hora' && {
              backgroundColor: colors.primary.main,
            },
          ]}
          onPress={() => setMuhurtaTab('hora')}>
          <Text
            variant="bodySmall"
            weight="bold"
            style={[
              styles.muhurtaTabText,
              {
                color:
                  muhurtaTab === 'hora' ? '#ffffff' : colors.text.secondary,
              },
            ]}>
            Hora Muhurta
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderChaughadiya = () => {
    if (muhurtaTab !== 'chaughadiya') {
      return null;
    }

    const chaughadiyaResult = result?.chaughadiyaResult;
    const dayEntries = chaughadiyaResult?.chaughadiya?.day;
    const nightEntries = chaughadiyaResult?.chaughadiya?.night;

    console.log('PanchangDetailsView Chaughadiya:', {
      chaughadiyaResult,
      dayEntries,
      nightEntries,
    });

    if (!dayEntries?.length && !nightEntries?.length) {
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
            Chaughadiya Muhurta
          </Text>
        </View>

        {dayEntries?.length ? (
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
              {dayEntries.map((item: any, index: number) => {
                const muhurtaStyle = getMuhurtaStyle(
                  item.muhurta || item.muhurta_name,
                );
                const itemStyle =
                  muhurtaStyle.backgroundColor !== 'transparent'
                    ? {backgroundColor: muhurtaStyle.backgroundColor}
                    : {backgroundColor: '#fff'};
                const nameColor = muhurtaStyle.textColor;

                return (
                  <View
                    key={`day-${index}`}
                    style={[styles.resultItemCenter, itemStyle]}>
                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.muhurta || item.muhurta_name || 'No name'}
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
              })}
            </View>
          </View>
        ) : null}

        {nightEntries?.length ? (
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
              {nightEntries.map((item: any, index: number) => {
                const muhurtaStyle = getMuhurtaStyle(
                  item.muhurta || item.muhurta_name,
                );
                const itemStyle =
                  muhurtaStyle.backgroundColor !== 'transparent'
                    ? {backgroundColor: muhurtaStyle.backgroundColor}
                    : {backgroundColor: '#fff'};
                const nameColor = muhurtaStyle.textColor;

                return (
                  <View
                    key={`night-${index}`}
                    style={[styles.resultItemCenter, itemStyle]}>
                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.muhurta || item.muhurta_name || 'No name'}
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
              })}
            </View>
          </View>
        ) : null}

        {!dayEntries?.length && !nightEntries?.length ? (
          <Text style={{color: colors.text.secondary, marginTop: 8}}>
            No Chaughadiya data available for the selected date and time.
          </Text>
        ) : null}
      </View>
    );
  };

  const renderHoraMuhurta = () => {
    if (muhurtaTab !== 'hora') {
      return null;
    }

    const horaData = result?.horaMuhurta;
    console.log('PanchangDetailsView Hora raw data:', horaData);

    if (!horaData) {
      return null;
    }

    const dayEntries = horaData?.day ?? horaData?.hora?.day;
    const nightEntries = horaData?.night ?? horaData?.hora?.night;

    console.log('PanchangDetailsView Hora entries:', {
      dayEntries,
      nightEntries,
    });

    if (!dayEntries?.length && !nightEntries?.length) {
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
            Hora Muhurta
          </Text>
        </View>

        {dayEntries?.length ? (
          <View style={styles.resultSection}>
            <Text
              variant="bodyMedium"
              weight="bold"
              style={{
                color: colors.text.primary,
                marginBottom: 8,
                textAlign: 'center',
              }}>
              Day Hora
            </Text>
            <View style={styles.resultList}>
              {dayEntries.map((item: any, index: number) => {
                const horaStyle = getHoraStyle(item.hora);
                const itemStyle =
                  horaStyle.backgroundColor !== 'transparent'
                    ? {backgroundColor: horaStyle.backgroundColor}
                    : {backgroundColor: '#fff'};
                const nameColor = horaStyle.textColor;

                return (
                  <View
                    key={`day-hora-${index}`}
                    style={[styles.resultItemCenter, itemStyle]}>
                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.hora || 'No name'}
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
              })}
            </View>
          </View>
        ) : null}

        {nightEntries?.length ? (
          <View style={styles.resultSection}>
            <Text
              variant="bodyMedium"
              weight="bold"
              style={{
                color: colors.text.primary,
                marginBottom: 8,
                textAlign: 'center',
              }}>
              Night Hora
            </Text>
            <View style={styles.resultList}>
              {nightEntries.map((item: any, index: number) => {
                const horaStyle = getHoraStyle(item.hora);
                const itemStyle =
                  horaStyle.backgroundColor !== 'transparent'
                    ? {backgroundColor: horaStyle.backgroundColor}
                    : {backgroundColor: '#fff'};
                const nameColor = horaStyle.textColor;

                return (
                  <View
                    key={`night-hora-${index}`}
                    style={[styles.resultItemCenter, itemStyle]}>
                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.hora || 'No name'}
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
              })}
            </View>
          </View>
        ) : null}

        {!dayEntries?.length && !nightEntries?.length ? (
          <Text style={{color: colors.text.secondary, marginTop: 8}}>
            No Hora Muhurta data available for the selected date and time.
          </Text>
        ) : null}
      </View>
    );
  };

  const renderAbhijeet = () => {
    if (muhurtaTab !== 'chaughadiya') {
      return null;
    }

    if (!data?.abhijit_muhurta) {
      return null;
    }

    const abhijitData = data.abhijit_muhurta;
    const start = formatTimeValue(abhijitData?.start) || '';
    const end = formatTimeValue(abhijitData?.end) || '';

    const calculatedDuration = (() => {
      const toMinutes = (time?: string) => {
        if (!time) {
          return null;
        }
        const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (!match) {
          return null;
        }
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const seconds = match[3] ? Number(match[3]) : 0;
        return hours * 60 + minutes + seconds / 60;
      };
      const startMinutes = toMinutes(start);
      const endMinutes = toMinutes(end);
      if (startMinutes === null || endMinutes === null) {
        return undefined;
      }
      let diff = endMinutes - startMinutes;
      if (diff < 0) {
        diff += 24 * 60;
      }
      const hours = Math.floor(diff / 60);
      const minutes = Math.round(diff % 60);
      if (hours && minutes) {
        return `${hours}h ${minutes}m`;
      }
      if (hours) {
        return `${hours}h`;
      }
      return `${minutes}m`;
    })();

    const status = getAbhijeetStatus(start, end, payload?.tzone);

    const statusColors =
      status.variant === 'success'
        ? {bg: colors.success.background, text: colors.success.main}
        : status.variant === 'warning'
        ? {bg: colors.warning.background, text: colors.warning.main}
        : {bg: colors.background.primary, text: colors.text.secondary};

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
            Abhijit Muhurta
          </Text>
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
                {start || 'Not available'}
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
                {end || 'Not available'}
              </Text>
            </View>
          </View>

          {calculatedDuration ? (
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
                {calculatedDuration}
              </Text>
            </View>
          ) : null}

          <View style={styles.abhijeetStatusRow}>
            <View
              style={[styles.statusBadge, {backgroundColor: statusColors.bg}]}>
              <Text
                style={[styles.statusBadgeText, {color: statusColors.text}]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="bold"
          style={{color: colors.text.primary, flex: 1}}>
          {serviceTitle || 'Panchang Details'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderRequestSummary()}
        {renderSunMoonTimings()}
        {renderDayInformation()}
        {renderCalendarInformation()}
        {renderAuspiciousTimings()}
        {renderTithiDetails()}
        {renderNakshatraDetails()}
        {renderYogDetails()}
        {renderKaranDetails()}
        {renderMuhurtaTabs()}
        {renderChaughadiya()}
        {renderHoraMuhurta()}
        {renderAbhijeet()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  resultSection: {
    marginBottom: 12,
  },
  resultList: {
    gap: 8,
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
  muhurtaTabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,23,42,0.06)',
    marginBottom: 12,
  },
  muhurtaTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muhurtaTabText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export default PanchangDetailsView;
