import { findImmediateWin } from "./immediateWin.js";
import { evaluatePoint } from "./openPattern.js";
import { hasNeighbor } from "./utils.js";

export function getBeginnerMove(game, aiPlayer) {
  const { board, size } = game;
  const opponent = aiPlayer === 1 ? 2 : 1;

  // [최우선] 당장 끝낼 수 있는 수가 있다면 바로 둡니다.
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;

  let bestScore = -1;
  let bestMove = null;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      // 주변에 돌이 있는 칸만 계산 (속도 최적화)
      if (!hasNeighbor(board, x, y, size)) continue;

      // 이 칸의 가치를 계산
      const score = evaluatePoint(game, x, y, aiPlayer);

      if (score > bestScore) {
        bestScore = score;
        bestMove = { x, y };
      }
    }
  }

  // 만약 보드가 텅 비어있다면 중앙 근처에 둡니다.
  return bestMove || { x: Math.floor(size / 2), y: Math.floor(size / 2) };
}
