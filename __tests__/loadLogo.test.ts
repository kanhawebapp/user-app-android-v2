import {Image} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import {INVOICE_LOGO_PNG_BASE64} from '../src/utils/invoice/invoiceLogoBase64';
import {
  loadInvoiceLogoBase64,
  resetLogoCache,
} from '../src/utils/invoice/loadLogo';

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(),
  },
}));

describe('loadInvoiceLogoBase64', () => {
  beforeEach(() => {
    resetLogoCache();
    jest.restoreAllMocks();
  });

  it('falls back to embedded base64 for Android drawable resource URIs', async () => {
    jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
      uri: 'src_assets_images_invoiceimage',
      width: 400,
      height: 150,
      scale: 1,
    } as any);

    const b64 = await loadInvoiceLogoBase64();
    expect(b64).toBe(INVOICE_LOGO_PNG_BASE64);
    expect(b64.startsWith('iVBOR')).toBe(true);
    expect(ReactNativeBlobUtil.fetch).not.toHaveBeenCalled();
  });

  it('fetches when Metro returns an http URI', async () => {
    jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
      uri: 'http://localhost:8081/assets/src/assets/images/invoice-image.png',
      width: 400,
      height: 150,
      scale: 1,
    } as any);

    (ReactNativeBlobUtil.fetch as jest.Mock).mockResolvedValue({
      base64: () => 'ZmV0Y2hlZA==',
    });

    const b64 = await loadInvoiceLogoBase64();
    expect(b64).toBe('ZmV0Y2hlZA==');
    expect(ReactNativeBlobUtil.fetch).toHaveBeenCalled();
  });

  it('uses embedded fallback when fetch fails', async () => {
    jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
      uri: 'http://localhost:8081/assets/logo.png',
      width: 1,
      height: 1,
      scale: 1,
    } as any);

    (ReactNativeBlobUtil.fetch as jest.Mock).mockRejectedValue(
      new Error('network'),
    );

    const b64 = await loadInvoiceLogoBase64();
    expect(b64).toBe(INVOICE_LOGO_PNG_BASE64);
  });
});
