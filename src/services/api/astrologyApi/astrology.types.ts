export type AstrologyServiceType = 'chaughadiya' | 'abhijeet';

export type TimeValue =
  | string
  | {hour: number; minute: number; second?: number; min?: number; sec?: number};

export interface AstrologyMuhurtaPayload {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

export interface ChaughadiyaMuhurtaResponse {
  chaughadiya?: {
    day?: {
      time?: string;
      muhurta_name?: string;
    } | null;
    night?: {
      time?: string;
      muhurta_name?: string;
    } | null;
  } | null;
}

export interface AbhijeetMuhurtaResponse {
  abhijit_muhurta?: {
    start?: string;
    end?: string;
  } | null;
}

export interface AdvancedPanchangResponse {
  day?: string;
  sunrise?: TimeValue;
  sunset?: TimeValue;
  moonrise?: TimeValue;
  moonset?: TimeValue;
  tithi?: {
    details?: {
      tithi_number?: string;
      tithi_name?: string;
      special?: string;
      deity?: string;
      summary?: string;
    };
    end_time?: TimeValue;
  };
  nakshatra?: {
    details?: {
      nak_number?: string;
      nak_name?: string;
      ruler?: string;
      deity?: string;
      special?: string;
      summary?: string;
    };
    end_time?: TimeValue;
  };
  yog?: {
    details?: {
      yog_number?: string;
      yog_name?: string;
      special?: string;
      meaning?: string;
    };
    end_time?: TimeValue;
  };
  karan?: {
    details?: {
      karan_number?: string;
      karan_name?: string;
      deity?: string;
      special?: string;
    };
    end_time?: TimeValue;
  };
  rahukaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  yamghant_kaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  guliKaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  abhijit_muhurta?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  paksha?: string;
  ritu?: string;
  sun_sign?: string;
  moon_sign?: string;
  ayana?: string;
  vikram_samvat?: string;
  vkram_samvat_name?: string;
  shaka_samvat?: string;
  shaka_samvat_name?: string;
  disha_shool?: string;
  disha_shool_remedies?: string;
}

export interface HoraMuhurtaResponse {
  hora?: {
    day?: Array<{
      time?: string;
      hora?: string;
    }> | null;
    night?: Array<{
      time?: string;
      hora?: string;
    }> | null;
  } | null;
}

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}
