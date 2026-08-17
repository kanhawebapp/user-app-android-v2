import {useState, useRef, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

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
  const navigation = useNavigation<any>();

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
          astrologerName: astrologer.displayName || astrologer.name || 'Astrologer',

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
          showError(
            result.error ||
              'Unable to connect with astrologer. Please try again.',
          );

          return {
            success: false,
          };
        }

        showSuccess('Connecting you with astrologer...');

        const {isCall, isQueued, callId} = result;

        // CLOSE MODAL ONLY AFTER SUCCESS
        onClose?.();

        // ==========================
        // CALL FLOW
        // ==========================
        if (isCall) {
          if (isQueued) {
            console.log('[ConsultationFlow] Call queued');

            onNavigateToTab?.('chatCall');

            return {
              success: true,
            };
          }

          console.log('[ConsultationFlow] Direct call navigation');

          navigation.navigate('Call', {
            callId: callId || `call_${Date.now()}`,
            participant: {
              id: astrologer.id,
              name: astrologer.displayName || astrologer.name || 'Astrologer',
              image: astrologer.profilePic,
            },
            isIncoming: false,
          });

          return {
            success: true,
          };
        }

        // ==========================
        // CHAT FLOW
        // ==========================
        useChatStore.getState().setSelectedAstrologer({
          id: astrologer.id,
          name: astrologer.displayName || astrologer.name || 'Astrologer',
          image: astrologer.profilePic,
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
        console.error('[ConsultationFlow] Request error:', error);

        showError(
          error?.message ||
            'Unable to connect with astrologer. Please try again.',
        );

        return {
          success: false,
        };
      } finally {
        submitLockRef.current = false;
        setLoading(false);
      }
    },
    [user, navigation, onNavigateToTab, showSuccess, showError],
  );

  return {
    loading,
    submitConsultationRequest,
  };
};
