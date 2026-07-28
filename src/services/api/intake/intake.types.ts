export interface IntakeInput {
  astrologerId: string;
  name: string;
  countryCode: string;
  mobile: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  occupation?: string;
  requestType: 'chat' | 'call';
  source:string
}

export interface CreateIntakeResponse {
  intakeId: string;
  roomId: string;
  chatTime: number;
  __typename: string;
}

export interface CreateIntakePayload {
  createIntake: CreateIntakeResponse;
}
