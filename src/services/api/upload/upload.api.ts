
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Platform} from 'react-native';
import secureStorage from '../../storage/secure.storage';
import {STORAGE_KEYS} from '../../../constants/app.constants';
import { API_BASE_URL } from '../../../constants/api.constants';
import {GRAPHQL_ENDPOINTS} from '../graphql.client';
import {UPLOAD_PROFILE_IMAGE, UPLOAD_CALL_RECORDING} from './upload.query';
import type {
  UploadFile,
  UploadProfileImageResult,
  UploadCallRecordingInput,
  UploadCallRecordingResult,
} from './upload.types';

const getGraphQLEndpoint = (): string =>
  GRAPHQL_ENDPOINTS[__DEV__ ? 'DEVELOPMENT' : 'PRODUCTION'];

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
      API_BASE_URL.DEVELOPMENT + 'userAuth/graphql',
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

export const uploadProfileImage = async (
  file: UploadFile,
): Promise<UploadProfileImageResult> => {
  try {
    const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const filePath =
      Platform.OS === 'android' ? file.uri.replace('file://', '') : file.uri;

    const res = await ReactNativeBlobUtil.fetch(
      'POST',
      getGraphQLEndpoint(),
      {
        Authorization: `Bearer ${token}`,
        'x-apollo-operation-name': 'UploadProfileImage',
      },
      [
        {
          name: 'operations',
          data: JSON.stringify({
            operationName: 'UploadProfileImage',
            query: UPLOAD_PROFILE_IMAGE,
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
          filename: file.name || `profile_${Date.now()}.jpg`,
          type: file.type || 'image/jpeg',
          data: ReactNativeBlobUtil.wrap(filePath),
        },
      ],
    );

    const result = JSON.parse(res.data);

    console.log('PROFILE IMAGE UPLOAD RESULT:', result);

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data?.uploadProfileImage) {
      throw new Error('No data returned from uploadProfileImage');
    }

    return result.data.uploadProfileImage;
  } catch (err: any) {
    console.log('❌ PROFILE IMAGE UPLOAD ERROR:', err?.message || err);
    throw err;
  }
};

/** Normalize RN file URIs like file:////data/... → /data/... + file:///data/... */
const normalizeRecordingUri = (
  uriOrPath: string,
): {path: string; uri: string} => {
  let path = (uriOrPath || '').trim();
  while (path.startsWith('file://')) {
    path = path.slice('file://'.length);
  }
  // Collapse accidental leading slashes to a single absolute path
  path = path.replace(/^\/+/, '/');
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return {
    path,
    uri: `file://${path}`,
  };
};

export const uploadCallRecording = async (
  input: UploadCallRecordingInput,
): Promise<UploadCallRecordingResult> => {
  try {
    const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const {recording, roomId, astroId, astroName, userId, duration, callType} =
      input;

    const {path: filePath} = normalizeRecordingUri(recording.uri);
    const filename =
      recording.name ||
      `call_recording_${Date.now()}.${Platform.OS === 'ios' ? 'm4a' : 'mp4'}`;
    const mimeType =
      recording.type ||
      (filename.endsWith('.m4a') ? 'audio/m4a' : 'audio/mp4');

    console.log('[UPLOAD_CALL_RECORDING] Variables', {
      roomId,
      astroId,
      astroName,
      userId,
      duration,
      callType,
      filename,
      mimeType,
      filePath,
    });

    const res = await ReactNativeBlobUtil.fetch(
      'POST',
      getGraphQLEndpoint(),
      {
        Authorization: `Bearer ${token}`,
        'x-apollo-operation-name': 'UploadCallRecording',
      },
      [
        {
          name: 'operations',
          data: JSON.stringify({
            operationName: 'UploadCallRecording',
            query: UPLOAD_CALL_RECORDING,
            variables: {
              recording: null,
              roomId,
              astroId,
              astroName,
              userId,
              duration,
              callType,
            },
          }),
        },
        {
          name: 'map',
          data: JSON.stringify({
            '0': ['variables.recording'],
          }),
        },
        {
          name: '0',
          filename,
          type: mimeType,
          data: ReactNativeBlobUtil.wrap(filePath),
        },
      ],
    );

    const result = JSON.parse(res.data);

    console.log('[UPLOAD_CALL_RECORDING] Response', {
      errors: result.errors,
      success: result.data?.uploadCallRecording?.success,
      message: result.data?.uploadCallRecording?.message,
      recordingId: result.data?.uploadCallRecording?.recording?.id,
      recordingUrl: result.data?.uploadCallRecording?.recording?.recordingUrl,
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data?.uploadCallRecording) {
      throw new Error('No data returned from uploadCallRecording');
    }

    return result.data.uploadCallRecording;
  } catch (err: any) {
    console.log(
      '[CallRecording] Upload failed:',
      err?.message || err,
    );
    throw err;
  }
};
