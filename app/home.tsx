import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { getSubjectsForClass } from '@/constants/curriculum';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { useSmartyContext } from '@/context/ChatContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import ProgressBar from '@/components/ProgressBar';
import StreakBadge from '@/components/StreakBadge';
import { streakService } from '@/services/streakService';
import { useXPStore } from '@/store/xpStore';
import { useAchievementStore } from '@/store/achievementStore';
import { Feather } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const { userName, selectedClass, ageGroup, logout, loadUserData } = useUserStore();
  const { colors } = useTheme();
  const { setCurrentContext } = useSmartyContext();
  const { loadXP } = useXPStore();
  const { loadAchievements } = useAchievementStore();
  const [streak, setStreak] = useState(0);
  const opacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    loadUserData();
    loadXP();
    loadAchievements();
    setCurrentContext(undefined, undefined, undefined);

    // Load streak
    const loadStreak = async () => {
      const currentStreak = await streakService.getStreak();
      setStreak(currentStreak);
    };
    loadStreak();

    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [loadUserData, setCurrentContext, loadXP, loadAchievements, opacity]);

  useEffect(() => {
    if (ageGroup === '12plus') {
      router.replace('/home-12plus');
    }
  }, [ageGroup, router]);

  const subjects = selectedClass ? getSubjectsForClass(selectedClass) : [];
  const classNum = selectedClass ? parseInt(selectedClass.replace('Class ', '')) : 0;

  const handleSubjectPress = (subject: string) => {
    if (subject.includes('Coming Soon')) {
      return;
    }
    router.push({
      pathname: '/chapters',
      params: { subject, class: selectedClass },
    });
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const displayName = userName || 'Student';

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.content, { opacity }]}> 
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Welcome, {displayName}!</Text>
            <DarkModeToggle />
          </View>
          <View style={styles.classBadge}>
            <Text style={styles.classText}>{selectedClass || 'No Class Selected'}</Text>
          </View>
        </View>

        {/* Gamification Section */}
        <View style={styles.gamificationSection}>
          <View style={styles.gamificationRow}>
            <View style={styles.progressBarContainer}>
              <ProgressBar showText={true} />
            </View>
            <View style={styles.streakContainer}>
              <StreakBadge streak={streak} showDetails={false} />
            </View>
          </View>
          
          {/* Trophy Room Link */}
          <TouchableOpacity
            style={styles.trophyButton}
            onPress={() => router.push('/trophy-room')}
            activeOpacity={0.8}
          >
            <View style={styles.trophyIcon}>
              <Feather name="award" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.trophyButtonText}>View Achievements</Text>
            <Feather name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {selectedClass ? (
          <>
            <Text style={styles.sectionTitle}>Your Subjects</Text>
            
            <View style={styles.subjectsGrid}>
              {subjects.map((subject, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.subjectCard,
                    subject.includes('Coming Soon') && styles.disabledCard,
                  ]}
                  onPress={() => handleSubjectPress(subject)}
                  activeOpacity={subject.includes('Coming Soon') ? 1 : 0.7}
                  disabled={subject.includes('Coming Soon')}
                >
                  <Text style={styles.subjectEmoji}>{getSubjectEmoji(subject)}</Text>
                  <Text style={styles.subjectName}>{subject}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {classNum >= 11 && (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderTitle}>🚧 Coming Soon</Text>
                <Text style={styles.placeholderText}>
                  {classNum >= 1 && classNum <= 12
                    ? 'Stream selection and specialized subjects for Classes 11-12 coming in Phase 2B'
                    : 'Pathways and specialized courses coming in Phase 2B'}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>No Class Selected</Text>
            <Text style={styles.emptyText}>
              Please create an account or sign in to select your class
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace('/auth')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Go to Auth</Text>
            </TouchableOpacity>
          </View>
        )}

        {userName && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </ScrollView>
  );
}

function getSubjectEmoji(subject: string): string {
  const emojis: Record<string, string> = {
    English: '📖',
    Hindi: '🔤',
    Maths: '🔢',
    Mathematics: '🔢',
    Science: '🔬',
    'Social Science': '🌍',
    EVS: '🌱',
    'Competitive Exams': '🎯',
    'Skill Building': '🛠️',
  };
  return emojis[subject] || '📚';
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: colors.text,
    flex: 1,
  },
  classBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
  gamificationSection: {
    marginBottom: Spacing.xl,
  },
  gamificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  streakContainer: {
    width: 100,
  },
  trophyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  trophyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  trophyButtonText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.lg,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm,
    marginBottom: Spacing.xl,
  },
  subjectCard: {
    backgroundColor: colors.primary,
    flexBasis: Platform.select({
      web: '31%',
      default: '46%',
    }),
    margin: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledCard: {
    backgroundColor: colors.lightGray,
    opacity: 0.7,
  },
  subjectEmoji: {
    fontSize: FontSizes.xxxl,
    marginBottom: Spacing.sm,
  },
  subjectName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  placeholderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
  logoutButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.textSecondary,
  },
});
