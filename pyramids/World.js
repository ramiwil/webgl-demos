// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;

    attribute vec2 a_UV;
    varying vec2 v_UV;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;

    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;


    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
}`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform vec4 u_FragColor;
    varying vec2 v_UV;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;

    uniform int u_whichTexture;

    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1, 1);
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        }  else if (u_whichTexture == 2) {
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        }  else if (u_whichTexture == 3) {
            gl_FragColor = texture2D(u_Sampler3, v_UV);
        }  else {
            gl_FragColor = vec4(1,.2,.2,1);
        }
}`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let a_UV;
let u_GlobalRotateMatrix;
let u_ModelMatrix;
let u_whichTexture;

let u_ViewMatrix;
let u_ProjectionMatrix;

//Global textures
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;


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

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
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

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
      return false;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return false;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return false;
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
let g_tail1Animation = 1;
let g_tail2Animation = 1;
let g_tail3Animation = 1;

let g_eyesAnimation = 1;
let g_eyesPosition = 1;

let g_earAnimation = 1;
let g_earAngle = 0;

var g_Camera;

function setupCamera() {
    g_Camera = new Camera();
}

function addActionsForHtmlUI() {
    //document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });
    //document.getElementById('tail1Slide').addEventListener('mousemove', function () { g_tail1Angle = this.value; renderAllShapes(); });
    //document.getElementById('tail2Slide').addEventListener('mousemove', function () { g_tail2Angle = this.value; renderAllShapes(); });
    //document.getElementById('tail3Slide').addEventListener('mousemove', function () { g_tail3Angle = this.value; renderAllShapes(); });


    //document.getElementById('tail1AnimationON').onclick = function() {g_tail1Animation = true;};
    //document.getElementById('tail1AnimationOFF').onclick = function() {g_tail1Animation = false;};

    //document.getElementById('tail2AnimationON').onclick = function() {g_tail2Animation = true;};
    //document.getElementById('tail2AnimationOFF').onclick = function() {g_tail2Animation = false;};

    //document.getElementById('tail3AnimationON').onclick = function() {g_tail3Animation = true;};
    //document.getElementById('tail3AnimationOFF').onclick = function() {g_tail3Animation = false;};

    //document.getElementById('eyesAnimationON').onclick = function() {g_eyesAnimation = true;};
    //document.getElementById('eyesAnimationOFF').onclick = function() {g_eyesAnimation = false;};

    //document.getElementById('earAnimationON').onclick = function() {g_earAnimation = true;};
    //document.getElementById('earAnimationOFF').onclick = function() {g_earAnimation = false;};

    var canvas = document.getElementById("webgl");
    canvas.addEventListener("mousedown", click, false);
    canvas.addEventListener("mousemove", click, false);
    //canvas.addEventListener("mouseup", clickUp, false);
}

function initTextures() {

  var image = new Image();  // Create the image object
  var floorImg = new Image();
  var stonesImg = new Image();
  var gold = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!floorImg) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!stonesImg) {
    console.log('Failed to create the image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(image, u_Sampler0, gl.TEXTURE0, 0); };
  // Tell the browser to load an image
  image.src = 'night_sky.jpg';

  floorImg.onload = function(){ loadTexture(floorImg, u_Sampler1, gl.TEXTURE1, 1); };
  floorImg.src = 'sand_floor.jpg'

  stonesImg.onload = function(){ loadTexture(stonesImg, u_Sampler2, gl.TEXTURE2, 2); };
  stonesImg.src = 'stone.jpg'

  gold.onload = function(){ loadTexture(gold, u_Sampler3, gl.TEXTURE3, 3); };
  gold.src = 'treasure.jpg'



  // add more textures later

  return true;
}

function loadTexture(image, sampler, glUNIT, unit) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit1
  gl.activeTexture(glUNIT);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(sampler, unit);

  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 0); // Draw the rectangle

  console.log("Finished loading textures");
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addActionsForHtmlUI();

    setupCamera();

    document.onkeydown = keydown;
    //canvas.mousedrag = function(ev) {if (ev.buttons == 1) {click(ev)}};;

    initTextures();

    var mat = new Matrix4();

    console.log(mat.setLookAt(0,0,7, 0,0,0, 0,1,0));

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    renderAllShapes();

    requestAnimationFrame(tick);
}

