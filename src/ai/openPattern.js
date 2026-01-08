import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

function getScore(count, openEnds, isAI) {
  const weight = isAI ? 1 : 0.9; // 수비 밸런스를 위해 상대 점수 비중을 살짝 높임

  if (count >= 5) return 1000000 * weight;
  if (count === 4) {
    if (openEnds === 2) return 100000 * weight;
    if (openEnds === 1) return 10000 * weight;
  }
  if (count === 3) {
    if (openEnds === 2) return 15000 * weight; // 열린 3의 가치를 높게 평가
    if (openEnds === 1) return 1000 * weight;
  }
  if (count === 2 && openEnds === 2) return 500 * weight;

  return count * 10 * weight;
}

export function evaluatePoint(game, x, y, player) {
  const opponent = player === 1 ? 2 : 1;
  let score = 0;

  for (const [dx, dy] of DIRECTIONS) {
    const atk = scanLine(game.board, x, y, dx, dy, player, game.size);
    score += getScore(atk.count, atk.openEnds.length, true);

    const def = scanLine(game.board, x, y, dx, dy, opponent, game.size);
    score += getScore(def.count, def.openEnds.length, false);
  }
  return score;
}
