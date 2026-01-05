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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LESSON_READ_XP = exports.QUIZ_COMPLETE_XP = exports.useIsQuestionAnswered = exports.useQuizProgress = exports.useCurrentQuestion = exports.useQuizStore = void 0;
var zustand_1 = require("zustand");
var xpStore_1 = require("./xpStore");
var achievementStore_1 = require("./achievementStore");
var CoinRewardService_1 = require("@/services/CoinRewardService");
var MistakeAnalysisService_1 = require("@/services/MistakeAnalysisService");
var MAX_QUESTIONS = 5;
var QUIZ_XP_AMOUNT = 50;
exports.useQuizStore = (0, zustand_1.create)(function (set, get) { return ({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isQuizActive: false,
    isLoading: false,
    error: null,
    score: 0,
    currentDifficulty: 'medium',
    quizStartTime: null,
    quizTopic: '',
    quizSubject: '',
    quizChapter: '',
    setQuestions: function (questions, topic, subject, chapter) {
        var _a;
        set({
            questions: questions,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            score: 0,
            isQuizActive: true,
            error: null,
            quizTopic: topic,
            quizSubject: subject,
            quizChapter: chapter,
            quizStartTime: Date.now(),
            currentDifficulty: ((_a = questions[0]) === null || _a === void 0 ? void 0 : _a.difficulty) || 'medium',
        });
    },
    selectAnswer: function (questionIndex, answerIndex) {
        set(function (state) {
            var _a;
            return ({
                selectedAnswers: __assign(__assign({}, state.selectedAnswers), (_a = {}, _a[questionIndex] = answerIndex, _a)),
            });
        });
    },
    nextQuestion: function () {
        var _a = get(), currentQuestionIndex = _a.currentQuestionIndex, questions = _a.questions;
        if (currentQuestionIndex < questions.length - 1) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
    },
    previousQuestion: function () {
        var currentQuestionIndex = get().currentQuestionIndex;
        if (currentQuestionIndex > 0) {
            set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
    },
    startQuiz: function () {
        set({
            isQuizActive: true,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            error: null,
        });
    },
    endQuiz: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, calculateScore, questions, selectedAnswers, quizStartTime, quizTopic, quizSubject, quizChapter, score, endTime, timeSpent, i, question, userAnswer, mistake, error_1, quizResult, error_2, _b, addXP, incrementQuizzesCompleted, getXP, checkAndUnlock, correctCount, _c, totalQuizzesCompleted, totalLessonsRead, error_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = get(), calculateScore = _a.calculateScore, questions = _a.questions, selectedAnswers = _a.selectedAnswers, quizStartTime = _a.quizStartTime, quizTopic = _a.quizTopic, quizSubject = _a.quizSubject, quizChapter = _a.quizChapter;
                    score = calculateScore();
                    endTime = Date.now();
                    timeSpent = quizStartTime ? (endTime - quizStartTime) / 1000 : 0;
                    set({
                        isQuizActive: false,
                        score: score,
                    });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    i = 0;
                    _d.label = 2;
                case 2:
                    if (!(i < questions.length)) return [3 /*break*/, 5];
                    question = questions[i];
                    userAnswer = selectedAnswers[i];
                    if (!(userAnswer !== undefined && userAnswer !== question.correctAnswer)) return [3 /*break*/, 4];
                    mistake = {
                        id: "mistake_".concat(Date.now(), "_").concat(i),
                        questionId: question.id,
                        question: question.question,
                        userAnswer: userAnswer,
                        correctAnswer: question.correctAnswer,
                        topic: question.topic,
                        subject: quizSubject,
                        chapter: quizChapter,
                        timestamp: Date.now(),
                        explanation: question.explanation,
                    };
                    return [4 /*yield*/, MistakeAnalysisService_1.mistakeAnalysisService.recordMistake(mistake)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _d.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    quizResult = {
                        quizId: "quiz_".concat(Date.now()),
                        score: score,
                        totalQuestions: questions.length,
                        correctAnswers: questions.filter(function (q, i) { return selectedAnswers[i] === q.correctAnswer; }).length,
                        wrongAnswers: questions.filter(function (q, i) { return selectedAnswers[i] !== undefined && selectedAnswers[i] !== q.correctAnswer; }).length,
                        timestamp: Date.now(),
                        timeSpent: timeSpent,
                        difficulty: get().currentDifficulty,
                        topic: quizTopic,
                        subject: quizSubject,
                        chapter: quizChapter,
                    };
                    return [4 /*yield*/, MistakeAnalysisService_1.mistakeAnalysisService.recordQuizResult(quizResult)];
                case 8:
                    _d.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _d.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _d.trys.push([10, 13, , 14]);
                    _b = xpStore_1.useXPStore.getState(), addXP = _b.addXP, incrementQuizzesCompleted = _b.incrementQuizzesCompleted, getXP = _b.getXP;
                    checkAndUnlock = achievementStore_1.useAchievementStore.getState().checkAndUnlock;
                    return [4 /*yield*/, addXP(QUIZ_XP_AMOUNT)];
                case 11:
                    _d.sent();
                    incrementQuizzesCompleted();
                    correctCount = get().questions.filter(function (q, i) { return get().selectedAnswers[i] === q.correctAnswer; }).length;
                    return [4 /*yield*/, CoinRewardService_1.coinRewardService.rewardQuizCompletion(correctCount, get().questions.length)];
                case 12:
                    _d.sent();
                    _c = xpStore_1.useXPStore.getState(), totalQuizzesCompleted = _c.totalQuizzesCompleted, totalLessonsRead = _c.totalLessonsRead;
                    checkAndUnlock({
                        currentStreak: 0, // Will be updated from streak service
                        totalQuizzesCompleted: totalQuizzesCompleted,
                        totalLessonsRead: totalLessonsRead,
                        currentXP: getXP(),
                        rank: xpStore_1.useXPStore.getState().getRank().name,
                    });
                    // Return quiz result for analytics
                    return [2 /*return*/, {
                            quizId: "quiz_".concat(Date.now()),
                            score: score,
                            totalQuestions: questions.length,
                            correctAnswers: correctCount,
                            wrongAnswers: questions.length - correctCount,
                            timestamp: Date.now(),
                            timeSpent: timeSpent,
                            difficulty: get().currentDifficulty,
                            topic: quizTopic,
                            subject: quizSubject,
                            chapter: quizChapter,
                        }];
                case 13:
                    error_3 = _d.sent();
                    // Debug statement removed
                    return [2 /*return*/, null];
                case 14: return [2 /*return*/];
            }
        });
    }); },
    resetQuiz: function () {
        set({
            questions: [],
            currentQuestionIndex: 0,
            selectedAnswers: {},
            isQuizActive: false,
            isLoading: false,
            error: null,
            score: 0,
            currentDifficulty: 'medium',
            quizStartTime: null,
            quizTopic: '',
            quizSubject: '',
            quizChapter: '',
        });
    },
    setLoading: function (loading) {
        set({ isLoading: loading });
    },
    setError: function (error) {
        set({ error: error });
    },
    calculateScore: function () {
        var _a = get(), questions = _a.questions, selectedAnswers = _a.selectedAnswers;
        if (questions.length === 0)
            return 0;
        var correctCount = 0;
        questions.forEach(function (question, index) {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });
        return Math.round((correctCount / questions.length) * 100);
    },
    setDifficulty: function (difficulty) {
        set({ currentDifficulty: difficulty });
    },
    updateAdaptiveDifficulty: function () {
        var calculateScore = get().calculateScore;
        var score = calculateScore();
        var newDifficulty = 'medium';
        if (score >= 80) {
            newDifficulty = 'hard';
        }
        else if (score < 60) {
            newDifficulty = 'easy';
        }
        set({ currentDifficulty: newDifficulty });
        return newDifficulty;
    },
}); });
// Selector hooks for derived state
var useCurrentQuestion = function () {
    var _a = (0, exports.useQuizStore)(), questions = _a.questions, currentQuestionIndex = _a.currentQuestionIndex;
    return questions[currentQuestionIndex];
};
exports.useCurrentQuestion = useCurrentQuestion;
var useQuizProgress = function () {
    var _a = (0, exports.useQuizStore)(), questions = _a.questions, currentQuestionIndex = _a.currentQuestionIndex, selectedAnswers = _a.selectedAnswers;
    return {
        current: currentQuestionIndex + 1,
        total: questions.length,
        answeredCount: Object.keys(selectedAnswers).length,
        isLastQuestion: currentQuestionIndex === questions.length - 1,
    };
};
exports.useQuizProgress = useQuizProgress;
var useIsQuestionAnswered = function (questionIndex) {
    var selectedAnswers = (0, exports.useQuizStore)(function (state) { return state.selectedAnswers; });
    return selectedAnswers[questionIndex] !== undefined;
};
exports.useIsQuestionAnswered = useIsQuestionAnswered;
// XP constants
exports.QUIZ_COMPLETE_XP = QUIZ_XP_AMOUNT;
exports.LESSON_READ_XP = 10;
