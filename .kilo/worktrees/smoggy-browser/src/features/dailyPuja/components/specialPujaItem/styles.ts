import { StyleSheet } from "react-native";

export const specialPujaItemStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    zIndex: 100,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  glow: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 38,
  },
  itemButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  itemLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemLabelHindi: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
});
