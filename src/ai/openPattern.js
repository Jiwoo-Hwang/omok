import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

export function findOpenNBlock(game, player, n) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== player) continue;

      for (const [dx, dy] of DIRECTIONS) {
        const result = scanLine(board, x, y, dx, dy, player, size);

        // [핵심 수정]
        // 4목(n=4)일 때는 한쪽만 열려있어도(openEnds >= 1) 반드시 막아야 합니다.
        // 3목(n=3)일 때는 양쪽이 열려있어야(openEnds === 2) 위협적입니다.
        const isDangerous =
          n === 4
            ? result.count === 4 && result.openEnds.length >= 1
            : result.count === n && result.openEnds.length === 2;

        if (isDangerous) {
          // 떨어진 4(OO_OO)의 경우 빈칸(gap)을 최우선으로 막음
          if (result.gaps.length > 0) return result.gaps[0];
          // 아니면 열린 끝점(openEnds) 중 하나를 막음
          if (result.openEnds.length > 0) return result.openEnds[0];
        }
      }
    }
  }
  return null;
}

export function findOpenNCreate(game, player, n, strictlyConsecutive = false) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      board[y][x] = player;
      let ok = false;

      for (const [dx, dy] of DIRECTIONS) {
        const result = scanLine(board, x, y, dx, dy, player, size);

        // n개를 만들고 양쪽이 열린 자리를 찾음
        if (result.count === n && result.openEnds.length === 2) {
          if (strictlyConsecutive && result.gaps.length > 0) continue;
          ok = true;
          break;
        }
      }

      board[y][x] = 0;
      if (ok) return { x, y };
    }
  }
  return null;
}
