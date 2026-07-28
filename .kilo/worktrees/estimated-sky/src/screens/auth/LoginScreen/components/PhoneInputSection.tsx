// import React, { useState, useEffect, useCallback } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { useTheme } from '../../../../theme';
// import { InputBox } from '../../../../components/InputBox';
// import { Text } from '../../../../components/Text';
// import { Icon } from '../../../../components/Icon';
// import {
//   AUTH_LABELS,
//   CountryCode,
//   COUNTRY_CODES,
//   VALIDATION_RULES,
// } from '../../../../constants/app.constants';
// import { CountryCodePicker } from '../../../../components/CountryCodePicker';
// import { phoneInputSectionStyles } from '../loginStyle';
// import { mmkvStorage, STORAGE_KEYS } from '../../../../services/storage/mmkv.storage';

// interface PhoneInputSectionProps {
//   phoneNumber: string;
//   onPhoneChange: (text: string) => void;
//   isValid: boolean;
//   error?: string | null;
//   testID?: string;
//   selectedCountry?: CountryCode;
//   onCountryChange?: (country: CountryCode) => void;
// }

// // Default country (India)
// const DEFAULT_COUNTRY = COUNTRY_CODES[0];

// export const PhoneInputSection: React.FC<PhoneInputSectionProps> = ({
//   phoneNumber,
//   onPhoneChange,
//   isValid,
//   error,
//   testID = 'phone-input-section',
//   selectedCountry = DEFAULT_COUNTRY,
//   onCountryChange,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const styles = phoneInputSectionStyles(colors);
//   const [isPickerVisible, setIsPickerVisible] = useState(false);
//   const [savedPhoneNumber, setSavedPhoneNumber] = useState<string | undefined>(undefined);
//   const [hasAttemptedAutofill, setHasAttemptedAutofill] = useState(false);

//   // Load saved phone number on component mount
//   useEffect(() => {
//     const savedNumber = mmkvStorage.getItem(STORAGE_KEYS.LAST_PHONE_NUMBER);
//     if (savedNumber) {
//       setSavedPhoneNumber(savedNumber);
//     }
//   }, []);

//   // Handle focus event to autofill saved phone number
//   const handleFocus = useCallback(() => {
//     // Only autofill if:
//     // 1. There's a saved phone number
//     // 2. Current phone number is empty
//     // 3. User hasn't manually entered anything yet
//     if (savedPhoneNumber && !phoneNumber && !hasAttemptedAutofill) {
//       onPhoneChange(savedPhoneNumber);
//       setHasAttemptedAutofill(true);
//     }
//   }, [savedPhoneNumber, phoneNumber, hasAttemptedAutofill, onPhoneChange]);

//   // Save phone number when it's valid and user proceeds
//   useEffect(() => {
//     if (isValid && phoneNumber) {
//       mmkvStorage.setItem(STORAGE_KEYS.LAST_PHONE_NUMBER, phoneNumber);
//     }
//   }, [isValid, phoneNumber]);

//   const handleCountrySelect = (country: CountryCode) => {
//     onCountryChange?.(country);
//   };

//   return (
//     <View style={styles.container} testID={testID}>
//       {/* Label */}
//       {/* <Text variant="label" color={colors.text.secondary} style={styles.label}>
//         {AUTH_LABELS.PHONE_LABEL}
//       </Text> */}

//       {/* Phone Input Container */}
//       <View style={styles.inputContainer}>
//         <InputBox
//           value={phoneNumber}
//           onChangeText={onPhoneChange}
//           onFocus={handleFocus}
//           placeholder={AUTH_LABELS.PHONE_PLACEHOLDER}
//           keyboardType="phone-pad"
//           maxLength={VALIDATION_RULES.PHONE_MAX_LENGTH}
//           size="large"
//           error={error || undefined}
//           leftIcon={
//             <TouchableOpacity
//               style={styles.countryCodeContainer}
//               onPress={() => setIsPickerVisible(true)}
//               activeOpacity={0.7}
//             >
//               <Text variant="body" color={colors.text.tertiary}>
//                 {selectedCountry.flag} {selectedCountry.phoneCode}
//               </Text>
//               <Icon
//                 name="arrow-drop-down"
//                 size={18}
//                 color={colors.text.tertiary}
//                 style={styles.dropdownIcon}
//               />
//             </TouchableOpacity>
//           }
//         />
//       </View>

//       {/* Country Code Picker Modal */}
//       <CountryCodePicker
//         visible={isPickerVisible}
//         onClose={() => setIsPickerVisible(false)}
//         onSelect={handleCountrySelect}
//         selectedCountry={selectedCountry}
//       />
//     </View>
//   );
// };

// export default PhoneInputSection;

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../theme';
import {InputBox} from '../../../../components/InputBox';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {
  AUTH_LABELS,
  CountryCode,
  COUNTRY_CODES,
  VALIDATION_RULES,
} from '../../../../constants/app.constants';
import {CountryCodePicker} from '../../../../components/CountryCodePicker';
import {phoneInputSectionStyles} from '../loginStyle';
import {
  mmkvStorage,
  STORAGE_KEYS,
} from '../../../../services/storage/mmkv.storage';

