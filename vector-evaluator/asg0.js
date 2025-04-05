function main() {
    //Get canvas element
    window.canvas = document.getElementById('canvas1');
    if(!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    //Get the rendering context for 2DCG
    window.ctx = canvas.getContext('2d');


    //Draw a black DrawRectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height); //Fill a rectangle with the color

    let v1 = new Vector3([2.25,2.25,0]);
    //console.log(v1.elements[0]);

    drawVector(v1, "red");

}

function drawVector(v, color) {

    let cx = canvas.width/2;
    let cy = canvas.height/2;

    window.ctx.beginPath();
    window.ctx.moveTo(cx, cy);
    window.ctx.lineTo(cx + v.elements[0]*20, cy - v.elements[1]*20);
    window.ctx.strokeStyle = color;
    window.ctx.stroke();
}

function handleDrawEvent() {
    window.ctx.fillStyle = "black";
    window.ctx.fillRect(0,0,window.canvas.width,window.canvas.height);

    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;

    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    window.ctx.fillStyle = "black";
    window.ctx.fillRect(0,0,window.canvas.width,window.canvas.height);

    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;

    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");

    let operation = document.getElementById("operation").value;
    let scalar = document.getElementById("scalar").value;

    if (operation == "add") {
        let result = v1.add(v2);
        drawVector(result, "green");
    } else if (operation == "sub") {
        let result = v1.sub(v2);
        drawVector(result, "green");
    } else if (operation == "div") {
        let result1 = v1.div(scalar);
        let result2 = v2.div(scalar);

        drawVector(result1, "green");
        drawVector(result2, "green");
    } else if (operation == "mul") {
        let result1 = v1.mul(scalar);
        let result2 = v2.mul(scalar);

        drawVector(result1, "green");
        drawVector(result2, "green");
    } else if (operation == "magnitude") {
        let mag1 = v1.magnitude();
        let mag2 = v2.magnitude();

        console.log("Magnitude v1: " + mag1);
        console.log("Magnitude v2: " + mag2);
    } else if (operation == "normalize") {
        let result1 = v1.normalize();
        let result2 = v2.normalize();

        drawVector(result1, "green");
        drawVector(result2, "green");

    } else if (operation == "angle") {
        console.log(angleBetween(v1, v2));
    } else if (operation == "area") {
        console.log(areaTriangle(v1, v2));
    }


}

function angleBetween(v1, v2) {
    let dotProduct = Vector3.dot(v1, v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();

    return (Math.acos(dotProduct / (mag1 * mag2))) * (180/Math.PI);
}

function areaTriangle(v1, v2) {
    let result = Vector3.cross(v1, v2);
    return 0.5*(result.magnitude());
}
