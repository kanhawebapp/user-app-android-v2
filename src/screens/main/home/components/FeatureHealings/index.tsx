import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Button} from '../../../../../components/Button';
import {FeaturedRemediesProps} from '../../types';
import {Card} from '../../../../../components';
import {API_BASE_URL} from '../../../../../constants/api.constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = Math.min(200, SCREEN_WIDTH * 0.52);
const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 0.7);

const getImageUrl = (url?: string): string => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${API_BASE_URL.DEVELOPMENT}${url.replace(/^\/+/, '')}`;
};

export const FeatureHealings: React.FC<FeaturedRemediesProps> = ({
  remedies = [],
  onRemedyPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!remedies.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold" style={styles.headerTitle}>
          Feature Healings
        </Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={onViewAllPress}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {remedies.map((remedy, index) => {
          const imageUri = getImageUrl(remedy.image);
          const isLast = index === remedies.length - 1;

          return (
            <Card
              key={remedy.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card.background,
                  borderColor: colors.card.border,
                },
                isLast && styles.lastCard,
              ]}
              onPress={() => onRemedyPress?.(remedy)}>
              <View style={styles.imageWrapper}>
                {imageUri ? (
                  <Image
                    source={{uri: imageUri}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.imagePlaceholder,
                      {backgroundColor: colors.background.secondary},
                    ]}
                  />
                )}
              </View>

              <View style={styles.content}>
                <Text
                  weight="semibold"
                  numberOfLines={1}
                  color={colors.primary.main}
                  style={styles.title}>
                  {remedy.name || remedy.title}
                </Text>

                <View style={styles.footer}>
                  <Button
                    onPress={() => onRemedyPress?.(remedy)}
                    title="Book"
                    style={styles.bookBtn}
                  />
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    flexShrink: 1,
  },
  scrollContent: {
    alignItems: 'stretch',
    paddingVertical: 2,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 14,
  },
  lastCard: {
    marginRight: 0,
  },
  imageWrapper: {
    width: '100%',
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    width: '100%',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  bookBtn: {
    height: 35,
    width: '100%',
    alignSelf: 'center',
  },
});

export default FeatureHealings;
