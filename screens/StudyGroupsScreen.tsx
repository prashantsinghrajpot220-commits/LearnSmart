import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import GroupCard from '@/components/GroupCard';
import { studyGroupService, type StudyGroup } from '@/services/StudyGroupService';

export default function StudyGroupsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [createVisible, setCreateVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupIcon, setGroupIcon] = useState('👥');
  const [isPrivate, setIsPrivate] = useState(true);

  const [joinCode, setJoinCode] = useState('');

  const refresh = useCallback(async () => {
    try {
      const myGroups = await studyGroupService.getMyGroups();
      setGroups(myGroups);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = studyGroupService.subscribeToGroups(() => {
      refresh();
    });
    return unsub;
  }, [refresh]);

  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const handleOpenGroup = (groupId: string) => {
    router.push(`/group/${groupId}` as any);
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        Alert.alert('Missing name', 'Please enter a group name.');
        return;
      }

      const group = await studyGroupService.createGroup({
        name: groupName,
        description: groupDescription || 'A study group for learning together.',
        icon: groupIcon || '👥',
        isPrivate,
      });

      setCreateVisible(false);
      setGroupName('');
      setGroupDescription('');
      setGroupIcon('👥');
      setIsPrivate(true);

      router.push(`/group/${group.id}` as any);
    } catch (error) {
      Alert.alert('Could not create group', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleJoinGroup = async () => {
    try {
      if (!joinCode.trim()) {
        Alert.alert('Missing code', 'Paste an invite code or group ID to join.');
        return;
      }

      const group = await studyGroupService.joinGroupByCode(joinCode);
      setJoinCode('');
      router.push(`/group/${group.id}` as any);
    } catch (error) {
      Alert.alert('Could not join group', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Study Groups</Text>
          <Text style={styles.subtitle}>Create a private group, chat, share notes and compete in quizzes.</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setCreateVisible(true)} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>+ Create Group</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.joinCard}>
          <Text style={styles.sectionTitle}>Join a group</Text>
          <Text style={styles.sectionSubtitle}>Enter an invite code or the group ID.</Text>
          <View style={styles.joinRow}>
            <TextInput
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="Invite code"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup} activeOpacity={0.85}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your groups</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading…</Text>
        ) : groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No groups yet</Text>
            <Text style={styles.emptySubtitle}>Create one and invite friends to start learning together.</Text>
          </View>
        ) : (
          groups.map((group) => (
            <GroupCard key={group.id} group={group} onPress={() => handleOpenGroup(group.id)} />
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal visible={createVisible} transparent animationType="fade" onRequestClose={() => setCreateVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create a Study Group</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g., Math Champs"
              placeholderTextColor={colors.textSecondary}
              style={styles.modalInput}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={groupDescription}
              onChangeText={setGroupDescription}
              placeholder="What will you study together?"
              placeholderTextColor={colors.textSecondary}
              style={[styles.modalInput, styles.multiline]}
              multiline
            />

            <Text style={styles.label}>Icon (emoji or image URL)</Text>
            <TextInput
              value={groupIcon}
              onChangeText={setGroupIcon}
              placeholder="👥"
              placeholderTextColor={colors.textSecondary}
              style={styles.modalInput}
              autoCapitalize="none"
            />

            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Text style={styles.label}>Private group</Text>
                <Text style={styles.switchHint}>Requires an invite code to join.</Text>
              </View>
              <Switch value={isPrivate} onValueChange={setIsPrivate} />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setCreateVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateGroup}>
                <Text style={styles.primaryButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingTop: 90,
      paddingHorizontal: Spacing.lg,
      paddingBottom: 120,
    },
    header: {
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      lineHeight: FontSizes.md * 1.4,
    },
    actionsRow: {
      flexDirection: 'row',
      marginBottom: Spacing.lg,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.md,
    },
    joinCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.lg,
    },
    sectionHeader: {
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },
    joinRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    input: {
      flex: 1,
      height: 48,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      color: colors.text,
      backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    },
    joinButton: {
      marginLeft: Spacing.md,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    joinButtonText: {
      color: '#FFFFFF',
      fontWeight: FontWeights.bold,
    },
    loadingText: {
      color: colors.textSecondary,
      paddingVertical: Spacing.md,
    },
    emptyState: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: FontSizes.sm * 1.4,
    },
    bottomSpacer: {
      height: Spacing.xl,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    modalCard: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    label: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      fontWeight: FontWeights.semibold,
      marginBottom: 6,
      marginTop: Spacing.sm,
    },
    modalInput: {
      height: 48,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      color: colors.text,
      backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    },
    multiline: {
      height: 90,
      paddingTop: Spacing.md,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.md,
    },
    switchMeta: {
      flex: 1,
      paddingRight: Spacing.md,
    },
    switchHint: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 4,
    },
    modalButtons: {
      flexDirection: 'row',
      marginTop: Spacing.lg,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      marginRight: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.md,
    },
  });
