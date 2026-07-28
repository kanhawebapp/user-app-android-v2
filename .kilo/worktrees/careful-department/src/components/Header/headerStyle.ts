/**
 * Header Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Colors } from '../../theme/colors';

// export const headerStyle = (colors: Colors) =>
//   StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       backgroundColor: colors.background.primary,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border.light,
//     },
//     leftSection: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     menuButton: {
//       padding: 8,
//       marginRight: 12,
//     },
//     userInfoContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     avatarContainer: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: colors.primary.light + '30',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginRight: 12,
//     },
//     avatarText: {
//       fontSize: 16,
//       fontWeight: '600',
//       color: colors.primary.main,
//     },
//     userNameContainer: {
//       flex: 1,
//     },
//     greetingText: {
//       fontSize: 12,
//       color: colors.text.secondary,
//     },
//     userNameText: {
//       fontSize: 16,
//       fontWeight: '600',
//       color: colors.text.primary,
//     },
//     companyNameContainer: {
//       flex: 1,
//     },
//     companyNameText: {
//       fontSize: 18,
//       fontWeight: '700',
//       color: colors.primary.main,
//     },
//     rightSection: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     iconButton: {
//       padding: 8,
//       marginLeft: 4,
//     },
//     walletContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: colors.primary.light + '15',
//       paddingHorizontal: 12,
//       paddingVertical: 6,
//       borderRadius: 20,
//       marginLeft: 8,
//     },
//     walletIcon: {
//       marginRight: 6,
//     },
//     walletAmount: {
//       fontSize: 14,
//       fontWeight: '600',
//       color: colors.primary.main,
//     },
//     notificationContainer: {
//       position: 'relative',
//     },
//     notificationBadge: {
//       position: 'absolute',
//       top: -4,
//       right: -4,
//       backgroundColor: colors.error.main,
//       borderRadius: 10,
//       minWidth: 18,
//       height: 18,
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingHorizontal: 4,
//     },
//     notificationCount: {
//       fontSize: 10,
//       fontWeight: '700',
//       color: colors.common.white,
//     },
//   });

// export default headerStyle;


export const headerStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userNameContainer: {
    flex: 1,
  },
  companyNameContainer: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  walletIcon: {
    marginRight: 6,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

