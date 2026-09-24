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
