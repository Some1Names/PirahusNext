import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  studentId: string;
  type: "mentor" | "mentee";
  role: "admin" | "mentor" | "mentee";
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, SECRET) as TokenPayload;
  if (!payload.role) {
    payload.role = payload.type === "mentor" ? "mentor" : "mentee";
  }
  return payload;
}
