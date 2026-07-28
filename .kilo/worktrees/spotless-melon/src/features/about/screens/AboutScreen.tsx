// /**
//  * About Screen
//  * App information, company details, and legal information
//  */

// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   Linking,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { Text } from '../../../components/Text';
// import { Icon } from '../../../components/Icon';
// import { Card } from '../../../components/Card';
// import { useTheme } from '../../../theme';
// import { useFAQs } from '../../../services/api/faq/useFAQs';
// import { useAboutPage } from '../../../services/api/about/useAboutPage';

// interface AboutScreenProps {
//   onNavigateBack?: () => void;
// }

// const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigateBack }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const insets = useSafeAreaInsets();

//   //   const {
//   //   data,
//   //   loading,
//   //   totalCount,
//   // } = useFAQs();

//   // console.log("data FAQ",data)
//   const {
//     data,
//     loading,
//   } = useAboutPage();

//   console.log("data about", data)

//   const APP_VERSION = '1.0.0';
//   const BUILD_NUMBER = '1';

//   const features = [
//     {
//       id: '1',
//       title: 'Expert Astrologers',
//       description: 'Connect with verified and experienced astrologers',
//       icon: 'verified-user',
//     },
//     {
//       id: '2',
//       title: 'Instant Consultation',
//       description: 'Get instant chat and call consultations',
//       icon: 'flash-on',
//     },
//     {
//       id: '3',
//       title: 'Accurate Predictions',
//       description: 'Precise predictions based on Vedic astrology',
//       icon: 'auto-graph',
//     },
//     {
//       id: '4',
//       title: 'Secure Platform',
//       description: 'Your data and payments are fully secure',
//       icon: 'lock',
//     },
//   ];

//   const socialLinks = [
//     {
//       id: 'facebook',
//       name: 'Facebook',
//       icon: 'facebook',
//       url: 'https://facebook.com',
//     },
//     {
//       id: 'twitter',
//       name: 'Twitter',
//       icon: 'twitter',
//       url: 'https://twitter.com',
//     },
//     {
//       id: 'instagram',
//       name: 'Instagram',
//       icon: 'instagram',
//       url: 'https://instagram.com',
//     },
//     {
//       id: 'youtube',
//       name: 'YouTube',
//       icon: 'youtube-play',
//       url: 'https://youtube.com',
//     },
//   ];

//   const handleSocialPress = (url: string) => {
//     Linking.openURL(url);
//   };

//   return (
//     <View
//       style={[styles.container, { backgroundColor: colors.background.primary }]}>
//       <StatusBar
//         barStyle={theme.isDark ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background.primary}
//       />

//       {/* Header */}
//       <View
//         style={[
//           styles.header,
//           { backgroundColor: colors.background.primary, paddingTop: insets.top },
//         ]}>
//         <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
//           <Icon
//             name="arrow-back"
//             size={24}
//             color={colors.icon.primary}
//             library="MaterialIcons"
//           />
//         </TouchableOpacity>
//         <Text
//           variant="h6"
//           weight="semibold"
//           style={{ color: colors.text.primary }}>
//           About
//         </Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView
//         contentContainerStyle={[
//           styles.scrollContent,
//           { paddingBottom: insets.bottom + 100 },
//         ]}
//         showsVerticalScrollIndicator={false}>
//         {/* App Logo and Info */}
//         <View style={styles.appInfoSection}>
//           <View
//             style={[styles.appLogo, { backgroundColor: colors.primary.main }]}>
//             <Icon
//               name="auto-awesome"
//               size={48}
//               color={colors.common.white}
//               library="MaterialIcons"
//             />
//           </View>
//           <Text
//             variant="h5"
//             weight="bold"
//             style={{ color: colors.text.primary, marginTop: 16 }}>
//             Dhwani Astro
//           </Text>
//           <Text
//             variant="body"
//             style={{ color: colors.text.secondary, marginTop: 4 }}>
//             Version {APP_VERSION} ({BUILD_NUMBER})
//           </Text>
//           <Text
//             variant="captionSmall"
//             style={{ color: colors.text.tertiary, marginTop: 8 }}>
//             Your Trusted Astrology Companion
//           </Text>
//         </View>

//         {/* About Description */}
//         <Card style={styles.descriptionCard}>
//           <Text
//             variant="body"
//             style={{ color: colors.text.secondary, lineHeight: 22 }}>
//             Dhwani Astro is a premier astrology platform that connects you with
//             expert astrologers for personalized consultations. Get accurate
//             predictions, remedies, and guidance for all aspects of your life.
//           </Text>
//         </Card>

