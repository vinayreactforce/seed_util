import Geolocation from 'react-native-geolocation-service';
import { PermissionUtil } from '../utils/PermissionUtil';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Optimized functional fetcher. 
 * Lean, tree-shakable, and async-first.
 */
export const getCurrentLocation = async (
  options: Geolocation.GeoOptions = {}
): Promise<LocationData> => {
  // 1. Permission check (using your existing util)
  const hasPermission = await PermissionUtil.ensure('location');
  if (!hasPermission) {
    throw new Error('PERMISSION_DENIED');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(error.message || 'POSITION_ERROR'));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        ...options,
      }
    );
  });
};