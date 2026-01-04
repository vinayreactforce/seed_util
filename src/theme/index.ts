// unistyles.d.ts (or unistylesConfig.ts if you prefer)
import { StyleSheet } from 'react-native-unistyles';
import { lightTheme, darkTheme } from './themesObj';

// Define breakpoints
const breakpoints = {
  phoneSm: 0,
  phone: 375,
  phoneLg: 430,
  tablet: 768,
} as const;

// Define types
type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

// Module augmentation
declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: {
    initialTheme: 'light',
    adaptiveThemes: false,
  },
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});
