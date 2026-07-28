import {SidebarMenuItem} from './types';

export const DEFAULT_MENU_ITEMS: SidebarMenuItem[] = [
  {
    key: 'my_profile',
    label: 'My Profile',
    icon: 'person',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'wallet',
    label: 'Wallet',
    icon: 'account-balance-wallet',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'session_history',
    label: 'Session History',
    icon: 'history',
    iconLibrary: 'MaterialIcons',
  },
  // {
  //   key: 'chat_history',
  //   label: 'Chat History',
  //   icon: 'history',
  //   iconLibrary: 'MaterialIcons',
  // },
  {
    key: 'my_following',
    label: 'My Following',
    icon: 'favorite',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'free_services',
    label: 'Free Services',
    icon: 'card-giftcard',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'support',
    label: 'Support & Help',
    icon: 'support-agent',
    iconLibrary: 'MaterialIcons',
  },
  // {
  //   key: 'notification',
  //   label: 'Notification',
  //   icon: 'notifications',
  //   iconLibrary: 'Ionicons',
  // },
  {
    key: 'daily_puja',
    label: 'Daily Puja',
    icon: 'settings',
    iconLibrary: 'MaterialIcons',
  },
  // {
  //   key: 'game',
  //   label: 'Game',
  //   icon: 'settings',
  //   iconLibrary: 'MaterialIcons',
  // },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'about',
    label: 'About',
    icon: 'info',
    iconLibrary: 'MaterialIcons',
  },
  {
    key: 'faq',
    label: 'FAQ',
    icon: 'help',
    iconLibrary: 'MaterialIcons',
  },
];

// Social media icons
export const SOCIAL_MEDIA = [
  {key: 'facebook', icon: 'facebook', library: 'FontAwesome' as const},
  {key: 'twitter', icon: 'twitter', library: 'FontAwesome' as const},
  {key: 'instagram', icon: 'instagram', library: 'FontAwesome' as const},
  {key: 'youtube', icon: 'youtube-play', library: 'FontAwesome' as const},
];
