/* jshint esversion: 6 */
import {
    OrbitControls
} from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.min.js";

$(document).ready(function () {

    var root = $('#scene');
    var ratio = 1.77;
    var width = root.width();
    var height = width / ratio;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();

    var controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(width, height);
    root.append(renderer.domElement);

    // sky

    const loader = new THREE.TextureLoader();
    const sky_image = loader.load($("#sky").attr('src'));
    sky_image.magFilter = THREE.LinearFilter;
    sky_image.minFilter = THREE.LinearFilter;

    const shader = THREE.ShaderLib.equirect;
    const sky_material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
    });
    sky_material.uniforms.tEquirect.value = sky_image;
    const plane = new THREE.SphereBufferGeometry(100, 32, 32);
    var sky_mesh = new THREE.Mesh(plane, sky_material);
    scene.add(sky_mesh);

    // earth
    var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    var surface = loader.load($("#world").attr('src'));
    var material = new THREE.MeshBasicMaterial({
        map: surface
    });
    var object = new THREE.Mesh(geometry, material);
    scene.add(object);
    camera.position.z = 2;

    var lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    function animate() {
        requestAnimationFrame(animate);
        object.rotation.y += 0.003;
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    $(window).resize(function () {
        var root = $('#scene');
        var width = root.width();
        var height = width / ratio;
        renderer.setSize(width, height);
    });

    var fullscreen = false;
    $(root).dblclick(function () {
        if (!fullscreen) {
            var element = renderer.domElement || document.body;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            fullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozExitFullScreen) {
                document.mozExitFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            fullscreen = false;
        }
    });

});