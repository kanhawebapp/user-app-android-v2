/**
 * ChatScreenShimmer Component
 * Layout-based shimmer loader for ChatScreen
 * Matches: Chat bubbles left/right
 */

import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {useTheme} from '../../../theme';
import {SkeletonLoader} from '../../SkeletonLoader';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHAT_BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.75;

export const ChatScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background.primary}]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Chat Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <SkeletonLoader
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />

          {/* Avatar */}
          <View style={styles.headerAvatarContainer}>
            <SkeletonLoader
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>

          {/* Name & Status */}
          <View style={styles.headerInfo}>
            <SkeletonLoader
              width={120}
              height={16}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.headerInfoSpacer} />
            <SkeletonLoader
              width={80}
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>

          {/* Call Buttons */}
          <View style={styles.callButtons}>
            <SkeletonLoader
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.callButtonSpacer} />
            <SkeletonLoader
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      </View>

      {/* Chat Messages Area */}
      <View style={styles.messagesContainer}>
        {/* Message 1 - Left (Received) */}
        <View style={styles.messageRowLeft}>
          <View style={styles.messageBubbleLeft}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.7}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.messageLineSpacer} />
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.5}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Message 2 - Right (Sent) */}
        <View style={styles.messageRowRight}>
          <View
            style={[
              styles.messageBubbleRight,
              {backgroundColor: colors.skeleton.base},
            ]}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.6}
              height={14}
              borderRadius={4}
              backgroundColor={colors.common.gray[300]}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.messageLineSpacer} />
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.8}
              height={14}
              borderRadius={4}
              backgroundColor={colors.common.gray[300]}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Message 3 - Left (Received) */}
        <View style={styles.messageRowLeft}>
          <View style={styles.messageBubbleLeft}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.65}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Message 4 - Right (Sent) */}
        <View style={styles.messageRowRight}>
          <View
            style={[
              styles.messageBubbleRight,
              {backgroundColor: colors.skeleton.base},
            ]}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.4}
              height={14}
              borderRadius={4}
              backgroundColor={colors.common.gray[300]}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Message 5 - Left (Received) */}
        <View style={styles.messageRowLeft}>
          <View style={styles.messageBubbleLeft}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.75}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.messageLineSpacer} />
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.55}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.messageLineSpacer} />
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.3}
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Message 6 - Right (Sent) */}
        <View style={styles.messageRowRight}>
          <View
            style={[
              styles.messageBubbleRight,
              {backgroundColor: colors.skeleton.base},
            ]}>
            <SkeletonLoader
              width={CHAT_BUBBLE_MAX_WIDTH * 0.7}
              height={14}
              borderRadius={4}
              backgroundColor={colors.common.gray[300]}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>

        {/* Typing Indicator Placeholder */}
        <View style={styles.messageRowLeft}>
          <View style={styles.messageBubbleLeft}>
            <View style={styles.typingIndicator}>
              {[1, 2, 3].map(dot => (
                <View key={`typing-dot-${dot}`} style={styles.typingDot}>
                  <SkeletonLoader
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor={colors.skeleton.base}
                    shimmerColor={colors.skeleton.highlight}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <SkeletonLoader
            width={SCREEN_WIDTH - 120}
            height={44}
            borderRadius={22}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.inputButtonSpacer} />
          <SkeletonLoader
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarContainer: {
    marginLeft: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerInfoSpacer: {
    height: 4,
  },
  callButtons: {
    flexDirection: 'row',
  },
  callButtonSpacer: {
    width: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  messageRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  messageBubbleLeft: {
    maxWidth: CHAT_BUBBLE_MAX_WIDTH,
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  messageBubbleRight: {
    maxWidth: CHAT_BUBBLE_MAX_WIDTH,
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  messageLineSpacer: {
    height: 6,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    marginRight: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputButtonSpacer: {
    width: 8,
  },
});

export default ChatScreenShimmer;
