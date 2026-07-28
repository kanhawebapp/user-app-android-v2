// import React from 'react';
// import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
// import {useAstrologers} from '../../../../../services/api/recomandedAstrologer/astrologer.hooks';
// import AstrologerCard from '../../../recomandedAstrologer/AstrologerCard';
// import type {Astrologer} from '../../../../../services/api/recomandedAstrologer/astrologer.types';

// // type HomeAstrologersProps = {
// //   onViewAllPress?: () => void;
// //   onAstrologerPress?: (astrologer: Astrologer) => void;
// //   onChatPress?: (astrologer: Astrologer) => void;
// //   onAddPress?: (astrologer: Astrologer) => void;
// // };

// type HomeAstrologersProps = {
//   onViewAllPress?: () => void;
//   onAstrologerPress?: (astrologer: Astrologer) => void;
//   onChatPress?: (astrologer: Astrologer) => void;
//   onCallPress?: (astrologer: Astrologer) => void;
//   onAddPress?: (astrologer: Astrologer) => void;
// };

// const HomeAstrologers: React.FC<HomeAstrologersProps> = ({
//   // onViewAllPress,
//   // onAstrologerPress,
//   // onChatPress,
//   // onAddPress,

//   onViewAllPress,
//   onAstrologerPress,
//   onChatPress,
//   onCallPress,
//   onAddPress,
// }) => {
//   const {data} = useAstrologers();
//   // console.log('Recommended Astrologers Data:', data);

//   return (
//     <View>
//       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//         <Text>Recommended Astrologers</Text>
//         <TouchableOpacity onPress={onViewAllPress}>
//           <Text>View All</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Horizontal List */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {data.slice(0, 5).map(item => (
//           // <AstrologerCard
//           //   key={item.id}
//           //   item={item}
//           //   style={{width: 160, marginRight: 10}}
//           //   onPress={() => onAstrologerPress?.(item)}
//           //   onChatPress={() => onChatPress?.(item)}
//           //   onAddPress={() => onAddPress?.(item)}
//           // />
//           <AstrologerCard
//             key={item.id}
//             item={item}
//             style={{width: 160, marginRight: 10}}
//             onPress={() => onAstrologerPress?.(item)}
//             onChatPress={() => onChatPress?.(item)}
//             onCallPress={() => onCallPress?.(item)}
//             onAddPress={() => onAddPress?.(item)}
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default HomeAstrologers;

import React from 'react';
import {ScrollView, View, TouchableOpacity, StyleSheet} from 'react-native';

import {Text} from '../../../../../components';
import {useAstrologers} from '../../../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from '../../../recomandedAstrologer/AstrologerCard';
import type {Astrologer} from '../../../../../services/api/recomandedAstrologer/astrologer.types';
import {colors} from '../../../../../theme';

type HomeAstrologersProps = {
  onViewAllPress?: () => void;
  onAstrologerPress?: (astrologer: Astrologer) => void;
  onChatPress?: (astrologer: Astrologer) => void;
  onCallPress?: (astrologer: Astrologer) => void;
  onAddPress?: (astrologer: Astrologer) => void;
};

const HomeAstrologers: React.FC<HomeAstrologersProps> = ({
  onViewAllPress,
  onAstrologerPress,
  onChatPress,
  onCallPress,
  onAddPress,
}) => {
  const {data = []} = useAstrologers();

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.headerContainer}>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.viewAllBtn}
          onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>

          <Icon
            name="arrow-forward"
            size={16}
            color="#6C2BD9"
            library="Ionicons"
          />
        </TouchableOpacity>

      </View> */}
      <View style={styles.borderHeader}>
        <Text variant="h6" weight="semibold" style={{fontWeight: '600'}}>
          Recommended Astrologers
        </Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text color={colors.primary.main}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {data.slice(0, 5).map(item => (
          <AstrologerCard
            key={item.id}
            item={item}
            style={styles.cardSpacing}
            onPress={() => onAstrologerPress?.(item)}
            onChatPress={() => onChatPress?.(item)}
            onCallPress={() => onCallPress?.(item)}
            // onAddPress={() => onAddPress?.(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeAstrologers;

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
  },

  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  subHeading: {
    marginTop: 3,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },

  viewAllText: {
    color: '#6C2BD9',
    fontSize: 13,
    fontWeight: '500',
  },

  scrollContainer: {
    // paddingLeft: 16,
    // paddingRight: 6,
    // paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 6,
    paddingBottom: 8,
  },

  cardSpacing: {
    marginRight: 14,
  },
});
