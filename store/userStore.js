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
exports.useUserStore = void 0;
var zustand_1 = require("zustand");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var STORAGE_KEYS = {
    USER_NAME: '@learnsmart_user_name',
    SELECTED_CLASS: '@learnsmart_selected_class',
    SELECTED_STREAM: '@learnsmart_selected_stream',
    SELECTED_AVATAR: '@learnsmart_selected_avatar',
    THEME_PREFERENCE: '@learnsmart_theme_preference',
    IS_ONBOARDED: '@learnsmart_is_onboarded',
    AGE_GROUP: '@learnsmart/user_age_group',
    USER_ID: '@learnsmart/user_id',
    SIGNUP_DATE: '@learnsmart/signup_date',
    PROFILE_COMPLETE: '@learnsmart/profile_complete',
    GAMIFICATION_DATA: '@learnsmart/gamification_data',
    WEEKLY_LEADERBOARD: '@learnsmart/weekly_leaderboard',
    STUDY_GROUP_MEMBERSHIPS: '@learnsmart/study_group_memberships',
    GROUP_QUIZ_HISTORY: '@learnsmart/group_quiz_history',
    USER_QUESTIONS: '@learnsmart/user_questions',
    USER_ANSWERS: '@learnsmart/user_answers',
    USER_VOTES: '@learnsmart/user_votes',
    FAVORITE_QUESTIONS: '@learnsmart/favorite_questions',
    REPUTATION_LEADERBOARD: '@learnsmart/reputation_leaderboard',
    COIN_TRANSACTIONS: '@learnsmart/coin_transactions',
    NOTIFICATION_PREFERENCES: '@learnsmart/notification_preferences',
    ANSWER_STREAK_COUNT: '@learnsmart/answer_streak_count',
    LAST_ANSWER_DATE: '@learnsmart/last_answer_date',
};
var generateUserId = function () {
    return "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 9));
};
exports.useUserStore = (0, zustand_1.create)(function (set, get) { return ({
    userId: '',
    ageGroup: null,
    userName: '',
    signupDate: null,
    profileComplete: false,
    selectedClass: '',
    selectedStream: '',
    selectedAvatar: 'Robot',
    themePreference: 'system',
    isOnboarded: false,
    // Initialize gamification data
    gamificationData: {
        smartCoins: 0,
        totalEarnedCoins: 0,
        weeklyXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        unlockedAvatars: ['Robot'], // Default avatar is unlocked
        purchasedAvatars: ['Robot'], // Default avatar is purchased
        rankMilestones: [],
        weeklyRank: 0,
        lastWeekRank: 0,
        reputation: 0,
        badges: [],
        achievementProgress: [],
        reputationRank: 0,
    },
    weeklyLeaderboard: [],
    reputationLeaderboard: [],
    studyGroupMemberships: [],
    groupQuizHistory: [],
    userQuestions: [],
    userAnswers: [],
    userVotes: {},
    favoriteQuestions: [],
    // Notifications & Gamification
    coinTransactions: [],
    notificationPreferences: {
        answers: true,
        upvotes: true,
        helpfulMarks: true,
        badgeUnlocks: true,
        leaderboardUpdates: true,
        milestones: true,
        pushEnabled: false,
    },
    answerStreakCount: 0,
    lastAnswerDate: null,
    setAgeGroup: function (age) { return __awaiter(void 0, void 0, void 0, function () {
        var currentSignupDate, newSignupDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentSignupDate = get().signupDate;
                    newSignupDate = currentSignupDate || new Date().toISOString();
                    set({
                        ageGroup: age,
                        signupDate: newSignupDate,
                        profileComplete: true,
                    });
                    return [4 /*yield*/, Promise.all([
                            async_storage_1.default.setItem(STORAGE_KEYS.AGE_GROUP, age),
                            async_storage_1.default.setItem(STORAGE_KEYS.SIGNUP_DATE, newSignupDate),
                            async_storage_1.default.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true'),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    getAgeGroup: function () {
        return get().ageGroup;
    },
    isUnder12: function () {
        return get().ageGroup === 'under12';
    },
    is12Plus: function () {
        return get().ageGroup === '12plus';
    },
    setUserName: function (name) {
        set({ userName: name });
        async_storage_1.default.setItem(STORAGE_KEYS.USER_NAME, name);
    },
    setSelectedClass: function (className) {
        set({ selectedClass: className });
        async_storage_1.default.setItem(STORAGE_KEYS.SELECTED_CLASS, className);
    },
    setSelectedStream: function (stream) {
        set({ selectedStream: stream });
        async_storage_1.default.setItem(STORAGE_KEYS.SELECTED_STREAM, stream);
    },
    setSelectedAvatar: function (avatar) {
        set({ selectedAvatar: avatar });
        async_storage_1.default.setItem(STORAGE_KEYS.SELECTED_AVATAR, avatar);
    },
    setThemePreference: function (theme) {
        set({ themePreference: theme });
        async_storage_1.default.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
    },
    completeOnboarding: function () {
        set({ isOnboarded: true });
        async_storage_1.default.setItem(STORAGE_KEYS.IS_ONBOARDED, 'true');
    },
    logout: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({
                        userId: '',
                        ageGroup: null,
                        userName: '',
                        signupDate: null,
                        profileComplete: false,
                        selectedClass: '',
                        selectedStream: '',
                        selectedAvatar: 'Robot',
                        themePreference: 'system',
                        isOnboarded: false,
                        gamificationData: {
                            smartCoins: 0,
                            totalEarnedCoins: 0,
                            weeklyXP: 0,
                            currentStreak: 0,
                            longestStreak: 0,
                            lastActiveDate: null,
                            unlockedAvatars: ['Robot'],
                            purchasedAvatars: ['Robot'],
                            rankMilestones: [],
                            weeklyRank: 0,
                            lastWeekRank: 0,
                            reputation: 0,
                            badges: [],
                            achievementProgress: [],
                            reputationRank: 0,
                        },
                        weeklyLeaderboard: [],
                        reputationLeaderboard: [],
                        studyGroupMemberships: [],
                        groupQuizHistory: [],
                        userQuestions: [],
                        userAnswers: [],
                        userVotes: {},
                        favoriteQuestions: [],
                        coinTransactions: [],
                        notificationPreferences: {
                            answers: true,
                            upvotes: true,
                            helpfulMarks: true,
                            badgeUnlocks: true,
                            leaderboardUpdates: true,
                            milestones: true,
                            pushEnabled: false,
                        },
                        answerStreakCount: 0,
                        lastAnswerDate: null,
                    });
                    return [4 /*yield*/, async_storage_1.default.multiRemove([
                            STORAGE_KEYS.USER_NAME,
                            STORAGE_KEYS.SELECTED_CLASS,
                            STORAGE_KEYS.SELECTED_STREAM,
                            STORAGE_KEYS.SELECTED_AVATAR,
                            STORAGE_KEYS.THEME_PREFERENCE,
                            STORAGE_KEYS.IS_ONBOARDED,
                            STORAGE_KEYS.AGE_GROUP,
                            STORAGE_KEYS.USER_ID,
                            STORAGE_KEYS.SIGNUP_DATE,
                            STORAGE_KEYS.PROFILE_COMPLETE,
                            STORAGE_KEYS.GAMIFICATION_DATA,
                            STORAGE_KEYS.WEEKLY_LEADERBOARD,
                            STORAGE_KEYS.REPUTATION_LEADERBOARD,
                            STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS,
                            STORAGE_KEYS.GROUP_QUIZ_HISTORY,
                            STORAGE_KEYS.USER_QUESTIONS,
                            STORAGE_KEYS.USER_ANSWERS,
                            STORAGE_KEYS.USER_VOTES,
                            STORAGE_KEYS.FAVORITE_QUESTIONS,
                            STORAGE_KEYS.COIN_TRANSACTIONS,
                            STORAGE_KEYS.NOTIFICATION_PREFERENCES,
                            STORAGE_KEYS.ANSWER_STREAK_COUNT,
                            STORAGE_KEYS.LAST_ANSWER_DATE,
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    loadUserData: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name_1, className, stream, avatar, theme, onboarded, ageGroup, userId, signupDate, profileComplete, gamificationData, weeklyLeaderboard, reputationLeaderboard, studyGroupMemberships, groupQuizHistory, userQuestions, userAnswers, userVotes, favoriteQuestions, coinTransactions, notificationPreferences, answerStreakCount, lastAnswerDate, currentUserId, loadedGamificationData, parsed, safeParse, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Promise.all([
                            async_storage_1.default.getItem(STORAGE_KEYS.USER_NAME),
                            async_storage_1.default.getItem(STORAGE_KEYS.SELECTED_CLASS),
                            async_storage_1.default.getItem(STORAGE_KEYS.SELECTED_STREAM),
                            async_storage_1.default.getItem(STORAGE_KEYS.SELECTED_AVATAR),
                            async_storage_1.default.getItem(STORAGE_KEYS.THEME_PREFERENCE),
                            async_storage_1.default.getItem(STORAGE_KEYS.IS_ONBOARDED),
                            async_storage_1.default.getItem(STORAGE_KEYS.AGE_GROUP),
                            async_storage_1.default.getItem(STORAGE_KEYS.USER_ID),
                            async_storage_1.default.getItem(STORAGE_KEYS.SIGNUP_DATE),
                            async_storage_1.default.getItem(STORAGE_KEYS.PROFILE_COMPLETE),
                            async_storage_1.default.getItem(STORAGE_KEYS.GAMIFICATION_DATA),
                            async_storage_1.default.getItem(STORAGE_KEYS.WEEKLY_LEADERBOARD),
                            async_storage_1.default.getItem(STORAGE_KEYS.REPUTATION_LEADERBOARD),
                            async_storage_1.default.getItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS),
                            async_storage_1.default.getItem(STORAGE_KEYS.GROUP_QUIZ_HISTORY),
                            async_storage_1.default.getItem(STORAGE_KEYS.USER_QUESTIONS),
                            async_storage_1.default.getItem(STORAGE_KEYS.USER_ANSWERS),
                            async_storage_1.default.getItem(STORAGE_KEYS.USER_VOTES),
                            async_storage_1.default.getItem(STORAGE_KEYS.FAVORITE_QUESTIONS),
                            async_storage_1.default.getItem(STORAGE_KEYS.COIN_TRANSACTIONS),
                            async_storage_1.default.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES),
                            async_storage_1.default.getItem(STORAGE_KEYS.ANSWER_STREAK_COUNT),
                            async_storage_1.default.getItem(STORAGE_KEYS.LAST_ANSWER_DATE),
                        ])];
                case 1:
                    _a = _b.sent(), name_1 = _a[0], className = _a[1], stream = _a[2], avatar = _a[3], theme = _a[4], onboarded = _a[5], ageGroup = _a[6], userId = _a[7], signupDate = _a[8], profileComplete = _a[9], gamificationData = _a[10], weeklyLeaderboard = _a[11], reputationLeaderboard = _a[12], studyGroupMemberships = _a[13], groupQuizHistory = _a[14], userQuestions = _a[15], userAnswers = _a[16], userVotes = _a[17], favoriteQuestions = _a[18], coinTransactions = _a[19], notificationPreferences = _a[20], answerStreakCount = _a[21], lastAnswerDate = _a[22];
                    currentUserId = userId;
                    if (!!currentUserId) return [3 /*break*/, 3];
                    currentUserId = generateUserId();
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.USER_ID, currentUserId)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    loadedGamificationData = {
                        smartCoins: 0,
                        totalEarnedCoins: 0,
                        weeklyXP: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        lastActiveDate: null,
                        unlockedAvatars: ['Robot'],
                        purchasedAvatars: ['Robot'],
                        rankMilestones: [],
                        weeklyRank: 0,
                        lastWeekRank: 0,
                        reputation: 0,
                        badges: [],
                        achievementProgress: [],
                        reputationRank: 0,
                    };
                    if (gamificationData) {
                        try {
                            parsed = JSON.parse(gamificationData);
                            loadedGamificationData = __assign(__assign({}, loadedGamificationData), parsed);
                        }
                        catch (error) {
                            // Debug statement removed
                        }
                    }
                    safeParse = function (raw, fallback) {
                        if (!raw)
                            return fallback;
                        try {
                            return JSON.parse(raw);
                        }
                        catch (error) {
                            // Debug statement removed
                            return fallback;
                        }
                    };
                    set({
                        userId: currentUserId,
                        ageGroup: ageGroup,
                        userName: name_1 || '',
                        signupDate: signupDate || null,
                        profileComplete: profileComplete === 'true',
                        selectedClass: className || '',
                        selectedStream: stream || '',
                        selectedAvatar: avatar || 'Robot',
                        themePreference: theme || 'system',
                        isOnboarded: onboarded === 'true',
                        gamificationData: loadedGamificationData,
                        weeklyLeaderboard: safeParse(weeklyLeaderboard, []),
                        reputationLeaderboard: safeParse(reputationLeaderboard, []),
                        studyGroupMemberships: safeParse(studyGroupMemberships, []),
                        groupQuizHistory: safeParse(groupQuizHistory, []),
                        userQuestions: safeParse(userQuestions, []),
                        userAnswers: safeParse(userAnswers, []),
                        userVotes: safeParse(userVotes, {}),
                        favoriteQuestions: safeParse(favoriteQuestions, []),
                        coinTransactions: safeParse(coinTransactions, []),
                        notificationPreferences: safeParse(notificationPreferences, {
                            answers: true,
                            upvotes: true,
                            helpfulMarks: true,
                            badgeUnlocks: true,
                            leaderboardUpdates: true,
                            milestones: true,
                            pushEnabled: false,
                        }),
                        answerStreakCount: answerStreakCount ? parseInt(answerStreakCount, 10) : 0,
                        lastAnswerDate: lastAnswerDate || null,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Study group methods
    addStudyGroupMembership: function (membership) { return __awaiter(void 0, void 0, void 0, function () {
        var current, without, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().studyGroupMemberships;
                    without = current.filter(function (m) { return m.groupId !== membership.groupId; });
                    next = __spreadArray(__spreadArray([], without, true), [membership], false);
                    set({ studyGroupMemberships: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    removeStudyGroupMembership: function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().studyGroupMemberships;
                    next = current.filter(function (m) { return m.groupId !== groupId; });
                    set({ studyGroupMemberships: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    recordGroupQuizHistory: function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().groupQuizHistory;
                    next = __spreadArray([entry], current, true).slice(0, 200);
                    set({ groupQuizHistory: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GROUP_QUIZ_HISTORY, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    // Gamification methods
    addSmartCoins: function (amount, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    newData = __assign(__assign({}, currentData), { smartCoins: currentData.smartCoins + amount, totalEarnedCoins: currentData.totalEarnedCoins + amount });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    spendSmartCoins: function (amount, item) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    if (currentData.smartCoins < amount) {
                        // Debug statement removed
                        return [2 /*return*/, false];
                    }
                    newData = __assign(__assign({}, currentData), { smartCoins: currentData.smartCoins - amount });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    // Debug statement removed
                    return [2 /*return*/, true];
            }
        });
    }); },
    updateWeeklyXP: function (amount) {
        var currentData = get().gamificationData;
        var newData = __assign(__assign({}, currentData), { weeklyXP: currentData.weeklyXP + amount });
        set({ gamificationData: newData });
        async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    },
    unlockAvatar: function (avatarId) {
        var currentData = get().gamificationData;
        if (!currentData.unlockedAvatars.includes(avatarId)) {
            var newData = __assign(__assign({}, currentData), { unlockedAvatars: __spreadArray(__spreadArray([], currentData.unlockedAvatars, true), [avatarId], false) });
            set({ gamificationData: newData });
            async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
            // Debug statement removed
        }
    },
    purchaseAvatar: function (avatarId, cost) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    if (currentData.smartCoins < cost) {
                        return [2 /*return*/, false];
                    }
                    if (currentData.purchasedAvatars.includes(avatarId)) {
                        return [2 /*return*/, true]; // Already purchased
                    }
                    newData = __assign(__assign({}, currentData), { smartCoins: currentData.smartCoins - cost, purchasedAvatars: __spreadArray(__spreadArray([], currentData.purchasedAvatars, true), [avatarId], false), unlockedAvatars: __spreadArray(__spreadArray([], currentData.unlockedAvatars, true), [avatarId], false) });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    // Debug statement removed
                    return [2 /*return*/, true];
            }
        });
    }); },
    addRankMilestone: function (rankName) {
        var currentData = get().gamificationData;
        if (!currentData.rankMilestones.includes(rankName)) {
            var newData = __assign(__assign({}, currentData), { rankMilestones: __spreadArray(__spreadArray([], currentData.rankMilestones, true), [rankName], false) });
            set({ gamificationData: newData });
            async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
            // Debug statement removed
        }
    },
    updateWeeklyRank: function (rank) {
        var currentData = get().gamificationData;
        var newData = __assign(__assign({}, currentData), { weeklyRank: rank });
        set({ gamificationData: newData });
        async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    },
    setWeeklyLeaderboard: function (entries) {
        set({ weeklyLeaderboard: entries });
        async_storage_1.default.setItem(STORAGE_KEYS.WEEKLY_LEADERBOARD, JSON.stringify(entries));
    },
    resetWeeklyData: function () {
        var currentData = get().gamificationData;
        var newData = __assign(__assign({}, currentData), { weeklyXP: 0, lastWeekRank: currentData.weeklyRank });
        set({
            gamificationData: newData,
            weeklyLeaderboard: [],
        });
        async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
        async_storage_1.default.setItem(STORAGE_KEYS.WEEKLY_LEADERBOARD, JSON.stringify([]));
    },
    updateReputation: function (amount) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    newData = __assign(__assign({}, currentData), { reputation: Math.max(0, currentData.reputation + amount) });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    addBadge: function (badge) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    if (!!currentData.badges.find(function (b) { return b.id === badge.id; })) return [3 /*break*/, 2];
                    newData = __assign(__assign({}, currentData), { badges: __spreadArray(__spreadArray([], currentData.badges, true), [badge], false) });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    updateAchievementProgress: function (progress) { return __awaiter(void 0, void 0, void 0, function () {
        var currentData, existingIdx, nextProgress, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentData = get().gamificationData;
                    existingIdx = currentData.achievementProgress.findIndex(function (p) { return p.id === progress.id; });
                    nextProgress = __spreadArray([], currentData.achievementProgress, true);
                    if (existingIdx !== -1) {
                        nextProgress[existingIdx] = progress;
                    }
                    else {
                        nextProgress.push(progress);
                    }
                    newData = __assign(__assign({}, currentData), { achievementProgress: nextProgress });
                    set({ gamificationData: newData });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    setReputationLeaderboard: function (entries) {
        set({ reputationLeaderboard: entries });
        async_storage_1.default.setItem(STORAGE_KEYS.REPUTATION_LEADERBOARD, JSON.stringify(entries));
    },
    updateReputationRank: function (rank) {
        var currentData = get().gamificationData;
        var newData = __assign(__assign({}, currentData), { reputationRank: rank });
        set({ gamificationData: newData });
        async_storage_1.default.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    },
    // Q&A Forum actions
    addUserQuestion: function (questionId) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().userQuestions;
                    if (!!current.includes(questionId)) return [3 /*break*/, 2];
                    next = __spreadArray(__spreadArray([], current, true), [questionId], false);
                    set({ userQuestions: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.USER_QUESTIONS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    addUserAnswer: function (answerId) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().userAnswers;
                    if (!!current.includes(answerId)) return [3 /*break*/, 2];
                    next = __spreadArray(__spreadArray([], current, true), [answerId], false);
                    set({ userAnswers: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    addUserVote: function (answerId, voteType) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    current = get().userVotes;
                    next = __assign(__assign({}, current), (_a = {}, _a[answerId] = voteType, _a));
                    set({ userVotes: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(next))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    addToFavorites: function (questionId) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().favoriteQuestions;
                    if (!!current.includes(questionId)) return [3 /*break*/, 2];
                    next = __spreadArray(__spreadArray([], current, true), [questionId], false);
                    set({ favoriteQuestions: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.FAVORITE_QUESTIONS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    removeFromFavorites: function (questionId) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().favoriteQuestions;
                    next = current.filter(function (id) { return id !== questionId; });
                    set({ favoriteQuestions: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.FAVORITE_QUESTIONS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    isFavorite: function (questionId) {
        return get().favoriteQuestions.includes(questionId);
    },
    // Notification & Gamification actions
    addCoinTransaction: function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
        var current, newTransaction, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().coinTransactions;
                    newTransaction = __assign(__assign({}, transaction), { id: "tx_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 9)), timestamp: new Date().toISOString() });
                    next = __spreadArray([newTransaction], current, true).slice(0, 100);
                    set({ coinTransactions: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.COIN_TRANSACTIONS, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    getCoinTransactions: function () {
        return get().coinTransactions;
    },
    updateNotificationPreferences: function (prefs) { return __awaiter(void 0, void 0, void 0, function () {
        var current, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().notificationPreferences;
                    next = __assign(__assign({}, current), prefs);
                    set({ notificationPreferences: next });
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(next))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    updateAnswerStreak: function () { return __awaiter(void 0, void 0, void 0, function () {
        var current, lastDate, today, lastDateObj, todayObj, yesterday, newStreak, lastDateString, yesterdayString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = get().answerStreakCount;
                    lastDate = get().lastAnswerDate;
                    today = new Date().toISOString().split('T')[0];
                    if (lastDate === today) {
                        return [2 /*return*/];
                    }
                    lastDateObj = lastDate ? new Date(lastDate) : null;
                    todayObj = new Date(today);
                    yesterday = new Date(todayObj);
                    yesterday.setDate(yesterday.getDate() - 1);
                    newStreak = 1;
                    if (lastDateObj) {
                        lastDateString = lastDateObj.toISOString().split('T')[0];
                        yesterdayString = yesterday.toISOString().split('T')[0];
                        if (lastDateString === yesterdayString) {
                            newStreak = current + 1;
                        }
                    }
                    set({ answerStreakCount: newStreak, lastAnswerDate: today });
                    return [4 /*yield*/, Promise.all([
                            async_storage_1.default.setItem(STORAGE_KEYS.ANSWER_STREAK_COUNT, newStreak.toString()),
                            async_storage_1.default.setItem(STORAGE_KEYS.LAST_ANSWER_DATE, today),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    resetAnswerStreak: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ answerStreakCount: 0, lastAnswerDate: null });
                    return [4 /*yield*/, Promise.all([
                            async_storage_1.default.setItem(STORAGE_KEYS.ANSWER_STREAK_COUNT, '0'),
                            async_storage_1.default.removeItem(STORAGE_KEYS.LAST_ANSWER_DATE),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
}); });
