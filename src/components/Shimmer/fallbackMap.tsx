/**
 * Shimmer Fallback Map
 * Scalable fallback system for Suspense loading states
 * Maps screen keys to their corresponding shimmer components
 */

import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../theme';
import {SkeletonLoader} from '../SkeletonLoader';

// Screen-specific shimmer components
import {
  HomeScreenShimmer,
  ShopScreenShimmer,
  ProfileScreenShimmer,
  ChatScreenShimmer,
  LiveScreenShimmer,
  RemediesScreenShimmer,
} from './screens';

// Types from navigation
import type {MainTabKey} from '../../navigation/mainNavigation/mainNavigator.types';
import type {SidebarScreenKey} from '../../navigation/mainNavigation/mainNavigator.types';

// =============================================================================
// Default Fallback Component
// =============================================================================

/**
 * Default Fallback - Used when no specific shimmer is available
 * Shows a simple loading indicator
 */
export const DefaultFallback: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.defaultFallbackContainer,
        {backgroundColor: colors.background.primary},
      ]}>
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
};

// =============================================================================
// Tab Screen Fallback Map
// =============================================================================

/**
 * Tab screen fallback map
 * Maps MainTabKey to corresponding shimmer components
 */
export const ScreenFallbackMap: Record<MainTabKey, React.ReactNode> = {
  home: <HomeScreenShimmer />,
  chatCall: <ChatScreenShimmer />,
  live: <LiveScreenShimmer />,
  shop: <ShopScreenShimmer />,
  remedies: <RemediesScreenShimmer />,
  myBookings: <ProfileScreenShimmer />,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get fallback component for a tab screen
 * @param tabKey - The active tab key
 * @returns The shimmer component for the tab
 */
export const getTabFallback = (tabKey: MainTabKey): React.ReactNode => {
  return ScreenFallbackMap[tabKey] ?? <DefaultFallback />;
};

/**
 * Get fallback component for a sidebar screen
 * @param sidebarKey - The sidebar screen key
 * @returns The shimmer component for the sidebar screen
 */
export const getSidebarFallback = (
  sidebarKey: SidebarScreenKey,
): React.ReactNode => {
  if (!sidebarKey) {
    return <DefaultFallback />;
  }
  return SidebarFallbackMap[sidebarKey] ?? <DefaultFallback />;
};

// =============================================================================
// Sidebar Screen Shimmer Components (defined before map)
// =============================================================================

/**
 * WalletScreenShimmer - Placeholder for Wallet screen
 */
const WalletScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.walletHeader}>
        <SkeletonLoader
          width={120}
          height={32}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <SkeletonLoader
          width={160}
          height={48}
          borderRadius={8}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>
      <View style={styles.walletButtons}>
        {[1, 2].map(i => (
          <SkeletonLoader
            key={i}
            width="48%"
            height={44}
            borderRadius={22}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * SessionHistoryScreenShimmer - Placeholder for Session History screen
 */
const SessionHistoryScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.sessionItem}>
          <SkeletonLoader
            width={50}
            height={50}
            borderRadius={25}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.sessionContent}>
            <SkeletonLoader
              width="70%"
              height={16}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={{height: 8}} />
            <SkeletonLoader
              width="40%"
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * ChatHistoryScreenShimmer - Placeholder for Chat History screen
 */
const ChatHistoryScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.sessionItem}>
          <SkeletonLoader
            width={50}
            height={50}
            borderRadius={25}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.sessionContent}>
            <SkeletonLoader
              width="70%"
              height={16}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={{height: 8}} />
            <SkeletonLoader
              width="40%"
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * MyFollowingScreenShimmer - Placeholder for My Following screen
 */
const MyFollowingScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.followingHeader}>
        <SkeletonLoader
          width={150}
          height={24}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>
      <View style={styles.followingGrid}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <View key={i} style={styles.followingItem}>
            <SkeletonLoader
              width={70}
              height={70}
              borderRadius={35}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={{height: 8}} />
            <SkeletonLoader
              width={60}
              height={10}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * FreeServicesScreenShimmer - Placeholder for Free Services screen
 */
const FreeServicesScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.serviceItem}>
          <SkeletonLoader
            width={60}
            height={60}
            borderRadius={12}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.serviceContent}>
            <SkeletonLoader
              width="80%"
              height={16}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={{height: 8}} />
            <SkeletonLoader
              width="60%"
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * SupportScreenShimmer - Placeholder for Support screen
 */
const SupportScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <SkeletonLoader
        width={200}
        height={24}
        borderRadius={4}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={{height: 20}} />
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.supportItem}>
          <SkeletonLoader
            width={40}
            height={40}
            borderRadius={8}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.supportContent}>
            <SkeletonLoader
              width="70%"
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * SettingsScreenShimmer - Placeholder for Settings screen
 */
const SettingsScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <View key={i} style={styles.settingsItem}>
          <SkeletonLoader
            width={24}
            height={24}
            borderRadius={4}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.settingsContent}>
            <SkeletonLoader
              width="60%"
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
          <SkeletonLoader
            width={24}
            height={24}
            borderRadius={12}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>
      ))}
    </View>
  );
};

/**
 * AboutScreenShimmer - Placeholder for About screen
 */
const AboutScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.aboutHeader}>
        <SkeletonLoader
          width={100}
          height={100}
          borderRadius={50}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <View style={{height: 16}} />
        <SkeletonLoader
          width={180}
          height={24}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <View style={{height: 8}} />
        <SkeletonLoader
          width={140}
          height={14}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>
      <View style={styles.aboutContent}>
        {[1, 2, 3].map(i => (
          <SkeletonLoader
            key={i}
            width="100%"
            height={14}
            borderRadius={4}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * DailyPujaScreenShimmer - Placeholder for Daily Puja screen
 */
const DailyPujaScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <SkeletonLoader
        width="100%"
        height={200}
        borderRadius={12}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={{height: 16}} />
      <SkeletonLoader
        width="80%"
        height={20}
        borderRadius={4}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={{height: 12}} />
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.pujaItem}>
          <SkeletonLoader
            width={50}
            height={50}
            borderRadius={8}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
          <View style={styles.pujaContent}>
            <SkeletonLoader
              width="70%"
              height={14}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * GameScreenShimmer - Placeholder for Game screen
 */
const GameScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <SkeletonLoader
        width="100%"
        height={300}
        borderRadius={16}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={{height: 20}} />
      <View style={styles.gameButtons}>
        {[1, 2].map(i => (
          <SkeletonLoader
            key={i}
            width="45%"
            height={48}
            borderRadius={24}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        ))}
      </View>
    </View>
  );
};

// =============================================================================
// Sidebar Screen Fallback Map (defined after all shimmer components)
// =============================================================================

/**
 * Sidebar screen fallback map
 * Maps SidebarScreenKey to corresponding shimmer components
 * Note: Most sidebar screens use ProfileScreenShimmer as placeholder
 */
export const SidebarFallbackMap: Record<
  Exclude<SidebarScreenKey, null>,
  React.ReactNode
> = {
  profile: <ProfileScreenShimmer />,
  wallet: <WalletScreenShimmer />,
  session_history: <SessionHistoryScreenShimmer />,
  chat_history: <ChatHistoryScreenShimmer />,
  my_following: <MyFollowingScreenShimmer />,
  free_services: <FreeServicesScreenShimmer />,
  support: <SupportScreenShimmer />,
  settings: <SettingsScreenShimmer />,
  about: <AboutScreenShimmer />,
  daily_puja: <DailyPujaScreenShimmer />,
  game: <GameScreenShimmer />,
  edit_profile: <ProfileScreenShimmer />,
  faq: <ProfileScreenShimmer />,
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  defaultFallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletHeader: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  walletButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionContent: {
    marginLeft: 12,
    flex: 1,
  },
  followingHeader: {
    marginBottom: 16,
  },
  followingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  followingItem: {
    alignItems: 'center',
    marginBottom: 16,
    width: '31%',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceContent: {
    marginLeft: 12,
    flex: 1,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  supportContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsContent: {
    marginLeft: 12,
    flex: 1,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutContent: {
    gap: 12,
  },
  pujaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  pujaContent: {
    marginLeft: 12,
    flex: 1,
  },
  gameButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default {
  ScreenFallbackMap,
  SidebarFallbackMap,
  DefaultFallback,
  getTabFallback,
  getSidebarFallback,
};
