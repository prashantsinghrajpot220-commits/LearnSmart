import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PerformanceMetrics,
  TopicPerformance,
  WeeklyReport,
  ComparisonData,
  PerformanceChartData,
} from '@/types/analytics';
import { mistakeAnalysisService } from './MistakeAnalysisService';

const ANALYTICS_STORAGE_KEY = 'learnsmart_analytics';

interface AnalyticsData {
  totalStudyTime: number;
  lastUpdated: number;
  weeklyReports: WeeklyReport[];
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private analyticsData: AnalyticsData = {
    totalStudyTime: 0,
    lastUpdated: Date.now(),
    weeklyReports: [],
  };

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (data) {
        this.analyticsData = JSON.parse(data);
      }
    } catch (error) {
                  // Error handled silently
    }
  }

  async trackStudyTime(minutes: number): Promise<void> {
    this.analyticsData.totalStudyTime += minutes;
    await this.saveAnalytics();
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    const now = Date.now();
    const weekStart = now - 7 * 24 * 60 * 60 * 1000;

    const quizResults = mistakeAnalysisService['quizResultsCache'].filter(
      (r) => r.timestamp >= weekStart && r.timestamp <= now
    );

    const totalQuizzes = quizResults.length;
    const totalQuestions = quizResults.reduce(
      (sum, r) => sum + r.totalQuestions,
      0
    );
    const correctAnswers = quizResults.reduce(
      (sum, r) => sum + Math.round((r.score / 100) * r.totalQuestions),
      0
    );

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Identify improvement and strong areas
    const topicAccuracy = new Map<string, { correct: number; total: number }>();

    quizResults.forEach((result) => {
      const key = result.topic;
      if (!topicAccuracy.has(key)) {
        topicAccuracy.set(key, { correct: 0, total: 0 });
      }
      const correctCount = Math.round((result.score / 100) * result.totalQuestions);
      topicAccuracy.get(key)!.correct += correctCount;
      topicAccuracy.get(key)!.total += result.totalQuestions;
    });

    const areas: { topic: string; accuracy: number }[] = [];
    topicAccuracy.forEach((perf, topic) => {
      if (perf.total >= 3) {
        areas.push({
          topic,
          accuracy: (perf.correct / perf.total) * 100,
        });
      }
    });

    areas.sort((a, b) => a.accuracy - b.accuracy);

    const improvementAreas = areas
      .filter((a) => a.accuracy < 60)
      .slice(0, 3)
      .map((a) => a.topic);

    const strongAreas = areas
      .filter((a) => a.accuracy >= 70)
      .slice(-3)
      .reverse()
      .map((a) => a.topic);

    const report: WeeklyReport = {
      weekStart,
      weekEnd: now,
      quizzesTaken: totalQuizzes,
      lessonsRead: 0, // Would come from lesson tracking
      accuracy: Math.round(accuracy),
      xpGained: 0, // Would come from XP store
      coinsEarned: 0, // Would come from coin service
      timeSpent: 0, // Would come from time tracking
      improvementAreas,
      strongAreas,
    };

    // Update weekly reports cache
    this.analyticsData.weeklyReports.push(report);
    
    // Keep only last 12 weeks
    if (this.analyticsData.weeklyReports.length > 12) {
      this.analyticsData.weeklyReports = this.analyticsData.weeklyReports.slice(-12);
    }

    await this.saveAnalytics();

    return report;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const quizResults = mistakeAnalysisService['quizResultsCache'];

    const quizzesTaken = quizResults.length;
    const totalQuestions = quizResults.reduce(
      (sum, r) => sum + r.totalQuestions,
      0
    );
    const correctAnswers = quizResults.reduce(
      (sum, r) => sum + Math.round((r.score / 100) * r.totalQuestions),
      0
    );

    const overallAccuracy = totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 100
      : 0;

    const averageScore = quizzesTaken > 0
      ? quizResults.reduce((sum, r) => sum + r.score, 0) / quizzesTaken
      : 0;

    const totalTimeSpent = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTimePerQuestion = totalQuestions > 0
      ? totalTimeSpent / totalQuestions
      : 0;

    return {
      overallAccuracy: Math.round(overallAccuracy),
      quizzesTaken,
      totalQuestionsAttempted: totalQuestions,
      correctAnswers,
      averageScore: Math.round(averageScore),
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      currentStreak: 0, // Would come from streak service
      longestStreak: 0, // Would come from streak service
      totalStudyTime: this.analyticsData.totalStudyTime,
    };
  }

  getTopicPerformance(): TopicPerformance[] {
    const quizResults = mistakeAnalysisService['quizResultsCache'];

    const topicStats = new Map<
      string,
      {
        correct: number;
        total: number;
        time: number;
        attempts: number[];
        subject: string;
        chapter: string;
      }
    >();

    quizResults.forEach((result) => {
      const key = `${result.subject}-${result.chapter}-${result.topic}`;
      if (!topicStats.has(key)) {
        topicStats.set(key, {
          correct: 0,
          total: 0,
          time: 0,
          attempts: [],
          subject: result.subject,
          chapter: result.chapter,
        });
      }
      const stats = topicStats.get(key)!;
      const correctCount = Math.round((result.score / 100) * result.totalQuestions);
      stats.correct += correctCount;
      stats.total += result.totalQuestions;
      stats.time += result.timeSpent;
      stats.attempts.push(result.score);
    });

    const performances: TopicPerformance[] = [];

    topicStats.forEach((stats, key) => {
      const [subject, chapter, topic] = key.split('-');
      const accuracy = (stats.correct / stats.total) * 100;
      const averageTime = stats.total > 0 ? stats.time / stats.total : 0;
      const lastAttempt = quizResults
        .filter((r) => r.topic === topic)
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp || Date.now();

      // Calculate improvement rate
      let improvementRate = 0;
      if (stats.attempts.length >= 2) {
        const firstHalf = stats.attempts.slice(0, Math.floor(stats.attempts.length / 2));
        const secondHalf = stats.attempts.slice(Math.floor(stats.attempts.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        improvementRate = ((secondAvg - firstAvg) / firstAvg) * 100;
      }

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (improvementRate > 5) {
        trend = 'up';
      } else if (improvementRate < -5) {
        trend = 'down';
      }

      performances.push({
        topic,
        subject,
        chapter,
        accuracy: Math.round(accuracy),
        questionsAttempted: stats.total,
        averageTime: Math.round(averageTime),
        improvementRate: Math.round(improvementRate),
        lastAttemptedAt: lastAttempt,
        trend,
      });
    });

    return performances.sort((a, b) => a.accuracy - b.accuracy);
  }

  getPerformanceChartData(): PerformanceChartData {
    const weeklyReports = this.analyticsData.weeklyReports.slice(-8); // Last 8 weeks

    return {
      labels: weeklyReports.map((_, i) => `Week ${i + 1}`),
      accuracyData: weeklyReports.map((r) => r.accuracy),
      timeData: weeklyReports.map((r) => r.timeSpent),
      difficultyProgression: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
  }

  getComparisonData(userAccuracy: number): ComparisonData {
    // In a real implementation, this would compare against actual grade-level data
    const gradeLevelAverage = 65; // Simulated average
    const percentile = Math.min(99, Math.max(1, Math.round((userAccuracy / gradeLevelAverage) * 50)));
    const rankInClass = Math.floor(Math.random() * 30) + 1;
    const totalStudents = 50;

    return {
      userAccuracy: Math.round(userAccuracy),
      gradeLevelAverage,
      percentile,
      rankInClass,
      totalStudents,
    };
  }

  async getWeeklyReports(count: number = 4): Promise<WeeklyReport[]> {
    return this.analyticsData.weeklyReports.slice(-count);
  }

  private async saveAnalytics(): Promise<void> {
    try {
      this.analyticsData.lastUpdated = Date.now();
      await AsyncStorage.setItem(
        ANALYTICS_STORAGE_KEY,
        JSON.stringify(this.analyticsData)
      );
    } catch (error) {
                  // Error handled silently
    }
  }

  async clearAnalytics(): Promise<void> {
    this.analyticsData = {
      totalStudyTime: 0,
      lastUpdated: Date.now(),
      weeklyReports: [],
    };
    await this.saveAnalytics();
  }

  getInsights(): string[] {
    const metrics = this.getPerformanceMetrics();
    const insights: string[] = [];

    if (metrics.overallAccuracy >= 80) {
      insights.push('Excellent performance! You\'re mastering the material.');
    } else if (metrics.overallAccuracy >= 60) {
      insights.push('Good progress! Keep practicing to improve accuracy.');
    } else {
      insights.push('Focus on weak areas to boost your accuracy.');
    }

    if (metrics.quizzesTaken >= 10) {
      insights.push(`You've completed ${metrics.quizzesTaken} quizzes. Great consistency!`);
    }

    if (metrics.averageTimePerQuestion > 60) {
      insights.push('Try to improve your speed by practicing more.');
    }

    return insights;
  }
}

export const analyticsService = AnalyticsService.getInstance();
