import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme';
import { Text } from '../../../components/Text';
import { Icon } from '../../../components/Icon';
import { Card } from '../../../components/Card';
import { useFreeServices } from '../../../services/api/freeServices/useFreeServices';
import { GoBack } from '../../../components';

interface FreeServicesScreenProps {
  onNavigateBack?: () => void;
  onServicePress?: (service: any) => void;
}

const getServiceIcon = (title: string) => {
  const name = title.toLowerCase();

  if (name.includes('horoscope')) return 'stars';
  if (name.includes('kundali')) return 'auto-awesome';
  if (name.includes('numerology')) return 'pin';
  if (name.includes('panchang')) return 'calendar-today';
  if (name.includes('chaughadiya')) return 'schedule';
  if (name.includes('muhurat')) return 'event';

  return 'dashboard';
};

const getServiceColor = (title: string, colors: any) => {
  const name = title.toLowerCase();

  if (name.includes('horoscope')) return colors.primary.main;

  if (name.includes('kundali')) return colors.secondary.main;

  if (name.includes('numerology')) return '#06B6D4';

  if (name.includes('panchang')) return '#F97316';

  if (name.includes('chaughadiya')) return '#8B5CF6';

  if (name.includes('muhurat')) return '#10B981';

  return colors.primary.main;
};

const FreeServicesScreen: React.FC<FreeServicesScreenProps> = ({
  onNavigateBack,
  onServicePress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const { data: services, loading } = useFreeServices();

  const activeServices =
    services
      ?.filter(item => item.isActive)
      ?.sort((a, b) => a.order - b.order) || [];


  const renderService = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.serviceCard,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}>
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
      <Text
        variant="captionSmall"
        style={{
          color: colors.text.secondary,
          marginTop: 4,
        }}>
        Display Order: {item.order}
      </Text>

      {/* Slug */}
      <Text
        numberOfLines={1}
        variant="captionSmall"
        style={{
          color: colors.text.tertiary,
          marginTop: 8,
        }}>
        Slug: {item.slug}
      </Text>

      {/* Href */}
      <Text
        numberOfLines={1}
        variant="captionSmall"
        style={{
          color: colors.primary.main,
          marginTop: 2,
        }}>
        {item.href}
      </Text>

      {/* Footer */}
      <View style={styles.footerRow}>
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
      </View>
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
      <GoBack onBack={onNavigateBack} title='Free Services' />

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
