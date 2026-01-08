import { inBounds } from "./utils.js";

export function scanLine(board, x, y, dx, dy, player, size) {
  let count = 1;
  const openEnds = [];
  const gaps = [];

  const search = (directionX, directionY) => {
    let nx = x + directionX;
    let ny = y + directionY;
    let foundGap = false;

    for (let i = 0; i < 4; i++) {
      if (!inBounds(nx, ny, size)) break;
      const cell = board[ny][nx];

      if (cell === player) {
        count++;
      } else if (cell === 0) {
        if (!foundGap) {
          const nnx = nx + directionX;
          const nny = ny + directionY;
          if (inBounds(nnx, nny, size) && board[nny][nnx] === player) {
            foundGap = true;
            gaps.push({ x: nx, y: ny });
          } else {
            openEnds.push({ x: nx, y: ny });
            break;
          }
        } else {
          openEnds.push({ x: nx, y: ny });
          break;
        }
      } else {
        break;
      }
      nx += directionX;
      ny += directionY;
    }
  };

  search(dx, dy);
  search(-dx, -dy);

  return { count, openEnds, gaps };
}
