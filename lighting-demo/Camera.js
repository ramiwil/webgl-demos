class Camera{
    constructor(){
        this.eye = new Vector3([0, 0, 2]);
        this.at = new Vector3([0, 0.5, -100]);
        this.up = new Vector3([0,1,0]);
        this.flag = false;
        this.angle = 90;
    }

    updateAngle() {
        var angleNew = new Vector3();
        angleNew.set(this.at);
        angleNew.sub(this.eye);
        angleNew.normalize();
        this.angle = -1*Math.atan2(angleNew.elements[2], angleNew.elements[0])*180/Math.PI;
    }

    forward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.2);

        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    backward() {
        var b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(0.2);

        this.at = this.at.add(b);
        this.eye = this.eye.add(b);
    }

    right() {
        var f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        var s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.2);

        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    left() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.2);

        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    // rotateLeft() {
    //     var f = new Vector3();
    //     var f_prime = new Vector3();
    //     if (this.flag) {
    //         this.at = new Vector3([0, 0, -100]);
    //         f_prime = new Vector3();
    //         f = new Vector3();
    //         this.flag = false;
    //     } else {
    //         f.set(this.at);
    //         f.sub(this.eye);
    //     }


    //     var rotMat = new Matrix4()
    //     rotMat.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);


    //     f_prime = rotMat.multiplyVector3(f);

    //     this.at = this.at.add(f_prime);

    //     if (f.magnitude() >= 1.8374073614435234e+23) {
    //         this.flag = true;
    //     }
    //     //console.log(f_prime.magnitude());
    //     //console.log(f.magnitude());
    // }

    rotateLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var f_prime = Math.atan2(f.elements[2], f.elements[0]);
        f_prime -= .2;

        f.elements[0] = Math.cos(f_prime);
        f.elements[2] = Math.sin(f_prime);
        f.add(this.eye);
        this.at = f;
        this.updateAngle();

    }


    // rotateRight() {
    //     var f = new Vector3();
    //     var f_prime = new Vector3();
    //     if (this.flag) {
    //         this.at = new Vector3([0, 0, -100]);
    //         f_prime = new Vector3();
    //         f = new Vector3();
    //         this.flag = false;
    //     } else {
    //         f.set(this.at);
    //         f.sub(this.eye);
    //     }


    //     var rotMat = new Matrix4()
    //     rotMat.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);


    //     f_prime = rotMat.multiplyVector3(f);

    //     this.at = this.at.add(f_prime);

    //     if (f.magnitude() >= 1.8374073614435234e+23) {
    //         this.flag = true;
    //     }
    //     //console.log(f_prime.magnitude());
    //     //console.log(f.magnitude());
    // }


    rotateRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var f_prime = Math.atan2(f.elements[2], f.elements[0]);
        f_prime += .2;

        f.elements[0] = Math.cos(f_prime);
        f.elements[2] = Math.sin(f_prime);
        f.add(this.eye);
        this.at = f;
        this.updateAngle();
    }

    // rotateLeftMouse(angle) {
    //     var f = new Vector3();
    //     var f_prime = new Vector3();
    //     if (this.flag) {
    //         this.at = new Vector3([0, 0, -100]);
    //         f_prime = new Vector3();
    //         f = new Vector3();
    //         this.flag = false;
    //     } else {
    //         f.set(this.at);
    //         f.sub(this.eye);
    //     }


    //     var rotMat = new Matrix4()
    //     rotMat.setRotate(10*angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);


    //     f_prime = rotMat.multiplyVector3(f);

    //     this.at = this.at.add(f_prime);

    //     if (f.magnitude() >= 1.8374073614435234e+23) {
    //         this.flag = true;
    //     }
    //     //console.log(f_prime.magnitude());
    //     //console.log(f.magnitude());
    // }


    // rotateRightMouse(angle) {
    //     var f = new Vector3();
    //     var f_prime = new Vector3();
    //     if (this.flag) {
    //         this.at = new Vector3([0, 0, -100]);
    //         f_prime = new Vector3();
    //         f = new Vector3();
    //         this.flag = false;
    //     } else {
    //         f.set(this.at);
    //         f.sub(this.eye);
    //     }


    //     var rotMat = new Matrix4()
    //     rotMat.setRotate(-10*angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);


    //     f_prime = rotMat.multiplyVector3(f);

    //     this.at = this.at.add(f_prime);

    //     if (f.magnitude() >= 1.8374073614435234e+23) {
    //         this.flag = true;
    //     }
    //     //console.log(f_prime.magnitude());
    //     //console.log(f.magnitude());
    // }

    rotateMouse(angle) {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.elements[0] = Math.cos(360*angle/90);
        f.elements[2] = Math.sin(360*angle/90);
        f.normalize();
        f.add(this.eye);
        this.at = f;
        this.at.elements[1] = 0;
        this.updateAngle();
    }






}
