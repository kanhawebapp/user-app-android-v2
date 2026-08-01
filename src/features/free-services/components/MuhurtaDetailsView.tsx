import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {getMuhurtaStyle} from '../utils/muhurtaColors';

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
                    style={[styles.resultItem, itemStyle]}>
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.muhurta || 'No name'}
                    </Text>
                    <Text style={{color: '#ffffff', marginTop: 4}}>
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
                    style={[styles.resultItem, itemStyle]}>
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      style={{color: nameColor}}>
                      {item.muhurta || 'No name'}
                    </Text>
                    <Text style={{color: '#ffffff', marginTop: 4}}>
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

    return (
      <View
        style={[styles.card, {backgroundColor: colors.background.secondary}]}>
        <View style={styles.cardHeader}>
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

        <View style={styles.abhijeetSingleCard}>
          <View style={styles.abhijeetRow}>
            <View
              style={[
                styles.abhijeetIconWrap,
                {backgroundColor: colors.primary.main + '14'},
              ]}>
              <Icon
                name="play-circle-outline"
                size={18}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </View>
            <View style={styles.abhijeetContent}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                }}>
                Start Time
              </Text>
              <Text
                variant="h6"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 2}}>
                {normalizedData.start || 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.abhijeetDivider} />

          <View style={styles.abhijeetRow}>
            <View
              style={[
                styles.abhijeetIconWrap,
                {backgroundColor: colors.primary.main + '14'},
              ]}>
              <Icon
                name="stop-circle-outline"
                size={18}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </View>
            <View style={styles.abhijeetContent}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                }}>
                End Time
              </Text>
              <Text
                variant="h6"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 2}}>
                {normalizedData.end || 'Not available'}
              </Text>
            </View>
          </View>

          {normalizedData.duration ? (
            <>
              <View style={styles.abhijeetDivider} />
              <View style={styles.abhijeetRow}>
                <View
                  style={[
                    styles.abhijeetIconWrap,
                    {backgroundColor: colors.primary.main + '14'},
                  ]}>
                  <Icon
                    name="hourglass-empty"
                    size={18}
                    color={colors.primary.main}
                    library="MaterialIcons"
                  />
                </View>
                <View style={styles.abhijeetContent}>
                  <Text
                    variant="captionSmall"
                    weight="bold"
                    style={{
                      color: colors.text.secondary,
                      textTransform: 'uppercase',
                    }}>
                    Duration
                  </Text>
                  <Text
                    variant="h6"
                    weight="bold"
                    style={{color: colors.text.primary, marginTop: 2}}>
                    {normalizedData.duration}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  timeBlockGradient: {
    borderRadius: 14,
    padding: 16,
    width: '48%',
    minWidth: 140,
    marginBottom: 10,
  },
  timeBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  additionalSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,42,0.08)',
  },
  additionalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  abhijeetSingleCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 14,
  },
  abhijeetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abhijeetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  abhijeetContent: {
    flex: 1,
  },
  abhijeetDivider: {
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.08)',
    marginVertical: 10,
  },
  resultSection: {
    marginBottom: 12,
  },
  resultList: {
    gap: 8,
  },
  resultItem: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
});

export default MuhurtaDetailsView;
