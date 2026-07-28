import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SPLASH_COLORS} from '../constants';

export const BottomDecoration: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <View style={styles.dot} />
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 70,
    height: 1,
    backgroundColor: SPLASH_COLORS.gold,
    opacity: 0.4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SPLASH_COLORS.gold,
    marginHorizontal: 12,
  },
});
