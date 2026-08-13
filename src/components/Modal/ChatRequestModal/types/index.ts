export interface ChatRequestData {
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
  occupation?: string;
}

export interface ChatRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ChatRequestData) => void;
  astrologer?: Astrologer;
  loading?: boolean;
}

export interface Astrologer {
  id: string;
  name: string;
  displayName?: string;
  profilePic?: string;
  rating?: number;
  price?: number;
}

export type Gender = 'male' | 'female' | 'other';

export interface DateOfBirthPickerValue {
  day: string;
  month: string;
  year: string;
}

export interface TimePickerValue {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

export interface FormErrors {
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
}
