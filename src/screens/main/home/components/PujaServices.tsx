import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Card } from '../../../../components';
import { Icon } from '../../../../components/Icon';
import { Button } from '../../../../components/Button';
import { usePujaServices } from '../../../../services/api/pujaServices/usePujaServices';
import { PujaService } from '../../../../services/api/pujaServices/puja-services.types';
import { API_BASE_URL } from '../../../../constants/api.constants';
import { useNavigation } from '@react-navigation/native';

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL.DEVELOPMENT}${url.replace(/^\/+/, '')}`;
};

const PujaCard = React.memo(({ item, onPress }: { item: PujaService; onPress: () => void }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const imageUrl = useMemo(() => getImageUrl(item.image), [item.image]);
  const price = Number(item.price);
  const mrp = Number(item.mrp);
  const discount = Number(item.discount);
  const rating = Number(item.rating);
  return (
    <Card style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.background.secondary }]} />
      )}
      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}%</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text variant="label" weight="semibold" numberOfLines={1} style={{ color: colors.text.primary }}>
          {item.title}
        </Text>
        <Text variant="caption" numberOfLines={2} style={{ color: colors.text.secondary, marginTop: 4 }}>
          {item.shortDescription}
        </Text>
        <View style={styles.ratingRow}>
          <Icon library="Ionicons" name="star" size={14} color="#FFB300" />
          <Text variant="caption" style={{ color: colors.text.secondary, marginLeft: 4 }}>
            {Number.isFinite(rating) ? rating : 0} by devotees
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text weight="bold" style={{ color: colors.primary.main }}>
            ₹{Number.isFinite(price) ? price : 0}
          </Text>
          {mrp > price && (
            <Text style={{ color: colors.text.secondary, textDecorationLine: 'line-through', marginLeft: 8 }}>
              ₹{mrp}
            </Text>
          )}
        </View>
        {/* <Button title="Book Now" onPress={onPress} /> */}
      </View>
    </Card>
  );
});

const PujaServices: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation();
  const { services, loading, error } = usePujaServices();

  const handlePress = useCallback((slug: string) => {
    navigation.navigate('PujaServiceDetails' as never, { slug } as never);
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, paddingHorizontal: 16 }}>
          Puja Services
        </Text>
        <Text style={{ paddingHorizontal: 16, marginTop: 8, color: colors.text.secondary }}>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, paddingHorizontal: 16 }}>
          Puja Services
        </Text>
        <Text style={{ paddingHorizontal: 16, marginTop: 8, color: colors.text.secondary }}>Unable to load puja services</Text>
      </View>
    );
  }
  if (!services || services.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, paddingHorizontal: 16, }}>
          Puja Services
        </Text>
        <Text style={{ paddingHorizontal: 16, marginTop: 8, color: colors.text.secondary }}>No puja services available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h6" weight="semibold" style={{ color: colors.text.primary, paddingHorizontal: 16, marginBottom: 12, marginTop: 8 }}>
        Puja Services
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {services.map(item => (
          <PujaCard key={item.id} item={item} onPress={() => handlePress(item.slug)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  card: { width: 220, marginHorizontal: 4, overflow: 'hidden', padding: 0 },
  image: { width: '100%', height: 140 },
  discountBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#E53935', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  content: { padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 8 },
});

export default PujaServices;
