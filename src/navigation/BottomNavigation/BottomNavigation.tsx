
import React, {useMemo, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {useProfileStore, useAuthStore} from '../../stores';
import {Text} from '../../components';

import HomeActive from '../../assets/images/Home_active.svg';
import HomeInactive from '../../assets/images/Home.svg';

import ChatActive from '../../assets/images/chatcall_active.svg';
import ChatInactive from '../../assets/images/chatcall.svg';

import LiveActive from '../../assets/images/Live_active.svg';
import LiveInactive from '../../assets/images/Live.svg';

import ShopActive from '../../assets/images/Shop_active.svg';
import ShopInactive from '../../assets/images/shop.svg';

import RemediesActive from '../../assets/images/remedies_active.svg';
import RemediesInactive from '../../assets/images/remedies.svg';

const bottomImg = {
  home: {
    active: HomeActive,
    inactive: HomeInactive,
  },
  chatCall: {
    active: ChatActive,
    inactive: ChatInactive,
  },
  live: {
    active: LiveActive,
    inactive: LiveInactive,
  },
  shop: {
    active: ShopActive,
    inactive: ShopInactive,
  },
  remedies: {
    active: RemediesActive,
    inactive: RemediesInactive,
  },
};

const TAB_ITEMS = [
  {key: 'home', label: 'Home'},
  {key: 'chatCall', label: 'Chat/Call'},
  {key: 'live', label: 'Live'},
  {key: 'shop', label: 'Shop'},
  {key: 'remedies', label: 'Services'},
];
// Remedies

export const BottomNavigation = ({activeTab = 'home', onTabPress, style}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {isAuthenticated} = useAuthStore();
  const {getCompletionPercentage, initializeFromUser} = useProfileStore();

  const completionPercentage = isAuthenticated ? getCompletionPercentage() : 0;
  const showProfileBadge = isAuthenticated && completionPercentage < 100;

  useEffect(() => {
    if (isAuthenticated) {
      initializeFromUser();
    }
  }, [isAuthenticated]);

  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const getImageSource = (key: string, isActive: boolean) => {
    return isActive ? bottomImg[key].active : bottomImg[key].inactive;
  };

  return (
    <View style={[styles.container, style]}>
      {TAB_ITEMS.map(tab => {
        const isActive = activeTab === tab.key;
        const showBadge = tab.key === 'home' && showProfileBadge;
        const IconComponent = getImageSource(tab.key, isActive);

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress?.(tab.key)}
            activeOpacity={0.7}>
            {/* ICON */}
            <View
              style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer,
              ]}>
              <View style={{opacity: isActive ? 1 : 0.6}}>
                <IconComponent width={26} height={26} />
              </View>

              {/* Badge (optional) */}
              {/* {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>!</Text>
                </View>
              )} */}
            </View>

            {/* LABEL */}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigation;

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: insets.bottom || 10,
      paddingTop: 2,
      backgroundColor: colors.background.primary,
      elevation: 10,
    },

    tab: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconContainer: {
      position: 'relative',
      padding: 6,
      borderRadius: 12,
    },

    activeIconContainer: {
      backgroundColor: 'rgba(255,255,255,0.08)', // subtle highlight
    },

    label: {
      fontSize: 12,
      color: colors.text.secondary,
      marginTop: -4,
    },

    activeLabel: {
      color: colors.primary.main,
      fontWeight: 'bold',
    },

    badge: {
      position: 'absolute',
      top: -4,
      right: -8,
      backgroundColor: 'red',
      borderRadius: 10,
      paddingHorizontal: 4,
      paddingVertical: 1,
    },

    badgeText: {
      fontSize: 10,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
