import {StyleSheet} from 'react-native';

export const blogStyles = StyleSheet.create({
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
    width: 240,
    marginHorizontal: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },

  imageWrapper: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  imageContent: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },

  content: {
    padding: 10,
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
});
