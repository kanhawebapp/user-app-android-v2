import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme';
import { Icon } from '../../../../components/Icon';
import { useFollowAstrologer } from '../../../../services/api/followAstrologer/useFollowAstrologer';
import { useFollowersCount } from '../../../../services/api/followersCount/followers-count.hook';

type HeaderProps = {
  data: any;
  onBack: () => void;
  // onSendGiftPress: () => void;
  followersCount: any
};

export const Header: React.FC<HeaderProps> = ({
  onBack,
  followersCount,
  data
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const {
    isFollowing,
    follow,
    unfollow,
    checkFollowStatus
  } = useFollowAstrologer();
  const {
    fetchFollowersCount,
  } = useFollowersCount();


  const handleFollow = async () => {
    try {
      if (!data?.id) {
        return;
      }

      if (isFollowing) {
        await unfollow(data.id);
      } else {
        await follow(data.id);
      }
      await fetchFollowersCount(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.id) {
      checkFollowStatus(data.id);
    }
  }, [data?.id]);

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
          <Text style={[styles.backText, { color: colors.text.primary }]}>
            Back
          </Text>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFollow}
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
              {isFollowing
                ? 'Following'
                : 'Follow'}
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
    marginTop: 10,
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


