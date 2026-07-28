import { StyleSheet } from "react-native";

export const godSelectorStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 170,
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 60,
  },
  selectedButtonContainer: {
    transform: [{ scale: 1.05 }],
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  godName: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  // Select button styles
  selectButtonWrapper: {
    marginHorizontal: 6,
  },
  selectButtonContainer: {
    alignItems: 'center',
  },
  selectButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectButtonLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  lordImage: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
    resizeMode:'cover'
  },
});