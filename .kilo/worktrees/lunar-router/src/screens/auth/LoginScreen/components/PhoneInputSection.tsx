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

import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {
  CountryCode,
  COUNTRY_CODES,
  AUTH_LABELS,
} from '../../../../constants/app.constants';
import {CountryCodePicker} from '../../../../components/CountryCodePicker';

interface Props {
  phoneNumber: string;
  onPhoneChange: (text: string) => void;
  error?: string | null;
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

export const PhoneInputSection: React.FC<Props> = ({
  phoneNumber,
  onPhoneChange,
  error,
  selectedCountry,
  onCountryChange,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [pickerVisible, setPickerVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={{width: '100%'}}>
      <Text style={styles.phonelabel}>{AUTH_LABELS.PHONE_LABEL}</Text>
      <View
        style={[
          styles.container,
          {
            borderColor: error
              ? colors.border.error
              : focused
              ? colors.primary.main
              : colors.border.main,
          },
        ]}>
        {/* Country Code */}

        <TouchableOpacity
          style={[styles.countryContainer, {backgroundColor: 'transparent'}]}
          onPress={() => setPickerVisible(true)}>
          <Text style={[styles.code, {color: colors.text.primary}]}>
            {selectedCountry.phoneCode}
          </Text>

          <Icon
            name="keyboard-arrow-down"
            size={18}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, {backgroundColor: colors.border.main}]} />

        {/* Phone Input */}
        <TextInput
          style={[styles.input, {color: colors.text.primary}]}
          placeholder={AUTH_LABELS.PHONE_PLACEHOLDER || 'Enter Phone Number'}
          placeholderTextColor={colors.text.secondary}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={onPhoneChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={15}
        />
      </View>

      {/* Country Picker */}
      <CountryCodePicker
        visible={pickerVisible}
        selectedCountry={selectedCountry}
        onClose={() => setPickerVisible(false)}
        onSelect={onCountryChange}
      />

      {error && (
        <Text style={{color: colors.border.error, marginTop: 6}}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  code: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },

  divider: {
    width: 1,
    height: 28,
    marginHorizontal: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },
  phonelabel: {
    fontFamily: 'Inter',
    fontWeight: '500', // Regular
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 5,
  },
});
