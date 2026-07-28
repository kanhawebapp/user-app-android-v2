import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Image} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {TestimonialsProps} from '../../types';
import {Card} from '../../../../../components';

const {width} = Dimensions.get('window');

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
        contentContainerStyle={styles.scrollContent}>
        {testimonials.map(item => (
          <Card key={item.id} style={styles.card}>
            {/* 👤 FLOATING IMAGE */}
            <View style={styles.imageWrapper}>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>

            {/* 💬 COMMENT */}
            <Text style={styles.comment} numberOfLines={3}>
              “{item.comment}”
            </Text>

            {/* 🔻 BOTTOM */}
            <View style={styles.bottomRow}>
              {/* LEFT */}
              <View>
                <Text style={styles.name}>{item.userName}</Text>

                <View style={styles.locationRow}>
                  <Icon name="location-on" size={12} color="#888" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </View>

              {/* RIGHT ⭐ */}
              <View style={styles.ratingRow}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={i < item.rating ? 'star' : 'star-border'}
                    size={14}
                    color="#FFC107"
                  />
                ))}
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
    marginBottom: 24,
  },

  title: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 30, // 👈 space for floating image
  },

  // card: {
  //   width: width - 80,
  //   marginRight: 16,

  //   paddingTop: 50,
  //   paddingBottom: 16,
  //   paddingHorizontal: 16,

  //   borderRadius: 20,
  //   backgroundColor: '#fff',

  //   alignItems: 'center',

  //   // 🔥 shadow
  //   shadowColor: '#000',
  //   shadowOpacity: 0.08,
  //   shadowRadius: 10,
  //   shadowOffset: {width: 0, height: 5},
  //   elevation: 4,
  // },

  card: {
    width: width - 80,
    // marginHorizontal:10,
    marginRight: 16,

    paddingTop: 50,
    // paddingBottom: 16,
    // paddingHorizontal: 16,

    // borderRadius: 20,
    // backgroundColor: '#fff',

    // alignItems: 'center',

    // // 🌑 iOS Premium Soft Shadow
    // shadowColor: '#000',
    // shadowOpacity: 0.12,
    // shadowRadius: 18,
    // shadowOffset: {width: 0, height: 8},

    // // 🤖 Android (stronger depth)
    // elevation: 8,
    // marginBottom: 20,
  },

  imageWrapper: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,

    borderWidth: 3,
    borderColor: '#fff',

    resizeMode: 'cover',
  },

  comment: {
    textAlign: 'center',
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  location: {
    fontSize: 11,
    color: '#888',
    marginLeft: 2,
  },

  ratingRow: {
    flexDirection: 'row',
  },
});
