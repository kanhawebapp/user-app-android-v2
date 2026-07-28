/**
 * Sidebar Component Types
 */

import type { User } from '../../types/global.types';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon: string;
  iconLibrary?: 'MaterialIcons' | 'Ionicons' | 'Feather' | 'AntDesign' | 'MaterialCommunityIcons' | 'FontAwesome';
  onPress?: () => void;
  badge?: number;
}

export interface SidebarProps {
  // Whether sidebar is visible
  visible: boolean;
  
  // Callback when sidebar should close
  onClose: () => void;
  
  // User data
  user?: User | null;
  
  // Whether user is authenticated
  isAuthenticated?: boolean;
  
  // Menu items
  menuItems?: SidebarMenuItem[];
  
  // Callback for menu item press
  onMenuItemPress?: (item: SidebarMenuItem) => void;
  
  // Callback for logout
  onLogout?: () => void;
  
  // Callback for login (for guest users)
  onLogin?: () => void;
}

