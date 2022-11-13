const size = 25;
const width = 12;
const height = 12;

const map = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
  [0, 1, 0, 1, 4, 0, 4, 0, 4, 0, 1, 1],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
  [0, 1, 1, 1, 0, 1, 8, 1, 0, 1, 1, 1],
  [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
];

let heroElement = null;
let heroX;
let heroY;

const canEnter = (x, y) => {
  if (map[y][x] & 1 || map[y][x] & 4) {
    return false;
  }
  return true;
};

const moveDirectionList = [];
const move = (dx, dy) => {
  if (moveDirectionList.length) {
    return;
  }
  const emptyMap = [];
  for (let y = 0; y < height; y++) {
    emptyMap[y] = [];
    for (let x = 0; x < width; x++) {
      emptyMap[y][x] = canEnter(x, y);
    }
  }

  const positionQueue = [[heroX, heroY, []]];
  while (positionQueue.length) {
    const [tx, ty, pathList] = positionQueue.shift();
    if (!emptyMap[ty][tx]) {
      continue;
    }
    emptyMap[ty][tx] = false;
    if (tx === dx && ty === dy) {
      moveDirectionList.push(...pathList);
      return;
    }
    positionQueue.push([tx + 1, ty, [...pathList, [1, 0]]]);
    positionQueue.push([tx - 1, ty, [...pathList, [-1, 0]]]);
    positionQueue.push([tx, ty + 1, [...pathList, [0, 1]]]);
    positionQueue.push([tx, ty - 1, [...pathList, [0, -1]]]);
  }
};

const push = (x, y) => {
  if (moveDirectionList.lenght) {
    return;
  }
  if (canEnter(x, y)) {
    return move(x, y);
  }
  for (const luggage of luggageList) {
    const lx = luggage.x;
    const ly = luggage.y;
    const element = luggage.element;
    if (lx === x && ly === y) {
      const dx = lx - heroX;
      const dy = ly - heroY;
      const tx = lx + dx;
      const ty = ly + dy;
      if (canEnter(tx, ty)) {
        element.style.left = `calc(var(--size) * ${tx})`;
        element.style.top = `calc(var(--size) * ${ty})`;
        map[ty][tx] |= 4;
        map[ly][lx] ^= 4;
        luggage.x = tx;
        luggage.y = ty;
        moveDirectionList.push([dx, dy]);
        return;
      }
    }
  }
};

const luggageList = [];

let container;
const init = () => {
  document.body.style.setProperty("--size", `${size}px`);
  container = document.createElement("div");
  container.className = "container";
  container.style.width = `calc(var(--size) * ${width})`;
  container.style.height = `calc(var(--size) * ${height})`;
  document.body.appendChild(container);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.style.left = `calc(var(--size) * ${x})`;
      tile.style.top = `calc(var(--size) * ${y})`;
      const data = map[y][x];
      tile.style.backgroundColor = data & 1 ? "#f80" : data & 2 ? "#cc0" : "";
      container.appendChild(tile);

      if (data & 4) {
        const luggage = document.createElement("div");
        luggage.className = "luggage";
        luggage.style.left = `calc(var(--size) * ${x})`;
        luggage.style.top = `calc(var(--size) * ${y})`;
        luggage.textContent = "荷";
        container.appendChild(luggage);
        luggageList.push({ x, y, element: luggage });
      }
      if (data & 8) {
        heroElement = document.createElement("div");
        heroElement.className = "hero";
        heroElement.style.left = `calc(var(--size) * ${x})`;
        heroElement.style.top = `calc(var(--size) * ${y})`;
        heroElement.textContent = "主";
        container.appendChild(heroElement);
        heroX = x;
        heroY = y;
      }
    }
  }
  document.ondblclick = (e) => {
    e.preventDefault();
  };
  let isDown = false;
  container.onpointerdown = (e) => {
    e.preventDefault();
    const x = Math.trunc(e.offsetX / size);
    const y = Math.trunc(e.offsetY / size);
    move(x, y);
    isDown = true;
  };
  document.onpointerup = () => {
    isDown = false;
  };
  container.onpointermove = (e) => {
    e.preventDefault();
    if (isDown) {
      const x = Math.trunc(e.offsetX / size);
      const y = Math.trunc(e.offsetY / size);
      if (Math.abs(x - heroX) + Math.abs(y - heroY) === 1) {
        push(x, y);
      }
    }
  };
};

window.onload = () => {
  init();
  const tick = async () => {
    if (moveDirectionList.length) {
      const [dx, dy] = moveDirectionList.shift();
      heroX += dx;
      heroY += dy;
      heroElement.style.left = `calc(var(--size) * ${heroX})`;
      heroElement.style.top = `calc(var(--size) * ${heroY})`;
      await new Promise((r) => setTimeout(r, 50));

      let isClear = true;
      for (const luggage of luggageList) {
        if ((map[luggage.y][luggage.x] & 2) === 0) {
          isClear = false;
        }
      }
      if (isClear) {
        container.style.backgroundColor = "#0cf";
      } else {
        requestAnimationFrame(tick);
      }
    } else {
      requestAnimationFrame(tick);
    }
  };
  tick();
};
