import { getAdvancedMove } from "./ai/index.js";
import { Game } from "./game.js";

export function setupInput(canvas, game, renderer) {
  let isProcessing = false; // AI 연산 중 중복 클릭 방지

  async function triggerAiMove() {
    if (game.gameOver || game.currentPlayer !== Game.WHITE) return;

    isProcessing = true;
    // AI의 생각을 시각적으로 느끼게 하기 위한 약간의 지연
    await new Promise((resolve) => setTimeout(resolve, 200));

    const move = getAdvancedMove(game, Game.WHITE);
    if (move) {
      game.placeStone(move.x, move.y);
      renderer.render();
      checkEndGame();
    }
    isProcessing = false;
  }

  function checkEndGame() {
    if (game.gameOver) {
      const msg =
        game.winner === Game.BLACK ? "흑(User) 승리!" : "백(AI) 승리!";
      // 렌더링이 완료된 후 alert이 뜨도록 보장
      requestAnimationFrame(() => {
        setTimeout(() => alert(msg), 50);
      });
    }
  }

  canvas.addEventListener("click", (e) => {
    if (game.gameOver || isProcessing || game.currentPlayer !== Game.BLACK)
      return;

    const rect = canvas.getBoundingClientRect();
    const bx = Math.round(
      (e.clientX - rect.left - renderer.PADDING) / renderer.CELL_SIZE,
    );
    const by = Math.round(
      (e.clientY - rect.top - renderer.PADDING) / renderer.CELL_SIZE,
    );

    if (game.isWithinBounds(bx, by)) {
      if (game.placeStone(bx, by)) {
        renderer.render();
        if (game.gameOver) {
          checkEndGame();
        } else {
          triggerAiMove();
        }
      }
    }
  });
}
