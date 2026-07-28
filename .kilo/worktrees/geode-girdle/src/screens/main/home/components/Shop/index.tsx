// /**
//  * Shop Component
//  * Shop section in Home Screen that opens in WebView
//  */

// import React, {useState, useCallback} from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Linking,
//   ActivityIndicator,
// } from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {ShopProps} from './types';
// import {shopStyles} from './styles';
// import {WebView} from 'react-native-webview';

// export const Shop: React.FC<ShopProps> = ({
//   items = [],
//   onShopPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const [webViewVisible, setWebViewVisible] = useState(false);
//   const [currentUrl, setCurrentUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   const handleShopPress = useCallback(
//     (item: any) => {
//       // Open WebView with the shop item's web URL
//       setCurrentUrl(item.webUrl);
//       setWebViewVisible(true);
//       setIsLoading(true);
//       onShopPress?.(item);
//     },
//     [onShopPress],
//   );

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

//   return (
//     <View style={[shopStyles.container, style]}>
//       <View style={shopStyles.header}>
//         <Text variant="h6" weight="semibold">
//           Shop
//         </Text>
//         <Button
//           title="View All"
//           variant="ghost"
//           size="small"
//           onPress={onViewAllPress}
//         />
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={shopStyles.scrollContent}>
//         {items.map(item => (
//           <TouchableOpacity
//             key={item.id}
//             style={[shopStyles.card, {backgroundColor: colors.card as any}]}
//             onPress={() => handleShopPress(item)}
//             activeOpacity={0.9}>
//             <View
//               style={[
//                 shopStyles.imagePlaceholder,
//                 {backgroundColor: colors.background.secondary},
//               ]}>
//               {item.imageUrl ? (
//                 <Icon
//                   name="image"
//                   size={32}
//                   color={colors.icon.secondary}
//                   library="MaterialIcons"
//                 />
//               ) : (
//                 <Icon
//                   name="shopping-bag"
//                   size={32}
//                   color={colors.primary.main}
//                   library="Feather"
//                 />
//               )}
//             </View>

//             <View style={shopStyles.content}>
//               <Text variant="label" weight="semibold" numberOfLines={1}>
//                 {item.title}
//               </Text>
//               <Text
//                 variant="captionSmall"
//                 style={{color: colors.text.secondary, marginTop: 4}}
//                 numberOfLines={2}>
//                 {item.description}
//               </Text>

//               <View style={shopStyles.footer}>
//                 {item.price ? (
//                   <Text
//                     variant="label"
//                     weight="bold"
//                     style={{color: colors.primary.main}}>
//                     ₹{item.price}
//                   </Text>
//                 ) : (
//                   <Text
//                     variant="label"
//                     weight="bold"
//                     style={{color: colors.primary.main}}>
//                     Visit Shop
//                   </Text>
//                 )}
//                 <Icon
//                   name="arrow-forward"
//                   size={16}
//                   color={colors.primary.main}
//                   library="MaterialIcons"
//                 />
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

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
//           {/* Modal Header */}
//           <View
//             style={[
//               styles.modalHeader,
//               {backgroundColor: colors.background.secondary},
//             ]}>
//             <TouchableOpacity
//               onPress={handleCloseWebView}
//               style={styles.closeButton}>
//               <Icon
//                 name="close"
//                 size={24}
//                 color={colors.text.primary}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//             <Text
//               variant="h6"
//               weight="semibold"
//               style={styles.modalTitle}
//               numberOfLines={1}>
//               Shop
//             </Text>
//             <TouchableOpacity
//               onPress={handleOpenInBrowser}
//               style={styles.browserButton}>
//               <Icon
//                 name="open-in-new"
//                 size={24}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Loading Indicator */}
//           {isLoading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={colors.primary.main} />
//               <Text
//                 variant="body"
//                 style={{color: colors.text.secondary, marginTop: 8}}>
//                 Loading...
//               </Text>
//             </View>
//           )}

//           {/* WebView */}
//           <WebView
//             source={{uri: currentUrl}}
//             style={styles.webView}
//             onLoadEnd={handleWebViewLoadEnd}
//             startInLoadingState={true}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             allowsInlineMediaPlayback={true}
//             mediaPlaybackRequiresUserAction={true}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalTitle: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   browserButton: {
//     padding: 4,
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
//   webView: {
//     flex: 1,
//   },
// });

