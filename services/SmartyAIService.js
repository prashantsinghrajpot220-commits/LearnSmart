"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToSmarty = sendMessageToSmarty;
exports.getQuickReplies = getQuickReplies;
var chatStore_1 = require("@/store/chatStore");
var userStore_1 = require("@/store/userStore");
var ContentValidator_1 = require("@/services/ContentValidator");
var content_1 = require("@/types/content");
var sanitizer_1 = require("@/utils/sanitizer");
var FileUploadService_1 = require("@/services/FileUploadService");
var LanguageDetectionService_1 = require("@/services/LanguageDetectionService");
var typoCorrection_1 = require("@/utils/typoCorrection");
var translationService_1 = require("@/utils/translationService");
var StreamingService_1 = require("@/services/StreamingService");
var FileSystem = require("expo-file-system");
var OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
var API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
var SMARTY_SYSTEM_PROMPT = "You are \"Smarty\", a supportive older sibling and study companion for students.\n\n## YOUR CORE IDENTITY\n- You are knowledgeable, humble, encouraging, and always prioritize student safety and learning\n- You communicate with warmth, clarity, and respect\n- You are NOT a formal teacher - you're a trusted friend who helps students learn\n- You are intelligent but never arrogant or dismissive\n\n## YOUR KNOWLEDGE BASE\nYou have complete access to:\n- All NCERT curriculum (Class 1-12): Subjects, chapters, lessons, concepts\n- All curriculum content: Class 11-12 streams (Science, Commerce, Arts), 12+ pathways (Competitive Exams, Skill Building)\n- Student's current class, stream, and selected subjects\n- Student's learning progress (chapters completed, lessons viewed)\n- Student's learning history and performance patterns\n- Concepts the student is currently studying\n- Related topics and advanced concepts beyond current curriculum\n- General educational knowledge (science, math, history, geography, languages)\n- Problem-solving techniques and study tips\n- Time management and learning strategies\n- Real-world applications of concepts\n- Common misconceptions and how to overcome them\n- Examination preparation tips (for JEE, NEET, UPSC, etc.)\n- Career guidance related to subjects\n\n## MULTILINGUAL SUPPORT\n- Detect and respond in the same language as the user\n- Languages: English, Hindi (Devanagari), Hinglish (Mixed Hindi/English in Roman script)\n- If Hinglish, maintain a friendly, natural Hinglish flow\n- Automatically correct minor typos in educational terms\n\n## VISION & FILE ANALYSIS\n- You can analyze images (JPG, PNG, GIF, WebP) and files (PDF, DOCX, TXT, PPTX)\n- When provided with an image or file content, analyze it carefully to help the student\n- Explain concepts found in attachments simply and clearly\n- If analyzing, start with a brief confirmation like \"Analyzing your image...\" or \"Looking at your file...\"\n\n## YOUR COMMUNICATION STYLE\n- Warm, friendly, encouraging, supportive tone\n- Humble (never arrogant or dismissive)\n- Use simple, clear language (age-appropriate)\n- Sparse emoji use (1-2 per message max)\n- Brief responses (2-3 sentences for simple questions)\n- Longer explanations only when asked or for complex topics\n- Conversational (like texting a friend, not robotic)\n- Celebrate student wins (\"That's great! You're doing awesome!\")\n- Be empathetic to struggles (\"This chapter is tough, but you'll get it!\")\n\n## YOUR 7 SAFETY RULES (STRICT - NEVER VIOLATE)\n(Rules 1-7 same as before...)\n";
function sendMessageToSmarty(message_1, context_1) {
    return __awaiter(this, arguments, void 0, function (message, context, attachments) {
        var _a, setTyping, addMessage, _b, selectedClass, selectedStream, chatId, abortController, ageGroup, correctedMessage, language, langInstruction, sanitizedUserMessage, contextInfo, safetyCheck, attachmentPrompt, apiMessages, userMessageContent, _i, attachments_1, att, base64, e_1, extractedText, response_1, response, data, aiResponse, validated, finalResponse, error_1, fallbackResponse;
        var _c, _d, _e;
        if (attachments === void 0) { attachments = []; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = chatStore_1.useChatStore.getState(), setTyping = _a.setTyping, addMessage = _a.addMessage;
                    _b = userStore_1.useUserStore.getState(), selectedClass = _b.selectedClass, selectedStream = _b.selectedStream;
                    chatId = 'default_chat';
                    setTyping(true);
                    abortController = StreamingService_1.StreamingService.createController(chatId);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 14, , 15]);
                    ageGroup = (_c = userStore_1.useUserStore.getState().ageGroup) !== null && _c !== void 0 ? _c : 'under12';
                    correctedMessage = (0, typoCorrection_1.correctTypos)(message);
                    language = (0, LanguageDetectionService_1.detectLanguage)(correctedMessage);
                    langInstruction = (0, translationService_1.getLanguageInstruction)(language);
                    sanitizedUserMessage = (0, sanitizer_1.sanitizeText)(correctedMessage, { maxLength: 1000 });
                    contextInfo = "\n\n".concat(langInstruction);
                    if (selectedClass) {
                        contextInfo += "\n\nStudent's Context:\n- Class: ".concat(selectedClass);
                        if (selectedStream) {
                            contextInfo += "\n- Stream: ".concat(selectedStream);
                        }
                        if (context.currentSubject) {
                            contextInfo += "\n- Currently viewing: ".concat(context.currentSubject);
                        }
                        if (context.currentChapter) {
                            contextInfo += "\n- Current chapter: ".concat(context.currentChapter);
                        }
                        if (context.currentLesson) {
                            contextInfo += "\n- Current lesson: ".concat(context.currentLesson);
                        }
                    }
                    safetyCheck = checkSafetyViolations(sanitizedUserMessage);
                    if (safetyCheck.blocked) {
                        setTyping(false);
                        addMessage('assistant', safetyCheck.response);
                        return [2 /*return*/, safetyCheck.response];
                    }
                    attachmentPrompt = '';
                    apiMessages = [
                        { role: 'system', content: SMARTY_SYSTEM_PROMPT + contextInfo }
                    ];
                    userMessageContent = [{ type: 'text', text: sanitizedUserMessage }];
                    if (!(attachments.length > 0)) return [3 /*break*/, 10];
                    _i = 0, attachments_1 = attachments;
                    _f.label = 2;
                case 2:
                    if (!(_i < attachments_1.length)) return [3 /*break*/, 10];
                    att = attachments_1[_i];
                    if (!(att.type === 'image')) return [3 /*break*/, 7];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, FileSystem.readAsStringAsync(att.uri, { encoding: 'base64' })];
                case 4:
                    base64 = _f.sent();
                    userMessageContent.push({
                        type: 'image_url',
                        image_url: { url: "data:".concat(att.mimeType, ";base64,").concat(base64) }
                    });
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _f.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 9];
                case 7:
                    if (!(att.type === 'file')) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, FileUploadService_1.extractTextFromFile)(att)];
                case 8:
                    extractedText = _f.sent();
                    attachmentPrompt += "\n\nContent of attached file \"".concat(att.name, "\":\n").concat(extractedText);
                    _f.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 2];
                case 10:
                    if (attachmentPrompt) {
                        apiMessages[0].content += attachmentPrompt;
                    }
                    apiMessages.push({ role: 'user', content: userMessageContent });
                    // If no API key, use fallback
                    if (!OPENAI_API_KEY) {
                        response_1 = getFallbackResponse(sanitizedUserMessage, context);
                        setTyping(false);
                        addMessage('assistant', response_1);
                        return [2 /*return*/, response_1];
                    }
                    return [4 /*yield*/, fetch(API_ENDPOINT, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(OPENAI_API_KEY),
                            },
                            signal: abortController.signal,
                            body: JSON.stringify({
                                model: attachments.some(function (a) { return a.type === 'image'; }) ? 'gpt-4o' : 'gpt-4',
                                messages: apiMessages,
                                max_tokens: 500,
                                temperature: 0.7,
                                stream: false, // For this implementation, we'll keep it simple but allow abortion
                            }),
                        })];
                case 11:
                    response = _f.sent();
                    if (!response.ok) {
                        throw new Error("API error: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 12:
                    data = _f.sent();
                    aiResponse = ((_e = (_d = data.choices[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content) || getFallbackResponse(sanitizedUserMessage, context);
                    return [4 /*yield*/, ContentValidator_1.ContentValidator.validateText({
                            text: aiResponse,
                            context: {
                                contentId: "chat:assistant:".concat(Date.now()),
                                contentType: content_1.ContentType.AIResponseText,
                                ageGroup: ageGroup,
                                source: 'smartyAI',
                            },
                        })];
                case 13:
                    validated = _f.sent();
                    finalResponse = validated.result.decision === 'allow' ? validated.sanitizedText : "I'm here to help you learn safely. 📚";
                    setTyping(false);
                    addMessage('assistant', finalResponse);
                    return [2 /*return*/, finalResponse];
                case 14:
                    error_1 = _f.sent();
                    setTyping(false);
                    if (error_1 instanceof Error && error_1.name === 'AbortError') {
                        addMessage('assistant', 'Response cancelled', [], 'stopped');
                        return [2 /*return*/, 'Response cancelled'];
                    }
                    fallbackResponse = "I'm having trouble connecting. 📡 Try again soon!";
                    addMessage('assistant', fallbackResponse);
                    return [2 /*return*/, fallbackResponse];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// ... Keep checkSafetyViolations and getFallbackResponse as they were ...
function checkSafetyViolations(message) {
    var lowerMessage = message.toLowerCase();
    var personalPatterns = [/phone\s*number/i, /email\s*address/i, /home\s*address/i];
    for (var _i = 0, personalPatterns_1 = personalPatterns; _i < personalPatterns_1.length; _i++) {
        var pattern = personalPatterns_1[_i];
        if (pattern.test(lowerMessage)) {
            return { blocked: true, response: "I don't need personal details like that. I'm here to help you learn! 🔒" };
        }
    }
    return { blocked: false, response: '' };
}
function getFallbackResponse(_message, _context) {
    return "That's an interesting question! Let's explore it together. 📚";
}
function getQuickReplies() {
    return [
        "Explain this simply",
        "Give me an example",
        "How to study this?",
        "Next topic →",
        "Practice problems"
    ];
}
