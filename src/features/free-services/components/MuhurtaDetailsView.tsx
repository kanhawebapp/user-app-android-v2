import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {getMuhurtaStyle} from '../utils/muhurtaColors';
import {getAbhijeetStatus} from '../utils/muhurtaResponse';

type MuhurtaDetailsViewProps = {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
};

const MuhurtaDetailsView: React.FC<MuhurtaDetailsViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const payload = result?.payload;
  const chaughadiyaResult = result?.chaughadiyaResult;
  const abhijeetResult = result?.abhijeetResult;
  const legacyNormalizedData = result?.normalizedData;

  const renderChaughadiya = () => {
    if (chaughadiyaResult?.error) {
      return (
        <View
          style={[styles.card, {backgroundColor: colors.background.secondary}]}>
          <View style={styles.cardHeader}>
            <Icon
              name="event"
              size={20}
              color={colors.error.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.error.main, marginLeft: 8}}>
              Chaughadiya Muhurta
            </Text>
          </View>
          <Text style={{color: colors.text.secondary, marginTop: 8}}>
            {chaughadiyaResult.error}
          </Text>
        </View>
      );
    }

    const normalizedData =
      chaughadiyaResult?.normalizedData ||
      (legacyNormalizedData?.kind === 'chaughadiya'
        ? legacyNormalizedData
        : null);

    if (!normalizedData) {
      return null;
    }

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeader}>
          <Icon
            name="wb-sunny"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Chaughadiya Muhurta
          </Text>
        </View>

        {normalizedData.day?.length ? (
          <View style={styles.resultSection}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary, marginBottom: 8}}>
              Day Chaughadiya
            </Text>
            <View style={styles.resultList}>
              {normalizedData.day.map((item: any, index: number) => {
                const muhurtaStyle = getMuhurtaStyle(item.muhurta);
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
                      variant="bodySmall"
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
              })}
            </View>
          </View>
        ) : null}

        {normalizedData.night?.length ? (
          <View style={styles.resultSection}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary, marginBottom: 8}}>
              Night Chaughadiya
            </Text>
            <View style={styles.resultList}>
              {normalizedData.night.map((item: any, index: number) => {
                const muhurtaStyle = getMuhurtaStyle(item.muhurta);
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
                      variant="bodySmall"
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
              })}
            </View>
          </View>
        ) : null}

        {!normalizedData.day?.length && !normalizedData.night?.length ? (
          <Text style={{color: colors.text.secondary, marginTop: 8}}>
            No Chaughadiya data available for the selected date and time.
          </Text>
        ) : null}
      </View>
    );
  };

  const renderAbhijeet = () => {
    if (abhijeetResult?.error) {
      return (
        <View
          style={[styles.card, {backgroundColor: colors.background.secondary}]}>
          <View style={styles.cardHeader}>
            <Icon
              name="access-time"
              size={20}
              color={colors.error.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.error.main, marginLeft: 8}}>
              Abhijeet Muhurta
            </Text>
          </View>
          <Text style={{color: colors.text.secondary, marginTop: 8}}>
            {abhijeetResult.error}
          </Text>
        </View>
      );
    }

    const normalizedData =
      abhijeetResult?.normalizedData ||
      (legacyNormalizedData?.kind === 'abhijeet' ? legacyNormalizedData : null);

    if (!normalizedData) {
      return null;
    }

    const status = getAbhijeetStatus(
      normalizedData.start,
      normalizedData.end,
      payload?.tzone,
    );

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
            variant="bodySmall"
            weight="bold"
            style={{color: colors.primary.main, marginLeft: 8}}>
            Abhijeet Muhurta
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
                {normalizedData.start || 'Not available'}
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
                {normalizedData.end || 'Not available'}
              </Text>
            </View>
          </View>

          {normalizedData.duration ? (
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
                {normalizedData.duration}
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

  const renderRequestSummary = () => {
    if (!payload) {
      return null;
    }

    const summaryItems = [
      {
        label: 'Date',
        value: `${payload.day}/${payload.month}/${payload.year}`,
        icon: 'calendar-today',
      },
      {
        label: 'Time',
        value: `${payload.hour}:${payload.min}`,
        icon: 'access-time',
      },
      {
        label: 'Location',
        value: `${payload.lat}, ${payload.lon}`,
        icon: 'place',
      },
      {
        label: 'Timezone',
        value: `UTC${payload.tzone >= 0 ? '+' : ''}${payload.tzone}`,
        icon: 'public',
      },
    ];

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
          <Icon
            name="info-outline"
            size={18}
            color="#ffffff"
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            weight="bold"
            style={{color: '#ffffff', marginLeft: 8}}>
            Request Summary
          </Text>
        </View>

        <View style={styles.summaryContent}>
          <View style={styles.summaryGrid}>
            {summaryItems.map(item => (
              <View key={item.label} style={styles.summaryItem}>
                <View style={styles.summaryItemHeader}>
                  <Icon
                    name={item.icon as any}
                    size={16}
                    color={colors.primary.main}
                    library="MaterialIcons"
                  />
                  <Text
                    variant="captionSmall"
                    weight="bold"
                    style={{
                      color: colors.text.secondary,
                      marginLeft: 6,
                    }}>
                    {item.label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.valueBadge,
                    {backgroundColor: colors.primary.main + '12'},
                  ]}>
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    style={{color: colors.text.primary}}
                    numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
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
          {serviceTitle || 'Muhurta Details'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderRequestSummary()}

        {renderChaughadiya()}

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
  card: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  summaryHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryContent: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    width: '48%',
    alignItems: 'flex-start',
  },
  summaryItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  valueBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
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
    marginTop: 4,
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
});

export default MuhurtaDetailsView;
