import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import images from '../../../assets/images';
import {Icon} from '../../../components';
import { colors } from '../../../theme';

interface AstrologerCardProps {
  item: any;
  style?: any;
  onPress?: () => void;
  onChatPress?: () => void;
  onAddPress?: () => void;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  item,
  style,
  onPress, 
  onChatPress,
  onAddPress,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Card body - taps to view profile */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Image
          source={
            item?.profilePic && !item.profilePic.includes('example.com')
              ? {uri: item.profilePic}
              : images.Logo
          }
          style={styles.image}
        />

        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.rating}>⭐ {item.rating}</Text>

        <Text style={styles.price}>₹{item.price}/min</Text>

        <Text numberOfLines={1} style={styles.skills}>
          {item.skills?.join(', ')}
        </Text>
      </TouchableOpacity>

      {/* Action buttons row */}
      {/* <View style={styles.actionsRow}> */}
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={onChatPress}
          activeOpacity={0.7}>
          <Icon
            name="chatbubble-ellipses-outline"
            size={14}
            color="#6200EE"
            library="Ionicons"
          />
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>

       
      {/* </View> */}
    </View>
  );
};

export default AstrologerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    alignSelf: 'center',
  },
  name: {
    fontWeight: '600',
    textAlign: 'center',
    color:colors.text.primary,
  },
  rating: {
    fontSize: 12,
    textAlign: 'center',
    color:colors.text.secondary,
  },
  price: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skills: {
    fontSize: 11,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 4,
    paddingHorizontal: 12,
    // marginHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6200EE',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
