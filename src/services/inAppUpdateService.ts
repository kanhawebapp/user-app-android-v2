import {
  DeviceEventEmitter,
  NativeModules,
  Platform,
  type EmitterSubscription,
} from 'react-native';
import {
  checkUpdateAvailability,
  onCompleteUpdate,
  startUpdateFlow,
  UpdateFlow,
} from '@gurukumparan/react-native-android-inapp-updates';

/** Play Core InstallStatus.DOWNLOADED */
const INSTALL_STATUS_DOWNLOADED = 11;

let isCheckInProgress = false;
let hasCheckedThisSession = false;
let statusSubscription: EmitterSubscription | null = null;
let onUpdateReady: (() => void) | null = null;

const isAndroidPlayUpdateSupported = (): boolean => {
  if (Platform.OS !== 'android') {
    return false;
  }

  return Boolean(NativeModules.AndroidInappUpdates);
};

const notifyUpdateReady = (): void => {
  onUpdateReady?.();
};

const handleInstallStatus = (status: unknown): void => {
  const numericStatus =
    typeof status === 'number' ? status : Number(status);

  if (numericStatus === INSTALL_STATUS_DOWNLOADED) {
    notifyUpdateReady();
  }
};

const ensureListeners = (): void => {
  if (!isAndroidPlayUpdateSupported()) {
    return;
  }

  if (!statusSubscription) {
    statusSubscription = DeviceEventEmitter.addListener(
      'installStatus',
      handleInstallStatus,
    );
  }
};

export const checkForUpdate = async (): Promise<boolean> => {
  try {
    if (!isAndroidPlayUpdateSupported()) {
      return false;
    }

    const result = await checkUpdateAvailability();
    return result === 'Update available';
  } catch {
    return false;
  }
};

export const startFlexibleUpdate = async (): Promise<boolean> => {
  try {
    if (!isAndroidPlayUpdateSupported()) {
      return false;
    }

    ensureListeners();
    await startUpdateFlow(UpdateFlow.FLEXIBLE, 0);
    return true;
  } catch {
    return false;
  }
};

export const completeUpdate = async (): Promise<boolean> => {
  try {
    if (!isAndroidPlayUpdateSupported()) {
      return false;
    }

    await onCompleteUpdate();
    return true;
  } catch {
    return false;
  }
};

export const requestInAppUpdate = async (): Promise<void> => {
  if (
    !isAndroidPlayUpdateSupported() ||
    isCheckInProgress ||
    hasCheckedThisSession
  ) {
    return;
  }

  isCheckInProgress = true;
  hasCheckedThisSession = true;

  try {
    ensureListeners();
    const updateAvailable = await checkForUpdate();

    if (!updateAvailable) {
      return;
    }

    await startFlexibleUpdate();
  } catch {
    // Play Store, debug APKs, offline devices, and unsupported devices
    // must never interrupt normal app use.
  } finally {
    isCheckInProgress = false;
  }
};

export const subscribeToUpdateReady = (callback: () => void): (() => void) => {
  onUpdateReady = callback;
  ensureListeners();

  return () => {
    if (onUpdateReady === callback) {
      onUpdateReady = null;
    }
  };
};
