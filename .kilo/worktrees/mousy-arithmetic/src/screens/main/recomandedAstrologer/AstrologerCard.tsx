// import React from 'react';
// import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
// import {Icon} from '../../../components';
// import {colors} from '../../../theme';
// import {typography} from '../../../theme/typography';
// import images from '../../../assets/images';

// // interface AstrologerCardProps {
// //   item: any;
// //   style?: any;
// //   onPress?: () => void;
// //   onChatPress?: () => void;
// //   onAddPress?: () => void;
// // }
// interface AstrologerCardProps {
//   item: any;
//   style?: any;
//   onPress?: () => void;
//   onChatPress?: () => void;
//   onCallPress?: () => void;
//   onAddPress?: () => void;
// }

// const AstrologerCard: React.FC<AstrologerCardProps> = ({
//   // item,
//   // style,
//   // onPress,
//   // onChatPress,
//   // onAddPress,
//   item,
//   style,
//   onPress,
//   onChatPress,
//   onCallPress,
//   onAddPress,
// }) => {
//   return (
//     <View style={[styles.card, style]}>
//       {/* Card body - taps to view profile */}
//       <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
//         <Image
//           source={
//             item?.profilePic && !item.profilePic.includes('example.com')
//               ? {uri: item.profilePic}
//               : images.Logo
//           }
//           style={styles.image}
//         />

//         <Text numberOfLines={1} style={styles.name}>
//           {item.name}
//         </Text>

//         <Text style={styles.rating}>⭐ {item.rating}</Text>

//         <Text style={styles.price}>₹{item.price}/min</Text>

//         <Text numberOfLines={1} style={styles.skills}>
//           {item.skills?.join(', ')}
//         </Text>
//       </TouchableOpacity>

//       {/* Action buttons row */}
//       {/* <View style={styles.actionsRow}> */}
//       {/* <TouchableOpacity
//         style={styles.chatBtn}
//         onPress={onChatPress}
//         activeOpacity={0.7}>
//         <Icon
//           name="chatbubble-ellipses-outline"
//           size={14}
//           color="#6200EE"
//           library="Ionicons"
//         />
//         <Text style={styles.chatBtnText}>Chat</Text>
//       </TouchableOpacity> */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity
//           style={styles.chatBtn}
//           onPress={onChatPress}
//           activeOpacity={0.7}>
//           <Icon
//             name="chatbubble-ellipses-outline"
//             size={14}
//             color="#6200EE"
//             library="Ionicons"
//           />
//           <Text style={styles.chatBtnText}>Chat</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.callBtn}
//           onPress={onCallPress}
//           activeOpacity={0.7}>
//           <Icon
//             name="call-outline"
//             size={14}
//             color="#0A8F3D"
//             library="Ionicons"
//           />
//           <Text style={styles.callBtnText}>Call</Text>
//         </TouchableOpacity>
//       </View>

//       {/* </View> */}
//     </View>
//   );
// };

// export default AstrologerCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 10,
//     alignItems: 'center',
//   },
//   image: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginBottom: 8,
//     alignSelf: 'center',
//   },
//   name: {
//     fontWeight: '600',
//     textAlign: 'center',
//     color: colors.text.primary,
//   },
//   rating: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: colors.text.secondary,
//   },
//   price: {
//     color: 'green',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   skills: {
//     fontSize: 11,
//     color: 'gray',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   actionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     marginTop: 4,
//   },
//   // chatBtn: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   //   width: '100%',
//   //   gap: 4,
//   //   paddingHorizontal: 12,
//   //   // marginHorizontal: 10,
//   //   paddingVertical: 6,
//   //   borderRadius: 8,
//   //   borderWidth: 1,
//   //   borderColor: '#6200EE',
//   // },
//   chatBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#6200EE',
//   },
//   chatBtnText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6200EE',
//   },
//   addBtn: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#6200EE',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   callBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#0A8F3D',
//   },

//   callBtnText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0A8F3D',
//   },
// });

// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// import { Icon } from '../../../components';
// import images from '../../../assets/images';
// import { colors } from '../../../theme';

