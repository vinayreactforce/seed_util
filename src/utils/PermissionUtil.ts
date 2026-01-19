import { Platform, Alert } from 'react-native';
import {
  check,
  request as requestPermission,
  PERMISSIONS,
  RESULTS,
  openSettings,
  Permission,
} from 'react-native-permissions';

export type AppPermission =
  | 'camera'
  | 'gallery'
  | 'notifications'
  | 'location'
  | 'documents';

const PERMISSION_LABELS: Record<AppPermission, string> = {
  camera: 'Camera',
  gallery: 'Photo Library',
  notifications: 'Notifications',
  location: 'Location Services',
  documents: 'Documents',
};

class PermissionService {
  private getNativePermission(type: AppPermission): Permission | null {
    const isAndroid = Platform.OS === 'android';
    const apiLevel = Platform.Version as number;

    if (isAndroid) {
      switch (type) {
        case 'camera':
          return PERMISSIONS.ANDROID.CAMERA;
        case 'gallery':
          return apiLevel >= 33
            ? (PERMISSIONS.ANDROID as any).READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        case 'notifications':
          return apiLevel >= 33
            ? (PERMISSIONS.ANDROID as any).POST_NOTIFICATIONS
            : null;
        case 'location':
          // In enterprise apps, FINE_LOCATION is usually preferred for accuracy
          return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        case 'documents':
          // Corrected: Android logic only here.
          // Use READ_EXTERNAL_STORAGE for API 32 and below.
          // API 33+ usually doesn't need a specific permission for DocumentPicker.
          return apiLevel < 33
            ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            : null;
        default:
          return null;
      }
    }

    // iOS Mapping
    switch (type) {
      case 'camera':
        return PERMISSIONS.IOS.CAMERA;
      case 'gallery':
        return PERMISSIONS.IOS.PHOTO_LIBRARY;
      case 'location':
        return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      case 'notifications':
        return null; // iOS notifications handled via FCM/Messaging libraries
      case 'documents':
        return PERMISSIONS.IOS.MEDIA_LIBRARY;
      default:
        return null;
    }
  }

  public async ensure(type: AppPermission): Promise<boolean> {
    const permission = this.getNativePermission(type);
    if (!permission) return true;

    try {
      const status = await check(permission);

      switch (status) {
        case RESULTS.GRANTED:
        case RESULTS.LIMITED:
          return true;
        case RESULTS.DENIED:
          const result = await requestPermission(permission);
          return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
        case RESULTS.BLOCKED:
          this.showSettingsAlert(type);
          return false;
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'Not Available',
            `The ${PERMISSION_LABELS[type]} feature is not available on this device.`,
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Permission error [${type}]`, error);
      return false;
    }
  }

  private showSettingsAlert(type: AppPermission) {
    Alert.alert(
      'Permission Required',
      `Please enable ${PERMISSION_LABELS[type]} access in Settings to continue.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ],
    );
  }
}

export const PermissionUtil = new PermissionService();
