/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
((canvas) => {
    let gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    let objectsToDraw = [
        {
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 10,
            normals: Mesh.toNormalArray(Shape.pyramid()),
            color: { r: 0.50, g: 0.25, b: 0.5 },
            vertices: Mesh.toRawTriangleArray(Shape.pyramid()),
            mode: gl.TRIANGLES,
            translate: {tx: 0, ty: 0, tz: 0},
            scale: {sx: 0.7, sy: 0.7, sz: 0.7},
            axis: { x: 0, y: 1.0, z: 1.0 }
        },

        {
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 10,
            normals: Mesh.toNormalArray(Shape.sphere()),
            color: { r: 0.6, g: 0.2, b: 0.6 },
            translate: {tx: -1.5, ty: 0.35, tz: 0},
            scale: {sx: 1, sy: 1, sz: 1},
            axis: { x: 1.0, y: 1.0, z: 1.0 },
            vertices: Mesh.toRawTriangleArray(Shape.sphere()),
            mode: gl.LINES
        },

        // new Shape ({
        //     colors: [].concat(
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 1.0, 0.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 1.0, 0.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 0.0, 0.0, 1.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 1.0, 0.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 1.0, 0.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ],
        //     [ 0.0, 1.0, 1.0 ]
        //   ),
        //     specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        //     shininess: 10,
        //     normals: Mesh.toNormalArray(Shape.cube()),
        //     translate: {tx: 0.5, ty: 0.5, tz: 0},
        //     scale: {sx: 0.6, sy: 0.6, sz: 0.6},
        //     axis: { x: 1, y: 1, z: 0 },
        //     vertices: Mesh.toRawTriangleArray(Shape.cube()),
        //     mode: gl.TRIANGLES
        //
        // }),
        //
        // new Shape ({
        //     colors: [].concat(
        //     [ 0, 255, 0],
        //     [ 0, 255, 0],
        //     [ 0, 255, 0],
        //     [ 0, 255, 0],
        //     [ 0, 255, 0],
        //     [ 0, 255, 0],
        //     [ 255, 0, 255],
        //     [ 255, 0, 255 ],
        //     [ 255, 0, 255 ],
        //     [ 255, 0, 255 ],
        //     [ 255, 0, 255],
        //     [ 255, 0, 255 ],
        //     [ 0, 153, 255 ],
        //     [ 0, 153, 255 ],
        //     [ 0, 153, 255 ],
        //     [ 0, 102, 255 ],
        //     [ 0, 102, 255 ],
        //     [ 0, 102, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 0, 0, 255 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 0, 0 ],
        //     [ 255, 255, 0 ],
        //     [ 255, 255, 0 ],
        //     [ 255, 255, 0 ],
        //     [ 255, 255, 0 ],
        //     [ 255, 255, 0 ],
        //     [ 255, 255, 0 ]
        //   ),
        //     specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        //     shininess: 10,
        //     normals: Mesh.toNormalArray(Shape.cube()),
        //     translate: {tx: -0.5, ty: -0.5, tz: 0},
        //     scale: {sx: 0.6, sy: 0.6, sz: 0.6},
        //     axis: { x: -1, y: -1, z: -1 },
        //     vertices: Mesh.toRawTriangleArray(Shape.cube()),
        //     mode: gl.TRIANGLES
        //
        // })
    ];
    console.log(objectsToDraw);

    // Pass the vertices to WebGL.
    objectsToDraw.forEach((objectToDraw) => {
        objectToDraw.vertexBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.vertices);

        if (!objectToDraw.colors) {
            // If we have a single color, we expand that into an array
            // of the same color over and over.
            objectToDraw.colors = [];
            for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
                objectToDraw.colors = objectToDraw.colors.concat(
                    objectToDraw.color.r,
                    objectToDraw.color.g,
                    objectToDraw.color.b
                );
            }
        }
        objectToDraw.colorBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.colors);

        // Same trick with specular colors.
        if (!objectToDraw.specularColors) {
            // Future refactor: helper function to convert a single value or
            // array into an array of copies of itself.
            objectToDraw.specularColors = [];
            for (let j = 0, maxj = objectToDraw.vertices.length / 3; j < maxj; j += 1) {
                objectToDraw.specularColors = objectToDraw.specularColors.concat(
                    objectToDraw.specularColor.r,
                    objectToDraw.specularColor.g,
                    objectToDraw.specularColor.b
                );
            }
        }
        objectToDraw.specularBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.specularColors);

        // One more buffer: normals.
        objectToDraw.normalBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.normals);
    });

    // Initialize the shaders.
    let abort = false;
    let shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        (shader) => {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        (shaderProgram) => {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    let vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    let vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    let vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    let normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    let modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    let xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    let yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");
    let projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    // Note the additional variables.
    let lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    let lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    let lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    let shininess = gl.getUniformLocation(shaderProgram, "shininess");

    let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");

    /*
     * Displays an individual object, including a transformation that now varies
     * for each object drawn.
     */
    let drawObject = (object) => {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        // Set the shininess.
        gl.uniform1f(shininess, object.shininess);

        let currentMatrix = new Matrix();

        let translate = Matrix.translate(
               object.translate.tx,
               object.translate.ty,
               object.translate.tz
           );

        // let rotate = Matrix.rotate(
        //        currentRotation,
        //        object.axis.x,
        //        object.axis.y,
        //        object.axis.z
        //    );

        let scale = Matrix.scale(
             object.scale.sx,
             object.scale.sy,
             object.scale.sz
           );


        let transformed = currentMatrix.multiply(translate).multiply(scale);
        // let rotated = transformed.multiply(rotate);


        // console.log("currentMatrix", currentMatrix);
        // // console.log("rotate", currentMatrix.multiply(rotate));
        // console.log("translate", currentMatrix.multiply(translate));
        // console.log("scale", currentMatrix.multiply(scale));

        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(transformed.conversion()));
        // gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(rotated.conversion()));

        // Set up the model-view matrix, if an axis is included.  If not, we
        // specify the identity matrix.
        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(object.rotation ?
        //     getRotationMatrix(object.rotation.theta, object.rotation.x, object.rotation.y, object.rotation.z) :
        //     [1, 0, 0, 0, // N.B. In a full-fledged matrix library, the identity
        //      0, 1, 0, 0, //      matrix should be available as a function.
        //      0, 0, 1, 0,
        //      0, 0, 0, 1]
        // ));

        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(Matrix.rotate().conversion()));

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
    let rotationAroundX = 0.0;
    let rotationAroundY = 0.0;
    let drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set the overall rotation.
        gl.uniformMatrix4fv(xRotationMatrix, gl.FALSE, new Float32Array(
            Matrix.rotate(rotationAroundX, 1.0, 0.0, 0.0).conversion()
        ));
        gl.uniformMatrix4fv(yRotationMatrix, gl.FALSE, new Float32Array(
            Matrix.rotate(rotationAroundY, 0.0, 1.0, 0.0).conversion()
        ));

        objectsToDraw.forEach(drawObject);

        // All done.
        gl.flush();
    };

    /*
     * Performs rotation calculations.
     */
    let xDragStart;
    let yDragStart;
    let xRotationStart;
    let yRotationStart;

    let rotateScene = (event) => {
        rotationAroundX = xRotationStart - yDragStart + event.clientY;
        rotationAroundY = yRotationStart - xDragStart + event.clientX;
        drawScene();
    };

    // Because our canvas element will not change size (in this program),
    // we can set up the projection matrix once, and leave it at that.
    // Note how this finally allows us to "see" a greater coordinate range.
    // We keep the vertical range fixed, but change the horizontal range
    // according to the aspect ratio of the canvas.  We can also expand
    // the z range now.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, new Float32Array(Matrix.orthoMatrix(
        -2 * (canvas.width / canvas.height),
        2 * (canvas.width / canvas.height),
        -2,
        2,
        -10,
        10
    ).conversion()));

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, [500.0, 1000.0, 100.0, 1.0]);
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

    // Instead of animation, we do interaction: let the mouse control rotation.
    $(canvas).mousedown((event) => {
        xDragStart = event.clientX;
        yDragStart = event.clientY;
        xRotationStart = rotationAroundX;
        yRotationStart = rotationAroundY;
        $(canvas).mousemove(rotateScene);
    }).mouseup((event) => {
        $(canvas).unbind("mousemove");
    });

    // Draw the initial scene.
    drawScene();

})(document.getElementById("webgl"));
