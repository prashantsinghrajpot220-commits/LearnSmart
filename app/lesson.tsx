import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import LessonView from '@/components/LessonView';
import { getChapterLessons } from '@/constants/curriculum';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { useSmartyContext } from '@/context/ChatContext';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import QuizModal from '@/components/QuizModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Feather } from '@expo/vector-icons';
import { useXPStore } from '@/store/xpStore';
import { useAchievementStore } from '@/store/achievementStore';
import { coinRewardService } from '@/services/CoinRewardService';
import { streakService } from '@/services/streakService';

interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

export default function Lesson() {
  const { colors } = useTheme();
  const { chapter, subject, class: className, lesson } = useLocalSearchParams<{
    chapter: string;
    subject: string;
    class: string;
    lesson?: string;
  }>();
  const { setCurrentContext } = useSmartyContext();
  const { addXP, incrementLessonsRead } = useXPStore();
  const { checkAndUnlock } = useAchievementStore();

  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);

  const loadLessons = useCallback(() => {
    setLoading(true);
    const allLessons = getChapterLessons(className, subject, chapter);
    setLessons(allLessons);

    if (lesson) {
      const index = allLessons.findIndex((l) => l.title === lesson);
      setCurrentLessonIndex(index >= 0 ? index : 0);
    } else {
      setCurrentLessonIndex(0);
    }
    setLoading(false);
    setHasAwardedXP(false);
  }, [chapter, className, lesson, subject]);

  useEffect(() => {
    if (chapter && subject && className) {
      const timer = setTimeout(() => {
        loadLessons();
        setCurrentContext(subject, chapter, lesson);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [chapter, subject, className, loadLessons, lesson, setCurrentContext]);

  // Award XP when lesson is displayed
  useEffect(() => {
    if (lessons.length > 0 && !hasAwardedXP) {
      const awardRewards = async () => {
        // Award 10 XP for reading a lesson
        await addXP(10);
        incrementLessonsRead();
        
        // Award SmartCoins for lesson completion
        await coinRewardService.rewardLessonCompletion();
        
        // Check and update streak, award streak bonuses
        const streakResult = await streakService.checkAndUpdateStreak();
        if (streakResult.streakChanged && coinRewardService.shouldReceiveStreakBonus(streakResult.streak)) {
          await coinRewardService.rewardStreakMilestone(streakResult.streak);
        }
        
        setHasAwardedXP(true);

        // Check for learning achievements
        const { totalLessonsRead, getXP } = useXPStore.getState();
        checkAndUnlock({
          currentStreak: streakResult.streak,
          totalQuizzesCompleted: 0,
          totalLessonsRead,
          currentXP: getXP(),
          rank: useXPStore.getState().getRank().name,
        });
      };
      awardRewards();
    }
  }, [lessons.length, hasAwardedXP, addXP, incrementLessonsRead, checkAndUnlock]);

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setHasAwardedXP(false); // Reset XP flag for new lesson
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setHasAwardedXP(false); // Reset XP flag for previous lesson
    }
  };

  const handleTestYourself = useCallback(() => {
    setQuizModalVisible(true);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setQuizModalVisible(false);
  }, []);

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (lessons.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{chapter}</Text>
          <Text style={styles.subtitle}>{subject}</Text>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No lesson content available</Text>
          </View>
        </View>
      </View>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <LessonView
          chapter={chapter}
          subject={subject}
          className={className}
          lessonContent={currentLesson}
          currentLessonIndex={currentLessonIndex}
          totalLessons={lessons.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showNavigation={lessons.length > 1}
        />
        
        {/* XP Notification Banner */}
        {hasAwardedXP && (
          <View style={styles.xpBanner}>
            <Feather name="plus-circle" size={16} color="#FFFFFF" />
            <Text style={styles.xpBannerText}>+10 XP earned!</Text>
          </View>
        )}
        
        {/* Test Yourself Button */}
        <View style={styles.testButtonContainer}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestYourself}
            activeOpacity={0.8}
          >
            <View style={styles.testButtonIcon}>
              <Feather name="zap" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.testButtonContent}>
              <Text style={styles.testButtonTitle}>Test Yourself</Text>
              <Text style={styles.testButtonSubtitle}>Take a quick quiz on this chapter</Text>
            </View>
            <Feather name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quiz Modal */}
        <QuizModal
          visible={quizModalVisible}
          onClose={handleCloseQuiz}
          className={className}
          subject={subject}
          chapter={chapter}
        />
      </View>
    </ErrorBoundary>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    marginTop: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ ios: 110, default: 70 }),
    paddingBottom: Spacing.xxl + 80,
  },
  title: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  placeholderContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  xpBanner: {
    position: 'absolute',
    top: Platform.select({ web: 80, default: 100 }),
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    zIndex: 100,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  xpBannerText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginLeft: Spacing.xs,
  },
  testButtonContainer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  testButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  testButtonContent: {
    flex: 1,
  },
  testButtonTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  testButtonSubtitle: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
});
