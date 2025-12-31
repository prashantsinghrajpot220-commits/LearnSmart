import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Data Collection</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart collects basic information to provide a personalized learning experience. This includes:
          {'\n'}• Your Name and Grade/Class selection
          {'\n'}• Learning progress (XP, streaks, completed lessons and quizzes)
          {'\n'}• Basic device information for analytics and app performance
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Data Usage</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          Your data is used solely for personalizing your learning journey within LearnSmart. We do NOT sell or share your personal data with third-party advertisers or data brokers.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. AdMob Disclaimer</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          We use Google AdMob to display advertisements. Google may use device identifiers and cookies to serve ads based on your interests. Please refer to Google's Privacy Policy for more details.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Amazon Affiliate Disclaimer</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart participates in the Amazon Services LLC Associates Program. When you click on book links, cookies may be used to track purchases for commission purposes. This does not increase the price you pay.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Children's Privacy (COPPA)</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is designed for students. We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without parental consent where required.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Contact Us</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          If you have any questions regarding your privacy, please contact us at: support@learnsmart.app
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Last Updated: December 2024</Text>
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
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  content: {
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  footer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  version: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
});
