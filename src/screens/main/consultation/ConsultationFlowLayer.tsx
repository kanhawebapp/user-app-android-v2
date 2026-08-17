import React, {useCallback, useState} from 'react';

import {
  ChatRequestData,
  ChatRequestModal,
  LoginRequiredModal,
} from '../../../components/Modal';
import {CHAT_CALL_LABELS} from '../../../constants/app.constants';
import {useAuthStore} from '../../../stores';
import {useConsultationFlow} from '../call/hooks/useConsultationFlow';

export type ConsultationType = 'chat' | 'call';

export interface ConsultationAstrologer {
  id: string;
  name: string;
  profilePic?: string;
  image?: string;
  rating?: any;
  experience?: any;
  skills?: any[];
  [key: string]: any;
}

export interface ConsultationFlowLayerApi {
  startChat: (astrologer: ConsultationAstrologer) => void;
  startCall: (astrologer: ConsultationAstrologer) => void;
  openLoginRequired: (message: string) => void;
  runIfAuthenticated: (message: string, callback: () => void) => void;
  selectedAstrologer: ConsultationAstrologer | null;
}

export interface ConsultationFlowLayerProps {
  children: (api: ConsultationFlowLayerApi) => React.ReactNode;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ConsultationFlowLayer: React.FC<ConsultationFlowLayerProps> = ({
  children,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToTab,
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [consultationType, setConsultationType] =
    useState<ConsultationType>('chat');
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<ConsultationAstrologer | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>(
    CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE,
  );
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);

  const {submitConsultationRequest, loading: consultationLoading} =
    useConsultationFlow({onNavigateToTab});

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    closeLoginModal();
    onNavigateToLogin?.();
  }, [closeLoginModal, onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    closeLoginModal();
    onNavigateToSignup?.();
  }, [closeLoginModal, onNavigateToSignup]);

  const closeChatRequestModal = useCallback(() => {
    setShowChatRequestModal(false);
    setSelectedAstrologer(null);
  }, []);

  const openChatRequestModal = useCallback(
    (type: ConsultationType, astrologer: ConsultationAstrologer) => {
      setConsultationType(type);
      setSelectedAstrologer(astrologer);
      setShowChatRequestModal(true);
    },
    [],
  );

  const openLoginRequired = useCallback((message: string) => {
    setModalMessage(message);
    setShowLoginModal(true);
  }, []);

  const runIfAuthenticated = useCallback(
    (message: string, callback: () => void) => {
      if (isAuthenticated) {
        callback();
        return;
      }

      openLoginRequired(message);
    },
    [isAuthenticated, openLoginRequired],
  );

  const startChat = useCallback(
    (astrologer: ConsultationAstrologer) => {
      runIfAuthenticated(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(
          astrologer.displayName || astrologer.name || 'Astrologer',
        ),
        () => openChatRequestModal('chat', astrologer),
      );
    },
    [openChatRequestModal, runIfAuthenticated],
  );

  const startCall = useCallback(
    (astrologer: ConsultationAstrologer) => {
      runIfAuthenticated(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(
          astrologer.displayName || astrologer.name || 'Astrologer',
        ),
        () => openChatRequestModal('call', astrologer),
      );
    },
    [openChatRequestModal, runIfAuthenticated],
  );

  const handleSubmit = useCallback(
    (formData: ChatRequestData) => {
      if (!selectedAstrologer) {
        return;
      }

      submitConsultationRequest({
        astrologer: selectedAstrologer,
        consultationType,
        formData,
        onClose: closeChatRequestModal,
      });
    },
    [
      selectedAstrologer,
      consultationType,
      submitConsultationRequest,
      closeChatRequestModal,
    ],
  );

  const api: ConsultationFlowLayerApi = {
    startChat,
    startCall,
    openLoginRequired,
    runIfAuthenticated,
    selectedAstrologer,
  };

  return (
    <>
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={closeLoginModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />

      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        astrologer={selectedAstrologer ?? undefined}
        loading={consultationLoading}
        onClose={closeChatRequestModal}
        onSubmit={handleSubmit}
      />

      {children(api)}
    </>
  );
};

export default ConsultationFlowLayer;
