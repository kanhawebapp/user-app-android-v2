export const UPLOAD_PROFILE_IMAGE = `
mutation UploadProfileImage($file: Upload!) {
  uploadProfileImage(file: $file) {
    success
    message
    url
    filename
    user {
      id
      profileImage
    }
  }
}
`;