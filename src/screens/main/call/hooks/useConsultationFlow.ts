import {useState, useRef, useCallback} from 'react';

import {useAuthStore} from '../../../../stores';
import {useToast} from '../../../../context/ToastContext';
import {useChatStore} from '../../../../services/chat/chat.store';
import {sendChatRequest} from '../../../../services/chat/chat.service';

type ConsultationType = 'chat' | 'call';

interface SubmitParams {
  astrologer: any;
  consultationType: ConsultationType;
  formData: any;
  onClose?: () => void;
}

export const useConsultationFlow = ({onNavigateToTab}: any = {}) => {
  const user = useAuthStore(state => state.user);

  const {showSuccess, showError} = useToast();

  const [loading, setLoading] = useState(false);

  const submitLockRef = useRef(false);

  const submitConsultationRequest = useCallback(
    async ({astrologer, consultationType, formData, onClose}: SubmitParams) => {
      if (!astrologer) {
        return {success: false};
      }

      if (submitLockRef.current) {
        return {success: false};
      }

      submitLockRef.current = true;
      setLoading(true);

      try {
        const result = await sendChatRequest({
          astrologerId: astrologer.id,
          astrologerName:
            astrologer.displayName || astrologer.name || 'Astrologer',

          userProfile: {
            id: user?.id || '',
            name: user?.name || '',
            mobile: user?.mobile || '',
            countryCode: user?.countryCode || '',
            profilePic: user?.profilePic || '',
            gender: user?.gender || 'male',
            birthDate: user?.dateOfBirth || '',
            birthTime: user?.birthTime || '',
            occupation: (user as any)?.occupation || '',
          },

          name: formData.name,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          placeOfBirth: formData.placeOfBirth,
          birthTime: formData.birthTime,
          occupation: formData.occupation || (user as any)?.occupation || '',
          consultationType,
        });

        console.log('[ConsultationFlow] Request result:', result);

        if (!result.success) {
          const errorMessage = result?.error || 'Something went wrong';

          console.log('[ConsultationFlow] Intake failed:', errorMessage);
          console.log('[ConsultationFlow] Stopping preparation loader');

          showError(errorMessage);
          onClose?.();

          return {
            success: false,
            error: errorMessage,
          };
        }

        const {isCall} = result;

        onClose?.();

        // CALL FLOW — mirror chat: return immediately; global queue +
        // AppContent opens Call when callStore reaches 'calling'.
        if (isCall) {
          console.log(
            '[ConsultationFlow] Call request sent — awaiting global queue/ready',
          );
          onNavigateToTab?.('chatCall');
          return {
            success: true,
          };
        }

        // CHAT FLOW
        useChatStore.getState().setSelectedAstrologer({
          id: astrologer.id,
          name: astrologer.displayName || astrologer.name || 'Astrologer',
          image: astrologer.profilePic || astrologer.image,
          rating: astrologer.rating,
          experience: String(astrologer.experience),
          skills: astrologer.skills,
          isAvailableForChat: true,
        });

        onNavigateToTab?.('chatCall');

        return {
          success: true,
        };
      } catch (error: any) {
        const errorMessage =
          error?.message || error?.error || 'Something went wrong';

        console.error('[ConsultationFlow] Request error:', error);
        console.log('[ConsultationFlow] Intake failed:', errorMessage);
        console.log('[ConsultationFlow] Stopping preparation loader');

        showError(errorMessage);
        onClose?.();

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        console.log('[ConsultationFlow] Stopping preparation loader');
        submitLockRef.current = false;
        setLoading(false);
      }
    },
    [user, onNavigateToTab, showSuccess, showError],
  );

  return {
    loading,
    submitConsultationRequest,
  };
};
