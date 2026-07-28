import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import images from '../../../assets/images';

const AstrologerCard = ({item, style, onPress}: any) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      {/* <Image
        source={{
          uri:
            item.profilePic && !item.profilePic.includes('example.com')
              ? item.profilePic
              : 'https://via.placeholder.com/150',
        }}
        style={styles.image}
      /> */}
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
  },
  name: {
    fontWeight: '600',
  },
  rating: {
    fontSize: 12,
  },
  price: {
    color: 'green',
    fontWeight: 'bold',
  },
  skills: {
    fontSize: 11,
    color: 'gray',
  },
});
