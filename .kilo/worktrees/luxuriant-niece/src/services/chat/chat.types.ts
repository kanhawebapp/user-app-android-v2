import {CreateIntakeResponse} from '../api/intake/intake.types';
import {UserProfile} from '../api/profile/profile.types';

export interface ChatRequestInput {
  astrologerId: string;
  astrologerName?: string;
  userProfile: UserProfile;
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
  occupation?: string;
}

export interface ChatRequestResult {
  success: boolean;
  intakeResponse?: CreateIntakeResponse;
  socketEmitted?: boolean;
  error?: string;
}

export interface ChatRequestInput {
  astrologerId: string;
  astrologerName?: string;
  userProfile: UserProfile;
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
  occupation?: string;
  consultationType: 'chat' | 'call';
}

export interface ChatRequestResult {
  success: boolean;
  intakeResponse?: CreateIntakeResponse;
  socketEmitted?: boolean;
  error?: string;
  isCall?: boolean;
  callId?: string;
}