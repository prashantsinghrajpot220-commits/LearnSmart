import { useUserStore, Badge, ReputationLeaderboardEntry } from '@/store/userStore';
import { qaForumService } from './QAForumService';
import { notificationService } from './NotificationService';
import { StudyGroupService } from './StudyGroupService';
import { Answer } from '@/types/qa';

const BADGE_DEFINITIONS = {
  HELPER: {
    id: 'helper',
    name: 'Helper',
    description: 'Earned after 10 helpful answers',
    icon: '🤝',
    target: 10,
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    description: 'Earned after 50 helpful answers',
    icon: '🧠',
    target: 50,
  },
  COMMUNITY_STAR: {
    id: 'community_star',
    name: 'Community Star',
    description: 'Earned for consistent quality answers (20+ helpful + 4.5+ avg rating)',
    icon: '🌟',
    target: 20,
  },
};

export class ReputationService {
  private static instance: ReputationService;

  static getInstance(): ReputationService {
    if (!ReputationService.instance) {
      ReputationService.instance = new ReputationService();
    }
    return ReputationService.instance;
  }

  async handleNewAnswer() {
    const { updateReputation } = useUserStore.getState();
    await updateReputation(1);
    await this.checkBadges();
  }

  async handleHelpfulMark(answer: Answer) {
    const { userId: currentUserId, updateReputation } = useUserStore.getState();
    
    // In a real app, this would be handled server-side
    if (answer.userId === currentUserId) {
        await updateReputation(5);
        await this.checkBadges();
    }
  }

  async handleUpvote(answer: Answer) {
    const { userId: currentUserId, updateReputation } = useUserStore.getState();
    if (answer.userId === currentUserId) {
        await updateReputation(0.5);
        await this.checkBadges();
    }
  }

  async checkBadges() {
    const { userId, updateAchievementProgress } = useUserStore.getState();
    
    // Get all answers by user across all questions
    const allQuestions = await qaForumService.getQuestions();
    let totalHelpful = 0;
    let ratedAnswersCount = 0;
    let totalRating = 0;
    
    for (const q of allQuestions) {
        const answers = await qaForumService.loadAnswers(q.id);
        const myAnswers = answers.filter((a: Answer) => a.userId === userId);
        for (const a of myAnswers) {
            totalHelpful += a.helpfulCount;
            
            if (a.helpfulCount > 0 || a.upvoteCount > 0) {
                ratedAnswersCount++;
                const rating = a.helpfulCount > 0 ? 5 : Math.min(5, 3 + a.upvoteCount * 0.5);
                totalRating += rating;
            }
        }
    }

    const avgRating = ratedAnswersCount > 0 ? totalRating / ratedAnswersCount : 0;

    // Helper Badge
    await this.processBadge(BADGE_DEFINITIONS.HELPER, totalHelpful);
    
    // Expert Badge
    await this.processBadge(BADGE_DEFINITIONS.EXPERT, totalHelpful);

    // Community Star
    const starCondition = totalHelpful >= 20 && avgRating >= 4.5;
    if (starCondition) {
        await this.processBadge(BADGE_DEFINITIONS.COMMUNITY_STAR, totalHelpful);
    } else {
        // Update progress for Community Star
        await updateAchievementProgress({
            id: BADGE_DEFINITIONS.COMMUNITY_STAR.id,
            name: BADGE_DEFINITIONS.COMMUNITY_STAR.name,
            currentValue: totalHelpful,
            targetValue: 20,
        });
    }

    // Group Leader Badge
    const myGroups = await StudyGroupService.getInstance().getMyGroups();
    const isAdmin = myGroups.some(g => g.adminIds.includes(userId));
    if (isAdmin) {
        await this.processBadge({
            id: 'group_leader',
            name: 'Group Leader',
            description: 'Earned for being an active group organizer',
            icon: '📣',
            target: 1,
        }, 1);
    }
  }

  private async processBadge(definition: { id: string; name: string; description: string; icon: string; target: number }, currentCount: number) {
    const { addBadge, updateAchievementProgress, gamificationData } = useUserStore.getState();
    
    const isUnlocked = gamificationData.badges.some(b => b.id === definition.id);
    
    if (currentCount >= definition.target && !isUnlocked) {
        const newBadge: Badge = {
            id: definition.id,
            name: definition.name,
            description: definition.description,
            icon: definition.icon,
            unlockedAt: new Date().toISOString(),
        };
        await addBadge(newBadge);
        notificationService.notifyBadgeUnlocked(newBadge);
    }

    await updateAchievementProgress({
        id: definition.id,
        name: definition.name,
        currentValue: Math.min(currentCount, definition.target),
        targetValue: definition.target,
    });
  }

  generateMockLeaderboard(period: 'all-time' | 'monthly' | 'weekly'): ReputationLeaderboardEntry[] {
    const { userId, userName, selectedAvatar, gamificationData } = useUserStore.getState();
    
    const entries: ReputationLeaderboardEntry[] = [];
    
    // Add current user
    entries.push({
        userId,
        userName: userName || 'You',
        avatar: selectedAvatar,
        reputation: gamificationData.reputation,
        badgeCount: gamificationData.badges.length,
        helpfulAnswers: gamificationData.achievementProgress.find(p => p.id === 'helper')?.currentValue || 0,
        rank: 0,
    });

    // Mock other users
    const mockNames = [
        'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson', 'David Kim',
        'Lisa Park', 'James Brown', 'Maria Garcia', 'John Smith', 'Anna Davis',
        'Ryan Miller', 'Sophie Turner', 'Kevin Lee', 'Rachel Green', 'Daniel White',
        'Olivia Black', 'Ethan Clark', 'Grace Hall', 'Noah Adams', 'Zoe Scott'
    ];

    for (let i = 0; i < 19; i++) {
        const name = mockNames[i];
        const avatars = ['Robot', 'Owl', 'BookCharacter', 'BrainCharacter', 'StarCharacter', 'Dragon', 'Wizard'];
        const avatar = avatars[i % avatars.length];
        
        let repMulti = 1;
        if (period === 'monthly') repMulti = 0.4;
        if (period === 'weekly') repMulti = 0.1;

        entries.push({
            userId: `mock_user_rep_${i}`,
            userName: name,
            avatar,
            reputation: Math.floor((Math.random() * 500 + 50) * repMulti),
            badgeCount: Math.floor(Math.random() * 5),
            helpfulAnswers: Math.floor(Math.random() * 30),
            rank: 0,
        });
    }

    entries.sort((a, b) => {
        if (b.reputation !== a.reputation) return b.reputation - a.reputation;
        return b.badgeCount - a.badgeCount;
    });

    entries.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return entries;
  }
}

export const reputationService = ReputationService.getInstance();
