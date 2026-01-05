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
exports.useVoiceNoteStore = void 0;
var zustand_1 = require("zustand");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var VOICE_NOTES_STORAGE_KEY = 'learnsmart_voice_notes';
exports.useVoiceNoteStore = (0, zustand_1.create)(function (set, get) { return ({
    notes: [],
    currentNote: null,
    isRecording: false,
    isTranscribing: false,
    isSummarizing: false,
    addNote: function (note) { return __awaiter(void 0, void 0, void 0, function () {
        var newNote_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newNote_1 = __assign(__assign({}, note), { id: note.id || "note_".concat(Date.now()), createdAt: note.createdAt || Date.now(), updatedAt: Date.now() });
                    set(function (state) { return ({
                        notes: __spreadArray(__spreadArray([], state.notes, true), [newNote_1], false),
                    }); });
                    return [4 /*yield*/, async_storage_1.default.setItem(VOICE_NOTES_STORAGE_KEY, JSON.stringify(get().notes))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateNote: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    set(function (state) { return ({
                        notes: state.notes.map(function (note) {
                            return note.id === id
                                ? __assign(__assign(__assign({}, note), updates), { updatedAt: Date.now() }) : note;
                        }),
                    }); });
                    return [4 /*yield*/, async_storage_1.default.setItem(VOICE_NOTES_STORAGE_KEY, JSON.stringify(get().notes))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    deleteNote: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    set(function (state) {
                        var _a;
                        return ({
                            notes: state.notes.filter(function (note) { return note.id !== id; }),
                            currentNote: ((_a = get().currentNote) === null || _a === void 0 ? void 0 : _a.id) === id ? null : get().currentNote,
                        });
                    });
                    return [4 /*yield*/, async_storage_1.default.setItem(VOICE_NOTES_STORAGE_KEY, JSON.stringify(get().notes))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getNoteById: function (id) {
        return get().notes.find(function (note) { return note.id === id; });
    },
    getNotesBySubject: function (subject) {
        return get().notes.filter(function (note) { return note.subject === subject; });
    },
    getNotesByTag: function (tag) {
        return get().notes.filter(function (note) { return note.tags.includes(tag); });
    },
    toggleStar: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var note;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    note = get().notes.find(function (n) { return n.id === id; });
                    if (!note) return [3 /*break*/, 2];
                    return [4 /*yield*/, get().updateNote(id, { isStarred: !note.isStarred })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    searchNotes: function (query) {
        var lowerQuery = query.toLowerCase();
        return get().notes.filter(function (note) {
            return note.title.toLowerCase().includes(lowerQuery) ||
                note.summarizedContent.toLowerCase().includes(lowerQuery) ||
                note.tags.some(function (tag) { return tag.toLowerCase().includes(lowerQuery); });
        });
    },
    setCurrentNote: function (note) {
        set({ currentNote: note });
    },
    setRecording: function (isRecording) {
        set({ isRecording: isRecording });
    },
    setTranscribing: function (isTranscribing) {
        set({ isTranscribing: isTranscribing });
    },
    setSummarizing: function (isSummarizing) {
        set({ isSummarizing: isSummarizing });
    },
    loadNotes: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, async_storage_1.default.getItem(VOICE_NOTES_STORAGE_KEY)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        set({ notes: JSON.parse(data) });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    clearAllNotes: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    set({ notes: [], currentNote: null });
                    return [4 /*yield*/, async_storage_1.default.removeItem(VOICE_NOTES_STORAGE_KEY)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
}); });
