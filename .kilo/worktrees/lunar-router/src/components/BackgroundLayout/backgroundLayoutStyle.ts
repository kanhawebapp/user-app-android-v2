import {StyleSheet, ViewStyle, ImageStyle} from 'react-native';
import {colors as defaultColors} from '../../theme/colors';

export const backgroundLayoutStyle = (theme?: {
  colors?: typeof defaultColors;
}) => {
  const themeColors = theme?.colors || defaultColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      // backgroundColor: themeColors.background,
    } as any,

    backgroundImageContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    } as ViewStyle,

    backgroundImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    } as ImageStyle,

    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    } as ViewStyle,

    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
    } as ViewStyle,

    solidOverlay: {
      ...StyleSheet.absoluteFillObject,
    } as ViewStyle,

    contentWrapper: {
      flex: 1,
      zIndex: 2,
    } as ViewStyle,

    safeAreaContent: {
      flex: 1,
      zIndex: 2,
    } as ViewStyle,
  });
};

export const defaultBackgroundLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.background.primary,
  } as ViewStyle,

  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  } as ViewStyle,

  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  } as ViewStyle,

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,

  solidOverlay: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,

  contentWrapper: {
    flex: 1,
    zIndex: 2,
  } as ViewStyle,

  safeAreaContent: {
    flex: 1,
    zIndex: 2,
  } as ViewStyle,
});

export default backgroundLayoutStyle;
