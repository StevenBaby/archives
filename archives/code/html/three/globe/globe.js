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

    var geometry = new THREE.SphereBufferGeometry(1, 32, 32);

    const loader = new THREE.TextureLoader();
    const bg_texture = loader.load($("#sky").attr('src'));
    bg_texture.magFilter = THREE.LinearFilter;
    bg_texture.minFilter = THREE.LinearFilter;

    const shader = THREE.ShaderLib.equirect;
    const bg_material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
    });
    bg_material.uniforms.tEquirect.value = bg_texture;
    const plane = new THREE.BoxBufferGeometry(20, 20, 20);
    var bg_mesh = new THREE.Mesh(plane, bg_material);
    scene.add(bg_mesh);

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
        console.log('resize');
        var root = $('#scene');
        var width = root.width();
        var height = width / ratio;
        renderer.setSize(width, height);
    });

});