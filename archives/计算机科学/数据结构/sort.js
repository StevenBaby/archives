/* jshint esversion: 8 */

var sort = function (sketch) {
    sketch.ratio = 1.77;

    sketch.length = 32;
    sketch.array = new Array(length);

    sketch.delay = 300;
    sketch.running = false;

    sketch.grey_color = sketch.color(130, 160, 185)
    sketch.red_color = sketch.color(219, 40, 40);
    sketch.orange_color = sketch.color(242, 113, 28);
    sketch.blue_color = sketch.color(3, 133, 208);
    sketch.purple_color = sketch.color(163, 51, 200);
    sketch.yellow_color = sketch.color(251, 189, 8);


    sketch.default_color = sketch.grey_color;
    sketch.compare_color = sketch.yellow_color;
    sketch.activate_first_color = sketch.blue_color;
    sketch.activate_second_color = sketch.red_color;
    sketch.activate = [];
    sketch.swaping = false;

    sketch.generate = function () {
        let set = [];
        for (let index = 5; index < 100; index++) {
            set.push(index);
        }

        let array = sketch.array;
        for (let i = 0; i < sketch.length; i++) {
            let index = parseInt(Math.random() * set.length);
            array[i] = set[index];
            set.splice(index, 1);
        }
        console.log(array);
    };

    sketch.get_width = function () {
        return parseInt($("#content").width());
    };

    sketch.get_box_width = function () {
        return sketch.width / sketch.length;
    };

    sketch.get_box_position = function (index) {
        var x = index * sketch.get_box_width();
        var y = sketch.height * (1 - sketch.array[index] / 100);
        return [x, y];
    };

    sketch.get_height = function () {
        return parseInt(sketch.get_width() / sketch.ratio);
    };

    sketch.setup = function () {
        sketch.createCanvas(sketch.get_width(), sketch.get_height());
        sketch.generate();
    };

    sketch.fill_box = function (index) {
        if (sketch.activate.length < 2) {
            sketch.fill(sketch.default_color);
        } else if (index == sketch.activate[0]) {
            sketch.fill(sketch.activate_first_color);
        } else if (index == sketch.activate[1]) {
            sketch.fill(sketch.activate_second_color);
        } else {
            sketch.fill(sketch.default_color);
        }
    };

    sketch.draw_box = function (index) {
        let array = sketch.array;
        let width = sketch.width;
        let height = sketch.height;
        let size = sketch.get_box_width();

        value = array[index];

        var w = size;
        var h = value * height / 100;
        var x = index * w;
        var y = height - h;
        var t = array[index];

        sketch.fill_box(index);
        sketch.rect(x, y, w, h);
        sketch.fill(255);
        sketch.textSize(w * 0.9);
        sketch.text(t, x, y, w, h);
    }

    sketch.draw = function () {
        sketch.clear();

        for (let index = 0; index < sketch.array.length; index++) {
            sketch.draw_box(index);
        }
    };

    sketch.sleep = function (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    sketch.wait = async function () {
        await sketch.sleep(sketch.delay);
    };

    sketch.swap = async function (array, first, second) {
        console.log('swap ' + first + " " + second);
        sketch.swaping = true;
        sketch.activate = [first, second];
        sketch.activate_first_color = sketch.blue_color;
        sketch.activate_second_color = sketch.red_color;

        await sketch.wait();
        let temp = array[first];
        array[first] = array[second];
        array[second] = temp;
        await sketch.wait();
        sketch.activate = [];
        sketch.swaping = false;
    };

    sketch.compare = async function (array, first, second) {
        sketch.activate = [first, second];

        sketch.activate_first_color = sketch.compare_color;
        sketch.activate_second_color = sketch.compare_color;

        await sketch.wait();
        if (array[first] < array[second]) {
            return true;
        } else {
            return false;
        }
    };

    sketch.algorithm = async function (array, start, end) {
        console.log('start algorithm');
        for (let i = start; i < end; i++) {
            for (let j = start + 1; j < end - i; j++) {
                if (!sketch.running) {
                    return;
                }
                let first = j - 1;
                let second = j;

                if (await sketch.compare(array, first, second))
                    continue;
                await sketch.swap(array, first, second);
            }
        }
    };

    sketch.run = async function () {
        sketch.running = true;
        await sketch.algorithm(sketch.array, 0, sketch.length);
        sketch.activate = [];
    };

    sketch.stop = function () {
        sketch.running = false;
    };

    sketch.windowResized = function () {
        sketch.resizeCanvas(sketch.get_width(), sketch.get_height());
    };
};

$(document).ready(function () {
    var sketch = new p5(sort, document.getElementById('content'));

    $('.start.button').click(function () {
        sketch.run();
    });

    $('.reset.button').click(function () {
        sketch.remove();
        sketch = new p5(sort, document.getElementById('content'));
    });

    $('.stop.button').click(function () {
        sketch.stop();
    });

    $('.speed.up.button').click(function () {
        sketch.delay -= 50;
    });

    $('.speed.down.button').click(function () {
        sketch.delay += 50;
    });
});