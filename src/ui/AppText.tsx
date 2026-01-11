import React from 'react';
import { Text, TextStyle,TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { moderateScale } from '../theme/responsiveSize';

interface Props {
  text: string;
  type?: 'header' | 'label' | 'body' | 'placeholder';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  color?: 'primary' | 'error' | 'success' | 'brand';
  style?: TextStyle;
}
export default function AppText({ text, type = 'body',size,color,style={}, ...props }: Props & TextProps) {
  styles.useVariants({ type, size, color });
  return <Text {...props} style={[styles.textRoot, style]}>{text}</Text>;
}

const styles = StyleSheet.create(
  ({ textSizeVariants, fontFamily, colors }) => ({
    textRoot: {
      fontSize: textSizeVariants.bodyMedium,
      fontFamily: fontFamily.regular,
      color: colors.primaryText,
      variants: {
        // ROLE: Controls the "Feel" and "Weight"
        type: {
          header: { 
            fontFamily: fontFamily.bold, 
            color: colors.heading 
          },
          label: { 
            fontFamily: fontFamily.semiBold, 
            color: colors.labelText // Salesforce labels are usually a softer gray
          },
          body: { 
            fontFamily: fontFamily.regular, 
            color: colors.valueText 
          },
          placeholder: {
            fontFamily: fontFamily.regular, 
            color: colors.placeholder 
          }
        },
      
        // SIZE: Controls the "Scale"
        size: {
          xsmall: {
            fontSize: moderateScale(11),
            lineHeight: moderateScale(14),
          },
          small: {
            fontSize: moderateScale(12),
            lineHeight: moderateScale(16),
          },
          medium: {
            fontSize: moderateScale(14),
            lineHeight: moderateScale(20),
          },
          large: {
            fontSize: moderateScale(16),
            lineHeight: moderateScale(22),
          },
          xlarge: {
            fontSize: moderateScale(20),
            lineHeight: moderateScale(26),
          },
          xxlarge: {
            fontSize: moderateScale(24),
            lineHeight: moderateScale(30),
          }
        },
      
        // COLOR: For specific overrides
        color: {
          primary: { color: colors.primaryBrand },
          error: { color: colors.error },
          success: { color: colors.success },
          brand: { color: colors.primaryBrand }
        }
      }
    },
  }),
);
