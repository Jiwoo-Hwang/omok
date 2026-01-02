export function getBeginnerMove(game, aiPlayer) {
  const size = game.size;
  const board = game.board;
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 내가 이길 수 있는 수
  const winMove = findWinningMove(game, aiPlayer);
  if (winMove) return winMove;

  // 2. 상대가 이길 수 있는 수 막기
  const blockMove = findWinningMove(game, opponent);
  if (blockMove) return blockMove;

  // 3. 상대 열린 3 막기 ⭐ 추가
  const blockOpenThree = findOpenThreeBlock(game, opponent);
  if (blockOpenThree) return blockOpenThree;

  // 4. 주변 랜덤
  return getRandomNearbyMove(board, size);
}

function findWinningMove(game, player) {
  const size = game.size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (game.board[y][x] !== 0) continue;

      // 가상으로 둬본다
      game.board[y][x] = player;
      const win = game.checkWin(x, y, player);
      game.board[y][x] = 0;

      if (win) return { x, y };
    }
  }
  return null;
}

function getRandomNearbyMove(board, size) {
  const candidates = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      if (hasNeighbor(board, x, y, size)) {
        candidates.push({ x, y });
      }
    }
  }

  // 아무 돌도 없으면 중앙
  if (candidates.length === 0) {
    const mid = Math.floor(size / 2);
    return { x: mid, y: mid };
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function hasNeighbor(board, x, y, size) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && board[ny][nx] !== 0) {
        return true;
      }
    }
  }
  return false;
}

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

function findOpenThreeBlock(game, player) {
  const board = game.board;
  const size = game.size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== player) continue;

      for (const [dx, dy] of DIRECTIONS) {
        let count = 1;

        // 정방향
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny, size) && board[ny][nx] === player) {
          count++;
          nx += dx;
          ny += dy;
        }
        const open1 =
          inBounds(nx, ny, size) && board[ny][nx] === 0
            ? { x: nx, y: ny }
            : null;

        // 역방향
        nx = x - dx;
        ny = y - dy;
        while (inBounds(nx, ny, size) && board[ny][nx] === player) {
          count++;
          nx -= dx;
          ny -= dy;
        }
        const open2 =
          inBounds(nx, ny, size) && board[ny][nx] === 0
            ? { x: nx, y: ny }
            : null;

        // 열린 3 조건
        if (count === 3 && open1 && open2) {
          // 둘 중 아무 곳이나 막아도 됨
          return open1;
        }
      }
    }
  }
  return null;
}

function inBounds(x, y, size) {
  return x >= 0 && y >= 0 && x < size && y < size;
}
