/**
 * Header Component Types
 */

import type {User} from '../../types/global.types';

export interface HeaderProps {
  // User data - if provided, shows user info; if not, shows company name
  user?: User | null;

  // Whether user is authenticated (shows different UI)
  isAuthenticated?: boolean;

  // Callback for menu button press (opens sidebar)
  onMenuPress?: () => void;

  // Callback for wallet icon press
  onWalletPress?: () => void;

  // Callback for notification icon press
  onNotificationPress?: () => void;

  // Notification count to display
  notificationCount?: number;

  // Company name to show for guest users
  companyName?: string;

  // Additional style for container
  style?: object;
}
