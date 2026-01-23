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

  export const getFileTypeFromUri = (uri: string): string => {
    // 1. Check if the URI is empty
    if (!uri) return 'application/octet-stream';
  
    // 2. Extract the extension (everything after the last dot)
    const extension = uri.split('.').pop()?.toLowerCase();
  
    // 3. Map common extensions to MIME types
    const extensionMap: Record<string, string> = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Fallback
      txt: 'text/plain',
    };
  
    return extensionMap[extension || ''] || 'application/octet-stream';
  };