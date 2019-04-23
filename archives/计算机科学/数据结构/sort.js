/* jshint esversion: 8 */

var sort = function (sketch) {
    sketch.ratio = 1.77;

    sketch.length = 32;
    sketch.array = new Array(length);

    sketch.delay = 300;
    sketch.running = false;

    sketch.break_color = sketch.color(130, 160, 185);
    sketch.grey_color = sketch.color(118, 118, 118);
    sketch.red_color = sketch.color(219, 40, 40);
    sketch.orange_color = sketch.color(242, 113, 28);
    sketch.blue_color = sketch.color(3, 133, 208);
    sketch.purple_color = sketch.color(163, 51, 200);
    sketch.yellow_color = sketch.color(251, 189, 8);


    sketch.default_color = sketch.grey_color;
    sketch.activate_color = sketch.break_color;
    sketch.compare_color = sketch.yellow_color;
    sketch.first_color = sketch.blue_color;
    sketch.second_color = sketch.red_color;
    sketch.indices = [];
    sketch.activate = [];
    sketch.swaping = false;

    sketch.random_pivot = false;

    sketch.temp_value = null;

    sketch.generate = function () {
        let set = [];
        for (let index = 10; index < 100; index++) {
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
        if (sketch.indices.length != 2) {
            sketch.fill(sketch.activate_color);
        } else if (index == sketch.indices[0]) {
            sketch.fill(sketch.first_color);
            return;
        } else if (index == sketch.indices[1]) {
            sketch.fill(sketch.second_color);
            return;
        }

        if (sketch.activate[0] > index) {
            sketch.fill(sketch.default_color);
        } else if (sketch.activate[1] < index) {
            sketch.fill(sketch.default_color);
        } else {
            sketch.fill(sketch.activate_color);
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
    };

    sketch.draw_temp = function () {
        if (sketch.temp_value == null) return;

        let size = sketch.get_box_width();
        let height = sketch.temp_value * sketch.height / 100;
        sketch.fill(sketch.purple_color);
        sketch.rect(0, 0, height, size);
        sketch.fill(255);
        sketch.textSize(size * 0.9);
        sketch.text(sketch.temp_value, 0, 0, height, size);
    };

    sketch.draw = function () {
        sketch.clear();
        sketch.draw_temp();
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

    sketch.swap = async function (sketch, first, second) {
        console.log('swap ' + first + " " + second);
        if (first == second) return;

        let array = sketch.array;
        sketch.swaping = true;
        sketch.indices = [first, second];
        sketch.first_color = sketch.blue_color;
        sketch.second_color = sketch.red_color;

        await sketch.wait();
        let temp = array[first];
        array[first] = array[second];
        array[second] = temp;

        await sketch.wait();
        sketch.indices = [];
        sketch.swaping = false;
    };

    sketch.set = async function (sketch, index, value) {
        let array = sketch.array;

        sketch.swaping = true;
        sketch.indices = [index, array.length];
        sketch.first_color = sketch.blue_color;
        sketch.second_color = sketch.red_color;

        await sketch.wait();
        array[index] = value;

        await sketch.wait();
        sketch.indices = [];
        sketch.swaping = false;
    };

    sketch.compare = async function (sketch, first, second) {
        let array = sketch.array;

        sketch.indices = [first, second];

        sketch.first_color = sketch.compare_color;
        sketch.second_color = sketch.compare_color;

        let first_value = array[first];
        let second_value = null;
        if (second == array.length) {
            second_value = sketch.temp_value;
        } else {
            second_value = array[second];
        }

        await sketch.wait();
        if (first_value < second_value) {
            return true;
        } else {
            return false;
        }
    };

    sketch.algorithm = async function (sketch, start, end) {

    };

    sketch.bubble_sort = async function (sketch, start, end) {
        for (let i = start; i <= end; i++) {
            sketch.activate = [start, end - i];

            for (let j = start + 1; j <= end - i; j++) {
                if (!sketch.running) return;

                let first = j - 1;
                let second = j;

                if (await sketch.compare(sketch, first, second))
                    continue;
                await sketch.swap(sketch, first, second);
            }
        }
    };

    sketch.quick_sort = async function (sketch, start, end) {
        if (start >= end) return;
        if (!sketch.running) return;

        console.log('start algorithm');
        let array = sketch.array;
        sketch.activate = [start, end];

        if (sketch.random_pivot) {
            let index = parseInt(Math.random() * (end - start) + start);
            console.log('random index ' + index + ' ' + start + " " + end);
            await sketch.swap(sketch, start, index);
        }
        sketch.temp_value = array[start];

        let low = start;
        let high = end;

        while (low < high) {
            while (low < high && !await sketch.compare(sketch, high, array.length)) {
                if (!sketch.running) return;
                high--;
            }
            await sketch.swap(sketch, low, high);

            while (sketch.running && low < high && await sketch.compare(sketch, low, array.length)) {
                if (!sketch.running) return;
                low++;
            }
            await sketch.swap(sketch, low, high);
        }
        console.log('array low ' + low + ' high ' + high);
        
        if (!sketch.running) return;
        await sketch.algorithm(sketch, start, low - 1);

        if (!sketch.running) return;
        await sketch.algorithm(sketch, low + 1, end);

        if (!sketch.running) return;
    };

    sketch.random_quick_sort = async function(sketch, start, end){
        sketch.random_pivot = true;
        await sketch.quick_sort(sketch, start, end);
    };

    sketch.merge_sort = async function(sketch, start, end){
        if (start >= end) return;
        if (!sketch.running) return;
        let mid = parseInt((end - start) / 2) + start;
        sketch.activate = [start, end];
        await sketch.wait();
        await sketch.merge_sort(sketch, start, mid);
        await sketch.merge_sort(sketch, mid + 1, end);
        if (!sketch.running) return;

        sketch.activate = [start, end];
        sketch.activate_color = sketch.yellow_color;
        await sketch.wait();

        sketch.activate_color = sketch.break_color;
        let array = sketch.array;
        let left = array.slice(start, mid + 1);
        let right = array.slice(mid + 1, end + 1);
        
        let i = 0;
        let j = 0;

        let index = start;

        while(i < left.length && j < right.length){
            if (!sketch.running) return;
            if(left[i] < right[j]){
                await sketch.set(sketch, index, left[i]);
                i++;
                index++;
            }else{
                await sketch.set(sketch, index, right[j]);
                j++;
                index++;
            }
        }
        while (i < left.length){
            if (!sketch.running) return;
            await sketch.set(sketch, index, left[i]);
            i ++;
            index++;
        }

        while (j < right.length){
            if (!sketch.running) return;
            await sketch.set(sketch, index, right[j]);
            j ++;
            index++;
        }
    };

    sketch.run = async function () {
        sketch.running = true;
        await sketch.algorithm(sketch, 0, sketch.length - 1);

        sketch.indices = [];
        sketch.activate = [0, sketch.length - 1];
        sketch.temp_value = null;
        sketch.running = false;
        console.log(sketch.array);
    };

    sketch.stop = function () {
        sketch.running = false;
    };

    sketch.windowResized = function () {
        sketch.resizeCanvas(sketch.get_width(), sketch.get_height());
    };
};

var sketch = null;

$(document).ready(function () {

    sketch = new p5(sort, document.getElementById('content'));

    $('.start.button').click(function () {
        if (sketch.running) return;
        let sort_type = $('#sort_type').val();
        console.log(sort_type);
        if (sort_type == 'bubble_sort'){
            sketch.algorithm = sketch.bubble_sort;
        }else if (sort_type == 'quick_sort'){
            sketch.random_pivot = false;
            sketch.algorithm = sketch.quick_sort;
        }else if (sort_type == 'random_quick_sort'){
            sketch.algorithm = sketch.random_quick_sort;
        }else if (sort_type == 'merge_sort'){
            sketch.algorithm = sketch.merge_sort;
        }
        sketch.run();
    });

    $('.reset.button').click(function () {
        sketch.stop();
        sketch.remove();
        sketch = new p5(sort, document.getElementById('content'));
    });

    $('.stop.button').click(function () {
        sketch.stop();
    });

    $('.speed.down.button').click(function () {
        sketch.delay += 100;
    });

    $('.speed.up.button').click(function () {
        if (sketch.delay <= 0) {
            sketch.delay = 0;
        }
        sketch.delay /= 1.5;
    });

    $('.ui .dropdown').dropdown();
});