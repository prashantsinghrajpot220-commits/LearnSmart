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
exports.useCurrentRank = exports.useXPStore = exports.RANKS = void 0;
var zustand_1 = require("zustand");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var CoinRewardService_1 = require("@/services/CoinRewardService");
exports.RANKS = [
    {
        name: 'Novice',
        level: 1,
        icon: '🌱',
        minXP: 0,
        maxXP: 500,
        color: '#9CAF88',
        message: 'Welcome, Novice! Your learning journey begins now.',
    },
    {
        name: 'Scholar',
        level: 2,
        icon: '📚',
        minXP: 500,
        maxXP: 1500,
        color: '#5D8AA8',
        message: 'Welcome to Scholar rank! Your dedication is showing.',
    },
    {
        name: 'Sage',
        level: 3,
        icon: '🧙',
        minXP: 1500,
        maxXP: 3000,
        color: '#9B7EBD',
        message: 'You\'ve achieved Sage status! Wisdom is yours.',
    },
    {
        name: 'Master',
        level: 4,
        icon: '🎓',
        minXP: 3000,
        maxXP: 5000,
        color: '#FF6B35',
        message: 'You\'ve reached Master level! Excellence achieved.',
    },
    {
        name: 'Guru',
        level: 5,
        icon: '🧠',
        minXP: 5000,
        maxXP: Infinity,
        color: '#FFD700',
        message: 'You\'re a Guru! Ultimate wisdom attained.',
    },
];
var STORAGE_KEY = '@learnsmart_xp';
exports.useXPStore = (0, zustand_1.create)(function (set, get) { return ({
    currentXP: 0,
    totalLessonsRead: 0,
    totalQuizzesCompleted: 0,
    lastXPUpdate: null,
    addXP: function (amount) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, currentXP, getRank, oldRank, newXP, newRank, rankUp, milestone, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = get(), currentXP = _a.currentXP, getRank = _a.getRank;
                    oldRank = getRank();
                    newXP = currentXP + amount;
                    newRank = getRank();
                    rankUp = false;
                    if (newXP >= newRank.minXP && oldRank.name !== newRank.name) {
                        rankUp = true;
                        milestone = newRank.message;
                        // Award SmartCoins for rank up
                        CoinRewardService_1.coinRewardService.rewardRankUp(newRank.name);
                    }
                    set({
                        currentXP: newXP,
                        lastXPUpdate: new Date().toISOString(),
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify({
                            currentXP: newXP,
                            totalLessonsRead: get().totalLessonsRead,
                            totalQuizzesCompleted: get().totalQuizzesCompleted,
                            lastXPUpdate: new Date().toISOString(),
                        }))];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, { rankUp: rankUp, newRank: newRank, milestone: milestone }];
            }
        });
    }); },
    getXP: function () {
        return get().currentXP;
    },
    getRank: function () {
        var xp = get().currentXP;
        for (var _i = 0, RANKS_1 = exports.RANKS; _i < RANKS_1.length; _i++) {
            var rank = RANKS_1[_i];
            if (xp >= rank.minXP && xp <= rank.maxXP) {
                return rank;
            }
        }
        return exports.RANKS[0]; // Default to Novice
    },
    getXPToNextRank: function () {
        var currentRank = get().getRank();
        var rankIndex = exports.RANKS.findIndex(function (r) { return r.name === currentRank.name; });
        if (rankIndex >= exports.RANKS.length - 1) {
            return Infinity; // Already at max rank
        }
        var nextRank = exports.RANKS[rankIndex + 1];
        return nextRank.minXP - get().currentXP;
    },
    getProgressToNextRank: function () {
        var currentRank = get().getRank();
        var rankIndex = exports.RANKS.findIndex(function (r) { return r.name === currentRank.name; });
        if (rankIndex >= exports.RANKS.length - 1) {
            return 1; // Max rank, 100% progress
        }
        var nextRank = exports.RANKS[rankIndex + 1];
        var xpInCurrentRank = get().currentXP - currentRank.minXP;
        var xpNeededForNextRank = nextRank.minXP - currentRank.minXP;
        return Math.min(xpInCurrentRank / xpNeededForNextRank, 1);
    },
    incrementLessonsRead: function () {
        set(function (state) { return ({ totalLessonsRead: state.totalLessonsRead + 1 }); });
    },
    incrementQuizzesCompleted: function () {
        set(function (state) { return ({ totalQuizzesCompleted: state.totalQuizzesCompleted + 1 }); });
    },
    loadXP: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, parsed, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        parsed = JSON.parse(data);
                        set({
                            currentXP: parsed.currentXP || 0,
                            totalLessonsRead: parsed.totalLessonsRead || 0,
                            totalQuizzesCompleted: parsed.totalQuizzesCompleted || 0,
                            lastXPUpdate: parsed.lastXPUpdate || null,
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    resetXP: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({
                        currentXP: 0,
                        totalLessonsRead: 0,
                        totalQuizzesCompleted: 0,
                        lastXPUpdate: null,
                    });
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
// Hook for getting rank with color
var useCurrentRank = function () {
    var getRank = (0, exports.useXPStore)(function (state) { return state.getRank; });
    var getProgress = (0, exports.useXPStore)(function (state) { return state.getProgressToNextRank; });
    var currentXP = (0, exports.useXPStore)(function (state) { return state.currentXP; });
    var getXPToNext = (0, exports.useXPStore)(function (state) { return state.getXPToNextRank; });
    return {
        rank: getRank(),
        progress: getProgress(),
        currentXP: currentXP,
        xpToNext: getXPToNext(),
    };
};
exports.useCurrentRank = useCurrentRank;
