$(document).ready(function () {
    var root = $('#cube');
    var ratio = 1.77;
    var width = root.width();
    var height = width / ratio;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });

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

    $(window).resize(function () {
        console.log('resize');
        var root = $('#cube');
        var width = root.width();
        var height = width / ratio;
        renderer.setSize(width, height);
    });

});