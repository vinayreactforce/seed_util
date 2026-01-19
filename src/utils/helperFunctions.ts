import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
export const getLineHeight = (fontSize: number): number => {
    // Formula: Headlines get ~1.2, Body gets ~1.5
    const multiplier = fontSize > 20 ? 1.2 : fontSize > 14 ? 1.4 : 1.5;
    return Math.round(fontSize * multiplier);
  };


  export const getUniqueId = (): string => {
    return uuidv4();
  };