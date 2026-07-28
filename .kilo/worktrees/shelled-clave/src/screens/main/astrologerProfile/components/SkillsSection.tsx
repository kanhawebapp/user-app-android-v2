import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Text, useTheme} from '../../../../components';
import {colors} from '../../../../theme/colors';

type SkillsSectionProps = {
  skills: string[];
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({skills}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!skills?.length) return null;

  return (
    <View style={styles.infoSection}>
      <Icon name="star" size={20} color={colors.primary.main} />

      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View
            key={index}
            style={[
              styles.skillBadge,
              // {
              //   backgroundColor: colors.primary.light + '20',
              //   borderWidth: 1,
              //   borderColor: colors.primary.light + '50',
              // },
            ]}>
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
    // marginBottom: 16,
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
