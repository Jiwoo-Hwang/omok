// 입력 처리
export function setupInput(canvas, game, renderer) {
  function handleInput(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const boardX = Math.round((x - renderer.PADDING) / renderer.CELL_SIZE);
    const boardY = Math.round((y - renderer.PADDING) / renderer.CELL_SIZE);

    if (boardX < 0 || boardX >= game.size || boardY < 0 || boardY >= game.size)
      return;

    if (game.placeStone(boardX, boardY)) {
      renderer.render();

      if (game.gameOver) {
        setTimeout(() => {
          alert(game.currentPlayer === 1 ? "백 승리!" : "흑 승리!");
        }, 10);
      }
    }
  }

  canvas.addEventListener("click", (e) => {
    handleInput(e.clientX, e.clientY);
  });

  canvas.addEventListener("touchstart", (e) => {
    // 기본적으로 수행하는 동작(Default Action)을 막는 메서드
    // 브라우저가 제공하는 모바일 전용 기본 동작들이 게임이나 인터랙티브한 앱의 조작을 방해하기 때문
    e.preventDefault();
    const t = e.touches[0];
    handleInput(t.clientX, t.clientY);
  });
}
