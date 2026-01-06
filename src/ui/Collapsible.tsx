import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import imagePath from '../constants/imagePath';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';

interface SmartCollapsibleProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
}

export default function Collapsible({ title, children, containerStyle,headerStyle,bodyStyle }: SmartCollapsibleProps) {
  const open = useSharedValue(0);

  const [height, setHeight] = useState(0);
  const [measured, setMeasured] = useState(false);

  const toggle = () => {
    open.value = withTiming(open.value ? 0 : 1, { duration: 250 });
  };

  /** Animate height only */
  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      open.value,
      [0, 1],
      [0, height],
      Extrapolation.CLAMP
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${open.value * 180}deg` }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={[styles.header, headerStyle]} activeOpacity={0.7} onPress={toggle}>
        <AppText text={title} type="header" size="large" />
        <Animated.View style={iconStyle}>
          <Image source={imagePath.downArrow} style={styles.icon} />
        </Animated.View>
      </TouchableOpacity>

      {/* Visible animated content */}
      <Animated.View style={[styles.contentWrapper,bodyStyle, animatedStyle]}>
        <View style={styles.innerContent}>
          {children}
        </View>
      </Animated.View>

      {/* One-time measurement */}
      {!measured && (
        <View
          style={styles.measureView}
          pointerEvents="none"
          onLayout={(e) => {
            setHeight(e.nativeEvent.layout.height);
            setMeasured(true);
          }}
        >
          <View style={styles.innerContent}>
            {children}
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create(({ colors }) => ({
    container: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      overflow: 'hidden',
      marginVertical: 8,
    },
  
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: moderateScale(16),
    },
  
    icon: {
      tintColor: colors.typography,
    },
  
    contentWrapper: {
      overflow: 'hidden',
      backgroundColor:colors.grey25
    },
  
    innerContent: {
      padding: 0,
      margin: 0, // 🔥 prevents margin bleed
    },
  
    measureView: {
      position: 'absolute',
      opacity: 0,
      zIndex: -1,
      width: '100%',
    },
  }));
  
  /*====================================================== INCASE THERE IS A PROBLEM WITH THE ABOVE CODE ======================================================
  import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import imagePath from '../constants/imagePath';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';

interface SmartCollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, children }: SmartCollapsibleProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const open = useSharedValue(0);

  const toggle = () => {
    open.value = withTiming(open.value ? 0 : 1, { duration: 300 });
  };

  
  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      open.value,
      [0, 1],
      [0, contentHeight],
      Extrapolation.CLAMP
    ),
    opacity: open.value,
  }));

  
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${open.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggle}>
        <AppText text={title} type="header" size="large" />
        <Animated.View style={iconStyle}>
          <Image source={imagePath.infoIcon} style={styles.icon} />
        </Animated.View>
      </TouchableOpacity>

      
      <Animated.View style={[styles.contentWrapper, animatedStyle]}>
        <View style={styles.innerContent}>
          {children}
        </View>
      </Animated.View>

      
      <View
        style={styles.measureView}
        pointerEvents="none"
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && contentHeight !== h) {
            setContentHeight(h);
          }
        }}
      >
        <View style={styles.innerContent}>
          {children}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create(({ colors }) => ({
    container: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      overflow: 'hidden',
      marginVertical: 8,
    },
  
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: moderateScale(16),
    },
  
    icon: {
      tintColor: colors.typography,
    },
  
    contentWrapper: {
      overflow: 'hidden',
      backgroundColor: 'grey', // ✅ will be edge-to-edge
    },
  
    innerContent: {
      padding: 0,
      margin: 0, // 🔥 prevents margin leaks
    },
  
    measureView: {
      position: 'absolute',
      opacity: 0,
      zIndex: -1,
      width: '100%',
    },
  }));
  
  
  */