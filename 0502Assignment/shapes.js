// https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm

(() => {
     // 3D Object class
    let shape = function (params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.color = params.color || {r: 0, g: 0, b: 0};
        this.colors = params.colors || {r: 0, g: 0, b: 0};
        this.translate = params.translate || {x: 0, y: 0, z: 0};
        this.scale = params.scale || {x: 1, y: 1, z: 1};
        this.angle = params.angle || 0;
        // this.children = params.children || [];
        this.axis = params.axis || {x: 1.0, y: 1.0, z: 1.0};
        this.vertices = params.vertices || [];
        this.indices = params.indices || [];
        this.mode = params.mode;
        this.normals = params.normals || [];
        this.specularColor = params.specularColor || {r: 1.0, g: 1.0, b: 1.0};
        this.specularColors = params.specularColors || null;
        this.shininess = params.shininess || 16;
    };

    // Mesh Makers
    shape.cube = () => {
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
        };
    };

    shape.pyramid = () => {
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
    };

    shape.sphere = () => {
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
    };

    window.Shape = shape;
})();
