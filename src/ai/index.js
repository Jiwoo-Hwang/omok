import { findImmediateWin } from "./immediateWin.js";
import { evaluatePoint } from "./openPattern.js";
import { hasNeighbor } from "./utils.js";
import { getInitialHash, updateHash } from "./zobrist.js";

const transpositionTable = new Map();

function evaluateBoard(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;
  let total = 0;
  // 보드 전체의 점수 차이를 계산 (현재 판의 유리함 판단)
  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      if (game.board[y][x] === aiPlayer)
        total += evaluatePoint(game, x, y, aiPlayer);
      else if (game.board[y][x] === opponent)
        total -= evaluatePoint(game, x, y, opponent);
    }
  }
  return total;
}

function minimax(
  game,
  depth,
  alpha,
  beta,
  isMaximizing,
  aiPlayer,
  currentHash
) {
  // 1. 전치 테이블 확인
  const cached = transpositionTable.get(currentHash);
  if (cached && cached.depth >= depth) return cached.score;

  if (depth === 0) return evaluateBoard(game, aiPlayer);

  const opponent = aiPlayer === 1 ? 2 : 1;
  const currentPlayer = isMaximizing ? aiPlayer : opponent;

  // 2. 후보 수 선정 및 정렬 (성능 최적화의 핵심)
  let moves = [];
  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      if (game.board[y][x] === 0 && hasNeighbor(game.board, x, y, game.size)) {
        moves.push({ x, y, score: evaluatePoint(game, x, y, currentPlayer) });
      }
    }
  }
  // 점수가 높은 순으로 정렬하여 좋은 수를 먼저 탐색 (가지치기 확률 증가)
  moves.sort((a, b) => b.score - a.score);
  // 상위 15개 정도만 깊게 탐색 (속도 조절)
  moves = moves.slice(0, 15);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.board[move.y][move.x] = aiPlayer;
      const nextHash = updateHash(
        currentHash,
        move.x,
        move.y,
        aiPlayer,
        game.size
      );
      const ev = minimax(
        game,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        nextHash
      );
      game.board[move.y][move.x] = 0;
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    transpositionTable.set(currentHash, { depth, score: maxEval });
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.board[move.y][move.x] = opponent;
      const nextHash = updateHash(
        currentHash,
        move.x,
        move.y,
        opponent,
        game.size
      );
      const ev = minimax(
        game,
        depth - 1,
        alpha,
        beta,
        true,
        aiPlayer,
        nextHash
      );
      game.board[move.y][move.x] = 0;
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    transpositionTable.set(currentHash, { depth, score: minEval });
    return minEval;
  }
}

export function getAdvancedMove(game, aiPlayer) {
  transpositionTable.clear(); // 매 수마다 테이블 초기화 (또는 일정 크기 유지)
  const opponent = aiPlayer === 1 ? 2 : 1;

  const win = findImmediateWin(game, aiPlayer);
  if (win) return win;
  const block = findImmediateWin(game, opponent);
  if (block) return block;

  let bestScore = -Infinity;
  let bestMove = null;
  const currentHash = getInitialHash(game.board, game.size);

  // Depth 4 탐색 시작
  let moves = [];
  for (let y = 0; y < game.size; y++) {
    for (let x = 0; x < game.size; x++) {
      if (game.board[y][x] === 0 && hasNeighbor(game.board, x, y, game.size)) {
        moves.push({ x, y, score: evaluatePoint(game, x, y, aiPlayer) });
      }
    }
  }
  moves.sort((a, b) => b.score - a.score);

  for (const move of moves.slice(0, 20)) {
    game.board[move.y][move.x] = aiPlayer;
    const h = updateHash(currentHash, move.x, move.y, aiPlayer, game.size);
    // Depth를 4로 설정
    const score = minimax(game, 3, -Infinity, Infinity, false, aiPlayer, h);
    game.board[move.y][move.x] = 0;

    if (score > bestScore) {
      bestScore = score;
      bestMove = { x: move.x, y: move.y };
    }
  }

  return bestMove || { x: 7, y: 7 };
}
