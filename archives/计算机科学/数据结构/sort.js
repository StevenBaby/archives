/* jshint esversion: 8 */

var sort = function (sketch) {
    sketch.ratio = 1.77;

    sketch.length = 32;
    sketch.max_num = 100;
    sketch.min_num = 10;

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

    sketch.green_color = sketch.color(33,186,69);
    sketch.teal_color = sketch.color(0,181,173);
    sketch.pink_color = sketch.color(224,57,151);
    sketch.brown_color = sketch.color(165,103,63);
    sketch.violet_color = sketch.color(100,53,201);
    sketch.olive_color = sketch.color(167,189,13);

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
    sketch.shell_size = sketch.length;
    sketch.shell_indices = [];

    sketch.buckets = [];

    sketch.buckets_color = [
        25,
        50,
        75,
        100,
        125,
        150,
        175,
        200,
        225,
        255,
    ];

    sketch.generate = function () {
        let set = [];
        for (let index = sketch.min_num; index < sketch.max_num; index++) {
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
        var y = sketch.height * (1 - sketch.array[index] / sketch.max_num);
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

        } else if (index == sketch.indices[0]) {
            sketch.fill(sketch.first_color);
            return;
        } else if (index == sketch.indices[1]) {
            sketch.fill(sketch.second_color);
            return;
        }

        function is_index(item, iter, array) {
            return (item == index);
        }


        function is_value(item, iter, array){
            return sketch.array[index] == item;
        }

        if (sketch.activate.length <= 0) {
            sketch.fill(sketch.activate_color);
        } else if (sketch.activate.some(is_index)) {
            sketch.fill(sketch.activate_color);
        } else {
            sketch.fill(sketch.default_color);
        }

        if (sketch.buckets.length > 0) {
            for (let i = 0; i < sketch.buckets.length; i++) {
                const bucket = sketch.buckets[i];
                if (bucket.some(is_value)) {
                    sketch.fill(sketch.buckets_color[i]);
                }
            }
        }
    };

    sketch.draw_box = function (index) {
        let array = sketch.array;
        let width = sketch.width;
        let height = sketch.height;
        let size = sketch.get_box_width();

        value = array[index];

        var w = size;
        var h = value * height / sketch.max_num;
        var x = index * w;
        var y = height - h;
        var t = array[index];

        sketch.fill_box(index);
        sketch.rect(x, y, w, h);
        sketch.fill(255);
        sketch.textSize(w * 0.9 * 2 / sketch.get_bit(sketch.max_num));
        sketch.text(t, x, y, w, h);
    };

    sketch.draw_temp = function () {
        if (sketch.temp_value == null) return;

        let size = sketch.get_box_width();
        let height = sketch.temp_value * sketch.height / sketch.max_num;
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

    sketch.set_activate = function (begin, end) {
        sketch.activate = [];
        for (let i = begin; i <= end; i++) {
            sketch.activate.push(i);
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
            sketch.set_activate(start, end - i);

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

    sketch.select_sort = async function (sketch, start, end) {
        let max_index = null;

        for (let i = end; i >= start; i--) {
            sketch.set_activate(start, i);
            max_index = start;
            for (let j = start + 1; j <= i; j++) {
                if (!sketch.running) return;
                if (await sketch.compare(sketch, j, max_index))
                    continue;
                max_index = j;
            }
            await sketch.swap(sketch, max_index, i);
        }
    };

    sketch.insert_sort = async function (sketch, start, end) {
        let array = sketch.array;
        for (let i = start + 1; i <= end; i++) {
            sketch.set_activate(start, i);
            sketch.temp_value = array[i];

            let j = i - 1;
            for (; j >= start; j--) {
                if (!sketch.running) return;
                if (await sketch.compare(sketch, j, sketch.length)) {
                    break;
                }
                await sketch.set(sketch, j + 1, array[j]);
            }
            await sketch.set(sketch, j + 1, sketch.temp_value);
        }
    };

    sketch.shell_sort_1 = async function (sketch, start, end) {
        let array = sketch.array;
        let size = sketch.length;
        while (size >= 1) {
            for (let i = start + size; i <= end; i++) {

                sketch.activate = [];
                for (let k = i - size; k <= end; k += size) {
                    sketch.activate.push(k);
                }

                sketch.temp_value = array[i];
                let j = i - size;

                for (; j >= start; j -= size) {
                    if (!sketch.running) return;
                    if (await sketch.compare(sketch, j, sketch.length)) {
                        break;
                    }
                    await sketch.set(sketch, j + size, array[j]);
                }
                await sketch.set(sketch, j + size, sketch.temp_value);
            }
            size = parseInt(size / 2);
        }
    };

    sketch.shell_sort = async function (sketch, start, end) {
        let array = sketch.array;
        let size = parseInt(sketch.length / 2);
        while (size >= 1) {
            console.log('shell_sort size ' + size);

            for (let i = start + size; i <= 2 * size; i++) {
                sketch.activate = [];
                for (let k = i - size; k <= end; k += size) {
                    sketch.activate.push(k);
                }

                for (let k = i; k <= end; k += size) {
                    sketch.temp_value = array[k];
                    let j = k - size;

                    for (; j >= start; j -= size) {
                        if (!sketch.running) return;
                        if (await sketch.compare(sketch, j, sketch.length)) {
                            break;
                        }
                        await sketch.set(sketch, j + size, array[j]);
                    }
                    await sketch.set(sketch, j + size, sketch.temp_value);
                }
            }
            size = parseInt(size / 2);
        }
    };

    sketch.quick_sort = async function (sketch, start, end) {
        if (start >= end) return;
        if (!sketch.running) return;

        console.log('start algorithm');
        let array = sketch.array;
        sketch.set_activate(start, end);

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

    sketch.random_quick_sort = async function (sketch, start, end) {
        sketch.random_pivot = true;
        await sketch.quick_sort(sketch, start, end);
    };

    sketch.merge_sort = async function (sketch, start, end) {
        if (start >= end) return;
        if (!sketch.running) return;
        let mid = parseInt((end - start) / 2) + start;
        sketch.set_activate(start, end);
        await sketch.wait();
        await sketch.merge_sort(sketch, start, mid);
        await sketch.merge_sort(sketch, mid + 1, end);
        if (!sketch.running) return;

        sketch.set_activate(start, end);
        sketch.activate_color = sketch.yellow_color;
        await sketch.wait();

        sketch.activate_color = sketch.break_color;
        let array = sketch.array;
        let left = array.slice(start, mid + 1);
        let right = array.slice(mid + 1, end + 1);

        let i = 0;
        let j = 0;

        let index = start;

        while (i < left.length && j < right.length) {
            if (!sketch.running) return;
            if (left[i] < right[j]) {
                await sketch.set(sketch, index, left[i]);
                i++;
                index++;
            } else {
                await sketch.set(sketch, index, right[j]);
                j++;
                index++;
            }
        }
        while (i < left.length) {
            if (!sketch.running) return;
            await sketch.set(sketch, index, left[i]);
            i++;
            index++;
        }

        while (j < right.length) {
            if (!sketch.running) return;
            await sketch.set(sketch, index, right[j]);
            j++;
            index++;
        }
    };


    sketch.get_bit = function (num) {
        let p = 10;
        let b = 1;
        while (num > p) {
            p *= 10;
            b++;
        }
        return b;
    };

    sketch.base_sort = async function (sketch, start, end) {
        let array = sketch.array;
        let max_bit = function () {
            let bit = 1;
            let p = 10;
            for (let i = 0; i < array.length; i++) {
                while (array[i] > p) {
                    p *= 10;
                    bit++;
                }
            }
            return bit;
        }();

        console.log("max bit " + max_bit);

        sketch.buckets = [];
        let buckets = sketch.buckets;
        let radix = 1;
        for (let times = 1; times <= max_bit; times++) {
            for (let i = 0; i < 10; i++) {
                buckets[i] = [];
            }
            for (let i = 0; i < array.length; i++) {
                const value = array[i];
                let index = parseInt(value / radix) % 10;
                buckets[index].push(value);

            }
            radix *= 10;

            let index = 0;
            for (let i = 0; i < buckets.length; i++) {
                const bucket = buckets[i];
                for (let j = 0; j < bucket.length; j++) {
                    const value = bucket[j];
                    await sketch.set(sketch, index, value);
                    index += 1;
                }
            }

        }

        sketch.buckets = [];
    };

    sketch.run = async function () {
        sketch.running = true;
        await sketch.algorithm(sketch, 0, sketch.length - 1);

        sketch.indices = [];
        sketch.set_activate(0, sketch.length - 1);
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

$(document).ready(function () {

    sketch = new p5(sort, document.getElementById('content'));

    $('.start.button').click(function () {
        if (sketch.running) return;
        let sort_type = $("#sort_type").val();
        console.log(sort_type);
        if (sort_type == 'bubble_sort') {
            sketch.algorithm = sketch.bubble_sort;
        } else if (sort_type == 'quick_sort') {
            sketch.random_pivot = false;
            sketch.algorithm = sketch.quick_sort;
        } else if (sort_type == 'random_quick_sort') {
            sketch.algorithm = sketch.random_quick_sort;
        } else if (sort_type == 'merge_sort') {
            sketch.algorithm = sketch.merge_sort;
        } else if (sort_type == 'select_sort') {
            sketch.algorithm = sketch.select_sort;
        } else if (sort_type == 'insert_sort') {
            sketch.algorithm = sketch.insert_sort;
        } else if (sort_type == 'shell_sort') {
            sketch.algorithm = sketch.shell_sort;
        } else if (sort_type == 'base_sort') {
            sketch.algorithm = sketch.base_sort;
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

    var sort_types = [{
            name: '冒泡排序',
            value: 'bubble_sort'
        },
        {
            name: '选择排序',
            value: 'select_sort'
        },
        {
            name: '插入排序',
            value: 'insert_sort'
        },
        {
            name: '希尔排序',
            value: 'shell_sort'
        },
        {
            name: '快速排序',
            value: 'quick_sort'
        },
        {
            name: '随机快速排序',
            value: 'random_quick_sort'
        },
        {
            name: '归并排序',
            value: 'merge_sort'
        },
        {
            name: '基数排序',
            value: 'base_sort'
        }
    ];

    sort_types.forEach(item => {
        if (item.value != $("#sort_type").val()) {
            var option = $(document.createElement("option"));
            option.val(item.value);
            option.html(item.name);
            $("#sort_type").append(option);
        }
    });

    $('.ui.sort.dropdown').dropdown();
});