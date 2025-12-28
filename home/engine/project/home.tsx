import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { getSubjectsForClass, needsStreamSelection } from '@/constants/curriculum';
import StreamSelectionModal from '@/components/StreamSelectionModal';
import PathwaysView from '@/components/PathwaysView';

export default function Home() {
  const router = useRouter();
  const { userName, selectedClass, selectedStream, logout, loadUserData } = useUserStore();

  const [showStreamModal, setShowStreamModal] = useState(false);
  const hasShownModal = React.useRef(false);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (selectedClass && !selectedStream && needsStreamSelection(selectedClass)) {
      if (!hasShownModal.current) {
        hasShownModal.current = true;
        setTimeout(() => {
          setShowStreamModal(true);
        }, 0);
      }
    }
  }, [selectedClass, selectedStream]);

  const subjects = selectedClass ? getSubjectsForClass(selectedClass, selectedStream) : [];
  const classNum = selectedClass ? parseInt(selectedClass.replace('Class ', '')) : 0;
  const isClass12Plus = selectedClass === 'Class 12+';
  const isElevenOrTwelve = classNum === 11 || classNum === 12;

  const handleSubjectPress = (subject: string) => {
    if (subject.includes('Coming Soon') || subject.includes('Select')) {
      return;
    }
    router.push({
      pathname: '/chapters',
      params: { subject, class: selectedClass },
    });
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const displayName = userName || 'Student';

  const handleCloseStreamModal = () => {
    setShowStreamModal(false);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={isClass12Plus ? styles.titleDark : styles.title}>
              Welcome, {displayName}!
            </Text>
            <View
              style={[
                styles.classBadge,
                isClass12Plus && styles.classBadgeDark,
              ]}
            >
              <Text style={styles.classText}>{selectedClass || 'No Class Selected'}</Text>
            </View>
          </View>

          {selectedClass ? (
            <>
              {isClass12Plus ? (
                <PathwaysView />
              ) : isElevenOrTwelve && selectedStream ? (
                <>
                  <View style={styles.streamHeader}>
                    <Text style={styles.streamLabel}>Your Stream:</Text>
                    <View style={styles.streamBadge}>
                      <Text style={styles.streamBadgeText}>{selectedStream}</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionTitle}>Your Subjects</Text>

                  <View style={styles.subjectsGrid}>
                    {subjects.map((subject, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.subjectCard,
                          subject.includes('Coming Soon') && styles.disabledCard,
                        ]}
                        onPress={() => handleSubjectPress(subject)}
                        activeOpacity={subject.includes('Coming Soon') ? 1 : 0.7}
                        disabled={subject.includes('Coming Soon')}
                      >
                        <Text style={styles.subjectEmoji}>{getSubjectEmoji(subject)}</Text>
                        <Text style={styles.subjectName}>{subject}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : isElevenOrTwelve ? (
                <>
                  <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderTitle}>Select Your Stream</Text>
                    <Text style={styles.placeholderText}>
                      Please select your stream to see your subjects
                    </Text>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setShowStreamModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionButtonText}>Select Stream</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Your Subjects</Text>

                  <View style={styles.subjectsGrid}>
                    {subjects.map((subject, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.subjectCard,
                          subject.includes('Coming Soon') && styles.disabledCard,
                        ]}
                        onPress={() => handleSubjectPress(subject)}
                        activeOpacity={subject.includes('Coming Soon') ? 1 : 0.7}
                        disabled={subject.includes('Coming Soon')}
                      >
                        <Text style={styles.subjectEmoji}>{getSubjectEmoji(subject)}</Text>
                        <Text style={styles.subjectName}>{subject}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {isClass12Plus && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>💡 Professional Development</Text>
                  <Text style={styles.infoText}>
                    These pathways are designed to prepare you for competitive exams and
                    develop valuable skills for your career.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>No Class Selected</Text>
              <Text style={styles.emptyText}>
                Please create an account or sign in to select your class
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.replace('/auth')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Go to Auth</Text>
              </TouchableOpacity>
            </View>
          )}

          {userName && (
            <TouchableOpacity
              style={[
                styles.logoutButton,
                isClass12Plus && styles.logoutButtonDark,
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.logoutButtonText,
                  isClass12Plus && styles.logoutButtonTextDark,
                ]}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <StreamSelectionModal
        visible={showStreamModal}
        onClose={handleCloseStreamModal}
      />
    </>
  );
}

function getSubjectEmoji(subject: string): string {
  const emojis: Record<string, string> = {
    English: '📖',
    Hindi: '🔤',
    Maths: '🔢',
    Mathematics: '🔢',
    Science: '🔬',
    'Social Science': '🌍',
    EVS: '🌱',
    Physics: '⚛️',
    Chemistry: '🧪',
    Biology: '🧬',
    Economics: '📈',
    Accounts: '💰',
    'Business Studies': '📊',
    History: '📜',
    Geography: '🗺️',
    'Political Science': '🏛️',
    'Competitive Exams': '🎯',
    'Skill Building': '🛠️',
    JEE: '🔬',
    NEET: '🩺',
    UPSC: '📋',
    Coding: '💻',
    Design: '🎨',
    'Video Editing': '🎬',
  };
  return emojis[subject] || '📚';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  titleDark: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.charcoal,
    marginBottom: Spacing.md,
  },
  classBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    alignSelf: 'flex-start',
  },
  classBadgeDark: {
    backgroundColor: Colors.primaryDark,
  },
  classText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  streamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streamLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  streamBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  streamBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm,
    marginBottom: Spacing.xl,
  },
  subjectCard: {
    backgroundColor: Colors.primary,
    flexBasis: Platform.select({
      web: '31%',
      default: '46%',
    }),
    margin: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledCard: {
    backgroundColor: Colors.lightGray,
    opacity: 0.7,
  },
  subjectEmoji: {
    fontSize: FontSizes.xxxl,
    marginBottom: Spacing.sm,
  },
  subjectName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  placeholderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  placeholderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primaryDark,
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonDark: {
    backgroundColor: Colors.charcoal,
  },
  logoutButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  logoutButtonTextDark: {
    color: Colors.white,
  },
});
