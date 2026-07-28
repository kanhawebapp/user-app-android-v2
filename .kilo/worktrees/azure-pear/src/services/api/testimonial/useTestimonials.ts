// import {useEffect, useState} from 'react';

// import {getTestimonials} from './testimonial.api';

// import {Testimonial} from './testimonial.types';

// export const useTestimonials = () => {
//   const [data, setData] = useState<
//     Testimonial[]
//   >([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState<any>(null);

//   const fetchTestimonials = async () => {
//     try {
//       setLoading(true);

//       setError(null);

//       const res =
//         await getTestimonials();

//       setData(res || []);
//     } catch (err: any) {
//       console.log(
//         'TESTIMONIAL HOOK ERROR:',
//         err,
//       );

//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, []);

//   return {
//     data,

//     loading,

//     error,

//     refresh: fetchTestimonials,
//   };
// };

import {useEffect, useState} from 'react';

import {getTestimonials} from './testimonial.api';

import {Testimonial} from './testimonial.types';

export const useTestimonials = () => {
  const [data, setData] = useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(0);

  const [error, setError] = useState<any>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await getTestimonials();

      setData(res?.data || []);

      setTotalCount(res?.totalCount || 0);
    } catch (err: any) {
      console.log('TESTIMONIAL HOOK ERROR:', err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    data,

    totalCount,

    loading,

    error,

    refresh: fetchTestimonials,
  };
};
