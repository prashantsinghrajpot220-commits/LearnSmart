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
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { sendMessageToSmarty, getQuickReplies } from '@/services/SmartyAIService';
import { useSmartyContext } from '@/context/ChatContext';
import { useUserStore } from '@/store/userStore';
import { sanitizeText } from '@/utils/sanitizer';
import { pickImage, pickDocument, Attachment } from '@/services/FileUploadService';
import { getRemainingImages } from '@/utils/uploadLimits';
import { StreamingService } from '@/services/StreamingService';
import FileUploadButton from '@/components/FileUploadButton';
import ImagePreview from '@/components/ImagePreview';
import FilePreview from '@/components/FilePreview';
import VoiceRecorder from '@/components/VoiceRecorder';
import { useVoiceNoteStore } from '@/store/voiceNoteStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_CHAT_HEIGHT = SCREEN_HEIGHT * 0.7;

interface SmartyChatProps {
  onClose: () => void;
  fullScreen?: boolean;
}

export default function SmartyChat({ onClose, fullScreen = false }: SmartyChatProps) {
  const { colors, isDark } = useTheme();
  const { userName } = useUserStore();
  const { getContextInfo } = useSmartyContext();
  const { messages, isTyping, addMessage } = useChatStore();
  const { addNote } = useVoiceNoteStore();
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [remainingImages, setRemainingImages] = useState(6);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    let isMounted = true;
    const fetchRemaining = async () => {
      const remaining = await getRemainingImages();
      if (isMounted) {
        setRemainingImages(remaining);
      }
    };
    fetchRemaining();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateRemainingImages = async () => {
    const remaining = await getRemainingImages();
    setRemainingImages(remaining);
  };

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const att = await pickImage(useCamera);
      if (att) {
        setAttachments([...attachments, att]);
        updateRemainingImages();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Upload Error', errorMessage);
    }
  };

  const handlePickFile = async () => {
    try {
      const att = await pickDocument();
      if (att) {
        setAttachments([...attachments, att]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Upload Error', errorMessage);
    }
  };

  const removeAttachment = (index: number) => {
    const newAtts = [...attachments];
    newAtts.splice(index, 1);
    setAttachments(newAtts);
  };

  const handleStop = () => {
    StreamingService.stop('default_chat');
  };

  const handleSend = async () => {
    const userMessage = sanitizeText(inputText, { maxLength: 1000 });
    if (!userMessage.trim() && attachments.length === 0) return;

    const currentAttachments = [...attachments];
    setInputText('');
    setAttachments([]);
    addMessage('user', userMessage, currentAttachments);

    const context = getContextInfo();
    await sendMessageToSmarty(userMessage, {
      userName: userName || 'Student',
      selectedClass: useUserStore.getState().selectedClass || '',
      selectedStream: useUserStore.getState().selectedStream || '',
      ...context,
    }, currentAttachments);
  };

  const handleQuickReply = async (reply: string) => {
    const safeReply = sanitizeText(reply, { maxLength: 500 });
    setInputText('');
    addMessage('user', safeReply);

    const context = getContextInfo();
    await sendMessageToSmarty(safeReply, {
      userName: userName || 'Student',
      selectedClass: useUserStore.getState().selectedClass || '',
      selectedStream: useUserStore.getState().selectedStream || '',
      ...context,
    });
  };

  const handleVoiceNoteCreated = async (summarizedText: string) => {
    // Save the voice note
    const context = getContextInfo();
    await addNote({
      id: `note_${Date.now()}`,
      title: `Note from ${context.currentSubject || 'Study'}`,
      originalTranscript: summarizedText,
      summarizedContent: summarizedText,
      subject: context.currentSubject,
      chapter: context.currentChapter,
      tags: context.currentSubject ? [context.currentSubject] : [],
      duration: 0,
      language: 'en',
      isStarred: false,
    });

    setShowVoiceRecorder(false);
    
    // Also send it as a message to Smarty for discussion
    setInputText(summarizedText);
    Alert.alert(
      'Note Created!',
      'Your voice note has been saved and added to the chat. You can now discuss it with Smarty!',
      [
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const handleSearch = () => {
    const query = sanitizeText(searchQuery, { maxLength: 80, preserveNewlines: false });
    if (query.trim()) {
      const results = useChatStore.getState().searchMessages(query);
      if (results.length === 0) {
        addMessage('assistant', `No previous messages found for "${query}". Try a different search term!`);
      } else {
        addMessage('assistant', `Found ${results.length} previous message(s) about "${query}". Keep learning! 💪`);
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

  const styles = getStyles(colors, isDark, fullScreen);

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
              I'm here to help you learn! You can even upload images of your homework or textbook.
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
              message.status === 'stopped' && styles.stoppedMessageWrapper,
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
                message.status === 'stopped' && styles.stoppedBubble,
              ]}
            >
              {/* Render Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <View style={styles.messageAttachments}>
                  {message.attachments.map((att, idx) => (
                    <View key={idx} style={styles.messageAttachmentItem}>
                      {att.type === 'image' ? (
                        <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
                      ) : (
                        <View style={styles.attachmentFile}>
                          <Text>📄 {att.name}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  message.status === 'stopped' && styles.stoppedMessageText,
                ]}
              >
                {message.content}
              </Text>
              
              {message.status === 'stopped' && (
                <Text style={styles.stoppedLabel}>Response cancelled</Text>
              )}

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

        {/* Typing Indicator & stop button */}
        {isTyping && (
          <View style={styles.typingWrapper}>
            <View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>🎓</Text>
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.analyzingContainer}>
                  <Text style={[styles.analyzingText, { color: colors.textSecondary }]}>
                    Smarty is analyzing...
                  </Text>
                  <View style={styles.typingContainer}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <View style={styles.stopIcon} />
              <Text style={styles.stopText}>Stop Responding</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      {!isTyping && messages.length > 0 && attachments.length === 0 && (
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

      {/* Attachment Preview Area */}
      {attachments.length > 0 && (
        <View style={styles.attachmentPreviews}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map((att, index) => (
              att.type === 'image' ? (
                <ImagePreview key={index} uri={att.uri} onRemove={() => removeAttachment(index)} />
              ) : (
                <FilePreview key={index} name={att.name} onRemove={() => removeAttachment(index)} />
              )
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.uploadControls}>
          <FileUploadButton icon="🎙️" label="Voice" onPress={() => setShowVoiceRecorder(true)} />
          <FileUploadButton icon="📸" label="Camera" onPress={() => handlePickImage(true)} />
          <FileUploadButton icon="🖼️" label="Gallery" onPress={() => handlePickImage(false)} />
          <FileUploadButton icon="📁" label="File" onPress={handlePickFile} />
          <Text style={styles.limitCounter}>{remainingImages}/6 images left</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() && attachments.length === 0) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() && attachments.length === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Voice Recorder Modal */}
      <Modal
        visible={showVoiceRecorder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVoiceRecorder(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Voice Note</Text>
            <VoiceRecorder
              onTranscriptionComplete={handleVoiceNoteCreated}
              subject={getContextInfo().currentSubject}
              chapter={getContextInfo().currentChapter}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowVoiceRecorder(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean, fullScreen: boolean) =>
  StyleSheet.create({
    container: {
      position: fullScreen ? 'relative' : 'absolute',
      bottom: fullScreen ? 0 : 80,
      right: fullScreen ? 0 : 16,
      width: fullScreen ? '100%' : 360,
      height: fullScreen ? '100%' : 'auto',
      maxHeight: fullScreen ? '100%' : MAX_CHAT_HEIGHT,
      backgroundColor: colors.cardBackground,
      borderRadius: fullScreen ? 0 : BorderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: fullScreen ? 0 : 1,
      borderColor: colors.border,
      overflow: 'hidden',
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      backgroundColor: colors.primary,
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
    avatarEmoji: { fontSize: 24 },
    headerTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.white,
    },
    headerSubtitle: {
      fontSize: FontSizes.xs,
      color: colors.white + 'CC',
    },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    headerButton: { padding: Spacing.sm, marginRight: Spacing.sm },
    headerButtonText: { fontSize: 18 },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.white + '33',
      alignItems: 'center',
      justifyContent: 'center',
      display: fullScreen ? 'none' : 'flex',
    },
    closeButtonText: { fontSize: 18, color: colors.white, fontWeight: FontWeights.bold },
    searchContainer: {
      flexDirection: 'row',
      padding: Spacing.sm,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.cardBackground,
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
    searchButtonText: { color: colors.white, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: { padding: Spacing.md },
    welcomeContainer: { alignItems: 'center', paddingVertical: Spacing.xl },
    welcomeEmoji: { fontSize: 48, marginBottom: Spacing.md },
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
    quickRepliesContainer: { alignItems: 'center' },
    quickRepliesLabel: { fontSize: FontSizes.xs, color: colors.textSecondary, marginBottom: Spacing.sm },
    quickRepliesScroll: { maxHeight: 40, marginBottom: Spacing.sm },
    quickRepliesContent: { paddingHorizontal: Spacing.md },
    quickReplyChip: {
      backgroundColor: colors.border,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      marginHorizontal: Spacing.xs,
    },
    quickReplyText: { fontSize: FontSizes.xs, color: colors.primary, fontWeight: FontWeights.medium },
    messageWrapper: { flexDirection: 'row', marginBottom: Spacing.sm, alignItems: 'flex-end' },
    userMessageWrapper: { justifyContent: 'flex-end' },
    assistantMessageWrapper: { justifyContent: 'flex-start' },
    stoppedMessageWrapper: { opacity: 0.7 },
    messageAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + '33',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.xs,
    },
    messageAvatarText: { fontSize: 16 },
    messageBubble: { maxWidth: '80%', padding: Spacing.md, borderRadius: BorderRadius.lg },
    userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: BorderRadius.sm },
    assistantBubble: { backgroundColor: colors.border, borderBottomLeftRadius: BorderRadius.sm },
    stoppedBubble: { backgroundColor: colors.border + '88' },
    messageText: { fontSize: FontSizes.md, lineHeight: 22 },
    userMessageText: { color: colors.white },
    assistantMessageText: { color: colors.text },
    stoppedMessageText: { color: colors.textSecondary },
    messageTime: { fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 4, alignSelf: 'flex-end' },
    userMessageTime: { color: 'rgba(255,255,255,0.6)' },
    assistantMessageTime: { color: 'rgba(0,0,0,0.4)' },
    typingWrapper: { marginBottom: Spacing.md },
    analyzingContainer: { flexDirection: 'row', alignItems: 'center' },
    analyzingText: { fontSize: 12, marginRight: 8, fontStyle: 'italic' },
    typingContainer: { flexDirection: 'row', alignItems: 'center', height: 20 },
    typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginHorizontal: 2 },
    typingDot1: { opacity: 0.4 },
    typingDot2: { opacity: 0.7 },
    typingDot3: { opacity: 1.0 },
    stopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: Spacing.sm,
      backgroundColor: '#FFE5E5',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: '#FF4D4D',
    },
    stopIcon: { width: 10, height: 10, backgroundColor: '#FF4D4D', marginRight: 6 },
    stopText: { color: '#FF4D4D', fontSize: 12, fontWeight: 'bold' },
    stoppedLabel: { fontSize: 10, color: '#FF4D4D', fontStyle: 'italic', marginTop: 4 },
    attachmentPreviews: { padding: Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
    uploadControls: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.xs,
    },
    limitCounter: { fontSize: 10, color: colors.textSecondary, marginLeft: 'auto' },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.sm,
      backgroundColor: colors.cardBackground,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSizes.md,
      color: colors.text,
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Spacing.sm,
    },
    sendButtonDisabled: { backgroundColor: colors.border },
    sendButtonText: { color: colors.white, fontWeight: 'bold' },
    messageAttachments: { marginBottom: Spacing.xs },
    messageAttachmentItem: { borderRadius: BorderRadius.md, overflow: 'hidden', marginBottom: Spacing.xs },
    attachmentImage: { width: 200, height: 150, resizeMode: 'cover' },
    attachmentFile: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    quickReplyButton: {
      backgroundColor: colors.border,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginHorizontal: Spacing.xs,
      height: 36,
      justifyContent: 'center',
    },
    quickReplyButtonText: {
      fontSize: FontSizes.sm,
      color: colors.primary,
      fontWeight: FontWeights.medium,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: isDark ? colors.text : colors.charcoal,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    modalCloseButton: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.lightGray,
      alignItems: 'center',
    },
    modalCloseButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
    },
  });
