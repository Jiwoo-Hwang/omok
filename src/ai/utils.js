export const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

export function inBounds(x, y, size) {
  return x >= 0 && y >= 0 && x < size && y < size;
}

export function hasNeighbor(board, x, y, size) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (inBounds(nx, ny, size) && board[ny][nx] !== 0) {
        return true;
      }
    }
  }
  return false;
}
