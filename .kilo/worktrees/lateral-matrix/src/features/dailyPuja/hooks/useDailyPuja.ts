import {useState, useEffect, useRef, useCallback} from 'react';
import {Animated} from 'react-native';
import {ExtendedGod, PujaItemOption, God, HeaderImageOption} from '../types';
import {prepareGods, extendGod, getDefaultGod} from '../helpers/godHelpers';
import {hasItemsSelected} from '../helpers/pujaItemHelpers';
import {
  HEADER_IMAGE_OPTIONS,
  DEFAULT_HEADER_IMAGE,
} from '../helpers/headerImageHelpers';
import {
  playAarti,
  stopAarti,
  playEffect,
  preloadSounds,
} from '../utils/SoundService';
import {ANIMATION_DURATION} from '../constants/animation.constants';
import {UseDailyPujaReturn} from './useButtonAnimation';

export const useDailyPuja = (): UseDailyPujaReturn => {
  // Prepared gods data
  const preparedGods = prepareGods();

  //door
  const [doorOpen, setDoorOpen] = useState(true);

  // God selection state
  const [selectedGod, setSelectedGod] = useState<ExtendedGod>(getDefaultGod());
  const [selectedGodTem, setSelectedGodTem] = useState<ExtendedGod>(
    getDefaultGod(),
  );

  // Animation/visual state
  const [isFlowerRainActive, setIsFlowerRainActive] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [showTempleContent, setShowTempleContent] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Puja flow state
  const [isPujaStarted, setIsPujaStarted] = useState(false);
  const [isPujaComplete, setIsPujaComplete] = useState(false);
  const [showSpecialItems, setShowSpecialItems] = useState(false);
  const [activeSpecialItem, setActiveSpecialItem] = useState<string | null>(
    null,
  );
  const [isAartiPlaying, setIsAartiPlaying] = useState(false);

  // Thali and items state
  const [showThali, setShowThali] = useState(true);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, PujaItemOption>
  >({});

  // Modal states
  const [isGodSelectorVisible, setIsGodSelectorVisible] = useState(false);
  const [isItemSelectorVisible, setIsItemSelectorVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Header selector state
  const [selectedHeaderImage, setSelectedHeaderImage] =
    useState<HeaderImageOption>(DEFAULT_HEADER_IMAGE);
  const [isHeaderSelectorVisible, setIsHeaderSelectorVisible] = useState(false);

  // Animation refs
  const thaliRotateAnim = useRef(new Animated.Value(0)).current;
  const rotationAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const startButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const startButtonGlowAnim = useRef(new Animated.Value(0)).current;

  // Preload sounds on mount
  useEffect(() => {
    // Preload sounds when the hook is first used
    console.log('[useDailyPuja] Preloading sounds on mount...');
    preloadSounds()
      .then(() => {
        console.log('[useDailyPuja] Sounds preloaded successfully');
      })
      .catch(err => {
        console.log('[useDailyPuja] Failed to preload sounds:', err);
      });
  }, []);

  // Computed values
  const hasItems = hasItemsSelected(selectedItems);

  // Initial door open animation on mount
  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsDoorOpen(true);
    }, ANIMATION_DURATION.DOOR_OPEN_DELAY);

    const contentTimer = setTimeout(() => {
      setShowTempleContent(true);
    }, ANIMATION_DURATION.CONTENT_SHOW_DELAY);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Start button pulse animation when puja is started
  useEffect(() => {
    if (isPujaStarted) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(startButtonGlowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(startButtonGlowAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isPujaStarted]);

  // Handlers
  const handleFlowerPress = useCallback(() => {
    setIsFlowerRainActive(true);
    setTimeout(() => {
      setIsFlowerRainActive(false);
    }, 8000);
  }, []);

  const handleGodSelect = useCallback((god: God) => {
    const extended = extendGod(god);
    setSelectedGod(extended);
    setSelectedGodTem(extended);
    setAnimationTrigger(prev => prev + 1);
  }, []);

  const handleOpenGodSelector = useCallback(() => {
    setIsGodSelectorVisible(true);
  }, []);

  const handleCloseGodSelector = useCallback(() => {
    setIsGodSelectorVisible(false);
  }, []);

  const handleSelectGodFromModal = useCallback((god: ExtendedGod) => {
    setSelectedGod(god);
    setSelectedGodTem(god);
    setAnimationTrigger(prev => prev + 1);
  }, []);

  const handleItemPress = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsItemSelectorVisible(true);
  }, []);

  const handleCloseItemSelector = useCallback(() => {
    setIsItemSelectorVisible(false);
    setSelectedItemId(null);
  }, []);

  const handleSelectItemOption = useCallback(
    (option: PujaItemOption) => {
      if (selectedItemId) {
        setSelectedItems(prev => ({
          ...prev,
          [selectedItemId]: option,
        }));
      }
    },
    [selectedItemId],
  );

  const handleStartPuja = useCallback(() => {
    // Animate button press
    Animated.sequence([
      Animated.timing(startButtonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(startButtonScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Play aarti
    playAarti('aarti');
    // playAarti('aarti', 'mp3');
    setIsPujaStarted(true);
    setShowSpecialItems(true);
  }, []);

  const handleSpecialItemPress = useCallback(
    (itemId: string, soundFile: string) => {
      setActiveSpecialItem(itemId);
      setIsAartiPlaying(true);

      // Start thali rotation animation
      thaliRotateAnim.setValue(0);
      rotationAnimationRef.current = Animated.loop(
        Animated.timing(thaliRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      );
      rotationAnimationRef.current.start();

      // Play sound effect
      playEffect(soundFile);
    },
    [],
  );

  const handleCloseAarti = useCallback(() => {
    setIsAartiPlaying(false);
    setActiveSpecialItem(null);
    thaliRotateAnim.setValue(0);

    // Stop the rotation animation
    if (rotationAnimationRef.current) {
      rotationAnimationRef.current.stop();
      rotationAnimationRef.current = null;
    }

    // Stop the aarti
    stopAarti();
  }, []);

  const handleCompletePuja = useCallback(() => {
    setIsPujaComplete(true);
    setIsPujaStarted(false);
    setIsFlowerRainActive(false);
    stopAarti();
  }, []);
  const handleBack = useCallback(() => {
    setIsPujaStarted(false);
    setIsFlowerRainActive(false);
    stopAarti();
  }, []);

  const handleResetPuja = useCallback(() => {
    setIsPujaComplete(false);
    setIsPujaStarted(false);
    setSelectedItems({});
    setShowThali(true);
    setShowSpecialItems(false);
    setActiveSpecialItem(null);
    setIsAartiPlaying(false);
    thaliRotateAnim.setValue(0);

    if (rotationAnimationRef.current) {
      rotationAnimationRef.current.stop();
      rotationAnimationRef.current = null;
    }
  }, []);

  const handleToggleThali = useCallback(() => {
    if (showThali) {
      thaliRotateAnim.setValue(0);
      if (rotationAnimationRef.current) {
        rotationAnimationRef.current.stop();
        rotationAnimationRef.current = null;
      }
    }
    setShowThali(prev => !prev);
  }, [showThali]);

  // Header selector handlers
  const handleOpenHeaderSelector = useCallback(() => {
    setIsHeaderSelectorVisible(true);
  }, []);

  const handleCloseHeaderSelector = useCallback(() => {
    setIsHeaderSelectorVisible(false);
  }, []);

  const handleSelectHeaderImage = useCallback((option: HeaderImageOption) => {
    setSelectedHeaderImage(option);
  }, []);

  return {
    // State
    selectedGod,
    selectedGodTem,
    isFlowerRainActive,
    isDoorOpen,
    showTempleContent,
    animationTrigger,
    isPujaStarted,
    isPujaComplete,
    showSpecialItems,
    activeSpecialItem,
    isAartiPlaying,
    showThali,
    selectedItems,

    // Animation refs
    thaliRotateAnim,
    rotationAnimationRef,
    startButtonScaleAnim,
    startButtonGlowAnim,

    // Modal states
    isGodSelectorVisible,
    isItemSelectorVisible,
    selectedItemId,

    // Header selector state
    selectedHeaderImage,
    isHeaderSelectorVisible,
    headerImageOptions: HEADER_IMAGE_OPTIONS,

    // Computed
    preparedGods,
    hasItems,

    // Handlers
    handleFlowerPress,
    handleGodSelect,
    handleOpenGodSelector,
    handleCloseGodSelector,
    handleSelectGodFromModal,
    handleItemPress,
    handleCloseItemSelector,
    handleSelectItemOption,
    handleStartPuja,
    handleSpecialItemPress,
    handleCloseAarti,
    handleCompletePuja,
    handleBack,
    handleResetPuja,
    handleToggleThali,
    handleOpenHeaderSelector,
    handleCloseHeaderSelector,
    handleSelectHeaderImage,

    //door
    doorOpen,
    setDoorOpen,
  };
};

export default useDailyPuja;
