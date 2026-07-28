
import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { TestimonialsProps } from '../../types';
import { Card } from '../../../../../components';
import { useTestimonials } from '../../../../../services/api/testimonial/useTestimonials';
import { API_BASE_URL } from '../../../../../constants/api.constants';

const { width } = Dimensions.get('window');

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = [],
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const { data, loading } = useTestimonials();

  // console.log('testimoniulllsss', data);

  /**
   * FORMAT TESTIMONIALS
   */
  const testimonialData = useMemo(() => {
    /**
     * PRIORITY 1 → API DATA
     */
    if (data?.length > 0) {
      return data.map((item: any) => {
        /**
         * HANDLE IMAGE URL
         */
        let imageUrl = '';

        if (item?.image) {
          /**
           * backend giving blob url
           * skip blob because it won't work in app
           */
          if (item.image.startsWith('blob:')) {
            imageUrl =
              'https://i.pravatar.cc/300?img=' + Math.floor(Math.random() * 60);
          } else if (item.image.startsWith('http')) {
            imageUrl = item.image;
          } else {
            imageUrl = `${BASE_IMAGE_URL}${item.image}`;
          }
        }

        return {
          id: item?.id,
          userName: item?.name || 'Anonymous',
          comment: item?.content || '',
          location: item?.address || 'India',
          rating: Number(item?.rating || 5),
          image: imageUrl,
        };
      });
    }

    /**
     * PRIORITY 2 → PROP DATA
     */
    return testimonials;
  }, [data, testimonials]);

  if (loading && testimonialData.length === 0) {
    return (
      <View style={[styles.loaderContainer, style]}>
        <ActivityIndicator size="small" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text
            variant="h6"
            weight="bold"
            style={[
              styles.title,
              {
                color: colors.text.primary,
              },
            ]}>
            Happy Customers
          </Text>

          <Text
            variant="bodySmall"
            style={{
              color: colors.text.secondary,
              paddingHorizontal: 16,
              marginTop: 2,
            }}>
            Trusted by thousands of users
          </Text>
        </View>

        <View
          style={[
            styles.reviewBadge,
            {
              backgroundColor: colors.primary.light + '20',
            },
          ]}>
          <Icon name="star" size={16} color="#FFC107" library="MaterialIcons" />

          <Text
            style={{
              color: colors.primary.main,
              fontWeight: '700',
              marginLeft: 4,
              fontSize: 13,
            }}>
            4.9
          </Text>
        </View>
      </View>

      {/* LIST */}
      <ScrollView
        horizontal
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={width - 72}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {testimonialData.map((item: any, index: number) => (
          <Card
            key={`${item.id}-${index}`}
            style={[
              styles.card,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.light,
              },
            ]}>
            {/* PROFILE IMAGE */}
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: item.image || 'https://i.pravatar.cc/300',
                }}
                style={styles.image}
              />

              {/* VERIFIED BADGE */}
              <View style={styles.verifiedBadge}>
                <Icon
                  name="check"
                  size={10}
                  color="#FFFFFF"
                  library="Feather"
                />
              </View>
            </View>

            {/* QUOTE ICON */}
            <View
              style={[
                styles.quoteIconContainer,
                {
                  backgroundColor: colors.primary.light + '18',
                },
              ]}>
              <Icon
                name="format-quote-open"
                size={18}
                color={colors.primary.main}
                library="MaterialCommunityIcons"
              />
            </View>

            {/* COMMENT */}
            <Text
              style={[
                styles.comment,
                {
                  color: colors.text.secondary,
                },
              ]}
              numberOfLines={4}>
              “{item.comment}”
            </Text>

            {/* BOTTOM */}
            <View style={styles.bottomRow}>
              {/* USER INFO */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.name,
                    {
                      color: colors.text.primary,
                    },
                  ]}
                  numberOfLines={1}>
                  {item.userName}
                </Text>

                <View style={styles.locationRow}>
                  <Icon
                    name="location-on"
                    size={12}
                    color={colors.text.tertiary}
                    library="MaterialIcons"
                  />

                  <Text
                    style={[
                      styles.location,
                      {
                        color: colors.text.tertiary,
                      },
                    ]}
                    numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>

              {/* RATING */}
              {/* <View style={styles.ratingContainer}>
                <Icon
                  name="star"
                  size={13}
                  color="#FFC107"
                  library="MaterialIcons"
                />

                <Text style={styles.ratingText}>{item.rating}</Text>
              </View> */}
              <View style={styles.ratingContainer}>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      library="MaterialIcons"
                      name={
                        star <= item.rating
                          ? "star"
                          : "star-border"
                      }
                      size={17}
                      color="#FDBA12"
                    />
                  ))}
                </View>

                <Text style={styles.ratingText}>
                  {item.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },

  loaderContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {},

  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 50,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 8,
  },

  card: {
    width: width - 72,

    marginRight: 16,

    paddingTop: 54,
    paddingBottom: 18,
    paddingHorizontal: 18,

    borderRadius: 28,

    borderWidth: 1,

    // shadowColor: '#000',
    // shadowOpacity: 0.08,
    // shadowRadius: 14,
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },

    // elevation: 5,
  },

  imageWrapper: {
    position: 'absolute',
    top: -32,
    alignSelf: 'center',
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 32,

    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,

    width: 18,
    height: 18,
    borderRadius: 9,

    backgroundColor: '#22C55E',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  quoteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    marginBottom: 14,
  },

  comment: {
    textAlign: 'center',

    fontSize: 14,
    lineHeight: 24,

    marginBottom: 20,

    fontStyle: 'italic',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 4,
  },

  location: {
    fontSize: 12,
    marginLeft: 4,
  },

  // ratingContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',

  //   backgroundColor: '#FFC10720',

  //   paddingHorizontal: 10,
  //   paddingVertical: 5,

  //   borderRadius: 50,
  // },

  // ratingText: {
  //   marginLeft: 4,

  //   fontSize: 13,
  //   fontWeight: '700',

  //   color: '#E6A700',
  // },
  ratingContainer: {
    alignItems: "flex-end"
  },

  starRow: {
    flexDirection: "row"
  },

  ratingText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
    fontWeight: "700"
  }

});
