// import React, {useState, useCallback} from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Linking,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {ShopProps} from './types';
// import {WebView} from 'react-native-webview';
// import {CustomImage} from '../../../../../components';
// import images from '../../../../../assets/images';

// export const Shop: React.FC<ShopProps> = ({items = [], onShopPress, style}) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const [webViewVisible, setWebViewVisible] = useState(false);
//   const [currentUrl, setCurrentUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   const handleCloseWebView = useCallback(() => {
//     setWebViewVisible(false);
//     setCurrentUrl('');
//   }, []);

//   const handleOpenInBrowser = useCallback(() => {
//     if (currentUrl) {
//       Linking.openURL(currentUrl);
//       setWebViewVisible(false);
//     }
//   }, [currentUrl]);

//   const handleWebViewLoadEnd = useCallback(() => {
//     setIsLoading(false);
//   }, []);
//   const SHOP_URL = 'https://shop.dhwaniastro.com/';
//   const firstItem = items?.[0]; // use first item for banner action

//   const handleShopPress = useCallback(() => {
//     setCurrentUrl(SHOP_URL);
//     setWebViewVisible(true);
//     setIsLoading(true);
//   }, []);

//   return (
//     <View style={[styles.container, style]}>

//       <TouchableOpacity
//         activeOpacity={0.9}
//         // onPress={() => handleShopPress(firstItem)}
//         onPress={handleShopPress}>
//         <LinearGradient
//           colors={['#6A3FCF', '#4A1E9E']}
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 1}}
//           style={styles.bannerContainer}>
//           {/* Top Right Ellipse */}
//           <View style={styles.topEllipse} />

//           {/* Bottom Left Ellipse */}
//           <View style={styles.bottomEllipse} />

//           {/* Icon */}
//           {/* <View style={styles.iconWrapper}>
//             <Icon
//               name="lotus"
//               size={28}
//               color="#FFD700"
//               library="MaterialCommunityIcons"
//             />
//           </View> */}
// <CustomImage
//   source={images.Logo}
//   width={100}
//   height={100}
//   borderRadius={0}
//   resizeMode="contain"
//   showLoading={false}
// />

//           {/* Title */}
//           <Text style={styles.title}>
//             Shop Abhimantrit & Certified Products
//           </Text>

//           {/* Subtitle */}
//           <Text style={styles.subtitle}>
//             Get genuine gemstones, yantras, and rudrakshas blessed by experts.
//           </Text>

//           {/* Button */}
//           <View style={styles.button}>
//             <Text style={styles.buttonText}>Explore Shop</Text>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>

//       {/* WebView Modal */}
//       <Modal
//         visible={webViewVisible}
//         animationType="slide"
//         presentationStyle="fullScreen"
//         onRequestClose={handleCloseWebView}>
//         <View
//           style={[
//             styles.modalContainer,
//             {backgroundColor: colors.background.primary},
//           ]}>
//           {/* Header */}
//           <View
//             style={[
//               styles.modalHeader,
//               {backgroundColor: colors.background.secondary},
//             ]}>
//             <TouchableOpacity onPress={handleCloseWebView}>
//               <Icon
//                 name="close"
//                 size={24}
//                 color={colors.text.primary}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Shop</Text>

//             <TouchableOpacity onPress={handleOpenInBrowser}>
//               <Icon
//                 name="open-in-new"
//                 size={24}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Loader */}
//           {isLoading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={colors.primary.main} />
//               <Text style={{marginTop: 8}}>Loading...</Text>
//             </View>
//           )}

//           {/* WebView */}
//           <WebView
//             source={{uri: currentUrl}}
//             style={{flex: 1}}
//             onLoadEnd={handleWebViewLoadEnd}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default Shop;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     marginTop: 16,
//   },

//   bannerContainer: {
//     borderRadius: 20,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',

//     // Shadow
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     elevation: 6,
//   },

//   iconWrapper: {
//     backgroundColor: '#FFD70020',
//     padding: 10,
//     borderRadius: 30,
//     marginBottom: 12,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },

//   subtitle: {
//     fontSize: 13,
//     color: '#E0D4FF',
//     textAlign: 'center',
//     marginBottom: 18,
//     lineHeight: 18,
//   },

//   button: {
//     backgroundColor: '#FF7A1A',
//     paddingVertical: 10,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//   },

//   buttonText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   /* Modal Styles */
//   modalContainer: {
//     flex: 1,
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//   },
//   topEllipse: {
//     position: 'absolute',
//     width: 130,
//     height: 130,
//     borderRadius: 100,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//     top: -40,
//     right: -40,
//   },

//   bottomEllipse: {
//     position: 'absolute',
//     width: 125,
//     height: 125,
//     borderRadius: 100,
//     backgroundColor: 'rgba(255,255,255,0.06)',
//     bottom: -60,
//     left: -50,
//   },
// });

import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {ShopProps} from './types';
import {WebView} from 'react-native-webview';
import {CustomImage} from '../../../../../components';
import images from '../../../../../assets/images';

const SHOP_URL = 'https://shop.dhwaniastro.com/';

export const Shop: React.FC<ShopProps> = ({items = [], style}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const openShop = useCallback(() => {
    setCurrentUrl(SHOP_URL);
    setWebViewVisible(true);
    setLoading(true);
  }, []);

  const closeWebView = useCallback(() => {
    setWebViewVisible(false);
    setCurrentUrl('');
    setLoading(false);
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* SHOP BANNER */}
      <TouchableOpacity activeOpacity={0.9} onPress={openShop}>
        <LinearGradient
          colors={['#6A3FCF', '#4A1E9E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.bannerContainer}>
          <CustomImage
            source={images.Logo}
            width={100}
            height={100}
            borderRadius={0}
            resizeMode="contain"
            showLoading={false}
          />

          <Text style={styles.title}>
            Shop Abhimantrit & Certified Products
          </Text>

          <Text style={styles.subtitle}>
            Get genuine gemstones, yantras & rudraksha blessed by experts
          </Text>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Shop</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* WEBVIEW MODAL */}
      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={closeWebView}>
        <View style={{flex: 1, backgroundColor: colors.background.primary}}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={closeWebView}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Shop</Text>

            <View style={{width: 24}} />
          </View>

          {/* WEBVIEW (IMPORTANT FIX) */}
          <WebView
            source={{uri: currentUrl}}
            style={{flex: 1}}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState={true}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            // 🔥 THIS IS IMPORTANT - prevents external browser
            originWhitelist={['*']}
            // Prevent external navigation
            onShouldStartLoadWithRequest={request => {
              const url = request.url;

              // allow only shop domain inside app
              if (url.includes('shop.dhwaniastro.com')) {
                return true;
              }

              return false; // block external browser redirect
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginTop: 16,
  },

  bannerContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 13,
    color: '#E0D4FF',
    textAlign: 'center',
    marginTop: 6,
  },

  button: {
    marginTop: 12,
    backgroundColor: '#FF7A1A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },

  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
