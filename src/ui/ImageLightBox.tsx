import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  clamp 
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import CloseBtn from './CloseBtn'; // Your custom component

interface Props {
  uri: string | null;
  onClose: () => void;
  unistyles: {
    screen: { width: number; height: number };
    insets: { top: number };
  };
}

const ImageLightbox: React.FC<Props> = ({ uri, onClose, unistyles }) => {
  const { screen, insets } = unistyles;
  const [displayUri, setDisplayUri] = useState<string | null>(uri);

  useEffect(() => {
    if (uri) setDisplayUri(uri);
  }, [uri]);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetPosition = () => {
    'worklet';
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetPosition();
      } else {
        // Industry standard: cap zoom to avoid pixelation, save current scale
        if (scale.value > 5) {
          scale.value = withSpring(5);
          savedScale.value = 5;
        } else {
          savedScale.value = scale.value;
        }
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      // Toggle logic: If zoomed, reset. If 1x, zoom to 3x.
      if (scale.value > 1.1) {
        resetPosition();
      } else {
        const targetScale = 3;
        scale.value = withSpring(targetScale);
        savedScale.value = targetScale; 
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value <= 1.1) {
        translateY.value = e.translationY;
      } else {
        const maxOffsetX = (screen.width * (scale.value - 1)) / 2;
        const maxOffsetY = (screen.height * (scale.value - 1)) / 2;
        
        translateX.value = clamp(savedTranslateX.value + e.translationX, -maxOffsetX, maxOffsetX);
        translateY.value = clamp(savedTranslateY.value + e.translationY, -maxOffsetY, maxOffsetY);
      }
    })
    .onEnd((e) => {
      if (scale.value <= 1.1) {
        // Swipe-down to dismiss logic
        if (e.translationY > screen.height * 0.2) {
          scheduleOnRN(onClose);
        } else {
          resetPosition();
        }
      } else {
        // Update memory for the next pan start
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const composed = Gesture.Race(pinchGesture, Gesture.Simultaneous(panGesture, doubleTap));

  return (
    <Modal
      isVisible={!!uri}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      onModalHide={() => {
        resetPosition();
        setDisplayUri(null);
      }}
      style={styles.modal}
      backdropColor="black"
      backdropOpacity={0.9}
      useNativeDriverForBackdrop
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating
    >
      <GestureHandlerRootView style={styles.root}>
        {/* Integrating your custom CloseBtn with variant logic */}
        <Animated.View style={styles.closeButtonContainer(insets.top)}>
          <CloseBtn
            onPress={onClose} 
            circular={true} 
            variant="primary" 
            size="large"
            inverseTint
            
            // Force white for dark backdrop
          />
        </Animated.View>

        <GestureDetector gesture={composed}>
          <Animated.Image
            source={{ uri: displayUri ?? '' }}
            style={[styles.image(screen.width, screen.height), animatedStyle]}
            resizeMode="contain"
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create(() => ({
  modal: { margin: 0, justifyContent: 'center' },
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: (width: number, height: number) => ({
    width,
    height,
  }),
  closeButtonContainer: (topInset: number) => ({
    position: 'absolute',
    top: Platform.OS === 'ios' ? topInset + 10 : 20,
    right: 20,
    zIndex: 100, // Ensure it sits above the image
  }),
}));

export default withUnistyles(ImageLightbox, (_theme, rt) => ({
  unistyles: {
    screen: {
      width: rt.screen.width,
      height: rt.screen.height
    },
    insets: {
      top: rt.insets.top
    }
  }
}));