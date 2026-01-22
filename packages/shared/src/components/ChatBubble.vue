<template>
  <div
    :class="[
      'flex items-start gap-3 p-3 rounded-lg max-w-md',
      isOwn
        ? 'bg-primary text-primary-foreground ml-auto'
        : 'bg-muted'
    ]"
  >
    <!-- Avatar (for received messages) -->
    <div v-if="!isOwn && avatar" class="flex-shrink-0">
      <img :src="avatar" :alt="sender" class="h-8 w-8 rounded-full" />
    </div>
    
    <div class="flex-1 min-w-0">
      <!-- Sender name (for received messages) -->
      <p v-if="!isOwn && sender" class="text-xs font-medium mb-1">{{ sender }}</p>
      
      <!-- Message content -->
      <div class="break-words whitespace-pre-wrap text-sm">
        {{ message }}
      </div>
      
      <!-- Attachments -->
      <div v-if="attachments && attachments.length > 0" class="mt-2 space-y-1">
        <a
          v-for="(attachment, index) in attachments"
          :key="index"
          :href="attachment.url"
          target="_blank"
          class="flex items-center gap-2 text-xs opacity-80 hover:opacity-100"
        >
          <Paperclip class="h-3 w-3" />
          <span>{{ attachment.name }}</span>
        </a>
      </div>
      
      <!-- Timestamp and status -->
      <div
        :class="[
          'flex items-center gap-1 mt-1 text-xs',
          isOwn ? 'opacity-70' : 'text-muted-foreground'
        ]"
      >
        <span>{{ formatTime(timestamp) }}</span>
        <CheckCheck v-if="isOwn && status === 'read'" class="h-3 w-3" />
        <Check v-else-if="isOwn && status === 'delivered'" class="h-3 w-3" />
      </div>
    </div>
    
    <!-- Avatar (for sent messages) -->
    <div v-if="isOwn && avatar" class="flex-shrink-0">
      <img :src="avatar" :alt="sender" class="h-8 w-8 rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, CheckCheck, Paperclip } from 'lucide-vue-next';

export interface Attachment {
  name: string;
  url: string;
}

interface Props {
  message: string;
  isOwn?: boolean;
  sender?: string;
  avatar?: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

withDefaults(defineProps<Props>(), {
  isOwn: false,
  status: 'sent'
});

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
</script>
