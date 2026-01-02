import { Animated } from 'react-native';
import { Tree } from '@/types/productivity';

export interface TreeGrowthStage {
  growthPercentage: number;
  scale: number;
  rotation: number;
  opacity: number;
  description: string;
}

export const TREE_GROWTH_STAGES: TreeGrowthStage[] = [
  { growthPercentage: 0, scale: 0.2, rotation: 0, opacity: 1, description: 'Seed planted' },
  { growthPercentage: 10, scale: 0.3, rotation: 0, opacity: 1, description: 'Sprouting' },
  { growthPercentage: 20, scale: 0.4, rotation: 5, opacity: 1, description: 'Small sapling' },
  { growthPercentage: 30, scale: 0.5, rotation: 0, opacity: 1, description: 'Growing' },
  { growthPercentage: 40, scale: 0.6, rotation: -5, opacity: 1, description: 'Getting taller' },
  { growthPercentage: 50, scale: 0.7, rotation: 0, opacity: 1, description: 'Half grown' },
  { growthPercentage: 60, scale: 0.8, rotation: 3, opacity: 1, description: 'Branches forming' },
  { growthPercentage: 70, scale: 0.85, rotation: 0, opacity: 1, description: 'Almost there' },
  { growthPercentage: 80, scale: 0.9, rotation: -3, opacity: 1, description: 'Nearly full' },
  { growthPercentage: 90, scale: 0.95, rotation: 0, opacity: 1, description: 'Almost mature' },
  { growthPercentage: 100, scale: 1.0, rotation: 0, opacity: 1, description: 'Fully grown!' },
];

export const getGrowthStage = (growth: number): TreeGrowthStage => {
  for (let i = TREE_GROWTH_STAGES.length - 1; i >= 0; i--) {
    if (growth >= TREE_GROWTH_STAGES[i].growthPercentage) {
      return TREE_GROWTH_STAGES[i];
    }
  }
  return TREE_GROWTH_STAGES[0];
};

export const interpolateGrowth = (
  growth: number
): {
  scale: number;
  rotation: string;
} => {
  const stage = getGrowthStage(growth);
  return {
    scale: stage.scale,
    rotation: `${stage.rotation}deg`,
  };
};

export const createGrowthAnimation = (currentGrowth: number, targetGrowth: number): Animated.CompositeAnimation => {
  const scaleValue = new Animated.Value(currentGrowth / 100);
  const rotationValue = new Animated.Value(0);

  const targetScale = targetGrowth / 100;

  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: targetScale,
      duration: 300,
      useNativeDriver: true,
    }),
  ]);
};

export const createTreeDeathAnimation = (): Animated.CompositeAnimation => {
  const opacityValue = new Animated.Value(1);
  const scaleValue = new Animated.Value(1);
  const rotationValue = new Animated.Value(0);

  return Animated.parallel([
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
  ]);
};

export const createTreeReviveAnimation = (): Animated.CompositeAnimation => {
  const scaleValue = new Animated.Value(0.2);
  const opacityValue = new Animated.Value(0);

  return Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
  ]);
};

export const getTreeColor = (treeType: Tree['type'], alive: boolean): string => {
  if (!alive) return '#8B7355'; // Brown for dead trees

  const colors: Record<Tree['type'], string> = {
    oak: '#4A6741',
    pine: '#2D5016',
    cherry: '#FFB7C5',
    willow: '#90EE90',
    maple: '#FF8C00',
  };
  return colors[treeType] || '#4A6741';
};

export const getTreeTrunkColor = (treeType: Tree['type']): string => {
  const colors: Record<Tree['type'], string> = {
    oak: '#8B4513',
    pine: '#654321',
    cherry: '#A0522D',
    willow: '#8B7355',
    maple: '#8B4513',
  };
  return colors[treeType] || '#8B4513';
};

export const calculateFocusScore = (
  studyTime: number,
  targetTime: number,
  treeSurvived: boolean
): number => {
  // Base score from time spent
  const timeScore = Math.min((studyTime / targetTime) * 60, 60);
  
  // Bonus for tree survival
  const treeBonus = treeSurvived ? 40 : 0;
  
  // Calculate total score (0-100)
  const totalScore = Math.round(timeScore + treeBonus);
  
  return Math.min(totalScore, 100);
};

export const getFocusScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent! 🌟';
  if (score >= 70) return 'Great job! 👏';
  if (score >= 50) return 'Good focus! 👍';
  if (score >= 30) return 'Keep going! 💪';
  return 'Start fresh! 🌱';
};

export const getFocusScoreColor = (score: number): string => {
  if (score >= 90) return '#4CAF50'; // Green
  if (score >= 70) return '#8BC34A'; // Light green
  if (score >= 50) return '#FFC107'; // Yellow
  if (score >= 30) return '#FF9800'; // Orange
  return '#F44336'; // Red
};
