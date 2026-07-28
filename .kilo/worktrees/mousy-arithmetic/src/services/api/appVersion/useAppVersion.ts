// import {useEffect, useState} from 'react';

// import {Platform} from 'react-native';

// import {getAppVersion} from './app-version.api';

// import {
//   AppPlatform,
//   AppVersion,
// } from './app-version.types';

// export const useAppVersion = () => {
//   const [data, setData] =
//     useState<AppVersion | null>(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState<any>(null);

//   const fetchAppVersion =
//     async () => {
//       try {
//         setLoading(true);

//         setError(null);

//         const currentPlatform: AppPlatform =
//           Platform.OS === 'ios'
//             ? 'IOS'
//             : 'ANDROID';

//         const res =
//           await getAppVersion(
//             currentPlatform,
//           );

//         setData(res || null);
//       } catch (err: any) {
//         console.log(
//           'APP VERSION HOOK ERROR:',
//           err,
//         );

//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//   useEffect(() => {
//     fetchAppVersion();
//   }, []);

//   return {
//     data,

//     loading,

//     error,

//     refresh: fetchAppVersion,
//   };
// };


import {useEffect, useState} from 'react';

import {Platform} from 'react-native';

import {getAppVersion} from './app-version.api';

import {
  AppPlatform,
  AppVersion,
} from './app-version.types';

export const useAppVersion = () => {
  const [data, setData] =
    useState<AppVersion | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchAppVersion =
    async () => {
      try {
        setLoading(true);

        setError(null);

        const currentPlatform: AppPlatform =
          Platform.OS === 'ios'
            ? 'IOS'
            : 'ANDROID';

        const res =
          await getAppVersion(
            currentPlatform,
          );

        setData(res || null);
      } catch (err: any) {
        console.log(
          'APP VERSION HOOK ERROR:',
          err,
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAppVersion();
  }, []);

  return {
    data,

    loading,

    error,

    refresh: fetchAppVersion,
  };
};