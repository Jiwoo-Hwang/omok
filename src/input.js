import { getBeginnerMove } from "./ai/ai.js";

// 입력 처리
const HUMAN = 1;
const AI = 2;

export function setupInput(canvas, game, renderer) {
  function handleMove(x, y) {
    if (!game.placeStone(x, y)) return;

    renderer.render();

    if (game.gameOver) {
      setTimeout(() => alert("흑 승리!"), 10);
      return;
    }

    // AI 차례
    setTimeout(() => {
      const move = getBeginnerMove(game, AI);
      if (!move) return;

      game.placeStone(move.x, move.y);
      renderer.render();

      if (game.gameOver) {
        setTimeout(() => alert("백 승리!"), 10);
      }
    }, 300); // 생각하는 척
  }

  function handleInput(clientX, clientY) {
    if (game.currentPlayer !== HUMAN || game.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const bx = Math.round((x - renderer.PADDING) / renderer.CELL_SIZE);
    const by = Math.round((y - renderer.PADDING) / renderer.CELL_SIZE);

    if (bx < 0 || bx >= game.size || by < 0 || by >= game.size) return;

    handleMove(bx, by);
  }

  canvas.addEventListener("click", (e) => {
    handleInput(e.clientX, e.clientY);
  });

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleInput(t.clientX, t.clientY);
  });
}
