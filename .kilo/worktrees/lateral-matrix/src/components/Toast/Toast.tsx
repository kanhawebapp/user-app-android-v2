/**
 * Toast Component
 * For showing notifications, alerts, and feedback to users
 * Enhanced with title, progress bar, action button, and position support
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { 
  Animated, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import { toastStyle } from './toastStyle';
import { ToastProps } from './toastType';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  title,
  position = 'top',
  showProgress = true,
  action,
  icon,
  dismissOnPress = true,
  autoDismiss = true,
}) => {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(position === 'top' ? -SCREEN_WIDTH : SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const styles = toastStyle;

  // Get position style
  const getPositionStyle = () => {
    return position === 'top' ? styles.containerTop : styles.containerBottom;
  };

  const getIconName = (): string => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return colors.success?.main || '#4CAF50';
      case 'error':
        return colors.error?.main || '#F44336';
      case 'warning':
        return colors.warning?.main || '#FF9800';
      case 'info':
      default:
        return colors.info?.main || '#2196F3';
    }
  };

  // Animation for slide in
  const animateIn = useCallback(() => {
    const toValue = 0;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, opacity]);

  // Animation for slide out
  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: position === 'top' ? -SCREEN_WIDTH : SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      progress.setValue(0);
      onHide?.();
    });
  }, [translateX, opacity, position, onHide]);

  // Progress bar animation
  const animateProgress = useCallback(() => {
    if (autoDismiss && duration > 0 && showProgress) {
      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }
  }, [autoDismiss, duration, showProgress, progress]);

  // PanResponder for swipe-to-dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (position === 'top') {
          translateX.setValue(gestureState.dx);
        } else {
          translateX.setValue(-gestureState.dx);
        }
        opacity.setValue(1 - Math.abs(gestureState.dx) / 200);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          animateOut();
        } else {
          animateIn();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      animateIn();
      animateProgress();
      
      if (autoDismiss && duration > 0) {
        const timer = setTimeout(() => {
          animateOut();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration, animateIn, animateOut, animateProgress, autoDismiss]);

  const handleClose = useCallback(() => {
    animateOut();
  }, [animateOut]);

  const handlePress = useCallback(() => {
    if (dismissOnPress) {
      animateOut();
    }
  }, [dismissOnPress, animateOut]);

  const handleActionPress = useCallback(() => {
    action?.onPress();
    if (dismissOnPress) {
      animateOut();
    }
  }, [action, dismissOnPress, animateOut]);

  // Calculate progress bar width
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!isVisible) {
    return null;
  }

  const backgroundColor = getBackgroundColor();

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        {
          backgroundColor,
          transform: [
            { translateX: position === 'top' ? translateX : translateX.interpolate({
              inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
              outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            })},
          ],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        activeOpacity={0.95}
        onPress={handlePress}
        style={styles.content}
      >
        <View style={[styles.iconContainer, 
          type === 'success' && styles.successIconBg,
          type === 'error' && styles.errorIconBg,
          type === 'warning' && styles.warningIconBg,
          type === 'info' && styles.infoIconBg,
        ]}>
          <Icon
            name={getIconName()}
            size={20}
            color={colors.background.primary}
            library="Ionicons"
          />
        </View>
        
        <View style={styles.textContainer}>
          {title ? (
            <>
              <Text 
                style={[styles.title, { color: colors.background.primary }]}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text 
                style={[styles.messageWithTitle, { color: colors.background.primary }]}
                numberOfLines={2}
              >
                {message}
              </Text>
            </>
          ) : (
            <Text 
              style={[styles.message, { color: colors.background.primary }]}
              numberOfLines={2}
            >
              {message}
            </Text>
          )}
        </View>

        {action ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleActionPress}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.actionButtonText, 
                { color: action.textColor || colors.background.primary }
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name="close"
              size={18}
              color={colors.background.primary}
              library="Ionicons"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Progress Bar */}
      {showProgress && autoDismiss && duration > 0 && (
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: progressWidth,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default Toast;
