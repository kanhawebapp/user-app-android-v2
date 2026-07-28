// import { useState } from 'react';
// import { uploadUserImage } from './upload.api';

// export const useUploadUserImage = () => {
//   const [loading, setLoading] = useState(false);

//   const upload = async (file: {
//     uri: string;
//     name: string;
//     type: string;
//   }) => {
//     try {
//       setLoading(true);

//       const url = await uploadUserImage(file);

//       return url;
//     } catch (error) {
//       console.log('UPLOAD HOOK ERROR:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     upload,
//     loading,
//   };
// };

import {useState} from 'react';
import {uploadImage} from './upload.api';
// import { uploadImage } from './upload.api';

export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);

  const upload = async (file: {uri: string; name: string; type: string}) => {
    try {
      setLoading(true);

      const url = await uploadImage(file);

      return url;
    } catch (error) {
      console.log('UPLOAD HOOK ERROR:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    upload,
    loading,
  };
};
