"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
var notificationStore_1 = require("@/store/notificationStore");
var NotificationService = /** @class */ (function () {
    function NotificationService() {
    }
    NotificationService.getInstance = function () {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    };
    NotificationService.prototype.notifyGroupInvite = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'group_invite',
            title: 'Study group invite',
            message: "".concat(params.invitedBy ? "".concat(params.invitedBy, " invited you") : 'You were invited', " to join \u201C").concat(params.groupName, "\u201D."),
            data: { groupId: params.groupId },
        });
    };
    NotificationService.prototype.notifyGroupMessage = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'group_message',
            title: "New message in ".concat(params.groupName),
            message: "".concat(params.fromUserName, ": ").concat(params.preview),
            data: { groupId: params.groupId },
        });
    };
    NotificationService.prototype.notifyGroupQuizCreated = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'group_quiz_created',
            title: "New quiz in ".concat(params.groupName),
            message: "".concat(params.quizTitle, " \u00B7 Winner gets ").concat(params.reward, " SmartCoins"),
            data: { groupId: params.groupId },
        });
    };
    NotificationService.prototype.notifyGroupQuizResult = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'group_quiz_result',
            title: "Quiz results in ".concat(params.groupName),
            message: params.resultText,
            data: { groupId: params.groupId },
        });
    };
    NotificationService.prototype.notifyNewAnswer = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_new_answer',
            title: 'New answer to your question',
            message: "".concat(params.answererName, " answered: \"").concat(params.questionTitle, "\""),
            data: { questionId: params.questionId },
        });
    };
    NotificationService.prototype.notifyBadgeUnlocked = function (badge) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_badge_unlock',
            title: 'Badge unlocked! 🏅',
            message: "Congratulations! You've earned the ".concat(badge.icon, " ").concat(badge.name, " badge."),
            data: { badgeName: badge.name, badgeIcon: badge.icon },
        });
    };
    // Q&A Specific Notifications
    NotificationService.prototype.notifyUpvote = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_upvote',
            title: 'Someone upvoted your answer',
            message: params.answerText
                ? "".concat(params.voterName || 'Someone', " upvoted: \"").concat(params.answerText.substring(0, 50), "...\"")
                : "".concat(params.voterName || 'Someone', " upvoted your answer"),
        });
    };
    NotificationService.prototype.notifyHelpfulMark = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_helpful_mark',
            title: 'Your answer was marked helpful! 🎉',
            message: "+".concat(params.coins, " SmartCoins earned"),
            data: { coins: params.coins },
        });
    };
    NotificationService.prototype.notifyMilestone = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_milestone',
            title: 'Milestone reached! 🏆',
            message: "".concat(params.milestone, " \u00B7 +").concat(params.coins, " SmartCoins"),
            data: { milestone: params.milestone, coins: params.coins },
        });
    };
    NotificationService.prototype.notifyLeaderboard = function (params) {
        notificationStore_1.useNotificationStore.getState().pushNotification({
            type: 'qa_leaderboard',
            title: "Leaderboard Update \uD83D\uDCCA",
            message: "".concat(params.message, " (Rank #").concat(params.rank, ")"),
            data: { rank: params.rank },
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
exports.notificationService = NotificationService.getInstance();
