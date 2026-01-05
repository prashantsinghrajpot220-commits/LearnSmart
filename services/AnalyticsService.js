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
exports.analyticsService = exports.AnalyticsService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var MistakeAnalysisService_1 = require("./MistakeAnalysisService");
var ANALYTICS_STORAGE_KEY = 'learnsmart_analytics';
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService() {
        this.analyticsData = {
            totalStudyTime: 0,
            lastUpdated: Date.now(),
            weeklyReports: [],
        };
    }
    AnalyticsService.getInstance = function () {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    };
    AnalyticsService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(ANALYTICS_STORAGE_KEY)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.analyticsData = JSON.parse(data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsService.prototype.trackStudyTime = function (minutes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analyticsData.totalStudyTime += minutes;
                        return [4 /*yield*/, this.saveAnalytics()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsService.prototype.generateWeeklyReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, weekStart, quizResults, totalQuizzes, totalQuestions, correctAnswers, accuracy, mistakes, topicAccuracy, areas, improvementAreas, strongAreas, report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        weekStart = now - 7 * 24 * 60 * 60 * 1000;
                        quizResults = MistakeAnalysisService_1.mistakeAnalysisService['quizResultsCache'].filter(function (r) { return r.timestamp >= weekStart && r.timestamp <= now; });
                        totalQuizzes = quizResults.length;
                        totalQuestions = quizResults.reduce(function (sum, r) { return sum + r.totalQuestions; }, 0);
                        correctAnswers = quizResults.reduce(function (sum, r) { return sum + Math.round((r.score / 100) * r.totalQuestions); }, 0);
                        accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
                        mistakes = MistakeAnalysisService_1.mistakeAnalysisService.getMistakes().filter(function (m) { return m.timestamp >= weekStart && m.timestamp <= now; });
                        topicAccuracy = new Map();
                        quizResults.forEach(function (result) {
                            var key = result.topic;
                            if (!topicAccuracy.has(key)) {
                                topicAccuracy.set(key, { correct: 0, total: 0 });
                            }
                            var correctCount = Math.round((result.score / 100) * result.totalQuestions);
                            topicAccuracy.get(key).correct += correctCount;
                            topicAccuracy.get(key).total += result.totalQuestions;
                        });
                        areas = [];
                        topicAccuracy.forEach(function (perf, topic) {
                            if (perf.total >= 3) {
                                areas.push({
                                    topic: topic,
                                    accuracy: (perf.correct / perf.total) * 100,
                                });
                            }
                        });
                        areas.sort(function (a, b) { return a.accuracy - b.accuracy; });
                        improvementAreas = areas
                            .filter(function (a) { return a.accuracy < 60; })
                            .slice(0, 3)
                            .map(function (a) { return a.topic; });
                        strongAreas = areas
                            .filter(function (a) { return a.accuracy >= 70; })
                            .slice(-3)
                            .reverse()
                            .map(function (a) { return a.topic; });
                        report = {
                            weekStart: weekStart,
                            weekEnd: now,
                            quizzesTaken: totalQuizzes,
                            lessonsRead: 0, // Would come from lesson tracking
                            accuracy: Math.round(accuracy),
                            xpGained: 0, // Would come from XP store
                            coinsEarned: 0, // Would come from coin service
                            timeSpent: 0, // Would come from time tracking
                            improvementAreas: improvementAreas,
                            strongAreas: strongAreas,
                        };
                        // Update weekly reports cache
                        this.analyticsData.weeklyReports.push(report);
                        // Keep only last 12 weeks
                        if (this.analyticsData.weeklyReports.length > 12) {
                            this.analyticsData.weeklyReports = this.analyticsData.weeklyReports.slice(-12);
                        }
                        return [4 /*yield*/, this.saveAnalytics()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, report];
                }
            });
        });
    };
    AnalyticsService.prototype.getPerformanceMetrics = function () {
        var quizResults = MistakeAnalysisService_1.mistakeAnalysisService['quizResultsCache'];
        var mistakes = MistakeAnalysisService_1.mistakeAnalysisService.getMistakes();
        var quizzesTaken = quizResults.length;
        var totalQuestions = quizResults.reduce(function (sum, r) { return sum + r.totalQuestions; }, 0);
        var correctAnswers = quizResults.reduce(function (sum, r) { return sum + Math.round((r.score / 100) * r.totalQuestions); }, 0);
        var overallAccuracy = totalQuestions > 0
            ? (correctAnswers / totalQuestions) * 100
            : 0;
        var averageScore = quizzesTaken > 0
            ? quizResults.reduce(function (sum, r) { return sum + r.score; }, 0) / quizzesTaken
            : 0;
        var totalTimeSpent = quizResults.reduce(function (sum, r) { return sum + r.timeSpent; }, 0);
        var averageTimePerQuestion = totalQuestions > 0
            ? totalTimeSpent / totalQuestions
            : 0;
        return {
            overallAccuracy: Math.round(overallAccuracy),
            quizzesTaken: quizzesTaken,
            totalQuestionsAttempted: totalQuestions,
            correctAnswers: correctAnswers,
            averageScore: Math.round(averageScore),
            averageTimePerQuestion: Math.round(averageTimePerQuestion),
            currentStreak: 0, // Would come from streak service
            longestStreak: 0, // Would come from streak service
            totalStudyTime: this.analyticsData.totalStudyTime,
        };
    };
    AnalyticsService.prototype.getTopicPerformance = function () {
        var quizResults = MistakeAnalysisService_1.mistakeAnalysisService['quizResultsCache'];
        var mistakes = MistakeAnalysisService_1.mistakeAnalysisService.getMistakes();
        var topicStats = new Map();
        quizResults.forEach(function (result) {
            var key = "".concat(result.subject, "-").concat(result.chapter, "-").concat(result.topic);
            if (!topicStats.has(key)) {
                topicStats.set(key, {
                    correct: 0,
                    total: 0,
                    time: 0,
                    attempts: [],
                    subject: result.subject,
                    chapter: result.chapter,
                });
            }
            var stats = topicStats.get(key);
            var correctCount = Math.round((result.score / 100) * result.totalQuestions);
            stats.correct += correctCount;
            stats.total += result.totalQuestions;
            stats.time += result.timeSpent;
            stats.attempts.push(result.score);
        });
        var performances = [];
        topicStats.forEach(function (stats, key) {
            var _a;
            var _b = key.split('-'), subject = _b[0], chapter = _b[1], topic = _b[2];
            var accuracy = (stats.correct / stats.total) * 100;
            var averageTime = stats.total > 0 ? stats.time / stats.total : 0;
            var lastAttempt = ((_a = quizResults
                .filter(function (r) { return r.topic === topic; })
                .sort(function (a, b) { return b.timestamp - a.timestamp; })[0]) === null || _a === void 0 ? void 0 : _a.timestamp) || Date.now();
            // Calculate improvement rate
            var improvementRate = 0;
            if (stats.attempts.length >= 2) {
                var firstHalf = stats.attempts.slice(0, Math.floor(stats.attempts.length / 2));
                var secondHalf = stats.attempts.slice(Math.floor(stats.attempts.length / 2));
                var firstAvg = firstHalf.reduce(function (a, b) { return a + b; }, 0) / firstHalf.length;
                var secondAvg = secondHalf.reduce(function (a, b) { return a + b; }, 0) / secondHalf.length;
                improvementRate = ((secondAvg - firstAvg) / firstAvg) * 100;
            }
            var trend = 'stable';
            if (improvementRate > 5) {
                trend = 'up';
            }
            else if (improvementRate < -5) {
                trend = 'down';
            }
            performances.push({
                topic: topic,
                subject: subject,
                chapter: chapter,
                accuracy: Math.round(accuracy),
                questionsAttempted: stats.total,
                averageTime: Math.round(averageTime),
                improvementRate: Math.round(improvementRate),
                lastAttemptedAt: lastAttempt,
                trend: trend,
            });
        });
        return performances.sort(function (a, b) { return a.accuracy - b.accuracy; });
    };
    AnalyticsService.prototype.getPerformanceChartData = function () {
        var weeklyReports = this.analyticsData.weeklyReports.slice(-8); // Last 8 weeks
        return {
            labels: weeklyReports.map(function (_, i) { return "Week ".concat(i + 1); }),
            accuracyData: weeklyReports.map(function (r) { return r.accuracy; }),
            timeData: weeklyReports.map(function (r) { return r.timeSpent; }),
            difficultyProgression: {
                easy: 0,
                medium: 0,
                hard: 0,
            },
        };
    };
    AnalyticsService.prototype.getComparisonData = function (userAccuracy) {
        // In a real implementation, this would compare against actual grade-level data
        var gradeLevelAverage = 65; // Simulated average
        var percentile = Math.min(99, Math.max(1, Math.round((userAccuracy / gradeLevelAverage) * 50)));
        var rankInClass = Math.floor(Math.random() * 30) + 1;
        var totalStudents = 50;
        return {
            userAccuracy: Math.round(userAccuracy),
            gradeLevelAverage: gradeLevelAverage,
            percentile: percentile,
            rankInClass: rankInClass,
            totalStudents: totalStudents,
        };
    };
    AnalyticsService.prototype.getWeeklyReports = function () {
        return __awaiter(this, arguments, void 0, function (count) {
            if (count === void 0) { count = 4; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.analyticsData.weeklyReports.slice(-count)];
            });
        });
    };
    AnalyticsService.prototype.saveAnalytics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.analyticsData.lastUpdated = Date.now();
                        return [4 /*yield*/, async_storage_1.default.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(this.analyticsData))];
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
    AnalyticsService.prototype.clearAnalytics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analyticsData = {
                            totalStudyTime: 0,
                            lastUpdated: Date.now(),
                            weeklyReports: [],
                        };
                        return [4 /*yield*/, this.saveAnalytics()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsService.prototype.getInsights = function () {
        var metrics = this.getPerformanceMetrics();
        var insights = [];
        if (metrics.overallAccuracy >= 80) {
            insights.push('Excellent performance! You\'re mastering the material.');
        }
        else if (metrics.overallAccuracy >= 60) {
            insights.push('Good progress! Keep practicing to improve accuracy.');
        }
        else {
            insights.push('Focus on weak areas to boost your accuracy.');
        }
        if (metrics.quizzesTaken >= 10) {
            insights.push("You've completed ".concat(metrics.quizzesTaken, " quizzes. Great consistency!"));
        }
        if (metrics.averageTimePerQuestion > 60) {
            insights.push('Try to improve your speed by practicing more.');
        }
        return insights;
    };
    return AnalyticsService;
}());
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = AnalyticsService.getInstance();
