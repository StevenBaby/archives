var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 20;
var height = 15;
var size = 30;
var length = 2; // 初始化长度
var interval = 200;

var grey = 'grey';
var green = 'green';
var red = 'red';
var orange = 'orange';
var pink = 'pink';
var transparent = 'transparent';

var line_color = grey;
var body_color = green;
var head_color = red;
var food_color = orange;
var next_color = pink;

var snake = new Snake();

function Box(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}

Box.prototype.draw = function () {
    context.beginPath();
    context.fillStyle = this.color;
    context.rect(this.x * size, this.y * size, size, size);
    context.fill();
    if (this.color !== transparent)
        context.stroke();
};

function Snake() {
    this.canvas = canvas;
    this.context = context;
    this.map = {};
    for (i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            key = i + '-' + j;
            this.map[key] = {};
            this.map[key].x = i;
            this.map[key].y = j;
        }
    }
}

Snake.prototype.new_game = function () {
    this.body = [];
    for (var i = 0; i < length; i++) {
        this.body[i] = new Box(i, 0, body_color);
    }

    this.head = new Box(i, 0, head_color);
    this.next = null;
    this.food = this.get_random_food();

    // 37 左，38 上，39 右，40 下
    this.direction = 39;
    this.direct = 39;
};

Snake.prototype.draw = function () {
    for (var i = 0; i < this.body.length; i++) {
        this.body[i].draw();
    }
    this.head.draw();
    this.food.draw();
    if (this.next != null) this.next.draw();
    this.draw_line();
};

Snake.prototype.draw_line = function () {
    for (i = 0; i < height + 1; i++) {
        context.strokeStyle = line_color;
        context.beginPath();
        context.moveTo(0, i * size);
        context.lineTo(canvas.width, i * size);
        context.closePath();
        context.stroke();
    }

    for (i = 0; i < width + 1; i++) {
        context.strokeStyle = line_color;
        context.beginPath();
        context.moveTo(i * size, 0);
        context.lineTo(i * size, canvas.height);
        context.closePath();
        context.stroke();
    }
};

Snake.prototype.get_random_food = function () {
    var body = {};
    var remain = [];

    var key = this.head.x + '-' + this.head.y;
    body[key] = true;

    this.body.forEach(function (box) {
        key = box.x + '-' + box.y;
        body[key] = true;
    });

    for (var name in this.map) {
        if (name in body) continue;
        remain.push(this.map[name]);
    }

    var value = remain[Math.round(Math.random() * (remain.length - 1))];
    var food = new Box(value.x, value.y, orange);
    return food;
};

Snake.prototype.check = function () {
    if (this.death()) {
        alert('Game Over');
        return true;
    }
    return false;
};

Snake.prototype.death = function () {
    // 撞墙
    if (this.head.x >= width) return true;
    if (this.head.y >= height) return true;
    if (this.head.x < 0) return true;
    if (this.head.y < 0) return true;

    // 撞身体
    for (var i = 0; i < this.body.length; i++) {
        var box = this.body[i];
        if (box.x != this.head.x) continue;
        if (box.y != this.head.y) continue;
        return true;
    }
    return false;
};

Snake.prototype.eat = function () {
    if (this.next.x == this.food.x && this.next.y == this.food.y) {
        this.food = this.get_random_food();
        this.eaten = true;
        return true;
    }
    this.eaten = false;
    return false;
};

Snake.prototype.get_next_box = function () {
    // 37 左，38 上，39 右，40 下

    if (this.check()) return this.next;

    deltas = {
        37: [-1, 0],
        38: [0, -1],
        39: [1, 0],
        40: [0, 1],
    };

    delta = deltas[this.direction];

    var x = this.head.x + delta[0];
    var y = this.head.y + delta[1];
    return new Box(x, y, next_color);
};

Snake.prototype.move = function () {
    this.direction = this.direct;
    if (this.check()) return;

    if (this.next == null)
        this.next = this.get_next_box();

    if (!this.eat()) {
        this.body.shift();
    }

    this.next.color = head_color;
    this.body.push(this.head);
    this.head.color = body_color;
    this.head = this.next;
    this.next = null;
};


Snake.prototype.start = function () {
    if (snake.check()) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    snake.move();
    if (snake.eaten) {
        snake.eaten = false;
        setTimeout(snake.start, interval + 100);
    } else {
        setTimeout(snake.start, interval);
    }
};

function resize() {
    size = $('.segment.canvas').width() / width;
    canvas.width = $('.segment.canvas').width();
    canvas.height = $('.segment.canvas').width() * height / width;
}

$(window).resize(function () {
    resize();
    snake.draw();
});

$(document).ready(function () {
    resize();
    snake.new_game();
    snake.start();
});

$(document).keydown(function (e) {
    // 37 左，38 上，39 右，40 下
    var event = e || window.event;
    if (e.keyCode == 32) { // 如果是空格，重新开始
        snake.new_game();
        return;
    }

    changes = {
        37: [38, 40],
        39: [38, 40],
        38: [37, 39],
        40: [37, 39],
    };

    change = changes[snake.direction];
    if (!change.includes(event.keyCode)) return;
    snake.direct = event.keyCode;
    event.preventDefault();
});