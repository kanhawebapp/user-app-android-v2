import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../../../components/Text';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { GoBack } from '../../../components';

import { useTheme } from '../../../theme';
import { useFollowedAstrologers } from '../../../services/api/followedastrologersList/useFollowedAstrologers';
import { API_BASE_URL } from '../../../constants/api.constants';
import { ConsultationFlowLayer } from '../../../screens/main/consultation';
import { Astrologer } from '../../../screens/main/chatcall/types';
import { getAstrologerStatus } from '../../../screens/main/chat/utils/astrologerStatus';

// AstrologerProfileScreen
interface MyFollowingScreenProps {
  onNavigateBack?: () => void;
  onAstrologerPress: any
}

const MyFollowingScreen: React.FC<MyFollowingScreenProps> = ({
  onNavigateBack,
  onAstrologerPress
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {
    data,
    loading,
    hasMore,
    loadMore,
  } = useFollowedAstrologers();


  return (
    <ConsultationFlowLayer>
      {({ startChat, startCall }) => {
        const mapAstrologer = (item: any): Astrologer => {
          const chatPricing = item.pricing?.find((p: any) => p.type === 'CHAT');
          const callPricing = item.pricing?.find((p: any) => p.type === 'CALL');

          return {
            id: item.id,
            name: item.displayName || item.name,
            displayName: item.displayName,
            rating: item.rating || 0,
            reviewCount: 0,
            experience: `${item.experience}+ years`,
            languages: item.languages || [],
            skills: item.skills || [],
            image: item.profilePic,
            availability: 'online',
            // isAvailableForChat: true,
            // isAvailableForCall: true,
            chatRate: chatPricing?.price || 0,
            callRate: callPricing?.price || 0,
            activeOffer: item.activeOffer || null,
            pricing: item.pricing || [],
            isBusy: item?.isBusy,
            isCallActive: item?.isCallActive,
            isChatActive: item?.isChatActive,
            isAvailableForCall: item?.isAvailableForCall,
            isAvailableForChat: item?.isAvailableForChat,
            isLiveActive: item?.isLiveActive,
            isOnline: item?.isOnline,
          };
        };



        return (
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.background.primary,
              },
            ]}>
            <StatusBar
              barStyle={
                theme.isDark
                  ? 'light-content'
                  : 'dark-content'
              }
              backgroundColor={
                colors.background.primary
              }
            />

            <GoBack
              onBack={onNavigateBack}
              title="My Following"
            />

            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingBottom:
                    insets.bottom + 100,
                },
              ]}
              showsVerticalScrollIndicator={
                false
              }>
              {/* Count */}
              <View
                style={styles.countContainer}>
                <Text
                  variant="body"
                  style={{
                    color:
                      colors.text.secondary,
                  }}>
                  You are following{' '}
                  <Text
                    variant="body"
                    weight="bold"
                    style={{
                      color:
                        colors.primary.main,
                    }}>
                    {data.length}
                  </Text>{' '}
                  astrologers
                </Text>
              </View>

              {/* Loading */}
              {loading && (
                <View
                  style={
                    styles.loaderContainer
                  }>
                  <ActivityIndicator
                    size="large"
                    color={
                      colors.primary.main
                    }
                  />
                </View>
              )}

              {/* List */}
              {!loading &&
                data.map(astrologer => {
                  const chatPricing =
                    astrologer.pricing?.find(
                      item =>
                        item.type ===
                        'CHAT',
                    );

                  const callPricing =
                    astrologer.pricing?.find(
                      item =>
                        item.type ===
                        'CALL',
                    );

                  const imageUrl =
                    astrologer.profilePic
                      ? astrologer.profilePic.startsWith(
                        'http',
                      )
                        ? astrologer.profilePic
                        : `${API_BASE_URL.DEVELOPMENT}${astrologer.profilePic}`
                      : '';

                  const mappedAstrologer = mapAstrologer(astrologer);

                  const {
                    status,
                    color: indicatorColor,
                    canChat,
                    canCall,
                  } = getAstrologerStatus(astrologer);
                  // console.log("astrologer inmy follow",astrologer)
                  return (
                    <Card
                      key={astrologer.id}
                      style={
                        styles.astrologerCard
                      }
                      onPress={() => {
                        console.log('[MyFollowingScreen] Card pressed:', {
                          astrologerId: astrologer?.id,
                          astrologerName:
                            astrologer?.displayName ||
                            astrologer?.name,
                        });
                        console.log('[MyFollowingScreen] calling onAstrologerPress');
                        onAstrologerPress(astrologer);
                      }}
                    >
                      <View
                        style={
                          styles.astrologerHeader
                        }>
                        {/* Avatar */}
                        <View
                          style={
                            styles.avatarContainer
                          }>
                          {imageUrl ? (
                            <Image
                              source={{
                                uri: imageUrl,
                              }}
                              style={
                                styles.avatar
                              }
                            />
                          ) : (
                            <View
                              style={[
                                styles.avatar,
                                {
                                  backgroundColor:
                                    colors
                                      .primary
                                      .light +
                                    '30',
                                },
                              ]}>
                              <Icon
                                name="person"
                                size={32}
                                color={
                                  colors
                                    .primary
                                    .main
                                }
                                library="MaterialIcons"
                              />
                            </View>
                          )}

                          <View
                            style={[
                              styles.onlineIndicator,
                              {
                                backgroundColor: indicatorColor
                                // colors
                                //   .success
                                //   .main,
                              },
                            ]}
                          />
                        </View>

                        {/* Info */}
                        <View
                          style={
                            styles.astrologerInfo
                          }>
                          <View>
                            <Text
                              variant="body"
                              weight="semibold"
                              style={{
                                color:
                                  colors
                                    .text
                                    .primary,
                              }}>
                              {astrologer.displayName ||
                                astrologer.name ||
                                'Astrologer'}
                            </Text>

                            {/* <Text
                              variant="captionSmall"
                              style={{
                                color:
                                  colors
                                    .text
                                    .secondary,
                                marginTop: 2,
                              }}>
                              Astrology Expert
                            </Text> */}

                            <View
                              style={
                                styles.metaRow
                              }>
                              <View
                                style={
                                  styles.metaItem
                                }>
                                <Icon
                                  name="star"
                                  size={14}
                                  color={
                                    colors
                                      .common
                                      .yellow[500]
                                  }
                                  library="MaterialIcons"
                                />

                                <Text
                                  variant="captionSmall"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                    marginLeft: 2,
                                  }}>
                                {Number(astrologer.rating ?? 0).toFixed(1)}
                                </Text>
                              </View>

                              <View
                                style={
                                  styles.metaItem
                                }>
                                <Icon
                                  name="work-outline"
                                  size={14}
                                  color={
                                    colors
                                      .text
                                      .secondary
                                  }
                                  library="MaterialIcons"
                                />

                                <Text
                                  variant="captionSmall"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                    marginLeft: 2,
                                  }}>
                                  {
                                    astrologer.experience
                                  }{' '}
                                  yrs
                                </Text>
                              </View>
                            </View>

                            {Array.isArray(mappedAstrologer.skills) &&
                              mappedAstrologer.skills.length > 0 && (
                                <View
                                  style={
                                    styles.skillsRow
                                  }>
                                  {mappedAstrologer.skills
                                    .slice(
                                      0,
                                      3,
                                    )
                                    .map(
                                      (skill: any, idx: number) => (
                                        <View
                                          key={`${skill}-${idx}`}
                                          style={
                                            styles.skillChip
                                          }>
                                          <Text
                                            variant="captionSmall"
                                            style={{
                                              color:
                                                colors.primary.main,

                                            }}>
                                            {skill}
                                          </Text>
                                        </View>
                                      ),
                                    )}

                                  {mappedAstrologer.skills
                                    .length > 3 && (
                                      <View
                                        style={
                                          styles.skillChip
                                        }>
                                        <Text
                                          variant="captionSmall"
                                          style={{
                                            color:
                                              colors
                                                .primary.main,
                                          }}>
                                          +more
                                        </Text>
                                      </View>
                                    )}
                                </View>
                              )}
                          </View>
                        </View>

                        <View
                          style={
                            styles.moreButton
                          }>
                          <Icon
                            name="favorite"
                            size={22}
                            color={
                              colors
                                .primary.main
                            }
                            library="MaterialIcons"
                          />
                        </View>
                      </View>

                      {/* Bottom */}
                      <View
                        style={[
                          styles.actionRow,
                          {
                            borderTopColor:
                              colors.border
                                .light,
                          },
                        ]}>

                        {/* <View
                          style={
                            styles.actionButtons
                          }>
                          <Button
                            title={`Chat ₹${chatPricing?.price ||
                              0
                              }`}
                            disabled={!canChat}
                            textStyle={{
                              color: colors.primary.main,

                            }}
                            variant="primary"
                            size="small"
                            onPress={() => startChat(mappedAstrologer)}
                            style={{
                              marginRight: 8,
                              width: '48%',
                              backgroundColor: canChat ? 'transparent' : '#00000010',
                              borderColor: colors.primary.main,
                              borderWidth: 1,
                            }}
                          />

                          <Button
                            title={`Call ₹${callPricing?.price ||
                              0
                              }`}
                            disabled={!canCall}
                            textStyle={{
                              color: colors.primary.main,
                            }}
                            variant="outline"
                            size="small"
                            onPress={() => startCall(mappedAstrologer)}
                            style={{
                              width: '48%',
                              backgroundColor: canCall ? 'transparent' : '#00000010',
                              borderColor: colors.primary.main,
                              borderWidth: 1,
                            }}
                          />
                        </View> */}
                      </View>
                    </Card>
                  );
                })}

              {/* Empty */}
              {!loading &&
                data.length === 0 && (
                  <View
                    style={
                      styles.emptyState
                    }>
                    <Icon
                      name="favorite-border"
                      size={64}
                      color={
                        colors.icon
                          .tertiary
                      }
                      library="MaterialIcons"
                    />

                    <Text
                      variant="h6"
                      weight="semibold"
                      style={{
                        color:
                          colors.text
                            .secondary,
                        marginTop: 16,
                      }}>
                      No Following Yet
                    </Text>

                    <Text
                      variant="body"
                      style={{
                        color:
                          colors.text
                            .tertiary,
                        marginTop: 8,
                        textAlign:
                          'center',
                      }}>
                      Start following
                      astrologers to see
                      them here
                    </Text>
                  </View>
                )}

              {/* Load More */}
              {hasMore &&
                !loading && (
                  <Button
                    title="Load More"
                    variant="outline"
                    onPress={loadMore}
                    style={{
                      marginTop: 16,
                    }}
                  />
                )}
            </ScrollView>
          </View>
        );
      }}
    </ConsultationFlowLayer>
  );
};

export default MyFollowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
  },

  countContainer: {
    marginBottom: 16,
  },

  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  astrologerCard: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 20,

  },

  astrologerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },

  astrologerInfo: {
    flex: 1,
    marginLeft: 14,
    paddingTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
    marginBottom: 6,
  },

  moreButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionButtons: {
    flexDirection: 'row',
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
});