// interface AstrologerCardProps {
//   item: any;
//   style?: any;
//   onPress?: () => void;
//   onChatPress?: () => void;
//   onCallPress?: () => void;
// }

// const AstrologerCard: React.FC<AstrologerCardProps> = ({
//   item,
//   style,
//   onPress,
//   onChatPress,
//   onCallPress,
// }) => {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.92}
//       style={[styles.card, style]}
//       onPress={onPress}>
//       {/* Top Badge */}
//       <View style={styles.topRow}>
//         <View style={styles.onlineBadge}>
//           <View style={styles.onlineDot} />
//           <Text style={styles.onlineText}>Online</Text>
//         </View>

//         <View style={styles.ratingBadge}>
//           <Icon
//             name="star"
//             size={10}
//             color="#F59E0B"
//             library="Ionicons"
//           />

//           <Text style={styles.ratingText}>
//             {item?.rating || '4.8'}
//           </Text>
//         </View>
//       </View>

//       {/* Profile */}
//       <Image
//         source={
//           item?.profilePic && !item.profilePic.includes('example.com')
//             ? { uri: item.profilePic }
//             : images.Logo
//         }
//         style={styles.image}
//       />

//       {/* Details */}
//       <Text numberOfLines={1} style={styles.name}>
//         {item?.name}
//       </Text>

//       <Text numberOfLines={1} style={styles.skills}>
//         {item?.skills?.join(', ') || 'Vedic Astrology'}
//       </Text>

//       {/* Experience + Price */}
//       <View style={styles.infoRow}>
//         <View style={styles.infoBox}>
//           <Icon
//             name="flash-outline"
//             size={12}
//             color="#6C2BD9"
//             library="Ionicons"
//           />

//           <Text style={styles.infoText}>
//             {item?.experience || 5}+ yrs
//           </Text>
//         </View>

//         <View style={styles.priceSection}>
//           {/* {!!item?.offerPrice && (
//             <Text style={styles.oldPrice}>
//               ₹{item?.offerPrice}
//             </Text>
//           )} */}

//           <View style={styles.priceBox}>

//             <Text style={styles.price}>
//               ₹{item?.pricing[0]?.price}
//             </Text>

//             <Text style={styles.perMin}>/min</Text>
//           </View>
//         </View>
//       </View>

//       {/* Buttons */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           style={styles.chatBtn}
//           onPress={onChatPress}>
//           <Icon
//             name="chatbubble-ellipses-outline"
//             size={15}
//             color={colors.primary.main}
//             library="Ionicons"
//           />

//           <Text style={styles.chatBtnText}>Chat</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           activeOpacity={0.8}
//           style={styles.chatBtn}
//           // style={styles.callBtn}
//           onPress={onCallPress}>
//           <Icon
//             name="call-outline"
//             size={15}
//             color={colors.primary.main}
//             library="Ionicons"
//           />

//           <Text style={styles.callBtnText}>Call</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default AstrologerCard;

// const styles = StyleSheet.create({
//   card: {
//     width: 190,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 12,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,

//     elevation: 0.2,
//   },

//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     // marginBottom: 10,
//   },

//   onlineBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ECFDF3',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 100,
//   },

//   onlineDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 10,
//     backgroundColor: '#16A34A',
//     marginRight: 5,
//   },

//   onlineText: {
//     fontSize: 10,
//     color: '#15803D',
//     fontWeight: '700',
//   },

//   ratingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF7ED',
//     paddingHorizontal: 7,
//     paddingVertical: 4,
//     borderRadius: 100,
//   },

//   ratingText: {
//     marginLeft: 3,
//     fontSize: 10,
//     fontWeight: '800',
//     color: '#111827',
//   },

//   image: {
//     width: 64,
//     height: 64,
//     borderRadius: 40,
//     alignSelf: 'center',
//     borderWidth: 2,
//     borderColor: '#F3E8FF',
//     marginBottom: 2,
//   },

//   name: {
//     textAlign: 'center',
//     fontSize: 15,
//     fontWeight: '800',
//     color: colors.primary.main,
//   },

//   skills: {
//     marginTop: 1,
//     fontSize: 11,
//     color: '#6B7280',
//     textAlign: 'center',
//     minHeight: 16,
//   },

