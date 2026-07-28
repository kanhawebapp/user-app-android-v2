// import React from 'react';
// import {FlatList, ActivityIndicator} from 'react-native';
// import {useAstrologers} from '../../../services/api/recomandedAstrologer/astrologer.hooks';
// import AstrologerCard from './AstrologerCard';

// const AstrologerListScreen = () => {
//   const {data, loading, page} = useAstrologers();

//     function loadMore(info: { distanceFromEnd: number; }): void {
//         throw new Error('Function not implemented.');
//     }

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={item => item.id}
//       renderItem={({item}) => <AstrologerCard item={item} />}
//       onEndReached={loadMore}
//       onEndReachedThreshold={0.5}
//     />

//   );
// };

// export default AstrologerListScreen;

import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {useAstrologers} from '../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from './AstrologerCard';

interface AstrologerListScreenProps {
  onBack?: () => void;
}

const AstrologerListScreen: React.FC<AstrologerListScreenProps> = ({
  onBack,
}) => {
  const {data, loading, loadMore} = useAstrologers();

  return (
    <View style={{flex: 1}}>
      {onBack && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) => (
          <View style={{flex: 1, margin: 6}}>
            <AstrologerCard item={item} />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{margin: 10}} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});

export default AstrologerListScreen;
