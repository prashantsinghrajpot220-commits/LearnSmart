import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export const AVATARS = [
  { id: 'Robot', icon: 'robot', color: '#FF9F6D' },
  { id: 'Owl', icon: 'owl', color: '#9CAF88' },
  { id: 'Book', icon: 'book-open-variant', color: '#5D8AA8' },
  { id: 'Brain', icon: 'brain', color: '#9B7EBD' },
  { id: 'Star', icon: 'star', color: '#FFD700' },
];

export const AvatarDisplay = ({ id, size = 50, style }: { id: string, size?: number, style?: any }) => {
  const avatar = AVATARS.find(a => a.id === id) || AVATARS[0];
  return (
    <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: avatar.color + '20' }, style]}>
      <MaterialCommunityIcons name={avatar.icon as any} size={size * 0.6} color={avatar.color} />
    </View>
  );
};

export const AvatarSelector = () => {
  const { colors } = useTheme();
  const { selectedAvatar, setSelectedAvatar } = useUserStore();

  const renderItem = ({ item }: { item: typeof AVATARS[0] }) => {
    const isSelected = selectedAvatar === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.selectorItem,
          { borderColor: isSelected ? colors.primary : 'transparent' }
        ]}
        onPress={() => setSelectedAvatar(item.id)}
      >
        <AvatarDisplay id={item.id} size={60} />
        <Text style={[styles.avatarName, { color: colors.text, fontWeight: isSelected ? '700' : '400' }]}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={AVATARS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  },
  selectorItem: {
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  avatarCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  avatarName: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
});
