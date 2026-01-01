import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useUserStore } from '@/store/userStore';
import { useXPStore, useCurrentRank } from '@/store/xpStore';
import { streakService } from '@/services/streakService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { AvatarDisplay, AvatarSelector } from '../components/AvatarSelector';
import Dropdown from '../components/Dropdown';
import CoinDisplay from '../components/CoinDisplay';
import RankBadge from '../components/RankBadge';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const {
    userName,
    setUserName,
    selectedClass,
    setSelectedClass,
    selectedAvatar,
    logout,
    gamificationData,
  } = useUserStore();
  
  const { currentXP } = useCurrentRank();
  const { totalLessonsRead, totalQuizzesCompleted } = useXPStore();
  const [streak, setStreak] = React.useState(0);
  
  const [editingName, setEditingName] = useState(userName);
  const router = useRouter();

  React.useEffect(() => {
    const getStreak = async () => {
      const s = await streakService.getStreak();
      setStreak(s);
    };
    getStreak();
  }, []);

  const handleSaveProfile = () => {
    setUserName(editingName);
    Alert.alert('Profile Updated', 'Your profile changes have been saved.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).concat(['12+']);

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <AvatarDisplay id={selectedAvatar} size={100} style={styles.avatarHeader} />
          <Text style={[styles.userName, { color: colors.text }]}>{userName || 'Student'}</Text>
          <Text style={[styles.userClass, { color: colors.textSecondary }]}>{selectedClass}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>✨</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{currentXP}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total XP</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{gamificationData.smartCoins}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>SmartCoins</Text>
          </View>
        </View>

        {/* Weekly Progress & Rank */}
        <View style={styles.weeklySection}>
          <View style={[styles.weeklyCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.weeklyHeader}>
              <Text style={[styles.weeklyTitle, { color: colors.text }]}>
                Weekly Progress
              </Text>
              <Text style={[styles.weeklySubtitle, { color: colors.textSecondary }]}>
                Resets Sunday at 12 AM
              </Text>
            </View>
            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStat}>
                <Text style={[styles.weeklyStatValue, { color: '#B2AC88' }]}>
                  {gamificationData.weeklyXP}
                </Text>
                <Text style={[styles.weeklyStatLabel, { color: colors.textSecondary }]}>
                  Weekly XP
                </Text>
              </View>
              <View style={styles.weeklyStat}>
                <RankBadge size="small" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
           <View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
              <Text style={[styles.miniStatText, { color: colors.text }]}>{totalLessonsRead} Lessons</Text>
           </View>
           <View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.miniStatText, { color: colors.text }]}>{totalQuizzesCompleted} Quizzes</Text>
           </View>
        </View>

        {/* Gamification Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Gamification</Text>
          
          <TouchableOpacity 
            style={[styles.actionItem, { borderBottomColor: colors.lightGray }]}
            onPress={() => router.push('/leaderboard')}
          >
            <View style={styles.actionLabelGroup}>
              <MaterialCommunityIcons name="trophy" size={24} color={colors.primary} />
              <View style={styles.actionTextContainer}>
                <Text style={[styles.actionLabel, { color: colors.text }]}>Leaderboard</Text>
                <Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                  See how you rank against others
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionItem, { borderBottomColor: colors.lightGray }]}
            onPress={() => router.push('/avatar-store')}
          >
            <View style={styles.actionLabelGroup}>
              <MaterialCommunityIcons name="store" size={24} color={colors.primary} />
              <View style={styles.actionTextContainer}>
                <Text style={[styles.actionLabel, { color: colors.text }]}>Avatar Store</Text>
                <Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                  Unlock new avatars with SmartCoins
                </Text>
              </View>
            </View>
            <View style={styles.actionRightContainer}>
              <CoinDisplay size="small" showLabel={false} />
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Edit Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Display Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.lightGray, backgroundColor: colors.cardBackground }]}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Dropdown
              label="Grade/Class"
              options={classes}
              value={selectedClass}
              onSelect={setSelectedClass}
              placeholder="Select Class"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Avatar</Text>
          <AvatarSelector />
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
            <View style={styles.settingLabelGroup}>
              <Feather name={isDark ? "moon" : "sun"} size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }}
              thumbColor={isDark ? colors.primary : '#F4F3F4'}
            />
          </View>

          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/privacy-policy')}>
            <Text style={[styles.linkLabel, { color: colors.text }]}>Privacy Policy</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/terms')}>
            <Text style={[styles.linkLabel, { color: colors.text }]}>Terms of Service</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/about')}>
            <Text style={[styles.linkLabel, { color: colors.text }]}>About LearnSmart</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/analytics')}>
            <Text style={[styles.linkLabel, { color: colors.text }]}>Analytics</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/weak-areas')}>
            <Text style={[styles.linkLabel, { color: colors.text }]}>Weak Areas</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Platform.select({ ios: 60, default: 20 }), // Combined with SafeAreaView
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatarHeader: {
    marginBottom: Spacing.md,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  userClass: {
    fontSize: FontSizes.md,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
    }),
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  weeklySection: {
    marginBottom: Spacing.lg,
  },
  weeklyCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  weeklyHeader: {
    marginBottom: Spacing.md,
  },
  weeklyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  weeklySubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: FontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  miniStatText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  actionLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    marginLeft: Spacing.md,
  },
  actionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  actionSublabel: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  actionRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    marginBottom: 5,
    marginLeft: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },
  saveButton: {
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FontSizes.md,
    marginLeft: Spacing.md,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  linkLabel: {
    fontSize: FontSizes.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  logoutText: {
    color: colors.error,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginLeft: Spacing.sm,
  },
  spacer: {
    height: 40,
  }
});
