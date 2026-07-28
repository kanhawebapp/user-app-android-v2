import {useEffect, useState} from 'react';

import {getServices} from './services.api';

import {Service} from './services.types';

export const useServices = () => {
  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchServices =
    async () => {
      try {
        setLoading(true);

        setError(null);

        const response =
          await getServices();

        setServices(response || []);
      } catch (err: any) {
        console.log(
          'SERVICES HOOK ERROR:',
          err,
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,

    loading,

    error,

    refresh: fetchServices,
  };
};