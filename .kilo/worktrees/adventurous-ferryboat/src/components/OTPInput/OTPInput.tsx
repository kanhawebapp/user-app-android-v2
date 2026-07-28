import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import {useTheme} from '../../theme';
import {Text} from '../Text';
import {otpinputStyle} from './styles';
import {OTPInputProps} from './types';

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value: controlledValue,
  onChange,
  error,
  autoFocus = true,
  disabled = false,
  keyboardType = 'number-pad',
  testID = 'otp-input-component',
}) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(autoFocus ? 0 : -1);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Use controlled or uncontrolled value
  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  // Calculate values
  const values = currentValue.split('').slice(0, length);
  const filledCount = values.length;
  const remainingCount = length - filledCount;
  const styles = otpinputStyle;

  // Focus the first empty input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  // Handle text change
  const handleChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(-1);

    let newValue: string;
    if (cleanText.length === 0) {
      // Handle backspace - remove character at this position
      newValue = currentValue.slice(0, index) + currentValue.slice(index + 1);
    } else {
      // Handle new character - replace at this position
      newValue =
        currentValue.slice(0, index) +
        cleanText +
        currentValue.slice(index + 1);
    }

    // Update value
    if (controlledValue !== undefined) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }

    // Focus next input if character was entered
    if (cleanText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press (for backspace)
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const {key} = e.nativeEvent;

    if (key === 'Backspace') {
      // If current input is empty and there's a previous character, move to previous and delete
      if (!currentValue[index] && index > 0) {
        // Delete the character at previous position
        const newValue =
          currentValue.slice(0, index - 1) + currentValue.slice(index);

        if (controlledValue !== undefined) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
          onChange?.(newValue);
        }

        inputRefs.current[index - 1]?.focus();
      } else if (!currentValue[index] && index === 0) {
        // If at first box and it's empty, do nothing
      }
    }
  };

  // Handle focus
  const handleFocus = (index: number) => {
    setFocusedIndex(index);

    // Select existing value when focused
    const char = currentValue[index];
    if (char) {
      // We can't directly select text, but the behavior is acceptable
    }
  };

  // Handle blur
  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  // Render each OTP box
  const renderOTPBoxes = () => {
    return Array.from({length}, (_, index) => {
      const isFilled = index < filledCount;
      const isFocused = index === focusedIndex;
      const char = currentValue[index] || '';

      const boxStyle = [
        styles.otpBox,
        {
          backgroundColor: theme.colors.common.white,
          borderColor: error
            ? theme.colors.error.main
            : isFocused
            ? theme.colors.primary.main
            : isFilled
            ? theme.colors.primary.main
            : theme.colors.border.main,
        },
        isFilled && {
          backgroundColor: theme.colors.primary.main + '15',
        },
        isFocused &&
          !isFilled && {
            backgroundColor: '#e8e7e3',
          },
        isFocused && {
          borderWidth: 2,
        },
        disabled && {
          backgroundColor: theme.colors.background.tertiary,
          borderColor: theme.colors.border.light,
        },
      ];

      return (
        <View key={index} style={boxStyle} testID={`otp-box-${index}`}>
          <Text
            variant="h4"
            color={
              error
                ? theme.colors.error.main
                : isFilled
                ? theme.colors.text.primary
                : theme.colors.text.tertiary
            }
            style={styles.otpText}>
            {char}
          </Text>
          <TextInput
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            style={styles.hiddenInput}
            value={char}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType={keyboardType}
            editable={!disabled}
            maxLength={1}
            selectTextOnFocus={false}
            caretHidden={true}
            testID={`otp-input-${index}`}
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        </View>
      );
    });
  };

  const hasError = Boolean(error);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.otpContainer}>{renderOTPBoxes()}</View>

      {error && (
        <Text
          variant="caption"
          color={theme.colors.error.main}
          style={styles.errorText}
          testID="otp-error">
          {error}
        </Text>
      )}
    </View>
  );
};

export default OTPInput;
