// import React from 'react';
// import {
//   View, Text, Image,
//   TouchableOpacity, StyleSheet
// } from 'react-native';
// import { Icon } from '../../../components';
// import { colors } from '../../../theme';
// import images from '../../../assets/images';

// interface AstrologerCardProps {
//   item: any;
//   style?: any;
//   onPress?: () => void;
//   onChatPress?: () => void;
//   onCallPress?: () => void;
//   onAddPress?: () => void;
// }

// const AstrologerCard: React.FC<AstrologerCardProps> = ({
//   item,
//   style,
//   onPress,
//   onChatPress,
//   onCallPress,
//   onAddPress,
// }) => {
//   return (
//     <View style={[styles.card, style]}>
//       <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
//         <Image
//           source={
//             item?.profilePic && !item.profilePic.includes('example.com')
//               ? { uri: item.profilePic }
//               : images.Logo
//           }
//           style={styles.image}
//         />
//         <Text numberOfLines={1} style={styles.name}>
//           {item.name}
//         </Text>
//         {/* <View style={styles.row}>
//           <Text numberOfLines={1} style={styles.name}>
//             Name:
//           </Text>
//           <Text numberOfLines={1} style={styles.name}>
//             {item.name}
//           </Text>
//         </View> */}


//         <Text style={styles.rating}>⭐ {item.rating}</Text>
//         {/* <Text style={styles.rating}>⭐ {item.offerPrice}</Text> */}

//         <Text style={styles.price}>₹{item.price}/min</Text>

//         <Text numberOfLines={1} style={styles.skills}>
//           {item.skills?.join(', ')}
//         </Text>
//       </TouchableOpacity>

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
//   row: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   }
// });


// AstrologerCard.tsx

// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// import {Icon} from '../../../components';
// import images from '../../../assets/images';

// interface AstrologerCardProps {
//   item: any;
//   style?: any;
//   onPress?: () => void;
//   onChatPress?: () => void;
//   onCallPress?: () => void;
//   onAddPress?: () => void;
// }

// const AstrologerCard: React.FC<AstrologerCardProps> = ({
//   item,
//   style,
//   onPress,
//   onChatPress,
//   onCallPress,
//   onAddPress,
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

//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={styles.favoriteBtn}
//           onPress={onAddPress}>
//           <Icon
//             name="heart-outline"
//             size={16}
//             color="#FF4D6D"
//             library="Ionicons"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Profile */}
//       <View style={styles.imageWrapper}>
//         <Image
//           source={
//             item?.profilePic && !item.profilePic.includes('example.com')
//               ? {uri: item.profilePic}
//               : images.Logo
//           }
//           style={styles.image}
//         />

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
//             size={13}
//             color="#6C2BD9"
//             library="Ionicons"
//           />
//           <Text style={styles.infoText}>
//             {item?.experience || 5}+ yrs
//           </Text>
//         </View>

//         <View style={styles.priceBox}>
//           <Text style={styles.price}>₹{item?.price}</Text>
//           <Text style={styles.perMin}>/min</Text>
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
//             size={16}
//             color="#6C2BD9"
//             library="Ionicons"
//           />

//           <Text style={styles.chatBtnText}>Chat</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           activeOpacity={0.8}
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
//     width: 210,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 14,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,

//     elevation: 5,
//   },

//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },

//   onlineBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ECFDF3',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 100,
//   },

//   onlineDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 10,
//     backgroundColor: '#16A34A',
//     marginRight: 6,
//   },

//   onlineText: {
//     fontSize: 11,
//     color: '#15803D',
//     fontWeight: '700',
//   },

//   favoriteBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FFF1F2',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   imageWrapper: {
//     alignSelf: 'center',
//     marginBottom: 14,
//   },

//   image: {
//     width: 82,
//     height: 82,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#F3E8FF',
//   },

//   ratingBadge: {
//     position: 'absolute',
//     bottom: -4,
//     right: -6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 100,
//     paddingHorizontal: 8,
//     paddingVertical: 4,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,

//     elevation: 4,
//   },

//   ratingText: {
//     marginLeft: 4,
//     fontSize: 11,
//     fontWeight: '800',
//     color: '#111827',
//   },

