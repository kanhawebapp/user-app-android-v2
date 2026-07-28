import {useState, useCallback} from 'react';
import {Gift} from '../../../../services/api/gift/gift.types';
import {RechargePack} from '../../../../services/api/recharge/recharge.types';

interface SendGiftModalState {
  selectedGift: Gift | null;
  message: string;
  selectedPack: RechargePack | null;
  customAmount: string;
}

interface SendGiftModalActions {
  setSelectedGift: (gift: Gift | null) => void;
  setMessage: (message: string) => void;
  setSelectedPack: (pack: RechargePack | null) => void;
  setCustomAmount: (amount: string) => void;
  handleGiftSelect: (gift: Gift) => void;
  handlePackSelect: (pack: RechargePack) => void;
  resetGiftSelection: () => void;
  resetAll: () => void;
}

export const useSendGiftModal = (): SendGiftModalState & SendGiftModalActions => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState('');
  const [selectedPack, setSelectedPack] = useState<RechargePack | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleGiftSelect = useCallback((gift: Gift) => {
    setSelectedGift(gift);
  }, []);

  const handlePackSelect = useCallback((pack: RechargePack) => {
    setSelectedPack(pack);
    setCustomAmount('');
  }, []);

  const resetGiftSelection = useCallback(() => {
    setSelectedGift(null);
    setMessage('');
  }, []);

  const resetAll = useCallback(() => {
    setSelectedGift(null);
    setMessage('');
    setSelectedPack(null);
    setCustomAmount('');
  }, []);

  return {
    // State
    selectedGift,
    message,
    selectedPack,
    customAmount,
    // Actions
    setSelectedGift,
    setMessage,
    setSelectedPack,
    setCustomAmount,
    handleGiftSelect,
    handlePackSelect,
    resetGiftSelection,
    resetAll,
  };
};