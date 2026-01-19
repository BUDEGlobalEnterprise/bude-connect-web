/**
 * Notifications store using Frappe's Notification Log
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Notification } from '../api/notifications';
import * as notificationApi from '../api/notifications';

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const unsubscribe = ref<(() => void) | null>(null);

  // Getters
  const hasUnread = computed(() => unreadCount.value > 0);
  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.read)
  );

  // Actions
  async function fetchNotifications() {
    isLoading.value = true;
    try {
      const response = await notificationApi.getNotifications();
      notifications.value = response.notifications;
      unreadCount.value = response.unread_count;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await notificationApi.markNotificationAsRead(notificationId);

      // Update local state
      const notification = notifications.value.find(n => n.name === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async function markAllAsRead() {
    try {
      await notificationApi.markAllNotificationsAsRead();

      // Update local state
      notifications.value.forEach(n => {
        n.read = true;
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }

  async function clearAll() {
    try {
      await notificationApi.clearNotifications();

      // Remove read notifications from local state
      notifications.value = notifications.value.filter(n => !n.read);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  function addNotification(notification: Notification) {
    // Add to beginning of list
    notifications.value.unshift(notification);
    if (!notification.read) {
      unreadCount.value++;
    }
  }

  function initializeRealtime() {
    // Subscribe to Frappe's realtime notifications
    unsubscribe.value = notificationApi.subscribeToNotifications((notification) => {
      addNotification(notification);

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.subject, {
          body: notification.message,
          icon: '/assets/bude_core/images/logo.png'
        });
      }
    });
  }

  function cleanup() {
    if (unsubscribe.value) {
      unsubscribe.value();
      unsubscribe.value = null;
    }
  }

  // Request browser notification permission
  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    isLoading,

    // Getters
    hasUnread,
    unreadNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification,
    initializeRealtime,
    cleanup,
    requestNotificationPermission
  };
});
