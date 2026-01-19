import ImagePicker from 'react-native-image-crop-picker';
import { 
  pick, 
  types, 
  errorCodes, 
  isErrorWithCode 
} from '@react-native-documents/picker';
import { PermissionUtil } from '../utils/PermissionUtil';
import { getUniqueId } from '../utils/helperFunctions';

/**
 * Standardized file object for Enterprise Dynamic Form State
 */
export interface FileData {
  id: string;      
  uri: string;     
  type: string;    
  name: string;    
  size?: number;   
}

export class FileService {
  /**
   * Internal helper to wait for UI transitions.
   * Prevents crashes on iOS when opening a picker while a modal is closing.
   */
  private static async stabilityDelay(ms: number = 400): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), ms));
  }

  /**
   * For Photos: Handles Permission -> Camera/Gallery -> Cropping -> Format
   */
  public static async pickImage(source: 'camera' | 'gallery'): Promise<FileData | null> {
    const permission = source === 'camera' ? 'camera' : 'gallery';
    const isAllowed = await PermissionUtil.ensure(permission);
    
    if (!isAllowed) return null;

    // Proactive cleanup of previous temporary crops to save device storage
    await this.cleanUp();

    // Give the Modal/Bottom Sheet time to finish its closing animation
    await this.stabilityDelay();

    try {
      const options = {
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo' as const,
      };

      const result = source === 'camera' 
        ? await ImagePicker.openCamera(options)
        : await ImagePicker.openPicker(options);

      return {
        id: getUniqueId(),
        uri: result.path,
        type: result.mime,
        name: result.path.split('/').pop() || `img_${Date.now()}.jpg`,
        size: result.size,
      };
    } catch (error: any) {
      // image-crop-picker uses a string check for cancellations
      if (error.message?.includes('User cancelled')) return null;
      
      console.error('FileService Image Picker Error:', error);
      return null;
    }
  }

  /**
   * For Business Docs: No runtime permission required.
   */
  public static async pickDocument(): Promise<FileData | null> {
    await this.stabilityDelay();

    try {
      const [result] = await pick({
        type: [types.pdf, types.doc, types.docx, types.xls, types.xlsx],
      });

      return {
        id: getUniqueId(),
        uri: result.uri,
        type: result.type || 'application/octet-stream',
        name: result.name || 'document.pdf',
        size: result.size || undefined,
      };
    } catch (err: unknown) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return null;
      }
      
      console.error('FileService Document Picker Error:', err);
      return null;
    }
  }

  /**
   * Maintenance: Wipes the temporary crop cache.
   */
  public static async cleanUp() {
    try {
      await ImagePicker.clean();
    } catch {
      // Prefixed with underscore to satisfy ESLint no-unused-vars
      // Silently fail if there's nothing to clean
    }
  }
}