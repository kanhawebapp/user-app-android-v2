import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Text} from '../../../../components/Text';
import FastImage from 'react-native-fast-image';
import { Text, useTheme } from '../../../../../../components';
import { API_BASE_URL } from '../../../../../../constants/api.constants';

interface AstrologerCardProps {
  name?: string;
  profilePic?: string;
}

export const AstrologerCard: React.FC<AstrologerCardProps> = ({
  name,
  profilePic,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!name) {
    return null;
  }

  // const imageUrl = profilePic
  //   ? profilePic.startsWith('http')
  //     ? profilePic
  //     : `https://dhwaniastro.com${profilePic}`
  //   : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

    const imageUrl = profilePic
    ? profilePic.startsWith('http')
      ? profilePic
      : `${API_BASE_URL.DEVELOPMENT}${profilePic}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;


  return (
    <View
      style={[
        styles.astrologerCard,
        {backgroundColor: colors.card.background, borderColor: colors.border.light},
      ]}>
      <Text
        variant="bodySmall"
        weight="medium"
        color={colors.text.secondary}
        style={styles.astrologerLabel}>
        Sending Gift To
      </Text>
      <FastImage
        source={{uri: imageUrl}}
        style={[styles.avatar, {borderColor: colors.primary.light}]}
        resizeMode="cover"
        borderRadius={32}
      />
      <Text
        variant="h6"
        weight="semibold"
        color={colors.text.primary}
        style={styles.astrologerNameText}>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  astrologerCard: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
  } as ViewStyle,
  astrologerLabel: {
    marginBottom: 12,
  } as TextStyle,
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    borderWidth: 3,
  } as ImageStyle,
  astrologerNameText: {
    textAlign: 'center',
  } as TextStyle,
});