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
exports.mistakeAnalysisService = exports.MistakeAnalysisService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var MISTAKES_STORAGE_KEY = 'learnsmart_mistakes';
var QUIZ_RESULTS_STORAGE_KEY = 'learnsmart_quiz_results';
var MistakeAnalysisService = /** @class */ (function () {
    function MistakeAnalysisService() {
        this.mistakesCache = [];
        this.quizResultsCache = [];
    }
    MistakeAnalysisService.getInstance = function () {
        if (!MistakeAnalysisService.instance) {
            MistakeAnalysisService.instance = new MistakeAnalysisService();
        }
        return MistakeAnalysisService.instance;
    };
    MistakeAnalysisService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mistakesData, resultsData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                async_storage_1.default.getItem(MISTAKES_STORAGE_KEY),
                                async_storage_1.default.getItem(QUIZ_RESULTS_STORAGE_KEY),
                            ])];
                    case 1:
                        _a = _b.sent(), mistakesData = _a[0], resultsData = _a[1];
                        this.mistakesCache = mistakesData ? JSON.parse(mistakesData) : [];
                        this.quizResultsCache = resultsData ? JSON.parse(resultsData) : [];
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        // Error handled silently
                        this.mistakesCache = [];
                        this.quizResultsCache = [];
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.recordMistake = function (mistake) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.mistakesCache.push(mistake);
                        return [4 /*yield*/, async_storage_1.default.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(this.mistakesCache))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.recordQuizResult = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.quizResultsCache.push(result);
                        return [4 /*yield*/, async_storage_1.default.setItem(QUIZ_RESULTS_STORAGE_KEY, JSON.stringify(this.quizResultsCache))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.getMistakes = function () {
        return __spreadArray([], this.mistakesCache, true);
    };
    MistakeAnalysisService.prototype.getMistakesByTopic = function (topic) {
        return this.mistakesCache.filter(function (m) { return m.topic === topic; });
    };
    MistakeAnalysisService.prototype.getMistakesByChapter = function (chapter, subject) {
        return this.mistakesCache.filter(function (m) { return m.chapter === chapter && m.subject === subject; });
    };
    MistakeAnalysisService.prototype.identifyWeakAreas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var topicPerformance, weakAreas, thirtyDaysAgo;
            var _this = this;
            return __generator(this, function (_a) {
                topicPerformance = new Map();
                // Aggregate performance by topic
                this.quizResultsCache.forEach(function (result) {
                    var key = "".concat(result.subject, "-").concat(result.chapter, "-").concat(result.topic);
                    if (!topicPerformance.has(key)) {
                        topicPerformance.set(key, {
                            correct: 0,
                            total: 0,
                            subject: result.subject,
                            chapter: result.chapter,
                            attempts: [],
                        });
                    }
                    var perf = topicPerformance.get(key);
                    var correctCount = Math.round((result.score / 100) * result.totalQuestions);
                    perf.correct += correctCount;
                    perf.total += result.totalQuestions;
                });
                // Add mistakes data
                this.mistakesCache.forEach(function (mistake) {
                    var key = "".concat(mistake.subject, "-").concat(mistake.chapter, "-").concat(mistake.topic);
                    if (!topicPerformance.has(key)) {
                        topicPerformance.set(key, {
                            correct: 0,
                            total: 0,
                            subject: mistake.subject,
                            chapter: mistake.chapter,
                            attempts: [],
                        });
                    }
                    topicPerformance.get(key).attempts.push(mistake);
                });
                weakAreas = [];
                thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                topicPerformance.forEach(function (perf, key) {
                    if (perf.total < 3)
                        return; // Need at least 3 attempts
                    var accuracy = (perf.correct / perf.total) * 100;
                    if (accuracy < 60) {
                        var _a = key.split('-'), subject = _a[0], chapter = _a[1], topic = _a[2];
                        // Calculate trend
                        var recentAttempts = perf.attempts.filter(function (a) { return a.timestamp >= thirtyDaysAgo; });
                        var olderAttempts = perf.attempts.filter(function (a) { return a.timestamp < thirtyDaysAgo; });
                        var trend = 'stable';
                        if (recentAttempts.length > 0 && olderAttempts.length > 0) {
                            var recentAccuracy = recentAttempts.length > 0
                                ? (recentAttempts.filter(function (a) { return a.correctAnswer !== a.userAnswer; }).length / recentAttempts.length) * 100
                                : 0;
                            var olderAccuracy = olderAttempts.length > 0
                                ? (olderAttempts.filter(function (a) { return a.correctAnswer !== a.userAnswer; }).length / olderAttempts.length) * 100
                                : 0;
                            if (recentAccuracy < olderAccuracy) {
                                trend = 'improving';
                            }
                            else if (recentAccuracy > olderAccuracy) {
                                trend = 'declining';
                            }
                        }
                        weakAreas.push({
                            topic: topic,
                            subject: subject,
                            chapter: chapter,
                            accuracy: accuracy,
                            totalAttempts: perf.total,
                            mistakes: perf.attempts.length,
                            trend: trend,
                            recommendedLessons: _this.generateRecommendedLessons(topic, subject, chapter),
                        });
                    }
                });
                // Sort by accuracy (weakest first)
                return [2 /*return*/, weakAreas.sort(function (a, b) { return a.accuracy - b.accuracy; })];
            });
        });
    };
    MistakeAnalysisService.prototype.generatePersonalizedStudyPlan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var weakAreas, priorityTopics, suggestedSchedule, dayCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identifyWeakAreas()];
                    case 1:
                        weakAreas = _a.sent();
                        priorityTopics = weakAreas
                            .filter(function (area) { return area.accuracy < 50; })
                            .map(function (area) { return area.topic; });
                        suggestedSchedule = [];
                        dayCount = 0;
                        weakAreas.forEach(function (area) {
                            var daysNeeded = Math.ceil((60 - area.accuracy) / 10); // More days for weaker areas
                            for (var i = 0; i < daysNeeded; i++) {
                                suggestedSchedule.push({
                                    day: ++dayCount,
                                    topic: area.topic,
                                    subject: area.subject,
                                    activities: [
                                        "Review lesson on ".concat(area.topic),
                                        "Practice questions on ".concat(area.topic),
                                        area.recommendedLessons.length > 0
                                            ? "Study: ".concat(area.recommendedLessons[0])
                                            : 'Revise concepts',
                                    ],
                                    estimatedTime: 45, // minutes
                                });
                            }
                        });
                        return [2 /*return*/, {
                                weakAreas: weakAreas,
                                priorityTopics: priorityTopics,
                                suggestedSchedule: suggestedSchedule,
                                estimatedCompletionDays: dayCount,
                            }];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.generateRecommendedLessons = function (topic, subject, chapter) {
        // In a real implementation, this would query the content database
        // For now, return generic recommendations
        return [
            "Introduction to ".concat(topic),
            "Key concepts of ".concat(topic),
            "Practice problems for ".concat(topic),
        ];
    };
    MistakeAnalysisService.prototype.getImprovementTrend = function (topic) {
        var topicMistakes = this.getMistakesByTopic(topic);
        if (topicMistakes.length < 2) {
            return { improvement: 0, trend: 'stable' };
        }
        var recentMistakes = topicMistakes.slice(-5);
        var olderMistakes = topicMistakes.slice(0, Math.max(0, topicMistakes.length - 5));
        var recentMistakeRate = recentMistakes.length;
        var olderMistakeRate = olderMistakes.length / Math.max(1, Math.floor(olderMistakes.length / 5));
        var improvement = ((olderMistakeRate - recentMistakeRate) / olderMistakeRate) * 100;
        var trend = 'stable';
        if (improvement > 10) {
            trend = 'up';
        }
        else if (improvement < -10) {
            trend = 'down';
        }
        return { improvement: Math.round(improvement), trend: trend };
    };
    MistakeAnalysisService.prototype.clearOldMistakes = function () {
        return __awaiter(this, arguments, void 0, function (daysToKeep) {
            var cutoffTime_1, error_4;
            if (daysToKeep === void 0) { daysToKeep = 90; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        cutoffTime_1 = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
                        this.mistakesCache = this.mistakesCache.filter(function (m) { return m.timestamp >= cutoffTime_1; });
                        return [4 /*yield*/, async_storage_1.default.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(this.mistakesCache))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.clearAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.mistakesCache = [];
                        this.quizResultsCache = [];
                        return [4 /*yield*/, Promise.all([
                                async_storage_1.default.removeItem(MISTAKES_STORAGE_KEY),
                                async_storage_1.default.removeItem(QUIZ_RESULTS_STORAGE_KEY),
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MistakeAnalysisService.prototype.getStatistics = function () {
        var totalMistakes = this.mistakesCache.length;
        var uniqueTopics = new Set(this.mistakesCache.map(function (m) { return m.topic; })).size;
        var recentMistakes = this.mistakesCache.filter(function (m) { return m.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000; }).length;
        return {
            totalMistakes: totalMistakes,
            uniqueTopics: uniqueTopics,
            recentMistakes: recentMistakes,
            averageMistakesPerTopic: totalMistakes / Math.max(1, uniqueTopics),
        };
    };
    return MistakeAnalysisService;
}());
exports.MistakeAnalysisService = MistakeAnalysisService;
exports.mistakeAnalysisService = MistakeAnalysisService.getInstance();