let g_mouseAngle;
let x1, y1;
let x2, y2;

function click(ev) {
  [x1, y1] = convertCoordinatesEventToGL(ev);
  g_Camera.rotateMouse(x1);

  //console.log([x1, y1]);

}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds = performance.now()/1000.0-g_startTime;
    //console.log(g_seconds);
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

var pyramidX = 0;
var pyramidZ = 0;

function keydown(ev) {
    if (ev.keyCode == 87) {
        g_Camera.forward();
    } else if (ev.keyCode == 83) {
        g_Camera.backward();
    } else if (ev.keyCode == 65) {
        g_Camera.left();
    } else if (ev.keyCode == 68) {
        g_Camera.right();
    } else if (ev.keyCode == 81) {
        g_Camera.rotateLeft();
    } else if (ev.keyCode == 69) {
        g_Camera.rotateRight();
    } else if (ev.keyCode == 80) {
        if (placeReward) {
            pyramidX = g_Camera.at.elements[0];
            pyramidZ = g_Camera.at.elements[2];
            rewardPyramidsCoords.push([pyramidX, pyramidZ]);
            rewardPyramids += 1;
            placeReward = true;
        }

    } else if (ev.keyCode == 88) {
        if (placeReward) {
            pyramidX = g_Camera.at.elements[0];
            pyramidZ = g_Camera.at.elements[2];
            for (x = 0; x < rewardPyramids; x++) {
                if (Math.abs(pyramidX - rewardPyramidsCoords[x][0]) < 2 && Math.abs(pyramidZ - rewardPyramidsCoords[x][1]) < 2) {
                    if (x > -1) {rewardPyramidsCoords.splice(x, 1);}
                    rewardPyramids -= 1;
                }
            }
        }
        
        //rewardPyramidsCoords.pop();
        //rewardPyramids -= 1;
    }

    renderAllShapes();
}

