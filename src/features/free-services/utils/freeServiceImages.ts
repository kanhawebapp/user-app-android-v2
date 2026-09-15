import type {ImageSourcePropType} from 'react-native';

import {images} from '../../../assets/images';
import {isKundliService} from './kundliService';
import {getMuhurtaServiceKind} from './muhurtaService';

type FreeServiceImageLookup = {
  title?: string;
  slug?: string;
};

export type FreeServiceIconKey =
  | 'abhijeet'
  | 'horoscope'
  | 'panchang'
  | 'chaughadiya'
  | 'kundli';

export type FreeServiceIconConfig = {
  key: FreeServiceIconKey;
  source: ImageSourcePropType;
  renderSize: number;
  translateX: number;
  translateY: number;
};

export const FREE_SERVICE_ICON_BOX = 64;
const VISIBLE_ICON_SIZE = 56;
const ASSET_CANVAS_SIZE = 1254;

/**
 * Opaque-pixel bounds of each PNG on its 1254×1254 canvas.
 * Used to enlarge padded assets so the visible icon fills ~56px
 * of the 64px box without cropping the artwork.
 */
const ASSET_CONTENT_BOUNDS: Record<
  FreeServiceIconKey,
  {minX: number; minY: number; maxX: number; maxY: number}
> = {
  abhijeet: {minX: 221, minY: 185, maxX: 944, maxY: 891},
  horoscope: {minX: 46, minY: 61, maxX: 1204, maxY: 1200},
  panchang: {minX: 210, minY: 149, maxX: 981, maxY: 901},
  chaughadiya: {minX: 207, minY: 216, maxX: 1044, maxY: 1037},
  kundli: {minX: 75, minY: 77, maxX: 1178, maxY: 1179},
};

const ASSET_SOURCES: Record<FreeServiceIconKey, ImageSourcePropType> = {
  abhijeet: images.Abhijeet,
  horoscope: images.Horoscope,
  panchang: images.Panchang,
  chaughadiya: images.Chaughadiya,
  kundli: images.Kundli,
};

const getLayout = (
  key: FreeServiceIconKey,
): Pick<FreeServiceIconConfig, 'renderSize' | 'translateX' | 'translateY'> => {
  const {minX, minY, maxX, maxY} = ASSET_CONTENT_BOUNDS[key];
  const fill = Math.max(maxX - minX + 1, maxY - minY + 1) / ASSET_CANVAS_SIZE;
  const renderSize = Math.round(VISIBLE_ICON_SIZE / fill);
  const centerX = (minX + maxX + 1) / 2 / ASSET_CANVAS_SIZE;
  const centerY = (minY + maxY + 1) / 2 / ASSET_CANVAS_SIZE;

  return {
    renderSize,
    translateX: Number((-(centerX - 0.5) * renderSize).toFixed(1)),
    translateY: Number((-(centerY - 0.5) * renderSize).toFixed(1)),
  };
};

export const getFreeServiceIconKey = (
  service: FreeServiceImageLookup,
): FreeServiceIconKey | undefined => {
  const lookupText = `${service?.title || ''} ${service?.slug || ''}`;
  const kind = getMuhurtaServiceKind(lookupText);

  if (kind === 'abhijeet') {
    return 'abhijeet';
  }
  if (kind === 'panchang') {
    return 'panchang';
  }
  if (kind === 'chaughadiya') {
    return 'chaughadiya';
  }
  if (isKundliService(lookupText)) {
    return 'kundli';
  }
  if (lookupText.toLowerCase().includes('horoscope')) {
    return 'horoscope';
  }

  return undefined;
};

export const getFreeServiceIconConfig = (
  service: FreeServiceImageLookup,
): FreeServiceIconConfig | undefined => {
  const key = getFreeServiceIconKey(service);
  if (!key) {
    return undefined;
  }

  return {
    key,
    source: ASSET_SOURCES[key],
    ...getLayout(key),
  };
};
