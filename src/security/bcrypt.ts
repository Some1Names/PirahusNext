import bcrypt from "bcryptjs";

export const comparePassword = (plain: string, hashed: string): boolean => {
  return bcrypt.compareSync(plain, hashed);
};

export const hashPassword = (plain: string): string => {
  return bcrypt.hashSync(plain, 10);
};
