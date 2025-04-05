class Cube {
    constructor() {
        this.type='cube';
        //this.position = [0.0, 0.0, 0.0, 0.0];
        this.color  = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv (u_ModelMatrix, false, this.matrix.elements);

        // front
        drawTriangle3D( [0,0,0,  1,1,0,  1,0,0] );
        drawTriangle3D( [0,0,0,  0,1,0,  1,1,0] );

        // other sides
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        //top
        drawTriangle3D( [0,1,0,  0,1,1,  1,1,1] );
        drawTriangle3D( [0,1,0,  1,1,1,  1,1,0] );

        //back
        drawTriangle3D( [0,0,1,  1,1,1,  1,0,1] );
        drawTriangle3D( [0,0,1,  0,1,1,  1,1,1] );

        //bottom
        drawTriangle3D( [0,0,0,  0,0,1,  1,0,1] );
        drawTriangle3D( [0,0,0,  1,0,1,  1,0,0] );

        // right side
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

        drawTriangle3D( [0,0,0,  0,1,1,  0,0,1] );
        drawTriangle3D( [0,0,0,  0,1,1,  0,1,0] );

        // left side
        drawTriangle3D( [1,0,0,  1,1,1,  1,0,1] );
        drawTriangle3D( [1,0,0,  1,1,1,  1,1,0] );

    }
}
