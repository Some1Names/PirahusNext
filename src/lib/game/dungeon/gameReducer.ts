import { GameState, GameAction, GamePhase } from "./gameTypes";
import { generateGame, getRoomAt, roomKey, posKey, MAP_W, MAP_H } from "./mapGen";
import { caesarDecrypt } from "./caesar";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "RESTART":
      return generateGame();

    case "SET_KEY_INPUT":
      return { ...state, keyInput: action.value };

    case "CANCEL_KEY":
      return { ...state, phase: "playing", keyInput: "", logs: [...state.logs, "You step back from the exit."] };

    case "SUBMIT_KEY": {
      if (state.keyInput === state.finalKeyAnswer) {
        return { ...state, phase: "escaped", logs: [...state.logs, "✅ Correct! You escaped the dungeon!"] };
      }
      return { ...state, keyInput: "", logs: [...state.logs, "❌ Wrong key. Try again."] };
    }

    case "MOVE": {
      if (state.phase !== "playing") return state;

      const { dir } = action;
      let nx = state.playerX;
      let ny = state.playerY;

      if (dir === "w") ny -= 1;
      if (dir === "s") ny += 1;
      if (dir === "a") nx -= 1;
      if (dir === "d") nx += 1;

      if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return state;
      if (state.map[ny][nx] !== ".") return state;

      const newLogs = [...state.logs];
      const newCollected = [...state.collectedParts];
      let newPhase: GamePhase = state.phase;

      // Room message on entering new room
      const nextRoom = getRoomAt(state.rooms, nx, ny);
      const currentRoom = getRoomAt(state.rooms, state.playerX, state.playerY);
      const nextRoomKey = nextRoom ? roomKey(nextRoom) : null;
      const currentRoomKey = currentRoom ? roomKey(currentRoom) : null;

      if (nextRoom && nextRoomKey !== currentRoomKey && nextRoomKey !== state.lastRoom) {
        const msg = state.roomMessages[nextRoomKey!];
        if (msg) {
          const decrypted = caesarDecrypt(msg.cipher, msg.key);
          newLogs.push(`📜 ${decrypted}`);
        }
      }

      // Key fragment pickup
      const pk = posKey(nx, ny);
      if (state.finalKeyPositions[pk] && !newCollected.includes(state.finalKeyPositions[pk])) {
        newCollected.push(state.finalKeyPositions[pk]);
        newLogs.push(`🔑 You found a key fragment: "${state.finalKeyPositions[pk]}"`);
      }

      // Trap check
      if (state.traps.includes(pk)) {
        newLogs.push("💀 You triggered a trap! Game over.");
        return {
          ...state,
          playerX: nx,
          playerY: ny,
          logs: newLogs,
          phase: "dead",
          lastRoom: nextRoomKey,
        };
      }

      // Exit check
      if (nx === state.exit.x && ny === state.exit.y) {
        newLogs.push("🚪 You found the exit! Enter the key to escape.");
        newPhase = "enterKey";
      }

      return {
        ...state,
        playerX: nx,
        playerY: ny,
        collectedParts: newCollected,
        logs: newLogs.slice(-50), // keep last 50 lines
        phase: newPhase,
        lastRoom: nextRoomKey,
        keyInput: "",
      };
    }

    default:
      return state;
  }
}