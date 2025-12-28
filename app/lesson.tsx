import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import LessonView from '@/components/LessonView';
import { getChapterLessons } from '@/constants/curriculum';

interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

export default function Lesson() {
  const { chapter, subject, class: className, lesson } = useLocalSearchParams<{
    chapter: string;
    subject: string;
    class: string;
    lesson?: string;
  }>();

  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadLessons = () => {
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
  };

  useEffect(() => {
    if (chapter && subject && className) {
      const loadData = () => {
        loadLessons();
      };
      loadData();
    }
  }, [chapter, subject, className, lesson]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  placeholderContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
