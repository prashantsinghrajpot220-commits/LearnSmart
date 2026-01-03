import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '@/store/userStore';
import { Question, Answer, VoteType, QuestionDifficulty } from '@/types/qa';
import { notificationService } from './NotificationService';
import { reputationService } from './ReputationService';
import { gamificationService } from './GamificationService';

const STORAGE_KEYS = {
  QUESTIONS: '@learnsmart/qa_questions',
  ANSWERS: (questionId: string) => `@learnsmart/qa_answers:${questionId}`,
};

type Listener<T> = (payload: T) => void;

function randomId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class QAForumService {
  private static instance: QAForumService;
  private questionsCache: Question[] | null = null;
  private answersCache = new Map<string, Answer[]>();
  
  private questionsListeners = new Set<Listener<Question[]>>();
  private answersListeners = new Map<string, Set<Listener<Answer[]>>>();

  static getInstance(): QAForumService {
    if (!QAForumService.instance) {
      QAForumService.instance = new QAForumService();
    }
    return QAForumService.instance;
  }

  // Question Methods
  private async ensureQuestionsLoaded(): Promise<Question[]> {
    if (this.questionsCache) return this.questionsCache;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
      this.questionsCache = raw ? JSON.parse(raw) : [];
    } catch {
      this.questionsCache = [];
    }
    return this.questionsCache!;
  }

  private async persistQuestions(questions: Question[]) {
    this.questionsCache = questions;
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    this.questionsListeners.forEach(l => l(questions));
  }

  subscribeToQuestions(listener: Listener<Question[]>): () => void {
    this.questionsListeners.add(listener);
    this.ensureQuestionsLoaded().then(l => listener(l));
    return () => this.questionsListeners.delete(listener);
  }

  async getQuestions(): Promise<Question[]> {
    return this.ensureQuestionsLoaded();
  }

  async createQuestion(params: {
    title: string;
    description: string;
    subject: string;
    topic: string;
    difficulty: QuestionDifficulty;
    photo?: string;
  }): Promise<Question> {
    const { userId, addUserQuestion } = useUserStore.getState();
    const questions = await this.ensureQuestionsLoaded();
    const newQuestion: Question = {
      id: randomId('q'),
      userId,
      ...params,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answerCount: 0,
      viewCount: 0,
    };
    await this.persistQuestions([newQuestion, ...questions]);
    await addUserQuestion(newQuestion.id);
    return newQuestion;
  }

  async getQuestion(id: string): Promise<Question | null> {
    const questions = await this.ensureQuestionsLoaded();
    return questions.find(q => q.id === id) || null;
  }
  
  async incrementViewCount(questionId: string) {
      const questions = await this.ensureQuestionsLoaded();
      const idx = questions.findIndex(q => q.id === questionId);
      if (idx !== -1) {
          questions[idx] = { ...questions[idx], viewCount: (questions[idx].viewCount || 0) + 1 };
          await this.persistQuestions([...questions]);
      }
  }

  // Answer Methods
  async loadAnswers(questionId: string): Promise<Answer[]> {
    if (this.answersCache.has(questionId)) return this.answersCache.get(questionId)!;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.ANSWERS(questionId));
      const answers = raw ? JSON.parse(raw) : [];
      this.answersCache.set(questionId, answers);
      return answers;
    } catch {
      return [];
    }
  }

  private async persistAnswers(questionId: string, answers: Answer[]) {
    this.answersCache.set(questionId, answers);
    await AsyncStorage.setItem(STORAGE_KEYS.ANSWERS(questionId), JSON.stringify(answers));
    this.answersListeners.get(questionId)?.forEach(l => l(answers));
    
    // Update question answer count
    const questions = await this.ensureQuestionsLoaded();
    const qIdx = questions.findIndex(q => q.id === questionId);
    if (qIdx !== -1) {
        questions[qIdx].answerCount = answers.length;
        await this.persistQuestions([...questions]);
    }
  }

  subscribeToAnswers(questionId: string, listener: Listener<Answer[]>): () => void {
    if (!this.answersListeners.has(questionId)) {
      this.answersListeners.set(questionId, new Set());
    }
    this.answersListeners.get(questionId)!.add(listener);
    this.loadAnswers(questionId).then(l => listener(l));
    return () => this.answersListeners.get(questionId)?.delete(listener);
  }

  async postAnswer(questionId: string, text: string, photo?: string): Promise<Answer> {
    const { userId, userName, addUserAnswer, notificationPreferences } = useUserStore.getState();
    const answers = await this.loadAnswers(questionId);
    const newAnswer: Answer = {
      id: randomId('a'),
      questionId,
      userId,
      text,
      photo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvoteCount: 0,
      downvoteCount: 0,
      helpfulCount: 0,
    };
    await this.persistAnswers(questionId, [...answers, newAnswer]);
    await addUserAnswer(newAnswer.id);
    await reputationService.handleNewAnswer();

    // Award coins for posting answer
    await gamificationService.awardForAnswerPosted();

    // Check answer count milestones
    await gamificationService.checkAnswerCountMilestones();

    // Notify question owner
    const question = await this.getQuestion(questionId);
    if (question && question.userId !== userId) {
        if (notificationPreferences.answers) {
            notificationService.notifyNewAnswer({
                questionId,
                questionTitle: question.title,
                answererName: userName || 'A student',
            });
        }
    }

    return newAnswer;
  }

  async voteAnswer(questionId: string, answerId: string, voteType: VoteType): Promise<void> {
    const { userId: currentUserId, userVotes, addUserVote, notificationPreferences, userName } = useUserStore.getState();
    const answers = await this.loadAnswers(questionId);
    const answerIdx = answers.findIndex(a => a.id === answerId);
    if (answerIdx === -1) return;

    const previousVote = userVotes[answerId];
    if (previousVote === voteType) return; // Already voted same way

    const answer = { ...answers[answerIdx] };

    // Remove previous vote
    if (previousVote === 'upvote') answer.upvoteCount = Math.max(0, answer.upvoteCount - 1);
    if (previousVote === 'downvote') answer.downvoteCount = Math.max(0, answer.downvoteCount - 1);

    // Add new vote
    if (voteType === 'upvote') {
        answer.upvoteCount++;
        await reputationService.handleUpvote(answer);

        // Send notification to answer owner
        if (answer.userId !== currentUserId && notificationPreferences.upvotes) {
            notificationService.notifyUpvote({
                voterName: userName || 'Someone',
                answerText: answer.text,
            });
        }
    }
    if (voteType === 'downvote') answer.downvoteCount++;

    answers[answerIdx] = answer;
    await this.persistAnswers(questionId, [...answers]);
    await addUserVote(answerId, voteType);
  }

  async markHelpful(questionId: string, answerId: string): Promise<void> {
      const answers = await this.loadAnswers(questionId);
      const answerIdx = answers.findIndex(a => a.id === answerId);
      if (answerIdx === -1) return;
      
      const answer = { ...answers[answerIdx] };
      answer.helpfulCount++;
      answers[answerIdx] = answer;
      await this.persistAnswers(questionId, [...answers]);
      await reputationService.handleHelpfulMark(answer);
  }
  
  sortAnswers(answers: Answer[], sortBy: 'helpfulness' | 'recency'): Answer[] {
      if (sortBy === 'helpfulness') {
          return [...answers].sort((a, b) => {
              const scoreA = (a.upvoteCount || 0) - (a.downvoteCount || 0) + (a.helpfulCount || 0) * 2;
              const scoreB = (b.upvoteCount || 0) - (b.downvoteCount || 0) + (b.helpfulCount || 0) * 2;
              if (scoreB !== scoreA) return scoreB - scoreA;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
      } else {
          return [...answers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
  }
}

export const qaForumService = QAForumService.getInstance();
