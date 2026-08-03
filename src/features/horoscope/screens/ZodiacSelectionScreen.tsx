import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {GoBack} from '../../../components/GoBack';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {horoscopeZodiacSigns} from '../constants/zodiacSigns';
import {ZodiacCard} from '../components/ZodiacCard';
import type {ZodiacSign} from '../constants/zodiacSigns';

const ZodiacSelectionScreen: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handlePress = (sign: ZodiacSign) => {
    navigation.navigate('HoroscopeDetails', {zodiacName: sign.apiName});
  };

  const renderZodiac = ({item}: {item: ZodiacSign}) => (
    <ZodiacCard sign={item} onPress={handlePress} />
  );

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <GoBack title="Horoscope" onBack={() => navigation.goBack()} />

      <Card style={styles.bannerCard}>
        <View style={styles.bannerContent}>
          <Icon
            name="stars"
            size={40}
            color={colors.primary.contrastText}
            library="MaterialIcons"
          />
          <View style={styles.bannerText}>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Daily Horoscope
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: colors.primary.contrastText,
                opacity: 0.9,
                marginTop: 4,
              }}>
              Select your zodiac sign to see your prediction
            </Text>
          </View>
        </View>
      </Card>

      <FlatList
        data={horoscopeZodiacSigns}
        keyExtractor={item => item.id}
        renderItem={renderZodiac}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 30,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ActivityIndicator size="large" color={colors.primary.main} />
          </View>
        }
      />
    </View>
  );
};

export default ZodiacSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerCard: {
    width: '95%',
    marginBottom: 16,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#5B2CA5',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  bannerText: {
    flex: 1,
    marginLeft: 16,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
});
