import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { sendMessageToSmarty, getQuickReplies } from '@/services/smartyAI';
import { useSmartyContext } from '@/context/ChatContext';
import { useUserStore } from '@/store/userStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_CHAT_HEIGHT = SCREEN_HEIGHT * 0.7;

interface SmartyChatProps {
  onClose: () => void;
}

export default function SmartyChat({ onClose }: SmartyChatProps) {
  const { colors, isDark } = useTheme();
  const { userName } = useUserStore();
  const { getContextInfo } = useSmartyContext();
  const { messages, isTyping, addMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);

    const context = getContextInfo();
    await sendMessageToSmarty(userMessage, {
      userName: userName || 'Student',
      selectedClass: useUserStore.getState().selectedClass || '',
      selectedStream: useUserStore.getState().selectedStream || '',
      ...context,
    });
  };

  const handleQuickReply = async (reply: string) => {
    setInputText(reply);
    addMessage('user', reply);
    setInputText('');

    const context = getContextInfo();
    await sendMessageToSmarty(reply, {
      userName: userName || 'Student',
      selectedClass: useUserStore.getState().selectedClass || '',
      selectedStream: useUserStore.getState().selectedStream || '',
      ...context,
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = useChatStore.getState().searchMessages(searchQuery);
      // Display search results in chat
      if (results.length === 0) {
        addMessage('assistant', `No previous messages found for "${searchQuery}". Try a different search term!`);
      } else {
        addMessage('assistant', `Found ${results.length} previous message(s) about "${searchQuery}". Keep learning and you'll remember more! 💪`);
      }
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const filteredMessages = showSearch && searchQuery
    ? messages.filter(
        (msg) =>
          msg.role === 'user' && msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🎓</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Smarty</Text>
            <Text style={styles.headerSubtitle}>Your study buddy</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.7}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.welcomeTitle}>Hi! I'm Smarty!</Text>
            <Text style={styles.welcomeText}>
              Your friendly study companion. I'm here to help you learn, answer questions, and make studying easier!
            </Text>
            <View style={styles.quickRepliesContainer}>
              <Text style={styles.quickRepliesLabel}>Quick starts:</Text>
              {getQuickReplies().slice(0, 3).map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyChip}
                  onPress={() => handleQuickReply(reply)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {filteredMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>🎓</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {message.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime,
                ]}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>🎓</Text>
            </View>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.typingContainer}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      {!isTyping && messages.length > 0 && (
        <ScrollView
          horizontal
          style={styles.quickRepliesScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {getQuickReplies().map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickReplyButtonText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 80,
      right: 16,
      width: 360,
      maxHeight: MAX_CHAT_HEIGHT,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderRadius: BorderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3A' : '#E8E8E8',
      overflow: 'hidden',
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      backgroundColor: colors.primary,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    avatarEmoji: {
      fontSize: 24,
    },
    headerTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.white,
    },
    headerSubtitle: {
      fontSize: FontSizes.xs,
      color: colors.white + 'CC',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: Spacing.sm,
      marginRight: Spacing.sm,
    },
    headerButtonText: {
      fontSize: 18,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.white + '33',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonText: {
      fontSize: 18,
      color: colors.white,
      fontWeight: FontWeights.bold,
    },
    searchContainer: {
      flexDirection: 'row',
      padding: Spacing.sm,
      backgroundColor: isDark ? '#1A1A1A' : '#F5F1E8',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3A3A3A' : '#E8E8E8',
    },
    searchInput: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#FFF',
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSizes.md,
      color: colors.text,
      marginRight: Spacing.sm,
    },
    searchButton: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
    },
    searchButtonText: {
      color: colors.white,
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
    },
    messagesContainer: {
      flex: 1,
      maxHeight: MAX_CHAT_HEIGHT - 200,
    },
    messagesContent: {
      padding: Spacing.md,
    },
    welcomeContainer: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },
    welcomeEmoji: {
      fontSize: 48,
      marginBottom: Spacing.md,
    },
    welcomeTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    welcomeText: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.lg,
      paddingHorizontal: Spacing.md,
    },
    quickRepliesContainer: {
      alignItems: 'center',
    },
    quickRepliesLabel: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginBottom: Spacing.sm,
    },
    quickRepliesScroll: {
      maxHeight: 40,
    },
    quickRepliesContent: {
      paddingHorizontal: Spacing.md,
    },
    quickReplyChip: {
      backgroundColor: isDark ? '#3A3A3A' : '#F5F1E8',
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      marginHorizontal: Spacing.xs,
    },
    quickReplyText: {
      fontSize: FontSizes.xs,
      color: colors.primary,
      fontWeight: FontWeights.medium,
    },
    messageWrapper: {
      flexDirection: 'row',
      marginBottom: Spacing.sm,
      alignItems: 'flex-end',
    },
    userMessageWrapper: {
      justifyContent: 'flex-end',
    },
    assistantMessageWrapper: {
      justifyContent: 'flex-start',
    },
    messageAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + '33',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.xs,
    },
    messageAvatarText: {
      fontSize: 16,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: BorderRadius.sm,
    },
    assistantBubble: {
      backgroundColor: isDark ? '#3A3A3A' : '#F5F1E8',
      borderBottomLeftRadius: BorderRadius.sm,
    },
    messageText: {
      fontSize: FontSizes.md,
      lineHeight: 22,
    },
    userMessageText: {
      color: colors.white,
    },
    assistantMessageText: {
      color: colors.text,
    },
    messageTime: {
      fontSize: FontSizes.xs,
      marginTop: Spacing.xs,
    },
    userMessageTime: {
      color: colors.white + 'CC',
      textAlign: 'right',
    },
    assistantMessageTime: {
      color: colors.textSecondary,
    },
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginHorizontal: 2,
    },
    typingDot1: {
      opacity: 0.4,
    },
    typingDot2: {
      opacity: 0.7,
    },
    typingDot3: {
      opacity: 1,
    },
    quickReplyButton: {
      backgroundColor: colors.primary + '20',
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginRight: Spacing.sm,
    },
    quickReplyButtonText: {
      fontSize: FontSizes.sm,
      color: colors.primary,
      fontWeight: FontWeights.medium,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: Spacing.sm,
      backgroundColor: isDark ? '#1A1A1A' : '#F5F1E8',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#3A3A3A' : '#E8E8E8',
    },
    textInput: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#FFFFFF',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSizes.md,
      color: colors.text,
      maxHeight: 100,
      marginRight: Spacing.sm,
    },
    sendButton: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.lightGray,
    },
    sendButtonText: {
      color: colors.white,
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
    },
  });
