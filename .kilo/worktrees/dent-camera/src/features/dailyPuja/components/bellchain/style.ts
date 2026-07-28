import {StyleSheet} from 'react-native';

export const bellchainStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftChain: {flexDirection: 'row'},
  rightChain: {flexDirection: 'row'},
  hangingContainer: {
    alignItems: 'center',
    marginVertical: 5,
    // width:'100%'
  },
  chainLine: {
    width: 3,
    height: 25,
    backgroundColor: '#8B4513',
    borderRadius: 1,
  },
  bellWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellImage: {
    width: 200,
    height: 210,
  },
  rightBellTilt: {
    transform: [{scaleX: -1}],
  },
});
