export interface UploadImageResponse {
  uploadImage: {
    url: string;
    __typename?: string;
  };
}

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export interface UploadProfileImageResult {
  success: boolean;
  message: string;
  url: string;
  filename: string;
  user: {
    id: string;
    profileImage: string;
    __typename?: string;
  };
  __typename?: string;
}

export interface UploadProfileImageResponse {
  uploadProfileImage: UploadProfileImageResult;
}

export interface UploadCallRecordingInput {
  recording: UploadFile;
  roomId: string;
  astroId: string;
  astroName: string;
  userId: string;
  duration: number;
  callType: string;
}

export interface UploadCallRecordingDetails {
  id?: string;
  roomId?: string;
  astroId?: string;
  astroName?: string;
  userId?: string;
  duration?: number;
  callType?: string;
  recordingUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadCallRecordingResult {
  success: boolean;
  message: string;
  recording?: UploadCallRecordingDetails | null;
}

export interface UploadCallRecordingResponse {
  uploadCallRecording: UploadCallRecordingResult;
}
