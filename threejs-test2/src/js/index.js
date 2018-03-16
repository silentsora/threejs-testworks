/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-24 14:47:28
 * @version $Id$
 */
'use strict';

import '../less/style.less';
import Mesh from './Mesh';

class Main {
    constructor () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.directLight = new THREE.DirectionalLight(0xffffff, 1, 100);
        this.stats = new Stats();

        this.controlObj = null;
        this.meshControllerArr = [];
        this.meshNum = 100;
        this.range = 5;
        this.pivot = null;

        this.$mainWrap = document.querySelector('.m-wrap');
        this.$btnPause = document.querySelector('.btn-pause');
        this.$btnPlay = document.querySelector('.btn-play');
    }

    detectWebGL () {
        const tempCanvas = document.createElement('canvas');
        let detectResult = null;

        try {
            detectResult = tempCanvas.getContext('webgl');
        } catch (x) {
            detectResult = null;
        }

        if (detectResult === null) {
            try {
                detectResult = tempCanvas.getContext('experimental-webgl');
            } catch (x) {
                detectResult = null;
            }
        }

        if (detectResult) {
            return true;
        } else {
            return false;
        }
    }

    initStats () {
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0';
        this.stats.domElement.style.left = '0';
        this.$mainWrap.appendChild(this.stats.domElement);
    }

    createObject () {
        this.pivot = new THREE.Object3D();
        for (let i = 0; i < this.meshNum; i++) {
            let meshController = new Mesh();
            let mesh = meshController.creatMesh();
            this.meshControllerArr[i] = meshController;

            this.pivot.add(mesh);
            this.scene.add(this.pivot);
        }
    }

    addGui () {
        const ObjectControl = function () {
            this.range = 5;
            this.rotateSpeed = 0.01;
        };
        const LightControl = function () {
            this.lightX = -1;
            this.lightY = 1;
            this.lightZ = 1;
            this.rotateSpeed = 0.02;
        };
        const CameraControl = function () {
            this.cameraX = 0;
            this.cameraY = 0;
            this.cameraZ = 10;
            this.rotateSpeed = 0.01;
        };

        this.objectGui = new ObjectControl();
        this.lightGui = new LightControl();
        this.cameraGui = new CameraControl();

        const gui = new dat.GUI();
        const lightFolder = gui.addFolder('Light');
        const cameraFolder = gui.addFolder('Camera');

        gui.add(this.objectGui, 'range', 1, 10);
        gui.add(this.objectGui, 'rotateSpeed', -0.1, 0.1);

        lightFolder.add(this.lightGui, 'lightX', -10, 10);
        lightFolder.add(this.lightGui, 'lightY', -10, 10);
        lightFolder.add(this.lightGui, 'lightZ', -10, 10);
        lightFolder.add(this.lightGui, 'rotateSpeed', -0.2, 0.2);

        cameraFolder.add(this.cameraGui, 'cameraX', -20, 20);
        cameraFolder.add(this.cameraGui, 'cameraY', -20, 20);
        cameraFolder.add(this.cameraGui, 'cameraZ', -20, 20);
        cameraFolder.add(this.cameraGui, 'rotateSpeed', -0.2, 0.2);
    }

    addLight () {
        this.directLight.position.set(-1, 1, 1);
        this.directLight.castShadow = true;
        this.renderer.shadowMap.enabled = true;

        // const lightHelper = new THREE.DirectionalLightHelper(this.directLight, 5);
        this.scene.add(this.directLight);
        // this.scene.add(lightHelper);
    }

    controlObject () {
        this.range = this.objectGui.range;
        this.pivot.rotation.y += this.objectGui.rotateSpeed;
    }

    controlLight () {
        try {
            this.directLight.position.x = this.lightGui.lightX;
            this.directLight.position.y = this.lightGui.lightY;
            this.directLight.position.z = this.lightGui.lightZ;
            // this.directLight.rotation.x += this.lightGui.rotateSpeed;
            // this.directLight.rotation.y += this.lightGui.rotateSpeed;
            // this.directLight.rotation.z += this.lightGui.rotateSpeed;
        } catch (x) {
            console.log('cant find the light');
        }
    }

    controlCamera () {
        try {
            this.camera.position.x = this.cameraGui.cameraX;
            this.camera.position.y = this.cameraGui.cameraY;
            this.camera.position.z = this.cameraGui.cameraZ;
            // this.camera.rotation.y += this.cameraGui.rotateSpeed;
        } catch (x) {
            console.log('cant find the camera');
        }
    }

    update () {
        for (let i = 0; i < this.meshNum; i++) {
            this.meshControllerArr[i].update(this.range);
        }

        this.controlObject();
        this.controlLight();
        this.controlCamera();
        this.stats.update();
    }

    render () {
        if (this.paused) return;

        this.update();
        this.renderer.render(this.scene, this.camera);
        // setTimeout(() => {
        requestAnimationFrame(this.render.bind(this));
        // }, 50);
    }

    play () {
        this.paused = false;
        this.render();
    }

    pause () {
        this.paused = true;
    }

    init () {
        if (this.detectWebGL() === true) {
            console.log('suppot WebGL');
        } else {
            console.log('not support WebGL');
        }

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnbled = true;
        this.$mainWrap.appendChild(this.renderer.domElement);
        this.camera.position.z = 10;
        this.camera.lookAt(0, 0, 0);

        this.initStats();
        this.createObject();
        this.addGui();
        this.addLight();
        this.render();

        this.$btnPause.addEventListener('click', () => {
            this.pause();
        });

        this.$btnPlay.addEventListener('click', () => {
            this.play();
        });
    }
};

const main = new Main();

main.init();
