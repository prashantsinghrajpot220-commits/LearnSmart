import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Attachment } from '@/services/FileUploadService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  status?: 'completed' | 'stopped';
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isChatOpen: boolean;
  addMessage: (role: 'user' | 'assistant', content: string, attachments?: Attachment[], status?: 'completed' | 'stopped') => void;
  updateLastMessage: (updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  toggleChat: () => void;
  closeChat: () => void;
  setTyping: (typing: boolean) => void;
  loadChatHistory: () => Promise<void>;
  searchMessages: (query: string) => ChatMessage[];
  deleteOldMessages: (maxAge: number) => Promise<void>;
}

const CHAT_STORAGE_KEY = '@learnsmart_chat_history';
const MAX_MESSAGES = 100;
const MESSAGE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  isChatOpen: false,

  addMessage: (role: 'user' | 'assistant', content: string, attachments?: Attachment[], status: 'completed' | 'stopped' = 'completed') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: Date.now(),
      attachments,
      status,
    };

    set((state) => {
      const updatedMessages = [...state.messages, newMessage].slice(-MAX_MESSAGES);
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    });
  },

  updateLastMessage: (updates: Partial<ChatMessage>) => {
    set((state) => {
      if (state.messages.length === 0) return state;
      const updatedMessages = [...state.messages];
      const lastIndex = updatedMessages.length - 1;
      updatedMessages[lastIndex] = { ...updatedMessages[lastIndex], ...updates };
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    });
  },

  clearMessages: () => {
    set({ messages: [] });
    AsyncStorage.removeItem(CHAT_STORAGE_KEY);
  },

  toggleChat: () => {
    set((state) => ({ isChatOpen: !state.isChatOpen }));
  },

  closeChat: () => {
    set({ isChatOpen: false });
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  loadChatHistory: async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const messages: ChatMessage[] = JSON.parse(stored);
        set({ messages });
      }
    } catch (error) {
                  // Debug statement removed
    }
  },

  searchMessages: (query: string) => {
    const { messages } = get();
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.role === 'user' && msg.content.toLowerCase().includes(lowerQuery)
    );
  },

  deleteOldMessages: async (maxAge: number = MESSAGE_MAX_AGE) => {
    const { messages } = get();
    const cutoffTime = Date.now() - maxAge;
    const filteredMessages = messages.filter((msg) => msg.timestamp > cutoffTime);
    
    if (filteredMessages.length !== messages.length) {
      set({ messages: filteredMessages });
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filteredMessages));
    }
  },
}));
