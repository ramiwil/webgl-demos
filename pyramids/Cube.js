class Cube {
    constructor() {
        this.type='cube';
        //this.position = [0.0, 0.0, 0.0, 0.0];
        this.color  = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = 1;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv (u_ModelMatrix, false, this.matrix.elements);

        // front
        drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1] );

        // other sides
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        //top
        drawTriangle3DUV( [0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,1,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

        //back
        drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1] );

        //bottom
        drawTriangle3DUV( [0,0,0,  0,0,1,  1,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0,  1,0,1,  1,0,0], [0,0, 0,1, 1,1] );

        // right side
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

        drawTriangle3DUV( [0,0,0,  0,1,1,  0,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0,  0,1,1,  0,1,0], [0,0, 0,1, 1,1] );

        // left side
        drawTriangle3DUV( [1,0,0,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [1,0,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

    }

    renderfast() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv (u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];

        // front
        allverts = allverts.concat([0,0,0,  1,1,0,  1,0,0]);
        allverts = allverts.concat([0,0,0,  0,1,0,  1,1,0]);
        //drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1] );

        // other sides
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        //top
        //allverts = allverts.concat([0,1,0,  0,1,1,  1,1,1]);
        //allverts = allverts.concat([0,1,0,  1,1,1,  1,1,0]);
        //drawTriangle3DUV( [0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,1,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

        //back
        //allverts = allverts.concat([0,0,1,  1,1,1,  1,0,1]);
        //allverts = allverts.concat([0,0,1,  0,1,1,  1,1,1]);
        //drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1] );

        //bottom
        //allverts = allverts.concat([0,0,0,  0,0,1,  1,0,1]);
        //allverts = allverts.concat([0,0,0,  1,0,1,  1,0,0]);
        //drawTriangle3DUV( [0,0,0,  0,0,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  1,0,1,  1,0,0], [0,0, 0,1, 1,1] );

        // right side
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        //allverts = allverts.concat([0,0,0,  0,1,1,  0,0,1]);
        //allverts = allverts.concat([0,0,0,  0,1,1,  0,1,0]);
        //drawTriangle3DUV( [0,0,0,  0,1,1,  0,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0,  0,1,1,  0,1,0], [0,0, 0,1, 1,1] );

        // left side
        //allverts = allverts.concat([1,0,0,  1,1,1,  1,0,1]);
        //allverts = allverts.concat([1,0,0,  1,1,1,  1,1,0]);
        //drawTriangle3DUV( [1,0,0,  1,1,1,  1,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [1,0,0,  1,1,1,  1,1,0], [0,0, 0,1, 1,1] );

        drawTriangle3D(allverts);
    }
}
