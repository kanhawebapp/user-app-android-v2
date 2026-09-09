import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {useFreeServicesInteraction} from '../../../../../features/free-services/hooks/useFreeServicesInteraction';
import {getMuhurtaServiceKind} from '../../../../../features/free-services/utils/muhurtaService';
import {isKundliService} from '../../../../../features/free-services/utils/kundliService';
import MuhurtaPanel from '../../../../../features/free-services/components/MuhurtaPanel';
import PanchangPanel from '../../../../../features/free-services/components/PanchangPanel';
import KundliPanel from '../../../../../features/free-services/components/KundliPanel';

export interface FreeServicesRowProps {
  onViewAllPress?: () => void;
  onServicePress?: (service: any) => void;
  style?: any;
}

const FreeServicesRow: React.FC<FreeServicesRowProps> = ({
  onViewAllPress,
  onServicePress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {
    activeServices,
    loading,
    error,
    selectedService,
    setSelectedService,
    handleServicePress,
    handleMuhurtaSuccess,
    handlePanchangSuccess,
    handleKundliSuccess,
  } = useFreeServicesInteraction({ onServicePress });

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary}}>
            Free Services
          </Text>
        </View>
        <Text style={[styles.errorText, {color: colors.text.secondary}]}>
          Unable to load free services
        </Text>
      </View>
    );
  }

  if (!loading && activeServices.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          Free Services
        </Text>
        {onViewAllPress && (
          <TouchableOpacity onPress={onViewAllPress}>
            <Text
              style={{
                color: colors.primary.main,
                fontSize: 13,
                fontWeight: '500',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator size="small" color={colors.primary.main} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {activeServices.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.serviceCard,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.light,
                },
              ]}
              onPress={() => handleServicePress(item)}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: colors.primary.light + '20',
                  },
                ]}>
                <Icon
                  name="auto-awesome"
                  size={22}
                  color={colors.primary.main}
                  library="MaterialIcons"
                />
              </View>
              <Text
                variant="caption"
                weight="semibold"
                numberOfLines={2}
                style={{
                  color: colors.text.primary,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  serviceCard: {
    width: 120,
    minHeight: 80,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  errorText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
});

export default FreeServicesRow;
