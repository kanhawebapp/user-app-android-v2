import React, {useState, useMemo, useEffect} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {BottomNavigationProps, TabItem} from './bottomNavigationType';
import {useProfileStore, useAuthStore} from '../../stores';
import {createStyles} from './bottomStyle';

const TAB_ITEMS: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    iconLibrary: 'MaterialIcons',
    activeIcon: 'home',
  },
  {
    key: 'chatCall',
    label: 'Chat/Call',
    icon: 'chat-bubble-outline',
    iconLibrary: 'MaterialIcons',
    activeIcon: 'chat-bubble',
  },
  {
    key: 'live',
    label: 'Live',
    icon: 'live-tv',
    iconLibrary: 'MaterialIcons',
    activeIcon: 'live-tv',
  },
  {
    key: 'shop',
    label: 'Shop',
    icon: 'shopping-bag',
    iconLibrary: 'Feather',
    activeIcon: 'shopping-bag',
  },
  {
    key: 'remedies',
    label: 'Remedies',
    icon: 'spa',
    iconLibrary: 'MaterialIcons',
    activeIcon: 'spa',
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  // Get auth and profile store
  const {isAuthenticated} = useAuthStore();
  const {getCompletionPercentage, initializeFromUser} = useProfileStore();

  // Get profile completion percentage
  const completionPercentage = isAuthenticated ? getCompletionPercentage() : 0;
  const showProfileBadge = isAuthenticated && completionPercentage < 100;

  // Initialize profile from user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      initializeFromUser();
    }
  }, [isAuthenticated, initializeFromUser]);

  const [scaleValues] = useState(() =>
    TAB_ITEMS.map(() => new Animated.Value(1)),
  );
  const [opacityValues] = useState(() =>
    TAB_ITEMS.map(() => new Animated.Value(0)),
  );

  useEffect(() => {
    // Animate the active tab
    TAB_ITEMS.forEach((tab, index) => {
      const isActive = activeTab === tab.key;

      Animated.parallel([
        Animated.spring(scaleValues[index], {
          toValue: isActive ? 1.05 : 1,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(opacityValues[index], {
          toValue: isActive ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [activeTab, scaleValues, opacityValues]);

  const styles = useMemo(
    () => createStyles(colors, insets, showProfileBadge),
    [colors, insets, showProfileBadge],
  );

  const handleTabPress = (tabKey: string) => {
    onTabPress?.(tabKey);
  };

  const renderProfileBadge = () => {
    if (!showProfileBadge) return null;

    return (
      <View style={styles.badgeContainer}>
        <View
          style={[styles.profileBadge, {backgroundColor: colors.warning.main}]}>
          <Text
            variant="captionSmall"
            weight="bold"
            style={{color: colors.common.white}}>
            {completionPercentage}%
          </Text>
        </View>
      </View>
    );
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.key;
    const showBadge = tab.key === 'home' && showProfileBadge;

    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tabItem]}
        onPress={() => handleTabPress(tab.key)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{selected: isActive}}>
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{scale: scaleValues[index]}],
            },
          ]}>
          <Animated.View
            style={[
              styles.activeBackground,
              {
                opacity: opacityValues[index],
              },
            ]}
          />

          {isActive && <View style={[styles.glowEffect]} />}

          <View style={styles.iconContainer}>
            <Icon
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={
                isActive ? colors.primary.contrastText : colors.icon.secondary
              }
              library={tab.iconLibrary as any}
              style={styles.icon}
            />
            {/* Profile completion badge */}
            {showBadge && renderProfileBadge()}
          </View>
        </Animated.View>

        <View style={styles.labelContainer}>
          <Animated.View
            style={[
              styles.activeLabelBackground,
              {
                opacity: opacityValues[index],
              },
            ]}
          />
          <Text
            variant="caption"
            weight={isActive ? 'bold' : 'regular'}
            style={
              isActive
                ? [{...styles.tabLabel, ...styles.activeTabLabel}]
                : [styles.tabLabel]
            }>
            {tab.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]} accessibilityRole="tablist">
      {TAB_ITEMS.map(renderTab)}
    </View>
  );
};

export default BottomNavigation;
