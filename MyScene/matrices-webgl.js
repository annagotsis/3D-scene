/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
((canvas) => {

    // Grab the WebGL rendering context.
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

    // Build the objects to display.  Note how each object may come with a
    // rotation axis now.
    let objectsToDraw = [
        // We move our original triangles a bit to accommodate a new addition
        // to the scene (yes, a translation will also do the trick, if it
        // where implemented in this program).

        {
            color: { r: 0.50, g: 0.25, b: 0.5 },
            vertices: Mesh.toRawLineArray(Shape.pyramid()),
            mode: gl.LINES,
            translate: {tx: 0, ty: 0, tz: 0},
            scale: {sx: 1, sy: 1, sz: 1},
            axis: { x: 0, y: 1.0, z: 1.0 },
        },

        {
            color: { r: 0.6, g: 0.2, b: 0.6 },
            translate: {tx: -1.5, ty: 0.35, tz: 0},
            scale: {sx: 1, sy: 1, sz: 1},
            axis: { x: 1.0, y: 1.0, z: 1.0 },
            vertices: Mesh.toRawLineArray(Shape.sphere()),
            mode: gl.LINES
        },

        new Shape ({
            colors: [].concat(
            [ 1.0, 0.0, 0.0 ],
            [ 1.0, 0.0, 0.0 ],
            [ 1.0, 0.0, 0.0 ],
            [ 1.0, 0.0, 0.0 ],
            [ 1.0, 0.0, 0.0 ],
            [ 1.0, 0.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 1.0, 0.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 1.0, 0.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 1.0, 0.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ],
            [ 0.0, 1.0, 1.0 ]
          ),
            translate: {tx: 0.5, ty: 0.5, tz: 0},
            scale: {sx: 1, sy: 1, sz: 1},
            axis: { x: 1, y: 1, z: 0 },
            vertices: Mesh.toRawTriangleArray(Shape.cube()),
            mode: gl.TRIANGLES

        }),

        new Shape ({
            colors: [].concat(
            [ 0, 255, 0],
            [ 0, 255, 0],
            [ 0, 255, 0],
            [ 0, 255, 0],
            [ 0, 255, 0],
            [ 0, 255, 0],
            [ 255, 0, 255],
            [ 255, 0, 255 ],
            [ 255, 0, 255 ],
            [ 255, 0, 255 ],
            [ 255, 0, 255],
            [ 255, 0, 255 ],
            [ 0, 153, 255 ],
            [ 0, 153, 255 ],
            [ 0, 153, 255 ],
            [ 0, 102, 255 ],
            [ 0, 102, 255 ],
            [ 0, 102, 255 ],
            [ 0, 0, 255 ],
            [ 0, 0, 255 ],
            [ 0, 0, 255 ],
            [ 0, 0, 255 ],
            [ 0, 0, 255 ],
            [ 0, 0, 255 ],
            [ 255, 0, 0 ],
            [ 255, 0, 0 ],
            [ 255, 0, 0 ],
            [ 255, 0, 0 ],
            [ 255, 0, 0 ],
            [ 255, 0, 0 ],
            [ 255, 255, 0 ],
            [ 255, 255, 0 ],
            [ 255, 255, 0 ],
            [ 255, 255, 0 ],
            [ 255, 255, 0 ],
            [ 255, 255, 0 ]
          ),
            translate: {tx: -0.5, ty: -0.5, tz: 0},
            scale: {sx: 1, sy: 1, sz: 1},
            axis: { x: -1, y: -1, z: -1 },
            vertices: Mesh.toRawTriangleArray(Shape.cube()),
            mode: gl.TRIANGLES

        })
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
    let vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    let modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    let projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // let cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    /*
     * Displays an individual object, including a transformation that now varies
     * for each object drawn.
     */
    let drawObject = (object) => {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        let currentMatrix = new Matrix();

        let translate = Matrix.translate(
                object.translate.tx,
                object.translate.ty,
                object.translate.tz
            );

        let rotate = Matrix.rotate(
                currentRotation,
                object.axis.x,
                object.axis.y,
                object.axis.z
            );

        let scale = Matrix.scale(
              object.scale.sx,
              object.scale.sy,
              object.scale.sz
            );


        let transformed = currentMatrix.multiply(translate).multiply(scale);
        let rotated = transformed.multiply(rotate);


        console.log("currentMatrix", currentMatrix);
        console.log("rotate", currentMatrix.multiply(rotate));
        console.log("translate", currentMatrix.multiply(translate));
        console.log("scale", currentMatrix.multiply(scale));

        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(transformed.conversion()));
        gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(rotated.conversion()));

        // simply draws the shapes
        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(new Matrix().conversion()));

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);

    };

    /*
     * Displays the scene.
     */
    let drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        objectsToDraw.forEach(drawObject);

        // All done.
        gl.flush();
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

    /*
     * Animates the scene.
     */
    let animationActive = false;
    let currentRotation = 0.0;
    let previousTimestamp = null;

    const FRAMES_PER_SECOND = 60;
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND;

    const DEGREES_PER_MILLISECOND = 0.033;
    const FULL_CIRCLE = 360.0;

    let advanceScene = (timestamp) => {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < MILLISECONDS_PER_FRAME) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene();
        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(() => {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

})(document.getElementById("matrices-webgl"));
