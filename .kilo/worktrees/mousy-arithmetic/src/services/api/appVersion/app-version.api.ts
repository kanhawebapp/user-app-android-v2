// import {graphqlRequest} from '../graphql.client';

// import {
//   AppPlatform,
//   GetAppVersionResponse,
// } from './app-version.types';

// const GET_APP_VERSION = `
// query GetAppVersion($platform: Platform!) {
//   getAppVersion(platform: $platform) {

//     id

//     platform

//     latestVersion

//     minimumVersion

//     forceUpdate

//     maintenanceMode

//     maintenanceMessage

//     playStoreUrl

//     appStoreUrl

//     releaseNotes

//     createdAt

//     updatedAt
//   }
// }
// `;

// export const getAppVersion = async (
//   platform: AppPlatform,
// ) => {
//   try {
//     const response =
//       await graphqlRequest<GetAppVersionResponse>(
//         'GetAppVersion',
//         GET_APP_VERSION,
//         {
//           platform,
//         },
//       );

//     console.log(
//       'APP VERSION RESPONSE:',
//       JSON.stringify(
//         response,
//         null,
//         2,
//       ),
//     );

//     return response.getAppVersion;
//   } catch (error: any) {
//     console.log(
//       'GET APP VERSION ERROR:',
//       JSON.stringify(
//         error?.response?.data ||
//           error?.message ||
//           error,
//         null,
//         2,
//       ),
//     );

//     throw error;
//   }
// };



import {graphqlRequest} from '../graphql.client';

import {
  AppPlatform,
  GetAppVersionResponse,
} from './app-version.types';

export const getAppVersion = async (
  platform: AppPlatform,
) => {
  try {
    const GET_APP_VERSION = `
      query GetAppVersion {
        getAppVersion(platform: ${platform}) {
          id
          platform
          latestVersion
          minimumVersion
          forceUpdate
          maintenanceMode
          maintenanceMessage
          playStoreUrl
          appStoreUrl
          releaseNotes
          createdAt
          updatedAt
        }
      }
    `.replace(/\n/g, ' ');

    console.log(
      'FINAL QUERY:',
      GET_APP_VERSION,
    );

    const response =
      await graphqlRequest<GetAppVersionResponse>(
        'GetAppVersion',
        GET_APP_VERSION,
      );

    console.log(
      'APP VERSION RESPONSE:',
      JSON.stringify(
        response,
        null,
        2,
      ),
    );

    return response.getAppVersion;
  } catch (error: any) {
    console.log(
      'GET APP VERSION ERROR:',
      JSON.stringify(
        error?.response?.data ||
          error?.message ||
          error,
        null,
        2,
      ),
    );

    throw error;
  }
};

