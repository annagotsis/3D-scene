// multiplyMatricies = function (object) {
//         return new Matrix().translate(object.translate.x, object.translate.y, object.translate.z).multiply(
//             new Matrix().rotate(object.rotateAngle, object.axis.x, object.axis.y, object.axis.z)).multiply(
//             new Matrix().scale(object.scale.x, object.scale.y, object.scale.z)) || new Matrix();
//     };

let Matrix = (() => {

    let matrix = (identityMatrix) => {
        this.data = identityMatrix || [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];
    };

    matrix.multiply = (matrix2) => {
        let result = [];
        for (let i = 0; i <= this.data.length; i++) {
            let matrix1 = this.data[i];
            for (let c = 0; c <= matrix1.length; c++) {
                let product = 0;
                for (let j = 0; j < this.data.length; j++) {
                    product += this.data[i][j] * matrix2.data[j][c];
                }
                result.data[i][c] = product;
            }
        }
        return new Matrix(result);
    };

    matrix.translate = (tx, ty, tz) => {
        let result = new Matrix([
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1]);
        return result;
    };

    matrix.scale = (sx, sy, sz) => {
        let result = new Matrix([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1]);
        return result;
    };

    matrix.rotate = (angle, x, y, z) => {
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

        return new Matrix([
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
        ]);
    };

    matrix.orthoMatrix = (left, right, bottom, top, near, far) => {
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;

        return new Matrix([
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
        ]);
    };

    matrix.perspective = (left, right, top, bottom, near, far) => {
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;
        return new Matrix([
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
        ]);
    };

    matrix.conversion = () => {
        let result = [];
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data.length; i++) {
                result.push(this.data[j][i]);
            }
        }
        return result;
    };

    return matrix;

})();
