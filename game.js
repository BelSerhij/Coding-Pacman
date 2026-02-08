const canvas = document.getElementById("canvas"); 
const canvasContext = canvas.getContext("2d");              //Графічний редактор для малювання на канвасі
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghost");

let createRect = (x, y, width, height, color) => {          // Функція для створення прямокутника
    canvasContext.fillStyle = color;                        // Встановлюємо колір заливки
    canvasContext.fillRect(x, y, width, height);            // Малюємо прямокутник
}
let fps = 30;                                                // Кількість кадрів в секунду
let oneBlokSize = 20;                                        
let wallColor = "#342DCA";    
let wallSpaseWidth = oneBlokSize / 1.5;                      // Ширина проміжку між стінами
let wallOffset = (oneBlokSize - wallSpaseWidth) / 2;         // Зсув стіни
let wallInnerColor = "black";                                // Колір внутрішньої частини стіни
let footColor = "yellow";                                    // Колір їжі
let score = 0;                                                // Рахунок гравця
let ghosts = [];                                               // Масив для зберігання привидів
let ghostCount = 4;                                          // Кількість привидів
let lives = 3;                                              // Кількість життів
let foodCount = 0;                                         // Кількість їжі

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1; 

let ghostLocation = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
    for (let i = 0; i < map.length; i++) {                           // Перебір рядків
        for (let j = 0; j < map[0].length; j++) {                    // Перебір стовпців
            if (map[i][j] == 2) {                                   // 1 - стіна, 2 - їжа
                foodCount++;
            }
        }
    } 

let randomTargetsForGhosts = [
    { x: 1 * oneBlokSize, y: 1 * oneBlokSize },
    { x: 1 * oneBlokSize, y: (map.length - 2) * oneBlokSize },
    { x: (map[0].length - 2) * oneBlokSize, y: oneBlokSize },
    {
        x: (map[0].length - 2) * oneBlokSize, 
        y: (map.length - 2) * oneBlokSize,  
     },
];

let gameLoop = () => {                                     //  Основний цикл гри
    draw()                                                 //  Малювання на канвасі
    update()                                               //  Оновлення стану гри
                                                
};

let update = () => {                                       //  Оновлення стану гри
    pacman.moveProcess();                                    //  Логіка переміщення Пакмена 
    pacman.eat();                                            //  Логіка поїдання їжі
    for (let i = 0; i < ghosts.length; i++) {        // Перебір привидів
        ghosts[i].moveProcess();                           // Логіка переміщення привидів
    }
    if (pacman.checkGhostCollision(ghosts)) {                       // Якщо Пакмен зіткнувся з привидом
        console.log("Game Over");
        restartGame();                                            // Перезапустити гру
    }
    if (score >= foodCount) {                                   // Якщо Пакмен з'їв всю їжу
        console.log("You Win!");
        drawWin();
        clearInterval(gameInterval);                             // Зупинка основного циклу гри
    }
};
let restartGame = () => {                                     //  Функція для перезапуску гри
    createNewPacman();
    createGhosts();
    lives--;
    if (lives == 0) {                                    // Якщо життів не залишилось, то перезапускаємо гру з початку  
        gameOver();
    }
};

let gameOver = () => {                                        //  Функція для закінчення гри
    clearInterval(gameInterval);                             // Зупинка основного циклу гри
    drawGameOver();
};
let drawGameOver = () => {
    canvasContext.font = "50px Emulogic";                       //  Шрифт тексту
    canvasContext.fillStyle = "white"; 
    canvasContext.fillText("Game Over!", 150, 200);//
}
let drawWin = () => {
    canvasContext.font = "50px Emulogic";                       //  Шрифт тексту
    canvasContext.fillStyle = "white"; 
    canvasContext.fillText("You Win!", 150, 200);//
    canvasContext.fillText("Winner Winner", 50, 300);
    canvasContext.fillText(" chichken diner!!!", 30, 350);
}
let drawLives = () => {                                          //  Малювання життів
    canvasContext.font = "20px Emulogic";                       //  Шрифт тексту
    canvasContext.fillStyle = "white";                       //  Колір тексту
    canvasContext.fillText(                                 //  Виведення кількості життів на канвас
        "Lives: " + lives,
        220,
        oneBlokSize * (map.length + 1) + 10 
    );
    for (let i = 0; i < lives; i++) { // 
        canvasContext.drawImage(                           // Малювання іконки життя (Пакмена) для кожного життя
            pacmanFrames,
            2 * oneBlokSize,
            0,
            oneBlokSize,
            oneBlokSize,
            350 + i * (oneBlokSize + 5),
            oneBlokSize * map.length + 10,
            oneBlokSize,
            oneBlokSize
        );
    }
};

