/**
 * CallStatusTextMapper
 * Maps call status enum values to UI display strings.
 * Centralizes all status text used across the call flow.
 */

export const getStatusText = (
  status: string,
  callDurationRemaining: number,
): string => {
  switch (status) {
    case 'calling':
      return 'Calling...';
    case 'ringing':
      return 'Incoming call...';
    case 'connecting':
    case 'connecting_webrtc':
    case 'creating_offer':
    case 'sending_offer':
    case 'waiting_answer':
      return 'Connecting...';
    case 'connected':
      return callDurationRemaining > 0
        ? formatDuration(callDurationRemaining)
        : 'Connected';
    case 'ended':
      return 'Call ended';
    case 'rejected':
      return 'Call rejected';
    default:
      return 'Connecting...';
  }
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