interface PhoneInputSectionProps {
  phoneNumber: string;
  onPhoneChange: (text: string) => void;
  isValid: boolean;
  error?: string | null;
  testID?: string;
  selectedCountry?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
}

// Default country (India)
const DEFAULT_COUNTRY = COUNTRY_CODES[0];

// Format phone number based on country code
const formatPhoneNumber = (phone: string, countryCode: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Different format patterns based on country
  if (countryCode === '+91') {
    // India: XXXXX XXXXX (10 digits)
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (countryCode === '+1') {
    // US/Canada: (XXX) XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (countryCode === '+44') {
    // UK: XXXX XXXXXX
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  // Default: just return digits with spacing every 4-5 characters
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
};

// Get max length based on country
const getMaxLength = (countryCode: string): number => {
  switch (countryCode) {
    case '+91':
      return 11; // 10 digits + 1 space
    case '+1':
      return 14; // (XXX) XXX-XXXX = 14 chars
    case '+44':
      return 12; // XXXX XXXXXX = 12 chars
    default:
      return 15;
  }
};

export const PhoneInputSection: React.FC<PhoneInputSectionProps> = ({
  phoneNumber,
  onPhoneChange,
  isValid,
  error,
  testID = 'phone-input-section',
  selectedCountry = DEFAULT_COUNTRY,
  onCountryChange,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = phoneInputSectionStyles(colors);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [savedPhoneNumber, setSavedPhoneNumber] = useState<string | undefined>(
    undefined,
  );
  const [hasAttemptedAutofill, setHasAttemptedAutofill] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Load saved phone number on component mount
  useEffect(() => {
    const savedNumber = mmkvStorage.getItem(STORAGE_KEYS.LAST_PHONE_NUMBER);
    if (savedNumber) {
      setSavedPhoneNumber(savedNumber);
    }
  }, []);

  // Handle focus event to autofill saved phone number
  const handleFocus = useCallback(() => {
    // Only autofill if:
    // 1. There's a saved phone number
    // 2. Current phone number is empty
    // 3. User hasn't manually entered anything yet
    if (savedPhoneNumber && !phoneNumber && !hasAttemptedAutofill) {
      onPhoneChange(savedPhoneNumber);
      setHasAttemptedAutofill(true);
    }
    setIsFocused(true);
  }, [savedPhoneNumber, phoneNumber, hasAttemptedAutofill, onPhoneChange]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Save phone number when it's valid and user proceeds
  useEffect(() => {
    if (isValid && phoneNumber) {
      mmkvStorage.setItem(STORAGE_KEYS.LAST_PHONE_NUMBER, phoneNumber);
    }
  }, [isValid, phoneNumber]);

  // Handle country selection
  const handleCountrySelect = (country: CountryCode) => {
    onCountryChange?.(country);
    // Clear phone number when country changes to avoid invalid format
    onPhoneChange('');
  };

  // Handle phone number change with formatting
  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text, selectedCountry.phoneCode);
    onPhoneChange(formatted);
  };

  // Calculate max length based on selected country
  const maxLength = useMemo(
    () => getMaxLength(selectedCountry.phoneCode),
    [selectedCountry.phoneCode],
  );

  // Country code selector button with flag and code
  const CountryCodeSelector = (
    <TouchableOpacity
      style={[
        styles.countryCodeSelector,
        {
          borderRightWidth: 1,
          borderRightColor: colors.border.main,
          // backgroundColor: isFocused ? colors.background.secondary : 'transparent',
        },
      ]}
      onPress={() => setIsPickerVisible(true)}
      activeOpacity={0.7}
      accessibilityLabel="Select country code"
      accessibilityHint="Tap to choose your country code">
      <Text variant="body" color={colors.text.primary} style={styles.flagText}>
        {selectedCountry.flag}
      </Text>
      <Text
        variant="bodySmall"
        color={colors.text.secondary}
        style={styles.phoneCodeText}>
        {selectedCountry.phoneCode}
      </Text>
      <Icon
        name="keyboard-arrow-down"
        size={20}
        color={colors.text.tertiary}
        style={styles.dropdownIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} testID={testID}>
      {/* Phone Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? colors.border.error
              : isFocused
              ? colors.border.focus
              : colors.border.main,
            backgroundColor: colors.background.primary,
          },
        ]}>
        {CountryCodeSelector}

        <View style={styles.phoneInputWrapper}>
          <InputBox
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={AUTH_LABELS.PHONE_PLACEHOLDER}
            keyboardType="phone-pad"
            maxLength={maxLength}
            size="large"
            error={error || undefined}
            enableFloatingLabel={true}
            leftIcon={null}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputBox}
          />
        </View>
      </View>

      {/* Country Code Picker Modal */}
      <CountryCodePicker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry}
      />
    </View>
  );
};

export default PhoneInputSection;
