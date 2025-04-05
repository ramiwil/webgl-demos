// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

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
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log("Failed to get WebGl context.")
        return -1;
    }
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

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
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
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_segmentAmount = 10;
let g_mirrorY = OFF;
let g_mirrorX = OFF;

function addActionsForHtmlUI() {
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
    document.getElementById('pointButton').onclick = function() {g_selectedType = POINT};
    document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE};
    document.getElementById('ironMan').onclick = function() {g_shapesList=[]; mufasa();};


    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});

    document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value});

    document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_segmentAmount = this.value});

    document.getElementById('mirrorY').onclick = function() {g_mirrorY = !g_mirrorY;};
    document.getElementById('mirrorX').onclick = function() {g_mirrorX = !g_mirrorX;};
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addActionsForHtmlUI();


    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) {if (ev.buttons == 1) {click(ev)}};

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);


}



var g_shapesList = [];

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];

function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType==POINT) {
      point = new Point();
  } else if (g_selectedType==TRIANGLE) {
      point = new Triangle();
  } else if (g_selectedType==CIRCLE) {
      point = new Circle();
      point.segments = g_segmentAmount;
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;

  g_shapesList.push(point);


  if (g_mirrorY) {
      let point2;
      if (g_selectedType==POINT) {
          point2 = new Point();
      } else if (g_selectedType==TRIANGLE) {
          point2 = new Triangle();
      } else if (g_selectedType==CIRCLE) {
          point2 = new Circle();
          point2.segments = g_segmentAmount;
      }
      point2.position = [-x, y];
      point2.color = g_selectedColor.slice();
      point2.size = g_selectedSize;

      g_shapesList.push(point2);
  }

  if (g_mirrorX) {
      let point3;
      if (g_selectedType==POINT) {
          point3 = new Point();
      } else if (g_selectedType==TRIANGLE) {
          point3 = new Triangle();
      } else if (g_selectedType==CIRCLE) {
          point3 = new Circle();
          point3.segments = g_segmentAmount;
      }
      point3.position = [x, -y];
      point3.color = g_selectedColor.slice();
      point3.size = g_selectedSize;

      g_shapesList.push(point3);

      if (g_mirrorY) {
          let point4;
          if (g_selectedType==POINT) {
              point4 = new Point();
          } else if (g_selectedType==TRIANGLE) {
              point4 = new Triangle();
          } else if (g_selectedType==CIRCLE) {
              point4 = new Circle();
              point4.segments = g_segmentAmount;
          }
          point4.position = [-x, -y];
          point4.color = g_selectedColor.slice();
          point4.size = g_selectedSize;

          g_shapesList.push(point4);
      }

  }

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return [x, y];
}

function renderAllShapes() {
    var startTime = performance.now();
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //var len = g_points.length;
    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function mufasa() {
    mufasaTriangle([0.2, -0.04], [0.22, -0.10], [0.32, 0.02], [1.0, 0.5, 0.5, 1.0]);
    mufasaTriangle([-0.2, -0.04], [-0.22, -0.10], [-0.32, 0.02], [1.0, 0.5, 0.5, 1.0]);

    mufasaTriangle([-0.22, -0.10], [-0.32, 0.02], [-0.35, -0.1], [1.0, 1.0, 1.0, 1.0]);
    mufasaTriangle([0.22, -0.10], [0.32, 0.02], [0.35, -0.1], [1.0, 1.0, 1.0, 1.0]);

    mufasaTriangle([-0.35, -0.1], [-0.22, -0.10], [-0.3, -0.3], [1.0, 0.0, 1.0, 1.0]);
    mufasaTriangle([0.35, -0.1], [0.22, -0.10], [0.3, -0.3], [1.0, 0.0, 1.0, 1.0]);

    mufasaTriangle([-0.3, -0.3], [-0.28, -0.5], [-0.2, -0.5], [1.0, 0.0, 0.0, 1.0]);
    mufasaTriangle([0.3, -0.3], [0.28, -0.5], [0.2, -0.5], [1.0, 0.0, 0.0, 1.0]);

    mufasaTriangle([-0.28, -0.5], [0.28, -0.5], [0.0, -0.7], [1.0, 0.5, 0.0, 1.0]);

    mufasaTriangle([-0.28, -0.5], [-0.3, -0.3], [-0.45, -0.3], [1.0, 0.5, 0.0, 1.0]);
    mufasaTriangle([0.28, -0.5], [0.3, -0.3], [0.45, -0.3], [1.0, 0.5, 0.0, 1.0]);

    mufasaTriangle([-0.45, -0.3], [-0.3, -0.3], [-0.35, -0.1], [0.5, 0.5, 0.0, 1.0]);
    mufasaTriangle([0.45, -0.3], [0.3, -0.3], [0.35, -0.1], [0.5, 0.5, 0.0, 1.0]);

    mufasaTriangle([-0.45, -0.3], [-0.2, 0.3], [-0.55, -0.15], [0.0, 0.5, 0.5, 1.0]);
    mufasaTriangle([0.45, -0.3], [0.2, 0.3], [0.55, -0.15], [0.0, 0.5, 0.5, 1.0]);

    mufasaTriangle([-0.55, -0.15], [-0.2, 0.3], [-0.55, 0.05], [0.1, 0.2, 0.5, 1.0]);
    mufasaTriangle([0.55, -0.15], [0.2, 0.3], [0.55, 0.05], [0.1, 0.2, 0.5, 1.0]);

    mufasaTriangle([-0.3, 0.45], [-0.2, 0.3], [-0.55, 0.05], [0.7, 0.2, 0.7, 1.0]);
    mufasaTriangle([0.3, 0.45], [0.2, 0.3], [0.55, 0.05], [0.7, 0.2, 0.7, 1.0]);

    mufasaTriangle([-0.3, 0.45], [-0.2, 0.3], [0.0, 0.45], [0.7, 0.7, 0.5, 1.0]);
    mufasaTriangle([0.3, 0.45], [0.2, 0.3], [0.0, 0.45], [0.7, 0.7, 0.5, 1.0]);

    mufasaTriangle([0.0, 0.2], [-0.2, 0.3], [0.0, 0.45], [0.7, 1.0, 0.5, 1.0]);
    mufasaTriangle([0.0, 0.2], [0.2, 0.3], [0.0, 0.45], [0.7, 1.0, 0.5, 1.0]);

    mufasaTriangle([-0.2, -0.25], [0.2, -0.25], [0.0, -0.35], [1.0, 1.0, 0.5, 1.0]);
    mufasaTriangle([-0.1, -0.45], [0.1, -0.45], [0.0, -0.35], [1.0, 1.0, 0.5, 1.0]);


    renderAllShapes();
}

function mufasaTriangle(point1, point2, point3, color) {
    let point = new TriangleArt();
    point.point1 = point1;
    point.point2 = point2;
    point.point3 = point3;
    point.color = color.slice();
    point.size = g_selectedSize;

    g_shapesList.push(point);
}
