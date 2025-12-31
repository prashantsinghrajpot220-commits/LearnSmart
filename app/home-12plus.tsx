import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Feather } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { AvatarDisplay } from '@/components/AvatarSelector';
import PathwaysTab from '@/components/PathwaysTab';

export default function Home12Plus() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userName, ageGroup, loadUserData, logout, selectedAvatar } = useUserStore();

  const opacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    loadUserData();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [loadUserData, opacity]);

  useEffect(() => {
    if (ageGroup === 'under12') {
      router.replace('/home');
    }
  }, [ageGroup, router]);

  const displayName = userName || 'Student';

  const styles = useMemo(() => getStyles(colors), [colors]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.content, { opacity }]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Welcome, {displayName}</Text>
              <Text style={styles.subtitle}>Your learning dashboard</Text>
            </View>
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <AvatarDisplay id={selectedAvatar} size={60} />
            </TouchableOpacity>
          </View>
        </View>

        <PathwaysTab />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Age Group</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>12+</Text>
            <TouchableOpacity
              style={styles.infoButton}
              activeOpacity={0.8}
              onPress={() => {
                // Placeholder for future implementation
              }}
            >
              <Text style={styles.infoButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.infoNote}>Changing age group will be available in Settings soon.</Text>
        </View>

        <TouchableOpacity style={styles.goToSubjectsButton} activeOpacity={0.85} onPress={() => router.push('/home')}>
          <Text style={styles.goToSubjectsText}>Go to Subjects (Under 12 experience)</Text>
          <Feather name="chevron-right" size={18} color={colors.text} />
        </TouchableOpacity>

        {userName && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => {
  const maturePrimary = colors.maturePrimary ?? '#7A9970';
  const matureText = colors.matureText ?? '#1A1A1A';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: matureText,
      flex: 1,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
    },
    infoCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: maturePrimary,
      marginBottom: Spacing.lg,
    },
    infoTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: matureText,
      marginBottom: Spacing.sm,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    infoValue: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: matureText,
    },
    infoButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: maturePrimary,
    },
    infoButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: maturePrimary,
    },
    infoNote: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    goToSubjectsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    goToSubjectsText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: matureText,
      flex: 1,
      marginRight: Spacing.md,
    },
    logoutButton: {
      backgroundColor: colors.lightGray,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.xl,
    },
    logoutButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.textSecondary,
    },
  });
};
