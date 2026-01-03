// 필요한 로직들을 외부 파일에서 가져옵니다.
import { findImmediateWin } from "./immediateWin.js";
import { findOpenNBlock, findOpenNCreate } from "./openPattern.js";
import { getRandomNearbyMove } from "./randomMove.js";

/**
 * 초보자 수준의 AI 수 결정 함수
 */
export function getBeginnerMove(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 내가 당장 이길 수 있는 수가 있는지 확인 (5목 완성)
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;

  // 2. 상대방이 당장 이기려 하는지 확인 (상대의 5목 차단)
  const blockWin = findImmediateWin(game, opponent);
  if (blockWin) return blockWin;

  // 3. 상대의 '열린 4' 차단 (연속된 4목 혹은 떨어진 4목 모두 포함)
  const blockOpenFour = findOpenNBlock(game, opponent, 4);
  if (blockOpenFour) return blockOpenFour;

  // 4. 내가 "연속된" 열린 4 생성 (OOOO 형태)
  // 세 번째 인자로 true를 전달하여 빈칸 없는 연속된 형태만 찾습니다.
  const makeStraightOpenFour = findOpenNCreate(game, aiPlayer, 4, true);
  if (makeStraightOpenFour) return makeStraightOpenFour;

  // 4.5. 내가 "떨어진" 열린 4 생성 (OO_OO 등)
  // 연속된 4가 없을 경우 빈칸이 포함된 4라도 생성합니다.
  const makeAnyOpenFour = findOpenNCreate(game, aiPlayer, 4, false);
  if (makeAnyOpenFour) return makeAnyOpenFour;

  // 5. 상대의 '열린 3' 차단
  const blockOpenThree = findOpenNBlock(game, opponent, 3);
  if (blockOpenThree) return blockOpenThree;

  // 6. 내가 '열린 3' 생성
  const makeOpenThree = findOpenNCreate(game, aiPlayer, 3);
  if (makeOpenThree) return makeOpenThree;

  // 7. 위 조건에 해당하지 않을 경우, 기존 돌 주변에 랜덤하게 착수
  return getRandomNearbyMove(game.board, game.size);
}