//         {/* Features */}
//         <View style={styles.section}>
//           <Text
//             variant="h6"
//             weight="semibold"
//             style={{ color: colors.text.primary, marginBottom: 16 }}>
//             Why Choose Us
//           </Text>
//           <View style={styles.featuresGrid}>
//             {features.map(feature => (
//               <View key={feature.id} style={styles.featureCard}>
//                 <View
//                   style={[
//                     styles.featureIcon,
//                     { backgroundColor: colors.primary.light + '20' },
//                   ]}>
//                   <Icon
//                     name={feature.icon}
//                     size={24}
//                     color={colors.primary.main}
//                     library="MaterialIcons"
//                   />
//                 </View>
//                 <Text
//                   variant="bodySmall"
//                   weight="semibold"
//                   style={{
//                     color: colors.text.primary,
//                     marginTop: 8,
//                     textAlign: 'center',
//                   }}>
//                   {feature.title}
//                 </Text>
//                 <Text
//                   variant="captionSmall"
//                   style={{
//                     color: colors.text.tertiary,
//                     marginTop: 4,
//                     textAlign: 'center',
//                   }}>
//                   {feature.description}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Contact Info */}
//         <View style={styles.section}>
//           <Text
//             variant="h6"
//             weight="semibold"
//             style={{ color: colors.text.primary, marginBottom: 12 }}>
//             Contact Us
//           </Text>
//           <Card style={styles.contactCard}>
//             <TouchableOpacity style={styles.contactItem}>
//               <Icon
//                 name="email"
//                 size={22}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//               <Text
//                 variant="body"
//                 style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>
//                 support@dhwaniastro.com
//               </Text>
//               <Icon
//                 name="chevron-right"
//                 size={22}
//                 color={colors.icon.tertiary}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//             <View
//               style={[styles.divider, { backgroundColor: colors.border.light }]}
//             />
//             <TouchableOpacity style={styles.contactItem}>
//               <Icon
//                 name="language"
//                 size={22}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//               <Text
//                 variant="body"
//                 style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>
//                 www.dhwaniastro.com
//               </Text>
//               <Icon
//                 name="chevron-right"
//                 size={22}
//                 color={colors.icon.tertiary}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//             <View
//               style={[styles.divider, { backgroundColor: colors.border.light }]}
//             />
//             <TouchableOpacity style={styles.contactItem}>
//               <Icon
//                 name="phone"
//                 size={22}
//                 color={colors.primary.main}
//                 library="MaterialIcons"
//               />
//               <Text
//                 variant="body"
//                 style={{ color: colors.text.primary, marginLeft: 12, flex: 1 }}>
//                 +91 1234567890
//               </Text>
//               <Icon
//                 name="chevron-right"
//                 size={22}
//                 color={colors.icon.tertiary}
//                 library="MaterialIcons"
//               />
//             </TouchableOpacity>
//           </Card>
//         </View>

//         {/* Social Media */}
//         <View style={styles.section}>
//           <Text
//             variant="h6"
//             weight="semibold"
//             style={{ color: colors.text.primary, marginBottom: 12 }}>
//             Follow Us
//           </Text>
//           <View style={styles.socialContainer}>
//             {socialLinks.map(social => (
//               <TouchableOpacity
//                 key={social.id}
//                 style={[
//                   styles.socialButton,
//                   { backgroundColor: colors.background.secondary },
//                 ]}
//                 onPress={() => handleSocialPress(social.url)}
//                 activeOpacity={0.7}>
//                 <Icon
//                   name={social.icon}
//                   size={22}
//                   color={colors.icon.primary}
//                   library="FontAwesome"
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Legal Links */}
//         <View style={styles.section}>
//           <View style={styles.legalLinks}>
//             <TouchableOpacity style={styles.legalLink}>
//               <Text variant="bodySmall" style={{ color: colors.primary.main }}>
//                 Terms of Service
//               </Text>
//             </TouchableOpacity>
//             <View
//               style={[
//                 styles.legalDivider,
//                 { backgroundColor: colors.border.light },
//               ]}
//             />
//             <TouchableOpacity style={styles.legalLink}>
//               <Text variant="bodySmall" style={{ color: colors.primary.main }}>
//                 Privacy Policy
//               </Text>
//             </TouchableOpacity>
//             <View
//               style={[
//                 styles.legalDivider,
//                 { backgroundColor: colors.border.light },
//               ]}
//             />
//             <TouchableOpacity style={styles.legalLink}>
//               <Text variant="bodySmall" style={{ color: colors.primary.main }}>
//                 Cookie Policy
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Copyright */}
//         <View style={styles.copyrightSection}>
//           <Text
//             variant="captionSmall"
//             style={{ color: colors.text.tertiary, textAlign: 'center' }}>
//             © 2024 Dhwani Astro. All rights reserved.
//           </Text>
//           <Text
//             variant="captionSmall"
//             style={{
//               color: colors.text.tertiary,
//               textAlign: 'center',
//               marginTop: 4,
//             }}>
//             Made with ❤️ in India
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//   },
//   backButton: {
//     padding: 8,
//     marginLeft: -8,
//   },
//   placeholder: {
//     width: 40,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   appInfoSection: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   appLogo: {
//     width: 100,
//     height: 100,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   descriptionCard: {
//     padding: 16,
//     marginBottom: 24,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   featureCard: {
//     width: '48%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   featureIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   contactCard: {
//     padding: 0,
//     overflow: 'hidden',
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     marginLeft: 54,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   socialButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 8,
//   },
//   legalLinks: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   legalLink: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   legalDivider: {
//     width: 1,
//     height: 16,
//   },
//   copyrightSection: {
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
// });

