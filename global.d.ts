/**
 * React Native runtimes commonly provide `alert()` (often wired to `Alert.alert`).
 * TypeScript/ESLint may not include it by default, so we declare it here.
 */
export {};

declare global {
  const alert: (...args: any[]) => void;
}


