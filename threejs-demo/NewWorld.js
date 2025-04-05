import { PointerLockControls } from './three/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from './three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from './three/examples/jsm/loaders/MTLLoader.js'
import { RectAreaLightHelper } from './three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Vector3 } from 'three';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js'
import { SpotLightHelper } from 'three';

// SOURCES:

//Keyboard by S. Paul Michael [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/fP_S-_T1BOZ)
//Drum Kit by smoj [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/7FCPjy-3xmz)
//Bass Violin by Paul Spooner [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/5w58dUJPYQc)

// General Global Variables
var player = { height: 7, speed: 0.8, turnSpeed: Math.PI * 0.02 };
let playerStartingPos = new Vector3(0, player.height, 80);
let scene;
let camera;
let renderer;
let controls;

// Lighting global variables
let light1;
let light1Intensity;
let light1Color;

let ambientLight;
let ambientLightIntensity;
let ambientLightColor;

let rectLight1;
let rectlight2;
let rectlight3;


let pianoSpotlight;
let pianoSpotlightHelper;

let drumsSpotlight;
let drumsSpotlightHelper;

let bassSpotlight;
let bassSpotlightHelper;

// Objects global variables
let pianoPos = new Vector3(-8, 4.3, -8);
let pianoRot = new Vector3(0, -45, 0);

let drumsPos = new Vector3(8, 3.5, -8);
let drumsRot = new Vector3(0, -45, 0);

let bassPos = new Vector3(0, 5, -20);
let bassRot = new Vector3(0, 0.5, 0);


// Scene 
function sceneInit() {
    scene = new THREE.Scene();
}
sceneInit();

// Camera
function cameraInit() {
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.set(playerStartingPos.x, player.height, playerStartingPos.z);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
}
cameraInit();

// Renderer
function rendererInit() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // renderer.shadowap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
rendererInit();

// Controls
function controlsInit() {
    controls = new PointerLockControls(camera, document.body);
    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                controls.moveForward(player.speed)
                break
            case 'KeyA':
                controls.moveRight(-player.speed)
                break
            case 'KeyS':
                controls.moveForward(-player.speed)
                break
            case 'KeyD':
                controls.moveRight(player.speed)
                break
        }
    }
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('click', function () { controls.lock() });
}
controlsInit();

// Background
function backgroundInit() {
    const backgroundLoader = new THREE.CubeTextureLoader();
    const skyTexture = backgroundLoader.load([
        'Assets/City/px.png',
        'Assets/City/nx.png',
        'Assets/City/py.png',
        'Assets/City/ny.png',
        'Assets/City/pz.png',
        'Assets/City/nz.png',
    ]);
    scene.background = skyTexture;
}
backgroundInit();

// FLoor Plane
function floor() {
    const planeSize = 800;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('Assets/City/ny.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 20;
    texture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 10,
        metalness: 0
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);



}
floor();

// Lighting
function lights() {

    // ambient light
    ambientLightIntensity = 1.7;
    ambientLightColor = 0x404040;
    ambientLight = new THREE.AmbientLight(ambientLightColor, ambientLightIntensity);
    scene.add(ambientLight);

    //rect light 
    RectAreaLightUniformsLib.init();

    rectLight1 = new THREE.RectAreaLight(0xff0000, 20, 6, 80);
    rectLight1.rotation.x = -Math.PI / 2;
    rectLight1.position.set(- 30, 20, 50);
    rectLight1.castShadow = true;
    scene.add(rectLight1);

    rectlight2 = new THREE.RectAreaLight(0x00ff00, 20, 6, 80);
    rectlight2.rotation.x = -Math.PI / 2;
    rectlight2.position.set(0, 20, 50);
    rectlight2.castShadow = true;
    scene.add(rectlight2);

    rectlight3 = new THREE.RectAreaLight(0x0000ff, 20, 6, 80);
    rectlight3.rotation.x = -Math.PI / 2;
    rectlight3.position.set(30, 20, 50);
    rectlight3.castShadow = true;
    scene.add(rectlight3);

    scene.add(new RectAreaLightHelper(rectLight1));
    scene.add(new RectAreaLightHelper(rectlight2));
    scene.add(new RectAreaLightHelper(rectlight3));



    //Piano Spotlight
    pianoSpotlight = new THREE.SpotLight(0xffffff, 5, -1, 0.5, 1, 1);
    pianoSpotlight.position.set(pianoPos.x, 20, pianoPos.z + 3);
    pianoSpotlight.target.position.set(pianoPos.x, pianoPos.y, pianoPos.z);
    pianoSpotlight.castShadow = true;
    scene.add(pianoSpotlight.target);
    scene.add(pianoSpotlight);
    pianoSpotlightHelper = new SpotLightHelper(pianoSpotlight);
    scene.add(pianoSpotlightHelper);


    //Drums spot light
    drumsSpotlight = new THREE.SpotLight(0xffffff, 5, -1, 0.5, 1, 1);
    drumsSpotlight.position.set(drumsPos.x, 20, drumsPos.z + 3);
    drumsSpotlight.target.position.set(drumsPos.x, drumsPos.y, drumsPos.z);
    drumsSpotlight.castShadow = true;
    scene.add(drumsSpotlight.target);
    scene.add(drumsSpotlight);
    drumsSpotlightHelper = new SpotLightHelper(drumsSpotlight);
    scene.add(drumsSpotlightHelper);

    //bass spot light
    bassSpotlight = new THREE.SpotLight(0xffffff, 5, -1, 0.5, 1, 1);
    bassSpotlight.position.set(bassPos.x, 20, bassPos.z + 8);
    bassSpotlight.target.position.set(bassPos.x, bassPos.y, bassPos.z);
    bassSpotlight.castShadow = true;
    scene.add(bassSpotlight.target);
    scene.add(bassSpotlight);
    bassSpotlightHelper = new SpotLightHelper(bassSpotlight);
    scene.add(bassSpotlightHelper);

}
lights();


