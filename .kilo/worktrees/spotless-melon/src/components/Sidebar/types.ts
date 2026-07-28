/**
 * Sidebar Component Types - Enhanced for sub-components
 */

import type {Animated} from 'react-native';
import type {User} from '../../types/global.types';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon: string;
  iconLibrary?:
    | 'MaterialIcons'
    | 'Ionicons'
    | 'Feather'
    | 'AntDesign'
    | 'MaterialCommunityIcons'
    | 'FontAwesome';
  badge?: number;
}

export interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  user?: User | null;
  isAuthenticated?: boolean;
  menuItems?: SidebarMenuItem[];
  onMenuItemPress?: (item: SidebarMenuItem) => void;
  onLogout?: () => void;
  onLogin?: () => void;
}

// Sub-component props (to be expanded)
export interface UserProfileProps {
  user: User;
  borderAnim: Animated.Value;
}

export interface GuestSectionProps {
  onLogin: () => void;
}

export interface MenuItemProps {
  item: SidebarMenuItem;
  onPress: () => void;
}

export type IconLibrary = SidebarMenuItem['iconLibrary'];
