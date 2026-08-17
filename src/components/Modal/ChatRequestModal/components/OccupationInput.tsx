import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';

interface OccupationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const OccupationInput: React.FC<OccupationInputProps> = ({
  value,
  onChangeText,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.primary}]}>
        Occupation <Text style={{color: colors.error.main}}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            borderColor: error ? colors.error.main : colors.border.light,
          },
        ]}
        placeholder="Enter your occupation"
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
      />
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
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
