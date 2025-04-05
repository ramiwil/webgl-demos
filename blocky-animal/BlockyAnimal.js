// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;


function setupWebGL() {
    canvas = document.getElementById("webgl");

    // Retrieve webgl rendering context
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log("Failed to get WebGl context.")
        return -1;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

const ON = 1;
const OFF = 0;

// Global Variables for UI Elements

let g_globalAngle = 0;
let g_tail1Angle = 0;
let g_tail2Angle = 0;
let g_tail3Angle = 0;
let g_tail1Animation = 0;
let g_tail2Animation = 0;
let g_tail3Animation = 0;

let g_eyesAnimation = 0;
let g_eyesPosition = 0;

let g_earAnimation = 0;
let g_earAngle = 0;

function addActionsForHtmlUI() {
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById('tail1Slide').addEventListener('mousemove', function () { g_tail1Angle = this.value; renderAllShapes(); });
    document.getElementById('tail2Slide').addEventListener('mousemove', function () { g_tail2Angle = this.value; renderAllShapes(); });
    document.getElementById('tail3Slide').addEventListener('mousemove', function () { g_tail3Angle = this.value; renderAllShapes(); });


    document.getElementById('tail1AnimationON').onclick = function() {g_tail1Animation = true;};
    document.getElementById('tail1AnimationOFF').onclick = function() {g_tail1Animation = false;};

    document.getElementById('tail2AnimationON').onclick = function() {g_tail2Animation = true;};
    document.getElementById('tail2AnimationOFF').onclick = function() {g_tail2Animation = false;};

    document.getElementById('tail3AnimationON').onclick = function() {g_tail3Animation = true;};
    document.getElementById('tail3AnimationOFF').onclick = function() {g_tail3Animation = false;};

    document.getElementById('eyesAnimationON').onclick = function() {g_eyesAnimation = true;};
    document.getElementById('eyesAnimationOFF').onclick = function() {g_eyesAnimation = false;};

    document.getElementById('earAnimationON').onclick = function() {g_earAnimation = true;};
    document.getElementById('earAnimationOFF').onclick = function() {g_earAnimation = false;};

}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    renderAllShapes();

    requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;


function tick() {
    g_seconds = performance.now()/1000.0-g_startTime;
    console.log(g_seconds);
    updateAnimationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
}

var g_shapesList = [];
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];


function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}
function renderAllShapes() {
    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;

    buildAnimal();

    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration), "numdot");
}
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function updateAnimationAngles() {
    if (g_tail1Animation) {
        g_tail1Angle = 35*Math.sin(g_seconds*2);
    }
    if (g_tail2Animation) {
        g_tail2Angle = 25*Math.sin(g_seconds*3);
    }
    if (g_tail3Animation) {
        g_tail3Angle = 15*Math.sin(g_seconds*4);
    }
    if (g_eyesAnimation) {
        g_eyesPosition = 1*Math.sin(g_seconds*2)*0.02;
    }
    if (g_earAnimation) {
        g_earAngle = 5*Math.sin(g_seconds*8);
    }
}

