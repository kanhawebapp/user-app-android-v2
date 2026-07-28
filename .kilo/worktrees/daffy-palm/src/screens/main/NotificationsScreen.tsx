import React, {useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Text as RNText,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {useNotificationStore} from '../../stores/notification.store';
import type {AppNotification} from '../../types/api.types';
import {NotificationType} from '../../types/global.types';

interface NotificationsScreenProps {
  onNavigateBack?: () => void;
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

/**
 * Get icon and color for notification type
 */
const getNotificationIcon = (
  type: NotificationType,
  colors: any,
): {name: string; library: 'MaterialIcons' | 'Ionicons'; color: string} => {
  switch (type) {
    case 'chat_message':
      return {
        name: 'chat',
        library: 'MaterialIcons',
        color: colors.primary.main,
      };
    case 'call_incoming':
      return {
        name: 'call',
        library: 'MaterialIcons',
        color: colors.success.main,
      };
    case 'wallet_low':
      return {
        name: 'account-balance-wallet',
        library: 'MaterialIcons',
        color: colors.warning.main,
      };
    case 'wallet_recharge':
      return {
        name: 'credit-card',
        library: 'MaterialIcons',
        color: colors.success.main,
      };
    case 'session_ended':
      return {
        name: 'check-circle',
        library: 'MaterialIcons',
        color: colors.info.main,
      };
    case 'review_request':
      return {
        name: 'rate-review',
        library: 'MaterialIcons',
        color: colors.warning.main,
      };
    case 'promotional':
      return {
        name: 'local-offer',
        library: 'MaterialIcons',
        color: colors.secondary.main,
      };
    case 'astro_live':
      return {
        name: 'live-tv',
        library: 'MaterialIcons',
        color: colors.error.main,
      };
    default:
      return {
        name: 'notifications',
        library: 'MaterialIcons',
        color: colors.text.secondary,
      };
  }
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onNavigateBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {
    notifications,
    isLoading,
    error,
    isRefreshing,
    unreadCount,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  /**
   * Handle notification press - mark as read and perform action based on type
   */
  const handleNotificationPress = useCallback(
    async (notification: AppNotification) => {
      if (!notification.isRead) {
        try {
          await markAsRead(notification.id);
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }

      // Handle deep linking or navigation based on notification type
      // This can be extended based on notification.data
      // For now, just mark as read
    },
    [markAsRead],
  );

  /**
   * Handle mark all as read
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [markAllAsRead]);

  /**
   * Render individual notification item
   */
  const renderNotificationItem = useCallback(
    ({item, index}: {item: AppNotification; index: number}) => {
      const iconInfo = getNotificationIcon(
        item.type as NotificationType,
        colors,
      );
      const isUnread = !item.isRead;

      return (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.notificationItem,
            isUnread && styles.unreadNotification,
            isUnread && {backgroundColor: colors.primary.light + '05'},
          ]}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
          accessibilityRole="button">
          <View style={styles.notificationIconContainer}>
            <Icon
              name={iconInfo.name}
              size={24}
              color={iconInfo.color}
              library={iconInfo.library}
            />
            {isUnread && (
              <View
                style={[
                  styles.unreadDot,
                  {backgroundColor: colors.primary.main},
                ]}
              />
            )}
          </View>

          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text
                variant="body"
                weight={isUnread ? 'semibold' : 'regular'}
                style={[
                  styles.notificationTitle,
                  {color: colors.text.primary},
                  // isUnread && {color: colors.text.primary},
                ]}
                numberOfLines={1}>
                {item.title}
              </Text>
              <Text
                variant="caption"
                style={{color: colors.text.secondary, marginLeft: 8}}>
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
            <Text
              variant="bodySmall"
              style={[styles.notificationBody, {color: colors.text.secondary}]}
              numberOfLines={2}>
              {item.body}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, handleNotificationPress],
  );

  /**
   * Render empty state when no notifications
   */
  const renderEmptyState = useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <Icon
          name="notifications-none"
          size={80}
          color={colors.icon.tertiary}
          library="MaterialIcons"
        />
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.secondary, marginTop: 16}}>
          No Notifications
        </Text>
        <Text
          variant="body"
          style={{
            color: colors.text.tertiary,
            marginTop: 8,
            textAlign: 'center',
          }}>
          You're all caught up! When you get notifications, they'll show up
          here.
        </Text>
      </View>
    );
  }, [colors]);

  /**
   * Render loading state
   */
  const renderLoadingState = useMemo(() => {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="body" style={{color: colors.text.secondary}}>
          Loading notifications...
        </Text>
      </View>
    );
  }, [colors]);

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background.primary,
            paddingTop: insets.top,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border.light,
          },
        ]}>
        <TouchableOpacity
          onPress={onNavigateBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary}}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text variant="captionSmall" style={{color: colors.primary.main}}>
                {unreadCount} unread
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markReadButton}
            accessibilityRole="button"
            accessibilityLabel="Mark all as read">
            <Text
              variant="bodySmall"
              weight="semibold"
              style={{color: colors.primary.main}}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.placeholder} />
      </View>

      {/* Notification List */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 20},
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }>
        {error ? (
          <View style={styles.errorContainer}>
            <Icon
              name="error-outline"
              size={64}
              color={colors.error.main}
              library="MaterialIcons"
            />
            <Text
              variant="body"
              style={{color: colors.error.main, marginTop: 12}}>
              Failed to load notifications
            </Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                {backgroundColor: colors.primary.main},
              ]}
              onPress={refresh}>
              <Text
                variant="bodySmall"
                weight="semibold"
                style={{color: colors.common.white}}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 && !isLoading ? (
          renderEmptyState
        ) : (
          renderEmptyState
        )}

        {isLoading && !isRefreshing && renderLoadingState}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    minHeight: 56,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  badgeContainer: {
    marginTop: 2,
  },
  markReadButton: {
    padding: 8,
    marginRight: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  unreadNotification: {
    // Additional styling for unread state
  },
  notificationIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  notificationBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 68,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default NotificationsScreen;
