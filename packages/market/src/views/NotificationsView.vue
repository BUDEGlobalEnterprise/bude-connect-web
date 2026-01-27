<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@bude/shared/stores';
import type { Notification } from '@bude/shared/api/notifications';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  ChevronLeft,
  Megaphone,
  Share2,
  ClipboardList,
  AtSign,
  Zap,
  Mail,
} from 'lucide-vue-next';

const store = useNotificationStore();
const router = useRouter();

function handleClick(notification: Notification) {
  if (!notification.read) {
    store.markAsRead(notification.name);
  }

  if (notification.document_type && notification.document_name) {
    const routes: Record<string, string> = {
      Item: `/listing/${notification.document_name}`,
      'Job Opening': `/job/${notification.document_name}`,
      Communication: `/messages/${notification.document_name}`,
    };
    const route = routes[notification.document_type];
    if (route) router.push(route);
  }
}

function getIcon(type: string) {
  const icons: Record<string, any> = {
    Alert: Megaphone,
    Share: Share2,
    Assignment: ClipboardList,
    Mention: AtSign,
    'Energy Point': Zap,
  };
  return icons[type] || Mail;
}

function getIconBg(type: string): string {
  const bgs: Record<string, string> = {
    Alert: 'bg-amber-100 text-amber-600',
    Share: 'bg-blue-100 text-blue-600',
    Assignment: 'bg-purple-100 text-purple-600',
    Mention: 'bg-emerald-100 text-emerald-600',
    'Energy Point': 'bg-yellow-100 text-yellow-600',
  };
  return bgs[type] || 'bg-gray-100 text-gray-500';
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

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

onMounted(() => {
  store.fetchNotifications();
  store.initializeRealtime();
});

onUnmounted(() => {
  store.cleanup();
});
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
        <span
          v-if="store.hasUnread"
          class="px-2 py-0.5 text-xs font-bold bg-primary-100 text-primary-700 rounded-full"
        >
          {{ store.unreadCount }} new
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="store.hasUnread"
          @click="store.markAllAsRead()"
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <CheckCheck class="w-4 h-4" />
          Mark all read
        </button>
        <button
          @click="store.clearAll()"
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Clear read notifications"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.isLoading" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="animate-pulse flex gap-4 p-4 rounded-xl bg-white border border-gray-100"
      >
        <div class="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Notification List -->
    <div v-else-if="store.notifications.length > 0" class="space-y-2">
      <div
        v-for="notification in store.notifications"
        :key="notification.name"
        @click="handleClick(notification)"
        :class="[
          'group flex gap-4 p-4 rounded-xl border cursor-pointer transition-all',
          notification.read
            ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            : 'bg-primary-50/50 border-primary-100 hover:border-primary-200 hover:shadow-sm',
        ]"
      >
        <!-- Icon -->
        <div
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-transform group-hover:scale-110',
            getIconBg(notification.type),
          ]"
        >
          <component :is="getIcon(notification.type)" class="h-4 w-4" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3
              :class="[
                'text-sm leading-tight',
                notification.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900',
              ]"
            >
              {{ notification.subject }}
            </h3>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-gray-400">{{ formatTime(notification.creation) }}</span>
              <div
                v-if="!notification.read"
                class="h-2 w-2 rounded-full bg-primary-500"
              />
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">
            {{ notification.message }}
          </p>
        </div>

        <!-- Mark read button on hover -->
        <button
          v-if="!notification.read"
          @click.stop="store.markAsRead(notification.name)"
          class="self-center p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
          title="Mark as read"
        >
          <Check class="w-4 h-4 text-primary-600" />
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <BellOff class="h-10 w-10 text-gray-300" />
      </div>
      <h2 class="text-lg font-bold text-gray-900">All caught up!</h2>
      <p class="text-sm text-gray-500 mt-1 max-w-xs">
        No notifications at the moment. We'll let you know when something happens.
      </p>
    </div>
  </div>
</template>
