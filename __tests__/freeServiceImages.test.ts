import {
  FREE_SERVICE_ICON_BOX,
  getFreeServiceIconConfig,
  getFreeServiceIconKey,
} from '../src/features/free-services/utils/freeServiceImages';
import {images} from '../src/assets/images';

describe('getFreeServiceIconKey', () => {
  it('maps each service to the matching asset key', () => {
    expect(getFreeServiceIconKey({title: 'Abhijeet Muhurata'})).toBe(
      'abhijeet',
    );
    expect(getFreeServiceIconKey({title: 'Horoscope'})).toBe('horoscope');
    expect(getFreeServiceIconKey({title: 'Panchang'})).toBe('panchang');
    expect(getFreeServiceIconKey({title: 'Chaughadiya Muhurata'})).toBe(
      'chaughadiya',
    );
    expect(getFreeServiceIconKey({title: 'Kundli'})).toBe('kundli');
  });
});

describe('getFreeServiceIconConfig', () => {
  const services = [
    {title: 'Abhijeet', source: images.Abhijeet, key: 'abhijeet'},
    {title: 'Horoscope', source: images.Horoscope, key: 'horoscope'},
    {title: 'Panchang', source: images.Panchang, key: 'panchang'},
    {title: 'Chaughadiya', source: images.Chaughadiya, key: 'chaughadiya'},
    {title: 'Kundli', source: images.Kundli, key: 'kundli'},
  ] as const;

  it('returns the existing local asset for every service', () => {
    services.forEach(service => {
      const config = getFreeServiceIconConfig({title: service.title});
      expect(config?.key).toBe(service.key);
      expect(config?.source).toBe(service.source);
    });
  });

  it('keeps every icon inside the 64px box with ~56px visible size', () => {
    services.forEach(service => {
      const config = getFreeServiceIconConfig({title: service.title});
      expect(config).toBeDefined();
      expect(FREE_SERVICE_ICON_BOX).toBe(64);
      expect(config!.renderSize).toBeGreaterThanOrEqual(56);
      expect(config!.renderSize).toBeLessThanOrEqual(100);
    });
  });
});
