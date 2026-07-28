// /**
//  * Blog Styles
//  * Styles for Blog section in Home Screen
//  */

import {StyleSheet} from 'react-native';

// import {StyleSheet, Dimensions} from 'react-native';

// const {width} = Dimensions.get('window');

// export const blogStyles = StyleSheet.create({
//   container: {
//     marginBottom: 24,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   scrollContent: {
//     paddingHorizontal: 12,
//   },

//   imagePlaceholder: {
//     height: 140,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   card: {
//     width: 240,
//     marginHorizontal: 6,
//     // borderRadius: 18,
//     // marginRight: 16,
//     // marginBottom: 16,
//     // backgroundColor: '#fff',
//     // // ✨ Subtle border (premium feel)
//     // borderWidth: 0.5,
//     // borderColor: 'rgba(0,0,0,0.04)',
//     // // 🌑 iOS soft shadow (spread + blur)
//     // shadowColor: '#000',
//     // shadowOpacity: 0.12,
//     // shadowRadius: 18,
//     // shadowOffset: {width: 0, height: 10},
//     // // 🤖 Android depth
//     // elevation: 8,
//     // overflow: 'hidden',
//   },

//   imageWrapper: {
//     height: 140,
//   },

//   image: {
//     width: '100%',
//     height: '100%',
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },

//   imageContent: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//   },

//   content: {
//     padding: 12,
//   },

//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   badge: {
//     position: 'absolute',
//     top: 10,
//     // right: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },

//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     marginLeft: 4,
//   },

//   metaText: {
//     fontSize: 11,
//     color: '#ffffff',
//     marginLeft: 4,
//   },
//   dateContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
// });

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
    overflow: 'hidden', // 🔥 MUST
  },

  imageWrapper: {
    height: 140,
    width: '100%', // 🔥 IMPORTANT
    backgroundColor: '#eee', // 👈 debug (remove later)
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
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
