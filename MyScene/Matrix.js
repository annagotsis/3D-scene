(() => {

    let Matrix = function() {
        this.data = arguments.length ? [].slice.call(arguments) : [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    };

    Matrix.prototype.multiply = function (Matrix2) {
        let multResult = 0;
        let resultMatrix = new Matrix();
        let position = 0;
        for (let row = 0; row < 16; row += 4) {
            for (let column = 0; column < 4; column += 1) {
                for (let count = 0; count < 4; count += 1) {
                    multResult += this.data[row + count] * Matrix2.data[column + (count * 4)];
                    // console.log(multResult);
                }
                resultMatrix.data[position] = multResult;
                position += 1;
                multResult = 0;
            }
        }
        return resultMatrix;
    };

    Matrix.translate = function (tx, ty, tz) {
        let result = new Matrix(
            1,
            0,
            0,
            tx,

            0,
            1,
            0,
            ty,

            0,
            0,
            1,
            tz,

            0,
            0,
            0,
            1
          );
        return result;
    };

    Matrix.scale = (sx, sy, sz) => {
        let result = new Matrix(
          sx,
          0,
          0,
          0,

          0,
          sy,
          0,
          0,

          0,
          0,
          sz,
          0,

          0,
          0,
          0,
          1
        );
        return result;
    };

    Matrix.rotate = (angle, x, y, z) => {
        let axisLength = Math.sqrt((x * x) + (y * y) + (z * z));
        let s = Math.sin(angle * Math.PI / 180.0);
        let c = Math.cos(angle * Math.PI / 180.0);
        let oneMinusC = 1.0 - c;

        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        let x2 = x * x;
        let y2 = y * y;
        let z2 = z * z;
        let xy = x * y;
        let yz = y * z;
        let xz = x * z;
        let xs = x * s;
        let ys = y * s;
        let zs = z * s;

        return new Matrix(
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys,
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        );
    };

    Matrix.orthoMatrix = (left, right, bottom, top, near, far) => {
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;

        return new Matrix(
            2.0 / width,
            0.0,
            0.0,
            -(right + left) / width,

            0.0,
            2.0 / height,
            0.0,
            -(top + bottom) / height,

            0.0,
            0.0,
            -2.0 / depth,
            -(far + near) / depth,

            0.0,
            0.0,
            0.0,
            1.0
        );
    };

    Matrix.perspective = (left, right, top, bottom, near, far) => {
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;
        return new Matrix(
            (2.0 * near) / width,
            0.0,
            (right + left) / width,
            0.0,

            0.0,
            (2.0 * near) / height,
            (top + bottom) / height,
            0.0,

            0.0,
            -(far + near) / depth,
            (-2 * far * near) / depth,
            0.0,

            0.0,
            0.0,
            -1.0,
            0.0
        );
    };

    // Matrix.camera = function(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
    //     let result = new Matrix();
    //
    //     let e = new Vector(ex, ey, ez);
    //     let c = new Vector(cx, cy, cz);
    //     let u = new Vector(ux, uy, uz);
    //
    //     let f = e.subtract(c);
    //     let s = u.cross(f);
    //     let t = f.cross(s);
    //
    //     s.x,
    //     s.y,
    //     s.z,
    //     -s.dot(e);
    //
    //     t.x,
    //     t.y,
    //     t.z,
    //     -t.dot(e);
    //
    //     f.x,
    //     f.y,
    //     f.z,
    //     -f.dot(e);
    //
    //     0;
    //     0;
    //     0;
    //     1;
    //
    //     return result;
    // };

    Matrix.prototype.conversion = function() {
        let result = [];
        for (let i = 0; i < 4; i += 1) {
            result.push(this.data[i]);
            result.push(this.data[i + 4]);
            result.push(this.data[i + 8]);
            result.push(this.data[i + 12]);
        }
        // console.log(result);
        return result;
    };

    window.Matrix = Matrix;

})();
