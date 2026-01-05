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
exports.groupQuizService = exports.GroupQuizService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var userStore_1 = require("@/store/userStore");
var quizGenerator_1 = require("@/services/quizGenerator");
var ContentValidator_1 = require("@/services/ContentValidator");
var CoinRewardService_1 = require("@/services/CoinRewardService");
var NotificationService_1 = require("@/services/NotificationService");
var StudyGroupService_1 = require("@/services/StudyGroupService");
var STORAGE_KEY = function (groupId) { return "@learnsmart/study_group_quizzes:".concat(groupId); };
var MAX_QUIZZES = 50;
function randomId(prefix) {
    return "".concat(prefix, "_").concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 9));
}
function enrichQuestions(params) {
    return params.questions.map(function (q, index) {
        var difficulty = index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard';
        return {
            id: "".concat(params.groupQuizId, ":").concat(q.id, ":").concat(index),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: difficulty,
            topic: params.chapter,
            generatedAt: Date.now(),
        };
    });
}
var GroupQuizService = /** @class */ (function () {
    function GroupQuizService() {
        this.cache = new Map();
        this.listeners = new Map();
    }
    GroupQuizService.getInstance = function () {
        if (!GroupQuizService.instance) {
            GroupQuizService.instance = new GroupQuizService();
        }
        return GroupQuizService.instance;
    };
    GroupQuizService.prototype.load = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, raw, quizzes, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.cache.get(groupId);
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY(groupId))];
                    case 2:
                        raw = _a.sent();
                        quizzes = raw ? JSON.parse(raw) : [];
                        this.cache.set(groupId, quizzes);
                        return [2 /*return*/, quizzes];
                    case 3:
                        error_1 = _a.sent();
                        // Error handled silently
                        this.cache.set(groupId, []);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GroupQuizService.prototype.persist = function (groupId, quizzes) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.cache.set(groupId, quizzes);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY(groupId), JSON.stringify(quizzes))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_a = this.listeners.get(groupId)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(quizzes); });
                        return [2 /*return*/];
                }
            });
        });
    };
    GroupQuizService.prototype.subscribe = function (groupId, listener) {
        var _this = this;
        var _a;
        var setForGroup = (_a = this.listeners.get(groupId)) !== null && _a !== void 0 ? _a : new Set();
        setForGroup.add(listener);
        this.listeners.set(groupId, setForGroup);
        void this.load(groupId).then(function (q) { return listener(q); });
        return function () {
            var setNow = _this.listeners.get(groupId);
            setNow === null || setNow === void 0 ? void 0 : setNow.delete(listener);
            if (setNow && setNow.size === 0)
                _this.listeners.delete(groupId);
        };
    };
    GroupQuizService.prototype.getGroupQuizzes = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var quizzes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load(groupId)];
                    case 1:
                        quizzes = _a.sent();
                        return [2 /*return*/, quizzes.sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
                }
            });
        });
    };
    GroupQuizService.prototype.createGroupQuiz = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, group, createdAt, groupQuizId, rawQuestions, safeQuestions, questions, quiz, current, next;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, StudyGroupService_1.studyGroupService.getGroup(params.groupId)];
                    case 1:
                        group = _b.sent();
                        if (!group)
                            throw new Error('Group not found');
                        if (!group.adminIds.includes(userId))
                            throw new Error('Admin permission required');
                        createdAt = new Date().toISOString();
                        groupQuizId = randomId('group_quiz');
                        return [4 /*yield*/, (0, quizGenerator_1.generateQuizQuestions)(params.className, params.subject, params.chapter)];
                    case 2:
                        rawQuestions = _b.sent();
                        return [4 /*yield*/, ContentValidator_1.ContentValidator.validateQuizQuestions(rawQuestions, {
                                contentId: "group_quiz:".concat(groupQuizId, ":").concat(params.groupId),
                                ageGroup: ((_a = userStore_1.useUserStore.getState().ageGroup) !== null && _a !== void 0 ? _a : 'under12'),
                                source: 'GroupQuizService',
                            })];
                    case 3:
                        safeQuestions = _b.sent();
                        questions = enrichQuestions({ groupQuizId: groupQuizId, chapter: params.chapter, questions: safeQuestions });
                        quiz = {
                            id: groupQuizId,
                            groupId: params.groupId,
                            createdBy: userId,
                            quizId: "quiz_ref_".concat(groupQuizId),
                            className: params.className,
                            subject: params.subject,
                            chapter: params.chapter,
                            questions: questions,
                            createdAt: createdAt,
                            deadline: params.deadline,
                            reward: params.reward,
                            results: {},
                            rewardedToUserIds: [],
                        };
                        return [4 /*yield*/, this.load(params.groupId)];
                    case 4:
                        current = _b.sent();
                        next = __spreadArray([quiz], current, true).slice(0, MAX_QUIZZES);
                        return [4 /*yield*/, this.persist(params.groupId, next)];
                    case 5:
                        _b.sent();
                        NotificationService_1.notificationService.notifyGroupQuizCreated({
                            groupId: params.groupId,
                            groupName: group.name,
                            quizTitle: "".concat(params.subject, ": ").concat(params.chapter),
                            reward: params.reward,
                        });
                        return [2 /*return*/, quiz];
                }
            });
        });
    };
    GroupQuizService.prototype.submitGroupQuizResult = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, recordGroupQuizHistory, group, quizzes, idx, quiz, completedAt, updated, next, afterReward;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, recordGroupQuizHistory = _a.recordGroupQuizHistory;
                        return [4 /*yield*/, StudyGroupService_1.studyGroupService.getGroup(params.groupId)];
                    case 1:
                        group = _c.sent();
                        if (!group)
                            throw new Error('Group not found');
                        if (!group.members.includes(userId))
                            throw new Error('You are not a member of this group');
                        return [4 /*yield*/, this.load(params.groupId)];
                    case 2:
                        quizzes = _c.sent();
                        idx = quizzes.findIndex(function (q) { return q.id === params.groupQuizId; });
                        if (idx === -1)
                            throw new Error('Group quiz not found');
                        quiz = quizzes[idx];
                        completedAt = new Date().toISOString();
                        updated = __assign(__assign({}, quiz), { results: __assign(__assign({}, quiz.results), (_b = {}, _b[userId] = {
                                score: params.score,
                                correctAnswers: params.correctAnswers,
                                totalQuestions: params.totalQuestions,
                                completedAt: completedAt,
                            }, _b)) });
                        next = __spreadArray([], quizzes, true);
                        next[idx] = updated;
                        return [4 /*yield*/, this.maybeRewardWinners(group, updated, next)];
                    case 3:
                        afterReward = _c.sent();
                        return [4 /*yield*/, this.persist(params.groupId, afterReward)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, recordGroupQuizHistory({
                                groupId: params.groupId,
                                groupQuizId: params.groupQuizId,
                                score: params.score,
                                completedAt: completedAt,
                            })];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, afterReward.find(function (q) { return q.id === params.groupQuizId; })];
                }
            });
        });
    };
    GroupQuizService.prototype.maybeRewardWinners = function (group, quiz, quizzes) {
        return __awaiter(this, void 0, void 0, function () {
            var now, deadlineMs, allSubmitted, deadlinePassed, entries, maxScore, winners, alreadyRewarded, toReward, currentUserId, _i, toReward_1, winnerId, updatedQuiz, next, winnerNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        deadlineMs = new Date(quiz.deadline).getTime();
                        allSubmitted = Object.keys(quiz.results).length >= group.members.length;
                        deadlinePassed = Number.isFinite(deadlineMs) ? now >= deadlineMs : false;
                        if (!allSubmitted && !deadlinePassed)
                            return [2 /*return*/, quizzes];
                        entries = Object.entries(quiz.results);
                        if (entries.length === 0)
                            return [2 /*return*/, quizzes];
                        maxScore = Math.max.apply(Math, entries.map(function (_a) {
                            var r = _a[1];
                            return r.score;
                        }));
                        winners = entries.filter(function (_a) {
                            var r = _a[1];
                            return r.score === maxScore;
                        }).map(function (_a) {
                            var userId = _a[0];
                            return userId;
                        });
                        alreadyRewarded = new Set(quiz.rewardedToUserIds);
                        toReward = winners.filter(function (w) { return !alreadyRewarded.has(w); });
                        if (toReward.length === 0)
                            return [2 /*return*/, quizzes];
                        currentUserId = userStore_1.useUserStore.getState().userId;
                        _i = 0, toReward_1 = toReward;
                        _a.label = 1;
                    case 1:
                        if (!(_i < toReward_1.length)) return [3 /*break*/, 4];
                        winnerId = toReward_1[_i];
                        if (!(winnerId === currentUserId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, CoinRewardService_1.coinRewardService.awardCoins({
                                amount: quiz.reward,
                                reason: "Won the group quiz in ".concat(group.name, "!"),
                                type: 'bonus',
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        updatedQuiz = __assign(__assign({}, quiz), { rewardedToUserIds: __spreadArray(__spreadArray([], quiz.rewardedToUserIds, true), toReward, true) });
                        next = quizzes.map(function (q) { return (q.id === quiz.id ? updatedQuiz : q); });
                        winnerNames = toReward
                            .map(function (id) { var _a, _b; return (_b = (_a = group.memberProfiles[id]) === null || _a === void 0 ? void 0 : _a.userName) !== null && _b !== void 0 ? _b : id; })
                            .join(', ');
                        NotificationService_1.notificationService.notifyGroupQuizResult({
                            groupId: group.id,
                            groupName: group.name,
                            resultText: "Quiz completed. Winner".concat(toReward.length > 1 ? 's' : '', ": ").concat(winnerNames, " (").concat(maxScore, "%)."),
                        });
                        return [2 /*return*/, next];
                }
            });
        });
    };
    return GroupQuizService;
}());
exports.GroupQuizService = GroupQuizService;
exports.groupQuizService = GroupQuizService.getInstance();
