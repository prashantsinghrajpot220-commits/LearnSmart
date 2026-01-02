import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exam } from '@/types/productivity';
import { majorExams, getDaysRemaining, getUrgencyColor, sortExamsByDate, getUpcomingExams } from '@/data/majorExams';

const EXAMS_STORAGE_KEY = '@learnsmart_exams';
const REMINDERS_STORAGE_KEY = '@learnsmart_exam_reminders';

interface ExamReminder {
  examId: string;
  daysBefore: number;
  reminderSent: boolean;
}

class ExamService {
  private exams: Exam[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await AsyncStorage.getItem(EXAMS_STORAGE_KEY);
      
      if (data) {
        this.exams = JSON.parse(data);
      } else {
        // Initialize with major exams if first time
        this.exams = [...majorExams];
        await this.saveExams();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize exam service:', error);
      this.exams = [...majorExams];
      this.initialized = true;
    }
  }

  // Exam CRUD operations
  async getAllExams(): Promise<Exam[]> {
    await this.initialize();
    return this.exams;
  }

  async getUpcomingExams(limit: number = 5): Promise<Exam[]> {
    await this.initialize();
    return getUpcomingExams(this.exams, limit);
  }

  async getExamById(examId: string): Promise<Exam | null> {
    await this.initialize();
    return this.exams.find((exam) => exam.id === examId) || null;
  }

  async addExam(exam: Omit<Exam, 'id'>): Promise<Exam> {
    await this.initialize();
    
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      completed: false,
      color: getUrgencyColor(getDaysRemaining(exam.date)),
    };
    
    this.exams.push(newExam);
    await this.saveExams();
    
    return newExam;
  }

  async updateExam(examId: string, updates: Partial<Exam>): Promise<Exam | null> {
    await this.initialize();
    
    const index = this.exams.findIndex((exam) => exam.id === examId);
    if (index === -1) return null;
    
    // Update urgency color if date changed
    if (updates.date) {
      updates.color = getUrgencyColor(getDaysRemaining(updates.date));
    }
    
    this.exams[index] = { ...this.exams[index], ...updates };
    await this.saveExams();
    
    return this.exams[index];
  }

  async deleteExam(examId: string): Promise<boolean> {
    await this.initialize();
    
    const index = this.exams.findIndex((exam) => exam.id === examId);
    if (index === -1) return false;
    
    // Don't allow deleting pre-populated exams, only mark as completed
    if (this.exams[index].isPrePopulated) {
      return false;
    }
    
    this.exams.splice(index, 1);
    await this.saveExams();
    
    return true;
  }

  async markExamCompleted(examId: string): Promise<Exam | null> {
    return this.updateExam(examId, { completed: true });
  }

  async refreshExamUrgency(): Promise<void> {
    await this.initialize();
    
    this.exams = this.exams.map((exam) => {
      if (!exam.completed) {
        return {
          ...exam,
          color: getUrgencyColor(getDaysRemaining(exam.date)),
        };
      }
      return exam;
    });
    
    await this.saveExams();
  }

  // Exam reminders
  async setReminder(examId: string, daysBefore: number): Promise<void> {
    const reminders = await this.getReminders();
    const existingIndex = reminders.findIndex((r) => r.examId === examId && r.daysBefore === daysBefore);
    
    if (existingIndex >= 0) {
      reminders[existingIndex].reminderSent = false;
    } else {
      reminders.push({
        examId,
        daysBefore,
        reminderSent: false,
      });
    }
    
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }

  async removeReminder(examId: string, daysBefore: number): Promise<void> {
    const reminders = await this.getReminders();
    const filtered = reminders.filter((r) => !(r.examId === examId && r.daysBefore === daysBefore));
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filtered));
  }

  async getReminders(): Promise<ExamReminder[]> {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get reminders:', error);
      return [];
    }
  }

  async getExamReminders(examId: string): Promise<ExamReminder[]> {
    const reminders = await this.getReminders();
    return reminders.filter((r) => r.examId === examId);
  }

  // Search and filter
  async searchExams(query: string): Promise<Exam[]> {
    await this.initialize();
    
    const lowerQuery = query.toLowerCase();
    return this.exams.filter((exam) =>
      exam.name.toLowerCase().includes(lowerQuery) ||
      exam.subject.toLowerCase().includes(lowerQuery)
    );
  }

  async getExamsBySubject(subject: string): Promise<Exam[]> {
    await this.initialize();
    return this.exams.filter((exam) => exam.subject.toLowerCase().includes(subject.toLowerCase()));
  }

  async getExamsByUrgency(color: 'green' | 'yellow' | 'red'): Promise<Exam[]> {
    await this.initialize();
    return this.exams.filter((exam) => exam.color === color && !exam.completed);
  }

  // Stats
  async getExamStats(): Promise<{
    total: number;
    upcoming: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    await this.initialize();
    
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingExams = this.exams.filter((exam) => !exam.completed);
    
    return {
      total: upcomingExams.length,
      upcoming: upcomingExams.length,
      thisWeek: upcomingExams.filter((exam) => {
        const examDate = new Date(exam.date);
        return examDate <= weekFromNow;
      }).length,
      thisMonth: upcomingExams.filter((exam) => {
        const examDate = new Date(exam.date);
        return examDate <= monthFromNow;
      }).length,
    };
  }

  // Helper methods
  private async saveExams(): Promise<void> {
    try {
      await AsyncStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(this.exams));
    } catch (error) {
      console.error('Failed to save exams:', error);
    }
  }

  async resetToDefault(): Promise<void> {
    this.exams = [...majorExams];
    await this.saveExams();
  }

  async getDaysRemaining(examId: string): Promise<number | null> {
    const exam = await this.getExamById(examId);
    return exam ? getDaysRemaining(exam.date) : null;
  }

  // Utility methods for formatting
  getUrgencyColor(daysRemaining: number): 'green' | 'yellow' | 'red' {
    return getUrgencyColor(daysRemaining);
  }

  formatDaysRemaining(days: number): string {
    if (days < 0) return 'Exam passed';
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    return `${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} days`;
  }
}

export const examService = new ExamService();
