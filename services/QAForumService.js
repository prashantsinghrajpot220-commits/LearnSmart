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
exports.qaForumService = exports.QAForumService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var userStore_1 = require("@/store/userStore");
var NotificationService_1 = require("./NotificationService");
var ReputationService_1 = require("./ReputationService");
var GamificationService_1 = require("./GamificationService");
var STORAGE_KEYS = {
    QUESTIONS: '@learnsmart/qa_questions',
    ANSWERS: function (questionId) { return "@learnsmart/qa_answers:".concat(questionId); },
};
function randomId(prefix) {
    return "".concat(prefix, "_").concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 9));
}
var QAForumService = /** @class */ (function () {
    function QAForumService() {
        this.questionsCache = null;
        this.answersCache = new Map();
        this.questionsListeners = new Set();
        this.answersListeners = new Map();
    }
    QAForumService.getInstance = function () {
        if (!QAForumService.instance) {
            QAForumService.instance = new QAForumService();
        }
        return QAForumService.instance;
    };
    // Question Methods
    QAForumService.prototype.ensureQuestionsLoaded = function () {
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
    QAForumService.prototype.persistQuestions = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.questionsCache = questions;
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))];
                    case 1:
                        _a.sent();
                        this.questionsListeners.forEach(function (l) { return l(questions); });
                        return [2 /*return*/];
                }
            });
        });
    };
    QAForumService.prototype.subscribeToQuestions = function (listener) {
        var _this = this;
        this.questionsListeners.add(listener);
        this.ensureQuestionsLoaded().then(function (l) { return listener(l); });
        return function () { return _this.questionsListeners.delete(listener); };
    };
    QAForumService.prototype.getQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.ensureQuestionsLoaded()];
            });
        });
    };
    QAForumService.prototype.createQuestion = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, addUserQuestion, questions, newQuestion;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, addUserQuestion = _a.addUserQuestion;
                        return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _b.sent();
                        newQuestion = __assign(__assign({ id: randomId('q'), userId: userId }, params), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), answerCount: 0, viewCount: 0 });
                        return [4 /*yield*/, this.persistQuestions(__spreadArray([newQuestion], questions, true))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, addUserQuestion(newQuestion.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, newQuestion];
                }
            });
        });
    };
    QAForumService.prototype.getQuestion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var questions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        return [2 /*return*/, questions.find(function (q) { return q.id === id; }) || null];
                }
            });
        });
    };
    QAForumService.prototype.incrementViewCount = function (questionId) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, idx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 1:
                        questions = _a.sent();
                        idx = questions.findIndex(function (q) { return q.id === questionId; });
                        if (!(idx !== -1)) return [3 /*break*/, 3];
                        questions[idx] = __assign(__assign({}, questions[idx]), { viewCount: (questions[idx].viewCount || 0) + 1 });
                        return [4 /*yield*/, this.persistQuestions(__spreadArray([], questions, true))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Answer Methods
    QAForumService.prototype.loadAnswers = function (questionId) {
        return __awaiter(this, void 0, void 0, function () {
            var raw, answers, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.answersCache.has(questionId))
                            return [2 /*return*/, this.answersCache.get(questionId)];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.ANSWERS(questionId))];
                    case 2:
                        raw = _b.sent();
                        answers = raw ? JSON.parse(raw) : [];
                        this.answersCache.set(questionId, answers);
                        return [2 /*return*/, answers];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QAForumService.prototype.persistAnswers = function (questionId, answers) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, qIdx;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.answersCache.set(questionId, answers);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.ANSWERS(questionId), JSON.stringify(answers))];
                    case 1:
                        _b.sent();
                        (_a = this.answersListeners.get(questionId)) === null || _a === void 0 ? void 0 : _a.forEach(function (l) { return l(answers); });
                        return [4 /*yield*/, this.ensureQuestionsLoaded()];
                    case 2:
                        questions = _b.sent();
                        qIdx = questions.findIndex(function (q) { return q.id === questionId; });
                        if (!(qIdx !== -1)) return [3 /*break*/, 4];
                        questions[qIdx].answerCount = answers.length;
                        return [4 /*yield*/, this.persistQuestions(__spreadArray([], questions, true))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QAForumService.prototype.subscribeToAnswers = function (questionId, listener) {
        var _this = this;
        if (!this.answersListeners.has(questionId)) {
            this.answersListeners.set(questionId, new Set());
        }
        this.answersListeners.get(questionId).add(listener);
        this.loadAnswers(questionId).then(function (l) { return listener(l); });
        return function () { var _a; return (_a = _this.answersListeners.get(questionId)) === null || _a === void 0 ? void 0 : _a.delete(listener); };
    };
    QAForumService.prototype.postAnswer = function (questionId, text, photo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, userName, addUserAnswer, notificationPreferences, answers, newAnswer, question;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName, addUserAnswer = _a.addUserAnswer, notificationPreferences = _a.notificationPreferences;
                        return [4 /*yield*/, this.loadAnswers(questionId)];
                    case 1:
                        answers = _b.sent();
                        newAnswer = {
                            id: randomId('a'),
                            questionId: questionId,
                            userId: userId,
                            text: text,
                            photo: photo,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            upvoteCount: 0,
                            downvoteCount: 0,
                            helpfulCount: 0,
                        };
                        return [4 /*yield*/, this.persistAnswers(questionId, __spreadArray(__spreadArray([], answers, true), [newAnswer], false))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, addUserAnswer(newAnswer.id)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, ReputationService_1.reputationService.handleNewAnswer()];
                    case 4:
                        _b.sent();
                        // Award coins for posting answer
                        return [4 /*yield*/, GamificationService_1.gamificationService.awardForAnswerPosted()];
                    case 5:
                        // Award coins for posting answer
                        _b.sent();
                        // Check answer count milestones
                        return [4 /*yield*/, GamificationService_1.gamificationService.checkAnswerCountMilestones()];
                    case 6:
                        // Check answer count milestones
                        _b.sent();
                        return [4 /*yield*/, this.getQuestion(questionId)];
                    case 7:
                        question = _b.sent();
                        if (question && question.userId !== userId) {
                            if (notificationPreferences.answers) {
                                NotificationService_1.notificationService.notifyNewAnswer({
                                    questionId: questionId,
                                    questionTitle: question.title,
                                    answererName: userName || 'A student',
                                });
                            }
                        }
                        return [2 /*return*/, newAnswer];
                }
            });
        });
    };
    QAForumService.prototype.voteAnswer = function (questionId, answerId, voteType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentUserId, userVotes, addUserVote, notificationPreferences, userName, answers, answerIdx, previousVote, answer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), currentUserId = _a.userId, userVotes = _a.userVotes, addUserVote = _a.addUserVote, notificationPreferences = _a.notificationPreferences, userName = _a.userName;
                        return [4 /*yield*/, this.loadAnswers(questionId)];
                    case 1:
                        answers = _b.sent();
                        answerIdx = answers.findIndex(function (a) { return a.id === answerId; });
                        if (answerIdx === -1)
                            return [2 /*return*/];
                        previousVote = userVotes[answerId];
                        if (previousVote === voteType)
                            return [2 /*return*/]; // Already voted same way
                        answer = __assign({}, answers[answerIdx]);
                        // Remove previous vote
                        if (previousVote === 'upvote')
                            answer.upvoteCount = Math.max(0, answer.upvoteCount - 1);
                        if (previousVote === 'downvote')
                            answer.downvoteCount = Math.max(0, answer.downvoteCount - 1);
                        if (!(voteType === 'upvote')) return [3 /*break*/, 3];
                        answer.upvoteCount++;
                        return [4 /*yield*/, ReputationService_1.reputationService.handleUpvote(answer)];
                    case 2:
                        _b.sent();
                        // Send notification to answer owner
                        if (answer.userId !== currentUserId && notificationPreferences.upvotes) {
                            NotificationService_1.notificationService.notifyUpvote({
                                voterName: userName || 'Someone',
                                answerText: answer.text,
                            });
                        }
                        _b.label = 3;
                    case 3:
                        if (voteType === 'downvote')
                            answer.downvoteCount++;
                        answers[answerIdx] = answer;
                        return [4 /*yield*/, this.persistAnswers(questionId, __spreadArray([], answers, true))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, addUserVote(answerId, voteType)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QAForumService.prototype.markHelpful = function (questionId, answerId) {
        return __awaiter(this, void 0, void 0, function () {
            var answers, answerIdx, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadAnswers(questionId)];
                    case 1:
                        answers = _a.sent();
                        answerIdx = answers.findIndex(function (a) { return a.id === answerId; });
                        if (answerIdx === -1)
                            return [2 /*return*/];
                        answer = __assign({}, answers[answerIdx]);
                        answer.helpfulCount++;
                        answers[answerIdx] = answer;
                        return [4 /*yield*/, this.persistAnswers(questionId, __spreadArray([], answers, true))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ReputationService_1.reputationService.handleHelpfulMark(answer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QAForumService.prototype.sortAnswers = function (answers, sortBy) {
        if (sortBy === 'helpfulness') {
            return __spreadArray([], answers, true).sort(function (a, b) {
                var scoreA = (a.upvoteCount || 0) - (a.downvoteCount || 0) + (a.helpfulCount || 0) * 2;
                var scoreB = (b.upvoteCount || 0) - (b.downvoteCount || 0) + (b.helpfulCount || 0) * 2;
                if (scoreB !== scoreA)
                    return scoreB - scoreA;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }
        else {
            return __spreadArray([], answers, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
        }
    };
    return QAForumService;
}());
exports.QAForumService = QAForumService;
exports.qaForumService = QAForumService.getInstance();
