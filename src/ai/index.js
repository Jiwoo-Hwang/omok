import { findImmediateWin } from "./immediateWin.js";
import { findOpenNCreate, findOpenNBlock } from "./openPattern.js";
import { getRandomNearbyMove } from "./randomMove.js";

export function getBeginnerMove(game, aiPlayer) {
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. 즉시 승리
  const winNow = findImmediateWin(game, aiPlayer);
  if (winNow) return winNow;

  // 2. 상대 즉시 승리 차단
  const blockWin = findImmediateWin(game, opponent);
  if (blockWin) return blockWin;

  // 3. 상대 열린 4 차단
  const blockOpenFour = findOpenNBlock(game, opponent, 4);
  if (blockOpenFour) return blockOpenFour;

  // 4. 열린 4 생성
  const makeOpenFour = findOpenNCreate(game, aiPlayer, 4);
  if (makeOpenFour) return makeOpenFour;

  // 5. 상대 열린 3 차단
  const blockOpenThree = findOpenNBlock(game, opponent, 3);
  if (blockOpenThree) return blockOpenThree;

  // 6. 내가 열린 3 생성
  const makeOpenThree = findOpenNCreate(game, aiPlayer, 3);
  if (makeOpenThree) return makeOpenThree;

  // 7. fallback
  return getRandomNearbyMove(game.board, game.size);
}