// export default Shop;

/**
 * Shop Component (Figma Banner Style)
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {ShopProps} from './types';
import {WebView} from 'react-native-webview';
import {LogoSection} from '../../../../auth/LoginScreen/components';
import {CustomImage} from '../../../../../components';
import images from '../../../../../assets/images';

export const Shop: React.FC<ShopProps> = ({items = [], onShopPress, style}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // const handleShopPress = useCallback(
  //   (item: any) => {
  //     if (!item?.webUrl) return;
  //     setCurrentUrl(item.webUrl);
  //     setWebViewVisible(true);
  //     setIsLoading(true);
  //     onShopPress?.(item);
  //   },
  //   [onShopPress],
  // );

  const handleCloseWebView = useCallback(() => {
    setWebViewVisible(false);
    setCurrentUrl('');
  }, []);

  const handleOpenInBrowser = useCallback(() => {
    if (currentUrl) {
      Linking.openURL(currentUrl);
      setWebViewVisible(false);
    }
  }, [currentUrl]);

  const handleWebViewLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);
  const SHOP_URL = 'https://shop.dhwaniastro.com/';
  const firstItem = items?.[0]; // use first item for banner action

  const handleShopPress = useCallback(() => {
    setCurrentUrl(SHOP_URL);
    setWebViewVisible(true);
    setIsLoading(true);
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Figma Banner Card */}
      {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleShopPress(firstItem)}>
        <LinearGradient
          colors={['#6A3FCF', '#4A1E9E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.bannerContainer}>
          <View style={styles.iconWrapper}>
            <Icon
              name="lotus"
              size={28}
              color="#FFD700"
              library="MaterialCommunityIcons"
            />
          </View>

          <Text style={styles.title}>
            Shop Abhimantrit & Certified Products
          </Text>

          <Text style={styles.subtitle}>
            Get genuine gemstones, yantras, and rudrakshas blessed by experts.
          </Text>


          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Shop</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity> */}

      <TouchableOpacity
        activeOpacity={0.9}
        // onPress={() => handleShopPress(firstItem)}
        onPress={handleShopPress}>
        <LinearGradient
          colors={['#6A3FCF', '#4A1E9E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.bannerContainer}>
          {/* Top Right Ellipse */}
          <View style={styles.topEllipse} />

          {/* Bottom Left Ellipse */}
          <View style={styles.bottomEllipse} />

          {/* Icon */}
          {/* <View style={styles.iconWrapper}>
            <Icon
              name="lotus"
              size={28}
              color="#FFD700"
              library="MaterialCommunityIcons"
            />
          </View> */}
          <CustomImage
            source={images.Logo}
            width={100}
            height={100}
            borderRadius={0}
            resizeMode="contain"
            showLoading={false}
          />

          {/* Title */}
          <Text style={styles.title}>
            Shop Abhimantrit & Certified Products
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Get genuine gemstones, yantras, and rudrakshas blessed by experts.
          </Text>

          {/* Button */}
          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Shop</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* WebView Modal */}
      <Modal
        visible={webViewVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseWebView}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: colors.background.primary},
          ]}>
          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              {backgroundColor: colors.background.secondary},
            ]}>
            <TouchableOpacity onPress={handleCloseWebView}>
              <Icon
                name="close"
                size={24}
                color={colors.text.primary}
                library="MaterialIcons"
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Shop</Text>

            <TouchableOpacity onPress={handleOpenInBrowser}>
              <Icon
                name="open-in-new"
                size={24}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </TouchableOpacity>
          </View>

          {/* Loader */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text style={{marginTop: 8}}>Loading...</Text>
            </View>
          )}

          {/* WebView */}
          <WebView
            source={{uri: currentUrl}}
            style={{flex: 1}}
            onLoadEnd={handleWebViewLoadEnd}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },

  bannerContainer: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    // Shadow
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconWrapper: {
    backgroundColor: '#FFD70020',
    padding: 10,
    borderRadius: 30,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: '#E0D4FF',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },

  button: {
    backgroundColor: '#FF7A1A',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },

  /* Modal Styles */
  modalContainer: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  topEllipse: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -40,
  },

  bottomEllipse: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -60,
    left: -50,
  },
});
