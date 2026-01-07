import React, {  useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal'; // Swapped to community package
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';

import { StyleSheet } from 'react-native-unistyles';
import imagePath from '../constants/imagePath';
import AppText from './AppText';


// --- PULSE ANIMATION COMPONENT ---
// --- UPDATED PULSE ANIMATION COMPONENT ---
const PulseRing = ({ delay = 0 }: { delay?: number }) => {

    const animation = useSharedValue(0);
  
    useEffect(() => {
      const startAnimation = () => {
        // Changed duration from 2000 to 3000 for a slower, calmer wave
        animation.value = withRepeat(
          withTiming(1, { duration: 3000 }), 
          -1, 
          false
        );
      };
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }, [delay, animation]);
  
    const animatedStyle = useAnimatedStyle(() => ({
      // Reduced max scale from 2.5 to 1.8 to keep the circle from getting too big
      transform: [{ scale: interpolate(animation.value, [0, 1], [1, 1.8]) }],
      opacity: interpolate(animation.value, [0, 1], [0.4, 0], Extrapolation.CLAMP),
    }));
  
    return <Animated.View style={[styles.ring, animatedStyle]} />;
  };

// --- MAIN SCREEN & MODAL ---
export default function ConfirmationDialog({
  title = `Are you sure?`,
  message = `Your action will be irreversible.`,
  onConfirm,
  onCancel,
  isVisible,
}: {
  title?: string;
  message?:string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}) {
  return (
      <Modal 
        isVisible={isVisible}
        onBackdropPress={onCancel} // Close on tap outside
        onBackButtonPress={onCancel} // Android back button
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View style={styles.container}>
          {/* Animated Header Icon */}
          <View style={styles.iconWrapper}>
            <PulseRing delay={0} />
            <PulseRing delay={1000} />
            <View style={styles.iconCircle}>
            <Image
            source={imagePath.infoIcon}
            style={styles.infoIcon}
            />
            </View>
          </View>

          <AppText type='header' size="xlarge" style={styles.headerText} text={title} />  
          <AppText type='label' style={styles.bodyText} text={message} />  

          {/* Horizontal Buttons */}
          <View style={styles.buttonRow}>
            
            <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.button, styles.confirmBtn]} 
                onPress={onConfirm}
            >
              <Text style={styles.whiteText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
}

// --- UNISTYLES DEFINITION ---
const styles = StyleSheet.create(({colors, fontFamily}) => ({
  infoIcon: {
    width: 24,
    height: 24,
    tintColor: colors.primaryBrand,
  },
  container: {
    backgroundColor: colors.inverse,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    height: 90, // Reduced height
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50, // Reduced from 60
    height: 50, // Reduced from 60
    borderRadius: 25,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  ring: {
    position: 'absolute',
    width: 50, // Match the iconCircle size
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryBrand,
    zIndex: 1
  },
  headerText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 15,
    color:colors.placeholder,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmBtn: { backgroundColor:colors.primaryBrand },
  cancelBtn: { backgroundColor: colors.disabledBackground },
  whiteText: { color: '#FFF', fontFamily:fontFamily.semiBold, fontSize: 16 },
  cancelBtnText: { color: colors.grey350, fontFamily: fontFamily.semiBold, fontSize: 16 },
}));