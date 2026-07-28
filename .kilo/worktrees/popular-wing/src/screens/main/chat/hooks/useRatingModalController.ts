import {useEffect, useRef, useCallback} from 'react';

interface UseRatingModalControllerProps {
  chatStatus: string;
  onShowRatingModal: (show: boolean) => void;
}

export const useRatingModalController = ({
  chatStatus,
  onShowRatingModal,
}: UseRatingModalControllerProps) => {
  const ratingModalShownRef = useRef(false);
  const prevChatStatusRef = useRef(chatStatus);
  const isFirstRender = useRef(true);

  // Reset flag when chat becomes active
  useEffect(() => {
    if (chatStatus === 'active') {
      ratingModalShownRef.current = false;
      prevChatStatusRef.current = 'active';
    }
  }, [chatStatus]);
  
  // Handle chat status changes to show rating modal
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevChatStatusRef.current = chatStatus;
      return;
    }

    const prevStatus = prevChatStatusRef.current;

    if (
      !ratingModalShownRef.current &&
      (chatStatus === 'completed' || chatStatus === 'rejected') &&
      (prevStatus === 'active' ||
        prevStatus === 'queued' ||
        prevStatus === 'waiting')
    ) {
      ratingModalShownRef.current = true;
      onShowRatingModal(true);
    }

    prevChatStatusRef.current = chatStatus;
  }, [chatStatus, onShowRatingModal]);

  const resetRatingModalFlag = useCallback(() => {
    ratingModalShownRef.current = false;
  }, []);

  return {resetRatingModalFlag};
};
