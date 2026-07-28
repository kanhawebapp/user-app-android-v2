import {useState, useCallback, useMemo} from 'react';
import {UsePhoneValidationProps, UsePhoneValidationReturn} from '../loginType';

export const usePhoneValidation = ({
  initialValue = '',
  minLength = 10,
  maxLength = 15,
}: UsePhoneValidationProps = {}): UsePhoneValidationReturn => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '');
      const truncated = cleaned.slice(0, maxLength);
      setPhoneNumber(truncated);

      if (error) {
        setError(null);
      }
    },
    [maxLength, error],
  );

  const isValid = useMemo(() => {
    return phoneNumber.length >= minLength;
  }, [phoneNumber, minLength]);

  const formattedPhone = useMemo(() => {
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `+91 ${phoneNumber}`;
    if (phoneNumber.length <= 6)
      return `+91 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    return `+91 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
      3,
      6,
    )} ${phoneNumber.slice(6)}`;
  }, [phoneNumber]);

  // Reset phone number
  const reset = useCallback(() => {
    setPhoneNumber('');
    setError(null);
  }, []);

  return {
    phoneNumber,
    setPhoneNumber,
    handlePhoneChange,
    isValid,
    error,
    formattedPhone,
    reset,
  };
};

export default usePhoneValidation;
