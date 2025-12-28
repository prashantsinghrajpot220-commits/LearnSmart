import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Home Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to LearnSmart!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Phase 1 Complete</Text>
          <Text style={styles.cardText}>
            Foundation & Aesthetic Setup is complete. Ready for Phase 2 expansion.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ What's Working</Text>
          <Text style={styles.cardText}>• Welcome Slider with Lottie animations</Text>
          <Text style={styles.cardText}>• Sage Green / Warm Sand color palette</Text>
          <Text style={styles.cardText}>• Responsive design (iOS, Android, Web)</Text>
          <Text style={styles.cardText}>• Navigation with expo-router</Text>
          <Text style={styles.cardText}>• TypeScript throughout</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚀 Coming in Phase 2</Text>
          <Text style={styles.cardText}>• AI Study Buddy</Text>
          <Text style={styles.cardText}>• Curriculum & Courses</Text>
          <Text style={styles.cardText}>• Quizzes & Flashcards</Text>
          <Text style={styles.cardText}>• Gamification & Progress Tracking</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
