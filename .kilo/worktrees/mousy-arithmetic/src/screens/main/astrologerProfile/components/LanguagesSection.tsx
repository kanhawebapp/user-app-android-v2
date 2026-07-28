import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from '../../../../components';


type LanguagesSectionProps = {
  languages: string[];
};

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!languages?.length) return null;

  return (
    <View style={styles.infoSection}>
      <Icon name="language" size={20} color={colors.primary.main} />

      <View style={styles.languagesContainer}>
        {languages.map((language, index) => (
          <View
            key={index}
            style={[
              styles.languageBadge,
              {
                backgroundColor: colors.primary.light,
                borderWidth: 1,
                borderColor: colors.border.light,
              },
            ]}>
            <Text
              style={[
                styles.languageText,
                {
                  color: colors.primary.main,
                },
              ]}>
              {language}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LanguagesSection;