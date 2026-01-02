import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { timerService, ActiveTimerState } from '@/services/TimerService';
import { TimerSettings, TimerPhase } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';

interface PomodoroTimerProps {
  visible: boolean;
  onClose: () => void;
  subject?: string;
  chapter?: string;
  onSessionStart?: (sessionId: string) => void;
  onSessionComplete?: (sessionId: string, focusScore: number) => void;
}

export default function PomodoroTimer({
  visible,
  onClose,
  subject,
  chapter,
  onSessionStart,
  onSessionComplete,
}: PomodoroTimerProps) {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<TimerSettings>({
    studyDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
    hapticEnabled: true,
    autoStartBreak: false,
    autoStartStudy: false,
  });
  const [activeState, setActiveState] = useState<ActiveTimerState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);

  useEffect(() => {
    loadSettings();
    loadActiveTimer();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await timerService.loadSettings();
    setSettings(loadedSettings);
    setSelectedDuration(loadedSettings.studyDuration);
  };

  const loadActiveTimer = async () => {
    const state = await timerService.loadActiveState();
    setActiveState(state);
  };

  useEffect(() => {
    const unsubscribe = timerService.subscribe((state) => {
      setActiveState(state);
      
      // Check if timer completed
      if (state && state.remainingTime <= 0) {
        handleTimerComplete(state);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTimerComplete = async (state: ActiveTimerState) => {
    const session = await timerService.getSession(state.sessionId);
    if (session && state.phase === 'study') {
      // Session completed, transition to break
      // In a real app, you might trigger a notification here
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!activeState) return 0;
    return ((activeState.totalDuration - activeState.remainingTime) / activeState.totalDuration) * 100;
  };

  const handleStart = async () => {
    const sessionId = await timerService.startStudySession(selectedDuration, settings.breakDuration, subject, chapter);
    if (onSessionStart) {
      onSessionStart(sessionId);
    }
  };

  const handlePause = async () => {
    await timerService.pauseSession();
  };

  const handleResume = async () => {
    await timerService.resumeSession();
  };

  const handleReset = async () => {
    await timerService.resetSession();
  };

  const handleStartBreak = async () => {
    if (!activeState) return;
    await timerService.startBreakSession(settings.breakDuration);
  };

  const handleDurationChange = async (duration: number) => {
    setSelectedDuration(duration);
    await timerService.saveSettings({ studyDuration: duration });
    setSettings((prev) => ({ ...prev, studyDuration: duration }));
  };

  const handleBreakDurationChange = async (duration: number) => {
    await timerService.saveSettings({ breakDuration: duration });
    setSettings((prev) => ({ ...prev, breakDuration: duration }));
  };

  const getPhaseText = (): string => {
    if (!activeState) return 'Ready to Focus';
    if (activeState.phase === 'study') return 'Study Phase';
    if (activeState.phase === 'break') return 'Break Time';
    return 'Paused';
  };

  const isRunning = activeState && activeState.phase !== 'paused';

  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pomodoro Timer</Text>
          <View style={styles.headerSpacer} />
        </View>

        {!activeState ? (
          <SetupView
            colors={colors}
            selectedDuration={selectedDuration}
            onDurationChange={handleDurationChange}
            onStart={handleStart}
            subject={subject}
            chapter={chapter}
          />
        ) : activeState.phase === 'break' ? (
          <BreakTimerView
            colors={colors}
            activeState={activeState}
            settings={settings}
            onDurationChange={handleBreakDurationChange}
            onResume={handleResume}
            onPause={handlePause}
            onReset={handleReset}
            onEndBreak={handleStart}
          />
        ) : (
          <StudyTimerView
            colors={colors}
            activeState={activeState}
            settings={settings}
            onDurationChange={handleDurationChange}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />
        )}
      </View>
    </Modal>
  );
}

interface SetupViewProps {
  colors: ThemeColors;
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  onStart: () => void;
  subject?: string;
  chapter?: string;
}

function SetupView({
  colors,
  selectedDuration,
  onDurationChange,
  onStart,
  subject,
  chapter,
}: SetupViewProps) {
  const styles = getStyles(colors);
  const durations = [15, 25, 30, 45, 60];

  return (
    <View style={styles.content}>
      {(subject || chapter) && (
        <View style={styles.contextContainer}>
          <Text style={styles.contextText}>
            {subject && `📚 ${subject}`}
            {subject && chapter && ' • '}
            {chapter && `📖 ${chapter}`}
          </Text>
        </View>
      )}

      <Text style={styles.phaseTitle}>Ready to Focus?</Text>
      <Text style={styles.phaseSubtitle}>Choose your study duration</Text>

      <View style={styles.durationContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              selectedDuration === duration && styles.durationButtonActive,
            ]}
            onPress={() => onDurationChange(duration)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.durationButtonText,
                selectedDuration === duration && styles.durationButtonTextActive,
              ]}
            >
              {duration} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
        <Feather name="play" size={24} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start Study Session</Text>
      </TouchableOpacity>
    </View>
  );
}

interface StudyTimerViewProps {
  colors: ThemeColors;
  activeState: ActiveTimerState;
  settings: TimerSettings;
  onDurationChange: (duration: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

function StudyTimerView({
  colors,
  activeState,
  settings,
  onDurationChange,
  onStart,
  onPause,
  onResume,
  onReset,
}: StudyTimerViewProps) {
  const styles = getStyles(colors);
  const [showDurationSelector, setShowDurationSelector] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPaused = activeState.phase === 'paused';

  return (
    <View style={styles.content}>
      <Text style={styles.phaseTitle}>Study Phase</Text>
      <Text style={styles.phaseSubtitle}>Stay focused and grow your tree!</Text>

      <View style={styles.timerContainer}>
        <View style={[styles.timerRing, { borderColor: colors.primary }]}>
          <Text style={[styles.timerText, { color: colors.primary }]}>
            {formatTime(activeState.remainingTime)}
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={onReset}
          activeOpacity={0.8}
        >
          <Feather name="rotate-ccw" size={20} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={isPaused ? onResume : onPause}
          activeOpacity={0.8}
        >
          <Feather name={isPaused ? 'play' : 'pause'} size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
      </View>

      {!showDurationSelector && (
        <TouchableOpacity
          style={styles.changeDurationButton}
          onPress={() => setShowDurationSelector(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.changeDurationText}>Change duration</Text>
        </TouchableOpacity>
      )}

      {showDurationSelector && (
        <View style={styles.durationSelector}>
          {[15, 25, 30, 45, 60].map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.durationOption,
                settings.studyDuration === duration && styles.durationOptionActive,
              ]}
              onPress={() => {
                onDurationChange(duration);
                setShowDurationSelector(false);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.durationOptionText,
                  settings.studyDuration === duration && styles.durationOptionTextActive,
                ]}
              >
                {duration} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

interface BreakTimerViewProps {
  colors: ThemeColors;
  activeState: ActiveTimerState;
  settings: TimerSettings;
  onDurationChange: (duration: number) => void;
  onResume: () => void;
  onPause: () => void;
  onReset: () => void;
  onEndBreak: () => void;
}

function BreakTimerView({
  colors,
  activeState,
  settings,
  onDurationChange,
  onResume,
  onPause,
  onReset,
  onEndBreak,
}: BreakTimerViewProps) {
  const styles = getStyles(colors);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPaused = activeState.phase === 'paused';

  return (
    <View style={styles.content}>
      <Text style={styles.phaseTitle}>Break Time!</Text>
      <Text style={styles.phaseSubtitle}>Take a well-deserved break</Text>

      <View style={styles.timerContainer}>
        <View style={[styles.timerRing, { borderColor: colors.warning }]}>
          <Text style={[styles.timerText, { color: colors.warning }]}>
            {formatTime(activeState.remainingTime)}
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={onReset}
          activeOpacity={0.8}
        >
          <Feather name="rotate-ccw" size={20} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>End</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={isPaused ? onResume : onPause}
          activeOpacity={0.8}
        >
          <Feather name={isPaused ? 'play' : 'pause'} size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.endBreakButton}
        onPress={onEndBreak}
        activeOpacity={0.8}
      >
        <Feather name="arrow-right" size={20} color={colors.primary} />
        <Text style={styles.endBreakButtonText}>Start New Study Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.select({ ios: 50, default: 20 }),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    headerTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    closeButton: {
      padding: Spacing.sm,
    },
    headerSpacer: {
      width: 40,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xl,
    },
    contextContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contextText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    phaseTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    phaseSubtitle: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xxl,
    },
    durationContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.xxl,
    },
    durationButton: {
      backgroundColor: colors.cardBackground,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: colors.border,
    },
    durationButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    durationButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
    },
    durationButtonTextActive: {
      color: colors.white,
    },
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: Spacing.xxl,
    },
    timerRing: {
      width: 250,
      height: 250,
      borderRadius: 125,
      borderWidth: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBackground,
    },
    timerText: {
      fontSize: 48,
      fontWeight: FontWeights.bold,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.xl,
      gap: Spacing.sm,
    },
    secondaryButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.border,
    },
    primaryButton: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    controlButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
    changeDurationButton: {
      alignItems: 'center',
      paddingVertical: Spacing.md,
    },
    changeDurationText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textDecorationLine: 'underline',
    },
    durationSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    durationOption: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    durationOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    durationOptionText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      color: colors.text,
    },
    durationOptionTextActive: {
      color: colors.white,
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      gap: Spacing.md,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    startButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.white,
    },
    endBreakButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBackground,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.xl,
      gap: Spacing.sm,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    endBreakButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.primary,
    },
  });
