const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

export function getBeginnerMove(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 즉시 승리
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;

  // 2. 상대 즉시 승리 차단
  const blockWin = findImmediateWin(game, opponent);
  if (blockWin) return blockWin;

  // 3. 상대 열린 4 차단
  const blockOpenFour = findOpenNBlock(game, opponent, 4);
  if (blockOpenFour) return blockOpenFour;

  // 4. 열린 4 생성 (사실상 승리)
  const makeOpenFour = findOpenNCreate(game, aiPlayer, 4);
  if (makeOpenFour) return makeOpenFour;

  // 5. 상대 열린 3 차단
  const blockOpenThree = findOpenNBlock(game, opponent, 3);
  if (blockOpenThree) return blockOpenThree;

  // 6. 내가 열린 3 생성
  const makeOpenThree = findOpenNCreate(game, aiPlayer, 3);
  if (makeOpenThree) return makeOpenThree;

  // 7. 주변 랜덤
  return getRandomNearbyMove(game.board, game.size);
}

function findImmediateWin(game, player) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      board[y][x] = player;
      const win = game.checkWin(x, y, player);
      board[y][x] = 0;

      if (win) return { x, y };
    }
  }
  return null;
}

function findOpenNCreate(game, player, n) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      board[y][x] = player;
      const success = createsOpenN(board, x, y, player, size, n);
      board[y][x] = 0;

      if (success) return { x, y };
    }
  }
  return null;
}

function findOpenNBlock(game, player, n) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== player) continue;

      for (const [dx, dy] of DIRECTIONS) {
        const result = scanLine(board, x, y, dx, dy, player, size);

        if (result.count === n && result.openEnds.length === 2) {
          return result.openEnds[0]; // 한 쪽만 막아도 됨
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

function scanLine(board, x, y, dx, dy, player, size) {
  let count = 1;
  const openEnds = [];

  // 정방향
  let nx = x + dx;
  let ny = y + dy;
  while (inBounds(nx, ny, size) && board[ny][nx] === player) {
    count++;
    nx += dx;
    ny += dy;
  }
  if (inBounds(nx, ny, size) && board[ny][nx] === 0) {
    openEnds.push({ x: nx, y: ny });
  }

  // 역방향
  nx = x - dx;
  ny = y - dy;
  while (inBounds(nx, ny, size) && board[ny][nx] === player) {
    count++;
    nx -= dx;
    ny -= dy;
  }
  if (inBounds(nx, ny, size) && board[ny][nx] === 0) {
    openEnds.push({ x: nx, y: ny });
  }

  return { count, openEnds };
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
      if (inBounds(nx, ny, size) && board[ny][nx] !== 0) {
        return true;
      }
    }
  }
  return false;
}

function inBounds(x, y, size) {
  return x >= 0 && y >= 0 && x < size && y < size;
}
