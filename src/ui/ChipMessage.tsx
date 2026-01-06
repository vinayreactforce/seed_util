import React from 'react';
import { View,  Image } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import CloseBtn from './CloseBtn';
import imagePath from '../constants/imagePath';
import AppText from './AppText';

interface ChipMessageProps {
  text: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
}

export default function ChipMessage({
  text,
  type = 'success',
  onClose,
}: ChipMessageProps) {
  // All logic is handled by Unistyles based on the 'type' variant
  styles.useVariants({ type });

  return (
    <View style={styles.container}>
        <Image source={imagePath.infoIcon} style={styles.icon} />
        <View style={styles.textContainer}>
      <AppText
        text={text}
        type="label"
        size="medium"
        textStyle={styles.label}
      />
      </View>

      {onClose && (
        <View style={styles.closeWrapper}>
          <CloseBtn variant="grey" onPress={onClose} circular={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    flexDirection: 'row',
    
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12, // Slightly more modern "squircle" look than full round
    alignSelf: 'flex-start',
    borderWidth: 1,
    variants: {
      type: {
        success: {
          backgroundColor: colors.success5,
          borderColor: colors.success10 
        },
        warning: {
          backgroundColor: colors.warning5,
          borderColor: colors.warning10 ,
        },
        error: {
          backgroundColor: colors.error5,
          borderColor: colors.error10
        },
        info: {
          backgroundColor: colors.info5,
          borderColor: colors.info10
        },
      },
    },
  },
  icon: {   
    marginRight: 8,
    width: 24,
    height: 24,
    alignSelf: 'center',
    variants: {
      type: {
        success: { tintColor: colors.success },
        warning: { tintColor: colors.warning100  },
        error: { tintColor: colors.red150  },
        info: { tintColor: colors.info },
      },
    },
  },
  label: {
    
    
    variants: {
      type: {
        success: { color: colors.success },
        warning: { color: colors.warning},
        error: { color: colors.red150},
        info: { color: colors.info},
      }
    },
  },
  closeWrapper: {
    marginLeft: 10,
    // Makes the close button slightly smaller to fit the chip height
    transform: [{ scale: 0.75 }],
  },
  textContainer: {
    flex: 1,
  },
}));
