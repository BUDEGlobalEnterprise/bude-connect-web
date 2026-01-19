<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore, useMessagingStore } from "@bude/shared";
import {
  ChatWindow,
  Avatar,
  LoadingSkeleton,
  EmptyState,
  BottomNav,
} from "@bude/shared/components";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const messagingStore = useMessagingStore();

const selectedChatId = ref<string | null>(null);
const isMobile = ref(window.innerWidth < 768);

// Get other user info for selected chat
const selectedChat = computed(() => {
  if (!selectedChatId.value) return null;
  return messagingStore.chats.find((c) => c.name === selectedChatId.value);
});

const otherUser = computed(() => {
  if (!selectedChat.value || !userStore.user) return null;

  const isCurrentUserParty1 =
    selectedChat.value.party_1 === userStore.user.email;

  return {
    name: isCurrentUserParty1
      ? selectedChat.value.party_2_name
      : selectedChat.value.party_1_name,
    image: isCurrentUserParty1
      ? selectedChat.value.party_2_image
      : selectedChat.value.party_1_image,
  };
});

function selectChat(chatId: string) {
  selectedChatId.value = chatId;
  if (isMobile.value) {
    router.push({ query: { chat: chatId } });
  }
}

function goBack() {
  selectedChatId.value = null;
  router.push({ query: {} });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-IN", { weekday: "short" });
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function handleResize() {
  isMobile.value = window.innerWidth < 768;
}

// Load chats on mount
onMounted(async () => {
  window.addEventListener("resize", handleResize);
  await messagingStore.loadChats();
  messagingStore.connect();

  // Check for chat query param
  if (route.query.chat) {
    selectedChatId.value = route.query.chat as string;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  messagingStore.disconnect();
});

// Watch for route changes
watch(
  () => route.query.chat,
  (chatId) => {
    if (chatId) {
      selectedChatId.value = chatId as string;
    }
  }
);
</script>

<template>
  <div class="messages-view">
    <!-- Desktop: Side-by-side layout -->
    <div class="messages-container">
      <!-- Chat List -->
      <div
        class="chat-list"
        :class="{ hidden: isMobile && selectedChatId }"
      >
        <div class="chat-list-header">
          <h1 class="text-xl font-bold">Messages</h1>
        </div>

        <!-- Loading State -->
        <div v-if="messagingStore.isLoading" class="p-4 space-y-3">
          <LoadingSkeleton height="4rem" />
          <LoadingSkeleton height="4rem" />
          <LoadingSkeleton height="4rem" />
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else-if="messagingStore.chats.length === 0"
          icon="chat"
          title="No messages yet"
          description="Start a conversation by contacting a seller or buyer"
        />

        <!-- Chat Items -->
        <div v-else class="chat-items">
          <div
            v-for="chat in messagingStore.chats"
            :key="chat.name"
            class="chat-item"
            :class="{ active: selectedChatId === chat.name }"
            @click="selectChat(chat.name)"
          >
            <Avatar
              :src="
                chat.party_1 === userStore.user?.email
                  ? chat.party_2_image
                  : chat.party_1_image
              "
              :alt="
                chat.party_1 === userStore.user?.email
                  ? chat.party_2_name
                  : chat.party_1_name
              "
              size="md"
            />
            <div class="chat-info">
              <div class="chat-header">
                <h3 class="chat-name">
                  {{
                    chat.party_1 === userStore.user?.email
                      ? chat.party_2_name
                      : chat.party_1_name
                  }}
                </h3>
                <span class="chat-time">{{
                  chat.last_message_time
                    ? formatTime(chat.last_message_time)
                    : ""
                }}</span>
              </div>
              <div class="chat-preview">
                <p class="preview-text">
                  {{ chat.last_message || "No messages yet" }}
                </p>
                <span
                  v-if="chat.unread_count > 0"
                  class="unread-badge"
                >
                  {{ chat.unread_count }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div
        class="chat-window-container"
        :class="{ hidden: isMobile && !selectedChatId }"
      >
        <ChatWindow
          v-if="selectedChatId"
          :chat-id="selectedChatId"
          :current-user="userStore.user?.email || ''"
          :other-user="otherUser || undefined"
          :reference-title="selectedChat?.reference_title"
          :show-back-button="isMobile"
          @back="goBack"
        />

        <!-- No Chat Selected -->
        <div v-else class="no-chat-selected">
          <div class="text-center text-gray-500">
            <svg
              class="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p class="text-lg font-medium">Select a conversation</p>
            <p class="text-sm">Choose a chat from the list to start messaging</p>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.messages-view {
  min-height: 100vh;
  background: #f9fafb;
  padding-bottom: 4.5rem;
}

.messages-container {
  display: flex;
  height: calc(100vh - 4.5rem);
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
}

.chat-list {
  width: 100%;
  max-width: 360px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.chat-list-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.chat-item:hover {
  background: #f9fafb;
}

.chat-item.active {
  background: #eff6ff;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chat-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.75rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.chat-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-text {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.unread-badge {
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.chat-window-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile */
@media (max-width: 767px) {
  .chat-list {
    max-width: 100%;
    border-right: none;
  }

  .chat-list.hidden {
    display: none;
  }

  .chat-window-container.hidden {
    display: none;
  }

  .no-chat-selected {
    display: none;
  }
}
</style>
