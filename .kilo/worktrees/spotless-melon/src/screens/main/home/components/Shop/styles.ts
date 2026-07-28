/**
 * Shop Styles
 * Styles for Shop section in Home Screen
 */

import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const shopStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: width * 0.65,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
