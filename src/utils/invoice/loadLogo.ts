import {Image} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

const logoRequire = require('../../assets/images/invoice-image.png');

let cachedBase64: string | null = null;

export const loadInvoiceLogoBase64 = async (): Promise<string> => {
  if (cachedBase64) {
    return cachedBase64;
  }
  const {uri} = Image.resolveAssetSource(logoRequire);
  const resp = await ReactNativeBlobUtil.fetch('GET', uri, {
    'Content-Type': 'application/octet-stream',
  });
  cachedBase64 = resp.base64();
  if (!cachedBase64) {
    throw new Error('Failed to load invoice logo image');
  }
  return cachedBase64;
};

export const resetLogoCache = (): void => {
  cachedBase64 = null;
};
