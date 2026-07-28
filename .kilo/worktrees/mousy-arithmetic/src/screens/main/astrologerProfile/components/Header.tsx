import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
// import {Icon} from '../../../components/Icon';
import { useTheme } from '../../../../theme';
import { Icon } from '../../../../components/Icon';
// import {useTheme} from '../../../theme';

type HeaderProps = {
  onBack: () => void;
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  onSendGiftPress: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  onBack,
  isFollowing,
  setIsFollowing,
  onSendGiftPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="Ionicons"
          />
          <Text style={[styles.backText, {color: colors.text.primary}]}>
            Back
          </Text>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSendGiftPress}
            style={[
              styles.giftButton,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.primary.main + '40',
              },
            ]}>
            <Icon
              name="gift"
              size={18}
              color={colors.primary.main}
              library="FontAwesome"
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsFollowing(!isFollowing)}
            style={[
              styles.followButton,
              {
                backgroundColor: isFollowing
                  ? colors.background.secondary
                  : colors.primary.main,
                borderWidth: 1,
                borderColor: isFollowing
                  ? colors.border.light
                  : colors.primary.main,
              },
            ]}>
            <Text
              style={[
                styles.followButtonText,
                {
                  color: isFollowing
                    ? colors.text.primary
                    : colors.primary.contrastText,
                },
              ]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    backgroundColor: '#F1EEF8',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  giftButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  followButton: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Header;