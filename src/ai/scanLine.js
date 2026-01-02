import { inBounds } from "./utils.js";

export function scanLine(board, x, y, dx, dy, player, size) {
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
