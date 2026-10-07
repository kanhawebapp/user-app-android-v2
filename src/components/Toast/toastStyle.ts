import {StyleSheet, Dimensions} from 'react-native';
import {typography} from '../../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const toastStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },

  // Position is now handled dynamically in Toast.tsx
  // using useSafeAreaInsets().
  containerTop: {},

  // Position is now handled dynamically in Toast.tsx
  // using useSafeAreaInsets().
  containerBottom: {},

  gradientContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,

    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    elevation: 12,
  },

  glowEffect: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 999,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },

  message: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },

  messageWithTitle: {
    color: '#CBD5E1',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  progressBarContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
});