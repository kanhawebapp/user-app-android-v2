// import React from 'react';
// import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {FeaturedRemediesProps} from '../../types';
// import {Card} from '../../../../../components';

// export const FeatureHealings: React.FC<FeaturedRemediesProps> = ({
//   remedies = [],
//   onRemedyPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   return (
//     <View style={[styles.container, style]}>
//       <View style={styles.header}>
//         <Text variant="h6" weight="semibold">
//           Feature Healings
//         </Text>
//         <Button
//           title="View All"
//           variant="ghost"
//           size="small"
//           onPress={onViewAllPress}
//         />
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>
//         {remedies.map(remedy => (
//           <Card
//             key={remedy.id}
//             style={[
//               styles.card,
//               {
//                 backgroundColor: colors.card.background,
//                 borderColor: colors.card.border,
//                 padding: 0,
//               },
//             ]}
//             onPress={() => onRemedyPress?.(remedy)}>
//             {/* <View
//               style={[
//                 styles.imagePlaceholder,
//                 {backgroundColor: colors.background.secondary},
//               ]}>
//               <Icon
//                 name="spa"
//                 size={32}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//             </View> */}

//             <View style={styles.content}>
//               <Text variant="label" weight="semibold" numberOfLines={1}>
//                 {remedy.title}
//               </Text>
//               <Text
//                 variant="captionSmall"
//                 style={{color: colors.text.secondary, marginTop: 4}}
//                 numberOfLines={2}>
//                 {remedy.description}
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   marginTop: 8,
//                 }}>
//                 <Icon
//                   name="time-outline"
//                   size={16}
//                   color={colors.text.primary}
//                   library="Ionicons"
//                 />
//                 <Text
//                   variant="captionSmall"
//                   style={{color: colors.text.secondary, marginLeft: 4}}
//                   numberOfLines={1}>
//                   {remedy.duration} mins
//                 </Text>
//               </View>

//               <View style={styles.footer}>
//                 <Text
//                   variant="label"
//                   weight="bold"
//                   style={{color: colors.primary.main}}>
//                   ₹{remedy.price}
//                 </Text>
//                 {/* <Icon name="arrow-forward" size={16} color={colors.primary.main} library="MaterialIcons" /> */}
//                 <Button title="Book" style={styles.bookBtn} />
//               </View>
//             </View>
//           </Card>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 24,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   scrollContent: {
//     paddingHorizontal: 12,
//   },
//   card: {
//     width: 210,
//     // borderRadius: 12,
//     marginHorizontal: 4,
//     // overflow: 'hidden',
//     // borderWidth: 1,
//     // borderColor: 'rgba(0,0,0,0.05)',
//   },
//   imagePlaceholder: {
//     height: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   content: {
//     padding: 12,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   bookBtn: {
//     paddingHorizontal: 18,
//     paddingVertical: 0,
//     borderRadius: 10,

//   },
// });

import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { FeaturedRemediesProps } from '../../types';
import { Card } from '../../../../../components';
import images from '../../../../../assets/images';

export const FeatureHealings: React.FC<FeaturedRemediesProps> = ({
  remedies = [],
  onRemedyPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  // console.log("remediesremediesremedies", remedies)

  const getImageUrl = (url?: string) => {
    if (!url) return '';

    if (url.startsWith('http')) {
      return url;
    }

    return `https://dhwaniastro.com${url}`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold">
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
        {remedies.map(remedy => (
          <Card
            key={remedy.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card.background,
                borderColor: colors.card.border,
                padding: 0,
              },
            ]}
            // contentStyle={styles.cardContent} // 👈 IMPORTANT FIX
            onPress={() => onRemedyPress?.(remedy)}>
            <View style={styles.imageWrapper}>
              <Image
                // source={images.image}
                source={{ uri: getImageUrl(remedy.image) }}
                style={styles.image}
                resizeMode="cover"
                onError={e => console.log('Image error:', e.nativeEvent)} // debug
              />
            </View>

            <View style={styles.content}>
              <Text
                weight="semibold"
                numberOfLines={1}
                color={colors.primary.main}>
                {remedy.name}
              </Text>

              <Text
                variant="label"
                style={{ color: colors.text.secondary, marginTop: 2 }}
                numberOfLines={2}>
                {remedy.description}
              </Text>

              {/* <View style={styles.durationRow}>
                <Icon
                  name="time-outline"
                  size={14}
                  color={colors.text.primary}
                  library="Ionicons" 
                />
                <Text
                  variant="label"
                  style={{ color: colors.text.secondary, marginLeft: 4 }}>
                  {remedy.duration} mins
                </Text>
              </View> */}

              <View style={styles.footer}>
                <Text
                  variant="label"
                  weight="bold"
                  style={{ color: colors.text.primary }}>
                  ₹{remedy.price}
                </Text>

                <Button
                  onPress={() => onRemedyPress?.(remedy)}
                  title="Book"
                  style={styles.bookBtn}
                />
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  scrollContent: {
    paddingHorizontal: 8,
  },

  card: {
    width: 200,
    marginHorizontal: 6,
    // borderRadius: 12,
    // overflow: 'hidden',
  },

  // 👇 CARD INNER PADDING CONTROL
  cardContent: {
    padding: 6, // 🔥 yahi main fix hai (pehle zyada tha)
  },

  content: {
    // padding: 6, // 🔽 reduce from 12 → 6
    width: 170,
  },

  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  bookBtn: {
    // paddingHorizontal: 20,
    // paddingVertical: -10,
    // borderRadius: 8,
    height: 35,
    width: 85,
  },
  image: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  imageWrapper: {
    height: 140,
    width: '100%', // 🔥 IMPORTANT
    backgroundColor: '#eee', // 👈 debug (remove later)
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});
