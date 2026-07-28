import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import type {Gender} from '../types';

interface GenderSelectorProps {
  value: Gender | null;
  onSelect: (gender: Gender) => void;
  error?: string;
}

const GENDER_OPTIONS: {value: Gender; label: string; icon: string}[] = [
  {value: 'male', label: 'Male', icon: '♂️'},
  {value: 'female', label: 'Female', icon: '♀️'},
  {value: 'other', label: 'Other', icon: '🧑'},
];

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onSelect,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.primary}]}>
        Gender <Text style={{color: colors.error.main}}>*</Text>
      </Text>
      <View style={styles.optionsContainer}>
        {GENDER_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  value === option.value
                    ? colors.primary.main
                    : colors.background.secondary,
                borderColor:
                  value === option.value
                    ? colors.primary.main
                    : colors.border.light,
              },
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    value === option.value
                      ? colors.primary.contrastText
                      : colors.text.primary,
                },
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && (
        <Text style={[styles.errorText, {color: colors.error.main}]}>
          {error}
        </Text>
      )}
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
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
