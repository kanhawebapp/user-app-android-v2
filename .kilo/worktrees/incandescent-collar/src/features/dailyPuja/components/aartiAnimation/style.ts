import { StyleSheet } from "react-native";

export const aertiAnimationStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FF6B00',
    top: -20,
  },
  diyaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diyaBase: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flameContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50,
  },
  flame: {
    width: 30,
    height: 50,
    backgroundColor: '#FF6B00',
    borderRadius: 50,
    transform: [{ scaleX: 0.6 }],
  },
  flameInner: {
    position: 'absolute',
    top: 5,
    width: 20,
    height: 35,
    backgroundColor: '#FFAA00',
    borderRadius: 50,
    transform: [{ scaleX: 0.5 }],
  },
  flameCenter: {
    position: 'absolute',
    top: 10,
    width: 10,
    height: 20,
    backgroundColor: '#FFFF00',
    borderRadius: 50,
  },
  button: {
    marginTop: 20,
  },
});