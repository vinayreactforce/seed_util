import React, { useState, useRef, useEffect, memo } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  FadeInDown,
  ZoomOut,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';

const BlinkingCursor = () => {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 450 }), withTiming(1, { duration: 450 })),
      -1, true
    );
  }, [opacity]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.cursor, animatedStyle]} />;
};

interface OTPInputProps {
  cellCount?: number;
  onCodeFilled: (code: string) => void;
  onCodeChange?: (code: string) => void;
}

const OTPInput = ({ cellCount = 4, onCodeFilled, onCodeChange }: OTPInputProps) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setValue(numericText);
    onCodeChange?.(numericText);
    if (numericText.length === cellCount) onCodeFilled(numericText);
  };

  const handleCellPress = (index: number) => {
    const newValue = value.slice(0, index);
    setValue(newValue);
    onCodeChange?.(newValue);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cellsRow}>
        {Array(cellCount).fill(0).map((_, index) => {
          const char = value[index] || '';
          const isCurrent = index === value.length && isFocused;
          const isFilled = !!char;

          return (
            <Pressable 
              key={index} 
              onPress={() => handleCellPress(index)}
              style={[
                styles.cell, 
                isCurrent && styles.activeCell,
                isFilled && styles.filledCell
              ]}
            >
              {isFilled && (
                <Animated.View 
                  entering={FadeInDown.duration(200)} 
                  exiting={ZoomOut.duration(200)}
                >
                  <AppText text={char} type="header" size="large" />
                </Animated.View>
              )}
              {isCurrent && <BlinkingCursor />}
            </Pressable>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        maxLength={cellCount}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        caretHidden={true}
      />
    </View>
  );
};

export default memo(OTPInput);

const styles = StyleSheet.create(({ colors }) => ({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: moderateScale(20) },
  cellsRow: { flexDirection: 'row', gap: moderateScale(12) },
  cell: {
    width: moderateScale(55),
    height: moderateScale(64),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  activeCell: { borderColor: colors.primaryBrand, backgroundColor: colors.primaryBrand + '05' },
  filledCell: { borderColor: colors.typography },
  cursor: {
    position: 'absolute',
    width: 2,
    height: moderateScale(28),
    backgroundColor: colors.primaryBrand,
    borderRadius: 1,
  },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
}));