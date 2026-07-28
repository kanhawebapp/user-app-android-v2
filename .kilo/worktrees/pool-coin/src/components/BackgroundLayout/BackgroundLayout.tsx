import React, { useMemo } from 'react';
import {
  View,
  Image,
  StatusBar,
  ImageStyle,
  Platform,
  SafeAreaView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { backgroundLayoutStyle } from './backgroundLayoutStyle';
import { BackgroundLayoutProps, GradientDirection } from './backgroundLayoutType';


const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
const DEFAULT_OVERLAY_OPACITY = 0.5;


const getGradientStyles = (
  colors: string[], 
  direction: GradientDirection,
  opacity: number
): StyleProp<ViewStyle>[] => {
  if (colors.length < 2) {
    return [];
  }

  const numStops = colors.length;
  const stops: StyleProp<ViewStyle>[] = [];

  colors.forEach((_color, index) => {
    const baseOpacity = opacity * ((index + 1) / numStops);
    
    const style: ViewStyle = {
      position: 'absolute',
      opacity: baseOpacity,
      ...getGradientDirectionStyle(direction, index, numStops),
    };
    
    stops.push(style);
  });

  return stops;
};

const getGradientDirectionStyle = (
  direction: GradientDirection,
  index: number,
  total: number
): ViewStyle => {
  const position = index / (total - 1);
  
  switch (direction) {
    case 'vertical':
      return {
        top: `${position * 100}%`,
        bottom: 0,
        left: 0,
        right: 0,
      };
    case 'horizontal':
      return {
        left: `${position * 100}%`,
        right: 0,
        top: 0,
        bottom: 0,
      };
    case 'diagonal':
      return {
        top: `${position * 100}%`,
        left: `${position * 100}%`,
        right: 0,
        bottom: 0,
      };
    default:
      return {};
  }
};


export const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({
  children,
  backgroundImage,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  overlayColor = DEFAULT_OVERLAY_COLOR,
  blurRadius,
  gradientColors,
  gradientDirection = 'vertical',
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  useSafeArea = true,
  statusBarVisible = true,
  statusBarStyle,
  containerStyle,
  contentStyle,
  testID = 'background-layout',
}) => {
  const theme = useTheme();
  const { colors, isDark } = theme;
  
  const styles = useMemo(() => backgroundLayoutStyle(), []);

  const currentStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');

  const effectiveOverlayColor = useMemo(() => {
    if (overlayOpacity !== undefined && overlayOpacity !== DEFAULT_OVERLAY_OPACITY) {
      return overlayColor.replace(/[\d.]+\)$/g, `${overlayOpacity})`);
    }
    return overlayColor;
  }, [overlayColor, overlayOpacity]);

  const gradientOverlays = useMemo(() => {
    if (gradientColors && gradientColors.length >= 2) {
      return getGradientStyles(gradientColors, gradientDirection, overlayOpacity);
    }
    return [];
  }, [gradientColors, gradientDirection, overlayOpacity]);

  const effectiveBackgroundColor = backgroundColor || colors.primary.main;

  const renderBackground = () => {
    if (backgroundImage) {
      return (
        <View style={styles.backgroundImageContainer} testID={`${testID}-background-image-container`}>
          <Image
            source={backgroundImage}
            style={styles.backgroundImage as ImageStyle}
            blurRadius={Platform.OS === 'ios' ? blurRadius : 0}
            testID={`${testID}-background-image`}
            resizeMode="cover"
          />
        </View>
      );
    }
    
    return (
      <View 
        style={[
          styles.backgroundImageContainer, 
          { backgroundColor: effectiveBackgroundColor }
        ]} 
        testID={`${testID}-background-color`}
      />
    );
  };

  const renderOverlay = () => {
    if (gradientColors && gradientColors.length >= 2) {
      return (
        <View style={styles.overlayContainer} testID={`${testID}-gradient-overlay`}>
          {gradientOverlays.map((overlayStyle, index) => (
            <View
              key={`gradient-${index}`}
              style={[
                overlayStyle,
                { backgroundColor: gradientColors[index] },
              ]}
            />
          ))}
        </View>
      );
    }

    return (
      <View
        style={[
          styles.overlayContainer,
          { backgroundColor: effectiveOverlayColor },
        ]}
        testID={`${testID}-overlay`}
      />
    );
  };

  const renderContent = () => (
    <View style={[styles.contentWrapper, contentStyle]} testID={`${testID}-content`}>
      {children}
    </View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView style={[styles.container, containerStyle]} testID={testID}>
        {statusBarVisible && (
          <StatusBar
            barStyle={currentStatusBarStyle}
            backgroundColor="transparent"
            translucent={true}
          />
        )}

        {renderBackground()}

        {renderOverlay()}

        {renderContent()}
      </SafeAreaView>
    );
  }

  return (
    <View 
      style={[styles.container, containerStyle]} 
      testID={testID}
    >
      {statusBarVisible && (
        <StatusBar
          barStyle={currentStatusBarStyle}
          backgroundColor="transparent"
          translucent={true}
        />
      )}

      {renderBackground()}

      {renderOverlay()}

      {renderContent()}
    </View>
  );
};

export default BackgroundLayout;

