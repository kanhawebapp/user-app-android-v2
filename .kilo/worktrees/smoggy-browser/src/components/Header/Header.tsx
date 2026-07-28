/**
 * Header Component
 * Reusable header with sidebar toggle, user info, wallet, and notifications
 */

import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {HeaderProps} from './headerType';
import {headerStyle} from './headerStyle';

const DEFAULT_COMPANY_NAME = 'Dhwani Astro';

export const Header: React.FC<HeaderProps> = ({
  user,
  isAuthenticated = false,
  onMenuPress,
  onWalletPress,
  onNotificationPress,
  notificationCount = 0,
  companyName = DEFAULT_COMPANY_NAME,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const styles = headerStyle;

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // Format wallet balance
  const formatBalance = (balance: number): string => {
    return `₹${balance.toFixed(0)}`;
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + 8, backgroundColor: colors.background},
        style,
      ]}>
      {/* Left Section - Menu + User/Company Info */}
      <View style={styles.leftSection}>
        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open menu">
          <Icon
            name="menu"
            size={26}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>

        {/* User Info or Company Name */}
        {isAuthenticated && user ? (
          <View style={styles.userInfoContainer}>
            {/* User Name */}
            <View style={styles.userNameContainer}>
              <Text
                variant="body"
                weight="semibold"
                numberOfLines={1}
                style={{color: colors.text.primary}}>
                {user.name}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.companyNameContainer}>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.primary.main}}>
              {companyName}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {isAuthenticated && user ? (
          <>
            {/* Wallet Button */}
            <TouchableOpacity
              style={[
                styles.walletContainer,
                {backgroundColor: colors.primary.light + '15'},
              ]}
              onPress={onWalletPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Wallet">
              <Icon
                name="account-balance-wallet"
                size={18}
                color={colors.primary.main}
                library="MaterialIcons"
                style={styles.walletIcon}
              />
              <Text
                variant="bodySmall"
                weight="semibold"
                style={{color: colors.primary.main}}>
                {formatBalance(user.walletBalance)}
              </Text>
            </TouchableOpacity>

            {/* Notification Button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Notifications">
              <View style={styles.notificationContainer}>
                <Icon
                  name="notifications"
                  size={24}
                  color={colors.text.primary}
                  library="MaterialIcons"
                />
                {notificationCount > 0 && (
                  <View
                    style={[
                      styles.notificationBadge,
                      {backgroundColor: colors.error.main},
                    ]}>
                    <Text
                      variant="captionSmall"
                      weight="bold"
                      style={{color: colors.common.white}}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   leftSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   menuButton: {
//     padding: 8,
//     marginRight: 12,
//   },
//   userInfoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatarContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   userNameContainer: {
//     flex: 1,
//   },
//   companyNameContainer: {
//     flex: 1,
//   },
//   rightSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     padding: 8,
//     marginLeft: 4,
//   },
//   walletContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginLeft: 8,
//   },
//   walletIcon: {
//     marginRight: 6,
//   },
//   notificationContainer: {
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 4,
//   },
// });

export default Header;
