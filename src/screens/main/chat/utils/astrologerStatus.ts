export interface AstrologerStatusParams {
  isOnline?: boolean;
  isBusy?: boolean;
  isChatActive?: boolean;
  isCallActive?: boolean;
  isLiveActive?: boolean;
}

export const getAstrologerStatus = (
  astrologer: any,
) => {
  const isOnline = astrologer?.isOnline ?? false;
  const isBusy = astrologer?.isBusy ?? false;

  const isChatActive = astrologer?.isChatActive ?? false;
  const isCallActive = astrologer?.isCallActive ?? false;
  const isLiveActive = astrologer?.isLiveActive ?? false;

  const canChat =
    isOnline &&
    // !isBusy &&
    isChatActive;

  const canCall =
    isOnline &&
    // !isBusy &&
    isCallActive;

  const canGoLive =
    isOnline &&
    // !isBusy &&
    isLiveActive;

  let status = 'offline';
  let color = '#9CA3AF';

  if (isOnline && !isBusy) {
    status = 'online';
    color = '#10B981';
  }

  if (isOnline && isBusy) {
    status = 'busy';
    color = '#F59E0B';
  }

  return {
    status,
    color,

    isOnline,
    isBusy,

    canChat,
    canCall,
    canGoLive,
  };
};