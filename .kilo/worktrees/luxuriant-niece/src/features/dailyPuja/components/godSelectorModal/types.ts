export interface GodOption {
  id: string;
  name: string;
  nameHindi: string;
  image: any;
  background: any;
  color: string;
  icon: string;
}

export interface GodSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  gods: GodOption[];
  selectedGod?: GodOption;
  onSelect: (god: GodOption) => void;
}
