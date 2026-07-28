/**
 * Type definitions for DailyPuja feature
 * Centralized TypeScript interfaces used across the feature
 */

// Base God type from data
export interface God {
  id: string;
  name: string;
  background: any;
  image: any;
}

// Extended God type with additional properties
export interface ExtendedGod extends God {
  nameHindi: string;
  color: string;
  icon: string;
}

// Puja Item Option (for item selector modal)
export interface PujaItemOption {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  color: string;
}

// Puja Item Configuration
export interface PujaItemConfig {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  color: string;
  options?: PujaItemOption[];
}

// Puja State interface
export interface PujaState {
  selectedGod: ExtendedGod;
  selectedGodTem: ExtendedGod;
  isFlowerRainActive: boolean;
  isDoorOpen: boolean;
  showTempleContent: boolean;
  animationTrigger: number;
  isPujaStarted: boolean;
  isPujaComplete: boolean;
  showSpecialItems: boolean;
  activeSpecialItem: string | null;
  isAartiPlaying: boolean;
  showThali: boolean;
  selectedItems: Record<string, PujaItemOption>;
}

// DailyPuja Screen Props
export interface DailyPujaScreenProps {
  onNavigateBack: () => void;
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  useNativeDriver: boolean;
}

// Header Image Option (for header selector modal)
export interface HeaderImageOption {
  id: string;
  name: string;
  nameHindi: string;
  image: any;
}
