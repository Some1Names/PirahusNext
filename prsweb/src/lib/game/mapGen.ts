import { caesarEncrypt } from "./caesar";
import { GameState, Room, RoomMessage } from "./gameTypes";

const MAP_W = 30;
const MAP_H = 20;
const ROOM_COUNT = 12;
const FINAL_KEY = "warmkidcamp2";

const ROOM_MESSAGES = [
  "an empty quiet room",
  "a dusty abandoned chamber",
  "cold stone walls surround you",
  "a room filled with silence",
  "old footprints cover the floor",
  "broken furniture lies here",
  "a damp and dark chamber",
  "faint wind echoes in the room",
  "an eerie silent hall",
  "the air smells ancient",
];

const TRAP_MESSAGES = [
  "you sense a hidden trap",
  "something feels dangerous here",
  "a deadly mechanism nearby",
  "the floor seems unstable",
  "hidden spikes may trigger",
  "a trap could activate",
  "danger lurks in this room",
  "a suspicious pressure plate",
  "mechanical sounds beneath",
  "this room feels deadly",
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function splitKey(text: string, n = 3): string[] {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += n) parts.push(text.slice(i, i + n));
  return parts;
}

export function roomKey(room: Room): string {
  return room.join(",");
}

export function posKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function generateGame(): GameState {
  // --- Build map ---
  const map: string[][] = Array.from({ length: MAP_H }, () =>
    Array(MAP_W).fill("#")
  );

  const rooms: Room[] = [];

  while (rooms.length < ROOM_COUNT) {
    const w = choice([3, 4]);
    const h = choice([3, 4]);
    const x = randInt(1, MAP_W - w - 2);
    const y = randInt(1, MAP_H - h - 2);
    const newRoom: Room = [x, y, w, h];

    const overlap = rooms.some(
      ([rx, ry, rw, rh]) =>
        x < rx + rw + 1 && x + w + 1 > rx && y < ry + rh + 1 && y + h + 1 > ry
    );
    if (overlap) continue;

    rooms.push(newRoom);
    for (let iy = y; iy < y + h; iy++)
      for (let ix = x; ix < x + w; ix++) map[iy][ix] = ".";
  }

  // --- Connect rooms ---
  const centers = rooms.map<[number, number]>(([x, y, w, h]) => [
    x + Math.floor(w / 2),
    y + Math.floor(h / 2),
  ]);

  const connected: [number, number][] = [centers[0]];
  const remaining: [number, number][] = centers.slice(1);

  const dig = (x: number, y: number) => {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) map[y][x] = ".";
  };

  while (remaining.length > 0) {
    let best = Infinity;
    let pair: [[number, number], [number, number]] | null = null;

    for (const c1 of connected) {
      for (const c2 of remaining) {
        const d = Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);
        if (d < best) { best = d; pair = [c1, c2]; }
      }
    }

    const [[x1, y1], [x2, y2]] = pair!;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) dig(x, y1);
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) dig(x2, y);

    connected.push([x2, y2]);
    const idx = remaining.findIndex(([x, y]) => x === x2 && y === y2);
    remaining.splice(idx, 1);
  }

  // --- Traps ---
  const trapRooms = sample(rooms, 2);
  const traps = new Set<string>();

  for (const [x, y, w, h] of trapRooms) {
    let count = randInt(1, 3);
    while (count > 0) {
      const tx = randInt(x + 1, x + w - 2);
      const ty = randInt(y + 1, y + h - 2);
      traps.add(posKey(tx, ty));
      count--;
    }
  }

  // --- Room messages ---
  const roomMessages: Record<string, RoomMessage> = {};
  for (const room of rooms) {
    const isTrap = trapRooms.some((r) => roomKey(r) === roomKey(room));
    const msg = isTrap ? choice(TRAP_MESSAGES) : choice(ROOM_MESSAGES);
    const key = randInt(-26, 26);
    roomMessages[roomKey(room)] = { cipher: caesarEncrypt(msg, key), key };
  }

  // --- Safe rooms ---
  const safeRooms = rooms.filter(
    (r) => !trapRooms.some((t) => roomKey(t) === roomKey(r))
  );

  // --- Player spawn ---
  const start = choice(safeRooms);
  const playerX = randInt(start[0], start[0] + start[2] - 1);
  const playerY = randInt(start[1], start[1] + start[3] - 1);

  // --- Exit ---
  const exitRoom = choice(safeRooms);
  const ex = randInt(exitRoom[0], exitRoom[0] + exitRoom[2] - 1);
  const ey = randInt(exitRoom[1], exitRoom[1] + exitRoom[3] - 1);

  // --- Final key fragments ---
  const keyParts = splitKey(FINAL_KEY, 3);
  const encryptedParts = keyParts.map((k) => caesarEncrypt(k, 2));
  const finalKeyPositions: Record<string, string> = {};
  const used = new Set<string>([...traps, posKey(ex, ey)]);

  for (const part of encryptedParts) {
    while (true) {
      const room = choice(safeRooms);
      const [rx, ry, rw, rh] = room;
      const x = randInt(rx, rx + rw - 1);
      const y = randInt(ry, ry + rh - 1);
      if (!used.has(posKey(x, y))) {
        finalKeyPositions[posKey(x, y)] = part;
        used.add(posKey(x, y));
        break;
      }
    }
  }

  return {
    map,
    rooms,
    playerX,
    playerY,
    traps: [...traps],
    exit: { x: ex, y: ey },
    finalKeyPositions,
    collectedParts: [],
    roomMessages,
    lastRoom: null,
    logs: ["You wake up in a dark dungeon. Find the exit."],
    phase: "playing",
    keyInput: "",
  };
}

export function getRoomAt(rooms: Room[], x: number, y: number): Room | null {
  return (
    rooms.find(([rx, ry, rw, rh]) => x >= rx && x < rx + rw && y >= ry && y < ry + rh) ?? null
  );
}

export const FINAL_KEY_ANSWER = FINAL_KEY;
export { MAP_W, MAP_H };