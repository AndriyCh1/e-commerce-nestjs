import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = 7;

  return await bcrypt.hash(password, rounds);
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
