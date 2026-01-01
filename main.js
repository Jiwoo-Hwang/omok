const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d"); //그림을 그릴 수 있게 해주는 '렌더링 컨텍스트(Rendering Context)' 객체를 가져옵니다. 괄호 안의 "2d"는 2차원 그래픽(평면)을 그리겠다는 뜻

const BOARD_SIZE = 15;
const CELL_SIZE = 40;
const PADDING = 20;

let gameOver = false;

canvas.width = PADDING * 2 + CELL_SIZE * (BOARD_SIZE - 1);
canvas.height = PADDING * 2 + CELL_SIZE * (BOARD_SIZE - 1);

function drawBoard() {
  // 1. 화면 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 2. 선 색상 결정
  ctx.strokeStyle = "#000";

  for (let i = 0; i < BOARD_SIZE; i++) {
    // 가로선
    ctx.beginPath(); //"이제부터 새로운 선을 그릴 거야"라고 선언 (이전 경로와 분리)
    ctx.moveTo(PADDING, PADDING + i * CELL_SIZE); // 붓을 종이에서 떼어 특정 좌표 $(x, y)$로 이동
    ctx.lineTo(
      PADDING + CELL_SIZE * (BOARD_SIZE - 1),
      PADDING + i * CELL_SIZE
    ); // 현재 위치에서 $(x, y)$까지 직선 연결 (아직 화면엔 안 보임)
    ctx.stroke(); // 지금까지 정의한 경로를 따라 실제로 선을 그음

    // 세로선
    ctx.beginPath();
    ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
    ctx.lineTo(
      PADDING + i * CELL_SIZE,
      PADDING + CELL_SIZE * (BOARD_SIZE - 1)
    );
    ctx.stroke();
  }
}

// 0: 빈칸, 1: 흑, 2: 백
const board = Array.from({ length: BOARD_SIZE }, () =>
  Array(BOARD_SIZE).fill(0)
);

let currentPlayer = 1; // 흑부터 시작
let lastMove = null; // { x, y, player }

function getBoardPosition(x, y) {
  const boardX = Math.round((x - PADDING) / CELL_SIZE);
  const boardY = Math.round((y - PADDING) / CELL_SIZE);

  if (
    boardX < 0 || boardX >= BOARD_SIZE ||
    boardY < 0 || boardY >= BOARD_SIZE
  ) {
    return null;
  }

  return { x: boardX, y: boardY };
}

function drawStone(x, y, player, isLast = false) {
  const cx = PADDING + x * CELL_SIZE;
  const cy = PADDING + y * CELL_SIZE;
  const radius = CELL_SIZE / 2 - 2;

  // 돌
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2); // 원 그리기
  ctx.fillStyle = player === 1 ? "black" : "white";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // 마지막 수 하이라이트
  if (isLast) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1; // 원상복구
  }
}

// Canvas는 내부적으로: [오프스크린 버퍼] → 한 프레임 완성 → [화면에 한 번에 교체]
function render() {
  drawBoard();

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] !== 0) {
        const isLast =
          lastMove &&
          lastMove.x === x &&
          lastMove.y === y;
        drawStone(x, y, board[y][x], isLast);
      }
    }
  }
}

canvas.addEventListener("click", (e) => {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect(); // 캔버스의 현재 위치와 크기 정보를 가져옵니다
  const x = e.clientX - rect.left; // 마우스 클릭 위치
  const y = e.clientY - rect.top;

  const pos = getBoardPosition(x, y);
  if (!pos) return;

  if (board[pos.y][pos.x] !== 0) return;

  board[pos.y][pos.x] = currentPlayer;
  lastMove = { x: pos.x, y: pos.y, player: currentPlayer };

  render();

  if (checkWin(pos.x, pos.y, currentPlayer)) {
    gameOver = true;
    setTimeout(() => {
      alert(currentPlayer === 1 ? "흑 승리!" : "백 승리!");
    }, 10); // 돌이 그려진 뒤 alert 뜨게 하기 위함 (렌더링 보장)
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
});

canvas.addEventListener("touchstart", (e) => { 
  // 기본적으로 수행하는 동작(Default Action)을 막는 메서드
  // 브라우저가 제공하는 모바일 전용 기본 동작들이 게임이나 인터랙티브한 앱의 조작을 방해하기 때문
  e.preventDefault(); 
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();

  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const pos = getBoardPosition(x, y);
  if (!pos) return;

  if (board[pos.y][pos.x] !== 0) return;

  board[pos.y][pos.x] = currentPlayer;
  lastMove = { x: pos.x, y: pos.y, player: currentPlayer };

  render();

  if (checkWin(pos.x, pos.y, currentPlayer)) {
    gameOver = true;
    setTimeout(() => {
      alert(currentPlayer === 1 ? "흑 승리!" : "백 승리!");
    }, 10); // 돌이 그려진 뒤 alert 뜨게 하기 위함 (렌더링 보장)
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
});

const directions = [
  [1, 0],   // →
  [0, 1],   // ↓
  [1, 1],   // ↘
  [1, -1],  // ↗
];

function countDirection(x, y, dx, dy, player) {
  let count = 0;
  let nx = x + dx;
  let ny = y + dy;

  while (
    nx >= 0 && nx < BOARD_SIZE &&
    ny >= 0 && ny < BOARD_SIZE &&
    board[ny][nx] === player
  ) {
    count++;
    nx += dx;
    ny += dy;
  }

  return count;
}

function checkWin(x, y, player) {
  for (const [dx, dy] of directions) {
    let count = 1; // 방금 둔 돌 포함

    count += countDirection(x, y, dx, dy, player);
    count += countDirection(x, y, -dx, -dy, player);

    if (count >= 5) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  // 보드 초기화
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      board[y][x] = 0;
    }
  }

  currentPlayer = 1; // 흑 선공
  gameOver = false;
  lastMove = null;

  render();
}

document.getElementById("resetBtn")
  .addEventListener("click", () => {
    resetGame();
  });

resetGame();
