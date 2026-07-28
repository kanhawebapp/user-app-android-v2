import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Card } from '../../components/Card';
import { LoginRequiredModal } from '../../components/Modal';
import { useAuthStore } from '../../stores';
import { useProfile } from '../../services/api/profile/profile.hooks';
import { useWallet } from '../../services/api/wallet/wallet.hooks';
import { GoBack } from '../../components';

interface ProfileScreenProps {
  onNavigateBack?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToEditProfile?: () => void;
}

interface ProfileField {
  label: string;
  value: string;
  icon: string;
  iconLibrary: 'MaterialIcons' | 'Ionicons' | 'FontAwesome';
}

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  iconLibrary: 'MaterialIcons' | 'Ionicons' | 'FontAwesome';
  onPress?: () => void;
  isDestructive?: boolean;
}

const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) {
    return 'Not set';
  }
  const date = new Date(parseInt(timestamp, 10));
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getGenderLabel = (gender: any): string => {
  switch (gender) {
    case 'MALE':
      return 'Male';
    case 'FEMALE':
      return 'Female';
    case 'OTHER':
      return 'Other';
    default:
      return 'Not specified';
  }
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToEditProfile,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuthStore();
  const { profile } = useProfile();
  const { wallet } = useWallet();
  const balanceCoins = wallet?.balanceCoins ?? 0;

  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState(
    'Please login to access this feature',
  );

  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  const profileFields = useMemo((): ProfileField[] => {
    if (!profile) {
      return [];
    }
    return [
      {
        label: 'Mobile',
        value: profile.mobile
          ? `${profile.countryCode || ''} ${profile.mobile}`
          : 'Not set',
        icon: 'phone',
        iconLibrary: 'MaterialIcons',
      },
      {
        label: 'Gender',
        value: getGenderLabel(profile.gender),
        icon:
          profile.gender === 'MALE'
            ? 'male'
            : profile.gender === 'FEMALE'
              ? 'female'
              : 'person-outline',
        iconLibrary: 'Ionicons',
      },
      {
        label: 'Birth Date',
        value: formatTimestamp(profile.birthDate),
        icon: 'cake',
        iconLibrary: 'MaterialIcons',
      },
      {
        label: 'Birth Time',
        value: profile.birthTime || 'Not set',
        icon: 'time',
        iconLibrary: 'Ionicons',
      },
      {
        label: 'Occupation',
        value: profile.occupation || 'Not set',
        icon: 'briefcase',
        iconLibrary: 'Ionicons',
      },
    ];
  }, [profile]);

  const displayName = profile?.name || user?.name || 'Guest User';
  const displayMobile = profile?.mobile
    ? `${profile.countryCode || '+91'} ${profile.mobile}`
    : user?.phone || 'Not logged in';

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      {/* <View
        style={[
          styles.header,
          {backgroundColor: colors.background.primary, paddingTop: insets.top},
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          My Profile
        </Text>
        <View style={styles.placeholder} />
      </View> */}
      <GoBack onBack={onNavigateBack} title='My Profile' />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Premium Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => onNavigateToEditProfile?.()}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: colors.primary.main },
                ]}>
                {profile?.name ? (
                  <Text
                    variant="h3"
                    weight="bold"
                    style={{ color: colors.primary.contrastText }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <Icon
                    name="person"
                    size={40}
                    color={colors.primary.contrastText}
                    library="MaterialIcons"
                  />
                )}
              </View>
              <View
                style={[
                  styles.editIconContainer,
                  { backgroundColor: colors.primary.main },
                ]}>
                <Icon
                  name="edit"
                  size={14}
                  color={colors.primary.contrastText}
                  library="MaterialIcons"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text
                variant="h4"
                weight="bold"
                style={{
                  color: colors.primary.main,
                  textAlign: 'center',
                  marginTop: -10,
                }}>
                {displayName}
              </Text>
              <Text
                variant="body"
                style={{
                  color: colors.text.secondary,
                  marginTop: -2,
                  textAlign: 'center',
                }}>
                {displayMobile}
              </Text>
            </View>
          </View>
        </Card>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text
            variant="subtitle"
            weight="semibold"
            style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Personal Information
          </Text>
          <Card style={styles.infoCard}>
            {profileFields.map((field, index) => (
              <View
                key={field.label}
                style={[
                  styles.infoRow,
                  index < profileFields.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border.light,
                  },
                ]}>
                <View
                  style={[
                    styles.infoIconContainer,
                    { backgroundColor: colors.primary.light },
                  ]}>
                  <Icon
                    name={field.icon}
                    size={18}
                    color={colors.primary.main}
                    library={field.iconLibrary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text
                    variant="captionSmall"
                    style={{ color: colors.text.secondary }}>
                    {field.label}
                  </Text>
                  <Text
                    variant="body"
                    weight="medium"
                    style={{ color: colors.text.primary, marginTop: 2 }}>
                    {field.value}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 16,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default ProfileScreen;
