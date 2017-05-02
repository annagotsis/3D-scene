// https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm

window.Shape = (() => {
  // let GLSLUtilities = window.GLSLUtilities;
  // 3D Object class
    let Matrix = window.Matrix;
    return class Shape {
        constructor (params) {
            // this.gl = params.gl;
            // this.x = params.x || 0;
            // this.y = params.y || 0;
            // this.z = params.z || 0;
            this.color = params.color || {r: 0, g: 0, b: 0};

            this.specularColor = params.specularColor || {r: 1.0, g: 1.0, b: 1.0};
            // this.specularColors = params.specularColors;
            this.shininess = params.shininess || 20;

            this.translateValues = params.translateValues || {tx: 0, ty: 0, tz: 0};
            this.scaleValues = params.scaleValues || {sx: 1, sy: 1, sz: 1};
            this.currentRotation = params.currentRotation || 0;
            this.axisValues = params.axisValues || {rx: 1.0, ry: 1.0, rz: 1.0};
            // this.acceleration = params.acceleration || {x: 0, y: 0, vx: 2, vy: 2, ax: 0.5, ay: 0.5};

            this.vertices = params.vertices || [];
            this.indices = params.indices || [];
            this.mode = params.mode;
            this.normals = params.normals || [];

            // this.tx = params.tx || 0;
            // this.ty = params.ty || 0;
            // this.tz = params.tz || 0;
            //
            // this.sx = params.sx || 1;
            // this.sy = params.sy || 1;
            // this.sz = params.sz || 1;

            // this.currentRotation = params.currentRotation || 1;
            // this.rx = params.rx || 0;
            // this.ry = params.ry || 0;
            // this.rz = params.rz || 0;

            this.matrix = new Matrix();

            let colorArray = [];
            for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
                colorArray = colorArray.concat(
                    this.color.r,
                    this.color.g,
                    this.color.b
                  );
            }
            this.colors = colorArray;

            let specArray = [];
            for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
                specArray = specArray.concat(
                    this.specularColor.r,
                    this.specularColor.g,
                    this.specularColor.b
                );
            }
            this.specularColors = specArray;
        }

        translate(tx, ty, tz) {
            let x = tx || 0;
            let y = ty || 0;
            let z = tz || 0;
            console.log("laalla", Matrix);
            // let m = new window.Matrix();
            this.matrix.multiply(Matrix.translate(x, y, z));
            console.log(Matrix.translate(x, y, z));
        }

        rotate (angle, rx, ry, rz) {
            let rangle = angle;
            let x = rx || 0;
            let y = ry || 0;
            let z = rz || 0;
            this.matrix.multiply(Matrix.rotate(rangle, x, y, z));
        }

        scale (sx, sy, sz) {
            let x = sx || 0;
            let y = sy || 0;
            let z = sz || 0;
            this.matrix.multiply(Matrix.scale(x, y, z));
        }

        orthoMatrix (left, right, bottom, top, near, far) {
            // let width = right - left;
            // let height = top - bottom;
            // let depth = far - near;
            let l = left;
            let r = right;
            let b = bottom;
            let t = top;
            let n = near;
            let f = far;
            this.matrix.multiply(Matrix.orthoMatrix(l, r, b, t, n, f));
        }

        // drawObject(vertexPosition, vertexDiffuseColor, vertexSpecularColor,
        //   shininess, translateMatrix, scaleMatrix, rotationMatrix, normalVector) {
        //
        //     let m = new window.Matrix();
        //     this.gl.uniform4fv(translateMatrix, this.gl.FALSE, new Float32Array(m.translate(
        //       this.tx, this.ty, this.tz).conversion()));
        //     this.gl.uniform4fv(scaleMatrix, this.gl.FALSE, new Float32Array(m.scale(
        //     this.sx, this.sy, this.sz).conversion()));
        //     this.gl.uniform4fv(rotationMatrix, this.gl.FALSE, new Float32Array(m.rotate(
        //     this.currentRotation, this.rx, this.ry, this.rz).conversion()));
        //
        //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        //     this.gl.vertexAttribPointer(vertexDiffuseColor, 3, this.gl.FLOAT, false, 0, 0);
        //
        //     this.gl.bindBuffer(this.gl.gl.ARRAY_BUFFER, this.specularBuffer);
        //     this.gl.vertexAttribPointer(vertexSpecularColor, 3, this.gl.FLOAT, false, 0, 0);
        //
        //     this.gl.uniform1f(shininess, this.shininess);
        //     this.gl.bindBuffer(this.gl.gl.ARRAY_BUFFER, this.normalBuffer);
        //     this.gl.vertexAttribPointer(normalVector, 3, this.gl.FLOAT, false, 0, 0);
        //
        //     // Set the varying vertex coordinates.
        //     this.gl.bindBuffer(this.gl.gl.ARRAY_BUFFER, this.vertexBuffer);
        //     this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        //     this.gl.drawArrays(this.mode, 0, this.gl.vertices.length / 3);
        // }

    // shape.prototype.prepare = function() {
    //   this.vertexBuffer = GLSLUtilities.initVertexBuffer(gl, this.vertices);

    // Mesh Makers
        static cube() {
            return {
                vertices: [
                  [ 0.5, 0.5, 0.5 ],
                  [ 0.5, 0.5, -0.5 ],
                  [ -0.5, 0.5, -0.5 ],
                  [ -0.5, 0.5, 0.5 ],
                  [ 0.5, -0.5, 0.5 ],
                  [ 0.5, -0.5, -0.5 ],
                  [ -0.5, -0.5, -0.5 ],
                  [ -0.5, -0.5, 0.5 ]
                ],

                indices: [
                  [ 0, 1, 3 ],
                  [ 2, 3, 1 ],
                  [ 0, 3, 4 ],
                  [ 7, 4, 3 ],
                  [ 0, 4, 1 ],
                  [ 5, 1, 4 ],
                  [ 1, 5, 6 ],
                  [ 2, 1, 6 ],
                  [ 2, 7, 3 ],
                  [ 6, 7, 2 ],
                  [ 4, 7, 6 ],
                  [ 5, 4, 6 ],
                ]
            };
        }

        static pyramid() {
            return {
                vertices: [
                  [ -0.5, -0.5, -0.5 ],
                  [ -0.5, -0.5, 0.5 ],
                  [ 0.5, -0.5, 0.5 ],
                  [ 0.5, -0.5, -0.5 ],
                  [ 0.0, 0.5, 0.0 ]
                ],

                indices: [
                  [ 0, 1, 2 ],
                  [ 2, 3, 0 ],
                  [ 2, 3, 4 ],
                  [ 1, 2, 4 ],
                  [ 0, 1, 4 ],
                  [ 0, 3, 4 ]
                ]
            };
        }

        static sphere() {
            let lat = 40;
            let longt = 40;
            let r = 0.5;
            let vertices = [];
            let indices = [];

            for (let currentLat = 0; currentLat <= lat; currentLat++) {
                let t = currentLat * Math.PI / lat;
                let sin = Math.sin(t);
                let cos = Math.cos(t);

                for (let currentLong = 0; currentLong <= longt; currentLong++) {
                    let s = currentLong * Math.PI * 2 / longt;
                    let sinS = Math.sin(s);
                    let cosS = Math.cos(s);

                    vertices.push([r * cosS * sin, r * cos, r * sin * sinS]);

                    let top = (currentLat * (1 + longt)) + currentLong;
                    let bottom = top + longt + 1;

                    if (currentLong !== longt && currentLat !== lat) {
                        indices.push([top + 1, bottom, top]);
                        indices.push([top + 1, bottom + 1, bottom]);
                    }
                }
            }
            return {
                vertices: vertices,
                indices: indices
            };
        }
    };

})();
