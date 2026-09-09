import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme';
import { Text } from '../../../components/Text';
import { Icon } from '../../../components/Icon';
import { Card } from '../../../components/Card';
import { useFreeServices } from '../../../services/api/freeServices/useFreeServices';
import { GoBack } from '../../../components';
import MuhurtaPanel from '../components/MuhurtaPanel';
import PanchangPanel from '../components/PanchangPanel';
import KundliPanel from '../components/KundliPanel';
import { getMuhurtaServiceKind } from '../utils/muhurtaService';
import { isKundliService } from '../utils/kundliService';

interface FreeServicesScreenProps {
  onNavigateBack?: () => void;
  onServicePress?: (service: any) => void;
}

const FreeServicesScreen: React.FC<FreeServicesScreenProps> = ({
  onNavigateBack,
  onServicePress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();
  const { data: services, loading } = useFreeServices();
  const [selectedService, setSelectedService] = useState<any | null>(null);


  const activeServices = useMemo(
    () =>
      services
        ?.filter(
          item =>
            item.isActive &&
            item.slug !== 'freeservices/numerology' &&
            item.title?.toLowerCase() !== 'numerology',
        )
        ?.sort((a, b) => a.order - b.order) || [],
    [services],
  );

  console.log('Active Services:', activeServices);

  const isHoroscopeService = (item: any) => {
    const slug = (item?.slug || '').toLowerCase();
    const title = (item?.title || '').toLowerCase();
    return (
      slug === 'horoscope' ||
      title === 'horoscope' ||
      title.includes('horoscope')
    );
  };

  const handleServicePress = (item: any) => {
    const title = item?.title || '';
    const kind = getMuhurtaServiceKind(title);
    if (kind !== 'other') {
      setSelectedService(item);
      return;
    }

    if (isKundliService(title)) {
      setSelectedService(item);
      return;
    }

    if (isHoroscopeService(item)) {
      navigation.navigate('Horoscope');
      return;
    }

    onServicePress?.(item);
  };

  const handleMuhurtaSuccess = (result: any) => {
    navigation.navigate('MuhurtaDetails', {
      result,
      serviceTitle: selectedService?.title,
    });
  };

  const handlePanchangSuccess = (result: any) => {
    navigation.navigate('PanchangDetails', {
      result,
      serviceTitle: selectedService?.title,
    });
  };

  const handleKundliSuccess = (result: any) => {
    navigation.navigate('KundliCards', {
      result,
      serviceTitle: selectedService?.title,
    });
  };

  const renderService = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.serviceCard,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}
      onPress={() => handleServicePress(item)}>
      {/* Top Row */}
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.primary.light + '20',
            },
          ]}>
          <Icon
            name="auto-awesome"
            size={24}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.isActive ? '#DCFCE7' : '#FEE2E2',
            },
          ]}>
          <Text
            variant="captionSmall"
            weight="semibold"
            style={{
              color: item.isActive ? '#16A34A' : '#DC2626',
            }}>
            {item.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text
        variant="body"
        weight="bold"
        style={{
          color: colors.text.primary,
          marginTop: 12,
        }}>
        {item.title}
      </Text>

      {/* Order */}
      {/* <Text
        variant="captionSmall"
        style={{
          color: colors.text.secondary,
          marginTop: 4,
        }}>
        Display Order: {item.order}
      </Text> */}

      {/* Slug */}
      {/* <Text
        numberOfLines={1}
        variant="captionSmall"
        style={{
          color: colors.text.tertiary,
          marginTop: 8,
        }}>
        Slug: {item.slug}
      </Text>

      {/* Href */}
      {/* <Text
        numberOfLines={1}
        variant="captionSmall"
        style={{
          color: colors.primary.main,
          marginTop: 2,
        }}>
        {item.href}
      </Text> */}

      {/* Footer */}
      {/* <View style={styles.footerRow}>
        <Text
          variant="captionSmall"
          style={{
            color: colors.text.tertiary,
          }}>
          #{item.order}
        </Text>

        <Text
          variant="captionSmall"
          style={{
            color: colors.text.tertiary,
          }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View> */}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
        },
      ]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <GoBack onBack={onNavigateBack} title="Free Services" />

      <Card style={styles.bannerCard}>
        <View style={styles.bannerContent}>
          <Icon
            name="card-giftcard"
            size={40}
            color="#FFF"
            library="MaterialIcons"
          />

          <View style={styles.bannerText}>
            <Text variant="h6" weight="bold" style={{ color: '#FFF' }}>
              Free Astrology Services
            </Text>

            <Text
              variant="bodySmall"
              style={{
                color: '#FFF',
                opacity: 0.9,
                marginTop: 4,
              }}>
              Total Services: {services?.length || 0}
            </Text>
          </View>
        </View>
      </Card>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={activeServices}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={renderService}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 30,
          }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon
                name="inbox"
                size={60}
                color={colors.text.tertiary}
                library="MaterialIcons"
              />

              <Text
                variant="body"
                style={{
                  marginTop: 12,
                  color: colors.text.secondary,
                }}>
                No free services found
              </Text>
            </View>
          }
        />
      )}

      {selectedService ? (
        isKundliService(selectedService.title) ? (
          <KundliPanel
            visible={Boolean(selectedService)}
            serviceTitle={selectedService.title}
            onClose={() => setSelectedService(null)}
            onSuccess={handleKundliSuccess}
          />
        ) : getMuhurtaServiceKind(selectedService.title) === 'panchang' ? (
          <PanchangPanel
            visible={Boolean(selectedService)}
            serviceTitle={selectedService.title}
            onClose={() => setSelectedService(null)}
            onSuccess={handlePanchangSuccess}
          />
        ) : (
          <MuhurtaPanel
            visible={Boolean(selectedService)}
            serviceTitle={selectedService.title}
            onClose={() => setSelectedService(null)}
            onSuccess={handleMuhurtaSuccess}
          />
        )
      ) : null}
    </View>
  );
};

export default FreeServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  backButton: {
    padding: 8,
  },

  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardWrapper: {
    width: '48%',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },

  // iconContainer: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  serviceCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },

  bannerCard: {
    width: '95%',
    padding: 20,
    marginBottom: 24,
    borderRadius: 20,
    // overflow: 'hidden',
    // marginHorizontal: 16,
    alignSelf: 'center',

    // Gradient use nahi kar rahe to solid primary color
    backgroundColor: '#6D28D9',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bannerText: {
    flex: 1,
    marginLeft: 16,
  },

  bannerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
