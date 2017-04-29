(() => {
    let mesh = function () {};

    mesh.toRawTriangleArray = (indexedVertices) => {
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

    mesh.toRawLineArray = (indexedVertices) => {
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

    mesh.toNormalArray = (indexedVertices) => {
        let result = [];

        // For each face...
        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            let p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
            let p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
            let p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            let v0 = new Vector(p0[0], p0[1], p0[2]);
            let v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
            let v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
            let normal = v1.cross(v2).unit;

            // We then use this same normal for every vertex in this face.
            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x, normal.y, normal.z ]
                );
            }
        }

        return result;
    };

    mesh.toVertexNormalArray = (indexedVertices) => {
        let result = [];

        // For each face...
        for (let i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (let j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                let p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                let normal = new Vector(p[0], p[1], p[2]).unit;
                result = result.concat(
                    [ normal.x, normal.y, normal.z ]
                );
            }
        }

        return result;
    };

    window.Mesh = mesh;
})();