//   infoRow: {
//     marginTop: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     borderRadius: 10,
//     gap: 4,
//   },

//   infoText: {
//     fontSize: 11,
//     color: '#374151',
//     fontWeight: '700',
//   },

//   priceSection: {
//     alignItems: 'flex-end',
//   },

//   oldPrice: {
//     fontSize: 15,
//     color: '#9CA3AF',
//     textDecorationLine: 'line-through',
//     marginBottom: 1,
//     fontWeight: '600',
//   },

//   priceBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },

//   price: {
//     fontSize: 18,
//     color: colors.primary.main,
//     fontWeight: '800',
//   },

//   perMin: {
//     marginBottom: 2,
//     marginLeft: 2,
//     fontSize: 10,
//     // color: '#6B7280',
//     color: colors.primary.main,
//     fontWeight: '600',
//   },

//   actionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     gap: 8,
//   },

//   chatBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#E9D5FF',
//     backgroundColor: '#FAF5FF',

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 5,
//   },

//   chatBtnText: {
//     color: '#6C2BD9',
//     fontSize: 12,
//     fontWeight: '800',
//   },

//   callBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#16A34A',

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 5,
//   },

//   callBtnText: {
//     color: colors.primary.main,
//     fontSize: 12,
//     fontWeight: '800',
//   },
// });


//2nd
// import React, { useMemo } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// import { Icon } from '../../../components';
// import images from '../../../assets/images';
// import { colors } from '../../../theme';

// interface PricingItem {
//   type: string;
//   price: number;
//   offerPrice?: number;
//   commissionPercent?: number;
// }

// interface AstrologerCardProps {
//   item: any;
//   style?: any;
//   onPress?: () => void;
//   onChatPress?: () => void;
//   onCallPress?: () => void;
// }

// const AstrologerCard: React.FC<AstrologerCardProps> = ({
//   item,
//   style,
//   onPress,
//   onChatPress,
//   onCallPress,
// }) => {
//   /*
//   |--------------------------------------------------------------------------
//   | Data
//   |--------------------------------------------------------------------------
//   */

//   const rating =
//     item?.rating && item?.rating > 0 ? Number(item.rating).toFixed(1) : '4.8';

//   const experience = item?.experience || 0;

//   const skills =
//     item?.skills?.length > 0 ? item.skills.join(', ') : 'Vedic Astrology';

//   const languages =
//     item?.languages?.length > 0 ? item.languages.join(', ') : 'Hindi';

//   /*
//   |--------------------------------------------------------------------------
//   | Pricing
//   |--------------------------------------------------------------------------
//   */

//   const chatPricing: PricingItem | undefined = useMemo(() => {
//     return item?.pricing?.find((p: PricingItem) => p?.type === 'CHAT');
//   }, [item]);

//   const callPricing: PricingItem | undefined = useMemo(() => {
//     return item?.pricing?.find((p: PricingItem) => p?.type === 'CALL');
//   }, [item]);

//   const finalPrice =
//     chatPricing?.offerPrice ||
//     chatPricing?.price ||
//     callPricing?.offerPrice ||
//     callPricing?.price ||
//     0;

//   const oldPrice = chatPricing?.offerPrice ? chatPricing?.price : undefined;

//   /*
//   |--------------------------------------------------------------------------
//   | Online Status
//   |--------------------------------------------------------------------------
//   */

//   console.log("item list of astro", item)
//   return (
//     <TouchableOpacity
//       activeOpacity={0.92}
//       style={[styles.card, style]}
//       onPress={onPress}>
//       {/* Top */}
//       <View style={styles.topRow}>
//         {/* Rating */}
//         <View style={styles.ratingBadge}>
//           <Icon name="star" size={11} color="#F59E0B" library="Ionicons" />

//           <Text style={styles.ratingText}>{rating}</Text>
//         </View>
//       </View>

//       {/* Profile Image */}
//       <View style={styles.imageWrapper}>
//         <Image
//           source={item?.profilePic ? { uri: item.profilePic } : images.Logo}
//           style={styles.image}
//         />

//         <View style={styles.experienceBadge}>
//           <Text style={styles.experienceBadgeText}>{experience}+ yrs</Text>
//         </View>
//       </View>

