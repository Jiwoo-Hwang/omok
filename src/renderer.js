// 화면 그리기
export class Renderer {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;

    this.CELL_SIZE = 40;
    this.PADDING = 20;

    canvas.width = this.PADDING * 2 + this.CELL_SIZE * (game.size - 1);
    canvas.height = canvas.width;
  }

  render() {
    this.drawBoard();
    this.drawStones();
  }

  drawBoard() {
    const { ctx, PADDING, CELL_SIZE } = this;
    const size = this.game.size;

    // 1. 화면 초기화
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 2. 선 색상 결정
    ctx.strokeStyle = "#000";

    for (let i = 0; i < size; i++) {
      // 가로선
      ctx.beginPath(); //"이제부터 새로운 선을 그릴 거야"라고 선언 (이전 경로와 분리)
      ctx.moveTo(PADDING, PADDING + i * CELL_SIZE); // 붓을 종이에서 떼어 특정 좌표 $(x, y)$로 이동
      ctx.lineTo(PADDING + CELL_SIZE * (size - 1), PADDING + i * CELL_SIZE); // 현재 위치에서 $(x, y)$까지 직선 연결 (아직 화면엔 안 보임)
      ctx.stroke(); // 지금까지 정의한 경로를 따라 실제로 선을 그음

      // 세로선
      ctx.beginPath();
      ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
      ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + CELL_SIZE * (size - 1));
      ctx.stroke();
    }
  }

  // Canvas는 내부적으로: [오프스크린 버퍼] → 한 프레임 완성 → [화면에 한 번에 교체]
  drawStones() {
    const { board, lastMove } = this.game;

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        const player = board[y][x];
        if (player === 0) continue;

        const isLast = lastMove && lastMove.x === x && lastMove.y === y;

        this.drawStone(x, y, player, isLast);
      }
    }
  }

  drawStone(x, y, player, isLast) {
    const cx = this.PADDING + x * this.CELL_SIZE;
    const cy = this.PADDING + y * this.CELL_SIZE;
    const radius = this.CELL_SIZE / 2 - 2;

    // 돌
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2); // 원 그리기
    this.ctx.fillStyle = player === 1 ? "black" : "white";
    this.ctx.fill();
    this.ctx.strokeStyle = "#000";
    this.ctx.stroke();

    // 마지막 수 하이라이트
    if (isLast) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.lineWidth = 1; // 원상복구
    }
  }
}
