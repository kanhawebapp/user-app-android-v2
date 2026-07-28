import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {HeaderProps} from './headerType';
import {headerStyle} from './headerStyle';
import {useWallet} from '../../services/api/wallet/wallet.hooks';
import {DEFAULTS} from '../../constants/app.constants';
import {SkeletonLoader} from '../SkeletonLoader/ShimmerLoader';

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

  const {wallet, loading} = useWallet();

  const balanceCoins = wallet?.balanceCoins ?? 0;
  // Format wallet balance
  const formatBalance = (balance: number): string => {
    return `${balanceCoins.toFixed(0)}`;
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
              <Text style={{marginBottom: -5, fontSize: 14}}>
                Welcome back,
              </Text>
              {loading ? (
                <SkeletonLoader
                  width={120}
                  height={22}
                  borderRadius={6}
                  shimmerColor={colors.primary.main + '40'}
                  backgroundColor={colors.primary.main + '15'}
                  style={{marginTop: -1}}
                />
              ) : (
                <Text
                  color={colors.primary.main}
                  style={{fontSize: 18, marginTop: -1, fontWeight: 'bold'}}
                  numberOfLines={1}>
                  Hi, {user.name}
                </Text>
              )}
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
                name="wallet"
                size={18}
                color={colors.primary.main}
                library="Ionicons"
              />
              {loading ? (
                <SkeletonLoader
                  width={60}
                  height={16}
                  borderRadius={6}
                  shimmerColor={colors.primary.main + '40'}
                  backgroundColor={colors.primary.main + '15'}
                />
              ) : (
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  style={{color: colors.primary.main}}>
                  {DEFAULTS.CURRENCY}
                  {formatBalance(user.walletBalance)}
                </Text>
              )}
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
                  color={colors.primary.main}
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

export default Header;
