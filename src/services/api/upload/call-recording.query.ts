/**
 * GraphQL mutation for uploading an audio call recording.
 * Matches the web UPLOAD_CALL_RECORDING reference contract.
 * CallRecording exposes recordingUrl (not fileUrl).
 */
export const UPLOAD_CALL_RECORDING = `
mutation UploadCallRecording(
  $recording: Upload!
  $roomId: String!
  $astroId: String!
  $astroName: String!
  $userId: String!
  $duration: Int!
  $callType: String!
) {
  uploadCallRecording(
    recording: $recording
    roomId: $roomId
    astroId: $astroId
    astroName: $astroName
    userId: $userId
    duration: $duration
    callType: $callType
  ) {
    success
    message
    recording {
      id
      roomId
      astroId
      astroName
      userId
      duration
      callType
      recordingUrl
      createdAt
      updatedAt
    }
  }
}
`;
