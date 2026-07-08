export interface IMinigameRecordResponse {
  id: string;
  rank: number;
  timeTaken: number;
  score?: number | null;
  correctAnswers?: number | null;
  totalAnswers?: number | null;
  userId: string;
  username: string;
}
