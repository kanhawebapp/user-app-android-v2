import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text } from '../../../../components';

type LanguagesSectionProps = {
  languages: string[];
};

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
}) => {
  if (!languages?.length) return null;

  const languageLabel = languages.join(', ');

  return (
    <View style={styles.infoSection}>
      <View style={styles.languageBadge}>
        <Icon
          name="language"
          size={16}
          color="#B45309"
          library="Ionicons"
        />
        <Text style={styles.languageText}>{languageLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
  },
});

export default LanguagesSection;
