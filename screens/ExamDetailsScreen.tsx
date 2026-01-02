import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { examService } from '@/services/ExamService';
import { Exam } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';

export default function ExamDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ examId?: string }>();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: '',
  });

  useEffect(() => {
    loadExam();
  }, [params.examId]);

  const loadExam = async () => {
    try {
      setLoading(true);
      
      if (params.examId) {
        const examData = await examService.getExamById(params.examId);
        setExam(examData || null);
      } else {
        setExam(null);
      }
    } catch (error) {
      console.error('Failed to load exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddExam = async () => {
    if (!formData.name || !formData.subject || !formData.date) {
      return;
    }

    try {
      const urgencyDaysRemaining = examService.getDaysRemaining(formData.date) || 0;
      
      await examService.addExam({
        name: formData.name,
        subject: formData.subject,
        date: formData.date,
        dateDisplay: new Date(formData.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        color: examService.getUrgencyColor(urgencyDaysRemaining),
        completed: false,
        isPrePopulated: false,
      });

      setShowAddModal(false);
      setFormData({ name: '', subject: '', date: '' });
      router.back();
    } catch (error) {
      console.error('Failed to add exam:', error);
    }
  };

  const handleUpdateExam = async () => {
    if (!exam || !formData.name || !formData.subject || !formData.date) {
      return;
    }

    try {
      await examService.updateExam(exam.id, {
        name: formData.name,
        subject: formData.subject,
        date: formData.date,
        dateDisplay: new Date(formData.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });

      setShowEditModal(false);
      loadExam();
    } catch (error) {
      console.error('Failed to update exam:', error);
    }
  };

  const handleDeleteExam = async () => {
    if (!exam) return;

    try {
      const success = await examService.deleteExam(exam.id);
      if (success) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!exam) return;

    try {
      await examService.markExamCompleted(exam.id);
      loadExam();
    } catch (error) {
      console.error('Failed to mark exam as completed:', error);
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

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show add exam form if no examId provided
  if (!exam && !params.examId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Exam</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Exam Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics Final"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={styles.formLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics"
              placeholderTextColor={colors.textSecondary}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />

            <Text style={styles.formLabel}>Exam Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g., 2025-03-15)"
              placeholderTextColor={colors.textSecondary}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddExam}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Add Exam</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!exam) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exam Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Exam not found</Text>
        </View>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining(exam.date);
  const urgencyColors = getUrgencyColors(exam.color);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exam Details</Text>
        {!exam.isPrePopulated && (
          <TouchableOpacity
            onPress={() => {
              setFormData({
                name: exam.name,
                subject: exam.subject,
                date: exam.date,
              });
              setShowEditModal(true);
            }}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Exam Card */}
        <View style={styles.examCard}>
          <View
            style={[styles.urgencyBanner, { backgroundColor: urgencyColors.bg }]}
          >
            <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
              {daysRemaining <= 0 ? 'Exam Today' : daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days remaining`}
            </Text>
          </View>

          <View style={styles.examContent}>
            <Text style={styles.examName}>{exam.name}</Text>
            <Text style={styles.examSubject}>{exam.subject}</Text>

            <View style={styles.examDetails}>
              <View style={styles.detailItem}>
                <Feather name="calendar" size={20} color={colors.primary} />
                <Text style={styles.detailText}>{exam.dateDisplay}</Text>
              </View>
            </View>

            {exam.completed && (
              <View style={styles.completedBadge}>
                <Feather name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Study Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Study Tips</Text>
          <View style={styles.tipItem}>
            <Feather name="clock" size={16} color={colors.primary} />
            <Text style={styles.tipText}>
              {daysRemaining > 30
                ? 'Start with a study schedule'
                : daysRemaining > 7
                ? 'Focus on weak areas'
                : 'Review and practice mock tests'}
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="target" size={16} color={colors.primary} />
            <Text style={styles.tipText}>
              Use Pomodoro timer for focused study sessions
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="refresh-cw" size={16} color={colors.primary} />
            <Text style={styles.tipText}>
              Take regular breaks to maintain productivity
            </Text>
          </View>
        </View>

        {/* Actions */}
        {!exam.completed && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMarkCompleted}
              activeOpacity={0.8}
            >
              <Feather name="check" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Mark as Completed</Text>
            </TouchableOpacity>

            {!exam.isPrePopulated && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteExam}
                activeOpacity={0.8}
              >
                <Feather name="trash-2" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Delete Exam</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Exam</Text>

            <Text style={styles.formLabel}>Exam Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={styles.formLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />

            <Text style={styles.formLabel}>Exam Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateExam}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: Platform.select({ ios: 50, default: 20 }),
      paddingBottom: Spacing.md,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    backButton: {
      padding: Spacing.sm,
    },
    editButton: {
      padding: Spacing.sm,
    },
    headerSpacer: {
      width: 40,
    },
    loadingText: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.xxl,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    errorText: {
      fontSize: FontSizes.lg,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    examCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      marginBottom: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    urgencyBanner: {
      padding: Spacing.md,
      alignItems: 'center',
    },
    urgencyText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
    },
    examContent: {
      padding: Spacing.xl,
      alignItems: 'center',
    },
    examName: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    examSubject: {
      fontSize: FontSizes.lg,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    examDetails: {
      width: '100%',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.background,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    detailText: {
      fontSize: FontSizes.md,
      color: colors.text,
      flex: 1,
    },
    completedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      backgroundColor: '#E8F5E9',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    completedText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: '#4CAF50',
    },
    tipsCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    tipsTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    tipText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    actionsContainer: {
      gap: Spacing.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
    actionButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
    formCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    formLabel: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.sm,
      marginTop: Spacing.md,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: FontSizes.md,
      color: colors.text,
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
      marginTop: Spacing.xl,
    },
    submitButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.lg,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.xl,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    saveButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
  });
