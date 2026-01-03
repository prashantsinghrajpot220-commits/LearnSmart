import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '@/types/qa';
import { Colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface QuestionCardProps {
  question: Question;
  onPress: () => void;
  showFavorite?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onPress,
  showFavorite = true,
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useUserStore();
  const favorite = isFavorite(question.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(question.id);
    } else {
      addToFavorites(question.id);
    }
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return Colors.light.success;
      case 'medium': return Colors.light.warning;
      case 'hard': return Colors.light.error;
      default: return Colors.light.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: getDifficultyColor() + '20' }]}>
          <Text style={[styles.badgeText, { color: getDifficultyColor() }]}>
            {question.difficulty.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.subjectText}>{question.subject} • {question.topic}</Text>
        {showFavorite && (
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={favorite ? 'bookmark' : 'bookmark-outline'} 
              size={20} 
              color={favorite ? Colors.light.primary : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={2}>{question.title}</Text>
      
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.statText}>{question.answerCount || 0} answers</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.statText}>{question.viewCount || 0} views</Text>
        </View>
        <Text style={styles.timeText}>{new Date(question.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subjectText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  favoriteBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  timeText: {
    marginLeft: 'auto',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
