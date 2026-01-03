import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Question } from '@/types/qa';
import { QuestionCard } from './QuestionCard';
import { useUserStore } from '@/store/userStore';
import { qaForumService } from '@/services/QAForumService';

interface FavoriteQuestionsProps {
  onQuestionPress?: (questionId: string) => void;
  onEmpty?: () => void;
}

export const FavoriteQuestions: React.FC<FavoriteQuestionsProps> = ({
  onQuestionPress,
  onEmpty,
}) => {
  const router = useRouter();
  const { favoriteQuestions, removeFromFavorites } = useUserStore();
  const [favorites, setFavorites] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const questions = await qaForumService.getQuestions();
        const favoriteQuestionsList = questions.filter(q => 
          favoriteQuestions.includes(q.id)
        );
        setFavorites(favoriteQuestionsList);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [favoriteQuestions]);

  const handleQuestionPress = (questionId: string) => {
    if (onQuestionPress) {
      onQuestionPress(questionId);
    } else {
      router.push({
        pathname: '/question-detail',
        params: { questionId },
      });
    }
  };

  const handleRemoveFavorite = async (questionId: string) => {
    try {
      await removeFromFavorites(questionId);
      setFavorites(prev => prev.filter(q => q.id !== questionId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const renderQuestionCard = ({ item }: { item: Question }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="bookmark" size={20} color={Colors.light.primary} />
      </TouchableOpacity>
      <QuestionCard
        question={item}
        onPress={() => handleQuestionPress(item.id)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={48} color={Colors.light.textSecondary} />
        <Text style={styles.emptyTitle}>No Saved Questions</Text>
        <Text style={styles.emptySubtitle}>
          Bookmark questions you want to revisit later
        </Text>
        {onEmpty && (
          <TouchableOpacity style={styles.browseButton} onPress={onEmpty}>
            <Text style={styles.browseButtonText}>Browse Questions</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Questions</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{favorites.length}</Text>
        </View>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderQuestionCard}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          favorites.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Tap the bookmark to remove from favorites
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  countBadge: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  cardWrapper: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
  },
  listContent: {
    padding: 12,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default FavoriteQuestions;
