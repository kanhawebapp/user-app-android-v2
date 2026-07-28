import {useState, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';

/**
 * useCallPermissions
 *
 * Handles runtime RUNTIME permission requests for the call screen.
 *
 * On Android, `RECORD_AUDIO` permission is requested before any call action.
 * On iOS, permission is considered granted by default.
 */
export const useCallPermissions = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );

  const checkAndRequestAudioPermission =
    useCallback(async (): Promise<boolean> => {
      if (Platform.OS !== 'android' || !PermissionsAndroid) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      console.log('[PERMISSION] RECORD_AUDIO:', granted);
      const allowed = granted === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionGranted(allowed);
      return allowed;
    }, []);

  return {permissionGranted, checkAndRequestAudioPermission};
};
