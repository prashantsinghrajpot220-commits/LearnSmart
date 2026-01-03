import { useNotificationStore } from '@/store/notificationStore';

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  notifyGroupInvite(params: { groupId: string; groupName: string; invitedBy?: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'group_invite',
      title: 'Study group invite',
      message: `${params.invitedBy ? `${params.invitedBy} invited you` : 'You were invited'} to join “${params.groupName}”.`,
      data: { groupId: params.groupId },
    });
  }

  notifyGroupMessage(params: { groupId: string; groupName: string; fromUserName: string; preview: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'group_message',
      title: `New message in ${params.groupName}`,
      message: `${params.fromUserName}: ${params.preview}`,
      data: { groupId: params.groupId },
    });
  }

  notifyGroupQuizCreated(params: { groupId: string; groupName: string; quizTitle: string; reward: number }): void {
    useNotificationStore.getState().pushNotification({
      type: 'group_quiz_created',
      title: `New quiz in ${params.groupName}`,
      message: `${params.quizTitle} · Winner gets ${params.reward} SmartCoins`,
      data: { groupId: params.groupId },
    });
  }

  notifyGroupQuizResult(params: { groupId: string; groupName: string; resultText: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'group_quiz_result',
      title: `Quiz results in ${params.groupName}`,
      message: params.resultText,
      data: { groupId: params.groupId },
    });
  }

  notifyNewAnswer(params: { questionId: string; questionTitle: string; answererName: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_new_answer',
      title: 'New answer to your question',
      message: `${params.answererName} answered: "${params.questionTitle}"`,
      data: { questionId: params.questionId },
    });
  }

  notifyBadgeUnlocked(badge: { name: string; icon: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_badge_unlock',
      title: 'Badge unlocked! 🏅',
      message: `Congratulations! You've earned the ${badge.icon} ${badge.name} badge.`,
      data: { badgeName: badge.name, badgeIcon: badge.icon },
    });
  }

  // Q&A Specific Notifications
  notifyUpvote(params: { voterName?: string; answerText?: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_upvote',
      title: 'Someone upvoted your answer',
      message: params.answerText
        ? `${params.voterName || 'Someone'} upvoted: "${params.answerText.substring(0, 50)}..."`
        : `${params.voterName || 'Someone'} upvoted your answer`,
    });
  }

  notifyHelpfulMark(params: { coins: number }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_helpful_mark',
      title: 'Your answer was marked helpful! 🎉',
      message: `+${params.coins} SmartCoins earned`,
      data: { coins: params.coins },
    });
  }

  notifyMilestone(params: { milestone: string; coins: number }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_milestone',
      title: 'Milestone reached! 🏆',
      message: `${params.milestone} · +${params.coins} SmartCoins`,
      data: { milestone: params.milestone, coins: params.coins },
    });
  }

  notifyLeaderboard(params: { rank: number; message: string }): void {
    useNotificationStore.getState().pushNotification({
      type: 'qa_leaderboard',
      title: `Leaderboard Update 📊`,
      message: `${params.message} (Rank #${params.rank})`,
      data: { rank: params.rank },
    });
  }
}

export const notificationService = NotificationService.getInstance();
