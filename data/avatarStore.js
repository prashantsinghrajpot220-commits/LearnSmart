"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAvatarUnlocked = exports.getPurchasedAvatars = exports.getLockedAvatars = exports.getAffordableAvatars = exports.getFreeAvatars = exports.getAvatarById = exports.getAvatarsByCategory = exports.AVATAR_STORE = void 0;
exports.AVATAR_STORE = [
    // Default avatars (free)
    {
        id: 'Robot',
        name: 'Classic Robot',
        description: 'The original LearnSmart robot companion',
        cost: 0,
        emoji: '🤖',
        category: 'robot',
    },
    // Robot variations (50-75 coins)
    {
        id: 'GoldRobot',
        name: 'Golden Robot',
        description: 'A premium golden robot with shine',
        cost: 75,
        emoji: '⚡',
        category: 'robot',
        unlockCondition: 'Reach Scholar rank',
    },
    {
        id: 'CyberRobot',
        name: 'Cyber Robot',
        description: 'A futuristic cyber-enhanced robot',
        cost: 100,
        emoji: '🔮',
        category: 'robot',
        unlockCondition: 'Reach Sage rank',
    },
    {
        id: 'MiniRobot',
        name: 'Mini Robot',
        description: 'A cute, compact robot helper',
        cost: 50,
        emoji: '🔧',
        category: 'robot',
    },
    // Owl variations (75-100 coins)
    {
        id: 'Owl',
        name: 'Wise Owl',
        description: 'A classic wise owl for learning',
        cost: 75,
        emoji: '🦉',
        category: 'animal',
    },
    {
        id: 'GoldenOwl',
        name: 'Golden Owl',
        description: 'A majestic golden owl with wisdom',
        cost: 100,
        emoji: '👑',
        category: 'animal',
        unlockCondition: 'Reach Master rank',
    },
    // Character avatars (75-125 coins)
    {
        id: 'BookCharacter',
        name: 'Book Character',
        description: 'A friendly character made of books',
        cost: 75,
        emoji: '📖',
        category: 'character',
    },
    {
        id: 'BrainCharacter',
        name: 'Brain Character',
        description: 'A character representing intelligence',
        cost: 100,
        emoji: '🧠',
        category: 'character',
    },
    {
        id: 'StarCharacter',
        name: 'Star Character',
        description: 'A bright and shining star character',
        cost: 75,
        emoji: '⭐',
        category: 'character',
    },
    // Fantasy avatars (100-150 coins)
    {
        id: 'Dragon',
        name: 'Learning Dragon',
        description: 'A friendly dragon that loves to learn',
        cost: 125,
        emoji: '🐉',
        category: 'fantasy',
        unlockCondition: 'Reach Sage rank',
    },
    {
        id: 'Phoenix',
        name: 'Phoenix',
        description: 'A mythical phoenix representing rebirth of learning',
        cost: 150,
        emoji: '🔥',
        category: 'fantasy',
        unlockCondition: 'Reach Master rank',
    },
    {
        id: 'Wizard',
        name: 'Learning Wizard',
        description: 'A wise wizard specializing in knowledge',
        cost: 125,
        emoji: '🧙‍♂️',
        category: 'fantasy',
        unlockCondition: 'Reach Sage rank',
    },
    {
        id: 'Scholar',
        name: 'Scholar',
        description: 'A distinguished academic scholar',
        cost: 100,
        emoji: '🎓',
        category: 'character',
        unlockCondition: 'Complete 50 lessons',
    },
    {
        id: 'Astronaut',
        name: 'Space Explorer',
        description: 'An astronaut exploring the universe of knowledge',
        cost: 150,
        emoji: '👨‍🚀',
        category: 'character',
        unlockCondition: 'Complete 100 lessons',
    },
    {
        id: 'Alien',
        name: 'Friendly Alien',
        description: 'A friendly alien visitor who loves learning',
        cost: 125,
        emoji: '👽',
        category: 'character',
        unlockCondition: 'Complete 25 quizzes',
    },
];
var getAvatarsByCategory = function (category) {
    return exports.AVATAR_STORE.filter(function (avatar) { return avatar.category === category; });
};
exports.getAvatarsByCategory = getAvatarsByCategory;
var getAvatarById = function (id) {
    return exports.AVATAR_STORE.find(function (avatar) { return avatar.id === id; });
};
exports.getAvatarById = getAvatarById;
var getFreeAvatars = function () {
    return exports.AVATAR_STORE.filter(function (avatar) { return avatar.cost === 0; });
};
exports.getFreeAvatars = getFreeAvatars;
var getAffordableAvatars = function (coins) {
    return exports.AVATAR_STORE.filter(function (avatar) { return avatar.cost > 0 && avatar.cost <= coins; });
};
exports.getAffordableAvatars = getAffordableAvatars;
var getLockedAvatars = function (unlockedAvatars) {
    return exports.AVATAR_STORE.filter(function (avatar) { return !unlockedAvatars.includes(avatar.id); });
};
exports.getLockedAvatars = getLockedAvatars;
var getPurchasedAvatars = function (purchasedAvatars) {
    return exports.AVATAR_STORE.filter(function (avatar) { return purchasedAvatars.includes(avatar.id); });
};
exports.getPurchasedAvatars = getPurchasedAvatars;
var isAvatarUnlocked = function (avatarId, rank, stats) {
    var _a, _b;
    var avatar = (0, exports.getAvatarById)(avatarId);
    if (!avatar || !avatar.unlockCondition)
        return true; // No unlock condition means it's available
    // Simple condition parsing for demo - in real app, you'd have more complex logic
    if (avatar.unlockCondition.includes('Reach') && avatar.unlockCondition.includes('rank')) {
        var requiredRank = avatar.unlockCondition.split('Reach ')[1];
        return rank === requiredRank;
    }
    if (avatar.unlockCondition.includes('Complete') && avatar.unlockCondition.includes('lesson')) {
        var requiredLessons = parseInt(((_a = avatar.unlockCondition.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0');
        return stats.totalLessonsRead >= requiredLessons;
    }
    if (avatar.unlockCondition.includes('Complete') && avatar.unlockCondition.includes('quiz')) {
        var requiredQuizzes = parseInt(((_b = avatar.unlockCondition.match(/\d+/)) === null || _b === void 0 ? void 0 : _b[0]) || '0');
        return stats.totalQuizzesCompleted >= requiredQuizzes;
    }
    return false;
};
exports.isAvatarUnlocked = isAvatarUnlocked;
