import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { getSubjectsForClass } from '@/constants/curriculum';

export default function Home() {
  const router = useRouter();
  const { userName, selectedClass, logout, loadUserData } = useUserStore();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {displayName}!</Text>
          <View style={styles.classBadge}>
            <Text style={styles.classText}>{selectedClass || 'No Class Selected'}</Text>
          </View>
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
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  classBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm,
    marginBottom: Spacing.xl,
  },
  subjectCard: {
    backgroundColor: Colors.primary,
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
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledCard: {
    backgroundColor: Colors.lightGray,
    opacity: 0.7,
  },
  subjectEmoji: {
    fontSize: FontSizes.xxxl,
    marginBottom: Spacing.sm,
  },
  subjectName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  placeholderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  placeholderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
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
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.text,
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
    color: Colors.white,
  },
  logoutButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
});
