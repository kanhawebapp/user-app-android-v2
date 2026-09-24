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
import {uploadImage, uploadProfileImage} from './upload.api';
import type {UploadFile, UploadProfileImageResult} from './upload.types';
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

export const useUploadProfileImage = () => {
  const [loading, setLoading] = useState(false);

  const upload = async (
    file: UploadFile,
  ): Promise<UploadProfileImageResult> => {
    try {
      setLoading(true);

      const result = await uploadProfileImage(file);

      return result;
    } catch (error) {
      console.log('PROFILE IMAGE UPLOAD HOOK ERROR:', error);
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
