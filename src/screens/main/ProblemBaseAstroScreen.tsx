import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';
import { ProblemCategory } from './home/types';
import { useAstrologers } from '../../services/api/recomandedAstrologer/astrologer.hooks';
import { AstrologerCard } from './chatcall/components/AstrologerCard';
import { Astrologer } from './chatcall/types';
import { ConsultationFlowLayer } from './consultation';
import { GoBack } from '../../components';

const CATEGORY_SKILL_MAP: Record<string, string[]> = {
  Career: ['Palmistry'],
  Love: ['Tarot'],
  Marriage: ['Tarot'],
  Education: ['Palmistry'],
  Finance: ['Palmistry'],
  Health: ['Palmistry'],
};

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

const ProblemAstrologerCard: React.FC<{
  astrologer: Astrologer;
  onChatPress: (astrologer: Astrologer) => void;
  onCallPress: (astrologer: Astrologer) => void;
}> = ({ astrologer, onChatPress, onCallPress }) => (
  <AstrologerCard
    astrologer={astrologer}
    activeTab="chat"
    onChatPress={onChatPress}
    onCallPress={onCallPress}
  />
);


export const ProblemBaseAstroScreen: React.FC<{
  category: ProblemCategory;
  onBack: () => void;
}> = ({ category, onBack }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const { data = [] } = useAstrologers();

  const filteredAstrologers = useMemo(() => {
    const categorySkills = CATEGORY_SKILL_MAP[category.title] || [];

    return data
      .filter(astrologer =>
        astrologer.skills?.some(skill => categorySkills.includes(skill)),
      )
      .map(mapAstrologer);
  }, [data, category.title]);

  // filteredAstrologers


  return (
    <ConsultationFlowLayer>
      {({ startChat, startCall }) => {
        const renderAstrologer = ({ item }: { item: Astrologer }) => (
          <ProblemAstrologerCard
            astrologer={item}
            onChatPress={startChat}
            onCallPress={startCall}
          />
        );

        return (
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.background.primary,
              },
            ]}>
            <StatusBar
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
              backgroundColor={colors.background.primary}
            />

            {/* <View
              style={[
                styles.header,
                {
                  borderBottomColor: colors.divider,
                },
              ]}>
              <TouchableOpacity onPress={onBack}>
                <Text
                  style={[
                    styles.backButton,
                    {
                      color: colors.primary.main,
                    },
                  ]}>
                  Back
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text.primary,
                  },
                ]}>
                {category.title}
              </Text>
            </View> */}
            <GoBack onBack={onBack} title={`${category.title} Astrologers`} />

            <View
              style={[
                styles.banner,
                {
                  backgroundColor: category.color + '20',
                },
              ]}>
              <Text style={[styles.bannerTitle, { color: category.color }]}>
                Best Astrologers for {category.title}
              </Text>

              <Text
                style={[
                  styles.bannerSubTitle,
                  {
                    color: colors.text.secondary,
                  },
                ]}>
                {filteredAstrologers.length} astrologers available
              </Text>
            </View>

            <FlatList
              data={filteredAstrologers}
              keyExtractor={item => item.id}
              renderItem={renderAstrologer}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text
                    style={{
                      color: colors.text.secondary,
                    }}>
                    No astrologers found for this category.
                  </Text>
                </View>
              )}
            />
          </View>
        );
      }}
    </ConsultationFlowLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },

  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
  },

  banner: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  bannerSubTitle: {
    marginTop: 6,
    fontSize: 14,
  },

  listContent: {
    padding: 16,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
});

