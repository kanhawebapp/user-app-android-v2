
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Platform} from 'react-native';
import secureStorage from '../../storage/secure.storage';
import {STORAGE_KEYS} from '../../../constants/app.constants';

export const uploadImage = async (file: {
  uri: string;
  name: string;
  type: string;
}): Promise<string> => {
  try {
    // const token = store.getState().auth.token;
    const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const filePath =
      Platform.OS === 'android' ? file.uri.replace('file://', '') : file.uri;

    const res = await ReactNativeBlobUtil.fetch(
      'POST',
      'https://dhwaniastro.com/userAuth/graphql',
      {
        Authorization: `Bearer ${token}`,
        'x-apollo-operation-name': 'UploadImage',
      },
      [
        {
          name: 'operations',
          data: JSON.stringify({
            operationName: 'UploadImage',
            query: `
              mutation UploadImage($file: Upload!) {
                uploadImage(file: $file) {
                  url
                }
              }
            `,
            variables: {file: null},
          }),
        },
        {
          name: 'map',
          data: JSON.stringify({
            '0': ['variables.file'],
          }),
        },
        {
          name: '0',
          filename: file.name || `image_${Date.now()}.jpg`,
          type: file.type || 'image/jpeg',
          data: ReactNativeBlobUtil.wrap(filePath),
        },
      ],
    );

    const result = JSON.parse(res.data);

    console.log('UPLOAD RESULT:', result);

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.uploadImage.url;
  } catch (err: any) {
    console.log('❌ IMAGE UPLOAD ERROR:', err?.message || err);
    throw err;
  }
};
