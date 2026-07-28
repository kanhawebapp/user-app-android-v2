import {Dimensions, StyleSheet} from 'react-native';
import {typography} from '../../theme';

const {width} = Dimensions.get('window');

export const networkStatusStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width,
    paddingVertical: typography?.padding?.md || 8,
    paddingHorizontal: typography?.padding?.xl || 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  text: {
    textAlign: 'center',
  },
});
