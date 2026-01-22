<template>
  <div class="relative">
    <Button variant="ghost" size="icon" class="relative" @click="isOpen = !isOpen">
      <Bell :size="20" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </Button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-background border rounded-md shadow-lg z-50"
      @click.stop
    >
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="font-semibold">Notifications</h3>
        <Button
          v-if="unreadCount > 0"
          variant="ghost"
          size="sm"
          @click="markAllAsRead"
        >
          Mark all read
        </Button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 text-center">
          <Bell class="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
          <p class="text-sm text-muted-foreground">No notifications yet</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'border-b last:border-0 p-4 transition-colors cursor-pointer',
              !notification.read ? 'bg-primary/5' : 'hover:bg-muted/50'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex gap-3">
              <!-- Icon -->
              <div
                :class="[
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  getIconStyle(notification.type)
                ]"
              >
                <component :is="getIcon(notification.type)" :size="16" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p :class="['text-sm', !notification.read && 'font-semibold']">
                    {{ notification.title }}
                  </p>
                  <span v-if="!notification.read" class="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                </div>
                
                <p class="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>
                
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-xs text-muted-foreground">
                    {{ formatTime(notification.timestamp) }}
                  </span>
                  <Badge v-if="notification.category" variant="secondary" class="text-xs">
                    {{ notification.category }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="notification.actions && notification.actions.length > 0" class="mt-3 flex gap-2">
              <Button
                v-for="action in notification.actions"
                :key="action.label"
                :variant="action.variant || 'outline'"
                size="sm"
                @click.stop="handleAction(notification, action)"
              >
                {{ action.label }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2 border-t">
        <Button variant="ghost" class="w-full" size="sm" @click="viewAllNotifications">
          View all notifications
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Bell,
  MessageSquare,
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star
} from 'lucide-vue-next';
import type { Component } from 'vue';

type NotificationType = 'message' | 'request' | 'proposal' | 'success' | 'warning' | 'payment' | 'review';

export interface NotificationAction {
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  handler: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category?: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
  link?: string;
}

interface Props {
  notifications?: Notification[];
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => []
});

const emit = defineEmits<{
  'mark-read': [id: string];
  'mark-all-read': [];
  'click': [notification: Notification];
  'view-all': [];
}>();

const isOpen = ref(false);

const unreadCount = computed(() =>
  props.notifications.filter(n => !n.read).length
);

const getIcon = (type: NotificationType): Component => {
  const icons: Record<NotificationType, Component> = {
    message: MessageSquare,
    request: UserPlus,
    proposal: FileText,
    success: CheckCircle,
    warning: AlertCircle,
    payment: DollarSign,
    review: Star
  };
  return icons[type] || Bell;
};

const getIconStyle = (type: NotificationType): string => {
  const styles: Record<NotificationType, string> = {
    message: 'bg-blue-100 text-blue-600',
    request: 'bg-purple-100 text-purple-600',
    proposal: 'bg-green-100 text-green-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    payment: 'bg-emerald-100 text-emerald-600',
    review: 'bg-amber-100 text-amber-600'
  };
  return styles[type] || 'bg-gray-100 text-gray-600';
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    emit('mark-read', notification.id);
  }
  emit('click', notification);
  
  if (notification.link) {
    isOpen.value = false;
  }
};

const handleAction = (notification: Notification, action: NotificationAction) => {
  action.handler();
  if (!notification.read) {
    emit('mark-read', notification.id);
  }
};

const markAllAsRead = () => {
  emit('mark-all-read');
};

const viewAllNotifications = () => {
  emit('view-all');
  isOpen.value = false;
};
</script>
