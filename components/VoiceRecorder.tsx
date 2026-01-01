import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, ThemeColors } from './ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { speechToTextService } from '@/services/SpeechToTextService';
import { noteSummarizerService } from '@/services/NoteSummarizerService';
import { TranscriptionResult } from '@/types/notes';

const { width: screenWidth } = Dimensions.get('window');

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  language?: 'en' | 'hi' | 'hinglish';
  subject?: string;
  chapter?: string;
}

export default function VoiceRecorder({
  onTranscriptionComplete,
  language = 'en',
  subject,
  chapter,
}: VoiceRecorderProps) {
  const { colors, isDark } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const waveAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      waveAnimation.value = withRepeat(
        withSpring(1, { damping: 0.5, stiffness: 100 }),
        -1,
        true
      );
      scaleAnimation.value = withTiming(1.1, { duration: 300 });
    } else {
      waveAnimation.value = withTiming(0, { duration: 300 });
      scaleAnimation.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + waveAnimation.value * 0.5,
    height: 30 + waveAnimation.value * 40,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const startRecording = async () => {
    setError(null);
    setTranscript('');
    setRecordingTime(0);

    // Check permissions
    const hasPermission = await speechToTextService.requestPermissions();
    if (!hasPermission) {
      setError('Microphone permission denied. Please enable it in settings.');
      return;
    }

    // Check if speech recognition is supported
    if (!speechToTextService.isSupported()) {
      setError('Speech recognition is not supported on this device.');
      return;
    }

    try {
      await speechToTextService.startListening(
        (result: TranscriptionResult) => {
          setTranscript(result.text);
        },
        (errorMessage: string) => {
          setError(errorMessage);
          stopRecording();
        },
        language
      );
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording. Please try again.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    await speechToTextService.stopListening();

    if (transcript.trim()) {
      setIsProcessing(true);
      try {
        const summarizedResult = await noteSummarizerService.summarizeText(
          transcript,
          { subject, chapter, language }
        );
        onTranscriptionComplete(summarizedResult.summary);
      } catch (err) {
        console.error('Summarization error:', err);
        onTranscriptionComplete(transcript);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const styles = getStyles(colors, isDark);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Waveform visualization */}
      <View style={styles.waveformContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveformBar,
              waveAnimatedStyle,
              {
                animationDelay: `${index * 0.1}s`,
                opacity: isRecording ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      {/* Live transcript */}
      {(isRecording || transcript) && (
        <View style={styles.transcriptContainer}>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={[styles.recordingDot, { backgroundColor: colors.error }]} />
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
            </View>
          )}
          <Text style={styles.transcript} numberOfLines={3}>
            {transcript || (isRecording ? 'Listening...' : '')}
          </Text>
        </View>
      )}

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}

      {/* Record button */}
      <View style={styles.buttonContainer}>
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordingButton,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <Text style={styles.recordButtonText}>
              {isRecording ? '⏹' : '🎙️'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.buttonLabel}>
          {isRecording ? 'Tap to stop' : 'Tap to record'}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 4,
    marginBottom: Spacing.md,
  },
  waveformBar: {
    width: 6,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.full,
  },
  transcriptContainer: {
    width: '100%',
    minHeight: 60,
    marginBottom: Spacing.md,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  recordingTime: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.error,
  },
  transcript: {
    fontSize: FontSizes.md,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    width: '100%',
    padding: Spacing.sm,
    backgroundColor: `${colors.error}20`,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: colors.error,
    textAlign: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  processingText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: colors.error,
  },
  recordButtonText: {
    fontSize: FontSizes.xl,
  },
  buttonLabel: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
});
