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
exports.speechToTextService = exports.SpeechToTextService = void 0;
exports.detectLanguageFromText = detectLanguageFromText;
// For production, you would use:
// - expo-speech (basic, free)
// - Google Cloud Speech-to-Text API
// - OpenAI Whisper API
// - Azure Speech Services
var SpeechToTextService = /** @class */ (function () {
    function SpeechToTextService() {
        this.recognition = null;
        this.isListening = false;
    }
    SpeechToTextService.getInstance = function () {
        if (!SpeechToTextService.instance) {
            SpeechToTextService.instance = new SpeechToTextService();
        }
        return SpeechToTextService.instance;
    };
    SpeechToTextService.prototype.isSupported = function () {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            return true;
        }
        if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
            return true;
        }
        return false;
    };
    SpeechToTextService.prototype.startListening = function (onResult_1, onError_1) {
        return __awaiter(this, arguments, void 0, function (onResult, onError, language) {
            var SpeechRecognition;
            var _this = this;
            if (language === void 0) { language = 'en'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isSupported()) {
                            onError('Speech recognition is not supported on this device');
                            return [2 /*return*/];
                        }
                        if (!this.isListening) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stopListening()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        try {
                            SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            this.recognition = new SpeechRecognition();
                            this.recognition.continuous = true;
                            this.recognition.interimResults = true;
                            this.recognition.lang = this.getLanguageCode(language);
                            this.recognition.maxAlternatives = 1;
                            this.recognition.onresult = function (event) {
                                var finalTranscript = '';
                                var interimTranscript = '';
                                for (var i = event.resultIndex; i < event.results.length; i++) {
                                    var transcript = event.results[i][0].transcript;
                                    if (event.results[i].isFinal) {
                                        finalTranscript += transcript;
                                    }
                                    else {
                                        interimTranscript += transcript;
                                    }
                                }
                                onResult({
                                    text: finalTranscript || interimTranscript,
                                    confidence: finalTranscript ? 1 : 0.7, // Lower confidence for interim results
                                    language: language,
                                    timestamp: Date.now(),
                                });
                            };
                            this.recognition.onerror = function (event) {
                                var errorMessage = _this.getErrorMessage(event.error);
                                onError(errorMessage);
                                _this.isListening = false;
                            };
                            this.recognition.onend = function () {
                                _this.isListening = false;
                            };
                            this.recognition.start();
                            this.isListening = true;
                        }
                        catch (error) {
                            onError('Failed to start speech recognition');
                            this.isListening = false;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SpeechToTextService.prototype.stopListening = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.recognition && this.isListening) {
                    try {
                        this.recognition.stop();
                    }
                    catch (error) {
                        // Error handled silently
                    }
                    this.isListening = false;
                }
                return [2 /*return*/];
            });
        });
    };
    SpeechToTextService.prototype.isCurrentlyListening = function () {
        return this.isListening;
    };
    SpeechToTextService.prototype.transcribeFromAudio = function (audioData_1) {
        return __awaiter(this, arguments, void 0, function (audioData, language) {
            if (language === void 0) { language = 'en'; }
            return __generator(this, function (_a) {
                // This would be implemented with a real speech-to-text API
                // For now, return a placeholder result
                // In production, you would:
                // 1. Send audio data to Whisper API, Google Cloud Speech, or similar
                // 2. Receive transcription
                // 3. Return the result
                return [2 /*return*/, {
                        text: 'Speech-to-text transcription would happen here using an external API like Google Cloud Speech-to-Text or Whisper API.',
                        confidence: 0.85,
                        language: language,
                        timestamp: Date.now(),
                    }];
            });
        });
    };
    SpeechToTextService.prototype.getLanguageCode = function (language) {
        switch (language) {
            case 'en':
                return 'en-US';
            case 'hi':
                return 'hi-IN';
            case 'hinglish':
                return 'en-IN'; // Best approximation for Hinglish
            default:
                return 'en-US';
        }
    };
    SpeechToTextService.prototype.getErrorMessage = function (error) {
        var errorMessages = {
            'no-speech': 'No speech detected. Please try again.',
            'audio-capture': 'Microphone not found or permission denied.',
            'not-allowed': 'Microphone permission was denied.',
            'network': 'Network error occurred. Please check your connection.',
            'aborted': 'Speech recognition was aborted.',
        };
        return errorMessages[error] || 'An error occurred during speech recognition.';
    };
    SpeechToTextService.prototype.requestPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof window === 'undefined')
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                    case 2:
                        stream = _a.sent();
                        // Stop the stream immediately - we just wanted to check permissions
                        stream.getTracks().forEach(function (track) { return track.stop(); });
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Fallback for when speech recognition is not available
    SpeechToTextService.prototype.getFallbackTranscription = function () {
        return {
            text: '',
            confidence: 0,
            language: 'en',
            timestamp: Date.now(),
        };
    };
    return SpeechToTextService;
}());
exports.SpeechToTextService = SpeechToTextService;
exports.speechToTextService = SpeechToTextService.getInstance();
// Utility function to detect language from text
function detectLanguageFromText(text) {
    var hindiRegex = /[\u0900-\u097F]/;
    var englishWords = text.match(/[a-zA-Z]+/g) || [];
    var totalWords = text.split(/\s+/).length;
    if (hindiRegex.test(text)) {
        return 'hi';
    }
    // If there's a mix of English and Hinglish patterns
    if (totalWords > 0 && englishWords.length / totalWords > 0.5) {
        return 'en';
    }
    return 'en'; // Default to English
}
