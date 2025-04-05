class Cube {
    constructor() {
        this.type='cube';
        //this.position = [0.0, 0.0, 0.0, 0.0];
        this.color  = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv (u_ModelMatrix, false, this.matrix.elements);

        // front
        drawTriangle3DUVNormal([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0], [0,0,-1,  0,0,-1,  0,0,-1]);
        drawTriangle3DUVNormal([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1], [0,0,-1,  0,0,-1,  0,0,-1]);

        //drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1] );

        // other sides
        //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        //top
        drawTriangle3DUVNormal([0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0], [0,1,0,  0,1,0,  0,1,0]);
        drawTriangle3DUVNormal([0,1,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1], [0,1,0,  0,1,0,  0,1,0]);
        //drawTriangle3DUV( [0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,1,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

        //back
        drawTriangle3DUVNormal([0,0,1,  1,1,1,  1,0,1], [0,0, 1,1, 1,0], [1,0,0,  1,0,0,  1,0,0]);
        drawTriangle3DUVNormal([0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1], [1,0,0,  1,0,0,  1,0,0]);
        //drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1] );

        //bottom
        drawTriangle3DUVNormal([0,0,0,  0,0,1,  1,0,1], [0,0, 1,1, 1,0], [-1,0,0,  -1,0,0,  -1,0,0]);
        drawTriangle3DUVNormal([0,0,0,  1,0,1,  1,0,0], [0,0, 0,1, 1,1], [-1,0,0,  -1,0,0,  -1,0,0]);
        //drawTriangle3DUV( [0,0,0,  0,0,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  1,0,1,  1,0,0], [0,0, 0,1, 1,1] );

        // right side
        //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

        drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,0,1], [0,0, 1,1, 1,0], [0,-1,0,  0,-1,0,  0,-1,0]);
        drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,1,0], [0,0, 0,1, 1,1], [0,-1,0,  0,-1,0,  0,-1,0]);
        //drawTriangle3DUV( [0,0,0,  0,1,1,  0,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  0,1,1,  0,1,0], [0,0, 0,1, 1,1] );

        // left side
        //gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,0,1], [0,0, 1,1, 1,0], [0,0,1,  0,0,1,  0,0,1]);
        drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1], [0,0,1,  0,0,1,  0,0,1]);
        //drawTriangle3DUV( [1,0,0,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [1,0,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );
    }

    // render() {
    //     var rgba = this.color;

    //     gl.uniform1i(u_whichTexture, this.textureNum);

    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //     gl.uniformMatrix4fv (u_ModelMatrix, false, this.matrix.elements);

    //     // front
    //     drawTriangle3DUVNormal(
    //         [0,0,0, 1,1,0, 1,0,0],
    //         [0,0, 1,1, 1,0],
    //         [0,0,-1, 0,0,-1, 0,0,-1]
    //     );

    //     drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1] );

    //     // other sides
    //     gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //     //top
    //     drawTriangle3DUV( [0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [0,1,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

    //     //back
    //     drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1] );

    //     //bottom
    //     drawTriangle3DUV( [0,0,0,  0,0,1,  1,0,1], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [0,0,0,  1,0,1,  1,0,0], [0,0, 0,1, 1,1] );

    //     // right side
    //     gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //     drawTriangle3DUV( [0,0,0,  0,1,1,  0,0,1], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [0,0,0,  0,1,1,  0,1,0], [0,0, 0,1, 1,1] );

    //     // left side
    //     drawTriangle3DUV( [1,0,0,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
    //     drawTriangle3DUV( [1,0,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

    // }

}
