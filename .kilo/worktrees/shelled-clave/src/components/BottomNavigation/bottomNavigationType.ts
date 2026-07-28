import type {Icon库} from '../Icon/iconType';

export interface TabItem {
  key: string;
  label: string;
  icon: string;
  iconLibrary: Icon库;
  activeIcon: string;
}

export interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tabKey: string) => void;
  style?: any;
  testID?: string;
}
