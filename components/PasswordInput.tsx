import React, { useState, useRef, forwardRef, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from '@/components/ThemeContext';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onTogglePassword?: (visible: boolean) => void;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ value, onChangeText, error, onFocus, onBlur, onTogglePassword }, ref) => {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const eyeAnim = useMemo(() => new Animated.Value(0), []);
    const dotAnim = useMemo(() => new Animated.Value(1), []);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const togglePassword = () => {
      const newVisible = !isPasswordVisible;
      setIsPasswordVisible(newVisible);
      onTogglePassword?.(newVisible);

      Animated.timing(eyeAnim, {
        toValue: newVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();

      Animated.timing(dotAnim, {
        toValue: newVisible ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }).start();
    };

    const styles = getStyles(colors);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            error && styles.inputWrapperError,
          ]}
        >
          <View style={styles.textContainer}>
            {value.length > 0 && !isPasswordVisible ? (
              <View style={styles.passwordDots}>
                {Array.from({ length: Math.min(value.length, 12) }).map((_, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: colors.text,
                        opacity: dotAnim,
                        transform: [
                          {
                            scale: dotAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 1],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
            ) : (
              <TextInput
                ref={ref}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!isPasswordVisible}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoCapitalize="none"
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.eyeIconWrapper,
                {
                  transform: [
                    {
                      scale: eyeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Feather
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={22}
                color={isFocused ? colors.primary : colors.textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: Spacing.lg,
    },
    label: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.medium,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.lightGray,
      paddingHorizontal: Spacing.md,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    inputWrapperError: {
      borderColor: colors.error,
    },
    textContainer: {
      flex: 1,
      paddingVertical: Spacing.md,
    },
    input: {
      fontSize: FontSizes.md,
      color: colors.text,
      padding: 0,
      margin: 0,
    },
    passwordDots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    eyeButton: {
      padding: Spacing.xs,
    },
    eyeIconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      fontSize: FontSizes.sm,
      color: colors.error,
      marginTop: Spacing.xs,
    },
  });
