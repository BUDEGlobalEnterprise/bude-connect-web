<template>
  <div class="notification-bell">
    <button @click="toggleDropdown" class="bell-button" aria-label="Notifications">
      <span class="icon">🔔</span>
      <span v-if="store.hasUnread" class="badge">{{ store.unreadCount }}</span>
    </button>

    <div v-if="isOpen" class="notification-dropdown">
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <div class="header-actions">
          <button
            v-if="store.hasUnread"
            @click="markAllAsRead"
            class="action-btn"
          >
            Mark all as read
          </button>
          <button @click="clearAll" class="action-btn">Clear</button>
        </div>
      </div>

      <div class="notification-list">
        <div
          v-for="notification in store.notifications"
          :key="notification.name"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon">{{ getIcon(notification.type) }}</div>
          <div class="notification-content">
            <h4>{{ notification.subject }}</h4>
            <p>{{ notification.message }}</p>
            <span class="timestamp">{{ formatTime(notification.creation) }}</span>
          </div>
        </div>

        <div v-if="store.notifications.length === 0" class="empty-state">
          <span class="empty-icon">🔔</span>
          <p>No notifications yet</p>
        </div>
      </div>

      <div v-if="store.notifications.length > 0" class="dropdown-footer">
        <router-link to="/notifications" class="view-all-link">
          View all notifications
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notifications';
import type { Notification } from '../api/notifications';

const store = useNotificationStore();
const router = useRouter();
const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value && store.notifications.length === 0) {
    store.fetchNotifications();
  }
}

function handleNotificationClick(notification: Notification) {
  if (!notification.read) {
    store.markAsRead(notification.name);
  }

  // Navigate to related document if available
  if (notification.document_type && notification.document_name) {
    const routes: Record<string, string> = {
      'Item': `/listing/${notification.document_name}`,
      'Job Opening': `/job/${notification.document_name}`,
      'Communication': `/messages/${notification.document_name}`
    };

    const route = routes[notification.document_type];
    if (route) {
      router.push(route);
    }
  }

  isOpen.value = false;
}

async function markAllAsRead() {
  await store.markAllAsRead();
}

async function clearAll() {
  await store.clearAll();
}

function getIcon(type: string): string {
  const icons: Record<string, string> = {
    'Alert': '📢',
    'Share': '📤',
    'Assignment': '📋',
    'Mention': '@',
    'Energy Point': '⚡'
  };
  return icons[type] || '📬';
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const dropdown = document.querySelector('.notification-bell');
  if (dropdown && !dropdown.contains(target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  // Initialize realtime notifications
  store.initializeRealtime();

  // Fetch initial notifications
  store.fetchNotifications();

  // Request browser notification permission
  store.requestNotificationPermission();

  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  store.cleanup();
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.bell-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.icon {
  font-size: 1.25rem;
}

.badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background-color: #ef4444;
  border-radius: 0.625rem;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 24rem;
  max-height: 32rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  font-size: 0.75rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.action-btn:hover {
  text-decoration: underline;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  max-height: 24rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-content p {
  font-size: 0.813rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.dropdown-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.view-all-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .notification-dropdown {
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }
}
</style>
