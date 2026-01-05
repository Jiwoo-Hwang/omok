import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

function getScore(count, openEnds, isAI) {
  // 수비 시 가중치를 높여 상대의 위협에 민감하게 반응하게 함
  const weight = isAI ? 1.0 : 1.5;

  if (count >= 5) return 1000000 * weight;
  if (count === 4) {
    if (openEnds === 2) return 100000 * weight; // 열린 4
    if (openEnds === 1) return 10000 * weight; // 닫힌 4
  }
  if (count === 3) {
    if (openEnds === 2) return 15000 * weight; // 열린 3 (닫힌 4보다 위협적)
    if (openEnds === 1) return 1000 * weight;
  }
  if (count === 2 && openEnds === 2) return 500 * weight;

  return count * 10 * weight;
}

/**
 * 해당 위치에 player가 두었을 때 얻는 '공격적' 가치만 계산합니다.
 */
export function evaluatePoint(game, x, y, player) {
  let score = 0;
  for (const [dx, dy] of DIRECTIONS) {
    const res = scanLine(game.board, x, y, dx, dy, player, game.size);
    // 여기서 isAI 여부는 점수 가중치를 위한 것입니다.
    // AI 플레이어 본인이면 true, 상대방의 위협을 계산할 땐 false를 보냅니다.
    const isAI = player === 2; // AI가 2번이라고 가정
    score += getScore(res.count, res.openEnds.length, isAI);
  }
  return score;
}
