// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {Card} from '../../../../../components/Card';
// import {RecommendedAstrologersProps} from '../../types';
// import images from '../../../../../assets/images';

// export const RecommendedAstrologers: React.FC<RecommendedAstrologersProps> = ({
//   astrologers = [],
//   onAstrologerPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   return (
//     <View style={[styles.container, style]}>
//       <View style={styles.header}>
//         <Text variant="h6" weight="semibold">
//           Recommended Astrologers
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
//         {astrologers.map(astrologer => (
//           <Card
//             key={astrologer.id}
//             style={styles.card}
//             onPress={() => onAstrologerPress?.(astrologer)}>
//             <View
//               style={[
//                 styles.avatar,
//                 {backgroundColor: colors.primary.light + '30'},
//               ]}>
//               {/* <Icon name="person" size={32} color={colors.primary.main} library="MaterialIcons" /> */}
//               <Image
//                 source={images.mam} // 🔥 dynamic + fallback
//                 style={styles.avatarImage}
//               />
//             </View>
//             <View
//               style={[
//                 styles.statusDot,
//                 {
//                   backgroundColor:
//                     astrologer.availability === 'online'
//                       ? '#4CAF50'
//                       : '#FFC107',
//                 },
//               ]}
//             />

//             <Text
//               variant="label"
//               weight="semibold"
//               style={styles.name}
//               numberOfLines={1}>
//               {astrologer.name}
//             </Text>

//             <View style={styles.ratingContainer}>
//               <Icon
//                 name="star"
//                 size={14}
//                 color="#FFC107"
//                 library="MaterialIcons"
//               />
//               <Text
//                 variant="captionSmall"
//                 weight="bold"
//                 style={{marginLeft: 2}}>
//                 {astrologer.rating}
//               </Text>
//               <Text
//                 variant="captionSmall"
//                 style={{color: colors.text.secondary, marginLeft: 4}}>
//                 ({astrologer.experience})
//               </Text>
//             </View>

//             <Text
//               variant="captionSmall"
//               style={{color: colors.text.secondary, marginVertical: 4}}
//               numberOfLines={1}>
//               {astrologer.specialties.join(', ')}
//             </Text>

//             <Text
//               variant="label"
//               weight="bold"
//               style={{color: colors.primary.main, marginTop: 4}}>
//               ₹{astrologer.hourlyRate}/min
//             </Text>

//             <Button
//               title="Chat"
//               variant="outline"
//               size="small"
//               style={styles.actionButton}
//               onPress={() => onAstrologerPress?.(astrologer)}
//             />
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
//     width: 170,
//     alignItems: 'center',
//     padding: 12,
//     marginHorizontal: 4,
//   },

//   statusDot: {
//     position: 'absolute',
//     top: 58,
//     right: 55,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#FFF',
//   },
//   name: {
//     marginTop: 4,
//     marginBottom: 2,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actionButton: {
//     marginTop: 10,
//     width: '100%',
//     height: 32,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     overflow: 'hidden', // 🔥 important for circular image
//     marginBottom: 8,
//   },

//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 30,
//   },
// });

import React from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {useAstrologers} from '../../../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from '../../../recomandedAstrologer/AstrologerCard';

type HomeAstrologersProps = {
  onViewAllPress?: () => void;
  onSessionPress?: any;
  // sessions:any
};

const HomeAstrologers: React.FC<HomeAstrologersProps> = ({
  onViewAllPress,
  // onSessionPress,
  // sessions:[]
}) => {
  const {data} = useAstrologers();


  return (
    <View>
      {/* Header */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>Recommended Astrologers</Text>
        <TouchableOpacity
          //  onPress={()=>{
          //   onViewAllPress
          //   onSessionPress
          //  }}
          onPress={onViewAllPress}>
          <Text>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.slice(0, 5).map(item => (
          <AstrologerCard
            key={item.id}
            item={item}
            style={{width: 160, marginRight: 10}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeAstrologers;
