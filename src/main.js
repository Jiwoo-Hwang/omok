import { Game } from "./game.js";
import { Renderer } from "./renderer.js";
import { setupInput } from "./input.js";

const canvas = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");

const game = new Game(15);
const renderer = new Renderer(canvas, game);

setupInput(canvas, game, renderer);
renderer.render();

resetBtn.addEventListener("click", () => {
  game.reset();
  renderer.render();
});
