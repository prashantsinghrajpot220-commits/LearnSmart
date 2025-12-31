import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Spacing, FontSizes, FontWeights } from '@/constants/theme';

export default function TermsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          By downloading and using LearnSmart, you agree to abide by these Terms of Service and all applicable laws and regulations.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. App Usage Rights</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          We grant you a personal, non-exclusive, non-transferable license to use the app for personal, non-commercial educational purposes.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Content Rights & Attribution</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart uses educational data and content derived from NCERT materials. We acknowledge NCERT as the source of this curriculum data. Users may not redistribute this content for commercial gain.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. User Responsibilities</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Disclaimer of Liability</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is provided "as is" without warranties of any kind. We are not liable for any inaccuracies in educational content or for any disruptions in service.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Modifications</Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
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
