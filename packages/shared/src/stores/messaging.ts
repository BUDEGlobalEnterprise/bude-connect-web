/**
 * Messaging store using Frappe's Communication doctype
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Chat, Message } from '../api/messaging';
import * as messagingApi from '../api/messaging';

export const useMessagingStore = defineStore('messaging', () => {
  // State
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<string | null>(null);
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isSending = ref(false);
  const unsubscribe = ref<(() => void) | null>(null);

  // Getters
  const currentChat = computed(() =>
    chats.value.find(c => c.chat_id === currentChatId.value)
  );

  const totalUnreadCount = computed(() =>
    chats.value.reduce((sum, chat) => sum + chat.unread_count, 0)
  );

  // Actions
  async function fetchChats() {
    isLoading.value = true;
    try {
      chats.value = await messagingApi.getChatList();
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function openChat(referenceDoctype: string, referenceName: string) {
    isLoading.value = true;
    try {
      const chatInfo = await messagingApi.getOrCreateChat(referenceDoctype, referenceName);
      currentChatId.value = chatInfo.chat_id;

      // Load messages
      await loadMessages(chatInfo.chat_id);

      // Mark as read
      await messagingApi.markChatAsRead(chatInfo.chat_id);

      // Refresh chat list
      await fetchChats();
    } catch (error) {
      console.error('Failed to open chat:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMessages(chatId: string) {
    try {
      messages.value = await messagingApi.getMessages(chatId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async function sendMessage(message: string) {
    if (!currentChatId.value || !message.trim()) return;

    isSending.value = true;
    try {
      const result = await messagingApi.sendMessage(currentChatId.value, message);

      // Optimistically add message to UI (will be confirmed via realtime)
      // Frappe's Communication will handle the actual message creation

      // Refresh chat list to update last_message
      await fetchChats();

      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      isSending.value = false;
    }
  }

  async function deleteChat(chatId: string) {
    try {
      await messagingApi.deleteChat(chatId);

      // Remove from local state
      chats.value = chats.value.filter(c => c.chat_id !== chatId);

      if (currentChatId.value === chatId) {
        currentChatId.value = null;
        messages.value = [];
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      throw error;
    }
  }

  function addMessage(data: {
    chat_id: string;
    message_id: string;
    sender: string;
    content: string;
    timestamp: string;
  }) {
    // Only add if viewing this chat
    if (currentChatId.value === data.chat_id) {
      messages.value.push({
        name: data.message_id,
        sender: data.sender,
        content: data.content,
        creation: data.timestamp
      });

      // Mark as read
      messagingApi.markChatAsRead(data.chat_id);
    } else {
      // Update unread count in chat list
      const chat = chats.value.find(c => c.chat_id === data.chat_id);
      if (chat) {
        chat.unread_count++;
        chat.last_message = data.content;
      }
    }
  }

  function initializeRealtime() {
    // Subscribe to Frappe's realtime messages
    unsubscribe.value = messagingApi.subscribeToMessages((data) => {
      addMessage(data);

      // Refresh chat list to update order
      fetchChats();
    });
  }

  function cleanup() {
    if (unsubscribe.value) {
      unsubscribe.value();
      unsubscribe.value = null;
    }
    currentChatId.value = null;
    messages.value = [];
  }

  return {
    // State
    chats,
    currentChatId,
    messages,
    isLoading,
    isSending,

    // Getters
    currentChat,
    totalUnreadCount,

    // Actions
    fetchChats,
    openChat,
    loadMessages,
    sendMessage,
    deleteChat,
    addMessage,
    initializeRealtime,
    cleanup
  };
});
