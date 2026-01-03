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
}

export const notificationService = NotificationService.getInstance();