// export default AboutScreen;

/**
 * PREMIUM ABOUT SCREEN
 * Dynamic API Integrated UI
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {Card} from '../../../components/Card';

import {useTheme} from '../../../theme';
import {useAboutPage} from '../../../services/api/about/useAboutPage';

interface AboutScreenProps {
  onNavigateBack?: () => void;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const BASE_URL = 'https://dhwaniastro.com';

const AboutScreen: React.FC<AboutScreenProps> = ({onNavigateBack}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const {data, loading} = useAboutPage();

  // console.log('data about', data);

  const APP_VERSION = '1.0.0';

  const socialLinks = [
    {
      id: 'instagram',
      icon: 'instagram',
      url: 'https://instagram.com',
    },
    {
      id: 'facebook',
      icon: 'facebook',
      url: 'https://facebook.com',
    },
    {
      id: 'youtube',
      icon: 'youtube-play',
      url: 'https://youtube.com',
    },
    {
      id: 'twitter',
      icon: 'twitter',
      url: 'https://twitter.com',
    },
  ];

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderPersonCard = (
    item: any,
    index: number,
    type: 'mentor' | 'founder',
  ) => {
    const imageUrl = item?.image
      ? item.image.startsWith('http')
        ? item.image
        : `${BASE_URL}${item.image}`
      : null;

    return (
      <Card
        key={`${type}-${index}`}
        style={[
          styles.personCard,
          {
            backgroundColor: colors.background.secondary,
          },
        ]}>
        <Image
          source={{
            uri:
              imageUrl ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          }}
          style={styles.personImage}
        />

        <Text
          variant="body"
          weight="bold"
          style={{
            color: colors.text.primary,
            marginTop: 12,
          }}>
          {item?.name}
        </Text>

        <Text
          variant="caption"
          style={{
            color: colors.primary.main,
            marginTop: 4,
          }}>
          {item?.designation}
        </Text>

        <View style={{marginTop: 10}}>
          <RenderHTML
            contentWidth={width}
            source={{
              html: item?.description || '',
            }}
            tagsStyles={{
              p: {
                color: colors.text.secondary,
                fontSize: 13,
                lineHeight: 22,
                textAlign: 'center',
              },
            }}
          />
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          {
            backgroundColor: colors.background.primary,
          },
        ]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
        },
      ]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNavigateBack}
          style={[
            styles.backButton,
            {
              backgroundColor: colors.background.secondary,
            },
          ]}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>

        <Text
          variant="h6"
          weight="bold"
          style={{
            color: colors.text.primary,
          }}>
          About Us
        </Text>

        <View style={{width: 42}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}>
        {/* HERO */}
        <View style={styles.heroContainer}>
          <View
            style={[
              styles.logoContainer,
              {
                backgroundColor: colors.primary.main,
              },
            ]}>
            <Icon
              name="auto-awesome"
              size={48}
              color="#FFF"
              library="MaterialIcons"
            />
          </View>

          <Text
            variant="h4"
            weight="bold"
            style={{
              color: colors.text.primary,
              marginTop: 18,
            }}>
            {data?.heroTitle || 'About Dhwani Astro'}
          </Text>

          <Text
            variant="caption"
            style={{
              color: colors.text.tertiary,
              marginTop: 8,
            }}>
            Version {APP_VERSION}
          </Text>
        </View>

        {/* HERO DESCRIPTION */}
        <Card
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.background.secondary,
            },
          ]}>
          <RenderHTML
            contentWidth={width}
            source={{
              html: data?.heroDescription || '<p>No description available</p>',
            }}
            tagsStyles={{
              p: {
                color: colors.text.secondary,
                fontSize: 15,
                lineHeight: 28,
              },
            }}
          />
        </Card>

        {/* MENTORS */}
        {!!data?.mentors?.length && (
          <View style={styles.section}>
            <Text
              variant="h6"
              weight="bold"
              style={{
                color: colors.text.primary,
                marginBottom: 18,
              }}>
              Our Mentors
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data?.mentors?.map((item, index) =>
                renderPersonCard(item, index, 'mentor'),
              )}
            </ScrollView>
          </View>
        )}

        {/* FOUNDERS */}
        {!!data?.founders?.length && (
          <View style={styles.section}>
            <Text
              variant="h6"
              weight="bold"
              style={{
                color: colors.text.primary,
                marginBottom: 18,
              }}>
              Founders
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data?.founders?.map((item, index) =>
                renderPersonCard(item, index, 'founder'),
              )}
            </ScrollView>
          </View>
        )}

        {/* KEYWORDS */}
        {!!data?.keywords?.length && (
          <View style={styles.section}>
            <Text
              variant="h6"
              weight="bold"
              style={{
                color: colors.text.primary,
                marginBottom: 16,
              }}>
              Expertise
            </Text>

            <View style={styles.keywordContainer}>
              {data?.keywords?.map((keyword: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.keywordBadge,
                    {
                      backgroundColor: colors.primary.main + '15',
                    },
                  ]}>
                  <Text
                    variant="caption"
                    weight="medium"
                    style={{
                      color: colors.primary.main,
                    }}>
                    {keyword}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CONTACT */}
        <View style={styles.section}>
          <Text
            variant="h6"
            weight="bold"
            style={{
              color: colors.text.primary,
              marginBottom: 14,
            }}>
            Contact
          </Text>

          <Card
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.background.secondary,
              },
            ]}>
            <TouchableOpacity style={styles.contactRow} activeOpacity={0.8}>
              <Icon
                name="email"
                size={20}
                color={colors.primary.main}
                library="MaterialIcons"
              />

              <Text
                variant="body"
                style={{
                  color: colors.text.primary,
                  marginLeft: 12,
                }}>
                support@dhwaniastro.com
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colors.border.light,
                },
              ]}
            />

            <TouchableOpacity style={styles.contactRow} activeOpacity={0.8}>
              <Icon
                name="language"
                size={20}
                color={colors.primary.main}
                library="MaterialIcons"
              />

              <Text
                variant="body"
                style={{
                  color: colors.text.primary,
                  marginLeft: 12,
                }}>
                www.dhwaniastro.com
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* SOCIAL */}
        <View style={styles.section}>
          <Text
            variant="h6"
            weight="bold"
            style={{
              color: colors.text.primary,
              marginBottom: 18,
            }}>
            Follow Us
          </Text>

          <View style={styles.socialRow}>
            {socialLinks.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => handleSocialPress(item.url)}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.background.secondary,
                  },
                ]}>
                <Icon
                  name={item.icon}
                  size={22}
                  color={colors.primary.main}
                  library="FontAwesome"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* COPYRIGHT */}
        <View style={styles.footer}>
          <Text
            variant="caption"
            style={{
              color: colors.text.tertiary,
              textAlign: 'center',
            }}>
            © 2026 Dhwani Astro. All rights reserved.
          </Text>

          <Text
            variant="captionSmall"
            style={{
              color: colors.text.tertiary,
              textAlign: 'center',
              marginTop: 6,
            }}>
            Made with ❤️ in India
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  heroCard: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 24,
    padding: 20,
  },

  section: {
    marginTop: 34,
    paddingHorizontal: 20,
  },

  personCard: {
    width: SCREEN_WIDTH * 0.72,
    marginRight: 16,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
  },

  personImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },

  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  keywordBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 40,
    marginRight: 10,
    marginBottom: 10,
  },

  contactCard: {
    borderRadius: 22,
    overflow: 'hidden',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 50,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },

  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