let drawFoods = () => {                                              //  Малювання їжі
    for (let i = 0; i < map.length; i++) {                           // Перебір рядків
        for (let j = 0; j < map[0].length; j++) {                    // Перебір стовпців
            if (map[i][j] == 2) {                                   // 1 - стіна, 2 - їжа
                createRect(
                    j * oneBlokSize + oneBlokSize / 3,
                    i * oneBlokSize + oneBlokSize / 3,
                    oneBlokSize / 3,
                    oneBlokSize / 3,
                    footColor
                );
            }
        }
    }
};    

let drawScore = () => {                                     //  Малювання рахунку
    canvasContext.fillStyle = "white";                       //  Колір тексту
    canvasContext.font = "20px Emulogic";                       //  Шрифт тексту
    canvasContext.fillText(                                 //  Виведення рахунку на канвас
        "Score: " + score,
        0,
        oneBlokSize * (map.length + 1) + 10
    ); 
};

let drawGhosts = () => {                                     //  Малювання привидів
    for (let i = 0; i < ghosts.length; i++) {        // Перебір привидів
        ghosts[i].draw();                            // Малювання привида
    }
};

let draw = () => {                                              //  Малювання на канвасі
    createRect(0, 0, canvas.width, canvas.height, "black");     // Заливка фону чорним кольором
    drawWalls();                                                //  Малювання стін
    drawFoods();                                                //  Малювання їжі
    pacman.draw();                                             //  Малювання Пакмена
    drawScore();                                              //  Малювання рахунку
    drawGhosts();                                            //  Малювання привидів
    drawLives();                                             //  Малювання життів
};

let gameInterval = setInterval(gameLoop, 1000 / fps);    // Запуск основного циклу гри з частотою кадрів (fps)

let drawWalls = () => {                                  // Малювання стін
    for (let i = 0; i < map.length; i++) {               // Перебір рядків
        for (let j = 0; j < map[0].length; j++) {        // Перебір стовпців
            if (map[i][j] == 1) {                       // 1 - стіна, 2 - ігнор
                createRect(
                    j * oneBlokSize,                     // Координати блоку по горизонгталі
                    i * oneBlokSize,                     // Координати блоку по вертикалі
                    oneBlokSize,
                    oneBlokSize,
                    wallColor                            // Колір стіни
                );
                if (j > 0 && map[i][j - 1] == 1) {       // Якщо зліва є стіна, то малюємо ліву межу
                    createRect(
                        j * oneBlokSize,                 // Координати блоку по горизонгталі
                        i * oneBlokSize + wallOffset,    // Координати блоку по вертикалі
                        wallSpaseWidth + wallOffset,      // Ширина
                        wallSpaseWidth,                   // Висота
                        wallInnerColor                    // Колір внутрішньої частини стіни
                    );
                }
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {  // Якщо справа є стіна, то малюємо праву межу
                    createRect(
                        j * oneBlokSize + wallOffset,       
                        i * oneBlokSize + wallOffset,       
                        wallSpaseWidth + wallOffset,        
                        wallSpaseWidth,                     
                        wallInnerColor                      
                    );
                }
                   if (i > 0 && map[i - 1][j] == 1) {       // Якщо зверху є стіна, то малюємо нижню межу
                    createRect(
                        j * oneBlokSize + wallOffset,      
                        i * oneBlokSize,                    
                        wallSpaseWidth,                      
                        wallSpaseWidth + wallOffset,       
                        wallInnerColor                    
                    );
                }
                if (i < map.length - 1 && map[i + 1][j] == 1) {  // Якщо знизу є стіна, то малюємо верхню межу
                    createRect(
                        j * oneBlokSize + wallOffset,       
                        i * oneBlokSize + wallOffset,       
                        wallSpaseWidth,        
                        wallSpaseWidth + wallOffset,                     
                        wallInnerColor                      
                    );
                }
            }
        }
    }
};

let createNewPacman = () => {                      // Створення нового об'єкта Пакмена з заданими параметрами
    pacman = new Pacman(
        oneBlokSize,
        oneBlokSize,
        oneBlokSize,
        oneBlokSize,
        oneBlokSize / 5
    );
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlokSize + (i % 2 == 0 ? 0 : 1) * oneBlokSize,
            10 * oneBlokSize + (i % 2 == 0 ? 0 : 1) * oneBlokSize,   
            oneBlokSize,
            oneBlokSize,
            pacman.speed / 2,
            ghostLocation[i % 4].x,
            ghostLocation[i % 4].y,
            124,
            116,
            6 + i,
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();                               // Виклик функції для створення Пакмена 
createGhosts();                                 // Виклик функції для створення привидів
gameLoop();                                     // Виклик функції для запуску основного циклу гри

window.addEventListener("keydown", (event) => {   // Додавання обробника події для натискання клавіш
    let k = event.keyCode;                         // Отримання натиснутої клавіші

    setTimeout(() => {                               // Використання setTimeout для затримки виконання коду, щоб уникнути проблем з обробкою швидких натискань клавіш
        if (k == 37 || k == 65) {                                  // Ліва стрілка
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {                           // Вверх стрілка
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {                           // Праворуч стрілка
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {                           // Вниз стрілка
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});