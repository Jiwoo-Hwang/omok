import { scanLine } from "./scanLine.js";
import { DIRECTIONS } from "./utils.js";

// 1. 점수 가중치 수정 (상대의 3, 4를 내 것보다 무겁게 평가)
function getScore(count, openEnds, isAI) {
  // 공격적이지만 수비를 위해 상대방(isAI=false)의 가중치를 1.2로 높입니다.
  const weight = isAI ? 1.0 : 1.2;

  if (count >= 5) return 1000000 * weight;
  if (count === 4) {
    if (openEnds === 2) return 100000 * weight; // 열린 4
    if (openEnds === 1) return 15000 * weight; // 닫힌 4 (점수 상향)
  }
  if (count === 3) {
    if (openEnds === 2) return 20000 * weight; // 열린 3 (닫힌 4보다 위협적임)
    if (openEnds === 1) return 2000 * weight;
  }
  if (count === 2 && openEnds === 2) return 1000 * weight;

  return count * 10 * weight;
}

// 2. 관점 필터링: "특정 플레이어"에게 이 자리가 얼마나 가치 있는가?
export function evaluatePoint(game, x, y, player) {
  const opponent = player === 1 ? 2 : 1;
  let attackScore = 0;
  let defenseScore = 0;

  for (const [dx, dy] of DIRECTIONS) {
    // 해당 플레이어가 두었을 때의 공격 가치
    const atk = scanLine(game.board, x, y, dx, dy, player, game.size);
    attackScore += getScore(atk.count, atk.openEnds.length, true);

    // 해당 자리에 상대가 두었을 때를 막는 방어 가치
    const def = scanLine(game.board, x, y, dx, dy, opponent, game.size);
    defenseScore += getScore(def.count, def.openEnds.length, false);
  }

  // 공격과 방어 중 더 급한 가치를 이 칸의 최종 점수로 반환
  return attackScore + defenseScore;
}
