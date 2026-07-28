import {useEffect, useRef} from 'react';

interface UseRechargeTriggerProps {
  timeLeft: number;
  socket: any;
  roomId: string;
  userId?: string;
  hasShownRecharge: boolean;
  setHasShownRecharge: (shown: boolean) => void;
  setShowRechargeModal: (show: boolean) => void;
}

export const useRechargeTrigger = ({
  timeLeft,
  socket,
  roomId,
  userId,
  hasShownRecharge,
  setHasShownRecharge,
  setShowRechargeModal,
}: UseRechargeTriggerProps) => {
  const hasShownRef = useRef(hasShownRecharge);

  // Keep ref in sync with state
  useEffect(() => {
    hasShownRef.current = hasShownRecharge;
  }, [hasShownRecharge]);

  useEffect(() => {
    if (timeLeft <= 60 && !hasShownRef.current) {
      console.log('Time reached 60 seconds, opening recharge modal');

      setShowRechargeModal(true);
      setHasShownRecharge(true);

      if (socket && roomId) {
        console.log('[EMIT] customer_recharge');
        socket.emit('customer_recharge', {
          roomId: roomId,
          userId: userId,
        });
      }
    }
  }, [
    timeLeft,
    socket,
    roomId,
    userId,
    setShowRechargeModal,
    setHasShownRecharge,
  ]);
};
