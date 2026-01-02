import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/components/ThemeContext';
import { studyGroupService, type GroupChatMessage, type GroupNote, type StudyGroup, type StudyScheduleEntry } from '@/services/StudyGroupService';
import { groupQuizService, type GroupQuiz } from '@/services/GroupQuizService';
import GroupChatMessageItem from '@/components/GroupChatMessage';
import GroupNoteCard from '@/components/GroupNoteCard';
import GroupLeaderboard from '@/components/GroupLeaderboard';
import { useUserStore } from '@/store/userStore';
import { useQuizStore } from '@/store/quizStore';
import QuizCard from '@/components/QuizCard';

const TABS = ['Chat', 'Notes', 'Members', 'Quizzes', 'Leaderboard', 'Schedule'] as const;

type TabKey = (typeof TABS)[number];

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { userId, userName, selectedAvatar, selectedClass } = useUserStore();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [tab, setTab] = useState<TabKey>('Chat');

  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [chatText, setChatText] = useState('');

  const [notes, setNotes] = useState<GroupNote[]>([]);
  const [noteText, setNoteText] = useState('');

  const [schedule, setSchedule] = useState<StudyScheduleEntry[]>([]);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleWhen, setScheduleWhen] = useState('');

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');

  const [quizzes, setQuizzes] = useState<GroupQuiz[]>([]);
  const [quizSubject, setQuizSubject] = useState('');
  const [quizChapter, setQuizChapter] = useState('');
  const [quizReward, setQuizReward] = useState('25');
  const [quizDeadlineHours, setQuizDeadlineHours] = useState('24');

  const [activeQuiz, setActiveQuiz] = useState<GroupQuiz | null>(null);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [completedQuizResult, setCompletedQuizResult] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  const isAdmin = Boolean(group?.adminIds.includes(userId));

  const latestQuiz = quizzes[0] ?? null;

  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const loadGroup = useCallback(async () => {
    if (!groupId) return;
    const g = await studyGroupService.getGroup(groupId);
    setGroup(g);
  }, [groupId]);

  useEffect(() => {
    loadGroup();
    const unsub = studyGroupService.subscribeToGroups(() => {
      loadGroup();
    });
    return unsub;
  }, [loadGroup]);

  useEffect(() => {
    if (!groupId) return;
    const unsubChat = studyGroupService.subscribeToChat(groupId, setMessages);
    const unsubNotes = studyGroupService.subscribeToNotes(groupId, setNotes);
    const unsubSchedule = studyGroupService.subscribeToSchedule(groupId, setSchedule);
    const unsubQuizzes = groupQuizService.subscribe(groupId, (items) => {
      setQuizzes(items);
    });

    return () => {
      unsubChat();
      unsubNotes();
      unsubSchedule();
      unsubQuizzes();
    };
  }, [groupId]);

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    Alert.alert('Leave group?', 'You can join again later with an invite code.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          try {
            await studyGroupService.leaveGroup(groupId);
            router.back();
          } catch (error) {
            Alert.alert('Could not leave', error instanceof Error ? error.message : 'Please try again.');
          }
        },
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!groupId) return;
    try {
      await studyGroupService.sendChatMessage(groupId, chatText);
      setChatText('');
    } catch (error) {
      Alert.alert('Could not send message', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleAddNote = async () => {
    if (!groupId) return;
    try {
      await studyGroupService.addNote(groupId, noteText);
      setNoteText('');
    } catch (error) {
      Alert.alert('Could not post note', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleAddSchedule = async () => {
    if (!groupId) return;

    const title = scheduleTitle.trim();
    if (!title) {
      Alert.alert('Missing title', 'Add a short schedule title.');
      return;
    }

    const whenInput = scheduleWhen.trim();
    const when = whenInput ? new Date(whenInput) : new Date(Date.now() + 60 * 60 * 1000);

    if (Number.isNaN(when.getTime())) {
      Alert.alert('Invalid date', 'Try a format like 2026-01-02 18:30');
      return;
    }

    try {
      await studyGroupService.addScheduleEntry(groupId, {
        title,
        scheduledAt: when.toISOString(),
      });
      setScheduleTitle('');
      setScheduleWhen('');
    } catch (error) {
      Alert.alert('Could not add schedule', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleGenerateInvite = async () => {
    if (!groupId) return;
    try {
      const code = await studyGroupService.createInviteCode(groupId);
      setInviteCode(code);
      await Share.share({
        message: `Join my LearnSmart study group “${group?.name ?? ''}” with this invite code: ${code}`,
      });
    } catch (error) {
      Alert.alert('Could not create invite', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleInviteByUsername = async () => {
    if (!groupId) return;
    try {
      await studyGroupService.inviteByUsername(groupId, inviteUsername);
      setInviteUsername('');
      Alert.alert('Invite sent', 'If that user is on this device, they will see a notification.');
    } catch (error) {
      Alert.alert('Could not invite', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!groupId) return;
    try {
      await studyGroupService.removeMember(groupId, memberId);
    } catch (error) {
      Alert.alert('Could not remove member', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleCreateQuiz = async () => {
    if (!groupId) return;
    if (!quizSubject.trim() || !quizChapter.trim()) {
      Alert.alert('Missing fields', 'Please enter a subject and chapter.');
      return;
    }

    const reward = Number(quizReward) || 0;
    const hours = Number(quizDeadlineHours) || 24;

    try {
      await groupQuizService.createGroupQuiz({
        groupId,
        className: selectedClass || 'Class',
        subject: quizSubject.trim(),
        chapter: quizChapter.trim(),
        deadline: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
        reward,
      });
      setQuizSubject('');
      setQuizChapter('');
      setQuizReward('25');
      setQuizDeadlineHours('24');
      setTab('Quizzes');
    } catch (error) {
      Alert.alert('Could not create quiz', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const openQuiz = (quiz: GroupQuiz) => {
    setActiveQuiz(quiz);
    setCompletedQuizResult(null);

    useQuizStore.getState().setQuestions(quiz.questions, quiz.chapter, quiz.subject, quiz.chapter);
    setQuizModalVisible(true);
  };

  const closeQuiz = () => {
    setQuizModalVisible(false);
    setActiveQuiz(null);
    setCompletedQuizResult(null);
    useQuizStore.getState().resetQuiz();
  };

  const handleEndQuiz = async () => {
    if (!activeQuiz) return;

    try {
      const result = await useQuizStore.getState().endQuiz();
      if (!result) {
        closeQuiz();
        return;
      }

      setCompletedQuizResult({
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
      });
    } catch (error) {
      Alert.alert('Could not finish quiz', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleSubmitQuizResult = async () => {
    if (!groupId || !activeQuiz) return;

    if (!completedQuizResult) {
      closeQuiz();
      return;
    }

    try {
      setSubmittingQuiz(true);

      await groupQuizService.submitGroupQuizResult({
        groupId,
        groupQuizId: activeQuiz.id,
        score: completedQuizResult.score,
        correctAnswers: completedQuizResult.correctAnswers,
        totalQuestions: completedQuizResult.totalQuestions,
      });

      closeQuiz();
      setTab('Leaderboard');
    } catch (error) {
      Alert.alert('Could not submit quiz', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (!group) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading group…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.groupHeader}>
          <View style={styles.groupIcon}>
            <Text style={styles.groupIconText}>{group.icon || '👥'}</Text>
          </View>
          <View style={styles.groupMeta}>
            <Text style={styles.groupName} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={styles.groupDesc} numberOfLines={2}>
              {group.description}
            </Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLeaveGroup}>
            <Text style={styles.secondaryButtonText}>Leave</Text>
          </TouchableOpacity>

          {isAdmin ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateInvite}>
              <Text style={styles.primaryButtonText}>Invite</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {inviteCode ? (
          <View style={styles.inviteCodeCard}>
            <Text style={styles.inviteTitle}>Invite Code</Text>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
            <Text style={styles.inviteHint}>Share this code to let others join.</Text>
          </View>
        ) : null}

        {isAdmin ? (
          <View style={styles.inviteByUsernameCard}>
            <Text style={styles.sectionTitle}>Invite by username</Text>
            <View style={styles.inlineRow}>
              <TextInput
                value={inviteUsername}
                onChangeText={setInviteUsername}
                placeholder="Username"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.joinButton} onPress={handleInviteByUsername}>
                <Text style={styles.joinButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabChip, tab === t ? styles.tabChipActive : null]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabChipText, tab === t ? styles.tabChipTextActive : null]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {tab === 'Chat' ? (
          <View style={styles.tabSection}>
            {messages.length === 0 ? (
              <Text style={styles.emptySubtitle}>No messages yet. Say hello!</Text>
            ) : (
              messages.map((m) => <GroupChatMessageItem key={m.id} message={m} group={group} />)
            )}

            <View style={styles.inlineRow}>
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                placeholder="Type a message…"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
              <TouchableOpacity style={styles.joinButton} onPress={handleSendMessage}>
                <Text style={styles.joinButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {tab === 'Notes' ? (
          <View style={styles.tabSection}>
            <View style={styles.inlineRow}>
              <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Share a note with the group…"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
              <TouchableOpacity style={styles.joinButton} onPress={handleAddNote}>
                <Text style={styles.joinButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: Spacing.md }}>
              {notes.length === 0 ? (
                <Text style={styles.emptySubtitle}>No notes yet.</Text>
              ) : (
                notes.map((n) => <GroupNoteCard key={n.id} note={n} group={group} />)
              )}
            </View>
          </View>
        ) : null}

        {tab === 'Members' ? (
          <View style={styles.tabSection}>
            <Text style={styles.sectionTitle}>Members ({group.members.length})</Text>
            {group.members.map((memberId) => {
              const profile = group.memberProfiles[memberId];
              const displayName = profile?.userName ?? memberId;
              const isMemberAdmin = group.adminIds.includes(memberId);
              return (
                <View key={memberId} style={styles.memberRow}>
                  <View style={styles.memberMeta}>
                    <Text style={styles.memberName}>{displayName}</Text>
                    <Text style={styles.memberRole}>{isMemberAdmin ? 'Admin' : 'Member'}</Text>
                  </View>

                  {isAdmin && memberId !== userId ? (
                    <TouchableOpacity style={styles.kickButton} onPress={() => handleRemoveMember(memberId)}>
                      <Text style={styles.kickText}>Remove</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {tab === 'Quizzes' ? (
          <View style={styles.tabSection}>
            {isAdmin ? (
              <View style={styles.quizCreateCard}>
                <Text style={styles.sectionTitle}>Create a group quiz</Text>
                <TextInput
                  value={quizSubject}
                  onChangeText={setQuizSubject}
                  placeholder="Subject (e.g., Mathematics)"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                />
                <TextInput
                  value={quizChapter}
                  onChangeText={setQuizChapter}
                  placeholder="Chapter / Topic"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { marginTop: Spacing.sm }]}
                />

                <View style={[styles.inlineRow, { marginTop: Spacing.sm }]}> 
                  <TextInput
                    value={quizReward}
                    onChangeText={setQuizReward}
                    placeholder="Reward"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                  />
                  <View style={{ width: Spacing.md }} />
                  <TextInput
                    value={quizDeadlineHours}
                    onChangeText={setQuizDeadlineHours}
                    placeholder="Hours"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity style={[styles.primaryButton, { marginTop: Spacing.md }]} onPress={handleCreateQuiz}>
                  <Text style={styles.primaryButtonText}>Create Quiz</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ marginTop: Spacing.lg }}>
              <Text style={styles.sectionTitle}>Quiz challenges</Text>
              {quizzes.length === 0 ? (
                <Text style={styles.emptySubtitle}>No group quizzes yet.</Text>
              ) : (
                quizzes.map((q) => {
                  const taken = Boolean(q.results[userId]);
                  return (
                    <View key={q.id} style={styles.quizRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.quizTitle}>{q.subject}: {q.chapter}</Text>
                        <Text style={styles.quizMeta}>
                          Reward {q.reward} · {Object.keys(q.results).length}/{group.members.length} completed
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={taken ? styles.secondaryButton : styles.joinButton}
                        onPress={() => openQuiz(q)}
                      >
                        <Text style={taken ? styles.secondaryButtonText : styles.joinButtonText}>{taken ? 'Retake' : 'Take'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        ) : null}

        {tab === 'Leaderboard' ? (
          <View style={styles.tabSection}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            {!latestQuiz ? (
              <Text style={styles.emptySubtitle}>Create a quiz to start competing.</Text>
            ) : (
              <GroupLeaderboard group={group} quiz={latestQuiz} />
            )}
          </View>
        ) : null}

        {tab === 'Schedule' ? (
          <View style={styles.tabSection}>
            <Text style={styles.sectionTitle}>Study schedule</Text>
            <Text style={styles.emptySubtitle}>Add coordinated study times for your group.</Text>

            <TextInput
              value={scheduleTitle}
              onChangeText={setScheduleTitle}
              placeholder="Session title (e.g., Algebra revision)"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
            <TextInput
              value={scheduleWhen}
              onChangeText={setScheduleWhen}
              placeholder="When (e.g., 2026-01-02 18:30)"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { marginTop: Spacing.sm }]}
              autoCapitalize="none"
            />
            <TouchableOpacity style={[styles.primaryButton, { marginTop: Spacing.md }]} onPress={handleAddSchedule}>
              <Text style={styles.primaryButtonText}>Add</Text>
            </TouchableOpacity>

            <View style={{ marginTop: Spacing.lg }}>
              {schedule.length === 0 ? (
                <Text style={styles.emptySubtitle}>No scheduled sessions yet.</Text>
              ) : (
                schedule
                  .slice()
                  .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                  .map((s) => (
                    <View key={s.id} style={styles.scheduleRow}>
                      <Text style={styles.scheduleTitle}>{s.title}</Text>
                      <Text style={styles.scheduleMeta}>{new Date(s.scheduledAt).toLocaleString()}</Text>
                    </View>
                  ))
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal visible={quizModalVisible} transparent animationType="slide" onRequestClose={closeQuiz}>
        <View style={styles.modalOverlay}>
          <View style={styles.quizModalCard}>
            <View style={styles.quizModalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {activeQuiz ? `${activeQuiz.subject}: ${activeQuiz.chapter}` : 'Group Quiz'}
              </Text>
              <TouchableOpacity onPress={closeQuiz}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quizModalContent}>
              {activeQuiz ? (
                <GroupQuizFlow onEnd={handleEndQuiz} onSubmit={handleSubmitQuizResult} submitting={submittingQuiz} />
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function GroupQuizFlow({ onFinish, submitting }: { onFinish: () => void; submitting: boolean }) {
  const { questions, currentQuestionIndex, isQuizActive, selectedAnswers } = useQuizStore();
  const { colors } = useTheme();

  const isLast = currentQuestionIndex === questions.length - 1;
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  const handleNext = () => {
    useQuizStore.getState().nextQuestion();
  };

  const handlePrev = () => {
    useQuizStore.getState().previousQuestion();
  };

  if (!isQuizActive) {
    const score = useQuizStore.getState().score;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg }}>
        <Text style={{ fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: colors.primary }}>{score}%</Text>
        <Text style={{ fontSize: FontSizes.md, color: colors.textSecondary, marginTop: 6, textAlign: 'center' }}>
          Quiz complete. Your score has been recorded.
        </Text>
        <TouchableOpacity
          onPress={onFinish}
          disabled={submitting}
          style={{
            marginTop: Spacing.lg,
            backgroundColor: colors.primary,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius.lg,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: FontWeights.bold }}>{submitting ? 'Submitting…' : 'Back to Group'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) return null;

  return (
    <View style={{ flex: 1 }}>
      <QuizCard
        question={question}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onNext={handleNext}
        onPrevious={handlePrev}
      />

      <View style={{ flexDirection: 'row', marginTop: Spacing.md }}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentQuestionIndex === 0}
          style={{
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: BorderRadius.lg,
            paddingVertical: Spacing.md,
            alignItems: 'center',
            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: FontWeights.bold }}>Previous</Text>
        </TouchableOpacity>

        <View style={{ width: Spacing.md }} />

        {isLast ? (
          <TouchableOpacity
            onPress={onFinish}
            disabled={!isAnswered || submitting}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: BorderRadius.lg,
              paddingVertical: Spacing.md,
              alignItems: 'center',
              opacity: !isAnswered || submitting ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: FontWeights.bold }}>{submitting ? 'Submitting…' : 'Finish'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            disabled={!isAnswered}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: BorderRadius.lg,
              paddingVertical: Spacing.md,
              alignItems: 'center',
              opacity: !isAnswered ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: FontWeights.bold }}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingTop: 90,
      paddingHorizontal: Spacing.lg,
      paddingBottom: 140,
    },
    loadingText: {
      color: colors.textSecondary,
      paddingVertical: Spacing.md,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    groupIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    groupIconText: {
      fontSize: 28,
    },
    groupMeta: {
      flex: 1,
    },
    groupName: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 2,
    },
    groupDesc: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: FontSizes.sm * 1.35,
    },
    headerButtons: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
      marginLeft: Spacing.md,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.md,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.md,
    },
    inviteCodeCard: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    inviteTitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: FontWeights.semibold,
    },
    inviteCode: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.primary,
    },
    inviteHint: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 6,
    },
    inviteByUsernameCard: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    tabRow: {
      marginVertical: Spacing.md,
    },
    tabChip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.cardBackground,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: Spacing.sm,
    },
    tabChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tabChipText: {
      fontSize: FontSizes.sm,
      color: colors.text,
      fontWeight: FontWeights.semibold,
    },
    tabChipTextActive: {
      color: '#FFFFFF',
    },
    tabSection: {
      marginTop: Spacing.sm,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    emptySubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginBottom: Spacing.md,
    },
    inlineRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      height: 48,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      color: colors.text,
      backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    },
    joinButton: {
      marginLeft: Spacing.md,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    joinButtonText: {
      color: '#FFFFFF',
      fontWeight: FontWeights.bold,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.sm,
    },
    memberMeta: {
      flex: 1,
    },
    memberName: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 2,
    },
    memberRole: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
    },
    kickButton: {
      backgroundColor: '#E07856',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    kickText: {
      color: '#FFFFFF',
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.sm,
    },
    quizCreateCard: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    quizRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: Spacing.sm,
    },
    quizTitle: {
      fontSize: FontSizes.md,
      color: colors.text,
      fontWeight: FontWeights.bold,
    },
    quizMeta: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 4,
    },
    scheduleRow: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.sm,
    },
    scheduleTitle: {
      fontSize: FontSizes.md,
      color: colors.text,
      fontWeight: FontWeights.bold,
    },
    scheduleMeta: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 4,
    },
    bottomSpacer: {
      height: Spacing.xl,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: Spacing.lg,
      justifyContent: 'center',
    },
    quizModalCard: {
      height: '90%',
      backgroundColor: colors.background,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    quizModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      flex: 1,
      paddingRight: Spacing.md,
    },
    closeText: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    quizModalContent: {
      flex: 1,
      padding: Spacing.lg,
    },
  });
