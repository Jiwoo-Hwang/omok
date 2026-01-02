export function findImmediateWin(game, player) {
  const { board, size } = game;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] !== 0) continue;

      board[y][x] = player;
      const win = game.checkWin(x, y, player);
      board[y][x] = 0;

      if (win) return { x, y };
    }
  }
  return null;
}
