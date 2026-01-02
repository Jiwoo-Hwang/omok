import { hasNeighbor } from "./utils.js";

export function getRandomNearbyMove(board, size) {
  const candidates = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;
      if (hasNeighbor(board, x, y, size)) {
        candidates.push({ x, y });
      }
    }
  }

  if (candidates.length === 0) {
    const mid = Math.floor(size / 2);
    return { x: mid, y: mid };
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
