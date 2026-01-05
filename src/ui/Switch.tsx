import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { StyleSheet,withUnistyles } from 'react-native-unistyles';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolateColor,
  Easing
} from "react-native-reanimated";
import { moderateScale } from "../theme/responsiveSize";


interface CustomSwitchProps {
  value?: boolean;
  onValueChange: (value: boolean, data?: any) => void;
  activeColor?: string;
  inactiveColor?: string;
  data?: any;
}

// Fixed Constants
const TRACK_WIDTH = moderateScale(36);
const TRACK_HEIGHT = moderateScale(19);
const THUMB_SIZE = moderateScale(13);
const PADDING = moderateScale(3);
const DISTANCE = TRACK_WIDTH - THUMB_SIZE - (PADDING * 2);

function CustomSwitch({ 
  value = false, 
  onValueChange,
  data={},
  activeColor = "#22c55e",
  inactiveColor = "#d1d5db"
}: CustomSwitchProps) {
  
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { 
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1) 
    });
  }, [value, progress]);

  const animatedTrack = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    )
  }));

  const animatedThumb = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * DISTANCE }]
  }));

  const handlePress = () => {
    onValueChange(!value, data);
  };
  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.track, animatedTrack]}>
        <Animated.View style={[styles.thumb, animatedThumb]} />
      </Animated.View>
    </Pressable>
  );
}

export default withUnistyles(CustomSwitch,theme=>({
  activeColor: theme.colors.primaryBrand,
  inactiveColor: theme.colors.grey100,
}));
const styles = StyleSheet.create(({ colors }) => ({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
    paddingHorizontal: PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.inverse,
    // Adding shadow for better UI depth
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
}));