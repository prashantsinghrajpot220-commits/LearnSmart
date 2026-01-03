import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { QuestionCard } from '@/components/QuestionCard';
import { QAPhotoUpload } from '@/components/QAPhotoUpload';
import { qaForumService } from '@/services/QAForumService';
import { Question, QuestionDifficulty } from '@/types/qa';
import { Attachment } from '@/services/FileUploadService';

export const QAForumScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  
  // New Question State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const unsubscribe = qaForumService.subscribeToQuestions((updatedQuestions) => {
      setQuestions(updatedQuestions);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateQuestion = async () => {
    if (!title || !description || !subject || !topic) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setPosting(true);
    try {
      await qaForumService.createQuestion({
        title,
        description,
        subject,
        topic,
        difficulty,
        photo: attachment?.uri,
      });
      setIsPostModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setTopic('');
    setDifficulty('medium');
    setAttachment(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Q&A Forum</Text>
        <TouchableOpacity 
          style={styles.postBtn}
          onPress={() => setIsPostModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.postBtnText}>Ask</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : questions.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={64} color={Colors.light.textSecondary} />
          <Text style={styles.emptyText}>No questions yet. Be the first to ask!</Text>
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuestionCard 
              question={item} 
              onPress={() => router.push({
                pathname: '/question-detail',
                params: { questionId: item.id }
              })} 
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Post Question Modal */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ask a Question</Text>
            <TouchableOpacity onPress={handleCreateQuestion} disabled={posting}>
              <Text style={[styles.submitText, posting && { opacity: 0.5 }]}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Question Title (e.g. How to solve quadratic equations?)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe your question in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.smallInput}
                  placeholder="e.g. Math"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Topic</Text>
                <TextInput
                  style={styles.smallInput}
                  placeholder="e.g. Algebra"
                  value={topic}
                  onChangeText={setTopic}
                />
              </View>
            </View>

            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.difficultyRow}>
              {(['easy', 'medium', 'hard'] as QuestionDifficulty[]).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.difficultyBtn,
                    difficulty === d && styles.difficultyBtnActive,
                    difficulty === d && { borderColor: d === 'easy' ? Colors.light.success : d === 'medium' ? Colors.light.warning : Colors.light.error }
                  ]}
                  onPress={() => setDifficulty(d)}
                >
                  <Text style={[
                    styles.difficultyBtnText,
                    difficulty === d && { color: d === 'easy' ? Colors.light.success : d === 'medium' ? Colors.light.warning : Colors.light.error }
                  ]}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Attachment (Optional)</Text>
            <QAPhotoUpload 
              attachment={attachment} 
              onAttachment={setAttachment} 
              onRemove={() => setAttachment(null)} 
            />
            
            {posting && <ActivityIndicator style={{ marginTop: 20 }} color={Colors.light.primary} />}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  postBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  descriptionInput: {
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 120,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  difficultyBtnActive: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
  },
  difficultyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
