import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import { qaForumService } from '@/services/QAForumService';
import { Question, Answer } from '@/types/qa';
import { AnswerCard } from '@/components/AnswerCard';
import { useUserStore } from '@/store/userStore';
import { Attachment } from '@/services/FileUploadService';
import { QAPhotoUpload } from '@/components/QAPhotoUpload';

export const QuestionDetailScreen = () => {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userVotes } = useUserStore();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'helpfulness' | 'recency'>('helpfulness');
  
  const [answerText, setAnswerText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const q = await qaForumService.getQuestion(questionId!);
      if (q) {
        setQuestion(q);
        await qaForumService.incrementViewCount(questionId!);
      } else {
        Alert.alert('Error', 'Question not found');
        router.back();
      }
    };
    fetchQuestion();

    if (questionId) {
      const unsubscribe = qaForumService.subscribeToAnswers(questionId, (updatedAnswers) => {
        setAnswers(qaForumService.sortAnswers(updatedAnswers, sortBy));
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [questionId, sortBy, router]);

  const handlePostAnswer = async () => {
    if (!answerText.trim() || !questionId) return;
    setPosting(true);
    try {
      await qaForumService.postAnswer(questionId, answerText, attachment?.uri);
      setAnswerText('');
      setAttachment(null);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setPosting(false);
    }
  };

  const handleVote = async (answerId: string, type: 'upvote' | 'downvote') => {
    if (!questionId) return;
    try {
      await qaForumService.voteAnswer(questionId, answerId, type);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleMarkHelpful = async (answerId: string) => {
    if (!questionId) return;
    try {
      await qaForumService.markHelpful(questionId, answerId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading || !question) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.questionSection}>
      <View style={styles.questionHeader}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty, colors) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(question.difficulty, colors) }]}>
            {question.difficulty.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.subjectText}>{question.subject} • {question.topic}</Text>
      </View>
      
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.description}>{question.description}</Text>
      
      {question.photo && (
        <Image source={{ uri: question.photo }} style={styles.questionImage} resizeMode="contain" />
      )}
      
      <View style={styles.questionFooter}>
        <Text style={styles.footerText}>Asked on {new Date(question.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.footerText}>{question.viewCount} views</Text>
      </View>

      <View style={styles.answersHeader}>
        <Text style={styles.answersTitle}>{answers.length} Answers</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity onPress={() => setSortBy('helpfulness')}>
            <Text style={[styles.sortText, sortBy === 'helpfulness' && styles.sortTextActive]}>Helpful</Text>
          </TouchableOpacity>
          <Text style={styles.sortDivider}>|</Text>
          <TouchableOpacity onPress={() => setSortBy('recency')}>
            <Text style={[styles.sortText, sortBy === 'recency' && styles.sortTextActive]}>Newest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={answers}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <AnswerCard 
            answer={item}
            userVote={userVotes[item.id]}
            onVote={(type) => handleVote(item.id, type)}
            onMarkHelpful={() => handleMarkHelpful(item.id)}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 180 }]}
      />

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <QAPhotoUpload 
          attachment={attachment}
          onAttachment={setAttachment}
          onRemove={() => setAttachment(null)}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Write your answer..."
            value={answerText}
            onChangeText={setAnswerText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, (!answerText.trim() || posting) && styles.sendBtnDisabled]} 
            onPress={handlePostAnswer}
            disabled={!answerText.trim() || posting}
          >
            {posting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const getDifficultyColor = (difficulty: string, colors: any) => {
  switch (difficulty) {
    case 'easy': return colors.success;
    case 'medium': return colors.warning;
    case 'hard': return colors.error;
    default: return colors.textSecondary;
  }
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    backgroundColor: colors.background,
  },
  questionSection: {
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subjectText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  questionImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: isDark ? '#333' : '#f0f0f0',
    marginBottom: 16,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  answersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortTextActive: {
    color: colors.primary,
  },
  sortDivider: {
    color: colors.border,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: isDark ? '#333' : '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 8,
    maxHeight: 100,
    fontSize: 15,
    color: colors.text,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
});
