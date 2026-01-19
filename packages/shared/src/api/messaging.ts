/**
 * Messaging API using Frappe's Communication doctype
 */

import { frappe } from './client';

export interface Chat {
  chat_id: string;
  reference_doctype: string;
  reference_name: string;
  other_user: string;
  other_user_name: string;
  other_user_image?: string;
  last_message?: string;
  modified: string;
  unread_count: number;
}

export interface Message {
  name: string;
  sender: string;
  content: string;
  creation: string;
  full_name?: string;
  user_image?: string;
}

export interface ChatInfo {
  chat_id: string;
  reference_doctype: string;
  reference_name: string;
  other_user: string;
  other_user_name: string;
  other_user_image?: string;
}

/**
 * Get or create chat thread for a listing/job
 */
export async function getOrCreateChat(
  referenceDoctype: string,
  referenceName: string
): Promise<ChatInfo> {
  return frappe.call<ChatInfo>(
    'bude_core.messaging.chat_handler.get_or_create_chat',
    {
      reference_doctype: referenceDoctype,
      reference_name: referenceName
    }
  );
}

/**
 * Send message in chat
 */
export async function sendMessage(
  chatId: string,
  message: string
): Promise<{ message_id: string; timestamp: string }> {
  return frappe.call(
    'bude_core.messaging.chat_handler.send_message',
    {
      chat_id: chatId,
      message
    }
  );
}

/**
 * Get messages in chat thread
 */
export async function getMessages(chatId: string, limit = 50): Promise<Message[]> {
  return frappe.call<Message[]>(
    'bude_core.messaging.chat_handler.get_messages',
    {
      chat_id: chatId,
      limit
    }
  );
}

/**
 * Get list of all chats
 */
export async function getChatList(): Promise<Chat[]> {
  return frappe.call<Chat[]>('bude_core.messaging.chat_handler.get_chat_list');
}

/**
 * Mark chat as read
 */
export async function markChatAsRead(chatId: string): Promise<void> {
  await frappe.call('bude_core.messaging.chat_handler.mark_chat_as_read', {
    chat_id: chatId
  });
}

/**
 * Delete chat
 */
export async function deleteChat(chatId: string): Promise<void> {
  await frappe.call('bude_core.messaging.chat_handler.delete_chat', {
    chat_id: chatId
  });
}

/**
 * Subscribe to realtime messages using Frappe's SocketIO
 */
export function subscribeToMessages(
  onMessage: (data: {
    chat_id: string;
    message_id: string;
    sender: string;
    content: string;
    timestamp: string;
  }) => void
): () => void {
  const handler = (data: any) => {
    onMessage(data);
  };

  // Subscribe to Frappe's realtime events
  if (typeof window !== 'undefined' && (window as any).frappe) {
    (window as any).frappe.realtime.on('new_message', handler);
  }

  // Return unsubscribe function
  return () => {
    if (typeof window !== 'undefined' && (window as any).frappe) {
      (window as any).frappe.realtime.off('new_message', handler);
    }
  };
}
