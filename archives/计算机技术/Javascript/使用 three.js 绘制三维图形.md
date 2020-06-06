# 使用 three.js 绘制三维图形

[annotation]: <id> (33030a69-774e-4cd1-975e-edae118ed977)
[annotation]: <status> (public)
[annotation]: <create_time> (2020-06-07 01:04:56)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Javascript)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/33030a69-774e-4cd1-975e-edae118ed977)

<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.min.js"></script>


遥想公瑾当年，小乔初嫁了……，突然想起来我之前做过虚拟现实的一些东西，于是好奇能不能再 h5 上实现，这就试试了。不过之前一直使用 OSG 来做。换到 H5 可能效果不是很好，不过做个简单的东西也行啊。

## hello world

<div class="ui segment" id="cube"> 
</div>

<script>
$(document).ready(function () {
    var root = $('#cube');
    var ratio = 1.77;
    var width = root.width();
    var height = width / ratio;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    root.append(renderer.domElement);

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
});
</script>

这个算是官方的小方块了，说明基本的功能已经是可以实现了，算是一个 hello world 吧。功能简单，代码附在下面。

```javascript
$(document).ready(function () {
    var root = $('#cube');
    var ratio = 1.77;
    var width = root.width();
    var height = width / ratio;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    root.append(renderer.domElement);

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
});
```