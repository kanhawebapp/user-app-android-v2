import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useTheme} from '../../../theme';
import {Icon} from '../../../components/Icon';
import {ChatRequestModal, ChatRequestData} from '../../../components/Modal';
import images from '../../../assets/images';
import {styles} from './styles';
import type {AstrologerProfileScreenProps} from './types';

const AstrologerProfileScreen: React.FC<AstrologerProfileScreenProps> = ({
  astrologer,
  onBack,
  onChatPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChatPress = useCallback(() => {
    setShowChatRequestModal(true);
  }, []);

  const handleChatRequestSubmit = useCallback(
    async (_data: ChatRequestData) => {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setShowChatRequestModal(false);
      onChatPress?.(astrologer);
    },
    [astrologer, onChatPress],
  );

  const getAvailabilityColor = () => {
    switch (astrologer.__typename) {
      default:
        return '#4CAF50';
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, {borderBottomColor: colors.border.light}]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="Ionicons"
          />
          <Text style={[styles.backText, {color: colors.text.primary}]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, {borderColor: colors.primary.light}]}>
              <Image
                source={
                  astrologer.profilePic &&
                  !astrologer.profilePic.includes('example.com')
                    ? {uri: astrologer.profilePic}
                    : images.mam
                }
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: getAvailabilityColor(),
                  borderColor: colors.common.white,
                },
              ]}
            />
          </View>

          <Text style={[styles.name, {color: colors.text.primary}]}>
            {astrologer.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={[styles.starIcon, {color: colors.warning.main}]}>
              ★
            </Text>
            <Text style={[styles.ratingText, {color: colors.text.primary}]}>
              {astrologer.rating.toFixed(1)}
            </Text>
          </View>

          <Text style={[styles.experienceText, {color: colors.text.secondary}]}>
            {astrologer.experience} years of experience
          </Text>
        </View>

        {/* Pricing Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, {color: colors.text.primary}]}>
            Session Details
          </Text>
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.light,
              },
            ]}>
            <View
              style={[
                styles.infoRow,
                {borderBottomColor: colors.border.light},
              ]}>
              <Text style={[styles.infoLabel, {color: colors.text.secondary}]}>
                Chat Rate
              </Text>
              <Text style={[styles.infoValue, {color: colors.primary.main}]}>
                ₹{astrologer.price}/min
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, {color: colors.text.secondary}]}>
                Languages
              </Text>
              <Text
                style={[styles.infoValue, {color: colors.text.primary}]}
                numberOfLines={1}>
                {astrologer.languages.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, {color: colors.text.primary}]}>
            Skills
          </Text>
          <View style={styles.skillsContainer}>
            {astrologer.skills.map((skill, index) => (
              <View
                key={index}
                style={[
                  styles.skillBadge,
                  {backgroundColor: colors.primary.light + '20'},
                ]}>
                <Text style={[styles.skillText, {color: colors.primary.main}]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, {color: colors.text.primary}]}>
            Languages
          </Text>
          <View style={styles.languagesContainer}>
            {astrologer.languages.map((language, index) => (
              <View
                key={index}
                style={[
                  styles.languageBadge,
                  {backgroundColor: colors.background.secondary},
                ]}>
                <Text
                  style={[styles.languageText, {color: colors.text.primary}]}>
                  {language}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.chatButton, {backgroundColor: colors.primary.main}]}
          onPress={handleChatPress}
          activeOpacity={0.8}>
          <Icon
            name="chatbubble-ellipses-outline"
            size={20}
            color={colors.primary.contrastText}
            library="Ionicons"
          />
          <Text
            style={[
              styles.chatButtonText,
              {color: colors.primary.contrastText},
            ]}>
            Start Chat - ₹{astrologer.price}/min
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat Request Modal */}
      <ChatRequestModal
        visible={showChatRequestModal}
        onClose={() => setShowChatRequestModal(false)}
        onSubmit={handleChatRequestSubmit}
        astrologerName={astrologer.name}
        loading={isSubmitting}
      />
    </View>
  );
};

export default AstrologerProfileScreen;
