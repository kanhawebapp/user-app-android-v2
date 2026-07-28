/**
 * Custom hook for button animations
 * Handles glow and scale animations for interactive elements
 */

import {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import {ExtendedGod, God, PujaItemOption, HeaderImageOption} from '../types';

interface UseButtonAnimationOptions {
  isActive?: boolean;
  pulseOnActive?: boolean;
}

interface UseButtonAnimationReturn {
  scaleAnim: Animated.Value;
  glowAnim: Animated.Value;
  glowOpacity: Animated.AnimatedInterpolation<number>;
  glowScale: Animated.AnimatedInterpolation<number>;
}

export interface UseDailyPujaReturn {
  // State
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

  // Animation refs
  thaliRotateAnim: Animated.Value;
  rotationAnimationRef: React.MutableRefObject<Animated.CompositeAnimation | null>;
  startButtonScaleAnim: Animated.Value;
  startButtonGlowAnim: Animated.Value;

  // Modal states
  isGodSelectorVisible: boolean;
  isItemSelectorVisible: boolean;
  selectedItemId: string | null;

  // Header selector state
  selectedHeaderImage: HeaderImageOption;
  isHeaderSelectorVisible: boolean;
  headerImageOptions: HeaderImageOption[];

  // Computed
  preparedGods: ExtendedGod[];
  hasItems: boolean;

  // Handlers
  handleFlowerPress: () => void;
  handleGodSelect: (god: God) => void;
  handleOpenGodSelector: () => void;
  handleCloseGodSelector: () => void;
  handleSelectGodFromModal: (god: ExtendedGod) => void;
  handleItemPress: (itemId: string) => void;
  handleCloseItemSelector: () => void;
  handleSelectItemOption: (option: PujaItemOption) => void;
  handleStartPuja: () => void;
  handleSpecialItemPress: (itemId: string, soundFile: string) => void;
  handleCloseAarti: () => void;
  handleCompletePuja: () => void;
  handleBack: () => void;
  handleResetPuja: () => void;
  handleToggleThali: () => void;
  handleOpenHeaderSelector: () => void;
  handleCloseHeaderSelector: () => void;
  handleSelectHeaderImage: (option: HeaderImageOption) => void;

  //door
  doorOpen: any;
  setDoorOpen: any;
}

/**
 * Custom hook for button press and glow animations
 * @param options - Configuration options for the animation
 * @returns Animation values and interpolation
 */
export const useButtonAnimation = (
  options: UseButtonAnimationOptions = {},
): UseButtonAnimationReturn => {
  const {isActive = false, pulseOnActive = false} = options;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation when active
  useEffect(() => {
    let animationRef: Animated.CompositeAnimation | undefined;

    if (isActive && pulseOnActive) {
      animationRef = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      animationRef.start();
    } else {
      glowAnim.setValue(0);
    }

    return () => {
      if (animationRef) {
        animationRef.stop();
      }
    };
  }, [isActive, pulseOnActive]);

  // Interpolate glow values
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return {
    scaleAnim,
    glowAnim,
    glowOpacity,
    glowScale,
  };
};

export default useButtonAnimation;
