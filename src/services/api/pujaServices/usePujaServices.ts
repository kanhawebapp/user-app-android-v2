import {useCallback, useEffect, useState} from 'react';
import {getPujaServices} from './puja-services.api';
import {PujaService} from './puja-services.types';

export const usePujaServices = () => {
  const [services, setServices] = useState<PujaService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPujaServices();
      setServices(response || []);
    } catch (err: any) {
      console.log('PUJA SERVICES HOOK ERROR:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {services, loading, error, refresh: fetchServices};
};
