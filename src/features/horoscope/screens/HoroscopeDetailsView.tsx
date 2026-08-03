import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useToast} from '../../../context/ToastContext';
import {getZodiacById} from '../constants/zodiacSigns';
import {HoroscopeHeader} from '../components/HoroscopeHeader';
import {TabSelector} from '../components/TabSelector';
import {PredictionList} from '../components/PredictionList';
import {RatingSection} from '../components/RatingSection';
import {useHoroscopePrediction} from '../hooks/useHoroscopePrediction';
import type {HoroscopeTab} from '../../../services/api/astrologyApi/astrology.types';

export interface HoroscopeDetailsViewProps {
  zodiacName: string;
  onBack: () => void;
}

const HoroscopeDetailsView: React.FC<HoroscopeDetailsViewProps> = ({
  zodiacName,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  const {activeTab, setActiveTab, data, loading, error, reload} =
    useHoroscopePrediction(zodiacName);

  const sign = useCallback(() => getZodiacById(zodiacName), [zodiacName])();

  // Surface API errors through the existing toast.
  useEffect(() => {
    if (error) {
      showError(error?.message || 'Failed to load horoscope prediction.');
    }
  }, [error, showError]);

  const handleRetry = useCallback(() => {
    reload();
  }, [reload]);

  const showLoader = loading && !data;
  const showErrorView = !loading && !data && Boolean(error);

  const renderContent = () => {
    if (showLoader) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (showErrorView) {
      return (
        <View style={[styles.center, {marginTop: 40}]}>
          <Icon
            name="error-outline"
            size={40}
            color={colors.error.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            style={{
              color: colors.text.secondary,
              marginTop: 12,
              textAlign: 'center',
            }}>
            {error?.message || 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: colors.primary.main}]}
            onPress={handleRetry}
            activeOpacity={0.85}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!data) {
      return (
        <View style={styles.center}>
          <Text variant="bodySmall" style={{color: colors.text.tertiary}}>
            No prediction available
          </Text>
        </View>
      );
    }

    return (
      <>
        <PredictionList sections={data.sections} />
        {data.hasRatings ? <RatingSection sections={data.sections} /> : null}
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <HoroscopeHeader sign={sign} onBack={onBack} />

      <TabSelector
        activeTab={activeTab}
        onChangeTab={setActiveTab as (tab: HoroscopeTab) => void}
        disabled={loading}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HoroscopeDetailsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
});
