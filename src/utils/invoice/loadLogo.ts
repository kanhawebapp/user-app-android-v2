import {Image, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import {INVOICE_LOGO_PNG_BASE64} from './invoiceLogoBase64';

const logoRequire = require('../../assets/images/invoice-image.png');

let cachedBase64: string | null = null;

const isFetchableUri = (uri: string): boolean =>
  /^(https?|file):\/\//i.test(uri);

/**
 * Loads the invoice logo as base64.
 *
 * Metro/dev: Image.resolveAssetSource returns an http(s) URI — fetch works.
 * Bundled Debug/Release APK (no Metro): Android returns a drawable resource
 * identifier (e.g. "src_assets_images_invoiceimage"), which cannot be fetched
 * with ReactNativeBlobUtil. In that case we use the embedded PNG base64.
 */
export const loadInvoiceLogoBase64 = async (): Promise<string> => {
  if (cachedBase64) {
    return cachedBase64;
  }

  try {
    const source = Image.resolveAssetSource(logoRequire);
    const uri = source?.uri;

    console.log('INVOICE LOGO RESOLVE:', {
      platform: Platform.OS,
      uri: uri ?? null,
      fetchable: uri ? isFetchableUri(uri) : false,
    });

    if (uri && isFetchableUri(uri)) {
      const resp = await ReactNativeBlobUtil.fetch('GET', uri, {
        'Content-Type': 'application/octet-stream',
      });
      const fromFetch = resp.base64();
      if (fromFetch && fromFetch.length > 0) {
        cachedBase64 = fromFetch;
        console.log('INVOICE LOGO LOADED via fetch, chars:', fromFetch.length);
        return cachedBase64;
      }
      console.log('INVOICE LOGO FETCH EMPTY, using embedded fallback');
    } else {
      console.log(
        'INVOICE LOGO non-fetchable URI (bundled drawable) — using embedded fallback',
      );
    }
  } catch (e) {
    console.log('INVOICE LOGO FETCH ERROR, using embedded fallback:', e);
  }

  if (!INVOICE_LOGO_PNG_BASE64) {
    throw new Error('Failed to load invoice logo image');
  }

  cachedBase64 = INVOICE_LOGO_PNG_BASE64;
  console.log(
    'INVOICE LOGO LOADED via embedded base64, chars:',
    cachedBase64.length,
  );
  return cachedBase64;
};

export const resetLogoCache = (): void => {
  cachedBase64 = null;
};
