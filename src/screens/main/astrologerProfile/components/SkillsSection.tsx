import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from '../../../../components';
import { colors } from '../../../../theme/colors';

type SkillsSectionProps = {
  skills: string[];
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!skills?.length) return null;

  return (
    <View style={styles.infoSection}>
      <Icon name="star" size={20} color={colors.primary.main} />

      <View style={styles.skillsContainer}>
        {skills.slice(0, 2).map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text
              style={[
                styles.skillText,
                {
                  color: colors.primary.main,
                },
              ]}>
              {skill}
            </Text>
          </View>
        ))}

        {skills.length > 2 && (
          <View style={styles.skillBadge}>
            <Text style={styles.skillText}>
              +{skills.length - 2} more
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 16,
    // marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    // marginBottom: 16,
    marginTop: -10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors.primary.light,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SkillsSection;
