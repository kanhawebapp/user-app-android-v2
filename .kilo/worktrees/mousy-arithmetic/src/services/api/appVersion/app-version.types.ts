// export type AppPlatform =
//   | 'ANDROID'
//   | 'IOS';

// export interface AppVersion {
//   id: string;

//   platform: AppPlatform;

//   latestVersion: string;

//   minimumVersion: string;

//   forceUpdate: boolean;

//   maintenanceMode: boolean;

//   maintenanceMessage: string;

//   playStoreUrl?: string | null;

//   appStoreUrl?: string | null;

//   releaseNotes?: string;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface GetAppVersionResponse {
//   getAppVersion: AppVersion;
// }


export type AppPlatform =
  | 'ANDROID'
  | 'IOS';

export interface AppVersion {
  id: string;

  platform: AppPlatform;

  latestVersion: string;

  minimumVersion: string;

  forceUpdate: boolean;

  maintenanceMode: boolean;

  maintenanceMessage: string;

  playStoreUrl?: string | null;

  appStoreUrl?: string | null;

  releaseNotes?: string;

  createdAt: string;

  updatedAt: string;
}

export interface GetAppVersionResponse {
  getAppVersion: AppVersion;
}
