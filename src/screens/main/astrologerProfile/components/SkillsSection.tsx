import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from '../../../../components';

type SkillsSectionProps = {
  skills: string[];
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!skills?.length) return null;

  return (
    <View style={styles.infoSection}>
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View
            key={`${skill}-${index}`}
            style={[
              styles.skillBadge,
              {
                backgroundColor: colors.common.white,
                shadowColor: '#000',
              },
            ]}>
            <Text
              style={[
                styles.skillText,
                {
                  color: colors.text.primary,
                },
              ]}>
              {skill}
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
    alignItems: 'center',
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SkillsSection;
