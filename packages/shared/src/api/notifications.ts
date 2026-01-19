/**
 * Notifications API using Frappe's Notification Log
 */

import { frappe } from './client';

export interface Notification {
  name: string;
  subject: string;
  message: string;
  type: string;
  document_type?: string;
  document_name?: string;
  read: boolean;
  creation: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

/**
 * Get user's notifications
 */
export async function getNotifications(limit = 20): Promise<NotificationsResponse> {
  return frappe.call<NotificationsResponse>(
    'bude_core.notifications.notification_handler.get_notifications',
    { limit }
  );
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await frappe.call(
    'bude_core.notifications.notification_handler.mark_notification_as_read',
    { notification_id: notificationId }
  );
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await frappe.call(
    'bude_core.notifications.notification_handler.mark_all_as_read'
  );
}

/**
 * Clear all read notifications
 */
export async function clearNotifications(): Promise<void> {
  await frappe.call(
    'bude_core.notifications.notification_handler.clear_notifications'
  );
}

/**
 * Subscribe to realtime notifications using Frappe's SocketIO
 */
export function subscribeToNotifications(
  onNotification: (notification: Notification) => void
): () => void {
  // Frappe's realtime event handler
  const handler = (data: Notification) => {
    onNotification(data);
  };

  // Subscribe to Frappe's realtime events
  if (typeof window !== 'undefined' && (window as any).frappe) {
    (window as any).frappe.realtime.on('notification', handler);
  }

  // Return unsubscribe function
  return () => {
    if (typeof window !== 'undefined' && (window as any).frappe) {
      (window as any).frappe.realtime.off('notification', handler);
    }
  };
}
