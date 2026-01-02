import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { examService } from '@/services/ExamService';
import { Exam } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';

interface ExamCountdownWidgetProps {
  limit?: number;
  showTitle?: boolean;
}

export default function ExamCountdownWidget({
  limit = 3,
  showTitle = true,
}: ExamCountdownWidgetProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
    
    // Refresh countdown daily
    const interval = setInterval(() => {
      loadExams();
    }, 60000 * 60 * 24); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const loadExams = async () => {
    try {
      await examService.initialize();
      await examService.refreshExamUrgency();
      const upcomingExams = await examService.getUpcomingExams(limit);
      setExams(upcomingExams);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (examDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diffTime = exam.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColors = (color: 'green' | 'yellow' | 'red'): {
    bg: string;
    text: string;
    border: string;
  } => {
    if (color === 'red') {
      return {
        bg: '#FFEBEE',
        text: '#C62828',
        border: '#EF9A9A',
      };
    }
    if (color === 'yellow') {
      return {
        bg: '#FFF8E1',
        text: '#F57C00',
        border: '#FFCC80',
      };
    }
    return {
      bg: '#E8F5E9',
      text: '#2E7D32',
      border: '#A5D6A7',
    };
  };

  const handleExamPress = (exam: Exam) => {
    router.push({
      pathname: '/exam-details',
      params: { examId: exam.id },
    });
  };

  const handleAddExam = () => {
    router.push('/exam-details');
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <Text style={styles.loadingText}>Loading exams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming Exams</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExam}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {exams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyTitle}>No Upcoming Exams</Text>
          <Text style={styles.emptyText}>
            Add your exams to track countdown
          </Text>
          <TouchableOpacity
            style={styles.addExamButton}
            onPress={handleAddExam}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addExamButtonText}>Add Exam</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {exams.map((exam) => {
            const daysRemaining = getDaysRemaining(exam.date);
            const urgencyColors = getUrgencyColors(exam.color);

            return (
              <TouchableOpacity
                key={exam.id}
                style={[
                  styles.examCard,
                  { borderColor: urgencyColors.border },
                ]}
                onPress={() => handleExamPress(exam)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: urgencyColors.bg },
                  ]}
                >
                  <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
                    {daysRemaining <= 0 ? 'Today' : daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days`}
                  </Text>
                </View>

                <View style={styles.examContent}>
                  <Text style={styles.examName} numberOfLines={1}>
                    {exam.name}
                  </Text>
                  <Text style={styles.examSubject}>{exam.subject}</Text>
                </View>

                <View style={styles.examDate}>
                  <Feather name="calendar" size={14} color={colors.textSecondary} />
                  <Text style={styles.examDateText}>{exam.dateDisplay}</Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(0, (daysRemaining / 30) * 100))}%`,
                        backgroundColor: urgencyColors.border,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    addButton: {
      padding: Spacing.sm,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.md,
    },
    loadingText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: Spacing.md,
    },
    scrollContent: {
      gap: Spacing.md,
    },
    examCard: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      minWidth: 180,
      maxWidth: 200,
      borderWidth: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    urgencyBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.sm,
    },
    urgencyText: {
      fontSize: FontSizes.xs,
      fontWeight: FontWeights.bold,
    },
    examContent: {
      marginBottom: Spacing.sm,
    },
    examName: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    examSubject: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
    examDate: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    },
    examDateText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },
    emptyEmoji: {
      fontSize: 48,
      marginBottom: Spacing.md,
    },
    emptyTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    emptyText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    addExamButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      gap: Spacing.xs,
    },
    addExamButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
  });
