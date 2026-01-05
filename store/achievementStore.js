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
exports.useLockedAchievements = exports.useUnlockedAchievements = exports.useAchievements = exports.useAchievementStore = void 0;
var INITIAL_ACHIEVEMENTS = [
    // Streak Achievements
    {
        id: 'day1',
        name: 'Day 1',
        description: 'Open the app for the first time',
        icon: '🎯',
        unlocked: false,
        unlockedDate: null,
        category: 'streak',
    },
    {
        id: 'streak7',
        name: 'On Fire',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: false,
        unlockedDate: null,
        category: 'streak',
    },
    {
        id: 'streak14',
        name: 'Unstoppable',
        description: 'Maintain a 14-day streak',
        icon: '💥',
        unlocked: false,
        unlockedDate: null,
        category: 'streak',
    },
    {
        id: 'streak30',
        name: 'Legendary',
        description: 'Maintain a 30-day streak',
        icon: '👑',
        unlocked: false,
        unlockedDate: null,
        category: 'streak',
    },
    // Quiz Achievements
    {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '📝',
        unlocked: false,
        unlockedDate: null,
        category: 'quiz',
    },
    {
        id: 'quiz_5',
        name: 'Quiz Master',
        description: 'Complete 5 quizzes',
        icon: '🏆',
        unlocked: false,
        unlockedDate: null,
        category: 'quiz',
    },
    {
        id: 'quiz_10',
        name: 'Quiz King',
        description: 'Complete 10 quizzes',
        icon: '👑',
        unlocked: false,
        unlockedDate: null,
        category: 'quiz',
    },
    {
        id: 'quiz_25',
        name: 'Quiz Legend',
        description: 'Complete 25 quizzes',
        icon: '🌟',
        unlocked: false,
        unlockedDate: null,
        category: 'quiz',
    },
    // Learning Achievements
    {
        id: 'first_lesson',
        name: 'First Lesson',
        description: 'Read your first lesson',
        icon: '📖',
        unlocked: false,
        unlockedDate: null,
        category: 'learning',
    },
    {
        id: 'lessons_10',
        name: 'Bookworm',
        description: 'Read 10 lessons',
        icon: '📚',
        unlocked: false,
        unlockedDate: null,
        category: 'learning',
    },
    {
        id: 'lessons_25',
        name: 'Scholar',
        description: 'Read 25 lessons',
        icon: '🎓',
        unlocked: false,
        unlockedDate: null,
        category: 'learning',
    },
    {
        id: 'lessons_50',
        name: 'Erudite',
        description: 'Read 50 lessons',
        icon: '📜',
        unlocked: false,
        unlockedDate: null,
        category: 'learning',
    },
    // XP Achievements
    {
        id: 'xp_200',
        name: 'Rising Star',
        description: 'Reach 200 XP (Seeker rank)',
        icon: '⭐',
        unlocked: false,
        unlockedDate: null,
        category: 'xp',
    },
    {
        id: 'xp_500',
        name: 'Knowledge Seeker',
        description: 'Reach 500 XP (Scholar rank)',
        icon: '💎',
        unlocked: false,
        unlockedDate: null,
        category: 'xp',
    },
    {
        id: 'xp_1000',
        name: 'Wisdom Keeper',
        description: 'Reach 1000 XP (Sage rank)',
        icon: '🧙',
        unlocked: false,
        unlockedDate: null,
        category: 'xp',
    },
];
var zustand_1 = require("zustand");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var STORAGE_KEY = '@learnsmart_achievements';
exports.useAchievementStore = (0, zustand_1.create)(function (set, get) { return ({
    achievements: INITIAL_ACHIEVEMENTS,
    newlyUnlockedId: null,
    loadAchievements: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, parsed_1, merged, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        parsed_1 = JSON.parse(data);
                        merged = get().achievements.map(function (initial) {
                            var saved = parsed_1.find(function (p) { return p.id === initial.id; });
                            return saved || initial;
                        });
                        set({ achievements: merged });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    checkAndUnlock: function (state) {
        var _a = get(), achievements = _a.achievements, unlockAchievement = _a.unlockAchievement;
        var newlyUnlocked = [];
        achievements.forEach(function (achievement) {
            if (achievement.unlocked)
                return;
            var shouldUnlock = false;
            switch (achievement.id) {
                case 'day1':
                    shouldUnlock = true; // Always unlock on first app open
                    break;
                case 'streak7':
                    shouldUnlock = state.currentStreak >= 7;
                    break;
                case 'streak14':
                    shouldUnlock = state.currentStreak >= 14;
                    break;
                case 'streak30':
                    shouldUnlock = state.currentStreak >= 30;
                    break;
                case 'first_quiz':
                    shouldUnlock = state.totalQuizzesCompleted >= 1;
                    break;
                case 'quiz_5':
                    shouldUnlock = state.totalQuizzesCompleted >= 5;
                    break;
                case 'quiz_10':
                    shouldUnlock = state.totalQuizzesCompleted >= 10;
                    break;
                case 'quiz_25':
                    shouldUnlock = state.totalQuizzesCompleted >= 25;
                    break;
                case 'first_lesson':
                    shouldUnlock = state.totalLessonsRead >= 1;
                    break;
                case 'lessons_10':
                    shouldUnlock = state.totalLessonsRead >= 10;
                    break;
                case 'lessons_25':
                    shouldUnlock = state.totalLessonsRead >= 25;
                    break;
                case 'lessons_50':
                    shouldUnlock = state.totalLessonsRead >= 50;
                    break;
                case 'xp_200':
                    shouldUnlock = state.currentXP >= 200;
                    break;
                case 'xp_500':
                    shouldUnlock = state.currentXP >= 500;
                    break;
                case 'xp_1000':
                    shouldUnlock = state.currentXP >= 1000;
                    break;
            }
            if (shouldUnlock) {
                unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement.id);
            }
        });
        return newlyUnlocked;
    },
    unlockAchievement: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var achievements, now, updated, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    achievements = get().achievements;
                    now = new Date().toISOString();
                    updated = achievements.map(function (a) {
                        return a.id === id
                            ? __assign(__assign({}, a), { unlocked: true, unlockedDate: now }) : a;
                    });
                    set({
                        achievements: updated,
                        newlyUnlockedId: id,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(updated))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getUnlockedCount: function () {
        return get().achievements.filter(function (a) { return a.unlocked; }).length;
    },
    getAchievementsByCategory: function (category) {
        return get().achievements.filter(function (a) { return a.category === category; });
    },
    resetAchievements: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ achievements: INITIAL_ACHIEVEMENTS, newlyUnlockedId: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.removeItem(STORAGE_KEY)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
}); });
// Selector hooks
var useAchievements = function () {
    return (0, exports.useAchievementStore)(function (state) { return state.achievements; });
};
exports.useAchievements = useAchievements;
var useUnlockedAchievements = function () {
    return (0, exports.useAchievementStore)(function (state) {
        return state.achievements.filter(function (a) { return a.unlocked; });
    });
};
exports.useUnlockedAchievements = useUnlockedAchievements;
var useLockedAchievements = function () {
    return (0, exports.useAchievementStore)(function (state) {
        return state.achievements.filter(function (a) { return !a.unlocked; });
    });
};
exports.useLockedAchievements = useLockedAchievements;
