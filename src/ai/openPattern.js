import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

// 패턴에 따른 점수를 반환하는 보조 함수
function getScore(count, openEnds, isAI) {
  const weight = isAI ? 1 : 0.8; // 공격적 AI: 상대 점수 가중치를 낮춤 (0.8)

  if (count >= 5) return 1000000 * weight;
  if (count === 4) {
    if (openEnds === 2) return 100000 * weight; // 열린 4
    if (openEnds === 1) return 10000 * weight; // 닫힌 4
  }
  if (count === 3) {
    if (openEnds === 2) return 10000 * weight; // 열린 3
    if (openEnds === 1) return 1000 * weight; // 닫힌 3
  }
  if (count === 2) {
    if (openEnds === 2) return 1000 * weight; // 열린 2
  }
  return count * 10 * weight; // 기본 점수
}

export function evaluatePoint(game, x, y, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;
  let totalScore = 0;

  for (const [dx, dy] of DIRECTIONS) {
    // 1. AI가 두었을 때의 공격 점수
    const aiRes = scanLine(game.board, x, y, dx, dy, aiPlayer, game.size);
    totalScore += getScore(aiRes.count, aiRes.openEnds.length, true);

    // 2. 상대가 두었을 때의 방어 점수
    const opRes = scanLine(game.board, x, y, dx, dy, opponent, game.size);
    totalScore += getScore(opRes.count, opRes.openEnds.length, false);
  }

  return totalScore;
}
