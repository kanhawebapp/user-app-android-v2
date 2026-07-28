/**
 * Error Boundary Component
 * Catches React errors and prevents app crashes
 */

import React, {Component, ReactNode} from 'react';
import {View, StatusBar} from 'react-native';
import {useTheme} from '../../theme';
import {Button} from '../Button';
import {errorBoundryStyle} from './errorBoundryStyle';
import {ErrorFallbackProps, Props, State} from './errorBoundryType';
import {Text} from '../Text';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('ErrorBoundary caught an error:', error, errorInfo);

    this.props.onError?.(error, errorInfo);

    this.setState({
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      this.props.resetKeys &&
      JSON.stringify(prevProps.resetKeys) !==
        JSON.stringify(this.props.resetKeys)
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRetry = (): void => {
    this.resetError();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({error, onRetry}) => {
  const {colors, typography} = useTheme();
  const styles = errorBoundryStyle;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.primary}
      />

      <View style={styles.iconContainer}>
        <Text style={[styles.icon, {color: colors.error.main}]}>⚠️</Text>
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.text.primary,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semiBold,
            lineHeight: typography.lineHeight.xl,
          },
        ]}>
        Oops! Something went wrong
      </Text>

      <Text
        style={[
          styles.message,
          {
            color: colors.text.secondary,
            fontSize: typography.fontSize.sm,
            lineHeight: typography.lineHeight.md,
          },
        ]}>
        We're sorry for the inconvenience. Please try again.
      </Text>

      {__DEV__ && error && (
        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
              borderRadius: typography.borderRadius.sm,
              padding: typography.padding.md,
            },
          ]}>
          <Text
            style={[
              styles.errorTitle,
              {
                color: colors.error.main,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semiBold,
              },
            ]}>
            Error Details (Dev Only)
          </Text>
          <Text
            style={[
              styles.errorText,
              {
                color: colors.text.secondary,
                fontSize: typography.fontSize.xs,
                fontFamily: 'monospace',
              },
            ]}>
            {error.message}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          size="large"
        />
      </View>

      <Text
        style={[
          styles.supportText,
          {
            color: colors.text.disabled,
            fontSize: typography.fontSize.xs,
          },
        ]}>
        If the problem persists, contact support
      </Text>
    </View>
  );
};

export default ErrorBoundary;
