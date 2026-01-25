<template>
  <Card class="flex flex-col h-full border-none shadow-none bg-background overflow-hidden">
    <!-- Chat Header -->
    <header class="flex items-center gap-4 p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <Button v-if="showBackButton" variant="ghost" size="icon" class="h-8 w-8 rounded-full" @click="$emit('back')">
        <ChevronLeft class="h-5 w-5" />
      </Button>
      
      <div class="relative">
        <Avatar class="h-10 w-10 border-2 border-background ring-2 ring-primary/10">
          <AvatarImage v-if="otherUser?.image" :src="otherUser?.image" />
          <AvatarFallback class="bg-primary/5 text-primary font-bold">
            {{ otherUser?.name?.charAt(0).toUpperCase() || '?' }}
          </AvatarFallback>
        </Avatar>
        <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-bold truncate tracking-tight">{{ otherUser?.name || 'Loading...' }}</h3>
        <p class="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 flex items-center gap-1.5">
          <span class="h-1 w-1 rounded-full bg-emerald-500" />
          {{ referenceTitle || 'Chat room' }}
        </p>
      </div>

      <div class="flex gap-1">
        <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground"><Phone class="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground"><Video class="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground"><MoreVertical class="h-4 w-4" /></Button>
      </div>
    </header>

    <!-- Messages Area -->
    <ScrollArea class="flex-1 px-4 lg:px-6" ref="scrollAreaRef">
      <div class="py-6 flex flex-col gap-6">
        <div v-if="isLoading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex gap-3" :class="i % 2 === 0 ? 'flex-row-reverse' : ''">
            <Skeleton class="h-8 w-8 rounded-full" />
            <Skeleton class="h-12 w-48 rounded-2xl" />
          </div>
        </div>

        <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <div class="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <MessageSquare class="h-10 w-10 text-muted-foreground" />
          </div>
          <h4 class="text-lg font-bold">Start the conversation</h4>
          <p class="text-sm max-w-xs mt-1 italic">Say hi to {{ otherUser?.name }} and get things moving!</p>
        </div>

        <template v-else>
          <div
            v-for="(message, index) in messages"
            :key="message.name"
            class="flex items-end gap-2"
            :class="message.sender === currentUser ? 'justify-end' : 'justify-start'"
          >
            <!-- Avatar for received messages (only shown for last message in group) -->
            <Avatar v-if="message.sender !== currentUser" class="h-6 w-6 border-none ring-1 ring-border">
               <AvatarImage v-if="otherUser?.image" :src="otherUser?.image" />
               <AvatarFallback class="text-[8px] font-bold">{{ otherUser?.name?.charAt(0) }}</AvatarFallback>
            </Avatar>

            <div class="max-w-[85%] lg:max-w-[75%] space-y-1 group">
               <div
                :class="[
                  'px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all',
                  message.sender === currentUser 
                    ? 'bg-primary text-primary-foreground rounded-br-none shadow-primary/10' 
                    : 'bg-muted text-foreground rounded-bl-none'
                ]"
              >
                {{ message.content }}
              </div>
              <div class="flex items-center gap-2 px-1" :class="message.sender === currentUser ? 'justify-end' : 'justify-start'">
                <span class="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-tighter">
                  {{ formatTime(message.creation) }}
                </span>
                <Check v-if="message.sender === currentUser" class="h-2.5 w-2.5 text-primary/50" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </ScrollArea>

    <!-- Message Input -->
    <footer class="p-4 border-t bg-card/50">
      <div class="flex items-center gap-2 max-w-5xl mx-auto">
        <Button variant="ghost" size="icon" class="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary transition-colors">
          <Paperclip class="h-5 w-5" />
        </Button>
        
        <div class="relative flex-1">
          <Input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="pr-12 py-6 rounded-2xl border-muted bg-background/80 backdrop-blur-sm focus-visible:ring-primary/20 shadow-inner"
            @keydown.enter="sendMessage"
            :disabled="isSending"
          />
          <Button 
            size="icon" 
            class="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl transition-all"
            :class="newMessage.trim() ? 'bg-primary opacity-100 scale-100' : 'bg-muted opacity-0 scale-75 pointer-events-none'"
            @click="sendMessage"
          >
            <SendHorizontal class="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" class="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary transition-colors">
          <Smile class="h-5 w-5" />
        </Button>
      </div>
    </footer>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import type { Message } from '../api/messaging';
import * as messagingApi from '../api/messaging';
import { 
  Card, 
  Button, 
  Avatar, AvatarImage, AvatarFallback,
  Input,
  Skeleton,
  ScrollArea
} from './ui';
import { 
  ChevronLeft, 
  SendHorizontal, 
  Phone, 
  Video, 
  MoreVertical, 
  MessageSquare,
  Check,
  Paperclip,
  Smile,
} from 'lucide-vue-next';

const props = defineProps<{
  chatId: string;
  currentUser: string;
  otherUser?: { name: string; image?: string };
  referenceTitle?: string;
  showBackButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'message-sent', message: Message): void;
}>();

// State
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const isSending = ref(false);
const scrollAreaRef = ref<any>(null);
const unsubscribe = ref<(() => void) | null>(null);

// Methods
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollAreaRef.value) {
      const viewport = scrollAreaRef.value.$el.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  });
}

async function loadMessages() {
  if (!props.chatId) return;

  isLoading.value = true;
  try {
    messages.value = await messagingApi.getMessages(props.chatId);
    scrollToBottom();

    // Mark as read
    await messagingApi.markChatAsRead(props.chatId);
  } catch (error) {
    console.error('Failed to load messages:', error);
  } finally {
    isLoading.value = false;
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || isSending.value) return;

  const messageText = newMessage.value.trim();
  newMessage.value = '';
  isSending.value = true;

  try {
    const result = await messagingApi.sendMessage(props.chatId, messageText);

    // Add message optimistically
    const newMsg: Message = {
      name: result.message_id,
      sender: props.currentUser,
      content: messageText,
      creation: result.timestamp
    };
    messages.value.push(newMsg);
    scrollToBottom();

    emit('message-sent', newMsg);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Restore message on failure
    newMessage.value = messageText;
  } finally {
    isSending.value = false;
  }
}

function handleNewMessage(data: {
  chat_id: string;
  message_id: string;
  sender: string;
  content: string;
  timestamp: string;
}) {
  if (data.chat_id === props.chatId && data.sender !== props.currentUser) {
    messages.value.push({
      name: data.message_id,
      sender: data.sender,
      content: data.content,
      creation: data.timestamp
    });
    scrollToBottom();

    // Mark as read
    messagingApi.markChatAsRead(props.chatId);
  }
}

// Watch for chat changes
watch(() => props.chatId, (newChatId) => {
  if (newChatId) {
    loadMessages();
  }
}, { immediate: true });

// Subscribe to realtime
onMounted(() => {
  unsubscribe.value = messagingApi.subscribeToMessages(handleNewMessage);
});

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
});
</script>
