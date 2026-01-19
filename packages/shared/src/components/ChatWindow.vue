<template>
  <div class="chat-window">
    <!-- Chat Header -->
    <div class="chat-header">
      <button v-if="showBackButton" class="back-button" @click="$emit('back')">
        ←
      </button>
      <Avatar :src="otherUser?.image" :alt="otherUser?.name" size="sm" />
      <div class="user-info">
        <h3>{{ otherUser?.name || 'Loading...' }}</h3>
        <span class="status">{{ referenceTitle }}</span>
      </div>
    </div>

    <!-- Messages -->
    <div class="messages-container" ref="messagesContainer">
      <div v-if="isLoading" class="loading-state">
        <LoadingSkeleton height="3rem" />
        <LoadingSkeleton height="3rem" />
        <LoadingSkeleton height="3rem" />
      </div>

      <div v-else-if="messages.length === 0" class="empty-state">
        <p>No messages yet. Start the conversation!</p>
      </div>

      <template v-else>
        <div
          v-for="message in messages"
          :key="message.name"
          class="message"
          :class="{ sent: message.sender === currentUser, received: message.sender !== currentUser }"
        >
          <div class="message-content">
            <p>{{ message.content }}</p>
            <span class="message-time">{{ formatTime(message.creation) }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Message Input -->
    <div class="message-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message..."
        @keydown.enter="sendMessage"
        :disabled="isSending"
      />
      <Button
        @click="sendMessage"
        :disabled="!newMessage.trim() || isSending"
        :loading="isSending"
      >
        Send
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import type { Message } from '../api/messaging';
import * as messagingApi from '../api/messaging';
import Avatar from './Avatar.vue';
import Button from './Button.vue';
import LoadingSkeleton from './LoadingSkeleton.vue';

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
const messagesContainer = ref<HTMLElement | null>(null);
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
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
}

.user-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.status {
  font-size: 0.75rem;
  color: #6b7280;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

.message {
  display: flex;
  max-width: 80%;
}

.message.sent {
  align-self: flex-end;
}

.message.received {
  align-self: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.message.sent .message-content {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message.received .message-content {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 0.25rem;
}

.message-content p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

.message-time {
  display: block;
  font-size: 0.625rem;
  margin-top: 0.25rem;
  opacity: 0.7;
}

.message.sent .message-time {
  text-align: right;
}

.message-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.message-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  outline: none;
}

.message-input input:focus {
  border-color: #3b82f6;
}

.message-input input:disabled {
  background: #f3f4f6;
}
</style>
