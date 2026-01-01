// 게임 상태 & 룰
export class Game {
  constructor(size = 15) {
    this.size = size;
    this.reset();
  }

  // 0: 빈칸, 1: 흑, 2: 백
  reset() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0)
    );
    this.currentPlayer = 1; // 1: 흑, 2: 백
    this.gameOver = false;
    this.lastMove = null;
  }

  placeStone(x, y) {
    if (this.gameOver) return false;
    if (this.board[y][x] !== 0) return false;

    this.board[y][x] = this.currentPlayer;
    this.lastMove = { x, y, player: this.currentPlayer };

    if (this.checkWin(x, y, this.currentPlayer)) {
      this.gameOver = true;
    } else {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    return true;
  }

  checkWin(x, y, player) {
    const directions = [
      [1, 0], // →
      [0, 1], // ↓
      [1, 1], // ↘
      [1, -1], // ↗
    ];

    for (const [dx, dy] of directions) {
      let count = 1; // 방금 둔 돌 포함
      count += this.countDirection(x, y, dx, dy, player);
      count += this.countDirection(x, y, -dx, -dy, player);
      if (count >= 5) return true;
    }
    return false;
  }

  countDirection(x, y, dx, dy, player) {
    let count = 0;
    let nx = x + dx;
    let ny = y + dy;

    while (
      nx >= 0 &&
      nx < this.size &&
      ny >= 0 &&
      ny < this.size &&
      this.board[ny][nx] === player
    ) {
      count++;
      nx += dx;
      ny += dy;
    }
    return count;
  }
}
