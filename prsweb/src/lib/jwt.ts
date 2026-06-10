import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  studentId: string;
  type: "mentor" | "mentee";
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as TokenPayload;
}
