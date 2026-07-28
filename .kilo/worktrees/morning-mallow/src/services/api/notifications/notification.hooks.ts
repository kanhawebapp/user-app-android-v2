// ============================================
// DhwaniAstro - Notification Hooks
// ============================================

import {useEffect, useState, useCallback} from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './notification.api';
import type {
  AppNotification,
  GetNotificationsParams,
  GetNotificationsResponse,
} from '../../../types/api.types';

/**
 * Hook to fetch and manage notifications
 * Handles pagination, filtering, and read status
 */
export const useNotifications = (params: GetNotificationsParams = {}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<
    GetNotificationsResponse['pagination']
  >({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(
    async (fetchParams: GetNotificationsParams = params, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await getNotifications(fetchParams);

        setNotifications(response.items || []);
        setPagination(
          response.pagination || {
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch notifications'),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [params],
  );

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Mark a notification as read and update local state
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead({notificationId});
      if (response.data?.success && response.data?.data) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? {...n, isRead: true} : n)),
        );
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }, []);

  /**
   * Mark all notifications as read and update local state
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.data?.success) {
        setNotifications(prev => prev.map(n => ({...n, isRead: true})));
        return response.data;
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh notifications (pull-to-refresh)
   */
  const refresh = useCallback(() => {
    return fetchNotifications({...params, page: 1}, true);
  }, [fetchNotifications, params]);

  /**
   * Load more notifications (pagination)
   */
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      fetchNotifications({...params, page: nextPage});
    }
  }, [pagination.page, pagination.totalPages, fetchNotifications, params]);

  /**
   * Get count of unread notifications
   */
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    refreshing,
    pagination,
    unreadCount,
    fetchNotifications,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
};

/**
 * Hook to get just the unread notification count
 * Optimized for Header component use
 */
export const useNotificationCount = (): number => {
  const {unreadCount} = useNotifications({limit: 1}); // Minimal fetch for count
  return unreadCount;
};

export default useNotifications;
