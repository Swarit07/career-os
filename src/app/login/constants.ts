export const PASSWORD_MIN = 10;

export type ActionState =
  | { error?: string; ok?: boolean; info?: string }
  | null;
