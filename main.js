function getRandomBool() {
  if (Math.floor(Math.random() * 2) === 0) {
    return true;
  }
}
const image1 = document.querySelector('.number-1');
const image2 = document.querySelector('.number-2');
const image3 = document.querySelector('.number-3');
const image4 = document.querySelector('.number-4');
const image5 = document.querySelector('.number-5');
const image6 = document.querySelector('.number-6');
const image7 = document.querySelector('.number-7');
const image8 = document.querySelector('.number-8');
const image9 = document.querySelector('.number-9');
const image10 = document.querySelector('.number-10');
const image11 = document.querySelector('.number-11');
const image12 = document.querySelector('.number-12');
const image13 = document.querySelector('.number-13');
const image14 = document.querySelector('.number-14');
const image15 = document.querySelector('.number-15');
const image0 = document.querySelector('.number-0');

const firstPage = document.querySelector('.first-page');
const firstPageButton = firstPage.querySelector('.first-page__button');
const secondPage = document.querySelector('.second-page');
const secondPageLevelButton = secondPage.querySelector('.second-page__level');
const tagPage = document.querySelector('.tag');
const tagOverlay = document.querySelector('.tag__overlay');
const tagOverlayTouches = tagOverlay.querySelector('.tag__touches-count');
const tagOverlayContinue = tagOverlay.querySelector('.tag__overlay-button');
const tagOverlayRestart = tagOverlay.querySelector('.tag__overlay-restart');
const topBarTouches = document.querySelector('.topbar__touch-count');

firstPageButton.addEventListener('click', () => {
  firstPage.classList.remove('first-page_active');
  secondPage.classList.add('second-page_active');
})
secondPageLevelButton.addEventListener('click', () => {
  secondPage.classList.remove('second-page_active');
  tagPage.classList.add('tag_active');
})
tagOverlayContinue.addEventListener('click', () => {
  tagOverlay.classList.remove('tag__overlay_active');
  tagPage.classList.remove('tag_active');
  secondPage.classList.add('second-page_active');
});
tagOverlayRestart.addEventListener('click', () => {
  tagOverlay.classList.remove('tag__overlay_active');
})

function Game(canvas, context, cellSize) {
  this.state = [
    [{number: 1, image: image1}, {number: 2, image: image2}, {number: 3, image: image3}, {number: 4, image: image4}],
    [{number: 5, image: image5}, {number: 6, image: image6}, {number: 7, image: image7}, {number: 8, image: image8}],
    [{number: 9, image: image9}, {number: 10, image: image10}, {number: 11, image: image11}, {number: 12, image: image12}],
    [{number: 13, image: image13}, {number: 14, image: image14}, {number: 15, image: image15}, {number: 0, image: image0}]
  ];

  this.color = "#350b4b";

  this.context = context;
  this.cellSize = cellSize;

  this.clicks = 0;
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;
  const scaleFactor = 3;
  canvas.width = originalWidth * scaleFactor; // Увеличенная ширина
  canvas.height = originalHeight * scaleFactor; // Увеличенная высота
  canvas.style.width = originalWidth - 8 + 'px'; // Исходная ширина
  canvas.style.height = originalHeight - 8 + 'px'; // Исходная высота
  // Рисование на увеличенном холсте
  context.scale(scaleFactor, scaleFactor);
}

Game.prototype.getClicks = function () {
  return this.clicks;
};

Game.prototype.cellView = function (x, y) {
  this.context.fillStyle = this.color;
  this.context.fillRect(
    x + 1,
    y + 1,
    this.cellSize - 2,
    this.cellSize - 2
  );
};

Game.prototype.numView = function () {
  this.context.font = "bold " + (this.cellSize / 2) + "px Sans";
  this.context.textAlign = "center";
  this.context.textBaseline = "middle";
  this.context.fillStyle = "#350b4b";
};

Game.prototype.draw = function () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.state[i][j]["number"] > 0) {
        this.cellView(
          j * this.cellSize,
          i * this.cellSize
        );
        // this.numView();
        // this.context.fillText(
        //   this.state[i][j],
        //   j * this.cellSize + this.cellSize / 2,
        //   i * this.cellSize + this.cellSize / 2
        // );
        this.context.drawImage(
          this.state[i][j]['image'],
          j * this.cellSize,
          i * this.cellSize,
          this.cellSize - 2,
          this.cellSize - 2
        );

      }
    }
  }
};

Game.prototype.getNullCell = function () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.state[j][i]["number"] === 0) {
        return { x: i, y: j };
      }
    }
  }
};

Game.prototype.move = function (x, y) {
  let nullCell = this.getNullCell();
  let canMoveVertical = (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y;
  let canMoveHorizontal = (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x;

  if (canMoveVertical || canMoveHorizontal) {
    this.state[nullCell.y][nullCell.x]["number"] = this.state[y][x]["number"];
    this.state[nullCell.y][nullCell.x]["image"] = this.state[y][x]["image"];
    this.state[y][x]["number"] = 0;
    this.state[y][x]["image"] = image0;
    this.clicks++;
    topBarTouches.textContent = this.clicks;
  }
};

Game.prototype.victory = function () {
  let combination = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  let res = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (combination[i][j] != this.state[i][j]["number"]) {
        res = false;
        break;
      }
    }
  }
  return res;
};

Game.prototype.mix = function (count) {
  let x, y;
  for (let i = 0; i < count; i++) {
    let nullCell = this.getNullCell();

    let verticalMove = getRandomBool();
    let upLeft = getRandomBool();

    if (verticalMove) {
      x = nullCell.x;
      if (upLeft) {
        y = nullCell.y - 1;
      } else {
        y = nullCell.y + 1;
      }
    } else {
      y = nullCell.y;
      if (upLeft) {
        x = nullCell.x - 1;
      } else {
        x = nullCell.x + 1;
      }
    }

    if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
      this.move(x, y);
    }
  }

  this.clicks = 0;
  topBarTouches.textContent = 0;
};

function startGame() {
  let canvas = document.getElementById("tag-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;

  let context = canvas.getContext("2d");
  context.fillStyle = "#350b4b";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let cellSize = canvas.width / 4;

  let game = new Game(canvas, context, cellSize);
  game.mix(300);
  game.draw();

  canvas.onclick = function (e) {
    let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (e.pageY - canvas.offsetTop) / cellSize | 0;
    onEvent(x, y);
  };

  canvas.ontouchend = function (e) {
    let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (e.touches[0].pageY - canvas.offsetTop) / cellSize | 0;

    onEvent(x, y);
  };

  function onEvent(x, y) {
    game.move(x, y);
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw();
    if (game.victory()) {
      setTimeout(() => {
        tagOverlayTouches.textContent = game.getClicks();
        tagOverlay.classList.add('tag__overlay_active');
        // alert("Собрано за " + game.getClicks() + " касание!");
        game.mix(300);
        context.fillRect(0, 0, canvas.width, canvas.height);
        game.draw(context, cellSize);
      }, 300)
    }
  }
};

setTimeout(() => {
  startGame();
}, 500)