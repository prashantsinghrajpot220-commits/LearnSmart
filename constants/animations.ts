import { Easing } from 'react-native-reanimated';

export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    stagger: 100,
  },
  easing: {
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
    accelerate: Easing.bezier(0.4, 0.0, 1, 1),
    bounce: Easing.bounce,
  },
  transitions: {
    fade: {
      duration: 300,
    },
    slide: {
      duration: 300,
    },
    scale: {
      duration: 200,
    },
  },
};

export default Animations;
