import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useUserStore } from '@/store/userStore';
import { useXPStore } from '@/store/xpStore';
import { 
  AVATAR_STORE, 
  AvatarData, 
  getAvatarsByCategory,
  isAvatarUnlocked 
} from '@/data/avatarStore';
import AvatarCard from '@/components/AvatarCard';
import CoinDisplay from '@/components/CoinDisplay';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AvatarStoreScreen() {
  const { colors } = useTheme();
  const { gamificationData, selectedAvatar } = useUserStore();
  const { currentXP } = useXPStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | AvatarData['category']>('all');

  const categories: Array<{ id: string; name: string; icon: string }> = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'robot', name: 'Robots', icon: 'robot' },
    { id: 'animal', name: 'Animals', icon: 'paw' },
    { id: 'character', name: 'Characters', icon: 'account' },
    { id: 'fantasy', name: 'Fantasy', icon: 'magic-wand' },
  ];

  const getFilteredAvatars = () => {
    if (selectedCategory === 'all') {
      return AVATAR_STORE;
    }
    return getAvatarsByCategory(selectedCategory);
  };

  const getAvatarStatus = (avatar: AvatarData) => {
    const isUnlocked = isAvatarUnlocked(
      avatar.id, 
      useXPStore.getState().getRank().name,
      { totalLessonsRead: 0, totalQuizzesCompleted: 0 }
    ) || gamificationData.unlockedAvatars.includes(avatar.id);
    
    const isPurchased = gamificationData.purchasedAvatars.includes(avatar.id);
    
    return { isUnlocked, isPurchased };
  };

  const handleAvatarSelect = (avatar: AvatarData) => {
    Alert.alert(
      'Avatar Selected!',
      `${avatar.name} is now your active avatar.`,
      [{ text: 'Great!' }]
    );
  };

  const renderAvatarItem = ({ item }: { item: AvatarData }) => {
    const { isUnlocked, isPurchased } = getAvatarStatus(item);
    const isSelected = selectedAvatar === item.id;

    return (
      <AvatarCard
        avatar={item}
        isUnlocked={isUnlocked}
        isPurchased={isPurchased}
        isSelected={isSelected}
        onPurchase={handleAvatarSelect}
        onSelect={handleAvatarSelect}
      />
    );
  };

  const renderCategoryButton = (category: typeof categories[0]) => {
    const isSelected = selectedCategory === category.id;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          { 
            backgroundColor: isSelected ? colors.primary : colors.cardBackground,
            borderColor: colors.primary 
          }
        ]}
        onPress={() => setSelectedCategory(category.id as any)}
      >
        <MaterialCommunityIcons 
          name={category.icon as any} 
          size={20} 
          color={isSelected ? 'white' : colors.text} 
        />
        <Text style={[
          styles.categoryButtonText,
          { color: isSelected ? 'white' : colors.text }
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Avatar Store
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your learning companion
        </Text>
        
        {/* Coin Balance */}
        <View style={styles.balanceContainer}>
          <CoinDisplay size="medium" animated={true} />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Avatar Grid */}
      <FlatList
        data={getFilteredAvatars()}
        renderItem={renderAvatarItem}
        keyExtractor={(item) => item.id}
        style={styles.avatarList}
        contentContainerStyle={styles.avatarListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No avatars found in this category
            </Text>
          </View>
        }
      />

      {/* Bottom Info */}
      <View style={[styles.infoContainer, { backgroundColor: colors.cardBackground }]}>
        <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Earn SmartCoins by completing lessons and quizzes to unlock new avatars!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  balanceContainer: {
    marginTop: Spacing.sm,
  },
  categoryContainer: {
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginLeft: 6,
  },
  avatarList: {
    flex: 1,
  },
  avatarListContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    marginLeft: Spacing.sm,
  },
});