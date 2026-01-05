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
exports.gamificationService = exports.GamificationService = void 0;
var userStore_1 = require("@/store/userStore");
var NotificationService_1 = require("./NotificationService");
var GamificationService = /** @class */ (function () {
    function GamificationService() {
        // Debounce notifications to prevent spam
        this.lastNotificationTime = new Map();
        this.DEBOUNCE_MS = 60000; // 1 minute
    }
    GamificationService.getInstance = function () {
        if (!GamificationService.instance) {
            GamificationService.instance = new GamificationService();
        }
        return GamificationService.instance;
    };
    // SmartCoin Rewards
    GamificationService.prototype.awardSmartCoins = function (amount_1, reason_1) {
        return __awaiter(this, arguments, void 0, function (amount, reason, type) {
            var _a, addSmartCoins, addCoinTransaction, notificationPreferences;
            if (type === void 0) { type = 'earned'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), addSmartCoins = _a.addSmartCoins, addCoinTransaction = _a.addCoinTransaction, notificationPreferences = _a.notificationPreferences;
                        if (!(type === 'earned')) return [3 /*break*/, 4];
                        return [4 /*yield*/, addSmartCoins(amount, reason)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, addCoinTransaction({ amount: amount, reason: reason, type: 'earned' })];
                    case 2:
                        _b.sent();
                        // Check for milestone after earning coins
                        return [4 /*yield*/, this.checkCoinMilestones(amount)];
                    case 3:
                        // Check for milestone after earning coins
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, addCoinTransaction({ amount: -amount, reason: reason, type: 'spent' })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Award coins for helpful answer
    GamificationService.prototype.awardForHelpfulAnswer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var notificationPreferences;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notificationPreferences = userStore_1.useUserStore.getState().notificationPreferences;
                        if (notificationPreferences.helpfulMarks) {
                            NotificationService_1.notificationService.notifyHelpfulMark({
                                coins: 5,
                            });
                        }
                        return [4 /*yield*/, this.awardSmartCoins(5, 'Helpful answer marked')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Award coins for badge unlock
    GamificationService.prototype.awardForBadgeUnlock = function (badgeName, badgeId) {
        return __awaiter(this, void 0, void 0, function () {
            var coinAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coinAmount = this.getBadgeCoinAmount(badgeId);
                        if (!(coinAmount > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.awardSmartCoins(coinAmount, "Badge unlocked: ".concat(badgeName))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    GamificationService.prototype.getBadgeCoinAmount = function (badgeId) {
        switch (badgeId) {
            case 'helper':
                return 10;
            case 'expert':
                return 25;
            case 'community_star':
                return 50;
            default:
                return 5;
        }
    };
    // Award coins for posting answer (optional bonus)
    GamificationService.prototype.awardForAnswerPosted = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateAnswerStreak()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.awardSmartCoins(1, 'Answer posted')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Award coins for milestone
    GamificationService.prototype.awardForMilestone = function (milestone, coins) {
        return __awaiter(this, void 0, void 0, function () {
            var notificationPreferences;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notificationPreferences = userStore_1.useUserStore.getState().notificationPreferences;
                        if (notificationPreferences.milestones) {
                            NotificationService_1.notificationService.notifyMilestone({
                                milestone: milestone,
                                coins: coins,
                            });
                        }
                        return [4 /*yield*/, this.awardSmartCoins(coins, "Milestone: ".concat(milestone))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Update answer streak
    GamificationService.prototype.updateAnswerStreak = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, updateAnswerStreak, answerStreakCount, newStreak;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), updateAnswerStreak = _a.updateAnswerStreak, answerStreakCount = _a.answerStreakCount;
                        return [4 /*yield*/, updateAnswerStreak()];
                    case 1:
                        _b.sent();
                        newStreak = userStore_1.useUserStore.getState().answerStreakCount;
                        if (!(newStreak === 7 && answerStreakCount < 7)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awardForMilestone('7-day answer streak', 20)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(newStreak === 30 && answerStreakCount < 30)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.awardForMilestone('30-day answer streak', 100)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Check for coin milestones
    GamificationService.prototype.checkCoinMilestones = function (amountEarned) {
        return __awaiter(this, void 0, void 0, function () {
            var gamificationData, currentCoins, milestones, _i, milestones_1, milestone, wasBelow, isNowAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gamificationData = userStore_1.useUserStore.getState().gamificationData;
                        currentCoins = gamificationData.smartCoins;
                        milestones = [
                            { threshold: 100, coins: 10, name: '100 coins reached' },
                            { threshold: 500, coins: 25, name: '500 coins reached' },
                            { threshold: 1000, coins: 50, name: '1000 coins reached' },
                        ];
                        _i = 0, milestones_1 = milestones;
                        _a.label = 1;
                    case 1:
                        if (!(_i < milestones_1.length)) return [3 /*break*/, 4];
                        milestone = milestones_1[_i];
                        wasBelow = currentCoins - amountEarned < milestone.threshold;
                        isNowAt = currentCoins >= milestone.threshold;
                        if (!(wasBelow && isNowAt)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awardForMilestone(milestone.name, milestone.coins)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Check for answer count milestones
    GamificationService.prototype.checkAnswerCountMilestones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userAnswers, notificationPreferences, answerCount, milestones, _i, milestones_2, milestone, wasBelow, isNowAt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userAnswers = _a.userAnswers, notificationPreferences = _a.notificationPreferences;
                        answerCount = userAnswers.length;
                        milestones = [
                            { threshold: 10, coins: 15, name: '10 questions answered' },
                            { threshold: 50, coins: 50, name: '50 questions answered' },
                            { threshold: 100, coins: 100, name: '100 questions answered' },
                        ];
                        _i = 0, milestones_2 = milestones;
                        _b.label = 1;
                    case 1:
                        if (!(_i < milestones_2.length)) return [3 /*break*/, 4];
                        milestone = milestones_2[_i];
                        wasBelow = answerCount - 1 < milestone.threshold;
                        isNowAt = answerCount >= milestone.threshold;
                        if (!(wasBelow && isNowAt && notificationPreferences.milestones)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awardForMilestone(milestone.name, milestone.coins)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Check for helpful count milestones
    GamificationService.prototype.checkHelpfulCountMilestones = function (helpfulCount) {
        return __awaiter(this, void 0, void 0, function () {
            var notificationPreferences, milestones, _i, milestones_3, milestone, wasBelow, isNowAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notificationPreferences = userStore_1.useUserStore.getState().notificationPreferences;
                        milestones = [
                            { threshold: 10, coins: 15, name: '10 helpful marks' },
                            { threshold: 50, coins: 50, name: '50 helpful marks' },
                            { threshold: 100, coins: 100, name: '100 helpful marks' },
                        ];
                        _i = 0, milestones_3 = milestones;
                        _a.label = 1;
                    case 1:
                        if (!(_i < milestones_3.length)) return [3 /*break*/, 4];
                        milestone = milestones_3[_i];
                        wasBelow = helpfulCount - 1 < milestone.threshold;
                        isNowAt = helpfulCount >= milestone.threshold;
                        if (!(wasBelow && isNowAt && notificationPreferences.milestones)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awardForMilestone(milestone.name, milestone.coins)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Check for leaderboard position updates
    GamificationService.prototype.checkLeaderboardPosition = function (newRank, previousRank) {
        return __awaiter(this, void 0, void 0, function () {
            var notificationPreferences;
            return __generator(this, function (_a) {
                notificationPreferences = userStore_1.useUserStore.getState().notificationPreferences;
                if (!notificationPreferences.leaderboardUpdates) {
                    return [2 /*return*/];
                }
                // Check if user entered top 10
                if (previousRank > 10 && newRank <= 10) {
                    NotificationService_1.notificationService.notifyLeaderboard({
                        rank: newRank,
                        message: "You're in the top 10 most helpful students!",
                    });
                }
                // Check if user moved up significantly
                if (previousRank - newRank >= 5 && newRank <= 50) {
                    NotificationService_1.notificationService.notifyLeaderboard({
                        rank: newRank,
                        message: "You moved up ".concat(previousRank - newRank, " positions on the leaderboard!"),
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    GamificationService.prototype.shouldSendNotification = function (type, key) {
        var notificationKey = "".concat(type, "_").concat(key);
        var lastTime = this.lastNotificationTime.get(notificationKey);
        var now = Date.now();
        if (lastTime && now - lastTime < this.DEBOUNCE_MS) {
            return false;
        }
        this.lastNotificationTime.set(notificationKey, now);
        return true;
    };
    return GamificationService;
}());
exports.GamificationService = GamificationService;
exports.gamificationService = GamificationService.getInstance();
