import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from './ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export const HeaderComponent = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show header on some screens
  const hideOnScreens = ['/', '/auth', '/welcome', '/login', '/signup'];
  if (hideOnScreens.some(screen => pathname === screen || pathname.startsWith('/auth/'))) {
    return null;
  }

  const getPageTitle = (path: string) => {
    if (path === '/home' || path === '/home-12plus') return 'Dashboard';
    if (path === '/explore') return 'Explore';
    if (path === '/chat') return 'Smarty AI';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/lesson')) return 'Lesson';
    if (path.startsWith('/chapters')) return 'Chapters';
    return 'LearnSmart';
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.headerContent, 
        { 
          backgroundColor: colors.glass,
          borderBottomColor: colors.border
        }
      ]}>
        <View style={styles.leftSection}>
          {router.canGoBack() && !['/home', '/explore', '/chat', '/profile'].includes(pathname) ? (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => router.push('/home')}
            >
              <Image 
                source={require('@/assets/icon.png')} 
                style={styles.logo} 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {getPageTitle(pathname)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=User&background=9CAF88&color=fff' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      }
    })
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});

export default HeaderComponent;
