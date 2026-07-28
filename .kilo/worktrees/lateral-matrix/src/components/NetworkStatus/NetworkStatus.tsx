/**
 * Network Status Component
 * Shows offline indicator when internet is not available
 */

import React, { useEffect, useState } from 'react';
import { Text, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../../theme';
import { networkStatusStyle } from './networkStatusStyle';

export const NetworkStatus: React.FC = () => {
  const { colors, typography } = useTheme();
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const styles = networkStatusStyle

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      
      if (!connected) {
        setIsVisible(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
        });
      }
    });

    return () => unsubscribe();
  }, [opacity]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.warning?.main || '#FF9800',
          opacity,
        },
      ]}
    >
      <Text 
        style={[
          styles.text,
          {
            color: '#FFFFFF',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
          }
        ]}
      >
        {!isConnected ? 'No internet connection' : 'Back online'}
      </Text>
    </Animated.View>
  );
};



export default NetworkStatus;

