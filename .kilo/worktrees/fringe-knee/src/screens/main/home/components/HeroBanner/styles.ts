
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const ITEM_WIDTH = SCREEN_WIDTH - 32; // Full width minus horizontal padding of container

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  listContent: {},
  slideContainer: {
    width: ITEM_WIDTH,
  },
  slideTouchable: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay for text readability
    padding: 20,
    justifyContent: 'center',
  },
  textContainer: {
    maxWidth: '80%',
  },
  title: {
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
