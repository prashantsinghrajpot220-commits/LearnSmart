"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SmartyChat;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var chatStore_1 = require("@/store/chatStore");
var SmartyAIService_1 = require("@/services/SmartyAIService");
var ChatContext_1 = require("@/context/ChatContext");
var userStore_1 = require("@/store/userStore");
var sanitizer_1 = require("@/utils/sanitizer");
var FileUploadService_1 = require("@/services/FileUploadService");
var uploadLimits_1 = require("@/utils/uploadLimits");
var StreamingService_1 = require("@/services/StreamingService");
var FileUploadButton_1 = require("@/components/FileUploadButton");
var ImagePreview_1 = require("@/components/ImagePreview");
var FilePreview_1 = require("@/components/FilePreview");
var VoiceRecorder_1 = require("@/components/VoiceRecorder");
var voiceNoteStore_1 = require("@/store/voiceNoteStore");
var SCREEN_HEIGHT = react_native_1.Dimensions.get('window').height;
var MAX_CHAT_HEIGHT = SCREEN_HEIGHT * 0.7;
function SmartyChat(_a) {
    var _this = this;
    var onClose = _a.onClose, _b = _a.fullScreen, fullScreen = _b === void 0 ? false : _b;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var userName = (0, userStore_1.useUserStore)().userName;
    var getContextInfo = (0, ChatContext_1.useSmartyContext)().getContextInfo;
    var _d = (0, chatStore_1.useChatStore)(), messages = _d.messages, isTyping = _d.isTyping, addMessage = _d.addMessage;
    var addNote = (0, voiceNoteStore_1.useVoiceNoteStore)().addNote;
    var _e = (0, react_1.useState)(''), inputText = _e[0], setInputText = _e[1];
    var _f = (0, react_1.useState)(false), showSearch = _f[0], setShowSearch = _f[1];
    var _g = (0, react_1.useState)(''), searchQuery = _g[0], setSearchQuery = _g[1];
    var _h = (0, react_1.useState)([]), attachments = _h[0], setAttachments = _h[1];
    var _j = (0, react_1.useState)(6), remainingImages = _j[0], setRemainingImages = _j[1];
    var _k = (0, react_1.useState)(false), showVoiceRecorder = _k[0], setShowVoiceRecorder = _k[1];
    var scrollViewRef = (0, react_1.useRef)(null);
    var scrollToBottom = (0, react_1.useCallback)(function () {
        setTimeout(function () {
            var _a;
            (_a = scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd({ animated: true });
        }, 100);
    }, []);
    (0, react_1.useEffect)(function () {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        var fetchRemaining = function () { return __awaiter(_this, void 0, void 0, function () {
            var remaining;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, uploadLimits_1.getRemainingImages)()];
                    case 1:
                        remaining = _a.sent();
                        if (isMounted) {
                            setRemainingImages(remaining);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchRemaining();
        return function () {
            isMounted = false;
        };
    }, []);
    var updateRemainingImages = function () { return __awaiter(_this, void 0, void 0, function () {
        var remaining;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, uploadLimits_1.getRemainingImages)()];
                case 1:
                    remaining = _a.sent();
                    setRemainingImages(remaining);
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePickImage = function (useCamera) { return __awaiter(_this, void 0, void 0, function () {
        var att, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, FileUploadService_1.pickImage)(useCamera)];
                case 1:
                    att = _a.sent();
                    if (att) {
                        setAttachments(__spreadArray(__spreadArray([], attachments, true), [att], false));
                        updateRemainingImages();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'An unknown error occurred';
                    react_native_1.Alert.alert('Upload Error', errorMessage);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePickFile = function () { return __awaiter(_this, void 0, void 0, function () {
        var att, error_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, FileUploadService_1.pickDocument)()];
                case 1:
                    att = _a.sent();
                    if (att) {
                        setAttachments(__spreadArray(__spreadArray([], attachments, true), [att], false));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    errorMessage = error_2 instanceof Error ? error_2.message : 'An unknown error occurred';
                    react_native_1.Alert.alert('Upload Error', errorMessage);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var removeAttachment = function (index) {
        var newAtts = __spreadArray([], attachments, true);
        newAtts.splice(index, 1);
        setAttachments(newAtts);
    };
    var handleStop = function () {
        StreamingService_1.StreamingService.stop('default_chat');
    };
    var handleSend = function () { return __awaiter(_this, void 0, void 0, function () {
        var userMessage, currentAttachments, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userMessage = (0, sanitizer_1.sanitizeText)(inputText, { maxLength: 1000 });
                    if (!userMessage.trim() && attachments.length === 0)
                        return [2 /*return*/];
                    currentAttachments = __spreadArray([], attachments, true);
                    setInputText('');
                    setAttachments([]);
                    addMessage('user', userMessage, currentAttachments);
                    context = getContextInfo();
                    return [4 /*yield*/, (0, SmartyAIService_1.sendMessageToSmarty)(userMessage, __assign({ userName: userName || 'Student', selectedClass: userStore_1.useUserStore.getState().selectedClass || '', selectedStream: userStore_1.useUserStore.getState().selectedStream || '' }, context), currentAttachments)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleQuickReply = function (reply) { return __awaiter(_this, void 0, void 0, function () {
        var safeReply, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    safeReply = (0, sanitizer_1.sanitizeText)(reply, { maxLength: 500 });
                    setInputText('');
                    addMessage('user', safeReply);
                    context = getContextInfo();
                    return [4 /*yield*/, (0, SmartyAIService_1.sendMessageToSmarty)(safeReply, __assign({ userName: userName || 'Student', selectedClass: userStore_1.useUserStore.getState().selectedClass || '', selectedStream: userStore_1.useUserStore.getState().selectedStream || '' }, context))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleVoiceNoteCreated = function (summarizedText) { return __awaiter(_this, void 0, void 0, function () {
        var context, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = getContextInfo();
                    now = Date.now();
                    return [4 /*yield*/, addNote({
                            id: "note_".concat(now),
                            title: "Note from ".concat(context.subject || 'Study'),
                            originalTranscript: summarizedText,
                            summarizedContent: summarizedText,
                            subject: context.subject,
                            chapter: context.chapter,
                            tags: context.subject ? [context.subject] : [],
                            duration: 0,
                            language: 'en',
                            isStarred: false,
                            createdAt: now,
                            updatedAt: now,
                        })];
                case 1:
                    _a.sent();
                    setShowVoiceRecorder(false);
                    // Also send it as a message to Smarty for discussion
                    setInputText(summarizedText);
                    react_native_1.Alert.alert('Note Created!', 'Your voice note has been saved and added to the chat. You can now discuss it with Smarty!', [
                        { text: 'OK', style: 'default' },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSearch = function () {
        var query = (0, sanitizer_1.sanitizeText)(searchQuery, { maxLength: 80, preserveNewlines: false });
        if (query.trim()) {
            var results = chatStore_1.useChatStore.getState().searchMessages(query);
            if (results.length === 0) {
                addMessage('assistant', "No previous messages found for \"".concat(query, "\". Try a different search term!"));
            }
            else {
                addMessage('assistant', "Found ".concat(results.length, " previous message(s) about \"").concat(query, "\". Keep learning! \uD83D\uDCAA"));
            }
            setSearchQuery('');
            setShowSearch(false);
        }
    };
    var filteredMessages = showSearch && searchQuery
        ? messages.filter(function (msg) {
            return msg.role === 'user' && msg.content.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : messages;
    var styles = getStyles(colors, isDark, fullScreen);
    return (<react_native_1.View style={styles.container}>
      {/* Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.headerLeft}>
          <react_native_1.View style={styles.avatarContainer}>
            <react_native_1.Text style={styles.avatarEmoji}>🎓</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View>
            <react_native_1.Text style={styles.headerTitle}>Smarty</react_native_1.Text>
            <react_native_1.Text style={styles.headerSubtitle}>Your study buddy</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.View style={styles.headerActions}>
          <react_native_1.TouchableOpacity style={styles.headerButton} onPress={function () { return setShowSearch(!showSearch); }} activeOpacity={0.7}>
            <react_native_1.Text style={styles.headerButtonText}>🔍</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <react_native_1.Text style={styles.closeButtonText}>✕</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>

      {/* Search Bar */}
      {showSearch && (<react_native_1.View style={styles.searchContainer}>
          <react_native_1.TextInput style={styles.searchInput} placeholder="Search conversations..." placeholderTextColor={colors.textSecondary} value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch}/>
          <react_native_1.TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.7}>
            <react_native_1.Text style={styles.searchButtonText}>Search</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>)}

      {/* Messages */}
      <react_native_1.ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        {messages.length === 0 && (<react_native_1.View style={styles.welcomeContainer}>
            <react_native_1.Text style={styles.welcomeEmoji}>👋</react_native_1.Text>
            <react_native_1.Text style={styles.welcomeTitle}>Hi! I'm Smarty!</react_native_1.Text>
            <react_native_1.Text style={styles.welcomeText}>
              I'm here to help you learn! You can even upload images of your homework or textbook.
            </react_native_1.Text>
            <react_native_1.View style={styles.quickRepliesContainer}>
              <react_native_1.Text style={styles.quickRepliesLabel}>Quick starts:</react_native_1.Text>
              {(0, SmartyAIService_1.getQuickReplies)().slice(0, 3).map(function (reply, index) { return (<react_native_1.TouchableOpacity key={index} style={styles.quickReplyChip} onPress={function () { return handleQuickReply(reply); }} activeOpacity={0.7}>
                  <react_native_1.Text style={styles.quickReplyText}>{reply}</react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
            </react_native_1.View>
          </react_native_1.View>)}

        {filteredMessages.map(function (message) { return (<react_native_1.View key={message.id} style={[
                styles.messageWrapper,
                message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
                message.status === 'stopped' && styles.stoppedMessageWrapper,
            ]}>
            {message.role === 'assistant' && (<react_native_1.View style={styles.messageAvatar}>
                <react_native_1.Text style={styles.messageAvatarText}>🎓</react_native_1.Text>
              </react_native_1.View>)}
            <react_native_1.View style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                message.status === 'stopped' && styles.stoppedBubble,
            ]}>
              {/* Render Attachments */}
              {message.attachments && message.attachments.length > 0 && (<react_native_1.View style={styles.messageAttachments}>
                  {message.attachments.map(function (att, idx) { return (<react_native_1.View key={idx} style={styles.messageAttachmentItem}>
                      {att.type === 'image' ? (<react_native_1.Image source={{ uri: att.uri }} style={styles.attachmentImage}/>) : (<react_native_1.View style={styles.attachmentFile}>
                          <react_native_1.Text>📄 {att.name}</react_native_1.Text>
                        </react_native_1.View>)}
                    </react_native_1.View>); })}
                </react_native_1.View>)}
              
              <react_native_1.Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                message.status === 'stopped' && styles.stoppedMessageText,
            ]}>
                {message.content}
              </react_native_1.Text>
              
              {message.status === 'stopped' && (<react_native_1.Text style={styles.stoppedLabel}>Response cancelled</react_native_1.Text>)}

              <react_native_1.Text style={[
                styles.messageTime,
                message.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime,
            ]}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            })}
              </react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>); })}

        {/* Typing Indicator & stop button */}
        {isTyping && (<react_native_1.View style={styles.typingWrapper}>
            <react_native_1.View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
              <react_native_1.View style={styles.messageAvatar}>
                <react_native_1.Text style={styles.messageAvatarText}>🎓</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={[styles.messageBubble, styles.assistantBubble]}>
                <react_native_1.View style={styles.analyzingContainer}>
                  <react_native_1.Text style={[styles.analyzingText, { color: colors.textSecondary }]}>
                    Smarty is analyzing...
                  </react_native_1.Text>
                  <react_native_1.View style={styles.typingContainer}>
                    <react_native_1.View style={[styles.typingDot, styles.typingDot1]}/>
                    <react_native_1.View style={[styles.typingDot, styles.typingDot2]}/>
                    <react_native_1.View style={[styles.typingDot, styles.typingDot3]}/>
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <react_native_1.View style={styles.stopIcon}/>
              <react_native_1.Text style={styles.stopText}>Stop Responding</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>)}
      </react_native_1.ScrollView>

      {/* Quick Replies */}
      {!isTyping && messages.length > 0 && attachments.length === 0 && (<react_native_1.ScrollView horizontal style={styles.quickRepliesScroll} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesContent}>
          {(0, SmartyAIService_1.getQuickReplies)().map(function (reply, index) { return (<react_native_1.TouchableOpacity key={index} style={styles.quickReplyButton} onPress={function () { return handleQuickReply(reply); }} activeOpacity={0.7}>
              <react_native_1.Text style={styles.quickReplyButtonText}>{reply}</react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.ScrollView>)}

      {/* Attachment Preview Area */}
      {attachments.length > 0 && (<react_native_1.View style={styles.attachmentPreviews}>
          <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map(function (att, index) { return (att.type === 'image' ? (<ImagePreview_1.default key={index} uri={att.uri} onRemove={function () { return removeAttachment(index); }}/>) : (<FilePreview_1.default key={index} name={att.name} onRemove={function () { return removeAttachment(index); }}/>)); })}
          </react_native_1.ScrollView>
        </react_native_1.View>)}

      {/* Input Area */}
      <react_native_1.KeyboardAvoidingView behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={react_native_1.Platform.OS === 'ios' ? 90 : 0}>
        <react_native_1.View style={styles.uploadControls}>
          <FileUploadButton_1.default icon="🎙️" label="Voice" onPress={function () { return setShowVoiceRecorder(true); }}/>
          <FileUploadButton_1.default icon="📸" label="Camera" onPress={function () { return handlePickImage(true); }}/>
          <FileUploadButton_1.default icon="🖼️" label="Gallery" onPress={function () { return handlePickImage(false); }}/>
          <FileUploadButton_1.default icon="📁" label="File" onPress={handlePickFile}/>
          <react_native_1.Text style={styles.limitCounter}>{remainingImages}/6 images left</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.inputContainer}>
          <react_native_1.TextInput style={styles.textInput} placeholder="Ask me anything..." placeholderTextColor={colors.textSecondary} value={inputText} onChangeText={setInputText} onSubmitEditing={handleSend} multiline maxLength={1000}/>
          <react_native_1.TouchableOpacity style={[styles.sendButton, (!inputText.trim() && attachments.length === 0) && styles.sendButtonDisabled]} onPress={handleSend} disabled={!inputText.trim() && attachments.length === 0} activeOpacity={0.7}>
            <react_native_1.Text style={styles.sendButtonText}>Send</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.KeyboardAvoidingView>

      {/* Voice Recorder Modal */}
      <react_native_1.Modal visible={showVoiceRecorder} animationType="slide" transparent={true} onRequestClose={function () { return setShowVoiceRecorder(false); }}>
        <react_native_1.View style={styles.modalContainer}>
          <react_native_1.View style={styles.modalContent}>
            <react_native_1.Text style={styles.modalTitle}>Create Voice Note</react_native_1.Text>
            <VoiceRecorder_1.default onTranscriptionComplete={handleVoiceNoteCreated} subject={getContextInfo().subject} chapter={getContextInfo().chapter}/>
            <react_native_1.TouchableOpacity style={styles.modalCloseButton} onPress={function () { return setShowVoiceRecorder(false); }}>
              <react_native_1.Text style={styles.modalCloseButtonText}>Cancel</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark, fullScreen) {
    return react_native_1.StyleSheet.create({
        container: {
            position: fullScreen ? 'relative' : 'absolute',
            bottom: fullScreen ? 0 : 80,
            right: fullScreen ? 0 : 16,
            width: fullScreen ? '100%' : 360,
            height: fullScreen ? '100%' : 'auto',
            maxHeight: fullScreen ? '100%' : MAX_CHAT_HEIGHT,
            backgroundColor: colors.cardBackground,
            borderRadius: fullScreen ? 0 : theme_1.BorderRadius.xl,
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
            padding: theme_1.Spacing.md,
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
            marginRight: theme_1.Spacing.sm,
        },
        avatarEmoji: { fontSize: 24 },
        headerTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.white,
        },
        headerSubtitle: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.white + 'CC',
        },
        headerActions: { flexDirection: 'row', alignItems: 'center' },
        headerButton: { padding: theme_1.Spacing.sm, marginRight: theme_1.Spacing.sm },
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
        closeButtonText: { fontSize: 18, color: colors.white, fontWeight: theme_1.FontWeights.bold },
        searchContainer: {
            flexDirection: 'row',
            padding: theme_1.Spacing.sm,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchInput: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.md,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            marginRight: theme_1.Spacing.sm,
        },
        searchButton: {
            backgroundColor: colors.primary,
            borderRadius: theme_1.BorderRadius.md,
            paddingHorizontal: theme_1.Spacing.md,
            justifyContent: 'center',
        },
        searchButtonText: { color: colors.white, fontSize: theme_1.FontSizes.sm, fontWeight: theme_1.FontWeights.semibold },
        messagesContainer: {
            flex: 1,
        },
        messagesContent: { padding: theme_1.Spacing.md },
        welcomeContainer: { alignItems: 'center', paddingVertical: theme_1.Spacing.xl },
        welcomeEmoji: { fontSize: 48, marginBottom: theme_1.Spacing.md },
        welcomeTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        welcomeText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.lg,
            paddingHorizontal: theme_1.Spacing.md,
        },
        quickRepliesContainer: { alignItems: 'center' },
        quickRepliesLabel: { fontSize: theme_1.FontSizes.xs, color: colors.textSecondary, marginBottom: theme_1.Spacing.sm },
        quickRepliesScroll: { maxHeight: 40, marginBottom: theme_1.Spacing.sm },
        quickRepliesContent: { paddingHorizontal: theme_1.Spacing.md },
        quickReplyChip: {
            backgroundColor: colors.border,
            borderRadius: theme_1.BorderRadius.xl,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.xs,
            marginHorizontal: theme_1.Spacing.xs,
        },
        quickReplyText: { fontSize: theme_1.FontSizes.xs, color: colors.primary, fontWeight: theme_1.FontWeights.medium },
        messageWrapper: { flexDirection: 'row', marginBottom: theme_1.Spacing.sm, alignItems: 'flex-end' },
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
            marginRight: theme_1.Spacing.xs,
        },
        messageAvatarText: { fontSize: 16 },
        messageBubble: { maxWidth: '80%', padding: theme_1.Spacing.md, borderRadius: theme_1.BorderRadius.lg },
        userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: theme_1.BorderRadius.sm },
        assistantBubble: { backgroundColor: colors.border, borderBottomLeftRadius: theme_1.BorderRadius.sm },
        stoppedBubble: { backgroundColor: colors.border + '88' },
        messageText: { fontSize: theme_1.FontSizes.md, lineHeight: 22 },
        userMessageText: { color: colors.white },
        assistantMessageText: { color: colors.text },
        stoppedMessageText: { color: colors.textSecondary },
        messageTime: { fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 4, alignSelf: 'flex-end' },
        userMessageTime: { color: 'rgba(255,255,255,0.6)' },
        assistantMessageTime: { color: 'rgba(0,0,0,0.4)' },
        typingWrapper: { marginBottom: theme_1.Spacing.md },
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
            marginTop: theme_1.Spacing.sm,
            backgroundColor: '#FFE5E5',
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.xl,
            borderWidth: 1,
            borderColor: '#FF4D4D',
        },
        stopIcon: { width: 10, height: 10, backgroundColor: '#FF4D4D', marginRight: 6 },
        stopText: { color: '#FF4D4D', fontSize: 12, fontWeight: 'bold' },
        stoppedLabel: { fontSize: 10, color: '#FF4D4D', fontStyle: 'italic', marginTop: 4 },
        attachmentPreviews: { padding: theme_1.Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
        uploadControls: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.md,
            paddingTop: theme_1.Spacing.xs,
        },
        limitCounter: { fontSize: 10, color: colors.textSecondary, marginLeft: 'auto' },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme_1.Spacing.sm,
            backgroundColor: colors.cardBackground,
        },
        textInput: {
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.xl,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            fontSize: theme_1.FontSizes.md,
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
            marginLeft: theme_1.Spacing.sm,
        },
        sendButtonDisabled: { backgroundColor: colors.border },
        sendButtonText: { color: colors.white, fontWeight: 'bold' },
        messageAttachments: { marginBottom: theme_1.Spacing.xs },
        messageAttachmentItem: { borderRadius: theme_1.BorderRadius.md, overflow: 'hidden', marginBottom: theme_1.Spacing.xs },
        attachmentImage: { width: 200, height: 150, resizeMode: 'cover' },
        attachmentFile: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
        },
        quickReplyButton: {
            backgroundColor: colors.border,
            borderRadius: theme_1.BorderRadius.xl,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            marginHorizontal: theme_1.Spacing.xs,
            height: 36,
            justifyContent: 'center',
        },
        quickReplyButtonText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.primary,
            fontWeight: theme_1.FontWeights.medium,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.lg,
        },
        modalContent: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.xl,
            width: '100%',
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: isDark ? colors.text : colors.charcoal,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.lg,
        },
        modalCloseButton: {
            marginTop: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            backgroundColor: colors.lightGray,
            alignItems: 'center',
        },
        modalCloseButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
        },
    });
};
