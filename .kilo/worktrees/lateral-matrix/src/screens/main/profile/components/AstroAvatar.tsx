import React from 'react';
import {View, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components';

type Props = {
  user?: {
    name?: string;
    profilePic?: string;
  };
  size?: number;
};

const dayIconMap = {
  0: {name: 'wb-sunny', color: '#FFA500'}, // Sun
  1: {name: 'brightness-3', color: '#C0C0C0'}, // Moon
  2: {name: 'whatshot', color: '#FF4500'}, // Mars
  3: {name: 'bubble-chart', color: '#00BFFF'}, // Mercury
  4: {name: 'auto-awesome', color: '#FFD700'}, // Jupiter
  5: {name: 'favorite', color: '#FF69B4'}, // Venus
  6: {name: 'brightness-2', color: '#2F4F4F'}, // Saturn
};

const getInitials = (name?: string) => {
  if (!name) return '';
  const words = name.split(' ');
  return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
};

export const AstroAvatar: React.FC<Props> = ({user, size = 60}) => {
  const {colors} = useTheme();

  const day = new Date().getDay();
  const icon = dayIconMap[day as keyof typeof dayIconMap];
  const initials = getInitials(user?.name);

  const iconSize = size * 0.5;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary.light + '30',
      }}>
      {user?.profilePic ? (
        <Image
          source={{uri: user.profilePic}}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : icon ? (
        <MaterialIcons name={icon.name} size={iconSize} color={icon.color} />
      ) : (
        <Text style={{color: colors.primary.main, fontWeight: 'bold'}}>
          {initials}
        </Text>
      )}
    </View>
  );
};