function buildAnimal() {
    var body = new Cube();
    body.color = [0.78, 0.61, 0.39, 1.0];
    body.matrix.translate(-.23, -.1, 0.0);
    body.matrix.scale(.4, .4, .6);
    body.render();

    var mane = new Cube();
    mane.color = [0.6, 0.5, 0.3, 1.0];
    mane.matrix.translate(-.38, -.23, -0.2);
    mane.matrix.scale(.7, .6, .2);
    mane.render();

    var face = new Cube();
    face.color = [0.78, 0.61, 0.39, 1.0];
    face.matrix.translate(-0.23,-.1,-.3);
    face.matrix.scale(0.4,0.4,0.1);
    face.render();

    var leftEye = new Cube();
    leftEye.color = [1, 1, 1, 1];
    leftEye.matrix.translate(0.02,0.11,-.31);
    leftEye.matrix.scale(0.08,0.12,0.001);
    var leftPupil = new Cube();
    leftPupil.color = [0, 0, 0, 1];
    leftPupil.matrix.translate(g_eyesPosition,0.11,-.311);
    leftPupil.matrix.scale(0.06,0.08,0.001);
    leftPupil.render();
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = [1, 1, 1, 1];
    rightEye.matrix.translate(-0.17,0.11,-.31);
    rightEye.matrix.scale(0.08,0.12,0.001);
    var rightPupil = new Cube();
    rightPupil.color = [0, 0, 0, 1];
    rightPupil.matrix.translate(g_eyesPosition-0.17,0.11,-.311);
    rightPupil.matrix.scale(0.06,0.08,0.001);
    rightPupil.render();
    rightEye.render();

    var mouth = new Cube();
    mouth.color = [1,1,1,1];
    mouth.matrix.translate(-0.23,-0.10,-.31);
    mouth.matrix.scale(0.4,0.16,0.001);
    mouth.render();

    var nose = new Cube();
    nose.color = [0.55,0.164,0.164,1];
    nose.matrix.translate(-0.09,-0.05,-.31);
    nose.matrix.scale(0.1,0.1,-0.0012);
    nose.render();

    var leg1 = new Cube();
    leg1.color = [0.78, 0.61, 0.39, 1.0];
    leg1.matrix.translate(-0.02,-0.3,.4);
    leg1.matrix.scale(.2,.35,.2);
    leg1.render();

    var leg2 = new Cube();
    leg2.color = [0.78, 0.61, 0.39, 1.0];
    leg2.matrix.translate(-0.25,-0.3,.4);
    leg2.matrix.scale(.2,.35,.2);
    leg2.render();

    var leg3 = new Cube();
    leg3.color = [0.78, 0.61, 0.39, 1.0];
    leg3.matrix.translate(-0.02,-0.3,-.1);
    leg3.matrix.scale(.2,.35,.2);
    leg3.render();

    var leg4 = new Cube();
    leg4.color = [0.78, 0.61, 0.39, 1.0];
    leg4.matrix.translate(-0.25,-0.3,-.1);
    leg4.matrix.scale(.2,.35,.2);
    leg4.render();

    var ear1 = new Cube();
    ear1.color = [0.78, 0.61, 0.39, 1.0];
    ear1.matrix.rotate(g_earAngle, 0,0,1);
    ear1.matrix.translate(.05,.3,-.3);
    ear1.matrix.scale(.1,.1,.1);
    ear1.render();

    var ear2 = new Cube();
    ear2.color = [0.78, 0.61, 0.39, 1.0];
    ear2.matrix.translate(-.2,.3,-.3);
    ear2.matrix.scale(.1,.1,.1);
    ear2.render();

    var tail1 = new Cube();
    tail1.color = [0.7, 0.6, 0.34, 1.0];
    tail1.matrix.translate(-0.08,0.2,.502);
    tail1.matrix.rotate(g_tail1Angle, 0,0,1);
    var tail2Mat = new Matrix4(tail1.matrix);
    tail1.matrix.scale(.1,.3,.1);
    tail1.render();

    var tail2 = new Cube();
    tail2.color = [0.7, 0.6, 0.34, 1.0];
    tail2.matrix = tail2Mat;
    tail2.matrix.translate(0.0001,.23,-0.001);
    tail2.matrix.rotate(g_tail2Angle, 0,0,1);
    let tail3Mat = new Matrix4(tail2.matrix);
    tail2.matrix.scale(.1,.3,.1);
    tail2.render();

    var tail3 = new Cube();
    tail3.color = [0.7, 0.6, 0.34, 1.0];
    tail3.matrix = tail3Mat;
    tail3.matrix.translate(0.0001,.23,-0.001);
    tail3.matrix.rotate(g_tail3Angle, 0,0,1);
    tail3.matrix.scale(.1,.3,.1);
    tail3.render();

}
