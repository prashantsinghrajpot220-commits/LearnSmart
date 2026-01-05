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
exports.reputationService = exports.ReputationService = void 0;
var userStore_1 = require("@/store/userStore");
var QAForumService_1 = require("./QAForumService");
var NotificationService_1 = require("./NotificationService");
var StudyGroupService_1 = require("./StudyGroupService");
var GamificationService_1 = require("./GamificationService");
var BADGE_DEFINITIONS = {
    HELPER: {
        id: 'helper',
        name: 'Helper',
        description: 'Earned after 10 helpful answers',
        icon: '🤝',
        target: 10,
    },
    EXPERT: {
        id: 'expert',
        name: 'Expert',
        description: 'Earned after 50 helpful answers',
        icon: '🧠',
        target: 50,
    },
    COMMUNITY_STAR: {
        id: 'community_star',
        name: 'Community Star',
        description: 'Earned for consistent quality answers (20+ helpful + 4.5+ avg rating)',
        icon: '🌟',
        target: 20,
    },
};
var ReputationService = /** @class */ (function () {
    function ReputationService() {
    }
    ReputationService.getInstance = function () {
        if (!ReputationService.instance) {
            ReputationService.instance = new ReputationService();
        }
        return ReputationService.instance;
    };
    ReputationService.prototype.handleNewAnswer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var updateReputation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateReputation = userStore_1.useUserStore.getState().updateReputation;
                        return [4 /*yield*/, updateReputation(1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkBadges()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.handleHelpfulMark = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentUserId, updateReputation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), currentUserId = _a.userId, updateReputation = _a.updateReputation;
                        if (!(answer.userId === currentUserId)) return [3 /*break*/, 5];
                        return [4 /*yield*/, updateReputation(5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.checkBadges()];
                    case 2:
                        _b.sent();
                        // Award coins for helpful mark
                        return [4 /*yield*/, GamificationService_1.gamificationService.awardForHelpfulAnswer()];
                    case 3:
                        // Award coins for helpful mark
                        _b.sent();
                        // Check helpful count milestones
                        return [4 /*yield*/, this.checkHelpfulMilestones()];
                    case 4:
                        // Check helpful count milestones
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.checkHelpfulMilestones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userId, allQuestions, totalHelpful, _i, allQuestions_1, q, answers, myAnswers, _a, myAnswers_1, a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, QAForumService_1.qaForumService.getQuestions()];
                    case 1:
                        allQuestions = _b.sent();
                        totalHelpful = 0;
                        _i = 0, allQuestions_1 = allQuestions;
                        _b.label = 2;
                    case 2:
                        if (!(_i < allQuestions_1.length)) return [3 /*break*/, 5];
                        q = allQuestions_1[_i];
                        return [4 /*yield*/, QAForumService_1.qaForumService.loadAnswers(q.id)];
                    case 3:
                        answers = _b.sent();
                        myAnswers = answers.filter(function (a) { return a.userId === userId; });
                        for (_a = 0, myAnswers_1 = myAnswers; _a < myAnswers_1.length; _a++) {
                            a = myAnswers_1[_a];
                            totalHelpful += a.helpfulCount;
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, GamificationService_1.gamificationService.checkHelpfulCountMilestones(totalHelpful)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.handleUpvote = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentUserId, updateReputation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), currentUserId = _a.userId, updateReputation = _a.updateReputation;
                        if (!(answer.userId === currentUserId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, updateReputation(0.5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.checkBadges()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.checkBadges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, updateAchievementProgress, allQuestions, totalHelpful, ratedAnswersCount, totalRating, _i, allQuestions_2, q, answers, myAnswers, _b, myAnswers_2, a, rating, avgRating, starCondition, myGroups, isAdmin;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, updateAchievementProgress = _a.updateAchievementProgress;
                        return [4 /*yield*/, QAForumService_1.qaForumService.getQuestions()];
                    case 1:
                        allQuestions = _c.sent();
                        totalHelpful = 0;
                        ratedAnswersCount = 0;
                        totalRating = 0;
                        _i = 0, allQuestions_2 = allQuestions;
                        _c.label = 2;
                    case 2:
                        if (!(_i < allQuestions_2.length)) return [3 /*break*/, 5];
                        q = allQuestions_2[_i];
                        return [4 /*yield*/, QAForumService_1.qaForumService.loadAnswers(q.id)];
                    case 3:
                        answers = _c.sent();
                        myAnswers = answers.filter(function (a) { return a.userId === userId; });
                        for (_b = 0, myAnswers_2 = myAnswers; _b < myAnswers_2.length; _b++) {
                            a = myAnswers_2[_b];
                            totalHelpful += a.helpfulCount;
                            if (a.helpfulCount > 0 || a.upvoteCount > 0) {
                                ratedAnswersCount++;
                                rating = a.helpfulCount > 0 ? 5 : Math.min(5, 3 + a.upvoteCount * 0.5);
                                totalRating += rating;
                            }
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        avgRating = ratedAnswersCount > 0 ? totalRating / ratedAnswersCount : 0;
                        // Helper Badge
                        return [4 /*yield*/, this.processBadge(BADGE_DEFINITIONS.HELPER, totalHelpful)];
                    case 6:
                        // Helper Badge
                        _c.sent();
                        // Expert Badge
                        return [4 /*yield*/, this.processBadge(BADGE_DEFINITIONS.EXPERT, totalHelpful)];
                    case 7:
                        // Expert Badge
                        _c.sent();
                        starCondition = totalHelpful >= 20 && avgRating >= 4.5;
                        if (!starCondition) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.processBadge(BADGE_DEFINITIONS.COMMUNITY_STAR, totalHelpful)];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 9: 
                    // Update progress for Community Star
                    return [4 /*yield*/, updateAchievementProgress({
                            id: BADGE_DEFINITIONS.COMMUNITY_STAR.id,
                            name: BADGE_DEFINITIONS.COMMUNITY_STAR.name,
                            currentValue: totalHelpful,
                            targetValue: 20,
                        })];
                    case 10:
                        // Update progress for Community Star
                        _c.sent();
                        _c.label = 11;
                    case 11: return [4 /*yield*/, StudyGroupService_1.StudyGroupService.getInstance().getMyGroups()];
                    case 12:
                        myGroups = _c.sent();
                        isAdmin = myGroups.some(function (g) { return g.adminIds.includes(userId); });
                        if (!isAdmin) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.processBadge({
                                id: 'group_leader',
                                name: 'Group Leader',
                                description: 'Earned for being an active group organizer',
                                icon: '📣',
                                target: 1,
                            }, 1)];
                    case 13:
                        _c.sent();
                        _c.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.processBadge = function (definition, currentCount) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, addBadge, updateAchievementProgress, gamificationData, isUnlocked, newBadge;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), addBadge = _a.addBadge, updateAchievementProgress = _a.updateAchievementProgress, gamificationData = _a.gamificationData;
                        isUnlocked = gamificationData.badges.some(function (b) { return b.id === definition.id; });
                        if (!(currentCount >= definition.target && !isUnlocked)) return [3 /*break*/, 3];
                        newBadge = {
                            id: definition.id,
                            name: definition.name,
                            description: definition.description,
                            icon: definition.icon,
                            unlockedAt: new Date().toISOString(),
                        };
                        return [4 /*yield*/, addBadge(newBadge)];
                    case 1:
                        _b.sent();
                        NotificationService_1.notificationService.notifyBadgeUnlocked(newBadge);
                        // Award coins for badge unlock
                        return [4 /*yield*/, GamificationService_1.gamificationService.awardForBadgeUnlock(newBadge.name, newBadge.id)];
                    case 2:
                        // Award coins for badge unlock
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, updateAchievementProgress({
                            id: definition.id,
                            name: definition.name,
                            currentValue: Math.min(currentCount, definition.target),
                            targetValue: definition.target,
                        })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReputationService.prototype.generateMockLeaderboard = function (period) {
        var _a;
        var _b = userStore_1.useUserStore.getState(), userId = _b.userId, userName = _b.userName, selectedAvatar = _b.selectedAvatar, gamificationData = _b.gamificationData;
        var entries = [];
        // Add current user
        entries.push({
            userId: userId,
            userName: userName || 'You',
            avatar: selectedAvatar,
            reputation: gamificationData.reputation,
            badgeCount: gamificationData.badges.length,
            helpfulAnswers: ((_a = gamificationData.achievementProgress.find(function (p) { return p.id === 'helper'; })) === null || _a === void 0 ? void 0 : _a.currentValue) || 0,
            rank: 0,
        });
        // Mock other users
        var mockNames = [
            'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson', 'David Kim',
            'Lisa Park', 'James Brown', 'Maria Garcia', 'John Smith', 'Anna Davis',
            'Ryan Miller', 'Sophie Turner', 'Kevin Lee', 'Rachel Green', 'Daniel White',
            'Olivia Black', 'Ethan Clark', 'Grace Hall', 'Noah Adams', 'Zoe Scott'
        ];
        for (var i = 0; i < 19; i++) {
            var name_1 = mockNames[i];
            var avatars = ['Robot', 'Owl', 'BookCharacter', 'BrainCharacter', 'StarCharacter', 'Dragon', 'Wizard'];
            var avatar = avatars[i % avatars.length];
            var repMulti = 1;
            if (period === 'monthly')
                repMulti = 0.4;
            if (period === 'weekly')
                repMulti = 0.1;
            entries.push({
                userId: "mock_user_rep_".concat(i),
                userName: name_1,
                avatar: avatar,
                reputation: Math.floor((Math.random() * 500 + 50) * repMulti),
                badgeCount: Math.floor(Math.random() * 5),
                helpfulAnswers: Math.floor(Math.random() * 30),
                rank: 0,
            });
        }
        entries.sort(function (a, b) {
            if (b.reputation !== a.reputation)
                return b.reputation - a.reputation;
            return b.badgeCount - a.badgeCount;
        });
        entries.forEach(function (entry, index) {
            entry.rank = index + 1;
        });
        return entries;
    };
    return ReputationService;
}());
exports.ReputationService = ReputationService;
exports.reputationService = ReputationService.getInstance();
