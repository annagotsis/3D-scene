/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
(() => {

    /*
     * Returns the vertices for a small icosahedron.
     */

    let shape = (params) => {
      // currentLocation =
      // currentVelocity
        this.color = params.color || {r: 0, g: 0, b: 0};
      // currentAcceleration
      // currentRotation
        this.translate = params.translate || {x: 0, y: 0, z: 0};
        this.scale = params.scale || {x: 1, y: 1, z: 1};
        // this.x = params.x || 0;
        // this.y = params.y || 0;
        // this.z = params.z || 0;
    };

    let cube = () => {
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
            ],

//             colors = [
//  [1.0,  1.0,  1.0,  1.0],    // Front face: white
//  [1.0,  0.0,  0.0,  1.0],    // Back face: red
//  [0.0,  1.0,  0.0,  1.0],    // Top face: green
//  [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
//  [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
//  [1.0,  0.0,  1.0,  1.0]     // Left face: purple
// ]
            // colors: [
            //   [ 1.0, 0.0, 0.0 ],
            //   [ 0.0, 1.0, 0.0 ],
            //   [ 0.0, 0.0, 1.0 ],
            //   [ 1.0, 0.0, 0.0 ],
            //   [ 0.0, 1.0, 0.0 ],
            //   [ 1.0, 0.0, 0.0 ],
            //   [ 0.0, 1.0, 0.0 ],
            //   [ 0.0, 0.0, 1.0 ]
            // ]
        };
    };

    let sphere = () => {
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
                    indices.push([ top + 1, bottom, top]);
                    indices.push([top + 1, bottom + 1, bottom]);
                }
            }
        }
        return {
            vertices: vertices,
            indices: indices
        };
    };

    let icosahedron = () => {
        // The core icosahedron coordinates.
        const X = 0.525731112119133606;
        const Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    };

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    let toRawTriangleArray = (indexedVertices) => {
        let result = [];

        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    };

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    let toRawLineArray = (indexedVertices) => {
        let result = [];

        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    };

    let toRegularArray = (indexedVertices) => {
        let result = [];

        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {

            let zero = indexedVertices.vertices[indexedVertices.indices[i][0]];
            let one = indexedVertices.vertices[indexedVertices.indices[i][1]];
            let two = indexedVertices.vertices[indexedVertices.indices[i][2]];

            let v0 = new Vector(zero[0], zero[1], zero[2]);
            let v1 = new Vector(one[0], one[1], one[2]).subtract(v0);
            let v2 = new Vector(two[0], two[1], two[2]).subtract(v0);

            let normal = v1.cross(v2).unit();

            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                  [normal.x(), normal.y(), normal.z()]
                );
            }
        }
        return result;

    };

    let toVertexNormalArray = (indexedVertices) => {
        let result = [];

       // For each face...
        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
           // For each vertex in that face...
            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                let p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                let normal = new Vector(p[0], p[1], p[2]).unit();
                result = result.concat(
                   [ normal.x(), normal.y(), normal.z() ]
               );
            }
        }

        return result;
    };

    window.Shapes = {
        icosahedron,
        cube,
        sphere,
        toRawTriangleArray,
        toRawLineArray,
        toRegularArray,
        toVertexNormalArray
    };
})();

/*
 * This JavaScript file defines a Vector object and associated functions.
 * The object itself is returned as the result of a function, allowing us
 * to encapsulate its code and module variables.
 *
 * This module's approach is non-destructive: methods always return new
 * Vector objects, and never modify the operands. This is a design choice.
 *
 * This module is designed for vectors of any number of dimensions.  The
 * implementations are generalized but not optimal for certain sizes of
 * vectors. Specific Vector2D and Vector3D implementations can be much
 * more compact, while sacrificing generality.
 */
window.Vector = (function () {
    // A private method for checking dimensions,
    // throwing an exception when different.
    let checkDimensions = (v1, v2) => {
        if (v1.dimensions !== v2.dimensions) {
            throw "Vectors have different dimensions";
        }
    };

    // Define the class.
    return class Vector {
        constructor() {
            this.elements = [].slice.call(arguments);
        }

        get dimensions() {
            return this.elements.length;
        }

        get x() {
            return this.elements[0];
        }

        get y() {
            return this.elements[1];
        }

        get z() {
            return this.elements[2];
        }

        get w() {
            return this.elements[3];
        }

        add(v) {
            let result = new Vector();

            checkDimensions(this, v);

            for (let i = 0, max = this.dimensions; i < max; i += 1) {
                result.elements[i] = this.elements[i] + v.elements[i];
            }

            return result;
        }

        subtract(v) {
            let result = new Vector();

            checkDimensions(this, v);

            for (let i = 0, max = this.dimensions; i < max; i += 1) {
                result.elements[i] = this.elements[i] - v.elements[i];
            }

            return result;
        }

        multiply(s) {
            let result = new Vector();

            for (let i = 0, max = this.dimensions; i < max; i += 1) {
                result.elements[i] = this.elements[i] * s;
            }

            return result;
        }

        divide(s) {
            let result = new Vector();

            for (let i = 0, max = this.dimensions; i < max; i += 1) {
                result.elements[i] = this.elements[i] / s;
            }

            return result;
        }

        dot(v) {
            let result = 0;

            checkDimensions(this, v);

            for (let i = 0, max = this.dimensions; i < max; i += 1) {
                result += this.elements[i] * v.elements[i];
            }

            return result;
        }

        cross(v) {
            if (this.dimensions !== 3 || v.dimensions !== 3) {
                throw "Cross product is for 3D vectors only.";
            }

            // With 3D vectors, we can just return the result directly.
            return new Vector(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }

        get magnitude() {
            return Math.sqrt(this.dot(this));
        }

        get unit() {
            // At this point, we can leverage our more "primitive" methods.
            return this.divide(this.magnitude);
        }

        projection(v) {
            checkDimensions(this, v);

            // Plug and chug :)
            // The projection of u onto v is u dot the unit vector of v
            // times the unit vector of v.
            let unitv = v.unit;
            return unitv.multiply(this.dot(unitv));
        }
    };
})();
