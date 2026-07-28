export interface God {
  id: string;
  name: string;
  nameHindi?: string;
  background: any;
  image: any;
  color?: string;
  icon?: string;
}

export interface GodSelectorProps {
  gods: God[];
  onSelect: (god: God) => void;
  selectedId?: string;
  onOpenGodSelector?: () => void;
}