import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
export const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.6, 228);
const THUMBNAIL_HEIGHT = 118;
const CARD_CONTENT_HEIGHT = 72;

export const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 6,
  },
  card: {
    width: CARD_WIDTH,
    height: THUMBNAIL_HEIGHT + CARD_CONTENT_HEIGHT,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: THUMBNAIL_HEIGHT,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadgeCard: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#FFF',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  cardContent: {
    height: CARD_CONTENT_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  metaBlock: {
    flex: 1,
    marginRight: 6,
    justifyContent: 'center',
  },
  astrologerName: {
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 72,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
