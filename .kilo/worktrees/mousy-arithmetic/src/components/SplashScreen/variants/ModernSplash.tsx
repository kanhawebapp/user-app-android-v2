// /**
//  * Modern Splash Screen Component
//  * Contemporary gradient mesh design
//  */

// import React, { useEffect, useRef } from 'react';
// import { View, Animated, Easing } from 'react-native';
// import { useTheme } from '../../../theme';
// import { CustomImage } from '../../Image';
// import { BackgroundLayout } from '../../BackgroundLayout';
// import { Button } from '../../Button';
// import { Text } from '../../Text';
// import { images, getLogoSource, getBackgroundImageSource } from '../../../assets/images';
// import { ModernSplashProps } from '../splashScreenType';
// import { modernSplashStyle, splashScreenBaseStyle } from '../splashScreenStyle';
// import { useAppName, useAppTagline, useSplashLogoUrl, useBackgroundImageUrl } from '../../../stores/config.store';
// import { DEFAULT_TAGLINE } from '../splashScreenType';

// export const ModernSplash: React.FC<ModernSplashProps> = ({
//   showTagline = true,
//   tagline,
//   onNext,
//   isLastScreen = false,
//   showSkip = false,
//   onSkip,
// }) => {
//   // Get config values with fallback to defaults
//   const configAppName = useAppName();
//   const configTagline = useAppTagline();
//   const splashLogoUrl = useSplashLogoUrl();
//   const backgroundImageUrl = useBackgroundImageUrl();

//   // Use prop tagline if provided, otherwise use config tagline, otherwise use default
//   const displayTagline = tagline || configTagline || DEFAULT_TAGLINE;

//   const { colors } = useTheme();
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const buttonOpacity = useRef(new Animated.Value(0)).current;

//   // Get logo source - config URL OR local fallback
//   const logoSource = getLogoSource(splashLogoUrl);
//   // Get background image source - config URL OR undefined (will use gradient)
//   const bgImageSource = getBackgroundImageSource(backgroundImageUrl);

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 700,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 700,
//         useNativeDriver: true,
//         easing: Easing.out(Easing.back(1.5)),
//       }),
//       Animated.timing(buttonOpacity, {
//         toValue: 1,
//         duration: 400,
//         delay: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Subtle pulse animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 1500,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease),
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease),
//         }),
//       ]),
//     ).start();
//   }, [fadeAnim, slideAnim, pulseAnim, buttonOpacity]);

//   // Gradient for modern splash
//   const gradientColors = [
//     '#1A1A2E',
//     colors.primary.main,
//     colors.secondary.main,
//   ];

//   return (
//     <BackgroundLayout
//       backgroundColor="#1A1A2E"
//       backgroundImage={bgImageSource}
//       gradientColors={gradientColors}
//       gradientDirection="diagonal"
//       overlayOpacity={0.4}
//       statusBarStyle="light-content"
//     >
//       {/* Gradient orbs */}
//       <Animated.View
//         style={[
//           modernSplashStyle.modernOrb1,
//           {
//             backgroundColor: colors.primary.main,
//             transform: [{ scale: pulseAnim }],
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           modernSplashStyle.modernOrb2,
//           {
//             backgroundColor: colors.secondary.main,
//             transform: [{ scale: pulseAnim }],
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           modernSplashStyle.modernOrb3,
//           {
//             backgroundColor: colors.primary.light,
//           },
//         ]}
//       />

//       {/* Content */}
//       <Animated.View
//         style={[
//           splashScreenBaseStyle.contentContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//       >
//         {/* Logo with modern frame */}
//         <View style={modernSplashStyle.modernLogoFrame}>
//           <CustomImage
//             source={logoSource}
//             width={140}
//             height={90}
//             borderRadius={0}
//             resizeMode="contain"
//             showLoading={false}
//           />
//         </View>

//         <Text
//           variant="display"
//           weight="bold"
//           color={colors.common.white}
//           align="center"
//           style={modernSplashStyle.modernTitle}
//         >
//           {configAppName}
//         </Text>

//         {showTagline && (
//           <Text
//             variant="body"
//             color={colors.common.white}
//             align="center"
//             style={[modernSplashStyle.modernTagline, { opacity: 0.9 }]}
//           >
//             {displayTagline}
//           </Text>
//         )}

//         {/* Modern decorative line */}
//         <View style={modernSplashStyle.modernLine}>
//           <View
//             style={[
//               modernSplashStyle.modernLineInner,
//               { backgroundColor: colors.secondary.main },
//             ]}
//           />
//         </View>
//       </Animated.View>

//       {/* Navigation Buttons */}
//       <Animated.View
//         style={[splashScreenBaseStyle.buttonContainer, { opacity: buttonOpacity }]}
//       >
//         {showSkip && (
//           <Button
//             title="Skip"
//             variant="ghost"
//             onPress={onSkip}
//             textStyle={{ color: colors.common.white }}
//           />
//         )}
//         <Button
//           title={isLastScreen ? 'Get Started' : 'Next'}
//           variant="secondary"
//           size="large"
//           onPress={onNext}
//           style={splashScreenBaseStyle.nextButton}
//         />
//       </Animated.View>
//     </BackgroundLayout>
//   );
// };

// export default ModernSplash;
