class Ghost {                                         // Клас для об'єкта Ghost
    constructor(                                      // Конструктор класу Ghost
        x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range
    ) {         
        this.x = x;                                    // Позиція по горизонталі                      
        this.y = y;                                    // Позиція по вертикалі
        this.width = width;                            // Розміри персонажа
        this.height = height;                          // Розміри персонажа
        this.speed = speed;                            // На скільки пікселів Пакмен пересуватиметься за один кадр
        this.direction = DIRECTION_RIGHT;              // Початковий напрямок руху
        this.imageX = imageX;                            // Координата X для спрайта привида
        this.imageY = imageY;                            // Координата Y для спрайта привида
        this.imageWidth = imageWidth;                    // Ширина спрайта привида
        this.imageHeight = imageHeight;                  // Висота спрайта привида
        this.range = range;                              // Діапазон руху привида
        this.randomTargetsIndex = parseInt(             // Випадковий індекс для вибору цілі з масиву випадкових цілей для привидів
            Math.random() * randomTargetsForGhosts.length
        );
            setInterval(() => { 
                this.changeRandomDirection();
            }, 10000);
    }
   isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true;
        }
        return false;
    }

    changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }


    moveProcess() {                                    // Логіка переміщення Пакмена
        if (this.isInRange()) {
            this.target = pacman
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetsIndex];
        }
        this.checkDirectionIfPossible();                   // Перевірка можливості зміни напрямку
        this.moveForwards();                                // Рух вперед
        if (this.checkCollision()) {                            // Перевірка зіткнення зі стіною (Прибрати тремтіння перед стіною)
            this.moveBackwards();                               // Відкат назад при зіткненні зі стіною
            return;
        }
    }
    
    moveBackwards() {                                  // Логіка відкату назад при зіткненні зі стіною
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break;
        }
    }
     
    moveForwards() {                                   // Логіка руху вперед при відкаті назад
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {                                 // Логіка перевірки зіткнень
        if (
            map[this.getMapY()][this.getMapX()] === 1 ||                  // Перевірка верхнього лівого кута.
            map[this.getMapY()][this.getMapXRightSide()] === 1 ||         // Перевірка верхнього правого кута.
            map[this.getMapYRightSide()][this.getMapX()] === 1 ||         // Перевірка нижнього лівого кута.
            map[this.getMapYRightSide()][this.getMapXRightSide()] === 1   // Перевірка нижнього правого кута.
        ) {
            return true;
        } 
        return false;
    }

    checkGhostCollision() {                            // Логіка перевірки зіткнень з привидом
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }
        return false;
    }

    isInRangeOfPacman() { 
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX()); // Відстань по горизонталі між привидом і Пакменом
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY()); // Відстань по вертикалі між привидом і Пакменом
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range // Перевірка, чи знаходиться Пакмен в діапазоні руху привида
        ) {
            return true;
        }
        return false;
    }

    checkDirectionIfPossible() {                         // Перевірка, чи може Пакмен рухатися в заданому напрямку
        let tempDirection = this.direction;                   // Збереження поточного напрямку в тимчасовій змінній
        this.direction = this.calculateNewDirection(      // Зміна напрямку на наступний
            map,
            this.target.getMapX ? this.target.getMapX() : this.target.x / oneBlokSize,
            this.target.getMapY ? this.target.getMapY() : this.target.y / oneBlokSize
        );

        if (typeof this.direction == "undefined") {           // Якщо calculateNewDirection повертає undefined, то залишаємо старе направление
            this.direction = tempDirection
            return
        }

        this.moveForwards();                                   // Рух вперед в новому напрямку
        if (this.checkCollision()) {                            // Якщо після изменения направления произошло столкновение, то откатываемся назад и сохраняем старое направление
            this.moveBackwards();
            this.direction = tempDirection;
        } else {                                                  // Если после изменения направления столкновения не произошло, то сохраняем новое направление
            this.moveBackwards();
        }
    }
    calculateNewDirection(map, destX, destY) {                  // Функція для розрахунку нового напрямку
        let mp = []                                              // Копія карти
        for (let i = 0; i < map.length; i++) {                   // Копіювання карти
            mp[i] = map[i].slice();                              // Копіювання рядка
        }
        let queue = [                                          // Ініціалізація черги
            {
                x: this.getMapX(), 
                y: this.getMapY(),
                moves: [],
            },
        ];
        while (queue.length > 0) {                               // Поки є елементи в черзі
            let poped = queue.shift();                              // Витягування першого елемента з черги
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];                              // Повернення першого руху
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp); // Додавання сусідів до черги
                for (let i = 0; i < neighborList.length; i++) { // Перебір сусідів
                    queue.push(neighborList[i]);
                }
            }
        }
        return DIRECTION_UP;
    }

    addNeighbors(poped, mp) {                                      // Функція для додавання сусідів до черги
        let queue = [];
        let numOfRows = mp.length;
        let numOfColums = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({
                x: poped.x - 1,
                y: poped.y,
                moves: tempMoves,
            });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({
                x: poped.x + 1,
                y: poped.y,
                moves: tempMoves,
            });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfRows &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({
                x: poped.x,
                y: poped.y - 1,
                moves: tempMoves,
            });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfRows &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({
                x: poped.x,
                y: poped.y + 1,
                moves: tempMoves,
            });
        }
        return queue;
    }

    changeAnimation() {                                  // Зміна анімації
        this.currenntFrame = this.currenntFrame == this.frameCount ? 1 : this.currenntFrame + 1;  // Збільшення поточного кадру на 1
    }

    draw() {                                            // Логіка малювання Привида
        canvasContext.save();                                  // Збереження поточного стану канваса
    
        canvasContext.drawImage(                                // Малювання спрайта Привида на канвасі
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );

        canvasContext.restore();                               // Відновлення попереднього стану канваса
    }
     
    getMapX() {                                           // Отримання координати X на карті
        return parseInt(this.x / oneBlokSize);
    }
    getMapY() {                                           // Отримання координати Y на карті
        return parseInt(this.y / oneBlokSize);
    }
    getMapXRightSide() {                                  // Отримання координати правої сторони на карті
        return parseInt((this.x + 0.9999 * oneBlokSize) / oneBlokSize);
    }
    getMapYRightSide() {                                  // Отримання координати нижньої сторони на карті
        return parseInt((this.y + 0.9999 * oneBlokSize) / oneBlokSize);
    }
}