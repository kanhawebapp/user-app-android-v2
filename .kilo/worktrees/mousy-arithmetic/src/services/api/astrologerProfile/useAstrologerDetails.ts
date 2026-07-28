// import {useEffect, useState} from 'react';

// import {getAstrologerById} from './astrologer-details.api';

// import {AstrologerDetails} from './astrologer-details.types';

// export const useAstrologerDetails = (astrologerId?: string) => {
//   const [data, setData] = useState<AstrologerDetails | null>(null);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState<any>(null);

//   const fetchAstrologerDetails = async (id?: string) => {
//     try {
//       if (!id) {
//         return;
//       }

//       setLoading(true);

//       setError(null);

//       const res = await getAstrologerById(id);

//       setData(res || null);
//     } catch (err: any) {
//       console.log('ASTROLOGER DETAILS HOOK ERROR:', err);

//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (astrologerId) {
//       fetchAstrologerDetails(astrologerId);
//     }
//   }, [astrologerId]);

//   return {
//     data,

//     loading,

//     error,

//     refresh: () => fetchAstrologerDetails(astrologerId),

//     fetchAstrologerDetails,
//   };
// };


import {useEffect, useState} from 'react';

import {getAstrologerById} from './astrologer-details.api';

import {AstrologerDetails} from './astrologer-details.types';

export const useAstrologerDetails = (astrologerId?: string) => {
  const [data, setData] = useState<AstrologerDetails | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchAstrologerDetails = async (id?: string) => {
    try {
      if (!id) {
        return;
      }

      setLoading(true);

      setError(null);

      const res = await getAstrologerById(id);

      console.log(
        'HOOK FINAL ASTROLOGER DATA:',
        JSON.stringify(res, null, 2),
      );

      setData(res || null);
    } catch (error: any) {
      console.log(
        'GRAPHQL FULL ERROR:',
        JSON.stringify(error?.response?.data, null, 2),
      );

      console.log(
        'GRAPHQL ERRORS:',
        JSON.stringify(error?.response?.data?.errors, null, 2),
      );

      console.log(
        'GRAPHQL MESSAGE:',
        error?.response?.data?.errors?.[0]?.message,
      );

      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (astrologerId) {
      fetchAstrologerDetails(astrologerId);
    }
  }, [astrologerId]);

  return {
    data,

    loading,

    error,

    refresh: () => fetchAstrologerDetails(astrologerId),

    fetchAstrologerDetails,
  };
};

