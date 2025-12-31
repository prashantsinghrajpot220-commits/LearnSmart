import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { Spacing, BorderRadius } from '@/constants/theme';

interface FilePreviewProps {
  name: string;
  onRemove: () => void;
}

export default function FilePreview({ name, onRemove }: FilePreviewProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <Text style={styles.icon}>📄</Text>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    maxWidth: 150,
  },
  icon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  name: {
    fontSize: 12,
    flex: 1,
  },
  removeButton: {
    marginLeft: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
