import {StyleSheet} from 'react-native';

export const createStyles = (
  colors: any,
  insets: any,
  showProfileBadge?: boolean,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      paddingBottom: Math.max(insets.bottom, 8),
      paddingTop: 8,
      shadowColor: colors.common.black,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
    },
    middleTab: {},
    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    iconContainer: {
      position: 'relative',
    },
    middleIconWrapper: {
      marginBottom: 4,
    },
    activeBackground: {
      position: 'absolute',
      width: 56,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary.main,
    },
    middleActiveBackground: {
      width: 64,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary.main,
    },
    glowEffect: {},
    middleGlowEffect: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary.light + '50',
      top: -10,
    },
    icon: {
      zIndex: 1,
    },
    labelContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
      position: 'relative',
    },
    activeLabelBackground: {},

    tabLabel: {
      fontSize: 10,
      color: colors.text.secondary,
      zIndex: 1,
    },
    activeTabLabel: {
      color: colors.primary.main,
      fontWeight: '700',
    },
    // Profile completion badge styles
    badgeContainer: {
      position: 'absolute',
      top: -4,
      right: -8,
      zIndex: 10,
    },
    profileBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
  });
