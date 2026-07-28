
import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Card } from '../../../../../components/Card';
import { TestimonialsProps } from '../../types';

const { width } = Dimensions.get('window');

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = [],
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, style]}>
      <Text variant="h6" weight="semibold" style={styles.title}>
        What our users say
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
      >
        {testimonials.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary.light + '40' }]}>
                    <Text weight="bold" style={{ color: colors.primary.main }}>
                        {item.userName.charAt(0)}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text variant="label" weight="medium">{item.userName}</Text>
                    <View style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Icon 
                                key={i} 
                                name="star" 
                                size={14} 
                                color={i < item.rating ? "#FFC107" : colors.text.disabled} 
                                library="MaterialIcons" 
                            />
                        ))}
                    </View>
                </View>
                <Icon name="format-quote" size={32} color={colors.text.disabled} library="MaterialIcons" />
            </View>
            <Text variant="bodySmall" style={styles.comment} numberOfLines={3}>
                "{item.comment}"
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: width - 64, // Show partial next card
    marginRight: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 2,
  },
  comment: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
