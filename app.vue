<script setup>
  import { useStore } from './store/state'

  const store = useStore()

  let difficulty = {
    easy: 170,
    normal: 130,
    hard: 60
  }
  
  const start_game = () => {
    store.addItem('start')
    let ggg = setInterval(() => {
      try {
        const canvas = document.getElementById("game");
        const ctx = canvas.getContext("2d");

        const ground = new Image();
        ground.src = "./ground.png";

        const foodImg = new Image();
        foodImg.src = "./food.png";

        let box = 32;

        let score = 0;

        let food = {
          x: Math.floor((Math.random() * 17 + 1)) * box,
          y: Math.floor((Math.random() * 15 + 3)) * box,
        };

        let snake = [];
        snake[0] = {
          x: 9 * box,
          y: 10 * box
        };

        document.addEventListener("keydown", direction);

        let dir = "right";

        function direction(event) {
          if((event.keyCode == 37 || event.keyCode == 65) && dir != "right")
            dir = "left";
          else if((event.keyCode == 38 || event.keyCode == 87) && dir != "down")
            dir = "up";
          else if((event.keyCode == 39 || event.keyCode == 68) && dir != "left")
            dir = "right";
          else if((event.keyCode == 40 || event.keyCode == 83) && dir != "up")
            dir = "down";
        }

        function eatTail(head, arr) {
          for(let i = 0; i < arr.length; i++) {
            if(head.x == arr[i].x && head.y == arr[i].y) {
              store.addItem('lose')
              clearInterval(game)
            }
          }
        }

        function drawGame() {
          ctx.drawImage(ground, 0, 0);

          ctx.drawImage(foodImg, food.x, food.y);

          for(let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i == 0 ? "green" : "red";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
          }

          ctx.fillStyle = "white";
          ctx.font = "50px Arial";
          ctx.fillText(score, box * 2.5, box * 1.7);

          let snakeX = snake[0].x;
          let snakeY = snake[0].y;

          if(snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
              x: Math.floor((Math.random() * 17 + 1)) * box,
              y: Math.floor((Math.random() * 15 + 3)) * box,
            };
          } else {
            snake.pop();
          }

          if(snakeX < box || snakeX > box * 17
            || snakeY < 3 * box || snakeY > box * 17) {
              store.addItem('lose')
              clearInterval(game)
            }

          if(dir == "left") snakeX -= box;
          if(dir == "right") snakeX += box;
          if(dir == "up") snakeY -= box;
          if(dir == "down") snakeY += box;

          let newHead = {
            x: snakeX,
            y: snakeY
          };

          eatTail(newHead, snake);

          snake.unshift(newHead);
        }

        let game = setInterval(drawGame, difficulty[store.difficulty]);
        clearInterval(ggg)
      } catch(e) {

      }
    }, 50)
  }
</script>
<template>
  <div class="main">
    <a-card class="menu" v-if="store.state == 'begin'" >
      <a-typography-title class="title" >Змейка🐍</a-typography-title>
      <a-typography-title class="btn" @click="start_game" >Начать</a-typography-title>
      <a-typography-title class="btn ls bst" @click="() => {store.state = 'settings'}" >Настройка🛠</a-typography-title>
      <!-- <a-button @click="start_game">Начать</a-button> -->
    </a-card>

    <a-card class="menu" v-if="store.state == 'lose'" >
      <a-typography-title class="title ls" >Упс.. Вы проиграли😭</a-typography-title>
      <a-typography-title class="btn ls" @click="start_game" >Попробовать еще</a-typography-title>
      <a-typography-title class="btn ls bst" @click="() => {store.state = 'settings'}" >Настройка🛠</a-typography-title>
      <!-- <a-button @click="start_game">Начать</a-button> -->
    </a-card>

    <a-card class="menu" v-if="store.state == 'settings'" >
      <a-typography-title class="title ls st" >Настройки🛠</a-typography-title>
      <a-typography-title :class="store.difficulty == 'easy'? 'btn ls ch': 'btn ls'" @click="() => {store.difficulty = 'easy'}" >Легкая</a-typography-title>
      <a-typography-title :class="store.difficulty == 'normal'? 'btn ls ch': 'btn ls'" @click="() => {store.difficulty = 'normal'}" >Нормальная</a-typography-title>
      <a-typography-title :class="store.difficulty == 'hard'? 'btn ls ch': 'btn ls'" @click="() => {store.difficulty = 'hard'}" >Сложная</a-typography-title>
      <a-typography-title class="btn ls" @click="() => {store.state = 'begin'}" >Назад</a-typography-title>
      <!-- <a-button @click="start_game">Начать</a-button> -->
    </a-card>
    <!-- <a-button v-if="store.state == 'lose'" @click="start_game">Попробовать еще</a-button> -->
    <canvas v-if="store.state == 'start'" id="game" width="608" height="608"></canvas>
  </div>
</template>

<style>
.main {
  text-align: center;
  font-family: sans-serif;
}
.menu {
  width: 608px;
  height: 605px;
  margin: auto;
  background-image: url('./ground.png');
}
.title {
  margin: auto;
  margin-top: 220px; 
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.445);
  border-radius: 10px;
  width: 200px;
}
.btn {
  margin: auto;
  margin-top: 10px !important;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.445);
  border-radius: 10px;
  width: 200px;
}
.btn:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.767);
}
.ls {
  width: 440px;
}
.st {
  margin-top: 130px;
}
.bst {
  margin-top: 80px !important;
}
.ch {
  background-color: white;
}
.ch:hover {
  background-color: white;
  cursor: not-allowed;
}
</style>