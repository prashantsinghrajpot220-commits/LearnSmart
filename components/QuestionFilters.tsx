import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { QuestionDifficulty, QuestionStatus } from '@/services/QASearchService';

interface QuestionFiltersProps {
  difficulties?: QuestionDifficulty[];
  status?: QuestionStatus[];
  subject?: string;
  topic?: string;
  subjects?: string[];
  topics?: string[];
  onFiltersChange: (filters: FilterState) => void;
  onClear: () => void;
}

export interface FilterState {
  difficulties: QuestionDifficulty[];
  status: QuestionStatus[];
  subject: string;
  topic: string;
}

const DIFFICULTY_OPTIONS: { value: QuestionDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: Colors.light.success },
  { value: 'medium', label: 'Medium', color: Colors.light.warning },
  { value: 'hard', label: 'Hard', color: Colors.light.error },
];

const STATUS_OPTIONS: { value: QuestionStatus; label: string; icon: string }[] = [
  { value: 'unanswered', label: 'Unanswered', icon: 'chatbubble-outline' },
  { value: 'answered', label: 'Answered', icon: 'checkmark-circle-outline' },
  { value: 'solved', label: 'Solved', icon: 'checkmark-done-outline' },
];

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  difficulties: initialDifficulties = [],
  status: initialStatus = [],
  subject: initialSubject = '',
  topic: initialTopic = '',
  subjects = [],
  topics = [],
  onFiltersChange,
  onClear,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    difficulties: initialDifficulties,
    status: initialStatus,
    subject: initialSubject,
    topic: initialTopic,
  });

  const [expandedSections, setExpandedSections] = useState({
    difficulty: true,
    status: true,
    subject: false,
    topic: false,
  });

  const hasActiveFilters = 
    filters.difficulties.length > 0 ||
    filters.status.length > 0 ||
    filters.subject.length > 0 ||
    filters.topic.length > 0;

  const toggleDifficulty = (difficulty: QuestionDifficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    
    const newFilters = { ...filters, difficulties: newDifficulties };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleStatus = (status: QuestionStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubjectChange = (subject: string) => {
    const newFilters = { ...filters, subject, topic: '' };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTopicChange = (topic: string) => {
    const newFilters = { ...filters, topic };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      difficulties: [],
      status: [],
      subject: '',
      topic: '',
    };
    setFilters(clearedFilters);
    onClear();
  };

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.activeTagsContainer}
        >
          {filters.difficulties.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.filterTag, { borderColor: getDifficultyColor(d) }]}
              onPress={() => toggleDifficulty(d)}
            >
              <Text style={[styles.filterTagText, { color: getDifficultyColor(d) }]}>
                {d}
              </Text>
              <Ionicons name="close" size={12} color={getDifficultyColor(d)} />
            </TouchableOpacity>
          ))}
          {filters.status.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterTag, { borderColor: Colors.light.primary }]}
              onPress={() => toggleStatus(s)}
            >
              <Text style={[styles.filterTagText, { color: Colors.light.primary }]}>
                {s}
              </Text>
              <Ionicons name="close" size={12} color={Colors.light.primary} />
            </TouchableOpacity>
          ))}
          {filters.subject && (
            <TouchableOpacity
              style={[styles.filterTag, { borderColor: Colors.light.primary }]}
              onPress={() => handleSubjectChange('')}
            >
              <Text style={[styles.filterTagText, { color: Colors.light.primary }]}>
                {filters.subject}
              </Text>
              <Ionicons name="close" size={12} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
          {filters.topic && (
            <TouchableOpacity
              style={[styles.filterTag, { borderColor: Colors.light.primary }]}
              onPress={() => handleTopicChange('')}
            >
              <Text style={[styles.filterTagText, { color: Colors.light.primary }]}>
                {filters.topic}
              </Text>
              <Ionicons name="close" size={12} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Difficulty Section */}
      <FilterSection
        title="Difficulty"
        isExpanded={expandedSections.difficulty}
        onToggle={() => toggleSection('difficulty')}
      >
        <View style={styles.chipContainer}>
          {DIFFICULTY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                filters.difficulties.includes(option.value) && {
                  backgroundColor: option.color + '20',
                  borderColor: option.color,
                },
              ]}
              onPress={() => toggleDifficulty(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  filters.difficulties.includes(option.value) && { color: option.color },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FilterSection>

      {/* Status Section */}
      <FilterSection
        title="Status"
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <View style={styles.chipContainer}>
          {STATUS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                filters.status.includes(option.value) && {
                  backgroundColor: Colors.light.primary + '20',
                  borderColor: Colors.light.primary,
                },
              ]}
              onPress={() => toggleStatus(option.value)}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={filters.status.includes(option.value) ? Colors.light.primary : Colors.light.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  filters.status.includes(option.value) && { color: Colors.light.primary },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FilterSection>

      {/* Subject Section */}
      <FilterSection
        title="Subject"
        isExpanded={expandedSections.subject}
        onToggle={() => toggleSection('subject')}
      >
        {subjects.length > 0 ? (
          <View style={styles.chipContainer}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.chip,
                  filters.subject === subject && {
                    backgroundColor: Colors.light.primary + '20',
                    borderColor: Colors.light.primary,
                  },
                ]}
                onPress={() => handleSubjectChange(
                  filters.subject === subject ? '' : subject
                )}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.subject === subject && { color: Colors.light.primary },
                  ]}
                >
                  {subject}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noOptions}>No subjects available</Text>
        )}
      </FilterSection>

      {/* Topic Section (only shown when subject is selected) */}
      {filters.subject && (
        <FilterSection
          title="Topic"
          isExpanded={expandedSections.topic}
          onToggle={() => toggleSection('topic')}
        >
          {topics.length > 0 ? (
            <View style={styles.chipContainer}>
              {topics.map(topic => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.chip,
                    filters.topic === topic && {
                      backgroundColor: Colors.light.primary + '20',
                      borderColor: Colors.light.primary,
                    },
                  ]}
                  onPress={() => handleTopicChange(
                    filters.topic === topic ? '' : topic
                  )}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.topic === topic && { color: Colors.light.primary },
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noOptions}>No topics available for this subject</Text>
          )}
        </FilterSection>
      )}
    </View>
  );
};

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
}) => (
  <View style={styles.section}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={Colors.light.textSecondary}
      />
    </TouchableOpacity>
    {isExpanded && <View style={styles.sectionContent}>{children}</View>}
  </View>
);

const getDifficultyColor = (difficulty: QuestionDifficulty): string => {
  switch (difficulty) {
    case 'easy': return Colors.light.success;
    case 'medium': return Colors.light.warning;
    case 'hard': return Colors.light.error;
    default: return Colors.light.textSecondary;
  }
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
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: Colors.light.error,
    fontWeight: '500',
  },
  activeTagsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    gap: 4,
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  noOptions: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
});

export default QuestionFilters;
