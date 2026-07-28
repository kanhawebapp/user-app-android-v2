// import React from 'react';
// import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../Icon';
// import type {Astrologer} from '../types';

// interface HeaderSectionProps {
//   astrologer?: Astrologer;
//   onClose: () => void;
// }

// export const HeaderSection: React.FC<HeaderSectionProps> = ({
//   astrologer,
//   onClose,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const getImageSource = () => {
//     if (
//       astrologer?.profilePic &&
//       !astrologer.profilePic.includes('example.com')
//     ) {
//       return {uri: astrologer.profilePic};
//     }
//     return require('../../../../assets/images/Logo.png');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.astrologerInfo}>
//         <Image source={getImageSource()} style={styles.astrologerImage} />
//         <View style={styles.astrologerDetails}>
//           <Text style={[styles.headerTitle, {color: colors.text.primary}]}>
//             Chat with {astrologer?.name || 'Astrologer'}
//           </Text>
//           <View style={styles.astrologerMeta}>
//             <Text style={[styles.ratingText, {color: colors.text.secondary}]}>
//               {astrologer?.rating || 0} ★
//             </Text>
//             <Text style={[styles.priceText, {color: colors.secondary.main}]}>
//               ₹{astrologer?.price || 0}/min
//             </Text>
//           </View>
//         </View>
//       </View>
//       <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//         <Icon name="close" size={22} color={colors.text.secondary} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   astrologerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   astrologerImage: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     marginRight: 12,
//   },
//   astrologerDetails: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   astrologerMeta: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//   },
//   priceText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   closeButton: {
//     padding: 8,
//   },
// });

import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../Icon';
import type {Astrologer} from '../types';

interface HeaderSectionProps {
  astrologer?: Astrologer;
  onClose: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  astrologer,
  onClose,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [imageError, setImageError] = useState(false);

  const getImageSource = () => {
    if (
      astrologer?.profilePic &&
      !astrologer.profilePic.includes('example.com') &&
      !imageError
    ) {
      return {uri: astrologer.profilePic};
    }
    return require('../../../../assets/images/Logo.png');
  };

  return (
    <View style={styles.container}>
      <View style={styles.astrologerInfo}>
        {/* 🔥 IMAGE FIXED */}
        <View style={styles.imageWrapper}>
          <Image
            source={getImageSource()}
            style={styles.astrologerImage}
            onError={() => setImageError(true)}
          />
        </View>

        <View style={styles.astrologerDetails}>
          <Text
            numberOfLines={1}
            style={[styles.headerTitle, {color: colors.text.primary}]}>
            Chat with{' '}
            <Text style={{color: colors.primary.main}}>
              {astrologer?.name || 'Astrologer'}
            </Text>
          </Text>

          <View style={styles.astrologerMeta}>
            <Text style={[styles.ratingText, {color: colors.text.secondary}]}>
              {astrologer?.rating != null
                ? astrologer.rating.toFixed(2)
                : '0.00'}{' '}
              ★
            </Text>
            <Text style={[styles.priceText, {color: colors.secondary.main}]}>
              ₹{astrologer?.price || 0}/min
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close" size={22} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  astrologerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // imageWrapper: {
  //   width: 56,
  //   height: 56,
  //   borderRadius: 28,
  //   overflow: 'hidden',
  //   marginRight: 12,
  //   backgroundColor: '#eee',
  //   alignItems: 'center', // 🔥 important
  //   justifyContent: 'center', // 🔥 important
  // },

  // astrologerImage: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'cover', // ✅ FULL IMAGE SHOW (no crop)
  // },

  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff', // 👈 important (clean look)
    alignItems: 'center',
    justifyContent: 'center',
  },

  astrologerImage: {
    width: '90%', // 👈 🔥 key change (avoid edge cut)
    height: '90%', // 👈 🔥 key change
    resizeMode: 'contain', // ✅ NO CROP EVER
  },

  astrologerDetails: {
    flex: 1,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  astrologerMeta: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },

  ratingText: {
    fontSize: 13,
  },

  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },

  closeButton: {
    padding: 8,
  },
});
