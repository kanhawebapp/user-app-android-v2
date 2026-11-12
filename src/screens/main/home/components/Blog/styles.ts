import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
export const BLOG_CARD_GAP = 12;
export const BLOG_CARD_WIDTH = Math.min(240, SCREEN_WIDTH * 0.62);
export const BLOG_IMAGE_HEIGHT = Math.round(BLOG_CARD_WIDTH * 0.62);

export const blogStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  scrollContent: {
    alignItems: 'stretch',
  },

  card: {
    width: BLOG_CARD_WIDTH,
    marginRight: BLOG_CARD_GAP,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
  },

  lastCard: {
    marginRight: 0,
  },

  imageWrapper: {
    width: '100%',
    height: BLOG_IMAGE_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#ECECEC',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },

  cardTitle: {
    width: '100%',
    fontSize: 14,
    lineHeight: 20,
    minHeight: 40,
    fontWeight: '600',
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  metaText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  categoryChip: {
    backgroundColor: 'rgba(91, 44, 165, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },

  categoryText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  loadingCard: {
    width: BLOG_CARD_WIDTH,
    height: BLOG_IMAGE_HEIGHT + 96,
    marginRight: BLOG_CARD_GAP,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },

  errorContainer: {
    marginTop: 12,
    alignItems: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#FF4D4F',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyContainer: {
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
