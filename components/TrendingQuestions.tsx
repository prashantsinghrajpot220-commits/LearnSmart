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
import { qaSearchService, DiscoverySection } from '@/services/QASearchService';

interface TrendingQuestionsProps {
  onQuestionPress?: (questionId: string) => void;
  maxItems?: number;
}

type SectionKey = keyof DiscoverySection;

const SECTIONS: { key: SectionKey; title: string; icon: string }[] = [
  { key: 'trending', title: 'Trending', icon: 'flame-outline' },
  { key: 'recent', title: 'Recently Asked', icon: 'time-outline' },
  { key: 'popular', title: 'Popular', icon: 'eye-outline' },
  { key: 'helpful', title: 'Most Helpful', icon: 'thumbs-up-outline' },
];

export const TrendingQuestions: React.FC<TrendingQuestionsProps> = ({
  onQuestionPress,
  maxItems = 5,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [discoveryData, setDiscoveryData] = useState<DiscoverySection | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('trending');

  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        const data = await qaSearchService.getDiscoverySections();
        setDiscoveryData(data);
      } catch (error) {
        console.error('Failed to fetch discovery data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscovery();
  }, []);

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

  const renderQuestionItem = ({ item, index }: { item: Question; index: number }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => handleQuestionPress(item.id)}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <View style={styles.questionContent}>
        <Text style={styles.questionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.questionMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.metaText}>{item.answerCount || 0}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.metaText}>{item.viewCount || 0}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  if (!discoveryData) {
    return null;
  }

  const currentQuestions = discoveryData[activeSection];

  return (
    <View style={styles.container}>
      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionTabs}
        contentContainerStyle={styles.sectionTabsContent}
      >
        {SECTIONS.map(section => (
          <TouchableOpacity
            key={section.key}
            style={[
              styles.sectionTab,
              activeSection === section.key && styles.sectionTabActive,
            ]}
            onPress={() => setActiveSection(section.key)}
          >
            <Ionicons
              name={section.icon as any}
              size={18}
              color={activeSection === section.key ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text
              style={[
                styles.sectionTabText,
                activeSection === section.key && styles.sectionTabTextActive,
              ]}
            >
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Questions List */}
      {currentQuestions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={40} color={Colors.light.textSecondary} />
          <Text style={styles.emptyText}>No questions yet</Text>
        </View>
      ) : (
        <FlatList
          data={currentQuestions.slice(0, maxItems)}
          keyExtractor={item => item.id}
          renderItem={renderQuestionItem}
          scrollEnabled={false}
          contentContainerStyle={styles.questionsList}
        />
      )}
    </View>
  );
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return Colors.light.success;
    case 'medium': return Colors.light.warning;
    case 'hard': return Colors.light.error;
    default: return Colors.light.textSecondary;
  }
};

import { ScrollView } from 'react-native';

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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTabs: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    gap: 6,
  },
  sectionTabActive: {
    backgroundColor: Colors.light.primary + '15',
  },
  sectionTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  sectionTabTextActive: {
    color: Colors.light.primary,
  },
  questionsList: {
    padding: 12,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.light.background,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  questionContent: {
    flex: 1,
    marginRight: 8,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});

export default TrendingQuestions;