//       {/* Name */}
//       <Text numberOfLines={1} style={styles.name}>
//         {item?.name || 'Astrologer'}
//       </Text>

//       {/* Skills */}
//       <Text numberOfLines={2} style={styles.skills}>
//         {skills}
//       </Text>

//       {/* Languages */}
//       <View style={styles.languageRow}>
//         <Icon
//           name="language-outline"
//           size={13}
//           color="#6B7280"
//           library="Ionicons"
//         />

//         <Text numberOfLines={1} style={styles.languageText}>
//           {languages}
//         </Text>
//       </View>

//       {/* Price Card */}
//       <View style={styles.priceCard}>
//         <View>
//           <View style={styles.priceRow}>
//             {!!oldPrice && <Text style={styles.oldPrice}>₹{oldPrice}</Text>}

//             <Text style={styles.price}>₹{finalPrice}</Text>

//             <Text style={styles.perMin}>/min</Text>
//           </View>
//         </View>

//         {!!oldPrice && (
//           <View style={styles.offerBadge}>
//             <Text style={styles.offerText}>OFFER</Text>
//           </View>
//         )}
//       </View>

//       {/* Actions */}
//       <View style={styles.actionsRow}>
//         {/* Chat */}
//         <TouchableOpacity
//           activeOpacity={0.85}
//           style={styles.chatBtn}
//           onPress={onChatPress}>
//           <Icon
//             name="chatbubble-ellipses-outline"
//             size={16}
//             color={colors.primary.main}
//             library="Ionicons"
//           />

//           <Text style={styles.chatBtnText}>Chat</Text>
//         </TouchableOpacity>

//         {/* Call */}
//         <TouchableOpacity
//           activeOpacity={0.85}
//           style={styles.callBtn}
//           onPress={onCallPress}>
//           <Icon
//             name="call-outline"
//             size={16}
//             color="#FFFFFF"
//             library="Ionicons"
//           />

//           <Text style={styles.callBtnText}>Call</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default AstrologerCard;

// const styles = StyleSheet.create({
//   card: {
//     width: 200,

//     backgroundColor: '#FFFFFF',

//     borderRadius: 24,

//     padding: 14,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     // shadowOpacity: 0.08,
//     // shadowRadius: 14,

//     elevation: 0.4,
//   },

//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },

//   onlineBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',

//     paddingHorizontal: 10,
//     paddingVertical: 5,

//     borderRadius: 100,
//   },

//   onlineDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 20,
//     marginRight: 6,
//   },

//   onlineText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },

//   ratingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',

//     backgroundColor: '#FFF7ED',

//     paddingHorizontal: 8,
//     paddingVertical: 5,

//     borderRadius: 100,
//   },

//   ratingText: {
//     marginLeft: 4,
//     fontSize: 11,
//     fontWeight: '800',
//     color: '#111827',
//   },

//   imageWrapper: {
//     marginTop: -20,
//     alignSelf: 'center',
//   },

//   image: {
//     width: 78,
//     height: 78,
//     borderRadius: 100,

//     borderWidth: 3,
//     borderColor: '#F3E8FF',
//   },

//   experienceBadge: {
//     position: 'absolute',
//     bottom: -4,
//     alignSelf: 'center',

//     backgroundColor: colors.primary.light,

//     paddingHorizontal: 10,
//     paddingVertical: 4,

//     borderRadius: 100,
//   },

//   experienceBadgeText: {
//     color: colors.common.black,
//     fontSize: 10,
//     fontWeight: '700',
//   },

//   name: {
//     marginTop: 4,

//     textAlign: 'center',

//     fontSize: 15,
//     fontWeight: '600',

//     color: '#111827',
//   },

//   skills: {
//     // marginTop: 6,

//     textAlign: 'center',

//     fontSize: 12,
//     // lineHeight: 18,

//     color: '#6B7280',

//     // minHeight: 36,
//   },

//   languageRow: {
//     // marginTop: 10,

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',

//     gap: 5,
//   },

//   languageText: {
//     fontSize: 12,
//     color: '#4B5563',
//     fontWeight: '600',
//   },

