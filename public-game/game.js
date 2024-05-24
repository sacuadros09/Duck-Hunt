const socket = io("");

let duck, duck2;
let ducks = [];
let spawnInterval = 1500; 
let proSpawnInterval = 5000; 
let lastSpawnTime = 0;
let lastProSpawnTime = 0;
let positionX = [0, 264, 528, 792, 1056, 1320]; 

let count = 60;
let countInterval = 1000;
let lastCountUpdate = 0;

let cursorX;
let cursorY;
let game_cursor;

let score = 0;
let isGameOver = false

class DuckHunt {
  constructor(img, speedX, speedY) {
    this.x = random(positionX); 
    this.y = 0; 
    this.speedX = speedX; 
    this.speedY = speedY; 
    this.img = img; 
  }

  update() {
    this.x += this.speedX; 
    this.y += this.speedY; 
    
    if (this.x < 0 || this.x > width - 100) {
      this.speedX *= -1;
    }
  }

  show() {
    image(this.img, this.x, this.y, 100, 100); 
  }
}

function preload() {
  duck = loadImage('img/pato.png'); 
  duck2 = loadImage('img/PatoEspecial.png');
  game_cursor = loadImage('img/mira.png');
}

function setup() {
  frameRate(60); 
  createCanvas(1320, 650); 
  cursor(game_cursor); 
  noCursor(); 

  socket.on('derecho', moveRight);
  socket.on('izquierdo', moveLeft);
  socket.on('disparo', Shoot);
}

function draw() {
  background(135, 206, 235); // Fondo azul cielo

  if (!isGameOver && millis() - lastCountUpdate > countInterval && count > 0) {
    count--;
    lastCountUpdate = millis();
  }

  textSize(24);
  fill(0);
  stroke(10);
  text(`Time: ${count} `, 1100, 30);
  text(`Score: ${score}`, 1100, 70);

  if (count == 0) {
    isGameOver = true;
  }

  cursorX = mouseX;
  cursorY = mouseY;
  image(game_cursor, cursorX, cursorY, 40, 40);

  if (!isGameOver && millis() - lastSpawnTime > spawnInterval) {
    let newDuck = new DuckHunt(duck, random(-5, 5), 10);
    ducks.push(newDuck);
    lastSpawnTime = millis();
  }

  if (!isGameOver && millis() - lastProSpawnTime > proSpawnInterval) {
    let newDuck2 = new DuckHunt(duck2, random(-8, 8), 12);
    ducks.push(newDuck2);
    lastProSpawnTime = millis();
  }

  for (let i = ducks.length - 1; i >= 0; i--) {
    ducks[i].update();
    ducks[i].show();

    if (ducks[i].y > height || ducks[i].x < -50 || ducks[i].x > width + 50) {
      ducks.splice(i, 1); 
    }
  }

  if (isGameOver) {
    fill(0, 100);
    rect(0, 0, width, height);

    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(`Score: ${score}`, width / 2, height / 2 + 20);
  }
}

function Shoot() {
  if (!isGameOver && mouseIsPressed) {
    for (let i = ducks.length - 1; i >= 0; i--) {
      const duck = ducks[i];
      const duckX = duck.x;
      const duckY = duck.y;
      const duckWidth = 100;  
      const duckHeight = 100;

      if (
        mouseX >= duckX &&
        mouseX <= duckX + duckWidth &&
        mouseY >= duckY &&
        mouseY <= duckY + duckHeight  
      ) {
        if (duck.img === duck2) {
          score += 30;
        } else {
          score += 10;
        }

        ducks.splice(i, 1); 
      }
    }
  } 
}

function moveRight() {
  cursorX += 5;
}

function moveLeft() {
  cursorX -= 5;
}
