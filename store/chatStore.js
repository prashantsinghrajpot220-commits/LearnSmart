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
exports.useChatStore = void 0;
var zustand_1 = require("zustand");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var CHAT_STORAGE_KEY = '@learnsmart_chat_history';
var MAX_MESSAGES = 100;
var MESSAGE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
exports.useChatStore = (0, zustand_1.create)(function (set, get) { return ({
    messages: [],
    isTyping: false,
    isChatOpen: false,
    addMessage: function (role, content, attachments, status) {
        if (status === void 0) { status = 'completed'; }
        var newMessage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            role: role,
            content: content,
            timestamp: Date.now(),
            attachments: attachments,
            status: status,
        };
        set(function (state) {
            var updatedMessages = __spreadArray(__spreadArray([], state.messages, true), [newMessage], false).slice(-MAX_MESSAGES);
            async_storage_1.default.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
            return { messages: updatedMessages };
        });
    },
    updateLastMessage: function (updates) {
        set(function (state) {
            if (state.messages.length === 0)
                return state;
            var updatedMessages = __spreadArray([], state.messages, true);
            var lastIndex = updatedMessages.length - 1;
            updatedMessages[lastIndex] = __assign(__assign({}, updatedMessages[lastIndex]), updates);
            async_storage_1.default.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
            return { messages: updatedMessages };
        });
    },
    clearMessages: function () {
        set({ messages: [] });
        async_storage_1.default.removeItem(CHAT_STORAGE_KEY);
    },
    toggleChat: function () {
        set(function (state) { return ({ isChatOpen: !state.isChatOpen }); });
    },
    closeChat: function () {
        set({ isChatOpen: false });
    },
    setTyping: function (typing) {
        set({ isTyping: typing });
    },
    loadChatHistory: function () { return __awaiter(void 0, void 0, void 0, function () {
        var stored, messages, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, async_storage_1.default.getItem(CHAT_STORAGE_KEY)];
                case 1:
                    stored = _a.sent();
                    if (stored) {
                        messages = JSON.parse(stored);
                        set({ messages: messages });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    searchMessages: function (query) {
        var messages = get().messages;
        if (!query.trim())
            return [];
        var lowerQuery = query.toLowerCase();
        return messages.filter(function (msg) {
            return msg.role === 'user' && msg.content.toLowerCase().includes(lowerQuery);
        });
    },
    deleteOldMessages: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (maxAge) {
            var messages, cutoffTime, filteredMessages;
            if (maxAge === void 0) { maxAge = MESSAGE_MAX_AGE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messages = get().messages;
                        cutoffTime = Date.now() - maxAge;
                        filteredMessages = messages.filter(function (msg) { return msg.timestamp > cutoffTime; });
                        if (!(filteredMessages.length !== messages.length)) return [3 /*break*/, 2];
                        set({ messages: filteredMessages });
                        return [4 /*yield*/, async_storage_1.default.setItem(CHAT_STORAGE_KEY, JSON.stringify(filteredMessages))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    },
}); });
