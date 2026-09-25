/**
 * Kundli Dosha list screen: fetches all four dosha APIs in parallel and
 * shows one row per dosha with its `Present` status (from the API) and a
 * "View" action that opens the matching detail screen.
 */

import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {SkeletonLoader} from '../../../components/SkeletonLoader';
import {useTheme} from '../../../theme';
import type {IconProps} from '../../../components/Icon/iconType';
import {useManglik} from '../hooks/useManglik';
import {useKalsarpa} from '../hooks/useKalsarpa';
import {usePitraDosha} from '../hooks/usePitraDosha';
import {useSadeSati} from '../hooks/useSadeSati';
import {buildBasicDetailsPayload} from '../utils/kundliService';
import {presentText} from '../utils/doshaReport';
import ListStateView from './ListStateView';

export interface KundliDoshaViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
  /** Called with the tapped dosha item (carries the detail screen name). */
  onDoshaPress: (item: DoshaListItem) => void;
}

export interface DoshaListItem {
  key: string;
  name: string;
  icon: IconProps;
  screen: string;
  present: boolean | null;
  loading: boolean;
  error: any;
  reload: () => void;
}

const DOSE_ICONS: Record<string, IconProps> = {
  manglik: {name: 'warning', library: 'MaterialIcons'},
  kalsarpa: {name: 'swap-horiz', library: 'MaterialIcons'},
  pitra: {name: 'spa', library: 'MaterialIcons'},
  sadesati: {name: 'tune', library: 'MaterialIcons'},
};

const KundliDoshaView: React.FC<KundliDoshaViewProps> = ({
  result,
  serviceTitle,
  onBack,
  onDoshaPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const payload = useMemo(
    () => buildBasicDetailsPayload(result?.payload),
    [result?.payload],
  );

  const manglik = useManglik(payload);
  const kalsarpa = useKalsarpa(payload);
  const pitra = usePitraDosha(payload);
  const sadeSati = useSadeSati(payload);

  const items: DoshaListItem[] = [
    {
      key: 'manglik',
      name: 'Manglik Dosha',
      icon: DOSE_ICONS.manglik,
      screen: 'ManglikDosha',
      present: manglik.data?.present ?? null,
      loading: manglik.loading,
      error: manglik.error,
      reload: manglik.reload,
    },
    {
      key: 'kalsarpa',
      name: 'Kaal Sarp Dosha',
      icon: DOSE_ICONS.kalsarpa,
      screen: 'KalsarpaDosha',
      present: kalsarpa.data?.present ?? null,
      loading: kalsarpa.loading,
      error: kalsarpa.error,
      reload: kalsarpa.reload,
    },
    {
      key: 'pitra',
      name: 'Pitra Dosha',
      icon: DOSE_ICONS.pitra,
      screen: 'PitraDosha',
      present: pitra.data?.present ?? null,
      loading: pitra.loading,
      error: pitra.error,
      reload: pitra.reload,
    },
    {
      key: 'sadesati',
      name: 'Sade Sati',
      icon: DOSE_ICONS.sadesati,
      screen: 'SadeSati',
      present: sadeSati.data?.present ?? null,
      loading: sadeSati.loading,
      error: sadeSati.error,
      reload: sadeSati.reload,
    },
  ];

  const renderPresentRow = (item: DoshaListItem) => {
    if (item.loading && item.present === null) {
      return (
        <View style={styles.presentRow}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.secondary, marginRight: 8}}>
            Present:
          </Text>
          <SkeletonLoader width={64} height={12} />
        </View>
      );
    }

    if (item.error && item.present === null) {
      return (
        <View style={styles.presentRow}>
          <Text
            variant="captionSmall"
            style={{color: colors.error.main, marginRight: 12}}>
            Failed to load
          </Text>
          <TouchableOpacity onPress={item.reload} hitSlop={8}>
            <Text
              variant="captionSmall"
              weight="semibold"
              style={{
                color: colors.primary.main,
                textDecorationLine: 'underline',
              }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    const present = item.present;
    const presentColor =
      present === null
        ? colors.text.tertiary
        : present
        ? colors.success.main
        : colors.error.main;

    return (
      <View style={styles.presentRow}>
        <Text
          variant="bodySmall"
          style={{color: colors.text.secondary, marginRight: 8}}>
          Present:
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          style={{color: presentColor}}>
          {presentText(present)}
        </Text>
      </View>
    );
  };

  const renderCard = ({item}: {item: DoshaListItem}) => (
    <Card variant="elevated" style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardPressable}
        onPress={() => onDoshaPress(item)}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.light + '20'},
          ]}>
          <Icon
            name={item.icon.name}
            size={22}
            color={colors.primary.main}
            library={item.icon.library || 'MaterialIcons'}
          />
        </View>

        <View style={styles.cardBody}>
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary}}>
            {item.name}
          </Text>
          {renderPresentRow(item)}
        </View>

        <View style={styles.viewAction}>
          <Text
            variant="bodySmall"
            weight="semibold"
            style={{color: colors.primary.main}}>
            View
          </Text>
          <Icon
            name="chevron-right"
            size={20}
            color={colors.text.tertiary}
            library="MaterialIcons"
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (!payload) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        {renderHeader(onBack, serviceTitle, colors, true)}
        <View style={styles.body}>
          <ListStateView
            empty
            emptyText="Birth details are missing. Please go back and re-enter your birth details."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {renderHeader(onBack, serviceTitle, colors, false)}

      <FlatList
        data={items}
        keyExtractor={item => item.key}
        renderItem={renderCard}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            variant="captionSmall"
            style={{
              color: colors.text.secondary,
              marginBottom: 12,
              textAlign: 'center',
            }}>
            Dosh checks based on your birth details
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const renderHeader = (
  onBack: () => void,
  serviceTitle: string | undefined,
  colors: any,
  includeSubtitle: boolean,
) => (
  <View>
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
        {serviceTitle || 'Dosha in Kundli'}
      </Text>
    </View>
    {includeSubtitle ? (
      <Text
        variant="captionSmall"
        style={{color: colors.text.secondary, textAlign: 'center'}}>
        Dosh checks based on your birth details
      </Text>
    ) : null}
  </View>
);

export default React.memo(KundliDoshaView);

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
  body: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 14,
  },
  cardPressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  presentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  viewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});
