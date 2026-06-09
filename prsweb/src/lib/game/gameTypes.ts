export type Room = [number, number, number, number]; // x, y, w, h

export type GamePhase = "playing" | "dead" | "escaped" | "enterKey";

export interface RoomMessage {
  cipher: string;
  key: number;
}

export interface GameState {
  map: string[][];
  rooms: Room[];
  playerX: number;
  playerY: number;
  traps: string[];           // "x,y"
  exit: { x: number; y: number };
  finalKeyPositions: Record<string, string>; // "x,y" -> encrypted part
  collectedParts: string[];
  roomMessages: Record<string, RoomMessage>; // "x,y,w,h" -> message
  lastRoom: string | null;
  logs: string[];
  phase: GamePhase;
  keyInput: string;
}

export type GameAction =
  | { type: "MOVE"; dir: "w" | "a" | "s" | "d" }
  | { type: "SET_KEY_INPUT"; value: string }
  | { type: "SUBMIT_KEY" }
  | { type: "CANCEL_KEY" }
  | { type: "RESTART" };