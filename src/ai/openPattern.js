import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

export function findOpenNCreate(game, player, n) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      board[y][x] = player;
      const ok = createsOpenN(board, x, y, player, size, n);
      board[y][x] = 0;

      if (ok) return { x, y };
    }
  }
  return null;
}

export function findOpenNBlock(game, player, n) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== player) continue;

      for (const [dx, dy] of DIRECTIONS) {
        const result = scanLine(board, x, y, dx, dy, player, size);
        if (result.count === n && result.openEnds.length === 2) {
          return result.openEnds[0];
        }
      }
    }
  }
  return null;
}

function createsOpenN(board, x, y, player, size, n) {
  for (const [dx, dy] of DIRECTIONS) {
    const result = scanLine(board, x, y, dx, dy, player, size);
    if (result.count === n && result.openEnds.length === 2) {
      return true;
    }
  }
  return false;
}