var g_Map = [
    [0, 0, 3, 2, 1, 2, 4, 0, 0, 0, 0, 0, 0, 1, 1, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function drawPyramids() {
    var pyramid = new Pyramid();
    pyramid.textureNum = 2;
    pyramid.matrix.translate(4,-.75,-5);
    pyramid.matrix.scale(16,8,16);
    pyramid.render();


    var pyramid2 = new Pyramid();
    pyramid2.textureNum = 2;
    pyramid2.matrix.translate(-9,-.75,-14);
    pyramid2.matrix.scale(12,6,12);
    pyramid2.render();

    var pyramid3 = new Pyramid();
    pyramid3.textureNum = 2;
    pyramid3.matrix.translate(-18,-.75,-20);
    pyramid3.matrix.scale(8,4,8);
    pyramid3.render();
}

function drawMap() {
    for (x=0;x<16;x++) {
        for (y=0;y<16;y++) {
            if (g_Map[x][y] > 0) {
                for (i=0;i<g_Map[x][y];i++) {
                    var wall = new Cube();
                    wall.textureNum = 2;
                    wall.color = [1,1,1,1];
                    wall.matrix.translate(x-8, -.75+i, y-8);
                    wall.render();
                }
                
            }
        }
    }
}

let lionQuest = false;
let foundFlag = false;
let foundFlag2 = false;
let placeReward = false;
let rewardPyramids = 0;
let rewardPyramidsCoords = [];


function placeRewardPyramid(coords) {
    for (x = 0; x < rewardPyramids; x++) {
        var reward = new Pyramid();
        reward.textureNum = 3;
        reward.matrix.translate(coords[x][0], -.75, coords[x][1]);
        reward.matrix.scale(2,1,2);
        reward.render();
    }
    
}

function renderAllShapes() {

    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(90, canvas.width/canvas.height, .1, 100)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2],
                      g_Camera.at.elements[0], g_Camera.at.elements[1], g_Camera.at.elements[2],
                      g_Camera.up.elements[0], g_Camera.up.elements[1], g_Camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;

    var floor = new Cube();
    floor.color = [1,0,0,1];
    floor.textureNum = 1;
    floor.matrix.translate(0, -.75, 0.0);
    floor.matrix.scale(40, 0, 40);
    floor.matrix.translate(-.5,0,-.5);
    floor.render();

    var sky = new Cube();
    sky.textureNum = 0;
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-.5,-.5,-.5);
    sky.render();

    var pedestal = new Cube();
    pedestal.textureNum = 2;
    pedestal.matrix.translate(-.50,-1.25,-.25);
    pedestal.render();

    if ( Math.abs(pedestal.matrix.elements[12]-g_Camera.at.elements[0]) < 2 && Math.abs(pedestal.matrix.elements[14]-g_Camera.at.elements[2]) < 2) {
        lionQuest = true;
        sendTextToHTML("There is treasure in these ancient pyramids. Find them, and get your reward!", "lionSpeech");
        //console.log("huh");
    } else if (!lionQuest) {
        pedestal.render();
    }
    
    var treasure = new Cube();
    treasure.textureNum = 3;
    treasure.matrix.translate(-15,-.75,-17);

    if ( Math.abs(treasure.matrix.elements[12]-g_Camera.at.elements[0]) < 2 && Math.abs(treasure.matrix.elements[14]-g_Camera.at.elements[2]) < 2) {
        foundFlag = true;
        if (foundFlag2 && foundFlag) {
            sendTextToHTML("You found them all! Come get your reward, traveller!", "lionSpeech");
        } else {
            sendTextToHTML("You found the first one! There is one more, traveller.", "lionSpeech");
        }
        
        //console.log("huh");
    } else if(!foundFlag) {
        treasure.render();
    }


    var treasure2 = new Cube();
    treasure2.textureNum = 3;
    treasure2.matrix.translate(15,-.75,8);

    if ( Math.abs(treasure2.matrix.elements[12]-g_Camera.at.elements[0]) < 2 && Math.abs(treasure2.matrix.elements[14]-g_Camera.at.elements[2]) < 2) {
        foundFlag2 = true;
        if (foundFlag2 && foundFlag) {
            sendTextToHTML("You found them all! Come get your reward, traveller!", "lionSpeech");
        } else {
            sendTextToHTML("You found the first one! There is one more, traveller.", "lionSpeech");
        }
        //console.log("huh");
    } else if(!foundFlag2) {
        treasure2.render();
    }

    if ( Math.abs(pedestal.matrix.elements[12]-g_Camera.at.elements[0]) < 2 && Math.abs(pedestal.matrix.elements[14]-g_Camera.at.elements[2]) < 2 && foundFlag && foundFlag2) {
        //lionQuest = true;
        sendTextToHTML("You did it! As a reward, you can have your own infinite GOLDEN pyramids. Place them anywhere you want, and build your empire!", "lionSpeech");
        //console.log("huh");
    } else {
        pedestal.render();
    }

    if (foundFlag && foundFlag2) {
        placeReward = true;
    }

    
    //var reward = new Pyramid();
    //reward.matrix.translate(pyramidX, -.75, pyramidZ);
    //reward.textureNum = 3;

    if (foundFlag && foundFlag2 && placeReward) {
        placeRewardPyramid(rewardPyramidsCoords);
        //reward.render();
    }

    drawMap();
    drawPyramids();
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
    body.textureNum = -2;
    body.render();

    var mane = new Cube();
    mane.color = [0.6, 0.5, 0.3, 1.0];
    mane.matrix.translate(-.38, -.23, -0.2);
    mane.matrix.scale(.7, .6, .2);
    mane.textureNum = -2;
    mane.render();

    var face = new Cube();
    face.color = [0.78, 0.61, 0.39, 1.0];
    face.matrix.translate(-0.23,-.1,-.3);
    face.matrix.scale(0.4,0.4,0.1);
    face.textureNum = -2;
    face.render();

    var leftEye = new Cube();
    leftEye.color = [1, 1, 1, 1];
    leftEye.matrix.translate(0.02,0.11,-.31);
    leftEye.matrix.scale(0.08,0.12,0.001);
    var leftPupil = new Cube();
    leftPupil.color = [0, 0, 0, 1];
    leftPupil.matrix.translate(g_eyesPosition,0.11,-.311);
    leftPupil.matrix.scale(0.06,0.08,0.001);
    leftPupil.textureNum = -2;
    leftEye.textureNum = -2;
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
    rightPupil.textureNum = -2;
    rightEye.textureNum = -2;
    rightPupil.render();
    rightEye.render();

    var mouth = new Cube();
    mouth.color = [1,1,1,1];
    mouth.matrix.translate(-0.23,-0.10,-.31);
    mouth.matrix.scale(0.4,0.16,0.001);
    mouth.textureNum = -2;
    mouth.render();

    var nose = new Cube();
    nose.color = [0.55,0.164,0.164,1];
    nose.matrix.translate(-0.09,-0.05,-.31);
    nose.matrix.scale(0.1,0.1,-0.0012);
    nose.textureNum = -2;
    nose.render();

    var leg1 = new Cube();
    leg1.color = [0.78, 0.61, 0.39, 1.0];
    leg1.matrix.translate(-0.02,-0.3,.4);
    leg1.matrix.scale(.2,.35,.2);
    leg1.textureNum = -2;
    leg1.render();

    var leg2 = new Cube();
    leg2.color = [0.78, 0.61, 0.39, 1.0];
    leg2.matrix.translate(-0.25,-0.3,.4);
    leg2.matrix.scale(.2,.35,.2);
    leg2.textureNum = -2;
    leg2.render();

    var leg3 = new Cube();
    leg3.color = [0.78, 0.61, 0.39, 1.0];
    leg3.matrix.translate(-0.02,-0.3,-.1);
    leg3.matrix.scale(.2,.35,.2);
    leg3.textureNum = -2;
    leg3.render();

    var leg4 = new Cube();
    leg4.color = [0.78, 0.61, 0.39, 1.0];
    leg4.matrix.translate(-0.25,-0.3,-.1);
    leg4.matrix.scale(.2,.35,.2);
    leg4.textureNum = -2;
    leg4.render();

    var ear1 = new Cube();
    ear1.color = [0.78, 0.61, 0.39, 1.0];
    ear1.matrix.rotate(g_earAngle, 0,0,1);
    ear1.matrix.translate(.05,.3,-.3);
    ear1.matrix.scale(.1,.1,.1);
    ear1.textureNum = -2;
    ear1.render();

    var ear2 = new Cube();
    ear2.color = [0.78, 0.61, 0.39, 1.0];
    ear2.matrix.translate(-.2,.3,-.3);
    ear2.matrix.scale(.1,.1,.1);
    ear2.textureNum = -2;
    ear2.render();

    var tail1 = new Cube();
    tail1.color = [0.7, 0.6, 0.34, 1.0];
    tail1.matrix.translate(-0.08,0.2,.502);
    tail1.matrix.rotate(g_tail1Angle, 0,0,1);
    var tail2Mat = new Matrix4(tail1.matrix);
    tail1.matrix.scale(.1,.3,.1);
    tail1.textureNum = -2;
    tail1.render();

    var tail2 = new Cube();
    tail2.color = [0.7, 0.6, 0.34, 1.0];
    tail2.matrix = tail2Mat;
    tail2.matrix.translate(0.0001,.23,-0.001);
    tail2.matrix.rotate(g_tail2Angle, 0,0,1);
    let tail3Mat = new Matrix4(tail2.matrix);
    tail2.matrix.scale(.1,.3,.1);
    tail2.textureNum = -2;
    tail2.render();

    var tail3 = new Cube();
    tail3.color = [0.7, 0.6, 0.34, 1.0];
    tail3.matrix = tail3Mat;
    tail3.matrix.translate(0.0001,.23,-0.001);
    tail3.matrix.rotate(g_tail3Angle, 0,0,1);
    tail3.matrix.scale(.1,.3,.1);
    tail3.textureNum = -2;
    tail3.render();

}

//smyrna is the best person in the whole wide world and is the only woman on earth. :D