import {StyleSheet} from 'react-native';

export const pujaItemStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  firstRow: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  secondRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  glow: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 33,
  },
  itemButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  itemLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemLabelHindi: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },
});
