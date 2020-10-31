var monkeyRunning, gameOverImage, restartImage, groundImage,
  backgroundImage, monkey, Background, jungle, invisibleGround,
  score, ran, bananaGroup, obstacleGroup, gameState, monkeyJump,
  restartGroup, cam;




function preload() {

  monkeyRunning = loadAnimation("images/Monkey_01.png", "images/Monkey_02.png", "images/Monkey_03.png", "images/Monkey_04.png", "images/Monkey_05.png", "images/Monkey_06.png", "images/Monkey_07.png", "images/Monkey_08.png", "images/Monkey_09.png", "images/Monkey_10.png");
  groundImage = loadImage("images/ground.jpg");
  bananaImage = loadImage("images/Banana.png");
  obstacleImage = loadImage("images/stone.png");
  backgroundImage = loadImage("images/jungle.jpg");
  monkeyJump = loadAnimation("images/Monkey_07.png");
  monkeyCollided = loadAnimation("images/Monkey_04.png");
  gameOverImage = loadImage("images/gameOver.png");
  restartImage = loadImage("images/restart.png");

}



function setup() {
  createCanvas(600, 300);

  monkey = createSprite(50, 250);
  monkey.addAnimation("Running", monkeyRunning);
  monkey.addAnimation("jump", monkeyJump);
  monkey.addAnimation("collided", monkeyCollided);
  monkey.scale = 0.1;

  // cam = new Camera;

  // cam.velocityX = 10;
  
  Background = createSprite(200, 35, 1000, 1000);
  Background.x = Background.width / 2;
  Background.addImage("BackgroundImage", backgroundImage);

  monkey.depth = Background.depth;
  monkey.depth = monkey.depth + 1;

  Ground = createSprite(150, 255, 1000, 30);
  Ground.visible = false;

  bananaGroup = new Group();
  obstacleGroup = new Group();
  restartGroup = new Group();

  score = 0;

  gameState = "play-1"

}


function draw() {

  background(255);

  // cam.functions();
  

  if (gameState !== "end") {

    monkey.x = camera.position.x;

    camera.position.x = camera.position.x + 10;

    if (keyIsDown(32) && monkey.y >= 200) {
      monkey.velocityY = -35;
      monkey.changeAnimation("jump");
    }

    if (keyWentUp(32)) {
      monkey.changeAnimation("Running");
    }

    // monkey.velocityX = 10;

    monkey.velocityY = monkey.velocityY + 3;

    // Ground.x = cam.body.position.x;0

    if (camera.position.x % 150 === 0) {
      Background.x = camera.position.x;
    }

    Ground.x = camera.position.x;

    if (monkey.isTouching(bananaGroup)) {
      bananaGroup.destroyEach();
      score = score + 2;
    }

  }

  if (monkey.isTouching(obstacleGroup) && gameState === "play-1") {
    monkey.scale = 0.05;
    gameState = "play-2"
    obstacleGroup.destroyEach();
  }

  if (monkey.isTouching(obstacleGroup) && gameState === "play-2") {
    gameState = "end";
    endState();
  }

  if (mouseIsPressed) {
    if (mouseButton === LEFT && gameState === "end") {
      gameState = "play-1";
      reset();
    }
  }


  if (gameState !== "end") {
    Bananas();
    obstacles();
  }

  monkey.collide(Ground);

  drawSprites();

  i = camera.position.x + 100;

  push();
  textSize(20);
  fill("white");
  text("Score = " + score, i, 50);
  pop();

}

function Bananas() {

  if (frameCount % 120 === 0) {
    var banana = createSprite(camera.position.x + 300);
    banana.y = random(80, 200);
    banana.addImage("banana", bananaImage);
    banana.lifetime = 110;
    banana.scale = 0.04;

    if (gameState === "play-1") {
      switch (score) {
        case 10: monkey.scale = 0.12;
          break;
        case 20: monkey.scale = 0.14;
          break;
        case 30: monkey.scale = 0.16;
          break;
        case 40: monkey.scale = 0.18;
          break;
        default: break;
      }
    }

    banana.depth = Background.depth;
    banana.depth = banana.depth + 1;

    console.log(banana);
    
    bananaGroup.add(banana);
  }
}

function obstacles() {

  if (frameCount % 80 === 0) {
    var obstacle = createSprite(camera.position.x + 250, 200);
    obstacle.addImage("obstacleImage", obstacleImage);
    obstacle.lifetime = 120;
    obstacle.scale = 0.2;
    obstacle.setCollider("circle", 0, 0, 100);

    if (gameState === "play-2") {
      obstacle.setCollider("circle", -40, 40, 150);
    }

    obstacle.depth = Background.depth;
    obstacle.depth = obstacle.depth + 1;

    obstacleGroup.add(obstacle);
  }

}

function endState() {

  monkey.changeAnimation("collided");
  monkey.y = 250;
  // cam.velocityX = 0;
  monkey.velocityX = 0;
  Background.velocityX = 0;
  bananaGroup.destroyEach();
  obstacleGroup.setLifetimeEach(-1);
  gameOver = createSprite(camera.position.x, 120);
  gameOver.addImage("gameOVer", gameOverImage);
  restart = createSprite(camera.position.x, 50);
  restart.addImage("restart", restartImage);
  restartGroup.add(gameOver);
  restartGroup.add(restart);

  gameOver.depth =  Background.depth;
  gameOver.depth =  gameOver.depth + 1;

  restart.depth =  Background.depth;
  restart.depth =  restart.depth + 1;

  
}

function reset() {

  monkey.changeAnimation("Running");
  obstacleGroup.destroyEach();
  score = 0;
  // cam.velocityX = 10;
  // gameOver.destroy();
  // restart.destroy();
  restartGroup.destroyEach();
  monkey.scale = 0.1;
  monkey.x = camera.position.x - 250;

}