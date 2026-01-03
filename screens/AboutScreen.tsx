import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Spacing, FontSizes, FontWeights } from '@/constants/theme';

export default function AboutScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About LearnSmart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.appInfo}>
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>LS</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>LearnSmart</Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>

        <Text style={[styles.missionTitle, { color: colors.text }]}>Our Mission</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is dedicated to making quality education accessible and engaging for students across India. By leveraging technology and NCERT-aligned curriculum, we provide a personalized learning path for every student.
        </Text>

        <Text style={[styles.missionTitle, { color: colors.text }]}>Acknowledgments</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          • NCERT for educational materials and curriculum guidelines.
          {'\n'}• Vector artists and designers for aesthetic icons and avatars.
          {'\n'}• Open source community for React Native and Expo frameworks.
        </Text>

        <View style={styles.credits}>
          <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
            Made with ❤️ for students everywhere.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  appName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  version: {
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
  missionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  content: {
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  credits: {
    marginTop: Spacing.xxxl,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
});
