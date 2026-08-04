import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {kundliCards, getKundliCardIcon} from '../utils/kundliService';

type KundliCardsViewProps = {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
  onCardPress?: (card: any) => void;
};

const KundliCardsView: React.FC<KundliCardsViewProps> = ({
  result,
  serviceTitle,
  onBack,
  onCardPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const payload = result?.payload;
  const name = result?.name;

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
    const nameValue = name || '-';

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
          <Text variant="body" weight="bold" style={{color: '#ffffff'}}>
            Birth Details
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
                Name
              </Text>
              <Text
                variant="body"
                weight="bold"
                style={{color: colors.text.primary, textAlign: 'center'}}>
                {nameValue}
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
                Date
              </Text>
              <Text
                variant="body"
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
                variant="body"
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
              Birth Place
            </Text>
            <Text
              variant="body"
              weight="bold"
              style={{color: colors.text.primary, textAlign: 'center'}}>
              {locationValue}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCard = ({item}: {item: any}) => {
    const icon = getKundliCardIcon(item.name);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}
        onPress={() => onCardPress?.(item)}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.primary.light + '20',
            },
          ]}>
          <Icon
            name={icon.name}
            size={24}
            color={colors.primary.main}
            library={icon.library || 'MaterialIcons'}
          />
        </View>

        <Text
          variant="bodySmall"
          weight="bold"
          style={{
            color: colors.text.primary,
            marginTop: 12,
            textAlign: 'center',
          }}>
          {item.name}
        </Text>

        <Text
          variant="captionSmall"
          style={{
            color: colors.text.secondary,
            marginTop: 4,
            textAlign: 'center',
          }}>
          {item.named}
        </Text>
      </TouchableOpacity>
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
          {serviceTitle || 'Kundli'}
        </Text>
      </View>

      <FlatList
        data={kundliCards}
        keyExtractor={item => item.name}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderRequestSummary}
      />
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  summaryCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 16,
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
    gap: 12,
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
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KundliCardsView;
