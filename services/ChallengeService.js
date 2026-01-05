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
exports.challengeService = exports.ChallengeService = void 0;
var userStore_1 = require("@/store/userStore");
var CoinRewardService_1 = require("./CoinRewardService");
var ChallengeService = /** @class */ (function () {
    function ChallengeService() {
        this.challenges = [];
    }
    ChallengeService.getInstance = function () {
        if (!ChallengeService.instance) {
            ChallengeService.instance = new ChallengeService();
        }
        return ChallengeService.instance;
    };
    // Create a new challenge
    ChallengeService.prototype.createChallenge = function (challengedUserId, subject, quizId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, userName, challenge;
            return __generator(this, function (_b) {
                _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName;
                challenge = {
                    id: "challenge_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 9)),
                    challengerId: userId,
                    challengedId: challengedUserId,
                    challengerName: userName || 'Anonymous',
                    challengedName: 'Friend', // In real app, fetch from user data
                    subject: subject,
                    quizId: quizId,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    reward: 25, // Winner gets 25 SmartCoins
                };
                this.challenges.push(challenge);
                // In real app, send notification to challenged user
                return [2 /*return*/, challenge.id];
            });
        });
    };
    // Accept a challenge
    ChallengeService.prototype.acceptChallenge = function (challengeId) {
        return __awaiter(this, void 0, void 0, function () {
            var challengeIndex, challenge;
            return __generator(this, function (_a) {
                challengeIndex = this.challenges.findIndex(function (c) { return c.id === challengeId; });
                if (challengeIndex === -1)
                    return [2 /*return*/, false];
                challenge = this.challenges[challengeIndex];
                if (challenge.status !== 'pending')
                    return [2 /*return*/, false];
                challenge.status = 'accepted';
                return [2 /*return*/, true];
            });
        });
    };
    // Submit quiz results for a challenge
    ChallengeService.prototype.submitChallengeResults = function (challengeId, userScore, isChallenger) {
        return __awaiter(this, void 0, void 0, function () {
            var challengeIndex, challenge, winnerId, currentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        challengeIndex = this.challenges.findIndex(function (c) { return c.id === challengeId; });
                        if (challengeIndex === -1)
                            throw new Error('Challenge not found');
                        challenge = this.challenges[challengeIndex];
                        if (isChallenger) {
                            challenge.challengerScore = userScore;
                        }
                        else {
                            challenge.challengedScore = userScore;
                        }
                        if (!(challenge.challengerScore !== undefined && challenge.challengedScore !== undefined)) return [3 /*break*/, 2];
                        // Determine winner
                        if (challenge.challengerScore > challenge.challengedScore) {
                            challenge.winner = 'challenger';
                        }
                        else if (challenge.challengedScore > challenge.challengerScore) {
                            challenge.winner = 'challenged';
                        }
                        else {
                            challenge.winner = 'tie';
                        }
                        challenge.status = 'completed';
                        challenge.completedAt = new Date().toISOString();
                        if (!(challenge.winner !== 'tie')) return [3 /*break*/, 2];
                        winnerId = challenge.winner === 'challenger' ? challenge.challengerId : challenge.challengedId;
                        currentUser = userStore_1.useUserStore.getState();
                        if (!(currentUser.userId === winnerId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, CoinRewardService_1.coinRewardService.awardCoins({
                                amount: challenge.reward,
                                reason: "Won ".concat(challenge.subject, " quiz challenge!"),
                                type: 'bonus',
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            winner: challenge.winner || 'tie',
                            reward: challenge.reward,
                        }];
                }
            });
        });
    };
    // Get pending challenges for current user
    ChallengeService.prototype.getPendingChallenges = function () {
        var userId = userStore_1.useUserStore.getState().userId;
        return this.challenges.filter(function (challenge) {
            return challenge.challengedId === userId &&
                challenge.status === 'pending';
        });
    };
    // Get user's active challenges
    ChallengeService.prototype.getUserChallenges = function () {
        var userId = userStore_1.useUserStore.getState().userId;
        return this.challenges.filter(function (challenge) {
            return challenge.challengerId === userId ||
                challenge.challengedId === userId;
        }).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
    };
    // Get challenge statistics
    ChallengeService.prototype.getChallengeStats = function () {
        var userChallenges = this.getUserChallenges();
        var completedChallenges = userChallenges.filter(function (c) { return c.status === 'completed'; });
        var wins = completedChallenges.filter(function (c) {
            var isChallenger = c.challengerId === userStore_1.useUserStore.getState().userId;
            return (isChallenger && c.winner === 'challenger') || (!isChallenger && c.winner === 'challenged');
        }).length;
        var losses = completedChallenges.filter(function (c) {
            var isChallenger = c.challengerId === userStore_1.useUserStore.getState().userId;
            return (isChallenger && c.winner === 'challenged') || (!isChallenger && c.winner === 'challenger');
        }).length;
        var ties = completedChallenges.filter(function (c) { return c.winner === 'tie'; }).length;
        var totalEarnings = completedChallenges
            .filter(function (c) {
            var isChallenger = c.challengerId === userStore_1.useUserStore.getState().userId;
            return (isChallenger && c.winner === 'challenger') || (!isChallenger && c.winner === 'challenged');
        })
            .reduce(function (total, c) { return total + c.reward; }, 0);
        return {
            totalChallenges: userChallenges.length,
            wins: wins,
            losses: losses,
            ties: ties,
            winRate: completedChallenges.length > 0 ? (wins / completedChallenges.length) * 100 : 0,
            totalEarnings: totalEarnings,
        };
    };
    // Expire old pending challenges
    ChallengeService.prototype.expireOldChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, oneDayAgo;
            return __generator(this, function (_a) {
                now = new Date();
                oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                this.challenges.forEach(function (challenge) {
                    if (challenge.status === 'pending') {
                        var createdAt = new Date(challenge.createdAt);
                        if (createdAt < oneDayAgo) {
                            challenge.status = 'expired';
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // Get challenge by ID
    ChallengeService.prototype.getChallengeById = function (challengeId) {
        return this.challenges.find(function (c) { return c.id === challengeId; });
    };
    // Generate mock challenge for demo
    ChallengeService.prototype.createMockChallenge = function () {
        var _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName;
        var mockChallenge = {
            id: "mock_".concat(Date.now()),
            challengerId: 'mock_user_1',
            challengedId: userId,
            challengerName: 'Alex Chen',
            challengedName: userName || 'You',
            subject: 'Mathematics',
            quizId: 'math_quiz_1',
            status: 'pending',
            createdAt: new Date().toISOString(),
            reward: 25,
        };
        this.challenges.push(mockChallenge);
        return mockChallenge.id;
    };
    // Clear all challenges (for testing)
    ChallengeService.prototype.clearChallenges = function () {
        this.challenges = [];
    };
    return ChallengeService;
}());
exports.ChallengeService = ChallengeService;
exports.challengeService = ChallengeService.getInstance();
