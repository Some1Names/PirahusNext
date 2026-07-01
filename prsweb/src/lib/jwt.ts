import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  studentId: string;
  role: "admin" | "mentor" | "mentee";
  point: number;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, SECRET) as TokenPayload;
  return payload;
}
