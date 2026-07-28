/**
 * Sidebar Component
 * Drawer-style sliding sidebar with menu items
 */

import React, {useEffect, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {Button} from '../Button';
import {SidebarProps, SidebarMenuItem} from './sidebarType';
import {DEFAULT_MENU_ITEMS, SOCIAL_MEDIA} from './helpers';
import {sidebarStyle} from './sidebarStyle';
import {DEFAULT_APP_CONFIG} from '../../constants/config.constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;
const styles = sidebarStyle;

// App version
const APP_VERSION = DEFAULT_APP_CONFIG.version || '1.0.0';

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  user,
  isAuthenticated = false,
  menuItems = DEFAULT_MENU_ITEMS,
  onMenuItemPress,
  onLogout,
  onLogin,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const slideAnim = useMemo(() => new Animated.Value(-SIDEBAR_WIDTH), []);
  const overlayAnim = useMemo(() => new Animated.Value(0), []);
  const [shouldRender, setShouldRender] = React.useState(visible);

  // Spring configuration for smooth, natural animation
  const springConfig = {
    tension: 50,
    friction: 7,
  };

  // Faster opening, smoother closing
  const openConfig = {duration: 300};
  const closeConfig = {duration: 250};

  // useEffect(() => {
  //   if (visible) {
  //     Animated.parallel([
  //       Animated.spring(slideAnim, {
  //         toValue: 0,
  //         ...springConfig,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(overlayAnim, {
  //         toValue: 1,
  //         ...openConfig,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   } else {
  //     Animated.parallel([
  //       Animated.spring(slideAnim, {
  //         toValue: -SIDEBAR_WIDTH,
  //         ...springConfig,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(overlayAnim, {
  //         toValue: 0,
  //         ...closeConfig,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }
  // }, [visible, slideAnim, overlayAnim]);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    onMenuItemPress?.(item);
    onClose();
  };

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  const handleOverlayPress = () => {
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            backgroundColor: colors.overlay,
          },
        ]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleOverlayPress}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{translateX: slideAnim}],
            backgroundColor: colors.background.primary,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 20,
          },
        ]}>
        {/* Header */}
        <View
          style={[
            styles.sidebarHeader,
            {borderBottomColor: colors.border.light},
          ]}>
          {isAuthenticated && user ? (
            <View style={styles.userInfo}>
              <View
                style={[
                  styles.avatar,
                  {backgroundColor: colors.primary.light + '30'},
                ]}>
                {user.profilePic ? (
                  <Icon
                    name="person"
                    size={28}
                    color={colors.primary.main}
                    library="MaterialIcons"
                  />
                ) : (
                  <Text
                    variant="h6"
                    weight="bold"
                    style={{color: colors.primary.main}}>
                    {getUserInitials(user.name)}
                  </Text>
                )}
              </View>
              <View style={styles.userDetails}>
                <Text variant="body" weight="semibold" numberOfLines={1}>
                  {user.name}
                </Text>
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary}}>
                  {user.email || user.phone}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.guestInfo}>
              <Text variant="body" style={{color: colors.text.secondary}}>
                Welcome to Dhwani Astro guest
              </Text>
              <Button
                title="Login"
                variant="primary"
                size="small"
                onPress={onLogin}
                style={{marginTop: 12}}
              />
            </View>
          )}
        </View>

        {/* Menu Items */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                {borderBottomColor: colors.border.light},
              ]}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}>
              <Icon
                name={item.icon}
                size={22}
                color={colors.icon.primary}
                library={item.iconLibrary || 'MaterialIcons'}
              />
              <Text
                variant="body"
                style={[styles.menuLabel, {color: colors.text.primary}]}>
                {item.label}
              </Text>
              {item.badge ? (
                <View
                  style={[styles.badge, {backgroundColor: colors.error.main}]}>
                  <Text
                    variant="captionSmall"
                    weight="bold"
                    style={{color: colors.common.white}}>
                    {item.badge}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, {borderTopColor: colors.border.light}]}>
          {/* Social Media Icons */}
          <View style={styles.socialMediaContainer}>
            {SOCIAL_MEDIA.map(social => (
              <TouchableOpacity
                key={social.key}
                style={[
                  styles.socialIcon,
                  {backgroundColor: colors.background.secondary},
                ]}
                onPress={() => {}}
                activeOpacity={0.7}>
                <Icon
                  name={social.icon}
                  size={18}
                  color={colors.icon.primary}
                  library={social.library}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Version */}
          <Text
            variant="captionSmall"
            style={[styles.versionText, {color: colors.text.tertiary}]}>
            Version {APP_VERSION}
          </Text>

          {/* Logout Button */}
          {isAuthenticated && user ? (
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {borderTopColor: colors.border.light},
              ]}
              onPress={handleLogout}
              activeOpacity={0.7}>
              <Icon
                name="logout"
                size={22}
                color={colors.error.main}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                weight="medium"
                style={{color: colors.error.main, marginLeft: 12}}>
                Logout
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {borderTopColor: colors.border.light},
              ]}
              onPress={handleLogout}
              activeOpacity={0.7}>
              <Icon
                name="logout"
                size={22}
                color={colors.error.main}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                weight="medium"
                style={{color: colors.error.main, marginLeft: 12}}>
                Logout
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar;
