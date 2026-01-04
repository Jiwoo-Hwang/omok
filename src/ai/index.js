import { findImmediateWin } from "./immediateWin.js";
import { evaluatePoint } from "./openPattern.js";
import { hasNeighbor } from "./utils.js";

export function getAdvancedMove(game, aiPlayer) {
  const { board, size } = game;
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 즉시 승리수 확인
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;

  let bestScore = -Infinity;
  let bestMove = null;

  // 보드의 모든 칸 탐색
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0 || !hasNeighbor(board, x, y, size)) continue;

      // --- 시뮬레이션 시작 ---
      // 1. 내가 여기 둔다고 가정
      board[y][x] = aiPlayer;
      const myMoveScore = evaluatePoint(game, x, y, aiPlayer);

      // 2. 이 상황에서 상대방이 얻을 수 있는 '최선의 수'의 점수를 찾음
      let bestOpponentScore = 0;
      for (let oy = 0; oy < size; oy++) {
        for (let ox = 0; ox < size; ox++) {
          if (board[oy][ox] === 0 && hasNeighbor(board, ox, oy, size)) {
            const opScore = evaluatePoint(game, ox, oy, aiPlayer); // 상대 입장에서의 가치
            if (opScore > bestOpponentScore) {
              bestOpponentScore = opScore;
            }
          }
        }
      }

      // 3. 최종 점수 = 나의 이득 - 상대의 최선의 이득
      const finalScore = myMoveScore - bestOpponentScore;

      // 시뮬레이션 종료 (돌을 다시 치움)
      board[y][x] = 0;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = { x, y };
      }
    }
  }

  return bestMove || { x: Math.floor(size / 2), y: Math.floor(size / 2) };
}
