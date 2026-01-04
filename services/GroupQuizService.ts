import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QuizQuestion } from '@/types/quiz';
import { useUserStore } from '@/store/userStore';
import { generateQuizQuestions } from '@/services/quizGenerator';
import { ContentValidator } from '@/services/ContentValidator';
import { coinRewardService } from '@/services/CoinRewardService';
import { notificationService } from '@/services/NotificationService';
import { studyGroupService, type StudyGroup } from '@/services/StudyGroupService';
import type { AgeGroup as ContentAgeGroup } from '@/types/content';

export interface GroupQuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

export interface GroupQuiz {
  id: string;
  groupId: string;
  createdBy: string;
  quizId: string;
  className: string;
  subject: string;
  chapter: string;
  questions: QuizQuestion[];
  createdAt: string;
  deadline: string;
  reward: number;
  results: Record<string, GroupQuizResult>;
  rewardedToUserIds: string[];
}

type Listener<T> = (payload: T) => void;

const STORAGE_KEY = (groupId: string) => `@learnsmart/study_group_quizzes:${groupId}`;
const MAX_QUIZZES = 50;

function randomId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function enrichQuestions(params: { groupQuizId: string; chapter: string; questions: Array<{ id: string; question: string; options: string[]; correctAnswer: number; explanation: string }> }): QuizQuestion[] {
  return params.questions.map((q, index) => {
    const difficulty = index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard';

    return {
      id: `${params.groupQuizId}:${q.id}:${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty,
      topic: params.chapter,
      generatedAt: Date.now(),
    };
  });
}

export class GroupQuizService {
  private static instance: GroupQuizService;

  private cache = new Map<string, GroupQuiz[]>();
  private listeners = new Map<string, Set<Listener<GroupQuiz[]>>>();

  static getInstance(): GroupQuizService {
    if (!GroupQuizService.instance) {
      GroupQuizService.instance = new GroupQuizService();
    }
    return GroupQuizService.instance;
  }

  private async load(groupId: string): Promise<GroupQuiz[]> {
    const cached = this.cache.get(groupId);
    if (cached) return cached;

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY(groupId));
      const quizzes = raw ? (JSON.parse(raw) as GroupQuiz[]) : [];
      this.cache.set(groupId, quizzes);
      return quizzes;
    } catch (error) {
                  // Error handled silently
      this.cache.set(groupId, []);
      return [];
    }
  }

  private async persist(groupId: string, quizzes: GroupQuiz[]): Promise<void> {
    this.cache.set(groupId, quizzes);

    try {
      await AsyncStorage.setItem(STORAGE_KEY(groupId), JSON.stringify(quizzes));
    } catch (error) {
                  // Error handled silently
    }

    this.listeners.get(groupId)?.forEach((cb) => cb(quizzes));
  }

  subscribe(groupId: string, listener: Listener<GroupQuiz[]>): () => void {
    const setForGroup = this.listeners.get(groupId) ?? new Set<Listener<GroupQuiz[]>>();
    setForGroup.add(listener);
    this.listeners.set(groupId, setForGroup);

    void this.load(groupId).then((q) => listener(q));

    return () => {
      const setNow = this.listeners.get(groupId);
      setNow?.delete(listener);
      if (setNow && setNow.size === 0) this.listeners.delete(groupId);
    };
  }

  async getGroupQuizzes(groupId: string): Promise<GroupQuiz[]> {
    const quizzes = await this.load(groupId);
    return quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createGroupQuiz(params: {
    groupId: string;
    className: string;
    subject: string;
    chapter: string;
    deadline: string;
    reward: number;
  }): Promise<GroupQuiz> {
    const { userId } = useUserStore.getState();
    const group = await studyGroupService.getGroup(params.groupId);
    if (!group) throw new Error('Group not found');
    if (!group.adminIds.includes(userId)) throw new Error('Admin permission required');

    const createdAt = new Date().toISOString();
    const groupQuizId = randomId('group_quiz');

    const rawQuestions = await generateQuizQuestions(params.className, params.subject, params.chapter);
    const safeQuestions = await ContentValidator.validateQuizQuestions(rawQuestions, {
      contentId: `group_quiz:${groupQuizId}:${params.groupId}`,
      ageGroup: (useUserStore.getState().ageGroup ?? 'under12') as ContentAgeGroup,
      source: 'GroupQuizService',
    });

    const questions = enrichQuestions({ groupQuizId, chapter: params.chapter, questions: safeQuestions });

    const quiz: GroupQuiz = {
      id: groupQuizId,
      groupId: params.groupId,
      createdBy: userId,
      quizId: `quiz_ref_${groupQuizId}`,
      className: params.className,
      subject: params.subject,
      chapter: params.chapter,
      questions,
      createdAt,
      deadline: params.deadline,
      reward: params.reward,
      results: {},
      rewardedToUserIds: [],
    };

    const current = await this.load(params.groupId);
    const next = [quiz, ...current].slice(0, MAX_QUIZZES);
    await this.persist(params.groupId, next);

    notificationService.notifyGroupQuizCreated({
      groupId: params.groupId,
      groupName: group.name,
      quizTitle: `${params.subject}: ${params.chapter}`,
      reward: params.reward,
    });

    return quiz;
  }

  async submitGroupQuizResult(params: {
    groupId: string;
    groupQuizId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  }): Promise<GroupQuiz> {
    const { userId, recordGroupQuizHistory } = useUserStore.getState();

    const group = await studyGroupService.getGroup(params.groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) throw new Error('You are not a member of this group');

    const quizzes = await this.load(params.groupId);
    const idx = quizzes.findIndex((q) => q.id === params.groupQuizId);
    if (idx === -1) throw new Error('Group quiz not found');

    const quiz = quizzes[idx];

    const completedAt = new Date().toISOString();
    const updated: GroupQuiz = {
      ...quiz,
      results: {
        ...quiz.results,
        [userId]: {
          score: params.score,
          correctAnswers: params.correctAnswers,
          totalQuestions: params.totalQuestions,
          completedAt,
        },
      },
    };

    const next = [...quizzes];
    next[idx] = updated;

    const afterReward = await this.maybeRewardWinners(group, updated, next);
    await this.persist(params.groupId, afterReward);

    await recordGroupQuizHistory({
      groupId: params.groupId,
      groupQuizId: params.groupQuizId,
      score: params.score,
      completedAt,
    });

    return afterReward.find((q) => q.id === params.groupQuizId) as GroupQuiz;
  }

  private async maybeRewardWinners(group: StudyGroup, quiz: GroupQuiz, quizzes: GroupQuiz[]): Promise<GroupQuiz[]> {
    const now = Date.now();
    const deadlineMs = new Date(quiz.deadline).getTime();
    const allSubmitted = Object.keys(quiz.results).length >= group.members.length;
    const deadlinePassed = Number.isFinite(deadlineMs) ? now >= deadlineMs : false;

    if (!allSubmitted && !deadlinePassed) return quizzes;

    const entries = Object.entries(quiz.results);
    if (entries.length === 0) return quizzes;

    const maxScore = Math.max(...entries.map(([, r]) => r.score));
    const winners = entries.filter(([, r]) => r.score === maxScore).map(([userId]) => userId);

    const alreadyRewarded = new Set(quiz.rewardedToUserIds);
    const toReward = winners.filter((w) => !alreadyRewarded.has(w));
    if (toReward.length === 0) return quizzes;

    const currentUserId = useUserStore.getState().userId;

    for (const winnerId of toReward) {
      if (winnerId === currentUserId) {
        await coinRewardService.awardCoins({
          amount: quiz.reward,
          reason: `Won the group quiz in ${group.name}!`,
          type: 'bonus',
        });
      }
    }

    const updatedQuiz: GroupQuiz = {
      ...quiz,
      rewardedToUserIds: [...quiz.rewardedToUserIds, ...toReward],
    };

    const next = quizzes.map((q) => (q.id === quiz.id ? updatedQuiz : q));

    const winnerNames = toReward
      .map((id) => group.memberProfiles[id]?.userName ?? id)
      .join(', ');

    notificationService.notifyGroupQuizResult({
      groupId: group.id,
      groupName: group.name,
      resultText: `Quiz completed. Winner${toReward.length > 1 ? 's' : ''}: ${winnerNames} (${maxScore}%).`,
    });

    return next;
  }
}

export const groupQuizService = GroupQuizService.getInstance();
