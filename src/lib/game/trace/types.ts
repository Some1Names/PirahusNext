export type QType = "type" | "mcq";
export type Phase = "idle" | "playing" | "result" | "gameover";

export interface Question {
  code: string;
  answer: string;
  type: QType;
  choices?: string[];
  timeBonus: number;
  language: string;
}