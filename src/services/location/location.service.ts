export interface IPData {
  ip: string;
  city: string;
  state: string;
  country: string;
}

const DEFAULT_IP_DATA: IPData = {
  ip: '',
  city: '',
  state: '',
  country: '',
};

export const getIPLocation = async (): Promise<IPData> => {
  try {
    const response = await fetch('https://ipwho.is/');

    if (response.ok) {
      const data = await response.json();

      console.log('[LocationService] ipwho.is response:', data);

      if (data?.success !== false) {
        return {
          ip: data?.ip || '',
          city: data?.city || '',
          state: data?.region || '',
          country: data?.country || '',
        };
      }
    }
  } catch (error) {
    console.log('[LocationService] ipwho.is failed:', error);
  }

  try {
    const response = await fetch('https://ipapi.co/json/');

    if (response.ok) {
      const data = await response.json();

      console.log('[LocationService] ipapi.co response:', data);

      return {
        ip: data?.ip || '',
        city: data?.city || '',
        state: data?.region || '',
        country: data?.country_name || '',
      };
    }
  } catch (error) {
    console.log('[LocationService] ipapi.co failed:', error);
  }

  console.log('[LocationService] Using default empty IP data');
  return DEFAULT_IP_DATA;
};
