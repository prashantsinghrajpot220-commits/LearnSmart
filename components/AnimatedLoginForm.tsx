import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import CartoonCharacter, { AnimationState } from '@/components/CartoonCharacter';
import { PasswordInput } from '@/components/PasswordInput';

export default function AnimatedLoginForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [characterState, setCharacterState] = useState<AnimationState>('idle');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const setUserName = useUserStore((state) => state.setUserName);

  const buttonScale = useMemo(() => new Animated.Value(1), []);
  const buttonOpacity = useMemo(() => new Animated.Value(1), []);
  const cardOffset = useMemo(() => new Animated.Value(0), []);

  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', (event) => {
      Animated.timing(cardOffset, {
        toValue: -event.endCoordinates.height * 0.15,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(cardOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [cardOffset]);

  useEffect(() => {
    if (password.length > 0 && !passwordVisible) {
      setCharacterState('curious');
    } else if (passwordVisible) {
      setCharacterState('surprised');
    } else {
      setCharacterState('idle');
    }
  }, [password, passwordVisible]);

  useEffect(() => {
    if (isLoggingIn) {
      setCharacterState('happy');
    }
  }, [isLoggingIn]);

  const handlePasswordFocus = () => {
    setCharacterState('curious');
  };

  const handlePasswordBlur = () => {
    if (password.length > 0 && !passwordVisible) {
      setCharacterState('idle');
    } else if (passwordVisible) {
      setCharacterState('surprised');
    } else {
      setCharacterState('idle');
    }
  };

  const handlePasswordToggle = (visible: boolean) => {
    setPasswordVisible(visible);
    if (visible) {
      setCharacterState('surprised');
      setTimeout(() => {
        if (password.length > 0) {
          setCharacterState('happy');
        }
      }, 500);
    } else {
      setCharacterState('relaxed');
      setTimeout(() => {
        if (password.length > 0) {
          setCharacterState('curious');
        } else {
          setCharacterState('idle');
        }
      }, 800);
    }
  };

  const handleLoginFocus = () => {
    if (password.length > 0) {
      setCharacterState('happy');
    }
  };

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setCharacterState('idle');
      return;
    }

    setIsLoggingIn(true);
    setCharacterState('happy');

    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        bounciness: 8,
      }),
    ]).start();

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUserName(name);
      router.replace('/home');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
      setIsLoggingIn(false);
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 6,
        }),
      ]).start();
    }
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        <CartoonCharacter state={characterState} size={160} />
      </View>

      <Animated.View style={[styles.card, { transform: [{ translateY: cardOffset }] }]}>
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

          <PasswordInput
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onTogglePassword={handlePasswordToggle}
            ref={passwordInputRef}
          />

          <Animated.View
            style={[
              styles.primaryButton,
              {
                transform: [{ scale: buttonScale }],
                opacity: buttonOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={handleSubmit}
              onPressIn={() => {
                Animated.spring(buttonScale, {
                  toValue: 0.92,
                  useNativeDriver: true,
                  bounciness: 8,
                }).start();
                handleLoginFocus();
              }}
              onPressOut={() => {
                Animated.spring(buttonScale, {
                  toValue: 1,
                  useNativeDriver: true,
                  bounciness: 8,
                }).start();
              }}
              disabled={isLoading}
              activeOpacity={1}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignup ? 'Next' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setIsSignup(!isSignup);
              setErrors({});
              setCharacterState('idle');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              {isSignup ? 'Already have an account? Sign In' : 'Create new account'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>LearnSmart - Phase 6A</Text>
      </Animated.View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    characterContainer: {
      marginBottom: Spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: Platform.select({ web: 420, default: undefined }),
      paddingHorizontal: Spacing.xl,
      paddingTop: Platform.select({ web: Spacing.xl, default: Spacing.lg }),
      paddingBottom: Spacing.xxl,
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
      marginBottom: Spacing.xl,
    },
    form: {
      width: '100%',
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
      overflow: 'hidden',
    },
    buttonTouchable: {
      width: '100%',
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
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
      marginTop: Spacing.xl,
    },
  });
