import {graphqlRequest} from '../graphql.client';
import {CREATE_INTAKE} from './intake.query';
import {
  IntakeInput,
  CreateIntakeResponse,
  CreateIntakePayload,
} from './intake.types';

export const createIntake = async (
  input: IntakeInput,
): Promise<CreateIntakeResponse> => {
  // console.log("CreateIntakePayload",CreateIntakePayload)
  try {
    const response = await graphqlRequest<CreateIntakePayload>(
      'CreateIntake',
      CREATE_INTAKE,
      {input},
    );

    if (!response?.createIntake) {
      throw new Error('Invalid CreateIntake response');
    }

    return response.createIntake;
  } catch (error: any) {
    console.log('❌ CREATE INTAKE API ERROR:', error?.message || error);
    throw error;
  }
};
