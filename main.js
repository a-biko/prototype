const size = 3;
const width = 100;
const height = 100;

let field = [];
let nextField = [];

const clear = () => {
  for (let y = 0; y < height + 2; y++) {
    field[y] = [];
    nextField[y] = [];
    for (let x = 0; x < width + 2; x++) {
      field[y][x] = 0;
      nextField[y][x] = 0;
    }
  }
};

const random = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {
      field[y][x] = Math.random() < 0.2 ? 1 : 0;
    }
  }
};

const render = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {
      ctx.fillStyle = field[y][x] ? "#0f0" : "#000";
      ctx.fillRect((x - 1) * size, (y - 1) * size, size, size);
    }
  }
};

const step = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (field[y + dy][x + dx]) {
            count++;
          }
        }
      }

      if (
        (field[y][x] && (count === 3 || count === 4)) ||
        (!field[y][x] && count === 3)
      ) {
        nextField[y][x] = 1;
      } else {
        nextField[y][x] = 0;
      }
    }
  }
  [field, nextField] = [nextField, field];
};

let ctx = null;
let isWorking = false;
const init = () => {
  const canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = size * width;
  canvas.height = size * height;

  document.getElementById("start").onclick = () => {
    isWorking = true;
  };
  document.getElementById("stop").onclick = () => {
    isWorking = false;
  };
  document.getElementById("random").onclick = () => {
    random();
  };

  clear();
  random();
  render();
};

window.onload = () => {
  init();
  const tick = () => {
    setTimeout(tick, 100);
    if (isWorking) {
      step();
      render();
    }
  };
  tick();
};
