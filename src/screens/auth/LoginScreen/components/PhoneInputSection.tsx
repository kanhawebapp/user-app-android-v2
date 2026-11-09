import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {CountryCode} from '../../../../constants/app.constants';
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
    <View style={styles.wrapper}>
      <Text style={[styles.phonelabel, {color: colors.text.tertiary}]}>
        Mobile Number
      </Text>
      <View
        style={[
          styles.container,
          {
            borderColor: error
              ? colors.border.error
              : focused
              ? colors.primary.main
              : colors.border.main,
            backgroundColor: colors.common.white,
          },
        ]}>
        {/* Country Code */}

        <TouchableOpacity
          style={styles.countryContainer}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.7}>
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
          placeholder="Enter mobile number"
          placeholderTextColor={colors.input.placeholder}
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
  wrapper: {
    width: '100%',
  },

  container: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  code: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 2,
  },

  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    paddingVertical: 0,
  },

  phonelabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8,
  },
});
