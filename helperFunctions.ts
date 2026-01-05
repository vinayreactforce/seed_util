export const getLineHeight = (fontSize: number): number => {
    // Formula: Headlines get ~1.2, Body gets ~1.5
    const multiplier = fontSize > 20 ? 1.2 : fontSize > 14 ? 1.4 : 1.5;
    return Math.round(fontSize * multiplier);
  };