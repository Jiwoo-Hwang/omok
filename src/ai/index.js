import { findImmediateWin } from "./immediateWin.js";
import { evaluatePoint } from "./openPattern.js";
import { hasNeighbor } from "./utils.js";

// index.js

export function getAdvancedMove(game, aiPlayer) {
  const { board, size } = game;
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 즉시 승리/방어 (이건 생략하면 안 됩니다)
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;
  const blockWin = findImmediateWin(game, opponent);
  if (blockWin) return blockWin;

  let bestScore = -Infinity;
  let bestMove = null;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0 || !hasNeighbor(board, x, y, size)) continue;

      // [나의 시뮬레이션]
      board[y][x] = aiPlayer;
      const myMoveScore = evaluatePoint(game, x, y, aiPlayer);

      // [상대의 최선의 대응 탐색]
      let bestOpponentScore = 0;
      for (let oy = 0; oy < size; oy++) {
        for (let ox = 0; ox < size; ox++) {
          if (board[oy][ox] === 0 && hasNeighbor(board, ox, oy, size)) {
            // 중요: 상대방(opponent)의 관점에서 이 자리가 얼마나 좋은지 계산해야 함
            const opScore = evaluatePoint(game, ox, oy, opponent);
            if (opScore > bestOpponentScore) {
              bestOpponentScore = opScore;
            }
          }
        }
      }

      // 최종 점수 = 내 수의 가치 - 상대가 얻을 최대 이득
      const finalScore = myMoveScore - bestOpponentScore;
      board[y][x] = 0; // 되돌리기

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = { x, y };
      }
    }
  }

  return bestMove || { x: Math.floor(size / 2), y: Math.floor(size / 2) };
}
