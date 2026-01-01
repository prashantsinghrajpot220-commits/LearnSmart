import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MistakeRecord,
  WeakArea,
  PersonalizedStudyPlan,
  QuizResult,
} from '@/types/quiz';

const MISTAKES_STORAGE_KEY = 'learnsmart_mistakes';
const QUIZ_RESULTS_STORAGE_KEY = 'learnsmart_quiz_results';

export class MistakeAnalysisService {
  private static instance: MistakeAnalysisService;
  private mistakesCache: MistakeRecord[] = [];
  private quizResultsCache: QuizResult[] = [];

  private constructor() {}

  public static getInstance(): MistakeAnalysisService {
    if (!MistakeAnalysisService.instance) {
      MistakeAnalysisService.instance = new MistakeAnalysisService();
    }
    return MistakeAnalysisService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const [mistakesData, resultsData] = await Promise.all([
        AsyncStorage.getItem(MISTAKES_STORAGE_KEY),
        AsyncStorage.getItem(QUIZ_RESULTS_STORAGE_KEY),
      ]);

      this.mistakesCache = mistakesData ? JSON.parse(mistakesData) : [];
      this.quizResultsCache = resultsData ? JSON.parse(resultsData) : [];
    } catch (error) {
      console.error('Failed to initialize MistakeAnalysisService:', error);
      this.mistakesCache = [];
      this.quizResultsCache = [];
    }
  }

  async recordMistake(mistake: MistakeRecord): Promise<void> {
    try {
      this.mistakesCache.push(mistake);
      await AsyncStorage.setItem(
        MISTAKES_STORAGE_KEY,
        JSON.stringify(this.mistakesCache)
      );
    } catch (error) {
      console.error('Failed to record mistake:', error);
    }
  }

  async recordQuizResult(result: QuizResult): Promise<void> {
    try {
      this.quizResultsCache.push(result);
      await AsyncStorage.setItem(
        QUIZ_RESULTS_STORAGE_KEY,
        JSON.stringify(this.quizResultsCache)
      );
    } catch (error) {
      console.error('Failed to record quiz result:', error);
    }
  }

  getMistakes(): MistakeRecord[] {
    return [...this.mistakesCache];
  }

  getMistakesByTopic(topic: string): MistakeRecord[] {
    return this.mistakesCache.filter((m) => m.topic === topic);
  }

  getMistakesByChapter(chapter: string, subject: string): MistakeRecord[] {
    return this.mistakesCache.filter(
      (m) => m.chapter === chapter && m.subject === subject
    );
  }

  async identifyWeakAreas(): Promise<WeakArea[]> {
    const topicPerformance = new Map<
      string,
      {
        correct: number;
        total: number;
        subject: string;
        chapter: string;
        attempts: MistakeRecord[];
      }
    >();

    // Aggregate performance by topic
    this.quizResultsCache.forEach((result) => {
      const key = `${result.subject}-${result.chapter}-${result.topic}`;
      if (!topicPerformance.has(key)) {
        topicPerformance.set(key, {
          correct: 0,
          total: 0,
          subject: result.subject,
          chapter: result.chapter,
          attempts: [],
        });
      }
      const perf = topicPerformance.get(key)!;
      const correctCount = Math.round((result.score / 100) * result.totalQuestions);
      perf.correct += correctCount;
      perf.total += result.totalQuestions;
    });

    // Add mistakes data
    this.mistakesCache.forEach((mistake) => {
      const key = `${mistake.subject}-${mistake.chapter}-${mistake.topic}`;
      if (!topicPerformance.has(key)) {
        topicPerformance.set(key, {
          correct: 0,
          total: 0,
          subject: mistake.subject,
          chapter: mistake.chapter,
          attempts: [],
        });
      }
      topicPerformance.get(key)!.attempts.push(mistake);
    });

    // Calculate weak areas (accuracy < 60% and at least 3 attempts)
    const weakAreas: WeakArea[] = [];
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    topicPerformance.forEach((perf, key) => {
      if (perf.total < 3) return; // Need at least 3 attempts

      const accuracy = (perf.correct / perf.total) * 100;
      if (accuracy < 60) {
        const [subject, chapter, topic] = key.split('-');

        // Calculate trend
        const recentAttempts = perf.attempts.filter(
          (a) => a.timestamp >= thirtyDaysAgo
        );
        const olderAttempts = perf.attempts.filter(
          (a) => a.timestamp < thirtyDaysAgo
        );

        let trend: 'improving' | 'declining' | 'stable' = 'stable';
        if (recentAttempts.length > 0 && olderAttempts.length > 0) {
          const recentAccuracy = recentAttempts.length > 0
            ? (recentAttempts.filter(a => a.correctAnswer !== a.userAnswer).length / recentAttempts.length) * 100
            : 0;
          const olderAccuracy = olderAttempts.length > 0
            ? (olderAttempts.filter(a => a.correctAnswer !== a.userAnswer).length / olderAttempts.length) * 100
            : 0;
          
          if (recentAccuracy < olderAccuracy) {
            trend = 'improving';
          } else if (recentAccuracy > olderAccuracy) {
            trend = 'declining';
          }
        }

        weakAreas.push({
          topic,
          subject,
          chapter,
          accuracy,
          totalAttempts: perf.total,
          mistakes: perf.attempts.length,
          trend,
          recommendedLessons: this.generateRecommendedLessons(topic, subject, chapter),
        });
      }
    });

    // Sort by accuracy (weakest first)
    return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
  }

  async generatePersonalizedStudyPlan(): Promise<PersonalizedStudyPlan> {
    const weakAreas = await this.identifyWeakAreas();
    const priorityTopics = weakAreas
      .filter((area) => area.accuracy < 50)
      .map((area) => area.topic);

    const suggestedSchedule: PersonalizedStudyPlan['suggestedSchedule'] = [];
    let dayCount = 0;

    weakAreas.forEach((area) => {
      const daysNeeded = Math.ceil((60 - area.accuracy) / 10); // More days for weaker areas
      for (let i = 0; i < daysNeeded; i++) {
        suggestedSchedule.push({
          day: ++dayCount,
          topic: area.topic,
          subject: area.subject,
          activities: [
            `Review lesson on ${area.topic}`,
            `Practice questions on ${area.topic}`,
            area.recommendedLessons.length > 0
              ? `Study: ${area.recommendedLessons[0]}`
              : 'Revise concepts',
          ],
          estimatedTime: 45, // minutes
        });
      }
    });

    return {
      weakAreas,
      priorityTopics,
      suggestedSchedule,
      estimatedCompletionDays: dayCount,
    };
  }

  private generateRecommendedLessons(topic: string, subject: string, chapter: string): string[] {
    // In a real implementation, this would query the content database
    // For now, return generic recommendations
    return [
      `Introduction to ${topic}`,
      `Key concepts of ${topic}`,
      `Practice problems for ${topic}`,
    ];
  }

  getImprovementTrend(topic: string): { improvement: number; trend: 'up' | 'down' | 'stable' } {
    const topicMistakes = this.getMistakesByTopic(topic);
    if (topicMistakes.length < 2) {
      return { improvement: 0, trend: 'stable' };
    }

    const recentMistakes = topicMistakes.slice(-5);
    const olderMistakes = topicMistakes.slice(0, Math.max(0, topicMistakes.length - 5));

    const recentMistakeRate = recentMistakes.length;
    const olderMistakeRate = olderMistakes.length / Math.max(1, Math.floor(olderMistakes.length / 5));

    const improvement = ((olderMistakeRate - recentMistakeRate) / olderMistakeRate) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (improvement > 10) {
      trend = 'up';
    } else if (improvement < -10) {
      trend = 'down';
    }

    return { improvement: Math.round(improvement), trend };
  }

  async clearOldMistakes(daysToKeep: number = 90): Promise<void> {
    try {
      const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
      this.mistakesCache = this.mistakesCache.filter(
        (m) => m.timestamp >= cutoffTime
      );
      await AsyncStorage.setItem(
        MISTAKES_STORAGE_KEY,
        JSON.stringify(this.mistakesCache)
      );
    } catch (error) {
      console.error('Failed to clear old mistakes:', error);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      this.mistakesCache = [];
      this.quizResultsCache = [];
      await Promise.all([
        AsyncStorage.removeItem(MISTAKES_STORAGE_KEY),
        AsyncStorage.removeItem(QUIZ_RESULTS_STORAGE_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  getStatistics() {
    const totalMistakes = this.mistakesCache.length;
    const uniqueTopics = new Set(this.mistakesCache.map((m) => m.topic)).size;
    const recentMistakes = this.mistakesCache.filter(
      (m) => m.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      totalMistakes,
      uniqueTopics,
      recentMistakes,
      averageMistakesPerTopic: totalMistakes / Math.max(1, uniqueTopics),
    };
  }
}

export const mistakeAnalysisService = MistakeAnalysisService.getInstance();
