import React from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import type { ProblemCategory } from './home/types';

export const ProblemBaseAstroScreen: React.FC<{
  category: ProblemCategory;
  onBack: () => void;
}> = ({ category, onBack }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <View style={[styles.header, { backgroundColor: colors.background.primary, borderBottomColor: colors.divider }]}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.backButton, { color: colors.primary.main }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {category.title}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>
          {category.title}
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          This is the screen for {category.title} category.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    lineHeight: 24,
  },
});