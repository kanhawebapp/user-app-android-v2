/**
 * Notification Store - Zustand
 * Manages notifications, unread count, and notification operations
 */

import {create} from 'zustand';
import type {
  AppNotification,
  GetNotificationsParams,
  ApiMeta,
} from '../types/api.types';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/api/notifications/notification.api';

interface NotificationState {
  // State
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  pagination: ApiMeta | null;

  // Actions
  fetchNotifications: (params?: GetNotificationsParams) => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  pagination: null,

  /**
   * Fetch notifications from API
   */
  fetchNotifications: async (params: GetNotificationsParams = {}) => {
    try {
      set({isLoading: true, error: null});

      const response = await getNotifications(params);

      set({
        notifications: response.items || [],
        pagination: response.meta || null,
        isLoading: false,
        unreadCount: (response.items || []).filter(n => !n.isRead).length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch notifications';
      set({error: errorMessage, isLoading: false});
    }
  },

  /**
   * Refresh notifications (pull-to-refresh)
   */
  refresh: async () => {
    try {
      set({isRefreshing: true, error: null});

      const response = await getNotifications({page: 1});

      set({
        notifications: response.items || [],
        pagination: response.meta || null,
        isRefreshing: false,
        unreadCount: (response.items || []).filter(n => !n.isRead).length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to refresh notifications';
      set({error: errorMessage, isRefreshing: false});
    }
  },

  /**
   * Load more notifications (pagination)
   */
  loadMore: async () => {
    const {pagination, notifications} = get();
    if (!pagination || !pagination.hasMore) {
      return;
    }

    const nextPage = (pagination.page || 1) + 1;

    try {
      const response = await getNotifications({page: nextPage});

      set({
        notifications: [...notifications, ...(response.items || [])],
        pagination: response.meta || pagination,
      });
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    }
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead({notificationId});

      if (response.data?.success && response.data?.data) {
        set(state => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === notificationId ? {...n, isRead: true} : n,
          );
          const newUnreadCount = updatedNotifications.filter(
            n => !n.isRead,
          ).length;

          return {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
          };
        });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.data?.success) {
        set(state => ({
          notifications: state.notifications.map(n => ({...n, isRead: true})),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Clear all notifications and reset state
   */
  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      pagination: null,
      error: null,
    });
  },
}));

export default useNotificationStore;
