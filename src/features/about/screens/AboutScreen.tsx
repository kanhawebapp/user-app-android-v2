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
import {GoBack} from '../../../components';
import {API_BASE_URL} from '../../../constants/api.constants';

interface AboutScreenProps {
  onNavigateBack?: () => void;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const BASE_URL = API_BASE_URL.DEVELOPMENT;
// const BASE_URL = 'https://dhwaniastro.com';

const AboutScreen: React.FC<AboutScreenProps> = ({onNavigateBack}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const {data, loading} = useAboutPage();

  console.log('data about', data);

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

        <Text variant="h6" weight="bold" style={[styles.personName]}>
          {item?.name}
        </Text>

        <View
          style={[
            styles.designationBadge,
            {backgroundColor: colors.primary.light},
          ]}>
          <Text
            variant="caption"
            weight="medium"
            style={[styles.designationText]}>
            {item?.designation}
          </Text>
        </View>

        <View style={styles.personDescription}>
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

      <View style={styles.headerContainer}>
        <GoBack onBack={onNavigateBack} title="About Us" />
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
              styles.heroLogoContainer,
              {
                backgroundColor: colors.primary.main,
              },
            ]}>
            <Icon
              name="auto-awesome"
              size={56}
              color="#FFF"
              library="MaterialIcons"
            />
          </View>

          <Text variant="h3" weight="bold" style={styles.heroTitle}>
            {data?.heroTitle || 'About Dhwani Astro'}
          </Text>

          <Text variant="body" weight="regular" style={styles.heroSubtitle}>
            Discover the wisdom of the cosmos with our expert astrologers
          </Text>

          <View
            style={[
              styles.versionBadge,
              {backgroundColor: colors.primary.light},
            ]}>
            <Text variant="caption" weight="medium" style={styles.versionText}>
              v{APP_VERSION}
            </Text>
          </View>
        </View>

        {/* HERO DESCRIPTION */}
        <Card
          style={[
            styles.heroDescriptionCard,
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
                fontSize: 16,
                lineHeight: 28,
                marginBottom: 16,
                fontWeight: '400',
              },
              h2: {
                color: colors.text.primary,
                fontSize: 22,
                lineHeight: 32,
                fontWeight: '700',
                marginBottom: 16,
                marginTop: 8,
              },
              strong: {
                color: colors.primary.main,
                fontWeight: '600',
              },
            }}
          />
        </Card>

        {/* MENTORS */}
        {!!data?.mentors?.length && (
          <View style={styles.section}>
            <Text variant="h5" weight="bold" style={styles.sectionTitle}>
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
            <Text variant="h5" weight="bold" style={styles.sectionTitle}>
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
            <Text variant="h5" weight="bold" style={styles.sectionTitle}>
              Expertise
            </Text>

            <View style={styles.keywordContainer}>
              {data?.keywords?.map((keyword: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.keywordBadge,
                    {backgroundColor: colors.primary.light},
                  ]}>
                  <Icon
                    name="star"
                    size={12}
                    color={colors.primary.main}
                    library="FontAwesome"
                    style={styles.keywordIcon}
                  />
                  <Text
                    variant="caption"
                    weight="medium"
                    style={styles.keywordText}>
                    {keyword}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CONTACT */}
        <View style={styles.section}>
          <Text variant="h5" weight="bold" style={styles.sectionTitle}>
            Contact
          </Text>

          <Card
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.background.secondary,
              },
            ]}>
            <TouchableOpacity style={styles.contactRow} activeOpacity={0.7}>
              <View
                style={[
                  styles.contactIconContainer,
                  {backgroundColor: colors.primary.light},
                ]}>
                <Icon
                  name="email"
                  size={20}
                  color={colors.primary.main}
                  library="MaterialIcons"
                />
              </View>

              <Text variant="body" weight="medium" style={styles.contactText}>
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

            <TouchableOpacity style={styles.contactRow} activeOpacity={0.7}>
              <View
                style={[
                  styles.contactIconContainer,
                  {backgroundColor: colors.primary.light},
                ]}>
                <Icon
                  name="language"
                  size={20}
                  color={colors.primary.main}
                  library="MaterialIcons"
                />
              </View>

              <Text variant="body" weight="medium" style={styles.contactText}>
                www.dhwaniastro.com
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* SOCIAL */}
        <View style={styles.section}>
          <Text variant="h5" weight="bold" style={styles.sectionTitle}>
            Follow Us
          </Text>

          <View style={styles.socialRow}>
            {socialLinks.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => handleSocialPress(item.url)}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.background.secondary,
                  },
                ]}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={colors.primary.main}
                  library="FontAwesome"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* COPYRIGHT */}
        <View style={styles.footer}>
          <Text variant="caption" weight="medium" style={styles.footerText}>
            © 2026 Dhwani Astro. All rights reserved.
          </Text>

          <Text variant="captionSmall" style={styles.footerSubtext}>
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

  headerContainer: {
    marginTop: 40,
  },

  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  heroLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 12,
  },

  heroTitle: {
    color: '#000000',
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  heroSubtitle: {
    color: '#6B6B80',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },

  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },

  versionText: {
    color: '#5B2CA5',
    fontSize: 12,
  },

  heroDescriptionCard: {
    // marginHorizontal: 10,
    marginTop: 40,
    borderRadius: 28,
    padding: 24,
    // marginRight:30,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
  },

  section: {
    // marginTop: 40,
    // paddingHorizontal: 20,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'column',

  },

  sectionTitle: {
    color: '#000000',
    marginBottom: 20,
    letterSpacing: -0.2,
  },

  personCard: {
    width: SCREEN_WIDTH * 0.72,
    marginRight: 16,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 0.5,
  },

  personImage: {
    width: 120,
    height: 120,
    borderRadius: 60,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  personName: {
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },

  designationBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },

  designationText: {
    color: '#5B2CA5',
    fontSize: 11,
  },

  personDescription: {
    marginTop: 16,
  },

  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  keywordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 6,
    marginBottom: 12,
  },

  keywordIcon: {
    marginRight: 6,
  },

  keywordText: {
    color: '#5B2CA5',
    fontSize: 13,
  },

  contactCard: {
    borderRadius: 24,
    // overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
 

    elevation: 1,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactText: {
    color: '#000000',
    marginLeft: 16,
    flex: 1,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 68,
    marginRight: 20,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  footer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  footerText: {
    color: '#6B6B80',
    textAlign: 'center',
    opacity: 0.7,
  },

  footerSubtext: {
    color: '#6B6B80',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.6,
  },
});
