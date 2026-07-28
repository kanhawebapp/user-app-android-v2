import {useState, useCallback, useMemo} from 'react';
import type {
  Gender,
  FormErrors,
  DateOfBirthPickerValue,
  TimePickerValue,
} from '../types';

const GENDER_OPTIONS: {value: Gender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'other', label: 'Other'},
];

export const useChatRequestForm = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<DateOfBirthPickerValue>({
    day: '',
    month: '',
    year: '',
  });
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [birthTime, setBirthTime] = useState<TimePickerValue>({
    hour: '',
    minute: '',
    period: 'AM',
  });
  const [occupation, setOccupation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = useCallback(() => {
    setName('');
    setGender(null);
    setDateOfBirth({day: '', month: '', year: ''});
    setPlaceOfBirth('');
    setBirthTime({hour: '', minute: '', period: 'AM'});
    setOccupation('');
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!gender) {
      newErrors.gender = 'Please select gender';
    }
    if (!dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const day = parseInt(dateOfBirth.day, 10);
      const month = parseInt(dateOfBirth.month, 10);
      const year = parseInt(dateOfBirth.year, 10);

      if (day < 1 || day > 31) {
        newErrors.dateOfBirth = 'Invalid day';
      } else if (month < 1 || month > 12) {
        newErrors.dateOfBirth = 'Invalid month';
      } else if (year < 1900 || year > new Date().getFullYear()) {
        newErrors.dateOfBirth = 'Invalid year';
      }
    }
    if (!placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, gender, dateOfBirth, placeOfBirth]);

  const formatDateForApi = useCallback((): string => {
    const {day, month, year} = dateOfBirth;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, [dateOfBirth]);

  const formatTimeForApi = useCallback((): string => {
    const {hour, minute, period} = birthTime;
    if (!hour || !minute) return '00:00';

    let hourInt = parseInt(hour, 10);
    if (period === 'PM' && hourInt !== 12) {
      hourInt += 12;
    }
    if (period === 'AM' && hourInt === 12) {
      hourInt = 0;
    }

    return `${hourInt.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }, [birthTime]);

  const mapGenderToApi = useCallback((g: Gender): string => {
    switch (g) {
      case 'male':
        return 'MALE';
      case 'female':
        return 'FEMALE';
      default:
        return 'OTHER';
    }
  }, []);

  const formattedDateOfBirth = useMemo((): string => {
    const {day, month, year} = dateOfBirth;
    if (!day || !month || !year) return '';
    return `${day}/${month}/${year}`;
  }, [dateOfBirth]);

  const formattedBirthTime = useMemo((): string => {
    const {hour, minute, period} = birthTime;
    if (!hour || !minute) return '';
    return `${hour}:${minute} ${period}`;
  }, [birthTime]);

  return {
    name,
    setName,
    gender,
    setGender,
    dateOfBirth,
    setDateOfBirth,
    placeOfBirth,
    setPlaceOfBirth,
    birthTime,
    setBirthTime,
    occupation,
    setOccupation,
    errors,
    validate,
    resetForm,
    formatDateForApi,
    formatTimeForApi,
    mapGenderToApi,
    formattedDateOfBirth,
    formattedBirthTime,
    GENDER_OPTIONS,
  };
};
