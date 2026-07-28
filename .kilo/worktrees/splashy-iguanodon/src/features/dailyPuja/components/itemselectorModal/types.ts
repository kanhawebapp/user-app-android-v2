export interface PujaItemOption {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  color: string;
}

export interface PujaItemConfig {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  color: string;
  options?: PujaItemOption[];
}

export interface ItemSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  item: PujaItemConfig | null;
  selectedOption?: PujaItemOption;
  onSelect: (option: PujaItemOption) => void;
}
