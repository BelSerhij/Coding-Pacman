class Pacman {                                         // Клас для об'єкта Pacman
    constructor(x, y, width, height, speed) {          // Конструктор класу Pacman
        this.x = x;                                    // Позиція по горизонталі                      
        this.y = y;                                    // Позиція по вертикалі
        this.width = width;                            // Розміри персонажа
        this.height = height;                          // Розміри персонажа
        this.speed = speed;                            // На скільки пікселів Пакмен пересуватиметься за один кадр
        this.direction = DIRECTION_RIGHT;              // Початковий напрямок руху
        this.nextDirection = this.direction;           // Наступний напрямок руху
        this.currenntFrame = 1;                        //  кількість кадрів у вашому спрайті (початок закритий рот 1)
        this.frameCount = 7;                           // Кількість кадрів анімації для руху в одному напрямку
    
        setInterval(() => {
            this.changeAnimation();                       // Запуск анімації з певною частотою (можна налаштувати)
    },100)
    }

    moveProcess() {                                    // Логіка переміщення Пакмена
        this.checkDirectionIfPossible();                   // Перевірка можливості зміни напрямку
        this.moveForwards();                                // Рух вперед
        if (this.checkCollision()) {                            // Перевірка зіткнення зі стіною (Прибрати тремтіння перед стіною)
            this.moveBackwards();                               // Відкат назад при зіткненні зі стіною
        }
    }
    eat() {                                            // Логіка поїдання точок
      for (let i = 0; i < map.length; i++) {                           // Перебір рядків
          for (let j = 0; j < map[0].length; j++) {                    // Перебір стовпців
              if (map[i][j] == 2 &&                                    // 1 - стіна, 2 - їжа
                  this.getMapX() === j &&                              // Перевірка позиції по горизонталі
                  this.getMapY() === i    // Перевірка позиції по вертикалі
              ) {
                  map[i][j] = 3;                                    // Знищення їжі
                  score++;                                          // Збільшення рахунку
              }
          }
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

    checkGhostCollision(ghosts) {                            // Логіка перевірки зіткнень з привидом
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

    checkDirectionIfPossible() {                         // Перевірка, чи може Пакмен рухатися в заданому напрямку
        if (this.direction === this.nextDirection) return        // Якщо поточний напрямок збігається з наступним, то немає потреби перевіряти
           
        let tempDirection = this.direction;                      // Збереження поточного напрямку в тимчасовій змінній
        this.direction = this.nextDirection;                      // Зміна напрямку на наступний
        this.moveForwards();                                   // Рух вперед в новому напрямку
        if (this.checkCollision()) {                            // Якщо після изменения направления произошло столкновение, то откатываемся назад и сохраняем старое направление
            this.moveBackwards();
            this.direction = tempDirection;
        } else {                                                  // Если после изменения направления столкновения не произошло, то сохраняем новое направление
            this.moveBackwards();
        }
    }
    changeAnimation() {                                  // Зміна анімації
        this.currenntFrame = this.currenntFrame == this.frameCount ? 1 : this.currenntFrame + 1;  // Збільшення поточного кадру на 1
    }

    draw() {                                                   // Логіка малювання Пакмена
        canvasContext.save();                                  // Збереження поточного стану канваса
        
        canvasContext.translate(                               // Переміщення канваса в позицію Пакмена
            this.x + oneBlokSize / 2,
            this.y + oneBlokSize / 2
        );            
        
        canvasContext.rotate(this.direction * 90 * Math.PI / 180);    // Поворот канваса відповідно до напрямку руху Пакмена
        
        canvasContext.translate(                               
            -this.x - oneBlokSize / 2,
            -this.y - oneBlokSize / 2
        ); 

        canvasContext.drawImage(                                // Малювання спрайта Пакмена на канвасі
            pacmanFrames,
            (this.currenntFrame - 1) * oneBlokSize,
            0,
            oneBlokSize,
            oneBlokSize,
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