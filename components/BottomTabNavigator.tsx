import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useRouter, usePathname } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 32;

const TABS = [
  { name: 'Home', icon: 'home-variant', path: '/home' },
  { name: 'Plan', icon: 'book-open-variant', path: '/personalized-plan' },
  { name: 'Forum', icon: 'forum', path: '/qa-forum' },
  { name: 'Chat', icon: 'message-bubble', path: '/chat' },
  { name: 'Community', icon: 'account-group', path: '/community' },
  { name: 'Notes', icon: 'microphone', path: '/voice-notes' },
  { name: 'Profile', icon: 'account', path: '/profile' },
];

const TAB_WIDTH = TAB_BAR_WIDTH / TABS.length;

export const BottomTabNavigator = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const translateX = useSharedValue(0);

  useEffect(() => {
    const activeIndex = TABS.findIndex((tab) => {
      const isHome = tab.path === '/home' && (pathname === '/home' || pathname === '/home-12plus');
      const isCommunity = tab.path === '/community' && (pathname === '/community' || pathname.startsWith('/group/'));
      const isForum = tab.path === '/qa-forum' && (pathname === '/qa-forum' || pathname.startsWith('/question-detail'));
      return pathname === tab.path || isHome || isCommunity || isForum;
    });
    if (activeIndex !== -1) {
      translateX.value = withSpring(activeIndex * TAB_WIDTH, {
        damping: 15,
        stiffness: 100
      });
    }
  }, [pathname, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  const hideOnScreens = ['/', '/auth', '/lesson', '/chapters', '/welcome', '/login', '/signup'];
  if (hideOnScreens.some(screen => pathname === screen || pathname.startsWith('/lesson/') || pathname.startsWith('/auth/'))) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.glass,
            borderColor: colors.border,
          }
        ]}
      >
        <Animated.View style={[
          styles.activeIndicator, 
          { 
            backgroundColor: colors.primary,
            width: TAB_WIDTH - 20,
            left: 10,
          }, 
          indicatorStyle
        ]} />
        
        {TABS.map((tab) => {
          const isHome = tab.path === '/home' && (pathname === '/home' || pathname === '/home-12plus');
          const isCommunity = tab.path === '/community' && (pathname === '/community' || pathname.startsWith('/group/'));
          const isForum = tab.path === '/qa-forum' && (pathname === '/qa-forum' || pathname.startsWith('/question-detail'));
          const isActive = pathname === tab.path || isHome || isCommunity || isForum;
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
                color={isActive ? colors.white : colors.textSecondary}
              />
              <Text style={[
                styles.tabLabel,
                { color: isActive ? colors.white : colors.textSecondary }
              ]}>
                {tab.name}
              </Text>
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
    paddingHorizontal: 0,
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
        backdropFilter: 'blur(10px)',
      }
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    height: 50,
    top: 10,
    borderRadius: 25,
    zIndex: 0,
  }
});

export default BottomTabNavigator;
