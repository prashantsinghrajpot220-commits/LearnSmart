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
exports.coinRewardService = exports.CoinRewardService = void 0;
var userStore_1 = require("@/store/userStore");
var CoinRewardService = /** @class */ (function () {
    function CoinRewardService() {
    }
    CoinRewardService.getInstance = function () {
        if (!CoinRewardService.instance) {
            CoinRewardService.instance = new CoinRewardService();
        }
        return CoinRewardService.instance;
    };
    CoinRewardService.prototype.awardCoins = function (reward) {
        return __awaiter(this, void 0, void 0, function () {
            var addSmartCoins, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        addSmartCoins = userStore_1.useUserStore.getState().addSmartCoins;
                        return [4 /*yield*/, addSmartCoins(reward.amount, reward.reason)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        // Failed to award coins - silently fail
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Lesson completion rewards
    CoinRewardService.prototype.rewardLessonCompletion = function () {
        return __awaiter(this, arguments, void 0, function (perfectScore) {
            var baseReward, bonusReward, totalReward;
            if (perfectScore === void 0) { perfectScore = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseReward = 10;
                        bonusReward = perfectScore ? 5 : 0;
                        totalReward = baseReward + bonusReward;
                        return [4 /*yield*/, this.awardCoins({
                                amount: totalReward,
                                reason: "Lesson completion".concat(perfectScore ? ' (Perfect Score Bonus)' : ''),
                                type: 'lesson',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Quiz completion rewards
    CoinRewardService.prototype.rewardQuizCompletion = function (score, totalQuestions) {
        return __awaiter(this, void 0, void 0, function () {
            var reward, percentage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reward = 10;
                        // Perfect score bonus
                        if (score === totalQuestions) {
                            reward += 5;
                        }
                        percentage = (score / totalQuestions) * 100;
                        if (percentage >= 90) {
                            reward += 3; // Excellent performance
                        }
                        else if (percentage >= 80) {
                            reward += 2; // Good performance
                        }
                        return [4 /*yield*/, this.awardCoins({
                                amount: reward,
                                reason: "Quiz completion (".concat(score, "/").concat(totalQuestions, " correct)"),
                                type: 'quiz',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Daily streak rewards
    CoinRewardService.prototype.rewardStreakMilestone = function (streakDays) {
        return __awaiter(this, void 0, void 0, function () {
            var reward, reason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reward = 0;
                        reason = '';
                        switch (streakDays) {
                            case 7:
                                reward = 5;
                                reason = '7-day streak milestone';
                                break;
                            case 14:
                                reward = 10;
                                reason = '14-day streak milestone';
                                break;
                            case 30:
                                reward = 25;
                                reason = '30-day streak milestone';
                                break;
                            case 60:
                                reward = 50;
                                reason = '60-day streak milestone';
                                break;
                            case 100:
                                reward = 100;
                                reason = '100-day streak milestone';
                                break;
                            default:
                                return [2 /*return*/]; // No reward for other milestones
                        }
                        return [4 /*yield*/, this.awardCoins({
                                amount: reward,
                                reason: reason,
                                type: 'streak',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Daily goal completion
    CoinRewardService.prototype.rewardDailyGoalCompletion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.awardCoins({
                            amount: 10,
                            reason: 'Daily goal completed',
                            type: 'daily_goal',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Achievement unlocks
    CoinRewardService.prototype.rewardAchievement = function (achievementName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.awardCoins({
                            amount: 15,
                            reason: "Achievement unlocked: ".concat(achievementName),
                            type: 'achievement',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Rank up celebrations
    CoinRewardService.prototype.rewardRankUp = function (rankName) {
        return __awaiter(this, void 0, void 0, function () {
            var reward;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reward = 0;
                        switch (rankName) {
                            case 'Scholar':
                                reward = 25;
                                break;
                            case 'Sage':
                                reward = 50;
                                break;
                            case 'Master':
                                reward = 100;
                                break;
                            case 'Guru':
                                reward = 200;
                                break;
                            default:
                                reward = 10;
                        }
                        return [4 /*yield*/, this.awardCoins({
                                amount: reward,
                                reason: "Rank up: ".concat(rankName, "!"),
                                type: 'rank_up',
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Bonus rewards for special events
    CoinRewardService.prototype.rewardBonus = function (reason_1) {
        return __awaiter(this, arguments, void 0, function (reason, amount) {
            if (amount === void 0) { amount = 20; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.awardCoins({
                            amount: amount,
                            reason: reason,
                            type: 'bonus',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Calculate total potential earnings for a session
    CoinRewardService.prototype.calculateSessionEarnings = function (lessonsCompleted, quizzesCompleted, perfectScores, streakBonus) {
        var total = 0;
        // Lesson earnings
        total += lessonsCompleted * 10;
        total += perfectScores * 5; // Perfect lesson bonuses
        // Quiz earnings
        total += quizzesCompleted * 10;
        total += perfectScores * 5; // Perfect quiz bonuses
        // Streak bonus
        if (streakBonus) {
            total += 5;
        }
        return total;
    };
    // Get reward history (for display purposes)
    CoinRewardService.prototype.getRewardHistory = function () {
        // In a real app, you'd store and retrieve reward history
        // For now, return empty array
        return [];
    };
    // Check if user should receive streak bonus
    CoinRewardService.prototype.shouldReceiveStreakBonus = function (currentStreak) {
        return [7, 14, 30].includes(currentStreak);
    };
    // Get streak bonus amount
    CoinRewardService.prototype.getStreakBonusAmount = function (streakDays) {
        var bonuses = {
            7: 5,
            14: 10,
            30: 25,
            60: 50,
            100: 100,
        };
        return bonuses[streakDays] || 0;
    };
    return CoinRewardService;
}());
exports.CoinRewardService = CoinRewardService;
exports.coinRewardService = CoinRewardService.getInstance();