//   name: {
//     textAlign: 'center',
//     fontSize: 17,
//     fontWeight: '800',
//     color: '#111827',
//   },

//   skills: {
//     marginTop: 4,
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 18,
//     minHeight: 34,
//   },

//   infoRow: {
//     marginTop: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 12,
//     gap: 5,
//   },

//   infoText: {
//     fontSize: 12,
//     color: '#374151',
//     fontWeight: '700',
//   },

//   priceBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },

//   price: {
//     fontSize: 20,
//     color: '#16A34A',
//     fontWeight: '800',
//   },

//   perMin: {
//     marginBottom: 2,
//     marginLeft: 2,
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '600',
//   },

//   actionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
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
//     color: '#6C2BD9',
//     fontSize: 13,
//     fontWeight: '800',
//   },

//   callBtn: {
//     flex: 1,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: '#16A34A',

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


// AstrologerCard.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Icon } from '../../../components';
import images from '../../../assets/images';
import { colors } from '../../../theme';

interface AstrologerCardProps {
  item: any;
  style?: any;
  onPress?: () => void;
  onChatPress?: () => void;
  onCallPress?: () => void;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  item,
  style,
  onPress,
  onChatPress,
  onCallPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.card, style]}
      onPress={onPress}>
      {/* Top Badge */}
      <View style={styles.topRow}>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>

        <View style={styles.ratingBadge}>
          <Icon
            name="star"
            size={10}
            color="#F59E0B"
            library="Ionicons"
          />

          <Text style={styles.ratingText}>
            {item?.rating || '4.8'}
          </Text>
        </View>
      </View>

      {/* Profile */}
      <Image
        source={
          item?.profilePic && !item.profilePic.includes('example.com')
            ? { uri: item.profilePic }
            : images.Logo
        }
        style={styles.image}
      />

      {/* Details */}
      <Text numberOfLines={1} style={styles.name}>
        {item?.name}
      </Text>

      <Text numberOfLines={1} style={styles.skills}>
        {item?.skills?.join(', ') || 'Vedic Astrology'}
      </Text>

      {/* Experience + Price */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Icon
            name="flash-outline"
            size={12}
            color="#6C2BD9"
            library="Ionicons"
          />

          <Text style={styles.infoText}>
            {item?.experience || 5}+ yrs
          </Text>
        </View>

        <View style={styles.priceSection}>
          {/* {!!item?.offerPrice && (
            <Text style={styles.oldPrice}>
              ₹{item?.offerPrice}
            </Text>
          )} */}

          <View style={styles.priceBox}>
          
            <Text style={styles.price}>
              ₹{item?.price}
            </Text>

            <Text style={styles.perMin}>/min</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.chatBtn}
          onPress={onChatPress}>
          <Icon
            name="chatbubble-ellipses-outline"
            size={15}
            color={colors.primary.main}
            library="Ionicons"
          />

          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.chatBtn}
          // style={styles.callBtn}
          onPress={onCallPress}>
          <Icon
            name="call-outline"
            size={15}
            color={colors.primary.main}
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
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 0.2,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },

  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    marginRight: 5,
  },

  onlineText: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: '700',
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 100,
  },

  ratingText: {
    marginLeft: 3,
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 40,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#F3E8FF',
    marginBottom: 2,
  },

  name: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary.main,
  },

  skills: {
    marginTop: 1,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    minHeight: 16,
  },

  infoRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },

  infoText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '700',
  },

  priceSection: {
    alignItems: 'flex-end',
  },

  oldPrice: {
    fontSize: 15,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 1,
    fontWeight: '600',
  },

  priceBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  price: {
    fontSize: 18,
    color:colors.primary.main,
    fontWeight: '800',
  },

  perMin: {
    marginBottom: 2,
    marginLeft: 2,
    fontSize: 10,
    // color: '#6B7280',
    color:colors.primary.main,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  chatBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    backgroundColor: '#FAF5FF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  chatBtnText: {
    color: '#6C2BD9',
    fontSize: 12,
    fontWeight: '800',
  },

  callBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#16A34A',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  callBtnText: {
    color: colors.primary.main,
    fontSize: 12,
    fontWeight: '800',
  },
});

