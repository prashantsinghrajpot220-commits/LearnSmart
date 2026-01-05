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
exports.qaSearchService = exports.QASearchService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var STORAGE_KEYS = {
    QUESTIONS: '@learnsmart/qa_questions',
    FAVORITES: '@learnsmart/qa_favorites',
    SEARCH_HISTORY: '@learnsmart/search_history',
};
var QASearchService = /** @class */ (function () {
    function QASearchService() {
        this.questionsCache = null;
    }
    QASearchService.getInstance = function () {
        if (!QASearchService.instance) {
            QASearchService.instance = new QASearchService();
        }
        return QASearchService.instance;
    };
    QASearchService.prototype.ensureQuestionsLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.questionsCache)
                            return [2 /*return*/, this.questionsCache];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.QUESTIONS)];
                    case 2:
                        raw = _b.sent();
                        this.questionsCache = raw ? JSON.parse(raw) : [];
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        this.questionsCache = [];
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, this.questionsCache];
                }
            });
        });
    };
    QASearchService.prototype.persistQuestions = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.questionsCache = questions;
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QASearchService.prototype.search = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, _a, keyword, subject, topic, filters, _b, page, _c, limit, filtered, lowerKeyword_1, totalCount, totalPages, startIndex, paginatedQuestions;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _d.sent();
                        _a = options.keyword, keyword = _a === void 0 ? '' : _a, subject = options.subject, topic = options.topic, filters = options.filters, _b = options.page, page = _b === void 0 ? 1 : _b, _c = options.limit, limit = _c === void 0 ? 20 : _c;
                        filtered = __spreadArray([], questions, true);
                        // Keyword search (title and description)
                        if (keyword.trim()) {
                            lowerKeyword_1 = keyword.toLowerCase();
                            filtered = filtered.filter(function (q) {
                                var titleMatch = q.title.toLowerCase().includes(lowerKeyword_1);
                                var descMatch = q.description.toLowerCase().includes(lowerKeyword_1);
                                return titleMatch || descMatch;
                            });
                            // Sort by relevance: title matches first
                            filtered.sort(function (a, b) {
                                var aTitleMatch = a.title.toLowerCase().includes(lowerKeyword_1) ? 1 : 0;
                                var bTitleMatch = b.title.toLowerCase().includes(lowerKeyword_1) ? 1 : 0;
                                if (bTitleMatch !== aTitleMatch)
                                    return bTitleMatch - aTitleMatch;
                                return 0;
                            });
                        }
                        // Subject filter
                        if (subject && subject.trim()) {
                            filtered = filtered.filter(function (q) {
                                return q.subject.toLowerCase() === subject.toLowerCase();
                            });
                        }
                        // Topic filter
                        if (topic && topic.trim()) {
                            filtered = filtered.filter(function (q) {
                                return q.topic.toLowerCase() === topic.toLowerCase();
                            });
                        }
                        // Apply difficulty filters
                        if ((filters === null || filters === void 0 ? void 0 : filters.difficulties) && filters.difficulties.length > 0) {
                            filtered = filtered.filter(function (q) {
                                return filters.difficulties.includes(q.difficulty);
                            });
                        }
                        // Apply status filter
                        if ((filters === null || filters === void 0 ? void 0 : filters.status) && filters.status.length > 0) {
                            filtered = filtered.filter(function (q) {
                                var isUnanswered = q.answerCount === 0;
                                var isAnswered = q.answerCount > 0;
                                var isSolved = false; // Would need solved flag in Question type
                                if (filters.status.includes('unanswered') && isUnanswered)
                                    return true;
                                if (filters.status.includes('answered') && isAnswered)
                                    return true;
                                if (filters.status.includes('solved') && isSolved)
                                    return true;
                                return false;
                            });
                        }
                        // Sort by newest first by default
                        filtered.sort(function (a, b) {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });
                        totalCount = filtered.length;
                        totalPages = Math.ceil(totalCount / limit);
                        startIndex = (page - 1) * limit;
                        paginatedQuestions = filtered.slice(startIndex, startIndex + limit);
                        return [2 /*return*/, {
                                questions: paginatedQuestions,
                                totalCount: totalCount,
                                currentPage: page,
                                totalPages: totalPages,
                                hasMore: page < totalPages,
                            }];
                }
            });
        });
    };
    QASearchService.prototype.getSuggestions = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, lowerKeyword, suggestions, subjects, topics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!keyword.trim() || keyword.length < 2)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        lowerKeyword = keyword.toLowerCase();
                        suggestions = new Set();
                        questions.forEach(function (q) {
                            if (q.title.toLowerCase().includes(lowerKeyword)) {
                                // Extract words from matching titles
                                var words = q.title.split(/\s+/);
                                words.forEach(function (word) {
                                    if (word.toLowerCase().includes(lowerKeyword) && word.length > 2) {
                                        suggestions.add(word.replace(/[^a-zA-Z0-9]/g, ''));
                                    }
                                });
                            }
                        });
                        subjects = __spreadArray([], new Set(questions.map(function (q) { return q.subject; })), true);
                        subjects.forEach(function (subject) {
                            if (subject.toLowerCase().includes(lowerKeyword)) {
                                suggestions.add(subject);
                            }
                        });
                        topics = __spreadArray([], new Set(questions.map(function (q) { return q.topic; })), true);
                        topics.forEach(function (topic) {
                            if (topic.toLowerCase().includes(lowerKeyword)) {
                                suggestions.add(topic);
                            }
                        });
                        return [2 /*return*/, Array.from(suggestions).slice(0, 10)];
                }
            });
        });
    };
    QASearchService.prototype.getDiscoverySections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questions, trending, recent, popular, helpful;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        trending = __spreadArray([], questions, true).sort(function (a, b) {
                            var scoreA = (a.viewCount || 0) + (a.answerCount || 0);
                            var scoreB = (b.viewCount || 0) + (b.answerCount || 0);
                            return scoreB - scoreA;
                        })
                            .slice(0, 10);
                        recent = __spreadArray([], questions, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })
                            .slice(0, 10);
                        popular = __spreadArray([], questions, true).sort(function (a, b) { return (b.viewCount || 0) - (a.viewCount || 0); })
                            .slice(0, 10);
                        helpful = __spreadArray([], questions, true).sort(function (a, b) { return (b.answerCount || 0) - (a.answerCount || 0); })
                            .slice(0, 10);
                        return [2 /*return*/, { trending: trending, recent: recent, popular: popular, helpful: helpful }];
                }
            });
        });
    };
    QASearchService.prototype.getAllSubjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        return [2 /*return*/, __spreadArray([], new Set(questions.map(function (q) { return q.subject; })), true).sort()];
                }
            });
        });
    };
    QASearchService.prototype.getTopicsForSubject = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var questions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        return [2 /*return*/, __spreadArray([], new Set(questions
                                .filter(function (q) { return q.subject.toLowerCase() === subject.toLowerCase(); })
                                .map(function (q) { return q.topic; })), true).sort()];
                }
            });
        });
    };
    QASearchService.prototype.browseQuestions = function () {
        return __awaiter(this, arguments, void 0, function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.search({ page: page, limit: limit })];
            });
        });
    };
    return QASearchService;
}());
exports.QASearchService = QASearchService;
exports.qaSearchService = QASearchService.getInstance();
