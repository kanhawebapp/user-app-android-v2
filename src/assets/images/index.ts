import FastImage from 'react-native-fast-image';

const images = {
  Logo: require('./Logo3.png'),
  Splash1: require('./splash7.jpg'),
  Splash2: require('./splash8.png'),
  Banner1: require('./banner1.png'),
  Banner2: require('./banner2.png'),
  Banner3: require('./banner3.png'),
  AstrologerCard1: require('./astro.webp'),
  SplashTop: require('./splashTop.png'),
  Logo2: require('./Logo.png'),
  Shop: require('./shop.png'),
  PersonalRemedies: require('./personalRemedies.png'),
  TrustedGuidance: require('./trustedguide.png'),
  VerifyOtp: require('./VerifyOtp.png'),
  astro: require('./astro2.jpeg'),
  mam: require('./mam.jpeg'),
  healing: require('./healing.webp'),
  OM: require('./Om.png'),
  Zodiac: require('./zodiac2.png'),
};

// const bottomImg ={
//   Home: require('./Home.png'),
//   ChatCall:require('./chatcall.png'),
//   Remedies:require('./remedies.png'),
//   // Shop:require('./shopina.png'),
//   Live:require('./Live.png')
// }

const getImageSource = (source: any) => {
  if (!source) {
    return images.Logo;
  }

  if (typeof source === 'string') {
    return {
      uri: source,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
  }

  return source;
};

/**
 * Get logo source with fallback to local logo
 * @param logoUrl - Optional remote logo URL from config
 * @returns - Image source object
 */
const getLogoSource = (logoUrl?: string): any => {
  if (logoUrl && typeof logoUrl === 'string' && logoUrl.trim() !== '') {
    return {uri: logoUrl};
  }
  return images.Logo;
};

/**
 * Get background image source with fallback
 * @param backgroundImageUrl - Optional remote background image URL from config
 * @returns - Image source object or undefined
 */
const getBackgroundImageSource = (
  backgroundImageUrl?: string,
): any | undefined => {
  if (
    backgroundImageUrl &&
    typeof backgroundImageUrl === 'string' &&
    backgroundImageUrl.trim() !== ''
  ) {
    return {uri: backgroundImageUrl};
  }
  return undefined;
};

/**
 * Get splash screen background image source with OR condition
 * Priority: config URL > local fallback
 * @param splashBackgroundUrl - Optional remote splash background URL from config
 * @param fallbackImage - Optional local fallback image (images.Splash1 or images.Splash2)
 * @returns - Image source object
 */
const getSplashBackgroundSource = (
  splashBackgroundUrl?: string,
  fallbackImage?: any,
): any => {
  // First try remote URL from config
  if (
    splashBackgroundUrl &&
    typeof splashBackgroundUrl === 'string' &&
    splashBackgroundUrl.trim() !== ''
  ) {
    return {uri: splashBackgroundUrl};
  }
  // Fallback to local image
  if (fallbackImage) {
    return fallbackImage;
  }
  // Ultimate fallback
  return undefined;
};

export {
  images,
  getImageSource,
  getLogoSource,
  getBackgroundImageSource,
  getSplashBackgroundSource,
  // bottomImg
};
export default images;
