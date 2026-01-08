import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, QuestionDifficulty } from '@/types/qa';

export type { QuestionDifficulty } from '@/types/qa';
export type QuestionStatus = 'unanswered' | 'answered' | 'solved';

export interface SearchFilters {
  difficulties?: QuestionDifficulty[];
  status?: QuestionStatus[];
  subject?: string;
  topic?: string;
}

export interface SearchOptions {
  keyword?: string;
  subject?: string;
  topic?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  questions: Question[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DiscoverySection {
  trending: Question[];
  recent: Question[];
  popular: Question[];
  helpful: Question[];
}

const STORAGE_KEYS = {
  QUESTIONS: '@learnsmart/qa_questions',
  FAVORITES: '@learnsmart/qa_favorites',
  SEARCH_HISTORY: '@learnsmart/search_history',
};

export class QASearchService {
  private static instance: QASearchService;
  private questionsCache: Question[] | null = null;

  private constructor() {}

  static getInstance(): QASearchService {
    if (!QASearchService.instance) {
      QASearchService.instance = new QASearchService();
    }
    return QASearchService.instance;
  }

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

  async search(options: SearchOptions): Promise<SearchResult> {
    const questions = await this.ensureQuestionsLoaded();
    const { keyword = '', subject, topic, filters, page = 1, limit = 20 } = options;

    let filtered = [...questions];

    // Keyword search (title and description)
    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(q => {
        const titleMatch = q.title.toLowerCase().includes(lowerKeyword);
        const descMatch = q.description.toLowerCase().includes(lowerKeyword);
        return titleMatch || descMatch;
      });

      // Sort by relevance: title matches first
      filtered.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(lowerKeyword) ? 1 : 0;
        const bTitleMatch = b.title.toLowerCase().includes(lowerKeyword) ? 1 : 0;
        if (bTitleMatch !== aTitleMatch) return bTitleMatch - aTitleMatch;
        return 0;
      });
    }

    // Subject filter
    if (subject && subject.trim()) {
      filtered = filtered.filter(q => 
        q.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    // Topic filter
    if (topic && topic.trim()) {
      filtered = filtered.filter(q => 
        q.topic.toLowerCase() === topic.toLowerCase()
      );
    }

    // Apply difficulty filters
    if (filters?.difficulties && filters.difficulties.length > 0) {
      filtered = filtered.filter(q => 
        filters.difficulties!.includes(q.difficulty)
      );
    }

    // Apply status filter
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(q => {
        const isUnanswered = q.answerCount === 0;
        const isAnswered = q.answerCount > 0;
        const isSolved = false; // Would need solved flag in Question type

        if (filters.status!.includes('unanswered') && isUnanswered) return true;
        if (filters.status!.includes('answered') && isAnswered) return true;
        if (filters.status!.includes('solved') && isSolved) return true;
        return false;
      });
    }

    // Sort by newest first by default
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedQuestions = filtered.slice(startIndex, startIndex + limit);

    return {
      questions: paginatedQuestions,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  async getSuggestions(keyword: string): Promise<string[]> {
    if (!keyword.trim() || keyword.length < 2) return [];

    const questions = await this.ensureQuestionsLoaded();
    const lowerKeyword = keyword.toLowerCase();

    // Collect matching keywords from titles
    const suggestions = new Set<string>();
    
    questions.forEach(q => {
      if (q.title.toLowerCase().includes(lowerKeyword)) {
        // Extract words from matching titles
        const words = q.title.split(/\s+/);
        words.forEach(word => {
          if (word.toLowerCase().includes(lowerKeyword) && word.length > 2) {
            suggestions.add(word.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
      }
    });

    // Add matching subjects
    const subjects = [...new Set(questions.map(q => q.subject))];
    subjects.forEach(subject => {
      if (subject.toLowerCase().includes(lowerKeyword)) {
        suggestions.add(subject);
      }
    });

    // Add matching topics
    const topics = [...new Set(questions.map(q => q.topic))];
    topics.forEach(topic => {
      if (topic.toLowerCase().includes(lowerKeyword)) {
        suggestions.add(topic);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }

  async getDiscoverySections(): Promise<DiscoverySection> {
    const questions = await this.ensureQuestionsLoaded();

    // Trending: Sort by (viewCount + answerCount) DESC
    const trending = [...questions]
      .sort((a, b) => {
        const scoreA = (a.viewCount || 0) + (a.answerCount || 0);
        const scoreB = (b.viewCount || 0) + (b.answerCount || 0);
        return scoreB - scoreA;
      })
      .slice(0, 10);

    // Recent: Sort by createdAt DESC
    const recent = [...questions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Popular: Sort by viewCount DESC
    const popular = [...questions]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10);

    // Helpful: Sort by answerCount DESC (proxy for helpful since we don't track helpful marks on questions)
    const helpful = [...questions]
      .sort((a, b) => (b.answerCount || 0) - (a.answerCount || 0))
      .slice(0, 10);

    return { trending, recent, popular, helpful };
  }

  async getAllSubjects(): Promise<string[]> {
    const questions = await this.ensureQuestionsLoaded();
    return [...new Set(questions.map(q => q.subject))].sort();
  }

  async getTopicsForSubject(subject: string): Promise<string[]> {
    const questions = await this.ensureQuestionsLoaded();
    return [...new Set(
      questions
        .filter(q => q.subject.toLowerCase() === subject.toLowerCase())
        .map(q => q.topic)
    )].sort();
  }

  async browseQuestions(page: number = 1, limit: number = 20): Promise<SearchResult> {
    return this.search({ page, limit });
  }
}

export const qaSearchService = QASearchService.getInstance();
