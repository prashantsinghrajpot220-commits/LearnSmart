import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { Spacing, BorderRadius } from '@/constants/theme';

interface FileUploadButtonProps {
  onPress: () => void;
  icon: string;
  label: string;
}

export default function FileUploadButton({ onPress, icon, label }: FileUploadButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
