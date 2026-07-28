/**
 * Image Component
 * Reusable image component with loading, error states and placeholder support
 */

import React, { useState, useCallback } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
  Text,
} from 'react-native';
import { useTheme, typography } from '../../theme';
import { ImageProps, ImageResizeMode } from './imageType';
import { SkeletonLoader } from '../SkeletonLoader';
export type { ImageResizeMode } from './imageType';

const resizeModeMap: Record<ImageResizeMode, 'cover' | 'contain' | 'stretch' | 'center'> = {
  cover: 'cover',
  contain: 'contain',
  stretch: 'stretch',
  center: 'center',
};

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  loadingContainer: {
    alignItems: typography.align.center,
    justifyContent: typography.justify.center,
    backgroundColor: theme.colors.background.secondary,
  },
  initialsContainer: {
    alignItems: typography.align.center,
    justifyContent: typography.justify.center,
  },
  initialsText: {
    fontWeight: typography.fontWeight.semiBold,
  },
});

export const CustomImage: React.FC<ImageProps> = ({
  source,
  size,
  width,
  height,
  borderRadius,
  resizeMode = 'cover',
  placeholder,
  showLoading = true,
  loadingColor,
  style,
  onPress,
  onLoad,
  onError,
  testID = 'image-component',
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  const DEFAULT_IMAGE_SIZE = typography.width[24];
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageStyle: ImageStyle = {
    width: size || (width as number) || DEFAULT_IMAGE_SIZE,
    height: size || (height as number) || DEFAULT_IMAGE_SIZE,
    borderRadius: typeof borderRadius === 'number' ? borderRadius : 0,
  };

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const containerStyle: ViewStyle = {
    width: size || (width as number) || DEFAULT_IMAGE_SIZE,
    height: size || (height as number) || DEFAULT_IMAGE_SIZE,
    borderRadius: typeof borderRadius === 'number' ? borderRadius : 0,
    overflow: 'hidden',
  };

  const imageSource = hasError || !source ? (placeholder || source) : source;

  const renderContent = () => {
    const borderRadiusValue = typeof borderRadius === 'number' ? borderRadius : 0;
    const imageHeight = size || (height as number) || DEFAULT_IMAGE_SIZE;
    
    if (isLoading && showLoading) {
      return (
        <View style={[styles.loadingContainer, imageStyle]}>
          <SkeletonLoader
            width="100%"
            height={imageHeight}
            borderRadius={borderRadiusValue}
            testID="image-loading-skeleton"
          />
        </View>
      );
    }

    return (
      <Image
        testID={testID}
        source={imageSource}
        style={[imageStyle, style as ImageStyle]}
        resizeMode={resizeModeMap[resizeMode]}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityLabel={accessibilityLabel}
        {...props}
      />
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity
        testID={`${testID}-touchable`}
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={containerStyle}>
      {renderContent()}
    </View>
  );
};

export const AvatarImage: React.FC<{
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
}> = ({
  source,
  name,
  size = 50,
  backgroundColor,
  textColor,
  style,
  onPress,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor || theme.colors.primary.main,
    alignItems: typography.align.center,
    justifyContent: typography.justify.center,
  };

  const showFallback = !source || imageError;

  const initialsText = showFallback && name ? getInitials(name) : '';

  const renderContent = () => {
    if (showFallback && name) {
      return (
        <View style={[containerStyle, style]}>
          <View style={styles.initialsContainer}>
            <Text
              style={{
                fontSize: size! / 2.5,
                color: textColor || theme.colors.primary.contrastText,
                fontWeight: typography.fontWeight.semiBold,
              }}
            >
              {initialsText}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Image
        source={source!}
        style={[containerStyle, style] as ImageStyle[]}
        onError={() => setImageError(true)}
      />
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View testID="avatar-image">{renderContent()}</View>;
};

export default CustomImage;
