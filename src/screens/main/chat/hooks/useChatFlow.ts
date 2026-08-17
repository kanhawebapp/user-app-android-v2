import { useCallback } from 'react';
import {
  navigate,
  goBack,
} from '../../../../services/navigation/NavigationService';
import { useChatStore } from '../../../../services/chat/chat.store';
import { useChatActions } from '../../../../services/chat';
import { useAuthStore } from '../../../../stores/auth.store';
import { useRechargeOrder } from '../../../../services/api/recharge/recharge.order.hooks';
import { useProfile } from '../../../../services/api/profile/profile.hooks';
import { openRazorpayCheckout } from '../../../../services/api/recharge/razorpay.service';
import { RechargePack } from '../../../../services/api/recharge/recharge.types';
import { socketService } from '../../../../services/socket/socket.service';
import { useCreateReview } from '../../../../services/api/createReview/useCreateReview';
import { useToast } from '../../../../context/ToastContext';

interface UseChatFlowProps {
  onBack?: () => void;
  onShowRatingModal: (show: boolean) => void;
  onShowThankYouModal: (show: boolean) => void;
  onShowRechargeModal: (show: boolean) => void;
  setHasShownRecharge: (shown: boolean) => void;
  onHideChatScreen?: () => void;
}

export const useChatFlow = ({
  onBack,
  onShowRatingModal,
  onShowThankYouModal,
  onShowRechargeModal,
  setHasShownRecharge,
  onHideChatScreen,
}: UseChatFlowProps) => {
  const user = useAuthStore(state => state.user);
  const walletBalance = user?.walletBalance || 85;
  const { showSuccess } = useToast();

  const { submitReview, loading } = useCreateReview();

  const { cancelChatRequest } = useChatActions();
  const resetChatStore = useChatStore(state => state.reset);
  const { createOrder } = useRechargeOrder();
  const { profile } = useProfile();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  }, [onBack]);

  const handleEndChat = useCallback(() => {
    onShowRatingModal(true);
  }, [onShowRatingModal]);

  // const handleRatingSubmit = async (astroId: any, star: any, comment: any) => {
  //   const response = await submitReview({
  //     astro_id: astroId,
  //     star: star,
  //     comment: comment,
  //   });
  //   if (response?.success) {
  //     showSuccess('Review submitted successfully');
  //   }
  //   onShowRatingModal(false);
  //   setTimeout(() => {
  //     onShowThankYouModal(true);
  //   }, 300);
  // };

  const handleRatingSubmit = async (
    astroId: any,
    star: any,
    comment: any,
  ) => {
    // Cover ChatScreen before the rating modal closes so it cannot flash
    // during the review request or the thank-you modal delay.
    onHideChatScreen?.();

    try {
      const response = await submitReview({
        astro_id: astroId,
        star,
        comment,
      });

      if (response?.success) {
        showSuccess('Review submitted successfully');
        onShowRatingModal(false);
        setTimeout(() => {
          onShowThankYouModal(true);
        }, 300);
        return;
      }

      console.warn('Review submission failed:', response);
      throw new Error('Review submission failed');
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleRecharge = useCallback(() => {
    console.log('Navigate to recharge wallet');
  }, []);

  const handleChatAgain = useCallback(() => {
  console.log('[ChatFlow] Chat Again');

  onShowThankYouModal(false);

  resetChatStore();

  onBack?.();
}, [resetChatStore, onShowThankYouModal, onBack]);

 const handleExit = useCallback(() => {
  // console.log('[ChatFlow] Exit chat');

  onShowThankYouModal(false);
  resetChatStore();

  if (onBack) {
    onBack();
    return;
  }

  navigate('Home');
}, [resetChatStore, onShowThankYouModal, onBack]);

  const handleEndChatPress = useCallback(() => {
    // console.log('[ChatScreen] End chat pressed');
    cancelChatRequest();
    onShowRatingModal(true);
  }, [cancelChatRequest, onShowRatingModal]);

  const handleProceedToPay = useCallback(
    async (selectedPack: RechargePack): Promise<void> => {
      // console.log('Proceeding to pay with pack:', selectedPack?.price);

     const order = await createOrder(String(selectedPack?.id));
      // console.log('ORDER CREATED:', order);

      try {
        const paymentResult = await openRazorpayCheckout({
          order,
          user: profile,
          selectedPack,
        });

        // console.log('PAYMENT SUCCESS:', paymentResult);
        // console.log('[Fallback] Closing modal after payment success');
        onShowRechargeModal(false);
        setHasShownRecharge(true);

        const socket = socketService.getSocket();
        const roomId = useChatStore.getState().roomId;
        const userId = user?.id;

        if (socket && roomId) {
          // console.log('[EMIT] customer_recharge_completed');
          (socket as any).emit('customer_recharge_completed', {
            roomId: roomId,
            userId: userId,
          });
        }
      } catch (error) {
        console.log('PAYMENT FAILED:', error);
        const socket = socketService.getSocket();
        const roomId = useChatStore.getState().roomId;
        const userId = user?.id;

        if (socket && roomId) {
          // console.log('[EMIT] customer_recharge_fail');
          (socket as any).emit('customer_recharge_fail', {
            roomId: roomId,
            userId: userId,
          });
        }
      }
    },
    [createOrder, profile, onShowRechargeModal, setHasShownRecharge, user],
  );

  return {
    walletBalance,
    handleEndChat,
    handleRatingSubmit,
    handleRecharge,
    handleChatAgain,
    handleExit,
    handleBack,
    handleEndChatPress,
    handleProceedToPay,
  };
};
