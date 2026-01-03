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
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { QuestionCard } from '@/components/QuestionCard';
import { QAPhotoUpload } from '@/components/QAPhotoUpload';
import { SearchBar } from '@/components/SearchBar';
import { QuestionFilters, FilterState } from '@/components/QuestionFilters';
import { TrendingQuestions } from '@/components/TrendingQuestions';
import { FavoriteQuestions } from '@/components/FavoriteQuestions';
import { qaForumService } from '@/services/QAForumService';
import { qaSearchService, SearchResult } from '@/services/QASearchService';
import { Question, QuestionDifficulty } from '@/types/qa';
import { Attachment } from '@/services/FileUploadService';

type ViewMode = 'all' | 'favorites' | 'search';

export const QAForumScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Main data
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [displayQuestions, setDisplayQuestions] = useState<Question[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    difficulties: [],
    status: [],
    subject: '',
    topic: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  // const [showTrending, setShowTrending] = useState(true); // Future feature: toggle trending section
  
  // Post modal
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubjectInput] = useState('');
  const [topic, setTopicInput] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [posting, setPosting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Load initial data
  useEffect(() => {
    loadQuestions();
    loadSubjects();
  }, []);

  // Update display when filters change
  useEffect(() => {
    if (viewMode === 'all') {
      const applyFiltersAsync = async () => {
        setSearching(true);
        try {
          const result = await qaSearchService.search({
            keyword: searchQuery,
            filters: {
              difficulties: filters.difficulties,
              status: filters.status,
            },
            subject: filters.subject || undefined,
            topic: filters.topic || undefined,
            page: 1,
            limit: 20,
          });
          setSearchResult(result);
          setDisplayQuestions(result.questions);
          setCurrentPage(1);
          setHasMore(result.hasMore);
        } catch (error) {
          console.error('Failed to apply filters:', error);
        } finally {
          setSearching(false);
        }
      };
      applyFiltersAsync();
    }
  }, [filters, searchQuery, viewMode]);

  // Load subjects for filter dropdown
  const loadSubjects = async () => {
    try {
      const loadedSubjects = await qaSearchService.getAllSubjects();
      setSubjects(loadedSubjects);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  // Load topics when subject changes
  useEffect(() => {
    const loadTopics = async () => {
      if (filters.subject) {
        try {
          const loadedTopics = await qaSearchService.getTopicsForSubject(filters.subject);
          setTopics(loadedTopics);
        } catch (error) {
          console.error('Failed to load topics:', error);
        }
      } else {
        setTopics([]);
      }
    };
    loadTopics();
  }, [filters.subject]);

  const loadQuestions = async () => {
    try {
      const questions = await qaForumService.getQuestions();
      setAllQuestions(questions);
      setDisplayQuestions(questions.slice(0, 20));
      setHasMore(questions.length > 20);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (searchPage: number = 1) => {
    setSearching(true);
    try {
      const result = await qaSearchService.search({
        keyword: searchQuery,
        filters: {
          difficulties: filters.difficulties,
          status: filters.status,
        },
        subject: filters.subject || undefined,
        topic: filters.topic || undefined,
        page: searchPage,
        limit: 20,
      });
      setSearchResult(result);
      if (searchPage === 1) {
        setDisplayQuestions(result.questions);
        setCurrentPage(1);
      } else {
        setDisplayQuestions(prev => [...prev, ...result.questions]);
      }
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to search:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    if (viewMode !== 'search') {
      setViewMode('search');
    }
    await performSearch(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({
      difficulties: [],
      status: [],
      subject: '',
      topic: '',
    });
    setViewMode('all');
    setDisplayQuestions(allQuestions.slice(0, 20));
    setSearchResult(null);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      difficulties: [],
      status: [],
      subject: '',
      topic: '',
    });
  };

  const loadMoreQuestions = async () => {
    if (!hasMore || searching) return;
    await performSearch(currentPage + 1);
    setCurrentPage(prev => prev + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadQuestions();
      await loadSubjects();
      if (viewMode === 'search') {
        await performSearch(1);
      }
    } finally {
      setRefreshing(false);
    }
  };

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
      await loadSubjects();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubjectInput('');
    setTopicInput('');
    setDifficulty('medium');
    setAttachment(null);
  };

  const handleQuestionPress = (questionId: string) => {
    router.push({
      pathname: '/question-detail',
      params: { questionId },
    });
  };

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <QuestionCard 
      question={item} 
      onPress={() => handleQuestionPress(item.id)} 
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMoreQuestions}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={Colors.light.textSecondary} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Results Found' : 'No Questions Yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `No questions match "${searchQuery}"`
          : 'Be the first to ask a question!'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.askBtn} 
          onPress={() => setIsPostModalVisible(true)}
        >
          <Text style={styles.askBtnText}>Ask a Question</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onSuggestions={() => {}}
        />
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="options-outline" size={18} color={Colors.light.primary} />
        <Text style={styles.filterToggleText}>Filters</Text>
        <Ionicons 
          name={showFilters ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color={Colors.light.textSecondary} 
        />
      </TouchableOpacity>

      {/* Filters */}
      {showFilters && (
        <QuestionFilters
          difficulties={filters.difficulties}
          status={filters.status}
          subject={filters.subject}
          topic={filters.topic}
          subjects={subjects}
          topics={topics}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />
      )}

      {/* View Mode Tabs */}
      <View style={styles.viewModeTabs}>
        <TouchableOpacity
          style={[styles.viewModeTab, viewMode === 'all' && styles.viewModeTabActive]}
          onPress={() => {
            setViewMode('all');
            setDisplayQuestions(allQuestions.slice(0, 20));
            setSearchResult(null);
          }}
        >
          <Text style={[styles.viewModeTabText, viewMode === 'all' && styles.viewModeTabTextActive]}>
            All Questions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeTab, viewMode === 'search' && styles.viewModeTabActive]}
          onPress={handleSearch}
        >
          <Text style={[styles.viewModeTabText, viewMode === 'search' && styles.viewModeTabTextActive]}>
            Search Results
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeTab, viewMode === 'favorites' && styles.viewModeTabActive]}
          onPress={() => setViewMode('favorites')}
        >
          <Ionicons 
            name="bookmark-outline" 
            size={16} 
            color={viewMode === 'favorites' ? Colors.light.primary : Colors.light.textSecondary} 
          />
          <Text style={[styles.viewModeTabText, viewMode === 'favorites' && styles.viewModeTabTextActive]}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      {searchResult && (
        <View style={styles.resultsCount}>
          <Text style={styles.resultsCountText}>
            {searchResult.totalCount} result{searchResult.totalCount !== 1 ? 's' : ''} found
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Trending Section (only in 'all' mode) */}
      {viewMode === 'all' && (
        <TrendingQuestions
          onQuestionPress={handleQuestionPress}
          maxItems={5}
        />
      )}

      {/* Favorites Section */}
      {viewMode === 'favorites' ? (
        <FavoriteQuestions
          onQuestionPress={handleQuestionPress}
          onEmpty={() => setViewMode('all')}
        />
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={displayQuestions}
          keyExtractor={(item) => item.id}
          renderItem={renderQuestionItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreQuestions}
          onEndReachedThreshold={0.5}
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
                  onChangeText={setSubjectInput}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Topic</Text>
                <TextInput
                  style={styles.smallInput}
                  placeholder="e.g. Algebra"
                  value={topic}
                  onChangeText={setTopicInput}
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  viewModeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  viewModeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 6,
  },
  viewModeTabActive: {
    backgroundColor: Colors.light.primary + '15',
    borderColor: Colors.light.primary,
  },
  viewModeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  viewModeTabTextActive: {
    color: Colors.light.primary,
  },
  resultsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCountText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  clearSearchText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  askBtn: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  askBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreBtn: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
