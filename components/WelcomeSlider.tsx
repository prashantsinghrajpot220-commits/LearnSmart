import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
  Platform,
} from 'react-native';
import LottieView, { AnimationObject } from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface SlideData {
  id: string;
  title: string;
  animation: number | AnimationObject | { uri: string };
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Learn Faster',
    animation: require('@/assets/animations/rocket.json'),
  },
  {
    id: '2',
    title: 'Your AI Study Buddy',
    animation: require('@/assets/animations/robot.json'),
  },
  {
    id: '3',
    title: 'Ace Your Exams',
    animation: require('@/assets/animations/trophy.json'),
  },
];

const { width: screenWidth } = Dimensions.get('window');

export default function WelcomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    []
  );

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const renderSlide = ({ item }: { item: SlideData }) => {
    return (
      <View style={[styles.slide, { width: screenWidth }]}>
        <View style={styles.animationContainer}>
          <LottieView
            source={item.animation as AnimationObject}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        bounces={false}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              onPress={goToPrevious}
              disabled={currentIndex === 0}
              style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToNext}
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  animationContainer: {
    width: Platform.select({ web: 400, default: screenWidth * 0.7 }),
    height: Platform.select({ web: 400, default: screenWidth * 0.7 }),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingTop: Spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  navButtonDisabled: {
    borderColor: Colors.lightGray,
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});
