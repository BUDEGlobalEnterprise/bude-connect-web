<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative hover:bg-muted transition-colors rounded-full" aria-label="Notifications">
        <Bell class="h-5 w-5" />
        <span v-if="store.hasUnread" class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in duration-300">
          {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
        </span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-80 sm:w-96 p-0 overflow-hidden shadow-xl border-border">
      <div class="flex items-center justify-between p-4 bg-muted/30 border-b">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold tracking-tight">Notifications</h3>
          <Badge v-if="store.hasUnread" variant="secondary" class="h-5 rounded-full px-2 text-[10px] bg-primary/10 text-primary border-none font-bold">
            {{ store.unreadCount }} New
          </Badge>
        </div>
        <div class="flex items-center gap-1">
          <Button
            v-if="store.hasUnread"
            variant="ghost"
            size="sm"
            class="h-7 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5"
            @click.stop="markAllAsRead"
          >
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground" @click.stop="clearAll">
            <Trash2 class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea class="h-[350px]">
        <div v-if="store.notifications.length > 0" class="divide-y divide-border">
          <div
            v-for="notification in store.notifications"
            :key="notification.name"
            class="group relative flex gap-4 p-4 transition-all hover:bg-muted/50 cursor-pointer"
            :class="{ 'bg-primary/5': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex-shrink-0 mt-1">
              <div :class="[
                'flex h-9 w-9 items-center justify-center rounded-full border transition-transform group-hover:scale-110',
                getIconBg(notification.type)
              ]">
                <component :is="getIcon(notification.type)" class="h-4 w-4" />
              </div>
            </div>
            
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-start justify-between gap-2">
                <h4 class="text-sm font-bold leading-none truncate pr-4 text-foreground">
                  {{ notification.subject }}
                </h4>
                <div v-if="!notification.read" class="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
              </div>
              <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {{ notification.message }}
              </p>
              <span class="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider block pt-1">
                {{ formatTime(notification.creation) }}
              </span>
            </div>
            
            <!-- Quick Actions on Hover -->
            <div class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button v-if="!notification.read" variant="ghost" size="icon" class="h-7 w-7 rounded-full bg-background shadow-sm border" @click.stop="store.markAsRead(notification.name)">
                 <Check class="h-3.5 w-3.5 text-success-600" />
               </Button>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 text-center opacity-60">
          <div class="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BellOff class="h-8 w-8 text-muted-foreground" />
          </div>
          <p class="text-base font-bold">All caught up!</p>
          <p class="text-xs max-w-[180px] mt-1">No new notifications at the moment.</p>
        </div>
      </ScrollArea>

      <div class="p-2 border-t bg-muted/10">
        <router-link to="/notifications" @click="isOpen = false">
          <Button variant="ghost" class="w-full h-9 text-sm font-semibold hover:bg-accent group" size="sm">
            View Activity Center
            <ArrowRight class="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </router-link>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notifications';
import type { Notification } from '../api/notifications';
import { 
  Bell, 
  BellOff, 
  Trash2, 
  Check, 
  ArrowRight,
  Megaphone,
  Share2,
  ClipboardList,
  AtSign,
  Zap,
  Mail
} from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Button,
  Badge,
  ScrollArea
} from './ui';

const store = useNotificationStore();
const router = useRouter();
const isOpen = ref(false);

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

function getIcon(type: string) {
  const icons: Record<string, any> = {
    'Alert': Megaphone,
    'Share': Share2,
    'Assignment': ClipboardList,
    'Mention': AtSign,
    'Energy Point': Zap
  };
  return icons[type] || Mail;
}

function getIconBg(type: string): string {
  const bgs: Record<string, string> = {
    'Alert': 'bg-amber-100 text-amber-600 border-amber-200',
    'Share': 'bg-blue-100 text-blue-600 border-blue-200',
    'Assignment': 'bg-purple-100 text-purple-600 border-purple-200',
    'Mention': 'bg-emerald-100 text-emerald-600 border-emerald-200',
    'Energy Point': 'bg-yellow-100 text-yellow-600 border-yellow-200'
  };
  return bgs[type] || 'bg-muted text-muted-foreground border-border';
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

onMounted(() => {
  store.initializeRealtime();
  store.fetchNotifications();
  store.requestNotificationPermission();
});

onUnmounted(() => {
  store.cleanup();
});
</script>
