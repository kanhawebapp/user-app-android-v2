/**
 * BottomSheet Component
 * Swipeable bottom sheet with gesture support
 */

import React, {useRef, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Text} from '../Text';
import {bottomSheetStyle} from './bottomSheetStyle';
import {BottomSheetProps} from './bottomSheetType';

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  height = '50%',
  backgroundColor,
  showBackdrop = true,
  dismissOnBackdropPress = true,
  swipeToClose = true,
  swipeThreshold = 0.3,
  cornerRadius = 20,
  style,
  showHandle = true,
  title,
  testID = 'bottomsheet-component',
  pointerEvents = 'auto',
}) => {
  const theme = useTheme();
  const translateY = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;

  const bgColor = backgroundColor || theme.colors.background.primary;

  const resetPositions = useCallback(() => {
    translateY.setValue(Dimensions.get('window').height);
    backdropOpacity.setValue(0);
  }, [translateY, backdropOpacity]);

  const animateIn = useCallback(() => {
    resetPositions();
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity, resetPositions]);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  useEffect(() => {
    if (visible) {
      animateIn();
    } else {
      animateOut();
    }
  }, [visible, animateIn, animateOut]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => swipeToClose,
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        return (
          swipeToClose && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderGrant: () => {
        pan.setOffset(0);
        pan.setValue(0);
      },
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        pan.flattenOffset();

        const sheetHeight =
          typeof height === 'number'
            ? height
            : Dimensions.get('window').height * 0.5;
        const threshold = sheetHeight * swipeThreshold;

        if (gestureState.dy > threshold) {
          animateOut();
          setTimeout(onClose, 250);
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(backdropOpacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    animateOut();
    setTimeout(onClose, 250);
  }, [animateOut, onClose]);

  const handleBackdropPress = useCallback(() => {
    if (dismissOnBackdropPress) {
      handleClose();
    }
  }, [dismissOnBackdropPress, handleClose]);

  const styles = bottomSheetStyle(theme);

  const sheetStyle: ViewStyle = {
    transform: [{translateY}],
    height,
    backgroundColor: bgColor,
    borderTopLeftRadius: cornerRadius ?? typography.borderRadius.xl,
    borderTopRightRadius: cornerRadius ?? typography.borderRadius.xl,
    shadowColor: theme.colors.text.primary,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  };

  const backdropStyle = {
    opacity: backdropOpacity,
  };

  const containerPointerEvents = visible ? pointerEvents : 'none';

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      testID={testID}
      pointerEvents={containerPointerEvents}>
      {showBackdrop && (
        <TouchableWithoutFeedback
          onPress={handleBackdropPress}
          testID="bottomsheet-backdrop"
          accessibilityLabel="Close bottom sheet">
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
            testID="bottomsheet-backdrop-overlay"
          />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[styles.sheet, sheetStyle, style]}
        testID="bottomsheet-content"
        {...(swipeToClose ? panResponder.panHandlers : {})}>
        {showHandle && (
          <View style={styles.handleContainer} testID="bottomsheet-handle">
            <View
              style={[
                styles.handle,
                {backgroundColor: theme.colors.border.main},
              ]}
              testID="bottomsheet-handle-bar"
            />
            {title && (
              <Text
                variant="body"
                color={theme.colors.text.secondary}
                style={styles.handleTitle}
                testID="bottomsheet-title">
                {title}
              </Text>
            )}
          </View>
        )}

        <View style={styles.content} testID="bottomsheet-children">
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

export default BottomSheet;
