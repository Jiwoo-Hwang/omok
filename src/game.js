export class Game {
  static EMPTY = 0;
  static BLACK = 1;
  static WHITE = 2;

  constructor(size = 15) {
    this.size = size;
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(Game.EMPTY),
    );
    this.currentPlayer = Game.BLACK;
    this.gameOver = false;
    this.winner = null;
    this.lastMove = null;
  }

  placeStone(x, y) {
    if (this.gameOver || this.board[y][x] !== Game.EMPTY) return false;

    this.board[y][x] = this.currentPlayer;
    this.lastMove = { x, y, player: this.currentPlayer };

    if (this.checkWin(x, y, this.currentPlayer)) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
    } else {
      this.togglePlayer();
    }
    return true;
  }

  togglePlayer() {
    this.currentPlayer =
      this.currentPlayer === Game.BLACK ? Game.WHITE : Game.BLACK;
  }

  checkWin(x, y, player) {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];
    return directions.some(([dx, dy]) => {
      const count =
        1 +
        this.countDirection(x, y, dx, dy, player) +
        this.countDirection(x, y, -dx, -dy, player);
      return count >= 5;
    });
  }

  countDirection(x, y, dx, dy, player) {
    let count = 0;
    let nx = x + dx;
    let ny = y + dy;
    while (this.isWithinBounds(nx, ny) && this.board[ny][nx] === player) {
      count++;
      nx += dx;
      ny += dy;
    }
    return count;
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
}
