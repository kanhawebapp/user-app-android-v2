// ============================================
// DhwaniAstro - Notification API Service
// ============================================

/**
 * API service for fetching and managing notifications
 * Uses REST endpoints as defined in api.constants.ts
 */

import {api} from '../axios.instance';
import {NOTIFICATIONS, PAGINATION} from '../../../constants/api.constants';
import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkNotificationReadParams,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  GetNotificationPreferencesParams,
  GetNotificationPreferencesResponse,
  UpdateNotificationPreferencesParams,
  UpdateNotificationPreferencesResponse,
} from '../../../types/api.types';
import loggingService from '../../logging';

export const getNotifications = async (
  params: GetNotificationsParams = {},
): Promise<GetNotificationsResponse> => {
  try {
    loggingService.info('[NotificationAPI] Fetching notifications...', {
      params,
    });

    const response = await api.get<GetNotificationsResponse>(
      NOTIFICATIONS.LIST,
      {
        params: {
          page: params.page ?? PAGINATION.DEFAULT_PAGE,
          limit: params.limit ?? PAGINATION.DEFAULT_LIMIT,
          unreadOnly: params.unreadOnly,
        },
      },
    );

    if (response.data?.success && response.data?.data) {
      loggingService.info(
        '[NotificationAPI] Notifications fetched successfully',
        {
          count: response.data.data.items?.length || 0,
        },
      );
      return response.data.data;
    }

    // throw new Error(
    //   response.data?.error?.message || 'Failed to fetch notifications',
    // );
  } catch (error) {
    loggingService.log('[NotificationAPI] Failed to fetch notifications', {
      error,
    });
    throw error;
  }
};

/**
 * Mark a single notification as read
 * @param notificationId - ID of the notification to mark as read
 * @returns Promise resolving to updated notification
 */
export const markNotificationAsRead = async (
  params: MarkNotificationReadParams,
): Promise<MarkNotificationReadResponse> => {
  try {
    loggingService.info('[NotificationAPI] Marking notification as read', {
      notificationId: params.notificationId,
    });

    const response = await api.post<MarkNotificationReadResponse>(
      NOTIFICATIONS.MARK_READ.replace(':notificationId', params.notificationId),
      {},
    );

    if (response.data?.success) {
      loggingService.info('[NotificationAPI] Notification marked as read');
      return response.data;
    }

    throw new Error(
      response.data?.error?.message || 'Failed to mark notification as read',
    );
  } catch (error) {
    loggingService.error(
      '[NotificationAPI] Failed to mark notification as read',
      {
        error,
      },
    );
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns Promise resolving to count of marked notifications
 */
export const markAllNotificationsAsRead =
  async (): Promise<MarkAllNotificationsReadResponse> => {
    try {
      loggingService.info(
        '[NotificationAPI] Marking all notifications as read',
      );

      const response = await api.post<MarkAllNotificationsReadResponse>(
        NOTIFICATIONS.MARK_ALL_READ,
        {},
      );

      if (response.data?.success) {
        loggingService.info(
          '[NotificationAPI] All notifications marked as read',
          {
            count: response.data.data?.count,
          },
        );
        return response.data;
      }

      throw new Error(
        response.data?.error?.message ||
          'Failed to mark all notifications as read',
      );
    } catch (error) {
      loggingService.error(
        '[NotificationAPI] Failed to mark all notifications as read',
        {
          error,
        },
      );
      throw error;
    }
  };

/**
 * Get notification preferences for the user
 * @param params - User ID parameter
 * @returns Promise resolving to notification preferences
 */
export const getNotificationPreferences = async (
  params: GetNotificationPreferencesParams,
): Promise<GetNotificationPreferencesResponse> => {
  try {
    loggingService.info('[NotificationAPI] Fetching notification preferences', {
      userId: params.userId,
    });

    const response = await api.get<GetNotificationPreferencesResponse>(
      NOTIFICATIONS.PREFERENCES,
      {
        params: {userId: params.userId},
      },
    );

    if (response.data?.success && response.data?.data) {
      loggingService.info('[NotificationAPI] Preferences fetched successfully');
      return response.data;
    }

    throw new Error(
      response.data?.error?.message ||
        'Failed to fetch notification preferences',
    );
  } catch (error) {
    loggingService.error(
      '[NotificationAPI] Failed to fetch notification preferences',
      {
        error,
      },
    );
    throw error;
  }
};

/**
 * Update notification preferences
 * @param params - Update parameters containing userId and preferences
 * @returns Promise resolving to updated preferences
 */
export const updateNotificationPreferences = async (
  params: UpdateNotificationPreferencesParams,
): Promise<UpdateNotificationPreferencesResponse> => {
  try {
    loggingService.info('[NotificationAPI] Updating notification preferences', {
      userId: params.userId,
    });

    const response = await api.put<UpdateNotificationPreferencesResponse>(
      NOTIFICATIONS.UPDATE_PREFERENCES,
      {
        userId: params.userId,
        preferences: params.preferences,
      },
    );

    if (response.data?.success && response.data?.data) {
      loggingService.info('[NotificationAPI] Preferences updated successfully');
      return response.data;
    }

    throw new Error(
      response.data?.error?.message ||
        'Failed to update notification preferences',
    );
  } catch (error) {
    loggingService.error(
      '[NotificationAPI] Failed to update notification preferences',
      {
        error,
      },
    );
    throw error;
  }
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
};
