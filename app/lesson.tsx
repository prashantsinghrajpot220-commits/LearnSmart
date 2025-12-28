import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import LessonView from '@/components/LessonView';
import { getChapterLessons } from '@/constants/curriculum';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { useSmartyContext } from '@/context/ChatContext';

interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

export default function Lesson() {
  const { colors } = useTheme();
  const { chapter, subject, class: className, lesson } = useLocalSearchParams<{
    chapter: string;
    subject: string;
    class: string;
    lesson?: string;
  }>();
  const { setCurrentContext } = useSmartyContext();

  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadLessons = useCallback(() => {
    setLoading(true);
    const allLessons = getChapterLessons(className, subject, chapter);
    setLessons(allLessons);

    if (lesson) {
      const index = allLessons.findIndex((l) => l.title === lesson);
      setCurrentLessonIndex(index >= 0 ? index : 0);
    } else {
      setCurrentLessonIndex(0);
    }
    setLoading(false);
  }, [chapter, className, lesson, subject]);

  useEffect(() => {
    if (chapter && subject && className) {
      const timer = setTimeout(() => {
        loadLessons();
        // Set chat context for lesson screen
        setCurrentContext(subject, chapter, lesson);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [chapter, subject, className, loadLessons, lesson, setCurrentContext]);

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (lessons.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{chapter}</Text>
          <Text style={styles.subtitle}>{subject}</Text>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No lesson content available</Text>
          </View>
        </View>
      </View>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  return (
    <LessonView
      chapter={chapter}
      subject={subject}
      className={className}
      lessonContent={currentLesson}
      currentLessonIndex={currentLessonIndex}
      totalLessons={lessons.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
      showNavigation={lessons.length > 1}
    />
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  placeholderContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
