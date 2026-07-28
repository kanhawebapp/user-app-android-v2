/**
 * Profile Types - TypeScript definitions for progressive profiling
 * Manages profile completion state and field requirements
 */

// Profile field types that can be collected
export type ProfileFieldKey =
  | 'name'
  | 'email'
  | 'dateOfBirth'
  | 'birthTime'
  | 'birthPlace'
  | 'gender'
  | 'languagePreference';

// Feature types that require specific profile fields
export type FeatureType =
  | 'kundli'
  | 'chat'
  | 'call'
  | 'live'
  | 'matchmaking'
  | 'remedies'
  | 'wallet'
  | 'profile_edit';

// Profile field definition
export interface ProfileField {
  key: ProfileFieldKey;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'date' | 'time' | 'select' | 'email';
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    errorMessage?: string;
  };
  options?: {label: string; value: string}[]; // For select type
}

// Feature requirements - what fields are needed for each feature
export interface FeatureRequirement {
  feature: FeatureType;
  requiredFields: ProfileFieldKey[];
  optionalFields: ProfileFieldKey[];
  reason: string; // Why these fields are needed
  priority: 'low' | 'medium' | 'high';
}

// Profile completion state
export interface ProfileCompletionState {
  completedFields: ProfileFieldKey[];
  totalFields: ProfileFieldKey[];
  percentage: number;
  lastUpdated: string | null;
}

// Pending profile request from feature usage
export interface PendingProfileRequest {
  id: string;
  feature: FeatureType;
  requiredFields: ProfileFieldKey[];
  optionalFields: ProfileFieldKey[];
  reason: string;
  callback?: () => void; // What to do after profile is completed
}

// Profile update payload
export interface ProfileUpdatePayload {
  [key: string]: string | undefined;
}

// Profile field configurations
export const PROFILE_FIELDS: ProfileField[] = [
  {
    key: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    type: 'text',
    validation: {
      minLength: 2,
      maxLength: 50,
      errorMessage: 'Name must be between 2 and 50 characters',
    },
  },
  {
    key: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: false,
    type: 'email',
    validation: {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      errorMessage: 'Please enter a valid email address',
    },
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
    placeholder: 'Select your date of birth',
    required: true,
    type: 'date',
  },
  {
    key: 'birthTime',
    label: 'Birth Time',
    placeholder: 'Select your birth time',
    required: true,
    type: 'time',
  },
  {
    key: 'birthPlace',
    label: 'Birth Place',
    placeholder: 'Enter your birth place',
    required: true,
    type: 'text',
    validation: {
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Please enter a valid birth place',
    },
  },
  {
    key: 'gender',
    label: 'Gender',
    placeholder: 'Select your gender',
    required: false,
    type: 'select',
    options: [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
      {label: 'Other', value: 'other'},
      {label: 'Prefer not to say', value: 'prefer_not_to_say'},
    ],
  },
  {
    key: 'languagePreference',
    label: 'Preferred Language',
    placeholder: 'Select your preferred language',
    required: false,
    type: 'select',
    options: [
      {label: 'English', value: 'en'},
      {label: 'Hindi', value: 'hi'},
      {label: 'Tamil', value: 'ta'},
      {label: 'Telugu', value: 'te'},
      {label: 'Bengali', value: 'bn'},
      {label: 'Marathi', value: 'mr'},
      {label: 'Gujarati', value: 'gu'},
      {label: 'Kannada', value: 'kn'},
      {label: 'Malayalam', value: 'ml'},
      {label: 'Punjabi', value: 'pa'},
    ],
  },
];

// Feature requirements mapping
export const FEATURE_REQUIREMENTS: FeatureRequirement[] = [
  {
    feature: 'kundli',
    requiredFields: ['dateOfBirth', 'birthTime', 'birthPlace'],
    optionalFields: ['name'],
    reason: 'To generate your Kundli (birth chart), we need your birth details',
    priority: 'high',
  },
  {
    feature: 'matchmaking',
    requiredFields: ['dateOfBirth', 'birthTime', 'birthPlace'],
    optionalFields: ['name', 'gender'],
    reason: "For matchmaking, we need both partners' birth details",
    priority: 'high',
  },
  {
    feature: 'chat',
    requiredFields: [],
    optionalFields: ['name'],
    reason: 'Personalize your chat experience',
    priority: 'low',
  },
  {
    feature: 'call',
    requiredFields: [],
    optionalFields: ['name'],
    reason: 'Personalize your call experience',
    priority: 'low',
  },
  {
    feature: 'live',
    requiredFields: [],
    optionalFields: ['name'],
    reason: 'Personalize your live session experience',
    priority: 'low',
  },
  {
    feature: 'remedies',
    requiredFields: ['dateOfBirth'],
    optionalFields: ['name', 'birthPlace'],
    reason: 'Recommend personalized remedies based on your birth chart',
    priority: 'medium',
  },
  {
    feature: 'wallet',
    requiredFields: [],
    optionalFields: ['email'],
    reason: 'For payment receipts and transaction history',
    priority: 'low',
  },
  {
    feature: 'profile_edit',
    requiredFields: [],
    optionalFields: ['name', 'email', 'gender', 'languagePreference'],
    reason: 'Update your profile information',
    priority: 'low',
  },
];

// Get fields required for a specific feature
export const getFieldsForFeature = (
  feature: FeatureType,
): ProfileFieldKey[] => {
  const requirement = FEATURE_REQUIREMENTS.find(r => r.feature === feature);
  if (!requirement) {
    return [];
  }
  return [...requirement.requiredFields, ...requirement.optionalFields];
};

// Check if user has all required fields for a feature
export const hasRequiredFields = (
  completedFields: ProfileFieldKey[],
  feature: FeatureType,
): boolean => {
  const requirement = FEATURE_REQUIREMENTS.find(r => r.feature === feature);
  if (!requirement) {
    return true;
  }

  return requirement.requiredFields.every(field =>
    completedFields.includes(field),
  );
};

// Get missing fields for a feature
export const getMissingFields = (
  completedFields: ProfileFieldKey[],
  feature: FeatureType,
): ProfileFieldKey[] => {
  const requirement = FEATURE_REQUIREMENTS.find(r => r.feature === feature);
  if (!requirement) {
    return [];
  }

  return requirement.requiredFields.filter(
    field => !completedFields.includes(field),
  );
};

// Calculate profile completion percentage
export const calculateCompletionPercentage = (
  completedFields: ProfileFieldKey[],
  totalFields: ProfileFieldKey[],
): number => {
  if (totalFields.length === 0) {
    return 100;
  }
  const completed = completedFields.filter(f => totalFields.includes(f));
  return Math.round((completed.length / totalFields.length) * 100);
};

export default {
  PROFILE_FIELDS,
  FEATURE_REQUIREMENTS,
  getFieldsForFeature,
  hasRequiredFields,
  getMissingFields,
  calculateCompletionPercentage,
};
