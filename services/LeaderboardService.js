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
exports.leaderboardService = exports.LeaderboardService = void 0;
var userStore_1 = require("@/store/userStore");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var LeaderboardService = /** @class */ (function () {
    function LeaderboardService() {
        this.STORAGE_KEY = '@learnsmart_leaderboards';
        this.WEEKLY_RESET_KEY = '@learnsmart_last_reset';
    }
    LeaderboardService.getInstance = function () {
        if (!LeaderboardService.instance) {
            LeaderboardService.instance = new LeaderboardService();
        }
        return LeaderboardService.instance;
    };
    // Get the start of the current week (Sunday 12 AM)
    LeaderboardService.prototype.getCurrentWeekStart = function () {
        var now = new Date();
        var dayOfWeek = now.getDay();
        var daysToSubtract = dayOfWeek; // 0 = Sunday, 1 = Monday, etc.
        var weekStart = new Date(now);
        weekStart.setDate(now.getDate() - daysToSubtract);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart.toISOString();
    };
    // Check if weekly reset is needed
    LeaderboardService.prototype.checkWeeklyReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastReset, currentWeekStart, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.WEEKLY_RESET_KEY)];
                    case 1:
                        lastReset = _a.sent();
                        currentWeekStart = this.getCurrentWeekStart();
                        if (!(!lastReset || lastReset !== currentWeekStart)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.resetWeeklyData()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, async_storage_1.default.setItem(this.WEEKLY_RESET_KEY, currentWeekStart)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5:
                        error_1 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Reset all weekly data
    LeaderboardService.prototype.resetWeeklyData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resetWeeklyData;
            return __generator(this, function (_a) {
                try {
                    resetWeeklyData = userStore_1.useUserStore.getState().resetWeeklyData;
                    resetWeeklyData();
                    // Action completed
                }
                catch (error) {
                    // Error handled silently
                }
                return [2 /*return*/];
            });
        });
    };
    // Update user's weekly XP
    LeaderboardService.prototype.updateWeeklyXP = function (userId, xpAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, updateWeeklyXP, gamificationData, currentUserId;
            return __generator(this, function (_b) {
                try {
                    _a = userStore_1.useUserStore.getState(), updateWeeklyXP = _a.updateWeeklyXP, gamificationData = _a.gamificationData, currentUserId = _a.userId;
                    if (userId === currentUserId) {
                        updateWeeklyXP(xpAmount);
                    }
                    // In a real app, you'd also update the server-side leaderboard here
                    // Action completed
                }
                catch (error) {
                    // Error handled silently
                }
                return [2 /*return*/];
            });
        });
    };
    // Generate mock leaderboard data for demo
    LeaderboardService.prototype.generateMockLeaderboard = function (gradeGroup, userCount) {
        if (userCount === void 0) { userCount = 50; }
        var entries = [];
        var _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName, selectedAvatar = _a.selectedAvatar, gamificationData = _a.gamificationData;
        // Add current user
        entries.push({
            userId: userId,
            userName: userName || 'You',
            avatar: selectedAvatar,
            weeklyXP: gamificationData.weeklyXP,
            streak: gamificationData.currentStreak,
            rank: 0, // Will be calculated
        });
        // Generate mock users
        var mockNames = [
            'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson', 'David Kim',
            'Lisa Park', 'James Brown', 'Maria Garcia', 'John Smith', 'Anna Davis',
            'Ryan Miller', 'Sophie Turner', 'Kevin Lee', 'Rachel Green', 'Daniel White',
            'Olivia Black', 'Ethan Clark', 'Grace Hall', 'Noah Adams', 'Zoe Scott'
        ];
        for (var i = 0; i < userCount - 1; i++) {
            var name_1 = mockNames[i % mockNames.length] + (i >= mockNames.length ? " ".concat(Math.floor(i / mockNames.length) + 1) : '');
            var avatars = ['Robot', 'Owl', 'BookCharacter', 'BrainCharacter', 'StarCharacter', 'Dragon', 'Wizard'];
            var avatar = avatars[i % avatars.length];
            entries.push({
                userId: "mock_user_".concat(i),
                userName: name_1,
                avatar: avatar,
                weeklyXP: Math.floor(Math.random() * 500) + 50, // 50-550 XP
                streak: Math.floor(Math.random() * 30) + 1, // 1-30 day streak
                rank: 0, // Will be calculated
            });
        }
        // Sort by weekly XP descending and assign ranks
        entries.sort(function (a, b) { return b.weeklyXP - a.weeklyXP; });
        entries.forEach(function (entry, index) {
            entry.rank = index + 1;
        });
        return {
            weekStart: this.getCurrentWeekStart(),
            entries: entries,
            gradeGroup: gradeGroup,
        };
    };
    // Get leaderboard for user's grade group
    LeaderboardService.prototype.getLeaderboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ageGroup, gradeGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkWeeklyReset()];
                    case 1:
                        _a.sent();
                        ageGroup = userStore_1.useUserStore.getState().ageGroup;
                        gradeGroup = ageGroup === 'under12' ? 'under12' : '12plus';
                        // For demo, generate mock data
                        return [2 /*return*/, this.generateMockLeaderboard(gradeGroup)];
                }
            });
        });
    };
    // Get user's rank in leaderboard
    LeaderboardService.prototype.getUserRank = function (leaderboard) {
        var userId = userStore_1.useUserStore.getState().userId;
        var userEntry = leaderboard.entries.find(function (entry) { return entry.userId === userId; });
        return (userEntry === null || userEntry === void 0 ? void 0 : userEntry.rank) || 0;
    };
    // Get top 10 entries
    LeaderboardService.prototype.getTopEntries = function (leaderboard, count) {
        if (count === void 0) { count = 10; }
        return leaderboard.entries.slice(0, count);
    };
    // Get leaderboard statistics
    LeaderboardService.prototype.getLeaderboardStats = function (leaderboard) {
        var userRank = this.getUserRank(leaderboard);
        var totalParticipants = leaderboard.entries.length;
        var averageXP = leaderboard.entries.reduce(function (sum, entry) { return sum + entry.weeklyXP; }, 0) / totalParticipants;
        // Mock rank change for demo
        var topRankChange = Math.floor(Math.random() * 6) - 3; // -3 to +2
        return {
            totalParticipants: totalParticipants,
            userRank: userRank,
            topRankChange: topRankChange,
            averageXP: Math.round(averageXP),
        };
    };
    // Check if user is in top 10
    LeaderboardService.prototype.isInTopTen = function (leaderboard) {
        return this.getUserRank(leaderboard) <= 10;
    };
    // Get user's position relative to top 10
    LeaderboardService.prototype.getUserPositionStatus = function (leaderboard) {
        var userRank = this.getUserRank(leaderboard);
        if (userRank === 0)
            return 'Not ranked';
        if (userRank <= 3)
            return 'Top 3! 🌟';
        if (userRank <= 10)
            return 'Top 10! 🏆';
        if (userRank <= 25)
            return 'Top 25! 🔥';
        return 'Keep climbing! 📈';
    };
    // Get XP needed to reach next rank
    LeaderboardService.prototype.getXPToNextRank = function (leaderboard) {
        var userRank = this.getUserRank(leaderboard);
        if (userRank === 0)
            return 0;
        var userEntry = leaderboard.entries[userRank - 1];
        var nextEntry = leaderboard.entries[userRank]; // Next person
        if (!nextEntry)
            return 0; // Already at top
        return Math.max(0, nextEntry.weeklyXP - userEntry.weeklyXP + 1);
    };
    // Save leaderboard data locally
    LeaderboardService.prototype.saveLeaderboard = function (leaderboard) {
        return __awaiter(this, void 0, void 0, function () {
            var setWeeklyLeaderboard, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(this.STORAGE_KEY, JSON.stringify(leaderboard))];
                    case 1:
                        _a.sent();
                        setWeeklyLeaderboard = userStore_1.useUserStore.getState().setWeeklyLeaderboard;
                        setWeeklyLeaderboard(leaderboard.entries);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Load leaderboard data from local storage
    LeaderboardService.prototype.loadLeaderboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stored, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.STORAGE_KEY)];
                    case 1:
                        stored = _a.sent();
                        if (stored) {
                            return [2 /*return*/, JSON.parse(stored)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    // Get previous week's leaderboard (mock data for demo)
    LeaderboardService.prototype.getPreviousWeekLeaderboard = function () {
        var ageGroup = userStore_1.useUserStore.getState().ageGroup;
        var gradeGroup = ageGroup === 'under12' ? 'under12' : '12plus';
        // Generate mock data for previous week with slightly different scores
        var previousWeek = this.generateMockLeaderboard(gradeGroup);
        previousWeek.entries.forEach(function (entry) {
            entry.weeklyXP = Math.max(0, entry.weeklyXP + Math.floor(Math.random() * 100) - 50);
        });
        previousWeek.entries.sort(function (a, b) { return b.weeklyXP - a.weeklyXP; });
        previousWeek.entries.forEach(function (entry, index) {
            entry.rank = index + 1;
        });
        return previousWeek;
    };
    // Calculate streak-based bonuses for leaderboard
    LeaderboardService.prototype.getStreakBonusMultiplier = function (streak) {
        if (streak >= 30)
            return 1.5; // 50% bonus for 30+ day streaks
        if (streak >= 14)
            return 1.3; // 30% bonus for 14+ day streaks
        if (streak >= 7)
            return 1.2; // 20% bonus for 7+ day streaks
        return 1.0; // No bonus
    };
    // Format time until next reset
    LeaderboardService.prototype.getTimeUntilNextReset = function () {
        var now = new Date();
        var nextSunday = new Date(now);
        nextSunday.setDate(now.getDate() + (7 - now.getDay()));
        nextSunday.setHours(0, 0, 0, 0);
        var diff = nextSunday.getTime() - now.getTime();
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0)
            return "".concat(days, "d ").concat(hours, "h");
        return "".concat(hours, "h");
    };
    return LeaderboardService;
}());
exports.LeaderboardService = LeaderboardService;
exports.leaderboardService = LeaderboardService.getInstance();
