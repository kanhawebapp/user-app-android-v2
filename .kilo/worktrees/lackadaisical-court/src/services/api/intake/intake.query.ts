export const CREATE_INTAKE = `
mutation CreateIntake($input: IntakeInput!) {
  createIntake(input: $input) {
    intakeId
    roomId
    chatTime
    __typename
  }
}
`;
