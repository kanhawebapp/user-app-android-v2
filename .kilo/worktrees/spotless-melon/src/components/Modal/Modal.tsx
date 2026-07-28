/**
 * Modal Component
 * Custom modal with animation, backdrop, and accessibility
 */

import React, {useEffect, useRef} from 'react';
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Text} from '../Text';
import {useCallback} from 'react';
import {modalStyle} from './modalStyle';
import {ModalProps} from './modalType';

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'fade',
  showBackdrop = true,
  dismissOnBackdropPress = true,
  style,
  contentStyle,
  showCloseButton = false,
  title,
  testID = 'modal-component',
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate in
  const animateIn = useCallback(() => {
    // Reset values to ensure animation triggers on subsequent opens
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 300,
        damping: 25,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  // Animate out
  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  useEffect(() => {
    if (visible) {
      animateIn();
    } else {
      animateOut();
    }
  }, [visible, animateIn, animateOut]);

  const handleClose = () => {
    animateOut();
    setTimeout(onClose, 150);
  };

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      handleClose();
    }
  };

  const styles = modalStyle(theme);

  const animatedStyle = {
    opacity: opacityAnim,
    transform: [{scale: scaleAnim}],
  };

  const backdropStyle = {
    backgroundColor: theme.colors.overlay,
    opacity: opacityAnim,
  };

  return (
    <RNModal
      testID={testID}
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel || title || 'Modal'}
      {...props}>
      <View style={styles.container} testID="modal-wrapper">
        {/* Backdrop */}
        {showBackdrop && (
          <TouchableWithoutFeedback
            onPress={handleBackdropPress}
            testID="modal-backdrop"
            accessibilityLabel="Close modal"
            accessibilityRole="button">
            <Animated.View
              style={[styles.backdrop, backdropStyle]}
              testID="modal-backdrop-overlay"
            />
          </TouchableWithoutFeedback>
        )}

        {/* Modal Content */}
        <Animated.View
          style={[styles.modalContainer, animatedStyle, style]}
          testID="modal-content-wrapper">
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background.primary,
                borderRadius: typography.borderRadius.lg,
                ...typography.shadow.xl,
              },
              contentStyle,
            ]}
            testID="modal-content">
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header} testID="modal-header">
                {title && (
                  <Text
                    variant="h5"
                    color={theme.colors.text.primary}
                    style={styles.title}
                    testID="modal-title">
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <TouchableWithoutFeedback
                    onPress={handleClose}
                    testID="modal-close-button"
                    accessibilityLabel="Close modal">
                    <View style={styles.closeButton}>
                      <Text
                        color={theme.colors.text.secondary}
                        style={styles.closeIcon}>
                        ✕
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}
            <View style={styles.childrenContainer} testID="modal-children">
              {children}
            </View>
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default Modal;
