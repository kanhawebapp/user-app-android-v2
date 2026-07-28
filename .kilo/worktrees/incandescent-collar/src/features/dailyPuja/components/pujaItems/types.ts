import { PujaItemOption } from "../../types";

// Puja item configuration
export interface PujaItemConfig {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  color: string;
  soundFile: string;
  selectedOption?: PujaItemOption;
}


export interface PujaItemButtonProps {
  config: PujaItemConfig;
  selectedOption?: PujaItemOption;
  onPress: () => void;
}

export interface PujaItemsProps {
  onItemPress: (itemId: string) => void;
  onFlowerPress?: () => void;
  selectedItems: Record<string, PujaItemOption>;
}