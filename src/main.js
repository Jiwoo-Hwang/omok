import { Game } from "./game.js";
import { Renderer } from "./renderer.js";
import { setupInput } from "./input.js";

const canvas = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");

const game = new Game(15);
const renderer = new Renderer(canvas, game);

setupInput(canvas, game, renderer);
renderer.render();

document.getElementById("pvp").onclick = () => {
  players.black = PlayerType.HUMAN;
  players.white = PlayerType.HUMAN;
  game.reset();
  renderer.render(game);
};

document.getElementById("pvai").onclick = () => {
  players.black = PlayerType.HUMAN;
  players.white = PlayerType.AI;
  game.reset();
  renderer.render(game);
};

resetBtn.addEventListener("click", () => {
  game.reset();
  renderer.render();
  handleNextTurn(game, renderer);
});
