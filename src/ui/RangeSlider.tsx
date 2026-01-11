import React, { useState } from 'react';
import { View, ViewStyle, LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  clamp, 
  interpolate,
  Extrapolation,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

interface SliderProps {
  style?: ViewStyle; 
  minimumValue?: number;
  maximumValue?: number;
  mode?: 'single' | 'range';
  initialValues?: number[];
  onChange?: (values: number[]) => void;
  allowDecimals?: boolean; 
}

const THUMB_SIZE = 24;
const ACTIVE_THUMB_SCALE = 1.2;

export default function ModernSlider({ 
  style, 
  minimumValue = 0, 
  maximumValue = 100, 
  mode = 'single',
  initialValues,
  onChange,
  allowDecimals = false 
}: SliderProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  
  const minPos = useSharedValue(0);
  const maxPos = useSharedValue(0);
  const isInitialized = useSharedValue(false);
  const activeHandle = useSharedValue<'none' | 'min' | 'max'>('none');

  const maxTravel = measuredWidth - THUMB_SIZE;

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width <= 0 || isInitialized.value) return;
    setMeasuredWidth(width);
    const travel = width - THUMB_SIZE;
    const startVal = initialValues?.[0] ?? minimumValue;
    const endVal = initialValues?.[1] ?? maximumValue;
    minPos.value = ((startVal - minimumValue) / (maximumValue - minimumValue)) * travel;
    maxPos.value = ((endVal - minimumValue) / (maximumValue - minimumValue)) * travel;
    isInitialized.value = true;
  };

  const pxToValue = (px: number) => {
    'worklet';
    if (maxTravel <= 0) return minimumValue;
    const val = interpolate(px, [0, maxTravel], [minimumValue, maximumValue], Extrapolation.CLAMP);
    return allowDecimals ? Math.round(val * 100) / 100 : Math.round(val);
  };

  const handleUpdate = () => {
    'worklet';
    if (onChange) {
      const v1 = pxToValue(minPos.value);
      const v2 = pxToValue(maxPos.value);
      scheduleOnRN(onChange, mode === 'range' ? [v1, v2] : [v1]);
    }
  };

  const combinedGesture = Gesture.Pan()
    .onStart((e) => {
      'worklet';
      if (mode === 'single') {
        activeHandle.value = 'min';
      } else {
        const distMin = Math.abs(e.x - minPos.value);
        const distMax = Math.abs(e.x - maxPos.value);
        if (Math.abs(minPos.value - maxPos.value) < 1) {
            activeHandle.value = 'none'; 
        } else {
            activeHandle.value = distMin < distMax ? 'min' : 'max';
        }
      }
    })
    .onChange((e) => {
      'worklet';
      if (!isInitialized.value) return;
      if (activeHandle.value === 'none') {
          if (e.changeX < 0) activeHandle.value = 'min';
          else if (e.changeX > 0) activeHandle.value = 'max';
          else return;
      }

      if (activeHandle.value === 'min') {
        const rightLimit = mode === 'range' ? maxPos.value : maxTravel;
        minPos.value = clamp(minPos.value + e.changeX, 0, rightLimit);
      } else {
        maxPos.value = clamp(maxPos.value + e.changeX, minPos.value, maxTravel);
      }
      handleUpdate();
    })
    .onEnd(() => {
      'worklet';
      activeHandle.value = 'none';
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: minPos.value },
      { scale: withTiming(activeHandle.value === 'min' ? ACTIVE_THUMB_SCALE : 1) }
    ],
    zIndex: activeHandle.value === 'min' ? 10 : 1,
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: maxPos.value },
      { scale: withTiming(activeHandle.value === 'max' ? ACTIVE_THUMB_SCALE : 1) }
    ],
    zIndex: activeHandle.value === 'max' ? 10 : 1,
    display: mode === 'range' ? 'flex' : 'none',
  }));

  const selectedTrackStyle = useAnimatedStyle(() => ({
    left: mode === 'range' ? minPos.value + THUMB_SIZE / 2 : 0,
    width: mode === 'range' 
      ? Math.max(0, maxPos.value - minPos.value)
      : minPos.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {/* 1. The Track Layer */}
      <View style={styles.track}>
        <Animated.View style={[styles.selectedTrack, selectedTrackStyle]} />
      </View>

      {/* 2. The Gesture/Thumb Layer */}
      <GestureDetector gesture={combinedGesture}>
        {/* Style this container to center thumbs vertically over the track */}
        <Animated.View style={styles.thumbsContainer}>
          <Animated.View style={[styles.thumb, minThumbStyle]} />
          {mode === 'range' && (
            <Animated.View style={[styles.thumb, maxThumbStyle]} />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  track: {
    height: 6,
    backgroundColor: theme.colors.border || '#E1E1E1',
    borderRadius: 3,
    width: '100%',
    position: 'absolute', // Keep track fixed in middle
  },
  selectedTrack: {
    height: '100%',
    backgroundColor: theme.colors.primaryBrand || '#007AFF',
    position: 'absolute',
  },
  thumbsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', // This aligns the thumbs vertically
    backgroundColor: 'transparent',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.primaryBrand || '#007AFF',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
}));