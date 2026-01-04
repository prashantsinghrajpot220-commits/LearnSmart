import { useUserStore } from '@/store/userStore';
import { coinRewardService } from './CoinRewardService';

export interface QuizChallenge {
  id: string;
  challengerId: string;
  challengedId: string;
  challengerName: string;
  challengedName: string;
  subject: string;
  quizId: string;
  status: 'pending' | 'accepted' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
  challengerScore?: number;
  challengedScore?: number;
  winner?: 'challenger' | 'challenged' | 'tie';
  reward: number; // SmartCoins reward for winner
}

export interface ChallengeStats {
  totalChallenges: number;
  wins: number;
  losses: number;
  ties: number;
  winRate: number;
  totalEarnings: number;
}

export class ChallengeService {
  private static instance: ChallengeService;
  private challenges: QuizChallenge[] = [];

  static getInstance(): ChallengeService {
    if (!ChallengeService.instance) {
      ChallengeService.instance = new ChallengeService();
    }
    return ChallengeService.instance;
  }

  // Create a new challenge
  async createChallenge(challengedUserId: string, subject: string, quizId: string): Promise<string> {
    const { userId, userName } = useUserStore.getState();
    
    const challenge: QuizChallenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      challengerId: userId,
      challengedId: challengedUserId,
      challengerName: userName || 'Anonymous',
      challengedName: 'Friend', // In real app, fetch from user data
      subject,
      quizId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      reward: 25, // Winner gets 25 SmartCoins
    };

    this.challenges.push(challenge);
    
    // In real app, send notification to challenged user
    return challenge.id;
  }

  // Accept a challenge
  async acceptChallenge(challengeId: string): Promise<boolean> {
    const challengeIndex = this.challenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) return false;

    const challenge = this.challenges[challengeIndex];
    if (challenge.status !== 'pending') return false;

    challenge.status = 'accepted';
    return true;
  }

  // Submit quiz results for a challenge
  async submitChallengeResults(
    challengeId: string, 
    userScore: number, 
    isChallenger: boolean
  ): Promise<{ winner: 'challenger' | 'challenged' | 'tie'; reward: number }> {
    const challengeIndex = this.challenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) throw new Error('Challenge not found');

    const challenge = this.challenges[challengeIndex];
    
    if (isChallenger) {
      challenge.challengerScore = userScore;
    } else {
      challenge.challengedScore = userScore;
    }

    // Check if both scores are submitted
    if (challenge.challengerScore !== undefined && challenge.challengedScore !== undefined) {
      // Determine winner
      if (challenge.challengerScore > challenge.challengedScore) {
        challenge.winner = 'challenger';
      } else if (challenge.challengedScore > challenge.challengerScore) {
        challenge.winner = 'challenged';
      } else {
        challenge.winner = 'tie';
      }

      challenge.status = 'completed';
      challenge.completedAt = new Date().toISOString();

      // Award SmartCoins to winner
      if (challenge.winner !== 'tie') {
        const winnerId = challenge.winner === 'challenger' ? challenge.challengerId : challenge.challengedId;
        const currentUser = useUserStore.getState();
        
        if (currentUser.userId === winnerId) {
          await coinRewardService.awardCoins({
            amount: challenge.reward,
            reason: `Won ${challenge.subject} quiz challenge!`,
            type: 'bonus',
          });
        }
      }
    }

    return {
      winner: challenge.winner || 'tie',
      reward: challenge.reward,
    };
  }

  // Get pending challenges for current user
  getPendingChallenges(): QuizChallenge[] {
    const { userId } = useUserStore.getState();
    return this.challenges.filter(
      challenge => 
        challenge.challengedId === userId && 
        challenge.status === 'pending'
    );
  }

  // Get user's active challenges
  getUserChallenges(): QuizChallenge[] {
    const { userId } = useUserStore.getState();
    return this.challenges.filter(
      challenge => 
        challenge.challengerId === userId || 
        challenge.challengedId === userId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get challenge statistics
  getChallengeStats(): ChallengeStats {
    const userChallenges = this.getUserChallenges();
    const completedChallenges = userChallenges.filter(c => c.status === 'completed');
    
    const wins = completedChallenges.filter(c => {
      const isChallenger = c.challengerId === useUserStore.getState().userId;
      return (isChallenger && c.winner === 'challenger') || (!isChallenger && c.winner === 'challenged');
    }).length;

    const losses = completedChallenges.filter(c => {
      const isChallenger = c.challengerId === useUserStore.getState().userId;
      return (isChallenger && c.winner === 'challenged') || (!isChallenger && c.winner === 'challenger');
    }).length;

    const ties = completedChallenges.filter(c => c.winner === 'tie').length;

    const totalEarnings = completedChallenges
      .filter(c => {
        const isChallenger = c.challengerId === useUserStore.getState().userId;
        return (isChallenger && c.winner === 'challenger') || (!isChallenger && c.winner === 'challenged');
      })
      .reduce((total, c) => total + c.reward, 0);

    return {
      totalChallenges: userChallenges.length,
      wins,
      losses,
      ties,
      winRate: completedChallenges.length > 0 ? (wins / completedChallenges.length) * 100 : 0,
      totalEarnings,
    };
  }

  // Expire old pending challenges
  async expireOldChallenges(): Promise<void> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.challenges.forEach(challenge => {
      if (challenge.status === 'pending') {
        const createdAt = new Date(challenge.createdAt);
        if (createdAt < oneDayAgo) {
          challenge.status = 'expired';
        }
      }
    });
  }

  // Get challenge by ID
  getChallengeById(challengeId: string): QuizChallenge | undefined {
    return this.challenges.find(c => c.id === challengeId);
  }

  // Generate mock challenge for demo
  createMockChallenge(): string {
    const { userId, userName } = useUserStore.getState();
    
    const mockChallenge: QuizChallenge = {
      id: `mock_${Date.now()}`,
      challengerId: 'mock_user_1',
      challengedId: userId,
      challengerName: 'Alex Chen',
      challengedName: userName || 'You',
      subject: 'Mathematics',
      quizId: 'math_quiz_1',
      status: 'pending',
      createdAt: new Date().toISOString(),
      reward: 25,
    };

    this.challenges.push(mockChallenge);
    return mockChallenge.id;
  }

  // Clear all challenges (for testing)
  clearChallenges(): void {
    this.challenges = [];
  }
}

export const challengeService = ChallengeService.getInstance();