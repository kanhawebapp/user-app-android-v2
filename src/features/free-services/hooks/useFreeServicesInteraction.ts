import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useFreeServices} from '../../../services/api/freeServices/useFreeServices';
import {getMuhurtaServiceKind} from '../utils/muhurtaService';
import {isKundliService} from '../utils/kundliService';
import type {FreeService} from '../../../services/api/freeServices/free-services.types';

export interface UseFreeServicesInteractionOptions {
  onServicePress?: (service: FreeService) => void;
}

export interface UseFreeServicesInteractionResult {
  services: FreeService[];
  activeServices: FreeService[];
  loading: boolean;
  error: any;
  refresh: () => void;
  selectedService: FreeService | null;
  setSelectedService: (service: FreeService | null) => void;
  handleServicePress: (item: FreeService) => void;
  handleMuhurtaSuccess: (result: any) => void;
  handlePanchangSuccess: (result: any) => void;
  handleKundliSuccess: (result: any) => void;
}

export const useFreeServicesInteraction = ({
  onServicePress,
}: UseFreeServicesInteractionOptions = {}): UseFreeServicesInteractionResult => {
  const navigation = useNavigation<any>();
  const {data: services, loading, error, refresh} = useFreeServices();
  const [selectedService, setSelectedService] = useState<FreeService | null>(
    null,
  );

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

  const isHoroscopeService = (item: FreeService) => {
    const slug = (item?.slug || '').toLowerCase();
    const title = (item?.title || '').toLowerCase();
    return (
      slug === 'horoscope' ||
      title === 'horoscope' ||
      title.includes('horoscope')
    );
  };

  const handleServicePress = (item: FreeService) => {
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

  return {
    services,
    activeServices,
    loading,
    error,
    refresh,
    selectedService,
    setSelectedService,
    handleServicePress,
    handleMuhurtaSuccess,
    handlePanchangSuccess,
    handleKundliSuccess,
  };
};
