import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore, AgeGroup } from '@/store/userStore';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Feather } from '@expo/vector-icons';
import AnimatedLoginForm from '@/components/AnimatedLoginForm';

export default function Auth() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isSignup, setIsSignup] = useState(true);
  const [signupStep, setSignupStep] = useState<'form' | 'age'>('form');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAgeGroup = useUserStore((state) => state.setAgeGroup);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const ageStepOpacity = useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    if (isSignup && signupStep === 'age') {
      ageStepOpacity.setValue(0);
      Animated.timing(ageStepOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [ageStepOpacity, isSignup, signupStep]);

  const handleAgeContinue = async () => {
    if (!selectedAge) return;

    setIsLoading(true);

    try {
      await setAgeGroup(selectedAge);
      completeOnboarding();
      router.replace(selectedAge === '12plus' ? '/home-12plus' : '/home');
    } catch (error) {
      console.error('Failed to save age group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Play Store Test Account - Skip age selection and go directly to home
  const checkForTestAccountAndBypass = async () => {
    try {
      // Get stored user data to check if it's test account
      const userData = await AsyncStorage.getItem('@learnsmart_user_name');
      // If user name is "Test User", bypass age selection
      if (userData === 'Test User') {
        await setAgeGroup('12plus'); // Default to 12+ for test account
        completeOnboarding();
        router.replace('/home-12plus');
        return true;
      }
    } catch (error) {
      console.error('Error checking for test account:', error);
    }
    return false;
  };

  // Check for test account when component mounts
  React.useEffect(() => {
    if (isSignup && signupStep === 'age') {
      checkForTestAccountAndBypass();
    }
  }, [signupStep, isSignup, checkForTestAccountAndBypass]);

  const styles = getStyles(colors);

  if (isSignup && signupStep === 'age') {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: ageStepOpacity }]}>
          <Text style={styles.title}>What's your age group?</Text>
          <Text style={styles.subtitle}>Help us personalize your learning experience</Text>

          <View style={styles.ageSelectionContainer}>
            <TouchableOpacity
              style={[styles.ageCard, selectedAge === 'under12' && styles.ageCardSelected]}
              onPress={() => setSelectedAge('under12')}
              activeOpacity={0.8}
            >
              <View style={[styles.ageIconCircle, selectedAge === 'under12' && styles.ageIconCircleSelected]}>
                <Feather name="book-open" size={32} color={selectedAge === 'under12' ? colors.white : colors.primary} />
              </View>
              <Text style={[styles.ageTitle, selectedAge === 'under12' && styles.ageTitleSelected]}>Under 12</Text>
              <Text style={styles.ageDescription}>Fun and colorful learning experience</Text>
              {selectedAge === 'under12' && (
                <View style={styles.checkmarkContainer}>
                  <Feather name="check-circle" size={24} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ageCard, selectedAge === '12plus' && styles.ageCardSelected]}
              onPress={() => setSelectedAge('12plus')}
              activeOpacity={0.8}
            >
              <View style={[styles.ageIconCircle, selectedAge === '12plus' && styles.ageIconCircleSelected]}>
                <Feather name="award" size={32} color={selectedAge === '12plus' ? colors.white : colors.primary} />
              </View>
              <Text style={[styles.ageTitle, selectedAge === '12plus' && styles.ageTitleSelected]}>12+</Text>
              <Text style={styles.ageDescription}>Professional and focused dashboard</Text>
              {selectedAge === '12plus' && (
                <View style={styles.checkmarkContainer}>
                  <Feather name="check-circle" size={24} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, !selectedAge && styles.primaryButtonDisabled]}
            onPress={handleAgeContinue}
            disabled={!selectedAge || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSignupStep('form')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return <AnimatedLoginForm />;
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  ageSelectionContainer: {
    gap: Spacing.lg,
    marginVertical: Spacing.xxl,
  },
  ageCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
    position: 'relative',
  },
  ageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ageIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  ageIconCircleSelected: {
    backgroundColor: colors.primary,
  },
  ageTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  ageTitleSelected: {
    color: colors.primary,
  },
  ageDescription: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.cardBackground,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.primary,
  },
  backButton: {
    backgroundColor: colors.cardBackground,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.textSecondary,
  },
});
