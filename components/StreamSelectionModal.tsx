import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useTheme, ThemeColors } from './ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const STREAM_OPTIONS = [
  {
    id: 'Science',
    title: 'Science',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    description: 'For students aspiring to be engineers, doctors, or scientists',
    color: '#4A90A4',
  },
  {
    id: 'Commerce',
    title: 'Commerce',
    subjects: ['Economics', 'Accounts', 'Business Studies', 'Mathematics', 'English'],
    description: 'For students interested in business, finance, or entrepreneurship',
    color: '#7A9268',
  },
  {
    id: 'Arts',
    title: 'Arts',
    subjects: ['History', 'Geography', 'Political Science', 'English', 'Hindi'],
    description: 'For students passionate about humanities, creativity, or social sciences',
    color: '#A4846C',
  },
];

interface StreamSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function StreamSelectionModal({ visible, onClose }: StreamSelectionModalProps) {
  const { selectedStream, setSelectedStream } = useUserStore();
  const [selectedId, setSelectedId] = React.useState(selectedStream);
  const { colors, isDark } = useTheme();

  React.useEffect(() => {
    if (visible && selectedStream) {
      setSelectedId(selectedStream);
    }
  }, [visible, selectedStream]);

  const handleSelect = (streamId: string) => {
    setSelectedId(streamId);
  };

  const handleConfirm = () => {
    if (selectedId) {
      setSelectedStream(selectedId);
      onClose();
    }
  };

  const styles = getStyles(colors, isDark);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { width: Platform.select({ web: 420, default: screenWidth - 48 }) },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Select Your Stream</Text>
            <Text style={styles.subtitle}>
              Choose the stream that best fits your interests and career goals
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {STREAM_OPTIONS.map((stream) => (
              <TouchableOpacity
                key={stream.id}
                style={[
                  styles.optionCard,
                  selectedId === stream.id && styles.selectedOption,
                ]}
                onPress={() => handleSelect(stream.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: stream.color },
                  ]}
                />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{stream.title}</Text>
                  <Text style={styles.optionDescription}>{stream.description}</Text>
                  <View style={styles.subjectsContainer}>
                    {stream.subjects.slice(0, 3).map((subject) => (
                      <View key={subject} style={styles.subjectChip}>
                        <Text style={styles.subjectChipText}>{subject}</Text>
                      </View>
                    ))}
                    {stream.subjects.length > 3 && (
                      <View style={styles.subjectChip}>
                        <Text style={styles.subjectChipText}>+{stream.subjects.length - 3}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={[styles.radioButton, selectedId === stream.id && styles.radioButtonSelected]}>
                  {selectedId === stream.id && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, !selectedId && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selectedId}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    maxHeight: '80%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    padding: Spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: isDark ? '#2C3E2C' : '#F8FAF7',
  },
  colorIndicator: {
    width: 4,
    height: '100%',
    minHeight: 60,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  subjectChip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  subjectChipText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  confirmButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
});
