
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
          maxLength={10}
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
