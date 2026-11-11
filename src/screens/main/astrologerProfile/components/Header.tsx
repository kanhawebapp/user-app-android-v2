import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, useTheme } from '../../../../theme';
import { Icon } from '../../../../components/Icon';
import { useFollowAstrologer } from '../../../../services/api/followAstrologer/useFollowAstrologer';
import { useFollowersCount } from '../../../../services/api/followersCount/followers-count.hook';
import { useToast } from '../../../../context/ToastContext';

type HeaderProps = {
  data: any;
  onBack: () => void;
  followersCount: any;
};

export const Header: React.FC<HeaderProps> = ({
  onBack,
  data,
}) => {
  const theme = useTheme();
  const themeColors = theme.colors;
  const { showSuccess, showError } = useToast();

  const {
    isFollowing,
    follow,
    unfollow,
    checkFollowStatus,
  } = useFollowAstrologer();
  const { fetchFollowersCount } = useFollowersCount();

  const handleFollow = async () => {
    try {
      if (!data?.id) {
        showError('Astrologer not found');
        return;
      }

      if (isFollowing) {
        await unfollow(data.id);

        showSuccess(
          `You have unfollowed ${data?.displayName || data?.name || 'Astrologer'}`,
        );
      } else {
        await follow(data.id);

        showSuccess(
          `You are now following ${data?.displayName || data?.name || 'Astrologer'}`,
        );
      }

      await fetchFollowersCount(data.id);
    } catch (error: any) {
      console.log(error);

      showError(
        error?.message || 'Something went wrong. Please try again.',
      );
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
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon
            name="arrow-back"
            size={22}
            color={themeColors.primary.main}
            library="Ionicons"
          />
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFollow}
            style={[
              styles.followButton,
              {
                backgroundColor: isFollowing
                  ? themeColors.primary.main
                  : colors.common.white,
                borderColor: themeColors.primary.main,
              },
            ]}>
            <Text
              style={[
                styles.followButtonText,
                {
                  color: isFollowing
                    ? themeColors.primary.contrastText
                    : themeColors.primary.main,
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
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    paddingHorizontal: 20,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  followButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Header;
