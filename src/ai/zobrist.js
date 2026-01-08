const SIZE = 15;
const ZOBRIST_TABLE = [];

// 1. 모든 칸에 대해 흑(1), 백(2) 각각의 고유 숫자를 생성
for (let i = 0; i < SIZE * SIZE; i++) {
  ZOBRIST_TABLE[i] = [
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  ];
}

export function getInitialHash(board, size) {
  let hash = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const stone = board[y][x];
      if (stone !== 0) {
        hash ^= ZOBRIST_TABLE[y * size + x][stone - 1];
      }
    }
  }
  return hash;
}

export function updateHash(currentHash, x, y, stone, size) {
  if (stone === 0) return currentHash;
  return currentHash ^ ZOBRIST_TABLE[y * size + x][stone - 1];
}