// Objects

function addPiano() {
    const pianoMat = new MTLLoader();
    pianoMat.load('Assets/Piano/Piano.mtl', function (materials) {
        materials.preload();
        var pianoLoader = new OBJLoader();
        pianoLoader.setMaterials(materials);
        pianoLoader.load('Assets/Piano/Piano.obj', function (mesh) {
            mesh.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            mesh.position.x = pianoPos.x;
            mesh.position.y = pianoPos.y;
            mesh.position.z = pianoPos.z;
            mesh.rotation.x = pianoRot.x;
            mesh.rotation.y = pianoRot.y;
            mesh.rotation.z = pianoRot.z;
            mesh.scale.setScalar(3);
            scene.add(mesh);
        });

    });


    const cubeGeo = new THREE.BoxGeometry(4, 3.5, 9);
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
    const mesh2 = new THREE.Mesh(cubeGeo, cubeMat);
    mesh2.position.set(pianoPos.x, pianoPos.y - 2, pianoPos.z + 0.5);
    mesh2.rotation.x = pianoRot.x;
    mesh2.rotation.y = pianoRot.y;
    mesh2.rotation.z = pianoRot.z;
    mesh2.castShadow = true; //default is false
    mesh2.receiveShadow = false; //default
    scene.add(mesh2);

}
addPiano();


function addDrums() {
    const drumsMat = new MTLLoader();
    drumsMat.load('Assets/Drums/Drums.mtl', function (materials) {
        materials.preload();
        var drumsLoader = new OBJLoader();
        drumsLoader.setMaterials(materials);
        drumsLoader.load('Assets/Drums/Drums.obj', function (mesh) {
            mesh.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            mesh.position.x = drumsPos.x;
            mesh.position.y = drumsPos.y;
            mesh.position.z = drumsPos.z;
            mesh.rotation.x = drumsRot.x;
            mesh.rotation.y = drumsRot.y;
            mesh.rotation.z = drumsRot.z;
            mesh.scale.setScalar(10);
            scene.add(mesh);
        });

    });
}
addDrums();


function addBass() {
    const bassMat = new MTLLoader();
    bassMat.load('Assets/Bass/Bass.mtl', function (materials) {
        materials.preload();
        var bassLoader = new OBJLoader();
        bassLoader.setMaterials(materials);
        bassLoader.load('Assets/Bass/Bass.obj', function (mesh) {
            mesh.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            mesh.position.x = bassPos.x;
            mesh.position.y = bassPos.y;
            mesh.position.z = bassPos.z;
            mesh.rotation.x = bassRot.x;
            mesh.rotation.y = bassRot.y;
            mesh.rotation.z = bassRot.z;
            mesh.scale.setScalar(1);
            scene.add(mesh);
        });

    });
}
addBass();


let mixerArray = [];

