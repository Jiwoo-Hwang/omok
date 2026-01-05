import { findImmediateWin } from "./immediateWin.js";
import { evaluatePoint } from "./openPattern.js";
import { hasNeighbor } from "./utils.js";

function evaluateBoard(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;
  let maxAiScore = 0;
  let maxOpScore = 0;
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === 0 && hasNeighbor(board, x, y, size)) {
        // AI가 여기 뒀을 때의 가치
        maxAiScore = Math.max(maxAiScore, evaluatePoint(game, x, y, aiPlayer));
        // 상대가 여기 뒀을 때의 가치
        maxOpScore = Math.max(maxOpScore, evaluatePoint(game, x, y, opponent));
      }
    }
  }
  // 수비 가중치를 적용하여 반환
  return maxAiScore - maxOpScore * 1.3;
}

export function minimax(game, depth, alpha, beta, isMaximizing, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;
  const { board, size } = game;

  if (depth === 0) return evaluateBoard(game, aiPlayer);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x] === 0 && hasNeighbor(board, x, y, size)) {
          board[y][x] = aiPlayer;
          // 승리 체크 (game 객체에 checkWin이 있다고 가정)
          if (game.checkWin && game.checkWin(x, y, aiPlayer)) {
            board[y][x] = 0;
            return 10000000 + depth;
          }
          let evaluation = minimax(
            game,
            depth - 1,
            alpha,
            beta,
            false,
            aiPlayer
          );
          board[y][x] = 0;
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x] === 0 && hasNeighbor(board, x, y, size)) {
          board[y][x] = opponent;
          if (game.checkWin && game.checkWin(x, y, opponent)) {
            board[y][x] = 0;
            return -10000000 - depth;
          }
          let evaluation = minimax(
            game,
            depth - 1,
            alpha,
            beta,
            true,
            aiPlayer
          );
          board[y][x] = 0;
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
    }
    return minEval;
  }
}

export function getAdvancedMove(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;
  const { board, size } = game;

  // 1. 즉시 승리/방어 체크 (하드코딩된 최우선 순위)
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;
  const blockWin = findImmediateWin(game, opponent);
  if (blockWin) return blockWin;

  let bestScore = -Infinity;
  let bestMove = null;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === 0 && hasNeighbor(board, x, y, size)) {
        board[y][x] = aiPlayer;
        // Depth 2만 해도 충분히 강력합니다.
        let score = minimax(game, 2, -Infinity, Infinity, false, aiPlayer);
        board[y][x] = 0;

        if (score > bestScore) {
          bestScore = score;
          bestMove = { x, y };
        }
      }
    }
  }
  return bestMove || { x: Math.floor(size / 2), y: Math.floor(size / 2) };
}
