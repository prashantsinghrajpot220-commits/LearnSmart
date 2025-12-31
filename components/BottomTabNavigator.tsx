import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useRouter, usePathname } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'Home', icon: 'home-variant', path: '/home' },
  { name: 'Explore', icon: 'compass', path: '/explore' },
  { name: 'Chat', icon: 'message-bubble', path: '/chat' },
  { name: 'Profile', icon: 'account', path: '/profile' },
];

export const BottomTabNavigator = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  // Determine if we should show the tab bar
  const hideOnScreens = ['/', '/auth', '/lesson', '/chapters'];
  if (hideOnScreens.some(screen => pathname === screen || pathname.startsWith('/lesson/'))) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(245, 241, 232, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          }
        ]}
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/home' && pathname === '/home-12plus');
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handlePress(tab.path)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.tabLabel,
                { color: isActive ? colors.primary : colors.textSecondary }
              ]}>
                {tab.name}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      }
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  }
});
