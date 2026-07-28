
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
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../../../components/Text';
import { Icon } from '../../../components/Icon';
import { Card } from '../../../components/Card';

import { useTheme } from '../../../theme';
import { useAboutPage } from '../../../services/api/about/useAboutPage';
import { GoBack } from '../../../components';

interface AboutScreenProps {
  onNavigateBack?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BASE_URL = 'https://dhwaniastro.com';

const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigateBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { data, loading } = useAboutPage();

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

        <View style={{ marginTop: 10 }}>
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
      {/* <View
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
      </View> */}
      <GoBack onBack={onNavigateBack} title='About Us' />

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
