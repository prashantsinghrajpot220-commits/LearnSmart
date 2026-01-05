"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankSystem = exports.RankSystem = void 0;
var xpStore_1 = require("@/store/xpStore");
var RankSystem = /** @class */ (function () {
    function RankSystem() {
    }
    RankSystem.getInstance = function () {
        if (!RankSystem.instance) {
            RankSystem.instance = new RankSystem();
        }
        return RankSystem.instance;
    };
    // Get current rank with enhanced data
    RankSystem.prototype.getCurrentRankData = function () {
        var rank = xpStore_1.useXPStore.getState().getRank();
        return this.getRankData(rank.name);
    };
    // Get rank data by name
    RankSystem.prototype.getRankData = function (rankName) {
        var rank = xpStore_1.RANKS.find(function (r) { return r.name === rankName; });
        if (!rank) {
            return this.getDefaultRankData();
        }
        var milestoneData = {
            rankName: rank.name,
            level: rank.level,
            icon: rank.icon,
            color: rank.color,
            message: rank.message,
            unlockConditions: this.getUnlockConditions(rank.name),
            benefits: this.getRankBenefits(rank.name),
        };
        return milestoneData;
    };
    // Get unlock conditions for a rank
    RankSystem.prototype.getUnlockConditions = function (rankName) {
        var conditions = {
            'Novice': ['Create an account'],
            'Scholar': ['Reach 500 XP'],
            'Sage': ['Reach 1,500 XP'],
            'Master': ['Reach 3,000 XP'],
            'Guru': ['Reach 5,000 XP'],
        };
        return conditions[rankName] || [];
    };
    // Get benefits for reaching a rank
    RankSystem.prototype.getRankBenefits = function (rankName) {
        var benefits = {
            'Novice': ['Basic avatar selection', 'Access to all lessons'],
            'Scholar': ['Unlock Scholar avatar', 'Weekly leaderboard access', '10 bonus coins'],
            'Sage': ['Unlock Sage avatar', 'Advanced challenges', 'Priority support', '25 bonus coins'],
            'Master': ['Unlock Master avatar', 'Exclusive content', 'Mentor badge', '50 bonus coins'],
            'Guru': ['Unlock Guru avatar', 'VIP features', 'Content creator access', '100 bonus coins'],
        };
        return benefits[rankName] || [];
    };
    // Get rank progression without hooks (for non-component usage)
    RankSystem.prototype.getRankProgression = function () {
        var store = xpStore_1.useXPStore.getState();
        var rank = store.getRank();
        var progress = store.getProgressToNextRank();
        var currentXP = store.currentXP;
        var xpToNext = store.getXPToNextRank();
        var currentRankIndex = xpStore_1.RANKS.findIndex(function (r) { return r.name === rank.name; });
        var nextRank = currentRankIndex < xpStore_1.RANKS.length - 1 ? xpStore_1.RANKS[currentRankIndex + 1] : null;
        return {
            currentRank: this.getRankData(rank.name),
            nextRank: nextRank ? this.getRankData(nextRank.name) : null,
            xpToNext: xpToNext,
            progress: progress,
            rankUp: progress >= 1 && nextRank !== null,
            milestoneReached: this.getMilestoneReached(currentXP),
        };
    };
    // Get milestones reached based on XP
    RankSystem.prototype.getMilestoneReached = function (currentXP) {
        var milestones = [];
        if (currentXP >= 500)
            milestones.push('Scholar');
        if (currentXP >= 1500)
            milestones.push('Sage');
        if (currentXP >= 3000)
            milestones.push('Master');
        if (currentXP >= 5000)
            milestones.push('Guru');
        return milestones;
    };
    // Check if user can rank up
    RankSystem.prototype.canRankUp = function () {
        var progression = this.getRankProgression();
        return progression.rankUp;
    };
    // Get XP needed for next rank
    RankSystem.prototype.getXPForNextRank = function () {
        var progression = this.getRankProgression();
        return progression.xpToNext;
    };
    // Get progress percentage to next rank
    RankSystem.prototype.getProgressPercentage = function () {
        var progression = this.getRankProgression();
        return Math.round(progression.progress * 100);
    };
    // Get estimated time to next rank (based on average daily XP)
    RankSystem.prototype.getEstimatedDaysToNextRank = function (averageDailyXP) {
        if (averageDailyXP === void 0) { averageDailyXP = 50; }
        var xpNeeded = this.getXPForNextRank();
        if (averageDailyXP <= 0)
            return 0;
        return Math.ceil(xpNeeded / averageDailyXP);
    };
    // Get rank celebration message
    RankSystem.prototype.getRankUpMessage = function (newRankName) {
        var messages = {
            'Scholar': '🎓 Welcome to Scholar rank! You\'re becoming a true learner!',
            'Sage': '🧙‍♂️ Congratulations! You\'ve achieved Sage status with wisdom!',
            'Master': '🎉 Incredible! You\'ve reached Master level - excellence achieved!',
            'Guru': '🌟 AMAZING! You\'re now a Guru - ultimate wisdom attained!',
        };
        return messages[newRankName] || '🎊 Congratulations on your achievement!';
    };
    // Get rank-based avatar unlocks
    RankSystem.prototype.getRankAvatarUnlocks = function () {
        return {
            'Novice': ['Robot'],
            'Scholar': ['Owl', 'BookCharacter'],
            'Sage': ['Dragon', 'Wizard', 'BrainCharacter'],
            'Master': ['GoldenOwl', 'Phoenix'],
            'Guru': ['Astronaut', 'Alien'],
        };
    };
    // Get avatars unlocked by current rank
    RankSystem.prototype.getUnlockedAvatarsForCurrentRank = function () {
        var currentRank = xpStore_1.useXPStore.getState().getRank().name;
        var avatarUnlocks = this.getRankAvatarUnlocks();
        return avatarUnlocks[currentRank] || [];
    };
    // Check if user has reached all milestones
    RankSystem.prototype.hasReachedAllMilestones = function () {
        var currentXP = xpStore_1.useXPStore.getState().getXP();
        return currentXP >= 5000; // Guru rank
    };
    // Get next milestone
    RankSystem.prototype.getNextMilestone = function () {
        var currentXP = xpStore_1.useXPStore.getState().getXP();
        var milestones = [
            { rank: 'Scholar', xp: 500, message: 'Reach 500 XP to become a Scholar' },
            { rank: 'Sage', xp: 1500, message: 'Reach 1,500 XP to achieve Sage status' },
            { rank: 'Master', xp: 3000, message: 'Reach 3,000 XP to become a Master' },
            { rank: 'Guru', xp: 5000, message: 'Reach 5,000 XP to become a Guru' },
        ];
        for (var _i = 0, milestones_1 = milestones; _i < milestones_1.length; _i++) {
            var milestone = milestones_1[_i];
            if (currentXP < milestone.xp) {
                return milestone;
            }
        }
        return null; // All milestones reached
    };
    // Get rank history (for display)
    RankSystem.prototype.getRankHistory = function () {
        // In a real app, you'd track when each rank was achieved
        // For now, return empty array
        return [];
    };
    // Default rank data for fallback
    RankSystem.prototype.getDefaultRankData = function () {
        return {
            rankName: 'Unknown',
            level: 0,
            icon: '❓',
            color: '#999999',
            message: 'Unknown rank',
            unlockConditions: [],
            benefits: [],
        };
    };
    // Get all ranks with their thresholds
    RankSystem.prototype.getAllRanks = function () {
        return xpStore_1.RANKS.map(function (rank) { return ({
            name: rank.name,
            level: rank.level,
            minXP: rank.minXP,
            maxXP: rank.maxXP === Infinity ? 999999 : rank.maxXP,
            icon: rank.icon,
            color: rank.color,
        }); });
    };
    // Calculate XP bonus for rank
    RankSystem.prototype.getRankXPMultiplier = function (rankName) {
        var multipliers = {
            'Novice': 1.0,
            'Scholar': 1.1, // 10% bonus
            'Sage': 1.2, // 20% bonus
            'Master': 1.3, // 30% bonus
            'Guru': 1.5, // 50% bonus
        };
        return multipliers[rankName] || 1.0;
    };
    // Apply XP bonus based on rank
    RankSystem.prototype.applyRankBonus = function (baseXP) {
        var currentRank = xpStore_1.useXPStore.getState().getRank().name;
        var multiplier = this.getRankXPMultiplier(currentRank);
        return Math.round(baseXP * multiplier);
    };
    return RankSystem;
}());
exports.RankSystem = RankSystem;
exports.rankSystem = RankSystem.getInstance();
