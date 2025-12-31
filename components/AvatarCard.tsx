import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { AvatarData } from '@/data/avatarStore';
import { useUserStore } from '@/store/userStore';
import { useTheme } from '@/components/ThemeContext';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AvatarCardProps {
  avatar: AvatarData;
  isUnlocked: boolean;
  isPurchased: boolean;
  onPurchase?: (avatar: AvatarData) => void;
  onSelect?: (avatar: AvatarData) => void;
  isSelected?: boolean;
  style?: any;
}

export default function AvatarCard({ 
  avatar, 
  isUnlocked, 
  isPurchased, 
  onPurchase, 
  onSelect, 
  isSelected = false,
  style 
}: AvatarCardProps) {
  const { colors } = useTheme();
  const { gamificationData, purchaseAvatar, setSelectedAvatar } = useUserStore();

  const handlePurchase = async () => {
    if (gamificationData.smartCoins < avatar.cost) {
      Alert.alert(
        'Insufficient SmartCoins',
        `You need ${avatar.cost - gamificationData.smartCoins} more SmartCoins to purchase this avatar.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const success = await purchaseAvatar(avatar.id, avatar.cost);
    if (success) {
      Alert.alert(
        'Avatar Unlocked! 🎉',
        `${avatar.name} has been added to your collection!`,
        [{ text: 'Great!' }]
      );
      onPurchase?.(avatar);
    }
  };

  const handleSelect = () => {
    if (isPurchased && onSelect) {
      setSelectedAvatar(avatar.id);
      onSelect(avatar);
    }
  };

  const styles = getStyles(colors, isSelected, isUnlocked, isPurchased);

  return (
    <View style={[styles.container, style]}>
      {/* Avatar Display */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <MaterialCommunityIcons name="check" size={16} color="white" />
          </View>
        )}
        {isPurchased && (
          <View style={styles.purchasedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Avatar Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>
          {avatar.name}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {avatar.description}
        </Text>
        
        {/* Cost or Status */}
        <View style={styles.actionContainer}>
          {isPurchased ? (
            <TouchableOpacity 
              style={[styles.selectButton, { backgroundColor: isSelected ? colors.primary : colors.primary + '40' }]}
              onPress={handleSelect}
            >
              <Text style={[styles.selectButtonText, { color: isSelected ? 'white' : colors.text }]}>
                {isSelected ? 'Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
          ) : isUnlocked ? (
            <TouchableOpacity 
              style={[styles.purchaseButton, { backgroundColor: gamificationData.smartCoins >= avatar.cost ? '#FFD700' : '#CCCCCC' }]}
              onPress={handlePurchase}
              disabled={gamificationData.smartCoins < avatar.cost}
            >
              <MaterialCommunityIcons name="currency-usd" size={16} color="#FFA500" />
              <Text style={[styles.purchaseButtonText, { color: gamificationData.smartCoins >= avatar.cost ? '#333' : '#666' }]}>
                {avatar.cost}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedContainer}>
              <MaterialCommunityIcons name="lock" size={16} color={colors.textSecondary} />
              <Text style={[styles.lockedText, { color: colors.textSecondary }]}>
                Locked
              </Text>
            </View>
          )}
        </View>

        {/* Unlock Condition */}
        {avatar.unlockCondition && !isUnlocked && (
          <Text style={[styles.unlockCondition, { color: colors.textSecondary }]}>
            {avatar.unlockCondition}
          </Text>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: any, isSelected: boolean, isUnlocked: boolean, isPurchased: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isSelected ? '#B2AC8820' : colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: isSelected ? 2 : 1,
    borderColor: isSelected ? '#B2AC88' : colors.lightGray,
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { elevation: 2 },
    }),
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchasedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  actionContainer: {
    alignItems: 'center',
  },
  selectButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 80,
  },
  purchaseButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginLeft: 4,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.lightGray + '50',
    borderRadius: BorderRadius.md,
  },
  lockedText: {
    fontSize: FontSizes.sm,
    marginLeft: 4,
  },
  unlockCondition: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});