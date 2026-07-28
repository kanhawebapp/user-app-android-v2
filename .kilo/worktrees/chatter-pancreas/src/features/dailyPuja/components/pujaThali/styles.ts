import {Dimensions, StyleSheet} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const pujaThaliStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    // top: 80,
    // left: 10,
    right: 10,
    alignItems: 'center',
    bottom: 190,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  titleSubText: {
    fontSize: 12,
    color: 'rgba(255, 215, 0, 0.8)',
    marginLeft: 8,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  countText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  thaliPlate: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH - 60,
    borderRadius: (SCREEN_WIDTH - 60) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thaliImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  thaliInner: {
    width: '65%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyTextHindi: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  itemsContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  middleLeft: {
    flexDirection: 'row',
  },
  middleRight: {
    flexDirection: 'row',
  },
  centerDecoration: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  thaliItemContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  thaliItemGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  thaliItem: {
    // width: 40,
    // height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thaliItemImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  thaliItemLabel: {
    fontSize: 7,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
