import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Icon} from '../../../Icon';
import {Text} from '../../../Text';
import {useTheme} from '../../../../theme';
import type {GenderValue} from '../../../../features/free-services/utils/freeServiceForm';

interface GenderInputProps {
  value: GenderValue | '' | undefined;
  onChange: (value: GenderValue) => void;
  error?: string;
}

const OPTIONS: Array<{value: GenderValue; label: string; icon: string}> = [
  {value: 'male', label: 'Male', icon: 'male'},
  {value: 'female', label: 'Female', icon: 'female'},
];

export const GenderInput: React.FC<GenderInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.primary}]}>
        Gender <Text style={{color: colors.error.main}}>*</Text>
      </Text>

      <View style={styles.row}>
        {OPTIONS.map(option => {
          const selected = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.85}
              testID={`gender-option-${option.value}`}
              style={[
                styles.option,
                {
                  backgroundColor: selected
                    ? colors.primary.main
                    : colors.background.secondary,
                  borderColor: selected
                    ? colors.primary.main
                    : error
                    ? colors.error.main
                    : colors.border.light,
                },
              ]}
              onPress={() => onChange(option.value)}>
              <Icon
                name={option.icon}
                size={18}
                color={
                  selected ? colors.primary.contrastText : colors.text.secondary
                }
                library="MaterialIcons"
              />
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: selected
                      ? colors.primary.contrastText
                      : colors.text.primary,
                  },
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <Text style={[styles.errorText, {color: colors.error.main}]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
