export interface SpecialItemConfig {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  color: string;
  soundFile: string;
}

export interface SpecialItemButtonProps {
  config: SpecialItemConfig;
  isActive: boolean;
  onPress: () => void;
}

export interface SpecialPujaItemsProps {
  onItemPress: (itemId: string, soundFile: string) => void;
  activeItemId: string | null;
  onPressFlower: any;
}