function addPerson(i, asset, x, z) {
    const loader = new GLTFLoader();

    loader.load(
        asset,

        function (gltf) {

            mixerArray[i] = new THREE.AnimationMixer(gltf.scene);

            var action = mixerArray[i].clipAction(gltf.animations[0]);
            action.play();

            gltf.scene.traverse(function (node) {

                if (node.isMesh) { node.castShadow = true; }

            });


            gltf.scene.rotation.y = Math.PI;


            gltf.scene.scale.setScalar(2.5);
            gltf.scene.position.x = x;
            gltf.scene.position.z = z;

            scene.add(gltf.scene);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    )
}

let assetsArray = [
    'Assets/Man2/scene.gltf',
    'Assets/Man3/scene.gltf',
    'Assets/Groot/scene.gltf',
    'Assets/Bear/scene.gltf'
]
function addCrowd(rangeX, rangeZ, amount) {
    for (var i = 0; i < amount; i++) {
        var x = Math.floor(Math.random() * (rangeX + rangeX + 1)) - rangeX
        var z = Math.floor(Math.random() * rangeZ);
        // var assetNum = Math.round(Math.random());
        var assetNum = Math.floor(Math.random() * assetsArray.length);
        addPerson(i, assetsArray[assetNum], x, z);
    }
}

addCrowd(100, 100, 150);
// addCrowd(10, 10, 2);

let shapeArray = [];

function addShape(x, z, index, shape) {
    if (shape == 0) {
        const sphere = new THREE.SphereGeometry(0.5, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
        shapeArray[index] = new THREE.Mesh(sphere, material);
        shapeArray[index].position.set(x, 12, z);
        shapeArray[index].castShadow = true;
        shapeArray[index].receiveShadow = true;
        scene.add(shapeArray[index]);
    } else if (shape == 1) {
        const box = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
        shapeArray[index] = new THREE.Mesh(box, material);//
        shapeArray[index].position.set(x, 12, z);
        shapeArray[index].castShadow = true;
        shapeArray[index].receiveShadow = true;
        scene.add(shapeArray[index]);
    } else if (shape == 2) {
        const knot = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
        shapeArray[index] = new THREE.Mesh(knot, material);//
        shapeArray[index].position.set(x, 12, z);
        shapeArray[index].castShadow = true;
        shapeArray[index].receiveShadow = true;
        scene.add(shapeArray[index]);
    }
}


function addDisco() {
    var index = 0;
    for (var x = -50; x < 50; x += 10) {
        for (var z = 0; z < 100; z += 10) {
            var shape = Math.floor(Math.random() * 3);
            addShape(x, z, index, shape);
            index += 1;
        }
    }
}
addDisco();


function music() {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create the PositionalAudio object (passing in the listener)
    const sound = new THREE.PositionalAudio(listener);

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('Assets/sounds/Chameleon.ogg', function (buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        sound.setRolloffFactor(2);
        sound.play();
    });

    // create an object for the sound to play from
    const sphere = new THREE.SphereGeometry(0, 0, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0xff2200 });
    const mesh = new THREE.Mesh(sphere, material);
    scene.add(mesh);

    // finally add the sound to the mesh
    mesh.add(sound);
}
music();

function addRami(x, z) {
    const loader = new GLTFLoader();

    loader.load(
        'Assets/Rami/poly.glb',

        function (gltf) {

            // mixerArray[i] = new THREE.AnimationMixer(gltf.scene);

            // var action = mixerArray[i].clipAction(gltf.animations[0]);
            // action.play();

            // gltf.scene.traverse(function (node) {

            //     if (node.isMesh) { node.castShadow = true; }

            // });


            gltf.scene.rotation.y = Math.PI/2;


            gltf.scene.scale.setScalar(18);
            gltf.scene.position.x = x;
            gltf.scene.position.y = 3.7;
            gltf.scene.position.z = z;

            scene.add(gltf.scene);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    )
}
addRami(0, -23);
addRami(-10, -10);
addRami(10, -10);

var clock = new THREE.Clock();

function animate(time) {
    renderer.render(scene, camera);
    rectLight1.rotation.y += -0.05;
    rectlight2.rotation.y += 0.02;
    rectlight3.rotation.y += 0.05;

    var delta = clock.getDelta();
    time += delta;


    mixerArray.forEach(c => {
        if (c) {
            c.update(delta);
        }
    });

    shapeArray.forEach(c => {
        c.position.y = 12 + Math.abs(Math.sin(time / 500)) * 3;
        c.rotation.y += 0.05;
    });

    pianoSpotlightHelper.update();
    drumsSpotlightHelper.update();



    requestAnimationFrame(animate);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


const color = 0xC3C3C3; 
const near = 10;
const far = 100;
scene.fog = new THREE.Fog(color, near, far);


class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

function guiInit() {
    var gui = new dat.GUI();

    // movement speed
    const controls = gui.addFolder('Controls');
    controls.add(player, 'speed', 0, 10);

    // light 1
    gui.addColor(new ColorGUIHelper(light1, 'color'), 'value').name('color');
    gui.add(light1, 'intensity', 0, 10, 0.01);
    gui.add(light1.position, 'x', -10, 10);
    gui.add(light1.position, 'z', -10, 10);
    gui.add(light1.position, 'y', 0, 10);

    // ambient light
    gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
    gui.add(ambientLight, 'intensity', 0, 10, 0.01);

    // pianoSpotlight
    const pianoSpotlightControls = gui.addFolder('pianoSpotlight');
    pianoSpotlightControls.addColor(new ColorGUIHelper(pianoSpotlight, 'color'), 'value').name('color');
    pianoSpotlightControls.add(pianoSpotlight, 'intensity', 0, 20);
    pianoSpotlightControls.add(pianoSpotlight, 'distance', -10, 10);
    pianoSpotlightControls.add(pianoSpotlight, 'angle', 0, Math.PI);
    pianoSpotlightControls.add(pianoSpotlight, 'penumbra', 0, 10);
    pianoSpotlightControls.add(pianoSpotlight, 'decay', 0, 10);

    pianoSpotlightControls.add(pianoSpotlight.position, 'x', -20, 20);
    pianoSpotlightControls.add(pianoSpotlight.position, 'y', -20, 20);
    pianoSpotlightControls.add(pianoSpotlight.position, 'z', -20, 20);




}

//guiInit();

window.addEventListener('resize', onWindowResize, false);

animate();

renderer.render(scene, camera);
