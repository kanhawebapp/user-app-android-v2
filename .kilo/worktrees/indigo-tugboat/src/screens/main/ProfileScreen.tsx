/**
 * Profile Screen
 * User profile screen with personal details and settings
 */

import React, { useState, useCallback } from 'react';
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

interface ProfileScreenProps {
  onNavigateBack?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  
  const { user, isAuthenticated } = useAuthStore();

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('Please login to access this feature');

  // Check if user can perform action
  const handleRestrictedAction = useCallback((actionMessage: string, callback?: () => void) => {
    if (isAuthenticated) {
      callback?.();
      return;
    }
    setModalMessage(actionMessage);
    setShowLoginModal(true);
  }, [isAuthenticated]);

  // Action handlers
  const handleMenuItemPress = useCallback((itemLabel: string) => {
    handleRestrictedAction(`Please login to access ${itemLabel}`);
  }, [handleRestrictedAction]);

  const handleLogout = useCallback(() => {
    handleRestrictedAction('Please login to logout');
  }, [handleRestrictedAction]);

  // Modal handlers
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

  const menuItems = [
    { key: 'edit_profile', label: 'Edit Profile', icon: 'edit', iconLibrary: 'MaterialIcons' as const },
    { key: 'personal_info', label: 'Personal Information', icon: 'person', iconLibrary: 'MaterialIcons' as const },
    { key: 'kundali', label: 'My Kundali', icon: 'auto-awesome', iconLibrary: 'MaterialIcons' as const },
    { key: 'birth_details', label: 'Birth Details', icon: 'event', iconLibrary: 'MaterialIcons' as const },
    { key: 'language', label: 'Language Preference', icon: 'language', iconLibrary: 'MaterialIcons' as const },
    { key: 'DailyPujaScreen', label: 'Daily Puja', icon: 'language', iconLibrary: 'MaterialIcons' as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.icon.primary} library="MaterialIcons" />
        </TouchableOpacity>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary }}>
          My Profile
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary.light + '30' }]}>
              <Icon name="person" size={48} color={colors.primary.main} library="MaterialIcons" />
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h6" weight="bold" style={{ color: colors.text.primary }}>
                {user?.name || 'Guest User'}
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary, marginTop: 4 }}>
                {user?.email || user?.phone || 'Not logged in'}
              </Text>
              {user?.isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success.light + '20' }]}>
                  <Icon name="verified" size={14} color={colors.success.main} library="MaterialIcons" />
                  <Text variant="captionSmall" weight="medium" style={{ color: colors.success.main, marginLeft: 4 }}>
                    Verified
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Wallet Balance */}
          <View style={[styles.walletSection, { borderTopColor: colors.border.light }]}>
            <View style={styles.walletItem}>
              <Icon name="account-balance-wallet" size={24} color={colors.primary.main} library="MaterialIcons" />
              <Text variant="body" style={{ color: colors.text.secondary, marginLeft: 8 }}>Wallet Balance</Text>
            </View>
            <Text variant="h6" weight="bold" style={{ color: colors.primary.main }}>
              ₹{user?.walletBalance?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </Card>

        {/* Profile Menu Items */}
        <View style={styles.section}>
          <Text variant="subtitle" weight="semibold" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Account Settings
          </Text>
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.light }
                ]}
                onPress={() => handleMenuItemPress(item.label)}
                activeOpacity={0.7}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={colors.icon.primary}
                  library={item.iconLibrary}
                />
                <Text variant="body" style={[styles.menuLabel, { color: colors.text.primary }]}>
                  {item.label}
                </Text>
                <Icon name="chevron-right" size={22} color={colors.icon.tertiary} library="MaterialIcons" />
              </TouchableOpacity>
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
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuLabel: {
    flex: 1,
    marginLeft: 16,
  },
});

export default ProfileScreen;

