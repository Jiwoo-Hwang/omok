import { getAdvancedMove } from "./ai/index.js";

const HUMAN = 1;
const AI = 2;

export function setupInput(canvas, game, renderer) {
  function handleMove(x, y) {
    if (game.gameOver || !game.placeStone(x, y)) return;

    renderer.render();

    if (game.gameOver) {
      setTimeout(
        () => alert(game.winner === HUMAN ? "흑 승리!" : "백 승리!"),
        10
      );
      return;
    }

    // AI 차례: 현재 플레이어가 AI인지 확인
    if (game.currentPlayer === AI) {
      setTimeout(() => {
        // 이미 게임이 끝났는지 재확인
        if (game.gameOver) return;

        const move = getAdvancedMove(game, AI);
        if (move) {
          game.placeStone(move.x, move.y);
          renderer.render();

          if (game.gameOver) {
            setTimeout(() => alert("백(AI) 승리!"), 10);
          }
        }
      }, 100);
    }
  }

  canvas.addEventListener("click", (e) => {
    if (game.currentPlayer !== HUMAN || game.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const bx = Math.round(
      (e.clientX - rect.left - renderer.PADDING) / renderer.CELL_SIZE
    );
    const by = Math.round(
      (e.clientY - rect.top - renderer.PADDING) / renderer.CELL_SIZE
    );

    if (bx >= 0 && bx < game.size && by >= 0 && by < game.size) {
      handleMove(bx, by);
    }
  });
}
