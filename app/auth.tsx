import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import Dropdown from '@/components/Dropdown';
import { CLASS_OPTIONS } from '@/constants/curriculum';
import { useTheme, ThemeColors } from '@/components/ThemeContext';

export default function Auth() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; class?: string }>({});

  const setUserName = useUserStore((state) => state.setUserName);
  const setSelectedClassInStore = useUserStore((state) => state.setSelectedClass);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string; class?: string } = {};

    if (isSignup && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (isSignup && !selectedClass) {
      newErrors.class = 'Please select a class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isSignup) {
        setUserName(name);
        setSelectedClassInStore(selectedClass);
        completeOnboarding();
      }

      router.replace('/home');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>
        <Text style={styles.subtitle}>
          {isSignup ? 'Start your learning journey today' : 'Sign in to continue learning'}
        </Text>

        <View style={styles.form}>
          {isSignup && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {isSignup && (
            <View style={styles.inputContainer}>
              <Dropdown
                label="Select Class"
                value={selectedClass}
                options={CLASS_OPTIONS}
                onSelect={setSelectedClass}
                placeholder="Choose your class"
              />
              {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}
            </View>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignup ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setIsSignup(!isSignup);
              setErrors({});
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              {isSignup ? 'Already have an account? Sign In' : 'Create new account'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>LearnSmart - Phase 2A</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl * 2, default: Spacing.xxl + 40 }),
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
  form: {
    width: '100%',
    maxWidth: Platform.select({ web: 400, default: undefined }),
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: colors.error,
    marginTop: Spacing.xs,
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
  footerText: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