//   priceCard: {
//     marginTop: 4,

//     backgroundColor: '#FAF5FF',

//     borderRadius: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 5,

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   priceLabel: {
//     fontSize: 11,
//     color: '#6B7280',
//     marginBottom: 4,
//     fontWeight: '600',
//   },

//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },

//   oldPrice: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     textDecorationLine: 'line-through',
//     marginRight: 6,
//     marginBottom: 1,
//     fontWeight: '700',
//   },

//   price: {
//     fontSize: 16,
//     color: colors.primary.main,
//     fontWeight: '600',
//   },

//   perMin: {
//     marginLeft: 3,
//     marginBottom: 3,

//     fontSize: 11,
//     color: colors.primary.main,
//     fontWeight: '700',
//   },

//   offerBadge: {
//     backgroundColor: '#DCFCE7',

//     paddingHorizontal: 10,
//     paddingVertical: 5,

//     borderRadius: 100,
//   },

//   offerText: {
//     fontSize: 10,
//     fontWeight: '800',
//     color: '#15803D',
//   },

//   actionsRow: {
//     marginTop: 16,

//     flexDirection: 'row',
//     alignItems: 'center',

//     gap: 10,
//   },

//   chatBtn: {
//     flex: 1,

//     height: 44,

//     borderRadius: 14,

//     borderWidth: 1.5,
//     borderColor: '#E9D5FF',

//     backgroundColor: '#FAF5FF',

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',

//     gap: 6,
//   },

//   chatBtnText: {
//     color: colors.primary.main,
//     fontSize: 13,
//     fontWeight: '800',
//   },

//   callBtn: {
//     flex: 1,

//     height: 44,

//     borderRadius: 14,

//     backgroundColor: colors.primary.main,

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',

//     gap: 6,
//   },

//   callBtnText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '800',
//   },
// });


import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from '../../../components';
import images from '../../../assets/images';
import { colors } from '../../../theme';

interface PricingItem {
  type: string;
  price: number;
  offerPrice?: number;
  commissionPercent?: number;
}

interface AstrologerCardProps {
  item: any;
  style?: any;
  onPress?: () => void;
  onChatPress?: () => void;
  onCallPress?: () => void;
}

const BASE_IMAGE_URL = 'http://YOUR_BASE_URL_HERE.com';
// Example:
// const BASE_IMAGE_URL = 'https://api.yourapp.com';

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  item,
  style,
  onPress,
  onChatPress,
  onCallPress,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Basic Data
  |--------------------------------------------------------------------------
  */

  const rating =
    item?.rating && item?.rating > 0
      ? Number(item.rating).toFixed(1)
      : '4.8';

  const experience = item?.experience || 0;

  const skills =
    item?.skills?.length > 0
      ? item.skills.join(', ')
      : 'Vedic Astrology';

  const languages =
    item?.languages?.length > 0
      ? item.languages.join(', ')
      : 'Hindi';

  /*
  |--------------------------------------------------------------------------
  | Pricing
  |--------------------------------------------------------------------------
  */

  const chatPricing: PricingItem | undefined = useMemo(() => {
    return item?.pricing?.find(
      (p: PricingItem) => p?.type?.toUpperCase() === 'CHAT',
    );
  }, [item]);

  const callPricing: PricingItem | undefined = useMemo(() => {
    return item?.pricing?.find(
      (p: PricingItem) => p?.type?.toUpperCase() === 'CALL',
    );
  }, [item]);

  const chatPrice =
    chatPricing?.offerPrice || chatPricing?.price || 0;

  const callPrice =
    callPricing?.offerPrice || callPricing?.price || 0;

  const oldChatPrice = chatPricing?.offerPrice
    ? chatPricing?.price
    : undefined;

  const oldCallPrice = callPricing?.offerPrice
    ? callPricing?.price
    : undefined;

  /*
  |--------------------------------------------------------------------------
  | Profile Image
  |--------------------------------------------------------------------------
  */

  // Your API returns:
  // /adminAuth/uploads/documents/1779881890059-ors.jpg
  // So we need full URL

  const profileImage = item?.profilePic
    ? {
      uri: item.profilePic.startsWith('http')
        ? item.profilePic
        : `${BASE_IMAGE_URL}${item.profilePic}`,
    }
    : images.Logo;

  // console.log('item list of astro', item);
  // console.log('PROFILE IMAGE => ', profileImage);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.card, style]}
      onPress={onPress}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.ratingBadge}>
          <Icon
            name="star"
            size={11}
            color="#F59E0B"
            library="Ionicons"
          />

          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={profileImage}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.experienceBadge}>
          <Text style={styles.experienceBadgeText}>
            {experience}+ yrs
          </Text>
        </View>
      </View>

      {/* Name */}
      <Text numberOfLines={1} style={styles.name}>
        {item?.name || 'Astrologer'}
      </Text>

      {/* Skills */}
      <Text numberOfLines={2} style={styles.skills}>
        {skills}
      </Text>

      {/* Languages */}
      <View style={styles.languageRow}>
        <Icon
          name="language-outline"
          size={13}
          color="#6B7280"
          library="Ionicons"
        />

        <Text numberOfLines={1} style={styles.languageText}>
          {languages}
        </Text>
      </View>

      {/* Price Card */}
      <View style={styles.priceCard}>
        {/* Chat Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Chat</Text>

          <View style={styles.priceRow}>
            {!!oldChatPrice && (
              <Text style={styles.oldPrice}>
                ₹{oldChatPrice}
              </Text>
            )}

            <Text style={styles.price}>₹{chatPrice}</Text>

            <Text style={styles.perMin}>/min</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Call Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Call</Text>

          <View style={styles.priceRow}>
            {!!oldCallPrice && (
              <Text style={styles.oldPrice}>
                ₹{oldCallPrice}
              </Text>
            )}

            <Text style={styles.price}>₹{callPrice}</Text>

            <Text style={styles.perMin}>/min</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {/* Chat */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.chatBtn}
          onPress={onChatPress}>
          <Icon
            name="chatbubble-ellipses-outline"
            size={16}
            color={colors.primary.main}
            library="Ionicons"
          />

          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>

        {/* Call */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.callBtn}
          onPress={onCallPress}>
          <Icon
            name="call-outline"
            size={16}
            color="#FFFFFF"
            library="Ionicons"
          />

          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default AstrologerCard;

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF7ED',

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 100,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },

  imageWrapper: {
    marginTop: -20,
    alignSelf: 'center',
  },

  image: {
    width: 78,
    height: 78,
    borderRadius: 100,

    borderWidth: 3,
    borderColor: '#F3E8FF',

    backgroundColor: '#F3F4F6',
  },

  experienceBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',

    backgroundColor: colors.primary.light,

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 100,
  },

  experienceBadgeText: {
    color: colors.common.black,
    fontSize: 10,
    fontWeight: '700',
  },

  name: {
    marginTop: 8,

    textAlign: 'center',

    fontSize: 15,
    fontWeight: '600',

    color: '#111827',
  },

  skills: {
    textAlign: 'center',

    fontSize: 12,

    color: '#6B7280',
  },

  languageRow: {
    marginTop: 4,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  languageText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },

  priceCard: {
    marginTop: 5,

    backgroundColor: '#FAF5FF',

    borderRadius: 16,

    paddingHorizontal: 5,
    paddingVertical: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceSection: {
    flex: 1,
    alignItems: 'center',
  },

  priceTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 4,
    marginBottom: 1,
    fontWeight: '700',
  },

  price: {
    fontSize: 15,
    color: colors.primary.main,
    fontWeight: '700',
  },

  perMin: {
    marginLeft: 2,
    marginBottom: 2,

    fontSize: 10,
    color: colors.primary.main,
    fontWeight: '700',
  },

  actionsRow: {
    marginTop: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  chatBtn: {
    flex: 1,

    height: 44,

    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: '#E9D5FF',

    backgroundColor: '#FAF5FF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,
  },

  chatBtnText: {
    color: colors.primary.main,
    fontSize: 13,
    fontWeight: '800',
  },

  callBtn: {
    flex: 1,

    height: 44,

    borderRadius: 14,

    backgroundColor: colors.primary.main,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,
  },

  callBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

