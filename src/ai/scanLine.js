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
          // 빈칸 너머에 내 돌이 있는지 확인 (떨어진 패턴)
          if (inBounds(nnx, nny, size) && board[nny][nnx] === player) {
            foundGap = true;
            gaps.push({ x: nx, y: ny });
          } else {
            // 더 이상 돌이 없으면 여기가 열린 끝
            openEnds.push({ x: nx, y: ny });
            break;
          }
        } else {
          // 이미 빈칸을 하나 건너뛴 상태에서 또 빈칸을 만나면 거기가 끝
          openEnds.push({ x: nx, y: ny });
          break;
        }
      } else {
        // 상대방 돌에 막힘
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
