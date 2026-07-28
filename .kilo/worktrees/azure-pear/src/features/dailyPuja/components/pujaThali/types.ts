import {PujaItemOption} from '../../types';

export interface PujaItemConfig {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  color: string;
}

export interface ThaliItemProps {
  item: PujaItemConfig;
  selectedOption?: PujaItemOption;
  onPress: () => void;
  index: number;
  showImage?: boolean;
}

export interface PujaThaliProps {
  selectedItems: Record<string, PujaItemOption>;
  onItemPress: (itemId: string) => void;
}
