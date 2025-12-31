import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from './ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Breadcrumb {
  label: string;
  path: string;
}

interface BreadcrumbNavProps {
  paths: Breadcrumb[];
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ paths }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {paths.map((item, index) => {
          const isLast = index === paths.length - 1;
          return (
            <React.Fragment key={index}>
              <TouchableOpacity 
                onPress={() => !isLast && router.push(item.path as any)}
                disabled={isLast}
              >
                <Text style={[
                  styles.label, 
                  { color: isLast ? colors.primary : colors.textSecondary },
                  isLast && styles.activeLabel
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
              {!isLast && (
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={16} 
                  color={colors.textSecondary} 
                  style={styles.separator}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scrollContent: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
  },
  activeLabel: {
    fontWeight: '600',
  },
  separator: {
    marginHorizontal: 4,
  },
});

export default BreadcrumbNav;
