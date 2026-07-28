import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export const useSidebarAnimation = (visible: boolean) => {
  const slideAnim = useMemo(() => new Animated.Value(-SIDEBAR_WIDTH), []);
  const overlayAnim = useMemo(() => new Animated.Value(0), []);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const profileBorderAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation for profile border
      Animated.loop(
        Animated.timing(profileBorderAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });

      profileBorderAnim.stopAnimation();
      profileBorderAnim.setValue(0);
    }
  }, [visible]);

  return {
    slideAnim,
    overlayAnim,
    rotateAnim,
    profileBorderAnim,
    shouldRender,
  };
};
